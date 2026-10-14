import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState} from '../src/expansion_engine.js';
import {createProductAppearances,validateProductAppearanceEnvelope} from '../src/product_appearance_state.js';
import {APPEARANCE_STREAM,PRODUCT_APPEARANCES} from '../src/product_appearance_content.js';
import {productAppearanceView,setProductAppearanceOwner} from '../src/product_appearance_view.js';
import {createMixtureState,resolveMixture,mixtureKey,mixturePresentation} from '../src/mixture_state.js';
import {stageMixtureAction,commitMixturePlan} from '../src/mixture_native.js';
import {validateSaveEnvelope} from '../src/save_files.js';
const inputs={'River bellleaf':1,'Spring water':1};
function context(seed=7){return {owner:null,seed:7,expansion:createExpansionState(seed),inventory:Object.fromEntries(['River bellleaf','Emberseed','Spring water','Mellow salt'].map(id=>[JSON.stringify({id}),{count:30}])),money:100,clock:0};}
function action(c,request){const p=stageMixtureAction({...c,request});if(p){c.owner=p.state;c.inventory=p.inventory;c.money=p.money;if(p.expansion)c.expansion=p.expansion;}return p;}
const mix=(c,n=1,process='steep')=>action(c,{type:'mix',inputs:{...inputs,'River bellleaf':n},process});
const envelope=c=>({mixtures:c.owner,expansion:c.expansion,inventories:{person:{main_character:c.inventory}},character:{money:c.money},active_effects:{}});
test('six neutral distinct labels use words/shape, five draws, deterministic root and isolation',()=>{
    const make=seed=>{const e=createExpansionState(seed);return {a:createProductAppearances(e,{clock:0,receiptId:'test'}),e};};
    const a=make(7),b=make(7),d=make(8);assert.deepEqual(a,b);assert.notDeepEqual(a.a.permutation,d.a.permutation);
    assert.equal(a.e.streams.cells[APPEARANCE_STREAM].n,5);assert.equal(a.e.streams.log.length,5);assert.deepEqual(Object.keys(a.e.streams.cells),[APPEARANCE_STREAM]);assert.equal(a.e.rng,7);
    assert.equal(new Set(a.a.permutation).size,6);assert.equal(Object.keys(PRODUCT_APPEARANCES).length,6);
    const signatures=new Set();for(let seed=1;seed<=100;seed++)signatures.add(make(seed).a.permutation.join());assert.ok(signatures.size>70);
});
test('preview, failed acquisition and duplicate type never allocate or draw; four slots then passthrough',()=>{
    const c=context(),before=structuredClone(c);const preview=resolveMixture(createMixtureState(c.seed),inputs,'steep');assert.ok(preview);assert.deepEqual(c,before);
    assert.throws(()=>mix(c,99),/Shortage/);assert.deepEqual(c,before);mix(c);const first=structuredClone(c.expansion);mix(c);assert.deepEqual(c.expansion,first);
    mix(c,2);mix(c,1,'boil');mix(c,2,'boil');assert.equal(c.expansion.productAppearances.nextSlot,4);const full=structuredClone(c.expansion);mix(c,3);assert.deepEqual(c.expansion,full);
    const p=Object.values(c.owner.products).at(-1),base={name:'base',description:'unknown'};assert.deepEqual(productAppearanceView(full.productAppearances,p,c.owner.knowledge,base),base);validateProductAppearanceEnvelope(envelope(c));
});
test('experiment recognizes repeat exact type, never a different concentration/process or fabricated unseen batch',()=>{
    const c=context();mix(c);const p=Object.values(c.owner.products)[0],a=c.expansion.productAppearances;
    setProductAppearanceOwner(a);try{
        const unknown=mixturePresentation(c.owner,p);assert.ok(Object.values(PRODUCT_APPEARANCES).includes(unknown.name));assert.doesNotMatch(JSON.stringify(unknown),/health regeneration|stamina regeneration|agility|m1:|restore|sedation|Steeped/);
        action(c,{type:'use',key:mixtureKey(p)});mix(c);assert.match(mixturePresentation(c.owner,p).name,/Steeped Village mixture/);assert.match(mixturePresentation(c.owner,p).description,/Observed dose/);
        mix(c,2);const other=Object.values(c.owner.products)[1];const view=productAppearanceView(c.expansion.productAppearances,other,c.owner.knowledge,{name:'hidden type',description:'untested'});assert.doesNotMatch(JSON.stringify(view),/hidden type|health|dose/);
        // Any future batch-specific identity lacks this binding/knowledge and
        // remains on the caller's authorized unknown projection.
        const batch={...p,id:p.id+':unseen-batch'};assert.deepEqual(productAppearanceView(a,batch,c.owner.knowledge,{name:'Untested batch',description:'unknown'}),{name:'Untested batch',description:'unknown'});
    }finally{setProductAppearanceOwner(null);}
});
test('failed durable acquisition/experiment preserves map, stream, inventory, knowledge and money',()=>{
    const c=context(),before=structuredClone(c),plan=stageMixtureAction({...c,request:{type:'mix',inputs,process:'steep'}});let published=false;
    const fail=p=>assert.throws(()=>commitMixturePlan(p,{createSave:()=>JSON.stringify(envelope(c)),validateEnvelope:validateProductAppearanceEnvelope,write:()=>{throw Error('quota');},publish:()=>{published=true;}}),/quota/);
    fail(plan);assert.equal(published,false);assert.deepEqual(c,before);mix(c);const saved=structuredClone(c),p=Object.values(c.owner.products)[0];fail(stageMixtureAction({...c,request:{type:'use',key:mixtureKey(p)}}));assert.deepEqual(c,saved);
});
test('exact serialized map, truth, inventory, knowledge and cursor survive reload/import and consumption',()=>{
    const c=context();mix(c);const p=Object.values(c.owner.products)[0];action(c,{type:'use',key:mixtureKey(p)});let saved;
    const plan=mix(c);commitMixturePlan(plan,{createSave:()=>JSON.stringify(envelope(c)),validateEnvelope:validateProductAppearanceEnvelope,write:text=>saved=JSON.parse(text),publish:()=>{}});
    validateProductAppearanceEnvelope(saved);assert.deepEqual(saved.expansion,c.expansion);assert.deepEqual(saved.mixtures,c.owner);assert.deepEqual(saved.inventories.person.main_character,c.inventory);
});
test('forged bindings, duplicates, future pool/truth, missing receipts and cursor reject unchanged',()=>{
    const c=context();mix(c);mix(c,2);const source=envelope(c),id=Object.keys(c.expansion.productAppearances.bindings)[0],other=Object.keys(c.expansion.productAppearances.bindings)[1];
    const edits=[s=>s.expansion.productAppearances.revision=2,s=>s.expansion.productAppearances.poolId='missing',s=>s.expansion.productAppearances.bindings[id].productTruthRevision=9,
        s=>s.expansion.productAppearances.bindings[id].acquisitionReceiptId='missing',s=>s.expansion.productAppearances.bindings[other].appearanceId=s.expansion.productAppearances.bindings[id].appearanceId,
        s=>s.expansion.productAppearances.permutation.reverse(),s=>s.expansion.streams.cells[APPEARANCE_STREAM].n=4,s=>s.expansion.productAppearances.extra=true];
    for(const edit of edits){const bad=structuredClone(source);edit(bad);assert.throws(()=>validateProductAppearanceEnvelope(bad));assert.deepEqual(envelope(c),source);}
});
test('pre-slice products retain names, first new acquisition opts in, fieldcraft remains unchanged',async()=>{
    const c=context();const old=stageMixtureAction({...c,expansion:undefined,request:{type:'mix',inputs,process:'steep'}});c.owner=old.state;c.inventory=old.inventory;const p=Object.values(c.owner.products)[0];
    const original=structuredClone(c.owner);validateProductAppearanceEnvelope(envelope(c));assert.deepEqual(c.owner,original);mix(c);assert.equal(c.expansion.productAppearances,undefined);
    mix(c,2);setProductAppearanceOwner(c.expansion.productAppearances);try{assert.equal(mixturePresentation(c.owner,p).name,'Steeped Village mixture');assert.equal(c.expansion.productAppearances.bindings[p.id],undefined);}finally{setProductAppearanceOwner(null);}
    const {projectFieldcraftItemView}=await import('../src/nethack_fieldcraft_item_view.js');assert.deepEqual(projectFieldcraftItemView('Unmarked pale vial',c.expansion),{name:'Unmarked pale vial',description:'',identified:false,charge:1});
});
test('full old-save loader preserves absent appearance owner; invalid owner rejected at preflight',()=>{
    // Minimal supported legacy envelope from the actual save validator contract.
    const save={'game version':'v0.6.4',character:{name:'TEST FIXTURE PROCGEN GX5 old',money:0,xp:{total_xp:0},equipment:{}},locations:{Village:{}},'current time':{year:1,month:1,day:1,hour:8,minute:0},'current location':'Village',levels:{person:{main_character:{total_xp:0,skill_xp:{}}}},inventories:{person:{main_character:{}}},availabilities:{},npcs:{}};
    const restored=validateSaveEnvelope(save,'v0.6.4');assert.equal(restored.expansion?.productAppearances,undefined);
    const c=context();mix(c);const withOwner={...save,...envelope(c),character:save.character};validateSaveEnvelope(withOwner,'v0.6.4');withOwner.expansion.productAppearances.revision=999;assert.throws(()=>validateSaveEnvelope(withOwner,'v0.6.4'),/appearance pool/);
});
