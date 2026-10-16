import test from 'node:test';
import assert from 'node:assert/strict';
import {combatFactEntries,readNativeCombatFocus,chooseCombatFocus} from '../src/combat_focus.js';
test('combat focus retains native zero values, units and multiple-hit text without recomputing stats',()=>{
    assert.deepEqual(combatFactEntries(['Atk: 4dmg x2','| Spd: 0.82','| Hit: 22%','| Ddg: 10%','| Def: 0']),[
        {label:'Attack',value:'4 dmg x2'},{label:'Speed',value:'0.82 /s'},{label:'Hit you',value:'22%'},{label:'Evade you',value:'10%'},{label:'Defense',value:'0'}]);
    assert.deepEqual(combatFactEntries(['','Unassessed','HP:']),[]);
});
test('native reader exposes only existing renderer facts, with no inferred level or hidden model',()=>{
    const cell=text=>({textContent:text});
    const row={id:'defender_1_div',querySelector:selector=>({'.fighter_name':cell('Known opponent'),'.health_value':cell('0/20 hp'),'[data-attack_bar]':{style:{width:'42%'}}}[selector]),querySelectorAll:selector=>selector==='.enemy_stat'?[cell('Def: 0')]:[]};
    assert.deepEqual(readNativeCombatFocus({querySelectorAll:()=>[row]}),[{id:'defender_1_div',name:'Known opponent',role:'Current opponent',hp:'0/20 hp',healthProgress:null,facts:[{label:'Defense',value:'0'}],stats:'Def: 0',attackProgress:42}]);
    assert.deepEqual(readNativeCombatFocus(null),[]);
});
test('opponent inspection selects an existing native row without changing roster and falls back after removal',()=>{
    const roster=[{id:'a',hp:'2/3 hp'},{id:'b',hp:'4/5 hp'}],before=structuredClone(roster);
    assert.equal(chooseCombatFocus(roster,'b'),roster[1]);assert.equal(chooseCombatFocus(roster,'missing'),roster[0]);
    assert.equal(chooseCombatFocus([],null),null);assert.deepEqual(roster,before);
});
test('contextual percentages keep their direction and native AP/EP remain ratings',()=>{
    assert.deepEqual(combatFactEntries(['| Hit: 0%','| Ddg: 100%','| AP: 23','| EP: 0']),[
        {label:'Hit you',value:'0%'},{label:'Evade you',value:'100%'},{label:'Attack rating',value:'23'},{label:'Evasion rating',value:'0'}]);
    const row={id:'defender_0_div',dataset:{playerHitChance:'85%'},querySelector:()=>null,querySelectorAll:()=>[]};
    assert.deepEqual(readNativeCombatFocus({querySelectorAll:()=>[row]})[0].facts,[{label:'You hit them',value:'85%'}]);
});
