import {REGION, LEGACIES, CULTIVATION_ITEMS, cultivationRates, trialRequirement,
    beginTrial, consumePreparation, breakthrough, rebirth} from "./cultivation.js";

export function mountCultivation(api) {
    const launch = document.createElement("button");
    launch.id = "cultivation_launcher";
    launch.textContent = "Cultivation · prototype";
    document.getElementById("bottom_panel_div").prepend(launch);
    const panel = document.createElement("dialog");
    panel.id = "cultivation_panel";
    panel.setAttribute("aria-labelledby", "cultivation_title");
    panel.innerHTML = `
        <header><div><small>ORIGINAL REGION · FIRST PLAYABLE SLICE</small><h1 id="cultivation_title">Jade Hollow</h1></div><button data-action="close" aria-label="Close cultivation">×</button></header>
        <p class="cultivation_intro">A body that can bear the pressure. A formation that can guide it.<br>Two ways to lay your first foundation.</p>
        <div class="cultivation_status"><strong id="cultivation_realm"></strong><span id="cultivation_location"></span></div>
        <div class="cultivation_meters">
            <label>Qi <strong id="cultivation_qi"></strong><progress id="cultivation_qi_bar" max="100"></progress></label>
            <label>Body conditioning <strong id="cultivation_body"></strong><progress id="cultivation_body_bar" max="100"></progress></label>
            <label>Preparation <strong id="cultivation_preparation"></strong><progress id="cultivation_preparation_bar" max="100"></progress></label>
        </div>
        <p id="cultivation_current"></p>
        <div class="cultivation_cards">
            <section><small>01 / FOUNDATION</small><h2>Train & gather</h2><p id="cultivation_rates"></p>
                <button data-action="enter">Travel to Jade Hollow</button>
                <button data-action="meditate">Circulate qi</button>
                <button data-action="condition">Condition body</button>
                <button data-action="gather">Harvest dewleaf</button>
                <button data-action="stop">Stop training / gathering</button>
            </section>
            <section><small>02 / PREPARATION</small><h2>The valley workshop</h2><p id="cultivation_inventory"></p>
                <button data-action="tea">Brew tea · 2 dewleaf</button>
                <button data-action="pellet">Refine pellet · 4 dewleaf</button>
                <button data-action="drink">Drink tea</button>
                <button data-action="consume">Use pellet</button>
                <p>Recipes use the existing crafting engine and award Cooking or Alchemy XP. Tea gives qi and preparation; pellets favor the formation route.</p>
            </section>
            <section><small>03 / TRIAL & BREAKTHROUGH</small><h2>Open the meridians</h2>
                <p>Each trial lasts 12 active ticks and spends 40 qi. Both require 60 qi to enter. Training pauses during trials.</p>
                <button data-action="martial">Endurance trial · 30 body</button><p id="cultivation_martial_req"></p>
                <button data-action="artisan">Formation trial · 30 preparation</button><p id="cultivation_artisan_req"></p>
                <button data-action="breakthrough">Breakthrough · seal + 60 qi</button>
                <p id="cultivation_trial"></p>
            </section>
        </div>
        <section class="cultivation_legacy"><div><small>OPTIONAL / ONE PRESTIGE LAYER</small><h2>Choose what the next life remembers</h2><p id="cultivation_legacy_status"></p></div>
            <label>Next legacy<select id="cultivation_legacy_choice"><option value="breath">Remembered breath: +25% meditation qi</option><option value="craft">Steady hands: +50% crafted preparation</option></select></label>
            <button data-action="review">Review rebirth</button>
        </section>
        <section id="cultivation_reset_review" hidden><h2>Rebirth consequences</h2><p id="cultivation_reset_detail"></p>
            <button data-action="confirm">Confirm rebirth with this legacy</button><button data-action="cancel">Keep this life</button></section>
        <p id="cultivation_message" role="status" aria-live="polite"></p>
        <footer>Prototype rules for review. Timed practice advances while the game runs; closing the browser pauses progress. Ordinary adventure, skills and equipment stay relevant.</footer>`;
    document.body.append(panel);
    let reviewedLegacy = null;
    launch.addEventListener("click", () => {if(!panel.open) panel.showModal(); render();});
    panel.addEventListener("close", () => {reviewedLegacy = null; render();});
    const text = (id, value) => {
        const node = panel.querySelector(`#cultivation_${id}`);
        if(node.textContent !== value) node.textContent = value;
    };
    const button = action => panel.querySelector(`[data-action="${action}"]`);
    const levels = () => api.levels();

    function render() {
        const s = api.state();
        const context = api.context();
        const inRegion = context.location === REGION;
        const rates = cultivationRates(s, levels());
        text("realm", s.realm ? "Meridians opened" : "Mortal foundation");
        text("location", `${context.location || "Village"} · Life ${s.rebirths + 1}`);
        for(const key of ["qi", "body", "preparation"]) {
            text(key, `${Math.floor(s[key])} / 100`);
            panel.querySelector(`#cultivation_${key}_bar`).value = s[key];
        }
        text("current", s.trial ? `Trial: ${s.trial.route} · ${s.trial.progress} / 12 ticks${inRegion ? "" : " · paused outside Jade Hollow"}` : `Current practice: ${context.activity || "resting"}`);
        text("rates", `Meditation: ${rates.qi.toFixed(1)} qi/tick. Weightlifting: ${rates.body.toFixed(1)} body/tick. Combat mastery also improves body training. Herbalism improves harvest speed and yield.`);
        text("inventory", `Carried: ${api.count("Dewleaf")} dewleaf · ${api.count("Dewleaf tea")} tea · ${api.count("Meridian pellet")} pellets.`);
        const skillLevels = levels();
        button("drink").textContent = `Drink tea · +${20 + Math.min(20, skillLevels.Cooking || 0)} qi, +${10 * rates.preparation} preparation`;
        button("consume").textContent = `Use pellet · +${(30 + Math.min(30, skillLevels.Alchemy || 0)) * rates.preparation} preparation`;
        button("gather").textContent = context.sickle ? "Harvest dewleaf" : s.loanClaimed ? "Harvest dewleaf · equip a sickle first" : "Borrow sickle and harvest";
        text("martial_req", trialRequirement(s, "martial") || "Ready. Endure pressure; gain Combat XP.");
        text("artisan_req", trialRequirement(s, "artisan") || "Ready. Spend 30 preparation; gain Alchemy XP.");
        text("trial", s.realm ? "Breakthrough earned +50 Meditation XP and +50 Weightlifting XP in the ordinary game. Qi and body training are now 50% faster." : s.seal ? "Trial seal earned. Meditate or drink tea to reach 60 qi." : "No trial seal yet. Either route can earn it.");
        text("legacy_status", `${s.legacy ? `Active: ${LEGACIES[s.legacy].description}` : "No legacy yet."} ${s.rebirths} rebirths. One active legacy; a new choice replaces the old one.`);
        text("message", s.message);
        button("enter").disabled = inRegion || !!s.trial;
        for(const action of ["meditate", "condition", "gather", "tea", "pellet", "drink", "consume"]) button(action).disabled = !inRegion || !!s.trial;
        button("gather").disabled ||= !context.sickle && s.loanClaimed;
        button("tea").disabled ||= api.count("Dewleaf") < 2;
        button("pellet").disabled ||= api.count("Dewleaf") < 4;
        button("drink").disabled ||= api.count("Dewleaf tea") < 1;
        button("consume").disabled ||= api.count("Meridian pellet") < 1;
        button("stop").disabled = !inRegion || !context.activity;
        for(const route of ["martial", "artisan"]) button(route).disabled = !inRegion || !!trialRequirement(s, route);
        button("breakthrough").disabled = !inRegion || !!s.realm || !s.seal || s.qi < 60 || !!s.trial;
        button("review").disabled = !s.realm || !inRegion;
        panel.querySelector("#cultivation_reset_review").hidden = !reviewedLegacy;
    }

    panel.addEventListener("click", event => {
        const action = event.target.closest("button[data-action]")?.dataset.action;
        if(!action || event.target.closest("button").disabled) return;
        const s = api.state();
        if(action === "close") panel.close();
        else if(action === "enter") api.enter();
        else if(["meditate", "condition", "gather"].includes(action)) {
            if(action === "gather" && !api.context().sickle && !s.loanClaimed) {api.loan(); s.loanClaimed = true;}
            api.practice({meditate: "meditating", condition: "weightlifting", gather: "herbalism"}[action]);
        } else if(action === "stop") api.stop();
        else if(action === "tea" || action === "pellet") api.craft(action === "tea" ? "Dewleaf tea" : "Meridian pellet");
        else if(action === "drink" || action === "consume") {
            const item = action === "drink" ? "Dewleaf tea" : "Meridian pellet";
            if(api.count(item) && api.take(item)) consumePreparation(s, item, levels());
        } else if(action === "martial" || action === "artisan") {
            const error = beginTrial(s, action);
            if(error) s.message = error;
            else api.stop();
        } else if(action === "breakthrough" && breakthrough(s)) {
            api.xp("Meditation", 50); api.xp("Weightlifting", 50);
        } else if(action === "review") {
            api.stop();
            reviewedLegacy = panel.querySelector("#cultivation_legacy_choice").value;
            text("reset_detail", `Lose: all qi, body conditioning, preparation, trial seal, opened meridians, and all carried or stored dewleaf, tea and pellets (${api.totalCultivationItems()} items). Keep: ordinary skill XP, character level, equipment, money, other inventory, quests, reputation, maps and recipe knowledge. Gain: ${LEGACIES[reviewedLegacy].name}, ${LEGACIES[reviewedLegacy].description} This replaces any current legacy. Return to Village; rebirth count increases by one.`);
        } else if(action === "cancel") reviewedLegacy = null;
        else if(action === "confirm" && reviewedLegacy) {
            const next = rebirth(s, reviewedLegacy);
            if(next) {api.stop(); api.clearCultivationItems(CULTIVATION_ITEMS); api.replace(next); api.returnToVillage();}
            reviewedLegacy = null;
        }
        api.save();
        render();
    });
    return {render};
}
