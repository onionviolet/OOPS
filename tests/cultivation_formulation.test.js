import test from 'node:test';
import assert from 'node:assert/strict';
import {frontierCatalogue as cat,frontierLayeredLaw as law} from '../src/craft_content_frontier.js';
import {generateMaterial} from '../src/craft_materials.js';
import {resolveBatch,validateBatchProduct} from '../src/craft_resolver.js';
import {freezeMaterials,createCraftState} from '../src/craft_state.js';
import {materialKey,quoteCrafting,stageCrafting,validateOwner,freshDepth} from '../src/crafting_frontier_runtime.js';
const herb=generateMaterial(cat,'reedherb',{root:4,scope:'village',index:0}).value;
const salt=generateMaterial(cat,'riversalt',{root:4,scope:'village',index:0}).value;
const inputs=[herb,salt].map(material=>({material,qty:1}));
const brew=(order,heat=4,control=0)=>resolveBatch(law,{inputs,order,control,process:[{op:'heat',level:heat}]}).product;
test('directional herbs, heat residue, ingredient tier and complexity retain independent lawful provenance',()=>{
 const a=brew([salt.id,herb.id]),b=brew([herb.id,salt.id]);
 assert.notEqual(a.id,b.id);assert.ok(a.outputs.oral.health>b.outputs.oral.health);assert.ok(a.outputs.oral.poison<b.outputs.oral.poison);
 const hot=brew([salt.id,herb.id],10),controlled=brew([salt.id,herb.id],10,60);
 assert.equal(hot.thermal.residual,6);assert.equal(controlled.thermal.residual,0);assert.ok(hot.thermal.impurity>0);assert.equal(controlled.thermal.impurity,0);
 assert.equal(hot.thermal.grade,2);assert.equal(hot.thermal.tier,controlled.thermal.tier);assert.equal(hot.thermal.grade,controlled.thermal.grade);
 for(const p of [a,b,hot,controlled]){assert.equal(Object.values(p.composition).reduce((a,b)=>a+b,0),p.mass);validateBatchProduct(law,JSON.parse(JSON.stringify(p)),{[herb.id]:herb,[salt.id]:salt});}
 const bad=structuredClone(hot);bad.thermal.impurity++;assert.throws(()=>validateBatchProduct(law,bad,{[herb.id]:herb,[salt.id]:salt}),/disagrees/);
});
test('native formulation uses paid fuel and actual maker control, stale control quote refuses without mutation',()=>{
 const owner=freezeMaterials(createCraftState({world:'base.frontier',life:0}),cat,[herb,salt]),hk=materialKey(herb,50),sk=materialKey(salt,50),fuel=JSON.stringify({id:'Charcoal'});
 const inventory={[hk]:2,[sk]:2,[fuel]:1},context={world:'base.frontier',location:'Village',clock:0,root:4,mind:60},request={type:'craft',layered:true,inputs:[{key:sk,qty:1},{key:hk,qty:1}],process:[{op:'heat',level:10}]};
 assert.equal(quoteCrafting(owner,{...inventory,[fuel]:0},request,context).eligible,false);
 const q=quoteCrafting(owner,inventory,request,context);assert.equal(q.eligible,true);
 assert.throws(()=>stageCrafting(owner,inventory,q,{...context,mind:0}),/quote changed/);
 const p=stageCrafting(owner,inventory,q,context);assert.ok(p.items.some(i=>i.key===fuel&&i.amount===-1));assert.equal(p.batch.product.thermal.control,60);validateOwner(JSON.parse(JSON.stringify(p.state)));
 assert.deepEqual(inventory,{[hk]:2,[sk]:2,[fuel]:1},'pure planning has no native mutation');
});

import {frontierTabletLaw} from '../src/craft_content_frontier.js';
import {consumeTablet,startTreatment,finishTreatment,validateTreatment,bodyKey} from '../src/craft_body_treatment.js';
test('tablets condition the actual body and consume a separate residue budget; funded soaks settle once',()=>{
 const product=resolveBatch(frontierTabletLaw,{inputs:[inputs[0]],process:[{op:'heat',level:2}],order:[herb.id],control:0}).product;
 const c={clock:100,body:{id:'original',instanceId:'body-1',form:'human'}},t=consumeTablet(undefined,product,c);
 assert.ok(t.gain>0);assert.equal(t.body.impurity,t.residue);assert.equal(t.body.binding,bodyKey(c));validateTreatment(t.body);
 const loaded=JSON.parse(JSON.stringify(t.body));assert.deepEqual(loaded,t.body);
 assert.throws(()=>consumeTablet({...loaded,impurity:20},product,c),/capacity/);
 const fitted=startTreatment(loaded,'apparatus',c);assert.deepEqual(fitted.spend,{id:'Iron ingot',count:2});
 const purge=startTreatment({...fitted.body,impurity:12},'purge',c);assert.deepEqual(purge.spend,{id:'Charcoal',count:2});
 assert.equal(finishTreatment(purge.body,{...c,clock:111}).impurity,12);
 const done=finishTreatment(purge.body,{...c,clock:112});assert.equal(done.impurity,7);assert.equal(done.job,null);assert.deepEqual(finishTreatment(done,{...c,clock:150}),done);
 const cap=startTreatment(done,'capacity',{...c,clock:112});assert.equal(finishTreatment(cap.body,{...c,clock:136}).capacity,25);
 const newBody=consumeTablet(done,product,{...c,body:{id:'replacement'}}).body;assert.equal(newBody.conditioning,t.gain);assert.equal(newBody.impurity,t.residue,'replacement receives its own dose, no old body residue');
});

import {treatmentCapacity,freshTreatment,treatmentNow} from '../src/craft_body_treatment.js';
import {fresh as freshPledges,trialView,attempt} from '../src/pledges.js';
test('body channels require matched earned conditioning, settle once, change medicinal capacity and actual breakthrough risk',()=>{
 const c={clock:100,body:{id:'native.player.body',instanceId:'one',form:'human'},temperingStage:1},b={...freshTreatment(c),conditioning:20,apparatus:1,impurity:12};
 assert.throws(()=>startTreatment({...b,conditioning:19},'channel',c),/conditioning 20/);assert.throws(()=>startTreatment(b,'channel',{...c,temperingStage:0}),/stage 1/);
 const pending=startTreatment(b,'channel',c);assert.deepEqual(pending.spend,{id:'Iron ingot',count:2});assert.equal(finishTreatment(pending.body,{...c,clock:123}).channels,undefined);
 const done=finishTreatment(JSON.parse(JSON.stringify(pending.body)),{...c,clock:124});assert.equal(done.channels,1);assert.equal(treatmentCapacity(done),22);assert.deepEqual(finishTreatment(done,{...c,clock:180}),done);
 const purge=startTreatment(done,'purge',{...c,clock:124});assert.equal(purge.body.job.due,134);assert.equal(finishTreatment(purge.body,{...c,clock:134}).impurity,2);
 const replacement=treatmentNow(done,{...c,body:{id:'native.player.body',instanceId:'two'}});assert.equal(replacement.channels||0,0);assert.equal(treatmentCapacity(replacement),20);
 const s=freshPledges(),skills={combat:3,equilibrium:0,persistence:0},base=trialView(s,skills),supported=trialView(s,{...skills,channels:1});assert.ok(supported.risk<base.risk);assert.equal(attempt(s,{roll:999,units:0,skills:{...skills,channels:1}}).risk,supported.risk,'shown and resolved trial use identical channel stability');
 validateTreatment(done);assert.throws(()=>validateTreatment({...done,channels:4}),/budget/);
});
import {craftedExposure,validateCraftedExposure,EFFECT_ID} from '../src/crafting_frontier_runtime.js';
test('channel poison control has an actual exposure consumer, while old revision-two exposures keep their law',()=>{
 const product=brew([herb.id,salt.id]);assert.ok(product.outputs.oral.poison>0);const old=craftedExposure(product,10,{poison:800},2),controlled=craftedExposure(product,10,{poison:800},3);
 assert.ok(Math.abs(controlled.effects.stats.health_loss_flat.flat)<Math.abs(old.effects.stats.health_loss_flat.flat));assert.ok(Math.abs(controlled.effects.stats.health_loss_flat.flat-old.effects.stats.health_loss_flat.flat*.8)<1e-12);
 validateCraftedExposure(JSON.parse(JSON.stringify(old)),product,EFFECT_ID);validateCraftedExposure(JSON.parse(JSON.stringify(controlled)),product,EFFECT_ID);
});

import {tabletConsequence} from '../src/craft_body_treatment.js';
import {recordProduct,observe} from '../src/craft_state.js';
import {keyForProduct} from '../src/craft_product_registry.js';
import {BATCH_FAMILY} from '../src/craft_resolver.js';
test('recipient tempering and accumulated unpurged load change tablet stress, paid purge eases the next dose',()=>{
 const strong=generateMaterial(cat,'reedherb',{root:7,scope:'village',index:0}).value;
 const p=resolveBatch(frontierTabletLaw,{inputs:[{material:strong,qty:1}],process:[{op:'heat',level:2}],order:[strong.id]}).product;
 const c={clock:100,body:{id:'recipient'},temperingStage:0},b={...freshTreatment(c),apparatus:1,impurity:10};
 const clean=tabletConsequence(undefined,p,c),loaded=tabletConsequence(b,p,c),tempered=tabletConsequence(b,p,{...c,temperingStage:3});
 assert.equal(loaded.load,2);assert.equal(loaded.residue,clean.residue+2);assert.ok(tempered.residue<loaded.residue);assert.equal(tempered.gain,loaded.gain);
 const before=structuredClone(b),pending=startTreatment(b,'purge',c);assert.equal(tabletConsequence(pending.body,p,c).load,2);
 const done=finishTreatment(JSON.parse(JSON.stringify(pending.body)),{...c,clock:112});assert.equal(tabletConsequence(done,p,c).load,1);assert.deepEqual(b,before);
 assert.equal(tabletConsequence(b,p,{...c,body:{id:'new'}}).load,0);assert.throws(()=>consumeTablet({...b,impurity:20},p,c),/capacity/);
});
test('observed tablet quote predicts exact dose, with hidden effects protected and stale recipient/load rejected',()=>{
 const p=resolveBatch(frontierTabletLaw,{inputs:[inputs[0]],process:[{op:'heat',level:2}],order:[herb.id]}).product;
 let owner=recordProduct(freezeMaterials(createCraftState({world:'base.frontier',life:0}),cat,[herb]),p);
 const key=keyForProduct(BATCH_FAMILY,p),inventory={[key]:3},request={type:'use',key};
 const depth={...freshDepth(),body:{...freshTreatment({}),impurity:5}},c={world:'base.frontier',location:'Village',clock:100,temperingStage:0,depth};
 assert.equal(quoteCrafting(owner,inventory,request,c).treatment,undefined);
 owner=observe(owner,'player',p.id,['effect:permanent.conditioning'],99);
 const q=quoteCrafting(owner,inventory,request,c),before=JSON.stringify({owner,inventory,depth});assert.ok(q.treatment);
 const plan=stageCrafting(owner,inventory,q,c,depth);assert.equal(plan.depth.body.impurity,5+q.treatment.residue);assert.equal(plan.depth.body.conditioning,q.treatment.gain);assert.deepEqual(plan.items,[{key,amount:-1}]);assert.match(plan.outcome.text,/unpurged load/);
 assert.throws(()=>stageCrafting(owner,inventory,q,{...c,temperingStage:1},depth),/quote changed/);
 assert.throws(()=>stageCrafting(owner,inventory,q,c,{...depth,body:{...depth.body,impurity:6}}),/quote changed/);
 assert.equal(JSON.stringify({owner,inventory,depth}),before);validateOwner(JSON.parse(JSON.stringify(plan.state)));validateTreatment(JSON.parse(JSON.stringify(plan.depth.body)));
 const blocked=quoteCrafting(owner,inventory,request,{...c,depth:{...depth,body:{...depth.body,impurity:20}}});assert.equal(blocked.eligible,false);assert.ok(blocked.treatment);assert.match(blocked.reason,/capacity/);
});

import {validateFiring,FIRING_MINUTES} from '../src/crafting_frontier_runtime.js';
test('timed brazier custody consumes exact inputs once, survives serialization and yields distinct late chemistry',()=>{
 const owner=freezeMaterials(createCraftState({world:'base.frontier',life:0}),cat,[herb]);
 const hk=materialKey(herb,50),fuel=JSON.stringify({id:'Charcoal'}),inventory={[hk]:3,[fuel]:3},depth=freshDepth();
 const c={world:'base.frontier',location:'Village',clock:100,mind:0,depth},request={type:'begin_firing',layered:true,tablet:true,inputs:[{key:hk,qty:1}],process:[{op:'heat',level:2}]};
 const begin=stageCrafting(owner,inventory,quoteCrafting(owner,inventory,request,c),c,depth);
 assert.deepEqual(begin.items,[{key:fuel,amount:-1},{key:hk,amount:-1}]);assert.equal(begin.batch,null);assert.ok(!begin.items.some(x=>x.amount>0));
 const saved=JSON.parse(JSON.stringify({owner:begin.state,depth:begin.depth}));validateOwner(saved.owner);validateFiring(saved.depth.firing,saved.owner,100);
 assert.equal(quoteCrafting(saved.owner,inventory,{type:'collect_firing'},{...c,depth:saved.depth}).eligible,false);
 assert.equal(quoteCrafting(saved.owner,inventory,request,{...c,depth:saved.depth}).eligible,false);
 const collect=clock=>{const ctx={...c,depth:saved.depth,clock},q=quoteCrafting(saved.owner,inventory,{type:'collect_firing'},ctx);return stageCrafting(saved.owner,inventory,q,ctx,saved.depth);};
 const ontime=collect(100+FIRING_MINUTES),late=collect(100+FIRING_MINUTES+4);assert.equal(ontime.depth.firing,undefined);assert.equal(ontime.items.length,1);assert.equal(ontime.items[0].amount,1);
 assert.deepEqual(quoteCrafting(saved.owner,inventory,{type:'collect_firing'},{...c,depth:saved.depth,clock:110}).firing,late.batch.product.thermal);assert.notEqual(ontime.batch.product.id,late.batch.product.id);assert.ok(late.batch.product.thermal.impurity>ontime.batch.product.thermal.impurity);assert.ok(late.batch.product.outputs.permanent.conditioning<ontime.batch.product.outputs.permanent.conditioning);
 for(const result of [ontime,late]){assert.equal(result.batch.product.mass,1000);validateOwner(JSON.parse(JSON.stringify(result.state)));assert.equal(quoteCrafting(result.state,inventory,{type:'collect_firing'},{...c,depth:result.depth,clock:110}).eligible,false);}
 const ctx={...c,depth:saved.depth},abandon=stageCrafting(saved.owner,inventory,quoteCrafting(saved.owner,inventory,{type:'abandon_firing'},ctx),ctx,saved.depth);assert.deepEqual(abandon.items,[]);assert.equal(abandon.depth.firing,undefined);assert.match(abandon.outcome.text,/waste/);
 assert.throws(()=>validateFiring({...saved.depth.firing,product:'missing'},saved.owner,100),/retained/);assert.throws(()=>validateFiring({...saved.depth.firing,due:999},saved.owner,100),/Invalid/);assert.throws(()=>validateFiring(saved.depth.firing,saved.owner,99),/calendar/);
 assert.deepEqual(inventory,{[hk]:3,[fuel]:3});assert.equal(owner.products[saved.depth.firing.product],undefined,'planning leaves original owner unchanged');
});
