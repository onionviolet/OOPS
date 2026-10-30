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
export const HARM_WORLDS = freeze({
    'book.lotm.tingen': {
        world:'book.lotm.tingen',
        reason:'Proposed first-slice defaults: thresholds 3/6/9 and rise scale 1 model accumulating power strain; floor 0 and recovery 0.25/1 per hour allow slow rest and stronger treatment. These are world and rank dials, pending play.',
        carriers:{power:{label:'Power strain',stages:[
            {id:'steady',label:'Steady',at:0,blocks:[]},
            {id:'strained',label:'Strained',at:3,blocks:[],warn:'Your power feels strained.'},
            {id:'slipping',label:'Slipping',at:6,blocks:['ritual','research']},
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
        world:'default',reason:'Proposed first-slice defaults for an unbound world: no backlash carrier and final death; a world row can supply its own means and costs.',
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
    check(object(slice) && Object.keys(slice).sort().join(',') === 'backlash,schema' && slice.schema === 1 &&
        object(slice.backlash) && Object.keys(slice.backlash).length <= MAX_CARRIERS, 'Invalid harm slice.');
    for (const [id,count] of Object.entries(slice.backlash))
        check(safeId(id) && Number.isFinite(count) && count >= 0 && count <= MAX_COUNT, 'Invalid backlash counter.');
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
export function resolveDeath(rules, cause, ctx={}) {
    check(HARM_DEATH_CAUSES.includes(cause), 'Unknown death cause.');
    return {default:rules.death.byCause?.[cause] ?? rules.death.default,
        alternatives:rules.death.alternatives.filter(row=>row.requires.every(key=>
            Object.hasOwn(ctx.facts ?? {},key) && ctx.facts[key] === true)).map(({kind,cost})=>({kind,cost})),
        restartOffered:!!ctx.continuationEnrolled};
}
export function harmView(save) {
    const world = save?.expansion?.actors?.player?.worldId;
    const rules = Object.hasOwn(HARM_WORLDS,world) ? HARM_WORLDS[world] : HARM_WORLDS.default;
    validateHarm(save?.harm);
    const carriers = Object.entries(rules.carriers).map(([id,row])=>{
        const count = save?.harm?.backlash?.[id] ?? row.floor, stage = backlashStage(rules,id,count);
        return {id,label:row.label,count,stage:stage.id,stageLabel:stage.label,blocked:[...stage.blocks],
            recovers:{rest:row.restPerHour,treated:row.treatedPerHour}};
    });
    const last = save?.continuation?.deaths?.findLast(entry=>entry.cause !== undefined);
    return {carriers,rung:null,parts:[],lastDeath:last ? {cause:last.cause,outcome:last.outcome} : null};
}

registerDomain({id:'harm',deps:[],initialState:()=>null,
    save:()=>Object.values(state.backlash).some(n=>n>0) ? structuredClone(state) : undefined,
    validate:validateHarm,
    migrate:slice=>structuredClone(slice ?? fresh()),
    load:setHarmState,
    projection:harmState
});
