import {stagePersonalLegacies} from './home_personal_legacy.js';
import {stageWarehouse,WAREHOUSE_JOB} from './home_warehouse.js';
import {QI_FIELD} from './cultivation_items.js';
import {broodView} from './household_brood.js';
import {HOUSEHOLD_ACTORS,settleHouseholdRest} from './home_household.js';
import {officeDecision} from './home_office.js';
import {nativeRainAtClock} from './weather_calendar.js';
import {registerHomeWork,applyHomeSimulationEffects,stageHomeJob,previewHomeJob} from './home_work.js';
import {conditionOf} from './home_building_model.js';
import {STEWARD,COOK,KEEPER,BUILDER} from './home_work_content.js';
import {registerDomain,domainRegistry} from './domain_registry.js';
import {HOME_PLACES as P, HOME_WORLD, DOMICILE_FURNITURE as F, HOME_SITE, HOME_BUILDINGS as B} from './home_content.js';
import {emptyHomes,validateHomes,planHome,homeAt,homeUsable,homeRestable,homeBenefits,homeDescription,settleHomes,householdHomeContext} from './home_model.js';
import {createSimulationState} from './simulation_contracts.js';
import {applyGameplayEffect} from './gameplay_transactions.js';
import {createHomePanel} from './home_panel.js';
import {createHomeOverviewPanel} from './home_overview_panel.js';
import {observerView} from './observer_view.js';
import {readPort} from './ui_ports.js';
import {expandWorkspaceModule} from './workspace_layout.js';
import {stageFortunes,configureFortunes} from './household_fortunes_domain.js';
let state=null,ports,panel,overview,needsPlaceRefresh=false;
export const residenceState=()=>state;
const bodyControlled=c=>c.body.ownerId==='player'&&c.body.controllerId==='player';
export function configureHomes(operations) {
    ports=operations;configureFortunes({root:ports.root});registerHomeWork(ports.registry);
    if(!ports.locations[HOME_SITE]) {
        const site=new ports.SafeLocation({name:HOME_SITE,description:'An unclaimed willow stand above the flood line. Fallen twigs, sheltered dry grass and deadwood lie near a forked canopy, diggable roots and a level clearing. Use Homes to gather and build.',is_unlocked:true,is_under_roof:false,
            connected_locations:[{location:ports.locations.Village,travel_time:5,custom_text:'Return to Village'}]});
        ports.locations[HOME_SITE]=site;ports.locations.Village.connected_locations.push({location:site,travel_time:5});
    }
    for(const [id,p] of Object.entries(P))if(!p.legacy&&!ports.locations[p.location]) {
        const housing=new ports.locations.Shack.housing.constructor({is_unlocked:false,sleeping_xp_per_tick:1});
        const crafting=new ports.locations.Village.crafting.constructor({is_unlocked:false,tiers:{cooking:1}});
        crafting.tiers={crafting:0,forging:0,smelting:0,cooking:1,alchemy:0,butchering:0,woodworking:0};
        const place=new ports.SafeLocation({name:p.location,description:p.description,is_unlocked:false,housing,crafting,is_under_roof:true,temperature_range_modifier:0.4,
            connected_locations:id==='tent'?[]:[{location:ports.locations.Village,travel_time:5,custom_text:'Go outside to Village'},...(B[id]?[{location:ports.locations[HOME_SITE],travel_time:2,custom_text:'Visit the wild willow stand'}]:[])]});
        const meditation=ports.locations.Village.activities.meditating;
        place.activities.meditating=new meditation.constructor({activity_name:'meditating',starting_text:'Meditate quietly at home',is_unlocked:false,skill_xp_per_tick:1});
        ports.locations[p.location]=place;
        if(id!=='tent')ports.locations.Village.connected_locations.push({location:place,travel_time:5});
        if(B[id]&&id!=='tent')ports.locations[HOME_SITE].connected_locations.push({location:place,travel_time:2});
    }
}
function context(overrides={}) {
    const c={...ports.read(),...overrides};
    const root=overrides.root||ports.root?.();delete c.root;const sim=root?.simulation;
    c.conditions={[KEEPER]:sim?.conditions?.[KEEPER]?.[QI_FIELD]?{[QI_FIELD]:structuredClone(sim.conditions[KEEPER][QI_FIELD])}:{}};c.resources=root?.actors.player.resources||{};c.people=Object.fromEntries(Object.entries(sim?.people||{}).filter(([id])=>[...HOUSEHOLD_ACTORS,BUILDER].includes(id)));c.jobs=sim?.jobs||[];
    c.staffResources=Object.fromEntries([...HOUSEHOLD_ACTORS,BUILDER].map(id=>[id,root?.actors[id]?.resources||{}]));c.staffStock=Object.fromEntries(HOUSEHOLD_ACTORS.map(id=>[id,sim?.owners[id]||{}]));
    c.staffFacts=Object.fromEntries(HOUSEHOLD_ACTORS.map(id=>[id,root?.actors[id]?.facts||{}]));c.playerFacts=root?.actors.player.facts||{};c.paidHelpReason=domainRegistry.command('pledges','actionReason')?.({kind:'paid-help'})||'';c.warehouseCompleted=root?.actors['home.manor.supplier']?.completed?.[WAREHOUSE_JOB]||0;
    c.weatherAt=at=>nativeRainAtClock(c.calendar,c.calendarClock??c.clock,at);
    c.raining=c.weatherAt(c.clock).raining;
    c.fresh=c.fresh&&state?.beginning===true;
    c.legacyAnimal=!!c.legacyHousehold?.animal;
    c.facts={...c.facts,'cultivation.awakened':!!domainRegistry.command('household_fortunes','observedAwakened')?.(KEEPER)};
    const here=homeAt(state,c);
    c.animalElsewhere=c.legacyAnimal||Object.values(state?.properties||{}).some(h=>h.id!==here?.id&&h.household?.animal);
    c.itemNames=Object.fromEntries([...new Set([...Object.keys(c.inventory),...Object.values(state?.properties||{}).flatMap(h=>Object.keys(h.stock))])].map(key=>{try{return [key,ports.itemFactory(key).getName?.()||JSON.parse(key).id||'Assembled gear'];}catch{return [key,'Stored item'];}}));
    c.unspendable=Object.keys(c.inventory).filter(key=>{try{ports.assertSpend(key);return false;}catch{return true;}});
    return c;
}
export function syncHomeLocations({render=true}={}) {
    if(!ports)return;const c=context();let pathsChanged=false,servicesChanged=false;
    for(const [id,p]of Object.entries(P)) {
        if(p.legacy)continue;const h=state?.properties[id],place=ports.locations[p.location];
        // Former tenants retain a way to collect their belongings. Sleep and
        // private room services still consult the actual paid term and body.
        const description=h?homeDescription(h):p.description,name=h?.name||p.name;
        if(c.location===p.location&&(place.description!==description||place.name!==name))servicesChanged=true;
        place.description=description;place.name=name;
        if(place.isUnlocked()!==!!h)pathsChanged=true;
        place.getAvailabilityComponent().is_unlocked=!!h;
        const usable=homeRestable(h,c),q=conditionOf(h);
        const roof=!!h&&q.integrity>=40;place.is_under_roof=roof;place.temperature_range_modifier=roof?(h.weatherproof?0.25:0.4):1;
        if(id==='tent'){const anchor=h?.anchor;for(const base of [HOME_SITE,'Village']){const node=ports.locations[base],edge=node.connected_locations.find(e=>e.location===place);if(!!edge!==(anchor===base))pathsChanged=true;node.connected_locations=node.connected_locations.filter(e=>e.location!==place);if(anchor===base)node.connected_locations.push({location:place,travel_time:2});}place.connected_locations=anchor?[{location:ports.locations[anchor],travel_time:2}]:[];}
        if(c.location===p.location&&(place.housing.isUnlocked()!==usable||place.crafting.isUnlocked()!==!!(usable&&h.fixtures.hearth&&h.fixtures.tableware)||place.activities.meditating.isUnlocked()!==!!(usable&&h.fixtures.incense)))servicesChanged=true;
        place.housing.getAvailabilityComponent().is_unlocked=usable;ports.bedAccess?.(p.location,usable);
        place.crafting.getAvailabilityComponent().is_unlocked=usable&&!!h.fixtures.hearth&&!!h.fixtures.tableware;
        place.activities.meditating.getAvailabilityComponent().is_unlocked=usable&&!!h.fixtures.incense;
    }
    needsPlaceRefresh ||= servicesChanged;
    if(pathsChanged&&c.location)ports.pathing?.();
    if(render&&needsPlaceRefresh&&c.location) {
        // Refresh after inventory/vitals publish, with the current derived travel row.
        // A display error must not interrupt a physical fixture's stock debit.
        needsPlaceRefresh=false;ports.pathing?.();ports.refreshPlace?.();
    }
}
function publish(next){state=next;syncHomeLocations({render:false});}
export function projectHomes() {
    if(!ports)return {visible:false,homes:[],ready:false};
    const c=context(),publicHome=h=>{const {brood,...visible}=h;return brood?{...visible,broodPublic:broodView(brood,c,h)}:visible;},homes=Object.values(state?.properties||{}).map(publicHome),{weatherAt,...publicContext}=c;
    return {visible:c.world===HOME_WORLD||homes.length>0||Object.values(c.nativeRights||{}).some(Boolean),ready:c.ready&&c.alive&&bodyControlled(c),context:publicContext,
        state:state?{...state,properties:Object.fromEntries(homes.map(h=>[h.id,h]))}:emptyHomes(),homes,here:homes.find(h=>h.id===homeAt(state,c)?.id)||null,fresh:c.fresh&&state?.beginning===true&&!state?.start&&homes.length===0&&!c.legacyAnimal};
}
export function quoteHome(request) {
    try{const c=context(),result=planHome(state,request,c);if(result.simEffects.length||result.job){const trial=ports.plan(0);applyHomeSimulationEffects(trial,result.simEffects,ports.registry,c);if(result.job&&!result.job.cancel){const preview=previewHomeJob(trial,result.job,ports.registry,c);if(!preview.eligible)throw Error(preview.reasons.join(' '));}}return {eligible:true,request:structuredClone(request),revision:state?.revision??0,sequence:c.sequence,
        location:c.location,form:c.body.form,inventory:JSON.stringify(c.inventory),money:c.money,result};}
    catch(error){return {eligible:false,request:structuredClone(request),reason:error.message};}
}
export function executeHome(quote) {
    if(!quote?.eligible)throw Error(quote?.reason||'Review a home action first.');
    const next=quoteHome(quote.request);
    if(!next.eligible)throw Error(next.reason);
    if(JSON.stringify(next)!==JSON.stringify(quote))throw Error('Home terms changed. Review this action again.');
    const r=next.result,plan=ports.plan(r.minutes),c=context();
    plan.state.sequence++;
    if(plan.state.clock-c.clock!==r.minutes)throw Error('Finish the pending local decision before home work.');
    plan.external.money+=r.money-c.money;
    for(const row of r.items){if(row.amount<0)ports.assertSpend(row.key);applyGameplayEffect(plan.gameplay,{type:'item',key:row.key,amount:Math.abs(row.amount)},'player',row.amount<0);}
    for(const e of r.simEffects)if(e.type==='transfer'&&e.from==='player')ports.assertSpend(e.key);
    applyHomeSimulationEffects(plan,r.simEffects,ports.registry,c);if(r.job)stageHomeJob(plan,r.job,ports.registry,c);
    plan.nativePatch={...plan.nativePatch,homes:r.state};
    if(r.retrieving)plan.homeAway=true;
    if(r.removeLegacyAnimal)plan.homeLegacyRemoval=true;
    if(r.body) {
        plan.state.simulation ||= {...createSimulationState(),enrolledAt:plan.state.clock};
        plan.state.simulation.people.player ||= {life:'alive',inventory:'native',location:c.location,bornAt:plan.state.clock};
        plan.state.simulation.people.player.body=r.body;
        plan.state.simulation.people.player.location=r.location;
        plan.nativePatch['character/bio/race']=r.body.form;
    }
    if(r.location){plan.nativeLocation=r.location;plan.nativePatch['current location']=r.location;if(plan.state.simulation?.people.player)plan.state.simulation.people.player.location=r.location;}
    ports.effects(plan,{effects:r.householdEffects});
    const previous=plan.absorbPublish;
    plan.absorbPublish=()=>{previous?.();if(r.body)ports.setForm(r.body.form);};
    ports.commit(plan);panel?.render();ports.log(r.message);return r;
}
// Called by the existing root time-staging boundary before durable publication.
// No registry tick can spend stock or save independently after the root commits.
export function stageResidenceClock(plan) {
    if(!ports)return;
    settleHouseholdRest(plan,ports.root?.());
    const raw=plan.nativePatch?.homes??state;if(raw==null)return;
    const body=plan.state.simulation?.people.player?.body||ports.read().body;
    const c=context({clock:plan.state.clock,sequence:plan.state.sequence,body,location:plan.homeAway?'local.residence_retrieval':plan.nativeLocation||ports.read().location,world:plan.state.actors.player.worldId,root:plan.state,calendar:plan.calendar||ports.read().calendar,calendarClock:plan.state.clock});
    const effects=[];
    const next=settleHomes(raw,c,(h,rows)=>{if(homeAt(raw,c)?.id===h.id)effects.push(...rows);},rows=>applyHomeSimulationEffects(plan,rows,ports.registry,c));
    // The pantry office acts on the same root clock; no separate timer or queue.
    if(next.properties.manor&&plan.state.simulation){const office=officeDecision(context({...c,root:plan.state}));if(office.status==='order'){plan.state.sequence++;stageHomeJob(plan,office.job,ports.registry,c);}}
    if(next.properties.manor&&plan.state.simulation){const wc=context({...c,root:plan.state});stageWarehouse(plan,wc,next,{applyEffects:rows=>applyHomeSimulationEffects(plan,rows,ports.registry,wc),stageJob:job=>stageHomeJob(plan,job,ports.registry,wc)});}
    if(next.properties.manor&&plan.state.simulation){const fc=context({...c,root:plan.state});stageFortunes(plan,fc,next,{applyEffects:rows=>applyHomeSimulationEffects(plan,rows,ports.registry,fc),stageJob:job=>stageHomeJob(plan,job,ports.registry,fc),log:ports.log});}
    if(plan.state.simulation)stagePersonalLegacies(plan,context({...c,root:plan.state}),rows=>applyHomeSimulationEffects(plan,rows,ports.registry,context({...c,root:plan.state})));
    // One root revision owns all household clocks. Local model planning uses
    // sequence+1; ensure the enclosing expansion revision admits that stamp.
    const needed=Math.max(plan.state.sequence,...Object.values(next.properties).map(h=>h.household?.lastSequence||0));
    plan.state.sequence=needed;
    if(effects.length)ports.effects(plan,{effects});
    validateHomes(next,{clock:plan.state.clock,sequence:plan.state.sequence});
    plan.nativePatch={...plan.nativePatch,homes:next};
    for(const [id,p]of Object.entries(P))if(!p.legacy){const h=next.properties[id],usable=homeRestable(h,c);plan.nativePatch[`availabilities/location/${p.location}`]=h?1:0;plan.nativePatch[`availabilities/location/${p.location}:housing`]=usable?1:0;plan.nativePatch[`availabilities/location/${p.location}:crafting`]=usable&&h.fixtures.hearth&&h.fixtures.tableware?1:0;}
    if(plan.homeLegacyRemoval){const old=plan.p00Household?.state;if(!old?.animal)throw Error('The original companion changed during retrieval.');old.animal=null;plan.nativePatch.household=old;}
    const previous=plan.absorbPublish;plan.absorbPublish=()=>{previous?.();publish(next);};
}
export function residenceSleepAllowed(){if(!ports)return true;const c=context(),h=homeAt(state,c);return !h||homeRestable(h,c);}
export function residenceFurnitureInput(c) {return {residences:state,residenceContext:c};}
registerDomain({id:'homes',initialState:()=>({...emptyHomes(),beginning:true}),save:()=>state||undefined,
    validate:(slice,envelope)=>{validateHomes(slice,{clock:envelope.expansion?.clock,sequence:envelope.expansion?.sequence});
        if(envelope.household?.animal&&Object.values(slice?.properties||{}).some(h=>h.household?.animal))throw Error('Moss cannot occupy two homes.');
        for(const h of Object.values(slice?.properties||{}))if(h.household&&h.household.lastClock!==envelope.expansion.clock)throw Error('Home household clock must match the native played clock.');
        for(const h of Object.values(slice?.properties||{}))for(const key of [...Object.keys(h.stock),...Object.values(h.fixtures).map(r=>r.key)])ports.itemFactory(key);
        for(const project of Object.values(slice?.projects||{}))for(const key of Object.keys(project.materials))ports.itemFactory(key);},
    load:(slice,envelope)=>publish(envelope&&!Object.hasOwn(envelope,'homes')?null:slice?structuredClone(slice):null),refresh:()=>{syncHomeLocations();panel?.render();overview?.render();},
    commands:{quote:quoteHome,execute:executeHome},projection:projectHomes,
    panels:[()=>{panel=createHomePanel({read:projectHomes,quote:quoteHome,execute:executeHome});},
        ()=>{overview=createHomeOverviewPanel({read:()=>({...projectHomes(),observer:observerView(readPort('expansion'))}),openHomes:()=>expandWorkspaceModule('homes')});}],
});
