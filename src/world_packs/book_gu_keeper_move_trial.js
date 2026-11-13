import {littleLightMoonblade} from '../gu_ability_profiles.js';
import {guMoveTrial} from '../gu_move_trial_host.js';
import {moonlightStock} from '../gu_moonlight_stock.js';
import {keeperChain, keeperChainBay, keeperChainLoans, keeperChainSlots} from '../gu_keeper_chain.js';
import {keeperAuthorityBay, keeperSignal, keeperSignalBay} from '../gu_keeper_signal.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId} from './book_gu_keeper_ids.js';

export const keeperMoveTrial = kId('move_trial');
export const keeperMoveTrialWorld = kId('world');
export const keeperMovePlanSlots = 4;
export const keeperTrayMove = kId('tray_move');
export const keeperTrayAlcove = `${keeperTrayMove}.alcove`;
const id = keeperMoveTrial;
const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const aperture = eq(`faculty.${kId('aperture')}.active`);
const reserve = `energy.${kId('primeval')}.reserve`;
const ownsMoon = eq(`claim.${kId('moon_title')}.owner`, 'player');

const moonId = kId('moon');
const title = kId('moon_title');
function keeperMoonReady(state) {
    const moon = state.simulation.people[moonId];
    return moon?.life === 'alive' && moon.body.controllerId === 'player' && moon.vitals.health >= 3 &&
        state.simulation.claims[title]?.owner === 'player';
}

export const keeperMoonbladeSupports = {
    little_light: {kind: 'little-light', label: 'Little Light Gu'},
    light_source: {kind: 'light-source', label: 'Light Source Gu'},
};
const holdsSupport = (state, support) => state.actors.player.facts[`${id}.${support}`] === true;
export const moonbladeMoveTrial = guMoveTrial({
    id, world: keeperMoveTrialWorld, place: kId('annex'), energyId: kId('primeval'), slots: keeperMovePlanSlots,
    research: 'research', effect: 'damage', referenceReserve: 12, knownMove: littleLightMoonblade,
    core: {id: moonId, kind: 'moonlight', ready: keeperMoonReady},
    supports: Object.fromEntries(Object.entries(keeperMoonbladeSupports).map(([support, member]) =>
        [support, {...member, ready: state => holdsSupport(state, support)}])),
    notes: {key: `${id}.notes`, maxSpent: 5, receiptOrder: ['slot', 'outcome', 'spent']},
    outcomeFields: {power: {property: 'magnitude', values: [1, 2]}, reach: {property: 'range', values: [1, 2]}},
    errors: {
        invalidNotes: 'Invalid Moonblade combination notes.',
        disagree: 'The Moonblade combinations and their notes disagree.',
        admission: 'Try Moonblade combinations at the Gu house.',
        research: 'Bring a ready Moonlight Gu and enough essence to test a blade.',
        plan: 'Write down a combination before trying it.',
    },
});

export function validateKeeperMoonbladeTrial(state, record) {
    const notes = moonbladeMoveTrial.read(state);
    const {completed, facts} = state.actors.player;
    const hasNotes = (completed[`${id}.research`] ?? 0) > 0;
    const hasFlags = Object.keys(keeperMoonbladeSupports).some(support => facts[`${id}.${support}`] !== undefined);
    if (!!notes !== hasNotes || (notes || hasFlags) && !moonbladeMoveTrial.pinned(record) ||
        (notes?.last && !(completed[`${id}.try_${notes.last.slot}`] > 0))) {
        throw Error('The Moonblade combination notes need their trial receipts.');
    }
}

export function keeperMoonbladeTrialFacts(state, notes) {
    return {
        [`${id}.moon_ready`]: keeperMoonReady(state),
        ...Object.fromEntries(Object.keys(keeperMoonbladeSupports).map(support =>
            [`${id}.holds_${support}`, holdsSupport(state, support)])),
        ...moonbladeMoveTrial.planFacts(notes),
    };
}

export function keeperMoveTrialView(state, record) {
    if (!moonbladeMoveTrial.pinned(record)) return null;
    const notes = moonbladeMoveTrial.read(state);
    return notes && {plans: moonbladeMoveTrial.describePlans(state, notes), last: notes.last};
}

function command(name, label, needs, effect, description = '') {
    return {
        id: `${id}.${name}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: keeperMoveTrialWorld, location: kId('annex'), actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted, requires: all(ready, admitted, ...needs), costs: [], effects: [effect],
    };
}

function loan(specimen, label, held) {
    const key = `${id}.${specimen}`;
    return command(`${held ? 'borrow' : 'return'}_${specimen}`, `${held ? 'Borrow' : 'Return'} ${label}`,
        [eq(`${id}.holds_${specimen}`, !held)], {type: 'fact', scope: 'actor', actor: 'player', key, value: held});
}

export const guKeeperMoveTrial = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Research Moonblade combinations',
    description: 'Try the Little Light pairing the steward knows, then see what else works with the Gu at hand. The steward feeds the two loan Gu.',
    requires: all(ready, ownsMoon),
    reason: 'Take in your clan Moonlight Gu first.',
    commands: [
        ...Object.entries(keeperMoonbladeSupports).flatMap(([support, {label}]) =>
            [loan(support, label, true), loan(support, label, false)]),
        command('research', 'Write down workable Moonblade combinations', [aperture, eq(`${id}.moon_ready`),
            {any: [ge(reserve, 4), all(ge(reserve, 3), eq(`actor.${id}.light_source`))]}],
            {type: 'guMoveTrial', actor: 'player', operation: 'research'},
            'Compare cutting force, reach and essence with the Gu currently available.'),
        ...Array.from({length: keeperMovePlanSlots}, (_, index) => {
            const slot = index + 1;
            return command(`try_${slot}`, `Try written Moonblade combination ${slot}`, [aperture, eq(`${id}.plan_${slot}`)],
                {type: 'guMoveTrial', actor: 'player', operation: 'cast', slot},
                'The Gu activate in the written order. If a later Gu is unavailable or you run short of essence, earlier activations stay spent.');
        }),
    ],
};

export async function registerGuKeeperMoveTrial(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperMoveTrial, base);
        await register.bundledInstantExtension(guKeeperTrayMove, base);
        await register.bundledInstantExtension(guKeeperChain, base);
        await register.bundledInstantExtension(guKeeperSignal, base);
    }
}

const trayAdmission = eq(extensionFact(keeperTrayMove));
const trayFact = op => eq(`${keeperTrayMove}.${op}`);
const move = location => ({type: 'relocate', actor: 'player', location});
function trayCommand(op, label, description, {location = kId('annex'), needs = [aperture, trayFact(op)], effect} = {}) {
    const action = command(op, label, [], effect ?? {type: 'guMoveTrial', actor: 'player', operation: op}, description);
    return {...action, id: `${keeperTrayMove}.${op}`, location, visibleWhen: trayAdmission, requires: all(ready, trayAdmission, ...needs)};
}
const guKeeperTrayMove = {
    schema: 1, id: keeperTrayMove, revision: 1, base: guKeeperMoveTrial.base, dependsOn: [moonlightStock, id],
    label: 'Research a Moonblade using a tray Gu',
    description: 'Write down the exact tray Gu and its support. A ten-sheet paper seal covers the alcove latch.',
    requires: ready, reason: 'Take up the clan tray comparison and Moonblade research first.',
    locations: [{id: keeperTrayAlcove, label: 'Alcove behind the paper seal', underRoof: true,
        description: 'The sliced paper has fallen away from the latch.'}],
    commands: [
        trayCommand('write_tray_plain', 'Write a plan for the tray Gu alone', 'Use the exact Gu in your care.'),
        trayCommand('write_tray_little', 'Write a plan with Little Light', 'Little Light widens the tray Gu’s blade.'),
        trayCommand('write_tray_source', 'Write a plan with Light Source', 'Use Light Source to save essence.'),
        trayCommand('cast_tray_move', 'Cut the paper seal with the written move', 'Use the written tray Gu and support. Their current readiness and cost are checked when you cast.'),
        trayCommand('enter', 'Open the alcove latch', 'Step through the cut paper seal.', {needs: [trayFact('enter')], effect: move(keeperTrayAlcove)}),
        trayCommand('back', 'Return to the Gu house', 'Step out of the alcove.', {location: keeperTrayAlcove, needs: [], effect: move(kId('annex'))}),
    ],
};

const chainAdmission = eq(extensionFact(keeperChain));
const chainFact = op => eq(`${keeperChain}.${op}`);
function chainCommand(op, label, needs, effect, description = '', location = kId('annex')) {
    return {...command(op, label, [], effect, description), id: `${keeperChain}.${op}`,
        location, visibleWhen: chainAdmission, requires: all(ready, chainAdmission, ...needs)};
}

function chainLoan({id: name, label}, held) {
    return chainCommand(`${held ? 'borrow' : 'return'}_${name}`, `${held ? 'Borrow' : 'Return'} ${label}`,
        [eq(`${keeperChain}.holds_${name}`, !held)],
        {type: 'fact', scope: 'actor', actor: 'player', key: `${keeperChain}.${name}`, value: held});
}

const guKeeperChain = {
    schema: 1, id: keeperChain, revision: 1, base: guKeeperMoveTrial.base, dependsOn: [keeperTrayMove, moonlightStock],
    label: 'Research ways to cut two hidden catches',
    description: 'Two catches behind a guard plate must be cut in one move. Try guiding a blade from the tray Gu you hold.',
    requires: ready, reason: 'Open the tray Gu research first.',
    locations: [{id: keeperChainBay, label: 'Passage behind the two catches', underRoof: true,
        description: 'The guard plate swung aside when both catches were cut.'}],
    commands: [
        ...keeperChainLoans.flatMap(loan => [chainLoan(loan, true), chainLoan(loan, false)]),
        chainCommand('research', 'Find workable blade chains', [aperture, chainFact('research')],
            {type: 'guMoveTrial', actor: 'player', operation: 'research_chain'},
            'Check how the Gu you hold can carry a blade around the plate.'),
        ...Array.from({length: keeperChainSlots}, (_, index) => {
            const slot = index + 1;
            return chainCommand(`try_${slot}`, `Cast written blade chain ${slot}`, [aperture, chainFact(`try_${slot}`)],
                {type: 'guMoveTrial', actor: 'player', operation: 'cast_chain', slot},
                'Each Gu acts in order. Essence spent on earlier steps stays spent if a later Gu is away.');
        }),
        chainCommand('enter', 'Pass through the open guard plate', [chainFact('enter')], move(keeperChainBay)),
        chainCommand('back', 'Return to the Gu house', [], move(kId('annex')), '', keeperChainBay),
    ],
};

const signalAdmission = eq(extensionFact(keeperSignal));
function signalCommand(op, label, description, {location = kId('annex'), effect, needs} = {}) {
    const action = command(op, label, [], effect ?? {type: 'guMoveTrial', actor: 'player', operation: `signal_${op}`}, description);
    return {...action, id: `${keeperSignal}.${op}`, location, visibleWhen: signalAdmission,
        requires: all(ready, signalAdmission, ...(needs ?? [eq(`${keeperSignal}.${op}`)]))};
}

const guKeeperSignal = {
    schema: 1, id: keeperSignal, revision: 1, base: guKeeperMoveTrial.base, dependsOn: [moonlightStock],
    label: 'Try the two light readers',
    description: 'One door opens for the right light. The keeper’s door asks who holds the Gu that made it.',
    requires: ready, reason: 'Open the clan tray comparison first.',
    locations: [
        {id: keeperSignalBay, label: 'Room behind the light door', underRoof: true, description: 'The reader recognized the blade’s light.'},
        {id: keeperAuthorityBay, label: 'Room behind the keeper’s door', underRoof: true, description: 'The reader recognized the keeper of the marked Gu.'},
    ],
    commands: [
        signalCommand('witness', 'Mark a live cast for the time seal · 4 essence', 'Witness an actual blade from the tray Gu you hold.'),
        signalCommand('record', 'Record a live cast on the silver plate · 4 essence', 'The plate keeps the light pattern after you return the Gu.'),
        signalCommand('open_echo', 'Open the seal on the earlier cast', 'Reach the marked cast for thirty minutes.'),
        signalCommand('echo', 'Send the borrowed blade to the readers', 'The seal supplies the earlier cast’s essence.'),
        signalCommand('replay', 'Replay the silver plate for the readers', 'The plate gives off the light it recorded.'),
        signalCommand('present', 'Cast in front of both readers · 4 essence', 'Let both readers see what your current Gu can do.'),
        signalCommand('enter_light', 'Enter the light door', '', {effect: move(keeperSignalBay)}),
        signalCommand('enter_keeper', 'Enter the keeper’s door', '', {effect: move(keeperAuthorityBay)}),
        signalCommand('back_light', 'Return to the Gu house', '', {location: keeperSignalBay, effect: move(kId('annex')), needs: []}),
        signalCommand('back_keeper', 'Return to the Gu house', '', {location: keeperAuthorityBay, effect: move(kId('annex')), needs: []}),
    ],
};
