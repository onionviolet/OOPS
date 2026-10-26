import {all, eqRawReason as eq} from './basics.js';
import {leverDefinitions} from './lever_lesson.js';
import {compileSiteProject, projectView} from "./site_projects.js";
import {compileSituation} from "./scene_definitions.js";
import {enrollSimulation, commitSimulationCommand} from "./simulation.js";
import {moneyKeyNative as money} from './content_kit.js';
const worldId = "base.frontier", wood = JSON.stringify({id:"Rough wood log"}), kit = JSON.stringify({id:"Prepared survey kit"});
const af = (key,value=true,actor) => ({type:"fact",scope:"actor",key,value,...(actor ? {actor} : {})});
const wf = (key,value=true) => ({type:"world",worldId,key,value});
const observe = (key,as) => ({type:"observation",scope:"world",key,as});
const member = eq("actor.field.member",true,"Join through a field result or a supplied brace.");
const started = eq("world.project.field.workshop.started",true);
const command = d => ({revision:1,worldId,group:"field",actorId:"player",location:"Village",costs:[],effects:[],...d});
const method = "field.load_step", focus = "field.focus", drive = "field.drive";
const teacher = all(eq("village.craftsmanMet",true),eq("village.craftsmanBusy",false,"Wait for his work to finish."),eq("village.craftsmanIrritated",false,"Let the earlier exchange settle first."),eq("village.teacherHours",true,"He teaches between 08:00 and 18:00."));
const energy = (energyId,operation,extra={}) => ({type:"energy",energyId,operation,...extra});
export const fieldSources = [{id:"field.load_step",revision:1,label:"Load-bearing Step",kind:"knowledge",bioDetail:"A learned way to steady a loaded frame.",grants:[{capability:"frontier.preparation",amount:1}]},
    {id:"field.road_support",revision:1,label:"Reliable road markers",kind:"knowledge",bioDetail:"Your actual support or later repair left a reliable local route.",grants:[{capability:"frontier.preparation",amount:1}]},
    {id:"field.pattern_imprint",revision:1,label:"Pattern imprint",kind:"trait",bioDetail:"A practiced imprint can copy this demonstrated movement, preserving its holder's method.",grants:[]}];
export const fieldProject = {id:"field.workshop",revision:1,worldId,phases:[
    {id:"parts",actorId:"oldCraftsman",label:"Shape the workshop's measured parts",location:"Village",siteId:"village.workbench",duration:4,
        requires:eq("actor.busyOrder",false),costs:[{type:"item",key:wood,amount:-2}],effects:[af("field.partsOrder",false)]},
    {id:"survey",actorId:"fieldSurveyor",label:"Survey the workshop's approach",location:"Village road",siteId:"field.route",duration:6,
        costs:[{type:"item",key:wood,amount:-1},{type:"resource",key:"focus",amount:-1}],effects:[{type:"relocate",location:"Village"}]},
    {id:"assembly",actorId:"player",label:"Assemble the field workshop · 3 min + 1 coin",location:"Shack",siteId:"field.assembly",duration:3,after:["parts","survey"],cancellation:"refund",
        visibleWhen:all(eq("actor.field.project.parts",true),eq("actor.field.project.survey",true),eq("actor.field.facility",false)),
        costs:[money(-1)],effects:[af("field.facility"),{type:"event",eventId:"field.road.developing",delay:3}]}]};
const roadKey = "situation.field.road.stage";
const settled = stage => [wf(roadKey,stage),observe(roadKey,"field.roadKnown"),af("field.roadOutcome",stage),
    ...(["secured","repaired"].includes(stage) ? [{type:"source",sourceId:"field.road_support",operation:"grant",origin:"acquired",awakened:true,active:true}] : []),
    {type:"knowledge",key:"field.road.aftermath",stage:"understood",value:stage === "secured" ? "Your supplied support kept the short road open." : stage === "repaired" ? "Your later repair restored the short route. Its reliable markers remain useful." : "The association took the longer route. Nobody accepted a promise on your behalf."}];
const local = all(member,eq("location","Village","Return to Village to coordinate a response."));
const roadScene = {id:"field.road",revision:1,worldId,phases:[
    {id:"developing",delay:3,mode:"ambient",public:false,label:"The association surveys the loose road bank"},
    {id:"window",delay:4,mode:"offer",lifetime:45,public:true,label:"The association reports a loose road bank · a detour remains available",
        responses:[{id:"kit",label:"Supply a kit · 1 kit",requires:local,costs:[{type:"item",key:kit,amount:-1}],effects:settled("secured")},
            {id:"focus",label:"Read the load carefully · 2 focus units",requires:all(local,eq("power.field.load_step.owned",true)),costs:[energy(focus,"use",{output:1,control:2})],effects:settled("secured")},
            {id:"drive",label:"Brace the load · 3 drive units",requires:all(local,eq("power.field.load_step.owned",true),{fact:"power.field.load_step.mastery",op:"gte",value:2}),costs:[energy(drive,"use",{output:3,control:1})],effects:settled("secured")},
            {id:"defer",label:"Leave the repair to the association",requires:local,effects:settled("detour")}],onExpire:[]},
    {id:"detour",delay:1,mode:"ambient",public:false,label:"The association takes the longer road"}
]};
export const fieldDefinitions = {
    situations:leverDefinitions.situations,
    energies:[{id:focus,revision:1,label:"Measured focus",capacity:4,output:1,control:2,efficiencyNumerator:1,efficiencyDenominator:2,strainLimit:2,strainPerUse:1},
        {id:drive,revision:1,label:"Breath drive",capacity:6,output:3,control:1,efficiencyNumerator:1,efficiencyDenominator:1,strainLimit:3,strainPerUse:1}],
    people:[{id:"fieldSurveyor",revision:1,label:"Association pathfinder",provision:false,worldId,location:"Village road",inventory:"simulation",resources:{focus:1}}],
    sites:[{id:"field.route",revision:1,label:"Workshop approach",capacity:1},{id:"field.assembly",revision:1,label:"Field workshop",capacity:1}],
    powers:[...leverDefinitions.powers,{id:method,revision:1,label:"Load-bearing Step",model:"practice",capacity:1,masteryBands:[{at:2,capacity:3}],execution:member}],
    commands:[
        ...leverDefinitions.commands,
        command({id:"field.begin",label:"Ask about a shared field workshop",once:true,uiSection:"association",requires:eq("village.craftsmanMet",true),
            effects:[af("field.introduced"),af("field.member",false),af("field.method",false),af("field.facility",false),
                wf("project.field.workshop.started",false),...fieldProject.phases.map(p=>wf(`project.field.workshop.${p.id}`,false)),wf(roadKey,"quiet"),
                af("field.member",true,"oldCraftsman"),{type:"power",actor:"oldCraftsman",powerId:method,operation:"learn"},{type:"power",actor:"oldCraftsman",powerId:method,operation:"refine",amount:2},
                ...fieldDefinitionsSites().map(siteId=>({type:"site",siteId,operation:"open"}))]}),
        command({id:"field.join_survey",label:"Join with your route findings · 2 min",once:true,uiSection:"association",duration:2,cancellation:"forfeit",
            visibleWhen:all(eq("actor.field.introduced",true),eq("actor.field.member",false)),requires:{all:[eq("actor.field.member",false),{any:[eq("campaign.anchor",true),eq("actor.town.returned",true)]}]},
            description:"Explain an actual crossing inspection or your returned town ledger. Two minutes; no fee. Cancellation grants no membership.",effects:[af("field.member"),af("field.entry","survey")]}),
        command({id:"field.join_craft",label:"Join by making a brace · 2 logs + 1 coin · 3 min",once:true,uiSection:"association",duration:3,cancellation:"refund",
            visibleWhen:all(eq("actor.field.introduced",true),eq("actor.field.member",false)),requires:eq("actor.field.member",false),
            description:"Supply two real logs and one coin for an inspected association brace. Cancellation returns both materials and payment.",costs:[{type:"item",key:wood,amount:-2},money(-1)],effects:[af("field.member"),af("field.entry","craft")]}),
        ...[[focus,"focus",2,[]],[drive,"drive",3,[{type:"vital",key:"stamina",amount:-2}]]].flatMap(([id,name,duration,costs])=>[
            command({id:`field.learn_${name}`,label:`Learn ${name === "focus" ? "measured focus" : "breath drive"} · ${duration} min`,uiSection:"methods",once:true,duration,cancellation:"forfeit",visibleWhen:member,requires:member,costs,
                description:name === "focus" ? "Precision over force: four units held, one output, two control. One output costs two units. Recovery takes two minutes." : "Force over precision: six units held, three output, one control. Learning spends two stamina. Recovery takes four minutes and two stamina.",effects:[energy(id,"learn")]}),
            command({id:`field.recover_${name}`,label:`Recover ${name} · ${name === "focus" ? 2 : 4} min${name === "drive" ? " + 2 stamina" : ""}`,uiSection:"methods",location:"Shack",duration:name === "focus" ? 2 : 4,cancellation:"refund",automatable:true,
                visibleWhen:eq(`energy.${id}.known`,true),requires:eq(`energy.${id}.known`,true),costs:name === "focus" ? [] : [{type:"vital",key:"stamina",amount:-2}],effects:[energy(id,"recover",{amount:name === "focus" ? 4 : 6,cooling:3})]})]),
        command({id:"field.teach_step",label:"Learn Load-bearing Step · 1 coin + 2 min",uiSection:"methods",once:true,duration:2,cancellation:"refund",targetId:"oldCraftsman",coLocated:true,participants:["$actor","$target"],
            visibleWhen:all(member,eq("actor.field.method",false)),requires:all(member,teacher),costs:[money(-1)],
            description:"Reserve the craftsman's attention for two minutes. Learn his steadying method; cancellation returns the fee.",effects:[{type:"power",powerId:method,operation:"learn"},{type:"power",powerId:method,operation:"refine",amount:1},...methodEffects("teaching")]}),
        command({id:"field.discover_imprint",label:"Explore an observed pattern · 2 coins + 3 min",uiSection:"methods",once:true,duration:3,cancellation:"refund",visibleWhen:all(member,eq(`energy.${focus}.known`,true)),requires:member,
            description:"Develop an optional, narrowly defined pattern-imprint faculty. It can reproduce the craftsman's demonstrated Load-bearing Step; it grants no unseen methods.",costs:[money(-2)],
            effects:[{type:"source",sourceId:"field.pattern_imprint",operation:"grant",origin:"acquired",awakened:true,active:true}]}),
        command({id:"field.copy_step",label:"Imprint the demonstrated step · 2 focus units",uiSection:"methods",once:true,targetId:"oldCraftsman",coLocated:true,
            visibleWhen:all(member,eq("actor.field.method",false),eq("faculty.field.pattern_imprint.active",true)),requires:all(member,teacher,eq("faculty.field.pattern_imprint.active",true)),
            costs:[energy(focus,"use",{output:1,control:2})],description:"Observe the willing craftsman's demonstration and copy his two points of mastery. He retains his method; no unseen methods are acquired.",
            effects:[{type:"power",powerId:method,operation:"copy",target:"$target",copyMastery:true},...methodEffects("imprint")]}),
        command({id:"field.practice_step",label:"Practice the loaded application · 2 min + 1 stamina",uiSection:"methods",once:true,duration:2,cancellation:"forfeit",powerId:method,
            visibleWhen:all(eq("actor.field.method",true),eq("power.field.load_step.mastery",1)),requires:member,costs:[{type:"vital",key:"stamina",amount:-1}],
            description:"The taught ordinary step already supports careful work. This practice raises mastery to two, opening its forceful three-output application. Cancellation forfeits stamina.",effects:[{type:"power",powerId:method,operation:"refine",amount:1}]}),
        command({id:"field.project_start",label:"Commission both specialists · 3 logs + 4 coins",uiSection:"workshop",once:true,targetId:"oldCraftsman",coLocated:true,
            visibleWhen:member,requires:all(member,eq("village.craftsmanBusy",false),eq("village.shackUnlocked",true,"Earn ordinary access to the Shack first.")),costs:[money(-4)],
            description:"Two logs go to the craftsman; one goes to the pathfinder. Four coins pay their agreed work. Each contribution starts independently. The later assembly costs one coin and can be cancelled; this supplied commission is final.",
            effects:[{type:"spawn",personId:"fieldSurveyor",definitionId:"fieldSurveyor"},{type:"transfer",from:"$actor",to:"$target",key:wood,count:2},
                {type:"transfer",from:"$actor",to:"fieldSurveyor",key:wood,count:1},af("field.partsOrder",true,"$target"),wf("project.field.workshop.started"),wf("field.workshop.owner","player")]}),
        command({id:"field.inspect",label:"Ask for the agreed project and road report",uiSection:"workshop",visibleWhen:started,requires:member,
            description:"Learn the current contributions and reported road condition. Reading this report accepts no promise and spends no supplies.",effects:[...fieldProject.phases.map(p=>observe(`project.field.workshop.${p.id}`,`field.project.${p.id}`)),observe(roadKey,"field.roadKnown")]}),
        ...compileSiteProject(fieldProject),
        ...[[focus,"focus",2,1,2],[drive,"drive",1,3,1]].map(([id,name,duration,output,control])=>command({id:`field.pack_${name}`,label:`Use the workshop with ${name} · 1 log + 1 coin · ${duration} min`,uiSection:"workshop",location:"Shack",duration,cancellation:"refund",automatable:true,powerId:method,output,
            visibleWhen:all(eq("actor.field.facility",true),eq(`energy.${id}.known`,true)),requires:member,costs:[{type:"item",key:wood,amount:-1},money(-1),energy(id,"use",{output,control})],effects:[{type:"item",key:kit,amount:1}]})),
        command({id:"field.pack_applied_focus",label:"Pack carefully and learn load control · 2 min",uiSection:"workshop",location:"Shack",duration:2,cancellation:"refund",once:true,powerId:method,output:1,
            visibleWhen:all(eq("actor.field.facility",true),eq(`energy.${focus}.known`,true),eq("actor.field.method",true),eq(`power.${method}.mastery`,1)),
            requires:all(member,eq(`power.${method}.mastery`,1,"This first loaded application needs the taught careful step. Your stronger application is available after learning it.")),
            description:"Make one survey kit while learning to steady its real load. Spend one log, one coin and two measured-focus units over two minutes. Completing the packing raises Load-bearing Step mastery from one to two, opening the existing one-minute drive packing and forceful assessment. Drive still needs its own learned, recovered reserve. Previewing or cancelling grants no kit or mastery; cancellation returns reserved inputs. Repeating an already learned application adds no further mastery.",
            costs:[{type:"item",key:wood,amount:-1},money(-1),energy(focus,"use",{output:1,control:2})],
            effects:[{type:"item",key:kit,amount:1},{type:"power",powerId:method,operation:"refine",amount:1},
                {type:"knowledge",key:"field.applied_load_control",stage:"understood",value:"You steadied an actual kit through careful packing. Load-bearing Step now supports the stronger drive application; its separate reserve and ordinary materials are still needed."}]}),
        command({id:"field.repair_later",label:"Support the later road repair · 1 log + 2 min",uiSection:"road",duration:2,cancellation:"refund",once:true,
            visibleWhen:eq("actor.field.roadKnown","detour"),requires:eq(`world.${roadKey}`,"detour"),costs:[{type:"item",key:wood,amount:-1}],effects:settled("repaired")}),
        command({id:"field.assess",label:"Try a nonlethal loaded-frame assessment",uiSection:"assessment",once:true,claim:"field.assessment",targetId:"oldCraftsman",coLocated:true,participants:["$actor","$target"],encounterId:"field.assessment",
            visibleWhen:eq("actor.field.method",true),requires:all(member,teacher),description:"A practice spar checks balance under pressure. Choose ordinary stamina, precise focus or forceful drive. It pauses played time until you answer; withdrawal retains spent inputs."})
    ],
    encounters:[{id:"field.assessment",revision:1,label:"Loaded-frame assessment",lethal:false,turns:[{cue:"The craftsman pushes the loaded frame off line. Keep your feet and turn the pressure.",responses:[
        {id:"ordinary",label:"Set your stance · 3 stamina",costs:[{type:"vital",key:"stamina",amount:-3}],effects:[]},
        {id:"focus",label:"Read the pressure · 2 focus units",costs:[energy(focus,"use",{output:1,control:2})],effects:[]},
        {id:"drive",label:"Brace through the push · 3 drive units",requires:{fact:"power.field.load_step.mastery",op:"gte",value:2},costs:[energy(drive,"use",{output:3,control:1})],effects:[]}]}],settlement:[af("field.assessed"),{type:"knowledge",key:"field.assessment",stage:"understood",value:"Your chosen response kept the loaded frame steady in this nonlethal trial."}]}],
    events:compileSituation(roadScene),
    controllers:[{id:"field.survey_controller",revision:1,label:"Agreed site survey",actorId:"fieldSurveyor",interval:1,actions:[{commandId:"field.workshop.survey",priority:1}]}]
};
function fieldDefinitionsSites() {return ["field.route","field.assembly"];}
function methodEffects(origin) {return [af("field.method"),af("field.methodOrigin",origin),{type:"source",sourceId:method,operation:"grant",origin:origin === "imprint" ? "acquired" : "trained",awakened:true,active:true},
    {type:"knowledge",key:"field.step",stage:"understood",value:origin === "imprint" ? "You reproduced the demonstrated step. The craftsman still owns his own method." : "The craftsman taught the steadying step; applied practice remains yours."}];}
export function initializeFieldFacts(state) {
    for(const key of ["field.introduced","field.member","field.method","field.facility"]) state.actors.player.facts[key] ??= false;
    return state;
}
export function beginFieldWorkshop(state, registry, context) {
    const initial = state.simulation ? {state:structuredClone(state),external:context.external,gameplay:context.gameplay} : enrollSimulation(state,registry,context);
    const plan = commitSimulationCommand(initial.state,registry,{id:"field.begin"},{...context,external:initial.external,gameplay:initial.gameplay});
    return plan;
}
export function fieldWorkshopView(state) {
    const f = state.actors.player.facts;
    return {introduced:!!f["field.introduced"],member:!!f["field.member"],entry:f["field.entry"],methodOrigin:f["field.methodOrigin"],facility:!!f["field.facility"],
        project:projectView(state,fieldProject),road:f["field.roadKnown"] || "No current report",observedAt:f["field.roadKnown.observedAt"] ?? null};
}
export function fieldQuestView(state) {
    if(!state.actors.player.completed["field.project_start"])return null;
    const view=fieldWorkshopView(state),job=state.simulation?.jobs.find(j=>j.actorId === "player" && j.commandId === "field.workshop.assembly");
    return {id:"field.workshop",name:"Shared field workshop",description:"Paid commission: the craftsman shapes two supplied logs; the pathfinder surveys with one. Assembly at the Shack costs one coin. No road-repair promise is included.",
        objective:view.facility ? "Your shared workshop is assembled and ready for supported production." : job ? `Assembling at the Shack · ${Math.max(0,job.due-state.clock)} min remaining` : view.project.phases.slice(0,2).every(p=>p.knownComplete) ? "Assemble the reported contributions at the Shack." : "Ask for the specialists' agreed progress report in Village.",completed:view.facility};
}
