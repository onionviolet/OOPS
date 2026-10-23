"""Integration test of `watch` on a synthetic library: processing, PAUSE file, STOP file, worker cap. Invented images only."""
import hashlib
import json
import os
import sqlite3
import subprocess
import sys
import tempfile
import time
import unittest
from pathlib import Path

import helpers
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent.parent
PY = sys.executable


def page(text, w=700, h=1000):
    im = Image.new("RGB", (w, h), "white")
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((100, 120, 600, 320), 40, outline="black", width=4)
    d.text((140, 190), text, fill="black", font=ImageFont.load_default(size=40))
    import numpy as np
    return np.asarray(im)


def add_chapter(root, con, n):
    imgs = [page(f"HELLO CHAPTER {n} PAGE {i}") for i in (1, 2)]
    tmpmeta = helpers.make_cbz(root / "tmp.cbz", imgs)
    digest = hashlib.sha256((root / "tmp.cbz").read_bytes()).hexdigest()
    (root / "library" / digest).mkdir(parents=True)
    (root / "tmp.cbz").rename(root / "library" / digest / "source.cbz")
    meta = {"title": f"Fixture Series / Chapter {n}", "kind": "cbz", "pages": 2, "page_members": tmpmeta["page_members"]}
    con.execute("insert into assets values(?, ?)", (digest, json.dumps(meta)))
    con.commit()
    return digest


def wait_for(fn, timeout=120):
    t = time.time()
    while time.time() - t < timeout:
        v = fn()
        if v:
            return v
        time.sleep(1)
    return None


@unittest.skipUnless(sys.platform == "darwin", "needs Apple Vision")
class Watch(unittest.TestCase):
    def test_pause_stop_and_workers(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            (root / "library").mkdir()
            con = sqlite3.connect(root / "cat.sqlite")
            con.execute("create table assets(hash text primary key, metadata text)")
            add_chapter(root, con, 1)
            env = dict(os.environ, MANGA_TEXT_PRIVATE=str(root / "private"), MANGA_TEXT_LIBRARY=str(root / "library"),
                       MANGA_TEXT_CATALOGUE=str(root / "cat.sqlite"), MANGA_TEXT_HOME=str(root / "home"),
                       MANGA_TEXT_PAUSE_FILE=str(root / "PAUSE"), OCR_MAX_WORKERS="2",
                       MANGA_TEXT_BOOK_QUEUE=str(root / "no_queue.json"))
            prog = root / "private/runs/watch_progress.json"
            p = subprocess.Popen([PY, str(HERE / "manga_text.py"), "watch", "--interval", "5", "--nice", "0"], env=env,
                                 stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            try:
                got = lambda: prog.exists() and json.loads(prog.read_text())
                st = wait_for(lambda: got() and got()["done"] >= 1 and got())
                self.assertIsNotNone(st, "first chapter was not processed")
                self.assertEqual(st["workers"], 2)                       # OCR_MAX_WORKERS honoured
                self.assertTrue((root / "private/Fixture_Series/ch0001/chapter.jsonl").exists())
                # PAUSE: new chapter must not be processed while the file exists
                (root / "PAUSE").write_text("")
                st = wait_for(lambda: got() and got()["state"] == "paused" and got())
                self.assertIsNotNone(st, "watcher did not pause")
                add_chapter(root, con, 2)
                time.sleep(12)
                self.assertFalse((root / "private/Fixture_Series/ch0002/chapter.jsonl").exists())
                (root / "PAUSE").unlink()
                self.assertTrue(wait_for(lambda: (root / "private/Fixture_Series/ch0002/chapter.jsonl").exists()), "did not resume")
                # STOP ends it
                (root / "private/runs/STOP").write_text("")
                self.assertIsNotNone(wait_for(lambda: p.poll() is not None, 150), "did not stop")
                self.assertEqual(json.loads(prog.read_text())["state"], "stopped")
            finally:
                if p.poll() is None:
                    p.terminate()


if __name__ == "__main__":
    unittest.main()
