import test from 'node:test';
import assert from 'node:assert/strict';
import {loadNative, STANCE_LOCATION_STUBS} from './helpers/native_loader.mjs';
import {mitigateCombatDamage, mitigateCombatDamageFromStats, rollCombatStrike} from '../src/combat_math.js';
import {resolveCausalStrike} from '../src/causal_story_core.js';
import {readNativeFighter, initializeNativeBattle, commitNativeBattleStrike} from '../src/native_battle.js';
import {initializePartyBattle, commitPartyBattleAction} from '../src/party_battle.js';
import {initializeFeatureBattle, featureBattleToken, featureFighterOwnership, commitFeatureBattleAction, FEATURE_HOOK} from '../src/feature_expansion_battle.js';
import {commitSimulationCommand} from '../src/simulation.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {createFieldFixture, joinField, fieldCommand, fieldAdvance, fieldContext} from '../scripts/field_fixtures.mjs';

const native = await loadNative(`export {character} from './src/data/character.js';
 export {Enemy,registerEnemyEquipmentItemFactory} from './src/enemies.js';
 export {item_templates,getItemFromKey} from './src/items.js';`, {stubs:STANCE_LOCATION_STUBS});
native.registerEnemyEquipmentItemFactory(native.getItemFromKey);
const armor = native.item_templates['Steel chainmail armor'];
const enemy = (stats={}, equipment_keys={}) => {
 const f = new native.Enemy({name:'Synthetic equipment case',stats:{health:30,max_stamina:30,attack:40,attack_points:1e6,agility:1,dexterity:1e6,intuition:1,crit_rate:0,crit_multiplier:2,...stats},equipment_keys});
 f.init(); return f;
};
const statsOf = actor => structuredClone(actor.getFullStats());
const attack = readNativeFighter(enemy());
const snap = stats => ({...attack,stats});
const context = p => fieldContext(p,'Village',{vitals:p.vitals || {player:{health:30,max_health:30,stamina:30,max_stamina:30}}});
const pending = () => fieldAdvance(fieldCommand(joinField(createFieldFixture()),'rival.begin'),3);
const duel = () => {const p=pending();return initializeNativeBattle(commitSimulationCommand(p.state,registry,{id:'rival.confront',requestId:p.state.simulation.pursuits['frontier.road_rival'].request.id},{...context(p),targetId:'roadRival'}));};
const party = () => {let p=joinField(createFieldFixture());p=fieldCommand(p,'party.meet');p=fieldAdvance(fieldCommand(p,'rival.begin'),3);return initializePartyBattle(p.state,registry,{requestId:p.state.simulation.pursuits['frontier.road_rival'].request.id},context(p));};

// P3 reusable case: unchanged seed/input, actual equipment source, B1-B4 loss delta.
test('P1 scenario: actual person and enemy source add/remove reaches native, party, causal and feature battle readers', () => {
 const hero=native.character;
 hero.updateStatsAndDisplay();
 const bare=statsOf(hero);
 hero.equipItem(armor);
 const geared=statsOf(hero);
 assert.ok(geared.damage_taken<1 && geared.min_damage_share<.05 && geared.crit_resistance>0);
 hero.unequipItem('torso');
 const removed=statsOf(hero);
 for(const k of ['defense','damage_taken','min_damage_share','crit_resistance'])assert.equal(removed[k],bare[k]);
 const foe=enemy({}, {torso:armor.getInventoryKey()});
 const foeGeared=statsOf(foe);
 assert.ok(foe.getEquipment().torso.getStats().damage_taken.multiplier<1);
 assert.ok(foeGeared.damage_taken<1);
 foe.equipment_keys={};foe.init();
 assert.equal(foe.getFullStats().damage_taken,1);
 assert.deepEqual(foe.getLevelableComponent().stats.multiplier.equipment,{});
 const subject=enemy();
 for(const [label,stats] of [['person',geared],['enemy',foeGeared]]) {
  // Same defense isolates the previously ignored dimensions from ordinary armor defense.
  const oldInput={...stats,damage_taken:1,min_damage_share:.05,crit_resistance:0};
  const expected=resolveCausalStrike({attacker:attack,target:snap(stats),random:()=>.5});
  assert.ok(expected.damage<resolveCausalStrike({attacker:attack,target:snap(oldInput),random:()=>.5}).damage,label+' causal dimensions');
  for(const actorId of ['player','roadRival']) {
   const p=duel(),targetId=actorId==='player'?'roadRival':'player';
   const run=s=>commitNativeBattleStrike(p.state,registry,{actorId,targetId,attacker:attack,target:snap(s)},context(p));
   const hp=p=>targetId==='player'?p.vitals.player.health:p.state.simulation.people[targetId].vitals.health;
   assert.ok(hp(run(stats))>hp(run(oldInput)),label+' duel '+targetId);
  }
  let p=party(),s=p.state.simulation.sessions.player;
  // Actual ally redirection must read that ally's dimensions, not the player's.
  p=commitPartyBattleAction(p.state,registry,{actorId:'partyPartner',type:'guard',targetId:'player',sessionId:s.id,sequence:p.state.sequence,action:s.nativeBattle.actions},context(p));
  s=p.state.simulation.sessions.player;
  const run=s0=>commitPartyBattleAction(p.state,registry,{actorId:'roadRival',type:'strike',targetId:'player',sessionId:s.id,sequence:p.state.sequence,action:s.nativeBattle.actions,fighters:{player:attack,roadRival:attack,partyPartner:snap(s0)}},context(p));
  const a=run(stats),b=run(oldInput);
  assert.equal(a.state.simulation.sessions.player.nativeBattle.lastTarget,'partyPartner');
  assert.ok(a.state.simulation.people.partyPartner.vitals.health>b.state.simulation.people.partyPartner.vitals.health,label+' party ally');
  p=joinField(createFieldFixture());p=fieldAdvance(fieldCommand(p,'feature_battle.inspect'),2);
  p=initializeFeatureBattle(p.state,registry,{id:'feature_battle.start'},context(p));
  const runFeature=s0=>{
   const token=featureBattleToken(p.state),fighters=p.state.simulation.sessions.player.nativeBattle.fighters;
   const bindings=Object.fromEntries(Object.keys(fighters).map(id=>{
    const v=id==='player'?context(p).vitals.player:p.state.simulation.people[id].vitals;
    const f=enemy({...v,attack:40});
    const snapshot=readNativeFighter(f);
    // Player binding is normally a Person snapshot. Copy only the actual defensive source values.
    if(id==='player')for(const k of ['defense','damage_taken','min_damage_share','crit_resistance'])snapshot.stats[k]=s0[k];
    return [id,{...token,ownerId:id,ownership:featureFighterOwnership(p.state,id),snapshot}];
   }));
   return commitFeatureBattleAction(p.state,registry,{...token,actorId:FEATURE_HOOK,type:'strike',targetIds:['player']},context(p),bindings);
  };
  assert.ok(runFeature(stats).vitals.player.health>runFeature(oldInput).vitals.player.health,label+' feature player');
 }
 // Both native actor types use the same effective defender seam and defense modifier.
 subject.getFullStats().damage_taken=.5;
 assert.equal(subject.takeDamage({damage_values:[10],defense_modifier:2}).damage_taken,4);
});

test('effective combat inputs retain ordinary defaults, explicit zero share, reduction floor and crit cap', () => {
 for(const values of [[10,.2],[200],[.2]])assert.equal(mitigateCombatDamageFromStats(values,{defense:3}),mitigateCombatDamage(values,3));
 assert.equal(mitigateCombatDamageFromStats([200],{defense:1000,min_damage_share:0,damage_taken:0}),.5);
 assert.equal(mitigateCombatDamageFromStats([200],{defense:1000,min_damage_share:.03,damage_taken:.9}),5.4);
 const attacker={attack_points:1e6,attack_count:1,crit_rate:1,crit_multiplier:2};
 const strike=(resistance,draw)=>rollCombatStrike({attackPower:100,attacker,target:{agility:0,intuition:1,crit_resistance:resistance},random:()=>draw});
 assert.equal(strike(0,.5).critted,true);
 assert.equal(strike(.75,.5).critted,false);
 assert.equal(strike(99,.24).critted,true); // resistance cap still leaves 25% of the original chance
 assert.equal(strike(99,.25).critted,false);
});

test('equipment zero multipliers survive aggregation and removal for real person and enemy sources', () => {
 const zeroItem={equip_slot:'torso',tags:{equippable:true},affixes:[],getDefense:()=>0,getStats:()=>({min_damage_share:{multiplier:0}}),getBonusSkillLevels:()=>({}),getInventoryKey:()=>armor.getInventoryKey()};
 const hero=native.character;hero.equipItem(zeroItem);assert.equal(hero.getFullStats().min_damage_share,0);hero.unequipItem('torso');assert.equal(hero.getFullStats().min_damage_share,.05);
 native.registerEnemyEquipmentItemFactory(()=>zeroItem);
 const f=enemy({}, {torso:'synthetic:zero'});assert.equal(f.getFullStats().min_damage_share,0);
 f.equipment_keys={};f.init();assert.equal(f.getFullStats().min_damage_share,.05);
 native.registerEnemyEquipmentItemFactory(native.getItemFromKey);
});
