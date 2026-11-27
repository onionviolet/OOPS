// Verified dormant uncompiled HP registration from the original Ryan test
// Export -> the installed canonical HP cast. No active HP identity migration.
import {declareRegistrationPredecessor} from './pack_registration_predecessors.js';
const P = 'book.hp.lead', id = n => `${P}.${n}`;
const baseLocations = ['cupboard', 'kitchen', 'hall', 'dormitory', 'school_hall'].map(id);
const baseItems = ['dried_nettles', 'snake_fangs', 'horned_slugs', 'porcupine_quills',
    'cure_boils_flask', 'corrosive_flask', 'practice_feather'].map(n => id(`item.${n}`));
export const HP_DORMANT_PREDECESSOR = {
    packId: P,
    contentHash: 'sha256:f9cfc3e531af70cd0cab095801b536ac60d52f4bdb0369dddcdce623d4760d5d',
    from: {worldId: id('world'), locationIds: baseLocations, itemIds: baseItems},
    to: {worldId: id('world'), locationIds: [...baseLocations,
        ...['car', 'zoo', 'reptile_house', 'director_office', 'street', 'living_room', 'second_bedroom',
            'hotel', 'hut', 'hut_back_room', 'boat', 'harbour', 'train', 'cauldron', 'courtyard', 'alley',
            'bank', 'vaults', 'malkin', 'ollivander', 'paddington', 'homebound', 'w6.classroom',
            'w6.dungeon', 'w6.cabin'].map(id)],
    itemIds: [...baseItems, id('w4_wand'), id('w4_wand_pieces')]},
};
declareRegistrationPredecessor(HP_DORMANT_PREDECESSOR);
