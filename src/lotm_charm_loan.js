// Ch129 p26–31: Old Neil lends Slumber; if consumed, replace it in kind.
// Handovers take one local minute by authored default. Stock has no automatic refill.
import {CHARM_MENTOR_ID} from './lotm_charm_upkeep.js';
import {BE_SEER_ENERGY_ID} from './book_world_lotm_be_seer.js';
export const CHARM_LOAN_ID='lotm.charm.slumber.neil-loan';
export const CHARM_LOAN_BORROW='lotm.craft.slumber-loan';
export const CHARM_LOAN_RETURN='lotm.craft.slumber-loan-return';
export const CHARM_LOAN_REPLACE='lotm.craft.slumber-loan-replace';
export const CHARM_LOAN_USE='lotm.craft.slumber-loan-use';
export const CHARM_LOAN_KEY=JSON.stringify({id:'book.lotm.slumber_loan_charm'});
export const CHARM_REPLACEMENT_KEY=JSON.stringify({id:'book.lotm.slumber_charm'});
export const charmLoanItems=[['slumber_loan_charm',"Old Neil’s Slumber charm",'A Slumber charm lent by Old Neil. Return it unused, or replace it in kind if burned.']];
const eq=(fact,value,reason)=>({fact,op:'eq',value,reason});
const active=eq('charm.slumber.loan.active',true,'Old Neil has no Slumber charm out on loan to you.');
const mentor=eq('charm.slumber.mentorAvailable',true,'Meet an awake Old Neil to arrange the handover.');
const held={fact:`item.${CHARM_LOAN_KEY}`,op:'gte',value:1,reason:'You no longer hold the unused borrowed charm. Make a replacement if it was burned.'};
const handover=(from,to,extra={})=>({type:'custody',from,to,key:CHARM_LOAN_KEY,count:1,loanId:CHARM_LOAN_ID,...extra});
export function charmLoanFacts(state,context={}){
 const loan=state.simulation?.custody?.[CHARM_LOAN_ID];
 return {'charm.slumber.loan.active':!!loan,'charm.slumber.loan.lenderStock':state.simulation?.owners?.[CHARM_MENTOR_ID]?.[CHARM_LOAN_KEY]||0,
    'charm.slumber.loan.borrowedHeld':context.gameplay?.player?.inventory?.[CHARM_LOAN_KEY]||0};
}
export function charmLoanView(state,context={}){
 const facts=charmLoanFacts(state,context),loan=state.simulation?.custody?.[CHARM_LOAN_ID];
 const held=facts['charm.slumber.loan.borrowedHeld'];
 const using=state.simulation?.jobs?.some(job=>job.commandId===CHARM_LOAN_USE+'.activate');
 return {active:!!loan,held,using,lender:'Old Neil',lenderStock:facts['charm.slumber.loan.lenderStock'],
    owes:loan?(held?'return or replacement':using?'return if stopped, or replacement if burned':'replacement in kind'):'none'};
}
export function charmLoanActs(){
 const row=(id,label,step)=>({id,kind:'item_use',label,sourceIds:['lotm.rule.borrowed-slumber-replacement'],locators:['zh 第129章 p31'],steps:[step],eligibility:null,inputs:[],effects:[]});
 const original={...active};
 const replacement={fact:`item.${CHARM_REPLACEMENT_KEY}`,op:'gte',value:1,reason:'Make or obtain an owned Slumber charm to return in kind.'};
 const noBorrowed=eq('charm.slumber.loan.borrowedHeld',0,'Return the unused original instead of replacing it.');
 return {rows:[row(CHARM_LOAN_BORROW,'Borrow a Slumber charm',{id:'borrow',kind:'use',text:'Ask Old Neil for a Slumber charm on loan.'}),
    row(CHARM_LOAN_RETURN,'Return the borrowed Slumber charm',{id:'return',kind:'use',text:'Return the same unused charm to Old Neil.'}),
    row(CHARM_LOAN_REPLACE,'Replace the consumed Slumber charm',{id:'replace',kind:'use',text:'Return an equivalent Slumber charm to Old Neil.'}),
    row(CHARM_LOAN_USE,'Use the borrowed Slumber charm',{id:'activate',kind:'use',text:'Speak the word, channel spirituality and throw the borrowed charm.'})],
 bindings:{
    [CHARM_LOAN_BORROW]:{place:null,visibleWhen:mentor,support:{all:[mentor,eq('charm.slumber.loan.active',false,'Return or replace the current loan before borrowing again.'),
        {fact:'charm.slumber.loan.lenderStock',op:'gte',value:1,reason:'Old Neil has no recorded charm available to lend here.'}]},inputs:{},steps:{borrow:{minutes:1,costs:[],costText:'Old Neil lends his available charm; return it unused or replace it if burned',
        label:'Ask Old Neil to lend a Slumber charm',reportKey:'book.lotm.history.slumber.borrowed',report:'Old Neil lends you a Slumber charm. If you burn it, make another for him when you can.',
        effects:[handover(CHARM_MENTOR_ID,'player',{equivalentKey:CHARM_REPLACEMENT_KEY})]}}},
    [CHARM_LOAN_RETURN]:{place:null,visibleWhen:original,support:{all:[active,held,mentor]},inputs:{},steps:{return:{minutes:1,costs:[],costText:'The same unused charm returns to Old Neil',
        label:'Return Old Neil’s unused Slumber charm',reportKey:'book.lotm.history.slumber.loan-returned',report:'You return the unused Slumber charm to Old Neil. Nothing remains owed for this loan.',
        effects:[handover('player',CHARM_MENTOR_ID,{returning:true})]}}},
    [CHARM_LOAN_REPLACE]:{place:null,visibleWhen:original,support:{all:[active,noBorrowed,replacement,mentor]},inputs:{},steps:{replace:{minutes:1,costs:[],costText:'One owned Slumber charm replaces the burned loan; no money changes hands',
        label:'Give Old Neil a replacement Slumber charm',reportKey:'book.lotm.history.slumber.loan-replaced',report:'Old Neil receives the replacement Slumber charm. The burned charm’s loan is settled in kind.',
        // The returned equivalent is the same one unit, recorded as his lendable stock.
        effects:[handover('player',CHARM_MENTOR_ID,{returning:true,replacementKey:CHARM_REPLACEMENT_KEY}),
            {type:'item',actor:CHARM_MENTOR_ID,key:CHARM_REPLACEMENT_KEY,amount:-1},
            {type:'item',actor:CHARM_MENTOR_ID,key:CHARM_LOAN_KEY,amount:1}]}}},
    [CHARM_LOAN_USE]:{place:null,visibleWhen:original,requires:{all:[active,held]},inputs:{},steps:{activate:{minutes:1,
        costs:[{type:'item',key:CHARM_LOAN_KEY,amount:-1,breakCustody:true},{type:'energy',energyId:BE_SEER_ENERGY_ID,operation:'use',output:1,control:1}],
        costText:'The borrowed Slumber charm and one point of spirituality; a replacement remains owed to Old Neil',label:'Throw Old Neil’s borrowed Slumber charm',
        reportKey:'book.lotm.history.slumber.loan-used',report:'You burn the borrowed charm. Its silver is gone; you still owe Old Neil a Slumber charm in kind.'}}}
 }};
}
