// FRC news, first caller (proposal under AD56): what one Tingen person saw of the lead travels to others along the book's own ties.
// Producer: Dunn's memory of a filed weekly application (the trust tie writes a relationship effect, which the engine turns into a
// `saw` episode). Spreader: gossipStep, once a day, between people in the same place who hold a tie: here the pack's own relation lines
// (Old Neil is office staff under Dunn; Rozanne reports to him), read-only, so no edge is written for a tie the player never touched.
// Consumers: the audience's mood toward the lead (the reader tie offers gate on, MND5) and an observer-safe reputation row ("has heard").
// Sealed truths never enter: the only topics are things the lead did in front of someone.
import {registerNewsWorld, newsReports, newsMoodRows} from './news_reach.js';
import {registerMemoryTopic, registerTopicPhrase} from './person_memory_effects.js';
import {registerReputationSource} from './reputation_view.js';
import {domainRegistry} from './domain_registry.js';
import {getPrivateLotmCast} from './book_world_lotm_cast_days.js';
import {castKnown} from './book_world_lotm_cast_host.js';
import {current_game_time} from './game_time.js';
import {calendarMinutes} from './world_rhythm.js';
import {LOTM_IDS as I} from './book_world_lotm_ids.js';

// Topics Tingen people can tell about the lead. Phrase voice: second person, as the listener would repeat it.
registerMemoryTopic({causePrefix: 'book.lotm.expense_claim.dunn', topic: 'filed_on_time', phrase: 'you hand in your weekly expense application on time'});
// Drift (KNW18): a careful habit retold by someone who did not see it can come out as eagerness to please. Default: one telling in
// five bends it, and the bent account is cooler (feeling halved and turned). Dial: chance and feeling below. Reason: a small team
// watches who stands close to the captain; the account changes, the event does not (KNW11: a wrong belief, never a wrong truth).
registerTopicPhrase('currying_favour', 'you are angling for the captain\'s good opinion');
export const TINGEN_NEWS_DRIFT = Object.freeze({filed_on_time: Object.freeze({to: 'currying_favour', chance: 0.2, feeling: -0.5})});

const leadActor = () => getPrivateLotmCast()?.leadLife?.actorId || null;
const nameOf = id => getPrivateLotmCast()?.people?.find(p => p.id === id)?.name || 'someone';
// The pack's relation lines between two people who both have a body in this life (KNW5: an NPC knows through their own memories;
// a tie is the channel). The lead's own lines are left out: the lead is the subject, never a listener for news about themself.
// Two people with no placed whereabouts share the same placeholder, which is not a meeting.
const UNPLACED = 'Whereabouts unplaced';
const placed = person => !!person && person.location !== UNPLACED;
export function tingenNewsTies(state) {
    const pack = getPrivateLotmCast(), people = state?.simulation?.people || {}, lead = leadActor(), out = [];
    for(const p of pack?.people || []) {
        if(!placed(people[p.id]) || p.id === lead) continue;
        for(const r of p.relations || []) if(r?.withId && r.withId !== lead && r.withId !== p.id && placed(people[r.withId])) out.push({holder: p.id, other: r.withId, kind: r.kind || 'tie'});
    }
    return out;
}
export const TINGEN_NEWS = registerNewsWorld({worldId: I.world, ties: tingenNewsTies, nameOf, drift: TINGEN_NEWS_DRIFT,
    // Tingen's telling numbers (dial). Default loss 15 (a church team reports carefully) and hearsay trust 90 (Nighthawks are taught to
    // doubt what they did not see). Reason: the city's people are ordinary gossips; this team is not, and the numbers are its manner.
    limits: {id: 'memory.lotm.tingen', revision: 1, tellingLoss: 15, hearsayTrust: 90},
    reaction: {magnitude: 4, days: 7}});

// Acquainted: the lead knows them (cast known or met), or holds something they said (a note attributed to them). Earned lives reach
// people like Old Neil through scene notes long before any known-key is written, so this is the read for news, mood and tie rows.
export function castAcquainted(state, personId) {
    if(castKnown(state, personId)) return true;
    for(const note of Object.values(state?.simulation?.knowledge?.player || {})) if(note?.basis?.attributedTo === personId) return true;
    return false;
}
// The memory store's day is the native calendar day (domain_registry memoryDay); read it the same way here.
export function newsDay() { try { return Math.floor(calendarMinutes(current_game_time) / 1440); } catch { return null; } }
const memoryNow = () => { try { return domainRegistry.command('memory', 'read')?.() || null; } catch { return null; } };

// Mood rows for one Tingen person: what reached them this week. Folded into the tie mood reader (book_world_lotm_colleagues.js).
export function tingenNewsMood(state, personId) {
    const day = newsDay(), memory = memoryNow();
    if(day == null || !memory || !castAcquainted(state, personId)) return [];
    return newsMoodRows({memory, holder: personId, day, worldId: I.world});
}

// Reputation: for each person the lead has met and is with now, what they have heard (STN3: standing is an audience's account). Shown beside
// what the lead has seen; the line names the teller and the account, never a number (KNW22).
registerReputationSource({id: `${I.world}.news`, worldId: I.world, owner: 'memory',
    read: (state, {viewerId, subjectId}) => {
        if(viewerId !== 'player' || subjectId !== 'player') return [];
        const day = newsDay(), memory = memoryNow();
        if(day == null || !memory) return [];
        // KNW6: the lead learns what someone heard only from them, so a row shows while that person is where the lead is.
        const people = state?.simulation?.people || {}, here = people.player?.location;
        const audiences = Object.keys(people).filter(id => id !== 'player' && people[id].life === 'alive' && people[id].location === here && castAcquainted(state, id)).sort();
        return newsReports({memory, worldId: I.world, day, audiences});
    }});
