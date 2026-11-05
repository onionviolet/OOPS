// Synthetic calibration fixture. Real source/energy/condition/action owners;
// no novel text, earned-arrival claim, personal save or new campaign episode.
import {conversationKnowledgeFixture,CONVERSATION_FIXTURE_IDS} from './conversation_knowledge_fixture.mjs';
import {beSeerDrinkEffects,beSeerSteadyEffects,beSeerCogitateEffects,beSeerUse,beSpiritVisionOnEffects,beSpiritVisionOffEffects,beSpiritRestEffects,beSpiritVisionOnRequires,beSpiritVisionOffRequires} from '../../src/book_world_lotm_be_seer.js';
export const SEER_FIXTURE_PREFIX='book.lotm.fixture_exhaustion.';
export function seerExhaustionFixture(){
 const pack=conversationKnowledgeFixture(),place=CONVERSATION_FIXTURE_IDS.room;
 delete pack.topicTalks;
 const row=(id,label,description,effects,requires=null,operation='use',costLabel='no stock spent')=>({id:SEER_FIXTURE_PREFIX+id,place,minutes:1,operation,label,description,report:label+' completed in the synthetic calibration fixture.',knowledgeKey:'fixture.exhaustion.'+id,costLabel,publicReasons:true,...(requires?{requires}:{}),effects});
 pack.householdActs={acts:[
  row('entry','Prepare the fixture source','Synthetic entry grants and steadies the existing Seer source and its actual pool.',[...beSeerDrinkEffects(),...beSeerSteadyEffects()],{fact:'lotm.beSeer.supported',op:'eq',value:false}),
  row('on','Switch Spirit Vision on','Use the existing Seer source and spend one spirituality to see auras.',[beSeerUse(),...beSpiritVisionOnEffects()],{all:[beSpiritVisionOnRequires(),{fact:'lotm.beSeer.pool',op:'gte',value:1,reason:'Recover spirituality before using it.'}]},'use','1 spirituality; no stock spent'),
  row('off','Switch Spirit Vision off','End the vision and retain its actual accumulated exhaustion.',beSpiritVisionOffEffects(),beSpiritVisionOffRequires()),
  row('recover','Cogitate in the fixture','Recover the real pool without clearing the exhaustion condition.',beSeerCogitateEffects(),{fact:'lotm.beSeer.supported',op:'eq',value:true}),
  row('sleep','Sleep in the fixture','Synthetic one-minute sleep action exercises the existing rest effects; this duration is not a canon sleep prescription.',[...beSpiritRestEffects(),...beSeerCogitateEffects()],{fact:'lotm.beSeer.supported',op:'eq',value:true},'sleep')
 ]};
 return pack;
}
