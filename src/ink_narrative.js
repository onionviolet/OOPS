import {Story} from 'inkjs';
import compiled from '../stories/feature_wave.json' with {type:'json'};
import retainedV1 from '../docs/gm/feature-wave/ink/content/feature_wave_v1.json' with {type:'json'};
import retainedV3 from '../docs/gm/feature-wave/ink/content/feature_wave_v3.json' with {type:'json'};
import retainedV2 from '../docs/gm/feature-wave/ink/content/feature_wave_v2.json' with {type:'json'};
import {INK_RESPONSES, inkObserverVariables, inkBindingFor} from './ink_scene_content.js';

export const INK_NARRATIVE_SCHEMA = 1;
export const INK_NARRATIVE_SCOPED_SCHEMA = 2;
export const INK_NARRATIVE_SCOPE_LIMIT = 32;
export const INK_RUNTIME_VERSION = '2.4.0';
const identityOf = artifact => Object.freeze({...artifact.yairpgInk, inkFormat:21, saveFormat:10});
export const INK_CONTENT = identityOf(compiled);
export const INK_CONTENTS = Object.freeze([identityOf(retainedV1), identityOf(retainedV2), identityOf(retainedV3), INK_CONTENT]);
const contentByHash = new Map([[retainedV1.yairpgInk.contentHash,retainedV1],[retainedV2.yairpgInk.contentHash,retainedV2],[retainedV3.yairpgInk.contentHash,retainedV3],[compiled.yairpgInk.contentHash,compiled]]);
const sceneOf = saved => saved?.sceneId || 'tidemark.negotiation';
const hostScene = host => host?.sceneId || 'tidemark.negotiation';
const artifactFor = saved => {
    const artifact = contentByHash.get(saved.contentHash);
    assert(artifact && saved.contentId === artifact.yairpgInk.storyId && saved.contentRevision === artifact.yairpgInk.storyRevision,
        'Saved conversation needs its retained compiled content. Keep its paid host effects and restore the matching build.');
    return artifact;
};
const clone = value => structuredClone(value);
const assert = (condition, message) => {if(!condition) throw new Error(message);};
const natural = n => Number.isSafeInteger(n) && n >= 0;
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const text = (value, limit = 8192) => typeof value === 'string' && value.length <= limit;
const identifier = value => text(value, 128) && value.length > 0 && /^[A-Za-z0-9_.:/-]+$/.test(value);
const scopeKeys = ['id','kind','worldId','instanceId','missionId'];
function scopeBinding(scope) {
    assert(object(scope) && Object.keys(scope).every(key => scopeKeys.includes(key)) &&
        identifier(scope.id) && ['scene','hub','destination','mission'].includes(scope.kind) && identifier(scope.worldId),
        'Ink needs an explicit supported narrative scope ID, kind and actual world ID.');
    for(const key of ['instanceId','missionId']) if(Object.hasOwn(scope, key)) assert(identifier(scope[key]), 'Invalid narrative instance or mission identity.');
    assert(!scope.missionId || !!scope.instanceId, 'A mission binding needs its actual destination instance.');
    assert(scope.kind !== 'destination' || !!scope.instanceId, 'A destination scope needs its actual persistent instance.');
    assert(scope.kind !== 'mission' || !!scope.instanceId && !!scope.missionId, 'A mission scope needs explicit instance and mission identities.');
    return Object.fromEntries(scopeKeys.filter(key => Object.hasOwn(scope, key)).map(key => [key, scope[key]]));
}
const sameScope = (left, right) => JSON.stringify(scopeBinding(left)) === JSON.stringify(scopeBinding(right));
const scopeOfHost = host => host?.scope == null ? null : scopeBinding(host.scope);
function supportedScenes(artifact) {
    const declared = artifact.yairpgInk.sceneIds;
    if(declared != null) {
        assert(Array.isArray(declared) && declared.length > 0 && declared.length <= 32 &&
            declared.every(identifier) && new Set(declared).size === declared.length, 'Compiled narrative scene identities are invalid.');
        return declared;
    }
    if(artifact.yairpgInk.storyRevision === 1) return ['tidemark.negotiation'];
    assert(artifact.yairpgInk.storyRevision === 2, 'This content revision needs its explicit compiled scene identities.');
    return ['tidemark.negotiation','relay.office'];
}
const responseId = choice => {
    const tags = (choice.tags || []).filter(tag => tag.startsWith('response:'));
    assert(tags.length === 1, 'An Ink choice needs exactly one stable host response.');
    const id = tags[0].slice('response:'.length).trim();
    assert(INK_RESPONSES.includes(id), 'This Ink response has no supported host binding.');
    return id;
};
function newStory(cursor = null, artifact = compiled) {
    const story = new Story(artifact);
    story.onError = message => {throw new Error(`Ink content: ${message}`);};
    // No EXTERNAL functions are bound. Rewards, randomness, knowledge and time
    // belong to the host; the scene contains no independent random operation.
    story.state.storySeed = 1; story.state.previousRandom = 0;
    if(cursor != null) story.state.LoadJson(cursor);
    return story;
}
// One throwaway validator avoids constructor seeding during render. Loading an
// opaque snapshot performs no continuation, randomness or external callbacks.
const validationStories = new Map([...contentByHash].map(([hash,artifact]) => [hash,newStory(null,artifact)]));
function frameOf(story) {
    const ids = new Set();
    return story.currentChoices.map(choice => {
        const id = responseId(choice);
        assert(!ids.has(id), 'The current Ink choices duplicate a stable response.');
        ids.add(id);
        return {id, label:choice.text.trim()};
    });
}
function continueFrame(story, variables) {
    for(const [key, value] of Object.entries(variables)) if(story.variablesState[key] != null) story.variablesState[key] = value;
    const paragraphs = [];
    let count = 0, length = 0;
    while(story.canContinue) {
        assert(++count <= 256, 'Ink continuation exceeded its bounded scene segment.');
        const line = story.Continue().trim();
        if(line) {length += line.length; assert(length <= 32768, 'Ink segment is too large.'); paragraphs.push(line);}
        assert(!story.currentTags.some(tag => /^command:|^reward:/.test(tag)), 'Ink continuation cannot execute a host command.');
    }
    return {paragraphs, choices:frameOf(story)};
}
function stagedContext(context, plan) {
    const actorId = context.actorId || 'player';
    return {...context, worldId:plan.state.actors[actorId]?.worldId || context.worldId,
        facts:{...context.facts,location:plan.nativeLocation || plan.state.simulation?.people[actorId]?.location || context.facts?.location},
        external:plan.external, gameplay:plan.gameplay,
        vitals:plan.vitals || context.vitals, ownership:plan.ownership || context.ownership};
}
function cursorOnly(state, context) {
    const plan = {state:clone(state), external:clone(context.external || {}), gameplay:clone(context.gameplay || {}),
        vitals:clone(context.vitals || {}), equipment:clone(context.equipment || {}), acquisitions:[], unlocks:[], gameplayBefore:clone(context.gameplay || {})};
    plan.state.sequence++;
    return plan;
}
function requireHost(host) {
    assert(host && ['observe','preview','commit'].every(name => typeof host[name] === 'function'), 'Ink needs an admitted native host bridge.');
    if(scopeOfHost(host)) {
        assert(identifier(host.sceneId), 'Scoped Ink needs an explicit authored scene identity.');
        assert(typeof host.validateScope === 'function',
            'Scoped Ink needs host.validateScope to bind the actual world, instance, mission, location, participant, body and native support.');
    }
}
function scopedHostQuote(state, registry, context, host, scope, binding = null) {
    if(!scope) return null;
    assert(object(state.worlds) && Object.hasOwn(state.worlds, scope.worldId), 'This narrative scope has no actual initialized world binding.');
    const quote = host.validateScope(state, registry, clone(scope), context, binding);
    assert(object(quote) && typeof quote.visible === 'boolean' && typeof quote.eligible === 'boolean' &&
        object(quote.scope) && sameScope(quote.scope, scope), 'The native scope validator must return its exact scope binding and synchronous eligibility.');
    return quote;
}
function requireScopedAcceptance(state, registry, context, host, scope, binding) {
    const quote = scopedHostQuote(state, registry, context, host, scope, binding);
    if(quote) assert(quote.visible && quote.eligible, quote.reasons?.join(' ') || 'Return to the actual supported narrative scope before responding.');
}
function checkedHostPlan(state, registry, binding, context, host) {
    requireScopedAcceptance(state, registry, context, host, scopeOfHost(host), binding);
    const quote = host.preview(state, registry, binding, context);
    assert(quote?.visible && quote.eligible, quote?.reasons?.join(' ') || 'This conversation action is unavailable.');
    // The supplied host remains a pure planner. Only main's durable publication
    // accepts this plan; no cursor or live resource changes here are authoritative.
    const plan = host.commit(state, registry, binding, context, state.sequence);
    assert(plan?.state !== state && natural(plan?.state?.sequence) && plan.state.sequence > state.sequence,
        'Ink requires a distinct sequenced staged host plan.');
    assert(host.allowJoinedClockAdvance === true ? natural(plan.state.clock) && plan.state.clock >= state.clock : plan.state.clock === state.clock,
        'Only an explicitly admitted joined native host plan may advance the shared narrative clock.');
    assert(object(plan.external) && object(plan.gameplay), 'Ink host plan has no native resource projection.');
    return plan;
}
function validateRecord(saved, state, scoped = false) {
    assert(object(saved) && saved.schema === INK_NARRATIVE_SCHEMA, 'Saved conversation needs its supported narrative record schema.');
    const scope = scoped ? scopeBinding(saved.scope) : null;
    if(scope) assert(object(state.worlds) && Object.hasOwn(state.worlds, scope.worldId), 'Saved narrative scope refers to an absent actual world.');
    const artifact = artifactFor(saved);
    assert(saved.runtimeVersion === INK_RUNTIME_VERSION && saved.inkFormat === 21 && saved.saveFormat === 10,
        'Saved conversation needs its supported runtime/story/cursor format. Keep its paid host effects and restore the matching build.');
    assert((!scoped || identifier(saved.sceneId)) && supportedScenes(artifact).includes(sceneOf(saved)),
        'Saved narrative scene is unsupported by its retained content.');
    assert(text(saved.sessionId, 128) && /^ink:[0-9]+$/.test(saved.sessionId) && natural(saved.revision) && saved.revision > 0 &&
        natural(saved.startedAt) && natural(saved.updatedAt) && saved.startedAt <= saved.updatedAt && saved.updatedAt <= state.clock &&
        ['active','paused','complete'].includes(saved.status), 'Invalid saved conversation session.');
    assert(text(saved.cursor, 262144), 'Invalid saved Ink cursor size.');
    const cursor = JSON.parse(saved.cursor);
    assert(cursor?.inkSaveVersion === 10 && cursor?.inkFormatVersion === 21, 'Unsupported opaque Ink cursor format.');
    const story = validationStories.get(saved.contentHash);
    story.state.LoadJson(saved.cursor);
    assert(!story.canContinue, 'Saved conversation is not at a safe response boundary.');
    const choices = frameOf(story);
    assert(object(saved.frame) && Array.isArray(saved.frame.paragraphs) && saved.frame.paragraphs.length <= 256 &&
        saved.frame.paragraphs.every(line => text(line)) && saved.frame.paragraphs.reduce((n,line)=>n+line.length,0) <= 32768 &&
        Array.isArray(saved.frame.choices) && saved.frame.choices.length <= 12 &&
        JSON.stringify(choices) === JSON.stringify(saved.frame.choices), 'Saved narrative choices no longer match the opaque cursor.');
    assert((saved.status === 'complete') === (choices.length === 0), 'Saved narrative completion disagrees with its cursor.');
    assert(Array.isArray(saved.receipts) && saved.receipts.length <= 64, 'Invalid conversation receipt ledger.');
    const seen = new Set();
    let sequence = -1;
    for(const receipt of saved.receipts) {
        assert(object(receipt) && text(receipt.id, scoped ? 384 : 160) && !seen.has(receipt.id) &&
            text(receipt.responseId, 64) && ['begin','revisit',...INK_RESPONSES,'pause','resume'].includes(receipt.responseId) &&
            text(receipt.commandId, 160) && natural(receipt.sequence) && receipt.sequence > sequence && receipt.sequence <= state.sequence &&
            natural(receipt.at) && receipt.at <= saved.updatedAt, 'Invalid or repeated narrative host receipt.');
        if(scope) assert(object(receipt.scope) && sameScope(receipt.scope, scope) && receipt.sceneId === saved.sceneId,
            'A narrative receipt belongs to another scene, instance or mission binding.');
        seen.add(receipt.id); sequence = receipt.sequence;
    }
    return saved;
}
export function validateInkNarrative(state) {
    const saved = state?.inkNarrative;
    if(saved == null) return null; // Existing saves stay inert and unenrolled.
    assert(object(saved), 'Invalid saved narrative wrapper.');
    if(saved.schema === INK_NARRATIVE_SCHEMA) return validateRecord(saved, state);
    assert(saved.schema === INK_NARRATIVE_SCOPED_SCHEMA, 'Saved conversation needs a supported narrative wrapper schema.');
    assert(Array.isArray(saved.scopes) && saved.scopes.length > 0 && saved.scopes.length <= INK_NARRATIVE_SCOPE_LIMIT &&
        JSON.stringify(saved).length <= 2097152, 'Invalid or oversized scoped narrative wrapper.');
    if(saved.legacy != null) validateRecord(saved.legacy, state);
    const scopeIds = new Set(), sessions = new Set(saved.legacy ? [saved.legacy.sessionId] : []);
    let totalCursorLength = saved.legacy?.cursor.length || 0;
    for(const record of saved.scopes) {
        validateRecord(record, state, true);
        assert(!scopeIds.has(record.scope.id) && !sessions.has(record.sessionId), 'Scoped narrative identities or sessions are duplicated.');
        scopeIds.add(record.scope.id); sessions.add(record.sessionId);
        totalCursorLength += record.cursor.length;
    }
    assert(totalCursorLength <= 1048576, 'The retained narrative cursors exceed their aggregate bound.');
    return saved;
}
function selectedRecord(wrapper, scope) {
    if(!scope) return wrapper?.schema === INK_NARRATIVE_SCOPED_SCHEMA ? wrapper.legacy || null : wrapper;
    if(wrapper?.schema !== INK_NARRATIVE_SCOPED_SCHEMA) return null;
    const record = wrapper.scopes.find(entry => entry.scope.id === scope.id) || null;
    if(record) assert(sameScope(record.scope, scope), 'This narrative scope ID is already bound to another world, instance or mission.');
    return record;
}
// Selection is read-only. A scoped read never adopts or moves a legacy cursor.
export function getInkNarrativeRecord(state, host = null) {
    const scope = scopeOfHost(host), record = selectedRecord(validateInkNarrative(state), scope);
    if(scope && record) assert(identifier(host.sceneId) && sceneOf(record) === host.sceneId,
        'This narrative scope ID is already bound to another authored scene.');
    return record;
}
function writeRecord(plan, originalState, next, scope) {
    const original = originalState.inkNarrative;
    if(!scope && original?.schema !== INK_NARRATIVE_SCOPED_SCHEMA) {
        plan.state.inkNarrative = next;
        return;
    }
    const wrapper = original?.schema === INK_NARRATIVE_SCOPED_SCHEMA ? clone(original)
        : {schema:INK_NARRATIVE_SCOPED_SCHEMA, legacy:original == null ? null : clone(original), scopes:[]};
    if(scope) {
        next.scope = clone(scope);
        const index = wrapper.scopes.findIndex(record => record.scope.id === scope.id);
        if(index < 0) {
            assert(wrapper.scopes.length < INK_NARRATIVE_SCOPE_LIMIT, 'The narrative scope limit is reached; existing interrupted boundaries must be retained.');
            wrapper.scopes.push(next);
        } else wrapper.scopes[index] = next;
    } else wrapper.legacy = next;
    plan.state.inkNarrative = wrapper;
}
function appendReceipt(saved, responseId, binding, state, scope = null) {
    const id = `${scope ? `${scope.id}:` : ''}${saved.sessionId}:${saved.revision}:${responseId}`;
    assert(!saved.receipts.some(receipt => receipt.id === id), 'This narrative response has already settled.');
    saved.receipts.push({id,responseId,commandId:binding.id,sequence:state.sequence,at:state.clock,
        ...(scope ? {scope:clone(scope),sceneId:saved.sceneId} : {})});
    saved.receipts = saved.receipts.slice(-64);
}
function requestCheck(state, request, host) {
    assert(request && request.expectedSequence === state.sequence, 'This conversation response is stale. Refresh its current choices.');
    const scope = scopeOfHost(host), saved = getInkNarrativeRecord(state, host);
    if(scope) assert(request.expectedClock === state.clock && request.scopeId === scope.id && object(request.scopeBinding) &&
        sameScope(request.scopeBinding, scope) && request.sceneId === hostScene(host), 'This response has a stale or different narrative scope, scene or shared clock binding.');
    else {
        assert(request.scopeId == null && request.scopeBinding == null, 'A scoped response cannot use a legacy conversation host.');
        if(request.expectedClock != null) assert(request.expectedClock === state.clock, 'The shared narrative clock changed. Refresh the displayed response.');
        if(request.sceneId != null) assert(request.sceneId === hostScene(host), 'This response was displayed for another scene.');
    }
    if(saved) assert(request.sessionId === saved.sessionId && request.expectedRevision === saved.revision,
        'This response belongs to an earlier conversation boundary.');
    else if(scope) assert(request.sessionId == null && request.expectedRevision == null, 'A new narrative scope cannot reuse another session token.');
    return saved;
}
// Fresh scoped requests also bind expectedClock, sceneId, scopeId/scopeBinding.
// The caller must persist/publish the whole returned plan once, then refresh UI.
export function commitInkNarrativeAction(state, registry, request, context, host) {
    requireHost(host);
    const scope = scopeOfHost(host), saved = requestCheck(state, request, host), id = request.id;
    if(scope && saved) assert(sceneOf(saved) === hostScene(host), 'Use a distinct explicit scope ID for another authored scene.');
    if(['begin','revisit'].includes(id)) {
        assert(!saved || saved.status === 'complete', 'Pause or finish the current conversation before another meeting.');
        assert(id !== 'revisit' || !!saved && sceneOf(saved) === hostScene(host), 'Begin this different local conversation explicitly.');
        assert(supportedScenes(compiled).includes(hostScene(host)), 'This authored scene has no current compiled content binding.');
        const binding = inkBindingFor(host, id);
        const plan = checkedHostPlan(state, registry, binding, context, host);
        const story = newStory(), frame = continueFrame(story, inkObserverVariables(host.observe(plan.state, stagedContext(context, plan))));
        const next = {schema:1, contentId:INK_CONTENT.storyId, contentRevision:INK_CONTENT.storyRevision,
            contentHash:INK_CONTENT.contentHash, runtimeVersion:INK_RUNTIME_VERSION, inkFormat:21, saveFormat:10,
            sceneId:hostScene(host), sessionId:`ink:${plan.state.sequence}`, revision:1, status:frame.choices.length?'active':'complete',
            startedAt:plan.state.clock, updatedAt:plan.state.clock, cursor:story.state.ToJson(), frame,
            receipts:scope ? clone(saved?.receipts || []) : [],
            ...(scope ? {scope:clone(scope)} : {})};
        appendReceipt(next, id, binding, plan.state, scope); writeRecord(plan, state, next, scope);
        validateInkNarrative(plan.state); return plan;
    }
    assert(saved, 'Begin this conversation explicitly first.');
    assert(sceneOf(saved) === hostScene(host), 'Return to the saved conversation before responding.');
    if(id === 'pause' || id === 'resume') {
        assert(id === 'pause' ? saved.status === 'active' : saved.status === 'paused', 'This conversation has no matching interruption to change.');
        requireScopedAcceptance(state, registry, context, host, scope, id === 'pause' ? {id:'ink.cursor.pause',kind:'narrative'} : inkBindingFor(host, 'begin'));
        if(id === 'resume') {
            const binding = inkBindingFor(host, 'begin'), quote = host.preview(state, registry, binding, context);
            assert(quote?.visible && quote.eligible, quote?.reasons?.join(' ') || 'Return to the actual participant before resuming.');
        }
        const plan = cursorOnly(state, context), next = clone(saved);
        next.status = id === 'pause' ? 'paused' : 'active'; next.revision++; next.updatedAt = plan.state.clock;
        appendReceipt(next, id, {id:`ink.cursor.${id}`}, plan.state, scope);
        writeRecord(plan, state, next, scope);
        validateInkNarrative(plan.state); return plan;
    }
    assert(saved.status === 'active', 'Resume this conversation before choosing a response.');
    const story = newStory(saved.cursor, artifactFor(saved)), current = story.currentChoices;
    const index = current.findIndex(choice => responseId(choice) === id);
    assert(index >= 0, 'This stable response is not offered at the current Ink boundary.');
    const binding = inkBindingFor(host, id);
    const plan = checkedHostPlan(state, registry, binding, context, host);
    story.ChooseChoiceIndex(index);
    const frame = continueFrame(story, inkObserverVariables(host.observe(plan.state, stagedContext(context, plan))));
    const next = clone(saved);
    next.revision++; next.updatedAt = plan.state.clock; next.cursor = story.state.ToJson(); next.frame = frame;
    next.status = frame.choices.length ? 'active' : 'complete';
    appendReceipt(next, id, binding, plan.state, scope);
    writeRecord(plan, state, next, scope);
    validateInkNarrative(plan.state); return plan;
}
export function inkNarrativeRequest(state, id, host = null) {
    const scope = scopeOfHost(host), saved = getInkNarrativeRecord(state, host);
    return {id, expectedSequence:state.sequence, expectedClock:state.clock,
        ...(host ? {sceneId:hostScene(host)} : {}),
        ...(scope ? {scopeId:scope.id,scopeBinding:clone(scope)} : {}),
        ...(saved?{sessionId:saved.sessionId,expectedRevision:saved.revision}:{})};
}
export function previewInkNarrativeAction(state, registry, id, context, host) {
    try {
        requireHost(host);
        const scope = scopeOfHost(host), saved = getInkNarrativeRecord(state, host);
        if(saved && sceneOf(saved) !== hostScene(host) && (scope || id !== 'begin')) return {visible:false,eligible:false,reasons:['The saved conversation belongs to another actual participant or explicit scope.']};
        if(id === 'pause') {
            if(saved?.status !== 'active') return {visible:false,eligible:false,reasons:[]};
            return scopedHostQuote(state, registry, context, host, scope, {id:'ink.cursor.pause',kind:'narrative'}) || {visible:true,eligible:true,reasons:[]};
        }
        if(id === 'resume' && saved?.status !== 'paused') return {visible:false,eligible:false,reasons:[]};
        if(['begin','revisit'].includes(id) && saved && saved.status !== 'complete') return {visible:false,eligible:false,reasons:[]};
        if(id === 'revisit' && !saved) return {visible:false,eligible:false,reasons:[]};
        if(['begin','revisit'].includes(id)) {
            assert(supportedScenes(compiled).includes(hostScene(host)), 'This authored scene has no current compiled content binding.');
            if(scope && !saved) assert(state.inkNarrative?.schema !== INK_NARRATIVE_SCOPED_SCHEMA || state.inkNarrative.scopes.length < INK_NARRATIVE_SCOPE_LIMIT,
                'The narrative scope limit is reached; existing interrupted boundaries must be retained.');
        }
        if(!['begin','revisit','resume'].includes(id)) {
            if(saved?.status !== 'active' || !saved.frame.choices.some(choice=>choice.id===id)) return {visible:false,eligible:false,reasons:[]};
        }
        const binding = inkBindingFor(host,id==='resume'?'begin':id);
        const scoped = scopedHostQuote(state, registry, context, host, scope, binding);
        if(scoped && (!scoped.visible || !scoped.eligible)) return scoped;
        return host.preview(state, registry, binding, context);
    } catch(error) {return {visible:true,eligible:false,reasons:[error.message]};}
}
export function inkNarrativeView(state, registry, context, host) {
    let saved;
    try {requireHost(host); saved = getInkNarrativeRecord(state, host);}
    catch(error) {return {visible:true,title:'A remembered conversation',status:'incompatible',paragraphs:[],choices:[],actions:[],recoveryText:error.message};}
    const sameScene = !saved || sceneOf(saved) === hostScene(host);
    const startId = saved && sameScene ? 'revisit' : 'begin';
    const begin = previewInkNarrativeAction(state,registry,startId,context,host);
    const actions = [];
    if(!saved || saved.status === 'complete') actions.push({...begin,id:startId,label:saved&&sameScene?'Meet again':'Discuss the offered work'});
    if(!sameScene && saved.status !== 'complete') return {visible:begin.visible,title:host.title||'A local conversation',status:'paused',paragraphs:[],choices:[],actions:[],
        token:inkNarrativeRequest(state,'view',host),recoveryText:'Finish or resume your saved conversation with its actual participant before starting a different one.'};
    if(saved?.status === 'active') actions.push({...previewInkNarrativeAction(state,registry,'pause',context,host),id:'pause',label:'Interrupt this conversation'});
    if(saved?.status === 'paused') actions.push({...previewInkNarrativeAction(state,registry,'resume',context,host),id:'resume',label:'Resume at the saved response'});
    const choices = saved?.status === 'active' ? saved.frame.choices.map(choice=>({...previewInkNarrativeAction(state,registry,choice.id,context,host),...choice})) : [];
    return {visible:!!saved||begin.visible,title:host.title||'At the pump bench',status:sameScene?saved?.status||'inactive':'inactive',paragraphs:sameScene?saved?.frame.paragraphs||[]:[],
        token:inkNarrativeRequest(state,'view',host),choices:choices.filter(choice=>choice.visible!==false),actions:actions.filter(action=>action.visible!==false),
        recoveryText:saved?.status==='paused'?'Your exact response boundary is saved. Return to the participant to resume.':undefined};
}
