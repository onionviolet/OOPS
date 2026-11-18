// Story effects domain (PWC129, AR1, AR2, AR3): the save slice and the tick for effect-carrying cards (story_effect_cards.js).
// The director chooses; this owner lands. Once per window the clock passes, every effect card the director surfaced is landed through
// `landEffect` on the household engine world kept here, then the Reports line and the lead's mood thought follow from what the world
// did (FLR4: the thought is a reader, moodThoughts). Landing is on the tick, never on a render (a feed read must not re-land), and the
// cursor is saved with the world, so a reload replays nothing already landed and an unsaved window replays to the same result.
// Tingen is the first world (FND5, second world named gap: the Gu annex's care director has candidates from the simulation, not a deck).
// Debug view only: `domainRegistry.project('storyEffects')` lists the source row id of each landed card; no panel shows it.
import {registerDomain} from './domain_registry.js';
import {readPort} from './ui_ports.js';
import {addMoodThought} from './mood_thoughts_domain.js';
import {deliverWindows, freshStoryEffects, validateStoryEffects} from './story_effect_cards.js';
import {CARD_BY_ID, tingenDirected, tingenSlot} from './book_world_lotm_deck.js';
import {LOTM_IDS} from './book_world_lotm_ids.js';

const HOLDER = 'player', DAY = 1440;
let saved = freshStoryEffects(), ports = null;
export const configureStoryEffects = operations => { ports = operations; };

const inTingen = state => state?.actors?.player?.worldId === LOTM_IDS.world && Number.isFinite(state.lotm?.initializedAt) && Number.isFinite(state.clock);
function sync() {
    const state = readPort('expansion');
    if(!inTingen(state)) return;
    const upto = tingenSlot(state);
    if(saved.through === upto) return;
    const directed = saved.through === null ? [] : tingenDirected(state);
    const {record, landed} = deliverWindows(saved, directed, CARD_BY_ID, upto);
    saved = record;
    for(const row of landed) {
        if(row.line) ports?.logMessage?.(row.line, 'notification');
        if(row.thought) addMoodThought({holder: HOLDER, subject: 'household', source: row.card, key: `${row.card}@${row.window}`, ...row.thought, minutes: DAY}, Math.max(0, Math.round(state.clock)));
    }
}
const view = () => ({through: saved.through, landed: saved.log.map(r => ({...r}))});
registerDomain({id: 'storyEffects', deps: ['moodThoughts'], initialState: freshStoryEffects,
    save: () => saved.through === null ? undefined : structuredClone(saved),
    validate: slice => { validateStoryEffects(slice); },
    load: slice => { saved = slice ? structuredClone(validateStoryEffects(slice)) : freshStoryEffects(); },
    tick: minutes => { if(minutes > 0) try { sync(); } catch { /* retried next tick */ } },
    projection: view});
