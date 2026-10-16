from pathlib import Path
import shutil,json,html,re
root=Path(__file__).parent;e=root/'evidence/r14';dest=Path.home()/'.codex/candidates/yair-ui-r14-readiness-2026-10-15'
review=dest/'r14';review.mkdir(exist_ok=True)
for phase in ['before','after']:shutil.copytree(e/phase,review/phase,dirs_exist_ok=True)
pairs=[]
for p in sorted((e/'before').glob('*.png')):
 if (e/'after'/p.name).exists():pairs.append(p.name)
for folder in ['nav-1366-14','nav-1366-21','nav-1920-21']:
 manifest=e/'before'/folder/'sweep.json'
 if not manifest.exists():continue
 routes=json.loads(manifest.read_text())
 names=['00-home.png']+[str(i+1).zfill(2)+'-'+re.sub(r'\W+','_',r['label'])+'.png' for i,r in enumerate(routes) if r.get('label') and not r.get('disabled') and not r.get('error')]
 for n in names:
  rel=folder+'/'+n
  if (e/'before'/rel).exists() and (e/'after'/rel).exists():pairs.append(rel)
body=''.join(f'<section><h2>{html.escape(n)}</h2><div class="pair"><figure><figcaption>Before</figcaption><a href="before/{n}"><img src="before/{n}"></a></figure><figure><figcaption>R14 candidate</figcaption><a href="after/{n}"><img src="after/{n}"></a></figure></div></section>' for n in pairs)
page='''<!doctype html><meta charset="utf-8"><title>YAIR R14 before / after</title><style>body{background:#101827;color:#e8f0f5;font:16px system-ui;margin:20px}a{color:#99e0ff}button{font:inherit}figure{margin:0;overflow:auto}img{max-width:100%;height:auto}.pair{display:grid;grid-template-columns:1fr 1fr;gap:12px}body.native .pair{display:block}body.native img{max-width:none}section{margin:32px 0}figcaption{padding:8px}</style><h1>R14 · Scan recipe readiness</h1><p>Synthetic restored states at matched viewport and text size. Reports use30native rendered combat ticks. Candidate technical proof; visual/play acceptance remains open.</p><p><a href="/r14-demo.html">Play synthetic Cooking demo</a> · <button onclick="document.body.classList.toggle('native')">Toggle fit / 100% pixels</button> · Click an image for its original.</p>'''+body
(review/'comparison.html').write_text(page)
fixture=(root/'evidence/r12/cooking-fixture.save.json').read_text()
(dest/'r14-demo.html').write_text('<!doctype html><meta charset="utf-8"><title>R14 synthetic demo</title><p>Loading synthetic Cooking fixture…</p><script>localStorage.setItem("save data",'+json.dumps(fixture)+');localStorage.setItem("yairpg.presentation.proto23-parity.v1","on");location.replace("/");</script>')
print('comparison pairs',len(pairs))
