// Graph-shaped paths for the gallery: invented names, each at a different depth of knowledge. Shape follows the path (tree, wheel, web, list).
export const GRAPH_PATHS = [
    {id: 'fork', label: 'The fork (a branching path)', shape: 'tree', here: 'lamp', trail: ['root', 'lamp'], nodes: [
        {id: 'root', label: 'Ordinary clerk', known: 'odds', held: true},
        {id: 'lamp', label: 'Lantern-Reader', known: 'costs', held: true, benefits: ['reads lamp-smoke'], costs: ['smoke in the voice']},
        {id: 'reed', label: 'Reed-Breather', known: 'benefits', source: 'insight', benefits: ['breathes under still water']},
        {id: 'bell', label: 'Bell-Ringer', known: 'name', confirmed: false},
        {id: 'x', label: 'never shown', known: 'exists'},
        {id: 'glass', label: 'Glass-Warden', known: 'name'}],
        edges: [{from: 'root', to: 'lamp', known: 'odds'}, {from: 'root', to: 'reed', known: 'exists'}, {from: 'root', to: 'bell', known: 'name'}, {from: 'root', to: 'x', known: 'exists'},
            {from: 'lamp', to: 'glass', known: 'mix', mix: {outcome: 'a second shadow at dusk', warning: 'two draughts at once'}}]},
    {id: 'moons', label: 'The moons (a wheel)', shape: 'wheel', here: 'full', nodes: ['new', 'waxing', 'full', 'waning'].map((id, i) => ({id, label: `${id[0].toUpperCase()}${id.slice(1)} moon`, known: 'benefits', benefits: [['hides', 'gathers', 'reveals', 'lets go'][i]]})),
        edges: [['new', 'waxing'], ['waxing', 'full'], ['full', 'waning'], ['waning', 'new']].map(([from, to]) => ({from, to, known: 'name', kind: 'turns to'}))},
    {id: 'hall', label: 'The hall of links (a web)', shape: 'web', nodes: [{id: 'door', label: 'Door', known: 'name'}, {id: 'lamp2', label: 'Lamp', known: 'name'}, {id: 'bell2', label: 'Bell', known: 'name'}, {id: 'key', label: 'Key', known: 'name', source: 'cheat'}],
        edges: [{from: 'door', to: 'lamp2', known: 'name', kind: 'opens'}, {from: 'door', to: 'bell2', known: 'name', kind: 'opens'}, {from: 'door', to: 'key', known: 'name', kind: 'opens'}]},
    {id: 'gifts', label: 'Gifts with no order (a list)', shape: 'list', nodes: [{id: 'g1', label: 'Quiet step', known: 'benefits', benefits: ['no sound on stone']}, {id: 'g2', label: 'Long breath', known: 'name'}, {id: 'g3', label: 'Unknown', known: 'exists'}], edges: []},
];
