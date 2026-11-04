"""Compare Foundry PF1 spell records with the d20pfsrd spell pages. Offline; prints counts only.
Usage: python3 -I docs/research/d20/spell_coverage.py docs/research/d20/private"""
import json, re, sys, pathlib, collections
priv = pathlib.Path(sys.argv[1]); root = priv/'repos/foundry-pf1/packs/spells'
def norm(s): return re.sub(r'[^a-z0-9]', '', s.lower().split(' – ')[0].split(' - ')[0])
spells = []; classes = collections.Counter(); srcs = collections.Counter(); sorcwiz = 0
for p in root.rglob('*.yaml'):
    t = p.read_text(encoding='utf-8')
    m = re.search(r'^name: (.+)$', t, re.M)
    if not m or not re.search(r'^type: spell', t, re.M): continue
    blk = re.search(r'learnedAt:\n    class:\n((?:      .+\n)+)', t)
    cl = re.findall(r'^      ([a-zA-Z/]+):', blk.group(1), re.M) if blk else []
    for c in cl: classes[c] += 1
    ids = re.findall(r'- id: (\S+)', t)
    srcs['PZO' if any(i.startswith('PZO') for i in ids) else ('none' if not ids else 'other')] += 1
    if any(c in ('wizard', 'sorcerer') for c in cl): sorcwiz += 1
    spells.append(norm(m.group(1).strip().strip("'\"")))
held = set()
for line in open(priv/'manifest.jsonl', encoding='utf-8'):
    r = json.loads(line)
    if 'spell' in r.get('section', '') or r.get('section', '').startswith('pf1-spells'):
        held.add(norm(r.get('title') or ''))
fs = set(spells)
print('foundry spells', len(spells), 'unique names', len(fs), 'sorc/wiz', sorcwiz)
print('d20pfsrd held spell titles', len(held))
print('in both', len(fs & held), 'foundry only', len(fs - held), 'd20 only', len(held - fs))
print('sources', dict(srcs)); print('top classes', classes.most_common(30))
print('d20-only sample', sorted(held - fs)[:15])
