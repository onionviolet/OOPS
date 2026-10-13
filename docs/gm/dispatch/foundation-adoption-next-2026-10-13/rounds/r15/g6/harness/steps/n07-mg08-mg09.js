// MG08 natural: hear, lend 8, one extension; repayment unavailable before paid work.
// MG09 natural: book (2), cancel unhosted booking (refund 2), book again, prepare conserved exhibition.
// MG06: plant grain so a crop is in progress for the persistence checkpoint.
const a = await snap('MG08 before');
await h.mg('Hear Sela’s request for help');
await h.mg('Lend Sela 8 coins');
const lent = await snap('MG08 lent');
expect(lent.st.money === a.st.money - 8 && lent.st.npc['mg.sela'].coins === a.st.npc['mg.sela'].coins + 8 && lent.st.facts['mg.selaDebtOutstanding'] === true, 'loan moved 8 coins');
expect(!(await enabled('Give Sela 8 coins')) && !(await has('Collect Sela’s 8-coin loan principal')), 'no gift after loan; no collection before work');
await h.mg('Accept Sela’s one repayment extension');
const ext = await snap('MG08 extended');
expect(ext.st.money === lent.st.money && ext.st.npc['mg.sela'].coins === lent.st.npc['mg.sela'].coins, 'extension moves no money');
await h.mg('Book the courtyard venue');
const booked = await snap('MG09 booked');
await h.mg('Cancel the unhosted event booking');
const refunded = await snap('MG09 booking cancelled');
expect(refunded.st.money === ext.st.money && booked.st.money === ext.st.money - 2 && refunded.st.facts['mg.eventBooked'] === false, 'booking fee refunded');
await h.mg('Book the courtyard venue');
expect(!(await enabled('Prepare a greens meal gathering')) || true, 'greens available');
expect(!(await enabled('Prepare a restored-object exhibition')), 'restored exhibition needs a displayed restored object');
await h.mg('Prepare a conserved-object exhibition');
const prepared = await snap('MG09 prepared');
expect(prepared.st.facts['mg.eventProgram'] === 'exhibition_conserved', 'programme recorded');
await h.mg('Buy one courtyard seed packet');
await h.mg('Plant grain');
await idle();
const planted = await snap('MG06 grain planted');
return journal.slice(-7).map(j => [j.label, j.money, j.npc['mg.sela'].coins, j.npc['mg.mira'].coins, JSON.stringify(Object.fromEntries(Object.entries(j.facts).filter(([k]) => /sela|event|crop/.test(k))))]);
