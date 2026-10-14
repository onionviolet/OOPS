seed.change_location({location_id:'Village',skip_travel_time:true});
for(let i=0;i<5;i++)seed.update_timer();seed.actSimulation({type:'command',id:'party.meet'});
seed.character.addToInventory([{item_id:'Braced field harness',count:1},{item_id:'Field fitting knife',count:2},{item_id:'Green repair offcut',count:8}]);
