import shutil
import tempfile
import unittest
from pathlib import Path

import helpers  # noqa: F401
import common as C


@unittest.skipUnless(shutil.which("swiftc"), "needs Xcode command line tools (Apple Vision)")
class AppleVision(unittest.TestCase):
    def test_reads_synthetic_text(self):
        from PIL import Image, ImageDraw, ImageFont
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "t.png"
            im = Image.new("RGB", (600, 140), "white")
            ImageDraw.Draw(im).text((20, 30), "SYNTHETIC LINE 7", fill="black", font=ImageFont.load_default(size=44))
            im.save(p)
            r = C.ocr_images([p])["t.png"]
            self.assertIn("SYNTHETIC", " ".join(o["text"] for o in r["obs"]).upper())


if __name__ == "__main__":
    unittest.main()
