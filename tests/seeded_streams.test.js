import test from 'node:test';
import assert from 'node:assert/strict';
import {loadNative} from './helpers/native_loader.mjs';
import {beginNativeCraftTransaction} from '../src/native_craft_transaction.js';
import {createExpansionState, loadExpansionState} from '../src/expansion_engine.js';
import {createStreams, ensureStreams, drawUnit, keyedUnit, unitDecision, rollChance, rollInt, rollTable, validateStreams, scopedStream, STREAMS, seededRecipe, validateNativeEncounter, streamSeed} from '../src/seeded_streams.js';
import {createMixtureState} from '../src/mixture_state.js';
import {createGeneratedPeople} from '../src/generated_people.js';

// seeded_streams: original fixture scope retained.
{
const clone=x=>JSON.parse(JSON.stringify(x));
const state=seed=>{const s=createExpansionState(seed);ensureStreams(s);return s;};

test('same seed and decision order replay across all native system streams',()=>{
    const a=state(1234),b=state(1234);
    for(let i=0;i<50;i++)for(const name of Object.values(STREAMS)) {
        const stream=scopedStream(name);
        assert.equal(drawUnit(a,stream,`decision:${i}`),drawUnit(b,stream,`decision:${i}`));
    }
    assert.deepEqual(a,b);assert.equal(a.rng,1234);
});
test('shop/craft/gather draws cannot shift combat, lineup or loot, including keyed order changes',()=>{
    const a=state(98),b=state(98);
    for(let i=0;i<200;i++)for(const name of [STREAMS.market,STREAMS.craft,STREAMS.gather,STREAMS.reward])drawUnit(a,scopedStream(name),`${i}`);
    for(const name of [STREAMS.encounter,STREAMS.combat,STREAMS.loot])for(let i=0;i<30;i++) {
        assert.equal(drawUnit(a,scopedStream(name),`${i}`),drawUnit(b,scopedStream(name),`${i}`));
        assert.equal(keyedUnit(a,scopedStream(name),`frog#17:${i}`),keyedUnit(b,scopedStream(name),`frog#17:${i}`));
    }
    assert.equal(keyedUnit(a,scopedStream(STREAMS.market),'trader:epoch42'),keyedUnit(b,scopedStream(STREAMS.market),'trader:epoch42'));
});
test('save/restore resumes next draws and old expansion saves derive a deterministic root without changing legacy RNG',()=>{
    const a=state(357);for(let i=0;i<19;i++)drawUnit(a,'reward@base.frontier','task');
    const saved=clone(a),b=loadExpansionState(saved);ensureStreams(b);
    assert.deepEqual(b,a);
    for(let i=0;i<30;i++)assert.equal(drawUnit(a,'reward@base.frontier','task'),drawUnit(b,'reward@base.frontier','task'));
    const old=createExpansionState(2222),snapshot=clone(old),left=loadExpansionState(old),right=loadExpansionState(clone(old));
    ensureStreams(left);ensureStreams(right);assert.deepEqual(old,snapshot);assert.equal(left.rng,2222);
    assert.deepEqual(left.streams,right.streams);assert.deepEqual(left.streams.cells,{});
    assert.equal(drawUnit(left,'gather@base.frontier','first'),drawUnit(right,'gather@base.frontier','first'));
    const noSeedA=createExpansionState(19),noSeedB=createExpansionState(71);
    ensureStreams(noSeedA,1);ensureStreams(noSeedB,1);
    assert.deepEqual(noSeedA.streams,noSeedB.streams);assert.equal(noSeedA.rng,19);assert.equal(noSeedB.rng,71);
});
test('decisions are pure, integer ports keep legacy rounding, zero/one chances and tables are explicit',()=>{
    const s=createStreams(123),before=clone(s);
    const u=unitDecision(s,'loot@base.frontier','hide').value;
    assert.equal(rollChance(s,'loot@base.frontier','hide',0).hit,false);
    assert.equal(rollChance(s,'loot@base.frontier','hide',1).hit,true);
    assert.equal(rollInt(s,'loot@base.frontier','hide',2,8).value,Math.round(2+u*6));
    assert.equal(rollInt(s,'loot@base.frontier','hide',2,8,{dist:'uniform'}).value,2+Math.floor(u*7));
    assert.equal(rollTable(s,'loot@base.frontier','hide',[0,1,0]).index,1);
    assert.deepEqual(s,before);assert.throws(()=>unitDecision(s,'typo','x'));
});
test('stream imports reject broken/newer state, preserve unknown cells and cap receipts without dropping counters',()=>{
    const a=state(1);a.streams.cells['future:unknown']={n:13,salt:0};validateStreams(a.streams);
    for(let i=0;i<600;i++)drawUnit(a,'reward@base.frontier','x');
    assert.equal(a.streams.log.length,32);assert.equal(a.streams.cells['reward@base.frontier'].n,600);
    const b=clone(a);assert.equal(drawUnit(a,'reward@base.frontier','x'),drawUnit(b,'reward@base.frontier','x'));
    for(const mutation of [s=>s.schema=2,s=>s.cells.foo={n:-1,salt:0},s=>s.root=NaN,s=>s.cells.foo={n:1,salt:-1}]) {
        const bad=clone(a.streams);mutation(bad);assert.throws(()=>validateStreams(bad));
    }
    assert.throws(()=>drawUnit(a,'future:unknown','x'));
});
test('commit-only recipe view preserves private methods and redirects internal result quality; original preview stays untouched',()=>{
    class Recipe {#private=4;quality_precision=4;get_availability(){return this.#private;}get_quality_range(){return [40,80];}
        roll_quality(){return 100;}getResult(){return {quality:this.roll_quality()};}}
    const original=new Recipe();let count=0;
    const view=seededRecipe(original,()=>{count++;return .2;});
    assert.equal(view.get_availability(),4);assert.equal(view.getResult().quality,48);
    assert.equal(count,1);assert.equal(original.getResult().quality,100);assert.equal(count,1);
});

test('failed native craft restores consumed stream state with the existing transaction',()=>{
    const s=state(88),before=clone(s.streams),transaction=beginNativeCraftTransaction({owners:[s.streams]});
    drawUnit(s,'craft','attempt');drawUnit(s,'craft','quality');
    assert.equal(transaction.rollback(),true);assert.deepEqual(s.streams,before);
});

// Bundle real native sites while replacing presentation/startup and timers.
// No gameplay modules or seeded decision implementation are mocked.
test('native lineup, loot, stock and pending fighter turns survive save/restore with Math.random forbidden',async()=>{
    const originalRandom=Math.random,originalDocument=globalThis.document,originalTimeout=globalThis.setTimeout;
    try {
        const m = await loadNative('export {character} from "./src/data/character.js"; export {locations} from "./src/data/locations.js"; export * from "./src/seeded_streams.js"; export {CombatZone} from "./src/models/location.js"; export {Enemy,enemy_templates} from "./src/enemies.js"; export {TraderComponent as Trader} from "./src/components/trader_component.js"; export {default as templates} from "./src/data/inventory_templates.js"; export {default as Combat} from "./src/models/combat.js";', {stubs: {game_stats: '{}', current_stance: '({id:"normal",stamina_cost:0})'}, presentation: /\/src\/(main|display|ui\/combat_display)\.js$/, prefix: 'p1-native-unit-'});let current=state(535);m.bindGameStreams(()=>current);
        Math.random=()=>{throw Error('unseeded gameplay draw');};
        globalThis.document={getElementById:()=>null};globalThis.setTimeout=()=>0;
        // Guardian bleed chance draws the saved combat stream, so a restored save replays it.
        const guardian=m.enemy_templates['Elite wolf rat guardian'],bleed=()=>{current=state(535);for(let i=0;i<40;i++)guardian.on_hit({});return clone(current);};
        const bleedA=bleed();assert.deepEqual(bleed(),bleedA);
        assert.equal(bleedA.streams.cells[scopedStream(STREAMS.combat)].n,40);
        const zone=new m.CombatZone({id:'test',name:'test',description:'test',enemies_list:['Starving wolf rat'],enemy_group_size:[2,4],enemy_stat_variation:.1});
        const start=clone(current),groupA=zone.get_next_enemies(),after=clone(current);
        current=clone(start);const groupB=zone.get_next_enemies();
        assert.deepEqual(groupA.map(e=>e.stats),groupB.map(e=>e.stats));assert.deepEqual(current,after);
        const lootA=groupA.map(e=>e.get_loot());current=clone(after);
        assert.deepEqual(groupB.map(e=>e.get_loot()),lootA);
        m.templates.test=[{canBeStarted:()=>true,items:[{canBeStarted:()=>true,item_name:'Stale bread',chance:1,count:[2,9]}]}];
        const trader=new m.Trader({name:'test trader',inventory_template:'test'});trader.fillInventoryFromTemplate({});
        const stock=Object.fromEntries(Object.entries(trader.getTradeInventory()).map(([k,v])=>[k,v.count]));
        trader.emptyInventory();current=clone(after);trader.fillInventoryFromTemplate({});
        assert.deepEqual(Object.fromEntries(Object.entries(trader.getTradeInventory()).map(([k,v])=>[k,v.count])),stock);
        const hero=new m.Enemy({...m.enemy_templates['Starving wolf rat'],stats:{...m.enemy_templates['Starving wolf rat'].stats}});hero.is_alive=true;hero.init();
        const combat=new m.Combat({attackers:[hero],defenders:groupA});combat.start();
        const saved=combat.snapshot('test');validateNativeEncounter(saved,'test');
        const settled=clone(saved);for(const e of settled.enemies){e.alive=false;e.full.health=0;}settled.loops={};
        validateNativeEncounter(settled,'test'); // Durable last-kill/clear boundary is valid.
        const beforeHit=groupA[0].getFullStats().health;
        combat.doCombatAction({fighter_index:0,is_attacker:true,target:groupA[0],attack_power:1,target_count:1});
        const resultHealth=groupA[0].getFullStats().health;
        groupA[0].getFullStats().health=beforeHit;
        const streamSave=clone(current);
        const restored=new m.Combat({attackers:[hero],defenders:groupA,savedEncounter:clone(saved)});restored.start();
        assert.deepEqual(restored.snapshot('test'),saved);assert.deepEqual(current,streamSave);
        restored.doCombatAction({fighter_index:0,is_attacker:true,target:groupA[0],attack_power:1,target_count:1});
        assert.equal(groupA[0].getFullStats().health,resultHealth,'next native hit damage replays');
        for(const mutate of [s=>s.enemies[0].full.health=-1,s=>s.turns.attackers=[-1],s=>s.loops['attackers:0'].count=70]) {
            const bad=clone(saved);mutate(bad);assert.throws(()=>validateNativeEncounter(bad,'test'));
        }
    } finally {Math.random=originalRandom;globalThis.document=originalDocument;globalThis.setTimeout=originalTimeout;}
});

}

// procgen_wave1_integration: original fixture scope retained.
{

test('one-time generator seeds come from the saved stream root without consuming draws', () => {
    const state={rng:43,streams:createStreams(43)},before=JSON.stringify(state);
    const mix=streamSeed(state,STREAMS.craft,'village.mixtures@1'),people=streamSeed(state,scopedStream('world.people'),'village.generated_people@1');
    assert.equal(JSON.stringify(state),before,'pure: no cell or receipt written');
    assert.equal(streamSeed(state,STREAMS.craft,'village.mixtures@1'),mix);
    assert.notEqual(mix,people);
    const other={rng:44,streams:createStreams(44)};
    assert.notEqual(streamSeed(other,STREAMS.craft,'village.mixtures@1'),mix);
    assert.ok(Number.isSafeInteger(mix)&&mix>=0&&mix<=0xffffffff);
    assert.deepEqual(createMixtureState(mix),createMixtureState(mix));
    assert.deepEqual(createGeneratedPeople(people,0),createGeneratedPeople(people,0));
});

}

