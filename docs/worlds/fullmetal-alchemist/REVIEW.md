# World pack review: Fullmetal Alchemist

Reviewer: Claude (independent of the Codex reader, review and synthesis lanes), 2026-10-13. Method: [REVIEW_TEMPLATE](../../gm/dispatch/wiki-lanes-2026-10-13/REVIEW_TEMPLATE.md), plus the coordinator's extra item from [SPOTCHECK_2](../../gm/dispatch/wiki-lanes-2026-10-13/SPOTCHECK_2.md). Read every file in this folder, the fma-full `CHECKPOINT.md` and targeted `NOTES.jsonl` rows, and the r2 review lane's `SUMMARY.md` and `NOTES.jsonl`. Every claim below was checked against the private payload named by `read_file` in `fma_SOURCES.json`. Locators use the form `Title rev @character offset in the payload text`. No pack file was edited.

## Verdict: usable with fixes

The labels, continuity keys, exclusions and first slice are sound, and the pack took in the review lane's repairs. The fixes are needed because one core conflict is misread, and the misreading hides a source-stated rule that changes how alchemy works. The pack calls the Dragon's Pulse a "stated tectonic explanation" set against May's theory. The payloads say something else. Tectonic energy is the claimed source of *Amestrian* alchemy. The Alchemy page says that claim proved false. The Father page says Father can switch Amestrian alchemy off, while alkahestry keeps working. The pack also lists automail time, cost and climate limits as unknown, but the Automail page states them. Both are P3 failures from SPOTCHECK_1: the source states the condition, and the pack lists it as unknown.

## Checked claims

| # | Claim | File | Verdict | Evidence locator |
|---|---|---|---|---|
| 1 | Transmutation has three stages (comprehension, deconstruction, reconstruction) and is limited by knowledge | SYNTHESIS §2 row 1, WORLD_BRIEF | Supported | Alchemy r78024 @1459 to @1856; knowledge as the main barrier @3051 |
| 2 | Matter must match in kind; energy is a separate requirement | MODULE_CATALOGUE, WORLD_BRIEF | Supported | Alchemy r78024 @5601 (Law of Natural Providence), @6048 (energy needed for every transmutation) |
| 3 | Imbalance causes a dangerous Rebound; the threshold is unquantified | SYNTHESIS §2 row 2 | Supported | Alchemy r78024 @6438 to @6750 (too much from too little: mutation, injury or death) |
| 4 | A Stone stores souls, depletes with use, and only appears to bypass exchange | SYNTHESIS §2 row 3, SOURCE_LEDGER | Supported | Philosopher's Stone r78123 @1100 to @1632 |
| 5 | Knowledge, tools, matter, body and permission are separate means | SYNTHESIS §2 row 4 | Supported as a design abstraction | Roy Mustang r77805 @661 (ignition gloves), @6252 (oxygen method); Winry Rockbell r78073 @3757 |
| 6 | The Dragon's Pulse has a "stated tectonic explanation" that conflicts with May's soul theory | SOURCE_LEDGER claim row 4 and Conflicts row 1, MODULE_CATALOGUE | **Misread** | Dragon's Pulse r77465 @524 to @562 calls the Pulse life energy, and says May theorizes souls *rather than* tectonic movement as the source of alchemical energy. Alchemy r78024 @6406 places tectonic energy with western alchemy and says that "turned out to not be true". Father r78035 @6485, @6914 to @7050 says Father's Stone network sits between tectonic energy and Amestrian users and can halt their alchemy, while alkahestry is unaffected because it draws on Earth's chi. The real conflict is between the Alchemy and Father pages over the Amestrian energy source. May's theory is not in conflict with the Dragon's Pulse |
| 7 | Alkahestry is a separate tradition | SYNTHESIS §2 row 5 | Supported, under-sourced | Alkahestry r77622 @1639, @2547 to @2640 (heals mild ailments and minor injuries; long-distance projection through purification circles and markers). The pack never cites the Alkahestry page |
| 8 | A bound soul in a carrier body loses bodily functions; the blood seal is the bond | SYNTHESIS §2 row 6, SOURCE_LEDGER | Supported | Alphonse Elric r77623 @771 to @957, @3142 |
| 9 | Continuity changes core identities (Wrath) | SYNTHESIS §2 row 7 | Supported, thin anchor | Wrath r77280 (a 531-character disambiguation page: Bradley in manga/2009, Izumi's child in 2003); King Bradley r77809 @282 to @348 |
| 10 | Ishval's role differs: manga/2009 Crest of Blood vs 2003 despair-driven Stone attempt | SYNTHESIS §2 row 9, SOURCE_LEDGER | Supported | Ishval r76903 @1424 to @1921 |
| 11 | State office means institutional access, not a power tier | SYNTHESIS §2 row 8, M-State | Supported in part | 2003 overview r75429 @3257 (State certification opens restricted research); Amestris r77354 @5579 (Order 3066 sends State Alchemists to Ishval). Amestris gives little on the office itself; State Alchemist is the better anchor if it exists in the dump |
| 12 | Scar's array covers only the first two stages; reconstruction comes later in the manga/2009 | SOURCE_LEDGER, ABILITY_VARIANTS | Supported | Scar r77728 @6162, @6975 (cannot deconstruct what he does not understand), @9248 (Chapter 103 reconstruction array) |
| 13 | Circle-free use after seeing the Gate "does not establish a general unlock rule" | ABILITY_VARIANTS | **Understated** | Alchemy r78024 @10687 limits circle-free use to those who have seen the Gate and says it cannot be taught; @4107 says alchemy is impossible without a Gate; @15045 says Gate passage grants circle-free use for a bodily toll. That is a stated gate, branch-qualified, not an absence |
| 14 | Automail materials, fitting, price, time and failure are "not established" | SOURCE_LEDGER, MODULE_CATALOGUE, SYNTHESIS §7 | **Contradicted** | Automail r77396 @1838 (costly, painful, may need further amputation), @2447 (about three years of recovery on average, with Ed at one year and Lan Fan at six months; regular oiling and painful reconnection), @3050 (barometric pain, heat discomfort, cold stops the oil and speeds frostbite), @3702 (impairs growth) |
| 15 | May's kunai and prepared circles are bounded tools; she stops bleeding but cannot replace blood | ABILITY_VARIANTS, SOURCE_LEDGER | Supported | May Chang r77825 @545 (infobox: kunai used for alkahestry), @14348 (stops Riza's bleeding, cannot make new blood) |
| 16 | Mustang's flame needs gloves plus an oxygen method, with no numbers | ABILITY_VARIANTS, SOURCE_LEDGER | Supported | Roy Mustang r77805 @661, @6252 to @6353 |
| 17 | Consent and accounting for Stones vary | ABILITY_VARIANTS | Supported | Philosopher's Stone r78123 @3237 (consenting souls give more efficient transmutations); @2821 (Stone contact removes the need for a circle, which the pack missed) |

Rows 1 to 11 cover every SYNTHESIS §2 law. Rows 12 to 17 plus the repair checks below make up the further sample across ABILITY_VARIANTS, CAMPAIGN and SOURCE_LEDGER. CAMPAIGN makes no source claims beyond its citations to the ledger, so there was nothing there to falsify.

## Review-lane repairs and SPOTCHECK_2 misses (coordinator item)

| Item | In the pack? | Verdict | Evidence |
|---|---|---|---|
| R1 Lan Fan's arm was badly injured, not broken | Absorbed. No file says "broken"; SYNTHESIS §9 records the correction | Pass | Lan Fan/History r73778 @4722 |
| R2 No stated origin rule for 2003 Homunculi in the 2003 overview | Absorbed (SYNTHESIS §3, ABILITY_VARIANTS "no universal origin", SOURCE_LEDGER) | Pass | 2003 overview r75429 contains no such rule |
| R3 No stated remover for Gluttony's mark | Absorbed but misworded. SOURCE_LEDGER says "removal of Gluttony's Ouroboros ... flagged as unsupported" | Fix wording | Ouroboros r78131 @3181 to @3208: the 2003 removal *is* stated, along with its effect (dominated by his sin, mindless eating). Only who did it and how are missing |
| R4 Nothing on May's page says Father cannot control the Dragon's Pulse | Absorbed, then over-applied. SOURCE_LEDGER excludes "Father/Dragon's Pulse control claims" from mechanics | Fix | The repair was about the page cited, not the fact. Father r78035 @6914 to @7050 and Scar r77728 @9181 both say alkahestry is immune to Father's alchemy-sealing |
| R5 Paninya's limb tradeoff belongs to another page | Partly absorbed. ABILITY_VARIANTS still cites Paninya r77830 for "fitting, adaptation and maintenance" | Fix citation | Paninya r77830 supports only the per-adaptation limb count (@458 to @532). The tradeoffs are in Automail r77396 (row 14) |
| S1 Manga pocket-watch comparison (2003 overview note) | Not relied on. No file mentions the watch | Pass | If it is ever used, 2003 overview r75429 @3257 says the 2003 watch amplifies alchemy. Treat that as `fma.2003` only |
| S2 Kunai detail taken from the general Alkahestry page (May note) | Not relied on in a harmful way. The pack's kunai rests on May Chang r77825, whose own infobox states it (@545) | Pass | The "remote" effect in ABILITY_VARIANTS should also cite Alkahestry r77622 @2547 |

## Template checks

- **(3) Proposal labels:** pass. Every table row carries "Proposal". May's soul theory is kept as her belief.
- **(4) Continuity:** pass in structure (`fma.manga`, `fma.brotherhood`, `fma.2003`, `fma.milos`, `fma.other`). The fixes in rows 6 and 13 must keep their branch: the Father barrier and the Xerxes-soul energy are manga/2009 only, and the 2003 Gate and energy account is separate (The Gate r72998 in the notes separates them).
- **(5) Sealed secrets:** pass. No changed or randomized truth. The Father, Stone and Ishval reveals are public franchise twists, which AGENTS.md allows, and CAMPAIGN states that no randomized truths exist yet.
- **(6) Raw prose and quotes:** pass. No quoted run of 15 or more words and no copied payload text.
- **(7) Gaps:** honest about primary sources. Overstated in two places: automail and the energy source are listed as open when the wiki states them. SYNTHESIS §1 says Alchemy r78024's Equivalent Exchange section was spot-checked, but the "not true" sentence in that section did not make it into the ledger.

## Fixes in priority order

1. **Energy source and the Father barrier (SOURCE_LEDGER claim row 4 and Conflicts row 1, MODULE_CATALOGUE Alkahestry and Xingese sensing, WORLD_BRIEF).** Restate the conflict. Alchemy r78024 says the tectonic attribution for Amestrian alchemy proved false. Father r78035 calls tectonic energy the source and says Father's Stone network filters it. May's soul theory sits in Dragon's Pulse r77465 as her belief. Add the stated manga/2009 rule that Father can halt Amestrian alchemy while alkahestry, and arrays with an alkahestry base like Scar's, keep working. It changes how dependence on a method is modelled, and how the Promised Day plays.
2. **Automail costs and limits (SOURCE_LEDGER automail row, MODULE_CATALOGUE, ABILITY_VARIANTS, SYNTHESIS §3 and §7).** Cite Automail r77396 and take in the stated surgery and pain, the recovery range (about three years, six months at the fastest), the maintenance-and-reconnection loop, climate penalties and the growth impact. The Rush Valley campaign and the "automail repair under deadline" interaction are built on exactly these numbers.
3. **Gate-gated circle-free use (ABILITY_VARIANTS).** Replace "does not establish a general unlock rule" with the stated manga/2009 gate: Gate passage, a bodily toll, and no teaching route. 2003 stays separate.
4. **R4 over-exclusion and R3 wording (SOURCE_LEDGER Conflicts row 3).** Re-admit "alkahestry is unaffected by Father's barrier", citing Father and Scar. Rewrite R3 so the 2003 removal and its effect are kept, and only the remover and method stay unknown.
5. **Citations.** Move the automail-tradeoff citation from Paninya to Automail. Add Alkahestry r77622 for healing limits and long-distance projection. Consider State Alchemist or State Military pages over Amestris for the office row.

## What the notes and payloads support but the pack missed

- Philosopher's Stone contact removes the need for a circle (r78123 @2821), and consenting souls work better (@3237). Both are direct inputs to the Stone and emergency interaction.
- Father's flask stage: the being has knowledge but cannot perform alchemy, and the flask keeps it alive (Father r78035 note, True Form). It is a clean carrier-and-vulnerability example for the soul-carrier module.
- The Gate page note separates the manga/2009 and 2003 Gate, toll and energy rules, and says each person sees a different engraving (The Gate r72998). The pack's Gate content depends on Edward's page alone.
- Sensing several souls in one body is described as unsettling, and Xingese sensing finds homunculi and Stones (Dragon's Pulse r77465 @1758). This gives the sensing module a concrete detection target.
- Alkahestry spread from Hohenheim's Xerxes teaching (Alkahestry r77622, History). This is useful for knowledge-provenance rows.

## Fixes applied

1. **Energy source and Father barrier.** Corrected the conflict to Alchemy r78024 versus Father r78035 for manga/2009 Amestrian alchemy; kept May's soul-origin account attributed as her theory and separated the 2003 Gate/energy account. Added the branch-specific rule that Father can halt Amestrian alchemy while alkahestry and Scar's alkahestry-based array remain effective. Files: SOURCE_LEDGER.md, MODULE_CATALOGUE.md, ABILITY_VARIANTS.md, WORLD_BRIEF.md, SYNTHESIS.md.
2. **Automail costs and limits.** Added the stated costly and painful surgery, recovery range, oiling/reconnection, climate penalties and growth impact. Corrected the Paninya citation to limb count per adaptation only. Files: SOURCE_LEDGER.md, MODULE_CATALOGUE.md, ABILITY_VARIANTS.md, SYNTHESIS.md, CAMPAIGN.md, INTERACTIONS.md.
3. **Gate-gated circle-free use.** Replaced the absence claim with the manga/2009 Gate passage and bodily toll gate, noted the no-teaching rule, and kept 2003 separate. File: ABILITY_VARIANTS.md; SYNTHESIS.md records the branch rule.
4. **Gluttony and barrier wording.** Preserved the 2003 mark-removal result and effect while leaving remover/method unknown; admitted the sourced alkahestry resistance claim with Father and Scar citations. File: SOURCE_LEDGER.md; ABILITY_VARIANTS.md also records the branch-specific rule.
5. **Citation repairs.** Added Alkahestry r77622 for healing bounds, remote projection and Xerxes teaching; used State Military r76667 for State Alchemist certification; moved automail tradeoffs to Automail r77396. Files: SOURCE_LEDGER.md, MODULE_CATALOGUE.md, ABILITY_VARIANTS.md, SYNTHESIS.md.
6. **Missed supported rules.** Added Stone contact and consent effects, Father's flask-stage carrier/vulnerability example, differing Gate engravings by person, Xingese sensing of nearby life and multi-soul vessels, and alkahestry's Xerxes teaching provenance. Files: SOURCE_LEDGER.md, MODULE_CATALOGUE.md, ABILITY_VARIANTS.md, SYNTHESIS.md.

No review-listed fix was declined. All changes remain labelled proposals and source-qualified; no sealed truth was added.
