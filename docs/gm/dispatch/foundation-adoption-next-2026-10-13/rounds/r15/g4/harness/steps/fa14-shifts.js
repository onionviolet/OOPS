await h.importFile(path.resolve(h.evidence,'../fixture/TEST-FIXTURE-R15-G4-shifts.txt'));await h.play();
await h.record('fa14-current-shift1-pending');await h.persist('fa14-current-shift1-pending');
await h.advance(4);await h.record('fa14-current-shift1-complete');
await h.click('Sponsor Orr shift 2');await h.advance(1);await h.record('fa14-current-shift2-pending');
await h.advance(5);await h.record('fa14-current-shift2-complete');
return {buttons:await h.buttons('Collect Orr'),state:h.digest(await h.save()),errors:h.errors};
