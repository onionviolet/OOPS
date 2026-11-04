"""Build src/data/pf1/goods.json from the Foundry PF1 item packs (names, numbers, product codes only; no prose).
Run: python3 -I docs/research/d20/build_pf1_goods.py"""
import glob, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
PACKS = os.path.join(ROOT, 'docs/research/d20/private/repos/foundry-pf1/packs/items')
OUT = os.path.join(ROOT, 'src/data/pf1/goods.json')
TYPES = {'loot', 'equipment', 'container', 'weapon'}
SUBTYPES = {'gear', 'adventuring', 'clothing', 'food', 'tradeGoods', 'tool', 'misc'}
UNIT_GP = {'pp': 10, 'gp': 1, 'sp': 0.1, 'cp': 0.01}

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

def scalar(v):
    v = v.strip()
    if len(v) >= 2 and v[0] == v[-1] and v[0] in '\'"':
        v = v[1:-1].replace("''", "'")
    return v

def block(t, key):
    m = re.search(r'^  %s:[ \t]*\n((?:    .*\n|\n)*)' % key, t, re.M)
    return m.group(1) if m else ''

def num(text, key):
    m = re.search(r'^    %s: (-?[\d.]+)\s*$' % key, text, re.M)
    return float(m.group(1)) if m else None

rows = []
for f in sorted(glob.glob(os.path.join(PACKS, '**/*.yaml'), recursive=True)):
    if os.path.basename(f).startswith('_'):
        continue
    t = open(f, encoding='utf-8').read()
    ty = re.search(r'^type: (\S+)', t, re.M)
    if not ty or ty.group(1) not in TYPES:
        continue
    st = re.search(r'^  subType: (\S+)', t, re.M)
    sub = st.group(1) if st else None
    if ty.group(1) == 'container' and sub is None:
        sub = 'container'  # containers carry no subType; kept as their own category
    if sub not in SUBTYPES | {'container'}:
        continue
    if re.search(r'^  cl: [1-9]', t, re.M):
        continue  # a caster level marks a magic item; this table is ordinary goods
    nm = re.search(r'^name: (.+)$', t, re.M)
    pr = block(t, 'price')
    base, unit = num(pr, 'base'), re.search(r'^    unit: (\w+)', pr, re.M)
    if nm is None or base is None or not unit or unit.group(1) not in UNIT_GP:
        continue
    wb = block(t, 'weight')
    m = re.search(r'^    value: (-?[\d.]+)\s*$', wb, re.M)  # top-level value, not reduction.value (deeper indent)
    w = float(m.group(1)) if m else None
    src = re.search(r'^    - id: (\S+)', block(t, 'sources'), re.M)
    iid = re.search(r'^_id: (\S+)', t, re.M).group(1)
    name = scalar(nm.group(1))
    rows.append((slug(name), iid, {'id': '', 'name': name, 'category': sub, 'priceGp': round(base * UNIT_GP[unit.group(1)], 4),
                                   'weightLb': w, 'source': scalar(src.group(1)) if src else None}))

seen = {}
for s, _, _ in rows:
    seen[s] = seen.get(s, 0) + 1
out = []
for s, iid, r in rows:
    r['id'] = 'pf1.goods.' + (s if seen[s] == 1 else '%s-%s' % (s, iid[:6].lower()))
    out.append(r)
out.sort(key=lambda r: r['id'])
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, 'w', encoding='utf-8') as fh:
    json.dump(out, fh, indent=1, ensure_ascii=False); fh.write('\n')
counts = {}
for r in out:
    counts[r['category']] = counts.get(r['category'], 0) + 1
print(len(out), counts)
