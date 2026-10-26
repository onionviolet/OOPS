// GTL6 browser check: seeded frontier bank drains into real Regeneration gains, shows "digesting", survives reload and file import.
const {launchChrome}=require('/Users/weiwei/code/yet-another-idle-rpg/scripts/ui_helpers.cjs'),assert=require('assert/strict');
const url=process.env.URL||'http://127.0.0.1:19908/',shot=process.argv[2];
(async()=>{const b=await launchChrome();const errors=[];
const open=async s=>{const c=await b.newContext({viewport:{width:1920,height:1080}});if(s)await c.addInitScript(s=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(s))},s);const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});await p.goto(url);await p.getByText('PLAY',{exact:true}).click();await p.waitForTimeout(800);return {c,p}};
const save=async p=>{await p.evaluate(()=>window.saveProgress());return p.evaluate(()=>JSON.parse(localStorage.getItem('save data')))};
const bankOf=s=>s.skill_overflow?.bank?.['base.frontier']?.Regeneration||0, xpOf=s=>s.levels.person.main_character.skill_xp.Regeneration||0;
try{let {c,p}=await open();const seed=await save(p);await c.close();
seed.character.hp_to_full=50;seed.levels.person.main_character.skill_xp.Regeneration=Number(process.env.RXP||300);seed.skill_overflow={schema:1,bank:{'base.frontier':{Regeneration:40000}}};
({c,p}=await open(seed));const start=await save(p);
const digestingAtLoad=await p.evaluate(()=>[...document.querySelectorAll('*')].some(n=>n.children.length===0&&/digesting/.test(n.textContent)));
await p.waitForTimeout(6000);const after=await save(p);
const healed=start.character.hp_to_full-after.character.hp_to_full, gained=xpOf(after)-xpOf(start), drained=bankOf(start)-bankOf(after);
assert.ok(bankOf(start)>0&&bankOf(start)<=40000);assert.ok(drained>0,'bank drains');assert.ok(drained<=healed+0.05,'a gain releases at most as much again (frontier drainRatio 1)');assert.ok(Math.abs(gained-(healed+drained))<0.05,`gained ${gained} = healed ${healed} + drained ${drained}`);
const digesting=await p.evaluate(()=>[...document.querySelectorAll('*')].filter(n=>n.children.length===0&&/digesting/.test(n.textContent)).map(n=>({text:n.textContent,title:n.title})));
if(!digesting.length)console.log('NODIG',await p.evaluate(()=>({bars:document.querySelectorAll('.skill_bar_max').length,regen:[...document.querySelectorAll('.skill_bar_max')].filter(n=>/Regeneration/.test(n.textContent)).map(n=>n.textContent.slice(0,300))})));assert.ok(digesting.length>0,'digesting count shown');
if(shot){await p.mouse.click(665,1046);await p.waitForTimeout(500);const bar=p.locator('.skill_bar_max',{hasText:'Regeneration'}).first();await p.evaluate(()=>{const n=[...document.querySelectorAll('.skill_bar_max')].find(n=>/Regeneration/.test(n.textContent));n?.scrollIntoView({block:'center'});});await bar.hover({timeout:3000}).catch(()=>{});await p.waitForTimeout(300);await p.screenshot({path:shot});}
const held=bankOf(after);
const beforeReload=(await save(p)).skill_overflow;await p.reload();const rawAfterReload=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')).skill_overflow);await p.getByText('PLAY',{exact:true}).click();await p.waitForTimeout(500);const rawAfterPlay=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')).skill_overflow);const reloaded=await save(p);
assert.ok(bankOf(reloaded)>0&&bankOf(reloaded)<=(beforeReload?.bank?.['base.frontier']?.Regeneration||0),'bank survives reload '+JSON.stringify({held,reloaded:reloaded.skill_overflow,hp:reloaded.character.hp_to_full}));
const encoded=await p.evaluate(()=>window.save_to_file());await Promise.all([p.waitForNavigation(),p.locator('#saved_file_input').setInputFiles({name:'gtl6.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
await p.getByText('PLAY',{exact:true}).click();await p.waitForTimeout(500);const imported=await save(p);
assert.ok(bankOf(imported)>0&&bankOf(imported)<=bankOf(reloaded),'bank survives import');
assert.deepEqual(errors,[]);
console.log(JSON.stringify({ok:true,digestingAtLoad,healed,gained,drained,held,reloaded:bankOf(reloaded),imported:bankOf(imported),digesting},null,1));await c.close()}finally{await b.close()}})().catch(e=>{console.error(e.message||e);process.exit(1)});
