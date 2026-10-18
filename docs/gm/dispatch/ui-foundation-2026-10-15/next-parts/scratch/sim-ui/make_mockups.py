"""SI static proposals. Imports CY tokens, frame lookup and CS4 foreign helper read-only."""
from pathlib import Path
import importlib.util
import html
import json
import hashlib
import os
import sys

sys.dont_write_bytecode = True

HERE = Path(__file__).resolve().parent
CY_PATH = HERE.parent / 'cheat-style/make_mockups.py'
spec = importlib.util.spec_from_file_location('cy', CY_PATH)
cy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cy)
E = html.escape
# Round 14: identity, never destination-world skin. Existing helpers are reused read-only.
cy.FAMILIES['simulator'].update(title='RING AI · PREDICTION ARRAY', label='Ring × AI × predict/simulate')
cy.FAMILIES['jade'].update(title='LIFE SIMULATOR · INHERITED SLIP', label='Jade slip × impersonal system × simulate/settle')
cy.FAMILIES['inkdream']=dict(cy.FAMILIES['book'],title='DREAM OF THE MILLET',label='Pillow × dream faculty × compressed life')
cy.FAMILIES['divination']=dict(cy.FAMILIES['sage'],title='THE SIX-LINE READING',label='Casting board × oracle × divine')
cy.FAMILIES['return-memory']=dict(cy.FAMILIES['ring'],title='WHAT CAME BACK',label='Personal memory × returning self × rewind')

CSS = cy.CSS + '''
/* SI: static content adapters only. No game or controller code. */
.si-host{position:absolute;left:var(--sx);top:48px;width:var(--sw);height:calc(var(--vh) - 100px);z-index:3;display:flex;flex-direction:column;background:#062846;border:1px solid #8dabbc}
.si-shell-head,.si-back{background:#071b38;color:#e3f4f7;padding:9px 12px;font:var(--size)/1.35 Arial,sans-serif;flex:none}
.si-back{border-top:1px solid #8dabbc;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
.si-host .foreign{flex:1;min-height:0;display:flex;flex-direction:column;padding:14px 16px;clip-path:none}
.si-host .foreign h1{font-size:1.35em;margin:4px 0 10px;line-height:1.2}
.si-host .foreign h2{font-size:1.05em;margin:12px 0 7px}
.si-head,.si-actions{flex:none}.si-host .foreign .si-head{display:block;border-bottom:1px solid var(--cs4-ff-edge);padding-bottom:10px}
.si-host .si-body{overflow:auto;scrollbar-gutter:stable;min-height:0;flex:1;padding:8px 2px}
.si-actions{border-top:1px solid var(--cs4-ff-edge);padding-top:8px;display:flex;gap:8px;flex-wrap:wrap;background:var(--cs4-ff-bg)}
.si-actions .foreign-control{margin:0;padding:7px 9px;display:inline-block}
.si-host .foreign p{margin:7px 0}.si-host .kicker{letter-spacing:0;font-size:1em}
.si-status{display:block;font-weight:700;color:var(--cs4-ff-accent);font-size:1em}
.si-note{color:var(--cs4-ff-muted)}.si-pair{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px}
.si-card{padding:10px;border:1px solid var(--cs4-ff-edge);background:var(--cs4-ff-bg);min-width:0;overflow-wrap:break-word}
.si-card h2{margin-top:0!important}.si-choice{display:block;border:1px dashed var(--cs4-ff-edge);padding:10px;margin:8px 0}
.si-row{display:flex;justify-content:space-between;gap:12px;padding:7px 0;border-bottom:1px solid var(--cs4-ff-edge);font-variant-numeric:tabular-nums}
.si-row span:last-child{text-align:right}.si-row span{min-width:0;overflow-wrap:break-word}
.si-pair .si-row{display:block}.si-pair .si-row span{display:block;text-align:left!important}
.si-beat{padding:10px 0 10px 14px;border-left:3px solid var(--cs4-ff-accent);margin:8px 0;background:var(--cs4-ff-bg)}
.si-fog{border-left-style:dashed;color:var(--cs4-ff-muted)}.si-shift{border:2px solid var(--cs4-ff-accent);padding:10px;background:var(--cs4-ff-bg)}
.si-dist{height:20px;display:flex;gap:3px;margin:12px 0}.si-dist i{display:block;flex:1;background:var(--cs4-ff-accent)}.si-dist i:nth-child(n+5){background:var(--cs4-ff-muted)}
.si-log{background:#24153b;color:#f1eaf6;padding:10px;line-height:1.5}.si-log p{margin:4px 0!important}.si-ally{color:#8fe8ff}.si-hostile{color:#ffc2c6}.si-value{color:#f5df9b}.si-log .si-note{color:#d5c9df}
.si-board .si-card{border-top:3px solid var(--cs4-ff-edge)}.si-board .defeated{border-top-style:dashed}
.si-strip{top:414px;height:306px}.si-strip .foreign{padding:10px 12px}.si-strip .si-head{padding-bottom:4px}.si-strip .si-head h1{font-size:1em;margin:0 0 4px}
.si-strip .si-shell-head{display:none}.si-strip .si-back{padding:5px 10px}.si-strip .si-actions{padding-top:4px}.si-strip .si-actions .foreign-control{padding:4px 8px}
.si-strip .si-body{padding-top:0}.si-strip .si-beat{margin:4px 0;padding:6px 10px}
.si-strip .si-head .kicker{display:none}.si-strip .si-status{font-weight:400}
.si-scroll-hint{color:var(--cs4-ff-muted);font-size:1em}
.si-report-note{position:absolute;left:var(--lx);top:var(--ly);width:var(--lw);padding:10px;background:#24153b;color:#f1eaf6;font:var(--size)/1.4 Arial,sans-serif;z-index:2}
.si-stamp{position:absolute;left:10px;top:30px;color:#fff;background:#10131d;padding:2px 6px;font:10px Arial;z-index:8}
.si-footer{position:absolute;left:0;right:0;bottom:0;height:42px;background:#19274f;color:#edf4ff;display:flex;align-items:center;justify-content:space-between;padding:0 12px;font:14px Arial;z-index:8}
.si-host .foreign[data-style=jade] .si-status{font-family:inherit}.si-host .foreign[data-style=jade]{border-width:5px}
.si-host .foreign[data-style=jade] h1{padding-right:0}
.si-cost{border-top:1px solid var(--cs4-ff-edge);margin-top:12px;padding-top:8px}
.si-identity{width:100%;height:54px;color:var(--cs4-ff-accent);margin:5px 0;display:block}
.si-host .foreign[data-style=inkdream]{background:#e6d3aa;color:#332719;border:8px double #6a4229;border-radius:3px 14px 3px 14px}
.si-host .foreign[data-style=divination]{border:2px solid #c3aecf;background:radial-gradient(ellipse at top,#463755,#161423 80%)}
.si-host .foreign[data-style=return-memory]{border:0;border-top:3px solid #bba576;background:#191d20}
.si-host .foreign[data-style=return-memory] .si-card{border-style:dashed}
.si-carried{border:2px double var(--cs4-ff-accent);padding:5px 8px;display:inline-block}
/* Prefer the subject and comparison to repeated chrome at actual 21px. */
.si-shell-head{display:none}.si-host .foreign h1{font-size:1.1em;margin:4px 0 6px}
.si-host .foreign .si-head{padding-bottom:7px}.si-host .kicker{margin:0 0 4px}
.si-identity{height:28px;margin:2px 0}.si-status{font-weight:400}
.si-actions{align-items:center}.si-scroll-hint{display:block}
.si-strip .si-body .si-beat:first-child{margin-top:0}
.si-reserve{position:absolute;left:var(--tx);top:var(--ty);width:calc(var(--sx) - var(--tx));height:var(--th);background:#062846;border:1px solid #8dabbc;z-index:2}
'''

def p(s, cls=''):
    return f'<p class="{cls}">{s}</p>'

def row(a, b):
    return f'<div class="si-row"><span>{a}</span><span>{b}</span></div>'

def beat(t, s, fog=False):
    return f'<div class="si-beat {"si-fog" if fog else ""}"><strong>{t}</strong><br>{s}</div>'

def card(title, content, cls=''):
    return f'<section class="si-card {cls}"><h2>{title}</h2>{content}</section>'

def pair(a, b, cls=''):
    return f'<div class="si-pair {cls}">{a}{b}</div>'

MODES = {
 'dream':('Dream run · at a fork', 'DREAM BRANCH · not your live life', 'Decision 2 of 3 · Year 4',
    p('Your teacher offers a winter apprenticeship.') + p('Intent: study; avoid debt.', 'si-note') +
    '<div class="si-choice"><strong>A · Accept</strong><br>In this dream: 40 coins, one winter away.</div><div class="si-choice"><strong>B · Stay home</strong><br>In this dream: keep work and household ties.</div>' +
    beat('Year 4 · claimed confidence: fair', 'A place is offered. The long-term result is unclear.') +
    p('Earlier dream: Year 1, hired as a helper. Year 3, met the teacher.', 'si-note'),
    ['Choose A in dream', 'Choose B in dream', 'End dream']),
 'headless':('Headless run · working', 'DREAM BRANCH · live intent unchanged', '12 of 20 seasons processed',
    p('This run follows: study, accept apprenticeships, avoid debt.') + row('Dream horizon','5 years') + row('Current beat','Year 3 · winter') +
    beat('Run log', 'Two seasons of study; one offer declined by your saved run intent.') +
    p('You can leave this view. Completion goes to this run record.', 'si-note') +
    p('Partial reading only. Unvisited years are not failures.', 'si-note'),
    ['Leave view · keep running', 'Cancel run']),
 'spread':('Spread · ten possible lives', 'PREVIEW REPORT · no life was applied', '10 of 10 complete · same start and intent',
    '<div class="si-dist" aria-hidden="true">'+('<i></i>'*10)+'</div>' +
    row('Died before 30', '4 of 10 runs') + row('Lived to 30', '6 of 10 runs') +
    p('A small sample of possible lives, not your personal fate.', 'si-note') +
    beat('Sample 04 · survived', 'Year 4: stayed home. Year 9: became a craft teacher.') +
    p('Source claims fair confidence near home; distant years remain vague.', 'si-note'),
    ['Open sample 04', 'View assumptions']),
 'probe':('Probe · stay or apprentice', 'A / B PREVIEW · neither choice is live', 'Both branches start at the same known decision',
    '<div class="si-shift">First split: accepting the winter offer.</div>' +
    pair(card('A · Accept', beat('Winter','40 coins spent in branch A.') + beat('Spring','Apprentice work begins. Claimed confidence: fair.')),
         card('B · Stay', beat('Winter','Local wages continue in branch B.') + beat('Spring','Household work grows. Claimed confidence: fair.'))) +
    p('Same six-month horizon. Unknown influences remain unknown in both branches.', 'si-note'),
    ['Branch A details', 'Branch B details']),
 'forecast':('Forecast · current path', 'READING · your world continues separately', 'Passive path · from Day 8',
    beat('Day 9 · claimed confidence: high','Market opening expected.') +
    '<div class="si-shift">The branch shifted · Day 8<br>You changed your work intent. Later beats are an old reading.</div>' +
    beat('Day 12 · fog','Beyond the reader\'s clear reach.',True) +
    p('Old reading retained. Opening it spends nothing; another reading may have a cost.', 'si-note'),
    ['Open full reading']),
 'rehearsal':('Rehearsal · sample 03', 'REHEARSAL · no wounds or loot applied', 'Estimate · 6 wins in 10 rehearsals',
    pair(card('You · simulated', row('HP', '18 / 30') + row('Stance','Guarded')),
         card('Wolf rat A', row('HP','???') + row('Attack','Observed: light')),'si-board') +
    '<h2>Sample replay · paused at exchange 4</h2><div class="si-log"><p><span class="si-ally">You</span> → <span class="si-hostile">Wolf rat A</span>: <span class="si-value">3 dealt</span></p><p><span class="si-hostile">Wolf rat A</span> → <span class="si-ally">You</span>: <span class="si-value">2 taken</span></p><p class="si-note">Wolf rat A missed ×2 · expand occurrences</p></div>' +
    p('Replay reads this sample. It does not start a new run or a real fight.', 'si-note') +
    p('Fight results are estimates within their coverage. No guarantee of the live result.', 'si-note'),
    ['Replay 03', 'Assumptions']),
 'shadow':('Shadow · a generated self', 'SHADOW DEMONSTRATION · not your body', 'Sample self · dream 04 · recorded equipment',
    pair(card('Start snapshot', row('HP','30 / 30') + row('Strength','10') + row('Off-hand','Ash shield')),
         card('Shadow · modeled',row('HP','30 / 30') + row('Strength','12 · simulated') + row('Off-hand','Recorded shield')),'si-board') +
    p('These are two recorded identities from dream 04. The shadow\'s gear and effects do not equip on you.') +
    beat('Demonstration', 'The shadow braces before striking. Read the sample log below.') +
    p('Only known or legitimately perceived shadow facts appear. No hidden loadout is inferred.', 'si-note'),
    ['Replay demonstration', 'Inspect shadow']),
 'dream-setup':('Dream run · before entry', 'SETUP · no run started', 'Synthetic comparison fixture · terms vary by cheat',
    row('Start','You · now') + row('Horizon','One year') + row('Stops','Three important forks') + row('Intent','Study; avoid debt') +
    '<h2>What can come home</h2>' + p('This fixture permits one observation step. It still needs real practice.') +
    '<div class="si-cost">Fixture quote: 1 charge at entry. End early: charge spent; no keep. Refill: one home season.</div>' +
    p('These terms illustrate one authored cheat, not a universal cost rule.', 'si-note'),
    ['Enter dream · spend 1 charge', 'Edit run intent']),
 'dream-settle':('Dream run · after waking', 'SETTLEMENT · dream ended; keep not claimed', 'One year read · report complete',
    p('You spent the winter studying and returned home in spring.') +
    beat('Turning point · Year 1','You declined the paid apprenticeship.') +
    p('Claimed confidence: fair near home. The distant outcome remained uncertain.', 'si-note') +
    '<h2>One allowed keep</h2>' + card('Shield handling · observation',p('Observed steps only. Not mastery, equipment or the whole simulated self.')) +
    p('Claiming crosses into your real life through this cheat\'s carry rule. No claim has happened.', 'si-note') +
    row('Cost receipt','1 charge spent at entry'),
    ['Claim observation · real life', 'Leave unclaimed']),
}

GRADES = {
 'guess':('Guess', 'One possible path', 'A plausible year based on what you know. Shape and outcome may both be wrong.', 'Fresh possibility; no matching-path promise.', beat('Winter · claimed confidence: fair','A teaching offer may arrive.')),
 'forecast-grade':('Forecast grade', 'A set of possible paths', 'Many futures from the same start, not the passive-world mode by itself.', 'Ten samples in this fixture; all incomplete runs would be listed separately.', row('Offer received','4 of 10 readings')),
 'projection':('Projection', 'If you keep this path', 'Current commitments and known facts, with a matching-path reading where covered.', 'This reading can be wrong wherever its knowledge is wrong.', beat('Day 9 · claimed confidence: high','The market is expected to open.') + beat('Beyond Day 12 · fog','Reach becomes unclear.',True)),
 'true-sight':('True sight · source claim', 'As far as the reader sees', 'A stronger reading can reveal an event at your discovery stage. Its cause need not be known.', 'The name certifies neither honesty nor immunity to concealment.', beat('Nightfall · sensed','An unexplained interruption is seen. Cause unknown.')),
 'prophecy':('Prophecy', 'A fixed point, conditionally', 'A fated event is shown as a fixed-point knot. Disturbance can still change it.', 'Resistance appears only as the owner allows; no invented fate percentage.', beat('Winter · fixed point','The festival recurs. Resistance: not assessed.')),
 'vision':('Vision', 'A fragment, not a full route', 'A bell. Wet stone. A feeling of urgency.', 'No exact day or causal chain was supplied. Gaps are not evidence of a hidden event.', beat('Time unknown · fragment','Image and feeling only.',True)),
 'counterfactual':('Counterfactual', 'The road not taken', 'This reading begins at an earlier choice. It does not rewind your live life.', 'Local time law not established: the reading makes no claim that a sibling world exists.', pair(card('Recorded choice','Stayed home.'),card('Imagined alternative','Accepted the offer.'))),
 'oracle':('Oracle reading', 'A confident statement', '“The road will remain safe through winter.”', 'Source: the oracle. Claimed confidence: certain. No independent outcome yet.', beat('Winter · source claims certainty','Safe passage is promised.')),
}

TYPE_SCENES={
 'millet-dream':('inkdream', 'A life in one sleep', 'DREAM LIFE · not the waking world',
    '<svg class="si-identity" viewBox="0 0 440 54" aria-hidden="true"><path d="M8 6Q30 27 8 48H410Q432 27 410 6ZM30 6V48M390 6V48" fill="none" stroke="currentColor" stroke-width="3"/></svg>' +
    beat('Childhood','The ink begins at the village gate.') + beat('Middle years','Work, a household, an invitation.') + beat('A late winter','The brush lifts; the next fork waits.') +
    p('In the dream: a lifetime. At home: one sleep.','si-note'),['Choose within dream','Wake early']),
 'divination-type':('divination','A cast, not a computed itinerary','ORACLE READING · source claim',
    '<svg class="si-identity" viewBox="0 0 440 54" aria-hidden="true"><g stroke="currentColor" stroke-width="4"><path d="M150 3H290M150 12H208M232 12H290M150 21H290M150 30H208M232 30H290M150 39H290M150 48H208M232 48H290"/></g></svg>' +
    p('“A threshold waits; the traveller returns.”') + p('Time unclear. Cause unclear. The oracle sounds certain.','si-note'),['Inspect this cast','Leave reading']),
 'return-memory-type':('return-memory','After returning','RETURNED MEMORY · lived before the rewind',
    p('No preview was offered. This is what you remember after returning.') +
    pair(card('Before return',row('Body','Wounded')+row('Shield','Broken')),card('Now',row('Body','Restored by this loop')+row('Shield','Earlier state'))) +
    '<h2>What survived · fixture carry contract</h2><p><span class="si-carried">Carried · remembered shield timing</span></p>'+p('Shield and wounds did not carry in this fixture. Other loops can differ.','si-note')+
    p('The remembered timing is yours. You can practise it in this life.','si-note'),['Inspect carried memory','Return to current life']),
}

def identity_art(family):
    if family=='simulator':
        return '<svg class="si-identity" viewBox="0 0 440 54" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="35" cy="40" rx="22" ry="8"/><path d="M18 28L35 3L52 28ZM64 28H155L195 8H300M155 28L195 48H300" stroke-dasharray="4 3"/><circle cx="310" cy="8" r="5"/><circle cx="310" cy="48" r="5"/></g></svg>'
    if family=='jade':
        return '<svg class="si-identity" viewBox="0 0 440 54" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="10" y="4" width="420" height="46" rx="8"/><path d="M30 16H155M30 27H270M30 38H210M340 12V42M350 12V42M360 12V42M370 12V42"/></g></svg>'
    return ''

def make_scene(key, family, size, width=1366, grade=False, type_scene=False):
    g = cy.geometry(size, width)
    fp = cy.frame(size, width)
    strip = key == 'forecast'
    if type_scene:
        family,title,status,body,actions=TYPE_SCENES[key]
        heading={'millet-dream':'One sleep · one dreamed life','divination-type':'Invocation complete','return-memory-type':'From your last life'}[key]
    elif grade:
        title, sub, desc, note, extra = GRADES[key]
        status='READING · no live action taken'
        heading=f'{title} · {sub}'
        body=p(desc)+extra+p(note,'si-note')+p('Inspect the attributed reading. A new read has its own quote; this view does not spend it.','si-note')
        actions=['Inspect reading source', 'View reading terms']
    else:
        title, status, heading, body, actions=MODES[key]
    caption={'simulator':'AI · ring projection','jade':'Life system · jade slip'}.get(family,cy.FAMILIES[family]['title'])
    if not grade and not type_scene:
        status={
            'dream':'DREAM · not live life', 'headless':'RUNNING · live intent unchanged',
            'spread':'PREVIEW · no life applied', 'probe':'A/B PREVIEW · neither is live',
            'rehearsal':'REHEARSAL · no live wounds', 'shadow':'GENERATED SELF · not your body',
            'dream-setup':'SETUP · no run started', 'dream-settle':'SETTLEMENT · keep unclaimed',
        }.get(key,status)
        if key=='probe': heading='Shared start · six-month horizon'
        if key=='shadow': heading='Dream 04 · recorded self'
        if key=='rehearsal': body=body.replace('Observed: light','Light · simulated').replace('Replay reads this sample.', 'Simulated observation · sample 03. Real fights may correct it. Replay reads this sample.')
    if strip:
        title='Forecast strip'
        status='OLD READING · branch shifted'
        body=beat('Day 9 · old beat','Market opening expected.')+'<div class="si-shift">Day 8 · your intent changed.</div>'+beat('Day 12 · fog','Beyond clear reach.',True)
    header=f'<header class="si-head"><div class="kicker">{E(caption)}</div><h1>{E(title)}</h1><span class="si-status">{E(status)}</span></header>'
    # Body, graph and typography may communicate visually. Round 14 mandates no text equivalent.
    lead=(identity_art(family)+f'<p class="si-note">{E(heading)}</p>') if not strip else ''
    body=f'<div class="si-body">{lead}{body}</div>'
    controls='<div class="si-actions">'+''.join(f'<span class="foreign-control">{E(a)}</span>' for a in actions)+'<span class="si-scroll-hint">Record ↕</span></div>'
    foreign=cy.cs4.foreign(family,header+body+controls,'si-content',size=size,motion='reduce')
    home='Village' if key!='rehearsal' else 'Combat inspection'
    reserve='' if strip else '<div class="si-reserve" aria-hidden="true"></div>'
    host=reserve+f'<main class="si-host {"si-strip" if strip else ""}"><div class="si-shell-head">Simulator / {E(title)}</div>{foreign}<footer class="si-back"><span>← {home}</span><span>Back / Esc · leave view</span></footer></main>'
    if key=='dream': log='Simulator opened. Choices shown in its own dream record.'
    elif key=='forecast': log='Foresight: the branch shifted at Day 8. Open reading ›'
    else: log='Simulator inspected. Read its own record ›'
    # This AI fixture is quiet. The life-system fixture elects a lifecycle receipt.
    mirror=f'<aside class="si-report-note">{E(log)}</aside>' if family=='jade' else ''
    footer='<footer class="si-footer"><span>Save · Export · Import · Settings · Help</span><span>SI static footer reconstruction · R14 shell pixels</span></footer>'
    name=f'{"grade-" if grade else ""}{key}-{family}-{width}-{size}'
    style=';'.join(f'--{k}:{v}px' for k,v in g.items())+f';--size:{size}px;--sx:{g["tx"] if strip else g["fx"]}px;--sw:{g["tw"] if strip else g["fw"]}px'
    document=f'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width={width},initial-scale=1"><title>SI static · {E(title)}</title><link rel="stylesheet" href="mockups.css"><body style="{style}"><img class="frame" src="{os.path.relpath(fp,HERE)}" alt="Preserved R14 shell pixels; center contribution and footer reconstructed">{host}{mirror}<div class="si-stamp">SI · STATIC PROPOSAL · {E(key)} / {family} · {size}px</div>{footer}</body></html>\n'
    (HERE/(name+'.html')).write_text(document)
    return dict(id=name,key=key,family=family,identity=cy.FAMILIES[family]['label'],size=size,viewport=[width,g['vh']],surface='strip' if strip else 'center',grade=grade,typeScene=type_scene,html=name+'.html',png=name+'.png',frame=str(fp.relative_to(cy.BASE)),frameSha256=hashlib.sha256(fp.read_bytes()).hexdigest(),scope='Synthetic static representation, no mechanics, input handlers or storage',behavior=dict(entry='Discovered cheat canonical home; use shared host/controller',dismiss='Top transient first, then Back/Esc; leaving is separate from ending/cancelling',focus='Future slice must restore opener or safe known parent',log='Life system elects lifecycle receipt; AI/other fixtures are quiet. No universal text equivalent or mirror.',knowledge='Public projected fields only; claimed identity controls disguised looks; no grade or style certifies truth',cost='Owner quote before a new run; no universal charges, refund or pause policy',verification='Static geometry only; CS2 and simulator gameplay remain unimplemented'))

if __name__=='__main__':
    (HERE/'mockups.css').write_text(CSS)
    scenes=[make_scene(k,f,s) for k in MODES for f in ['simulator','jade'] for s in [14,21]]
    scenes += [make_scene(k,'simulator',s,grade=True) for k in GRADES for s in [14,21]]
    scenes += [make_scene('probe',f,21,1920) for f in ['simulator','jade']]
    scenes += [make_scene(k,v[0],s,type_scene=True) for k,v in TYPE_SCENES.items() for s in [14,21]]
    manifest=dict(scope='SI static proposals, synthetic fixtures, no game build, no saves',sources=[dict(path=str(CY_PATH.relative_to(cy.BASE)),sha256=hashlib.sha256(CY_PATH.read_bytes()).hexdigest(),use='Imported CSS, FAMILIES, frame/geometry and configured CS4 foreign helper; no producer scripts executed')],scenes=scenes)
    (HERE/'scenes.json').write_text(json.dumps(manifest,indent=2)+'\n')
    cards=''
    for grade, keys in [(False,MODES),(True,GRADES),(False,TYPE_SCENES)]:
        cards+=f'<h2>{"Simulator types (SD1)" if keys is TYPE_SCENES else "Foresight grades and attributed oracle" if grade else "Modes and dream lifecycle"}</h2>'
        for k in keys:
            cards+=f'<section id="{k}"><h3>{E(k)}</h3><div class="cards">'
            for s in scenes:
                if s['key']!=k or s['grade']!=grade: continue
                cards+=f'<article><strong>{E(s["identity"])} · {s["viewport"][0]} × {s["viewport"][1]} · {s["size"]}px</strong><p><a href="{s["html"]}">HTML at full size</a> · <a href="{s["png"]}">Original PNG</a></p><a href="{s["png"]}"><img loading="lazy" src="{s["png"]}" alt="{E(s["id"])}"></a><details><summary>Proposed behavior; not implemented</summary>'+''.join(f'<p><b>{E(a)}:</b> {E(b)}</p>' for a,b in s['behavior'].items())+'</details></article>'
            cards+='</div></section>'
    (HERE/'index.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><title>SI · Reading a possible life</title><style>body{background:#10131d;color:#f4f0ff;font:16px/1.5 system-ui;margin:30px}h1{font:44px Georgia}h2{margin-top:45px}a{color:#b7e8ff}.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}article{background:#191e2b;border:1px solid #6f7585;padding:14px}img{width:100%;display:block}p{max-width:1100px}</style><h1>Reading a possible life</h1><p>Round 14 identity correction applied. Seven modes and dream setup/settlement in two simulator types: ring × AI × simulate (holographic branch chart) and jade slip × impersonal life system × simulate/settle (life log and reward ledger). Neither is a world skin. Three further type examples show an ink-scroll dream, divination cast and memories after return by death. No universal text equivalent or log mirror is required. AI and other fixtures are quiet; the life system elects a receipt.</p><p>All modes have actual 14/21px at 1366×768. Seven foresight grades and an oracle have both sizes; two probe views add 1920×1080 at 21px. These composites reuse preserved R14 shell pixels. Center and footer are reconstructed. Controls are illustrations. No game modules, commands, live state, secrets, animation or storage are included. The oracle is deliberately not labelled a liar in the player-facing view.</p><p><a href="../../sim-ui.md">Lane plan</a> · <a href="scenes.json">Manifest</a> · <a href="render-receipt.json">Receipt</a> · <a href="contact-sheet-14.png">14px sheet</a> · <a href="contact-sheet-21.png">21px sheet</a></p>'+cards+'</html>\n')
    print(f'Wrote {len(scenes)} SI static scenes.')
