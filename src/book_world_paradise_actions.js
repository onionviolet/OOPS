// Supplied-MTL sid20 cast and means, original independent parallel branch.
// All numbers, played intervals, wages and alternative outcomes are prototypes.
// Definitions grant nothing. Existing simulation/native owners publish effects.
import {PARADISE_IDS as I,PARADISE_LOCATIONS as L,PARADISE_KEYS as K,PARADISE_FOOTPRINTS} from './book_world_paradise_ids.js';
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const eq=(fact,value=true)=>({fact,op:'eq',value}),gte=(fact,value)=>({fact,op:'gte',value});
const all=(...rules)=>({all:rules}),any=(...rules)=>({any:rules}),not=rule=>({not:rule});
const af=(key,value=true,actor='player')=>({type:'fact',scope:'actor',actor,key:`book.paradise.${key}`,value});
const wf=(key,value=true,worldId=I.goa)=>({type:'world',worldId,key:worldId===I.goa?`book.goa.${key}`:`book.paradise.hub.${key}`,value});
const money=(actor,amount,hub=false)=>({type:'resource',actor,key:hub?'book.paradise.coin':'book.paradise.belli',amount});
const attention=(actor,amount=-1)=>({type:'resource',actor,key:'book.paradise.attention',amount});
const agenda=actor=>({type:'resource',actor,key:'book.paradise.agenda',amount:-1});
const stamina=(actor,amount=-1)=>({type:'vital',actor,key:'stamina',amount});
const item=(actor,key,amount,returned=false)=>({type:'item',actor,key,amount,...(returned?{reservationReturn:true}:{})});
const transfer=(from,to,key,count=1)=>({type:'transfer',from,to,key,count});
const know=(key,value,attributedTo,actor='player',kind='observation',stage='seen')=>({type:'knowledge',actor,key:`book.paradise.${key}`,stage,value,basis:{kind,attributedTo,situationId:'book.paradise.side_branch'}});
const has=key=>eq(`actor.book.paradise.${key}`),world=(key,value=true)=>eq(`world.book.goa.${key}`,value);
const support=id=>eq(`paradise.support.${id}`),local=w=>eq(`paradise.local.${w}`);
const ready=all(eq('paradise.nativeBound'),eq('paradise.playerSupported'));
const beforeFire=world('fire','planned');
const ended=eq('paradise.outcomesResolved');
const reportReady=all(ended,eq('paradise.miaAccountReady'));
const job=(duration,requires,coLocated=false)=>({duration,cancellation:'refund',completionFailure:'refund',completionRequires:requires,completionCoLocated:coLocated});
// Original bounded report bridge, not an additional supplied-MTL event. The
// world owns the physical route; Hank owns only what he actually receives.
export const PARADISE_HANK_ROUTE_REPORT=freeze({
 id:'book.paradise.report_route_to_hank',claim:'book.paradise.goa.hank_route_report',received:'book.paradise.receivedCivilRoute',
 playerReceipt:'book.paradise.hankRouteReport',delivered:'book.paradise.hankRouteReportDelivered',used:'book.paradise.routeReportUsed',
 receivedText:'The traveler met me at the actual guardhouse, showed my retained physical duty copy and described their completed warning with Mia at the small prepared civilian cache and escape route. I received this limited current route report from the traveler; my own guardhouse duty copy did not already tell me the new route. Its real continued access, my own body, food, rope, funds and attention still determine whether I can use it. No future outcome or general evacuation capacity was promised.',
 playerText:'I met Hank at his actual guardhouse and briefed him on my completed warning with Mia and the real small prepared civilian route. He checked the held duty copy and spent one of his own attention during the two-minute report; my one stamina was spent and the same copy returned. Hank now has his own attributed received account. His separate funded shelter decision, actual route access and survival remain unguaranteed.',
 shelterText:'I used the traveler\'s actually received guardhouse report about Mia\'s small prepared route. The physical warning, cache and escape route still existed. I spent my own meal, rope, funds, body and finite duty attention to reach the gate. Receiving information did not supply those means or guarantee this shelter.',
});
const routeReportSupport=all(has('hankMet'),has('civilWarningDelivered'),eq('paradise.playerCivilRouteEvidence'),world('hank','on_duty'),world('warning'),world('cache'),world('gate','escape_route'),not(has('hankRouteReportDelivered')));
const informedShelterSupport=all(world('hank','on_duty'),world('warning'),world('cache'),world('gate','escape_route'),eq('paradise.hankReceivedCivilRoute'));
function cmd(id,label,w,location,d={}) {
 const requires=all(ready,local(w),...(d.targetId?[support(d.targetId)]:[]),...(d.requires?[d.requires]:[]));
 return {id:`book.paradise.${id}`,revision:1,label,group:'book_paradise',actorId:'player',worldId:w,location,once:true,costs:[],effects:[],visibleWhen:d.visibleWhen||d.requires||local(w),
  ...d,requires,...((d.costs?.length||d.duration)&&!d.claim?{claim:`book.paradise.receipt.${id}`} : {}),...(d.targetId?{coLocated:true,participants:['$target']}:{}),
  ...(d.duration?{completionRequires:all(ready,local(w),...(d.targetId?[support(d.targetId)]:[]),d.completionRequires||requires)}:{})};
}
function npc(id,label,actor,location,d={}) {
 const requires=all(ready,local(I.goa),support(actor),eq(`paradise.at.${actor}`,location),...(d.requires?[d.requires]:[]));
 return {id:`book.paradise.npc.${id}`,revision:1,label,group:'book_paradise_npc',actorId:actor,worldId:I.goa,location,once:true,audience:['$actor'],costs:[],effects:[],...d,requires,...((d.costs?.length||d.duration)&&!d.claim?{claim:`book.paradise.npc.receipt.${id}`} : {}),
  ...(d.duration?{completionRequires:all(ready,local(I.goa),support(actor),eq(`paradise.at.${actor}`,location),d.completionRequires||requires)}:{})};
}
const fundedWork=(id,label,w,location,payer,hub,method=false)=>cmd(id,label,w,location,{targetId:payer,visibleWhen:hub?eq('world.book.paradise.hub.met'):has('porterMet'),
 requires:all(hub?eq('world.book.paradise.hub.met'):all(world('met'),has('porterMet')),not(hub?eq('world.book.paradise.hub.workDone'):world('lifeDone'))),
 ...job(method?3:5,all(support(payer),hub?eq('world.book.paradise.hub.met'):world('met')),true),
 claim:hub?'book.paradise.hub.packing_receipt':'book.paradise.goa.porter_receipt',
 costs:[money(payer,-8,hub),item(payer,K.log,-1),item(payer,K.rope,-1),...(hub?[item(payer,K.kit,-1)]:[item(payer,K.ration,-1)]),stamina('player',-2),attention(payer)],
 effects:[money('player',8,hub),...(hub?[item(payer,K.kit,1,true),wf('workDone',true,I.hub)]:[wf('lifeDone'),item('player',K.ration,1)]),
  {type:'xp',actor:'player',skill:'Equilibrium',amount:5},af(hub?'hubPaid':'lifePaid'),
  know(hub?'packingReceipt':'porterReceipt',hub?'The service worker paid eight owned district credits for your completed packing shift and supplied the wood, rope and reusable kit. Those finite wages are yours; this grants no employee office or Hunter task.':'Rin paid eight owned local belli for your completed pier shift and handed over one of their own food parcels. Independent paid work remains valid without Su Xiao’s allegiance.',payer)]});
const methodReady=all(eq('paradise.methodSupported'),gte(`power.${I.method}.mastery`,0));
const cacheRequires=all(world('met'),beforeFire,not(world('cache')));
const cache=(braced)=>cmd(braced?'cache_braced':'cache_ordinary',braced?'Brace a small civilian cache · log, rope, ration and reusable kit':'Build a small ordinary civilian cache · 2 logs, rope and ration',I.goa,L.gray,{
 targetId:I.mia,visibleWhen:all(world('met'),beforeFire,not(world('cache'))),requires:all(cacheRequires,...(braced?[methodReady]:[])),
 ...(braced?{powerId:I.method}:{}),claim:'book.paradise.goa.civil_cache',...job(braced?4:6,all(cacheRequires,...(braced?[eq('paradise.methodFacultySupported')]:[])),true),
 costs:[item('player',K.log,braced?-1:-2),item('player',K.rope,-1),item('player',K.ration,-1),...(braced?[item('player',K.kit,-1)]:[]),stamina('player',braced?-1:-2),attention(I.mia)],
 effects:[...(braced?[item('player',K.kit,1,true),{type:'power',actor:'player',powerId:I.method,operation:'refine',amount:1}]:[]),wf('cache'),wf('cacheCapacity',braced?3:2),wf('cacheMethod',braced?'braced':'ordinary'),
  {type:'xp',actor:'player',skill:'Equilibrium',amount:braced?8:5},know('cache',braced?'Mia helped place your counted food, timber and rope into a small braced supply cache. The practiced booth procedure saved one log and earned its own practice; your reusable kit returned. This original support has capacity three, not a promise of mass evacuation.':'Mia helped place your counted food, timber and rope into a small ordinary support cache. The extra timber substitutes for the paid bracing procedure. This original support has capacity two, not a promise of mass evacuation.',I.mia)]});
const shop=(id,w,location,owner,key,count,price)=>cmd(id,`Buy ${count} ${JSON.parse(key).id} · ${price} ${w===I.hub?'district credits':'belli'}`,w,location,{
 visibleWhen:w===I.hub?eq('world.book.paradise.hub.met'):world('met'),requires:gte(`paradise.stock.${owner}.${key}`,count),
 paradiseStock:[{owner,key,count:-count}],costs:[money('player',-price,w===I.hub)],effects:[money(w===I.hub?I.employee:I.porter,price,w===I.hub),item('player',key,count),know(`purchase.${id}`,'Bought the displayed counted parcel from the finite local shop. Its goods grant no replenishment, technique or copied source entitlement.',w===I.hub?I.employee:I.porter)]});
const players=[
 {id:'book.paradise.chart',revision:1,label:'Read the parallel-entry body, cargo and source terms',group:'book_paradise',actorId:'player',worldId:'base.frontier',location:'Village',once:true,costs:[],visibleWhen:eq('village.elderMet'),requires:all(eq('village.elderMet'),eq('paradise.chartSupported')),
  effects:[{type:'situation',situationId:'book.paradise.side_branch',operation:'begin'},af('chart'),know('chart','This is an original voluntary parallel entry beside the supplied-MTL first-Goa era. You keep your actual living native body, owned cargo and learned history. Ordinary district work and optional contractor travel are separate choices. Entry supplies only the disclosed local language understanding, not Su Xiao’s Hunter role, talent, money, guard office, memories, private task or return protection. Unknown source rights remain unknown. All costs, local played intervals and alternative outcomes are original prototypes; unsupported absence freezes the place.', 'player','player','instruction','understood')]},
 cmd('hub_meet','Meet the independent service desk',I.hub,L.hub,{targetId:I.employee,requires:not(eq('world.book.paradise.hub.met')),effects:[wf('met',true,I.hub),know('hub','The service worker offers one packing shift funded by their own materials and eight owned credits, a two-credit bracing lesson and paid rest. You remain an independent visitor; service work grants no Hunter title.',I.employee)]}),
 fundedWork('hub_shift','Accept the funded packing shift · employee supplies and 8 credits',I.hub,L.hub,I.employee,true),
 cmd('lesson','Buy the attributed load-bracing lesson · 2 credits, paired effort',I.hub,L.hub,{targetId:I.employee,requires:all(eq('world.book.paradise.hub.met'),not(eq(`power.${I.method}.owned`))),
  ...job(3,support(I.employee),true),costs:[money('player',-2,true),stamina('player'),stamina(I.employee),attention(I.employee),item(I.employee,K.kit,-1)],
  effects:[money(I.employee,2,true),item(I.employee,K.kit,1,true),{type:'source',actor:'player',sourceId:I.method,operation:'grant',origin:'trained',awakened:true,active:true},{type:'power',actor:'player',powerId:I.method,operation:'learn'},af('lessonTaken'),
   know('lesson','The consenting service worker taught an original hands-and-kit procedure: align the loaded frame, seat its rope brace, test before releasing. You acquired your own zero-start practiced procedure. It can save timber at this small Goa cache; ordinary extra-timber construction remains available. No mana source, teacher mastery or foreign sword method was copied.',I.employee,'player','instruction','understood')]}),
 shop('hub_kit',I.hub,L.hub,I.hubShop,K.kit,1,2),shop('hub_rope',I.hub,L.hub,I.hubShop,K.rope,1,1),shop('hub_ration',I.hub,L.hub,I.hubShop,K.ration,1,2),
 cmd('hub_rest','Pay for district rest · 1 credit and 4 played minutes',I.hub,L.hub,{targetId:I.employee,requires:eq('world.book.paradise.hub.met'),...job(4,support(I.employee),true),costs:[money('player',-1,true),attention(I.employee)],effects:[money(I.employee,1,true),{type:'vital',actor:'player',key:'stamina',amount:4},know('rest','Paid for one actual rest interval. Native stamina recovery remains bounded by your real maximum; no clock, death or extraction immunity follows.',I.employee)]}),
 cmd('goa_meet','Meet Mia in Gray Terminal',I.goa,L.gray,{targetId:I.mia,requires:not(world('met')),effects:[wf('met'),af('miaMet'),know('mia','Mia knows the local streets and the guarded capital. Rin works at the provision pier; Hank works at the guardhouse. A small counted supply cache can support a few people even without a political alliance. None of this is a promise that the district will remain safe.',I.mia)]}),
 cmd('porter_meet','Meet Rin at the provision pier',I.goa,L.pier,{targetId:I.porter,requires:world('met'),effects:[af('porterMet'),know('porter','Rin is an original local porter with their own finite pay and stores. They offer one paid shift and food parcel independently of every guard or pirate bargain.',I.porter)]}),
 fundedWork('porter_shift','Work the independent pier shift · 8 belli and one owned ration',I.goa,L.pier,I.porter,false),
 shop('goa_logs',I.goa,L.pier,I.goaShop,K.log,2,2),shop('goa_rope',I.goa,L.pier,I.goaShop,K.rope,1,1),shop('goa_spare_rope',I.goa,L.pier,I.goaShop,K.rope,1,1),shop('goa_ration',I.goa,L.pier,I.goaShop,K.ration,1,1),
 cmd('eat','Pay for a local meal with your counted ration · 1 belli',I.goa,L.pier,{targetId:I.porter,visibleWhen:has('porterMet'),requires:has('porterMet'),...job(2,support(I.porter),true),costs:[money('player',-1),item('player',K.ration,-1),attention(I.porter)],effects:[money(I.porter,1),{type:'vital',actor:'player',key:'stamina',amount:4},know('meal','Rin prepared your own counted food parcel for one actual belli. The consumed parcel and paid interval recovered native stamina within its actual maximum.',I.porter)]}),
 cmd('hank_meet','Meet Hank at the guardhouse',I.goa,L.guard,{targetId:I.hank,visibleWhen:has('miaMet'),requires:has('miaMet'),effects:[af('hankMet'),know('hank','Hank is a guard with his own current duty. Su Xiao is presently associated with the guardhouse. That introduction gives you neither guard jurisdiction nor his private assignment.',I.hank)]}),
 cmd('hank_copy','Ask Hank for his physical operation-duty copy',I.goa,L.guard,{targetId:I.hank,visibleWhen:has('hankMet'),requires:all(has('hankMet'),beforeFire,eq('paradise.hankOwnsProof')),
  costs:[transfer(I.hank,'player',K.proof),attention(I.hank)],effects:[af('warningLearned'),know('dutyWarning','Hank hands you his actual duty copy and identifies a planned Krieg fuel operation against Gray Terminal. His limited account mentions tomorrow at 18:00. Your agreed played-time window is an original branch term, not a conversion of that source notice. The copy supports local warning or negotiation, not author knowledge of what will happen.',I.hank)]}),
 cmd('su_meet','Speak with Su Xiao at the guardhouse',I.goa,L.guard,{targetId:I.su,visibleWhen:has('hankMet'),requires:all(has('hankMet'),world('suXiao','preparing')),costs:[attention(I.su)],effects:[af('suMet'),know('su','Su Xiao acknowledges the introduction while tending his damaged long sword. He offers a narrow supply exchange; he does not disclose a complete plan or give you his office, talent, necklaces or mission. You may decline.',I.su)]}),
 cmd('su_cooperate','Offer Su Xiao your ration for his current physical preparation',I.goa,L.guard,{targetId:I.su,visibleWhen:has('suMet'),requires:all(has('suMet'),not(has('routeDecided')),world('suXiao','preparing')),
  costs:[transfer('player',I.su,K.ration)],effects:[af('routeDecided'),af('route','cooperate'),af('supplyReceived',true,I.su),know('route','You supplied one owned ration for Su Xiao’s separate preparation. His actual stores changed. This is limited cooperation, with no copied office, assassination reward or return entitlement.',I.su)]}),
 cmd('su_refuse','Decline Su Xiao’s supply request and retain an independent route',I.goa,L.guard,{targetId:I.su,visibleWhen:has('suMet'),requires:all(has('suMet'),not(has('routeDecided'))),effects:[af('routeDecided'),af('route','independent'),know('route','You declined the supply exchange. Your pier wages, cache work, warnings and future local account remain your own; Su Xiao keeps his separate aims and means.',I.su)]}),
 cmd('krieg_meet','Meet Krieg at the provision pier',I.goa,L.pier,{targetId:I.krieg,visibleWhen:has('warningLearned'),requires:all(has('warningLearned'),beforeFire),costs:[attention(I.krieg)],effects:[af('kriegMet'),know('krieg','Krieg acknowledges the duty copy and two actual ignition casks in his current possession. He will consider a paid surrender of those casks. You cannot order his crew by displaying another person’s office.',I.krieg)]}),
 cache(false),cache(true),
 cmd('warn_civilians','Deliver Hank’s warning with a ration and rope to the prepared route',I.goa,L.gray,{targetId:I.mia,visibleWhen:has('warningLearned'),requires:all(has('warningLearned'),world('cache'),beforeFire,not(world('warning'))),claim:'book.paradise.goa.warning_delivery',
  ...job(4,all(world('cache'),beforeFire),true),costs:[item('player',K.proof,-1),item('player',K.rope,-1),item('player',K.ration,-1),stamina('player',-2),attention(I.mia)],
  effects:[item('player',K.proof,1,true),wf('warning'),wf('gate','escape_route'),af('civilWarningDelivered'),know('civilWarning','Mia read the actual duty copy, accepted your additional food and rope, and directed willing people to the small prepared route. Hank has not received this new route information merely because Mia was warned; a separate actual guardhouse report can inform his next supported choice. Capacity stays limited and no mass-safe exit is promised.',I.mia)]}),
 cmd('report_route_to_hank','Brief Hank on your prepared civilian route · held duty copy + 1 stamina + 2 min',I.goa,L.guard,{targetId:I.hank,
  visibleWhen:all(has('hankMet'),has('civilWarningDelivered'),not(has('hankRouteReportDelivered'))),requires:routeReportSupport,claim:PARADISE_HANK_ROUTE_REPORT.claim,
  ...job(2,routeReportSupport,true),costs:[item('player',K.proof,-1),stamina('player'),attention(I.hank)],
  effects:[item('player',K.proof,1,true),af('hankRouteReportDelivered'),
   know('receivedCivilRoute',PARADISE_HANK_ROUTE_REPORT.receivedText,'player',I.hank,'instruction','understood'),
   know('hankRouteReport',PARADISE_HANK_ROUTE_REPORT.playerText,I.hank)],
  description:'A separate original direct report at the guardhouse after your actually completed Mia warning and cache. Reserve the real duty copy, one player stamina, one Hank attention and both bodies for two played minutes. Completion rechecks Hank, co-location and the physical escape route. Cancellation or lost support returns those exact reservations and delivers no knowledge. The report can be declined by leaving it unaccepted; no new shelter, stock, office or guaranteed survival is granted.'}),
 cmd('divert_fuel','Negotiate Krieg’s consented surrender of both real casks · 2 belli',I.goa,L.pier,{targetId:I.krieg,visibleWhen:has('kriegMet'),requires:all(has('kriegMet'),has('warningLearned'),beforeFire,not(world('fuelDiverted')),gte('paradise.kriegCasks',2)),claim:'book.paradise.goa.fuel_bargain',
  ...job(3,all(beforeFire,support(I.krieg)),true),costs:[money('player',-2),transfer(I.krieg,'player',K.cask,2),item('player',K.proof,-1),attention(I.krieg),stamina('player')],
  effects:[money(I.krieg,2),item('player',K.proof,1,true),wf('fuelDiverted'),af('fuelConsent'),know('fuelBargain','Krieg consented to transfer both counted ignition casks for your two actual belli after reading the duty copy. His next operation no longer owns ignition fuel. The surrendered casks remain your actual cargo; no general bomb power or guaranteed political peace was granted.',I.krieg)]}),
 cmd('guard_access','Pay Hank for one documented palace-warning admission · 2 belli',I.goa,L.guard,{targetId:I.hank,visibleWhen:has('warningLearned'),requires:all(has('hankMet'),has('warningLearned'),beforeFire,world('king','alive')),
  costs:[money('player',-2),item('player',K.proof,-1),attention(I.hank)],effects:[money(I.hank,2),item('player',K.proof,1,true),af('palaceAccess'),af('localPermit'),know('palaceAccess','Hank checked his physical duty copy and accepted payment for one local warning admission. This limited guard access grants no command over guards, noble rank or Su Xiao’s office.',I.hank)]}),
 cmd('palace_warning','Show Philip Herbert the actual duty copy and warn him',I.goa,L.palace,{targetId:I.king,visibleWhen:has('palaceAccess'),requires:all(has('palaceAccess'),has('warningLearned'),world('king','alive'),not(world('kingWarned'))),claim:'book.paradise.goa.palace_warning',
  ...job(2,world('king','alive'),true),costs:[item('player',K.proof,-1),stamina('player'),attention(I.king)],effects:[item('player',K.proof,1,true),wf('kingWarned'),af('palaceWarningDelivered'),know('palaceWarning','Philip Herbert accepted the physical duty copy as a current warning. He now has a reason to spend his own means on evacuation. You did not receive a royal office or a Hunter task success; his actual next action still has to occur.',I.king)]}),
 cmd('abstain','Tell Mia you will keep civilian work separate from the operation',I.goa,L.gray,{targetId:I.mia,visibleWhen:has('miaMet'),requires:all(has('miaMet'),not(has('operationChoice'))),effects:[af('operationChoice','abstained'),know('abstention','You chose ordinary civilian work without pledging yourself to the guard or pirate operation. The cache remains useful if you built it, and the independent pier job remains payable. This statement guarantees no other person’s fate.',I.mia)]}),
 ...['burned','contained'].map(value=>cmd(`report_fire_${value}`,'Ask Mia what actually happened to the district',I.goa,L.gray,{targetId:I.mia,visibleWhen:all(reportReady,not(has('fireReport'))),requires:all(reportReady,world('fire',value)),effects:[af('fireReport'),know('fireReport',value==='burned'?'Mia’s afterfire account: the ignition operation actually burned part of Gray Terminal. Retained supplies, a prepared escape route or a breached gate describe only the capacity this branch actually built; damage remains.':'Mia’s afterfire account: Krieg’s consented loss of both casks prevented this finite ignition operation. Gray Terminal retains a contained-fire outcome, and any civilian cache remains useful. This says nothing about unrelated future threats.',I.mia)]})),
 ...['sheltered','dead'].map(value=>cmd(`report_hank_${value}`,'Ask Mia for the returned guard-duty account',I.goa,L.gray,{targetId:I.mia,visibleWhen:all(reportReady,not(has('hankReport'))),requires:all(reportReady,world('hank',value)),effects:[af('hankReport'),know('hankReport',value==='sheltered'?'Mia identifies Hank’s actual surviving shelter disposition after the operation. His source role did not protect him automatically; his funded shelter action and this branch’s retained route or lack of ignition made the difference.':'Mia names Hank among the dead after the actual fire and breached-gate operation. No supported early shelter occurred. His death and the lost living contact remain retained consequences, not an invitation to reset the source plot.',I.mia)]})),
 ...['killed','escaped','alive'].map(value=>cmd(`report_king_${value}`,'Ask Mia for the current palace account',I.goa,L.gray,{targetId:I.mia,visibleWhen:all(reportReady,not(has('kingReport'))),requires:all(reportReady,world('king',value)),effects:[af('kingReport'),know('kingReport',value==='killed'?'Mia relays the returned palace account: Su Xiao’s physically supported sword attempt killed Philip Herbert. Su Xiao then left this represented palace scene; no Paradise transit or extraction is implemented. You receive no king-kill credit, Soul Eater yield or Hunter payout.':value==='escaped'?'Mia relays the returned palace account: the king spent his own means to escape after your documented warning. Su Xiao spent his remaining finite search-stage means and remains in Goa searching without a confirmed kill. No automatic Hunter success or safe-return reward was generated.':'Mia relays the returned palace account: Philip Herbert remains alive after Su Xiao’s bounded local search stage found no supported target opportunity; Su Xiao is still searching in Goa. This is an actual unresolved political life, not plot immunity or an invented player victory.',I.mia)]})),
 cmd('close_account','Record your own completed local account with Mia',I.goa,L.gray,{targetId:I.mia,visibleWhen:all(ended,has('fireReport'),has('hankReport'),has('kingReport')),requires:all(ended,world('lifeDone'),has('fireReport'),has('hankReport'),has('kingReport'),not(world('arcClosed'))),claim:'book.paradise.goa.civil_account',effects:[wf('arcClosed'),wf('aftermath','accounted'),af('localAccount'),know('ownAccount','You recorded your own earned pier wage, current cache or abstention, actually delivered warnings or consented fuel bargain, and the attributed fire/guard/palace accounts. The finite local arc is accounted for. Your extraction, contractor settlement or ordinary return remains a separate agreement, and this district keeps its changed facts.',I.mia)]}),
 cmd('continued_life','Repair Rin’s retained pier support · 3 owned belli and spare rope',I.goa,L.pier,{targetId:I.porter,visibleWhen:all(world('arcClosed'),has('porterMet')),requires:all(world('arcClosed'),has('porterMet'),not(has('continuedDone'))),claim:'book.paradise.goa.continued_work',
  ...job(4,world('arcClosed'),true),costs:[money(I.porter,-3),item(I.porter,K.log,-1),item(I.porter,K.rope,-1),stamina('player',-2),attention(I.porter)],effects:[money('player',3),item('player',K.rope,1),wf('pierRepaired'),af('continuedDone'),{type:'xp',actor:'player',skill:'Equilibrium',amount:8},know('continuedLife','Rin spent their own remaining funds and materials on one repair of the retained pier support, paid you three belli and transferred their last spare rope. The changed district supports a finite useful local life after the operation; no repeated source payout or shop refill occurred.',I.porter)]})
];

const actors=[
 npc('mia_account','Mia spends her own effort on the current afterfire duty account',I.mia,L.gray,{requires:all(ended,world('palaceAccountDispatched'),not(eq('actor.book.paradise.accountReady'))),...job(2,all(ended,world('palaceAccountDispatched'))),costs:[stamina(I.mia,-2),attention(I.mia)],effects:[af('accountReady',true,I.mia),know('private.account','I observed the district’s actual damage or contained operation and received the limited palace-duty account funded by Su Xiao’s own two local belli. My own present body and attention assembled this finite account; it contains no whole-author future prophecy.',I.mia,I.mia)]}),
 npc('krieg_ignite','Krieg executes his current finite ignition operation',I.krieg,L.pier,{requires:all(beforeFire,not(world('fuelDiverted')),gte('paradise.goaElapsed',54),gte('paradise.kriegCasks',1)),claim:'book.paradise.goa.fire_operation',
  ...job(2,all(beforeFire,not(world('fuelDiverted')))),costs:[item(I.krieg,K.cask,-1),stamina(I.krieg,-2),attention(I.krieg),agenda(I.krieg)],effects:[wf('fire','burned'),know('private.fire','I consumed one actual ignition cask and my current body, attention and agenda on the agreed local operation. Its retained branch now has real fire damage.',I.krieg,I.krieg)]}),
 npc('krieg_contained','Krieg abandons this ignition after consented cask surrender',I.krieg,L.pier,{requires:all(beforeFire,world('fuelDiverted'),gte('paradise.goaElapsed',54)),claim:'book.paradise.goa.fire_operation',
  costs:[stamina(I.krieg),agenda(I.krieg)],effects:[wf('fire','contained'),know('private.fire','I accepted payment and surrendered both actual casks. This finite operation cannot ignite with my former fuel; I retain the negotiated payment and changed choice.',I.krieg,I.krieg)]}),
 npc('krieg_breach','Krieg spends his remaining actual cask on the shut gate',I.krieg,L.pier,{requires:all(world('fire','burned'),world('gate','shut'),gte('paradise.kriegCasks',1)),...job(3,all(world('fire','burned'),world('gate','shut'))),
  costs:[item(I.krieg,K.cask,-1),stamina(I.krieg,-2),agenda(I.krieg)],effects:[wf('gate','breached'),know('private.gate','My second actual cask breached the shut gate after ignition. Those two consumed casks cannot be spent again, and the district fire is not undone.',I.krieg,I.krieg)]}),
 npc('hank_shelter_route','Hank uses the supported civilian route he was actually told about',I.hank,L.guard,{revision:2,requires:informedShelterSupport,
  ...job(2,informedShelterSupport),costs:[money(I.hank,-1),item(I.hank,K.ration,-1),item(I.hank,K.rope,-1),stamina(I.hank),attention(I.hank),agenda(I.hank)],
  effects:[{type:'relocate',actor:I.hank,location:L.gate},wf('hank','sheltered'),af('routeReportUsed',true,I.hank),know('private.shelter',PARADISE_HANK_ROUTE_REPORT.shelterText,I.hank,I.hank)]}),
 npc('hank_shelter_contained','Hank retains a funded shelter after the ignition is contained',I.hank,L.guard,{requires:all(world('hank','on_duty'),world('fire','contained')),
  costs:[money(I.hank,-1),item(I.hank,K.ration,-1),stamina(I.hank),attention(I.hank),agenda(I.hank)],effects:[wf('hank','sheltered'),know('private.shelter','The diverted ignition never reached my duty station. I spent my own means on shelter; this is a changed operation outcome, not source-character immunity.',I.hank,I.hank)]}),
 npc('hank_afterfire_death','Hank’s unsupported afterfire duty ends in actual death',I.hank,L.guard,{requires:all(world('hank','on_duty'),world('fire','burned'),world('gate','breached'),not(world('warning'))),...job(2,all(world('hank','on_duty'),world('fire','burned'),world('gate','breached'),not(world('warning')))),
  costs:[stamina(I.hank),attention(I.hank),agenda(I.hank)],effects:[{type:'relocate',actor:I.hank,location:L.gray},wf('hank','dead'),{type:'vital',actor:I.hank,key:'health',amount:{fact:`paradise.health.${I.hank}`,scale:-1}},{type:'life',actor:I.hank,status:'dead',lethal:true,reason:'Unsupported afterfire duty: retained ignition and gate breach without the warned shelter route.'}]}),
 npc('king_evacuate','Philip Herbert spends his own means to evacuate after proof',I.king,L.palace,{requires:all(world('king','alive'),world('kingWarned')), ...job(2,all(world('king','alive'),world('kingWarned'))),
  costs:[money(I.king,-4),item(I.king,K.ration,-1),stamina(I.king,-2),attention(I.king),agenda(I.king)],effects:[wf('king','escaped'),{type:'life',actor:I.king,status:'departed',reason:'Spent owned evacuation means after receiving the player-delivered duty copy.'},know('private.evacuation','I accepted a physical current warning and spent my own funds, food and effort to leave the threatened palace. My actual absence changes the attacker’s next choice.',I.king,I.king)]}),
 npc('su_prepare','Su Xiao performs his source-era physical sword preparation',I.su,L.guard,{powerId:I.blade,requires:all(world('suXiao','preparing'),not(eq('actor.book.paradise.bladePrepared')),eq('paradise.suSwordSupported')),
  ...job(3,all(eq('paradise.suSwordFacultySupported'),world('suXiao','preparing'))),costs:[item(I.su,K.sword,-1),stamina(I.su,-2),attention(I.su),agenda(I.su)],
  effects:[item(I.su,K.sword,1,true),af('bladePrepared',true,I.su),{type:'power',actor:I.su,powerId:I.blade,operation:'refine',amount:1},know('private.preparation','I practiced with my own damaged source-era sword and body. Soul Eater remains my separately awakened faculty, maximum91 analytically sourced; its current mana balance and king yield are unknown and unused here.',I.su,I.su)]}),
 npc('su_supplied_meal','Su Xiao uses the player-supplied food for his own preparation',I.su,L.guard,{requires:all(world('suXiao','preparing'),eq('actor.book.paradise.bladePrepared'),eq('actor.book.paradise.supplyReceived'),gte('paradise.suRations',1)),
  costs:[item(I.su,K.ration,-1)],effects:[{type:'vital',actor:I.su,key:'stamina',amount:2},wf('suSupplyUsed'),know('private.supplies','I consumed the actual ration offered to me and recovered two spent native stamina within my own maximum after sword preparation. This is practical aid, not friendship, copied knowledge or a player claim on my task.',I.su,I.su)]}),
 npc('su_move','Su Xiao pays his own effort to reach the actual palace approach',I.su,L.guard,{requires:all(world('suXiao','preparing'),eq('actor.book.paradise.guardChief'),eq('actor.book.paradise.bladePrepared'),gte('paradise.goaElapsed',42),eq('paradise.suSwordSupported')),
  costs:[stamina(I.su,-2),attention(I.su),agenda(I.su)],effects:[{type:'relocate',actor:I.su,location:L.palace},wf('suXiao','moving'),know('private.approach','I spent my own effort and attention reaching the actual palace approach. This original played interval models one local opportunity; it does not synchronize the source midnight task with the next-day18:00 fire.',I.su,I.su)]}),
 npc('su_attempt','Su Xiao attempts the current reachable palace target with his own sword',I.su,L.palace,{powerId:I.blade,requires:all(world('suXiao','moving'),world('king','alive'),not(world('kingWarned')),eq('paradise.kingReachable'),eq('paradise.suSwordSupported')),
  ...job(3,all(world('king','alive'),not(world('kingWarned')),eq('paradise.kingReachable'),eq('paradise.suSwordFacultySupported'))),costs:[item(I.su,K.sword,-1),money(I.su,-2),stamina(I.su,-3),attention(I.su),agenda(I.su)],
  effects:[item(I.su,K.sword,1,true),wf('king','killed'),{type:'vital',actor:I.king,key:'health',amount:{fact:`paradise.health.${I.king}`,scale:-1}},{type:'life',actor:I.king,status:'dead',lethal:true,reason:'Actual source-era sword attempt against a currently reachable unwarned palace target.'},wf('suXiao','departed'),wf('palaceAccountDispatched'),{type:'life',actor:I.su,status:'departed',reason:'Left this represented palace scene after a supported king attempt; remains world Goa. No Paradise transit, extraction, player payout or safe-return guarantee is implemented.'},know('private.target','My supported physical attempt reached the actual present king. I leave this represented palace scene only; two owned local belli dispatch a limited returned duty account. No future sword faculty, unknown Soul Eater yield or transferable Hunter reward is implemented.',I.su,I.su)]}),
 npc('su_search','Su Xiao keeps searching when warning removes his target opportunity',I.su,L.palace,{requires:all(world('suXiao','moving'),eq('paradise.palaceOpportunityResolved'),any(world('king','escaped'),world('kingWarned'),not(eq('paradise.kingReachable')))),
  costs:[stamina(I.su),attention(I.su)],effects:[wf('suXiao','searching'),know('private.search','The actual target opportunity is absent or disrupted. I spend remaining current attention and body on searching rather than restoring a source plot or claiming a kill.',I.su,I.su)]}),
 npc('su_end_search','Su Xiao records one bounded search stage while remaining in Goa',I.su,L.palace,{requires:world('suXiao','searching'),...job(5,world('suXiao','searching')),costs:[money(I.su,-2),stamina(I.su)],
  effects:[af('searchAccountClosed',true,I.su),wf('palaceAccountDispatched'),know('private.searchEnd','I spent two local belli and current effort on one bounded search stage and a limited returned duty account. I remain in Goa searching for my unresolved source target; no extraction, Paradise return, task success, safe return or forced canon restoration follows.',I.su,I.su)]})
];
export const paradiseSituations=freeze([{id:'book.paradise.side_branch',revision:1,label:'Independent parallel-entry observed account',context:{worldId:'base.frontier',instanceId:'frontier.main',continuityId:'book.paradise.first_goa.side_branch',eraId:'book.paradise.first_goa.before_fire',regionId:'frontier.village'},participants:['player'],initialPhase:'present',phases:['present'],privateTruth:{role:'independent_parallel',timing:'original_played_intervals_not_source_clock_conversion'}}]);
export const paradiseCommands=freeze([...players,...actors]);
export const paradiseControllers=freeze([
 {id:'book.paradise.mia.controller',revision:1,label:'Mia’s finite observed and received duty account',actorId:I.mia,interval:2,actions:[{commandId:'book.paradise.npc.mia_account',priority:1}]},
 {id:'book.paradise.krieg.controller',revision:1,label:'Krieg’s finite owned-cask operation',actorId:I.krieg,interval:2,actions:[{commandId:'book.paradise.npc.krieg_contained',priority:3},{commandId:'book.paradise.npc.krieg_ignite',priority:2},{commandId:'book.paradise.npc.krieg_breach',priority:1}]},
 {id:'book.paradise.hank.controller',revision:1,label:'Hank’s supported shelter or dangerous duty',actorId:I.hank,interval:2,actions:[{commandId:'book.paradise.npc.hank_shelter_route',priority:3},{commandId:'book.paradise.npc.hank_shelter_contained',priority:2},{commandId:'book.paradise.npc.hank_afterfire_death',priority:1}]},
 {id:'book.paradise.king.controller',revision:1,label:'Philip Herbert’s proof-responsive evacuation',actorId:I.king,interval:2,actions:[{commandId:'book.paradise.npc.king_evacuate',priority:1}]},
 {id:'book.paradise.su.controller',revision:1,label:'Su Xiao’s separate finite physical preparation and attempt',actorId:I.su,interval:2,actions:[{commandId:'book.paradise.npc.su_supplied_meal',priority:7},{commandId:'book.paradise.npc.su_prepare',priority:6},{commandId:'book.paradise.npc.su_move',priority:5},{commandId:'book.paradise.npc.su_attempt',priority:4},{commandId:'book.paradise.npc.su_search',priority:3},{commandId:'book.paradise.npc.su_end_search',priority:2}]}
]);
export const paradiseSources=freeze([
 {id:I.method,revision:1,label:'Attributed load-bracing procedure',kind:'technique',origin:'trained',grants:[],bioDetail:'Original consenting paid booth procedure; actual hands, kit, rope and effort. Ordinary timber alternative remains available.'},
 {id:I.blade,revision:1,label:'Su Xiao’s current physical knife training',kind:'technique',origin:'trained',grants:[],bioDetail:'Source-era personal physical training and his own damaged sword. No future Sword Mage conversion or player grant.'},
 {id:I.soul,revision:1,label:'Su Xiao’s awakened Soul Eater',kind:'trait',origin:'acquired',grants:[],bioDetail:'Supplied-MTL sid3/sid11/sid16 awakened faculty and maximum91 by the selected era. Current mana balance and king-kill yield unknown; no spendable fuel or kill-yield consumer is implemented.'}
]);
export const paradisePowers=freeze([
 {id:I.method,revision:1,label:'Small-load bracing',model:'practice',capacity:1,worlds:[I.hub,I.goa],cooldown:0,execution:all(ready,eq('paradise.methodSupported')),description:'Owned learned procedure uses current hands, rope and reusable native kit for the distinct timber-saving cache job.'},
 {id:I.blade,revision:1,label:'Su Xiao’s source-era physical sword operation',model:'practice',capacity:1,worlds:[I.goa],cooldown:0,execution:all(ready,eq('paradise.suSwordSupported')),description:'Own body, actual retained damaged sword and acquired early physical training. No mana-powered move or later signature technique.'}
]);
export const paradiseActions=freeze([]);

// Recomputed from retained state and live native owners on every evaluation.
// These are private admission facts; presentation must show player knowledge only.
export function paradiseFacts(state,ctx={}) {
 const d=state.bookWorldCampaign,s=state.simulation||{},native=ctx.paradiseNative||{},p=s.people?.player,player=state.actors?.player,actorId=ctx.actorId||'player';
 const visits=Array.isArray(d?.visits)?d.visits:[],visit=visits.find(v=>v.id===d?.activeVisitId&&v.status==='active'),footprint=PARADISE_FOOTPRINTS.find(f=>f.instanceId===visit?.instanceId||f.worldId===visit?.endpoint?.worldId);
 const actualBody=native.body,body=p?.body;
 const samePlayerBody=body?.id==='native.player.body'&&body.form==='human'&&body.ownerId==='player'&&body.controllerId==='player'&&actualBody?.id===body.id&&actualBody?.form===body.form&&actualBody?.ownerId===body.ownerId&&actualBody?.controllerId===body.controllerId;
 const bound=native.bound===true&&!!d&&native.revision===d.nativeRevision&&Number.isSafeInteger(native.revision)&&native.revision>0;
 const vitals=id=>ctx.vitals?.[id]||ctx.vitalsByActor?.[id]||(ctx.actorId===id&&ctx.vitals?.health!=null?ctx.vitals:null);
 const usable=id=>{const person=s.people?.[id],b=person?.body,v=vitals(id);return person?.inventory==='native'&&person.life==='alive'&&b?.form==='human'&&b.ownerId===id&&b.controllerId===id&&(b.hands??0)>=2&&b.mobile===true&&Number.isFinite(v?.health)&&v.health>1;};
 const here=!!footprint&&player?.worldId===footprint.worldId&&footprint.native.locations.includes(p?.location);
 const playerSupported=bound&&samePlayerBody&&ctx.nativeAlive===true&&usable('player')&&here;
 const f={'paradise.nativeBound':bound,'paradise.playerSupported':playerSupported,'paradise.chartSupported':ctx.nativeAlive===true&&p?.life==='alive'&&p.location==='Village'&&player?.worldId==='base.frontier'};
 const names=[I.employee,I.porter,I.mia,I.hank,I.su,I.krieg,I.king];
 for(const w of [I.hub,I.goa])f[`paradise.local.${w}`]=playerSupported&&footprint.worldId===w&&state.actors?.[actorId]?.worldId===w;
 for(const id of names){const person=s.people?.[id],a=state.actors?.[id],npcBody=person?.body;
  f[`paradise.support.${id}`]=playerSupported&&usable(id)&&npcBody.id===`native.person.${id}.body`&&a?.worldId===footprint.worldId&&PARADISE_FOOTPRINTS.find(x=>x.worldId===a?.worldId)?.native.locations.includes(person.location)===true;
  f[`paradise.at.${id}`]=person?.location||'';
  f[`paradise.health.${id}`]=vitals(id)?.health??0;
 }
 const inventory=id=>ctx.gameplay?.[id]?.inventory||{};
 const held=(id,key)=>{const count=inventory(id)[key]||0;const unavailable=Object.values(s.custody||{}).filter(c=>(c.key===key||c.itemKey===key)&&c.owner===id&&c.holder!==id).reduce((n,c)=>n+c.count,0);return Math.max(0,count-unavailable);};
 const sourceSupported=(id,power)=>{const source=state.actors?.[id]?.sources?.[power],faculty=s.faculties?.[id]?.[power];return usable(id)&&!!source&&(source.expiresAt==null||source.expiresAt>state.clock)&&faculty?.awakened===true&&faculty.active===true&&!faculty.suppressed&&s.powers?.[id]?.[power]?.owned===true;};
 f['paradise.methodFacultySupported']=playerSupported&&sourceSupported('player',I.method);
 f['paradise.methodSupported']=f['paradise.methodFacultySupported']&&held('player',K.kit)>=1;
 f['paradise.suSwordFacultySupported']=f[`paradise.support.${I.su}`]&&sourceSupported(I.su,I.blade);
 f['paradise.suSwordSupported']=f['paradise.suSwordFacultySupported']&&held(I.su,K.sword)>=1;
 f['paradise.suRations']=held(I.su,K.ration);
 f['paradise.hankOwnsProof']=held(I.hank,K.proof)>=1;
 f['paradise.playerCivilRouteEvidence']=actorId==='player'&&playerCivilRouteEvidence(state);
 // This is Hank's private received evidence, never the player's field or a
 // blanket inference that every resident knows the world warning flag.
 f['paradise.hankReceivedCivilRoute']=actorId===I.hank&&hankCivilRouteReception(state);
 f['paradise.kriegCasks']=held(I.krieg,K.cask);
 const king=s.people?.[I.king],su=s.people?.[I.su];
 const branch=state.worlds?.[I.goa]?.facts||{};
 f['paradise.palaceOpportunityResolved']=branch['book.goa.kingWarned']===true||branch['book.goa.king']!=='alive'||branch['book.goa.fire']==='contained'||branch['book.goa.fire']==='burned'&&branch['book.goa.gate']!=='shut';
 // Source assassination followed pirate breach/palace pressure. A changed
 // fire/gate prerequisite cannot silently reproduce that same opening.
 f['paradise.kingReachable']=f[`paradise.support.${I.king}`]&&king?.location===L.palace&&su?.location===L.palace&&branch['book.goa.fire']==='burned'&&branch['book.goa.gate']==='breached';
 const goa=(d?.instances||[]).find(i=>i.id===PARADISE_FOOTPRINTS.find(x=>x.worldId===I.goa).instanceId);
 f['paradise.goaElapsed']=Number.isSafeInteger(goa?.clock?.elapsed)?goa.clock.elapsed:0;
 f['paradise.miaAccountReady']=state.actors?.[I.mia]?.facts?.['book.paradise.accountReady']===true;
 const goaFacts=state.worlds?.[I.goa]?.facts||{};
 f['paradise.outcomesResolved']=['burned','contained'].includes(goaFacts['book.goa.fire'])&&['sheltered','dead'].includes(goaFacts['book.goa.hank'])&&['alive','killed','escaped'].includes(goaFacts['book.goa.king'])&&(goaFacts['book.goa.suXiao']==='departed'||goaFacts['book.goa.suXiao']==='searching'&&state.actors?.[I.su]?.facts?.['book.paradise.searchAccountClosed']===true);
 for(const [owner,bag] of Object.entries(native.stock||{}))for(const [key,count] of Object.entries(bag))f[`paradise.stock.${owner}.${key}`]=count;
 // Never forward source agendas or NPC private knowledge to the player here.
 return f;
}
export const paradiseContext=(state,ctx={})=>({...ctx,facts:{...ctx.facts,...paradiseFacts(state,ctx)}});

const record=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const natural=v=>Number.isSafeInteger(v)&&v>=0;
const causeSequence=cause=>/^simulation:[1-9][0-9]*$/.test(cause||'')?Number(cause.split(':')[1]):NaN;
function currentReceipt(state,r,{stage,kind,attributedTo,text}={}){
 const b=r?.basis,sequence=causeSequence(r?.cause);
 return record(r)&&r.stage===stage&&typeof r.value==='string'&&r.value.length>0&&(text==null||r.value===text)&&natural(r.at)&&r.at<=state.clock&&
  natural(sequence)&&sequence>0&&sequence<=state.sequence&&record(b)&&Object.keys(b).length===3&&b.kind===kind&&b.attributedTo===attributedTo&&b.situationId==='book.paradise.side_branch';
}
function playerCivilRouteEvidence(state){
 const a=state.actors?.player,s=state.simulation,r=s?.knowledge?.player?.['book.paradise.civilWarning'],cache=s?.knowledge?.player?.['book.paradise.cache'];
 const warning=s?.claims?.['book.paradise.goa.warning_delivery'],cacheClaim=s?.claims?.['book.paradise.goa.civil_cache'];
 return state.bookWorldCampaign?.schema===1&&a?.completed?.['book.paradise.warn_civilians']===1&&a.facts?.['book.paradise.civilWarningDelivered']===true&&
  ((a.completed['book.paradise.cache_ordinary']||0)+(a.completed['book.paradise.cache_braced']||0))===1&&
  currentReceipt(state,r,{stage:'seen',kind:'observation',attributedTo:I.mia})&&currentReceipt(state,cache,{stage:'seen',kind:'observation',attributedTo:I.mia})&&
  warning?.status==='settled'&&warning.owner==='player'&&warning.cause===r.cause&&cacheClaim?.status==='settled'&&cacheClaim.owner==='player'&&cacheClaim.cause===cache.cause&&
  causeSequence(r.cause)>causeSequence(cache.cause)&&r.at>=cache.at;
}
// Exact received report and paired sender acknowledgement, retained separately
// from physical route availability. No knowledge is initialized or inferred.
export function hankCivilRouteReception(state){
 const R=PARADISE_HANK_ROUTE_REPORT,a=state.actors?.player,s=state.simulation,p=s?.knowledge?.player?.[R.playerReceipt],h=s?.knowledge?.[I.hank]?.[R.received],claim=s?.claims?.[R.claim];
 return playerCivilRouteEvidence(state)&&a.completed?.[R.id]===1&&a.facts?.[R.delivered]===true&&
  s.people?.[I.hank]?.definitionId===I.hank&&s.people[I.hank].inventory==='native'&&state.actors?.[I.hank]?.worldId===I.goa&&
  currentReceipt(state,p,{stage:'seen',kind:'observation',attributedTo:I.hank,text:R.playerText})&&
  currentReceipt(state,h,{stage:'understood',kind:'instruction',attributedTo:'player',text:R.receivedText})&&p.cause===h.cause&&p.at===h.at&&
  claim?.status==='settled'&&claim.owner==='player'&&claim.cause===h.cause&&natural(claim.at)&&claim.at+2===h.at&&
  causeSequence(h.cause)>causeSequence(s.knowledge.player['book.paradise.civilWarning'].cause)&&h.at>=s.knowledge.player['book.paradise.civilWarning'].at+2;
}

const sameData=(a,b)=>{
 if(a===b)return true;
 if(Array.isArray(a)||Array.isArray(b))return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>sameData(v,b[i]));
 if(!record(a)||!record(b))return false;const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>Object.hasOwn(b,k)&&sameData(a[k],b[k]));
};
// Optional top-level durable validator join. Absence and earlier frozen
// revision1 route commitments remain inert; new revision2 use needs reception.
export function validateParadiseHankRouteEvidence(state,registry){
 const check=(ok,text)=>{if(!ok)throw Error(text);},R=PARADISE_HANK_ROUTE_REPORT,s=state.simulation,a=state.actors?.player,ha=state.actors?.[I.hank];
 const received=s?.knowledge?.[I.hank]?.[R.received],ack=s?.knowledge?.player?.[R.playerReceipt],delivered=a?.facts?.[R.delivered],used=ha?.facts?.[R.used];
 const reportDone=a?.completed?.[R.id]||0,claim=s?.claims?.[R.claim],jobs=(s?.jobs||[]).filter(j=>j.commandId===R.id||j.commandId==='book.paradise.npc.hank_shelter_route'&&j.revision===2);
 if(!received&&!ack&&delivered==null&&used==null&&!reportDone&&!claim&&!jobs.length)return true;
 check(state.bookWorldCampaign?.schema===1&&[10,11].includes(state.schema),'Hank route reception requires the explicitly enrolled actual source campaign.');
 check([0,1].includes(reportDone)&&(delivered==null||delivered===true)&&(used==null||used===true),'Unsupported once-only Hank report or use receipt.');
 if(reportDone){check(hankCivilRouteReception(state),'Hank needs the actual completed guardhouse delivery, own received evidence and paired sender receipt.');}
 else check(!received&&!ack&&delivered==null,'An unfinished, cancelled or unsupported report cannot supply Hank route knowledge.');
 const reportDefinition=paradiseCommands.find(d=>d.id===R.id),routeDefinition=paradiseCommands.find(d=>d.id==='book.paradise.npc.hank_shelter_route');
 for(const j of jobs){const d=j.commandId===R.id?reportDefinition:routeDefinition;
  check(j.revision===d.revision&&j.actorId===d.actorId&&j.targetId===(d.targetId||null)&&j.context?.actorId===d.actorId&&j.context.targetId===(d.targetId||null)&&
   j.id===`simulation:${j.sequence}`&&natural(j.sequence)&&j.sequence>0&&j.sequence<=state.sequence&&natural(j.due)&&j.due>=state.clock&&j.due<=state.clock+2&&
   j.cancellation==='refund'&&j.reservationReturns===1&&j.claim===d.claim&&sameData(j.costs,d.costs)&&sameData(j.effects,d.effects)&&
   sameData(j.participants,j.commandId===R.id?['player',I.hank]:[I.hank])&&
   sameData(j.completionSupport,{schema:1,requires:d.completionRequires,coLocated:!!d.completionCoLocated,location:L.guard,failure:'refund'}),
   'New report/shelter work lost its exact actor, physical reservations, received-evidence guard or frozen revision.');
  const c=s.claims[j.claim];check(c?.status==='held'&&c.owner===d.actorId&&c.cause===j.id,'New Hank work lost its actual reserved unique claim.');
  if(j.commandId===R.id)check(!reportDone&&playerCivilRouteEvidence(state),'Only an uncompleted firsthand route report may be reserved.');
  else check(hankCivilRouteReception(state)&&j.sequence>causeSequence(received.cause)&&used==null,'New route shelter must follow actual reception, without an earlier settled use.');
 }
 const pendingReport=jobs.find(j=>j.commandId===R.id);
 if(!reportDone)check(claim==null||!!pendingReport,'An uncompleted Hank report cannot retain an orphaned claim.');
 if(used){const r=s.knowledge?.[I.hank]?.['book.paradise.private.shelter'];
  check(hankCivilRouteReception(state)&&ha.completed?.['book.paradise.npc.hank_shelter_route']===1&&state.worlds?.[I.goa]?.facts?.['book.goa.hank']==='sheltered'&&
   currentReceipt(state,r,{stage:'seen',kind:'observation',attributedTo:I.hank,text:R.shelterText})&&causeSequence(r.cause)>causeSequence(received.cause)&&r.at>=received.at+2,
   'Route-specific survival needs Hank\'s own actual later funded shelter completion, not just a delivered report.');
 }
 if(registry)for(const d of [reportDefinition,routeDefinition])check(sameData(registry.simulation?.commands?.get(d.id),d),'The current received-report consumers differ from their authored revisions.');
 return true;
}
