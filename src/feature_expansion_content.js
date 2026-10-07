import {auditRemainderDefinitions as remainderDefinitions,auditRemainderSources} from './audit_remainder_content.js';
import {auditRemainderDefinitions} from './audit_remainder_state.js';
import {featureObjectDefinitions,featureObjectSources} from './feature_expansion_objects.js';
import {featurePowerDefinitions} from './feature_expansion_powers.js';
import {featureBattleDefinitions} from './feature_expansion_battle.js';
import {societyDefinitions,societySources} from './feature_expansion_society.js';
import {tidemarkDefinitions} from './feature_expansion_destination.js';
import {referenceGameplayDefinitions,referenceGameplaySources} from './reference_gameplay_content.js';
import {nethackFieldcraftDefinitions} from './nethack_fieldcraft_content.js';
import {auditedFixtureDefinitions} from './audited_workshop_fixture.js';
import {auditedLessonDefinitions} from './audited_workshop_lesson.js';
import {ARTIFACT_WORKSHOP_IDS,artifactWorkshopDefinitions} from './artifact_workshop_content.js';
import {causalStoryDefinitions,causalStorySources} from './causal_story_content.js';

// The released apparatus family keeps its exact physical recipes and frozen
// payloads. Only new entry receives this wave's actual deliberate consent gate.
const artifactEnrollment={fact:'auditRemainder.enrolled',op:'eq',value:true,
    reason:'Open the optional local projects before meeting the instrument maker.'};
const artifactDefinitions={...artifactWorkshopDefinitions,commands:artifactWorkshopDefinitions.commands.map(d=>
    d.id===ARTIFACT_WORKSHOP_IDS.open?{...d,requires:{all:[artifactEnrollment,d.requires]},
        visibleWhen:{all:[artifactEnrollment,d.visibleWhen]}}:d)};

const keys=['people','sites','conditions','powers','advancements','encounters','commands','controllers','events','transitions','origins','energies','pursuits','situations'];
const families=[auditRemainderDefinitions,remainderDefinitions,featureObjectDefinitions,featurePowerDefinitions,featureBattleDefinitions,societyDefinitions,tidemarkDefinitions,referenceGameplayDefinitions,nethackFieldcraftDefinitions,auditedFixtureDefinitions,auditedLessonDefinitions,artifactDefinitions,causalStoryDefinitions];
export const featureExpansionDefinitions=Object.fromEntries(keys.map(key=>[key,families.flatMap(d=>d[key]||[])]));
// Native Causal means remain in its explicit host activation. Registry reading
// only registers these sources and provision:false people, with no seed effects.
export const featureExpansionSources=[...auditRemainderSources,...featureObjectSources,...societySources,...referenceGameplaySources,...causalStorySources];
