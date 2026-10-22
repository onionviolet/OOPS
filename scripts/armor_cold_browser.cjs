// Rebuild first. Fresh origin, generated saves only; headless. S2 armor journey.
const {launchChrome,waitGameTime,withTestHooks}=require('./ui_helpers.cjs'),fs=require('fs'),assert=require('assert/strict'),path=require('path');
const url=withTestHooks(process.env.YAIRPG_PROOF_URL||'http://127.0.0.1:18731/'),out=process.env.YAIRPG_PROOF_DIR||'/private/tmp/claude-501/s2';
fs.mkdirSync(out,{recursive:true});
const part=id=>JSON.stringify({id,quality:100});
(async()=>{const b=await launchChrome(),errors=[];
const open=async(s,vw=1920,vh=1080)=>{const c=await b.newContext({viewport:{width:vw,height:vh}});if(s)await c.addInitScript(s=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(s));},s);const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});await p.goto(url);await p.getByText('PLAY',{exact:true}).click();if(await p.getByText('Confirm',{exact:true}).isVisible())await p.getByText('Confirm',{exact:true}).click();return {c,p}};
const save=async p=>{await p.evaluate(()=>window.saveProgress());return p.evaluate(()=>JSON.parse(localStorage.getItem('save data')))};
try{
let {c,p}=await open();const seed=await save(p);
const armor=JSON.stringify({components:{internal:'Goat leather vest',external:'Steel chainmail vest'},quality:100});
const inv=seed.inventories.person.main_character;inv[armor]={count:2};inv[part('Wool shirt')]={count:1};
seed['current time'].month=1;seed['current time'].hour=5;seed.availabilities.location['Infested field']=1;
await c.close();({c,p}=await open(seed));
await p.evaluate(k=>window.equip_item(k),armor);await p.evaluate(()=>window.openOptions());await p.locator('[data-durability-option]').check();
await p.evaluate(()=>window.closeOptions());
const s1=await save(p);const bare=s1.character.equipment.torso.inventory_key;assert.ok(JSON.parse(bare).e2_instance);
await p.evaluate(()=>window.unequip_item('torso'));
const checks=[],ok=(m,v=true)=>{assert.ok(v,m);checks.push(m)};
const cond=async(k)=>(await save(p)).equipment_durability.condition[k];
const fightOnce=async()=>{await p.evaluate(()=>Math.random=()=>0);await p.evaluate(()=>window.change_location({location_id:'Infested field',skip_travel_time:true}));await waitGameTime(p,9000);await p.evaluate(()=>window.change_location({location_id:'Village',skip_travel_time:true}));};
const hits=s=>s.total_hits_taken;
const fight=async()=>{const h=hits(await save(p));for(let i=0;i<8&&hits(await save(p))-h<3;i++)await fightOnce();};
// 1. Need surfaces in the workshop (fresh origin, 1920x1080, winter dawn).
await p.locator('select').filter({has:p.locator('option[value="gear-workshop"]')}).first().selectOption('gear-workshop');
await p.locator('#gear_workshop').waitFor({state:'visible'});
const plain=JSON.stringify({components:{internal:'Goat leather vest',external:'Steel chainmail vest'},quality:100});
const items=p.locator('select[aria-label="Carried gear"]');
await items.selectOption(plain);
const needText=await p.locator('#gear_workshop').innerText();
assert.match(needText,/Cold need: air [\d.-]+° chills this metal armor; hits wear it ×2, a warm lining would insulate it/);ok('Workshop names the cold need for unlined metal armor in cold air');
await p.screenshot({path:path.join(out,'1-need-1920.png')});
// 2. Work: the existing workshop lining process resolves it.
await p.locator('select[aria-label="Gear process"]').selectOption('attach');
await p.locator('select[aria-label="Material role"]').selectOption('lining');
await p.locator('select[aria-label="Process material"]').selectOption(part('Wool shirt'));
await p.locator('[data-gear-commit]').click();
const worked=await save(p);const lined=Object.keys(worked.inventories.person.main_character).find(k=>JSON.parse(k).gearwork?.roles?.lining);
ok('Lining attach consumed the wool shirt and produced a worked armor key',!!lined&&!worked.inventories.person.main_character[part('Wool shirt')]);
const lk=JSON.parse(lined);ok('Lined armor has a stable identity and work history',!!lk.e2_instance&&lk.gearwork.history[0].action==='attach');
ok('Panel now reports insulation',/lining insulates 98%/.test(await p.locator('#gear_workshop').innerText()));
await p.screenshot({path:path.join(out,'2-worked-1920.png')});
// 3. Wear + combat: same fight with the unlined and then the lined armor.
await p.evaluate(k=>window.equip_item(k),bare);const h0=hits(await save(p));await fight();const sBare=await save(p);const bareDrop=100-sBare.equipment_durability.condition[bare],bareHits=hits(sBare)-h0;
await p.evaluate(()=>window.unequip_item('torso'));
await p.evaluate(k=>window.equip_item(k),lined);await fight();const sLined=await save(p);const linedDrop=100-sLined.equipment_durability.condition[lined],linedHits=hits(sLined)-hits(sBare);
console.log({bareDrop,bareHits,linedDrop,linedHits});
ok('Both fights landed hits on worn armor',bareHits>0&&linedHits>0&&bareDrop>0&&linedDrop>0);
ok('Per-hit wear is lower for the lined armor',(bareDrop/bareHits)/(linedDrop/linedHits)>1.8);
await p.screenshot({path:path.join(out,'3-after-combat-1920.png')});
// 4. Persistence: save, reload, Export, literal Import.
const want=sLined.equipment_durability.condition[lined],wantBare=sBare.equipment_durability.condition[bare];
await p.reload();await p.getByText('PLAY',{exact:true}).click();
let r=await save(p);ok('Reload keeps condition and equipped lined key',r.equipment_durability.condition[lined]===want&&r.character.equipment.torso.inventory_key===lined&&r.equipment_durability.condition[bare]===wantBare);
const encoded=await p.evaluate(()=>window.save_to_file());
await Promise.all([p.waitForNavigation(),p.locator('#saved_file_input').setInputFiles({name:'armor-cold.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
await p.getByText('PLAY',{exact:true}).click();r=await save(p);
ok('Literal Import keeps lining, history, worn condition and the unlined copy',r.equipment_durability.condition[lined]===want&&r.equipment_durability.condition[bare]===wantBare&&JSON.parse(r.character.equipment.torso.inventory_key).gearwork.roles.lining.name==='Wool shirt');
await p.screenshot({path:path.join(out,'4-imported-1920.png')});
const real=errors.filter(e=>!/Failed to load resource/.test(e));assert.deepEqual(real,[]);
fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify({url,viewport:'1920x1080',generatedSavesOnly:true,checks,bareDrop,bareHits,linedDrop,linedHits,errors},null,2));console.log('PASS',checks.length);
await c.close();
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
