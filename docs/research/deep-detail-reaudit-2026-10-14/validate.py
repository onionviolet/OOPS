#!/usr/bin/env python3
from pathlib import Path
import hashlib
import json
import re
import subprocess
from datetime import datetime

ROOT=Path(__file__).resolve().parents[3]
OUT=Path(__file__).resolve().parent
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def run():
    failures=[];checks={};counts={'copied_files':0,'generated_files':0,'copied_bytes':0,'generated_bytes':0}
    ledger=json.loads((OUT/'LEDGER.json').read_text())
    receipts=json.loads((OUT/'DEEP_SAVES.json').read_text())
    ids=[x['game'] for x in ledger['rows']]
    checks['unique_game_ids']=len(ids)==len(set(ids))
    checks['ledger_count']=len(ids)==ledger['counts']['game_rows']
    checks['all_rows_have_required_fields']=all(all(k in x for k in ['game','scope','shortcomings','detail_saved','route','value','deferred_reason','evidence_files']) for x in ledger['rows'])
    checks['all_rows_have_source_bindings']=all(x['evidence_files'] for x in ledger['rows'])
    checks['live_lane_exclusions']=all(x['scope']=='deferred' and not x['detail_saved']['deep_save'] for x in ledger['rows'] if x['game'] in ['academagia','immortal-life','scroll-of-taiwu','warsim','hogwarts-legacy','proto23'])
    checks['required_outputs']=all((OUT/x).is_file() for x in ['REPORT.md','LEDGER.json','CHECKPOINT.md','DEEP_SAVES.json'])
    private_paths=[]
    for receipt in receipts:
        dest=ROOT/receipt['snapshot'];manifest=json.loads((dest/'MANIFEST.json').read_text())
        if sha(dest/'MANIFEST.json')!=receipt['manifest_sha256']:failures.append('manifest hash: '+receipt['game'])
        if not (ROOT/receipt['private_index']).is_file():failures.append('index missing: '+receipt['game'])
        if len(manifest['files'])!=receipt['copied_files']:failures.append('file count: '+receipt['game'])
        for row in manifest['files']:
            p=dest/row['path'];source=Path(row['source'])
            if not p.is_file() or p.stat().st_size!=row['bytes'] or sha(p)!=row['sha256']:failures.append('copy mismatch: '+str(p.relative_to(ROOT)))
            if not source.is_file() or sha(source)!=row['sha256']:failures.append('source drift/missing: '+row['source'])
            counts['copied_files']+=1;counts['copied_bytes']+=row['bytes']
        for row in manifest['generated']:
            p=dest/row['path']
            if p.stat().st_size!=row['bytes'] or sha(p)!=row['sha256']:failures.append('generated mismatch: '+str(p.relative_to(ROOT)))
            counts['generated_files']+=1;counts['generated_bytes']+=row['bytes']
            if p.suffix=='.json':json.loads(p.read_text())
            if p.suffix=='.jsonl':
                for line in p.read_text().splitlines():json.loads(line)
        private_paths.extend(str(p.relative_to(ROOT)) for p in dest.parent.rglob('*') if p.is_file())
    # NUL mode prevents Git's quoted non-ASCII filenames from looking like
    # unmatched paths in the Tale of Immortal workbook exports.
    ignored=subprocess.run(['git','check-ignore','-z','--stdin'],cwd=ROOT,input='\0'.join(private_paths)+'\0',capture_output=True,text=True)
    checks['every_private_file_ignored']=set(ignored.stdout.rstrip('\0').split('\0'))==set(private_paths)
    tracked=subprocess.check_output(['git','ls-files','--','docs/research/*/private/*'],cwd=ROOT,text=True).splitlines()
    checks['no_tracked_private_files']=not tracked
    checks['no_private_copies_in_live_lane']=not any(x['game'] in ['academagia','immortal-life','scroll-of-taiwu','warsim','hogwarts-legacy','proto23'] for x in receipts)
    for p in OUT.glob('*.json'):json.loads(p.read_text())
    broken=[]
    for p in [OUT/'REPORT.md',OUT/'CHECKPOINT.md']:
        s=p.read_text()
        if '\u2014' in s:failures.append('em dash in '+p.name)
        for target in re.findall(r'(?<!!)\[[^\]]+\]\(([^)]+)\)',s):
            if target.startswith(('http:','https:','#')):continue
            target=target.split('#')[0]
            if not (p.parent/target).exists():broken.append((p.name,target))
    checks['local_markdown_links']=not broken
    checks['ten_dispatch_prompts']=len(re.findall(r'^### P\d+ lane prompt$',(OUT/'REPORT.md').read_text(),re.M))==10
    checks['no_table_placeholder']='<!-- SAVE_TABLE -->' not in (OUT/'REPORT.md').read_text()
    # Check exact directory census against original coverage routing plus current
    # direct game dossiers; public/retired/deferred are valid explicit outcomes.
    dirs={x['dossier'].split('/')[2] for x in ledger['rows']}
    coverage=(ROOT/'docs/research/coverage-refresh-2026-10-14/REPORT.md').read_text()
    baseline=set(re.findall(r'\| \[([^\]]+)\]\(\.\./',coverage))
    checks['coverage_refresh_game_routes_represented']=not (baseline-dirs)
    checks['new_game_routes_represented']=all(x in dirs for x in ['hearts-of-iron-iv','heavens-vault','idle-reincarnator','legends-of-idleon','ngu-idle','immortal-life','scroll-of-taiwu','warsim'])
    failed_checks=[k for k,v in checks.items() if not v]
    result={'date':datetime.now().astimezone().isoformat(),'status':'PASS' if not (failures or failed_checks or broken) else 'FAIL','checks':checks,'counts':counts,'private_snapshot_dossiers':len(receipts),'private_files_ignore_checked':len(private_paths),'failures':failures,'failed_checks':failed_checks,'broken_links':broken,'unrun':['new game decompile','game launch','YAIR tests/build/browser','player saves','install/uninstall','commit/push','human acceptance'],'claim_limit':'Research artifact/copy checks only. No whole-game semantics, gameplay or proposal adoption proved.'}
    (OUT/'VALIDATION.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(result,ensure_ascii=False))
    if result['status']!='PASS':raise SystemExit(1)

if __name__=='__main__':run()
