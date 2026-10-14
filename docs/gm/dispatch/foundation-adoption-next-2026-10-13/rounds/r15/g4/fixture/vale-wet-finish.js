seed.end_dialogue();seed.end_dialogue();
if(!seed.expansionState.actors.player.completed['feature_objects.inspect'])seed.actFeatureExpansion({type:'command',id:'feature_objects.inspect'});
if(!seed.expansionState.referenceGameplay)seed.actFeatureExpansion({type:'reference_control',action:'enroll'});
seed.actFeatureExpansion({type:'reference_workshop',id:'reference_gameplay.open'});
seed.actFeatureExpansion({type:'audit_remainder',id:'audit_remainder.enroll'});
seed.actFeatureExpansion({type:'audit_remainder',id:'remainder_livelihood.allocation_terms'});
await writeFile(owner+'/VALE-SEED-LOG.json',JSON.stringify({clock:seed.expansionState.clock,wet:seed.expansionState.worlds['base.frontier'].facts['workbench.wet'],event:Object.values(seed.expansionState.simulation.events).find(e=>e.definitionId==='village.shower')},null,2));
