import tempfile
import unittest
from pathlib import Path

import cv2
import numpy as np

import helpers
import common as C
import webtoon as W


class Geometry(unittest.TestCase):
    def test_strip_ranges_cover_canvas_with_overlap(self):
        rs = W.strip_ranges(5000, 2400, 400)
        self.assertEqual(rs[0][1:], (0, 2400))
        self.assertEqual(rs[1][1], 2000)
        self.assertEqual(rs[-1][2], 5000)
        for (_, a0, a1), (_, b0, b1) in zip(rs, rs[1:]):
            self.assertEqual(a1 - b0, 400)
        self.assertEqual(len(W.strip_ranges(2000, 2400, 400)), 1)

    def test_owning_strip(self):
        self.assertEqual(W.owning_strip(100, 300, 9000), 0)
        self.assertEqual(W.owning_strip(2100, 2300, 9000), 0)       # inside overlap: first strip that contains it
        self.assertEqual(W.owning_strip(2300, 2600, 9000), 1)       # straddles strip 0's end
        self.assertEqual(W.owning_strip(5000, 5100, 9000), 2)

    def test_build_canvas_stacks_rescales_and_checks_hashes(self):
        with tempfile.TemporaryDirectory() as d:
            cbz = Path(d) / "c.cbz"
            meta = helpers.make_cbz(cbz, [helpers.canvas(800, 1000, (10, 10, 10)), helpers.canvas(800, 500, (200, 0, 0)),
                                          helpers.canvas(400, 100, (0, 0, 200))])
            cv, slices, problems = W.build_canvas("x", meta, cbz)
            self.assertEqual(problems, [])
            self.assertEqual(cv.shape[1], 800)
            self.assertEqual(slices[2]["scale"], 2.0)
            self.assertEqual(cv.shape[0], 1000 + 500 + 200)
            self.assertEqual([s["y0"] for s in slices], [0, 1000, 1500])
            self.assertEqual(W.slices_for(slices, 900, 1100), ["00001.png", "00002.png"])
            meta["page_members"][1]["sha256"] = "bad"
            self.assertTrue(W.build_canvas("x", meta, cbz)[2])


def draw_fixture():
    """Invented 'window' styles on a dark page, plus distractors that must not be found."""
    c = helpers.canvas(800, 3000, (0, 0, 0))
    # A: black box with thin white frame and bright text-like bars (on a mid-grey patch)
    cv2.rectangle(c, (60, 150), (760, 400), (90, 90, 90), -1)
    cv2.rectangle(c, (100, 180), (720, 370), (0, 0, 0), -1)
    cv2.rectangle(c, (100, 180), (720, 370), (255, 255, 255), 3)
    cv2.putText(c, "TEST BOX", (200, 300), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 4)
    # B: hexagon outline, dark interior
    pts = np.array([[150, 800], [300, 700], [550, 700], [700, 800], [550, 900], [300, 900]], np.int32)
    cv2.polylines(c, [pts], True, (255, 255, 255), 4)
    cv2.putText(c, "HEX", (330, 820), cv2.FONT_HERSHEY_SIMPLEX, 2, (80, 80, 255), 4)
    # C: filled cyan window
    cv2.rectangle(c, (100, 1200), (700, 1800), (255, 180, 40), -1)
    cv2.putText(c, "CARD", (250, 1500), cv2.FONT_HERSHEY_SIMPLEX, 3, (255, 255, 255), 6)
    # D: white speech bubble (distractor)
    cv2.ellipse(c, (400, 2200), (250, 120), 0, 0, 360, (255, 255, 255), -1)
    # E: noisy art block (distractor)
    rng = np.random.default_rng(1)
    c[2500:2900, 100:700] = rng.integers(0, 255, (400, 600, 3), dtype=np.uint8)
    return c


def hit(cands, x0, y0, x1, y1, tol=40):
    for cd in cands:
        b = cd["box"]
        if abs(b[0] - x0) <= tol and abs(b[1] - y0) <= tol and abs(b[2] - x1) <= tol and abs(b[3] - y1) <= tol:
            return cd
    return None


class Panels(unittest.TestCase):
    def setUp(self):
        self.profile = W.load_profiles()["default"]
        self.cands = W.find_panels(draw_fixture(), self.profile)

    def test_finds_framed_hexagon_and_cyan_windows(self):
        self.assertIsNotNone(hit(self.cands, 100, 180, 720, 370), self.cands)
        self.assertIsNotNone(hit(self.cands, 150, 700, 700, 900), self.cands)
        self.assertIsNotNone(hit(self.cands, 100, 1200, 700, 1800), self.cands)

    def test_ignores_bubble_and_noise(self):
        for cd in self.cands:
            b = cd["box"]
            self.assertFalse(b[1] > 2000 and b[3] < 3000, cd)

    def test_finders_can_be_disabled_by_profile(self):
        p = W.load_profiles()["default"]
        p["finders"]["color_window"]["enabled"] = False
        p["finders"]["outline"]["enabled"] = False
        cands = W.find_panels(draw_fixture(), p)
        self.assertIsNone(hit(cands, 100, 1200, 700, 1800))
        self.assertIsNone(hit(cands, 150, 700, 700, 900))

    def test_threshold_override_changes_result(self):
        p = W.load_profiles()["default"]
        p["finders"]["color_window"]["min_w"] = 700           # card is 600 wide
        self.assertIsNone(hit(W.find_panels(draw_fixture(), p), 100, 1200, 700, 1800))


def line(text, x0, y0, x1, y1, conf=1.0):
    return {"text": text, "conf": conf, "box": [x0, y0, x1, y1]}


class KeyValuesAndClassify(unittest.TestCase):
    def test_key_values_shapes(self):
        rows = W.rows_from([line("Type: Main", 10, 100, 200, 130), line("Reward. 300 Coins", 10, 140, 250, 170),
                            line("Time Limit: 30 Minutes", 10, 180, 300, 210), line("Strength", 10, 220, 90, 250),
                            line("12", 400, 220, 430, 250), line("Lv. 5 Knight", 10, 260, 150, 290)])
        kv = W.key_values(rows, 500)
        keys = {e["key"]: (e["value"], e["how"]) for e in kv}
        self.assertEqual(keys["Type"], ("Main", "colon"))
        self.assertEqual(keys["Reward"][1], "misread_separator")
        self.assertEqual(keys["Strength"], ("12", "columns"))
        self.assertEqual(len(kv), 4)

    def test_misread_separator_needs_two_clean_rows(self):
        rows = W.rows_from([line("Reward. 300 Coins", 10, 140, 250, 170)])
        self.assertEqual(W.key_values(rows, 500), [])

    def test_classification_follows_profile(self):
        profs = W.load_profiles()
        d, orv = profs["default"], profs["omniscient_reader"]
        self.assertEqual(W.classify(d, "23:19", "white", "plain", "rectangle", "color_window", 0), "timer_window")
        self.assertEqual(W.classify(d, "Status of the hero", "white", "plain", "rectangle", "frame", 0), "status_window")
        self.assertEqual(W.classify(d, "hello there", "red", "jagged", "rectangle", "black_fill", 0), "system_notice")
        self.assertEqual(W.classify(d, "hello there", "red", "plain", "polygon", "outline", 0), "hexagon_message")
        self.assertEqual(W.classify(d, "hello there", "white", "plain", "rectangle", "frame", 0), "narration_caption")
        self.assertEqual(W.classify(d, "something", "blue", "plain", "rectangle", "color_window", 4), "info_card")
        self.assertEqual(W.classify(orv, "Reward: 10", "blue", "plain", "rectangle", "color_window", 1), "scenario_card")
        self.assertEqual(W.classify(orv, "Knife Fighting Lv.1", "blue", "plain", "rectangle", "color_window", 0), "skill_card")
        self.assertEqual(W.classify(d, "odd", "green", "plain", "rectangle", "frame", 0), "other_window")


class Profiles(unittest.TestCase):
    def test_extends_default_and_matches_series(self):
        profs = W.load_profiles()
        self.assertEqual(W.profile_for("Omniscient Reader", profs)["name"], "omniscient_reader")
        self.assertEqual(W.profile_for("Unknown Series", profs)["name"], "default")
        self.assertEqual(profs["omniscient_reader"]["finders"]["outline"]["min_w"], profs["default"]["finders"]["outline"]["min_w"])

    def test_new_profile_dir_without_code_changes(self):
        import json
        with tempfile.TemporaryDirectory() as d:
            default = (W.PROFILE_DIR / "default.json").read_text()
            Path(d, "default.json").write_text(default)
            Path(d, "mine.json").write_text(json.dumps({
                "name": "mine", "series": ["My Manhwa"], "finders": {"color_window": {"hue_min": 20, "hue_max": 30}},
                "classify": {"rules": [{"text_regex": "gold", "type": "reward_popup"}], "fallback": "other_window"}}))
            profs = W.load_profiles(d)
            p = W.profile_for("My Manhwa", profs)
            self.assertEqual(p["finders"]["color_window"]["hue_min"], 20)
            self.assertEqual(p["finders"]["color_window"]["min_sat"], 90)       # inherited
            self.assertEqual(W.classify(p, "100 gold", "white", "plain", "rectangle", "frame", 0), "reward_popup")
            self.assertNotEqual(W.profile_hash(p), W.profile_hash(profs["default"]))


if __name__ == "__main__":
    unittest.main()
