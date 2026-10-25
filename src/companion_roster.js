import {registerDomain} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {current_game_time} from './game_time.js';
import {calendarMinutes} from './world_rhythm.js';
import {generatedPeopleSnapshot} from './generated_people_ui.js';
import {generatedPeopleView} from './generated_people.js';
import {PARTY_HELPER} from './native_battle_contracts.js';
import {readPort, whenPortsReady} from './ui_ports.js';
import {registerChangeCounter} from './change_badges.js';
import {node, syncList, visibleRenderer, plural, minutesText} from './reference_kit.js';
import {COMPANION_PROFILES, profileFor, issueWish, wishSignature, wishText, progressWish, departure, returnInDays, comeBack, DAY} from './companion_wishes.js';

// SX6: Companions. One line for each person who is with you or settled near you and whom you have
// met: Lio once you have met him, and the travellers who have become residents or are visiting.
// Each line says where they are and what they are doing, from the readers the party panel and the
// travellers panel already use. A person you have not met never appears (the view hides them), and
// nothing private about them is shown. Their details stay in People and Travelers.

const ACTION_WORDS = {resting: 'resting', talking: 'talking', planning: 'planning', browsing: 'browsing', traveling: 'on the road'};
const STATUS_WORDS = {resident: 'settled here', visiting: 'visiting', on_road: 'on the road'};

// Pure: the expansion state and the generated-people view in, rows out.
export function projectCompanions(expansion, people = []) {
    const rows = [];
    const facts = expansion?.actors?.player?.facts || {};
    if (facts['party.met']) {
        const partner = expansion.simulation?.people?.[PARTY_HELPER], v = partner?.vitals;
        const job = expansion.simulation?.jobs?.find(j => (j.participants || [j.actorId]).includes(PARTY_HELPER));
        const busy = job ? `${job.label}, ${minutesText(Math.max(0, job.due - expansion.clock))} left` : 'free';
        const body = v ? `${Math.round(v.health)}/${Math.round(v.max_health)} health, ${Math.round(v.stamina)}/${Math.round(v.max_stamina)} stamina` : 'condition unknown';
        rows.push({key: 'party:lio', name: 'Lio', detail: `${partner?.location || 'Village'} · ${busy} · ${body}`});
    }
    for (const p of people) {
        if (!p.met) continue;
        rows.push({key: `person:${p.id}`, name: p.name, detail: `${p.role} · ${STATUS_WORDS[p.status] || p.status} · ${ACTION_WORDS[p.action] || p.action}`});
    }
    return rows;
}

// IM33 (fixture-level slice, AD33 keeps NPC-heavy work small): a bond rite by temperament. Each
// temperament (the generated-people traits) has a preferred rite that gives the larger gain; any
// other rite still works at the base gain. Each rite appends one scene-memory line, and the memory
// is capped so a long friendship cannot grow a save without bound. Pure: bond state in, new state out.
export const BOND_RITES = {share_meal: 'shared a meal', walk_together: 'walked together', quiet_company: 'sat in quiet company', trade_stories: 'traded stories', work_alongside: 'worked side by side'};
export const TEMPERAMENT_RITE = {kind: 'share_meal', curious: 'trade_stories', patient: 'walk_together', practical: 'work_alongside', sociable: 'trade_stories', reserved: 'quiet_company'};
export const BOND_GAIN = {base: 1, preferred: 3};
export const BOND_MEMORY_CAP = 5;

export function performBondRite(bond, rite, temperament, when = 0) {
    if (!BOND_RITES[rite]) throw new Error(`Unknown bond rite: ${rite}`);
    if (!TEMPERAMENT_RITE[temperament]) throw new Error(`Unknown temperament: ${temperament}`);
    const preferred = TEMPERAMENT_RITE[temperament] === rite;
    const gain = preferred ? BOND_GAIN.preferred : BOND_GAIN.base;
    const memory = [...(bond?.memory || []), {rite, preferred, when, line: `You ${BOND_RITES[rite]}${preferred ? ' and it suited them' : ''}.`}].slice(-BOND_MEMORY_CAP);
    return {level: (bond?.level || 0) + gain, memory};
}

// Wiring (IM33 live slice). Save slice `companion_bonds` = {schema: 1, bonds: {rowKey: {level, memory}}};
// a save without it starts empty (migration: none needed, AR6, old saves unchanged). Lio has no
// generated traits, so his temperament is a proposal: practical. A person's rite preference comes
// from their first trait, which stays hidden until you have learned it; the memory line after a
// rite ("it suited them") is how play reveals it.
export const LIO_TEMPERAMENT = 'practical';
// Schema 2 (W3 G29) adds optional per-bond `wish`, `gone`, `issued` and `note`; schema 1 saves still validate and migrate.
const BOND_SCHEMA = 2;
const BOND_KEY = /^(party:lio|person:[\w-]{1,64})$/;
const freshBonds = () => ({schema: BOND_SCHEMA, bonds: {}});
let bondState = freshBonds(), bondVersion = 0;
const bondListeners = new Set();

export function validateBonds(slice) {
    const bad = reason => { throw new Error(`Invalid companion bonds: ${reason}`); };
    if (slice == null) return;
    if (typeof slice !== 'object' || ![1, BOND_SCHEMA].includes(slice.schema) || !slice.bonds || typeof slice.bonds !== 'object') bad('shape');
    for (const [key, bond] of Object.entries(slice.bonds)) {
        if (!BOND_KEY.test(key)) bad(`key ${key}`);
        if (!Number.isSafeInteger(bond?.level) || bond.level < 0) bad('level');
        if (!Array.isArray(bond.memory) || bond.memory.length > BOND_MEMORY_CAP) bad('memory');
        if (bond.wish != null && !(['rite', 'level'].includes(bond.wish.kind) && Number.isFinite(bond.wish.since) && (bond.wish.kind === 'level' ? Number.isSafeInteger(bond.wish.target) : BOND_RITES[bond.wish.rite] && Number.isSafeInteger(bond.wish.need) && Number.isSafeInteger(bond.wish.done)))) bad('wish');
        if (bond.gone != null && !(Number.isFinite(bond.gone.since) && typeof bond.gone.reason === 'string' && bond.gone.reason.length <= 120)) bad('gone');
        if (bond.note != null && (typeof bond.note !== 'string' || bond.note.length > 120)) bad('note');
        for (const m of bond.memory) if (!BOND_RITES[m?.rite] || typeof m.preferred !== 'boolean' || !Number.isFinite(m.when) || typeof m.line !== 'string' || m.line.length > 120) bad('memory entry');
    }
}
// DAY is re-exported so a world file can state a patience in the same unit.
export {DAY, COMPANION_PROFILES};
export const migrateBonds = slice => (slice == null ? freshBonds() : {...structuredClone(slice), schema: BOND_SCHEMA});

// Pure: the reasons in parts for one row. `temperament` is the true one; `known` says whether you
// have learned it. Nothing hidden is named until it is known.
export function bondParts(bond, temperament, known) {
    const parts = [];
    if (known) parts.push(`You know they are ${temperament}: ${BOND_RITES[TEMPERAMENT_RITE[temperament]]} suits them (+${BOND_GAIN.preferred}).`);
    else parts.push(`You do not yet know what suits them. Any rite gives +${BOND_GAIN.base}; the right one gives +${BOND_GAIN.preferred}.`);
    const last = bond?.memory?.at(-1);
    if (last) parts.push(`Last time: ${last.line} (${last.preferred ? `+${BOND_GAIN.preferred}` : `+${BOND_GAIN.base}`}).`);
    parts.push(`Memory keeps the latest ${BOND_MEMORY_CAP} scenes.`);
    return parts;
}

export function bondLevel(key) { return bondState.bonds[key]?.level || 0; }
export function doBondRite(key, rite, temperament, when) {
    if (!BOND_KEY.test(key)) throw new Error(`Unknown companion: ${key}`);
    const old = bondState.bonds[key];
    if (old?.gone) throw new Error('They are not here. Go looking for them first.');
    const bond = {...old, ...performBondRite(old, rite, temperament, when)};
    delete bond.note;
    bondState.bonds[key] = progressWish(bond, rite, COMPANION_PROFILES[profileFor(key)]);
    bondVersion++; for (const fn of bondListeners) fn();
    return bondState.bonds[key];
}

// W3 G29: open wishes and leaving. Called from the domain tick with the current rows and game minute;
// a person gets one open wish (no two companions share one) and a free person whose wish stays unmet
// goes back to the road. Lio only voices wishes. Departure is a roster overlay: it never touches the
// party or the generated-people state.
export function stepCompanions(rows, now) {
    let changed = false;
    const open = () => Object.entries(bondState.bonds).filter(([, b]) => b.wish && !b.gone).map(([k, b]) => [k, wishSignature(b.wish)]);
    for (const row of rows) {
        let bond = bondState.bonds[row.key] ?? {level: 0, memory: []};
        const profile = COMPANION_PROFILES[profileFor(row.key)];
        if (bond.gone) continue;
        if (!bond.wish) {
            const taken = open().filter(([k]) => k !== row.key).map(([, sig]) => sig);
            bond = {...bond, wish: issueWish(row.key, bond, now, BOND_RITES, taken), issued: (bond.issued ?? 0) + 1}; changed = true;
        }
        const gone = departure(bond, now, profile, row.name);
        if (gone) { bond = {...bond, gone, note: gone.reason}; changed = true; }
        bondState.bonds[row.key] = bond;
    }
    if (changed) { bondVersion++; for (const fn of bondListeners) fn(); }
    return changed;
}
export function goLooking(key, now) {
    const bond = bondState.bonds[key];
    if (!bond) throw new Error(`Unknown companion: ${key}`);
    const taken = Object.entries(bondState.bonds).filter(([k, b]) => k !== key && b.wish && !b.gone).map(([, b]) => wishSignature(b.wish));
    bondState.bonds[key] = comeBack(key, bond, now, COMPANION_PROFILES[profileFor(key)], BOND_RITES, taken);
    bondVersion++; for (const fn of bondListeners) fn();
    return bondState.bonds[key];
}

// Discovery asks often, so the projection is kept for one game minute, one expansion step and one bond change.
let memo = {key: '', rows: []};
function readCompanions() {
    const expansion = readPort('expansion');
    let minute = 0; try { minute = calendarMinutes(current_game_time); } catch { minute = 0; }
    const key = `${minute}:${expansion?.sequence ?? 'none'}:${expansion?.clock ?? 'none'}:${bondVersion}`;
    if (memo.key === key) return memo.rows;
    let people = [], raw = null;
    try { raw = generatedPeopleSnapshot(minute); people = generatedPeopleView(raw); } catch { people = []; }
    const rawBy = new Map((raw?.people || []).map(p => [`person:${p.id}`, p]));
    const rows = projectCompanions(expansion, people).map(row => {
        const p = rawBy.get(row.key), temperament = p ? p.traits[0] : LIO_TEMPERAMENT;
        const known = !p || p.knownTraits.includes(temperament), bond = bondState.bonds[row.key];
        const profile = COMPANION_PROFILES[profileFor(row.key)], gone = !!bond?.gone;
        const away = (p ? (p.status === 'on_road') : false) || gone;
        const parts = bondParts(bond, temperament, known);
        if (bond?.wish && !gone) parts.unshift(`${row.name} ${wishText(bond.wish)}.${profile.leaves ? '' : ` ${profile.reason}`}`);
        if (bond?.note) parts.push(bond.note);
        if (gone) parts.unshift(`Gone to the wild road. ${profile.reason}`);
        return {...row, temperament, level: bond?.level || 0, parts, gone, waitDays: gone ? returnInDays(bond, minute, profile) : 0,
            memory: (bond?.memory || []).map(m => m.line), away, when: minute};
    });
    memo = {key, rows};
    return rows;
}

const anyone = () => readCompanions().length > 0;

function createRosterPanel() {
    const panel = node('section', null, {id: 'companion_roster_panel', class: 'reference-panel expedition_panel'});
    panel.dataset.surfaceType = 'reference';
    const count = node('p', ''), status = node('p', '', {role: 'status', 'aria-live': 'polite'}), list = node('ul', null, {'aria-label': 'People with you'});
    panel.append(node('h2', 'Companions'), count, status, list);
    const render = visibleRenderer(panel, readCompanions, rows => {
        count.textContent = rows.length ? plural(rows.length, 'person', 'people') : '';
        syncList(list, rows.map(r => ({key: r.key, name: r.name, detail: `${r.detail} · bond ${r.level}`})), 'Nobody travels with you or has settled near you yet. Meet people in the Village.');
        for (const li of list.children) {
            const row = rows.find(r => r.key === li.dataset.key); if (!row) continue;
            let box = li.querySelector('.bond-rite');
            if (!box) {
                box = node('div', null, {class: 'bond-rite'});
                box.append(node('ul', null, {class: 'bond-parts'}), node('ul', null, {class: 'bond-memory', 'aria-label': 'Remembered scenes'}), node('div', null, {class: 'bond-actions', role: 'group'}), node('div', null, {class: 'bond-return', role: 'group'}));
                li.append(box);
            }
            const [parts, memory, actions, back] = box.children;
            const sync = (ul, lines) => { if (ul.dataset.sig !== lines.join('\n')) { ul.dataset.sig = lines.join('\n'); ul.replaceChildren(...lines.map(t => node('li', t))); } };
            sync(parts, row.parts); sync(memory, row.memory);
            if (!actions.children.length) for (const rite of Object.keys(BOND_RITES)) {
                const b = node('button', BOND_RITES[rite][0].toUpperCase() + BOND_RITES[rite].slice(1), {type: 'button'}); b.dataset.bondRite = rite; actions.append(b);
            }
            const ret = back.firstChild ?? back.appendChild(node('button', 'Go looking for them', {type: 'button'}));
            ret.dataset.companionReturn = row.key; ret.hidden = !row.gone; ret.disabled = row.waitDays > 0;
            ret.setAttribute('aria-label', `Go looking for ${row.name}`);
            ret.textContent = row.waitDays > 0 ? `Go looking for them (in ${plural(row.waitDays, 'day', 'days')})` : 'Go looking for them';
            ret.onclick = () => { try { goLooking(row.key, row.when); status.textContent = `${row.name} came back. It is kept with your next save.`; } catch (e) { status.textContent = e.message; } };
            for (const b of actions.children) {
                b.disabled = row.away; b.setAttribute('aria-label', `${BOND_RITES[b.dataset.bondRite]} with ${row.name}`);
                b.onclick = () => {
                    try {
                        const before = bondLevel(row.key), after = doBondRite(row.key, b.dataset.bondRite, row.temperament, row.when).level;
                        status.textContent = `${row.name}: you ${BOND_RITES[b.dataset.bondRite]}. Bond ${before} → ${after}. It is kept with your next save.`;
                    } catch (e) { status.textContent = e.message; }
                };
            }
        }
    });
    panel.render = render; bondListeners.add(() => render(true));
    whenPortsReady(() => render(true));
    definePanel({id: 'companions', title: 'Companions', role: 'records', node: panel, home: document.getElementById('main_content'),
        discovered: anyone, eligible: anyone, emptyText: 'Meet someone who joins you to see them here'});
    return panel;
}

let panel = null;
registerDomain({id: 'companions', deps: [], initialState: freshBonds,
    save: () => (Object.keys(bondState.bonds).length ? structuredClone(bondState) : undefined),
    validate: validateBonds, migrate: migrateBonds,
    load: slice => { bondState = slice ? structuredClone(slice) : freshBonds(); bondVersion++; for (const fn of bondListeners) fn(); },
    tick: minutes => {
        if (!(minutes > 0) || !readPort('expansion')) return;
        let minute = 0; try { minute = calendarMinutes(current_game_time); } catch { return; }
        stepCompanions(readCompanions(), minute);
    },
    refresh: () => panel?.render(false), panels: [() => { panel = createRosterPanel(); }]});

registerChangeCounter('companions', {read: () => (readPort('expansion') ? readCompanions().map(row => row.key) : null), showing: () => !!panel?.checkVisibility?.()});
