// Original selected adaptations share the existing registry and publisher.
import {steamDFDefinitions} from './steam_df_content.js';
import {steamBOHDefinitions} from './steam_boh_content.js';
import {steamONIDefinitions} from './steam_oni_content.js';
import {steamLambDefinitions} from './steam_lamb_content.js';

export const STEAM_ABSORPTION_GROUPS = Object.freeze(['steam_df', 'steam_boh', 'steam_oni', 'steam_lamb']);
export const steamAbsorptionDefinitions = {};
for (const family of [steamDFDefinitions, steamBOHDefinitions, steamONIDefinitions, steamLambDefinitions]) {
    for (const [key, rows] of Object.entries(family)) {
        (steamAbsorptionDefinitions[key] ||= []).push(...rows);
    }
}
