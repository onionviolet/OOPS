// OB10 follow-up (LARGER_FOUNDATIONS, lane W11-B): the authority answers a beaten collector with its own men. When the Tingen police
// hold you as wanted (heat.js palette, last level), they decide once, by dial, to send two constables to your door; that decision is a latch in
// the slice `constables@1`, so a few days of heat decay do not undo it. The fight is a tempo opener, read back from the fight log like the
// collector's. Win: more heat, a named bounty (once), and a Nighthawk-level hook once heat passes a further dial (a flag for a later lane, no content).
// Lose, yield or surrender: arrested. A night in the cells (minutes owed to the clock), a magistrate's fine that waits as an owed row, the
// bounty lifted, police heat eased. Nothing runs on the clock and nothing is taken while the player is away (OB4): effects follow a fight or a
// surrender the player chose. No end-of-fight hook exists for openers, and no module here may move the root clock, so the night is recorded
// as owed minutes and a host that supplies configureConstables({advance}) serves it; without one it stays pending and visible.
// Every number is an authored dial with its reason (WPR5/AD49); no source figure exists for any of them.
import {registerTempoOpener} from './tempo_starters.js';
import {registerDomain, domainRegistry} from './domain_registry.js';
import {registerConsequence} from './consequences.js';
import {AUTHORITIES} from './heat.js';
import {LOTM_IDS as I} from './book_world_lotm_ids.js';

export const CONSTABLES_FAMILY = 'constables@1';
export const CONSTABLES_TITLE = 'Constables at the door';
const POLICE = 'tingen_police';
export const CONSTABLES_DIALS = Object.freeze({
    authorityChoice: {value: 'sends_constables', why: 'A police office that has you down as wanted sends men; a laxer one waits for you to be seen in the street. The step is the authority\'s own choice, not a draw.'},
    foeHp: {value: 55, why: 'Trained men with a truncheon each, a step above the hired collector (45), and there are two of them.'},
    foeBody: {value: Object.freeze({attack: 7, agility: 5, dexterity: 5, intuition: 6, attack_speed: .8, defense: 3, crit_rate: .05, crit_multiplier: 1.3, attack_count: 1}),
        why: 'Ordinary adults who do this for the city: one point more attack and defense than the collector, a keener eye. Not Beyonders.'},
    standDownLevel: {value: 1, why: 'Constables keep coming while the police still hold your name (level 1); once heat cools below that they forget the warrant.'},
    winWeight: {value: 2, why: 'Beating two officers in front of each other is a graver known act than the collector\'s assault (1.5), but not yet a hunt on its own.'},
    bountyPence: {value: 480, why: 'Eight weeks of a lodger\'s rent (60 a week): worth a hired man\'s trouble to bring you in, not a fortune. Posted once while it stands.'},
    hookAtHeat: {value: 7, why: 'Wanted starts at 4; a win adds 2, so a first win usually stays under 7 and a second pushes past it. Past it, the city police pass your name upward.'},
    cellMinutes: {value: 720, why: 'One night in the cells, evening to morning.'},
    easedTo: {value: 1.5, why: 'An arrest settles the warrant: they still have your name (level 1 at 1.0) but no longer ask after you as wanted (4.0).'}
});

const RESPONSES = Object.freeze({
    sends_constables: true,
    watches: false
});
export const CONSTABLE_RESPONSES = Object.freeze(Object.keys(RESPONSES));

const fresh = () => ({family: CONSTABLES_FAMILY, handled: [], lines: [], latch: null, bounty: null, hooks: {}, sentence: null, arrests: 0});
const HANDLED_CAP = 40, LINES_CAP = 6;
let slice = fresh(), host = null;
export function configureConstables(h) { host = h && typeof h.advance === 'function' ? h : null; }
const nat = n => Number.isFinite(n) && n >= 0;
export function migrateConstables(s) {
    if(!s || s.family !== CONSTABLES_FAMILY) return fresh();
    const lines = (Array.isArray(s.lines) ? s.lines : []).filter(l => l && typeof l.id === 'string' && typeof l.text === 'string' && Number.isFinite(l.at)).map(l => ({id: l.id, at: l.at, text: l.text})).slice(-LINES_CAP);
    const latch = s.latch && nat(s.latch.at) ? {at: s.latch.at} : null;
    const b = s.bounty, bounty = b && Number.isInteger(b.amount) && b.amount > 0 && nat(b.at) && typeof b.cause === 'string' ? {amount: b.amount, at: b.at, cause: b.cause.slice(0, 60)} : null;
    const hooks = s.hooks && typeof s.hooks === 'object' && !Array.isArray(s.hooks) && nat(s.hooks.nighthawks?.at) ? {nighthawks: {at: s.hooks.nighthawks.at}} : {};
    const sentence = s.sentence && Number.isInteger(s.sentence.minutes) && s.sentence.minutes > 0 ? {minutes: s.sentence.minutes, cause: String(s.sentence.cause ?? '').slice(0, 60)} : null;
    return {family: CONSTABLES_FAMILY, handled: (Array.isArray(s.handled) ? s.handled : []).filter(x => typeof x === 'string').slice(-HANDLED_CAP), lines, latch, bounty, hooks, sentence,
        arrests: Number.isInteger(s.arrests) && s.arrests > 0 ? s.arrests : 0};
}
const untouched = s => !s.handled.length && !s.lines.length && !s.latch && !s.bounty && !Object.keys(s.hooks).length && !s.sentence && !s.arrests;
registerDomain({id: 'constables', deps: ['heat'], initialState: fresh,
    save: () => untouched(slice) ? undefined : structuredClone(slice),
    validate: s => { if(s != null && s.family !== CONSTABLES_FAMILY) throw Error('Constables: wrong family.'); },
    migrate: migrateConstables, load: s => { slice = migrateConstables(s); },
    projection: () => ({...structuredClone(slice), atTheDoor: !!slice.latch}),
    commands: {surrender: ({at} = {}) => surrender(at)}});
registerConsequence({id: 'constables.lines', read: () => slice.lines.map(l => ({id: l.id, at: l.at, text: l.text, cause: `constables:${l.id}`, observerSafe: true}))});
registerConsequence({id: 'constables.bounty', read: () => slice.bounty ? [{id: `bounty:${slice.bounty.cause}`, at: slice.bounty.at,
    text: `The Tingen police have posted a bounty of ${slice.bounty.amount} pence for bringing you in.`, cause: `bounty:${slice.bounty.cause}`, observerSafe: true}] : []});

const project = id => { try { return domainRegistry.project(id) ?? null; } catch { return null; } };
const cmd = (id, name) => domainRegistry.command(id, name);
const levels = AUTHORITIES[POLICE].levels;
const wantedLevel = levels.length;
const policeHeat = () => project('heat')?.heat?.find(h => h.authority === POLICE) ?? null;

// The police's decision, made once at wanted and held until an arrest or the name is forgotten.
function decide(state, choice) {
    const row = policeHeat();
    if(slice.latch && (row?.level ?? 0) < CONSTABLES_DIALS.standDownLevel.value) slice = {...slice, latch: null};
    if(!slice.latch && row && row.level >= wantedLevel && (RESPONSES[choice ?? CONSTABLES_DIALS.authorityChoice.value] ?? true))
        slice = {...slice, latch: {at: Number.isFinite(state?.clock) ? state.clock : 0}};
    return !!slice.latch;
}

// An arrest. The night is served first when a host can serve it (a throw leaves everything untouched); otherwise it stays owed.
function arrest({at, cause, how}) {
    const minutes = CONSTABLES_DIALS.cellMinutes.value;
    if(host) host.advance(minutes);
    cmd('heat', 'easeActs')({authority: POLICE, to: CONSTABLES_DIALS.easedTo.value});
    const fine = cmd('heat', 'raiseFine')({authority: POLICE, dutyId: 'arrest', add: 0, at, tag: cause});
    const lifted = !!slice.bounty;
    slice = {...slice, latch: null, bounty: null, arrests: slice.arrests + 1, sentence: host ? null : {minutes, cause: String(cause).slice(0, 60)}};
    const night = host ? 'You spend a night in the cells.' : 'You are to spend a night in the cells.';
    return `${how} ${night}${fine != null ? ` The magistrate writes a fine of ${fine} pence; it waits in Ledger → Owed.` : ' The magistrate has no way to collect a fine from you yet.'}${lifted ? ' The bounty on you is lifted.' : ''} The police still have your name, but they are no longer asking after you as wanted.`;
}
function surrender(at) {
    if(!slice.latch) throw Error('No constables are at your door.');
    const line = arrest({at: Number.isFinite(at) ? at : 0, cause: `surrender:${slice.arrests + 1}`, how: 'You open the door and give yourself up to the constables.'});
    const l = {id: `constables:surrender:${slice.arrests}`, at: Number.isFinite(at) ? at : 0, text: line};
    slice = {...slice, lines: [...slice.lines, l].slice(-LINES_CAP)};
    return l;
}
function won({at, cause}) {
    cmd('heat', 'recordAct')({authority: POLICE, weight: CONSTABLES_DIALS.winWeight.value, id: `constable-assault:${cause}`, at, known: true, witness: 'constables'});
    let out = 'You drove the constables off. The police have seen it, and your name is hotter than before.';
    if(!slice.bounty) {
        slice = {...slice, bounty: {amount: CONSTABLES_DIALS.bountyPence.value, at, cause: String(cause).slice(0, 60)}};
        out += ` They have posted a bounty of ${slice.bounty.amount} pence for bringing you in.`;
    } else out += ` The bounty of ${slice.bounty.amount} pence still stands.`;
    if(!slice.hooks.nighthawks && (policeHeat()?.value ?? 0) >= CONSTABLES_DIALS.hookAtHeat.value) {
        slice = {...slice, hooks: {...slice.hooks, nighthawks: {at}}};
        out += ' The city police can no longer hold you, and your name has gone up to a church office. What follows is not decided yet.';
    }
    return out;
}
function apply(result, {at, cause}) {
    if(result === 'won') return won({at, cause});
    if(result === 'withdrawn') return '';
    return arrest({at, cause, how: result === 'yielded' ? 'You gave in to the constables.' : 'The constables beat you down at your door and took you in.'});
}
// Read finished fights from the log; idempotent (the session id is recorded first and put back if the host cannot take the effects now).
export function resolveConstableFights(state) {
    const log = state?.simulation?.log, out = [];
    if(!Array.isArray(log)) return out;
    for(const e of log) {
        if(!e || typeof e.cause !== 'string' || typeof e.text !== 'string' || !e.text.startsWith(`${CONSTABLES_TITLE}: `) || slice.handled.includes(e.cause)) continue;
        const result = e.text.slice(CONSTABLES_TITLE.length + 2).replace(/\.$/, '');
        if(!['won', 'lost', 'withdrawn', 'yielded'].includes(result)) continue;
        const before = slice, at = Number.isFinite(e.at) ? e.at : 0;
        slice = {...slice, handled: [...slice.handled, e.cause].slice(-HANDLED_CAP)};
        try {
            const text = apply(result, {at, cause: e.cause});
            if(text) { const line = {id: `constablefight:${e.cause}`, at, text}; slice = {...slice, lines: [...slice.lines, line].slice(-LINES_CAP)}; out.push(line); }
        } catch { slice = before; break; }
    }
    return out;
}
// Serve a night still owed (a host that gained a clock seam later calls this).
export function serveSentence() {
    if(!slice.sentence || !host) return false;
    host.advance(slice.sentence.minutes);
    slice = {...slice, sentence: null};
    return true;
}

export function constablesQuote(state, opts = {}) {
    try { resolveConstableFights(state); } catch { /* a paused host retries on the next read */ }
    if(state.actors?.player?.worldId !== I.world || !state.lotm) return {visible: false};
    if(!decide(state, opts.choice)) return {visible: false};
    if(state.simulation?.sessions?.player) return {visible: true, eligible: false, reason: 'Another encounter is already open.'};
    const bounty = slice.bounty ? ` A bounty of ${slice.bounty.amount} pence stands.` : '';
    return {visible: true, eligible: true, reason: `The Tingen police want you by name and have sent two constables.${bounty} Win and your name is hotter and a bounty is posted. Lose or yield and you are arrested: a night in the cells and a fine of ${AUTHORITIES[POLICE].fine.amount} pence. Yielding at once is giving yourself up.`};
}
export function constablesSpec(state, context, helpers) {
    const {me, vitals, parts, enemyProfile} = helpers, hp = CONSTABLES_DIALS.foeHp.value;
    const foe = (n, name) => { const id = `book.lotm.constable.${n}`; return {id, name, side: 'b', speed: 100, hp, maxHp: hp, stamina: 10, maxStamina: 10,
        profile: enemyProfile({...CONSTABLES_DIALS.foeBody.value, health: hp, max_stamina: 10}, name, id), perception: 6, stealth: 5, goals: {survive: .6, aim: .4}}; };
    return {id: 'lotm-constables', title: CONSTABLES_TITLE, floor: 1, conditions: {place: 'Your lodging door'},
        fighters: [
            {id: 'player', name: 'You', side: 'a', speed: 100, parts, hp: vitals.health, maxHp: vitals.max_health, stamina: vitals.stamina, maxStamina: vitals.max_stamina,
                profile: me, perception: me.stats.intuition ?? 5, stealth: me.stats.agility ?? 5, moves: ['jab', 'swing', 'guard', 'tend', 'withdraw', 'yield']},
            foe(1, 'The first constable'), foe(2, 'The second constable')]};
}
registerTempoOpener({id: 'lotm.constables.door', label: 'Constables at the door',
    text: 'Two constables have come for you by name. Fight them, give yourself up with Yield, or withdraw if you can.',
    quote: constablesQuote, spec: constablesSpec});
