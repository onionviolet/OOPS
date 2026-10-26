// Polyjuice slice (book.hp pack): pure state and rules. No DOM, no clock, no storage.
// Truth (lot provenance, sample species, grade) is stored apart from knowledge (claims,
// witnessed facts, assay results); view() is the only projection and never reads truth for
// an unassayed, unwitnessed thing (MR1, MR31). Preview consumes nothing: quote() runs the
// real action on a copy (MR4). Draws are keyed by a saved root and a saved serial (GR, MR2).
import {packNative} from './world_pack_registry.js';
import {drawU32} from './gen_kit.js';
import {HP_PROCESS} from './hp_brewing_formula.js';

const PACK = packNative('book.hp');
export const HP = Object.freeze({rules: PACK.rules, formula: PACK.formula, outcomes: PACK.outcomes, routes: PACK.routes, ingredients: PACK.ingredients, variants: PACK.variants, evidence: PACK.evidence});
const R = PACK.rules, F = PACK.formula;
const ING = Object.fromEntries(PACK.ingredients.map(i => [i.id, i]));
const ROUTE = Object.fromEntries(PACK.routes.map(r => [r.id, r]));
const VARIANT = Object.fromEntries(PACK.variants.map(v => [v.id, v]));
export const HP_SLICE_ID = 'hp_brewing';
export const SCHEMA = 1;
const LEDGER_CAP = 64;
const fail = message => { throw new Error(message); };
const clone = value => structuredClone(value);
const int = n => Number.isSafeInteger(n);
const label = id => ING[id]?.label ?? id;
const draw = (s, key) => drawU32(s.root, `hp:${key}`);
const chance = (s, key, permille) => draw(s, key) % 1000 < permille;
const pick = (s, key, list) => list[draw(s, key) % list.length];

export function begin({seed, now}) {
    if(!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff || !int(now)) fail('A slice starts from a saved seed and the played clock.');
    const s = {schema: SCHEMA, packRevision: 1, root: seed, begunAt: now, now, purse: R.startPurse, serial: 0, seq: 0,
        store: Object.fromEntries(PACK.ingredients.filter(i => i.store === 'student').map(i => [i.id, R.storeStock])),
        lots: {}, samples: {}, donors: {}, debts: [], notices: [], master: {standing: 0},
        cauldron: {condition: R.cauldronStart, brew: null}, batches: {}, effect: null, condition: null, harvestAt: null, ledger: []};
    const used = new Set();
    for(let i = 0; i < R.donors; i++) {
        let name;
        for(let n = 0; ; n++) {
            name = `${pick(s, `donor:${i}:${n}:g`, PACK.donorNames.given)} ${pick(s, `donor:${i}:${n}:f`, PACK.donorNames.family)}`;
            if(!used.has(name)) break;
        }
        used.add(name);
        s.donors[`d${i + 1}`] = {id: `d${i + 1}`, name, standing: 0, askedAt: null};
    }
    return s;
}

const log = (s, now, kind, text) => { s.ledger.push({id: ++s.seq, at: now, kind, text}); if(s.ledger.length > LEDGER_CAP) s.ledger.splice(0, s.ledger.length - LEDGER_CAP); };
const nextLot = (s, prefix) => `${prefix}${++s.serial}`;

// Lazy settlement from the played clock: stews, brews, effects, debts and notices.
export function settle(s, now) {
    if(!int(now)) fail('Settlement needs the played clock.');
    if(now < s.now) return s;
    if(s.cauldron.brew) checkPending(s.cauldron.brew, s);
    for(const lot of Object.values(s.lots)) if(lot.stew && now - lot.stew.startedAt >= F.slots[0].minStewMinutes) {
        const doneAt = lot.stew.startedAt + F.slots[0].minStewMinutes;
        lot.form = 'stewed'; lot.stew = null; lot.truth.stewedMinutes = F.slots[0].minStewMinutes; lot.known.stewed = true;
        log(s, doneAt, 'stew', 'A pot of lacewing flies has stewed the full twenty-one days.');
    }
    const brew = s.cauldron.brew;
    if(brew && now >= brew.readyAt) {
        const id = `b${brew.id}`;
        s.batches[id] = {id, cohortId: id, custody: 'carried', readyAt: brew.readyAt, grade: brew.grade, history: clone(brew.history), doses: brew.history.producedDoses, dosesLeft: brew.history.producedDoses, known: {identified: false, assayed: false}};
        s.cauldron.brew = null;
        log(s, brew.readyAt, 'brew', 'The cauldron has finished simmering.');
    }
    const fx = s.effect;
    if(fx && now >= fx.endsAt) {
        if(fx.discovered) {
            s.donors[fx.donorId].standing -= R.discoverStandingLoss;
            log(s, fx.endsAt, 'aftermath', `Word got back to ${s.donors[fx.donorId].name} that someone wore their face. They trust you less.`);
        } else if(fx.kind === 'transform' || fx.kind === 'thin') log(s, fx.endsAt, 'aftermath', 'The change wore off. Nobody connected it to you.');
        s.effect = null;
    }
    if(s.condition && now >= s.condition.until) { log(s, s.condition.until, 'aftermath', 'The animal features cleared at last.'); s.condition = null; }
    for(const d of s.debts) if(d.status === 'open' && now >= d.dueAt) {
        d.status = 'overdue'; s.master.standing -= R.overdueStandingLoss;
        log(s, d.dueAt, 'debt', `The loan of ${label(d.ingredient)} was not repaid in time. The Potions master remembers.`);
    }
    for(const n of s.notices) if(!n.done && now >= n.at) {
        n.done = true;
        if(n.noticed) { s.master.standing -= R.noticeStandingLoss; log(s, n.at, 'notice', `The Potions master noticed ${label(n.ingredient)} missing from the private stores and has marked you down.`); }
    }
    s.now = now;
    return s;
}

const slotGrade = (slot, lot) => {
    if(!lot || lot.ingredient !== slot.ingredient || lot.form !== slot.form) return 'bad';
    if(slot.id === 'lacewing') return lot.truth.stewedMinutes >= slot.minStewMinutes ? 'ok' : lot.truth.stewedMinutes >= slot.nearStewMinutes ? 'near' : 'bad';
    if(slot.provenance) return lot.truth.provenance === slot.provenance ? 'ok' : 'bad';
    if(lot.variant) return VARIANT[lot.variant].gradePermille >= 1000 ? 'ok' : 'near';
    return 'ok';
};
// MR7, MR35: exact formula is the canon product, a near miss is degraded, anything else is original.
export function resolveBrew(lots, condition) {
    const rows = F.slots.map(slot => ({slot: slot.id, grade: slotGrade(slot, lots[slot.id])}));
    const bad = rows.filter(r => r.grade === 'bad').length, near = rows.filter(r => r.grade === 'near').length;
    const wear = condition >= R.cauldronOkFrom ? 0 : condition >= R.cauldronBadBelow ? 1 : 2;
    const grade = bad === 0 && near + wear === 0 ? 'canon' : bad === 0 && near + wear <= 2 ? 'degraded' : 'original';
    return {grade, rows, wear};
}

const need = (ok, why) => { if(!ok) fail(why); };
const lotOf = (s, id) => s.lots[id] ?? fail('Choose a lot you hold.');
const spend = (s, n) => { need(n <= s.purse, `That costs ${n} coins and you hold ${s.purse}.`); s.purse -= n; };
// Retained paid terms, not a second clock or native lot authority. Legacy completed
// batches stay usable; unknown consumed history is never reconstructed from grade.
function checkHistory(h) {
    need(h && h.revision === 1 && h.process === HP_PROCESS.id && h.clock === 'played-calendar', 'Unsupported retained HP process terms. Keep the saved brew for supported recovery.');
    need(int(h.startedAt) && h.startedAt >= 0 && int(h.minutes) && h.minutes > 0 && int(h.readyAt) && h.readyAt === h.startedAt + h.minutes, 'Malformed retained HP deadline.');
    need(int(h.producedDoses) && h.producedDoses > 0 && int(h.cauldronCondition) && h.cauldronCondition >= 0 && h.cauldronCondition <= R.cauldronStart, 'Malformed retained HP yield or apparatus.');
    need(h.resolution && ['canon', 'degraded', 'original'].includes(h.resolution.grade), 'Missing retained HP resolution.');
    need(Array.isArray(h.inputs) && h.inputs.length > 0 && h.inputs.length <= F.slots.length, 'Missing paid HP input history.');
    const slots = new Set(), ids = new Set();
    for(const {slot, lot} of h.inputs) {
        need(F.slots.some(x => x.id === slot) && !slots.has(slot) && lot && typeof lot.id === 'string' && !ids.has(lot.id), 'Duplicate or malformed paid HP input.');
        slots.add(slot); ids.add(lot.id);
        need(ING[lot.ingredient]?.forms.includes(lot.form) && int(lot.acquiredAt) && lot.acquiredAt >= 0 && lot.acquiredAt <= h.startedAt && !lot.stew && lot.truth && lot.known, 'Malformed paid HP lot history.');
    }
    return h;
}
function checkPending(b, s) {
    const h = checkHistory(b.history);
    need(int(b.id) && b.id > 0 && b.startedAt === h.startedAt && b.readyAt === h.readyAt && b.grade === h.resolution.grade, 'Pending HP brew disagrees with retained terms.');
    need(!s.batches[`b${b.id}`] && h.inputs.every(({lot}) => !s.lots[lot.id]), 'Pending HP custody duplicates paid contents.');
}
const batchOf = (s, id) => s.batches[id] ?? fail('Choose a batch you hold.');
const carried = b => need((b.custody ?? 'carried') === 'carried', 'Retrieve this portion from the bench before using it.');
const retained = b => { need(b.cohortId && b.history, 'This older batch has no retained cohort history for pouring.'); checkHistory(b.history); };

function newLot(s, now, ingredient, route, extra) {
    const id = nextLot(s, 'L');
    s.lots[id] = {id, ingredient, form: 'raw', variant: null, route: route.id, custody: route.custody === 'school' ? 'owned' : route.custody, acquiredAt: now,
        claim: null, truth: {provenance: null, stewedMinutes: 0}, known: {provenance: 'unknown', assayed: false, stewed: false}, stew: null, ...extra};
    return s.lots[id];
}

// One entry point; returns a summary. Mutates s (callers pass a copy to preview).
export function act(s, ctx, req) {
    settle(s, ctx.now);
    const now = ctx.now;
    switch(req?.type) {
    case 'acquire': {
        const route = ROUTE[req.route] ?? fail('Choose a route.'), ing = req.ingredient;
        need(ING[ing] && Object.hasOwn(route.cost, ing), `This route does not offer ${label(ing)}.`);
        let lot;
        if(route.kind === 'store') {
            need(s.store[ing] > 0, `The cupboard has no more ${label(ing)}.`);
            s.store[ing]--;
            lot = newLot(s, now, ing, route);
            if(ing === 'book.hp.ing.fluxweed') lot.truth.provenance = chance(s, `lot:${s.serial}:prov`, R.storeFluxweedOkPermille) ? 'full_moon' : 'other';
            lot.claim = 'Taken from the student store-cupboard.';
        } else if(route.kind === 'supplier') {
            const prepared = req.prepared === true;
            need(!prepared || ing === 'book.hp.ing.lacewing_flies' && route.preparedStewedLacewing, 'This supplier has no ready-prepared lot of that.');
            spend(s, prepared ? route.preparedStewedLacewing : route.cost[ing]);
            lot = newLot(s, now, ing, route);
            if(ing === 'book.hp.ing.fluxweed') { lot.truth.provenance = chance(s, `lot:${s.serial}:prov`, route.fluxweedOkPermille) ? 'full_moon' : 'other'; lot.claim = 'Sold as picked at the full moon.'; }
            if(prepared) { lot.form = 'stewed'; lot.truth.stewedMinutes = chance(s, `lot:${s.serial}:stew`, R.preparedStewOkPermille) ? F.slots[0].minStewMinutes : F.slots[0].nearStewMinutes; lot.claim = 'Sold as stewed twenty-one days.'; }
        } else if(route.kind === 'loan') {
            need(s.master.standing >= -1, 'The Potions master will not lend to you now.');
            need(s.debts.filter(d => d.status === 'open').length < 2, 'Settle an open loan before asking again.');
            lot = newLot(s, now, ing, route);
            s.debts.push({id: lot.id, ingredient: ing, dueAt: now + R.loanDueMinutes, repay: R.loanRepay[ing], status: 'open'});
            lot.claim = 'On loan from the private stores.';
        } else if(route.kind === 'unlicensed') {
            lot = newLot(s, now, ing, route);
            s.notices.push({id: lot.id, ingredient: ing, at: now + R.noticeAfterMinutes, noticed: chance(s, `lot:${s.serial}:notice`, R.noticePermille), done: false});
            lot.claim = 'Taken from the private stores without leave.';
        } else if(route.kind === 'harvest') {
            need(ing === 'book.hp.ing.fluxweed', 'Only fluxweed grows here.');
            need(s.harvestAt === null || now - s.harvestAt >= R.harvestCooldownMinutes, 'The patch has not regrown.');
            need(typeof ctx.moon === 'string', 'The sky cannot be read right now.');
            s.harvestAt = now;
            lot = newLot(s, now, ing, route);
            lot.truth.provenance = ctx.moon === R.moonFull ? 'full_moon' : 'other';
            lot.known.provenance = lot.truth.provenance; lot.claim = `Gathered by you under the ${ctx.moon.toLowerCase()} moon.`;
        } else fail('Unsupported route.');
        return `Obtained ${label(ing)}${req.prepared ? ' (ready-stewed)' : ''}.`;
    }
    case 'prepare': {
        const lot = lotOf(s, req.lotId), variant = VARIANT[req.variant] ?? fail('Choose a preparation.');
        need(lot.form === 'raw' && !lot.stew, 'Only a raw lot can be prepared.');
        need(ING[lot.ingredient].forms.includes(variant.makes), `${label(lot.ingredient)} cannot be made ${variant.makes}.`);
        lot.form = variant.makes; lot.variant = variant.id;
        return `${label(lot.ingredient)} is now ${variant.label.toLowerCase()}.`;
    }
    case 'stew': {
        const lot = lotOf(s, req.lotId);
        need(lot.ingredient === 'book.hp.ing.lacewing_flies' && lot.form === 'raw' && !lot.stew, 'Only raw lacewing flies are stewed.');
        need(Object.values(s.lots).filter(l => l.stew).length < R.stewPotCapacity, 'The stew pot is full.');
        lot.stew = {startedAt: now};
        return 'Lacewing flies are on to stew. The source asks for twenty-one days.';
    }
    case 'removeStew': {
        const lot = lotOf(s, req.lotId);
        need(lot.stew, 'That lot is not stewing.');
        const spent = now - lot.stew.startedAt;
        lot.stew = null; lot.truth.stewedMinutes = spent; lot.known.stewed = spent >= F.slots[0].nearStewMinutes;
        if(spent >= F.slots[0].nearStewMinutes) lot.form = 'stewed';
        return spent >= F.slots[0].nearStewMinutes ? 'Taken off early: stewed, but short of twenty-one days.' : 'Taken off far too early: still raw.';
    }
    case 'sample': {
        const donor = s.donors[req.donorId] ?? fail('Choose a donor.');
        need(req.route === 'ask' || req.route === 'brush', 'Choose how to get the sample.');
        if(req.route === 'ask') {
            need(donor.standing >= R.donorAskMinStanding, `${donor.name} will not oblige you now.`);
            need(donor.askedAt === null || now - donor.askedAt >= R.donorAskCooldownMinutes, `${donor.name} has already helped you recently.`);
            donor.askedAt = now;
        }
        const id = nextLot(s, 'S'), others = Object.keys(s.donors).filter(k => k !== donor.id);
        const mixed = req.route === 'brush' && chance(s, `sample:${s.serial}:mixed`, R.brushMixPermille);
        s.samples[id] = {id, donorId: mixed ? pick(s, `sample:${s.serial}:other`, others) : donor.id, claimDonorId: donor.id, route: req.route, acquiredAt: now,
            truth: {species: req.route === 'brush' && chance(s, `sample:${s.serial}:species`, R.brushCatPermille) ? 'cat' : 'human'},
            known: {assayed: false}, claim: req.route === 'ask' ? `Given freely by ${donor.name}.` : `Hair from ${donor.name}'s brush.`};
        return `Sample obtained: ${s.samples[id].claim}`;
    }
    case 'brew': {
        need(!s.cauldron.brew, 'The cauldron is already simmering.');
        const picked = {}, seen = new Set();
        for(const slot of F.slots) {
            const id = req.slots?.[slot.id];
            if(!id) continue;
            need(!seen.has(id), 'Each lot goes in once.');
            const lot = lotOf(s, id); need(!lot.stew, 'That lot is still stewing.');
            seen.add(id); picked[slot.id] = lot;
        }
        need(seen.size > 0, 'Add at least one lot.');
        const out = resolveBrew(picked, s.cauldron.condition);
        for(const id of seen) delete s.lots[id];
        const history = {revision: 1, process: HP_PROCESS.id, clock: 'played-calendar', startedAt: now, minutes: HP_PROCESS.minutes, readyAt: now + HP_PROCESS.minutes,
            producedDoses: R.doses, cauldronCondition: s.cauldron.condition, inputs: Object.entries(picked).map(([slot, lot]) => ({slot, lot: clone(lot)})), resolution: clone(out)};
        s.cauldron.brew = {id: ++s.seq, startedAt: now, readyAt: history.readyAt, grade: out.grade, history};
        s.cauldron.condition = Math.max(0, s.cauldron.condition - R.cauldronWearPerBrew);
        return 'The cauldron is simmering. It will take two days; the sample goes in at the glass, not here.';
    }
    // ORIGINAL local portion custody. These are existing HP doses, not new
    // bottle items, native chest stock or an inferred recipient inventory.
    case 'splitBatch': {
        const b = batchOf(s, req.batchId); carried(b); retained(b);
        need(int(req.doses) && req.doses > 0 && req.doses <= b.dosesLeft, 'Choose a positive number of remaining doses.');
        const id = nextLot(s, 'a');
        s.batches[id] = {...clone(b), id, doses: req.doses, dosesLeft: req.doses};
        b.doses -= req.doses; b.dosesLeft -= req.doses;
        return `Set aside ${req.doses} dose${req.doses === 1 ? '' : 's'} as a separate portion of the same batch.`;
    }
    case 'mergeBatch': {
        const b = batchOf(s, req.batchId), source = batchOf(s, req.sourceId);
        carried(b); carried(source); retained(b); retained(source);
        need(b.id !== source.id && source.dosesLeft > 0, 'Choose another remaining portion.');
        need(b.cohortId === source.cohortId && b.grade === source.grade && b.readyAt === source.readyAt && JSON.stringify(b.history) === JSON.stringify(source.history), 'These are different batches. Keep their portions separate.');
        b.doses += source.doses; b.dosesLeft += source.dosesLeft;
        b.known.identified ||= source.known.identified; b.known.assayed ||= source.known.assayed;
        delete s.batches[source.id];
        return 'Recombined portions of the same batch; no spent dose was restored.';
    }
    case 'transferBatch': {
        const b = batchOf(s, req.batchId); retained(b);
        need(['carried', 'bench'].includes(req.custody), 'This bench supports carried portions and private bench storage. Recipient and native chest transfers are not connected.');
        need(req.custody !== b.custody, 'That portion is already there.');
        b.custody = req.custody;
        return req.custody === 'bench' ? 'The portion is set aside at your bench. Retrieve it before use.' : 'Retrieved the same portion from your bench.';
    }
    case 'scour': {
        need(!s.cauldron.brew, 'Wait for the cauldron to finish.');
        need(s.cauldron.condition < R.cauldronStart, 'The cauldron is already clean.');
        spend(s, R.scourCost); s.cauldron.condition = R.cauldronStart;
        return 'The cauldron is scoured.';
    }
    case 'assay': {
        spend(s, R.assayCost);
        if(req.sampleId) { const x = s.samples[req.sampleId] ?? fail('Choose a sample.'); x.known.assayed = true; return `Assay: ${x.truth.species} hair, from ${s.donors[x.donorId].name}.`; }
        if(req.batchId) { const b = s.batches[req.batchId] ?? fail('Choose a batch.'); carried(b); b.known.assayed = true; b.known.identified = true; return `Assay: ${HP.outcomes[b.grade].label}.`; }
        const lot = lotOf(s, req.lotId); lot.known.assayed = true;
        if(lot.ingredient === 'book.hp.ing.fluxweed') lot.known.provenance = lot.truth.provenance;
        if(lot.truth.stewedMinutes && lot.form === 'stewed') lot.known.stewed = true;
        return `Assay done on ${label(lot.ingredient)}.`;
    }
    case 'repay': {
        const d = s.debts.find(x => x.id === req.debtId && x.status !== 'repaid') ?? fail('Choose an open loan.');
        spend(s, d.repay); d.status = 'repaid';
        return `Repaid the loan of ${label(d.ingredient)}.`;
    }
    case 'drink': {
        const batch = s.batches[req.batchId] ?? fail('Choose a batch.'), sample = s.samples[req.sampleId] ?? fail('Choose a sample.');
        carried(batch);
        need(batch.dosesLeft > 0, 'That batch is used up.');
        need(!s.effect && !s.condition, 'Wait until the last change and its after-effects are over.');
        const donor = s.donors[sample.donorId];
        batch.dosesLeft--; delete s.samples[sample.id]; batch.known.identified = true;
        if(batch.grade === 'original') { s.effect = {kind: 'nothing', startedAt: now, endsAt: now, donorId: donor.id, discovered: false}; log(s, now, 'drink', 'You drank it. Nothing changed, and the sample was wasted.'); return 'Nothing happened.'; }
        if(sample.truth.species !== 'human') {
            s.condition = {id: 'animal_features', until: now + R.animalRecoveryMinutes};
            s.effect = {kind: 'animal', startedAt: now, endsAt: now, donorId: donor.id, discovered: false};
            log(s, now, 'drink', 'Wrong kind of hair. You came out part animal and the features will take days to clear.');
            return 'The potion took the wrong kind of hair.';
        }
        const kind = batch.grade === 'canon' ? 'transform' : 'thin', minutes = kind === 'transform' ? F.transformMinutes : Math.floor(F.transformMinutes * R.degradedPermille / 1000);
        const discovered = sample.route === 'brush' && chance(s, `drink:${s.seq}:found`, R.discoverPermille);
        s.effect = {kind, startedAt: now, endsAt: now + minutes, donorId: donor.id, discovered};
        log(s, now, 'drink', `You became ${donor.name} for ${kind === 'transform' ? 'an hour' : 'a short while'}.`);
        return `You look and sound like ${donor.name}.`;
    }
    default: fail('Unknown action.');
    }
}

// A preview shows what the observer can already know (MR31): assay and drink would otherwise
// report the hidden result in their summaries before the player commits or pays.
const PREVIEW = {assay: `Pay ${R.assayCost} coins to learn what this really is.`, drink: 'Drink one dose with this sample.'};
export function quote(s, ctx, req) {
    try { const copy = clone(s), summary = act(copy, ctx, req); return {eligible: true, summary: PREVIEW[req.type] ?? summary}; }
    catch(error) { return {eligible: false, reason: error.message}; }
}
export function commit(s, ctx, req) {
    const next = clone(s), summary = act(next, ctx, req);
    return {state: next, summary};
}

// Player-visible projection (MR31): claims and witnessed facts only.
const standingWord = n => n <= -3 ? 'hostile' : n < 0 ? 'cool' : n === 0 ? 'neutral' : 'warm';
export function view(s, ctx) {
    if(!s) return {begun: false};
    const t = clone(s); settle(t, ctx.now);
    const lotView = l => ({id: l.id, name: label(l.ingredient), ingredient: l.ingredient, form: l.form, variant: l.variant && VARIANT[l.variant].label, custody: l.custody, claim: l.claim, stewing: !!l.stew,
        stewDaysDone: l.stew ? Math.floor((t.now - l.stew.startedAt) / 1440) : null,
        provenance: l.ingredient === 'book.hp.ing.fluxweed' ? l.known.provenance : null, stewedKnown: l.known.stewed ? (l.form === 'stewed' ? (l.truth.stewedMinutes >= F.slots[0].minStewMinutes ? 'twenty-one days' : 'short of twenty-one days') : null) : null, assayed: l.known.assayed});
    return {begun: true, purse: t.purse, store: t.store,
        lots: Object.values(t.lots).map(lotView),
        samples: Object.values(t.samples).map(x => ({id: x.id, claim: x.claim, donorName: t.donors[x.known.assayed ? x.donorId : x.claimDonorId].name, species: x.known.assayed ? x.truth.species : 'unknown', assayed: x.known.assayed})),
        donors: Object.values(t.donors).map(d => ({id: d.id, name: d.name, mood: standingWord(d.standing), askReady: d.askedAt === null || t.now - d.askedAt >= R.donorAskCooldownMinutes})),
        master: standingWord(t.master.standing),
        cauldron: {condition: t.cauldron.condition >= R.cauldronOkFrom ? 'clean' : t.cauldron.condition >= R.cauldronBadBelow ? 'sooty' : 'badly fouled', brewing: !!t.cauldron.brew, readyInHours: t.cauldron.brew ? Math.ceil((t.cauldron.brew.readyAt - t.now) / 60) : null},
        batches: Object.values(t.batches).map(b => ({id: b.id, cohortId: b.cohortId ?? null, custody: b.custody ?? 'carried', readyAt: b.readyAt, retainedHistory: !!b.history, dosesLeft: b.dosesLeft, cue: b.known.assayed || b.known.identified ? HP.outcomes[b.grade].cue + ' ' + HP.outcomes[b.grade].label : HP.outcomes[b.grade === 'original' ? 'original' : 'canon'].cue, identified: b.known.identified, label: b.known.identified ? HP.outcomes[b.grade].label : 'Unidentified brew'})),
        effect: t.effect && t.effect.endsAt > t.now ? {kind: t.effect.kind, donorName: t.donors[t.effect.donorId].name, minutesLeft: Math.ceil((t.effect.endsAt - t.now) / 5) * 5} : null,
        condition: t.condition ? {id: t.condition.id, daysLeft: Math.ceil((t.condition.until - t.now) / 1440)} : null,
        debts: t.debts.filter(d => d.status !== 'repaid').map(d => ({id: d.id, name: label(d.ingredient), status: d.status, dueInDays: Math.floor((d.dueAt - t.now) / 1440), repay: d.repay})),
        ledger: t.ledger.slice(-16).map(e => ({id: e.id, at: e.at, kind: e.kind, text: e.text})), moonReady: typeof ctx.moon === 'string', moon: ctx.moon ?? null,
        harvestReady: t.harvestAt === null || t.now - t.harvestAt >= R.harvestCooldownMinutes};
}

const KEYS = ['schema', 'packRevision', 'root', 'begunAt', 'now', 'purse', 'serial', 'seq', 'store', 'lots', 'samples', 'donors', 'debts', 'notices', 'master', 'cauldron', 'batches', 'effect', 'condition', 'harvestAt', 'ledger'];
export function validate(s) {
    need(s && typeof s === 'object' && !Array.isArray(s), 'Polyjuice slice is not an object.');
    need(s.schema === SCHEMA && s.packRevision === 1, 'Unsupported Polyjuice slice revision.');
    need(KEYS.every(k => Object.hasOwn(s, k)) && Object.keys(s).every(k => KEYS.includes(k)), 'Polyjuice slice has missing or unknown fields.');
    need(Number.isInteger(s.root) && s.root >= 0 && s.root <= 0xffffffff, 'Bad slice seed.');
    for(const k of ['begunAt', 'now', 'purse', 'serial', 'seq']) need(int(s[k]) && s[k] >= 0, `Bad ${k}.`);
    need(s.now >= s.begunAt, 'Slice clock is behind its start.');
    for(const l of Object.values(s.lots)) {
        need(ING[l.ingredient] && ING[l.ingredient].forms.includes(l.form) && l.id in s.lots, 'A lot has an unknown ingredient or form.');
        need(!l.variant || VARIANT[l.variant]?.makes === l.form, 'A lot variant does not match its form.');
        need(l.acquiredAt <= s.now && (!l.stew || l.stew.startedAt <= s.now), 'A lot is dated after the slice clock.');
        need(Object.hasOwn(l.truth, 'provenance') && int(l.truth.stewedMinutes) && ['full_moon', 'other', null].includes(l.truth.provenance), 'A lot lacks its truth record.');
    }
    for(const x of Object.values(s.samples)) need(s.donors[x.donorId] && s.donors[x.claimDonorId] && ['human', 'cat'].includes(x.truth.species), 'A sample lacks a donor or species.');
    const cohorts = new Map();
    for(const [id, b] of Object.entries(s.batches)) {
        need(b.id === id && ['canon', 'degraded', 'original'].includes(b.grade) && int(b.doses) && int(b.dosesLeft) && b.dosesLeft >= 0 && b.dosesLeft <= b.doses, 'A batch is malformed.');
        if(b.history || b.cohortId || b.custody) {
            retained(b); need(typeof b.cohortId === 'string' && ['carried', 'bench'].includes(b.custody) && b.readyAt === b.history.readyAt && b.grade === b.history.resolution.grade, 'Malformed HP cohort custody.');
            const c = cohorts.get(b.cohortId) ?? {doses: 0, history: JSON.stringify(b.history), yield: b.history.producedDoses};
            need(c.history === JSON.stringify(b.history), 'Cohort portions disagree about their paid history.');
            c.doses += b.doses; cohorts.set(b.cohortId, c);
        }
    }
    for(const c of cohorts.values()) need(c.doses === c.yield, 'HP cohort portions do not conserve the produced doses.');
    if(s.cauldron.brew) { checkPending(s.cauldron.brew, s); need(s.cauldron.brew.startedAt <= s.now, 'Pending HP brew is ahead of the slice clock.'); }
    need(int(s.cauldron.condition) && s.cauldron.condition >= 0 && s.cauldron.condition <= R.cauldronStart, 'Bad cauldron condition.');
    need(int(s.purse) && Object.keys(s.donors).length === R.donors && s.ledger.length <= LEDGER_CAP, 'Bad purse, donors or ledger.');
    need(Object.values(s.lots).filter(l => l.stew).length <= R.stewPotCapacity, 'Too many lots in the stew pot.');
    return s;
}
