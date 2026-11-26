// Supplied mentor making is an authored route, not a free arrival inventory grant.
// Neil's manufacture capability is inferred from his teaching/recharge/lending,
// rather than a demonstrated manufacture of the ch129 borrowed cohort.
import {CHARM_MENTOR_ID} from './lotm_charm_upkeep.js';
import {CHARM_LOAN_KEY} from './lotm_charm_loan.js';
import {defineLotmActs} from './lotm_act_engine.js';
import {createSimulationRegistry} from './simulation_contracts.js';
export const CHARM_LENDER_MAKE='lotm.craft.slumber-lender-stock';
// Existing armory binding: LOTM_RECORD_BINDINGS.armory in lotm_records_rows.js.
export const CHARM_LENDER_ARMORY='lotm.place.cast-a815f2c711b207abf093';
export const CHARM_LENDER_DIALS=Object.freeze({minutes:12,feePence:12});
const silver=JSON.stringify({id:'book.lotm.slumber_silver'}),supplies=JSON.stringify({id:'book.lotm.slumber_supplies'});
export function charmLenderStockActs(dials=CHARM_LENDER_DIALS){
 const mentor={fact:'charm.slumber.mentorAvailable',op:'eq',value:true,reason:'Meet Old Neil here while he is awake to arrange the making.'};
 return {rows:[{id:CHARM_LENDER_MAKE,kind:'making',label:'Old Neil’s lending stock',sourceIds:['lotm.rule.borrowed-slumber-replacement'],locators:['zh 第129章 p31'],eligibility:null,inputs:[],effects:[],
    steps:[{id:'make',kind:'prepare',text:'Supply the materials and pay Old Neil for time making a Slumber charm to keep ready for lending.'}]}],bindings:{
    [CHARM_LENDER_MAKE]:{place:CHARM_LENDER_ARMORY,visibleWhen:mentor,support:mentor,inputs:{},steps:{make:{minutes:dials.minutes,
        label:'Supply Old Neil to make a lendable Slumber charm',
        description:'Bring a silver blank and ritual supplies. Pay for Old Neil’s time; he makes the charm and keeps it ready to lend. You do not need to inscribe it yourself.',
        costText:`One silver blank, one ritual packet and ${dials.feePence} pence for Old Neil’s time; the finished charm stays with him`,
        costs:[{type:'item',key:silver,amount:-1},{type:'item',key:supplies,amount:-1},...(dials.feePence?[{type:'resource',key:'money',native:true,amount:-dials.feePence}]:[])],
        reportKey:'book.lotm.history.slumber.lender-stock-made',report:'Old Neil inscribes the supplied silver and keeps the Slumber charm ready to lend. The materials and his time are paid for; borrowing it is a separate arrangement.',
        effects:[{type:'item',actor:CHARM_MENTOR_ID,key:CHARM_LOAN_KEY,amount:1},...(dials.feePence?[{type:'resource',actor:CHARM_MENTOR_ID,key:'money',amount:dials.feePence}]:[])]}}}
 }};
}
export function withLenderStockParticipants(compiled){
 return {...compiled,commands:compiled.commands.map(command=>command.id===CHARM_LENDER_MAKE+'.make'?{...command,participants:[CHARM_MENTOR_ID],participantsCoLocated:true}:command)};
}
// Validation can precede the asynchronous private cast load. Retain this known
// public job without treating any saved effect list as a new command definition.
export function retainLenderStockJob(state,registry){
 const id=CHARM_LENDER_MAKE+'.make';
 if(registry.simulation.commands.has(id)||!state.simulation?.jobs?.some(job=>job.commandId===id))return false;
 const data=charmLenderStockActs(),compiled=withLenderStockParticipants(defineLotmActs(data.rows,data.bindings,{worldId:'book.lotm.tingen',group:'book_lotm',situationId:'book.lotm.tingen.canon_beside',requires:{fact:'lotm.profile.be',op:'eq',value:true}}));
 const checked=createSimulationRegistry({commands:compiled.commands});registry.simulation.commands.set(id,checked.commands.get(id));return true;
}
