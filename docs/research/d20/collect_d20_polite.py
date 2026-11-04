"""Scoped collection of d20 rules pages (Pathfinder 1e d20pfsrd, Pathfinder 2e
Archives of Nethys) through the lncrawl-polite transport. Weibao asked for it
2026-11-03 ("Scraping wiki of the two D&D wikis"; "For d20pfsrd, we consider
stuff beyond weapons too"). Resumable: pages already in the manifest are
skipped before budget. Raw HTML stays in the transport cache; extracted text
and the manifest go to the gitignored private folder. Run with the fork's venv:

  /Users/weiwei/code/lncrawl-polite/.venv-polite/bin/python \
      docs/research/d20/collect_d20_polite.py [--probe] [--section NAME]

URL discipline (added after a hand-typed index URL got HTTP 404 and closed
www.d20pfsrd.com for good on 2026-11-04): every URL fetched must have appeared
as a link in a page the transport already holds or fetched this run. Seeds
that fail this are refused locally, before any request. PF1 paths are fetched
in the site's canonical trailing-slash form (all 187 successful receipts and
the pages' rel=canonical use it), because a redirect also closes the host.

Each section: `index` seed pages, optional `follow` (links on catalogue pages
that are themselves catalogue pages, fetched unbudgeted, CATALOGUE_CAP each), and `keep`
(links that are budgeted detail pages, 300 per host per session). Run
`--probe` first; it fetches only catalogue pages and writes the link lists.
"""
import sys, re, json, hashlib, argparse
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

def rx(pattern):
    r = re.compile(pattern)
    return lambda u: bool(r.fullmatch(u)) and plausible(u)

# Canonical d20pfsrd paths are lowercase slug segments. The site also carries
# broken links (run-3: '/magic-armor/-Armor-Special-Abilities/' got 404 and
# closed the host again), so anything else is refused before a request.
SLUG = re.compile(r'(?:/[a-z0-9][a-z0-9-]*)*/')
def plausible(u):
    p = urlsplit(u)
    return p.hostname != 'www.d20pfsrd.com' or (not p.query and bool(SLUG.fullmatch(p.path)))

P = re.escape(PF1)
SECTIONS = {
    # Complete: index + 184 pages (run-2, 2026-11-04).
    'pf1-weapon-abilities': {'index': [f'{PF1}/magic-items/magic-weapons/magic-weapon-special-abilities/'],
                             'keep': rx(rf'{P}/magic-items/magic-weapons/magic-weapon-special-abilities/[^/]+/')},
    # Wider scope, 2026-11-04. Seeds are all site-linked; follow/keep paths
    # past the seed are unverified until --probe shows the catalogue.
    # Index verified by run-3 probe (200); 117 children. The broad follow that
    # reached the site's broken '-Armor-Special-Abilities/' link is gone.
    'pf1-armor-abilities': {'index': [f'{PF1}/magic-items/magic-armor/magic-armor-and-shield-special-abilities/'],
                            'keep': rx(rf'{P}/magic-items/magic-armor/magic-armor-and-shield-special-abilities/[^/]+/')},
    'pf1-cursed-items': {'index': [f'{PF1}/magic-items/'],
                         'follow': rx(rf'{P}/magic-items/cursed-items/'),
                         'keep': rx(rf'{P}/magic-items/cursed-items/[^/]+/')},
    'pf1-wondrous-items': {'index': [f'{PF1}/magic-items/'],
                           'follow': rx(rf'{P}/magic-items/wondrous-items/'),
                           'keep': rx(rf'{P}/magic-items/wondrous-items/(?:[^/]+/){{1,2}}')},
    'pf1-afflictions': {'index': [f'{PF1}/gamemastering/'],
                        'follow': rx(rf'{P}/gamemastering/afflictions/(?:[^/]+/)?'),
                        'keep': rx(rf'{P}/gamemastering/afflictions/(?:[^/]+/){{1,2}}')},
    'pf1-haunts': {'index': [f'{PF1}/gamemastering/'],
                   'follow': rx(rf'{P}/gamemastering/haunts/'),
                   'keep': rx(rf'{P}/gamemastering/haunts/[^/]+/')},
    'pf1-conditions': {'index': [f'{PF1}/gamemastering/conditions/'], 'keep': lambda u: False},
    'pf1-environment': {'index': [f'{PF1}/gamemastering/'],
                        'follow': rx(rf'{P}/gamemastering/environment/'),
                        'keep': rx(rf'{P}/gamemastering/environment/[^/]+/')},
    'pf1-skills': {'index': [f'{PF1}/skills/'], 'keep': rx(rf'{P}/skills/[^/]+/')},
    'pf1-crafting': {'index': [f'{PF1}/feats/', f'{PF1}/magic-items/'],
                     'follow': rx(rf'{P}/feats/item-creation-feats/'),
                     'keep': rx(rf'{P}/(?:feats/item-creation-feats/[^/]+|magic-items/[^/]*creat[^/]*)/')},
    'pf1-spells-transmutation': {'index': [f'{PF1}/magic/'],
                                 'follow': rx(rf'{P}/magic/[^/]*transmutation[^/]*/'),
                                 'keep': rx(rf'{P}/magic/all-spells/[a-z0-9]/[^/]+/')},
    'pf1-spells-illusion': {'index': [f'{PF1}/magic/'],
                            'follow': rx(rf'{P}/magic/[^/]*illusion[^/]*/'),
                            'keep': rx(rf'{P}/magic/all-spells/[a-z0-9]/[^/]+/')},
    'pf1-universal-monster-rules': {'index': [f'{PF1}/bestiary/rules-for-monsters/universal-monster-rules/'],
                                    'keep': rx(rf'{P}/bestiary/rules-for-monsters/universal-monster-rules/[^/]+/')},
    'pf2-diseases': {'index': [f'{AON}/Diseases.aspx'], 'keep': lambda u: u.startswith(f'{AON}/Diseases.aspx?ID=')},
    'pf2-curses': {'index': [f'{AON}/Curses.aspx'], 'keep': lambda u: u.startswith(f'{AON}/Curses.aspx?ID=')},
    'pf2-conditions': {'index': [f'{AON}/Conditions.aspx'], 'keep': lambda u: u.startswith(f'{AON}/Conditions.aspx?ID=')},
}
CATALOGUE_CAP = 25  # unbudgeted catalogue pages per section; past this, widen by a reviewed edit
CONTENT = {'www.d20pfsrd.com': ['#article-content', 'article', '.entry-content'], '2e.aonprd.com': ['#main', 'main', '#ctl00_RadDrawer1_Content_MainContent_DetailedOutput']}

def norm(url):
    p = urlsplit(url.strip())
    path = p.path
    if p.netloc.lower() == 'www.d20pfsrd.com':
        if path and not path.endswith('/') and '.' not in path.rsplit('/', 1)[-1]: path += '/'
        return urlunsplit((p.scheme, 'www.d20pfsrd.com', path, '', ''))
    return urlunsplit((p.scheme, p.netloc.lower(), path, p.query, ''))

def links_of(soup, base):
    return {norm(urljoin(base, el['href'])) for el in soup.select('a[href]')}

def held_links():
    """Links on every page the transport already holds (local cache read, no request)."""
    seen = set()
    for meta in (TRANSPORT / 'cache').glob('*.json'):
        info = json.loads(meta.read_text())
        if info.get('status') != 200 or urlsplit(info['url']).hostname not in CONTENT: continue
        seen.add(norm(info['url']))
        seen |= links_of(BeautifulSoup(meta.with_suffix('.bin').read_bytes(), 'html.parser'), info['url'])
    return seen

def text_of(body, host):
    soup = BeautifulSoup(body, 'html.parser')
    for t in soup(['script', 'style', 'nav', 'noscript']): t.decompose()
    node = next((soup.select_one(s) for s in CONTENT.get(host, []) if soup.select_one(s)), soup.body or soup)
    return soup, node.get_text('\n', strip=True), (soup.title.get_text(strip=True) if soup.title else '')

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--probe', action='store_true', help='fetch catalogue pages only and list in-scope links')
    ap.add_argument('--section', action='append', help='limit to these sections')
    a = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = OUT / 'manifest.jsonl'
    done = {json.loads(l)['url'] for l in manifest.open()} if manifest.exists() else set()
    linked = held_links()
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

        def get(section, url, kind):
            """One guarded fetch. Returns the page's links, or None if refused/closed."""
            host = urlsplit(url).hostname
            if host in closed: return None
            if url not in linked or not plausible(url):
                print('REFUSE (not site-linked or malformed)', section, url, flush=True); return None
            try:
                if kind == 'page':
                    with c.chapter(url):
                        body, info = c.fetch(url)
                else:
                    body, info = c.fetch(url)  # cache hit if held
            except StopHost as e:
                closed.add(host); print('STOP', section, e, flush=True); return None
            if url not in done: save(section, url, body, info, kind)
            found = links_of(BeautifulSoup(body, 'html.parser'), url)
            linked.update(found)
            return found

        for name, sec in SECTIONS.items():
            if a.section and name not in a.section: continue
            follow, keep = sec.get('follow', lambda u: False), sec['keep']
            catalogue, links = list(sec['index']), []
            for idx in catalogue:  # grows through `follow` links, capped
                found = get(name, idx, 'index')
                if found is None: continue
                for u in sorted(found):
                    if follow(u) and u not in catalogue:
                        if len(catalogue) < CATALOGUE_CAP: catalogue.append(u)
                        else: print('CATALOGUE CAP', name, u, flush=True)
                    elif keep(u) and u not in catalogue and u not in links: links.append(u)
            todo = [u for u in links if u not in done]
            print(f'{name}: {len(catalogue)} catalogue, {len(links)} in scope, {len(todo)} to fetch', flush=True)
            if a.probe:
                (OUT / f'{name}.links.json').write_text(json.dumps({'catalogue': catalogue, 'pages': links}, indent=1)); continue
            for u in todo:
                if get(name, u, 'page') is None and urlsplit(u).hostname in closed: break

if __name__ == '__main__':
    main()
