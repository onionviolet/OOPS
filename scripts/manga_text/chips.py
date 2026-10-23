"""Second pass for white-on-black label chips (Japanese databooks): Apple Vision often misreads or drops reversed text.

Find dark filled rectangles that contain light glyphs, invert and enlarge each, and read it on its own. A chip the first pass
already read (some overlapping line contains the same text) is not added again. Measured 2026-10-23 on 10 sampled Fate/Grand Order
material I pages: 41 chips found, 38 read, 10 of them missing or misread in the full-page pass."""
import cv2
import numpy as np

CHIPS_VERSION = "chips-1"
MIN_H, MAX_H_FRAC, MIN_W, MAX_W_FRAC = 14, 0.06, 30, 0.6
PAD, SCALE = 10, 2
MIN_DARK = 0.5                      # share of dark pixels inside a chip (black text blocks have far less)


def find_chips(im):
    """Boxes (x, y, w, h) in pixels of dark label chips with light glyphs inside."""
    g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY) if im.ndim == 3 else im
    H, W = g.shape
    dark = (g < 90).astype(np.uint8) * 255
    dark = cv2.morphologyEx(dark, cv2.MORPH_CLOSE, np.ones((3, 9), np.uint8))   # bridge the glyph strokes inside the chip
    n, _, st, _ = cv2.connectedComponentsWithStats(dark, 8)
    out = []
    for i in range(1, n):
        x, y, w, h, a = (int(v) for v in st[i])
        if not (MIN_H <= h <= MAX_H_FRAC * H and MIN_W <= w <= MAX_W_FRAC * W and a > 0.6 * w * h):
            continue
        inner = g[y:y + h, x:x + w]
        if (inner > 170).mean() < 0.04 or (inner < 90).mean() < MIN_DARK:
            continue                                  # a solid dark patch has no light glyphs; a block of black text is mostly light
        out.append((x, y, w, h))
    return out


def crop_for_ocr(im, box):
    x, y, w, h = box
    c = im[max(0, y - PAD):y + h + PAD, max(0, x - PAD):x + w + PAD]
    g = 255 - (cv2.cvtColor(c, cv2.COLOR_BGR2GRAY) if c.ndim == 3 else c)
    g = cv2.copyMakeBorder(g, 24, 24, 24, 24, cv2.BORDER_CONSTANT, value=255)
    return cv2.resize(g, None, fx=SCALE, fy=SCALE, interpolation=cv2.INTER_CUBIC)


def _norm(t):
    return "".join(t.split())


def add_missing(lines, boxes, texts):
    """lines: [{'text','conf','box':[x0,y0,x1,y1]}]; texts: chip text per box (confidence given as (text, conf)).
    Returns lines plus one line per chip whose text no overlapping line already contains."""
    out = list(lines)
    for (x, y, w, h), (t, conf) in zip(boxes, texts):
        if not _norm(t):
            continue
        covered = any(l["box"][0] < x + w and l["box"][2] > x and l["box"][1] < y + h and l["box"][3] > y and _norm(t) in _norm(l["text"])
                      for l in lines)
        if not covered:
            out.append({"text": t, "conf": conf, "box": [x, y, x + w, y + h], "source": "chip_pass"})
    return out
