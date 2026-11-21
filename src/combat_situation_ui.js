import {domainRegistry} from './domain_registry.js';
import {foldTempoRoster, fromCombatOpponentsProjection, tempoRoster} from './opponent_board.js';
import {fightSituation, pickLeaveChoice, tempoSituation} from './ui/combat_situation.js';
import {config} from './config.js';
import {RAT_STEP_MOVE} from './tempo_fight_contract.js';
import {centerModes} from './center_modes.js';
import {nativeAttackProgress} from './combat_focus.js';
import {figureText, FIGURE_STATES} from './ui/figure.js';
import {readyWord} from './ui/combat_versus.js';
import {knownNumberNode} from './ui/known_number.js';
import {kitControl, kitElement as node} from './ui/kit.js';
import {readPort} from './ui_ports.js';
import {projectItemView} from './item_views.js';
import {settledTempoPresentation, settledTempoRoster} from './tempo_fight.js';
import {renderSceneCard} from './ui/scene_card.js';
import {renderApproachStrip} from './ui/approach_strip.js';
import {syncBestiaryTerms, watchBestiaryTerms} from './ui/bestiary_terms.js';
import {foeKind, TERMS, TERMS_LABEL, TERMS_TEXT} from './fight_terms.js';
import {effectsCap, getDisplaySetting} from './display_settings.js';
import {worldFamily, currentWorldFamily} from './world_look.js';
import {HANDOVER_LABEL, HANDOVER_TEXT, RUN_LABEL, RUN_TEXT, captureTempoFocus, restoreTempoFocus, newTempoLines} from './ui/tempo_interaction.js';

// Fight time is counted in beats (PS32): the fight's own clock, not the world's.
const beats = n => `${n} beat${n === 1 ? '' : 's'}`;
const TEMPO_CENTER = 'tempo-combat';
const leaveChoice = () => pickLeaveChoice([...document.querySelectorAll('#location_actions_div .action_travel[data-travel]')]);

// PS206, PS222 (proposals): Display > Look > Fight log (src/ui/variant.js LOOK_OPTIONS): the last six lines in the box (default), every
// line, each card's own latest line, or the Reports stream.
const FIGHT_LOG_LINES = 6, fightLogMode = () => getDisplaySetting('panel.look.fightLog') || 'reports';
// PS289: every tempo line goes to Reports under its Combat filter, as YAIR's own fight lines do (yours as hero lines, the rest as enemy lines).
// The Reports writer is passed in by the mount (ui/combat_display.js holds display.js's log_message), so this file adds no import cycle.
const reportText = row => row?.querySelector('.log-original')?.textContent ?? row?.textContent;
const reportCount = text => /^(.*) ×(\d+)$/.exec(text ?? '');
function reportTempoLine(write, line) {
    if (!write) return;
    const stream = document.getElementById('message_box_div');
    let last = stream?.lastElementChild;
    while (last?.hasAttribute('data-report-session-only')) last = last.previousElementSibling;
    const text = reportText(last), match = reportCount(text);
    const tempo = last?.hasAttribute('data-tempo-report') || last?.matches('.report-earlier:not(.report-earlier-head)');
    if (tempo && (match?.[1] || text) === line) {
        const count = Number(match?.[2] ?? 1) + 1;
        const copies = last.querySelectorAll('.log-original, .log-compact');
        for (const copy of copies.length ? copies : [last]) {
            const badge = copy.querySelector('.fight-report-count') || node('span', 'fight-report-count');
            if (copies.length) { badge.textContent = ' ×' + count; copy.append(badge); }
            else copy.textContent = line + ' ×' + count;
        }
    } else {
        const previous = stream?.lastElementChild;
        write(line, /^(You|Your)\b/.test(line) ? 'hero_attacked' : 'enemy_attacked', {safeText: true});
        const added = stream?.lastElementChild;
        if (added && added !== previous) added.dataset.tempoReport = '';
    }
}
// Earlier rows are restored as plain text. Non-combat reports may follow the last move.
export function reportedTempoPrefix(lines, earlier) {
    earlier = earlier.flatMap(text => {
        const count = reportCount(text);
        return count ? Array(Math.min(lines.length, Number(count[2]))).fill(count[1]) : [text];
    });
    for (let length = Math.min(lines.length, earlier.length); length > 0; length--) {
        if (earlier.some((_, start) => lines.slice(0, length).every((line, offset) => line === earlier[start + offset]))) return length;
    }
    return 0;
}

// PS291: short labels for the two hand-over moves; their full words go in the tooltip.
const SHORT_LABEL = {run: 'Fight on', handover: 'One careful turn'};
const MOVE_ROWS = {body: 'Body and weapon', powers: 'Powers', items: 'Items', terms: 'Terms'};
const MOVE_KEYS = {body: 'abcdefg', powers: 'qrst', items: 'zxcv'};
const FIELD_WORDS = {light: {day: 'Daylight', dark: 'Dark', dim: 'Dim', night: 'Night'}, footing: {firm: 'Firm footing', bad: 'Poor footing'}};

const moveSlot = option => ['escalate', 'plead'].includes(option.id) ? 'stakes' : option.id;

function arrangeMoves(host, options, {order, belt, moreOpen, setMore}) {
    const moves = node('div', 'fight-page-moves');
    const rows = new Map([...host.querySelectorAll('.scene-card-option')].map(row => [row.firstElementChild.dataset.fightOption, row]));
    host.append(moves);
    for (const [source, label] of Object.entries(MOVE_ROWS)) {
        const slots = order[source];
        const members = options.filter(o => o.source === source).sort((a, b) => slots.indexOf(moveSlot(a)) - slots.indexOf(moveSlot(b)));
        if (!members.length && !(source === 'items' && belt)) continue;
        const group = node('section', 'fight-page-group'), strip = node('div', 'fight-page-strip');
        group.dataset.moveSource = source;
        const cells = members.map((o, i) => {
            const cell = rows.get(o.id), button = cell.firstElementChild;
            cell.dataset.fightEffect = o.effect;
            if (source === 'terms') {
                const quote = cell.querySelector('.scene-card-quote');
                if (quote) button.append(' ', quote);
                if (o.blocked) {
                    const reason = cell.querySelector('.scene-card-blocked');
                    reason.id = 'fight-term-reason-' + o.id;
                    button.setAttribute('aria-describedby', reason.id);
                }
            }
            if (MOVE_KEYS[source]) {
                button.dataset.fightMoveSource = source;
                const key = MOVE_KEYS[source][i];
                if (key) {
                    button.dataset.fightKey = key;
                    button.setAttribute('aria-keyshortcuts', key.toUpperCase());
                    const badge = node('kbd', 'fight-page-key', key.toUpperCase());
                    badge.setAttribute('aria-hidden', 'true');
                    button.prepend(badge);
                }
                button.title += ' Shift + ← or → to reorder.';
            }
            return cell;
        });
        group.append(node('h3', '', label), strip);
        moves.append(group);
        strip.append(...cells);
        const cardWidth = host.closest('.scene-card')?.clientWidth || 0;
        const columns = source === 'powers' ? getComputedStyle(strip).gridTemplateColumns.split(' ').filter(size => size.endsWith('px')).length : 0;
        const visibleLimit = 2 * (columns || Math.max(1, Math.floor(cardWidth / 135)));
        if (source === 'powers' && cells.length > visibleLimit) {
            const extra = node('details', 'fight-page-extra');
            extra.open = moreOpen;
            extra.addEventListener('toggle', () => setMore(extra.open));
            const additional = node('div', 'fight-page-strip');
            additional.append(...cells.slice(visibleLimit - 1));
            extra.append(node('summary', '', 'More'), additional);
            strip.append(extra);
        }
        if (source === 'items' && belt) {
            const pack = kitControl(node('button', 'fight-page-pack', members.length ? 'Pack' : 'Nothing ready · Open pack'), 'fight:pack');
            pack.type = 'button';
            pack.onclick = () => document.getElementById('switch_to_inventory')?.click();
            strip.append(pack);
        }
    }
    if (!moves.childElementCount) moves.remove();
}

function track(kind, label, text, fraction, number) {
    const box = node('div', 'fight-page-track');
    box.dataset.track = kind;
    box.title = [label, text, number].filter(Boolean).join(' · ');
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', box.title);
    if (fraction != null) box.style.setProperty('--fight-fill', `${Math.round(Math.max(0, Math.min(1, fraction)) * 100)}%`);
    if (number) box.append(node('span', '', number));
    return box;
}

function observationLine(row) {
    const line = node('div', 'fight-page-observations');
    const {attack, speed} = row.observations || {};
    const seen = Number.isFinite(row.attack?.atk);
    for (const [label, name, value] of [
        ['Atk', 'Attack', seen ? `${row.attack.atkEstimated ? '~' : ''}${Math.round(row.attack.atk)}` : attack],
        ['Spd', 'Speed', speed], ['Hit', 'Hit chance'], ['Ddg', 'Dodge chance'], ['Def', 'Defense'],
    ]) {
        const slot = node('span');
        slot.dataset.observation = label;
        slot.title = [name, value || 'Unknown', label === 'Atk' && seen && (row.attack.heardFrom || attack)].filter(Boolean).join(' · ');
        slot.setAttribute('aria-label', slot.title);
        const reading = node('span', '', value || '?');
        slot.append(node('small', '', label), ' ', reading);
        if ((label === 'Atk' && !seen && attack) || (label === 'Spd' && speed)) {
            reading.className = 'fight-page-stat-full';
            if (label === 'Atk') slot.append(node('span', 'fight-page-stat-short', '~'));
        }
        line.append(slot);
    }
    return line;
}

function postureWords(row) {
    return row ? [row.posture !== 'Standing' || row.protection ? row.posture : '', row.protection].filter(Boolean) : [];
}

function fighterEntry(row, {selected, canChoose, inspect}, entry, trails) {
    entry.dataset.combatSubject = row.id;
    entry.dataset.down = String(row.done);
    entry.dataset.target = String(selected);
    const identity = node('div', 'fight-page-identity');
    const name = node('h4', '', row.name);
    name.title = row.detail?.wants || '';
    if (canChoose && !row.done) {
        const b = kitControl(node('button', 'versus-inspect', row.name), 'fight:target:' + row.id);
        b.type = 'button';
        b.dataset.fightInspect = row.id;
        b.setAttribute('aria-pressed', String(selected));
        b.setAttribute('aria-label', 'Target ' + row.name);
        b.onclick = () => inspect(row.id);
        name.replaceChildren(b);
    }
    identity.append(name);
    if (selected) identity.append(node('span', 'fight-page-target', 'Target'));
    const learned = row.detail?.types?.filter(type => type.source === 'learned') ?? [];
    if (row.protection) {
        const protection = node('span', 'fight-page-protection', postureWords(row).join(' · '));
        protection.title = row.causes?.[row.protection] || 'Cause unclear.';
        identity.append(protection);
    }
    const conditions = [!row.protection && row.posture !== 'Standing' ? row.posture : '', row.detail?.opening ? 'Opening' : '',
        ...row.conditions, ...learned.map(type => type.word)].filter(Boolean);
    const status = node('span', 'fight-page-conditions', conditions.join(' · '));
    status.title = conditions.map(condition => [condition, row.causes?.[condition] ||
        (row.conditions.includes(condition) ? 'Cause unclear.' : '')].filter(Boolean).join(' · '))
        .concat(learned.map(type => 'Observed when struck with ' + type.name)).join(' · ');
    if (status.title) status.setAttribute('aria-label', status.title);
    if (conditions.length) identity.append(status);
    const timing = row.ready == null ? 'Out of turn order' : !row.next && row.ready >= 1 ? 'Ready' : readyWord(row.ready);
    const bars = node('div', 'fight-page-bars');
    const known = row.detail?.numbers;
    const hp = Number.isFinite(known?.hp) && known.maxHp > 0 ? `${Math.ceil(known.hp)}/${Math.ceil(known.maxHp)} hp` : '';
    const health = track('health', row.name + ' health', row.health, row.fraction, hp);
    let trail = trails.get(row.id);
    if (!trail) {
        trail = heroDamageTrail(row.fraction);
        trails.set(row.id, trail);
    }
    trail.update(health, row.fraction);
    bars.append(health, track('timing', row.name + ' timing', timing, row.ready));
    entry.replaceChildren(identity, observationLine(row), bars);
    return entry;
}

function foldEntry(members, inspect, entry) {
    const first = members[0], letters = members.map(m => m.detail?.letter).filter(Boolean);
    const runs = [];
    for (const letter of letters) {
        const last = runs.at(-1);
        if (letter.length === 1 && last?.at(-1).charCodeAt(0) + 1 === letter.charCodeAt(0)) last.push(letter);
        else runs.push([letter]);
    }
    const span = runs.map(run => run.length > 2 ? run[0] + '–' + run.at(-1) : run.join(', ')).join(', ');
    const label = first.packKind + ' ×' + members.length + (span ? ' (' + span + ')' : '');
    const next = members.reduce((a, b) => b.rank < a.rank ? b : a);
    entry.dataset.combatSubject = 'fold:' + first.id;
    entry.dataset.fold = String(members.length);
    entry.title = members.map(m => m.name).join(', ') + ' · ' + next.name + ' acts next of this group';
    const identity = node('div', 'fight-page-identity');
    const button = kitControl(node('button', 'versus-inspect', label), 'fight:target:' + next.id);
    button.type = 'button';
    button.dataset.fightInspect = next.id;
    button.dataset.fightFold = '';
    button.setAttribute('aria-label', 'Target ' + next.name + ' from ' + label);
    button.onclick = () => { button.focus({preventScroll: true}); inspect(next.id); };
    const title = node('h4');
    title.append(button);
    identity.append(title);
    const bars = node('div', 'fight-page-bars');
    const ticks = track('timing', label + ' timing', next.name + ' acts next of this group', 0);
    ticks.dataset.foldTicks = '';
    for (const member of members) {
        const tick = node('i', 'fight-page-tick');
        tick.style.setProperty('--tick', Math.round(member.ready * 100) + '%');
        tick.dataset.combatMember = member.id;
        tick.title = member.name;
        if (member === next) tick.dataset.next = '';
        ticks.append(tick);
    }
    bars.append(track('health', label + ' health', 'All fresh', 1), ticks);
    entry.replaceChildren(identity, observationLine(first), bars);
    return entry;
}

function renderRoster(host, opponents, {targetId, inspect, split, trails}) {
    const canChoose = inspect && opponents.filter(row => !row.done).length > 1;
    const folds = inspect ? foldTempoRoster(opponents, targetId, split) : new Map();
    const existing = new Map([...host.children].map(entry => [entry.dataset.combatSubject, entry]));
    const priorFold = new Map([...host.querySelectorAll('[data-combat-member]')].map(tick =>
        [tick.dataset.combatMember, tick.closest('[data-fold]')]));
    const entries = [], dead = [];
    for (const row of opponents) {
        const members = folds.get(row.id);
        if (members) {
            if (members[0] !== row) continue;
            // When the first rat leaves a group, its remaining members keep their row.
            const prior = priorFold.get(row.id);
            entries.push(foldEntry(members, inspect, prior && !entries.includes(prior) ? prior : node('article', 'fight-page-fighter')));
        } else if (row.posture === 'Dead' && opponents.length > 1) dead.push(row);
        else entries.push(fighterEntry(row, {selected: targetId === row.id, canChoose, inspect},
            existing.get(row.id) ?? node('article', 'fight-page-fighter'), trails));
    }
    if (dead.length) {
        const line = existing.get('dead') ?? node('p', 'fight-page-dead-fold');
        line.textContent = dead.map(row => row.name).join(', ') + ' · Dead';
        line.dataset.combatSubject = 'dead';
        for (const row of dead) {
            const anchor = node('span');
            anchor.dataset.fallen = row.id;
            line.append(anchor);
        }
        entries.push(line);
    }
    host.replaceChildren(...entries);
}

// Reuse the same recent damage segment for Hero and the public opponent bars.
function heroDamageTrail(initial) {
    let last = initial, recent = 0, expires = 0, meter, timeout;
    const clear = () => {
        clearTimeout(timeout);
        meter?.removeAttribute('data-recent-hit');
        recent = expires = 0;
    };
    const update = (target, current, damaged = false) => {
        if (!target || !Number.isFinite(current)) return;
        meter = target;
        if (current < last) {
            recent = Math.max(recent, last);
            expires = Date.now() + 1600;
        } else if (current === last && damaged && expires <= Date.now()) {
            // A bite can land without changing the visible health band. Mark
            // the end of that band with a fixed notch rather than a guessed HP.
            recent = current;
            expires = Date.now() + 1600;
        } else if (current > last) clear();
        last = current;
        if (expires <= Date.now()) return;
        meter.style.setProperty('--fight-after-hit', Math.max(0, recent === current ? current - .035 : current) * 100 + '%');
        meter.style.setProperty('--fight-before-hit', recent * 100 + '%');
        meter.dataset.recentHit = '';
        clearTimeout(timeout);
        timeout = setTimeout(clear, expires - Date.now());
    };
    return {update, clear};
}

function showReaction(target, kind) {
    if (!target?.getClientRects().length || !fightMotion()) return;
    target.querySelector('.fight-page-hit-flash')?.remove();
    const cue = node('span', 'fight-page-hit-flash', kind);
    cue.dataset.reaction = kind;
    cue.setAttribute('aria-hidden', 'true');
    target.append(cue);
    setTimeout(() => cue.remove(), 850);
}

const fightMotion = () => !document.hidden && effectsCap() === 'full'
    && document.documentElement.dataset.lookMotion !== 'reduce'
    && !globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

const healthFraction = you => you?.maxHp > 0 ? Math.max(1, you.hp) / you.maxHp : null;
const carried = () => readPort('stock')?.carried ?? {};
function showGains(host, before, after) {
    if (!fightMotion() || !host?.getClientRects().length) return;
    const gains = Object.entries(after).filter(([key, n]) => n > (before[key] || 0));
    if (!gains.length) return;
    const stock = readPort('character')?.getItems() ?? {}, state = readPort('expansion');
    const names = gains.map(([key, n]) => {
        const item = stock[key]?.item;
        const label = item ? projectItemView(item, state, {name: item.getName(), description: item.description || ''}).name : 'item';
        return '+' + (n - (before[key] || 0)) + ' ' + label;
    });
    const cue = node('span', 'fight-page-gain', names.join(' · '));
    cue.setAttribute('aria-hidden', 'true');
    host.append(cue);
    const items = [...document.querySelectorAll('[data-character_item]')];
    for (const [key] of gains) {
        const item = items.find(row => row.dataset.character_item === key);
        if (item?.getClientRects().length) {
            item.dataset.fightNewItem = '';
            setTimeout(() => delete item.dataset.fightNewItem, 850);
        }
    }
    setTimeout(() => cue.remove(), 950);
}

function sizeRoster(roster, card, opponentCount) {
    const bounds = roster.getBoundingClientRect();
    const row = Math.min(...[...roster.querySelectorAll('.fight-page-fighter')].map(row => row.getBoundingClientRect().height));
    if (!Number.isFinite(row) || !row) return;
    const workspace = card.closest('[data-region="actions"]');
    const bottom = Math.min(document.documentElement.clientHeight, workspace?.getBoundingClientRect().bottom ?? Infinity);
    const backBar = document.getElementById('center_mode_navigation')?.getBoundingClientRect().height ?? 0;
    const frame = roster.offsetHeight - roster.clientHeight;
    const room = bottom - backBar - card.getBoundingClientRect().bottom + bounds.height;
    const rows = Math.max(6, Math.min(opponentCount, Math.floor((room - frame) / row)));
    roster.style.height = Math.ceil(rows * row + frame) + 'px';
    const target = roster.querySelector('[data-target="true"]');
    if (target) roster.scrollTop = Math.max(0, target.getBoundingClientRect().bottom - roster.getBoundingClientRect().bottom + 1);
}

const PREVIEW_FILL = {fresh: 1, hurt: 2 / 3, 'barely standing': 1 / 3, down: 0};
function bindHarmPreview(button, meter, row, likely) {
    if (!meter || button.disabled || !likely) return;
    const original = meter.title;
    const anticipate = () => {
        meter.dataset.harmPreview = '';
        meter.style.setProperty('--fight-harm-start', Math.min(row.fraction * .87, PREVIEW_FILL[likely]) * 100 + '%');
        meter.title = original + ' · Likely ' + likely + ' on a hit';
        meter.setAttribute('aria-label', meter.title);
    };
    const clear = () => {
        delete meter.dataset.harmPreview;
        meter.title = original;
        meter.setAttribute('aria-label', meter.title);
    };
    button.addEventListener('pointerenter', anticipate);
    button.addEventListener('pointerleave', () => { if (document.activeElement !== button) clear(); });
    button.addEventListener('focus', anticipate);
    button.addEventListener('blur', () => { if (!button.matches(':hover')) clear(); });
}

function renderPlayer(host, fight, t, party) {
    const me = party.find(row => row.id === 'player');
    const turn = t.yourTurn ? 'acts next' : fight.you.ready == null ? 'Out of turn order' : fight.you.ready >= 1 ? 'Ready' : readyWord(fight.you.ready);
    const clock = node('div', 'fight-page-player-turn');
    clock.append(node('span', '', 'Your turn'), node('strong', '', turn), track('timing', 'Your turn', turn, fight.you.ready));
    const approach = node('details', 'fight-page-player-approach');
    approach.open = host.querySelector('details')?.open ?? false;
    const stance = t.holdBack ? 'Holding back' : t.strip?.stance?.name;
    const terms = (t.strip?.terms || []).map(term => t.strip.terms.length > 1 ? `${term.kind}: ${TERMS_LABEL[term.terms]}` : TERMS_LABEL[term.terms]);
    approach.append(node('summary', '', [stance, ...terms].filter(Boolean).join(' · ') || 'Approach'));
    const facts = node('div', 'fight-page-player-facts');
    const fact = (label, value) => { if (value) facts.append(node('span', '', label), node('strong', '', value)); };
    for (const m of fight.you.means || []) fact(m.label, m.id === 'wand' ? (m.n ? 'In hand' : 'Missing') : String(m.n));
    if (fight.you.stock) fact(fight.you.stock.kindLabel || 'Ammunition', `${fight.you.stock.loaded} loaded · ${fight.you.stock.carried} carried`);
    fact('Moonglow Gu', fight.you.moonglow);
    const condition = [...postureWords(me), ...(me?.conditions || [])];
    fact('Condition', condition.join(' · '));
    for (const ally of party.filter(row => row.id !== 'player')) fact(ally.name, [ally.posture, ally.protection, ...ally.conditions].filter(Boolean).join(' · '));
    host.replaceChildren(clock, approach, facts);
    if (fightLogMode() === 'cards' && me?.detail?.last) host.append(node('p', 'versus-last', me.detail.last));
    return approach;
}

function rosterDetails(roster, showLast) {
    const facts = node('div', 'fight-page-facts');
    for (const {name, detail, side, done} of roster) {
        if (!detail) continue;
        const line = node('p');
        const labels = [detail.stamina?.text, detail.means, detail.mix && `Strikes: ${detail.mix}`, detail.sense, detail.wants].filter(Boolean);
        line.append(node('strong', '', name), ' · ', labels.join(' · '));
        if (side === 'b' && !done) {
            const numbers = detail.numbers ?? {};
            const attack = knownNumberNode(numbers.atk, numbers.atkEstimated ? {known: false} : {}, {field: `${name}: attack`, doc: document});
            if (numbers.heardFrom) attack.title = `From a rumour: ${numbers.heardFrom}.`;
            if (numbers.atk == null) attack.title = 'Watch it fight to learn how hard it hits.';
            line.append(labels.length ? ' · Threat ' : 'Threat ', attack);
            if (Number.isFinite(numbers.wasHeard) && Math.round(numbers.wasHeard) !== Math.round(numbers.atk)) {
                line.append(' (was ', node('del', 'versus-was', `~${Math.round(numbers.wasHeard)}`), ')');
            }
        }
        for (const type of detail.types ?? []) {
            const chip = node('span', 'versus-chip--type', `${type.glyph} ${type.word}${type.source === 'learned' ? '' : ` (${type.source})`}`);
            chip.dataset.damageType = type.type; chip.dataset.source = type.source;
            line.append(' · ', chip);
        }
        facts.append(line);
        if (showLast && detail.last) facts.append(node('p', 'versus-last', detail.last));
    }
    return facts;
}

function moveConditions(option, scene) {
    if (!option.effect || option.id.startsWith('order:')) return '';
    // Every ordinary tempo move can stumble. Withdrawal also quotes its footing and dark penalties.
    const facts = [scene.footing === 'bad' && 'Poor footing', scene.light === 'dark' && 'Dark',
        scene.weather === 'rain' && 'Rain', scene.visibility === 'fog' && 'Fog'].filter(Boolean);
    if (!facts.length) return '';
    return `${facts.join(' · ')}. ${option.id === 'withdraw' && (scene.footing === 'bad' || scene.light === 'dark')
        ? 'Harder to get away.' : 'More likely to stumble.'}`;
}

export function mountFightSituation({getCombat, readout, every = 400, report = null, foeKindOf = null}) {
    watchBestiaryTerms({kind: foeKindOf}); // PS50: bestiary rows name your terms for each kind of foe
    const section = document.createElement('section');
    section.id = 'fight_situation'; section.className = 'fight-situation'; section.setAttribute('aria-label', 'Fight situation');
    section.dataset.surfaceType = 'fight';
    section.hidden = true;
    // The card and its Withdraw row are built once per fight and leave choice; ticks only swap the
    // stakes text, the lines and the drawing, so the button never moves or rebuilds under a pointer (UR52).
    let inspectedOpponent = null;
    let cardKey = '', textKey = '', stakes = null, lines = null, notice = null, lastNotice = '';
    notice = document.createElement('p'); notice.className = 'fight-situation-notice';
    notice.setAttribute('role', 'status'); notice.tabIndex = -1;
    const outcome = document.createElement('p');
    outcome.className = 'fight-situation-notice--quiet';
    outcome.setAttribute('role', 'status');
    // Keys 1 and 2 press the decision band's buttons (PS21) while focus is in the card and not in a text field.
    section.addEventListener('keydown', e => {
        if (e.altKey || e.ctrlKey || e.metaKey || e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName || '')) return;
        if (e.shiftKey && ['ArrowLeft', 'ArrowRight'].includes(e.key) && e.target.dataset.fightMoveSource) {
            e.preventDefault();
            if (!e.repeat) reorder(e.target, e.key === 'ArrowLeft' ? -1 : 1);
            return;
        }
        if (!/^[a-gq-tzxcv1-9]$/i.test(e.key)) return;
        const b = section.querySelector(`button[data-fight-key="${e.key.toLowerCase()}"]`);
        if (!b || b.disabled || !b.getClientRects().length) return;
        e.preventDefault();
        if (!e.repeat) { b.focus({preventScroll: true}); b.click(); }
    });
    section.addEventListener('click', e => {
        const button = e.target.closest('button[data-fight-option]');
        if (!button || button.disabled) return;
        if (e.detail > 1) { e.preventDefault(); e.stopImmediatePropagation(); }
        else button.focus({preventScroll: true});
    }, true);
    const resume = document.createElement('button');
    resume.type = 'button'; resume.textContent = 'Return to fight'; resume.hidden = true;
    resume.addEventListener('click', () => {
        centerModes().open(TEMPO_CENTER);
        notice.focus({preventScroll: true});
    });
    const heroCycle = document.createElement('label');
    heroCycle.className = 'native-hero-cycle';
    heroCycle.hidden = true;
    const attack = document.createElement('progress');
    attack.max = 100;
    const heroNext = document.createElement('span');
    heroNext.className = 'attack-next';
    heroNext.textContent = 'Next';
    heroNext.hidden = true;
    heroCycle.append('Your attack cycle', attack, heroNext);
    const drawHeroCycle = combat => {
        const bar = combat?.attackers_ui_slot?.firstElementChild?.querySelector('[data-attack_bar]');
        const progress = nativeAttackProgress(bar);
        if (progress !== null && !heroCycle.isConnected) document.getElementById('basic_character_info_div')?.append(heroCycle);
        heroCycle.hidden = progress === null;
        if (progress !== null && Math.abs(attack.value - progress) >= .5) attack.value = progress;
    };
    const playerPanel = node('section', 'fight-page-player');
    playerPanel.setAttribute('aria-label', 'Your fight');
    let lastRoster = [], fighterRoster = null, damageTrail = null, split = new Set(), trails = new Map();
    let moveSlots = new Map(), moveOrder, fateMovesOpen = false, powersMoreOpen = false, previousStock = {};
    let seenPresentation = new WeakSet(), reportFightStarted = false;
    const ordersByLife = new Map();
    function reorder(button, direction) {
        const slots = moveOrder[button.dataset.fightMoveSource];
        const index = slots.indexOf(button.dataset.fightOption), next = index + direction;
        if (index < 0 || next < 0 || next >= slots.length) return;
        [slots[index], slots[next]] = [slots[next], slots[index]];
        cardKey = '';
        render();
    }
    function feedbackFor(events, host) {
        const fresh = events.filter(event => !seenPresentation.has(event));
        for (const event of fresh) seenPresentation.add(event);
        for (const [id, marks] of Map.groupBy(fresh.filter(event => event.subject), event => event.subject)) {
            const cssId = CSS.escape(id);
            const row = id === 'player' ? document.getElementById('character_healthbar_max') :
                host?.querySelector(`[data-combat-subject="${cssId}"], [data-fallen="${cssId}"], [data-combat-member="${cssId}"]`);
            const kind = marks.findLast(event => event.kind !== 'miss' && event.kind !== 'blocked')?.kind ?? marks.at(-1).kind;
            const dead = row?.closest('.fight-page-dead-fold');
            const fighter = row?.closest('.fight-page-fighter');
            const track = fighter?.querySelector('[data-track="health"]');
            const health = lastRoster.find(row => row.id === id)?.fraction;
            if (marks.some(event => event.damaged) && !track?.hasAttribute('data-recent-hit')) trails.get(id)?.update(track, health, true);
            const down = fighter?.dataset.down === 'true' && fighter.querySelector('.fight-page-conditions')?.textContent.match(/^(?:Dead|Down|Unconscious)/);
            showReaction(dead ?? fighter ?? row, dead || down ? 'fall' : kind);
        }
        return fresh.flatMap(event => event.line ? [event.line] : []);
    }
    let cycleOffset = 0;
    const alignHeroCycle = () => {
        const enemy = document.querySelector('#main_content[data-combat-lanes="native"] #current_focus .enemy-card-cycle:not([hidden])');
        let offset = 0;
        if (enemy && attack.checkVisibility()) {
            const own = attack.getBoundingClientRect();
            const other = enemy.getBoundingClientRect();
            const delta = Math.round(other.top - own.top + cycleOffset);
            // Both tracks already occupy a row. Add only the room needed to
            // align them, and leave the regular flow in unusual layouts.
            if (delta > 1 && delta <= own.height * 9) offset = delta;
        }
        if (offset !== cycleOffset) {
            heroCycle.parentElement?.style.setProperty('--hero-cycle-offset', `${offset}px`);
            cycleOffset = offset;
        }
    };
    let nativeLeave = null;
    const showWithdraw = leave => {
        if (nativeLeave === leave) return;
        nativeLeave?.removeAttribute('data-withdraw-proxy');
        nativeLeave = leave;
        nativeLeave?.setAttribute('data-withdraw-proxy', '');
    };
    const publishFight = (mode, text = '') => {
        const root = document.getElementById('main_content');
        if (!root) return;
        if (mode) {
            if (root.dataset.activeFight !== mode) root.dataset.activeFight = mode;
            if (root.dataset.fightReport !== text) root.dataset.fightReport = text;
        } else {
            if (root.dataset.activeFight) delete root.dataset.activeFight;
            if (root.dataset.fightReport) delete root.dataset.fightReport;
        }
    };
    let previousLog = [], previousNoticeWasError = false, approachOpen = false;
    // The approach line folds the fight's setup (stakes, stance, terms, aim) into one summary; both fight forms share it (PS290).
    const approachFold = title => { const approach = document.createElement('details'), sum = document.createElement('summary'); approach.className = 'fight-situation-approach'; approach.dataset.fightApproach = ''; approach.open = approachOpen; sum.title = title; return {approach, sum}; };
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
        if (!t.active || !actions) return false;
        // A restored fight keeps the intent it opened with, including a saved
        // choice which differs from this life’s current default for that kind.
        if (t.strip && t.terms) t.strip = {...t.strip, terms: t.strip.terms.map(term => ({...term, terms: t.terms[term.kind] ?? term.terms}))};
        showWithdraw(null);
        publishFight('tempo', view.fight.title || 'Move by move');
        const opening = section.dataset.fightMode !== 'tempo';
        const center = centerModes();
        if (opening) {
            fighterRoster = node('section', 'fight-situation-versus fight-page-roster');
            fighterRoster.setAttribute('aria-label', 'Opponents');
            document.getElementById('character_combat_management')?.prepend(playerPanel);
            damageTrail?.clear();
            damageTrail = heroDamageTrail(healthFraction(view.fight.you));
            moveSlots = new Map();
            split = new Set();
            for (const trail of trails.values()) trail.clear();
            trails = new Map();
            seenPresentation = new WeakSet();
            reportFightStarted = false;
            previousStock = carried();
            const life = (readPort('expansion')?.actors?.player?.worldId || '') + ':' + (readPort('character')?.name || '');
            if (!ordersByLife.has(life)) ordersByLife.set(life, Object.fromEntries(Object.keys(MOVE_ROWS).map(source => [source, []])));
            moveOrder = ordersByLife.get(life);
            fateMovesOpen = false;
            powersMoreOpen = false;
            inspectedOpponent = null;
            actions.before(resume);
            actions.after(outcome);
            outcome.textContent = '';
            center.registerView(TEMPO_CENTER, section, 'fight');
            center.open(TEMPO_CENTER);
        }
        resume.hidden = center.mode !== 'local';
        damageTrail?.update(document.getElementById('character_healthbar_max'), healthFraction(view.fight.you));
        const ask = view.fight.ask || [];
        const roster = tempoRoster(view.fight, t.versus);
        const opponents = roster.filter(row => row.side === 'b'), party = roster.filter(row => row.side === 'a');
        lastRoster = opponents;
        const scene = view.fight.scene || {};
        const {light, footing, weather, visibility} = scene;
        const sceneFacts = [place, FIELD_WORDS.light[light] || light, FIELD_WORDS.footing[footing] || footing, weather === 'rain' && 'Rain', visibility === 'fog' && 'Fog'];
        const bystanders = roster.filter(row => row.side === 'a' && row.id !== 'player').map(row => row.name);
        if (bystanders.length) sceneFacts.push(`With you: ${bystanders.join(', ')}`);
        const stock = carried(), belt = Object.values(stock).some(count => count > 0);
        const key = JSON.stringify([t, roster, view.fight.you, sceneFacts, ask, belt, view.fight.turn]);
        if (section.hidden) section.hidden = false;
        if (key === cardKey) return true;
        const previousFocus = captureTempoFocus(section, ['fightOption', 'fightAim', 'fightInspect']);
        const playerFocus = playerPanel.contains(document.activeElement) ? document.activeElement : null;
        const playerTerm = playerFocus?.closest('[data-approach-terms]')?.dataset.approachTerms;
        const rosterScroll = fighterRoster.scrollTop;
        if (opening) syncBestiaryTerms(); // terms set on the opener reach the bestiary when the fight opens
        cardKey = key; textKey = '';
        section.dataset.fightMode = 'tempo';
        const command = domainRegistry.command('tempo_fight', 'move'), blocked = command ? '' : 'The contest cannot take moves right now.';
        // A refused move keeps the contest's own reason on the card (DSG10), and the card redraws on the next tick.
        const move = request => { try { command(request); lastNotice = ''; } catch (error) { lastNotice = error.message; } cardKey = ''; render(); };
        // Fight on (CBD38): the contest's own 'run' command plays a steady policy until something needs the player and says why it stopped.
        const runCommand = domainRegistry.command('tempo_fight', 'run');
        const runOn = () => { try { lastNotice = runCommand() || ''; } catch (error) { lastNotice = error.message; } cardKey = ''; render(); };
        const wait = t.yourTurn ? '' : 'Not your turn yet.';
        const targetId = roster.some(row => row.id === inspectedOpponent && !row.done) ? inspectedOpponent : view.fight.targetId;
        const termsCommand = domainRegistry.command('tempo_fight', 'terms'), losingCommand = domainRegistry.command('tempo_fight', 'losing');
        const said = fn => { try { lastNotice = fn() || ''; } catch (error) { lastNotice = error.message; } cardKey = ''; render(); };
        const pickTerms = (kind, value) => said(() => { const result = termsCommand({kind, value}); syncBestiaryTerms(); return result; });
        const termsOptions = (t.strip?.terms || []).flatMap(term => TERMS.filter(id => id !== 'take_alive' || term.takeAlive).map(id => {
            const option = 'terms:' + term.kind + ':' + id;
            return {id: option, source: 'terms', label: (t.strip.terms.length > 1 ? term.kind + ' · ' : '') + TERMS_LABEL[id],
                affects: TERMS_TEXT[id], attrs: {fightOption: option, fightTermSelected: String(term.terms === id)},
                blocked: termsCommand ? '' : blocked, onChoose: () => pickTerms(term.kind, id)};
        }));
        const seenOptions = t.yourTurn ? [
            // The window after a downing blow (CBC4): finish or spare, one pair per body, ahead of the ordinary moves.
            ...(t.fateMoves || []).map(m => ({id: `${m.id}:${m.targetId}`, label: m.label, time: beats(m.cost), affects: m.text,
                attrs: {fightOption: `${m.id}:${m.targetId}`, fightFate: m.id === 'bind_fate' ? 'bind' : m.id}, blocked, onChoose: () => move({moveId: m.id, targetId: m.targetId})})),
            ...t.moves.map(m => ({id: m.id, label: m.label, effect: m.effect,
                source: ['withdraw', 'yield', 'plead', 'escalate'].includes(m.id) ? 'terms' : m.kit ? 'powers' : 'body',
                time: beats(m.cost), cost: m.quote ?? m.price, harm: m.harm, affects: m.text, detail: m.detail, attack: m.mixText, odds: m.odds, recovery: m.recovery,
                aim: (m.id === 'jab' || m.id === 'swing') ? t.aims.find(a => a.id === t.aim)?.label : null,
                attrs: {fightOption: m.id, ...(m.id === RAT_STEP_MOVE && m.usable && !blocked ? {fightReady: ''} : {})}, blocked: blocked || (m.usable === false ? (m.why || 'Not possible now.').replace(/^Needs (.+); ([\d.]+) left\.$/, `${m.label} needs $1, you have $2.`) : ''), onChoose: () => move({moveId: m.id, ...((m.kit || ['jab', 'swing', 'shoot'].includes(m.id)) && inspectedOpponent === targetId ? {targetId} : {})})})),
            ...t.orders.map(o => ({id: `order:${o.orderId}:${o.allyId}`, label: o.label, source: 'body', effect: 'influence', time: beats(o.cost), affects: `${o.text} Heard ${o.odds}; not certain.`,
                attrs: {fightOption: `order:${o.orderId}:${o.allyId}`}, blocked, onChoose: () => move({moveId: 'order', allyId: o.allyId, orderId: o.orderId})})),
            {id: 'handover', label: HANDOVER_LABEL, affects: HANDOVER_TEXT, attrs: {fightOption: 'handover'}, blocked, onChoose: () => move({handOver: true})},
            {id: 'run', label: RUN_LABEL, affects: RUN_TEXT, attrs: {fightOption: 'run'}, blocked: blocked || (runCommand ? '' : 'The contest cannot fight on right now.'), onChoose: runOn},
        ] : [{id: 'wait', label: 'Wait', affects: 'The others are acting.', attrs: {fightOption: 'wait'}, blocked: wait}];
        const current = new Map([...seenOptions, ...termsOptions].filter(option => option.source).map(option => [moveSlot(option), option]));
        for (const [id, option] of current) {
            moveSlots.set(id, option);
            if (!moveOrder[option.source].includes(id)) moveOrder[option.source].push(id);
        }
        const ordinaryOptions = [...moveSlots].map(([id, option]) => current.get(id) ?? {
            ...option, blocked: wait || 'This move is unavailable now.', onChoose: null,
        });
        const options = [...seenOptions.filter(o => o.attrs.fightFate || (o.id === 'wait' && !ordinaryOptions.length)), ...ordinaryOptions];
        const quoted = options.map(o => ({...o, label: SHORT_LABEL[o.id] || o.label,
            affects: undefined, ...(o.blocked && o.source !== 'terms' ? {time: undefined, cost: undefined} : {})}));
        section.replaceChildren();
        const field = [FIELD_WORDS.light[light] || light, FIELD_WORDS.footing[footing] || footing].filter(Boolean).join(' · ');
        const card = renderSceneCard(section, {kind: 'fight', id: 'fight-situation', attrs: {fightMode: 'tempo'},
            header: {title: place || view.fight.title || 'Fight'}, options: quoted});
        const heading = card.querySelector('.scene-card-header');
        const sceneSummary = sceneFacts.filter(Boolean).join(' · ');
        heading.after(notice, fighterRoster);
        renderRoster(fighterRoster, opponents, {targetId, split, trails, inspect: id => { inspectedOpponent = id; cardKey = ''; render(); }});
        fighterRoster.scrollTop = rosterScroll;
        const playerApproach = renderPlayer(playerPanel, view.fight, t, party);
        const target = opponents.find(row => row.id === targetId);
        const targetTrack = fighterRoster.querySelector('[data-target="true"] [data-track="health"]');
        const byOption = new Map(options.map(option => [option.id, option]));
        for (const button of card.querySelectorAll('button[data-fight-option]')) {
            const option = byOption.get(button.dataset.fightOption);
            kitControl(button, 'fight:' + option.id);
            if (option.attrs.fightTermSelected !== undefined) button.setAttribute('aria-pressed', option.attrs.fightTermSelected);
            const facts = [option.attack && `Damage: ${option.attack}`, option.aim && `Aim: ${option.aim}`,
                option.odds && `Chance: ${option.odds}`, option.recovery, option.detail || option.affects,
                moveConditions(option, scene)].filter(Boolean);
            button.title = option.blocked || facts.join(' · ');
            if (option.blocked) button.parentElement.title = [option.blocked, ...facts].join(' · ');
            bindHarmPreview(button, targetTrack, target, option.harm?.[targetId]);
        }
        const moveLayout = {order: moveOrder, belt, moreOpen: powersMoreOpen, setMore: open => { powersMoreOpen = open; }};
        const fateRows = [...card.querySelectorAll('button[data-fight-fate]')].map(b => b.parentElement);
        if (fateRows.length) {
            const band = node('div', 'fight-situation-band'); band.dataset.fightBand = '';
            const targets = Map.groupBy(t.fateMoves, move => move.targetId);
            fateRows[0].before(band);
            let i = 0;
            for (const moves of targets.values()) {
                const target = node('section', 'fight-page-fate');
                target.append(node('p', 'fight-situation-band-head', `${moves[0].name} ${moves[0].yielding ? 'yields' : 'is down'}.`));
                for (const m of moves) {
                    const row = fateRows[i++], b = row.firstElementChild;
                    if (fateRows.length <= 9) {
                        b.dataset.fightKey = String(i);
                        b.setAttribute('aria-keyshortcuts', String(i));
                        b.prepend(node('kbd', 'fight-situation-key', String(i)), ' ');
                    }
                    target.append(row);
                }
                band.append(target);
            }
            const more = node('details', 'fight-situation-more'); more.dataset.fightMore = '';
            more.open = fateMovesOpen;
            more.addEventListener('toggle', () => { fateMovesOpen = more.open; });
            more.append(node('summary', '', 'Other moves'));
            more.append(...[...card.querySelectorAll('.scene-card-option')].filter(row => !band.contains(row)));
            band.after(more);
            arrangeMoves(more, ordinaryOptions, moveLayout);
        } else {
            arrangeMoves(card, ordinaryOptions, moveLayout);
        }
        const events = feedbackFor(view.fight.presentation ?? [], fighterRoster);
        const added = reportFightStarted && events.length ? events : newTempoLines(previousLog, t.log);
        const earlier = !previousLog.length && !view.fight.openedHere
            ? [...document.querySelectorAll('#message_box_div .report-earlier:not(.report-earlier-head)')].map(row => row.textContent)
            : [];
        for (const line of added.slice(reportedTempoPrefix(t.log, earlier))) reportTempoLine(report, line);
        reportFightStarted = true;
        const hitOnYou = added.findLast(line => /hits? you\b|on you[:,]|^Your .* (are|is) /i.test(line));
        const feedback = lastNotice || hitOnYou || added.at(-1) || (previousNoticeWasError ? 'The fight continues.' : notice.textContent || 'The fight continues.');
        if (!opening && events.length) showGains(fighterRoster.querySelector('[data-target="true"]'), previousStock, stock);
        previousStock = stock;
        previousLog = [...t.log]; previousNoticeWasError = !!lastNotice;
        const next = node('p', 'fight-situation-next', `${t.yourTurn ? 'Your move' : 'Waiting for the other side'} · ${t.next.join(' → ')}`);
        const versus = fighterRoster;
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
            versus.after(s); // PS206: both sides first, then what the fight is and how you fight it
        }
        if (t.strip) {
            renderApproachStrip(playerApproach, {strip: {...t.strip, terms: []}, stakes: t.stakes || {}, disabled: !termsCommand,
                on: {losing: value => said(() => losingCommand({value}))}});
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
            (section.querySelector('.fight-situation-stakes') || versus).after(row);
        }
        const fold = [section.querySelector('.fight-situation-stakes'), section.querySelector('[data-tempo-aims]')].filter(Boolean);
        const {approach, sum} = approachFold(`${sceneSummary}. Open fight details.`);
        approach.classList.add('fight-page-scene');
        sum.className = 'scene-card-header';
        sum.setAttribute('aria-label', `${sceneSummary}. Fight details`);
        sum.append(node('span', '', place || view.fight.title || 'Fight'));
        if (field) sum.append(node('small', 'fight-page-scene-conditions', field));
        const facts = rosterDetails(opponents, fightLogMode() === 'cards');
        const utilities = node('div', 'fight-situation-foot');
        for (const u of seenOptions.filter(o => o.id === 'run' || o.id === 'handover')) {
            const button = kitControl(node('button', '', SHORT_LABEL[u.id]), 'fight:' + u.id);
            button.type = 'button'; button.dataset.fightOption = u.id;
            button.disabled = !!u.blocked; button.title = u.blocked || u.affects;
            button.onclick = u.onChoose;
            utilities.append(button);
        }
        approach.append(sum, node('p', 'scene-card-stakes', sceneSummary), next, facts, ...fold);
        if (ask.length) approach.append(node('p', 'fight-situation-ask', ask.join(' ')));
        if (utilities.childElementCount) approach.append(utilities);
        heading.replaceWith(approach);
        const cue = approach.querySelector('[data-fight-cue]');
        if (cue) fighterRoster.after(cue);
        approach.addEventListener('toggle', () => { approachOpen = approach.open; });
        const log = document.createElement('ol'); log.className = 'fight-situation-log'; log.setAttribute('aria-label', 'What happened in this fight');
        const mode = fightLogMode();
        for (const line of mode === 'box' ? t.log.slice(-FIGHT_LOG_LINES) : t.log) { const li = document.createElement('li'); li.textContent = line; log.append(li); }
        if (mode === 'reports') { /* PS289: the lines are in Reports; the box prints none */ }
        else if (mode === 'cards') { const whole = document.createElement('details'); whole.className = 'fight-situation-whole'; whole.dataset.fightWhole = '';
            const sum = document.createElement('summary'); sum.textContent = `The whole fight (${t.log.length} line${t.log.length === 1 ? '' : 's'})`; whole.append(sum, log); card.append(whole); }
        else card.append(log);
        if (t.dev.length) {
            const readout = document.createElement('ul'); readout.className = 'fight-situation-dev'; readout.setAttribute('aria-label', 'Developer readout: type split per hit');
            for (const line of t.dev) { const li = document.createElement('li'); li.textContent = line; readout.append(li); }
            card.append(readout);
        }
        if (notice.textContent !== feedback) notice.textContent = feedback;
        notice.classList.remove('fight-situation-notice--quiet');
        if (playerFocus) {
            const group = playerTerm ? playerApproach.querySelector(`[data-approach-terms="${playerTerm}"]`) : playerApproach;
            const target = playerFocus.dataset.approachOption ? group?.querySelector(`[data-approach-option="${playerFocus.dataset.approachOption}"]`) :
                playerFocus.tagName === 'SELECT' ? playerApproach.querySelector('select') : playerApproach.querySelector('summary');
            target?.focus({preventScroll: true});
        } else restoreTempoFocus(section, previousFocus, notice);
        if (opening) {
            const openedRoster = fighterRoster;
            requestAnimationFrame(() => {
                if (openedRoster.isConnected && fighterRoster === openedRoster) sizeRoster(openedRoster, openedRoster.parentElement, opponents.length);
            });
            section.parentElement.scrollTop = 0;
            notice.focus({preventScroll: true});
        }
        return true;
    }
    function render() {
        // The native reader binds after modules load (bindNativeView); until then there is no fight to read.
        let combat = null; try { combat = getCombat(); } catch { combat = null; }
        const actions = document.getElementById('location_actions_div');
        if (section.dataset.fightSettled !== undefined) {
            if (centerModes().mode === TEMPO_CENTER) return;
            delete section.dataset.fightSettled;
            delete section.dataset.fightMode;
            centerModes().releaseView(TEMPO_CENTER);
            if (actions) actions.after(section);
            section.hidden = true;
            section.replaceChildren();
        }
        if (renderTempo(actions)) { drawHeroCycle(null); return; }
        if (section.dataset.fightMode === 'tempo') {
            const center = centerModes();
            playerPanel.remove();
            playerPanel.replaceChildren();
            resume.remove();
            let view = null; try { view = domainRegistry.project('tempo_fight'); } catch { /* status below remains honest */ }
            const facts = readPort('expansion')?.actors?.player?.facts;
            const roster = settledTempoRoster(facts);
            damageTrail?.update(document.getElementById('character_healthbar_max'), healthFraction(roster?.find(row => row.id === 'player')));
            const finishedHere = roster && center.mode === TEMPO_CENTER && section.querySelector('.fight-page-roster');
            if (!finishedHere) {
                center.close(TEMPO_CENTER);
                center.releaseView(TEMPO_CENTER);
                section.hidden = true;
                section.replaceChildren();
                delete section.dataset.fightMode;
            }
            cardKey = textKey = '';
            // PS289, PS51: the card stops drawing when the fight ends, so its result goes to Reports here, once, as one combat line (the last
            // blow, how each side ended, what was taken or carried). "hero_missed" is the plain combat kind: filed under Combat, no hit colour.
            const result = view?.account ? [view.account.head, ...view.account.items.filter(([k]) => k !== 'Asked').map(([k, text]) => `${k}: ${text}`)].join(' ') : view?.last ? `Fight ended: ${view.last}.` : '';
            // The last move's lines first: the fight closed on that move, so the card never drew them (found playing Harry's duel).
            const closing = settledTempoPresentation(facts);
            const lines = closing.length ? closing.filter(event => event.line && !seenPresentation.has(event)).map(event => event.line)
                : newTempoLines(previousLog, view?.account?.lines ?? []);
            for (const line of lines) reportTempoLine(report, line);
            if (result) {
                outcome.textContent = result;
                report?.(result, 'hero_missed', {safeText: true});
            }
            previousLog = []; previousNoticeWasError = false; lastNotice = '';
            if (finishedHere) {
                const byId = new Map(roster.map(row => [row.id, row]));
                const finished = lastRoster.map(row => {
                    const end = byId.get(row.id);
                    if (!end) return row;
                    const owned = end.maxHp > 0;
                    return {...row, ...end, name: row.name, detail: null,
                        fraction: owned ? end.hp / end.maxHp : end.done ? 0 : row.fraction,
                        health: owned ? `${Math.ceil(end.hp)}/${Math.ceil(end.maxHp)} hp` : end.done ? '—' : row.health};
                });
                renderRoster(finishedHere, finished, {trails});
                const card = finishedHere.parentElement;
                const title = node('p', 'scene-card-header');
                title.append(...card.querySelector('.scene-card-header').childNodes);
                card.replaceChildren(title, finishedHere, notice);
                notice.classList.remove('fight-situation-notice--quiet');
                notice.textContent = [view?.account?.head, ...((view?.account?.items || []).filter(([key]) => ['Carried', 'Taken'].includes(key)).map(([, value]) => value))].filter(Boolean).join(' ');
                feedbackFor(closing, finishedHere);
                const target = finishedHere.querySelector('.fight-page-fighter[data-down="true"], .fight-page-dead-fold') ?? notice;
                showGains(target, previousStock, carried());
                notice.focus({preventScroll: true});
                section.dataset.fightSettled = '';
                return;
            }
        }
        if (actions && section.previousElementSibling !== actions) actions.after(section);
        const inCombat = !!combat && !combat.is_ended && !!combat.attackers?.[0]?.tags?.main_character;
        const place = document.getElementById('location_name_span')?.textContent.trim() || '';
        drawHeroCycle(inCombat ? combat : null);
        publishFight(inCombat ? 'native' : '', place ? `Auto-fighting at ${place}` : 'Auto-fighting');
        if (inCombat) alignHeroCycle();
        const shown = !!actions && inCombat && actions.checkVisibility?.() !== false;
        if (!shown) {
            showWithdraw(null);
            section.hidden = true; cardKey = textKey = ''; return;
        }
        const own = readout(combat, {fighter_index: 0, is_attacker: true}), board = fromCombatOpponentsProjection(domainRegistry.project('combat-opponents'));
        const situation = fightSituation(board, {name: 'You', health: own.health, speed: Number(own.speed), defense: own.defense,
            minDamageShare: own.protection?.minDamageShare, damageTaken: own.protection?.damageTaken, sideSize: combat.attackers.length}, {place});
        if (section.hidden === situation.active) section.hidden = !situation.active;
        const leave = situation.active ? leaveChoice() : null;
        showWithdraw(leave);
        if (!situation.active) return;
        const leaveText = leave?.textContent.replace(/\s+/g, ' ').trim() || '';
        const route = /^Go back to (?:\[([^\]]+)\]|([^[]+?))(?: \[([^\]]+)\])?$/.exec(leaveText);
        const withdraw = route ? [`Withdraw to ${route[1] || route[2]}`, route[3]].filter(Boolean).join(' · ') : 'Withdraw';
        if (cardKey !== `${place}\n${leaveText}`) {
            cardKey = `${place}\n${leaveText}`; textKey = ''; section.replaceChildren();
            // PS296 (Weibao: "wasted space for the combat one... what happened to the original?"): in a native fight YAIR's own Opponent box
            // above is the fight view. This card keeps no second copy of the fighters: only the folded approach line and Withdraw.
            const card = renderSceneCard(section, {kind: 'fight', id: 'fight-situation', header: {}, stakes: ' ',
                options: [{id: 'leave', label: withdraw, affects: route ? '' : leaveText, attrs: {fightOption: 'leave'},
                    blocked: leave ? '' : 'No way out is shown from here.', onChoose: () => leaveChoice()?.click()}]});
            stakes = card.querySelector('.scene-card-stakes');
            lines = document.createElement('ul'); lines.className = 'fight-situation-lines'; stakes.after(lines);
            const {approach, sum} = approachFold('Open to see how the fight stands and to change your stance and your terms.'), quiet = document.createElement('span');
            // The line states the approach itself; the shared group counter ("1 entry") would only count the tempo note.
            quiet.dataset.groupOwnStatus = ''; quiet.hidden = true; const say = text => { sum.textContent = text; sum.append(quiet); }; say('How you fight');
            approach.addEventListener('toggle', () => { approachOpen = approach.open; });
            card.prepend(approach); approach.append(sum, stakes, lines);
            // The same approach strip as the fight card (PS39): stance and terms for each kind here. This loop cannot stop to ask yet,
            // so Ask me and losing terms are not offered in it.
            const stripFor = domainRegistry.command('tempo_fight', 'stripFor'), termsCommand = domainRegistry.command('tempo_fight', 'terms');
            const kinds = [...new Set((combat.defenders || []).map(d => foeKind(d)))];
            if (stripFor && kinds.length) {
                const host = document.createElement('div'); host.dataset.nativeStrip = ''; approach.append(host);
                const draw = () => { const strip = stripFor({kinds, frame: 'original'}), term = strip?.terms?.[0];
                    say([strip?.stance?.name || '', term ? TERMS_LABEL[term.terms] : ''].filter(Boolean).join(' · ') || 'How you fight');
                    host.replaceChildren(); renderApproachStrip(host, {strip, stakes: {frame: 'original'}, asks: false, losing: false,
                    on: {terms: (kind, value) => { try { lastNotice = termsCommand({kind, value}); } catch (error) { lastNotice = error.message; } syncBestiaryTerms(); draw(); }}}); };
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
    }
    const timer = setInterval(render, every);
    return {render, stop() { clearInterval(timer); damageTrail?.clear(); for (const trail of trails.values()) trail.clear(); playerPanel.remove(); }, node: section};
}
