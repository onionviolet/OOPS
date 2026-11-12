// LOTM English v1 ch83 P033–P047. The two marked faces and spiritual
// completion are sourced. Fraction units and the stock threshold are YAIR dials.
import {defineCatalogue} from './craft_materials.js';
import {defineRecipe, recognizeRecipe} from './craft_recipes.js';
import {defineCraftLaw, resolveBatch} from './craft_resolver.js';
import {planMaterialPartition,readMaterialLineage} from './material_lineage.js';
import {LOTM_IDS} from './book_world_lotm_ids.js';
import {readItemKey} from './inventory_key.js';

const key = id => JSON.stringify({id: 'book.lotm.' + id});
const BLANK = key('silver_amulet_blank');
export const TINGEN_AMULET_ID = 'book.lotm.silver_protective_amulet';
export const TRIAL_AMULET_ID = 'book.lotm.reversed_silver_amulet';
export const REWORKED_AMULET_ID = 'book.lotm.reworked_silver_amulet';
export const isTingenAmulet = id => [TINGEN_AMULET_ID, TRIAL_AMULET_ID, REWORKED_AMULET_ID].includes(id);
export const TINGEN_AMULET_FAMILY = 'tingen-bound-silver';
export const TINGEN_TRIAL_BLANK = key('silver_trial_blank');
export const MARKED_TRIAL_SILVER = key('silver_trial_marked');
const TRIAL_STOCK = new Set([TINGEN_TRIAL_BLANK,MARKED_TRIAL_SILVER]);
export function tingenSilverFamily(id) {
    return isTingenAmulet(id) || TRIAL_STOCK.has(JSON.stringify({id})) ? TINGEN_AMULET_FAMILY : null;
}
// Tingen rows for the shared fabrication law (craft_assembly.js). The bound
// silver pieces share one lineage family; the inscription joins two faces.
export const TINGEN_FABRICATION = Object.freeze({id: 'f.tingen', revision: 1, world: LOTM_IDS.world,
    families: Object.fromEntries([TINGEN_AMULET_ID, TRIAL_AMULET_ID, REWORKED_AMULET_ID,
        ...[...TRIAL_STOCK].map(stock => JSON.parse(stock).id)].map(id => [id, TINGEN_AMULET_FAMILY]))});
const AMULET = JSON.stringify({id: TINGEN_AMULET_ID});
const OFFCUT = key('silver_practice_offcut');
const DESK = 'engraving-desk';
const CARVING_ACTS = new Set(['book.lotm.kj3ap.carve-first', 'book.lotm.kj3ap.carve-second']);
const SEQUENCE = Object.freeze(['engrave-first-face', 'engrave-second-face', 'complete-inscription']);
const tag = (id, kind) => ({id, kind, parents: [], revision: 1});
const catalogue = defineCatalogue({
    id: 'lotm.amulet-stock', revision: 1,
    tags: [tag('silver', 'origin'), tag(DESK, 'station')],
    axes: [
        ...['first-face', 'second-face', 'marked-first', 'marked-second', 'bound'].map(id => ({id, kind: 'fraction'})),
        {id: 'usable-area', kind: 'scalar', max: 100}
    ],
    materials: [
        {id: 'blank', revision: 1, tags: ['silver'], phase: 'solid', properties: {'first-face': 500, 'second-face': 500, 'usable-area': 100}},
        {id: 'offcut', revision: 1, tags: ['silver'], phase: 'solid', properties: {'first-face': 250, 'second-face': 250, 'usable-area': 40}},
        {id: 'marked', revision: 1, tags: ['silver'], phase: 'solid', properties: {'marked-first': 500, 'second-face': 500, 'usable-area': 100}}
    ]
});
const law = defineCraftLaw({
    id: 'lotm.two-faced-inscription', revision: 1, catalogue,
    ops: [
        {id: SEQUENCE[0], station: DESK, converts: [{from: 'first-face', to: 'marked-first', permille: 1000}]},
        {id: SEQUENCE[1], station: DESK, converts: [{from: 'second-face', to: 'marked-second', permille: 1000}]},
        {id: SEQUENCE[2], station: DESK}
    ],
    reactions: [{id: 'join-both-faces', after: SEQUENCE[2],
        reactants: {'marked-first': 1, 'marked-second': 1}, products: {bound: 2}}],
    outputs: [{id: 'bound-area', route: 'inscription', effect: 'joined-area', axis: 'bound', per: 1000}]
});
const recipe = defineRecipe(catalogue, {
    id: 'lotm.misfortune-amulet', revision: 1, law: law.ref, station: DESK,
    slots: [{id: 'silver-body', role: 'base', select: {all: [
        {tags: 'silver'}, {property: {axis: 'usable-area', min: 100}}
    ]}}],
    process: SEQUENCE.map(op => ({op}))
});

export function resolveAmuletInscription({blankKey, stock, clock, steps = SEQUENCE, atDesk, knifeReady, spirituality, keepMarkedPiece = false}) {
    if (!atDesk || !knifeReady) throw Error('Set out the engraving knife at the prepared desk.');
    const materialId = {[BLANK]:'blank',[TINGEN_TRIAL_BLANK]:'blank',[OFFCUT]:'offcut',[MARKED_TRIAL_SILVER]:'marked'}[blankKey];
    const material = catalogue.materials[materialId];
    if (!material) throw Error('Choose silver stock for this inscription.');
    if (steps.includes(SEQUENCE[2]) && !(Number.isSafeInteger(spirituality) && spirituality >= 1)) throw Error('Hold one point of spirituality to complete the inscription.');
    const inputs = [{key: blankKey, material, qty: 1}], process = steps.map(op => ({op, level: 1})), stations = [DESK];
    const fit = recognizeRecipe(catalogue, recipe, inputs, {process, law: law.ref, stations});
    const {product} = resolveBatch(law, {inputs: [{material, qty: 1}], process, stations, recipe: fit.recognized ? recipe : null});
    const joined = product.outputs.inscription?.['joined-area'] ?? 0;
    const finished = joined >= 1000;
    let resultKey = OFFCUT;
    if (finished) {
        const id = {[TINGEN_TRIAL_BLANK]:TRIAL_AMULET_ID,[MARKED_TRIAL_SILVER]:REWORKED_AMULET_ID}[blankKey];
        resultKey = id ? JSON.stringify({id}) : AMULET;
    } else if (keepMarkedPiece && blankKey === TINGEN_TRIAL_BLANK
        && product.composition['marked-first'] === 500 && product.composition['second-face'] === 500) {
        resultKey = MARKED_TRIAL_SILVER;
    }
    const partition = planMaterialPartition({
        stock, inputs: [{item_key: blankKey, count: 1}],
        unit: 'silver workpiece', unitsPerInput: () => 1,
        outputs: [{output: {id: JSON.parse(resultKey).id, family: 'engraved-silver', count: 1}, unitsPerItem: 1}],
        process: {id: 'lotm.amulet-inscription', revision: 1, world_id: LOTM_IDS.world, at: clock,
            parameters: {law: law.ref, steps: [...steps], joined, finished}}
    });
    return {finished, recognized: fit.recognized, resultKey, partition};
}

const WORKSHOP = 'lotm.place.cast-0785d86b800a41be64ed';
export const TRIAL_AMULET_NOTE = 'making.book.lotm.silver-trial.reverse';
const trialId = suffix => 'book.lotm.silver-trial.' + suffix;
export const LEGACY_EARLY_AMULET_TRIAL = trialId('early');
export const REWORKED_AMULET_NOTE = 'making.' + trialId('rework');

// The post-commission order has its own stock. Its price, lot size and work
// times are local dials. The shared law decides which physical piece returns.
export function amuletTrialCommands(situationId) {
    const commissioned = {fact:'actor.book.lotm.kj3ap.both-finished', op:'eq', value:true};
    const desk = {fact:'actor.book.lotm.kj3ap.desk-ready', op:'eq', value:true};
    const support = {all:[commissioned,desk]};
    const item = (key, amount) => ({type:'item', actor:'player', key, amount});
    const energy = {type:'energy', energyId:'book.lotm.be_spirituality', operation:'use', output:1, control:1};
    const command = ({suffix,label,description,location,minutes,costText,costs,effects,report,once=false,observation}) => {
        const id=trialId(suffix), receiptKey='making.'+id;
        const learned = observation && {fact:'knowledge.making.'+trialId(observation)+'.seen',op:'eq',value:true};
        const requires = learned ? {all:[...support.all,learned]} : support;
        return {id, revision:1, label, description, location, actorId:'player', group:'book_lotm',
            worldId:LOTM_IDS.world, duration:minutes, once, cancellation:'refund',
            visibleWhen:learned ? requires : commissioned, requires, completionRequires:requires,
            completionCoLocated:true, completionFailure:'refund', costs, effects:[...effects,
                {type:'knowledge', actor:'player', key:receiptKey, stage:'seen', value:report,
                    basis:{kind:'observation', attributedTo:'player', situationId}}],
            making:{rowId:id, stage:'preparation', costText, receiptKey}};
    };
    const trial = (suffix,label,description,steps,minutes) => {
        const result=resolveAmuletInscription({blankKey:TINGEN_TRIAL_BLANK, stock:{[TINGEN_TRIAL_BLANK]:1},
            clock:0, steps, atDesk:true, knifeReady:true, spirituality:1});
        const report=result.finished
            ? 'The marks join after you carve the back first. Both faces must be ready when you guide the spirituality through.'
            : 'You guide the spirituality through with one face still bare. The marks fail to join, and the silver is left as a practice scrap.';
        return command({suffix,label,description,location:WORKSHOP,minutes,report,
            costText:'Oldest carried trial blank and one point of spirituality',costs:[item(TINGEN_TRIAL_BLANK,-1),energy],
            effects:[item(result.resultKey,result.partition.outputs[0].count)]});
    };
    const [front,back,finish]=SEQUENCE;
    const marked=resolveAmuletInscription({blankKey:TINGEN_TRIAL_BLANK,stock:{[TINGEN_TRIAL_BLANK]:1},
        clock:0,steps:[front,finish],atDesk:true,knifeReady:true,spirituality:1,keepMarkedPiece:true});
    const repaired=resolveAmuletInscription({blankKey:MARKED_TRIAL_SILVER,stock:{[MARKED_TRIAL_SILVER]:1},
        clock:0,steps:[back,finish],atDesk:true,knifeReady:true,spirituality:1});
    return [
        command({suffix:'buy',label:'Order two trial blanks',description:'Send payment to the silver stall. Wait at the office for the runner to bring the small lot.',
            location:WORKSHOP,minutes:35,costText:'12 soli',
            costs:[{type:'resource',actor:'player',key:'money',amount:-144,native:true}],effects:[item(TINGEN_TRIAL_BLANK,2)],
            report:'The runner brings two silver blanks from the stall. You set them aside for trials.'}),
        trial('reverse','Carve the back first','Mark the back, then the front, and finish by guiding spirituality through the knife.',
            [back,front,finish],16),
        trial('early','Try finishing with one face marked','Guide the spirituality through after marking the front and examine what remains.',
            [front,finish],8),
        command({suffix:'early-inspect',label:'Try binding one marked face',description:'Mark the front, then try binding it before carving the back. Inspect the silver before you cut it again.',
            location:WORKSHOP,minutes:8,costText:'Oldest carried trial blank and one point of spirituality',
            costs:[item(TINGEN_TRIAL_BLANK,-1),energy],effects:[item(marked.resultKey,marked.partition.outputs[0].count)],
            report:'The marks fail to join. The front is still legible and the back is intact. This piece can still take a second inscription.'}),
        command({suffix:'rework',label:'Finish the unmarked face',description:'Keep the first engraving, mark the bare face, and bind both.',
            location:WORKSHOP,minutes:10,costText:'Oldest carried front-marked piece and one point of spirituality',observation:'early-inspect',
            costs:[item(MARKED_TRIAL_SILVER,-1),energy],effects:[item(repaired.resultKey,repaired.partition.outputs[0].count)],
            report:'The original front marks join the new marks on the back. The same silver is now a complete amulet.'})
    ];
}

// Pending jobs retain their exact authored stock effects. Only a successful
// settlement materializes the distinct finished object from the paid parent.
const STOCK_METHODS = new Map([
    [trialId('reverse'),{input:TINGEN_TRIAL_BLANK,output:TRIAL_AMULET_ID,process:'lotm.bind-amulet'}],
    [trialId('early-inspect'),{input:TINGEN_TRIAL_BLANK,output:JSON.parse(MARKED_TRIAL_SILVER).id,process:'lotm.mark-silver'}],
    [trialId('rework'),{input:MARKED_TRIAL_SILVER,output:REWORKED_AMULET_ID,process:'lotm.bind-amulet'}]
]);

function matchesTrialStock(key, template) {
    if(key===template)return true;
    if(readItemKey(key)?.id!==JSON.parse(template).id)return false;
    const lineage=readMaterialLineage(key), event=lineage?.history.at(-1);
    const process=template===MARKED_TRIAL_SILVER?'lotm.mark-silver':'lotm.deliver-silver';
    return lineage?.family===TINGEN_AMULET_FAMILY&&event?.process_id===process&&event.world_id===LOTM_IDS.world;
}

export function reserveAmuletCosts(commandId, costs, stock) {
    const method=STOCK_METHODS.get(commandId);
    if(!method)return costs;
    const selected=Object.keys(stock||{}).filter(key=>stock[key]>0&&matchesTrialStock(key,method.input))
        .sort((a,b)=>(readMaterialLineage(a)?.history.at(-1).at??-1)-(readMaterialLineage(b)?.history.at(-1).at??-1))[0];
    return selected ? costs.map(effect=>effect.type==='item'&&effect.key===method.input?{...effect,key:selected}:effect) : costs;
}

export function expectedAmuletCosts(commandId, costs, admittedCosts) {
    const method=STOCK_METHODS.get(commandId);
    if(!method)return costs;
    const paid=admittedCosts.find(effect=>effect.type==='item'&&matchesTrialStock(effect.key,method.input));
    return paid ? costs.map(effect=>effect.type==='item'&&effect.key===method.input?{...effect,key:paid.key}:effect) : costs;
}

export function settledAmuletEffects(job, state) {
    const delivery=job.commandId===trialId('buy');
    const method=delivery
        ? {input:TINGEN_TRIAL_BLANK,output:JSON.parse(TINGEN_TRIAL_BLANK).id,process:'lotm.deliver-silver'}
        : STOCK_METHODS.get(job.commandId);
    const id=method?.output;
    if (!id) return job.effects;
    // A delivery receives two physical blanks from the paid offstage stall.
    const paid = delivery ? {key:method.input} : job.costs.find(effect=>effect.type==='item'
        &&matchesTrialStock(effect.key,method.input)&&effect.amount===-1);
    if (!paid) throw Error('The amulet needs its paid silver.');
    const count=delivery?2:1;
    const {outputs} = planMaterialPartition({
        stock:{[paid.key]:count}, inputs:[{item_key:paid.key,count}],
        unit:'silver workpiece',unitsPerInput:()=>1,
        outputs:[{output:{id,family:TINGEN_AMULET_FAMILY,count},unitsPerItem:1}],
        process:{id:method.process,revision:1,world_id:LOTM_IDS.world,at:state.clock,
            parameters:{cause:job.id,method:job.commandId}}
    });
    return job.effects.map(effect=>{
        if(effect.type==='item'&&effect.key===JSON.stringify({id}))return {...effect,key:outputs[0].item_key};
        // The first note remains the age anchor for old undifferentiated stock.
        if(isTingenAmulet(id)&&effect.type==='knowledge'&&state.simulation?.knowledge?.player?.[effect.key])return {...effect,key:effect.key+'.latest'};
        return effect;
    });
}

export function boundAmuletMinute(key) {
    const lineage=readMaterialLineage(key), event=lineage?.history.at(-1);
    return lineage?.family===TINGEN_AMULET_FAMILY && event?.process_id==='lotm.bind-amulet' ? event.at : undefined;
}

// The source story has two fixed, already timed carvings. Lower their physical
// output through the law at pack load. Keep the native stock carrier and the
// pending job effect shape so older jobs and subsequent gifts still resolve.
export function withAmuletCrafting(pack) {
    const acts = pack.householdActs?.acts;
    if (!acts?.some(row => CARVING_ACTS.has(row.id))) return pack;
    return {...pack, householdActs: {...pack.householdActs, acts: acts.map(row => {
        if (!CARVING_ACTS.has(row.id)) return row;
        const items = row.costs?.filter(e => e.type === 'item') ?? [];
        const energy = row.costs?.filter(e => e.type === 'energy') ?? [];
        const grants = row.effects?.filter(e => e.type === 'item') ?? [];
        if (items.length !== 1 || items[0].key !== BLANK || items[0].actor !== 'player' || items[0].amount !== -1
            || energy.length !== 1 || energy[0].energyId !== 'book.lotm.be_spirituality' || energy[0].operation !== 'use'
            || energy[0].output !== 1 || energy[0].control !== 1
            || grants.length !== 1 || grants[0].key !== AMULET || grants[0].actor !== 'player' || grants[0].amount !== 1) {
            throw Error('The sourced amulet row disagrees with its silver and spirituality binding.');
        }
        const {finished, resultKey, partition} = resolveAmuletInscription({
            blankKey: BLANK, stock: {[BLANK]: 1}, clock: 0, atDesk: true, knifeReady: true, spirituality: energy[0].output
        });
        if (!finished) throw Error('The known amulet method did not complete both faces.');
        return {...row, effects: row.effects.map(effect => effect === grants[0]
            ? {...effect, key: resultKey, amount: partition.outputs[0].count} : effect)};
    })}};
}

// The place-act job already durably writes its completion observation. Replay
// the known law at that recorded time, leaving the stock key and saved job
// unchanged. An in-flight, cancelled or forgotten act yields no receipt here.
export function replayCompletedAmulet(state, commandId) {
    if (!CARVING_ACTS.has(commandId) || state?.actors?.player?.completed?.[commandId] !== 1) return null;
    const observation = state.simulation?.knowledge?.player?.[commandId + '.seen'];
    if (observation?.stage !== 'seen' || !/^simulation:[1-9]\d*$/.test(observation.cause)
        || observation.basis?.kind !== 'observation' || observation.basis?.attributedTo !== 'player'
        || !Number.isSafeInteger(observation.at) || observation.at < 0 || observation.at > state.clock) return null;
    const {partition} = resolveAmuletInscription({
        blankKey: BLANK, stock: {[BLANK]: 1}, clock: observation.at, atDesk: true, knifeReady: true, spirituality: 1
    });
    return {commandId, cause: observation.cause, completedAt: observation.at, partition};
}

export function amuletWorkshopRecords(state) {
    if (state?.actors?.player?.worldId !== LOTM_IDS.world) return [];
    const carvings = [...CARVING_ACTS].flatMap((commandId, index) => {
        const receipt = replayCompletedAmulet(state, commandId);
        if (!receipt) return [];
        const {input, output} = receipt.partition.balance;
        return [{id: commandId + '.workshop', at: receipt.completedAt,
            text: `Silver amulet ${index + 1}: ${input} blank became ${output} amulet. Both faces joined using one point of spirituality.`}];
    });
    const trials = ['buy','early','early-inspect','reverse','rework'].flatMap(suffix => {
        const id='making.'+trialId(suffix), known=state.simulation?.knowledge?.player;
        const note=known?.[id+'.latest']??known?.[id];
        return note ? [{id, at:note.at, text:note.value}] : [];
    });
    return [...carvings,...trials];
}
