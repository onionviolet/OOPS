import test from 'node:test';
import assert from 'node:assert/strict';
import {createSimulationState} from '../src/simulation_contracts.js';
import {createExpansionState,validateExpansionState} from '../src/expansion_engine.js';
import {expeditionRegistry as registry,initializeExpedition} from '../src/expedition_content.js';
import {registerMistglassNative,mistglassContext,stageMistglassTravel,stageMistglassTeaching,stageMistglassMethod,validateMistglassEnvelope} from '../src/absorb_p23/host_joins/world_adaptation.js';
import {mistglassHistoryView} from '../src/mistglass_history.js';
import {validateLoreHistory} from '../src/lore_history_state.js';
import {knownStoryOutcomes} from '../src/lore_history_view.js';
registerMistglassNative(registry);
const native={body:{id:'native.player.body',form:'human',ownerId:'player',controllerId:'player'},alive:true,location:'p23.mistglass.conservatory'};
function arrive(seed){const state=initializeExpedition(createExpansionState(seed));state.simulation={...createSimulationState(seed),enrolledAt:0};state.simulation.people.player={life:'alive',location:'Village',inventory:'native',bornAt:0};state.sequence++;
 const p={state,external:{money:20},gameplay:{player:{inventory:{'{"id":"Rough wood log"}':1},skills:{},reputation:{Village:0}}}};stageMistglassTravel(p,'enter');return p;}
test('W3 retained cause binds two real owners; accounts and masonry stay observer-scoped; physical restoration settles native work',()=>{
 const branches=new Map();for(let seed=1;seed<40&&branches.size<2;seed++){const p=arrive(seed);branches.set(p.state.mistglassRealm.history.id,p);}
 assert.equal(branches.size,2);
 for(const [id,p]of branches){
  const ctx=()=>mistglassContext(p.state,native),h=structuredClone(p.state.mistglassRealm.history);
  validateLoreHistory(p.state);assert.equal(knownStoryOutcomes(p.state).length,0);
  assert.equal(mistglassHistoryView(p.state).account,null);
  assert.throws(()=>stageMistglassMethod(p,ctx(),registry,'history:inspect'),/Hear/);
  stageMistglassTeaching(p,ctx(),registry);assert.equal(mistglassHistoryView(p.state,'someone_else').account,null);
  stageMistglassMethod(p,ctx(),registry,'history:inspect');assert.ok(mistglassHistoryView(p.state).consequence);
  stageMistglassMethod(p,ctx(),registry,'history:restore');assert.equal(p.gameplay.player.inventory['{"id":"Rough wood log"}'],undefined);
  assert.equal(p.state.worldAdaptation.sluice.lastCost,0);assert.equal(p.state.worldAdaptation.sluice.route,'brace');
  assert.equal(p.external.money,id==='keeper-built'?22:20);assert.equal(p.gameplay.player.reputation.Village,id==='mill-race'?1:0);
  const snapshot=structuredClone(p);assert.throws(()=>stageMistglassMethod(p,ctx(),registry,'history:restore'),/Inspect/);assert.deepEqual(p,snapshot);
  validateMistglassEnvelope({expansion:p.state,'current location':native.location});validateExpansionState(p.state,registry);
  const saved=JSON.parse(JSON.stringify(p));stageMistglassTravel(saved,'exit');saved.state.sequence++;stageMistglassTravel(saved,'enter');
  assert.deepEqual(saved.state.mistglassRealm.history,h);assert.equal(saved.state.loreHistory.receipts.length,1);
  const bad=structuredClone(p.state);bad.worlds['p23.mistglass'].facts['p23.mistglass.sluiceOwner']='invented';
  assert.throws(()=>validateMistglassEnvelope({expansion:bad,'current location':native.location}),/retained cause/);
 }
});
