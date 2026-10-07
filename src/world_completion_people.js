import {REMAINDER_HOME_IDS as H} from './audit_remainder_home_content.js';
import {ARTIFACT_WORKSHOP_IDS as A} from './artifact_workshop_content.js';
import {SOCIETY_IDS as S} from './feature_expansion_society.js';
// Stable identities with received introductions. No live whereabouts, purse,
// body, private knowledge, controller work or renderer rewards are exposed.
export function worldCompletionPeopleView(state){
    const known=state.simulation?.knowledge?.player||{},rows=[];
    const add=(id,name,introductions,prefixes,location)=>{
        if(!introductions.some(k=>known[k]))return;
        const records=Object.entries(known).filter(([key,r])=>prefixes.some(p=>key.startsWith(p))&&typeof r.value==='string');
        rows.push({id,name,location,details:records.map(([,r])=>r.value),memories:records.map(([id,r])=>({id,at:r.at,text:r.value}))});
    };
    add(H.eda,'Eda, sluice fitter',['feature_objects.opening','remainder_home.terms'],
        ['feature_objects.','remainder_home.terms','remainder_home.lesson','world.completion.learning.terms','world.completion.learning.lesson'], 'Last met: Village fitting bench');
    add(A.maker,'Vela, Village instrument maker',['artifact_collection.offer','world.completion.lens.terms'],
        ['artifact_collection.','world.completion.lens.'],'Known from your instrument meeting and received work accounts');
    add(H.resident,'Neri, resident kit binder',['remainder_home.resident_terms'],
        ['remainder_home.resident_','remainder_home.invitation','remainder_home.collected','lore.work.account','lore.work.inspection_result','world.completion.learning.sponsor','world.completion.learning.account','world.completion.learning.collected'],
        'Known from your home meeting and received work accounts');
    add(S.household,'Hessa, household steward',['feature_society.meeting'],['feature_society.meeting','feature_society.terms','feature_society.revisit'],'Last met: Village household');
    add(S.craftsperson,'Orr, household craftsperson',['feature_society.meeting'],
        ['feature_society.meeting','feature_society.ordinary','remainder_livelihood.shift','lore.work.orr','lore.warning.relay'], 'Known from your household meeting and received work accounts');
    add(S.apprentice,'Vale, household apprentice',['feature_society.meeting'],
        ['feature_society.meeting','feature_society.lesson','feature_society.shelf','feature_society.handoff','remainder_livelihood.allocation'], 'Known from your household meeting and received learning accounts');
    return rows;
}
