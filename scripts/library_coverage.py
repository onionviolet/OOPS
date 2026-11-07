#!/usr/bin/env python3 -I
"""Answers "do we already hold this text?" from the live Source Library database (read-only), the way
SOURCE_ACQUISITION_TOOLS AR36 requires: never from a generated catalogue or a title regex alone.

  python3 -I scripts/library_coverage.py --series "Shadow Slave" [--author Guiltythree]
  python3 -I scripts/library_coverage.py --author Dinniman       # series names are often missing from titles; query the author too
  python3 -I scripts/library_coverage.py --compilations        # every held EPUB that is a multi-volume or chapter compilation

For each match it prints kind, size, spine/html part count, the chapter range read from the part titles
(first and last "Chapter N"), and whether the file looks like a compilation. A compilation covering a range
means retail volumes inside that range are alternate editions, not gaps. Container facts only: this does not
read or compare text, so edition equivalence stays a human or reader call."""
import argparse, json, os, pathlib, re, sqlite3, sys, zipfile

sys.path.append(str(pathlib.Path(__file__).resolve().parents[1] / 'docs/research/tools/book_deep_dive'))
from epub_to_json import chapter_number, decode, html_lines, is_contents, spine  # noqa: E402  one parser for every book tool

DB = pathlib.Path.home() / '.local/share/source-platform/catalogue.sqlite'
# \b: 'Branch 40' and 'March 12' are not chapters; bare 'ch' needs a dot or space: 'ch001.xhtml' is a file name
CH = re.compile(r'\b(?:chapter\s*|ch\.\s*|ch\s+)(\d{1,5})\b', re.I)
VOLS = re.compile(r'(?:volumes?|vols?\.?|books?)\s*\d+\s*(?:to|-|–|through)\s*\d+|omnibus|collected|complete|box ?set|\b\d+\s*[-–]\s*\d{2,}\b', re.I)


def ro():
    return sqlite3.connect(f'file:{DB}?mode=ro', uri=True)


def inspect(path):
    """Container facts in spine order. A part's number comes from its <title>, else from a short heading
    among its first three text lines (English or Chinese, 第12章/第十二章). Numbers are counted per part, not
    as a set, so a compilation whose numbering restarts reports ch_count over every part plus `restarts`;
    gaps are listed per volume segment (2026-11-07, BOOK_TEXT_TOOLS_2026-11-07)."""
    try:
        z = zipfile.ZipFile(path)
    except Exception:
        return None
    html = [n for n in z.namelist() if n.lower().endswith(('.xhtml', '.html', '.htm'))]
    order = [n for n in (spine(z) or []) if n in set(html)]
    parts = order + sorted(set(html) - set(order))
    seq = []
    for n in parts:
        text = decode(z.read(n))[0]
        t = re.search(r'<title>(.*?)</title>', text, re.S)
        m = CH.search(t.group(1)) if t else None
        num = int(m.group(1)) if m else (chapter_number(t.group(1).strip()) if t else None)
        if num is None:
            lines = html_lines(text)
            if not is_contents(lines):
                num = next((c for c in map(chapter_number, lines[:3]) if c is not None), None)
        if num is not None:
            seq.append(num)
    segments, cur, last = [], None, None
    for num in seq:
        if cur is None or (num in cur and num != last):
            cur = set()
            segments.append(cur)
        cur.add(num)
        last = num
    first = min(seq) if seq else None
    last_n = max(seq) if seq else None
    gaps = [g for s in segments for g in range(min(s), max(s) + 1) if g not in s][:8]
    return dict(parts=len(parts), ch_first=first, ch_last=last_n, ch_count=len(seq),
                restarts=max(0, len(segments) - 1), gaps=gaps)


def rows(where='', args=()):
    c = ro()
    out = []
    for h, m in c.execute('select hash, metadata from assets ' + where, args):
        m = json.loads(m)
        locs = [p for (p,) in c.execute('select path from locations where hash=?', (h,)) if os.path.exists(p)]
        out.append((h, m, locs))
    return out


def describe(h, m, locs):
    info = inspect(locs[0]) if locs and m.get('kind') == 'epub' else None
    title = m.get('title', '')
    comp = bool(info and (info['parts'] >= 500 or (info['ch_last'] or 0) >= 200 or info['restarts'])) or bool(VOLS.search(title))
    return dict(hash=h[:12], kind=m.get('kind'), bytes=m.get('bytes'), title=title[:80], author=(m.get('author') or '')[:30],
                parts=info and info['parts'], chapters=info and (info['ch_first'], info['ch_last'], info['ch_count']), restarts=info and info['restarts'],
                first_gaps=info and info['gaps'],
                compilation=comp, on_disk=bool(locs))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--series'); ap.add_argument('--author', default='')
    ap.add_argument('--compilations', action='store_true')
    a = ap.parse_args()
    if a.series or a.author:
        # Series names are often absent from a book's title ("A Parade of Horribles" is Dungeon Crawler Carl 8),
        # so --author alone is a valid and often necessary query. Run both when unsure.
        like = '%' + (a.series or a.author).replace('%', '') + '%'
        res = [describe(*r) for r in rows('where lower(metadata) like lower(?)', (like,))]
        if a.series and a.author:
            res = [r for r in res if re.search(a.author, r['author'] + r['title'], re.I)]
        for r in sorted(res, key=lambda r: r['title']):
            print(json.dumps(r, ensure_ascii=False))
        print(f"{len(res)} held records; compilations: {sum(r['compilation'] for r in res)}. "
              "If any compilation covers a chapter range, volumes inside it are alternate editions, not gaps.")
    elif a.compilations:
        for r in rows("where json_extract(metadata,'$.kind')='epub' and json_extract(metadata,'$.bytes')>3000000"):
            d = describe(*r)
            if d['compilation']:
                print(json.dumps(d, ensure_ascii=False))
    else:
        ap.print_help()


if __name__ == '__main__':
    main()
