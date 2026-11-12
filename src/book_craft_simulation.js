// Hogwarts uses the ordinary repair cast's body, wand, practice and stamina
// checks. Only the material debit and result are supplied by the working.
import {bookCraftWorkshops,cyoriaCraftTerms,quoteBookCraftWorking,readBookCraftVocabulary} from './book_craft_workings.js';
import {createCraftState,learnCraftWorking,readCraftWorking,recordWorkingTrial} from './craft_state.js';
import {commitSimulationCommand,previewSimulationCommand} from './simulation.js';

const school='book.hp.school.world';
const repair='book.hp.school.cast_repair_glass';

export function readSchoolCraftControls(state,context,craftState,actions,nameItem) {
    const world=state.actors.player.worldId;
    if(world!==school)return null;
    const action=actions?.find(row=>row.id===repair);
    if(!action)return null;
    return readControls(state,context,craftState,action,nameItem);
}

function readControls(state,context,craftState,action,nameItem) {
    const world=state.actors.player.worldId;
    const vocabulary=readBookCraftVocabulary({world,location:context.facts.location,
        inventory:context.gameplay.player.inventory});
    if(!vocabulary)return null;
    const saved=Object.keys(craftState?.recipes??{}).map(id=>readCraftWorking(craftState,id,'player'))
        .filter(method=>method?.world===world&&method.law===vocabulary.law);
    return {...vocabulary,world,id:`maker.${world===school?'school':'cyoria'}-${state.sequence}`,eligible:action.eligible,reasons:action.reasons,
        stock:vocabulary.stock.map(row=>({...row,label:nameItem(row.key)})),saved};
}

export function stageSchoolCraftTrial({state,registry,context,craftState,working,lots,learn=false}) {
    const world=state.actors.player.worldId;
    if(world!==school||context.actorId!=='player')throw Error('Return to the school study room.');
    const {law,result:outcome}=bookCraftWorkshops[school];
    if(working.law!==law.ref)throw Error('This repair exercise cannot yet keep that kind of pane.');
    const result=quoteBookCraftWorking(working,{world,location:context.facts.location,
        inventory:context.gameplay.player.inventory},lots);
    const product=result.batch.product;
    const success=(product.outputs[outcome.route]?.[outcome.effect]??0)>0;
    const template=registry.simulation.commands.get(repair);
    if(!template||template.duration||template.once||template.claim||template.outcomes)
        throw Error('The current school repair exercise is unavailable.');
    const materials=result.consumed.map(({key,qty})=>({type:'item',key,amount:-qty}));
    const costs=[...template.costs.filter(cost=>cost.type!=='item'),...materials];
    const effects=success?[{type:'item',key:outcome.key,amount:1}]:[];
    const commands=new Map(registry.simulation.commands);
    commands.set(repair,{...template,costs,effects,label:'Try the glass working'});
    const localRegistry={...registry,simulation:{...registry.simulation,commands}};
    const plan=commitSimulationCommand(state,localRegistry,{id:repair},context,state.sequence);
    const witnessed=success?[{route:outcome.route,effect:outcome.effect}]:[];
    let next=recordWorkingTrial(craftState??createCraftState({world:'base.frontier'}),product,
        {observer:'player',at:plan.state.clock,effects:witnessed});
    if(success&&learn)next=learnCraftWorking(next,law,result.working,{observer:'player',product:product.id,...witnessed[0]});
    return {plan,craftState:next,success,learned:success&&learn};
}

const cyoria='book.mol.cyoria';
const assembly='book.mol.assemble_lamp';

function withCommand(registry,definition) {
    const commands=new Map(registry.simulation.commands);
    commands.set(definition.id,definition);
    return {...registry,simulation:{...registry.simulation,commands}};
}

export function readCyoriaCraftControls(state,registry,context,craftState,nameItem) {
    if(state.actors.player.worldId!==cyoria||context.facts.location!==bookCraftWorkshops[cyoria].location)return null;
    const template=registry.simulation.commands.get(assembly);
    if(!template)return null;
    // Read current support and costs before the player chooses an outcome-bearing sequence.
    const preview=previewSimulationCommand(state,withCommand(registry,{...template,once:false,claim:undefined,effects:[]}),assembly,
        {...context,targetId:template.targetId});
    if(!preview.visible)return null;
    const view=readControls(state,context,craftState,preview,nameItem);
    const job=state.simulation.jobs.find(row=>row.bookCraft&&row.commandId===assembly);
    const {law,result}=bookCraftWorkshops[cyoria];
    const observations=Object.entries(craftState?.knowledge.player??{}).filter(([id])=>craftState.products[id]?.law===law.ref);
    const latest=observations.reduce((last,[,row])=>!last||row.lastAt>last.lastAt?row:last,null);
    const outcome=latest?.facts.includes(`effect:${result.route}.${result.effect}`);
    return {...view,timed:true,remaining:job?job.due-state.clock:null,
        last:latest?(outcome?'The trace held. Nora finished a lamp. The trial added no charge.':'The trace failed to hold. The stone and ink were spent.'):''};
}

function stageCyoriaCraftTrial({state,registry,context,craftState,working,lots,learn=false}) {
    const world=state.actors.player.worldId;
    if(world!==cyoria||context.actorId!=='player')throw Error('Return to Nora’s workshop.');
    const template=registry.simulation.commands.get(assembly);
    if(!template?.duration||!template.claim||template.outcomes||
        context.facts.location!==template.location)throw Error('Nora’s reconstruction is unavailable.');
    const draft={schema:1,working,lots,learn};
    const {definition,quote,success}=cyoriaCraftTerms(template,draft,state.simulation.claims,
        context.gameplay.player.inventory);
    const localRegistry=withCommand(registry,definition);
    const plan=commitSimulationCommand(state,localRegistry,{id:assembly},
        {...context,targetId:template.targetId},state.sequence);
    const trial={...draft,working:quote.working,lots:structuredClone(lots)};
    if(success&&learn)rememberCyoriaTrial(trial,quote.batch.product,craftState,plan.commitment.due,true);
    plan.state.simulation.jobs.find(job=>job.id===plan.commitment.id).bookCraft=trial;
    plan.commitment.bookCraft=trial;
    return {plan,craftState,pending:true};
}

export function stageBookCraftTrial(args) {
    return args.state.actors.player.worldId===cyoria?stageCyoriaCraftTrial(args):stageSchoolCraftTrial(args);
}

export function settleFinishedBookCraft(before,after,craftState) {
    const job=before.simulation?.jobs.find(row=>row.commandId===assembly&&row.bookCraft);
    if(!job||after.simulation?.jobs.some(row=>row.id===job.id))return null;
    if((after.actors.player.completed[assembly]??0)!==(before.actors.player.completed[assembly]??0)+1)
        return null;
    const {working,lots}=job.bookCraft;
    const {location,result}=bookCraftWorkshops[cyoria];
    const inventory={};
    for(const {key,qty} of lots)inventory[key]=(inventory[key]??0)+qty;
    const {batch:{product}}=quoteBookCraftWorking(working,{world:cyoria,location,inventory},lots);
    const success=(product.outputs[result.route]?.[result.effect]??0)>0;
    return rememberCyoriaTrial(job.bookCraft,product,craftState,job.due,success);
}

function rememberCyoriaTrial({working,learn},product,craftState,at,success) {
    const {law,result}=bookCraftWorkshops[cyoria];
    const effects=success?[{route:result.route,effect:result.effect}]:[];
    let next=recordWorkingTrial(craftState??createCraftState({world:'base.frontier'}),product,
        {observer:'player',at,effects});
    if(success&&learn)next=learnCraftWorking(next,law,working,{observer:'player',product:product.id,...effects[0]});
    return next;
}
