#!/usr/bin/env python3
"""Rewrites a one-chapter-per-spine-file EPUB as HTML with `<h1>Chapter N: Title</h1>` headings, for the registry's `html` type (then ebook-convert to EPUB).
Offline and read-only on the source. Usage: normalize_epub_chapters.py <mode> <in.epub> <out.html>
Modes: worm (every spine file after the first table of contents is a chapter, titled by its first block), yas (You Are Summoned: `Chapter N` + title blocks, Introduction as 0),
wus (Wish Upon the Stars: `Chapter <Number-Word>` only, stops at the Afterword), gc (Godclads: `CHAPTER N` + title, prologue as 0, stops at the Afterword),
ri (Reverend Insanity, Calibre 15: optional 4th argument V keeps only nav "Volume V", a 100-chapter block of the site's chapter numbering; the Translator/Editor line is dropped),
rtoc (A Regressor's Tale of Cultivation, Calibre 17: titles come from toc.ncx, files are renumbered 0..N in reading order with the prologue as 0, Author's Q&A files are skipped, and the site's
own number is appended to the title as `[site ch N]` when it differs; site ad, Discord and translator lines at the start and end of each file are dropped)."""
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

RTOC_EDGE = re.compile(r'(join the discord|translators?:|editors?:|discord:|link to donations|enhance your reading|\*\*\*$)', re.I)

def ri_chapters(z, vol):
    nav = z.read('EPUB/nav.xhtml').decode('utf8')
    parts = re.split(r'<a href="volume_(\d+)\.xhtml">', nav)
    out = []
    for i in range(1, len(parts), 2):
        if vol and int(parts[i]) != vol: continue
        for n in re.findall(r'href="chapter_(\d+)\.xhtml"', parts[i + 1]):
            b = blocks(z.read('EPUB/chapter_%s.xhtml' % n).decode('utf8'))
            m = re.fullmatch(r'Chapter (\d+) - (.*)', b[0])
            if not m or int(m.group(1)) != int(n): raise SystemExit('unexpected heading in chapter_%s: %r' % (n, b[0]))
            body = b[1:]
            while body and re.match(r'translators?:', body[0], re.I): body = body[1:]
            out.append((int(n), m.group(2), body))
    return out

def rtoc_chapters(z):
    ncx = z.read('OEBPS/toc.ncx').decode('utf8')
    out = []
    for label, f in re.findall(r'<text>([^<]*)</text>\s*</navLabel>\s*<content src="([^"]+)"', ncx):
        label = html.unescape(label).strip()
        if label.startswith(("Author's Q&A", "Author\u2019s Q&A")): continue
        m = re.match(r'Chapter (\d+)\s*:?\s*(.*)', label)
        if label != 'Prologue' and not m: raise SystemExit('unexpected label %r' % label)
        t = re.sub(r'<div class="unlock-buttons.*?</div>', '', z.read('OEBPS/' + f).decode('utf8'), flags=re.S)
        b = blocks(t)
        while b and RTOC_EDGE.match(b[0]): b = b[1:]
        while b and RTOC_EDGE.match(b[-1]): b = b[:-1]
        n = len(out)
        title = 'Prologue' if label == 'Prologue' else (m.group(2) or 'Untitled')
        if m and int(m.group(1)) != n: title += ' [site ch %s]' % m.group(1)
        out.append((n, title, b))
    return out

def chapters(mode, z, vol=0):
    if mode == 'ri': return ri_chapters(z, vol)
    if mode == 'rtoc': return rtoc_chapters(z)
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
    chs = chapters(mode, zipfile.ZipFile(src), int(sys.argv[4]) if len(sys.argv) > 4 else 0)
    o = ['<html><head><meta charset="utf-8"><title>%s</title></head><body>' % html.escape(posixpath.basename(src))]
    for n, t, ps in chs:
        o.append('<h1>Chapter %d: %s</h1>' % (n, html.escape(t)))
        o += ['<p>%s</p>' % html.escape(p) for p in ps]
    o.append('</body></html>')
    open(dst, 'w', encoding='utf8').write('\n'.join(o))
    print(len(chs), 'chapters', chs[0][0], '..', chs[-1][0])
