import {item_templates, OtherItem} from "../items.js";

// Original provisional supplies, registered through the existing item model.
for(const [id, description, value] of [
    ["Prepared survey kit", "Anchors and cord for one crossing survey. Spent when you commit the kit route in the Field journal.", 8],
    ["Survey rope", "A reusable climbing line. Carry it to open the slower rope route in the Field journal.", 16],
]) {
    if(item_templates[id]) throw new Error(`Duplicate expedition item ${id}.`);
    item_templates[id] = new OtherItem({id, name: id, description, value, tags: {expedition: true}});
}
