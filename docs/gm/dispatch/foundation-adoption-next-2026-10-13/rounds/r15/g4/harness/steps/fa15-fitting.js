await h.importFile(path.resolve(h.evidence,'../fixture/TEST-FIXTURE-R15-G4-fitting-timber.txt'));await h.play();
await h.click('Hear Eda’s marked-fitting offer');await h.click('Accept a marked-fitting gate objective');await h.record('fa15-fitting-accepted');
await h.click('Challenge the sluice claim');await h.click('Recover Eda’s actual marked fitting');await h.record('fa15-fitting-recovered');
await h.combatClick('Split the anchored support with one log');for(let i=0;i<2;i++)await h.combatClick('Raise the gate one step');await h.record('fa15-fitting-gate3');
await h.click('exact recovered fitting');await h.record('fa15-fitting-handoff');
await h.click('Make an earned brace wrap');await h.advance(3);await h.record('fa15-wrap-crafted');
await h.click('Ask the tollkeepers for a supplied nonlethal practice watch');await h.click('Prepare one supplied practice watch');await h.advance(7);
await h.click('Challenge: Reserve one actual learned brace wrap');await h.click('Use the admitted physical self guard');await h.record('fa15-wrap-spent');
await page.clock.runFor(5000);await h.record('fa15-wrap-incoming');await h.click('Withdraw with spent inputs retained');return await h.persist('fa15-fitting-wrap-final');
