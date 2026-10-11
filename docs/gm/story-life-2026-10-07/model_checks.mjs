// Run from the isolated story snapshot. Generated states only. These checks
// exercise command/scheduler contracts, not DOM or native publication.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL, fileURLToPath} from 'node:url';
const root=process.env.YAIRPG_STORY_ROOT||process.cwd();
const owner=path.dirname(fileURLToPath(import.meta.url));
const moduleAt=name=>import(pathToFileURL(path.join(root,'src',name)).href);
const {expeditionRegistry:registry}=await moduleAt('expedition_content.js');
const {previewCausalStoryCommand:quote,commitCausalStoryCommand:commit,causalStorySimulationContexts,causalStoryPresentation}=await moduleAt('causal_story_host.js');
const {causalStoryNativeStats}=await moduleAt('causal_story_content.js');
const {advanceSimulation,validateExpansionState}=await moduleAt('expansion_engine.js');
const {validateSaveEnvelope}=await moduleAt('save_files.js');
const {causalStoryId:id,CAUSAL_STORY_PROOFS:proofs,CAUSAL_STORY_PEOPLE:people}=await moduleAt('causal_story_ids.js');
const seed=JSON.parse(fs.readFileSync(path.join(owner,'generated-opening.json')));
const body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
const playerVitals={health:60,max_health:60,stamina:40,max_stamina:40};
const report={kind:'generated-model-contract-checks',browserProof:false,cases:[]};

for(const proof of proofs) {
    let plan={state:structuredClone(seed.expansion),external:{money:seed.character.money},gameplay:{player:{inventory:Object.fromEntries(Object.entries(seed.inventories.person.main_character).map(([key,row])=>[key,row.count])),skills:{},reputation:{village:0}}},vitals:{player:structuredClone(playerVitals)},equipment:{player:{}}};
    const native={bound:true,revision:0,body,fighters:{player:{stats:playerVitals,attackPower:1.2}},currentLocation:'Village',localAvailable:true};
    const context=()=>({actorId:'player',nativeAlive:true,facts:{location:'Village'},external:plan.external,gameplay:plan.gameplay,vitals:plan.vitals,vitalsByActor:plan.vitals,equipment:plan.equipment,causalStoryNative:native});
    const act=(command,request={})=>{
        const offer=quote(plan.state,registry,command,context(),request);
        assert.equal(offer.eligible,true,`${command}: ${offer.reasons.join(' ')}`);
        plan=commit(plan.state,registry,offer.command,context());
    };
    const advance=minutes=>{
        const contexts=causalStorySimulationContexts(plan.state,Object.fromEntries(Object.keys(plan.state.simulation.people).map(actorId=>[actorId,{...context(),actorId,vitals:plan.vitals[actorId]}])));
        plan=advanceSimulation(plan.state,registry,minutes,plan.external,plan.gameplay,contexts);
        assert.equal(plan.remaining,0);
    };
    act('causal.story.enroll');
    assert.deepEqual(Object.values(plan.state.causalStories.proofs),[null,null,null]);
    assert.ok(plan.state.simulation.situations['causal.story.meeting.situation']);
    // Emulate only the native publisher's admitted revision for this model.
    plan.state.causalStories.nativeRevision=1;native.revision=1;
    for(const [actorId,stats] of Object.entries(causalStoryNativeStats))native.fighters[actorId]={stats,attackPower:stats.attack_power};
    act(id(proof,'begin'));
    let section=causalStoryPresentation(plan.state,registry,context()).sections.find(row=>row.id===proof);
    assert.equal(section.actions.some(row=>['release_source','sever'].some(action=>row.id===id(proof,action))),false);

    act(id(proof,'keep_watch'));
    let job=plan.state.simulation.jobs.find(row=>row.commandId===id(proof,'keep_watch'));
    assert.deepEqual(job.participants,['player']);
    assert.equal(job.siteId,null);
    assert.equal(plan.vitals.player.stamina,39);
    act('causal.story.cancel',{jobId:job.id});
    assert.equal(plan.vitals.player.stamina,40);
    assert.equal(plan.state.actors.player.completed[id(proof,'keep_watch')]||0,0);
    act(id(proof,'keep_watch'));
    advance(4);
    assert.equal(plan.state.clock,4);
    assert.equal(plan.state.actors.player.completed[id(proof,'keep_watch')],1);
    assert.ok(plan.state.simulation.knowledge.player[id(proof,'watch')]);
    advance(14);
    assert.equal(plan.state.causalStories.proofs[proof].delivery,'delivered');
    assert.equal(plan.state.simulation.knowledge.player[id(proof,'closure')],undefined);
    act(id(proof,'report'));
    const money=plan.external.money,inventory=structuredClone(plan.gameplay.player.inventory);
    const attention=plan.state.actors[people[proof]].resources['causal.story.attention'];
    act(id(proof,'talk_afterward'));
    job=plan.state.simulation.jobs.find(row=>row.commandId===id(proof,'talk_afterward'));
    assert.deepEqual(job.participants,['player',people[proof]]);
    assert.equal(job.siteId,null);
    assert.equal(plan.state.actors[people[proof]].resources['causal.story.attention'],attention-1);
    advance(1);
    assert.equal(plan.state.actors.player.completed[id(proof,'talk_afterward')],1);
    assert.equal(plan.external.money,money);
    assert.deepEqual(plan.gameplay.player.inventory,inventory);
    section=causalStoryPresentation(plan.state,registry,context()).sections.find(row=>row.id===proof);
    assert.equal(section.scene.latestAccount.id,id(proof,'afterward'));
    assert.equal(section.scene.groups.flatMap(group=>group.actions).length,section.actions.length);
    assert.equal(quote(plan.state,registry,id(proof,'talk_afterward'),context()).eligible,false);
    validateExpansionState(plan.state,registry);
    report.cases.push({proof,clock:plan.state.clock,watchCompleted:1,watchCancellationRefunded:true,delivery:'delivered',receivedClosure:true,conversationCompleted:1,extraLoot:false,hiddenCountersNotDisclosed:true});
}
const enrolled=JSON.parse(fs.readFileSync(path.join(owner,'generated-enrolled.json')));
enrolled.levels.person[people.mortal].skill_xp['Night vision']=0;
validateSaveEnvelope(enrolled,'v0.6');
enrolled.levels.person[people.mortal].skill_xp=JSON.parse('{"__proto__":0}');
assert.throws(()=>validateSaveEnvelope(enrolled,'v0.6'),/skill XP/);
report.nativeSkillKeyContract={spacedNativeNameAccepted:true,unsafeKeyRejected:true};
fs.writeFileSync(path.join(owner,'MODEL_CHECKS.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
