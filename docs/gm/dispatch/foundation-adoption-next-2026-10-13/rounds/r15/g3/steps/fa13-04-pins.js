// FA13: buy finite consignment, wash one pin, cancel then complete a scrape of the other.
const C = "Eda's clouded batch";
const pick = s => { const i = inv(s); return {clock: s.expansion.clock, money: s.character.money, stf: s.character.stamina_to_full, clouded: i['Clouded bench vial'] || 0, gummed: i['Gummed fitting pin'] || 0,
  pin: i['Recovered fitting pin'] || 0, empty: i['Empty bench vial'] || 0, dull: i['Dulled field fitting knife'] || 0, jobs: s.expansion.simulation.jobs.map(j => j.commandId)}; };
const out = {};
out.start = pick(await save());
await act(C, 'Buy one Gummed fitting pin'); await act(C, 'Buy one Gummed fitting pin'); await act(C, 'Buy one Clouded bench vial');
out.bought = pick(await save());
out.soldOut = (await sec(C)).buttons.filter(b => /Buy/.test(b.label)).map(b => b.label);
await keyAct(C, 'Wash one gummed pin');
out.washPending = pick(await stored());
await waitJobs(); out.washed = pick(await save());
// Opposite: cancel a pending scrape returns the exact pin, knife and stamina.
await act(C, 'Scrape a gummed pin');
out.scrapePending = pick(await stored());
const kc = await keyAct(C, 'Cancel work');
out.scrapeCancelled = pick(await save());
await act(C, 'Scrape a gummed pin');
await waitJobs(); out.scraped = pick(await save());
await record('pins-recovered', out);
const kn = (await stored()).expansion.simulation.knowledge.player;
out.washKnowledge = kn['game_absorption_assay.washing']?.stage; out.scrapeKnowledge = Object.keys(kn).filter(k => /scraping/.test(k));
out.cp = await checkpoint2('fa13-pins-recovered');
out.cp = {reload: out.cp.reloadExact, exp: out.cp.exportEqual, imp: out.cp.importEqual, other: out.cp.exportImportOtherDiffs, errs: out.cp.pageErrors};
return out;
