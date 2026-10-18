const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {fresh,play,create,stored}=require('../../checks/leak_lint.cjs');
const OUT=__dirname;const write=(n,v)=>fs.writeFileSync(path.join(OUT,n),typeof v==='string'?v:JSON.stringify(v,null,2));
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try {
  const seed=await fresh(b);await play(seed.p);await create(seed.p,true);
  await seed.p.locator('#character_name_field').fill('LQ NATIVE CONTROL');await seed.p.locator('#character_name_field').dispatchEvent('change');
  const healthy=await stored(seed.p);const original=JSON.stringify(healthy);
  write('healthy-native.save.json',original);await seed.ctx.close();
  const id=Object.keys(healthy.cheats.held)[0];const invalid=structuredClone(healthy);
  invalid.cheats.held[id].card.hooks={}; // one field, incompatible future shape
  const raw=JSON.stringify(invalid);write('invalid-native.save.json',raw);
  const encoded='YAIR-UTF8-1:'+Buffer.from(raw).toString('base64');write('invalid-native.save.txt',encoded);
  const result={mutation:{path:`cheats.held[${id}].card.hooks`,before:[],after:{}},healthySHA256:crypto.createHash('sha256').update(original).digest('hex'),invalidSHA256:crypto.createHash('sha256').update(raw).digest('hex')};
  // Control uses the same genuine serialized envelope with no mutation.
  const control=await fresh(b,original);await play(control.p);
  result.control={saved:!!(await stored(control.p)),errors:control.p.errors,name:await control.p.locator('#character_name_field').inputValue()};await control.ctx.close();
  const load=await fresh(b,raw), consoleErrors=[]; // console listener added below; caught startup is in DOM
  load.p.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
  async function snap(p){return p.evaluate(()=>({loading:document.getElementById('loading_screen')?.innerText,play:document.getElementById('loading_screen_play_button')?.innerText,heroName:document.getElementById('character_name_field')?.value,time:document.getElementById('time_div')?.innerText||document.getElementById('time_field')?.innerText,body:document.body.innerText.slice(0,2500),log:document.getElementById('message_box_div')?.innerText,raw:localStorage.getItem('save data')}));}
  const before=await snap(load.p);await load.p.screenshot({path:path.join(OUT,'load-failure-before-play.png')});
  await play(load.p);const afterPlay=await snap(load.p);
  await load.p.waitForTimeout(3000);const afterWait=await snap(load.p);
  await load.p.locator('#save_button').click();await load.p.waitForTimeout(300);
  const exportResult=await load.p.evaluate(()=>window.save_to_file());const final=await snap(load.p);
  await load.p.screenshot({path:path.join(OUT,'load-failure-after-play.png')});
  const strip=x=>{const {raw,...rest}=x;return {...rest,rawUnchanged:raw===JSON.stringify(invalid)};};
  result.normalLoad={before:strip(before),afterPlay:strip(afterPlay),afterWait:strip(afterWait),final:strip(final),exportResult,pageErrors:load.p.errors,consoleErrors:load.p.consoleErrors,rawCardKept:JSON.stringify(JSON.parse(final.raw).cheats.held[id])===JSON.stringify(invalid.cheats.held[id])};
  await load.ctx.close();
  const imp=await fresh(b,original);await play(imp.p);await stored(imp.p);
  const preImportRaw=await imp.p.evaluate(()=>localStorage.getItem('save data'));
  await imp.p.evaluate(()=>{window.__lqWrites=[];const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='save data')window.__lqWrites.push({invalid:v.includes('"hooks":{}'),value:v});return set.call(this,k,v);};});
  await imp.p.setInputFiles('#saved_file_input',{name:'invalid-native.save.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)});
  await imp.p.waitForTimeout(1500);const imported=await snap(imp.p);
  const writes=await imp.p.evaluate(()=>__lqWrites);await imp.p.screenshot({path:path.join(OUT,'import-refusal.png')});
  result.import={log:imported.log,pageErrors:imp.p.errors,rawUnchanged:imported.raw===preImportRaw,invalidWritten:writes.some(x=>x.invalid),writeCount:writes.length,changedTopLevel:Object.keys(JSON.parse(imported.raw)).filter(k=>JSON.stringify(JSON.parse(imported.raw)[k])!==JSON.stringify(JSON.parse(preImportRaw)[k])),heldCardUnchanged:JSON.stringify(JSON.parse(imported.raw).cheats)===JSON.stringify(JSON.parse(preImportRaw).cheats),heldCardHealthy:Array.isArray(JSON.parse(imported.raw).cheats.held[id].card.hooks),heroName:imported.heroName};
  await imp.ctx.close();write('probe.json',result);console.log(JSON.stringify(result,null,2));
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=3;});
