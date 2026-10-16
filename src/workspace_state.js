/** Layout data contains registered presentation IDs only, never game state or text. */
export const WORKSPACE_VERSION = 1;
export const DOCKS = ['left', 'center', 'right', 'float'];
const finite = (v, fallback) => Number.isFinite(Number(v)) ? Number(v) : fallback;
const clamp = (v, low, high, fallback) => Math.min(high, Math.max(low, finite(v, fallback)));
export function normalizeColumns(values) {
    const safe = Array.isArray(values) && values.length === 3 ? values.map(v => clamp(v, 0.15, 0.7, 1 / 3)) : [0.27, 0.43, 0.30];
    const sum = safe.reduce((a, b) => a + b, 0); return safe.map(v => v / sum);
}
export function defaultModule(id, index = 0) {
    return { id, dock: index % 2 ? 'right' : 'left', order: index, width: 400, height: 460, collapsed: false, pinned: false, hidden: false, x: 20 + index * 24, y: 20 + index * 24 };
}
export function normalizeLayout(raw, ids) {
    const source = raw?.version === WORKSPACE_VERSION && Array.isArray(raw.modules) ? raw.modules : [];
    const known = new Map(source.filter(v => v && typeof v.id === 'string').map(v => [v.id, v]));
    return { version: WORKSPACE_VERSION, mode: raw?.mode === 'dock' ? 'dock' : 'classic', columns: normalizeColumns(raw?.columns), density: ['compact','comfortable','inspection'].includes(raw?.density) ? raw.density : 'comfortable', modules: [...new Set(ids)].map((id, index) => {
        const base = defaultModule(id, index), value = known.get(id) || {};
        return { ...base, dock: DOCKS.includes(value.dock) ? value.dock : base.dock,
            order: clamp(value.order, 0, 1000, index), width: clamp(value.width, 260, 1000, 400), height: clamp(value.height, 40, 1000, 460),
            x: clamp(value.x, 0, 10000, base.x), y: clamp(value.y, 0, 10000, base.y),
            collapsed: value.collapsed === true, pinned: value.pinned === true, hidden: value.hidden === true };
    }).sort((a, b) => a.order - b.order).map((v, order) => ({ ...v, order })) };
}
export function parseLayout(text, ids) {
    try { return normalizeLayout(JSON.parse(text), ids); } catch { return normalizeLayout(null, ids); }
}
export function presetLayout(name, ids) {
    const result = normalizeLayout(null, ids); result.mode = name === 'Classic' ? 'classic' : 'dock';
    result.modules.forEach((v, i) => {
        if (name === 'Workspace') {
            const defaults = { vitals:['left',145], 'combat-controls':['left',40], preparation:['left',240], belongings:['left',480], 'equipment-comparison':['left',200,true], focus:['center',145], 'village-scene':['center',220], projects:['center',260], time:['center',40], location:['center',150], 'current-work':['center',100], combat:['center',420], stance:['left',220], 'local-actions':['center',400], records:['center',140], skills:['center',150], messages:['right',600], 'optional-worlds':['right',200,true], beginning:['right',200,true], patrol:['right',200,true], supplies:['right',200,true] };
            const config = defaults[v.id]; if(config) { v.dock=config[0]; v.height=config[1]; v.collapsed=!!config[2]; }
            v.hidden = !['vitals','combat-controls','belongings','focus','time','location','village-scene','current-work','combat','stance','local-actions','messages'].includes(v.id);
        }
        if (name === 'Focus') { v.dock = 'center'; v.collapsed = i > 0; }
        if (name === 'Compare') { v.dock = i % 2 ? 'right' : 'left'; v.width = 460; }
    });
    return result;
}
export function changeModule(layout, id, patch) {
    return normalizeLayout({ version: WORKSPACE_VERSION, mode: layout.mode, density: layout.density, columns: layout.columns, modules: layout.modules.map(v => v.id === id ? { ...v, ...patch, id } : v) }, layout.modules.map(v => v.id));
}
export function reorderModule(layout, id, delta) {
    const modules = layout.modules.map(v => ({ ...v }));
    const index = modules.findIndex(v => v.id === id);
    if (index < 0 || modules[index].pinned) return layout;
    const neighbors = modules.filter(v => v.dock === modules[index].dock && !v.pinned);
    const local = neighbors.findIndex(v => v.id === id), target = neighbors[local + delta];
    if (!target) return layout;
    const order = modules[index].order; modules[index].order = target.order; target.order = order;
    return normalizeLayout({ version: WORKSPACE_VERSION, mode: layout.mode, density: layout.density, columns: layout.columns, modules }, modules.map(v => v.id));
}
export function layoutStorageKey(narrow) { return `yairpg.workspace.v${WORKSPACE_VERSION}.${narrow ? 'narrow' : 'desktop'}`; }
