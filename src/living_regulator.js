// Engineering feedback in bounded local time. The host owns the living
// subject, the fixture, ambient conditions and any resource debits.
import {check, natural, object, positive} from './basics.js';

const WINDOW_LIMIT = 64;

export function openLivingRegulator(clock, humidity) {
    check(natural(clock) && validHumidity(humidity), 'Invalid chamber start.');
    return {clock, humidity, inlet: 'open', pending: null};
}

const validHumidity = value => natural(value) && value <= 100;
const inletPosition = value => value === 'open' || value === 'closed';

export function validateLivingRegulator(state) {
    check(object(state) && natural(state.clock) && validHumidity(state.humidity) &&
        inletPosition(state.inlet) && (state.pending === null || object(state.pending) &&
        inletPosition(state.pending.position) && state.pending.position !== state.inlet &&
        natural(state.pending.at) && state.pending.at > state.clock), 'Invalid chamber regulator.');
    return state;
}

export function advanceLivingRegulator(state, clock, {delay, draft, recharge, mode}, settleMinute) {
    validateLivingRegulator(state);
    check(natural(clock) && clock >= state.clock && positive(delay) && validHumidity(draft) &&
        validHumidity(recharge) && ['open', 'closed', 'linked'].includes(mode) &&
        typeof settleMinute === 'function', 'Invalid chamber conditions.');

    let current = {...state, pending: state.pending && {...state.pending}};
    const end = current.clock + Math.min(WINDOW_LIMIT, clock - current.clock);
    while (current.clock < end) {
        const minute = current.clock + 1;
        const inlet = mode === 'linked' ? current.inlet : mode;
        const humidity = Math.min(100, Math.max(0, current.humidity + (inlet === 'open' ? -draft : recharge)));
        const shell = settleMinute({minute, humidity, inlet});
        check(inletPosition(shell), 'Invalid shell response.');

        let position = inlet;
        let pending = mode === 'linked' ? current.pending : null;
        if (mode === 'linked') {
            if (pending?.at === minute) {
                position = pending.position;
                pending = null;
            }
            if (!pending && shell !== position) {
                check(natural(minute + delay), 'Chamber response time is out of range.');
                pending = {position: shell, at: minute + delay};
            }
        }
        current = {clock: minute, humidity, inlet: position, pending};
    }
    return {state: current, pending: current.clock < clock};
}
