"""Scoped collection of d20 rules pages (Pathfinder 1e d20pfsrd, Pathfinder 2e
Archives of Nethys) through the lncrawl-polite transport. Weibao asked for it
2026-11-03 ("Scraping wiki of the two D&D wikis"). Index pages are fetched as
catalogue; each detail page spends one reader budget unit (300 per host per
session). Resumable: pages already in the manifest are skipped before budget.
Raw HTML stays in the transport cache; extracted text and the manifest go to
the gitignored private folder. Run with the fork's venv python:

  /Users/weiwei/code/lncrawl-polite/.venv-polite/bin/python \
      docs/research/d20/collect_d20_polite.py [--probe] [--section NAME]
"""
import sys, json, hashlib, argparse
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit
sys.path.insert(0, '/Users/weiwei/code/lncrawl-polite')
from lncrawl.polite.transport import Client, StopHost
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[3]
TRANSPORT = ROOT / 'docs/research/novels/power-scout-2026-10-10/transport'  # the shared normal data dir
OUT = ROOT / 'docs/research/d20/private'

PF1 = 'https://www.d20pfsrd.com'
AON = 'https://2e.aonprd.com'
# Each section: index pages, and the URL test that keeps a link in scope.
SECTIONS = {
    'pf1-weapon-abilities': {'index': [f'{PF1}/magic-items/magic-weapons/magic-weapon-special-abilities/'],
                             'keep': lambda u: u.startswith(f'{PF1}/magic-items/magic-weapons/magic-weapon-special-abilities/')},
    'pf1-armor-abilities': {'index': [f'{PF1}/magic-items/magic-armor/magic-armor-special-abilities/'],
                            'keep': lambda u: u.startswith(f'{PF1}/magic-items/magic-armor/magic-armor-special-abilities/')},
    'pf1-afflictions': {'index': [f'{PF1}/gamemastering/afflictions/'],
                        'keep': lambda u: u.startswith(f'{PF1}/gamemastering/afflictions/')},
    'pf1-conditions': {'index': [f'{PF1}/gamemastering/conditions/'], 'keep': lambda u: u == f'{PF1}/gamemastering/conditions/'},
    'pf1-disguise': {'index': [f'{PF1}/skills/disguise/', f'{PF1}/skills/bluff/', f'{PF1}/skills/perception/',
                               f'{PF1}/magic/all-spells/a/alter-self/', f'{PF1}/magic/all-spells/d/disguise-self/',
                               f'{PF1}/magic/all-spells/t/true-seeing/', f'{PF1}/magic/all-spells/s/seeming/',
                               f'{PF1}/magic/all-spells/v/veil/'], 'keep': lambda u: False},
    'pf2-diseases': {'index': [f'{AON}/Diseases.aspx'], 'keep': lambda u: u.startswith(f'{AON}/Diseases.aspx?ID=')},
    'pf2-curses': {'index': [f'{AON}/Curses.aspx'], 'keep': lambda u: u.startswith(f'{AON}/Curses.aspx?ID=')},
    'pf2-conditions': {'index': [f'{AON}/Conditions.aspx'], 'keep': lambda u: u.startswith(f'{AON}/Conditions.aspx?ID=')},
}
CONTENT = {'www.d20pfsrd.com': ['#article-content', 'article', '.entry-content'], '2e.aonprd.com': ['#main', 'main', '#ctl00_RadDrawer1_Content_MainContent_DetailedOutput']}

def norm(url):
    p = urlsplit(url)
    return urlunsplit((p.scheme, p.netloc.lower(), p.path, p.query, ''))

def text_of(body, host):
    soup = BeautifulSoup(body, 'html.parser')
    for t in soup(['script', 'style', 'nav', 'noscript']): t.decompose()
    node = next((soup.select_one(s) for s in CONTENT.get(host, []) if soup.select_one(s)), soup.body or soup)
    return soup, node.get_text('\n', strip=True), (soup.title.get_text(strip=True) if soup.title else '')

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--probe', action='store_true', help='fetch index pages only and list in-scope links')
    ap.add_argument('--section', action='append', help='limit to these sections')
    a = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = OUT / 'manifest.jsonl'
    done = {json.loads(l)['url'] for l in manifest.open()} if manifest.exists() else set()
    closed = set()
    with Client(TRANSPORT) as c, manifest.open('a') as out:
        def save(section, url, body, info, kind):
            host = urlsplit(url).hostname
            soup, text, title = text_of(body, host)
            h = hashlib.sha256(url.encode()).hexdigest()[:16]
            folder = OUT / section; folder.mkdir(exist_ok=True)
            (folder / f'{h}.txt').write_text(f'{title}\n{url}\n\n{text}')
            row = {'section': section, 'kind': kind, 'url': url, 'title': title, 'status': info['status'],
                   'sha256': info['sha256'], 'chars': len(text), 'text': str((folder / f'{h}.txt').relative_to(ROOT))}
            out.write(json.dumps(row) + '\n'); out.flush(); done.add(url)
            print(section, kind, info['status'], len(text), title[:70], flush=True)
            return soup
        for name, sec in SECTIONS.items():
            if a.section and name not in a.section: continue
            links = []
            for idx in sec['index']:
                host = urlsplit(idx).hostname
                if host in closed: break
                try:
                    body, info = c.fetch(idx)
                except StopHost as e:
                    closed.add(host); print('STOP', name, e, flush=True); break
                soup = save(name, idx, body, info, 'index') if idx not in done else BeautifulSoup(body, 'html.parser')
                for el in soup.select('a[href]'):
                    u = norm(urljoin(idx, el['href']))
                    if sec['keep'](u) and u not in sec['index'] and u not in links: links.append(u)
            todo = [u for u in links if u not in done]
            print(f'{name}: {len(links)} in scope, {len(todo)} to fetch', flush=True)
            if a.probe:
                (OUT / f'{name}.links.json').write_text(json.dumps(links, indent=1)); continue
            for u in todo:
                host = urlsplit(u).hostname
                if host in closed: break
                try:
                    with c.chapter(u):
                        body, info = c.fetch(u)
                    save(name, u, body, info, 'page')
                except StopHost as e:
                    closed.add(host); print('STOP', name, e, flush=True); break

if __name__ == '__main__':
    main()
