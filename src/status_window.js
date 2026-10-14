import {awakenedStatusCard} from './cheat_cards.js';
import {definePanel} from './panel_kit.js';
import {getDisplaySetting, subscribeDisplaySettings} from './display_settings.js';

const coreStats = ['strength', 'agility', 'dexterity', 'intuition', 'magic'];
const node = (tag, text = '') => {const n = document.createElement(tag); n.textContent = text; return n;};
export function createStatusWindow({read, onKnown = () => {}}) {
    const panel = node('section'); panel.id = 'status_window_panel'; panel.className = 'status_window'; panel.hidden = true;
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
        if(!entry) return;
        onKnown();
        panel.dataset.density = getDisplaySetting('panel.status-window.density') || 'comfortable';
        level.textContent = String(snapshot.level);
        for(const [stat, value] of values) value.textContent = snapshot.stats[stat].toFixed(1);
        fields.titles.textContent = snapshot.titles.join(', ') || 'No titles earned yet.';
        fields.points.textContent = String(entry.card.state.points ?? 0);
        fields.quests.textContent = 'No system quests yet. For now, the system only records what you know.';
    }
    render();
    definePanel({id: 'status-window', title: 'Status window', role: 'character', node: panel,
        defaultDock: 'left', after: 'vitals', discovered: () => !!awakenedStatusCard(read().cheats),
        eligible: () => !!awakenedStatusCard(read().cheats), unavailableReason: () => 'Your system has not awakened yet.',
        settings: [{key: 'density', label: 'Row spacing', description: 'Choose comfortable or compact spacing for your known stats.',
            options: [['comfortable', 'Comfortable'], ['compact', 'Compact']], default: 'comfortable'}]});
    const unsubscribe = subscribeDisplaySettings(render), timer = setInterval(render, 250);
    return {render, destroy() {clearInterval(timer); unsubscribe(); panel.remove();}};
}
