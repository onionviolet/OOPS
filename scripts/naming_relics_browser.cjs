// Rebuild first. Fresh origin, generated saves only; headless. G6 naming, relic and achievement journey (1440x900 laptop).
const {launchChrome,withTestHooks}=require('./ui_helpers.cjs'),fs=require('fs'),assert=require('assert/strict'),path=require('path');
const url=withTestHooks(process.env.YAIRPG_PROOF_URL||'http://127.0.0.1:18731/'),out=process.env.YAIRPG_PROOF_DIR||'/private/tmp/claude-501/g6';
fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await launchChrome(),errors=[];
const open=async(s)=>{const c=await b.newContext({viewport:{width:1440,height:900}});if(s)await c.addInitScript(s=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(s));},s);
 const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});await p.goto(url);await p.getByText('PLAY',{exact:true}).click();return {c,p};};
const save=async p=>{await p.evaluate(()=>window.saveProgress());return p.evaluate(()=>JSON.parse(localStorage.getItem('save data')))};
try{
let {c,p}=await open();const seed=await save(p);
const armor=JSON.stringify({components:{internal:'Goat leather vest',external:'Steel chainmail vest'},quality:100});
seed.inventories.person.main_character[armor]={count:2};
const blade=JSON.stringify({components:{head:'Cheap iron short blade',handle:'Simple wooden short handle'},quality:100});seed.inventories.person.main_character[blade]={count:1};
await c.close();({c,p}=await open(seed));
await p.evaluate(()=>window.openOptions());await p.locator('[data-durability-option]').check();await p.evaluate(()=>window.closeOptions());
await p.evaluate(k=>window.equip_item(k),armor);await p.evaluate(k=>window.equip_item(k),blade);
const checks=[],ok=(m,v=true)=>{assert.ok(v,m);checks.push(m)};
await p.locator('select').filter({has:p.locator('option[value="naming"]')}).first().selectOption('naming');
const panel=p.locator('#naming_panel');await panel.waitFor({state:'visible'});
const text=async()=>panel.evaluate(n=>n.innerText||n.textContent);
ok('Panel lists both equipped pieces and one opportunity',/Naming opportunities: 1 available/.test(await text())&&await panel.locator('input[aria-label^="Name for"]').count()===2);
const input=panel.locator('input[aria-label^="Name for"]').first();const itemName=await input.getAttribute('aria-label');
await panel.locator('button',{hasText:'Suggest'}).first().click();ok('Suggest fills an item-grammar name',(await input.inputValue()).length>=2);
await input.fill('Ashen Keeper');await panel.locator('button',{hasText:'Name it'}).first().click();
ok('Naming reports and spends the opportunity',/Ashen Keeper is named/.test(await text())&&/0 available/.test(await text()));
ok('Achievement unlocked and listed',/Achievement unlocked: What It Is Called/.test(await text())&&/✓ What It Is Called/.test(await text()));
let s=await save(p);const inst=JSON.parse(s.character.equipment.torso.inventory_key).e2_instance;
ok('Save carries the naming slice keyed by instance',s.naming?.named?.[inst]?.name==='Ashen Keeper'&&s.naming.used===1);
await p.waitForTimeout(800);
ok('Inventory and equipment labels refresh live, without a reload',(await p.locator('#inventory_content_div').innerText()).includes('Ashen Keeper'));
ok('Game log carries the achievement line',/Achievement unlocked: What It Is Called/.test(await p.evaluate(()=>document.body.innerText)));
ok('Opportunity dial blocks a second naming at start',await panel.locator('button',{hasText:'Name it'}).first().isDisabled());
ok('Quote explains the lock',/No naming opportunity/.test(await text()));

await p.screenshot({path:path.join(out,'1-named-1440.png')});
await p.reload();await p.getByText('PLAY',{exact:true}).click();
s=await save(p);ok('Reload keeps the name and spent opportunity',s.naming?.named?.[inst]?.name==='Ashen Keeper'&&s.naming.used===1);
ok('Reloaded item still shows its name',/Ashen Keeper/.test(await p.evaluate(()=>document.body.innerText)));
const encoded=await p.evaluate(()=>window.save_to_file());
await Promise.all([p.waitForNavigation(),p.locator('#saved_file_input').setInputFiles({name:'g6.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
await p.getByText('PLAY',{exact:true}).click();s=await save(p);
ok('Literal Import keeps the named record',s.naming?.named?.[inst]?.name==='Ashen Keeper');
await p.screenshot({path:path.join(out,'2-imported-1440.png')});
// Relic bestowal: the same gear after 300 recorded uses earns a relic tier with two affixes.
{const s2=JSON.parse(JSON.stringify(s));s2.naming={schema:1,used:0,named:{}};const tk=s2.character.equipment.torso.inventory_key;
 s2.equipment_durability.uses={...(s2.equipment_durability.uses||{}),[tk]:300};
 await p.evaluate(x=>localStorage.setItem('save data',JSON.stringify(x)),s2);await p.reload();await p.getByText('PLAY',{exact:true}).click();
 await p.locator('select').filter({has:p.locator('option[value="naming"]')}).first().selectOption('naming');
 const pn=p.locator('#naming_panel');await pn.locator('input[aria-label^="Name for"]').first().fill('Hundred-Winter Vow');
 ok('Quote previews the relic tier before naming',/Relic\./.test(await pn.innerText()));
 await pn.locator('button',{hasText:'Name it'}).first().click();
 const s3=await save(p);const r=s3.naming.named[JSON.parse(tk).e2_instance];
 ok('Used gear earns a relic with two saved affixes',r?.tier==='relic'&&r.bestow.length===2);
 await p.reload();await p.getByText('PLAY',{exact:true}).click();const s4=await save(p);
 ok('Relic affixes survive reload and appear on the item',s4.naming.named[JSON.parse(tk).e2_instance].bestow.length===2&&/Hundred-Winter Vow/.test(await p.locator('#inventory_content_div').innerText()));
 await p.screenshot({path:path.join(out,'4-relic-1440.png')});}
// Achievements are profile-level: a brand-new game on the same origin still holds the unlock.
const prof=await p.evaluate(()=>JSON.parse(localStorage.getItem('yairpg.profile.v1')));
ok('Profile stores the unlock outside the save',!!prof.unlocked.first_name&&s.profile===undefined&&!JSON.stringify(s).includes('first_name'));
// A brand-new game on the same origin (cleared save) still holds the profile unlock and starts unnamed.
await p.evaluate(()=>localStorage.removeItem('save data'));await p.reload();
await p.getByText('PLAY',{exact:true}).click();
const ns=await save(p);ok('New game starts with an empty naming slice',ns.naming.used===0&&Object.keys(ns.naming.named).length===0);
await p.locator('select').filter({has:p.locator('option[value="naming"]')}).first().selectOption('naming');
const pt=await p.locator('#naming_panel').evaluate(n=>n.innerText);
ok('Achievement persists into the new game',/✓ What It Is Called/.test(pt)&&/0 used of 1 earned/.test(pt));
await p.screenshot({path:path.join(out,'3-new-game-1440.png')});
// Place and faction grammars, from the served module.
const g=await p.evaluate(async()=>{const m=await import('/src/name_grammar.js');return ['place','faction','relic','item'].map(k=>m.generateThingName({seed:3,key:'x',kind:k}).name);});
ok('Place, faction, relic and item names generate in the browser',g.length===4&&g.every(n=>n.length>3));console.log(g.join(' | '));
await c.close();
const real=errors.filter(e=>!/Failed to load resource/.test(e));assert.deepEqual(real,[]);
console.log(checks.join('\n'));
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1);});
