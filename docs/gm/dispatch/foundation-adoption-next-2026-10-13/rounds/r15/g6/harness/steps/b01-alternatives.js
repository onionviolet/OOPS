// Natural run B on a fresh profile: the alternative branch of each family.
const inv = s => s.inventories.person.main_character;
const K = id => JSON.stringify({id});
const step = async (label, fn) => {try {await fn();} catch (e) {throw Error(label + ': ' + e.message);}};
globalThis.journal = [];
await page.waitForTimeout(2500);
await h.play();
await page.locator('input').filter({visible: true}).first().fill('R15 G6 natural B');
await page.getByText('Confirm', {exact: true}).click();
await page.waitForTimeout(1500);
await page.locator('#management_panel > summary').click();
await h.mg('Visit the market courtyard');
const start = await snap('B charter');
const checks = {};
await step('MG01 advance', async () => {
    await h.mg('Inspect Orin’s small enterprise'); await h.mg('Take Orin’s two-log goods advance');
    const a = await snap('B MG01 advance taken');
    expect(a.st.money === 102 && inv(a.s)[K('Rough wood log')].count === 2, 'advance: logs, no money');
    await h.mg('Make Orin’s one-batch crate'); await idle();
    await h.mg('Sell the advance batch to Bram'); const sold = await snap('B MG01 sold');
    await h.mg('Repay the one goods advance'); const repaid = await snap('B MG01 repaid');
    expect(sold.st.money === 108 && repaid.st.money === 105 && repaid.st.npc['mg.orin'].coins === 33, 'sale 6 to player, repay 3 to Orin');
    expect(!(await enabled('Repay the one goods advance')), 'repaid once');
    checks.MG01 = {advance: [a.st.money, sold.st.money, repaid.st.money, repaid.st.npc['mg.orin'].coins]};
});
await step('MG08 gift', async () => {
    const b = (await snap('B MG08 before')).st;
    await h.mg('Hear Sela’s request for help'); await h.mg('Give Sela 8 coins');
    const g = await snap('B MG08 gift');
    expect(g.st.money === b.money - 8 && g.st.facts['mg.selaDebtOutstanding'] === false, 'gift, no debt');
    expect(!(await enabled('Lend Sela 8 coins')) && !(await has('Collect Sela’s 8-coin loan principal')) && !(await has('Accept Sela’s one repayment extension')), 'gift is never collectible');
    checks.MG08 = {gift: [b.money, g.st.money, g.st.npc['mg.sela'].coins]};
});
for (let i = 0; i < 8; i++) await h.mg('Buy one Rough wood log');
await step('MG07 careful and foreman stop', async () => {
    const b = await snap('B MG07 before');
    await h.mg('Accept Bram’s careful fine-crate order'); await idle();
    const made = await snap('B MG07 fine made');
    expect(inv(made.s)[K('Fine courtyard crate')].count === 1 && inv(made.s)[K('Rough wood log')].count === inv(b.s)[K('Rough wood log')].count - 3, 'careful uses 3 logs');
    await h.mg('Deliver the fine crate to Bram'); const paid = await snap('B MG07 fine paid');
    expect(paid.st.money === made.st.money + 10, 'careful pays 10');
    await h.mg('Commission Orin as foreman'); await h.mg('Let Orin execute the one commissioned crate');
    const working = await snap('B foreman working');
    await h.mg('Stop Orin’s one-order job');
    const stopped = await snap('B foreman stopped');
    expect(!stopped.st.jobs.length && stopped.st.npc['mg.orin'].stamina === 20 && stopped.st.npc['mg.orin'].stock[K('Rough wood log')] === working.st.npc['mg.orin'].stock[K('Rough wood log')] + 2, 'stop returns logs and stamina to Orin');
    await h.mg('Cancel Orin’s unstarted or stopped order');
    const back = await snap('B foreman inputs collected');
    expect(inv(back.s)[K('Rough wood log')].count === inv(stopped.s)[K('Rough wood log')].count + 2 && back.st.npc['mg.orin'].coins === stopped.st.npc['mg.orin'].coins, 'two logs back to player, fee retained');
    checks.MG07 = {careful: [made.st.money, paid.st.money], foremanFeeRetained: back.st.npc['mg.orin'].coins};
});
await step('MG02 end rental', async () => {
    await h.mg('Buy Mira’s one room concession'); await h.mg('Repair the room'); await idle();
    await h.mg('Prepare the room for rental'); await h.mg('Host Sela for one rental period'); await idle();
    await h.mg('Hear Sela’s one room request');
    const before = await snap('B MG02 request');
    await h.mg('End future rental to Sela');
    const ended = await snap('B MG02 ended');
    expect(ended.st.facts['mg.roomUse'] === 'unselected' && ended.st.money === before.st.money && !(await has('Host Sela for one rental period')), 'rental ended without debt');
    checks.MG02 = {endRental: [before.st.money, ended.st.money, ended.st.facts['mg.roomUse']]};
});
await step('MG06 grain', async () => {
    await h.mg('Rent Mira’s local plot'); await h.mg('Buy one courtyard seed packet');
    await h.mg('Plant grain'); await idle(); await h.mg('Tend the planted crop'); await idle(); await h.mg('Grow tended grain'); await idle();
    await h.mg('Harvest ready grain'); const g = await snap('B MG06 grain');
    expect(inv(g.s)[K('Courtyard grain')].count === 5, 'five grain');
    checks.MG06 = {grain: 5};
});
await step('MG03 Bram grain inn', async () => {
    await h.mg('Prepare the room as an inn'); const b = await snap('B MG03 before');
    await h.mg('Serve Bram a grain meal'); await idle(); const s = await snap('B MG03 Bram served');
    expect(s.st.money === b.st.money + 5 && inv(s.s)[K('Courtyard grain')].count === 4, 'grain meal 5');
    checks.MG03 = {bramInn: [b.st.money, s.st.money]};
});
await step('MG04 win + MG10 sale-grade sale', async () => {
    await h.mg('Inspect Mira’s damaged heirloom'); await h.mg('Set a ten-coin ceiling');
    await h.mg('Inspect the damaged heirloom'); await h.mg('Repair to sale-grade'); await idle();
    const r = await snap('B MG10 restored');
    expect(inv(r.s)[K('Restored courtyard heirloom')].count === 1, 'restored');
    await h.mg('Sell restored heirloom to Bram'); const s = await snap('B MG10 sold');
    expect(s.st.money === r.st.money + 14 && !inv(s.s)[K('Restored courtyard heirloom')] && !(await has('Sell restored heirloom to Bram')), 'sold once for 14');
    checks.MG10 = {saleGrade: [r.st.money, s.st.money]};
});
await step('MG05 local', async () => {
    await h.mg('Use the room as a workshop'); await h.mg('Make one crate in the room workshop'); await idle();
    await h.mg('Hear Bram’s one-shipment offer'); const b = await snap('B MG05 before');
    await h.mg('Ship Courtyard wood crate · local run'); await idle(); const d = await snap('B MG05 delivered');
    expect(d.st.money === b.st.money + 8, 'local run pays 8, no fee');
    checks.MG05 = {local: [b.st.money, d.st.money]};
});
await step('MG09 grain gathering', async () => {
    await h.mg('Book the courtyard venue'); await h.mg('Prepare a grain meal gathering');
    const b = await snap('B MG09 prepared');
    await h.mg('Host the grain gathering'); await idle(); const d = await snap('B MG09 hosted');
    expect(d.st.money === b.st.money + 5 && inv(d.s)[K('Courtyard grain')].count === inv(b.s)[K('Courtyard grain')].count - 1, 'grain gathering consumes one grain, pays 5');
    checks.MG09 = {grain: [b.st.money, d.st.money]};
});
h.write('natural-B-journal.json', {loaded: h.loaded, errors: h.errors, checks, journal: globalThis.journal.map(j => ({label: j.label, money: j.money, inventory: j.inventory, jobs: j.jobs, npc: Object.fromEntries(Object.entries(j.npc).map(([k, v]) => [k, v.coins]))}))});
return {checks, errors: h.errors};
