import tempfile
import unittest
from pathlib import Path

import helpers
import common as C
import pages as P


def obs(text, x0, y0, x1, y1, W, H, conf=1.0):
    """Apple-style normalised box (origin bottom-left) from pixel box."""
    return {"text": text, "conf": conf, "bbox": [x0 / W, 1 - y1 / H, (x1 - x0) / W, (y1 - y0) / H]}


class Grouping(unittest.TestCase):
    def test_lines_group_into_boxes_and_outside_lines_stay_single(self):
        W, H = 1000, 1600
        u = {"w": W, "h": H}
        dets = [{"label": "text_bubble", "score": 0.9, "box": [100, 100, 400, 300]},
                {"label": "bubble", "score": 0.9, "box": [90, 90, 410, 310]},
                {"label": "text_free", "score": 0.8, "box": [600, 100, 900, 200]}]
        vis = {"obs": [obs("HELLO", 150, 120, 300, 160, W, H), obs("THERE", 150, 170, 300, 210, W, H),
                       obs("BOOM", 650, 120, 850, 180, W, H), obs("12", 480, 1500, 520, 1540, W, H)]}
        items, rects = P.build_unit_items(u, vis, dets)
        self.assertEqual(rects, [])                                    # no image given: no panel cuts
        texts = [" ".join(l["text"] for l in it["lines"]) for it in items]
        self.assertIn("HELLO THERE", texts)
        self.assertIn("BOOM", texts)
        outside = [it for it in items if it["outside"]]
        self.assertEqual(len(outside), 1)
        self.assertEqual(outside[0]["lines"][0]["text"], "12")

    def test_reading_order_two_columns_right_to_left(self):
        boxes = [{"box": [100, 100, 300, 200]}, {"box": [600, 120, 800, 220]}, {"box": [100, 700, 300, 800]}, {"box": [600, 690, 800, 790]}]
        order = P.order_items(boxes, 1600, "overlap")
        self.assertEqual([b["box"][:2] for b in order], [[600, 120], [100, 100], [600, 690], [100, 700]])
        band = P.order_items(boxes, 1600, "band")
        self.assertEqual([b["box"][:2] for b in band][:2], [[600, 120], [100, 100]])

    def test_spread_is_split_right_half_first(self):
        with tempfile.TemporaryDirectory() as d:
            d = Path(d)
            meta = helpers.make_cbz(d / "c.cbz", [helpers.canvas(500, 700), helpers.canvas(1100, 700, (30, 30, 30))])
            pages, problems = P.load_pages("x", meta, d, d / "c.cbz")
            self.assertEqual(problems, [])
            self.assertEqual([u["half"] for u in pages[1]["units"]], ["right", "left"])
            self.assertEqual(pages[1]["units"][0]["x_off"], 550)
            self.assertEqual([u["half"] for u in pages[0]["units"]], [None])


if __name__ == "__main__":
    unittest.main()
