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
    const title = document.createElement('h2'); title.textContent = 'Your beginning';
    const note = document.createElement('p'); note.className = 'new-game-beginning-note';
    note.textContent = 'Choose what accompanies you into this life. Your name can be changed later in the You header.';
    section.append(title, note);
    // The existing choice node moves with its id, options and description, so its readers keep working.
    const choice = panel?.querySelector('.cheat_start_choice');
    if (choice) {
        section.append(choice);
        const select = choice.querySelector('[data-cheat-start]');
        const descriptions = {
            none: ['No system', 'Begin without a system.'],
            'system-quests': ['Dormant system', 'Awakens after your first won fight or on day 3.'],
            surprise: ['Surprise me', 'Choose from available systems. There is currently one.'],
        };
        if (select) {
            // The existing select remains the command reader and programmatic selection seam.
            select.hidden = true;
            choice.querySelector('label')?.setAttribute('hidden', '');
            const fieldset = document.createElement('fieldset'); fieldset.className = 'beginning-options';
            const legend = document.createElement('legend'); legend.textContent = 'System at the start';
            fieldset.append(legend);
            const radios = [];
            for (const option of select.options) {
                const [label, description] = descriptions[option.value] || [option.textContent, ''];
                const row = document.createElement('label'); row.className = 'beginning-option';
                const radio = document.createElement('input'); radio.type = 'radio';
                radio.name = 'beginning-system'; radio.value = option.value;
                radio.disabled = option.disabled;
                const heading = document.createElement('strong'); heading.textContent = label;
                const detail = document.createElement('span'); detail.textContent = description;
                row.append(radio, heading, detail); fieldset.append(row); radios.push(radio);
                radio.addEventListener('change', () => {
                    if (radio.checked) {
                        select.value = radio.value;
                        select.dispatchEvent(new Event('change', {bubbles: true}));
                    }
                });
            }
            const detail = choice.querySelector('[data-cheat-start-desc]');
            const sync = () => {
                for (const radio of radios) radio.checked = radio.value === select.value;
                if (detail) detail.textContent = select.value === 'none'
                    ? 'No system is granted by this beginning.'
                    : 'The system starts dormant. When it awakens, it shows your level and known abilities; it grants no power by itself.';
            };
            select.addEventListener('change', sync); sync();
            choice.insertBefore(fieldset, detail || null);
        }
    }
    const host = document.createElement('div'); host.className = 'new-game-beginning-extras';
    section.append(host);
    const play = screen.querySelector('#loading_screen_play_button');
    if (play) play.before(section); else screen.append(section);
    return {
        section, host,
        cheatChoice: () => section.querySelector('[data-cheat-start]')?.value || 'none',
        // The start screen closes on PLAY; the section leaves with it.
        remove: () => section.remove(),
    };
}
