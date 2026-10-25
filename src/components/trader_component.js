import {retainShopStock} from '../shop_locks.js';
import {STREAMS,gameKeyedRandom} from "../seeded_streams.js";
import {accessoryTradeMargin} from '../absorb_c1/accessories.js';
"use strict";

import { character } from "../data/character.js";
import inventory_templates from "../data/inventory_templates.js";
import { current_game_time } from "../game_time.js";
import { getItem, item_templates } from "../items.js";
import InventoryComponent, { inventories } from "./inventory_component.js";
import AvailabilityComponent from "./availability_component.js";
import { availabilities, availability_havers } from "../data/component_references.js";
import {factorioRetortItemSpecifications} from '../factorio_retort_content.js';
import {proto23ItemSpecifications} from '../proto23_world_content.js';
import {affixedStockEntries} from '../gear_acquisition.js';
import {getItemFromKey} from '../items.js';

const conservedCampaignItems = [...factorioRetortItemSpecifications,...proto23ItemSpecifications];
const conservedCampaignKeys = new Set(conservedCampaignItems.map(spec => JSON.stringify({id:spec.id})));
const conservedCampaignIds = conservedCampaignItems.map(spec => spec.id);

inventories["trader"] = {};
availabilities["trader"] = {};

class TraderComponent {

    #inventory;
    #availability;

    constructor({
                name,
                trade_text,
                unlock_message = null,
                refresh_time = 4,
                refresh_shift = 0,
                inventory_template,
                profit_margin = 3,
                is_unlocked = false,
                played_minute_refresh = null,
            } = {})
    {
        
        if(played_minute_refresh !== null && typeof played_minute_refresh !== "function") throw new Error("Invalid native played-minute shop adapter.");
        this.played_minute_refresh = played_minute_refresh;
        this.name = name;
        this.trade_text = trade_text;
        this.last_refresh = -1;  
        //just the day_count from game_time at which trader was supposedly last refreshed

        this.refresh_time = refresh_time; 
        //7 would mean it's refreshed every 7 days (with shift at 0 it's every monday)
        this.refresh_shift = refresh_shift; 
        //shift refreshing days, e.g. time 7 + shift 2 would be every wednesday, shift 4 would push it to every friday
        //pretty much pointless if refresh time is not N*7
        
        this.inventory_template = inventory_template;
        //a template for the trader to use, so multiple traders can have same predefined item selection (but still separate and with certain randomness)

        this.profit_margin = profit_margin;
        //how much more expensive are the trader's items than their actual value, with default being 2 (so 2x more)
        //don't make it too low to prevent easy xp grinding for the haggling skill

        this.#availability = new AvailabilityComponent({is_unlocked, unlock_message});

        this.#inventory = new InventoryComponent();
    }

    getTradeText() {
        return this.trade_text || `Trade with ${this.name}`;
    }
    
    /**
     * refreshes trader inventory
     * @returns boolean informing if it was able to refresh
     */
    refresh(context) {
        // Optional owner callback stages the same private inventory through the
        // normal durable native transaction. Legacy shops retain day cadence.
        if(this.played_minute_refresh) return this.played_minute_refresh(context);
        if(this.can_refresh()) {
            //refresh inventory
            const previous={...this.#inventory.getItems()},retained = {};
            for(const [key, entry] of Object.entries(this.#inventory.getItems())) {
                if(conservedCampaignKeys.has(key)) {
                    if(!entry?.item || !Number.isSafeInteger(entry.count) || entry.count <= 0) throw new Error('Invalid conserved campaign merchant stock.');
                    retained[key] = entry;
                } else if(conservedCampaignIds.some(id => key.includes(id))) throw new Error('Malformed conserved campaign merchant key.');
            }
            this.emptyInventory();
            this.fillInventoryFromTemplate(context);
            for(const [key, entry] of Object.entries(retained)) {
                if(this.#inventory.getItems()[key]) throw new Error('Merchant templates cannot create conserved campaign stock.');
                this.#inventory.getItems()[key] = entry;
            }

            const locked=retainShopStock(this.stockOwnerId,previous,this.#inventory.getItems());for(const key of Object.keys(this.#inventory.getItems()))if(!Object.hasOwn(locked,key))delete this.#inventory.getItems()[key];Object.assign(this.#inventory.getItems(),locked);
            this.last_refresh = (current_game_time.day_count + 1 - current_game_time.day_count % this.refresh_time);
            return true;
        }
        //otherwise do nothing
        return false;
    }

    /**
     * checks if enough time passed since last refresh
     * @returns {Boolean}
     */
    can_refresh() {
        return (this.last_refresh < 0 || current_game_time.day_count - (this.last_refresh + this.refresh_shift) >= this.refresh_time);
    }

    getAvailabilityComponent() {
        return this.#availability;
    }

    /**
     * creates new choice of items for the trader, based on assigned inventory template
     * @returns {null}
     */
    fillInventoryFromTemplate(context) {
        const items = this.getInventoryComponent().getItems();
        const inventory_template = inventory_templates[this.inventory_template];
        const epoch = current_game_time.day_count + 1 - current_game_time.day_count % this.refresh_time;
        const random = (i,j,decision) => gameKeyedRandom(STREAMS.market, JSON.stringify([this.name,this.inventory_template,epoch,i,j,decision]));

        for (let i = 0; i < inventory_template.length; i++) {
            //inventory_template[i] is a TradeItemGroup = {start_conditions?, items}
            if(inventory_template[i].canBeStarted(context)) {
                for(let j = 0; j < inventory_template[i].items.length; j++){
                    if(inventory_template[i].items[j].canBeStarted(context)  && inventory_template[i].items[j].chance > random(i,j,"presence")) {
                        let item_count = inventory_template[i].items[j].count.length == 1 ?
                        inventory_template[i].items[j].count[0] : Math.round(random(i,j,"count") *
                            (inventory_template[i].items[j].count[1] - inventory_template[i].items[j].count[0]) + inventory_template[i].items[j].count[0]);
                        
                        const specification = inventory_template[i].items[j];
                        let item;
                        if(specification.quality) {
                            let quality = Math.round(random(i,j,"quality") *
                                (inventory_template[i].items[j].quality[1] - inventory_template[i].items[j].quality[0]) + inventory_template[i].items[j].quality[0]);

                            item = getItem({...item_templates[specification.item_name], quality});
                        } else {
                            item = getItem(item_templates[specification.item_name]);
                        }
                        let draw = 0;
                        const entries = affixedStockEntries({item, count: item_count,
                            partsOf: components => Object.fromEntries(Object.entries(components).map(([slot, id]) => [slot, item_templates[id]])),
                            random: piece => random(i,j,`affix:${piece}:${draw++}`),
                            plain: specification.roll_affixes === false});
                        for (const entry of entries) {
                            const existing = items[entry.item_key];
                            items[entry.item_key] = {item: existing?.item || getItemFromKey(entry.item_key), count: (existing?.count || 0) + entry.count};
                        }
                    }
                }
            }
        }
    }

    /**
     * 
     * @returns {Number} trader's profit margin multiplied by bonus from the haggling skill and by reputation impact
     */
    getProfitMargin(region) {
        const skill_multi = (1-character.getTotalLevelBonus("Haggling"));
        const rep_multi = (1-Math.min(1000,character.reputation[region])/2000) || 1;

        return accessoryTradeMargin(1 + (this.profit_margin - 1) * skill_multi * rep_multi);
    }

    emptyInventory(){
        this.getInventoryComponent().emptyInventory();
    }

    getInventoryComponent() {
        return this.#inventory;
    }

    getTradeInventory() {
        return this.getInventoryComponent().getItems();
    }

    addToInventory(items) {
        this.getInventoryComponent().addToInventory(items);
    }

    removeFromInventory(items) {
        this.getInventoryComponent().removeFromInventory(items);
    }

    /*
    getItemPrice(value, region) {
        let price = Math.ceil(value*this.getProfitMargin(region));
        if(price >= 100) {
            return Math.round(price/10)*10;
        } else if(price >= 1000) {
            return Math.round(price/100)*100;
        } else {
            return price;
        }
    }
    */  
}

availability_havers.push(TraderComponent);

export { TraderComponent };
