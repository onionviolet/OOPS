// Time and chronicle fixtures (TIME_AND_CHRONICLE TC3). Invented names only (CLR3). The digest is
// built by the game's own grouping function and drawn by the shared figure renderer.
import {groupDigest, digestFigure} from '../../../return_digest.js';
import {FIGURE_FIXTURES} from '../figure_fixtures.js';

export const RETURN_DIGEST_SAMPLE = groupDigest({clock: 2160, seenAt: 1440,
    people: [{id: 'mara', name: 'Mara Venn', memories: [{at: 1700, text: 'Lent you her storm lantern.'}, {at: 2050, text: 'Asked whether you had paid Old Tobb.'}]},
        {id: 'tobb', name: 'Old Tobb', memories: [{at: 1980, text: 'Came by about the debt and left a mark on the door.'}]}],
    own: [{at: 2100, text: 'Finished the road check to the ford.'}],
    around: [{at: 1800, text: 'The lantern market closed early for the rain.'}],
    missed: [{at: 1620, text: 'The ferry left without you; the ferryman says the next one runs in three days.'}]});
export const RETURN_DIGEST_FIXTURE = digestFigure(RETURN_DIGEST_SAMPLE, {id: 'time-return-digest', title: 'While you were away in Lanternside'});
export const TIME_FIXTURES = [RETURN_DIGEST_FIXTURE];
FIGURE_FIXTURES.push(...TIME_FIXTURES);
