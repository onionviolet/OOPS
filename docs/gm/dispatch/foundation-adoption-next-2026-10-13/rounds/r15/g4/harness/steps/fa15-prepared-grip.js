await h.importFile(path.resolve(h.evidence,'../fixture/TEST-FIXTURE-R15-G4-combat.txt'));await h.play();await h.click('Review harness fits and earned body maneuvers');
await h.click('Prepare one conditioned self-guard');await h.record('fa15-grip-practice-pending');await h.persist('fa15-grip-practice-pending');await h.advance(5);await h.record('fa15-grip-practice-ready-sore');
await h.advance(12);await h.record('fa15-grip-recovered');
await h.click('Challenge with your prepared grip');await h.record('fa15-grip-admitted');await h.click('Use prepared conditioned self-guard');await h.record('fa15-grip-spent');
await h.combatClick('Hold an ordinary self guard');await h.record('fa15-grip-next-ordinary-guard');await h.click('Withdraw with spent inputs retained');
return await h.persist('fa15-grip-final');
