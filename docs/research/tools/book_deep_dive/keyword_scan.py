"""Keyword scan of an EPUB, paragraph-level, deterministic (AU11).

Usage: python3 -I keyword_scan.py BOOK.epub HITS.jsonl KEY [KEY ...]
Writes one JSON line per matching paragraph: serial (4-digit member number),
p (1-based nonempty <p> index), keys found, first 400 characters. Keep the
output in the source's gitignored private folder, never in git.

Members are those named *_NNNN.xhtml/html. Others are reported on stderr, and the
scan exits 1 when none match, instead of printing "hits 0" (2026-11-07). The same
serial in two folders keeps both, the later as "NNNNb", and is reported. A member
with no <p> at all is read by block elements (div, li, headings) so its text is
scanned; members with <p> keep <p>-only numbering, so earlier [SERIALpN] locators
stay valid. Text outside <p> in such members is reported, not scanned.
"""
import sys, os, zipfile, re, json
from html.parser import HTMLParser
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from epub_to_json import HTML_EXT, decode, html_lines  # noqa: E402

SERIAL = re.compile(r'_(\d{4})\.x?html$')


class Paras(HTMLParser):
    def __init__(s): super().__init__(); s.ps = []; s.cur = None; s.outside = 0; s.skip = 0
    def handle_starttag(s, t, a):
        if t in ('head', 'style', 'script'): s.skip += 1
        if t == 'p': s.cur = []
        elif t == 'br' and s.cur is not None: s.cur.append('\n')
    def handle_data(s, d):
        if s.cur is not None: s.cur.append(d)
        elif not s.skip: s.outside += len(d.strip())
    def handle_endtag(s, t):
        if t in ('head', 'style', 'script'): s.skip = max(0, s.skip - 1)
        if t == 'p' and s.cur is not None:
            x = ''.join(s.cur).strip()
            if x: s.ps.append(x)
            s.cur = None


def members(src, warn=lambda m: print(m, file=sys.stderr)):
    z = zipfile.ZipFile(src)
    names = sorted(n for n in z.namelist() if n.lower().endswith(HTML_EXT))
    plain = [n for n in names if not SERIAL.search(n)]
    if plain:
        warn(f'{len(plain)} html members without a _NNNN serial, not scanned: {plain[:5]}')
    seen = {}
    for name in names:
        m = SERIAL.search(name)
        if not m:
            continue
        serial = m.group(1)
        if serial in seen:
            first = seen[serial][0]
            serial = serial + 'bcdefghijklmnopqrstuvwxyz'[len(seen[serial]) - 1]
            warn(f'serial {m.group(1)} appears in more than one folder: {first} and {name} (kept as {serial})')
            seen[m.group(1)].append(name)
        else:
            seen[serial] = [name]
        text, enc, bad = decode(z.read(name))
        if bad:
            warn(f'{name}: {bad} undecodable bytes replaced (declared {enc})')
        p = Paras(); p.feed(text); p.close()
        ps = p.ps
        if not ps:
            ps = html_lines(text)
        elif p.outside > 200:
            warn(f'{name}: {p.outside} characters outside <p> not scanned')
        yield serial, ps
    if not seen:
        raise SystemExit(f'{src}: no *_NNNN.xhtml members; nothing scanned')


if __name__ == '__main__':
    if len(sys.argv) < 4:
        print(__doc__); sys.exit(2)
    src, out, keys = sys.argv[1], sys.argv[2], sys.argv[3:]
    n = 0; chapters = set()
    with open(out, 'w', encoding='utf-8') as f:
        for serial, ps in members(src):
            for i, t in enumerate(ps, 1):
                ks = [k for k in keys if k in t]
                if ks:
                    n += 1; chapters.add(serial)
                    f.write(json.dumps({'serial': serial, 'p': i, 'keys': ks, 'text': t[:400]}, ensure_ascii=False) + '\n')
    print('hits', n, 'chapters', len(chapters))
