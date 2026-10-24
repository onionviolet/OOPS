const assert=require('node:assert/strict');
const {advanceGameMinutes}=require('../../../../scripts/ui_helpers.cjs');
// The panel lives in a parked (hidden) workspace module in this composition, so buttons are driven by DOM click and read by DOM state.
const btn=(page,token)=>({count:()=>page.locator(`#lotm_panel [data-lotm="${token}"]`).count(),
 isDisabled:()=>page.evaluate(t=>document.querySelector(`#lotm_panel [data-lotm="${t}"]`).disabled,token),
 waitFor:()=>page.waitForFunction(t=>document.querySelector(`#lotm_panel [data-lotm="${t}"]`),token,{polling:200}),
 click:()=>page.evaluate(t=>document.querySelector(`#lotm_panel [data-lotm="${t}"]`).click(),token)});
const text=page=>page.evaluate(()=>[...document.querySelectorAll('#lotm_panel p, #lotm_panel h3, #lotm_panel button, #lotm_panel [data-panel-row] span')].map(e=>e.textContent).join('\n'));
const title=page=>page.evaluate(()=>document.querySelector('#lotm_panel p')?.title||'');
const status=t=>t.split('\n').find(l=>/supervised by/.test(l));
const go=async(page,key)=>{await click(page,`lotm.move.${key}`);await advanceGameMinutes(page,36);};
async function click(page,token){const b=btn(page,token);await b.waitFor();assert.equal(await b.isDisabled(),false,`${token} is disabled`);await b.click();}
async function enroll(page,token='enroll'){await page.waitForFunction(t=>document.querySelector(`#lotm_panel [data-lotm="${t}"]`),token,{polling:250});await click(page,token);}
const money=page=>page.evaluate(()=>simulationTestHooks.snapshot().character.money);
async function persist(page,log,label){await page.evaluate(()=>window.saveProgress&&window.saveProgress());const raw=await page.evaluate(()=>localStorage.getItem('save data'));log.push(`${label}: save ${raw?.length} chars`);return raw;}
async function reloadCheck(page,url,log,expect){await page.reload();await page.getByText('PLAY',{exact:true}).click();await page.waitForFunction(()=>document.querySelector('#lotm_panel'),null,{polling:250});const t=await text(page);for(const e of expect)assert.match(t,e,`after reload: ${e}`);log.push('reload kept: '+expect.map(String).join(' '));}
// Export the save string, change state by walking, import the string and expect the exported state back.
async function importCheck(page,log,expect,walkAway='lotm.move.workroom'){
 const str=await page.evaluate(()=>window.save_to_file());assert.ok(str&&str.length>1000,'export string');
 await click(page,walkAway);await page.evaluate(s=>window.load_progress(s),str);await page.waitForTimeout(2500);
 await page.waitForFunction(()=>document.querySelector('#lotm_panel'),null,{polling:250});const t=await text(page);
 for(const e of expect)assert.match(t,e,`after import: ${e}`);log.push(`import of ${str.length}-char export restored: `+expect.map(String).join(' '));
 await page.getByText('PLAY',{exact:true}).click({timeout:1500}).catch(()=>{});}
// Give the disposable test save money by editing its own stored copy, then reload it (the only way a probationer can afford a market dose).
async function fund(page,amount){await page.evaluate(()=>window.saveProgress());await page.evaluate(n=>{const d=JSON.parse(localStorage.getItem('save data'));d.character.money=n;localStorage.setItem('save data',JSON.stringify(d));},amount);
 await page.reload();await page.getByText('PLAY',{exact:true}).click();await page.waitForFunction(()=>document.querySelector('#lotm_panel'),null,{polling:250});assert.equal(await money(page),amount);}
module.exports={
 // An old-candidate native save (university place id 'quarter', as the earlier candidate wrote it) is rewritten at the import seam.
 async alias({page,url,log:_l}){const log=[];
  await enroll(page,'enroll_machinery');await click(page,'book.lotm.report_in_machinery');await click(page,'book.lotm.accept_allocation_sv');await click(page,'book.lotm.ingest_sv');await click(page,'book.lotm.act_study');
  await page.evaluate(()=>window.saveProgress());
  const n=await page.evaluate(()=>{const raw=localStorage.getItem('save data');const old=raw.split('Tingen university area').join('Tingen university quarter');localStorage.setItem('save data',old);return [raw.split('Tingen university area').length-1,old.split('Tingen university quarter').length-1];});
  log.push(`rewrote ${n[1]} occurrences of the place id to the old candidate's id (keys, values, snapshots)`);assert.ok(n[1]>5);
  await reloadCheck(page,url,log,[/Savant pathway/,/Tingen university area/]);
  const state=await page.evaluate(()=>{const e=simulationTestHooks.snapshot();return {loc:e['current location'],jobs:e.expansion.simulation.jobs.map(j=>j.commandId),keys:Object.keys(e.locations||{}).filter(k=>/university/.test(k))};});
  assert.equal(state.loc,'Tingen university area');assert.deepEqual(state.jobs,['book.lotm.act_study']);assert.deepEqual(state.keys,['Tingen university area']);log.push('location, in-flight study job and native location map all came back under the new id');
  await advanceGameMinutes(page,31);assert.match(await text(page),/Savant potion feels settling/);log.push('the job finished after the rename');return log;},

 async scan({page}){await enroll(page,'enroll_machinery');await click(page,'book.lotm.report_in_machinery');
  const hits=await page.evaluate(()=>{window.saveProgress();const d=JSON.parse(localStorage.getItem('save data')),h=[];(function w(v,p){if(typeof v==='string'){if(v.includes('Tingen university'))h.push(p.join('.')+' = '+v.slice(0,60));}else if(v&&typeof v==='object')for(const [k,x] of Object.entries(v)){if(k.includes('Tingen university'))h.push('KEY '+p.join('.')+'.'+k);w(x,[...p,k]);}})(d,[]);return h;});return hits;},

 async sa({page,out,url}){const log=[];
  await enroll(page,'enroll_storm');await click(page,'book.lotm.report_in_storm');let t=await text(page);
  assert.match(t,/Tingen docks/);assert.doesNotMatch(t,/not endorsed here/);assert.match(await title(page),/Mandated Punishers answer here/);assert.match(t,/Sailor pathway/);assert.doesNotMatch(t,/Seer pathway|Savant pathway/);log.push('storm life: docks, Sailor ladder only');
  await click(page,'book.lotm.accept_allocation_sa');await click(page,'book.lotm.ingest_sa');
  for(let i=0;i<3;i++){await click(page,'book.lotm.act_mooring');await advanceGameMinutes(page,21);}
  await click(page,'book.lotm.act_dive');await advanceGameMinutes(page,31);t=await text(page);assert.match(t,/Sailor potion feels settled/);log.push('four acts settled');
  await click(page,'book.lotm.request_prescreen_sa');
  await click(page,'book.lotm.request_exam_sa');await advanceGameMinutes(page,61);await click(page,'book.lotm.ingest_folk');t=await text(page);assert.match(t,/Sequence 8 · Folk of Rage/);log.push('Storm senior deacon examined on merit; promoted');
  await click(page,'book.lotm.ab.fury_burst');const conds=await page.evaluate(()=>Object.keys(simulationTestHooks.snapshot().expansion.simulation.conditions.player||{}));
  assert.ok(conds.includes('book.lotm.rage_burst')&&conds.includes('book.lotm.rage_residue'));log.push('Folk of Rage ability used: effect and drawback conditions present');
  await persist(page,log,'sailor');await reloadCheck(page,url,log,[/Sequence 8 · Folk of Rage/]);await importCheck(page,log,[/Sequence 8 · Folk of Rage/],'lotm.move.workroom');
  await page.screenshot({path:out+'/sa-sailor.png'});return log;},
 async ab({page,out,url}){const log=[];
  await enroll(page);await click(page,'book.lotm.report_in');await click(page,'book.lotm.accept_allocation_cc');await click(page,'book.lotm.ingest_cc');
  await click(page,'book.lotm.ab.cold_ward');let conds=await page.evaluate(()=>Object.keys(simulationTestHooks.snapshot().expansion.simulation.conditions.player||{}));
  assert.ok(conds.includes('book.lotm.cold_ward')&&conds.includes('book.lotm.pallor'));log.push('Corpse Collector ability used: Cold-warded and its Deathly pallor drawback');
  const bio=await page.evaluate(()=>{const b=document.getElementById('character_show_bio');b&&b.click();return document.getElementById('character_bio_div')?.textContent||'';});
  assert.doesNotMatch(bio,/too pale and too cold|pale and cold to the touch/);log.push('own bio view shows no concealed look');
  await persist(page,log,'ability');await reloadCheck(page,url,log,[/Corpse Collector pathway/]);
  conds=await page.evaluate(()=>Object.keys(simulationTestHooks.snapshot().expansion.simulation.conditions.player||{}));assert.ok(conds.includes('book.lotm.pallor'));log.push('conditions kept after reload');
  return log;},

 async q6({page,out,url}){const log=[];
  await enroll(page,'enroll_machinery');await click(page,'book.lotm.report_in_machinery');let t=await text(page);
  assert.match(t,/Savant pathway/);assert.match(t,/Tingen university quarter/);assert.doesNotMatch(t,/not endorsed here/);assert.match(await title(page),/Machinery team answer here/);assert.match(t,/records officer's attention 6/);assert.doesNotMatch(t,/Seer pathway/);log.push('machinery life: university quarter, Savant ladder offered, no Seer');
  assert.equal(await btn(page,'book.lotm.accept_allocation').count(),0);
  await click(page,'book.lotm.accept_allocation_sv');await click(page,'book.lotm.ingest_sv');
  for(let i=0;i<3;i++){await click(page,'book.lotm.act_study');await advanceGameMinutes(page,31);}
  await click(page,'book.lotm.act_apply');await advanceGameMinutes(page,46);t=await text(page);assert.match(t,/Savant potion feels settled/);log.push('four acts: settled');
  await click(page,'book.lotm.request_prescreen_sv');assert.equal(await btn(page,'book.lotm.request_exam_sv').isDisabled(),false);log.push('pre-screened; the senior deacon can examine on merit, no wait gate');
  await persist(page,log,'pre-exam');await reloadCheck(page,url,log,[/Savant pathway/]);
    await click(page,'book.lotm.request_exam_sv');await advanceGameMinutes(page,61);t=await text(page);assert.match(t,/prepared Archaeologist dose/);log.push('senior deacon exam passed on merit; dose released');
  await click(page,'book.lotm.ingest_archaeologist');t=await text(page);assert.match(t,/Sequence 8 · Archaeologist/);log.push('promoted to Sequence 8 · Archaeologist');
  await persist(page,log,'promoted');await reloadCheck(page,url,log,[/Sequence 8 · Archaeologist/]);await importCheck(page,log,[/Sequence 8 · Archaeologist/],'lotm.move.lodging');
  await page.screenshot({path:out+'/q6-savant.png'});return log;},

 async b3({page,out,url}){const log=[];
  await enroll(page);await click(page,'book.lotm.report_in');await click(page,'book.lotm.accept_allocation');await click(page,'book.lotm.ingest');
  await fund(page,40000);log.push('funded the disposable save to 40000');
  await go(page,'docks');for(const t of ['pay','verify','settle'])await click(page,`book.lotm.lot_${t}_dose9_cc`);
  let t=await text(page);assert.match(t,/unmarked dose/);log.push('bought and verified the unmarked Sequence 9 dose (Corpse Collector)');
  await click(page,'book.lotm.drink_market_cc9');t=await text(page);assert.match(t,/You have lost control/);log.push('drank it on top of the Seer pathway: wrong pathway plus switching, loss line reached');
  await persist(page,log,'lost');await reloadCheck(page,url,log,[/You have lost control/]);
  const disabled=await page.evaluate(()=>[...document.querySelectorAll('#lotm_panel button[data-lotm^="book.lotm."]')].every(b=>true));
  await importCheck(page,log,[/You have lost control/],'lotm.move.workroom');
  await page.screenshot({path:out+'/b3-lost.png'});return log;},

 async q5({page,out,url}){const log=[];
  await enroll(page,'enroll_civil');await click(page,'book.lotm.report_in');await go(page,'docks');
  for(const t of ['pay','verify','settle'])await click(page,`book.lotm.lot_${t}_frog`);let m=await money(page);log.push(`frog trade closed, money ${m} (1200 - 36 - 12)`);assert.equal(m,1152);
  for(const t of ['pay','verify','reject'])await click(page,`book.lotm.lot_${t}_hairs`);m=await money(page);log.push(`forged hairs rejected, money ${m} (1152 - 12 check fee)`);assert.equal(m,1140);
  for(const t of ['pay','verify','settle'])await click(page,`book.lotm.lot_${t}_ink`);let t=await text(page);assert.match(t,/jar of grave-dust ink/);log.push('barter frog for ink closed');
  await persist(page,log,'broker');await reloadCheck(page,url,log,[/jar of grave-dust ink/,/forgery|appraiser/]);assert.equal(await money(page),1128,'after reload money (1140 - 12 ink check)');
  await importCheck(page,log,[/jar of grave-dust ink/],'lotm.move.workroom');assert.equal(await money(page),1128);
  await page.screenshot({path:out+'/q5-broker.png'});return log;},

 async q4({page,out,url}){const log=[];
  await enroll(page);await click(page,'book.lotm.report_in');let t=await text(page);
  assert.match(t,/Clearance · probationer/);assert.match(t,/Grade 3: needs formal member clearance/);assert.match(t,/Grade 2: needs captain or bishop clearance/);
  assert.equal(await btn(page,'book.lotm.request_sealed_3').isDisabled(),true);log.push('probationer: grade 3 and grade 2 both shut, reasons shown; request disabled');
  await click(page,'book.lotm.accept_allocation');await click(page,'book.lotm.ingest');t=await text(page);
  assert.match(t,/Clearance · formal member/);assert.match(t,/Grade 3: you may handle it here/);assert.match(t,/Grade 2: needs captain or bishop/);log.push('after the dose: formal member, grade 3 open (captain and member present), grade 2 still shut');
  await click(page,'book.lotm.request_sealed_3');t=await text(page);assert.match(t,/sealed grade 3 item/);log.push('signed out: holds sealed grade 3 item');
  await persist(page,log,'sealed out');await reloadCheck(page,url,log,[/sealed grade 3 item/]);
  await importCheck(page,log,[/sealed grade 3 item/],'lotm.move.lodging');
  await click(page,'book.lotm.return_sealed_3');t=await text(page);assert.doesNotMatch(t,/You hold:[^.]*sealed grade 3/);log.push('returned to the vault');
  await page.screenshot({path:out+'/q4-clearance.png'});return log;},

 async q3({page,out,url}){const log=[];
  await enroll(page,'enroll_civil');log.push(`civil clerk begins with ${await money(page)} money (5 pounds = 1200 pence)`);assert.equal(await money(page),1200);
  await click(page,'book.lotm.report_in');let t=await text(page);
  assert.match(t,/Sign the civil clerk's contract/);assert.doesNotMatch(t,/Accept the supervisor's allocated/);assert.doesNotMatch(t,/Decline the dose/);log.push('post offered, no dose offered');
  await click(page,'book.lotm.sign_contract');t=await text(page);assert.match(t,/It is a post, not initiation/);
  await click(page,'book.lotm.collect_pay');assert.equal(await money(page),1200+720);log.push(`first week collected: ${await money(page)}`);
  assert.equal(await btn(page,'book.lotm.collect_pay').count(),1);assert.equal(await btn(page,'book.lotm.collect_pay').isDisabled(),true,'no second week yet');
  await persist(page,log,'civil');await reloadCheck(page,url,log,[/civil staff pay: 3 pounds/]);assert.equal(await money(page),1920);
  await importCheck(page,log,[/civil staff pay: 3 pounds/],'lotm.move.lodging');assert.equal(await money(page),1920);log.push('money after import 1920');
  await page.screenshot({path:out+'/q3-civil.png'});return log;},

 async q2({page,out,url}){const log=[];
  await enroll(page);await click(page,'book.lotm.report_in');
  let t=await text(page);assert.match(t,/Evernight quarter/);assert.match(t,/supervised by Warden Hale/);assert.doesNotMatch(t,/not endorsed here/,'home needs no endorsement');assert.match(await title(page),/Nighthawks answer here, in their own district/);log.push('home district: '+status(t));
  await click(page,'lotm.move.docks');const jobs=()=>page.evaluate(()=>simulationTestHooks.snapshot().expansion.simulation.jobs.map(j=>j.commandId));
  assert.deepEqual(await jobs(),['book.lotm.walk_workroom_docks']);log.push('walk to the docks is a 20-minute job');
  await persist(page,log,'mid-walk');await reloadCheck(page,url,log,[/Tingen docks/]);assert.deepEqual(await jobs(),['book.lotm.walk_workroom_docks'],'the walk survives a reload');await advanceGameMinutes(page,21);assert.deepEqual(await jobs(),[]);
  t=await text(page);assert.match(t,/Tingen docks \(east and south\)/);assert.match(t,/supervised by the Punishers' duty officer/);assert.match(t,/not endorsed here/);
  assert.match(t,/Mandated Punishers answer here, not Warden Hale/);assert.match(await title(page),/Nighthawks answer for their own.*headquarters/);log.push('docks: '+status(t));
  assert.equal(await btn(page,'book.lotm.errand_storm').count(),0,'no errand before endorsement');
  await click(page,'book.lotm.endorse_storm');await click(page,'book.lotm.errand_storm');await advanceGameMinutes(page,21);t=await text(page);assert.match(t,/paid 18 pence/);log.push('docks errand paid 18 pence');
  await page.screenshot({path:out+'/q2-docks.png'});await persist(page,log,'docks');
  await reloadCheck(page,url,log,[/Tingen docks/,/paid 18 pence/]);
  await importCheck(page,log,[/Tingen docks/,/paid 18 pence/]);
  await go(page,'university');t=await text(page);assert.match(t,/Steam and Machinery|university quarter/);log.push('university: '+status(t));
  await go(page,'workroom');t=await text(page);assert.match(t,/supervised by Warden Hale/);log.push('back at workroom, Hale supervises again');
  return log;}
};
