"""Ruled-table regions on a page image: grid lines -> cells -> rows. Cell text comes from the page's OCR lines."""
import cv2
import numpy as np


def _clusters(idx, gap=6):
    out, start, prev = [], None, None
    for i in idx:
        if start is None:
            start = prev = i
        elif i - prev <= gap:
            prev = i
        else:
            out.append((start + prev) // 2)
            start = prev = i
    if start is not None:
        out.append((start + prev) // 2)
    return out


def _grid(gray):
    H, W = gray.shape
    bw = (gray < 150).astype(np.uint8) * 255
    horiz = cv2.morphologyEx(bw, cv2.MORPH_OPEN, np.ones((1, max(30, W // 30)), np.uint8))
    vert = cv2.morphologyEx(bw, cv2.MORPH_OPEN, np.ones((max(30, H // 40), 1), np.uint8))
    return horiz, vert


def _components(gray, min_w, min_h, min_lines):
    horiz, vert = _grid(gray)
    grid = cv2.dilate(cv2.bitwise_or(horiz, vert), np.ones((5, 5), np.uint8))
    hs_all = cv2.dilate(horiz, np.ones((9, 1), np.uint8))          # tolerate a slightly tilted scan
    vs_all = cv2.dilate(vert, np.ones((1, 9), np.uint8))
    n, labels, stats, _ = cv2.connectedComponentsWithStats(grid, connectivity=8)
    out = []
    for i in range(1, n):
        x, y, w, h, area = stats[i]
        if w < min_w or h < min_h:
            continue
        hs = hs_all[y:y + h, x:x + w]
        vs = vs_all[y:y + h, x:x + w]
        ys = [y + v for v in _clusters(np.where(hs.sum(axis=1) / 255 >= 0.5 * w)[0], 10)]
        xs = [x + v for v in _clusters(np.where(vs.sum(axis=0) / 255 >= 0.5 * h)[0], 10)]
        if len(ys) >= min_lines[0] and len(xs) >= min_lines[1]:
            out.append({"box": [int(x), int(y), int(x + w), int(y + h)], "xs": [int(v) for v in xs], "ys": [int(v) for v in ys]})
    return out


def find_tables(gray, min_w=150, min_h=60):
    """Ruled tables: at least 2 rows and 2 columns of cells (3 lines each way)."""
    return _components(gray, min_w, min_h, (3, 3))


def find_boxes(gray, min_w=150, min_h=60):
    """Plain ruled rectangles (profile boxes, stat boxes): 2 lines each way, not a multi-cell grid."""
    return [b for b in _components(gray, min_w, min_h, (2, 2)) if len(b["ys"]) == 2 or len(b["xs"]) == 2]


def cell_rows(table, lines):
    """Rows of cell texts; lines are {'text','box'} in page pixels. Returns (rows, used line indices)."""
    xs, ys = table["xs"], table["ys"]
    rows, used = [], set()
    for r in range(len(ys) - 1):
        row = []
        for c in range(len(xs) - 1):
            parts = []
            for k, l in enumerate(lines):
                cx, cy = (l["box"][0] + l["box"][2]) / 2, (l["box"][1] + l["box"][3]) / 2
                if xs[c] <= cx < xs[c + 1] and ys[r] <= cy < ys[r + 1]:
                    parts.append((l["box"][1], l["box"][0], l["text"]))
                    used.add(k)
            row.append(" ".join(t for _, _, t in sorted(parts)))
        rows.append(row)
    return rows, used
