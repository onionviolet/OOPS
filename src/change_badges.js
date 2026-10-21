// GU8: "what changed since you looked". A count on a navigation route (or a More-panels entry) of
// the rows that have appeared in its panel since the player last saw that panel. It is a count of
// new rows only, never a pop-up or a sound, and it clears the moment the panel is on screen or its
// route is opened. The first reading after a page loads is the baseline, so reloading never flags
// everything. The counts live in the page only; nothing is saved.
//
// A counter reads the keys of the rows its panel holds (null while its source is not ready) and says
// whether the panel is showing now.
const counters = new Map();

export function registerChangeCounter(id, {read, showing = () => false}) {
    counters.set(id, {read, showing, seen: null, count: 0});
}

// Pure: how many keys are new against what was seen.
export const newKeys = (keys, seen) => keys.filter(key => !seen.has(key)).length;

// The first readings after the start screen closes are the baseline, not news: a loaded save
// restores its rows then. A counter whose source is not ready yet reads null and is skipped.
const SETTLE_MS = 2500;
let settleUntil = 0;
const running = () => document.documentElement.dataset.startScreen === 'closed';

export function pollBadges(now = performance.now()) {
    let changed = false;
    if (!running()) settleUntil = now + SETTLE_MS;
    const baseline = now < settleUntil;
    for (const counter of counters.values()) {
        let keys = []; try { keys = counter.read(); } catch { keys = null; }
        if (keys === null || keys === undefined) continue;
        if (baseline || counter.seen === null || counter.showing()) { counter.seen = new Set(keys); if (counter.count) { counter.count = 0; changed = true; } continue; }
        const count = newKeys(keys, counter.seen);
        if (count !== counter.count) { counter.count = count; changed = true; }
    }
    return changed;
}
export const badgeCount = id => counters.get(id)?.count || 0;
export function markSeen(id) {
    const counter = counters.get(id); if (!counter) return;
    try { counter.seen = new Set(counter.read() || []); } catch { counter.seen = new Set(); }
    counter.count = 0;
}

// Show `count` on a button without changing its label text: the number is drawn by CSS from
// data-new-count, so it never enters textContent (the overflow list copies labels), and the
// accessible name says how many are new.
export function paintBadge(button, count, label) {
    if (!count) {
        if (button.dataset.newCount) delete button.dataset.newCount;
        if (button.dataset.badgeLabel) { button.removeAttribute('aria-label'); delete button.dataset.badgeLabel; }
        return;
    }
    if (button.dataset.newCount !== String(count)) button.dataset.newCount = String(count);
    const name = `${label}, ${count} new`;
    if (button.dataset.badgeLabel !== name) { button.dataset.badgeLabel = name; button.setAttribute('aria-label', name); }
}

const rows = (id, selector, key) => () => [...document.querySelectorAll(`#${id} > ${selector}`)].map(key);
const showing = id => () => !!document.getElementById(id)?.checkVisibility?.();
const text = node => node.textContent.trim().replace(/\s+/g, ' ').slice(0, 80);

// The Journal's own lists: quests by id, bestiary and books by name.
registerChangeCounter('records:quests', {read: rows('quest_list', '[data-quest_id]', node => node.dataset.quest_id), showing: showing('quest_list')});
registerChangeCounter('records:bestiary', {read: rows('bestiary_list', '*', node => text(node.querySelector('.bestiary_entry_name') || node)), showing: showing('bestiary_list')});
registerChangeCounter('records:books', {read: rows('books_list', '*', node => text(node.querySelector('.book_name') || node)), showing: showing('books_list')});
