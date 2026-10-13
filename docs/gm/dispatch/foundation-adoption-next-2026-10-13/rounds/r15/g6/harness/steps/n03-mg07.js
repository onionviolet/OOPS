// MG07 natural: room workshop recipe learned manually, bounded 3-repeat mandate with pause/resume/cancel,
// Bram's ordinary commission and delivery, Orin foreman one-order commission and execution.
const crate = '{"id":"Courtyard wood crate"}', log = '{"id":"Rough wood log"}';
const inv = s => s.inventories.person.main_character;
const a = await snap('MG07 before');
await h.mg('Use the room as a workshop');
expect(!(await has('Schedule up to three')), 'no mandate before the recipe is learned');
await h.mg('Make one crate in the room workshop');
const working = await snap('MG07 manual batch running');
const staminaWhileWorking = working.s.character.stamina_to_full;
await idle();
const learned = await snap('MG07 recipe learned');
expect(inv(learned.s)[crate]?.count === 1, 'manual batch made one crate');
await h.mg('Schedule up to three of this learned recipe');
const mandate = await snap('MG07 mandate started');
expect(mandate.st.program?.remaining === 2 && mandate.st.jobs.length === 1, 'first repetition started, two remain');
await h.mg('Pause the courtyard mandate');
const paused = await idle();
const afterPause = await snap('MG07 paused, current job done');
expect(afterPause.st.program.status === 'paused' && !afterPause.st.jobs.length && inv(afterPause.s)[crate].count === 2, 'paused mandate started nothing new');
await h.mg('Resume the remaining courtyard recipe repetitions');
const resumed = await snap('MG07 resumed');
const logsHeld = inv(resumed.s)[log].count;
await h.mg('Cancel Make one crate in the room workshop');
const cancelled = await snap('MG07 current repetition cancelled');
expect(inv(cancelled.s)[log].count === logsHeld + 1, 'cancel refunded the reserved log');
await idle();
const done = await snap('MG07 mandate end');
// Bram commission and delivery.
await h.mg('Accept Bram’s ordinary crate order');
await idle();
const crates = inv((await snap('MG07 Bram order made')).s)[crate].count;
await h.mg('Deliver the ordinary crate to Bram');
const delivered = await snap('MG07 Bram paid');
expect(delivered.st.npc['mg.bram'].coins === done.st.npc['mg.bram'].coins - 6 && inv(delivered.s)[crate].count === crates - 1, 'Bram paid 6 once for one crate');
expect(!(await enabled('Deliver the ordinary crate to Bram')) && !(await enabled('Accept Bram’s careful')), 'one Bram order only');
// Foreman.
await h.mg('Commission Orin as foreman');
const commissioned = await snap('MG07 foreman commissioned');
expect(commissioned.st.npc['mg.orin'].coins === delivered.st.npc['mg.orin'].coins + 2, 'fee paid to Orin');
expect(!(await enabled('Commission Orin as foreman')), 'one outstanding order');
await h.mg('Let Orin execute the one commissioned crate');
const orinWorking = await snap('MG07 Orin working');
expect(orinWorking.st.jobs.some(j => j.actor === 'mg.orin') && orinWorking.st.npc['mg.orin'].stamina === 18, 'Orin job uses his own stamina');
await idle();
const foreman = await snap('MG07 foreman delivered');
expect(inv(foreman.s)[crate].count === inv(commissioned.s)[crate].count + 1, 'Orin returned one crate');
return {staminaWhileWorking, rows: journal.slice(-14).map(j => [j.label, j.money, JSON.stringify(j.inventory), JSON.stringify(j.program), j.jobs.map(x => x.command).join(','), j.npc['mg.orin'].coins, j.npc['mg.orin'].stamina, j.npc['mg.bram'].coins])};
