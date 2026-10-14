for(const fit of ['original','rigid','flexible']){
 await h.importFile(path.resolve(h.evidence,'../fixture/TEST-FIXTURE-R15-G4-harness-'+fit+'.txt'));await h.play();
 await h.click('Challenge with Lio’s paid native support');await h.record('fa15-harness-'+fit+'-admitted');
 await page.clock.runFor(6000);await h.record('fa15-harness-'+fit+'-incoming');
 const s=await h.save();h.write('fa15-harness-'+fit+'-visible.txt',await h.text('#adventure_notebook'));
 if(s.expansion.simulation.sessions.player)await h.click('Withdraw with spent inputs retained');
 await h.record('fa15-harness-'+fit+'-withdrawn');
}
return await h.persist('fa15-harness-final');
