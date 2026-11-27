// Atlas links to the active design, code, replay and proof by their existing IDs and paths.
export const implementation = [{
    id: 'village-watchcraft-ready',
    title: 'Watchcraft',
    world: 'The Village',
    worldView: 'world/village/places',
    outcome: 'Practice sector scanning, earn more on patrol, and decide what to do with the observation in Tessa’s report.',
    verified: 'The first skilled patrol pays 60 coins instead of 50 and points to a five-minute search at the well.',
    next: 'From the same evening, take the patrol or spend the time elsewhere. Revisit after reload and see what each route gives you a reason to do tomorrow.',
    scenario: 'Two patrols completed, both kits returned, and sector scanning rehearsed 5/5. Your first skilled round is available under Find work.',
    references: {
        design: {label: 'Vision and next-day playtest', path: 'docs/reviews/OOPS_DESIGN_DIVERGENCE_2026-11-24.md'},
        owner: {label: 'Village career code', path: 'src/village_career.js'},
        proof: {label: 'Watchcraft browser receipt', path: 'docs/audits/WATCHCRAFT_HANDOFF_REPLAY_2026-11-24.md'},
    },
}];
