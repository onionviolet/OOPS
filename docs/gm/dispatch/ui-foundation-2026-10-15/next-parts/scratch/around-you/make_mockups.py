"""AW static map studies. Reuse CS4's frame/tokens; never import/run its generator or YAIR."""
from pathlib import Path
import ast, hashlib, html, json, os
HERE=Path(__file__).resolve().parent
DISPATCH=HERE.parents[2]
CS4=HERE.parent/'surfaces/cs4'
module=ast.parse((CS4/'make_mockups.py').read_text())
base_css=next(ast.literal_eval(n.value) for n in module.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='CSS' for t in n.targets))
# Keep the CS4 palette and frame technique, replace the foreign-surface studies with base map studies.
CSS=base_css+'''
:root { --aw-size:14px; --aw-bg:#0c3540; --aw-text:#def4f5; --aw-muted:#bdcedb;
 --aw-edge:#7187ab; --aw-line:#395a78; --aw-accent:#f4da86; --aw-node:#102b48; }
body {font-size:var(--aw-size);} .stamp{left:1020px;right:auto;top:4px;font-size:12px;}
.focus-home {display:flex;flex-direction:column;} .base-heading{height:auto;flex:none;padding:4px 10px;font-size:var(--aw-size);}
.map-body{padding:7px 12px;flex:1;min-height:0;overflow:auto;scrollbar-gutter:stable;}
.map-body p{margin:3px 0 6px;} .muted{color:var(--aw-muted);} .accent{color:var(--aw-accent);}
.map{width:100%;height:148px;display:block;background:#0a2938;border:1px solid var(--aw-line);}
.map text{fill:var(--aw-text);font:var(--aw-size) Arial,sans-serif;} .map .muted{fill:var(--aw-muted);}
.map .edge{stroke:#829ab6;stroke-width:2;fill:none;} .map .rumour{stroke-dasharray:5 5;}
.map .node{fill:var(--aw-node);stroke:var(--aw-edge);stroke-width:1;}
.map .here{stroke:var(--aw-accent);stroke-width:2;} .map .chosen{fill:#23465c;stroke:var(--aw-accent);stroke-width:2;}
.map .fog{fill:#172e3d;stroke:#96a6b5;stroke-dasharray:4 4;} .map .path{fill:#234457;stroke:#7187ab;stroke-width:1;}
.map-foot{display:flex;justify-content:space-between;gap:8px;padding:6px 12px;flex:none;border-top:1px solid var(--aw-line);}
.task-home{font-size:var(--aw-size);} .place{min-height:0;float:none;padding:7px 10px;}
.place strong{font-size:var(--aw-size);} .place span{float:none;margin-left:10px;} .place small{font-size:var(--aw-size);}
.local-tabs{font-size:var(--aw-size);padding:6px 10px;gap:18px;} .task-content{overflow:auto;padding:4px 12px;scrollbar-gutter:stable;}
.row{display:flex;justify-content:space-between;gap:10px;border-bottom:1px solid var(--aw-line);padding:9px 0;}
.row p{margin:3px 0;} .row .end{white-space:nowrap;align-self:center;}.row small{font-size:var(--aw-size);color:var(--aw-muted);}
.mock-control{white-space:normal;font-size:var(--aw-size);padding:4px 8px;} .back{font-size:var(--aw-size);height:auto;min-height:42px;}
.back span{max-width:72%;}.foot{position:absolute;left:0;right:0;bottom:0;height:41px;background:#1b275d;border-top:1px solid var(--aw-accent);padding:8px 12px;display:flex;gap:23px;align-items:center;font-size:14px;}
.foot .right{margin-left:auto;color:var(--aw-muted);}.reports-cover{position:absolute;left:966px;top:77px;width:376px;height:94px;background:#251839;padding:7px;color:#e4deee;font:14px/1.45 Arial,sans-serif;}
.study-note{border-left:2px solid var(--aw-edge);padding-left:9px;color:var(--aw-muted);}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:8px;}.pair .map{height:140px;}.pair strong{display:block;margin-bottom:4px;}.pair .map text{font-size:15px;}.task-content .map{height:215px;}.map text{font-size:14.3px;}.large .map text{font-size:21px;}
.large .map{height:190px;min-width:0;}.large .map-body{padding:8px 10px;}.large .row{padding:10px 0;}
.large .back{line-height:1.2;min-height:54px;}.large .foot{font-size:21px;height:46px;}
.wide html,.wide body{width:1920px;height:1080px;}.wide .frame{width:1920px;height:1080px;}
.wide .focus-home{left:651px;top:40px;width:744px;height:408px;}.wide .task-home{left:524px;top:456px;width:871px;height:576px;}
.wide .map{height:245px;}.wide .reports-cover{left:1413px;top:85px;width:477px;height:118px;font-size:21px;}
.wide .stamp{left:1440px;}.wide .foot{height:42px;}.wide .task-content{padding:6px 16px;}
@media(max-width:1366px){ .large .focus-home{height:368px;} .large .task-home{top:412px;height:308px;} .large .reports-cover{height:125px;font-size:21px;} }
.glyphs{font-family:monospace;white-space:pre;line-height:1.45;letter-spacing:3px;margin:5px 0;font-size:22px;background:#0a2938;border:1px solid var(--aw-line);padding:10px;}
'''

def graph(kind='village',large=False):
    # SVG coordinates are presentation positions. Edges, rather than compass directions, carry meaning.
    if kind=='village':
        return '''<svg class="map" viewBox="0 0 430 148" aria-label="Schematic: Village connects to Eastern mill and Nearby cave; not a geographic map."><path class="edge" d="M140 73H195 M195 73V30H260 M195 73V119H260"/><rect class="node here" x="8" y="49" width="132" height="48"/><text x="18" y="69">● Village</text><text x="18" y="88" class="muted">You are here</text><rect class="node" x="260" y="8" width="162" height="43"/><text x="272" y="34">Eastern mill</text><text x="202" y="23">30m</text><rect class="node" x="260" y="98" width="162" height="43"/><text x="272" y="125">Nearby cave</text><text x="202" y="112">60m</text></svg>'''
    if kind in ('forest','hunter'):
        return '''<svg class="map" viewBox="0 0 430 148" aria-label="Synthetic schematic: current forest edge, known return to Village, and two cued unnamed paths."><path class="edge" d="M90 74H152"/><path class="edge rumour" d="M280 74H316V28H342 M316 74V123H342"/><rect class="node" x="5" y="54" width="85" height="41"/><text x="15" y="80">Village</text><rect class="node here" x="152" y="51" width="128" height="46"/><text x="165" y="79">● Forest edge</text><rect class="fog" x="342" y="8" width="78" height="42"/><text x="351" y="35">? path</text><rect class="fog" x="342" y="102" width="78" height="42"/><text x="351" y="129">? path</text></svg>'''
    if kind=='cave':
        return '''<svg class="map" viewBox="0 0 430 148" aria-label="Synthetic room sketch: Cave room beside the known entrance. No tactical or enemy coordinates."><path class="path" d="M15 38L124 28L134 102L24 117Z M134 54H190V81H134Z M190 16L393 25L418 112L208 132Z"/><text x="28" y="63">Entrance</text><text x="28" y="88" class="muted">Known exit</text><text x="218" y="62">● Cave room</text><text x="218" y="87">18 / 25 groups left</text><text x="218" y="111" class="muted">No enemy positions</text></svg>'''
    if kind=='atlas':
        return '''<svg class="map" viewBox="0 0 550 215" aria-label="Known-place atlas, schematic connections, not world terrain."><path class="edge" d="M95 105H240 M240 105L414 45 M95 105V145H382 M95 105V185H240"/><rect class="node here" x="8" y="76" width="136" height="52"/><text x="22" y="106">● Village</text><rect class="node" x="206" y="80" width="143" height="48"/><text x="218" y="109">Nearby cave</text><rect class="node" x="382" y="20" width="151" height="48"/><text x="394" y="49">Cave room</text><rect class="node" x="382" y="136" width="151" height="48"/><text x="394" y="165">Forest road</text><rect class="node" x="186" y="163" width="149" height="44"/><text x="198" y="190">Eastern mill</text></svg>'''

def rows(items):
    return ''.join(f'<div class="row"><div><strong>{a}</strong><p>{b}</p><small>{c}</small></div><span class="end">{d}</span></div>' for a,b,c,d in items)

SCENES=[]
def scene(id,title,kind,items,conditions,summary,caption,size=14,wide=False,extra='',atlas=False,pair=False):
    frame=DISPATCH/('evidence/r14/after/nav-1920-21/00-home.png' if wide else 'evidence/r14/after/nav-1366-21/00-home.png' if size==21 else 'evidence/r14/after/nav-1366-14/00-home.png')
    figure=graph(kind,size==21)
    if pair:
        compact='''<svg class="map" viewBox="0 0 210 148" aria-label="Same public graph with Village return and two cued paths"><path class="edge" d="M48 37V57"/><path class="edge rumour" d="M92 78H110V30H127 M110 78V122H127"/><rect class="node" x="5" y="5" width="87" height="32"/><text x="12" y="27">Village</text><rect class="node here" x="5" y="57" width="87" height="42"/><text x="11" y="74">● Forest</text><text x="25" y="91">edge</text><rect class="fog" x="127" y="9" width="77" height="40"/><text x="134" y="35">? path</text><rect class="fog" x="127" y="101" width="77" height="40"/><text x="134" y="127">? path</text></svg>''';figure='<div class="pair"><div><strong>No lens</strong>'+compact+'</div><div><strong>Hunter reading</strong>'+compact+'</div></div>'
    if kind=='glyph':
        figure='<pre class="glyphs" aria-label="Synthetic glyph terrain, only cued exits marked unknown">≈ ≈ · · ♣ ♣ ?\n≈ · · @ · ♣ ♣\n· · ♣ · · · ?\n♣ ♣ ♣ ♣ · · ·</pre>'
    body=f'''<img class="frame" src="{os.path.relpath(frame,HERE)}" alt="Historical R14 shell frame"/>
<div class="stamp">AW · STATIC PROPOSAL · {size}px</div>
<section class="focus-home"><div class="base-heading">Around you · {title}</div><div class="map-body"><p class="muted">{caption}</p>{figure}{extra}</div><div class="map-foot"><span>{summary}</span><span class="accent">Open area map ›</span></div></section>
<section class="task-home"><div class="place"><strong>{title}</strong><small>{conditions}</small></div><nav class="local-tabs"><b>{'Area map' if atlas else 'Here'}</b><span>{'Place details' if atlas else 'People'}</span><span>{'Known routes' if atlas else 'Activities'}</span></nav><div class="task-content">{graph('atlas') if atlas else ''}{rows(items)}</div><div class="back"><span>{'← Around you · Esc' if atlas else 'Inspect first · commands stay explicit'}</span><span class="mock-control">{'Close map' if atlas else 'Place details ›'}</span></div></section>
<div class="reports-cover">Reports<br><span class="muted">Static sample · place context stays visible.</span><br>No game events are running.</div><div class="foot"><span>Save</span><span>Export</span><span>Import</span><span>Settings</span><span class="right">Static map study · controls do not execute</span></div>'''
    doc=f'<!doctype html><html lang="en" class="{"wide" if wide else ""}"><meta charset="utf-8"><title>AW {title}</title><link rel="stylesheet" href="mockups.css"><body class="{"large" if size==21 else ""}" style="--aw-size:{size}px">{body}</body></html>'
    (HERE/f'{id}.html').write_text(doc)
    SCENES.append(dict(id=id,html=id+'.html',png=id+'.png',width=1920 if wide else 1366,height=1080 if wide else 768,size=size,frame=os.path.relpath(frame,HERE),frameSha256=hashlib.sha256(frame.read_bytes()).hexdigest()))

village=[('People here · 2 known','Village elder · Village trader','From currently available people, not a population census','Inspect ›'),('Work here','Gather wood · Fish in the river','Read native tool, time and yield details before starting','Activities ›'),('Nearby cave','Known route · 60m in this fixture','Select the place to inspect; travel remains a separate command','Inspect ›')]
scene('village-nodes-14','Village','village',village,'Day · Summer · Dry · 14.7°C','2 people · 3 entries','Connections only · not to scale')
scene('village-nodes-21','Village','village',village,'Day · Summer · Dry · 14.7°C','2 people · 3 entries','Connections only · not to scale',size=21)
scene('village-nodes-1920-21','Village','village',village,'Day · Summer · Dry · 14.7°C','2 people · 3 entries','Connections only · not to scale',size=21,wide=True)
scene('cave-sketch-14','Cave room','cave',[
 ('Mid-clear · between groups','Clears 0 · 18 / 25 groups left','Synthetic saved-progress fixture; no active opponents','Resume ›'),
 ('Entrance','Return to Nearby cave · 5m in this fixture','This is travel, not inspection Back','Travel ›'),
 ('Place effects','Narrow · Bright','Inspect native effective modifiers; no inferred troop positions','Details ›')],
 'Day · Sheltered · native temperature on detail','Known entrance · 5m','Room sketch option · synthetic shape, no distance')
forest=[('What you can see','Two paths disappear behind the trees','Public path cues justify these two ? marks; no hidden catalogue','Inspect ›'),('Wildlife','? · rustling heard nearby','A cue, not a counted population; no exact positions','Details ›'),('Gathering','Known woodcutting and herb work','Yields are activity facts; no stock/regrowth claim','Activities ›')]
scene('forest-nodes-no-lens-14','Forest edge','forest',forest,'Day · Dry · local conditions where known','Wildlife ? · no survey','Synthetic graph · ? means a cued path')
hunter=[forest[0],('Wildlife','Tracks suggest 2–4 animals','Estimate · hunter reading · observed at 08:10, not live census','Sources ›'),forest[2]]
scene('forest-nodes-hunter-14','Forest edge','hunter',hunter,'Day · Dry · local conditions where known','Tracks: 2–4 · estimate','Same public topology · only the annotation changes')
scene('forest-glyph-option-14','Forest edge','glyph',[
 ('Glyph key','@ you · ♣ trees · ≈ water · ? cued path','Synthetic cell owner required; not current YAIR geometry','Key ›'),
 ('Travel','Select an exit, inspect the route, then travel','Cells do not create a new step-by-step movement command','Routes ›')],
 'Alternative study · all cell positions synthetic','Tile/glyph alternative · higher owner cost','Cell map option · not a proposed native data claim')
scene('lens-comparison-14','Forest edge','forest',[
 ('No lens','Wildlife ? · rustling heard nearby','Public cue only; no count and no location','Inspect ›'),
 ('Hunter reading','Tracks suggest 2–4 animals','Fallible estimate · tracks observed at 08:10','Sources ›'),
 ('Same map, different reading','No extra node, road, target or secret outline appears','A lens grants scoped facts; it does not switch on omniscience','Details ›')],
 'Same place · same public paths · same clock','Both maps retain the same known exits','Two views of one synthetic place',pair=True)
scene('known-atlas-14','Village vicinity','village',[
 ('Known connections','Village → Nearby cave · Village → Forest road','Schematic presentation only; no claimed compass or world scale','Inspect ›'),
 ('Nearby cave selected','60m in this fixture · known return route','Future view must quote the current native travel command','Travel ›')],
 'Area atlas · one known component · no world boundary','Local context remains while browsing','Compact context map; area atlas below',atlas=True)
(HERE/'mockups.css').write_text(CSS)
(HERE/'scenes.json').write_text(json.dumps({'scope':'AW authored static map studies; synthetic geometry and illustrative readings; not game evidence','tooling':'Adapted from CS4 AST CSS extraction, historical frame overlay and Playwright screenshot/geometry receipt','scenes':SCENES},indent=2)+'\n')
links=''.join(f'<article><h2>{html.escape(s["id"])}</h2><a href="{s["html"]}">Open static HTML</a> · <a href="{s["png"]}">PNG</a><img src="{s["png"]}" width="650" alt="{s["id"]}"></article>' for s in SCENES)
(HERE/'index.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><title>AW map studies</title><style>body{background:#09182b;color:#def4f5;font:16px Arial;margin:24px}a{color:#b6e8ff}main{display:flex;flex-wrap:wrap;gap:20px}article{width:650px}img{display:block;margin-top:12px;border:1px solid #7187ab}</style><h1>Around you: spatial styles</h1><p>Static proposals only. Village edges use native connections; synthetic cave shape, forest cells, cued paths and hunter readings explore future adapters. Historical shell underlay is unchanged. No controls run the game.</p><main>'+links+'</main></html>')
print(f'Wrote {len(SCENES)} static scenes')
