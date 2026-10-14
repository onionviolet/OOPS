// Disposable synthetic setup, not B2's fixture lane. Run after capturing a fresh
// named hero into /private/tmp/rt-slice1-base.json. Real engine settles town work;
// real save encoder/validator and native literal-file load admit each envelope.
import fs from 'node:fs';
import {commitAction,advanceSimulation} from '../../../../../src/expansion_engine.js';
import {expeditionRegistry} from '../../../../../src/expedition_content.js';
import {persistExpansionPlan} from '../../../../../src/expansion_persistence.js';
import {encodeSaveFile,validateSaveEnvelope} from '../../../../../src/save_files.js';
const base=JSON.parse(fs.readFileSync('/private/tmp/rt-slice1-base.json','utf8'));
base.global_flags.is_crafting_unlocked=true;
for(const id of ['Rough wood log','Iron ingot']) {
 base.inventories.person.main_character[JSON.stringify({id})]={count:100};
 base.item_log[id]={id,number:100,quality_highest:0,quality_lowest:0};
}
let plan={state:base.expansion,external:{money:base.character.money},gameplay:{player:{inventory:Object.fromEntries(Object.entries(base.inventories.person.main_character).map(([k,v])=>[k,v.count])),reputation:{...base.character.reputation},skills:{Perception:{xp:0,parent:null,enabled:true}}}}};
const act=(id,location)=>{plan=commitAction(plan.state,expeditionRegistry,id,{actorId:'player',worldId:'base.frontier',external:plan.external,gameplay:plan.gameplay,facts:{location,'village.elderMet':true}});};
act('town.begin','Town outskirts');act('town.brief','Town square');act('town.scout','Forest road');
plan=advanceSimulation(plan.state,expeditionRegistry,4,plan.external,plan.gameplay);
act('town.settle','Town square');
const prepared=JSON.parse(persistExpansionPlan(plan,{createSave:()=>JSON.stringify(base),storage:{setItem(){}},key:'fixture',bindings:{player:{category:'person',id:'main_character'}}}));
prepared.availabilities.location['Town square']=1;
for(const [band,xp] of [['novice',Math.round(100*40*(1-1.5**10)/(1-1.5))/100-0.01],['master',Math.round(100*40*(1-1.5**50)/(1-1.5))/100]]) {
 const s=structuredClone(prepared);for(const skill of ['Woodworking','Forging'])s.levels.person.main_character.skill_xp[skill]=xp;
 validateSaveEnvelope(s,s['game version']);fs.writeFileSync(`/private/tmp/rt-slice1-${band}.txt`,encodeSaveFile(JSON.stringify(s)));
}
const old=structuredClone(base);delete old.expansion.actors.player.facts['town.returned'];validateSaveEnvelope(old,old['game version']);fs.writeFileSync('/private/tmp/rt-slice1-old.txt',encodeSaveFile(JSON.stringify(old)));
console.log('Created novice/master and absent-fact controls in /private/tmp through engine + save encoder/validator.');
