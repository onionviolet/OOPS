import {mountCommandPalette} from './command_palette.js';
import {mountRowContextMenu} from './row_context_menu.js';
import {mountEmptyStates} from './empty_states.js';
// Importing these registers their domains and panels before the registry initializes (main.js).
import './known_things.js';
import './statistics_panel.js';
import './today_strip.js';
import './region_view.js';
import './companion_roster.js';
import './loadouts.js';
import './palette_feedback_domain.js';
import './hp_brewing_domain.js';
import './lives_carry_domain.js';

// One mount point for the shell-wide helpers that read the DOM the shell already shows: the command
// palette (GU1) and the row menu (GU9), and it pulls in the reference sections (SX1 to SX6), each a
// domain with its own panel. workspace_navigation.js calls this once, so main.js gains no line (AR1). Each helper owns its own listeners and removes them in destroy().
export function mountUiExtras({nav, openPanel}) {
    const palette = mountCommandPalette({navigation: nav, openPanel});
    const rowMenu = mountRowContextMenu();
    const empties = mountEmptyStates();
    const findButton = document.createElement('button');
    findButton.type = 'button'; findButton.textContent = 'Find'; findButton.dataset.paletteOpen = '';
    findButton.title = 'Find a panel, item or action · Ctrl+K or Cmd+K'; findButton.setAttribute('aria-keyshortcuts', 'Control+K Meta+K');
    findButton.onclick = () => palette.open();
    return {findButton, palette, rowMenu, destroy() { palette.destroy(); rowMenu.destroy(); empties.destroy(); findButton.remove(); }};
}
