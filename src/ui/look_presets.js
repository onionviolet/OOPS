// PS266 look presets (proposal): one click sets several look and feel choices. Classic is the default and
// matches every option's default; Calm and Dense change a few; changing any member choice by hand reads as
// Custom. Presentation only, stored per device with the display settings, never in a save (PS265).
import {getDisplaySettings, setDisplaySettings, subscribeDisplaySettings} from '../display_settings.js';

export const PRESETS = Object.freeze({
    classic: Object.freeze({'panel.look.rows': 'bordered', 'panel.look.text': 'normal', 'panel.look.motion': 'full', 'panel.look.density': 'comfortable', 'panel.feel.ready': 'pulse', 'panel.feel.light': 'on'}),
    calm: Object.freeze({'panel.look.rows': 'spacing', 'panel.look.text': 'normal', 'panel.look.motion': 'full', 'panel.look.density': 'comfortable', 'panel.feel.ready': 'edge', 'panel.feel.light': 'dim'}),
    dense: Object.freeze({'panel.look.rows': 'bordered', 'panel.look.text': 'normal', 'panel.look.motion': 'full', 'panel.look.density': 'dense', 'panel.feel.ready': 'pulse', 'panel.feel.light': 'on'}),
});
const PRESET_KEY = 'panel.look.preset';
const MEMBERS = Object.keys(PRESETS.classic);

/** Pure: the preset whose every member matches these settings, or 'custom'. */
export function presetFor(settings) {
    for (const [name, values] of Object.entries(PRESETS)) if (MEMBERS.every(k => settings[k] === values[k])) return name;
    return 'custom';
}

let mounted = null;
export function mountLookPresets() {
    if (mounted) return mounted;
    let last = getDisplaySettings();
    const react = now => {
        const before = last; last = now;
        const chosen = now[PRESET_KEY];
        if (chosen && chosen !== before[PRESET_KEY] && PRESETS[chosen]) {
            // The player picked a preset: apply its members (a no-op when they already match).
            if (MEMBERS.some(k => now[k] !== PRESETS[chosen][k])) setDisplaySettings({...PRESETS[chosen]});
            return;
        }
        // A member changed by hand: the preset follows what the screen now is.
        const matches = presetFor(now);
        if (chosen && chosen !== matches && MEMBERS.some(k => now[k] !== before[k])) setDisplaySettings({[PRESET_KEY]: matches});
    };
    const off = subscribeDisplaySettings(react);
    mounted = {destroy() { off(); mounted = null; }};
    return mounted;
}
