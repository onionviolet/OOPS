// Finish the connected journey: MG09 host the conserved exhibition, MG08 Mira-funded work, delivery and one
// principal collection, MG10 withdraw display, MG06 grain to harvest. Then completed-state Save/reload/Export/Import
// and a repeat import that must not pay or create anything again.
const inv = s => s.inventories.person.main_character;
const a = await snap('finish before');
await h.mg('Host the conserved-object exhibition');
await idle();
const hosted = await snap('MG09 hosted');
expect(hosted.st.money === a.st.money + 8 && hosted.st.facts['mg.eventBooked'] === false && hosted.st.npc['mg.mira'].stock['{"id":"Conserved courtyard heirloom"}'] === 1, 'sponsorship 8; display object stayed with Mira');
expect(!(await has('Host the conserved-object exhibition')), 'host clears booking/programme');
await h.mg('Complete Mira’s funded crate commission');
await idle();
await h.mg('Deliver Sela’s crate to Mira');
const wage = await snap('MG08 work paid');
expect(wage.st.money === hosted.st.money + 2 && wage.st.npc['mg.sela'].coins === hosted.st.npc['mg.sela'].coins + 10 && wage.st.npc['mg.mira'].coins === hosted.st.npc['mg.mira'].coins - 12, 'Mira paid Sela 10, player 2');
await h.mg('Collect Sela’s 8-coin loan principal');
const repaid = await snap('MG08 principal collected');
expect(repaid.st.money === wage.st.money + 8 && repaid.st.facts['mg.selaDebtOutstanding'] === false, 'principal once');
expect(!(await enabled('Collect Sela’s 8-coin loan principal')), 'no second collection');
await h.mg('Withdraw Conserved heirloom from Mira’s display');
const withdrawn = await snap('MG10 withdrawn');
expect(inv(withdrawn.s)['{"id":"Conserved courtyard heirloom"}'].count === 1 && withdrawn.st.facts['mg.displayedKind'] === false, 'same object back');
await h.mg('Tend the planted crop'); await idle();
await h.mg('Grow tended grain'); await idle();
await h.mg('Harvest ready grain');
const grain = await snap('MG06 grain harvested');
expect(inv(grain.s)['{"id":"Courtyard grain"}'].count === 5, 'five grain');
// Completed-state persistence and repeat import.
const C = await h.save();
const exported = await h.exportFile('P2-completed-journey.txt');
await h.reload(); await h.play();
const R = await h.save();
const same = (x, y) => JSON.stringify(h.mgState(x)) === JSON.stringify(h.mgState(y)) && JSON.stringify(inv(x)) === JSON.stringify(inv(y));
const sameIgnoringClock = (x, y) => {const f = s => ({...h.mgState(s), clock: 0}); return JSON.stringify(f(x)) === JSON.stringify(f(y)) && JSON.stringify(inv(x)) === JSON.stringify(inv(y));};
expect(sameIgnoringClock(C, R), 'reload keeps completed state');
await h.importFile(exported.file); await h.play();
const I1 = await h.save();
await h.importFile(exported.file); await h.play();
const I2 = await h.save();
h.write('P2-completed-persistence.json', {exportedSha256: exported.sha256, reloadSame: sameIgnoringClock(C, R), import1Same: sameIgnoringClock(C, I1), import2Same: sameIgnoringClock(C, I2), completed: h.mgState(C), inventory: inv(C), errors: h.errors});
expect(sameIgnoringClock(C, I1) && sameIgnoringClock(C, I2), 'repeat import pays/creates nothing again');
return {errors: h.errors, money: [a.st.money, hosted.st.money, wage.st.money, repaid.st.money, grain.st.money], exported};
