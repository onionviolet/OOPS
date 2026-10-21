// R21b (Weibao, 2026-10-17: retire the new-game hero creation panel). A new game goes from PLAY
// straight into play with a default hero; the name is typed later in the You header (R21). What the
// panel also carried moves here, onto the start screen, for a new game only: the "Optional
// beginning" choice, and hosts for the local start probe and the backlog opening panel. Applying
// those choices stays with the caller (the same code the panel's confirm ran). Leaf module: DOM only.

export function mountNewGameBeginning({screen, panel}) {
    if (!screen) return null;
    const section = document.createElement('section');
    section.id = 'new_game_beginning'; section.className = 'new-game-beginning';
    section.setAttribute('aria-label', 'Beginning');
    // 2026-10-20: keep the launch screen to PLAY; start-menu UI is deferred.
    // Retain existing command values and the local authoring probe without a public picker.
    section.hidden = !(typeof location !== 'undefined' && ['localhost', '127.0.0.1'].includes(location.hostname)
        && new URLSearchParams(location.search).get('start_probe') === '1');
    const title = document.createElement('h2'); title.textContent = 'Beginning';
    const note = document.createElement('p'); note.className = 'new-game-beginning-note';
    note.textContent = 'You start as Hero. Rename yourself any time in the You panel header.';
    section.append(title, note);
    // The existing choice node moves with its id, options and description, so its readers keep working.
    const choice = panel?.querySelector('.cheat_start_choice');
    if (choice) section.append(choice);
    const host = document.createElement('div'); host.className = 'new-game-beginning-extras';
    section.append(host);
    const play = screen.querySelector('#loading_screen_play_button');
    if (play) play.after(section); else screen.append(section);
    return {
        section, host,
        cheatChoice: () => section.querySelector('[data-cheat-start]')?.value || 'none',
        // The start screen closes on PLAY; the section leaves with it.
        remove: () => section.remove(),
    };
}
