"""Tests for the v3 behaviours: panels, coarse kinds, risk, OCR cache, dedupe, access commands, verify, LLM cache. Invented fixtures only."""
import hashlib
import json
import sqlite3
import tempfile
import unittest
from pathlib import Path
from unittest import mock

import numpy as np

import helpers
import common as C
import panels as PN
import pages as P
import webtoon as W
import access
import llm


def white(w=700, h=1000):
    return np.full((h, w), 255, np.uint8)


class PanelCuts(unittest.TestCase):
    def test_grid_is_cut_and_ordered_right_to_left(self):
        g = white()
        for (x0, y0, x1, y1) in [(40, 40, 330, 470), (370, 40, 660, 470), (40, 520, 330, 960), (370, 520, 660, 960)]:
            g[y0:y1, x0:x1] = 120
        r = PN.xy_cut(g)
        self.assertEqual(len(r), 4)
        self.assertEqual([p[:2] for p in r], [(370, 40), (40, 40), (370, 520), (40, 520)])   # top row first, right panel first

    def test_stepped_layout_and_full_bleed(self):
        g = white()
        g[40:960, 40:660] = 120
        self.assertEqual(len(PN.xy_cut(g)), 1)                   # no gutter: one panel
        g[480:520, :] = 255                                      # one horizontal gutter
        self.assertEqual(len(PN.xy_cut(g)), 2)

    def test_assign_nearest(self):
        rects = [(0, 0, 100, 100), (200, 0, 300, 100)]
        self.assertEqual(PN.assign((50, 50), rects), (0, True))
        self.assertEqual(PN.assign((150, 50), rects)[1], False)


class Kinds(unittest.TestCase):
    def item(self, text, outside=False, in_balloon=False, conf=1.0, y=100):
        return {"box": [0, y, 100, y + 40], "outside": outside, "in_balloon": in_balloon, "lines": [{"conf": conf, "text": text}]}

    def test_coarse_kinds(self):
        k = P.coarse_kind
        self.assertEqual(k(self.item("HELLO THERE FRIEND", in_balloon=True), "HELLO THERE FRIEND", "text_free", 1600), "speech")
        self.assertEqual(k(self.item("HEY"), "HEY", "text_bubble", 1600), "speech")
        self.assertEqual(k(self.item("BOOM"), "BOOM", "text_free", 1600), "sfx")
        self.assertEqual(k(self.item("SCHOOL FIRST-YEAR MEGUMI FUSHIGURO"), "SCHOOL FIRST-YEAR MEGUMI FUSHIGURO", "text_free", 1600), "caption")
        self.assertEqual(k(self.item("174", outside=True, y=1500), "174", None, 1600), "page_number")
        self.assertEqual(k(self.item("GRR AAA", conf=0.5), "GRR AAA", "text_free", 1600), "sfx")
        self.assertEqual(k(self.item(""), "", "text_free", 1600), "unknown")


class Risk(unittest.TestCase):
    def test_garbled_text_ranks_above_clean_text(self):
        clean, _ = C.item_risk("WHO ARE THOSE PEOPLE?", [1.0])
        garbled, _ = C.item_risk("WH0 AR3 THOZE PE0PLE?", [1.0])
        symbols, _ = C.item_risk("мими", [0.3])
        self.assertLess(clean, 0.1)
        self.assertGreater(garbled, clean + 0.2)
        self.assertGreater(symbols, 0.5)
        self.assertGreater(C.item_risk("clean words here", [0.5])[0], C.item_risk("clean words here", [1.0])[0])

    def test_series_vocabulary_and_dropped_apostrophes(self):
        unknown, _ = C.item_risk("SUKUNA IS HERE", [1.0])
        known, _ = C.item_risk("SUKUNA IS HERE", [1.0], {"sukuna"})
        self.assertLess(known, unknown)
        self.assertGreater(C.item_risk("YOULL SEE", [1.0])[0], C.item_risk("YOU'LL SEE", [1.0])[0])
        self.assertEqual(C.item_risk("", [])[0], 0.0)


class OcrCache(unittest.TestCase):
    def test_second_read_and_interrupted_resume_use_the_cache(self):
        from PIL import Image
        with tempfile.TemporaryDirectory() as d:
            imgs = []
            for i in range(3):
                p = Path(d) / f"s{i}.png"
                Image.fromarray(np.full((20, 20, 3), 10 * i, np.uint8)).save(p)
                imgs.append(p)
            calls = []

            def fake_run(cmd, **kw):
                calls.append(cmd[1:])
                out = "\n".join(json.dumps({"file": Path(c).name, "obs": [], "sec": 0, "revision": 3}) for c in cmd[1:])
                return mock.Mock(stdout=out, returncode=0)

            with mock.patch.object(C, "ensure_bin"), mock.patch.object(C.subprocess, "run", fake_run):
                C.ocr_images(imgs[:2])                       # "interrupted" after two strips
                self.assertEqual(sum(len(c) for c in calls), 2)
                res = C.ocr_images(imgs)                     # resume: only the third is read
                self.assertEqual(sum(len(c) for c in calls), 3)
                self.assertEqual(sorted(res), ["s0.png", "s1.png", "s2.png"])
                C.ocr_images(imgs)                           # nothing left to read
                self.assertEqual(sum(len(c) for c in calls), 3)


class Dedupe(unittest.TestCase):
    def line(self, text, x, y, edge):
        return {"text": text, "conf": 1.0, "box": [x, y, x + 200, y + 40], "edge": edge}

    def test_overlap_duplicates_removed_by_box_or_text(self):
        ls = sorted([self.line("THE SAME WORDS", 100, 2000, 300), self.line("THE SAME WORDS", 110, 2030, 50),
                     self.line("OTHER LINE", 100, 2100, 40), self.line("THE SAME WORDS", 100, 5000, 10)], key=lambda l: -l["edge"])
        kept = W.dedupe_lines(ls)
        texts = [l["text"] for l in kept]
        self.assertEqual(texts.count("THE SAME WORDS"), 2)       # one at y 2000, a genuine repeat far away
        self.assertIn("OTHER LINE", texts)


def make_library(n_pages=2):
    """One synthetic catalogue chapter with a real CBZ; returns (hash, metadata)."""
    root = Path(C.LIB.parent)
    C.LIB.mkdir(parents=True, exist_ok=True)
    imgs = [np.full((300, 200, 3), 40 * i + 30, np.uint8) for i in range(n_pages)]
    tmp = root / "x.cbz"
    meta = helpers.make_cbz(tmp, imgs)
    digest = hashlib.sha256(tmp.read_bytes()).hexdigest()
    (C.LIB / digest).mkdir(exist_ok=True)
    tmp.rename(C.LIB / digest / "source.cbz")
    meta["title"] = "Access Series / Chapter 4"
    con = sqlite3.connect(C.CAT)
    con.execute("create table if not exists assets(hash text primary key, metadata text)")
    con.execute("insert or replace into assets values(?,?)", (digest, json.dumps(meta)))
    con.commit()
    con.close()
    return digest, meta


class AccessCommands(unittest.TestCase):
    def setUp(self):
        self.digest, self.meta = make_library()
        head = {"record": "header", "schema": 3, "cbz_sha256": self.digest, "series": "Access Series", "chapter": "4", "format": "manga",
                "page_count": 2, "created_utc": "2026-01-01T00:00:00Z", "tools": {"tool": "stage1-0.3"}, "stats": {"items": 3}}
        recs = [{"record": "page", "page": p + 1, "page_member": m["member"], "page_sha256": m["sha256"]}
                for p, m in enumerate(self.meta["page_members"])]
        for i, (text, kind, risk, flags) in enumerate([("the quiet dragon sleeps", "speech", 0.05, []), ("BOOM", "sfx", 0.0, []),
                                                       ("dr4g0n w@kes", "speech", 0.8, ["high_risk"])], 1):
            recs.append({"record": "item", "series": "Access Series", "chapter": "4", "format": "manga", "page": 1 if i < 3 else 2,
                         "group_id": f"p001--g0{i}", "reading_order": i, "kind": kind, "text": text, "bbox": [0, 0, 5, 5], "risk": risk,
                         "flags": flags, "confidence": 1.0, "panel": 1})
        d = C.chapter_dir("Access Series", "4")
        d.mkdir(parents=True, exist_ok=True)
        (d / "chapter.jsonl").write_text("\n".join(json.dumps(r) for r in [head] + recs) + "\n")
        con = C.db()
        with con:
            C.index_records(con, head, recs, d.relative_to(C.PRIVATE))
        con.close()

    def test_summary_is_counts_and_locators_only(self):
        s = access.summary("Access Series")["series"]["Access Series"]
        self.assertEqual(s["items"], 3)
        self.assertEqual(s["kinds"], {"speech": 2, "sfx": 1})
        self.assertEqual(s["high_risk"], 1)
        self.assertEqual(s["riskiest"][0]["id"], "p001--g03")
        self.assertNotIn("text", json.dumps(s))

    def test_query_returns_locators_and_text_only_on_request(self):
        q = access.query("dragon", "Access Series")
        self.assertEqual(q["total"], 1)
        self.assertNotIn("snippet", q["hits"][0])
        q2 = access.query("dragon", "Access Series", snippet=8)
        self.assertLessEqual(len(q2["hits"][0]["snippet"]), 8)
        self.assertEqual(access.query("dr4g0n", "Access Series")["total"], 1)

    def test_slice_is_bounded(self):
        full = access.slice_page("Access Series", "4", 1, 1500)
        self.assertFalse(full["truncated"])
        short = access.slice_page("Access Series", "4", 1, 30)
        self.assertTrue(short["truncated"])
        self.assertLessEqual(short["chars"], 30)

    def test_export_markdown_and_verify(self):
        self.assertEqual(access.export_markdown("Access Series"), ["Access_Series/ch0004"])
        md = (C.chapter_dir("Access Series", "4") / "chapter.md").read_text()
        self.assertIn("## Page 1", md)
        self.assertIn("**speech p1**", md)
        self.assertEqual(access.verify("Access Series")["problems"], [])
        # tamper with the catalogue's expected hash: verify must notice
        con = sqlite3.connect(C.CAT)
        meta = dict(self.meta)
        meta["page_members"] = [dict(m) for m in meta["page_members"]]
        meta["page_members"][0]["sha256"] = "0" * 64
        con.execute("update assets set metadata=? where hash=?", (json.dumps(meta), self.digest))
        con.commit()
        con.close()
        problems = access.verify("Access Series")["problems"]
        self.assertTrue(problems)
        con = sqlite3.connect(C.CAT)
        con.execute("update assets set metadata=? where hash=?", (json.dumps(self.meta), self.digest))
        con.commit()
        con.close()


class LlmCache(unittest.TestCase):
    def test_same_page_model_prompt_is_read_once(self):
        digest, meta = make_library()
        head = {"cbz_sha256": digest, "format": "manga"}
        calls = []

        def fake(model, prompt, png):
            calls.append(model)
            return "ok-" + model

        t1, c1 = llm.read_page(head, 1, "m1", "page-json-v1", fake)
        t2, c2 = llm.read_page(head, 1, "m1", "page-json-v1", fake)
        self.assertEqual((c1, c2, len(calls)), (False, True, 1))
        llm.read_page(head, 1, "m2", "page-json-v1", fake)           # another model: a new read
        llm.read_page(head, 2, "m1", "page-json-v1", fake)           # another page: a new read
        llm.read_page(head, 1, "m1", "visual-notes-v1", fake)        # another prompt: a new read
        self.assertEqual(len(calls), 4)
        with self.assertRaises(ValueError):
            llm.read_page(head, 1, "m1", "unknown-prompt", fake)

    def test_only_loopback_endpoint(self):
        with self.assertRaises(ValueError):
            llm.ollama_transport("m", "p", b"x", endpoint="http://example.com/api/chat")


class Versions(unittest.TestCase):
    def test_schema_and_tool_versions(self):
        self.assertEqual(C.SCHEMA_VERSION, 3)
        self.assertEqual(P.versions()["schema"], 3)
        self.assertTrue(P.PAGES_VERSION.startswith("stage1-0.3"))
        self.assertTrue(W.versions(W.load_profiles()["default"])["tool"].startswith("webtoon-0.9"))


if __name__ == "__main__":
    unittest.main()
