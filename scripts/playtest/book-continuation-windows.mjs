// Rebuilt desktop playthrough for the locally installed source packs.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {Session} from './lib.mjs';
import {NativeContinuation} from './native-continuation.mjs';
import {serve} from '../perf/lib.mjs';

const [mode,build,reviewFile,output,seedFile]=process.argv.slice(2);
assert(['hp','lotm'].includes(mode)&&build&&reviewFile&&output,'Use <hp|lotm> <build> <review.json> <out> [seed.json]');
const review=JSON.parse(await readFile(reviewFile));
await mkdir(output,{recursive:true});
const server=await serve(resolve(build));
const session=await new Session({url:server.url+'?test_hooks=1',seed:7,wall:Date.UTC(2026,10,8),opTimeout:90000}).start();
const route=new NativeContinuation(session,{panel:mode,attrPrefix:mode,stepLimit:100,workBatchTicks:1000});
const hp='book.hp.lead', W=hp+'.w6.';
const state=()=>route.snapshot();
const save=async name=>writeFile(join(output,name),JSON.stringify(await session.save()));
const hash=async file=>createHash('sha256').update(await readFile(file)).digest('hex');
const receipt={mode,bundle:await hash(join(build,'dist/bundle.js')),pack:await hash(join(build,'private_packs',mode+'-cast','cast.json')),steps:[]};
const next=()=>route.view().then(v=>v.arc.next?.id);
const boot=async()=>{
 const p=session.page;
 await p.waitForFunction(()=>window.simulationTestHooks&&
  (document.getElementById('loading_screen_play_button')?.checkVisibility()||document.getElementById('loading_screen')?.style.visibility==='hidden'),null,{timeout:60000});
 await p.evaluate(()=>simulationTestHooks.pause());
 const play=p.locator('#loading_screen_play_button');if(await play.isVisible())await play.click({force:true});
 await route.panel();
};
async function act(id){
 assert.equal(await next(),id);
 const before=await state();
 await route.startCurrent({exact:true});
 await route.settle();
 const after=await state();
 assert(after.expansion.clock>before.expansion.clock,id);
 assert.equal(after.expansion.actors.player.completed[id],1,id);
 receipt.steps.push({id,clock:after.expansion.clock});
 console.log(id,after.expansion.clock);
 return after;
}
const hpFact=(s,key)=>s.expansion.actors.player.facts[key];
const lotmFact=(s,key)=>s.expansion.worlds['book.lotm.tingen'].facts[key];
const knowledge=(s,key)=>s.expansion.simulation.knowledge.player[key];
const position=s=>s.expansion.simulation.people.player.location;
function advanceFixture(save,target){
 const diff=target-save.expansion.clock;
 assert(diff>0);
 assert.equal(save.expansion.simulation.jobs.length,0);
 for(const family of ['checks','controllers'])for(const row of Object.values(save.expansion.simulation[family]??{}))row.due+=diff;
 save.expansion.clock=target;
 const t=save['current time'],minutes=t.hour*60+t.minute+diff,days=Math.floor(minutes/1440);
 t.minute=minutes%60;t.hour=Math.floor(minutes%1440/60);t.day_count+=days;t.day+=days;
 const months=Math.floor((t.day-1)/30);t.day-=months*30;t.month+=months;
 const years=Math.floor((t.month-1)/12);t.month-=years*12;t.year+=years;
}
let compare;
try {
 if(mode==='lotm'){
  await route.load(JSON.parse(await readFile(seedFile)));
  const before=await state();
  assert.equal(before.expansion.clock,20893);
  assert.equal(lotmFact(before,'household.opening.revolver.rounds'),5);
  const inside='divination.book.lotm.kj3ag.query.inside.interpretation';
  const outside='divination.book.lotm.kj3ag.query.outside.interpretation';
  assert(knowledge(before,inside)&&knowledge(before,outside));
  for(const row of review.acts)await act(row.id);
  const check=s=>{
   assert.equal(lotmFact(s,'household.opening.revolver.rounds'),2);
   assert.equal(lotmFact(s,'operation.item.custody'),lotmFact(before,'operation.item.custody'));
   assert.equal(lotmFact(s,'operation.item.mode'),'agitated');
   assert.equal(position(s),position(before));
   assert.equal(hpFact(s,'book.lotm.kj3ah.held-entry'),true);
   assert.deepEqual(knowledge(s,inside),knowledge(before,inside));
   assert.deepEqual(knowledge(s,outside),knowledge(before,outside));
   assert.deepEqual(s.inventories,before.inventories);
  };
  compare=check;
 }else{
  if(seedFile)await route.load(JSON.parse(await readFile(seedFile)));
  else {
   await session.open();
   const p=session.page;
   await p.locator('#workspace_navigation select').selectOption('beginning');
   await p.locator('[data-structured-choice="life"]').selectOption(hp);
   await p.locator('[data-structured-begin]').click();
   await route.panel();
   let id;
   while((id=await next())!==hp+'.arrive_school') {
    assert(id&&receipt.steps.length<100,'household reaches the train');
    await act(id);
   }
   await save('earned-household.save.json');
   const atHome=await session.save();
   assert.equal(position(atHome),hp+'.homebound');
   assert.equal(await session.page.locator(`[data-hp="${hp}.arrive_school"]`).isDisabled(),true);
   const term=knowledge(atHome,hp+'.opening').at+32*1440-480+8*60;
   advanceFixture(atHome,term);
   await writeFile(join(output,'pre-train.clock-fixture.json'),JSON.stringify(atHome));
   await route.load(atHome);
  }
  const start=await state(), rows=review.schoolWeek.acts;
  const split=rows.findIndex(x=>x.id===review.schoolWeek.placementAfter);
  const ids=[hp+'.arrive_school',...rows.slice(0,split+1).map(x=>x.id),hp+'.sorting',...rows.slice(split+1).map(x=>x.id)];
  const first=ids.indexOf(await next());assert(first>=0);
  for(const id of ids.slice(first)){
   if(id===W+'preference')assert.equal(hpFact(await state(),'hp.lead.house'),undefined);
   const after=await act(id);
   if(id===hp+'.arrive_school'){
    assert.equal(position(after),hp+'.school_hall');
    assert.equal(hpFact(after,'hp.lead.house'),undefined);
    await save('arrived.save.json');
   }
   if(id===W+'preference')assert.equal(hpFact(after,'hp.lead.house'),undefined);
   if(id===hp+'.sorting')assert.equal(hpFact(after,'hp.lead.house'),'gryffindor');
   if(id===W+'reply')await save('friday-reply.save.json');
   if(id===W+'potions-prepare')await save('friday-prepared.save.json');
  }
  compare=s=>{
   assert.equal(position(s),hp+'.school_hall');
   assert.equal(hpFact(s,'hp.lead.house'),'gryffindor');
   assert.equal(hpFact(s,W+'placement.request'),'avoid-slytherin');
   assert.equal(hpFact(s,W+'tea.accepted'),true);
   assert.equal(hpFact(s,W+'potions.quiz-deduction'),1);
   assert.equal(hpFact(s,W+'potions.spill-deduction'),1);
   assert.equal(hpFact(s,W+'clipping.considered'),true);
   assert.equal(hpFact(s,'hp.lead.potions.flask'),undefined);
   assert.equal(s.expansion.simulation.powers.player?.[hp+'.levitation'],undefined);
   assert(knowledge(s,W+'clipping.seen'));
   assert(s.expansion.clock-start.expansion.clock>=rows.slice(Math.max(0,first-2)).reduce((sum,row)=>sum+row.minutes,0));
  };
 }
 assert((await route.view()).arc.done);
 compare(await state());
 await save('completed-checkpoint.json');
 await session.page.reload();
 await boot();
 compare(await state());
 const literal=await session.page.evaluate(()=>save_to_file());
 await route.imported(literal);
 compare(await state());
 assert((await route.view()).arc.done);
 assert.equal((await session.uiCheck()).pageOverflow,0);
 assert.deepEqual(session.errors.filter(e=>e.kind==='pageerror'),[]);
 await session.page.locator(`[data-${mode}-arc]`).scrollIntoViewIfNeeded();
 await session.page.screenshot({path:join(output,'end-1920x1080.png')});
 await writeFile(join(output,'browser-result.json'),JSON.stringify({...receipt,persistence:true,pageErrors:0,viewport:'1920x1080'},null,2));
} catch(error) {
 await session.page?.screenshot({path:join(output,'failure.png')}).catch(()=>{});
 const card=await session.page?.locator(`[data-${mode}-arc]`).first().innerText({timeout:1000}).catch(()=>'');
 await writeFile(join(output,'failure.json'),JSON.stringify({error:String(error.stack||error),card,errors:session.errors,steps:receipt.steps},null,2));
 throw error;
} finally {
 await session.close();
 await server.close();
}
