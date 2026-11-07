// organizations@1 as a saved shared domain (lane F step 2, proposal). Owns the optional top-level key `organizations`; absent, foreign
// or unreadable loads fresh and an untouched life writes no key. One founding route: a small gathering (O1), founded where a world
// lists a place for it. Imports no world (AR3/AR4): places and costs are data here, the host passes ports. The founder's post is a
// FD15 position row derived from the group record (organizations.js is its one authority); positions@1 is not written, because it
// has no dissolve exit kind and one authority per fact (AR3).
import {registerDomain} from './domain_registry.js';
import {defineGathering} from './gatherings.js';
import {registerPositionSource} from './positions.js';
import {ORGANIZATIONS_FAMILY, freshOrganizations, migrateOrganizations, validateOrganizations, loadOrganizations, saveOrganizations, organizationsSlice, setOrganizationsSlice,
    foundGroup, dissolveGroup, foundingReason, cleanName, cleanCharter, activeFounded, CHARTER_DIALS, RHYTHM_DAYS, SECRECY_DIAL, FOUNDED_HOUR} from './organizations.js';

// Founding routes by world (default, dial, reason). cost: coins from the purse, paid at founding. A hidden group costs more because it
// needs a back room and a quiet word; an open one meets where the market already is. place/fact name where the player must be.
export const FOUNDING_ROUTES = Object.freeze({
    'base.frontier': Object.freeze({location: 'Village', fact: 'mg.opened', where: 'the Market courtyard', base: 30, hiddenExtra: 10,
        reason: 'A corner of the courtyard for the meetings and the first round.'}),
});
export const foundingCost = (world, charter) => { const r = FOUNDING_ROUTES[world]; return r ? r.base + (charter?.secrecy === 'hidden' ? r.hiddenExtra : 0) : 0; };
let ports = null;
export function configureOrganizations(p) { ports = p; }

const writable = () => ports?.writable?.() !== false;
// Everything that can stop a founding right now, in plain words; '' means it can run. Reads, never writes.
function stop(name, charter) {
    if (!ports) return 'Groups are not ready yet.';
    const world = ports.world(), route = FOUNDING_ROUTES[world];
    if (!route) return 'No way to found a group in this world yet.';
    if (!writable()) return 'Use the writable game tab.';
    if (ports.location() !== route.location || ports.root().actors.player.facts?.[route.fact] !== true) return `Found a group at ${route.where}.`;
    const busy = ports.blocked?.();
    if (busy) return busy;
    if (ports.idle?.() === false) return 'Finish what you are doing first.';
    const cost = foundingCost(world, charter);
    if (ports.actor().money < cost) return `You need ${cost} coins to found a group here.`;
    return name ? foundingReason(world, name) : '';
}
// Commit the slice and the purse together or not at all: the slice is set first so the one save carries both.
function transact(next, mutate) {
    const prior = organizationsSlice(), plan = ports.plan(0);
    mutate?.(plan);
    setOrganizationsSlice(next);
    try { ports.commit(plan); } catch (e) { setOrganizationsSlice(prior); throw e; }
}
const quote = ({name = '', ...dials} = {}) => {
    let charter, reason = '', clean = '';
    try { charter = cleanCharter(dials); if (name) clean = cleanName(name); } catch (e) { reason = e.message; }
    if (!reason) reason = stop(clean, charter);
    const world = ports?.world?.();
    return {eligible: !reason, reasons: reason ? [reason] : [], cost: charter ? foundingCost(world, charter) : 0, because: FOUNDING_ROUTES[world]?.reason || ''};
};
function found(args = {}) {
    if (!String(args.name ?? '').trim()) throw new Error('Name the group first.');
    const q = quote(args);
    if (!q.eligible) throw new Error(q.reasons[0]);
    const charter = cleanCharter(args), world = ports.world(), plan = ports.plan(0);
    const r = foundGroup(organizationsSlice(), {world, name: args.name, charter, at: plan.state.clock});
    transact(r.slice, p => { p.external.money -= q.cost; });
    ports.logMessage?.(`You found ${r.group.name}. It meets ${charter.rhythm}.`, 'notification');
    return r.group;
}
function dissolve({id} = {}) {
    if (!ports) throw new Error('Groups are not ready yet.');
    if (!writable()) throw new Error('Use the writable game tab.');
    const busy = ports.blocked?.();
    if (busy) throw new Error(busy);
    const plan = ports.plan(0), next = dissolveGroup(organizationsSlice(), id, plan.state.clock);
    transact(next);
    ports.logMessage?.(`You dissolve ${next.groups[id].name}.`, 'notification');
    return next.groups[id];
}
// The meeting as a gatherings.js row (one validator for the schedule and the secrecy dial). The founder is the one seat.
const gathering = id => {
    const g = organizationsSlice().groups[id];
    if (!g || g.status !== 'active') return null;
    const every = RHYTHM_DAYS[g.charter.rhythm];
    return defineGathering({id: g.id, world: g.world, label: g.name, schedule: {everyDays: every, offset: Math.floor(g.founded / 1440) + every, hour: FOUNDED_HOUR},
        dial: {secrecy: SECRECY_DIAL[g.charter.secrecy]}, seats: [{id: 'founder', personaId: `${g.id}.founder`}]});
};
// FD15 founder post, derived. A dissolved group's post reads ended with the dissolve exit kind kept here, not in positions@1.
export function organizationPositions(state) {
    const w = state?.actors?.player?.worldId;
    return Object.values(organizationsSlice().groups).filter(g => g.world === w).map(g => ({
        id: `org.${g.id}.founder`, institution: g.name, role: 'Founder', rank: 'founder', term: {type: 'member', startedAt: g.founded},
        exit: {kinds: [], cost: 'Dissolve the group to end this post.'}, source: 'organizations.js',
        ...(g.status === 'dissolved' ? {ended: {kind: 'dissolve', at: g.dissolvedAt, reason: 'You dissolved the group.'}} : {})}));
}
registerPositionSource('organizations', organizationPositions);
registerDomain({id: 'organizations', deps: [], initialState: freshOrganizations, save: saveOrganizations,
    validate: s => { if (s != null && s.family === ORGANIZATIONS_FAMILY) validateOrganizations(s); },
    migrate: migrateOrganizations, load: loadOrganizations, projection: organizationsSlice,
    commands: {found, dissolve, quote, gathering, dials: () => CHARTER_DIALS, activeFounded: world => activeFounded(world)}});
