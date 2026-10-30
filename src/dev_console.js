// Development console (moved from main.js, 2026-10-22, AR9 structural: body unchanged). Enabled by
// config.enable_dev_mode. main.js injects the game objects it reads, so this module imports nothing
// from main.js or its cyclic neighbours (Combat included); live bindings come in as getters.
/**
 * development console, can be enabled in config.js
 * exposes a bunch of useful functions to browser console
 *
 *     add_active_effect("Coffee", 1800)
 *     give({items: [{item: "Iron sword", quality: 120}], money: 50000}) //can use any valid reward argument
 *     goto("Slums")
 *     set_speed(100)
 */
export function enableDevConsole({effect_templates, item_templates, locations, skills, quests, dialogues, global_flags, character, Combat,
    translate, add_active_effect, process_rewards, add_money_to_character, add_xp_to_character, add_xp_to_skill,
    unlock_location, change_location, set_game_speed, currentLocation, activeEffects, setCombat, fastForward, eventMinutes}) {
    const list = (registry) => Object.keys(registry).sort();

    const real_add_active_effect = add_active_effect;

    const helpers = {
        //duration is in in-game minutes, like every duration in content
        add_active_effect: (effect_key, duration = 600) => {
            if(!effect_templates[effect_key]) {
                console.error(`No such effect as "${effect_key}". Try list_effects().`);
                return;
            }
            real_add_active_effect(effect_key, duration);
            return `${effect_key} for ${duration} minutes`;
        },

        give: (rewards) => {
            process_rewards({rewards, source_type: "dev console", source_name: "dev console"});
            return Object.keys(rewards);
        },

        /*
            adds all buff-type effects at once, selecting strongest possible effect for mutually exclusive ones,
            and skipping the rest;
            returns applied and skipped effects
        */
        add_best_effects: (duration = 1800) => {
            if(typeof duration !== "number" || !(duration > 0)) {
                console.error(`Duration has to be a positive number of in-game minutes, got "${duration}".`);
                return;
            }

            const buffs = Object.keys(effect_templates).filter(key => effect_templates[key].tags?.buff);
            const applied = [];
            const skipped = [];
            buffs.sort().forEach(key => {
                real_add_active_effect(key, duration);
                (activeEffects()[key] ? applied : skipped).push(key);
            });

            return skipped.length
                ? {applied, held_back_by_a_stronger_effect: skipped}
                : applied;
        },
        add_money: (amount) => { add_money_to_character(amount, 'debug console'); return character.money; },
        add_xp: (amount) => { add_xp_to_character(amount); return character.xp.current_level; },
        add_skill_xp: (skill, amount) => {
            if(!skills[skill]) {
                console.error(`No such skill as "${skill}". Try list_skills().`);
                return;
            }
            add_xp_to_skill({skill: skills[skill], xp_to_add: amount});
            return skills[skill].current_level;
        },

        //goes to specified location, unlocks it if needed
        go_to: (location_name) => {
            if(!locations[location_name]) {
                console.error(`No such location as "${location_name}". Try list_locations().`);
                return;
            }
            unlock_location({location: locations[location_name], skip_message: true});
            change_location({location_id: location_name});
            return location_name;
        },

        set_flag: (flag, value = true) => {
            if(!(flag in global_flags)) {
                console.error(`No such flag as "${flag}". Known: ${list(global_flags).join(", ")}`);
                return;
            }
            global_flags[flag] = value;
            return `${flag} = ${value}`;
        },

        simulate_combat: ({use_hero, fighter_locations}) => {
            if(currentLocation().tags.combat_zone) {
                change_location({location_id: currentLocation().parent_location.id});
                console.warn('Cannot simulate while another fight is happening - retreated from ongoing combat');
            }

            for(let i = 0; i < fighter_locations.length; i++) {
                if(!locations[fighter_locations[i]]) {
                    console.error('No such location as '+location[fighter_locations[i]]);
                    return;
                }
            }

            let attackers;
            let defenders;

            if(use_hero) {
                attackers = [character];
                defenders = locations[fighter_locations[0]].get_next_enemies();
            } else {
                attackers = locations[fighter_locations[0]].get_next_enemies();
                defenders = locations[fighter_locations[1]].get_next_enemies();
            }

            let combat_window = document.getElementById("combat_window");
            if(!combat_window) {
                combat_window = document.createElement("div");
                combat_window.id = "combat_window";

                const attacker_box = document.createElement("div");
                attacker_box.id = "attacker_box";
                const defender_box = document.createElement("div");
                defender_box.id = "defender_box";

                const exit_button = document.createElement("div");
                exit_button.id = "combat_window_exit";
                exit_button.innerText = translate("ui exit");

                exit_button.addEventListener("click", () => {
                    change_location({location_id: currentLocation().id});
                    combat_window.remove();
                });

                combat_window.append(attacker_box, defender_box, exit_button);
            }

            document.body.append(combat_window);
            
            const combat = new Combat({
                attackers,
                defenders,
                attackers_ui_slot: combat_window.querySelector("#attacker_box"),
                defenders_ui_slot: combat_window.querySelector("#defender_box"),
                is_special_combat: true,
            });
            setCombat(combat);
            combat.start();
        },

        list_effects: () => list(effect_templates),
        list_items: () => list(item_templates),
        list_locations: () => list(locations),
        list_skills: () => list(skills),
        list_quests: () => list(quests),
        list_dialogues: () => list(dialogues),
        list_flags: () => list(global_flags),

        set_speed: (multiplier) => set_game_speed(multiplier),

        // Skips run the engine's own sliced fast-forward (same result as stepping tick by tick), not a faster clock.
        skip_days: (days = 1) => skipMinutes(Math.round(days * 1440)),
        skip_minutes: (minutes) => skipMinutes(Math.round(minutes)),
        skip_to_event: () => {
            const minutes = eventMinutes();
            if(minutes == null) { console.warn('Nothing is scheduled; use skip_days().'); return null; }
            return skipMinutes(minutes);
        },
    };

    function skipMinutes(minutes) {
        if(!fastForward || !(minutes > 0)) { console.error('Give a positive amount to skip.'); return; }
        return fastForward(minutes).then(r => { console.log(`Skipped ${minutes} minutes in ${r.wallMs} ms (${r.slices} slices).`); return r; });
    }

    Object.keys(helpers).forEach(name => { window[name] = helpers[name]; });

    buildSkipPanel();
    console.log("Dev console is active. Available functions:\n");
    console.log(Object.keys(helpers).join("(),\n") + "()");
}

// Small panel for the time skips; exists only in dev mode (this module runs only then), collapsed by default.
function buildSkipPanel() {
    if(typeof document === "undefined" || document.getElementById("dev_time_panel")) return;
    const panel = document.createElement("details");
    panel.id = "dev_time_panel";
    panel.innerHTML = '<summary>Dev time</summary><div class="dev_time_buttons">' +
        [["skip_days(1)", "+1 day"], ["skip_days(7)", "+7 days"], ["skip_to_event()", "To next event"]]
            .map(([call, label]) => `<button type="button" data-dev-skip="${call}">${label}</button>`).join("") + '<span class="dev_time_status" role="status"></span></div>';
    panel.addEventListener("click", event => {
        const call = event.target.closest?.("[data-dev-skip]")?.dataset.devSkip;
        if(!call) return;
        const status = panel.querySelector(".dev_time_status");
        status.textContent = "Skipping...";
        Promise.resolve(window[call.split("(")[0]](...JSON.parse("[" + call.slice(call.indexOf("(") + 1, -1) + "]")))
            .then(r => { status.textContent = r ? `${r.wallMs} ms` : "Nothing scheduled"; }, e => { status.textContent = e.message; });
    });
    document.body.append(panel);
}
