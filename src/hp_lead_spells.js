import {spellTrialObservation,testedSpellRevision,readSpellTrials} from './spell_trial_evidence.js';
import {extensionFact} from './structured_pack_extensions.js';
// Harry's levitation charm as a cast (W1b, proposal under AD32, LT2): a spell row through the shared spell seam and the shared cast lowering.
// Default, dial, reason: stamina 1 per cast (HP's local cost source; a LOTM caller pays spirituality instead), spent whether the feather rises
// or not. The chance is the first-year dial already used by the Charms class (60% at no practice, 10 points less per step; hpLeadLessons owns it).
// The charm is the power Harry learns in his first Charms lesson (HP_LEVITATION, model 'practice'). A spell row cannot name an existing power
// (ability_records derives `<prefix>.power.<key>`), so the row is lowered and the one cast command is rewritten onto HP_LEVITATION; the generated
// learn/practice commands and power are dropped because the Charms lesson and practice already own them, and the faculty-source requirement is
// dropped because a learned power is the gate here. The cast needs the learned power and being at the school.
// Gaps (unstated, not invented): the wand and the spoken words. The lead life holds no wand fact or item at his first Charms lesson (the wand
// item book.hp.lead.w4_wand belongs to a later window) and no speech fact, so neither is required; both are listed on the row's `unstated`.
// Each cast, lifted or not, adds one step of practice to the charm (Weibao, 2026-11-08), the same step a Charms class try adds.
import {definePowerGrammar} from './power_grammar.js';
import {hpPowerPrices, HP_LEVITATION_PARTS} from './power_grammar_worlds.js';
import {hpSpellAdapter} from './spell_adapter_hp.js';
import {lowerSpellCasts, spellCastFacts} from './spell_cast_lowering.js';
// Shared save identity, pinned against the life-data export by spell_cast_lowering tests.
const HP_LEVITATION = 'book.hp.lead.levitation';

const WORLD = 'book.hp.lead.world', PREFIX = 'book.hp.lead.sp', HALL = 'book.hp.lead.school_hall', KEY = 'levitation_charm';
const note = (key, value) => ({type: 'knowledge', key: `book.hp.lead.${key}`, stage: 'understood', value});
const alive = {fact: 'actor.life', op: 'eq', value: 'alive'};

export const hpLeadPowerLaw = {...hpPowerPrices, functions: {levitate: () => [note('spell.levitation.last', 'You made the motion and said the words, and the feather rose off the desk.')]}};

export const hpLeadSpellSet = definePowerGrammar([{
    key: KEY, label: 'Cast the levitation charm on a feather', sourceId: `${PREFIX}.charm`, origin: {kind: 'teacher'}, fn: 'support',
    formula: [{label: 'At Hogwarts', requires: {fact: 'actor.hp.lead.atSchool', op: 'eq', value: true}}],
    parts: HP_LEVITATION_PARTS,
    failureOutcome: [note('spell.levitation.last', 'You made the motion and said the words, and the feather only shivered. You noticed what you did wrong.')],
    unstated: ['wand (the lead life holds no wand fact at his first Charms lesson)', 'spoken words (no speech fact in the lead life)']}],
    hpLeadPowerLaw, hpSpellAdapter({worldId: WORLD, prefix: PREFIX}));

const castId = hpLeadSpellSet.ids[KEY].command;
export const hpLeadChanceFact = id => `hp.lead.spell.${id.slice(PREFIX.length + 1)}.failChance`;

export const hpLeadSpellCommands = lowerSpellCasts(hpLeadSpellSet, {chanceFact: hpLeadChanceFact, practice: {powerOf: () => HP_LEVITATION, amount: 1}}).filter(c => c.id === castId).map(c => {
    const own = hpLeadSpellSet.cards[KEY];
    return {...c, powerId: HP_LEVITATION, group: 'structured_local', worldId: WORLD, location: HALL, audience: ['$actor'],
        requires: {all: [alive, ...own.conditions.map(x => structuredClone(x.requires)), {fact: `power.${HP_LEVITATION}.owned`, op: 'eq', value: true, reason: 'Learn the charm in Charms first.'}],
            reason: 'You need to be at Hogwarts and to know the charm.'}};
});

export const hpLeadSpellFacts = state => ({...spellCastFacts(state, hpLeadSpellSet, {chanceFact: hpLeadChanceFact, powerOf: () => HP_LEVITATION}), ...hpLeadAdditionalSpellFacts(state), ...labTrialFacts(state), [pathBlocked]: state.worlds?.[WORLD]?.facts?.[BOARD]===true?0:1, ...spellCastFacts(state, benchSpells, {chanceFact: benchChanceFact, powerOf: () => HP_LEVITATION})});

// A second application of the learned charm, not a second learned power. The
// lesson supplier issues one practice feather; the transfer owner conserves it.
export const HP_LEAD_FEATHER_ID = 'book.hp.lead.item.practice_feather';
export const HP_LEAD_FEATHER_KEY = JSON.stringify({id: HP_LEAD_FEATHER_ID});
export const HP_SPELL_PRACTICE = 'book.hp.lead.spell_practice';
const practiceWand = {id: HP_SPELL_PRACTICE + '.class_wand', name: 'Class wand', description: 'A wand supplied for practice after Charms.', value: 0};
const brassWeight = {id: HP_SPELL_PRACTICE + '.brass_weight', name: 'Brass weight', description: 'The little brass weight from beneath the practice board.', value: 0};
const itemKey = item => JSON.stringify({id: item.id});
export const hpLeadPowerItems = [
    {id: HP_LEAD_FEATHER_ID, name: 'Practice feather', description: 'A feather from Charms, light enough to practise on.', value: 0, tags: {feather: true}},
];
export const hpLeadSpellIssueEffects = [{type: 'item', key: HP_LEAD_FEATHER_KEY, amount: 1}];
const passingLaw = {...hpLeadPowerLaw, functions: {...hpLeadPowerLaw.functions,
    pass_feather: parts => [{type: 'transfer', from: '$actor', to: 'book.hp.lead.ron', key: HP_LEAD_FEATHER_KEY, count: parts.targets}, note('spell.passing.last', 'The feather floated over to Ron. He caught it before it reached his nose.')]}};
export const hpLeadPassingSpellSet = definePowerGrammar([{key: 'pass_feather', label: 'Float your feather over to Ron',
    sourceId: `${PREFIX}.charm`, origin: {kind: 'teacher'}, fn: 'craft',
    parts: {functions: ['levitate', 'pass_feather'], magnitude: 1, range: 1, duration: 0, targets: 1, tier: 1},
    formula: [{label: 'At Hogwarts', requires: {fact: 'actor.hp.lead.atSchool', op: 'eq', value: true}},
        {label: 'A practice feather to hand', requires: {fact: `item.${HP_LEAD_FEATHER_KEY}`, op: 'gte', value: 1, reason: 'You need your practice feather.'}}],
    failureOutcome: [note('spell.passing.last', 'The feather wobbled and fell back beside you.')],
    unstated: ['canon range band', 'canon stamina cost', 'spoken words (no speech fact in the lead life)']}], passingLaw, hpSpellAdapter({worldId: WORLD, prefix: PREFIX}));
export const hpLeadAdditionalSpellCommands = lowerSpellCasts(hpLeadPassingSpellSet, {chanceFact: hpLeadChanceFact, practice: {powerOf: () => HP_LEVITATION, amount: 1}})
    .filter(c => c.id === hpLeadPassingSpellSet.ids.pass_feather.command).map(c => ({...c, powerId: HP_LEVITATION, group: 'structured_local', worldId: WORLD, location: HALL, audience: ['$actor'], participants: ['player', 'book.hp.lead.ron'], participantsCoLocated: true,
        requires: {all: [alive, ...hpLeadPassingSpellSet.cards.pass_feather.conditions.map(x => structuredClone(x.requires)),
            {fact: `power.${HP_LEVITATION}.owned`, op: 'eq', value: true, reason: 'Learn the charm in Charms first.'}], reason: 'You need to know the charm and have a practice feather at Hogwarts.'}}));
export const hpLeadAdditionalSpellFacts = state => spellCastFacts(state, hpLeadPassingSpellSet, {chanceFact: hpLeadChanceFact, powerOf: () => HP_LEVITATION});

hpLeadSpellCommands.push(...hpLeadAdditionalSpellCommands);

// The practice board is an authored object in the school hall. Its one saved
// fact is the board's current support, read by both release and retrieval.
const BOARD = HP_SPELL_PRACTICE + '.board_aloft';
const boardNote = value => ({type: 'knowledge', key: HP_SPELL_PRACTICE + '.last', stage: 'understood', value});
const ANGLE = HP_SPELL_PRACTICE + '.board_tilted';
const angleEffect = value => ({type:'fact',scope:'world',key:ANGLE,value});
const WEIGHT_TAKEN = HP_SPELL_PRACTICE+'.weight_taken';
const STANCE = HP_SPELL_PRACTICE+'.at_rail';
const weightAvailable = {fact:'world.'+WEIGHT_TAKEN,op:'eq',value:false,reason:'The brass weight has already been taken.'};
const atRail = {fact:'actor.'+STANCE,op:'eq',value:true};
const atDesk = {fact:'actor.'+STANCE,op:'eq',value:false,reason:'Come back to the desk to reach underneath.'};
const stanceEffect = value => ({type:'fact',scope:'actor',key:STANCE,value});
const takeWeightEffects = [
    {type:'fact',scope:'world',key:WEIGHT_TAKEN,value:true},
    {type:'item',key:itemKey(brassWeight),amount:1},
];
const boardEffect = value => ({type: 'fact', scope: 'world', key: BOARD, value});
const boardAloft = {fact: `world.${BOARD}`, op: 'eq', value: true, reason: 'Raise the board before reaching underneath.'};
const school = {fact: 'actor.hp.lead.atSchool', op: 'eq', value: true};
const learned = {fact: `power.${HP_LEVITATION}.owned`, op: 'eq', value: true, reason: 'Learn the charm in Charms first.'};
const heldWand = {fact: `item.${itemKey(practiceWand)}`, op: 'gte', value: 1, reason: 'Take a class wand before trying the charm.'};
const benchLaw = {...hpLeadPowerLaw, functions: {
    support_board: () => [boardEffect(true), boardNote('The board rose. You can reach the brass weight underneath.')],
}};
const benchSpells = definePowerGrammar([{
    key: 'lift_board', label: 'Levitate the practice board', sourceId: `${HP_SPELL_PRACTICE}.charm`, origin: {kind: 'teacher'}, fn: 'support',
    parts: {...HP_LEVITATION_PARTS, functions: ['support_board']},
    formula: [
        {label: 'Class wand', requires: heldWand},
        {label: 'Wingardium Leviosa, with a swish and flick', requires: {not: boardAloft, reason: 'The board is already in the air.'}},
    ],
    failureOutcome: [boardNote('The board rattled against the desk and stayed there.')],
}], benchLaw, hpSpellAdapter({worldId: WORLD, prefix: HP_SPELL_PRACTICE}));
const benchChanceFact = id => `spell.${id}.failChance`;
const benchCast = lowerSpellCasts(benchSpells, {chanceFact: benchChanceFact, practice: {powerOf: () => HP_LEVITATION, amount: 1}})
    .find(command => command.id === benchSpells.ids.lift_board.command);
export const HP_LIFT_BOARD_COMMAND = benchCast.id;
const benchAction = (command, conditions) => ({
    group: 'structured_local', revision: 1, worldId: WORLD, location: HALL, audience: ['$actor'], ...command, actorId: 'player', duration: 0,
    requires: {all: [alive, school, learned, {fact: extensionFact(HP_SPELL_PRACTICE), op: 'eq', value: true, reason: 'Open the Charms practice bench first.'}, ...conditions]},
});
export const hpLeadBenchCommands = [
    benchAction({
        id: `${HP_SPELL_PRACTICE}.take_class_wand`, label: 'Take a class wand', once: true,
        description: 'Pick up a wand for the practice board after Charms.',
        effects: [{type: 'item', key: itemKey(practiceWand), amount: 1}, boardEffect(false), stanceEffect(false), {type:'fact',scope:'world',key:WEIGHT_TAKEN,value:false}],
    }, [{not: heldWand, reason: 'You already have a class wand.'}]),
    benchAction({
        ...benchCast, powerId: HP_LEVITATION,
        description: 'Say Wingardium Leviosa with a swish and flick to raise the board.',
    }, benchSpells.cards.lift_board.conditions.map(condition => condition.requires)),
    benchAction({
        id: `${HP_SPELL_PRACTICE}.take_brass_weight`, label: 'Take the brass weight', once: true,
        description: 'Reach beneath the board while it is in the air.',
        effects: takeWeightEffects,
    }, [boardAloft,atDesk,weightAvailable]),
    benchAction({
        id: `${HP_SPELL_PRACTICE}.release_board`, label: 'Set the board down',
        description: 'End the charm and lower the board to the desk.',
        effects: [boardEffect(false), angleEffect(false), boardNote('The board settled on the desk.')],
    }, [boardAloft]),
];

// Authored practice model: mental delivery needs prior fluency. A guiding turn
// can add an angle when the caster deliberately tries to tilt this board.
const experimentKey = key => HP_SPELL_PRACTICE + '.draft.' + key;
const draftAxes = {
    delivery: {spoken:'Speak Wingardium Leviosa',mental:'Form the incantation silently'},
    stroke: {standard:'Use the swish and flick',guided:'Finish with a guiding turn'},
    aim: {raise:'Aim for a level lift',tilt:'Aim to tip the near edge'},
};
const selected = (axis,value) => ({fact:'actor.'+experimentKey(axis),op:'eq',value});
const draftEffect = (axis,value) => ({type:'fact',scope:'actor',key:experimentKey(axis),value});
const draftExists = {any:Object.keys(draftAxes.delivery).map(value=>selected('delivery',value))};
const benchEdits = Object.entries(draftAxes).flatMap(([axis,choices])=>Object.entries(choices).map(([value,label])=>benchAction({
    id:experimentKey(axis)+'.'+value,label,visibleWhen:{all:[draftExists,{not:selected(axis,value)}]},
    effects:[draftEffect(axis,value)],
},[draftExists])));

const variants = Object.keys(draftAxes.delivery).flatMap(delivery=>Object.keys(draftAxes.stroke).flatMap(stroke=>
    Object.keys(draftAxes.aim).map(aim=>({delivery,stroke,aim}))));
const fluency = 3;
const records = (key,worked,text) => [
    spellTrialObservation(HP_SPELL_PRACTICE,key,worked,text),
    boardNote(text),
    {type:'power',powerId:HP_LEVITATION,operation:'refine',amount:1},
];
const techniqueText = ({delivery,stroke,aim}) =>
    [draftAxes.delivery[delivery],draftAxes.stroke[stroke],draftAxes.aim[aim]].join('. ')+'.';
const labTrials = variants.map(({delivery,stroke,aim})=>{
    const key=[delivery,stroke,aim].join('.');
    const parameters=[selected('delivery',delivery),selected('stroke',stroke),selected('aim',aim)];
    const angle=stroke==='guided'&&aim==='tilt';
    const success=aim==='raise'||angle;
    const worked=angle?'The board held at an angle. You can see the mark cut into the near edge.':'The board rose level.';
    const chanceFact=HP_SPELL_PRACTICE+'.trial.'+key+'.chance';
    const failure=delivery==='mental'?'The silent attempt faltered. The board stayed on the desk.':'The motion slipped. The board stayed on the desk.';
    const outcomes=success?[
        {id:'lifted',weight:{fact:chanceFact,scale:-1,add:1},effects:[boardEffect(true),angleEffect(angle),...records(key,true,worked)]},
        {id:'fizzled',weight:{fact:chanceFact},effects:records(key,false,failure)},
    ]:undefined;
    return benchAction({
        id:HP_SPELL_PRACTICE+'.try.'+key,label:'Try your drafted cast',powerId:HP_LEVITATION,
        description:techniqueText({delivery,stroke,aim}),
        visibleWhen:{all:parameters},costs:[{type:'vital',key:'stamina',amount:-1}],
        ...(outcomes?{outcomes}:{effects:records(key,false,'The upward flick lifted neither edge. Try a motion that guides the edge you mean to tip.')}),
    },[heldWand,{not:boardAloft,reason:'Set the board down before trying a new cast.'},...parameters]);
});
const writtenRecipes = variants.flatMap(({delivery,stroke,aim})=>{
    if(aim==='tilt'&&stroke==='standard')return [];
    const key=[delivery,stroke,aim].join('.');
    const settings={delivery,stroke,aim};
    const parameters=Object.entries(settings).map(([axis,value])=>selected(axis,value));
    const {proven,recorded,write}=testedSpellRevision(HP_SPELL_PRACTICE,key,key,techniqueText(settings));
    return [
        benchAction({
            id:HP_SPELL_PRACTICE+'.write.'+key,label:'Write up the successful draft',once:true,
            description:techniqueText(settings),visibleWhen:{all:[...parameters,proven]},
            effects:[write],
        },[...parameters,proven]),
        benchAction({
            id:HP_SPELL_PRACTICE+'.recall.'+key,
            label:'Recall '+(delivery==='spoken'?'spoken':'silent')+' '+(stroke==='guided'?'guided':'standard')+' '+(aim==='tilt'?'tilt':'lift'),
            visibleWhen:{all:[recorded,{not:{all:parameters}}]},
            effects:Object.entries(settings).map(([axis,value])=>draftEffect(axis,value)),
        },[recorded]),
    ];
});
hpLeadBenchCommands.push(
    benchAction({
        id:HP_SPELL_PRACTICE+'.start_draft',label:'Start a Levitation draft',once:true,
        description:'Change how you say the words, how you move the wand, or what you want the board to do.',
        effects:[draftEffect('delivery','spoken'),draftEffect('stroke','standard'),draftEffect('aim','raise')],
    },[heldWand]),
    ...benchEdits,
    ...labTrials,
    ...writtenRecipes,
    benchAction({
        id:HP_SPELL_PRACTICE+'.inspect_edge',label:'Read the mark on the raised edge',once:true,
        effects:[{type:'knowledge',key:HP_SPELL_PRACTICE+'.edge_mark',stage:'understood',value:'The mark identifies which edge was meant to face the reader.'}],
    },[boardAloft,{fact:'world.'+ANGLE,op:'eq',value:true,reason:'Tilt the raised board to bring its edge into view.'}]),
);

function labTrialFacts(state) {
    const mastery=state.simulation?.powers?.player?.[HP_LEVITATION]?.mastery??0;
    const base=spellCastFacts(state,benchSpells,{chanceFact:benchChanceFact,powerOf:()=>HP_LEVITATION})[benchChanceFact(benchCast.id)];
    return Object.fromEntries(variants.map(({delivery,stroke,aim})=>[
        HP_SPELL_PRACTICE+'.trial.'+[delivery,stroke,aim].join('.')+'.chance',
        delivery==='mental'?(mastery<fluency?1:Math.min(1,base+0.2)):base,
    ]));
}
export function hpLeadTrialJournal(state) {
    return readSpellTrials(HP_SPELL_PRACTICE,state.simulation?.knowledge?.player).map(({method,text})=>{
        if(method==='accio.weight')return 'Accio. '+text;
        const [delivery,stroke,aim]=method.split('.');
        return techniqueText({delivery,stroke,aim})+' '+text;
    });
}

// Accio is a separate taught method. The board is a physical obstruction in
// this setup. Lifting it opens a path but does not fetch the weight by itself.
const ACCIO = HP_SPELL_PRACTICE+'.accio';
const knowsAccio = {fact:'knowledge.'+ACCIO+'.understood',op:'eq',value:true,reason:'Study the Summoning Charm first.'};
const pathBlocked = HP_SPELL_PRACTICE+'.summoning_path_blocked';
hpLeadBenchCommands.push(
    benchAction({
        id:ACCIO+'.study',label:'Study the Summoning Charm',once:true,
        description:'Read the separate charm for drawing an object toward you.',
        effects:[{type:'knowledge',key:ACCIO,stage:'understood',value:'Accio draws a chosen loose object toward the caster. For the bench exercise, keep a clear path to the weight.'}],
    },[heldWand]),
    benchAction({
        id:ACCIO+'.step_back',label:'Step back to the rail',visibleWhen:{all:[knowsAccio,atDesk]},
        description:'From the rail, the weight is too far to reach by hand.',
        effects:[stanceEffect(true)],
    },[heldWand,knowsAccio,atDesk]),
    benchAction({
        id:ACCIO+'.return_to_desk',label:'Return to the desk',visibleWhen:atRail,effects:[stanceEffect(false)],
    },[atRail]),
    benchAction({
        id:ACCIO+'.summon_weight',label:'Summon the brass weight',visibleWhen:atRail,
        description:'Say Accio and call the weight to your hand.',
        costs:[{type:'vital',key:'stamina',amount:-1}],
        outcomes:[
            {id:'arrived',weight:{fact:pathBlocked,scale:-1,add:1},effects:[...takeWeightEffects,
                spellTrialObservation(HP_SPELL_PRACTICE,'accio.weight',true,'The weight flew through the gap and into your hand.'),
                boardNote('The weight flew through the gap and into your hand.')]},
            {id:'blocked',weight:{fact:pathBlocked},effects:[
                spellTrialObservation(HP_SPELL_PRACTICE,'accio.weight',false,'The weight clicked against the board and stayed where it was.'),
                boardNote('The weight clicked against the board and stayed where it was.')]},
        ],
    },[heldWand,knowsAccio,atRail,weightAvailable]),
);

export function hpLeadPracticeExtension(base) {
    return {
        schema: 1, id: HP_SPELL_PRACTICE, revision: 1,
        base: {id: base.id, revision: base.revision, contentHash: base.contentHash},
        label: 'Charms practice bench',
        description: 'Try the Levitation Charm on a practice board after your first lesson.',
        requires: learned, reason: 'Learn the Levitation Charm in Charms first.',
        items: [practiceWand, brassWeight].map(({name, ...item}) => ({...item, label: name})),
        commands: hpLeadBenchCommands,
    };
}
