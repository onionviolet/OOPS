"""Reproduce C4 prep from local merged metadata, without reading/claiming source prose."""
import collections
import hashlib
import json
import math
from pathlib import Path
import re

ROOT = Path.cwd()
OWN = ROOT / 'docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c4'
BASE = ROOT / 'docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27'
DEST = BASE / 'l4/v4plus'
MERGED = BASE / 'm4-whole-book-2026-10-29/merged'
KINDS = {'rite', 'divination', 'summons', 'potion', 'craft'}
def read(p):
    return [json.loads(line) for line in p.read_text().splitlines() if line.strip()]
def write(p, rows):
    p.write_text(''.join(json.dumps(r, ensure_ascii=False) + '\n' for r in rows))
def relative(p):
    return str(p.relative_to(ROOT))
def digest(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()
def volume(row):
    shard = row.get('shard', '')
    m = re.match(r'lotm([2-8])c|b([2-8])s', shard)
    if m:
        return int(next(x for x in m.groups() if x))
    loc = row.get('locator', row.get('firstMention', ''))
    m = re.search(r'\bb([2-8])\b', loc)
    return int(m[1]) if m else 1

def build():
    # Called explicitly. Never overwrites reader outputs.
    extras = read(MERGED / 'extras.jsonl')
    registry = read(MERGED / 'registry.jsonl')
    prior = sorted(p for p in (BASE / 'l4').glob('luna*.jsonl') if 'placeholder' not in p.name)
    authored, covered = [], set()
    for p in prior:
        for n, row in enumerate(read(p), 1):
            ids = row.get('ids', [row['id']] if 'id' in row else [])
            if 'unread' in row:
                continue
            covered.update(ids)
            if row.get('family') == 'no_content':
                continue
            label = row.get('label') or row.get('method_label') or row.get('craft_label')
            if ids and label:
                authored.append({'ids': ids, 'label': label, 'family': row.get('family'), 'output': relative(p), 'line': n})
    write(DEST / 'already_authored.jsonl', authored)
    grouped = collections.defaultdict(list)
    for line, row in enumerate(extras, 1):
        v = volume(row)
        if row.get('extra') == 'rules' and row.get('kind') in KINDS and (v in range(4, 9) or v == 2 and row['id'] not in covered):
            grouped[row['id']].append({'id': row['id'], 'kind': row['kind'], 'locator': row.get('locator'), 'shard': row.get('shard'), 'volume': v, 'merged_line': line})
    method = []
    for id, rows in grouped.items():
        rows = list({json.dumps(r, sort_keys=True): r for r in rows}.values())
        rows.sort(key=lambda r: (r['volume'], r['shard'] or '', r['locator'] or ''))
        method.append({**rows[0], 'occurrences': rows})
    method.sort(key=lambda r: (r['volume'], r['shard'] or '', r['id']))

    # GM33 is a candidate census, not an artifact-identity or canon assertion.
    # Explicit registry artifact/sealed/magic-item terms OR item refs in a rule
    # mentioning an artifact/handling hazard. Keep matches inspectable privately.
    terms = re.compile(r'\b(?:artifacts?|sealed[- ](?:objects?|items?|artifacts?)|mystical[- ]items?|mystical[- ]objects?|magical[- ]items?|negative[- ]effects?|side[- ]effects?|containment)\b|封印物|神奇物品|负面效果|负作用|副作用', re.I)
    items = {r['id']: r for r in registry if r.get('kind') == 'item'}
    evidence = collections.defaultdict(list)
    for line, row in enumerate(extras, 1):
        if row.get('extra') not in {'rules', 'rules_other'}:
            continue
        if not terms.search(json.dumps(row, ensure_ascii=False)):
            continue
        refs = set(re.findall(r'lotm\.item\.[a-z0-9-]+', json.dumps(row))) & items.keys()
        for id in refs:
            evidence[id].append({'id': row.get('id'), 'locator': row.get('locator'), 'shard': row.get('shard'), 'volume': volume(row), 'merged_line': line})
    artifact = []
    for id, row in items.items():
        matched = bool(terms.search(' '.join([id, row.get('label', ''), row.get('zh', ''), *row.get('aliases', [])])))
        if not matched and id not in evidence:
            continue
        refs = evidence[id]
        if not refs:
            refs = [{'locator': row.get('firstMention'), 'shards': row.get('shards', []), 'volume': volume(row), 'registry_id': id}]
        artifact.append({'id': id, 'kind': 'artifact_candidate', 'locator': refs[0].get('locator'),
                         'volume': min(r['volume'] for r in refs), 'occurrences': refs,
                         'selection_basis': ['registry_artifact_term'] * matched + ['linked_rule_handling_term'] * bool(evidence[id]),
                         'sealed': True, 'identity_status': 'candidate; aliases not merged',
                         'gaps': ['Confirm artifact relevance and exact identity from source; reject incidental mentions explicitly.']})
    artifact.sort(key=lambda r: (r['volume'], r['id']))
    write(DEST / 'methods_all_in.jsonl', method)
    write(DEST / 'gm33_all_in.jsonl', artifact)
    batches = []
    for family, rows in [('methods', method), ('gm33', artifact)]:
        count = max(1, math.ceil(len(rows) / 250))
        for n in range(count):
            chunk = rows[n * len(rows) // count:(n + 1) * len(rows) // count]
            tag = f'{family}_{n+1:02}'
            inp = DEST / f'{tag}_in.jsonl'
            out = DEST / f'luna_{tag}.jsonl'
            write(inp, chunk)
            batches.append({'family': family, 'input': relative(inp), 'output': relative(out),
                            'brief': relative(OWN / f'luna_{len(batches)+1}.md'), 'ids': len(chunk),
                            'occurrences': sum(len(r['occurrences']) for r in chunk), 'input_sha256': digest(inp)})
    inputs = [MERGED / 'extras.jsonl', MERGED / 'registry.jsonl', *prior]
    manifest = {'schema': 'c4-prep/1', 'source_inputs': {relative(p): digest(p) for p in inputs},
                'excluded_placeholder': relative(BASE / 'l4/luna_v2a_placeholder.jsonl'),
                'known_method_groups': len(authored), 'known_ids': len({id for r in authored for id in r['ids']}),
                'counts': {}, 'batches': batches}
    for family, rows in [('methods', method), ('gm33', artifact)]:
        manifest['counts'][family] = {'unique_ids': len(rows), 'occurrences': sum(len(r['occurrences']) for r in rows),
            'volumes': {str(v): {'ids': sum(any(o['volume'] == v for o in r['occurrences']) for r in rows),
                               'occurrences': sum(o['volume'] == v for r in rows for o in r['occurrences'])} for v in range(1, 9)}}
    (DEST / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    # IDs are safe in tracked briefs; all labels and source payload stay private.
    known = '\n'.join('- ' + ', '.join(f'`{id}`' for id in r['ids']) for r in authored)
    template = (OWN / 'reader_template.md').read_text()
    for i, batch in enumerate(batches, 1):
        text = template.replace('@NUMBER@', str(i)).replace('@FAMILY@', batch['family']).replace('@INPUT@', batch['input']).replace('@OUTPUT@', batch['output']).replace('@COUNT@', str(batch['ids'])).replace('@OCCURRENCES@', str(batch['occurrences'])).replace('@KNOWN@', known)
        (ROOT / batch['brief']).write_text(text)
    return manifest


def check(outputs=False):
    m = json.loads((DEST / 'manifest.json').read_text())
    for p, sha in m['source_inputs'].items():
        assert digest(ROOT / p) == sha, f'Input drift: {p}'
    for family in ['methods', 'gm33']:
        expected = read(DEST / f'{"methods" if family == "methods" else "gm33"}_all_in.jsonl')
        ids = [r['id'] for b in m['batches'] if b['family'] == family for r in read(ROOT / b['input'])]
        assert len(ids) == len(set(ids)) == len(expected)
        assert set(ids) == {r['id'] for r in expected}
    for b in m['batches']:
        inp = read(ROOT / b['input'])
        assert digest(ROOT / b['input']) == b['input_sha256']
        assert b['ids'] == len(inp) <= 300
        assert len(inp) >= 150 or sum(x['family'] == b['family'] for x in m['batches']) == 1
        brief = (ROOT / b['brief']).read_text()
        assert b['input'] in brief and b['output'] in brief
        assert '@KNOWN@' not in brief and '{"unread":[...]}' in brief
        for a in read(DEST / 'already_authored.jsonl'):
            assert all(f'`{id}`' in brief for id in a['ids'])
        if outputs:
            out = ROOT / b['output']
            assert out.exists(), f'Reader output pending: {out.name}'
            seen = []
            for r in read(out):
                if 'unread' in r:
                    seen.extend(r['unread'])
                    continue
                if b['family'] == 'methods':
                    assert r.get('family') and isinstance(r.get('ids'), list)
                    seen.extend(r['ids'])
                else:
                    assert all(k in r for k in ['id','label','holder_by_date','effect','cost_or_drawback','containment','access_route','gaps'])
                    seen.append(r['id'])
            assert collections.Counter(seen) == collections.Counter(r['id'] for r in inp), f'Coverage mismatch: {out.name}'
    print(json.dumps({'result': 'PASS', 'reader_outputs_checked': outputs, 'counts': m['counts'], 'briefs': len(m['batches']), 'known_method_groups': m['known_method_groups']}, indent=2))

if __name__ == '__main__':
    import sys
    if '--build' in sys.argv:
        build()
    check('--outputs' in sys.argv)
