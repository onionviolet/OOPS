"""Freeze and partition R3b unread metadata. No readers or source prose reads."""
import collections
import hashlib
import json
from pathlib import Path
import re

ROOT = Path.cwd()
HERE = Path('docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3')
BASE = Path('docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27')
def load(p): return json.loads(Path(p).read_text())
def rows(p): return [json.loads(s) for s in Path(p).read_text().splitlines() if s.strip()]
def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dump(p, obj): Path(p).write_text(json.dumps(obj, indent=2, ensure_ascii=False)+'\n')
def jsonl(p, data): Path(p).write_text(''.join(json.dumps(x, ensure_ascii=False)+'\n' for x in data))

previous = json.loads((HERE/'r3b/manifest.json').read_text()) if (HERE/'r3b/manifest.json').exists() else None
if previous:
    assert not any(Path(b['output']).exists() for b in previous['briefs']), 'Readers already own repair outputs; do not regenerate'
manifest = {'schema': 'r3b-resplit/1', 'inputs': {}, 'families': {}, 'briefs': []}
def bind(p):
    p = str(p)
    manifest['inputs'][p] = sha(p) if Path(p).exists() else None

def register(family, group, data, cap, ext, template):
    home = {'c1': BASE/'l10/slug-cluster', 'c4': BASE/'l4/v4plus', 'c5': BASE/'wb-families-texture'}[family]
    dest = home/'r3b'; dest.mkdir(exist_ok=True)
    own = HERE/f'{family}b'; own.mkdir(exist_ok=True)
    for start in range(0, len(data), cap):
        number = 1 + sum(x['family'] == family for x in manifest['briefs'])
        tag = f'b{number}'
        inp = dest/f'in_{tag}.{ext}'
        out = home/f'out_{tag}.{ "tsv" if family == "c5" else "jsonl"}'
        assert not out.exists(), f'Reader output exists: {out}'
        chunk = data[start:start+cap]
        if family == 'c5':
            # Renumber within the new shard; stable IDs retain original identity.
            fields = [[str(i), *r[1:]] for i, r in enumerate(chunk, 1)]
            inp.write_text(''.join('\t'.join(r)+'\n' for r in fields))
        elif ext == 'json': dump(inp, chunk)
        else: jsonl(inp, chunk)
        brief = own/f'luna_{tag}.md'
        text = template.replace('@INPUT@',str(inp)).replace('@OUTPUT@',str(out)).replace('@COUNT@',str(len(chunk))).replace('@NUMBER@',tag)
        brief.write_text(text)
        manifest['briefs'].append({'family':family,'group':group,'brief':str(brief),'input':str(inp),'output':str(out),'rows':len(chunk),'inputSha256':sha(inp),'briefSha256':sha(brief)})

common = '''Work in `/Users/weiwei/code/yet-another-idle-rpg`; read AGENTS.md. Model: gpt-6-luna medium, fresh context, coordinator launch only. No subagents, commits, web, runtime promotion or edits outside your ONE named private output. Rules: AD36/AD38, WPR4-WPR8, WPR18-WPR23, AU5-AU6/AU10-AU15. This brief replaces a portion of the old remainder assignment; do not run its old oversized parent too.

Input: `@INPUT@` (@COUNT@ assigned rows). Own exactly `@OUTPUT@`. Source details and sealed truths stay private; final report gives counts, IDs and gaps. Input metadata is an index, not source proof. No placeholders: output rows come from text actually read. Stop at six responses or 12,000 source words (Chinese characters count as words), or before context limits (<60k target, 80k stop including overhead). Unread IDs belong in a REQUIRED final `{"unread":[...]}` trailer, including an empty array when complete.

Batch `cite_paragraphs` calls in small groups (start with two IDs), each with `--context 1 --max 2`. Set tool output limits to hold the whole batch. If output truncates, treat hidden text as unread and reduce the batch/window before continuing. Avoid whole-input dumps; load metadata in pieces of at most ten IDs. Read each matching locator, not an unrelated first mention. Standard route:

```sh
node scripts/lead_run/cite_paragraphs.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27 --merged docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged --id <source-id> --context 1 --max 2
```
'''

c1 = common + '''
Cluster synonyms with the same causal mechanism. Input is a small JSON array retaining all labels, occurrences, roles and locators for each slug. Meanings are extraction hints. Keep different mechanisms, targets, scope, rank, negation and knowledge separate; preserve conflicting uses as unread, not forced merges. Propose an existing snake_case canonical slug. **Pathway-neutral naming:** name the mechanism rather than hardcoding one pathway unless the source ties the fact to that pathway (Weibao, 2026-10-30). Unmatched source-reviewed slugs can be singleton groups. Do not merge person IDs on names. Codes also AR3/AR8/WA48. Proposed data only.

Read matching source paragraphs for every resolved member and inspect materially different occurrence meanings. Output one JSON group per line, exactly the C1 schema:

```json
{"canonical":"existing_slug","members":[{"slug":"input_slug","evidence":[{"id":"ability-id","locator":"exact input locator actually read"}]}],"reason":"English explanation of shared mechanism"}
```

Every assigned slug appears exactly once across members and unread; no foreign slugs. A matching evidence pointer alone does not establish source support. Condition/blocker roles remain at their usage sites. Missing/conflicting occurrence locators stay explicit in private gaps/final report. No guessed or unread groups. The new fold reads `out_b*.jsonl`; run `node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c1/fold.mjs --validate-only` after writing. Report resolved/unread counts and source-word/budget gaps, at most 200 words.
'''
p = BASE/'l10/slug-cluster/coordinator-gaps.json'; bind(p)
gaps = load(p)['unread']; assert len(gaps)==len(set(gaps))
p = BASE/'l10/slug-cluster/inventory.json'; bind(p)
inventory = {r['slug']:r for r in load(p)}
register('c1','slugs',[inventory[s] for s in gaps],40,'json', '# C1 R3b @NUMBER@: slug remainder\n\n'+c1)
manifest['families']['c1'] = {'unread':len(gaps),'cap':40}

# C4 uses the fold's corrected addresses, preserving every occurrence and ID.
p = BASE/'l4/v4plus/manifest.json'; bind(p); old = load(p)
p = BASE/'l4/v4plus/unread.jsonl'; bind(p); ledger = rows(p)
expected = {f:{r['id'] for r in ledger if r['family']==f} for f in ['methods','gm33']}
actual = {f:set() for f in expected}
for b in old['batches']:
    bind(b['output'])
    for r in rows(b['output']):
        if 'unread' in r:
            assert not (actual[b['family']] & set(r['unread']))
            actual[b['family']].update(r['unread'])
assert actual == expected
p = BASE/'l4/v4plus/methods_05b_in.jsonl'; bind(p)
assert {r['id'] for r in rows(p)} <= expected['methods'] # included once, not a second 205-ID assignment
bind(BASE/'l4/v4plus/volume_corrections.jsonl')
for f in ['methods_reviewed.jsonl','gm33_reviewed.jsonl']: bind(BASE/'l4/v4plus'/f)
def volume(o):
    m=re.search(r'\bb([1-8])\b',o.get('locator') or '')
    if m:return int(m[1])
    sh=o.get('shard') or next(iter(o.get('shards',[])),'')
    m=re.match(r'lotm([2-8])c',sh)
    if m:return int(m[1])
    if re.match(r'[bw][1-8]s',sh):return 1
    return o['volume']
# Use the inherited schema text, omit the 395-group inline catalogue.
template = (HERE/'c4/reader_template.md').read_text()
schema = template[template.index('## Procedure output'):template.index('## Already authored')]
for family in ['methods','gm33']:
    p = BASE/f'l4/v4plus/{family}_all_in.jsonl'; bind(p)
    selected = []
    for r in rows(p):
        if r['id'] not in expected[family]: continue
        for o in r['occurrences']:
            oldvol=o['volume']; o['volume']=volume(o)
            if oldvol!=o['volume']:o['original_assigned_volume']=oldvol
        r['volume']=min(o['volume'] for o in r['occurrences'])
        r['sourceVolumes']=sorted({o['volume'] for o in r['occurrences']})
        selected.append(r)
    assert {r['id'] for r in selected} == expected[family]
    text = '# C4 R3b @NUMBER@: '+family+' remainder\n\n'+common+'''
Family: **'''+family+'''**. Each ID has one reader across all volumes; preserve volume/date variants and uncertain aliases. Addresses in this slice follow the C4 fold: `bNs`/`wNs` are volume-one reading waves, not book numbers. Explicit book locators and `lotmNc` shard prefixes determine later volumes, including registry `shards` plural. Do not rerun old prep or restore its incorrect census.

For exact assigned occurrence windows, batch at most two calls to the existing helper:

```sh
node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c4/cite_input.mjs @INPUT@ --id <assigned-id> --occurrence 0
```

Increment occurrence index for additional anchors; check its printed book/anchor against this corrected slice. Missing or unparseable anchors are gaps. For partial IDs record checked/unchecked locators, and `usable:false` when the missing material affects the method. Never claim later occurrences from an earlier one.

Before classifying repeats, consult the private known-method catalogue `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/already_authored.jsonl` in bounded pieces or by relevant IDs. It indexes prior extractions, not verified runtime methods. Keep prior occasions separate from new variants. Use only the schema for this brief's family below.

'''+schema+'''
Done: every assigned ID occurs exactly once in a procedure `ids` array or artifact `id`, or in the final unread trailer. No foreign IDs; no empty rows for unread text. `no_content` requires a real source read. Run `python3 docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c4/fold.py --validate-only` after writing. Report supported/unread ID counts, actual locator coverage and budget gaps, at most 200 words. Coordinator source review remains required before promotion.
'''
    register('c4',family,selected,35,'jsonl',text)
manifest['families']['c4'] = {'methods':len(expected['methods']),'gm33':len(expected['gm33']),'unread':len(ledger),'cap':35}

p = HERE/'c5/manifest.json'; bind(p); m=load(p)
status_path = Path('/tmp/r3b-lane-status.txt')
if not status_path.exists(): status_path = HERE/'r3b/c5-lane-status.txt'
status = status_path.read_text().splitlines()
# Preserve only lane names and status, without returned text or sealed details.
status = [s.split(';',1)[0] for s in status if s.startswith('sw-r3-c5-')]
(HERE/'r3b/c5-lane-status.txt').write_text('\n'.join(status)+'\n')
running = {s.split(':',1)[0] for s in status if ': running' in s}
unfinished = {}
for record in (Path.home()/'.codex/lanes/protagonist-life-2026-10-27').glob('*/lane.json'):
    r = load(record)
    brief = r.get('brief','')
    if '/codex-r3/c5/' in brief and not Path(r['last_message']).exists():
        unfinished[Path(brief).name] = record.parent.name
dump(HERE/'r3b/c5-unfinished-lanes.json',unfinished)
skipped=[]; unanswered=0; labelled=0
c5 = '# C5 R3b @NUMBER@: summary remainder\n\n'+common+'''
This is classification of extracted summaries, not a new source read. Read the taxonomy `docs/gm/dispatch/sonnet-wave-2026-10-30/WB_TAXONOMY.md`. Input is a pre-cut TSV with at most 500 rows, no header: local n, stable synthetic row ID, original kind, summary, empty field, occurrence count. n is newly numbered for THIS slice. Do not reuse old shard n or classify by ID/keywords alone. Preserve OTH when it fits; do not infer from nearby summaries or outside canon. Rules-other rows are intentionally included in this texture-family pass.

Project only n and summary in pieces of at most 50 rows, with an output token limit sufficient for each piece. A 500-row slice is not an instruction to print 500 rows at once. Load each piece fully; reduce piece size if any output truncates. A summary read is sufficient for unambiguous classification and does not count as raw paragraph reading. Keep a private output row only for a summary actually read.

Output one `n<TAB>CODE` line per classified row, sorted by local n. Existing three-letter codes come from the taxonomy. `NEW:<kebab-slug>` is permitted only if no existing code fits, at most eight new slugs, with a concrete reason in the final JSON line: `{"unread":["stable-row-id"],"new_reasons":{"NEW:<slug>":"why existing families fail"}}`. Every input n must appear once as a label or its stable ID once in unread, never both. No placeholders, duplicate/foreign n or invented OTH for unread rows.

Ambiguity fallback: use `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/wb-families-texture/source_rows.jsonl` filtered by exact stable ID to obtain original `row.about` and locator. Synthetic IDs are not citation-tool IDs. Consult at most ten ambiguous IDs, at most eight paragraphs per ID, within the shared 12,000-word raw-source budget. Batch citation calls as above with --max 2; verify the exact anchor. If unreachable, classify only what the summary supports or leave unread.

Coordinator runs `node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c5/fold.mjs --allow-pending --validate-only`. The fold maps new local n through stable IDs into original shards, replacing unread coverage without altering old answers. Final report: output path, labelled/unread counts, summary versus paragraph coverage and truncation/context gaps, at most 200 words. Fifteen-row-per-family source review remains with the coordinator.
'''
for i,s in enumerate(m['shards'],1):
    bind(s['input'])
    lane=f'sw-r3-c5-luna_{i}'
    active = lane in running or s['brief'] in unfinished
    if not active:bind(s['output'])
    inp = [l.split('\t') for l in Path(s['input']).read_text().splitlines() if l]
    answers={}; unread=set()
    if Path(s['output']).exists():
        for line in Path(s['output']).read_text().splitlines():
            if not line.strip():continue
            if line.startswith('{'):unread.update(json.loads(line).get('unread',[]));continue
            n,code=line.split('\t'); n=int(n)
            assert n not in answers and 1<=n<=len(inp)
            answers[n]=code
    missing=[r for n,r in enumerate(inp,1) if n not in answers]
    assert not (unread & {inp[n-1][1] for n in answers})
    assert unread <= {r[1] for r in missing}
    labelled+=len(answers)
    lane=f'sw-r3-c5-luna_{i}'
    if active:
        skipped.append({'group':s['group'],'lane':unfinished.get(s['brief'],lane),'unanswered':len(missing),'reason':'running status or no final receipt; sandbox status may misclassify live PIDs'});continue
    unanswered+=len(missing)
    register('c5',s['group'],missing,500,'tsv',c5)
manifest['families']['c5']={'unread':unanswered,'labelled':labelled,'skippedRunning':skipped,'cap':500}
order={'c4':0,'c1':1,'c5':2}
manifest['briefs'].sort(key=lambda b:order[b['family']])
if previous:
    current = {b[k] for b in manifest['briefs'] for k in ['brief','input']}
    for b in previous['briefs']:
        for k in ['brief','input']:
            if b[k] not in current:Path(b[k]).unlink()
dump(HERE/'r3b/manifest.json',manifest)
(HERE/'r3b/queue.txt').write_text(''.join(b['brief']+'\n' for b in manifest['briefs']))
for f,counts in manifest['families'].items():
    print(f,counts,'briefs',sum(b['family']==f for b in manifest['briefs']))
