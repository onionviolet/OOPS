// Enrollment creates only controller appointments for already existing people.
// Scheduler, clock, reservations, NPC vitals and inventory keep their owners.
import {check, natural} from './basics.js';
import {BOOK_CARE_IDS as I, bookCareDefinitions as D} from './book_care_content.js';
const enrolled=state=>state.actors?.player?.facts?.[I.prefix+'enrolled']===true&&
    (state.actors.player.completed?.[I.hubBegin]||0)+(state.actors.player.completed?.[I.goaBegin]||0)===1;
export function bookCareControllerAllowed(state,definition) {
    if(!definition?.id?.startsWith(I.prefix))return true;
    const d=D.controllers.find(d=>d.id===definition.id);
    return !!d&&enrolled(state)&&definition.actorId===d.actorId&&definition.revision===d.revision&&definition.interval===d.interval;
}
export function validateBookCareControllerState(state,registry) {
    const s=state.simulation,rows=Object.entries(s?.controllers||{}).filter(([id,c])=>id.startsWith(I.prefix)||c.definitionId?.startsWith(I.prefix));
    if(!enrolled(state)){check(!rows.length,'Book-care controllers need explicit enrollment.');return true;}
    check(rows.length===D.controllers.length,'Missing exact book-care worker controller appointments.');
    for(const d of D.controllers) {
        const c=s.controllers[d.id],person=s.people[d.actorId],allowed=new Set(d.actions.map(a=>a.commandId));
        check(c&&c.actorId===d.actorId&&c.definitionId==null&&c.interval===d.interval&&natural(c.due)&&
            (c.due>=state.clock||person.life!=='alive')&&person.inventory==='native'&&person.body?.ownerId===d.actorId&&
            person.body.controllerId===d.actorId&&person.body.id===`native.person.${d.actorId}.body`,
            'Book-care work requires its actual independent native worker controller.');
        check(Object.keys(c).every(k=>['actorId','due','interval','lastAction'].includes(k)),'Unsupported book-care controller fields.');
        if(c.lastAction)check(c.lastAction.kind==='command'&&allowed.has(c.lastAction.subject)&&natural(c.lastAction.at)&&c.lastAction.at<=state.clock,
            'Unknown book-care controller choice.');
        if(registry)check(registry.simulation.controllers.get(d.id)?.actorId===d.actorId,'Missing admitted book-care controller.');
    }
    return true;
}
export function reconcileBookCareRuntime(before,plan,registry) {
    if(!enrolled(plan.state))return plan;
    const first=!enrolled(before),s=plan.state.simulation;
    if(first)for(const d of D.controllers) {
        check(s.people[d.actorId]?.inventory==='native'&&registry.simulation.controllers.get(d.id)?.actorId===d.actorId,
            'Bind each already existing book-care worker controller exactly once.');
        if(!s.controllers[d.id])s.controllers[d.id]={actorId:d.actorId,due:plan.state.clock+d.interval,interval:d.interval};
    }
    validateBookCareControllerState(plan.state,registry);return plan;
}
