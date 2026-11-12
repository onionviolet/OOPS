// D&D world pack for the spell grammar (chat S): maps effect_dsl.js records
// (src/data/srd521, SRD 5.2.1, CC-BY-4.0, attribution travels with each record)
// onto spell grammar parts. effect_dsl stays the inert authoring contract; this
// is its world-pack mapping onto the effect grammar (plan "One effect grammar
// for every world"). Pure: takes validated records, writes nothing.
import {validateEffectRecord} from './effect_dsl.js';

// What a record's function does -> the intent law (world-pack vocabulary map).
// Default: the first listed function decides; later ones become limits.
const DOES_WHAT = Object.freeze({
    area_acid_damage: 'hurt', ranged_fire_damage: 'hurt', area_fire_damage: 'hurt', area_cold_damage: 'hurt',
    automatic_force_darts: 'hurt', emit_bright_and_dim_light: 'light', manipulate_unattended_stock: 'carry',
    increase_ac: 'shield', restore_hit_points: 'heal', sense_magic: 'sense_magic', paralyze_humanoids: 'hold',
    teleport_self: 'travel', remove_one_condition: 'end', suppress_sound: 'muffle',
    interrupt_cast_without_spending_target_slot: 'counter', restore_recently_dead_creature: 'heal',
    end_ongoing_spells: 'end', banish_to_demiplane: 'send', resist_physical_damage: 'shield',
    block_physical_and_ethereal_passage: 'seal',
});
const TARGET = Object.freeze({self: 'self', creature: 'creature', object: 'object', creature_or_object: 'creature',
    creature_object_or_effect: 'effect', point: 'place', area: 'area'});
// Counterspell targets a creature in the act of casting: its object is the working.
const TARGET_OVERRIDE = Object.freeze({counterspell: 'working'});

function execution(effect) {
    if (effect.concentration) return 'concentration';
    if (effect.duration.unit === 'instant') return 'instant';
    return 'timed';
}
const delivery = ({verbal, somatic, materials}) => [verbal && 'verbal', somatic && 'somatic', materials.length && 'material'].filter(Boolean).join('_') || 'none';

// Authored truth per spell from the SRD text (verb object target time [direction]),
// written apart from the mapping above so the canon test can catch a wrong map.
const TRUTH = Object.freeze({
    acid_splash: 'remove vitality area instant', fire_bolt: 'remove vitality creature instant', light: 'add light object timed',
    mage_hand: 'move position place timed along', shield: 'block harm self timed', magic_missile: 'remove vitality creature instant',
    cure_wounds: 'transform vitality creature instant restore', detect_magic: 'sense magic self sustained',
    hold_person: 'bind motion creature sustained', misty_step: 'move position self instant to_place',
    lesser_restoration: 'end effect creature instant', silence: 'block sound area sustained', fireball: 'remove vitality area instant',
    counterspell: 'block magic working instant', revivify: 'transform vitality creature instant restore',
    dispel_magic: 'end effect effect instant', banishment: 'move position creature sustained away',
    stoneskin: 'block harm creature sustained', cone_of_cold: 'remove vitality area instant', wall_of_force: 'remove access place sustained',
});
const truthOf = text => {
    const [verb, object, target, time, direction = null] = text.split(' ');
    return Object.freeze({verb, object, target, time, direction});
};

export const DND_SPELL_WORLD = Object.freeze({world: 'dnd', carrier: 'spell_slot', cost: 'slot', access: 'prepared'});

// records: the SRD spell array. Returns rows in the shape labelSpellRow reads.
export function dndSpellRows(records) {
    records.forEach(validateEffectRecord);
    return records.filter(r => r.kind === 'spell').map(record => {
        const key = record.id.slice('srd521.spell.'.length), effect = record.effects[0];
        const intent = DOES_WHAT[record.function.doesWhat[0]] ?? null;
        return Object.freeze({id: record.id, family: record.spell.school, forms: [record.name], roots: [], intent,
            target: TARGET_OVERRIDE[key] ?? TARGET[effect.target.kind], execution: execution(effect),
            delivery: delivery(effect.components), gesture: effect.components.somatic ? 'somatic' : 'none',
            carrier: 'spell_slot', cost: record.spell.level === 0 ? 'none' : 'slot', access: effect.castingTime.ritual ? 'ritual_or_prepared' : 'prepared',
            locator: `SRD 5.2.1 p${record.source.page}, ${record.source.heading}`, status: record.status,
            limits: record.function.doesWhat.slice(1), truth: TRUTH[key] ? truthOf(TRUTH[key]) : null});
    });
}
