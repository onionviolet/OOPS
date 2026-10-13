// Original, opt-in development policies. No book-world precedence is implied.
// This service owns neither costs nor vitals: callers use the existing plan,
// simulation clock and durable publication path for those operations.
const check = (ok, message) => {if (!ok) throw new Error(message);};
const id = v => typeof v === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(v) && !['__proto__','prototype','constructor'].includes(v);
const natural = n => Number.isSafeInteger(n) && n >= 0;
const clone = v => structuredClone(v);
const selector = v => ['$actor','$target'].includes(v) || id(v);
const bind = (v, c) => v === '$actor' || v == null ? c.actorId : v === '$target' ? c.targetId : v;
export const FOUNDATION_INTERACTION_POLICIES = Object.freeze(['P-A','P-B']);
export const FOUNDATION_INTERACTION_INSTANCE_BUDGET = 64;
const stages = ['activation','delivery','sustained'];
const channels = ['magic','physical'];

export function validateFoundationDelivery(d) {
    check(d && id(d.id) && selector(d.actorId) && selector(d.targetId) && id(d.bodyId) && id(d.targetBodyId), 'Interaction needs exact actor, target and bodies.');
    check(channels.includes(d.channel) && ['injury','aid'].includes(d.intent), 'Unsupported interaction channel or intent.');
    check(id(d.sourceId) && ['admission','sustained','released'].includes(d.support), 'Declare interaction source and support.');
    check(d.support !== 'released' || d.channel === 'physical' && id(d.projectileId), 'Released delivery needs a physical projectile instance.');
    check(d.fuel == null || id(d.fuel.key) && Number.isFinite(d.fuel.amount) && d.fuel.amount > 0, 'Invalid interaction fuel requirement.');
    check(d.activationBlockedBy == null || Array.isArray(d.activationBlockedBy) && d.activationBlockedBy.every(id), 'Invalid frozen activation counter.');
    check(d.reflect == null && d.next == null && d.precedence == null, 'Reflection, recursive delivery and unknown precedence are unsupported.');
}

export function validateFoundationInteractionEffect(e) {
    check(e?.type === 'foundationInteraction' && ['enroll','create','remove'].includes(e.operation), 'Invalid interaction lifecycle operation.');
    if (e.operation === 'enroll') return;
    check(id(e.id), 'Interaction instance needs a stable ID.');
    if (e.operation === 'remove') return;
    check(['barrier','suppressor','projectile'].includes(e.kind) && FOUNDATION_INTERACTION_POLICIES.includes(e.policy), 'Unknown interaction policy or instance kind.');
    check(selector(e.actor) && selector(e.target) && id(e.bodyId) && id(e.targetBodyId) && id(e.sourceId), 'Instance needs exact participants, bodies and source.');
    check(natural(e.duration) && e.duration > 0 && ['admission','sustained','released'].includes(e.support), 'Instance needs a finite lifetime and support contract.');
    check(e.kind !== 'projectile' || e.support === 'released', 'Physical projectiles must be released.');
    check(e.kind === 'projectile' || e.support !== 'released', 'Only physical projectiles can use released support.');
    check(e.fuel == null || id(e.fuel.key) && Number.isFinite(e.fuel.amount) && e.fuel.amount > 0, 'Invalid interaction fuel requirement.');
    if (e.kind === 'suppressor') {
        check(channels.includes(e.channel) && stages.includes(e.stage), 'Suppressor must name its channel and stage.');
        check(e.targetInstanceId == null || id(e.targetInstanceId) && e.targetInstanceId !== e.id, 'Invalid or cyclic suppressor instance target.');
    }
    check(e.aidActors == null || e.kind === 'barrier' && e.policy === 'P-B' && Array.isArray(e.aidActors) && e.aidActors.every(id) && new Set(e.aidActors).size === e.aidActors.length, 'Aid admission must explicitly name actors under P-B.');
    check(e.reflect == null && e.next == null && e.precedence == null, 'Unsupported cyclic or ambiguous interaction policy.');
}

function descriptor(e, context) {
    const d = e.type === 'foundationInteraction' ? {actorId:e.actor,targetId:e.target,bodyId:e.bodyId,targetBodyId:e.targetBodyId,sourceId:e.sourceId,support:e.support,fuel:e.fuel} : e.delivery;
    return {...d, actorId:bind(d.actorId,context), targetId:bind(d.targetId,context)};
}
function supportPresent(state, d, context = {}, {fuel = false, contact = true} = {}) {
    const a = state.actors?.[d.actorId], t = state.actors?.[d.targetId];
    const p = state.simulation?.people?.[d.actorId], q = state.simulation?.people?.[d.targetId];
    const source = a?.sources?.[d.sourceId], faculty = state.simulation?.faculties?.[d.actorId]?.[d.sourceId];
    const location = personId => personId === context.actorId ? context.facts?.location || state.simulation.people[personId]?.location : state.simulation.people[personId]?.location;
    return !!(a && t && a.worldId === t.worldId && p?.life === 'alive' && q?.life === 'alive' &&
        p.body?.id === d.bodyId && p.body.ownerId === d.actorId && p.body.controllerId === d.actorId &&
        p.body.form === 'humanoid' && p.body.mobile === true && p.body.hands >= 2 && p.body.handsUsable === true && p.body.handsTender !== true &&
        q.body?.id === d.targetBodyId && q.body.ownerId === d.targetId && q.body.controllerId === d.targetId &&
        (d.actorId !== 'player' || context.nativeAlive !== false) &&
        (!contact || location(d.actorId) === location(d.targetId)) && source && (source.expiresAt == null || source.expiresAt > state.clock) &&
        faculty?.awakened && faculty.active && !faculty.suppressed &&
        (!fuel || !d.fuel || (a.resources?.[d.fuel.key] || 0) >= d.fuel.amount));
}
function targetPresent(state, d) {
    const p = state.simulation?.people?.[d.targetId];
    return !!(state.actors?.[d.targetId] && p?.life === 'alive' && p.body?.id === d.targetBodyId && p.body.ownerId === d.targetId && p.body.controllerId === d.targetId);
}
function live(state, instance, context) {
    return instance.status === 'present' && instance.expiresAt > state.clock &&
        (instance.support !== 'sustained' || supportPresent(state,instance,context));
}
function suppressors(state, instance, stage, channel, context) {
    return Object.values(state.simulation?.foundationInteraction?.instances || {}).filter(s =>
        s.kind === 'suppressor' && live(state,s,context) && s.stage === stage && s.channel === channel &&
        s.targetId === (instance.kind === 'barrier' ? instance.targetId : instance.actorId) &&
        s.targetBodyId === (instance.kind === 'barrier' ? instance.targetBodyId : instance.bodyId) &&
        (s.targetInstanceId == null || s.targetInstanceId === instance.id)).map(s => s.id).sort();
}

// Call before any cost, RNG draw or sequence advancement, including encounter
// responses. Blocking is a legal paid attempt; invalid physical means throw.
export function admitFoundationInteraction(state, effects, context = {}, {fuel = true} = {}) {
    for (const e of effects || []) {
        if (e.type === 'foundationInteraction') {
            validateFoundationInteractionEffect(e);
            if (e.operation === 'enroll') continue;
            check(state.simulation?.foundationInteraction, 'Enroll the development interaction consumer first.');
            if (e.operation === 'remove') {
                const prior = state.simulation.foundationInteraction.instances[e.id];
                check(prior?.status === 'present' && prior.actorId === bind(e.actor,context), 'Removal needs the current owned instance.');
                continue;
            }
            check(!Object.hasOwn(state.simulation.foundationInteraction.instances,e.id), 'Duplicate interaction instance.');
            check(Object.keys(state.simulation.foundationInteraction.instances).length < FOUNDATION_INTERACTION_INSTANCE_BUDGET, 'Finite interaction instance budget exhausted.');
            check(supportPresent(state,descriptor(e,context),context,{fuel}), 'Interaction lacks its actual body, source, faculty, fuel or contact.');
            if(e.kind==='suppressor'&&e.targetInstanceId!=null){
                const target=state.simulation.foundationInteraction.instances[e.targetInstanceId],d=descriptor(e,context);
                check(target?.kind==='barrier'&&target.status==='present'&&target.expiresAt>state.clock&&target.targetId===d.targetId&&target.targetBodyId===d.targetBodyId,'A named counter needs the present barrier on its exact target body.');
            }
        }
        if (e.delivery) {
            validateFoundationDelivery(e.delivery);
            check(e.type === 'vital' && bind(e.actor,context) === bind(e.delivery.targetId,context), 'Interaction delivery must address its exact vital recipient.');
            if (typeof e.amount === 'number') check(e.delivery.intent === 'aid' ? e.amount > 0 : e.amount < 0, 'Delivery intent must match its actual vital consequence.');
            check(state.simulation?.foundationInteraction, 'Enroll the development interaction consumer first.');
            check(supportPresent(state,descriptor(e,context),context,{fuel}), 'Interaction lacks its actual body, source, faculty, fuel or contact.');
        }
    }
    return true;
}

// Freeze activation-only counters into the accepted effect/job, so a later
// disappearing counter cannot turn a failed launch into successful delivery.
// Caller already admitted the command before costs. No second fuel spend.
export function freezeFoundationInteractionActivation(state, effects, context = {}) {
    return (effects || []).map(original => {
        const e = clone(original); if (!e.delivery) return e;
        validateFoundationDelivery(e.delivery);
        const d = descriptor(e,context);
        e.delivery.activationBlockedBy = suppressors(state,d,'activation',d.channel,context);
        return e;
    });
}

function record(module, state, cause, event) {
    const key = `${cause}:${event.id}:${event.operation}`;
    check(!module.history.some(h => h.key === key), 'Duplicate interaction cause.');
    module.history.push({...clone(event),key,cause,at:state.clock});
    // Retain instance IDs forever; prune only observer receipts, like native log.
    if (module.history.length > 256) module.history.splice(0,module.history.length-256);
}
export function applyFoundationInteractionEffect(state, e, context, cause) {
    validateFoundationInteractionEffect(e); check(id(cause), 'Interaction needs a durable cause.');
    if (e.operation === 'enroll') {
        check(!state.simulation.foundationInteraction, 'Interaction consumer already enrolled.');
        state.simulation.foundationInteraction = {schema:1,instances:{},history:[]}; return;
    }
    const m = state.simulation?.foundationInteraction;
    check(m, 'Interaction consumer is absent.');
    if (e.operation === 'remove') {
        admitFoundationInteraction(state,[e],context);
        m.instances[e.id].status = 'removed'; m.instances[e.id].endedAt = state.clock;
        m.instances[e.id].endCause = cause;
        record(m,state,cause,{id:e.id,operation:'remove'}); return;
    }
    admitFoundationInteraction(state,[e],context,{fuel:false});
    const d = descriptor(e,context);
    const blockedBy = suppressors(state,{...d,id:e.id,kind:e.kind},'activation',e.kind === 'projectile' ? 'physical' : 'magic',context);
    if (blockedBy.length) {record(m,state,cause,{id:e.id,operation:'blocked-activation',blockedBy,actorId:d.actorId,targetId:d.targetId}); return;}
    m.instances[e.id] = {...d,id:e.id,kind:e.kind,policy:e.policy,worldId:state.actors[d.actorId].worldId,status:'present',at:state.clock,expiresAt:state.clock+e.duration,cause,
        ...(e.kind === 'barrier' && e.policy === 'P-B' ? {aidActors:clone(e.aidActors || [])} : {}),
        ...(e.kind === 'suppressor' ? {channel:e.channel,stage:e.stage,targetInstanceId:e.targetInstanceId || null} : {})};
    record(m,state,cause,{id:e.id,operation:'create'});
}

// Pure preview/completion gate. Never mutates vitals, history, knowledge or RNG.
export function resolveFoundationDelivery(state, original, context = {}) {
    if (!original.delivery) return {allowed:true,legacy:true,blockedBy:[]};
    validateFoundationDelivery(original.delivery);
    check(state.simulation?.foundationInteraction, 'Interaction consumer is absent.');
    const d = descriptor(original,context), m = state.simulation.foundationInteraction;
    check(original.type === 'vital' && bind(original.actor,context) === d.targetId, 'Interaction delivery must address its exact vital recipient.');
    if (typeof original.amount === 'number') check(d.intent === 'aid' ? original.amount > 0 : original.amount < 0, 'Delivery intent must match its actual vital consequence.');
    if (d.activationBlockedBy?.length) return {allowed:false,reason:'activation-blocked',blockedBy:clone(d.activationBlockedBy)};
    if (!targetPresent(state,d)) return {allowed:false,reason:'target-lost',blockedBy:[]};
    if (d.support === 'released') {
        const projectile = m.instances[d.projectileId];
        check(projectile?.kind === 'projectile' && projectile.actorId === d.actorId && projectile.targetId === d.targetId && projectile.bodyId === d.bodyId && projectile.targetBodyId === d.targetBodyId && projectile.sourceId === d.sourceId, 'Delivery has no exact released projectile.');
        if (!live(state,projectile,context)) return {allowed:false,reason:'projectile-ended',blockedBy:[]};
        if (state.actors[d.targetId].worldId !== projectile.worldId) return {allowed:false,reason:'target-lost',blockedBy:[]};
    } else if (d.support === 'sustained' && !supportPresent(state,d,context)) return {allowed:false,reason:'support-lost',blockedBy:[]};
    else if (state.actors[d.actorId]?.worldId !== state.actors[d.targetId].worldId) return {allowed:false,reason:'target-lost',blockedBy:[]};
    const blocked = suppressors(state,d,'delivery',d.channel,context);
    if (d.channel === 'magic' && d.actorId !== d.targetId) for (const b of Object.values(m.instances)) {
        if (b.kind !== 'barrier' || b.targetId !== d.targetId || b.targetBodyId !== d.targetBodyId || !live(state,b,context)) continue;
        if (suppressors(state,b,'sustained','magic',context).length) continue;
        if (b.policy === 'P-B' && d.intent === 'aid' && b.aidActors.includes(d.actorId)) continue;
        blocked.push(b.id);
    }
    return {allowed:!blocked.length,reason:blocked.length?'blocked':'delivered',blockedBy:[...new Set(blocked)].sort()};
}
export function recordFoundationDelivery(state, effect, context, cause, result) {
    if (!effect.delivery) return;
    const d = descriptor(effect,context);
    record(state.simulation.foundationInteraction,state,cause,{id:d.id,operation:result.allowed?'delivered':'blocked',reason:result.reason,blockedBy:result.blockedBy,actorId:d.actorId,targetId:d.targetId});
}
export function advanceFoundationInteractions(state, context = {}) {
    const m = state.simulation?.foundationInteraction; if (!m) return 0;
    let work = 0;
    for (const i of Object.values(m.instances)) if (i.status === 'present') {
        const expired = i.expiresAt <= state.clock;
        if (expired || i.support === 'sustained' && !supportPresent(state,i,context)) {
            i.status = expired ? 'expired' : 'support-lost'; i.endedAt = state.clock;
            i.endCause = `${i.status}:${i.id}`; work++;
            record(m,state,i.endCause,{id:i.id,operation:i.status});
        }
    }
    return work;
}
export function nextFoundationInteractionBoundary(state) {
    return Math.min(Infinity,...Object.values(state.simulation?.foundationInteraction?.instances || {}).filter(i=>i.status==='present' && i.expiresAt>state.clock).map(i=>i.expiresAt));
}
export function foundationInteractionView(state, actorId, context = {}) {
    const m = state.simulation?.foundationInteraction; if (!m) return null;
    // Only own instances and actual actor-addressed receipts. No future causes.
    return {instances:Object.values(m.instances).filter(i=>i.actorId===actorId || i.targetId===actorId).map(i=>({id:i.id,kind:i.kind,policy:i.policy,expiresAt:i.expiresAt,
        status:i.status !== 'present' ? i.status : i.expiresAt <= state.clock ? 'expired' : i.support === 'sustained' && !supportPresent(state,i,context) ? 'support-lost' : i.kind === 'barrier' && suppressors(state,i,'sustained','magic',context).length ? 'suppressed' : 'present'})),
        history:clone(m.history.filter(h=>h.actorId===actorId || h.targetId===actorId || m.instances[h.id]?.actorId===actorId))};
}
export function validateFoundationInteractionState(state) {
    const m = state.simulation?.foundationInteraction; if (m == null) return;
    check(m.schema === 1 && m.instances && !Array.isArray(m.instances) && Object.keys(m.instances).length <= FOUNDATION_INTERACTION_INSTANCE_BUDGET && Array.isArray(m.history) && m.history.length <= 256, 'Invalid interaction state.');
    for (const [key,i] of Object.entries(m.instances)) {
        check(key === i.id && id(key) && id(i.actorId) && id(i.targetId) && id(i.worldId) && state.actors[i.actorId] && state.actors[i.targetId], 'Invalid interaction participant.');
        validateFoundationInteractionEffect({type:'foundationInteraction',operation:'create',...i,actor:i.actorId,target:i.targetId,duration:i.expiresAt-i.at});
        check(natural(i.at) && i.at <= state.clock && natural(i.expiresAt) && id(i.cause) && ['present','removed','expired','support-lost'].includes(i.status), 'Invalid interaction lifecycle.');
        check(i.status === 'present' || natural(i.endedAt) && i.endedAt <= state.clock && id(i.endCause), 'Invalid interaction end receipt.');
    }
    const keys = new Set();
    for (const h of m.history) {check(id(h.id) && id(h.cause) && natural(h.at) && h.at <= state.clock && typeof h.key === 'string' && !keys.has(h.key) && ['create','remove','blocked-activation','delivered','blocked','expired','support-lost'].includes(h.operation), 'Invalid interaction history.'); keys.add(h.key);}
}
