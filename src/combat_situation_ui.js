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
import {renderApproachStrip} from './ui/approach_strip.js';
import {foeKind} from './fight_terms.js';
import {versusWithEngine} from './read_models/combat_situation_bridge.js';
import {harmRung} from './harm_state.js';
import {worldFamily, currentWorldFamily} from './world_look.js';
import {HANDOVER_LABEL, HANDOVER_TEXT, RUN_LABEL, RUN_TEXT, captureTempoFocus, restoreTempoFocus, newTempoLines} from './ui/tempo_interaction.js';

// Fight time is counted in beats (PS32): the fight's own clock, not the world's.
const beats = n => `${n} beat${n === 1 ? '' : 's'}`;
const leaveChoice = () => pickLeaveChoice([...document.querySelectorAll('#location_actions_div .action_travel[data-travel]')]);

export function mountFightSituation({getCombat, readout, every = 400}) {
    const section = document.createElement('section');
    section.id = 'fight_situation'; section.className = 'fight-situation'; section.setAttribute('aria-label', 'Fight situation');
    section.hidden = true;
    // The card and its Withdraw row are built once per fight and leave choice; ticks only swap the
    // stakes text, the lines and the drawing, so the button never moves or rebuilds under a pointer (UR52).
    let cardKey = '', textKey = '', stakes = null, lines = null, figure = null, notice = null, lastNotice = '';
    notice = document.createElement('p'); notice.className = 'fight-situation-notice';
    notice.setAttribute('role', 'status'); notice.tabIndex = -1;
    // Keys 1 and 2 press the decision band's buttons (PS21) while focus is in the card and not in a text field.
    section.addEventListener('keydown', e => {
        if (e.altKey || e.ctrlKey || e.metaKey || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName || '')) return;
        const b = section.querySelector(`button[data-fight-key="${e.key}"]`);
        if (b && !b.disabled) { e.preventDefault(); b.click(); }
    });
    let previousLog = [], previousNoticeWasError = false;
    // Tempo mode (COMBAT.md round 3, R3-O1): the same card, versus row and log, with the move area filled by the
    // tempo contest's own moves. Reads the 'tempo_fight' projection; moves go through its 'move' command, which keeps
    // the contest's own checks. The world family (DESIGN.md DSG11, DSG13) only picks type names.
    function renderTempo(actions) {
        let view = null; try { view = domainRegistry.project('tempo_fight'); } catch { view = null; }
        if (!view?.fight || view.fight.result) return false;
        // The fight's own place first (PS30): a fight beyond the wall is not "in" the village the location line names.
        const place = view.fight.place || document.getElementById('location_name_span')?.textContent.trim() || '';
        const dev = !!config.enable_dev_mode || document.documentElement.dataset.dev === 'on';
        const t = tempoSituation(view, {place, worldId: view.fight.worldId ? worldFamily(view.fight.worldId) : currentWorldFamily(), dev});
        if (!t.active) return false;
        if (actions && section.previousElementSibling !== actions) actions.after(section);
        const ask = view.fight.ask || [];
        const key = `tempo\n${JSON.stringify(t)}\n${ask.join('|')}`;
        if (section.hidden) section.hidden = false;
        if (key === cardKey) return true;
        const previousFocus = captureTempoFocus(section, ['fightOption', 'fightAim']);
        const opening = section.dataset.fightMode !== 'tempo';
        cardKey = key; textKey = '';
        section.dataset.fightMode = 'tempo';
        delete section.dataset.fightFinished;
        const command = domainRegistry.command('tempo_fight', 'move'), blocked = command ? '' : 'The contest cannot take moves right now.';
        // A refused move keeps the contest's own reason on the card (DSG10), and the card redraws on the next tick.
        const move = request => { try { command(request); lastNotice = ''; } catch (error) { lastNotice = error.message; } cardKey = ''; render(); };
        // Fight on (CBD38): the contest's own 'run' command plays a steady policy until something needs the player and says why it stopped.
        const runCommand = domainRegistry.command('tempo_fight', 'run');
        const runOn = () => { try { lastNotice = runCommand() || ''; } catch (error) { lastNotice = error.message; } cardKey = ''; render(); };
        const wait = t.yourTurn ? '' : 'Not your turn yet.';
        const options = t.yourTurn ? [
            // The window after a downing blow (CBC4): finish or spare, one pair per body, ahead of the ordinary moves.
            ...(t.fateMoves || []).map(m => ({id: `${m.id}:${m.targetId}`, label: m.label, time: beats(m.cost), affects: m.text,
                attrs: {fightOption: `${m.id}:${m.targetId}`, fightFate: m.id}, blocked, onChoose: () => move({moveId: m.id, targetId: m.targetId})})),
            ...t.moves.map(m => ({id: m.id, label: m.label, time: beats(m.cost), ...(m.price ? {cost: m.price} : {}), affects: [m.text, m.mixText ? `Strikes ${m.mixText}.` : ''].filter(Boolean).join(' '),
                attrs: {fightOption: m.id}, blocked: blocked || (m.usable === false ? m.why || 'Not possible now.' : ''), onChoose: () => move({moveId: m.id})})),
            ...t.orders.map(o => ({id: `order:${o.orderId}:${o.allyId}`, label: o.label, time: beats(o.cost), affects: `${o.text} Heard ${o.odds}; not certain.`,
                attrs: {fightOption: `order:${o.orderId}:${o.allyId}`}, blocked, onChoose: () => move({moveId: 'order', allyId: o.allyId, orderId: o.orderId})})),
            {id: 'handover', label: HANDOVER_LABEL, affects: HANDOVER_TEXT, attrs: {fightOption: 'handover'}, blocked, onChoose: () => move({handOver: true})},
            {id: 'run', label: RUN_LABEL, affects: RUN_TEXT, attrs: {fightOption: 'run'}, blocked: blocked || (runCommand ? '' : 'The contest cannot fight on right now.'), onChoose: runOn},
        ] : [{id: 'wait', label: 'Wait', affects: 'The others are acting.', attrs: {fightOption: 'wait'}, blocked: wait}];
        section.replaceChildren();
        const card = renderSceneCard(section, {kind: 'fight', id: 'fight-situation', attrs: {fightMode: 'tempo'}, header: {title: view.fight.title || 'Fight', place}, stakes: t.summary, options});
        card.querySelector('.scene-card-stakes').after(notice);
        // Times are seconds of fight time (PS32); the meaning sits on hover of each time chip.
        for (const q of card.querySelectorAll('.scene-card-quote')) q.title = 'Beats of fight time this takes: the fewer you spend, the sooner you act again.';
        // The decision band (PS21, PS22): when a body is down, the choice about it leads the card in two wide buttons (keys 1 and 2);
        // the ordinary moves fold under "Other moves" and stay one click away (UR156).
        const fateRows = [...card.querySelectorAll('button[data-fight-fate]')].map(b => b.parentElement);
        if (fateRows.length) {
            const band = document.createElement('div'); band.className = 'fight-situation-band'; band.dataset.fightBand = '';
            const names = [...new Set((t.fateMoves || []).map(m => m.name))];
            const head = document.createElement('p'); head.className = 'fight-situation-band-head';
            const yielding = (t.fateMoves || []).every(m => m.yielding); // the other side gave up (PS48): the band says so
            head.textContent = `${names.join(' and ')} ${yielding ? (names.length > 1 ? 'yield' : 'yields') : names.length > 1 ? 'are down' : 'is down'}.`;
            band.append(head);
            fateRows[0].before(band);
            fateRows.forEach((row, i) => {
                const b = row.querySelector('button'), m = t.fateMoves[i];
                if (i < 9 && fateRows.length <= 2) b.dataset.fightKey = String(i + 1);
                if (m?.detail) b.title = m.detail;
                if (b.dataset.fightKey) { b.setAttribute('aria-keyshortcuts', b.dataset.fightKey); const k = document.createElement('kbd'); k.className = 'fight-situation-key'; k.textContent = b.dataset.fightKey; b.prepend(k, ' '); }
                band.append(row);
            });
            const rest = [...card.querySelectorAll('.scene-card-option')].filter(row => !band.contains(row));
            if (rest.length) {
                const more = document.createElement('details'); more.className = 'fight-situation-more'; more.dataset.fightMore = '';
                const sum = document.createElement('summary'); sum.textContent = `Other moves (${rest.length})`;
                more.append(sum, ...rest); band.after(more);
            }
        }
        const added = newTempoLines(previousLog, t.log);
        const feedback = lastNotice || (added.length ? added.join(' ') : previousNoticeWasError ? 'The fight continues.' : notice.textContent || 'The fight continues.');
        previousLog = [...t.log]; previousNoticeWasError = !!lastNotice;
        const next = document.createElement('p'); next.className = 'fight-situation-next'; next.textContent = `Who acts next: ${t.next.join(' → ')}`;
        notice.after(next);
        // Why the fight wants you now (the pause rule, CBD56): a line of its own, so it is not lost among the log lines.
        if (ask.length) { const why = document.createElement('p'); why.className = 'fight-situation-ask'; why.dataset.fightAsk = ''; why.textContent = `Worth a look: ${ask.join(' ')}`; notice.after(why); }
        const versus = document.createElement('div'); versus.className = 'fight-situation-versus'; next.after(versus);
        renderVersusRow(versus, t.versus);
        // What the fight is for, one line; the reasons one step away on hover (round 2 dials, WS1-WS3). Hold back sits beside it when a
        // downing blow could kill (CFC9, CBC32), free and saved with the fight.
        if (t.stakes) {
            // Stakes are shown, not picked (PS37): a chip that names what the fight is, with its reasons on hover; it flips when a move changes it
            // (a knife drawn, a plea heard) and the reason sits beside it (PS23).
            const s = document.createElement('p'); s.className = 'fight-situation-stakes'; s.dataset.fightStakes = t.stakes.preset;
            const deadly = t.stakes.cue ? (t.stakes.lethal ? 'now deadly' : 'no longer deadly') : t.stakes.lethal ? 'can be deadly' : 'not deadly';
            const chip = document.createElement('span'); chip.className = 'fight-situation-chip'; chip.dataset.fightStakesChip = ''; chip.tabIndex = 0;
            chip.textContent = `${t.stakes.label}: ${deadly}`;
            chip.title = [`At stake: ${t.stakes.stakes}.`, t.stakes.text, t.stakes.why?.replace(/^[A-Z]{1,4}\d+[a-z]?: (.)/, (_, c) => c.toUpperCase()), t.stakes.cue].filter(Boolean).join(' '); // design codes stay off the face (PRS1)
            s.append('Stakes ', chip);
            if (t.stakes.cue) { const cue = document.createElement('span'); cue.className = 'fight-situation-cue'; cue.dataset.fightCue = ''; cue.textContent = ` ${t.stakes.cue}`; s.append(cue); }
            // Restraint can slip when the blows run heavy for the foe (CBD213, PS24); the odds come from the fight.
            if (t.holdRisk > .15 && t.strip?.stance?.id === 'pulled') { const n = document.createElement('span'); n.className = 'fight-situation-risk'; n.dataset.fightRisk = ''; n.textContent = ` Your blows run heavy for this; a pulled blow may slip (about ${Math.round(t.holdRisk * 100)}%).`; s.append(n); }
            versus.before(s);
            // How you fight, your terms when they go down, and when you stop (PS34-PS42): the same strip the opener showed (PS39).
            if (t.strip) {
                const termsCommand = domainRegistry.command('tempo_fight', 'terms'), losingCommand = domainRegistry.command('tempo_fight', 'losing');
                const said = fn => { try { lastNotice = fn() || ''; } catch (error) { lastNotice = error.message; } cardKey = ''; render(); };
                const host = document.createElement('div'); s.after(host);
                renderApproachStrip(host, {strip: t.strip, stakes: t.stakes, disabled: !termsCommand,
                    on: {terms: (kind, value) => said(() => termsCommand({kind, value})), losing: value => said(() => losingCommand({value}))}});
            }
        }
        // No aim while a body is down: the choice in the band is the only question (PS21).
        if (t.aims.length && !(t.yourTurn && t.fateMoves?.length)) {
            const setAim = domainRegistry.command('tempo_fight', 'aim');
            const reason = !setAim ? 'Aiming is unavailable until the contest can accept an aim.' : !t.yourTurn ? 'Not your turn yet.' : '';
            const row = document.createElement('p'); row.className = 'fight-situation-aims'; row.dataset.tempoAims = '';
            row.append('Aim: ');
            for (const a of [{id: null, label: 'Anywhere', text: 'No particular mark: the blow lands where it lands.'}, ...t.aims]) {
                const button = document.createElement('button'); button.type = 'button'; button.textContent = a.label;
                button.dataset.fightAim = a.id ?? 'any'; button.disabled = !!reason;
                if (reason) button.dataset.disabledReason = reason;
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
        // A move's detail (how it works, what fills it, what it can do) is one step away, on hover (new depth stays off the face of the card).
        for (const m of t.moves) if (m.detail) { const btn = card.querySelector(`button[data-fight-option="${m.id}"]`); if (btn && !btn.disabled) btn.title = m.detail; }
        const log = document.createElement('ol'); log.className = 'fight-situation-log'; log.setAttribute('aria-label', 'What happened in this fight');
        for (const line of t.log) { const li = document.createElement('li'); li.textContent = line; log.append(li); }
        card.append(log);
        if (t.dev.length) {
            const readout = document.createElement('ul'); readout.className = 'fight-situation-dev'; readout.setAttribute('aria-label', 'Developer readout: type split per hit');
            for (const line of t.dev) { const li = document.createElement('li'); li.textContent = line; readout.append(li); }
            card.append(readout);
        }
        // Keep the result beside the move being operated, including when large text
        // puts the top of the card outside the scroll region.
        if (previousFocus?.key === 'fightOption') {
            const chosen = [...card.querySelectorAll('button[data-fight-option]')].find(button =>
                !button.disabled && button.dataset.fightOption === previousFocus.value);
            chosen?.parentElement.append(notice);
        }
        if (notice.textContent !== feedback) notice.textContent = feedback;
        restoreTempoFocus(section, previousFocus, notice);
        // A fight opened from a scrolled centre view (the Notebook's hunt row) kept that view's scroll, which left the card's
        // top, its title and first moves, above the scrollport. Opening brings the card's top into view once and moves focus to
        // its status line, so the view the fight was started from no longer holds focus and scrolls itself back on its next redraw.
        if (opening && !previousFocus) { section.scrollIntoView?.({block: 'start', behavior: 'instant'}); notice.focus({preventScroll: true}); }
        return true;
    }
    function render() {
        // The native reader binds after modules load (bindNativeView); until then there is no fight to read.
        let combat = null; try { combat = getCombat(); } catch { combat = null; }
        const actions = document.getElementById('location_actions_div');
        if (renderTempo(actions)) return;
        if (section.dataset.fightMode === 'tempo') {
            const previousFocus = captureTempoFocus(section, ['fightOption', 'fightAim']);
            let view = null; try { view = domainRegistry.project('tempo_fight'); } catch { /* status below remains honest */ }
            delete section.dataset.fightMode; section.replaceChildren(); cardKey = textKey = '';
            previousLog = []; previousNoticeWasError = false; lastNotice = '';
            if (previousFocus) {
                section.dataset.fightFinished = 'true'; section.hidden = false;
                section.append(notice);
                // The itemised result when this session watched the fight (CBD78); the plain word otherwise.
                notice.textContent = view?.account ? [view.account.head, ...view.account.items.map(([k, text]) => `${k}: ${text}`)].join(' ')
                    : view?.last ? `Fight ended: ${view.last}.` : 'Fight controls are no longer available.';
                notice.focus({preventScroll: true}); notice.scrollIntoView({block: 'nearest'});
            } else section.hidden = true;
        }
        if (actions && section.previousElementSibling !== actions) actions.after(section);
        const shown = !!actions && !!combat && !combat.is_ended && combat.attackers?.[0]?.tags?.main_character && actions.checkVisibility?.() !== false;
        if (!shown) {
            if (section.dataset.fightFinished && section.contains(document.activeElement)) return;
            delete section.dataset.fightFinished;
            if (!section.hidden) section.hidden = true; cardKey = textKey = ''; return;
        }
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
            // The same approach strip as the fight card (PS39): stance and terms for each kind here. This loop cannot stop to ask yet,
            // so Ask me and losing terms are not offered in it.
            const stripFor = domainRegistry.command('tempo_fight', 'stripFor'), termsCommand = domainRegistry.command('tempo_fight', 'terms');
            const kinds = [...new Set((combat.defenders || []).map(d => foeKind(d)))];
            if (stripFor && kinds.length) {
                const host = document.createElement('div'); host.dataset.nativeStrip = ''; card.append(host);
                const draw = () => { host.replaceChildren(); renderApproachStrip(host, {strip: stripFor({kinds, frame: 'original'}), stakes: {frame: 'original'}, asks: false, losing: false,
                    on: {terms: (kind, value) => { try { lastNotice = termsCommand({kind, value}); } catch (error) { lastNotice = error.message; } draw(); }}}); };
                draw();
            }
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
