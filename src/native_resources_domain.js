import {domainRegistry, registerDomain} from './domain_registry.js';
import {createHarvest,validateHarvest,validateHarvestEnvelope,supportedHarvest,drawSpecimen,addCarcass,beginHarvest,cancelHarvest,advanceHarvest,setHarvestRoutine,pauseHarvestRoutine,resumeHarvestRoutine,cancelHarvestRoutine,observeCarcass} from './harvest.js';
import {validateHabitat,migrateHabitat,planHabitatAction} from './habitat_care.js';
import {SHEEP_HOLDER} from './fleece_from_care.js';
import {addMoodThought,readMood} from './mood_thoughts_domain.js';
import {createHarvestPanel} from './harvest_ui.js';
import {createHabitatPanel} from './habitat_care_ui.js';
import {registerMeadowShellFight} from './meadow_shell_combat.js';
import {calendarMinutes} from './world_rhythm.js';
export let harvestOwner=null,habitatOwner=null,harvestPanel,habitatPanel;
export function setHarvestOwner(value){harvestOwner=value;}
export function setHabitatOwner(value){habitatOwner=value;}
let ports;
export function configureResourceDomains(operations){ports=operations;}
registerMeadowShellFight(() => ({owner: habitatOwner, clock: ports.clock()}));
function envelopeClock(save){return save['current time']?calendarMinutes(save['current time']):Number.MAX_SAFE_INTEGER;}
export function receiveHarvest(target){
    if(!supportedHarvest(target.name)||!ports.harvestWritable())return;
    harvestOwner??=createHarvest();
    const context=ports.harvestContext();
    const specimen=drawSpecimen({species:target.name,key:target.rngKey||`harvest:${harvestOwner.sequence+1}`,clock:context.clock,damage:target.harvestDamage},key=>ports.random(key));
    const left=harvestOwner.left;ports.grantHarvest(addCarcass(harvestOwner,specimen,context));
    if(harvestOwner.left>left)ports.logMessage('Carcass lot full: one '+target.name+' left behind. Enable auto-processing to retain incoming parts.','notification');
    harvestPanel?.render();
}
function actHarvest(request){
    if(!ports.harvestWritable())throw Error('Processing requires a living player in the writable frontier game.');
    if(request.type==='begin'&&!ports.harvestReady())throw Error('Finish the current activity before processing.');
    ports.harvestTransaction(()=>{harvestOwner??=createHarvest();
    if(request.type==='routine')setHarvestRoutine(harvestOwner,request.target,ports.clock());
    else if(request.type==='pause-routine')pauseHarvestRoutine(harvestOwner);
    else if(request.type==='resume-routine')resumeHarvestRoutine(harvestOwner);
    else if(request.type==='cancel-routine')cancelHarvestRoutine(harvestOwner);
    else if(request.type==='auto'){if(harvestOwner.routine&&['active','paused'].includes(harvestOwner.routine.status)){if(request.value)resumeHarvestRoutine(harvestOwner);else pauseHarvestRoutine(harvestOwner);}else {delete harvestOwner.routine;harvestOwner.auto=!!request.value;}}
    else if(request.type==='cancel')cancelHarvest(harvestOwner);
    else if(request.type==='begin')beginHarvest(harvestOwner,request.species,request.choice,ports.harvestContext(),false,request.specimenKey);
    else if(request.type==='observe')observeCarcass(harvestOwner,request.species,request.specimenKey,ports.harvestContext());
    else throw Error('Unknown processing action.');});
    harvestPanel?.render();
}

function tickHarvest(minutes){
    if(!harvestOwner||!ports.harvestWritable())return;
    // Auto handling is an idle combat companion; explicit handling occupies the player.
    const ready=harvestOwner.job&&!harvestOwner.job.automatic || ports.harvestAutomaticReady();
    if(!ready || !harvestOwner.job && !harvestOwner.auto)return;
    try {ports.harvestTransaction(()=>{for(const plan of advanceHarvest(harvestOwner,minutes,ports.harvestContext(),{ready:true}))ports.grantHarvest(plan);});}
    catch(e){ports.logMessage('Carcass processing paused: '+e.message,'notification');}
    harvestPanel?.render();
}

// FRC56: the sheep's mood is its own thought rows (mood_thoughts); plans read it and return the rows a care act adds. Rows are
// written before the commit so its save carries them; a failed commit can leave one keyed row behind (no remove port), harmless.
// Thought rows run on the root clock (TMR1, expansionState.clock), shared with every other holder; the pen keeps its calendar clock.
const habitatRead=()=>{const c=ports.habitatContext();return {...c,mood:readMood(SHEEP_HOLDER,ports.rootClock())};};
function actHabitat(action){
    if(action==='spar_shell'){
        const begin=domainRegistry.command('tempo_fight','begin');
        if(!begin)throw Error('Practice is unavailable right now.');
        return begin({openerId:'meadow.terrapin'});
    }
    const context=habitatRead(),plan=planHabitatAction(habitatOwner,action,context),root=ports.rootClock();
    for(const t of plan.thoughts||[])addMoodThought(t,root);
    ports.commitHabitatPlan(plan);
    if(plan.fleece)ports.logMessage(`Collected ${plan.fleece.amount} ${plan.fleece.grade} wool${plan.fleece.deluxe?' (a dense fleece)':''}.`,'notification');
}
// Preserve the old validation order: care cross-checks first, carcasses second.
registerDomain({id:'meadow_pen',initialState:()=>null,
    save:()=>habitatOwner?structuredClone(validateHabitat(habitatOwner,ports.clock())):undefined,
    validate:(slice,save)=>{if(slice!=null)validateHabitat(slice,calendarMinutes(save['current time']));},
    migrate:(slice,save)=>migrateHabitat(slice,envelopeClock(save)),load:setHabitatOwner,
    commands:{act:actHabitat},projection:habitatRead,
    panels:[()=>{habitatPanel=createHabitatPanel({parent:ports.careContainer(),read:()=>{const context=habitatRead();
        const spar=context.owner?.shellAnimal ? domainRegistry.project('tempo_fight')?.openers?.find(o=>o.id==='meadow.terrapin') : null;
        return {...context,spar};},act:actHabitat});}]});
registerDomain({id:'harvest',initialState:()=>null,
    save:()=>harvestOwner?structuredClone(validateHarvest(harvestOwner,ports.clock())):undefined,
    validate:(_,save)=>validateHarvestEnvelope(save,envelopeClock(save)),
    migrate:(slice,save)=>slice==null?null:structuredClone(validateHarvest(slice,envelopeClock(save))),load:setHarvestOwner,
    tick:tickHarvest,commands:{act:actHarvest,receive:receiveHarvest},
    projection:()=>({state:harvestOwner,context:ports.harvestContext(),writable:ports.harvestWritable(),ready:ports.harvestReady(),automaticReady:ports.harvestAutomaticReady()}),
    panels:[()=>{harvestPanel=createHarvestPanel({container:ports.harvestContainer(),read:()=>({state:harvestOwner,context:ports.harvestContext(),writable:ports.harvestWritable(),ready:ports.harvestReady(),automaticReady:ports.harvestAutomaticReady()}),readInspector:ports.readInspector,act:actHarvest,developer:ports.developer()});}]});
