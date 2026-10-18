from pathlib import Path
import json,re,hashlib,datetime,collections,subprocess
root=Path.cwd();out=root/'docs/gm/cross-audit-reconciliation-2026-10-15';priv=out/'private'
paths=(priv/'MAIN_PATHS.txt').read_text().splitlines();candidates=set((priv/'CANDIDATE_RECORDS.txt').read_text().splitlines());rows=[]
for rel in paths:
 p=root/rel
 if not p.is_file():rows.append({'path':rel,'status':'unavailable-at-index'});continue
 d={'path':rel,'status':'indexed-only','candidate_record':rel in candidates}
 if p.suffix=='.md':
  b=p.read_bytes();text=b.decode('utf-8',errors='replace');lines=text.splitlines();d.update(sha256=hashlib.sha256(b).hexdigest(),lines=len(lines),semantic_review='unread',findings=[])
  if rel in candidates:
   found=collections.defaultdict(list)
   for i,line in enumerate(lines,1):
    for match in re.findall(r'\b(?:[A-Z]{1,5}[-.]?)\d+(?:[-.][A-Z0-9]+)*\b',line):found[match].append(i)
   d['findings']=[{'original_id':code,'lines':loc,'status':'machine-located-not-interpreted'} for code,loc in found.items()]
 rows.append(d)
(priv/'RECORD_QUEUE.json').write_text(json.dumps({'indexed_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'frozen visible main docs; candidate findings are lexical locators, not validated claims','records':rows},indent=2)+'\n')
# Track tree aliases at immutable blob level only. Working hashes are separate observations.
work=json.loads((priv/'WORKTREES.json').read_text());trees=work['trees'];groups=collections.defaultdict(list)
with (priv/'DOCUMENT_CATALOG.tsv').open() as f:
 next(f)
 for line in f:
  tree,path,digest,state=line.rstrip('\n').split('\t');groups[(path,digest,state)].append(tree)
summary={'indexed_paths':len(rows),'markdown':sum('sha256'in r for r in rows),'candidate_records':len(candidates),'candidate_id_locators':sum(len(r.get('findings',[])) for r in rows),'tree_catalog_rows':sum(map(len,groups.values())),'distinct_path_revision_states':len(groups),'alias_groups':sum(len(v)>1 for v in groups.values()),'warning':'Aliases establish byte/object identity only; no semantic or integration acceptance inferred.'}
(priv/'INDEX_SUMMARY.json').write_text(json.dumps(summary,indent=2)+'\n')
# Public tree identities contain no private prose or save contents.
lines=['# Worktree provenance manifest','','Frozen registration: '+work['captured_at']+'. Main HEAD `'+work['main_head']+'`.','',f"{len(trees)} registered, {sum(t['available'] for t in trees)} available, {sum(not t['available'] for t in trees)} unavailable. Exact porcelain, full dirty paths, object catalog and revision aliases are retained in ignored [private/WORKTREES.json](private/WORKTREES.json), [DOCUMENT_CATALOG.tsv](private/DOCUMENT_CATALOG.tsv) and [record queue](private/RECORD_QUEUE.json). These are inventory, not semantic reading. No checkout restored/pruned/switched/merged.",'','Status observation was sequential after the registration timestamp, not an atomic snapshot. Main has concurrent writers. Blob catalog describes HEAD; dirty SHA256 rows override the corresponding working observation. An ancestor or matching report never proves current-candidate integration. Owners are unverified unless a checkpoint/return identifies one. Full status includes runtime and loose documentation; no private save contents were read.','','| Tree | Branch / HEAD | Availability | Dirty paths / doc deltas from main HEAD |','|---|---|---|---|']
for t in trees:
 reg=t['registration'];head=t.get('head',next((r[5:] for r in reg if r.startswith('HEAD ')),'unknown'));branch=t.get('branch',next((r[7:] for r in reg if r.startswith('branch ')),'detached'))
 lines.append(f"| `{t['path']}` | `{branch}` / `{head[:12]}` | {'available' if t['available'] else 'unavailable; registered prunable'} | {str(len(t.get('status',[])))+' / '+str(len(t.get('branch_document_deltas',[]))) if t['available'] else 'untracked/private content unrecovered'} |")
lines+=['','## Referenced locations beyond registration','','[Referenced-path intake](private/REFERENCED_PATHS.txt) came from main dispatch CHECKPOINT, PAUSED_HANDOFF, THREADS and ASSIGNMENT files only. This is a finite selected reference family, not all possible historic paths. Source tool `lncrawl-polite` is excluded from checkout discovery. Recorded temporary proof/save paths are evidence locations, not automatically worktrees. Availability/classification is in [REFERENCE_LOCATIONS.json](private/REFERENCE_LOCATIONS.json). No archived worktree attachment was returned for this chat; this does not prove no archives exist elsewhere.']
(out/'WORKTREES.md').write_text('\n'.join(lines)+'\n')
refs=[]
registered={t['path'] for t in trees}
for raw in (priv/'REFERENCED_PATHS.txt').read_text().splitlines():
 s=raw.rstrip('.,/');p=Path(s); refs.append({'recorded':raw,'normalized':s,'exists':p.exists(),'classification':'registered checkout' if s in registered else 'source tool excluded' if 'lncrawl-polite'in s else 'referenced proof or noncheckout location; no restoration','git_marker':(p/'.git').exists() if p.is_dir() else False})
(priv/'REFERENCE_LOCATIONS.json').write_text(json.dumps(refs,indent=2)+'\n');print(json.dumps(summary,indent=2))
