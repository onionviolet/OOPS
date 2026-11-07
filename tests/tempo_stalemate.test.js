import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {createFieldFixture,joinField,fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight,commitTempoMove,driveTempoFight,TEMPO_DIALS} from '../src/tempo_fight.js';

// AT21: neither fighter can land a blow (hit chance 0 on both sides), so the old fight never ended.
const weak=(over={})=>({stats:{attack_points:1,agility:20,intuition:1,defense:0,attack_count:1,crit_rate:0,crit_multiplier:1,stamina_efficiency:1},attackPower:1.2,shield:0,shieldSkill:0,emptyStaminaMultiplier:.5,...over});
const fixture=()=>{
    const p=joinField(createFieldFixture());p.state.simulation.seed=5;
    const context=fieldContext(p,'Village',{vitals:{player:{health:60,max_health:60,stamina:30,max_stamina:30}}});
    const spec={id:'stall',title:'Stalemate',conditions:{},fighters:[
        {id:'player',name:'You',side:'a',speed:100,hp:60,maxHp:60,stamina:30,profile:weak(),perception:6,stealth:6},
        {id:'foe1',name:'Thug',side:'b',speed:100,hp:40,maxHp:40,stamina:30,profile:weak(),perception:6,stealth:6}]};
    return {p,context,plan:beginTempoFight(p.state,registry,context,spec)};
};
test('two fighters who cannot hurt each other break off, spent, instead of trading blows forever',()=>{
    const {context,plan}=fixture();
    let cur=plan,strikes=0;
    while(cur.state.simulation.sessions.player&&strikes<200){cur=commitTempoMove(cur.state,registry,context,{moveId:'jab'});strikes++;}
    assert.ok(!cur.state.simulation.sessions.player,'the fight ended');
    assert.ok(strikes<=TEMPO_DIALS.stallActions.value,`ended within the dial, took ${strikes}`);
    assert.equal(cur.state.actors.player.facts['tempo.lastResult'],'withdrawn');
});
test('a headless driver also ends the stalemate; a fight that lands blows is unaffected',()=>{
    const {context,plan}=fixture();
    assert.equal(driveTempoFight(plan.state,registry,context,'aggressive').state.actors.player.facts['tempo.lastResult'],'withdrawn');
    const {context:c2,plan:p2}=fixture();
    const live=structuredClone(p2.state);const b=live.simulation.sessions.player.nativeBattle;
    for(const f of Object.values(b.fighters))f.profile.stats={...f.profile.stats,attack_points:50,agility:5,defense:1};
    b.fighters.player.profile.attackPower=8;b.fighters.foe1.profile.attackPower=8;
    assert.ok(['won','lost'].includes(driveTempoFight(live,registry,c2,'aggressive').state.actors.player.facts['tempo.lastResult']));
});

// AT22: after a fight the journal tab the player was on comes back, only if the notebook took it over.
import {restoreJournalTab} from '../src/tempo_fight_domain.js';
const tab=(active,connected=true)=>{const t={isConnected:connected,clicked:0,classList:{contains:c=>c==='active_selection_button'&&active},click(){t.clicked++;}};return t;};
test('the journal tab returns when the notebook took it over, and is left alone otherwise',()=>{
    const was=tab(false);
    assert.equal(restoreJournalTab(was,tab(true)),true);assert.equal(was.clicked,1);
    const other=tab(false);
    assert.equal(restoreJournalTab(other,tab(false)),false);assert.equal(other.clicked,0);
    assert.equal(restoreJournalTab(tab(false,false),tab(true)),false);
    assert.equal(restoreJournalTab(null,tab(true)),false);
});
import {restoreWorkroomTab} from '../src/tempo_fight_domain.js';
test('a book view\'s in-panel tab returns after a fight when another tab was selected meanwhile (LOTM workroom)',()=>{
    const wt=(selected,connected=true)=>{const t={isConnected:connected,clicked:0,getAttribute:a=>a==='aria-selected'?String(selected):null,click(){t.clicked++;}};return t;};
    const here=wt(false);assert.equal(restoreWorkroomTab(here),true);assert.equal(here.clicked,1);
    const still=wt(true);assert.equal(restoreWorkroomTab(still),false);assert.equal(still.clicked,0);
    assert.equal(restoreWorkroomTab(wt(false,false)),false);assert.equal(restoreWorkroomTab(null),false);
});
import {restoreCenterView} from '../src/tempo_fight_domain.js';
test('the notebook centre view that a fight opened closes after it; a view the player already had stays',()=>{
    const back={isConnected:true,clicked:0,click(){back.clicked++;}};
    assert.equal(restoreCenterView(null,'workspace:notebook',back),true);assert.equal(back.clicked,1);
    assert.equal(restoreCenterView('workspace:notebook','workspace:notebook',back),false);
    assert.equal(restoreCenterView(null,'workspace:people',back),false);
    assert.equal(restoreCenterView(null,null,back),false);assert.equal(back.clicked,1);
});
