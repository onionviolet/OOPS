import {all, eqRaw as eq} from './basics.js';
import {enrollSimulation, commitSimulationCommand} from "./simulation.js";
import {assert} from "./simulation_contracts.js";

export const promiseId = "promise.visitor", visitorId = "promiseVisitor";
const wood=JSON.stringify({id:"Rough wood log"});
const phase=p=>eq("situation."+promiseId+".phase",p);
const shift=(from,to)=>({type:"situation",situationId:promiseId,operation:"advance",expected:[from],phase:to});
const know=(key,value,kind="observation",actor="player",attributedTo=visitorId,stage="seen")=>({type:"knowledge",actor,key:"promise."+key,stage,value,basis:{kind,attributedTo,situationId:promiseId}});
const memory=(text,amount=1)=>({type:"relationship",actor:visitorId,target:"player",axis:"trust",amount,text});
const command=d=>Object.fromEntries(Object.entries({revision:1,worldId:"base.frontier",group:"promise",actorId:"player",location:"Village",targetId:visitorId,coLocated:true,costs:[],effects:[],...d}).filter(([,v])=>v !== undefined));
const response=all(phase("introduced"),eq("situation."+promiseId+".responseOpen",true));
const npc=d=>command({actorId:visitorId,targetId:"player",coLocated:false,location:undefined,...d});

// Original proposed fiction and costs. No historical rewind is implemented.
export const promiseSources=[{id:"promise.bracing_control",revision:1,label:"Practiced ordinary bracing",kind:"technique",origin:"trained",grants:[]}];
export const promiseDefinitions={
    situations:[{id:promiseId,revision:1,label:"A remembered promise",context:{worldId:"base.frontier",instanceId:"frontier.main",continuityId:"frontier.branch",eraId:"frontier.present",regionId:"frontier.village"},
        privateTruth:{explanation:"identification_mistake",actualPromisor:"Rowan",playerMadePromise:false},participants:["player",visitorId],initialPhase:"introduced",responseWindow:8,
        phases:["introduced","investigated","helped","declined","evidence_ready","help_ready","declined_ready","unanswered_ready","met_evidence","met_help","met_declined","met_unanswered"]}],
    people:[{id:visitorId,revision:1,label:"Tamsin, mill traveler",worldId:"base.frontier",location:"Village",inventory:"simulation",provision:false,
        resources:{coins:2},body:{hands:2},vitals:{health:20,max_health:20,stamina:10,max_stamina:10}}],
    commands:[
        command({id:"promise.begin",label:"Speak to the wary traveler",targetId:undefined,coLocated:false,once:true,requires:eq("village.elderMet",true),effects:[
            {type:"spawn",personId:visitorId,definitionId:visitorId},{type:"situation",situationId:promiseId,operation:"begin"},
            know("claim",'Tamsin says: "At the mill last evening, you promised a brace for my cart. I waited until dark."',"recollection"),
            know("memory","I remember this face and voice promising a cart brace at dusk.","recollection",visitorId),
            know("belief","I think this traveler is the person who made the promise.","inference",visitorId),
            memory("Raised the old cart-brace recollection; no new agreement was made.",0)]}),
        command({id:"promise.investigate",label:"Compare the mill slip · 2 min",description:"Read the concrete details together. This accepts no repair or obligation.",duration:2,participants:["$target"],requires:all(response,{fact:"vital.health",op:"gte",value:2}),visibleWhen:phase("introduced"),
            effects:[shift("introduced","investigated"),know("slip","The slip names Rowan, a porter described as two handspans taller than you. This conflicts with Tamsin's identification.","observation","player","player"),
                know("slip","We compared the mill slip. It names Rowan and describes a taller porter.","observation",visitorId,"player"),
                know("belief","The slip contradicts my identification. I should check the name with the mill keeper.","inference",visitorId),memory("Compared the mill slip together instead of accepting an unmade promise.")]}),
        command({id:"promise.help",label:"Fit a new cart brace · 1 log + 4 stamina · 3 min",description:"A single paid act of help, with no promise about the old claim or future work.",duration:3,participants:["$target"],requires:all(response,{fact:"vital.health",op:"gte",value:2}),visibleWhen:phase("introduced"),
            costs:[{type:"transfer",from:"$actor",to:"$target",key:wood,count:1},{type:"vital",key:"stamina",amount:-4}],
            effects:[{type:"item",actor:visitorId,key:wood,amount:-1},shift("introduced","helped"),
                know("help","You fitted one new brace together. Tamsin saw this help; her earlier identification remains untested.","observation","player","player"),
                know("help","This traveler supplied a log and helped fit a brace. I can test my cart now.","observation",visitorId,"player"),memory("Supplied a real log and helped repair my cart without adopting the old promise.",2)]}),
        command({id:"promise.decline",label:"Decline the repair request",description:"No debt, penalty or new promise. Tamsin will use her own means.",requires:response,visibleWhen:phase("introduced"),effects:[shift("introduced","declined"),
            know("declined","You declined the repair request. Tamsin said she would arrange her own repair.","observation","player","player"),
            know("declined","The traveler declined this repair. I will pay a cartwright.","observation",visitorId,"player"),memory("Declined the present repair request; no agreement was broken.",0)]}),
        npc({id:"promise.check_name",label:"Tamsin pays a courier to check the mill register",duration:3,requires:all(phase("investigated"),eq("knowledge.promise.slip.seen",true)),costs:[{type:"resource",key:"coins",amount:-1}],
            effects:[shift("investigated","evidence_ready"),know("register","The mill keeper confirmed that Rowan signed for the brace. I confused two travelers at dusk.","observation",visitorId),know("belief","This traveler was not Rowan. I owe them a correction.","inference",visitorId)]}),
        npc({id:"promise.test_cart",label:"Tamsin tests the repaired cart",duration:3,requires:all(phase("helped"),eq("knowledge.promise.help.seen",true),{fact:"body.hands",op:"gte",value:1}),costs:[{type:"vital",key:"stamina",amount:-2}],effects:[shift("helped","help_ready"),know("test","The repaired cart carried a load. I can make my delivery; I still have not checked the old identification.","observation",visitorId)]}),
        ...["declined","unanswered"].map(route=>npc({id:"promise.repair_"+route,label:"Tamsin pays for her own cart repair",duration:3,
            requires:route === "declined" ? phase("declined") : all(phase("introduced"),eq("situation."+promiseId+".responseOpen",false)),costs:[{type:"resource",key:"coins",amount:-1}],
            effects:[shift(route === "declined" ? "declined" : "introduced",route+"_ready"),know("repair","I paid a cartwright from my own purse. No agreement with this traveler was made.","observation",visitorId)]})),
        command({id:"promise.meet_evidence",label:"Hear Tamsin's register reply",requires:phase("evidence_ready"),visibleWhen:phase("evidence_ready"),once:true,effects:[shift("evidence_ready","met_evidence"),
            know("later",'Tamsin says: "The keeper confirmed Rowan signed. I mistook you for him at dusk. Thank you for checking before agreeing."',"observation"),memory("Returned with the keeper's correction and acknowledged the mistaken identity.",2)]}),
        command({id:"promise.meet_help",label:"Ask how the repaired cart fared",requires:phase("help_ready"),visibleWhen:phase("help_ready"),once:true,effects:[shift("help_ready","met_help"),
            know("later",'Tamsin says: "The brace held. I can finish my delivery. I still remember that conversation, but the help today was yours."',"observation"),memory("Returned after testing the brace; present help is distinct from the old recollection.",1)]}),
        command({id:"promise.hear_bracing",label:"Ask for the bracing description",once:true,requires:{any:[phase("met_help"),phase("met_evidence")]},visibleWhen:{any:[phase("met_help"),phase("met_evidence")]},
            effects:[know("bracing_report","Tamsin recalls: lay sound wood along the load, then bind across the grain. This description alone is not practiced control.","recollection")]}),
        command({id:"promise.lesson",label:"Practice bracing with Tamsin · 2 stamina · 2 min",description:"After your shared repair, she corrects your grip and pressure. This earns an ordinary execution method.",once:true,duration:2,participants:["$target"],
            requires:all(phase("met_help"),{fact:"vital.health",op:"gte",value:2},{fact:"strength",op:"gte",value:6}),visibleWhen:phase("met_help"),costs:[{type:"vital",key:"stamina",amount:-2}],
            effects:[know("bracing","You practiced grip and cross-grain pressure with Tamsin. Sound wood and controlled force can make a reusable survey brace.","instruction","player",visitorId,"understood"),
                {type:"source",sourceId:"promise.bracing_control",operation:"grant",origin:"trained",awakened:true,active:true},memory("Taught the bracing grip after our successful repair.")]}),
        command({id:"promise.pack_brace",label:"Pack a braced survey kit · 1 log + 2 stamina · 2 min",description:"Use the practiced method on your own wood. Reserved inputs return if cancelled.",targetId:undefined,coLocated:false,duration:2,cancellation:"refund",
            visibleWhen:eq("knowledge.promise.bracing.understood",true),requires:all(eq("knowledge.promise.bracing.understood",true),eq("knowledge.promise.bracing.basis","instruction"),
                eq("faculty.promise.bracing_control.active",true),{fact:"vital.health",op:"gte",value:2},{fact:"strength",op:"gte",value:6}),
            costs:[{type:"item",key:wood,amount:-1},{type:"vital",key:"stamina",amount:-2}],effects:[{type:"item",key:JSON.stringify({id:"Prepared survey kit"}),amount:1}]}),
        ...["declined","unanswered"].map(route=>command({id:"promise.meet_"+route,label:"Hear how Tamsin continued",requires:phase(route+"_ready"),visibleWhen:phase(route+"_ready"),once:true,effects:[shift(route+"_ready","met_"+route),
            know("later",route === "declined" ? 'Tamsin says: "I paid the cartwright. We made no agreement, so there is nothing to settle between us."' : 'Tamsin says: "I did not hear back, so I paid the cartwright. I assumed no promise from your silence."',"observation"),memory("Paid for my own repair and reported it at our next meeting.",0)]}))
    ],
    controllers:[{id:"promise.visitor_plan",revision:1,label:"Tamsin's current cart plan",actorId:visitorId,interval:1,actions:[
        {commandId:"promise.check_name",priority:3,targetId:"player",when:phase("investigated")},{commandId:"promise.test_cart",priority:2,targetId:"player",when:phase("helped")},
        {commandId:"promise.repair_declined",priority:1,targetId:"player",when:phase("declined")},{commandId:"promise.repair_unanswered",priority:1,targetId:"player",when:phase("introduced")}]}]
};

export function beginPromiseVisitor(state,registry,context,expectedSequence=state.sequence) {
    assert(expectedSequence === state.sequence,"This introduction is stale.");
    context={...context,targetId:null};
    const enrolled=state.simulation ? {state,external:context.external,gameplay:context.gameplay} : enrollSimulation(state,registry,context,expectedSequence);
    return commitSimulationCommand(enrolled.state,registry,{id:"promise.begin"},{...context,external:enrolled.external,gameplay:enrolled.gameplay});
}
// Player-facing text comes only from that player's own discovered records.
export function promiseView(state) {
    const known=state.simulation?.knowledge.player || {};
    return {introduced:!!known["promise.claim"],details:Object.entries(known).filter(([k])=>k.startsWith("promise.")).map(([key,k])=>({key,text:k.value,at:k.at,basis:k.basis}))};
}
