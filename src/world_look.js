import {readPort} from './ui_ports.js';

// Per-world look (DESIGN.md DSG12, PLAN M3). Display only: reads the player's current world,
// stores nothing, changes no rule. The page root already carries data-world (the world id,
// "native" for the frontier, written by workspace_views.js); beside it this adds
// data-world-family="<family>" for every world so later skins (DSG17) attach by family, and
// data-world-flourish="on" for the families listed here. Only listed families get a flourish, and
// their tokens live in styles/ui_tokens.css with the rules in styles/world_look.css. Everything
// unlisted falls back to the plain Luminous look.

// A world id names its family: book.lotm.tingen -> lotm, base.frontier -> frontier.
export function worldFamily(worldId) {
    if (typeof worldId !== 'string' || !worldId) return 'unknown';
    const parts = worldId.split('.');
    if (parts[0] === 'book' && parts[1]) return parts[1];
    if (parts[0] === 'base' && parts[1]) return parts[1];
    return parts.length > 1 ? parts[1] : parts[0];
}

// Which families have a flourish, and what it is in words (for the census and the gallery).
// The look itself is CSS; this row only says the family has one.
export const WORLD_FLOURISH = Object.freeze({
    lotm: Object.freeze({label: 'Tingen', material: 'brass, ink and fog', glyph: '☾'}),
});

export function worldLook(worldId) {
    const family = worldFamily(worldId);
    const row = WORLD_FLOURISH[family] || null;
    return {family, flourish: !!row, label: row?.label || null};
}

// Sets the family hooks on a root element, writing only what changed; returns the family.
export function applyWorldLook(root, worldId) {
    const look = worldLook(worldId);
    if (!root?.dataset) return look.family;
    if (root.dataset.worldFamily !== look.family) root.dataset.worldFamily = look.family;
    const flourish = look.flourish ? 'on' : 'off';
    if (root.dataset.worldFlourish !== flourish) root.dataset.worldFlourish = flourish;
    return look.family;
}

// The player's world id right now, read live from the expansion port. Reports read it at write
// time, so a line keeps the voice of the world it happened in (RPT8: written once, never re-voiced).
export const currentWorldId = () => readPort('expansion')?.actors?.player?.worldId;
export const currentWorldFamily = () => worldFamily(currentWorldId());
