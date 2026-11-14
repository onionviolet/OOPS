import {definePanel} from './panel_kit.js';
import {renderMethodEditor} from './method_editor.js';
import {ANTIDOTE_OPERATIONS, ANTIDOTE_STEP_LIMIT} from './hp_potion_reactions.js';
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
    const heading = el('h2'), body = el('div');
    panel.append(heading, body);
    const sel = {ingredient: '', route: '', prepared: false, slots: {}, batch: '', sample: '', method: HP_PROCESS.id, materialInputs: [], choiceId: '', methodId: '', repeatMode: 'quick', before: '', after: '', samplesOpen: false, methodsOpen: false, notesOpen: false, assessmentOpen: false};
    let signature = '', notice = '';
    let antidoteBinder = '0', antidoteMethod = 'warm';
    let potionSubject = '';
    let antidoteSteps = [], antidoteCatalyst = false;
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
        + `${l.claim ? ` · ${l.claim}` : ''}${l.provenance && l.provenance !== 'unknown' ? ` · ${l.provenance === 'full_moon' ? 'known full-moon pick' : 'known not full-moon'}` : ''}${l.freshnessText ? ` · ${l.freshnessText}` : ''}${l.stewedKnown ? ` · stewed ${l.stewedKnown}` : ''}${l.preparation ? ` · ${l.preparation.means.laborCoins} coins paid for preparation` : ''}`;

    function renderWorking(working) {
        const place = section('Worktable', el('p', 'Choose local stock, measure your portions and put the operations in order. Supply times and the trial formulas are original.'));
        const work = (label, action, fields = {}, id = action) => button(label, {type: 'potionWorking', action, ...fields}, place, {id: `working-${id}`});
        if(working.working) place.append(el('p', `Work underway · ${working.working.minutes} minutes left.`));
        for(const source of working.sources) work(`${source.label} · ${source.minutes} min`, 'source', {material: source.material}, `source-${source.material}`);
        if(working.eggSite) {
            const eggActions = {
                fire: ['Light the magical hearth', 'fire'], nest: ['Collect the hot egg', 'collect'],
                hot: ['Have the egg frozen', 'freeze'], missed: ['Clear the spent nest', 'clear'], scorched: ['Discard the scorched egg', 'clear'],
            };
            const [caption, action] = eggActions[working.egg ?? 'fire'] ?? [];
            if(action && working.egg !== 'fire') work(caption, action);
            else if(working.egg) place.append(el('p', 'Watch the hearth until the Ashwinder lays its egg.'));
        }
        for(const row of working.materials) {
            place.append(el('p', `${row.name}: ${row.count} held · ${row.measured} measured`));
            if(row.measured < row.count) work(`Measure one ${row.name.toLowerCase()}`, 'measure', {material: row.id, quantity: row.measured + 1}, `measure-${row.id}`);
            if(row.measured) work(`Return one ${row.name.toLowerCase()}`, 'measure', {material: row.id, quantity: row.measured - 1}, `return-${row.id}`);
        }
        for(const row of working.operations) work(row.label, 'append', {operation: row.id, level: row.levels[0]}, `append-${row.id}`);
        if(working.steps.length) place.append(el('p', working.steps.map(({op}) => working.operations.find(row => row.id === op).label).join(' → ')));
        work('Clear the slate', 'reset');
        work('Brew this working', 'brew');
        if(working.separation) {
            const {fee, portion, residue, cloth, drainMinutes, defaultMesh, meshes} = working.separation;
            for(const [mesh, {label}] of meshes) {
                work(`Press one balm leaf · ${label} · ${fee} coin, mixing water included`, 'separate',
                    {mesh}, mesh === defaultMesh ? 'separate' : `separate-${mesh}`);
            }
            if(portion) {
                const meshLabel = meshes.find(([id]) => id === (portion.mesh ?? defaultMesh))?.[1].label;
                place.append(el('p', `Leaf ${portion.id} · ${meshLabel}: ${portion.liquidMass} parts extract (${portion.liquidUsed ? 'used' : 'held'}), ${portion.drained ? portion.fibre : portion.solidMass} parts cake (${portion.solidsUsed ? 'used' : 'held'}).`));
                place.append(el('p', residue ? `${residue} parts of plant residue remain on the press.` : 'The press is clean.'));
                if(portion.drained) place.append(el('p', `${portion.retainedLiquid} parts drained into the waste tray.`));
                if(!portion.solidsUsed) {
                    work('Wipe the press with the cake', 'wipe-press');
                    if(portion.retainedLiquid && !portion.drained) work(`Drain the cake into the waste tray · ${drainMinutes} min`, 'drain-cake');
                } else if(residue) work(`Wipe with a clean cloth · ${cloth.fee} coin`, 'wipe-cloth');
            }
        }
        if(working.lining) {
            const {film, balance, lastWash, waterMeasures, washMinutes} = working.lining;
            const vessel = section('Lined cauldron', el('p', film ? `Blue tracer in the lining: ${film} parts.` : 'The lining is clear.'));
            if(balance.added) vessel.append(el('p', `Blue tracer: ${balance.added} parts added · ${balance.held} bottled · ${film} in the lining · ${balance.washed} in wash jars · ${balance.used} used.`));
            if(lastWash) vessel.append(el('p', `Wash jar ${lastWash.serial}: ${lastWash.parts} parts of blue tracer in ${lastWash.volume} parts of rinse liquid.`));
            if(film) button(`Rinse the lining · ${waterMeasures} water, ${washMinutes} min`, {type:'potionWorking', action:'wash-lining'}, vessel, {id:'working-wash-lining'});
            place.append(vessel);
        }
        for(const method of working.methods) {
            const text = method.steps.map(({op}) => working.operations.find(row => row.id === op).label).join(' → ');
            work(`Recall ${text}`, 'recall', {method: method.id}, 'recall');
        }
        if(working.skinTrial) work('Note mild skin irritation', 'sore-skin');
        if(working.subjects.length && working.bottles.length) {
            place.append(select('Object of attention for an oral trial', working.subjects.map(subject => [subject, subject]),
                potionSubject, value => {potionSubject = value;}, 'working-subject'));
        }
        for(const bottle of working.bottles) {
            place.append(el('p', bottle.label));
            if(working.lining) {
                work('Inspect for blue tracer', 'inspect-trace', {bottle: bottle.id}, `inspect-${bottle.id}`);
                if(bottle.trace != null) place.append(el('p', bottle.trace
                    ? `Blue tracer in the bottle: ${bottle.trace} ${bottle.trace === 1 ? 'part' : 'parts'}.${bottle.released ? ` The lining released ${bottle.released} during brewing.` : ''}`
                    : 'No blue tracer in this bottle.'));
            }
            const captions = {oral: 'Drink', topical: 'Apply to your skin', assay: 'Test the flow'};
            for(const route of working.routes) work(captions[route], 'dose', {bottle: bottle.id, route, subject: potionSubject}, `dose-${route}`);
        }
        for(const effect of working.effects) place.append(el('p', `${effect.label}${effect.subject ? ` · ${effect.subject}` : ''} · ${effect.minutes} minutes remaining`));
        return place;
    }

    function render() {
        if(!panel.isConnected) return;
        const v = read(), key = JSON.stringify([v, sel, notice]);
        if(key === signature) return; signature = key;
        const parts = [];
        heading.textContent = v.potionWorkings?.title ?? 'Polyjuice bench';
        const status = el('p', notice, 'hp-notice');
        status.setAttribute('role', 'status');
        if(v.potionWorkings) parts.push(status, renderWorking(v.potionWorkings));
        if(v.potionWorkings?.skinTrial) {
            body.replaceChildren(...parts);
            return;
        }
        parts.push(el('p', 'The Polyjuice method comes from Chamber of Secrets. The other bench experiments and their measurements are original.'));
        if(!v.begun) {
            const intro = section('Begin', el('p', v.waiting ? 'The game clock is not ready yet.' : 'Set up a small bench, a purse of slice coins and three classmates who might lend a sample. Lots, prices and consequences are original proposals around the sourced formula.'));
            button('Set up the Polyjuice bench', {type: 'begin'}, intro, {id: 'begin'}); parts.push(intro);
        } else {
            parts.push(el('p', `Purse ${v.purse} coins · moon: ${v.moon ?? 'unknown'} · cauldron ${v.cauldron.condition}, ${v.cauldron.residue}${v.cauldron.brewing ? `, ${v.cauldron.activity} (${v.cauldron.readyInMinutes < 60 ? `${v.cauldron.readyInMinutes} min` : `${v.cauldron.readyInHours} h`} left)` : ''} · Potions master: ${v.master}`, 'hp-status'));
            if(v.cauldron.brewing) {
                const work = section('Current cauldron work', el('p', `${v.cauldron.activity}: ${v.cauldron.readyInMinutes} played minutes remaining. Reviewing ingredients does not change this batch. Use the batch controls below when it is ready.`));
                work.dataset.hpWork = ''; parts.push(work);
            }
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
            if(v.fluxweedBed) {
                obtain.append(el('p', v.fluxweedBed.minutesLeft ? `Fluxweed bed · about ${Math.ceil(v.fluxweedBed.minutesLeft / 60)} hours to new growth.` : 'Fluxweed bed · ready to pick.'));
                button('Pick fluxweed from the bed', {type: 'pickFluxweed'}, obtain, {id: 'pick-fluxweed'});
            }
            parts.push(obtain);
            // 2. Stock and preparation
            const stock = section('2. Prepare and stew');
            if(!v.lots.length) stock.append(el('p', 'You hold no lots.'));
            for(const l of v.lots) {
                const row = el('div', null, 'hp-row'); row.dataset.hpLot = l.id; row.append(el('span', lotLine(l)));
                if(l.ingredient === 'book.hp.ing.fluxweed' && !v.fluxweedBed)
                    button('Plant this clipping · one day to grow', {type: 'plantFluxweed', lotId: l.id}, row, {id: 'plant-fluxweed'});
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
                if(selected) for(const fact of selected.evidence.uncertainConditions) brew.append(el('p', fact.reason || 'Nobody has tried this mix yet, so the result is unknown.', 'hp-note'));
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
            if(sel.method === HP_PROCESS.id) {
                button('Concentrate · two days and one hour · two doses', {...brewRequest, finish: 'concentrated'}, brew, {id: 'brew-concentrated', why: true});
            }
            const brewingMethods = v.methods.filter(m => m.request.type === 'brew');
            if(brewingMethods.length) {
                const repeat = el('details'); repeat.dataset.hpMethods = ''; repeat.open = sel.methodsOpen; repeat.ontoggle = () => {sel.methodsOpen = repeat.open;};
                repeat.append(el('summary', `Demonstrated methods · ${brewingMethods.length}`),
                    el('p', 'Choose current held inputs above. Repeat checks the observed preparation and apparatus; it does not restore spent ingredients or prove unmeasured tolerances.', 'hp-note'),
                    select('Demonstrated method', brewingMethods.map((m, i) => [m.id, `Method ${i + 1} · ${m.request.method === ABRASIVE.ref ? 'original suspension' : m.request.finish ? 'concentrated Polyjuice' : 'pinned potion'} · ${m.setup.inputs.map(x => `${HP.ingredients.find(i => i.id === x.material)?.label ?? x.material} ×${x.qty}`).join(', ')}`]), sel.methodId, x => {sel.methodId = x;}, 'demonstrated-method'),
                    select('Making depth', [['quick', 'Quick · repeat known conditions'], ['guided', 'Guided review'], ['deep', 'Deep review']], sel.repeatMode, x => {sel.repeatMode = x || 'quick';}, 'repeat-mode'));
                if(sel.methodId) {
                    const demonstrated = brewingMethods.find(method => method.id === sel.methodId)?.request;
                    const request = {...brewRequest, finish: demonstrated?.finish, repeatMethodId: sel.methodId, repeatMode: sel.repeatMode};
                    const preview = quote(request);
                    if(preview.eligible) repeat.append(el('p', preview.summary, 'hp-note'));
                    button('Repeat with selected current inputs', request, repeat, {id: 'repeat', why: true});
                }
                brew.append(repeat);
            }
            button(`Scour cauldron (${HP.rules.scourCost})`, {type: 'scour'}, brew, {id: 'scour'});
            parts.push(brew);
            const classWork = section('Draught of Living Death',
                el('p', 'Class exercise: prepare the bean with the supplied blade, stir the flask, then hand it in for a colour assessment.'));
            if(v.draught) {
                classWork.append(el('p', `After adding juice: ${v.draught.afterAddition}. After stirring: ${v.draught.afterStirring}. Strokes: ${v.draught.strokes.length}.`));
                button('Stir counterclockwise', {type: 'stirDraught', direction: 'L'}, classWork, {id: 'draught-left'});
                button('Stir clockwise', {type: 'stirDraught', direction: 'R'}, classWork, {id: 'draught-right'});
                button('Hand in flask', {type: 'submitDraught'}, classWork, {id: 'draught-submit'});
            } else {
                button(`Crush the bean and add juice · ${v.draughtFee} coins`, {type: 'startDraught', preparation: 'crush'}, classWork, {id: 'draught-crush'});
                button(`Slice the bean and add juice · ${v.draughtFee} coins`, {type: 'startDraught', preparation: 'slice'}, classWork, {id: 'draught-slice'});
            }
            parts.push(classWork);
            const antidote = section('Blended-antidote assay',
                el('p', 'Each test uses two stock remedies. Choose a binder amount and how to mix it, then test one dose in a phial.'));
            if(v.antidotePhial) {
                const {a, b, blend} = v.antidotePhial;
                antidote.append(el('p', `Treated phial still holds: first ${a}, second ${b}, blended ${blend}.`));
            }
            if(v.antidote) {
                button('Test dose in a fresh phial', {type: 'assayAntidote'}, antidote, {id: 'assay-antidote'});
                if(v.antidotePhial) button('Add dose to the treated phial', {type: 'assayAntidote', reusePhial: true}, antidote, {id: 'retreat-antidote'});
            }
            else {
                antidote.append(select('Binder and total cost', v.antidotePrices.map(([n, cost]) => [String(n), `${n} binder · ${cost} coins`]),
                    antidoteBinder, value => {antidoteBinder = value || '0';}, 'antidote-binder'));
                const conditions = [['warm', 'Warm mix'], ['heated', 'Heat the binder first'], ['cool', 'Cool mix'], ['catalysed', 'Cool mix with the catalyst stone']];
                antidote.append(select('Mixing conditions', conditions, antidoteMethod, value => {antidoteMethod = value || 'warm';}, 'antidote-method'));
                button('Mix one test dose', {type: 'mixAntidote', binder: Number(antidoteBinder), method: antidoteMethod}, antidote, {id: 'mix-antidote'});
                const editor = section('Compose a method');
                editor.append(renderMethodEditor({element: el, operations: ANTIDOTE_OPERATIONS, steps: antidoteSteps, limit: ANTIDOTE_STEP_LIMIT,
                    change: next => {antidoteSteps = next; signature = ''; render();}}));
                const catalyst = el('label', ' Use the catalyst stone'), stone = el('input');
                stone.type = 'checkbox'; stone.checked = antidoteCatalyst;
                stone.onchange = () => {antidoteCatalyst = stone.checked; signature = ''; render();};
                catalyst.prepend(stone); editor.append(catalyst);
                button('Mix your method', {type: 'mixAntidote', binder: Number(antidoteBinder), method: 'composed',
                    steps: antidoteSteps, catalyst: antidoteCatalyst}, editor, {id: 'compose-antidote'});
                antidote.append(editor);
                for(const {id, request} of v.methods.filter(m => m.request.type === 'mixAntidote')) {
                    const cost = v.antidotePrices.find(([binder]) => binder === request.binder)?.[1];
                    const name = request.method === 'composed'
                        ? request.steps.map(step => ANTIDOTE_OPERATIONS[step].label).join(', ') + (request.catalyst ? ' with catalyst' : '')
                        : conditions.find(([method]) => method === request.method)?.[1];
                    button(`Repeat: ${name}, ${request.binder} binder · ${cost} coins`, {type: 'mixAntidote', repeatMethodId: id}, antidote, {id: 'repeat-antidote'});
                }
            }
            parts.push(antidote);
            const practice = v.companionPotions;
            const materials = section('Ingredient practice', el('p', 'Exercise fees, clocks and amounts are original. Use the same amount of chalk in both glasses.'));
            for(const [mucus, name] of [[0, 'Plain chalk'], [1, 'Chalk with Flobberworm mucus']]) {
                const glass = practice.glasses.find(row => row.mucus === mucus);
                if(glass) {
                    materials.append(el('p', `${name}: about ${glass.suspended}% of the chalk is still suspended. Estimated stirring effort: ${glass.stirEffort}.`));
                    button(`Empty ${name.toLowerCase()}`, {type: 'companionEmpty', mucus}, materials, {id: `companion-empty-${mucus}`});
                } else button(`Mix ${name.toLowerCase()} · ${1 + mucus} coin${mucus ? 's' : ''}`, {type: 'companionSuspend', mucus}, materials, {id: `companion-mix-${mucus}`});
            }
            const eggNotes = {
                fire: 'The magical fire is burning.', nesting: 'An Ashwinder has left the fire to nest.',
                nest: 'A hot egg is in the nest.', hot: 'You hold a hot egg.', frozen: 'You hold one frozen egg.',
                scorched: 'The egg has scorched.', missed: 'The egg in the nest has scorched.',
            };
            if(practice.stage) materials.append(el('p', eggNotes[practice.stage] + (practice.minutes == null ? '' : ` Next change in ${practice.minutes} min.`)));
            if(practice.ashwinderMinutes) materials.append(el('p', `The Ashwinder has about ${practice.ashwinderMinutes} min left.`));
            if(!practice.stage) button('Light a supervised magical fire · 2 coins', {type: 'companionFire'}, materials, {id: 'companion-fire'});
            if(practice.stage === 'nest') button('Collect the hot egg with tongs', {type: 'companionCollect'}, materials, {id: 'companion-collect'});
            if(practice.stage === 'hot') button('Ask the instructor to freeze the egg', {type: 'companionFreeze'}, materials, {id: 'companion-freeze'});
            if(['frozen', 'scorched', 'missed'].includes(practice.stage))
                button(practice.stage === 'frozen' ? 'Discard the frozen egg' : 'Clear the spent exercise', {type: 'companionClear'}, materials, {id: 'companion-clear'});
            materials.append(el('p', practice.patient ? `Teaching case: ${practice.patient}.` : 'Choose a teaching case to compare with a healthy baseline.'));
            if(!practice.patient) {
                button('Study Alihotsy exposure', {type: 'companionPatient', condition: 'hysteria'}, materials, {id: 'companion-hysteria'});
                button('Study ague', {type: 'companionPatient', condition: 'ague'}, materials, {id: 'companion-ague'});
            }
            for(const {id, label, cost} of practice.remedies) {
                button(`Give one serving of ${label}${cost ? ` · ${cost} coins` : ''}`,
                    {type: 'companionTreat', remedy: id}, materials, {id: `companion-${id}`});
            }
            parts.push(materials);
            // 5. Batches and use
            const use = section('5. Use or measure a batch');
            if(!v.batches.length) use.append(el('p', 'Nothing has finished simmering.'));
            for(const b of v.batches) {
                const row = el('div', null, 'hp-row'); row.dataset.hpBatch = b.id; row.append(el('span', `${b.label} [${b.id}] · ${b.dosesLeft} dose${b.dosesLeft === 1 ? '' : 's'} · ${b.custody === 'bench' ? 'stored at bench' : 'carried'} · ${b.cue}`));
                if(b.custody !== 'bench') button(`Assay (${HP.rules.assayCost})`, {type: 'assay', batchId: b.id}, row, {id: 'assay-batch'});
                if(b.retainedHistory) {
                    if(b.custody !== 'bench') {
                    button('Test one dose on cauldron residue', {type: 'treatCauldron', batchId: b.id}, row, {id: 'treat-cauldron', why: true});
                    if(b.suspension) button('Stir and test one dose', {type: 'treatCauldron', batchId: b.id, stir: true}, row, {id: 'stir-and-treat', why: true});
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
            if(v.condition?.stage) {
                const box = el('div'); box.dataset.hpCondition = '';
                box.append(el('p', `Animal features, stage ${v.condition.stage} of ${v.condition.stages}: ${v.condition.text} Next check in about ${v.condition.nextCheckDays} days${v.condition.care ? ', in the hospital wing' : ''}.`, 'hp-note'));
                if(!v.condition.care) button('Check into the hospital wing', {type: 'seekCare'}, box, {id: 'seek-care'});
                use.append(box);
            } else if(v.condition) use.append(el('p', `Animal features remain, about ${v.condition.daysLeft} days.`, 'hp-note'));
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
        if(!v.potionWorkings) parts.push(status);
        body.replaceChildren(...parts);
    }
    definePanel({id: 'hp-polyjuice', title: 'Potioneering', role: 'actions', node: panel, home: document.getElementById('main_content'), defaultDock: 'center',
        discovered: () => true, eligible: () => true, unavailableReason: () => 'The Polyjuice slice is not available.'});
    render(); return {render};
}
