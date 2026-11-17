// PS306 (2026-11-16): the Journal says what this life is about first. Quest lists are grouped by life and world; the current
// life's lists stay where the Journal draws them, and every earlier life's sit under one fold. A list names its world with
// data-quest-world; a list that does not (the native quests and the sibling cards) is the home Village life's.
// Default: the current life leads and earlier lives fold. Dial: the fold is a plain <details>, so the player opens it; nothing is stored.
// Reason: a life that crossed from the village should open on its own page, not on the village's "Lost memory".
// Display side only: the lists keep their nodes and their own sorting (display.js), this module only places them.
import {kitElement} from './kit.js';
export const HOME_WORLD = 'base.frontier';
const WORLD_NAMES = Object.freeze({'base.frontier': 'Village'});
export const LIST_SELECTOR = '#quest_list, #expansion_quest_list, [data-quest-world]';

/** Pure: split lists ({world?}) into this life's and earlier lives'. A list with no world is the home life's. */
export function splitLives(lists, currentWorld, home = HOME_WORLD) {
    const current = [], earlier = [];
    for (const list of lists) ((list.world || home) === (currentWorld || home) ? current : earlier).push(list);
    return {current, earlier};
}

/** Pure: what the box shows. lists: [{world?, cards}]. fold: earlier lives' quests sit under one fold; note: this life has none of its own. */
export function planLives(lists, currentWorld, home = HOME_WORLD) {
    const {current, earlier} = splitLives(lists, currentWorld, home), count = group => group.reduce((sum, l) => sum + (l.cards || 0), 0);
    const earlierCount = count(earlier), currentCount = count(current);
    if (!earlierCount || !currentWorld) return {fold: false, earlierCount: 0, note: false};
    return {fold: true, earlierCount, note: !currentCount};
}

const cards = list => [...list.querySelectorAll('.quest_div')].filter(n => !n.hidden).length;
const worldOf = list => list.dataset?.questWorld || HOME_WORLD;

/** Place the Quests box's lists for the current world. Idempotent; call it on every refresh. */
export function placeLives(box, currentWorld) {
    if (!box) return;
    let fold = box.querySelector(':scope > details.journal-earlier'), note = box.querySelector(':scope > [data-journal-note]');
    const lists = [...box.querySelectorAll(LIST_SELECTOR)].map(node => ({node, world: worldOf(node)}));
    const {current, earlier} = splitLives(lists, currentWorld), plan = planLives(lists.map(l => ({world: l.world, cards: cards(l.node)})), currentWorld), earlierCount = plan.earlierCount;
    if (!plan.fold) { // nothing to fold (the home life, or no earlier quests): put every list back as the Journal drew it
        if (fold) { for (const node of [...fold.querySelector('.journal-earlier-body').children]) box.insertBefore(node, fold); fold.remove(); }
        note?.remove(); return;
    }
    if (!fold) {
        fold = kitElement('details', 'journal-earlier');
        fold.append(kitElement('summary'), kitElement('div', 'journal-earlier-body'));
        const last = box.querySelector(':scope > #quest_hiding_div');
        last ? box.insertBefore(fold, last) : box.append(fold);
    }
    const body = fold.querySelector('.journal-earlier-body');
    for (const l of earlier) if (l.node.parentNode !== body) body.append(l.node);
    for (const l of current) if (l.node.parentNode === body) box.insertBefore(l.node, fold);
    const summary = fold.querySelector('summary'), label = `Earlier lives · ${earlierCount} ${earlierCount === 1 ? 'quest' : 'quests'}`;
    if (summary.textContent !== label) summary.textContent = label; // an identical write would still be a mutation the observer sees
    fold.title = [...new Set(earlier.map(l => WORLD_NAMES[l.world]).filter(Boolean))].join(', ');
    // This life has no quests of its own yet: say so once, so the page does not open on another life's list.
    if (plan.note) {
        if (!note) { note = kitElement('p', 'journal-note', 'Nothing begun in this life yet.'); note.dataset.journalNote = 'true'; }
        if (note.nextSibling !== fold || note.parentNode !== box) box.insertBefore(note, fold);
    } else note?.remove();
}
