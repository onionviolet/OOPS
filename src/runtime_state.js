// Native shared state. Single live bindings; main retains the existing mutation order.
export const global_flags = {
    is_gathering_unlocked: false,
    is_crafting_unlocked: false,
    is_strength_proved: false, //this role could be fulfilled by a quest, but it was originally added before that mechanic; besides, flags are cool and elegant
    is_mofu_mofu_enabled: true,
    is_guard_met: false,
    is_hero_created: false, //changed after going through hero creation panel
};

export const languages = {
    english: "english",
};

export let language = languages.english;

export function setLanguage(value) { language = value; }

export let current_location;

export function setCurrentLocation(value) { current_location = value; }

export let travel_times = {};

export function setTravelTimes(value) { travel_times = value; }

export let unlocked_beds = {};

export function setUnlockedBeds(value) { unlocked_beds = value; }

export let last_location_with_bed = null;

export function setLastLocationWithBed(value) { last_location_with_bed = value; }

export let last_combat_location = null;

export function setLastCombatLocation(value) { last_combat_location = value; }

export const active_effects = {};

export let selected_stance;

export function setSelectedStance(value) { selected_stance = value; }

export const faved_stances = {};

export const favourite_consumables = {};

export const favourite_items = {};

export const game_options = {
    elemental_affinities:false,
    uniform_text_size_in_action: false,
    auto_return_to_bed: true,
    remember_message_log_filters: false,
    remember_sorting_options: false, //not in use?
    combat_disable_autoswitch: false,

    do_dynamic_loot_message: false,

    auto_use_when_longest_runs_out: true, //can't actually be changed by a player; despite the name, it decides whether to first use longest-duration item or shortest-duration item
    use_uncivilised_temperature_scale: false, //true -> swap Celsius for Fahrenheit
    do_background_animations: false,
    change_background_color: false,
    skip_play_button: false, //not really skips, just automatically clicks it right after loading
    mofu_mofu_mode: true,
    do_enemy_onhit_animations: true,
    expo_threshold: 9,
    hide_max_level_skills: false,
    use_text_outlines_for_tooltips: true,
    use_text_outlines_for_bars: true,

    stop_crafting_on_material_change: true, //not changeable
};

// Route wear (G40): the path finder multiplies each leg by this factor. The economy-standing domain
// replaces it with a traffic-built factor; the default leaves every leg as authored.
export const pathWear = {factor: (from, to) => 1};
