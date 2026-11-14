// Fight playthrough player (prototype, CBD279 to CBD287). Renders recorded frames
// on the proposed three-panel layout (CBD75). It decides nothing: every value
// comes from a frame written by record.mjs.
const {frames} = window.PLAYTHROUGH;
const $ = id => document.getElementById(id);
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const params = new URLSearchParams(location.search);
const DWELL = {open: 2600, run: 1500, pause: 6500, picked: 2600, result: 9000, card: 4200};
// A step list: a title card before each scene, then its frames.
const steps = [];
frames.forEach((f, i) => { if (i === 0 || frames[i - 1].scene !== f.scene || frames[i - 1].act !== f.act) steps.push({card: true, frame: i}); steps.push({card: false, frame: i}); });
let at = 0, playing = false, timer = null, shownReports = 0, lastScene = null;
const num = n => Number.isInteger(n) ? String(n) : (Math.round(n * 10) / 10).toFixed(1);
const secs = n => `${num(n)}s`;

function gaps(view, parts) { return view.missing.filter(m => parts.includes(m.part)).map(m => m.what).join('; '); }
function setMissing(id, view, parts) { const text = gaps(view, parts); $(id).querySelector('.missing').textContent = text ? `This engine leaves out: ${text}.` : ''; }

function drawYou(v) {
    const body = $('you').querySelector('.body'); body.replaceChildren();
    for (const m of v.you.means) {
        const row = el('div', 'mean'); row.append(el('span', null, m.label), el('span', null, m.max ? `${num(m.amount)} of ${num(m.max)}` : num(m.amount)));
        if (m.max) { const bar = el('div', 'bar'), fill = el('i'); fill.style.width = `${Math.max(0, Math.min(100, m.amount / m.max * 100))}%`; bar.append(fill); row.append(bar); }
        body.append(row);
    }
    if (v.you.held.length) body.append(el('p', 'sub', `Holding: ${v.you.held.map(h => h.slot).join(', ')}`));
    body.append(el('p', 'sub', v.you.wounds.length ? `Wounds: ${v.you.wounds.map(w => `${w.part} ${w.state}`).join(', ')}` : 'No wounds.'));
    if (v.you.doing) body.append(el('p', 'sub', `In the middle of: ${v.you.doing}`));
    setMissing('you', v, ['you']);
}
function drawPlace(v) {
    const body = $('place').querySelector('.body'); body.replaceChildren();
    for (const spot of v.people ?? []) {
        const box = el('div', 'spot'); box.append(el('h3', null, spot.label ?? 'Here'));
        for (const p of spot.who) {
            const line = el('div', `who ${p.relation}`); line.append(el('b', null, p.name));
            const bits = [p.state && p.state !== 'in the fight' ? p.state : null, p.doing ? `doing: ${p.doing}` : null].filter(Boolean);
            if (bits.length) line.append(document.createTextNode(` · ${bits.join(' · ')}`));
            if (p.known.length) line.append(el('div', 'known', p.known.map(k => `${k.what}: ${k.value}`).join(' · ')));
            box.append(line);
        }
        body.append(box);
    }
    const things = el('div', 'spot'); things.append(el('h3', null, 'Things'));
    things.append(v.things === null ? el('div', 'who absent', 'Not modelled by this engine.') : el('div', 'who', v.things.length ? v.things.map(t => `${t.label}${t.spot ? ` (${t.spot})` : ''}`).join('; ') : 'Nothing loose.'));
    body.append(things);
    const around = el('div', 'spot'); around.append(el('h3', null, 'Around'));
    around.append(el('div', 'who', v.around.conditions.map(c => `${c.what}: ${c.value}`).join(' · ') || 'Nothing of note.'));
    if (v.around.onlookers === null) around.append(el('div', 'who absent', 'Onlookers and arrivals: not modelled.'));
    body.append(around);
    if (v.knowledge === 'engine') body.append(el('div', 'who absent', 'Shows the engine\'s own truth about others; no knowledge filter yet.'));
    setMissing('place', v, ['people', 'things', 'around']);
}
function drawFocus(f) {
    const v = f.view, body = $('focus').querySelector('.body'); body.replaceChildren();
    body.append(el('p', 'aim', f.aimText ?? v.aim?.text ?? v.title ?? ''));
    if (v.aim?.ends?.length) body.append(el('p', 'ends', `It ends when: ${v.aim.ends.map(e => `${e.when} (${e.outcome.replace('_', ' ')})`).join('; ')}.`));
    if (f.phase === 'result') {
        const r = f.result, box = el('div', 'result'); box.append(el('h3', null, r.head));
        const dl = el('dl'); for (const [k, text] of r.lines) dl.append(el('dt', null, k), el('dd', null, text)); box.append(dl);
        if (r.turning.length) { box.append(el('div', 'cap', 'What decided it')); const ol = el('ol'); for (const t of r.turning) ol.append(el('li', null, t)); box.append(ol); }
        body.append(box); setMissing('focus', v, ['aim', 'coming', 'choices']); return;
    }
    const coming = (v.coming ?? []).filter(c => c.what || v.engine === 'tempo').slice(0, 5);
    const head = el('h2', null, 'Coming'); head.style.marginTop = '4px'; body.append(head);
    if (coming.length) {
        const ul = el('ul', 'coming');
        for (const c of coming) { const li = el('li'); li.append(el('span', 't', c.seconds ? secs(c.seconds) : 'now'), el('span', null, c.what ? `${c.name}: ${c.what}${c.target ? `, at ${c.target === 'You' ? 'you' : c.target}` : ''}` : `${c.name} ${c.name === 'You' ? 'act' : 'acts'}`)); ul.append(li); }
        body.append(ul);
    } else body.append(el('p', 'quiet', 'Nothing under way that you can see.'));
    if (!f.pause) { body.append(el('p', 'quiet', 'Running on the policy. Nothing is being asked.')); setMissing('focus', v, ['aim', 'coming', 'choices']); return; }
    const ask = el('div', 'ask'); ask.append(el('p', 'why', `Paused. ${f.pause.reason}`));
    v.choices.forEach((c, i) => {
        const row = el('div', `choice${c.blocked ? ' blocked' : ''}${f.pause.picked === c.id ? ' picked' : ''}`);
        const what = el('span', null, c.what);
        if (f.pause.policy === c.id) what.append(el('span', 'tag policy', 'the policy would do this'));
        if (f.pause.picked === c.id) what.append(el('span', 'tag chose', 'you chose this'));
        const cost = c.cost === null ? 'cost not given' : c.cost.length ? c.cost.map(x => `${num(x.amount)} ${x.what}`).join(', ') : 'free';
        row.append(el('span', 'n', String(i + 1)), what, el('span', 'meta', `${secs(c.time.seconds)} · ${cost}`));
        const more = [c.blocked ? `Blocked: ${c.blocked}` : null, c.likely ? `Odds: ${c.likely}` : null, !c.blocked && c.subjectNames?.length ? `In reach: ${c.subjectNames.join(', ')}` : null, c.text].filter(Boolean).join(' · ');
        if (more) row.append(el('span', 'more', more));
        ask.append(row);
    });
    body.append(ask);
    setMissing('focus', v, ['aim', 'coming', 'choices']);
}
function drawReports(f, fresh) {
    const body = $('reports').querySelector('.body');
    if (fresh) { body.replaceChildren(); shownReports = 0; }
    // Lines can fold into an earlier one with a count, so the list is redrawn; lines past the last count are new.
    if (f.reports.length < shownReports) shownReports = 0;
    body.replaceChildren();
    f.reports.forEach((line, i) => body.append(el('p', `${line.kind}${fresh || i < shownReports ? '' : ' new'}`, line.text)));
    shownReports = f.reports.length;
    body.scrollTop = body.scrollHeight;
    setMissing('reports', f.view, ['log']);
}
function show(index, jumped = false) {
    at = Math.max(0, Math.min(steps.length - 1, index));
    const step = steps[at], f = frames[step.frame];
    $('scrub').value = at; $('count').textContent = `${at + 1} / ${steps.length}`;
    $('act').textContent = f.act; $('scene').textContent = f.scene; $('note').textContent = f.note;
    $('card').hidden = !step.card;
    if (step.card) { $('card-act').textContent = f.act; $('card-scene').textContent = f.scene; $('card-note').textContent = f.note; }
    const fresh = jumped || lastScene !== `${f.act}|${f.scene}`; lastScene = `${f.act}|${f.scene}`;
    drawYou(f.view); drawPlace(f.view); drawFocus(f); drawReports(f, fresh);
    document.body.dataset.phase = step.card ? 'card' : f.phase;
}
function schedule() {
    clearTimeout(timer);
    if (!playing) return;
    if (at >= steps.length - 1) { timer = setTimeout(() => { playing = false; $('play').textContent = 'Play'; window.__done = true; }, DWELL.result / Number($('speed').value)); return; }
    const step = steps[at], wait = (step.card ? DWELL.card : DWELL[frames[step.frame].phase]) / Number($('speed').value);
    timer = setTimeout(() => { show(at + 1); schedule(); }, wait);
}
function setPlaying(on) { playing = on; $('play').textContent = on ? 'Pause' : 'Play'; schedule(); }
$('scrub').max = steps.length - 1;
$('play').onclick = () => setPlaying(!playing);
$('next').onclick = () => { setPlaying(false); show(at + 1); };
$('prev').onclick = () => { setPlaying(false); show(at - 1, true); };
$('scrub').oninput = e => { setPlaying(false); show(Number(e.target.value), true); };
$('speed').onchange = schedule;
$('gaps').onchange = e => document.body.classList.toggle('nogaps', !e.target.checked);
addEventListener('keydown', e => { if (e.key === ' ') { e.preventDefault(); $('play').click(); } else if (e.key === 'ArrowRight') $('next').click(); else if (e.key === 'ArrowLeft') $('prev').click(); });
if (params.get('speed')) $('speed').value = params.get('speed');
show(Number(params.get('at') ?? 0), true);
if (params.get('autoplay') === '1') setPlaying(true);
window.__steps = steps.length;
