"""Manga panel layout by recursive white-gutter cuts (XY-cut). Returns leaf rectangles in right-to-left reading order.

Works for the usual grid and stepped layouts; full-bleed or diagonal-gutter pages come back as one panel."""
import numpy as np


def _runs(mask, min_len):
    """Start/end index pairs of True runs at least min_len long."""
    out, start = [], None
    for i, v in enumerate(mask):
        if v and start is None:
            start = i
        elif not v and start is not None:
            if i - start >= min_len:
                out.append((start, i))
            start = None
    if start is not None and len(mask) - start >= min_len:
        out.append((start, len(mask)))
    return out


def _trim(white, x0, y0, x1, y1):
    sub = white[y0:y1, x0:x1]
    rows = np.where(sub.mean(axis=1) < 0.98)[0]
    cols = np.where(sub.mean(axis=0) < 0.98)[0]
    if len(rows) == 0 or len(cols) == 0:
        return None
    return x0 + cols[0], y0 + rows[0], x0 + cols[-1] + 1, y0 + rows[-1] + 1


def xy_cut(gray, white_level=235, gutter_frac=0.985, min_gutter=10, min_area_frac=0.02):
    """gray: HxW uint8 array. Returns [(x0, y0, x1, y1), ...] in reading order (rows top to bottom, right to left inside a row)."""
    H, W = gray.shape
    white = gray > white_level
    min_area = min_area_frac * H * W

    def split(x0, y0, x1, y1, depth, prefer_h):
        box = _trim(white, x0, y0, x1, y1)
        if box is None:
            return []
        x0, y0, x1, y1 = box
        if (x1 - x0) * (y1 - y0) < min_area or depth > 8:
            return [box]
        sub = white[y0:y1, x0:x1]
        for horizontal in ((True, False) if prefer_h else (False, True)):
            prof = sub.mean(axis=1) if horizontal else sub.mean(axis=0)
            cuts = _runs(prof >= gutter_frac, min_gutter)
            cuts = [c for c in cuts if c[0] > 0 and c[1] < len(prof)]      # interior gutters only
            if not cuts:
                continue
            edges, prev = [], 0
            for a, b in cuts:
                edges.append((prev, a))
                prev = b
            edges.append((prev, len(prof)))
            parts = []
            for a, b in edges:
                if b - a < 6:
                    continue
                if horizontal:
                    parts.append(split(x0, y0 + a, x1, y0 + b, depth + 1, False))
                else:
                    parts.append(split(x0 + a, y0, x0 + b, y1, depth + 1, True))
            if not horizontal:
                parts.reverse()                                            # right-to-left
            return [p for part in parts for p in part]
        return [box]

    return split(0, 0, W, H, 0, True)


def assign(box_center, panels):
    """Index of the panel containing the point, else the nearest by rectangle distance."""
    cx, cy = box_center
    best, bd = None, 1e18
    for i, (x0, y0, x1, y1) in enumerate(panels):
        dx = max(x0 - cx, 0, cx - x1)
        dy = max(y0 - cy, 0, cy - y1)
        d = dx * dx + dy * dy
        if d < bd:
            best, bd = i, d
    return best, bd == 0
