// Generate only disposable native holdings and method unlocks. No personal save.
import fs from 'node:fs';
import {loadNative, STANCE_LOCATION_STUBS} from '../../../../../tests/helpers/native_loader.mjs';
const native = await loadNative('export {recipes} from "./src/crafting_recipes.js"; export {item_templates} from "./src/items.js";', {stubs:STANCE_LOCATION_STUBS});
const seed = JSON.parse(fs.readFileSync('tests/fixtures/perf/mid.json', 'utf8'));
delete seed.availabilities.recipe.undefined;
seed.global_flags.is_crafting_unlocked = true;
for(const pages of Object.values(native.recipes)) for(const [subcategory, rows] of Object.entries(pages)) {
 if(subcategory==='items') for(const id of Object.keys(rows)) seed.availabilities.recipe[id]=1;
}
seed.inventories.person.main_character = {};
seed.item_log = {};
const parts=Object.values(native.item_templates).filter(item=>item.component_type).slice(0,18).map(item=>item.id);
for(const id of [...parts,'Cheap leather pants','Stale bread','Oneberry','Golmoon leaf','Animal fat','Rat meat chunks','Rat tail','Piece of willow wood','Iron ingot','Iron ore','Charcoal','Rough wood log','Wool']) {
 const item=native.item_templates[id];if(!item)continue;
 seed.inventories.person.main_character[item.getInventoryKey()]={count:30};
 seed.item_log[item.id]={id:item.id,number:30,quality_highest:item.quality||0,quality_lowest:item.quality||0};
}
fs.writeFileSync('/tmp/crafting-layers-seed.json', JSON.stringify(seed));
console.log('Fixture generated: native catalogue stock and learned item recipes; not natural progression.');
