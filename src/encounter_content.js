// Original reversible proofs of distinct discovery and trigger policies. These
// are not a selected antagonist roster, lethal policy or direct book setting.
import {all, eqRaw as eq} from './basics.js';
const member=eq("actor.field.member",true);
const source=(sourceId,actor)=>({type:"source",sourceId,actor,operation:"grant",awakened:true,active:true});
const command=d=>({revision:1,group:"pursuit",actorId:"player",worldId:"base.frontier",costs:[],effects:[],...d});
const c=(pursuitId,operation,extra={})=>({type:"pursuit",pursuitId,operation,...extra});
const notice=(id,value)=>({type:"knowledge",key:`${id}.notice`,stage:"seen",value});
const spawn=id=>({type:"spawn",personId:id,definitionId:id});
const profiles=[
    {id:"village.ink_test",actorId:"inkTracker",label:"Sela's marked-trail test",prefix:"marked",faculty:"frontier.ink_sense",markId:"frontier.ink_mark",mode:"signature",supplies:9,
        description:"An optional signature-tracking test. Sela can sense your agreed ink mark in Village and the Shack, spending their own focus. Ordinary cover or removing the mark breaks detection. The Shack remains shelter; old witnessed leads can still be searched.",
        contact:"Sela senses your agreed ink mark and offers a nonlethal test. Finish your current activity before answering."},
    {id:"village.heavenly_summons",actorId:"writEnvoy",label:"Timed heavenly writ",prefix:"writ",faculty:"frontier.heavenly_writ",mode:"authority",supplies:8,timer:4,
        description:"A reversible heavenly-authority demonstration. Four played minutes after accepting, an envoy can locate and manifest beside you anywhere in this realm. Ordinary concealment and the Shack do not block this writ. The summons waits through combat and has no response deadline or unattended damage.",
        contact:"The declared heavenly writ locates you despite ordinary cover. Its envoy waits for your current activity to finish. The summons will remain until you answer or dismiss this demonstration."},
    {id:"village.workshop_review",actorId:"workshopReviewer",label:"Workshop consequence review",prefix:"review",faculty:"frontier.site_writ",mode:"authority",supplies:8,project:true,
        description:"Arrange a review triggered by completing your shared workshop. Its reviewer can locate the owner by the agreed site writ. No encounter occurs before the actual assembly completes. This reversible nonlethal proof has no unattended damage.",
        contact:"Your completed workshop triggers the agreed inspection. A reviewer waits for you to finish your current activity."}
];
export const encounterSources=[
    {id:"frontier.ink_mark",revision:1,label:"Agreed ink mark",kind:"condition",grants:[]},
    ...profiles.map(p=>({id:p.faculty,revision:1,label:`${p.label} locator`,kind:"trait",grants:[]}))
];
export const encounterDefinitions={people:[],pursuits:[],commands:[],encounters:[],events:[]};
for(const p of profiles) {
    const noteKey=`${p.id}.notice`,startId=`${p.prefix}.begin`,encounterId=`${p.prefix}.encounter`,acceptId=`${p.prefix}.accept`;
    encounterDefinitions.people.push({id:p.actorId,revision:1,label:p.label,worldId:"base.frontier",location:"Village",inventory:"simulation",provision:false,resources:{focus:p.supplies}});
    encounterDefinitions.pursuits.push({id:p.id,revision:1,label:p.label,actorId:p.actorId,targetId:"player",encounterCommand:acceptId,supply:"focus",noticeKey:noteKey,
        investigationMinutes:1,investigationSupply:1,movementSupply:1,searchMinutes:1,searchSupply:1,leadLifetime:18,requestLifetime:p.mode === "authority" ? 0 : 12,pollMinutes:1,
        detection:{mode:p.mode,facultyId:p.faculty,cost:p.mode === "authority" ? 0 : 1,...(p.markId ? {markId:p.markId} : {})},
        contactText:p.contact,shelterText:"Sela respects the agreed private shelter and waits outside the Shack.",routes:[{from:"Village",to:"Shack",minutes:3},{from:"Shack",to:"Village",minutes:3}],sanctuaries:p.mode === "authority" ? [] : ["Shack"]});
    const beginEffects=[spawn(p.actorId),source(p.faculty,p.actorId),c(p.id,"begin")];
    let effects;
    if(p.timer || p.project) {
        const eventId=`${p.prefix}.trigger`;
        effects=[...(p.project ? [{type:"fact",scope:"actor",key:"review.requested",value:true}] : []),{type:"event",eventId,delay:p.timer || 1},notice(p.id,p.project ? "You arranged a review after the workshop's actual assembly. It has not been summoned yet." : `You accepted a heavenly writ due in ${p.timer} played minutes. Ordinary cover will not prevent its envoy from locating you.`)];
        encounterDefinitions.events.push({id:eventId,revision:1,label:p.label,group:"pursuit",actorId:"player",interval:1,chance:1,maxOccurrences:1,mode:"ambient",automatic:false,public:false,
            ...(p.project ? {requires:all(eq("actor.review.requested",true),eq("actor.field.facility",true))} : {}),effects:beginEffects});
    } else effects=[source(p.markId,"player"),...beginEffects,notice(p.id,p.description)];
    encounterDefinitions.commands.push(
        command({id:startId,trackId:p.id,location:"Village",label:p.project ? "Arrange a review after workshop assembly" : p.timer ? "Accept a timed heavenly writ · 4 min" : "Arrange the marked-trail test",once:true,visibleWhen:member,requires:member,description:p.description,effects}),
        command({id:`${p.prefix}.decline`,trackId:p.id,label:p.mode === "authority" ? "Dismiss this demonstration" : "Call off the marked-trail test",visibleWhen:eq(`pursuit.${p.id}.active`,true),requires:eq(`pursuit.${p.id}.active`,true),effects:[c(p.id,"close",{result:"declined"})]}),
        command({id:`${p.prefix}.settle`,trackId:p.id,label:"Settle the meeting peacefully · 1 coin",targetId:p.actorId,coLocated:true,visibleWhen:eq(`pursuit.${p.id}.contact`,true),requires:eq(`pursuit.${p.id}.contact`,true),costs:[{type:"resource",native:true,key:"money",amount:-1}],effects:[c(p.id,"close",{result:"settled"}),{type:"relationship",target:"$target",axis:"respect",amount:1,text:"Settled the agreed meeting peacefully."}]}),
        command({id:acceptId,trackId:p.id,pursuitId:p.id,label:"Answer the nonlethal encounter",targetId:p.actorId,coLocated:true,participants:["$actor","$target"],encounterId,requires:eq(`pursuit.${p.id}.contact`,true)}),
        command({id:`${p.prefix}.report`,trackId:p.id,location:"Village",label:"Ask for the agreed follow-up report",visibleWhen:eq(`pursuit.${p.id}.known`,true),requires:eq(`pursuit.${p.id}.known`,true),effects:[c(p.id,"report")]})
    );
    if(p.markId)encounterDefinitions.commands.push(
        command({id:"marked.remove",trackId:p.id,label:"Wash off the ink mark · 1 coin + 2 min",duration:2,cancellation:"refund",visibleWhen:eq("faculty.frontier.ink_mark.active",true),requires:eq("faculty.frontier.ink_mark.active",true),costs:[{type:"resource",native:true,key:"money",amount:-1}],effects:[{type:"source",sourceId:p.markId,operation:"suppress"},notice(p.id,"You washed off the agreed ink mark. Sela can search their last legitimate lead, but can no longer sense your new position.")]}),
        command({id:"marked.conceal",trackId:p.id,label:"Mask this trail · 2 stamina + 2 min",duration:2,cancellation:"forfeit",visibleWhen:eq(`pursuit.${p.id}.active`,true),requires:eq(`pursuit.${p.id}.active`,true),costs:[{type:"vital",key:"stamina",amount:-2}],effects:[c(p.id,"conceal"),notice(p.id,"You masked this agreed trail, blocking the ink-sense test's later detections.")]})
    );
    encounterDefinitions.encounters.push({id:encounterId,revision:1,label:p.label,lethal:false,turns:[{cue:p.mode === "signature" ? "Sela follows the mark rather than your feint. Hold a steady line against the light tag." : "The envoy's writ finds you regardless of the path you took. The agreed demonstration asks for a controlled bow under its pressure.",responses:[
        {id:"steady",label:"Hold your stance · 2 stamina",costs:[{type:"vital",key:"stamina",amount:-2}],effects:[]},
        {id:"explain",label:"Ask for the terms and conclude peacefully",effects:[]}
    ]}],settlement:[c(p.id,"close",{result:"tested"}),notice(p.id,`You completed ${p.label}. Its method of finding you and its trigger remain recorded; this demonstration grants no combat reward.`)]});
}
