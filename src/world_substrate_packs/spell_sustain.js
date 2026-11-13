// Opt-in support for manifestations that rely on another holder's focus.
// A manifested body uses the existing end lifecycle when its support fails.
export const SPELL_SUSTAIN_PACK = {
    id: 's.focus', revision: 1,
    properties: [{id: 'sustained_by', type: 'label'}],
    reads: ['sustained_by', 'mind_awake', 'mind_confusion'],
    lifecycle: {acts: ['end']},
    laws: [{
        id: 'focus',
        appliesTo: holder => typeof holder.properties.sustained_by === 'string',
        horizon: () => 1,
        decide(view, id) {
            const caster = view.property(id, 'sustained_by');
            if (view.holder(caster)?.kind === 'body' && view.property(caster, 'mind_awake') !== false &&
                !(view.property(caster, 'mind_confusion') > 0)) return [];
            return [{op: 'lifecycle', act: 'end', holder: id}];
        },
    }],
};
