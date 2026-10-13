import {I,K,command,eq,gte,all,not,af,item,money,coins,transfer,know,contact} from './shared.js';
export const itemSpecifications=[
 ['Courtyard seed packet',1,'Local seeds for the rented courtyard plot.'],
 ['Courtyard greens',2,'Fresh local greens. Courtyard meals and gatherings consume actual portions.'],
 ['Courtyard grain',3,'A retained grain harvest useful for local meals and trade.'],
 ['Courtyard wood crate',4,'A useful storage crate, made from actual wood at the shared bench.'],
 ['Fine courtyard crate',7,'A carefully joined crate for a demanding customer.'],
 ['Damaged courtyard heirloom',4,'A damaged ordinary heirloom. Inspect it before choosing treatment.'],
 ['Conserved courtyard heirloom',8,'Conserved for a local collection and exhibition.'],
 ['Restored courtyard heirloom',12,'Restored for practical use or a quoted local sale.'],
].map(([id,value,description])=>({id,value,description}));
export function registerManagementItems({itemTemplates,OtherItem}) {
 for(const s of itemSpecifications){if(itemTemplates[s.id])throw new Error(`Duplicate management item ${s.id}`);itemTemplates[s.id]=new OtherItem({id:s.id,name:s.id,value:s.value,description:s.description,tags:{expedition:true}});}
}
export const people=[[I.mira,'Mira, courtyard concessioner',100],[I.orin,'Orin, wood-goods maker',30],[I.sela,'Sela, local worker and prospective tenant',40],[I.bram,'Bram, outlying goods buyer',200]].map(([id,label,coins])=>({id,revision:1,label,worldId:I.world,location:'Village',inventory:'simulation',provision:false,resources:{coins},body:{hands:2},vitals:{health:20,max_health:20,stamina:20,max_stamina:20}}));
export const sites=[[I.bench,'Courtyard shared workbench'],[I.room,'Courtyard concession room'],[I.plot,'Courtyard planting plot'],[I.venue,'Courtyard gathering space'],[I.dispatch,'Courtyard dispatch and forwarding desk']].map(([id,label])=>({id,revision:1,label,capacity:1,provision:false}));
export const situations=[{id:I.situation,revision:1,label:'Village market courtyard',context:{worldId:I.world,instanceId:'frontier.main',continuityId:'frontier.branch',eraId:'frontier.present',regionId:'frontier.village'},participants:['player',I.mira,I.orin,I.sela,I.bram],initialPhase:'charter',phases:['charter'],privateTruth:{institution:'courtyard_concession'}}];
export const foundationCommands=[
 command({id:I.begin,family:'charter',label:'Visit the market courtyard · optional, free',once:true,
 description:'Meet four local residents and inspect finite offers. This gives access, not coins, goods, a deed or a debt. Work uses played time only; leaving pauses accepted work and browser closure creates no liabilities.',
 effects:[...people.map(d=>({type:'spawn',personId:d.id,definitionId:d.id})),{type:'situation',situationId:I.situation,operation:'begin'},...sites.map(d=>({type:'site',siteId:d.id,actor:'player',operation:'open'})),
 item(K.seed,16,I.mira),item(K.damaged,1,I.mira),item(K.log,20,I.mira),item(K.cloth,10,I.mira),item(K.log,6,I.orin),
 ...people.map(d=>af('consent',true,d.id)),af('opened'),af('version',1),
 know('charter','Mira offers a room concession, seeds, cloth and logs. Orin seeks a wood-goods partner. Sela wants useful work and lodging. Bram has a finite order budget. Their offers apply only in this Village courtyard.',I.mira)]}),
 ...[['log',2],['cloth',3],['seed',2]].map(([name,price])=>command({id:`mg.supply.${name}`,family:'supplies',label:`Buy ${name==='log'?'one Rough wood log':name==='cloth'?'one Linen cloth':'one courtyard seed packet'} · ${price} coins`,targetId:I.mira,coLocated:true,participants:['$target'],
 description:'Actual finite Mira stock changes owner. The purchase price enters her purse. No automatic restock.',requires:all(contact(I.mira),gte(`management.stock.${I.mira}.${name}`,1)),costs:[money(-price)],effects:[coins(price,I.mira),transfer(K[name],1,I.mira,'player')]})),
];
