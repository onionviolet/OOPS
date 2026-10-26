const gate=require('../../cultivation-spacing-2026-10-22/browser-helper.cjs');
gate('inscription',async h=>{
 const {p,assert,boot,load,enroll,save,roundtrip,gates,path,out}=h;
 await p.setViewportSize({width:1920,height:1080});let s=await boot();
 const armor=JSON.stringify({components:{internal:'Goat leather vest',external:'Steel chainmail vest'},quality:150,affixes:[{id:'armor.nimble',v:.02,s:'roll'},{id:'armor.vital',v:.03,s:'roll'}]});
 s.availabilities.skill.Forging=1;s.levels.person.main_character.skill_xp.Forging=500;
 s.inventories.person.main_character[armor]={count:1};for(const id of ['Iron ingot','Charcoal'])s.inventories.person.main_character[JSON.stringify({id})]={count:5};await load(s,'ordinary-inscribed-equipment');await enroll();
 await p.getByRole('combobox',{name:'Other known panels'}).selectOption('gear-workshop');
 await p.getByRole('combobox',{name:'Maker',exact:true}).selectOption('player');await p.getByRole('combobox',{name:'Carried gear'}).selectOption(armor);await p.getByRole('combobox',{name:'Gear process'}).selectOption('reroll');await p.getByRole('combobox',{name:'Inscription to reroll'}).selectOption('armor.nimble');
 await p.locator('[data-gear-commit]').click();s=await save();const next=Object.keys(s.inventories.person.main_character).find(k=>JSON.parse(k).gearwork?.history?.some(h=>h.action==='reroll'));assert.ok(next);const data=JSON.parse(next);
 assert.deepEqual(data.affixes.find(a=>a.id==='armor.vital'),{id:'armor.vital',v:.03,s:'roll'});assert.equal(s.inventories.person.main_character['{"id":"Iron ingot"}'].count,4);assert.equal(s.inventories.person.main_character['{"id":"Charcoal"}'].count,4);
 await roundtrip('selected-inscription',s=>Object.keys(s.inventories.person.main_character).filter(k=>JSON.parse(k).gearwork));await p.getByRole('combobox',{name:'Other known panels'}).selectOption('gear-workshop');await p.screenshot({path:path.join(out,'inscription-1920.png')});gates.push('Native player selected-slot reroll, actual ingredient fees, preserved neighboring affix/copy and literal native import; ordinary gear/stock and existing Forging admission fixture; no new inscription state granted');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
