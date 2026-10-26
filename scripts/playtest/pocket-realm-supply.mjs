// Synthetic Glasshouse scenario, no player profile. Direct execution runs rebuilt browser proof.
import {createExpansionState,advanceSimulation,loadExpansionState} from '../../src/expansion_engine.js';
import {expeditionRegistry as registry,initializeExpedition} from '../../src/expedition_content.js';
import {encodeSaveFile} from '../../src/save_files.js';
import {enrollSimulation} from '../../src/simulation.js';
import {commitPocketRealmAction,pocketContext} from '../../src/pocket_realm_host.js';
import {createWorldInstance,createWorldVisit} from '../../src/world_instances.js';
import {createPocketDoorConnection} from '../../src/pocket_realm_rules.js';
import {GLASSHOUSE_DEFINITION as definition,GLASSHOUSE_CONTENT as content} from '../../src/realm_state.js';
import {FOLDED_GLASSHOUSE_IDS as ids} from '../../src/pocket_realm_content.js';
export const WOOD=JSON.stringify({id:'Rough wood log'}),KIT=JSON.stringify({id:'Prepared survey kit'}),TEMPLATE=JSON.stringify({id:'Sealing template'});
export const CARETAKER=content.caretakerId,PREFIX=content.bindings.worldFactPrefix;
export const supplyContext=p=>pocketContext(p.state,{actorId:'player',external:p.external,gameplay:p.gameplay,
 vitals:{player:{health:30,max_health:30,stamina:30,max_stamina:30}},facts:{location:'Folded Glasshouse',strength:10}});
export const supplyAct=(p,name,sequence=p.state.sequence)=>commitPocketRealmAction(p.state,registry,`${PREFIX}.${name}`,supplyContext(p),sequence);
export const supplyTick=(p,n)=>advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{facts:supplyContext(p).facts,vitals:supplyContext(p).vitals.player}});
export const supplyReload=p=>({...structuredClone(p),state:initializeExpedition(loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry))});
export function createSupplyFixture(){
 let state=initializeExpedition(createExpansionState(606));
 let p=enrollSimulation(state,registry,{actorId:'player',external:{money:30},gameplay:{player:{inventory:{[WOOD]:20,[KIT]:4},skills:{},reputation:{}}},facts:{location:'Village'}});
 state=p.state;state.worlds[ids.worldId]={facts:{},resources:{},completed:{}};
 const instance=createWorldInstance(definition,{id:ids.instanceId,continuityId:'frontier.glasshouse.branch',eraId:'frontier.present',playedAt:state.clock,parentInstanceId:'frontier.main',actorIds:[]});
 const visit=createWorldVisit(instance,{id:'glasshouse.visit.supply_fixture',actorId:'player',endpoint:content.endpoint,playedAt:state.clock},definition,{actorIds:Object.keys(state.actors),visits:[]});
 const connection=createPocketDoorConnection();connection.open=true;connection.openedAt=state.clock;
 state.realmPrototype={schema:2,instances:{[ids.instanceId]:instance},visits:[visit],activeVisitId:visit.id,offeredElapsed:null,receipts:[],connection};
 state.actors.player.worldId=ids.worldId;state.simulation.people.player.location='Folded Glasshouse';
 p=supplyAct(p,'meet');p=supplyTick(supplyAct(p,'repair_ordinary'),4);
 return p;
}
if(process.argv[1]===new URL(import.meta.url).pathname){
 const {default:assert}=await import('node:assert/strict');
 const fs=await import('node:fs/promises'),path=await import('node:path');
 const {createServer}=await import('node:http'),{createHash}=await import('node:crypto'),{createRequire}=await import('node:module');
 const {launchChrome,openNotebook}=createRequire(import.meta.url)('../ui_helpers.cjs');
 const output=process.env.BUILD_OUT||'/tmp/oops-m6-supply-frozen-build-20261026';
 const evidence=path.resolve('docs/gm/dispatch/minecraft-cultivation-mods-2026-10-25/implementation-2026-10-26/evidence/L6');
 const server=createServer(async(req,res)=>{try{const pathname=new URL(req.url,'http://localhost').pathname;let file=path.resolve(output,'.'+decodeURIComponent(pathname));assert.ok(file.startsWith(output+'/')||file===output);if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html');res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.json':'application/json','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream');res.end(await fs.readFile(file));}catch{res.writeHead(404).end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;
 const browser=await launchChrome(),errors=[],matrix=[],receipt={route:'DEV SEEDED S1 stocked repaired Glasshouse, earned meet/repair commands in fixture builder',origin};
 const snapshot=page=>page.evaluate(()=>simulationTestHooks.snapshot());
 const boot=async page=>{await page.waitForFunction(()=>window.simulationTestHooks);await page.evaluate(()=>simulationTestHooks.pause());await page.getByText('PLAY',{exact:true}).click();if(await page.getByText('Confirm',{exact:true}).isVisible())await page.getByText('Confirm',{exact:true}).click();await page.waitForFunction(()=>{const s=simulationTestHooks.saveStatus();return s.ownsSave&&!s.restoring&&s.writeBlocked!=='Restore writable saving.';});await page.evaluate(()=>simulationTestHooks.pause());};
 const open=async fixture=>{const context=await browser.newContext({viewport:{width:1920,height:1080}});if(fixture)await context.addInitScript(s=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(s));},fixture);const page=await context.newPage();page.setDefaultTimeout(12000);page.on('pageerror',e=>{errors.push(e.stack);console.error('pageerror',e.stack);});current={page,context};await page.goto(origin+'/?test_hooks=1');await boot(page);return {page,context};};
 const button=(page,name)=>page.locator(`[data-pocket-realm="${name.startsWith('pocket.')?name:PREFIX+'.'+name}"]`);
 const panel=async page=>{await page.getByRole('combobox',{name:'Other known panels'}).selectOption('notebook');await page.locator('[data-notebook-view="here"]').click();await page.locator('#pocket_realm_panel').evaluate(n=>n.open=true);};
 const click=async(page,name)=>{await panel(page);await button(page,name).click();};
 const step=(page,n)=>page.evaluate(n=>advanceTicks(n,{render:true}),n);
 const save=async page=>{await page.evaluate(()=>window.saveProgress());return snapshot(page);};
 let current;
 try{
  console.log("phase fresh");current=await open();const seed=await snapshot(current.page);receipt.freshOldStateNoRealm=seed.expansion.realmPrototype==null;await current.context.close();
  const fixture=structuredClone(seed),p=createSupplyFixture();
  fixture.expansion=p.state;fixture.expansion.simulation.knowledge.player[PREFIX+'.lead']={...structuredClone(p.state.simulation.knowledge.player[PREFIX+'.meeting']),value:'DEV SEEDED known doorway route for S1 workshop scenario.'};fixture.character.money=p.external.money;fixture['current location']='Folded Glasshouse';fixture.availabilities.location['Folded Glasshouse']=1;
  for(const [key,count] of Object.entries(p.gameplay.player.inventory))fixture.inventories.person.main_character[key]={count};
  await fs.writeFile(path.join(evidence,'fixture.json'),JSON.stringify(fixture));
  console.log("phase fixture");current=await open(fixture);let {page}=current;await panel(page);
  const baseline=await snapshot(page);assert.equal(baseline['current location'],'Folded Glasshouse');
  console.log('phase commission');await click(page,'commission_kits');const pending=await save(page);
  assert.equal(pending.character.money,baseline.character.money-2);assert.equal(pending.expansion.simulation.owners[CARETAKER][WOOD],baseline.expansion.simulation.owners[CARETAKER][WOOD]-2);
  assert.equal(pending.inventories.person.main_character[KIT].count,baseline.inventories.person.main_character[KIT].count);
  await page.reload();await boot(page);await panel(page);assert.equal((await snapshot(page)).expansion.simulation.jobs.filter(j=>j.commandId.endsWith('.commission_kits')).length,1);
  await step(page,3);const done=await save(page);assert.equal(done.inventories.person.main_character[KIT].count,baseline.inventories.person.main_character[KIT].count+2);
  assert.equal(done.expansion.actors[CARETAKER].resources.coins,baseline.expansion.actors[CARETAKER].resources.coins+2);
  receipt.pendingReloadAndComplete=true;
  await click(page,'supply_logs');const supplied=await save(page);assert.equal(supplied.expansion.simulation.owners[CARETAKER][WOOD],done.expansion.simulation.owners[CARETAKER][WOOD]+2);
  await click(page,'commission_kits');await click(page,'pocket.cancel');const cancelled=await save(page);assert.equal(cancelled.character.money,supplied.character.money);assert.deepEqual(cancelled.expansion.simulation.owners[CARETAKER],supplied.expansion.simulation.owners[CARETAKER]);receipt.cancellation=true;
  await click(page,'shut_bench');assert.equal(await button(page,'commission_kits').isDisabled(),true);assert.match(await button(page,'commission_kits').locator('..').innerText(),/Uncover the repaired bench/);
  await page.screenshot({path:path.join(evidence,'blocked-covered-bench.png')});await click(page,'reopen_bench');receipt.visibleBenchBlocker=true;
  console.log('phase matrix');for(const [width,height] of [[1920,1080],[1536,864]])for(const size of [14,21]){
   // Use the native Appearance control via its saved typography owner.
   await page.setViewportSize({width,height});
   const state=await save(page);state.customization.profiles.Default.settings.typography.size=size;
   const literal=encodeSaveFile(JSON.stringify(state));await Promise.all([page.waitForEvent('load'),page.evaluate(s=>window.load_progress(s),literal)]);await boot(page);await panel(page);
   await button(page,'commission_kits').scrollIntoViewIfNeeded();assert.equal(await button(page,'commission_kits').isEnabled(),true);
   const box=await button(page,'commission_kits').boundingBox();assert.ok(box.width>100&&box.x>=0&&box.x+box.width<=width+1);
   const actualFont=await button(page,'commission_kits').evaluate(n=>getComputedStyle(n).fontSize);
   await page.screenshot({path:path.join(evidence,`commission-${width}-${size}.png`)});matrix.push({width,height,size,actualFont,buttonBounds:box});
  }
  console.log('phase persistence');const beforeReload=await save(page);await page.reload();await boot(page);assert.deepEqual((await snapshot(page)).expansion,beforeReload.expansion);
  const exported=await page.evaluate(()=>window.save_to_file());await fs.writeFile(path.join(evidence,'native-export.txt'),exported);
  await Promise.all([page.waitForEvent('load'),page.locator('#saved_file_input').setInputFiles({name:'m6-generated.txt',mimeType:'text/plain',buffer:Buffer.from(exported)})]);await boot(page);
  assert.deepEqual((await snapshot(page)).expansion,beforeReload.expansion);receipt.saveReloadExportLiteralImport=true;
  await fs.writeFile(path.join(evidence,'final-generated.json'),JSON.stringify(await snapshot(page)));
  receipt.bundleHash=createHash('sha256').update(await fs.readFile(path.join(output,'dist/bundle.js'))).digest('hex');receipt.matrix=matrix;receipt.pageErrors=errors;assert.deepEqual(errors,[]);
  await fs.writeFile(path.join(evidence,'browser-result.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));
 }catch(error){if(current?.page){await current.page.screenshot({path:path.join(evidence,'failure.png')}).catch(()=>{});console.error('PAGE ERRORS',errors);console.error('SAVE STATUS',await current.page.evaluate(()=>simulationTestHooks.saveStatus()).catch(()=>null));console.error((await current.page.locator('body').innerText().catch(()=>'' )).slice(-3500));}throw error;}
 finally{await current?.context.close();await browser.close();await new Promise(r=>server.close(r));}
}
