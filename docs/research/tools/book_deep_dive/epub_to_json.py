"""Extract an EPUB's chapter text into one JSON file for fast local searching.

Usage: python3 -I epub_to_json.py BOOK.epub OUT.json
Output: {archive_member_path: [heading, body_text]} in OPF spine order, then any
HTML members missing from the spine (reported on stderr). Keys are full archive
paths, so equal basenames in different folders stay separate (F16, 2026-11-07).
Text comes from block elements only; <head>, <style> and <script> are dropped and
inline tags do not split a paragraph. Declared encodings are honoured; bytes that
still fail to decode are replaced and reported, never silently dropped.
Read-only on the EPUB. Keep OUT.json outside git (copyrighted text).
merge_volumes.py and library_coverage.py import read_members/chapter_number.
"""
import codecs
import json
import posixpath
import re
import sys
import zipfile
from urllib.parse import unquote
from html.parser import HTMLParser
from xml.etree import ElementTree as ET

HTML_EXT = ('.xhtml', '.html', '.htm')
BLOCK = {'p', 'div', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'tr', 'td', 'th', 'dd', 'dt',
         'blockquote', 'pre', 'hr', 'section', 'article', 'header', 'footer', 'aside', 'figcaption',
         'table', 'ul', 'ol', 'dl', 'body', 'nav'}
SKIP = {'head', 'style', 'script', 'title'}
HEADING = re.compile(r'(第.+章|Chapter\s*\d+)', re.I)
# Anchored at the line start (an optional short volume prefix is allowed), so prose such as
# "Content from Chapter 1 to Chapter 95" or "He reread chapter 9" is not a heading.
NUM = re.compile(r'^\s*(?:(?:vol(?:ume)?\.?|book)\s*\d+\s*[-–:,.]?\s*|第\s*\S{1,6}\s*卷\s*)?'
                 r'(?:chapter\s*(\d+)|第\s*([0-9０-９]+|[零〇一二两三四五六七八九十百千万]+)\s*章)', re.I)
CONTENTS = re.compile(r'^\s*(table of contents|contents|目\s*录)\s*$', re.I)
CN = {'零': 0, '〇': 0, '一': 1, '二': 2, '两': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9}
CN_UNIT = {'十': 10, '百': 100, '千': 1000, '万': 10000}
HEADING_MAX = 300  # real headings reach 144 characters (Shadow Slave 681); NUM is anchored, so prose rarely passes


def cn_number(s):
    total, section, digit = 0, 0, 0
    for ch in s:
        if ch in CN:
            digit = CN[ch]
        elif ch == '万':
            total += (section + digit) * 10000
            section, digit = 0, 0
        else:
            section += (digit or 1) * CN_UNIT[ch]
            digit = 0
    return total + section + digit


def is_contents(lines):
    """A table-of-contents or index page: a contents title, or several chapter headings in its first lines."""
    if lines and CONTENTS.match(lines[0]):
        return True
    return sum(1 for l in lines[:20] if chapter_number(l) is not None) >= 3


def chapter_number(line):
    """Chapter number from a heading-like line ('Chapter 12', 'CHAPTER 12', '第12章', '第十二章'), else None."""
    if len(line) > HEADING_MAX:
        return None
    m = NUM.search(line)
    if not m:
        return None
    if m.group(1):
        return int(m.group(1))
    g = m.group(2)
    return int(g) if g[0].isdigit() else cn_number(g)


class Text(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.lines, self.cur, self.skip = [], [], 0

    def flush(self):
        line = re.sub(r'[ \t\r\n]+', ' ', ''.join(self.cur)).strip()
        if line:
            self.lines.append(line)
        self.cur = []

    def handle_starttag(self, tag, attrs):
        if tag in SKIP:
            self.skip += 1
        elif tag in BLOCK:
            self.flush()

    def handle_startendtag(self, tag, attrs):
        if tag in BLOCK:
            self.flush()

    def handle_endtag(self, tag):
        if tag in SKIP:
            self.skip = max(0, self.skip - 1)
        elif tag in BLOCK:
            self.flush()

    def handle_data(self, data):
        if not self.skip:
            self.cur.append(data)


def decode(raw):
    """Return (text, encoding, replaced_count)."""
    if raw.startswith((codecs.BOM_UTF16_LE, codecs.BOM_UTF16_BE)):
        enc = 'utf-16'
    elif raw.startswith(codecs.BOM_UTF8):
        enc = 'utf-8-sig'
    else:
        head = raw[:4096]
        m = (re.search(rb"<\?xml[^>]*encoding\s*=\s*['\"]([^'\"]+)['\"]", head, re.I)
             or re.search(rb"<meta\b[^>]*charset\s*=\s*['\"]?([A-Za-z0-9_-]+)", head, re.I))
        enc = m.group(1).decode('ascii') if m else 'utf-8'
    try:
        codecs.lookup(enc)
    except LookupError:
        enc = 'utf-8'
    try:
        return raw.decode(enc), enc, 0
    except UnicodeDecodeError:
        text = raw.decode(enc, errors='replace')
        return text, enc, text.count('�') - raw.decode(enc, errors='ignore').count('�')


def html_lines(text):
    p = Text()
    p.feed(text)
    p.close()
    p.flush()
    return p.lines


def spine(z):
    """Spine member paths in reading order, or None when there is no readable OPF."""
    try:
        root = ET.fromstring(z.read('META-INF/container.xml')).find('.//{*}rootfile')
        opf_path = root.attrib['full-path']
        doc = ET.fromstring(z.read(opf_path))
    except (KeyError, AttributeError, ET.ParseError):
        return None
    base = posixpath.dirname(opf_path)
    manifest = {i.attrib.get('id'): i for i in doc.iter() if i.tag.endswith('}item') or i.tag == 'item'}
    out = []
    for ref in doc.iter():
        if not (ref.tag.endswith('}itemref') or ref.tag == 'itemref'):
            continue
        item = manifest.get(ref.attrib.get('idref'))
        if item is None:
            continue
        href = item.attrib.get('href', '').split('#')[0]
        member = posixpath.normpath(posixpath.join(base, unquote(href)))
        if member.lower().endswith(HTML_EXT) and member not in out:
            out.append(member)
    return out


def read_members(src, warn=None):
    """Yield dicts {member, heading, lines, encoding, in_spine} for every HTML member, spine order first."""
    warn = warn or (lambda msg: print(msg, file=sys.stderr))
    z = zipfile.ZipFile(src)
    names = z.namelist()
    html = [n for n in names if n.lower().endswith(HTML_EXT)]
    order = spine(z)
    if order is None:
        warn(f'{src}: no OPF spine found; using archive name order')
        order = []
    order = [m for m in order if m in names]
    rest = sorted(n for n in html if n not in set(order))
    if order and rest:
        warn(f'{src}: {len(rest)} html members not in spine, appended after it: {rest[:5]}')
    for member in order + rest:
        text, enc, bad = decode(z.read(member))
        if bad:
            warn(f'{src}: {member}: {bad} undecodable bytes replaced with U+FFFD (declared {enc})')
        lines = html_lines(text)
        heading = next((l for l in lines[:3] if HEADING.search(l) and len(l) <= HEADING_MAX), lines[0] if lines else '')
        yield dict(member=member, heading=heading, lines=lines, encoding=enc, in_spine=member in order)


def main(src, dst):
    out = {m['member']: [m['heading'], '\n'.join(m['lines'])] for m in read_members(src)}
    with open(dst, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False)
    print(len(out), 'members,', sum(len(v[1]) for v in out.values()), 'characters')


if __name__ == '__main__':
    if len(sys.argv) != 3 or sys.argv[1] in ('-h', '--help'):
        print(__doc__)
        sys.exit(0 if len(sys.argv) == 2 and sys.argv[1] in ('-h', '--help') else 2)
    main(sys.argv[1], sys.argv[2])
