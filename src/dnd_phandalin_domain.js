import {registerDomain} from './domain_registry.js';
import {createCheckRulePack} from './check_rule_pack.js';
import {replayCheck} from './check_resolver.js';
import {beginMending, interruptMending, finishMending, mendingEligibility, canCarry, steppingStonesAttempt, STEPPING_STONES, DND_WORLD_ID} from './dnd_phandalin.js';
import {newLevitationTrial, validateLevitationTrial, levitationActions, levitationStudyActions, levitationMaterialLabel, quoteLevitation, settleLevitation, settleLevitationStudy, expireLevitation} from './dnd_levitate.js';
import {createDndPhandalinPanel} from './dnd_phandalin_panel.js';
// D&D first-slice live path (FIRST_SLICE PS01-PS06, proposal). Reached from a NAMED FIXTURE START (ST2 Wizard, SRD521_START), not a registered world pack.
// State is one namespaced slice. Time comes from the existing tick (minutes), not a second timer (AR3). Every command quotes, then revalidates (AR7).
export const DND_SLICE_FAMILY = 'dnd.phandalin@1';
export const DND_ROOT_SEED = 'dnd-phandalin-fixture-v1'; // fixed per fixture: the same approach on the same attempt rolls the same way, by design
export const CARGO_LB = 20;
const PACK = createCheckRulePack({schema: 1, id: 'dnd.phandalin.checks', revision: 1, worldId: DND_WORLD_ID, edition: 'SRD 5.2.1',
    profile: {id: 'dnd.srd521.d20', revision: 1, family: 'sum_target', dice: {count: 1, sides: 20}}, rulings: [], modules: []});
const MEANS = Object.freeze({knowsMending: true, voice: true, freeHand: true, focusHeld: true, reachesTarget: true});
const APPROACHES = Object.freeze(['rush', 'test each stone']);
const freshBag = () => ({id: 'dnd.branch.bag:01', name: 'Sack', revision: 1, accessible: true, capacityLb: 30, ownerId: 'dnd.branch.carrier:01',
    damage: {id: 'tear:1', kind: 'tear', inches: [6], missingMaterial: false, state: 'open'}});
const freshState = () => ({family: DND_SLICE_FAMILY, minute: 540, bag: freshBag(), inspected: false, cast: null, tried: [], crossed: false, settled: false, log: []});
let state = null, panel = null;
const say = (s, text) => { s.log = [...s.log.slice(-5), text]; };
const need = (ok, message) => { if (!ok) throw Error(message); };

export function validateDndSlice(slice) {
    if (slice == null) return;
    need(slice.family === DND_SLICE_FAMILY && Number.isSafeInteger(slice.minute) && slice.minute >= 0, 'D&D slice: unsupported family or clock.');
    need(slice.bag?.id === 'dnd.branch.bag:01' && Number.isSafeInteger(slice.bag.revision) && ['open', 'repaired'].includes(slice.bag.damage?.state), 'D&D slice: invalid bag.');
    need(Array.isArray(slice.tried) && slice.tried.length <= 16 && Array.isArray(slice.log) && slice.log.length <= 8, 'D&D slice: invalid history.');
    need(slice.cast === null || (slice.cast.itemId === slice.bag.id && slice.cast.doneAt >= slice.cast.startedAt), 'D&D slice: invalid cast.');
    need(!slice.settled || slice.crossed, 'D&D slice: settled without crossing.');
    validateLevitationTrial(slice.levitation,slice.minute);
    need(!slice.cast || (!slice.levitation?.support && !slice.levitation?.pending), 'D&D slice: overlapping concentration.');
    // Each saved roll is replayed from its own inputs, so an edited save cannot carry a different result.
    for (const t of slice.tried) { need(typeof t.approach === 'string', 'D&D slice: bad roll.'); replayCheck(t.receipt); }
}
export const dndSlice = () => state;

function quote(request) {
    const s = state, type = request?.type;
    if (type === 'start' || type === 'startStudy') return s ? {eligible: false, reason: 'The Phandalin test start is already running.', request} : {eligible: true, request, summary: type==='startStudy' ? 'Begin with a borrowed source spellbook and 100 GP for copying supplies.' : 'Begin the named test start: a student at the work yard, 09:00, one torn Sack on the bench.'};
    if (!s) return {eligible: false, reason: 'Begin the test start first.', request};
    const trial=quoteLevitation(s.levitation ?? newLevitationTrial(),type,{mending:!!s.cast});
    if(trial)return {...trial,request};
    if(s.levitation?.pending)return {eligible:false,reason:'Resolve the casting first.',request};
    if (s.settled) return {eligible: false, reason: 'The job is already settled.', request};
    if (type === 'inspect') return s.inspected ? {eligible: false, reason: 'You already know the bag\'s condition.', request} : {eligible: true, request, summary: 'Look the Sack over (1 minute).'};
    if (type === 'cast') {
        if(s.levitation?.actionUsed)return {eligible:false,reason:'You have used your Magic action this turn.',request};
        if (s.cast) return {eligible: false, reason: 'A casting is already under way.', request};
        const e = mendingEligibility(MEANS, s.bag);
        return e.ok ? {eligible: true, request, summary: s.levitation?.support ? 'Start Mending and end Levitate. Mending takes one minute of concentration and no spell slot.' : 'Cast Mending on the tear: 1 minute of concentration, no spell slot.'} : {eligible: false, reason: e.reasons.join(' '), request};
    }
    if (type === 'interrupt') return s.cast ? {eligible: true, request, summary: 'Break off the casting.'} : {eligible: false, reason: 'Nothing is being cast.', request};
    if (type === 'cross') {
        if (s.crossed) return {eligible: false, reason: 'You already crossed.', request};
        if (!APPROACHES.includes(request.approach)) return {eligible: false, reason: 'Choose an approach.', request};
        const c = canCarry(s.bag, CARGO_LB);
        if (!c.ok) return {eligible: false, reason: `${c.reasons[0]} Repair it or take the dry path.`, request};
        if (s.tried.some(t => t.approach === request.approach)) return {eligible: false, reason: 'You already tried that approach and the roll stands. Try a different one.', request};
        return {eligible: true, request, summary: `Cross the stepping stones (${request.approach}). DC ${STEPPING_STONES.dc}; a slip means wet gear and a lost half hour.`};
    }
    if (type === 'dryPath') {
        if (s.crossed) return {eligible: false, reason: 'You already crossed.', request};
        const c = canCarry(s.bag, CARGO_LB);
        return c.ok ? {eligible: true, request, summary: 'Take the dry path round: no roll, 90 minutes.'} : {eligible: false, reason: `${c.reasons[0]} Repair it first.`, request};
    }
    if (type === 'deliver') {
        if (!s.crossed) return {eligible: false, reason: 'Get the cargo across first.', request};
        return {eligible: true, request, summary: 'Hand over the supplies and settle the 1 GP fee, once.'};
    }
    return {eligible: false, reason: 'Unknown action.', request};
}
function execute(q) {
    need(q?.eligible, q?.reason || 'Review the action first.');
    const fresh = quote(q.request); need(fresh.eligible, fresh.reason);
    const t = q.request.type, next = structuredClone(state ?? freshState());
    if (t === 'start' || t === 'startStudy') {
        if(t==='startStudy')next.levitation=newLevitationTrial({study:true});
        state = next; say(next, 'You meet the carrier in the work yard. A Sack lies on the bench.');
    }
    else if(levitationStudyActions.some(a=>a.id===t)){
        const study=settleLevitationStudy(next.levitation,t);
        next.minute+=study.minutes;say(next,study.message);
        validateDndSlice(next);state=next;
    }
    else if(levitationActions.some(a=>a.id===t)) {
        next.levitation ??= newLevitationTrial();
        say(next,settleLevitation(next.levitation,t,{minute:next.minute,profile:PACK.profile(),root:DND_ROOT_SEED,worldId:DND_WORLD_ID}));
        validateDndSlice(next);state=next;
    }
    else if (t === 'inspect') { next.inspected = true; next.minute += 1; say(next, 'One six-inch tear in the fabric, nothing missing, nothing magical.'); state = next; }
    else if (t === 'cast') {
        if(next.levitation?.support){
            settleLevitation(next.levitation,'endLevitate',{});
            say(next,'Your concentration shifts to Mending. The crate floats gently down.');
        }
        if(next.levitation)next.levitation.actionUsed=true;
        next.cast=beginMending(MEANS,next.bag,next.minute).cast;
        say(next,'You begin the Mending cantrip.');state=next;
    }
    else if (t === 'interrupt') { const r = interruptMending(next.cast); next.cast = null; say(next, `${r.reason} No slot spent.`); state = next; }
    else if (t === 'cross') {
        const a = steppingStonesAttempt(PACK.profile(), DND_ROOT_SEED, {lifeId: 'life:dnd', stepBonus: 2, careful: q.request.approach === 'test each stone'}, next.tried, q.request.approach, next.minute);
        if (!a.replay) { next.tried.push(a.saved); next.minute += a.success ? 5 : 30; }
        const r = a.receipt.result;
        if (r.success) { next.crossed = true; say(next, `Across (rolled ${r.raw}, total ${r.total} vs DC ${r.target}).`); } else say(next, `${STEPPING_STONES.failure} (rolled ${r.raw}, total ${r.total} vs DC ${r.target}.) Try a different approach.`);
        state = next;
    } else if (t === 'dryPath') { next.crossed = true; next.minute += 90; say(next, 'You take the long dry path round. It costs an hour and a half, and nothing is left to chance.'); state = next;
    } else if (t === 'deliver') { next.settled = true; say(next, 'The carrier counts out your fee. The job is settled.'); state = next; }
    if(next.levitation){const ended=expireLevitation(next.levitation,next.minute);if(ended)say(next,ended);}
    panel?.render();
    return {...fresh, message: state.log.at(-1)};
}
function tick(minutes) {
    if (!state) return;
    const s = structuredClone(state); s.minute += Math.floor(minutes);
    if (s.cast && s.minute >= s.cast.doneAt) {
        const done = finishMending(s.cast, s.bag, s.minute);
        s.cast = null;
        if (done.ok) { s.bag = {...s.bag, ...done.itemPatch}; say(s, 'The tear closes. The Sack is whole, same bag, same owner.'); } else say(s, done.reasons[0]);
    }
    if(s.levitation){const ended=expireLevitation(s.levitation,s.minute);if(ended)say(s,ended);}
    state = s; panel?.render();
}
export function projectDndSlice() {
    const s = state;
    if (!s) return {visible: true, started: false, rows: [], log: [], start: quote({type: 'start'}), studyStart:quote({type:'startStudy'})};
    const q = r => quote(r), actions = [
        {id: 'inspect', label: 'Inspect the Sack', quote: q({type: 'inspect'})}, {id: 'cast', label: 'Cast Mending', quote: q({type: 'cast'})},
        {id: 'interrupt', label: 'Break off casting', quote: q({type: 'interrupt'})},
        ...APPROACHES.map(a => ({id: `cross:${a}`, label: `Cross the stones: ${a}`, request: {type: 'cross', approach: a}, quote: q({type: 'cross', approach: a})})),
        {id: 'dryPath', label: 'Take the dry path', quote: q({type: 'dryPath'})},
        {id: 'deliver', label: 'Deliver the supplies', quote: q({type: 'deliver'})}];
    for(const a of levitationActions)actions.push({...a,quote:q({type:a.id})});
    const levitation=s.levitation??newLevitationTrial();
    if(levitation.study)for(const a of levitationStudyActions)actions.push({...a,quote:q({type:a.id})});
    const hhmm = m => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
    return {visible: true, started: true, minute: s.minute, clock: hhmm(s.minute),
        bag: s.inspected ? (s.bag.damage.state === 'repaired' ? 'Sack: whole, holds 30 lb' : 'Sack: one six-inch tear, cannot hold loose cargo') : 'Sack: condition not yet inspected',
        levitation:{known:levitation.known.includes('levitate'),study:levitation.study??null,slots:levitation.slots,prepared:levitation.prepared.includes('levitate'),feet:levitation.support?.feet??0,
            castingAid:levitationMaterialLabel(levitation),position:levitation.position??'open',movement:levitation.movement??30,pending:!!levitation.pending,recovered:levitation.recovered}, cast: s.cast && {until: hhmm(s.cast.doneAt)}, settled: s.settled, actions, log: [...s.log]};
}
registerDomain({id: 'dnd_phandalin', initialState: () => null, save: () => state ?? undefined,
    migrate: slice => slice && slice.family === DND_SLICE_FAMILY ? slice : null, validate: slice => validateDndSlice(slice),
    load: slice => { state = slice ? structuredClone(slice) : null; }, tick,
    commands: {quote, execute}, projection: projectDndSlice, refresh: () => panel?.render(),
    panels: [() => { panel = createDndPhandalinPanel({read: projectDndSlice, quote, execute}); }]});
