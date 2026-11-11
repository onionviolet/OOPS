// Tingen's law by observation (STN18, STN19, STN14, KNW5, KNW6, KNW11; Kenshi's "no conscious world judge", FRC45). The first caller of law_case.js.
// No official knows the truth. A constable who fought you holds only what he noted: that you fought him (authority_witness.witnessesFor, one reader) and what you
// wore (observed_look.js). caseFor reads that as a scene: the witness is `seen`; a look that still matches his note is `described`. Both are needed, so a changed
// outfit leaves the case unproven and it stays closed; papers, a plea, a fine and flight are the player's routes. Who rules the place comes from authority.js
// (`authorityOver`), the jurisdiction chain starts there (STN18). No chance is drawn (MR2): the same notes give the same case on every reload.
// Saved here (slice `lotm_law@1`, domain 'lotm_law'): only how a case was closed. An open case is derived from the constables' notes, so an untouched life writes no key.
// Every number is an authored dial with its reason (WPR5/AD49); no source figure exists. The statute is an authored proposal, not a canon claim.
import {defineLawBook, caseFor} from './law_case.js';
import {authorityOver} from './authority.js';
import './authority_sources.js';
import {witnessesFor} from './authority_witness.js';
import {registerDomain, domainRegistry} from './domain_registry.js';
import {AUTHORITIES} from './heat.js';
import {POST_PUBLICITY} from './authority_sources_lotm.js';
import {lotmPositions} from './book_world_lotm_positions.js';
import {LOTM_IDS as I} from './book_world_lotm_ids.js';
import {LOOK_FACET, SIGHT_FACET} from './observed_look.js';

export const LAW_FAMILY = 'lotm_law@1';
const POLICE = 'tingen_police', CITY = 'tingen', ACT = 'strike-officer', STATUTE = 'lotm.law.tingen.assault-on-officers';
export const LAW_DIALS = Object.freeze({
    pleaBelowLevel: {value: 2, why: 'A constable may let a first offender off with a warning, but once the police ask after you by name (level 2) he has his orders. Not a draw: the level decides.'},
    fleeWeight: {value: 1, why: 'Walking away from a constable who has named you is a known act of its own: felt, not enough alone to make you wanted (4).'},
    easedTo: {value: 1.5, why: 'Paying the magistrate settles the warrant, as an arrest does (constables dial): they keep your name but stop asking after you as wanted.'},
});
export const TINGEN_LAW = defineLawBook([{id: STATUTE, act: ACT, places: [CITY], enforcer: 'the Tingen police',
    penalty: {kind: 'fine', text: `a magistrate's fine of ${AUTHORITIES[POLICE].fine.amount} pence`, amount: AUTHORITIES[POLICE].fine.amount},
    evidence: {needs: ['seen', 'described'], known: true},
    detection: [{via: 'witness', gives: 'seen'}, {via: 'trace', gives: 'described'}],
    exemptions: [{when: 'papers_shown', text: 'Your papers name a post the city keeps on its books; your office answers for you, not the magistrate.'}],
    responses: [{trigger: 'resisted', response: 'Constables are sent to your door.', by: 'the Tingen police'}]}]);
const PARENT = Object.freeze({[CITY]: 'loen'});

// ---- the saved slice: how each case was closed
const fresh = () => ({family: LAW_FAMILY, closed: []});
const CAP = 40, HOW = ['talked', 'paid', 'fled', 'papers'];
let slice = fresh();
export function migrateLaw(s) {
    if(!s || s.family !== LAW_FAMILY) return fresh();
    return {family: LAW_FAMILY, closed: (Array.isArray(s.closed) ? s.closed : []).filter(c => c && typeof c.id === 'string' && HOW.includes(c.how) && Number.isFinite(c.at) && typeof c.line === 'string')
        .map(c => ({id: c.id.slice(0, 80), how: c.how, at: c.at, line: c.line.slice(0, 300)})).slice(-CAP)};
}
export const lawSnapshot = () => slice;
export const lawRestore = s => { slice = s; };

// ---- reading
const heatRow = () => { try { return domainRegistry.project('heat')?.heat?.find(h => h.authority === POLICE) ?? null; } catch { return null; } };
const heatFines = () => { try { return domainRegistry.project('heat')?.fines ?? []; } catch { return []; } };
/** Papers the city's books would honour: a held post the city knows of (clerk, hired watchman). A probationer's post is secret by design, so it is not papers. */
export const papersHeld = state => lotmPositions(state).some(r => !r.ended && POST_PUBLICITY[r.rank] > 0);
/** The player's open cases right now. `look` is the signature of what the player wears now (observed_look.lookOf). Pure: reads notes, writes nothing. */
export function openCases(state, {look, papers = false} = {}) {
    const here = state?.simulation?.people?.player?.location;
    const claim = authorityOver(state, {world: I.world, place: here});
    if(!claim.reach || claim.claimant !== CITY) return []; // outside the city's reach no constable here can act on it
    const seen = witnessesFor(CITY, state).filter(w => w.causes[SIGHT_FACET]);
    const out = [];
    for(const cause of [...new Set(seen.map(w => w.causes[SIGHT_FACET]))]) {
        const id = `case:${cause}`;
        if(slice.closed.some(c => c.id === id)) continue;
        const mine = seen.filter(w => w.causes[SIGHT_FACET] === cause);
        const scene = {witnesses: mine.map(w => ({id: w.id, saw: true})), traces: mine.some(w => w.believed[LOOK_FACET] === look) ? ['described'] : []};
        const c = caseFor(TINGEN_LAW, ACT, claim.claimant, PARENT, {scene, actor: {tags: []}});
        const vouched = papers ? caseFor(TINGEN_LAW, ACT, claim.claimant, PARENT, {scene, actor: {tags: []}, flags: ['papers_shown']}) : null;
        out.push({id, cause, level: c.primary?.level ?? null, claimant: claim.claimant, found: c.cases[0]?.found ?? [], proven: !!c.primary, penalty: c.primary?.ruling.penalty ?? null,
            vouched: !!vouched && vouched.cases.some(x => x.ruling.lawful && x.ruling.covered), who: mine.map(w => w.label)});
    }
    return out;
}
const many = c => c.who.length > 1;
const lineOf = c => `${many(c) ? 'The constables who fought you at your door know your face' : 'A constable who fought you at your door knows your face'}, and you look as ${many(c) ? 'they remember' : 'he remembers'}. The magistrate would fine you ${c.penalty.amount} pence.`;
const nameOf = c => many(c) ? 'The constables' : 'The constable';
const verb = (c, one, more) => many(c) ? more : one;
/** The panel view: proven cases with their routes, and how earlier ones were closed. Unproven cases do not show: nobody has a case against a man they cannot place. Null when nothing to show. */
export function lawView(state, ctx = {}) {
    const cases = openCases(state, ctx).filter(c => c.proven), heat = heatRow(), coins = ctx.coins;
    const fine = AUTHORITIES[POLICE].fine.amount;
    const view = cases.map(c => ({id: c.id, line: lineOf(c), amount: c.penalty.amount, routes: [
        {id: 'talk', label: 'Talk to him', hint: 'Plead your case. A constable lets a first offender off with a warning; once the police ask after you by name, he has his orders.',
            blocked: (heat?.level ?? 0) >= LAW_DIALS.pleaBelowLevel.value ? 'The police are asking after you by name; he has his orders.' : null},
        {id: 'pay', label: `Pay the fine · ${fine} pence`, hint: 'Settles it with the magistrate now and eases the warrant.',
            blocked: !Number.isFinite(coins) ? 'You cannot pay from here yet.' : coins < fine ? `You hold ${coins} pence, short of the fine.` : null},
        {id: 'papers', label: 'Show your papers', hint: 'He reads what you hold; a post the city keeps on its books is answered for by your office.',
            blocked: c.vouched ? null : ctx.papers ? 'He reads them and they do not clear you.' : 'You hold no papers he would read.'},
        {id: 'flee', label: 'Walk away', hint: 'He saw you go; it is one more thing the police know of you.', blocked: null}]}));
    return view.length || slice.closed.length ? {cases: view, lines: slice.closed.slice(-3).map(c => c.line)} : null;
}

// ---- routes (one per call; the host persists the effects and the slice in one save)
const close = (c, how, at, line) => { slice = {...slice, closed: [...slice.closed, {id: c.id, how, at, line}].slice(-CAP)}; return line; };
/** Resolve one open case by one route. `ctx` as for lawView plus `at` (clock minute). Throws a player-readable reason when the route is closed. */
export function takeRoute(state, caseId, route, ctx = {}) {
    const c = openCases(state, ctx).find(x => x.id === caseId && x.proven);
    if(!c) throw Error('That case is not open.');
    const at = Number.isFinite(ctx.at) ? ctx.at : 0, cap = nameOf(c);
    const cmd = name => domainRegistry.command('heat', name);
    if(route === 'talk') {
        if((heatRow()?.level ?? 0) >= LAW_DIALS.pleaBelowLevel.value) throw Error('The police are asking after you by name; he has his orders.');
        return close(c, 'talked', at, `${cap} ${verb(c, 'listens, grumbles, and lets', 'listen, grumble, and let')} you off with a warning. The police still have your name.`);
    }
    if(route === 'papers') {
        if(!c.vouched) throw Error(ctx.papers ? 'He reads them and they do not clear you.' : 'You hold no papers he would read.');
        return close(c, 'papers', at, `${cap} ${verb(c, 'reads your papers and passes', 'read your papers and pass')} the matter to your office. It is not the magistrate's now.`);
    }
    if(route === 'flee') {
        cmd('recordAct')({authority: POLICE, weight: LAW_DIALS.fleeWeight.value, id: `law-flee:${c.id}`, at, known: true, witness: 'a constable'});
        return close(c, 'fled', at, `You walk away. ${cap} saw you go, and the police know it.`);
    }
    if(route === 'pay') {
        const owe = c.penalty.amount;
        if(!(ctx.coins >= owe)) throw Error(Number.isFinite(ctx.coins) ? `You hold ${ctx.coins} pence, short of the fine.` : 'You cannot pay from here yet.');
        const tag = c.id.slice(0, 40), raised = cmd('raiseFine')({authority: POLICE, dutyId: 'case', add: 0, at, tag});
        if(raised == null) throw Error('The magistrate has no way to collect from you yet.');
        const key = heatFines().find(f => f.duty === 'case' && !f.settled && f.authority === POLICE && f.key.startsWith(`case:${tag}@`))?.key;
        if(!key) throw Error('The fine could not be found.');
        const prior = slice;
        close(c, 'paid', at, `You paid the magistrate ${raised} pence. The warrant is settled; the police keep your name but are no longer asking after you as wanted.`);
        try { cmd('settleFine')(key, raised); } catch(error) { slice = prior; throw error; }
        cmd('easeActs')({authority: POLICE, to: LAW_DIALS.easedTo.value});
        return slice.closed.at(-1).line;
    }
    throw Error('Unknown route.');
}

registerDomain({id: 'lotm_law', deps: ['heat'], initialState: fresh,
    save: () => slice.closed.length ? structuredClone(slice) : undefined, // an untouched life writes no key
    validate: s => { if(s != null && s.family !== LAW_FAMILY) throw Error('Lotm law: wrong family.'); },
    migrate: migrateLaw, load: s => { slice = migrateLaw(s); },
    projection: () => structuredClone(slice)});
