import {remainderLivelihoodDefinitions, remainderLivelihoodItemSpecifications} from './audit_remainder_livelihood_content.js';
import {remainderHomeDefinitions, remainderHomeSources, remainderHomeItemSpecifications} from './audit_remainder_home_content.js';
import {remainderOffersDefinitions, remainderOffersItemSpecifications} from './audit_remainder_offers_content.js';
import {remainderConsequencesDefinitions, remainderConsequencesItemSpecifications} from './audit_remainder_consequences_content.js';
import {remainderCombatFitDefinitions, remainderCombatFitItemSpecifications} from './audit_remainder_combat_fit_content.js';
import {remainderCombatObjectivesDefinitions, remainderCombatObjectivesItemSpecifications} from './audit_remainder_combat_objectives_content.js';

const families = [remainderLivelihoodDefinitions, remainderHomeDefinitions, remainderOffersDefinitions,
    remainderConsequencesDefinitions, remainderCombatFitDefinitions, remainderCombatObjectivesDefinitions];
const keys = ['people', 'sites', 'conditions', 'powers', 'advancements', 'encounters', 'commands', 'controllers', 'events', 'transitions', 'origins', 'energies', 'pursuits', 'situations'];
export const auditRemainderDefinitions = Object.fromEntries(keys.map(key => [key, families.flatMap(f => f[key] || [])]));
export const auditRemainderSources = [...remainderHomeSources];
export const auditRemainderItemSpecifications = [...remainderLivelihoodItemSpecifications, ...remainderHomeItemSpecifications,
    ...remainderOffersItemSpecifications, ...remainderConsequencesItemSpecifications, ...remainderCombatFitItemSpecifications, ...remainderCombatObjectivesItemSpecifications];

export function registerAuditRemainderItems({itemTemplates, OtherItem}) {
    for(const specification of auditRemainderItemSpecifications) {
        if(itemTemplates[specification.id]) throw new Error(`Duplicate optional project item ${specification.id}.`);
        itemTemplates[specification.id] = new OtherItem({...specification, name: specification.name || specification.id, tags: {expedition: true, ...specification.tags}});
    }
}
