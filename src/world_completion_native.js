import {worldCompletionStripStamp,worldCompletionStripKey} from './world_completion_strip.js';
const check=(ok,text)=>{if(!ok)throw new Error(text);};
export function worldCompletionSavedNativeItem(key,entry,getItem){
    const value=JSON.parse(key);
    if(value?.id!=='Measured drain strip'||value.datum==null)return null;
    const item=getItem(key),stamp=worldCompletionStripStamp(key);
    check(stamp&&item?.getInventoryKey()===key&&entry?.count===1,'Invalid saved measured-material identity.');
    return {item_key:key,count:entry.count};
}
export function preserveWorldCompletionNativeItem(key,item){
    let value;try{value=JSON.parse(key);}catch{return item;}
    if(value?.id!=='Measured drain strip'||value.datum==null)return item;
    const stamp=worldCompletionStripStamp(key);
    check(stamp&&item?.id==='Measured drain strip','Unsupported measured-material native identity.');
    item.inventory_key=key;
    item.datum=stamp;
    return item;
}
export function validateWorldCompletionNativeEnvelope(save){
    const state=save.expansion,s=state?.simulation;
    const containers=[];
    for(const owners of Object.values(save.inventories||{}))for(const inventory of Object.values(owners||{}))containers.push(inventory);
    if(save.character?.inventory)containers.push(save.character.inventory);
    if(save.player_storage?.inventory)containers.push(save.player_storage.inventory);
    if(s)containers.push(...Object.values(s.owners||{}));
    const loan=s?.custody?.['lore.instrument.amber'];
    if(loan){
        const amber=JSON.stringify({id:'Amber measuring prism'});
        const playerInventory=save.inventories?.person?.main_character||save.character?.inventory||{};
        const quantity=(bag,key)=>{const e=bag?.[key];return typeof e==='number'?e:e?.count||0;};
        const accepted=(s.jobs||[]).filter(j=>['world.completion.lens.measure_loan_room','world.completion.lens.measure_loan_outside'].includes(j.commandId));
        const reserved=accepted.reduce((n,j)=>n+(j.actorId==='player'&&j.worldCompletionLens?.loanCause===loan.cause&&j.costs.some(e=>e.type==='item'&&e.key===amber&&e.amount===-1&&e.custodyUse?.cause===loan.cause)?1:0),0);
        check(loan.owner==='artifact_collection.mara'&&loan.holder==='player'&&loan.key===amber&&loan.count===1&&
            quantity(playerInventory,amber)+reserved===1,'An active lens loan needs exactly its actual native carrier or exact held measurement reservation.');
        check(containers.filter(bag=>bag!==playerInventory).every(bag=>quantity(bag,amber)===0),
            'The same loaned lens cannot also be in another bag, shop or storage.');
        check(!Object.values(save.character?.equipment||{}).some(e=>typeof e==='string'?e===amber:e?.inventory_key===amber||e?.id==='Amber measuring prism'),
            'The borrowed measuring lens is a held tool, never equipped.');
        for(const slots of Object.values(save.npc_equipment||{}))check(!Object.values(slots).includes(amber),'The loaned prism cannot equip another holder.');
    }
    const totals=new Map();
    const validate=(key,count)=>{
        let value;try{value=JSON.parse(key);}catch{return;}
        if(value?.id!=='Measured drain strip'||value.datum==null)return;
        const stamp=worldCompletionStripStamp(key);
        check(stamp&&s?.schema>=5&&state.actors?.player?.facts?.['world.completion.enrolled']===true&&
            state.actors.player.completed?.['world.completion.begin']===1,'A stamped measured strip needs its explicit updated home-world reader.');
        check(Number.isSafeInteger(count)&&count>0,'Invalid stamped strip count.');
        const receipt=s.knowledge?.[stamp.makerId]?.['world.completion.learning.product.'+Number(stamp.productionCause.split(':')[1])];
        check(receipt?.cause===stamp.productionCause&&receipt.value===JSON.stringify(stamp)&&worldCompletionStripKey(stamp)===key,
            'This stored measured strip lost its actual maker production receipt.');
        totals.set(key,(totals.get(key)||0)+count);
    };
    for(const inventory of containers)for(const [key,entry] of Object.entries(inventory||{}))validate(key,typeof entry==='number'?entry:entry?.count);
    for(const job of s?.jobs||[])for(const e of job.costs||[])if(e.type==='item'&&e.amount<0&&worldCompletionStripStamp(e.key))validate(e.key,-e.amount);
    check([...totals.values()].every(n=>n===1),'A measured production receipt cannot own duplicate pieces across bags, storage or reservations.');
    for(const slots of Object.values(save.npc_equipment||{}))for(const key of Object.values(slots)){
        let value;try{value=JSON.parse(key);}catch{continue;}
        check(value?.id!=='Measured drain strip','Measured materials are physical stock, never equipment.');
    }
}
