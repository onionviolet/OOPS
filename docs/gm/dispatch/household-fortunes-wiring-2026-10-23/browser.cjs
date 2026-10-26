const gate=require('../cultivation-spacing-2026-10-22/browser-helper.cjs');
const DAY=1440,STEW='home.manor.steward',COOK='home.manor.cook';
gate('fortunes',async h=>{
 const {p,boot,enroll,save:save0,load,read,played,roundtrip,assert,gates,out}=h;
 const save=async()=>{await p.evaluate(()=>document.getElementById('save_button').click());return read();};
 await boot();await enroll();await p.evaluate(()=>advanceTicks(1));
 const openId=async id=>{await p.evaluate(id=>{document.querySelector(`[data-panel-path="${id}"]`)?.click();const n=document.querySelector('[aria-label="Other known panels"]');if(n&&[...n.options].some(o=>o.value===id)){n.value=id;n.dispatchEvent(new Event('change',{bubbles:true}));}},id);};
 const homes=async id=>{await openId('homes');const b=p.locator(`[data-home-action="${id}"]`);await b.waitFor({state:'visible'});await b.press('Enter');};
 await homes('institution_join');
 let s=await save();assert.ok(s.expansion.actors[STEW]);
 for(const [w,hh] of [[1920,1080],[1536,864]]){await p.setViewportSize({width:w,height:hh});}
 await p.evaluate(n=>advanceTicks(n),2*DAY);s=await save();
 console.log('slice after 6d',JSON.stringify(s.household_fortunes).slice(0,500),'clock',s.expansion.clock);
 assert.equal(s.household_fortunes.family,'household_fortunes@1');assert.equal(Object.keys(s.household_fortunes.members).length,4);
 assert.ok(s.household_fortunes.lastDay>=1);gates.push('A: join manor; 6 played days stage fortunes (rolls, observed fed/tended) into the save');
 console.log('awakened',JSON.stringify(Object.entries(s.household_fortunes.members).map(([k,m])=>[k,m.awakened])));
 await openId('household-fortunes');await p.waitForTimeout(300);
 const text=await p.locator('#household_fortunes_panel').innerText();console.log(text);
 assert.match(text,/Watch list/);assert.doesNotMatch(text,/talent|chance/i);assert.match(text,/Bed \d+%/);
 for(const [w,hh] of [[1920,1080],[1536,864]]){await p.setViewportSize({width:w,height:hh});await p.waitForTimeout(400);await p.screenshot({path:out+`/fortunes-${w}.png`});}
 gates.push('B: panel renders watch list + parts at 1920 and 1536, no hidden value');
 await roundtrip('fortunes-a',s=>s.household_fortunes);gates.push('C: save, reload, Export, literal Import preserve the slice');
 const base=await save();
 const clone=()=>JSON.parse(JSON.stringify(base));
 let r=clone();delete r.household_fortunes;await load(r,'prechange');await p.evaluate(()=>advanceTicks(3));r=await save();
 assert.ok(r.household_fortunes&&r.household_fortunes.lastDay>=base.household_fortunes.lastDay);gates.push('D: save without the slice loads and starts observing');
 // routine
 r=clone();r.expansion.actors[COOK].completed={...r.expansion.actors[COOK].completed,'home.staff.cook':5};
 for(const o of Object.values(r.expansion.simulation.owners))for(const k of Object.keys(o))if(/Roasted rat/.test(k))delete o[k];
 await load(r,'routine');await p.evaluate(()=>advanceTicks(2));r=await save();
 const cj=r.expansion.simulation.jobs.filter(j=>j.commandId==='home.staff.cook');console.log('routine jobs',cj.length,'loc',r.expansion.simulation.people.player.location);
 await p.evaluate(()=>advanceTicks(15));r=await save();console.log('cook completed',r.expansion.actors[COOK].completed['home.staff.cook']);
 assert.ok(cj.length>0||r.expansion.actors[COOK].completed['home.staff.cook']>5,'routine ordered a cook job');gates.push('F: cook routine unlocked at 5 completions orders a funded cook job unasked');
 await openId('household-fortunes');await p.waitForTimeout(300);console.log((await p.locator('#household_fortunes_panel').innerText()).split('Standing routines')[1]);
 // pause routine from the UI
 const tg=p.locator('[data-fortune-routine-toggle="daily_meals"]');await tg.press('Enter');r=await save();assert.equal(r.household_fortunes.routines.paused.daily_meals,true);gates.push('G: Stop routine button writes the stop into the slice');
 // neglect
 r=clone();r.expansion.actors[STEW].resources['home.estateFunds']=0;
 for(const o of Object.values(r.expansion.simulation.owners))for(const k of Object.keys(o))if(/Rat meat|Roasted rat/.test(k))delete o[k];
 for(const m of Object.values(r.household_fortunes.members)){m.lack=39;m.fed=0;}
 await load(r,'neglect');await p.evaluate(n=>advanceTicks(n),2*DAY);s=await save();
 const dead=Object.entries(s.expansion.simulation.people).filter(([id,x])=>id.startsWith('home.manor')&&x.life==='dead');
 console.log('dead',dead.map(d=>d[0]),JSON.stringify(s.household_fortunes.household));
 assert.ok(dead.length>0);assert.ok(s.household_fortunes.household.resentment>0&&s.household_fortunes.household.standing<0);
 await openId('household-fortunes');await p.waitForTimeout(300);const t2=await p.locator('#household_fortunes_panel').innerText();console.log(t2);
 assert.match(t2,/neglect/);assert.match(t2,/grievance/);await p.screenshot({path:out+'/fortunes-neglect-1536.png'});
 gates.push('E: starved household loses staff to neglect (fixture primed at 39 lack days); standing/resentment charged; obligations show the grievance');
 await roundtrip('fortunes-neglect',s=>s.household_fortunes);gates.push('H: post-death save, reload, Export, Import');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
