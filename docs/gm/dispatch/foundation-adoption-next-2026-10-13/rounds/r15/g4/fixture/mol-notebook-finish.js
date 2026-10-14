const log=[];const tick=n=>{for(let i=0;i<n;i++)seed.update_timer();};
const cmd=(id,n=0)=>{console.log('CMD',id);seed.actFeatureExpansion({type:'book_mol',id:'book.mol.'+id});tick(n);log.push({id,clock:seed.expansionState.clock});};
cmd('decline');cmd('move.house');cmd('sample_research',5);cmd('move.library');cmd('temporal_study',4);cmd('deposit_research',3);cmd('move.house');cmd('close_service_arc');tick(5);cmd('move.library');cmd('compile_notebook',5);cmd('move.station');cmd('return');seed.change_location({location_id:'Shack',skip_travel_time:true});
seed.character.addToInventory([{item_id:'Green repair offcut',count:10},{item_id:'Field fitting knife',count:1}]);
await writeFile(owner+'/MOL-SEED-LOG.json',JSON.stringify(log,null,2));
