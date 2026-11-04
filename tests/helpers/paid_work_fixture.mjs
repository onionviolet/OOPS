// Original QA situations, not canonical episodes or additions to personal saves.
import {conversationKnowledgeFixture} from './conversation_knowledge_fixture.mjs';
const eq=(fact,value=true)=>({fact,op:'eq',value});
const resource=(key,amount)=>({type:'resource',actor:'player',key,amount});
export function paidWorkFixture(world){
 const hp=world==='hp',prefix=hp?'book.hp.lead.fixture_paid':'book.lotm.fixture_paid';
 const pack=hp?{schema:'hp-cast/1',locations:[],people:[],lockedOptions:{}}:conversationKnowledgeFixture();
 const place=hp?'book.hp.lead.cupboard':pack.leadLife.profile.start;
 const ids={prefix,read:prefix+'.read',work:prefix+'.work',use:prefix+'.use',method:prefix+'.method',prepared:prefix+'.prepared',used:prefix+'.used',support:prefix+'.tool_ready',supplies:prefix+'.supplies',samples:prefix+'.samples',deliveries:prefix+'.deliveries'};
 const base=(id,knowledgeKey,label,report,more={})=>({id,knowledgeKey,place,operation:'use',minutes:1,label,description:label+'. This is an original preparation fixture.',report,effects:[],...more});
 pack.householdActs={acts:[
  base(ids.read,ids.method,'Copy the preparation instructions','You copied the instructions and collected eight supply portions. No sample is made.',{effects:[resource(ids.supplies,8),{type:'fact',scope:'actor',actor:'player',key:ids.support,value:true}]}),
  base(ids.work,ids.prepared,'Prepare one sample','One prepared sample is ready for use.',{minutes:5,cancellation:'forfeit',costLabel:'2 supply portions',requires:{all:[eq('knowledge.'+ids.method+'.seen'),eq('actor.'+ids.support)]},costs:[resource(ids.supplies,-2)],effects:[resource(ids.samples,1)]}),
  base(ids.use,ids.used,'Use the prepared sample','You used the actual sample to finish the preparation task.',{costLabel:'1 prepared sample',costs:[resource(ids.samples,-1)],effects:[resource(ids.deliveries,1)]})
 ],sequence:{id:prefix+'.sequence',title:'Paid preparation fixture',stages:[{commandId:ids.read,label:'Copy the instructions'},{commandId:ids.work,label:'Prepare the sample'},{commandId:ids.use,label:'Use the actual sample'}],conclusion:'The prepared sample has a useful receiving task.'}};
 if(!hp)delete pack.topicTalks;
 return {pack,ids};
}
