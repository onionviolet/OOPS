import {hpLeadLife} from './book_hp_lead_life_data.js';
// Plain-data world pack for the HP lead life. It cannot sit in the main bundled list: the loader refuses
// nested pack ids and `book.hp` is already a pack (world_pack_loader namespace-overlap). It is loaded as
// a second, separate list in world_pack_registry.js. Paraphrase only; no source text is bundled.
export default {
 "format": "yairpg.world-pack",
 "formatVersion": 1,
 "id": "book.hp.lead",
 "revision": 1,
 "saveSchema": 1,
 "kind": "canon",
 "title": "Harry Potter · lead life, book 1 opening",
 "sourceSnapshot": {
  "hash": "18c33156efa508396c6d1fcb4f763cff99e976b06b27fb34712f05d1d9d25ec9",
  "locator": "HP-seven-novel-collection B1 chapter 2 (private lead-run scenes hp1c001, not shipped)"
 },
 "attribution": {
  "source": "J.K. Rowling, Harry Potter and the Philosopher's Stone (paraphrased, no text copied)",
  "licence": "canon-reference",
  "notice": "A ten-year-old's opening in his guardians' household. Place layout, durations and the morning's hour are authored proposals."
 },
 "budgets": {"entities": 8, "drawsPerEntity": 1, "saveBytes": 60000},
 "content": {},
 "native": hpLeadLife
};
