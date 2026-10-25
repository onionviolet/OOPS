import {RF1_DEFINITION} from './rehearsed_foe.js';
import {all, eqNoReason as eq} from './basics.js';
import {commitSimulationCommand,previewSimulationCommand, previewCampaignTransition, commitCampaignTransition} from "./simulation.js";
import {validateExpansionState} from "./expansion_engine.js";
import {moneyNativeKey as money} from './content_kit.js';

export const ROAD_RIVAL = "roadRival", RIVAL_PURSUIT = "frontier.road_rival";
const wood=JSON.stringify({id:"Rough wood log"}),kit=JSON.stringify({id:"Prepared survey kit"}),rope=JSON.stringify({id:"Survey rope"});
const fact=(key,value=true)=>({type:"fact",scope:"actor",key,value});
const item=(key,amount)=>({type:"item",key,amount});
const member=eq("actor.field.member"),facility=eq("actor.field.facility");
const command=d=>{const value={revision:1,worldId:"base.frontier",actorId:"player",location:"Village",costs:[],effects:[],...d};if(!value.location)delete value.location;return value;};
const close=result=>({type:"pursuit",pursuitId:RIVAL_PURSUIT,operation:"close",result});
export const campaignSources=[
    {id:"frontier.rival_insight",revision:1,label:"Contested footing",kind:"knowledge",bioDetail:"A resolved road rivalry taught you how another traveler contests a route.",grants:[{capability:"frontier.preparation",amount:1}]},
    {id:"frontier.field_legacy",revision:1,label:"Field legacy",kind:"knowledge",bioDetail:"You rebuilt your applied training after completing a field apprenticeship.",grants:[{capability:"frontier.preparation",amount:1}]}
];
export const campaignDefinitions={
    powers:[RF1_DEFINITION],
    people:[{id:ROAD_RIVAL,revision:1,label:"Mara, road rival",worldId:"base.frontier",location:"Village",inventory:"simulation",provision:false,
        resources:{provisions:6},vitals:{health:26,max_health:26,stamina:12,max_stamina:12},
        body:{attack:5,agility:5,dexterity:6,intuition:5,attack_speed:.8,defense:1,crit_rate:.05,crit_multiplier:1.3,attack_count:1}}],
    pursuits:[{id:RIVAL_PURSUIT,revision:1,label:"Mara's road challenge",actorId:ROAD_RIVAL,targetId:"player",encounterCommand:"rival.confront",supply:"provisions",
        investigationMinutes:1,investigationSupply:1,movementSupply:1,searchMinutes:2,searchSupply:1,leadLifetime:20,requestLifetime:20,pollMinutes:1,
        routes:[{from:"Village",to:"Shack",minutes:3},{from:"Shack",to:"Village",minutes:3}],sanctuaries:["Shack"],noticeKey:"rival.notice",contactText:"Mara followed your witnessed trail and requests the agreed road duel. Finish your current activity before accepting."}],
    encounters:[{id:"rival.native_duel",revision:1,label:"Contested footing",lethal:false,
        turns:[{cue:"Mara waits for the agreed duel. Native strikes spend stamina and retain injuries; you can withdraw.",responses:[{id:"withdraw",label:"Withdraw",effects:[]}]}],settlement:[]}],
    commands:[
        command({id:"rival.begin",group:"rival",label:"Meet the rival road scout",once:true,visibleWhen:member,requires:member,
            description:"An optional dispute over an association route. Mara pays her own pursuit supplies; the Shack offers shelter. Combat is nonlethal, with lasting wounds until recovery. Settlement and withdrawal are available.",
            effects:[{type:"spawn",personId:ROAD_RIVAL,definitionId:ROAD_RIVAL},{type:"pursuit",pursuitId:RIVAL_PURSUIT,operation:"begin"},fact("rival.met"),
                {type:"knowledge",key:"rival.notice",stage:"seen",value:"You met Mara at the Village. She will follow witnessed route leads to request a contest; the Shack remains private shelter."}]}),
        command({id:"rival.confront",group:"rival",label:"Accept the native combat duel",location:undefined,pursuitId:RIVAL_PURSUIT,targetId:ROAD_RIVAL,coLocated:true,participants:["$actor","$target"],encounterId:"rival.native_duel",
            visibleWhen:eq(`pursuit.${RIVAL_PURSUIT}.contact`),requires:eq(`pursuit.${RIVAL_PURSUIT}.contact`),description:"Normal native strikes, blocks and evasion. Each strike spends one stamina before efficiency; empty stamina halves attack power. Both stop at one HP. No ordinary enemy loot, kill XP or location-clear reward is granted."}),
        command({id:"rival.settle",group:"rival",label:"Settle the route dispute · 1 kit",location:undefined,targetId:ROAD_RIVAL,coLocated:true,
            visibleWhen:eq(`pursuit.${RIVAL_PURSUIT}.contact`),requires:eq(`pursuit.${RIVAL_PURSUIT}.contact`),costs:[{type:"transfer",from:"$actor",to:"$target",key:kit,count:1}],
            effects:[close("settled"),fact("rival.resolved"),{type:"source",sourceId:"frontier.rival_insight",operation:"grant",awakened:true,active:true},
                {type:"relationship",target:"$target",axis:"respect",amount:1,text:"Settled the route dispute with actual field supplies."}]}),
        command({id:"rival.hide",group:"rival",label:"Mask the trail · 2 stamina + 2 min",location:undefined,duration:2,cancellation:"forfeit",
            visibleWhen:eq(`pursuit.${RIVAL_PURSUIT}.active`),requires:eq(`pursuit.${RIVAL_PURSUIT}.active`),costs:[{type:"vital",key:"stamina",amount:-2}],effects:[{type:"pursuit",pursuitId:RIVAL_PURSUIT,operation:"conceal"}]}),
        command({id:"rival.decline",group:"rival",label:"Call off this contest",location:undefined,visibleWhen:eq(`pursuit.${RIVAL_PURSUIT}.active`),requires:eq(`pursuit.${RIVAL_PURSUIT}.active`),effects:[close("declined")]}),
        command({id:"rival.report",group:"rival",label:"Ask for Mara's current road report",visibleWhen:eq("actor.rival.met"),requires:eq("actor.rival.met"),effects:[{type:"pursuit",pursuitId:RIVAL_PURSUIT,operation:"report"}]}),
        command({id:"rival.recover",group:"rival",label:"Help Mara recover · 1 kit + 3 min",targetId:ROAD_RIVAL,coLocated:true,participants:["$actor","$target"],duration:3,cancellation:"refund",
            visibleWhen:all(eq("actor.rival.met"),eq(`pursuit.${RIVAL_PURSUIT}.active`,false)),requires:eq(`pursuit.${RIVAL_PURSUIT}.active`,false),
            costs:[item(kit,-1)],effects:[{type:"vital",actor:"$target",key:"health",amount:26},{type:"vital",actor:"$target",key:"stamina",amount:12},
                {type:"resource",actor:"$target",key:"provisions",amount:6},fact("rival.rematchReady"),{type:"relationship",target:"$target",axis:"trust",amount:1,text:"Supplied recovery after a road contest."}]}),
        command({id:"rival.rematch",group:"rival",label:"Arrange another road contest",visibleWhen:eq("actor.rival.rematchReady"),requires:all(eq("actor.rival.rematchReady"),eq(`pursuit.${RIVAL_PURSUIT}.active`,false)),
            effects:[fact("rival.rematchReady",false),{type:"pursuit",pursuitId:RIVAL_PURSUIT,operation:"begin"}]}),
        command({id:"field.study_rope",group:"field",uiSection:"workshop",location:"Shack",label:"Study a reusable rope · 2 min",once:true,duration:2,cancellation:"forfeit",
            visibleWhen:facility,requires:facility,effects:[fact("field.ropeRecipe")],description:"Study the workshop's known lashing plan. This teaches a recipe; it does not create rope."}),
        command({id:"field.make_rope",group:"field",uiSection:"workshop",location:"Shack",label:"Make a survey rope · 2 logs + 2 coins + 3 min",duration:3,cancellation:"refund",automatable:true,
            visibleWhen:eq("actor.field.ropeRecipe"),requires:facility,costs:[item(wood,-2),money(-2)],effects:[item(rope,1),{type:"xp",skill:"Climbing",amount:3}]}),
        command({id:"field.dry_rack",group:"field",uiSection:"workshop",location:"Shack",label:"Build a dry-stock rack · 3 logs + 2 coins + 4 min",once:true,duration:4,cancellation:"refund",
            visibleWhen:all(facility,eq("actor.field.dryRack",false)),requires:facility,costs:[item(wood,-3),money(-2)],effects:[fact("field.dryRack")],
            description:"A permanent workshop upgrade. Pack two kits together without energy, including while the Village bench is wet."}),
        command({id:"field.rack_batch",group:"field",uiSection:"workshop",location:"Shack",label:"Pack a dry-stock batch · 2 logs + 1 coin + 3 min",duration:3,cancellation:"refund",automatable:true,
            visibleWhen:eq("actor.field.dryRack"),requires:facility,costs:[item(wood,-2),money(-1)],effects:[item(kit,2),{type:"resource",key:"field_batches",amount:1}]}),
        command({id:"field.accept_supply",group:"field",uiSection:"workshop",label:"Accept the association supply commission",once:true,visibleWhen:facility,requires:facility,
            description:"Agree to supply either three actual kits or one crafted/bought survey rope. Payment is six coins once; there is no deadline or automatic debt.",effects:[fact("field.supplyAccepted")]}),
        ...[["kits",kit,3],["rope",rope,1]].map(([id,key,count])=>command({id:`field.deliver_${id}`,group:"field",uiSection:"workshop",label:`Deliver ${count} ${id === "kits" ? "kits" : "survey rope"} · receive 6 coins`,
            visibleWhen:all(eq("actor.field.supplyAccepted"),eq("actor.field.supplyDone",false)),requires:all(eq("actor.field.supplyAccepted"),eq("actor.field.supplyDone",false)),
            costs:[item(key,-count)],effects:[money(6),fact("field.supplyDone"),fact("field.supplyRoute",id),{type:"relationship",target:"oldCraftsman",axis:"respect",amount:1,text:"Delivered the agreed association supplies."}]}))
    ],
    transitions:[{id:"frontier.field_renewal",revision:1,label:"Renew the field apprenticeship",kind:"replay",worldId:"base.frontier",
        requires:all(facility,eq("actor.field.dryRack"),eq("actor.field.supplyDone"),eq("actor.rival.resolved"),eq("actor.field.renewed",false),{fact:"power.field.load_step.mastery",op:"gte",value:2}),
        reset:[],retain:["Native adventure, XP, equipment and belongings","Known people, memories, route knowledge and techniques","Workshop, dry rack and learned recipes"],
        effects:[fact("field.renewed"),{type:"source",sourceId:"frontier.field_legacy",operation:"grant",origin:"trained",awakened:true,active:true}],
        description:"One optional prestige: rebuild applied field mastery and stored energy into a lasting field legacy."}]
};

export function initializeCampaignFacts(state) {
    for(const key of ["field.dryRack","field.supplyDone","field.renewed","rival.resolved"]) state.actors.player.facts[key] ??= false;
    return state;
}
export function fieldSupplyQuestView(state) {
    const f=state.actors.player.facts;
    if(!f["field.supplyAccepted"]) return null;
    return {id:"field.supplies",name:"Association supplies",description:"Supply three prepared kits or one survey rope for six coins. There is no deadline or automatic debt.",
        objective:f["field.supplyDone"] ? `Delivered ${f["field.supplyRoute"] === "rope" ? "a survey rope" : "three kits"}; payment received.` : "Return to Village with three kits or one survey rope.",completed:!!f["field.supplyDone"]};
}
function rematchState(state) {
    if(!state.actors.player.facts["rival.rematchReady"]) throw new Error("Recovery is unfinished.");
    const next=structuredClone(state),p=next.simulation?.pursuits?.[RIVAL_PURSUIT];
    if(!p || !["tested","settled","lost","withdrawn","declined"].includes(p.status)) throw new Error("Finish the current road contest first.");
    delete next.simulation.pursuits[RIVAL_PURSUIT];
    return next;
}
export function previewRivalRematch(state,registry,context) {
    return previewSimulationCommand(rematchState(state),registry,"rival.rematch",{...context,facts:{...context.facts,[`pursuit.${RIVAL_PURSUIT}.active`]:false}});
}
export function prepareRivalRematch(state,registry,context,expectedSequence=state.sequence) {
    if(expectedSequence !== state.sequence) throw new Error("The rematch is stale.");
    const next=rematchState(state);
    // The new command's prerequisites refer to the closed old contest.
    return commitSimulationCommand(next,registry,{id:"rival.rematch"},{...context,facts:{...context.facts,[`pursuit.${RIVAL_PURSUIT}.active`]:false}},expectedSequence);
}
export function previewFieldRenewal(state,registry,context) {
    const preview=previewCampaignTransition(state,registry,"frontier.field_renewal",context);
    return {...preview,lost:["Load-bearing Step mastery returns to 1; its paid application practice opens again","Stored measured focus and breath drive become 0; strain clears"],
        reward:"Field legacy: +1 route preparation, once"};
}
export function commitFieldRenewal(state,registry,context,expectedSequence) {
    if(expectedSequence !== state.sequence) throw new Error("The renewal preview changed. Review it again.");
    previewFieldRenewal(state,registry,context);
    const plan=commitCampaignTransition(state,registry,"frontier.field_renewal",context,expectedSequence),s=plan.state.simulation;
    s.powers.player["field.load_step"].mastery=1;
    delete plan.state.actors.player.completed["field.practice_step"];
    for(const id of ["field.focus","field.drive"]) if(s.energies?.player?.[id]) {s.energies.player[id].reserve=0;s.energies.player[id].strain=0;}
    validateExpansionState(plan.state,registry);return plan;
}
