"""Test helpers: synthetic fixtures only (invented images, no real manga pages)."""
import hashlib
import io
import os
import sys
import tempfile
import zipfile
from pathlib import Path

_TMP = tempfile.mkdtemp(prefix="manga_text_test_")
os.environ["MANGA_TEXT_PRIVATE"] = str(Path(_TMP) / "private")      # always a temp dir: tests delete the index
os.environ["MANGA_TEXT_HOME"] = str(Path(_TMP) / "home")
os.environ["MANGA_TEXT_LIBRARY"] = str(Path(_TMP) / "library")
os.environ["MANGA_TEXT_CATALOGUE"] = str(Path(_TMP) / "catalogue.sqlite")
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import numpy as np  # noqa: E402
from PIL import Image  # noqa: E402


def png_bytes(arr):
    buf = io.BytesIO()
    Image.fromarray(arr).save(buf, "PNG")
    return buf.getvalue()


def make_cbz(path, images):
    """images: list of HxWx3 uint8 arrays. Returns catalogue-style metadata with page_members."""
    members = []
    with zipfile.ZipFile(path, "w") as z:
        for i, a in enumerate(images, 1):
            name = f"{i:05d}.png"
            data = png_bytes(a)
            z.writestr(name, data)
            members.append({"member": name, "sha256": hashlib.sha256(data).hexdigest()})
    return {"title": "Test Series / Chapter 1", "kind": "cbz", "pages": len(images), "page_members": members}


def canvas(w, h, color=(0, 0, 0)):
    a = np.zeros((h, w, 3), np.uint8)
    a[:] = color
    return a
