// LTU7 fight situation card (round 2: versus row, docs/representations/COMBAT.md R2-S1). Home: the Here center view during a fight, directly under the Local
// actions list that holds the leave choice (M15's fight center mode; in the parity shell the native
// #combat_div is hidden and opponents have their own panels). It follows #location_actions_div and
// hides whenever that list is hidden (another center mode, no fight). Reads the observer-safe 'combat-opponents'
// projection and the controlled fighter's own readout, nothing else. Draws only when the text form
// changes, so ticks never rebuild it under a pointer (UR52). Its one option presses the native leave
// choice, which keeps that choice's own guards (UR35).
import {domainRegistry} from './domain_registry.js';
import {fromCombatOpponentsProjection} from './opponent_board.js';
import {fightSituation, pickLeaveChoice, tempoSituation} from './ui/combat_situation.js';
import {config} from './config.js';
import {figureText, FIGURE_STATES} from './ui/figure.js';
import {renderVersusRow} from './ui/combat_versus.js';
import {renderSceneCard} from './ui/scene_card.js';
import {versusWithEngine} from './read_models/combat_situation_bridge.js';
import {harmRung} from './harm_state.js';
import {worldFamily, currentWorldFamily} from './world_look.js';

const leaveChoice = () => pickLeaveChoice([...document.querySelectorAll('#location_actions_div .action_travel[data-travel]')]);

export function mountFightSituation({getCombat, readout, every = 400}) {
    const section = document.createElement('section');
    section.id = 'fight_situation'; section.className = 'fight-situation'; section.setAttribute('aria-label', 'Fight situation');
    section.hidden = true;
    // The card and its Withdraw row are built once per fight and leave choice; ticks only swap the
    // stakes text, the lines and the drawing, so the button never moves or rebuilds under a pointer (UR52).
    let cardKey = '', textKey = '', stakes = null, lines = null, figure = null, notice = null, lastNotice = '';
    // Tempo mode (COMBAT.md round 3, R3-O1): the same card, versus row and log, with the move area filled by the
    // tempo contest's own moves. Reads the 'tempo_fight' projection; moves go through its 'move' command, which keeps
    // the contest's own checks. The world family (DESIGN.md DSG11, DSG13) only picks type names.
    function renderTempo(actions) {
        let view = null; try { view = domainRegistry.project('tempo_fight'); } catch { view = null; }
        if (!view?.fight || view.fight.result) return false;
        const place = document.getElementById('location_name_span')?.textContent.trim() || '';
        const dev = !!config.enable_dev_mode || document.documentElement.dataset.dev === 'on';
        const t = tempoSituation(view, {place, worldId: view.fight.worldId ? worldFamily(view.fight.worldId) : currentWorldFamily(), dev});
        if (!t.active) return false;
        if (actions && section.previousElementSibling !== actions) actions.after(section);
        const key = `tempo\n${JSON.stringify(t)}`;
        if (section.hidden) section.hidden = false;
        if (key === cardKey) return true;
        cardKey = key; textKey = '';
        section.dataset.fightMode = 'tempo';
        const command = domainRegistry.command('tempo_fight', 'move'), blocked = command ? '' : 'The contest cannot take moves right now.';
        // A refused move keeps the contest's own reason on the card (DSG10), and the card redraws on the next tick.
        const move = request => { try { command(request); lastNotice = ''; } catch (error) { lastNotice = error.message; } cardKey = ''; render(); };
        const wait = t.yourTurn ? '' : 'Not your turn yet.';
        const options = t.yourTurn ? [
            ...t.moves.map(m => ({id: m.id, label: m.label, time: `${m.cost} time`, affects: [m.text, m.mixText ? `Strikes ${m.mixText}.` : '', m.safe ? 'Safe.' : ''].filter(Boolean).join(' '),
                attrs: {fightOption: m.id}, blocked: blocked || (m.usable === false ? m.why || 'Not possible now.' : ''), onChoose: () => move({moveId: m.id})})),
            ...t.orders.map(o => ({id: `order:${o.orderId}:${o.allyId}`, label: o.label, time: `${o.cost} time`, affects: `${o.text} Heard ${o.odds}; not certain.`,
                attrs: {fightOption: `order:${o.orderId}:${o.allyId}`}, blocked, onChoose: () => move({moveId: 'order', allyId: o.allyId, orderId: o.orderId})})),
            {id: 'handover', label: 'Let a careful policy take one safe turn', affects: 'Plays only brace, tend or back away for you; never a new attack.', attrs: {fightOption: 'handover'}, blocked, onChoose: () => move({handOver: true})},
        ] : [{id: 'wait', label: 'Wait', affects: 'The others are acting.', attrs: {fightOption: 'wait'}, blocked: wait}];
        section.replaceChildren();
        const card = renderSceneCard(section, {kind: 'fight', id: 'fight-situation', attrs: {fightMode: 'tempo'}, header: {title: view.fight.title || 'Fight', place}, stakes: t.summary, options});
        notice = document.createElement('p'); notice.className = 'fight-situation-notice'; notice.setAttribute('role', 'status'); notice.textContent = lastNotice;
        card.querySelector('.scene-card-stakes').after(notice);
        const next = document.createElement('p'); next.className = 'fight-situation-next'; next.textContent = `Who acts next: ${t.next.join(' → ')}`;
        notice.after(next);
        const versus = document.createElement('div'); versus.className = 'fight-situation-versus'; next.after(versus);
        renderVersusRow(versus, t.versus);
        if (t.aims.length) {
            const setAim = domainRegistry.command('tempo_fight', 'aim');
            const reason = !setAim ? 'Aiming is unavailable until the contest can accept an aim.' : !t.yourTurn ? 'Not your turn yet.' : '';
            const row = document.createElement('p'); row.className = 'fight-situation-aims'; row.dataset.tempoAims = '';
            row.append('Aim: ');
            for (const a of [{id: null, label: 'Anywhere', text: 'No particular mark: the blow lands where it lands.'}, ...t.aims]) {
                const button = document.createElement('button'); button.type = 'button'; button.textContent = a.label;
                button.dataset.fightAim = a.id ?? 'any'; button.disabled = !!reason;
                button.title = `${a.text}${a.id ? ' Costs a little time; a small mark is easier to avoid.' : ''}`;
                button.setAttribute('aria-pressed', String(t.aim === a.id));
                button.onclick = () => {
                    try { setAim({aim: a.id}); lastNotice = ''; } catch (error) { lastNotice = error.message; }
                    cardKey = ''; render();
                };
                row.append(button);
            }
            if (reason) { const why = document.createElement('span'); why.textContent = ` ${reason}`; row.append(why); }
            versus.after(row);
        }
        const log = document.createElement('ol'); log.className = 'fight-situation-log'; log.setAttribute('aria-label', 'What happened in this fight');
        for (const line of t.log) { const li = document.createElement('li'); li.textContent = line; log.append(li); }
        card.append(log);
        if (t.dev.length) {
            const readout = document.createElement('ul'); readout.className = 'fight-situation-dev'; readout.setAttribute('aria-label', 'Developer readout: type split per hit');
            for (const line of t.dev) { const li = document.createElement('li'); li.textContent = line; readout.append(li); }
            card.append(readout);
        }
        return true;
    }
    function render() {
        // The native reader binds after modules load (bindNativeView); until then there is no fight to read.
        let combat = null; try { combat = getCombat(); } catch { combat = null; }
        const actions = document.getElementById('location_actions_div');
        if (renderTempo(actions)) return;
        if (section.dataset.fightMode === 'tempo') { delete section.dataset.fightMode; section.hidden = true; section.replaceChildren(); cardKey = textKey = ''; }
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
            // Text first (LTU7): lines the chips cannot carry sit above the versus row (round 2, R2-S1).
            lines = document.createElement('ul'); lines.className = 'fight-situation-lines'; stakes.after(lines);
            figure = document.createElement('div'); figure.className = 'fight-situation-versus'; card.append(figure);
        }
        const next = figureText(situation.spec);
        if (next === textKey) return;
        textKey = next;
        if (stakes.textContent !== situation.summary) stakes.textContent = situation.summary;
        // Chips carry intent and one-on-one odds; the lines keep the numbers behind threat, the odds
        // explanation when chances are not shown, and tempo.
        // One home per fact (round 3): a per-opponent threat lives on its card's chip (with the bound); only the together line stays here.
        const notes = [...situation.lethal.filter(l => l.id === null).map(l => ({state: l.level === 'lethal' ? 'strained' : undefined, text: l.text})),
            ...(situation.odds.shown ? [] : [{state: 'unknown', text: situation.odds.text}]), {text: situation.tempo}];
        lines.replaceChildren(...notes.map(note => {
            const li = document.createElement('li'); li.className = `fig-note${note.state ? ` fig-state--${note.state}` : ''}`;
            li.textContent = `${note.state ? `${FIGURE_STATES[note.state]} ` : ''}${note.text}`; return li;
        }));
        // L13 bridge: the harm rung a shown blow reaches comes from the L9 ladder. Typed outcomes, readied abilities and appraisal reads
        // are not in the engine yet (bridge gaps G4, G5), so they stay unread and the card keeps today's words.
        renderVersusRow(figure, versusWithEngine(situation.versus, {health: own.health, rungOf: harmRung}));
    }
    const timer = setInterval(render, every);
    return {render, stop: () => clearInterval(timer), node: section};
}
