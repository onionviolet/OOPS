"""Pinned model files with checksums: fetch-models downloads the pinned detector revision and verifies every file."""
import hashlib
import json
import sys
from pathlib import Path

import common as C

MODELS = json.loads((C.HERE / "models.json").read_text())


def snapshot_dir():
    root = Path.home() / ".cache/huggingface/hub" / ("models--" + MODELS["detector"]["repo"].replace("/", "--")) / "snapshots"
    d = root / MODELS["detector"]["revision"]
    return d if d.exists() else None


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def verify():
    """Returns (ok, [messages]) for the cached detector files."""
    d = snapshot_dir()
    if d is None:
        return False, [f"pinned revision {MODELS['detector']['revision'][:12]} not cached; run fetch-models"]
    msgs, ok = [], True
    for name, meta in MODELS["detector"]["files"].items():
        p = d / name
        if not p.exists():
            ok = False
            msgs.append(f"{name} missing")
        elif sha256(p.resolve()) != meta["sha256"]:
            ok = False
            msgs.append(f"{name} checksum differs from models.json")
    return ok, msgs or ["all files match models.json"]


def fetch_and_verify():
    from huggingface_hub import snapshot_download
    m = MODELS["detector"]
    snapshot_download(m["repo"], revision=m["revision"], allow_patterns=list(m["files"]))
    ok, msgs = verify()
    print("detector:", "; ".join(msgs))
    if not ok:
        sys.exit(1)
