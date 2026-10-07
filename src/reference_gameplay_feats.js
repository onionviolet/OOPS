import {remainderCombatObjectivesFeatDefinitions} from './audit_remainder_combat_objectives_content.js';
// Persistent, character-local recognition for the reference gameplay wave.
// This module only advances over a parent-published staged result; it owns no
// command, reward, save boundary, or UI side effect.

import {fieldcraftFeatDefinitions,fieldcraftFeatEvidence,visibleFieldcraftFeats} from './nethack_fieldcraft_feats.js';

const SCHEMA = 1;
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const natural = value => Number.isSafeInteger(value) && value >= 0;
const validId = value => typeof value === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(value) &&
    !['__proto__', 'constructor', 'prototype'].includes(value);
const assert = (condition, message) => { if(!condition) throw new Error(message); };

const BASIC_FEATS = Object.freeze([
    {id:'repair_the_sluice', label:'Make a repair that lasts', description:'Install a real brace or matched seal at the leaking Village joint.', commands:['feature_objects.install_brace','feature_objects.install_seal']},
    {id:'learn_a_working_method', label:'Learn a working method', description:'Complete Eda’s supervised Grain matching lesson.', commands:['feature_objects.learn']},
    {id:'set_repair_resin', label:'Make useful material from a charge', description:'Use an actual charged cooling sleeve and sap to produce set repair resin.', commands:['reference_gameplay.set_resin']},
    {id:'funded_service', label:'Finish funded local work', description:'Deliver actual survey kits to Eda’s finite paid order.', commands:['feature_objects.deliver_kits']},
    {id:'take_the_long_way', label:'Find another way through', description:'Complete the sluice drainage route without starting combat.', commands:['feature_battle.bypass']},
    {id:'return_with_your_account', label:'Return from a personal visit', description:'Complete an actual return from a retained destination.', commands:['nested.personal.return']},
]);

const EXCEPTIONAL = Object.freeze([
    {id:'quiet_passage', label:'Pass the sluice without a strike', description:'Complete the deliberately enrolled no-strike passage.', kind:'conduct'},
    {id:'prepared_passage', label:'Pass with real preparation', description:'Complete the prepared passage using the admitted method, charged tool, body, and willing support.', kind:'prepared'},
]);

const allFeats = new Set([...BASIC_FEATS, ...EXCEPTIONAL].map(feat => feat.id).concat([
    'three_methods','adaptable_at_the_gate','win_the_claim','cooling_function_ready',
],fieldcraftFeatDefinitions.map(row=>row.id),remainderCombatObjectivesFeatDefinitions.map(row=>row.id)));
const APPROACH_TYPES = new Set(['guard','interpose','redirect','lash','track','read','wedge','signal','objective','escape','strike']);
const emptyProgress = () => ({schema:SCHEMA, earned:[], methods:[], approaches:[], battleCursor:null});

export function createReferenceFeats() {
    return emptyProgress();
}

function validEvidence(evidence) {
    return object(evidence) && typeof evidence.kind === 'string' && evidence.kind.length <= 32 &&
        Array.isArray(evidence.ids) && evidence.ids.length > 0 && evidence.ids.length <= 24 &&
        evidence.ids.every(id => typeof id === 'string' && id.length > 0 && id.length <= 160);
}

export function validateReferenceFeats(value, state, registry) {
    assert(object(value) && Object.keys(value).every(key => ['schema','earned','methods','approaches','battleCursor'].includes(key)) &&
        value.schema === SCHEMA && Array.isArray(value.earned) && value.earned.length <= 64 &&
        Array.isArray(value.methods) && Array.isArray(value.approaches) && (value.battleCursor === null || object(value.battleCursor)),
    'Invalid saved reference feats.');
    const earnedIds = new Set();
    for(const receipt of value.earned) {
        assert(object(receipt) && Object.keys(receipt).every(key => ['id','sequence','at','provenance'].includes(key)) &&
            allFeats.has(receipt.id) && !earnedIds.has(receipt.id) && natural(receipt.sequence) && receipt.sequence > 0 &&
            natural(receipt.at) && (!state || receipt.sequence <= state.sequence && receipt.at <= state.clock) && validEvidence(receipt.provenance) &&
            ['committed-completion','explicit-basic-reconciliation','committed-native-battle-outcome','root-conduct-receipt',
                'verified-prepared-admission','committed-method-set','native-action-set'].includes(receipt.provenance.kind) &&
            Object.keys(receipt.provenance).every(key => ['kind','ids'].includes(key)),
        'Invalid saved feat receipt.');
        earnedIds.add(receipt.id);
    }
    assert(value.methods.length <= 64 && value.methods.every(id => typeof id === 'string' && id.length <= 192 &&
        (id.split('|').length === 2 && validId(id.split('|')[0]) && validId(id.split('|')[1]) || /^sluice-action:[a-z0-9_]+$/i.test(id))) &&
        new Set(value.methods).size === value.methods.length, 'Invalid earned method set.');
    assert(value.approaches.length <= 16 && value.approaches.every(row => object(row) &&
        Object.keys(row).every(key=>['type','sequence','receiptId'].includes(key)) &&
        /^[a-z][a-z0-9_]*$/i.test(row.type) && natural(row.sequence) && row.sequence > 0 &&
        (!state || row.sequence <= state.sequence) && typeof row.receiptId === 'string' && row.receiptId.length > 0 && row.receiptId.length <= 160) &&
        new Set(value.approaches.map(row=>row.type)).size === value.approaches.length, 'Invalid earned approach receipts.');
    if(value.battleCursor !== null) assert(Object.keys(value.battleCursor).every(key=>['sessionId','action'].includes(key)) &&
        /^simulation:[1-9][0-9]*$/.test(value.battleCursor.sessionId) && natural(value.battleCursor.action) && value.battleCursor.action > 0 &&
        (!state || Number(value.battleCursor.sessionId.slice('simulation:'.length)) <= state.sequence && value.battleCursor.action <= state.sequence),
    'Invalid reference battle receipt cursor.');
    if(value.battleCursor && state) {
        const active=state.simulation?.sessions?.player;
        const activeMatch=active?.definitionId==='feature_battle.sluice' && active?.id===value.battleCursor.sessionId &&
            active.nativeBattle?.actions>=value.battleCursor.action;
        const facts=state.actors?.player?.facts||{};
        const settledMatch=facts['feature.battle.lastReceipt']===value.battleCursor.sessionId &&
            natural(facts['feature.battle.lastActions']) && facts['feature.battle.lastActions']>=value.battleCursor.action;
        assert(activeMatch||settledMatch,'Reference battle cursor has no retained native receipt.');
    }
    if(state?.referenceGameplay?.feats === value) {
        assert(state.referenceGameplay.schema === 1, 'Reference feats require gameplay schema 1.');
    }
    // Registry is intentionally read-only. It lets the shared validator reject
    // forged training receipts without requiring every registry in old saves.
    if(registry?.simulation?.commands) for(const id of value.methods) {
        const separator = id.indexOf('|');
        if(separator > 0) {
            const commandId=id.slice(separator+1), command=registry.simulation.commands.get(commandId);
            assert(command && command.powerId === id.slice(0,separator), 'Unsupported earned method receipt.');
        }
    }
    return true;
}

function completedCount(state, commandId) {
    const n = state?.actors?.player?.completed?.[commandId];
    return natural(n) ? n : 0;
}

function newCompleted(before, out) {
    const prior = before?.actors?.player?.completed || {};
    const current = out?.actors?.player?.completed || {};
    return Object.keys(current).filter(id => validId(id) && natural(current[id]) && current[id] > (natural(prior[id]) ? prior[id] : 0));
}

function factCompleted(state, key) {
    const value = state?.actors?.player?.facts?.[key];
    return value === true || natural(value) && value > 0;
}

function receiptIds(state, commandIds) {
    const actor = state?.actors?.player;
    return commandIds.filter(id => completedCount(state, id) > 0 && actor?.completed?.[id] > 0)
        .map(id => `completion:${id}:${actor.completed[id]}`);
}

function earn(feats, id, sequence, at, kind, ids) {
    if(feats.earned.some(receipt => receipt.id === id)) return;
    feats.earned.push({id, sequence, at, provenance:{kind, ids:[...new Set(ids)].slice(0,24)}});
}

function learnMethods(feats, out, registry, deltas) {
    const methods = new Set(feats.methods);
    for(const commandId of deltas) {
        const command = registry?.simulation?.commands?.get(commandId);
        if(!command?.powerId) continue;
        // A method only joins the set after a committed native training command.
        if(!commandId.startsWith('feature_powers.') && !commandId.startsWith('reference_gameplay.')) continue;
        methods.add(`${command.powerId}|${commandId}`);
    }
    feats.methods = [...methods].sort();
}

function observeBattleActions(feats, before, out, stagedOut) {
    const current = out?.simulation?.sessions?.player;
    const session = current?.definitionId==='feature_battle.sluice' && current?.nativeBattle ? current : null;
    const actionReceipt = stagedOut?.featureBattleReceipt || out?.featureBattleReceipt || stagedOut?.referenceBattleAction || out?.referenceBattleAction;
    if(!session && !actionReceipt) return;
    const battle = session?.nativeBattle;
    const sessionId = session?.id || actionReceipt?.sessionId;
    const start = feats.battleCursor?.sessionId === sessionId ? feats.battleCursor.action : 0;
    const actions = (battle?.receipts || []).filter(receipt => receipt.action > start && ['player','partyPartner'].includes(receipt.actorId));
    if(actionReceipt?.sessionId === sessionId && ['player','partyPartner'].includes(actionReceipt.actorId) &&
        APPROACH_TYPES.has(actionReceipt.type) && actionReceipt.action > start &&
        !actions.some(receipt => receipt.action === actionReceipt.action)) actions.push(actionReceipt);
    // Preserve only distinct actual action types and advance over committed
    // non-strike/strike outcomes; the parent calls us once per staged commit.
    const methods = new Set(feats.methods);
    for(const action of actions) {
        if(!['player','partyPartner'].includes(action.actorId) || !APPROACH_TYPES.has(action.type)) continue;
        methods.add(`sluice-action:${action.type}`);
        if(!feats.approaches.some(receipt=>receipt.type===action.type)) {
            const outcome=Array.isArray(action.outcomes)?action.outcomes.map(o=>`${o.targetId}:${o.kind}:${o.defended?'defended':'open'}`).join(','):'none';
            const nonce=action.nonce?`${action.nonce.sequence}:${action.nonce.action}:${action.nonce.seed}`:`${action.sequence||out.sequence}`;
            feats.approaches.push({type:action.type,sequence:action.sequence||action.nonce?.sequence+1||out.sequence,
                receiptId:`${sessionId}:${action.action}:${action.type}:${nonce}:${outcome}`.slice(0,160)});
        }
    }
    feats.approaches=feats.approaches.slice(0,16);
    feats.methods = [...methods].sort();
    const latestAction = Math.max(battle?.actions || 0, actionReceipt?.sessionId === sessionId ? actionReceipt.action : 0);
    if(latestAction > start) feats.battleCursor = {sessionId, action:latestAction};
    if(feats.approaches.length >= 3 && actions.length) {
        earn(feats, 'adaptable_at_the_gate', out.sequence, out.clock, 'native-action-set', feats.approaches.slice(0,3).map(a => a.receiptId));
    }
}

function preparedEvidence(before, out, stagedOut, context) {
    const state = out;
    const preparedRoot = state?.referenceGameplay?.prepared;
    const successfulBattle = completedCount(out, 'feature_battle.start') > completedCount(before, 'feature_battle.start') &&
        ['won','objective'].includes(state?.actors?.player?.facts?.['feature.battle.lastResult']);
    if(!factCompleted(state, 'reference.prepared.completed') || !successfulBattle || !object(preparedRoot)) return null;
    const priorIds = new Set((before?.referenceGameplay?.prepared?.history || []).map(entry => entry.id));
    const completed = (preparedRoot.history || []).find(entry => entry.status === 'completed' &&
        ['won','objective'].includes(entry.result) && !priorIds.has(entry.id) && entry.endedSequence === state.sequence);
    if(!completed) return null;
    const admission = completed.admission;
    if(!object(admission)) return null;
    const sourceId = admission.coolingSourceId;
    const source = state.actors?.player?.sources?.[sourceId];
    const power = state.simulation?.powers?.player?.[sourceId];
    const faculty = state.simulation?.faculties?.player?.[sourceId];
    const actualSource = source && source.origin === 'trained' && (source.expiresAt == null || source.expiresAt > state.clock) &&
        source.acquiredAt === admission.sourceAcquiredAt && power?.owned === true && power.mastery === admission.mastery &&
        power.mastery >= 3 && faculty?.active === true && faculty.awakened === true && faculty.suppressed !== true;
    const actorId = admission.helperId;
    const body = state.simulation?.people?.[actorId]?.body;
    const harness = admission.helperEquipmentKey;
    const equipmentOk = typeof harness === 'string' && state.simulation?.equipment?.[actorId]?.field_frame === harness &&
        (state.simulation?.owners?.[actorId]?.[harness] || 0) > 0 &&
        !Object.values(state.simulation?.custody || {}).some(item => item.holder === actorId && item.key === harness);
    const emptySleeve = JSON.stringify({id:'Empty cooling sleeve'});
    const nativeInventory = stagedOut?.gameplay?.player?.inventory || context?.gameplay?.player?.inventory || {};
    const inventoryOk = (nativeInventory?.[emptySleeve] || 0) > 0 &&
        !Object.values(state.simulation?.custody || {}).some(item => item.holder === 'player' && item.key === emptySleeve);
    const causeMatch = /^simulation:([1-9][0-9]*)$/.exec(admission.conditionCause || '');
    const condition = state.simulation?.conditions?.featureBattleHook?.[admission.conditionId];
    const conditionStillDue = state.clock < admission.conditionExpiresAt;
    const qualifiedAdmission = admission.coolingSourceId === 'reference_gameplay.cooling' && admission.mastery >= 3 &&
        admission.conditionId === 'reference_gameplay.hook_cooled' && admission.conditionExpiresAt > admission.at &&
        causeMatch && Number(causeMatch[1]) <= admission.sequence && admission.sequence <= completed.endedSequence &&
        admission.helperSupported === true && (!conditionStillDue || condition?.cause === admission.conditionCause &&
            condition.expiresAt === admission.conditionExpiresAt && condition.intensity > 0);
    if(!actualSource || !body || !equipmentOk || !inventoryOk || !qualifiedAdmission) return null;
    return [String(completed.id), String(completed.sessionId), String(admission.sequence), String(sourceId), harness, emptySleeve];
}

export function advanceReferenceFeats(before, stagedOut, registry, context, {reconcile=false}={}) {
    // The native host may pass its staged transaction envelope; direct callers
    // may pass the staged expansion state itself.
    const out = stagedOut?.state || stagedOut;
    assert(object(before) && object(out) && natural(before.sequence) && natural(out.sequence) && out.sequence > before.sequence,
        'Feat recognition requires a newly committed result.');
    assert(out.referenceGameplay?.schema === 1 && object(out.referenceGameplay.feats),
        'Reference feats are not enrolled in this staged result.');
    const feats = out.referenceGameplay.feats;
    validateReferenceFeats(feats, out, registry);
    const deltas = newCompleted(before, out);
    const playerFacts = out.actors?.player?.facts || {};
    const beforeFacts = before.actors?.player?.facts || {};
    const earnedBefore = new Set(feats.earned.map(receipt => receipt.id));
    const oldMethods = [...feats.methods];
    const oldCursor = feats.battleCursor ? {...feats.battleCursor} : null;

    learnMethods(feats, out, registry, deltas);
    observeBattleActions(feats, before, out, stagedOut);
    for(const receipt of fieldcraftFeatEvidence(before,stagedOut,context))
        earn(feats,receipt.id,out.sequence,out.clock,'committed-completion',receipt.ids);

    for(const feat of BASIC_FEATS) {
        const evidence = feat.commands.filter(id => deltas.includes(id));
        let nestedReturnEvidence = null;
        if(feat.id === 'return_with_your_account') {
            const receipt=(out.nestedCampaign?.receipts||[]).find(row=>row.id==='nested.personal.return'&&row.sequence===out.sequence&&
                !(before.nestedCampaign?.receipts||[]).some(old=>old.id===row.id&&old.sequence===row.sequence));
            const from=before.actors?.player?.worldId, to=out.actors?.player?.worldId;
            const accountWasOpen=before.actors?.player?.facts?.['nested.personal.active']===true&&out.actors?.player?.facts?.['nested.personal.active']===false;
            const recordId=`nested.personal.${from}.return`;
            const afterKnowledge=out.simulation?.knowledge?.player?.[recordId], beforeKnowledge=before.simulation?.knowledge?.player?.[recordId];
            const newKnowledge=afterKnowledge&&afterKnowledge.value&&(!beforeKnowledge||beforeKnowledge.at!==afterKnowledge.at||beforeKnowledge.cause!==afterKnowledge.cause);
            if(receipt&&['nested.saltworks','nested.archive'].includes(from)&&to==='nested.paradise_hub'&&accountWasOpen&&newKnowledge)
                nestedReturnEvidence=`${receipt.id}:${receipt.sequence}:${from}:${to}:${afterKnowledge.cause}`;
        }
        let resinEvidence = null;
        if(feat.id==='set_repair_resin'&&evidence.includes('reference_gameplay.set_resin')) {
            const resin=JSON.stringify({id:'Set repair resin'});
            const after=stagedOut?.gameplay?.player?.inventory?.[resin]||0;
            const prior=stagedOut?.gameplayBefore?.player?.inventory?.[resin]??context?.gameplay?.player?.inventory?.[resin]??0;
            if(after>prior) resinEvidence=`reference_gameplay.set_resin:${out.sequence}:${prior}->${after}`;
        }
        const qualifyingEvidence=feat.id==='return_with_your_account'?!!nestedReturnEvidence:
            feat.id==='set_repair_resin'?!!resinEvidence:evidence.length>0;
        if(qualifyingEvidence) {
            const ids=evidence.map(id => `completion:${id}:${completedCount(out,id)}`);
            if(nestedReturnEvidence) ids.push(nestedReturnEvidence);
            if(resinEvidence) ids.push(resinEvidence);
            earn(feats, feat.id, out.sequence, out.clock, 'committed-completion', ids);
        }
        else if(reconcile && feat.commands.some(id => completedCount(out,id) > 0)) {
            const actual = receiptIds(out, feat.commands);
            if(actual.length) earn(feats, feat.id, out.sequence, out.clock, 'explicit-basic-reconciliation', actual);
        }
    }

    const battleStarted = deltas.includes('feature_battle.start');
    const result = playerFacts['feature.battle.lastResult'];
    const resultReceipt = playerFacts['feature.battle.lastReceipt'];
    const oldReceipt = beforeFacts['feature.battle.lastReceipt'];
    if(battleStarted && ['won','objective'].includes(result) && typeof resultReceipt === 'string' && resultReceipt && resultReceipt !== oldReceipt) {
        earn(feats, 'win_the_claim', out.sequence, out.clock, 'committed-native-battle-outcome', [resultReceipt, `outcome:${result}`]);
    }

    const coolingId='reference_gameplay.cooling', coolingBefore=before.simulation?.powers?.player?.[coolingId], coolingAfter=out.simulation?.powers?.player?.[coolingId];
    const coolingSource=out.actors?.player?.sources?.[coolingId], coolingFaculty=out.simulation?.faculties?.player?.[coolingId];
    if(deltas.includes('reference_gameplay.practice') && (coolingBefore?.mastery||0)<3 && coolingAfter?.owned===true && coolingAfter.mastery>=3 &&
        coolingSource?.origin==='trained' && (coolingSource.expiresAt==null||coolingSource.expiresAt>out.clock) &&
        coolingFaculty?.active===true && coolingFaculty.awakened===true && coolingFaculty.suppressed!==true)
        earn(feats,'cooling_function_ready',out.sequence,out.clock,'committed-completion',[
            `completion:reference_gameplay.practice:${completedCount(out,'reference_gameplay.practice')}`,
            `method:${coolingId}:${coolingAfter.mastery}`]);

    const conduct = factCompleted(out, 'reference.conduct.completed');
    if(conduct && !factCompleted(before, 'reference.conduct.completed')) {
        const oldIds = new Set((before.referenceGameplay?.conduct?.history || []).map(entry=>entry.id));
        const completed = (out.referenceGameplay?.conduct?.history || []).find(entry=>entry.status==='completed' &&
            !entry.violation && ['won','objective','bypassed'].includes(entry.result) && !oldIds.has(entry.id) && entry.endedSequence===out.sequence);
        if(completed) earn(feats, 'quiet_passage', out.sequence, out.clock, 'root-conduct-receipt', [completed.id, completed.sessionId || 'bypassed', `result:${completed.result}`]);
    }

    const prepared = preparedEvidence(before, out, stagedOut, context);
    if(prepared) earn(feats, 'prepared_passage', out.sequence, out.clock, 'verified-prepared-admission', prepared);

    // The three-method set uses distinct learned power IDs; action receipts are
    // tracked separately under adaptable_at_the_gate.
    const learnedPowerIds = new Set(feats.methods.filter(value => value.includes('|')).map(value => value.slice(0, value.indexOf('|'))));
    if(learnedPowerIds.size >= 3) earn(feats, 'three_methods', out.sequence, out.clock, 'committed-method-set', [...learnedPowerIds].slice(0,3));

    validateReferenceFeats(feats, out, registry);
    return {earned:feats.earned.filter(receipt => !earnedBefore.has(receipt.id)),
        changed:deltas.length > 0 || feats.earned.length !== earnedBefore.size ||
            JSON.stringify(oldMethods) !== JSON.stringify(feats.methods) || JSON.stringify(oldCursor) !== JSON.stringify(feats.battleCursor)};
}

function countText(state, feat) {
    const receipt = state.referenceGameplay?.feats?.earned?.find(row => row.id === feat.id);
    if(receipt) {
        const basis=receipt.provenance.kind==='explicit-basic-reconciliation'?'reconciled from an earlier basic completion':
            receipt.provenance.kind==='committed-native-battle-outcome'?'recorded from a completed native encounter':
            receipt.provenance.kind==='root-conduct-receipt'?'recorded from the completed conduct attempt':
            receipt.provenance.kind==='verified-prepared-admission'?'recorded from the qualified preparation and encounter':
            receipt.provenance.kind==='committed-method-set'?'recorded from distinct trained methods':
            receipt.provenance.kind==='native-action-set'?'recorded from distinct native actions':'recorded from committed work';
        return `Earned at played minute ${receipt.at} · ${basis}`;
    }
    const count = feat.commands.reduce((sum,id) => sum + completedCount(state,id), 0);
    return count > 0 ? 'Completed, awaiting recognition' : 'Not yet earned';
}

export function referenceFeatsPresentation(state, registry, context={}) {
    const feats = state?.referenceGameplay?.feats;
    if(!feats) return {visible:false, sections:[]};
    const earned = new Set(feats.earned.map(receipt => receipt.id));
    const facts = state.actors?.player?.facts || {};
    const knowsPersonalReturn = !!state.nestedCampaign && (facts['nested.personal.active'] === true ||
        Object.keys(state.simulation?.knowledge?.player||{}).some(key=>/^nested\.personal\.(nested\.saltworks|nested\.archive)\.return$/.test(key)));
    const basic = BASIC_FEATS.filter(feat => {
        if(['repair_the_sluice','learn_a_working_method','funded_service'].includes(feat.id)) return facts['feature_objects.introduced'] === true;
        if(['take_the_long_way','win_the_claim'].includes(feat.id)) return facts['feature.battle.seen'] === true;
        if(feat.id === 'set_repair_resin') return !!state.referenceGameplay?.workshop;
        if(feat.id === 'return_with_your_account') return knowsPersonalReturn;
        return true;
    }).map(feat => ({id:feat.id,text:`${feat.label} · ${countText(state,feat)}. ${feat.description}`}));
    const conductEntries = [...(state.referenceGameplay?.conduct?.history||[]),...(state.referenceGameplay?.conduct?.current?[state.referenceGameplay.conduct.current]:[])];
    const preparedEntries = [...(state.referenceGameplay?.prepared?.history||[]),...(state.referenceGameplay?.prepared?.current?[state.referenceGameplay.prepared.current]:[])];
    const conductKnown = conductEntries.length > 0;
    const preparedKnown = preparedEntries.length > 0;
    const exceptional = EXCEPTIONAL.filter(feat => feat.kind === 'conduct' ? conductKnown : preparedKnown)
        .map(feat => ({id:feat.id,text:`${feat.label} · ${earned.has(feat.id)?countText(state,feat):'In progress'}. ${feat.description}`}));
    const earnedStatus=id=>countText(state,{id,commands:[]});
    const setRows = [
        {id:'three_methods',text:`Three distinct trained methods · ${earned.has('three_methods')?earnedStatus('three_methods'):`${new Set(feats.methods.filter(value=>value.includes('|')).map(value=>value.slice(0,value.indexOf('|')))).size}/3`}.`},
        ...(state.referenceGameplay?.workshop ? [{id:'cooling_function_ready',text:`Master the useful cooling function · ${earned.has('cooling_function_ready')?earnedStatus('cooling_function_ready'):`${Math.min(3,state.simulation?.powers?.player?.['reference_gameplay.cooling']?.mastery||0)}/3`}. Reach mastery three through Eda’s actual supervised trials.`}] : []),
        ...(facts['feature.battle.seen']===true ? [
            {id:'adaptable_at_the_gate',text:`Three distinct committed approaches · ${earned.has('adaptable_at_the_gate')?earnedStatus('adaptable_at_the_gate'):`${feats.approaches.length}/3`}.`},
            {id:'win_the_claim',text:`Win the sluice encounter · ${earned.has('win_the_claim')?earnedStatus('win_the_claim'):'Not yet earned'}. Complete a native encounter with an actual won or objective result.`},
        ] : []),
    ];
    const sections = [{id:'reference-feats',label:'Field feats',description:'Recognition for work completed in this character’s own recorded history.',records:basic},
        {id:'reference-feat-sets',label:'Mastery and combinations',description:'Distinct trained methods and actual committed approaches accumulate across this character’s career.',records:setRows}];
    const fieldcraft=visibleFieldcraftFeats(state);
    if(fieldcraft.length)sections.push({id:'reference-fieldcraft-feats',label:'Fieldcraft discoveries',description:'Useful discoveries and help recorded from completed work.',
        records:fieldcraft.map(row=>({id:row.id,text:`${row.label} · ${earned.has(row.id)?countText(state,{id:row.id,commands:[]}):'Not yet earned'}. ${row.description}`}))});
    if(exceptional.length) sections.push({id:'reference-feat-challenges',label:'Known optional accomplishments',description:'Optional accomplishments with their own recorded attempt boundary.',records:exceptional});
    return {visible:true,sections};
}
