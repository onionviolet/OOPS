await h.importFile(path.resolve(h.evidence,'../fixture/TEST-FIXTURE-R15-G4-notebook.txt'));await h.play();
await h.click('Complete the first two-offcut rack batch');await h.record('fa20-A-pending');await h.persist('fa20-A-pending');await h.advance(5);await h.record('fa20-A-complete');
await h.click('Frame a fixed-stop drafting bench');await h.advance(5);
await h.click('Finish your drafting surface');await h.advance(4);
await h.click('Adapt your own Cyoria notebook');await h.record('fa20-notebook-held');await h.persist('fa20-notebook-held');await h.advance(5);await h.record('fa20-adapted');
await h.click('Dry another two-offcut rack batch');await h.record('fa20-A-second-pending');
return {buttons:await h.buttons('stops'),cancel:await h.buttons('Cancel'),errors:h.errors};
