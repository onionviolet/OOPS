import {natural as integer} from '../basics.js';
import {clearRewardText} from '../fork_discovery_views.js';
// Original adaptation of FNA04/05/08/12. Pins and attribution: W-D.md.
// Player inventory, money, quest events and time retain their native owners.
import {recordAcquisitions} from '../acquisition.js';

export const FORT = Object.freeze({post:'Waypost Fort', yard:'Waypost Fort yard', cellar:'Waypost Fort cellar',
    notes:'Waypost repair notes', ledger:'Waypost storekeeper ledger', quest:'waypost_fort_repair'});
export const ORDERS = Object.freeze({tails:{name:'Pest-proof packing',item:'Rat tail',count:2,pay:8},
    ore:{name:'Replacement hinge stock',item:'Iron ore',count:2,pay:12}});
export function createFortSupply() {return {schema:1,notesIssued:false,repaired:false,funds:180,spent:0,
    received:{'Rat tail':0,'Iron ore':0},sources:[]};}
export function migrateFortSupply(save) {
    const value=save?.fort_supply;
    if(value==null)return createFortSupply();
    if(value.schema!==1)throw new Error('Unsupported Fort supply ledger.');
    if(typeof value.notesIssued!=='boolean'||typeof value.repaired!=='boolean'||
       !integer(value.funds)||!integer(value.spent)||!value.received||
       !['Rat tail','Iron ore'].every(id=>integer(value.received[id]))||!Array.isArray(value.sources))
        throw new Error('Invalid Fort supply ledger.');
    for(const s of value.sources)if(!s||typeof s.itemId!=='string'||!s.itemId||typeof s.sourceId!=='string'||!s.sourceId||
        typeof s.label!=='string'||!s.label||!['observed','reported'].includes(s.certainty)||
        !['clear','gather','craft','trade','drop','contact'].includes(s.kind)||!integer(s.at))throw new Error('Invalid learned item source.');
    return structuredClone(value);
}
// Called only at an actual acquisition or an authored, heard explanation.
// It deliberately does not inspect loot/recipe/location registries.
export function observeFortSource(fort,edge) {
    const next=migrateFortSupply({fort_supply:fort});
    const {itemId,sourceId,label,kind,at,certainty='observed'}=edge;
    if(!integer(edge.count)||edge.count<1)throw new Error('Source observation requires an actual positive acquisition or report.');
    const record={itemId,sourceId,label,kind,at,certainty};
    migrateFortSupply({fort_supply:{...next,sources:[record]}});
    const old=next.sources.find(s=>s.itemId===itemId&&s.sourceId===sourceId&&s.kind===kind);
    if(old){if(certainty==='observed')Object.assign(old,record);}else next.sources.push(record);
    return next;
}
export function itemSourceJournal(fort,knownItems) {
    return migrateFortSupply({fort_supply:fort}).sources.filter(s=>!!knownItems?.[s.itemId]).map(s=>({...s}));
}
export function knownClearText(location,disclosed=[]) {
    return clearRewardText(location,disclosed);
}
export function fortDisclosures(notesRead) {return notesRead?[{location:FORT.yard,clears:2}]:[];}

// Produces a normal persistExpansion plan. No live mutation or second publisher.
export function stageFortAction({state,gameplay,money,itemLog,fort,action,context,keyFor,getItem}) {
    if(context?.worldId!=='base.frontier'||!['Village',FORT.post].includes(context.location)||context.busy||context.readOnly)
        throw new Error('Visit the Village clerk or Fort supply post after finishing your current work.');
    if(!Number.isSafeInteger(money)||money<0)throw new Error('Invalid coin balance.');
    const next=migrateFortSupply({fort_supply:fort}), g=structuredClone(gameplay), s=structuredClone(state);
    if(!g.player?.inventory||!integer(s.clock)||!integer(s.sequence))throw new Error('Missing native inventory or played clock.');
    let balance=money, log=structuredClone(itemLog||{}), message;
    const unlocks=[];
    const consume=(id,count)=>{const key=keyFor(id);
        if(typeof context.assertItemDisposition!=='function')throw new Error('Native item custody guard is required.');
        context.assertItemDisposition(key);
        if(!integer(g.player.inventory[key])||g.player.inventory[key]<count)throw new Error(`You need ${count} ${id}.`);
        g.player.inventory[key]-=count;if(!g.player.inventory[key])delete g.player.inventory[key];};
    if(action==='notes'||action==='buy_notes') {
        if(next.notesIssued)throw new Error('The clerk already gave you the notes.');
        if(action==='notes' && !(context.fieldClears>=1))throw new Error('Finish one Infested field clear, or buy the clerk’s spare notes for 10 coins.');
        if(action==='buy_notes'){if(balance<10)throw new Error('You need 10 coins.');balance-=10;next.funds+=10;}
        next.notesIssued=true;const key=keyFor(FORT.notes);g.player.inventory[key]=(g.player.inventory[key]||0)+1;
        log=recordAcquisitions(log,[{key,count:1}],getItem);
        message='The clerk gives you repair notes. Read them to learn the Fort route and its salvage milestones.';
        next.sources.push({itemId:FORT.notes,sourceId:'village.supply_clerk',label:'Village supply clerk',kind:'contact',certainty:'observed',at:s.clock});
    } else if(action==='repair') {
        if(!context.notesRead||context.location!==FORT.post||!(context.yardClears>=1))throw new Error('Read the notes and clear the Fort yard before repairing the hatch at the supply post.');
        if(next.repaired)throw new Error('The hatch is already repaired.');
        consume('Iron ore',3);consume('Iron ingot',1);next.repaired=true;
        unlocks.push({kind:'availability',category:'location',id:FORT.cellar});
        message='You hand over three ore and one iron ingot. The clerk fits the cellar hatch. The cellar route is open.';
    } else if(action.startsWith('deliver:')) {
        if(!next.notesIssued)throw new Error('Speak to the supply clerk first.');
        const order=ORDERS[action.slice(8)];if(!order)throw new Error('Unknown supply request.');
        if(next.funds<order.pay)throw new Error('The clerk cannot fund another order. No stock was taken.');
        consume(order.item,order.count);next.funds-=order.pay;next.spent+=order.pay;balance+=order.pay;
        next.received[order.item]+=order.count;
        message=`Delivered ${order.count} ${order.item}; paid ${order.pay} coins. Clerk funds: ${next.funds}.`;
    } else throw new Error('Unknown Fort action.');
    if(![balance,next.funds,next.spent,...Object.values(next.received)].every(integer))throw new Error('Fort resource overflow.');
    s.sequence++;s.history.push({id:`event:${s.sequence}`,sequence:s.sequence,at:s.clock,actionId:`native.fort.${action}`,
        revision:1,outcome:'settled',draw:0,label:message});s.history=s.history.slice(-100);
    return {state:s,gameplay:g,external:{money:balance},itemLog:log,unlocks,nativePatch:{fort_supply:next},fort:next,message};
}
