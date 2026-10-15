// LP5 original proposal. Availability projects existing calendar and bench work;
// the optional chapter fact neither owns a clock nor grants rewards.
import {recurringWindow} from './world_rhythm.js';
import {routeUnderstanding, TEACHER_WINDOW} from './everyday_life.js';

export function teacherWindow(state, facts) {
    const window = recurringWindow(TEACHER_WINDOW, facts.calendarMinute);
    const craftsman = state.actors.oldCraftsman?.facts || {};
    const order = craftsman['work.order'] || craftsman['field.partsOrder'];
    const busy = facts['village.craftsmanBusy'];
    const available = window.open && facts['village.craftsmanPresent'] && !busy && !facts['village.craftsmanIrritated'];
    const cause = order ? 'Commission override: the craftsman is finishing a supplied bench order. Teaching returns when the work ends, during daily hours.'
        : busy ? 'The craftsman is occupied. Teaching returns when his present work ends, during daily hours.'
        : !facts['village.craftsmanPresent'] ? 'The craftsman is away.'
        : facts['village.craftsmanIrritated'] ? 'He needs quiet after the interruption.' : '';
    const learned = routeUnderstanding(state, facts['village.notesRead']);
    const unfinished = [];
    if(facts['village.notesHeld'] && !facts['village.notesRead']) unfinished.push('read your route booklet');
    if(state.campaign.facts.anchor && learned.known && !state.actors.player.facts.surveyed) unfinished.push('survey the known dry-bank path');
    return {window, available, cause, learned,
        phase: state.actors.player.facts['village.waypostChapterClosed'] ? 'Account recorded' : 'Following the waypost',
        preview: unfinished.length ? `Known unfinished opportunities: ${unfinished.join('; ')}. All remain available.` : 'No known unfinished waypost opportunities.',
        text: `Daily teaching: 08:00–18:00 · ${window.open ? `open for ${window.remaining} more game minutes` : window.reason} ${cause || (available ? 'The craftsman can take questions.' : '')}`};
}
