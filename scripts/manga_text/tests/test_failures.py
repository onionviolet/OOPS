"""Failure ledger, OCR batch fallback and coverage command. Invented data only."""
import subprocess
import unittest
from pathlib import Path
from unittest import mock

import helpers  # noqa: F401  (sets temp env before common is imported)
import common as C
import failures as F


class Classify(unittest.TestCase):
    def test_classes(self):
        cases = {
            "cannot open (damaged or truncated PDF: no page tree or trailer)": ("corrupt_source", False),
            "CalledProcessError: Command '[...]' died with <Signals.SIGKILL: 9>.": ("killed_memory", True),
            "cbz not on disk": ("missing_source", False),
            "unsupported file type .mobi": ("kind_mismatch", False),
            "ocr_failed on 2 of 20 images (ocr_timeout)": ("timeout", True),
            "CalledProcessError: Command '[avision]' returned non-zero exit status 1.": ("vision_failure", True),
            "page member sha256 differs from catalogue": ("hash_mismatch", False),
            "OSError: cannot identify image file": ("corrupt_source", False),
            "weird": ("other", True),
        }
        for text, (cls, retry) in cases.items():
            got = F.classify(text)
            self.assertEqual((got[0], got[1]), (cls, retry), text)

    def test_reason_is_short(self):
        long = "CalledProcessError: Command '" + str(["/a/b/c/%05d.png" % i for i in range(400)]) + "' died with <Signals.SIGKILL: 9>."
        self.assertLess(len(F.classify(long)[2]), 241)


class Ledger(unittest.TestCase):
    def setUp(self):
        C.RUNS.mkdir(parents=True, exist_ok=True)
        if F.LEDGER.exists():
            F.LEDGER.unlink()

    def test_transient_retries_once_then_stops(self):
        d = {}
        self.assertTrue(F.should_attempt("k", "s1", "t1", d))
        e = F.record_failure("k", "T", "died with SIGKILL", "s1", "t1", d)
        self.assertFalse(e["final"])
        self.assertTrue(F.should_attempt("k", "s1", "t1", d))          # one retry
        e = F.record_failure("k", "T", "died with SIGKILL", "s1", "t1", d)
        self.assertTrue(e["final"])
        self.assertFalse(F.should_attempt("k", "s1", "t1", d))         # never a third time

    def test_permanent_is_final_at_once(self):
        d = {}
        e = F.record_failure("k", "T", "damaged or truncated PDF", "s1", "t1", d)
        self.assertTrue(e["final"] and e["attempts"] == 1)
        self.assertFalse(F.should_attempt("k", "s1", "t1", d))

    def test_new_file_or_new_tools_reset(self):
        d = {}
        F.record_failure("k", "T", "damaged", "s1", "t1", d)
        self.assertTrue(F.should_attempt("k", "s2", "t1", d))          # replaced download
        self.assertTrue(F.should_attempt("k", "s1", "t2", d))          # pipeline changed
        e = F.record_failure("k", "T", "SIGKILL", "s2", "t1", d)
        self.assertEqual(e["attempts"], 1)

    def test_persists_across_restart(self):
        F.record_failure("k", "T", "damaged", "s1", "t1")
        self.assertFalse(F.should_attempt("k", "s1", "t1"))
        F.clear("k")
        self.assertTrue(F.should_attempt("k", "s1", "t1"))

    def test_source_id_follows_file_change(self):
        p = Path(C.PRIVATE) / "x.bin"
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(b"a")
        a = F.source_id(p)
        p.write_bytes(b"abc")
        self.assertNotEqual(a, F.source_id(p))
        self.assertEqual(F.source_id(p.with_name("none")), "gone")


class OcrFallback(unittest.TestCase):
    def test_killed_batch_falls_back_to_single_images(self):
        import json
        from PIL import Image
        d = Path(C.PRIVATE) / "fb"
        d.mkdir(parents=True, exist_ok=True)
        files = []
        for i, c in enumerate((10, 20, 30)):
            f = d / f"{i}.png"
            Image.new("RGB", (8, 8), (c, c, c)).save(f)
            files.append(str(f))
        calls = []

        def fake_run(cmd, **kw):
            names = [Path(x).name for x in cmd[1:] if x.endswith(".png")]
            calls.append(names)
            if len(names) > 1 or names == ["1.png"]:                    # batch killed; image 1 fails alone too
                raise subprocess.CalledProcessError(-9, cmd)
            return subprocess.CompletedProcess(cmd, 0, stdout=json.dumps({"file": names[0], "obs": []}) + "\n", stderr="")

        with mock.patch.object(C, "ensure_bin"), mock.patch.object(C.subprocess, "run", fake_run):
            res = C.ocr_images(files, use_cache=False)
        self.assertEqual(set(res), {"0.png", "1.png", "2.png"})
        self.assertNotIn("error", res["0.png"])
        self.assertTrue(res["1.png"]["error"].startswith("ocr_failed signal 9"))
        self.assertEqual(C.ocr_failures(res), ["1.png"])
        self.assertIn("1 of 3", C.ocr_failure_message(res))
        self.assertEqual(F.classify(C.ocr_failure_message(res))[0], "vision_failure")


class Coverage(unittest.TestCase):
    def test_rows_count_missing_and_errors(self):
        import manga_text as M
        con = C.db()
        with con:
            con.execute("insert into chapters(cbz_sha256, series, chapter, format) values('aa','Cov Series','1','manga')")
        con.close()
        rows = [("aa", {"title": "Cov Series / Chapter 1"}), ("bb", {"title": "Cov Series / Chapter 2"}),
                ("cc", {"title": "Cov Series / Chapter 3"})]
        F.record_failure("cc", "Cov Series / Chapter 3", "damaged", "cc", "t")
        with mock.patch.object(C, "cat_rows", lambda con=None: iter(rows)), \
                mock.patch.object(C, "cbz_path", lambda h: Path(__file__)), \
                mock.patch("books.queue_entries", lambda: []):
            out = [r for r in M.coverage_rows() if r[0] == "Cov Series"]
        self.assertEqual(out, [("Cov Series", 3, 1, 2, 1)])


if __name__ == "__main__":
    unittest.main()
