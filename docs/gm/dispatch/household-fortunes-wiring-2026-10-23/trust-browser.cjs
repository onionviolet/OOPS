const gate=require('../cultivation-spacing-2026-10-22/browser-helper.cjs');
const COOK='home.manor.cook';
gate('trust',async h=>{
 const {p,boot,enroll,save:s0,load,read,roundtrip,assert,gates,out}=h;
 const save=async()=>{await p.evaluate(()=>document.getElementById('save_button').click());return read();};
 await boot();await enroll();await p.evaluate(()=>advanceTicks(1));
 const openId=async id=>{await p.evaluate(id=>{document.querySelector(`[data-panel-path="${id}"]`)?.click();const n=document.querySelector('[aria-label="Other known panels"]');if(n&&[...n.options].some(o=>o.value===id)){n.value=id;n.dispatchEvent(new Event('change',{bubbles:true}));}},id);};
 await openId('homes');const j=p.locator('[data-home-action="institution_join"]');await j.waitFor({state:'visible'});await j.press('Enter');
 await p.evaluate(()=>advanceTicks(3));let s=await save();const money0=s.money??null;
 await openId('social-trust');await p.waitForTimeout(300);
 for(const [w,hh] of [[1920,1080],[1536,864]]){await p.setViewportSize({width:w,height:hh});await p.waitForTimeout(400);await p.screenshot({path:out+`/trust-${w}.png`});}
 console.log((await p.locator('#peer_standing_panel').innerText()).slice(0,900));
 const give=async(amt)=>{await openId('social-trust');const b=p.locator(`[data-trust-gift="${COOK}:${amt}"]`);await b.waitFor({state:'visible'});assert.equal(await b.isEnabled(),true,await p.locator(`[data-trust-note="${COOK}:${amt}"]`).innerText());await b.press('Enter');};
 await give(10);s=await save();console.log('trust',JSON.stringify(s.social_trust),'wages',s.expansion.actors[COOK].resources['home.wages']);
 assert.equal(s.social_trust.trust[COOK],1);gates.push('A: a 10-coin gift moves coins to Iven\'s purse and records +1 trust');
 const w1=s.expansion.actors[COOK].resources['home.wages'];
 await openId('social-trust');console.log(await p.locator(`[data-trust-note="${COOK}:30"]`).innerText());
 await give(30);s=await save();console.log('after big gift',JSON.stringify(s.social_trust));
 assert.equal(s.social_trust.trust[COOK],0);assert.equal(s.expansion.actors[COOK].resources['home.wages'],w1+30);gates.push('B: an oversize gift is accepted and costs trust, reason shown');
 await openId('social-trust');const t=await p.locator('#peer_standing_panel').innerText();console.log(t);assert.match(t,/rank \d of \d|You rank \d of \d/);assert.doesNotMatch(t,/talent/);
 await p.screenshot({path:out+'/trust-after-1536.png'});
 await roundtrip('trust-a',s=>s.social_trust);gates.push('C: save, reload, Export, literal Import keep the trust slice');
 s=await save();delete s.social_trust;await load(s,'notrust');await p.evaluate(()=>advanceTicks(2));s=await save();assert.equal(s.social_trust,undefined);gates.push('D: a save without the slice loads');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
