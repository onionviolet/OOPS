# Harry Potter pack: one pinned canon potion (Polyjuice)

2026-10-22. Lane S3 of the three-way crafting journey (S1 potion, S2 armor, S3 this).
**PROPOSAL until Weibao plays it.** Nothing here changes direction; it applies
[P9 HP profile](../procgen-2026-10-13/p9/HARRY_POTTER.md) and
[CRAFTING_ENGINE Round 2](../../CRAFTING_ENGINE.md) (GT2 exact formula, OV1 free mixing).

Rule codes: AR1-AR3, AR6, AR14, AR16; MR1-MR7, MR13, MR26, MR27, MR29-MR36; WA1-WA3,
WA9-WA11, WA21; GR1-GR12 (draws are saved, never re-derived); AD1, AD3, AD5-AD8, AD33,
AD36, AD38; HP-SEAL-1 and the sealed-secrets rule; UR1-UR49 (desktop 1920x1080 first,
mobile deferred).

## Source qualification (evidence labels per P9 PROFILE_RULES)

Re-read 2026-10-22 from the private seven-novel extraction (B2 text sha256
`18c33156efa5...`, primary checkout `docs/research/novels/harry-potter/source-preparation-2026-10-11`),
bounded windows only. Nothing copied; the pack stores IDs, page locators, speaker
and a short paraphrase. Attribution J.K. Rowling. This **replaces** the earlier plan
to ship a "qualified subset": the recipe window names all six physical inputs.

| Pack fact | Evidence | Locator (extraction page tag) |
|---|---|---|
| Lacewing flies, leeches, fluxweed, knotgrass, powdered bicorn horn, shredded boomslang skin, a bit of the person | stated (Hermione reading the book) | B2:PDF-p432 |
| First four are in the student store-cupboard and may be taken | stated | p432 |
| Horn and skin are not in the student cupboard; only the Potions master's private stores | stated (Harry), narrator | p432, p454 |
| Personal bit goes in last | stated | p432 |
| Fluxweed picked at full moon; lacewings stewed 21 days; about a month in all | stated | p433 |
| Finished batch looks like thick dark mud bubbling slowly | shown | p486 |
| Change lasts exactly an hour; wears off | stated | p486, p427 |
| Three glasses, a sample dropped into each, each takes a colour | shown | p486 |
| A cat's hair gave animal features; potion not for animal changes; weeks in the hospital wing | shown / stated | p498, p499, p504 |
| Dried nettles / snake fangs (decoys for free mixing) | shown, via CANON_CRAFT_WORLDS H01, **not re-read** | B1:p111 |

**Gaps (reported, not filled):** quantities and heat regime; accepted sample types and
ageing; effect of wrong order or interrupted stew; whether a legitimate retail supplier
exists (the supplier route is ORIGINAL); chapter numbers in the extracted edition may
differ from other editions (page tags are the locator); B1 decoy row and PS ch8 not
re-read. All stage times after brewing, vessel wear, lots, prices, loans, notice
chances, donors and the degraded/failed outcomes are ORIGINAL and labelled in
`native.originals` (MR13). No HP secret is authored: HP-SEAL-1 has no world-owner
route yet, and per-lot hidden provenance is ordinary MR1 truth, not a sealed secret.

## Journey (one slice, as built)

1. **Obtain.** Owners and access rules (MR27): student store-cupboard (free, finite,
   hidden fluxweed provenance), market stall (cheap, unverified), trusted supplier
   (paid, may sell ready-stewed lacewings), own fluxweed harvest (provenance is the
   game's actual moon at gathering, witnessed), and for horn and skin the Potions
   master's loan (falls overdue, repay in coins) or taking without leave (may be
   noticed days later). A paid assay reveals a lot's, sample's or batch's truth.
2. **Prepare and brew.** Stew lacewings 21 game days (partial days survive reload),
   or buy them ready-stewed. Powder the horn and shred the skin (fine/coarse and
   fine/ragged variants with distinct IDs; coarse is a near miss). Six formula slots
   take any lots (free mixing); the cauldron simmers two game days and wears.
3. **Resolve (MR6/MR7/MR35).** Exact formula: canon Polyjuice. Near miss (under-stewed,
   coarse prep, worn cauldron): labelled degraded draught, half the stated hour.
   Anything else: labelled original murky infusion, inert. The panel calls a batch
   "Unidentified brew" until drunk or assayed; claims on lots never rewrite truth.
4. **Use.** Three doses per batch. The sample goes into a glass, not the cauldron
   (shown, p486). Consent sample or hairbrush sample (may be another donor's, may be
   a cat's). Canon binds the real donor for an hour.
5. **Lasting consequence (saved).** Aftermath ledger; donor trust if a brush sample
   was recognised; animal features for 14 game days after a non-human hair; master
   standing from overdue loans or noticed theft; purse and consumed lots.

## Host seam and effort

- Pack: `src/world_packs/book_hp_pack.js`, plain data in the existing manifest
  format, formula and tables in its `native` block; one line added to
  `BUNDLED_WORLD_PACKS` (the P2 registry, AR2).
- Runtime: new domain `hp_brewing` registered through `registerDomain` (own save
  slice, absent until Begin so saves stay byte-identical, `tick` settles from the
  played clock, a panel through `definePanel`). It takes no native items or money.
  Hot-file touches: `ui_extras.js` import line (the existing domain aggregator, so
  `save_files.js` is untouched), `gameTime` added inside the existing ports object in
  `main.js` (zero net lines), one `layout_spec.js` surface entry, and the registry
  line above. The moon is the game's own (`Game_Time.getMoonPhase`), not a second one.
- New files: pack, `hp_brewing_resolver.js` (pure), `hp_brewing_state.js`,
  `hp_brewing_domain.js`, `hp_brewing_panel.js`; tests `world_pack_hp.test.js`,
  `hp_brewing.test.js`.
- Not touched: `craft_content_frontier.js`, `crafting_frontier_runtime.js` (S1),
  `gear_workshop_*` (S2), `items.js`, `material_lineage.js`, `processed_materials.js`,
  `story_requests.js`. No commission system.
- Effort: about 1,200 lines including tests and pack data. Prototype entry: a
  "Begin" button, because there is no playable HP world to arrive in; this is a
  labelled slice, not an HP world.

## Verification plan (AD36)

Failure scenario first: (a) wrong-provenance fluxweed must not make Polyjuice, (b)
a stale label must not rewrite sample origin, (c) reload mid-stew keeps elapsed
days, (d) literal Import reproduces the same truth. Focused: pack lint/load,
resolver table (exact / near miss / free mix, MR35), state validation, determinism
after save/reload. Gates: `npm run build && npm test`, `check:arch`, `check:rules`.
Browser: fresh origin, 1920x1080, headless, Save, reload, Export, literal Import.

## Verification record (2026-10-22, nothing committed)

| Check | Result | Input identity / limit |
|---|---|---|
| `npm run build && npm test` | 2540 pass, 0 fail | After the last source edit (preview-neutral assay/drink quotes, cue rewording); includes `tests/hp_brewing.test.js` (18), `tests/world_pack_hp.test.js` (6), updated registry test, `ui_contract` surface entry |
| `npm run check:arch` | pass; main.js 10274 (baseline 10310), save_files.js 310 unchanged | `check:rule-behavior` not run: no rule file changed |
| `npm run check:rules` | PASS, 0 warnings | |
| Headless journey `scripts/playtest/hp-polyjuice.mjs`, 1920x1080, fresh context, private port, no window | PASS (8 checks) on final code | Canon path with a consent sample and a bought ready-stewed lacewing lot; Save, reload (mid-stew and mid-effect), Export, literal Import reproduce the slice byte for byte; 21 pre-existing 404 console lines from the fixture host, no page errors |
| Same journey with `HP_FULL_STEW=1` (own 21-day stew through the real clock) | PASS | Ran on the build before the preview and wording fixes; stew path unchanged since |

**Implemented-unverified (unit-tested only, not played in a browser):** degraded and
original batches, cat-hair animal path and recovery, mixed-donor brush samples, loan
overdue and unlicensed notice, market stall, assay, scour, free mixing with decoys.
**Not verified:** joined native money (the slice purse is separate), any player
acceptance, UI polish beyond spacing, the B1 decoy evidence row, mobile (deferred).
The panel is listed for every save as a labelled prototype entry because no HP world
exists to arrive in. `npm run build` rewrote `dist/` and the `index.html` version
string; these are build artifacts and must not be staged.
