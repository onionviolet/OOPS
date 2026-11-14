import {beginContest, CONTEST_DIALS, defaultChoice, entrantView, stepContest, TICKS_PER_SECOND} from '../../src/contest.js';
import {contestPack} from '../../src/contest_bodies.js';
import {canUseAtPosition, hasMeans} from '../../src/contest_position.js';
import {GU_CONTEST as law, wangErDuel} from '../../src/contest_packs/gu_world.js';
import {nextWorkingDeadline, quoteWorking} from '../../src/kernel_working.js';
import {composeSubstrate, createWorld} from '../../src/world_substrate.js';

const scene = wangErDuel();
const rules = composeSubstrate({packs: [contestPack({extra: scene.quantities})]});
const player = 'fang_yuan';
const names = {fang_yuan: 'Fang Yuan', wang_er: 'Wang Er', hunter_1: 'Hunter 1', hunter_2: 'Hunter 2', hunter_3: 'Hunter 3'};
const labels = {
    moonlight_gu: 'Moonblade', close_in: 'Close in', slip_past: 'Slip past', close_fist: 'Punch',
    bow_shot: 'Bow shot', drop_bow: 'Drop bow', wait: 'Wait', withdraw: 'Withdraw', yield: 'Yield',
};
const $ = id => document.getElementById(id);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const seconds = ticks => (ticks / TICKS_PER_SECOND).toFixed(1) + ' s';
const node = (tag, text, className) => {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (className) el.className = className;
    return el;
};

let world, record, selected, timer, policyNote, notice;
let mode = 'board', control = 'manual';
$('motion').checked = !reduceMotion.matches;

function reset() {
    clearTimeout(timer);
    world = createWorld(rules, {holders: scene.bodies});
    record = beginContest(law, {id: 'scene', seed: 5, place: scene.place, entrants: scene.entrants,
        sunDirection: scene.sunDirection}, world);
    selected = 'hunter_1';
    control = 'manual';
    policyNote = notice = '';
    render();
    queue();
}

// Mirror only the resolver's next-event ordering for the player input prompt.
function nextActor() {
    return Object.keys(record.entrants).filter(id => record.entrants[id].status === 'in')
        .map(id => {
            const e = record.entrants[id];
            return {id, running: e.working?.status === 'running',
                at: nextWorkingDeadline(e.working ?? {}) ?? e.ready};
        }).sort((a, b) => a.at - b.at || (a.id < b.id ? -1 : 1))[0];
}

function awaitingPlayer() {
    const next = nextActor();
    return !record.result && next?.id === player && !next.running;
}

function roster() {
    return Object.entries(record.entrants).map(([id, row]) => ({
        ...entrantView(law, record, world, id), name: names[id], max: row.max.vitality,
        outcome: row.outcome, due: row.working?.status === 'running' ? row.working.deadlines.at(-1) : null,
        target: row.working?.bindings.target?.id,
    }));
}

function quoteMove(me, target, id) {
    const move = law.moves[id];
    let costs = move.costs ?? {}, reason = '';
    if (move.bridge) {
        const b = move.bridge;
        const quote = quoteWorking(b.law, b.method, {id: 'contest.quote', bindings: b.bindings(me),
            facts: b.facts(me), ports: b.ports(me), at: 0});
        costs = quote.ok ? b.spent(me, quote.facts) : {};
        if (!quote.ok) reason = 'Needs enough essence and a usable Moonlight Gu.';
    }
    if (move.target !== 'self' && !target?.able) reason = 'Choose a standing opponent.';
    else if (move.target !== 'self' && !canUseAtPosition(me, target, move)) {
        reason = id === 'close_in' ? 'Already close enough.' : 'Out of reach.';
    } else if (!hasMeans(me, move)) reason = 'You cannot use the hand or tool this needs.';
    const time = id === 'wait' ? CONTEST_DIALS.waitTicks.value : id === 'withdraw' ? CONTEST_DIALS.leaveTicks.value
        : move.steps.reduce((sum, t) => sum + Math.max(1, Math.round(t * 100 / record.entrants[player].speed)), 0);
    const essence = costs.primeval_essence;
    const detail = reason || [seconds(time), essence ? `${essence} essence` : '',
        id === 'withdraw' ? 'Escape attempt' : ''].filter(Boolean).join(' · ');
    return {id, target: move.target === 'self' ? player : target?.id, reason, detail};
}

function turn(choice) {
    if (record.result) return;
    const before = record;
    const oldLog = before.log.map(row => JSON.stringify(row));
    try {
        const next = stepContest(law, before, rules, world, {choose: (l, r, w, id) => {
            if (id === player && choice) return choice;
            const picked = defaultChoice(l, r, w, id);
            if (id === player) policyNote = picked
                ? `Auto chose ${labels[picked.move] ?? picked.move}${picked.target !== player ? ' → ' + names[picked.target] : ''}.`
                : 'Auto found no usable move.';
            return picked;
        }});
        ({record, world} = next);
        notice = '';
    } catch (error) {
        notice = error.message;
        control = 'manual';
        render();
        return;
    }
    const newLog = record.log.map(row => JSON.stringify(row));
    let overlap = Math.min(oldLog.length, newLog.length);
    while (overlap && !oldLog.slice(-overlap).every((line, index) => line === newLog[index])) overlap--;
    const recentMotion = record.log.slice(overlap);
    render();
    animate(before, recentMotion);
    queue(recentMotion.length ? 330 : 145);
}

function queue(delay = 140) {
    clearTimeout(timer);
    if (record.result || (control === 'manual' && awaitingPlayer())) return;
    timer = setTimeout(() => turn(), delay);
}

function setView(view) {
    mode = view;
    $('board').hidden = mode !== 'board';
    $('text-scene').hidden = mode !== 'text';
    $('board-mode').setAttribute('aria-pressed', mode === 'board');
    $('text-mode').setAttribute('aria-pressed', mode === 'text');
    $('motion').disabled = mode === 'text';
    $('scene-note').textContent = mode === 'board'
        ? 'Follow each figure’s line to its ground position. Figures can share a point.'
        : 'Positions run from left to right. Choose a target to check which moves can reach.';
}

function setControl(value) {
    control = value;
    if (value === 'auto' && !record.result) policyNote = 'Auto uses the fixture’s default move priority.';
    render();
    queue();
}

function stageScale(rows) {
    const positions = [...rows.map(row => row.position), ...Object.values(record.dropped ?? {})];
    const min = Math.min(-1, ...positions), max = Math.max(8, ...positions);
    return {min, max, x: position => 8 + 84 * (position - min) / (max - min)};
}

function condition(row) {
    if (!row.able) return row.outcome ?? 'out';
    if (row.held?.bow) return 'bow in hand';
    if (row.harm?.parts?.hands?.rung) return `${row.harm.parts.hands.rung} hand`;
    return 'standing';
}

function tell(row) {
    if (row.due === null || !row.able) return '';
    const aim = row.target && row.target !== row.id ? ` → ${names[row.target]}` : '';
    return `${labels[row.busy] ?? row.busy}${aim} · ${seconds(Math.max(0, row.due - record.clock))}`;
}

function alongGround(rows) {
    return [...rows].sort((a, b) => a.position - b.position);
}

function drawBoard(rows) {
    const {min, max, x} = stageScale(rows);
    const occupied = [];
    const tokens = alongGround(rows).map(row => {
        const selectable = row.id !== player && row.able;
        const token = node(selectable ? 'button' : 'div', '', `actor ${row.id === player ? 'player' : row.id}${row.able ? '' : ' out ' + row.outcome}`);
        const lane = occupied.findIndex(position => x(row.position) - x(position) >= 12);
        const displayLane = lane < 0 ? occupied.length : lane;
        occupied[displayLane] = row.position;
        token.dataset.actor = row.id;
        token.dataset.position = row.position;
        token.style.setProperty('--x', x(row.position) + '%');
        token.style.setProperty('--lane', displayLane);
        const sprite = node('span', '', 'sprite');
        sprite.setAttribute('aria-hidden', 'true');
        token.append(sprite, node('span', row.name, 'name'), node('span', tell(row) || condition(row), 'tell'));
        if (selectable) {
            token.type = 'button';
            token.setAttribute('aria-pressed', row.id === selected);
            token.setAttribute('aria-label', `Target ${row.name}, position ${row.position}, ${condition(row)}${tell(row) ? ', ' + tell(row) : ''}`);
            token.onclick = () => selectTarget(row.id);
        }
        return token;
    });
    for (const position of new Set(rows.map(row => row.position))) {
        const pin = node('span', '', 'position-pin');
        pin.dataset.position = position;
        pin.setAttribute('aria-hidden', 'true');
        pin.style.setProperty('--x', x(position) + '%');
        tokens.push(pin);
    }
    for (const position of Object.values(record.dropped ?? {})) {
        const bow = node('span', '⌒  Dropped bow', 'bow');
        bow.style.setProperty('--x', x(position) + '%');
        tokens.push(bow);
    }
    $('actors').replaceChildren(...tokens);
    $('board').style.height = Math.max(283, 145 + (occupied.length - 1) * 77) + 'px';
    const ticks = [];
    for (let i = min; i <= max; i++) {
        const mark = node('span', String(i));
        mark.style.left = (i - min) / (max - min) * 100 + '%';
        ticks.push(mark);
    }
    document.querySelector('.axis').replaceChildren(...ticks);
    $('effects').replaceChildren();
}

function drawText(rows, me) {
    const landmarks = new Map();
    const add = (position, label) => {
        if (!landmarks.has(position)) landmarks.set(position, []);
        landmarks.get(position).push(label);
    };
    for (const row of rows) {
        add(row.position, `${row.id === player ? 'Fang Yuan (you)' : row.name} · ${condition(row)}${tell(row) ? ' · ' + tell(row) : ''}`);
    }
    for (const position of Object.values(record.dropped ?? {})) add(position, 'Dropped bow');
    const positions = node('ul');
    for (const [position, occupants] of [...landmarks].sort(([a], [b]) => a - b)) {
        const distance = position - me.position;
        const relation = distance ? `${Math.abs(distance)} ${distance < 0 ? 'left' : 'right'} of you` : 'where you stand';
        const line = node('li');
        line.dataset.position = position;
        line.append(node('strong', `Position ${position}`), document.createTextNode(` · ${relation} · ${occupants.join(' / ')}`));
        positions.append(line);
    }
    $('text-scene').replaceChildren(node('p', 'The sun is on the right. Each position is a point along the ground.'), positions);
}

function reportText(row) {
    const who = names[row.actor] ?? 'Someone';
    const whom = names[row.target];
    switch (row.move) {
        case 'moonlight_gu': case 'bow_shot': case 'close_fist':
            return `${who} ${row.move === 'moonlight_gu' ? 'casts at' : row.move === 'bow_shot' ? 'shoots at' : 'punches at'} ${whom}. ${row.outcome === 'hit'
                ? 'Hit' + (row.landed ? ' · ' + row.landed : '') : row.outcome[0].toUpperCase() + row.outcome.slice(1)}.${row.glare ? ' Sun glare affects the shot.' : ''}`;
        case 'close_in': return `${who} closes on ${whom}, reaching position ${row.position}.`;
        case 'slip_past': return `${who} slips past ${whom} to position ${row.position}.`;
        case 'drop_bow': return `${who} drops the bow at position ${row.position}.`;
        case 'interrupted': return `${who} is interrupted${row.by ? ' by ' + names[row.by] : ''}.`;
        case 'down': return `${who} is ${row.outcome}.`;
        case 'yield': return `${who} yields · ${row.outcome}${row.posture ? ', ' + row.posture : ''}.`;
        case 'withdraw': return `${who} tries to withdraw · ${row.outcome}.`;
        case 'none': return `${who} has no usable move.`;
        default: return `${who} · ${labels[row.move] ?? row.move}${row.outcome ? ' · ' + row.outcome : ''}`;
    }
}

function render() {
    const focus = document.activeElement;
    const focusMove = focus?.dataset.move, focusActor = focus?.dataset.actor;
    const rows = roster(), me = rows.find(row => row.id === player);
    const foes = rows.filter(row => row.id !== player && row.able);
    if (!foes.some(row => row.id === selected)) selected = foes[0]?.id ?? '';
    const next = nextActor();
    const waiting = awaitingPlayer();
    const manualTurn = control === 'manual' && waiting;
    const status = record.result
        ? me.outcome === 'withdrew' ? 'Fang Yuan got away' : record.result.winner === player ? 'Fang Yuan wins'
            : record.result.winner === 'hunters' ? 'Wang Er’s side wins' : 'The fight ends without a winner'
        : control === 'auto' ? 'Auto is running' : waiting ? 'Waiting for your move' : 'Resolving the exchange';
    if ($('status').textContent !== status) $('status').textContent = status;
    $('clock').textContent = `Fight time ${seconds(record.clock)}`;
    $('manual').setAttribute('aria-pressed', control === 'manual');
    $('auto').setAttribute('aria-pressed', control === 'auto');
    $('auto').disabled = !!record.result;
    $('manual').disabled = !!record.result;
    drawBoard(rows);
    drawText(rows, me);
    const target = $('target');
    target.replaceChildren(...foes.map(row => new Option(`${row.name} · distance ${Math.abs(row.position - me.position)}`, row.id)));
    target.value = selected;
    target.disabled = !foes.length || !!record.result;
    $('pending').textContent = record.result ? 'Restart to try another approach.' : manualTurn ? 'Choose a target and a move.'
        : control === 'auto' && waiting ? 'The policy will choose the next move.' : `Next event · ${names[next.id]} at ${seconds(next.at)}`;
    $('moves').replaceChildren(...['moonlight_gu', 'close_fist', 'close_in', 'slip_past', 'wait', 'withdraw'].map(id => {
        const quote = quoteMove(me, foes.find(row => row.id === selected), id);
        const button = node('button', labels[id], 'move');
        button.type = 'button';
        button.dataset.move = id;
        button.disabled = !manualTurn || !!quote.reason;
        button.append(node('small', quote.detail));
        button.onclick = () => {
            if (control === 'manual' && awaitingPlayer()) turn({move: id, target: quote.target});
        };
        return button;
    }));
    $('notice').textContent = notice;
    $('policy-note').textContent = policyNote || 'Committed moves and their results appear here.';
    $('vitals').replaceChildren(...[[`${me.quantities.vitality} / ${me.max}`, 'Vitality'],
        [String(me.quantities.primeval_essence), 'Primeval essence']].map(([value, label]) => {
        const block = node('div');
        block.append(node('strong', value), node('span', label));
        return block;
    }));
    $('log').replaceChildren(...[...record.log].reverse().map(row => {
        const item = node('li');
        item.append(node('time', seconds(row.at)), document.createTextNode(reportText(row)));
        return item;
    }));
    setView(mode);
    if (focusActor) document.querySelector(`button[data-actor="${focusActor}"]`)?.focus();
    if (focusMove) {
        const replacement = document.querySelector(`[data-move="${focusMove}"]`);
        if (!replacement.disabled) replacement.focus();
        else if (manualTurn) $('target').focus();
    }
}

function selectTarget(id) {
    selected = id;
    render();
}

function animate(before, events) {
    if (mode !== 'board' || !$('motion').checked) return;
    const {x} = stageScale(roster());
    for (const event of events) {
        const actor = document.querySelector(`[data-actor="${event.actor}"]`);
        if (!actor) continue;
        const old = before.entrants[event.actor].position, pos = record.entrants[event.actor].position;
        const sprite = actor.querySelector('.sprite');
        if (old !== pos) {
            actor.animate([{left: x(old) + '%'}, {left: x(pos) + '%'}], {duration: 280, easing: 'ease-out'});
        }
        const resolvedStrike = ['hit', 'miss', 'blocked'].includes(event.outcome);
        if (resolvedStrike && (event.move === 'moonlight_gu' || event.move === 'bow_shot')) {
            const projectile = node('span', '', 'bolt ' + event.move);
            const targetPosition = before.entrants[event.target].position;
            const end = event.outcome === 'miss' ? targetPosition + (Math.sign(targetPosition - old) || 1) * .6 : targetPosition;
            projectile.style.left = x(old) + '%';
            $('effects').append(projectile);
            projectile.animate([{left: x(old) + '%'}, {left: x(end) + '%', opacity: 0}],
            {duration: 275, easing: 'ease-in'}).onfinish = () => projectile.remove();
        } else if (resolvedStrike && event.move === 'close_fist') {
            const direction = Math.sign(before.entrants[event.target].position - old) || 1;
            sprite.animate([{translate: '0'}, {translate: direction * 14 + 'px'}, {translate: '0'}], {duration: 245});
        }
        if (event.outcome === 'hit' || event.move === 'interrupted') {
            const id = event.move === 'interrupted' ? event.actor : event.target;
            document.querySelector(`[data-actor="${id}"] .sprite`)?.animate([{opacity: 1}, {opacity: .3}, {opacity: 1}], {duration: 245});
        }
    }
}

$('text-mode').onclick = () => setView('text');
$('board-mode').onclick = () => setView('board');
$('motion').onchange = () => {
    if ($('motion').checked) return;
    $('board').getAnimations({subtree: true}).forEach(animation => animation.cancel());
    $('effects').replaceChildren();
};
$('manual').onclick = () => setControl('manual');
$('auto').onclick = () => setControl('auto');
$('target').onchange = event => selectTarget(event.target.value);
$('reset').onclick = reset;
reset();
