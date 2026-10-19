// The real host update_timer calls advanceChroniclePlan and persistExpansion.
// This supplies a deterministic played-minute interval, with no counter edit.
globalThis.advance=async n=>{await page.evaluate(HOLD);const s=await saved(),fn=fs.readFileSync(root+'/dist/bundle.js','utf8').match(/function (\w+)\(\w+,\w+=null\)\{if\(\w+\.pendingStructured&&!\w+\.structured/)[1];const panel=fs.readFileSync(root+'/dist/bundle.js','utf8').match(/new Map\(\[\.\.\.\w+,\.\.\.\w+\]\),(\w+),\w+=""/)[1];const consumed=await frameEval('(()=>{const n='+fn+'('+n+');'+panel+'?.render(true);return n;})()');assert.equal(consumed,n);const after=await saved();assert.equal(after.expansion.clock,s.expansion.clock+n);return after;};
globalThis.fastAct=async id=>{
 globalThis.stage=id;
 await page.waitForFunction(id=>{const e=document.querySelector('[data-structured-action="p10.'+id+'"]');return e&&!e.disabled;},id,{timeout:8000});
 const s=await act(id,true),job=s.expansion.simulation.jobs.find(j=>j.commandId==='p10.'+id);
 if(job){const after=await advance(job.due-s.expansion.clock);assert(!after.expansion.simulation.jobs.some(j=>j.id===job.id));return after;}return s;
};
return 'controlled clock ready';
