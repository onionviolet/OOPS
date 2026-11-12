// English v1 ch83 P045: worn amulets have limited effect against misfortune
// and their spirituality wanes. The d20 modifier and calendar conversion
// are original, adjustable dials for ordinary avoidable incidents.
import {resolveCheck} from './check_resolver.js';
import {readItemKey} from './inventory_key.js';
import {boundAmuletMinute, isTingenAmulet, replayCompletedAmulet, REWORKED_AMULET_ID, REWORKED_AMULET_NOTE, TINGEN_AMULET_ID, TRIAL_AMULET_NOTE} from './lotm_amulet_crafting.js';
import {LOTM_IDS} from './book_world_lotm_ids.js';

const PROFILE = Object.freeze({id: 'lotm.ordinary-mishap', revision: 1, family: 'sum_target', dice: {count: 1, sides: 20}});
const ORDINARY_LIFE = 365 * 1440;
const OFFICE = 'lotm.place.cast-0785d86b800a41be64ed';
const CAST_SITUATION = 'book.lotm.tingen.canon_beside';
const PARCEL = Object.freeze({kind:'ordinary-avoidable', id:'book.lotm.blackthorn-rolling-parcel', target:11});

function protection(state, equipment) {
    const key = equipment?.player?.amulet, id = readItemKey(key)?.id;
    if (state.actors?.player?.worldId !== LOTM_IDS.world || !isTingenAmulet(id)) return 0;
    // The two authored pieces share a carrier key. Use the oldest observed
    // completion while the copies remain interchangeable, never a newer
    // creation date assigned on equip, gifting, transfer or reload.
    const at = boundAmuletMinute(key) ?? (id === TINGEN_AMULET_ID
        ? replayCompletedAmulet(state, 'book.lotm.kj3ap.carve-first')?.completedAt
        : state.simulation?.knowledge?.player?.[id === REWORKED_AMULET_ID ? REWORKED_AMULET_NOTE : TRIAL_AMULET_NOTE]?.at);
    if (!Number.isSafeInteger(at) || at < 0 || at > state.clock) return 0;
    const age = state.clock - at;
    if (age >= ORDINARY_LIFE) return 0;
    return Math.ceil(2 * (ORDINARY_LIFE - age) / ORDINARY_LIFE);
}

// The hazard owner supplies a stable incident ID/address and commits the
// resulting consequence and receipt. Inspection does not roll or spend.
export function resolveTingenMishap({state, equipment, incident, drawAddress}) {
    if (incident.kind !== 'ordinary-avoidable' || drawAddress.worldId !== LOTM_IDS.world
        || drawAddress.eventId !== incident.id || drawAddress.gameTime !== state.clock) {
        throw Error('Use the local address of an ordinary avoidable incident.');
    }
    const bonus = protection(state, equipment);
    const modifiers = bonus ? [{id: 'worn-silver-amulet', kind: 'bonus',
        value: bonus, reason: 'The worn silver amulet weakly helps avoid misfortune.'}] : [];
    return resolveCheck(PROFILE, {id: incident.id, target: incident.target, modifiers}, drawAddress);
}

// A handcart loses a parcel just as the player steps out of Blackthorn.
// This authored incident occupies one departure after the first carving.
export function blackthornDepartureMishap(state, equipment) {
    const person = state.simulation?.people?.player;
    if (person?.location !== OFFICE || state.actors.player.worldId !== LOTM_IDS.world
        || !state.simulation.situations?.[CAST_SITUATION]
        || !state.actors.player.completed?.['book.lotm.kj3ap.carve-first']
        || state.simulation.knowledge?.player?.[PARCEL.id]) return null;
    const {result, receipt} = resolveTingenMishap({state, equipment, incident:PARCEL,
        drawAddress:{root:state.rng, worldId:LOTM_IDS.world, lifeId:person.body?.id ?? 'player',
            gameTime:state.clock, eventId:PARCEL.id}});
    const value = result.success
        ? result.raw < PARCEL.target
            ? 'Your silver amulet feels briefly warm as you sidestep a parcel rolling off a handcart.'
            : 'You sidestep a parcel rolling off a handcart.'
        : 'A parcel rolls off a handcart. You spend some breath catching your footing.';
    return {receipt, value, effects:[
        ...(!result.success ? [{type:'vital', actor:'player', key:'stamina', amount:-2}] : []),
        {type:'knowledge', actor:'player', key:PARCEL.id, stage:'seen', value,
            basis:{kind:'observation', attributedTo:'player', situationId:CAST_SITUATION}}
    ]};
}

export function tingenMishapRecords(state) {
    const note = state.simulation?.knowledge?.player?.[PARCEL.id];
    return note ? [{id:PARCEL.id, at:note.at, text:note.value}] : [];
}
