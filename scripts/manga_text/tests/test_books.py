"""Book mode on invented files: scanned PDF (Japanese and English), table and profile-box extraction, fixed-layout EPUB, damaged PDF,
queue parsing, verify. No real books."""
import json
import os
import shutil
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

import helpers
import common as C
import books as B
import access
import tables as TB

JA_FONT = "/System/Library/Fonts/Hiragino Sans GB.ttc"
needs_vision = unittest.skipUnless(shutil.which("swiftc") and sys.platform == "darwin" and Path(JA_FONT).exists(), "needs Apple Vision and a Japanese font")


def scan_page(table=True):
    f30 = ImageFont.truetype(JA_FONT, 30)
    im = Image.new("L", (1240, 1754), 255)
    d = ImageDraw.Draw(im)
    d.text((120, 100), "忍者データブック", font=ImageFont.truetype(JA_FONT, 40), fill=0)
    rows = [("氏名", "うずまきテスト"), ("年齢", "十二歳"), ("身長", "百四十五センチ")]
    x0, x1, xm, y = 120, 1000, 420, 240
    d.line((x0, y, x1, y), fill=0, width=3)
    for a, b in rows:
        d.text((x0 + 25, y + 22), a, font=f30, fill=0)
        d.text((xm + 25, y + 22), b, font=f30, fill=0)
        y += 90
        d.line((x0, y, x1, y), fill=0, width=3)
    for x in (x0, xm, x1):
        d.line((x, 240, x, y), fill=0, width=3)
    d.rectangle((120, 700, 1000, 1000), outline=0, width=4)
    for i, t in enumerate(["名前：テスト太郎", "階級：上忍"]):
        d.text((160, 740 + i * 95), t, font=f30, fill=0)
    arr = np.asarray(im, dtype=np.int16) + np.random.default_rng(1).integers(-10, 10, im.size[::-1])
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)).rotate(0.4, fillcolor=255).convert("RGB")


class Sources(unittest.TestCase):
    def test_language_flags_and_options(self):
        self.assertEqual(B.lang_of("忍者のテスト"), "ja")
        self.assertEqual(B.lang_of("plain english"), "en")
        self.assertEqual(B.lang_of("氏名"), "zh-or-ja")
        self.assertEqual(B.entry_options({"lang": "english"}), (["en-US"], "auto"))
        self.assertEqual(B.entry_options({"ocr": True}), (["ja-JP", "en-US"], "always"))
        self.assertEqual(B.book_title("/x/Some Book (Author) (z-library.sk, 1lib.sk, z-lib.sk).pdf"), "Some Book (Author)")

    def test_queue_accepts_lists_dicts_and_strings(self):
        with tempfile.TemporaryDirectory() as d:
            a, b = Path(d) / "a.pdf", Path(d) / "b.epub"
            a.write_bytes(b"%PDF-1.4")
            b.write_bytes(b"x")
            q = Path(d) / "q.json"
            for payload in ([str(a), {"path": str(b), "title": "B", "ocr": True}], {"items": [{"final_path": str(a)}, {"file": str(b), "language": "ja"}]},
                            [{"path": str(Path(d) / "missing.pdf")}]):
                q.write_text(json.dumps(payload))
                os.environ["MANGA_TEXT_BOOK_QUEUE"] = str(q)
                got = B.queue_entries()
                self.assertEqual(len(got), 0 if "missing" in json.dumps(payload) else 2)
            os.environ.pop("MANGA_TEXT_BOOK_QUEUE")

    def test_damaged_pdf_is_reported_not_crashed(self):
        with tempfile.TemporaryDirectory() as d:
            bad = Path(d) / "broken.pdf"
            bad.write_bytes(b"%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj\n" + b"x" * 500)
            res = B.process_book(bad)
            self.assertIn("error", res)
            self.assertIn("damaged", res["error"])


class Tables(unittest.TestCase):
    def test_ruled_grid_and_box(self):
        g = np.full((1000, 800), 255, np.uint8)
        for y in (100, 200, 300, 400):
            g[y:y + 3, 100:700] = 0
        for x in (100, 400, 700):
            g[100:403, x:x + 3] = 0
        g[600:603, 100:700] = 0
        g[800:803, 100:700] = 0
        g[600:803, 100:103] = 0
        g[600:803, 700:703] = 0
        t = TB.find_tables(g)
        self.assertEqual(len(t), 1)
        self.assertEqual((len(t[0]["xs"]), len(t[0]["ys"])), (3, 4))
        self.assertEqual(len(TB.find_boxes(g)), 1)
        rows, used = TB.cell_rows(t[0], [{"text": "A", "box": [150, 130, 200, 170]}, {"text": "B", "box": [450, 130, 500, 170]}])
        self.assertEqual(rows[0], ["A", "B"])


class Guards(unittest.TestCase):
    def test_page_border_and_empty_grids_are_not_tables(self):
        g = np.full((1000, 800), 255, np.uint8)
        g[20:23, 20:780] = 0; g[977:980, 20:780] = 0; g[20:980, 20:23] = 0; g[20:980, 777:780] = 0       # page border
        g[500:503, 20:780] = 0; g[20:980, 400:403] = 0                                                      # 2x2 panel grid, no text
        tabs = TB.find_tables(g)
        self.assertTrue(tabs)                                                    # the raw finder sees a grid ...
        page = 1000 * 800
        rows, used = TB.cell_rows(tabs[0], [])                                   # ... but with no text in the cells and page size it is rejected
        self.assertGreater(C.box_area(tabs[0]["box"]), 0.7 * page)
        self.assertEqual(sum(1 for r in rows for c in r if c.strip()), 0)


@needs_vision
class ScannedBooks(unittest.TestCase):
    def setUp(self):
        self.d = Path(tempfile.mkdtemp())
        self.pdf = self.d / "scan.pdf"
        scan_page().save(self.pdf, save_all=True, append_images=[scan_page()], resolution=150)

    def test_scanned_pdf_japanese_table_profile_and_verify(self):
        res = B.process_book(self.pdf, "Synthetic JA")
        self.assertNotIn("error", res)
        hd = res["header"]
        self.assertEqual((hd["format"], hd["page_count"], hd["stats"]["ocr_pages"]), ("book", 2, 2))
        text = " ".join(r["text"] for r in res["records"] if r["record"] == "item")
        self.assertIn("忍者データブック", text)
        tables = [r for r in res["records"] if r.get("kind") == "book_table"]
        self.assertEqual(len(tables), 2)
        kv = {k["key"]: k["value"] for k in tables[0]["key_values"]}
        self.assertEqual(kv.get("氏名"), "うずまきテスト")
        self.assertEqual(kv.get("身長"), "百四十五センチ")
        prof = {k["key"]: k["value"] for r in res["records"] if r.get("kind") == "book_profile" for k in r["key_values"]}
        self.assertEqual(prof.get("階級"), "上忍")
        langs = {r["lang"] for r in res["records"] if r["record"] in ("item", "panel")}
        self.assertTrue(langs <= {"ja", "zh-or-ja", "en", "other"}, langs)
        self.assertTrue(all(r["text_raw"] == r["text"] for r in res["records"] if r["record"] == "item"))   # nothing translated or altered
        B.write_book(res, "Synthetic JA")
        self.assertTrue(B.book_done(self.pdf, "Synthetic JA", hd["tools"]))
        self.assertEqual(access.verify("Synthetic JA")["problems"], [])
        self.pdf.write_bytes(self.pdf.read_bytes() + b"\n%changed")
        self.assertTrue(access.verify("Synthetic JA")["problems"])
        hits = C.search("忍者データ", series="Synthetic JA", loose=True)
        self.assertGreaterEqual(len(hits), 1)
        self.assertTrue(any(h[7] == "book_text" for h in hits))

    def test_fixed_layout_epub_images_are_read(self):
        epub = self.d / "fixed.epub"
        buf = __import__("io").BytesIO()
        scan_page().save(buf, "PNG")
        with zipfile.ZipFile(epub, "w") as z:
            z.writestr("mimetype", "application/epub+zip")
            z.writestr("META-INF/container.xml", '<container xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles>'
                       '<rootfile full-path="OEBPS/c.opf" media-type="application/oebps-package+xml"/></rootfiles></container>')
            z.writestr("OEBPS/c.opf", '<package xmlns="http://www.idpf.org/2007/opf"><manifest><item id="p1" href="p1.xhtml" media-type="application/xhtml+xml"/>'
                       '</manifest><spine><itemref idref="p1"/></spine></package>')
            z.writestr("OEBPS/p1.xhtml", '<html><body><img src="images/p1.png"/></body></html>')
            z.writestr("OEBPS/images/p1.png", buf.getvalue())
        res = B.process_book(epub, "Synthetic EPUB")
        self.assertNotIn("error", res)
        self.assertEqual(res["header"]["page_count"], 1)
        self.assertIn("忍者データブック", " ".join(r["text"] for r in res["records"] if r["record"] == "item"))


if __name__ == "__main__":
    unittest.main()
