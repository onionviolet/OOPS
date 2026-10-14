const base=path.resolve(h.evidence,'../fixture/TEST-FIXTURE-R15-G4-combat.txt');
for(const [name,maneuver,steps]of [['balance','Sure-footed balance step',1],['grip-rope','Conditioned grip and owned rope',3],['traversal','Use traversal lashing for two retreat steps',1],['maintained','Maintain one brace for yourself',0]]){
 await h.importFile(base);await h.play();await h.click('Review harness fits and earned body maneuvers');
 if(name==='traversal'){await h.click('Work a traversal lashing');await h.advance(3);}
 await h.click(name==='traversal'?'Challenge: Reserve a traversal lashing':'Challenge the sluice claim');await h.record('fa15-'+name+'-admitted');
 if(name==='grip-rope'){for(let i=0;i<3;i++){await h.click(maneuver);await h.record('fa15-'+name+'-step'+(i+1));}}
 else {await h.click(maneuver);await h.record('fa15-'+name+'-used');if(steps)await h.click('Advance the retreat line');}
 if(name==='maintained'){await page.clock.runFor(6000);await h.record('fa15-maintained-upkeep');const release=page.getByRole('button',{name:'Release your maintained brace'}).filter({visible:true});if(await release.count()&&await release.first().isEnabled()){await h.click('Release your maintained brace');await h.record('fa15-maintained-released');}else await h.record('fa15-maintained-native-drop');await h.click('Withdraw with spent inputs retained');}
 await h.record('fa15-'+name+'-final');
}
return await h.persist('fa15-maneuvers-final');
