// organizations@1 as a saved shared domain (lane F step 2, proposal). Owns the optional top-level key `organizations`; absent, foreign
// or unreadable loads fresh and an untouched life writes no key. One founding route: a small gathering (O1), founded where a world
// lists a place for it. Imports no world (AR3/AR4): places and costs are data here, the host passes ports. The founder's post is a
// FD15 position row derived from the group record (organizations.js is its one authority); positions@1 is not written, because it
// has no dissolve exit kind and one authority per fact (AR3).
import {registerDomain} from './domain_registry.js';
import {defineGathering} from './gatherings.js';
import {registerPositionSource} from './positions.js';
import {ORGANIZATIONS_FAMILY, freshOrganizations, migrateOrganizations, validateOrganizations, loadOrganizations, saveOrganizations, organizationsSlice, setOrganizationsSlice,
    foundGroup, dissolveGroup, foundingReason, cleanName, cleanCharter, activeFounded, CHARTER_DIALS, RHYTHM_DAYS, SECRECY_DIAL, FOUNDED_HOUR,
    addMember, settleDues, spendTreasury, pendingMeetings, nextMeetingDay, duesOf, claimGround, releaseGround, claimantOf} from './organizations.js';
import {applyGameplayEffect} from './gameplay_transactions.js';
import {authorityOver, knownness, KNOWN_AT} from './authority.js';
import {domainRegistry} from './domain_registry.js';

// Founding routes by world (default, dial, reason). cost: coins from the purse, paid at founding. A hidden group costs more because it
// needs a back room and a quiet word; an open one meets where the market already is. place/fact name where the player must be.
export const FOUNDING_ROUTES = Object.freeze({
    'base.frontier': Object.freeze({location: 'Village', fact: 'mg.opened', where: 'the Market courtyard', base: 30, hiddenExtra: 10,
        reason: 'A corner of the courtyard for the meetings and the first round.',
        // Villagers who may agree to join (dial: standing needed, coins they can spare at a meeting). Admission shifts the bar:
        // an open group asks less of a stranger's word, a vouched one more. Authored proposals, not canon.
        invitees: Object.freeze([
            Object.freeze({id: 'mg.mira', name: 'Mira', standing: 6, means: 5, yes: 'Mira says she will come, and she has coin to spare.', no: 'Mira smiles and says she wants to see how the first meetings go before she puts her name down.'}),
            Object.freeze({id: 'mg.sela', name: 'Sela', standing: 10, means: 4, yes: 'Sela agrees; she likes a standing reason to sit down with people.', no: 'Sela says she keeps her evenings for people she has worked beside a while.'}),
            Object.freeze({id: 'mg.orin', name: 'Orin', standing: 14, means: 3, yes: 'Orin grunts yes; a regular table suits him.', no: 'Orin says he does not hand coin to a box he does not know the keeper of.'}),
            Object.freeze({id: 'mg.bram', name: 'Bram', standing: 18, means: 1, yes: 'Bram will come, though his purse is thin.', no: 'Bram shakes his head; he trusts few with his name, fewer with his coin.'})]),
        admissionShift: Object.freeze({open: -2, invite: 0, vouched: 4}),
        // OB11 ground a group may stake (default, dial, reason). place is the authority source's place id (tests assert it equals HOME_SITE); the player must
        // stand there. minMembers 1: a claim without anyone to hold it is a stick in the ground. cost 8 coins: stakes, rope and a day walking the bounds.
        // strongAt 3 (F7): people in the group (founder and members) at which settlers pay on time; fewer and they pay a week late. A band of three can
        // show up at a door; two cannot yet. Derived on read from the group record, so nothing is saved.
        // settlerDues 1 coin a week: what an outsider who settles inside a claim owes the holder, the claim's other side (a rule, not a simulation).
        claims: Object.freeze({'Wild willow stand': Object.freeze({label: 'the wilds stead', cost: 8, minMembers: 1, settlerDues: 1, strongAt: 3,
            reason: 'Stakes and rope, and a day spent walking the bounds with your people so they can say where it ends.'})}),
        // Group abilities (3.5): what a treasury buys that one purse cannot. Each once per meeting.
        abilities: Object.freeze({
            feast: Object.freeze({label: 'Pool for a feast', cost: 12, reputation: Object.freeze({region: 'Village', amount: 2}),
                reason: 'The pooled dues buy a long table in the courtyard; the village remembers who fed it.'}),
            lookout: Object.freeze({label: 'Hire a lookout', cost: 6,
                reason: 'A boy on the courtyard wall to watch the lane, so the next meeting is harder to overhear.'})})}),
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
    const sh = next.groups[id].shared;
    ports.logMessage?.(`You dissolve ${next.groups[id].name}.${sh ? ` The ${sh} coin${sh === 1 ? '' : 's'} in the box go back to the members who paid in.` : ''}`, 'notification');
    return next.groups[id];
}
const clockNow = () => ports.plan(0).state.clock;
const route = () => FOUNDING_ROUTES[ports.world()];
const villageStanding = () => ports.actor().reputation?.Village;
const meansOf = npc => route()?.invitees?.find(i => i.id === npc)?.means ?? 0;
// Why the player cannot act on a group right now (spending, inviting), or ''. Reads, never writes.
function actStop() {
    if (!ports) return 'Groups are not ready yet.';
    if (!writable()) return 'Use the writable game tab.';
    if (ports.location() !== route()?.location) return `Do this at ${route()?.where || 'the Village'}.`;
    return ports.blocked?.() || (ports.idle?.() === false ? 'Finish what you are doing first.' : '');
}
// AT32: the player stands on ground a founded group here could stake, so its card is shown away from the courtyard. Reads, never writes.
function claimHere() { if (!ports) return false; return !!route()?.claims?.[ports.location()] && activeFounded(ports.world()).length > 0; }
const liveGroup = id => { const g = organizationsSlice().groups[id]; if (!g || g.status !== 'active') throw new Error('You run no such group.'); return g; };
const bar = (g, v) => v.standing + (route().admissionShift[g.charter.admission] || 0);
/** Who could be asked, and what each would say now. Villagers agree by a simple rule: Village standing against their bar. */
function inviteQuote({id} = {}) {
    const g = liveGroup(id), r = route(), stand = villageStanding(), stop = actStop();
    return (r?.invitees || []).map(v => {
        const joined = !!g.members?.[v.id], need = bar(g, v);
        const reason = joined ? `${v.name} is already in ${g.name}.` : stop || (Number.isFinite(stand) && stand >= need ? '' : v.no);
        return {npc: v.id, name: v.name, eligible: !reason, reasons: reason ? [reason] : [], needs: need, because: v.yes, joined};
    });
}
function invite({id, npc} = {}) {
    const q = inviteQuote({id}).find(x => x.npc === npc);
    if (!q) throw new Error('Nobody here by that name.');
    if (!q.eligible) throw new Error(q.reasons[0]);
    const at = clockNow(), next = addMember(organizationsSlice(), id, {npc, name: q.name, at});
    transact(next);
    ports.logMessage?.(q.because, 'notification');
    return next.groups[id].members[npc];
}
/** Collect the dues of every meeting held since last time, once each. Safe to call often: nothing held means nothing written. */
function settle({id} = {}) {
    if (!ports) throw new Error('Groups are not ready yet.');
    const g = liveGroup(id), r = settleDues(organizationsSlice(), id, clockNow(), meansOf);
    if (!r.held) return {held: 0, collected: 0, paid: [], late: []};
    if (!writable()) throw new Error('Use the writable game tab.');
    transact(r.slice);
    const lateNote = r.late.length ? ` Late: ${[...new Set(r.late)].join(', ')}.` : '';
    ports.logMessage?.(`${g.name} met ${r.held} time${r.held === 1 ? '' : 's'}; dues collected: ${r.collected} coin${r.collected === 1 ? '' : 's'}.${lateNote}`, 'notification');
    return {held: r.held, collected: r.collected, paid: r.paid, late: r.late};
}
const pending = ({id} = {}) => { const g = organizationsSlice().groups[id]; return g ? pendingMeetings(g, clockNow()).length : 0; };
function abilityQuote({id} = {}) {
    const g = liveGroup(id), r = route(), clock = clockNow(), day = nextMeetingDay(g, clock), stop = actStop(), held = (g.treasury || 0) + settleDues(organizationsSlice(), id, clock, meansOf).collected;
    return Object.entries(r?.abilities || {}).map(([key, a]) => {
        const reason = g.charter.dues !== 'coin' ? 'This group collects no coin dues, so it has no treasury.' : stop || (g.used?.[key] === day ? 'Already done before the next meeting.' :
            held < a.cost ? `The treasury holds ${held} coins; this costs ${a.cost}.` : '');
        return {key, label: a.label, cost: a.cost, because: a.reason, eligible: !reason, reasons: reason ? [reason] : []};
    });
}
function spend({id, ability} = {}) {
    const a = route()?.abilities?.[ability];
    if (!a) throw new Error('The group has no such ability.');
    if (!ports) throw new Error('Groups are not ready yet.');
    settle({id}); // collect what the held meetings owe before spending
    const q = abilityQuote({id}).find(x => x.key === ability);
    if (!q.eligible) throw new Error(q.reasons[0]);
    const g = liveGroup(id), next = spendTreasury(organizationsSlice(), id, {key: ability, cost: a.cost, day: nextMeetingDay(g, clockNow())});
    transact(next, plan => { if (a.reputation) applyGameplayEffect(plan.gameplay, {type: 'reputation', ...a.reputation}, 'player'); });
    ports.logMessage?.(`${g.name}: ${a.label.toLowerCase()}. ${a.reason}`, 'notification');
    return next.groups[id];
}
// The meeting as a gatherings.js row (one validator for the schedule and the secrecy dial). The founder is the one seat.
const LOOKOUT_BOOST = 0.5; // dial: how much a hired lookout adds to the meeting's secrecy (capped at fully hidden)
const lookoutOn = g => g.used?.lookout !== undefined && (ports?.root?.().clock ?? 0) < g.used.lookout * 1440 + FOUNDED_HOUR * 60;
// ---- OB11: claim ground. Reads authorityOver (the one authority for who holds a place); writes only the group record and the purse. ----
function claimQuote({id} = {}) {
    const g = liveGroup(id), r = route(), world = ports.world();
    return Object.entries(r?.claims || {}).map(([place, c]) => {
        const held = g.claims?.[place] ? true : false, over = authorityOver(ports.root(), {world, place});
        let reason = '';
        if (held) reason = `${g.name} already claims ${c.label}.`;
        else if (!writable()) reason = 'Use the writable game tab.';
        else if (over.claimedBy === 'claim') reason = `${over.holder ?? over.claimant} already holds ${c.label}; a claim there is refused.`;
        else if (ports.location() !== place) reason = `Go to ${c.label} to stake it.`;
        else if (Object.keys(g.members || {}).length < c.minMembers) reason = `${g.name} needs ${c.minMembers} member${c.minMembers === 1 ? '' : 's'} to hold ground.`;
        else if (ports.actor().money < c.cost) reason = `You need ${c.cost} coins for the stakes.`;
        else reason = ports.blocked?.() || (ports.idle?.() === false ? 'Finish what you are doing first.' : '');
        return {place, label: c.label, cost: c.cost, because: c.reason, held, eligible: !reason, reasons: reason ? [reason] : []};
    });
}
// F7: staking ground inside an authority's bounds is a known act toward it (the founders stood there; its people saw the stakes). Keyed by the
// claimant id authorityOver names; value = the heat authority that holds the record, the weight of the act and why. Default weight 1: one known
// notice, the first level of a palette row. Reason: a staked claim is a public statement, not a crime, so it is noticed and not alarming. Dial: per
// authority. 'village' has no heat palette row yet, so its act is refused by heat and nothing is recorded until one exists.
export const CLAIM_ACTS = Object.freeze({
    village: Object.freeze({authority: 'village', weight: 1}),
    tingen: Object.freeze({authority: 'tingen_police', weight: 1}),
});
// Coverage reads authorityOver BEFORE the claim is stored (afterwards the group itself answers as claimant): inside the world's bounds only.
function claimAct(g, place, over, at) {
    const row = over?.reach === true && typeof over.claimant === 'string' ? CLAIM_ACTS[over.claimant] : null;
    if (!row) return false;
    const witness = ['you', ...Object.values(g.members || {}).map(m => m.name)].join(', ').slice(0, 60);
    try { return domainRegistry.command('heat', 'recordAct')?.({authority: row.authority, weight: row.weight, id: `claim:${g.id}:${place}@${at}`, at, known: true, witness}) === true; }
    catch { return false; }
}
function claim({id, place} = {}) {
    if (!ports) throw new Error('Groups are not ready yet.');
    const q = claimQuote({id}).find(x => x.place === place);
    if (!q) throw new Error('That ground cannot be claimed here.');
    if (!q.eligible) throw new Error(q.reasons[0]);
    const g = liveGroup(id), at = clockNow(), over = authorityOver(ports.root(), {world: ports.world(), place}), next = claimGround(organizationsSlice(), id, {place, at});
    transact(next, p => { p.external.money -= q.cost; });
    claimAct(next.groups[id], place, over, at); // after the commit: a refused commit leaves no act without a claim
    ports.logMessage?.(`${g.name} claims ${q.label}. ${q.because}`, 'notification');
    return next.groups[id];
}
function release({id, place} = {}) {
    if (!ports) throw new Error('Groups are not ready yet.');
    if (!writable()) throw new Error('Use the writable game tab.');
    const g = liveGroup(id), next = releaseGround(organizationsSlice(), id, place);
    transact(next);
    ports.logMessage?.(`${g.name} gives up its claim on ${route()?.claims?.[place]?.label ?? place}.`, 'notification');
    return next.groups[id];
}
// F7: a settler's standing order toward the group, from the same OB1 set (pay_on_time, pay_late; skip stays a choice for a world that wants a defiant settler).
// Default pay_on_time while the group is strong (people at strongAt) or known (knownness at KNOWN_AT); pay_late when it slips. Both are derived on read.
// Knownness reads zero until a reader is registered for the group id, so strength decides today.
function settlerPolicy(g, c) {
    const people = 1 + Object.keys(g.members || {}).length;
    let known = 0; try { known = ports?.root ? knownness(ports.root(), g.id).value : 0; } catch { known = 0; }
    return people >= c.strongAt || known >= KNOWN_AT ? 'pay_on_time' : 'pay_late';
}
/** What an outsider who settles inside a claim owes its holder by the world's rule, or null. No settlement is simulated; callers ask. */
export function settlerDues(world, place) {
    const g = claimantOf(world, place), c = FOUNDING_ROUTES[world]?.claims?.[place];
    return g && c ? {group: g.id, holder: g.name, coinsPerWeek: c.settlerDues, policy: settlerPolicy(g, c), why: `${g.name} claims ${c.label}; anyone settling there owes it ${c.settlerDues} coin a week.`} : null;
}
const gathering = id => {
    const g = organizationsSlice().groups[id];
    if (!g || g.status !== 'active') return null;
    const every = RHYTHM_DAYS[g.charter.rhythm];
    return defineGathering({id: g.id, world: g.world, label: g.name, schedule: {everyDays: every, offset: Math.floor(g.founded / 1440) + every, hour: FOUNDED_HOUR},
        dial: {secrecy: lookoutOn(g) ? Math.min(1, SECRECY_DIAL[g.charter.secrecy] + LOOKOUT_BOOST) : SECRECY_DIAL[g.charter.secrecy]},
        seats: [{id: 'founder', personaId: `${g.id}.founder`}, ...Object.keys(g.members || {}).map(npc => ({id: `m:${npc}`, personaId: `${g.id}.${npc}`}))]});
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
    commands: {found, dissolve, claimQuote, claimHere, claim, release, settlerDues: ({world, place} = {}) => settlerDues(world, place), quote, gathering, invite, inviteQuote, settle, pending, spend, abilityQuote, dials: () => CHARTER_DIALS, activeFounded: world => activeFounded(world)}});
