"""Fold R3b returns over reviewed C4 rows; proposals only, originals untouched."""
import argparse
import hashlib
import json
from pathlib import Path

HERE = Path('docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3')
HOME = Path('docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus')
FAMILIES = {'divination','summons','ritual_other','potion_rule','aid_preparation','craft','occasion_of_known_method','no_content'}
def rows(p): return [json.loads(s) for s in Path(p).read_text().splitlines() if s.strip()]
def ids(row, family): return row['ids'] if family == 'methods' else [row['id']]

def validate_output(inputs, output, family):
    assert output and isinstance(output[-1].get('unread'), list), 'Final unread trailer required'
    own = {r['id'] for r in inputs}
    covered = []
    for r in output[:-1]:
        assert 'unread' not in r, 'Unread trailer must be final'
        if family == 'methods':
            assert r.get('family') in FAMILIES and isinstance(r.get('ids'), list) and r['ids'], 'Invalid procedure'
            assert all(k in r for k in ['label','locators','conditions','inputs','performers','steps','outcomes','products','costs','limits','consequences','scale','tags','gaps','usable']), 'Missing procedure fields'
            if r['usable']:
                assert (r['conditions'] or r['inputs']) and r['steps'] and r['outcomes'], 'Unsupported usable shape'
        else:
            assert all(k in r for k in ['id','label','holder_by_date','effect','cost_or_drawback','containment','access_route','gaps']), 'Missing artifact fields'
        covered.extend(ids(r, family))
    covered.extend(output[-1]['unread'])
    assert len(covered) == len(set(covered)) and set(covered) == own, 'Duplicate/foreign/missing ID'
    return output[:-1], set(output[-1]['unread'])

def main():
    args = argparse.ArgumentParser()
    args.add_argument('--validate-only', action='store_true')
    args = args.parse_args()
    plan = json.loads((HERE/'r3b/manifest.json').read_text())
    receipts = {}
    for family in ['methods','gm33']:
        baseline = rows(HOME/f'{family}_reviewed.jsonl')
        merged = list(baseline)
        read_ids = [i for r in baseline for i in ids(r, family)]
        assert len(read_ids) == len(set(read_ids)), 'Duplicate reviewed ID'
        inventory = {r['id'] for r in rows(HOME/f'{family}_all_in.jsonl')}
        remaining = inventory - set(read_ids)
        assigned = set(); pending = 0
        for b in plan['briefs']:
            if b['family'] != 'c4' or b['group'] != family: continue
            data = Path(b['input']).read_bytes()
            assert hashlib.sha256(data).hexdigest() == b['inputSha256'], 'Repair input changed'
            inp = rows(b['input']); own = {r['id'] for r in inp}
            assert own <= remaining and not own & assigned, 'Foreign/duplicate repair assignment'
            assigned.update(own)
            if not Path(b['output']).exists(): pending += 1; continue
            returned, unread = validate_output(inp, rows(b['output']), family)
            remaining -= own - unread
            merged.extend(returned)
        assert assigned == inventory - set(read_ids), 'Repair partition misses unread IDs'
        receipts[family] = {'baselineRows':len(baseline),'baselineReadIds':len(read_ids),
                            'candidateRows':len(merged),'unread':len(remaining),'pendingBriefs':pending,
                            'sourceReview':'new returns require coordinator review; no runtime promotion'}
        if not args.validate_only:
            out = HOME/'r3b/folded'; out.mkdir(parents=True, exist_ok=True)
            (out/f'{family}_candidate.jsonl').write_text(''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in merged))
            (out/f'{family}_unread.json').write_text(json.dumps(sorted(remaining),indent=2)+'\n')
    print(json.dumps(receipts))

if __name__ == '__main__': main()
