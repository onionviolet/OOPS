// FA13: controlled comparison now identifies the clouded batch by inference.
const C = "Eda's clouded batch";
const pre = await save();
const k = await keyAct(C, 'Compare the failed trial');
const pending = await stored();
await waitJobs();
const r = await record('controlled-comparison-completed', {keyboard: k});
const s = await stored();
const kn = s.expansion.simulation.knowledge.player;
const v = await sec(C);
const cp = await checkpoint2('fa13-identified-by-inference');
return {k: {tabs: k.tabs, focusAfter: k.focusAfter}, pending: pending.expansion.simulation.jobs.map(j => [j.commandId, j.due]),
  identity: {stage: kn['game_absorption_assay.identity']?.stage, kind: kn['game_absorption_assay.identity']?.basis?.kind, text: kn['game_absorption_assay.identity']?.value?.slice(0, 120)},
  comparison: kn['game_absorption_assay.comparison']?.basis?.kind, stockSame: JSON.stringify(inv(pre)) === JSON.stringify(inv(s)),
  buttons: v.buttons.map(b => b.label), cp: {reload: cp.reloadExact, exp: cp.exportEqual, imp: cp.importEqual, other: cp.exportImportOtherDiffs, errs: cp.pageErrors}};
