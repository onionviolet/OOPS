// Native gear processes, GDP1–20/24/38. Pure: snapshots in, proposed native key
// changes out. No inventory, RNG, clock, save writer or actor singleton here.
import {wearScale} from './gear_dimensions.js';
import {quoteHeat, HEAT_WORLDS} from './heat_grades.js';

const round = n => Math.round(n * 10000) / 10000;
const record = v => v && typeof v === 'object' && !Array.isArray(v);
const finite = (v, min, max) => Number.isFinite(v) && v >= min && v <= max;
const fail = message => { throw Error(message); };
// These are base-world proposals, not universal ceilings or foreign balance.
// Roles cost integrity through actual mass; exceeding the ordinary budget costs
// handling rather than forbidding an otherwise supported construction (AD38).
export const GEAR_WORK_LAWS = Object.freeze({
    'base.frontier': Object.freeze({revision: 1, heatGrade: 2, heatLoad: 4, hotMinutes: 5,
        repairUnit: 20, fieldEfficiency: 0.5, salvageShare: 0.5, honingUses: 5,
        roles: Object.freeze({grip: 'Handling through a held part', lining: 'Padding spreads a blow', coating: 'A shell spreads impact', setting: 'A fitted component carries its native modifiers'})}),
});
export const GEAR_ACTIONS = Object.freeze({
    attach: 'Attach material role', detach: 'Remove material role', heat: 'Heat workpiece',
    shape: 'Work hot metal', quench: 'Quench in oil', temper: 'Temper metal', finish: 'Finish the surface',
    refit: 'Refit the handling', hone: 'Improve through use', swap: 'Replace component',
    socket: 'Make rigid setting', reforge: 'Reforge craftsmanship', repair: 'Repair with material', fieldRepair: 'Field material repair', salvage: 'Dismantle for components',
});

export function validateWork(value) {
    if (value == null) return null;
    if (!record(value) || value.revision !== 1 || !record(value.roles) || !Array.isArray(value.history)
        || !Number.isSafeInteger(value.honedAt) || value.honedAt < 0 || !finite(value.finish, 0, 1)
        || !finite(value.fit, 0, 1)) fail('Unsupported worked gear record.');
    if(value.socket != null && (!record(value.socket) || value.socket.type !== 'rigid-setting' || typeof value.socket.material !== 'string')) fail('Invalid gear setting.');
    for (const [role, part] of Object.entries(value.roles)) {
        if (!['grip', 'lining', 'coating', 'setting'].includes(role) || !record(part)
            || typeof part.key !== 'string' || typeof part.name !== 'string' || !record(part.properties)
            || !finite(part.grade, 0, 2.5)) fail('Invalid gear role.');
        JSON.parse(part.key);
        for (const axis of ['strength', 'toughness', 'weight', 'warmth']) if (!finite(part.properties[axis], 0, 1000)) fail('Invalid role material.');
    }
    if (!record(value.treatment) || !finite(value.treatment.hardness, 0.1, 3) || !finite(value.treatment.toughness, 0.1, 3)
        || !['cold', 'heated', 'shaped', 'quenched', 'tempered'].includes(value.treatment.stage)
        || !finite(value.treatment.at, 0, Number.MAX_SAFE_INTEGER)) fail('Invalid gear treatment.');
    for (const row of value.history) if (!record(row) || typeof row.action !== 'string' || typeof row.maker !== 'string'
        || typeof row.location !== 'string' || !finite(row.at, 0, Number.MAX_SAFE_INTEGER)) fail('Invalid gear provenance.');
    return value;
}
export const freshWork = () => ({revision: 1, roles: {}, honedAt: 0, finish: 0, fit: 0,
    treatment: {stage: 'cold', at: 0, hardness: 1, toughness: 1}, history: []});

export function materialProperties(template) {
    if (!Number.isFinite(template?.material_strength)) return null;
    return {strength: template.material_strength, toughness: template.material_toughness,
        weight: template.material_weight ?? 100, warmth: template.material_warmth ?? 100};
}
export function workedWearProfile(profile, work) {
    if (!profile || !work) return profile;
    validateWork(work);
    const strength = profile.parts.reduce((sum,p) => sum + p.strength * (p.family === 'metal' ? work.treatment.hardness : 1), 0) / profile.parts.length;
    const toughness = profile.parts.reduce((sum,p) => sum + p.toughness * (p.family === 'metal' ? work.treatment.toughness : 1), 0) / profile.parts.length;
    return {...profile, strength, toughness, scale: wearScale({strength, toughness}) * (1 - work.finish * .05)};
}

// Final item contributions sit after native part/quality/rarity math. Nothing is
// rolled or scaled a second time. Both native people and creatures read these.
export function workContributions(work, {condition = 100, tier = 1, weapon = false} = {}) {
    if (!work) return [];
    validateWork(work);
    const rows = [], mass = Object.values(work.roles).reduce((sum, r) => sum + r.properties.weight / 100, 0);
    const add = (label, stat, kind, value) => rows.push({label, stat, [kind]: round(value)});
    const n = Object.keys(work.roles).length;
    for (const [role, part] of Object.entries(work.roles)) {
        // A shared trait is diluted by the full set of add-on parts, so adding
        // unrelated materials cannot stack their strongest property undiluted.
        const grade = part.grade / Math.max(1, n), p = part.properties;
        const label = `${role}: ${part.name} (lot grade ${round(part.grade)})`;
        if (role === 'grip') add(label, 'attack_points', 'multiplier', 1 + .03 * grade * p.toughness / 100);
        if (role === 'lining') {add(label, 'crit_resistance', 'flat', .03 * grade * p.warmth / 100); add(label, 'cold_tolerance', 'flat', 2 * grade * p.warmth / 100);}
        if (role === 'coating') add(label, 'damage_taken', 'multiplier', 1 - .02 * grade * p.strength / 100 * condition / 100);
        if (role === 'setting') add(label, 'min_damage_share', 'multiplier', 1 - .03 * grade * p.strength / 100);
    }
    if (mass) add('Added material mass', 'stamina_efficiency', 'multiplier', 1 / (1 + mass * .015));
    if (mass > tier) add('Integrity strain from added mass', 'attack_speed', 'multiplier', 1 / (1 + (mass - tier) * .03));
    if (work.fit) add('Refitted handling', 'attack_points', 'multiplier', 1 + work.fit * .03);
    if (work.treatment.hardness !== 1) add(weapon ? 'Heat-treated edge' : 'Heat-treated shell', weapon ? 'attack_power' : 'min_damage_share', 'multiplier', weapon ? 1 + (work.treatment.hardness - 1) * .2 : 1 / work.treatment.hardness);
    if (!weapon && work.treatment.toughness !== 1) add('Heat-treated toughness', 'crit_resistance', 'flat', (work.treatment.toughness - 1) * .02);
    return rows;
}
export function mergeWorkStats(stats, contributions) {
    const out = structuredClone(stats);
    for (const row of contributions) {
        const value = out[row.stat] ||= {};
        if (row.flat != null) value.flat = (value.flat ?? 0) + row.flat;
        if (row.multiplier != null) value.multiplier = (value.multiplier ?? 1) * row.multiplier;
    }
    return out;
}
export function gearWorkSourceRows(equipment, stat) {
    return Object.values(equipment || {}).flatMap(item => (item?.getWorkContributions?.() || [])
        .filter(r => r.stat === stat).map(r => ({...r, label: `${r.label} (${item.getName()})`, includedInEquipment: true})));
}

// Key itself owns the completed processes. Host binds the instance ID before
// execution; factory decoding validates the record and preserves the exact key.
export function quoteGearWork({request, inventory, templates, maker, condition = 100, cap = 100, uses = 0, clock, law = GEAR_WORK_LAWS[maker.world]}) {
    const q = {request: structuredClone(request), eligible: false, reason: '', spend: [], receive: []};
    const block = reason => ({...q, reason});
    if (!law) return block('This world has no authored workshop process yet.');
    if (!record(request) || !GEAR_ACTIONS[request.action] || typeof request.key !== 'string') return block('Choose a carried item and a supported process.');
    const held = inventory[request.key];
    if (!held?.item?.tags?.equippable || held.item.tags.structuredEquipment) return block('Choose native equipment carried in your pack. Unequip it first.');
    const item = held.item, key = JSON.parse(request.key);
    if (!item.components) return block('This process needs material-filled components.');
    const parts = Object.values(item.components).map(id => templates[id]);
    if (parts.some(p => !materialProperties(p))) return block('These components have no modeled material properties yet.');
    const work = structuredClone(validateWork(key.gearwork) || freshWork());
    const skill = Math.max(0, maker.skill), control = Math.min(1, (skill + maker.station) / 20);
    const action = request.action, field = action === 'fieldRepair';
    const metal = parts.some(p => p.material_family === 'metal');
    if (maker.blocked) return block(maker.blocked);
    if (!field && maker.station < 1) return block('A local crafting station is needed for this process.');
    const costs = new Map(), returns = new Map();
    const take = (k, n = 1) => costs.set(k, (costs.get(k) || 0) + n);
    const give = (k, n = 1) => returns.set(k, (returns.get(k) || 0) + n);
    const chosen = inventory[request.material]?.item;
    const chosenTemplate = chosen && templates[chosen.id];
    const properties = materialProperties(chosenTemplate);
    const hot = ['heated', 'shaped'].includes(work.treatment.stage) && clock - work.treatment.at <= law.hotMinutes;
    let repair = null, destroyed = false, nextQuality = key.quality ?? item.quality, summary;
    if (action === 'attach') {
        const role = request.role;
        if(role === 'setting' && (!work.socket || chosenTemplate?.socket_kind !== work.socket.type)) return block('Make a rigid setting first, then select a fitted mineral insert of that type.');
        if (!Object.hasOwn(law.roles, role)) return block('Choose a modeled add-on role.');
        if (!properties || !chosen.tags.component) return block('Select a material-filled component from your pack.');
        if (work.roles[role]) return block('Remove the existing part in this role before fitting another.');
        if (role === 'grip' && !item.components.handle) return block('A grip needs a held handle to act through.');
        if (role === 'lining' && !item.components.internal) return block('A lining needs an armor interior to pad.');
        take(request.material);
        work.roles[role] = {key: request.material, name: chosen.getName(), grade: (chosen.quality ?? 100) / 100, properties};
        summary = `Fit ${chosen.getName()} as ${role}; its material acts through that role, with an added mass cost.`;
    } else if (action === 'socket') {
        if(work.socket) return block('This item already carries its ordinary rigid setting.');
        if(chosen?.id !== 'Iron ingot') return block('Select one Iron ingot for the modeled rigid mount.');
        take(request.material);work.socket={type:'rigid-setting',material:request.material};
        summary='Make a rigid setting with one iron ingot. The mount stays with the item; a fitted gem can be installed and removed.';
    } else if (action === 'reforge') {
        if(!properties || !chosen?.tags.component || !parts.some(p=>p.material_family===chosenTemplate.material_family)) return block('Select a component whose material family can support this reforge.');
        const target=Math.max(item.quality,Math.min(250,Math.round((item.quality*2+(chosen.quality??100)+skill*2+maker.station*5)/3)));
        if(target<=item.quality&&!item.components.internal)return block('This maker, station and material cannot improve this item.');
        const heat=quoteHeat({minGrade:law.heatGrade,load:law.heatLoad},Object.values(inventory).map(r=>({id:r.item.id,count:r.count})),{world:HEAT_WORLDS[maker.world]});
        if(!heat.ok||heat.have<heat.unitsPerCraft)return block(heat.reason||'Not enough forge fuel.');
        take(request.material);let left=heat.unitsPerCraft;
        for(const [k,r]of Object.entries(inventory))if(r.item.id===heat.fuelId&&left>0){const count=Math.min(left,r.count);take(k,count);left-=count;}
        nextQuality=target;summary=`Reforge craftsmanship ${item.quality}% → ${target}%. Matching material and forge fuel are consumed. Armor affixes resolve once at commitment; the preview never rolls them.`;
    } else if (action === 'detach') {
        if (!work.roles[request.role]) return block('No part is fitted in that role.');
        // A removable fitting returns its one real component, never bulk raw units.
        give(work.roles[request.role].key); delete work.roles[request.role];
        summary = 'Remove the fitting and recover its component. Assembly effort is lost.';
    } else if (['heat', 'shape', 'quench', 'temper'].includes(action)) {
        if (!metal) return block('These heat-treatment laws model metal workpieces; these parts need a different material process.');
        if (action === 'heat' || action === 'temper') {
            if (action === 'temper' && work.treatment.stage !== 'quenched') return block('Temper a quenched workpiece to trade some hardness for toughness.');
            const heat = quoteHeat({minGrade: law.heatGrade, load: law.heatLoad}, Object.values(inventory).map(r => ({id: r.item.id, count: r.count})), {world: HEAT_WORLDS[maker.world]});
            if (!heat.ok || heat.have < heat.unitsPerCraft) return block(heat.reason || `Need ${heat.unitsPerCraft} ${heat.fuelId}.`);
            let left = heat.unitsPerCraft;
            for (const [k, row] of Object.entries(inventory)) if (row.item.id === heat.fuelId && left > 0) {const n = Math.min(left, row.count); take(k, n); left -= n;}
            if (action === 'heat') work.treatment = {...work.treatment, stage: 'heated', at: clock};
            else work.treatment = {stage: 'tempered', at: clock, hardness: 1.05, toughness: 1.1 + .1 * control};
            summary = action === 'heat' ? `Heat the metal; work or quench within ${law.hotMinutes} played minutes. Fuel is spent now.` : 'Temper the quenched metal: less hardness, more toughness. Fuel is spent now.';
        } else {
            if (!hot) return block('Heat the metal first; this workpiece has cooled or already settled.');
            if (action === 'shape') {
                if (work.treatment.stage === 'shaped') return block('This hot workpiece has already been shaped.');
                work.treatment = {...work.treatment, stage: 'shaped', toughness: 1 + .1 * control};
                summary = 'Work the hot metal; maker control limits the retained toughness.';
            } else {
                if (chosen?.id !== 'Lamp oil') return block('Select carried Lamp oil as the modeled quench medium.');
                take(request.material);
                work.treatment = {stage: 'quenched', at: clock, hardness: 1.15 + .05 * control, toughness: .8 + .1 * control};
                summary = 'Oil quench: the shell hardens and becomes more brittle. Oil is consumed.';
            }
        }
    } else if (action === 'finish' || action === 'refit') {
        const axis = action === 'finish' ? 'finish' : 'fit', target = round(.25 + .75 * control);
        if (work[axis] >= target) return block('This maker and station cannot improve the existing work.');
        work[axis] = target;
        summary = action === 'finish' ? 'Finish the surface to reduce material wear.' : 'Refit the handling for more precise attacks; no body or armor truth changes.';
    } else if (action === 'hone') {
        if (uses - work.honedAt < law.honingUses) return block(`Use this item meaningfully ${law.honingUses - (uses - work.honedAt)} more times before improving it.`);
        const ceiling = Math.min(250, 100 + skill * 3 + maker.station * 5);
        if (nextQuality >= ceiling) return block('This maker and station cannot improve its current quality.');
        nextQuality = Math.min(ceiling, nextQuality + 1 + Math.floor(control * 2)); work.honedAt = uses;
        summary = `Improve learned handling from ${item.quality}% to ${nextQuality}% quality using ${law.honingUses} or more new uses.`;
    } else if (action === 'swap') {
        const oldId = item.components[request.slot], old = templates[oldId];
        if (!old || !chosen?.tags.component || chosenTemplate?.component_type !== old.component_type || !properties) return block('Choose a carried replacement with the same physical component role.');
        take(request.material);
        // Replaced material is recovered degraded, so repeated swaps cannot
        // manufacture valuable full-grade stock from a worn assembly.
        const oldKey = JSON.stringify({id: oldId, quality: Math.max(1, Math.floor((item.quality || 100) * condition / 100 * law.salvageShare))});
        give(oldKey); key.components = {...key.components, [request.slot]: chosen.id};
        nextQuality = Math.round((item.quality * (parts.length - 1) + (chosen.quality ?? 100)) / parts.length);
        summary = 'Replace the structural component. Identity, condition and provenance stay; the removed part returns at reduced quality.';
    } else if (action === 'repair' || field) {
        if (!maker.durability) return block('Enable equipment durability to track material repairs.');
        if (condition >= cap) return block('This item is already at its best condition.');
        if (!properties || !chosen?.tags.component) return block('Select a carried component as compatible repair material.');
        const same = parts.some(p => p.material_label === chosenTemplate.material_label);
        const compatible = same || parts.some(p => p.material_family === chosenTemplate.material_family);
        if (!compatible) return block('The modeled materials do not form a compatible repair.');
        const efficiency = (field ? law.fieldEfficiency : 1) * (same ? 1 : .5);
        const unit = law.repairUnit * (chosen.quality ?? 100) / 100 * efficiency;
        const units = Math.min(inventory[request.material].count, Math.ceil((cap - condition) / unit));
        if (!units) return block('No compatible repair units are available.');
        take(request.material, units); repair = round(Math.min(cap, condition + units * unit));
        summary = `Restore condition ${round(condition)} → ${repair}/${cap}; ${same ? 'matching material' : 'compatible substitute at half efficiency'}${field ? ', field efficiency' : ''}.`;
    } else if (action === 'salvage') {
        for (const id of Object.values(item.components)) give(JSON.stringify({id, quality: Math.max(1, Math.floor((item.quality || 100) * condition / 100 * law.salvageShare))}));
        for (const p of Object.values(work.roles)) give(p.key);
        destroyed = true; summary = 'Dismantle this item. Structural parts lose quality; removable fittings return. The assembled item is consumed.';
    }
    for (const [k, count] of costs) if ((inventory[k]?.count || 0) < count + (k === request.key ? 1 : 0)) return block('The quoted input stock is no longer available.');
    work.history.push({action, maker: maker.id, location: maker.location, at: clock});
    key.quality = nextQuality; key.gearwork = work;
    q.spend = [{key: request.key, count: 1}, ...[...costs].map(([key, count]) => ({key, count}))];
    q.receive = [...returns].map(([key, count]) => ({key, count}));
    if (!destroyed) q.receive.unshift({key: JSON.stringify(key), count: 1});
    return {...q, eligible: true, summary, repair, destroyed, condition, uses, lawRevision: law.revision, reforge: action === 'reforge', maker: structuredClone(maker), clock};
}
