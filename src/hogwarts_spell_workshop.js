const techniques = new Map([
    ['accio', {word: 'Accio', gesture: ['draw'], operation: 'fetch', effort: 2}],
    ['leviosa', {word: 'Wingardium Leviosa', gesture: ['swish', 'flick'], operation: 'lift', effort: 2}],
]);

function movement(state, operation) {
    if (operation === 'fetch') {
        if (state.obstructed && state.distance > 1) return 'The jar could not pass the obstacle.';
        state.distance = 1;
    } else {
        if (state.distance > 2) return 'The jar is beyond the practice lift’s reach.';
        state.height = 1;
        state.held = true;
    }
    return null;
}

function cast(state, action) {
    const {forms, words, gesture, target, intent, wand, mode = 'spoken'} = action;
    const result = {action: 'cast', target, spent: 0, operations: []};
    const reject = reason => ({...result, outcome: 'unresolved', reason});
    if (!Array.isArray(forms) || !forms.length || forms.length > techniques.size || new Set(forms).size !== forms.length) {
        return reject('Choose one or more distinct learned forms.');
    }
    const selected = forms.map(form => techniques.get(form));
    if (selected.some(form => !form)) return reject('A selected form is unknown.');
    const operations = selected.map(form => form.operation);
    if (target !== 'jar' || intent !== operations.join(' then ')) return reject('Identify the jar and the intended operations.');
    if (mode !== 'spoken') return reject('This fixture establishes spoken practice for these forms.');
    if (typeof words !== 'string' || words.trim().replace(/\s+/g, ' ').toLowerCase() !== selected.map(form => form.word.toLowerCase()).join(' ')) {
        return reject('The words do not bind the selected forms in order.');
    }
    if (!Array.isArray(gesture) || JSON.stringify(gesture) !== JSON.stringify(selected.flatMap(form => form.gesture))) {
        return reject('The movement does not carry the selected forms in order.');
    }
    if (wand !== 'practice-wand' || !state.wandIntact) return reject('A working practice wand is needed for this attempt.');
    if (!action.focused) return reject('Focus on the intended jar.');
    const effort = selected.reduce((total, form) => total + form.effort, 0) + selected.length - 1;
    if (effort > state.stamina) return reject('You need more stamina.');
    state.stamina -= effort;
    result.spent = effort;
    result.basis = selected.length > 1 ? 'Original single-cast experiment' : 'Learned practice form';
    for (const operation of operations) {
        const failure = movement(state, operation);
        result.operations.push({operation, distance: state.distance, height: state.height, failure});
        if (failure) return {...result, outcome: 'interrupted', reason: failure};
    }
    return {...result, outcome: 'resolved'};
}

function actionFor(forms) {
    const selected = forms.map(form => techniques.get(form));
    return {
        action: 'cast', forms, words: selected.map(form => form.word).join(' '),
        gesture: selected.flatMap(form => form.gesture), intent: selected.map(form => form.operation).join(' then '),
        target: 'jar', wand: 'practice-wand', focused: true,
    };
}

export const spellWorkshopCases = Object.freeze({
    'spell-lift': {method: 'spell', distance: 1, actions: [actionFor(['leviosa']), {action: 'release'}]},
    'spell-sequence': {method: 'spell', distance: 4, actions: [actionFor(['accio']), actionFor(['leviosa'])]},
    'spell-experiment': {method: 'spell', distance: 4, actions: [actionFor(['accio', 'leviosa'])]},
});

export function runSpellWorkshop({distance = 1, obstructed = false, wandIntact = true, actions} = {}) {
    if (!Number.isSafeInteger(distance) || distance < 1 || distance > 10) throw Error('Distance must be a whole number from 1 to 10.');
    if (typeof obstructed !== 'boolean' || typeof wandIntact !== 'boolean') throw Error('Obstacle and wand condition must be true or false.');
    if (!Array.isArray(actions) || actions.length > 40) throw Error('Supply an array of up to 40 actions.');
    const state = {distance, obstructed, wandIntact, height: 0, held: false, stamina: 12};
    const trace = actions.map(action => {
        if (action?.action === 'cast') return cast(state, action);
        if (action?.action !== 'release') return {outcome: 'unresolved', reason: 'Choose cast or release.'};
        if (!state.held) return {action: 'release', outcome: 'unresolved', reason: 'The jar is resting on a surface.'};
        state.held = false;
        state.height = 0;
        return {action: 'release', outcome: 'landed', distance: state.distance, height: state.height, spent: 0};
    });
    return {
        method: 'spell', state, trace,
        basis: 'Book 1 pp137–142 and book 7 p3716 support lift. Book 4 p1461 supports summoning. The fetch gesture, practice distances and stamina, release action and compound technique are original workshop rules.',
    };
}
