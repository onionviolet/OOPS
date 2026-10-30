// Primordial Saint Sect credit slice: native domain (AR2). The slice `primordial_credit` is written only
// once the player has asked, so saves that never touched it stay as they were. Everything the player
// sees (panel, carry rows) is opt-in: localhost plus ?primordial_probe=1.
import {registerDomain} from './domain_registry.js';
import {current_game_time} from './game_time.js';
import {calendarMinutes} from './world_rhythm.js';
import {registerCarryRules} from './carry_ledger.js';
import {createPrimordialHost} from './book_world_primordial_host.js';
import {createPrimordialPanel} from './book_world_primordial_ui.js';
import {CARRY_ROWS, WORLD_ID} from './book_world_primordial_credit.js';
const probe = () => typeof location !== 'undefined' && ['localhost', '127.0.0.1'].includes(location.hostname) && new URLSearchParams(location.search).get('primordial_probe') === '1';
const now = () => { try { return calendarMinutes(current_game_time); } catch { return NaN; } };
let panel = null;
const host = createPrimordialHost({now, onChange: () => panel?.render()});
if(probe()) registerCarryRules(WORLD_ID, CARRY_ROWS);
registerDomain({id: 'primordial_credit', deps: [], initialState: () => null,
    save: () => host.save(), validate: slice => host.validate(slice),
    load: slice => host.load(slice), refresh: () => panel?.render(), projection: () => host.view(),
    // tick: native game ticks (sleep, activity, travel) settle a finished mission; interest is derived from the same clock.
    tick: () => host.tick(),
    commands: {request: id => host.request(id), askRule: () => host.askHowCreditIsWeighed(), startShift: opts => host.startShift(opts), repay: n => host.repay(n), buy: id => host.buy(id)},
    panels: [() => { if(probe()) panel = createPrimordialPanel({read: () => host.view(), request: id => host.request(id), askRule: () => host.askHowCreditIsWeighed(), startShift: opts => host.startShift(opts), repay: n => host.repay(n), buy: id => host.buy(id)}); }]});
