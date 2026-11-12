// Authored application details for the spellbook's observed outcomes. Spell
// truths and their source locators remain in HP_SPELL_ROWS.
const room = id => ({id, kind: 'place'});
const at = id => ({shape: 'holder', id});
const changed = (holder, property, to) => ({holder, property, direction: 'changed', to});
const person = (id, properties = {}, kind = 'body') => ({
    id, kind, place: 'hall', properties: {mind_awake: true, ...properties},
});
const routes = [{from: 'hall', to: 'doorway'}, {from: 'doorway', to: 'hall'}];
export const HP_MIND_ENGINE = {
    packs: ['a.mind'], settings: {'a.mind': {routes}},
};

function contact(seen, mind, before, expect, timing = {}) {
    return {
        seen, holders: [room('hall'), room('doorway'), person('caster'),
            person('subject', before, mind.faculty === 'sense' ? 'thing' : 'body')],
        by: 'caster',
        details: {place: 'hall', target: at('subject'), mind, ...timing},
        expect,
    };
}
function conjure(seen, id, form) {
    return {
        seen, holders: [room('hall'), room('doorway')],
        details: {target: at('hall'), create: {id, kind: 'body',
            properties: {form, mind_awake: true, agency_goal: 'doorway'}}},
        expect: [
            {holder: id, exists: true, direction: 'changed', to: true},
            {holder: id, position: true, direction: 'changed', to: 'hall'},
            changed(id, 'form', form),
        ],
    };
}

export const HP_MIND_SCENES = Object.freeze({
    blind: contact('the portrait can no longer see', {faculty: 'sense', channel: 'sight'},
        {senses: ['hearing', 'sight']}, [changed('subject', 'senses', ['hearing'])]),
    stun: contact('the struck person loses awareness', {faculty: 'awareness'}, {},
        [changed('subject', 'mind_awake', false)], {minutes: 3}),
    pain: contact('the struck person feels intense pain', {faculty: 'pain', amount: 8}, {mind_pain: 1},
        [changed('subject', 'mind_pain', 9)], {minutes: 2, working: 'working.pain'}),
    control: contact('the caster takes control of the subject’s movement', {faculty: 'will', to: 'doorway'}, {agency_goal: 'hall'},
        [changed('subject', 'mind_controller', 'caster')], {minutes: 3, working: 'working.control'}),
    memory: contact('the subject loses a particular memory', {faculty: 'memory', record: 'last-meeting'},
        {mind_memory: ['last-meeting', 'home']}, [changed('subject', 'mind_memory', ['home'])]),
    confuse: contact('the subject’s confusion increases', {faculty: 'confusion', amount: 5}, {mind_confusion: 1},
        [changed('subject', 'mind_confusion', 6)], {minutes: 4}),
    cheer: contact('the subject’s mood lifts', {faculty: 'mood', amount: 3}, {mind_mood: 2},
        [changed('subject', 'mind_mood', 5)], {minutes: 4}),
    legilimency: contact('the caster gains access to a memory of the subject', {faculty: 'memory'},
        {mind_memory: ['last-meeting']}, [changed('caster', 'mind_access', ['["subject","last-meeting"]'])],
        {channel: 'mind', minutes: 2, working: 'working.legilimency'}),
    bird: conjure('a living bird appears', 'bird', 'bird'),
    serpent: conjure('a living serpent appears', 'serpent', 'serpent'),
    animate: {
        seen: 'the statue gains motion of its own',
        holders: [room('hall'), room('doorway'), {id: 'statue', kind: 'thing', place: 'hall'}],
        details: {target: at('statue'), properties: {agency_goal: 'doorway', agency_until: 3}},
        expect: [changed('statue', 'agency_goal', 'doorway')],
    },
});
