import {awakenedStatusCard} from './cheat_cards.js';
import {definePanel} from './panel_kit.js';
import {updateWorkspace} from './workspace_layout.js';
import {getDisplaySetting, subscribeDisplaySettings} from './display_settings.js';

const coreStats = ['strength', 'agility', 'dexterity', 'intuition', 'magic'];
const node = (tag, text = '') => {const n = document.createElement(tag); n.textContent = text; return n;};
export function createStatusWindow({read, onKnown = () => {}}) {
    const panel = node('section'); panel.id = 'status_window_panel'; panel.className = 'status_window'; panel.hidden = true;
    panel.tabIndex = 0;
    panel.setAttribute('role', 'region');
    // Existing awakened saves restore silently; only a live transition scrolls.
    let known = !!awakenedStatusCard(read().cheats);
    document.getElementById('character_div').append(panel);
    const level = node('span'); level.dataset.statusLevel = '';
    const levelRow = node('div'); levelRow.className = 'status_window_row'; levelRow.append(node('span', 'Level'), level); panel.append(levelRow);
    const values = new Map();
    for(const stat of coreStats) {
        const row = node('div'), value = node('span'); row.className = 'status_window_row'; row.dataset.panelRow = '';
        value.dataset.statusStat = stat;
        row.append(node('span', stat[0].toUpperCase() + stat.slice(1)), value); panel.append(row); values.set(stat, value);
    }
    const fields = {};
    for(const [key, label] of [['titles', 'Earned titles'], ['points', 'System points'], ['quests', 'Quests']]) {
        const section = node('div'); section.className = 'status_window_detail';
        const value = node('p'); value.setAttribute(`data-status-${key}`, ''); section.append(node('strong', label), value); panel.append(section); fields[key] = value;
    }
    function render() {
        const snapshot = read(), entry = awakenedStatusCard(snapshot.cheats);
        panel.hidden = !entry;
        if(!entry) {delete panel.dataset.fitWant; return;}
        const newlyKnown = !known; known = true;
        panel.setAttribute('aria-label', 'Status window contents');
        onKnown();
        panel.dataset.density = getDisplaySetting('panel.status-window.density') || 'compact';
        level.textContent = String(snapshot.level);
        for(const [stat, value] of values) value.textContent = snapshot.stats[stat].toFixed(1);
        fields.titles.textContent = snapshot.titles.join(', ') || 'No titles earned yet.';
        fields.points.textContent = String(entry.card.state.points ?? 0);
        fields.quests.textContent = 'No system quests yet. For now, the system only records what you know.';
        // R22b (Weibao, 2026-10-17): compact by default; comfortable stays a setting.
        // R21c: in the parity shell the window sits under You and yields like the secondary stats:
        // it may grow the top row only to the elastic default, then scrolls inside You.
        const want = String(Math.ceil(panel.scrollHeight)); if(panel.dataset.fitWant !== want) panel.dataset.fitWant = want;
        if(newlyKnown) {
            // Lay out the revealed shell before moving its useful row into view.
            updateWorkspace();
            levelRow.scrollIntoView({block: 'nearest', inline: 'nearest', behavior: 'instant'});
        }
    }
    render();
    definePanel({id: 'status-window', title: 'Status window', role: 'character', node: panel,
        defaultDock: 'left', after: 'shell-character', discovered: () => !!awakenedStatusCard(read().cheats),
        eligible: () => !!awakenedStatusCard(read().cheats), unavailableReason: () => 'Your system has not awakened yet.',
        settings: [{key: 'density', label: 'Row spacing', description: 'Choose comfortable or compact spacing for your known stats.',
            options: [['comfortable', 'Comfortable'], ['compact', 'Compact']], default: 'compact'}]});
    const unsubscribe = subscribeDisplaySettings(render);
    return {render, destroy() {unsubscribe(); panel.remove();}};
}
