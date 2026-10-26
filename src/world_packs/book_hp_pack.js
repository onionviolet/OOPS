import {hpSchoolLife,hpTradeLife} from './book_hp_life_data.js';
// Plain-data world pack (WA21): one pinned canon potion, Polyjuice, authored and attributed.
// Source: J.K. Rowling, Harry Potter and the Chamber of Secrets. Paraphrase only; no source
// text is bundled. Locators are page tags in the private seven-novel extraction
// (docs/research/novels/harry-potter/source-preparation-2026-10-11, B2 text sha256 below).
// Evidence labels follow P9 PROFILE_RULES: shown (a scene), stated (a speaker or narrator),
// inferred (analysis). Status "original" marks a labelled YAIRPG proposal that sits within
// canon results (MR13). All numbers are integers (IS2); times are played minutes; money is
// whole slice coins; ratios are per-mille.
const B2 = 'B2:PDF-p';
const ev = (id, status, locator, speaker, note) => ({id: `book.hp.ev.${id}`, status, source: locator.startsWith('B1:') ? 'B1' : 'B2', locator: locator.startsWith('B1:') ? `B1:PDF-p${locator.slice(3)}` : `${B2}${locator}`, speaker, note});
const orig = (id, reason) => ({id: `book.hp.orig.${id}`, status: 'original', reason});

export default {
 "format": "yairpg.world-pack",
 "formatVersion": 1,
 "id": "book.hp",
 "revision": 2,
 "saveCompatibleFrom": 1,
 "saveSchema": 1,
 "kind": "canon",
 "title": "Harry Potter · Polyjuice and first local lives",
 "sourceSnapshot": {
  "hash": "18c33156efa508396c6d1fcb4f763cff99e976b06b27fb34712f05d1d9d25ec9",
  "locator": "HP-seven-novel-collection B2 text (private extraction, not shipped); windows PDF-p427, p432-433, p454, p481, p486-488, p498-499, p504"
 },
 "attribution": {
  "source": "J.K. Rowling, Harry Potter and the Chamber of Secrets (paraphrased, no text copied)",
  "licence": "canon-reference",
  "notice": "One potion formula paraphrased from the novel with evidence labels. Lots, prices, timings not stated by the novel, donors and consequences are labelled original proposals."
 },
 "budgets": {"entities": 8, "drawsPerEntity": 4, "saveBytes": 60000},
 "content": {
  "catalog": [
   {"id": "book.hp.cat.polyjuice", "label": "Polyjuice Potion (pinned formula)", "kind": "recipe", "locator": "B2:PDF-p432-433,486", "canonWeight": "W2"},
   {"id": "book.hp.cat.lacewing_flies", "label": "Lacewing flies", "kind": "ingredient", "locator": "B2:PDF-p432-433", "containedIn": "book.hp.cat.polyjuice"},
   {"id": "book.hp.cat.leeches", "label": "Leeches", "kind": "ingredient", "locator": "B2:PDF-p432", "containedIn": "book.hp.cat.polyjuice"},
   {"id": "book.hp.cat.fluxweed", "label": "Fluxweed", "kind": "ingredient", "locator": "B2:PDF-p432-433", "containedIn": "book.hp.cat.polyjuice"},
   {"id": "book.hp.cat.knotgrass", "label": "Knotgrass", "kind": "ingredient", "locator": "B2:PDF-p432", "containedIn": "book.hp.cat.polyjuice"},
   {"id": "book.hp.cat.bicorn_horn", "label": "Powdered horn of a bicorn", "kind": "ingredient", "locator": "B2:PDF-p432,454", "containedIn": "book.hp.cat.polyjuice"},
   {"id": "book.hp.cat.boomslang_skin", "label": "Shredded skin of a boomslang", "kind": "ingredient", "locator": "B2:PDF-p432,454", "containedIn": "book.hp.cat.polyjuice"},
   {"id": "book.hp.cat.donor_sample", "label": "A bit of the person to be copied", "kind": "ingredient", "locator": "B2:PDF-p432,486", "containedIn": "book.hp.cat.polyjuice"},
   {"id": "book.hp.cat.potions_master", "label": "The Potions master (school role, unnamed here)", "kind": "role", "locator": "B2:PDF-p454", "canonWeight": "W1"}
  ]
 },
 "native": {
  "schoolLife": hpSchoolLife,
  "tradeLife": hpTradeLife,
  "schema": 2,
  "id": "book.hp",
  "revision": 1,
  "payload": "polyjuice slice",
  "evidence": [
   ev('recipe_list', 'stated', '432', 'Hermione, reading the library book', 'The book lists lacewing flies, leeches, fluxweed, knotgrass, powdered bicorn horn, shredded boomslang skin and a bit of whoever is to be copied.'),
   ev('student_store', 'stated', '432', 'Hermione', 'Lacewings, leeches, fluxweed and knotgrass are in the student store-cupboard and may be taken.'),
   ev('private_store', 'stated', '432', 'Harry; narrator at p454', 'Boomslang skin is not in the student cupboard; the bicorn horn and skin are only in the Potions master private stores.'),
   ev('sample_last', 'stated', '432', 'Hermione', 'The personal sample is added last.'),
   ev('fluxweed_moon', 'stated', '433', 'Hermione', 'Fluxweed has to be picked at the full moon.'),
   ev('lacewing_21', 'stated', '433', 'Hermione', 'Lacewings have to be stewed for twenty-one days; she estimates about a month in all.'),
   ev('wears_off', 'stated', '427', 'Hermione', 'The transformation wears off after a while.'),
   ev('brew_cue', 'shown', '486', 'narrator and Hermione', 'A finished batch is a heavy, muddy-looking brew with lazy bubbles; Hermione is satisfied it matches the book.'),
   ev('one_hour', 'stated', '486', 'Hermione', 'After drinking, the change lasts exactly an hour.'),
   ev('three_glasses', 'shown', '486', 'narrator', 'The batch is ladled into three glasses and a sample is dropped into each; each glass hisses, froths and takes its own colour.'),
   ev('change_shown', 'shown', '487-488', 'narrator', 'Drinking is unpleasant and the body changes into the donor; the drinker can then act as that person.'),
   ev('animal_sample', 'shown', '498', 'narrator; Hermione', 'A sample that turned out to be from a cat gave animal features; Hermione says the potion is not meant for animal changes.'),
   ev('long_recovery', 'shown', '499, 504', 'narrator', 'The animal features took several weeks in the hospital wing to clear.'),
   ev('late_lacewings', 'shown', '481', 'Hermione', 'Hermione says she spent nearly an hour that morning adding more lacewings to the simmering potion before declaring it ready.'),
   ev('hidden_brewing', 'shown', '427, 432', 'narrator', 'The brewing is done in secret in an out-of-the-way bathroom, with the book taken from the Restricted Section on a teacher\'s note.'),
   ev('clothes_misfit', 'shown', '487-488', 'narrator', 'On changing, the drinkers\' own clothes and shoes no longer fit their new bodies and they swap into spares.'),
   ev('ps_ingredients', 'shown', 'B1:111', 'narrator (via CANON_CRAFT_WORLDS H01; not re-read in this session)', 'Dried nettles and crushed snake fangs are prepared for a different potion in the first book.')
  ],
  "originals": [
   orig('abrasive_suspension', 'A paid physical suspension can scour actual cauldron residue according to retained material preparation, quantity and the local abrasion law. This is not a potion identity or a canon claim.'),
   orig('hand_preparation', 'The local hand-preparation service charges authored labor fees and retains its actual lot receipt. Particle-size effects and costs are game tuning.'),
   orig('stew_pot', 'Stewing needs a pot; four lots at a time. Source states the duration, not the vessel.'),
   orig('stew_early', 'Taking lacewings out after 14 days gives an under-stewed lot; source states only the 21-day requirement.'),
   orig('brew_time', 'Simmering the assembled cauldron takes two played days; source gives only the month overall.'),
   orig('doses', 'One cauldron fills three glasses, following the three glasses shown, as a capacity adjective.'),
   orig('cauldron_wear', 'Cauldron condition wears with use and is scoured for a cost; source says nothing of wear.'),
   orig('degraded', 'A near miss yields a thin draught lasting half the stated hour; the novel does not show one.'),
   orig('failure', 'A far miss yields an inert murky infusion, never another named potion (OV1, MR7).'),
   orig('lots', 'Lot provenance, store stock, prices, loans, notice chances and donors are generated or authored proposals.'),
   orig('purse', 'A small slice purse in whole coins; not joined to the main game money. Denominations are not canon prices.'),
   orig('moon_window', 'Full moon is the game calendar phase named Full, which spans several days; the novel gives no window length.'),
   orig('recovery', 'Animal features last 14 played days, shorter than the several weeks shown, as a dial.')
  ],
  "unknowns": [
   {"id": "book.hp.unknown.quantities", "question": "Amounts of every ingredient and the heat regime are not stated."},
   {"id": "book.hp.unknown.sample_types", "question": "Which sample types work, how old they may be and storage are not stated."},
   {"id": "book.hp.unknown.interrupted_stew", "question": "Effect of an interrupted stew or a wrong order of addition is not stated."},
   {"id": "book.hp.unknown.edition_chapter", "question": "Chapter numbers in the extracted edition may differ from other editions; page tags are the locator."},
   {"id": "book.hp.unknown.staged_additions", "question": "Whether lacewings or other inputs are added in stages during simmering (p481 suggests so) and what a stir or heat change does are not qualified; the slice adds all slots at once."},
   {"id": "book.hp.unknown.retail", "question": "Whether a legitimate retail supplier of bicorn horn or boomslang skin exists is not stated; the supplier route is original."}
  ],
  "ingredients": [
   {"id": "book.hp.ing.lacewing_flies", "label": "Lacewing flies", "store": "student", "forms": ["raw", "stewed"], "evidence": ["book.hp.ev.recipe_list", "book.hp.ev.student_store", "book.hp.ev.lacewing_21"]},
   {"id": "book.hp.ing.leeches", "label": "Leeches", "store": "student", "forms": ["raw"], "evidence": ["book.hp.ev.recipe_list", "book.hp.ev.student_store"]},
   {"id": "book.hp.ing.fluxweed", "label": "Fluxweed", "store": "student", "forms": ["raw"], "evidence": ["book.hp.ev.recipe_list", "book.hp.ev.student_store", "book.hp.ev.fluxweed_moon"]},
   {"id": "book.hp.ing.knotgrass", "label": "Knotgrass", "store": "student", "forms": ["raw"], "evidence": ["book.hp.ev.recipe_list", "book.hp.ev.student_store"]},
   {"id": "book.hp.ing.bicorn_horn", "label": "Horn of a bicorn", "store": "private", "forms": ["raw", "powdered"], "evidence": ["book.hp.ev.recipe_list", "book.hp.ev.private_store"]},
   {"id": "book.hp.ing.boomslang_skin", "label": "Skin of a boomslang", "store": "private", "forms": ["raw", "shredded"], "evidence": ["book.hp.ev.recipe_list", "book.hp.ev.private_store"]},
   {"id": "book.hp.ing.dried_nettles", "label": "Dried nettles (other potion)", "store": "student", "forms": ["raw"], "evidence": ["book.hp.ev.ps_ingredients"]},
   {"id": "book.hp.ing.snake_fangs", "label": "Snake fangs (other potion)", "store": "student", "forms": ["raw"], "evidence": ["book.hp.ev.ps_ingredients"]}
  ],
  "variants": [
   {"id": "book.hp.prep.powder_fine", "label": "Fine powder", "makes": "powdered", "gradePermille": 1000},
   {"id": "book.hp.prep.powder_coarse", "label": "Coarse powder", "makes": "powdered", "gradePermille": 600},
   {"id": "book.hp.prep.shred_fine", "label": "Fine shreds", "makes": "shredded", "gradePermille": 1000},
   {"id": "book.hp.prep.shred_ragged", "label": "Ragged shreds", "makes": "shredded", "gradePermille": 600}
  ],
  "formula": {
   "id": "book.hp.formula.polyjuice",
   "product": "book.hp.product.polyjuice",
   "evidence": ["book.hp.ev.recipe_list", "book.hp.ev.sample_last", "book.hp.ev.one_hour"],
   "slots": [
    {"id": "lacewing", "ingredient": "book.hp.ing.lacewing_flies", "form": "stewed", "minStewMinutes": 30240, "nearStewMinutes": 20160, "evidence": ["book.hp.ev.lacewing_21"]},
    {"id": "leeches", "ingredient": "book.hp.ing.leeches", "form": "raw", "evidence": ["book.hp.ev.recipe_list"]},
    {"id": "fluxweed", "ingredient": "book.hp.ing.fluxweed", "form": "raw", "provenance": "full_moon", "evidence": ["book.hp.ev.fluxweed_moon"]},
    {"id": "knotgrass", "ingredient": "book.hp.ing.knotgrass", "form": "raw", "evidence": ["book.hp.ev.recipe_list"]},
    {"id": "bicorn", "ingredient": "book.hp.ing.bicorn_horn", "form": "powdered", "evidence": ["book.hp.ev.recipe_list"]},
    {"id": "boomslang", "ingredient": "book.hp.ing.boomslang_skin", "form": "shredded", "evidence": ["book.hp.ev.recipe_list"]}
   ],
   "sample": {"added": "last", "species": "human", "evidence": ["book.hp.ev.sample_last", "book.hp.ev.animal_sample"]},
   "transformMinutes": 60
  },
  "rules": {
   "startPurse": 60, "stewPotCapacity": 4, "brewMinutes": 2880, "doses": 3,
   "cauldronStart": 1000, "cauldronWearPerBrew": 150, "cauldronOkFrom": 700, "cauldronBadBelow": 400, "scourCost": 3,
   "degradedPermille": 500, "assayCost": 4, "animalRecoveryMinutes": 20160,
   "harvestCooldownMinutes": 4320, "moonFull": "Full",
   "storeStock": 6, "storeFluxweedOkPermille": 700, "preparedStewOkPermille": 900,
   "loanDueMinutes": 43200, "loanRepay": {"book.hp.ing.bicorn_horn": 12, "book.hp.ing.boomslang_skin": 14},
   "noticeAfterMinutes": 10080, "noticePermille": 500, "noticeStandingLoss": 3, "overdueStandingLoss": 1,
   "brushCatPermille": 250, "brushMixPermille": 200, "discoverPermille": 400, "discoverStandingLoss": 2,
   "donorAskCooldownMinutes": 4320, "donorAskMinStanding": -1, "donors": 3
  },
  "routes": [
   {"id": "book.hp.route.student_store", "label": "Student store-cupboard", "kind": "store", "custody": "school",
    "cost": {"book.hp.ing.lacewing_flies": 0, "book.hp.ing.leeches": 0, "book.hp.ing.fluxweed": 0, "book.hp.ing.knotgrass": 0, "book.hp.ing.dried_nettles": 0, "book.hp.ing.snake_fangs": 0},
    "evidence": ["book.hp.ev.student_store"]},
   {"id": "book.hp.route.market_stall", "label": "Market stall (cheap, unverified)", "kind": "supplier", "custody": "owned", "fluxweedOkPermille": 500,
    "cost": {"book.hp.ing.lacewing_flies": 1, "book.hp.ing.leeches": 1, "book.hp.ing.fluxweed": 2, "book.hp.ing.knotgrass": 1}, "evidence": []},
   {"id": "book.hp.route.trusted_supplier", "label": "Trusted supplier", "kind": "supplier", "custody": "owned", "fluxweedOkPermille": 950,
    "cost": {"book.hp.ing.lacewing_flies": 2, "book.hp.ing.leeches": 2, "book.hp.ing.fluxweed": 5, "book.hp.ing.knotgrass": 2, "book.hp.ing.bicorn_horn": 14, "book.hp.ing.boomslang_skin": 16, "book.hp.ing.dried_nettles": 1, "book.hp.ing.snake_fangs": 1},
    "preparedStewedLacewing": 8, "evidence": []},
   {"id": "book.hp.route.master_loan", "label": "Ask the Potions master for a loan from the private stores", "kind": "loan", "custody": "borrowed",
    "cost": {"book.hp.ing.bicorn_horn": 0, "book.hp.ing.boomslang_skin": 0}, "evidence": ["book.hp.ev.private_store"]},
   {"id": "book.hp.route.unlicensed_take", "label": "Take from the private stores without leave", "kind": "unlicensed", "custody": "taken",
    "cost": {"book.hp.ing.bicorn_horn": 0, "book.hp.ing.boomslang_skin": 0}, "evidence": ["book.hp.ev.private_store"]},
   {"id": "book.hp.route.harvest", "label": "Gather fluxweed yourself", "kind": "harvest", "custody": "owned", "cost": {"book.hp.ing.fluxweed": 0}, "evidence": ["book.hp.ev.fluxweed_moon"]}
  ],
  "donorNames": {
   "given": ["Marlo", "Tessa", "Orrin", "Wynne", "Bastian", "Isolde", "Corwin", "Petra"],
   "family": ["Pell", "Harrow", "Vance", "Thorne", "Ashgrove", "Lindqvist", "Marsh", "Dunmore"]
  },
  "outcomes": {
   "canon": {"product": "book.hp.product.polyjuice", "label": "Polyjuice Potion", "status": "stated", "cue": "A heavy, muddy-looking brew with lazy bubbles."},
   "degraded": {"product": "book.hp.product.polyjuice_thin", "label": "Thin Polyjuice-like draught (original degraded)", "status": "original", "cue": "A heavy, muddy-looking brew with lazy bubbles."},
   "original": {"product": "book.hp.product.murky_infusion", "label": "Murky infusion (original)", "status": "original", "cue": "Thin, grey and lumpy."}
  }
 }
};
