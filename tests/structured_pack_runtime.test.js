import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState, createContentRegistry, advanceSimulation} from '../src/expansion_engine.js';
import {compileStructuredPack, mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {beginStructuredCampaign,structuredCampaignView,structuredActionCosts} from '../src/structured_pack_runtime.js';
import {requireStructuredContent, validateStructuredEnvelope} from '../src/structured_pack_state.js';
import {commitSimulationCommand, cancelSimulationJob, previewSimulationCommand, simulationFacts} from '../src/simulation.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
import {writeGameplayToEnvelope} from '../src/gameplay_transactions.js';

const key = id => JSON.stringify({id: 'atelier.' + id});
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const command = (id, extra) => ({id: 'atelier.' + id, revision: 1, label: id, worldId: 'atelier.world', actorId: 'player', location: 'atelier.room', audience: ['$actor'], costs: [], effects: [], reservationReturns: 1, ...extra});
function fixture() {
    return {
        schema: 2, id: 'atelier', revision: 1,
        compatibility: {legacy: 'preserve-dormant', origin: 'mandatory'}, capabilities: ['native-stock', 'custody', 'jobs', 'recipient-care'],
        world: {id: 'atelier.world', label: 'Original workshop'},
        locations: [{id: 'atelier.room', label: 'Workroom', description: 'A synthetic workroom.'}],
        items: ['worn', 'fitted'].map(id => ({id: 'atelier.' + id, label: id, description: 'A counted strap variant.'})),
        units: [{id: 'atelier.strap', titleOwner: 'atelier.issuer', titleClaimId: 'atelier.title', keys: [key('worn'), key('fitted')]}],
        simulation: {
            people: ['issuer', 'recipient'].map(id => ({id: 'atelier.' + id, revision: 1, label: id, worldId: 'atelier.world', location: 'atelier.room', inventory: 'simulation', provision: false, body: {form: 'human'}, vitals: {health: 4, max_health: 10, stamina: 10, max_stamina: 10}})),
            conditions: [{id: 'atelier.cut', revision: 1, label: 'Cut'}],
            commands: [
                command('repair', {targetId: 'atelier.issuer', coLocated: true, participants: ['$target'], duration: 2, cancellation: 'refund', costs: [{type: 'item', actor: 'atelier.issuer', key: key('worn'), amount: -1}], effects: [{type: 'item', actor: 'atelier.issuer', key: key('fitted'), amount: 1}, {type: 'xp', skill: 'Crafting', amount: 1}]}),
                command('sign', {targetId: 'atelier.recipient', coLocated: true, participants: ['$target'], once: true, effects: [{type: 'knowledge', key: 'atelier.signature', stage: 'seen', value: 'The recipient confirmed the delivery.'}]}),
                command('communicate', {targetId: 'atelier.issuer', coLocated: true, participants: ['$target'], once: true, requires: eq('knowledge.atelier.signature.seen'), effects: [{type: 'knowledge', actor: 'atelier.issuer', key: 'atelier.report', stage: 'seen', value: 'The recipient confirmed the delivery.'}, {type: 'resource', key: 'coins', amount: 3}]}),
                command('service', {targetId: 'atelier.recipient', requires: {all: [eq('target.condition.atelier.cut', 0), {fact: 'target.vital.health', op: 'gte', value: 8}]}})
            ]
        },
        presentation: {people: Object.fromEntries(['issuer', 'recipient'].map(id => ['atelier.' + id, {introductionKnowledgeKey: 'atelier.' + id + '.met'}])), status: []},
        bootstrap: {id: 'atelier.start', locationId: 'atelier.room', description: 'An independent synthetic beginning.', effects: [{type: 'item', actor: 'atelier.issuer', key: key('worn'), amount: 1}, {type: 'claim', actor: 'atelier.issuer', key: 'atelier.title', operation: 'acquire'}, {type: 'condition', actor: 'atelier.recipient', id: 'atelier.cut', operation: 'apply', intensity: 1}]}
    };
}
const bindings = {player: {category: 'person', id: 'main_character'}};
function setup(raw = fixture()) {
    const registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}]});
    const compiled = compileStructuredPack(raw, registry); mergeStructuredPack(compiled, registry);
    const definition = {...compiled.definition, contentHash: 'sha256:' + 'a'.repeat(64)};
    const before = createExpansionState(123);
    const context = {registry, actorId: 'player', worldId: 'base.frontier', external: {money: 0}, gameplay: {player: {inventory: {}, skills: {Crafting: {xp: 0, enabled: true}}, reputation: {}}}, vitals: {player: {health: 10, max_health: 10, stamina: 10, max_stamina: 10}}, facts: {location: 'atelier.room'}, nativeBody: {id: 'native.player.body', form: 'human'}, busy: false};
    const {plan, record} = beginStructuredCampaign(before, definition, context, null);
    return {registry, definition, before, context: {...context, worldId: 'atelier.world', gameplay: plan.gameplay}, plan, record};
}
function envelope(plan, record) {
    const save = {character: {money: 0}, expansion: plan.state, content_packs: {schema: 1, packs: {}, structured: record}, 'current location': 'atelier.room', inventories: {person: {main_character: {}}}, levels: {person: {main_character: {}}}};
    writeGameplayToEnvelope(save, plan.gameplay, bindings); return save;
}
const run = (f, id, state = f.plan.state, gameplay = f.plan.gameplay) => commitSimulationCommand(state, f.registry, {id: 'atelier.' + id}, {...f.context, gameplay, targetId: f.definition.simulation.commands.find(c => c.id === 'atelier.' + id).targetId});

test('first initialization is staged once and never converts scalar legacy history', () => {
    const f = setup(), legacy = {schema: 1, packs: {old: {worldId: 'old.world', locationIds: ['old.room'], active: false, values: {stock: 9, paid: 2}, job: null}}}, prior = structuredClone(legacy);
    assert.equal(f.before.simulation, null);
    assert.equal(f.plan.state.simulation.owners['atelier.issuer'][key('worn')], 1);
    assert.deepEqual(legacy, prior);
    assert.throws(() => beginStructuredCampaign(f.plan.state, f.definition, f.context, f.record), /unoccupied/);
    requireStructuredContent(f.record, new Map([[f.definition.id, f.definition]]));
    assert.throws(() => requireStructuredContent(f.record, new Map()), /Restore/);
    validateStructuredEnvelope(envelope(f.plan, f.record));
    const baseline = envelope(f.plan, f.record); baseline.expansion = f.before; baseline.content_packs = legacy; baseline['current location'] = 'Village';
    f.plan.nativePatch.content_packs = {...legacy, structured: f.record};
    let saved;
    persistExpansionPlan(f.plan, {createSave: () => JSON.stringify(baseline), storage: {setItem(key, value) {saved = JSON.parse(value);}}, key: 'test', bindings, validateEnvelope: validateStructuredEnvelope});
    assert.deepEqual(saved.content_packs.packs, prior.packs);
    assert.equal(saved.content_packs.packs.old.units, undefined);
    assert.equal(saved.content_packs.structured.units.length, 1);
});

test('receipt start, future time, instance and native domain mismatches reject', () => {
    const f = setup();
    const wrongStart = {...f.record, startId: 'atelier.other'};
    assert.throws(() => requireStructuredContent(wrongStart, new Map([[f.definition.id, f.definition]])), /Restore/);
    const changes = [save => {save.content_packs.structured.initializedAt = 10;}, save => {save.expansion.actors.player.worldId = 'base.frontier';}, save => {save.expansion.worlds['atelier.world'].facts['atelier.instance'] = 'atelier.wrong';}, save => {save.content_packs.structured.instanceId = 'atelier.wrong';}, save => {delete save.expansion.simulation.people['atelier.recipient'];}];
    for(const change of changes) {const save = structuredClone(envelope(f.plan, f.record)); change(save); assert.throws(() => validateStructuredEnvelope(save));}
});

test('one titled unit survives reservation/refund and actual condition conversion', () => {
    const f = setup(), started = run(f, 'repair');
    assert.equal(started.state.simulation.owners['atelier.issuer'][key('worn')], undefined);
    validateStructuredEnvelope(envelope(started, f.record));
    const refund = cancelSimulationJob(started.state, f.registry, started.commitment.id, {...f.context, gameplay: started.gameplay});
    assert.equal(refund.state.simulation.owners['atelier.issuer'][key('worn')], 1);
    validateStructuredEnvelope(envelope(refund, f.record));
    const completed = advanceSimulation(started.state, f.registry, 2, started.external, started.gameplay);
    assert.equal(completed.state.simulation.owners['atelier.issuer'][key('worn')], undefined);
    assert.equal(completed.state.simulation.owners['atelier.issuer'][key('fitted')], 1);
    assert.equal(completed.gameplay.player.skills.Crafting.xp, 1);
    validateStructuredEnvelope(envelope(completed, f.record));
    const duplicate = structuredClone(envelope(completed, f.record)); duplicate.expansion.simulation.owners['atelier.issuer'][key('worn')] = 1;
    assert.throws(() => validateStructuredEnvelope(duplicate), /unit/);
    const wrongTitle = structuredClone(envelope(completed, f.record)); wrongTitle.expansion.simulation.claims['atelier.title'].owner = 'player';
    assert.throws(() => validateStructuredEnvelope(wrongTitle), /title/);
});

test('actual recipient condition/vitals update service eligibility and facts tolerate no registry', () => {
    const f = setup(), context = {...f.context, targetId: 'atelier.recipient'};
    assert.equal(previewSimulationCommand(f.plan.state, f.registry, 'atelier.service', context).eligible, false);
    assert.equal(simulationFacts(f.plan.state, context)['target.condition.atelier.cut'], 1);
    assert.equal(simulationFacts(f.plan.state, context)['target.vital.health'], 4);
    const state = structuredClone(f.plan.state);
    delete state.simulation.conditions['atelier.recipient']['atelier.cut']; state.simulation.people['atelier.recipient'].vitals.health = 9;
    assert.equal(simulationFacts(state, context, f.registry)['target.condition.atelier.cut'], 0);
    assert.equal(previewSimulationCommand(state, f.registry, 'atelier.service', context).eligible, true);
    state.simulation.conditions['atelier.recipient']['atelier.cut'] = {intensity: 1};
    assert.equal(previewSimulationCommand(state, f.registry, 'atelier.service', context).eligible, false);
    assert.equal(simulationFacts(state, context)['target.vital.health'], 9);
});

test('witnessed communication settles once and failed durable write changes no live state', () => {
    const f = setup(); assert.throws(() => run(f, 'communicate'), /knowledge|means|circumstances/);
    const signed = run(f, 'sign'), communicated = run(f, 'communicate', signed.state, signed.gameplay);
    assert.equal(communicated.state.actors.player.resources.coins, 3);
    assert(communicated.state.simulation.knowledge['atelier.issuer']['atelier.report']);
    assert.throws(() => run(f, 'communicate', communicated.state, communicated.gameplay), /completed/);
    const live = envelope(signed, f.record), bytes = JSON.stringify(live), before = structuredClone(signed.state);
    const storage = {setItem() {throw Error('synthetic write failure');}};
    assert.throws(() => persistExpansionPlan(communicated, {createSave: () => bytes, storage, key: 'test', bindings, validateEnvelope: validateStructuredEnvelope}), /synthetic write failure/);
    assert.equal(JSON.stringify(live), bytes); assert.deepEqual(signed.state, before);
    let durable;
    persistExpansionPlan(communicated, {createSave: () => bytes, storage: {setItem(key, value) {durable = value;}}, key: 'test', bindings, validateEnvelope: validateStructuredEnvelope});
    const restored = JSON.parse(durable); validateStructuredEnvelope(restored);
    assert.equal(restored.expansion.actors.player.resources.coins, 3);
});


test('observer action quote contains time and own inputs but no NPC reserves or hidden outputs',()=>{
    const f=setup(),view=structuredCampaignView(f.plan.state,f.definition,f.record,{...f.context,registry:f.registry});
    const repair=view.actions.find(a=>a.id==='atelier.repair');assert.equal(repair.duration,2);assert.deepEqual(repair.costs,[]);assert.equal(repair.repeatable,true);
    assert.deepEqual(structuredActionCosts({eligible:true,costs:[{type:'vital',key:'stamina',amount:-2},{type:'item',actor:'player',key:key('worn'),amount:-1},{type:'resource',actor:'atelier.issuer',key:'secret',amount:-400}]},f.definition),['2 stamina','1 × worn']);
    assert.deepEqual(structuredActionCosts({eligible:false,costs:[{type:'vital',key:'stamina',amount:-2}]},f.definition),['2 stamina']);
});


test('player panel excludes NPC-owned commands even when they are visible', () => {
    const raw=fixture();
    raw.simulation.commands.push(command('npc_private', {actorId:'atelier.issuer',label:'Uncommunicated NPC plan'}));
    const role=command('npc_role', {actorDefinitionId:'atelier.recipient',label:'Uncommunicated NPC role'});delete role.actorId;raw.simulation.commands.push(role);
    const f=setup(raw);
    const view=structuredCampaignView(f.plan.state,f.definition,f.record,{...f.context,registry:f.registry});
    assert(view.actions.some(a=>a.id==='atelier.repair'));
    assert(!view.actions.some(a=>['atelier.npc_private','atelier.npc_role'].includes(a.id)));
    assert(!JSON.stringify(view).includes('Uncommunicated'));
});

test('player-owned identified unit keeps title through actual reservation, refund and saved publication', () => {
    const raw=fixture();raw.units[0].titleOwner='player';raw.units[0].recipient='player';
    for(const e of raw.bootstrap.effects)if(['item','claim'].includes(e.type))e.actor='player';
    for(const e of [...raw.simulation.commands[0].costs,...raw.simulation.commands[0].effects])if(e.type==='item')e.actor='player';
    const f=setup(raw),started=run(f,'repair');
    assert.equal(started.gameplay.player.inventory[key('worn')],undefined);
    validateStructuredEnvelope(envelope(started,f.record));
    const refunded=cancelSimulationJob(started.state,f.registry,started.commitment.id,{...f.context,gameplay:started.gameplay});
    assert.equal(refunded.gameplay.player.inventory[key('worn')],1);
    let saved;persistExpansionPlan(refunded,{createSave:()=>JSON.stringify(envelope(f.plan,f.record)),storage:{setItem(k,v){saved=JSON.parse(v);}},key:'test',bindings,validateEnvelope:validateStructuredEnvelope});
    assert.equal(saved.expansion.simulation.claims['atelier.title'].owner,'player');
    validateStructuredEnvelope(saved);
    const duplicate=structuredClone(saved);duplicate.expansion.simulation.owners['atelier.issuer'][key('worn')]=1;
    assert.throws(()=>validateStructuredEnvelope(duplicate),/unit/);
});

test('provider facts use the actual target body, renewable reserve and currently active faculty',()=>{
    const f=setup(),id='atelier.recipient',state=f.plan.state,context={...f.context,targetId:id};
    state.simulation.people[id].body={form:'human',channel:1,controllerId:id};
    state.actors[id].sources['atelier.channel']={expiresAt:null};
    state.simulation.faculties[id]={'atelier.channel':{active:true,awakened:true,suppressed:false}};
    state.simulation.energies={[id]:{'atelier.reserve':{reserve:3,strain:2}}};
    let facts=simulationFacts(state,context);
    assert.equal(facts['target.body.channel'],1);assert.equal(facts['target.energy.atelier.reserve.reserve'],3);assert.equal(facts['target.faculty.atelier.channel.active'],true);
    state.simulation.people[id].body.channel=0;state.simulation.energies[id]['atelier.reserve'].reserve=0;
    state.simulation.faculties[id]['atelier.channel'].suppressed=true;
    facts=simulationFacts(state,context);assert.equal(facts['target.body.channel'],0);assert.equal(facts['target.energy.atelier.reserve.reserve'],0);assert.equal(facts['target.faculty.atelier.channel.active'],false);
    state.simulation.faculties[id]['atelier.channel'].suppressed=false;state.actors[id].sources['atelier.channel'].expiresAt=state.clock;
    assert.equal(simulationFacts(state,context)['target.faculty.atelier.channel.active'],false);
});

test('a newly acquired identified unit conserves its variant through an authorized title sale',()=>{
    const input=fixture();input.units[0].deferred=true;input.units[0].titleRecipients=['atelier.recipient'];input.bootstrap.effects=[];
    input.simulation.commands.push(command('make',{effects:[{type:'item',actor:'atelier.issuer',key:key('worn'),amount:1},{type:'claim',actor:'atelier.issuer',key:'atelier.title',operation:'acquire'}]}));
    input.simulation.commands.push(command('sell',{effects:[{type:'transfer',from:'atelier.issuer',to:'atelier.recipient',key:key('worn'),count:1},{type:'claim',actor:'atelier.issuer',target:'atelier.recipient',key:'atelier.title',operation:'transfer'}]}));
    const f=setup(input);validateStructuredEnvelope(envelope(f.plan,f.record));
    let plan=run(f,'make');validateStructuredEnvelope(envelope(plan,f.record));plan=run(f,'sell',plan.state,plan.gameplay);validateStructuredEnvelope(envelope(plan,f.record));
    assert.equal(plan.state.simulation.owners['atelier.recipient'][key('worn')],1);
    const wrong=envelope(plan,f.record);wrong.expansion=structuredClone(plan.state);wrong.expansion.simulation.claims['atelier.title'].owner='player';assert.throws(()=>validateStructuredEnvelope(wrong),/title/);
    const unclaimed=envelope(f.plan,f.record);unclaimed.expansion=structuredClone(f.plan.state);unclaimed.expansion.simulation.owners['atelier.issuer'][key('worn')]=1;assert.throws(()=>validateStructuredEnvelope(unclaimed),/unit/);
});

test('worn native identified equipment remains conserved and a duplicate carried copy fails',()=>{
    const input=fixture();input.units[0].titleOwner='player';input.bootstrap.effects=[{type:'item',key:key('worn'),amount:1},{type:'claim',key:'atelier.title',operation:'acquire'}];
    const f=setup(input),save=envelope(f.plan,f.record);delete save.inventories.person.main_character[key('worn')];save.character.equipment={torso:{id:'atelier.worn',quality:100,inventory_key:key('worn')}};
    validateStructuredEnvelope(save);save.character.equipment.torso.inventory_key=JSON.stringify({id:'atelier.worn',e2_instance:'e2.1'});validateStructuredEnvelope(save);save.inventories.person.main_character[key('worn')]={count:1};assert.throws(()=>validateStructuredEnvelope(save),/unit/);
});

test('explicit new condition absence policy exposes zero without changing frozen legacy absence',()=>{
 const input=fixture();input.simulation.conditions.push({id:'atelier.due',revision:1,label:'Reporting interval',absence:'zero'});const f=setup(input);
 const facts=simulationFacts(f.plan.state,f.context,f.registry);assert.equal(facts['condition.atelier.due'],0);assert.equal(facts['condition.atelier.cut'],undefined);
 const state=structuredClone(f.plan.state);state.simulation.conditions.player={'atelier.due':{intensity:1,expiresAt:state.clock+3}};
 assert.equal(simulationFacts(state,f.context,f.registry)['condition.atelier.due'],1);state.clock+=3;assert.equal(simulationFacts(state,f.context,f.registry)['condition.atelier.due'],0);
});

test('identified native loan returns the actual same copy and reserved owned work refunds its exact key',()=>{
 const identified=JSON.stringify({id:'atelier.worn',e2_instance:'e2.1'}),input=fixture();
 input.simulation.commands.push(command('return_loan',{effects:[{type:'custody',from:'player',to:'atelier.issuer',key:key('worn'),count:1,loanId:'atelier.loan',returning:true}]}));
 const f=setup(input);delete f.plan.state.simulation.owners['atelier.issuer'][key('worn')];f.plan.gameplay.player.inventory[identified]=1;f.plan.state.simulation.custody['atelier.loan']={owner:'atelier.issuer',holder:'player',key:key('worn'),count:1};
 const returned=run(f,'return_loan');assert.equal(returned.state.simulation.owners['atelier.issuer'][identified],1);assert.equal(returned.gameplay.player.inventory[identified],undefined);assert.equal(returned.state.simulation.custody['atelier.loan'],undefined);validateStructuredEnvelope(envelope(returned,f.record));
 const reservation=run(f,'repair',returned.state,returned.gameplay);assert.equal(reservation.commitment.costs[0].key,identified);const refund=cancelSimulationJob(reservation.state,f.registry,reservation.commitment.id,{...f.context,gameplay:reservation.gameplay});assert.equal(refund.state.simulation.owners['atelier.issuer'][identified],1);validateStructuredEnvelope(envelope(refund,f.record));
});

test('canonical loan authority blocks transfer of its identified native copy to another claimant',()=>{
 const identified=JSON.stringify({id:'atelier.worn',e2_instance:'e2.1'}),input=fixture();
 input.simulation.commands.push(command('give',{effects:[{type:'transfer',from:'player',to:'atelier.recipient',key:key('worn'),count:1}]}));const f=setup(input);
 delete f.plan.state.simulation.owners['atelier.issuer'][key('worn')];f.plan.gameplay.player.inventory[identified]=1;f.plan.state.simulation.custody['atelier.loan']={owner:'atelier.issuer',holder:'player',key:key('worn'),count:1};
 assert.equal(previewSimulationCommand(f.plan.state,f.registry,'atelier.give',{...f.context,gameplay:f.plan.gameplay}).eligible,false);assert.throws(()=>run(f,'give'),/Borrowed goods/);assert.equal(f.plan.gameplay.player.inventory[identified],1);
});

test('native local controls quote only the current location while departure actions remain reachable',()=>{
 const input=fixture();input.locations.push({id:'atelier.garden',label:'Garden',description:'Another actual location.'});input.simulation.commands.push(command('remote',{location:'atelier.garden'}));
 const f=setup(input);let view=structuredCampaignView(f.plan.state,f.definition,f.record,{...f.context,registry:f.registry});assert(!view.actions.some(a=>a.id==='atelier.remote'));assert(view.actions.some(a=>a.id==='atelier.repair'));
 f.plan.state.simulation.people.player.location='atelier.garden';view=structuredCampaignView(f.plan.state,f.definition,f.record,{...f.context,registry:f.registry,facts:{location:'atelier.garden'}});assert(view.actions.some(a=>a.id==='atelier.remote'));assert(!view.actions.some(a=>a.id==='atelier.repair'));
});
