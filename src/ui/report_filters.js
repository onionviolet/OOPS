// Reports filter row (play surface PS193, PS124; upstream's message-log filters, DU15). The foot of Reports carries one
// toggle per kind of line: upstream's Levels / unlocks, Events, Crafting, Combat, Loot and BGM (the native buttons keep
// the state and the CSS variables, so a toggle here presses the native one), then two this game adds: Ready (a line that
// names something ready to do, the ones carrying a "Next:" link) and Story (quest, dialogue and story lines).
// Ready and Story are tags on top of a line's own kind: a line is hidden when any kind it belongs to is off.
// Their on/off lives in this sitting only. Keeping them per life needs a saved key (proposed: message_filters.ready
// and message_filters.story, next to the six upstream keys); until that is decided nothing is written to the save.
import {kitChip, kitElement} from './kit.js';

export const NATIVE_KINDS = Object.freeze(['message_show_unlocks', 'message_show_events', 'message_show_crafting', 'message_show_combat', 'message_show_loot']);
export const NATIVE_LAST = 'message_show_background';
export const TAGS = Object.freeze([
    {id: 'ready', label: 'Ready', title: 'Lines that name something ready to do (the ones with a Next link)'},
    {id: 'story', label: 'Story', title: 'Quest, dialogue and story lines'},
]);
const QUEST_LINE = /^(?:Started a new quest|Finished a quest|Finished a task for a quest|Made some progress in quest)\b/;
const STORY_PANELS = new Set(['records', 'known-people']);

/** Pure: the tags a new line carries besides its kind. Ready is added later, by the Next link (CSS reads it). */
export function reportTags(kind, text, details = {}) {
    const tags = [];
    if (details.story === true || kind === 'dialogue_unlocked' || STORY_PANELS.has(details.panelId) || QUEST_LINE.test(String(text || '').replace(/<[^>]*>/g, ''))) tags.push('story');
    return tags;
}

const state = {ready: true, story: true};
/** Is a tag's filter on (its lines show)? */
export const tagShown = id => state[id] !== false;
/** Turn a tag's filter on or off (a toggle when `on` is omitted). Returns the new state. */
export function setTag(id, on, root = globalThis.document?.documentElement) {
    if (!(id in state)) throw Error(`No report filter named ${id}.`);
    state[id] = on === undefined ? !state[id] : !!on;
    root?.classList.toggle(`report-hide-${id}`, !state[id]);
    return state[id];
}

/** The filter row: one chip per native kind (pressing the native button) and one per tag. `render()` re-reads their state. */
export function mountReportFilters({native = id => globalThis.document.getElementById(id), onChange = () => {}} = {}) {
    const row = kitElement('div', 'report-kinds'); // the chips inside are the kit's
    row.setAttribute('role', 'group'); row.setAttribute('aria-label', 'Report kinds shown'); row.dataset.reportKinds = 'row';
    const chips = new Map();
    const press = (id, run) => { const chip = kitChip({label: '', pressed: true, run}); chip.dataset.reportKind = id; chips.set(id, chip); return chip; };
    for (const id of NATIVE_KINDS) row.append(press(id, () => { native(id)?.click(); render(); onChange(); }));
    for (const t of TAGS) { const chip = press(t.id, () => { setTag(t.id); render(); onChange(); }); chip.title = t.title; row.append(chip); }
    row.append(press(NATIVE_LAST, () => { native(NATIVE_LAST)?.click(); render(); onChange(); }));
    /** Pressed count and the label of each chip, read from the native buttons. Returns how many kinds are on. */
    function render() {
        let on = 0;
        for (const [id, chip] of chips) {
            const tag = TAGS.find(t => t.id === id), source = tag ? null : native(id);
            const pressed = tag ? tagShown(id) : !!source?.classList.contains('active_selection_button');
            const label = tag ? tag.label : (source?.textContent.trim() || id);
            if (pressed) on++;
            if (chip.textContent !== label) chip.textContent = label;
            if (chip.getAttribute('aria-pressed') !== String(pressed)) chip.setAttribute('aria-pressed', String(pressed));
            chip.hidden = !tag && (!source || source.hidden);
        }
        return on;
    }
    return {row, render, chips};
}
