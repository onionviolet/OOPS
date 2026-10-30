// The Tingen confirm step as a crossing threshold (RPX20, proposal 2026-10-30). Reads only what the
// host's entry view already returns (profiles[].answers, returnable, axes, startable, startReasons);
// the button tokens and data-lotm hooks stay as before so seat filters and playtests still find them.
import {entryMethodOf} from './book_world_lotm_entry.js';

export function lotmThresholdView(v, pick, {onConfirm, onBack}) {
    const era = v.axes?.find(a => a.id === 'era')?.options.find(o => o.available)?.label;
    const blocked = !v.startable ? v.startReasons.join(' ') : pick.available === false ? 'A fresh book life is unavailable in this host.' : '';
    return {
        id: pick.key, attrs: {lotmEntryAnswers: pick.key},
        from: 'Village', to: 'Tingen', title: pick.label.replace(/^Begin /, ''), era: pick.independent ? undefined : era,
        method: pick.independent ? undefined : entryMethodOf(pick.key), returnable: !!v.returnable, independent: !!pick.independent,
        stakes: pick.independent ? 'A separate life begins. Your current life is kept until the new life is ready.' : undefined,
        answers: pick.answers, rowAttrs: question => ({lotmAnswer: question}),
        options: [
            {id: 'confirm', label: pick.independent ? 'Start this new life' : 'Confirm and cross to Tingen', attrs: {lotm: pick.key === 'probationer' ? 'enroll' : `enroll_${pick.key}`},
                cost: pick.independent ? '' : v.returnable ? 'Your Village life pauses' : 'Cannot be undone on this save', blocked, onChoose: onConfirm},
            {id: 'back', label: 'Back to the lives', attrs: {lotm: 'entry_back'}, affects: 'Nothing changes', onChoose: onBack},
        ],
    };
}
