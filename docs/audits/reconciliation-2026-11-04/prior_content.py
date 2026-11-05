"""Prepare native prior semantic receipts for explicit reviewer inspection.
This does not promote coverage. Inspect the returned notes before recording a batch.
"""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[3]
BASE = ROOT / 'docs/reviews/plan-rule-reconciliation-2026-10-18'

def covers(ranges, count):
    edge = 0
    for start, end in sorted(ranges):
        if start > edge + 1 or end < start:
            return False
        edge = max(edge, end)
    return edge >= count

def prepare(shard, *, exclude=()):
    current = json.loads((ROOT/'docs/audits/reconciliation-2026-11-04/inventory.json').read_text())
    pending = {r['path'] for r in current['candidates'] if not r.get('reviewed_range')}
    native = json.loads((BASE/'PLAN_INVENTORY.json').read_text())
    progress = json.loads((BASE/'ROUND5_PROGRESS.json').read_text())
    accepted = set(progress['accepted_shards'])
    if shard not in accepted:
        raise ValueError('Shard was not coordinator-accepted')
    result = []
    for row in native['plan_shaped_records']:
        previous = row.get('content_review')
        if row['path'] in exclude or row['path'] not in pending or not previous:
            continue
        # Coordinator repair receipts retain their shard identity under a new filename.
        if not any(json.loads((BASE/name).read_text())['shard'] == shard for name in previous['receipts']):
            continue
        path = (ROOT/row['path']).resolve()
        if not path.is_relative_to(ROOT) or not path.is_file():
            raise ValueError('Missing/outside source '+row['path'])
        data = path.read_bytes()
        if hashlib.sha256(data).hexdigest() != previous['input_sha256']:
            raise ValueError('Changed source needs fresh read: '+row['path'])
        count = len(data.decode().splitlines())
        if not covers(previous['read_ranges'], count):
            raise ValueError('Incomplete prior full-read ranges: '+row['path'])
        suppliers = []
        for receipt_name in previous['receipts']:
            receipt = json.loads((BASE/receipt_name).read_text())
            if receipt['shard'] not in accepted:
                raise ValueError('Unaccepted receipt')
            suppliers.extend((receipt_name, r) for r in receipt['rows'] if r['path'] == row['path'])
        if not suppliers or any(r['input_sha256'] != previous['input_sha256'] for _, r in suppliers):
            raise ValueError('Missing/mismatched semantic receipt')
        if not covers([span for _, r in suppliers for span in r['read_ranges']], count):
            raise ValueError('Receipt union incomplete')
        if not any(r.get('original_ids') for _, r in suppliers):
            raise ValueError('Weak semantic receipt: original_ids')
        for _, r in suppliers:
            if not isinstance(r.get('original_ids'), list):
                raise ValueError('Missing source-code list; an uncoded subrange may explicitly use []')
            for field in ['mechanism_and_interactions','disposition','owner_or_consumer','evidence_state','remaining_check']:
                if not r.get(field):
                    raise ValueError('Weak semantic receipt: '+field)
        result.append({'path':row['path'], 'native':previous, 'suppliers':suppliers, 'current_lines':count})
    return result

def to_review(prepared, *, extra_disposition=''):
    suppliers = prepared['suppliers']
    ids = list(dict.fromkeys(x for _, r in suppliers for x in r['original_ids']))
    def joined(field):
        return ' | '.join(dict.fromkeys(r[field] for _, r in suppliers))
    receipts = [str((BASE/name).relative_to(ROOT)) for name, _ in suppliers]
    return {'path':prepared['path'],'ids':ids,'classification':'reused substantive historical content review; current runtime/source claims not reverified',
        'owners':list(dict.fromkeys(r['owner_or_consumer'] for _,r in suppliers)),
        'disposition':joined('disposition')+(' '+extra_disposition if extra_disposition else ''),
        'mechanism_and_interactions':joined('mechanism_and_interactions'),
        'evidence':'Semantic receipt inspected in this batch; prior input and complete read-range union match current bytes. '+joined('evidence_state'),
        'reopen':joined('remaining_check'), 'full':True,'ranges':prepared['native']['read_ranges'],
        'read_mode':'reuse_prior_full_content_review', 'prior_receipts':receipts,
        'prior_input_sha256':prepared['native']['input_sha256'],
        'prior_locator_scopes':list(dict.fromkeys(r.get('evidence_locator_scope','pinpoint ranges in receipt') for _,r in suppliers))}

if __name__ == '__main__':
    import argparse
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('shard');args=parser.parse_args()
    for p in prepare(args.shard):
        r=to_review(p)
        print(json.dumps({k:r[k] for k in ['path','ids','mechanism_and_interactions','disposition','owners','reopen']},ensure_ascii=False))
