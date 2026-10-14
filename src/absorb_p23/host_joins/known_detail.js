import {validateDropObservations} from '../known_detail/observations.js';
import {validateDisplayPreferences} from '../../display_settings.js';
// Optional associations are tied to a settled native kill ordinal. Loading
// legacy history alone cannot manufacture any observed creature/item link.
export function validateKnownDetailEnvelope(save){
    if(Object.hasOwn(save,'display_preferences'))validateDisplayPreferences(save.display_preferences);
    if(Object.hasOwn(save,'p23_drop_observations')){
        const observations=validateDropObservations(save.p23_drop_observations);
        for(const [id,row] of Object.entries(observations.creatures))
            if(row.lastKillOrdinal>(save.enemy_killcount?.[id]||0))throw Error('Drop observation exceeds the native kill count.');
    }
}
