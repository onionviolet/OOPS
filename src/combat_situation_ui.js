// LTU7 fight situation card. Home: the Here center view during a fight, directly under the Local
// actions list that holds the leave choice (M15's fight center mode; in the parity shell the native
// #combat_div is hidden and opponents have their own panels). It follows #location_actions_div and
// hides whenever that list is hidden (another center mode, no fight). Reads the observer-safe 'combat-opponents'
// projection and the controlled fighter's own readout, nothing else. Draws only when the text form
// changes, so ticks never rebuild it under a pointer (UR52). Its one option presses the native leave
// choice, which keeps that choice's own guards (UR35).
import {domainRegistry} from './domain_registry.js';
import {fromCombatOpponentsProjection} from './opponent_board.js';
import {fightSituation, pickLeaveChoice} from './ui/combat_situation.js';
import {renderFigure, figureText, FIGURE_STATES} from './ui/figure.js';
import {renderSceneCard} from './ui/scene_card.js';

const leaveChoice = () => pickLeaveChoice([...document.querySelectorAll('#location_actions_div .action_travel[data-travel]')]);

export function mountFightSituation({getCombat, readout, every = 400}) {
    const section = document.createElement('section');
    section.id = 'fight_situation'; section.className = 'fight-situation'; section.setAttribute('aria-label', 'Fight situation');
    section.hidden = true;
    // The card and its Withdraw row are built once per fight and leave choice; ticks only swap the
    // stakes text, the lines and the drawing, so the button never moves or rebuilds under a pointer (UR52).
    let cardKey = '', textKey = '', stakes = null, lines = null, figure = null;
    function render() {
        // The native reader binds after modules load (bindNativeView); until then there is no fight to read.
        let combat = null; try { combat = getCombat(); } catch { combat = null; }
        const actions = document.getElementById('location_actions_div');
        if (actions && section.previousElementSibling !== actions) actions.after(section);
        const shown = !!actions && !!combat && !combat.is_ended && combat.attackers?.[0]?.tags?.main_character && actions.checkVisibility?.() !== false;
        if (!shown) { if (!section.hidden) section.hidden = true; cardKey = textKey = ''; return; }
        const own = readout(combat, {fighter_index: 0, is_attacker: true}), board = fromCombatOpponentsProjection(domainRegistry.project('combat-opponents'));
        const place = document.getElementById('location_name_span')?.textContent.trim() || '';
        const situation = fightSituation(board, {name: 'You', health: own.health, speed: Number(own.speed), defense: own.defense,
            minDamageShare: own.protection?.minDamageShare, damageTaken: own.protection?.damageTaken, sideSize: combat.attackers.length}, {place});
        if (section.hidden === situation.active) section.hidden = !situation.active;
        if (!situation.active) return;
        const leave = leaveChoice(), leaveText = leave?.textContent.replace(/\s+/g, ' ').trim() || '';
        if (cardKey !== `${place}\n${leaveText}`) {
            cardKey = `${place}\n${leaveText}`; textKey = ''; section.replaceChildren();
            const card = renderSceneCard(section, {kind: 'fight', id: 'fight-situation', header: {title: 'Fight', place}, stakes: ' ',
                options: [{id: 'leave', label: leaveText ? `Withdraw: ${leaveText}` : 'Withdraw', affects: 'Leaves this fight', attrs: {fightOption: 'leave'},
                    blocked: leave ? '' : 'No way out is shown from here.', onChoose: () => leaveChoice()?.click()}]});
            stakes = card.querySelector('.scene-card-stakes');
            // Text first (LTU7): lethal, odds, tempo and intent lines sit above the drawing.
            lines = document.createElement('ul'); lines.className = 'fight-situation-lines'; stakes.after(lines);
            figure = document.createElement('div'); card.append(figure);
        }
        const next = figureText(situation.spec);
        if (next === textKey) return;
        textKey = next;
        if (stakes.textContent !== situation.summary) stakes.textContent = situation.summary;
        lines.replaceChildren(...situation.spec.notes.map(note => {
            const li = document.createElement('li'); li.className = `fig-note${note.state ? ` fig-state--${note.state}` : ''}`;
            li.textContent = `${note.state ? `${FIGURE_STATES[note.state]} ` : ''}${note.text}`; return li;
        }));
        renderFigure(figure, {...situation.spec, notes: []}, {idPrefix: 'fight-situation', text: true});
    }
    const timer = setInterval(render, every);
    return {render, stop: () => clearInterval(timer), node: section};
}
