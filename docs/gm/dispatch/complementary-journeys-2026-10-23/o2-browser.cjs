const gate=require('../cultivation-spacing-2026-10-22/browser-helper.cjs');
gate('o2-ordinary-life',async h=>{
 const {p,boot,enroll,save,load,played,roundtrip,assert,gates}=h;
 await p.setViewportSize({width:1920,height:1080});let opening=await boot();opening.character.money=0;opening.availabilities.activity['Village:fieldwork']=1;await load(opening,'job-admission-empty-purse');await enroll();await p.evaluate(()=>advanceTicks(1));
 const open=async()=>{await p.evaluate(()=>{document.querySelector('[data-panel-path="homes"]')?.click();const n=document.querySelector('[aria-label="Other known panels"]');if(n&&[...n.options].some(o=>o.value==='homes')){n.value='homes';n.dispatchEvent(new Event('change',{bubbles:true}));}document.querySelectorAll('details').forEach(d=>d.open=true);});};
 const click=async id=>{await open();const b=p.locator(`[data-home-action="${id}"]`);await b.waitFor({state:'visible'});assert.equal(await b.isEnabled(),true,await b.locator('..').innerText());await b.press('Enter');console.log('home',id);};
 // Existing field-job admission is a fixture prerequisite; every coin below is earned.
 await p.evaluate(()=>{for(let i=0;i<10&&document.querySelector('#location_actions_div.center-mode-hidden');i++)document.getElementById('center_mode_back').click();});
 await p.locator('[data-place-tab="actions"]').click();await p.getByText('Find work',{exact:false}).first().click();await p.locator('[data-activity="fieldwork"]').press('Enter');
 await played(120);await p.evaluate(()=>window.end_activity());let earned=await save();assert.ok(earned.character.money>=15,'completed field shift pays actual wages');const wages=earned.character.money;
 await click('acquire:rental');let housed=await save();assert.equal(housed.homes.properties.rental.access,true);assert.equal(housed.character.money,wages-12);
 await roundtrip('earned-rented-room',s=>({money:s.character.money,homes:s.homes}));
 // The household supplies tuition and funded responsibility without consuming personal wages.
 await click('institution_join');await p.getByRole('combobox',{name:'Inspect residence',exact:true}).selectOption('manor');let s=await save();assert.ok(s.expansion.actors.player.facts['home.institutionWorker']);
 assert.equal(s.expansion.actors['home.manor.steward'].resources['home.estateFunds'],32);
 await click('tutor');await played(20);await click('family_accept');await click('family_duty');await played(15);await click('office_earn');
 s=await save();assert.equal(s.expansion.actors.player.facts['home.provisionOfficer'],true);
 await click('office_train');await played(10);await click('office_establish');await open();assert.equal(await p.locator('[data-home-action="office_succeed"]').isEnabled(),true,'Qualified voluntary handover is supported even while Rowan is available');
 await roundtrip('w2-funded-qualified-office',s=>({actors:s.expansion.actors,owners:s.expansion.simulation.owners,people:s.expansion.simulation.people,homes:s.homes}));
 await click('leave:home.manor.steward');await click('staff:cook');await played(10);await click('staff:cook');await played(10);
 s=await save();assert.equal(s.expansion.simulation.jobs.filter(j=>j.commandId.startsWith('home.office.restock.')).length,0,'Absent steward pauses standing policy');
 const funds=s.expansion.actors['home.manor.steward'].resources['home.officeFunds'],personal={player:s.expansion.actors.player,levels:s.levels,people:s.expansion.simulation.people,relationships:s.expansion.simulation.relationships};
 await click('office_succeed');s=await save();assert.equal(s.expansion.actors['home.manor.keeper'].resources['home.officeFunds'],funds);
 assert.equal(s.expansion.actors['home.manor.keeper'].facts['home.officeReviewRequired'],true);
 assert.deepEqual(s.levels,personal.levels);assert.deepEqual(s.expansion.simulation.people,personal.people);assert.deepEqual(s.expansion.simulation.relationships,personal.relationships);await played(1);s=await save();assert.equal(s.expansion.simulation.jobs.filter(j=>j.commandId.startsWith('home.office.restock.')).length,0);
 await roundtrip('w2-successor-pending-review',s=>({actors:s.expansion.actors,knowledge:s.expansion.simulation.knowledge,owners:s.expansion.simulation.owners,people:s.expansion.simulation.people}));
 await click('office_review');await played(1);s=await save();const job=s.expansion.simulation.jobs.find(j=>j.commandId.startsWith('home.office.restock.'));assert.ok(job);
 await played(20);s=await save();assert.equal(s.expansion.actors['home.manor.keeper'].resources['home.officeFunds'],funds-8);
 assert.equal(s.expansion.actors['home.manor.supplier'].resources['home.wages'],8);
 const a=s.expansion.actors,o=s.expansion.simulation.owners;assert.equal(a['home.manor.steward'].resources['home.estateFunds']+a['home.manor.keeper'].resources['home.officeFunds']+a['home.manor.tutor'].resources['home.wages']+a['home.manor.cook'].resources['home.wages']+a['home.manor.supplier'].resources['home.wages'],32,'All finite institution coins remain treasury, office escrow or actual earned wages');assert.equal((o['home.manor.cook']['{\"id\":\"Rat meat chunks\"}']||0)+(o['home.manor.supplier']['{\"id\":\"Rat meat chunks\"}']||0)+(o['home.manor.cook']['{\"id\":\"Roasted rat meat\"}']||0),16,'Finite raw meat is retained or actually cooked');
 await roundtrip('w2-successor-settled-delivery',s=>({actors:s.expansion.actors,owners:s.expansion.simulation.owners,people:s.expansion.simulation.people,knowledge:s.expansion.simulation.knowledge}));
 gates.push('One existing job admission, zero starting purse, actual 120-minute paid shift, rented room purchased from wages; worker/student earns office; qualified steward, finite reserved funding, unavailable pause, living succession and actual successor review precede delivery');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
