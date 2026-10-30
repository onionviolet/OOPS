// COV6 / UR73: one place that gives each shared panel its player word and its group in the All panels
// list. The header, the list and the card all read the registered title, so they cannot drift apart.
// World panels name nothing here (AD46): they pass `group` when they register, or take their role's group.
export const PANEL_GROUPS = Object.freeze(['Me', 'Things', 'Records', 'World', 'Game']);

const [ME, THINGS, RECORDS, WORLD, GAME] = PANEL_GROUPS;
const DIRECTORY = Object.freeze({
    vitals: ['Vitals', ME], preparation: ['Stats', ME], 'shell-character': ['Stats and equipment', ME],
    condition: ['Condition', ME], research: ['Study', ME], inherited_traits: ['Family qualities', ME],
    'cultivation-insights': ['Cultivation insights', ME], projects: ['Projects', ME],
    belongings: ['Inventory', THINGS], 'combat-controls': ['Inventory view options', THINGS], 'shell-inventory-tools': ['Inventory tools', THINGS],
    'shell-detail': ['Item details', THINGS], 'equipment-comparison': ['Equipment comparison', THINGS], tools: ['Tools', THINGS],
    'gear-workshop': ['Gear workshop', THINGS],
    'personal-journal': ['Journal', RECORDS], 'story-insight': ['Stories and history', RECORDS], pledges: ['Vows and trials', RECORDS],
    'known-things': ['Known things', RECORDS], naming: ['Names and achievements', RECORDS], lives_carry: ['Past lives', RECORDS],
    beginning: ['Your beginning', RECORDS], notebook: ['Notebook', RECORDS], 'quest-board': ['Leads', RECORDS],
    memories: ['Remembered years', RECORDS], messages: ['Reports', RECORDS], ledger: ['Ledger', RECORDS],
    homes: ['Homes', WORLD], 'home-overview': ['Home at a glance', WORLD], economy_standing: ['Trade standing', WORLD],
    fields: ['Spills and smoke', WORLD], 'region-view': ['Where I am', WORLD],
    'optional-worlds': ['Other worlds', WORLD], 'village-travelers': ['Travelers', WORLD], 'village-neighbors': ['Neighbors', WORLD],
    time: ['Time & weather', WORLD], location: ['Current location', WORLD], 'local-actions': ['Local actions', WORLD],
    focus: ['Focus', WORLD], 'village-scene': ['Scene', WORLD],
    'current-work': ['Current work & saving', GAME], continuation: ['Continuing connection', GAME], customization: ['Appearance', GAME],
    'customization-effects': ['Effects & sound', GAME], 'customization-rules': ['Your own rules', GAME],
    'customization-preview': ['Preview of your changes', GAME], 'customization-sites': ['Your own places', GAME],
});
const ROLE_GROUP = Object.freeze({character: ME, records: RECORDS, actions: WORLD, optional: GAME, log: RECORDS});

// The blocker a greyed row names when the panel gives none of its own (UIV1).
const REASONS = Object.freeze({
    homes: 'Village only', 'home-overview': 'Village only', 'drainage-site': 'Village only',
    'optional-worlds': 'No optional world installed', ledger: 'Nothing owed or recorded yet',
    'shell-detail': 'Pick an item first', 'village-travelers': 'Village only', 'village-neighbors': 'Village only', 'cultivation-insights': 'Needs finished work in your home world',
});

export function panelListing(id, {title, group, role} = {}) {
    const known = DIRECTORY[id];
    return {title: known?.[0] || title, group: PANEL_GROUPS.includes(group) ? group : known?.[1] || ROLE_GROUP[role] || WORLD, reason: REASONS[id] || ''};
}
