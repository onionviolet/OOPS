import {item_templates, OtherItem} from "../items.js";

// Original provisional supplies, registered through the existing item model.
for(const [id, description, value] of [
    // The Village trader's starting margin is four. Base values 2/4 produce
    // opening shop prices 8/16, matching the journal's preparation service.
    ["Prepared survey kit", "Anchors and cord for one crossing survey. Spent when you commit the kit route in the Field journal.", 2],
    ["Survey rope", "A lightweight reusable line for the Village crossing. Carry it to open the slower anchor route in the Field journal; the heavier Coil of rope has separate uses.", 4],
]) {
    if(item_templates[id]) throw new Error(`Duplicate expedition item ${id}.`);
    item_templates[id] = new OtherItem({id, name: id, description, value, tags: {expedition: true}});
}
