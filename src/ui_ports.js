// The few live readers and operations the reference sections need from the running game (AR4).
// main.js passes them once through mountWorkspaceNavigation, so it gains no registration line (AR1).
// Each section reads through `ports()` and treats a missing port as "nothing to show yet".
//
//   character()   the hero (equipment, items, skills)
//   counters()    lifetime counters the titles already read (one authority for these numbers)
//   gameStats()   the raw game_stats record
//   expansion()   the expansion state (party, residents, running jobs)
//   records()     the discovery tables the Bestiary, Anthology, item log and travel buttons read
//   presentation(moduleId) current resolved Appearance effects/sound for a native surface
//   equip(key)    the native equip path        unequip(slot)   the native unequip path
let current = null;
const waiting = new Set();

export function configureUiPorts(next) {
    current = next ? Object.freeze({...next}) : null;
    if (current) for (const fn of waiting) fn();
}
export const ports = () => current;
// A section asks to render again once the ports arrive (panels mount before main.js passes them).
export function whenPortsReady(fn) { waiting.add(fn); if (current) fn(); return () => waiting.delete(fn); }

// A port that throws (state mid-load) reads as absent, never as a crash of the panel.
export function readPort(name, ...args) {
    try { return current?.[name]?.(...args); } catch { return undefined; }
}
