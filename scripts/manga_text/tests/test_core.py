import unittest
import helpers  # noqa: F401
import common as C


class TitleAndLayout(unittest.TestCase):
    def test_parse_title(self):
        self.assertEqual(C.parse_title("Some Series / Chapter 12.5"), ("Some Series", "12.5", 12.5))
        self.assertEqual(C.parse_title("Some Series / Chapter 3")[1:], ("3", 3.0))
        s, label, num = C.parse_title("Some Series / Official Guide")
        self.assertEqual((s, label, num), ("Some Series", "Official Guide", None))
        self.assertEqual(C.parse_title("Lonely Title")[0], "Lonely Title")

    def test_chapter_dir_names_are_stable_and_sortable(self):
        self.assertEqual(C.chapter_dir_name("1"), "ch0001")
        self.assertEqual(C.chapter_dir_name("129.5"), "ch0129.5")
        self.assertEqual(C.chapter_dir_name("Official Guide"), "x-official_guide")
        self.assertTrue(C.chapter_dir_name("9") < C.chapter_dir_name("10"))

    def test_slug(self):
        self.assertEqual(C.slug("Omniscient Reader's Viewpoint"), "Omniscient_Reader_s_Viewpoint")


class FormatDetection(unittest.TestCase):
    def test_continuity_decides(self):
        sizes = [(800, 1500)] * 60
        self.assertEqual(C.detect_format(sizes, 0.3), "webtoon")
        self.assertEqual(C.detect_format(sizes, 0.1), "manga")             # weak evidence, uniform heights: manga pages
        varied = [(800, h) for h in (1500, 1500, 700, 1500, 300, 1500, 1500, 900, 1500, 1500)] * 5
        self.assertEqual(C.detect_format(varied, 0.1), "webtoon")          # >= 0.08, 40+ slices and varied heights
        self.assertEqual(C.detect_format([(800, 1500)] * 20, 0.1), "manga")  # short chapter, weak evidence
        self.assertEqual(C.detect_format([(1067, 1600)] * 20, 0.0), "manga")

    def test_shape_fallback(self):
        mixed = [(800, h) for h in (1500, 300, 1500, 80, 1500, 900, 40, 1500, 700, 1500)]
        self.assertEqual(C.detect_format(mixed), "webtoon")
        self.assertEqual(C.detect_format([(1067, 1600)] * 20 + [(2133, 1600)] * 2), "manga")
        self.assertEqual(C.detect_format([]), "manga")


class OsUpdates(unittest.TestCase):
    def test_macos_build_change_does_not_invalidate_a_chapter(self):
        tools = {"tool": "stage1-0.3", "ocr": "apple-vision accurate en-US macOS-build-26B5101f", "detector": "d@1"}
        newer = dict(tools, ocr="apple-vision accurate en-US macOS-build-26C1000a")
        self.assertEqual(C._without_build(tools), C._without_build(newer))
        self.assertNotEqual(C._without_build(tools), C._without_build(dict(tools, tool="stage1-0.4")))
        self.assertNotEqual(C._without_build(tools), C._without_build(dict(tools, detector="d@2")))


class IndexAndSearch(unittest.TestCase):
    def setUp(self):
        C.PRIVATE.mkdir(parents=True, exist_ok=True)
        if (C.PRIVATE / "index.sqlite").exists():
            (C.PRIVATE / "index.sqlite").unlink()

    def _records(self, series, chapter, fmt, items):
        head = {"cbz_sha256": "h" + series[0] + chapter, "series": series, "chapter": chapter, "format": fmt, "page_count": 5,
                "tools": {"tool": "t"}, "created_utc": "2026-01-01T00:00:00Z"}
        recs = []
        for i, (text, kind, loc) in enumerate(items, 1):
            r = {"record": "panel" if kind.startswith("panel") else "item", "series": series, "chapter": chapter, "format": fmt,
                 "text": text, "kind": kind, "bbox": [0, 0, 10, 10], "reading_order": i, "flags": [],
                 "panel_id" if kind.startswith("panel") else "group_id": f"g{i}", "confidence": 1.0}
            r["strip" if fmt == "webtoon" else "page"] = loc
            recs.append(r)
        return head, recs

    def test_search_filters(self):
        con = C.db()
        with con:
            for s, ch, fmt, items in [
                ("Alpha", "1", "manga", [("the dragon sleeps", "bubble", 2), ("quiet", "bubble", 3)]),
                ("Alpha", "12", "manga", [("a dragon wakes", "bubble", 7)]),
                ("Beta", "3", "webtoon", [("Reward: 300 coins", "panel_scenario_card", 9), ("dragon note", "panel_narration_caption", 4)])]:
                head, recs = self._records(s, ch, fmt, items)
                C.index_records(con, head, recs, f"{s}/ch")
        con.close()
        self.assertEqual(len(C.search("dragon")), 3)
        self.assertEqual(len(C.search("dragon", series="alpha")), 2)
        self.assertEqual(len(C.search("dragon", series="Alpha", chapter="1")), 1)
        self.assertEqual(len(C.search("dragon", series="Alpha", chapter="1-20")), 2)
        hits = C.search("coins", kind="panel_*")
        self.assertEqual(len(hits), 1)
        self.assertEqual(hits[0][3], "strip")
        self.assertEqual(len(C.search("dragon", kind="panel_narration_caption")), 1)
        self.assertEqual(C.search("absent phrase"), [])

    def test_reindex_replaces_chapter(self):
        con = C.db()
        head, recs = self._records("Alpha", "1", "manga", [("old text", "bubble", 1)])
        with con:
            C.index_records(con, head, recs, "Alpha/ch0001")
            head2, recs2 = self._records("Alpha", "1", "manga", [("new text", "bubble", 1)])
            C.index_records(con, head2, recs2, "Alpha/ch0001")
        con.close()
        self.assertEqual(C.search("old text"), [])
        self.assertEqual(len(C.search("new text")), 1)


if __name__ == "__main__":
    unittest.main()
