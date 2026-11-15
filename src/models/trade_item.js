"use strict";

import AvailabilityComponent from "../components/availability_component.js";
import { availability_havers } from "../data/component_references.js";

class TradeItem {

    #availability;

    constructor(data)
    {
        this.item_name = data.item_name;
        this.chance = data.chance || 1; //chance for item to appear, 1 is 100%
        this.count = data.count || [1]; 
        //how many can appear, will randomly choose something between min and max if specificed, otherwise will go with specific ammount
        
        this.quality = data.quality; //min and max quality of item
        this.roll_affixes = data.roll_affixes ?? true; //authored stock may retain plain gear
        this.#availability = new AvailabilityComponent({...data, is_unlocked: true});
        //component not saved to availabilities, not meant to use unlock status for this class, just conditions
    }

    getAvailabilityComponent() {
        return this.#availability;
    }
}

class TradeItemGroup {
    #availability;

    constructor(data)
    {
        this.items = data.items;
        // PS161: an optional cause id names why this group is on the shelf (a cleared place, a finished quest), so the
        // keeper can say it; the condition itself stays in start_conditions, and a group without a cause says nothing.
        this.cause = data.cause ?? null;
        this.#availability = new AvailabilityComponent({...data, is_unlocked: true});
        //component not saved to availabilities, not meant to use unlock status for this class, just conditions
    }

    getAvailabilityComponent() {
        return this.#availability;
    }
}

availability_havers.push(TradeItem, TradeItemGroup);

export {TradeItem, TradeItemGroup};
