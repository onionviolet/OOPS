import test from 'node:test';
import assert from 'node:assert/strict';
import {createChronicle, advanceChronicle, GAME_YEAR} from '../src/chronicle.js';
import {deriveHeirLeftovers, validateHeirLeftovers, applyHeirLeftovers, heirLeftoverLines} from '../src/heir_inheritance.js';
import * as L from '../src/lineage_traits.js';

const sample = () => L.foundLine('seed-a');
test('inherited phenotype reaches actual stat modifiers without depending on disclosure', () => {
    const s=L.foundLine('effects'),m=s.members.find(m=>m.id===s.selfId);
    m.genes.wind=['W','W'];m.genes.eye=['E','E'];m.genes.nerve=['N','n'];m.genes.knack=['K','K'];
    const effects=L.inheritedStatMultipliers(s);
    assert.ok(effects.max_stamina>1&&effects.intuition>1&&effects.agility>1&&effects.dexterity>1);
    m.tested=Object.keys(L.LOCI);
    assert.deepEqual(L.inheritedStatMultipliers(s),effects,'learning the genotype does not change the truth');
    assert.deepEqual(L.inheritedStatMultipliers(null),{});
});
const pure = (id, strongs) => L.member(id, id, 'm', Object.fromEntries(Object.keys(L.LOCI).map(l => [l, strongs ? [L.LOCI[l].strong, L.LOCI[l].strong] : [L.LOCI[l].plain, L.LOCI[l].plain]])));

test('founding is deterministic, valid and shows phenotype without hidden alleles', () => {
    const a = sample(), b = sample();
    assert.deepEqual(a, b);
    L.validateLineage(a);
    for (const m of a.members) for (const v of L.memberView(m)) {
        if (!v.known) assert.ok(v.alleles.includes('?'));
        if (v.shows === 'absent' && L.LOCI[v.locus].mode === 'dominant') assert.equal(v.known, true);
    }
});

test('a hidden allele is never in the view until a test; tests reveal one quality at a time', () => {
    let m = pure('x', true);
    m.genes.wind = ['W', 'w']; m.genes.eye = ['E', 'e'];
    const wind = L.locusView(m, 'wind');
    assert.deepEqual(wind.alleles, ['W', '?']);
    assert.equal(JSON.stringify(L.locusView(m, 'wind')).includes('"w"'), false);
    assert.deepEqual(L.locusView(m, 'eye').alleles, ['e', '?']);
    assert.equal(L.locusView(m, 'eye').shows, 'absent');
    m = L.testMember(m, 'wind');
    assert.deepEqual(L.locusView(m, 'wind').alleles, ['W', 'w']);
    assert.throws(() => L.testMember(m, 'wind'), /already known/);
});

test('children: recessive shows only when both parents give it; a showing child teaches both parents', () => {
    const carrier = () => { const m = pure('c', false); m.genes.eye = ['E', 'e']; return m; };
    const rng = L.seeded('rec');
    let child = null;
    for (let i = 0; i < 200 && !child; i++) {
        const made = L.breed({...carrier(), id: 's'}, {...carrier(), id: 'd'}, {rng, id: 'k', name: 'k', sex: 'm', profile: 'household'}).child;
        if (L.level('eye', made.genes.eye) === 2) child = made;
    }
    assert.ok(child, 'two carriers produce a showing child');
    const [s, d] = L.learnFromChild([{...carrier(), id: 's'}, {...carrier(), id: 'd'}], child);
    assert.equal(L.locusView(s, 'eye').known, true);
    assert.equal(L.locusView(d, 'eye').known, true);
});

test('fickle locus passes less often; inbreeding only loses qualities; unknown profile fails', () => {
    const strong = pure('p', true), strong2 = pure('q', true);
    const rng = L.seeded('fickle');
    let knack = 0, wind = 0, n = 400;
    for (let i = 0; i < n; i++) {
        const c = L.breed(strong, strong2, {rng, id: 'k', name: 'k', sex: 'f', profile: 'household'}).child;
        knack += c.genes.knack.filter(a => a === 'K').length; wind += c.genes.wind.filter(a => a === 'W').length;
    }
    assert.ok(knack < wind * 0.7, `fickle ${knack} vs ${wind}`);
    const sib = L.member('a', 'a', 'm', strong.genes, {sire: 'f0', dam: 'm0'}), sis = L.member('b', 'b', 'f', strong.genes, {sire: 'f0', dam: 'm0'});
    const f0 = L.member('f0', 'f0', 'm', strong.genes), m0 = L.member('m0', 'm0', 'f', strong.genes);
    const coi = L.kinship([f0, m0, sib, sis], 'a', 'b');
    assert.equal(coi, 0.25);
    assert.throws(() => L.breed(strong, strong2, {rng, id: 'k', name: 'k', sex: 'f', profile: 'zoo'}), /Unknown lineage profile/);
});

test('slice validation rejects damaged lines', () => {
    const s = sample();
    L.validateLineage(undefined);
    assert.throws(() => L.validateLineage({...s, schema: 2}), /Invalid inherited traits/);
    const bad = structuredClone(s); bad.members[0].genes.wind = ['W', 'Z'];
    assert.throws(() => L.validateLineage(bad), /genes/);
});

const calendar = {year: 999, month: 4, day: 1, hour: 8, minute: 0, day_count: 1};
function endedLife(line) {
    let c = createChronicle(0, calendar, true);
    c = advanceChronicle(c, 70 * GAME_YEAR);
    return {name: 'Ada', character: {name: 'Ada', money: 10, reputation: {}}, 'current time': calendar, inherited_traits: line,
        expansion: {sequence: 0, clock: 70 * GAME_YEAR, chronicle: c, rng: 1}, inventories: {person: {main_character: {}}, storage: {player: {}}}, availabilities: {location: {}}};
}

test('the heir carries a re-rooted line: same preview and save, heir is a cross of self and the other parent', () => {
    const line = sample(), prev = endedLife(line);
    const a = deriveHeirLeftovers(prev), b = deriveHeirLeftovers(prev);
    validateHeirLeftovers(a);
    assert.deepEqual(a.lineage, b.lineage);
    assert.ok(a.lineage.selfId && a.lineage.selfId !== 'self');
    const heir = a.lineage.members.find(m => m.id === a.lineage.selfId);
    assert.equal(heir.sire, 'self');
    assert.ok(a.lineage.members.length >= line.members.length + 2);
    const next = applyHeirLeftovers({character: {money: 0, reputation: {}}, inventories: {}, availabilities: {}, 'current time': calendar}, a);
    assert.equal(next.inherited_traits.selfId, a.lineage.selfId);
    if (a.inherited.length) assert.match(heirLeftoverLines(a).join('\n'), /Inherited from the line/);
    assert.equal(deriveHeirLeftovers(endedLife(undefined)).lineage, undefined);
});

test('native lineage effects are idempotent, preserve current vitals, and follow their embodiment', async()=>{
    await import('../src/lineage_domain.js');
    const {domainRegistry}=await import('../src/domain_registry.js');
    const {configureUiPorts}=await import('../src/ui_ports.js');
    const d=domainRegistry.list().find(d=>d.id==='inherited_traits'),line=sample();
    line.members.find(m=>m.id===line.selfId).genes.wind=['W','W'];
    const stats={multiplier:{}},root={actors:{player:{worldId:'base.frontier'}},simulation:{people:{player:{body:{id:'first',form:'human'}}}}};
    let full={max_health:100,health:50,max_stamina:100,stamina:60};
    const hero={getLevelableComponent:()=>({stats}),getFullStats:()=>full,getBioComponent:()=>({race:'human'}),updateStatsAndDisplay:()=>{full={...full,max_stamina:100*(stats.multiplier.inherited_qualities?.max_stamina??1)};}};
    configureUiPorts({character:()=>hero,expansion:()=>root});d.load(line);d.refresh();
    assert.equal(full.max_stamina,104);assert.equal(full.stamina,60);assert.equal(full.health,50);
    d.refresh();assert.equal(full.max_stamina,104,'refresh cannot stack the same inherited bonus');
    root.simulation.people.player.body.id='other';d.refresh();
    assert.equal(full.max_stamina,100,'a replacement body does not gain the former body’s genes');
    root.simulation.people.player.body.id='first';d.refresh();assert.equal(full.max_stamina,104);
    root.actors.player.worldId='another-world';d.refresh();assert.equal(full.max_stamina,104,'the same supported body keeps its physical qualities across passage');
    configureUiPorts(null);
});
