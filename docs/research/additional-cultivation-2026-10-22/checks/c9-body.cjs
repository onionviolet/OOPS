const gate=require('./browser-helper.cjs');
gate('c9-body',async h=>{
 const {p,assert,gates,boot,enroll,act,save,played,roundtrip,out,path,fs,load,play}=h;
 await p.setViewportSize({width:1920,height:1080});if(process.env.C9_EARNED_SAVE){await p.goto(process.env.URL+'?test_hooks=1');await play();const raw=fs.readFileSync(process.env.C9_EARNED_SAVE,'utf8').trim();await load(JSON.parse(Buffer.from(raw.replace(/^YAIR-UTF8-1:/,''),'base64').toString()),'earned-weathered-resume');}
 else{await boot();await enroll();}
 const bodyAct=async id=>{
  await p.getByLabel('Other known panels',{exact:true}).selectOption('notebook');
  await p.locator('[data-notebook-view="practice"]').click();
  await p.locator('#body_panel').evaluate(n=>n.open=true);
  const b=p.locator(`[data-body-command="${id}"]`);await b.waitFor({state:'visible'});assert.equal(await b.isEnabled(),true,id);await b.press('Enter');
 };
 if(!process.env.C9_EARNED_SAVE){await bodyAct('body.begin');
 for(let n=0;n<3;n++){await bodyAct('body.cold_soak');await played(6);}
 await bodyAct('body.harden_cold');}let s=await save();
 assert.ok(s.expansion.actors.player.sources['body.cold_hardened']);assert.equal(s.expansion.simulation.knowledge.player['body.cold'].stage,'understood');
 gates.push('Three native completed cold-soak jobs grant current-body faculty and retained knowledge');
 await roundtrip('weathered-body',s=>({body:s.expansion.simulation.people.player.body,faculty:s.expansion.simulation.faculties.player['body.cold_hardened'],source:s.expansion.actors.player.sources['body.cold_hardened'],knowledge:s.expansion.simulation.knowledge.player['body.cold']}));
 await p.locator('[data-control-box="game-bar-menu"] > button').click();await p.locator('#options_button').click();
 await p.locator('[data-pacing-option="weatherEnabled"]').press('Space');assert.equal(await p.locator('[data-pacing-option="weatherEnabled"]').isChecked(),true);await p.locator('[data-exposure-hazardous]').press('Space');assert.equal(await p.locator('[data-exposure-hazardous]').isChecked(),true);await played(1);
 let status=await p.locator('[data-exposure-status]').innerText();assert.match(status,/Weathered skin is active on this body/);assert.match(status,/add -1°C/);assert.doesNotMatch(status,/add -3°C/);
 gates.push('Live native gust status reads trained body and advertises actual reduced penalty');
 await roundtrip('weathered-hazard',s=>({exposure:s.p23Exposure,knowledge:s.expansion.simulation.knowledge.player['body.cold']}));
 for(const [w,hh]of [[1920,1080],[1800,1040],[1536,864]])for(const size of [14,21]){
  await p.setViewportSize({width:w,height:hh});await p.evaluate(size=>{document.documentElement.style.setProperty('--options_display','block');const n=document.querySelector('[data-exposure-panel]');n.style.fontSize=size+'px';n.scrollIntoView({block:'center'});},size);
  assert.match(await p.locator('[data-exposure-status]').innerText(),/Weathered skin is active on this body/);
  const geometry=await p.locator('[data-exposure-status]').evaluate(n=>{const b=n.getBoundingClientRect(),panel=document.querySelector('#options_panel');return {left:b.left,right:b.right,width:innerWidth,overflow:panel.scrollWidth-panel.clientWidth};});
  assert.ok(geometry.left>=0&&geometry.right<=geometry.width&&geometry.overflow<=2,JSON.stringify(geometry));
  await p.screenshot({path:path.join(out,`weathered-${w}-${size}.png`)});
 }
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
