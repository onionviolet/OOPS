import fs from 'node:fs';
const target='tests/chain_inspector.test.js';
const original=fs.readFileSync(target,'utf8');
const additions=`
// R3: acquisition eligibility closes after learning; retained knowledge stays complete.
import {createAcquisitionLesson, heldLesson, stageRevealKnowledge} from '../src/reveal_chain.js';
import {prepareNativeUnlocks} from '../src/native_unlock_transaction.js';
const leafKey=JSON.stringify({id:'Golmoon leaf'});
const leafStock=n=>({[leafKey]:{item:{id:'Golmoon leaf'},count:n}});
const gateRow=f=>projectChains(f,{developer:true}).find(c=>c.id==='gates').rows.at(-1);
function assertLearnedLesson(f) {
    const before=JSON.stringify(f), row=gateRow(freeze(f));
    assert.match(row.detail,/learned \\(persistent\\)/);
    assert.doesNotMatch(row.detail,/waiting|inputs unknown/);
    assert.doesNotMatch(row.why,/Not yet learned|Something is still missing/);
    assert.equal(JSON.stringify(f),before,'completion inspection is observer-safe');
}
test('herb lesson shows waiting/open before learning and persistent completion after native acquisition',()=>{
    const facts={}, unlocks=[];
    const acquire=createAcquisitionLesson({canWrite:()=>true,read:()=>({facts,worldId:'base.frontier',known:()=>false}),unlock:rows=>unlocks.push(...rows),notify:()=>{},refresh:()=>{}});
    const frame=n=>({inventory:leafStock(n),expansion:{actors:{player:{facts}}}});
    assert.match(gateRow(frame(19)).detail,/waiting/);
    assert.match(gateRow(frame(20)).detail,/^open/);
    acquire(leafStock(19),[]);assert.equal(facts['reveal.herbLesson'],undefined);
    acquire(leafStock(20),[]);assert.equal(facts['reveal.herbLesson'],true);
    assert.ok(unlocks.some(r=>r.recipe_id==='Weak healing powder'));
    const count=unlocks.length;acquire(leafStock(25),[]);
    assert.equal(unlocks.length,count,'inspection fix does not reopen acquisition');
    assert.equal(heldLesson(leafStock(25),true),false);
    assertLearnedLesson(frame(25));
    assertLearnedLesson({inventory:{},expansion:structuredClone(frame(25).expansion)});
});
test('staged lesson completion serializes its grant and inspection does not infer alternate-source ownership',()=>{
    const plan={state:{actors:{player:{worldId:'base.frontier',facts:{}}}},gameplay:{player:{inventory:{[leafKey]:20}}}};
    stageRevealKnowledge(plan,{[leafKey]:19},0);
    let published=false;
    const tx=prepareNativeUnlocks(plan.unlocks,{availabilities:{recipe:{'Weak healing powder':{setStatus:s=>{published=s.is_unlocked;}}}},flags:{}});
    const envelope={availabilities:{recipe:{'Weak healing powder':0}}};
    tx.write(envelope);assert.equal(envelope.availabilities.recipe['Weak healing powder'],1);
    assert.equal(published,false);tx.publish();assert.equal(published,true);
    assertLearnedLesson({inventory:leafStock(20),expansion:plan.state});
    const alternative={inventory:leafStock(19),expansion:{actors:{player:{facts:{'reveal.herbLesson':false}}}},availabilities:envelope.availabilities};
    assert.match(gateRow(alternative).detail,/waiting/,'recipe availability is not evidence of this handling lesson');
    const next={state:structuredClone(plan.state),gameplay:{player:{inventory:{[leafKey]:25}}}};
    stageRevealKnowledge(next,{[leafKey]:20},0);assert.equal(next.revealLesson,undefined);
});
`;
// Emit a reviewable addition; the actual test owner remains untouched before release.
fs.writeFileSync('docs/gm/dispatch/overarching-reconciliation-2026-10-23/r3-proposed-regression.patch',`--- a/${target}\n+++ b/${target}\n@@ -${original.split('\n').length-1},0 +${original.split('\n').length},${additions.split('\n').length-1} @@\n`+additions.split('\n').slice(0,-1).map(l=>'+'+l).join('\n')+'\n');
