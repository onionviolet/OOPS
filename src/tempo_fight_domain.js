import {registerDomain} from './domain_registry.js';
import {withDisplayFactsFrame} from './facts_frame.js';
import {check} from './basics.js';
import {commitSimulationCommand, previewSimulationCommand} from './simulation.js';
import {pursuitView} from './pursuit.js';
import {ROAD_RIVAL, RIVAL_PURSUIT} from './frontier_campaign.js';
import {readNativeFighter} from './native_battle.js';
import {typeSnapshot} from './damage_types.js';
import {partyHelperReasons, initializePartyBattle} from './party_battle.js';
import {PARTY_HELPER} from './native_battle_contracts.js';
import {rivalCombatant, rivalBrief, rivalStudyQuote, recordRivalStudy} from './rival_memory.js';
import {knownTargetFacts} from './known_target_facts.js';
import {applySimulationEffects} from './simulation_effects.js';
import {harmState, setHarmState, HARM_RUNGS, restReading} from './harm_state.js';
import {harmPart} from './harm_engine.js';
import {beginTempoFight, commitTempoMove, handOverTempoFight, tempoView, TEMPO_SCHEMA, TEMPO_FACT_HELD} from './tempo_fight.js';
import {tempoOpeners, tempoOpener} from './tempo_starters.js';
import {HANDOVER_LABEL, HANDOVER_TEXT, captureTempoFocus, restoreTempoFocus, newTempoLines} from './ui/tempo_interaction.js';

// Road-duel tempo route: the same pursuit and encounter, driven by the tempo clock (LSD307-LSD317).
// Text-first (LSD314): one line per step, a who-acts-next strip, moves with their time cost.
let ports, panel, aim = null;
// The fight's injuries reach the L9 ladder through its one door after the commit (default parts rows; a world without its own rows keeps them for when it has).
function applyHarm(plan) {
    for(const e of plan?.harmEffects || []) {
        // The player's own world picks its harm rows (a world without its own rows falls back to the default ones).
        let save = {harm: harmState(), expansion: {actors: {player: {worldId: ports?.root?.()?.actors?.player?.worldId || 'default'}}}};
        save = harmPart(save, e).save; setHarmState(save.harm);
    }
}
// FRC52, BHR16: a tired body acts slower; the player's fighter speed takes the rest need's work multiplier (needs.js stage
// times body strength). Null outside a world that keeps a rest record, so other fights are unchanged.
export const restedSpeed = (root, speed) => { const r = restReading({expansion: root, harm: harmState()}); return r ? Math.max(1, Math.round(speed * r.effect.work)) : speed; };
const carriedParts = () => Object.fromEntries(Object.entries(harmState().parts || {}).filter(([, p]) => HARM_RUNGS.includes(p.rung)).map(([id, p]) => [id, p.rung]));
export const configureTempoFight = operations => {ports = operations;};
// Damage types are read once from the live actors and kept on the saved profile; a fight saved without them reads as untyped physical.
const withTypes = (profile, actor) => ({...profile, types: typeSnapshot(actor)});
const node = (tag, text = '') => {const n = document.createElement(tag); n.textContent = text; return n;};
// AR17 slot: a world panel offers [data-shared-slot="encounter"]; this panel lives there while it is connected and keeps its
// own host (the location actions list) otherwise. The id is dropped while slotted so the Adventure Notebook, which files panels by id, leaves it alone.
export const ENCOUNTER_SLOT = '[data-shared-slot="encounter"]';
export const PANEL_ID = 'tempo_fight_panel';
export function placePanel(root, slot, fallback) {
    if(slot?.isConnected && !slot.hidden && !slot.inert) {
        if(root.parentElement === slot) return 'slot';
        root.id = ''; slot.append(root); root.open = true; return 'slot';
    }
    const wasSlotted = root.id === '';
    root.id = PANEL_ID;
    // The Notebook owns connected fallback panels after filing them by id.
    // Return from a world slot once, then leave that native placement intact.
    if(fallback?.isConnected && (wasSlotted || !root.parentElement || !root.isConnected)) fallback.append(root);
    return root.parentElement ? 'fallback' : 'none';
}
// AT22: the Adventure Notebook opens its journal tab when a fight starts waiting. Remember the tab the player was on before the commit and put it back
// once the fight is gone, without touching the notebook's own auto-open (it fires only on a new waiting response, and a fight that has ended is none).
let priorTab = null;
const journalTabs = () => [...(document.getElementById('journal_show_notebook')?.parentNode?.children || [])];
// Book views keep their own in-panel tab bar (reference_kit createTabs, aria-selected); remember that tab too.
const workroomTab = () => document.querySelector('[data-workroom-tabs] [role="tab"][aria-selected="true"]');
// In a composed workspace the notebook opens as a centre view; main_content publishes which one (R13) and #center_mode_back closes it.
const centerTask = () => document.getElementById('main_content')?.dataset.centerTask || null;
export function restoreCenterView(was, now, back) {
    if(now === 'workspace:notebook' && was !== now && back?.isConnected) {back.click(); return true;}
    return false;
}
const rememberTab = () => {priorTab = {journal: journalTabs().find(b => b.classList.contains('active_selection_button') && b.id !== 'journal_show_notebook') || null, workroom: workroomTab(), center: centerTask()};};
export function restoreWorkroomTab(was) {
    if(was?.isConnected && was.getAttribute('aria-selected') !== 'true') {was.click(); return true;}
    return false;
}
export function restoreJournalTab(was, notebook) {
    if(was?.isConnected && notebook?.classList.contains('active_selection_button')) {was.click(); return true;}
    return false;
}
function restoreTab() {const was = priorTab; priorTab = null; restoreJournalTab(was.journal, document.getElementById('journal_show_notebook')); restoreWorkroomTab(was.workroom); restoreCenterView(was.center, centerTask(), document.getElementById('center_mode_back'));}
const open = () => ports.root().simulation?.sessions.player?.nativeBattle?.schema === TEMPO_SCHEMA ? ports.root().simulation.sessions.player.nativeBattle : null;

// What each opposing fighter saw of the player (world-neutral). A knowledge entry must belong to a persistent actor, so unnamed fighters are skipped.
// Written once per fight through the knowledge effect (cause = the fight's session id, so a second apply keeps the first record). The wording is the observer's: what he believes happened.
import {SIGHT_KEY, LOOK_KEY, lookOf} from './observed_look.js';
export const FIGHT_SIGHT_KEY = SIGHT_KEY;
const SIGHT = {won: 'fought you and lost', lost: 'fought you and won', withdrawn: 'fought you, and you backed away', yielded: 'fought you, and you gave way'};
export function recordFightSight(plan, registry, before) {
    const sessionId = before?.sessionId, b = before?.battle, result = plan?.state?.actors?.player?.facts?.['tempo.lastResult'];
    if(!sessionId || !b || !SIGHT[result] || plan.state.simulation.sessions.player?.nativeBattle) return [];
    const cause = `tempo-sight:${sessionId}`, written = [];
    for(const [id, f] of Object.entries(b.fighters)) {
        if(f.side !== 'b' || !plan.state.simulation.people[id] || !plan.state.actors[id]) continue;
        if(plan.state.simulation.knowledge[id]?.[FIGHT_SIGHT_KEY]?.cause === cause) continue;
        // He also notes what you wore (the worn slots only), so a later reader can tell whether the person in front of it still looks like that one.
        applySimulationEffects(plan, [{type: 'knowledge', actor: id, key: FIGHT_SIGHT_KEY, stage: 'seen', value: SIGHT[result]},
            {type: 'knowledge', actor: id, key: LOOK_KEY, stage: 'seen', value: lookOf(plan.equipment?.player, plan.state.simulation.equipment?.player)}], {actorId: 'player'}, registry, cause);
        written.push(id);
    }
    return written;
}
const openFight = () => {const s = ports.root().simulation?.sessions.player; return s?.nativeBattle?.schema === TEMPO_SCHEMA ? {sessionId: s.id, battle: structuredClone(s.nativeBattle)} : null;};
function startQuote() {
    try {
        const state = ports.root(), context = {...ports.campaignContext(), targetId: ROAD_RIVAL};
        if(!state.simulation || state.simulation.sessions.player) return {visible: false};
        const view = previewSimulationCommand(state, ports.registry, 'rival.confront', context);
        const rival = state.simulation.people[ROAD_RIVAL];
        const hurt = context.vitals?.player?.health <= 1 || rival?.vitals.health <= 1;
        return {visible: !!view?.visible, eligible: !!view?.eligible && !hurt && ports.writable() && !context.busy,
            reason: hurt ? 'Both fighters need recovery before another contest.' : context.busy ? 'Finish your current activity first.' : (view?.reasons || []).join(' ')};
    } catch(error) {return {visible: false};}
}
// Lio can stand beside the player when the existing party terms hold (consent, kit, body, fee). Goals are defaults from who he is: a hired,
// trained porter who values staying whole, keeps faith with a friend, and wants little glory (LSD324). Bond reads the relationship axes.
function lioQuote() {
    try {
        const state = ports.root(), reasons = partyHelperReasons(state, ports.campaignContext());
        return {offered: !!state.actors?.[PARTY_HELPER]?.facts['party.willing'] && !!state.simulation?.people?.[PARTY_HELPER], reasons};
    } catch(error) {return {offered: false, reasons: []};}
}
function lioAlly(state) {
    const axes = {...state.simulation.relationships?.player?.[PARTY_HELPER]?.axes, ...state.simulation.relationships?.[PARTY_HELPER]?.player?.axes};
    const bond = Math.min(1, Math.max(0, .4 + Object.values(axes).reduce((a, v) => a + v, 0) / 10));
    return {goals: {survive: .5, protect: .55, aim: .2, pay: .4}, bond, discipline: .4, protectId: 'player', order: null};
}
function start(request = {}) {
    const state = ports.root(), context = {...ports.campaignContext(), targetId: ROAD_RIVAL}, quote = startQuote();
    if(!quote.eligible) throw Error(quote.reason || 'The contest is not available.');
    const requestId = pursuitView(state, RIVAL_PURSUIT)?.requestId;
    const withLio = !!request.withLio;
    const adopt = withLio ? initializePartyBattle(state, ports.registry, {requestId}, context) : commitSimulationCommand(state, ports.registry, {id: 'rival.confront', requestId}, context);
    const rival = adopt.state.simulation.people[ROAD_RIVAL], me = withTypes(readNativeFighter(ports.actor()), ports.actor()), v = context.vitals.player;
    // H7: her memory of past contests sets her goals and wits; her real margin applies whether or not you have appraised it.
    const mem = rivalCombatant(rival.body, adopt.state.actors.player.facts), body = mem.body;
    // Same derivation as the road duel's rival (native_battle_host): an Enemy built from the saved body and vitals.
    const foe = new ports.enemy({id: ROAD_RIVAL, name: 'Mara', description: 'A rival association scout', add_to_bestiary: false, tags: ['living', 'person'],
        stats: {...body, health: rival.vitals.max_health, max_stamina: rival.vitals.max_stamina}});
    foe.init(); Object.assign(foe.getFullStats(), rival.vitals);
    const rivalProfile = withTypes(readNativeFighter(foe), foe);
    let lio = [];
    if(withLio) {
        const person = adopt.state.simulation.people[PARTY_HELPER];
        const friend = new ports.enemy({id: PARTY_HELPER, name: 'Lio', description: 'A consenting braced porter', add_to_bestiary: false, tags: ['living', 'person'],
            stats: {...person.body, health: person.vitals.max_health, max_stamina: person.vitals.max_stamina}});
        friend.init(); Object.assign(friend.getFullStats(), person.vitals);
        lio = [{id: PARTY_HELPER, name: 'Lio', side: 'a', speed: 100, hp: person.vitals.health, maxHp: person.vitals.max_health, stamina: person.vitals.stamina, maxStamina: person.vitals.max_stamina,
            profile: withTypes(readNativeFighter(friend), friend), perception: person.body.intuition ?? 5, stealth: person.body.agility ?? 5, moves: ['guard', 'tend', 'jab', 'withdraw'], ally: lioAlly(adopt.state)}];
    }
    const plan = beginTempoFight(adopt.state, ports.registry, context, {adopt, id: 'road-rival', title: "Mara's road contest", floor: 1, fighters: [...lio,
        {id: 'player', name: 'You', side: 'a', speed: 100, parts: carriedParts(), hp: v.health, maxHp: v.max_health, stamina: v.stamina, maxStamina: v.max_stamina, profile: me, perception: me.stats.intuition ?? 5, stealth: me.stats.agility ?? 5},
        {id: ROAD_RIVAL, name: 'Mara', side: 'b', speed: Math.round(100 * (body.attack_speed ?? 1) / .8), hp: rival.vitals.health, maxHp: rival.vitals.max_health, stamina: rival.vitals.stamina, maxStamina: rival.vitals.max_stamina,
            profile: rivalProfile, perception: body.intuition + mem.perceptionBonus, stealth: body.agility, goals: mem.goals}]});
    rememberTab(); ports.commit(plan); applyHarm(plan);
}
// Openers other worlds register (tempo_starters.js): each quotes itself and supplies its fight spec; this host supplies the native actor.
function openerQuotes() {
    const state = ports.root(), context = ports.campaignContext();
    if(!state.simulation || state.simulation.sessions.player) return [];
    return tempoOpeners().flatMap(o => {
        try {const q = o.quote(state, context); return q?.visible ? [{id: o.id, label: o.label, text: o.text || '', eligible: !!q.eligible && ports.writable() && !context.busy, reason: q.reason || (context.busy ? 'Finish your current activity first.' : '')}] : [];}
        catch(error) {return [];}
    });
}
function enemyProfile(body, name, id) {
    const foe = new ports.enemy({id, name, description: name, add_to_bestiary: false, tags: ['living', 'person'], stats: {...body}});
    foe.init(); return withTypes(readNativeFighter(foe), foe);
}
function begin(request = {}) {
    const opener = tempoOpener(request.openerId), quote = openerQuotes().find(q => q.id === request.openerId);
    if(!opener || !quote?.eligible) throw Error(quote?.reason || 'That fight is not available.');
    const state = ports.root(), context = ports.campaignContext();
    const me = withTypes(readNativeFighter(ports.actor()), ports.actor());
    const spec = opener.spec(state, context, {me, vitals: context.vitals.player, parts: carriedParts(), enemyProfile});
    for(const f of spec.fighters || []) if(f.id === 'player') f.speed = restedSpeed(state, f.speed);
    const plan = beginTempoFight(state, ports.registry, context, spec);
    opener.promote?.(plan, ports.registry); // AT17 prototype: recurring opponents become persistent before the commit, so the sight writer finds them
    rememberTab(); ports.commit(plan); applyHarm(plan);
}
// Study her stance: watch Mara for the dial's minutes; the clock advances once and the observation lands in the player's knowledge store.
const studyQuote = () => { try { return rivalStudyQuote(ports.root(), ports.campaignContext().facts?.location); } catch(error) { return {eligible: false, reason: '', minutes: 0}; } };
function study() {
    check(ports?.writable() && ports.plan, 'The game cannot take that right now.');
    const root = ports.root(), quote = rivalStudyQuote(root, ports.campaignContext().facts?.location);
    check(quote.eligible, quote.reason);
    const plan = ports.plan(quote.minutes);
    check(plan.state.clock - root.clock === quote.minutes, 'Finish the current local decision first.');
    recordRivalStudy(plan.state); ports.commit(plan);
    return 'You have taken her measure.';
}
function move(request) {
    const state = ports.root(), ctx = ports.campaignContext(), before = openFight();
    const plan = request.handOver ? handOverTempoFight(state, ports.registry, ctx) : commitTempoMove(state, ports.registry, ctx,
        {moveId: request.moveId, targetId: request.targetId, allyId: request.allyId, orderId: request.orderId, aim: request.aim !== undefined ? request.aim : ['jab', 'swing'].includes(request.moveId) ? aim : null}, state.sequence);
    recordFightSight(plan, ports.registry, before); ports.commit(plan); applyHarm(plan);
}
// A view only quotes the committed state. Its four quotes share one context build.
function view() {
    if(!ports) return {visible: false};
    return withDisplayFactsFrame(ports.root(), readView);
}
function readView() {
    const b = open();
    if(b) return {visible: true, fight: {...tempoView(b), aim}, held: b.held};
    const quote = startQuote(), facts = ports.root().actors.player.facts;
    const rival = {...rivalBrief(facts, knownTargetFacts(ports.root(), 'player', 'roadRival')), study: studyQuote()}, openers = openerQuotes();
    return {visible: !!quote.visible || rival.history.duels > 0 || openers.length > 0, start: quote, rival, lio: lioQuote(), openers, last: facts['tempo.lastResult'] || null, owed: facts[TEMPO_FACT_HELD] || 0};
}
function mount() {
    const root = node('details'); root.id = 'tempo_fight_panel'; root.className = 'expedition_panel';
    const body = node('div'), notice = node('p'); notice.setAttribute('role', 'status'); notice.tabIndex = -1; const summary = node('summary', 'Road contest · tempo'); root.append(summary, notice, body);
    let signature = '', previousLog = [];
    const act = (fn, request) => {
        const before = view().fight?.lines || [];
        try { const feedback = fn(request); notice.textContent = typeof feedback === 'string' ? feedback : newTempoLines(before, view().fight?.lines || []).join(' '); }
        catch(error) { notice.textContent = error.message; }
        panel?.render(true);
    };
    const button = (label, id, title, disabled, handler) => {const b = node('button', label); b.type = 'button'; b.dataset.tempo = id; b.title = title || ''; b.disabled = !!disabled; b.onclick = handler; return b;};
    const place = () => placePanel(root, [...document.querySelectorAll(ENCOUNTER_SLOT)].find(slot => !slot.hidden && !slot.inert), document.getElementById('location_actions_div'));
    const render = force => {
        place();
        if(!root.isConnected) return;
        const v = view();
        if(priorTab && !v.fight) restoreTab();
        const sig = JSON.stringify(v) + !!document.getElementById('fight_situation');
        if(!force && sig === signature) { if(!v.visible && document.activeElement !== notice) root.hidden = true; return; }
        signature = sig;
        const previousFocus = captureTempoFocus(body, ['tempo']) || (document.activeElement === notice ? {} : null);
        const added = newTempoLines(previousLog, v.fight?.lines || []); previousLog = [...(v.fight?.lines || [])];
        body.replaceChildren(); root.hidden = !v.visible && !previousFocus;
        summary.textContent = v.fight ? (v.fight.title === "Mara's road contest" ? 'Road contest · tempo' : `${v.fight.title} · tempo`) : v.start?.visible || v.rival?.history.duels ? 'Road contest · tempo' : 'A fight · tempo';
        if(!v.visible) {
            if(previousFocus) { notice.textContent = v.last ? `Fight ended: ${v.last}.` : 'Fight controls are no longer available.'; notice.focus({preventScroll: true}); }
            return;
        }
        if(v.fight && document.getElementById('fight_situation')) {
            // One fight surface (COMBAT.md round 3, R3-O1): the open contest is shown and played in the Fight card.
            body.append(node('p', 'The contest is open in the Fight card below. The world clock holds until it ends.'));
        } else if(v.fight) {
            const f = v.fight;
            body.append(node('p', 'The fight waits for you. The world clock holds until it ends; time away is kept and applied afterwards.'));
            const log = node('ol'); log.dataset.tempoLog = ''; for(const line of f.lines) log.append(node('li', line)); body.append(log);
            const strip = node('p', 'Who acts next: ' + f.next.join(' → ')); strip.dataset.tempoNext = ''; body.append(strip);
            body.append(node('p', 'Opponents: ' + f.foes.map(x => `${x.name} (${x.hurt}${x.injuries.length ? '; ' + x.injuries.map(i => `${i.label.toLowerCase()} ${i.rung}`).join(', ') : ''})`).join(', ')));
            if(f.hurt.length) {const h = node('p', 'Your injuries: ' + f.hurt.map(x => `${x.label.toLowerCase()} ${x.rung}${x.shift.length ? ' (' + x.shift.map(m => `${m.axis} ${Math.round(m.delta * 100)}%`).join(', ') + ')' : ''}`).join(', ') + '. They change your next actions.'); h.dataset.tempoHurt = ''; body.append(h);}
            if(f.allies.length) body.append(node('p', 'Beside you: ' + f.allies.map(x => `${x.name} (${x.hurt}${x.order ? `, told: ${x.order}` : ''})`).join(', ')));
            if(f.yourTurn) {
                if(f.aims.length) {
                    const row = node('p', 'Aim: '); row.dataset.tempoAims = '';
                    for(const a of [{id: null, label: 'Anywhere', text: 'No particular mark: the blow lands where it lands.'}, ...f.aims]) {
                        const b = button(a.label, `aim:${a.id ?? 'any'}`, `${a.text}${a.id ? ' Costs a little time; a small mark is easier to avoid.' : ''}`, false, () => {aim = a.id; panel?.render(true);});
                        b.setAttribute('aria-pressed', String(aim === a.id)); row.append(b);
                    }
                    body.append(row);
                }
                for(const m of f.moves) {
                    const row = node('div'), description = `${m.text}${m.why ? ' ' + m.why : ''}`;
                    row.append(button(`${m.label} · ${m.cost} time${m.odds ? ' · ' + m.odds : ''}`, m.id, description, !m.usable || !ports.writable(), () => act(move, {moveId: m.id, aim: m.id === 'jab' || m.id === 'swing' ? aim : null})), node('small', ' ' + description));
                    body.append(row);
                }
                for(const o of f.orders) body.append(button(`${o.label} · ${o.cost} time · ${o.odds}`, `order:${o.orderId}:${o.allyId}`, `${o.text} Whether it is heard is not certain.`, !ports.writable(), () => act(move, {moveId: 'order', allyId: o.allyId, orderId: o.orderId})));
                const handover = node('div'); handover.append(button(HANDOVER_LABEL, 'handover', HANDOVER_TEXT, !ports.writable(), () => act(move, {handOver: true})), node('small', ' ' + HANDOVER_TEXT)); body.append(handover);
            }
        } else if(!v.start.visible && !v.rival.history.duels) {
            for(const o of v.openers) {const row = node('div'); row.append(button(o.label, `open:${o.id}`, o.reason || o.text, !o.eligible, () => act(begin, {openerId: o.id})), node('small', ' ' + (o.reason || o.text))); body.append(row);}
            if(v.last) body.append(node('p', `Last fight: ${v.last}.`));
        } else {
            body.append(node('p', 'Settle the road challenge move by move. Quick moves cost little time and light harm; heavy ones leave you open longer. Who notices first sets the opening.'));
            if(v.start.visible || v.rival.history.duels) {const r = node('p', `${v.rival.memory} ${v.rival.appraisal}`); r.dataset.rivalBrief = v.rival.appraised ? 'appraised' : 'unread'; body.append(r);}
            if(!v.rival.study.done && v.rival.study.minutes) body.append(button(`Study her stance · ${v.rival.study.minutes} min`, 'study', v.rival.study.eligible ? 'Watch how she moves. It takes time; nothing is rolled.' : v.rival.study.reason, !v.rival.study.eligible || !ports.writable(), () => act(study)));
            if(v.last) body.append(node('p', `Last tempo contest: ${v.last}.${v.owed ? ` ${v.owed} minutes of held time are still owed to the world.` : ''}`));
            if(v.start.visible) body.append(button('Accept the road duel as a tempo contest', 'start', v.start.reason, !v.start.eligible, () => act(start)));
            if(v.start.visible && v.lio.offered) body.append(button('Accept it with Lio beside you', 'start_lio', v.lio.reasons.join(' ') || 'Lio fights by his own goals and hears orders by chance. The fee and terms are the party contest\'s.', !v.start.eligible || v.lio.reasons.length > 0, () => act(start, {withLio: true})));
        }
        if(previousFocus) {
            if (!notice.textContent && v.fight) notice.textContent = added.join(' ') || 'The fight continues.';
            if (!notice.textContent && !v.fight) notice.textContent = v.last ? `Fight ended: ${v.last}.` : 'Fight controls are no longer available.';
            restoreTempoFocus(body, previousFocus, notice);
        }
    };
    render(true);
    // A restored fight raises no publication while it waits, so the panel re-reads on a slow beat (cheap: it redraws only when its view changes).
    setInterval(() => {if(!document.hidden) render();}, 1000);
    return {render};
}
function setAim(request = {}) {
    check(ports?.writable(), 'The game cannot take an aim right now.');
    const fight = open(), projected = fight && tempoView(fight);
    check(projected?.yourTurn, 'It is not your turn.');
    check(request.aim === null || projected.aims.some(a => a.id === request.aim), 'That aim is unavailable.');
    aim = request.aim;
    panel?.render(true);
}
const commands = {aim: setAim, study: () => {study(); panel?.render(true);}, begin: request => {check(ports?.writable(), 'The game cannot start a fight right now.'); begin(request); panel?.render(true);}, move: request => {
    check(ports?.writable(), 'The game cannot take a move right now.');
    move(request); panel?.render(true);
}};
registerDomain({id: 'tempo_fight', initialState: () => null, projection: view, refresh: () => panel?.render(), commands, panels: [() => panel = mount()]});
