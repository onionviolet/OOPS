// Stop the page timer in the same task as a real control click. This captures
// one-stamina costs before Village regeneration; reload resumes normal time.
const clickHeld=async id=>{const r=await row(id);await r.locator('button').first().evaluate(b=>{if(b.disabled)throw Error('disabled control');b.click();const timer=setTimeout(()=>{},0);for(let i=0;i<=timer+10;i++){clearTimeout(i);clearInterval(i);}});};
const ids=['Tree sap','Rough wood log','Empty retort resin tray','Empty retort residue tray','Filled retort resin tray','Filled retort residue tray','Set repair resin','Sound repair stave','Prepared survey kit'];
const journal={label:'seeded-native',built:built(),cases:[]};
page.setDefaultTimeout(60000);
// Retort current cancel returns actual inputs and the exact one stamina debit.
await boot2('retort');const a=await save();await clickHeld('factorio_retort.three_batches');const b=await save();
const cancelId='cancel:'+pjobs(b)[0].id;
await clickHeld(cancelId);const c=await save();assert.equal(c.character.stamina_to_full,a.character.stamina_to_full);assert.equal(b.character.stamina_to_full,a.character.stamina_to_full+1);assert.equal(pjobs(c).length,0);assert.equal(c.expansion.simulation.programs.player.status,'complete');
for(const id of ids)assert.equal(inv(c,id),inv(a,id));
journal.cases.push({name:'retort-current-refund',before:summary(a,ids),accepted:summary(b,ids),cancelled:summary(c,ids),cancelId,writes:await page.evaluate(()=>window.__writes)});
record('CURRENT-CONTROLS',journal);
await reload();journal.cases[0].restoration=await restoration('current-retort-refund');
// Future cancel leaves the accepted batch, which completes once after reload.
await boot2('retort');const f0=await save();await clickHeld('factorio_retort.three_batches');await clickHeld('factorio_retort.plan_cancel');const f1=await save();assert.equal(pjobs(f1).length,1);assert.equal(cursor(f1).status,'cancelled');
const file=await exportFile('current-retort-future-pending');await reload();await ticks(4);const f2=await save();assert.equal(cursor(f2).status,'cancelled');assert.equal(inv(f2,'Tree sap'),5);assert.equal(inv(f2,'Filled retort resin tray'),1);
journal.cases.push({name:'retort-future-keeps-job',before:summary(f0,ids),pending:summary(f1,ids),settled:summary(f2,ids),export:path.basename(file)});
record('CURRENT-CONTROLS',journal);
// Reserve exact current-job debit/refund and accepted-slot preservation.
await boot2('reserve');const r0=await save();await clickHeld('audited_kit_reserve.resin_plan');const r1=await save();await clickHeld('audited_kit_reserve.cancel_current');const r2=await save();
assert.equal(r1.character.stamina_to_full,r0.character.stamina_to_full+1);assert.equal(r2.character.stamina_to_full,r0.character.stamina_to_full);assert.equal(cursor(r2).stockAcceptedBatches,1);assert.equal(inv(r2,'Set repair resin'),3);assert.equal(inv(r2,'Sound repair stave'),6);assert.equal(inv(r2,'Prepared survey kit'),0);
journal.cases.push({name:'reserve-current-refund-used-slot',before:summary(r0,ids),accepted:summary(r1,ids),cancelled:summary(r2,ids),writes:await page.evaluate(()=>window.__writes)});
record('CURRENT-CONTROLS',journal);
await reload();journal.cases.at(-1).restoration=await restoration('current-reserve-refund');
// Quota fault at acceptance. Live and durable owners stay unchanged, reload and
// one explicit retry reserve exactly one batch. Browser storage fault only.
await boot2('reserve');await row('audited_kit_reserve.resin_plan');const q0=await save();await page.evaluate(()=>{window.__quota=1;window.__writes=[];});await clickHeld('audited_kit_reserve.resin_plan');const q1=await peek();assert.deepEqual(q1,q0);
const notice=(await page.locator('body').innerText()).slice(-3000);const failedWrites=await page.evaluate(()=>window.__writes);
await reload();await clickHeld('audited_kit_reserve.resin_plan');const q2=await save();assert.equal(cursor(q2).stockAcceptedBatches,1);assert.equal(inv(q2,'Set repair resin'),2);assert.equal(inv(q2,'Sound repair stave'),4);
journal.cases.push({name:'reserve-failed-publication-explicit-retry',before:summary(q0,ids),afterFailure:summary(q1,ids),retry:summary(q2,ids),failedWrites,notice});
await clickHeld('audited_kit_reserve.cancel_current');await reload();
journal.log=structuredClone(log);record('CURRENT-CONTROLS',journal);return journal;
