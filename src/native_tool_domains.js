import {favourite_items} from './runtime_state.js';
import './material_lineage_domain.js';
import {configureFields} from './field_layer_domain.js';
import {domainRegistry} from './domain_registry.js';
import {configureGearWorkshop} from './gear_workshop_domain.js';
import {calendarMinutes} from './world_rhythm.js';
import {configureToolsDomain, refreshToolsPanel} from './tools_domain.js';
import {configureLamplight} from './lamplight_domain.js';
import {configureAgingContact} from './aging_contact_domain.js';
import {get_current_light_level, get_current_temperature_smoothed} from './weather.js';
import {current_game_time} from './game_time.js';
import {bindReadingLightReader} from './reveal_chain.js';
import {configureStoryInsight} from './story_insight_domain.js';
import {configurePledges} from './pledges_domain.js';

// Native composition for the two carried-tool owners. Neither domain configures
// the other. The independent lamp factory receives only its supported operations.
export function configureNativeToolDomains(operations) {
    configureStoryInsight(operations);
    configurePledges({...operations, clock: () => calendarMinutes(current_game_time)});
    configureToolsDomain({...operations, clock: () => calendarMinutes(current_game_time)});
    configureGearWorkshop({...operations, favorites: favourite_items, temperature: get_current_temperature_smoothed, clock: () => calendarMinutes(current_game_time)});
    configureAgingContact({root: operations.root, actor: operations.actor, world: operations.world, location: operations.location, persist: operations.persist, logMessage: operations.logMessage});
    configureFields({...operations, root: operations.root, lampShining: () => domainRegistry.project('lamplight')?.shining === true});
    const {actor, count, itemOwners, assertSpend, removeItem, persist, writable,
        location, refresh, logMessage, locationRevealed, revealLocation} = operations;
    configureLamplight({actor, count, itemOwners, assertSpend, removeItem, persist,
        writable, location, refresh, logMessage, locationRevealed, revealLocation,
        refreshPanel: refreshToolsPanel,
        ambientLight: get_current_light_level,
        clockPosition: () => [current_game_time.year, current_game_time.month, current_game_time.day, current_game_time.hour, current_game_time.minute].join(':'),
        bindLightSource: reader => actor().bindNativeLightSource(reader),
        bindReadingLightReader,
    });
}
