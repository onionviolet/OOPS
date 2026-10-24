"""Chip pass (reversed label text) and book versions. Invented images only."""
import unittest

import helpers  # noqa: F401
import numpy as np
from PIL import Image, ImageDraw, ImageFont

import books
import chips as CH


def page_with_chip(chip=True, solid=False):
    im = Image.new("RGB", (1200, 1600), "white")
    d = ImageDraw.Draw(im)
    if chip:
        d.rectangle((100, 200, 230, 240), fill="black")
        d.text((110, 202), "RANK", fill="white", font=ImageFont.load_default(size=32))
    if solid:
        d.rectangle((100, 400, 260, 440), fill="black")
    d.text((300, 200), "body text on the page", fill="black", font=ImageFont.load_default(size=32))
    return np.asarray(im)[:, :, ::-1].copy()


class Chips(unittest.TestCase):
    def test_finds_label_chip_not_text_or_solid_patch(self):
        found = CH.find_chips(page_with_chip(chip=True, solid=True))
        self.assertEqual(len(found), 1)
        x, y, w, h = found[0]
        self.assertTrue(95 <= x <= 105 and 195 <= y <= 205 and 125 <= w <= 140 and 38 <= h <= 46)
        self.assertEqual(CH.find_chips(page_with_chip(chip=False)), [])

    def test_crop_is_inverted_dark_on_light_and_enlarged(self):
        im = page_with_chip()
        box = CH.find_chips(im)[0]
        c = CH.crop_for_ocr(im, box)
        self.assertGreater(c.shape[0], box[3] * CH.SCALE)
        self.assertGreater(c.mean(), 180)                      # mostly white border and background after inversion
        self.assertLess(c.min(), 60)                           # the glyphs are dark now

    def test_add_missing_skips_chip_already_read(self):
        lines = [{"text": "RANK A", "conf": 1.0, "box": [95, 195, 400, 245]}]
        boxes = [(100, 200, 130, 40), (100, 300, 130, 40)]
        out = CH.add_missing(lines, boxes, [("RANK", 1.0), ("TYPE", 0.5)])
        self.assertEqual([l["text"] for l in out], ["RANK A", "TYPE"])
        self.assertEqual(out[-1]["source"], "chip_pass")

    def test_empty_chip_text_adds_nothing(self):
        self.assertEqual(CH.add_missing([], [(0, 0, 40, 20)], [("", 0.0)]), [])


class Versions(unittest.TestCase):
    prof = {"name": "databook"}

    def test_only_japanese_runs_change_version(self):
        import webtoon
        prof = webtoon.load_profiles()["databook"]
        en = books.versions(["en-US"], "auto", prof)
        ja = books.versions(["ja-JP", "en-US"], "auto", prof)
        self.assertEqual(en["tool"], "books-0.2")
        self.assertTrue(ja["tool"].startswith("books-0.3+chips-"))


if __name__ == "__main__":
    unittest.main()
