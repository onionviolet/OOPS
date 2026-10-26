import {renderHouseholdLife,renderHouseholdWorkReceipt} from './home_household_panel.js';
import {HOME_PLACES as P,HOME_SITE,HOME_CAMPS,PACKED_TENT,homeKey as k} from './home_content.js';
import {conditionOf,projectProgress,projectLocation} from './home_building_model.js';
import {BUILDER,STEWARD,COOK,KEEPER,staffQuote} from './home_work_content.js';
import {HOME_STAFF} from './home_staff.js';
export function renderHomeWork({view,body,detail,h,el,section,action}) {
    const c=view.context,s=view.state,here=view.here;
    if(h){
        const weather=section(detail,'Shelter, weather and repairs');
        if(h.id==='shack'||h.id==='proto')weather.append(el('p','Use the existing home’s maintenance route.'));
        else if(here?.id!==h.id)weather.append(el('p','Inspect structural condition and bedding when you return to this home.'));
        else {const q=conditionOf(h);weather.append(el('p',`Structure ${q.integrity}/100 · dampness ${Math.floor(q.wetness/10)}/100 · ${h.weatherproof?'weatherproofed':'ordinary protection'}. ${q.integrity<40?'Roof leaks into the native weather exposure.':'Roof provides local weather shelter.'} ${q.wetness>=500?'Damp bedding gives no bedding rest or Sleeping bonus until dry.':''}`));
            action(weather,'repair:'+h.id,'Reserve repair materials and begin repairs',{type:'repair',home:h.id});
            action(weather,'weatherproof:'+h.id,'Fit extra weather protection · 1 pole/twig + 2 grass, or earthwork for a burrow',{type:'weatherproof',home:h.id});
            if(h.id==='tent')action(weather,'pack_home','Pack this portable shelter · 5 min',{type:'pack_home',home:'tent'});
        }
    }
    body.append(el('p',`${c.raining?'Rain is falling. Grass gathered outside arrives damp and exposed construction takes longer.':'Dry weather currently supports outdoor drying and ordinary work.'} Repair and construction materials are held at their actual project site. Starting work grants no completed housing.`));
    if(c.inventory[k('Home damp grass')])action(body,'dry_grass','Dry one damp grass bundle · 10 min',{type:'dry_grass'});
    if(s.portable)body.append(el('p','Your retained shelter is packed. Carry its actual kit to the next permitted camp; stored goods do not follow it automatically.'));
    if(s.portable&&HOME_CAMPS.includes(c.location))action(body,'pitch_home','Pitch your carried shelter here · 5 min',{type:'pitch_home'});
    for(const p of Object.values(s.projects||{})){
        const work=section(body,`${P[p.home].name} · ${p.kind} work`),progress=Math.min(p.required,projectProgress(p,c));
        work.append(el('p',`${progress}/${p.required} labor minutes completed at ${projectLocation(p)}. Reserved materials: ${Object.entries(p.materials).map(([key,n])=>`${n} ${JSON.parse(key).id.replace('Home ','')}`).join(', ')||'earthwork; no bought material'}. Five-minute contributions can be paused between batches. Current uncompleted work is stopped through the pause control.`));
        action(work,'work:'+p.home,'Contribute work · 5 min, or 10 in outdoor rain',{type:'work',home:p.home});
        action(work,'shared:'+p.home,'Work with Ada · 2 coins, twice the labor',{type:'work',home:p.home,shared:true});
        action(work,'cancel_project:'+p.home,'Abandon unfinished work and recover unworked materials',{type:'cancel_project',home:p.home});
    }
    for(const job of c.jobs.filter(j=>j.actorId==='player'&&j.commandId.startsWith('home.work.'))){body.append(el('p',`${job.label}: ${Math.max(0,job.due-c.clock)} played minutes remain.`));action(body,'cancel_work:'+job.id,'Pause current contribution; keep completed work',{type:'cancel_work',job:job.id});}
    if(c.location===HOME_SITE||here?.owner==='player')action(body,'hire_builder','Invite Ada for shared work · travel up to 5 min; 2 coins per contribution',{type:'hire_builder'});
    if(c.people[BUILDER]?.location===c.location){body.append(el('p',`Ada is here. Earned wages: ${c.staffResources[BUILDER]?.['home.wages']||0} coins. A current shared job reserves her time.`));action(body,'dismiss_builder','End Ada’s visit and let her return to Village',{type:'dismiss_builder'});}
    if(h?.id==='manor'&&here?.id==='manor'){
        const staff=section(detail,'Family, staff and household accounts');
        const rank=s.start?.profile==='royal'?'Royal child':s.start?.profile==='ducal'?'Duke’s child':'Family guest';
        staff.append(el('p',`${rank}: private room and household hospitality. The family retains the estate title, pantry and staff employment. Rowan authorizes these finite requests from retained funds; you may offer your own supplies.`));
        staff.append(el('p',`Household treasury: ${c.staffResources[STEWARD]?.['home.estateFunds']||0} coins. Unclaimed agreed allowance: ${c.staffResources[STEWARD]?.['home.allowanceRemaining']||0}.`));
        action(staff,'allowance','Ask Rowan for the agreed allowance',{type:'allowance'});
        for(const person of HOME_STAFF){const jobs=c.jobs.filter(j=>j.actorId===person.id);staff.append(el('p',`${person.name}, ${person.role}: ${c.people[person.id]?.life==='alive'?'present':'unavailable'} · ${jobs.length?'accepted work below':'no accepted order'} · earned wages ${c.staffResources[person.id]?.['home.wages']||0}.`));for(const j of jobs.filter(j=>j.commandId.startsWith('home.staff.'))){if(!renderHouseholdWorkReceipt({host:staff,job:j,c,el}))staff.append(el('p',`${j.label}: ${Math.max(0,j.due-c.clock)} min remaining.`));action(staff,'cancel_staff:'+j.id,'Discuss cancelling this accepted order',{type:'cancel_staff',job:j.id});}}
        action(staff,'staff:cook','Ask Iven to prepare two meals · 2 household coins, 2 meat chunks + 1 log · 10 min',{type:'staff_order',service:'cook'});
        action(staff,'staff:repair','Ask Toma to patch the roof · 3 household coins, 1 log + 2 grass · 15 min',{type:'staff_order',service:'repair'});
        action(staff,'staff:dry','Ask Toma to dry the room · 2 household coins + 1 log · 10 min',{type:'staff_order',service:'dry'});
        {const q=staffQuote('home.staff.gather'),yields=q.yields.map(y=>`${y.count} ${JSON.parse(y.key).id}`).join(' + ');
        action(staff,'staff:gather',`Ask Toma to gather on the estate grounds · ${q.funds} household coins, ${q.energy} of his energy · ${q.minutes} min → ${yields} into his stock`,{type:'staff_order',service:'gather'});}
        staff.append(el('p',`Kitchen: ${c.staffStock[COOK]?.[k('Rat meat chunks')]||0} meat chunks, ${c.staffStock[COOK]?.[k('Rough wood log')]||0} logs, ${c.staffStock[COOK]?.[k('Roasted rat meat')]||0} prepared meals. Caretaker: ${c.staffStock[KEEPER]?.[k('Rough wood log')]||0} logs, ${c.staffStock[KEEPER]?.[k('Home dry grass')]||0} grass.`));
        renderHouseholdLife({staff,view,el,action});
        action(staff,'collect_meal','Accept one prepared household meal',{type:'collect_meal'});
        for(const [actor,items]of [[COOK,['Rat meat chunks','Rough wood log']],[KEEPER,['Rough wood log','Home dry grass']]])for(const item of items)action(staff,'supply:'+actor+':'+item,'Offer one owned '+item,{type:'supply_staff',actor,item});
    }
}
