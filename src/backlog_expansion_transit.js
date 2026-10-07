// Ephemeral adapters over actual native/campaign owners. The shared host owns
// movement, time, saves and publication; this module enrolls no campaign store.
import {buildNativeRealmCargoSnapshot, validateRealmCargoSnapshot, previewRealmCargoPassage} from './realm_cargo.js';
import {validateRealmJson, validateRealmEndpoint, sameRealmEndpoint, realmStableId as id, realmNatural as natural} from './realm_boundary_rules.js';
import {validateRealmConnection, previewRealmPassage} from './realm_connections.js';
import {validateWorldInstance, validateWorldVisit, planWorldClock} from './world_instances.js';
import {validateRealmClockLedger, planRealmActivityClock} from './realm_clock_leases.js';
import {activePractice} from './techniques.js';
import {simulationOccupiesActor, waitingSimulationChoice} from './simulation.js';
import {Game_Time} from './game_time.js';

export const CARRIER_TRANSIT_SCHEMA = 1;
const assert = (ok, text) => {if (!ok) throw Error(text);};
const copy = value => structuredClone(value);
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const positive = value => natural(value) && value > 0;
const canonical = value => JSON.stringify(Array.isArray(value) ? value.map(value => JSON.parse(canonical(value))) : object(value)
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, JSON.parse(canonical(value[key]))])) : value);
const same = (a, b) => canonical(a) === canonical(b);
const kinds = ['body','cargo','memory','method','source','fuel','office','credential','duty','debt','curse','observer','ally'];
const laneKinds = ['native','hub','local','subjective','transit'];
const ownerKinds = kinds.filter(kind => !['body','cargo'].includes(kind));
const unique = (rows, label) => {
    assert(Array.isArray(rows) && rows.length <= 256 && rows.every(row => object(row) && id(row.id)) && new Set(rows.map(row => row.id)).size === rows.length, `Invalid or duplicate ${label} owners.`);
};
function qualification(value) {
    assert(object(value) && ['original_prototype','source_qualified'].includes(value.kind) && Array.isArray(value.evidenceIds) &&
        value.evidenceIds.every(id) && new Set(value.evidenceIds).size === value.evidenceIds.length &&
        (value.kind !== 'source_qualified' || value.evidenceIds.length > 0), 'Qualify the exact original or source-supported policy.');
}
function mission(value) {
    if (value === null) return;
    assert(object(value) && id(value.id) && positive(value.revision) && id(value.issuerId) && value.actorId==='player' &&
        ['offered','accepted','active','withdrawing','extracting','returned','settled','breached','declined'].includes(value.status), 'Bind an actual issued mission owner.');
    validateRealmEndpoint(value.destination);
    assert(value.id !== value.destination.worldId && value.id !== value.destination.instanceId, 'A mission ID is distinct from its destination world/instance.');
}
function lane(clock, worlds, playedAt) {
    assert(object(clock) && id(clock.id) && laneKinds.includes(clock.kind) && positive(clock.revision) && object(clock.value) &&
        natural(clock.value.elapsed) && natural(clock.value.observedAt) && clock.value.observedAt <= playedAt &&
        clock.value.unit === 'played_minutes' && clock.value.absence === 'freeze', 'Bind each clock to its actual played-time owner.');
    const p = clock.policy;
    assert(object(p) && id(p.id) && positive(p.revision) && ['common','presence','freeze','supported'].includes(p.mode) &&
        object(p.rate) && natural(p.rate.numerator) && positive(p.rate.denominator), 'Declare an explicit clock policy and rate.');
    qualification(p.qualification);
    if (clock.kind === 'native') assert(p.mode === 'common' && p.rate.numerator === 1 && p.rate.denominator === 1 &&
        clock.value.elapsed === playedAt && clock.value.observedAt === playedAt, 'Native time is the existing common game clock.');
    if (['hub','local'].includes(clock.kind)) {
        const world = worlds.find(world => world.instance.id === clock.instanceId);
        assert(world && same(clock.value, world.instance.clock) && clock.revision === world.instance.revision &&
            p.rate.numerator === 1 && p.rate.denominator === 1 && ['presence','freeze','supported'].includes(p.mode),
            'Hub/local time must use its actual supported world-instance clock; other rates need another admitted owner.');
        if (p.mode === 'supported') {
            validateRealmClockLedger(clock.ledger, world.instance, world.definition);
            assert(object(clock.leaseContext), 'Bind the actual existing lease supports.');
        }
    } else if (p.mode === 'presence') assert(typeof clock.present === 'boolean', 'Bind actual presence for this subjective/transit clock.');
    if (p.mode === 'supported' && !['hub','local'].includes(clock.kind)) {
        const support = clock.support;
        assert(object(support) && id(support.ownerId) && support.policyId === p.id && positive(support.revision) &&
            natural(support.from) && natural(support.through) && support.through >= support.from && typeof support.active === 'boolean', 'Bind exact live clock support.');
    }
}
function validateBinding(binding, state) {
    validateRealmJson(binding);
    assert(binding?.schema === CARRIER_TRANSIT_SCHEMA && positive(binding.revision) && binding.actorId === 'player' &&
        object(binding.body) && binding.body.id === 'native.player.body' && binding.body.ownerId === 'player' &&
        binding.body.controllerId === 'player' && id(binding.body.form) && positive(binding.body.revision), 'Bind the same actual native body and controller.');
    validateRealmEndpoint(binding.endpoint);
    assert(typeof binding.nativeLocation === 'string' && binding.nativeLocation.length > 0 &&
        state.actors?.player?.worldId === binding.endpoint.worldId && state.simulation?.people.player?.location === binding.nativeLocation,
        'Native location, person and world owner must agree.');
    assert(binding.connection === null || object(binding.connection), 'Declare the current actual connection or null.');
    if (binding.connection) validateRealmConnection(binding.connection);
    assert(binding.routeContext === null || object(binding.routeContext), 'Declare the actual route context or null.');
    mission(binding.mission);
    unique(binding.worlds?.map(world => ({id:world.instance?.id})), 'world-instance');
    for (const world of binding.worlds) {
        validateWorldInstance(world.instance, world.definition);
        assert(Array.isArray(world.visits) && Array.isArray(world.nativeOwnerIds) && world.nativeOwnerIds.length > 0 &&
            world.nativeOwnerIds.every(id) && new Set(world.nativeOwnerIds).size === world.nativeOwnerIds.length, 'Bind the existing instance visits and full native owner set.');
        unique(world.visits,'world visit');
        for (const visit of world.visits) validateWorldVisit(visit, world.instance, world.definition);
    }
    const visits=binding.worlds.flatMap(world=>world.visits), activePlayer=visits.filter(visit=>visit.actorId==='player'&&visit.status==='active');
    assert(new Set(visits.map(visit=>visit.id)).size===visits.length && activePlayer.length<=1 &&
        activePlayer.every(visit=>sameRealmEndpoint(visit.endpoint,binding.endpoint)), 'The same native body cannot occupy two retained destination visits.');
    if(binding.worlds.some(world=>world.instance.id===binding.endpoint.instanceId)) assert(activePlayer.length===1, 'An actual represented-world body location needs its existing active visit.');
    const intervals=new Map();
    for(const visit of visits) {const rows=intervals.get(visit.actorId) || [];rows.push([visit.enteredAt,visit.exitedAt ?? Infinity]);intervals.set(visit.actorId,rows);}
    for(const rows of intervals.values()) {
        rows.sort((a,b)=>a[0]-b[0] || a[1]-b[1]);let through=0;
        for(const [from,to] of rows) {assert(from>=through, 'One actual actor has overlapping retained visit histories.');through=to;}
    }
    unique(binding.nativeOwners, 'native');
    for (const owner of binding.nativeOwners) {
        assert(positive(owner.revision) && Object.hasOwn(owner,'value') && (owner.kind == null || ['calendar','retained'].includes(owner.kind)), 'Bind a full actual native owner value/revision.');
        if (owner.kind === 'calendar') assert(id(owner.clockId) && object(owner.value) &&
            ['year','month','day','hour','minute','day_count'].every(key => natural(owner.value[key])) &&
            positive(owner.value.month) && owner.value.month<=12 && positive(owner.value.day) && owner.value.day<=30 &&
            owner.value.hour<24 && owner.value.minute<60 && positive(owner.value.day_count) && Object.keys(owner.value).length === 6,
            'A native calendar owner needs its exact six native calendar fields and clock ID.');
    }
    for (const world of binding.worlds) assert(world.nativeOwnerIds.every(ownerId => binding.nativeOwners.some(owner => owner.id === ownerId)), 'A retained instance lacks an actual native owner.');
    const external=binding.externalEndpoints || [];
    assert(Array.isArray(external) && external.length<=128 && new Set(external.map(row=>canonical(row.endpoint))).size===external.length, 'Bind unique external native endpoints.');
    for(const row of external) {
        validateRealmEndpoint(row.endpoint);
        assert(positive(row.revision) && typeof row.nativeLocation==='string' && row.nativeLocation.length>0 && Array.isArray(row.nativeOwnerIds) && row.nativeOwnerIds.length>0 &&
            row.nativeOwnerIds.every(ownerId=>binding.nativeOwners.some(owner=>owner.id===ownerId)), 'An external endpoint needs its existing native location and actual retained owners; do not synthesize a world instance.');
    }
    unique(binding.carrierOwners, 'carrier');
    for (const owner of binding.carrierOwners) assert(ownerKinds.includes(owner.kind) && positive(owner.revision) && Object.hasOwn(owner,'value'), 'Bind actual separate memory/method/source/fuel/office/duty/debt/curse owners.');
    unique(binding.policies, 'directed policy');
    for (const policy of binding.policies) {
        assert(positive(policy.revision), 'Policy revision is required.');
        validateRealmEndpoint(policy.from); validateRealmEndpoint(policy.to); qualification(policy.qualification);
        assert(!sameRealmEndpoint(policy.from,policy.to) && object(policy.carriers) && Object.keys(policy.carriers).every(kind => kinds.includes(kind)), 'Declare qualified rules for this directed edge only.');
        for (const rule of Object.values(policy.carriers)) {
            assert(object(rule) && ['retain','block'].includes(rule.passage) &&
                ['none','unavailable','local_support','jurisdiction_required','fuel_required'].includes(rule.use) &&
                (rule.jurisdictionInstanceIds == null || Array.isArray(rule.jurisdictionInstanceIds) && rule.jurisdictionInstanceIds.every(id)) &&
                (rule.supports == null || Array.isArray(rule.supports) && rule.supports.length<=32), 'Invalid carrier passage/use rule.');
            for(const query of rule.supports || []) assert(object(query) && id(query.ownerId) && Array.isArray(query.path) && query.path.length<=16 && query.path.every(id) &&
                ['eq','gte'].includes(query.op) && (query.op==='gte'?Number.isFinite(query.value)&&query.value>0:['boolean','number','string'].includes(typeof query.value)),
                'A carrier use query needs an exact actual-owner path and scalar comparison.');
        }
    }
    unique(binding.clocks, 'clock');
    assert(binding.clocks.filter(clock => clock.kind === 'native').length === 1 &&
        new Set(binding.clocks.filter(clock => ['hub','local'].includes(clock.kind)).map(clock => clock.instanceId)).size === binding.clocks.filter(clock => ['hub','local'].includes(clock.kind)).length,
        'Bind one common native clock and only one clock per actual instance.');
    binding.clocks.forEach(clock => lane(clock,binding.worlds,state.clock));
    assert(binding.nativeOwners.filter(owner => owner.kind === 'calendar').every(owner => binding.clocks.some(clock => clock.id === owner.clockId)), 'Bind calendar advancement to its actual clock.');
    unique(binding.deadlines, 'deadline');
    for (const deadline of binding.deadlines) assert(binding.clocks.some(clock => clock.id === deadline.clockId) &&
        natural(deadline.at) && ['return','extraction','settlement'].includes(deadline.kind), 'A deadline needs its distinct actual clock and commitment kind.');
    assert(Array.isArray(binding.permissions) && Array.isArray(binding.consents), 'Declare actual lender permission/consent owners, including empty arrays.');
    return binding;
}
/** Optional host convenience: these are reads of existing owners, never stores.
 * Extra local source/credential/debt/curse/ally owners come from the native host.
 * This function must be called again on each unpublished resulting plan.
 */
export function carrierTransitContext(state,context,binding) {
    const s=state.simulation, a=state.actors?.player;
    assert(s && a && object(binding), 'Bind an enrolled actual native traveler before constructing carrier context.');
    const replacement=state.backlog?.replacement, revision=state.sequence+1;
    const row=(kind,value) => ({id:`native.player.carrier.${kind}`,kind,revision,value:copy(value)});
    const heldClaims=Object.fromEntries(Object.entries(s.claims || {}).filter(([,claim])=>claim.owner==='player'));
    const automatic=[row('memory',s.knowledge?.player || {}),row('method',{techniques:a.techniques || {},powers:s.powers?.player || {}}),
        row('source',{sources:a.sources || {},faculties:s.faculties?.player || {}}),row('fuel',{resources:a.resources || {},vitals:context.vitals?.player || {}}),
        row('office',heldClaims),row('credential',replacement?.credential || null),
        row('duty',{claim:s.claims?.['backlog.registry.two_seals'] || null,balances:Object.fromEntries(Object.entries(state.actors)
            .filter(([,actor])=>Object.hasOwn(actor.resources || {},'backlog.registry.seals_owed')).map(([actorId,actor])=>[actorId,actor.resources['backlog.registry.seals_owed']]))}),
        row('debt',{balances:Object.fromEntries(Object.entries(state.actors).filter(([,actor])=>Object.hasOwn(actor.resources || {},'backlog.registry.personal_debt'))
            .map(([actorId,actor])=>[actorId,actor.resources['backlog.registry.personal_debt']]))}),
        row('observer',{knowledge:Object.fromEntries(Object.entries(s.knowledge || {}).filter(([actorId])=>actorId!=='player')),relationships:s.relationships || {}})];
    return {...context,carrierTransit:{...copy(binding),carrierOwners:[...automatic,...copy(binding.carrierOwners || [])],
        permissions:copy(binding.permissions || []),consents:copy(binding.consents || []),externalEndpoints:copy(binding.externalEndpoints || [])}};
}
function actualRetained(state, context) {
    const actors = copy(state.actors);
    delete actors.player.worldId;
    const simulation = copy(state.simulation);
    delete simulation.people.player.location;
    const nested=copy(state.nestedCampaign ?? null);
    if(nested) {
        // The actual native host owns these existing movement/clock fields.
        // Mission terms/history/offers/settlement/role and all other fields stay.
        delete nested.visits;delete nested.activeVisitId;delete nested.nativeRevision;
        for(const instance of nested.instances || []) {delete instance.clock;delete instance.revision;}
    }
    return {actors, simulation, worlds:copy(state.worlds), backlog:copy(state.backlog ?? null),nested,
        existingTidemark:copy(state.featureDestination ?? null),existingGlasshouse:copy(state.realmPrototype ?? null),
        equipment:copy(context.equipment.player), vitals:copy(context.vitals.player), external:copy(context.external || {})};
}
/** Full native cargo uses the existing stock/custody codec, never item labels. */
export function buildCarrierTransitSnapshot(state, context) {
    assert(natural(state.sequence) && natural(state.clock), 'Bind the actual state sequence/common clock.');
    const b = validateBinding(context.carrierTransit,state), person = state.simulation.people.player;
    assert(person.inventory === 'native' && (person.body?.id == null || person.body.id === b.body.id) &&
        (person.body?.ownerId == null || person.body.ownerId === b.body.ownerId) &&
        (person.body?.controllerId == null || person.body.controllerId === b.body.controllerId) &&
        (person.body?.form == null || person.body.form === b.body.form), 'The supplied body must match the actual native person.');
    const cargo = buildNativeRealmCargoSnapshot({actorId:b.actorId,bodyId:b.body.id,sequence:state.sequence,revision:state.sequence+1,
        inventory:context.gameplay?.player?.inventory,equipment:context.equipment?.player,custody:state.simulation.custody,
        classifications:b.classifications || [],allocations:b.allocations || []});
    assert(object(context.vitals?.player), 'Bind actual native condition/fuel.');
    const value = {schema:1,sequence:state.sequence,clock:state.clock,revision:b.revision,actorId:b.actorId,body:copy(b.body),
        endpoint:copy(b.endpoint),nativeLocation:b.nativeLocation,cargo,bindingOwners:copy(b),retained:actualRetained(state,context)};
    validateRealmJson(value); value.binding = canonical(value);
    return value;
}
function boundaryReasons(state,context,{clock=false}={}) {
    const reasons = [], s = state.simulation, person = s?.people.player, v = context.vitals?.player;
    if (context.nativeAlive !== true || person?.life !== 'alive' || !(v?.health > 0) || state.chronicle?.life?.endedAt != null) reasons.push('Passage needs the same living native body.');
    const pending=clock?state.pending?.some(job=>job.context?.actorId==='player'):state.pending?.length;
    const jobs=clock?s?.jobs?.some(job=>job.actorId==='player'):s?.jobs?.length;
    const sessions=clock?!!s?.sessions?.player:Object.keys(s?.sessions || {}).length;
    if (context.busy || pending || jobs || sessions ||
        activePractice(state.actors.player) || simulationOccupiesActor(state,'player') || waitingSimulationChoice(state) || state.chronicle?.session)
        reasons.push('Finish current work, encounters, practice and waiting decisions before this transition.');
    if (state.backlog?.body?.possession?.status === 'active' || state.backlog?.body?.specimen?.phase === 'installed') reasons.push('This finite native passage/clock adapter does not qualify an occupied or installed prototype body; return to the original body and remove it first.');
    if (state.backlog?.loop?.status === 'active') reasons.push('Close the existing bell-yard time seal before another journey or clock commitment.');
    if (['armed','paused'].includes(state.backlog?.offline?.status)) reasons.push('Finish or cancel the existing prepaid packing before another journey or clock commitment.');
    if (Object.values(s?.pursuits || {}).some(p => ['investigating','searching','moving','waiting','sheltered','encounter'].includes(p.status))) reasons.push('Resolve the actual active pursuit first.');
    if (Object.values(state.realmPrototype?.observation?.state?.leases || {}).some(lease => lease.status === 'active')) reasons.push('Close the existing remote view before physical passage.');
    return reasons;
}
function expected(snapshot,request) {
    return request.expectedSequence === snapshot.sequence && request.expectedRevision === snapshot.revision && request.expectedBinding === snapshot.binding;
}
function clockPrediction(snapshot,request) {
    assert(natural(request.minutes) && request.minutes <= 120 && natural(snapshot.clock+request.minutes), 'Bind a finite shared played-minute request.');
    const b = snapshot.bindingOwners, target = snapshot.clock+request.minutes, changes = [], reasons = [];
    for (const clock of b.clocks) {
        const p = clock.policy, world = b.worlds.find(world => world.instance.id === clock.instanceId);
        let next, worldPlan = null;
        if (['hub','local'].includes(clock.kind)) {
            if (p.mode === 'supported') worldPlan = planRealmActivityClock(world.instance,clock.ledger,
                {expectedRevision:world.instance.revision,expectedLeaseRevision:clock.ledger.revision,expectedSequence:snapshot.sequence,playedAt:target,visits:world.visits},
                world.definition,{...copy(clock.leaseContext),sequence:snapshot.sequence});
            else worldPlan = planWorldClock(world.instance,{playedAt:target,visits:p.mode==='freeze'?[]:world.visits,expectedRevision:world.instance.revision},world.definition);
            if (!worldPlan.allowed) reasons.push(...worldPlan.reasons);
            next = worldPlan.nextInstance?.clock || clock.value;
        } else {
            let supported = p.mode === 'common' || p.mode === 'presence' && clock.present;
            if (p.mode === 'supported') supported = clock.support.active && clock.support.from === clock.value.observedAt && clock.support.through === target;
            const amount = supported ? (target-clock.value.observedAt)*p.rate.numerator/p.rate.denominator : 0;
            if (!natural(amount) || !natural(clock.value.elapsed+amount)) reasons.push('This declared clock rate lacks an exact integral owner/remainder for the requested interval.');
            next = {...copy(clock.value),elapsed:clock.value.elapsed+amount,observedAt:target};
        }
        changes.push({id:clock.id,kind:clock.kind,revision:clock.revision,from:copy(clock.value),to:copy(next),worldPlan});
    }
    const deadlines = b.deadlines.map(deadline => {
        const change = changes.find(change => change.id === deadline.clockId);
        const due = change.to.elapsed >= deadline.at, crossed = change.to.elapsed > deadline.at;
        if (crossed) reasons.push(`Reconcile the ${deadline.kind} deadline on its declared clock before advancing further.`);
        return {...copy(deadline),due,crossed};
    });
    return {target,changes,deadlines,reasons};
}
/** No wall-time reads, offline grant, partial settlement or rate inference. */
export function previewCarrierClock(state,context,request) {
    try {
        const snapshot = buildCarrierTransitSnapshot(state,context), reasons = boundaryReasons(state,context,{clock:true});
        validateRealmJson(request);
        if (!expected(snapshot,request)) reasons.push('This carrier clock request is stale.');
        if (request.offline === true) reasons.push('Unsupported absence stays frozen; this adapter accepts explicit played time only.');
        const prediction = clockPrediction(snapshot,request); reasons.push(...prediction.reasons);
        return {schema:1,kind:'clock',allowed:!reasons.length,reasons:[...new Set(reasons)],guards:{sequence:snapshot.sequence,revision:snapshot.revision,binding:snapshot.binding},
            minutes:request.minutes,commonFrom:snapshot.clock,commonTo:prediction.target,changes:prediction.changes,deadlines:prediction.deadlines};
    } catch (error) {return {schema:1,kind:'clock',allowed:false,reasons:[error.message],guards:null,changes:[],deadlines:[]};}
}
function carrierRules(snapshot,policy,to) {
    const reasons = [], view = [];
    for (const kind of kinds) {
        const rule = policy?.carriers[kind];
        if (!rule) {reasons.push(`The directed edge has no qualified ${kind} rule.`);view.push({kind,status:'unknown',retained:false,usable:false,useStatus:'unknown'});continue;}
        if (rule.passage !== 'retain') reasons.push(`The directed edge blocks the existing ${kind} carrier.`);
        // Transported offices/credentials do not become remote jurisdiction.
        const jurisdiction = rule.jurisdictionInstanceIds?.includes(to.instanceId) === true;
        const queries=rule.supports || [],results=queries.map(query=> {
            const owner=snapshot.bindingOwners.carrierOwners.find(owner=>owner.id===query.ownerId);
            let value=owner?.value,known=!!owner;
            for(const key of query.path) {if(!object(value) || !Object.hasOwn(value,key)) {known=false;break;}value=value[key];}
            return {known,passes:known && (query.op==='eq'?same(value,query.value):typeof value==='number'&&value>=query.value)};
        });
        let useStatus=rule.use==='none'?'not_applicable':rule.use==='unavailable'?'blocked':!queries.length||results.some(result=>!result.known)?'unknown':results.every(result=>result.passes)?'supported':'blocked';
        if(rule.use==='fuel_required' && !queries.some(query=>query.op==='gte')) useStatus='unknown';
        if(rule.use==='jurisdiction_required' || ['office','credential'].includes(kind) && rule.use!=='none') {
            if(!Array.isArray(rule.jurisdictionInstanceIds)) useStatus='unknown';
            else if(!jurisdiction) useStatus='blocked';
        }
        if(rule.passage==='block') useStatus='blocked';
        const usable=useStatus==='supported';
        view.push({kind,status:rule.passage==='retain'?'qualified':'blocked',retained:rule.passage==='retain',usable,
            useStatus,
            requirement:['office','credential'].includes(kind)&&!jurisdiction?'destination_jurisdiction':rule.use==='fuel_required'?'local_fuel':rule.use,
            qualification:copy(policy.qualification)});
    }
    return {reasons,view};
}
export function previewCarrierTransit(state,context,request) {
    try {
        const snapshot = buildCarrierTransitSnapshot(state,context), b = snapshot.bindingOwners, c = b.connection;
        validateRealmJson(request);
        assert(c && b.routeContext && id(request.purposeId) && ['forward','reverse'].includes(request.direction), 'Bind an actual directed native passage and purpose.');
        const from = request.direction==='forward'?c.from:c.to, to = request.direction==='forward'?c.to:c.from;
        const reasons = boundaryReasons(state,context);
        if (!expected(snapshot,request)) reasons.push('This carrier passage request is stale.');
        if (!sameRealmEndpoint(snapshot.endpoint,from)) reasons.push('The body is not at this actual directed edge origin.');
        if (!b.worlds.some(world => world.instance.id===to.instanceId && world.instance.worldId===to.worldId) &&
            !(b.externalEndpoints || []).some(row=>sameRealmEndpoint(row.endpoint,to))) reasons.push('The existing destination instance/native endpoint is not bound; passage creates no new owners.');
        if (request.missionId !== (b.mission?.id || null)) reasons.push('Bind the actual mission ID separately from the destination.');
        if (b.mission && (!['accepted','active','withdrawing','extracting','returned'].includes(b.mission.status) ||
            ![from,to].some(endpoint => sameRealmEndpoint(endpoint,b.mission.destination)))) reasons.push('The actual accepted mission does not cover this directed journey.');
        const policy = b.policies.find(policy => policy.id===request.policyId && sameRealmEndpoint(policy.from,from) && sameRealmEndpoint(policy.to,to));
        const rules = carrierRules(snapshot,policy,to); reasons.push(...rules.reasons);
        const cargoRequest = {expectedSequence:state.sequence,expectedRevision:c.revision,expectedSnapshotRevision:snapshot.cargo.revision,
            expectedSnapshotBinding:snapshot.cargo.binding,purposeId:request.purposeId,from,to,duration:c.duration};
        const cargo = previewRealmCargoPassage(snapshot.cargo,c,cargoRequest,{sequence:state.sequence,clock:state.clock,permissions:b.permissions,consents:b.consents});
        reasons.push(...cargo.reasons);
        const rc = {...copy(b.routeContext),actorId:'player',sequence:state.sequence,clock:state.clock,endpoint:copy(snapshot.endpoint),
            body:copy(snapshot.body),life:state.simulation.people.player.life,cargo:cargo.cargo,cargoComplete:true};
        assert(b.routeContext.actorId==='player' && b.routeContext.sequence===state.sequence && b.routeContext.clock===state.clock &&
            sameRealmEndpoint(b.routeContext.endpoint,snapshot.endpoint) && same(b.routeContext.body,snapshot.body), 'The route/body inputs must bind these same live owners.');
        const officeAuthorities=new Set(b.carrierOwners.filter(owner=>['office','credential'].includes(owner.kind)).flatMap(owner=>
            [owner.value?.officeId,...(owner.value?.authorityIds || []),...(owner.kind==='office'&&object(owner.value)?Object.keys(owner.value):[])].filter(id)));
        if(!(policy?.carriers.office?.jurisdictionInstanceIds || []).includes(to.instanceId) &&
            (rc.authorityIds || []).some(authority=>officeAuthorities.has(authority))) reasons.push('A retained office/credential has no authority in this destination jurisdiction.');
        const selectedException=c.requirements.exceptions?.find(exception=>exception.id===request.exceptionId);
        for(const sourceId of [c.requirements.sourceId,selectedException?.sourceId].filter(id)) {
            const source=state.actors.player.sources?.[sourceId],faculty=state.simulation.faculties?.player?.[sourceId];
            if(!source || faculty?.active!==true || faculty?.awakened!==true || faculty?.suppressed===true)
                reasons.push('The required operating source lacks its actual owned active faculty. Retained instructions alone cannot operate passage.');
        }
        for(const methodId of [c.requirements.methodId,selectedException?.methodId].filter(id)) {
            if(!state.actors.player.techniques?.[methodId] && state.simulation.powers?.player?.[methodId]?.owned!==true)
                reasons.push('The required passage method is not actually learned by this actor.');
        }
        const passage = previewRealmPassage(c,rc,{expectedSequence:state.sequence,expectedRevision:c.revision,direction:request.direction,operation:'passage',exceptionId:request.exceptionId || null});
        reasons.push(...passage.reasons);
        // The existing native passage host pays these exact resource debits.
        // This narrow adapter requires zero-cost/instant passage; paid work,
        // extraction and transit time use separate ordinary host commitments.
        if (passage.duration !== 0 || passage.costs.length) reasons.push('Stage paid or timed extraction through its existing host commitment before this instant carrier handoff.');
        return {schema:1,kind:'passage',allowed:!reasons.length,reasons:[...new Set(reasons)],guards:{sequence:snapshot.sequence,revision:snapshot.revision,binding:snapshot.binding},
            actorId:'player',body:copy(snapshot.body),from:copy(from),to:copy(to),missionId:b.mission?.id || null,policyId:policy?.id || null,
            policyRevision:policy?.revision || null,purposeId:request.purposeId,passage,cargo,carriers:rules.view};
    } catch (error) {return {schema:1,kind:'passage',allowed:false,reasons:[error.message],guards:null,carriers:[]};}
}
function hooksCheck(hooks,names) {assert(object(hooks) && names.every(name => typeof hooks[name]==='function'), `Bind the shared host hooks: ${names.join(', ')}.`);}
function resultPlan(result,fallback) {const plan = result ?? fallback;assert(object(plan) && object(plan.state), 'A shared host hook must return or mutate an unpublished plan.');return plan;}
function sameBody(before,after) {
    const old=copy(before),next=copy(after);delete old.revision;delete next.revision;
    return positive(before.revision) && after.revision>=before.revision && same(old,next);
}
function missionPreserved(before,after) {
    if(before===null || after===null) return before===after;
    const old=copy(before),next=copy(after);delete old.revision;delete next.revision;
    return after.revision>=before.revision && same(old,next);
}
function externalPreserved(before,after) {
    return before.length===after.length && before.every(old=> {
        const next=after.find(next=>sameRealmEndpoint(next.endpoint,old.endpoint));if(!next || next.revision<old.revision) return false;
        const oldRef=copy(old),nextRef=copy(next);delete oldRef.revision;delete nextRef.revision;return same(oldRef,nextRef);
    });
}
function cargoMaterial(snapshot) {return {actorId:snapshot.actorId,bodyId:snapshot.bodyId,sources:snapshot.sources.map(source => {const value=copy(source);delete value.revision;return value;}),
    cargo:snapshot.cargo.map(item => {const value=copy(item);delete value.stockRef.revision;return value;})};}
function instanceMaterial(world) {const value = copy(world.instance);delete value.clock;delete value.revision;return value;}
function ownersPreserved(before,after,calendarChanges=null) {
    return before.length===after.length && before.every(old=> {
        const next=after.find(next=>next.id===old.id);
        if(!next || next.revision<old.revision) return false;
        const oldRef=copy(old),nextRef=copy(next);delete oldRef.revision;delete nextRef.revision;delete oldRef.value;delete nextRef.value;
        if(!same(oldRef,nextRef)) return false;
        if(old.kind==='calendar' && calendarChanges) {
            const change=calendarChanges.find(change=>change.id===old.clockId);
            if(!change) return false;
            const delta=change.to.elapsed-change.from.elapsed;if(!natural(delta)) return false;
            const calendar=new Game_Time(copy(old.value));calendar.goUp(delta);
            const value=Object.fromEntries(['year','month','day','hour','minute','day_count'].map(key=>[key,calendar[key]]));
            return same(next.value,value);
        }
        return same(next.value,old.value);
    });
}
function visitsPreserved(before,after,quote,playedAt) {
    if(after.length<before.length || after.length>before.length+1) return false;
    for(const old of before) {
        const next=after.find(next=>next.id===old.id);
        if(!next) return false;
        if(same(old,next)) continue;
        if(!(old.status==='active' && old.actorId==='player' && sameRealmEndpoint(old.endpoint,quote.from) && next.status==='ended' &&
            next.exitedAt===playedAt && next.revision===old.revision+1 && same({...next,status:old.status,exitedAt:old.exitedAt,revision:old.revision},old))) return false;
    }
    return after.filter(next=>!before.some(old=>old.id===next.id)).every(next=>next.actorId==='player' && next.status==='active' &&
        next.enteredAt===playedAt && next.exitedAt===null && sameRealmEndpoint(next.endpoint,quote.to));
}
/** Hooks work on a detached copy; a rejection cannot partially change input. */
export function stageCarrierTransit(plan,context,request,hooks) {
    hooksCheck(hooks,['stageNativePassage','readContext']);
    const quote = previewCarrierTransit(plan.state,context,request);assert(quote.allowed,quote.reasons.join(' '));
    const before = buildCarrierTransitSnapshot(plan.state,context), draft = copy(plan);
    const out = resultPlan(hooks.stageNativePassage(draft,copy(quote)),draft);
    const after = buildCarrierTransitSnapshot(out.state,hooks.readContext(out));
    assert(out.state.clock===before.clock && [before.sequence,before.sequence+1].includes(out.state.sequence), 'Native passage cannot settle time or unrelated commands.');
    assert(sameRealmEndpoint(after.endpoint,quote.to) && sameBody(before.body,after.body), 'The actual native stage did not move the same body/controller to the destination.');
    assert(out.nativeLocation===after.nativeLocation && out.nativePatch?.['current location']===after.nativeLocation,
        'The actual native passage hook must stage the resulting existing native location patch.');
    assert(same(cargoMaterial(after.cargo),cargoMaterial(before.cargo)) && same(after.retained,before.retained), 'Passage changed body condition, goods, custody, source/methods, rights/duties/debts, knowledge or destination history.');
    assert(ownersPreserved(before.bindingOwners.nativeOwners,after.bindingOwners.nativeOwners) && ownersPreserved(before.bindingOwners.carrierOwners,after.bindingOwners.carrierOwners), 'Passage must preserve all actual native and carrier owners.');
    assert(after.bindingOwners.worlds.length===before.bindingOwners.worlds.length && before.bindingOwners.worlds.every(world => {
        const next=after.bindingOwners.worlds.find(next=>next.instance.id===world.instance.id);
        return next && same(next.definition,world.definition) && same(instanceMaterial(next),instanceMaterial(world)) && same(next.instance.clock,world.instance.clock) && same(next.nativeOwnerIds,world.nativeOwnerIds) &&
            visitsPreserved(world.visits,next.visits,quote,after.clock);
    }), 'Arrival/revisit replaced, reset or allocated a retained destination owner.');
    assert(missionPreserved(before.bindingOwners.mission,after.bindingOwners.mission) && before.bindingOwners.clocks.length===after.bindingOwners.clocks.length && before.bindingOwners.clocks.every(old=> {
        const next=after.bindingOwners.clocks.find(next=>next.id===old.id);return next && next.revision>=old.revision && same(next.value,old.value) && same(next.policy,old.policy);
    }) &&
        same(after.bindingOwners.deadlines,before.bindingOwners.deadlines) && externalPreserved(before.bindingOwners.externalEndpoints || [],after.bindingOwners.externalEndpoints || []) &&
        same(after.bindingOwners.policies,before.bindingOwners.policies) && same(after.bindingOwners.permissions,before.bindingOwners.permissions) && same(after.bindingOwners.consents,before.bindingOwners.consents),
        'Carrier handoff cannot settle a mission/reward/clock, create a native endpoint, or change passage qualification/permission.');
    const intent = {schema:1,kind:'passage',expectedSequence:before.sequence,resultSequence:after.sequence,at:after.clock,from:quote.from,to:quote.to,
        missionId:quote.missionId,policyId:quote.policyId,policyRevision:quote.policyRevision,body:copy(after.body),beforeBinding:before.binding,afterBinding:after.binding};
    validateCarrierTransitRecord(intent);out.carrierTransitIntent=intent;return out;
}
/** Shared advance owns causal work; sync owns its already admitted local clocks. */
export function stageCarrierClock(plan,context,request,hooks) {
    hooksCheck(hooks,['advancePlan','syncClocks','readContext']);
    const quote = previewCarrierClock(plan.state,context,request);assert(quote.allowed,quote.reasons.join(' '));
    const before = buildCarrierTransitSnapshot(plan.state,context), draft = copy(plan);
    let out = resultPlan(hooks.advancePlan(draft,quote.minutes),draft);
    assert(out.state.clock===quote.commonTo && !out.stoppedAtChoice && !(out.remaining>0) && !out.budgetExhausted,
        'Shared advancement stopped early or at a choice; no carrier clock settlement is admitted.');
    // Shared causal advancement may complete funded NPC work and change facts,
    // stock or beliefs. Seal that actual result before the narrower clock sync.
    const advanced = buildCarrierTransitSnapshot(out.state,hooks.readContext(out));
    out = resultPlan(hooks.syncClocks(out,copy(quote)),out);
    const after = buildCarrierTransitSnapshot(out.state,hooks.readContext(out));
    assert(after.clock===quote.commonTo && sameBody(before.body,after.body) && sameRealmEndpoint(after.endpoint,before.endpoint), 'Clock synchronization moved/reset the actual body or common time.');
    const syncChanges=quote.changes.map(change=>({...change,from:advanced.bindingOwners.clocks.find(clock=>clock.id===change.id)?.value || change.from}));
    assert(same(cargoMaterial(advanced.cargo),cargoMaterial(after.cargo)) && same(advanced.retained,after.retained) &&
        ownersPreserved(advanced.bindingOwners.nativeOwners,after.bindingOwners.nativeOwners,syncChanges) &&
        ownersPreserved(advanced.bindingOwners.carrierOwners,after.bindingOwners.carrierOwners),
        'Clock synchronization changed the shared scheduler result: stock, custody, body condition, sources, duties, recognition or other owners.');
    assert(before.bindingOwners.clocks.length===after.bindingOwners.clocks.length && quote.changes.every(change => {
        const next=after.bindingOwners.clocks.find(next=>next.id===change.id), old=before.bindingOwners.clocks.find(old=>old.id===change.id);
        return next && same(next.value,change.to) && next.kind===old.kind && same(next.policy,old.policy) && next.revision>=old.revision;
    }), 'The actual resulting clock owners do not match the exact supported interval.');
    for (const change of quote.changes.filter(change=>change.worldPlan?.allowed)) {
        const next=after.bindingOwners.worlds.find(world=>world.instance.id===change.worldPlan.nextInstance.id), old=advanced.bindingOwners.worlds.find(world=>world.instance.id===next?.instance.id);
        assert(next && old && same(instanceMaterial(next),instanceMaterial(old)) && same(next.definition,old.definition) && same(next.nativeOwnerIds,old.nativeOwnerIds), 'Clock sync reset a destination population, stock claim or branch.');
        assert(same(next.visits,old.visits), 'A clock-only transition cannot reset or invent visit history.');
        if (change.worldPlan.nextLeases) assert(same(after.bindingOwners.clocks.find(clock=>clock.id===change.id).ledger,change.worldPlan.nextLeases), 'Clock sync did not consume the exact existing lease proposal.');
    }
    assert(after.bindingOwners.worlds.length===before.bindingOwners.worlds.length && missionPreserved(advanced.bindingOwners.mission,after.bindingOwners.mission) &&
        same(after.bindingOwners.deadlines,advanced.bindingOwners.deadlines), 'Clock sync cannot allocate a world or settle a mission/deadline independently of its shared scheduler.');
    const intent = {schema:1,kind:'clock',expectedSequence:before.sequence,resultSequence:after.sequence,at:after.clock,minutes:quote.minutes,
        body:copy(after.body),beforeBinding:before.binding,afterBinding:after.binding,clocks:quote.changes.map(change=>({id:change.id,from:change.from,to:change.to})),deadlines:copy(quote.deadlines)};
    validateCarrierTransitRecord(intent);out.carrierClockIntent=intent;return out;
}
/** Optional ephemeral/save-host receipt validation, never implicit enrollment. */
export function validateCarrierTransitRecord(record,state=null,context=null) {
    if (record==null) return true;
    validateRealmJson(record);
    assert(record.schema===1 && ['passage','clock'].includes(record.kind) && natural(record.expectedSequence) && natural(record.resultSequence) &&
        record.resultSequence>=record.expectedSequence && natural(record.at) && object(record.body) && record.body.id==='native.player.body' &&
        record.body.ownerId==='player' && record.body.controllerId==='player' && typeof record.beforeBinding==='string' && typeof record.afterBinding==='string', 'Unsupported or unbound carrier transition receipt.');
    const before=JSON.parse(record.beforeBinding),after=JSON.parse(record.afterBinding);
    validateRealmJson(before);validateRealmJson(after);
    assert(before.schema===1 && after.schema===1 && before.sequence===record.expectedSequence && after.sequence===record.resultSequence && after.clock===record.at &&
        sameBody(before.body,record.body) && same(record.body,after.body) && canonical(before)===record.beforeBinding && canonical(after)===record.afterBinding, 'Carrier transition receipt does not bind its exact before/after owners.');
    validateRealmCargoSnapshot(before.cargo);validateRealmCargoSnapshot(after.cargo);
    for(const snapshot of [before,after]) {
        assert(snapshot.cargo.sequence===snapshot.sequence && snapshot.cargo.revision===snapshot.sequence+1 && snapshot.cargo.actorId===snapshot.actorId &&
            snapshot.cargo.bodyId===snapshot.body.id && snapshot.actorId==='player' && same(snapshot.body,snapshot.bindingOwners.body), 'Receipt body/stock/sequence owners disagree.');
        validateBinding(snapshot.bindingOwners,{clock:snapshot.clock,actors:{player:{worldId:snapshot.endpoint.worldId}},simulation:{people:{player:{location:snapshot.nativeLocation}}}});
    }
    if(record.kind==='passage') {validateRealmEndpoint(record.from);validateRealmEndpoint(record.to);assert(sameRealmEndpoint(before.endpoint,record.from)&&sameRealmEndpoint(after.endpoint,record.to)&&
        id(record.policyId)&&positive(record.policyRevision)&&(record.missionId===null||id(record.missionId))&&same(cargoMaterial(before.cargo),cargoMaterial(after.cargo)), 'Invalid directed carrier passage receipt.');}
    else assert(natural(record.minutes)&&after.clock-before.clock===record.minutes&&Array.isArray(record.clocks)&&Array.isArray(record.deadlines), 'Invalid exact clock receipt.');
    if(state!==null || context!==null) {
        assert(state && context, 'Live receipt validation requires both actual state and native context.');
        assert(buildCarrierTransitSnapshot(state,context).binding===record.afterBinding, 'This transition receipt no longer matches the actual current owners.');
    }
    return true;
}
/** Parent schema owns durable receipts. Private before/after seals stay ephemeral. */
export function summarizeCarrierTransitIntent(intent) {
    validateCarrierTransitRecord(intent);assert(intent!=null, 'Supply an actual staged carrier intent.');
    const value={schema:1,kind:intent.kind,expectedSequence:intent.expectedSequence,resultSequence:intent.resultSequence,at:intent.at,
        actorId:'player',bodyId:intent.body.id,controllerId:intent.body.controllerId};
    if(intent.kind==='passage') Object.assign(value,{from:copy(intent.from),to:copy(intent.to),missionId:intent.missionId,policyId:intent.policyId,policyRevision:intent.policyRevision});
    else Object.assign(value,{minutes:intent.minutes,clocks:intent.clocks.map(clock=>({id:clock.id,from:clock.from.elapsed,to:clock.to.elapsed,
        advancedBy:clock.to.elapsed-clock.from.elapsed,observedFrom:clock.from.observedAt,observedThrough:clock.to.observedAt})),
        deadlines:intent.deadlines.map(deadline=>({id:deadline.id,clockId:deadline.clockId,kind:deadline.kind,at:deadline.at,due:deadline.due}))});
    validateRealmJson(value);return value;
}
/** Bind diagnostics to actual discovered route evidence, not author-only lore. */
export function carrierTransitView(state,context,request=null) {
    const b=context.carrierTransit;
    if(!b) return {visible:false,records:[]};
    const evidence=b.routeContext?.evidence?.filter(row=>row.recipientId==='player'&&row.connectionId===b.connection?.id) || [];
    const visible=!!b.connection && b.routeContext?.knownConnectionIds?.includes(b.connection.id) && evidence.length>0;
    if(!visible) return {visible:false,records:[]};
    const records=evidence.map(row=>({id:row.id,at:row.at,kind:row.kind,text:row.text}));
    // Preview eligibility explains the attempted operation; unseen policy/source
    // IDs, full memory snapshots and other observers' private beliefs stay hidden.
    const quote=request?previewCarrierTransit(state,context,request):null;
    return {visible:true,records,missionId:b.mission?.id || null,eligible:quote?.allowed ?? null,reasons:quote?.reasons || [],
        sameBody:true,completeCargo:true,absence:'freeze',clockKinds:b.clocks.map(clock=>clock.kind),
        commitments:b.deadlines.map(deadline=>({kind:deadline.kind,clockId:deadline.clockId,at:deadline.at}))};
}
