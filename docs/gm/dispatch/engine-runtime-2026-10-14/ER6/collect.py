import concurrent.futures,json,urllib.request,urllib.parse,re,pathlib,datetime
out=pathlib.Path(__file__).parent
names=['bitecs','miniplex','koota','@sqlite.org/sqlite-wasm','immer','@preact/signals-core','zod','valibot','@sinclair/typebox','typebox','yuka','rot-js','ngraph.path','pure-rand','simplex-noise','tracery','tracery-grammar','howler','pixi.js','break_infinity.js','decimal.js','@playwright/test','vitest','mitt','idb','fflate']
def get(url):
 req=urllib.request.Request(url,headers={'User-Agent':'ER6-library-research','Accept':'application/json'})
 with urllib.request.urlopen(req,timeout=35) as r:return json.load(r)
def collect(n):
 try:
  u='https://registry.npmjs.org/'+urllib.parse.quote(n,safe='@')
  d=get(u);v=d['dist-tags']['latest'];p=d['versions'][v];repo=p.get('repository',{});repo=repo if isinstance(repo,str) else repo.get('url','');m=re.search(r'github.com[:/]([^/]+/[^/#]+)',repo);gh=m.group(1).removesuffix('.git') if m else None
  row={'name':n,'checked_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'registry_url':u,'version':v,'release':d.get('time',{}).get(v),'license':p.get('license'),'repository':repo,'homepage':p.get('homepage'),'module':p.get('module'),'type':p.get('type'),'main':p.get('main'),'exports':p.get('exports'),'dependencies':p.get('dependencies',{}),'tarball':p['dist']['tarball'],'gitHead':p.get('gitHead')}
  if gh:
   row['github_api']='https://api.github.com/repos/'+gh
   try:
    g=get(row['github_api']);row['github']={k:g.get(k) for k in ['html_url','pushed_at','updated_at','archived','license','default_branch']}
   except Exception as e:row['github_error']=str(e)
  return row
 except Exception as e:return {'name':n,'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:rows=list(ex.map(collect,names))
(out/'package-data.json').write_text(json.dumps(rows,indent=2)+'\n')
for r in rows: print(r['name'],r.get('version'),r.get('release'),r.get('license'),r.get('repository'),r.get('github',{}).get('pushed_at'),r.get('github_error',''))
