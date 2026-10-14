export function createTrainingPanel({read, act}) {
    const panel = document.createElement('details');
    panel.id = 'p23_encounter_profile_panel'; panel.className = 'expedition_panel'; panel.open = true;
    const summary = document.createElement('summary'); summary.textContent = 'Reed-circle rung (proposal)';
    const body = document.createElement('div'), notice = document.createElement('p'); panel.append(summary, body, notice);
    function render() {
        const host = document.getElementById('location_actions_div'); if (panel.parentElement !== host) host.append(panel);
        const frame = read(); panel.hidden = !frame.visible; body.replaceChildren(); if (panel.hidden) return;
        for (const line of frame.lines) {const p = document.createElement('p'); p.textContent = line; body.append(p);}
        for (const action of frame.actions) {
            const b = document.createElement('button'); b.dataset.encounterProfile = action.id; b.textContent = action.label;
            b.disabled = frame.disabled || action.disabled;
            b.onclick = () => {try {act(action.id); notice.textContent = '';} catch (error) {notice.textContent = error.message;} render();};
            body.append(b);
        }
    }
    render(); return {render};
}
