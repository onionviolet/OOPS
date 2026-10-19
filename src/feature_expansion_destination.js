// Original opt-in prototype. No source-book setting, automatic enrollment,
// second body, offline clock, level-scaled threat or independent publisher.
import {all, eqNoReason as eq} from './basics.js';
export const TIDEMARK_IDS = Object.freeze({world:'feature.tidemark',instance:'feature.tidemark.harbor',
 definition:'feature.tidemark.definition',era:'tidemark.breakwater.present',continuity:'tidemark.original',
 keeper:'tidemark.keeper',wright:'tidemark.wright',stock:'tidemark.communal_stock',shop:'tidemark.wright',
 quest:'tidemark.sluice_agreement',site:'tidemark.sluice',power:'tidemark.counterweight'});
export const TIDEMARK_LOCATIONS = Object.freeze({dock:'Tidemark landing',terrace:'Tidemark terraces'});
export const TIDEMARK_KEYS = Object.freeze({log:JSON.stringify({id:'Rough wood log'}),kit:JSON.stringify({id:'Prepared survey kit'}),rope:JSON.stringify({id:'Survey rope'})});
export const TIDEMARK_ENDPOINT = Object.freeze({worldId:TIDEMARK_IDS.world,instanceId:TIDEMARK_IDS.instance,regionId:'tidemark.harbor',layerId:'tidemark.surface'});
export const TIDEMARK_WORLD = Object.freeze({id:TIDEMARK_IDS.world,label:'Tidemark',publicName:'Tidemark',continuityLabel:'Original counterweight harbor',
 provenance:'Original authored optional destination. One present era, one harbor, the existing native traveler, an absence-frozen tide clock.'});
export const TIDEMARK_DEFINITION = Object.freeze({id:TIDEMARK_IDS.definition,worldId:TIDEMARK_IDS.world,revision:1,label:'Tidemark',unidentifiedLabel:'A terraced harbor',
 regions:[{id:'tidemark.harbor',layerIds:['tidemark.surface']}],sites:[{id:'tidemark.landing',label:'Landing',regionId:'tidemark.harbor',layerId:'tidemark.surface',initialOpen:true},
 {id:TIDEMARK_IDS.site,label:'Counterweight sluice',regionId:'tidemark.harbor',layerId:'tidemark.surface',initialOpen:true}],initialFacts:{},uniqueClaimIds:[]});
export const TIDEMARK_INITIAL_FACTS = Object.freeze({'tidemark.met':false,'tidemark.agreed':false,'tidemark.refused':false,'tidemark.repaired':false,'tidemark.collected':false,'tidemark.route':'none'});
export const TIDEMARK_NATIVE_SCHEMA = 1;
export const TIDEMARK_NATIVE_DOMAIN = 'feature_destination_native';
const world=(key,value)=>({type:'world',worldId:TIDEMARK_IDS.world,key:`tidemark.${key}`,value});
const know=(key,value)=>({type:'knowledge',actor:'player',key:`tidemark.${key}`,stage:'seen',value});
const local=(name,label,extra={})=>({id:`tidemark.${name}`,revision:1,label,actorId:'player',worldId:TIDEMARK_IDS.world,location:TIDEMARK_LOCATIONS.dock,group:'tidemark',costs:[],effects:[],...extra});
const meeting=eq('world.tidemark.met');
const agreement=all(meeting,eq('world.tidemark.agreed'),eq('world.tidemark.repaired',false));
const repairEffects=route=>[world('repaired',true),world('route',route),know('repair',`The sluice is secured by ${route==='timber'?'a permanent timber brace':'its calibrated counterweight'}. The low terraces remain accessible during high tide. The agreement’s kit is still held in the local shop until you collect it.`)];
export const tidemarkDefinitions = {
 people:[{id:TIDEMARK_IDS.keeper,revision:1,label:'Nessa, sluice keeper',worldId:TIDEMARK_IDS.world,location:TIDEMARK_LOCATIONS.dock,inventory:'native',provision:false,
 resources:{coins:2},body:{form:'human',hands:2,mobile:true}},
 {id:TIDEMARK_IDS.wright,revision:1,label:'Venn, ropewright',worldId:TIDEMARK_IDS.world,location:TIDEMARK_LOCATIONS.dock,inventory:'native',provision:false,
 resources:{coins:3},body:{form:'human',hands:2,mobile:true}}],
 sites:[{id:TIDEMARK_IDS.site,revision:1,label:'Tidemark sluice',capacity:1}],
 powers:[{id:TIDEMARK_IDS.power,revision:1,label:'Counterweight setting',model:'practice',capacity:1,worlds:[TIDEMARK_IDS.world],cooldown:0,
 description:'Set this harbor’s linked floats and weights. Works on its actual sluice; it does not create water, lift cargo elsewhere or change the traveler’s body.',
 execution:eq('tidemark.nativeBound')}],
 commands:[
 {id:'tidemark.chart',revision:1,label:'Read the terraced harbor chart',actorId:'player',worldId:'base.frontier',location:'Village',group:'tidemark',once:true,
 costs:[],effects:[know('chart','A reed-brass chart offers a passage to Tidemark, a counterweight harbor. Opening accepts no work. The landing has a reliable return marker; tides and residents advance only while your body is there.')],
 requires:eq('village.elderMet'),visibleWhen:eq('village.elderMet')},
 {id:'tidemark.open_receipt',revision:1,label:'Open Tidemark passage · 1 wooden coin',actorId:'player',worldId:'base.frontier',location:'Village',group:'tidemark',
 costs:[{type:'resource',native:true,key:'money',amount:-1}],effects:[know('open','You opened a fixed present-era passage to Tidemark. One body and its complete cargo cross; borrowed goods must first be returned.')]},
 {id:'tidemark.enter_receipt',revision:1,label:'Enter Tidemark',actorId:'player',worldId:'base.frontier',location:'Village',group:'tidemark',costs:[],effects:[know('entered','You reached Tidemark landing in the same native body. The return marker remains available, including at high tide.')]},
 local('exit_receipt','Return to Village',{effects:[know('returned','You returned with your body and actual carried belongings. Tidemark’s residents, supplies and agreement remain; its local tide clock freezes while you are absent.')]}),
 local('meet','Meet the sluice keeper',{once:true,targetId:TIDEMARK_IDS.keeper,coLocated:true,effects:[world('met',true),know('meeting','Nessa maintains the sluice; Venn owns the nearby rope shop. The low terraces dry for nine local minutes in each twelve-minute tide. A secured sluice keeps a working route open at high tide. Their supplies and obligations belong to them.')]}),
 local('accept','Accept Nessa’s sluice agreement',{once:true,targetId:TIDEMARK_IDS.keeper,coLocated:true,requires:all(meeting,eq('world.tidemark.agreed',false)),visibleWhen:meeting,
 effects:[world('agreed',true),world('refused',false),know('agreement','You agreed to secure the sluice. Use two owned logs for a timber brace, or learn and apply the local counterweight method using one owned kit. Venn reserves one actual shop kit as payment; collect it after the repair.')]}),
 local('decline','Decline the work · keep travel and shop access',{once:true,targetId:TIDEMARK_IDS.keeper,coLocated:true,requires:all(meeting,eq('world.tidemark.agreed',false)),visibleWhen:meeting,
 effects:[world('refused',true),know('refusal','You declined the work without losing the landing, the ordinary tide route or Venn’s shop. Nessa will still hear a later voluntary acceptance.')]}),
 local('timber','Brace the sluice · 2 logs + 2 stamina · 6 min',{duration:6,cancellation:'refund',siteId:TIDEMARK_IDS.site,targetId:TIDEMARK_IDS.keeper,coLocated:true,participants:[TIDEMARK_IDS.keeper],
 requires:agreement,visibleWhen:all(meeting,eq('world.tidemark.agreed')),costs:[{type:'item',key:TIDEMARK_KEYS.log,amount:-2},{type:'vital',key:'stamina',amount:-2}],effects:repairEffects('timber')}),
 local('lesson','Learn counterweight setting · 2 coins · 3 min',{duration:3,cancellation:'refund',once:true,targetId:TIDEMARK_IDS.keeper,coLocated:true,participants:[TIDEMARK_IDS.keeper],requires:meeting,visibleWhen:meeting,
 costs:[{type:'resource',native:true,key:'money',amount:-2}],effects:[{type:'resource',actor:TIDEMARK_IDS.keeper,key:'coins',amount:2},{type:'power',powerId:TIDEMARK_IDS.power,operation:'learn'},
 know('method','Nessa taught you how to balance this harbor’s linked floats. Its method works only with Tidemark’s actual sluice. An ordinary timber brace reaches the same lasting access without this lesson.')]}),
 local('balance','Calibrate the sluice · 1 kit + 2 stamina · 2 min',{duration:2,cancellation:'refund',siteId:TIDEMARK_IDS.site,powerId:TIDEMARK_IDS.power,targetId:TIDEMARK_IDS.keeper,coLocated:true,participants:[TIDEMARK_IDS.keeper],
 requires:agreement,visibleWhen:all(meeting,eq('world.tidemark.agreed')),costs:[{type:'item',key:TIDEMARK_KEYS.kit,amount:-1},{type:'vital',key:'stamina',amount:-2}],effects:repairEffects('counterweight')}),
 local('collect','Collect the agreed kit · actual local shop stock',{once:true,targetId:TIDEMARK_IDS.wright,coLocated:true,requires:all(eq('world.tidemark.repaired'),eq('world.tidemark.collected',false),eq('tidemark.rewardStock')),
 visibleWhen:eq('world.tidemark.repaired'),effects:[{type:'item',key:TIDEMARK_KEYS.kit,amount:1},world('collected',true),know('settlement','Venn transferred the reserved shop kit to your actual bag. The agreement is complete; neither re-entry nor load pays it again.')]}),
 local('buy_log','Buy 1 local log · 2 wooden coins',{targetId:TIDEMARK_IDS.wright,coLocated:true,requires:all(meeting,eq('tidemark.shopLog')),visibleWhen:meeting,
 costs:[{type:'resource',native:true,key:'money',amount:-2}],effects:[{type:'item',key:TIDEMARK_KEYS.log,amount:1}]}),
 local('buy_kit','Buy 1 unreserved kit · 5 wooden coins',{targetId:TIDEMARK_IDS.wright,coLocated:true,requires:all(meeting,eq('tidemark.shopKit')),visibleWhen:meeting,
 costs:[{type:'resource',native:true,key:'money',amount:-5}],effects:[{type:'item',key:TIDEMARK_KEYS.kit,amount:1}]}),
 local('salvage','Recover 1 washed-up log · finite terrace stock',{location:TIDEMARK_LOCATIONS.terrace,requires:all(eq('tidemark.terraceAccessible'),eq('tidemark.salvageStock')),effects:[{type:'item',key:TIDEMARK_KEYS.log,amount:1},
 know('salvage','You moved one actual washed-up log from the terraces into your bag. This stock is finite and does not refresh when you leave.')]}),
 local('supply','Supply Nessa with 1 owned log',{targetId:TIDEMARK_IDS.keeper,coLocated:true,requires:meeting,visibleWhen:meeting,costs:[{type:'transfer',from:'player',to:TIDEMARK_IDS.keeper,key:TIDEMARK_KEYS.log,count:1}],
 effects:[know('supply','You gave Nessa one actual log for future maintenance. The gift belongs to her; it does not grant a repair reward or reclaim right.')]}),
 local('borrow_kit','Borrow Nessa’s inspection kit · return before leaving',{targetId:TIDEMARK_IDS.keeper,coLocated:true,requires:all(meeting,eq('tidemark.loanAvailable')),visibleWhen:meeting,
 effects:[{type:'custody',from:TIDEMARK_IDS.keeper,to:'player',key:TIDEMARK_KEYS.kit,count:1,loanId:'tidemark.inspection_loan'},know('loan','Nessa lent one finite inspection kit. Use it to inspect the floats; it cannot be consumed, sold, passed on or taken through the passage. Return that exact custody quantity before leaving.')]}),
 local('inspect_floats','Inspect linked floats · reusable kit · 2 min',{once:true,duration:2,cancellation:'refund',siteId:TIDEMARK_IDS.site,requires:all(meeting,eq('tidemark.inspectionKit')),visibleWhen:meeting,
 effects:[{type:'xp',skill:'Perception',amount:12},know('floats','The two floats share a single tension line. Raising the landward weight keeps the sluice mouth clear through the high tide. A borrowed inspection kit survives this observation and still belongs to Nessa.')]}),
 local('return_kit','Return Nessa’s actual inspection kit',{targetId:TIDEMARK_IDS.keeper,coLocated:true,requires:eq('tidemark.loanHeld'),visibleWhen:eq('tidemark.loanHeld'),
 effects:[{type:'custody',from:'player',to:TIDEMARK_IDS.keeper,key:TIDEMARK_KEYS.kit,count:1,loanId:'tidemark.inspection_loan',returning:true},know('loan_return','You returned the actual inspection kit and cleared its custody record. No copied kit or reward was created.')]})
 ]
};
const excluded=new Set(['tidemark.open_receipt','tidemark.enter_receipt','tidemark.exit_receipt']);
export const tidemarkActions = [
 ...tidemarkDefinitions.commands.filter(d=>!excluded.has(d.id)).map(d=>({id:d.id,label:d.label,targetId:d.targetId||null})),
 {id:'tidemark.open',label:'Open the Tidemark passage · 1 wooden coin'},
 {id:'tidemark.enter',label:'Visit Tidemark · carry your body and belongings'},
 {id:'tidemark.return',label:'Return to Village · keep your belongings'},
 {id:'tidemark.terrace',label:'Walk to the low terraces'},
 {id:'tidemark.landing',label:'Return to the landing'},
 {id:'tidemark.cancel',label:'Cancel your Tidemark work · refund its reserved costs'}
];
