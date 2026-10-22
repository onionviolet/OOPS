import {definePanel} from './panel_kit.js';
import {HP} from './hp_brewing_state.js';

const el = (tag, text, cls) => {const n = document.createElement(tag); if(text != null) n.textContent = text; if(cls) n.className = cls; return n;};
const FORM_NAMES = {raw: 'raw', stewed: 'stewed', powdered: 'powdered', shredded: 'shredded'};
const slotName = id => HP.ingredients.find(i => i.id === HP.formula.slots.find(s => s.id === id).ingredient).label;
const route = id => HP.routes.find(r => r.id === id);

// Expanded center workspace view (UR): one node, owned here, home is the main content.
export function createHpBrewingPanel({read, quote, execute}) {
    const panel = el('section'); panel.id = 'hp_brewing'; panel.className = 'expedition_panel'; panel.dataset.surfaceType = 'expanded-center';
    const body = el('div'); panel.append(el('h2', 'Polyjuice bench · Harry Potter pack slice'),
        el('p', 'One pinned potion from J.K. Rowling\'s Chamber of Secrets, paraphrased. Steps marked original are this game\'s proposals, not canon. A prototype slice: there is no Hogwarts world to arrive in yet.'), body);
    const sel = {ingredient: '', route: '', prepared: false, slots: {}, batch: '', sample: ''};
    let signature = '', notice = '';
    const run = (req) => { try {const out = execute(req); notice = out.summary; } catch(error) {notice = error.message;} signature = ''; render(); };
    function button(text, req, parent, extra = {}) {
        const b = el('button', text); b.type = 'button'; if(extra.id) b.dataset.hpAction = extra.id;
        const q = quote(req); b.disabled = !q.eligible; b.title = q.eligible ? q.summary : q.reason;
        b.onclick = () => run(req); parent.append(b);
        if(extra.why && !q.eligible) parent.append(el('p', q.reason, 'hp-note'));
        return b;
    }
    const select = (label, rows, current, onChange, id) => {
        const s = el('select'); s.setAttribute('aria-label', label); if(id) s.dataset.hpSelect = id;
        const blank = el('option', label); blank.value = ''; s.append(blank);
        for(const [value, text] of rows) {const o = el('option', text); o.value = value; s.append(o);}
        s.value = rows.some(([v]) => v === current) ? current : ''; s.onchange = () => {onChange(s.value); signature = ''; render();}; return s;
    };
    const section = (title, ...kids) => {const s = el('div', null, 'hp-section'); s.append(el('h3', title), ...kids); return s;};
    const lotLine = l => `${l.name} · ${FORM_NAMES[l.form]}${l.variant ? ` (${l.variant.toLowerCase()})` : ''}${l.stewing ? ` · stewing, day ${l.stewDaysDone + 1}` : ''}`
        + `${l.claim ? ` · ${l.claim}` : ''}${l.provenance && l.provenance !== 'unknown' ? ` · ${l.provenance === 'full_moon' ? 'known full-moon pick' : 'known not full-moon'}` : ''}${l.stewedKnown ? ` · stewed ${l.stewedKnown}` : ''}`;

    function render() {
        if(!panel.isConnected) return;
        const v = read(), key = JSON.stringify([v, sel, notice]);
        if(key === signature) return; signature = key;
        const parts = [];
        if(!v.begun) {
            const intro = section('Begin', el('p', v.waiting ? 'The game clock is not ready yet.' : 'Set up a small bench, a purse of slice coins and three classmates who might lend a sample. Lots, prices and consequences are original proposals around the sourced formula.'));
            button('Begin the Polyjuice slice', {type: 'begin'}, intro, {id: 'begin'}); parts.push(intro);
        } else {
            parts.push(el('p', `Purse ${v.purse} coins · moon: ${v.moon ?? 'unknown'} · cauldron ${v.cauldron.condition}${v.cauldron.brewing ? `, simmering (${v.cauldron.readyInHours} h left)` : ''} · Potions master: ${v.master}`, 'hp-status'));
            // 1. Obtain
            const ings = HP.ingredients, offered = ing => HP.routes.filter(r => Object.hasOwn(r.cost, ing));
            const obtain = section('1. Obtain ingredients', select('Ingredient', ings.map(i => [i.id, i.label]), sel.ingredient, x => {sel.ingredient = x; sel.route = '';}, 'ingredient'));
            if(sel.ingredient) {
                obtain.append(select('Route', offered(sel.ingredient).map(r => [r.id, `${r.label}${r.cost[sel.ingredient] ? ` · ${r.cost[sel.ingredient]} coins` : ''}`]), sel.route, x => {sel.route = x;}, 'route'));
                const r = route(sel.route);
                if(r?.preparedStewedLacewing && sel.ingredient === 'book.hp.ing.lacewing_flies') {
                    const label = el('label'), box = el('input'); box.type = 'checkbox'; box.checked = sel.prepared; box.dataset.hpPrepared = '';
                    box.onchange = () => {sel.prepared = box.checked; signature = ''; render();}; label.append(box, el('span', ` Ready-stewed instead (${r.preparedStewedLacewing} coins)`)); obtain.append(label);
                }
                if(r) button('Obtain', {type: 'acquire', route: r.id, ingredient: sel.ingredient, prepared: sel.prepared && !!r.preparedStewedLacewing}, obtain, {id: 'acquire', why: true});
            }
            obtain.append(el('p', `Student cupboard left: ${Object.entries(v.store).map(([id, n]) => `${HP.ingredients.find(i => i.id === id).label} ${n}`).join(', ')}`, 'hp-note'));
            parts.push(obtain);
            // 2. Stock and preparation
            const stock = section('2. Prepare and stew');
            if(!v.lots.length) stock.append(el('p', 'You hold no lots.'));
            for(const l of v.lots) {
                const row = el('div', null, 'hp-row'); row.dataset.hpLot = l.id; row.append(el('span', lotLine(l)));
                if(l.form === 'raw' && !l.stewing) {
                    if(l.ingredient === 'book.hp.ing.lacewing_flies') button('Stew', {type: 'stew', lotId: l.id}, row, {id: 'stew'});
                    for(const p of HP.variants) if(HP.ingredients.find(i => i.id === l.ingredient).forms.includes(p.makes)) button(p.label, {type: 'prepare', lotId: l.id, variant: p.id}, row, {id: 'prepare'});
                }
                if(l.stewing) button('Take off the pot', {type: 'removeStew', lotId: l.id}, row, {id: 'remove-stew'});
                button(`Assay (${HP.rules.assayCost})`, {type: 'assay', lotId: l.id}, row, {id: 'assay-lot'});
                stock.append(row);
            }
            parts.push(stock);
            // 3. Samples
            const samples = section('3. A bit of the person (added last)');
            for(const d of v.donors) {
                const row = el('div', null, 'hp-row'); row.append(el('span', `${d.name} · ${d.mood}`));
                button('Ask for a hair', {type: 'sample', donorId: d.id, route: 'ask'}, row, {id: 'sample-ask'});
                button('Take from a hairbrush', {type: 'sample', donorId: d.id, route: 'brush'}, row, {id: 'sample-brush'});
                samples.append(row);
            }
            for(const x of v.samples) {
                const row = el('div', null, 'hp-row'); row.dataset.hpSample = x.id; row.append(el('span', `${x.claim}${x.assayed ? ` Assayed: ${x.species} hair, from ${x.donorName}.` : ''}`));
                button(`Assay (${HP.rules.assayCost})`, {type: 'assay', sampleId: x.id}, row, {id: 'assay-sample'}); samples.append(row);
            }
            parts.push(samples);
            // 4. Brew
            const brewable = v.lots.filter(l => !l.stewing).map(l => [l.id, lotLine(l)]);
            const brew = section('4. Simmer in the cauldron', el('p', 'Any lots may go in any place; only the pinned formula makes the pinned potion.'));
            for(const slot of HP.formula.slots) brew.append(select(`${slotName(slot.id)} slot`, brewable, sel.slots[slot.id] ?? '', x => {sel.slots[slot.id] = x;}, `slot-${slot.id}`));
            const chosen = Object.fromEntries(Object.entries(sel.slots).filter(([, id]) => id && brewable.some(([b]) => b === id)));
            button('Simmer (two days)', {type: 'brew', slots: chosen}, brew, {id: 'brew', why: true});
            button(`Scour cauldron (${HP.rules.scourCost})`, {type: 'scour'}, brew, {id: 'scour'});
            parts.push(brew);
            // 5. Batches and use
            const use = section('5. Drink');
            if(!v.batches.length) use.append(el('p', 'Nothing has finished simmering.'));
            for(const b of v.batches) {
                const row = el('div', null, 'hp-row'); row.dataset.hpBatch = b.id; row.append(el('span', `${b.label} · ${b.dosesLeft} doses · ${b.cue}`));
                button(`Assay (${HP.rules.assayCost})`, {type: 'assay', batchId: b.id}, row, {id: 'assay-batch'}); use.append(row);
            }
            if(v.batches.length && v.samples.length) {
                use.append(select('Batch', v.batches.map(b => [b.id, `${b.label} (${b.dosesLeft})`]), sel.batch, x => {sel.batch = x;}, 'batch'),
                    select('Sample', v.samples.map(x => [x.id, x.claim]), sel.sample, x => {sel.sample = x;}, 'sample'));
                button('Add the sample to a glass and drink', {type: 'drink', batchId: sel.batch, sampleId: sel.sample}, use, {id: 'drink', why: true});
            }
            if(v.effect) use.append(el('p', `You are ${v.effect.donorName} (${v.effect.kind === 'thin' ? 'thin draught' : 'Polyjuice'}) for about ${v.effect.minutesLeft} more minutes.`, 'hp-note'));
            if(v.condition) use.append(el('p', `Animal features remain, about ${v.condition.daysLeft} days.`, 'hp-note'));
            parts.push(use);
            // 6. Debts and ledger
            const ledger = section('6. What follows');
            for(const d of v.debts) {
                const row = el('div', null, 'hp-row'); row.append(el('span', `Loan of ${d.name}: ${d.status}${d.status === 'open' ? `, due in about ${d.dueInDays} days` : ''}`));
                button(`Repay (${d.repay})`, {type: 'repay', debtId: d.id}, row, {id: 'repay'}); ledger.append(row);
            }
            if(!v.ledger.length) ledger.append(el('p', 'Nothing recorded yet.'));
            for(const e of [...v.ledger].reverse()) ledger.append(el('p', e.text, 'hp-ledger'));
            parts.push(ledger);
        }
        const n = el('p', notice, 'hp-notice'); n.setAttribute('role', 'status');
        body.replaceChildren(...parts, n);
    }
    definePanel({id: 'hp-polyjuice', title: 'Polyjuice bench', role: 'actions', node: panel, home: document.getElementById('main_content'), defaultDock: 'center',
        discovered: () => true, eligible: () => true, unavailableReason: () => 'The Polyjuice slice is not available.'});
    render(); return {render};
}
