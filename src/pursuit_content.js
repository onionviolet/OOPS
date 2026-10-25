import {eqRaw as eq} from './basics.js';
import {moneyNativeKey as money} from './content_kit.js';
const close=result=>({type:"pursuit",pursuitId:"village.trail_test",operation:"close",result});
const command=d=>({revision:1,group:"pursuit",actorId:"player",worldId:"base.frontier",costs:[],effects:[],...d});
export const pursuitSources=[{id:"frontier.trailcraft",revision:1,label:"Witnessed trailcraft",kind:"knowledge",description:"A practiced sense of what a pursuer can actually observe.",grants:[{capability:"frontier.preparation",amount:1}]}];
export const pursuitDefinitions={
    people:[{id:"routeApprentice",revision:1,label:"Neri, route apprentice",worldId:"base.frontier",location:"Village",inventory:"simulation",provision:false,resources:{provisions:5}}],
    pursuits:[{id:"village.trail_test",revision:1,label:"Neri's field test",actorId:"routeApprentice",targetId:"player",encounterCommand:"pursuit.spar",supply:"provisions",
        investigationMinutes:2,investigationSupply:1,movementSupply:1,searchMinutes:2,searchSupply:1,leadLifetime:18,requestLifetime:12,pollMinutes:1,
        routes:[{from:"Village",to:"Shack",minutes:3},{from:"Shack",to:"Village",minutes:3}],sanctuaries:["Shack"]}],
    commands:[
        command({id:"pursuit.begin",location:"Village",label:"Arrange Neri's trail test",once:true,visibleWhen:eq("actor.field.member",true),requires:eq("actor.field.member",true),
            description:"An optional nonlethal test. Neri uses five of their own supplies to investigate and follow witnessed Village/Shack routes. The Shack is private shelter. A missed trail ends the search; there is no unattended damage or obligation.",
            effects:[{type:"spawn",personId:"routeApprentice",definitionId:"routeApprentice"},{type:"pursuit",pursuitId:"village.trail_test",operation:"begin"},
                {type:"knowledge",key:"pursuit.notice",stage:"seen",value:"Neri saw you begin the agreed field test in Village. A witnessed departure can provide a lead. The Shack is private shelter; you may also keep a low profile or call off the test."}]}),
        command({id:"pursuit.conceal",label:"Keep a low profile · 2 stamina + 2 min",duration:2,cancellation:"forfeit",visibleWhen:eq("pursuit.village.trail_test.active",true),requires:eq("pursuit.village.trail_test.active",true),
            description:"Spend two stamina and two minutes masking your trail. Neri finishes any already paid search or movement, then loses this trail. Cancelling forfeits the stamina.",costs:[{type:"vital",key:"stamina",amount:-2}],effects:[{type:"pursuit",pursuitId:"village.trail_test",operation:"conceal"},
                {type:"knowledge",key:"pursuit.notice",stage:"seen",value:"You masked your trail. This test will not reveal later departures unless you arrange a new agreement."}]}),
        command({id:"pursuit.decline",label:"Call off the field test",visibleWhen:eq("pursuit.village.trail_test.active",true),requires:eq("pursuit.village.trail_test.active",true),effects:[close("declined")]}),
        command({id:"pursuit.report",location:"Village",label:"Ask for Neri's field report",visibleWhen:eq("pursuit.village.trail_test.known",true),requires:eq("pursuit.village.trail_test.known",true),effects:[{type:"pursuit",pursuitId:"village.trail_test",operation:"report"}]}),
        command({id:"pursuit.tea",label:"Settle the challenge over tea · 1 coin",targetId:"routeApprentice",coLocated:true,visibleWhen:eq("pursuit.village.trail_test.contact",true),requires:eq("pursuit.village.trail_test.contact",true),costs:[money(-1)],
            effects:[close("settled"),{type:"relationship",target:"$target",axis:"respect",amount:1,text:"Settled the agreed field test over tea."}]}),
        command({id:"pursuit.spar",pursuitId:"village.trail_test",label:"Accept the nonlethal footwork test",targetId:"routeApprentice",coLocated:true,participants:["$actor","$target"],encounterId:"pursuit.footwork",requires:eq("pursuit.village.trail_test.contact",true)})
    ],
    encounters:[{id:"pursuit.footwork",revision:1,label:"Neri's footwork test",lethal:false,turns:[{cue:"Neri follows your first step and reaches across your escape line. Shift your weight before the light tag.",responses:[
        {id:"ordinary",label:"Plant and turn · 3 stamina",costs:[{type:"vital",key:"stamina",amount:-3}],effects:[]},
        {id:"cover",label:"Break Neri's reach behind the well wall · 1 stamina",requires:eq("location","Village","Cover is the Village well wall; the Shack is private shelter."),costs:[{type:"vital",key:"stamina",amount:-1}],
            effects:[{type:"knowledge",key:"pursuit.position",stage:"seen",value:"You kept the Village well wall between you and Neri, so their reach fell short and the turn cost less effort. In open ground it would have cost more."}]},
        {id:"focus",label:"Read the step · 2 measured focus units",costs:[{type:"energy",energyId:"field.focus",operation:"use",output:1,control:2}],effects:[]}
    ]}],settlement:[close("tested"),{type:"source",sourceId:"frontier.trailcraft",operation:"grant"},
        {type:"knowledge",key:"pursuit.notice",stage:"understood",value:"You tested how a witnessed lead becomes a search and an interception. Your trailcraft now adds one route-preparation source."}]}]
};
