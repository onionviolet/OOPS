const gate=require('./browser-helper.cjs');
gate('m5-treatment',async h=>{
 const {p,assert,boot,load,save,played,roundtrip,gates,fs,path,out}=h;
 await p.setViewportSize({width:1920,height:1080});await boot();
 const open=()=>p.getByRole('combobox',{name:'Other known panels'}).selectOption('herbal-experiments');
 await open();for(let n=0;n<12&&await p.locator('#crafting_gather').isEnabled();n++)await p.locator('#crafting_gather').click();
 let s=await save();const inv=s.inventories.person.main_character;
 const herb=Object.keys(inv).find(k=>s.crafting?.materials[JSON.parse(k).materialRef]?.family==='reedherb');assert.ok(herb);
 // Labelled controls: repeated same acquired herb lot plus ordinary charcoal/iron.
 inv[herb].count=30;inv['{"id":"Charcoal"}']={count:30};inv['{"id":"Iron ingot"}']={count:2};
 await load(s,'gathered-herb-stock-and-ordinary-fuel-control');await open();
 await p.locator('[data-craft-treatment="apparatus"]').press('Enter');
 await p.locator(`[data-craft-material=${JSON.stringify(herb)}]`).check();await p.locator('#crafting_tablet').check();await p.locator('#crafting_heat').fill('2');await p.locator('#crafting_heat').dispatchEvent('change');
 for(let n=0;n<12;n++)await p.locator('#crafting_engine_home [data-craft-commit]').press('Enter');
 s=await save();const key=Object.keys(s.inventories.person.main_character).find(k=>s.crafting.products[JSON.parse(k).productRef]?.outputs.permanent);assert.ok(key);
 const use=()=>p.locator(`[data-crafted-use=${JSON.stringify(key)}]`);
 const pill=s.crafting.products[JSON.parse(key).productRef],power=pill.outputs.permanent.conditioning;
 assert.equal(s.inventories.person.main_character[key].count,12);assert.equal(s.inventories.person.main_character[herb].count,18);assert.equal(s.inventories.person.main_character['{"id":"Charcoal"}'].count,18);
 assert.ok(!(await p.locator('#crafting_engine_home').innerText()).includes('Next tablet:'),'unknown effect not previewed');
 await use().press('Enter');s=await save();const first=s.craftDepth.body.impurity;assert.match(await p.locator('#crafting_engine_home').innerText(),/Next tablet:/);
 const initialMax=40;assert.ok(await p.evaluate(()=>simulationTestHooks.snapshot().craftDepth.body.conditioning)>0);
 for(let n=0;n<8&&(await save()).craftDepth.body.impurity<10;n++){await use().press('Enter');}
 s=await save();assert.ok(s.craftDepth.body.impurity>=10);const before=s.craftDepth.body.impurity;
 const preview=await p.locator('#crafting_engine_home').innerText();assert.match(preview,/unpurged load/);
 await roundtrip('repeat-dose-body',s=>s.craftDepth.body);await open();
 const fuel=(await save()).inventories.person.main_character['{"id":"Charcoal"}'].count;
 await p.locator('[data-craft-treatment="purge"]').press('Enter');s=await save();assert.equal(s.craftDepth.body.impurity,before);assert.equal(s.inventories.person.main_character['{"id":"Charcoal"}'].count,fuel-2);
 await roundtrip('paid-purge-pending',s=>s.craftDepth.body);await played(12);s=await save();assert.equal(s.craftDepth.body.impurity,before-5);assert.equal(s.craftDepth.body.job,null);
 await roundtrip('paid-purge-complete',s=>s.craftDepth.body);await open();
 const lower=await p.locator('#crafting_engine_home').innerText();assert.notEqual(preview.match(/Next tablet:[^\n]+/)[0],lower.match(/Next tablet:[^\n]+/)[0]);
 for(const [w,ht]of [[1920,1080],[1536,864]])for(const size of [14,21]){
  await p.setViewportSize({width:w,height:ht});await p.evaluate(size=>{document.documentElement.style.setProperty('--base-font-size',size+'px');document.documentElement.style.fontSize=size+'px';},size);
  await open();await use().evaluate(n=>n.scrollIntoView({block:'center'}));await p.screenshot({path:path.join(out,`medicine-${w}-${size}.png`)});
  const bounds=await use().boundingBox();assert.ok(bounds.x>=0&&bounds.x+bounds.width<=w);assert.ok(bounds.y>=0&&bounds.y+bounds.height<=ht);
 }
 gates.push(`Fixture route: ordinary baseline + native gathered lot stock-control; 12 native paid formulations conserve herb/fuel; power ${power}, initial residue ${first}; repeated doses increase load, body conditioning consumed by max-stamina owner, paid purge lowers it only at completion; observed preview updates; four desktop sizes and native persistence states.`);
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
