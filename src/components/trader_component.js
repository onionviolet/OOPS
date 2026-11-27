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
import { config } from "../config.js";
import {factorioRetortItemSpecifications} from '../factorio_retort_content.js';
import {proto23ItemSpecifications} from '../proto23_world_content.js';
import {affixedStockEntries} from '../gear_acquisition.js';
import {getItemFromKey} from '../items.js';
import {keyedShopStock,keyedUnitFor} from '../keyed_generation.js';
import {dayIndex} from '../world_day_index.js';
import {stapleIds, projectStock} from '../regional_prices.js';

const conservedCampaignItems = [...factorioRetortItemSpecifications,...proto23ItemSpecifications];
const conservedCampaignKeys = new Set(conservedCampaignItems.map(spec => JSON.stringify({id:spec.id})));
const conservedCampaignIds = conservedCampaignItems.map(spec => spec.id);

inventories["trader"] = {};
availabilities["trader"] = {};

class TraderComponent {

    #inventory;
    #availability;
    #cycleStart = -1;

    constructor({
                name,
                trade_text,
                trade_from_dialogue_text,
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
        this.trade_from_dialogue_text = trade_from_dialogue_text || "Trade";
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
    refresh(context, worldSeed) {
        // Optional owner callback stages the same private inventory through the
        // normal durable native transaction. Legacy shops retain day cadence.
        if(this.played_minute_refresh) return this.played_minute_refresh(context);
        if(this.can_refresh()) {
            //refresh inventory
            const previous={...this.#inventory.getItems()},retained = {}, lastDue = this.last_refresh;
            const before = this.filled_causes ?? (lastDue < 0 ? new Set(this.activeCauses(context)) : null) ?? new Set(this.stockCauses(context).filter(c => c.stocked).map(c => c.cause));
            this.#cycleStart = lastDue;
            for(const [key, entry] of Object.entries(this.#inventory.getItems())) {
                if(conservedCampaignKeys.has(key)) {
                    if(!entry?.item || !Number.isSafeInteger(entry.count) || entry.count <= 0) throw new Error('Invalid conserved campaign merchant stock.');
                    retained[key] = entry;
                } else if(conservedCampaignIds.some(id => key.includes(id))) throw new Error('Malformed conserved campaign merchant key.');
            }
            this.emptyInventory();
            this.fillInventoryFromTemplate(context, worldSeed);
            for(const [key, entry] of Object.entries(retained)) {
                if(this.#inventory.getItems()[key]) throw new Error('Merchant templates cannot create conserved campaign stock.');
                this.#inventory.getItems()[key] = entry;
            }

            this.#carryStaples(previous);
            const locked=retainShopStock(this.stockOwnerId,previous,this.#inventory.getItems());for(const key of Object.keys(this.#inventory.getItems()))if(!Object.hasOwn(locked,key))delete this.#inventory.getItems()[key];Object.assign(this.#inventory.getItems(),locked);
            this.last_refresh = (current_game_time.day_count + 1 - current_game_time.day_count % this.refresh_time);
            // What this restock put on the shelf, by name: lets the keeper say a staple sold out (ECC43). Memory only;
            // after a reload it is empty until the next restock, and the keeper simply has no stock news.
            this.laid_out = new Set(Object.values(this.#inventory.getItems()).filter(e => e?.count > 0).map(e => e.item?.name));
            // PS161: which caused groups this fill laid out, and which are new since the last fill. Memory only, like
            // laid_out; after a reload `stockCauses` reads the shelf instead.
            this.filled_causes = new Set(this.activeCauses(context));
            this.fresh_causes = new Set([...this.filled_causes].filter(c => !before.has(c)));
            return true;
        }
        //otherwise do nothing
        return false;
    }


    // XWR17/ECR15: a staple on a regional shelf is carried, not redrawn. Last cycle's count plus the stated deliveries
    // (and local use of any surplus) since, each cycle under its own keyed event. The first fill of an empty shelf keeps
    // the template draw as the opening stock; a shelf with anything on it is a real shelf.
    #carryStaples(previous) {
        const ids = stapleIds(this.stockOwnerId);
        if(!ids.length || !Object.keys(previous).length) return;
        const items = this.#inventory.getItems(), day = current_game_time.day_count;
        const cycles = this.#cycleStart < 0 ? 1 : Math.max(1, Math.floor((day - this.#cycleStart) / this.refresh_time));
        const draw = key => gameKeyedRandom(STREAMS.market, key);
        for(const id of ids) {
            const key = JSON.stringify({id}), had = previous[key]?.count ?? 0;
            const count = projectStock({vendorId: this.stockOwnerId, goodId: id, stock: had, fromDay: this.#cycleStart < 0 ? day - this.refresh_time : this.#cycleStart, cycleDays: this.refresh_time, cycles, draw});
            if(count > 0) items[key] = {item: items[key]?.item ?? previous[key]?.item ?? getItem(item_templates[id]), count};
            else delete items[key];
        }
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

    // ECC38: staples are the template rows this stall always lays out (chance 1) under the current conditions.
    stapleNames(context) {
        const names = inventory_templates[this.inventory_template].filter(g => g.canBeStarted(context))
            .flatMap(g => g.items.filter(spec => spec.chance >= 1 && spec.canBeStarted(context)).map(spec => spec.item_name));
        return [...new Set(names)];
    }

    /** PS161: cause ids of the template groups whose conditions hold now (a cleared hideout, a finished quest). */
    activeCauses(context) {
        return [...new Set(inventory_templates[this.inventory_template].filter(g => g.cause && g.canBeStarted(context)).map(g => g.cause))];
    }

    /**
     * PS161: each cause that holds now, and whether the shelf already carries it. A cause that came true after the
     * last fill is `stocked: false` until the next cart (the stall restocks on its own cycle; the news travels, the
     * goods follow). After a reload, a cause counts as stocked when the shelf holds a good only that group sells,
     * or when its group has no such good.
     */
    stockCauses(context) {
        const groups = inventory_templates[this.inventory_template];
        const onShelf = new Set(Object.values(this.#inventory.getItems()).filter(e => e?.count > 0).map(e => e.item?.id ?? e.item?.name));
        return this.activeCauses(context).map(cause => {
            if(this.filled_causes) return {cause, stocked: this.filled_causes.has(cause), fresh: this.fresh_causes?.has(cause) ?? false};
            const mine = new Set(groups.filter(g => g.cause === cause).flatMap(g => g.items.map(i => i.item_name)));
            const others = new Set(groups.filter(g => g.cause !== cause).flatMap(g => g.items.map(i => i.item_name)));
            const own = [...mine].filter(n => !others.has(n));
            return {cause, stocked: own.length === 0 || own.some(n => onShelf.has(n)), fresh: false};
        });
    }

    /** Whole days until the next delivery (at least 1); null for a stall on another restock clock. */
    daysToRestock() {
        if(this.played_minute_refresh || this.last_refresh < 0) return null;
        return Math.max(1, this.last_refresh + this.refresh_shift + this.refresh_time - current_game_time.day_count);
    }

    /**
     * creates new choice of items for the trader, based on assigned inventory template
     * @returns {null}
     */
    fillInventoryFromTemplate(context, worldSeed) {
        if(worldSeed !== undefined) return this.#fillKeyed(context, worldSeed);
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
                        const template = item_templates[specification.item_name];
                        const variants = specification.quality ? item_count : 1;
                        const precision = template.tags?.equipment ? config.equipment_crafting_quality_precision : config.item_crafting_quality_precision;
                        let draw = 0;
                        for (let piece = 0; piece < variants; piece++) {
                            const quality = specification.quality && Math.round(
                                (random(i,j,piece === 0 ? "quality" : `quality:${piece}`) *
                                (specification.quality[1]-specification.quality[0])+specification.quality[0])/precision)*precision;
                            const item = getItem(specification.quality ? {...template,quality} : template);
                            const entries = affixedStockEntries({item, count: specification.quality ? 1 : item_count,
                                partsOf: components => Object.fromEntries(Object.entries(components).map(([slot, id]) => [slot, item_templates[id]])),
                                random: part => random(i,j,`affix:${part}:${draw++}`),
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
    }

    // Opt-in (PL-E1): stock is a pure keyed draw of (worldSeed, shop name, refresh epoch day). worldSeed is a
    // runtime argument only; nothing is saved on the trader. Start conditions are resolved before keying.
    #fillKeyed(context, worldSeed) {
        const items = this.getInventoryComponent().getItems();
        const epoch = current_game_time.day_count + 1 - current_game_time.day_count % this.refresh_time;
        const day = dayIndex({calendar: {day_count: epoch}});
        const groups = inventory_templates[this.inventory_template].filter(g => g.canBeStarted(context))
            .map(g => g.items.filter(spec => spec.canBeStarted(context)));
        const rows = keyedShopStock({worldSeed, shopId: this.name, dayIndex: day,
            template: groups.map(specs => ({items: specs}))});
        for(const row of rows) {
            const specification = groups[row.group][row.index];
            const template = item_templates[specification.item_name];
            const item = getItem(row.quality !== undefined ? {...template, quality: row.quality} : template);
            let draw = 0;
            const entries = affixedStockEntries({item, count: row.count,
                partsOf: components => Object.fromEntries(Object.entries(components).map(([slot, id]) => [slot, item_templates[id]])),
                random: piece => keyedUnitFor(worldSeed, STREAMS.market, [this.name, day, row.group, row.index, `affix:${piece}:${draw++}`]),
                plain: specification.roll_affixes === false});
            for(const entry of entries) {
                const existing = items[entry.item_key];
                items[entry.item_key] = {item: existing?.item || getItemFromKey(entry.item_key), count: (existing?.count || 0) + entry.count};
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
