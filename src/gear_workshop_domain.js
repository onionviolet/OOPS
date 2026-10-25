import {MENDER_ACTIONS,quoteMender} from './material_apprentice.js';
import {queryCapabilities} from './capabilities.js';
import {applySimulationEffects} from './simulation_effects.js';
import {applyGameplayEffect} from './gameplay_transactions.js';
import {createAffixes,rerollSelectedAffix} from './gear_affixes.js';
import {domainRegistry,registerDomain} from './domain_registry.js';
import {beginNativeCraftTransaction} from './native_craft_transaction.js';
import {equipmentDurability as durability} from './absorb_e2/durability.js';
import {toolsState, setToolsState, maxCondition, rekeyToolFacts} from './tools_domain.js';
import {quoteGearWork, validateWork, materialProperties, GEAR_WORK_LAWS, coldSoakNeed} from './gear_work.js';
import {createGearWorkshopPanel} from './gear_workshop_panel.js';
import {HIDE_TREATMENTS, quoteHideTreatment, samePreparationQuote} from './material_treatment.js';
import {applyEnergyEffect} from './energy_resources.js';

let ports, panel;
const needOf = item => {
    const profile = item?.getWearProfile?.(), law = GEAR_WORK_LAWS[ports?.world?.()];
    return coldSoakNeed({armor: !!item?.components?.internal, metal: !!profile?.parts?.some(p => p.family === 'metal'), work: item?.gearwork,
        temperature: ports?.temperature?.(), law});
};
export function configureGearWorkshop(operations) { ports = operations; durability.setWearHazard(item => needOf(item).factor); }
const keyHasWork = key => {try {return JSON.parse(key).gearwork != null;} catch {return false;}};
const actor = () => ports.actor();
function maker(selected='player') {
    if(selected !== 'player' && selected !== 'oldCraftsman') throw Error('Choose a supported local maker.');
    const person=selected==='oldCraftsman'?ports.craftsman?.():actor();
    const unavailable=selected==='oldCraftsman'&&(!person?.is_alive||!ports.craftsmanHere?.());
    return {id: selected==='oldCraftsman'?'oldCraftsman':actor().id || actor().name || 'player', world: ports.world(), location: ports.location(),
        skill: selected==='oldCraftsman'?(person?.getTotalSkillLevel('Forging')||0):(ports.skillLevel('Forging')||0), station: ports.stationTier('forging'),
        ...(selected === 'player' && ports.root?.()?.simulation?.energies?.player?.['field.focus'] ? {focus: structuredClone(ports.root().simulation.energies.player['field.focus'])} : {}),
        durability: durability.enabled, blocked: unavailable?'The old craftsman is not available here.':!ports.writable() ? 'This game does not own the writable save.' : ports.blocked() || (!ports.idle() ? 'Finish the current activity before working on gear.' : '')};
}
export function quoteWorkshop(request) {
    const refusal=request?.maker==='oldCraftsman'?domainRegistry.command('pledges','actionReason')?.({kind:'paid-help'}):'';if(refusal)return {request:structuredClone(request),eligible:false,reason:refusal,spend:[],receive:[]};
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
        ...(q.energy ? [{get: () => ports.root().simulation.energies, set: value => {ports.root().simulation.energies = value;}}] : []),
    ]});
    let resultKey = null;
    try {
        if(q.energy) applyEnergyEffect(ports.root(), 'player', q.energy, ports.registry.simulation);
        const input = actor().getItems()[q.request.key].item;
        if(!q.destroyed) {
            const instance = durability.prepareEquip(input, ports.itemFactory, {requireIdentity: true});
            const instanceKey = instance.getInventoryKey(), data = JSON.parse(q.receive[0].key);
            data.e2_instance = JSON.parse(instanceKey).e2_instance;
            if(q.reforge && data.components?.internal) {
                let draw=0;
                data.affixes=createAffixes({parts:{internal:ports.templates[data.components.internal],external:ports.templates[data.components.external]},rarity:ports.itemFactory(JSON.stringify(data)).getRarity(),random:()=>ports.random(`gear.reforge:${data.e2_instance}:${data.gearwork.history.length}:${draw++}`)});
            }
            if(q.reroll){let draw=0;data.affixes=rerollSelectedAffix({list:data.affixes,id:q.reroll,rarity:input.getRarity(),random:()=>ports.random(`gear.inscription:${data.e2_instance}:${data.gearwork.history.length}:${draw++}`)});}
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
// Hide preparation shares the workshop's maker checks and native transaction.
export function quoteHide(treatmentId) {
    const m = maker();
    if(m.blocked) return {eligible: false, treatmentId, reason: m.blocked};
    if(!(m.station > 0)) return {eligible: false, treatmentId, reason: 'Prepare hides at a native work station.'};
    const counts = Object.fromEntries(Object.entries(actor().getItems()).map(([key, r]) => [key, r.count]));
    return quoteHideTreatment({treatmentId, inventory: counts, skillLevel: ports.skillLevel('Crafting') || 0, clock: ports.clock(), world: m.world});
}
export function executeHide(quoted) {
    const q = quoteHide(quoted.treatmentId);
    if(!q.eligible) throw Error(q.reason);
    if(!samePreparationQuote(quoted, q)) throw Error('The hide preparation quote changed. Review it again.');
    for(const row of q.spend) ports.assertSpend(row.key);
    ports.itemFactory(q.receive[0].key);
    const txn = beginNativeCraftTransaction({owners: ports.itemOwners(), bindings: []});
    try {
        for(const row of q.spend) actor().removeFromInventory([{item_key: row.key, item_count: row.count}]);
        for(const row of q.receive) actor().addToInventory([{item_key: row.key, count: row.count}]);
        ports.persist(() => txn.markDurable());
    } catch(error) {if(txn.status === 'pending') txn.rollback(); throw error;}
    finally {ports.refresh(); panel?.render();}
    ports.logMessage(q.summary);
    return q;
}
export function quoteRepairer(action){
 const m=maker(),state=ports.root?.();if(!state?.simulation?.people.player)return {eligible:false,action,reason:'Follow local people and work before recording repair practice.'};
 const capability=queryCapabilities(state,ports.registry,{actorId:'player'},{} )['frontier.fitted_repair']?.value||0;
 return quoteMender({action,state,inventory:Object.fromEntries(Object.entries(actor().getItems()).map(([k,r])=>[k,r.count])),world:m.world,location:m.location,craftsmanHere:ports.craftsmanHere?.(),blocked:m.blocked,materialClock:ports.clock(),capability,toolCondition:durability.condition});
}
export function executeRepairer(quoted){
 const q=quoteRepairer(quoted.action);if(!q.eligible)throw Error(q.reason);if(!samePreparationQuote(quoted,q))throw Error('The repairer quote changed. Review it again.');
 for(const r of q.spend)ports.assertSpend(r.key);
 const plan=ports.plan(q.minutes);
 for(const r of q.spend)applyGameplayEffect(plan.gameplay,{type:'item',key:r.key,amount:r.count},'player',true);
 for(const r of q.receive){ports.itemFactory(r.key);applyGameplayEffect(plan.gameplay,{type:'item',key:r.key,amount:r.count},'player');}
 plan.acquisitions||=[];plan.unlocks||=[];
 applySimulationEffects(plan,q.effects,{actorId:'player',worldId:plan.state.actors.player.worldId,external:plan.external,gameplay:plan.gameplay,facts:{location:ports.location()}},ports.registry,`mender:${plan.state.sequence}`);
 ports.commit(plan);panel?.render();ports.logMessage(q.summary);return q;
}
export function projectWorkshop() {
    const m = maker(), inventory = actor().getItems();
    return {maker: m, discovered: m.world === 'base.frontier' && m.station > 0,
        rows: Object.entries(inventory).filter(([,r]) => r.item.tags.equippable && r.item.components && !r.item.tags.structuredEquipment)
            .map(([key,r]) => ({key, name: r.item.getName(), count: r.count, quality: r.item.quality,
                components: r.item.components, condition: durability.condition(key), max: maxCondition(key), uses: durability.uses(key),
                work: r.item.gearwork || null,affixes:r.item.affixes||JSON.parse(key).affixes||[], need: needOf(r.item), properties: r.item.getWearProfile?.(), contributions: r.item.getWorkContributions?.() || []})),
        materials: Object.entries(inventory).filter(([,r]) => r.item.tags.component && materialProperties(ports.templates[r.item.id]) || ['Lamp oil','Iron ingot'].includes(r.item.id))
            .map(([key,r]) => ({key, name: r.item.getName(), count: r.count})),
        makers: [{id:'player',name:'You',skill:m.skill},...(ports.craftsmanHere?.()?[{id:'oldCraftsman',name:'Old craftsman',skill:ports.craftsman().getTotalSkillLevel('Forging')}]:[])],
        roles: Object.keys(GEAR_WORK_LAWS[m.world]?.roles || {}), focusKnown: !!m.focus,
        repairerStatus:ports.root?.().actors.player.sources['frontier.mender.fitted']?'Practiced fitting is retained: either usable kit can support precise lining work.':ports.root?.().actors.player.facts['mender.methodsKnown']?'Preparation lesson recorded. Complete local repair work and demonstrate a fitted preparation.':'The craftsman can teach local preparation and fitting through actual repair work.',
        repairer:Object.entries(MENDER_ACTIONS).filter(([id])=>id==='lesson'?!ports.root?.().actors.player.facts['mender.methodsKnown']:id==='shift'?!ports.root?.().actors.player.facts['mender.repairShift']:id==='advance'?!ports.root?.().actors.player.sources['frontier.mender.fitted']:true).flatMap(([id,label])=>['tool','advance','fine'].includes(id)?['smoked','oiled'].map(route=>({id:id+':'+route,label:label+' · '+route+' lot',quote:quoteRepairer(id+':'+route)})):[{id,label,quote:quoteRepairer(id)}]),
        hides: Object.entries(HIDE_TREATMENTS).map(([id, t]) => ({id, label: t.label, note: t.note, quote: quoteHide(id)}))};
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
    commands: {quote: quoteWorkshop, execute: executeWorkshop, quoteHide, executeHide}, projection: projectWorkshop,
    refresh: () => panel?.render(), panels: [() => {panel = createGearWorkshopPanel({read: projectWorkshop, quote: quoteWorkshop, execute: executeWorkshop, prepareHide: executeHide,repairer:executeRepairer});}],
});
