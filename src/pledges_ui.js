import {definePanel} from './panel_kit.js';
// Desktop-first (UI target 1536/1920; mobile deferred). Two reference-dock panels (ST6) that read one projection;
// every button calls a domain command that revalidates and reports its own refusal text in place.
const node = (tag, text = '', className = '') => { const n = document.createElement(tag); if(text) n.textContent = text; if(className) n.className = className; return n; };
const cap = s => s[0].toUpperCase() + s.slice(1);
function shell(id, title, heading, intro) {
    const panel = node('section', '', 'expedition_panel'); panel.id = id; panel.dataset.surfaceType = 'records';
    const body = node('div'), notice = node('p'); notice.setAttribute('role', 'status');
    panel.append(node('h2', heading), node('p', intro, 'expedition_preview'), body, notice);
    let signature = '';
    const act = (fn, done) => { try { const r = fn(); notice.textContent = typeof done === 'function' ? done(r) : done; } catch(e) { notice.textContent = e.message; } signature = ''; };
    const button = (label, attrs, onclick, disabled = false, title = '') => { const b = node('button', label); b.type = 'button'; b.disabled = disabled; b.title = title; Object.assign(b.dataset, attrs); b.onclick = onclick; return b; };
    return {panel, body, notice, act, button, changed: key => { const next = JSON.stringify([key, notice.textContent]); if(next === signature) return false; signature = next; return true; }};
}

export function createPledgesPanel({read, commands}) {
    const s = shell('pledges_panel', 'Vows and trials', 'Vows and tempering',
        'A vow trades freedom for strength and leaves a scar if broken. Tempering sets the body for good; a failed attempt wakes a heart demon that dulls you until you sit it out.');
    let rerender = () => {};
    function render() {
        const v = read();
        if(!s.changed([v.state.vows, v.state.trial, v.rations, v.trial.ready, v.ready])) return;
        s.body.replaceChildren(node('h3', `Vows (${v.keptCount} of ${v.maxKept} kept)`));
        for(const vow of v.vows) {
            const row = node('p'); row.dataset.vow = vow.id;
            const state = vow.kept ? 'kept' : vow.broken ? `broken, scar ${vow.broken.scar}` : 'not sworn';
            row.append(node('span', `${cap(vow.id.replace('-', ' '))}: ${vow.text} +${vow.bonus / 10}% ${vow.track}, scar ${vow.scar} if broken. (${state}) ${vow.reason} `));
            if(vow.kept) row.append(s.button('Break vow', {breakVow: vow.id}, () => { s.act(() => commands.breakVow(vow.id), 'The vow is broken.'); render(); }));
            else row.append(s.button('Swear', {takeVow: vow.id}, () => { s.act(() => commands.takeVow(vow.id), 'You swear the vow.'); render(); }, v.keptCount >= v.maxKept, v.keptCount >= v.maxKept ? 'Break a kept vow first.' : ''));
            s.body.append(row);
        }
        const t = v.trial;
        s.body.append(node('h3', `Tempering: ${t.name}`));
        if(t.done) s.body.append(node('p', 'Nothing is left to temper in this slice.'));
        else {
            const line = node('p', `Next: ${t.next}${t.tribulation ? ' (a tribulation: a failure wakes the demon harder)' : ''}. Chance of failing: ${t.risk / 10}%. Vows steady it (${t.stability}), broken vows and the heart demon (${t.pressure}) worsen it (scar ${t.scar}).`); line.dataset.trialRisk = String(t.risk);
            s.body.append(line);
            if(!t.ready) s.body.append(node('p', `Not ready: ${t.shown.join(' ')}`, 'expedition_requirements'));
            const q = t.quote;
            s.body.append(node('p', `Rations laid in cut the risk (up to ${t.maxUnits}, never to zero). The lowest risk, ${q.to / 10}%, costs ${q.cost} ${q.cost === 1 ? 'ration' : 'rations'} of stale bread. You carry ${v.rations}.`, 'expedition_preview'));
            const row = node('div');
            for(const n of [0, q.units].filter((x, i, a) => a.indexOf(x) === i)) {
                row.append(s.button(n ? `Temper, laying in ${n}` : 'Temper without rations', {temper: String(n)}, () => { s.act(() => commands.temper(n), r => r.passed ? 'The tempering holds.' : 'The tempering failed. The heart demon stirs.'); render(); }, !t.ready || v.rations < n, !t.ready ? 'Not ready yet.' : ''));
            }
            s.body.append(row);
        }
        if(t.pressure) {
            const row = node('p', `Heart demon: pressure ${t.pressure}. It dulls strength and agility by ${Math.min(30, t.pressure * 2)}%. `); row.dataset.heartDemon = String(t.pressure);
            row.append(s.button('Sit with the fear (1 ration)', {calm: ''}, () => { s.act(() => commands.calm(), 'The fear eases a little.'); render(); }, v.rations < 1));
            s.body.append(row);
        }
        s.notice.hidden = !s.notice.textContent;
    }
    rerender = render;
    definePanel({id: 'pledges', title: 'Vows and trials', role: 'records', node: s.panel, home: document.getElementById('main_content'),
        discovered: () => true, eligible: () => true, unavailableReason: () => 'Unavailable'});
    render();
    return {render: () => { render(); }};
}

export function createRuneBenchPanel({read, commands}) {
    const s = shell('rune_bench_panel', 'Rune bench', 'Rune bench',
        'Carve two to four runes on a wood tablet, one log per rune, and wear it. Order matters. An unlearned pairing is not forbidden, only costly: it fizzles and dulls your feet.');
    let strip = [];
    function render() {
        const v = read(), r = v.runes;
        if(!s.changed([v.state.runes, v.state.talisman, v.wood, v.now >= (v.state.talisman?.until ?? 0), strip, v.ready])) return;
        s.body.replaceChildren(node('h3', `Pairs tried: ${r.coverage.tried} of ${r.total}`));
        for(const p of r.tried) { const row = node('p', `${p.a} then ${p.b}: ${r.effectText[p.effect] ?? p.effect}`); row.dataset.runePair = `${p.a}>${p.b}`; s.body.append(row); }
        if(!r.tried.length) s.body.append(node('p', 'Nothing tried yet. A tablet of just two runes shows what that pair does.', 'expedition_requirements'));
        const picker = node('div');
        for(const rune of r.runes) picker.append(s.button(cap(rune), {rune}, () => { if(strip.length < r.maxLength) strip = [...strip, rune]; s.act(() => 0, ''); render(); }, strip.length >= r.maxLength));
        picker.append(s.button('Clear', {runeClear: ''}, () => { strip = []; s.act(() => 0, ''); render(); }, !strip.length));
        s.body.append(picker);
        const cost = strip.length * r.perRune, pairs = strip.slice(1).map((b, i) => [strip[i], b]);
        const prev = node('p', strip.length ? `Tablet: ${strip.join(' → ')}. ${cost} wood needed (you carry ${v.wood}). ${pairs.map(([a, b]) => { const k = r.knownPair(a, b); return `${a}→${b}: ${k ? r.effectText[k] : 'untried'}`; }).join('; ')}.` : 'Choose runes in the order they will read.');
        prev.dataset.runePreview = ''; s.body.append(prev);
        s.body.append(s.button('Carve and wear', {carve: ''}, () => { s.act(() => commands.carve(strip), read => `Worn: ${Object.entries(read.effects).map(([e, n]) => `${r.effectText[e] ?? e} ${n}`).join(', ')}.`); strip = []; render(); }, strip.length < 2 || v.wood < cost, strip.length < 2 ? 'Choose at least two runes.' : v.wood < cost ? 'Not enough wood.' : ''));
        if(r.talisman && r.minutesLeft > 0) { const w = node('p', `Wearing ${r.talisman.runes.join(' → ')}: ${Object.entries(r.talisman.effects).map(([e, n]) => `${r.effectText[e]} (${n})`).join(', ')}; ${r.minutesLeft} minutes left.`); w.dataset.worn = ''; s.body.append(w); }
        s.notice.hidden = !s.notice.textContent;
    }
    definePanel({id: 'rune-bench', title: 'Rune bench', role: 'records', node: s.panel, home: document.getElementById('main_content'),
        discovered: () => true, eligible: () => true, unavailableReason: () => 'Unavailable'});
    render();
    return {render};
}
