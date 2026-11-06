import test from 'node:test';
import assert from 'node:assert/strict';
import {hpPeopleRows} from '../src/book_world_hp_people_source.js';
import {knownPeopleView} from '../src/people_knowledge.js';
import {registerHpPeopleSource} from '../src/book_world_hp_people_source.js';

const P='book.hp.lead',k=n=>`${P}.${n}`;
const cast={people:[
    {id:k('hagrid'),label:'Giant visitor',introductionKnowledgeKey:k('w3.cake.name')},
    {id:k('tom'),label:'Bartender',introductionKnowledgeKey:k('w4.pub.known')},
    {id:k('pale_boy'),label:'Pale boy',introductionKnowledgeKey:k('w4.robes.boy')},
    {id:k('potter_vault'),label:'Your vault',introductionKnowledgeKey:k('w4.counter.vault')}],
  locations:[{id:k('cauldron'),label:'The pub'},{id:k('hut'),label:'The hut'}],
  householdActs:{acts:[{id:k('w4.pub'),place:k('cauldron'),effects:[{type:'knowledge',actor:'player',key:k('w4.pub.known')},{type:'knowledge',actor:k('tom'),key:k('w4.fame.tom')}]},
    {id:k('w3.cake'),place:k('hut'),effects:[{type:'knowledge',actor:'player',key:k('w3.cake.name')},{type:'knowledge',actor:'player',key:k('w3.cake.gift')}]}]}};
const ent=(value,at,kind='observation',by='player')=>({value,at,stage:'seen',basis:{kind,attributedTo:by}});
const ctx=knowledge=>({knowledge,personAccounts:rs=>rs.map(([id,r])=>({id,text:r.value,at:r.at}))});
const state=(world=`${P}.world`)=>({actors:{player:{worldId:world,facts:{}}},simulation:{knowledge:{player:{}}}});
const player=()=>({[k('w3.cake.gift')]:ent('gift seen',5,'observation',k('hagrid')),[k('w3.cake.name')]:ent('name told',6,'instruction',k('hagrid')),
    [k('w4.pub.known')]:ent('they knew your name',20),[k('w4.pub.recall')]:ent('later recall',22,'recollection',k('tom'))});

test('not enrolled in the lead life: no rows', () => {
    assert.deepEqual(hpPeopleRows(state('base.frontier'),ctx(player()),cast),[]);
    assert.deepEqual(hpPeopleRows(state(),ctx(player()),null),[]);
});

test('observed people get rows; fame only where the player observed it; memories newest first; unobserved people absent', () => {
    const rows=hpPeopleRows(state(),ctx(player()),cast);
    assert.deepEqual(rows.map(r=>r.id),[k('hagrid'),k('tom')]);
    const [hagrid,tom]=rows;
    assert.equal(hagrid.details.some(d=>/knew your name/.test(d)),false);
    assert.deepEqual(hagrid.memories.map(m=>m.id),[k('w3.cake.name'),k('w3.cake.gift')]);
    assert.equal(hagrid.location,'Last seen: The hut');
    assert.equal(tom.details.filter(d=>d==='They already knew your name when you met.').length,1);
    assert.deepEqual(tom.memories.map(m=>m.at),[22,20]);
    assert.equal(tom.location,'Last seen: The pub');
    assert.equal(rows.some(r=>r.id===k('pale_boy')||r.id===k('potter_vault')),false);
});

test('without the player observation there is no fame detail', () => {
    const k2=player();delete k2[k('w4.pub.known')];
    assert.deepEqual(hpPeopleRows(state(),ctx(k2),cast).map(r=>r.id),[k('hagrid'),k('tom')]);
    assert.equal(hpPeopleRows(state(),ctx(k2),cast)[1].details.some(d=>/knew your name/.test(d)),false);
});

test('observer safety: other holders\' stores, never witnessed by the player, are not shown', () => {
    const s=state();s.simulation.knowledge[k('pale_boy')]={[k('w4.boy.heard')]:ent('Secret held by the boy',30,'observation',k('pale_boy'))};
    s.simulation.knowledge[k('tom')]={[k('w4.fame.tom')]:ent('Tom knows it is Harry',21,'observation',k('tom'))};
    s.simulation.knowledge.player=player();
    const rows=hpPeopleRows(s,ctx(s.simulation.knowledge.player),cast);
    assert.equal(rows.some(r=>r.id===k('pale_boy')),false);
    assert.doesNotMatch(JSON.stringify(rows),/Secret held|Tom knows/);
});

test('registered source flows through the shared people view', () => {
    const off=registerHpPeopleSource();
    try{
        const s=state();s.simulation.knowledge.player={[k('w4.robes.boy')]:ent('boy seen',9)};
        // the registered reader uses the loaded private cast; with none loaded it yields no rows and the view stays empty
        assert.deepEqual(knownPeopleView(s).filter(r=>r.id.startsWith(P)),[]);
    }finally{off();}
});
