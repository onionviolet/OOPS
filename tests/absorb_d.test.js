import test from 'node:test';
import assert from 'node:assert/strict';
import {FORT,createFortSupply,migrateFortSupply,stageFortAction,observeFortSource,itemSourceJournal,knownClearText,fortDisclosures} from '../src/absorb_d/fort.js';
import {registerFortContent} from '../src/absorb_d/register.js';
const keyFor=id=>JSON.stringify({id});
const getItem=key=>({...JSON.parse(key),quality:0});
function fixture(overrides={}) {return {state:{clock:12,sequence:0,history:[]},gameplay:{player:{inventory:{[keyFor('Rat tail')]:50,[keyFor('Iron ore')]:10,[keyFor('Iron ingot')]:1}}},
    money:10,itemLog:{},fort:createFortSupply(),context:{worldId:'base.frontier',location:'Village',fieldClears:1,assertItemDisposition:()=>{}},keyFor,getItem,...overrides};}
const run=(f,action)=>stageFortAction({...f,action});
const continueFrom=(f,p)=>({...f,state:p.state,gameplay:p.gameplay,money:p.external.money,itemLog:p.itemLog,fort:p.fort});
test('old saves start empty without invented knowledge/history; malformed future schema fails',()=>{
    assert.deepEqual(migrateFortSupply({}),createFortSupply());
    assert.throws(()=>migrateFortSupply({fort_supply:{...createFortSupply(),schema:2}}),/Unsupported/);
    assert.throws(()=>migrateFortSupply({fort_supply:{...createFortSupply(),funds:-1}}),/Invalid/);
});
test('free earned or paid entry gives one real native book and durable funds',()=>{
    const f=fixture(), original=structuredClone(f.gameplay),p=run(f,'notes');
    assert.equal(p.gameplay.player.inventory[keyFor(FORT.notes)],1);assert.equal(p.itemLog[FORT.notes].number,1);
    assert.deepEqual(p.nativePatch.fort_supply,p.fort);assert.equal(p.state.clock,12);assert.deepEqual(f.gameplay,original);
    assert.throws(()=>run(continueFrom(f,p),'notes'),/already/);
    assert.throws(()=>run({...f,context:{...f.context,fieldClears:0}},'notes'),/field/);
    const bought=run({...f,context:{...f.context,fieldClears:0}},'buy_notes');assert.equal(bought.external.money,0);assert.equal(bought.fort.funds,190);
});
test('repeat hand-ins conserve actual inventory, wages and finite employer budget',()=>{
    let f=fixture();f=continueFrom(f,run(f,'notes'));
    for(let i=0;i<22;i++)f=continueFrom(f,run(f,'deliver:tails'));
    assert.equal(f.fort.funds,4);assert.equal(f.fort.spent,176);assert.equal(f.money,186);
    assert.equal(f.fort.received['Rat tail'],44);assert.equal(f.gameplay.player.inventory[keyFor('Rat tail')],6);
    const before=JSON.stringify(f);assert.throws(()=>run(f,'deliver:tails'),/cannot fund/);assert.equal(JSON.stringify(f),before);
    assert.equal(f.fort.funds+f.fort.spent,180);assert.equal(f.state.clock,12);
});
test('repair requires location, reading, actual clear, exact stock and custody',()=>{
    const f=fixture({context:{worldId:'base.frontier',location:FORT.post,notesRead:true,yardClears:1,assertItemDisposition:()=>{}}});
    const p=run(f,'repair');assert.equal(p.fort.repaired,true);assert.equal(p.gameplay.player.inventory[keyFor('Iron ore')],7);
    assert.equal(p.gameplay.player.inventory[keyFor('Iron ingot')],undefined);assert.equal(p.unlocks[0].id,FORT.cellar);
    assert.throws(()=>run(continueFrom(f,p),'repair'),/already/);
    for(const change of [{notesRead:false},{yardClears:0},{location:'Village'},{worldId:'other'},{busy:true},{readOnly:true}])assert.throws(()=>run({...f,context:{...f.context,...change}},'repair'));
    assert.throws(()=>run({...f,context:{...f.context,assertItemDisposition:()=>{throw new Error('borrowed');}}},'repair'),/borrowed/);
    const poor=fixture({context:f.context,gameplay:{player:{inventory:{[keyFor('Iron ore')]:3}}}});const before=JSON.stringify(poor.gameplay);
    assert.throws(()=>run(poor,'repair'),/Iron ingot/);assert.equal(JSON.stringify(poor.gameplay),before);
});
test('journal uses only actual learned edges and known items, distinguishes reports',()=>{
    const edge={itemId:'Iron ore',sourceId:FORT.yard,label:FORT.yard,kind:'clear',count:1,at:12,certainty:'reported'};
    const f=observeFortSource(createFortSupply(),edge);assert.deepEqual(itemSourceJournal(f,{}),[]);
    assert.equal(itemSourceJournal(f,{'Iron ore':{number:1}})[0].certainty,'reported');
    const observed=observeFortSource(f,{...edge,certainty:'observed'});assert.equal(observed.sources.length,1);assert.equal(observed.sources[0].certainty,'observed');
    assert.equal(f.sources[0].certainty,'reported');assert.throws(()=>observeFortSource(f,{...edge,count:0}),/positive/);
    assert.deepEqual(migrateFortSupply(JSON.parse(JSON.stringify({fort_supply:observed}))),observed);
});
test('known remaining-clear projection never scans or reveals undisclosed thresholds',()=>{
    const l={id:FORT.yard,enemy_count:8,enemy_groups_killed:8,rewards_with_clear_requirement:[{required_clear_count:2},{required_clear_count:99}]};
    assert.equal(knownClearText(l,fortDisclosures(false)),'Clears: [1]');
    assert.equal(knownClearText(l,fortDisclosures(true)),'Clears: [1] · known milestone: 2 clears');
    assert.equal(knownClearText({...l,enemy_groups_killed:16},fortDisclosures(true)),'Clears: [2]');
});
test('registration creates original native content once; salvage recovers failed smelting',()=>{
    class Component {constructor(data){Object.assign(this,data);this.quest_tasks||=[];}getAvailabilityComponent(){return this;}_getBasicAvailabilityComponent(){return this;}}
    const registries={locations:{Village:{connected_locations:[]}},item_templates:{},book_stats:{},quests:{},availabilities:{item:{},location:{},quest:{}},
        SafeLocation:Component,CombatZone:Component,Book:Component,BookData:Component,Quest:Component,QuestTask:Component};
    registerFortContent(registries);registerFortContent(registries);
    assert.equal(registries.locations.Village.connected_locations.length,1);
    assert.equal(registries.book_stats[FORT.notes].rewards.quests[0],FORT.quest);
    assert.equal(registries.locations[FORT.yard].repeatable_reward.items[0].item,'Iron ore');
    assert.equal(registries.quests[FORT.quest].quest_rewards.items[0].item,FORT.ledger);
    assert.ok(registries.availabilities.quest[`${FORT.quest}:task:1`]);
});
test('native Quest placeholder writes preserve prior identities and absent bindings',()=>{
    const keys=['undefined','undefined:task:0','undefined:task:1'];
    for(const present of [[],keys,[keys[0],keys[1]]]) {
        class Component {constructor(data){Object.assign(this,data);this.quest_tasks||=[];}getAvailabilityComponent(){return this;}_getBasicAvailabilityComponent(){return this;}}
        class NativeQuest extends Component {constructor(data){super(data);
            registries.availabilities.quest[this.id]=this;
            this.quest_tasks.forEach((t,i)=>{registries.availabilities.quest[`${this.id}:task:${i}`]=t;});}}
        const original=Object.fromEntries(present.map(key=>[key,{owner:`previous:${key}`}]))
        const registries={locations:{Village:{connected_locations:[]}},item_templates:{},book_stats:{},quests:{},
            availabilities:{item:{},location:{},quest:{...original}},SafeLocation:Component,CombatZone:Component,
            Book:Component,BookData:Component,Quest:NativeQuest,QuestTask:Component};
        registerFortContent(registries);
        for(const key of keys) {
            assert.equal(Object.hasOwn(registries.availabilities.quest,key),present.includes(key));
            if(present.includes(key))assert.equal(registries.availabilities.quest[key],original[key]);
        }
        assert.equal(registries.availabilities.quest[FORT.quest],registries.quests[FORT.quest]);
        for(let i=0;i<2;i++)assert.equal(registries.availabilities.quest[`${FORT.quest}:task:${i}`],registries.quests[FORT.quest].quest_tasks[i]);
    }
});
