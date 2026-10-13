import {I,K,command,eq,all,not,af,item,money,coins,transfer,know,contact,owned} from './shared.js';
export const commands=[
 command({id:'mg.foreman.commission',family:'MG07',label:'Commission Orin as foreman · 2 logs + 2 coins',targetId:I.orin,coLocated:true,participants:['$target'],
  description:'Give Orin exactly two owned logs and a two-coin labor fee for one crate. His own stamina and the shared bench supply the labor. The fee is paid when you commission him; cancelling the order returns the two actual logs, not the already-paid fee. No further purchases or orders are authorized.',
  visibleWhen:not(eq('management.foremanOutstanding')),support:contact(I.orin),requires:owned('log'),
  costs:[money(-2),transfer(K.log,2,'player',I.orin)],effects:[coins(2,I.orin),af('foremanReady',true,I.orin),know('foreman.terms','Commissioned Orin with exactly two logs and two coins. One order only; labor uses his own two stamina and four played minutes at the actual courtyard bench. Cancellation returns the two logs, not his already-paid fee.',I.orin)]}),
 {id:'mg.foreman.execute',family:'MG07',label:'Let Orin execute the one commissioned crate · 4 played min',description:'Orin works independently using only his supplied two logs and two own stamina. The result is transferred once to your actual carried stock. His order reserves the shared bench. Departure or loss of contact stops delivery and refunds Orin’s held inputs; collect them locally before another order.',
  revision:1,worldId:I.world,group:I.group,actorId:I.orin,location:'Village',duration:4,cancellation:'refund',reservationReturns:1,siteId:I.bench,
  visibleWhen:eq('actor.mg.foremanReady'),requires:all(eq('actor.mg.foremanReady'),eq('management.foremanReturnAvailable')),
  completionRequires:all(eq('actor.mg.foremanReady'),eq('management.foremanReturnAvailable')),completionFailure:'refund',
  costs:[item(K.log,-2,I.orin),{type:'vital',actor:I.orin,key:'stamina',amount:-2}],
  effects:[item(K.crate,1,I.orin),transfer(K.crate,1,I.orin,'player'),af('foremanReady',false,I.orin),know('foreman.delivered','Orin finished the one commissioned crate using two actual supplied logs and his own stamina. The crate returned to your carried inventory once; no extra spending or new order was authorized.',I.orin)]},
 command({id:'mg.foreman.retrieve_inputs',family:'MG07',label:'Cancel Orin’s unstarted or stopped order · return 2 logs',targetId:I.orin,coLocated:true,participants:['$target'],
  description:'With no Orin job running, collect the two actual supplied logs and close his mandate. His two-coin fee was already paid and remains with him.',
  visibleWhen:eq('management.foremanOutstanding'),support:contact(I.orin),requires:all(eq('management.foremanOutstanding'),eq('management.foremanIdle')),
  costs:[transfer(K.log,2,I.orin,'player')],effects:[af('foremanReady',false,I.orin),know('foreman.cancelled','Collected the two actual unused foreman logs and closed Orin’s one-order mandate. His already-paid two-coin fee was retained.',I.orin)]}),
 command({id:'mg.room.personal_rest',family:'MG02',label:'Rest in your repaired private room · 3 played min',description:'Use the repaired room privately for a quiet rest that restores two actual stamina. It reserves the room, needs your living native body and cannot overlap paid lodging or workshop work.',
  visibleWhen:eq('actor.mg.roomUse','personal'),support:all(eq('actor.mg.roomOwned'),eq('actor.mg.roomRepaired'),eq('actor.mg.roomUse','personal')),duration:3,siteId:I.room,
  costs:[],effects:[{type:'vital',actor:'player',key:'stamina',amount:2},know('room.privateRest','Spent three played minutes resting in your repaired private room, restoring two stamina. No rent or guest commitment was created.')]})
];
