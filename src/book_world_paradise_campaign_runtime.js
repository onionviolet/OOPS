// Additive appointments and actual completed-disposition reconciliation only.
// Existing Paradise1/native1 owners, scheduler and publisher remain the owners.
import {PARADISE_IDS as P} from './book_world_paradise_ids.js';
import {settleParadiseDrying} from './book_world_paradise_drying.js';
import {PARADISE_CAMPAIGN_IDS as I, paradiseCampaignDefinitions as D} from './book_world_paradise_campaign_content.js';
import {paradiseCampaignEnrolled} from './book_world_paradise_campaign_facts.js';
const check=(ok,message)=>{if(!ok)throw Error(message);},natural=n=>Number.isSafeInteger(n)&&n>=0;
const F=I.prefix;
export function paradiseCampaignControllerAllowed(state,definition){
    if(!definition?.id?.startsWith(F))return true;
    const d=D.controllers.find(d=>d.id===definition.id);
    return !!d&&paradiseCampaignEnrolled(state)&&definition.actorId===d.actorId&&definition.interval===d.interval&&definition.revision===d.revision;
}
export function validateParadiseCampaignDepthControllers(state,registry){
    const s=state.simulation,rows=Object.entries(s?.controllers||{}).filter(([id,c])=>id.startsWith(F)||c.definitionId?.startsWith(F));
    if(!paradiseCampaignEnrolled(state)){check(!rows.length,'Extended Paradise controllers need deliberate actual campaign enrollment.');return true;}
    check(rows.length===D.controllers.length,'Missing the exact independent gate-duty appointments.');
    for(const d of D.controllers){const c=s.controllers[d.id],p=s.people[d.actorId],actions=new Set(d.actions.map(a=>a.commandId));
        check(c&&c.actorId===d.actorId&&c.definitionId==null&&c.interval===d.interval&&natural(c.due)&&(c.due>=state.clock||p.life!=='alive')&&
            Object.keys(c).every(k=>['actorId','due','interval','lastAction'].includes(k))&&p.inventory==='native'&&p.body?.ownerId===d.actorId&&
            p.body.controllerId===d.actorId&&p.body.id===`native.person.${d.actorId}.body`,
            'Gate duties require the actual independent native bodies and exact controller appointments.');
        if(c.lastAction)check(c.lastAction.kind==='command'&&actions.has(c.lastAction.subject)&&natural(c.lastAction.at)&&c.lastAction.at<=state.clock,'Unknown gate-duty controller choice.');
        if(registry)check(registry.simulation.controllers.get(d.id)?.actorId===d.actorId,'Missing admitted gate-duty definition.');
    }
    return true;
}
export function reconcileParadiseCampaignDepthRuntime(before,plan,registry){
    if(!paradiseCampaignEnrolled(plan.state))return plan;
    const first=!paradiseCampaignEnrolled(before),s=plan.state.simulation,f=plan.state.worlds[P.goa].facts;
    if(first)for(const d of D.controllers){check(s.people[d.actorId]?.inventory==='native'&&registry.simulation.controllers.get(d.id)?.actorId===d.actorId,
        'Admit the already existing actual gate-duty people before appointment.');
        const expected={actorId:d.actorId,due:plan.state.clock+d.interval,interval:d.interval},existing=s.controllers[d.id];
        // The host and sole publisher may reconcile the same staged first
        // admission against the same unenrolled before-state. Validate that
        // exact appointment instead of replacing it or treating it as a grant.
        if(existing)check(Object.keys(existing).length===3&&Object.entries(expected).every(([key,value])=>existing[key]===value),
            'Gate appointments cannot replace a changed or independently used controller.');
        else s.controllers[d.id]=expected;
    }
    // A real earlier shelter/loss can make this optional rescue unnecessary.
    // Merely reading/rendering cannot grant even this no-reward disposition.
    const p=s.people[P.hank],a=plan.state.actors[P.hank],outcome=f[F+'rescueOutcome'];
    if(outcome==null&&f['book.goa.hank']==='sheltered'&&p.life==='alive'&&
        ['book.paradise.npc.hank_shelter_route','book.paradise.npc.hank_shelter_contained'].some(id=>a.completed[id]===1))f[F+'rescueOutcome']='earlier_shelter';
    else if(outcome==null&&f['book.goa.hank']==='dead'&&p.life==='dead'&&a.completed['book.paradise.npc.hank_afterfire_death']===1)
        f[F+'rescueOutcome']='earlier_loss';
    settleParadiseDrying(plan);validateParadiseCampaignDepthControllers(plan.state,registry);return plan;
}
