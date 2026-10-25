import test from 'node:test';
import assert from 'node:assert/strict';
import {beginAttempt, enemySpecification, planExchange, planSettlement, finishAttempt, AREA_ID, WORLD_ID, ENEMY_ID} from '../src/absorb_p23/encounter_profiles/profile.js';
import {trainingEnemy, initialTrainingEncounter, validateTrainingEnvelope} from '../src/absorb_p23/host_joins/encounter_profiles.js';
class Enemy {
    constructor(spec) {Object.assign(this,spec);this.stats.max_health=this.stats.health;this.full={...this.stats};}
    init(){this.full.attack_power=this.stats.attack;this.full.attack_points=this.stats.dexterity*Math.sqrt(this.stats.intuition);this.full.evasion_points=this.stats.agility*Math.sqrt(this.stats.intuition);}
    getFullStats(){return this.full;}
}
const context={worldId:WORLD_ID,locationId:AREA_ID,nativeEligible:true};
const profile=seed=>beginAttempt(undefined,{...context,seed});
const save=(p)=>({p23EncounterProfile:p,'current location':AREA_ID,native_encounter:initialTrainingEncounter(p,Enemy),
    expansion:{clock:5,streams:{},proto23Village:{activeVisitId:1},actors:{player:{worldId:WORLD_ID}},simulation:{people:{player:{location:AREA_ID}}}},
    locations:{[AREA_ID]:{}},availabilities:{location:{[AREA_ID]:1}}});
test('saved training restores actual per-seed rank, XP and damaged health rather than placeholder rank',()=>{
    const levels=new Set();
    for(let seed=0;seed<40;seed++) {
        const p=profile(seed),s=save(p),row=s.native_encounter.enemies[0];row.full.health--;
        assert.equal(validateTrainingEnvelope(s),true);
        const restored=trainingEnemy(p,Enemy,row),spec=enemySpecification(p);levels.add(restored.rank);
        assert.equal(restored.rank,spec.rank);assert.equal(restored.xp_value,spec.xp_value);assert.equal(restored.getFullStats().health,row.full.health);
        assert.equal(restored.templateKey,ENEMY_ID);assert.equal(restored.tags.training,true);
    }
    assert.deepEqual([...levels].sort(),[1,2,3]);
});
test('pending native encounter rejects missing identity, wrong stats, absent profile and unearned exchange cursor',()=>{
    for(const mutate of [s=>{s.native_encounter.key+='x';},s=>{s.native_encounter.enemies[0].stats.attack++;},s=>{delete s.p23EncounterProfile;},s=>{s.p23EncounterProfile=planExchange(s.p23EncounterProfile,{...context,stanceId:'normal'}).state;}]){
        const s=save(profile(3));mutate(s);assert.throws(()=>validateTrainingEnvelope(s));
    }
});
test('completed and abandoned attempts restore only off the training area with matching native progress',()=>{
    const p=profile(3),plan=planSettlement(p,{...context,eventId:'p23.reed-circle:1:kill',rank:p.pending.level,defeated:true,dropChanceModifier:100});
    const s=save(p);s.p23EncounterProfile=finishAttempt(plan.state,context);s['current location']='Proto23 Dojo lobby';s.native_encounter=null;s.expansion.simulation.people.player.location=s['current location'];s.locations[AREA_ID].enemy_groups_killed=1;
    s.p23EncounterReceipt={schema:1,eventId:plan.eventId,attempt:1,seed:p.pending.seed,level:p.pending.level,clock:5,completed:1,dropChanceModifier:100,loot:plan.loot};
    assert.equal(validateTrainingEnvelope(s),true);
    const missing=structuredClone(s);delete missing.p23EncounterReceipt;assert.throws(()=>validateTrainingEnvelope(missing));
    const next=beginAttempt(s.p23EncounterProfile,{...context,seed:4});s.p23EncounterProfile=finishAttempt(next,{...context,abandon:true});assert.equal(validateTrainingEnvelope(s),true);
    s.locations[AREA_ID].enemy_groups_killed++;assert.throws(()=>validateTrainingEnvelope(s));
});
test('old schema saves need no optional training records',()=>{
    assert.equal(validateTrainingEnvelope({'current location':'Village'}),true);
    assert.throws(()=>validateTrainingEnvelope({'current location':AREA_ID}));
});
