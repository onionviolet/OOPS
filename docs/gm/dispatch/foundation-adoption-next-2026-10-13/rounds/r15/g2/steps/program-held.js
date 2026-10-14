page.setDefaultTimeout(60000);
const j={label:'seeded-native',built:built(),states:[]};
const ids=['Prepared survey kit','Rough wood log'];
const snap=async name=>{const s=await save();j.states.push({name,...summary(s,ids)});record('CURRENT-PROGRAM-HELD',j);return s;};
const sim=async id=>{await panels();await page.locator('#simulation_panel').evaluate(n=>n.open=true);await page.locator(`[data-simulation="${id}"]`).evaluate(b=>{if(b.disabled||b.hidden)throw Error('unavailable '+b.textContent);b.click();});};
await boot2('program3');await travel('Shack');await snap('program-before');await sim('routine');await snap('program-current');await ticks(4);const depleted=await snap('funding-paused');
assert.equal(depleted.character.money,1);assert.equal(depleted.expansion.simulation.programs.player.status,'paused');assert.equal(depleted.expansion.simulation.programs.player.remaining,2);
await sim('resume');const refused=await snap('resume-shortage-no-debit');assert.equal(refused.character.money,1);assert.equal(pjobs(refused).length,0);
j.programRestoration=await restoration('current-program-funding');record('CURRENT-PROGRAM-HELD',j);
await boot2('held');await act('audited_kit_reserve.resin_plan');await page.evaluate(()=>{const t=setTimeout(()=>{},0);for(let i=0;i<=t+10;i++){clearTimeout(i);clearInterval(i);}});const before=await snap('held-before-close');assert.equal(cursor(before).stockHold,true);assert.equal(pjobs(before).length,0);
// Close the persistent browser, wait six real seconds, reopen the same profile.
const cal=before['current time'];await close();await new Promise(r=>setTimeout(r,6000));
await reopen('resumed',false);const after=await snap('held-after-reopen');
assert.equal(inv(after,'Prepared survey kit'),inv(before,'Prepared survey kit'));assert.equal(cursor(after).stockAcceptedBatches,0);assert.equal(pjobs(after).length,0);
j.closedBrowser={wallSeconds:6,beforeClock:before.expansion.clock,afterClock:after.expansion.clock,beforeCalendar:cal,afterCalendar:after['current time'],cursorEqual:JSON.stringify(cursor(before))===JSON.stringify(cursor(after))};
assert.deepEqual(coherent(before,after),[]);await play();j.heldRestoration=await restoration('current-held');record('CURRENT-PROGRAM-HELD',j);return j;
