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
const BOND_SCHEMA = 1;
const BOND_KEY = /^(party:lio|person:[\w-]{1,64})$/;
const freshBonds = () => ({schema: BOND_SCHEMA, bonds: {}});
let bondState = freshBonds(), bondVersion = 0;
const bondListeners = new Set();

export function validateBonds(slice) {
    const bad = reason => { throw new Error(`Invalid companion bonds: ${reason}`); };
    if (slice == null) return;
    if (typeof slice !== 'object' || slice.schema !== BOND_SCHEMA || !slice.bonds || typeof slice.bonds !== 'object') bad('shape');
    for (const [key, bond] of Object.entries(slice.bonds)) {
        if (!BOND_KEY.test(key)) bad(`key ${key}`);
        if (!Number.isSafeInteger(bond?.level) || bond.level < 0) bad('level');
        if (!Array.isArray(bond.memory) || bond.memory.length > BOND_MEMORY_CAP) bad('memory');
        for (const m of bond.memory) if (!BOND_RITES[m?.rite] || typeof m.preferred !== 'boolean' || !Number.isFinite(m.when) || typeof m.line !== 'string' || m.line.length > 120) bad('memory entry');
    }
}
export const migrateBonds = slice => (slice == null ? freshBonds() : structuredClone(slice));

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
    bondState.bonds[key] = performBondRite(bondState.bonds[key], rite, temperament, when);
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
        const away = p ? (p.status === 'on_road') : false;
        return {...row, temperament, level: bond?.level || 0, parts: bondParts(bond, temperament, known),
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
                box.append(node('ul', null, {class: 'bond-parts'}), node('ul', null, {class: 'bond-memory', 'aria-label': 'Remembered scenes'}), node('div', null, {class: 'bond-actions', role: 'group'}));
                li.append(box);
            }
            const [parts, memory, actions] = box.children;
            const sync = (ul, lines) => { if (ul.dataset.sig !== lines.join('\n')) { ul.dataset.sig = lines.join('\n'); ul.replaceChildren(...lines.map(t => node('li', t))); } };
            sync(parts, row.parts); sync(memory, row.memory);
            if (!actions.children.length) for (const rite of Object.keys(BOND_RITES)) {
                const b = node('button', BOND_RITES[rite][0].toUpperCase() + BOND_RITES[rite].slice(1), {type: 'button'}); b.dataset.bondRite = rite; actions.append(b);
            }
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
    refresh: () => panel?.render(false), panels: [() => { panel = createRosterPanel(); }]});

registerChangeCounter('companions', {read: () => (readPort('expansion') ? readCompanions().map(row => row.key) : null), showing: () => !!panel?.checkVisibility?.()});
