#!/usr/bin/env python3
"""Build private evidence packets for the Luna label passes (advancement-aspects-2026-11-16).

Passes: ri_moves (paid reader claims plus the move's Fandom page), gu_kinds (the kind's Fandom page, for
rank- or effect-blocked rows), hp_potions (the potion's Fandom page). Reads the gitignored Gu review index
and the local wiki dumps under ~/.codex/research/wikis; writes docs/research/advancement-aspects-2026-11-16/
private/<pass>_packets.json. Wiki text stays private. Run with python3 -I.
"""
import glob, json, os, re, sys, urllib.parse
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'docs/research/advancement-aspects-2026-11-16/private')
WIKIS = os.path.expanduser('~/.codex/research/wikis')
CAP = 9000  # characters of cleaned page text per packet


def pages(xml_path, wanted):
    """Stream a Fandom pages_current dump and keep namespace-0 pages whose title is wanted (redirects followed once)."""
    found, redirects = {}, {}
    for _, el in ET.iterparse(xml_path, events=('end',)):
        if not el.tag.endswith('}page'):
            continue
        ns = el.find('{*}ns')
        title = el.findtext('{*}title') or ''
        if ns is not None and ns.text == '0':
            text = el.findtext('{*}revision/{*}text') or ''
            rev = el.findtext('{*}revision/{*}id') or ''
            m = re.match(r'(?i)\s*#redirect\s*\[\[([^\]|#]+)', text)
            if m:
                redirects[title] = m.group(1).strip()
            elif title in wanted:
                found[title] = (rev, text)
        el.clear()
    missing = {t for t in wanted if t not in found and redirects.get(t)}
    if missing:
        targets = {redirects[t] for t in missing}
        more = pages(xml_path, targets) if targets - set(found) else {}
        for t in missing:
            hit = found.get(redirects[t]) or more.get(redirects[t])
            if hit:
                found[t] = hit
    return found


def clean(text):
    text = re.sub(r'<ref[^>]*/>|<ref[^>]*>.*?</ref>', '', text, flags=re.S)
    text = re.sub(r'<!--.*?-->', '', text, flags=re.S)
    text = re.sub(r'\[\[(?:File|Image|Category):[^\]]*\]\]', '', text)
    text = re.sub(r'\[\[(?:[^\]|]*\|)?([^\]]*)\]\]', r'\1', text)
    text = re.sub(r"'{2,}", '', text)
    return re.sub(r'\n{3,}', '\n\n', text).strip()


def sections(title, text):
    """Split cleaned wikitext into evidence lines, each tagged [wiki:<title>#<section>]."""
    out, head, buf = [], 'intro', []
    for line in clean(text).splitlines():
        m = re.match(r'^\s*(=+)\s*(.+?)\s*\1\s*$', line)
        if m:
            if buf:
                out.append(f'[wiki:{title}#{head}] ' + ' '.join(buf))
            head, buf = m.group(2), []
        elif line.strip():
            buf.append(line.strip())
    if buf:
        out.append(f'[wiki:{title}#{head}] ' + ' '.join(buf))
    kept, size = [], 0
    for line in out:
        if size + len(line) > CAP:
            line = line[:max(0, CAP - size)]
        if line:
            kept.append(line)
            size += len(line)
        if size >= CAP:
            break
    return kept


def title_of(url):
    path = urllib.parse.urlparse(url).path
    return urllib.parse.unquote(path.split('/wiki/', 1)[1]).replace('_', ' ') if '/wiki/' in path else None


def ri_moves():
    join = json.load(open(os.path.join(ROOT, 'docs/research/reverend-insanity-move-claims-2026-11-16/MOVE_CLAIMS_JOIN.json')))
    claims = {}
    for f in glob.glob(os.path.join(ROOT, 'docs/research/novels/full-book/reverend-insanity/readers/*-CLAIMS.json')):
        for c in json.load(open(f)).get('claims', []):
            claims[c['id']] = c
    index = json.load(open(os.path.join(ROOT, 'docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json')))
    wiki_title = {}
    for lead in index['move_candidates']['records']:
        url = (lead.get('saga') or {}).get('url') or (lead.get('fandom') or {}).get('url')
        slug = 'lead:' + url.split('?')[0].rstrip('/').split('/')[-1].lower()
        if (lead.get('fandom') or {}).get('url'):
            wiki_title[slug] = title_of(lead['fandom']['url'])
    leads = [r for r in join['rows'] if r['kind'] == 'wiki-lead']
    wiki = pages(os.path.join(WIKIS, 'reverend-insanity.fandom.com/dump/reverendinsanity_pages_current.xml'),
                 {t for t in wiki_title.values() if t})
    packets = []
    for r in leads:
        ev = [f"[claim:{c['id']} ch{c['chapter']} b{c['blocks']}] ({claims[c['id']].get('kind')}) {claims[c['id']]['claim']}"
              for c in r['claims'][:40] if c['id'] in claims]
        t = wiki_title.get(r['id'])
        if t and t in wiki:
            ev += sections(t, wiki[t][1])
        if ev:
            packets.append({'id': r['id'], 'move': r['name'], 'tier': r['tier'], 'evidence': ev})
    return packets


def gu_kinds():
    labels = json.load(open(os.path.join(ROOT, 'docs/coverage/gu_labels.json')))['kinds']
    rows = [json.loads(l) for l in open(os.path.join(ROOT, 'docs/coverage/gu_kinds.jsonl'))]
    todo = [r for r in rows if r['state'] in ('blocked:rank-unknown', 'blocked:effect-unknown')]
    want = {}
    for r in todo:
        url = next((s.strip() for s in r['source'].split(';') if 'fandom.com/wiki/' in s), None)
        if url:
            want[r['id']] = title_of(url)
    wiki = pages(os.path.join(WIKIS, 'reverend-insanity.fandom.com/dump/reverendinsanity_pages_current.xml'), set(want.values()))
    packets = []
    for r in todo:
        t = want.get(r['id'])
        if t and t in wiki:
            packets.append({'id': r['id'], 'name': labels.get(r['id'], {}).get('name', t), 'state': r['state'], 'evidence': sections(t, wiki[t][1])})
    return packets


def hp_potions():
    rows = [json.loads(l) for l in open(os.path.join(ROOT, 'docs/coverage/hp_potions.jsonl'))]
    todo = [r for r in rows if not r['state'].startswith('not-a-thing')]
    want = {r['id']: title_of(r['source'].split(';')[0].strip()) for r in todo}
    wiki = pages(os.path.join(WIKIS, 'harrypotter.fandom.com/dump/harrypotter_pages_current.xml'), {t for t in want.values() if t})
    return [{'id': r['id'], 'name': want[r['id']], 'state': r['state'], 'evidence': sections(want[r['id']], wiki[want[r['id']]][1])}
            for r in todo if want.get(r['id']) in wiki]


# Sections that list appearances or references rather than what the ingredient is or does.
HP_SKIP = re.compile(r'(?i)^(appearances|see also|notes and references|references|notes|external links|gallery|etymology|behind the scenes)$')


def hp_ingredients():
    """Every Hogwarts ingredient row that is a thing (runs-authored rows included, since they are the
    comparison set). HP_DUMP_XML points at the unpacked dump when it is not beside the archive."""
    rows = [json.loads(l) for l in open(os.path.join(ROOT, 'docs/coverage/hp_ingredients.jsonl'))]
    todo = [r for r in rows if not r['state'].startswith('not-a-thing')]
    want = {r['id']: title_of(r['source'].split(';')[0].strip()) for r in todo}
    xml = os.environ.get('HP_DUMP_XML') or os.path.join(WIKIS, 'harrypotter.fandom.com/dump/harrypotter_pages_current.xml')
    wiki = pages(xml, {t for t in want.values() if t})
    out = []
    for r in todo:
        t = want.get(r['id'])
        if t not in wiki:
            continue
        ev = [line for line in sections(t, re.sub(r'(?ms)^\s*(=+)\s*(?:Appearances|See also|Notes and references|External links|Gallery)\s*\1.*', '', wiki[t][1]))
              if not HP_SKIP.match(re.match(r'\[wiki:[^#]*#([^\]]*)\]', line).group(1))]
        if ev:
            out.append({'id': r['id'], 'name': t, 'state': r['state'], 'evidence': ev})
    return out


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for name in sys.argv[1:] or ['ri_moves', 'gu_kinds', 'hp_potions']:
        packets = globals()[name]()
        json.dump(packets, open(os.path.join(OUT, f'{name}_packets.json'), 'w'))
        chars = sum(len(' '.join(p['evidence'])) for p in packets)
        print(json.dumps({'pass': name, 'packets': len(packets), 'evidenceChars': chars}))
