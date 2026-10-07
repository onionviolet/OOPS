// Finite original body/property proofs. Only unpublished plans are changed.
import {activePractice} from './techniques.js';
import {simulationOccupiesActor} from './simulation.js';
import {backlogAssert as assert, backlogRecord, backlogActor, backlogInventory,
    backlogItem, backlogTransfer, backlogLog, assertBacklogBoundary} from './backlog_expansion_core.js';

const freeze = value => {
    if(value && typeof value === 'object') {Object.values(value).forEach(freeze);Object.freeze(value);}
    return value;
};
const object = value => !!value && typeof value === 'object' && !Array.isArray(value);
const natural = value => Number.isSafeInteger(value) && value >= 0;
const clone = value => structuredClone(value);
const key = id => JSON.stringify({id});
export const BODY_IDS = freeze({brasswright:'backlog.brasswright',clay:'backlog.clay_vessel',
    donor:'backlog.family_mara',recipient:'backlog.family_ren',specimen:'backlog.brass_lung.bl01',
    nativeBody:'native.player.body',clayBody:'backlog.clay_vessel.body',right:'backlog.family.workbench',
    reedSource:'backlog.reedling_fronds',brassSource:'backlog.installed_brass_lung',
    claySource:'backlog.controlled_clay_hands',familySource:'backlog.family_packing'});
export const BODY_ITEM_KEYS = freeze({specimen:key('Brass lung BL-01'),wood:key('Rough wood log'),
    soundBlank:key('Sound seal blank'),seal:key('Fitted parcel seal'),rope:key('Survey rope'),
    template:key('Sealing template'),kit:key('Prepared survey kit')});
// Integrator registers this with the ordinary item_templates/OtherItem codec.
// The serial is part of the item ID, not ignored custom key metadata.
export const bodyItemDefinitions = freeze([{id:'Brass lung BL-01',name:'Brass lung BL-01',value:4,
    description:'One removable, serialized pressure device. Training and wood fuel are separate from ownership.',
    tags:{expedition:true,backlog_specimen:true}}]);

const human = id => ({id,ownerId:id.split('.body')[0],controllerId:id.split('.body')[0],
    form:'human',mobile:true,hands:2,breathesAir:true,intakePort:true});
const personDefinition = (id,label,body,resources = {}) => ({id,label,revision:1,worldId:'base.frontier',
    location:'Village',inventory:'simulation',provision:false,body,resources});
export const bodyPeople = freeze([
    personDefinition(BODY_IDS.brasswright,'Sella, brasswright',{...human(`${BODY_IDS.brasswright}.body`),ownerId:BODY_IDS.brasswright,controllerId:BODY_IDS.brasswright},{'backlog.lesson_focus':1}),
    personDefinition(BODY_IDS.clay,'Tern, clay vessel',{id:BODY_IDS.clayBody,ownerId:BODY_IDS.clay,controllerId:BODY_IDS.clay,
        form:'clay_vessel',mobile:false,hands:2,breathesAir:false,intakePort:false,clayPressure:true},
        {'backlog.private_focus':3}),
    personDefinition(BODY_IDS.donor,'Mara, family bench owner',{...human(`${BODY_IDS.donor}.body`),ownerId:BODY_IDS.donor,controllerId:BODY_IDS.donor},{'backlog.teaching_focus':1}),
    personDefinition(BODY_IDS.recipient,'Ren, Mara\'s willing nephew',{...human(`${BODY_IDS.recipient}.body`),ownerId:BODY_IDS.recipient,controllerId:BODY_IDS.recipient},{'backlog.family_effort':2}),
]);
export const bodyDefinitions = freeze({people:bodyPeople});
export const bodyCapabilities = freeze([
    {id:'backlog.reed_weaving',label:'Living reed weaving',stacking:'max',providers:[]},
    {id:'backlog.pressure_sealing',label:'Installed pressure sealing',stacking:'max',providers:[]},
    {id:'backlog.clay_sealing',label:'Controlled clay pressing',stacking:'max',providers:[]},
    {id:'backlog.family_bench',label:'Family workbench operation',stacking:'max',providers:[]},
]);
const eq = (fact,value) => ({fact,op:'eq',value});
const usableHands = {fact:'body.hands',op:'gte',value:2};
export const bodySources = freeze([
    {id:BODY_IDS.reedSource,revision:1,label:'Living reed fronds',kind:'trait',origin:'inherited',
        grants:[{capability:'backlog.reed_weaving',amount:1,when:{all:[eq('body.photosynthetic',true),usableHands]}}]},
    {id:BODY_IDS.brassSource,revision:1,label:'Installed brass lung BL-01',kind:'equipment',origin:'acquired',
        grants:[{capability:'backlog.pressure_sealing',amount:1,when:{all:[eq('body.brassLungId',BODY_IDS.specimen),
            eq('body.intakePort',true),{fact:'resource.backlog.brass_pressure',op:'gte',value:1}]}}]},
    {id:BODY_IDS.claySource,revision:1,label:'Tern\'s controlled clay hands',kind:'support',origin:'acquired',
        grants:[{capability:'backlog.clay_sealing',amount:1,when:{all:[eq('body.id',BODY_IDS.clayBody),
            eq('body.clayPressure',true),usableHands]}}]},
    {id:BODY_IDS.familySource,revision:1,label:'Taught family packing',kind:'knowledge',origin:'trained',
        grants:[{capability:'backlog.family_bench',amount:1,when:eq(`claim.${BODY_IDS.right}.owner`,BODY_IDS.recipient)}]},
]);
const row = (id,label,description,family) => ({id:`backlog.body.${id}`,label,description,family});
export const bodyCommands = freeze([
    row('origin_reedling','Begin as a reedling','Choose during a fresh human-compatible creation opening. Your physical fronds can weave two ropes; existing heroes cannot take this origin.','origin'),
    row('weave_reed_rope','Weave a living reed rope','Spend one of your two opening sap units to make one actual Survey rope.','origin'),
    row('meet_brasswright','Meet Sella and her brass lung','Introduce one actual brasswright and her one serialized specimen.','device'),
    row('buy_brass_lung','Exchange two logs for BL-01','Transfer two owned logs to Sella and receive her actual brass lung.','device'),
    row('install_brass_lung','Install BL-01','Install your own unborrowed specimen in your supported human body. The loose item leaves your bag.','device'),
    row('train_brass_lung','Learn pressure control','Pay Sella one log for her one available lesson. Installation alone grants no usable control.','device'),
    row('fuel_brass_lung','Fuel BL-01 with one log','Consume one owned log for two pressure uses, only when its chamber is empty.','device'),
    row('press_brass_seal','Pressure-fit one sound seal','Consume one Sound seal blank and one pressure unit to make a Fitted parcel seal.','device'),
    row('suppress_brass_lung','Close the lung valve','Disable the installed source while retaining the device, learned control and unused pressure.','device'),
    row('activate_brass_lung','Open the trained lung valve','Reactivate the same installed specimen after learning its control.','device'),
    row('remove_brass_lung','Remove BL-01','Return the same specimen to your bag and vent unused pressure. Learned control remains.','device'),
    row('meet_clay_vessel','Meet Tern, a clay vessel','Introduce one actual stationary clay body with its own possessions and reserve.','possession'),
    row('ask_clay_vessel','Ask to borrow Tern\'s body','Obtain Tern\'s explicit consent for one of at most two controlled visits and an agreed return at the Village.','possession'),
    row('possess_clay_vessel','Enter the consenting clay vessel','Park your original body and move Tern\'s actual body and physical reserve under your control. Neither host goods nor resources transfer.','possession'),
    row('press_clay_seal','Press one seal with clay hands','Use one unit of Tern\'s physical stamina and your own Sound seal blank. Ordinary travel, combat and work wait for your return.','possession'),
    row('return_from_clay','Return to your original body','Restore your parked body and Tern\'s control. The clay body keeps the stamina it spent.','possession'),
    row('meet_family','Meet Mara and Ren','Introduce two living family members, two logs, one template and Mara\'s actual workbench right.','inheritance'),
    row('offer_family_succession','Record Mara\'s succession offer','Mara willingly offers the two logs, template, taught method and workbench right to Ren.','inheritance'),
    row('revoke_family_succession','Withdraw the unsettled offer','Withdraw consent before property or rights move.','inheritance'),
    row('accept_family_succession','Witness Ren\'s willing succession','Ren accepts; conserve the stock, transfer the same right and teach the one funded method. Both people stay alive.','inheritance'),
    row('return_family_succession','Return the unused family property','Before any production, return the two logs, template and same right. Ren retains what he learned.','inheritance'),
    row('prepare_family_kit','Ask the current heir to pack a kit','Ren must hold the actual workbench right, template, one log, learned method and one effort unit.','inheritance'),
    row('receive_family_kit','Receive one family kit','Transfer one already produced Prepared survey kit from Ren to your native bag.','inheritance'),
]);

/** Read actual native components. Call only from the trusted main/creation host. */
export function bodyNativeInputs(state,{character,locationId,heroCreated,creationPanelOpen,freshNativeGame,gameStats} = {}) {
    if(!character || typeof character.getRace !== 'function' || typeof character.getItems !== 'function' ||
        typeof character.getTotalXP !== 'function' || typeof character.getLevelableComponent !== 'function') return {};
    const race = character.getRace();
    if(race !== 'human' || typeof locationId !== 'string') return {};
    const inventory = Object.fromEntries(Object.entries(character.getItems()).map(([k,entry]) => [k,entry.count]));
    const nativeBody = {schema:1,sequence:state.sequence,actorId:'player',bodyId:BODY_IDS.nativeBody,
        nativeRace:race,location:locationId,mobile:true,hands:2,breathesAir:true,intakePort:true};
    const heroXp = character.getTotalXP(), progress = character.getLevelableComponent().skill_progress;
    const xp = Object.values(progress || {}).map(p => p.total_xp ?? 0);
    const skillXp = xp.reduce((sum,n) => sum + n,0), playtime = gameStats?.total_playtime;
    // freshNativeGame comes from the actual fresh initializer branch, never a
    // saved global_flags value. A loaded zero-XP hero is still an existing hero.
    const fresh = freshNativeGame === true && heroCreated === false && creationPanelOpen === true && state.clock === 0 && heroXp === 0 &&
        xp.every(n => n === 0) && skillXp === 0 && playtime === 0 && locationId === 'Village';
    return freeze({nativeBody,...(fresh ? {freshOpening:{schema:1,phase:'character_creation',sequence:state.sequence,
        clock:0,actorId:'player',bodyId:BODY_IDS.nativeBody,nativeRace:race,heroCreated:false,freshNativeGame:true,
        heroXp:0,skillXp:0,playtime:0,location:locationId,inventory}} : {})});
}

/** Enrollment changes only the command anchor; never grant a fresh opening on load. */
export function reanchorBodyInputs(context,previousState,enrolledState) {
    assert(!previousState.simulation && enrolledState.simulation && enrolledState.sequence === previousState.sequence + 1 &&
        enrolledState.clock === previousState.clock && enrolledState.simulation.enrolledAt === enrolledState.clock,
        'The body opening may reanchor only across its deliberate simulation enrollment.');
    const out = {...context};
    for(const field of ['nativeBody','freshOpening']) if(context[field]) {
        assert(context[field].sequence === previousState.sequence,'The native body evidence is stale.');
        out[field] = freeze({...clone(context[field]),sequence:enrolledState.sequence});
    }
    return out;
}

const cause = plan => `backlog:${plan.state.sequence + 1}`;
function bodyRecord(plan) {
    const r = backlogRecord(plan);
    r.body ||= {schema:1,revision:1};
    return r.body;
}
function receipt(plan,id) {
    backlogRecord(plan).receipts[id] = {sequence:plan.state.sequence + 1,at:plan.state.clock};
}
function observe(plan,key,value,actorId = 'player') {
    const known = plan.state.simulation.knowledge[actorId] ||= {};
    known[key] = {stage:'understood',value,at:plan.state.clock,cause:cause(plan)};
}
function remember(plan,from,to,text) {
    const relations = plan.state.simulation.relationships[from] ||= {};
    const r = relations[to] ||= {axes:{},memories:[]};
    r.memories.push({cause:cause(plan),at:plan.state.clock,text});r.memories = r.memories.slice(-32);
}
function source(plan,actorId,id,origin,active = true) {
    const {actor} = backlogActor(plan,actorId), faculties = plan.state.simulation.faculties[actorId] ||= {};
    assert(!actor.sources[id] && !faculties[id],'This physical source is already present.');
    actor.sources[id] = {acquiredAt:plan.state.clock,expiresAt:null,receiptId:cause(plan),worldId:actor.worldId,revision:1,origin};
    faculties[id] = {awakened:active,active,suppressed:false,development:0};
}
function removeSource(plan,actorId,id) {
    delete plan.state.actors[actorId].sources[id];delete plan.state.simulation.faculties[actorId]?.[id];
}
function usableSource(plan,actorId,id) {
    const entry = plan.state.actors[actorId]?.sources[id], f = plan.state.simulation.faculties[actorId]?.[id];
    return !!entry && (entry.expiresAt == null || entry.expiresAt > plan.state.clock) && !!f?.awakened && !!f.active && !f.suppressed;
}
function introduce(plan,id) {
    const d = bodyPeople.find(d => d.id === id), state = plan.state, s = state.simulation;
    assert(d && !state.actors[id] && !s.people[id] && state.worlds[d.worldId],'The participant was already introduced or has no supported world.');
    state.actors[id] = {facts:{},resources:clone(d.resources),completed:{},sources:{},techniques:{},worldId:d.worldId};
    s.people[id] = {life:'alive',inventory:'simulation',location:d.location,bornAt:state.clock,
        definitionId:d.id,definitionRevision:d.revision,createdBy:'player',body:clone(d.body)};
    s.owners[id] = {};
    observe(plan,`person.${id}.identity`,d.label);
    return backlogActor(plan,id);
}
function available(plan,id,context) {
    const {actor,person} = backlogActor(plan,id);
    assert(person.life === 'alive' && actor.worldId === 'base.frontier' && person.location === context.facts?.location &&
        !simulationOccupiesActor(plan.state,id) && !activePractice(actor) &&
        !plan.state.pending.some(job => job.context.actorId === id),'Meet the living, willing participant while they are free.');
    return {actor,person};
}
function safeBodyBoundary(plan,context) {
    assertBacklogBoundary(plan.state,context);
    assert(plan.state.actors.player.worldId === 'base.frontier' && context.facts?.location === 'Village',
        'Return to the actual Village for these finite body and family proofs.');
    const r = plan.state.backlog;
    assert(r?.loop?.status !== 'active' && !['armed','paused'].includes(r?.offline?.status),
        'Finish the active loop or release the offline escrow before changing a body or family property.');
}
function ownBody(plan,context) {
    const {person} = backlogActor(plan,'player'), input = context.nativeBody;
    if(person.body?.form === 'reedling') return person.body;
    assert(input?.schema === 1 && input.sequence === plan.state.sequence && input.actorId === 'player' &&
        input.bodyId === BODY_IDS.nativeBody && input.nativeRace === 'human' && input.location === context.facts?.location &&
        input.mobile === true && input.hands === 2 && input.intakePort === true,
        'Bind the actual supported human native body for this deliberate physical operation.');
    assert(!person.body?.form || person.body.form === 'human','This existing body has a different physical form.');
    const body = {id:BODY_IDS.nativeBody,ownerId:'player',controllerId:'player',form:'human',
        mobile:true,hands:2,breathesAir:true,intakePort:true,...person.body};
    assert(body.id === BODY_IDS.nativeBody && body.ownerId === 'player' && body.controllerId === 'player' &&
        body.mobile === true && Number.isSafeInteger(body.hands) && body.hands >= 2,'This physical body is already controlled, immobile or incompatible.');
    person.body = body;
    return body;
}
function noPossession(r) {assert(r.possession?.status !== 'active','Return from Tern before another physical or family operation.');}
function installed(plan,r) {
    const specimen = r.specimen, {actor,person} = backlogActor(plan,'player');
    assert(specimen?.phase === 'installed' && specimen.hostId === 'player' && specimen.hostBodyId === person.body?.id &&
        person.body?.brassLungId === BODY_IDS.specimen && person.body.intakePort === true &&
        actor.sources[BODY_IDS.brassSource],'Install the actual compatible brass lung first.');
    const faculty = plan.state.simulation.faculties.player?.[BODY_IDS.brassSource];
    assert(faculty,'The installed source has no control record.');
    return {specimen,actor,person,faculty};
}
function emptyPressure(actor) {assert((actor.resources['backlog.brass_pressure'] || 0) === 0,'Spend or vent the remaining pressure before refueling.');}
function addPressure(actor,delta) {
    const next = (actor.resources['backlog.brass_pressure'] || 0) + delta;
    assert(natural(next) && next <= 2,'The brass pressure chamber is empty or full.');
    actor.resources['backlog.brass_pressure'] = next;
}
function sameBag(a,b) {
    return object(a) && object(b) && Object.keys(a).length === Object.keys(b).length &&
        Object.entries(a).every(([key,count]) => natural(count) && count > 0 && b[key] === count);
}

export function stageBodyCommand(plan,command,context) {
    const definition = bodyCommands.find(d => d.id === command?.id);
    assert(definition,'Unknown body proof command.');
    safeBodyBoundary(plan,context);
    const state = plan.state, s = state.simulation, r = bodyRecord(plan), player = state.actors.player, p = s.people.player;
    if(command.id !== 'backlog.body.press_clay_seal' && command.id !== 'backlog.body.return_from_clay') noPossession(r);
    switch(command.id) {
    case 'backlog.body.origin_reedling': {
        const f = context.freshOpening;
        assert(f?.schema === 1 && f.phase === 'character_creation' && f.sequence === state.sequence && f.clock === 0 &&
            f.actorId === 'player' && f.bodyId === BODY_IDS.nativeBody && f.nativeRace === 'human' && f.heroCreated === false && f.freshNativeGame === true &&
            f.heroXp === 0 && f.skillXp === 0 && f.playtime === 0 && f.location === 'Village' && state.clock === 0 &&
            sameBag(f.inventory,backlogInventory(plan,'player')),'Choose a reedling only during the verified fresh native creation opening.');
        assert(!r.origin && !r.specimen && !r.possession && !r.family && !p.body && !s.claims['origin.selected'] &&
            !Object.keys(player.sources).length && !Object.keys(player.completed).length && !Object.keys(player.techniques).length &&
            Object.values(plan.gameplay.player.skills).every(skill => skill.xp === 0),'This is an existing character or its origin was already chosen.');
        p.body = {id:BODY_IDS.nativeBody,ownerId:'player',controllerId:'player',form:'reedling',mobile:true,hands:2,
            breathesAir:false,intakePort:false,photosynthetic:true};
        player.resources['backlog.reed_sap'] = 2;
        source(plan,'player',BODY_IDS.reedSource,'inherited');
        s.claims['origin.selected'] = {owner:'player',status:'settled',at:state.clock,cause:cause(plan)};
        r.origin = {id:'backlog.origin.reedling',bodyId:BODY_IDS.nativeBody,selectedAt:state.clock,
            selectedSequence:state.sequence + 1,woven:0,nativeScaffold:'human'};
        observe(plan,'backlog.origin.reedling','Your physical body has living reed fronds. The ordinary native cosmetic scaffold remains human.');
        break;
    }
    case 'backlog.body.weave_reed_rope':
        assert(r.origin && p.body?.id === r.origin.bodyId && p.body.photosynthetic === true && p.body.hands >= 2 &&
            usableSource(plan,'player',BODY_IDS.reedSource) && player.resources['backlog.reed_sap'] > 0,'A living reedling body and one remaining sap unit are required.');
        player.resources['backlog.reed_sap']--;r.origin.woven++;
        backlogItem(plan,'player',BODY_ITEM_KEYS.rope,1);
        break;
    case 'backlog.body.meet_brasswright': {
        assert(!r.specimen,'Sella and the one brass lung are already introduced.');
        introduce(plan,BODY_IDS.brasswright);
        backlogItem(plan,BODY_IDS.brasswright,BODY_ITEM_KEYS.specimen,1);
        r.specimen = {schema:1,id:BODY_IDS.specimen,key:BODY_ITEM_KEYS.specimen,phase:'stock',
            holderId:BODY_IDS.brasswright,hostId:null,hostBodyId:null,uses:0,removals:0};
        break;
    }
    case 'backlog.body.buy_brass_lung':
        available(plan,BODY_IDS.brasswright,context);
        assert(r.specimen?.phase === 'stock' && r.specimen.holderId === BODY_IDS.brasswright &&
            (backlogInventory(plan,BODY_IDS.brasswright)[BODY_ITEM_KEYS.specimen] || 0) === 1,
            'Sella must still own the one available brass lung.');
        backlogTransfer(plan,'player',BODY_IDS.brasswright,BODY_ITEM_KEYS.wood,2);
        backlogTransfer(plan,BODY_IDS.brasswright,'player',BODY_ITEM_KEYS.specimen,1);
        r.specimen.holderId = 'player';
        break;
    case 'backlog.body.install_brass_lung': {
        assert(r.specimen?.phase === 'stock' && r.specimen.holderId === 'player' &&
            (backlogInventory(plan,'player')[BODY_ITEM_KEYS.specimen] || 0) === 1,'Own the one uninstalled brass lung first.');
        const b = ownBody(plan,context);
        assert(b.form === 'human' && b.intakePort === true && !b.brassLungId,'BL-01 fits only the selected human intake port.');
        backlogItem(plan,'player',BODY_ITEM_KEYS.specimen,-1);
        Object.assign(r.specimen,{phase:'installed',hostId:'player',hostBodyId:b.id});
        b.brassLungId = BODY_IDS.specimen;
        source(plan,'player',BODY_IDS.brassSource,'acquired',player.facts['backlog.brass_control_learned'] === true);
        if(player.facts['backlog.brass_control_learned']) s.faculties.player[BODY_IDS.brassSource].development = 1;
        addPressure(player,0);
        break;
    }
    case 'backlog.body.train_brass_lung': {
        const {faculty} = installed(plan,r), teacher = available(plan,BODY_IDS.brasswright,context);
        assert(!player.facts['backlog.brass_control_learned'] && teacher.actor.resources['backlog.lesson_focus'] === 1,
            'This finite control lesson is already learned or unavailable.');
        backlogTransfer(plan,'player',BODY_IDS.brasswright,BODY_ITEM_KEYS.wood,1);
        teacher.actor.resources['backlog.lesson_focus']--;
        player.facts['backlog.brass_control_learned'] = true;
        Object.assign(faculty,{awakened:true,active:true,suppressed:false,development:1});
        observe(plan,'backlog.brass_control','You learned the two-unit chamber, valve and pressure-fitting operation from Sella.');
        remember(plan,BODY_IDS.brasswright,'player','I taught one paid brass-lung control lesson.');
        break;
    }
    case 'backlog.body.fuel_brass_lung': {
        const {actor} = installed(plan,r);emptyPressure(actor);
        backlogItem(plan,'player',BODY_ITEM_KEYS.wood,-1);addPressure(actor,2);
        break;
    }
    case 'backlog.body.press_brass_seal': {
        const {faculty,actor,specimen} = installed(plan,r);
        assert(player.facts['backlog.brass_control_learned'] === true && faculty.awakened && faculty.active &&
            !faculty.suppressed && faculty.development >= 1 && actor.resources['backlog.brass_pressure'] >= 1,
            'Learn control, open the valve and fuel the actual installed lung first.');
        backlogItem(plan,'player',BODY_ITEM_KEYS.soundBlank,-1);addPressure(actor,-1);
        backlogItem(plan,'player',BODY_ITEM_KEYS.seal,1);specimen.uses++;
        break;
    }
    case 'backlog.body.suppress_brass_lung': {
        const {faculty} = installed(plan,r);
        assert(!faculty.suppressed,'The valve is already closed.');faculty.suppressed = true;faculty.active = false;
        break;
    }
    case 'backlog.body.activate_brass_lung': {
        const {faculty} = installed(plan,r);
        assert(player.facts['backlog.brass_control_learned'] === true && faculty.awakened &&
            (!faculty.active || faculty.suppressed),'Learn control first; the valve may already be open.');
        faculty.suppressed = false;faculty.active = true;
        break;
    }
    case 'backlog.body.remove_brass_lung': {
        const {specimen,person,actor} = installed(plan,r);
        assert(!(backlogInventory(plan,'player')[BODY_ITEM_KEYS.specimen] || 0),'A second loose specimen conflicts with removal.');
        delete person.body.brassLungId;removeSource(plan,'player',BODY_IDS.brassSource);
        actor.resources['backlog.brass_pressure'] = 0;
        Object.assign(specimen,{phase:'stock',hostId:null,hostBodyId:null,holderId:'player',removals:specimen.removals + 1});
        backlogItem(plan,'player',BODY_ITEM_KEYS.specimen,1,{acquisition:false});
        break;
    }
    case 'backlog.body.meet_clay_vessel': {
        assert(!r.possession,'Tern is already introduced.');
        const host = introduce(plan,BODY_IDS.clay);
        host.person.vitals = {health:12,max_health:12,stamina:2,max_stamina:2};
        host.actor.facts['backlog.possession_consent'] = false;
        // These remain Tern's throughout every visit, including its unused focus.
        backlogItem(plan,BODY_IDS.clay,BODY_ITEM_KEYS.kit,1);
        r.possession = {schema:1,hostId:BODY_IDS.clay,bodyId:BODY_IDS.clayBody,status:'introduced',visits:0,pressed:0};
        break;
    }
    case 'backlog.body.ask_clay_vessel': {
        const host = available(plan,BODY_IDS.clay,context);
        assert(r.possession && ['introduced','returned'].includes(r.possession.status) && r.possession.visits < 2 && host.person.vitals?.stamina > 0 &&
            host.person.body?.controllerId === BODY_IDS.clay,'Tern must be free in its actual body with remaining physical reserve.');
        host.actor.facts['backlog.possession_consent'] = true;
        r.possession.status = 'offered';r.possession.consentSequence = state.sequence + 1;
        observe(plan,'backlog.clay.consent','Tern agreed to one stationary body visit, using your goods, followed by explicit return.');
        remember(plan,BODY_IDS.clay,'player','I consented to one visit; my possessions and private reserve remain mine.');
        break;
    }
    case 'backlog.body.possess_clay_vessel': {
        const visit = r.possession, host = available(plan,BODY_IDS.clay,context);
        assert(visit?.status === 'offered' && host.actor.facts['backlog.possession_consent'] === true &&
            host.person.definitionId === BODY_IDS.clay && host.person.body?.id === BODY_IDS.clayBody &&
            host.person.body.ownerId === BODY_IDS.clay && host.person.body.controllerId === BODY_IDS.clay &&
            host.person.body.clayPressure === true && host.person.vitals?.stamina > 0,
            'Tern must explicitly consent with its own eligible clay body available.');
        assert(r.specimen?.phase !== 'installed' && !Object.keys(s.equipment[BODY_IDS.clay] || {}).length &&
            !Object.values(s.custody).some(c => c.holder === BODY_IDS.clay || c.owner === BODY_IDS.clay),
            'Remove the installed lung and settle Tern\'s equipment or custody before changing control.');
        const homeBody = ownBody(plan,context);
        assert(!player.sources[BODY_IDS.claySource] && homeBody.ownerId === 'player' && homeBody.controllerId === 'player',
            'Your original physical body is already controlled or unsupported.');
        visit.homeBody = homeBody;visit.homeVitals = clone(context.vitals.player);visit.parkedAt = context.facts.location;
        p.body = host.person.body;p.body.controllerId = 'player';delete host.person.body;
        p.vitals = host.person.vitals;delete host.person.vitals;
        host.person.life = 'incapacitated';host.person.lifeCause = {cause:cause(plan),at:state.clock,reason:'Consenting mind rests while its physical body is controlled by the visitor.'};
        visit.status = 'active';visit.enteredAt = state.clock;visit.visits++;
        source(plan,'player',BODY_IDS.claySource,'acquired');
        break;
    }
    case 'backlog.body.press_clay_seal': {
        const visit = r.possession;
        assert(visit?.status === 'active' && p.body?.id === BODY_IDS.clayBody && p.body.controllerId === 'player' &&
            p.body.hands >= 2 && p.body.clayPressure === true && p.vitals?.stamina > 0 &&
            usableSource(plan,'player',BODY_IDS.claySource) && state.actors[BODY_IDS.clay].facts['backlog.possession_consent'] === true,
            'Control the consenting actual clay hands with remaining physical stamina first.');
        backlogItem(plan,'player',BODY_ITEM_KEYS.soundBlank,-1);p.vitals.stamina--;
        backlogItem(plan,'player',BODY_ITEM_KEYS.seal,1);visit.pressed++;
        break;
    }
    case 'backlog.body.return_from_clay': {
        const visit = r.possession, host = backlogActor(plan,BODY_IDS.clay);
        assert(visit?.status === 'active' && p.body?.id === visit.bodyId && visit.homeBody?.ownerId === 'player' &&
            host.person.life === 'incapacitated' && !host.person.body && !host.person.vitals &&
            context.facts.location === visit.parkedAt,'The controlled body and its same parked original must still be present.');
        host.person.body = p.body;host.person.body.controllerId = BODY_IDS.clay;
        host.person.vitals = p.vitals;host.person.life = 'alive';
        host.person.lifeCause = {cause:cause(plan),at:state.clock,reason:'Explicit return restored the consenting owner\'s control.'};
        p.body = visit.homeBody;
        if(visit.homeVitals) p.vitals = visit.homeVitals;else delete p.vitals;
        delete visit.homeBody;delete visit.homeVitals;delete visit.parkedAt;
        visit.status = 'returned';visit.returnedAt = state.clock;
        host.actor.facts['backlog.possession_consent'] = false;
        removeSource(plan,'player',BODY_IDS.claySource);
        remember(plan,BODY_IDS.clay,'player','You returned my same body; the stamina used in it stayed spent.');
        break;
    }
    case 'backlog.body.meet_family': {
        assert(!r.family && !s.claims[BODY_IDS.right],'This family or its actual workbench right is already introduced.');
        introduce(plan,BODY_IDS.donor);introduce(plan,BODY_IDS.recipient);
        backlogItem(plan,BODY_IDS.donor,BODY_ITEM_KEYS.wood,2);backlogItem(plan,BODY_IDS.donor,BODY_ITEM_KEYS.template,1);
        s.claims[BODY_IDS.right] = {owner:BODY_IDS.donor,status:'held',at:state.clock,cause:cause(plan)};
        r.family = {schema:1,donorId:BODY_IDS.donor,recipientId:BODY_IDS.recipient,rightId:BODY_IDS.right,
            status:'introduced',prepared:0,collected:0,property:[{key:BODY_ITEM_KEYS.wood,count:2},{key:BODY_ITEM_KEYS.template,count:1}]};
        state.actors[BODY_IDS.donor].facts['backlog.family_consent'] = false;
        state.actors[BODY_IDS.recipient].facts['backlog.family_consent'] = false;
        remember(plan,BODY_IDS.donor,BODY_IDS.recipient,'Ren is my nephew; my workbench and property remain mine until we both agree.');
        observe(plan,'backlog.family.kinship','Mara and her nephew Ren are living, separate people with their own possessions and rights.');
        break;
    }
    case 'backlog.body.offer_family_succession': {
        const family = r.family, donor = available(plan,BODY_IDS.donor,context);
        available(plan,BODY_IDS.recipient,context);
        assert(family && ['introduced','returned'].includes(family.status) && donor.actor.resources['backlog.teaching_focus'] > 0 &&
            s.claims[BODY_IDS.right]?.owner === BODY_IDS.donor,'The current living owner must still hold the property, right and teaching capacity.');
        for(const entry of family.property) assert((backlogInventory(plan,BODY_IDS.donor)[entry.key] || 0) >= entry.count,'Mara no longer owns the offered property.');
        donor.actor.facts['backlog.family_consent'] = true;family.status = 'offered';family.offerSequence = state.sequence + 1;
        observe(plan,'backlog.family.offer','Mara offered two logs, her template, one taught method and her same workbench right to Ren.');
        break;
    }
    case 'backlog.body.revoke_family_succession':
        available(plan,BODY_IDS.donor,context);available(plan,BODY_IDS.recipient,context);
        assert(r.family?.status === 'offered','Only an unsettled offer can be withdrawn.');
        state.actors[BODY_IDS.donor].facts['backlog.family_consent'] = false;r.family.status = 'introduced';
        break;
    case 'backlog.body.accept_family_succession': {
        const family = r.family, donor = available(plan,BODY_IDS.donor,context), recipient = available(plan,BODY_IDS.recipient,context);
        const right = s.claims[BODY_IDS.right];
        assert(family?.status === 'offered' && donor.actor.facts['backlog.family_consent'] === true &&
            donor.actor.resources['backlog.teaching_focus'] > 0 && right?.owner === BODY_IDS.donor && right.status === 'held',
            'Mara\'s living offer, owned workbench right and teaching capacity are required.');
        for(const entry of family.property) backlogTransfer(plan,BODY_IDS.donor,BODY_IDS.recipient,entry.key,entry.count);
        donor.actor.resources['backlog.teaching_focus']--;recipient.actor.facts['backlog.family_consent'] = true;
        right.owner = BODY_IDS.recipient;right.cause = cause(plan);
        source(plan,BODY_IDS.recipient,BODY_IDS.familySource,'trained');
        observe(plan,'backlog.family.method','Count one log against the reusable template to pack one kit.',BODY_IDS.recipient);
        family.status = 'settled';family.settledSequence = state.sequence + 1;
        remember(plan,BODY_IDS.donor,BODY_IDS.recipient,'I willingly transferred the named property and same right, and taught one funded method.');
        remember(plan,BODY_IDS.recipient,BODY_IDS.donor,'I accepted the named property and right; I remain my own person.');
        break;
    }
    case 'backlog.body.return_family_succession': {
        const family = r.family;available(plan,BODY_IDS.donor,context);available(plan,BODY_IDS.recipient,context);
        assert(family?.status === 'settled' && family.prepared === 0 && family.collected === 0 &&
            s.claims[BODY_IDS.right]?.owner === BODY_IDS.recipient,'Return is available only while the inherited property is unused.');
        for(const entry of family.property) backlogTransfer(plan,BODY_IDS.recipient,BODY_IDS.donor,entry.key,entry.count);
        s.claims[BODY_IDS.right].owner = BODY_IDS.donor;s.claims[BODY_IDS.right].cause = cause(plan);
        state.actors[BODY_IDS.donor].facts['backlog.family_consent'] = false;
        state.actors[BODY_IDS.recipient].facts['backlog.family_consent'] = false;
        family.status = 'returned';family.returnedSequence = state.sequence + 1;
        break;
    }
    case 'backlog.body.prepare_family_kit': {
        const family = r.family, recipient = available(plan,BODY_IDS.recipient,context);
        available(plan,BODY_IDS.donor,context);
        assert(family?.status === 'settled' && s.claims[BODY_IDS.right]?.owner === BODY_IDS.recipient && s.claims[BODY_IDS.right].status === 'held' &&
            recipient.actor.facts['backlog.family_consent'] === true && usableSource(plan,BODY_IDS.recipient,BODY_IDS.familySource) &&
            recipient.actor.resources['backlog.family_effort'] > 0 && family.prepared < 2 &&
            (backlogInventory(plan,BODY_IDS.recipient)[BODY_ITEM_KEYS.template] || 0) >= 1 &&
            recipient.person.body?.hands >= 2,'Ren needs the accepted right, learned method, template, actual hands and remaining funded effort.');
        backlogItem(plan,BODY_IDS.recipient,BODY_ITEM_KEYS.wood,-1);recipient.actor.resources['backlog.family_effort']--;
        backlogItem(plan,BODY_IDS.recipient,BODY_ITEM_KEYS.kit,1);family.prepared++;
        break;
    }
    case 'backlog.body.receive_family_kit':
        available(plan,BODY_IDS.recipient,context);
        assert(r.family?.status === 'settled' && r.family.collected < r.family.prepared,'Ren must have an actual uncollected completed kit.');
        backlogTransfer(plan,BODY_IDS.recipient,'player',BODY_ITEM_KEYS.kit,1);r.family.collected++;
        break;
    default: throw Error('Unknown body proof command.');
    }
    receipt(plan,command.id);backlogLog(plan,definition.label);
}

/** Native activity gates consume physical function, never a cosmetic form label. */
export function bodyActionReasons(state,actionKind = 'activity') {
    const visit = state.backlog?.body?.possession;
    if(visit?.status !== 'active' || ['view','inspect','save','export','backlog.body.press_clay_seal','backlog.body.return_from_clay'].includes(actionKind)) return [];
    const body = state.simulation?.people.player?.body;
    if(actionKind === 'travel' && body?.mobile === false) return ['Tern\'s actual clay body is stationary. Return to your mobile body before travelling.'];
    if(!(body?.hands >= 2)) return ['The controlled body lacks two usable hands for this operation.'];
    return ['This native activity requires your original body. Finish clay pressing or explicitly return first.'];
}
export function bodyTransitionActive(state) {
    const r = state.backlog?.body;
    return r?.possession?.status === 'active' || r?.specimen?.phase === 'installed';
}
export function bodyItemDispositionReasons(state,itemKey) {
    let specimenKey = false;
    try {specimenKey = JSON.parse(itemKey).id === 'Brass lung BL-01';} catch { /* Ordinary invalid keys have their own native validator. */ }
    return state.backlog?.body?.specimen && specimenKey
        ? ['BL-01 is the one bound specimen. Install or remove it through its body controls; its stock carrier cannot be sold, stored, consumed or borrowed.'] : [];
}
export function bodyPhysicalProjection(state) {
    const p = state.simulation?.people.player, visit = state.backlog?.body?.possession;
    return p?.body ? {body:clone(p.body),controllerId:'player',ownerId:p.body.ownerId || 'player',
        ...(visit?.status === 'active' ? {vitals:clone(p.vitals),parkedBodyId:visit.homeBody.id,
            note:'Native hero stats and inventory belong to the parked original; controlled physical reserve belongs to this clay body.'} : {})} : null;
}

/** Native bag is outside expansion JSON; the save envelope adapter calls this too. */
export function validateBodyNativeInventory(state,nativeInventory,{otherInventories = []} = {}) {
    const specimen = state.backlog?.body?.specimen;
    if(!specimen) return;
    assert(object(nativeInventory) && Array.isArray(otherInventories),'Bind the actual native specimen inventory for validation.');
    const owners = state.simulation.owners;
    const count = bag => {
        let count = 0;
        for(const [encoded,n] of Object.entries(bag)) {
            let item;try {item = JSON.parse(encoded);} catch {continue;}
            if(item?.id !== 'Brass lung BL-01') continue;
            assert(encoded === BODY_ITEM_KEYS.specimen && natural(n),'The serialized specimen uses an unsupported identity alias or quantity.');
            count += n;
        }
        return count;
    };
    const total = [nativeInventory,...Object.values(owners),...otherInventories].reduce((sum,bag) => {
        assert(object(bag) && natural(count(bag)),'Invalid serialized specimen quantity.');return sum + count(bag);
    },0);
    assert(total === (specimen.phase === 'installed' ? 0 : 1),'The unique brass specimen was duplicated, lost or also left loose while installed.');
    if(specimen.phase === 'stock') assert(count(specimen.holderId === 'player' ? nativeInventory : owners[specimen.holderId] || {}) === 1,
        'The unique loose specimen is not with its declared actual holder.');
}

export function validateBodyRecord(record,state) {
    const r = record?.body;if(r == null) return;
    assert(object(r) && r.schema === 1 && r.revision === 1 && state.simulation?.people.player,'Unsupported optional body proof record.');
    const s = state.simulation, player = state.actors.player, p = s.people.player;
    const participant = id => assert(state.actors[id] && s.people[id] && s.people[id].definitionId === id,'The retained body participant is missing or changed.');
    const sequence = n => assert(natural(n) && n > 0 && n <= state.sequence,'Invalid body proof command receipt.');
    if(r.origin) {
        const o = r.origin;sequence(o.selectedSequence);
        assert(o.id === 'backlog.origin.reedling' && o.bodyId === BODY_IDS.nativeBody && o.nativeScaffold === 'human' &&
            o.selectedAt === 0 && natural(o.woven) && o.woven <= 2 && player.sources[BODY_IDS.reedSource] &&
            player.resources['backlog.reed_sap'] === 2 - o.woven && s.claims['origin.selected']?.owner === 'player' &&
            s.claims['origin.selected'].status === 'settled','Invalid retained fresh reedling opening.');
        const b = r.possession?.status === 'active' ? r.possession.homeBody : p.body;
        assert(b?.id === o.bodyId && b.ownerId === 'player' && b.photosynthetic === true && b.form === 'reedling',
            'The reedling source no longer has its actual physical body.');
    }
    if(r.specimen) {
        const d = r.specimen;participant(BODY_IDS.brasswright);
        assert(d.schema === 1 && d.id === BODY_IDS.specimen && d.key === BODY_ITEM_KEYS.specimen &&
            ['stock','installed'].includes(d.phase) && [BODY_IDS.brasswright,'player'].includes(d.holderId) &&
            natural(d.uses) && natural(d.removals),'Invalid serialized brass specimen carrier.');
        const f = s.faculties.player?.[BODY_IDS.brassSource], pressure = player.resources['backlog.brass_pressure'] || 0;
        assert(natural(pressure) && pressure <= 2,'Invalid actual brass pressure balance.');
        if(d.phase === 'installed') assert(d.holderId === 'player' && d.hostId === 'player' && d.hostBodyId === p.body?.id &&
            p.body?.brassLungId === d.id && p.body.form === 'human' && p.body.intakePort === true &&
            player.sources[BODY_IDS.brassSource] && f && r.possession?.status !== 'active' &&
            (!f.active || player.facts['backlog.brass_control_learned'] === true && f.development >= 1),
            'The installed brass source lacks its actual compatible host or learned control.');
        else assert(d.hostId === null && d.hostBodyId === null && !p.body?.brassLungId && !player.sources[BODY_IDS.brassSource] &&
            !f && pressure === 0,'A loose specimen cannot retain an installed source or fueled host.');
        if(d.holderId === BODY_IDS.brasswright) assert(s.owners[BODY_IDS.brasswright][d.key] === 1,'Sella no longer owns her advertised unique specimen.');
        else assert(!s.owners[BODY_IDS.brasswright][d.key],'Sella and the player cannot both hold BL-01.');
    }
    if(r.possession) {
        const v = r.possession;participant(BODY_IDS.clay);
        const host = s.people[BODY_IDS.clay];
        assert(v.schema === 1 && v.hostId === BODY_IDS.clay && v.bodyId === BODY_IDS.clayBody &&
            ['introduced','offered','active','returned'].includes(v.status) && natural(v.visits) && v.visits <= 2 && natural(v.pressed) && v.pressed <= 2,
            'Invalid clay control/return carrier.');
        if(v.consentSequence != null) sequence(v.consentSequence);
        if(v.status === 'active') assert(host.life === 'incapacitated' && !host.body && !host.vitals &&
            p.body?.id === v.bodyId && p.body.ownerId === v.hostId && p.body.controllerId === 'player' &&
            p.body.mobile === false && p.body.hands === 2 && p.body.clayPressure === true &&
            v.homeBody?.id === BODY_IDS.nativeBody && v.homeBody.ownerId === 'player' && v.homeBody.controllerId === 'player' &&
            v.parkedAt === 'Village' && natural(v.enteredAt) && v.enteredAt <= state.clock &&
            state.actors[BODY_IDS.clay].facts['backlog.possession_consent'] === true && player.sources[BODY_IDS.claySource] &&
            p.vitals?.max_stamina === 2 && p.vitals.stamina === 2 - v.pressed && p.vitals.health === 12 && p.vitals.max_health === 12 &&
            object(v.homeVitals) && ['health','max_health','stamina','max_stamina'].every(key => Number.isFinite(v.homeVitals[key]) && v.homeVitals[key] >= 0) &&
            v.homeVitals.health > 0 && v.homeVitals.max_health >= v.homeVitals.health && v.homeVitals.max_stamina >= v.homeVitals.stamina &&
            p.life === 'alive' && state.chronicle?.life.endedAt == null && r.specimen?.phase !== 'installed',
            'The actual clay body, consenting control, depleted reserve or parked original is missing.');
        else assert(host.life === 'alive' && host.body?.id === v.bodyId && host.body.ownerId === v.hostId &&
            host.body.controllerId === v.hostId && host.vitals?.max_stamina === 2 && host.vitals.stamina === 2 - v.pressed &&
            host.vitals.health === 12 && host.vitals.max_health === 12 &&
            !v.homeBody && !v.homeVitals && !player.sources[BODY_IDS.claySource] &&
            state.actors[BODY_IDS.clay].facts['backlog.possession_consent'] === (v.status === 'offered'),
            'The free clay owner has not recovered its same physical body and spent reserve.');
    }
    if(r.family) {
        const f = r.family;participant(BODY_IDS.donor);participant(BODY_IDS.recipient);
        assert(f.schema === 1 && f.donorId === BODY_IDS.donor && f.recipientId === BODY_IDS.recipient && f.rightId === BODY_IDS.right &&
            ['introduced','offered','settled','returned'].includes(f.status) && natural(f.prepared) && f.prepared <= 2 &&
            natural(f.collected) && f.collected <= f.prepared && Array.isArray(f.property) && f.property.length === 2 &&
            f.property[0].key === BODY_ITEM_KEYS.wood && f.property[0].count === 2 &&
            f.property[1].key === BODY_ITEM_KEYS.template && f.property[1].count === 1 &&
            s.people[f.donorId].life === 'alive' && s.people[f.recipientId].life === 'alive','Invalid living family/property succession.');
        for(const n of [f.offerSequence,f.settledSequence,f.returnedSequence].filter(n => n != null)) sequence(n);
        const right = s.claims[f.rightId];
        assert(right?.status === 'held' && right.owner === (f.status === 'settled' ? f.recipientId : f.donorId),
            'Succession must preserve and transfer the same actual workbench right.');
        assert(state.actors[f.recipientId].resources['backlog.family_effort'] === 2 - f.prepared &&
            (s.owners[f.recipientId][BODY_ITEM_KEYS.kit] || 0) >= f.prepared - f.collected,
            'The family production reserve or actual uncollected output is missing.');
        if(f.status === 'settled') assert(state.actors[f.donorId].facts['backlog.family_consent'] === true &&
            state.actors[f.recipientId].facts['backlog.family_consent'] === true &&
            state.actors[f.recipientId].sources[BODY_IDS.familySource] && s.owners[f.recipientId][BODY_ITEM_KEYS.template] >= 1,
            'The family right needs two living consenting people, taught control and its transferred actual tool.');
    }
}

export function bodyView(state,context = {}) {
    const r = state.backlog?.body, records = [];
    if(r?.origin) records.push(`Reedling body: ${state.actors.player.resources['backlog.reed_sap']} sap remains; ${r.origin.woven} native ropes woven.`);
    if(r?.specimen) records.push(`BL-01: ${r.specimen.phase === 'installed' ? 'installed in your human body' : `loose with ${r.specimen.holderId === 'player' ? 'you' : 'Sella'}`}; ${state.actors.player.resources['backlog.brass_pressure'] || 0}/2 pressure; ${state.actors.player.facts['backlog.brass_control_learned'] ? 'control learned' : 'lesson needed'}; ${r.specimen.uses} seals fitted.`);
    if(r?.possession) records.push(r.possession.status === 'active'
        ? `You control Tern\'s stationary clay hands: ${state.simulation.people.player.vitals.stamina}/2 physical stamina. Your ${r.possession.homeBody.form} body rests in the Village. Tern\'s goods and private reserve stay with Tern. Explicit return restores both controls.`
        : `Tern: ${r.possession.status}; ${state.simulation.people[BODY_IDS.clay]?.vitals?.stamina || 0}/2 physical stamina remains; ${r.possession.pressed} seals pressed.`);
    if(r?.family) records.push(`Mara and Ren remain alive. The workbench right belongs to ${state.simulation.claims[BODY_IDS.right].owner === BODY_IDS.donor ? 'Mara' : 'Ren'}; succession ${r.family.status}; ${r.family.prepared}/2 kits produced, ${r.family.collected} transferred to you.`);
    return {title:'Bodies and living succession',description:'Optional original physical proofs. Creation origins, owned devices, consenting control and family rights each have separate rules.',
        records,physical:bodyPhysicalProjection(state),freshOpeningAvailable:!!context.freshOpening};
}
