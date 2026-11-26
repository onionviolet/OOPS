// Klein's own life: chart and tarot from Old Neil's lessons, the club case, and digestion by readings given in role.
// A fixture cast supplies the three places by index id; the real chart row (lotm_divination_rows.js) runs through the
// real adapter with the acting hook, so a cancelled, repeated or unclear reading is checked on the compiled commands.
import test from 'node:test';
import assert from 'node:assert/strict';

const evidence={label:'I',locator:'fixture p1'};
const place=(id,indexId,name)=>({id,indexId,name,openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence});
const people=[{id:'fixture.person.lead',indexId:'fixture.person.lead',name:'Lead',tier:'principal',relations:[],knows:[],wants:[],...evidence}];
const places=[place('fixture.place.flat','lotm.place.flat','Flat'),place('fixture.place.office','lotm.place.night-watch-reception','Office'),place('fixture.place.club','lotm.place.divination-club','Club')];
const schedule=[{id:'fixture.slot',actor:people[0].id,place:'fixture.place.flat',day:1,until:1,from:0,to:100,recurrence:'once',...evidence}];
const fixture={schema:'lotm-cast/1',people,references:[],remoteWhereabouts:[],placeAliases:[],clockClaims:[],beats:[],anchors:[],schedule,places,
 host:{profile:{id:'lotm.early_tingen.canon_beside@1',key:'beside',blurb:'Fixture'},situation:{label:'Fixture'}},
 bindings:{days:[{scene:'fixture.scene',day:1,from:0,to:100}],schedule,beats:[]},leadLife:{actorId:'fixture.person.lead',
  profile:{id:'book.lead.be@1',key:'be',label:'Be a person',beyonderTrack:false,cash:1,home:null,start:'fixture.place.flat',blurb:'Begin at home.'},
  knownPlaces:places.map(p=>p.id),history:[],relations:[],intentions:[],untakenChoices:[]}};
const savedFetch=globalThis.fetch;
globalThis.fetch=async path=>({ok:true,json:async()=>String(path).endsWith('manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:structuredClone(fixture)});
const {whenCastLoaded}=await import('../src/book_world_lotm_cast_days.js');
const host=await import('../src/book_world_lotm_cast_host.js');
await whenCastLoaded();globalThis.fetch=savedFetch;
const {bare,hostOver,registry}=await import('./lotm_helpers.js');
const {commitSimulationCommand,cancelSimulationJob,previewSimulationCommand}=await import('../src/simulation.js');
const {advanceSimulation}=await import('../src/expansion_engine.js');
const {createSimulationRegistry}=await import('../src/simulation_contracts.js');
const {simulationFacts,applySimulationEffects}=await import('../src/simulation_effects.js');
const {lotmContext}=await import('../src/book_world_lotm_actions.js');
const {quoteDivinations,defineDivinations}=await import('../src/cast_divination_adapter.js');
const {validateLotmState}=await import('../src/book_world_lotm_state.js');
const {LOTM_DIVINATION_ROWS}=await import('../src/lotm_divination_rows.js');
await import('../src/book_world_lotm_domain.js');
const B=await import('../src/book_world_lotm_be_seer.js');
const A=await import('../src/lotm_be_acting.js');

const cmds=host.castDivinationCommands;
const ref=createSimulationRegistry({commands:cmds,energies:[B.BE_SEER_ENERGY]});for(const [id,d] of ref.commands)registry.simulation.commands.set(id,d);
const vit={health:24,max_health:24,stamina:18,max_stamina:18};
// The host binds native travel to the cast's places (castJourneyContext); in the real pack the club is a destination of
// earlier carriage acts, so the fixture names it here the same way.
const ctxOf=p=>({...lotmContext(p.state,{actorId:'player',external:p.external,gameplay:p.gameplay,vitals:{player:vit},nativeAlive:true,facts:{location:p.state.simulation.people.player.location}}),
 structuredNative:{bound:true,worldId:'book.lotm.tingen',bodyId:'native.player.body',locationIds:['fixture.place.club','fixture.place.flat']}});
const ROW='lotm.div.astrological-chart';
function life(){
 const o=hostOver(bare());o.host.enroll('be',{independent:true});const p=structuredClone(o.box.p);
 applySimulationEffects(p,B.beSeerDrinkEffects(),{actorId:'player'},registry,'fixture.drink');
 return p;
}
const at=(p,id)=>{p.state.simulation.people.player.location=id;return p;};
function run(p,id,minutes){
 const out=commitSimulationCommand(p.state,registry,{id},ctxOf(p));Object.assign(p,{state:out.state,external:out.external??p.external,gameplay:out.gameplay??p.gameplay});
 const c=ctxOf(p),w=advanceSimulation(p.state,registry,minutes,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});
 return Object.assign(p,{state:w.state,external:w.external??p.external,gameplay:w.gameplay??p.gameplay});
}
const quote=(p,id)=>quoteDivinations(p.state,cmds.filter(d=>d.id===id),d=>previewSimulationCommand(p.state,registry,d.id,ctxOf(p)),{facts:d=>simulationFacts(p.state,ctxOf(p),registry,[d.requires])})[0];
const reading=p=>{for(const step of ['prepare','ask','interpret'])run(p,`${ROW}.${step}`,1);return p;};

test('the lessons, the club case and the acting hook are compiled for a cast with the office, flat and club',()=>{
 for(const id of ['lotm.be.lesson.chart','lotm.be.lesson.tarot','lotm.be.club.glacis-chart','lotm.be.club.lost-object','lotm.div.tarot-lost-object.interpret'])assert.ok(cmds.some(d=>d.id===id),id);
 assert.ok(cmds.find(d=>d.id==='lotm.div.tarot-lost-object.interpret').effects.some(e=>e.key==='book.lotm.be.acting.tarot-lost-object'));
 assert.deepEqual(host.castDivinationCommands.find(d=>d.id===`${ROW}.interpret`).effects.filter(e=>e.key?.startsWith(A.BE_ACTING_PREFIX)).map(e=>e.key),['book.lotm.be.acting.astrological-chart']);
 assert.equal(cmds.find(d=>d.id===`${ROW}.interpret.unclear`).effects.some(e=>e.key?.startsWith(A.BE_ACTING_PREFIX)),false,'an unclear reading is not the role played (COUNT_UNCLEAR)');
 const coin=defineDivinations(LOTM_DIVINATION_ROWS,{worldId:'book.lotm.tingen',group:'book_lotm',situationId:host.LOTM_CAST_SITUATION,interpretEffects:A.lotmBeInterpretEffects});
 assert.equal(coin.filter(d=>d.effects.some(e=>e.key?.startsWith(A.BE_ACTING_PREFIX))).length,3,'only the three readings for others count');
});

test('without a learned method the chart row is blocked and names what is missing; the lesson and the club open it',()=>{
 const p=at(life(),'fixture.place.flat');
 const before=quote(p,`${ROW}.prepare`);
 assert.equal(before.eligible,false);
 assert.ok(before.reasons.some(r=>/construct and read an event chart/.test(r)),before.reasons.join(' | '));
 assert.ok(!before.reasons.includes('The required knowledge, means or circumstances are missing.'));
 assert.equal(quote(p,'lotm.be.club.glacis-chart').eligible,false,'the club sends chart clients only to those who draw charts');
 assert.match(quote(p,'lotm.be.club.glacis-chart').reasons.join(' '),/Learn chart divination from Old Neil/);
 assert.equal(quote(p,'lotm.be.lesson.chart').eligible,false,'the lesson is at the office');
 run(at(p,'fixture.place.office'),'lotm.be.lesson.chart',45);run(p,'lotm.be.lesson.tarot',45);
 const kn=p.state.simulation.knowledge.player;
 assert.equal(kn['book.lotm.div.method.chart'].stage,'understood');assert.equal(kn['book.lotm.div.method.tarot'].stage,'understood');
 assert.equal(quote(p,'lotm.be.lesson.chart').eligible,false,'a lesson is taken once');
 assert.match(quote(p,`${ROW}.prepare`).reasons.join(' '),/Glacis's description/,'method learned; the client is still missing');
 run(at(p,'fixture.place.flat'),'lotm.be.club.glacis-chart',40);
 assert.equal(p.state.simulation.people.player.location,'fixture.place.club','the carriage brings Klein to the club');
 assert.ok(p.state.simulation.knowledge.player['book.lotm.div.contact.iron-mine-investment']);
 assert.ok(p.state.simulation.knowledge.player['book.lotm.div.grounds.astrological-chart']);
 assert.equal(quote(p,`${ROW}.prepare`).eligible,true);
 validateLotmState(p.state);
});

test('a completed reading counts once; a cancelled interpret step and a repeat add nothing',()=>{
 const p=at(life(),'fixture.place.office');run(p,'lotm.be.lesson.chart',45);run(at(p,'fixture.place.flat'),'lotm.be.club.glacis-chart',40);
 assert.equal(A.beActingCount(p.state),0);
 assert.match(A.lotmBeActingLine(p.state),/^The Seer potion still sits unsettled in you: 0 of 6/);
 run(p,`${ROW}.prepare`,1);run(p,`${ROW}.ask`,1);
 // Cancelled: the interpret job is refunded and writes nothing.
 const out=commitSimulationCommand(p.state,registry,{id:`${ROW}.interpret`},ctxOf(p));p.state=out.state;
 const job=p.state.simulation.jobs.find(j=>j.commandId===`${ROW}.interpret`);assert.ok(job);
 p.state=cancelSimulationJob(p.state,registry,job.id,ctxOf(p)).state;
 assert.equal(p.state.actors.player.facts['book.lotm.be.acting.astrological-chart'],undefined);
 assert.equal(A.beActingCount(p.state),0);
 run(p,`${ROW}.interpret`,1);
 assert.equal(p.state.actors.player.facts['book.lotm.be.acting.astrological-chart'],true);
 assert.equal(A.beActingCount(p.state),1);
 assert.match(A.lotmBeActingLine(p.state),/^The Seer potion is settling as you play the Seer: 1 of 6 readings given to others/);
 reading(p);
 assert.equal(A.beActingCount(p.state),1,'the same reading for the same client does not count twice');
 validateLotmState(p.state);
});

test('club client sessions the pack records count once each; six settle the potion; no line outside Klein or before the potion',()=>{
 const p=life(),f=p.state.actors.player.facts;
 for(const name of ['anna','glacis','joyce','bogda'])Object.assign(f,{[`book.lotm.be.client.${name}`]:'paid',[`book.lotm.be.client.${name}.fee`]:8,[`book.lotm.be.client.${name}.owed`]:0});
 assert.equal(A.beActingCount(p.state),4,'fee and owed suffixes are not sessions');
 f['book.lotm.be.acting.astrological-chart']=true;assert.equal(A.beActingCount(p.state),5);
 f['book.lotm.be.acting.numerology']=true;f['book.lotm.be.acting.tarot-divination']=true;
 assert.equal(A.beActingCount(p.state),5,'Joyce\'s numbers and Bogda\'s spread are the paid sessions already counted');
 f['book.lotm.be.acting.tarot-lost-object']=true;
 assert.match(A.lotmBeActingLine(p.state),/^The Seer potion has settled; you feel it fully yours: 6 of 6/);
 f['book.lotm.be.acting.future-row']=true;assert.match(A.lotmBeActingLine(p.state),/6 of 6/,'shown count stops at the need');
 assert.equal(A.lotmBeActingLine({...p.state,lotm:{...p.state.lotm,entryProfile:'lotm.early_tingen.canon_beside@1'}}),null);
 const dry=hostOver(bare());dry.host.enroll('be',{independent:true});assert.equal(A.lotmBeActingLine(dry.box.p.state),null,'no potion, no digestion');
});

test('the lost keepsake: tarot from Old Neil, Edward booked through the club, read in the Topaz room, one act',()=>{
 const p=at(life(),'fixture.place.flat'),LOST='lotm.div.tarot-lost-object';
 assert.match(quote(p,'lotm.be.club.lost-object').reasons.join(' '),/Learn tarot divination from Old Neil/);
 run(at(p,'fixture.place.office'),'lotm.be.lesson.tarot',45);
 assert.equal(quote(at(p,'fixture.place.club'),`${LOST}.prepare`),undefined,'method learned; the reading shows once Edward is booked');
 run(at(p,'fixture.place.flat'),'lotm.be.club.lost-object',40);
 assert.equal(p.state.simulation.people.player.location,'fixture.place.club');
 for(const step of ['prepare','ask','interpret'])run(p,`${LOST}.${step}`,1);
 assert.equal(p.state.actors.player.facts['book.lotm.be.acting.tarot-lost-object'],true);
 assert.equal(A.beActingCount(p.state),1);
 run(p,'lotm.be.club.home',25);assert.equal(p.state.simulation.people.player.location,'fixture.place.flat','the carriage brings Klein home');
 run(at(p,'fixture.place.club'),'lotm.be.club.home',25);assert.equal(p.state.simulation.people.player.location,'fixture.place.flat','the ride home repeats');
 validateLotmState(p.state);
});

test('the office letter: testimony, learned tarot, spirituality, digestion and a recovered-property fee',()=>{
 const p=at(life(),'fixture.place.office'),row='lotm.div.office-letter',search='lotm.be.office.letter-search';
 assert.equal(quote(p,`${row}.prepare`),undefined,'the question is not offered before the visitor supplies contact');
 assert.equal(quote(p,search).eligible,false);
 run(p,'lotm.be.office.letter-interview',10);
 assert.equal(quote(p,`${row}.prepare`).eligible,false,'the potion does not teach tarot');
 run(p,'lotm.be.lesson.tarot',45);
 const pool=()=>p.state.simulation.energies.player[B.BE_SEER_ENERGY_ID].reserve;
 const before=pool();
 for(const step of ['prepare','ask','interpret'])run(p,`${row}.${step}`,1);
 assert.equal(pool(),before-1,'a working reading spends the existing Seer reserve');
 assert.equal(A.beActingCount(p.state),1,'giving the reading has the existing digestion consumer');
 assert.match(p.state.simulation.knowledge.player[`divination.${row}.interpretation`].value,/I think/,'the interpretation remains a belief');
 const money=p.external.money;
 run(p,search,15);
 assert.equal(p.external.money,money+8);
 assert.match(p.state.simulation.knowledge.player[`divination.${search}`].value,/find the sealed letter/);
 assert.equal(quote(p,`${row}.prepare`),undefined,'a returned letter no longer offers a reading');
 const restored=structuredClone(p);
 validateLotmState(restored.state);
 assert.throws(()=>run(restored,search,15),/already|once|completed/i,'the recovered fee is not paid again');
 assert.equal(restored.external.money,money+8);
});

test('the office visitor can be helped by searching from their account, and a cancelled search pays nothing',()=>{
 const p=at(life(),'fixture.place.office'),search='lotm.be.office.letter-search';
 run(p,'lotm.be.office.letter-interview',10);
 assert.equal(quote(p,search).eligible,true,'testimony is enough to search; divination is useful practice, not permission');
 const money=p.external.money;
 run(p,search,0);
 const job=p.state.simulation.jobs.find(j=>j.commandId===search);
 assert.ok(job);
 p.state=cancelSimulationJob(p.state,registry,job.id,ctxOf(p)).state;
 assert.equal(p.external.money,money);
 assert.equal(p.state.actors.player.facts['book.lotm.office.letter.returned'],false);
 run(p,search,15);
 assert.equal(p.external.money,money+8);
 assert.equal(A.beActingCount(p.state),0,'physical searching is not acting as a Seer');
});

const deliveryVisit=()=>{
 const p=at(life(),'fixture.place.office');
 run(p,'lotm.be.office.letter-interview',10);run(p,'lotm.be.office.letter-search',15);
 run(p,'lotm.be.office.delivery-interview',10);return p;
};
test('the return visit needs chart training and exact times; paid work uses the existing client view without double acting credit',async()=>{
 const {beClientView}=await import('../src/book_world_lotm_be_clients.js');
 const {officeCustomerLines}=await import('../src/lotm_office_day.js');
 const row='lotm.div.office-delivery',paid='lotm.be.office.delivery-paid',p=deliveryVisit();
 assert.equal(quote(p,`${row}.prepare`).eligible,false,'tarot does not stand in for chart training');
 run(p,'lotm.be.lesson.chart',45);run(p,'lotm.be.office.delivery-ledger',15);
 const reserve=p.state.simulation.energies.player[B.BE_SEER_ENERGY_ID].reserve;
 for(const [part,n] of [['prepare',2],['ask',2],['interpret',2]])run(p,`${row}.${part}`,n);
 assert.equal(p.state.simulation.energies.player[B.BE_SEER_ENERGY_ID].reserve,reserve-1);
 assert.equal(A.beActingCount(p.state),1);
 const money=p.external.money;
 run(p,paid,0);
 const job=p.state.simulation.jobs.find(j=>j.commandId===paid);assert.ok(job);
 p.state=cancelSimulationJob(p.state,registry,job.id,ctxOf(p)).state;
 assert.equal(p.external.money,money,'cancelling fee settlement pays nothing');
 assert.equal(beClientView(p.state).clients.some(c=>c.id==='officecourier'),false);
 run(p,paid,2);
 assert.equal(p.external.money,money+8);
 const clients=beClientView(p.state);
 assert.equal(clients.sold['event chart'],1);
 assert.deepEqual(clients.referrals.blackthorn,{label:'Blackthorn reception',sent:1,paid:1,favor:1});
 assert.match(officeCustomerLines(p.state).join(' '),/The returning visitor: event chart · paid 8 pence · remembers your help/);
 assert.equal(A.beActingCount(p.state),1,'the reading and its paid session are the same act');
 const restored=structuredClone(p);validateLotmState(restored.state);
 assert.match(quote(restored,'lotm.be.office.delivery-courtesy').reasons.join(' '),/already been dealt/);
 assert.throws(()=>run(restored,'lotm.be.office.delivery-courtesy',2));
 assert.throws(()=>run(restored,paid,2),/already|once|completed/i);
 assert.equal(restored.external.money,money+8);
});

test('incomplete chart times leave an unclear answer: no fee, referral favor or acting credit',async()=>{
 const {beClientView}=await import('../src/book_world_lotm_be_clients.js');
 const {officeCustomerLines}=await import('../src/lotm_office_day.js');
 const p=deliveryVisit(),row='lotm.div.office-delivery';
 run(p,'lotm.be.lesson.chart',45);
 run(p,`${row}.prepare`,2);
 assert.equal(quote(p,`${row}.ask`),undefined,'a grounded chart is not offered without the exact time');
 run(p,`${row}.ask.unclear`,2);run(p,`${row}.interpret.unclear`,2);
 assert.equal(A.beActingCount(p.state),0);
 assert.equal(quote(p,'lotm.be.office.delivery-paid').eligible,false);
 assert.equal(quote(p,'lotm.be.office.delivery-courtesy').eligible,false);
 const money=p.external.money;
 run(p,'lotm.be.office.delivery-unclear',2);
 assert.equal(p.external.money,money);
 assert.equal(beClientView(p.state).clients.find(c=>c.id==='officecourier').status,'refused');
 assert.equal(beClientView(p.state).referrals.blackthorn.favor,0);
 assert.match(officeCustomerLines(p.state).join(' '),/no service completed/);
 assert.equal(A.beActingCount(p.state),0,'declining an ungrounded service is not a Seer reading');
 validateLotmState(p.state);
});

test('waiving a grounded chart’s fee keeps the helped client and one reading, with no income',async()=>{
 const {beClientView}=await import('../src/book_world_lotm_be_clients.js');
 const {officeCustomerLines}=await import('../src/lotm_office_day.js');
 const p=deliveryVisit(),row='lotm.div.office-delivery';
 run(p,'lotm.be.lesson.chart',45);run(p,'lotm.be.office.delivery-ledger',15);
 for(const part of ['prepare','ask','interpret'])run(p,`${row}.${part}`,2);
 const money=p.external.money;run(p,'lotm.be.office.delivery-courtesy',2);
 assert.equal(p.external.money,money);
 assert.equal(A.beActingCount(p.state),1);
 const v=beClientView(p.state),client=v.clients.find(c=>c.id==='officecourier');
 assert.equal(client.status,'served_unpaid');assert.equal(client.favor,1);assert.equal(client.feePence,null);
 assert.equal(v.sold['event chart'],undefined);assert.equal(v.referrals.blackthorn.paid,0);
 assert.match(officeCustomerLines(p.state).join(' '),/no fee taken · remembers your help/);
 validateLotmState(p.state);
});

const FOLLOWUP='book.lotm.office.delivery.followup';
const followupAction=part=>`lotm.be.office.followup-${part}`;
function advance(p,minutes){
 const c=ctxOf(p),w=advanceSimulation(p.state,registry,minutes,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});
 return Object.assign(p,{state:w.state,external:w.external??p.external,gameplay:w.gameplay??p.gameplay});
}
function nextMorning(p,hour=9){
 const day=host.castCalendar(p.state).calendar.day_count;
 return advance(p,p.state.lotm.initializedAt+day*1440+hour*60-p.state.clock);
}
function settledDelivery(status='paid'){
 const p=deliveryVisit(),row='lotm.div.office-delivery';run(p,'lotm.be.lesson.chart',45);
 if(status!=='refused')run(p,'lotm.be.office.delivery-ledger',15);
 for(const part of status==='refused'?['prepare','ask.unclear','interpret.unclear']:['prepare','ask','interpret'])run(p,`${row}.${part}`,2);
 run(p,`lotm.be.office.delivery-${status==='refused'?'unclear':status==='courtesy'?'courtesy':'paid'}`,2);return p;
}
test('the same paid or courtesy client remembers the help next morning; its docket drives a paid runner action',async()=>{
 const {beClientView}=await import('../src/book_world_lotm_be_clients.js');
 for(const status of ['paid','courtesy']){
  const p=settledDelivery(status),fee=p.external.money;
  assert.equal(quote(p,followupAction('visitor')).eligible,false);
  assert.match(quote(p,followupAction('ledger')).reasons.join(' '),/next day/);
  nextMorning(p);
  assert.match(quote(p,followupAction('send')).reasons.join(' '),/Get the corrected counter and docket number/);
  assert.equal(quote(p,followupAction('send')).costText,'Two pence to the runner.');
  assert.equal(quote(p,followupAction('visitor')).eligible,true);
  run(p,followupAction('visitor'),5);
  assert.ok(p.state.simulation.knowledge.player[`${FOLLOWUP}.reference`]);
  assert.equal(quote(p,followupAction('ledger')).eligible,false,'the two methods supply the same reference');
  run(p,followupAction('send'),0);assert.equal(p.external.money,fee-2,'runner postage is reserved');
  const job=p.state.simulation.jobs.find(j=>j.commandId===followupAction('send'));assert.ok(job);
  const cancelled=cancelSimulationJob(p.state,registry,job.id,ctxOf(p));
  Object.assign(p,{state:cancelled.state,external:cancelled.external??p.external,gameplay:cancelled.gameplay??p.gameplay});
  assert.equal(p.external.money,fee,'cancelling returns the reserved postage');
  run(p,followupAction('send'),15);assert.equal(p.external.money,fee-2);
  assert.equal(p.state.actors.player.facts[`${FOLLOWUP}.corrected`],true);
  assert.equal(A.beActingCount(p.state),1,'administrative help is not another Seer reading');
  const customer=beClientView(p.state).clients.find(c=>c.id==='officecourier');assert.equal(customer.favor,1);
  const restored=structuredClone(p);validateLotmState(restored.state);
  assert.equal(quote(restored,followupAction('send')).eligible,false);
 }
});
test('a declined chart leaves no helpful memory; the longer reception search obtains the same usable instruction',async()=>{
 const {officeFollowupView}=await import('../src/lotm_office_followup.js');
 const helped=nextMorning(settledDelivery());run(helped,followupAction('visitor'),5);
 const p=nextMorning(settledDelivery('refused')),money=p.external.money;
 assert.equal(quote(p,followupAction('visitor')).eligible,false);
 assert.match(quote(p,followupAction('visitor')).reasons.join(' '),/no chart was completed/);
 assert.equal(quote(p,followupAction('ledger')).eligible,true);
 run(p,followupAction('ledger'),45);
 assert.equal(p.state.simulation.knowledge.player[`${FOLLOWUP}.reference`].value,helped.state.simulation.knowledge.player[`${FOLLOWUP}.reference`].value);
 assert.equal(officeFollowupView(p.state).remembers,false);
 run(p,followupAction('send'),15);assert.equal(p.external.money,money-2);
 assert.equal(p.state.actors.player.facts[`${FOLLOWUP}.corrected`],true);assert.equal(A.beActingCount(p.state),0);
});
test('the visitor leaves after the return window, but a cancellable public search remains reachable',()=>{
 const p=nextMorning(settledDelivery(),11);
 assert.equal(quote(p,followupAction('visitor')).eligible,false);
 assert.match(quote(p,followupAction('visitor')).reasons.join(' '),/route takes them away/);
 assert.equal(quote(p,followupAction('ledger')).eligible,true);
 run(p,followupAction('ledger'),0);
 const job=p.state.simulation.jobs.find(j=>j.commandId===followupAction('ledger'));
 p.state=cancelSimulationJob(p.state,registry,job.id,ctxOf(p)).state;
 assert.equal(p.state.simulation.knowledge.player[`${FOLLOWUP}.reference`],undefined);
 run(p,followupAction('ledger'),45);
 assert.equal(quote(p,followupAction('send')).eligible,true);
});
