// A native save produced by the shipped 0216ccde bundle, without workshop state.
const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const URL=process.env.YAIRPG_PROOF_URL||'http://127.0.0.1:18701/';
const OUT=process.env.YAIRPG_PROOF_DIR||'/tmp/systems-workshop-proof';
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),errors=[];
 const open=async(url,fixture)=>{const c=await b.newContext({viewport:{width:1366,height:768}});if(fixture)await c.addInitScript(d=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(d));},fixture);const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(url);await p.getByText('PLAY',{exact:true}).click();if(await p.getByText('Confirm',{exact:true}).isVisible())await p.getByText('Confirm',{exact:true}).click();await p.waitForFunction(()=>typeof window.saveProgress==='function');return {p,c};};
 const save=async p=>{await p.evaluate(()=>window.saveProgress());return p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
 try{let {p,c}=await open(URL+'.proof-old/');assert.equal(await p.locator('#systems_workshop_panel').count(),0);const old=await save(p);assert.equal(old.expansion.simulation,null);assert.equal(Object.keys(old.expansion.actors.player.facts).some(k=>k.startsWith('systems_workshop.')),false);fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(OUT+'/0216ccde-old-save.json',JSON.stringify(old));await c.close();
 ({p,c}=await open(URL,old));const checks=[];
 const unchanged=s=>{for(const key of ['expansion','inventories','equipment_durability','cheats','current location','village_career'])assert.deepEqual(s[key],old[key],key);
 // Newer content adds default availability keys; every old key must keep its value.
 const walk=(a,b,p)=>{for(const k of Object.keys(b)){if(b[k]&&typeof b[k]==='object')walk(a?.[k],b[k],p+'.'+k);else assert.deepEqual(a?.[k],b[k],p+'.'+k);}};walk(s.availabilities,old.availabilities,'availabilities');assert.equal(s.character.money,old.character.money);};
 unchanged(await save(p));checks.push('0216ccde absent-workshop native save loads with exact expansion, inventories, purse, location, availability, cheats and durability');
 await p.reload();await p.getByText('PLAY',{exact:true}).click();unchanged(await save(p));checks.push('old native save reload remains unchanged');
 const {encodeSaveFile}=await import('../src/save_files.js');const payload=encodeSaveFile(JSON.stringify(old));const importedLoad=p.waitForEvent('load');await p.locator('#saved_file_input').setInputFiles({name:'0216ccde-old-save.txt',mimeType:'text/plain',buffer:Buffer.from(payload)});await importedLoad;await p.getByText('PLAY',{exact:true}).click();unchanged(await save(p));checks.push('old native file import/export keeps absent workshop state unchanged');
 assert.deepEqual(errors,[]);fs.writeFileSync(OUT+'/LEGACY_PROOF.json',JSON.stringify({sourceCommit:'0216ccde',viewport:[1366,768],checks,errors},null,2));console.log(JSON.stringify({checks,errors}));await c.close();
 }finally{await b.close();}})();
