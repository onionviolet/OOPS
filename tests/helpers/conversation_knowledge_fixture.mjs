// Synthetic, non-canon cast for a native conversation journey. No library text.
const evidence={label:'I',locator:'synthetic conversation fixture'};
// Use the host's cast namespaces so its cold-load dormant-record restoration is
// exercised too. These repeated digits are synthetic identifiers, not cast IDs.
const lead='lotm.person.cast-aaaaaaaaaaaaaaaaaaaa',person='lotm.person.cast-bbbbbbbbbbbbbbbbbbbb',away='lotm.person.cast-cccccccccccccccccccc';
const room='lotm.place.cast-11111111111111111111',other='lotm.place.cast-22222222222222222222';
const know=(actor,key,value)=>({type:'knowledge',actor,key,value,stage:'seen',basis:{kind:'instruction',attributedTo:'player',at:'synthetic conversation fixture'}});
export const CONVERSATION_FIXTURE_IDS={person,away,room,other,offer:'book.lotm.fixture_offer.agree',answer:'book.lotm.fixture_question.ask',privateKey:'fixture.received_offer',answerKey:'fixture.route'};
export const CONVERSATION_FIXTURE_ANSWER='The supply shed is beside the north gate.';
export function conversationKnowledgeFixture(){
 const people=[lead,person,away].map(id=>({id,indexId:id,name:id===lead?'Fixture lead':id===person?'Fixture neighbour':'Absent neighbour',tier:'principal',relations:[],knows:[],wants:[],...evidence}));
 const places=[room,other].map(id=>({id,indexId:id,name:id===room?'Fixture room':'Other fixture room',openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence}));
 const schedule=[person,away].map((actor,i)=>({id:`fixture.slot.${i}`,actor,place:i?other:room,day:1,until:1,from:0,to:1400,recurrence:'once',...evidence}));
 const beat={id:'fixture.beat',scene:'fixture.scene',actor:lead,place:room,dayIndex:1,until:1,needs:{fact:'fixture.unmet',value:true},effects:[],...evidence};
 return {schema:'lotm-cast/1',people,places,references:[],remoteWhereabouts:[],placeAliases:[],clockClaims:[],beats:[beat],anchors:[],schedule,
  host:{profile:{id:'lotm.early_tingen.canon_beside@1',key:'beside',blurb:'Synthetic fixture'},situation:{label:'Synthetic conversation fixture'}},
  bindings:{days:[{scene:'fixture.scene',day:1,from:0,to:1400}],schedule,beats:[beat]},
  leadLife:{actorId:lead,profile:{id:'book.lead.be@1',key:'be',label:'Fixture life',beyonderTrack:false,cash:5,home:null,start:room,blurb:'Begin the synthetic conversation fixture.'},knownPlaces:[room,other],history:[],
   relations:[{person,kind:'neighbour',date:'before start',locator:evidence.locator},{person:away,kind:'neighbour',date:'before start',locator:evidence.locator}],intentions:[],untakenChoices:[]},
  topicTalks:{talks:[
   {id:'book.lotm.fixture_offer',personId:person,topicId:'fixture.help',label:'Offer help',description:'Offer to help and pay for a route sketch.',minutes:2,choices:[
    {id:'agree',label:'Offer help and pay one penny',report:'You offered help and paid for a route sketch.',costs:[{type:'resource',actor:'player',key:'money',native:true,amount:-1}],effects:[know(person,'fixture.received_offer','Fixture recipient code: cobalt-seven.')]},
    {id:'refuse',label:'Decline politely',report:'You declined politely.',effects:[]}]},
   {id:'book.lotm.fixture_question',personId:person,topicId:'fixture.route',label:'Ask for the route',description:'Ask for the promised route sketch.',minutes:1,
    requires:{fact:'target.knowledge.fixture.received_offer.seen',op:'eq',value:true},choices:[
     {id:'ask',label:'Ask for the route sketch',report:CONVERSATION_FIXTURE_ANSWER,effects:[know('player','fixture.route',CONVERSATION_FIXTURE_ANSWER)]}]},
   {id:'book.lotm.fixture_absent',personId:away,topicId:'fixture.away',label:'Ask the absent neighbour',description:'Try speaking with the other neighbour.',minutes:1,choices:[{id:'ask',label:'Ask the other neighbour',report:'You spoke.',effects:[]}]}
  ]}};
}
