"""Merge several EPUB volumes into one JSON keyed by chapter number, losing no distinct body.

Usage: python3 -I merge_volumes.py OUT.json VOL1.epub [VOL2.epub ...]
Members are read in spine order with folder-qualified identity (epub_to_json.read_members).
The chapter number comes from a short heading line among the first three ('Chapter 123',
'CHAPTER 123', '第123章', '第一百二十三章').

Keys: "ch00001" while numbering runs on across volumes. When numbering restarts (a later
volume, or a later part of one compilation, reuses a number with a different body), every key
becomes volume-qualified, "v01ch00001", so reading order and both bodies survive (F16/F11,
2026-11-07). A repeated number on the next member is a split chapter, kept as "ch00005-2".
Only a whitespace-identical body is a real duplicate: kept once and counted.
Members without a chapter number (prologues, side stories, notes, covers) and contents pages
(a contents title, or three or more chapter headings in the first lines) are skipped and
reported with their headings. Missing numbers are reported per volume.
Keep OUT.json outside git (copyrighted text).
"""
import json
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from epub_to_json import chapter_number, is_contents, read_members  # noqa: E402


def numbered(src):
    for m in read_members(src):
        if is_contents(m['lines']):
            yield None, m['heading'] or 'contents page', '\n'.join(m['lines']), m['member']
            continue
        for line in m['lines'][:3]:
            n = chapter_number(line)
            if n is not None:
                yield n, line, '\n'.join(m['lines']), m['member']
                break
        else:
            yield None, m['heading'], '\n'.join(m['lines']), m['member']


def norm(body):
    return ' '.join(body.split())


def segments(srcs):
    """Split the input into volumes: one per source, plus a new one wherever numbering restarts inside it."""
    vols, skipped, dupes, parts = [], [], 0, 0
    seen_bodies = set()
    for src in srcs:
        cur, last = None, None
        for n, heading, body, member in numbered(src):
            if n is None:
                if body.strip():
                    skipped.append((os.path.basename(src), member, heading, len(body)))
                continue
            key = (n, norm(body))
            if key in seen_bodies:
                dupes += 1
                continue
            seen_bodies.add(key)
            if cur is None or (n in cur['nums'] and n != last):
                cur = {'src': src, 'chapters': [], 'nums': set()}
                vols.append(cur)
            part = sum(1 for c in cur['chapters'] if c[0] == n) + 1
            parts += part > 1
            cur['chapters'].append((n, part, heading, body))
            cur['nums'].add(n)
            last = n
    return vols, skipped, dupes, parts


def main(dst, srcs):
    vols, skipped, dupes, parts = segments(srcs)
    restart = any(v['nums'] & u['nums'] for i, v in enumerate(vols) for u in vols[:i])
    out = {}
    for vi, v in enumerate(vols, 1):
        for n, part, heading, body in v['chapters']:
            key = (f'v{vi:02d}' if restart else '') + f'ch{n:05d}' + (f'-{part}' if part > 1 else '')
            out[key] = [heading, body]
    out = dict(sorted(out.items()))
    with open(dst, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False)
    if not vols:
        print(f'0 chapters, {dupes} duplicates, {len(skipped)} unnumbered members skipped')
        return
    groups = vols if restart else [{'nums': set().union(*(v['nums'] for v in vols))}]
    missing = {}
    for gi, g in enumerate(groups, 1):
        gap = sorted(set(range(min(g['nums']), max(g['nums']) + 1)) - g['nums'])
        if gap:
            missing[f'v{gi:02d}' if restart else 'all'] = gap
    nums = [n for v in vols for n in v['nums']]
    print(f"{len(out)} chapters {min(nums)}-{max(nums)}, {dupes} duplicates, {parts} split parts, "
          f"{sum(map(len, missing.values()))} missing")
    if restart:
        print(f'numbering restart: {len(vols)} volumes, keys are vNNchNNNNN: ' +
              ', '.join(f"v{i:02d}={os.path.basename(v['src'])} {min(v['nums'])}-{max(v['nums'])}"
                        for i, v in enumerate(vols, 1)))
    for k, gap in missing.items():
        print(f'{k}: missing {gap[:20]}{" ..." if len(gap) > 20 else ""}')
    if skipped:
        print(f'{len(skipped)} unnumbered members skipped ({sum(s[3] for s in skipped)} characters): ' +
              '; '.join(f'{s[0]}:{s[1]} "{s[2][:40]}"' for s in skipped[:8]))


if __name__ == '__main__':
    if len(sys.argv) < 3 or sys.argv[1] in ('-h', '--help'):
        print(__doc__)
        sys.exit(0 if len(sys.argv) == 2 and sys.argv[1] in ('-h', '--help') else 2)
    main(sys.argv[1], sys.argv[2:])
