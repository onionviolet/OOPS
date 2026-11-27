import {HP_LIBRARY_WORK, HP_LIBRARY_ACTIONS} from '../hp_library_work.js';
import {kitElement, kitRow} from './kit.js';
import {tidyReasons} from '../player_reasons.js';

export function renderHpLibraryWork(view, campaign, {group, control, run, actions}) {
    const section = group('Library work', 'library');
    section.append(kitElement('p', '', view.schoolDay.libraryBookDown ? 'The chart-book is on the desk. Copy your reference notes, then put the library book back.' : 'An Astronomy chart-book sits too high to reach. Bring it down, copy your own reference notes, and put it back. The notes help you finish assigned Astronomy charts in half an hour.'));
    const offer = (campaign.extensions || []).find(row => row.id === HP_LIBRARY_WORK);
    if (offer) {
        const disabled = !view.atCharmsBench || !campaign.canWrite || !offer.eligible;
        const fact = !view.atCharmsBench ? 'Return to the Great Hall for the school library.' : !campaign.canWrite ? campaign.pauseReason || 'Saving is paused.' : tidyReasons(offer.reasons || []) || 'Choose a ladder or your learned charm.';
        const row = kitRow({label: 'Use the high-shelf chart-book', fact, action: {disabled, title: fact,
            run: () => run({type: 'adopt-extension', id: offer.id, revision: offer.revision, contentHash: offer.contentHash})}});
        row.firstChild.dataset.hpLibraryOpen = '';
        section.append(row);
        return;
    }
    for (const id of [HP_LIBRARY_ACTIONS.ladder, HP_LIBRARY_ACTIONS.cast, HP_LIBRARY_ACTIONS.copy]) {
        const action = actions.get(id);
        if (!action) continue;
        const detail = [...(action.costs || [])];
        if (id === HP_LIBRARY_ACTIONS.cast && view.schoolDay.feather) detail.push(`about ${view.schoolDay.feather.chance}% to bring it down`);
        section.append(control(action, detail.join(' · ')));
    }
}
