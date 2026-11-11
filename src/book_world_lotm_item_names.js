// FRC54 first caller (proposal, AD56): the Tingen broker's lots are named by what this character has
// learned about them. The item ids stay as saved (some spell out the truth, which is why no screen may
// show the raw id); the names below are readings over the buyer's own knowledge (src/item_identity.js).
// Two routes, both "being told", already written by the broker commands (book_world_lotm_broker.js):
//   lot.<id>.held    paying the broker records the seller's agent's offer: a guess about the item at best;
//   lot.<id>.verdict the appraiser's verdict: known, including "forged" for a lot that is not what was said.
// Names and wording are authored proposals (WPR5), not canon. Another character holds none of these
// entries until a route writes them, so the broker's Warden or a cast seat reads the same lot as unknown.
import {defineItemIdentity} from './item_identity.js';
import {LOTM_KEYS as K} from './book_world_lotm_ids.js';
import {LOTM_CHARACTERISTIC as CORE} from './book_world_lotm_bench.js';
import {pathwayRows} from './book_world_lotm_rows.js';

const idOf = key => JSON.parse(key).id;
const said = lot => `book.lotm.lot.${lot}.held`, verdict = lot => `book.lotm.lot.${lot}.verdict`;
const define = (key, lot, open, guess, known) => defineItemIdentity({itemId: idOf(key), open,
    routes: [{knowledge: said(lot), cap: 'guessed', ...guess}, {knowledge: verdict(lot), ...known}]});

const NO_LABEL = 'A prepared potion with no label, sold through a broker. Drinking an unverified, unissued dose is a stated route to loss of control; an appraiser can say what it is.';
const NO_LABEL_8 = 'A prepared potion with no label, a step up from the first. Drinking it undigested or out of order is a stated route to loss of control; an appraiser can say what it is.';

for (const r of pathwayRows.filter(row => row.market)) {
    define(K[r.market.baseHold], `dose9_${r.key}`, {name: 'Unmarked prepared dose', description: NO_LABEL},
        {name: 'Unmarked dose, sold as Sequence 9', description: `${NO_LABEL} The seller's agent offered it as a Sequence 9 potion and named no pathway.`},
        {name: `${r.potion} potion, Sequence 9`, description: `The broker's appraiser judged this unmarked dose a genuine Sequence 9 ${r.potion} potion. No church allocation covers drinking it.`});
    define(K[r.market.nextHold], `dose8_${r.key}`, {name: 'Unmarked prepared dose', description: NO_LABEL_8},
        {name: 'Unmarked dose, sold as Sequence 8', description: `${NO_LABEL_8} The seller's agent offered it as a Sequence 8 potion and named no pathway.`},
        {name: `${r.next} potion, Sequence 8`, description: `The broker's appraiser judged this unmarked dose a genuine Sequence 8 ${r.next} potion. Taking it out of order, undigested or unassessed is a stated cause of loss of control.`});
}

define(K.hairs, 'hairs', {name: 'Bundle of hairs', description: 'A bundle of coarse hairs tied with thread.'},
    {name: 'Bundle sold as rare hairs', description: 'A bundle sold as rare hairs. Whether it is what the seller says is for an appraiser to judge.'},
    {name: 'Forged bundle of hairs', description: 'The broker\'s appraiser judged this bundle a forgery: ordinary hair dressed up as a rare material.'});
define(K.frog, 'frog', {name: 'Dried frog', description: 'A small frog, dried flat, its skin dark with spots.'},
    {name: 'Dried frog, sold as black-spotted', description: 'The seller\'s agent offered it as a dried black-spotted frog, a formula material. Nobody has checked it yet.'},
    {name: 'Dried black-spotted frog', description: 'The broker\'s appraiser judged it a genuine dried black-spotted frog, a formula material for the Corpse Collector line. Worth about three soli.'});
define(K.ink, 'ink', {name: 'Jar of dark ink', description: 'A stoppered jar of thick, grey-black ink.'},
    {name: 'Jar sold as grave-dust ink', description: 'Offered in barter as ink ground with grave dust. Nobody has checked it yet.'},
    {name: 'Grave-dust ink', description: 'The broker\'s appraiser judged it genuine: ink ground with grave dust.'});
define(CORE.key, 'tc01', {name: `Tagged lot ${CORE.serial}`, description: 'One tagged physical core. Its identity and use must be appraised; it is not a prepared potion.'},
    {name: `Tagged lot ${CORE.serial}, sold as a characteristic`, description: 'The seller\'s agent offered it as a Beyonder characteristic and named no pathway or Sequence. Nobody has checked it yet.'},
    {name: `${CORE.serial}: Spectator Sequence 9 characteristic`, description: `The broker's appraiser identified ${CORE.serial} as a Spectator Sequence 9 characteristic suitable for the matching formula. It replaces the main materials, not the auxiliaries.`});
