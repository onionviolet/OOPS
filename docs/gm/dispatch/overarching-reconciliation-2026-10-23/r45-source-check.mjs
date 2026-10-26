import assert from 'node:assert/strict';
import {createChronicle,advanceChronicle,GAME_YEAR} from '../../../../src/chronicle.js';
import {deriveHeirLeftovers} from '../../../../src/heir_inheritance.js';
import {buildLifeHeirSave} from '../../../../src/life_experience_host.js';
import {foundLine} from '../../../../src/lineage_traits.js';
const calendar={year:999,month:4,day:1,hour:8,minute:0,day_count:1};
const ended=advanceChronicle(createChronicle(0,calendar,true),62*GAME_YEAR);
const previous={character:{name:'Generated audit life',money:100,reputation:{}},'current time':calendar,
 expansion:{chronicle:ended,clock:62*GAME_YEAR,rng:7},inherited_traits:foundLine('r45-generated'),
 inventories:{person:{main_character:{}},storage:{player:{}}},village_career:{debt:10}};
const withoutKin=deriveHeirLeftovers(previous,{law:'primogeniture'});
assert.equal(withoutKin.heir,undefined);
assert.notEqual(withoutKin.lineage.selfId,previous.inherited_traits.selfId);
assert.equal(withoutKin.money,90);
const withKin=deriveHeirLeftovers(previous,{law:'primogeniture',kin:[{id:'child-a',name:'Generated child',relation:'child',age:20}]});
assert.equal(withKin.heir.id,'child-a');
const fresh={character:{name:'Fresh',money:102,reputation:{}},levels:{person:{main_character:{total_xp:0}}},
 'current time':calendar,expansion:{chronicle:null},inventories:{person:{main_character:{}},storage:{player:{}}}};
const next=buildLifeHeirSave(previous,fresh,withoutKin);
assert.equal(next.character.money,192);
assert.ok(next.inherited_traits);
console.log(JSON.stringify({status:'PASS',scope:'pure generated-data source probe, no browser or personal save',
 lineageProducerPresent:true,lawWithoutExplicitKinNamesHeir:false,explicitKinNamesHeir:true,
 lineageReroots:true,kitDebtSettled:10,estateMoney:90,heirPurse:192},null,2));
