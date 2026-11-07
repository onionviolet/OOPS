// Which channel each existing row speaks through (FD18, lane G G-K). A mapping table, not a per-row edit: worlds keep their own
// nouns and numbers (AD46); this only says what kind of competence or power a row is. Proposal data (AD32): reversible, no behaviour reads
// it except the plain-words note. Keys: 'skill:<skill_id>' and 'ability:<row key>'. Untagged rows simply have no channel yet.
export const SKILL_CHANNELS = Object.freeze({
    'skill:Perception': ['perceive'], 'skill:Night vision': ['perceive'], 'skill:Presence sensing': ['perceive'], 'skill:Spatial awareness': ['perceive'],
    'skill:Literacy': ['read_text'],
    'skill:Haggling': ['sway'],
    'skill:Medicine': ['heal'],
    'skill:Crafting': ['make'], 'skill:Crafting mastery': ['make'], 'skill:Smelting': ['make'], 'skill:Forging': ['make'], 'skill:Cooking': ['make'],
    'skill:Alchemy': ['make'], 'skill:Woodworking': ['make'],
    'skill:Climbing': ['travel'], 'skill:Running': ['travel'], 'skill:Swimming': ['travel'], 'skill:Scrambling': ['travel']
});
// LOTM Sequence 9 and 8 ability rows (src/book_world_lotm_abilities.js ROWS keys).
export const LOTM_ABILITY_CHANNELS = Object.freeze({
    'ability:cold_ward': ['impose_condition'], 'ability:grave_strength': ['impose_condition'], 'ability:survival_body': ['impose_condition'],
    'ability:storm_balance': ['impose_condition'], 'ability:scale_slick': ['impose_condition'], 'ability:deep_breath': ['impose_condition'],
    'ability:fury_burst': ['impose_condition'],
    'ability:dead_regard': ['perceive'], 'ability:spirit_sight': ['perceive'],
    'ability:full_recall': ['inquire'], 'ability:ruin_lore': ['inquire'],
    'ability:face_hold': ['conceal']
});
