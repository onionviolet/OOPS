// Original optional proof content. No novel rule or protagonist entitlement.
export const CAUSAL_STORY_SCHEMA = 1;
export const CAUSAL_STORY_ENGINE_SCHEMA = 11;
export const CAUSAL_STORY_DEFINITION_REVISION = 1;
export const CAUSAL_STORY_NATIVE_DOMAIN = 'causal_story_native';
export const CAUSAL_STORY_PREFIX = 'causal.story';
export const CAUSAL_STORY_WORLD = 'base.frontier';
export const CAUSAL_STORY_LOCATION = 'Village';
export const CAUSAL_STORY_PEOPLE = Object.freeze({mortal:'causal.story.tarin',covenant:'causal.story.asha',anchor:'causal.story.orin',witness:'causal.story.roe',keeper:'causal.story.nell'});
export const CAUSAL_STORY_ITEMS = Object.freeze({kit:JSON.stringify({id:'Prepared survey kit'}),rope:JSON.stringify({id:'Survey rope'}),log:JSON.stringify({id:'Rough wood log'})});
export const CAUSAL_STORY_PROOFS = Object.freeze(['mortal','covenant','anchor']);
export const CAUSAL_STORY_SOURCES = Object.freeze({method:'causal.story.measured_release',covenant:'causal.story.survival_covenant',anchor:'causal.story.established_future',guard:'causal.story.courier_guard'});
export const CAUSAL_STORY_LIMITS = Object.freeze({receipts:192,perProof:64,reservedClosure:8,clockWindow:36,publicLog:100});
export const CAUSAL_STORY_PROFILES = Object.freeze({
 mortal:Object.freeze({id:'mortal',leadId:CAUSAL_STORY_PEOPLE.mortal,name:'Tarin',protection:'none',topology:'contingent_forward',identity:'causal.story.tarin.body',counter:null}),
 covenant:Object.freeze({id:'covenant',leadId:CAUSAL_STORY_PEOPLE.covenant,name:'Asha',protection:'covenant',topology:'contingent_forward',identity:'causal.story.asha.body',counter:CAUSAL_STORY_SOURCES.method}),
 anchor:Object.freeze({id:'anchor',leadId:CAUSAL_STORY_PEOPLE.anchor,name:'Orin',protection:'future_anchor',topology:'established_identity_local_anchor',identity:'causal.story.orin.identity',counter:CAUSAL_STORY_SOURCES.method})
});
export const causalStoryPersonIds = Object.freeze(Object.values(CAUSAL_STORY_PEOPLE));
export const causalStoryId = (proof, action) => `${CAUSAL_STORY_PREFIX}.${proof}.${action}`;
