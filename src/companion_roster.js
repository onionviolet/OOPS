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

// Discovery asks often, so the projection is kept for one game minute and one expansion step.
let memo = {key: '', rows: []};
function readCompanions() {
    const expansion = readPort('expansion');
    let minute = 0; try { minute = calendarMinutes(current_game_time); } catch { minute = 0; }
    const key = `${minute}:${expansion?.sequence ?? 'none'}:${expansion?.clock ?? 'none'}`;
    if (memo.key === key) return memo.rows;
    let people = [];
    try { people = generatedPeopleView(generatedPeopleSnapshot(minute)); } catch { people = []; }
    memo = {key, rows: projectCompanions(expansion, people)};
    return memo.rows;
}

const anyone = () => readCompanions().length > 0;

function createRosterPanel() {
    const panel = node('section', null, {id: 'companion_roster_panel', class: 'reference-panel expedition_panel'});
    panel.dataset.surfaceType = 'reference';
    const count = node('p', ''), list = node('ul', null, {'aria-label': 'People with you'});
    panel.append(node('h2', 'Companions'), count, list);
    const render = visibleRenderer(panel, readCompanions, rows => {
        count.textContent = rows.length ? plural(rows.length, 'person', 'people') : '';
        syncList(list, rows, 'Nobody travels with you or has settled near you yet. Meet people in the Village.');
    });
    panel.render = render;
    whenPortsReady(() => render(true));
    definePanel({id: 'companions', title: 'Companions', role: 'records', node: panel, home: document.getElementById('main_content'),
        discovered: anyone, eligible: anyone, emptyText: 'Meet someone who joins you to see them here'});
    return panel;
}

let panel = null;
registerDomain({id: 'companions', deps: [], initialState: () => null, refresh: () => panel?.render(false), panels: [() => { panel = createRosterPanel(); }]});

registerChangeCounter('companions', {read: () => (readPort('expansion') ? readCompanions().map(row => row.key) : null), showing: () => !!panel?.checkVisibility?.()});
