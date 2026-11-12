// PC95, WSC19: observations are evidence about a place and channel. A
// subject id stays in the pack's state so a lost contact can be removed
// without disclosing who or how many were sensed to the observer.
import {WORLD_PROPERTIES as P} from '../world_quantities.js';

export const PRESENCE_PACK = 'n.presence';
const known = {id: 'sensed-presence', type: 'set'};
const heard = ['effect.sense.information', 'effect.conceal.information'];

export function createPresencePack() {
    return {
        id: PRESENCE_PACK, revision: 0, hears: heard, properties: [P.concealed, P.senses, known],
        writes: [known.id],
        reactors: [{
            id: 'contact', on: [...heard, 'departed', 'arrived'], appliesTo: holder => holder.kind === 'body',
            react(view, observer, event) {
                const {target, channel, presence} = event.detail ?? {};
                const sensing = event.kind === heard[0];
                const departing = event.kind === 'departed';
                const arriving = event.kind === 'arrived';
                if (arriving && observer !== event.by) return [];
                if (!departing && !arriving && (!presence || typeof target !== 'string' || !channel)) return [];
                if (sensing && (observer !== event.by || target === observer || view.holder(target)?.kind !== 'body')) return [];
                const contacts = view.state(observer)?.contacts ?? [];
                const same = contact => contact.target === target && contact.place === event.place && contact.channel === channel;
                const next = sensing
                    ? contacts.some(same) ? contacts : [...contacts, {target, place: event.place, channel}]
                    : contacts.filter(contact => departing || arriving
                        ? observer !== event.by && contact.target !== event.by
                        : !same(contact));
                if (next === contacts || !sensing && next.length === contacts.length) return [];
                return [
                    {op: 'state', holder: observer, value: {contacts: next}},
                    {op: 'property', holder: observer, property: known.id,
                        value: [...new Set(next.map(contact => `${contact.place}:${contact.channel}`))]},
                ];
            },
        }],
    };
}
