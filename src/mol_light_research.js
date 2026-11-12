import {spellTrialObservation,witnessedSpellTrial,testedSpellRevision} from './spell_trial_evidence.js';
import {bindMethod} from './method_program.js';
// Chapter 2 contrasts Torch with directly shaped light. Chapter 11 explains
// formula boundaries, and chapter 46 shows overload destabilizing a boundary.
// The exercise, numerical budgets and oblique-light formula are YAIR proposals.
import {MOL_IDS, MOL_LOCATIONS} from './book_world_mol_ids.js';

export const MOL_LIGHT_PREFIX = 'book.mol.zorian.light';
const PREFIX = MOL_LIGHT_PREFIX;
const id = key => PREFIX + '.' + key;
const eq = (fact,value=true,reason) => ({fact,op:'eq',value,...(reason?{reason}:{})});
const remembered = (key,reason) => eq('knowledge.'+id(key)+'.understood',true,reason);
const seat = {all: ['mol.nativeBound','mol.playerSupported','mol.zorianSeat','mol.local.'+MOL_IDS.world].map(key=>eq(key))};
const atBench = eq('actor.location',MOL_LOCATIONS.court);
const note = (key,value) => ({type:'knowledge',key:id(key),stage:'understood',value});
const light = (key,duration) => ({type:'condition',id:id(key),operation:'apply',duration});
const extinguish = key => ({type:'condition',id:id(key),operation:'remove'});
const mana = output => ({type:'energy',energyId:'book.mol.zorian.reserve',operation:'use',output,control:1});

const methods = {
    torch: {label:'Cast the Torch invocation',technique:'torch_formula',boundary:2,output:1,shape:'diffuse',duration:6},
    shaped: {label:'Shape light directly',technique:'shaping_control',output:1,shape:'diffuse',duration:2},
    overload: {label:'Try feeding extra mana into Torch',technique:'torch_formula',boundary:2,output:3,shape:'diffuse',duration:6},
    oblique: {label:'Try the oblique-light formula',technique:'oblique_formula',boundary:2,output:1,shape:'oblique',duration:4},
};
const shapes = ['diffuse','oblique'];
export const molLightConditions = shapes.map(shape=>({
    id:id(shape),revision:1,label:shape==='diffuse'?'Diffuse light':'Oblique light',stacking:'max',
}));

function command(key,label,description,requirements,effects,{costs=[],once=false,duration=0,show=[]}={}) {
    const requires={all:[seat,atBench,...requirements]};
    return {
        id:id(key),revision:1,label,description,group:'book_mol',actorId:'player',
        worldId:MOL_IDS.world,location:MOL_LOCATIONS.court,visibleWhen:{all:[eq('mol.zorianSeat'),atBench,...show]},
        requires,effects,costs,once,duration,
        ...(duration?{completionRequires:requires,completionFailure:'refund',cancellation:'refund',reservationReturns:1,completionCoLocated:true}:{}),
    };
}

function castingCommand(key,method,{requirements=[],show=[],description:customDescription}={}) {
    const underfed = method.output < (method.minimum??1);
    const success = !underfed && (method.boundary == null || method.output <= method.boundary);
    const observation = success ? (method.shape==='oblique'?'A low band of light ran across the practice slate.':'Light fell across the practice slate.') :
        underfed ? 'The mana spread too thin to hold the shape. It produced no new light.' :
        'The construct broke apart as you fed in more mana. It produced no new light.';
    const effects = [
        ...(success?[...shapes.map(extinguish),light(method.shape,method.duration)]:[]),
        spellTrialObservation(PREFIX,key,success,observation),
    ];
    const description = customDescription ?? (key==='shaped' ? 'Draw the light out by feel. It lasts two minutes.' :
        key==='overload' ? 'Keep the Torch invocation and try a larger draw of mana. Watch whether the light holds.' :
        key==='oblique' ? 'Speak the revised invocation and keep the light low across the slate. It lasts four minutes.' :
        'Use the structured invocation as taught. The light lasts six minutes.');
    return command(key,method.label,description,[remembered(method.technique,'Learn this method before trying it.'),...requirements],
        effects,{show,costs:Array.from({length:method.output},()=>mana(1)),once:false,duration:key==='shaped'?1:0});
}

// The published story leaves the laboratory parameters open. These local
// dials let a player trade the stability of a boundary against draw and shape.
const formulaAxes = {
    direction: {diffuse:'Spread the light',oblique:'Angle the light across the slate'},
    boundary: {plain:'Use the class boundary',braced:'Brace the boundary'},
    draw: {one:'Draw one measure',two:'Draw two measures',three:'Draw three measures'},
};
const axes = ['boundary', 'direction', 'draw'];
const kinds = ['unshaped formula', 'bounded formula', 'directed formula', 'ready light formula'];
const lightOperations = Object.fromEntries(axes.flatMap((axis, index) => Object.entries(formulaAxes[axis]).map(([value, label]) =>
    [`${axis}.${value}`, {label, input: kinds[index], output: kinds[index + 1], axis, value}])));
const lightBinding = {input: kinds[0], output: kinds.at(-1), limit: axes.length};
export const LIGHT_METHOD_EDITOR = {operations: lightOperations, ...lightBinding, command: {type: 'book_mol', id: id('compose_formula')}};
export function composedLightCommand(steps) {
    const [boundary, direction, draw] = bindMethod(steps, lightOperations, lightBinding);
    return id(`compose.${direction.value}.${boundary.value}.${draw.value}`);
}
export const isLightComposeDefinition = id => typeof id === 'string' && id.startsWith(PREFIX + '.compose.');
const draftKey = axis => id('draft.'+axis);
const draftChoice = (axis,value) => eq('actor.'+draftKey(axis),value);
const writeChoice = (axis,value) => ({type:'fact',scope:'actor',key:draftKey(axis),value});
const formulaStarted = eq(id('draft_exists'));
const variants = Object.keys(formulaAxes.direction).flatMap(direction=>Object.keys(formulaAxes.boundary).flatMap(boundary=>
    Object.keys(formulaAxes.draw).map(draw=>({direction,boundary,draw}))));
const drawCount = {one:1,two:2,three:3};

function deriveLightFormula({direction,boundary,draw}) {
    const output = drawCount[draw];
    const minimum = direction==='oblique' ? 2 : 1;
    const capacity = boundary==='braced' ? 3 : 2;
    return {label:'Test your light formula',technique:'oblique_formula',shape:direction,
        output,minimum,boundary:capacity,duration:2+output*2};
}

const formulaResearch = [
    command('start_formula','Start a light formula draft','Choose a direction, a boundary and a draw of mana.',
        [remembered('incisions','Read the shallow cuts on the slate first.')],
        [writeChoice('direction','diffuse'),writeChoice('boundary','plain'),writeChoice('draw','one')],{once:true}),
    ...Object.entries(formulaAxes).flatMap(([axis,choices])=>Object.entries(choices).map(([value,label])=>
        command('draft.'+axis+'.'+value,label,'Change this part of your formula.',[formulaStarted],[writeChoice(axis,value)],
            {show:[formulaStarted,{not:draftChoice(axis,value)}]}))),
    ...variants.flatMap(settings=>{
        const choices=Object.entries(settings);
        const parameters=choices.map(([axis,value])=>draftChoice(axis,value));
        const description=choices.map(([axis,value])=>formulaAxes[axis][value]).join('. ')+'.';
        const key=Object.values(settings).join('.');
        const trial='draft_cast.'+key,method=deriveLightFormula(settings);
        const cast=castingCommand(trial,method,{requirements:parameters,show:parameters,description});
        const compose=command('compose.'+key,'Set your composed light formula',description,[formulaStarted],
            choices.map(([axis,value])=>writeChoice(axis,value)),{show:[formulaStarted]});
        if(method.output<method.minimum||method.output>method.boundary)return [compose,cast];
        const {proven,recorded,write}=testedSpellRevision(PREFIX,trial,key,description);
        return [
            compose,cast,
            command('write_formula.'+key,'Record the tested formula',description,[...parameters,proven],[write],
                {once:true,show:[...parameters,proven]}),
            command('recall_formula.'+key,'Recall '+key.split('.').join(' ')+' formula',description,[recorded],
                choices.map(([axis,value])=>writeChoice(axis,value)),
                {show:[recorded,{any:[eq(id('draft_exists'),false),{not:{all:parameters}}]}]}),
        ];
    }),
    command('copy_cuts','Copy the shallow cuts','Keep the slate lit at a low angle for the five minutes it takes to copy the cuts.',
        [eq(id('raking'),true,'Bring light across the slate at a low angle.')],
        [note('cut_copy','You copied the incisions while the low light held across the slate.')],
        {duration:5,once:true,show:[formulaStarted]}),
];

const drill = eq('actor.book.mol.loop.s0.basic_three_drilled',true,'Practise the basic shaping exercises with Xvim first.');
export const molLightCommands = [
    command('study_torch','Study the Torch invocation','Work through the class example at the practice court. Takes ten minutes.',[],
        [note('torch_formula','The class invocation helps form a bounded construct that gives diffuse light.')],{duration:10}),
    command('review_shaping','Review your shaping control','Apply Xvim’s drill to making light directly. Takes five minutes.',[drill],
        [note('shaping_control','You can shape a little diffuse light directly by holding the mana steady.')],{duration:5}),
    ...Object.entries(methods).map(([key,method])=>castingCommand(key,method)),
    command('draft_oblique','Draft a low-angle light formula','Compare the two ways of producing light and revise where the invocation sends it. Takes fifteen minutes.',
        [witnessedSpellTrial(PREFIX,'torch',true,'Make the class invocation work first.'),
            witnessedSpellTrial(PREFIX,'shaped',true,'Produce light by shaping it directly first.')],
        [note('oblique_formula','You drew a narrow band low across the slate. The sketch gives you a formula to try, with the original Torch still available.')],{duration:15}),
    command('read_heading','Read the slate’s heading','Use light from either technique to read the broad lettering.',
        [eq(id('lit'),true,'Light the slate first.')],[note('heading','The broad heading names the academy practice exercise.')]),
    ...formulaResearch,
    command('read_cut','Read the shallow cuts','Use light raking across the slate to read the incised marks.',
        [eq(id('raking'),true,'Bring light across the slate at a low angle.')],
        [note('incisions','The cuts show a second set of instructions for changing the direction of the light.')]),
];
export function molLightFacts(state) {
    const active=shape=>{
        const effect=state.simulation?.conditions?.player?.[id(shape)];
        return effect!=null&&effect.expiresAt>state.clock;
    };
    const raking=active('oblique');
    const direction=state.actors?.player?.facts?.[draftKey('direction')];
    return {[id('lit')]:raking||active('diffuse'),[id('raking')]:raking,
        [id('draft_exists')]:Object.hasOwn(formulaAxes.direction,direction)};
}
