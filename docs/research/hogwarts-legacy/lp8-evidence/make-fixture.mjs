// Controlled prerequisites only. Never use a personal save as the base argument.
// Browser harness supplies its own freshly generated, disposable native envelope.
import fs from 'node:fs';
import {createExpansionState} from '../../../../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../../../../src/expedition_content.js';
import {beginBodyRecord} from '../../../../src/body_progression.js';
import {beginFeatureObjects} from '../../../../src/feature_expansion_objects_host.js';
import {validateSaveEnvelope} from '../../../../src/save_files.js';
const body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
const context=p=>({actorId:'player',external:p.external,gameplay:p.gameplay,vitals:p.vitals||{player:{health:100,max_health:100,stamina:100,max_stamina:100}},
    facts:{location:'Village','village.elderMet':true,'village.craftsmanMet':true},nativeBody:body,nativeAlive:true,nativeReady:true});
const save=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
let plan={state:initializeExpedition(createExpansionState(17)),external:{money:save.character.money},gameplay:{player:{inventory:{},skills:{},reputation:{}}}};
plan=beginBodyRecord(plan.state,registry,context(plan));plan.state.simulation.people.player.body=structuredClone(body);
plan=beginFeatureObjects(plan.state,registry,context(plan));
save.expansion=plan.state;
save.inventories.person.main_character[JSON.stringify({id:'Rough wood log'})]={count:3};
validateSaveEnvelope(save,save['game version']);
fs.writeFileSync(process.argv[3],JSON.stringify(save));
