"""Failure ledger for the watcher: classify an error, record it with a reason, retry a transient one once, never loop.

private/runs/failures.json maps a key (chapter hash or "book:<path>") to {class, reason, attempts, retryable, source, tools}.
An item is attempted again only when its entry is retryable and under MAX_ATTEMPTS, or when its source (file identity) or the
tool versions changed since the failure. The ledger survives watcher restarts, unlike the old in-memory counter."""
import hashlib
import json
import os
import re
import time
from pathlib import Path

import common as C

MAX_ATTEMPTS = 2                      # first try plus one retry
LEDGER = C.RUNS / "failures.json"

# (class, retryable, pattern on the error text). First match wins.
RULES = [
    ("missing_source", False, r"cbz not on disk|no such file|not found"),
    ("hash_mismatch", False, r"sha256|hash mismatch|hash differs"),
    ("kind_mismatch", False, r"unsupported file type|not a (cbz|zip|pdf|epub)|kind mismatch"),
    ("corrupt_source", False, r"damaged|truncated|bad zip|badzipfile|cannot identify image|corrupt|no page tree"),
    ("unsupported_image", False, r"unsupported image|decompression bomb|image file is truncated|unidentified"),
    ("killed_memory", True, r"sigkill|signals\.sig|killed|memoryerror|out of memory|cannot allocate"),
    ("timeout", True, r"timeout|timed out"),
    ("vision_failure", True, r"calledprocesserror|vision|avision|ocr_failed"),
]


def classify(detail):
    """Returns (class, retryable, short reason). The reason drops long argument lists so a ledger line stays readable."""
    text = str(detail)
    low = text.lower()
    for cls, retry, pat in RULES:
        if re.search(pat, low):
            break
    else:
        cls, retry = "other", True
    reason = re.sub(r"\[[^\]]{200,}\]", "[...]", text)
    reason = re.sub(r"(/[^\s'\"]+){3,}", lambda m: "/.../" + m.group(0).rsplit("/", 1)[-1], reason)
    return cls, retry, reason[:240]


def source_id(path):
    """Cheap identity of a file on disk (size and mtime, following symlinks): changes when a download is replaced."""
    try:
        st = os.stat(path)
        return f"{st.st_size}:{int(st.st_mtime)}"
    except OSError:
        return "gone"


def tools_id(tools):
    return hashlib.sha256(json.dumps(tools, sort_keys=True, default=str).encode()).hexdigest()[:10] if tools is not None else ""


def load():
    try:
        return json.loads(LEDGER.read_text())
    except (OSError, ValueError):
        return {}


def save(d):
    LEDGER.parent.mkdir(parents=True, exist_ok=True)
    tmp = LEDGER.with_suffix(".tmp")
    tmp.write_text(json.dumps(d, indent=1, ensure_ascii=False, sort_keys=True))
    tmp.replace(LEDGER)


def should_attempt(key, source, tools, ledger=None):
    e = (ledger if ledger is not None else load()).get(key)
    if not e:
        return True
    if e.get("source") != source or e.get("tools") != tools:
        return True                                   # the file or the pipeline changed: the old failure says nothing
    return bool(e.get("retryable")) and e.get("attempts", 0) < MAX_ATTEMPTS


def record_failure(key, title, detail, source, tools, ledger=None):
    """Adds one attempt. Returns the entry; entry['final'] is true once it will not be tried again."""
    d = ledger if ledger is not None else load()
    cls, retry, reason = classify(detail)
    old = d.get(key)
    same = old and old.get("source") == source and old.get("tools") == tools
    attempts = (old["attempts"] if same else 0) + 1
    e = {"title": title, "class": cls, "reason": reason, "attempts": attempts, "retryable": retry, "source": source, "tools": tools,
         "first_utc": old["first_utc"] if same else time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
         "last_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
    e["final"] = (not retry) or attempts >= MAX_ATTEMPTS
    d[key] = e
    if ledger is None:
        save(d)
    return e


def clear(key, ledger=None):
    d = ledger if ledger is not None else load()
    if d.pop(key, None) is not None and ledger is None:
        save(d)


def summary(d=None):
    d = load() if d is None else d
    out = {}
    for e in d.values():
        k = (e["class"], "final" if e.get("final") else "retry-pending")
        out[k] = out.get(k, 0) + 1
    return out
