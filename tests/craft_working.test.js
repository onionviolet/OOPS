import test from 'node:test';
import assert from 'node:assert/strict';
import {defineCatalogue} from '../src/craft_materials.js';
import {defineCraftLaw} from '../src/craft_resolver.js';
import {compileCraftWorking,craftOperationDictionary} from '../src/craft_working.js';
import {createCraftState,learnCraftWorking,readCraftWorking,recordWorkingTrial,validateCraftState} from '../src/craft_state.js';

const catalogue=defineCatalogue({id:'trial.surface',revision:1,tags:[],
    axes:['plain','marked','bound'].map(id=>({id,kind:'fraction'})),
    materials:[{id:'blank',revision:1,tags:[],phase:'solid',properties:{plain:1000}}]});
const convert=(id,from,to)=>({id,converts:[{from,to,permille:1000}]});
const lawFor=(id,from)=>defineCraftLaw({id,revision:1,catalogue,
    ops:[convert('mark','plain','marked'),convert('bind',from,'bound')],
    outputs:[{id:'bound',route:'test',effect:'strength',axis:'bound',per:100}]});
const iron=JSON.stringify({id:'Test blank A'}), newer=JSON.stringify({id:'Test blank B'});

test('an unnamed working can change one step, then rebind to new carried stock',()=>{
    const law=lawFor('trial.mark-before-bind','marked'), world='trial.surface';
    const working={id:'maker.first-trial',revision:1,world,law:law.ref,
        slots:[{id:'body',role:'base',select:{material:'blank'}}],steps:[{op:'bind',level:1}]};
    const run=(w,key)=>compileCraftWorking(w,{world,law,stock:{[key]:1},lots:[{key,qty:1}],
        materialForKey:()=>catalogue.materials.blank,stations:[]});
    assert.equal(run(working,iron).batch.product.composition.bound,0);
    const revised={...working,steps:[{op:'mark',level:1},...working.steps]};
    const trial=run(revised,iron);
    const effect={route:'test',effect:'strength'}, observer='maker';
    const witness={...effect,observer,product:trial.batch.product.id};
    const blankState=createCraftState({world});
    const unwitnessed=recordWorkingTrial(blankState,trial.batch.product,{observer,at:1,effects:[]});
    assert.throws(()=>learnCraftWorking(unwitnessed,law,trial.working,witness),/witnessed useful/);
    const recorded=recordWorkingTrial(unwitnessed,trial.batch.product,{observer,at:2,effects:[effect]});
    assert.throws(()=>learnCraftWorking(recorded,law,working,witness),/different working/);
    const learned=learnCraftWorking(recorded,law,trial.working,witness);
    const registry={catalogues:{[catalogue.ref]:catalogue},laws:{[law.ref]:law}};
    const restored=validateCraftState(JSON.parse(JSON.stringify(learned)),registry);
    const saved=readCraftWorking(restored,working.id,observer);
    assert.equal(readCraftWorking(restored,working.id,'other-maker'),null);
    const forged=structuredClone(restored);
    forged.recipes[working.id].witness.fact='effect:test.unseen';
    assert.throws(()=>validateCraftState(forged,registry),/witnessed useful/);
    const result=run(saved,newer);
    assert.equal(result.batch.product.composition.bound,1000);
    assert.deepEqual(result.consumed,[{input:0,key:newer,material:'blank',qty:1}]);
    assert.equal(JSON.stringify(saved).includes(newer),false);
    assert.deepEqual(craftOperationDictionary(law).map(row=>row.id),['mark','bind']);
});

test('the same operation names execute a different local law and cannot bypass stock custody',()=>{
    const law=lawFor('trial.bind-plain','plain'),world='trial.other-surface';
    const working={id:'maker.second-trial',revision:1,world,law:law.ref,
        slots:[{id:'body',role:'base',select:{material:'blank'}}],steps:[{op:'bind',level:1}]};
    const context={world,law,stock:{[iron]:1},lots:[{key:iron,qty:1}],materialForKey:()=>catalogue.materials.blank,stations:[]};
    assert.equal(compileCraftWorking(working,context).batch.product.composition.bound,1000);
    assert.throws(()=>compileCraftWorking({...working,world:'trial.surface'},context),/different version/);
    assert.throws(()=>compileCraftWorking(working,{...context,lots:[...context.lots,...context.lots]}),/no longer available/);
    assert.throws(()=>compileCraftWorking({...working,steps:[{op:'invented',level:1}]},context),/unavailable/);
});

test('mixes versioned parts with direct operations and saves the expanded method',()=>{
    const law=lawFor('trial.composed','marked'),world='trial.surface';
    const parts=[{id:'prepare-face',revision:1,law:law.ref,steps:[{op:'mark',level:1}]}];
    const working={id:'maker.mixed',revision:1,world,law:law.ref,
        slots:[{id:'body',role:'base',select:{material:'blank'}}],
        steps:[{part:'prepare-face',revision:1},{op:'bind',level:1}]};
    const context={world,law,stock:{[iron]:1},lots:[{key:iron,qty:1}],
        materialForKey:()=>catalogue.materials.blank,stations:[],parts};
    const result=compileCraftWorking(working,context);
    assert.equal(result.batch.product.composition.bound,1000);
    assert.deepEqual(result.working.steps,[{op:'mark',level:1},{op:'bind',level:1}]);
    assert.deepEqual(compileCraftWorking(result.working,{...context,parts:[]}).batch,result.batch);
    assert.throws(()=>compileCraftWorking(working,{...context,parts:[{...parts[0],revision:2}]}),/unavailable/);
});

test('mixes different physical parts against role selectors and keeps retained stock separate',()=>{
    const tags=['body','edge','fixture'].map(id=>({id,kind:'origin',parents:[],revision:1}));
    const materials=[
        {id:'wood',tags:['body'],properties:{wood:1000}},
        {id:'iron',tags:['edge'],properties:{metal:1000}},
        {id:'bronze',tags:['edge'],properties:{metal:500}},
        {id:'jig',tags:['fixture'],properties:{}}
    ].map(row=>({...row,revision:1,phase:'solid'}));
    const cat=defineCatalogue({id:'trial.parts',revision:1,tags,materials,
        axes:['wood','metal','joined'].map(id=>({id,kind:'fraction'}))});
    const law=defineCraftLaw({id:'trial.join-parts',revision:1,catalogue:cat,ops:[{id:'fit'}],
        reactions:[{id:'fit-parts',after:'fit',catalyst:'fixture',
            reactants:{wood:1,metal:1},products:{joined:2}}]});
    const world='trial.parts';
    const working={id:'maker.fit',revision:1,world,law:law.ref,steps:[{op:'fit',level:1}],
        slots:[{id:'grip',role:'base',select:{tags:'body'}},{id:'edge',role:'base',select:{tags:'edge'}},
            {id:'support',role:'catalyst',select:{tags:'fixture'}}]};
    const key=id=>JSON.stringify({id});
    const stock=Object.fromEntries(materials.map(({id})=>[key(id),1]));
    const run=edge=>compileCraftWorking(working,{world,law,stock,stations:[],
        lots:[{key:key('wood'),qty:1},{key:key(edge),qty:1},{key:key('jig'),qty:1,role:'catalyst'}],
        materialForKey:key=>cat.materials[JSON.parse(key).id]});
    const ironFit=run('iron'), bronzeFit=run('bronze');
    assert.deepEqual(ironFit.consumed.map(row=>row.key),[key('wood'),key('iron')]);
    assert.deepEqual(ironFit.retained.map(row=>row.key),[key('jig')]);
    assert.equal(ironFit.batch.product.composition.joined,2000);
    assert.equal(bronzeFit.batch.product.composition.joined,1000);
});

test('Hogwarts and Cyoria bind different local laws to existing item keys',async()=>{
    const {bookCraftWorkshops,quoteBookCraftWorking,readBookCraftVocabulary}=await import('../src/book_craft_workings.js');
    for(const [world,workshop] of Object.entries(bookCraftWorkshops)){
        const hp=world==='book.hp.school.world';
        const [body,support]=Object.keys(workshop.materials);
        const working={id:'maker.book-trial',revision:1,world,law:workshop.law.ref,
            slots:[{id:'body',role:'base',select:{material:workshop.materials[body].id}},
                {id:'support',role:hp?'catalyst':'base',select:{material:workshop.materials[support].id}}],
            steps:[]};
        const context={world,location:workshop.location,inventory:{[body]:1,[support]:1}};
        const lots=[{key:body,qty:1},{key:support,qty:1,role:hp?'catalyst':'consumed'}];
        const run=operations=>quoteBookCraftWorking({...working,steps:operations.map(op=>({op,level:1}))},context,lots);
        const failed=run(hp?['join']:['prepare','anchor','inscribe']);
        const worked=run(hp?['align','join']:['prepare','inscribe','anchor']);
        assert.deepEqual(failed.batch.product.outputs,{});
        assert.deepEqual(worked.batch.product.outputs,hp?{fit:{'whole-pane':1}}:{inspect:{'anchored-trace':1}});
        const vocabulary=readBookCraftVocabulary(context);
        assert.deepEqual(vocabulary.stock,lots.map(({key,qty,role='consumed'})=>({
            key,qty,role,material:workshop.materials[key].id
        })));
        const [{id,revision}]=vocabulary.parts;
        const assembled=quoteBookCraftWorking({...working,steps:[{part:id,revision},
            {op:hp?'join':'anchor',level:1}]},context,lots);
        assert.deepEqual(assembled.working,worked.working);
        assert.deepEqual(assembled.batch.product.outputs,worked.batch.product.outputs);
        assert.equal(readBookCraftVocabulary({...context,location:'elsewhere'}),null);
        assert.equal(worked.retained.length,hp?1:0);
        assert.equal(worked.consumed.length,hp?1:2);
        assert.throws(()=>quoteBookCraftWorking(worked.working,{...context,location:'elsewhere'},lots),/Go to the workshop/);
    }
});

test('paid book trials settle and replay, with atomic rollback across materials, means and memory',async()=>{
    const {bookCraftWorkshops}=await import('../src/book_craft_workings.js');
    const {quoteBookCraftTrial,settleBookCraftTrial}=await import('../src/book_craft_transaction.js');
    const {validateOwner}=await import('../src/crafting_frontier_runtime.js');
    for(const [world,workshop] of Object.entries(bookCraftWorkshops)){
        const hogwarts=world==='book.hp.school.world';
        const [body,support]=Object.keys(workshop.materials);
        const inventory={[body]:3,[support]:hogwarts?1:3};
        const means={amount:6};
        let owner=null, denySave=true;
        const native={
            read:()=>({world,location:workshop.location,clock:15,inventory}),
            quoteMeans:()=>({eligible:means.amount>0,cost:1}),
            meansBindings:()=>[],itemOwners:()=>[inventory,means],
            getCraftState:()=>owner,setCraftState:state=>{owner=state;},
            assertSpend:key=>assert.ok(inventory[key]>0),
            spendMeans:quote=>{means.amount-=quote.cost;},
            removeItem:(key,qty)=>{inventory[key]-=qty;},
            publishResult:({key})=>{inventory[key]=(inventory[key]??0)+1;},
            persist:durable=>{if(denySave)throw Error('Write denied');validateOwner(owner);durable();}
        };
        const lots=[{key:body,qty:1},{key:support,qty:1,role:hogwarts?'catalyst':'consumed'}];
        const working={id:'maker.paid',revision:1,world,law:workshop.law.ref,
            slots:lots.map(({key,role},i)=>({id:'slot-'+i,role:role==='catalyst'?'catalyst':'base',
                select:{material:workshop.materials[key].id}}))};
        const design=ops=>({...working,steps:ops.map(op=>({op,level:1}))});
        const good=design(hogwarts?['align','join']:['prepare','inscribe','anchor']);
        const before=structuredClone(inventory);
        const quote=quoteBookCraftTrial(good,lots,native);
        assert.equal(Object.hasOwn(quote,'product'),false);
        assert.throws(()=>settleBookCraftTrial(quote,native,{learn:true}),/Write denied/);
        assert.deepEqual(inventory,before);
        assert.equal(means.amount,6);
        assert.equal(owner,null);
        denySave=false;
        const bad=design(hogwarts?['join']:['prepare','anchor','inscribe']);
        assert.equal(settleBookCraftTrial(quoteBookCraftTrial(bad,lots,native),native,{learn:true}).success,false);
        assert.equal(readCraftWorking(owner,working.id,'player'),null);
        assert.equal(inventory[workshop.result.key],undefined);
        assert.equal(settleBookCraftTrial(quoteBookCraftTrial(good,lots,native),native,{learn:true}).learned,true);
        owner=validateOwner(JSON.parse(JSON.stringify(owner)));
        const saved=readCraftWorking(owner,working.id,'player');
        assert.equal(settleBookCraftTrial(quoteBookCraftTrial(saved,lots,native),native).success,true);
        assert.equal(inventory[body],0);
        assert.equal(inventory[support],hogwarts?1:0);
        assert.equal(inventory[workshop.result.key],2);
        assert.equal(means.amount,3);
    }
});

test('school pane material history predicts opposing properties under the same saved method',async()=>{
    const {bookCraftWorkshops,fitsSchoolPaneUse,quoteBookCraftWorking,schoolPaneProperties,schoolPaneRefinementLaw:law}
        =await import('../src/book_craft_workings.js');
    const {validateOwner}=await import('../src/crafting_frontier_runtime.js');
    const world='book.hp.school.world',location=bookCraftWorkshops[world].location;
    const key=id=>JSON.stringify({id:'book.hp.school.'+id});
    const clear=key('glass_shards'),wired=key('wired_glass_shards'),wand=key('wand');
    const context={world,location,inventory:{[clear]:1,[wired]:1,[wand]:1}};
    const plan={id:'maker.pane-variants',revision:1,world,law:law.ref,slots:[
        {id:'glass',role:'base',select:{tags:'pane-stock'}},
        {id:'wand',role:'catalyst',select:{tags:'wand'}}],
        steps:[{part:'glass-preparation',revision:1},{op:'join',level:1}]};
    const quote=(working,key)=>quoteBookCraftWorking(working,context,[{key,qty:1},{key:wand,qty:1,role:'catalyst'}]);
    const first=quote(plan,clear);
    const effects=[{route:'fit',effect:'whole-pane'}];
    const state=recordWorkingTrial(createCraftState({world:'base.frontier'}),first.batch.product,{observer:'player',at:1,effects});
    const learned=learnCraftWorking(state,law,first.working,{observer:'player',product:first.batch.product.id,...effects[0]});
    const saved=readCraftWorking(validateOwner(JSON.parse(JSON.stringify(learned))),plan.id,'player');
    const second=quote(saved,wired);
    assert.deepEqual(first.working,second.working);
    assert.deepEqual(schoolPaneProperties(first.batch.product),{legibility:4,'fragment-retention':1});
    assert.deepEqual(schoolPaneProperties(second.batch.product),{legibility:2,'fragment-retention':4});
    assert.equal(fitsSchoolPaneUse(first.batch.product,'reading'),true);
    assert.equal(fitsSchoolPaneUse(second.batch.product,'reading'),false);
    assert.equal(fitsSchoolPaneUse(first.batch.product,'shielding'),false);
    assert.equal(fitsSchoolPaneUse(second.batch.product,'shielding'),true);
    assert.deepEqual(second.consumed.map(row=>row.key),[wired]);
    assert.deepEqual(second.retained.map(row=>row.key),[wand]);
});

test('settled comparisons keep physical lot history and batch scale through save validation',async()=>{
    const {compareTrials}=await import('../src/craft_experiment_log.js');
    const law=lawFor('trial.scale','marked'),world='trial.surface';
    const working={id:'maker.scaled',revision:1,world,law:law.ref,
        slots:[{id:'body',role:'base',select:{material:'blank'},qty:[1,2]}],
        steps:[{op:'mark',level:1},{op:'bind',level:1}]};
    const run=lots=>compileCraftWorking(working,{world,law,lots,stock:{[iron]:2,[newer]:1},
        materialForKey:()=>catalogue.materials.blank});
    const single=run([{key:iron,qty:1}]);
    const scaled=run([{key:iron,qty:1},{key:newer,qty:1}]);
    assert.deepEqual(single.working,scaled.working);
    assert.equal(scaled.batch.product.inputs.length,1,'the resolver groups equivalent material definitions');
    const record=(state,trial,at)=>recordWorkingTrial(state,trial.batch.product,{
        observer:'player',at,effects:[{route:'test',effect:'strength'}],setup:trial.setup,observation:{route:'test'}});
    const state=record(record(createCraftState({world}),single,1),scaled,2);
    const restore=raw=>validateCraftState(JSON.parse(JSON.stringify(raw)),{
        laws:{[law.ref]:law},catalogues:{[catalogue.ref]:catalogue}});
    const [before,after]=restore(state).workingTrials.player.entries;
    assert.deepEqual(after.setup.inputs.map(({key})=>key),[iron,newer]);
    assert.deepEqual(compareTrials(before,after).changed.map(({field})=>field),['inputs','conditions.consumedUnits']);
    const tampered=structuredClone(state);
    tampered.workingTrials.player.entries[1].setup.inputs[1].qty=2;
    assert.throws(()=>restore(tampered),/does not match the resolved batch/);
});

test('a local rule reads immutable preparation history without changing the saved method',async()=>{
    const {planProcessedMaterial,readMaterialLineage}=await import('../src/material_lineage.js');
    const {compareTrials}=await import('../src/craft_experiment_log.js');
    const world='trial.surface',raw=JSON.stringify({id:'Unprepared test blank'});
    const processBlank=id=>planProcessedMaterial({
        stock:{[raw]:1},inputs:[{item_key:raw,count:1}],
        output:{id:'Prepared test blank',family:'blank',count:1},
        process:{id,revision:1,at:1,world_id:world,parameters:{}}
    }).item_key;
    const rinsed=processBlank('rinse'),etched=processBlank('etch');
    const local=defineCatalogue({id:'trial.prepared-surface',revision:1,
        tags:[{id:'blank',kind:'origin',revision:1,parents:[]}],
        axes:['plain','marked','bound'].map(id=>({id,kind:'fraction'})),
        materials:[
            {id:'rinsed',revision:1,tags:['blank'],phase:'solid',properties:{plain:1000}},
            {id:'etched',revision:1,tags:['blank'],phase:'solid',properties:{marked:1000}}
        ]});
    const law=defineCraftLaw({id:'trial.surface-history',revision:1,catalogue:local,
        ops:[convert('bind','marked','bound')],
        outputs:[{id:'strength',route:'test',effect:'strength',axis:'bound',per:100}]});
    const method={id:'maker.history',revision:1,world,law:law.ref,
        slots:[{id:'surface',role:'base',select:{tags:'blank'}}],steps:[{op:'bind',level:1}]};
    const run=key=>compileCraftWorking(method,{world,law,stock:{[key]:1},lots:[{key,qty:1}],
        materialForKey:(_key,lineage)=>local.materials[lineage.history[0].process_id==='etch'?'etched':'rinsed']});
    const a=run(rinsed),b=run(etched);
    assert.deepEqual(a.working,b.working);
    assert.equal(a.batch.product.composition.bound,0);
    assert.equal(b.batch.product.composition.bound,1000);
    const record=(state,trial,at,effects)=>recordWorkingTrial(state,trial.batch.product,{
        observer:'player',at,effects,setup:trial.setup,observation:{route:'test'}});
    const state=record(record(createCraftState({world}),a,2,[]),b,3,[{route:'test',effect:'strength'}]);
    const restore=rawState=>validateCraftState(JSON.parse(JSON.stringify(rawState)),{
        laws:{[law.ref]:law},catalogues:{[local.ref]:local}});
    const [before,after]=restore(state).workingTrials.player.entries;
    assert.deepEqual(compareTrials(before,after).changed.map(({field})=>field),['inputs']);
    assert.equal(readMaterialLineage(after.setup.inputs[0].key).history[0].inputs[0].item_key,raw);
    const bad=JSON.parse(etched);
    bad.lineage.history[0].revision=0;
    assert.throws(()=>run(JSON.stringify(bad)),/Invalid process revision/);
    const corrupted=structuredClone(state);
    corrupted.workingTrials.player.entries[1].setup.inputs[0].key=JSON.stringify(bad);
    assert.throws(()=>restore(corrupted),/Invalid process revision/);
});
