// Per-browser display settings (settings pass, AJ1-AJ7, 2026-10-13).
// Stored in localStorage 'yairpg.display.v1', never in the game save. Each
// setting changes presentation only, never mechanics. The save-level Effects
// value is mirrored on <html data-effects> by main.js and caps every motion
// feature here: 'off' stops them, 'reduced' keeps them still.
export const DISPLAY_KEY = 'yairpg.display.v1';

export const DISPLAY_SETTINGS = [
    {key:'stagedOpening',label:'Staged opening (proposal)',options:[['off','Off'],['on','On']],fallback:'off',description:'Introduce time, character, belongings and local actions in four steps on a fresh opening. Save, reports and settings stay reachable.'},
    {key: 'numberFormat', label: 'Large numbers', options: [['exact', 'Exact'], ['compact', 'Compact'], ['scientific', 'Scientific']], fallback: 'exact',
        description: 'Optional shorter display for large values; the exact value remains available.'},
    {key: 'reveal', label: 'Panel reveal', options: [['full', 'Full'], ['quiet', 'Quiet'], ['off', 'Off']], fallback: 'full',
        description: 'How a panel announces itself when you first meet it in play; quiet is a short outline without movement.'},
    {key: 'coinFloat', label: 'Coin float', options: [['on', 'On'], ['off', 'Off']], fallback: 'on',
        description: 'Shows the amount spent beside your purse when you pay for something.'},
    {key: 'coinFloatAutomatic', label: 'Coin float for automatic charges', options: [['off', 'Off'], ['on', 'On']], fallback: 'off',
        description: 'Also shows the float for charges you did not click, such as upkeep or rent.'},
    {key: 'newDot', label: 'New-item dot', options: [['on', 'On'], ['off', 'Off']], fallback: 'on',
        description: 'Marks newly acquired inventory rows until you hover or focus them.'},
    {key: 'combatRepeatMode', label: 'Combat reports', options: [['stack', 'Stack repeats'], ['detailed', 'Detailed']], fallback: 'stack',
        description: 'Applies to new reports. Existing groups stay grouped. Stacked totals are exact; only the latest 100 game HH:MM labels per group are kept, with original opponent labels. Filters hide retained lines; Stop skips new reports. Pruned or stopped reports cannot be recovered.'},
    {key: 'lootReports', label: 'Loot reports', options: [['all', 'All retained loot'], ['summaries', 'Gathering totals only'], ['off', 'Hide loot']], fallback: 'all',
        description: 'Filters retained Loot lines without changing items or acquisition records. Gathering totals appear when gathering ends. This does not create a combat digest or recover pruned reports.'},
    {key: 'logFollow', label: 'Log follow', options: [['hold', 'Hold when scrolled up'], ['always', 'Always jump to newest']], fallback: 'hold',
        description: 'Whether new log lines move the log while you are reading older lines.'},
    {key: 'vitalsValue', label: 'Vitals value text', options: [['inside', 'Inside bar'], ['beside', 'Beside bar']], fallback: 'inside',
        description: 'Where the numbers for health, stamina, mana and experience sit.'},
    {key: 'vitalsLevel', label: 'Vitals level', options: [['show', 'Show'], ['hide', 'Hide']], fallback: 'show',
        description: 'Shows your level next to your name in the vitals panel.'},
    {key: 'contrast', label: 'Contrast', options: [['normal', 'Normal'], ['high', 'High']], fallback: 'normal',
        description: 'High contrast: black panels, white text and bright accents on every panel, over any color scheme or palette. Presentation only.'},
];
export const DISPLAY_COLORS = [
    {key: 'semGain', variable: '--sem-gain', label: 'Gain color', description: 'Color for gains and ready states; empty follows the color scheme.'},
    {key: 'semLoss', variable: '--sem-loss', label: 'Loss color', description: 'Color for losses and spending; empty follows the color scheme.'},
    {key: 'semMoney', variable: '--sem-money', label: 'Money color', description: 'Color for coins, money lines and new markers; empty follows the color scheme.'},
    {key: 'semBlocked', variable: '--sem-blocked', label: 'Blocked color', description: 'Color for missing requirements and blocked reasons; empty follows the color scheme.'},
];
export const DISPLAY_DEFAULTS = Object.freeze(Object.fromEntries([
    ...DISPLAY_SETTINGS.map(s => [s.key, s.fallback]), ...DISPLAY_COLORS.map(c => [c.key, ''])]));

const panelSettings = new Map();
const panelRegistrations = new Set();
const panelDefinitions = () => [...panelSettings.values()].flatMap(panel => panel.settings);

// Panel preferences share browser display export/import/reset, never the game save.
export function registerPanelSettings({id, title, settings = []}) {
    const definitions = settings.map(s => ({...s, key: `panel.${id}.${s.key}`, fallback: s.default}));
    panelSettings.set(id, {id, title, settings: definitions});
    let stored = {}; try { stored = JSON.parse(localStorage.getItem(DISPLAY_KEY) || '{}'); } catch { /* session only */ }
    const additions = Object.fromEntries(definitions.map(s => [s.key, stored[s.key] ?? s.fallback]));
    current = normalizeDisplaySettings({...current, ...additions});
    for (const fn of panelRegistrations) fn();
    for (const fn of listeners) fn(getDisplaySettings());
}

export function normalizeDisplaySettings(raw) {
    const source = raw && typeof raw === 'object' ? raw : {}, out = {...DISPLAY_DEFAULTS};
    for (const s of [...DISPLAY_SETTINGS, ...panelDefinitions()])
        out[s.key] = s.options.some(([v]) => v === source[s.key]) ? source[s.key] : s.fallback;
    for (const c of DISPLAY_COLORS) if (typeof source[c.key] === 'string' && /^#[0-9a-f]{6}$/i.test(source[c.key])) out[c.key] = source[c.key].toLowerCase();
    return out;
}
function read() { try { return normalizeDisplaySettings(JSON.parse(localStorage.getItem(DISPLAY_KEY) || '{}')); } catch { return {...DISPLAY_DEFAULTS}; } }
let current = read();
const listeners = new Set();

export function getDisplaySettings() { return {...current}; }
export function getDisplaySetting(key) { return current[key]; }
// Global cap from the save-level Effects setting (absent before a save loads = full).
export function effectsCap() { const v = typeof document !== 'undefined' && document.documentElement.dataset.effects; return v === 'off' || v === 'reduced' ? v : 'full'; }

export function applyDisplaySettings() {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.dataset.displayReveal = current.reveal; root.dataset.displayVitalsValue = current.vitalsValue; root.dataset.displayVitalsLevel = current.vitalsLevel;
    root.dataset.displayContrast = current.contrast;
    root.dataset.displayLoot = current.lootReports;
    for (const c of DISPLAY_COLORS) { if (current[c.key]) root.style.setProperty(c.variable, current[c.key]); else root.style.removeProperty(c.variable); }
}
function commit(next, {store = true} = {}) {
    current = normalizeDisplaySettings(next);
    if (store) { try { localStorage.setItem(DISPLAY_KEY, JSON.stringify(current)); } catch { /* applies for this session only */ } }
    applyDisplaySettings();
    for (const fn of listeners) { try { fn(getDisplaySettings()); } catch { /* one listener cannot block the rest */ } }
}
export function setDisplaySettings(patch) {
    // Persist touched keys, not every normalized default. Automatic panel metadata
    // must not claim unrelated browser choices before an imported save adopts them.
    let stored = {};
    try { const raw = JSON.parse(localStorage.getItem(DISPLAY_KEY) || '{}'); if(raw && typeof raw === 'object' && !Array.isArray(raw)) stored = raw; } catch { /* session only */ }
    const next = normalizeDisplaySettings({...current, ...patch});
    const keys = new Set([...Object.keys(stored), ...Object.keys(patch)]);
    const sparse = Object.fromEntries([...keys].filter(key => Object.hasOwn(next, key)).map(key => [key, next[key]]));
    try { localStorage.setItem(DISPLAY_KEY, JSON.stringify(sparse)); } catch { /* session only */ }
    commit(next, {store: false});
}
// Import replaces every display setting; missing keys fall back to defaults.
export function replaceDisplaySettings(all) { commit(all); }
export function resetDisplaySettings() { try { localStorage.removeItem(DISPLAY_KEY); } catch { /* ignore */ } commit(DISPLAY_DEFAULTS, {store: false}); }
export function subscribeDisplaySettings(fn) { listeners.add(fn); return () => listeners.delete(fn); }

// "This browser" section inside Effects & sound. Changes apply at once and never touch the save.
export function mountDisplaySettings(host) {
    if (!host || typeof document === 'undefined') return null;
    const section = document.createElement('fieldset'); section.className = 'display-settings';
    const legend = document.createElement('legend'); legend.textContent = 'This browser'; section.append(legend);
    const intro = document.createElement('p'); intro.className = 'display-settings-intro';
    intro.textContent = 'Stored in this browser. Changes apply at once. Effects off above turns off every motion here.';
    section.append(intro);
    const controls = {};
    const row = (key, label, control, description) => {
        const line = document.createElement('div'); line.className = 'display-setting-row';
        const id = `display-setting-${key}`, descId = `display-desc-${key}`;
        const name = document.createElement('label'); name.htmlFor = id; name.textContent = label;
        control.id = id; control.dataset.displaySetting = key; control.setAttribute('aria-describedby', descId);
        const desc = document.createElement('span'); desc.id = descId; desc.className = 'display-setting-desc'; desc.textContent = description;
        line.append(name, control); controls[key] = control; return {line, desc};
    };
    for (const s of DISPLAY_SETTINGS) {
        const select = document.createElement('select');
        for (const [value, text] of s.options) { const o = document.createElement('option'); o.value = value; o.textContent = text; select.append(o); }
        select.addEventListener('change', () => setDisplaySettings({[s.key]: select.value}));
        const {line, desc} = row(s.key, s.label, select, s.description); line.append(desc); section.append(line);
    }
    for (const c of DISPLAY_COLORS) {
        const input = document.createElement('input'); input.type = 'color';
        input.addEventListener('input', () => setDisplaySettings({[c.key]: input.value}));
        const clear = document.createElement('button'); clear.type = 'button'; clear.className = 'display-color-clear'; clear.textContent = 'Use scheme';
        clear.addEventListener('click', () => setDisplaySettings({[c.key]: ''}));
        const {line, desc} = row(c.key, c.label, input, c.description); line.append(clear, desc); section.append(line);
    }
    const groups = document.createElement('div'); section.append(groups);
    const mountPanels = () => {
        groups.replaceChildren();
        for (const panel of panelSettings.values()) {
            if (!panel.settings.length) continue;
            const group = document.createElement('fieldset'); group.dataset.panelSettings = panel.id;
            const title = document.createElement('legend'); title.textContent = panel.title; group.append(title);
            for (const s of panel.settings) {
                const select = document.createElement('select');
                for (const [value, text] of s.options) {
                    const option = document.createElement('option'); option.value = value; option.textContent = text; select.append(option);
                }
                select.value = current[s.key];
                select.addEventListener('change', () => setDisplaySettings({[s.key]: select.value}));
                const {line, desc} = row(s.key, s.label, select, s.description); line.append(desc); group.append(line);
            }
            groups.append(group);
        }
    };
    mountPanels(); panelRegistrations.add(mountPanels);
    const actions = document.createElement('div'); actions.className = 'display-settings-actions';
    const reset = document.createElement('button'); reset.type = 'button'; reset.dataset.displayReset = ''; reset.textContent = 'Reset this browser’s display settings';
    reset.addEventListener('click', () => resetDisplaySettings());
    actions.append(reset); section.append(actions);
    const toHex = value => { const m = String(value).trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i); if (!m) return '#000000'; const h = m[1]; return '#' + (h.length === 3 ? [...h].map(x => x + x).join('') : h).toLowerCase(); };
    const render = settings => {
        for (const s of [...DISPLAY_SETTINGS, ...panelDefinitions()]) if (controls[s.key]) controls[s.key].value = settings[s.key];
        for (const c of DISPLAY_COLORS) {
            const input = controls[c.key];
            input.value = settings[c.key] || toHex(getComputedStyle(document.documentElement).getPropertyValue(c.variable));
            input.dataset.source = settings[c.key] ? 'custom' : 'scheme';
        }
    };
    render(current);
    const unsubscribe = subscribeDisplaySettings(render);
    host.append(section);
    return {node: section, render: () => render(current), destroy() { unsubscribe(); panelRegistrations.delete(mountPanels); section.remove(); }};
}

if (typeof document !== 'undefined') applyDisplaySettings();

// P00 attaches this optional snapshot to the save envelope. Only presentation
// preferences travel, never panel registries, item identities or hidden facts.
export function exportDisplayPreferences() {
    return {schema: 1, settings: Object.fromEntries(Object.keys(DISPLAY_DEFAULTS).map(key => [key, current[key]]))};
}
export function validateDisplayPreferences(snapshot) {
    if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot) || snapshot.schema !== 1 ||
        Object.keys(snapshot).some(k => !['schema', 'settings'].includes(k)) ||
        !snapshot.settings || typeof snapshot.settings !== 'object' || Array.isArray(snapshot.settings)) {
        throw new Error('Unsupported display preference schema.');
    }
    for (const [key, value] of Object.entries(snapshot.settings)) {
        const setting = DISPLAY_SETTINGS.find(s => s.key === key);
        const color = DISPLAY_COLORS.find(c => c.key === key);
        if (setting ? !setting.options.some(([v]) => v === value)
            : !color || typeof value !== 'string' || !(value === '' || /^#[0-9a-f]{6}$/i.test(value))) {
            throw new Error('Invalid display preference.');
        }
    }
    return structuredClone(snapshot);
}
// Call only after the whole envelope and isolated native loader pass preflight,
// and after the guarded save write succeeds. Per-key existing local values win.
export function adoptDisplayPreferences(snapshot) {
    if (snapshot === undefined) return {adopted: []};
    const validated = validateDisplayPreferences(snapshot);
    let local;
    try {
        const stored = localStorage.getItem(DISPLAY_KEY);
        local = stored === null ? {} : JSON.parse(stored);
        // A malformed existing local preference is not permission to overwrite it.
        if (!local || typeof local !== 'object' || Array.isArray(local)) return {adopted: []};
    } catch { return {adopted: []}; }
    const adopted = Object.keys(validated.settings).filter(key => !Object.hasOwn(local, key));
    if (!adopted.length) return {adopted};
    const next = {...local, ...Object.fromEntries(adopted.map(key => [key, validated.settings[key]]))};
    // Store the sparse union so unrelated unset keys remain eligible later.
    localStorage.setItem(DISPLAY_KEY, JSON.stringify(next));
    commit(next, {store: false});
    return {adopted};
}
