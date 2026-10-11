"""Artifact and provenance validation only; no network or gameplay checks."""
import pathlib,json,re,hashlib,ast,datetime,collections,gzip
O=pathlib.Path(__file__).resolve().parent;R=O.parents[3];P=pathlib.Path.home()/'.codex/research/wikis'
if not (O/'DUMP_VALIDATION.json').exists():(O/'DUMP_VALIDATION.json').write_text('{"state":"validation_in_progress"}\n')
a=json.loads((O/'DUMPS.json').read_text());rv=json.loads((O/'DUMP_REVIEW.json').read_text());series=json.loads((O/'SERIES.json').read_text())['series'];coverage=json.loads((O/'DUMP_COVERAGE.json').read_text())
def digest(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
 return h.hexdigest()
for p in O.glob('*.py'):ast.parse(p.read_text())
assert len(series)==119 and len({r['slug'] for r in series})==119
for row in series:assert (O/('DIGEST_'+row['slug']+'.md')).exists()
for wiki,e in a['wikis'].items():
 urls={x['url'] for x in e['attempts']};assert len(urls)<=2,(wiki,urls)
 if e['state']=='review_ready':
  f=pathlib.Path(e['download']['file']);assert f.stat().st_size==e['download']['bytes'];assert digest(f)==e['archive_sha256'];assert len(e['pages'])<=400
for c in rv['claims']:
 e=a['wikis'][c['wiki']];p=next(p for p in e['pages'] if p['title']==c['page']);raw=json.loads(pathlib.Path(p['private_file']).read_text());assert hashlib.sha256(raw['text'].encode()).hexdigest()==c['text_sha256'];assert c['revision_id']==p['revision_id'];assert c['source_url']==p['revision_url'];assert c['source_wiki'] in c['source_url']
 if c['series']=='The Elder Scrolls: Skyrim':assert 'skyrim' in c['page'].lower() or re.search(r'\[\[Category:[^\]]*Skyrim',raw['text'],re.I)
s=json.loads((P/'dump-route-state.json').read_text());requests=sorted(s['requests'].values(),key=lambda x:x['started']);minimum=None
for first,second in zip(requests,requests[1:]):
 gap=(datetime.datetime.fromisoformat(second['started'])-datetime.datetime.fromisoformat(first['finished'])).total_seconds();assert gap>=3.95,gap;minimum=gap if minimum is None else min(minimum,gap)
assert not s.get('pending')
assert all(r.get('status')!=429 for r in requests)
# Dictionary-key caching makes each method/URL unique, across all same-task resumptions.
assert len(requests)==len({(r['method'],r['url']) for r in requests})
source=R/'docs/research/SOURCE_REQUESTS.md';lines=source.read_text().splitlines();ids=re.findall(r'^\| (S\d+) \|',source.read_text(),re.M);assert len(ids)==len(set(ids))
ri=json.loads((O/'SOURCE_REQUEST_INDEX.json').read_text())
for req in ri['requests']:
 line=next(line for line in lines if line.startswith('| '+req['id']+' |'))
 if req.get('dump_status'):
  assert line.split('|')[-2].strip()==req['dump_status'];e=a['wikis'][req['host']];assert e['source_binding']=='same_community'
 if req['host']=='shadowslave.fandom.com':assert 'covered by dump' not in line
additional=[]
for host in ['reincarnation-paradise.fandom.com','stormlightarchive.fandom.com','mistborn.fandom.com']:
 matching=[line for line in lines if '| Lane W wiki: '+host+' |' in line];assert len(matching)==1;additional.append(matching[0].split('|')[1].strip())
coverage['additional_dump_request_ids']=additional;coverage['source_request_preservation_check']='Renderer asserts all pre-existing cells except authorized Status cells are unchanged on each write.';(O/'DUMP_COVERAGE.json').write_text(json.dumps(coverage,indent=2)+'\n')
for p in O.glob('*.md'):
 if p.name=='CHECKPOINT.md':continue
 assert '—' not in p.read_text(),p
 assert p.read_text().count('## Fandom dump revision review')<=1,p
 for target in re.findall(r'\]\(([^)]+)\)',p.read_text()):
  if not target.startswith(('http:','https:','#')):assert (p.parent/target).exists(),(p,target)
# Historical snapshot hashes are not rewritten; relative links keep original render context.
h=O/'history/pre-dump-addendum';manifest=json.loads((h/'HASHES.json').read_text())
for name,expected in manifest.items():assert digest(h/name)==expected,name
v={'state':'passed','date_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'wiki_identities_checked':len(a['wikis']),'archives':sum(e['state']=='review_ready' for e in a['wikis'].values()),'dump_claims':len(rv['claims']),'covered_request_status_cells':len(coverage['covered_source_request_ids']),'additional_request_ids':additional,'subject_records':119,'minimum_observed_s3_gap_seconds':minimum,'s3_request_count':len(requests),'checks':['Python syntax parsed','119 unique digests present','at most two database-name keys per wiki','compressed archive byte sizes and SHA-256 verified','selected page text hashes and revision bindings verified','Skyrim-only reviewed source bounds','S3 requests serial, paced and method/URL cache-unique','no pending request or 429','current Shadow Slave request not promoted by another community','source request IDs unique and existing Status cell matches','current Markdown local links resolve','historical aggregate snapshot hashes preserved'],'limits':['Semantic review is bounded to 41 claim sections, not all selected offline pages.','Wiki evidence does not authenticate primary canon or current game balance.','The initial S3 error response bodies were hashed but not retained in full; parsed error codes and headers remain.','No gameplay, build, save, commit or publication checks were run.']}
(O/'DUMP_VALIDATION.json').write_text(json.dumps(v,indent=2)+'\n');print(json.dumps(v,indent=2))
