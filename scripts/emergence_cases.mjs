// Emergence harness cases (chat E). A case only composes packs that their own
// chats own, places holders and schedules outside ops (a keeper starting a brew,
// carrying a body out). It writes no law, reactor or join between packs: what
// the run reports has to come from the packs touching one world (PFP10).
// Known chain signatures live in emergence_known_chains.json; a multi-domain
// chain missing from that list is reported as new (PFP15).
import {readFileSync} from 'node:fs';
import {composeSubstrate, createWorld} from '../src/world_substrate.js';
import {createShellRegulatorPack, shellBodyState, shellInletState} from '../src/world_substrate_packs/shell_regulator.js';
import {createBrewSteamPack, brewBatchState} from '../src/world_substrate_packs/brew_steam.js';
import {createSkyPack, skyQuantities} from '../src/world_sky.js';
import {SHELL_LAW} from '../src/meadow_shell_state.js';
import {THERMAL_REVISION, quoteThermalBatch, thermalYield} from '../src/craft_process_thermal.js';

const DAY = 1440;
const known = JSON.parse(readFileSync(new URL('./emergence_known_chains.json', import.meta.url), 'utf8'));

// The thermal fixture W's contact tests use (tests/world_substrate.test.js), with
// the hold length drawn per brew so days differ.
const thermalLaw = {revision: THERMAL_REVISION, ambient: 20, extraction: {min: 45, max: 80, seconds: 30}, degradation: {above: 85, seconds: 20}};
const vessel = {capacity: 100, surfaceArea: 2, heatTransfer: 1, thermalMass: 4, containment: 2};
const maker = {tools: ['brazier', 'paddle'], competence: 4, workCapacity: 1000, fuelStock: 10000,
    heater: {maxTemperature: 150, maxConductance: 20, fuelPerSecond: 0.25}};
const quoteFor = holdSeconds => quoteThermalBatch({law: thermalLaw, vessel, maker,
    program: {startTemperature: 20, sourceTemperature: 75, targetTemperature: 65, holdSeconds,
        heaterTool: 'brazier', agitationTool: 'paddle', agitationPerMass: 2, requiredCompetence: 2},
    load: {mass: 4, volume: 4, specificHeat: 2, containment: 1}});

/**
 * CC1 · Steam and the shell, run long (W's first contact case). A workshop under
 * the sky; a keeper's shell regulates its humidity through a linked inlet; each
 * day the keeper starts one brew at a drawn minute. Brew steam is a quantity the
 * shell reads; the burner's smoke is an effect the shell answers.
 * `depart` adds the W4 departure: on one drawn day the keeper carries the shell
 * out a few minutes into the brew and brings it back the next morning (PFP7, LT31).
 */
export function steamShellCase({depart = false, cascadeDepth, detail} = {}) {
    return {
        id: depart ? 'cc1-steam-shell-depart' : 'cc1-steam-shell',
        title: depart ? 'Steam and the shell, keeper leaves mid-brew' : 'Steam and the shell',
        days: 4,
        // MC16: far settlement budget per simulated day. Segments are the gate (deterministic);
        // wall time is recorded with a loose ceiling because the machine is shared.
        budget: {segmentsPerDay: 800, msPerDay: 2000},
        known: known[depart ? 'cc1-steam-shell-depart' : 'cc1-steam-shell'] ?? [],
        build({rng, days}) {
            const shellPack = createShellRegulatorPack({...SHELL_LAW, startleMinutes: 15});
            const brewPack = createBrewSteamPack({thermalLaw, steamPerMinute: 4});
            const rules = composeSubstrate({packs: [shellPack, brewPack, createSkyPack()], dials: cascadeDepth == null ? {} : {cascadeDepth}});
            const start = 0;
            const world = createWorld(rules, {clock: start, holders: [
                {id: 'workshop', kind: 'place', tags: ['sky'], ...(detail ? {detail} : {}), quantities: {humidity: rng.int(40, 70), ...skyQuantities(start)}},
                {id: 'yard', kind: 'place'},
                {id: 'shell', kind: 'body', place: 'workshop', tags: ['shell.body'], state: {'l.shell_regulator': shellBodyState('open')}},
                {id: 'inlet', kind: 'thing', place: 'workshop', tags: ['shell.inlet'], state: {'l.shell_regulator': shellInletState({mode: 'linked', follows: 'shell'})}},
            ]});
            const schedule = [], cuts = [];
            // Every draw happens in both variants, so the departure run differs from the
            // stay run only by the keeper's moves.
            const leaveDay = rng.int(1, Math.max(1, days - 2));
            for (let d = 0; d < days; d++) {
                const at = start + d * DAY + rng.int(420, 1080);
                const hold = rng.pick([900, 1800, 2700]);
                const batch = brewBatchState(thermalLaw, quoteFor(hold));
                const burnMinutes = Math.floor(batch.thermal.segment.burnSeconds / 60);
                schedule.push({at, cause: 'keeper.brews', ops: [
                    ...(d ? [{op: 'holder_remove', holder: `batch-${d - 1}`}] : []),
                    {op: 'holder_add', value: {id: `batch-${d}`, kind: 'thing', place: 'workshop', tags: ['brew.batch'],
                        state: {'b.brew_steam': batch}}},
                ]});
                cuts.push(at + 1);
                // Mid-brew: while the burner still burns, so its smoke comes after the shell has gone.
                const out = at + rng.int(2, Math.max(2, burnMinutes - 2)), back = start + (d + 1) * DAY + 360;
                if (depart && d === leaveDay) {
                    schedule.push({at: out, cause: 'keeper.leaves', ops: [{op: 'move', holder: 'shell', to: 'yard'}]});
                    schedule.push({at: back, cause: 'keeper.returns', ops: [{op: 'move', holder: 'shell', to: 'workshop'}]});
                    cuts.push(out - 1, out + 1, back + 1);
                }
            }
            // What each batch came to, read when the keeper clears it or the run ends.
            const observe = (w, at) => Object.values(w.holders).filter(h => h.tags.includes('brew.batch')).map(h => {
                const t = h.state['b.brew_steam'].thermal;
                return {key: h.id, at, batch: h.id, ...thermalYield(thermalLaw, t, 100), fuelSpent: t.fuelSpent};
            });
            return {rules, world, schedule, cuts, observe};
        },
    };
}

export const EMERGENCE_CASES = Object.freeze({
    'cc1-steam-shell': steamShellCase(),
    'cc1-steam-shell-depart': steamShellCase({depart: true}),
});

/** Plan chains not runnable yet: each names what it waits on (checkpoint Requests). */
export const PENDING_CHAINS = Object.freeze([
    {id: 'pc1-gu-leaves-mid-brew', plan: 'A Gu regulating a brew leaves with its keeper; the latch stays shut, stored heat keeps working, the batch finishes weaker.',
        has: 'departure, latch and stored heat (cc1-steam-shell-depart)',
        waits: ['B: the brew law reads a place quantity the regulator moves (humidity or ambient temperature), so regulation changes the batch', 'G and L: a Gu body as the regulator (Gu-as-creature on the substrate)']},
    {id: 'pc2-rinse-water-sheep', plan: 'Rinse water from a potion vessel reaches a field; the crop takes up residue; the sheep that graze it change.',
        waits: ['B: rinse water and residue by substance as an effect or quantity', 'W: a flow between places (drainage) or B publishing into the field', 'L: crop uptake and grazing bodies reading residue']},
    {id: 'pc3-fireflies-wild-gu-rival', plan: 'A farmed firefly colony brightens the hill; wild Gu that feed on starlight move in; a rival keeper notices.',
        waits: ['W: light as a place quantity', 'L: a colony that writes light and wild cohorts that move toward it', 'A: a rival actor who reads what it knows and picks a working']},
]);
