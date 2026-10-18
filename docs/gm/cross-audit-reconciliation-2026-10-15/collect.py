from pathlib import Path
import subprocess,json,datetime,hashlib,re,collections
root=Path.cwd(); out=root/'docs/gm/cross-audit-reconciliation-2026-10-15/private'
def git(*args,cwd=root):
 p=subprocess.run(['git',*args],cwd=cwd,text=True,capture_output=True);return p.stdout if p.returncode==0 else ''
def sha(p):
 try:return hashlib.sha256(p.read_bytes()).hexdigest()
 except OSError:return None
now=datetime.datetime.now(datetime.timezone.utc).isoformat()
raw=git('worktree','list','--porcelain');(out/'worktrees.raw.txt').write_text(raw)
(out/'baseline-status.txt').write_text(git('status','--short'))
base={}
for line in git('ls-tree','-r','HEAD','docs').splitlines():
 meta,path=line.split('\t',1);base[path]=meta.split()[2]
rows=[];catalog=[]
for block in raw.strip().split('\n\n'):
 fields=block.splitlines(); p=Path(fields[0][9:]);d={'path':str(p),'registered':True,'inspected_at':now,'registration':fields[1:],'available':p.is_dir(),'owner':'unrecovered; infer only from linked checkpoint','scope':'recorded checkout; no write authority'}
 if p.is_dir():
  d['head']=git('rev-parse','HEAD',cwd=p).strip();d['branch']=git('branch','--show-current',cwd=p).strip() or 'detached'
  status=git('status','--porcelain=v1','--untracked-files=all',cwd=p).splitlines(); d['status']=status
  tree={}
  for line in git('ls-tree','-r','HEAD','docs',cwd=p).splitlines():
   meta,path=line.split('\t',1);tree[path]=meta.split()[2]
  # Object identity catalogs evidence copies without claiming any content read.
  for path,blob in tree.items():
   if path.endswith(('.md','.json','.tsv','.csv')):catalog.append([str(p),path,blob,'git-object-indexed-only'])
  dirtydocs=[]
  for s in status:
   rel=s[3:]; rel=rel.split(' -> ')[-1]
   if rel.startswith('docs/') and rel.endswith(('.md','.json','.tsv','.csv')):
    digest=sha(p/rel);dirtydocs.append({'path':rel,'status':s[:2],'sha256':digest});catalog.append([str(p),rel,digest or 'unavailable','working-file-indexed-only'])
  d['dirty_documents']=dirtydocs
  d['branch_document_deltas']=[{'path':k,'blob':v,'main_head_blob':base.get(k)} for k,v in tree.items() if v!=base.get(k) and k.endswith(('.md','.json'))]
  d['integration']='not inferred from ancestry or document copies'
 else:d['unavailable']='private/untracked content unrecovered; registration and accessible main-tree receipts only'
 rows.append(d)
(out/'WORKTREES.json').write_text(json.dumps({'captured_at':now,'main_head':git('rev-parse','HEAD').strip(),'trees':rows},indent=2)+'\n')
(out/'DOCUMENT_CATALOG.tsv').write_text('tree\tpath\trevision_or_hash\tinspection\n'+'\n'.join('\t'.join(r) for r in catalog)+'\n')
files=sorted(set(x for x in git('ls-files','--cached','--others','--exclude-standard','docs').splitlines() if 'cross-audit-reconciliation-2026-10-15' not in x))
(out/'MAIN_PATHS.txt').write_text('\n'.join(files)+'\n')
summary={'captured_at':now,'registered':len(rows),'available':sum(r['available'] for r in rows),'unavailable':[r['path'] for r in rows if not r['available']],'catalog_rows':len(catalog),'main_paths':len(files)}
(out/'COLLECTION.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary,indent=2))
