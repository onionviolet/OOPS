import {SUPPLIER} from './home_household_content.js';
// Public identities for an original paid field-forms exercise at the manor.
export const COHORT_SCHEMA=6,COHORT_ID='cohort.field_forms',COHORT_ROOM='Arlmere family manor';
export const COHORT_MEMBERS=['home.manor.keeper','home.manor.cook','home.manor.steward','home.manor.tutor',SUPPLIER];
export const COHORT_COACHES=['cohort.ada','cohort.bren'];
export function nativeFighterOwnership(state,id){
 if(id==='player')return 'native:player';
 return JSON.stringify({body:state.simulation?.people[id]?.body,equipment:state.simulation?.equipment[id]||{},owned:state.simulation?.owners[id]||{},progress:state.simulation?.progression[id]||{},sources:state.actors[id]?.sources||{}});
}
export const cohortBodyBinding=p=>JSON.stringify([p?.body?.id??null,p?.body?.instanceId??null,p?.body?.form??'human']);
