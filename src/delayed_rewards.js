"use strict";

import { Rewards } from "./rewards.js";

//delays are provided separately (there's just no need to have them here, plus this allows them to differ for same thing depending on source)
const delayed_rewards = {
    temple_ritual: new Rewards({
        textlines: [{dialogue: "temple priest", lines: ["restore"]}],
    }),
}


export function readDelayedRewards(value = {}) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error('Invalid delayed reward queue.');
    for (const [id, row] of Object.entries(value)) {
        if (!Object.hasOwn(delayed_rewards,id) || !Number.isSafeInteger(row?.delay) || row.delay < 0 ||
            row.source?.source_type !== 'textline' || typeof row.source.source_name !== 'string' ||
            typeof row.source.inform_textline !== 'boolean') throw Error('Invalid delayed reward.');
    }
    return structuredClone(value);
}

export function settleDelayedRewards(queue, minutes) {
    const next = {}, unlocks = [];
    for (const [id, row] of Object.entries(queue)) {
        if (row.delay > minutes) next[id] = {...row,delay:row.delay-minutes};
        else unlocks.push(...delayed_rewards[id].textlines);
    }
    return {next,unlocks};
}

export { delayed_rewards };
