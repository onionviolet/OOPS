// The one place a lane registers a gallery fixture module: append one line, [loader, export name].
// Omit the export name when the module registers itself into FIGURE_FIXTURES on import.
// Literal paths keep these bundleable; figure_gallery.js reads the list and dedupes by fixture id.
export const FIXTURE_MANIFEST = [
    [() => import('./abilities.js')],
    [() => import('./rituals.js')],
    [() => import('./family_tree.js'), 'FAMILY_FIXTURES'],
    [() => import('./combat.js')],
    [() => import('./maps.js'), 'MAP_FIXTURES'],
    [() => import('./body.js'), 'BODY_FIXTURES'],
    [() => import('./knowledge.js')],
    [() => import('./research.js')],
    [() => import('./organizations.js'), 'FIGURE_FIXTURES_ORGANIZATIONS'],
    [() => import('./crafting.js'), 'CRAFTING_FIXTURES'],
    [() => import('./time.js')],
    [() => import('./spacetime.js')],
    [() => import('./relationship_web.js'), 'RELATIONSHIP_WEB_FIXTURES'],
    [() => import('./homes.js'), 'HOME_FIXTURES'],
    [() => import('./progression.js')],
];
