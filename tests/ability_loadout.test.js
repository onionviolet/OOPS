import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {VILLAGE_ABILITY_LOADOUT as village} from '../src/data/ability_loadout.js';
import {abilitySlots,emptyAbilityLoadout,loadoutRecovery,quoteAbilitySwap,readAbilityLoadout} from '../src/ability_loadout.js';

const fixture=name=>JSON.parse(readFileSync(new URL('./fixtures/'+name,import.meta.url),'utf8').replace(/^\uFEFF/,''));
const {azarinth,dragoneye,hwfwm}=fixture('ability-loadout-canon.json');
const quote=(rule,state,group,id,options)=>quoteAbilitySwap(rule,state,{group,id,clock:0,...options});

test(azarinth.source,()=>{
    const state=emptyAbilityLoadout(azarinth);
    assert.equal(azarinth.groups.passive.capacity,5);
    assert.match(quote(azarinth,state,'active','hunters-sight').reason,/replace/);
    const {next}=quote(azarinth,state,'active','hunters-sight',{replace:'a1'});
    assert.deepEqual(next.slots.active,['hunters-sight','a2','a3','a4','a5']);
    assert.deepEqual(next.slots.passive,state.slots.passive);
    assert.equal(state.slots.active[0],'a1');
});

test(dragoneye.source,()=>{
    const state=emptyAbilityLoadout(dragoneye);
    assert.deepEqual(abilitySlots(dragoneye,state,'second',0),['class-skill']);
    const second=quote(dragoneye,state,'second','new-class-skill',{replace:'class-skill'}).next;
    assert.deepEqual(abilitySlots(dragoneye,second,'second',0),['new-class-skill']);
    assert.deepEqual(abilitySlots(dragoneye,second,'first',0),['class-skill']);
    assert.match(quote(dragoneye,second,'general','offer').reason,/replace/);
    const dropped=quote(dragoneye,second,'general','offer',{replace:'cleaning'});
    assert.equal(dropped.next.levels.cleaning,1);
    const retaken=quote(dragoneye,dropped.next,'general','cleaning',{replace:'offer'});
    assert.equal(retaken.next.levels.cleaning,1);
    assert.equal(retaken.next.slots.general.length,8);
});

test(hwfwm.source,()=>{
    const state=emptyAbilityLoadout(hwfwm);
    assert.match(quote(hwfwm,state,'essence-a','borrowed',{replace:'bound-a'}).reason,/donor/);
    assert.match(quote(hwfwm,state,'essence-b','borrowed',{replace:'bound-b',donors:['test-donor']}).reason,/valid/);
    const next=quote(hwfwm,state,'essence-a','borrowed',{replace:'bound-a',donors:['test-donor']}).next;
    assert.deepEqual(next.slots,{'essence-a':['borrowed'],'essence-b':['bound-b']});
});

test('A legacy Village save loads an ordinary sleep slot and a scheduled swap round-trips',()=>{
    const old=fixture('skill-evolution-a2c.json');
    const start=readAbilityLoadout(village,old.ability_loadout);
    assert.deepEqual(start,emptyAbilityLoadout(village));
    const {next,cost}=quote(village,start,'active','steady-breath',{replace:'ordinary-sleep',clock:25});
    assert.deepEqual(cost,{minutes:12});
    const restored=readAbilityLoadout(village,JSON.parse(JSON.stringify(next)));
    assert.deepEqual(abilitySlots(village,restored,'active',36),['ordinary-sleep']);
    assert.equal(quote(village,restored,'active','gentle-position',{replace:'ordinary-sleep',clock:36}).wait,1);
    assert.deepEqual(abilitySlots(village,restored,'active',37),['steady-breath']);
    assert.deepEqual(loadoutRecovery(village,restored,'active',36,'sleepStamina',10),[]);
    assert.deepEqual(loadoutRecovery(village,restored,'active',37,'sleepStamina',10),[{name:'Steady breath',amount:3}]);
    assert.deepEqual(loadoutRecovery(village,restored,'active',40,'sleepStamina',1),[{name:'Steady breath',amount:1}]);
    assert.throws(()=>readAbilityLoadout(village,{...restored,slots:{active:['other']}}),/Invalid ability slots/);
});
