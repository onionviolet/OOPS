// Pump-station watch. One mark serves two local object restores. The watch,
// including the spent charge, lives outside the captured mechanism state.
import {applyPlan, capture, freshStore, planRewind} from './rewind_kit.js';
import {formatDuration} from './number_format.js';
import {node} from './reference_kit.js';

// Default: an hour and one charge, so both operators can reach their
// mechanisms but the player must choose which service the station can keep.
const MARK_MINUTES = 60;
const MARK_LABEL = 'Before the surge';
const READY = 'working';
const JAMMED = 'jammed';
const roomsAtMark = {lift: READY, bell: READY};
const paths = ['station/lift', 'station/bell'];
const routes = {
    lift: {button: 'Spend the charge at the lift', finish: 'Send the repair crew down',
        result: 'The supply lift runs. The repair crew reaches the lower pumps. The warning bell stays jammed.'},
    bell: {button: 'Let your echo spend the charge at the bell', finish: 'Sound the flood warning',
        result: 'The bell rings. The night watch clears the lower walkways. The supply lift stays jammed.'},
};
const hasRoute = key => Object.hasOwn(routes, key);
const expires = trial => trial.mark.at + MARK_MINUTES;
const refused = trial => ({trial, ok: false});
const advanced = trial => ({trial, ok: true});

export function validateEchoTrial(trial) {
    if (trial === undefined) return;
    const {mark, rooms, surge, spent, finished} = trial ?? {};
    const expected = key => !surge || spent === key ? READY : JAMMED;
    if (!Number.isSafeInteger(mark?.at) || mark.at < 0 || mark.id !== 'c1' ||
        mark.kind !== 'mark' || mark.label !== MARK_LABEL || Object.keys(mark.cells ?? {}).length !== paths.length ||
        !paths.every(path => mark.cells[path]?.v === READY && !mark.cells[path].absent) ||
        typeof surge !== 'boolean' || typeof finished !== 'boolean' ||
        (spent !== null && (!surge || !hasRoute(spent))) ||
        Object.keys(rooms ?? {}).length !== paths.length ||
        !Object.keys(routes).every(key => rooms[key] === expected(key))) {
        throw Error('Invalid pump-station watch in this save.');
    }
}

export function useEchoTrial(trial, act, clock) {
    if (!trial && act === 'begin') {
        const {capture: mark} = capture(freshStore(), {clock, slices: {station: roomsAtMark}},
            {label: MARK_LABEL, patterns: paths});
        return advanced({mark, rooms: {...roomsAtMark}, surge: false, spent: null, finished: false});
    }
    if (!trial || trial.finished) return refused(trial);
    if (act === 'surge' && !trial.surge && clock < expires(trial)) {
        return advanced({...trial, surge: true, rooms: {lift: JAMMED, bell: JAMMED}});
    }
    if (act === 'finish' && (trial.spent !== null || clock >= expires(trial))) {
        return advanced({...trial, finished: true});
    }
    if (!hasRoute(act) || !trial.surge || trial.spent !== null || clock >= expires(trial)) return refused(trial);

    const stage = {clock, slices: {station: trial.rooms}};
    const spec = {id: 'pump_station_echo', kind: 'object', label: 'Restore the mechanism', track: paths,
        select: {paths: [`station/${act}`]}};
    const plan = planRewind(stage, freshStore(), spec, {capture: trial.mark});
    const rooms = applyPlan(stage.slices, plan).station;
    return advanced({...trial, rooms, spent: act});
}

export function mountEchoTrial(run) {
    const root = node('section', null, {'aria-label': 'Rewind echo · Pump-station watch', 'data-rewind-echo': ''});
    const story = node('p', '');
    const pool = node('p', '', {'aria-live': 'polite', 'aria-atomic': 'true', 'data-echo-charge': ''});
    const station = node('p', '', {'data-echo-mechanisms': ''});
    const button = (label, action) => {
        const control = node('button', label, {type: 'button', 'data-echo-action': action});
        control.onclick = () => run(action);
        return control;
    };
    const begin = button('Start the pump-station watch', 'begin');
    const surge = button('Watch the surge', 'surge');
    const lift = button(routes.lift.button, 'lift');
    const bell = button(routes.bell.button, 'bell');
    const finish = button('', 'finish');
    root.append(node('h3', 'Rewind echo · Pump-station watch'), story, pool, station, begin, surge, lift, bell, finish);
    return {root, render(trial, clock) {
        const spent = trial?.spent;
        const expired = trial && clock >= expires(trial);
        begin.hidden = !!trial;
        surge.hidden = !trial || trial.surge || trial.finished || expired;
        lift.hidden = bell.hidden = !trial?.surge || trial.finished;
        lift.disabled = bell.disabled = !!spent || !!expired;
        finish.hidden = !trial || trial.finished || (!spent && !expired);
        finish.textContent = spent ? routes[spent].finish : 'Close the station for the night';
        station.hidden = !trial?.surge;
        if (trial?.surge) station.textContent = `Supply lift: ${trial.rooms.lift}. Warning bell: ${trial.rooms.bell}.`;
        const chargeLine = !trial ? '' : spent ? '0 shared charges. Both holders draw from the same mark.'
            : expired ? '0 shared charges. The mark has faded.'
            : `1 shared charge · mark fades in ${formatDuration(expires(trial) - clock)}.`;
        if (pool.textContent !== chargeLine) pool.textContent = chargeLine;
        if (!trial) story.textContent = 'Take a watch with an echo of yourself. You share one mark and one charge.';
        else if (trial.finished) story.textContent = spent ? routes[spent].result : 'The mark faded. You close the station without restoring either mechanism.';
        else if (spent) story.textContent = spent === 'lift'
            ? 'You restored the supply lift. Send the crew down while it can still carry them.'
            : 'Your echo restored the warning bell. Sound it to clear the lower walkways.';
        else if (expired) story.textContent = 'The mark has faded. You and your echo head for the stairs.';
        else if (trial.surge) story.textContent = 'The surge jammed both mechanisms. You can restore the lift for the repair crew, or your echo can restore the bell for the night watch.';
        else story.textContent = 'You set a mark while both mechanisms work. You stay by the lift, and your echo takes the bell landing.';
    }};
}
