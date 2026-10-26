"""Finite follow-through checks: added links, retained summaries and source locators.

This does not certify authority, gameplay or full-tree documentation consistency.
"""
from pathlib import Path
import difflib
import hashlib
import json
import re

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
baseline = json.loads((HERE / 'baseline.json').read_text())
snapshot = Path(baseline['snapshot'])
errors = []
patch = []
hashes = {}
links_checked = 0
changed = []


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def anchors(path):
    found, counts, fenced = set(), {}, False
    for line in path.read_text().splitlines():
        if line.startswith('```'):
            fenced = not fenced
        match = not fenced and re.match(r'^#{1,6}\s+(.+?)\s*#*$', line)
        if match:
            title = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', match[1])
            title = re.sub(r'[`*_]', '', title).lower().strip()
            slug = ''.join(c for c in title if c.isalnum() or c.isspace() or c == '-')
            slug = re.sub(r'\s', '-', slug)
            count = counts.get(slug, 0)
            counts[slug] = count + 1
            found.add(f'{slug}-{count}' if count else slug)
        found.update(re.findall(r'<a\s+(?:id|name)="([^"]+)"', line))
    return found


def check_text(path, text):
    global links_checked
    for target in re.findall(r'\[[^\]]+\]\(([^)]+)\)', text):
        if '://' in target:
            continue
        file, _, anchor = target.partition('#')
        resolved = (path.parent / file).resolve() if file else path
        links_checked += 1
        if not resolved.exists():
            errors.append(f'missing target {path.relative_to(ROOT)}: {target}')
        elif anchor and resolved.suffix == '.md' and anchor not in anchors(resolved):
            errors.append(f'missing anchor {path.relative_to(ROOT)}: {target}')
    if '\u2014' in text:
        errors.append(f'em dash in added text: {path.relative_to(ROOT)}')
    if any(line.rstrip() != line for line in text.splitlines()):
        errors.append(f'trailing whitespace in added text: {path.relative_to(ROOT)}')


for original in sorted(snapshot.rglob('*.md')):
    rel = original.relative_to(snapshot)
    current = ROOT / rel
    old, new = original.read_text(), current.read_text()
    hashes[str(rel)] = digest(current)
    if old == new:
        continue
    changed.append(str(rel))
    diff = list(difflib.unified_diff(old.splitlines(True), new.splitlines(True),
                                  fromfile='baseline/' + str(rel), tofile='current/' + str(rel)))
    patch.extend(diff)
    additions = '\n'.join(line[1:].rstrip('\n') for line in diff
                          if line.startswith('+') and not line.startswith('+++'))
    check_text(current, additions)
    if str(rel) in ['PROJECT.md', 'docs/USER_VISION.md']:
        remaining = iter(new.splitlines())
        dropped = [line for line in old.splitlines() if not any(v == line for v in remaining)]
        if dropped:
            errors.append(f'{rel}: {len(dropped)} original summary lines lost')

locators = [
    ('src/structured_ability_runtime.js', 'compileStructuredAbilities', 'export function compileStructuredAbilities(definition)'),
    ('src/structured_ability_runtime.js', 'timed refund assertion', "Timed ability must return reservations when held support is lost."),
    ('src/simulation.js', 'startCommand', 'function startCommand(out, registry, commandId'),
    ('src/simulation.js', 'support snapshot', 'job.completionSupport = {schema: 1'),
    ('src/simulation.js', 'completeJob', 'function completeJob(out, job, registry'),
    ('src/simulation_contracts.js', 'createSimulationRegistry', 'export function createSimulationRegistry(definitions'),
    ('src/simulation_contracts.js', 'paid-forfeit scope', "const paidForfeit = d.group?.startsWith('remainder_')"),
    ('tests/structured_ability_runtime.test.js', 'existing lost-support fixture', "test('timed ability rechecks source support and refunds reservation on method loss'"),
    ('src/book_world_lotm_abilities.js', 'authored costs disclaimer', 'looks are authored proposals'),
    ('src/book_world_lotm_abilities.js', 'stamina cost helper', "const stamina=n=>({type:'vital',key:'stamina',amount:-n})"),
    ('src/book_world_lotm_actions.js', 'Seer lesson resource', "Take the control lesson: learn bounded material perception · 1 spirituality"),
    ('src/world_packs/book_hp_life_data.js', 'school spell stamina and stock', "costs:[{type:'item',key:key(r.input),amount:-1},{type:'vital',key:'stamina',amount:-1}]"),
]
located = []
for rel, symbol, needle in locators:
    path = ROOT / rel
    lines = path.read_text().splitlines()
    matches = [i + 1 for i, line in enumerate(lines) if needle in line]
    if len(matches) != 1:
        errors.append(f'locator {symbol}: expected one match, found {len(matches)}')
    located.append({'path': rel, 'symbol': symbol, 'line': matches[0] if len(matches) == 1 else None, 'needle': needle})
    hashes[rel] = digest(path)

evidence = ['docs/audits/RULES_CONSIDERATION_2026-10-26.md',
            'docs/gm/dispatch/rules-consideration-2026-10-26/coverage-map.json']
for rel in evidence:
    hashes[rel] = digest(ROOT / rel)
    if hashes[rel] != baseline['sha256'][rel]:
        errors.append(f'read-only consideration evidence changed: {rel}')

(HERE / 'changes.patch').write_text(''.join(patch))
(HERE / 'final-inputs.json').write_text(json.dumps({
    'scope': 'non-UI documentation and inspected source only; no runtime verification',
    'changed_owner_paths': changed, 'sha256': hashes, 'source_locators': located,
}, indent=2) + '\n')
for path in sorted(HERE.glob('*.md')):
    check_text(path, path.read_text())

print(f'{len(changed)} changed owners; {links_checked} added/receipt local links and anchors; {len(located)} source locators')
print('PROJECT/USER_VISION baseline lines retained; original consideration evidence unchanged')
for error in errors:
    print('FAIL:', error)
if errors:
    raise SystemExit(1)
print('PASS: bounded document/locator checks; semantic diff review remains separate')
