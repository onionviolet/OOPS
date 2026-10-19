import {eqRaw as req} from './basics.js';
const wood = JSON.stringify({id:"Rough wood log"}), kit = JSON.stringify({id:"Prepared survey kit"});
const fact = (key,value,actor = "$actor") => ({type:"fact",scope:"actor",key,value,actor});
const command = d => ({revision:1,worldId:"base.frontier",costs:[],effects:[],...d});
const role = "village.route_helper", encounter = "village.helper_crossing", report = "village.helper_report";

// A small original service demonstrates independent actors. It does not create
// a second realm, enroll a life clock or replace the original Village story.
export const helperDefinitions = {
    people:[{id:role,revision:1,label:"Hired pathfinder",provision:false,inventory:"simulation",worldId:"base.frontier",location:"Village road",
        resources:{focus:2,care:1},vitals:{health:12,max_health:12,stamina:6,max_stamina:6}}],
    commands:[
        command({id:"village.hire_helper",actorId:"player",location:"Village",label:"Hire a pathfinder · 1 log + 3 coins",
            visibleWhen:req("knowledge.workbench.understood",true),requires:req("village.craftsmanMet",true),
            costs:[{type:"resource",native:true,key:"money",amount:-3}],
            effects:[{type:"spawn",definitionId:role,instanceKey:"helper"},
                {type:"transfer",from:"$actor",to:"$spawn.helper",key:wood,count:1},
                {type:"knowledge",key:"helpers.agreement",stage:"seen",value:"A pathfinder has agreed to check the nearby road and bring back a usable kit. Ask again in the Village."},
                {type:"relationship",actor:"$spawn.helper",target:"$actor",axis:"trust",amount:1,text:"Received the agreed supplies for a local road check."}]}),
        command({id:"village.helper_survey",actorDefinitionId:role,location:"Village road",label:"Check the nearby road",once:true,encounterId:encounter,
            costs:[{type:"vital",key:"stamina",amount:-2}]}),
        command({id:"village.helper_return",actorDefinitionId:role,location:"Village road",label:"Prepare the kit and return to the Village",once:true,duration:2,
            requires:req("actor.report.ready",true),costs:[{type:"item",key:wood,amount:-1}],
            effects:[{type:"item",key:kit,amount:1},{type:"relocate",location:"Village"},fact("helper.ready",true)]}),
        command({id:"village.collect_helper",actorId:"player",targetDefinitionId:role,coLocated:true,location:"Village",label:"Collect the pathfinder's kit",
            costs:[{type:"transfer",from:"$target",to:"$actor",key:kit,count:1}],
            effects:[{type:"knowledge",key:"helpers.return",stage:"understood",value:"The pathfinder checked their footing, finished the road check and returned with your kit."},
                {type:"relationship",actor:"$target",target:"$actor",axis:"trust",amount:1,text:"Handed over the completed kit."},
                {type:"life",actor:"$target",status:"departed",reason:"Local commission delivered; left to find other work."}]})
    ],
    encounters:[{id:encounter,revision:1,label:"A narrow crossing",lethal:false,
        turns:[{cue:"A loose plank shifts underfoot.",responses:[{id:"check",label:"Check the footing",costs:[{type:"resource",key:"focus",amount:-1}],effects:[]}]},
            {cue:"The firm bank is within reach.",responses:[{id:"cross",label:"Take the firm bank",costs:[{type:"vital",key:"stamina",amount:-1}],effects:[fact("road.checked",true)]}]}],
        settlement:[{type:"event",eventId:report,delay:1}]}],
    events:[{id:report,revision:1,label:"The pathfinder finishes examining the road",automatic:false,aware:true,interval:1,lifetime:4,maxOccurrences:1,
        mode:"offer",chance:{fact:"resource.care",scale:0.25,min:0,max:1},guaranteeAfter:3,
        responses:[{id:"note",label:"Record the route and head back",costs:[{type:"vital",key:"stamina",amount:-1}],
            effects:[fact("report.ready",true),{type:"knowledge",key:"road.crossing",stage:"understood",value:"The bank holds when the loose plank is avoided."}]}],
        onExpire:[fact("report.ready",true)]}],
    controllers:[{id:"village.helper_controller",revision:1,label:"Pathfinder's local plan",actorId:role,interval:1,
        actions:[{kind:"event",eventId:report,responseId:"note",priority:5},
            {kind:"encounter",encounterId:encounter,responseId:"check",priority:4},
            {kind:"encounter",encounterId:encounter,responseId:"cross",priority:3},
            {commandId:"village.helper_return",priority:2},{commandId:"village.helper_survey",priority:1}]}]
};
