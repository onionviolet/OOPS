import {I,K,eq,gte,all,any,not,af,item,money,coins,stamina,transfer,know,relationship,owned,contact,purse,command} from './shared.js';

const P = 'actor.mg.';
const branch = 'mg01.agreement';
const sold = eq(`${P}capitalSold`);
const room = eq(`${P}roomOwned`);
const repaired = eq(`${P}roomRepaired`);
const roomReady = all(room,repaired);
const commands = [
    command({id:'mg.orin.inspect',family:'MG01',label:'Inspect Orin’s small enterprise',description:'Hear the finite stock, one-batch terms and Bram’s quoted purchase. This inspection makes no promise and moves no goods or coins.',targetId:I.orin,coLocated:true,participants:['$target'],
        support:contact(I.orin),effects:[know('orin.enterprise','Orin has six actual logs, a finite purse and one small batch he can make room for. Bram has one quoted purchase worth six coins if the crate is delivered. A share costs three coins and pays four from Orin only after that sale. A goods advance transfers two logs now; after the sale, repay three coins to Orin. The buyer must have the six coins at sale time.',I.orin)]}),

    command({id:'mg.orin.share',family:'MG01',label:'Fund one production share · 3 coins',description:'Choose the share agreement. Orin transfers two real logs for one batch; after Bram buys the resulting crate, Orin pays the four-coin share return from his actual purse.',targetId:I.orin,coLocated:true,participants:['$target'],claim:branch,
        support:contact(I.orin),requires:all(eq('knowledge.mg.orin.enterprise.seen'),gte(`management.stock.${I.orin}.log`,2)),costs:[money(-3),transfer(K.log,2,I.orin,'player')],effects:[coins(3,I.orin),af('capitalAgreement','share'),know('capitalAgreement','Share chosen: three coins invested; two Orin logs supplied; four coins return only after the actual Bram sale.',I.orin)]}),

    command({id:'mg.orin.advance',family:'MG01',label:'Take Orin’s two-log goods advance',description:'Choose goods now instead of a share. Make and sell the batch, then repay three coins from the sale proceeds.',targetId:I.orin,coLocated:true,participants:['$target'],claim:branch,
        support:contact(I.orin),requires:all(eq('knowledge.mg.orin.enterprise.seen'),gte(`management.stock.${I.orin}.log`,2)),costs:[transfer(K.log,2,I.orin,'player')],effects:[af('capitalAgreement','advance'),know('capitalAgreement','Goods advance chosen: two actual logs now; repay three coins to Orin after the actual Bram sale.',I.orin)]}),

    command({id:'mg.orin.pass',family:'MG01',label:'Pass on Orin’s offer',description:'Close this offer without funding, borrowing or receiving stock.',targetId:I.orin,coLocated:true,participants:['$target'],claim:branch,
        support:contact(I.orin),requires:eq('knowledge.mg.orin.enterprise.seen'),effects:[af('capitalAgreement','passed'),know('capitalAgreement','Passed on Orin’s one-batch terms; no cash, stock, debt or share changed.',I.orin)]}),

    command({id:'mg.orin.make_batch',family:'MG01',label:'Make Orin’s one-batch crate · 2 logs + 2 stamina + 4 min',description:'Work the two supplied logs into one real crate. The reservation is refunded if this job is cancelled or its support fails.',
        visibleWhen:all(any(eq(`${P}capitalAgreement`,'share'),eq(`${P}capitalAgreement`,'advance')),not(sold),not(eq(`${P}capitalBatchMade`))),support:contact(I.orin),requires:all(eq('knowledge.mg.orin.enterprise.seen'),gte(`item.${K.log}`,2)),duration:4,siteId:I.bench,
        costs:[item(K.log,-2),stamina(-2)],effects:[item(K.crate,1),af('capitalBatchMade'),know('capitalBatch','Made one actual courtyard wood crate from the two reserved Orin logs. It remains unsold until delivered to Bram.')]}),

    command({id:'mg.orin.sell_batch',family:'MG01',label:'Sell the share batch to Bram · 6 coins to Orin',description:'Transfer the actual crate to Bram. His six coins go to Orin’s enterprise account; the one share return unlocks only after this completed sale.',targetId:I.bram,coLocated:true,participants:['$target'],
        visibleWhen:all(eq(`${P}capitalBatchMade`),eq(`${P}capitalAgreement`,'share'),not(sold)),support:all(contact(I.bram),purse(I.bram,6)),requires:owned('Courtyard wood crate'),costs:[transfer(K.crate,1,'player',I.bram)],effects:[coins(-6,I.bram),coins(6,I.orin),af('capitalSold'),know('capitalSale','Bram bought and received the actual share-batch crate for six coins paid to Orin.',I.bram),relationship(I.bram,1)]}),

    command({id:'mg.orin.sell_advance_batch',family:'MG01',label:'Sell the advance batch to Bram · receive 6 coins',description:'Transfer the actual crate to Bram and receive his quoted six coins. The one three-coin repayment unlocks only after this completed sale.',targetId:I.bram,coLocated:true,participants:['$target'],
        visibleWhen:all(eq(`${P}capitalBatchMade`),eq(`${P}capitalAgreement`,'advance'),not(sold)),support:all(contact(I.bram),purse(I.bram,6)),requires:owned('Courtyard wood crate'),costs:[transfer(K.crate,1,'player',I.bram)],effects:[coins(-6,I.bram),money(6),af('capitalSold'),know('capitalSale','Bram bought and received the actual advance-batch crate for six coins paid to the player.',I.bram),relationship(I.bram,1)]}),

    command({id:'mg.orin.settle_share',family:'MG01',label:'Collect the one share return · 4 coins',description:'Orin pays the quoted share return from his actual purse after the recorded Bram sale. The agreement can settle only once.',targetId:I.orin,coLocated:true,participants:['$target'],claim:'mg01.share.settlement',
        visibleWhen:all(eq(`${P}capitalAgreement`,'share'),sold),support:all(contact(I.orin),purse(I.orin,4)),effects:[coins(-4,I.orin),money(4),af('capitalAgreementSettled'),know('capitalSettlement','Orin paid the one four-coin share return after the actual sale; this share is settled.',I.orin),relationship(I.orin,1)]}),

    command({id:'mg.orin.repay_advance',family:'MG01',label:'Repay the one goods advance · 3 coins',description:'Repay Orin from the completed sale proceeds. This closes the finite goods advance once.',targetId:I.orin,coLocated:true,participants:['$target'],claim:'mg01.advance.settlement',
        visibleWhen:all(eq(`${P}capitalAgreement`,'advance'),sold),support:contact(I.orin),costs:[money(-3)],effects:[coins(3,I.orin),af('capitalAgreementSettled'),know('capitalSettlement','Repaid Orin three coins after the actual sale; the goods advance is settled.',I.orin),relationship(I.orin,1)]}),

    command({id:'mg.mira.buy_room',family:'MG02',label:'Buy Mira’s one room concession · 5 coins',description:'Acquire the room right from Mira. The concession is distinct from permission to repair, personal use, rental, inn service or workshop use.',targetId:I.mira,coLocated:true,participants:['$target'],claim:'mg02.room.deed',
        support:contact(I.mira),costs:[money(-5)],effects:[coins(5,I.mira),af('roomOwned'),af('roomRepaired',false),af('roomUse','unselected'),know('roomRight','Bought Mira’s one room concession. It grants the right to use the room; repair and each use remain separate choices.',I.mira)]}),

    command({id:'mg.mira.repair_room',family:'MG02',label:'Repair the room · 1 actual log + 2 stamina + 4 min',description:'Spend one owned log to repair the concession. The real material and stamina are returned if the job is cancelled or loses support.',
        visibleWhen:all(room,not(repaired)),support:all(contact(I.mira),room),requires:owned('Rough wood log'),duration:4,siteId:I.room,costs:[item(K.log,-1),stamina(-2)],effects:[af('roomRepaired'),af('roomUse','unselected'),know('roomCondition','Repaired the actual room concession with one log. The room can now be assigned one use at a time.')]}),

    ...[
        ['personal','Use the room personally','Keep the repaired room for personal use. No guest or work commitment is active.'],
        ['rental','Prepare the room for rental','Choose a tenant stay; Sela may accept one finite paid lodging period.'],
        ['inn','Prepare the room as an inn','Reserve the repaired room for a finite guest-service loop that can use its actual access and capacity.'],
        ['workshop','Use the room as a workshop','Reserve its use for one real crate-making job; no guest can occupy the room during that job.'],
    ].map(([mode,label,description])=>command({id:`mg.room.use_${mode}`,family:'MG02',label,description,
        visibleWhen:all(roomReady,not(eq(`${P}roomUse`,mode))),requires:all(repaired,room),effects:[af('roomUse',mode),know('roomUse',`Assigned the repaired room to ${mode} use. Changing use requires the room to be free of an active commitment.`)]})),

    command({id:'mg.room.sela_stay',family:'MG02',label:'Host Sela for one rental period · receive 2 coins',description:'Sela can choose one finite lodging period at the quoted two coins. Room access is reserved for the actual service; payment occurs only when the period completes.',targetId:I.sela,coLocated:true,participants:['$target'],
        visibleWhen:all(roomReady,eq(`${P}roomUse`,'rental')),support:all(roomReady,eq(`${P}roomUse`,'rental'),contact(I.sela),purse(I.sela,2)),requires:all(roomReady,eq(`${P}roomUse`,'rental')),duration:5,siteId:I.room,effects:[coins(-2,I.sela),money(2),af('roomSelaHosted'),know('roomRental','Sela completed one paid lodging period in the repaired room. Her two coins transferred at completion.',I.sela),relationship(I.sela,1)]}),

    command({id:'mg.room.sela_request',family:'MG02',label:'Hear Sela’s one room request',description:'After staying in the room, Sela asks for a small repair to keep it comfortable. Hear the request before choosing to help or end future rental.',targetId:I.sela,coLocated:true,participants:['$target'],claim:'mg02.sela.request',
        visibleWhen:all(roomReady,eq(`${P}roomUse`,'rental'),eq(`${P}roomSelaHosted`)),support:contact(I.sela),requires:all(roomReady,eq(`${P}roomUse`,'rental'),eq(`${P}roomSelaHosted`)),effects:[af('roomTenantRequest'),know('roomTenantRequest','After her completed stay, Sela asked for one small room repair. You may spend a real log and time to help, or end future rental.',I.sela)]}),

    command({id:'mg.room.answer_sela_repair',family:'MG02',label:'Answer Sela’s request · 1 log + 2 stamina + 3 min',description:'Use an actual log to make the requested repair. The room is reserved during the work; inputs return if the job is cancelled or support fails.',targetId:I.sela,coLocated:true,participants:['$target'],claim:'mg02.sela.request.response',
        visibleWhen:all(roomReady,eq(`${P}roomUse`,'rental'),eq(`${P}roomTenantRequest`)),support:all(roomReady,eq(`${P}roomUse`,'rental'),eq(`${P}roomTenantRequest`),contact(I.sela)),requires:owned('Rough wood log'),duration:3,siteId:I.room,costs:[item(K.log,-1),stamina(-2)],effects:[af('roomTenantRequest',false),af('roomSelaHosted',false),know('roomTenantResponse','Used one real log and three minutes to complete Sela’s requested repair. Her completed stay remains a separate finite record.',I.sela),relationship(I.sela,1)]}),

    command({id:'mg.room.end_sela_rental',family:'MG02',label:'End future rental to Sela',description:'Decline the requested repair and stop offering future stays. No debt or arrears are created; completed rent remains settled.',targetId:I.sela,coLocated:true,participants:['$target'],claim:'mg02.sela.request.response',
        visibleWhen:all(roomReady,eq(`${P}roomUse`,'rental'),eq(`${P}roomTenantRequest`)),support:all(roomReady,eq(`${P}roomUse`,'rental'),eq(`${P}roomTenantRequest`),contact(I.sela)),effects:[af('roomTenantRequest',false),af('roomUse','unselected'),know('roomTenantResponse','Ended future rental after declining Sela’s repair request. Completed rent remains settled; no debt or arrears were created.',I.sela),relationship(I.sela,-1)]}),

    command({id:'mg.room.workshop_batch',family:'MG02',label:'Make one crate in the room workshop · 1 log + 2 stamina + 4 min',description:'Use the repaired room as a workshop for one batch. The room site reservation prevents simultaneous guest service.',visibleWhen:all(roomReady,eq(`${P}roomUse`,'workshop')),
        support:all(roomReady,eq(`${P}roomUse`,'workshop')),requires:all(roomReady,eq(`${P}roomUse`,'workshop'),gte(`item.${K.log}`,1)),duration:4,siteId:I.room,repeatable:true,automatable:true,costs:[item(K.log,-1),stamina(-2)],effects:[item(K.crate,1),know('roomWorkshop','Made one actual crate using the room as a workshop. The product is still player stock and can be sold through a supported buyer.')]}),
];

export {commands};
