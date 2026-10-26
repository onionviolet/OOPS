const tick=n=>{for(let i=0;i<n;i++)seed.update_timer();};
const cmd=(id,n=0)=>{seed.actFeatureExpansion({type:'book_mol',id:'book.mol.'+id});tick(n);};
tick(1);
assert.equal(seed.expansionState.simulation.powers.player['book.mol.formula_operator'].mastery,1);
cmd('move.workshop');cmd('lamp_test');
cmd('move.sewer');cmd('taiven_offer');cmd('survey_ordinary',2);cmd('decline');cmd('move.house');cmd('close_service_arc');
assert.equal(seed.expansionState.worlds['book.mol.cyoria'].facts['book.mol.arcClosed'],true);
assert.equal(seed.expansionState.actors.player.facts['book.mol.lampTested'],true);
