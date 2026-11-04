#!/usr/bin/env python3
"""List the open rows of the download wishlist, for Anna's and Z-Library runs.

Usage: python3 -I scripts/wishlist_queue.py [--json] [--all] [--grep TEXT]

Reads docs/research/DOWNLOAD_WISHLIST_2026-10-30.md, the ranked to-download
list. Each row gets a state. closed: the row says so explicitly (its item is struck
through with nothing marked next, it starts "Acquired:" or "**Done**", it says
"Closed by", or a "Done" section names its code). partial: the row mentions
something held, acquired or downloaded but is not closed, so part of it may
still be wanted. open: everything else. Runs take open rows and recheck
partial ones; to close a row, use one of the explicit forms above. The script only
reads the list. A run still checks holdings first (scripts/library_coverage.py,
the catalogues), still needs Weibao's yes for anything bought, and records the
DL code of each row it fetches in its receipt and back in the wishlist.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
WISHLIST = ROOT / 'docs/research/DOWNLOAD_WISHLIST_2026-10-30.md'
ROW = re.compile(r'^\| (DL\d+) \| (.+?) \| (.*)\|\s*$')
MENTION = re.compile(r'\b(held|done|fetched|acquired|downloaded)\b', re.I)
NEXT = re.compile(r'\b(next|new|remaining|still|wanted)\b', re.I)


def explicit_close(item, line):
    if re.match(r'^(Acquired:|\*\*Done)', item) or 'Closed by' in line or '**Done' in line:
        return True
    return item.startswith('~~') and not NEXT.search(line)


def rows(text):
    done, section, out = set(), '', []
    for line in text.splitlines():
        if line.startswith('#'):
            section = line.lstrip('#').strip()
        m = ROW.match(line)
        if m:
            code, item, rest = m.groups()
            cells = [c.strip() for c in rest.split('|')]
            out.append({'code': code, 'item': item.strip(), 'why': cells[0] if cells else '',
                        'route': cells[1] if len(cells) > 1 else '', 'section': section,
                        'state': 'closed' if explicit_close(item.strip(), line) else 'partial' if MENTION.search(line) else 'open'})
        if re.search(r'\bDone\b', section):
            done.update(re.findall(r'\bDL\d+\b', re.split(r'(?i)\b(still open|not fetched|open:)', line)[0]))
    for r in out:
        if r['code'] in done:
            r['state'] = 'closed'
    return out


def main(argv):
    as_json = '--json' in argv
    needle = argv[argv.index('--grep') + 1].lower() if '--grep' in argv else None
    want = 'all' if '--all' in argv else None
    open_rows = [r for r in rows(WISHLIST.read_text(encoding='utf-8')) if want or r['state'] != 'closed']
    if needle:
        open_rows = [r for r in open_rows if needle in (r['item'] + r['why'] + r['route']).lower()]
    if as_json:
        print(json.dumps(open_rows, ensure_ascii=False, indent=1))
        return
    for r in open_rows:
        print(f"{r['code']:5} {r['state']:7} {r['item'][:85]}" + (f"  [{r['route'][:40]}]" if r['route'] else ''))
    counts = {k: sum(r['state'] == k for r in open_rows) for k in ('open', 'partial', 'closed')}
    print(', '.join(f'{v} {k}' for k, v in counts.items() if v))


if __name__ == '__main__':
    main(sys.argv[1:])
