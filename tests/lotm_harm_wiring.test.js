import test from 'node:test';
import assert from 'node:assert/strict';
import {bare,hostOver,fresh,def,ctx,registry} from './lotm_helpers.js';
import {previewSimulationCommand} from '../src/simulation.js';
import {setHarmState,harmState} from '../src/harm_state.js';
import {harmContext,harmClassOf,accrueHarm,restHarm,lostControlOutcome,lotmLossLine,drainLotmInbox,LOTM_LOSS_SCALE} from '../src/book_world_lotm_harm.js';
const begin=()=>{const o=hostOver(bare());o.host.enroll('probationer');return o;};
const strain=n=>setHarmState({schema:1,backlash:{power:n}});
test.afterEach(()=>setHarmState(null));
test('the host context makes the command quote carry the stage reason and the graded modifier', () => {
 const p=fresh(),d=def('observe_comparator'),c={...ctx(p)};
 strain(7);
 const slipping=previewSimulationCommand(p.state,registry,d.id,{...c,...harmContext(p.state,d)});
 assert.ok(slipping.reasons.some(r=>/Slipping/.test(r)),'slipping blocks research');
 assert.deepEqual(slipping.harm?.map(m=>m.axis),['precision']);
 strain(0);
 assert.ok(!previewSimulationCommand(p.state,registry,d.id,{...c,...harmContext(p.state,d)}).reasons.some(r=>/Slipping|Power strain/.test(r)));
});
test('accrual comes from a committed cast ability or divination attempt only, and sleep recovers', () => {
 const s={actors:{player:{worldId:'book.lotm.tingen'}}};
 assert.equal(accrueHarm(s,{id:'x',divination:{kind:'prepare'}}),null);
 assert.equal(accrueHarm(s,{id:'x',divination:{kind:'attempt'}}).after,1);
 assert.equal(accrueHarm(s,{id:'y',castAbility:true}).after,1.5);
 assert.equal(accrueHarm({actors:{player:{worldId:'base.frontier'}}},{id:'x',divination:{kind:'attempt'}}),null);
 assert.equal(restHarm(s,120).after,1);
 assert.equal(harmState().backlash.power,1);
});
test('lost control left running resolves to the world outcome', () => {
 const s={actors:{player:{worldId:'book.lotm.tingen'}}};
 strain(8);assert.equal(lostControlOutcome(s),null);
 strain(9);assert.equal(lostControlOutcome(s).default,'final');
});
test('lost control runs a 30-minute grace before the die port, not during skipped time (AD50, BHR18, RCL5)', async () => {
 const calls=[];const o=hostOver(bare(),{die:c=>{calls.push(c);return Promise.resolve();}});o.host.enroll('probationer');
 strain(9);o.box.skipping=true;o.host.tick(600);assert.equal(calls.length,0,'spending banked time never runs the grace clock');
 assert.equal(harmState().lostFor?.power??0,0);
 o.box.skipping=false;o.host.tick(20);assert.equal(calls.length,0,'20 of 30 minutes');assert.equal(harmState().lostFor.power,20);
 o.box.sleeping=true;restHarm({actors:{player:{worldId:'book.lotm.tingen'}}},600);assert.equal(harmState().backlash.power,9,'past the line rest does not ease it');
 o.box.sleeping=false;o.host.tick(10);o.host.tick(1);assert.deepEqual(calls,['loss_of_control']);
});
test('command classes cover the host command shapes', () => {
 assert.equal(harmClassOf({id:'a',bodyCare:{kind:'sleep'}}),'rest');
 assert.equal(harmClassOf({id:'a',journey:{}}),'travel');
 assert.equal(harmClassOf({id:'a',divination:{}}),'ritual');
 assert.equal(harmClassOf({id:'a'}),'other');
});

test('one carrier (MND8, RCL5): peek strain and a bad dose add on one line, and the inbox drains onto it', () => {
 const s={actors:{player:{worldId:'book.lotm.tingen',resources:{'book.lotm.pressure':4}}}};
 assert.equal(LOTM_LOSS_SCALE,1.5);
 const peeks={schema:1,backlash:{power:3}};
 const line=lotmLossLine(peeks,s);assert.equal(line.count,9,'3 from peeks plus 4 x 1.5 from the dose');assert.ok(line.count>=line.loss);
 assert.equal(lotmLossLine(peeks,null).count,3,'without the dose the peeks alone stay strained');
 const drained=drainLotmInbox(s,peeks);assert.equal(drained.backlash.power,9);assert.equal(s.actors.player.resources['book.lotm.pressure'],undefined);
 assert.equal(drainLotmInbox(s,drained),null,'an empty inbox moves nothing');
 const relief={actors:{player:{resources:{'book.lotm.relief':1}}}};
 assert.equal(lotmLossLine({schema:1,backlash:{power:6}},relief).count,4.5,'relief eases below the line');
 assert.equal(lotmLossLine({schema:1,backlash:{power:9}},relief).count,9,'past the line nothing eases it');
});

test('crossing a stage leaves one Reports line, and the line counts the grace down (FBK, RCL5)', () => {
 const logs=[];const o=hostOver(bare(),{logMessage:t=>logs.push(t),die:()=>Promise.resolve()});o.host.enroll('probationer');
 o.host.tick(1);o.box.p.state.actors.player.resources['book.lotm.pressure']=6;o.host.tick(1);
 assert.equal(harmState().backlash.power,9);assert.equal(logs.filter(t=>/lost control/.test(t)).length,1);
 o.host.tick(1);assert.equal(logs.filter(t=>/lost control/.test(t)).length,1,'no repeat while the stage holds');
 assert.match(o.host.view().cause.line,/2[89] minutes of waking time are left/);
});
