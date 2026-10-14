// FA13: the retained negative clouded trial is inconclusive until an own reed-oil control exists.
globalThis.rowText = async (label, prefix) => { await openSec(label); return page.evaluate(([label, prefix]) => {
  const d = [...document.querySelectorAll('#feature_expansion_panel details.notebook_preparation')].find(x => x.querySelector('summary').textContent === label);
  const b = [...d.querySelectorAll('button')].find(x => x.textContent.includes(prefix)); if (!b) return null;
  let card = b; while (card && !/action-legibility__card|expedition_card/.test(card.className)) card = card.parentElement;
  return (card || b.parentElement).innerText; }, [label, prefix]); };
const C = "Eda's clouded batch", F = "Eda's bench fieldcraft";
const inconclusive = await rowText(C, 'Compare the failed trial');
// Opposite: try activating the unavailable comparison with the keyboard; nothing may change.
const pre = await save();
const kTry = await keyAct(C, 'Compare the failed trial');
const afterTry = await save();
const unchanged = JSON.stringify(pre.expansion.actors.player) === JSON.stringify(afterTry.expansion.actors.player) && !afterTry.expansion.simulation.jobs.length;
// Control: apply the owned pale vial to an owned dull knife (keyboard).
const kControl = await keyAct(F, 'Apply a pale vial to your own dull plain knife');
const pending = await stored();
await waitJobs();
const r = await record('control-completed', {inconclusive, kTry: kTry.notice});
const s = await stored();
const v = await fsec();
return {inconclusive: inconclusive?.slice(0, 900), tryNotice: kTry.notice, unchangedAfterBlockedTry: unchanged,
  controlPending: {jobs: pending.expansion.simulation.jobs.map(j => [j.commandId, j.due]), inv: {vial: inv(pending)['Unmarked pale vial'] || 0, dull: inv(pending)['Dulled field fitting knife']}},
  after: {clock: r.clock, vial: r.inv['Unmarked pale vial'] || 0, empty: r.inv['Empty bench vial'], dull: r.inv['Dulled field fitting knife'], sharp: r.inv['Field fitting knife'] || 0,
    oil: s.expansion.simulation.knowledge.player['nethack_fieldcraft.reed_oil']?.stage, feats: s.expansion.referenceGameplay?.feats?.earned?.map(f => f.id)},
  clouded: v.clouded.buttons.map(b => b.label), featRecords: v.feats.records.filter(t => /substance|reed|Rill/i.test(t))};
