// Gu readiness and the move panel model for the keeper life (GKM2, GKM5, GKM7, GKM10). One pure reader feeds the engine's
// facts (through the gu_keeper domain projection), the panel and the quote, so what the panel says is what a commit checks (AR7).
// Readiness is read from the Gu's real state: its claim (yours or not), life, place, the being record's care reading (fed through
// the needs seam's upkeep rows: sound, at risk, starved out), its rank against yours (priced, never a gate: GKM16) and whether a
// running move holds it.
// No save slice, no clock, no writes.
import {KEEPER_GU, KEEPER_MOVES, KEEPER_DIALS, kId as id, guKeeperLife} from './world_packs/book_gu_keeper.js';
import {moveReadiness} from './composed_moves.js';
import {guCard} from './being_gu.js';
import {kmFact} from './gu_keeper_moves.js';
import {certaintyOf} from './knowledge_view.js';

const WORLD = guKeeperLife.world.id;
const SHORTFALL = {'sound': 0, 'worked this window': 0, 'works through hunger at risk': 1, 'starved out': 2};

export function guReadiness(state, slot) {
    const g = KEEPER_GU.find(x => x.slot === slot), s = state.simulation, p = s?.people?.[id(slot)];
    if(!g || !p) return {slot, label: g?.label ?? slot, blocks: ['not in this house'], shortfall: 0, word: 'not in this house'};
    const mine = s.claims[id(slot + '_title')]?.owner === 'player', alive = p.life === 'alive';
    const here = p.location === s.people.player?.location, above = Math.max(0, g.use.rank - KEEPER_DIALS.apertureRank);
    const facts = state.actors?.[id(slot)]?.facts || {};
    const card = guCard({id: slot, label: g.label, use: g.use, kept: mine, alive, condition: p.vitals?.health ?? 0, maxCondition: p.vitals?.max_health ?? 4,
        refined: !!facts[id(slot + '_refined')], canRefine: !!g.refinedMeal, resents: !!facts[id(slot + '_resents')], worked: !!facts[id(slot + '_kept.worked')], willEat: true});
    const job = s.jobs.find(j => (j.participants || []).includes(id(slot)));
    const blocks = [...(!mine ? [`the ${g.label} is not yours`] : []), ...(mine && !alive ? [`the ${g.label} is dead`] : []), ...(mine && alive && !here ? [`the ${g.label} is not here`] : [])];
    const care = card.care.ability, shortfall = blocks.length ? 0 : SHORTFALL[care] ?? 0;
    const rank = above ? `, rank ${g.use.rank}: ${above} above yours` : '';
    const word = (blocks[0] ?? (job ? `busy: ${job.label}` : shortfall === 0 ? `ready (${care})` : shortfall === 1 ? 'hungry: would make the move backfire' : 'starved out: would make the move backfire')) + rank;
    return {slot, label: g.label, rank: g.use.rank, above, condition: p.vitals?.health ?? 0, care, blocks, shortfall, busy: job?.label ?? null, word, use: card.use};
}

// Facts for every move form: drivable (no block), fail (1 when any role falls short, else the rank-gap risk of its fuel plan),
// recoil (on the core Gu: one point per short role, or the gap when the gap backfires; never below 1).
export function keeperMoveFacts(state, context = {}) {
    if((context.actorId ?? 'player') !== 'player' || state?.actors?.player?.worldId !== WORLD || !state.simulation) return {};
    const ready = new Map(KEEPER_GU.map(g => [g.slot, guReadiness(state, g.slot)])), facts = {};
    for(const m of KEEPER_MOVES.moves) {
        const r = moveReadiness(m.assignment, slot => ready.get(slot)), core = ready.get(m.assignment.parts[0]);
        facts[kmFact(m.key, 'drivable')] = r.blocks.length === 0;
        facts[kmFact(m.key, 'fail')] = r.shortfall > 0 ? 1 : m.cost.risk;
        facts[kmFact(m.key, 'recoil')] = Math.max(0, Math.min(r.shortfall || m.cost.gap, core.condition - 1));
    }
    return facts;
}

const CERTAINTY = {known: 'known', guessed: 'worked out, untried', open: 'not known'};
// Panel model: one row per recipe, its roles, which owned Gu fill each and how ready they are, and its castable forms.
export function keeperMovesView(state) {
    if(state?.actors?.player?.worldId !== WORLD) return null;
    const known = state.simulation.knowledge.player || {}, ready = new Map(KEEPER_GU.map(g => [g.slot, guReadiness(state, g.slot)]));
    const mineSlots = KEEPER_GU.filter(g => state.simulation.claims[id(g.slot + '_title')]?.owner === 'player').map(g => g.slot);
    return KEEPER_MOVES.recipes.map(recipe => {
        const entry = known[KEEPER_MOVES.knownKey(recipe)];
        const knowing = recipe.known === 'own' ? (mineSlots.some(s => KEEPER_MOVES.uses[s]?.fn === recipe.roles[0].needs.fn) ? 'known' : 'open') : entry ? certaintyOf(entry) : 'open';
        const roles = recipe.roles.map(role => ({id: role.id, label: role.label, optional: !!role.optional, needs: role.needs.fn,
            fillers: KEEPER_GU.filter(g => g.use?.fn === role.needs.fn).map(g => ({slot: g.slot, label: g.label, held: mineSlots.includes(g.slot), word: ready.get(g.slot).word, shortfall: ready.get(g.slot).shortfall}))}));
        const forms = KEEPER_MOVES.moves.filter(m => m.recipe.id === recipe.id && m.assignment.parts.every(x => mineSlots.includes(x))).map(m => {
            const r = moveReadiness(m.assignment, slot => ready.get(slot));
            return {commandId: KEEPER_MOVES.set.ids[m.key].command, gu: m.assignment.parts.map(s => ready.get(s).label), plan: m.plan, cost: m.cost.lines, risk: m.cost.risk, gap: m.cost.gap, minutes: m.minutes,
                magnitude: m.parts.magnitude, range: m.parts.range, wasted: m.parts.bends.filter(b => !b.applied).map(b => b.role),
                state: r.blocks.length ? `cannot start: ${r.blocks.join('; ')}` : r.shortfall ? `will backfire: ${r.rows.filter(x => x.shortfall).map(x => x.label).join(', ')} not fed` : m.cost.risk ? `ready, ${Math.round(m.cost.risk * 100)}% backlash` : 'ready'};
        });
        return {id: recipe.id, label: recipe.label, origin: recipe.origin, locator: recipe.locator ?? null, reason: recipe.reason ?? null, knowing, knowingWord: CERTAINTY[knowing], roles, forms};
    });
}
