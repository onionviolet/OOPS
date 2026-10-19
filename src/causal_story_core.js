import {check, copy, finite, natural, object, sameJson as same} from './basics.js';
import {
    CAUSAL_STORY_SCHEMA, CAUSAL_STORY_ENGINE_SCHEMA, CAUSAL_STORY_DEFINITION_REVISION,
    CAUSAL_STORY_WORLD, CAUSAL_STORY_LOCATION, CAUSAL_STORY_PEOPLE, CAUSAL_STORY_PROOFS,
    CAUSAL_STORY_PROFILES, CAUSAL_STORY_SOURCES, CAUSAL_STORY_ITEMS, CAUSAL_STORY_LIMITS, causalStoryPersonIds,
} from './causal_story_ids.js';
import {rollCombatStrike, mitigateCombatDamage} from './combat_math.js';

// These functions stage only the optional causal ledger. The existing native,
// simulation, job, clock and durable publication owners retain all actual means.
const id = v => typeof v === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(v) && !['__proto__','constructor','prototype'].includes(v);
const prefix = p => `causal.story.${p}.`;
const sourceIds = new Set(Object.values(CAUSAL_STORY_SOURCES));
const siteIds = new Set(['causal.story.research','causal.story.care','causal.story.ordinary',
    ...CAUSAL_STORY_PROOFS.map(p => `causal.story.delivery.${p}`)]);
const flagNames = new Set(['noticed','accepted','delivered','copyHeld','copyDelivered','warned','attacked',
    'suspectsPlayer','guardReady','careRequested','methodTaught','severAuthorized','followupDone']);
const proofFields = ['id','revision','leadId','openedAt','deadline','phase','protection','anchor','delivery','closure','restraint','lastResult'];
const accountFields = ['life','body','capture','goal','player','local','protection','anchor','finality','evidence'];
const person = (state, actorId) => state.simulation?.people?.[actorId];
const actor = (state, actorId) => state.actors?.[actorId];
const flag = (state, actorId, proofId, name) => actor(state,actorId)?.facts?.[`${prefix(proofId)}${name}`] === true;
const knowledge = (state, actorId, key) => state.simulation?.knowledge?.[actorId]?.[key];
const profile = proofId => {check(CAUSAL_STORY_PROOFS.includes(proofId),'Unknown causal proof.');return CAUSAL_STORY_PROFILES[proofId];};
function exact(value, required, optional = [], label = 'causal record') {
    check(object(value) && required.every(k => Object.hasOwn(value,k)) &&
        Object.keys(value).every(k => required.includes(k) || optional.includes(k)), `Invalid ${label} fields.`);
}
function json(value, depth = 0) {
    check(depth < 16,'Causal evidence is too deeply nested.');
    if(value === null || typeof value === 'boolean') return;
    if(typeof value === 'string') {check(value.length <= 2048,'Causal evidence text is too long.');return;}
    if(typeof value === 'number') {check(finite(value),'Causal evidence number must be finite.');return;}
    check(Array.isArray(value) || object(value),'Causal records must contain JSON values.');
    check(Object.keys(value).length <= (Array.isArray(value) ? CAUSAL_STORY_LIMITS.receipts : 64),
        'Causal evidence has too many fields.');
    for(const [key, child] of Object.entries(value)) {
        check(!['__proto__','constructor','prototype'].includes(key),'Unsafe causal evidence key.');json(child,depth+1);
    }
}
function registryHas(registry, family, key) {
    if(!registry) return true;
    const owner = family === 'sources' || family === 'worlds' ? registry : registry.simulation || registry;
    return owner[family]?.has(key) === true;
}
function currentPerson(state, actorId) {
    const a=actor(state,actorId),p=person(state,actorId);
    check(id(actorId) && a && p,'Causal reference names no current actor.');
    check(['alive','incapacitated','dead','departed'].includes(p.life),'Unsupported causal participant life.');
    check(typeof p.location === 'string' && p.location.length > 0 && state.worlds?.[a.worldId],
        'Causal actor needs its actual world and location.');
    return p;
}
function sourceSupport(state, actorId, sourceId) {
    const s=actor(state,actorId)?.sources?.[sourceId],f=state.simulation?.faculties?.[actorId]?.[sourceId];
    return !!s && natural(s.acquiredAt) && s.acquiredAt <= state.clock &&
        (s.expiresAt === null || natural(s.expiresAt) && s.expiresAt > state.clock) &&
        f?.awakened === true && f.active === true && f.suppressed === false;
}
function validateSource(state, actorId, sourceId, registry) {
    const s=actor(state,actorId)?.sources?.[sourceId];
    check(sourceIds.has(sourceId) && registryHas(registry,'sources',sourceId),'Unknown causal source definition.');
    exact(s,['acquiredAt','expiresAt','receiptId'],['worldId','revision','origin'],'causal source');
    check(natural(s.acquiredAt) && s.acquiredAt <= state.clock && id(s.receiptId) &&
        (s.expiresAt === null || natural(s.expiresAt) && s.expiresAt > s.acquiredAt), 'Malformed causal source receipt.');
    check(s.worldId == null || s.worldId === actor(state,actorId).worldId,'Causal source acquisition world disagrees.');
    check(s.revision == null || s.revision === CAUSAL_STORY_DEFINITION_REVISION,'Unsupported causal source revision.');
    check(s.origin == null || ['unknown','inherited','trained','acquired'].includes(s.origin),'Unsupported causal source acquisition.');
    const f=state.simulation?.faculties?.[actorId]?.[sourceId];
    exact(f,['awakened','active','suppressed','development'],[],'causal faculty');
    check(['awakened','active','suppressed'].every(k => typeof f[k] === 'boolean') && finite(f.development) && f.development >= 0 &&
        (!f.active || f.awakened),'Malformed causal source lifecycle.');
}
function validateKnowledge(state, actorId, key) {
    currentPerson(state,actorId);
    const k=knowledge(state,actorId,key);
    check(id(key) && k && ['seen','interpreted','understood'].includes(k.stage) && typeof k.value === 'string' &&
        natural(k.at) && k.at <= state.clock && id(k.cause),'Causal evidence needs actual received knowledge.');
    if(k.basis) {
        check(['recollection','observation','instruction','inference'].includes(k.basis.kind) && id(k.basis.situationId) &&
            state.simulation?.situations?.[k.basis.situationId],'Causal knowledge has no actual situation attribution.');
        currentPerson(state,k.basis.attributedTo);
    }
}
function evidenceRecords(value, state, registry) {
    if(value == null) return;
    check(Array.isArray(value) && value.length <= 16,'Causal evidence must be a bounded array.');
    for(const e of value) {
        exact(e,['actorId'],['sourceId','siteId','knowledgeKey','observedBy','attributedTo','text'],'causal evidence');
        currentPerson(state,e.actorId);
        if(e.sourceId != null) {
            check(sourceIds.has(e.sourceId) && registryHas(registry,'sources',e.sourceId),'Causal evidence names an unknown source.');
            // A severed relation stays a historical observation. Its exact
            // beginning admitted an actual source; it confers no current ability.
            const expected=e.sourceId === CAUSAL_STORY_SOURCES.anchor ? 'anchor' :
                e.sourceId === CAUSAL_STORY_SOURCES.covenant ? 'covenant' : null;
            check(actor(state,e.actorId).sources?.[e.sourceId] || expected &&
                state.causalStories.proofs[expected]?.leadId === e.actorId,
                'Causal source evidence has no current or explicitly begun original owner.');
        }
        if(e.siteId != null) check(siteIds.has(e.siteId) && state.simulation?.sites?.[e.siteId] && registryHas(registry,'sites',e.siteId),
            'Causal evidence needs its actual site.');
        if(e.knowledgeKey != null) validateKnowledge(state,e.actorId,e.knowledgeKey);
        if(e.attributedTo != null) currentPerson(state,e.attributedTo);
        if(e.observedBy != null) {
            check(Array.isArray(e.observedBy) && e.observedBy.length <= 6 && new Set(e.observedBy).size === e.observedBy.length,
                'Invalid causal evidence audience.');
            e.observedBy.forEach(observer => currentPerson(state,observer));
        }
        if(e.text != null) check(typeof e.text === 'string' && e.text.length <= 2048,'Invalid causal observation text.');
    }
}
function validateReceipt(r, state, registry) {
    exact(r,['cause','sequence','at','proofId','kind','actorId','targetId','result'],['evidence'],'causal receipt');
    profile(r.proofId);
    check(id(r.cause) && natural(r.sequence) && r.sequence <= state.sequence && natural(r.at) && r.at <= state.clock &&
        id(r.kind) && r.kind.length <= 64,'Malformed or future causal receipt.');
    currentPerson(state,r.actorId);if(r.targetId !== null) currentPerson(state,r.targetId);
    check(r.at >= state.causalStories.proofs[r.proofId]?.openedAt,'Causal receipt predates its proof.');
    json(r.result);evidenceRecords(r.evidence,state,registry);
}
function deliveryFacts(state, proofId) {
    const leadId=profile(proofId).leadId;
    return {direct:flag(state,leadId,proofId,'delivered'), copy:flag(state,CAUSAL_STORY_PEOPLE.witness,proofId,'copyDelivered')};
}
function validateAccount(value, state, proofId) {
    exact(value,accountFields,[],'causal closure account');
    check(['alive','incapacitated','dead','departed'].includes(value.life) &&
        ['living','wounded','lost','absent'].includes(value.body) && ['free','held','unavailable'].includes(value.capture) &&
        ['delivered','failed','withdrawn'].includes(value.goal) &&
        ['supported','copy_delivered','opposed','withdrawn','uncommitted'].includes(value.player) &&
        ['warned','unwarned','unresolved'].includes(value.local) &&
        ['none','intact','severed'].includes(value.protection) && ['none','established','isolated'].includes(value.anchor) &&
        ['embodied','identity_retained','terminal','departed'].includes(value.finality),'Unknown causal closure facet.');
    check(Array.isArray(value.evidence) && value.evidence.length <= CAUSAL_STORY_LIMITS.perProof &&
        new Set(value.evidence).size === value.evidence.length && value.evidence.every(cause => id(cause) &&
            state.causalStories.receipts.some(r => r.proofId === proofId && r.cause === cause && r.kind !== 'closure')),
        'Closure lacks retained qualifying causes.');
    check(value.life !== 'dead' || ['terminal','identity_retained'].includes(value.finality),'Death and identity closure disagree.');
    check(value.finality !== 'identity_retained' || proofId === 'anchor' && value.anchor === 'established',
        'Only the established original anchor can retain a lost identity.');
}
function validateRestraint(r,state,proof) {
    exact(r,['captorId','loanId','key','at','cause'],[],'causal restraint');
    currentPerson(state,r.captorId);
    check(id(r.loanId) && r.key === CAUSAL_STORY_ITEMS.rope && natural(r.at) && r.at >= proof.openedAt && r.at <= state.clock && id(r.cause),
        'Malformed causal capture receipt.');
    const c=state.simulation?.custody?.[r.loanId];
    check(c && c.key === r.key && c.owner === r.captorId && c.holder === proof.leadId && c.count === 1 &&
        c.at === r.at && c.cause === r.cause && person(state,proof.leadId).life === 'incapacitated',
        'Capture needs actual one-rope custody and incapacitation.');
    check(state.causalStories.receipts.some(t => t.proofId === proof.id && t.cause === r.cause && t.kind === 'capture'),
        'Capture needs its retained causal receipt.');
}

/** Create only the optional ledger; explicit host enrollment owns all people and means. */
export function createCausalStoryState(state) {
    check(state?.schema === CAUSAL_STORY_ENGINE_SCHEMA && natural(state.clock) && natural(state.sequence) && state.simulation,
        'Causal enrollment requires explicit expansion11 and the played simulation clock.');
    check(state.causalStories == null,'Causal stories are already enrolled.');
    return {schema:CAUSAL_STORY_SCHEMA,definitionRevision:CAUSAL_STORY_DEFINITION_REVISION,enrolledAt:state.clock,
        nativeRevision:0,proofs:Object.fromEntries(CAUSAL_STORY_PROOFS.map(p => [p,null])),receipts:[]};
}

export function validateCausalStories(state, registry) {
    const d=state?.causalStories;
    if(d == null) {
        const ownsFacts=a => Object.keys(a?.facts || {}).some(k => k.startsWith('causal.story.'));
        check(!causalStoryPersonIds.some(p => actor(state,p) || person(state,p)) &&
            !Object.values(state?.actors || {}).some(a => ownsFacts(a) || Object.keys(a.sources || {}).some(s => sourceIds.has(s))) &&
            !Object.values(state?.simulation?.knowledge || {}).some(k => Object.keys(k).some(key => key.startsWith('causal.story.'))) &&
            !Object.values(state?.simulation?.faculties || {}).some(f => Object.keys(f).some(s => sourceIds.has(s))) &&
            !Object.values(state?.simulation?.powers || {}).some(p => Object.keys(p).some(s => sourceIds.has(s))) &&
            !(state?.simulation?.jobs || []).some(j => j.commandId?.startsWith('causal.story.') || j.causalStory || j.causalStoryResolution) &&
            !(state?.pending || []).some(j => j.actionId?.startsWith('causal.story.')),
            'Optional causal means, knowledge and work require their enrolled owner.');
        return true;
    }
    json(d);exact(d,['schema','definitionRevision','enrolledAt','nativeRevision','proofs','receipts'],[],'causal stories');
    check(state.schema === CAUSAL_STORY_ENGINE_SCHEMA && d.schema === CAUSAL_STORY_SCHEMA &&
        d.definitionRevision === CAUSAL_STORY_DEFINITION_REVISION && natural(d.enrolledAt) && d.enrolledAt <= state.clock &&
        natural(d.nativeRevision),'Unsupported causal schema, admission or native revision.');
    exact(d.proofs,CAUSAL_STORY_PROOFS,[],'causal proof map');
    check(Array.isArray(d.receipts) && d.receipts.length <= CAUSAL_STORY_LIMITS.receipts,'Invalid bounded causal receipt history.');
    currentPerson(state,'player');
    check(registryHas(registry,'worlds',CAUSAL_STORY_WORLD),'Missing causal base-world definition.');
    for(const actorId of causalStoryPersonIds) {
        const p=currentPerson(state,actorId),a=actor(state,actorId),b=p.body,v=p.vitals;
        check(a.worldId === CAUSAL_STORY_WORLD && p.inventory === 'native' && p.definitionId === actorId &&
            p.definitionRevision === CAUSAL_STORY_DEFINITION_REVISION && [CAUSAL_STORY_LOCATION,'Shack'].includes(p.location) &&
            registryHas(registry,'people',actorId),'Unsupported actual causal person, inventory or location.');
        check(b?.id === `native.person.${actorId}.body` && b.ownerId === actorId && b.controllerId === actorId && b.form === 'human',
            'Causal identity needs its independent current native body.');
        check(object(v) && ['health','stamina','max_health','max_stamina'].every(k => finite(v[k]) && v[k] >= 0) &&
            v.max_health > 0 && v.max_stamina > 0 && v.health <= v.max_health && v.stamina <= v.max_stamina &&
            (p.life === 'dead' ? v.health === 0 : p.life !== 'alive' || v.health > 0),'Causal life and actual vitals disagree.');
        check(!state.simulation.owners?.[actorId],'Causal native stock cannot have another inventory owner.');
        for(const s of Object.keys(a.sources || {}).filter(s => sourceIds.has(s))) validateSource(state,actorId,s,registry);
    }
    for(const [actorId,a] of Object.entries(state.actors)) {
        for(const s of Object.keys(a.sources || {}).filter(s => sourceIds.has(s))) validateSource(state,actorId,s,registry);
        for(const [key,value] of Object.entries(a.facts || {}).filter(([key]) => key.startsWith('causal.story.'))) {
            const p=CAUSAL_STORY_PROOFS.find(p => key.startsWith(prefix(p)));
            check(p && flagNames.has(key.slice(prefix(p).length)) && typeof value === 'boolean','Unknown or untyped causal actor flag.');
            currentPerson(state,actorId);
        }
        for(const key of Object.keys(state.simulation.knowledge?.[actorId] || {}).filter(k => k.startsWith('causal.story.')))
            validateKnowledge(state,actorId,key);
    }
    for(const siteId of siteIds) {
        const site=state.simulation.sites?.[siteId];
        check(site && natural(site.capacity) && site.capacity > 0 && object(site.reservations) &&
            Object.keys(site.reservations).length <= site.capacity && registryHas(registry,'sites',siteId),
            'Enrolled causal work needs its current registered sites and capacity.');
        if(site.owner != null) currentPerson(state,site.owner);
    }
    const keys=new Set();let previousSequence=-1,previousAt=-1;
    for(const job of state.simulation.jobs || []) if(job.commandId?.startsWith('causal.story.') && job.commandId.endsWith('.sever_job'))
        check(job.causalStory?.schema === 1 && job.causalStory.operation === 'sever' && job.causalStory.policyRevision === 1 &&
            ['covenant','anchor'].includes(job.causalStory.proofId) && job.commandId === `${prefix(job.causalStory.proofId)}sever_job` &&
            job.actorId === 'player' && job.effects?.length === 0 && job.reservationReturns === 1,
            'A saved causal counter requires its exact opted-in current-resolution descriptor.');
    for(const r of d.receipts) {
        validateReceipt(r,state,registry);
        const key=[r.cause,r.proofId,r.kind,r.actorId,r.targetId].join('|');
        check(!keys.has(key) && r.sequence >= previousSequence && r.at >= previousAt,'Duplicate or reordered causal receipt.');
        keys.add(key);previousSequence=r.sequence;previousAt=r.at;
    }
    for(const proofId of CAUSAL_STORY_PROOFS) {
        const p=d.proofs[proofId],def=profile(proofId),receipts=d.receipts.filter(r => r.proofId === proofId);
        if(p === null) {check(receipts.length === 0,'Unbegun causal proof has orphan receipts.');continue;}
        exact(p,proofFields,[],'causal proof');
        check(p.id === proofId && natural(p.revision) && p.revision > 0 && p.leadId === def.leadId && natural(p.openedAt) &&
            p.openedAt >= d.enrolledAt && p.openedAt <= state.clock && p.deadline === p.openedAt+CAUSAL_STORY_LIMITS.clockWindow &&
            ['open','closed'].includes(p.phase) && ['none','intact','severed'].includes(p.protection) &&
            ['pending','delivered','failed','withdrawn'].includes(p.delivery),'Unsupported exact causal proof policy.');
        check(receipts.length <= CAUSAL_STORY_LIMITS.perProof && receipts.filter(r => r.kind === 'begin').length === 1 &&
            receipts.find(r => r.kind === 'begin').at === p.openedAt,'Causal proof lacks its once beginning.');
        if(proofId === 'mortal') check(p.protection === 'none' && p.anchor === null,'Mortal proof cannot acquire a hidden protection.');
        else check(p.protection !== 'none','Protected proof requires retained intact or severed disposition.');
        if(proofId === 'anchor') {
            exact(p.anchor,['id','identity','scope','topology','status'],[],'causal anchor');
            check(p.anchor.id === 'causal.story.anchor.identity' && p.anchor.identity === def.identity && p.anchor.scope === CAUSAL_STORY_WORLD &&
                p.anchor.topology === def.topology && ['established','isolated'].includes(p.anchor.status),'Unsupported actual original future-anchor topology.');
            check((p.anchor.status === 'established') === (p.protection === 'intact'),'Anchor reach and protection disposition disagree.');
            if(p.anchor.status === 'established') check(sourceSupport(state,p.leadId,CAUSAL_STORY_SOURCES.anchor),
                'Established identity requires its actual surviving active anchor source.');
            else check(receipts.some(r => ['severance','source_release'].includes(r.kind)), 'Isolated anchor needs its earned release cause.');
        } else check(p.anchor === null,'Only the selected anchor proof owns a future identity.');
        if(proofId === 'covenant' && p.protection === 'intact') check(sourceSupport(state,p.leadId,CAUSAL_STORY_SOURCES.covenant),
            'Intact conditional survival requires its actual active covenant.');
        if(p.protection === 'severed') check(receipts.some(r => ['severance','source_release'].includes(r.kind)) &&
            !sourceSupport(state,p.leadId,proofId === 'anchor' ? CAUSAL_STORY_SOURCES.anchor : CAUSAL_STORY_SOURCES.covenant),
            'Severance needs retained intervention evidence and an actually inactive original relation.');
        const delivery=deliveryFacts(state,proofId);
        check(p.delivery === 'delivered' ? delivery.direct || delivery.copy : !delivery.direct && !delivery.copy,
            'Causal delivery must derive from actual direct or copied completion.');
        if(flag(state,CAUSAL_STORY_PEOPLE.witness,proofId,'copyHeld') || delivery.copy) {
            validateKnowledge(state,CAUSAL_STORY_PEOPLE.witness,`${prefix(proofId)}warning`);
            check(knowledge(state,CAUSAL_STORY_PEOPLE.witness,`${prefix(proofId)}warning`).stage === 'understood' &&
                (!delivery.copy || flag(state,CAUSAL_STORY_PEOPLE.witness,proofId,'copyHeld')),
                'A copied warning needs the actual surviving received copy, not a substituted courier flag.');
        }
        if(p.restraint !== null) validateRestraint(p.restraint,state,p);
        if(p.lastResult !== null) {json(p.lastResult);check(typeof p.lastResult === 'string' || object(p.lastResult),'Invalid causal last result.');}
        const closures=receipts.filter(r => r.kind === 'closure');
        if(p.phase === 'closed') {
            check(p.closure && closures.length === 1 && same(p.closure,closures[0]) && p.delivery !== 'pending',
                'Closed causal proof requires its once retained account.');
            validateAccount(p.closure.result,state,proofId);
            check(p.closure.result.goal === p.delivery,'Retained closure goal and committed delivery disagree.');
        } else check(p.closure === null && closures.length === 0,'Open proof has orphan closure evidence.');
    }
    return true;
}

/** Reject new ordinary history at capacity; never prune a terminal or completed cause. */
export function appendCausalStoryReceipt(plan, receipt) {
    const state=plan?.state,d=state?.causalStories;
    check(d && natural(state.sequence) && natural(state.clock),'Stage causal receipts in an enrolled transaction.');
    validateReceipt(receipt,state);
    check(receipt.sequence === state.sequence && receipt.at === state.clock,'Stage only the current quoted causal cause.');
    const perProof=d.receipts.filter(r => r.proofId === receipt.proofId),closure=receipt.kind === 'closure',recovery=['release','report'].includes(receipt.kind);
    const ordinaryTotal=CAUSAL_STORY_LIMITS.receipts-CAUSAL_STORY_LIMITS.reservedClosure*CAUSAL_STORY_PROOFS.length;
    const ordinaryProof=CAUSAL_STORY_LIMITS.perProof-CAUSAL_STORY_LIMITS.reservedClosure;
    check(d.receipts.length < (closure || recovery ? CAUSAL_STORY_LIMITS.receipts : ordinaryTotal) &&
        perProof.length < (closure || recovery ? CAUSAL_STORY_LIMITS.perProof : ordinaryProof),'Causal receipt capacity is reserved for final accounts and recovery.');
    check(!d.receipts.some(r => r.cause === receipt.cause && r.proofId === receipt.proofId && r.kind === receipt.kind &&
        r.actorId === receipt.actorId && r.targetId === receipt.targetId),'This causal cause has already been retained.');
    const previous=d.receipts.at(-1);
    check(!previous || receipt.sequence >= previous.sequence && receipt.at >= previous.at,'Causal receipt cannot reorder played history.');
    check(!closure || !perProof.some(r => r.kind === 'closure'),'Causal closure can be retained only once.');
    d.receipts.push(copy(receipt));return plan;
}

export function beginCausalStoryProof(plan, proofId, cause) {
    const state=plan?.state,d=state?.causalStories,def=profile(proofId);
    check(d && d.proofs[proofId] === null && id(cause),'Begin this enrolled proof only once.');
    currentPerson(state,def.leadId);
    check(person(state,def.leadId).life === 'alive','The actual courier must be alive to accept a new proof.');
    const protectedSource=proofId === 'anchor' ? CAUSAL_STORY_SOURCES.anchor : CAUSAL_STORY_SOURCES.covenant;
    check(proofId === 'mortal' || sourceSupport(state,def.leadId,protectedSource),'The actual original protection must exist before proof beginning.');
    d.proofs[proofId]={id:proofId,revision:1,leadId:def.leadId,openedAt:state.clock,deadline:state.clock+CAUSAL_STORY_LIMITS.clockWindow,
        phase:'open',protection:proofId === 'mortal' ? 'none' : 'intact',anchor:proofId === 'anchor' ?
            {id:'causal.story.anchor.identity',identity:def.identity,scope:CAUSAL_STORY_WORLD,topology:def.topology,status:'established'} : null,
        delivery:'pending',closure:null,restraint:null,lastResult:null};
    appendCausalStoryReceipt(plan,{cause,sequence:state.sequence,at:state.clock,proofId,kind:'begin',actorId:'player',targetId:def.leadId,
        result:{definitionRevision:CAUSAL_STORY_DEFINITION_REVISION}});
    return plan;
}

/** Pure actual-stat strike. The caller pays costs, supplies a frozen draw, and stages wounds. */
export function resolveCausalStrike({attacker,target,random}) {
    check(typeof random === 'function','Causal strikes require the caller-owned seeded draw.');
    for(const [label,f] of [['attacker',attacker],['target',target]]) {
        check(object(f) && object(f.stats) && finite(f.attackPower) && f.attackPower >= 0 &&
            finite(f.shield) && f.shield >= 0 && finite(f.shieldSkill) && f.shieldSkill >= 0,`Missing current native ${label} fighter snapshot.`);
        check(['attack_points','agility','intuition','crit_rate','crit_multiplier','defense'].every(k =>
            f.stats[k] == null || finite(f.stats[k]) && f.stats[k] >= 0),`Invalid actual ${label} combat stats.`);
    }
    check(finite(attacker.stats.attack_points) && attacker.stats.attack_points >= 0 && finite(target.stats.agility) &&
        target.stats.agility >= 0 && (target.stats.intuition ?? 1) > 0 &&
        (attacker.stats.attack_count == null || Number.isSafeInteger(attacker.stats.attack_count) && attacker.stats.attack_count > 0 && attacker.stats.attack_count <= 32),
        'Causal strike needs actual attack count, reach points and evasion.');
    const draw=()=>{const n=random();check(finite(n) && n >= 0 && n < 1,'Invalid caller-owned causal draw.');return n;};
    const strike=rollCombatStrike({attackPower:attacker.attackPower,attacker:attacker.stats,target:target.stats,
        shield:target.shield,shieldSkill:target.shieldSkill,random:draw});
    const damage=strike.kind === 'hit' ? mitigateCombatDamage(strike.values,target.stats.defense || 0) : 0;
    check(finite(damage) && damage >= 0,'Native combat produced invalid damage.');
    return {...strike,damage};
}

/** Resolve only the selected original guarantee, before any terminal native effect. */
export function resolveCausalProtection(state, proofId, candidate, context = {}) {
    const def=profile(proofId),p=state?.causalStories?.proofs?.[proofId];
    check(p && object(candidate) && candidate.targetId === def.leadId && id(candidate.actorId) &&
        ['lethal','body_erasure','capture','wound','source_severance'].includes(candidate.kind), 'Unsupported current causal protection candidate.');
    check(context.actorId === candidate.actorId,'Protection resolution must name the actual acting owner.');
    const acting=currentPerson(state,candidate.actorId),target=currentPerson(state,def.leadId);
    check(acting.life === 'alive' && acting.body?.ownerId === candidate.actorId && acting.body?.controllerId === candidate.actorId &&
        acting.body?.form === 'human','The intervention needs the actual living actor in their controlled body.');
    check(actor(state,candidate.actorId).worldId === CAUSAL_STORY_WORLD && actor(state,def.leadId).worldId === CAUSAL_STORY_WORLD &&
        target.location === person(state,candidate.actorId).location,'Causal intervention needs actual local contact.');
    const observedBy=context.observedBy || [];
    check(Array.isArray(observedBy) && observedBy.length <= 6 && new Set(observedBy).size === observedBy.length,'Invalid causal observation audience.');
    observedBy.forEach(observer => {
        const o=currentPerson(state,observer);
        check(o.life === 'alive' && actor(state,observer).worldId === CAUSAL_STORY_WORLD && o.location === target.location,
            'Only actual living local observers receive intervention evidence.');
    });
    const result={allowed:true,prevented:false,reason:'No applicable original survival guarantee.',policy:def.protection,
        life:target.life,body:'unchanged',identity:'embodied',evidence:[]};
    if(candidate.kind === 'source_severance') {
        const key=context.knowledgeKey || `${prefix(proofId)}method`,k=knowledge(state,candidate.actorId,key),keeper=CAUSAL_STORY_PEOPLE.keeper;
        const taught=flag(state,keeper,proofId,'methodTaught') || flag(state,candidate.actorId,proofId,'methodTaught');
        const attributed=k?.basis?.attributedTo === keeper || taught;
        const siteId=context.siteId || 'causal.story.research';
        result.allowed=['open','closed'].includes(p.phase) && p.protection === 'intact' && ['alive','incapacitated'].includes(target.life) &&
            key === `${prefix(proofId)}method` && def.counter === CAUSAL_STORY_SOURCES.method &&
            context.sourceId === def.counter && sourceSupport(state,candidate.actorId,def.counter) &&
            k?.stage === 'understood' && attributed && flag(state,keeper,proofId,'severAuthorized') &&
            person(state,keeper)?.life === 'alive' && person(state,keeper)?.body?.ownerId === keeper &&
            person(state,keeper)?.body?.controllerId === keeper && person(state,keeper)?.location === target.location &&
            actor(state,keeper)?.worldId === CAUSAL_STORY_WORLD && !!state.simulation?.sites?.[siteId] && siteId === 'causal.story.research';
        result.reason=result.allowed ? 'The learned authorized method can release this current original relation.' :
            'The current method, received instruction, consent or local support is missing.';
        return result;
    }
    if(!['lethal','body_erasure'].includes(candidate.kind) || candidate.terminal !== true) return result;
    check(target.life !== 'dead','A terminal candidate cannot act as a resurrection.');
    const sourceId=proofId === 'anchor' ? CAUSAL_STORY_SOURCES.anchor : CAUSAL_STORY_SOURCES.covenant;
    const intact=p.protection === 'intact' && sourceSupport(state,def.leadId,sourceId);
    const anchor=proofId === 'anchor' && p.anchor?.status === 'established' && p.anchor.id === 'causal.story.anchor.identity' &&
        p.anchor.identity === def.identity && p.anchor.scope === CAUSAL_STORY_WORLD && p.anchor.topology === def.topology;
    if(intact && (proofId === 'covenant' || anchor)) {
        result.prevented=true;result.life='alive';result.body='wounded';result.identity=anchor ? 'anchor_retained' : 'embodied';
        result.reason=anchor ? 'The already-established original identity anchor intercepts terminal erasure; actual wounds and local losses remain.' :
            'The intact original covenant intercepts terminal death; wounds, captivity and a missed warning remain possible.';
        if(observedBy.length) result.evidence=[{actorId:def.leadId,sourceId,observedBy:[...observedBy],
            text:anchor ? 'Observed terminal interference while the earlier body remained wounded.' : 'Observed survival interference while the courier remained wounded.'}];
    }
    return result;
}

/** Return separate cumulative accounts; private truth is not a player knowledge projection. */
export function evaluateCausalClosure(state, proofId) {
    const def=profile(proofId),p=state?.causalStories?.proofs?.[proofId];
    if(!p) return null;
    if(p.closure) return copy(p.closure.result);
    const delivered=deliveryFacts(state,proofId),delivery=delivered.direct || delivered.copy ? 'delivered' :
        ['failed','withdrawn'].includes(p.delivery) ? p.delivery : state.clock >= p.deadline ? 'failed' : 'pending';
    if(delivery === 'pending') return null;
    const lead=currentPerson(state,def.leadId),b=lead.body,v=lead.vitals;
    const anchor=p.anchor?.status || 'none';
    const receipts=state.causalStories.receipts.filter(r => r.proofId === proofId && r.kind !== 'closure');
    const opposed=flag(state,'player',proofId,'attacked') || receipts.some(r => r.actorId === 'player' && ['strike','capture'].includes(r.kind));
    const copied=delivered.copy && knowledge(state,'player',`${prefix(proofId)}copy`)?.stage === 'understood';
    const account={life:lead.life,body:!b ? 'absent' : lead.life === 'dead' ? 'lost' : v.health < v.max_health ? 'wounded' : 'living',
        capture:p.restraint ? 'held' : ['dead','departed'].includes(lead.life) ? 'unavailable' : 'free',goal:delivery,
        player:copied ? 'copy_delivered' : opposed ? 'opposed' : flag(state,'player',proofId,'accepted') ? 'supported' :
            delivery === 'withdrawn' || knowledge(state,'player',`${prefix(proofId)}withdrawal`) ? 'withdrawn' : 'uncommitted',
        local:delivered.direct || delivered.copy ? 'warned' : delivery === 'withdrawn' ? 'unresolved' : 'unwarned',
        protection:p.protection,anchor,finality:lead.life === 'dead' ? anchor === 'established' ? 'identity_retained' : 'terminal' :
            lead.life === 'departed' ? 'departed' : 'embodied',
        evidence:[...new Set(receipts.map(r => r.cause))]};
    validateAccount(account,state,proofId);return account;
}

export function stageCausalClosure(plan, proofId, cause) {
    const state=plan?.state,p=state?.causalStories?.proofs?.[proofId];
    check(p && id(cause),'Closure requires its enrolled proof and current cause.');
    if(p.closure) return plan;
    const result=evaluateCausalClosure(state,proofId);
    if(!result) return plan;
    const receipt={cause,sequence:state.sequence,at:state.clock,proofId,kind:'closure',actorId:'player',targetId:p.leadId,result};
    appendCausalStoryReceipt(plan,receipt);
    p.delivery=result.goal;p.phase='closed';p.closure=copy(receipt);p.revision++;
    return plan;
}

/** A held body is unavailable; an open courier arc alone does not reserve an actor. */
export function causalStoryOccupiesActor(state, actorId) {
    if(!state?.causalStories || !person(state,actorId)) return false;
    return CAUSAL_STORY_PROOFS.some(proofId => {
        const p=state.causalStories.proofs[proofId];
        return !!p?.restraint && p.leadId === actorId;
    });
}
