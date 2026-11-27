import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from '../docs/gm/dispatch/pc-groups-2026-10-26/lore-and-idea-sources/implementation/L2/fixture.mjs';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {previewMolCommand, commitMolCommand, molContext} from '../src/book_world_mol_host.js';
import {MOL_IDS as I} from '../src/book_world_mol_ids.js';
import {MOL_BEGIN_ZORIAN, MOL_ZORIAN_RESERVE} from '../src/book_world_mol_starts.js';
import {advanceSimulationBoundary, cancelSimulationJob} from '../src/simulation.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {molExamInputs, molExamFacts} from '../src/mol_zorian_exams.js';
import {MOL_EXAM_IDS as X} from '../src/world_packs/book_mol_exam_data.js';
import {scopedRestart} from '../src/harm_restart_scope.js';
const P = 'book.mol.zorian.light.', correction = P + 'correct_formula', note = P + 'formula_correction';
const ctx = p => ({actorId:'player',nativeAlive:true,nativeBody:p.state.simulation.people.player.body,
    molNative:{bound:true,revision:p.state.motherOfLearning?.nativeRevision ?? 0,body:p.state.simulation.people.player.body},
    vitals:p.vitals,gameplay:p.gameplay,external:p.external,equipment:p.equipment,facts:{location:p.state.simulation.people.player.location}});
const act = (p,id) => ({...p,...commitMolCommand(p.state,registry,{type:'book_mol',id},ctx(p))});
const finish = p => {let n=0;while(p.state.simulation.jobs.some(j=>j.actorId==='player')) {
    assert(n++<200);p.state.clock++;advanceSimulationBoundary(p,registry,{player:ctx(p)});
}return p;};
const run = (p,id) => finish(act(p,id));
const quote = p => previewMolCommand(p.state,registry,correction,ctx(p));
// Same pre-entry cleanup as the established Zorian start tests, then an actual
// begin command. The named fixture supplies Xvim's already-covered basic drill.
function start() {
    const p=fixture(false),s=p.state;
    delete s.motherOfLearning;delete s.worlds[I.world];
    for(const id of Object.keys(s.actors))if(id.startsWith('book.mol.')&&id!=='player') {
        delete s.actors[id];delete s.simulation.people[id];delete p.gameplay[id];delete p.vitals[id];
    }
    for(const v of Object.values(s.simulation))if(v&&typeof v==='object'&&!Array.isArray(v))
        for(const id of Object.keys(v))if(id.startsWith('book.mol.')&&id!=='book.mol.visitor_branch'&&!id.includes('.lore.')&&id.split('.').length===3)delete v[id];
    for(const bag of [s.simulation.claims,s.simulation.controllers])for(const [key,value] of Object.entries(bag))
        if(key.startsWith('book.mol.')||JSON.stringify(value).includes('book.mol.'))delete bag[key];
    s.simulation.log=[];s.actors.player.worldId='base.frontier';s.simulation.people.player.location='Village';
    for(const key of Object.keys(s.actors.player.resources))if(key.startsWith('book.mol.'))delete s.actors.player.resources[key];
    delete s.simulation.situations['book.mol.visitor_branch'];s.actors.player.facts={};s.actors.player.completed={};s.simulation.jobs=[];
    for(const key of Object.keys(s.simulation.knowledge.player||{}))if(key.startsWith('book.mol.'))delete s.simulation.knowledge.player[key];
    s.schema=10;
    const q=act(p,MOL_BEGIN_ZORIAN);q.state.motherOfLearning.nativeRevision=1;
    q.state.actors.player.facts['book.mol.loop.s0.basic_three_drilled']=true;
    return run(run(act(q,'book.mol.move.court'),P+'study_torch'),P+'review_shaping');
}
const initial = start();

test('sustained light pays real costs, adds revision consumed by exam chances, and cannot repeat', () => {
    let p=structuredClone(initial);delete p.state.simulation.knowledge.player[P+'shaping_control'];assert.equal(quote(p).eligible,false);
    assert.match(quote(p).reasons.join(' '),/Light the slate/,'the disabled action explains the missing means');
    const before=molExamFacts(p.state),mana=p.state.simulation.energies.player[MOL_ZORIAN_RESERVE].reserve;
    p=act(p,P+'torch');assert.equal(p.state.simulation.energies.player[MOL_ZORIAN_RESERVE].reserve,mana-1);
    const stamina=p.vitals.player.stamina,clock=p.state.clock;
    assert.equal(quote(p).eligible,true,JSON.stringify(quote(p)));p=act(p,correction);assert.equal(p.vitals.player.stamina,stamina-2);
    p=finish(p);assert.equal(p.state.clock,clock+5);assert.equal(molExamInputs(p.state).formulas.sessions,1);
    assert.equal(p.state.simulation.knowledge.player[note].stage,'understood');
    assert.notDeepEqual(molExamFacts(p.state)['mol.exam.p.formulas.high'],before['mol.exam.p.formulas.high']);
    assert.equal(quote(p).visible,false);assert.throws(()=>act(p,correction));
    advanceSimulationBoundary(p,registry,{player:ctx(p)});assert.equal(molExamInputs(p.state).formulas.sessions,1);
});

test('short light expires during the pending exercise; cancellation also gives no revision', () => {
    let p=run(structuredClone(initial),P+'shaped'),mana=p.state.simulation.energies.player[MOL_ZORIAN_RESERVE].reserve;
    const stamina=p.vitals.player.stamina;assert.equal(quote(p).eligible,true,JSON.stringify(quote(p)));
    p=act(p,correction);p.state=loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry);p=finish(p);
    assert.equal(molExamInputs(p.state).formulas.sessions,0);assert.equal(p.state.simulation.knowledge.player[note],undefined);
    assert.equal(p.vitals.player.stamina,stamina);assert.equal(p.state.simulation.energies.player[MOL_ZORIAN_RESERVE].reserve,mana,'failed exercise does not refund its earlier cast');
    const lit=act(structuredClone(initial),P+'torch'),job=act(lit,correction);
    const cancelled=cancelSimulationJob(job.state,registry,job.commitment.id,molContext(job.state,ctx(job)));
    assert.equal(cancelled.vitals.player.stamina,lit.vitals.player.stamina);assert.equal(molExamInputs(cancelled.state).formulas.sessions,0);
});

test('the corrected example and its exam revision cross a restart together, with no second reward', () => {
    const p=run(act(structuredClone(initial),P+'torch'),correction);
    const out=scopedRestart({expansion:p.state},{expansion:initial.state},I.world,`${I.world}#zorian`);
    const q={...structuredClone(initial),state:out.expansion};q.state.motherOfLearning.runStartedAt=q.state.clock;
    assert.equal(q.state.simulation.knowledge.player[note].stage,'understood');
    assert.equal(q.state.actors.player.resources[X.sessions('formulas')],1);
    assert.equal(q.state.actors.player.completed[correction],undefined);assert.equal(quote(q).visible,false);
});

test('completed paper and full revision retain the existing exam limits', () => {
    for(const mutate of [p=>p.state.actors.player.completed[X.paper('formulas')]=1,p=>p.state.actors.player.resources[X.sessions('formulas')]=8]) {
        let p=act(structuredClone(initial),P+'torch');mutate(p);assert.equal(quote(p).eligible,false);
        const before=structuredClone(p);assert.throws(()=>act(p,correction));assert.deepEqual(p,before);
    }
});

test('a remembered correction supplies a later formula choice outside the exam without teaching shaping', () => {
    let p=run(act(structuredClone(initial),P+'torch'),correction);
    delete p.state.simulation.knowledge.player[P+'shaping_control'];
    p.state.actors.player.completed[X.paper('formulas')]=1;
    const adapted=P+'adapt_correction',preview=()=>previewMolCommand(p.state,registry,adapted,ctx(p));
    assert.equal(preview().eligible,false,'the exercise heading is still needed');
    p=run(p,P+'read_heading');const stamina=p.vitals.player.stamina,clock=p.state.clock;
    assert.equal(preview().eligible,true,JSON.stringify(preview()));p=act(p,adapted);
    p.state=loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry);p=finish(p);
    assert.equal(p.state.clock,clock+8);assert.equal(p.vitals.player.stamina,stamina-3);
    assert.equal(molExamInputs(p.state).formulas.sessions,1,'the later use adds no exam reward');
    assert.equal(p.state.simulation.knowledge.player[P+'shaping_control'],undefined);
    p=act(p,P+'oblique');p=run(p,P+'read_cut');
    assert.equal(p.state.simulation.knowledge.player[P+'incisions'].stage,'understood');
    assert.equal(preview().visible,false);assert.throws(()=>act(p,adapted));
    p.state=loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry);
    assert.equal(preview().visible,false,'current-format restore retains the learned invocation');
    const retained=scopedRestart({expansion:p.state},{expansion:initial.state},I.world,`${I.world}#zorian`);
    p={...structuredClone(initial),state:retained.expansion};
    assert.equal(preview().visible,false,'remembered method prevents another reward after receipt reset');
});

test('the ordinary experimental route remains useful and cancelled adaptation gives no method', () => {
    const adapted=P+'adapt_correction';
    let p=run(act(structuredClone(initial),P+'torch'),correction);p=run(p,P+'read_heading');
    const stamina=p.vitals.player.stamina,job=act(p,adapted);
    const cancelled=cancelSimulationJob(job.state,registry,job.commitment.id,molContext(job.state,ctx(job)));
    assert.equal(cancelled.vitals.player.stamina,stamina);
    assert.equal(cancelled.state.simulation.knowledge.player[P+'oblique_formula'],undefined);
    let ordinary=run(run(structuredClone(initial),P+'torch'),P+'shaped');
    const clock=ordinary.state.clock,before=ordinary.vitals.player.stamina;
    ordinary=run(ordinary,P+'draft_oblique');
    assert.equal(ordinary.state.clock,clock+15);assert.equal(ordinary.vitals.player.stamina,before);
    assert.equal(ordinary.state.simulation.knowledge.player[P+'oblique_formula'].stage,'understood');
    assert.equal(previewMolCommand(ordinary.state,registry,adapted,ctx(ordinary)).visible,false);
});
