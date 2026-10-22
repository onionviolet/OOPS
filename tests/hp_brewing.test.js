import test from 'node:test';
import assert from 'node:assert/strict';
import {begin, commit, quote, view, settle, validate, resolveBrew, HP} from '../src/hp_brewing_state.js';

const I = id => `book.hp.ing.${id}`, STORE = 'book.hp.route.student_store', TRUST = 'book.hp.route.trusted_supplier', HARVEST = 'book.hp.route.harvest';
const DAY = 1440, FULL = {moon: 'Full'}, NEW = {moon: 'New'};

class Run {
    constructor(seed = 11, start = 0) { this.s = begin({seed, now: start}); this.now = start; this.moon = 'Full'; }
    do(req) { const out = commit(this.s, {now: this.now, moon: this.moon}, req); this.s = out.state; return out.summary; }
    wait(minutes) { this.now += minutes; settle(this.s, this.now); }
    lot(ingredient) { return Object.values(this.s.lots).filter(l => l.ingredient === ingredient).at(-1).id; }
    get(ingredient, route, extra = {}) { this.do({type: 'acquire', route, ingredient, ...extra}); return this.lot(ingredient); }
    // Build the six slot lots for a named formula; `opts` bends one qualifier at a time.
    slots({moon = 'Full', coarse = false, stewMinutes = 30240, preps = true} = {}) {
        this.moon = moon;
        const flux = this.get(I('fluxweed'), HARVEST);
        const lace = this.get(I('lacewing_flies'), STORE);
        const leech = this.get(I('leeches'), STORE), knot = this.get(I('knotgrass'), STORE);
        const horn = this.get(I('bicorn_horn'), TRUST), skin = this.get(I('boomslang_skin'), TRUST);
        this.do({type: 'stew', lotId: lace}); this.wait(stewMinutes);
        if(this.s.lots[lace].stew) this.do({type: 'removeStew', lotId: lace});
        if(preps) {
            this.do({type: 'prepare', lotId: horn, variant: coarse ? 'book.hp.prep.powder_coarse' : 'book.hp.prep.powder_fine'});
            this.do({type: 'prepare', lotId: skin, variant: 'book.hp.prep.shred_fine'});
        }
        return {lacewing: lace, leeches: leech, fluxweed: flux, knotgrass: knot, bicorn: horn, boomslang: skin};
    }
    brew(slots) { this.do({type: 'brew', slots}); this.wait(HP.rules.brewMinutes); return Object.values(this.s.batches).at(-1); }
}

test('MR35: the exact pinned formula makes the canon product', () => {
    const r = new Run(); const b = r.brew(r.slots());
    assert.equal(b.grade, 'canon');
    assert.equal(b.dosesLeft, HP.rules.doses);
});

test('MR7/MR35: a near miss makes a labelled degraded batch, never the canon product', () => {
    const coarse = new Run(); assert.equal(coarse.brew(coarse.slots({coarse: true})).grade, 'degraded');
    const short = new Run(); assert.equal(short.brew(short.slots({stewMinutes: 15 * DAY})).grade, 'degraded');
    assert.equal(HP.outcomes.degraded.status, 'original');
});

test('wrong provenance or a missing preparation fails the formula and yields only an original mixture', () => {
    const wrong = new Run(); assert.equal(wrong.brew(wrong.slots({moon: 'New'})).grade, 'original');
    const raw = new Run(); assert.equal(raw.brew(raw.slots({preps: false})).grade, 'original');
    const early = new Run(); assert.equal(early.brew(early.slots({stewMinutes: 5 * DAY})).grade, 'original');
});

test('MR6: free mixing always resolves; a similar mix is not Polyjuice', () => {
    const r = new Run();
    const slots = r.slots();
    const nettles = r.get(I('dried_nettles'), STORE), fangs = r.get(I('snake_fangs'), STORE);
    const b = r.brew({...slots, leeches: nettles, knotgrass: fangs});
    assert.equal(b.grade, 'original');
    const lone = new Run(); assert.equal(lone.brew({leeches: lone.get(I('leeches'), STORE)}).grade, 'original');
    assert.throws(() => new Run().do({type: 'brew', slots: {}}), /at least one lot/);
});

test('a worn cauldron is one qualifier; a fouled one is two (MR16: the condition is read)', () => {
    assert.equal(resolveBrew({}, 1000).grade, 'original');
    const r = new Run(); const slots = r.slots();
    r.s.cauldron.condition = 600; assert.equal(r.brew(slots).grade, 'degraded');
    const f = new Run(); const s2 = f.slots(); f.s.cauldron.condition = 300; assert.equal(f.brew(s2).grade, 'degraded');
    const g = new Run(); const s3 = g.slots({coarse: true}); g.s.cauldron.condition = 300; assert.equal(g.brew(s3).grade, 'original');
});

test('MR5: ingredients are consumed by a brew and a batch is never duplicated', () => {
    const r = new Run(); const slots = r.slots(); const before = Object.keys(r.s.lots).length;
    r.do({type: 'brew', slots});
    assert.equal(Object.keys(r.s.lots).length, before - 6);
    assert.throws(() => r.do({type: 'brew', slots}), /already simmering|Choose a lot/);
    r.wait(HP.rules.brewMinutes);
    assert.equal(Object.keys(r.s.batches).length, 1);
});

test('MR1/MR31: the projection never shows truth for an unassayed lot; assay reveals it', () => {
    const r = new Run(); r.moon = 'New';
    const store = r.get(I('fluxweed'), STORE);
    const shown = JSON.stringify(view(r.s, r));
    assert.ok(!/full_moon|"other"/.test(shown) && !shown.includes('provenance":"full'), 'store fluxweed provenance stays hidden');
    assert.equal(view(r.s, r).lots.find(l => l.id === store).provenance, 'unknown');
    const trusted = r.get(I('fluxweed'), TRUST);
    assert.equal(view(r.s, r).lots.find(l => l.id === trusted).claim, 'Sold as picked at the full moon.');
    r.do({type: 'assay', lotId: trusted});
    assert.equal(view(r.s, r).lots.find(l => l.id === trusted).provenance, r.s.lots[trusted].truth.provenance);
    // witnessed harvest is knowledge; the label records what the player saw
    const mine = r.get(I('fluxweed'), HARVEST);
    assert.equal(view(r.s, r).lots.find(l => l.id === mine).provenance, 'other');
    assert.match(view(r.s, r).lots.find(l => l.id === mine).claim, /new moon/);
});

test('a labelled sample does not rewrite its true donor or species (card H06)', () => {
    let found = null;
    for(let seed = 1; seed < 400 && !found; seed++) {
        const r = new Run(seed);
        for(const d of Object.keys(r.s.donors)) {
            r.do({type: 'sample', donorId: d, route: 'brush'});
            const x = Object.values(r.s.samples).at(-1);
            if(x.donorId !== x.claimDonorId || x.truth.species !== 'human') { found = {r, x}; break; }
        }
    }
    assert.ok(found, 'a contaminated or mixed brush sample exists in the seed sweep');
    const {r, x} = found, v = view(r.s, r).samples.find(s => s.id === x.id);
    assert.equal(v.species, 'unknown');
    assert.match(v.claim, new RegExp(r.s.donors[x.claimDonorId].name));
    r.do({type: 'assay', sampleId: x.id});
    assert.equal(view(r.s, r).samples.find(s => s.id === x.id).species, x.truth.species);
});

test('use and lasting consequences: canon transforms for an hour, a cat hair leaves features, both survive a JSON round trip', () => {
    const r = new Run(); const b = r.brew(r.slots());
    r.do({type: 'sample', donorId: 'd1', route: 'ask'});
    const id = Object.keys(r.s.samples).at(-1);
    r.do({type: 'drink', batchId: b.id, sampleId: id});
    assert.equal(r.s.effect.kind, 'transform'); assert.equal(r.s.effect.endsAt - r.s.effect.startedAt, 60);
    const copy = JSON.parse(JSON.stringify(r.s));
    validate(copy);
    r.wait(61); assert.equal(r.s.effect, null);
    assert.ok(r.s.ledger.some(e => e.kind === 'aftermath'), 'aftermath recorded');
    // cat sample: force the truth, keep the claim
    const c = new Run(); const b2 = c.brew(c.slots());
    c.do({type: 'sample', donorId: 'd2', route: 'brush'}); const sid = Object.keys(c.s.samples).at(-1);
    c.s.samples[sid].truth.species = 'cat';
    c.do({type: 'drink', batchId: b2.id, sampleId: sid});
    assert.equal(c.s.condition.until - c.now, HP.rules.animalRecoveryMinutes);
    const reloaded = JSON.parse(JSON.stringify(c.s)); validate(reloaded);
    assert.ok(reloaded.condition && reloaded.ledger.length > 0);
    assert.throws(() => commit(reloaded, {now: c.now + 1}, {type: 'drink', batchId: b2.id, sampleId: 'S99'}), /Choose a sample|last change/);
    settle(reloaded, c.now + HP.rules.animalRecoveryMinutes); assert.equal(reloaded.condition, null);
});

test('a degraded batch changes for half the stated hour; an original batch does nothing and wastes the sample', () => {
    const d = new Run(); const bd = d.brew(d.slots({coarse: true}));
    d.do({type: 'sample', donorId: 'd1', route: 'ask'}); d.do({type: 'drink', batchId: bd.id, sampleId: Object.keys(d.s.samples)[0]});
    assert.equal(d.s.effect.kind, 'thin'); assert.equal(d.s.effect.endsAt - d.s.effect.startedAt, 30);
    const o = new Run(); const bo = o.brew({leeches: o.get(I('leeches'), STORE)});
    o.do({type: 'sample', donorId: 'd1', route: 'ask'}); o.do({type: 'drink', batchId: bo.id, sampleId: Object.keys(o.s.samples)[0]});
    assert.equal(Object.keys(o.s.samples).length, 0); assert.equal(o.s.condition, null);
});

test('stewing is timed play: partial days persist through a round trip and finish at twenty-one days', () => {
    const r = new Run(); const lace = r.get(I('lacewing_flies'), STORE); r.do({type: 'stew', lotId: lace});
    r.wait(20 * DAY); let copy = JSON.parse(JSON.stringify(r.s)); validate(copy);
    assert.equal(copy.lots[lace].form, 'raw'); assert.equal(view(copy, {now: r.now}).lots[0].stewDaysDone, 20);
    settle(copy, r.now + DAY); assert.equal(copy.lots[lace].form, 'stewed'); assert.equal(copy.lots[lace].truth.stewedMinutes, 30240);
    const bought = new Run(); const ready = bought.get(I('lacewing_flies'), TRUST, {prepared: true});
    assert.equal(bought.s.lots[ready].form, 'stewed'); assert.equal(bought.s.purse, HP.rules.startPurse - 8);
});

test('supply has owners and consequences (MR27): finite stock, loans fall overdue, unlicensed taking may be noticed', () => {
    const r = new Run();
    for(let i = 0; i < HP.rules.storeStock; i++) r.do({type: 'acquire', route: STORE, ingredient: I('leeches')});
    assert.throws(() => r.do({type: 'acquire', route: STORE, ingredient: I('leeches')}), /no more/);
    assert.throws(() => r.do({type: 'acquire', route: STORE, ingredient: I('bicorn_horn')}), /does not offer/);
    r.do({type: 'acquire', route: 'book.hp.route.master_loan', ingredient: I('bicorn_horn')});
    r.wait(HP.rules.loanDueMinutes + 1);
    assert.equal(r.s.debts[0].status, 'overdue'); assert.equal(r.s.master.standing, -HP.rules.overdueStandingLoss);
    let noticed = 0;
    for(let seed = 1; seed <= 60; seed++) {
        const u = new Run(seed); u.do({type: 'acquire', route: 'book.hp.route.unlicensed_take', ingredient: I('boomslang_skin')});
        u.wait(HP.rules.noticeAfterMinutes + 1); noticed += u.s.master.standing < 0 ? 1 : 0;
    }
    assert.ok(noticed > 10 && noticed < 50, `notice chance is a dial, not 0 or 1 (${noticed}/60)`);
    const p = new Run(); p.do({type: 'acquire', route: 'book.hp.route.master_loan', ingredient: I('bicorn_horn')});
    p.do({type: 'repay', debtId: p.s.debts[0].id}); assert.equal(p.s.purse, HP.rules.startPurse - HP.rules.loanRepay[I('bicorn_horn')]);
});

test('the harvest patch regrows on a dial and needs a readable sky', () => {
    const r = new Run(); r.do({type: 'acquire', route: HARVEST, ingredient: I('fluxweed')});
    assert.throws(() => r.do({type: 'acquire', route: HARVEST, ingredient: I('fluxweed')}), /regrown/);
    r.wait(HP.rules.harvestCooldownMinutes); r.do({type: 'acquire', route: HARVEST, ingredient: I('fluxweed')});
    assert.throws(() => commit(begin({seed: 1, now: 0}), {now: 0}, {type: 'acquire', route: HARVEST, ingredient: I('fluxweed')}), /sky/);
});

test('MR4: a quote consumes nothing and equals the committed result', () => {
    const r = new Run(); const before = JSON.stringify(r.s);
    const q = quote(r.s, {now: 0, moon: 'Full'}, {type: 'acquire', route: STORE, ingredient: I('leeches')});
    assert.ok(q.eligible); assert.equal(JSON.stringify(r.s), before);
    assert.match(quote(r.s, {now: 0}, {type: 'acquire', route: TRUST, ingredient: I('bicorn_horn'), prepared: true}).reason, /no ready-prepared/);
    assert.match(quote(r.s, {now: 0}, {type: 'scour'}).reason, /already clean/);
});

test('MR34: same seed and actions give the same game; a reload continues with the same next draws', () => {
    const play = (seed, mid) => {
        const r = new Run(seed);
        r.do({type: 'sample', donorId: 'd1', route: 'brush'}); r.do({type: 'acquire', route: STORE, ingredient: I('fluxweed')});
        if(mid) r.s = JSON.parse(JSON.stringify(r.s));
        r.do({type: 'acquire', route: TRUST, ingredient: I('fluxweed')}); r.do({type: 'sample', donorId: 'd2', route: 'brush'});
        return JSON.stringify(r.s);
    };
    for(const seed of [3, 4242, 90210]) { assert.equal(play(seed, false), play(seed, false)); assert.equal(play(seed, false), play(seed, true)); }
    assert.notEqual(play(3, false), play(4, false));
});

test('seed sweep invariants: coins never negative, doses bounded, every state validates', () => {
    for(let seed = 1; seed <= 25; seed++) {
        const r = new Run(seed);
        try { const b = r.brew(r.slots({moon: seed % 3 ? 'Full' : 'Waning', coarse: seed % 4 === 0})); assert.ok(b.dosesLeft === 3); } catch(error) { assert.match(error.message, /costs/); }
        assert.ok(r.s.purse >= 0); validate(JSON.parse(JSON.stringify(r.s)));
    }
});

test('validation rejects malformed or future-dated slices (MR30)', () => {
    const r = new Run(); r.do({type: 'acquire', route: STORE, ingredient: I('leeches')});
    const bad = (mut, re) => { const c = JSON.parse(JSON.stringify(r.s)); mut(c); assert.throws(() => validate(c), re); };
    bad(c => { c.schema = 2; }, /Unsupported/);
    bad(c => { c.extra = 1; }, /unknown fields/);
    bad(c => { Object.values(c.lots)[0].ingredient = 'book.hp.ing.nope'; }, /unknown ingredient/);
    bad(c => { Object.values(c.lots)[0].acquiredAt = 99; }, /dated after/);
    bad(c => { c.purse = -1; }, /Bad purse/);
    bad(c => { c.root = 2 ** 33; }, /seed/);
});

test('MR31: a preview never reports hidden results; assay and drink quotes are neutral', () => {
    const r = new Run(); const b = r.brew(r.slots({coarse: true}));
    r.do({type: 'sample', donorId: 'd1', route: 'brush'});
    const id = Object.keys(r.s.samples).at(-1); r.s.samples[id].truth.species = 'cat';
    const ctx = {now: r.now, moon: 'Full'}, purse = r.s.purse;
    const q = [quote(r.s, ctx, {type: 'assay', sampleId: id}), quote(r.s, ctx, {type: 'assay', batchId: b.id}), quote(r.s, ctx, {type: 'drink', batchId: b.id, sampleId: id})];
    for(const x of q) {
        assert.ok(x.eligible);
        assert.ok(!/cat|degraded|thin|Murky|Polyjuice|animal|nothing|wrong/i.test(x.summary) && !Object.values(r.s.donors).some(d => x.summary.includes(d.name)), x.summary);
    }
    assert.equal(r.s.samples[id].known.assayed, false); assert.equal(r.s.purse, purse, 'previews spend nothing');
    // After the paid assay the result is knowledge.
    const out = commit(r.s, ctx, {type: 'assay', sampleId: id}); assert.match(out.summary, /cat hair/);
});
