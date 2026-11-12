import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import '../src/dnd_phandalin_domain.js';

const cmd = name => domainRegistry.command('dnd_phandalin', name);
const run = request => { const q = cmd('quote')(request); assert.equal(q.eligible, true, q.reason); return cmd('execute')(q); };
const view = () => domainRegistry.project('dnd_phandalin');
const reload = () => { const env = domainRegistry.save({}); domainRegistry.validate(JSON.parse(JSON.stringify(env))); domainRegistry.load(JSON.parse(JSON.stringify(env))); return env; };

test('journey: a torn Sack blocks the crossing until Mending repairs it, then delivery settles once', () => {
    domainRegistry.load({});
    assert.equal(view().started, false);
    run({type: 'start'});
    assert.equal(cmd('quote')({type: 'start'}).eligible, false);
    assert.match(view().bag, /not yet inspected/);
    const blocked = cmd('quote')({type: 'cross', approach: 'rush'});
    assert.equal(blocked.eligible, false);
    assert.match(blocked.reason, /torn and cannot hold loose cargo/);
    run({type: 'inspect'});
    assert.match(view().bag, /six-inch tear/);
    run({type: 'cast'});
    assert.equal(cmd('quote')({type: 'cast'}).eligible, false, 'one casting at a time');
    domainRegistry.tick(0.5);
    assert.ok(view().cast, 'still casting before the minute is up');
    const mid = reload();
    assert.ok(mid.dnd_phandalin.cast, 'unfinished cast survives save/reload');
    domainRegistry.tick(1);
    assert.equal(view().cast, null);
    assert.match(view().bag, /whole, holds 30 lb/);
    const cross = request => { const q = cmd('quote')(request); return q.eligible ? cmd('execute')(q) : q; };
    cross({type: 'cross', approach: 'rush'});
    const first = domainRegistry.save({}).dnd_phandalin;
    cross({type: 'cross', approach: 'rush'}); // same approach: replay, no new roll
    assert.deepEqual(domainRegistry.save({}).dnd_phandalin.tried, first.tried);
    if (!first.crossed) cross({type: 'cross', approach: 'test each stone'});
    assert.equal(domainRegistry.save({}).dnd_phandalin.tried.length <= 2, true);
    assert.equal(cmd('quote')({type: 'deliver'}).eligible, domainRegistry.save({}).dnd_phandalin.crossed);
});

test('no dead end: the dry path needs no roll and finishes the job; a torn Sack blocks it too', () => {
    domainRegistry.load({});
    run({type: 'start'});
    assert.match(cmd('quote')({type: 'dryPath'}).reason, /torn/);
    run({type: 'cast'}); domainRegistry.tick(1);
    run({type: 'dryPath'}); // needs no roll, so it is reachable whatever the stones would have done
    assert.equal(cmd('quote')({type: 'cross', approach: 'rush'}).eligible, false, 'already across');
    assert.equal(cmd('quote')({type: 'dryPath'}).eligible, false, 'crossing happens once');
    run({type: 'deliver'});
    assert.equal(domainRegistry.save({}).dnd_phandalin.settled, true);
    assert.equal(cmd('quote')({type: 'deliver'}).eligible, false, 'settles once');
});

test('interruption repairs nothing and spends nothing; a fresh cast takes a new full minute', () => {
    domainRegistry.load({});
    run({type: 'start'}); run({type: 'cast'}); run({type: 'interrupt'});
    assert.match(view().bag, /not yet inspected/);
    assert.equal(domainRegistry.save({}).dnd_phandalin.bag.damage.state, 'open');
    run({type: 'cast' }); domainRegistry.tick(1);
    assert.equal(domainRegistry.save({}).dnd_phandalin.bag.damage.state, 'repaired');
});

test('save: absent slice loads clean, round trip is stable, and an edited roll is rejected', () => {
    domainRegistry.load({});
    assert.equal(domainRegistry.save({}).dnd_phandalin, undefined, 'a life that never began writes no key');
    run({type: 'start'}); run({type: 'cast' }); domainRegistry.tick(1);
    const q = cmd('quote')({type: 'cross', approach: 'rush'}); cmd('execute')(q);
    const env = reload();
    assert.deepEqual(domainRegistry.save({}).dnd_phandalin, env.dnd_phandalin);
    const bad = JSON.parse(JSON.stringify(env));
    bad.dnd_phandalin.tried[0].receipt.dice[0].candidates[0].dice[0].value += 1;
    assert.throws(() => domainRegistry.validate(bad));
    const settledWithoutCrossing = JSON.parse(JSON.stringify(env)); settledWithoutCrossing.dnd_phandalin.crossed = false; settledWithoutCrossing.dnd_phandalin.settled = true;
    assert.throws(() => domainRegistry.validate(settledWithoutCrossing));
});

test('2024 Levitate keeps its slot through a successful Counterspell, then supports a real retrieval', () => {
    domainRegistry.load({});
    const act=type=>run({type});
    const eligible=type=>cmd('quote')({type}).eligible;
    act('start');
    assert.equal(eligible('beginLevitate'),false);
    act('prepareLevitate');
    act('beginLevitate');
    assert.equal(reload().dnd_phandalin.levitation.slots,2);
    assert.equal(eligible('nextSpellTurn'),false);
    domainRegistry.tick(1);
    const countered=act('resolveLevitate');
    assert.equal(reload().dnd_phandalin.levitation.counter.drawAddress.gameTime,540);
    assert.match(countered.message,/Counterspell breaks/);
    assert.equal(view().levitation.slots,2);
    assert.equal(eligible('cast'),false,'the interrupted Magic action cannot become Mending');
    assert.equal(eligible('beginLevitate'),false);
    act('nextSpellTurn');
    act('beginLevitate'); act('resolveLevitate');
    assert.equal(view().levitation.slots,1);
    assert.equal(view().levitation.feet,10);
    assert.equal(eligible('retrieveUnderCrate'),false);
    reload(); act('nextSpellTurn'); act('retrieveUnderCrate');
    assert.equal(view().levitation.recovered,true);
    assert.equal(eligible('cast'),false);
    act('nextSpellTurn');
    assert.match(cmd('quote')({type:'cast'}).summary,/end Levitate/);
    act('cast');assert.ok(view().cast);
    assert.equal(view().levitation.feet,0);
    assert.equal(reload().dnd_phandalin.levitation.support,null);
    act('interrupt');
    assert.equal(view().levitation.feet,0,'interrupting Mending does not resume Levitate');
    assert.equal(view().levitation.feet,0);
    act('nextSpellTurn'); act('beginLevitate'); act('resolveLevitate');
    domainRegistry.tick(10);
    assert.equal(view().levitation.feet,0);
    assert.equal(reload().dnd_phandalin.levitation.recovered,true);
});

test('screened casting leaves Counterspell unused, and only a raised crate permits recovery',()=>{
    domainRegistry.load({});
    const act=type=>run({type});
    const eligible=type=>cmd('quote')({type}).eligible;
    act('start');act('prepareLevitate');act('screenedPosition');
    assert.equal(view().levitation.movement,20);
    act('beginLevitate');
    assert.equal(eligible('openPosition'),false);
    reload();act('resolveLevitate');
    const trial=reload().dnd_phandalin.levitation;
    assert.equal(trial.counter,null);
    assert.equal(trial.reactionUsed,false);
    assert.equal(trial.slots,1);
    act('nextSpellTurn');act('lowerCrate');
    assert.equal(eligible('retrieveUnderCrate'),false);
    act('nextSpellTurn');assert.equal(eligible('retrieveUnderCrate'),false);
    act('raiseCrate');act('nextSpellTurn');act('retrieveUnderCrate');
    act('endLevitate');act('nextSpellTurn');act('openPosition');
    act('beginLevitate');act('resolveLevitate');
    assert.equal(reload().dnd_phandalin.levitation.reactionUsed,true);
});

test('a held wizard focus replaces the spring and the accepted cast binds that exact aid',()=>{
    domainRegistry.load({});
    const act=type=>run({type});
    const quote=type=>cmd('quote')({type});
    act('start');act('prepareLevitate');act('screenedPosition');act('setMaterialDown');
    assert.match(quote('beginLevitate').reason,/spring or hold the arcane focus/);
    act('holdFocus');act('beginLevitate');
    const pending=reload().dnd_phandalin.levitation.pending;
    assert.equal(pending.materialId,'dnd.phandalin.arcane_focus');
    assert.equal(quote('takeSpring').eligible,false);
    act('resolveLevitate');
    assert.equal(view().levitation.slots,1);
    assert.equal(view().levitation.castingAid,'arcane focus');
    const gagged=structuredClone(reload());
    gagged.dnd_phandalin.levitation.means.voice=false;
    domainRegistry.load(gagged);
    act('endLevitate');act('nextSpellTurn');
    assert.match(quote('beginLevitate').reason,/spoken words/);
});

test('the borrowed spellbook start copies Levitate before preparing it after a long rest',()=>{
    domainRegistry.load({});
    const act=type=>run({type});
    const quote=type=>cmd('quote')({type});
    act('startStudy'); const start=view().minute;
    assert.match(quote('prepareLevitate').reason,/Copy Levitate/);
    act('copyLevitate');
    assert.equal(view().minute,start+240);
    assert.equal(view().levitation.study.gp,0);
    assert.equal(quote('copyLevitate').eligible,false);
    assert.match(quote('prepareLevitate').reason,/long rest/);
    reload();act('restAfterCopy');assert.equal(view().minute,start+720);
    act('prepareLevitate');act('screenedPosition');act('beginLevitate');act('resolveLevitate');
    assert.equal(view().levitation.slots,1);
    assert.equal(view().levitation.feet,10);
});
