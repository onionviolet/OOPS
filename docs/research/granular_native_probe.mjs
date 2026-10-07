// Read-only research probe, not a browser/integration test or a proposed fix.
// Run from the checkout: node docs/research/granular_native_probe.mjs
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {Game_Time, is_night} from '../../src/game_time.js';
import {ActiveEffect} from '../../src/active_effects.js';

const main = readFileSync(new URL('../../src/main.js', import.meta.url), 'utf8');
const extract = (name, nextName) => {
    const start = main.indexOf(`function ${name}(`);
    const end = main.indexOf(`\nfunction ${nextName}(`, start);
    if(start < 0 || end < 0) throw new Error(`Missing source boundary: ${name}`);
    return main.slice(start, end);
};
const noop = () => {};
const records = [];
const record = (id, expected, observed, limit) => records.push({id, expected, observed, limit});

const calendar = new Game_Time({year:999, month:4, day:30, hour:0, minute:0, day_count:30});
calendar.goUp(30 * 24 * 60);
record('calendar-bulk-boundary', {month:5, day:30}, {month:calendar.month, day:calendar.day},
    'Actual Game_Time import; does not establish every calendar or weather path.');
const midnight = new Game_Time({year:999, month:12, day:30, hour:23, minute:0, day_count:360});
record('forecast-year-wrap', 'Spring', midnight.getSeason(1), 'Actual getSeason(1) import.');
const dusk = new Game_Time({year:999, month:4, day:1, hour:20, minute:30, day_count:1});
record('night-definition', {night:is_night(dusk), label:'Night'},
    {night:is_night(dusk), label:dusk.getTimeOfDaySimple()}, 'Different native time-of-day consumers; no chosen replacement boundary.');

const work = vm.createContext({current_game_time: {hour:12, minute:0, getSeason:()=>'Summer'}});
vm.runInContext(extract('can_work','enough_time_for_earnings'), work);
const overnight = {infinite:false, availability_time:{start:20, end:4}, availability_seasons:['Summer']};
const hours = [2,12,22];
const results = hours.map(hour => {work.current_game_time.hour = hour; return {hour, allowed:work.can_work(overnight)};});
record('overnight-work', [true,false,true], results, 'Synthetic overnight activity; native content prevalence not asserted.');

const durationProbe = debuffFirst => {
    const debuff = {duration:100, tags:{debuff:true}}, buff = {duration:100, tags:{buff:true}};
    const active_effects = debuffFirst ? {debuff,buff} : {buff,debuff};
    const ctx = vm.createContext({active_effects, is_sleeping:true, config:{time_speedup_when_sleeping:6},
        character:{addActiveEffectBonus:noop, updateStatsAndDisplay:noop}});
    vm.runInContext(extract('update_effect_durations','update'), ctx);
    ctx.update_effect_durations({time_in_minutes:1});
    return {debuff:debuff.duration, buff:buff.duration};
};
record('sleep-expiry-order', 'Identical durations independent of insertion order',
    {debuffFirst:durationProbe(true), buffFirst:durationProbe(false)}, 'Actual function body with inert display/stat stubs.');

const effectProbe = (active_effects, effect_templates) => {
    const ctx = vm.createContext({active_effects, effect_templates, ActiveEffect, skill_consumable_tags:{},
        update_displayed_effects:noop, character:{addActiveEffectBonus:noop, updateStatsAndDisplay:noop}});
    vm.runInContext(extract('add_active_effect','add_xp_to_activity_skills'), ctx);
    return ctx;
};
const effect = {name:'sample', effects:{stats:{}}, tags:{buff:true}, group_tags:{}};
const repeated = effectProbe({sample:new ActiveEffect({...effect,duration:100})}, {sample:effect});
const changed = repeated.add_active_effect('sample',30,true);
record('shorter-effect-refresh', 'No silent shortening paired with a false changed result',
    {changed, remaining:repeated.active_effects.sample.duration},
    'Actual refresh body; use_item uses this return value to decide consumption.');
const weaker = {name:'weaker',effects:{stats:{}},group_tags:{a:1}}, stronger = {name:'stronger',effects:{stats:{}},group_tags:{b:2}};
const multi = effectProbe({weaker:new ActiveEffect({...weaker,duration:100}), stronger:new ActiveEffect({...stronger,duration:100})},
    {weaker,stronger,incoming:{name:'incoming',effects:{stats:{}},group_tags:{a:2,b:1}}});
multi.add_active_effect('incoming',30,true);
record('multi-group-rejected-effect', ['weaker','stronger'], Object.keys(multi.active_effects),
    'Synthetic multi-group content; future authoring hazard, not a claim of a current player encounter.');

const deltas = [];
const timer = vm.createContext({is_sleeping:false, config:{time_speedup_when_sleeping:6},
    current_game_time:{hour:8,goUp:n=>deltas.push(n)}, is_night:()=>false,
    advanceExpeditions:noop, update_displayed_time:noop});
vm.runInContext(extract('update_timer','progress_time'),timer);
timer.update_timer(0);
record('zero-time-jump', [0], deltas, 'Actual update_timer body; progress_time passes default zero to it.');

let removed = 0, granted = 0;
const skill = {skill_id:'Alchemy', getTotalXPToNextLvl:()=>100, getTotalXP:()=>0, getXPToNextLvl:()=>100};
const recipe = {isUnlocked:()=>false, materials:[{count:5}], recipe_skill:'Alchemy', scale_results:false,
    get_availability:()=>({available_ammount:1, materials:[{items:[{count:5,item:{inventory_key:'leaf'}}]}]}),
    get_success_chance:()=>1, getResult:()=>({result_id:'powder',count:1})};
const craft = vm.createContext({current_location:{crafting:{tiers:{alchemy:1}}},
    recipes:{alchemy:{items:{locked:recipe}}}, document:{querySelector:()=>({})}, skills:{Alchemy:skill},
    config:{crafting_skill_xp_gains_cap:1}, game_stats:{total_crafting_attempts:0,total_crafting_successes:0},
    character:{getSkillXPGain:()=>1,removeFromInventory:items=>removed+=items[0].item_count,
        addToInventory:items=>granted+=items[0].count},
    item_templates:{powder:{getInventoryKey:()=> 'powder',getName:()=> 'powder',tags:{}}},
    get_recipe_xp_value:()=>1, add_xp_to_skill:()=>false, log_message:noop,
    update_item_recipe_visibility:noop, update_item_recipe_tooltips:noop});
vm.runInContext(extract('use_recipe','add_to_content_stack'),craft);
craft.use_recipe({parentNode:{dataset:{recipe_id:'locked'},parentNode:{dataset:{crafting_category:'alchemy',crafting_subcategory:'items'}}}},1);
record('locked-recipe-command', {removed:0,granted:0}, {removed,granted},
    'Actual use_recipe body with synthetic recipe/DOM/skill bindings; proves absent command gate, not ordinary UI reachability.');

console.log(JSON.stringify({kind:'research-probe',sourceSha256:createHash('sha256').update(main).digest('hex'),records},null,2));
