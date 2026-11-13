// HPPE069. The barrier reads lived age and moves the entrant to one side
// of the line. The cosmetic consequence is separate from eligibility.
import {defineWorkingLaw} from '../kernel_working.js';
import {natural, positive} from '../basics.js';

const roles = {entrant: 'body', line: 'thing', inside: 'place', outside: 'place'};
const law = defineWorkingLaw({id: 'hp.age-line', revision: 1, operations: {
    cross: {roles, minutes: 1, settle({bound: {entrant, line, inside, outside}, at}) {
        if (!entrant.holder || !line.holder || !inside.holder || !outside.holder ||
            entrant.place !== line.place || inside.holder === outside.holder)
            return {ok: false, reason: 'age-line-out-of-reach'};
        const age = entrant.properties['lived-years'], minimum = line.properties['minimum-years'];
        if (!natural(age) || !positive(minimum)) return {ok: false, reason: 'age-line-unreadable'};
        const admitted = age >= minimum;
        const effects = [{op: 'move', holder: entrant.holder, to: admitted ? inside.holder : outside.holder}];
        if (!admitted) {
            const until = at + 5;
            effects.push({op: 'property', holder: entrant.holder, property: 'temporary-form-layers',
                value: [...new Set([...(entrant.properties['temporary-form-layers'] ?? []), `bearded|3|${until}`])]});
        }
        return {ok: true, effects, observed: {admitted}};
    }},
}});

export function ageLineWorking(bindings) {
    return {law, bindings, method: {id: 'hp.cross-age-line', revision: 1, law: law.ref, roles,
        steps: [{op: 'cross', bindings: {entrant: 'entrant', line: 'line', inside: 'inside', outside: 'outside'}}]}};
}
