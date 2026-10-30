import {registerDomain} from './domain_registry.js';
import {commitSimulationCommand, previewSimulationCommand} from './simulation.js';
import {pursuitView} from './pursuit.js';
import {ROAD_RIVAL, RIVAL_PURSUIT} from './frontier_campaign.js';
import {readNativeFighter} from './native_battle.js';
import {beginTempoFight, commitTempoMove, handOverTempoFight, tempoView, TEMPO_SCHEMA, TEMPO_FACT_HELD} from './tempo_fight.js';

// Road-duel tempo route: the same pursuit and encounter, driven by the tempo clock (LSD307-LSD317).
// Text-first (LSD314): one line per step, a who-acts-next strip, moves with their time cost.
let ports, panel;
export const configureTempoFight = operations => {ports = operations;};
const node = (tag, text = '') => {const n = document.createElement(tag); n.textContent = text; return n;};
const open = () => ports.root().simulation?.sessions.player?.nativeBattle?.schema === TEMPO_SCHEMA ? ports.root().simulation.sessions.player.nativeBattle : null;

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
function start() {
    const state = ports.root(), context = {...ports.campaignContext(), targetId: ROAD_RIVAL}, quote = startQuote();
    if(!quote.eligible) throw Error(quote.reason || 'The contest is not available.');
    const requestId = pursuitView(state, RIVAL_PURSUIT)?.requestId;
    const adopt = commitSimulationCommand(state, ports.registry, {id: 'rival.confront', requestId}, context);
    const rival = adopt.state.simulation.people[ROAD_RIVAL], me = readNativeFighter(ports.actor()), v = context.vitals.player, body = rival.body;
    // Approximation until rival stats come from the same derivation as the player's (known limit).
    const rivalProfile = {stats: {attack_points: body.attack * 9, agility: body.agility, intuition: body.intuition, defense: body.defense, attack_count: body.attack_count,
        crit_rate: body.crit_rate, crit_multiplier: body.crit_multiplier, stamina_efficiency: 1}, attackPower: body.attack * 1.6, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5};
    const plan = beginTempoFight(adopt.state, ports.registry, context, {adopt, id: 'road-rival', title: "Mara's road contest", floor: 1, fighters: [
        {id: 'player', name: 'You', side: 'a', speed: 100, hp: v.health, maxHp: v.max_health, stamina: v.stamina, maxStamina: v.max_stamina, profile: me, perception: me.stats.intuition ?? 5, stealth: me.stats.agility ?? 5},
        {id: ROAD_RIVAL, name: 'Mara', side: 'b', speed: Math.round(100 * (body.attack_speed ?? 1) / .8), hp: rival.vitals.health, maxHp: rival.vitals.max_health, stamina: rival.vitals.stamina, maxStamina: rival.vitals.max_stamina,
            profile: rivalProfile, perception: body.intuition, stealth: body.agility}]});
    ports.commit(plan);
}
function move(request) {
    const state = ports.root();
    ports.commit(request.handOver ? handOverTempoFight(state, ports.registry, ports.campaignContext()) : commitTempoMove(state, ports.registry, ports.campaignContext(), {moveId: request.moveId, targetId: request.targetId}, state.sequence));
}
function view() {
    if(!ports) return {visible: false};
    const b = open();
    if(b) return {visible: true, fight: tempoView(b), held: b.held};
    const quote = startQuote(), facts = ports.root().actors.player.facts;
    return {visible: !!quote.visible, start: quote, last: facts['tempo.lastResult'] || null, owed: facts[TEMPO_FACT_HELD] || 0};
}
function mount() {
    const root = node('details'); root.id = 'tempo_fight_panel'; root.className = 'expedition_panel';
    const body = node('div'), notice = node('p'); notice.setAttribute('role', 'status'); root.append(node('summary', 'Road contest · tempo'), notice, body);
    let signature = '';
    const act = (fn, request) => {try {fn(request); notice.textContent = '';} catch(error) {notice.textContent = error.message;} panel?.render(true);};
    const button = (label, id, title, disabled, handler) => {const b = node('button', label); b.type = 'button'; b.dataset.tempo = id; b.title = title || ''; b.disabled = !!disabled; b.onclick = handler; return b;};
    const render = force => {
        if(!root.isConnected) return;
        const v = view(), sig = JSON.stringify(v); if(!force && sig === signature) return; signature = sig;
        body.replaceChildren(); root.hidden = !v.visible;
        if(!v.visible) return;
        if(v.fight) {
            const f = v.fight;
            body.append(node('p', 'The fight waits for you. The world clock holds until it ends; time away is kept and applied afterwards.'));
            const log = node('ol'); log.dataset.tempoLog = ''; for(const line of f.lines) log.append(node('li', line)); body.append(log);
            const strip = node('p', 'Who acts next: ' + f.next.join(' → ')); strip.dataset.tempoNext = ''; body.append(strip);
            body.append(node('p', 'Opponents: ' + f.foes.map(x => `${x.name} (${x.hurt})`).join(', ')));
            if(f.yourTurn) {
                for(const m of f.moves) body.append(button(`${m.label} · ${m.cost} time`, m.id, `${m.text}${m.why ? ' ' + m.why : ''}${m.safe ? ' Safe.' : ''}`, !m.usable || !ports.writable(), () => act(move, {moveId: m.id})));
                body.append(button('Let a careful policy take one safe turn', 'handover', 'Plays only brace, tend or back away for you; never a new attack.', !ports.writable(), () => act(move, {handOver: true})));
            }
        } else {
            body.append(node('p', 'Settle the road challenge move by move. Quick moves cost little time and light harm; heavy ones leave you open longer. Who notices first sets the opening.'));
            if(v.last) body.append(node('p', `Last tempo contest: ${v.last}.${v.owed ? ` ${v.owed} minutes of held time are still owed to the world.` : ''}`));
            if(v.start.visible) body.append(button('Accept the road duel as a tempo contest', 'start', v.start.reason, !v.start.eligible, () => act(start)));
        }
    };
    document.getElementById('location_actions_div')?.append(root);
    render(true);
    // A restored fight raises no publication while it waits, so the panel re-reads on a slow beat (cheap: it redraws only when its view changes).
    setInterval(() => {if(!document.hidden) render();}, 1000);
    return {render};
}
registerDomain({id: 'tempo_fight', initialState: () => null, projection: view, refresh: () => panel?.render(), panels: [() => panel = mount()]});
