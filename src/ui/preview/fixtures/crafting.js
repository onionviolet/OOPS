// Crafting fixtures for the figure gallery (proposal CF3: input-output flow). Invented names only.
// A two-step chain read left to right: inputs, the station that turns them, the product, and what is left over.
export const CRAFTING_FIXTURES = [{
    id: 'craft-flow-blade', size: 720, title: 'Recipe flow: ore to blade',
    summary: 'Two steps at two stations. The first is ready, the second waits on a missing binding and the bench.',
    nodes: [
        {id: 'ore', label: 'Ore ×3', glyph: 'o', state: 'filled', at: [-1, -.7]},
        {id: 'coal', label: 'Coal ×1', glyph: 'c', state: 'filled', at: [-1, .1]},
        {id: 'furnace', label: 'Furnace', state: 'done', at: [-.4, -.3]},
        {id: 'ingot', label: 'Ingot ×1', state: 'filled', at: [.15, -.6]},
        {id: 'binding', label: 'Binding strip ×1', state: 'broken', at: [-.8, .8]},
        {id: 'bench', label: 'Workbench', state: 'broken', at: [.1, .45]},
        {id: 'blade', label: 'Blade', state: 'empty', at: [.95, .0]},
        {id: 'slag', label: 'Slag', state: 'pending', at: [-.4, -1]},
    ],
    edges: [
        {from: 'ore', to: 'furnace', kind: 'consumes', state: 'done'},
        {from: 'coal', to: 'furnace', kind: 'consumes', state: 'done'},
        {from: 'furnace', to: 'ingot', kind: 'makes', state: 'done'},
        {from: 'furnace', to: 'slag', kind: 'leftover'},
        {from: 'ingot', to: 'bench', kind: 'consumes'},
        {from: 'binding', to: 'bench', kind: 'consumes', state: 'broken'},
        {from: 'bench', to: 'blade', kind: 'makes', state: 'broken'},
    ],
    notes: [{state: 'broken', text: 'Blade is blocked: missing 1 Binding strip, and no workbench at this place.'}],
    legend: [{state: 'filled', label: 'in stock'}, {state: 'broken', label: 'missing or unavailable'}, {state: 'done', label: 'step ready'},
        {kind: 'consumes', label: 'is spent'}, {kind: 'makes', label: 'is made'}, {kind: 'leftover', label: 'is left over'}],
}];
