// Gallery fixtures for the organization overview (ORGANIZATIONS.md). Invented names only (CLR3).
// Roles are semantic: rank steps, crew members and holdings, so a later motif pack restyles them.
const ladder = (labels, at) => labels.map((label, i) => ({label, state: i < at ? 'done' : i === at ? 'current' : 'pending', ...(i === at ? {effect: 'glow'} : {})}));
export const FIGURE_FIXTURES_ORGANIZATIONS = [
    {id: 'org-courtyard-standing', size: 720, title: 'Market courtyard: standing ladder', summary: 'A household business is regarded as its owner is. Known Face now, Neighbour next.',
        tracks: [{id: 'standing', label: 'Village standing', steps: ladder(['Distrusted', 'Stranger', 'Known Face', 'Neighbour', 'Trusted', 'Honoured'], 2)}],
        notes: [{text: 'Neighbour asks for 50 standing; you have 12. Doing small jobs for the Village raises it.'}]},
    {id: 'org-gang-crew', size: 720, title: 'The Ash Lane crew: roster by role', summary: 'A gang as the player runs it: a boss, two captains and runners, with turf heat in words.',
        rings: [{id: 'crew', label: 'Crew', radius: .8, count: 5, visible: false}],
        nodes: [{id: 'you', label: 'You', glyph: 'Y', at: 'center', state: 'active', effect: 'glow'},
            {id: 'vess', label: 'Vess, captain', glyph: 'V', ring: 'crew', index: 0}, {id: 'dunn', label: 'Dunn, captain', glyph: 'D', ring: 'crew', index: 1, state: 'strained'},
            {id: 'pip', label: 'Pip, runner', glyph: 'P', ring: 'crew', index: 2}, {id: 'oake', label: 'Oake, runner', glyph: 'O', ring: 'crew', index: 3, state: 'unknown'},
            {id: 'ro', label: 'Ro, lookout', glyph: 'R', ring: 'crew', index: 4}],
        edges: [{from: 'you', to: 'vess', kind: 'reports'}, {from: 'you', to: 'dunn', kind: 'reports', state: 'strained', label: 'owed a cut'}],
        notes: [{state: 'strained', text: 'Heat is rising on Ash Lane: two runs went badly. Dunn is owed his cut and has not said so aloud.'}]},
    {id: 'org-sect-ranks', size: 720, title: 'The Quiet Orchard sect: grade ladder', summary: 'Disciples rise by grade; the next grade names what it asks.',
        tracks: [{id: 'grades', label: 'Disciple grade', steps: ladder(['Outer', 'Inner', 'Core', 'Elder', 'Master'], 1)}],
        notes: [{text: 'Core asks a taught technique and an elder to vouch for you.'}]},
];
