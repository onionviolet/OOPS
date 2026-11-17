import {registerDomain} from './domain_registry.js';
import {readPort} from './ui_ports.js';
import {registerBoxTab} from './ui/box_tabs.js';
import {hostWorkspaceModule, workspaceModuleFound} from './workspace_layout.js';
import {kitElement} from './ui/kit.js';
import {placeLives} from './ui/journal_lives.js';

// Round 14 slice 4 (PS122) and PS306: the Journal box is YAIR's column 3. Beside Quests, Bestiary, Anthology, Data, Knows and
// Notebook it carries People, Worlds and Beginning, the pages that also have a button in the bottom bar. Each page is the
// module's own node (AR3), hosted through workspace_layout's hostWorkspaceModule, so the bar button (an expanded view of the
// same node), a log link and the tab all open one page. A tab shows while its module has something to show. Nothing is saved.
// Default: the tabs sit after the notes tabs, in the bar's order. Dial: a page that should not join the Journal is dropped from PAGES.
export const PAGES = Object.freeze([
    {id: 'people', module: 'known-people', label: 'People'},
    {id: 'worlds', module: 'optional-worlds', label: 'Worlds'},
    {id: 'beginning', module: 'beginning', label: 'Beginning'},
]);

let hosts = null, watcher = null;
const reveal = id => () => document.querySelector(`[data-box-tab="${id}"]`)?.click();
const world = () => readPort('expansion')?.actors?.player?.worldId;
// Hosting retries on each render pass until the workspace owns its modules; the quest groups also follow the quest list itself,
// through one observer on its box (a quest added, finished or hidden), so no timer runs. placeLives is idempotent, so its own moves end the loop.
function place() { placeLives(document.getElementById('quests_box_div'), world()); }
function refresh() {
    if (!hosts) return;
    for (const h of hosts) if (!h.release && !h.node.firstElementChild) h.release = hostWorkspaceModule(h.module, h.node, reveal(h.id));
    place();
}
function mount() {
    if (typeof document === 'undefined' || hosts) return;
    hosts = PAGES.map(page => {
        const node = kitElement('div', 'journal-page'); node.dataset.journalPage = page.id;
        registerBoxTab({box: 'journal', id: page.id, label: page.label, node, counts: false, when: () => !!node.firstElementChild && workspaceModuleFound(page.module)});
        return {...page, node, release: null};
    });
    const box = document.getElementById('quests_box_div');
    if (box && typeof MutationObserver === 'function') { watcher = new MutationObserver(place); watcher.observe(box, {childList: true, subtree: true, attributes: true, attributeFilter: ['hidden']}); }
    refresh();
}

registerDomain({id: 'journal-home', deps: [], initialState: () => null, refresh, panels: [mount]});
