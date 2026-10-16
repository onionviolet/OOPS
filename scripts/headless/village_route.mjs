// One scripted village route, run identically by the headless runner and by
// Chrome (scripts/headless/browser_parity.mjs). Every action is a user click on
// the same selector; game time passes only through the dev stepper.
//   talk to the elder -> save -> generated progression (craftsman and market
//   reachable, five ore) -> craftsman teaches crafting and gives tools ->
//   equip the axe -> an hour of woodcutting -> buy coal -> smelt an ingot -> save
// The Village patrol job is avoided: two dev-stepped hours of it throw in
// update_gathering_tooltip, in Chrome as well (reported, not fixed here).
import {boot} from './runner.mjs';

export const SEED = 20261014;
export const WALL_START = Date.UTC(2026, 0, 1, 12);
const ORE = JSON.stringify({id:'Low quality iron ore'});

/** Generated story access and materials, like village_browser.cjs's progressed fixture. */
export function progress(save) {
    const out = structuredClone(save);
    out.availabilities.dialogue.oldCraftsman = 1;
    out.availabilities.trader.villageTrader = 1;
    out.inventories.person.main_character[ORE] = {count:5};
    return out;
}

export const ROUTE = [
    {op:'click', sel:'.choice_dialogue'},
    {op:'click', sel:'[data-dialogue="villageElder"]'},
    {op:'click', sel:'[data-textline="hello"]'},
    {op:'click', sel:'[data-textline="where am i"]'},
    {op:'click', sel:'.end_dialogue_button'},
    {op:'step', minutes:15},
    {op:'save', name:'talked'},
    {op:'load', from:'talked', patch:'progress'},
    {op:'click', sel:'.choice_dialogue'},
    {op:'click', sel:'[data-dialogue="oldCraftsman"]'},
    {op:'click', sel:'[data-textline="hello"]'},
    {op:'click', sel:'[data-textline="learn"]'},
    {op:'click', sel:'.end_dialogue_button'},
    {op:'click', sel:`[data-character_item='${JSON.stringify({id:'Old axe', quality:100})}'] .equip_item_button`},
    {op:'click', sel:'.choice_gather'},
    {op:'click', sel:'[data-activity="woodcutting"]'},
    {op:'step', minutes:60},
    {op:'click', sel:'#action_end_div'},
    {op:'save', name:'worked'},
    {op:'click', sel:'.choice_trade'},
    {op:'click', sel:'[data-trader="villageTrader"]'},
    {op:'click', sel:`[data-trader_item='${JSON.stringify({id:'Coal'})}']`},
    {op:'click', sel:'#accept_trade_button'},
    {op:'click', sel:'#exit_trade_button'},
    {op:'save', name:'bought'},
    {op:'click', sel:'.choice_craft'},
    {op:'click', sel:'#crafting_mainpage_buttons [data-crafting_category="smelting"]'},
    {op:'click', sel:'[data-crafting_category="smelting"] [data-recipe_id="Low quality iron ingot"] .recipe_item_name'},
    {op:'click', sel:'#crafting_detail [data-craft-commit]'},
    {op:'click', sel:'#exit_crafting_button'},
    {op:'step', minutes:30},
    {op:'save', name:'final'},
];
export const PATCHES = {progress};

/** Run the route headlessly; returns the named saves (parsed) and timing. */
export async function runHeadless({seed = SEED, wallStart = WALL_START, trace} = {}) {
    const saves = {}, t0 = performance.now();
    const game = await boot(null, {seed, wallStart, heroName:null});
    try {for(const step of ROUTE) {
        trace?.(step);
        if(step.op === 'click') await game.click(step.sel);
        else if(step.op === 'step') await game.step(step.minutes);
        else if(step.op === 'save') saves[step.name] = await game.save();
        else if(step.op === 'load') {game.storage.clear(); await game.load(PATCHES[step.patch](saves[step.from]));}
    }} finally {game.close();}
    if(game.errors.length) throw new Error('Page errors:\n' + game.errors.join('\n'));
    return {saves, game, ms:performance.now() - t0};
}
