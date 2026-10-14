// FA13: Rill care, two lessons, refusal when full, scent (second oil use), dog retrieval, manual retrieval,
// handoff/resume, and the three fieldcraft feats.
const F = "Eda's bench fieldcraft";
const dog = s => { const d = s.expansion.simulation.people?.['nethack_fieldcraft.rill']; const a = s.expansion.actors?.['nethack_fieldcraft.rill'];
  return {satiety: a?.resources?.satiety, lessons: a?.resources?.lessons, stamina: d?.vitals?.stamina, willing: a?.facts?.['nethack_fieldcraft.willing']}; };
const pick = s => { const i = inv(s); return {clock: s.expansion.clock, money: s.character.money, ration: i['Workshop ration'] || 0, vial: i['Unmarked pale vial'] || 0, empty: i['Empty bench vial'] || 0,
  pin: i['Recovered fitting pin'] || 0, dog: dog(s), scent: s.expansion.simulation.conditions?.['feature_objects.miri']?.['nethack_fieldcraft.scented_recess'] || null,
  feats: (s.expansion.referenceGameplay?.feats?.earned || []).map(f => f.id).filter(id => /bench_liquid|reed_oil|rill/.test(id)), jobs: s.expansion.simulation.jobs.map(j => j.commandId)}; };
const out = {start: pick(await save())};
out.before = (await sec(F)).buttons.map(b => b.label);
await act(F, 'Buy one Unmarked pale vial'); for (let i = 0; i < 3; i++) await act(F, 'Buy one Workshop ration');
out.bought = pick(await save());
await keyAct(F, 'Feed Rill one Workshop ration'); out.fed1 = pick(await save());
for (let i = 1; i <= 2; i++) { await keyAct(F, 'Practice one ordinary scent lesson'); await waitJobs(); out['lesson' + i] = pick(await save()); }
out.afterLessons = (await sec(F)).buttons.map(b => b.label);
await act(F, 'Feed Rill one Workshop ration'); await act(F, 'Feed Rill one Workshop ration'); out.fed3 = pick(await save());
out.fullRefusal = await rowText(F, 'Feed Rill one Workshop ration');
out.noScentRefusal = await rowText(F, 'Ask trained Rill to retrieve');
await keyAct(F, "Scent Eda's recess"); out.scented = pick(await save());
await keyAct(F, 'Ask trained Rill to retrieve'); out.dogPending = pick(await stored()); await waitJobs(); out.dogRetrieved = pick(await save());
await act(F, "Recover one of Eda's actual pins by hand"); await waitJobs(); out.manualRetrieved = pick(await save());
out.pinsExhausted = await rowText(F, "Recover one of Eda's actual pins by hand");
await act(F, "Hand Rill's workshop attention back to Eda"); out.handoff = pick(await save());
out.afterHandoff = (await sec(F)).buttons.map(b => b.label);
await act(F, 'Ask Eda and Rill to resume'); out.resumed = pick(await save());
out.featRecords = (await sec('Field feats')).records.filter(t => /substance|reed oil|Rill/i.test(t));
await record('dog-oil-feats', out);
const cp = await checkpoint2('fa13-final');
out.cp = {reload: cp.reloadExact, exp: cp.exportEqual, imp: cp.importEqual, other: cp.exportImportOtherDiffs, errs: cp.pageErrors};
return out;
