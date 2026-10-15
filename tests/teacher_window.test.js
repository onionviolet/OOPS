import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState, commitAction, advanceSimulation, evaluateAction, loadExpansionState} from '../src/expansion_engine.js';
import {initializeExpedition, expeditionRegistry as registry} from '../src/expedition_content.js';
import {enrollSimulation, commitSimulationCommand} from '../src/simulation.js';
import {everydayFacts} from '../src/everyday_life.js';
import {teacherWindow} from '../src/teacher_window.js';
import {LOG_KEY, TOKEN_KEY} from '../src/village_content.js';
const owned = inventory => ({inventory, skills:{Perception:{xp:0,parent:null,enabled:true},Literacy:{xp:0,parent:null,enabled:true}},reputation:{Village:0}});
const fresh = () => {
    const state = initializeExpedition(createExpansionState(571));
    state.actors.player.facts['village.discovered'] = true;
    return {state, external:{money:20}, gameplay:{player:owned({[LOG_KEY]:4,[TOKEN_KEY]:1}),oldCraftsman:owned({})}};
};
const context = (p, minute=480) => ({actorId:'player',worldId:'base.frontier',targetId:'oldCraftsman',external:p.external,gameplay:p.gameplay,
    facts:{location:'Village',calendarMinute:minute,'village.elderMet':true,'village.craftsmanMet':true,'village.notesRead':false,
        ...everydayFacts(p.state,{hour:Math.floor(minute%1440/60)})}});
const view = (p, minute) => teacherWindow(p.state,context(p,minute).facts);
const act = (p,id,minute) => commitAction(p.state,registry,id,context(p,minute));
const tick = (p,n) => advanceSimulation(p.state,registry,n,p.external,p.gameplay);
const reload = p => ({...p,state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry)});

test('daily teacher boundaries recur without attendance claims or skipped-day rewards', () => {
    const p=fresh(), before=structuredClone(p);
    for(const [minute,open] of [[479,false],[480,true],[1079,true],[1080,false],[1920,true]]) {
        assert.equal(view(p,minute).window.open,open);
        assert.equal(evaluateAction(p.state,registry,'village.route_lesson',context(p,minute)).eligible,open);
    }
    assert.deepEqual(p,before);
    assert.match(view(p,1080).text,/840 game minutes/);
    assert.ok(!view(p,480).preview.includes('dry-bank'));
});

test('supplied native commission overrides teaching, persists pending, and completion restores it', () => {
    let p=fresh(); p=enrollSimulation(p.state,registry,context(p));
    p=commitSimulationCommand(p.state,registry,{id:'village.commission'},context(p));
    assert.equal(p.external.money,19); assert.equal(p.gameplay.player.inventory[LOG_KEY],2);
    assert.match(view(p,480).cause,/Commission override/);
    assert.equal(view(p,480).available,false);
    assert.equal(evaluateAction(p.state,registry,'village.route_lesson',context(p)).eligible,false);
    p=reload(tick(p,1)); assert.equal(view(p,481).available,false);
    p=tick(p,5); assert.equal(view(p,486).available,true);
    assert.equal(evaluateAction(p.state,registry,'village.route_lesson',context(p,486)).eligible,true);
    assert.equal(view(p,1080).available,false);
    const kit=JSON.stringify({id:'Prepared survey kit'});
    assert.equal(p.gameplay.oldCraftsman.inventory[kit],1);
    p=tick(reload(p),1440); assert.equal(p.gameplay.oldCraftsman.inventory[kit],1);
});

test('story advance requires actual return and learning, retaining methods, rewards, and access across import', () => {
    let p=fresh();
    assert.throws(()=>act(p,'village.record_waypost_chapter'));
    p=act(p,'village.return_token'); assert.throws(()=>act(p,'village.record_waypost_chapter'));
    p=tick(act(p,'village.route_lesson'),3);
    p.state.campaign.facts.anchor=true;
    assert.match(view(p,483).preview,/survey the known dry-bank/);
    const before=structuredClone(p);
    p=act(p,'village.record_waypost_chapter');
    assert.equal(view(p,483).phase,'Account recorded');
    assert.deepEqual(p.external,before.external); assert.deepEqual(p.gameplay,before.gameplay);
    assert.deepEqual(p.state.actors.player.sources,before.state.actors.player.sources);
    assert.equal(p.state.actors.player.facts['village.routeOrigin'],'teacher');
    assert.equal(view(p,483).available,true);
    assert.equal(evaluateAction(p.state,registry,'village.dry_bank',context(p,483)).eligible,true);
    const imported=reload(p); assert.deepEqual(imported,p);
    for(const id of ['village.record_waypost_chapter','village.return_token','village.route_lesson']) assert.throws(()=>act(imported,id));
    assert.deepEqual(tick(imported,0).gameplay,p.gameplay);
});

test('old saves need no new record and remain unchanged while projected', () => {
    const p=fresh(), restored=reload(p), before=structuredClone(restored);
    assert.equal(Object.hasOwn(restored.state.actors.player.facts,'village.waypostChapterClosed'),false);
    assert.equal(view(restored,480).phase,'Following the waypost');
    assert.deepEqual(restored,before);
});
