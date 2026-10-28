#!/usr/bin/env python3
"""Rewrites a one-chapter-per-spine-file EPUB as HTML with `<h1>Chapter N: Title</h1>` headings, for the registry's `html` type (then ebook-convert to EPUB).
Offline and read-only on the source. Usage: normalize_epub_chapters.py <mode> <in.epub> <out.html>
Modes: worm (every spine file after the first table of contents is a chapter, titled by its first block), yas (You Are Summoned: `Chapter N` + title blocks, Introduction as 0),
wus (Wish Upon the Stars: `Chapter <Number-Word>` only, stops at the Afterword), gc (Godclads: `CHAPTER N` + title, prologue as 0, stops at the Afterword)."""
import sys, re, zipfile, html, posixpath
from urllib.parse import unquote

def blocks(x):
    x = re.sub(r'<(script|style)[\s\S]*?</\1>', '', x, flags=re.I)
    pat = r'<(?:p|h[1-6])[^>]*>([\s\S]*?)</(?:p|h[1-6])>' if re.search(r'<p[\b\s>]', x, re.I) else r'<div[^>]*>((?:(?!<div)[\s\S])*?)</div>'
    out = []
    for m in re.finditer(pat, x, re.I):
        t = html.unescape(re.sub(r'<[^>]+>', '', m.group(1))).replace(' ', ' ')
        t = re.sub(r'\s+', ' ', t).strip()
        if t: out.append(t)
    return out

def spine(z):
    opf = re.search(r'full-path="([^"]+)"', z.read('META-INF/container.xml').decode()).group(1)
    s = z.read(opf).decode('utf8'); d = posixpath.dirname(opf)
    href = {}
    for m in re.finditer(r'<item\b[^>]*>', s):
        i = re.search(r'\bid="([^"]*)"', m.group(0)); h = re.search(r'\bhref="([^"]*)"', m.group(0))
        if i and h: href[i.group(1)] = h.group(1)
    names = set(z.namelist())
    paths = [posixpath.normpath(posixpath.join(d, unquote(href[m]))) for m in re.findall(r'<itemref\b[^>]*\bidref="([^"]*)"', s) if m in href]
    return [p for p in paths if p in names]

WORDS = {w: i for i, w in enumerate('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split())}
TENS = {w: 10 * i for i, w in enumerate('_ _ twenty thirty forty fifty sixty seventy eighty ninety'.split())}
def word_num(s):
    n = 0
    for p in s.lower().split('-'):
        n += WORDS.get(p, TENS.get(p, 0))
    return n

def chapters(mode, z):
    out = []
    files = [(p, blocks(z.read(p).decode('utf8'))) for p in spine(z)]
    if mode == 'worm':
        body = files[2:-1]  # title page + table of contents first, repeated table of contents last
        for i, (p, b) in enumerate(body, 1):
            if b: out.append((i, b[0], b[1:]))
        return out
    for p, b in files:
        if not b: continue
        f = b[0]
        if re.match(r'(thank you for reading|afterword$)', f, re.I) or (mode in ('wus', 'gc') and re.match(r'afterword$', f, re.I)): break
        m = None
        if mode == 'yas':
            m = re.fullmatch(r'Chapter (\d+)', f)
            if m and len(b) > 10: out.append((int(m.group(1)), b[1], b[2:]))
            elif f == 'Introduction' and len(b) > 10: out.append((0, b[1], b[2:]))
        elif mode == 'wus':
            m = re.fullmatch(r'Chapter ([A-Za-z-]+)', f)
            if m and word_num(m.group(1)): out.append((word_num(m.group(1)), f, b[1:]))
        elif mode == 'gc':
            m = re.fullmatch(r'CHAPTER (\d+)', f)
            if m and len(b) > 5: out.append((int(m.group(1)), b[1].title(), b[2:]))
            elif f.upper().startswith('PROLOGUE:'): out.append((0, f.split(':', 1)[1].strip().title(), b[1:]))
    return out

if __name__ == '__main__':
    mode, src, dst = sys.argv[1:4]
    chs = chapters(mode, zipfile.ZipFile(src))
    o = ['<html><head><meta charset="utf-8"><title>%s</title></head><body>' % html.escape(posixpath.basename(src))]
    for n, t, ps in chs:
        o.append('<h1>Chapter %d: %s</h1>' % (n, html.escape(t)))
        o += ['<p>%s</p>' % html.escape(p) for p in ps]
    o.append('</body></html>')
    open(dst, 'w', encoding='utf8').write('\n'.join(o))
    print(len(chs), 'chapters', chs[0][0], '..', chs[-1][0])
