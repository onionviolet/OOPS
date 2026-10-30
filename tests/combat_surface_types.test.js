// Damage types in tempo fights and the one fight surface (docs/representations/COMBAT.md round 3).
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {typedStrike, typedHit, typeSnapshot, declareWorldDamageTypes, damageTypeLabel, mixText, normalizeMix} from '../src/damage_types.js';
import {mitigateCombatDamageFromStats} from '../src/combat_math.js';
import {tempoSituation, typeChips} from '../src/ui/combat_situation.js';
import {versusText} from '../src/ui/combat_versus.js';
import {TEMPO_VIEW, TEMPO_FIXTURE} from '../src/ui/preview/fixtures/combat.js';

// The tempo half waits on p4-fights applying the typing patch to src/tempo_fight.js; it turns on by itself once typedHit is called there.
const TEMPO_TYPED = /typedHit\(/.test(readFileSync(new URL('../src/tempo_fight.js', import.meta.url), 'utf8'));
const WAITS = TEMPO_TYPED ? false : 'waits on the tempo typing patch (p4-fights, COMBAT.md round 3 receipt)';
const hero = weapon => ({tags: {main_character: true}, getEquipment: () => (weapon ? {weapon: {weapon_type: weapon}} : {})});
const crab = {tags: {}, defense_types: {slashing: .8, piercing: .7, bludgeoning: 1.2}};

test('typedHit on a snapshot equals typedStrike on the live actors, and its split sums to 1', () => {
    for (const weapon of [null, 'sword', 'spear', 'hammer']) {
        const live = typedStrike({fighter: hero(weapon), target: crab});
        const saved = typedHit(typeSnapshot(hero(weapon)).attack, typeSnapshot(crab).defense);
        assert.equal(saved.multiplier, live.multiplier, String(weapon));
        assert.equal(saved.kind, live.kind); assert.equal(saved.note, live.note);
        assert.ok(Math.abs(Object.values(saved.split).reduce((a, b) => a + b, 0) - 1) < 1e-12);
    }
});

test('a fight saved before types reads as untyped physical with the old math', () => {
    assert.deepEqual(typedHit(undefined, undefined), {multiplier: 1, kind: 'physical', note: '', split: {physical: 1}});
    const stats = {defense: 2, min_damage_share: .05, damage_taken: 1};
    assert.equal(mitigateCombatDamageFromStats([9, 7], stats, 0, 0, typedHit().multiplier), mitigateCombatDamageFromStats([9, 7], stats, 0, 0));
});

test('a native hit is typed once: the multiplier scales the mitigated hit a single time', () => {
    const stats = {defense: 1, min_damage_share: .05, damage_taken: 1}, m = typedStrike({fighter: hero('hammer'), target: crab}).multiplier;
    const plain = mitigateCombatDamageFromStats([20], stats, 0, 0);
    assert.equal(mitigateCombatDamageFromStats([20], stats, 0, 0, m), Math.round(10 * plain * m) / 10);
    // Each path has one typing call: native combat through typedStrike, the tempo contest through typedHit.
    const native = readFileSync(new URL('../src/models/combat.js', import.meta.url), 'utf8');
    const tempo = readFileSync(new URL('../src/tempo_fight.js', import.meta.url), 'utf8');
    assert.equal((native.match(/typedStrike\(/g) || []).length, 1); assert.ok(!/typedHit/.test(native));
    assert.ok(!/typedStrike/.test(tempo));
    if (TEMPO_TYPED) assert.equal((tempo.match(/typedHit\(/g) || []).length, 1);
    // The frame stays structural (M1): no harm step there.
    assert.ok(!/damage_types|typed/.test(readFileSync(new URL('../src/conflict_frame.js', import.meta.url), 'utf8')));
});

test('world names: declared rows rename or add types; undeclared worlds keep the plain names', () => {
    declareWorldDamageTypes('fixture-world', {necrotic: {name: 'curse', glyph: '☾'}, mystic: {name: 'mystical harm'}, 'Bad id': {name: 'x'}});
    assert.deepEqual(damageTypeLabel('necrotic', 'fixture-world'), {name: 'curse', glyph: '☾'});
    assert.equal(damageTypeLabel('necrotic', 'other-world').name, 'necrotic');
    assert.equal(damageTypeLabel('necrotic').name, 'necrotic');
    assert.deepEqual(normalizeMix({mystic: 1}), {mystic: 1});   // a world's own id is valid in a mix
    assert.equal(mixText({necrotic: 3, slashing: 1}, 'fixture-world'), 'curse 75% · slashing 25%');
    assert.equal(mixText(null), 'physical 100%');
});

test('tempo mode: learned types are plain, revealed ones carry their source, the dev readout splits each hit', () => {
    const [warden, cutter] = TEMPO_FIXTURE.versus.opponents;
    assert.deepEqual(warden.types.map(t => [t.word, t.source]), [['resists slashing', 'learned']]);
    assert.deepEqual(cutter.types.map(t => [t.word, t.source]), [['weak to bludgeoning', 'insight'], ['resists piercing', 'insight']]);
    assert.equal(TEMPO_FIXTURE.versus.you.mix, 'slashing 70% · piercing 30%');
    assert.equal(TEMPO_FIXTURE.moves[0].mixText, 'slashing 70% · piercing 30%');
    assert.match(TEMPO_FIXTURE.dev[0], /You → Ford warden \[body\]: 3\.6 at x0\.9 \(slashing 65%, piercing 35%\)/);
    assert.deepEqual(tempoSituation(TEMPO_VIEW, {}).dev, []);   // the readout is off outside dev
    const text = versusText(TEMPO_FIXTURE.versus);
    assert.match(text, /Ford warden\. Hurt\. .*resists slashing\./);
    assert.match(text, /weak to bludgeoning \(◈ insight\)/);
    // A learned row wins over a revealed one for the same type; nothing unmarked comes from a reveal.
    const both = typeChips({piercing: 'normal'}, {reveal: {source: 'insight', defense: {piercing: .5}}});
    assert.deepEqual(both.map(t => [t.word, t.source]), [['takes normal piercing', 'learned']]);
    assert.ok(typeChips({}, {reveal: {defense: {fire: 2}}}).every(t => t.source !== 'learned'));
});

test('dev hit readout accepts legacy fields and omits absent type metadata', () => {
    const view = {fight: {...TEMPO_VIEW.fight, hits: [
        {actor: 'You', target: 'Ford warden', slot: 'leg', dmg: 0},
        {actor: 'You', foe: 'Ford warden', dealt: 2, multiplier: 0, split: {physical: 1}},
    ]}};
    assert.deepEqual(tempoSituation(view, {dev: true}).dev, [
        'You → Ford warden [leg]: 0', 'You → Ford warden: 2 at x0 (physical 100%)',
    ]);
    assert.deepEqual(TEMPO_FIXTURE.aims, TEMPO_VIEW.fight.aims);
    assert.equal(TEMPO_FIXTURE.aim, null);
});

test('no fight, or a settled one, hides tempo mode', () => {
    assert.equal(tempoSituation(null).active, false);
    assert.equal(tempoSituation({fight: {...TEMPO_VIEW.fight, foes: []}}).active, false);
});

// Engine: the tempo contest deals typed harm (M1), and a fight with no type snapshot keeps the old wording and math.
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {createFieldFixture, joinField, fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight, commitTempoMove, tempoView} from '../src/tempo_fight.js';

const fstats = {attack_points: 400, agility: 5, intuition: 5, defense: 0, attack_count: 1, crit_rate: 0, crit_multiplier: 1.5, stamina_efficiency: 1};
const fprofile = types => ({stats: fstats, attackPower: 6, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5, ...(types ? {types} : {})});
function contest(types) {
    const p = joinField(createFieldFixture()); p.state.simulation.seed = 11;
    const context = fieldContext(p, 'Village', {vitals: {player: {health: 60, max_health: 60, stamina: 30, max_stamina: 30}}});
    const fighters = [{id: 'player', name: 'You', side: 'a', speed: 100, hp: 60, stamina: 30, profile: fprofile(types?.you), perception: 20, stealth: 20},
        {id: 'foe1', name: 'Crab', side: 'b', speed: 50, hp: 200, stamina: 30, profile: fprofile(types?.foe), perception: 20, stealth: 20}];
    let plan = beginTempoFight(p.state, registry, context, {id: 'fx-types', title: 'Typed scuffle', conditions: {}, fighters});
    for (let i = 0; i < 6 && plan.state.simulation.sessions.player; i++) plan = commitTempoMove(plan.state, registry, context, {moveId: 'jab'});
    return plan.state.simulation.sessions.player.nativeBattle;
}
const playerHits = b => (b.hits || []).filter(h => h.actor === 'You' && h.target === 'Crab');

test('tempo strikes deal typed harm, teach the foe row, record the split, and survive a reload', {skip: WAITS}, () => {
    const plain = contest(null), weak = contest({you: {attack: {bludgeoning: 1}, defense: {}}, foe: {attack: {physical: 1}, defense: {bludgeoning: 1.5}}});
    const untypedHits = playerHits(plain), typedHits = playerHits(weak);
    assert.ok(untypedHits.length >= 2 && untypedHits.length === typedHits.length, 'same keyed rolls in both fights');
    untypedHits.forEach((h, i) => {
        const typed = typedHits[i];
        assert.equal(typed.slot, h.slot, 'same keyed location roll');
        assert.equal(typed.multiplier, 1.5);
        const expected = Math.round(10 * h.dmg * typed.multiplier) / 10;
        assert.ok(Math.abs(typed.dmg - expected) <= .100000001, `${h.slot}: ${h.dmg} -> ${typed.dmg}, expected ${expected}`);
    });
    assert.ok(weak.log.some(l => /for [\d.]+ bludgeoning(?: \(critical\))?, weak spot\./.test(l)));
    assert.deepEqual(weak.fighters.foe1.learned, {bludgeoning: 'weak spot'});
    assert.equal(weak.hits.at(-1).multiplier, 1.5); assert.deepEqual(weak.hits.at(-1).split, {bludgeoning: 1});
    const v = tempoView(weak);
    assert.deepEqual(v.you.mix, {bludgeoning: 1}); assert.deepEqual(v.foes[0].learned, {bludgeoning: 'weak spot'});
    assert.deepEqual(v.moves.find(m => m.id === 'jab').mix, {bludgeoning: 1});
    // Untyped saved fights keep location records without type words or learned rows.
    assert.ok(plain.log.every(l => !/physical|weak spot|resisted/.test(l)));
    assert.equal(plain.fighters.foe1.learned, undefined);
});

test('a typed open fight saves and reloads exactly', {skip: WAITS}, () => {
    const p = joinField(createFieldFixture()); p.state.simulation.seed = 5;
    const context = fieldContext(p, 'Village', {vitals: {player: {health: 60, max_health: 60, stamina: 30, max_stamina: 30}}});
    let plan = beginTempoFight(p.state, registry, context, {id: 'fx-save', title: 'Typed scuffle', conditions: {}, fighters: [
        {id: 'player', name: 'You', side: 'a', speed: 100, hp: 60, stamina: 30, profile: fprofile({attack: {slashing: 1}, defense: {}}), perception: 20, stealth: 20},
        {id: 'foe1', name: 'Crab', side: 'b', speed: 100, hp: 300, stamina: 30, profile: fprofile({attack: {bludgeoning: 1}, defense: {slashing: .5}}), perception: 20, stealth: 20}]});
    plan = commitTempoMove(plan.state, registry, context, {moveId: 'jab'});
    const loaded = loadExpansionState(JSON.parse(JSON.stringify(plan.state)), registry);
    assert.deepEqual(loaded.simulation.sessions.player.nativeBattle, plan.state.simulation.sessions.player.nativeBattle);
});

test('LOTM is the first world with its own type words; other worlds keep plain names', () => {
    assert.equal(damageTypeLabel('necrotic', 'lotm').name, 'curse');
    assert.equal(damageTypeLabel('mystical', 'lotm').name, 'mystical harm');
    assert.equal(damageTypeLabel('slashing', 'lotm').name, 'slashing');
    assert.equal(damageTypeLabel('necrotic', 'frontier').name, 'necrotic');
});
