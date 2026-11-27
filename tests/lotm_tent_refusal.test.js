import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,I} from './lotm_helpers.js';
import {planLotmCastBeats} from '../src/book_world_lotm_cast_host.js';
import {newBeatState} from '../src/beat_records.js';
import {TENT_REFUSAL,TENT_READING,DIRECT_GROCERIES,tentReadingObserved,tentSequenceView,tentSequenceData} from '../src/lotm_tent_refusal.js';
import {placeActSequenceView,sequencePrerequisites} from '../src/place_act_sequence.js';

const reading={id:'lotm.cast.klein-moretti.106',scene:'lr.lotm.main.106',dayIndex:1,
 actor:I.supervisor,place:'fixture.tent',effects:[{fact:'fixture.reading.occurred',value:true}],
 knows:[{key:'cast.learned.1766b665ffe50890ed9c',value:'Fixture observed card.',audience:'actor'},
 {key:'cast.learned.fca260c6a7c402f38daa',value:'Fixture interrupted reading.',audience:'actor'}]};
const later={id:'fixture.later',scene:'fixture.later',dayIndex:1,actor:I.supervisor,place:'fixture.market',
 effects:[],knows:[{key:'fixture.later.conversation',value:'A separately heard conversation.',audience:'actor'}]};
const pack={people:[{id:I.supervisor}],placeAliases:[],leadLife:{actorId:I.supervisor},
 bindings:{days:[{scene:reading.scene,day:1,from:520,to:540},{scene:later.scene,day:1,from:545,to:560}],
 beats:[reading,later],schedule:[]}};
const base=fresh();base.state.lotm.entryProfile='book.lead.be@1';base.state.lotm.runMode='canon';
base.state.clock=base.state.lotm.initializedAt+550;

test('scheduled card knowledge waits for actual reading; refusal withholds it without suppressing later conversation',()=>{
 const s=structuredClone(base.state);
 const before=JSON.stringify(s),pending=planLotmCastBeats(s,newBeatState(),pack);
 assert.equal(JSON.stringify(s),before,'planning does not mutate the life');
 assert.equal(pending.ledger.done[reading.id],undefined);
 assert.equal(pending.knowledgeWrites.some(w=>w.cause===reading.id),false);
 s.actors.player.completed[TENT_REFUSAL]=1;
 s.actors.player.completed['book.lotm.excursion.market']=1;
 const out=planLotmCastBeats(JSON.parse(JSON.stringify(s)),newBeatState(),pack);
 assert.equal(out.ledger.done[reading.id],undefined,'skipped source beat is not completed');
 assert.equal(out.ledger.facts['fixture.reading.occurred'],undefined);
 assert.deepEqual(out.knowledgeWrites.filter(w=>w.effect.actor==='player').map(w=>w.effect.key),['fixture.later.conversation']);
 assert.equal(planLotmCastBeats(s,out.ledger,pack).knowledgeWrites.length,0,'replay does not duplicate later knowledge');
});

test('canonical completed reading and older already-earned observations keep their normal beat and memories',()=>{
 for(const mode of ['completed','observed','legacy-market']){
  const s=structuredClone(base.state);
  if(mode==='completed')s.actors.player.completed[TENT_READING]=1;
  if(mode==='legacy-market')s.actors.player.completed['book.lotm.excursion.market']=1;
  if(mode==='observed')(s.simulation.knowledge.player??={})['cast.learned.1766b665ffe50890ed9c']={value:'Existing observation.'};
  const out=planLotmCastBeats(s,newBeatState(),pack);
  assert.equal(out.ledger.facts['fixture.reading.occurred'],true,mode);
  assert.equal(out.knowledgeWrites.filter(w=>w.effect.actor==='player'&&w.cause===reading.id).length,2,mode);
 }
 const local=structuredClone(base.state);local.lotm.entryProfile='lotm.early_tingen.canon_beside@1';delete local.lotm.runMode;
 assert.equal(planLotmCastBeats(local,newBeatState(),pack).ledger.facts['fixture.reading.occurred'],true,'local does not change the source actor event');
});

test('alternative resolution is explicit, cached and leaves source stages and performed counts intact',()=>{
 const data={acts:[TENT_READING,'book.lotm.excursion.decline','book.lotm.excursion.market'].map(id=>({id,place:'fixture.tent',knowledgeKey:id+'.seen'})),
 sequence:{id:'fixture.arc',title:'Shopping',stages:[TENT_READING,'book.lotm.excursion.decline','book.lotm.excursion.market'].map(commandId=>({commandId,label:commandId}))}};
 const original=JSON.stringify(data),resolved=tentSequenceData(data),s=structuredClone(base.state);
 assert.equal(tentSequenceData(data),resolved);
 assert.equal(JSON.stringify(data),original);
 assert.equal(placeActSequenceView(s,resolved).next.id,TENT_READING);
 s.actors.player.completed[TENT_REFUSAL]=1;
 const view=placeActSequenceView(s,resolved);
 assert.equal(view.next.id,'book.lotm.excursion.market');assert.equal(view.skipped,2);assert.equal(view.completed,0);
 assert.equal(s.actors.player.completed[TENT_READING],undefined);
 const guard=sequencePrerequisites(resolved,'book.lotm.excursion.market');
 assert.ok(guard[0].any.some(r=>r.fact===`completed.${TENT_REFUSAL}`));
});


test('last result follows actual alternative and purchase timestamps without rewriting receipts',()=>{
 const names=['bread','reading','decline','market'];
 const data=tentSequenceData({acts:names.map(n=>({id:'book.lotm.excursion.'+n,place:'fixture.tent',knowledgeKey:'book.lotm.excursion.'+n+'.seen'})),
  sequence:{id:'fixture.shopping',title:'Shopping',stages:names.map(n=>({commandId:'book.lotm.excursion.'+n,label:n}))}});
 const s=structuredClone(base.state);s.simulation.knowledge.player={};
 s.actors.player.completed['book.lotm.excursion.bread']=1;
 s.simulation.knowledge.player['book.lotm.excursion.bread.seen']={at:500,value:'Bread bought.'};
 s.actors.player.completed[TENT_REFUSAL]=1;
 s.simulation.knowledge.player[TENT_REFUSAL+'.seen']={at:521,value:'You thank her and keep hold of the bread. The market is your next stop.'};
 let view=placeActSequenceView(s,data);
 assert.equal(view.next.id,'book.lotm.excursion.market');assert.equal(view.aftermathAt,521);
 assert.match(view.aftermath,/thank her/);
 s.actors.player.completed['book.lotm.excursion.market']=1;
 // Object/key ordering is not chronology, including after import.
 s.simulation.knowledge.player={'book.lotm.excursion.market.seen':{at:530,value:'Mutton and vegetables bought.'},...s.simulation.knowledge.player};
 const before=JSON.stringify(s);
 view=placeActSequenceView(JSON.parse(before),data);
 assert.equal(view.aftermath,'Mutton and vegetables bought.');assert.equal(view.aftermathAt,530);
 assert.equal(JSON.stringify(s),before);assert.equal(view.completed,2);assert.equal(view.skipped,2);
});


test('direct groceries elsewhere do not mint approach/card knowledge, but a real later approach remains possible',()=>{
 const offer={...reading,id:'lotm.cast.klein-moretti.105',scene:'lr.lotm.main.105',place:'fixture.square',
  effects:[{fact:'fixture.approach.occurred',value:true}],knows:[{key:'fixture.invitation',value:'A free reading is offered.',audience:'actor'}]};
 const source={...pack,people:[{id:I.supervisor,indexId:'lotm.person.animal-trainer-fortune-teller'}],places:[{id:'fixture.tent',indexId:'lotm.place.fortune-tent'}],bindings:{...pack.bindings,
  schedule:[{id:'fixture.staff',actor:I.supervisor,place:'fixture.tent',day:1,until:1,from:520,to:540,recurrence:'once',source:'canon',label:'I'}],beats:[offer,...pack.bindings.beats],days:[{scene:offer.scene,day:1,from:500,to:520},...pack.bindings.days]}};
 const s=structuredClone(base.state);s.actors.player.completed[DIRECT_GROCERIES]=1;
 s.simulation.people.player.location='fixture.market';
 let out=planLotmCastBeats(s,newBeatState(),source);
 assert.equal(out.ledger.done[reading.id],undefined);assert.equal(out.ledger.done[offer.id],undefined);
 assert.equal(out.knowledgeWrites.some(w=>w.effect.key==='fixture.invitation'),false);
 s.clock=s.lotm.initializedAt+519;s.simulation.people.player.location='fixture.square';
 out=planLotmCastBeats(s,newBeatState(),source);
 assert.ok(out.knowledgeWrites.some(w=>w.effect.key==='fixture.invitation'));
 assert.equal(out.knowledgeWrites.some(w=>w.cause===reading.id),false,'invitation is not a drawn card');
 s.simulation.people.player.location='fixture.tent';
 assert.equal(planLotmCastBeats(s,newBeatState(),source).knowledgeWrites.some(w=>w.cause===offer.id),false,'an unstaffed tent is not a heard conversation');
 s.clock=s.lotm.initializedAt+520;s.simulation.people[I.supervisor].location='fixture.tent';
 assert.ok(planLotmCastBeats(s,newBeatState(),source).knowledgeWrites.some(w=>w.cause===offer.id),'actual supported tent approach retains invitation knowledge');

 s.clock=s.lotm.initializedAt+525;s.actors.player.completed[TENT_READING]=1;
 assert.ok(planLotmCastBeats(s,newBeatState(),source).knowledgeWrites.some(w=>w.cause===reading.id));
});

test('market breadcrumb follows direct admission rather than reconstructing a missing reading receipt',()=>{
 const data={acts:[{id:TENT_READING,place:'fixture.tent',knowledgeKey:TENT_READING+'.seen',label:'Read'},
  {id:'book.lotm.excursion.market',place:'fixture.market',knowledgeKey:'fixture.groceries',label:'Buy groceries'}],
  sequence:{id:'fixture.shopping',title:'Shopping',stages:[{commandId:TENT_READING,label:'Read'},{commandId:'book.lotm.excursion.market',label:'Buy groceries'}]}};
 const s=structuredClone(base.state);s.simulation.people.player.location='fixture.market';
 assert.equal(tentSequenceView(s,data).next.id,DIRECT_GROCERIES);
 s.simulation.knowledge.player={'cast.learned.1766b665ffe50890ed9c':{at:520,value:'An old retained card observation.'}};
 assert.equal(tentSequenceView(s,data).next.id,TENT_READING,'old observed card cannot select the no-reading branch');
 assert.equal(s.actors.player.completed[TENT_READING],undefined,'view does not repair or invent command history');
});


test('bread-stage shopping alternative requires this life, its current route and an eligible known walk',()=>{
 const data={acts:[{id:TENT_READING,place:'fixture.tent',knowledgeKey:TENT_READING+'.seen',label:'Read'},
  {id:'book.lotm.excursion.market',place:'fixture.market',knowledgeKey:'fixture.groceries',label:'Buy groceries'}],
  sequence:{id:'fixture.shopping',title:'Shopping',stages:[{commandId:TENT_READING,label:'Read'},{commandId:'book.lotm.excursion.market',label:'Buy groceries'}]}};
 const s=structuredClone(base.state);s.simulation.people.player.location='fixture.bakery';
 const walk={id:'fixture.market.walk',to:'fixture.market',label:'Walk to Market · 2 min',eligible:true};
 const offered=tentSequenceView(s,data,[walk]);
 assert.equal(offered.next.id,TENT_READING);assert.equal(offered.alternatives[0].walkId,walk.id);
 assert.equal(tentSequenceView(s,data,[{...walk,eligible:false}]).alternatives,undefined);
 assert.equal(tentSequenceView(s,data,[]).alternatives,undefined);
 s.actors.player.completed[DIRECT_GROCERIES]=1;
 assert.equal(tentSequenceView(s,data,[walk]).alternatives,undefined);
 delete s.actors.player.completed[DIRECT_GROCERIES];s.lotm.entryProfile='lotm.early_tingen.canon_beside@1';
 assert.equal(tentSequenceView(s,data,[walk]).alternatives,undefined);
});


test('interpretation needs a performed reading or retained observation, not a resolved stage or approach',()=>{
 const s=structuredClone(base.state);s.actors.player.completed[DIRECT_GROCERIES]=1;
 s.simulation.knowledge.player={'cast.learned.617386b91ade59e8bef9':{at:520,value:'The free invitation.'}};
 assert.equal(tentReadingObserved(s),false);
 s.actors.player.completed[TENT_REFUSAL]=1;assert.equal(tentReadingObserved(s),false);
 delete s.actors.player.completed[TENT_REFUSAL];
 s.simulation.knowledge.player['cast.learned.1766b665ffe50890ed9c']={at:525,value:'A retained observed card.'};
 assert.equal(tentReadingObserved(s),true,'legacy observed card supports the actual response');
 delete s.simulation.knowledge.player['cast.learned.1766b665ffe50890ed9c'];
 s.simulation.knowledge.player['fixture.actual.reading']={at:525,value:'The actually performed reading.'};
 assert.equal(tentReadingObserved(s,'fixture.actual.reading'),true,'uses the mounted row actual knowledge key');
 delete s.simulation.knowledge.player['fixture.actual.reading'];s.actors.player.completed[TENT_READING]=1;
 assert.equal(tentReadingObserved(s),true,'retained native completion still attests performed work');
});
