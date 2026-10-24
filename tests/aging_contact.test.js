import test from 'node:test';
import assert from 'node:assert/strict';
import {freshAging, stepAging, setStance, treat, spendCompany, writeLetter, ceilings, agingView, validateAgingContact, migrateAgingContact, severityOf, CHRONIC, DAY, FLOOR, phaseOf} from '../src/aging_contact.js';

const YEAR_MIN = 360 * DAY;
const run = (state, fromAge, toAge, {stance, inVillage = true, company = false} = {}) => {
    let s = state, age = fromAge, clock = 0;
    while(age < toAge) {
        age = Math.min(toAge, age + 0.25);clock += YEAR_MIN / 4;
        if(stance) for(const id of Object.keys(s.conditions)) if(s.conditions[id].stance !== stance) s.conditions[id].stance = stance;
        if(company) s.contact.score = 100;
        s = stepAging(s, {age, clock, minutes: YEAR_MIN / 4, worldId: 'base.frontier', inVillage}).state;
    }
    return {state: s, clock};
};
const start = (age) => ({...freshAging(), lastAge: age});

test('conditions begin at their onset age and worsen with years, and the ceiling falls slowly', () => {
    const young = run(start(30), 30, 44, {company: true}).state;
    assert.deepEqual(Object.keys(young.conditions), []);
    const mid = run(start(44), 44, 60, {company: true}), late = run(start(44), 44, 78, {company: true});
    const view = (r, age) => agingView(r.state, {age, clock: r.clock, worldId: 'base.frontier'});
    assert.ok(view(mid, 60).healthMultiplier < 1 && view(late, 78).healthMultiplier < view(mid, 60).healthMultiplier);
    assert.ok(view(late, 78).healthMultiplier >= FLOOR.health, 'forgiving floor');
    assert.ok(view(late, 78).reasons.health.some(r => /Age 78/.test(r)) && view(late, 78).reasons.health.some(r => /Unexplained ache/.test(r)));
});

test('ignore advances fastest, manage about a third as fast, and a world dial scales the pace', () => {
    const base = run(start(44), 44, 52, {stance: 'ignore', company: true}).state, managed = run(start(44), 44, 52, {stance: 'manage', company: true}).state;
    assert.ok(base.conditions.joints.progress > managed.conditions.joints.progress * 2.5);
    const slow = structuredClone(start(44));slow.dial = {id: 'tempered', rate: 0.25, reason: 'A cultivator body tempers slowly.'};
    assert.ok(run(slow, 44, 52, {company: true}).state.conditions.joints.progress < base.conditions.joints.progress / 3);
});

test('treating costs coins, eases one stage and is refused without coins', () => {
    const aged = run(start(44), 44, 66, {company: true}), joints = CHRONIC[0];
    const before = severityOf(joints, aged.state.conditions.joints);
    assert.ok(before >= 2);
    assert.throws(() => treat(aged.state, 'joints', aged.clock, 1), /coins/);
    const result = treat(aged.state, 'joints', aged.clock, 500);
    assert.equal(severityOf(joints, result.state.conditions.joints), before - 1);
    assert.equal(result.cost, 8 * (before + 1));
    const after = run({...result.state, lastAge: 66}, 66, 67, {company: true});
    assert.ok(after.state.conditions.joints.progress - result.state.conditions.joints.progress < 0.2, 'in care: a tenth pace');
});

test('contact decays alone, slower in the village, and company, letters and replies restore it', () => {
    let s = freshAging();
    const days = (state, n, inVillage, clock) => { let x = state; for(let i = 0; i < n; i++) x = stepAging(x, {age: 30, clock: clock - (n - 1 - i) * DAY, minutes: DAY, worldId: 'base.frontier', inVillage}).state; return x; };
    const alone = days(s, 14, false, 14 * DAY), town = days(s, 14, true, 14 * DAY);
    assert.ok(alone.contact.score < town.contact.score && alone.contact.score < 50);
    const long = days(alone, 7, false, 21 * DAY);
    const deep = days(days(long, 7, false, 28 * DAY), 7, false, 35 * DAY);
    assert.equal(phaseOf(deep.contact.score).id, 'isolated');
    assert.ok(ceilings(deep, {age: 30, worldId: 'base.frontier', clock: 35 * DAY}).stamina.multiplier < 1);
    const visited = spendCompany(deep, 35 * DAY, 'villageElder');
    assert.equal(visited.gain, 20);assert.equal(spendCompany(visited.state, 35 * DAY, 'villageElder').gain, 8);
    assert.ok(visited.state.contact.score > deep.contact.score + 19);
    assert.throws(() => writeLetter(deep, 35 * DAY, 'villageElder', 0), /coin/);
    const sent = writeLetter(deep, 35 * DAY, 'villageElder', 3).state;
    assert.throws(() => writeLetter(sent, 35 * DAY, 'villageElder', 3), /already/);
    const replied = stepAging(sent, {age: 30, clock: 39 * DAY, minutes: 4 * DAY, worldId: 'base.frontier', inVillage: true});
    assert.ok(replied.notes.some(n => /reply/.test(n)));assert.equal(replied.state.contact.letters[0].status, 'replied');
    assert.ok(replied.state.contact.score > sent.contact.score + 15);
});

test('contact never drops below its floor, and long gaps are capped per step', () => {
    const s = stepAging(freshAging(), {age: 30, clock: 999 * DAY, minutes: 999 * DAY, worldId: 'base.frontier'}).state;
    assert.ok(s.contact.score >= 5 && s.contact.score > 100 - 4 * 7 - 1);
});

test('slice validates, migrates null to fresh, and rejects corrupt data', () => {
    assert.deepEqual(migrateAgingContact(null), freshAging());
    const s = run(start(44), 44, 60).state;
    assert.doesNotThrow(() => validateAgingContact(JSON.parse(JSON.stringify(s))));
    assert.throws(() => validateAgingContact({...s, schema: 2}), /Invalid/);
    const bad = structuredClone(s);bad.conditions.joints.stance = 'wild';
    assert.throws(() => validateAgingContact(bad), /condition/);
    assert.throws(() => setStance(freshAging(), 'joints', 'manage', 0), /Nothing/);
});

test('minute-sized ticks add up to the same wear and decay as one big step (no per-tick rounding loss)', () => {
    const base = {...freshAging(), lastAge: 50}, dayYears = 1 / 360;
    let a = base, clock = 0;
    for(let i = 1; i <= 1440; i++) a = stepAging(a, {age: 50 + dayYears * i / 1440, clock: clock = i, minutes: 1, worldId: 'base.frontier', inVillage: false}).state;
    const b = stepAging(base, {age: 50 + dayYears, clock: DAY, minutes: DAY, worldId: 'base.frontier', inVillage: false}).state;
    assert.ok(Math.abs(a.contact.score - b.contact.score) < 0.01 && a.contact.score < 97, `alone a day: ${a.contact.score} vs ${b.contact.score}`);
    assert.ok(a.conditions.joints.progress > 0 && Math.abs(a.conditions.joints.progress - b.conditions.joints.progress) < 1e-6);
});
