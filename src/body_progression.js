import {enrollSimulation, commitSimulationCommand} from "./simulation.js";

export const SORE_HANDS = "body.sore_hands", SCRAPED_HANDS = "body.scraped_hands";
export const NATURAL_BALANCE = "body.natural_balance", CONDITIONED_GRIP = "body.conditioned_grip", PALM_MARK = "body.palm_mark";
const eq = (fact,value,reason) => ({fact,op:"eq",value,...(reason?{reason}:{})});
const yes = eq("actor.body.enrolled",true,"Begin a body record first.");
const village = eq("location","Village","Return to Village.");
const fact = (key,value=true) => ({type:"fact",scope:"actor",key,value});
const body = key => ({type:"body",key,value:true});
const grant = (sourceId,origin,awakened=true) => ({type:"source",operation:"grant",sourceId,origin,awakened,active:awakened});
const condition = (id,operation,duration) => ({type:"condition",id,operation,...(duration?{duration}:{})});
const command = d => ({revision:1,worldId:"base.frontier",actorId:"player",group:"body",costs:[],effects:[],...d});
const wood=JSON.stringify({id:"Rough wood log"}), kit=JSON.stringify({id:"Prepared survey kit"});

export const bodySources = [
    {id:NATURAL_BALANCE,revision:1,label:"Natural balance",kind:"trait",origin:"inherited",bioDetail:"An innate aptitude; its ancestry remains uncertain.",grants:[{capability:"frontier.preparation",amount:1}]},
    {id:CONDITIONED_GRIP,revision:1,label:"Conditioned grip",kind:"trait",origin:"trained",bioDetail:"Palms toughened through repeated practice.",grants:[{capability:"frontier.carry",amount:1},{capability:"body.hand_control",amount:1}]},
    {id:PALM_MARK,revision:1,label:"Palm mark",kind:"trait",origin:"acquired",bioDetail:"A visible mark from rough timber work.",grants:[]},
];
export const bodyCapabilities=[{id:"body.hand_control",label:"Hand control",stacking:"max",providers:[]}];
export const bodyConditions = [
    {id:SORE_HANDS,revision:1,label:"Sore hands",stacking:"max",bioVisible:true,bioDetail:"Grip drills need recovery; packing and marker work take longer."},
    {id:SCRAPED_HANDS,revision:1,label:"Scraped palms",stacking:"max",bioVisible:true,bioDetail:"Tender palms slow packing and marker work. Rest or played time brings recovery."},
];
const showHands = (id,label,requires,key,text) => command({id,label,group:"social",location:"Village",targetId:"oldCraftsman",coLocated:true,once:true,
    visibleWhen:{all:[yes,requires]},requires:{all:[yes,village,requires,eq("village.craftsmanMet",true,"Meet the old craftsman first.")]},
    description:"Show the change to the craftsman. He remembers what he can observe; this grants no regional reputation.",
    effects:[{type:"knowledge",actor:"$target",key:`person.player.${key}`,stage:"seen",value:text},
        {type:"relationship",actor:"$target",target:"$actor",axis:"familiarity",amount:1,text},
        {type:"knowledge",key:`body.feedback.${key}`,stage:"seen",value:text}]});

export const bodyCommands = [
    command({id:"body.begin",label:"Begin a body record",once:true,location:"Village",visibleWhen:eq("actor.body.enrolled",false),
        requires:{all:[village,eq("village.elderMet",true,"Meet the Village elder first.")]},
        description:"Follow your training, recovery and visible changes. This also follows local people and work. It introduces no aging or closed-browser losses.",
        effects:[fact("body.enrolled"),fact("body.gripLearned",false),grant(NATURAL_BALANCE,"inherited",false)]}),
    command({id:"body.study_balance",label:"Study your footing · 2 min",once:true,location:"Village",duration:2,cancellation:"forfeit",
        visibleWhen:{all:[yes,eq(`faculty.${NATURAL_BALANCE}.awakened`,false)]},requires:yes,
        description:"Look for the balance that comes naturally to your body. Two game minutes, no fee; cancelling earns nothing.",
        effects:[{type:"faculty",sourceId:NATURAL_BALANCE,operation:"awaken"},{type:"faculty",sourceId:NATURAL_BALANCE,operation:"activate"},
            {type:"knowledge",key:"body.balance",stage:"understood",value:"You steady yourself without the taught correction. The aptitude is innate; its ancestry is still unknown."}]}),
    command({id:"body.grip_drill",label:"Practice careful grips · 3 min · 2 stamina",location:"Village",duration:3,cancellation:"forfeit",
        visibleWhen:{all:[yes,eq("actor.body.gripLearned",false)]},requires:{all:[yes,eq("body.handsTender",false,"Let your hands recover first.")]},
        description:"Three game minutes and two stamina. Completion gives six Climbing XP and one practice, followed by twelve minutes of soreness. Cancellation forfeits stamina and earns no practice.",
        costs:[{type:"vital",key:"stamina",amount:-2}],effects:[{type:"xp",skill:"Climbing",amount:6},{type:"resource",key:"grip_practice",amount:1},condition(SORE_HANDS,"apply",12)]}),
    command({id:"body.condition_grip",label:"Keep the practiced grip",once:true,location:"Village",
        visibleWhen:{all:[yes,{fact:"resource.grip_practice",op:"gte",value:2}]},requires:{all:[yes,eq("body.handsTender",false,"Recover before finishing the lesson.")]},
        description:"Two completed drills and recovered hands retain a conditioned grip. It provides carry capability and makes packing and marker work one minute quicker.",
        effects:[grant(CONDITIONED_GRIP,"trained"),fact("body.gripLearned"),body("palms.callused"),{type:"knowledge",key:"body.grip",stage:"understood",value:"Repeated practice has toughened your palms. This change came from training."}]}),
    command({id:"body.rough_kit",label:"Shape a rough kit · 1 log + 1 coin · 3 min",once:true,location:"Village",duration:3,cancellation:"refund",
        visibleWhen:yes,requires:{all:[yes,eq("body.handsTender",false,"Let your hands recover first.")]},
        description:"A cheap kit made from rough timber. One log, one coin and three minutes. Completion scrapes your palms for twenty minutes and leaves a mark. Cancelling returns the log and coin. No health loss.",
        costs:[{type:"item",key:wood,amount:-1},{type:"resource",key:"money",native:true,amount:-1}],
        effects:[{type:"item",key:kit,amount:1},condition(SCRAPED_HANDS,"apply",20),body("palms.marked"),grant(PALM_MARK,"acquired")]}),
    command({id:"body.recover",label:"Rest your hands · 3 min",duration:3,cancellation:"forfeit",
        visibleWhen:{all:[yes,eq("body.handsTender",true)]},requires:{all:[yes,{any:[village,eq("location","Shack")]}]},
        description:"Three game minutes, no fee. Clears hand soreness and the temporary scrape; learned grip and any lasting mark remain. Waiting also brings recovery.",
        effects:[condition(SORE_HANDS,"remove"),condition(SCRAPED_HANDS,"remove")]}),
    showHands("body.show_soreness","Let him see your tender hands",eq("body.handsTender",true),"tender_hands","He sees you flexing your tender hands: 'Give them a quiet spell before more work.'"),
    showHands("body.show_calluses","Show your practiced grip",eq("body.callused",true),"callused_hands","He examines the worked palms: 'That grip has been practiced. Keep the care that taught it.'"),
    showHands("body.show_mark","Let him see the palm mark",eq("body.marked",true),"palm_mark","He notices the mark left by rough timber: 'The edge caught you. Smooth it before the next kit.'"),
    showHands("body.show_footing","Demonstrate your steady footing",eq(`faculty.${NATURAL_BALANCE}.active`,true),"steady_footing","He watches the steady steps: 'That part seems to come easily to you.'"),
];

export function bodyFacts(state) {
    const conditions=state.simulation?.conditions.player || {}, current=id=>conditions[id]?.intensity > 0 && (conditions[id].expiresAt==null || conditions[id].expiresAt>state.clock);
    return {"body.handsTender":!!(current(SORE_HANDS)||current(SCRAPED_HANDS)),
        "body.callused":state.simulation?.people.player?.body?.["palms.callused"]===true,
        "body.marked":state.simulation?.people.player?.body?.["palms.marked"]===true};
}
export function beginBodyRecord(state,registry,context) {
    const enrollment=state.simulation ? null : enrollSimulation(state,registry,context);
    const base=enrollment?.state || state;
    const out=commitSimulationCommand(base,registry,{id:"body.begin"},{...context,
        external:enrollment?.external || context.external,gameplay:enrollment?.gameplay || context.gameplay});
    if(enrollment) {out.acquisitions=[...enrollment.acquisitions,...out.acquisitions];out.unlocks=[...enrollment.unlocks,...out.unlocks];}
    return out;
}
export function bodyScene(state) {
    if(!state.actors.player.facts["body.enrolled"]) return "Your earlier life is still unclear. You can begin recording what training and work change now.";
    const parts=[bodyFacts(state)["body.handsTender"] ? "Your palms are tender when you flex them." : "Your hands have settled."];
    if(bodyFacts(state)["body.callused"]) parts.push("A firmer surface has formed where your palms meet the grip.");
    if(bodyFacts(state)["body.marked"]) parts.push("A line from the rough timber remains on one palm.");
    return parts.join(" ");
}
