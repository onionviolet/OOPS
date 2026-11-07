// W11-C consumer: reading the Tingen papers (inquiry@1, src/inquiry.js). Domain level only; the button belongs to the LOTM UI lane.
// There is no library location in the Tingen pack (places: workroom, lodging, docks, university area), so the one authored
// topic is read at the university area, where the reading room is an authored stand-in (a proposal, not a source claim).
// The topic is public and authored: what the city papers print. It names no pathway, church secret or sealed truth.
// UI lane contract: import { lotmLibraryQuote, lotmLibraryStudy, LOTM_LIBRARY_INQUIRY } from './book_world_lotm_inquiry.js' (the
// import registers the definition), call lotmLibraryQuote() to draw the button (eligible, reason, minutes, partial, done) and
// lotmLibraryStudy() on click (then redraw). Both go through the inquiry domain commands `quote` and `work`.
// Missing, named: no opening hours, no cost, no travel to a reading room; one topic only.
import {registerInquiry} from './inquiry.js';
import {domainRegistry} from './domain_registry.js';
import {LOTM_IDS as I, LOTM_LOCATIONS as L} from './book_world_lotm_ids.js';

export const LOTM_LIBRARY_INQUIRY = 'study.lotm.tingen_papers';
export const LOTM_LIBRARY_KEY = 'study.lotm.tingen_papers.writeup';
// Dials with reasons: two one-hour sittings (the back numbers are bound by year), each sitting counts as one piece of evidence.
registerInquiry({
    id: LOTM_LIBRARY_INQUIRY, question: 'What do the Tingen papers say about how the city is kept in order?', method: 'read',
    sources: [{kind: 'place', id: 'book.lotm.tingen.reading_room', coverage: 'bound back numbers of the city papers (authored)'}],
    need: {minutes: 120, evidence: 2}, session: {minutes: 60},
    risk: 'Taking a paper\'s notice for the whole story costs you a wasted trip or a wrong guess about who answers where.',
    outputs: [{key: LOTM_LIBRARY_KEY, stage: 'understood', value: 'You read the bound back numbers of the Tingen papers and learned how the city reports itself: notices of services, fares and fines, and which district an incident is printed under. The papers show what is public, not what the churches handle.'}],
    gate: state => state?.actors?.player?.worldId !== I.world ? 'The reading room is in Tingen.'
        : state.simulation?.people?.player?.location !== L.university ? 'The papers are kept in the reading room at the university area.' : ''});

const run = name => () => domainRegistry.command('inquiry', name)({id: LOTM_LIBRARY_INQUIRY});
/** Draw-time read: {eligible, reason, minutes, done, partial, effort, confidence, question}. Never throws for "not ready". */
export const lotmLibraryQuote = run('quote');
/** Click: one hour in the reading room. Throws the quote's reason when it cannot run; returns the view with wroteNow. */
export const lotmLibraryStudy = run('work');
