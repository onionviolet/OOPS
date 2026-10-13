import {I,K,command,eq,gte,all,any,not,af,item,money,coins,stamina,transfer,know,contact,purse,owned,relationship} from './shared.js';

const P = 'actor.mg.';
const bramOrder = 'mg07.bram.order';
const bramDelivery = 'mg07.bram.delivery';
const selaTerms = 'mg08.sela.terms';
const selaWork = 'mg08.sela.work';
const selaSettlement = 'mg08.sela.loan.settlement';
const selaExtension = 'mg08.sela.loan.extension';
const termsSeen = eq('knowledge.mg.sela.aid_request.seen');
const aidChosen = any(eq(`${P}selaAidTerms`,'loan'),eq(`${P}selaAidTerms`,'gift'),eq(`${P}selaAidTerms`,'refused'));

export const commands = [
    command({id:'mg.workshop.bram_ordinary',family:'MG07',label:'Accept Bram’s ordinary crate order · 2 logs + 2 stamina + 4 min',description:'Accept Bram’s one finite ordinary-crate commission. Work two actual logs at the shared bench; the finished crate pays six coins from Bram’s purse when delivered. The order can be cancelled with its reserved inputs refunded.',targetId:I.bram,coLocated:true,participants:['$target'],claim:bramOrder,
        support:contact(I.bram),requires:all(contact(I.bram),owned('Rough wood log'),gte('vital.stamina',2)),duration:4,siteId:I.bench,
        costs:[item(K.log,-2),stamina(-2)],effects:[item(K.crate,1),af('bramOrder','ordinary'),af('bramOrderDelivered',false),know('bram.order','Accepted and completed Bram’s one ordinary-crate order at the shared bench. Two actual logs made one Courtyard wood crate; delivery is still required for the quoted six-coin payment.',I.bram)]}),

    command({id:'mg.workshop.bram_careful',family:'MG07',label:'Accept Bram’s careful fine-crate order · 3 logs + 3 stamina + 8 min',description:'Accept Bram’s one finite careful-work commission. Use three actual logs and more stamina at the shared bench; the finished fine crate pays ten coins from Bram’s purse when delivered. The order can be cancelled with its reserved inputs refunded.',targetId:I.bram,coLocated:true,participants:['$target'],claim:bramOrder,
        support:contact(I.bram),requires:all(contact(I.bram),owned('Rough wood log'),gte('vital.stamina',3)),duration:8,siteId:I.bench,
        costs:[item(K.log,-3),stamina(-3)],effects:[item(K.fine,1),af('bramOrder','careful'),af('bramOrderDelivered',false),know('bram.order','Accepted and completed Bram’s one careful fine-crate order at the shared bench. Three actual logs made one Fine courtyard crate; delivery is still required for the quoted ten-coin payment.',I.bram)]}),

    command({id:'mg.workshop.deliver_bram_ordinary',family:'MG07',label:'Deliver the ordinary crate to Bram · receive 6 coins',description:'Transfer the actual Courtyard wood crate to Bram. He pays six coins from his finite purse once for the accepted order.',targetId:I.bram,coLocated:true,participants:['$target'],claim:bramDelivery,
        visibleWhen:all(eq(`${P}bramOrder`,'ordinary'),eq(`${P}bramOrderDelivered`,false)),support:all(contact(I.bram),purse(I.bram,6)),requires:all(eq(`${P}bramOrder`,'ordinary'),owned('Courtyard wood crate')),
        costs:[transfer(K.crate,1,'player',I.bram)],effects:[coins(-6,I.bram),money(6),af('bramOrderDelivered',true),know('bram.delivery','Delivered the actual ordinary Courtyard wood crate to Bram. Six coins moved from his finite purse once for this accepted order.',I.bram),relationship(I.bram,1)]}),

    command({id:'mg.workshop.deliver_bram_careful',family:'MG07',label:'Deliver the fine crate to Bram · receive 10 coins',description:'Transfer the actual Fine courtyard crate to Bram. He pays ten coins from his finite purse once for the accepted order.',targetId:I.bram,coLocated:true,participants:['$target'],claim:bramDelivery,
        visibleWhen:all(eq(`${P}bramOrder`,'careful'),eq(`${P}bramOrderDelivered`,false)),support:all(contact(I.bram),purse(I.bram,10)),requires:all(eq(`${P}bramOrder`,'careful'),owned('Fine courtyard crate')),
        costs:[transfer(K.fine,1,'player',I.bram)],effects:[coins(-10,I.bram),money(10),af('bramOrderDelivered',true),know('bram.delivery','Delivered the actual Fine courtyard crate to Bram. Ten coins moved from his finite purse once for this accepted order.',I.bram),relationship(I.bram,1)]}),

    command({id:'mg.aid.sela_request',family:'MG08',label:'Hear Sela’s request for help',description:'Sela explains that she needs eight coins for a local expense. Choose a finite loan, a gift with no collectible debt, or refusal. No option changes until you choose.',targetId:I.sela,coLocated:true,participants:['$target'],claim:'mg08.sela.request',
        support:contact(I.sela),effects:[af('selaAidTerms','pending'),af('selaDebtOutstanding',false),af('selaLoanExtended',false),af('selaWorkReady',false),af('selaWorkPaid',false),know('sela.aid_request','Sela needs eight coins for a local expense. A loan creates only an eight-coin principal claim; a gift creates no debt; refusal changes no money or obligation.',I.sela)]}),

    command({id:'mg.aid.lend_sela',family:'MG08',label:'Lend Sela 8 coins · principal due after useful work',description:'Transfer eight actual coins to Sela as a finite loan. She can repay the same principal only after completing and delivering Mira’s funded work commission. There is no timer or automatic interest.',targetId:I.sela,coLocated:true,participants:['$target'],claim:selaTerms,
        visibleWhen:all(termsSeen,eq(`${P}selaAidTerms`,'pending')),support:contact(I.sela),requires:all(termsSeen,eq(`${P}selaAidTerms`,'pending')),costs:[money(-8)],effects:[coins(8,I.sela),af('selaAidTerms','loan'),af('selaDebtOutstanding',true),know('sela.aid_terms','Chose an eight-coin loan. Sela received the actual coins; the same principal is collectible only after her useful commissioned work pays her.',I.sela)]}),

    command({id:'mg.aid.gift_sela',family:'MG08',label:'Give Sela 8 coins · no debt',description:'Transfer eight actual coins to Sela as a gift. It records gratitude, not a loan, and creates no collectible debt.',targetId:I.sela,coLocated:true,participants:['$target'],claim:selaTerms,
        visibleWhen:all(termsSeen,eq(`${P}selaAidTerms`,'pending')),support:contact(I.sela),requires:all(termsSeen,eq(`${P}selaAidTerms`,'pending')),costs:[money(-8)],effects:[coins(8,I.sela),af('selaAidTerms','gift'),af('selaDebtOutstanding',false),know('sela.aid_terms','Gave Sela eight actual coins as a gift. No principal, repayment claim or collectible debt exists.',I.sela),relationship(I.sela,1)]}),

    command({id:'mg.aid.refuse_sela',family:'MG08',label:'Decline Sela’s request',description:'Refuse without changing either purse or creating an obligation. Sela may still take Mira’s finite work commission.',targetId:I.sela,coLocated:true,participants:['$target'],claim:selaTerms,
        visibleWhen:all(termsSeen,eq(`${P}selaAidTerms`,'pending')),support:contact(I.sela),requires:all(termsSeen,eq(`${P}selaAidTerms`,'pending')),effects:[af('selaAidTerms','refused'),af('selaDebtOutstanding',false),know('sela.aid_terms','Declined Sela’s request. No money moved and no obligation was created.',I.sela),relationship(I.sela,-1)]}),

    command({id:'mg.aid.extend_sela_loan',family:'MG08',label:'Accept Sela’s one repayment extension · no added money',description:'Sela asks to extend the same eight-coin principal until after Mira’s funded commission. Record her explicit consent and the unchanged amount; no coins move and no interest is added.',targetId:I.sela,coLocated:true,participants:['$target'],claim:selaExtension,
        visibleWhen:all(eq(`${P}selaAidTerms`,'loan'),not(eq(`${P}selaLoanExtended`,true)),eq(`${P}selaDebtOutstanding`,true)),support:contact(I.sela),
        requires:all(eq(`${P}selaAidTerms`,'loan'),eq(`${P}selaLoanExtended`,false),eq(`${P}selaDebtOutstanding`,true)),
        effects:[af('selaLoanExtended',true),know('sela.loan_extension','Sela consented to one extension of the same eight-coin principal until after her funded work. No new money, interest or larger claim was added.',I.sela)]}),

    command({id:'mg.aid.mira_funded_work',family:'MG08',label:'Complete Mira’s funded crate commission · 2 logs + 2 stamina + 5 min',description:'Use two actual logs at the shared bench to make one real Courtyard wood crate for Mira. The reserved materials return if cancelled or if either named person withdraws support; delivery pays Sela’s finite wage from Mira’s purse.',targetId:I.mira,coLocated:true,participants:['$target',I.sela],claim:selaWork,
        support:all(contact(I.mira),contact(I.sela)),requires:all(aidChosen,owned('Rough wood log'),gte('vital.stamina',2)),duration:5,siteId:I.bench,
        visibleWhen:all(aidChosen,eq(`${P}selaWorkReady`,false),eq(`${P}selaWorkPaid`,false)),costs:[item(K.log,-2),stamina(-2)],effects:[item(K.crate,1),af('selaWorkReady',true),know('sela.work_order','Completed one real Mira-funded crate commission for Sela at the shared bench. Two actual logs produced one actual crate; Mira’s finite wage is paid to Sela only when the crate is delivered.',I.mira)]}),

    command({id:'mg.aid.deliver_mira_work',family:'MG08',label:'Deliver Sela’s crate to Mira · 10 coins to Sela, 2 to you',description:'Transfer the actual Courtyard wood crate to Mira. Her purse pays Sela a ten-coin wage and pays you two coins for the supplied work; both payments happen once with delivery.',targetId:I.mira,coLocated:true,participants:['$target',I.sela],claim:'mg08.sela.work.delivery',
        visibleWhen:eq(`${P}selaWorkReady`,true),support:all(contact(I.mira),contact(I.sela),purse(I.mira,12)),requires:all(eq(`${P}selaWorkReady`,true),owned('Courtyard wood crate')),
        costs:[transfer(K.crate,1,'player',I.mira)],effects:[coins(-12,I.mira),coins(10,I.sela),money(2),af('selaWorkReady',false),af('selaWorkPaid',true),know('sela.work_paid','Delivered the actual crate to Mira. Twelve coins left her finite purse: ten went to Sela as wages and two to you for the work.',I.mira),relationship(I.sela,1)]}),

    command({id:'mg.aid.repay_sela_loan',family:'MG08',label:'Collect Sela’s 8-coin loan principal',description:'After Sela’s completed useful commission, collect the original eight-coin principal from her actual purse. The settlement closes once; no gift or refusal can be collected.',targetId:I.sela,coLocated:true,participants:['$target'],claim:selaSettlement,
        visibleWhen:all(eq(`${P}selaAidTerms`,'loan'),eq(`${P}selaDebtOutstanding`,true),eq(`${P}selaWorkPaid`,true)),support:all(contact(I.sela),purse(I.sela,8)),
        requires:all(eq(`${P}selaAidTerms`,'loan'),eq(`${P}selaDebtOutstanding`,true),eq(`${P}selaWorkPaid`,true)),costs:[coins(-8,I.sela)],
        effects:[money(8),{type:'claim',operation:'settle',key:selaSettlement},af('selaDebtOutstanding',false),know('sela.loan_settlement','Collected the original eight-coin loan principal from Sela’s actual purse after her completed useful work. The claim is settled and cannot be collected again.',I.sela),relationship(I.sela,1)]}),
];
