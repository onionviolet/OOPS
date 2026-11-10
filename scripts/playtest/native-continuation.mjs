// Reused native UI route plumbing. Content assertions and private fixtures stay
// with the caller; this helper neither seeds progress nor edits simulation state.
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
export class NativeContinuation {
 constructor(session,{panel='lotm',attrPrefix='lotm',stepLimit=800,ticksPerMinute=50,workBatchTicks=10}={}){
  assert(Number.isSafeInteger(workBatchTicks)&&workBatchTicks>0&&workBatchTicks<=1000000,'Invalid native work batch.');
  Object.assign(this,{session,panelId:panel,attr:attrPrefix,stepLimit,ticksPerMinute,workBatchTicks,timings:[]});
 }
 sel(name){return `[data-${this.attr}-${name}]`;}
 get page(){return this.session.page;}
 async measured(phase,fn){const at=performance.now();try{return await fn();}finally{this.timings.push({phase,ms:performance.now()-at});}}
 snapshot(){return this.page.evaluate(()=>{const s=simulationTestHooks.snapshot();delete s.saved_at;return s;});}
 view(){return this.page.evaluate(id=>simulationTestHooks.project(id),this.panelId);}
 async panel(){await this.page.locator('#workspace_navigation select').selectOption(this.panelId);await this.page.locator(this.sel('arc')).waitFor();}
 async load(save){return this.measured('boot',async()=>{await this.session.open(save);await this.panel();});}
 async settle(){return this.measured('settle',async()=>{for(let i=0;i<this.stepLimit;i++){
  if(!(await this.view()).jobs.length)return;
  await this.page.evaluate(({limit,batch})=>{const clock=()=>simulationTestHooks.clock?.()??simulationTestHooks.snapshot().expansion.clock;const c=clock();if(simulationTestHooks.workTicks){simulationTestHooks.workTicks(batch);if(clock()>c)return;}else for(let t=0;t<limit;t++){advanceTicks(1);if(clock()>c)return;}throw Error('Accepted local work clock did not advance.');},{limit:this.ticksPerMinute,batch:this.workBatchTicks});
 }throw Error('Bounded work did not finish.');});}
 async startCurrent({exact=false,beforeClick=null}={}){return this.measured('native-action',async()=>{
  const v=await this.view();assert(v.arc?.next,'Expected a current native task');const before=await this.snapshot();
  // The current-task card can contain the native action itself. Older/world
  // panels still expose a read-only link to an action elsewhere in the panel.
  const inline=this.page.locator(`${this.sel('arc')} [data-${this.attr}="${v.arc.next.id}"]`).first();
  let id=v.arc.next.id,control=inline;
  if(!(await inline.count())){
   const link=this.page.locator(this.sel('task-link'));await link.click();assert.deepEqual(await this.snapshot(),before,'task navigation is read-only');
   id=await link.getAttribute(`data-${this.attr}-task-link`);assert(id);
   control=this.page.locator(`[data-${this.attr}="${id}"]`).first();
  }
  if(exact)assert.equal(id,v.arc.next.id);
  assert.equal(await control.isDisabled(),false,await this.page.locator(this.sel('arc')).innerText());
  await beforeClick?.({id,control});await control.click();return {id,command:v.arc.next.id};
 });}
 async imported(encoded){return this.measured('import',async()=>{
  await this.page.evaluate(e=>load_progress(e),encoded);await this.page.waitForLoadState('domcontentloaded');
  await this.page.waitForFunction(()=>window.simulationTestHooks&&document.getElementById('loading_screen_play_button')?.checkVisibility(),null,{timeout:60000});
  await this.page.evaluate(()=>simulationTestHooks.pause());await this.page.locator('#loading_screen_play_button').click();await this.panel();
 });}
}
