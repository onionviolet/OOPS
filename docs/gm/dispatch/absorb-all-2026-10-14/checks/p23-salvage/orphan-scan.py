# Bounded source-reference check, not proof of native acquisition reachability.
import re, pathlib, json
source = pathlib.Path('src/crafting_recipes.js').read_text()
other = '\n'.join(p.read_text() for p in pathlib.Path('src').rglob('*.js') if p.name != 'crafting_recipes.js')
rows = []
for m in re.finditer(r'(\w+)_recipes\.(\w+)\["([^"]+)"\]\s*=\s*new \w+\(\{(.{0,260})', source, re.S):
    if 'is_unlocked: false' not in m[4]: continue
    rows.append({'category': m[1], 'subcategory': m[2], 'id': m[3],
        'has_acquisition_reference': bool(re.search(r'recipe_id:\s*["\']' + re.escape(m[3]) + r'["\']', other))})
print(json.dumps({'kind': 'source reference scan only; native reachability unproved', 'rows': rows}, indent=2))
