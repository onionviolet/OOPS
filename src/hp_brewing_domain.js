import {registerDomain} from './domain_registry.js';
import {readPort} from './ui_ports.js';
import {calendarMinutes} from './world_rhythm.js';
import {begin, commit, quote as quoteAction, view, settle, validate, HP_SLICE_ID} from './hp_brewing_state.js';
import {createHpBrewingPanel} from './hp_brewing_panel.js';

// Polyjuice slice host (book.hp pack). The slice owns its state and reads the played
// clock and moon through the `gameTime` UI port (AR4); it takes no native items or money,
// so it needs no main.js wiring beyond that port. Time passes lazily from the game clock.
let state = null, panel;
function context() {
    const t = readPort('gameTime');
    if(!t) return null;
    return {now: calendarMinutes(t), moon: t.getMoonPhaseName(t.getMoonPhase())};
}
const need = () => context() ?? (() => { throw new Error('The game clock is not ready.'); })();
const read = () => { const c = context(); return c ? view(state, c) : {begun: false, waiting: true}; };
export function quote(req) {
    const c = context();
    if(!c) return {eligible: false, reason: 'The game clock is not ready.'};
    if(req?.type === 'begin') return state ? {eligible: false, reason: 'The slice is already begun.'} : {eligible: true, summary: 'Set up a bench and a small purse.'};
    return state ? quoteAction(state, c, req) : {eligible: false, reason: 'Begin the slice first.'};
}
export function execute(req) {
    const c = need();
    if(req?.type === 'begin') {
        if(state) throw new Error('The slice is already begun.');
        const seed = req.seed ?? globalThis.crypto.getRandomValues(new Uint32Array(1))[0];
        state = validate(begin({seed, now: c.now}));
        panel?.render();
        return {summary: 'The Polyjuice slice is set up.'};
    }
    if(!state) throw new Error('Begin the slice first.');
    const out = commit(state, c, req);
    state = validate(out.state);
    panel?.render();
    return out;
}
function tick() {
    const c = state && context();
    if(!c || c.now < state.now) return;
    const before = JSON.stringify(state);
    settle(state, c.now);
    if(JSON.stringify(state) !== before) panel?.render();
}
registerDomain({id: HP_SLICE_ID, initialState: () => null,
    // MR33: a player who never begins keeps byte-identical saves.
    save: () => state ? structuredClone(state) : undefined,
    migrate: slice => slice == null ? null : validate(structuredClone(slice)),
    validate: (slice, envelope) => {
        if(slice == null) return;
        validate(slice);
        const t = envelope?.['current time'];
        if(t && slice.now > calendarMinutes(t)) throw new Error('The Polyjuice slice is ahead of the native calendar.');
    },
    load: slice => { state = slice ?? null; panel?.render(); },
    tick, commands: {quote, execute}, projection: read,
    refresh: () => panel?.render(),
    panels: [() => { panel = createHpBrewingPanel({read, quote, execute}); }],
});
