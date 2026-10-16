import {centerModes} from './center_modes.js';
import {deferSimulationRender} from './simulation_render.js';
import { getDisplaySettings, getDisplaySetting, replaceDisplaySettings, effectsCap } from './display_settings.js';
import { normalizeLayout, parseLayout, presetLayout, changeModule, reorderModule, layoutStorageKey, normalizeColumns } from './workspace_state.js';
const registry = new Map();
const setProperty=(node,key,value)=>{if(node[key]!==value)node[key]=value;};
const setAttribute=(node,key,value)=>{value=String(value);if(node.getAttribute(key)!==value)node.setAttribute(key,value);};
let owner;
let requestedComposition=false;
const compositionKey=narrow=>`${layoutStorageKey(narrow)}.composition`;
const PARITY_KEY='yairpg.presentation.proto23-parity.v1';
const paritySelected=()=>{try{return localStorage.getItem(PARITY_KEY)==='on';}catch{return false;}};
const SHELL_KEY='yairpg.presentation.proto23-shell.v1';
const shellLayoutKey=(narrow,parity=owner?.parity)=>`${layoutStorageKey(narrow)}.${parity?'proto23-parity':'proto23-shell'}`;
function shellSelected(){try{return localStorage.getItem(SHELL_KEY)==='on';}catch{return false;}}
function makeShellLayout(narrow,{fresh=false}={}){
    let saved;try{if(!fresh)saved=JSON.parse(localStorage.getItem(shellLayoutKey(narrow)));}catch{}
    const layout=saved?.version===1?withDefaults(saved):makePreset('Workspace',narrow);
    if(!saved){layout.columns=[.263,.435,.302];const order=['vitals','shell-character','combat-controls','shell-inventory-tools','belongings','focus','shell-detail','time','location','village-scene','current-work','combat','local-actions','pane-navigation','messages','shell-log-tools'];
        layout.modules.forEach(v=>{v.hidden=!order.includes(v.id);if(v.id==='shell-character'){v.dock='left';v.height=190;}if(v.id==='shell-detail'){v.dock='center';v.height=210;}});
        layout.modules.sort((a,b)=>(order.includes(a.id)?order.indexOf(a.id):999)-(order.includes(b.id)?order.indexOf(b.id):999));layout.modules.forEach((v,i)=>v.order=i);}
    return layout;
}
function selectShell(on,parity=false){
    if(owner.context!=='play')setWorkspaceContext('play');
    if(on&&owner.editing)setEditing(false);
    if(on===owner.shell&&parity===owner.parity)return;
    if(on){
        if(!owner.shell){owner.baseLayout=owner.layout;owner.baseComposition=owner.composition;}
        owner.parity=parity;owner.layout=makeShellLayout(owner.narrow);owner.composition=true;
    } else {owner.layout=owner.baseLayout||read(owner.narrow);owner.composition=owner.baseComposition??requestedComposition;owner.parity=false;}
    owner.shell=on;owner.toolbar.querySelector('[data-workspace-action=presentation]').value=on?(parity?'proto23-parity':'proto23-shell'):'existing';
    try{localStorage.setItem(PARITY_KEY,on&&parity?'on':'off');if(!parity)localStorage.setItem(SHELL_KEY,on?'on':'off');}catch{}
    updateWorkspace();document.dispatchEvent(new CustomEvent('workspace-presentation-change'));
}
// A composition map changes destinations inside this sole registry/mover. The
// native nodes, shell IDs, expansion return paths and command owners stay intact.
function parityRegion(id){
    if(['vitals','shell-character'].includes(id))return 'player';
    if(id==='focus')return 'focus';
    if(id==='shell-detail')return registry.get('combat')?.eligible()?'actions':'focus';
    if(['belongings','combat-controls','shell-inventory-tools'].includes(id))return 'inventory';
    if(['messages','shell-log-tools'].includes(id))return 'log';
    return 'actions';
}
const el = (tag, cls, text) => { const node = document.createElement(tag); if (cls) node.className = cls; if (text) node.textContent = text; return node; };
function button(label, action, id) { const b = el('button', '', label); b.type = 'button'; b.dataset.workspaceAction = action; if (id) b.dataset.module = id; return b; }
export function workspaceOwns(node) { return !!owner && [...registry.values()].some(v => v.node === node); }
export function registerWorkspaceModule({ id, title, node, home = node?.parentNode, homeHost, defaultDock, after, eligible = () => true, discovered = () => true, critical = false, decorateShell, unavailableReason }) {
    if (!/^[a-z][a-z0-9_-]*$/.test(id) || !node || !home) throw new Error('Workspace modules require a stable safe ID, node and home.');
    const old = registry.get(id);
    if (old) { if (old.node !== node) { if (owner && old.node.parentNode) old.node.replaceWith(node); old.node = node; } old.eligible = eligible; old.discovered = discovered; old.critical = critical; old.decorateShell = decorateShell; old.unavailableReason = unavailableReason; updateWorkspace(); return old; }
    const placeholder = null;
    const dock = defaultDock || (typeof home === 'string' ? home : home?.dock);
    const module = { id, title: String(title), node, home: (typeof homeHost === 'string' ? document.getElementById(homeHost) : homeHost) || (home?.append ? home : node.parentNode), homeId: typeof homeHost === 'string' ? homeHost : (node.parentNode?.id || null), defaultDock: ['left','center','right','float'].includes(dock) ? dock : undefined, eligible, discovered, critical, placeholder, after, decorateShell, unavailableReason }; registry.set(id, module);
    if (owner) { owner.layout = withDefaults(owner.layout); makeShell(module); updateWorkspace(); }
    return module;
}
function makeShell(module) {
    if (module.shell) return;
    if (!module.placeholder) { module.placeholder = document.createComment(`workspace:${module.id}`); module.node.before(module.placeholder); }
    const shell = el('section', 'workspace-module'); shell.dataset.module = module.id; shell.tabIndex = -1;
    const header = el('div', 'workspace-module-header');
    const handle = button('↕', 'handle', module.id); handle.className = 'workspace-drag-handle'; handle.draggable = false; handle.title = 'Drag to reorder or dock. Arrow keys move; left/right changes dock.'; 
    const title = el('strong'); title.tabIndex = 0; title.setAttribute('role', 'button');
    const toggle = () => { if (!owner.editing && !module.critical) { const state = owner.layout.modules.find(v => v.id === module.id); apply(module.id, {collapsed: !state.collapsed}); } };
    title.addEventListener('click', toggle);
    title.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    const status=el('small','workspace-panel-status');
    header.append(handle, title, status, button('Collapse', 'collapse', module.id), button('Expand', 'expand', module.id), button('Pin', 'pin', module.id));
    const details = el('details', 'workspace-module-controls'); const summary = el('summary', '', 'Options'); details.append(summary); 
    const label = el('label', '', 'Dock '), select = el('select'); select.dataset.workspaceAction = 'dock'; select.dataset.module = module.id;
    ['left', 'center', 'right', 'float'].forEach(d => { const option = el('option', '', d === 'float' ? 'Floating' : d); option.value = d; select.append(option); }); label.append(select); details.append(label);
    details.append(button('Earlier', 'earlier', module.id), button('Later', 'later', module.id), button('Hide', 'hide', module.id));
    for (const dimension of ['width', 'height']) { const label = el('label', 'workspace-resize', `${dimension} `), range = el('input'); range.type = 'range'; range.min = dimension === 'width' ? '260' : '40'; range.max = '1000'; range.step = '20'; range.dataset.workspaceAction = dimension; range.dataset.module = module.id; label.append(range); details.append(label); }
    const moves = el('div', 'workspace-float-controls'); moves.append(button('←', 'float-left', module.id), button('↑', 'float-up', module.id), button('↓', 'float-down', module.id), button('→', 'float-right', module.id)); details.append(moves);
    const body = el('div', 'workspace-module-body'); body.append(module.node); header.append(details); shell.append(header, body); for (const edge of ['e','s','se']) { const grip = el('button','workspace-resize-grip'); grip.type='button'; grip.dataset.resize=edge; grip.dataset.module=module.id; shell.append(grip); } module.shell = shell; module.header=header; module.body = body; labelShell(module, false); owner.docks.left.append(shell);
}
function syncPanelHeader(module,state,eligible) {
    const header=module.header;
        const status=header.querySelector('.workspace-panel-status');
        const count=module.node.querySelectorAll('.inventory_item_control,[data-panel-row],.skill_div,.message_common').length;
        const purse=owner.parity&&module.id==='belongings'?document.getElementById('money_div')?.textContent.trim().replace(/^Your purse contains:\s*/, ''):null;
        const statusText=purse??(!eligible?(module.unavailableReason?.()||'Return here to use this panel'):count?`${count} entries`:({focus:module.shell.dataset.focusEmpty==='true'?'Inspect a target':'Current target',records:'Choose a tab','local-actions':'Available here',projects:`${module.node.querySelectorAll('details').length} projects`}[module.id]||(state.collapsed?'Collapsed · expand to review':'Ready')));
        if(status.textContent!==statusText)status.textContent=statusText;
        const description=purse?`Purse: ${purse}`:statusText;
        setProperty(status,'title',description);setAttribute(status,'aria-label',description);
        setAttribute(header.querySelector('strong'),'aria-expanded',!state.collapsed);
        for(const control of ['hide','collapse'])setProperty(header.querySelector(`[data-workspace-action="${control}"]`),'disabled',module.critical);
        setProperty(header.querySelector('[data-workspace-action=expand]'),'textContent',module.expanded?'Return':'Expand');
        const collapse=header.querySelector('[data-workspace-action="collapse"]'),collapseLabel=`${state.collapsed?'Open':'Collapse'} ${module.title}`;
        setProperty(collapse,'textContent',state.collapsed?'▸':'▾');setProperty(collapse,'title',collapseLabel);setAttribute(collapse,'aria-label',collapseLabel);setAttribute(collapse,'aria-expanded',!state.collapsed);
        const pin=header.querySelector('[data-workspace-action="pin"]'),pinLabel=`${state.pinned?'Unpin':'Pin'} ${module.title}`;
        setProperty(pin,'textContent',state.pinned?'Unpin':'Pin');setProperty(pin,'title',pinLabel);setAttribute(pin,'aria-label',pinLabel);setAttribute(pin,'aria-pressed',state.pinned);
}
function save() { try { const raw=JSON.stringify(owner.layout);localStorage.setItem(owner.context==='play'&&owner.shell?shellLayoutKey(owner.narrow):layoutStorageKey(owner.narrow)+(owner.context==='authoring'?'.authoring':''),raw);if(owner.context==='play'&&!owner.shell){if(owner.composition)localStorage.setItem(compositionKey(owner.narrow),raw);else localStorage.removeItem(compositionKey(owner.narrow));} } catch { owner.status.textContent = 'Layout works for this session; browser storage is unavailable.'; } }
// A saved layout that predates a module gets that module's default dock and anchor;
// saved entries are read as stored and nothing is written until the player changes layout.
function withDefaults(layout) {
    const previous = new Set(layout?.modules?.map(v => v.id) || []); const result = normalizeLayout(layout, [...registry.keys()]);
    const added = result.modules.filter(v => !previous.has(v.id)); if (!previous.size || !added.length) { if (!previous.size) added.forEach(v => { if (registry.get(v.id).defaultDock) v.dock = registry.get(v.id).defaultDock; }); return result; }
    added.forEach(v => { const m = registry.get(v.id); if (m.defaultDock) v.dock = m.defaultDock; });
    const rest = result.modules.filter(v => previous.has(v.id));
    added.forEach(v => { const at = rest.findIndex(r => r.id === registry.get(v.id).after); if (at < 0) rest.push(v); else { rest.splice(at + 1, 0, v); if (!registry.get(v.id).defaultDock && registry.get(rest[at].id)) v.dock = rest[at].dock; } });
    rest.forEach((v, order) => v.order = order); result.modules = rest; return result;
}
function makePreset(name, narrow = owner?.narrow) { const layout = presetLayout(name, [...registry.keys()]); layout.density = owner?.layout.density || 'comfortable'; if (name !== 'Focus' && name !== 'Workspace') layout.modules.forEach(v => { if (registry.get(v.id).defaultDock) v.dock = registry.get(v.id).defaultDock; }); if(name==='Workspace') { layout.modules.forEach(v=>{if(v.id==='customization'&&registry.get(v.id).defaultDock)v.dock=registry.get(v.id).defaultDock;if(v.id==='ledger')v.dock='right';}); const order=narrow ? ['focus','time','location','village-scene','current-work','combat','local-actions','vitals','combat-controls','stance','preparation','belongings','equipment-comparison','records','skills','messages','optional-worlds','beginning','patrol','supplies'] : ['vitals','combat-controls','stance','preparation','belongings','equipment-comparison','focus','time','location','village-scene','current-work','combat','local-actions','records','skills','messages','optional-worlds','beginning','patrol','supplies']; layout.modules.sort((a,b)=>(order.indexOf(a.id)<0?999:order.indexOf(a.id))-(order.indexOf(b.id)<0?999:order.indexOf(b.id))); layout.modules.forEach((v,i)=>v.order=i); return layout; } const context = new Set(['vitals','time','location','combat-nav','native-vitals','native-time','native-location','combat-navigation']); layout.modules.sort((a,b) => ((registry.get(a.id).critical || context.has(a.id)) ? 0 : 1) - ((registry.get(b.id).critical || context.has(b.id)) ? 0 : 1)); layout.modules.forEach((v,order) => { v.order=order; if(name==='Focus' && (registry.get(v.id).critical || context.has(v.id)))v.collapsed=false; }); return layout; }
function read(narrow) { try { const raw = localStorage.getItem(layoutStorageKey(narrow));requestedComposition=!narrow&&(!raw||localStorage.getItem(compositionKey(narrow))===raw);if(!raw)return makePreset('Workspace', narrow);const value=JSON.parse(raw);return value?.version===1&&Array.isArray(value.modules)?withDefaults(value):makePreset('Workspace',narrow); } catch {requestedComposition=!narrow;return makePreset('Workspace',narrow);} }
function apply(id, patch) { owner.layout = changeModule(owner.layout, id, patch); save(); updateWorkspace(); }
function action(event) {
    const control = event.target.closest('[data-workspace-action]'); if (!control || !owner.root.contains(control)) return;
    const a = control.dataset.workspaceAction, id = control.dataset.module, state = owner.layout.modules.find(v => v.id === id);
    if (a === 'presentation') {selectShell(control.value!=='existing',control.value==='proto23-parity');return;}
    if (a === 'context') { setWorkspaceContext(owner.context==='authoring'?'play':'authoring'); return; }
    if (a === 'edit-layout') { if(owner.shell)selectShell(false);setEditing(!owner.editing); owner.menu.open=false; owner.menuSummary.focus({preventScroll:true}); return; }
    if (a === 'preset') { if(owner.shell)selectShell(false);owner.composition=!owner.narrow&&control.value==='Workspace';owner.layout = makePreset(control.value); save(); updateWorkspace(); return; }
    if(a==='toggle-density'){owner.layout.density=owner.layout.density==='compact'?'comfortable':'compact';save();updateWorkspace();return;}
    if (a === 'density') { owner.layout.density = control.value; save(); updateWorkspace(); return; }
    if (a === 'craft-detail') { applyCraftDetail(control.value); try { localStorage.setItem(CRAFT_DETAIL_KEY, control.value); } catch { owner.status.textContent = 'Crafting detail placement applies for this session; browser storage is unavailable.'; } return; }
    if (a === 'colors') { applyColorScheme(control.value); try { localStorage.setItem(COLOR_KEY, control.value); } catch { owner.status.textContent = 'Colors apply for this session; browser storage is unavailable.'; } return; }
    if (a === 'reset') { owner.composition=!owner.narrow;owner.layout = owner.shell?makeShellLayout(owner.narrow,{fresh:true}):makePreset('Workspace'); save(); updateWorkspace(); return; }
    // One export (AJ12): layout plus this browser's color scheme and display settings. Layout-only JSON still imports.
    if (a === 'export') { owner.config.value = JSON.stringify({...normalizeLayout(owner.layout, [...registry.keys()]), colors: readColorScheme(), display: getDisplaySettings()}, null, 2); owner.status.textContent = 'Layout configuration ready to copy. It contains panel positions, colors and display settings only.'; return; }
    if (a === 'import') { try { const raw = JSON.parse(owner.config.value);owner.composition=false;if (raw.version !== 1 || !Array.isArray(raw.modules)) throw Error(); owner.layout = normalizeLayout(raw, [...registry.keys()]); save();
        if (COLOR_SCHEMES.includes(raw.colors)) { applyColorScheme(raw.colors); const picker = owner.toolbar.querySelector('[data-workspace-action="colors"]'); if (picker) picker.value = raw.colors; try { localStorage.setItem(COLOR_KEY, raw.colors); } catch { /* session only */ } }
        if (raw.display && typeof raw.display === 'object') replaceDisplaySettings(raw.display);
        updateWorkspace(); owner.status.textContent = 'Layout imported.'; } catch { owner.status.textContent = 'Invalid layout. Current layout preserved.'; } return; }
    if (!state) return;
    if (moduleCritical(id) && ['hide', 'collapse'].includes(a)) { owner.status.textContent = 'This panel contains required current actions and stays open.'; return; }
    if (a === 'expand') {if(registry.get(id)?.expanded)centerModes().back();else expandWorkspaceModule(id);return;}
    if (a === 'restore') openWorkspaceModule(id);
    else if (a === 'collapse') apply(id, { collapsed: !state.collapsed });
    else if (a === 'pin') apply(id, { pinned: !state.pinned });
    else if (a === 'hide') { apply(id, { hidden: true }); owner.picker.querySelector(`[data-module="${id}"]`)?.focus(); }
    else if (a === 'dock' && !state.pinned) { apply(id, { dock: control.value });const module=registry.get(id);module.shell.querySelector('.workspace-module-controls').open=false;module.shell.querySelector('.workspace-drag-handle').focus({preventScroll:true}); }
    else if (a === 'width' && !state.pinned && state.dock !== 'float' && !owner.narrow) resizeColumn(state.dock, Number(control.value));
    else if (['width', 'height'].includes(a) && !state.pinned) apply(id, { [a]: Number(control.value) });
    else if (a === 'earlier' || a === 'later') { owner.layout = reorderModule(owner.layout, id, a === 'earlier' ? -1 : 1); save(); updateWorkspace(); }
    else if (a.startsWith('float-') && !state.pinned) { const directions = { 'float-left': [-24, 0], 'float-right': [24, 0], 'float-up': [0, -24], 'float-down': [0, 24] }; const [x, y] = directions[a]; apply(id, { x: state.x + x, y: state.y + y }); }
}
function setEditing(on) {
    if(on)owner.composition=false;
    owner.editing=on; owner.root.dataset.layoutEditing=String(on);
    const toggle=owner.toolbar.querySelector('[data-workspace-action="edit-layout"]'); toggle.setAttribute('aria-pressed',String(on)); toggle.textContent=on?'Done editing':'Edit layout';
    owner.menuSummary.textContent=on?'Layout (editing)':'Layout';
}
// Color scheme is a per-browser display preference, separate from layouts and saves.
const COLOR_KEY = 'yairpg.colors.v1', COLOR_SCHEMES = ['standard', 'vivid'];
function readColorScheme() { try { const v = localStorage.getItem(COLOR_KEY); return COLOR_SCHEMES.includes(v) ? v : 'vivid'; } catch { return 'vivid'; } }
// Crafting detail placement (AJ8) is a per-browser display preference, beside the list by default.
const CRAFT_DETAIL_KEY = 'yairpg.craft-detail.v1', CRAFT_DETAIL_PLACES = ['beside', 'below'];
function readCraftDetail() { try { const v = localStorage.getItem(CRAFT_DETAIL_KEY); return CRAFT_DETAIL_PLACES.includes(v) ? v : 'beside'; } catch { return 'beside'; } }
function applyCraftDetail(value) { document.documentElement.dataset.craftDetailPlace = CRAFT_DETAIL_PLACES.includes(value) ? value : 'beside'; }
function applyColorScheme(value) { document.documentElement.dataset.colorScheme = COLOR_SCHEMES.includes(value) ? value : 'standard'; }
function moduleCritical(id) { return registry.get(id)?.critical === true; }
// Discovery (A6/V10): a panel is named nowhere until discovered. Discovery is sticky for
// the session and re-derived on load from save facts (discovered()) or current content
// (eligible()). Only a flip during play, after the start screen settles, marks a reveal.
function labelShell(module, known) {
    if (!module.shell || module.labelled === known) return; module.labelled = known;
    const name = known ? module.title : 'panel', shell = module.shell;
    shell.querySelector('.workspace-module-header > strong').textContent = known ? module.title : '';
    module.decorateShell?.(shell, known);
    shell.querySelector('.workspace-drag-handle').setAttribute('aria-label', `Move ${name}`);
    shell.querySelectorAll('[data-workspace-action=width],[data-workspace-action=height]').forEach(r => r.setAttribute('aria-label', `${name} ${r.dataset.workspaceAction}`));
    shell.querySelectorAll('[data-resize]').forEach(g => g.setAttribute('aria-label', `Resize ${name} ${g.dataset.resize === 'e' ? 'width' : g.dataset.resize === 's' ? 'height' : 'width and height'}`));
}
let revealSettledAt = null, revealGesture = false;
// A trusted click or key press after the start screen closes is play, so a panel met by a
// player who acts within the settle window still gets its reveal (settings pass, 2026-10-13).
if (typeof document !== 'undefined') for (const type of ['pointerdown', 'keydown']) document.addEventListener(type, e => { if (e.isTrusted && document.documentElement.dataset.startScreen === 'closed' && !e.target?.closest?.('#hero_creation_panel')) revealGesture = true; }, true);
function revealArmed() {
    if (document.documentElement.dataset.startScreen === 'open') { revealSettledAt = null; revealGesture = false; return false; }
    if (revealSettledAt == null) revealSettledAt = performance.now();
    return revealGesture || performance.now() - revealSettledAt >= 1200;
}
function moduleKnown(module, eligible) {
    if (module.known) return true;
    let found; try { found = module.discovered() !== false; } catch { found = false; }
    if (!(found || eligible)) return false;
    module.known = true; if (revealArmed()) reveal(module); return true;
}
function reveal(module) {
    const target = owner.layout.mode === 'classic' ? module.node : module.shell; if (!target) return;
    document.dispatchEvent(new CustomEvent('workspace-panel-arrival',{detail:{id:module.id,title:module.title}}));
    // Reveal setting (AJ1): off, or save-level Effects off, shows the panel with no marker or motion.
    if (getDisplaySetting('reveal') === 'off' || effectsCap() === 'off') return;
    target.dataset.workspaceReveal = 'new'; clearTimeout(module.revealTimer);
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    module.revealTimer = setTimeout(() => { if (target.dataset.workspaceReveal === 'new') delete target.dataset.workspaceReveal; }, reduced ? 60 : 1000);
}
function syncRestore(module, state, known, eligible, classic) {
    let restore = owner.picker.querySelector(`[data-module="${state.id}"]`);
    if (!known) { restore?.remove(); return; }
    if (!restore) { restore = button(`Open ${module.title}`, 'restore', state.id); owner.picker.append(restore); }
    setProperty(restore,'disabled',!eligible); if (!classic) setProperty(restore,'textContent',`${state.hidden ? 'Show' : 'Open'} ${module.title}`);
    const reason = eligible ? '' : (module.unavailableReason?.() || 'Not available here right now');
    if (restore.title !== reason) { restore.title = reason; if (reason) restore.setAttribute('aria-description', reason); else restore.removeAttribute('aria-description'); }
}
export function updateWorkspace() {
    if(deferSimulationRender(updateWorkspace, updateWorkspace)) return;
    if (!owner) return;
    const densityToggle=owner.toolbar.querySelector('[data-workspace-action=toggle-density]');if(densityToggle){setProperty(densityToggle,'textContent',owner.layout.density==='compact'?'Compact':'Comfortable');setProperty(densityToggle,'title','Change spacing density. Keeps your chosen font size.');setAttribute(densityToggle,'aria-pressed',owner.layout.density==='compact');}
    owner.root.dataset.presentation=owner.shell&&owner.context==='play'?'proto23-shell':'';
    owner.root.dataset.parity=owner.parity&&!owner.narrow&&owner.context==='play'?'r3':'';
    owner.root.dataset.parityCombat=String(!!registry.get('combat')?.eligible());
    owner.root.dataset.parityItem=String(!!registry.get('shell-detail')?.eligible());
    owner.root.dataset.parityExpanded=String(document.getElementById('center_mode_navigation')?.dataset.centerMode?.startsWith('workspace:')===true);
    owner.root.dataset.workspaceComposition=owner.composition&&!owner.narrow&&owner.context==='play'?'proto23':'';
    revealArmed(); // start the settle clock on the first pass after the start screen closes
    const focused = document.activeElement; const counts = {};
    ['left','center','right'].forEach((d,i) => owner.board.style.setProperty(`--workspace-${d}`, `${owner.layout.columns[i]}fr`));
    owner.board.hidden = owner.layout.mode === 'classic'; owner.root.dataset.density = owner.layout.density; owner.toolbar.querySelector('[data-workspace-action="density"]').value = owner.layout.density;
    const preset = owner.toolbar.querySelector('[data-workspace-action="preset"]'); if (owner.layout.mode === 'classic') preset.value = 'Classic'; else if (preset.value === 'Classic') preset.value = 'Workspace'; owner.root.dataset.workspaceMode = owner.layout.mode; owner.root.dataset.workspaceContext=owner.context||'play';
    owner.root.dataset.editorReflow=String(owner.context==='authoring'&&(['customization','customization-effects','customization-rules'].some(id=>parseFloat(getComputedStyle(registry.get(id)?.node||owner.root).fontSize)>20)||window.innerWidth/presentationScale()<1100));
    if (owner.layout.mode === 'classic') {
        owner.layout.modules.forEach(state => {
            const module = registry.get(state.id); makeShell(module);
            if (module.placeholder?.parentNode && module.node.previousSibling !== module.placeholder) module.placeholder.after(module.node);
            else if (!module.placeholder?.parentNode) { const home = (module.homeId && document.getElementById(module.homeId)) || module.home; if(home?.isConnected && module.node.parentNode !== home)home.append(module.node); }
            module.node.classList.toggle('workspace-user-hidden', state.hidden && !module.critical);
            const eligible = module.eligible() !== false, known = moduleKnown(module, eligible); labelShell(module, known);
            module.node.classList.toggle("workspace-discovery-hidden", !known || !eligible);
            syncRestore(module, state, known, eligible, true);
        });
        if (focused?.isConnected && document.activeElement !== focused && !focused.closest('[hidden]')) focused.focus({preventScroll:true});
        return;
    }
    owner.layout.modules.forEach(state => {
        const module = registry.get(state.id); if (module.critical) { state.hidden = false; state.collapsed = false; } makeShell(module);
        module.node.classList.remove('workspace-user-hidden','workspace-discovery-hidden');
        if(module.expanded){module.shell.hidden=true;syncPanelHeader(module,state,module.eligible()!==false);return;}
        if (module.node.parentNode !== module.body) module.body.append(module.node);
        const shell = module.shell; const eligible = module.eligible() !== false, known = moduleKnown(module, eligible); labelShell(module, known);
        // Undiscovered shells wait outside the labelled docks, so no dock label or text names them.
        if (!known) { shell.hidden = true; if (shell.parentNode !== owner.vault) owner.vault.append(shell); syncRestore(module, state, known, eligible, false); return; }
        // Reach A2 proposal: restore the vital dock only on combat entry, not every render.
        if (state.id === 'combat') {
            if (eligible && !module.wasInCombat) {
                const vitals = registry.get('vitals');
                if (vitals?.shell && !vitals.shell.hidden) vitals.shell.scrollIntoView({block:'start', inline:'nearest'});
            }
            module.wasInCombat = eligible;
        }
        const composed=owner.root.dataset.workspaceComposition==='proto23';
        const core=['shell-inventory-tools','shell-character','shell-detail','vitals','combat-controls','shell-inventory-tools','belongings','focus','time','location','village-scene','current-work','combat','stance','local-actions','pane-navigation','messages','shell-log-tools'];
        const parked=composed&&!state.pinned&&!core.includes(state.id);
        shell.dataset.compositionParked=String(parked);
        if(known&&['vitals','belongings'].includes(state.id))setProperty(shell.querySelector('.workspace-module-header > strong'),'textContent',composed?(state.id==='vitals'?'You':'Inventory'):module.title);
        if(known&&state.id==='vitals'){
            const race=document.getElementById('character_race_div');
            const visibleRace=race?[...race.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').replace(/^[^:]*:\s*/,'').trim():'';
            const heading=shell.querySelector('.workspace-module-header > strong');
            heading.dataset.characterIdentity=owner.parity&&visibleRace?` · ${visibleRace}`:'';
            setProperty(heading,'title','Your native character. Open Stats for biography, attributes and equipment.');
        }
        shell.hidden = state.hidden || !eligible || parked || (composed&&!owner.parity&&state.id==='belongings'&&document.documentElement.style.getPropertyValue('--inventory_div_display')==='none'); shell.classList.toggle('workspace-floating', state.dock === 'float' && !owner.narrow); shell.classList.toggle('workspace-collapsed', state.collapsed);
        shell.style.setProperty('--workspace-width', `${state.width}px`); shell.style.setProperty('--workspace-height', `${state.height}px`);
        shell.dataset.pinned = String(state.pinned);
        shell.querySelectorAll('[data-resize], [data-workspace-action=width], [data-workspace-action=height]').forEach(grip => {setProperty(grip,'disabled',state.pinned);});
        // Docked panels need no floating-window geometry. These synchronous
        // layout reads previously ran for every module on every refresh.
        if(state.dock==='float'&&!owner.narrow){
            const available=floatAvailable();shell.style.setProperty('--workspace-float-max-height', `${Math.max(48,available.bottom-available.top)}px`);
            const bounds=floatBounds(shell,state.width);
            shell.style.left=`${Math.max(bounds.left,Math.min(state.x,bounds.right))}px`;
            shell.style.top=`${Math.max(bounds.top,Math.min(state.y,bounds.bottom))}px`;
            if(owner.gesture?.kind==='move'&&owner.gesture.active&&owner.gesture.id===state.id){shell.style.left=`${owner.gesture.x}px`;shell.style.top=`${owner.gesture.y}px`;}
        }else {shell.style.left='';shell.style.top='';}
        const d = owner.narrow ? 'center' : state.dock;
        const region=owner.root.dataset.parity==='r3'?parityRegion(state.id):null;
        const destination=owner.context==='authoring'&&['current-work','customization-preview'].includes(state.id)?owner.contextBar:region?owner.regions[region]:owner.docks[d];
        const key=destination===owner.contextBar?'context':region||d,index=counts[key]||0;counts[key]=index+1;
        if (destination.children[index] !== shell) destination.insertBefore(shell, destination.children[index] || null);
        module.body.hidden = state.collapsed;
        syncPanelHeader(module,state,eligible);
        shell.querySelector('[data-workspace-action="dock"]').value = state.dock;
        ['width', 'height'].forEach(d => shell.querySelector(`[data-workspace-action="${d}"]`).value = state[d]);
        ['handle', 'dock', 'earlier', 'later', 'float-left', 'float-right', 'float-up', 'float-down'].forEach(a => setProperty(shell.querySelector(`[data-workspace-action="${a}"]`),'disabled',state.pinned));
        syncRestore(module, state, known, eligible, false);
    });
    owner.board.querySelectorAll('[data-divider]').forEach(divider=>{
        const index=Number(divider.dataset.divider), share=owner.layout.columns.slice(0,index+1).reduce((a,b)=>a+b,0);
        divider.style.left=`calc(${share*100}% + ${6+index*12-24*share}px)`;
        divider.style.top='0px';divider.style.height='100%';
    });
    if (focused?.isConnected && document.activeElement !== focused && !focused.closest('[hidden]')) focused.focus({ preventScroll: true });
}
function resizeColumn(dock, pixels, persist = true) {
    const index=['left','center','right'].indexOf(dock); if(index<0)return;
    const width=Math.max(1,owner.board.getBoundingClientRect().width-24), columns=[...owner.layout.columns];
    const next=Math.max(0.15,Math.min(0.65,pixels/width)), remaining=1-next, old=1-columns[index];
    columns.forEach((v,i)=>{columns[i]=i===index?next:v/old*remaining;}); owner.layout.columns=normalizeColumns(columns);
    if(persist)save(); updateWorkspace();
}
function resizeDivider(index, delta, persist = true) {
    const width=Math.max(1,owner.board.getBoundingClientRect().width), columns=[...owner.layout.columns];
    const shift=Math.max(0.15-columns[index],Math.min(columns[index+1]-0.15,delta/width));
    columns[index]+=shift; columns[index+1]-=shift; owner.layout.columns=columns; if(persist)save(); updateWorkspace();
}
function presentationScale() { return owner.root.offsetWidth ? owner.root.getBoundingClientRect().width/owner.root.offsetWidth : 1; }
function floatAvailable() {
    const scale=presentationScale(), toolbarBottom=owner.toolbar.getBoundingClientRect().bottom/scale;
    const footer=document.getElementById('bottom_panel_div')?.getBoundingClientRect();
    const bottom=(footer && footer.top>0 && footer.top<window.innerHeight ? footer.top : window.innerHeight)/scale-8;
    return {top:Math.max(8,toolbarBottom+6),bottom};
}
function floatBounds(shell,width) {
    const scale=presentationScale(), {top,bottom}=floatAvailable(), height=Math.min(shell.getBoundingClientRect().height/scale || 120,Math.max(48,bottom-top));
    return {left:8,right:Math.max(8,window.innerWidth/scale-Math.min(width,window.innerWidth/scale-16)-8),top,bottom:Math.max(top,bottom-height)};
}
function snap(value) { return Math.round(value/8)*8; }
function finishGesture(cancel = false) {
    const g=owner.gesture; if(!g)return;
    if(cancel || !g.active) owner.layout=g.before;
    else if(g.kind==='move' && g.drop) {
        let modules=owner.layout.modules.map(v=>({...v})), moving=modules.find(v=>v.id===g.id); moving.dock=g.drop.dock;
        if(moving.dock==='float') { moving.x=g.x; moving.y=g.y; }
        else if(g.drop.target) { modules=modules.filter(v=>v.id!==g.id); let at=modules.findIndex(v=>v.id===g.drop.target); if(g.drop.after)at++; modules.splice(at,0,moving); }
        else {modules=modules.filter(v=>v.id!==g.id); const last=modules.map(v=>v.dock).lastIndexOf(moving.dock); modules.splice(last+1,0,moving);}
        owner.layout=normalizeLayout({...owner.layout, modules:modules.map((v,order)=>({...v,order}))},[...registry.keys()]);
    }
    registry.get(g.id)?.shell.classList.remove('workspace-moving'); owner.root.classList.remove('workspace-dragging','workspace-resizing'); owner.preview.hidden=true;
    if(owner.root.hasPointerCapture?.(g.pointer))owner.root.releasePointerCapture(g.pointer);
    delete owner.gesture; save(); updateWorkspace();
    owner.status.textContent=cancel ? 'Layout change canceled.' : !g.active ? 'Drag headers · Shift+drag to float · Resize edges or dividers' : g.kind==='move' ? (g.drop ? `Panel moved to ${g.drop.dock === 'float' ? 'floating' : g.drop.dock + ' dock'}.` : 'No drop target. Layout preserved.') : 'Size saved. Resize edges or dividers to adjust.';
}
function installPointerInteractions(listen) {
    listen(owner.root,'pointerdown',e=>{
        if(e.button!==0 || owner.layout.mode==='classic' || !owner.editing)return;
        const divider=e.target.closest('[data-divider]'), grip=e.target.closest('[data-resize]'), header=e.target.closest('.workspace-module-header');
        if(!divider && !grip && (!header || (e.target.closest('button,input,select,summary,details,a') && !e.target.closest('.workspace-drag-handle'))))return;
        const shell=(grip||header)?.closest('.workspace-module'), id=shell?.dataset.module, state=owner.layout.modules.find(v=>v.id===id);
        if(state?.pinned)return;
        if(!divider && !state)return;
        const rect=shell?.getBoundingClientRect();
        owner.gesture={kind:divider?'divider':grip?'resize':'move', id, edge:grip?.dataset.resize, divider:Number(divider?.dataset.divider), startX:e.clientX,startY:e.clientY, rect, state:state?{...state}:null, before:structuredClone(owner.layout), pointer:e.pointerId, active:false};
        if(grip || divider)e.preventDefault();
    });
    listen(window,'pointermove',e=>{
        const g=owner.gesture; if(!g || e.pointerId!==g.pointer)return;
        const dx=e.clientX-g.startX,dy=e.clientY-g.startY;
        if(!g.active && Math.hypot(dx,dy)<5)return;
        if(!g.active)owner.root.setPointerCapture?.(g.pointer); g.active=true; e.preventDefault(); owner.root.classList.add(g.kind==='move'?'workspace-dragging':'workspace-resizing');
        if(g.kind==='divider') {owner.layout.columns=[...g.before.columns];resizeDivider(g.divider,dx,false);return;}
        if(g.kind==='resize') {
            if(g.edge.includes('e')) { if(g.state.dock==='float') owner.layout=changeModule(owner.layout,g.id,{width:snap(g.state.width+dx/presentationScale())}); else {owner.layout.columns=[...g.before.columns];resizeColumn(g.state.dock,g.rect.width+dx,false);} }
            if(g.edge.includes('s'))owner.layout=changeModule(owner.layout,g.id,{height:snap(g.state.height+dy/presentationScale())});
            updateWorkspace();return;
        }
        const module=registry.get(g.id),shell=module.shell; shell.classList.add('workspace-moving');
        const bounds=floatBounds(shell,g.state.width);
        g.x=Math.max(bounds.left,Math.min(bounds.right,snap((g.rect.left+dx)/presentationScale())));
        g.y=Math.max(bounds.top,Math.min(bounds.bottom,snap((g.rect.top+dy)/presentationScale())));
        const hit=document.elementFromPoint(e.clientX,e.clientY), target=hit?.closest('.workspace-drop-target'), dock=hit?.closest('.workspace-dock');
        let destination=e.shiftKey ? 'float' : target?.dataset.dock || (g.state.dock==='float' ? 'float' : dock?.dataset.dock);
        if(owner.narrow && destination && destination!=='float')destination='center';
        const other=hit?.closest('.workspace-module'); g.drop=destination?{dock:destination}:null;
        if(destination && destination!=='float') {
            if(other && other!==shell && other.parentNode===owner.docks[destination]) {const r=other.getBoundingClientRect();g.drop.target=other.dataset.module;g.drop.after=e.clientY>r.top+r.height/2; showPreview({left:r.left,top:g.drop.after?r.bottom:r.top,width:r.width,height:6});}
            else {const r=owner.docks[destination].getBoundingClientRect();showPreview({left:r.left,top:r.top,width:r.width,height:Math.max(60,r.height)});}
        } else {showPreview({left:g.x,top:g.y,width:Math.min(g.state.width,window.innerWidth/presentationScale()-24),height:Math.min(g.rect.height/presentationScale(),window.innerHeight/presentationScale()-48)},true);if(g.state.dock==='float') {shell.style.left=`${g.x}px`;shell.style.top=`${g.y}px`;g.drop={dock:'float'};}}
        owner.targets.querySelectorAll('[data-dock]').forEach(t=>t.classList.toggle('workspace-target-active',t.dataset.dock===g.drop?.dock));
    });
    listen(window,'pointerup',e=>{if(owner.gesture?.pointer===e.pointerId)finishGesture();});
    listen(window,'keydown',e=>{if(e.key==='Escape' && owner.gesture) {e.preventDefault();finishGesture(true);}});
    listen(window,'pointercancel',()=>finishGesture(true));
    listen(window,'blur',()=>finishGesture(true));
}
function showPreview(rect, cssPixels=false) {owner.preview.hidden=false;const scale=cssPixels?1:presentationScale();Object.entries(rect).forEach(([k,v])=>owner.preview.style[k]=`${v/scale}px`);}
// The start screen's PLAY control is keyboard reachable, takes focus when shown,
// and layout chrome stays off the start screen.
let startScreenWatched = false;
function watchStartScreen() {
    if (startScreenWatched) return; startScreenWatched = true;
    const screen = document.getElementById('loading_screen'), play = document.getElementById('loading_screen_play_button'); if (!screen || !play) return;
    play.setAttribute('role', 'button'); play.tabIndex = 0;
    play.addEventListener('keydown', e => { if (['Enter', ' '].includes(e.key)) { e.preventDefault(); play.click(); } });
    const sync = () => {
        const open = getComputedStyle(screen).visibility !== 'hidden'; document.documentElement.dataset.startScreen = open ? 'open' : 'closed';
        // The game behind the start screen leaves the tab order until PLAY.
        const game = document.getElementById('main_content'); if (game) game.inert = open;
        if (open && !play.classList.contains('none_display') && !play.dataset.focused) { play.dataset.focused = 'true'; play.focus({ preventScroll: true }); }
    };
    const observer = new MutationObserver(sync); observer.observe(screen, { attributes: true, attributeFilter: ['style', 'class'] }); observer.observe(play, { attributes: true, attributeFilter: ['class'] }); sync();
}
export function mountWorkspace({ root = document.getElementById('main_content') || document.getElementById('global_content') } = {}) {
    watchStartScreen();
    if (owner) { updateWorkspace(); return owner; }
    if (!root) return null;
    // Play shows one Layout entry; every layout tool sits one activation inside it.
    const toolbar = el('nav', 'workspace-toolbar'); toolbar.setAttribute('aria-label', 'Workspace layout');
    const menu = el('details', 'workspace-layout-menu'), menuSummary = el('summary', '', 'Layout'), tools = el('div', 'workspace-layout-tools');
    menu.append(menuSummary, tools); toolbar.append(button('Authoring', 'context'), menu);
    const presentation=el('select');presentation.dataset.workspaceAction='presentation';presentation.setAttribute('aria-label','Presentation');
    for(const [value,label]of [['existing','Existing layout'],['proto23-shell','Proto23 Shell'],['proto23-parity','Proto23 UI R9']]){const option=el('option','',label);option.value=value;presentation.append(option);}
    toolbar.append(presentation,button('Comfortable','toggle-density'));tools.append(button('Edit layout', 'edit-layout'));
    const presetLabel = el('label', '', 'Layout '), presets = el('select'); presets.dataset.workspaceAction = 'preset'; ['Workspace', 'Classic', 'Focus', 'Compare'].forEach(v => { const o = el('option', '', v); o.value = v; presets.append(o); }); presetLabel.append(presets); tools.append(presetLabel, button('Reset layout', 'reset'));
    const densityLabel = el('label', '', 'Density '), density = el('select'); density.dataset.workspaceAction='density'; ['compact','comfortable','inspection'].forEach(v=>{const o=el('option','',v);o.value=v;density.append(o);}); densityLabel.append(density);tools.append(densityLabel);
    const colorsLabel = el('label', '', 'Colors '), colors = el('select'); colors.dataset.workspaceAction = 'colors'; [['standard','Standard'],['vivid','Vivid']].forEach(([v,t])=>{const o=el('option','',t);o.value=v;colors.append(o);}); colorsLabel.append(colors); tools.append(colorsLabel); colors.value = readColorScheme(); applyColorScheme(colors.value);
    const craftLabel = el('label', '', 'Crafting detail '), craft = el('select'); craft.dataset.workspaceAction = 'craft-detail'; [['beside','Beside list'],['below','Below list']].forEach(([v,t])=>{const o=el('option','',t);o.value=v;craft.append(o);}); craftLabel.append(craft); tools.append(craftLabel); craft.value = readCraftDetail(); applyCraftDetail(craft.value);
    const picker = el('details', 'workspace-picker'); picker.append(el('summary', '', 'Panels')); tools.append(picker);
    const transfer = el('details', 'workspace-transfer'); transfer.append(el('summary', '', 'Layout configuration'));
    const config = el('textarea'); config.setAttribute('aria-label', 'Layout configuration'); config.rows = 5; transfer.append(config, button('Export layout', 'export'), button('Import layout', 'import')); tools.append(transfer);
    const status = el('output', 'workspace-status', 'Edit layout to drag headers, float panels or resize edges and dividers'); status.setAttribute('aria-live', 'polite'); tools.append(status);
    const contextBar=el('div','workspace-context-bar');const board = el('div', 'workspace-board'), docks = {};
    ['left', 'center', 'right', 'float'].forEach(d => { const dock = el('div', 'workspace-dock'); dock.dataset.dock = d; dock.setAttribute('aria-label', `${d} panel dock`); docks[d] = dock; board.append(dock); });
    for(let i=0;i<2;i++) { const divider=el('button','workspace-divider'); divider.type='button'; divider.dataset.divider=i; divider.setAttribute('aria-label', `Resize ${i === 0 ? 'left and center' : 'center and right'} columns`); board.append(divider); }
    const targets=el('div','workspace-drop-targets'); ['left','center','right','float'].forEach(d => {const t=el('div','workspace-drop-target',d === 'float' ? 'Float panel' : `Dock ${d}`); t.dataset.dock=d; targets.append(t); }); board.append(targets);
    const preview=el('div','workspace-drop-preview'); preview.hidden=true; board.append(preview);
    const vault=el('div','workspace-undiscovered'); vault.hidden=true; board.append(vault);
    const regions={};
    for(const id of ['player','focus','inventory','actions','log']){const region=el('div','workspace-dock parity-region');region.dataset.region=id;region.setAttribute('aria-label',`${id} region`);regions[id]=region;board.append(region);}
    const media = window.matchMedia('(max-width: 1000px)'); owner = { root, toolbar, menu, menuSummary, board, docks, regions, contextBar,context:'play',editing:false,picker, vault, config, status, media, narrow: media.matches, layout: read(media.matches), targets, preview, cleanup: [] };
    owner.composition=requestedComposition;owner.shell=false;owner.parity=paritySelected();
    if(owner.parity||shellSelected()){owner.baseLayout=owner.layout;owner.baseComposition=owner.composition;owner.shell=true;owner.layout=makeShellLayout(owner.narrow);owner.composition=true;}
    presentation.value=owner.shell?(owner.parity?'proto23-parity':'proto23-shell'):'existing';
    root.classList.add('workspace-active'); root.prepend(toolbar,contextBar,board);
    function listen(target, name, handler) { target.addEventListener(name, handler); owner.cleanup.push(() => target.removeEventListener(name, handler)); }
    listen(root, 'click', e => { if (e.target.closest('[data-workspace-action]')?.tagName !== 'SELECT' && e.target.closest('[data-workspace-action]')?.tagName !== 'INPUT') action(e); const floating = e.target.closest('.workspace-floating'); if (floating) { owner.front = (owner.front || 200) + 1; floating.style.zIndex = owner.front; } });
    listen(document, 'pointerdown', e => {
        root.querySelectorAll('.workspace-module-controls[open], .workspace-picker[open], .workspace-transfer[open], .workspace-layout-menu[open]').forEach(details => {if(!details.contains(e.target))details.open=false;});
    });
    // DOM order follows the visible dock order, including saved reordering.
    listen(document, 'keydown', e => {
        if (e.key !== 'F6' || e.altKey || e.ctrlKey || e.metaKey || owner.root.inert) return;
        const panels = [...owner.board.querySelectorAll('.workspace-module')]
            .filter(s => !s.hidden && s.getClientRects().length && !s.closest('[hidden]'));
        if (!panels.length) return;
        const at = panels.indexOf(document.activeElement?.closest('.workspace-module'));
        const next = at < 0 ? (e.shiftKey ? panels.length - 1 : 0)
            : (at + (e.shiftKey ? -1 : 1) + panels.length) % panels.length;
        e.preventDefault(); panels[next].focus({preventScroll: true});
        panels[next].querySelector('.workspace-module-header')?.scrollIntoView({block: 'nearest', inline: 'nearest'});
    });
    listen(toolbar, 'keydown', e => { if(e.key==='Escape' && owner.menu.open) { e.preventDefault(); owner.menu.open=false; owner.menuSummary.focus(); } });
    listen(root, 'change', action);
    listen(root, 'keydown', e => {
        if(e.key === 'Escape' && owner.gesture) { e.preventDefault(); finishGesture(true); return; }
        if(!owner.editing)return; const grip=e.target.closest('[data-resize], [data-divider]');
        if(grip && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) { e.preventDefault(); const amount=e.key==='ArrowLeft'||e.key==='ArrowUp' ? -20 : 20; if(grip.dataset.divider !== undefined) resizeDivider(Number(grip.dataset.divider), amount); else { const st=owner.layout.modules.find(v=>v.id===grip.dataset.module); if(st && !st.pinned) { if(['ArrowLeft','ArrowRight'].includes(e.key) && grip.dataset.resize.includes('e')) { if(st.dock==='float')apply(st.id,{width:st.width+amount}); else resizeColumn(st.dock,registry.get(st.id).shell.getBoundingClientRect().width+amount); } else if(grip.dataset.resize.includes('s')) apply(st.id,{height:st.height+amount}); } } return; }
        const handle = e.target.closest('[data-workspace-action="handle"]'); if (!handle) return;
        const state = owner.layout.modules.find(v => v.id === handle.dataset.module); if (!state || state.pinned) return;
        if (['ArrowUp', 'ArrowDown'].includes(e.key)) { e.preventDefault(); owner.layout = reorderModule(owner.layout, state.id, e.key === 'ArrowUp' ? -1 : 1); save(); updateWorkspace(); }
        else if (['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); const ds = ['left', 'center', 'right', 'float'], i = ds.indexOf(state.dock); apply(state.id, { dock: ds[Math.min(3, Math.max(0, i + (e.key === 'ArrowLeft' ? -1 : 1)))] }); }
    });
    installPointerInteractions(listen);
    listen(media, 'change', () => { owner.narrow = media.matches; owner.layout = read(owner.narrow);owner.composition=requestedComposition;updateWorkspace(); });
    listen(window, 'resize', updateWorkspace);
    updateWorkspace(); return owner;
}
export function destroyWorkspace() {
    if (!owner) return;
    owner.cleanup.forEach(fn => fn());
    registry.forEach(module => { if (module.placeholder?.parentNode) module.placeholder.after(module.node); else module.home?.append(module.node); module.shell?.remove(); module.shell = null; module.body = null; });
    owner.toolbar.remove(); owner.contextBar.remove();owner.board.remove(); owner.root.classList.remove('workspace-active'); delete owner.root.dataset.workspaceMode; delete owner.root.dataset.density; registry.forEach(module => module.placeholder?.remove()); registry.clear(); owner = null;
}
export function registerExisting(descriptors = []) { descriptors.forEach(v => { const node = document.getElementById(v.nodeId || v.id); if (node) registerWorkspaceModule({ ...v, node }); }); }

export function unregisterWorkspaceModule(id) {
    const module = registry.get(id); if (!module) return;
    if (module.placeholder?.parentNode) module.placeholder.after(module.node); else if (module.home?.isConnected) module.home.append(module.node);
    module.placeholder?.remove(); module.shell?.remove(); registry.delete(id);
    if (owner) { owner.layout = normalizeLayout(owner.layout, [...registry.keys()]); owner.picker.querySelector(`[data-module="${id}"]`)?.remove(); save(); updateWorkspace(); }
}

export function openWorkspaceModule(id) {
    if(owner?.context==='play'&&id.startsWith('customization'))setWorkspaceContext('authoring');
    if(owner?.context==='authoring'&&!id.startsWith('customization'))setWorkspaceContext('play');
    const module = registry.get(id); if (!module) return false;
    if (owner) apply(id, { hidden: false, collapsed: false });
    if (['notebook','known-routes','known-people'].includes(id)) document.getElementById('journal_show_notebook')?.click();
    for (let parent=module.node.parentElement;parent;parent=parent.parentElement) if(parent.tagName==='DETAILS')parent.open=true;
    const target = owner && owner.layout.mode !== 'classic' ? module.shell : module.node;
    if (!target || module.eligible() === false) return false;
    if (owner && target.classList.contains('workspace-floating')) { owner.front = (owner.front || 200) + 1; target.style.zIndex=owner.front; }
    target.scrollIntoView?.({block:'nearest',behavior:'instant'});
    const first = module.node.querySelector('button:not([hidden]):not(:disabled),summary,input:not([hidden]):not(:disabled),select:not([hidden]):not(:disabled),[data-native-keyboard]');
    const focus = owner && owner.layout.mode !== 'classic' && owner.editing ? module.shell.querySelector('.workspace-drag-handle') : first;
    // Opening a module the player is already working inside (for example the notebook
    // re-opening itself when a started job needs attention) keeps their keyboard focus.
    if (module.node.contains?.(document.activeElement)) return true;
    focus?.focus({preventScroll:true}); return true;
}

export function setWorkspaceContext(context) {
    if(!owner || owner.context===context)return;
    if(context==='authoring') {
        owner.playLayout=structuredClone(owner.layout);
        owner.playScroll=Object.fromEntries(['left','center','right'].map(d=>[d,owner.docks[d].scrollTop]));
        let author;
        try {author=JSON.parse(localStorage.getItem(layoutStorageKey(owner.narrow)+'.authoring'));}catch{}
        if(author?.version===1)owner.layout=normalizeLayout(author,[...registry.keys()]);
        else {
            owner.layout=makePreset('Workspace');owner.layout.columns=[.34,.30,.36];
            const positions={'customization':'left','customization-effects':'center','customization-sites':'center','customization-rules':'right'};
            owner.layout.modules.forEach(v=>{if(positions[v.id]){v.dock=positions[v.id];v.hidden=false;v.collapsed=false;v.height=1000;}});
            owner.layout.modules.sort((a,b)=>Number(!positions[a.id])-Number(!positions[b.id]));owner.layout.modules.forEach((v,i)=>v.order=i);
        }
    } else if(owner.playLayout)owner.layout=owner.playLayout;
    owner.context=context;owner.toolbar.querySelector('[data-workspace-action=context]').textContent=context==='authoring'?'Return to play':'Authoring';
    updateWorkspace();
    ['left','center','right'].forEach(d=>{owner.docks[d].scrollTop=context==='play'?(owner.playScroll?.[d]||0):0;});
}

// Focused views borrow the original node. No layout save, clone or second UI owner.
export function knownWorkspaceModules() {
    return [...registry.values()].filter(m=>{try{return m.known||m.discovered()!==false;}catch{return false;}}).map(m=>({id:m.id,title:m.title,eligible:m.eligible()!==false,reason:m.unavailableReason?.()||'Return to the relevant place or finish the current conversation.'}));
}
export function expandWorkspaceModule(id,{title}={}) {
    if(id==='local-actions'){centerModes().showHere();return true;}
    const module=registry.get(id);if(!owner||!module||module.eligible()===false||!knownWorkspaceModules().some(m=>m.id===id))return false;
    const mode=`workspace:${id}`,label=title||module.title;
    if(module.expanded){centerModes().open(mode,module.returnHome);return true;}
    const body=module.node.parentNode;
    module.expanded=true;
    const heading=module.shell.querySelector('.workspace-module-header');heading.classList.add('expanded-panel-heading');heading.tabIndex=-1;
    const viewport=document.createElement('section');viewport.className='expanded-panel-view';viewport.append(heading,module.node);
    centerModes().registerView(mode,viewport,label);
    module.returnHome=()=>{centerModes().releaseView(mode);body.append(module.node);heading.classList.remove('expanded-panel-heading');module.shell.prepend(heading);viewport.remove();module.expanded=false;updateWorkspace();};
    centerModes().open(mode,module.returnHome);updateWorkspace();heading.focus({preventScroll:true});
    return true;
}
