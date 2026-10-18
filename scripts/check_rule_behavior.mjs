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
        scope: 'foundation save compatibility and opaque retired-content retention',
        files: ['tests/save_compatibility.test.js'],
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
