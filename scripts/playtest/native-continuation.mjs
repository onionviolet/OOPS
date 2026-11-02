// Reused native UI route plumbing. Content assertions and private fixtures stay
// with the caller; this helper neither seeds progress nor edits simulation state.
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
export class NativeContinuation {
 constructor(session,{panel='lotm',stepLimit=800,ticksPerMinute=50}={}){Object.assign(this,{session,panelId:panel,stepLimit,ticksPerMinute,timings:[]});}
 get page(){return this.session.page;}
 async measured(phase,fn){const at=performance.now();try{return await fn();}finally{this.timings.push({phase,ms:performance.now()-at});}}
 snapshot(){return this.page.evaluate(()=>{const s=simulationTestHooks.snapshot();delete s.saved_at;return s;});}
 view(){return this.page.evaluate(id=>simulationTestHooks.project(id),this.panelId);}
 async panel(){await this.page.locator('#workspace_navigation select').selectOption(this.panelId);await this.page.locator('[data-lotm-arc]').waitFor();}
 async load(save){return this.measured('boot',async()=>{await this.session.open(save);await this.panel();});}
 async settle(){return this.measured('settle',async()=>{for(let i=0;i<this.stepLimit;i++){
  if(!(await this.view()).jobs.length)return;
  await this.page.evaluate(limit=>{const clock=()=>simulationTestHooks.clock?.()??simulationTestHooks.snapshot().expansion.clock;const c=clock();if(simulationTestHooks.workTicks){simulationTestHooks.workTicks(10);if(clock()>c)return;}else for(let t=0;t<limit;t++){advanceTicks(1);if(clock()>c)return;}throw Error('Accepted local work clock did not advance.');},this.ticksPerMinute);
 }throw Error('Bounded work did not finish.');});}
 async startCurrent({exact=false,beforeClick=null}={}){return this.measured('native-action',async()=>{
  const v=await this.view();assert(v.arc?.next,'Expected a current native task');const before=await this.snapshot();
  await this.page.locator('[data-lotm-task-link]').click();assert.deepEqual(await this.snapshot(),before,'task navigation is read-only');
  const id=await this.page.locator('[data-lotm-task-link]').getAttribute('data-lotm-task-link');assert(id);if(exact)assert.equal(id,v.arc.next.id);
  const control=this.page.locator(`[data-lotm="${id}"]`).first();assert.equal(await control.isDisabled(),false,await this.page.locator('[data-lotm-arc]').innerText());
  await beforeClick?.({id,control});await control.click();return {id,command:v.arc.next.id};
 });}
 async imported(encoded){return this.measured('import',async()=>{
  await this.page.evaluate(e=>load_progress(e),encoded);await this.page.waitForLoadState('domcontentloaded');
  await this.page.waitForFunction(()=>window.simulationTestHooks&&document.getElementById('loading_screen_play_button')?.checkVisibility(),null,{timeout:60000});
  await this.page.evaluate(()=>simulationTestHooks.pause());await this.page.locator('#loading_screen_play_button').click();await this.panel();
 });}
}
