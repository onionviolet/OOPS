import {definePanel} from './panel_kit.js';
import {renderHomeView} from './ui/home_view.js';
import {homeOverviewModel} from './home_overview_model.js';
// A home at a glance (HB1-HB6): rooms and fittings strip, upkeep, storage, weather, household and
// construction, read from the existing homes projection. It acts on nothing; Homes owns every action.
// The household field row is world-mechanism knowledge, so a seat that is not told it never sees it (UR80).
export function createHomeOverviewPanel({read, openHomes}) {
    const panel = document.createElement('section');
    panel.id = 'home_overview_panel'; panel.className = 'expedition_panel home-overview';
    const heading = document.createElement('h2'); heading.textContent = 'Home at a glance';
    const body = document.createElement('div');
    panel.append(heading, body);
    let selected = '', signature = '';
    function render() {
        if (!panel.isConnected) return;
        const view = read();
        const model = homeOverviewModel(view, {homeId: selected});
        const sig = JSON.stringify(model);
        if (sig === signature) return;
        signature = sig; selected = model.id || '';
        renderHomeView(body, model, {onSelect: id => { selected = id; signature = ''; render(); }, onOpenHomes: openHomes});
    }
    definePanel({id: 'home-overview', title: 'Home at a glance', role: 'records', node: panel, home: document.getElementById('main_content'), defaultDock: 'center', after: 'homes',
        discovered: () => read().visible, eligible: () => read().visible});
    render();
    return {render};
}
