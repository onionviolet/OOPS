import test from 'node:test';
import assert from 'node:assert/strict';
import {runCase, runCaseData} from '../scripts/coverage_report.mjs';
import {MIND_BINDING_CASE_MODULE, MIND_BINDING_TIMES, canRunMindBinding, contestMindBinding,
    mindBindingBlocker, mindBindingCase, mindBindingCaseId} from '../src/mind_binding_law.js';

test('every directed binding case fires through the stored working and survives a save restore', async () => {
    for (const time of MIND_BINDING_TIMES) {
        const id = mindBindingCaseId(time);
        assert.equal((await runCase({id, state: 'blocked:mind-binding', case: {module: MIND_BINDING_CASE_MODULE, id}},
            {reachable: new Set()})).state, 'expressed-authored', id);
    }
});

test('a wrong mental outcome fails and a different mind effect stays blocked', async () => {
    const c = mindBindingCase(mindBindingCaseId());
    c.timeline[1].expect[0].to = 'stranger';
    assert.equal((await runCaseData(c)).state, 'blocked:runner-expect-mismatch');
    assert.equal(canRunMindBinding({verb: 'bind', object: 'mind', target: 'marked', time: 'sustained'},
        'Compels the target to follow an order.'), true);
    assert.match(mindBindingBlocker({verb: 'transform', object: 'mind', target: 'marked', time: 'sustained'}), /not a directed binding/);
    assert.match(mindBindingBlocker({verb: 'bind', object: 'mind', target: 'area', time: 'sustained'}, 'Compels a crowd.'), /individual reach/);
});

test('will resistance and a guard change the same notch contest outcome', () => {
    const weak = contestMindBinding({casterNotch: 0, defenderResist: 6, draw: () => .5});
    const strong = contestMindBinding({casterNotch: 6, defenderResist: 0, draw: () => .5});
    const guarded = contestMindBinding({casterNotch: 6, defenderResist: 0, guard: 12, draw: () => .5});
    assert.equal(weak.won, false);
    assert.equal(strong.won, true);
    assert.equal(guarded.won, false);
});
