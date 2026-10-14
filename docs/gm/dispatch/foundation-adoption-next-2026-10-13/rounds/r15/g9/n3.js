await start('N3','ST03');let s,reports=0;
for(const id of recipe.journeys.find(t=>t.id==='ROUTE-N3').commands){
 if(id==='weekly_warden_report'){
  assert.equal(await enabled(id),false);s=await saved();const due=s.expansion.simulation.conditions.player['p08.report_wait'].expiresAt;
  assert.equal(typeof due,'number');await advance(due-s.expansion.clock-1);assert.equal(await enabled(id),false);await advance(1);assert.equal(await enabled(id),true);
  s=await fastAct(id);reports++;assert.equal(s.expansion.simulation.owners['p08.warden'][key('silver')],reports*3);assert.equal(s.expansion.simulation.owners['p08.employer'][key('silver')],12-reports*3);assert.equal(await enabled(id),false);
  record('N3-weekly-'+reports,{paidTotal:reports*3,employerRemainder:12-reports*3,oneMinuteBeforeDueRefused:true});await roundtrip('N3-report-'+reports);
 }else {s=await fastAct(id);if(id==='recognize_warden')await roundtrip('N3-recognized');if(id==='escort_warden_home'){assert.equal(s.expansion.simulation.people['p08.warden'].location,'p08.woods');assert.equal(s.expansion.simulation.claims['p08.writ01.title'].owner,'p08.warden');assert.equal(await enabled('write_woodland_report'),false);record('N3-continuation',{freshObservationRequired:true});}}
}
return results.map(r=>r.id);
