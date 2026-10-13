// MG03 natural: finish the second greens crop, customer board, full and friendly sales, missing-stock refusal,
// inn service (cancel refunds the reserved meal, then complete).
const inv = s => s.inventories.person.main_character;
const greens = '{"id":"Courtyard greens"}', crate = '{"id":"Courtyard wood crate"}';
await idle();
if (await has('Grow tended greens')) {await h.mg('Grow tended greens'); await idle();}
if (await has('Harvest ready greens')) await h.mg('Harvest ready greens');
const a = await snap('MG03 before');
await h.mg('Check the courtyard customer board');
await h.mg('Sell Mira · one wood crate at full price');
const sold = await snap('MG03 crate sold full');
expect(sold.st.money === a.st.money + 6 && sold.st.npc['mg.mira'].stock[crate] === 1 && inv(sold.s)[crate].count === inv(a.s)[crate].count - 1, 'full price sale moved one crate');
expect(!(await enabled('Offer Mira · one wood crate at a friendly price')), 'Mira demand closed');
await h.mg('Offer Sela · one greens portion at a friendly price');
const friendly = await snap('MG03 greens sold friendly');
expect(friendly.st.money === sold.st.money + 3, 'friendly price 3');
const fine = (await rows()).filter(r => r.includes('Bram · one fine crate'));
expect(fine.length && fine.every(r => r.startsWith('[x]')), 'no fine crate: refused ' + JSON.stringify(fine));
await h.mg('Prepare the room as an inn');
await h.mg('Serve Sela a greens meal');
const serving = await snap('MG03 inn serving');
await h.mg('Cancel Serve Sela a greens meal');
const cancelled = await snap('MG03 inn cancelled');
expect(inv(cancelled.s)[greens].count === inv(serving.s)[greens].count + 1 && cancelled.st.money === serving.st.money, 'cancel returned the meal, no payment');
await h.mg('Serve Sela a greens meal');
await idle();
const served = await snap('MG03 inn served');
expect(served.st.money === cancelled.st.money + 3 && served.st.facts['mg.inn_sela_served'] === true, 'inn paid 3 once');
return {fine, rows: journal.slice(-6).map(j => [j.label, j.money, JSON.stringify(j.inventory), j.npc['mg.sela'].coins, j.npc['mg.mira'].coins, j.facts['mg.roomUse']])};
