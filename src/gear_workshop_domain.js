import {createAffixes} from './gear_affixes.js';
import {registerDomain} from './domain_registry.js';
import {beginNativeCraftTransaction} from './native_craft_transaction.js';
import {equipmentDurability as durability} from './absorb_e2/durability.js';
import {toolsState, setToolsState, maxCondition, rekeyToolFacts} from './tools_domain.js';
import {quoteGearWork, validateWork, materialProperties, GEAR_WORK_LAWS} from './gear_work.js';
import {createGearWorkshopPanel} from './gear_workshop_panel.js';

let ports, panel;
export function configureGearWorkshop(operations) { ports = operations; }
const keyHasWork = key => {try {return JSON.parse(key).gearwork != null;} catch {return false;}};
const actor = () => ports.actor();
function maker(selected='player') {
    if(selected !== 'player' && selected !== 'oldCraftsman') throw Error('Choose a supported local maker.');
    const person=selected==='oldCraftsman'?ports.craftsman?.():actor();
    const unavailable=selected==='oldCraftsman'&&(!person?.is_alive||!ports.craftsmanHere?.());
    return {id: selected==='oldCraftsman'?'oldCraftsman':actor().id || actor().name || 'player', world: ports.world(), location: ports.location(),
        skill: selected==='oldCraftsman'?(person?.getTotalSkillLevel('Forging')||0):(ports.skillLevel('Forging')||0), station: ports.stationTier('forging'),
        durability: durability.enabled, blocked: unavailable?'The old craftsman is not available here.':!ports.writable() ? 'This game does not own the writable save.' : ports.blocked() || (!ports.idle() ? 'Finish the current activity before working on gear.' : '')};
}
export function quoteWorkshop(request) {
    const quoted = quoteGearWork({request, inventory: actor().getItems(), templates: ports.templates,
        maker: maker(request?.maker), condition: request?.key ? durability.condition(request.key) : 100,
        cap: request?.key ? maxCondition(request.key) : 100, uses: request?.key ? durability.uses(request.key) : 0, clock: ports.clock()});
    if(!quoted.eligible || request?.maker!=='oldCraftsman')return quoted;
    const feeKey=JSON.stringify({id:'Charcoal'}),spend=quoted.spend.map(r=>({...r})),existing=spend.find(r=>r.key===feeKey);
    if(existing)existing.count++;else spend.push({key:feeKey,count:1});
    if((actor().getItems()[feeKey]?.count||0)<spend.find(r=>r.key===feeKey).count)return {...quoted,eligible:false,reason:'The old craftsman asks for one Charcoal as his service fee, in addition to the process inputs.'};
    return {...quoted,spend,commission:{key:feeKey,count:1},summary:'Old craftsman: '+quoted.summary+' Service fee: one Charcoal to his own stock.'};
}
// Exact plans include maker/control, stock, current condition, process clock and
// returns. A changed quote cannot be executed by replaying its stale UI token.
export function executeWorkshop(quoted) {
    const q = quoteWorkshop(quoted.request);
    if(!q.eligible) throw Error(q.reason);
    if(JSON.stringify(q) !== JSON.stringify(quoted)) throw Error('The workshop quote changed. Review the process again.');
    if(toolsState()?.job?.key === q.request.key) throw Error('Finish the current tool repair before reworking this item.');
    for(const row of q.spend) ports.assertSpend(row.key);
    const txn = beginNativeCraftTransaction({owners: ports.itemOwners(), bindings: [
        {get: () => durability.serialize(), set: value => durability.load(value)},
        {get: toolsState, set: setToolsState},
    ]});
    let resultKey = null;
    try {
        const input = actor().getItems()[q.request.key].item;
        if(!q.destroyed) {
            const instance = durability.prepareEquip(input, ports.itemFactory, {requireIdentity: true});
            const instanceKey = instance.getInventoryKey(), data = JSON.parse(q.receive[0].key);
            data.e2_instance = JSON.parse(instanceKey).e2_instance;
            if(q.reforge && data.components?.internal) {
                let draw=0;
                data.affixes=createAffixes({parts:{internal:ports.templates[data.components.internal],external:ports.templates[data.components.external]},rarity:ports.itemFactory(JSON.stringify(data)).getRarity(),random:()=>ports.random(`gear.reforge:${data.e2_instance}:${data.gearwork.history.length}:${draw++}`)});
            }
            resultKey = JSON.stringify(data);
            // Decode and validate BEFORE removing any item. No lost custody if
            // an authored replacement cannot construct a real native item.
            ports.itemFactory(resultKey);
            durability.rekey(instanceKey, resultKey);
            rekeyToolFacts(q.request.key, resultKey);
            if(q.repair != null) durability.setCondition(resultKey, q.repair);
        } else {rekeyToolFacts(q.request.key, null); durability.forget(q.request.key);}
        for(const row of q.spend) actor().removeFromInventory([{item_key: row.key, item_count: row.count}]);
        for(let i = 0; i < q.receive.length; i++) {
            const row = q.receive[i], key = !q.destroyed && i === 0 ? resultKey : row.key;
            actor().addToInventory([{item_key: key, count: row.count}]);
        }
        if(q.commission)ports.craftsman().addToInventory([{item_key:q.commission.key,count:q.commission.count}]);
        if(ports.favorites?.[q.request.key]) {
            delete ports.favorites[q.request.key];
            if(resultKey) ports.favorites[resultKey] = true;
        }
        ports.persist(() => txn.markDurable());
    } catch(error) {if(txn.status === 'pending') txn.rollback(); throw error;}
    finally {ports.refresh(); panel?.render();}
    ports.logMessage(q.summary);
    return {...q, resultKey};
}
export function projectWorkshop() {
    const m = maker(), inventory = actor().getItems();
    return {maker: m, discovered: m.world === 'base.frontier' && m.station > 0,
        rows: Object.entries(inventory).filter(([,r]) => r.item.tags.equippable && r.item.components && !r.item.tags.structuredEquipment)
            .map(([key,r]) => ({key, name: r.item.getName(), count: r.count, quality: r.item.quality,
                components: r.item.components, condition: durability.condition(key), max: maxCondition(key), uses: durability.uses(key),
                work: r.item.gearwork || null, properties: r.item.getWearProfile?.(), contributions: r.item.getWorkContributions?.() || []})),
        materials: Object.entries(inventory).filter(([,r]) => r.item.tags.component && materialProperties(ports.templates[r.item.id]) || ['Lamp oil','Iron ingot'].includes(r.item.id))
            .map(([key,r]) => ({key, name: r.item.getName(), count: r.count})),
        makers: [{id:'player',name:'You',skill:m.skill},...(ports.craftsmanHere?.()?[{id:'oldCraftsman',name:'Old craftsman',skill:ports.craftsman().getTotalSkillLevel('Forging')}]:[])],
        roles: Object.keys(GEAR_WORK_LAWS[m.world]?.roles || {})};
}
export function validateWorkshopEnvelope(envelope) {
    // Native inventories, equipment and NPC inventories all keep the same key.
    // Other domains still validate their own keys. Only inspect our marker.
    function inspect(key) {
        if(!keyHasWork(key)) return;
        const k = JSON.parse(key); validateWork(k.gearwork);
        if(!k.e2_instance || !k.components) throw Error('Worked gear needs a material assembly and stable instance.');
        for(const role of Object.values(k.gearwork.roles)) {
            const part = JSON.parse(role.key), t = ports.templates[part.id];
            if(!t?.tags.component || JSON.stringify(materialProperties(t)) !== JSON.stringify(role.properties)
                || (part.quality ?? t.quality ?? 100) / 100 !== role.grade) throw Error('Worked gear role differs from its material.');
        }
        ports.itemFactory(key);
    }
    function walk(v) {
        if(typeof v === 'string') {if(v.startsWith('{')) inspect(v); return;}
        if(!v || typeof v !== 'object') return;
        for(const [key,row] of Object.entries(v)) {if(key.startsWith('{')) inspect(key); walk(row);}
    }
    walk(envelope.inventories); walk(envelope.character); walk(envelope.npc_equipment);
}
registerDomain({id: 'gear_workshop', initialState: () => null,
    ownsItemKey: keyHasWork, validate: (_, envelope) => validateWorkshopEnvelope(envelope),
    commands: {quote: quoteWorkshop, execute: executeWorkshop}, projection: projectWorkshop,
    refresh: () => panel?.render(), panels: [() => {panel = createGearWorkshopPanel({read: projectWorkshop, quote: quoteWorkshop, execute: executeWorkshop});}],
});
