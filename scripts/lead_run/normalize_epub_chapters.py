#!/usr/bin/env python3
"""Rewrites a one-chapter-per-spine-file EPUB as HTML with `<h1>Chapter N: Title</h1>` headings, for the registry's `html` type (then ebook-convert to EPUB).
Offline and read-only on the source. Usage: normalize_epub_chapters.py <mode> <in.epub> <out.html>
Modes: worm (every spine file after the first table of contents is a chapter, titled by its first block), yas (You Are Summoned: `Chapter N` + title blocks, Introduction as 0),
wus (Wish Upon the Stars: `Chapter <Number-Word>` only, stops at the Afterword), gc (Godclads: `CHAPTER N` + title, prologue as 0, stops at the Afterword),
ri (Reverend Insanity, Calibre 15: optional 4th argument V keeps only nav "Volume V", a 100-chapter block of the site's chapter numbering; the Translator/Editor line is dropped),
rtoc (A Regressor's Tale of Cultivation, Calibre 17: titles come from toc.ncx, files are renumbered 0..N in reading order with the prologue as 0, Author's Q&A files are skipped, and the site's
own number is appended to the title as `[site ch N]` when it differs; site ad, Discord and translator lines at the start and end of each file are dropped),
gen (any EPUB whose chapters open with a `Chapter N` block, `Chapter N: Title`, or `Chapter N` then a short title block; running count 1..N, source number kept as `[ch N]` when it differs;
stops at back matter or a numbering restart after 10 chapters),
spine (one chapter per spine file of enough text), auto (gen, else spine when gen finds fewer than 4)."""
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

HEAD = re.compile(r'^(?:chapter|ch\.?)\s+(\d+|[a-z]+(?:[- ][a-z]+){0,3})\s*(?:[:.\u2013\u2014-]\s*(.*))?$', re.I)
STOP = re.compile(r'^(thank you for reading|thanks for reading|afterword|about the author|acknowledg|also by |end of book|the end$|preview|sneak peek|excerpt|bonus chapter|glossary|appendix)', re.I)

def gen_chapters(z):
    """Flat scan of the spine: a block `Chapter N`, `Chapter N: Title` or `Chapter N - Title` opens a chapter (title may be the next short block); the source number is kept as
    `[ch N]` when it differs from the running count; stops at back matter once chapters have started, or when numbering restarts low after 10 chapters (next-book preview)."""
    flat = [t for p in spine(z) for t in blocks(z.read(p).decode('utf8'))]
    out, cur, i, last = [], None, 0, 0
    while i < len(flat):
        t = flat[i]; m = HEAD.match(t) if len(t) < 120 else None
        num = None
        if m:
            g = m.group(1); num = int(g) if g.isdigit() else (word_num(g) or None)
        if num is not None:
            if len(out) >= 10 and num <= 2 and last > 10: break
            title = (m.group(2) or '').strip()
            if not title and i + 1 < len(flat) and len(flat[i + 1]) < 90 and not HEAD.match(flat[i + 1]) and not flat[i + 1].rstrip().endswith(('.', ',', '!', '?', '"', '\u201d')): title = flat[i + 1]; i += 1
            cur = [len(out) + 1, (title or 'Untitled') + ('' if num == len(out) + 1 else ' [ch %d]' % num), []]; out.append(cur); last = num
        elif cur is not None and out and len(out) >= 3 and STOP.match(t) and len(t) < 90: break
        elif cur is not None: cur[2].append(t)
        i += 1
    return [tuple(c) for c in out if len(c[2]) >= 3]

FRONT = re.compile(r'^(contents|table of contents|copyright|dedication|title page|cover|map|maps|prologue to|also in series|also by|about|acknowledg|thank|newsletter|glossary|appendix|credits|preview|author.s note|join|patreon|review)', re.I)

def spine_chapters(z):
    """One chapter per spine file with enough text (`_split_` halves merged): the first short block is the title (a bare number or `Chapter N` line is dropped and the next block used);
    front matter by title, stops at back matter once chapters have started."""
    files, out = [], []
    for p in spine(z):
        key = re.sub(r'_split_\d+', '', p)
        b = blocks(z.read(p).decode('utf8'))
        if files and files[-1][0] == key: files[-1][1].extend(b)
        else: files.append([key, b])
    for key, b in files:
        if sum(map(len, b)) < 1500 or not b: continue
        if out and STOP.match(b[0]) and len(b[0]) < 90: break
        t = b[0]
        if FRONT.match(t) and len(t) < 60: continue
        body = b[1:]
        if (re.fullmatch(r'(chapter\s*)?[\d.ivxlc]+', t, re.I) or HEAD.match(t)) and body and len(body[0]) < 90:
            t = (HEAD.match(t).group(2) if HEAD.match(t) and HEAD.match(t).group(2) else '') or body[0]; body = body[1:] if t == body[0] else body
        elif len(t) > 90: t, body = 'Untitled', b
        out.append((len(out) + 1, t.strip(), body))
    return out

def doc_title(z):
    opf = re.search(r'full-path="([^"]+)"', z.read('META-INF/container.xml').decode()).group(1)
    m = re.search(r'<dc:title[^>]*>([^<]*)</dc:title>', z.read(opf).decode('utf8'))
    return html.unescape(m.group(1)).strip().lower() if m else ''

def auto_chapters(z):
    g = gen_chapters(z)
    if len(g) < 4: g = spine_chapters(z)
    dt = doc_title(z)
    # a leading title page that carried enough text to pass the size test is not chapter 1
    if g and len(g[0][1]) > 6 and g[0][1].lower() in dt: g = [(i + 1, t, b) for i, (_, t, b) in enumerate(g[1:])]
    return g

def chapters(mode, z, vol=0):
    if mode == 'auto': return auto_chapters(z)
    if mode == 'spine': return spine_chapters(z)
    if mode == 'gen': return gen_chapters(z)
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
