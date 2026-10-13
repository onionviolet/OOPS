import { normalizeLayout, parseLayout, presetLayout, changeModule, reorderModule, layoutStorageKey, normalizeColumns } from './workspace_state.js';
const registry = new Map();
let owner;
const el = (tag, cls, text) => { const node = document.createElement(tag); if (cls) node.className = cls; if (text) node.textContent = text; return node; };
function button(label, action, id) { const b = el('button', '', label); b.type = 'button'; b.dataset.workspaceAction = action; if (id) b.dataset.module = id; return b; }
export function workspaceOwns(node) { return !!owner && [...registry.values()].some(v => v.node === node); }
export function registerWorkspaceModule({ id, title, node, home = node?.parentNode, homeHost, defaultDock, eligible = () => true, critical = false }) {
    if (!/^[a-z][a-z0-9_-]*$/.test(id) || !node || !home) throw new Error('Workspace modules require a stable safe ID, node and home.');
    const old = registry.get(id);
    if (old) { if (old.node !== node) { if (owner && old.node.parentNode) old.node.replaceWith(node); old.node = node; } old.eligible = eligible; old.critical = critical; updateWorkspace(); return old; }
    const placeholder = null;
    const dock = defaultDock || (typeof home === 'string' ? home : home?.dock);
    const module = { id, title: String(title), node, home: (typeof homeHost === 'string' ? document.getElementById(homeHost) : homeHost) || (home?.append ? home : node.parentNode), homeId: typeof homeHost === 'string' ? homeHost : (node.parentNode?.id || null), defaultDock: ['left','center','right','float'].includes(dock) ? dock : undefined, eligible, critical, placeholder }; registry.set(id, module);
    if (owner) { owner.layout = withDefaults(owner.layout); makeShell(module); updateWorkspace(); }
    return module;
}
function makeShell(module) {
    if (module.shell) return;
    if (!module.placeholder) { module.placeholder = document.createComment(`workspace:${module.id}`); module.node.before(module.placeholder); }
    const shell = el('section', 'workspace-module'); shell.dataset.module = module.id;
    const header = el('div', 'workspace-module-header');
    const handle = button('↕', 'handle', module.id); handle.className = 'workspace-drag-handle'; handle.draggable = false; handle.title = 'Drag to reorder or dock. Arrow keys move; left/right changes dock.'; handle.setAttribute('aria-label', `Move ${module.title}`);
    const title = el('strong', '', module.title); header.append(handle, title, button('Collapse', 'collapse', module.id));
    const details = el('details', 'workspace-module-controls'); const summary = el('summary', '', 'Options'); details.append(summary); 
    const label = el('label', '', 'Dock '), select = el('select'); select.dataset.workspaceAction = 'dock'; select.dataset.module = module.id;
    ['left', 'center', 'right', 'float'].forEach(d => { const option = el('option', '', d === 'float' ? 'Floating' : d); option.value = d; select.append(option); }); label.append(select); details.append(label);
    details.append(button('Earlier', 'earlier', module.id), button('Later', 'later', module.id), button('Pin', 'pin', module.id), button('Hide', 'hide', module.id));
    for (const dimension of ['width', 'height']) { const label = el('label', 'workspace-resize', `${dimension} `), range = el('input'); range.type = 'range'; range.min = dimension === 'width' ? '260' : '40'; range.max = '1000'; range.step = '20'; range.dataset.workspaceAction = dimension; range.dataset.module = module.id; range.setAttribute('aria-label', `${module.title} ${dimension}`); label.append(range); details.append(label); }
    const moves = el('div', 'workspace-float-controls'); moves.append(button('←', 'float-left', module.id), button('↑', 'float-up', module.id), button('↓', 'float-down', module.id), button('→', 'float-right', module.id)); details.append(moves);
    const body = el('div', 'workspace-module-body'); body.append(module.node); header.append(details); shell.append(header, body); for (const edge of ['e','s','se']) { const grip = el('button','workspace-resize-grip'); grip.type='button'; grip.dataset.resize=edge; grip.dataset.module=module.id; grip.setAttribute('aria-label', `Resize ${module.title} ${edge === 'e' ? 'width' : edge === 's' ? 'height' : 'width and height'}`); shell.append(grip); } module.shell = shell; module.body = body; owner.docks.left.append(shell);
}
function save() { try { localStorage.setItem(layoutStorageKey(owner.narrow)+(owner.context==='authoring'?'.authoring':''), JSON.stringify(owner.layout)); } catch { owner.status.textContent = 'Layout works for this session; browser storage is unavailable.'; } }
function withDefaults(layout) { const previous = new Set(layout?.modules?.map(v => v.id) || []); const result = normalizeLayout(layout, [...registry.keys()]); result.modules.forEach(v => { if (!previous.has(v.id) && registry.get(v.id).defaultDock) v.dock = registry.get(v.id).defaultDock; }); return result; }
function makePreset(name, narrow = owner?.narrow) { const layout = presetLayout(name, [...registry.keys()]); layout.density = owner?.layout.density || 'comfortable'; if (name !== 'Focus' && name !== 'Workspace') layout.modules.forEach(v => { if (registry.get(v.id).defaultDock) v.dock = registry.get(v.id).defaultDock; }); if(name==='Workspace') { layout.modules.forEach(v=>{if(['ledger','customization'].includes(v.id)&&registry.get(v.id).defaultDock)v.dock=registry.get(v.id).defaultDock;}); const order=narrow ? ['time','location','current-work','local-actions','vitals','combat-controls','preparation','belongings','equipment-comparison','records','skills','messages','optional-worlds','beginning','patrol','supplies'] : ['vitals','combat-controls','preparation','belongings','equipment-comparison','time','location','current-work','local-actions','records','skills','messages','optional-worlds','beginning','patrol','supplies']; layout.modules.sort((a,b)=>(order.indexOf(a.id)<0?999:order.indexOf(a.id))-(order.indexOf(b.id)<0?999:order.indexOf(b.id))); layout.modules.forEach((v,i)=>v.order=i); return layout; } const context = new Set(['vitals','time','location','combat-nav','native-vitals','native-time','native-location','combat-navigation']); layout.modules.sort((a,b) => ((registry.get(a.id).critical || context.has(a.id)) ? 0 : 1) - ((registry.get(b.id).critical || context.has(b.id)) ? 0 : 1)); layout.modules.forEach((v,order) => { v.order=order; if(name==='Focus' && (registry.get(v.id).critical || context.has(v.id)))v.collapsed=false; }); return layout; }
function read(narrow) { try { const raw = localStorage.getItem(layoutStorageKey(narrow)); if(!raw)return makePreset('Workspace', narrow); const value=JSON.parse(raw); return value?.version===1 && Array.isArray(value.modules) ? normalizeLayout(value,[...registry.keys()]) : makePreset('Workspace', narrow); } catch { return makePreset('Workspace', narrow); } }
function apply(id, patch) { owner.layout = changeModule(owner.layout, id, patch); save(); updateWorkspace(); }
function action(event) {
    const control = event.target.closest('[data-workspace-action]'); if (!control || !owner.root.contains(control)) return;
    const a = control.dataset.workspaceAction, id = control.dataset.module, state = owner.layout.modules.find(v => v.id === id);
    if (a === 'context') { setWorkspaceContext(owner.context==='authoring'?'play':'authoring'); return; }
    if (a === 'edit-layout') { owner.editing=!owner.editing;owner.root.dataset.layoutEditing=String(owner.editing);control.setAttribute('aria-pressed',String(owner.editing));return; }
    if (a === 'preset') { owner.layout = makePreset(control.value); save(); updateWorkspace(); return; }
    if (a === 'density') { owner.layout.density = control.value; save(); updateWorkspace(); return; }
    if (a === 'reset') { owner.layout = makePreset('Workspace'); save(); updateWorkspace(); return; }
    if (a === 'export') { owner.config.value = JSON.stringify(normalizeLayout(owner.layout, [...registry.keys()]), null, 2); owner.status.textContent = 'Layout configuration ready to copy. It contains panel IDs and positions only.'; return; }
    if (a === 'import') { try { const raw = JSON.parse(owner.config.value); if (raw.version !== 1 || !Array.isArray(raw.modules)) throw Error(); owner.layout = normalizeLayout(raw, [...registry.keys()]); save(); updateWorkspace(); owner.status.textContent = 'Layout imported.'; } catch { owner.status.textContent = 'Invalid layout. Current layout preserved.'; } return; }
    if (!state) return;
    if (moduleCritical(id) && ['hide', 'collapse'].includes(a)) { owner.status.textContent = 'This panel contains required current actions and stays open.'; return; }
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
function moduleCritical(id) { return registry.get(id)?.critical === true; }
export function updateWorkspace() {
    if (!owner) return;
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
            let restore = owner.picker.querySelector(`[data-module="${state.id}"]`); if (!restore) { restore = button(`Open ${module.title}`, 'restore', state.id); owner.picker.append(restore); } restore.disabled = module.eligible() === false;
        });
        if (focused?.isConnected && document.activeElement !== focused && !focused.closest('[hidden]')) focused.focus({preventScroll:true});
        return;
    }
    owner.layout.modules.forEach(state => {
        const module = registry.get(state.id); if (module.critical) { state.hidden = false; state.collapsed = false; } makeShell(module);
        module.node.classList.remove('workspace-user-hidden');
        if (module.node.parentNode !== module.body) module.body.append(module.node);
        const shell = module.shell; const eligible = module.eligible() !== false;
        shell.hidden = state.hidden || !eligible; shell.classList.toggle('workspace-floating', state.dock === 'float' && !owner.narrow); shell.classList.toggle('workspace-collapsed', state.collapsed);
        shell.style.setProperty('--workspace-width', `${state.width}px`); shell.style.setProperty('--workspace-height', `${state.height}px`);
        shell.dataset.pinned = String(state.pinned);
        shell.querySelectorAll('[data-resize], [data-workspace-action=width], [data-workspace-action=height]').forEach(grip => {grip.disabled=state.pinned;});
        const available=floatAvailable(); shell.style.setProperty('--workspace-float-max-height', `${Math.max(48,available.bottom-available.top)}px`);
        const bounds=floatBounds(shell,state.width);
        shell.style.left = `${Math.max(bounds.left,Math.min(state.x,bounds.right))}px`;
        shell.style.top = `${Math.max(bounds.top,Math.min(state.y,bounds.bottom))}px`;
        if(owner.gesture?.kind==='move' && owner.gesture.active && owner.gesture.id===state.id && state.dock==='float') {shell.style.left=`${owner.gesture.x}px`;shell.style.top=`${owner.gesture.y}px`;}
        if (state.dock !== 'float' || owner.narrow) { shell.style.left = ''; shell.style.top = ''; }
        const d = owner.narrow ? 'center' : state.dock, destination = owner.context==='authoring' && ['current-work','customization-preview'].includes(state.id) ? owner.contextBar : owner.docks[d], key=destination===owner.contextBar?'context':d,index=counts[key]||0;counts[key]=index+1;
        if (destination.children[index] !== shell) destination.insertBefore(shell, destination.children[index] || null);
        module.body.hidden = state.collapsed;
        shell.querySelector('[data-workspace-action="hide"]').disabled = module.critical; shell.querySelector('[data-workspace-action="collapse"]').disabled = module.critical;
        shell.querySelector('[data-workspace-action="collapse"]').textContent = state.collapsed ? 'Expand' : 'Collapse'; shell.querySelector('[data-workspace-action="collapse"]').setAttribute('aria-expanded', String(!state.collapsed));
        shell.querySelector('[data-workspace-action="pin"]').textContent = state.pinned ? 'Unpin' : 'Pin'; shell.querySelector('[data-workspace-action="pin"]').setAttribute('aria-pressed', String(state.pinned));
        shell.querySelector('[data-workspace-action="dock"]').value = state.dock;
        ['width', 'height'].forEach(d => shell.querySelector(`[data-workspace-action="${d}"]`).value = state[d]);
        ['handle', 'dock', 'earlier', 'later', 'float-left', 'float-right', 'float-up', 'float-down'].forEach(a => shell.querySelector(`[data-workspace-action="${a}"]`).disabled = state.pinned);
        const restore = owner.picker.querySelector(`[data-module="${state.id}"]`); if (restore) { restore.disabled = !eligible; restore.textContent = `${state.hidden ? 'Show' : 'Open'} ${module.title}`; }
        else {const restore=button(`Open ${module.title}`, 'restore', state.id);restore.disabled=!eligible;owner.picker.append(restore);}
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
        if(e.button!==0 || owner.layout.mode==='classic')return;
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
export function mountWorkspace({ root = document.getElementById('main_content') || document.getElementById('global_content') } = {}) {
    if (owner) { updateWorkspace(); return owner; }
    if (!root) return null;
    const toolbar = el('nav', 'workspace-toolbar');toolbar.append(button('Authoring', 'context'),button('Edit layout', 'edit-layout')); toolbar.setAttribute('aria-label', 'Workspace layout');
    const presetLabel = el('label', '', 'Layout '), presets = el('select'); presets.dataset.workspaceAction = 'preset'; ['Workspace', 'Classic', 'Focus', 'Compare'].forEach(v => { const o = el('option', '', v); o.value = v; presets.append(o); }); presetLabel.append(presets); toolbar.append(presetLabel, button('Reset layout', 'reset'));
    const densityLabel = el('label', '', 'Density '), density = el('select'); density.dataset.workspaceAction='density'; ['compact','comfortable','inspection'].forEach(v=>{const o=el('option','',v);o.value=v;density.append(o);}); densityLabel.append(density);toolbar.append(densityLabel);
    const picker = el('details', 'workspace-picker'); picker.append(el('summary', '', 'Panels')); toolbar.append(picker);
    const transfer = el('details', 'workspace-transfer'); transfer.append(el('summary', '', 'Layout configuration'));
    const config = el('textarea'); config.setAttribute('aria-label', 'Layout configuration'); config.rows = 5; transfer.append(config, button('Export layout', 'export'), button('Import layout', 'import')); toolbar.append(transfer);
    const status = el('output', 'workspace-status', 'Drag headers · Shift+drag to float · Resize edges or dividers'); status.setAttribute('aria-live', 'polite'); toolbar.append(status);
    const contextBar=el('div','workspace-context-bar');const board = el('div', 'workspace-board'), docks = {};
    ['left', 'center', 'right', 'float'].forEach(d => { const dock = el('div', 'workspace-dock'); dock.dataset.dock = d; dock.setAttribute('aria-label', `${d} panel dock`); docks[d] = dock; board.append(dock); });
    for(let i=0;i<2;i++) { const divider=el('button','workspace-divider'); divider.type='button'; divider.dataset.divider=i; divider.setAttribute('aria-label', `Resize ${i === 0 ? 'left and center' : 'center and right'} columns`); board.append(divider); }
    const targets=el('div','workspace-drop-targets'); ['left','center','right','float'].forEach(d => {const t=el('div','workspace-drop-target',d === 'float' ? 'Float panel' : `Dock ${d}`); t.dataset.dock=d; targets.append(t); }); board.append(targets);
    const preview=el('div','workspace-drop-preview'); preview.hidden=true; board.append(preview);
    const media = window.matchMedia('(max-width: 1000px)'); owner = { root, toolbar, board, docks, contextBar,context:'play',editing:false,picker, config, status, media, narrow: media.matches, layout: read(media.matches), targets, preview, cleanup: [] };
    root.classList.add('workspace-active'); root.prepend(toolbar,contextBar,board);
    function listen(target, name, handler) { target.addEventListener(name, handler); owner.cleanup.push(() => target.removeEventListener(name, handler)); }
    listen(root, 'click', e => { if (e.target.closest('[data-workspace-action]')?.tagName !== 'SELECT' && e.target.closest('[data-workspace-action]')?.tagName !== 'INPUT') action(e); const floating = e.target.closest('.workspace-floating'); if (floating) { owner.front = (owner.front || 200) + 1; floating.style.zIndex = owner.front; } });
    listen(root, 'pointerdown', e => {
        root.querySelectorAll('.workspace-module-controls[open], .workspace-picker[open], .workspace-transfer[open]').forEach(details => {if(!details.contains(e.target))details.open=false;});
    });
    listen(root, 'change', action);
    listen(root, 'keydown', e => {
        if(e.key === 'Escape' && owner.gesture) { e.preventDefault(); finishGesture(true); return; }
        const grip=e.target.closest('[data-resize], [data-divider]');
        if(grip && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) { e.preventDefault(); const amount=e.key==='ArrowLeft'||e.key==='ArrowUp' ? -20 : 20; if(grip.dataset.divider !== undefined) resizeDivider(Number(grip.dataset.divider), amount); else { const st=owner.layout.modules.find(v=>v.id===grip.dataset.module); if(st && !st.pinned) { if(['ArrowLeft','ArrowRight'].includes(e.key) && grip.dataset.resize.includes('e')) { if(st.dock==='float')apply(st.id,{width:st.width+amount}); else resizeColumn(st.dock,registry.get(st.id).shell.getBoundingClientRect().width+amount); } else if(grip.dataset.resize.includes('s')) apply(st.id,{height:st.height+amount}); } } return; }
        const handle = e.target.closest('[data-workspace-action="handle"]'); if (!handle) return;
        const state = owner.layout.modules.find(v => v.id === handle.dataset.module); if (!state || state.pinned) return;
        if (['ArrowUp', 'ArrowDown'].includes(e.key)) { e.preventDefault(); owner.layout = reorderModule(owner.layout, state.id, e.key === 'ArrowUp' ? -1 : 1); save(); updateWorkspace(); }
        else if (['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); const ds = ['left', 'center', 'right', 'float'], i = ds.indexOf(state.dock); apply(state.id, { dock: ds[Math.min(3, Math.max(0, i + (e.key === 'ArrowLeft' ? -1 : 1)))] }); }
    });
    installPointerInteractions(listen);
    listen(media, 'change', () => { owner.narrow = media.matches; owner.layout = read(owner.narrow); updateWorkspace(); });
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
    const focus = owner && owner.layout.mode !== 'classic' ? module.shell.querySelector('.workspace-drag-handle') : module.node.querySelector('button:not([hidden]):not(:disabled),summary,input:not([hidden]):not(:disabled),select:not([hidden]):not(:disabled)');
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
            const positions={'customization':'left','customization-effects':'center','customization-rules':'right'};
            owner.layout.modules.forEach(v=>{if(positions[v.id]){v.dock=positions[v.id];v.hidden=false;v.collapsed=false;v.height=1000;}});
            owner.layout.modules.sort((a,b)=>Number(!positions[a.id])-Number(!positions[b.id]));owner.layout.modules.forEach((v,i)=>v.order=i);
        }
    } else if(owner.playLayout)owner.layout=owner.playLayout;
    owner.context=context;owner.toolbar.querySelector('[data-workspace-action=context]').textContent=context==='authoring'?'Return to play':'Authoring';
    updateWorkspace();
    ['left','center','right'].forEach(d=>{owner.docks[d].scrollTop=context==='play'?(owner.playScroll?.[d]||0):0;});
}
