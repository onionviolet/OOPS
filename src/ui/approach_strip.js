// The approach strip (PS34-PS43, proposals): how you fight, what you mean to happen when they go down, and what you do if you are losing.
// One row of controls drawn the same way on a fight's opener and on the fight card (PS39), so moving between them changes nothing the
// player chose. Stakes are not here: they are shown, not picked (PS37). Draws only; every choice goes back through a command.
import {TERMS_LABEL, TERMS_TEXT, LOSING, LOSING_LABEL, termsClash} from '../fight_terms.js';

const KIND_WORD = {beast: 'it goes', person: 'they go', other: 'they go'};

// The stance list is the original game's own (Combat > Stances): read from its table on the page, so this file pulls in no game data;
// choosing goes through the native change_stance, which keeps its own rules and stamina costs.
function knownStances(doc, current) {
    const rows = [...doc.querySelectorAll('#stance_list tr.stance_list_entry[data-stance]')].map(r => ({id: r.dataset.stance, name: r.querySelector('.stances_name')?.textContent.trim() || r.dataset.stance}));
    if(current?.id && !rows.some(r => r.id === current.id)) rows.unshift({id: current.id, name: current.name || current.id});
    return rows;
}
function stanceControl(doc, current, disabled) {
    const label = doc.createElement('label'); label.className = 'approach-stance';
    const select = doc.createElement('select'); select.dataset.approachStance = ''; select.disabled = disabled || typeof globalThis.change_stance !== 'function';
    for(const s of knownStances(doc, current)) { const o = doc.createElement('option'); o.value = s.id; o.textContent = s.name; o.selected = s.id === current?.id; select.append(o); }
    select.title = 'How you fight. Pulled Blows pulls every blow: a downing blow knocks out, and practice makes a slip rarer.';
    select.onchange = () => { try { globalThis.change_stance?.({stance_id: select.value}); } catch(error) { /* the native change reports its own refusal */ } };
    label.append('Stance ', select);
    return label;
}

function segmented(doc, {name, options, value, onPick, disabled, title}) {
    const group = doc.createElement('span'); group.className = 'approach-segmented'; group.setAttribute('role', 'group'); group.setAttribute('aria-label', name);
    for(const [id, label, hint] of options) {
        const b = doc.createElement('button'); b.type = 'button'; b.textContent = label; b.dataset.approachOption = id;
        b.setAttribute('aria-pressed', String(value === id)); b.disabled = !!disabled; b.title = hint || title || '';
        b.onclick = () => onPick(id);
        group.append(b);
    }
    return group;
}

/**
 * Draws the strip into `host`. `strip` is the domain's {stance, terms: [{kind, terms, reason, set, why, takeAlive}], losing};
 * `stakes` the fight's stakes (for the clash line, PS43); `on` = {terms(kind, value), losing(value)}, each returning the line to show.
 */
export function renderApproachStrip(host, {strip, stakes = {}, disabled = false, on = {}, losing = true, asks = true}) {
    const doc = host.ownerDocument || globalThis.document;
    const box = doc.createElement('div'); box.className = 'approach-strip'; box.dataset.approachStrip = '';
    const row = doc.createElement('p'); row.className = 'approach-row';
    row.append(stanceControl(doc, strip.stance, disabled));
    box.append(row);
    for(const t of strip.terms || []) {
        const line = doc.createElement('p'); line.className = 'approach-row'; line.dataset.approachTerms = t.kind;
        const opts = ['finish', 'spare', ...(t.takeAlive ? ['take_alive'] : []), ...(asks ? ['ask'] : [])].map(id => [id, TERMS_LABEL[id], TERMS_TEXT[id]]);
        line.append(`If ${KIND_WORD[t.kind] || 'they go'} down: `, segmented(doc, {name: `If ${t.kind} goes down`, options: opts, value: t.terms, disabled, onPick: v => on.terms?.(t.kind, v)}));
        const why = doc.createElement('small'); why.className = 'approach-why'; why.dataset.approachWhy = t.kind;
        const clash = termsClash(stakes, t.terms);
        why.textContent = [t.set ? '' : `Default: ${t.reason}`, t.why || '', t.kind === 'person' && t.terms !== 'ask' ? 'A person down still asks you.' : '', clash].filter(Boolean).join(' ');
        if(clash) why.dataset.approachClash = '';
        line.append(' ', why);
        box.append(line);
    }
    if(losing) {
        const line = doc.createElement('p'); line.className = 'approach-row'; line.dataset.approachLosing = '';
        line.append('If I am losing: ', segmented(doc, {name: 'If I am losing', options: LOSING.map(id => [id, LOSING_LABEL[id], id === 'fight_on' ? 'Fight on stops only when something needs you.' : id === 'yield' ? 'At about a third of your health, yield.' : 'At about a third of your health, back away.']), value: strip.losing, disabled, onPick: v => on.losing?.(v)}));
        box.append(line);
    }
    host.append(box);
    return box;
}
