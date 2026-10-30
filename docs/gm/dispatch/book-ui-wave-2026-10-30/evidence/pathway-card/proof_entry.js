// Proof page entry (bundle with esbuild, serve beside styles/ and private_packs/): the real LOTM host view -> Seer card, and the synthetic realm card.
// ?state=0|1|2|realm &size=14|21 &art=1 (private build only).
import {hostOver, fresh, run, at, wait} from '../../../../../tests/lotm_helpers.js';
import {LOTM_LOCATIONS as L} from '../../../../../src/book_world_lotm_ids.js';
import {lotmPathwayCard} from '../../../../../src/book_world_lotm_card.js';
import {seerPathway} from '../../../../../src/book_world_lotm_path.js';
import {loadCardArt, setCardArt} from '../../../../../src/pathway_card_art.js';
import {pathwayCard} from '../../../../../src/pathway_card.js';
import {renderPathwayCard} from '../../../../../src/ui/pathway_card_view.js';
import {REALM_CARD_INPUT} from '../../../../../src/ui/preview/fixtures/card_paths.js';
const q = new URLSearchParams(location.search);
const size = Number(q.get('size') || 14);
document.documentElement.style.setProperty('--ui-type-body', size + 'px'); document.documentElement.style.setProperty('--ui-type-small', Math.round(size * 12 / 14) + 'px'); document.documentElement.style.setProperty('--ui-type-title', Math.round(size * 16 / 14) + 'px');
if (q.get('art') === '1') { const pack = await loadCardArt(); if (pack) setCardArt(pack); }
const host = document.getElementById('host');
const which = q.get('state') || '0';
let card;
if (which === 'realm') card = pathwayCard(REALM_CARD_INPUT);
else {
    let p = at(fresh(), L.workroom);
    if (which >= '1') { p = run(p, 'report_in'); p = run(p, 'accept_allocation'); p = run(p, 'ingest'); }
    if (which >= '2') { p = wait(run(p, 'lesson'), 5); }
    card = lotmPathwayCard(hostOver(p).host.view(), seerPathway);
}
renderPathwayCard(host, card, {onRoute: id => { window.__routed = id; }});
window.__card = card; window.__ready = true;
