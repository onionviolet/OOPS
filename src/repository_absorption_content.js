// Original finite content. Pinned NetHack/xNetHack, ToME, CoffeeMUD/CDDA and
// Wesnoth mechanisms inform the design; no upstream code, prose or assets used.
// Provenance and rights: docs/gm/feature-wave/repositories/SOURCE_MATRIX.json.
import {all, eq} from './basics.js';
import {repositoryAbsorptionSubstitutionCommands} from './repository_absorption_substitutions.js';
import {repositoryAbsorptionChainCommands} from './repository_absorption_chains.js';
export const REPOSITORY_ABSORPTION_VERSION = 1;
export const REPOSITORY_ABSORPTION_IDS = Object.freeze({
    actor: 'repositories.miri', lantern: 'repositories.lantern', pump: 'repositories.pump',
    begin: 'repositories.begin', source: 'repositories.wick_control', power: 'repositories.wick_control',
    group: 'repositories', kitClaim: 'repositories.pump_outcome',
});
const {actor:MIRI, lantern:LANTERN, pump:PUMP, source:METHOD} = REPOSITORY_ABSORPTION_IDS;
const WORLD = 'base.frontier';
const key = id => JSON.stringify({id});
export const repositoryAbsorptionItemSpecifications = Object.freeze([
    {id:'Dry resin pellet', name:'Dry resin pellet', description:'A counted resin charge for a wick repair or sealing actual survey supplies. Seeing a flare teaches no execution method.', value:1},
    {id:'Wax-sealed survey kit', name:'Wax-sealed survey kit', description:'One actual survey kit protected by a resin seal. It supports Village floodline work; opening it recovers an ordinary kit.', value:3},
    {id:'Soaked survey kit', name:'Soaked survey kit', description:'A survey kit soaked by exposed floodline work. Dry it before using its fittings again.', value:1},
]);
export const REPOSITORY_ABSORPTION_ITEMS = Object.freeze({
    log:key('Rough wood log'), kit:key('Prepared survey kit'), pellet:key('Dry resin pellet'),
    protectedKit:key('Wax-sealed survey kit'), soakedKit:key('Soaked survey kit'),
});
const I = REPOSITORY_ABSORPTION_ITEMS;
const gte = (fact,value,reason) => ({fact,op:'gte',value,...(reason?{reason}:{})});
const phase = (id,...values) => values.length === 1 ? eq(`situation.${id}.phase`,values[0]) : {any:values.map(v=>eq(`situation.${id}.phase`,v))};
const shift = (id,from,to) => ({type:'situation',situationId:id,operation:'advance',expected:Array.isArray(from)?from:[from],phase:to});
const af = (name,value=true,actor='player') => ({type:'fact',scope:'actor',actor,key:`repositories.${name}`,value});
const wf = (name,value=true) => ({type:'world',worldId:WORLD,key:`repositories.${name}`,value});
const item = (key,amount,actor='player') => ({type:'item',actor,key,amount});
const stamina = (amount,actor='player') => ({type:'vital',actor,key:'stamina',amount});
const purse = (amount,actor=MIRI) => ({type:'resource',actor,key:'coins',amount});
const money = amount => ({type:'resource',native:true,key:'money',amount});
const know = (name,value,{actor='player',kind='observation',situation=LANTERN,attributedTo='player'}={}) => ({
    type:'knowledge',actor,key:`repositories.${name}`,stage:kind==='instruction'?'understood':'seen',value,
    basis:{kind,attributedTo,situationId:situation},
});
const memory = text => ({type:'relationship',actor:MIRI,target:'player',axis:'familiarity',amount:1,text});
const supported = eq('repositories.clockSupported',true,'Return to the native Frontier for this local work.');
const healthy = gte('vital.health',2,'Recover before handling the floodline fittings.');
const hands = eq('repositories.playerHandsUsable',true,'This work needs two usable hands.');
const willing = eq('repositories.miriSupported',true,'Miri cannot offer that shared work now.');
const learned = eq(`knowledge.repositories.wick_method.understood`,true,'Learn the method through the offered lesson first.');
const control = eq(`faculty.${METHOD}.active`,true,'Restore your learned wick control before using it.');
const command = d => ({revision:1,worldId:WORLD,actorId:'player',location:'Village',group:'repositories',costs:[],effects:[],...d});
const shared = d => command({targetId:MIRI,coLocated:true,participants:['$target'],...d});
const timed = d => command({cancellation:'refund',completionFailure:'refund',completionRequires:all(supported,healthy),...d});
const joint = d => timed({targetId:MIRI,coLocated:true,participants:['$target'],completionCoLocated:true,
    ...d,completionRequires:all(supported,healthy,willing)});
const npc = d => command({actorId:MIRI,location:'Village',audience:[MIRI],...d});
const lanternOpen = phase(LANTERN,'offered');
const lanternRepaired = phase(LANTERN,'repaired');
const pumpOpen = phase(PUMP,'offered','exposed');
const sealEffects = count => [item(I.protectedKit,count),{type:'power',powerId:METHOD,operation:'refine',amount:1},
    know('sealed_supplies',`You sealed ${count} real survey kit${count===1?'':'s'} with owned resin. These supplies resist the floodline splash.`)];
const repairEffects = (route,observed) => [af('lanternReady',true,MIRI),shift(LANTERN,['offered','declined'],'repaired'),
    af('lanternRoute',route,MIRI),know('own_repair','My lantern now burns steadily. The resin and effort came from actual supplies.',{actor:MIRI,attributedTo:MIRI}),
    ...(observed?[know('flare','You watched Miri use one owned resin pellet and relight the same wet lantern. Seeing this does not teach her practiced control.',{attributedTo:MIRI})]:[])];
export const repositoryAbsorptionSources = [{id:METHOD,revision:1,label:'Practiced wick control',kind:'technique',origin:'trained',grants:[]}];
export const repositoryAbsorptionDefinitions = {
    people:[{id:MIRI,revision:1,label:'Miri, village courier',worldId:WORLD,location:'Village',inventory:'simulation',provision:false,
        resources:{coins:6,water:6},body:{hands:2},vitals:{health:20,max_health:20,stamina:16,max_stamina:16}}],
    sites:[{id:'repositories.sealing_bench',revision:1,label:'Village sealing board',capacity:1}],
    powers:[{id:METHOD,revision:1,label:'Wick and resin control',model:'practice',capacity:1,
        masteryBands:[{at:3,capacity:2}],worlds:[WORLD],execution:all(control,hands,healthy,supported)}],
    situations:[
        {id:LANTERN,revision:1,label:'A sputtering lantern',context:{worldId:WORLD,instanceId:'frontier.main',continuityId:'frontier.branch',eraId:'frontier.present',regionId:'frontier.village'},
            participants:['player',MIRI],initialPhase:'offered',responseWindow:8,phases:['offered','declined','repaired'],privateTruth:{method:'resin_wick',courierOwnsLantern:true}},
        {id:PUMP,revision:1,label:'The Village floodline pump',context:{worldId:WORLD,instanceId:'frontier.main',continuityId:'frontier.branch',eraId:'frontier.present',regionId:'frontier.village'},
            participants:['player',MIRI],initialPhase:'offered',responseWindow:12,phases:['offered','exposed','restored','bypassed','resident_bypass'],privateTruth:{hazard:'direct_splash',pumpOwner:MIRI}},
    ],
    commands:[
        ...repositoryAbsorptionSubstitutionCommands,
        ...repositoryAbsorptionChainCommands,
        command({id:'repositories.begin',label:'Ask the courier about her lantern',once:true,requires:all(supported,eq('village.elderMet')),
            effects:[{type:'spawn',personId:MIRI,definitionId:MIRI},{type:'situation',situationId:LANTERN,operation:'begin'},
                {type:'site',siteId:'repositories.sealing_bench',operation:'open'},
                item(I.pellet,6,MIRI),item(I.kit,1,MIRI),af('willing',true,MIRI),af('lanternReady',false,MIRI),
                {type:'source',actor:MIRI,sourceId:METHOD,operation:'grant',origin:'trained',awakened:true,active:true},
                know('wick_method','I know how resin and wick pressure restore my lantern.',{actor:MIRI,kind:'instruction',attributedTo:MIRI}),
                know('opening','Miri offers to show you her sputtering lantern. She will arrange her own repair after eight played minutes. Silence accepts no work.',{attributedTo:MIRI})]}),
        shared({id:'repositories.inspect_lantern',label:'Inspect the offered lantern',once:true,visibleWhen:lanternOpen,requires:all(supported,lanternOpen,willing),
            description:'An offered inspection reveals the wet wick. It grants neither a pellet nor a learned procedure.',
            effects:[know('wet_wick','The offered wick is wet and loose. Miri still owns the lantern and her supplies.',{attributedTo:MIRI})]}),
        joint({id:'repositories.watch_repair',label:'Watch Miri repair her wick · 1 min',duration:1,visibleWhen:lanternOpen,
            requires:all(supported,healthy,lanternOpen,willing,eq(`situation.${LANTERN}.responseOpen`)),
            description:'She agrees to spend one pellet and one of her stamina. Watching teaches no execution source. Cancellation returns her reserved means.',
            costs:[item(I.pellet,-1,MIRI),stamina(-1,MIRI)],effects:repairEffects('demonstrated',true)}),
        joint({id:'repositories.paid_repair',label:'Fit Miri’s lantern brace · 1 log + 3 stamina · earn 2 coins · 3 min',duration:3,
            visibleWhen:lanternOpen,requires:all(supported,healthy,hands,lanternOpen,willing,eq(`situation.${LANTERN}.responseOpen`)),
            description:'Reserve your log and effort plus two of Miri’s coins. Completion credits your native purse; cancellation refunds each actual owner.',
            costs:[item(I.log,-1),stamina(-3),purse(-2)],effects:[money(2),...repairEffects('paid_brace',false),
                know('brace_repair','You fitted a real wooden brace and Miri paid two coins from her own purse. The same lantern now works.',{attributedTo:MIRI}),memory('Paid the traveler for one completed lantern brace.')]}),
        shared({id:'repositories.decline',label:'Leave the lantern repair to Miri',visibleWhen:lanternOpen,requires:all(supported,lanternOpen),
            effects:[shift(LANTERN,'offered','declined'),know('declined','You declined the present repair offer. Miri will use her own means; no promise or debt was created.',{attributedTo:MIRI})]}),
        npc({id:'repositories.self_repair',label:'Miri repairs her own lantern',duration:1,cancellation:'refund',completionFailure:'refund',
            completionRequires:all(supported,gte('body.hands',1),eq(`faculty.${METHOD}.active`)),
            requires:all(supported,{any:[phase(LANTERN,'declined'),all(lanternOpen,eq(`situation.${LANTERN}.responseOpen`,false))]},
                eq('knowledge.repositories.wick_method.understood'),gte('body.hands',1),eq(`faculty.${METHOD}.active`),gte('vital.health',2)),
            costs:[item(I.pellet,-1,MIRI),stamina(-1,MIRI)],effects:repairEffects('self_help',false)}),
        shared({id:'repositories.hear_lantern',label:'Ask Miri how her lantern fared',once:true,visibleWhen:lanternRepaired,
            requires:all(supported,lanternRepaired,willing),effects:[know('return','Miri reports that the same lantern now burns steadily. This is her testimony about the completed repair, not proof you witnessed its flare.',{kind:'recollection',attributedTo:MIRI}),memory('Met again after the lantern repair; kept the original owner and expenditure.')]}),
        shared({id:'repositories.buy_pellet',label:'Buy one offered resin pellet · 1 coin',visibleWhen:lanternRepaired,requires:all(supported,lanternRepaired,willing),
            description:'One native coin credits Miri’s finite purse and one pellet leaves her actual stock. No shop restock is generated.',
            costs:[money(-1)],effects:[purse(1),{type:'transfer',from:MIRI,to:'player',key:I.pellet,count:1}]}),
        joint({id:'repositories.lesson',label:'Learn wick and resin control · 1 coin + 2 stamina · 3 min',once:true,duration:3,
            visibleWhen:all(lanternRepaired,eq(`power.${METHOD}.owned`,false)),requires:all(supported,healthy,hands,lanternRepaired,willing),
            description:'Pay one coin to the actual teacher on completion. Miri spends one stamina; understanding and the trained source are earned together. Seeing or testimony alone grants neither.',
            costs:[money(-1),stamina(-2),stamina(-1,MIRI)],effects:[purse(1),
                know('wick_method','Miri corrected your wick pressure and resin seam. Seal one owned kit at first; three completed batches unlock a matched pair from one pellet. The method supplies no resin or extra body.',{kind:'instruction',attributedTo:MIRI}),
                {type:'source',sourceId:METHOD,operation:'grant',origin:'trained',awakened:true,active:true},{type:'power',powerId:METHOD,operation:'learn'},memory('Received the agreed fee and taught an ordinary sealing method.')]}),
        ...[1,2].map(count=>timed({id:count===1?'repositories.seal_kit':'repositories.seal_pair',label:count===1?'Seal one kit · 1 pellet + 2 stamina · 2 min':'Seal a matched pair · 1 pellet + 3 stamina · 3 min',
            duration:count+1,siteId:'repositories.sealing_bench',powerId:METHOD,output:count,visibleWhen:all(eq(`power.${METHOD}.owned`),...(count===2?[gte(`power.${METHOD}.mastery`,3)]:[])),
            requires:all(supported,healthy,hands,learned,control,...(count===2?[gte(`power.${METHOD}.mastery`,3,'Three completed sealings unlock a matched pair.')]:[])),
            completionRequires:all(supported,healthy,hands,learned,control),
            description:`Convert ${count} ordinary native kit${count===1?'':'s'} into ${count} protected kit${count===1?'':'s'} with one resin charge. A completed batch advances practiced mastery; no input or XP appears during preview.`,
            costs:[item(I.kit,-count),item(I.pellet,-1),stamina(-(count+1))],effects:sealEffects(count)})),
        timed({id:'repositories.dry_kit',label:'Dry a soaked survey kit · 2 min',duration:2,visibleWhen:gte(`item.${I.soakedKit}`,1),requires:all(supported,healthy,hands),
            costs:[item(I.soakedKit,-1)],effects:[item(I.kit,1),know('dried_kit','The soaked kit dried into ordinary usable fittings. It is still unprotected against another direct splash.')]}),
        command({id:'repositories.open_seal',label:'Open one protected kit into ordinary fittings',visibleWhen:gte(`item.${I.protectedKit}`,1),requires:all(supported,hands),
            costs:[item(I.protectedKit,-1)],effects:[item(I.kit,1)]}),
        shared({id:'repositories.inspect_pump',label:'Inspect the floodline pump beside Miri',once:true,visibleWhen:lanternRepaired,requires:all(supported,lanternRepaired,willing),
            effects:[{type:'situation',situationId:PUMP,operation:'begin'},know('pump_offer','The floodline pump splashes directly onto a worker’s fittings. Miri offers protected repair or a surface bypass; after twelve played minutes she may fund her own bypass. An exposed kit will soak without fixing the pump.',{situation:PUMP,attributedTo:MIRI})]}),
        joint({id:'repositories.exposed_work',label:'Try exposed pump work · 1 ordinary kit + 2 stamina · 2 min',once:true,duration:2,
            visibleWhen:phase(PUMP,'offered'),requires:all(supported,healthy,hands,phase(PUMP,'offered'),willing,eq(`situation.${PUMP}.responseOpen`)),
            description:'The disclosed splash soaks the actual kit and leaves the pump broken. Cancellation returns inputs; a completed attempt records the failed route without a repair reward.',
            costs:[item(I.kit,-1),stamina(-2)],effects:[item(I.soakedKit,1),shift(PUMP,'offered','exposed'),
                know('pump_splash','The direct splash soaked your exposed kit. Its fittings remain yours, but the pump is still broken. Dry or protect supplies before another route.',{situation:PUMP})]}),
        joint({id:'repositories.protected_work',label:'Restore the pump · 1 protected kit + 4 stamina · 4 min',duration:4,claim:'repositories.pump_outcome',
            visibleWhen:pumpOpen,requires:all(supported,healthy,hands,pumpOpen,willing,eq(`situation.${PUMP}.responseOpen`)),
            description:'Spend one actual protected kit to finish the repair. Miri retains the pump and its finite water supply; you gain a working native stamina-recovery option.',
            costs:[item(I.protectedKit,-1),stamina(-4)],effects:[shift(PUMP,['offered','exposed'],'restored'),wf('pumpRestored'),
                know('pump_result','Your protected fittings survived the splash. The pump is restored; Miri can offer draws from its finite supply.',{situation:PUMP}),memory('The traveler restored my pump using their own protected fittings.')]}),
        joint({id:'repositories.surface_bypass',label:'Arrange a surface bypass · 2 coins + 2 stamina · 3 min',duration:3,claim:'repositories.pump_outcome',
            visibleWhen:pumpOpen,requires:all(supported,healthy,pumpOpen,willing,eq(`situation.${PUMP}.responseOpen`)),
            description:'Pay Miri for the surface route. This avoids resin training and splash; the pump stays broken and provides no water draw.',
            costs:[money(-2),stamina(-2)],effects:[purse(2),shift(PUMP,['offered','exposed'],'bypassed'),wf('surfaceBypass'),
                know('pump_result','You paid for a surface bypass. Deliveries can pass, while the pump remains unrepaired and grants no water draw.',{situation:PUMP,attributedTo:MIRI}),memory('Received payment for the agreed surface bypass.')]}),
        npc({id:'repositories.resident_bypass',label:'Miri funds her own surface bypass',duration:3,claim:'repositories.pump_outcome',cancellation:'refund',completionFailure:'refund',
            requires:all(supported,pumpOpen,eq(`situation.${PUMP}.responseOpen`,false),gte('body.hands',1),gte('vital.health',2)),completionRequires:all(supported,gte('body.hands',1),gte('vital.health',2)),
            costs:[purse(-2),item(I.kit,-1,MIRI),stamina(-2,MIRI)],effects:[shift(PUMP,['offered','exposed'],'resident_bypass'),wf('surfaceBypass'),
                know('own_pump_result','I funded a surface bypass with my own purse and kit. The pump is still broken.',{actor:MIRI,situation:PUMP,attributedTo:MIRI})]}),
        ...[
            ['restored','Miri reports: "Your protected fittings held. The pump still works; I can offer water while my finite supply lasts."'],
            ['bypassed','Miri reports: "I kept the fee you paid for the surface route. Deliveries pass, but the pump is still broken."'],
            ['resident_bypass','Miri reports: "I used my own two coins and kit for the surface route when the offer elapsed. The pump is still broken; we made no agreement."'],
        ].map(([route,text])=>shared({id:`repositories.hear_pump_${route}`,label:'Meet Miri again about the floodline',once:true,
            visibleWhen:phase(PUMP,route),requires:all(supported,willing,phase(PUMP,route)),
            effects:[know('later_pump',text,{situation:PUMP,kind:'recollection',attributedTo:MIRI}),memory('Met after the chosen floodline route; no replacement actor or duplicate reward.')]})),
        shared({id:'repositories.draw_water',label:'Ask for one offered pump draw · restore 4 stamina',visibleWhen:eq('knowledge.repositories.pump_result.seen'),
            requires:all(supported,healthy,willing,phase(PUMP,'restored'),eq('repositories.waterOffered',true,'No pump draw is currently offered.'),eq('repositories.needsStamina',true,'Your stamina is already full.')),
            description:'An offered draw consumes one unit of Miri’s actual finite water supply and restores up to four native stamina. The renderer never refills the supply.',
            costs:[{type:'resource',actor:MIRI,key:'water',amount:-1}],effects:[stamina(4)]}),
    ],
    controllers:[{id:'repositories.miri_agenda',revision:1,label:'Miri’s finite local duties',actorId:MIRI,interval:1,actions:[
        {commandId:'repositories.self_repair',priority:2,when:{any:[phase(LANTERN,'declined'),all(lanternOpen,eq(`situation.${LANTERN}.responseOpen`,false))]}},
        {commandId:'repositories.resident_bypass',priority:1,when:all(pumpOpen,eq(`situation.${PUMP}.responseOpen`,false))},
    ]}],
};
