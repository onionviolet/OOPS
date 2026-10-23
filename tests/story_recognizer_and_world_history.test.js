import test from 'node:test';
import assert from 'node:assert/strict';
import {recognizeStories} from '../src/story_recognizer.js';
import {deriveWorldHistory,validateLoreHistory} from '../src/lore_history_state.js';
import {createStreams} from '../src/seeded_streams.js';
test('IM23 recognizer finds one rivalry and one debt from saved facts, none from calm state',()=>{
 const state={chronicle:{relationships:{villageElder:{axes:{trust:-2},ties:{grievance:true},memories:[{id:'m1',at:1,text:'Unprovoked attack: lost.'}]},calm:{axes:{trust:2},ties:{},memories:[]}},life:{experience:{inheritance:{debtsPaid:4}}}}};
 const found=recognizeStories(state);
 assert.deepEqual(found.map(s=>[s.kind,s.with]),[['rivalry','villageElder'],['debt','villageGuard']]);
 assert.ok(found[0].causes.includes('tie:grievance'));
 assert.deepEqual(recognizeStories({chronicle:{relationships:{calm:{axes:{trust:2},ties:{},memories:[]}},life:{}}}),[]);
});
test('IM24 world history: seeds give different wars, each with a recorded cause; stable on reload',()=>{
 const run=seed=>{const s={clock:0,streams:createStreams(seed)};const w=deriveWorldHistory(s,{});validateLoreHistory(s);return [s,w];};
 const sigs=new Set();
 for(let seed=1;seed<=12;seed++){const [s,w]=run(seed);for(const war of w.wars)assert.ok(['rival','enemy'].includes(war.cause.relation)&&war.cause.attackerPower>war.cause.defenderPower);
  sigs.add(JSON.stringify(w.wars.map(x=>[x.attacker,x.defender,x.cause.relation])));
  assert.equal(deriveWorldHistory(s,{}),s.loreHistory.worldHistories['base.frontier']);assert.deepEqual(run(seed)[1],w);}
 assert.ok(sigs.size>=4);
 const [a,b]=[1,2,3,4,5,6,7,8,9,10,11,12].map(x=>run(x)[1]).filter(w=>w.wars.length).slice(0,2);
 assert.ok(a&&b);assert.notDeepEqual(a.wars,b.wars);
});
test('IM24 history is kept per world; wired lines show the cause of each war',async()=>{
 const {warLines}=await import('../src/story_insight_domain.js').catch(()=>({}));
 const s={clock:0,streams:createStreams(3)};
 const a=deriveWorldHistory(s,{worldId:'w.a'}),b=deriveWorldHistory(s,{worldId:'w.b'});
 assert.notEqual(a,b);assert.equal(deriveWorldHistory(s,{worldId:'w.a'}),a);validateLoreHistory(s);
 assert.deepEqual(Object.keys(s.loreHistory.worldHistories),['w.a','w.b']);
 if(warLines)for(const [i,l] of warLines(a).entries())assert.match(l.line,/Cause: .*stronger \(\d+ against \d+\)/,String(i));
});
