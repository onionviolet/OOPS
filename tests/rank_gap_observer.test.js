import test from "node:test";
import assert from "node:assert/strict";
import {commitWatch,previewWatch,loadSlice,defaultSlice,observerView,gapVerb,perceive,dialValues,watchCost} from "../src/rank_gap_observer.js";
import {configureUiPorts} from "../src/ui_ports.js";
import {domainRegistry} from "../src/domain_registry.js";
import {configureRankGap,publicQuote} from "../src/rank_gap_observer_domain.js";
import {PARADISE_IDS,PARADISE_KEYS} from "../src/book_world_paradise_ids.js";
const MIA="book.paradise.mia",HANK="book.paradise.hank",KING="book.paradise.philip_herbert",SU="book.paradise.su_xiao";
const ctx=(o={})=>({observerTier:0,stamina:10,items:{"Goa duty copy":1},facts:{"book.paradise.localPermit":true},...o});

test("the verb changes with the gap, not only its size",()=>{
  assert.deepEqual([0,1,2,3].map(g=>gapVerb(0,g)),["witness","witness","glimpse","blind"]);
  assert.equal(gapVerb(2,3),"witness");
  assert.equal(gapVerb(0,2,dialValues({harmGap:3,blindGap:4})),"witness");
});
test("witness reads only what the means can resolve, in the observer view",()=>{
  assert.equal(perceive(0,MIA,"sight").resolved,true);
  assert.equal(perceive(0,HANK,"sight").resolved,false);
  assert.match(perceive(0,HANK,"duty_copy").text,/Guard or contractor/);
  const r=commitWatch(defaultSlice(),ctx(),{subjectId:HANK,meansId:"duty_copy"});
  assert.equal(r.verb,"witness");
  assert.deepEqual(observerView(r.slice),[{subject:"Hank",verb:"witness",tier:"Guard or contractor on duty"}]);
  assert.equal(observerView(r.slice,"someone_else").length,0);
});
test("a glimpse harms, advances the clock, and enough strain closes sight until it recovers",()=>{
  const a=commitWatch(defaultSlice(),ctx(),{subjectId:KING,meansId:"local_permit"});
  assert.equal(a.verb,"glimpse");assert.equal(a.result.harm,1);assert.equal(a.slice.clock,2);assert.equal(observerView(a.slice)[0].tier,null);
  const o={strainLimit:2};
  const b=commitWatch(a.slice,ctx(),{subjectId:KING,meansId:"local_permit"},o);
  const c=commitWatch(b.slice,ctx(),{subjectId:KING,meansId:"local_permit"},o);
  assert.ok(c.slice.observers.player.closedUntil>c.slice.clock);
  const blocked=previewWatch(c.slice,ctx(),{subjectId:MIA,meansId:"sight"},o);
  assert.equal(blocked.eligible,false);assert.match(blocked.reasons[0],/dazzled/);
  const later=structuredClone(c.slice);later.clock=c.slice.observers.player.closedUntil+10;
  assert.equal(previewWatch(later,ctx(),{subjectId:MIA,meansId:"sight"},o).eligible,true);
});
test("a lower observer cannot witness the highest tier; the watch still costs time and never reveals tier",()=>{
  const r=commitWatch(defaultSlice(),ctx(),{subjectId:SU,meansId:"sight"});
  assert.equal(r.verb,"blind");assert.equal(r.slice.clock,2);assert.equal(observerView(r.slice)[0].tier,null);
  assert.doesNotMatch(JSON.stringify(r.result),/Soul-crystal/);
});
test("the soul ward is earned by enduring glimpses, and turns blind into a harmful glimpse (never a witness)",()=>{
  const c=ctx({facts:{"book.paradise.localPermit":true,"book.paradise.soulWard":true}});
  assert.equal(previewWatch(defaultSlice(),c,{subjectId:SU,meansId:"soul_ward"}).verb,"glimpse");
  let s=defaultSlice();const o={strainLimit:99};
  for(let i=0;i<3;i++){assert.equal(s.earned.soulWard,undefined);s=commitWatch(s,ctx(),{subjectId:KING,meansId:"local_permit"},o).slice;}
  assert.ok(s.earned.soulWard);
  assert.equal(observerView(commitWatch(s,c,{subjectId:SU,meansId:"soul_ward"},o).slice).find(x=>x.subject==="Su Xiao").tier,null);
});
test("means need their credential: no duty copy, no permit, no ward",()=>{
  assert.match(previewWatch(defaultSlice(),ctx({items:{}}),{subjectId:HANK,meansId:"duty_copy"}).reasons[0],/duty copy/);
  assert.equal(previewWatch(defaultSlice(),ctx({facts:{}}),{subjectId:KING,meansId:"local_permit"}).eligible,false);
  assert.equal(previewWatch(defaultSlice(),ctx({stamina:0}),{subjectId:MIA,meansId:"sight"}).eligible,false);
});
test("persistence: JSON round trip keeps the slice; a legacy save without it loads empty",()=>{
  const r=commitWatch(defaultSlice(),ctx(),{subjectId:KING,meansId:"local_permit"});
  assert.deepEqual(loadSlice(JSON.parse(JSON.stringify(r.slice))),r.slice);
  assert.deepEqual(loadSlice(undefined),defaultSlice());
  assert.deepEqual(loadSlice({}),defaultSlice());
});

test("preview quotes and gates on the true stamina per verb; commit spends exactly the quote",()=>{
  assert.equal(watchCost("witness"),1);assert.equal(watchCost("glimpse"),2);
  const tired=ctx({stamina:1}),a=previewWatch(defaultSlice(),tired,{subjectId:KING,meansId:"local_permit"});
  assert.equal(a.verb,"glimpse");assert.equal(a.costs.stamina,2);assert.equal(a.eligible,false);
  assert.equal(commitWatch(defaultSlice(),tired,{subjectId:KING,meansId:"local_permit"}).ok,false);
  for(const [subjectId,meansId] of [[MIA,"sight"],[KING,"local_permit"],[SU,"sight"]]){
    const c=ctx({stamina:2}),p=previewWatch(defaultSlice(),c,{subjectId,meansId}),r=commitWatch(defaultSlice(),c,{subjectId,meansId});
    assert.equal(r.result.stamina,p.costs.stamina);
  }
});

// Domain adapter against fake ports: the fallback and an injected host (the main.js seam).
const goaPorts=(stats,log=[])=>configureUiPorts({
  expansion:()=>({actors:{player:{worldId:PARADISE_IDS.goa,facts:{"book.paradise.localPermit":true}}}}),
  character:()=>({getFullStats:()=>stats,getItems:()=>({[PARADISE_KEYS.proof]:{count:1}})})});
const run=(subject,means)=>domainRegistry.command("rankGapObserver","watch").run(subject,means);
const slice=()=>domainRegistry.project("rankGapObserver","slice");
test("fallback without a host: one local clock increment, stamina edited only when affordable",()=>{
  configureRankGap(null);domainRegistry.initialize();const stats={stamina:5};goaPorts(stats);
  assert.equal(run(KING,"local_permit").ok,true);
  assert.equal(slice().clock,2);assert.equal(stats.stamina,3);
  stats.stamina=1;const r=run(KING,"local_permit");
  assert.equal(r.ok,false);assert.equal(stats.stamina,1);assert.equal(slice().clock,2);
});
test("with a host, one watch moves the slice clock by watchMinutes exactly once and the host owns stamina",()=>{
  domainRegistry.initialize();const stats={stamina:5},calls=[];goaPorts(stats);
  configureRankGap({settle:({minutes,stamina})=>{calls.push({minutes,stamina});domainRegistry.tick(minutes);}}); // what main.js does after persisting the plan
  assert.equal(run(KING,"local_permit").ok,true);
  assert.deepEqual(calls,[{minutes:2,stamina:2}]);assert.equal(slice().clock,2);assert.equal(stats.stamina,5);
  domainRegistry.tick(3);assert.equal(slice().clock,5); // ordinary elapsed time still counts
  configureRankGap({settle:()=>{throw new Error("Finish the current work first.");}});
  const before=slice(),r=run(KING,"local_permit");
  assert.equal(r.ok,false);assert.deepEqual(slice(),before);
  configureRankGap(null);
});
test("non-leakage: the public view and quote never name an unresolved tier or verb",()=>{
  domainRegistry.initialize();goaPorts({stamina:9});configureRankGap(null);
  const q=publicQuote(SU,"sight");assert.equal(q.stamina,"1 to 2");assert.equal(publicQuote(MIA,"sight").stamina,1);
  run(SU,"sight");run(HANK,"sight");
  const view=domainRegistry.project("rankGapObserver","view"),text=JSON.stringify(view);
  assert.doesNotMatch(text,/Soul-crystal|Guard or contractor|Palace-linked|"tier":[1-9]/); // what the player went through (seen verbs) is theirs; resolved tiers are not
  assert.ok(view.seen.every(x=>x.tier===null));
  assert.equal(view.subjects.every(s=>!("verb" in s.preview)),true);
});
test("snapshot validity: save, validate, load round trip; legacy envelope and unused slice",()=>{
  domainRegistry.initialize();goaPorts({stamina:9});configureRankGap(null);
  assert.equal(domainRegistry.save({}).rankGapObserver,undefined);
  run(MIA,"sight");const env=JSON.parse(JSON.stringify(domainRegistry.save({})));
  assert.doesNotThrow(()=>domainRegistry.validate(env));assert.throws(()=>domainRegistry.validate({rankGapObserver:{version:2}}));
  const saved=slice();domainRegistry.initialize();assert.equal(slice().clock,0);
  domainRegistry.load(env);assert.deepEqual(slice(),saved);
  domainRegistry.load({});assert.deepEqual(slice(),defaultSlice());
});
