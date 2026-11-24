import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {commands, configureRewind} from '../src/rewind_domain.js';
import {useEchoTrial, validateEchoTrial} from '../src/rewind_echo.js';

const atSurge = () => {
    const {trial} = useEchoTrial(undefined, 'begin', 100);
    return useEchoTrial(trial, 'surge', 101).trial;
};

test('either holder restores exactly their mechanism and consumes the same last charge', () => {
    for (const [chosen, other] of [['lift', 'bell'], ['bell', 'lift']]) {
        const initial = atSurge();
        assert.equal(useEchoTrial(initial, 'finish', 102).ok, false);
        const {ok, trial} = useEchoTrial(initial, chosen, 102);
        assert.equal(ok, true);
        assert.equal(trial.rooms[chosen], 'working');
        assert.equal(trial.rooms[other], 'jammed');
        assert.deepEqual(trial.mark, initial.mark);
        assert.deepEqual(initial.rooms, {lift: 'jammed', bell: 'jammed'});
        for (const action of [chosen, other, 'begin', 'surge']) {
            assert.deepEqual(useEchoTrial(trial, action, 102), {ok: false, trial});
        }
        const finish = useEchoTrial(trial, 'finish', 103);
        assert.equal(finish.ok, true);
        assert.equal(finish.trial.finished, true);
        validateEchoTrial(finish.trial);
    }
});

test('the shared mark expires at its own hour and either operator is refused', () => {
    const trial = atSurge();
    assert.equal(useEchoTrial(trial, 'lift', 159).ok, true);
    for (const route of ['lift', 'bell']) assert.equal(useEchoTrial(trial, route, 160).ok, false);
    const end = useEchoTrial(trial, 'finish', 160).trial;
    assert.equal(end.spent, null);
    assert.deepEqual(end.rooms, {lift: 'jammed', bell: 'jammed'});
    validateEchoTrial(end);
});

test('rewind owner saves one coherent watch and rejects a forged second restored mechanism', () => {
    const domain = domainRegistry.list().find(item => item.id === 'rewind');
    domain.load(null);
    configureRewind({clock: () => 100});
    try {
        assert.equal(domain.save(), undefined);
        for (const act of ['begin', 'surge', 'bell']) assert.equal(commands.echoTrial(act), true);
        const saved = JSON.parse(JSON.stringify(domain.save()));
        domain.validate(saved);
        domain.load(domain.migrate(saved));
        assert.equal(commands.echoTrial('lift'), false);
        assert.deepEqual(domain.save(), saved);
        saved.echoTrial.rooms.lift = 'working';
        assert.throws(() => domain.validate(saved), /Invalid pump-station watch/);
    } finally {
        configureRewind();
        domain.load(null);
    }
});
