// RPX11 projection: live state to the observer's relationship-web inputs. Who is known comes only
// from knownPeopleView (PIR23); what is shown comes only from the observer's own records (PIR5):
// agreements it made, shared history, its own directed axes, and a manner it can read face to face.
// Never read: anyone's axes toward the observer, their memory episodes, or where absent people are.
import {knownPeopleView} from './people_knowledge.js';
import {observerView} from './observer_view.js';
import {reactionLine} from './person_memory_effects.js';
import {relationshipWebSpec} from './ui/relationship_web.js';

// Agreements the observer made, read from their structured flags (not from card text). Rows are data;
// a world adds its own obligations here. ties: the observer's chronicle ties with that person.
const OBLIGATIONS = [
    {person: 'oldCraftsman', by: 'them', label: 'a commissioned kit', open: o => !!o.facts()['sim.commissioned'], settled: o => o.completed('village.collect')},
    {person: 'town.surveyClerk', by: 'you', label: 'a road check or timber', open: o => !!o.facts()['town.briefed'], settled: o => !!o.facts()['town.settled']},
    {person: 'villageElder', by: 'you', label: 'the archive promise', open: (o, ties) => !!ties.archiveDuty, settled: (o, ties) => !!ties.dutyKept},
    {person: 'villageElder', by: 'you', label: 'amends for your assault', strained: true, open: (o, ties) => !!ties.grievance, settled: () => false},
];

// Loans the observer is party to (simulation custody): a returned loan is deleted by its owner, so
// every row here is still open. The item name comes from the custody key, never the holder's inventory.
const itemName = key => { try { return JSON.parse(key).id || 'a borrowed item'; } catch { return 'a borrowed item'; } };
function loans(sim, me, personId) {
    return Object.values(sim?.custody || {}).filter(l => (l.owner === me && l.holder === personId) || (l.holder === me && l.owner === personId))
        .map(l => ({by: l.holder === me ? 'you' : 'them', label: `return ${l.count > 1 ? `${l.count} × ` : ''}${itemName(l.key)}`, settled: false, strained: false}));
}

// Own reads only: the observer's directed axes, and chronicle ties when the chronicle is the observer's
// life. Read in place rather than through relationshipView, whose save validator would make one odd
// record elsewhere in a cast life stop the whole People panel.
const own = (record, id) => record && Object.hasOwn(record, id) ? record[id] : undefined;

/** memory: the person-memory slice (optional); facts: the native context facts (location, calendarMinute);
 *  rows: knownPeopleView rows the caller already has (the People panel passes its own, so it is read once). */
export function relationshipWebPeople(state, facts = {}, {memory, rows} = {}) {
    const observer = observerView(state), me = observer.actorId, sim = state.simulation;
    const chronicle = me === 'player' ? state.chronicle?.relationships : undefined;
    const day = Number.isSafeInteger(facts.calendarMinute) ? Math.floor(facts.calendarMinute / 1440) : null;
    return (rows || knownPeopleView(state, facts)).map(row => {
        const ties = own(chronicle, row.id)?.ties || {};
        const owes = OBLIGATIONS.filter(o => o.person === row.id && o.open(observer, ties))
            .map(o => ({by: o.by, label: o.label, settled: o.settled(observer, ties), strained: !!o.strained}))
            .concat(loans(sim, me, row.id));
        const person = own(sim?.people, row.id);
        // Same gate as the workshop's visible reaction: alive, in front of you, on a known day.
        const here = !!person && person.life === 'alive' && person.location === facts.location;
        let line = '';
        // A memory row the reader rejects costs only this person's manner edge, never the web.
        if(here && day !== null && memory) try { line = reactionLine({memory, holder: row.id, subject: me, day, root: sim.seed, baseline: own(own(sim.relationships, row.id), me)?.axes}); } catch { line = ''; }
        const trust = own(own(sim?.relationships, me), row.id)?.axes?.trust;
        return {id: row.id, name: row.name, here, owes, saw: row.memories.map(m => m.text.replace(/\.$/, '')),
            ...(line ? {manner: {line, warm: /^(Warmer|More at ease)/.test(line), heard: / after hearing /.test(line)}} : {}),
            ...(Number.isFinite(trust) ? {trust} : {})};
    });
}

export function relationshipWebForState(state, facts = {}, options = {}) {
    return relationshipWebSpec(relationshipWebPeople(state, facts, options), {title: 'Who knows what about you'});
}
