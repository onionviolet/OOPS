import test from 'node:test';
import assert from 'node:assert/strict';
import * as P from '../src/pledges.js';

const skilled = {combat: 1};
test('self-imposed vows have real admission rules; breaking them restores the ordinary route', () => {
    let s = P.vowTake(P.fresh(), 'plain-table', 0);
    assert.match(P.actionReason(s, {kind:'consume', id:'Roasted rat meat', food:true}), /plain fare|plain-table/);
    assert.equal(P.actionReason(s, {kind:'consume', id:'Stale bread', food:true}), '');
    assert.equal(P.actionReason(s, {kind:'consume', id:'Weak healing powder', food:false}), '');
    s = P.vowBreak(s, 'plain-table', 1);
    assert.equal(P.actionReason(s, {kind:'consume', id:'Roasted rat meat', food:true}), '');
    s = P.vowTake(s, 'open-hand', 2);
    assert.match(P.actionReason(s, {kind:'paid-help'}), /own hands/);
    assert.equal(P.actionReason(s, {kind:'work'}), '');
});

test('a graded ordeal has staged decisions, risk, an early settlement and durable aftermath', () => {
    let s = P.beginOrdeal(P.fresh(), {kind:'endurance', units:1, skills:skilled, at:10});
    assert.throws(() => P.beginOrdeal(s, {kind:'precision', units:0, skills:skilled, at:10}), /already/);
    s = P.stepOrdeal(s, 'steady', skilled, 11);
    const before = P.ordealView(s, skilled);
    assert.ok(before.grade > 0);
    const r = P.settleOrdeal(s, 12);
    assert.equal(r.state.trial.stage, 1);
    assert.ok(r.state.trial.quality >= 1);
    assert.equal(r.state.ordeal, null);
    assert.equal(r.state.trial.history.at(-1).kind, 'endurance');
    assert.deepEqual(P.migrate(JSON.parse(JSON.stringify(r.state))), r.state);
    assert.throws(() => P.settleOrdeal(r.state,13), /active/);
    let reckless = P.beginOrdeal(P.fresh(), {kind:'precision', units:0, skills:skilled, at:0});
    for(let n=1; reckless.ordeal && n<=12; n++) reckless=P.stepOrdeal(reckless,'press',skilled,n);
    assert.equal(reckless.ordeal,null);
    assert.ok(reckless.trial.pressure>0,'overreaching leaves actual pressure');
    assert.equal(reckless.trial.stage,0,'a failed ordeal cannot grant the next stage');
    const abandoned=P.abandonOrdeal(P.beginOrdeal(P.fresh(),{kind:'endurance',units:1,skills:skilled,at:0}));
    assert.equal(abandoned.ordeal,null);assert.equal(abandoned.trial.stage,0);assert.equal(abandoned.trial.quality,undefined);
});
test('vows steady the trial, a failed attempt wakes the heart demon, calm and rations pay it down', () => {
    let s = P.vowTake(P.fresh(), 'long-watch', 0);
    const plain = P.trialView(P.fresh(), skilled).risk;
    assert.equal(P.trialView(s, skilled).risk, plain - 40, 'one kept vow steadies the attempt');
    s = P.vowBreak(s, 'long-watch', 5);
    assert.equal(P.trialView(s, skilled).risk, plain + 40, 'its scar worsens it');
    const failed = P.attempt(s, {roll: 0, units: 0, skills: skilled});
    assert.deepEqual([failed.passed, failed.state.trial.stage, failed.state.trial.pressure], [false, 0, 2]);
    assert.ok(P.buckets(failed.state, 0).heart_demon.strength < 1);
    const eased = P.calm(failed.state);
    assert.equal(eased.trial.pressure, 1);
    const paid = P.attempt(eased, {roll: 999, units: 5, skills: skilled});
    assert.deepEqual([paid.passed, paid.spent, paid.state.trial.stage], [true, 5, 1]);
    assert.equal(P.buckets(paid.state, 0).tempering.strength, 1.03);
    assert.throws(() => P.attempt(P.fresh(), {roll: 999, units: 0, skills: {}}), /not ready/);
    const view = P.trialView(P.fresh(), {});
    assert.equal(view.ready, false); assert.ok(view.shown.length);
});

test('the rune bench: pair knowledge comes only from two-rune tablets; the worn talisman expires and its price is real', () => {
    let s = P.fresh();
    const long = P.carve(s, ['ember', 'gale', 'root'], 100);
    assert.deepEqual(long.state.runes.pairs, [], 'a long strip does not reveal its pairs');
    assert.deepEqual(P.buckets(long.state, 110).talisman.max_stamina > 1, true);
    const two = P.carve(s, ['root', 'ember'], 100);
    assert.deepEqual(two.state.runes.pairs.map(p => [p.a, p.b, p.effect]), [['root', 'ember', 'fizzle']]);
    assert.ok(P.buckets(two.state, 110).talisman.agility < 1, 'a bad pairing dulls the feet');
    assert.equal(P.buckets(two.state, 100 + 120).talisman, undefined, 'it expires');
    assert.equal(P.expire(two.state, 220).talisman, null);
    assert.equal(P.runeView(two.state).coverage.tried, 1);
});

test('the slice round-trips, migrates absent to fresh, and rejects tampering', () => {
    let s = P.vowTake(P.fresh(), 'open-hand', 3);
    s = P.attempt(s, {roll: 0, units: 0, skills: skilled}).state;
    s = P.carve(s, ['gale', 'tide'], 9).state;
    assert.deepEqual(P.migrate(JSON.parse(JSON.stringify(s))), s);
    assert.ok(P.isFresh(P.migrate(null)));
    const bad = structuredClone(s); bad.talisman.effects.nonsense = 3;
    assert.throws(() => P.validate(bad), /Unknown talisman effect/);
    const bad2 = structuredClone(s); bad2.trial.stage = 9;
    assert.throws(() => P.validate(bad2), /tempering/);
});

test('domain: save omits an untouched slice, commands run through ports and publish stat buckets, rollback on a failed save', async () => {
    await import('../src/pledges_domain.js');
    const D = await import('../src/pledges_domain.js');
    const {domainRegistry} = await import('../src/domain_registry.js');
    const bread = {count: 5}, wood = {count: 0}, multiplier = {};
    const owner = {bread};
    let failSave = false, now=100, asleep=false;
    const actor = {getLevelableComponent: () => ({stats: {multiplier}}), getFullStats: () => ({health: 5, stamina: 5, max_health: 10, max_stamina: 10}), updateStatsAndDisplay() {}};
    D.configurePledges({actor: () => actor, clock: () => now, sleeping:()=>asleep, templates:{'Roasted rat meat':{tags:{food:true}},'Stale bread':{tags:{food:true}}}, idle: () => true, count: id => id === 'Stale bread' ? bread.count : wood.count, assertSpend() {},
        removeItem: (id, n) => { if(id === 'Stale bread') bread.count -= n; else wood.count -= n; }, itemOwners: () => [owner, bread, wood],
        persist: cb => { if(failSave) throw Error('disk full'); cb(); }, random: () => 0.9, logMessage() {}, refresh() {}, skillLevel: () => 2});
    domainRegistry.load({});
    assert.equal(domainRegistry.save({}).pledges, undefined);
    D.commands.takeVow('long-watch');
    assert.ok(multiplier.vow_oath.strength > 1, 'the vow reaches the hero');
    const r = D.commands.temper(5);
    assert.equal(r.passed, true); assert.equal(bread.count, 0);
    assert.ok(multiplier.tempering.strength > 1);
    failSave = true;
    assert.throws(() => D.commands.calm(), /not|weighs|disk/);
    failSave = false; bread.count = 3;
    const before = D.pledgesState();
    failSave = true;
    wood.count = 4;
    assert.throws(() => D.commands.carve(['ember', 'gale']), /disk full/);
    assert.equal(wood.count, 4, 'wood is refunded on rollback'); assert.deepEqual(D.pledgesState(), before);
    failSave = false;
    D.commands.carve(['ember', 'gale']);
    assert.equal(wood.count, 2);
    const saved = domainRegistry.save({});
    assert.equal(saved.pledges.family, 'progression.pledges@1');
    domainRegistry.validate(saved); domainRegistry.load({}); assert.equal(D.pledgesState().trial.stage, 0);
    domainRegistry.load(saved); assert.equal(D.pledgesState().trial.stage, 1);
    assert.ok(multiplier.talisman.max_stamina > 1);
    D.commands.takeVow('plain-table');
    assert.throws(()=>domainRegistry.useItem('{"id":"Roasted rat meat"}'),/plain-table/,'ordinary native useItem admission reads the vow');
    assert.equal(domainRegistry.useItem('{"id":"Stale bread"}'),false,'plain food continues through its original native owner');
    D.commands.breakVow('plain-table');
    assert.equal(domainRegistry.useItem('{"id":"Roasted rat meat"}'),false,'breaking restores the original food route');
    now=360;asleep=true;
    const domain=domainRegistry.list().find(d=>d.id==='pledges');domain.tick(1);
    assert.ok(D.pledgesState().vows.broken['long-watch'],'native dawn sleeping breaks the vow');
    const scar=D.pledgesState().vows.broken['long-watch'];domain.tick(1);
    assert.deepEqual(D.pledgesState().vows.broken['long-watch'],scar,'the sleeping scan settles a breach once');
});

test('charged ordered strips have graded capacity and spend only supported resolved uses',()=>{
 const s=P.carveCharged(P.fresh(),['ember','gale','tide'],'attack',0,'body-a');
 assert.equal(s.charged.grade,2);assert.equal(s.charged.charges,4);
 assert.equal(P.useCharged(s,{direction:'incoming',binding:'body-a'}).state,s);
 assert.equal(P.useCharged(s,{direction:'outgoing',binding:'body-b'}).state,s);
 const hit=P.useCharged(s,{direction:'outgoing',binding:'body-a'});assert.ok(hit.multiplier>1);assert.equal(hit.state.charged.charges,3);P.validate(JSON.parse(JSON.stringify(hit.state)));
 const guard=P.carveCharged(P.fresh(),['root','tide'],'guard',0,'body-a');assert.ok(P.useCharged(guard,{direction:'incoming',binding:'body-a'}).multiplier<1);
 const mend=P.carveCharged(P.fresh(),['root','tide'],'mend',0,'body-a');assert.equal(P.useCharged(mend,{direction:'outgoing',binding:'body-a',health:60,maxHealth:60}).state,mend);
 assert.equal(P.useCharged(mend,{direction:'outgoing',binding:'body-a',health:59,maxHealth:60}).heal,1);
 const bad=structuredClone(hit.state);bad.charged.charges++;assert.throws(()=>P.validate(bad),/charged/);
});

test('weapon trials use distinct scoring and recheck equipment; learning survives fear recovery and guarded route has exact terms',()=>{
 const blade=P.beginOrdeal(P.fresh(),{kind:'blade',units:0,skills:{combat:1,weapon:'sword'},at:0}),pole=P.beginOrdeal(P.fresh(),{kind:'pole',units:0,skills:{combat:1,weapon:'spear'},at:0});
 assert.throws(()=>P.stepOrdeal(blade,'press',{combat:1,weapon:'spear'},1),/weapon/);
 const b=P.stepOrdeal(blade,'press',{combat:1,weapon:'sword'},1),p=P.stepOrdeal(pole,'press',{combat:1,weapon:'spear'},1);assert.ok(b.ordeal.score>p.ordeal.score);assert.ok(b.ordeal.integrity<p.ordeal.integrity);
 let failed=P.attempt(P.fresh(),{roll:0,units:0,skills:skilled}).state;assert.equal(failed.trial.learning,1);while(failed.trial.pressure)failed=P.calm(failed);
 assert.ok(P.trialView(failed,skilled).risk<P.trialView(P.fresh(),skilled).risk);
 const safe=P.guardedTempering(failed,skilled);assert.equal(safe.trial.stage,1);assert.equal(safe.trial.last.risk,0);assert.equal(safe.trial.last.units,5);assert.equal(safe.trial.quality,undefined);P.validate(safe);
});
