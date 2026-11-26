import test from 'node:test';
import assert from 'node:assert/strict';
import {structuredQueueRepeatable as queued} from '../src/structured_queue_repeat.js';
import {wormLeadBus} from '../src/world_packs/book_worm_lead_bus.js';
import {guLeadEarlyRecovery} from '../src/world_packs/book_gu_lead_early_recovery.js';
const fact=(key,value)=>({type:'fact',scope:'actor',key,value});
const move=location=>({type:'relocate',actor:'player',location});
const eq=(fact,value)=>({fact,op:'eq',value});
const act=extra=>({actorId:'player',location:'room',duration:2,once:false,effects:[],...extra});
test('a quoted full refill offers one run for either rest or stone',()=>{
 const refills=guLeadEarlyRecovery.commands.filter(command=>command.durationRecovery);
 assert.equal(refills.length,2);
 for(const refill of refills)assert.equal(queued(refill,30),false,refill.label);
});
test('movement away suppresses queue, not future reuse; final return and NPC moves do not',()=>{
 assert.equal(queued(act({effects:[move('roof')]})),false);
 assert.equal(queued(act({effects:[move('roof'),move('room')]})),true);
 assert.equal(queued(act({effects:[{...move('roof'),actor:'tutor'}]})),true);
 assert.equal(queued(act({requires:eq('actor.location','room'),location:null,effects:[move('roof')]})),false);
});
test('only a proved phase refusal suppresses queue; ordinary farm and training work retain it',()=>{
 assert.equal(queued(act({requires:{all:[eq('native.ready',true),eq('actor.phase','inside')]},effects:[fact('phase','roof')]})),false);
 assert.equal(queued(act({visibleWhen:eq('actor.phase','inside'),effects:[fact('phase','roof')]})),false);
 assert.equal(queued(act({requires:{any:[eq('actor.phase','inside'),eq('actor.otherRoute',true)]},effects:[fact('phase','roof')]})),true);
 assert.equal(queued(act({requires:eq('native.ready',true),effects:[{type:'xp',skill:'Crafting',amount:1}]})),true);
 assert.equal(queued(act({costs:[{type:'item',actor:'player',key:'seed',amount:-1}],effects:[{type:'item',actor:'player',key:'crop',amount:1}]})),true);
 assert.equal(queued(act({once:true})),false);
 assert.equal(queued(act({queueRepeatable:false})),false);
});
test('unknown, dynamic and outcome effects retain existing guarded execution rather than guessing',()=>{
 assert.equal(queued(act({requires:eq('actor.phase','inside'),effects:[fact('phase',{expression:'next'})]})),true);
 assert.equal(queued(act({effects:[move('roof'),{type:'customRuntimeEffect'}]})),true);
 assert.equal(queued(act({effects:[move('roof')],outcomes:[{chance:1,effects:[move('room')]}]})),true);
 assert.equal(queued(act({effects:[move('room')],duration:0})),false);
});
test('actual Taylor transport cannot immediately repeat, while stationary inspection can',()=>{
 const command=name=>wormLeadBus.commands.find(c=>c.id.endsWith('.'+name));
 for(const name of ['leave_school','return_school','board_home','step_off','ride_home','inspect_ride','board_return','ride_return'])assert.equal(queued(command(name)),false,name);
 assert.equal(queued(command('inspect_washroom')),true);
 assert.equal(queued(command('put_washroom')),false);
 assert.equal(queued(command('take_washroom')),false);
});
