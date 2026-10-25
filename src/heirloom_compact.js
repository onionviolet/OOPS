import {carryLedger} from './carry_ledger.js';
const natural=n=>Number.isSafeInteger(n)&&n>=0;
export function validateNomination(n){
    if(!n||!['person','chest'].includes(n.source)||typeof n.key!=='string'||!n.key||n.key.length>2048||!natural(n.count)||!n.count||!natural(n.at))throw Error('Invalid heirloom nomination.');
    return n;
}
export function validateCompact(s){
    if(s.nomination!==null)validateNomination(s.nomination);
    if(s.receipt!==null){validateNomination(s.receipt);if(!['claimed','lapsed','unresolved'].includes(s.receipt.status)||typeof s.receipt.recipient!=='string')throw Error('Invalid heirloom claim receipt.');}
}
export function compactCarrier(world){return carryLedger(world).find(r=>r.boundary==='death').rows.find(r=>r.what==='Coins, belongings, chest, Shack')?.carries==='carries';}
export function nominateHeirloom(save,request,at){
    if(!compactCarrier(save.expansion?.actors?.player?.worldId??'base.frontier'))throw Error('No local estate carrier is recorded for this boundary. The goods stay with their current owner.');
    const n=validateNomination({source:request.source,key:request.key,count:request.count,at});
    const inv=n.source==='person'?save.inventories?.person?.main_character:save.inventories?.storage?.player;
    if((inv?.[n.key]?.count||0)<n.count)throw Error('The nominated goods are no longer owned in that quantity.');
    return n;
}
// Move a counted estate row into the explicit claim. Generic inheritance cannot
// also transfer it. A spent or misplaced lot lapses, without creating a copy.
export function stageHeirloomClaim(previous,leftovers){
    const n=previous.cheats?.held?.['heirloom-compact']?.card.state.nomination;
    if(!n)return leftovers;
    validateNomination(n);
    const receipt={...n,status:'unresolved',recipient:leftovers.heir?.name??leftovers.recipient};
    if(compactCarrier(previous.expansion?.actors?.player?.worldId??'base.frontier')){
        const rows=leftovers[n.source==='person'?'belongings':'chest'],i=rows.findIndex(([key])=>key===n.key);
        receipt.status=i>=0&&rows[i][1]>=n.count?'claimed':'lapsed';
        if(receipt.status==='claimed'){rows[i][1]-=n.count;if(!rows[i][1])rows.splice(i,1);}
    }
    leftovers.compact=receipt;return leftovers;
}
