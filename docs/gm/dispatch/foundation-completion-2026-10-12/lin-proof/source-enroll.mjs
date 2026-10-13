import fs from 'node:fs';
import {expeditionRegistry as registry} from '../../../../../src/expedition_content.js';
import {commitNestedCommand,previewNestedCommand} from '../../../../../src/feature_expansion_nested_host.js';
import {validateRemainderConsequences} from '../../../../../src/audit_remainder_consequences_facts.js';
const native=JSON.parse(fs.readFileSync('/tmp/yairpg-lin-before-enroll.json')),state=native.expansion;
const context={actorId:'player',worldId:'base.frontier',external:{money:102},gameplay:{player:{inventory:{},skills:{},reputation:{}}},vitals:{player:{health:60,max_health:60,stamina:40,max_stamina:40}},facts:{location:'Village'},nestedNative:{bound:true,body:{id:'native.player.body',form:'human'},revision:0}};
const before={schema:state.schema,auditRemainder:state.auditRemainder||null,controllers:Object.keys(state.simulation.controllers)};
const preview=previewNestedCommand(state,registry,'nested.enroll',context);
const plan=commitNestedCommand(state,registry,'nested.enroll',context,state.sequence);
const staged={schema:plan.state.schema,auditRemainder:plan.state.auditRemainder||null,controllers:Object.keys(plan.state.simulation.controllers)};let failure=null;try{validateRemainderConsequences(plan.state,registry)}catch(e){failure=e.message}
const receipt={before,preview,staged,foreignControllers:staged.controllers.filter(x=>!before.controllers.includes(x)&&!x.startsWith('nested.')),failure};fs.writeFileSync(new URL('./SOURCE_ENROLL.json',import.meta.url),JSON.stringify(receipt,null,2));console.log(receipt);
