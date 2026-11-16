// Feel and finish (PS153-PS159, round 16, proposals). Presentation only: this module reads what the
// shell already renders and the clock, and writes data-feel-* attributes and tokens that
// styles/feel_finish.css draws. Nothing here changes the save, a mechanic or a game timer.
// Every effect has its own row in Settings ("Feel and finish", stored per browser with the other
// display settings, so reload, Export and Import keep it). Reduce motion is a Look option (PS278); motion
// also obeys the save-level Effects cap (data-effects) and the OS setting through the --ui-motion-* tokens.
import {registerPanelSettings, getDisplaySetting, subscribeDisplaySettings} from '../display_settings.js';
import {current_game_time} from '../game_time.js';
import {get_current_light_level, is_raining} from '../weather.js';
import {current_location} from '../runtime_state.js';
import {mountLookPresets} from './look_presets.js';

const ON_OFF = [['on', 'On'], ['off', 'Off']];
export const FEEL_SETTINGS = [
    {key: 'glow', label: 'Item glow', default: 'on', options: ON_OFF,
        description: 'Uncommon and better items get a soft glow in their rarity colour, epic and up a solid edge; favourites get ☆ and worn gear ◆. Common items stay plain.'},
    {key: 'ready', label: 'Ready glow', default: 'pulse', options: [['pulse', 'Edge and one pulse'], ['edge', 'Edge only'], ['off', 'Off']],
        description: 'A row you can do now gets a ready edge, and pulses once when it becomes ready. One short of ready gets a dashed edge.'},
    {key: 'light', label: 'Time-of-day light', default: 'on', options: [['on', 'On'], ['dim', 'Dim'], ['off', 'Off']],
        description: 'The page behind the panels follows the hour and the weather: brighter by day, deep at night, grey in rain, warm indoors.'},
    {key: 'states', label: 'Hover, pressed and focus', default: 'on', options: ON_OFF,
        description: 'Every button and row shows hover, pressed and keyboard focus the same way.'},
    {key: 'sound', label: 'Cue sounds', default: 'off', options: [['off', 'Off'], ['on', 'Quiet cues']],
        description: 'A short quiet tone when something becomes ready, on a level up and when a fight ends. Sound starts only after you have clicked the game once.'},
    {key: 'yair', label: 'Classic options', default: 'show', options: [['show', 'Show here'], ['hide', 'Hide']],
        description: 'The original game\'s display options (text outlines, text size, temperature scale, number threshold, staying on the inventory in a fight, combat animations) listed under this group. They are kept in your save.'},
];
registerPanelSettings({id: 'feel', title: 'Feel and finish', settings: FEEL_SETTINGS});

const setting = key => getDisplaySetting(`panel.feel.${key}`);
const root = () => document.documentElement;

export function applyFeelSettings() {
    const r = root();
    for (const {key} of FEEL_SETTINGS) r.dataset[`feel${key[0].toUpperCase()}${key.slice(1)}`] = setting(key) ?? '';
}

// PS156: the light the place has now, 0 (night) to 1 (full day), from the same weather model YAIR's
// light-based background read. Rain greys it; a roof makes it indoor light by day; night is night everywhere.
export function daylightOf({light, raining, roofed}) {
    const level = Math.max(0, Math.min(1, ((Number(light) || 40) - 40) / 60));
    const sky = level <= .1 ? 'night' : roofed ? 'indoor' : raining ? 'rain' : level >= .75 ? 'day' : 'dusk';
    return {level: Math.round(level * 100) / 100, sky};
}
function paintDaylight() {
    if (setting('light') === 'off') return;
    let light = 100, raining = false, roofed = false;
    try { roofed = !!current_location?.is_under_roof; light = get_current_light_level(); raining = !roofed && is_raining(); } catch { return; }
    const {level, sky} = daylightOf({light, raining, roofed});
    const r = root();
    if (r.dataset.feelSky !== sky) r.dataset.feelSky = sky;
    r.style.setProperty('--feel-daylight', String(level));
    r.dataset.feelHour = String(current_game_time?.hour ?? '');
}

// PS153: copy the meaning an item row already carries (its quality span's rarity, the favourite icon,
// the equipped class) onto the row, so CSS can mark the row without the item builder changing.
const ROWS = '.inventory_item_control, .equipped_item_control';
export function decorateItemRow(row) {
    const q = row.querySelector('[data-rarity]');
    const rarity = q?.dataset.rarity || '';
    if (row.dataset.feelRarity !== rarity) { if (rarity) row.dataset.feelRarity = rarity; else delete row.dataset.feelRarity; }
    if (rarity && q.style.color) row.style.setProperty('--feel-rarity', q.style.color); else row.style.removeProperty('--feel-rarity');
    const faved = row.querySelector('.item_fav_icon')?.textContent.trim() === 'star';
    if (faved) row.dataset.feelFav = ''; else delete row.dataset.feelFav;
    if (row.classList.contains('equipped_item_control')) row.dataset.feelWorn = ''; else delete row.dataset.feelWorn;
}

// PS155: a number that grows ticks up for a moment. Watched values are the vitals and the purse.
const TICKED = '#character_xp_value, #character_health_value, #character_stamina_value, #character_mana_value, #money_div, [data-feel-tick-watch]';
const firstNumber = text => { const m = String(text).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/); return m ? Number(m[0]) : null; };
const lastValue = new WeakMap();
function tick(node) {
    const value = firstNumber(node.textContent);
    const before = lastValue.get(node); lastValue.set(node, value);
    if (value == null || before == null || !(value > before) || getDisplaySetting('panel.look.motion') === 'reduce') return;
    node.removeAttribute('data-feel-tick'); void node.offsetWidth; node.setAttribute('data-feel-tick', 'up');
}

// PS158: quiet cues, off by default; WebAudio only after a click has unlocked sound.
let audio = null, lastCue = 0;
export function playCue(kind) {
    if (setting('sound') !== 'on') return false;
    const now = Date.now(); if (now - lastCue < 400) return false; lastCue = now;
    try {
        audio ||= new (globalThis.AudioContext || globalThis.webkitAudioContext)();
        if (audio.state !== 'running') return false;
        const notes = {ready: [660], level: [523, 784], fight: [440, 330]}[kind] || [600];
        notes.forEach((f, i) => {
            const o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime + i * .12;
            o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(.0001, t);
            g.gain.exponentialRampToValueAtTime(.05, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + .25);
            o.connect(g).connect(audio.destination); o.start(t); o.stop(t + .3);
        });
        return true;
    } catch { return false; }
}
const unlockAudio = () => { if (setting('sound') === 'on') { try { audio ||= new AudioContext(); audio.resume?.(); } catch { /* no audio */ } } };

// PS159: YAIR's own options stay where the page keeps them (load() reads them by id); the Feel group shows a
// proxy row per option that clicks or sets the real input, and mirrors its state on each sweep. The settings
// board re-renders its groups, so nothing of the real panel is ever moved into it.
// Replaced by Time-of-day light; bar values read on their own dark chip, so the bar outline changes nothing (PS133).
const CLASSIC_SKIP = new Set(['options_change_background_color', 'options_bar_outline']);
function placeClassicOptions() {
    const group = document.querySelector('.display-group[data-panel-settings="feel"]');
    const choices = document.querySelectorAll('#options_choices .options_choice');
    if (!group || !choices.length) return;
    let box = group.querySelector('.feel-classic');
    if (!box) {
        box = document.createElement('div'); box.className = 'feel-classic';
        const head = document.createElement('p'); head.className = 'display-setting-desc';
        head.textContent = 'The classic light-based background is replaced by Time-of-day light above.';
        box.append(head);
        for (const choice of choices) {
            const real = choice.querySelector('input'); if (!real || CLASSIC_SKIP.has(real.id)) continue;
            const row = document.createElement('label'); row.className = 'options_choice'; row.dataset.feelProxy = real.id;
            const proxy = document.createElement('input'); proxy.type = real.type;
            if (real.type === 'range') { proxy.min = real.min; proxy.max = real.max;
                proxy.addEventListener('change', () => { real.value = proxy.value; real.dispatchEvent(new Event('input')); real.dispatchEvent(new Event('change')); }); }
            else proxy.addEventListener('click', event => { event.preventDefault(); real.click(); setTimeout(() => syncClassic(box), 0); });
            const text = document.createElement('span');
            text.textContent = choice.querySelector('label')?.textContent.trim() || real.id;
            row.append(proxy, text); box.append(row);
        }
        group.append(box);
    }
    box.hidden = setting('yair') === 'hide';
    syncClassic(box);
}
function syncClassic(box) {
    for (const row of box.querySelectorAll('[data-feel-proxy]')) {
        const real = document.getElementById(row.dataset.feelProxy), proxy = row.querySelector('input');
        if (!real || !proxy) continue;
        if (real.type === 'checkbox') proxy.checked = real.checked; else if (document.activeElement !== proxy) proxy.value = real.value;
    }
}

let mounted = null;
export function mountFeelFinish() {
    if (mounted || typeof document === 'undefined') return mounted;
    applyFeelSettings(); paintDaylight(); mountLookPresets(); // PS266 presets; motion lives in Display › Look (PS278)
    const unsubscribe = subscribeDisplaySettings(() => { applyFeelSettings(); paintDaylight(); placeClassicOptions(); });
    let readyCount = null, queued = false;
    const sweep = () => {
        queued = false;
        for (const row of document.querySelectorAll(ROWS)) decorateItemRow(row);
        for (const node of document.querySelectorAll(TICKED)) tick(node);
        const ready = document.querySelectorAll('#ready_hub .ready-hub__row--ready').length;
        if (readyCount != null && ready > readyCount) playCue('ready');
        readyCount = ready;
        placeClassicOptions();
    };
    // A host without MutationObserver (a test DOM) still gets the settings and the light; rows are not decorated.
    const observer = typeof MutationObserver === 'undefined' ? null : new MutationObserver(records => {
        for (const rec of records) for (const n of rec.addedNodes) {
            if (n.nodeType !== 1) continue;
            if (n.closest?.('#message_log_div') || n.parentElement?.closest?.('#message_log_div')) {
                const cls = n.className || '';
                if (/level_up/.test(cls)) playCue('level');
                else if (/combat_end|enemy_defeated|combat_result/.test(cls)) playCue('fight');
            }
        }
        if (!queued) { queued = true; (globalThis.requestAnimationFrame || setTimeout)(sweep); }
    });
    observer?.observe(document.body, {subtree: true, childList: true, characterData: true});
    const clock = setInterval(paintDaylight, 2000);
    document.addEventListener?.('pointerdown', unlockAudio, {capture: true});
    try { sweep(); } catch { /* a partial DOM: decorate on the next change */ }
    mounted = {destroy() { observer?.disconnect(); clearInterval(clock); unsubscribe(); document.removeEventListener('pointerdown', unlockAudio, {capture: true}); mounted = null; }};
    return mounted;
}
