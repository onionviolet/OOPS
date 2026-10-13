import {I,K,command,eq,gte,all,any,not,af,item,money,coins,transfer,know,contact,purse,owned,stamina,relationship} from './shared.js';

const shipRight=eq('actor.mg.shippingRight');
const shipOffer=eq('actor.mg.shippingPhase','offered');
const shipUndelivered=not(eq('actor.mg.shippingDelivered'));
const shippingSupport=(payment)=>all(contact(I.bram),shipRight,shipOffer,shipUndelivered,purse(I.bram,payment));

const route=(cargo,cargoName,routeName,routeDescription,duration,payment,fee=0)=>command({
 id:`mg.ship.${cargo}.${routeName}`,family:'MG05',label:`Ship ${cargoName} · ${routeName==='local'?'local run':'escorted shipment'} · ${duration} min${fee?` + ${fee} coin Orin escort fee`:''}`,
 targetId:I.bram,coLocated:true,participants:['$target',...(fee?[I.orin]:[])],
 description:`Transfer one actual ${cargoName} into Bram’s one-order manifest when accepted. The ${routeDescription} pays ${payment} coins from Bram’s finite purse only after arrival. Cancelling or losing support returns the held cargo${fee?` and ${fee} route coins`:''}; the order pays once.`,
 visibleWhen:all(shipRight,shipOffer,shipUndelivered),
 support:all(shippingSupport(payment),...(fee?[contact(I.orin)]:[])),
 requires:all(shipRight,shipOffer,shipUndelivered,owned(cargoName)),
 duration,siteId:I.dispatch,completionCoLocated:true,
 costs:[transfer(K[cargo],1,'player',I.bram),...(fee?[money(-fee),{type:'vital',actor:I.orin,key:'stamina',amount:-2}]:[])],
 effects:[...(fee?[coins(fee,I.orin)]:[]),coins(-payment,I.bram),money(payment),af('shippingDelivered'),af('shippingPhase','delivered'),know('shippingReceipt',`Bram received one actual ${cargoName} by ${routeName==='local'?'local route':'escorted route'} and paid ${payment} coins from his purse. This one-order shipment is settled.`,I.bram),relationship(I.bram,1)]
});

const cropStage='actor.mg.cropStage';
const cropType='actor.mg.cropType';
const plotRight=eq('actor.mg.plotRight');
const plotEmpty=not(any(eq(cropStage,'planted'),eq(cropStage,'tended'),eq(cropStage,'ready')));
const canPlant=all(plotRight,plotEmpty);

export const commands=[
 command({id:'mg.ship.hear_order',family:'MG05',label:'Hear Bram’s one-shipment offer · free',targetId:I.bram,coLocated:true,participants:['$target'],
  description:'Bram authorizes one delivery from this courtyard and publishes a finite quote. This grants permission for the order, not goods or payment.',
  visibleWhen:not(shipRight),support:contact(I.bram),requires:contact(I.bram),
  effects:[af('shippingRight'),af('shippingPhase','offered'),know('shippingOffer','Bram authorized one shipment from the Village courtyard. Local quotes: one wood crate for 8 coins or one fine crate for 14. Escorted quotes: one wood crate for 12 coins or one fine crate for 18, with a 2-coin Orin escort fee. Bram pays only after actual delivery.',I.bram)]}),

 // One quoted order has four real cargo/route choices. The manifest transfer
 // is itself the reservation; completion pays once and never consumes it again.
 route('crate','Courtyard wood crate','local','shorter and fee-free local run',3,8),
 route('crate','Courtyard wood crate','escorted','longer dispatch with Orin’s actual escort labor',6,12,2),
 route('fine','Fine courtyard crate','local','shorter and fee-free local run',3,14),
 route('fine','Fine courtyard crate','escorted','longer dispatch with Orin’s actual escort labor',6,18,2),

 command({id:'mg.farm.rent_plot',family:'MG06',label:'Rent Mira’s local plot · 4 coins',targetId:I.mira,coLocated:true,participants:['$target'],
  description:'Pay Mira four actual coins for access to the courtyard plot. The right lets you plant one crop at a time; it creates no seeds or food.',
  visibleWhen:not(plotRight),support:contact(I.mira),requires:contact(I.mira),costs:[money(-4)],
  effects:[coins(4,I.mira),af('plotRight'),know('plotRight','Paid Mira four coins for use of the single Village courtyard plot. Seed, effort and each harvest remain separate.',I.mira)]}),

 command({id:'mg.farm.plant_greens',family:'MG06',label:'Plant quick greens · 1 seed + 1 stamina + 2 min',
  description:'Reserve one actual seed packet and plant quick greens in the rented plot. The seed and stamina return if planting is cancelled or plot access fails.',
  visibleWhen:canPlant,support:all(plotRight,plotEmpty),requires:all(canPlant,gte(`item.${K.seed}`,1)),duration:2,siteId:I.plot,
  costs:[item(K.seed,-1),stamina(-1)],effects:[af('cropStage','planted'),af('cropType','greens'),know('cropPlan','Planted one packet of quick greens. Tend the planted crop, then spend played time growing it to harvest readiness.')]}),

 command({id:'mg.farm.plant_grain',family:'MG06',label:'Plant grain · 1 seed + 2 stamina + 3 min',
  description:'Reserve one actual seed packet and plant grain in the rented plot. Grain takes longer to grow and yields more food; inputs return if planting is cancelled or plot access fails.',
  visibleWhen:canPlant,support:all(plotRight,plotEmpty),requires:all(canPlant,gte(`item.${K.seed}`,1)),duration:3,siteId:I.plot,
  costs:[item(K.seed,-1),stamina(-2)],effects:[af('cropStage','planted'),af('cropType','grain'),know('cropPlan','Planted one packet of grain. Tend the planted crop, then spend played time growing it to harvest readiness.')]}),

 command({id:'mg.farm.tend_crop',family:'MG06',label:'Tend the planted crop · 1 stamina + 1 min',
  description:'Spend a real minute and stamina tending the crop. This is the required care step before growth; the plot remains occupied until harvest.',
  visibleWhen:all(plotRight,eq(cropStage,'planted')),support:all(plotRight,eq(cropStage,'planted')),
  requires:all(plotRight,eq(cropStage,'planted')),duration:1,siteId:I.plot,costs:[stamina(-1)],
  effects:[af('cropStage','tended'),know('cropCare','Tended the planted crop with one stamina. Growth can now be started; only a ready crop can be harvested.')]}),

 command({id:'mg.farm.grow_greens',family:'MG06',label:'Grow tended greens · 3 played min',
  description:'Advance the tended greens to harvest readiness using three played minutes. Browser-closed time does not advance the crop.',
  visibleWhen:all(plotRight,eq(cropStage,'tended'),eq(cropType,'greens')),
  support:all(plotRight,eq(cropStage,'tended'),eq(cropType,'greens')),
  requires:all(plotRight,eq(cropStage,'tended'),eq(cropType,'greens')),duration:3,siteId:I.plot,
  effects:[af('cropStage','ready'),know('cropReady','The tended greens are ready. Harvest the actual greens before planting another crop.')] }),

 command({id:'mg.farm.grow_grain',family:'MG06',label:'Grow tended grain · 6 played min',
  description:'Advance the tended grain to harvest readiness using six played minutes. Browser-closed time does not advance the crop.',
  visibleWhen:all(plotRight,eq(cropStage,'tended'),eq(cropType,'grain')),
  support:all(plotRight,eq(cropStage,'tended'),eq(cropType,'grain')),
  requires:all(plotRight,eq(cropStage,'tended'),eq(cropType,'grain')),duration:6,siteId:I.plot,
  effects:[af('cropStage','ready'),know('cropReady','The tended grain is ready. Harvest the actual grain before planting another crop.')] }),

 command({id:'mg.farm.harvest_greens',family:'MG06',label:'Harvest ready greens · 3 actual portions',
  description:'Collect three actual portions of greens from the ready, tended crop. The plot becomes available only after this one harvest.',
  visibleWhen:all(plotRight,eq(cropStage,'ready'),eq(cropType,'greens')),
  requires:all(plotRight,eq(cropStage,'ready'),eq(cropType,'greens')),
  effects:[item(K.greens,3),af('cropStage','harvested'),know('cropHarvest','Harvested three actual portions of greens from the ready crop. This crop cannot be harvested again.')]}),

 command({id:'mg.farm.harvest_grain',family:'MG06',label:'Harvest ready grain · 5 actual portions',
  description:'Collect five actual portions of grain from the ready, tended crop. The plot becomes available only after this one harvest.',
  visibleWhen:all(plotRight,eq(cropStage,'ready'),eq(cropType,'grain')),
  requires:all(plotRight,eq(cropStage,'ready'),eq(cropType,'grain')),
  effects:[item(K.grain,5),af('cropStage','harvested'),know('cropHarvest','Harvested five actual portions of grain from the ready crop. This crop cannot be harvested again.')]})
];
