import {I,K,command,eq,gte,all,not,af,item,money,coins,transfer,know,contact,purse,owned,stamina,relationship} from './shared.js';

const P = 'actor.mg.';
const inspectedShop = eq('knowledge.mg.shop.quotes.seen');
const roomReady = all(eq(`${P}roomOwned`),eq(`${P}roomRepaired`),eq(`${P}roomUse`,'inn'));
const auctionLot = 'mg04.auction.mira.heirloom';

export const commands = [
    command({id:'mg.shop.inspect',family:'MG03',label:'Check the courtyard customer board',description:'Hear three finite, quoted customer offers. Each named customer buys at most one matching item; full price pays more, while friendly service pays less and improves that person’s trust. Declining costs nothing.',targetId:I.mira,coLocated:true,participants:['$target'],
        support:contact(I.mira),effects:[know('shop.quotes','Mira will buy one actual Courtyard wood crate for six coins at full price or five coins as friendly service. Sela will buy one actual Courtyard greens portion for four coins full or three coins friendly. Bram will buy one actual Fine courtyard crate for ten coins full or eight coins friendly. Each offer is finite, uses the buyer’s actual purse, and closes after one sale.',I.mira)]}),

    ...[
        {name:'mira_crate',target:I.mira,item:K.crate,ownedName:'Courtyard wood crate',full:6,friendly:5,good:'crate',label:'Mira · one wood crate'},
        {name:'sela_greens',target:I.sela,item:K.greens,ownedName:'Courtyard greens',full:4,friendly:3,good:'greens',label:'Sela · one greens portion'},
        {name:'bram_fine_crate',target:I.bram,item:K.fine,ownedName:'Fine courtyard crate',full:10,friendly:8,good:'fine crate',label:'Bram · one fine crate'},
    ].flatMap(d => [
        {price:d.full,service:'full',trust:0,label:`Sell ${d.label} at full price · ${d.full} coins`},
        {price:d.friendly,service:'friendly',trust:1,label:`Offer ${d.label} at a friendly price · ${d.friendly} coins`},
    ].map(option => command({id:`mg.shop.sell_${d.name}_${option.service}`,family:'MG03',label:option.label,
        description:`Transfer your actual ${d.good} to ${d.target===I.mira?'Mira':d.target===I.sela?'Sela':'Bram'} for the quoted ${option.price} coins from that customer’s purse. This customer’s one demand closes after the sale.${option.trust?' Friendly service also improves their trust.':''}`,
        targetId:d.target,coLocated:true,participants:['$target'],claim:`mg03.shop.${d.name}`,
        visibleWhen:all(inspectedShop,not(eq(`${P}shop_${d.name}_closed`))),support:all(contact(d.target),purse(d.target,option.price)),
        requires:owned(d.ownedName),costs:[transfer(d.item,1,'player',d.target)],effects:[coins(-option.price,d.target),money(option.price),af(`shop_${d.name}_closed`),know(`shop.${d.name}`,`Sold one actual ${d.good} to ${d.target===I.mira?'Mira':d.target===I.sela?'Sela':'Bram'} for ${option.price} coins${option.trust?' at the friendly price':''}. This finite customer offer is complete.`,d.target),...(option.trust?[relationship(d.target,1)]:[])]}))),

    command({id:'mg.inn.sela_greens',family:'MG03',label:'Serve Sela a greens meal · 1 portion + 2 stamina + 4 min',description:'Sela accepts one greens meal for three coins from her actual purse. Her stay reserves your repaired inn room and consumes one real greens portion only when served; interruption returns the reserved meal.',targetId:I.sela,coLocated:true,participants:['$target'],claim:'mg03.inn.sela',
        visibleWhen:all(roomReady,not(eq(`${P}inn_sela_served`))),support:all(roomReady,contact(I.sela),purse(I.sela,3)),requires:all(roomReady,owned('Courtyard greens')),duration:4,siteId:I.room,
        costs:[item(K.greens,-1),stamina(-2)],effects:[coins(-3,I.sela),money(3),af('inn_sela_served'),know('inn.sela','Sela completed one greens meal in the repaired inn. One real greens portion was served and three of her coins were paid to you.',I.sela),relationship(I.sela,1)]}),

    command({id:'mg.inn.bram_grain',family:'MG03',label:'Serve Bram a grain meal · 1 portion + 2 stamina + 5 min',description:'Bram accepts one grain meal for five coins from his actual purse. His stay reserves your repaired inn room and consumes one real grain portion only when served; interruption returns the reserved meal.',targetId:I.bram,coLocated:true,participants:['$target'],claim:'mg03.inn.bram',
        visibleWhen:all(roomReady,not(eq(`${P}inn_bram_served`))),support:all(roomReady,contact(I.bram),purse(I.bram,5)),requires:all(roomReady,owned('Courtyard grain')),duration:5,siteId:I.room,
        costs:[item(K.grain,-1),stamina(-2)],effects:[coins(-5,I.bram),money(5),af('inn_bram_served'),know('inn.bram','Bram completed one grain meal in the repaired inn. One real grain portion was served and five of his coins were paid to you.',I.bram),relationship(I.bram,1)]}),

    command({id:'mg.auction.inspect',family:'MG04',label:'Inspect Mira’s damaged heirloom',description:'Inspect the single actual lot before bidding. The inspection reveals its ordinary condition and the treatment it needs, not a hidden value or future outcome.',targetId:I.mira,coLocated:true,participants:['$target'],claim:'mg04.auction.inspection',
        support:contact(I.mira),requires:gte(`management.stock.${I.mira}.damaged`,1),effects:[know('auction.heirloom.condition','Mira’s one damaged courtyard heirloom is chipped and loose at the join. It is still a real damaged item and can be conserved with cloth or restored with wood. Inspection does not reveal a future value.',I.mira)]}),

    command({id:'mg.auction.bid_low',family:'MG04',label:'Set a five-coin ceiling · lose to the seven-coin competing bid',description:'Choose a five-coin maximum. The disclosed competing bid is seven coins, so this lot goes to the other bidder and you spend nothing.',targetId:I.mira,coLocated:true,participants:['$target'],claim:auctionLot,
        visibleWhen:all(eq('knowledge.mg.auction.heirloom.condition.seen'),not(eq(`${P}auctionResult`))),support:contact(I.mira),requires:eq('knowledge.mg.auction.heirloom.condition.seen'),
        effects:[af('auctionResult','lost'),know('auction.result','Set a five-coin ceiling. The competing seven-coin bid won the lot; no money or item changed hands.',I.mira)]}),

    command({id:'mg.auction.bid_high',family:'MG04',label:'Set a ten-coin ceiling · win at the eight-coin clearing price',description:'Choose a ten-coin maximum. The disclosed competing bid is seven coins, so you win at the eight-coin clearing price, not your ceiling. Transfer eight actual coins to Mira and receive her one actual damaged lot.',targetId:I.mira,coLocated:true,participants:['$target'],claim:auctionLot,
        visibleWhen:all(eq('knowledge.mg.auction.heirloom.condition.seen'),not(eq(`${P}auctionResult`))),support:contact(I.mira),requires:eq('knowledge.mg.auction.heirloom.condition.seen'),
        costs:[money(-8),transfer(K.damaged,1,I.mira,'player')],effects:[coins(8,I.mira),af('auctionResult','won'),know('auction.result','Set a ten-coin ceiling and won Mira’s actual damaged courtyard heirloom at the published eight-coin clearing price. The ceiling was not charged.',I.mira)]}),

    command({id:'mg.auction.pass',family:'MG04',label:'Pass on Mira’s heirloom',description:'Close this one inspected lot without bidding or spending.',targetId:I.mira,coLocated:true,participants:['$target'],claim:auctionLot,
        visibleWhen:all(eq('knowledge.mg.auction.heirloom.condition.seen'),not(eq(`${P}auctionResult`))),support:contact(I.mira),requires:eq('knowledge.mg.auction.heirloom.condition.seen'),
        effects:[af('auctionResult','passed'),know('auction.result','Passed on Mira’s one damaged heirloom lot. No money or item changed hands.',I.mira)]}),
];
