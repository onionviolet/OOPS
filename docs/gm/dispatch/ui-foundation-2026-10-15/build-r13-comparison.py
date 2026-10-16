# R13 before/after: same populated save, 1366x768 14px. Before = R12 frozen (19251), after = R13 frozen (19253).
from pathlib import Path
import shutil
p=Path(__file__).parent;e=p/'evidence/r13';cand=Path.home()/'.codex/candidates/yair-ui-r13-regions-2026-10-15-claude'
pairs=[('00-home','Idle Village','Around you was blank; now the place card lists who and what is here'),('02-Inventory','Inventory button','The list was pulled into a cramped center box and its own panel went blank; now it stays home and the search box gets focus'),('03-Journal','Journal','216px tall with an empty Around you; now the full column, one Back'),('08-People','People','Same: 216px to 511px'),('14-Settings','Settings','744px of settings in 216px; now 511px')]
rows=''.join(f'<section><h2>{t}</h2><p>{d}</p><div class="pair"><figure><figcaption>Before · R12</figcaption><img src="sweep-before/{n}.png" alt=""></figure><figure><figcaption>After · R13</figcaption><img src="sweep/{n}.png" alt=""></figure></div></section>' for n,t,d in pairs)
html=f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>R13 regions with a job</title><style>body{{margin:16px;background:#101b25;color:#e5edf4;font:16px system-ui}}.pair{{display:grid;grid-template-columns:1fr 1fr;gap:12px}}figure{{margin:0;background:#192b3a}}figcaption{{padding:6px 8px}}img{{display:block;width:100%}}h2{{font-size:1.1em;margin-top:1.4em}}p{{max-width:1100px}}</style>
<h1>R13 · every region has a job</h1><p>Same populated save, 1366×768, 14px text. Larger-text and combat captures: idle-1366-21, journal-1366-21, combat-1366-14, combat-1920-21 in this folder.</p>{rows}
<section><h2>Combat</h2><p>Opponent toolbar now carries the native area progress ("groups left", "Clears").</p><img src="combat-1366-14.png" alt="" style="max-width:900px;width:100%"></section></html>'''
(e/'comparison.html').write_text(html)
d=cand/'r13';(d/'sweep').mkdir(parents=True,exist_ok=True);(d/'sweep-before').mkdir(exist_ok=True)
for f in e.glob('*.png'):shutil.copy2(f,d/f.name)
for sub in ['sweep','sweep-before']:
    for f in (e/sub).glob('*.png'):shutil.copy2(f,d/sub/f.name)
shutil.copy2(e/'comparison.html',d/'comparison.html');print('ok')
