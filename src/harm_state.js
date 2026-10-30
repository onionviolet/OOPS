import {registerDomain} from './domain_registry.js';

export const HARM_RUNGS = Object.freeze(['shaken','bruised','wounded','maimed','dying']);
const ACTION_CLASSES = ['appraise','care','craft','explore','fight','other','practice','research','rest','ritual','socialize','study','trade','travel','work'];
export const HARM_DEATH_CAUSES = Object.freeze(['age','illness','mishap','combat','harm','loss_of_control']);
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v) &&
    [Object.prototype,null].includes(Object.getPrototypeOf(v));
const safeId = v => typeof v === 'string' && /^[a-zA-Z0-9_.:-]{1,80}$/.test(v) &&
    !['__proto__','constructor','prototype'].includes(v);
const check = (ok, message) => { if (!ok) throw Error(message); };
function freeze(value) {
    for (const child of Object.values(value)) if (child && typeof child === 'object') freeze(child);
    return Object.freeze(value);
}
// Proposed organic-function defaults; worlds can replace axes, thresholds and recovery.
const partDefaults = () => Object.fromEntries([
    ['hands','Hands',['accuracy','force','fineWork'],['craft','fight']],
    ['legs','Legs',['speed','evasion'],['travel','fight']],
    ['eyes','Eyes',['precision','perception','accuracy'],['study','research','fight']],
    ['voice','Voice',['clarity'],['socialize','ritual']]
].map(([id,label,axes,classes]) => [id,{
    label,
    reason:'Proposed body dial: impairment multipliers 0.9/0.75/0.5/0.2/0.1 represent declining control, not absent effort; maimed function stops the listed ordinary methods. Worlds and alternate methods can replace this threshold.',
    axes:Object.fromEntries(HARM_RUNGS.map((rung,i)=>[rung,axes.map(axis=>({axis,mult:[0.9,0.75,0.5,0.2,0.1][i],
        reason:'Proposed control multiplier; remaining function still contributes below the blocking threshold.'}))])),
    blocksAt:{rung:'maimed',classes,reason:'Ordinary methods need this function intact enough to act; alternate methods may use different world rows.'},
    healPerHour:0.25,treatedPerHour:1,trainedScale:1.5,
    recoveryReason:'Proposed recovery dial: 0.25 rung per rest hour, 1 with treatment, multiplied by 1.5 with adaptation training; care repairs function while training helps compensate.'
}]));
export const HARM_WORLDS = freeze({
    'book.lotm.tingen': {
        world:'book.lotm.tingen',parts:partDefaults(),
        reason:'Proposed first-slice defaults: thresholds 3/6/9 and rise scale 1 model accumulating power strain; floor 0 and recovery 0.25/1 per hour allow slow rest and stronger treatment. These are world and rank dials, pending play.',
        carriers:{power:{label:'Power strain',stages:[
            {id:'steady',label:'Steady',at:0,blocks:[]},
            {id:'strained',label:'Strained',at:3,blocks:[],warn:'Your power feels strained.',
                modifiers:[{axis:'precision',mult:0.9,reason:'Proposed dial: divided attention mildly reduces precision while strained.'}]},
            {id:'slipping',label:'Slipping',at:6,blocks:['ritual','research'],
                modifiers:[{axis:'precision',mult:0.75,reason:'Proposed dial: unstable control reduces precision before it stops other activity.'}]},
            {id:'lost',label:'Lost control',at:9,blocks:ACTION_CLASSES.filter(id=>!['rest','care','travel'].includes(id))}
        ],floor:0,restPerHour:0.25,treatedPerHour:1,riseScale:1}},
        death:{default:'final',alternatives:[{kind:'rescued',requires:['harm.rescuer.present'],cost:'a debt the rescuer names'}]}
    },
    'base.frontier': {
        world:'base.frontier',
        reason:'Proposed first-slice defaults: no backlash carrier; age and illness can end a life, while native defeat leaves it unconscious (AD19). Cause outcomes are a world dial.',
        carriers:{},death:{default:'unconscious',byCause:{age:'final',illness:'final'},alternatives:[]}
    },
    default: {
        world:'default',parts:partDefaults(),reason:'Proposed first-slice defaults for an unbound world: no backlash carrier and final death; a world row can supply its own means and costs.',
        carriers:{},death:{default:'final',alternatives:[]}
    }
});

// Equal fifths are adapter defaults, tunable independently of a world's backlash stages.
export function harmRung(fraction) {
    check(Number.isFinite(fraction) && fraction >= 0 && fraction <= 1, 'Invalid health fraction.');
    return fraction === 1 ? null : HARM_RUNGS[Math.min(4,Math.floor((1-fraction)*5))];
}
export function rungHealth(id) {
    if (id === null) return 1;
    const index = HARM_RUNGS.indexOf(id);
    check(index >= 0, 'Unknown harm rung.');
    return 0.9-index*0.2;
}

const fresh = () => ({schema:1,backlash:{}});
// Save-size/integrity budgets, not limits on in-world means.
const MAX_CARRIERS = 32, MAX_COUNT = 1_000_000;
export function validateHarm(slice) {
    if (slice == null) return slice;
    check(object(slice) && ['backlash,schema','backlash,parts,schema'].includes(Object.keys(slice).sort().join(',')) && slice.schema === 1 &&
        object(slice.backlash) && Object.keys(slice.backlash).length <= MAX_CARRIERS, 'Invalid harm slice.');
    for (const [id,count] of Object.entries(slice.backlash))
        check(safeId(id) && Number.isFinite(count) && count >= 0 && count <= MAX_COUNT, 'Invalid backlash counter.');
    if (Object.hasOwn(slice,'parts')) {
        check(object(slice.parts) && Object.keys(slice.parts).length <= 64, 'Invalid harm parts.');
        for (const [id,part] of Object.entries(slice.parts)) {
            check(safeId(id) && object(part) && HARM_RUNGS.includes(part.rung) &&
                Object.keys(part).every(key=>['rung','cause','care'].includes(key)), 'Invalid harm part.');
            if (Object.hasOwn(part,'cause')) check(typeof part.cause === 'string' && part.cause.trim().length > 0 && part.cause.length <= 120, 'Invalid part cause.');
            if (Object.hasOwn(part,'care')) check(Number.isFinite(part.care) && part.care >= 0 && part.care <= MAX_COUNT, 'Invalid part care.');
        }
    }
    return slice;
}

let state = fresh();
export const harmState = () => structuredClone(state);
export function setHarmState(value) {
    validateHarm(value);
    state = structuredClone(value ?? fresh());
}
function carrierRule(rules, carrier) {
    check(safeId(carrier) && Object.hasOwn(rules.carriers,carrier), 'Unknown backlash carrier.');
    return rules.carriers[carrier];
}
export function backlashStage(rules, carrier, count) {
    const row = carrierRule(rules,carrier);
    check(Number.isFinite(count) && count >= 0, 'Invalid backlash count.');
    return row.stages.reduce((stage,next)=>count >= next.at ? next : stage,row.stages[0]);
}
// Both planners return a new state and an ephemeral record. Sources never enter the save slice.
export function addBacklash(value, rules, carrier, {source,weight}) {
    validateHarm(value);
    check(typeof source === 'string' && source.trim().length > 0 && source.length <= 120, 'Invalid backlash source.');
    check(Number.isFinite(weight) && weight >= 0, 'Invalid backlash weight.');
    const row = carrierRule(rules,carrier), next = structuredClone(value ?? fresh());
    const before = next.backlash[carrier] ?? row.floor;
    next.backlash[carrier] = before+weight*row.riseScale;
    validateHarm(next);
    return {state:next,record:{carrier,source,before,after:next.backlash[carrier]}};
}
export function restBacklash(value, rules, carrier, {minutes,treated=false}) {
    validateHarm(value);
    check(Number.isFinite(minutes) && minutes >= 0 && typeof treated === 'boolean', 'Invalid backlash recovery.');
    const row = carrierRule(rules,carrier), next = structuredClone(value ?? fresh());
    const before = next.backlash[carrier] ?? row.floor;
    next.backlash[carrier] = Math.max(row.floor,before-minutes/60*(treated ? row.treatedPerHour : row.restPerHour));
    validateHarm(next);
    return {state:next,record:{carrier,minutes,treated,before,after:next.backlash[carrier]}};
}
export function actionGate(stage, actionClass) {
    check(ACTION_CLASSES.includes(actionClass), 'Unknown harm action class.');
    return {allowed:!stage.blocks.includes(actionClass),reason:stage.label};
}
function partRule(rules, partId) {
    check(safeId(partId) && Object.hasOwn(rules.parts ?? {},partId), 'Unknown harm part.');
    return rules.parts[partId];
}
export function injurePart(value, rules, partId, {rung,cause}) {
    validateHarm(value);partRule(rules,partId);
    check(HARM_RUNGS.includes(rung), 'Unknown harm rung.');
    if (cause !== undefined) check(typeof cause === 'string' && cause.trim().length > 0 && cause.length <= 120, 'Invalid part cause.');
    const next = structuredClone(value ?? fresh()), before = next.parts?.[partId]?.rung ?? null;
    if (before === null || HARM_RUNGS.indexOf(rung) > HARM_RUNGS.indexOf(before)) {
        next.parts ??= {};
        next.parts[partId] = {rung,...(cause === undefined ? {} : {cause})};
    }
    validateHarm(next);
    return {state:next,record:{part:partId,before,after:next.parts[partId].rung,...(cause === undefined ? {} : {cause})}};
}
export function healPart(value, rules, partId, {minutes,treated=false,trained=false}) {
    validateHarm(value);
    check(Number.isFinite(minutes) && minutes >= 0 && typeof treated === 'boolean' && typeof trained === 'boolean', 'Invalid part recovery.');
    const row = partRule(rules,partId), next = structuredClone(value ?? fresh());
    const part = next.parts?.[partId], before = part?.rung ?? null;
    // Care is equivalent rest minutes, so fractional treatments survive save/reload.
    if (part) {
        const rate = (treated ? row.treatedPerHour : row.healPerHour) * (trained ? row.trainedScale ?? 1 : 1);
        check(Number.isFinite(rate) && rate > 0 && Number.isFinite(row.healPerHour) && row.healPerHour > 0, 'Invalid part recovery rate.');
        const care = (part.care ?? 0) + minutes * (rate / row.healPerHour), threshold = 60 / row.healPerHour;
        check(Number.isFinite(care), 'Invalid part care.');
        const steps = Math.floor(care / threshold), rung = HARM_RUNGS.indexOf(part.rung) - steps;
        if (rung < 0) delete next.parts[partId];
        else {part.rung = HARM_RUNGS[rung];part.care = care % threshold;}
    }
    if (next.parts && Object.keys(next.parts).length === 0) delete next.parts;
    validateHarm(next);
    return {state:next,record:{part:partId,minutes,treated,trained,before,after:next.parts?.[partId]?.rung ?? null}};
}
function worldRules(save) {
    const world = save?.expansion?.actors?.player?.worldId;
    return Object.hasOwn(HARM_WORLDS,world) ? HARM_WORLDS[world] : HARM_WORLDS.default;
}
const rungLabel = rung => rung[0].toUpperCase()+rung.slice(1);
const partModifiers = (row,part) => (row.axes[part.rung] ?? []).map(({axis,mult,add})=>({axis,
    ...(mult === undefined ? {} : {mult}),...(add === undefined ? {} : {add}),cause:`${row.label}: ${rungLabel(part.rung)}`}));
export function actionModifiers(save, actionClass) {
    check(ACTION_CLASSES.includes(actionClass), 'Unknown harm action class.');
    validateHarm(save?.harm);
    const rules = worldRules(save), all = [];
    let blockedBy = null;
    for (const [id,row] of Object.entries(rules.carriers)) {
        const stage = backlashStage(rules,id,save?.harm?.backlash?.[id] ?? row.floor);
        const gate = actionGate(stage,actionClass);
        if (!gate.allowed && !blockedBy) blockedBy = {carrier:id,reason:`${row.label}: ${gate.reason}`};
        for (const {axis,mult,add} of stage.modifiers ?? []) all.push({axis,
            ...(mult === undefined ? {} : {mult}),...(add === undefined ? {} : {add}),cause:`${row.label}: ${stage.label}`});
    }
    for (const [id,part] of Object.entries(save?.harm?.parts ?? {})) {
        const row = rules.parts?.[id];
        if (!row || !row.blocksAt.classes.includes(actionClass)) continue;
        all.push(...partModifiers(row,part));
        if (!blockedBy && HARM_RUNGS.indexOf(part.rung) >= HARM_RUNGS.indexOf(row.blocksAt.rung))
            blockedBy = {part:id,reason:`${row.label}: ${rungLabel(part.rung)}`};
    }
    const axes = new Map();
    for (const modifier of all) {
        const combined = axes.get(modifier.axis) ?? {axis:modifier.axis,cause:[]};
        if (modifier.mult !== undefined) combined.mult = (combined.mult ?? 1) * modifier.mult;
        if (modifier.add !== undefined) combined.add = (combined.add ?? 0) + modifier.add;
        combined.cause.push(modifier.cause);axes.set(modifier.axis,combined);
    }
    return {allowed:blockedBy === null,blockedBy,modifiers:[...axes.values()].map(row=>({...row,cause:row.cause.join('; ')}))};
}
export function resolveDeath(rules, cause, ctx={}) {
    check(HARM_DEATH_CAUSES.includes(cause), 'Unknown death cause.');
    return {default:rules.death.byCause?.[cause] ?? rules.death.default,
        alternatives:rules.death.alternatives.filter(row=>row.requires.every(key=>
            Object.hasOwn(ctx.facts ?? {},key) && ctx.facts[key] === true)).map(({kind,cost})=>({kind,cost})),
        restartOffered:!!ctx.continuationEnrolled};
}
export function harmView(save) {
    const rules = worldRules(save);
    validateHarm(save?.harm);
    const carriers = Object.entries(rules.carriers).map(([id,row])=>{
        const count = save?.harm?.backlash?.[id] ?? row.floor, stage = backlashStage(rules,id,count);
        return {id,label:row.label,count,stage:stage.id,stageLabel:stage.label,blocked:[...stage.blocks],
            recovers:{rest:row.restPerHour,treated:row.treatedPerHour}};
    });
    const last = save?.continuation?.deaths?.findLast(entry=>entry.cause !== undefined);
    const parts = Object.entries(save?.harm?.parts ?? {}).flatMap(([id,part])=>{
        const row = rules.parts?.[id];
        return row ? [{id,label:row.label,rung:part.rung,rungLabel:rungLabel(part.rung),modifiers:partModifiers(row,part),
            recovers:{rest:row.healPerHour,treated:row.treatedPerHour,trained:row.trainedScale ?? 1}}] : [];
    });
    return {carriers,rung:null,parts,lastDeath:last ? {cause:last.cause,outcome:last.outcome} : null};
}

registerDomain({id:'harm',deps:[],initialState:()=>null,
    save:()=>{
        if (!Object.values(state.backlash).some(n=>n>0) && !Object.keys(state.parts ?? {}).length) return undefined;
        const saved = structuredClone(state);
        if (saved.parts && !Object.keys(saved.parts).length) delete saved.parts;
        return saved;
    },
    validate:validateHarm,
    migrate:slice=>{validateHarm(slice);return structuredClone(slice ?? fresh());},
    load:setHarmState,
    projection:harmState
});
