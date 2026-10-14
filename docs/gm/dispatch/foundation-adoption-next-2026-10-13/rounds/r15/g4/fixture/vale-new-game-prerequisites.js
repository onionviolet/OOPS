const tick=n=>{for(let i=0;i<n;i++)seed.update_timer();};
const c=(id,type='audit_remainder',n=0)=>{console.log('CMD',id,seed.expansionState.clock);if(type==='society')seed.actFeatureExpansion({type,action:{type:'command',id}});else seed.actFeatureExpansion({type,id});tick(n);};
// Native dialogue rewards only. The public G1 base already met the elder;
// meeting the ordinary craftsman is the free native introduction.
seed.start_dialogue('oldCraftsman');seed.start_textline('hello');seed.end_dialogue();
seed.actFeatureExpansion({type:'society',action:{type:'begin'}});
c('feature_society.terms','society');c('feature_society.supply','society');c('feature_society.authorize_home','society');seed.fixtureActorCommand('feature_society.orr_repair');tick(6);c('feature_society.hear_home','society');c('feature_society.request_apprentice','society');seed.fixtureActorCommand('feature_society.vale_answer_bounded');c('feature_society.hear_acceptance','society');c('feature_society.fund_lesson','society');seed.fixtureActorCommand('feature_society.orr_teach');tick(5);c('feature_society.hear_lesson','society');
seed.actFeatureExpansion({type:'objects_begin'});c('feature_objects.inspect','command',2);seed.actFeatureExpansion({type:'reference_control',action:'enroll'});c('reference_gameplay.open','reference_workshop');c('audit_remainder.enroll');c('remainder_livelihood.allocation_terms');
await writeFile(owner+'/VALE-SEED-LOG.json',JSON.stringify({clock:seed.expansionState.clock,wet:seed.expansionState.worlds['base.frontier'].facts['workbench.wet'],event:Object.values(seed.expansionState.simulation.events).find(e=>e.definitionId==='village.shower')},null,2));
