#!/usr/bin/env python3
"""PF1 corpus for the TTRPG rules pass: the collected d20pfsrd pages (private manifest in the main checkout) grouped into
four text files under docs/research/tabletop-rules-2026-11-17/private/text/. Index pages and the Foundry 'catalogue' are skipped."""
import json, os
MAIN = '/Users/weiwei/code/yet-another-idle-rpg'
GROUPS = {'pf1-spells': lambda s: s.startswith('pf1-spells'), 'pf1-wondrous-items': lambda s: s == 'pf1-wondrous-items',
          'pf1-rules': lambda s: s in ('pf1-skills', 'pf1-environment', 'pf1-afflictions', 'pf1-crafting', 'pf1-haunts'),
          'pf1-weapon-armor-abilities': lambda s: s in ('pf1-weapon-abilities', 'pf1-armor-abilities')}
out = {g: [] for g in GROUPS}
for l in open(f'{MAIN}/docs/research/d20/private/manifest.jsonl'):
    r = json.loads(l)
    if not r.get('text') or r.get('kind') == 'index': continue
    for g, f in GROUPS.items():
        if f(r['section']):
            p = os.path.join(MAIN, r['text'])
            if os.path.exists(p): out[g].append(f"\n\n##### PAGE {r['title']} | {r['url']}\n" + open(p, errors='ignore').read())
for g, parts in out.items():
    open(f'docs/research/tabletop-rules-2026-11-17/private/text/{g}.txt', 'w').write(''.join(parts))
    print(g, len(parts), sum(len(p.split()) for p in parts), 'words')
