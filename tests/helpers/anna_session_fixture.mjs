// Exact canonical KJ3AA operation rows with an explicitly shortened QA entry.
// This does not certify arrival through earlier chapters or a whole campaign.
import {conversationKnowledgeFixture} from './conversation_knowledge_fixture.mjs';
import {beSeerDrinkEffects,beSeerSteadyEffects} from '../../src/book_world_lotm_be_seer.js';
import {ANNA_ID} from '../../src/lotm_anna_session_items.js';
const P='book.lotm.kj3aa.',S='book.lotm.tingen.canon_beside';
export const ANNA_ROUTE=['study','method','details','astrolabe','hermes','cogitate','dream','omens','reveal','paid'];
export const ANNA_ENTRY='book.lotm.fixture_anna.entry';
export function annaSessionFixture(source){
 if(!source.householdActs?.requiredPeople?.includes(ANNA_ID)||!source.people?.some(p=>p.id===ANNA_ID&&p.status!=='historical-reference'))throw Error('The actual pack must provision the selected recipient.');
 const pack=conversationKnowledgeFixture(),sourceRows=new Map(source.householdActs.acts.map(r=>[r.id,r]));
 const acts=ANNA_ROUTE.map(k=>structuredClone(sourceRows.get(P+k)));if(acts.some(x=>!x))throw Error('Missing canonical Anna operation.');
 const club=acts[0].place,old=pack.leadLife.profile.start,lead=pack.leadLife.actorId;
 pack.places=[{...pack.places.find(p=>p.id===old),id:club,name:'Divination Club · Anna session fixture'}];
 pack.people=[pack.people.find(p=>p.id===lead),{id:ANNA_ID,indexId:'fixture.anna',name:'Anna Wayne',tier:'principal',relations:[],knows:[],wants:[],label:'I',locator:'en v1 ch55; shortened QA cast'}];
 pack.references=[];pack.schedule=[];pack.bindings.schedule=[];pack.remoteWhereabouts=[];pack.anchors=[];pack.beats=[];
 pack.leadLife.profile.start=club;pack.leadLife.knownPlaces=[club];pack.leadLife.history=[];pack.leadLife.relations=[];pack.leadLife.intentions=[];pack.leadLife.untakenChoices=[];
 pack.host.profile.start=club;delete pack.topicTalks;
 const prior=acts[0].requires.all.filter(g=>g.fact?.startsWith('actor.book.lotm.kj3z.')).map(g=>({type:'fact',scope:'actor',actor:'player',key:g.fact.slice(6),value:g.value}));
 const entry={id:ANNA_ENTRY,place:club,minutes:1,operation:'use',label:'Enter the selected session fixture',flavour:'Fixture note: preparation and execution remain separate.',description:'QA entry: prior arrival and acquired source; a method name heard, no learned method.',report:'The shortened entry is ready. Hearing the method name has not taught it.',knowledgeKey:'book.lotm.fixture_anna.ready',costs:[],effects:[...prior,...beSeerDrinkEffects(),...beSeerSteadyEffects(),{type:'fact',scope:'world',key:'household.excursion.meeting.active',value:false},{type:'knowledge',actor:'player',key:'book.lotm.div.method.astrolabe',stage:'seen',value:'You heard the name of astrolabe divination.',basis:{kind:'observation',attributedTo:'player',situationId:S}}]};
 pack.householdActs={acts:[entry,...acts],requiredPeople:[ANNA_ID],sequence:{id:'book.lotm.fixture_anna.sequence',title:'Anna’s divination session · shortened entry',stages:[entry,...acts].map(r=>({commandId:r.id,label:r.label})),conclusion:'The advice reached Anna before payment.'}};
 return pack;
}
