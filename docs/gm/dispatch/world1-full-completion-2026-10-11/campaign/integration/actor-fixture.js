// Seed only negative provider prerequisites with the game's real effect API.
// No pending job, reserve, completed count or charge is invented.
globalThis.actorEffect=async effects=>{
 const bundle=fs.readFileSync(root+'/dist/bundle.js','utf8');
 const beforeMarker=(marker)=>[...bundle.slice(0,bundle.indexOf(marker)).matchAll(/function (\w+)\(/g)].at(-1)?.[1];
 const effectFn=beforeMarker('Effects need a durable cause.');
 const contextFn=bundle.match(/function (\w+)\(\)\{let \w+=\w+\(\);return\{\.\.\.\w+\.player,registry:/)[1];
 const code='(()=>{const c='+contextFn+'();const p={state:'+bundle.match(/worldId:(\w+)\.actors\.player\.worldId,nativeBody:/)[1]+',external:c.external,gameplay:c.gameplay,vitals:c.vitals,acquisitions:[],unlocks:[]};'+effectFn+'(p,'+JSON.stringify(effects)+',c,c.registry,"w1c02.body.fixture");return true;})()';
 assert.equal(await frameEval(code),true);
};
globalThis.importCheckpoint=async name=>{await page.evaluate(HOLD);await Promise.all([page.waitForEvent('framenavigated'),page.locator('#saved_file_input').setInputFiles(tmp+'/'+name+'.txt')]);await page.waitForLoadState('domcontentloaded');await play();await page.evaluate(HOLD);};
return 'provider fixture ready';
