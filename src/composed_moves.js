// Composed moves (GKM5, GKM6, GKM10; proposal under AD56). A move is a recipe over ROLES, not over named parts: one core role
// sets what the move does, supporting roles bend it. Any owned part whose `use` fills a role can serve, and one part fills one
// role at a time. The move's power is composed from the parts it was cast with, the way Ars Nouveau stacks a form, an effect
// and augments and Noita applies modifiers to a spell, so a substitute or an invented move needs no new row (AD38).
// Three separate pure reads (GKM18): the recipe (`defineRecipe`), the role fill (`assignments`, `composeMove`) and the cost
// (`moveCost`). Output is power_grammar `parts`, so a world lowers moves through the existing route (power_grammar -> spell_seam ->
// ability_records -> spell_cast_lowering); this leaf adds no executor, no clock, no randomness and no save slice.
// AR11 seam: "a composed ability from owned living or crafted parts". First caller: the Gu keeper (Reverend Insanity).
// Later cases named in the GKM palette: Ars Nouveau glyph spells, LOTM rituals combining ingredients, D&D metamagic.
//
// A part's `use` (read from its being record or item): {fn, rank, essence, base?: {magnitude, range, duration, targets},
//   augment?: {kind, scale?: {axis: factor}, add?: {axis: n}, stacks?: boolean}}.
// Order: scales apply before adds, in role order. Default `stacks: false`: a second part of the same augment kind is still
// used and paid for but bends nothing (Reverend Insanity ch106: two Little Light Gu raise a moonblade by 100%, not 200%).
// Dial: an augment kind may set `stacks: true` where a world's own rule adds them up (Ars Nouveau's Amplify does).
const fail = message => { throw new Error(message); };
const AXES = ['magnitude', 'range', 'duration', 'targets'];
const slug = /^[a-z][a-z0-9_]*$/;

export function defineRecipe(r) {
    slug.test(r?.id ?? '') && r.label && Array.isArray(r.roles) && r.roles.length || fail('A recipe needs an id, a label and roles.');
    ['canon', 'original'].includes(r.origin) || fail(`${r.id}: origin is canon or original (SKR17).`);
    r.origin !== 'canon' || r.locator || fail(`${r.id}: a canon recipe needs a text locator (SKR1).`);
    const cores = r.roles.filter(x => x.core);
    cores.length === 1 && !cores[0].optional || fail(`${r.id}: exactly one required core role.`);
    const ids = new Set();
    for(const role of r.roles) {
        slug.test(role.id ?? '') && role.label && role.needs?.fn || fail(`${r.id}: every role needs an id, a label and the use it needs.`);
        ids.has(role.id) && fail(`${r.id}: duplicate role ${role.id}.`); ids.add(role.id);
    }
    return Object.freeze({...r, roles: Object.freeze(r.roles.map(x => Object.freeze({...x})))});
}

export const fills = (role, use) => !!use && use.fn === role.needs.fn && (role.needs.path == null || use.path === role.needs.path);

// Every way the given parts can fill the recipe: one part per role, distinct parts, optional roles may stay empty.
// parts: [{id, use}]. Returns [{roles: {roleId: partId|null}, parts: [partId...]}] in a stable order.
export function assignments(recipe, parts) {
    const out = [];
    const walk = (i, chosen, used) => {
        if(i === recipe.roles.length) { out.push({roles: {...chosen}, parts: recipe.roles.map(r => chosen[r.id]).filter(Boolean)}); return; }
        const role = recipe.roles[i];
        for(const p of parts) if(!used.has(p.id) && fills(role, p.use)) walk(i + 1, {...chosen, [role.id]: p.id}, new Set([...used, p.id]));
        if(role.optional) walk(i + 1, {...chosen, [role.id]: null}, used);
    };
    walk(0, {}, new Set());
    return out;
}

// The composed parts of one assignment, in power_grammar shape plus the `parts` used and how each augment bent it.
export function composeMove(recipe, assignment, useOf) {
    const core = recipe.roles.find(r => r.core), coreUse = useOf(assignment.roles[core.id]);
    coreUse?.base || fail(`${recipe.id}: the core part has no base to compose from.`);
    const axes = Object.fromEntries(AXES.map(a => [a, coreUse.base[a] ?? (a === 'targets' ? 1 : 0)]));
    const functions = [coreUse.fn], applied = new Set(), bends = [];
    const supports = recipe.roles.filter(r => !r.core && assignment.roles[r.id]).map(r => ({role: r, use: useOf(assignment.roles[r.id])}));
    for(const pass of ['scale', 'add']) for(const {role, use} of supports) {
        const a = use.augment;
        if(!a) continue;
        if(pass === 'scale' && !functions.includes(use.fn)) functions.push(use.fn);
        const key = `${pass}:${a.kind}`;
        if(applied.has(key) && !a.stacks) { if(pass === 'scale') bends.push({role: role.id, kind: a.kind, applied: false}); continue; }
        applied.add(key);
        for(const [axis, n] of Object.entries(a[pass] ?? {})) {
            AXES.includes(axis) || fail(`${recipe.id}: unknown axis ${axis}.`);
            axes[axis] = pass === 'scale' ? axes[axis] * n : axes[axis] + n;
        }
        if(pass === 'scale') bends.push({role: role.id, kind: a.kind, applied: true});
    }
    return {functions, ...axes, tier: Math.max(...assignment.parts.map(id => useOf(id).rank)), parts: assignment.parts, bends};
}

// Cost read (GKM8, GKM13, GKM16, GKM17), separate from the recipe and the role fill (GKM18) so a generator or an NPC calls the
// same code. Each part needs essence of its own grade (its rank). `fuel(partId)` names the supply for that part, a typed source:
// {grade, owner, source}. Supply at or above the part's grade pays its `essence`; supply below it still drives the part, at a
// cost that grows with the gap (`curve.cost(gap)` times the essence) and a risk (`curve.risk(gap)`, summed over parts, capped
// at 1). Rank is an input to cost and risk, never a gate. Returns typed lines {part, grade, owner, source, amount, gap}.
export function moveCost(assignment, useOf, fuel, curve = {cost: gap => 2 ** gap, risk: gap => 0.25 * gap}) {
    const lines = assignment.parts.map(part => {
        const use = useOf(part), f = fuel(part), gap = Math.max(0, use.rank - f.grade);
        Number.isInteger(f.grade) && f.owner && f.source || fail(`${part}: fuel needs a grade, an owner and a source.`);
        return {part, grade: f.grade, owner: f.owner, source: f.source, amount: use.essence * (gap ? curve.cost(gap) : 1), gap};
    });
    return {lines, gap: Math.max(0, ...lines.map(l => l.gap)), risk: Math.min(1, lines.reduce((n, l) => n + (l.gap ? curve.risk(l.gap) : 0), 0))};
}

// Fold per-part readiness into the move's. ready: partId -> {blocks: [reasons], shortfall: n, word}. Blocks stop the command
// (absent, not yours, dead); rank is never a block (GKM16), it is priced by moveCost; a shortfall lets it start and fail (hungry, starved out), so a move cast with an
// unready part backfires instead of quietly refusing (GKM8).
export function moveReadiness(assignment, ready) {
    const rows = assignment.parts.map(id => ({id, ...ready(id)}));
    return {blocks: rows.flatMap(r => r.blocks), shortfall: rows.reduce((n, r) => n + r.shortfall, 0), rows};
}
