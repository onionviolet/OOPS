# R12 before/after comparison: before = frozen R11 (19171), after = R12 candidate (19251), same fixture and sizes.
from pathlib import Path
import json, shutil
p = Path(__file__).parent; e = p/'evidence/r12'
cand = Path.home()/'.codex/candidates/yair-ui-r12-recipe-2026-10-15-claude'
cases = [(1366, '14'), (1366, '17.5'), (1366, '21'), (1920, '21')]
bg = {g['w'], } if False else None
before = {(g['w'], str(g['f']).rstrip('0').rstrip('.') if isinstance(g['f'], float) else str(g['f'])): g for g in json.load(open(e/'before-geometry.json'))}
after = {(g['w'], str(g['f']).rstrip('0').rstrip('.') if isinstance(g['f'], float) else str(g['f'])): g for g in json.load(open(e/'after-geometry.json'))}
rows = ''
for w, f in cases:
    b, a = before[(w, f)], after[(w, f)]
    h = b['viewport'][1]
    def where(g):
        c = g['commit']; return f"Craft 1 at y {c['top']}–{c['bottom']} of {h}px" + (" (off-screen, needs inner scroll)" if c['bottom'] > h else " (visible)")
    rows += f'''<section><h2>{w}×{h} at {f}px text</h2><div class="pair">
<figure><figcaption><b>Before</b> · R11 · {where(b)}</figcaption><div class="frame"><img src="before-{w}-{f}.png" alt="R11 Cooking, {w} wide, {f}px"></div></figure>
<figure><figcaption><b>After</b> · R12 · {where(a)}</figcaption><div class="frame"><img src="after-{w}-{f}.png" alt="R12 Cooking, {w} wide, {f}px"></div></figure></div></section>'''
html = f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>R12 recipe clarity</title>
<style>body{{margin:16px;background:#101b25;color:#e5edf4;font:16px system-ui}}a{{color:#a6def5}}.pair{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}}figure{{margin:0;min-width:0;background:#192b3a}}figcaption{{padding:8px}}img{{display:block;width:100%}}p,ul{{max-width:1100px}}h1{{font-size:1.4em}}h2{{font-size:1.1em;margin-top:1.6em}}.z img{{width:auto;max-width:none}}.z .frame{{overflow:auto;max-height:80vh}}</style>
<h1>R12 · native Cooking recipe clarity</h1>
<p>Same synthetic save (Village, 3 known Rat meat chunks, unknown Belmart leaf), same selected recipe (Roasted rat meat), same sizes. Click an image's frame to view at 100%: <label><input type="checkbox" onchange="document.body.classList.toggle('z',this.checked)"> show at 100%</label></p>
<ul><li>Crafting now borrows the full-height right-center column (Around you is empty during the service); You is untouched, Inventory widens.</li>
<li>Detail text follows your chosen size; Craft stays pinned; list and detail scroll on their own. Narrow-in-text columns stack list above detail.</li>
<li>Uses · have / need; Can craft now: N attempts; known effects of using the result (food poisoning marked as a debuff) before you craft; related recipes on the same station with a local Back.</li></ul>
<p><a href="/r12-demo.html" target="_blank">Play R12 · synthetic cooking save</a> · <a href="http://127.0.0.1:19171/r11-demo.html" target="_blank">R11 for comparison</a> · report: docs/gm/dispatch/ui-foundation-2026-10-15/R12_REPORT.md</p>
{rows}
<h2>After one explicit Craft 1 (1366×768, 14px)</h2><div class="pair"><figure><figcaption>Ready, related link visible</figcaption><img src="journey-1366-14-ready.png" alt=""></figure><figure><figcaption>Receipt from measured native deltas; attempts drop to 0 with the named shortage</figcaption><img src="journey-1366-14-after-craft.png" alt=""></figure></div>
</html>'''
(e/'comparison.html').write_text(html)
dest = cand/'r12'; dest.mkdir(exist_ok=True)
for f in e.glob('*.png'): shutil.copy2(f, dest/f.name)
shutil.copy2(e/'comparison.html', dest/'comparison.html')
fx = (e/'cooking-fixture.save.json').read_text()
(cand/'r12-demo.html').write_text('<!doctype html><meta charset="utf-8"><title>YAIR R12 synthetic cooking demo</title><script>localStorage.setItem("save data",' + json.dumps(fx) + ');localStorage.setItem("yairpg.presentation.proto23-parity.v1","on");location.replace("/");</script>')
print('ok')
