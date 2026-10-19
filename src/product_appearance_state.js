import {check, natural} from './basics.js';
import {drawUnit,ensureStreams,validateStreams,unitDecision} from './seeded_streams.js';
import {APPEARANCE_POOL,APPEARANCE_STREAM,APPEARANCE_LIMIT,PRODUCT_APPEARANCES} from './product_appearance_content.js';
import {validateMixtureState,validateProduct} from './mixture_state.js';
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
function keys(value,allowed){check(object(value)&&Object.keys(value).sort().join()===allowed.sort().join(),'Invalid appearance owner fields.');}
function shuffled(start,salt,draw){
    const permutation=Object.keys(PRODUCT_APPEARANCES);
    for(let i=permutation.length-1;i>0;i--){const u=draw(i,start+6-i,salt);const j=Math.floor(u*(i+1));[permutation[i],permutation[j]]=[permutation[j],permutation[i]];}
    return permutation;
}
export function createProductAppearances(expansion,{clock,receiptId}){
    const streams=ensureStreams(expansion),cell=streams.cells[APPEARANCE_STREAM]??{n:0,salt:0};
    check(natural(clock)&&typeof receiptId==='string'&&receiptId.length>0,'Invalid appearance enrollment.');
    const start=cell.n,salt=cell.salt;
    const permutation=shuffled(start,salt,i=>drawUnit(expansion,APPEARANCE_STREAM,`pool@1:swap:${i}`));
    return {schema:1,poolId:APPEARANCE_POOL,revision:1,permutation,enrolledAt:clock,enrollmentReceiptId:receiptId,
        drawStart:start,drawSalt:salt,bindings:{},nextSlot:0};
}
export function bindProductAppearance(owner,product,{clock,receiptId}){
    validateProduct(product);
    if(owner.bindings[product.id]||owner.nextSlot===APPEARANCE_LIMIT)return false;
    owner.bindings[product.id]={appearanceId:owner.permutation[owner.nextSlot++],productTruthRevision:product.revision,allocatedAt:clock,acquisitionReceiptId:receiptId};
    return true;
}
// Called only after accepted acquisition has staged the real P2 output. The
// caller's live expansion is never mutated, even if durable publication fails.
export function stageProductAppearanceAcquisition(plan,expansion,previous,product,clock){
    if(!expansion)return plan;
    // Pre-slice products retain their labels forever; creating another batch
    // does not retroactively enroll an existing type.
    if(!expansion.productAppearances&&previous?.products?.[product.id])return plan;
    if(expansion.productAppearances&&(previous?.products?.[product.id]||expansion.productAppearances.nextSlot===APPEARANCE_LIMIT))return plan;
    const next=structuredClone(expansion),receiptId=`mixture.acquisition:${plan.state.sequence}`;
    plan.state.acquisitions??={};
    plan.state.acquisitions[receiptId]={product:product.id,revision:product.revision,at:clock,sequence:plan.state.sequence};
    next.productAppearances??=createProductAppearances(next,{clock,receiptId});
    // An already-present pre-slice type never enters the new pool.
    if(!previous?.products?.[product.id]||next.productAppearances.bindings[product.id])bindProductAppearance(next.productAppearances,product,{clock,receiptId});
    validateProductAppearanceEnvelope({expansion:next,mixtures:plan.state});
    plan.expansion=next;return plan;
}
export function validateProductAppearanceEnvelope(envelope){
    const a=envelope.expansion?.productAppearances;
    if(a==null){check(!Object.keys(envelope.mixtures?.acquisitions??{}).length,'Missing appearance owner for acquisition receipts.');return envelope;}
    keys(a,['schema','poolId','revision','permutation','enrolledAt','enrollmentReceiptId','drawStart','drawSalt','bindings','nextSlot']);
    check(a.schema===1&&a.poolId===APPEARANCE_POOL&&a.revision===1,'Unsupported appearance pool revision.');
    check(natural(a.enrolledAt)&&natural(a.drawStart)&&Number.isInteger(a.drawSalt)&&a.drawSalt>=0&&a.drawSalt<=0xffffffff&&natural(a.nextSlot)&&a.nextSlot<=APPEARANCE_LIMIT,'Invalid appearance allocation.');
    const streams=validateStreams(envelope.expansion.streams),cell=streams.cells[APPEARANCE_STREAM];
    check(cell&&cell.n>=a.drawStart+5&&cell.salt===a.drawSalt,'Missing appearance draw cursor.');
    const expected=shuffled(a.drawStart,a.drawSalt,(i,n,salt)=>unitDecision(streams,APPEARANCE_STREAM,`pool@1:swap:${i}`,n,salt).value);
    check(JSON.stringify(a.permutation)===JSON.stringify(expected),'Invalid saved appearance permutation.');
    const s=validateMixtureState(envelope.mixtures);
    const receipt=(id,product,at)=>{const r=s.acquisitions?.[id];check(r&&r.product===product&&r.at===at&&r.revision===s.products[product]?.revision,'Unresolved appearance acquisition receipt.');};
    const enrollment=s.acquisitions?.[a.enrollmentReceiptId];check(enrollment,'Missing appearance enrollment receipt.');receipt(a.enrollmentReceiptId,enrollment.product,a.enrolledAt);
    check(object(a.bindings)&&Object.keys(a.bindings).length===a.nextSlot,'Invalid appearance bindings.');
    const slots=new Set();
    for(const [id,b]of Object.entries(a.bindings)){
        keys(b,['appearanceId','productTruthRevision','allocatedAt','acquisitionReceiptId']);
        check(s.products[id]&&b.productTruthRevision===s.products[id].revision&&natural(b.allocatedAt)&&b.allocatedAt>=a.enrolledAt,'Unsupported appearance product reference.');
        const slot=a.permutation.indexOf(b.appearanceId);check(slot>=0&&slot<a.nextSlot&&!slots.has(slot),'Duplicate appearance slot.');slots.add(slot);receipt(b.acquisitionReceiptId,id,b.allocatedAt);
    }
    check(a.bindings[enrollment.product]?.acquisitionReceiptId===a.enrollmentReceiptId,'Enrollment must bind its acquired type.');
    let last=0;for(let slot=0;slot<a.nextSlot;slot++){const b=Object.values(a.bindings).find(b=>b.appearanceId===a.permutation[slot]),r=s.acquisitions[b.acquisitionReceiptId];check(r.sequence>last,'Appearance acquisition order mismatch.');last=r.sequence;}
    return envelope;
}
