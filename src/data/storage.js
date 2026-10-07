import InventoryComponent, {inventories} from "../components/inventory_component.js";
import { exit_displayed_storage, update_displayed_storage } from "../display.js";

const player_storage = new InventoryComponent();
// Component saves must own the chest too, including migrated pre-v0.6 items.
inventories.storage = {player: player_storage};
let storage_open = false;
let commit_transfer;

function bind_storage_transfer(handler) {
    commit_transfer = handler;
}

/**
 * @param {Array} items [{item_key, item_count}]
 */
function add_to_storage(items) {
    player_storage.addToInventory(items);

    update_displayed_storage();
}

/**
 * @param {Array} items [{item_key, count}]
 */
function remove_from_storage(items) {
    player_storage.removeFromInventory(items);
    
    update_displayed_storage();
}

//kinda pointless but keep it in case there are changes
function open_storage(items) {
    update_displayed_storage(items);
    storage_open = true;
}

//kinda pointless but keep it in case there are changes
function close_storage(items) {
    exit_displayed_storage(items);
    storage_open = false;
}

/**
 * @param {Object} item {item_key, count}
 */
function move_item_to_storage(item) {
    if(!commit_transfer) throw new Error("Chest transfers are unavailable.");
    return commit_transfer({...item, direction: "deposit"});
}

/**
 * @param {Array} item [{item_key, item_count}]
 */
function remove_item_from_storage(item) {
    if(!commit_transfer) throw new Error("Chest transfers are unavailable.");
    return commit_transfer({...item, direction: "withdraw"});
}

function is_storage_open() {
    return storage_open;
}

export {
    player_storage, 
    add_to_storage, remove_from_storage, open_storage, close_storage,
    move_item_to_storage, remove_item_from_storage, is_storage_open, bind_storage_transfer
}
