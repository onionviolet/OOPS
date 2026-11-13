import {beginContest, defineContestLaw, runContest} from '../../contest.js';
import {contestBody, contestPack} from '../../contest_bodies.js';
import {applyWorldOps, composeSubstrate, createWorld, readQuantity} from '../../world_substrate.js';

export const attackWindow = 'h:0:0';

const law = defineContestLaw({id: 'c.draft-intrusion', revision: 0, lethal: false, moves: {
    defend: {resolver: 'strike', steps: [4], power: 5},
    intrude: {resolver: 'strike', steps: [5], power: 4},
}});
const rules = composeSubstrate({packs: [contestPack()]});

export function resolveWindowApproach(plot, response) {
    const opening = plot.edges[attackWindow];
    if (opening === 'Shutter' || (opening === 'Window' && response === 'shutter')) {
        plot.edges[attackWindow] = 'Cracked shutter';
        return {report: 'The shutter catches the shot and cracks. The attacker withdraws.'};
    }
    if (!['Window', 'Cracked shutter'].includes(opening))
        return {report: 'The attacker finds no usable window and withdraws.'};
    if (response === 'leave')
        return {report: 'The shot hits the empty bed space. You reach the yard before the attacker enters.'};

    const place = 'bedroom';
    let world = createWorld(rules, {holders: [{id: place, kind: 'place'},
        contestBody('keeper', place, {vitality: 20, stamina: 10}),
        contestBody('intruder', place, {vitality: 12, stamina: 10})]});
    world = applyWorldOps(rules, world, [{op: 'add', holder: 'keeper', quantity: 'vitality', amount: -4}],
        'draft.window-shot');
    const profile = {attack: 12, evasion: 10};
    const record = beginContest(law, {id: 'draft-intrusion', seed: 7, place, entrants: [
        {id: 'keeper', side: 'household', body: 'keeper', profile, moves: ['defend'], maxVitality: 20},
        {id: 'intruder', side: 'intruder', body: 'intruder', profile, moves: ['intrude'], maxVitality: 12},
    ]}, world);
    return {report: 'A shot through the opening wounds you. The attacker climbs inside.',
        fight: {record, world}, vitality: readQuantity(world, 'keeper', 'vitality')};
}

export function settleWindowFight({record, world}) {
    const result = runContest(law, record, rules, world);
    return {
        winner: result.record.result.winner,
        vitality: readQuantity(result.world, 'keeper', 'vitality'),
    };
}
