import {spellDictionary} from './spell_dictionary.js';
import {compileSpellWorking,nativeSpellSteps} from './spell_working.js';

const key = world => 'spellbook.'+world+'.workings';
const stepsShape = steps => Array.isArray(steps)&&steps.every(step=>step&&typeof step.method==='string'&&
    Number.isInteger(step.revision)&&step.bindings&&typeof step.bindings==='object'&&!Array.isArray(step.bindings));
const read = (state, world) => {
    const saved=state.actors.player.facts[key(world)];
    if(saved===undefined)return {schema:1,draft:[],records:[],trial:null};
    if(typeof saved!=='string')return null;
    let book;
    try{book=JSON.parse(saved);}catch{return null;}
    if(!book||(book.schema??1)!==1||!stepsShape(book.draft)||!Array.isArray(book.records)||
        !book.records.every(record=>record&&stepsShape(record.steps)&&Number.isFinite(record.testedAt)))return null;
    const trial=book.trial;
    if(trial!==null&&(!trial||!Number.isInteger(trial.next)||!Number.isInteger(trial.length)||trial.next<1||trial.next>trial.length||
        (trial.receipt ? typeof trial.receipt.id!=='string'||typeof trial.receipt.cause!=='string'||!Number.isInteger(trial.receipt.completed) :
            !['ready','worked','failed','interrupted'].includes(trial.status))))return null;
    return {...book,schema:1};
};
const compile = (draft,rules) => nativeSpellSteps(compileSpellWorking(draft,spellDictionary,rules),rules);

function result(state,rules,trial) {
    if(!trial?.receipt) return trial?.status;
    const {id,cause,completed} = trial.receipt;
    if(state.simulation?.jobs.some(job=>job.id===cause)) return 'pending';
    if((state.actors.player.completed[id]??0)!==completed) return 'interrupted';
    return rules.worked(state,id,cause) ? trial.next===trial.length ? 'worked' : 'ready' : 'failed';
}

export function readSpellbookWorkings(state,rules) {
    const book=read(state,rules.world);
    if(!book)return {draft:[],records:[],trial:null,error:'This spellbook entry could not be read.'};
    return {...book,status:result(state,rules,book.trial)};
}

export function quoteSpellbookStep(book,rules,preview) {
    if(!book.draft.length||book.status==='pending')return null;
    const index=book.status==='ready'?book.trial.next:0;
    try{return preview(compile(book.draft,rules)[index].command);}
    catch(error){return {eligible:false,reasons:[error.message],costs:[],duration:0};}
}

export function settleSpellbookReceipt(state,rules) {
    const facts=state.actors.player.facts;
    if(!facts[key(rules.world)])return;
    const book=read(state,rules.world);
    if(!book?.trial?.receipt)return;
    const status=result(state,rules,book.trial);
    if(status==='pending')return;
    const {next,length}=book.trial;
    book.trial={next,length,status};
    facts[key(rules.world)]=JSON.stringify(book);
}

export function spellbookMethods(rules) {
    return spellDictionary.filter(entry=>entry.world===rules.world).map(entry=>({
        ...entry, roles:entry.roles.map(role=>({...role, targets:Object.entries(rules.targets)
            .filter(([id])=>rules.target(id).type===role.type).map(([id,label])=>({id,label}))})),
    }));
}

export function commitSpellbookWorking(state,rules,request,{edit,cast}) {
    const book=read(state,rules.world);
    if(!book)throw Error('This spellbook entry could not be read.');
    const status=result(state,rules,book.trial);
    if(status==='pending') throw Error('Wait for the current spell to finish.');
    let plan;
    switch(request.action){
        case 'append': {
            const {method,revision,bindings}=request.step;
            const entry=spellDictionary.find(row=>row.id===method&&row.revision===revision&&row.world===rules.world);
            if(!entry) throw Error('Choose a method in this spellbook.');
            const step={method,revision,bindings:Object.fromEntries(entry.roles.map(({name})=>[name,bindings?.[name]]))};
            compile([step],rules);
            book.draft.push(step);
            book.trial=null;
            break;
        }
        case 'remove':
            if(!Number.isInteger(request.index)||!book.draft[request.index]) throw Error('Choose a step in your draft.');
            book.draft.splice(request.index,1);
            book.trial=null;
            break;
        case 'move-earlier': {
            const {index}=request;
            if(!Number.isInteger(index)||index<1||!book.draft[index]) throw Error('Choose a step that can move earlier.');
            const [step]=book.draft.splice(index,1);
            book.draft.splice(index-1,0,step);
            book.trial=null;
            break;
        }
        case 'record': {
            if(status!=='worked') throw Error('Finish a successful trial before writing the working.');
            if(!book.records.some(record=>JSON.stringify(record.steps)===JSON.stringify(book.draft))){
                book.records.push({steps:structuredClone(book.draft),testedAt:state.clock});
            }
            break;
        }
        case 'recall': {
            const record=Number.isInteger(request.index)&&book.records[request.index];
            if(!record) throw Error('Choose a written working to recall.');
            book.draft=structuredClone(record.steps);
            book.trial=null;
            break;
        }
        case 'test':
        case 'continue': {
            if(request.action==='continue'&&status!=='ready') throw Error('There is no working ready to continue.');
            const steps=compile(book.draft,rules);
            const index=request.action==='test'?0:book.trial.next;
            const {command}=steps[index];
            const completed=(state.actors.player.completed[command.id]??0)+1;
            plan=cast(command);
            const cause=plan.commitment?.id??'simulation:'+plan.state.sequence;
            book.trial={next:index+1,length:steps.length,receipt:{id:command.id,cause,completed}};
            if(!plan.commitment) book.trial={next:index+1,length:steps.length,status:result(plan.state,rules,book.trial)};
            break;
        }
        default: throw Error('Choose a spellbook action.');
    }
    plan??=edit();
    plan.state.actors.player.facts[key(rules.world)]=JSON.stringify(book);
    return plan;
}
