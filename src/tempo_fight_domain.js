import {registerDomain} from './domain_registry.js';
import {commitSimulationCommand, previewSimulationCommand} from './simulation.js';
import {pursuitView} from './pursuit.js';
import {ROAD_RIVAL, RIVAL_PURSUIT} from './frontier_campaign.js';
import {readNativeFighter} from './native_battle.js';
import {partyHelperReasons, initializePartyBattle} from './party_battle.js';
import {PARTY_HELPER} from './native_battle_contracts.js';
import {harmState, setHarmState, HARM_RUNGS} from './harm_state.js';
import {harmPart} from './harm_engine.js';
import {beginTempoFight, commitTempoMove, handOverTempoFight, tempoView, TEMPO_SCHEMA, TEMPO_FACT_HELD} from './tempo_fight.js';

// Road-duel tempo route: the same pursuit and encounter, driven by the tempo clock (LSD307-LSD317).
// Text-first (LSD314): one line per step, a who-acts-next strip, moves with their time cost.
let ports, panel, aim = null;
// The fight's injuries reach the L9 ladder through its one door after the commit (default parts rows; a world without its own rows keeps them for when it has).
function applyHarm(plan) {
    for(const e of plan?.harmEffects || []) {
        let save = {harm: harmState(), expansion: {actors: {player: {worldId: 'default'}}}};
        save = harmPart(save, e).save; setHarmState(save.harm);
    }
}
const carriedParts = () => Object.fromEntries(Object.entries(harmState().parts || {}).filter(([, p]) => HARM_RUNGS.includes(p.rung)).map(([id, p]) => [id, p.rung]));
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
    const rival = adopt.state.simulation.people[ROAD_RIVAL], me = readNativeFighter(ports.actor()), v = context.vitals.player, body = rival.body;
    // Same derivation as the road duel's rival (native_battle_host): an Enemy built from the saved body and vitals.
    const foe = new ports.enemy({id: ROAD_RIVAL, name: 'Mara', description: 'A rival association scout', add_to_bestiary: false, tags: ['living', 'person'],
        stats: {...body, health: rival.vitals.max_health, max_stamina: rival.vitals.max_stamina}});
    foe.init(); Object.assign(foe.getFullStats(), rival.vitals);
    const rivalProfile = readNativeFighter(foe);
    let lio = [];
    if(withLio) {
        const person = adopt.state.simulation.people[PARTY_HELPER];
        const friend = new ports.enemy({id: PARTY_HELPER, name: 'Lio', description: 'A consenting braced porter', add_to_bestiary: false, tags: ['living', 'person'],
            stats: {...person.body, health: person.vitals.max_health, max_stamina: person.vitals.max_stamina}});
        friend.init(); Object.assign(friend.getFullStats(), person.vitals);
        lio = [{id: PARTY_HELPER, name: 'Lio', side: 'a', speed: 100, hp: person.vitals.health, maxHp: person.vitals.max_health, stamina: person.vitals.stamina, maxStamina: person.vitals.max_stamina,
            profile: readNativeFighter(friend), perception: person.body.intuition ?? 5, stealth: person.body.agility ?? 5, moves: ['guard', 'tend', 'jab', 'withdraw'], ally: lioAlly(adopt.state)}];
    }
    const plan = beginTempoFight(adopt.state, ports.registry, context, {adopt, id: 'road-rival', title: "Mara's road contest", floor: 1, fighters: [...lio,
        {id: 'player', name: 'You', side: 'a', speed: 100, parts: carriedParts(), hp: v.health, maxHp: v.max_health, stamina: v.stamina, maxStamina: v.max_stamina, profile: me, perception: me.stats.intuition ?? 5, stealth: me.stats.agility ?? 5},
        {id: ROAD_RIVAL, name: 'Mara', side: 'b', speed: Math.round(100 * (body.attack_speed ?? 1) / .8), hp: rival.vitals.health, maxHp: rival.vitals.max_health, stamina: rival.vitals.stamina, maxStamina: rival.vitals.max_stamina,
            profile: rivalProfile, perception: body.intuition, stealth: body.agility}]});
    ports.commit(plan); applyHarm(plan);
}
function move(request) {
    const state = ports.root(), ctx = ports.campaignContext();
    const plan = request.handOver ? handOverTempoFight(state, ports.registry, ctx) : commitTempoMove(state, ports.registry, ctx,
        {moveId: request.moveId, targetId: request.targetId, allyId: request.allyId, orderId: request.orderId, aim: request.aim}, state.sequence);
    ports.commit(plan); applyHarm(plan);
}
function view() {
    if(!ports) return {visible: false};
    const b = open();
    if(b) return {visible: true, fight: tempoView(b), held: b.held};
    const quote = startQuote(), facts = ports.root().actors.player.facts;
    return {visible: !!quote.visible, start: quote, lio: lioQuote(), last: facts['tempo.lastResult'] || null, owed: facts[TEMPO_FACT_HELD] || 0};
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
                for(const m of f.moves) body.append(button(`${m.label} · ${m.cost} time`, m.id, `${m.text}${m.why ? ' ' + m.why : ''}${m.safe ? ' Safe.' : ''}`, !m.usable || !ports.writable(), () => act(move, {moveId: m.id, aim: m.id === 'jab' || m.id === 'swing' ? aim : null})));
                for(const o of f.orders) body.append(button(`${o.label} · ${o.cost} time · ${o.odds}`, `order:${o.orderId}:${o.allyId}`, `${o.text} Whether it is heard is not certain.`, !ports.writable(), () => act(move, {moveId: 'order', allyId: o.allyId, orderId: o.orderId})));
                body.append(button('Let a careful policy take one safe turn', 'handover', 'Plays only brace, tend or back away for you; never a new attack.', !ports.writable(), () => act(move, {handOver: true})));
            }
        } else {
            body.append(node('p', 'Settle the road challenge move by move. Quick moves cost little time and light harm; heavy ones leave you open longer. Who notices first sets the opening.'));
            if(v.last) body.append(node('p', `Last tempo contest: ${v.last}.${v.owed ? ` ${v.owed} minutes of held time are still owed to the world.` : ''}`));
            if(v.start.visible) body.append(button('Accept the road duel as a tempo contest', 'start', v.start.reason, !v.start.eligible, () => act(start)));
            if(v.start.visible && v.lio.offered) body.append(button('Accept it with Lio beside you', 'start_lio', v.lio.reasons.join(' ') || 'Lio fights by his own goals and hears orders by chance. The fee and terms are the party contest\'s.', !v.start.eligible || v.lio.reasons.length > 0, () => act(start, {withLio: true})));
        }
    };
    document.getElementById('location_actions_div')?.append(root);
    render(true);
    // A restored fight raises no publication while it waits, so the panel re-reads on a slow beat (cheap: it redraws only when its view changes).
    setInterval(() => {if(!document.hidden) render();}, 1000);
    return {render};
}
registerDomain({id: 'tempo_fight', initialState: () => null, projection: view, refresh: () => panel?.render(), panels: [() => panel = mount()]});
