// LP1 original proposal. Existing field UI and simulation scheduler own all work.
import {bodyFacts} from './body_progression.js';
export const LEVER = 'field.lp1.lever';
export const LEVER_WOOD = JSON.stringify({id:'Rough wood log'});
export const LEVER_KIT = JSON.stringify({id:'Prepared survey kit'});
const scene = 'field.lp1.lesson';
const eq = (fact,value=true,reason) => ({fact,op:'eq',value,...(reason?{reason}:{})});
const all = (...rules) => ({all:rules,reason:rules.map(r=>r.reason).filter(Boolean).join(' ')});
const known = eq('actor.field.introduced');
const body = eq('lp1.body',true,'Lever work needs two usable hands and a mobile body. Let tender hands recover or use a supported body.');
const location = eq('location','Village','Return to the Village timber stack.');
const teacher = all(eq('village.craftsmanMet'),eq('target.life','alive'),eq('village.craftsmanIrritated',false,'Let the craftsman settle before asking for instruction.'),
    eq('village.teacherHours',true,'The craftsman teaches between 08:00 and 18:00.'),eq('lp1.teacher',true,'The craftsman needs usable hands and must be here in Village.'));
const contact = {targetId:'oldCraftsman',coLocated:true,participants:['$actor','$target']};
const rule = eq('knowledge.field.lp1.rule.understood',true,'Watch the demonstration, then explain the pivot rule.');
const learned = eq('knowledge.field.lp1.method.understood',true,'Complete the lever-setting practice with the craftsman first.');
const tool = eq('lp1.tool',true,'Carry a second Rough wood log as your lever, alongside the log being worked. The lever is held during work and returned.');
const item = (amount,reservationReturn=false) => ({type:'item',key:LEVER_WOOD,amount,...(reservationReturn?{reservationReturn:true}:{})});
const stamina = amount => ({type:'vital',key:'stamina',amount});
const know = (key,stage,value) => ({type:'knowledge',key:`field.lp1.${key}`,stage,value,
    basis:{kind:'instruction',attributedTo:'oldCraftsman',situationId:scene}});
const command = d => ({revision:1,worldId:'base.frontier',actorId:'player',group:'field',uiSection:'lever',location:'Village',
    visibleWhen:known,costs:[],effects:[],...d});
const support = all(location,body,learned);
export const leverDefinitions = {
    situations:[{id:scene,revision:1,label:'Village lever-setting lesson',context:{worldId:'base.frontier',instanceId:'frontier.main',continuityId:'frontier.branch',eraId:'frontier.present',regionId:'frontier.village'},
        initialPhase:'demonstrated',phases:['demonstrated','explained','learned'],privateTruth:{ordinaryTimber:true},participants:['player','oldCraftsman']}],
    powers:[{id:LEVER,revision:1,label:'Lever-setting',model:'practice',capacity:1,execution:all(body,learned)}],
    commands:[
        command({id:'field.lp1.hand',label:'Free wedged timber by hand · 1 log + 3 stamina · 6 min',duration:6,cancellation:'refund',
            requires:all(location,body),completionRequires:all(location,body),completionFailure:'refund',
            costs:[item(-1),stamina(-3)],effects:[{type:'item',key:LEVER_KIT,amount:1}],
            description:'Known task: free and sort your wedged timber into one Prepared survey kit. Hand work takes six minutes. Each new supplied log allows another job.'}),
        command({id:'field.lp1.demonstrate',label:'Ask the craftsman to demonstrate lever-setting',once:true,...contact,requires:all(location,body,teacher),
            effects:[{type:'situation',situationId:scene,operation:'begin'},know('demonstration','seen','In Village, the old craftsman demonstrates a pivot beside the wedged timber: brace the near end, then lift the far end. He offers instruction when willing and available.')],
            description:'A free safe demonstration, with the craftsman present. Watching alone grants no usable method.'}),
        command({id:'field.lp1.explain',label:'Explain the rule: brace near the pivot, lift the far end',once:true,...contact,
            visibleWhen:all(known,eq('knowledge.field.lp1.demonstration.seen')),requires:all(location,body,teacher,eq('knowledge.field.lp1.demonstration.seen')),
            effects:[{type:'situation',situationId:scene,operation:'advance',expected:['demonstrated'],phase:'explained'},know('rule','understood','The old craftsman checked your explanation in Village: the brace stays near the pivot, your hands lift the far end, and you stop if the timber slips. Paid supported practice is still needed.')]}),
        command({id:'field.lp1.practice',label:'Practice lever-setting with the craftsman · 1 coin + 1 stamina · 3 min',once:true,...contact,duration:3,cancellation:'refund',reservationReturns:1,
            visibleWhen:all(known,eq('knowledge.field.lp1.rule.seen')),requires:all(location,body,teacher,rule),
            completionRequires:all(location,body,teacher,rule),completionCoLocated:true,completionFailure:'refund',
            costs:[{type:'resource',native:true,key:'money',amount:-1},stamina(-1)],
            effects:[{type:'power',powerId:LEVER,operation:'learn'},{type:'situation',situationId:scene,operation:'advance',expected:['explained'],phase:'learned'},
                know('method','understood','The old craftsman taught you lever-setting in Village after your pivot explanation and three minutes of supervised practice. You spent one coin and one stamina. You can now free timber with a spare log as a lever; actual hands and the held tool remain required.')],
            description:'Untimed choice, then three played minutes of supervised practice. Teacher attention is reserved. Cancellation or lost support refunds costs and teaches nothing.'}),
        command({id:'field.lp1.lever_work',label:'Free wedged timber with lever-setting · 1 log + spare log lever + 1 stamina · 2 min',duration:2,cancellation:'refund',reservationReturns:1,automatable:true,powerId:LEVER,
            requires:all(support,tool),completionRequires:support,completionFailure:'refund',costs:[item(-2),stamina(-1)],
            effects:[item(1,true),{type:'item',key:LEVER_KIT,amount:1}],
            description:'Same known task, one kit. Reserve two actual carried logs: one becomes the kit, the other stays held as the lever and returns. Two minutes and one stamina. Each idle repeat checks support and reserves fresh inputs.'})
    ]
};
export function leverFacts(state,context={}) {
    const s=state.simulation, p=s?.people?.player, t=s?.people?.oldCraftsman;
    const b=context.nativeBody || p?.body || {hands:2,mobile:true};
    const tender=bodyFacts(state)['body.handsTender'];
    const inventory=context.gameplay?.player?.inventory || {};
    return {'lp1.body':p?.life==='alive' && b.hands>=2 && b.mobile===true && !tender,
        'lp1.teacher':t?.life==='alive' && t.location==='Village' && (t.body?.hands??2)>=2 && t.body?.mobile!==false,
        'lp1.tool':(inventory[LEVER_WOOD]||0)>=2};
}
// Report only missing known conditions; the scheduler still owns eligibility.
export function leverBlockers(state,context,id) {
    const facts=leverFacts(state,context), reasons=[];
    const knowledge=state.simulation?.knowledge.player || {};
    if(context.facts?.location!=='Village') reasons.push(location.reason);
    if(!facts['lp1.body']) reasons.push(body.reason);
    if(id==='field.lp1.lever_work') {
        if(knowledge['field.lp1.method']?.stage!=='understood') reasons.push(learned.reason);
        if(!facts['lp1.tool']) reasons.push(tool.reason);
    } else if(id!=='field.lp1.hand') {
        if(!facts['lp1.teacher']) reasons.push('The craftsman needs usable hands and must be here in Village.');
        if(context.facts?.['village.craftsmanIrritated']) reasons.push('Let the craftsman settle before asking for instruction.');
        if(!context.facts?.['village.teacherHours']) reasons.push('The craftsman teaches between 08:00 and 18:00.');
    }
    return reasons;
}
