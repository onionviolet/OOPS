import {registerDomain} from './domain_registry.js';
import {createHarvest,validateHarvest,validateHarvestEnvelope,supportedHarvest,drawSpecimen,addCarcass,beginHarvest,cancelHarvest,advanceHarvest,setHarvestRoutine,pauseHarvestRoutine,resumeHarvestRoutine,cancelHarvestRoutine} from './harvest.js';
import {validateHabitat,planHabitatAction} from './habitat_care.js';
import {createHarvestPanel} from './harvest_ui.js';
import {createHabitatPanel} from './habitat_care_ui.js';
import {calendarMinutes} from './world_rhythm.js';
export let harvestOwner=null,habitatOwner=null,harvestPanel,habitatPanel;
export function setHarvestOwner(value){harvestOwner=value;}
export function setHabitatOwner(value){habitatOwner=value;}
let ports;
export function configureResourceDomains(operations){ports=operations;}
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

function actHabitat(action){ports.commitHabitatPlan(planHabitatAction(habitatOwner,action,ports.habitatContext()));}
// Preserve the old validation order: care cross-checks first, carcasses second.
registerDomain({id:'meadow_pen',initialState:()=>null,
    save:()=>habitatOwner?structuredClone(validateHabitat(habitatOwner,ports.clock())):undefined,
    validate:(slice,save)=>{if(slice!=null)validateHabitat(slice,calendarMinutes(save['current time']));},
    migrate:(slice,save)=>slice==null?null:structuredClone(validateHabitat(slice,envelopeClock(save))),load:setHabitatOwner,
    commands:{act:actHabitat},projection:()=>ports.habitatContext(),
    panels:[()=>{habitatPanel=createHabitatPanel({parent:ports.careContainer(),read:ports.habitatContext,act:actHabitat});}]});
registerDomain({id:'harvest',initialState:()=>null,
    save:()=>harvestOwner?structuredClone(validateHarvest(harvestOwner,ports.clock())):undefined,
    validate:(_,save)=>validateHarvestEnvelope(save,envelopeClock(save)),
    migrate:(slice,save)=>slice==null?null:structuredClone(validateHarvest(slice,envelopeClock(save))),load:setHarvestOwner,
    tick:tickHarvest,commands:{act:actHarvest,receive:receiveHarvest},
    projection:()=>({state:harvestOwner,context:ports.harvestContext(),writable:ports.harvestWritable(),ready:ports.harvestReady(),automaticReady:ports.harvestAutomaticReady()}),
    panels:[()=>{harvestPanel=createHarvestPanel({container:ports.harvestContainer(),read:()=>({state:harvestOwner,context:ports.harvestContext(),writable:ports.harvestWritable(),ready:ports.harvestReady(),automaticReady:ports.harvestAutomaticReady()}),readInspector:ports.readInspector,act:actHarvest,developer:ports.developer()});}]});
