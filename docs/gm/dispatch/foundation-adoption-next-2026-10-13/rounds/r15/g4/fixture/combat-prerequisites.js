const log=[];const tick=n=>{for(let i=0;i<n;i++)seed.update_timer();};
const cmd=(id,n=0,type='command',targetId=null)=>{console.log('CMD',id);if(type==='command')seed.actSimulation({type,id,targetId});else seed.actFeatureExpansion({type,id,targetId});tick(n);log.push({id,clock:seed.expansionState.clock});};
seed.change_location({location_id:'Village',skip_travel_time:true});
cmd('body.begin');cmd('body.study_balance',2);cmd('body.grip_drill',3);cmd('body.recover',3);cmd('body.grip_drill',3);cmd('body.recover',3);cmd('body.condition_grip');
cmd('skills.brace.observe',1,'command','partyPartner');cmd('skills.brace.learn',3,'command','partyPartner');
for(let i=0;i<4;i++)cmd('skills.brace.practice',4);
for(let i=0;i<2;i++)cmd('feature_powers.brace.sustained',6,'feature_command');
cmd('feature_powers.brace.interpose',6,'feature_command');
await writeFile(owner+'/COMBAT-SEED-LOG.json',JSON.stringify(log,null,2));
