import test from 'node:test';
import assert from 'node:assert/strict';
import {loadNative} from './helpers/native_loader.mjs';

// Every key process_rewards (src/main.js) reads. A reward key outside this list is silently ignored at runtime,
// the way a location reward written `action:` instead of `actions` would be (idea absorbed from Kuroiteiken/yairp's
// reward-key warning; mechanism only). Add a key here in the same change that teaches process_rewards to read it.
const READ_BY_PROCESS_REWARDS = new Set(['actions', 'active_effects', 'activities', 'chance', 'crafting', 'dialogues', 'flags',
    'global_activities', 'housing', 'items', 'locks', 'locations', 'messages', 'money', 'move_to', 'npcs', 'quest_progress', 'quests',
    'recipes', 'reputation', 'skill_xp', 'skills', 'stances', 'textlines', 'traders', 'xp']);

// Keys on content rewards objects that another reader consumes; each needs a reason.
const KNOWN_OTHER = new Map([
    ['required_clear_count', 'gate for rewards_with_clear_requirement, read before process_rewards runs (main.js clear check, fork_discovery_views)'],
    ['hint', 'public milestone description on a clear-count reward, read by fork_discovery_views'],
]);

function collect(root, label, found = [], seen = new Set()) {
    if (!root || typeof root !== 'object' || seen.has(root)) return found;
    seen.add(root);
    for (const [key, value] of Object.entries(root)) {
        if (key === 'rewards' && value && typeof value === 'object' && !Array.isArray(value)) found.push({label, rewards: value});
        collect(value, `${label}.${key}`, found, seen);
    }
    return found;
}

test('native location, dialogue and quest rewards use only keys process_rewards reads', async () => {
    const m = await loadNative('export {locations} from "./src/data/locations.js"; export {dialogues} from "./src/data/dialogues.js"; export {quests} from "./src/quests.js";', {prefix: 'rk-native-'});
    const all = [...collect(m.locations, 'locations'), ...collect(m.dialogues, 'dialogues'), ...collect(m.quests, 'quests')];
    assert.ok(all.length > 50, `walked ${all.length} reward objects`);
    const unknown = all.flatMap(({label, rewards}) => Object.keys(rewards).filter(k => !READ_BY_PROCESS_REWARDS.has(k) && !KNOWN_OTHER.has(k)).map(k => `${label}: ${k}`));
    assert.deepEqual(unknown, []);
});
