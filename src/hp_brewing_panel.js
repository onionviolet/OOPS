import {definePanel} from './panel_kit.js';
import {HP} from './hp_brewing_state.js';
import {hpPreparationTerms} from './hp_preparation.js';
import {HP_ABRASIVE_PROCESS as ABRASIVE} from './hp_ingredient_substitution.js';
import {compareTrials} from './craft_experiment_log.js';
import {hash64} from './gen_kit.js';
import {HP_PROCESS, assessHpPreparation, inspectHpPreparation} from './hp_brewing_formula.js';

const el = (tag, text, cls) => {const n = document.createElement(tag); if(text != null) n.textContent = text; if(cls) n.className = cls; return n;};
const FORM_NAMES = {raw: 'raw', stewed: 'stewed', powdered: 'powdered', shredded: 'shredded'};
const slotName = id => HP.ingredients.find(i => i.id === HP.formula.slots.find(s => s.id === id).ingredient).label;
const route = id => HP.routes.find(r => r.id === id);
const stockHandle = key => {const h = hash64(0, key); return `N-${h.hi.toString(16).padStart(8, '0')}${h.lo.toString(16).padStart(8, '0')}`;};

// Expanded center workspace view (UR): one node, owned here, home is the main content.
export function createHpBrewingPanel({read, quote, execute}) {
    const panel = el('section'); panel.id = 'hp_brewing'; panel.className = 'expedition_panel'; panel.dataset.surfaceType = 'expanded-center';
    const body = el('div'); panel.append(el('h2', 'Polyjuice bench · Harry Potter pack slice'),
        el('p', 'One pinned potion from J.K. Rowling\'s Chamber of Secrets, paraphrased. Steps marked original are this game\'s proposals, not canon. The bench also supports small original material experiments; a proposed use remains untested until observed.'), body);
    const sel = {ingredient: '', route: '', prepared: false, slots: {}, batch: '', sample: '', method: HP_PROCESS.id, materialInputs: [], choiceId: '', methodId: '', repeatMode: 'quick', before: '', after: '', samplesOpen: false, methodsOpen: false, notesOpen: false, assessmentOpen: false};
    let signature = '', notice = '';
    const run = (req) => { try {const out = execute(req); notice = out.summary; } catch(error) {notice = error.message;} signature = ''; render(); };
    function button(text, req, parent, extra = {}) {
        const b = el('button', text); b.type = 'button'; if(extra.id) b.dataset.hpAction = extra.id;
        const q = quote(req); b.disabled = !q.eligible; b.title = q.eligible ? q.summary : q.reason;
        b.onclick = () => run(req); parent.append(b);
        // The shared disabled-reason component renders title once for this action.
        return b;
    }
    const select = (label, rows, current, onChange, id) => {
        const s = el('select'); s.setAttribute('aria-label', label); if(id) s.dataset.hpSelect = id;
        const blank = el('option', label); blank.value = ''; s.append(blank);
        for(const [value, text] of rows) {const o = el('option', text); o.value = value; s.append(o);}
        if(current && !rows.some(([v]) => v === current)) {
            const unavailable = el('option', `${label}: previous selection${/^[LSab][0-9]+$/.test(current) ? ` ${current}` : ''} is no longer available; clear or replace it`);
            unavailable.value = current; s.append(unavailable);
        }
        s.value = current || ''; s.onchange = () => {onChange(s.value); signature = ''; render();}; return s;
    };
    const section = (title, ...kids) => {const s = el('div', null, 'hp-section'); s.append(el('h3', title), ...kids); return s;};
    const lotLine = l => `${l.name} [${l.id}] · ${l.custody} · ${FORM_NAMES[l.form]}${l.variant ? ` (${l.variant.toLowerCase()})` : ''}${l.stewing ? ` · stewing, day ${l.stewDaysDone + 1}` : ''}`
        + `${l.claim ? ` · ${l.claim}` : ''}${l.provenance && l.provenance !== 'unknown' ? ` · ${l.provenance === 'full_moon' ? 'known full-moon pick' : 'known not full-moon'}` : ''}${l.stewedKnown ? ` · stewed ${l.stewedKnown}` : ''}${l.preparation ? ` · ${l.preparation.means.laborCoins} coins paid for preparation` : ''}`;

    function render() {
        if(!panel.isConnected) return;
        const v = read(), key = JSON.stringify([v, sel, notice]);
        if(key === signature) return; signature = key;
        const parts = [];
        if(!v.begun) {
            const intro = section('Begin', el('p', v.waiting ? 'The game clock is not ready yet.' : 'Set up a small bench, a purse of slice coins and three classmates who might lend a sample. Lots, prices and consequences are original proposals around the sourced formula.'));
            button('Begin the Polyjuice slice', {type: 'begin'}, intro, {id: 'begin'}); parts.push(intro);
        } else {
            parts.push(el('p', `Purse ${v.purse} coins · moon: ${v.moon ?? 'unknown'} · cauldron ${v.cauldron.condition}, ${v.cauldron.residue}${v.cauldron.brewing ? `, ${v.cauldron.activity} (${v.cauldron.readyInMinutes < 60 ? `${v.cauldron.readyInMinutes} min` : `${v.cauldron.readyInHours} h`} left)` : ''} · Potions master: ${v.master}`, 'hp-status'));
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
                    for(const p of HP.variants) if(HP.ingredients.find(i => i.id === l.ingredient).forms.includes(p.makes)) button(`${p.label} (${hpPreparationTerms(p.id).coins} coin${hpPreparationTerms(p.id).coins === 1 ? '' : 's'})`, {type: 'prepare', lotId: l.id, variant: p.id}, row, {id: 'prepare'});
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
            if(sel.method === ABRASIVE.ref) {
                const optional = el('details'); optional.open = sel.samplesOpen;
                optional.append(el('summary', 'Samples for a transformation (not needed for scouring)'), samples);
                optional.ontoggle = () => {sel.samplesOpen = optional.open;}; parts.push(optional);
            } else parts.push(samples);
            // 4. Brew
            const brewable = v.lots.filter(l => !l.stewing).map(l => [l.id, lotLine(l)]);
            const brew = section('4. Make at the cauldron',
                select('Making method', [[HP_PROCESS.id, 'Pinned Polyjuice method · two days'], [ABRASIVE.ref, 'Original suspension · 20 min · 1 water-service coin']], sel.method, x => {sel.method = x || HP_PROCESS.id;}, 'method'),
                el('p', sel.method === ABRASIVE.ref ? 'Suspend up to three selected solid portions in water. This is an original physical experiment; it does not predict a transformation or a cleaning result.' : 'Any lots may go in any place; the pinned formula determines the pinned potion.'));
            if(sel.method === ABRASIVE.ref && v.substitution) {
                brew.append(el('p', v.substitution.cost, 'hp-note'));
                brew.append(select('Material comparison option', v.substitution.choices.map(c => [c.id, c.label]), sel.choiceId, id => {
                    sel.choiceId = id;
                    if(id && v.substitution.requests[id]) {
                        const request = v.substitution.requests[id];
                        sel.slots = {...request.slots}; sel.materialInputs = request.materialInputs.map(x => ({...x}));
                    }
                }, 'comparison-option'));
                const selected = v.substitution.choices.find(c => c.id === sel.choiceId);
                if(selected) for(const row of selected.debits) brew.append(el('p', `${row.name}${row.key.startsWith('hp:') ? '' : ` [${stockHandle(row.key)}]`} · ${row.qty} selected · ${row.custody}${row.stockReason ? ` · ${row.stockReason}` : ''}`, 'hp-note'));
                if(selected) for(const fact of selected.evidence.uncertainConditions) brew.append(el('p', fact.reason || 'This proposed physical arrangement is not a demonstrated result.', 'hp-note'));
                if(sel.choiceId && !selected) brew.append(el('p', 'The selected comparison option is no longer available. Its exact request is retained; clear or replace the selected inputs.', 'hp-note'));
                if(sel.materialInputs.length) brew.append(el('p', `Native portions selected: ${sel.materialInputs.map(x => `${x.qty} from carried stock ${stockHandle(x.key)}`).join(', ')}. Native amounts are rechecked before payment.`, 'hp-note'));
            }
            const clear = el('button', 'Clear selected inputs'); clear.type = 'button'; clear.dataset.hpAction = 'clear-selection';
            clear.onclick = () => {sel.slots = {}; sel.materialInputs = []; sel.choiceId = ''; signature = ''; render();}; brew.append(clear);
            for(const slot of HP.formula.slots) brew.append(select(`${slotName(slot.id)} slot`, brewable, sel.slots[slot.id] ?? '', x => {sel.slots[slot.id] = x;}, `slot-${slot.id}`));
            // Keep stale IDs in the request so the command refuses them instead
            // of silently brewing a different, partial selection.
            const chosen = Object.fromEntries(Object.entries(sel.slots).filter(([, id]) => id));
            if(sel.method !== ABRASIVE.ref) {
                const assessment = assessHpPreparation(v, sel.slots);
                const comparison = el('details'); comparison.dataset.hpAssessment = assessment.status; comparison.open = sel.assessmentOpen; comparison.ontoggle = () => {sel.assessmentOpen = comparison.open;};
                const statusLabel = {supported: 'Known conditions match', uncertain: 'Evidence still uncertain', unsupported: 'Prediction unsupported', deviation: 'Known method difference', incomplete: 'Selection incomplete', stale: 'Selection changed'};
                comparison.append(el('summary', `Preparation comparison: ${statusLabel[assessment.status]}`), el('p', assessment.cost), el('p', assessment.apparatus));
                const inspected = inspectHpPreparation(v, sel.slots);
                for(const [index, row] of assessment.rows.entries()) {
                    const evidence = inspected[index], detail = el('details'); detail.dataset.hpEvidence = row.slot;
                    detail.append(el('summary', `${slotName(row.slot)}: ${row.reason}`));
                    for(const fact of evidence.properties) {
                        const meaning = {form: 'Form', preparation: 'Preparation', picking: 'Picking conditions', stewing: 'Stewing duration', acquisition: 'Acquisition note'}[fact.id];
                        detail.append(el('p', `${meaning}: ${fact.value ?? 'not verified'} · ${fact.status}${fact.status === 'claim' ? ` (${fact.source})` : ''}`, 'hp-note'));
                    }
                    if(evidence.lot) detail.append(el('p', `Held lot ${evidence.lot.id} · ${evidence.lot.custody}`, 'hp-note'));
                    comparison.append(detail);
                }
                comparison.append(el('p', assessment.coverage, 'hp-note')); brew.append(comparison);
            }
            const brewRequest = {type: 'brew', method: sel.method, slots: chosen, ...(sel.method === ABRASIVE.ref ? {materialInputs: sel.materialInputs} : {})};
            button(sel.method === ABRASIVE.ref ? 'Settle suspension (20 min · 1 coin)' : 'Simmer (two days)', brewRequest, brew, {id: 'brew', why: true});
            if(v.methods.length) {
                const repeat = el('details'); repeat.dataset.hpMethods = ''; repeat.open = sel.methodsOpen; repeat.ontoggle = () => {sel.methodsOpen = repeat.open;};
                repeat.append(el('summary', `Demonstrated methods · ${v.methods.length}`),
                    el('p', 'Choose current held inputs above. Repeat checks the observed preparation and apparatus; it does not restore spent ingredients or prove unmeasured tolerances.', 'hp-note'),
                    select('Demonstrated method', v.methods.map((m, i) => [m.id, `Method ${i + 1} · ${m.request.method === ABRASIVE.ref ? 'original suspension' : 'pinned potion'} · ${m.setup.inputs.map(x => `${HP.ingredients.find(i => i.id === x.material)?.label ?? x.material} ×${x.qty}`).join(', ')}`]), sel.methodId, x => {sel.methodId = x;}, 'demonstrated-method'),
                    select('Making depth', [['quick', 'Quick · repeat known conditions'], ['guided', 'Guided review'], ['deep', 'Deep review']], sel.repeatMode, x => {sel.repeatMode = x || 'quick';}, 'repeat-mode'));
                if(sel.methodId) {
                    const request = {...brewRequest, repeatMethodId: sel.methodId, repeatMode: sel.repeatMode}, preview = quote(request);
                    if(preview.eligible) repeat.append(el('p', preview.summary, 'hp-note'));
                    button('Repeat with selected current inputs', request, repeat, {id: 'repeat', why: true});
                }
                brew.append(repeat);
            }
            button(`Scour cauldron (${HP.rules.scourCost})`, {type: 'scour'}, brew, {id: 'scour'});
            parts.push(brew);
            // 5. Batches and use
            const use = section('5. Use or measure a batch');
            if(!v.batches.length) use.append(el('p', 'Nothing has finished simmering.'));
            for(const b of v.batches) {
                const row = el('div', null, 'hp-row'); row.dataset.hpBatch = b.id; row.append(el('span', `${b.label} [${b.id}] · ${b.dosesLeft} dose${b.dosesLeft === 1 ? '' : 's'} · ${b.custody === 'bench' ? 'stored at bench' : 'carried'} · ${b.cue}`));
                if(b.custody !== 'bench') button(`Assay (${HP.rules.assayCost})`, {type: 'assay', batchId: b.id}, row, {id: 'assay-batch'});
                if(b.retainedHistory) {
                    if(b.custody !== 'bench') {
                    button('Test one dose on cauldron residue', {type: 'treatCauldron', batchId: b.id}, row, {id: 'treat-cauldron', why: true});
                    row.append(el('p', b.treatment, 'hp-note'));
                    if(v.foreignUses?.[b.id]) button('Propose structural repair here', {type: 'foreignUse', batchId: b.id, use: 'structural-repair'}, row, {id: 'foreign-use', why: true});
                    }
                    if(b.custody === 'bench') button('Retrieve portion', {type: 'transferBatch', batchId: b.id, custody: 'carried'}, row, {id: 'retrieve-batch'});
                    else {
                        button('Set aside one dose', {type: 'splitBatch', batchId: b.id, doses: 1}, row, {id: 'split-batch'});
                        button('Store portion at bench', {type: 'transferBatch', batchId: b.id, custody: 'bench'}, row, {id: 'store-batch'});
                        const other = v.batches.find(x => x.id !== b.id && x.cohortId === b.cohortId && x.custody === 'carried');
                        if(other) button('Recombine with same batch', {type: 'mergeBatch', batchId: other.id, sourceId: b.id}, row, {id: 'merge-batch'});
                    }
                }
                use.append(row);
            }
            if(v.batches.some(b => b.retainedHistory)) use.append(el('p', 'Portions retain their batch and preparation history. Private bench storage and pouring are original game conveniences; no bottles are spent. Separately brewed batches stay separate.', 'hp-note'));
            if(v.batches.length && v.samples.length) {
                use.append(select('Batch', v.batches.map(b => [b.id, `${b.label} (${b.dosesLeft})`]), sel.batch, x => {sel.batch = x;}, 'batch'),
                    select('Sample', v.samples.map(x => [x.id, x.claim]), sel.sample, x => {sel.sample = x;}, 'sample'));
                button('Add the sample to a glass and drink', {type: 'drink', batchId: sel.batch, sampleId: sel.sample}, use, {id: 'drink', why: true});
            }
            if(v.effect) use.append(el('p', `You are ${v.effect.donorName} (${v.effect.kind === 'thin' ? 'thin draught' : 'Polyjuice'}) for about ${v.effect.minutesLeft} more minutes.`, 'hp-note'));
            if(v.condition) use.append(el('p', `Animal features remain, about ${v.condition.daysLeft} days.`, 'hp-note'));
            parts.push(use);
            // Public records supplied by the shared experiment/method helpers.
            const entries = v.experiments.entries;
            if(entries.length) {
                const notebook = el('details'); notebook.dataset.hpNotebook = ''; notebook.open = sel.notesOpen; notebook.ontoggle = () => {sel.notesOpen = notebook.open;};
                notebook.append(el('summary', `Observed trials · ${entries.length}`));
                const routeLabel = route => ({assay: 'Assay', oral: 'Drinking', examination: 'Scouring test'})[route] ?? route;
                const rows = entries.map((e, i) => [String(i), `Trial ${i + 1} · ${routeLabel(e.observation?.route ?? 'unknown')}`]);
                const before = sel.before || String(Math.max(0, entries.length - 2)), after = sel.after || String(entries.length - 1);
                notebook.append(select('Earlier trial', rows, before, x => {sel.before = x;}, 'compare-before'),
                    select('Later trial', rows, after, x => {sel.after = x;}, 'compare-after'));
                if(entries[before] && entries[after]) {
                    const a = entries[before], b = entries[after], comparison = compareTrials(a, b);
                    const meaning = field => field === 'inputs' ? 'selected material amounts' : field === 'process' ? 'process' : field === 'law' ? 'world method'
                        : field.startsWith('preparation.') ? `${slotName(field.slice('preparation.'.length))} preparation`
                        : field.startsWith('conditions.') ? ({cauldron: 'cauldron condition', residue: 'cauldron residue', playedMinutes: 'played duration', targetCondition: 'test target condition', targetResidue: 'test target residue'})[field.slice('conditions.'.length)] ?? 'known method conditions'
                        : field.startsWith('observation.') ? 'observation route or recipient baseline' : 'known setup';
                    notebook.append(el('p', `Earlier: ${a.observation?.response ?? 'No detailed response retained.'}`), el('p', `Later: ${b.observation?.response ?? 'No detailed response retained.'}`),
                        el('p', `Known changes: ${[...new Set(comparison.changed.map(x => meaning(x.field)))].join(', ') || 'none recorded'}.`, 'hp-note'));
                    if(comparison.unknown.length) notebook.append(el('p', `Unknown comparisons: ${[...new Set(comparison.unknown.map(meaning))].join(', ')}.`, 'hp-note'));
                    if(comparison.confounders.length) notebook.append(el('p', `Other differences: ${comparison.confounders.join('; ')}.`, 'hp-note'));
                    notebook.append(el('p', comparison.uncertainty, 'hp-note'));
                }
                parts.push(notebook);
            }
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
