"""CY static proposals. Reuses CS4 shell/foreign helpers; never imports the game."""
from pathlib import Path
import importlib.util
import hashlib, html, json, os
HERE=Path(__file__).resolve().parent
BASE=HERE.parents[2]
OLD=HERE.parent/'surfaces/cs4/make_mockups.py'
spec=importlib.util.spec_from_file_location('cs4',OLD)
cs4=importlib.util.module_from_spec(spec); spec.loader.exec_module(cs4)
FAMILIES={
 'system':dict(label='System / status window', title='STATUS INTERFACE',mark='[ ]',bg='#041327',fg='#e8faff',muted='#b5dbf4',accent='#8ef3ff',edge='#61d8f5',font='"Menlo", "Consolas", monospace',glow='inset 0 0 35px #07527a',rule='double',quote='Grip correction acquired.',detail='Keep the rim angled. Let the impact slide.',route='Status record'),
 'sage':dict(label='Sage / inner voice',title='THE INNER VOICE',mark='✧',bg='#161423',fg='#fcf1db',muted='#d8cce4',accent='#f2d49c',edge='#c3aecf',font='"Palatino", "Book Antiqua", Georgia, serif',glow='none',rule='solid',quote='“Your hand is fighting the shield.”',detail='“Loosen your fingers. Let the rim turn the blow.”',route='Inner dialogue'),
 'ring':dict(label='Grandpa in the ring / spirit',title='VOICE WITHIN THE RING',mark='◌',bg='#191d20',fg='#f5ead5',muted='#d3c7b1',accent='#f5cc80',edge='#bba576',font='"Baskerville", Georgia, serif',glow='inset 0 0 50px #3c3325',rule='solid',quote='“Hah. Holding it tighter will not help.”',detail='“Turn your wrist, youngster. The wood can take the rest.”',route='Ring communion'),
 'jade':dict(label='Jade slip / inheritance',title='JADE INHERITANCE',mark='◇',bg='#10392f',fg='#edf6d7',muted='#c3dfc9',accent='#f5df9b',edge='#acdaa9',font='"Songti SC", "Palatino", Georgia, serif',glow='inset 0 0 35px #1a644c',rule='double',quote='First form · The yielding rim',detail='Yield at the wrist; remain rooted at the elbow.',route='Read inheritance'),
 'book':dict(label='Flaw book / library',title='BOOK OF SMALL ERRORS',mark='§',bg='#e6d3aa',fg='#332719',muted='#443523',accent='#8a1824',edge='#6a4229',font='"Iowan Old Style", "Palatino", Georgia, serif',glow='inset 0 0 35px #b6a077',rule='solid',quote='An error in the grip.',detail='The fingers are rigid. The rim cannot turn the blow.',route='Open annotated page'),
 'simulator':dict(label='Simulator / foresight',title='POSSIBILITY ENGINE',mark='⌁',bg='#151824',fg='#f4f0ff',muted='#c9c8e0',accent='#d7c1ff',edge='#a4a2d6',font='"Menlo", "Consolas", monospace',glow='inset 0 0 45px #2c2442',rule='solid',quote='A different grip changes the branch.',detail='Preview only. No action has been taken.',route='Review foresight'),
}
for family in FAMILIES.values():
 family['font']=family['font'].replace('"','')
cs4.STYLES=FAMILIES
CSS=cs4.CSS+'''
/* CY: stronger local identities. CS4 shared scaffold remains above. */
:root{--cy-scrim:#10132a;--cy-base:#071b38;--cy-shell-edge:#7897b1;--cy-shell-text:#e3f4f7;--cy-shell-muted:#b9d0dd}
html,body{width:var(--vw);height:var(--vh)}
body{font-size:var(--size)}.frame{width:100%;height:100%}
.focus-home{display:none}.stamp{left:12px;right:auto;top:30px;font-size:10px;opacity:.97;z-index:8}
.task-home{left:var(--tx);top:var(--ty);width:var(--tw);height:var(--th);font-size:var(--size);overflow:hidden}
.place{height:auto;min-height:42px;padding:5px 9px}.place strong{font-size:1em}.place small{font-size:1em}
.place span{font-size:1em}.work{font-size:1em;padding:5px 9px}.task-content{padding:10px;overflow:auto;scrollbar-gutter:stable}
.peers{height:auto;min-height:30px;font-size:1em}.back{height:auto;min-height:42px;gap:12px;font-size:1em;background:var(--cy-base)}
.mock-control{font-size:1em}.local-action{padding:8px 4px}.center-task .task-content{padding:0;overflow:hidden}
.notice-host{position:absolute;left:calc(var(--fx) + 2px);top:77px;width:calc(var(--fw) - 4px);height:calc(var(--ty) - 84px);padding:10px;background:#0c3540;overflow:hidden}.notice-host .foreign{max-height:100%}
.popup-host{left:var(--px);top:var(--py);width:var(--pw);max-height:calc(var(--vh) - 150px);overflow:auto;padding:10px;font-size:var(--size)}
.world-section{font-size:1em;padding:2px 4px 10px}.world-section strong{font-weight:700}.world-section p{margin:3px 0}
.popup-caption{display:flex;justify-content:space-between;margin-top:9px;color:var(--cy-shell-muted)}
.foreign{font-size:var(--size);min-width:0;overflow:hidden;isolation:isolate;padding:18px 22px;line-height:1.4;
 border:1px solid var(--cs4-ff-edge);box-shadow:var(--cs4-ff-glow);position:relative}
.foreign:before,.foreign:after{pointer-events:none}.foreign > :not(.ornament){position:relative;z-index:1}
.foreign .kicker{font-family:var(--cs4-ff-font);font-size:1em;letter-spacing:.06em;color:var(--cs4-ff-muted);margin:0 0 8px}
.foreign h1{font-size:1.8em;font-weight:400;line-height:1.05;margin:6px 0 13px;color:var(--cs4-ff-accent)}
.foreign h2{font-size:1.15em;line-height:1.2;margin:5px 0 12px;font-weight:400;color:var(--cs4-ff-accent)}
.foreign p{margin:8px 0}.foreign .quote{font-size:1.35em;line-height:1.3}.foreign .detail{color:var(--cs4-ff-text)}
.foreign .source-note{color:var(--cs4-ff-muted);font-size:1em;margin:12px 0 0}
.foreign .foreign-control{background:var(--cs4-ff-bg);color:var(--cs4-ff-text);font:inherit;padding:7px 12px;white-space:normal;text-align:left;margin:7px 4px 0 0;box-shadow:none;border:1px solid var(--cs4-ff-edge)}
.foreign .selected{outline:2px solid var(--cs4-ff-focus);outline-offset:2px}
.foreign .facts{margin-top:12px}.foreign .fact{padding:7px 0;align-items:baseline;gap:16px}.foreign .fact span:first-child{color:var(--cs4-ff-muted)}
.foreign .fact span:last-child{font-weight:400;text-align:right}.foreign .route-hint{color:var(--cs4-ff-muted);border-top:1px solid var(--cs4-ff-edge);margin-top:14px;padding-top:10px}
.center-view{height:100%;padding:0;display:block}.reading{height:100%;overflow:auto;scrollbar-gutter:stable;padding:20px 24px}
.foreign .ornament{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;color:var(--cs4-ff-accent)}
.foreign .watermark{position:absolute;right:14px;top:20px;line-height:1;font-size:6em;opacity:.15;color:var(--cs4-ff-accent);pointer-events:none}
.notice{display:block;padding:16px 20px}.notice .quote{margin:4px 0}.notice .kicker{margin:0 0 6px}.notice .notice-main{max-width:100%}
.notice .detail{margin:6px 0}.notice .source-note{margin:6px 0}.notice-remaining{margin-top:10px}
.log-mirror{left:var(--lx);top:var(--ly);width:var(--lw);font-size:var(--size);padding:8px;background:#251839;color:#e4deee;line-height:1.4}
.log-mirror .source{color:#c8c0d8}.log-mirror .open{display:block;text-decoration:underline;margin-left:0}
.footer-reconstruction{position:absolute;left:0;bottom:0;width:100%;height:42px;background:#19274f;border-top:2px solid #e8c858;display:flex;align-items:center;justify-content:space-between;color:#ecf5ff;padding:0 12px;gap:16px;font:14px Arial,sans-serif;z-index:7}
.footer-reconstruction span{padding-right:14px}.footer-reconstruction .provenance{color:#c4cdd9;font-size:12px}
.foreign[data-style=system]{border:3px double var(--cs4-ff-edge);background-image:linear-gradient(0deg,transparent 97%,#11628b55 98%),linear-gradient(90deg,transparent 97%,#11628b55 98%),radial-gradient(ellipse at 100% 0,#114f78,transparent 65%);background-size:24px 24px,24px 24px,100% 100%;clip-path:polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)}
.foreign[data-style=system]:after{content:'';position:absolute;inset:6px;border:1px solid var(--cs4-ff-edge);opacity:.6}
.foreign[data-style=system] .kicker{letter-spacing:.13em}.foreign[data-style=system] .quote{color:var(--cs4-ff-accent)}
.foreign[data-style=system] .fact{font-variant-numeric:tabular-nums;background:var(--cs4-ff-bg);padding:8px 10px;margin:4px 0;border:0}
.foreign[data-style=system] .quote:before{content:'[ ';color:var(--cs4-ff-accent)}.foreign[data-style=system] .quote:after{content:' ]';color:var(--cs4-ff-accent)}
.foreign[data-style=sage]{border:0;background:radial-gradient(ellipse at 90% 30%,#463755 0,transparent 55%),var(--cs4-ff-bg);padding:22px 26px}
.foreign[data-style=sage]:before{content:'';position:absolute;left:0;top:12%;height:76%;width:3px;background:linear-gradient(transparent,var(--cs4-ff-accent),transparent)}
.foreign[data-style=sage] .quote,.foreign[data-style=sage] .detail{font-style:italic}.foreign[data-style=sage] h1{font-style:italic}
.foreign[data-style=sage] .fact{border-top:0}.foreign[data-style=sage] .foreign-control{border:0;border-bottom:1px solid var(--cs4-ff-edge);padding-left:0}
.foreign[data-style=ring]{border:0;border-top:2px solid var(--cs4-ff-edge);background-image:radial-gradient(ellipse at 100% 50%,#5b4b3655,transparent 60%);padding-right:124px}
.foreign[data-style=ring] .quote{font-style:italic}.foreign[data-style=ring] .portrait{position:absolute;right:0;top:8px;width:122px;height:190px;color:var(--cs4-ff-muted);opacity:.7;pointer-events:none}
.foreign[data-style=ring] .ring-mark{position:absolute;right:25px;bottom:12px;width:65px;height:65px;color:var(--cs4-ff-accent);pointer-events:none}
.foreign[data-style=ring] .reading{padding-right:132px}.foreign[data-style=ring].center-view{padding-right:0}
.foreign[data-style=ring] .fact{display:block}.foreign[data-style=ring] .fact span{display:block;text-align:left!important}
.foreign[data-style=jade]{border:7px double var(--cs4-ff-edge);border-radius:12px 5px 12px 5px;background-image:repeating-linear-gradient(115deg,transparent 0 31px,#8fcbaa0b 32px 34px,transparent 36px 80px),radial-gradient(ellipse at 100% 0,#31735677,transparent 65%);box-shadow:inset 0 0 0 4px #061f21,inset 0 0 40px #396c45}
.foreign[data-style=jade] .kicker{letter-spacing:.16em}.foreign[data-style=jade] .quote{color:var(--cs4-ff-accent)}
.foreign[data-style=jade] .seal{position:absolute;right:16px;top:45px;width:38px;height:42px;border:3px double #f6a59e;color:#f6a59e;display:grid;place-items:center;transform:rotate(4deg);font-family:Georgia,serif;font-size:28px;line-height:1;pointer-events:none}
.foreign[data-style=jade] h1{padding-right:40px}.foreign[data-style=jade] .quote{padding-right:25px}
.foreign[data-style=book]{border:1px solid var(--cs4-ff-edge);border-left:9px double var(--cs4-ff-edge);background-image:repeating-linear-gradient(0deg,transparent 0 25px,#6b4d2410 26px 27px),linear-gradient(90deg,#9d774c33,transparent 12%,transparent 90%,#93724533)}
.foreign[data-style=book] .quote{font-style:italic;color:var(--cs4-ff-text)}.foreign[data-style=book] .red-note{display:block;color:var(--cs4-ff-accent);font-style:italic;padding:6px 0;margin:10px 0}.foreign[data-style=book] .red-note:after{content:'';display:block;height:4px;margin-top:7px;border-top:2px solid var(--cs4-ff-accent);border-radius:50%;transform:rotate(-1deg)}
.foreign[data-style=book] .reading{padding-left:35px}.foreign[data-style=book] .fact{border-color:#82623f}.foreign[data-style=book] h1{font-style:italic}
.foreign[data-style=simulator]{border:1px solid var(--cs4-ff-edge);border-left:5px solid var(--cs4-ff-accent);background-image:radial-gradient(ellipse at 100% 100%,#4e345d77,transparent 70%)}
.foreign[data-style=simulator] .branches{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0 8px;padding-top:18px;position:relative}
.foreign[data-style=simulator] .branches:before{content:'';position:absolute;left:25%;right:25%;top:0;height:13px;border:1px solid var(--cs4-ff-edge);border-bottom:0}
.foreign[data-style=simulator] .branch{padding:9px;border:1px solid var(--cs4-ff-edge);background:var(--cs4-ff-bg)}
.foreign[data-style=simulator] .branch.faded{color:var(--cs4-ff-muted);border-style:dashed}.foreign[data-style=simulator] .branch strong{display:block;margin-top:5px;font-weight:400}
.notice[data-style=ring] .portrait{height:145px;width:100px;top:6px}
.expanded-center .task-home{left:var(--fx);top:40px;width:var(--fw);height:calc(var(--vh) - 88px)}
.expanded-center .task-home{z-index:2}.expanded-center:before{z-index:1;content:'';position:absolute;left:var(--tx);top:var(--ty);width:calc(var(--fx) - var(--tx));height:var(--th);background:#062846;border:2px solid #040a12}
.expanded-center .place span{float:none;display:block}.expanded-center .back .scroll-hint{font-size:1em}.expanded-center .back{flex-wrap:wrap;gap:3px}.expanded-center .reading{padding:16px 18px}
.takeover{position:absolute;left:var(--fx);top:40px;width:var(--fw);height:calc(var(--vh) - 88px);padding:0;border:3px double var(--cs4-ff-edge);z-index:5}
.takeover{display:flex;flex-direction:column}.takeover .reading{height:auto;min-height:0;flex:1;padding:26px 27px;display:flex;flex-direction:column;justify-content:flex-start;gap:12px;overflow:auto}
.takeover h1{font-size:2.5em;line-height:1.08;letter-spacing:-.05em}.takeover .awakening-art{height:160px;min-height:80px;width:100%;color:var(--cs4-ff-accent)}
.takeover .result{background:var(--cs4-ff-bg);padding:12px}.takeover .awakening-dismiss{font-size:1em;flex:none;padding:6px 14px 14px;background:var(--cs4-ff-bg);border-top:1px solid var(--cs4-ff-edge)}
.takeover[data-motion=reduce] .awakening-art{height:100px;min-height:70px}.takeover[data-motion=reduce]{--cs4-ff-glow:none;background-image:none;clip-path:none}
.takeover[data-motion=reduce]:after{display:none}.foreign[data-appearance=plain]{background-image:none!important;box-shadow:none!important;border:1px solid var(--cs4-ff-edge);clip-path:none;border-radius:0}
.foreign[data-appearance=plain] .ornament,.foreign[data-appearance=plain] .portrait,.foreign[data-appearance=plain] .ring-mark,.foreign[data-appearance=plain] .seal{display:none}
.foreign[data-appearance=plain]:before,.foreign[data-appearance=plain]:after{display:none}
.foreign[data-motion=reduce],.foreign[data-motion=static]{animation:none;transition:none}.foreign *{animation:none!important;transition:none!important}
'''
PORTRAIT='''<svg class="portrait" viewBox="0 0 120 190" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round"><path stroke-width="2" d="M29 75Q13 48 38 23Q58 4 83 22Q109 41 90 74M28 47Q12 29 31 20M89 39Q110 49 96 91M37 58Q43 52 53 57M66 57Q76 50 85 58M41 65l9 0M70 65l8 -1M59 61l-5 21 10 1M39 86Q58 99 82 86M36 74Q22 112 49 156Q48 120 59 107Q71 128 69 174Q93 137 88 78"/><path d="M42 92Q28 114 42 135M72 97Q85 117 77 142M30 87Q10 116 7 151M91 92Q111 119 116 159M45 30Q57 21 74 33M35 39Q58 30 83 42"/><path opacity=".35" d="M3 175Q60 138 117 182M13 188Q62 157 100 188"/></g></svg>'''
RING='''<svg class="ring-mark" viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor"><ellipse cx="50" cy="61" rx="33" ry="22" stroke-width="8"/><ellipse cx="50" cy="61" rx="33" ry="22" stroke-width="1"/><path d="M36 35l7 -12h14l8 12 -14 14Z" stroke-width="3"/><path d="M50 15Q23 2 40 -22M57 17Q81 -8 60 -29" opacity=".4"/></g></svg>'''
ORBIT='''<svg class="ornament" viewBox="0 0 500 300" preserveAspectRatio="xMaxYMin slice" aria-hidden="true"><g fill="none" stroke="currentColor" opacity=".12"><circle cx="440" cy="50" r="90"/><circle cx="440" cy="50" r="67"/><path d="M330 50h170M440 0v150M386 0l108 108M380 110L490 0"/></g></svg>'''
AWAKEN='''<svg class="awakening-art" viewBox="0 0 400 180" aria-hidden="true"><g fill="none" stroke="currentColor"><path stroke-width="2" d="M125 45h150v90H125Z M135 35h130M135 145h130M115 55v70M285 55v70"/><path opacity=".7" d="M145 62h110M145 82h72M145 102h95M145 122h45M35 90h65M300 90h65M200 0v20M200 160v20"/><path d="M55 60l30 -15M55 120l30 15M345 60l-30 -15M345 120l-30 15"/><circle cx="200" cy="90" r="84" opacity=".35"/><circle cx="200" cy="90" r="73" opacity=".2"/></g></svg>'''

def ctrl(label, selected=False):
 return f'<span class="foreign-control {"selected" if selected else ""}" role="img" aria-label="Static control illustration: {html.escape(label)}">{html.escape(label)}</span>'
def ornaments(f):
 return PORTRAIT+RING if f=='ring' else ORBIT if f=='sage' else '<span class="seal" aria-hidden="true">◇</span>' if f=='jade' else ''
def facts(f):
 rows=[('Subject','Ash wood shield'),('Quality','80% · known'),('Grip correction','Learned'),('Live assistance','Unavailable here')]
 if f=='system': rows=[('['+a.upper()+']','[ '+b+' ]') for a,b in rows]
 return '<div class="facts">'+''.join(f'<div class="fact"><span>{a}</span><span>{b}</span></div>' for a,b in rows)+'</div>'
def content(f,surface):
 d=FAMILIES[f]; o=ornaments(f)
 title=f'<div class="kicker">{d["title"]} · known source</div>'
 q=f'<p class="quote">{d["quote"]}</p>'
 detail=f'<p class="detail">{d["detail"]}</p>'
 if surface=='center':
  extra=''
  if f=='book':extra='<span class="red-note">Correction: yield at the wrist.</span>'
  if f=='simulator':extra='<div class="branches"><div class="branch faded">A · rigid grip<strong>Impact catches</strong></div><div class="branch">B · yielding grip<strong>Impact glances</strong></div></div>'
  return o+'<div class="reading">'+title+f'<h1>{d["route"]}</h1>'+q+detail+extra+facts(f)+'<p class="source-note">Recorded instruction. No equipment change.</p><div class="route-hint">Scroll for the full record ↕</div></div>'
 if surface=='popup':
  return o+title+q+'<p class="detail">Grip correction · learned</p>'+ctrl(d['route']+' ›')
 short={'system':'Grip correction acquired.','sage':'“Let the rim turn the blow.”','ring':'“Turn your wrist, youngster.”','jade':'The yielding rim','book':'An error in the grip.','simulator':'A better branch is visible.'}[f]
 return o+f'<div class="kicker">{d["title"]}</div><p class="quote">{short}</p><p class="detail">Grip correction learned.</p>'+ctrl(d['route']+' ›')
def geometry(size,width):
 if width==1920:return dict(vw=1920,vh=1080,tx=525,ty=455,tw=871,th=577,fx=651,fw=745,px=668,py=90,pw=700,lx=1414,ly=175,lw=477)
 return dict(vw=1366,vh=768,tx=371,ty=414 if size==21 else 336,tw=580,th=306 if size==21 else 384,fx=489,fw=462,px=500,py=86,pw=440,lx=968,ly=205 if size==21 else 151,lw=375)
def frame(size,width):
 return BASE/f'evidence/r14/after/nav-{width}-{size}/00-home.png'
def render(f,surface,size=14,width=1366,motion='static',appearance='authored'):
 d=FAMILIES[f];g=geometry(size,width);fp=frame(size,width)
 style=';'.join(f'--{k}:{v}px' for k,v in g.items())+f';--size:{size}px'
 # Shared CS4 task frame: current shell remains a pixel underlay, only host content is mocked.
 local='<div class="local-action">Move somewhere else</div><div class="local-action">Try to craft something</div><div class="local-action">Talk to someone</div>'
 task=cs4.task(local)
 front=''
 if surface=='center':task=cs4.task(cs4.foreign(f,content(f,surface),'center-view',appearance,size,motion),True)
 elif surface=='notice':front='<aside class="notice-host">'+cs4.foreign(f,content(f,surface),'notice',appearance,size,motion)+'</aside>'
 elif surface=='popup':
  front='<aside class="popup-host"><section class="world-section"><strong>Ash wood shield</strong><p>Off-hand · Quality 80%</p><p>World record · inspected freely</p></section>'+cs4.foreign(f,content(f,surface),'popup-section',appearance,size,motion)+'<div class="popup-caption"><span>Pin inspection</span><span>Close · Esc</span></div></aside>'
 else:
  reduce=motion=='reduce'
  inner='<div class="reading"><div><div class="kicker">'+('STATUS INTERFACE · awakened' if reduce else 'CONNECTION ESTABLISHED · 01')+'</div><h1>You can see<br>the shape<br>of your power.</h1></div>'+AWAKEN+'<div class="result"><h2>Status interface awakened.</h2><p>Your own status is now readable.</p><p class="muted">No choice has been made for you.</p></div><div class="awakening-dismiss">'+ctrl('Continue to status ›',True)+ctrl('Dismiss · Esc')+'</div></div>'
  inner=inner.replace('<div class="awakening-dismiss">','</div><div class="awakening-dismiss">').removesuffix('</div>')
  front=cs4.foreign(f,inner,'takeover',appearance,size,motion)
 mirror='<div class="log-mirror"><span class="source">'+(d['route']+':' if surface!='awakening' else 'Status interface:')+'</span> '+('Grip correction learned.' if surface!='awakening' else 'Awakened. Your status is readable.')+'<span class="open">Open current '+('record' if surface!='awakening' else 'status')+' ›</span></div>'
 footer='<footer class="footer-reconstruction"><div><span>Save</span><span>Export</span><span>Import</span><span>Settings</span><span>Help</span></div><div><span>Authoring</span><span>Layout ▾</span><span>Comfortable</span></div><div class="provenance">CY static footer reconstruction · source has no hit counter</div></footer>'
 name=f'{f}-{surface}-{width}-{size}'+('-reduce' if motion=='reduce' else '')+('-plain' if appearance=='plain' else '')
 document=f'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width={width},initial-scale=1"><title>CY static proposal · {d["label"]} · {surface}</title><link rel="stylesheet" href="mockups.css"><body class="{"expanded-center" if (surface=="center" and size==21 and width==1366) or surface=="awakening" else ""}" style="{style}"><img class="frame" src="{os.path.relpath(fp,HERE)}" alt="Preserved R14 shell pixels; static footer and contribution replacements"><main aria-label="Static design proposal; synthetic facts; no live controls">{task}{front}{mirror}<div class="stamp">CY · STATIC PROPOSAL · {f} / {surface} · {size}px'+(' · reduced-motion final form' if motion=='reduce' else '')+f'</div></main>{footer}</body></html>'
 (HERE/f'{name}.html').write_text(document+'\n')
 behavior=dict(owner='SF120 shared popup owner' if surface=='popup' else 'SF123 notice/log owner' if surface=='notice' else 'SF122 shared center controller',home=d['route'],dismiss='Esc closes top transient first; center Back returns to Village; awakening explicit Continue/Dismiss',focus='Keyboard entry; return to opener or containing known header',pendingClick='Reserve notice region; queue until no pending target can be moved or covered',mirror='One plain event line on discovery; inspection never logs again; Open current record is distinct from historical preview',contrast='Opaque own reading base; measured authored role pairs in receipt',appearance='Explicit L7 font/size/palette wins; authored/quiet/plain; OS/game motion ceiling',motion=('Immediate full static content; no reveal, pulse, fade, timeout or chime' if motion=='reduce' else 'Static export; proposed cosmetic reveal only, final text and controls immediately available'),secrecy='Synthetic disclosed fixture only; register no hidden family labels or fonts before discovery',lifecycle='Do not replay on hover, tick, Back, reload, import or world change',verification='Static layout only. No keyboard, focus, command, pointer or persistence behavior implemented.')
 return dict(id=name,family=f,surface=surface,size=size,viewport=[width,g['vh']],motion=motion,appearance=appearance,html=name+'.html',png=name+'.png',frame=str(fp.relative_to(BASE)),frameSha256=hashlib.sha256(fp.read_bytes()).hexdigest(),behavior=behavior)
if __name__=='__main__':
 (HERE/'mockups.css').write_text(CSS)
 scenes=[render(f,s,size) for f in FAMILIES for s in ['popup','notice','center'] for size in [14,21]]
 scenes += [render('system','awakening',size,motion=m) for size in [14,21] for m in ['static','reduce']]
 scenes += [render(f,'center',21,1920) for f in FAMILIES]
 scenes += [render('system','center',21,appearance='plain')]
 sources=[dict(path=str(OLD.relative_to(BASE)),sha256=hashlib.sha256(OLD.read_bytes()).hexdigest(),use='Imported CSS, task() and foreign(); extended only in CY scratch'),dict(path='next-parts/scratch/surfaces/cs4/render_mockups.cjs',sha256=hashlib.sha256((OLD.parent/'render_mockups.cjs').read_bytes()).hexdigest(),use='Adapted isolated headless renderer and geometry/contrast receipt')]
 (HERE/'scenes.json').write_text(json.dumps(dict(scope='Static HTML composites only; fixture facts; no game build or scripts',sources=sources,footer='R14 frames still contain dummy counter; static footer reconstructed from current index.html:701-713 and shell controls; not a newer capture',scenes=scenes),indent=2)+'\n')
 cards=''
 for f,d in FAMILIES.items():
  cards+=f'<section id="{f}"><h2>{d["label"]}</h2><p>{d["quote"]}</p><div class="cards">'
  for s in [r for r in scenes if r['family']==f]:
   cards+=f'<article><h3>{s["surface"]} · {s["size"]}px · {s["viewport"][0]}'+(' · reduced motion' if s['motion']=='reduce' else '')+(' · Appearance plain' if s['appearance']=='plain' else '')+f'</h3><a href="{s["html"]}">Open HTML</a> · <a href="{s["png"]}">Original PNG</a><a href="{s["png"]}"><img loading="lazy" src="{s["png"]}" alt="{s["id"]}"></a><details><summary>CS2 behavior notes · proposed, untested</summary><dl>'+''.join(f'<dt>{html.escape(k)}</dt><dd>{html.escape(v)}</dd>' for k,v in s['behavior'].items())+'</dl></details></article>'
  cards+='</div></section>'
 (HERE/'index.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><title>CY · Foreign voices, one shell</title><style>html{scroll-behavior:auto}body{background:#10131d;color:#edeff5;font:16px/1.5 system-ui;margin:30px}h1{font:48px Georgia,serif;margin-bottom:10px}h2{font:32px Georgia,serif}h3{font-size:17px}a{color:#b7e8ff}nav{display:flex;flex-wrap:wrap;gap:18px;position:sticky;top:0;background:#10131d;padding:14px 0;z-index:2}.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}article{border:1px solid #667080;padding:14px;background:#191e2b}article img{width:100%;display:block;margin:12px 0}p{max-width:1100px}dt{font-weight:bold;margin-top:8px}dd{margin:3px 0 0}section{scroll-margin-top:65px}</style><h1>Foreign voices, one shell.</h1><p>CY · Six genre-inspired cheat families. Static visual proposals with original CSS/SVG ornaments, synthetic facts and no game commands. Each family has popup section, notice and center at real 14px and 21px over matching R14 shell pixels, plus a 1920×1080 center at 21px. The system family includes an awakening beat and an immediately readable reduced-motion form. Appearance plain is illustrated once.</p><p>The old counter is absent from current source. The inspected R14 shell images still contain it, so these composites replace the footer with a labelled static reconstruction. They are not fresh game captures. Motion choreography is described in the report, never played in these static exports.</p><p><a href="../../cheat-style.md">Lane report</a> · <a href="scenes.json">Per-mockup CS2 notes</a> · <a href="render-receipt.json">Render receipt</a> · <a href="contact-sheet.png">Contact sheet</a></p><nav>'''+''.join(f'<a href="#{f}">{d["label"]}</a>' for f,d in FAMILIES.items())+'</nav>'+cards+'</html>\n')
 print(f'Wrote {len(scenes)} static HTML scenes; six families, 14/21px, wide center variants.')
