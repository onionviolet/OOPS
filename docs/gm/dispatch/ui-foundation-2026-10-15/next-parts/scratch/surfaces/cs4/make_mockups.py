"""Static CS4 design exports only. No game scripts, commands, storage or saves."""
from pathlib import Path
import hashlib
import html
import json
import os

HERE = Path(__file__).resolve().parent
BASE = HERE.parents[3]
FRAME = BASE / 'evidence/r14/after/nav-1366-14/00-home.png'
FRAME_URL = os.path.relpath(FRAME, HERE)
STYLES = {
    'system': dict(label='System window', title='【 WORK LEDGER 】', mark='◇', bg='#0b2741',
                   fg='#e4f7ff', muted='#b0cede', accent='#92e0ff', edge='#72bfdc',
                   font='Arial, sans-serif', glow='0 0 12px #2f6882', rule='solid'),
    'jade': dict(label='Jade slip', title='WORK LEDGER · RECORD', mark='◈', bg='#17372d',
                 fg='#e7f4da', muted='#adc6a7', accent='#c6e898', edge='#83ad8a',
                 font='Georgia, serif', glow='none', rule='double'),
    'terminal': dict(label='Terminal', title='>_ WORK_LEDGER', mark='>', bg='#101c19',
                     fg='#d9f5de', muted='#9dbda7', accent='#84edb5', edge='#6dba90',
                     font='monospace', glow='none', rule='solid'),
}

CSS = '''
:root { --base-bg:#07314b; --base-panel:#0c3540; --base-text:#def4f5;
  --base-muted:#bdcedb; --base-edge:#7187ab; --base-line:#395a78;
  --base-control:#102047; --base-log:#251839; --base-log-text:#e4deee;
  --base-focus:#ffe498; --cs4-size:14px; }
* { box-sizing:border-box; } html,body { width:1366px; height:768px; margin:0; overflow:hidden; }
body { font:14px/1.35 Arial,sans-serif; color:var(--base-text); background:var(--base-bg); }
.frame { position:absolute; inset:0; width:1366px; height:768px; pointer-events:none; }
.stamp { position:absolute; top:1px; right:12px; padding:3px 7px; font:11px Arial,sans-serif;
 background:var(--base-control); color:var(--base-muted); border:1px solid var(--base-edge); }
.focus-home { position:absolute; left:489px; top:40px; width:462px; height:289px;
 background:var(--base-panel); border:2px solid #040a12; overflow:hidden; }
.base-heading { height:28px; padding:3px 10px; text-align:center; font-weight:bold;
 border-bottom:1px solid var(--base-line); background:var(--base-panel); }
.focus-body { padding:15px 18px; } .focus-body p { margin:6px 0; }
.neighbors { display:grid; grid-template-columns:1fr 1fr; gap:16px; padding:4px 0 15px; }
.neighbors strong { display:block; color:var(--base-text); }
.neighbors span { color:var(--base-muted); font-size:13px; }
.base-description { margin:4px 0; color:var(--base-text); }
.task-home { position:absolute; left:371px; top:336px; width:580px; height:384px;
 background:linear-gradient(120deg,#052749,#004369); border:2px solid #040a12;
 display:flex; flex-direction:column; }
.place { flex:none; min-height:43px; padding:4px 6px; border-bottom:1px dashed var(--base-edge); }
.place strong { font-size:16px; }.place span { float:right; color:#f4da86; }.place small {display:block;color:var(--base-muted);}
.local-tabs { display:flex; gap:14px; padding:5px 8px; border-bottom:1px solid var(--base-edge); }
.local-tabs b { border-bottom:2px solid var(--base-text); padding-bottom:3px; }
.work { padding:7px 9px; border-bottom:1px solid var(--base-edge); }
.task-content { padding:12px 10px; min-height:0; flex:1; overflow:hidden; }
.local-action { padding:8px 4px; border-bottom:1px solid var(--base-line); }
.peers { flex:none; height:30px; display:flex; border-top:1px solid var(--base-edge); background:var(--base-control); }
.peers span { flex:1; text-align:center; padding:5px; border-right:1px solid var(--base-edge); }
.back { flex:none; height:42px; border-top:1px solid var(--base-edge); padding:7px 12px; display:flex; align-items:center; justify-content:space-between; } .scroll-hint {color:var(--base-muted);}
.mock-control { display:inline-block; padding:5px 10px; border:1px solid var(--base-edge);
 background:var(--base-control); color:var(--base-text); text-decoration:none; white-space:nowrap; }
.focus-ring { outline:2px solid var(--base-focus); outline-offset:2px; }
.popup-host { position:absolute; left:505px; top:77px; width:429px; padding:10px;
 background:#152840; border:1px solid var(--base-edge); box-shadow:3px 3px #060c1b; }
.world-section { padding:0 0 8px; border-bottom:1px solid var(--base-edge); margin-bottom:8px; }
.world-section strong { display:block; }.world-section p { margin:4px 0; }
.foreign { --cs4-ff-bg:#0b2741; --cs4-ff-text:#e4f7ff; --cs4-ff-muted:#b0cede;
 --cs4-ff-accent:#92e0ff; --cs4-ff-edge:#72bfdc; --cs4-ff-font:Arial,sans-serif;
 --cs4-ff-glow:none; --cs4-ff-rule:solid; --cs4-ff-focus:#ffe498;
 background:var(--cs4-ff-bg); color:var(--cs4-ff-text); font-family:var(--cs4-ff-font);
 font-size:var(--cs4-size); line-height:1.4; border:1px var(--cs4-ff-rule) var(--cs4-ff-edge);
 box-shadow:var(--cs4-ff-glow); padding:12px 14px; position:relative; isolation:isolate; }
.foreign[data-style=jade] { border-width:3px; }
.foreign[data-style=terminal] { border-left-width:4px; }
.foreign header { display:flex; justify-content:space-between; gap:8px; align-items:baseline;
 color:var(--cs4-ff-accent); margin-bottom:8px; font-weight:bold; }
.foreign p { margin:5px 0; }.foreign .muted { color:var(--cs4-ff-muted); }
.foreign .accent { color:var(--cs4-ff-accent); }
.foreign .fact { display:flex; justify-content:space-between; gap:8px; padding:7px 0;
 border-top:1px solid var(--cs4-ff-edge); font-variant-numeric:tabular-nums; }
.foreign .fact span:last-child { font-weight:bold; }.foreign .foreign-control { display:inline-block;
 padding:5px 9px; border:1px solid var(--cs4-ff-edge); color:var(--cs4-ff-text); margin-top:9px;
 background:var(--cs4-ff-bg); }
.foreign .focus-ring { outline-color:var(--cs4-ff-focus); }
.notice { display:flex; gap:12px; align-items:start; }.notice .notice-mark { font-size:22px; line-height:1.2; color:var(--cs4-ff-accent); }
.notice header { margin-bottom:2px; }.notice p { margin:2px 0; }.notice .foreign-control {margin-top:4px;}
.notice-remaining {margin-top:14px;}
.center-view { height:100%; display:flex; flex-direction:column; padding:12px 16px; }
.center-view .reading { flex:1; overflow:auto; scrollbar-gutter:stable; }.center-view .view-nav { display:flex; gap:14px;
 padding:7px 0; border-bottom:1px solid var(--cs4-ff-edge); color:var(--cs4-ff-muted); }
.center-view .view-nav b { color:var(--cs4-ff-accent); }
.center-view h3 { margin:13px 0 7px; font-size:1em; font-weight:normal; }
.center-view .balances { display:flex; gap:24px; margin-top:10px; }
.center-view .balances strong { color:var(--cs4-ff-accent); }
.center-view .fact { padding:8px 0; }
.center-task .task-content { padding:0; }.center-task .work { padding:5px 9px; }
.center-task .back { background:var(--base-control); }
.log-mirror { position:absolute; left:967px; top:151px; width:376px; min-height:44px; padding:7px 6px;
 background:var(--base-log); color:var(--base-log-text); border-bottom:1px solid #66577d; font:14px/1.4 Arial,sans-serif; }
.log-mirror .source { color:#c8c0d8; }.log-mirror .open {text-decoration:underline; margin-left:5px;}
.foreign[data-motion=reduce],.foreign[data-effects=off] { --cs4-ff-glow:none; animation:none; transition:none; }
@media(prefers-reduced-motion:reduce) { .foreign { animation:none; transition:none; } }
'''


def foreign(style, content, cls='', appearance='authored', size=14, motion='static'):
    d = STYLES[style]
    tokens = dict(bg=d['bg'], text=d['fg'], muted=d['muted'], accent=d['accent'], edge=d['edge'],
                  font=d['font'], glow=d['glow'], rule=d['rule'], focus='#ffe498')
    if appearance == 'plain':
        tokens.update(bg='#283044', text='#f3f2f4', muted='#d0cdd7', accent='#f0e0b4',
                      edge='#b2afbe', font='Arial, sans-serif', glow='none', rule='solid')
    if motion == 'reduce':
        tokens['glow'] = 'none'
    declarations = ';'.join(f'--cs4-ff-{k}:{v}' for k, v in tokens.items()) + f';--cs4-size:{size}px'
    return f'<section class="foreign {cls}" data-style="{style}" data-motion="{motion}" data-appearance="{appearance}" style="{declarations}">{content}</section>'


def focus():
    return '''<section class="focus-home"><div class="base-heading">Around you</div><div class="focus-body">
    <div class="neighbors"><div><strong>Village elder</strong><span>Village neighbor</span></div>
    <div><strong>Village trader</strong><span>Merchant</span></div></div>
    <div class="neighbors"><div><strong>Village mixing counter</strong><span>Use the available bench</span></div>
    <div><strong>Crafting stations</strong><span>Inspect known recipes</span></div></div>
    <p class="base-description">The Village rests at the foot of the mountains.</p></div></section>'''


def task(body, center=False):
    return f'''<section class="task-home {'center-task' if center else ''}">
    <div class="place"><strong>Village</strong><span>☀ Summer · Dry · 14.7°C</span><small>01/04/999, Mon · Day</small></div>
    {'' if center else '<div class="local-tabs"><b>Actions</b><span>Options</span></div>'}
    <div class="work">No work running.</div><div class="task-content">{body}</div>
    {'<div class="back"><span class="mock-control focus-ring">← Village</span><span class="scroll-hint">Scroll details as needed ↕</span></div>' if center else ''}
    <div class="peers"><span>Here</span><span>Skills</span><span>Crafting</span><span>Mixing</span><span>?</span></div></section>'''


def render(style, surface, size=14, appearance='authored', motion='static'):
    d = STYLES[style]
    title = html.escape(d['title'])
    local = '<div class="local-action">Move somewhere else</div><div class="local-action">Try to craft something</div><div class="local-action">Talk to someone</div><div class="local-action">Find work</div>'
    front = ''
    if surface == 'popup':
        section = foreign(style, f'<header>{title}<span>Known source</span></header><p>Precision method learned.</p><p class="muted">Connected assistance is unavailable here.</p><span class="foreign-control">Open Work Ledger ›</span>', 'popup-section', appearance, size, motion)
        front = f'<aside class="popup-host"><section class="world-section"><strong>Ash wood shield</strong><p>Off-hand · Quality 80%</p><p>Known equipment. Inspection is free.</p></section>{section}</aside>'
        content = task(local)
    elif surface == 'notice':
        notice = foreign(style, f'<span class="notice-mark" aria-hidden="true">{d["mark"]}</span><div><header>{title}</header><p>Precision method learned.</p><p class="muted">Recorded in your Work Ledger.</p><span class="foreign-control">Open Work Ledger ›</span></div>', 'notice', appearance, size, motion)
        content = task(notice + '<div class="notice-remaining"><div class="local-action">Open local actions ›</div></div>')
    else:
        view = foreign(style, f'<header><span>{title}</span><span>2 points</span></header><div class="view-nav"><b>Methods</b><span>Commissions</span><span>Receipts</span></div><div class="reading"><h3>Acquisition and execution</h3><div class="fact"><span>Precision method</span><span class="accent">Learned</span></div><div class="fact"><span>Connected assistance</span><span>Unavailable</span></div><p class="muted">A learned method remains yours. Assistance needs a live connection.</p></div>', 'center-view', appearance, size, motion)
        content = task(view, True)
    suffix = '' if size == 14 and appearance == 'authored' and motion == 'static' else f'-{size}-{appearance}-{motion}'
    name = f'{style}-{surface}{suffix}'
    mirror = '<div class="log-mirror"><span class="source">Work Ledger:</span> Precision method learned.<span class="open">Open current ledger ›</span></div>'
    doc = f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=1366,initial-scale=1"><title>CS4 static proposal · {d['label']} · {surface}</title><link rel="stylesheet" href="mockups.css"><body><img class="frame" src="{FRAME_URL}" alt="Preserved R14 Village shell frame"><main aria-label="Static CS4 design proposal">{focus()}{content}{front}{mirror}<div class="stamp">CS4 · STATIC · {d['label']} / {surface}{' · 21px insert' if size==21 else ''}{' · Appearance plain' if appearance=='plain' else ''}</div></main></body></html>'''
    (HERE / f'{name}.html').write_text('\n'.join(line.rstrip() for line in doc.splitlines())+'\n')
    return dict(id=name, style=style, surface=surface, foreignTextSize=size, appearance=appearance, motion=motion,
                html=f'{name}.html', png=f'{name}.png', viewport=[1366,768])


if __name__ == '__main__':
    (HERE / 'mockups.css').write_text(CSS)
    scenes = [render(style,surface) for style in STYLES for surface in ['popup','notice','center']]
    scenes += [render(style,'center',21) for style in STYLES]
    scenes += [render('system','center',14,'plain'), render('system','notice',14,'authored','reduce')]
    (HERE / 'scenes.json').write_text(json.dumps(dict(frame=str(FRAME.relative_to(BASE)),
        frameSha256=hashlib.sha256(FRAME.read_bytes()).hexdigest(),
        scope='Static HTML proposals on preserved R14 pixels; inserted fixture text only. No game scripts or interaction implementation.',scenes=scenes),indent=2)+'\n')
    cards = ''.join(f'<article><h2>{html.escape(s["id"])}</h2><a href="{s["html"]}">HTML at 1366×768</a> · <a href="{s["png"]}">PNG original</a><a href="{s["png"]}"><img loading="lazy" src="{s["png"]}" alt="{s["id"]} static proposal"></a></article>' for s in scenes)
    (HERE / 'index.html').write_text(f'''<!doctype html><html lang="en"><meta charset="utf-8"><title>CS4 foreign style proposals</title><style>body{{background:#101721;color:#e4edf5;font:16px/1.5 system-ui;margin:24px}}a{{color:#9ee3ed}}h1{{font-size:26px}}h2{{font-size:17px}}.cards{{display:grid;grid-template-columns:repeat(2,minmax(500px,1fr));gap:20px}}article{{border:1px solid #657c96;padding:12px}}img{{display:block;width:100%;margin-top:12px}}p{{max-width:1100px}}</style><h1>CS4 · foreign style, shared shell</h1><p>Static proposals, not game captures. Each original is 1366×768. Nine core views compare system window, jade slip and terminal. Three extra center inserts use 21px text; the preserved shell remains 14px. Final two examples show Appearance plain and reduced-motion final form. All are still images with no commands or audio.</p><p>Preserved R14 shell pixels retain historical footer chrome, not a recommendation to retain that chrome. New mock content occupies the chosen Focus/task host; Reports adds only a base-style plain-text mirror. Popup combines a world section with one foreign cheat section. Review original pixels before judging fit.</p><div class="cards">{cards}</div></html>''')
    print(f'Wrote {len(scenes)} static HTML scenes and gallery.')
