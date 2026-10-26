const gate=require('../../cultivation-spacing-2026-10-22/browser-helper.cjs');
gate('charges',async h=>{
 const {p,assert,boot,load,save,played,roundtrip,gates,path,out,fs}=h;
 await p.setViewportSize({width:1920,height:1080});await boot();const raw=fs.readFileSync('/Users/weiwei/.codex/research/cultivation-absorption-2026-10-24/browser/slice1.save.txt','utf8').trim().replace(/^YAIR-UTF8-1:/,'');let s=JSON.parse(Buffer.from(raw,'base64').toString());s.inventories.person.main_character['{"id":"Rough wood log"}']={count:8};await load(s,'ordinary-carving-stock');
 const open=()=>p.getByRole('combobox',{name:'Other known panels'}).selectOption('rune-bench');await open();
 await p.locator('[data-rune="ember"]').click();await p.locator('[data-rune="gale"]').click();await p.locator('[data-rune-export]').click();
 const recipe=await p.getByRole('textbox',{name:'Rune recipe'}).inputValue();assert.deepEqual(JSON.parse(recipe).runes,['ember','gale']);
 await p.locator('[data-rune-import]').click();await p.locator('[data-carve-charged]').click();s=await save();assert.equal(s.pledges.charged.charges,3);assert.equal(s.inventories.person.main_character['{"id":"Rough wood log"}'].count,6);
 await roundtrip('charged-strip',s=>s.pledges.charged);
 await p.keyboard.press('Escape');
 await p.locator('#location_actions_div').getByText('Move somewhere else',{exact:false}).first().click();
 await p.locator('.action_travel[data-travel="Infested field"]').first().click();
 let hit=false;for(let n=0;n<25;n++){await played(1);s=await save();if(s.pledges.charged.charges<3){hit=true;break;}}
 assert.ok(hit,'a resolved ordinary landed hit consumed a charge');assert.ok(s.total_hits_done>0);assert.equal(s.pledges.charged.uses+s.pledges.charged.charges,3);
 await roundtrip('resolved-strip-charge',s=>s.pledges.charged);await open();await p.screenshot({path:path.join(out,'charges-1920.png')});
 gates.push('Ordered recipe roundtrip, native wood debit, actual ordinary landed-hit charge consumption and literal remaining-charge import; ordinary stock fixture only');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
