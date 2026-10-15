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
const evidence = eq('lp2.evidence',true,'Finish one hand-work timber job and watch the lever demonstration, in either order.');
const returned = eq('lp2.returned',true,'Return both assignment records to the craftsman before explaining the rule and practicing.');
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
    situations:[{id:scene,revision:2,label:'Village lever-setting lesson',context:{worldId:'base.frontier',instanceId:'frontier.main',continuityId:'frontier.branch',eraId:'frontier.present',regionId:'frontier.village'},
        initialPhase:'demonstrated',phases:['demonstrated','explained','learned'],privateTruth:{ordinaryTimber:true},participants:['player','oldCraftsman']}],
    powers:[{id:LEVER,revision:1,label:'Lever-setting',model:'practice',capacity:1,execution:all(body,learned)}],
    commands:[
        command({id:'field.lp1.hand',label:'Free wedged timber by hand · 1 log + 3 stamina · 6 min',duration:6,cancellation:'refund',
            requires:all(location,body),completionRequires:all(location,body),completionFailure:'refund',
            costs:[item(-1),stamina(-3)],effects:[{type:'item',key:LEVER_KIT,amount:1}],
            description:'Known task: free and sort your wedged timber into one Prepared survey kit. Hand work takes six minutes. Each new supplied log allows another job.'}),
        command({id:'field.lp1.demonstrate',revision:2,label:'Ask the craftsman to demonstrate lever-setting',once:true,...contact,requires:all(location,body,teacher),
            effects:[{type:'situation',situationId:scene,operation:'begin'},know('demonstration','seen','In Village, the old craftsman demonstrates a pivot beside the wedged timber: brace the near end, then lift the far end. He offers instruction when willing and available.')],
            description:'A free safe demonstration, with the craftsman present. Watching alone grants no usable method. Assignment evidence: finish a hand-work timber job and watch this demonstration, in either order. Then return both records to the craftsman.'}),
        command({id:'field.lp1.return',label:'Return the hand-work and demonstration records to the craftsman',once:true,...contact,
            requires:all(location,body,teacher,evidence),
            effects:[know('returned','seen','The craftsman checked your completed hand-work timber job and lever demonstration. Both assignment records are accepted. Explain the pivot rule, then complete paid supervised practice to learn the method.')],
            description:'Both known evidence steps can be done in either order. Returning them grants no method, kit, money or practice credit.'}),
        command({id:'field.lp1.explain',revision:2,label:'Explain the rule: brace near the pivot, lift the far end',once:true,...contact,
            visibleWhen:all(known,eq('knowledge.field.lp1.demonstration.seen')),requires:all(location,body,teacher,eq('knowledge.field.lp1.demonstration.seen'),returned),
            effects:[{type:'situation',situationId:scene,operation:'advance',expected:['demonstrated'],phase:'explained'},know('rule','understood','The old craftsman checked your explanation in Village: the brace stays near the pivot, your hands lift the far end, and you stop if the timber slips. Paid supported practice is still needed.')]}),
        command({id:'field.lp1.practice',revision:2,label:'Practice lever-setting with the craftsman · 1 coin + 1 stamina · 3 min',once:true,...contact,duration:3,cancellation:'refund',reservationReturns:1,
            visibleWhen:all(known,eq('knowledge.field.lp1.rule.seen')),requires:all(location,body,teacher,rule,returned),
            completionRequires:all(location,body,teacher,rule,returned),completionCoLocated:true,completionFailure:'refund',
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
    const orders=state.actors.oldCraftsman?.facts || {};
    const b=context.nativeBody || p?.body || {hands:2,mobile:true};
    const tender=bodyFacts(state)['body.handsTender'];
    const inventory=context.gameplay?.player?.inventory || {}, record=leverTaskRecord(state);
    return {'lp1.body':p?.life==='alive' && b.hands>=2 && b.mobile===true && !tender,
        'lp1.teacher':t?.life==='alive' && t.location==='Village' && (t.body?.hands??2)>=2 && t.body?.mobile!==false && !orders['work.order'] && !orders['field.partsOrder'],
        'lp1.tool':(inventory[LEVER_WOOD]||0)>=2,
        'lp2.evidence':record.evidenceComplete,
        'lp2.returned':record.returnAccepted};
}
// Read-only projection. LP1 receipts remain authoritative; loading creates no state.
export function leverTaskRecord(state) {
    const k=state.simulation?.knowledge?.player || {}, c=state.actors.player.completed;
    const hand=(c['field.lp1.hand']||0)>0, demonstration=!!k['field.lp1.demonstration'];
    const legacy=demonstration && state.simulation?.situations?.[scene]?.revision===1;
    const learned=k['field.lp1.method']?.stage==='understood';
    const pending=state.simulation?.jobs.find(j=>j.actorId==='player' && j.commandId==='field.lp1.practice');
    const returnAccepted=!!k['field.lp1.returned'] || legacy;
    const ruleChecked=k['field.lp1.rule']?.stage==='understood';
    const next=learned ? 'Use the learned method with your body and a spare log lever.'
        : pending ? 'Finish the reserved supervised practice; no method is granted while it is pending.'
        : !legacy && (!hand || !demonstration) ? `Missing evidence: ${[!hand && 'finish one hand-work timber job',!demonstration && 'watch the lever demonstration'].filter(Boolean).join('; ')}. Either order is allowed.`
        : !returnAccepted ? returned.reason : !ruleChecked ? 'Explain the displayed pivot rule to the craftsman.'
        : 'Complete three played minutes of supervised practice, spending one coin and one stamina.';
    return {hand,demonstration,legacy,evidenceComplete:hand && demonstration,returnAccepted,ruleChecked,learned,
        practice:learned ? 'completed' : pending ? `in progress (${pending.due-state.clock} min remaining)` : 'not started',next,
        text:`Assignment evidence: hand-work ${hand ? 'recorded' : 'missing'}; demonstration ${demonstration ? 'recorded' : 'missing'}. Teacher return: ${legacy ? 'existing LP1 instruction retained' : returnAccepted ? 'accepted' : 'not returned'}. Pivot rule: ${ruleChecked ? 'checked' : 'not checked'}. Practice: ${learned ? 'completed' : pending ? 'in progress' : 'not started'}. Method: ${learned ? 'learned' : 'not learned'}. ${next}`};
}
// Report only missing known conditions; the scheduler still owns eligibility.
export function leverBlockers(state,context,id) {
    const facts=leverFacts(state,context), reasons=[];
    const knowledge=state.simulation?.knowledge.player || {}, record=leverTaskRecord(state);
    if(id==='field.lp1.return' && !record.evidenceComplete) reasons.push(record.next);
    if(['field.lp1.explain','field.lp1.practice'].includes(id) && !record.returnAccepted) reasons.push(returned.reason);
    if(context.facts?.location!=='Village') reasons.push(location.reason);
    if(!facts['lp1.body']) reasons.push(body.reason);
    if(id==='field.lp1.lever_work') {
        if(knowledge['field.lp1.method']?.stage!=='understood') reasons.push(learned.reason);
        if(!facts['lp1.tool']) reasons.push(tool.reason);
    } else if(id!=='field.lp1.hand') {
        if(state.actors.oldCraftsman?.facts['work.order'] || state.actors.oldCraftsman?.facts['field.partsOrder']) reasons.push('Commission override: the craftsman is finishing a supplied bench order. Return when it ends, during daily hours.');
        else if(!facts['lp1.teacher']) reasons.push('The craftsman needs usable hands and must be here in Village.');
        if(context.facts?.['village.craftsmanIrritated']) reasons.push('Let the craftsman settle before asking for instruction.');
        if(!context.facts?.['village.teacherHours']) reasons.push('The craftsman teaches between 08:00 and 18:00.');
    }
    return reasons;
}
