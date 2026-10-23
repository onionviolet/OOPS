"""Local vision-LLM reader for explicitly selected pages or strips. Never used in bulk.

Results are cached by (CBZ hash, page or strip, model, prompt id) in private/cache/llm.sqlite, so the same page is never read twice.
Only a loopback Ollama endpoint is accepted. Page images are never returned to callers; --show prints bounded text."""
import base64
import io
import json
import sqlite3
import time
import urllib.request
import zipfile
from pathlib import Path

import common as C

PROMPTS = {
    "page-json-v1": ("This is one page of an English-language manga scan. Transcribe every piece of text: speech bubbles, narration boxes, "
                     "captions and sound effects, panel by panel in reading order. For each item give panel number, speaker (name if clear, "
                     "else 'unknown'), type (speech/thought/narration/caption/sfx) and the exact text. Output a JSON list only."),
    "visual-notes-v1": ("This is one page of an English manga. For each panel give one factual sentence about what is shown (characters, "
                        "setting, action, any technique or object visible). Keep it under 150 words."),
}
ENDPOINT = "http://127.0.0.1:11434/api/chat"


def _cache():
    (C.PRIVATE / "cache").mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(C.PRIVATE / "cache" / "llm.sqlite", timeout=60)
    con.execute("create table if not exists llm(cbz text, loc_kind text, loc text, model text, prompt_id text, result text, "
                "seconds real, created text, primary key(cbz, loc_kind, loc, model, prompt_id))")
    return con


def ollama_transport(model, prompt, image_png, endpoint=ENDPOINT):
    if not endpoint.startswith(("http://127.0.0.1", "http://localhost")):
        raise ValueError("only a loopback Ollama endpoint is allowed")
    body = {"model": model, "stream": False, "think": False, "options": {"num_ctx": 8192, "temperature": 0, "num_predict": 2000},
            "keep_alive": "2m", "messages": [{"role": "user", "content": prompt, "images": [base64.b64encode(image_png).decode()]}]}
    req = urllib.request.Request(endpoint, json.dumps(body).encode(), {"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=1800))["message"]["content"]


def page_png(head, loc):
    """PNG bytes of one manga page or one webtoon strip, read straight from the CBZ."""
    from PIL import Image
    cbz = C.cbz_path(head["cbz_sha256"])
    if head.get("format") == "webtoon":
        import cv2
        import webtoon
        meta = {"page_members": [{"member": s["member"], "sha256": s["sha256"]} for s in head["slices"]]}
        canvas, _, problems = webtoon.build_canvas(head["cbz_sha256"], meta, cbz)
        if problems:
            raise RuntimeError("; ".join(problems))
        rs = webtoon.strip_ranges(canvas.shape[0], head["strip_height"], head["strip_overlap"])
        _, a, b = rs[int(loc)]
        ok, buf = cv2.imencode(".png", canvas[a:b])
        return buf.tobytes()
    member = f"{int(loc):05d}"
    with zipfile.ZipFile(cbz) as z:
        names = [n for n in sorted(z.namelist()) if n.startswith(member)]
        im = Image.open(io.BytesIO(z.read(names[0]))).convert("RGB")
    buf = io.BytesIO()
    im.save(buf, "PNG")
    return buf.getvalue()


def read_page(head, loc, model, prompt_id, transport=None):
    """Returns (result text, cached flag). Cache key: (cbz hash, loc kind, loc, model, prompt id)."""
    if prompt_id not in PROMPTS:
        raise ValueError(f"unknown prompt id {prompt_id}; known: {sorted(PROMPTS)}")
    kind = "strip" if head.get("format") == "webtoon" else "page"
    con = _cache()
    key = (head["cbz_sha256"], kind, str(loc), model, prompt_id)
    row = con.execute("select result from llm where cbz=? and loc_kind=? and loc=? and model=? and prompt_id=?", key).fetchone()
    if row:
        con.close()
        return row[0], True
    t = time.time()
    text = (transport or ollama_transport)(model, PROMPTS[prompt_id], page_png(head, loc))
    con.execute("insert into llm values(?,?,?,?,?,?,?,?)", key + (text, round(time.time() - t, 1), time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())))
    con.commit()
    con.close()
    return text, False
