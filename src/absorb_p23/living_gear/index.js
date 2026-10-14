// Original proposals inspired by Proto23 R12/R33/N10. No foreign code/assets.
// Native custody, played clock, combat settlement and save publication stay host-owned.
import {is_night} from '../../game_time.js';

export const LIVING_GEAR = Object.freeze({
    aura: 'Wayfarer dial', collector: 'Cinder keeper ring',
    blade: 'Tempered memory blade', weapon: 'Road memory knife',
});
const record = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const natural = n => Number.isSafeInteger(n) && n >= 0;
const check = (ok, why) => { if (!ok) throw new Error(why); };
const kindOf = item => item?.equip_slot === 'weapon' && item.components?.head === LIVING_GEAR.blade
    ? 'weapon' : item?.equip_slot === 'ring' && item.id === LIVING_GEAR.collector
        ? 'collector' : item?.equip_slot === 'amulet' && item.id === LIVING_GEAR.aura ? 'aura' : null;
function copyKey(key) {
    check(typeof key === 'string', 'Living gear needs a native key.');
    const data = JSON.parse(key);
    check(record(data) && typeof data.e2_instance === 'string' && /^e2\.[1-9]\d*$/.test(data.e2_instance)
        && Number.isSafeInteger(Number(data.e2_instance.slice(3))), 'Living gear needs an E2 copy identity.');
    return data;
}
function keyKind(key) {
    const data = copyKey(key);
    return data.components?.head === LIVING_GEAR.blade ? 'weapon'
        : data.id === LIVING_GEAR.collector ? 'collector' : data.id === LIVING_GEAR.aura ? 'aura' : null;
}
function validate(value) {
    if (value === undefined) return {schema: 1, lastKill: 0, copies: {}};
    check(record(value) && Object.keys(value).sort().join(',') === 'copies,lastKill,schema' && value.schema === 1 && natural(value.lastKill) && record(value.copies), 'Invalid living gear schema/state.');
    const ids = new Set();
    for (const [key, copy] of Object.entries(value.copies)) {
        const data = copyKey(key), kind = keyKind(key);
        check(kind && record(copy) && Object.keys(copy).sort().join(',') === 'kills,kind,reserve' && copy.kind === kind && natural(copy.kills) && natural(copy.reserve)
            && copy.reserve <= 30 && (kind === 'collector' || copy.reserve === 0)
            && (kind === 'weapon' || copy.kills === 0), 'Invalid living gear copy.');
        check(!ids.has(data.e2_instance), 'Duplicate living gear identity.');
        ids.add(data.e2_instance);
    }
    return structuredClone(value);
}

export function registerLivingGearItems({item_templates, Amulet, getItem, WeaponComponent, Weapon}) {
    item_templates[LIVING_GEAR.aura] ||= new Amulet({id: LIVING_GEAR.aura, name: LIVING_GEAR.aura,
        description: 'Equipped: +5% attack power by day; at night, +25 local light. Uses the native night clock.',
        value: 30, stats: {}, use_quality: false});
    item_templates[LIVING_GEAR.collector] ||= getItem({item_type: 'EQUIPPABLE', equip_slot: 'ring', id: LIVING_GEAR.collector, name: LIVING_GEAR.collector,
        description: 'Equipped: stores one cinder per native beast/monster kill, up to 30. Spend 3 to recover up to 5 stamina.',
        value: 40, stats: {}, use_quality: false});
    item_templates[LIVING_GEAR.blade] ||= new WeaponComponent({id: LIVING_GEAR.blade, name: LIVING_GEAR.blade,
        description: 'A blade tempered to remember use.', component_type: 'short blade',
        component_tier: 1, name_prefix: 'Road memory', attack_value: 5, value: 40, component_stats: {}});
    item_templates[LIVING_GEAR.weapon] ||= new Weapon({id: LIVING_GEAR.weapon, name: LIVING_GEAR.weapon,
        components: {head: LIVING_GEAR.blade, handle: 'Simple wooden short handle'}, quality: 100});
    return Object.values(LIVING_GEAR).map(id => item_templates[id]);
}

export function createLivingGear(initial) {
    let state = validate(initial);
    let revision = 0;
    const api = {
        load(value) { const next = validate(value); state = next; revision++; return api; },
        serialize: () => structuredClone(state),
        // Run using staged E2 state before native equipment publication, even when wear is off.
        prepareEquip(item, durability, getItem) {
            return kindOf(item) ? durability.prepareEquip(item, getItem, {requireIdentity: true}) : item;
        },
        // No callbacks attached to items. A recomputation always returns the same result.
        project({equipment, time, assertDisposition}) {
            check(record(equipment) && typeof assertDisposition === 'function', 'Living gear needs custody-filtered equipment.');
            let attackMultiplier = 1, lightBonus = 0;
            for (const [slot, item] of Object.entries(equipment)) {
                const kind = kindOf(item);
                if (!kind || item.equip_slot !== slot) continue;
                const key = item.getInventoryKey();
                copyKey(key); assertDisposition(key);
                if (kind === 'aura') {
                    check(time && Number.isInteger(time.hour) && time.hour >= 0 && time.hour < 24, 'Living aura needs native time.');
                    if (is_night(time)) lightBonus = 25;
                    else attackMultiplier *= 1.05;
                }
                if (kind === 'weapon') attackMultiplier *= 1 + Math.log1p(state.copies[key]?.kills || 0) * 0.01;
            }
            return {attackMultiplier, lightBonus};
        },
        // Sequence is assigned once by P00 to each real native kill. Persist its cursor
        // atomically with enemy/reward settlement. Duplicates never earn a second award.
        stageKill({sequence, killerId, defeated, equipment, assertDisposition}) {
            check(natural(sequence) && sequence > 0 && typeof killerId === 'string'
                && record(defeated) && record(defeated.tags) && record(equipment)
                && typeof assertDisposition === 'function', 'Invalid native living gear kill event.');
            if (sequence <= state.lastKill) return {duplicate: true};
            check(sequence === state.lastKill + 1, 'Living gear kill sequence gap.');
            const next = api.serialize(); next.lastKill = sequence;
            const changed = [];
            if (killerId === 'player' && !defeated.tags.training && !defeated.tags.summoned) {
                const ids = new Set();
                for (const [slot, item] of Object.entries(equipment)) {
                    const kind = kindOf(item);
                    if (!kind || kind === 'aura' || item.equip_slot !== slot) continue;
                    const key = item.getInventoryKey(), data = copyKey(key);
                    check(!ids.has(data.e2_instance), 'Duplicate equipped living gear identity.'); ids.add(data.e2_instance);
                    assertDisposition(key);
                    const copy = next.copies[key] ||= {kind, kills: 0, reserve: 0};
                    check(copy.kind === kind, 'Living gear kind mismatch.');
                    if (kind === 'weapon') { check(copy.kills < Number.MAX_SAFE_INTEGER, 'Living gear growth overflow.'); copy.kills++; }
                    else if (defeated.tags.beast || defeated.tags.monster) copy.reserve = Math.min(30, copy.reserve + 1);
                    changed.push(key);
                }
            }
            return stage(next, {changed, duplicate: false});
        },
        stageSpend({actor, key, assertDisposition}) {
            check(typeof assertDisposition === 'function', 'Living gear spend needs native custody preflight.');
            const item = actor.getEquipment().ring;
            check(kindOf(item) === 'collector' && item.getInventoryKey() === key, 'Equip the selected collector copy first.');
            copyKey(key); assertDisposition(key);
            const copy = state.copies[key];
            check(copy?.kind === 'collector' && copy.reserve >= 3, 'Collect at least 3 cinders first.');
            const stats = actor.getLevelableComponent().stats.full;
            check(Number.isFinite(stats.stamina) && Number.isFinite(stats.max_stamina)
                && stats.stamina >= 0 && stats.max_stamina > stats.stamina, 'No missing native stamina.');
            const recovered = Math.min(5, stats.max_stamina - stats.stamina);
            const next = api.serialize(); next.copies[key].reserve -= 3;
            return stage(next, {key, spent: 3, recovered,
                native: {staminaToFull: stats.max_stamina - stats.stamina - recovered}});
        },
        // Only known owned copies enter UI rows. Raw state is never a disclosure source.
        rows({equipment, isKnown, assertDisposition}) {
            check(typeof isKnown === 'function' && typeof assertDisposition === 'function', 'Living gear rows need discovery and custody.');
            return Object.entries(equipment).flatMap(([slot, item]) => {
                const kind = kindOf(item);
                if (!kind || item.equip_slot !== slot || !isKnown(item)) return [];
                const key = item.getInventoryKey(); copyKey(key); assertDisposition(key);
                return [{key, kind, name: item.getName(), kills: state.copies[key]?.kills || 0,
                    reserve: state.copies[key]?.reserve || 0}];
            });
        },
    };
    function stage(next, receipt) {
        validate(next);
        const expectedRevision = revision;
        let published = false;
        return {...receipt, nativePatch: {p23_living_gear: structuredClone(next)},
            // P00 serializes transactions. Persist nativePatch/native first, then publish.
            preflight() { check(revision === expectedRevision, 'Stale living gear plan.'); },
            publish() {
                if (published) return;
                check(revision === expectedRevision, 'Stale living gear plan.');
                state = structuredClone(next); revision++; published = true;
            }};
    }
    return api;
}
