// PS303: a saved life that fails to load says so on screen. Default: a band at the top of the page names what
// happened, that the save is kept as it was, and offers a copy of it to download; the game's own reason sits under
// Details. Reason: without it the page shows a fresh village on day 1, which reads as a lost life. Saving stays paused
// (is_loading_error), so nothing overwrites the save. Drawn through the kit (PS292).
import {kitElement, kitRow} from './ui/kit.js';

/** Pure: the band's words for a failed load. */
export function loadFailureText(error) {
    return {
        title: 'Your saved life did not load.',
        body: 'What you see is a fresh start, not your life. Your save is kept exactly as it was, and saving is paused so nothing writes over it. A newer save usually needs the game rebuilt or updated to read it.',
        download: 'Download a copy of the save',
        details: String(error?.message || error || 'No reason was given.'),
    };
}

/** Draw the band once. download() hands the player the kept save; it is left out when there is nothing to hand over. */
export function showLoadFailureNotice(error, {download, doc = globalThis.document} = {}) {
    if (!doc?.body || doc.getElementById('load_failure_notice')) return null;
    const text = loadFailureText(error);
    const band = kitElement('section', 'load-failure-notice');
    band.id = 'load_failure_notice'; band.setAttribute('role', 'alert');
    band.append(kitElement('strong', 'load-failure-notice__title', text.title), kitElement('p', 'load-failure-notice__body', text.body));
    if (download) band.append(kitRow({label: text.download, action: {run: download}}));
    const more = kitElement('details', 'load-failure-notice__details');
    more.append(kitElement('summary', '', 'Details'), kitElement('code', '', text.details));
    band.append(more);
    doc.body.prepend(band);
    return band;
}
