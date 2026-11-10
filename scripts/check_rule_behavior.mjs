// A small map from standing rules to existing implementation regressions.
// These files also run under npm test. This is an optional focused route,
// not an additional release gate or proof of whole-rule compliance.
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const groups = {
    knowledge: {
        rules: 'AD6, AD7, AR8',
        scope: 'people/world projections: withheld facts, observations, pure reads',
        files: ['tests/people_knowledge.test.js', 'tests/world_knowledge.test.js'],
    },
    transactions: {
        rules: 'AR3, AR7, MR4, MR5',
        scope: 'native crafting rollback/durable results; mixture quote revalidation and publication',
        files: ['tests/native_craft_transaction.test.js', 'tests/mixture_rule_modules.test.js'],
    },
    saves: {
        rules: 'AR6, MR33',
        scope: 'existing foundation/opaque-retention mechanism only; AR6/MR33 old-state guarantees are qualified by the 2026-10-17/18 decisions, not a blanket retention policy',
        files: ['tests/save_compatibility.test.js'],
    },
    ties: {
        rules: 'TIE1, TIE4, TIE14 (2026-11-10, working defaults)',
        scope: 'one edge store through tieEffects; per-cause receipts; episodes and derived bond',
        files: ['tests/person_ties.test.js', 'tests/person_memory.test.js', 'tests/person_memory_effects.test.js'],
    },
    standing: {
        rules: 'STN14, STN16 (2026-11-10, working defaults)',
        scope: 'claim, knowledge and reach; per-authority heat; knownness fade',
        files: ['tests/authority.test.js', 'tests/authority_knownness_fade.test.js', 'tests/heat.test.js'],
    },
    time: {
        rules: 'TMR2, TMR5, TMR7 (2026-11-10, working defaults)',
        scope: 'per-world calendar profiles; the away bank; lazy projection for one pen',
        files: ['tests/world_calendar.test.js', 'tests/away_bank_domain.test.js', 'tests/habitat_care.test.js'],
    },
    fate: {
        rules: 'STY3, STY25 (2026-11-10, working defaults; STY25 reach is not yet in code)',
        scope: 'keyed canon pull, budget and restore/substitute order; does not prove reach or gate safety',
        files: ['tests/canon_pull.test.js'],
    },
    cheats: {
        rules: 'CHT3, CHT14 (2026-11-10, working defaults)',
        scope: 'card contract, grants and carry',
        files: ['tests/cheat_cards.test.js'],
    },
    routes: {
        rules: 'AD56 rule routing',
        scope: 'path rules route each 2026-11-10 rulebook from its modules; no stale glob in those files',
        files: ['tests/rule_routes.test.js'],
    },
    navigation: {
        rules: 'UR9',
        scope: 'center-mode controller history and return lifecycle (no browser/keyboard proof)',
        files: ['tests/center_modes.test.js'],
    },
};
const requested = process.argv.slice(2);
const selected = requested.length ? [...new Set(requested)] : Object.keys(groups);
const unknown = selected.filter(name => !Object.hasOwn(groups, name));
if (unknown.length) {
    console.error(`Unknown groups: ${unknown.join(', ')}. Choose: ${Object.keys(groups).join(', ')}`);
    process.exit(2);
}
console.log('Rule behavior checks: partial implementation evidence, not whole-rule compliance.');
for (const name of selected) {
    const group = groups[name];
    console.log(`${name} [${group.rules}]: ${group.scope}`);
}
const files = [...new Set(selected.flatMap(name => groups[name].files))];
const result = spawnSync(process.execPath, ['--test', ...files], {
    cwd: fileURLToPath(new URL('../', import.meta.url)), stdio: 'inherit',
});
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
