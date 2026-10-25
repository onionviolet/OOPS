"""Keyword scan of an EPUB, paragraph-level, deterministic (AU11).

Usage: python3 -I keyword_scan.py BOOK.epub HITS.jsonl KEY [KEY ...]
Writes one JSON line per matching paragraph: serial (4-digit member number),
p (1-based nonempty <p> index), keys found, first 400 characters. Keep the
output in the source's gitignored private folder, never in git.
"""
import sys, zipfile, re, json
from html.parser import HTMLParser

class Paras(HTMLParser):
    def __init__(s): super().__init__(); s.ps = []; s.cur = None
    def handle_starttag(s, t, a):
        if t == 'p': s.cur = []
        elif t == 'br' and s.cur is not None: s.cur.append('\n')
    def handle_data(s, d):
        if s.cur is not None: s.cur.append(d)
    def handle_endtag(s, t):
        if t == 'p' and s.cur is not None:
            x = ''.join(s.cur).strip()
            if x: s.ps.append(x)
            s.cur = None

def members(src):
    z = zipfile.ZipFile(src)
    for name in sorted(z.namelist()):
        m = re.search(r'_(\d{4})\.x?html$', name)
        if m:
            p = Paras(); p.feed(z.read(name).decode('utf-8', 'replace'))
            yield m.group(1), p.ps

if __name__ == '__main__':
    src, out, keys = sys.argv[1], sys.argv[2], sys.argv[3:]
    n = 0; chapters = set()
    with open(out, 'w') as f:
        for serial, ps in members(src):
            for i, t in enumerate(ps, 1):
                ks = [k for k in keys if k in t]
                if ks:
                    n += 1; chapters.add(serial)
                    f.write(json.dumps({'serial': serial, 'p': i, 'keys': ks, 'text': t[:400]}, ensure_ascii=False) + '\n')
    print('hits', n, 'chapters', len(chapters))
