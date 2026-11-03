# Lord of the Mysteries combat deep dive: open scale, band axes, fight window (2026-11-03)

**Proposals just.** Nothing here is accepted; no code, `PROJECT.md`, `USER_VISION.md`, rules index, content window or pack was edited. Builds on L1 (branch `claude/l1-band-table-cf51b5`, commit 87b08418, `src/book_world_lotm_bands.js`, L1 receipt (`L1_IMPLEMENTATION_RECEIPT.md` on that branch)). Applies WA33, WA43, WA50, AD38, AD49, WPR5 and Weibao's steer that the 0-10 scale is no limit and the ordinary adult at 2 is arbitrary. Codes `LCF` (finding), `LCT` (calibration target), `LCD` (default and dial), `LCR` (risk), `LCQ` (question), `LCB` (build row) are local to this file and avoid the CBC/CBX/CBL/CBR prefixes of the [combat core audit](../../../audits/COMBAT_CORE_AUDIT.md).

**Evidence.** Paragraphs were read in the official English Webnovel EPUB (`private/source/en/lotm_en_webnovel_official.epub`, extracted to scratch). Locator form `en vV chN Pnnn` uses the EPUB's own "Chapter N" numbering (the file names run four ahead of it; I re-keyed every locator through `nav.xhtml` and checked one against the kj3q receipts). Text is paraphrased here; the short verbatim anchors are in the shared notes folder (`lotm-combat-anchors.md`), not in git. Labels: S shown, T stated by a character, I inferred, W wiki. Every number below is an authored proposal (WPR5/AD49), not a canon claim. Chapters past about 54 are late-source (WA50 "as of"); they calibrate the scale but are not lead-window facts, and sealed truths stay out (public franchise structure just).

## 1. What I found (LCF)

- **LCF1. The book states fight outcomes as ratios and gates, not stats.** There is no numeric strength anywhere I could find. What exists: a gun beats a low-Sequence Beyonder (T), a Seq 6 body needs about five revolver hits in one spot (T), Seq 8 and 9 are "just slightly stronger than ordinary people in certain aspects" (T), and the 5-to-4 and 3-to-2 steps are qualitative breaks that skill cannot bridge (T). Those support a log scale plus tier gates, not a single linear number.
- **LCF2. L1's values read too strong against the book once the reference is subtracted.** L1 rows (Tyrant 9: 4,4,4,5 against reference 2) are +2 on every axis, which contradicts "slightly stronger in certain aspects" (LCT3). Not a defect in the idea; the table is a first proposal and should be re-based (LCB2).
- **LCF3. No paragraph states Seq 9 against several ordinary people.** Searched for crowd, gang, guard and police fights with a Sequence named; none found in v1-v3 hits. Do not invent it. The closest anchors are LCT2 (one trained man, thrown easily by a Seq 8) and LCT3. Carry as a gap (LCQ1).
- **LCF4. The three open cast people resolve from the text.** Dunn Smith is a Darkness-pathway Nightmare (Seq 7, "close to Seq 6" by the time of the Sealed Artifact scene), Leonard Mitchell a Midnight Poet (Seq 8), Old Neil a Mystery Pryer of the Hermit pathway (Seq not stated in the paragraphs read). Dates matter: these are as of v1 ch101-210; Leonard and Dunn advance later. The L1 `LOTM_CAST_SUBJECTS` open floors can be replaced by dated rows (LCB3). Check the [knowledge protection design](LOTM_KNOWLEDGE_PROTECTION_DESIGN.md) before surfacing later sequences to a lead-window player.
- **LCF5. The ability file already has the right shape for items, residue and drawbacks.** `book_world_lotm_abilities.js` rows are command + cost + condition + drawback price and a hostile runs the same records as the player. The band must feed those, not replace them (LCD5).
- **LCF6. The fight seam exists.** `tempo_fight.js` already imports `combat_math` (`rollCombatStrike`, `mitigateCombatDamageFromStats`), `damage_types.typedHit`, `conflict_frame`, location, exit and ally modules; L2a/L2b made its card and health path honest. A fight window should feed that path with derived stats, not add a second engine (LCD6).
- **LCF7. Pathway naming is split.** `lotm_formula_rows.js` keys 12 pathways with partial ladders; L1 uses Tyrant, Death, Fool, Visionary, Door. The deep dive's table lists all 22 pathways with Seq 9 to 1 names (`PATHWAYS_DEEP_DIVE_2026-10-10.md`, gitignored area). Dunn and Leonard sit on "Darkness", which has no formula row yet. Use the deep dive's pathway keys as the band table keys and map to formula keys.

## 2. Calibration targets from the book (LCT)

Each is an inequality a test can assert later. Dates are the chapter.

| Code | Stated outcome | Locator | Label | What it fixes |
|---|---|---|---|---|
| LCT1 | A low-Sequence Beyonder's power is no match for guns; Beyonder powers are more fascinating and harder to defend against than firearms. | en v1 ch19 P008-P009 | T (Dunn) | Revolver downs Seq 9-8 in a few hits; toughness at 9-8 stays small. |
| LCT2 | A Seq 8 Clown throws a boxing-trained ordinary man with inertia, using no extra strength, in one exchange. | en v2 ch270 P006-P012 | S | Seq 8 control axis beats trained adult at least about nine times in ten, and wins without spending the strength axis. |
| LCT3 | Seq 7 is the threshold where a Beyonder stops being just slightly stronger than ordinary people in certain aspects. | en v2 ch295 P037-P038 | T/S (narration) | Seq 9-8 gaps are small and aspect-specific; the big jump begins at 7. |
| LCT4 | A Seq 6 Chained "Zombie" says a revolver shot to the head just dazes; about five hits on the same spot break his defence, and other damage is not lethal unless the brain goes. | en v2 ch331 P028-P031 | T (Maric) | Seq 6 body toughness is about five times the reference adult's hits-to-down. |
| LCT5 | Silver demon-hunting bullets (Beyonder items) tear through a transformed Beyonder's head at close range; Beyonder-power-treated ingredients keep effects, ordinary ones decay. | en v1 ch74 P035; ch103 P074; ch186 P024 | S/T | Item-class ammunition ignores part of the wielder band; items are fixed magnitudes. |
| LCT6 | A Seq 7-or-higher Demoness-sect woman dodges a Seq 8 Clown's revolver shots by moving before the trigger and fights beside a controlled Seq 9 teammate; the Nighthawks judge a three-person team needs a Sealed Artifact to act. | en v1 ch196 P035; ch198 P081-P086 | S/I | Two notches of speed and perception beat a trained gunman; fair fights at tier 2 need items or numbers. I have read just to P088 of ch198, not the resolution. |
| LCT7 | Between Seq 5 and Seq 4 there is a qualitative difference no battle skill or execution bridges: a normal human with special powers against a legendary creature with godhood. | en v3 ch589 P003-P004 | T (narration) | Tier gate at 4. |
| LCT8 | Godhood begins at Seq 4 and evolves to Seq 2; angels and saints differ qualitatively; becoming truly powerful needs Seq 2 or a Grade 0 Sealed Artifact. | en v3 ch705 P025; en v6 ch1203 P030-P031 | T | Tier gates at 4 and 2; Grade 0 artifacts count as a gate bypass. |
| LCT9 | Borrowed power closes gaps: a Spirit Body reinforced by two items is "essentially Seq 6" and survives a blow that would otherwise kill; a Seq 4 demigod is finished in under ten minutes by a Seq 5-level actor holding the Fool's backing. | en v3 ch548 P019; en v5 ch1056 P045-P046 | S | Items and blessings add notches temporarily and can cross a gate once; spend them. |
| LCT10 | Initiative and preparation decide: an ambusher with prepared Air Bullets shatters a silver-armoured bishop; a demigod side that has lost the initiative declines to pursue. | en v2 ch308 P045; en v5 ch1002 P039 | S/T | Preparation is a first-class fight input, worth about as much as a tier of notches. |
| LCT11 | Pathways differ by aspect: Sleepless-line Beyonders see just faint auras with Spirit Vision; a Seer reads them precisely. | en v1 ch172 P006-P007 | S | Per-axis leans, not one shape; perception is a pathway-specific axis. |
| LCT12 | Seq 4 beings are the upper echelon of any faction and not easily killed; a sequence gap in the 4-and-above range shows as one demigod defeating another in minutes. | en v6 ch1204 P035; en v5 ch1056 P045 | T/S | Above the gate, numbers order same-tier exchanges just. |
| LCT13 | After a night shift the Midnight Poet and Sleepless stay alert while an ordinary-level Klein is exhausted. | en v1 ch109 P060-P061 | S | Darkness-line endurance is its own lean; endurance is not strength. |

Gaps: Seq 9 against several ordinary people (LCF3); a gun against a Seq 5 or higher; what a Seq 7 does to a trained soldier unit. Tag these `open` in the table, not guessed.

## 3. The open scale (LCD1, answers question 1)

- **LCD1. Notches on a log scale, reference adult at zero.** Every axis value is a signed count of notches `n` (half notches allowed) relative to a reference adult at 0. A child, a frail or an exhausted person can be negative. One notch multiplies effective magnitude by a gain `g` (dial, default 1.5, set by LCT4). There is no maximum and no minimum, so a Seq 0 or a monster adds notches without a redesign.
  - Reason: LCT4 is a ratio (about five hits against one), and `1.5^4` is about 5.06, so Seq 6 body toughness is +4. Ratios compose by adding notches, which suits damage against toughness, speed against speed, and item bonuses (+n).
  - Dial: `g` between 1.3 and 2. A larger `g` makes Seq 9 more dominant; check LCT1 and LCT3 before moving it.
- **LCD1a. Hits-to-down is the unit of toughness.** One revolver head hit downs the reference adult (so `revolver force = 0`, `reference toughness = 0`). Hits-to-down for a target = `g^(toughness - force)`, floored at one. Armour and item bonuses add notches. This ties the scale to the stated gun outcome (LCT1, LCT4) and to `mitigateCombatDamageFromStats` without renaming its inputs.
- **LCD1b. Contests use a logistic on the notch gap.** Chance the higher side wins an exchange = `1 / (1 + e^(-k*delta))` with `k` default 1.1, giving about 0.90 at +2 notches and about 0.99 at +4. Set by LCT2 and LCT6. Dial: `k`, per world.
- **LCD1c. The Sequence curve on the signature axis.** Default: +1 per Sequence from 9 (+1) to 5 (+5) for a pathway's signature axes (LCT4 pins Seq 6 at +4), and at most +1 on non-signature axes at 9-8 (LCT3). Gates add to this at 4, 2 and 0 (LCD3). Numbers above Seq 5 just order exchanges within one tier, so they can stay coarse. This replaces the L1 offset of 2 and removes the 0-10 ceiling.
- **LCD1d. The reference adult is a label, not a number.** Calibrate the zero to LCT1-LCT4; `BAND_SCALE.referenceAdult` becomes a migration shim (L1 values minus 2) and then goes (LCB2).

## 4. Tiers and gates (LCD3)

- **LCD3. Grade is a separate ordinal from the notch count.** Grade 0 ordinary, 1 for Seq 9-8, 2 for Seq 7-5, 3 for Seq 4-3 (demigods and saints), 4 for Seq 2-1 (angels), 5 for Seq 0. The deep dive's L1 line groups the tiers this way; LCT3, LCT7 and LCT8 give the breaks at 7, 4 and 2. A Sealed Artifact has a grade too (Grade 0 artifacts rank with Seq 2 and above, LCT8).
- **Gate rule (default and dial).** An effect carries its source grade. A target at a higher grade takes a *category defence*: the effect works at reduced notches (default -3 per grade of difference) or not at all if it needs a target's cooperation (illusion, divination, possession). Two or more grades above, default immune. Dial: the reduction per grade, per effect kind.
- **What bypasses a gate (AD38: by mechanism).** A borrowed or sealed source of higher grade (LCT9), a prepared ritual or ambush (LCT10), a pathway nemesis (Beyonder bullets against spirits, LCT5), an item that raises the wielder's effective grade for a time (LCT9), a target made helpless (asleep, bound, unaware). Each costs something (spirituality, a charge, an exposure, a residue condition).
- **Reason.** LCT7 says skill cannot bridge it. Modeling the gap as extra notches would let a large crowd or a skilled fighter beat a demigod by arithmetic; a gate says why that fails and what would work.

## 5. Axes per pathway (LCD2, answers question 2)

- **LCD2. Eight axes in three groups; each pathway has a lean, not two shapes.** Body: strength, speed, toughness, endurance. Mind and sense: perception (includes Spirit Vision quality, LCT11), spirituality (pool and resistance to curses and mental effects). Reach: force (damage projected through powers or tools) and control (effects on other people, places or fate). A pathway row is a *lean*: signature axes (sequence curve applies in full), supporting axes (+1 notch below signature) and weak axes (reference or below). The two L1 shapes are the extreme leans.
- **Reach kinds (the gate's "effect kind").** physical, spirit-world, mental, fate and probability, space, law and order, environment (storm, fire, light), life and death. Used by the category defence and the nemesis list.
- **Non-Beyonders.** Ordinary people keep band 0. A weapon is a fixed magnitude on the same scale (LCD4), not part of the wielder. Training adds up to +1 to +2 notches on one axis (trained boxer against a Seq 8 control axis, LCT2).
- **Evidence for the leans.** Source is the Pathways Guide cards (`private/guide-gallery-2026-10-30/pathways_guide.jsonl`) (stated, OCR'd summaries), the ladder names, and the sequence abilities already in the repo. All leans are `I` until a paragraph for the first rungs is pinned; Tyrant, Sun and White Tower have no guide card in the OCR set I read.

| Pathway | Signature axes | Supporting | Weak | Reach kinds | Anchor |
|---|---|---|---|---|---|
| Fool | control, perception | speed, spirituality | strength, toughness | mental, fate, spirit-world | LCT2, LCT11 |
| Error | control, perception | speed | strength | mental, fate, law | guide card, I |
| Door | control, force | speed, perception | toughness | space, spirit-world | guide card, I |
| Visionary | control, spirituality | perception | strength, toughness, endurance | mental | L1 rows, I |
| Sun | force, endurance | spirituality | speed | environment (light), spirit-world nemesis | LCT5 (Sun bullets) |
| Tyrant | strength, force | toughness, endurance | control | environment (storm, sea) | L1 rows, I |
| White Tower | perception, control | spirituality | strength | mental, law | ladder names, I |
| Hanged Man | spirituality, force | endurance | speed | life and death, mental | guide card, I |
| Darkness | spirituality, endurance | perception (faint), control | strength | mental (dreams), spirit-world | LCT11, LCT13 |
| Death | spirituality, toughness | strength | speed | life and death, spirit-world | L1 rows, guide |
| Twilight Giant | strength, toughness, speed | endurance | control | physical, spirit (holy light) | guide card, I |
| Red Priest | speed, strength | force | spirituality | physical, environment (fire), mental (provoke) | guide card, I |
| Demoness | speed, control | force | toughness | fate (curse), space (threads) | LCT6 |
| Paragon | tools-weapon force, perception | toughness (gear) | speed | physical (items) | guide card, I |
| Hermit | spirituality, perception | control | strength | spirit-world, fate | guide card, I |
| Mother | endurance, spirituality | toughness | speed | life and death, environment (earth) | guide card, I |
| Moon | endurance, speed | strength | control | life and death | guide card, I |
| Black Emperor | control | spirituality | strength | law and order | guide card, I |
| Justiciar | control, force | perception | speed | law and order, mental | guide card, I |
| Abyss | strength, perception | toughness | control | physical, mental (desire) | guide card, I |
| Chained | toughness, strength | spirituality | control | life and death, physical | LCT4 |
| Wheel of Fortune | control | perception | strength | fate | guide card, I |

- **LCD2a. Sequence overrides just where a paragraph states one.** The generic curve (LCD1c) covers the other rows. A per-sequence row exists for a stated anchor (Maric as Chained Seq 6, LCT4; Dunn and Leonard from LCF4), with a locator. This keeps 22 leans plus a handful of anchored rows rather than 220 invented rows.
- **LCD2b. Sequences 9 to 0 for every pathway.** The ladder names (Seq 9 to 1) are in the deep dive; Seq 0 is the pathway's single seat (deep dive L5). Bands for 4 and below are `open` until a paragraph or the player's own meeting needs them (Open: LCQ2), because above the gate numbers just order same-tier exchanges.

## 6. Combining bands, abilities, items, spirituality, conditions and drawbacks (LCD4-LCD5, question 3)

- **LCD4. One resolver, four inputs, no stacking pile.** The fight window computes for each side: (1) band notches per axis, (2) item and ability notches, (3) conditions (residue, wounds, exhaustion), (4) preparation and initiative. Items and weapons are fixed magnitudes on the same scale, added to the wielder's relevant axis; item bonuses cap by their own grade (a Grade 0 item ranks as Seq 2 and above, LCT8). Mundane revolver: force 0. Demon-hunting bullet: force +1 against spirit-world beings, ignores the nemesis target's toughness bonus (LCT5; dial per bullet type). Silver armour or a Spirit Body reinforced by two items: +n toughness, reaching "Seq 6 effective" for the rule that item grants (LCT9).
- **LCD5. Abilities consume spirituality and add a temporary notch, with their drawback as a condition.** An ability row (existing `ROWS` in `book_world_lotm_abilities.js`) already has a cost and a condition drawback. Add two fields: the axis it raises and by how many notches for how many minutes, taken from its looks and descriptions (Rage burst: strength and speed +1 for the effect duration; Grave strength: strength +1; Cold ward: environment resistance). Spirituality is a pool; spending it also lowers the spirituality axis for resistance until it recovers. Residue conditions then lower the axis they name. No new meter: reuse the faculty development and `masteryBands` cost scaling noted in the B2/B3 round.
- **Conditions and drawbacks as notches.** Pallor, rage residue or exhaustion subtract notches from an axis for their minutes (default -1; a harm-state stage of the L9 harm domain can add its own). Loss of control is a gate, not a notch: it ends the window and hands to the L9 harm outcome row (`lostControlOutcome`).
- **Believed and used abilities.** An ability's *look* (concealed) tells observers it was used; this is the same record that WA50 uses for what an observer knows (LCD7).
- **Gate for effects.** An ability has a reach kind and source grade (LCD3). The resolver picks the lower of band-based and gate-based result. A Seq 7 mental effect on a Seq 4 target fails or works at -3 notches per grade; a bypass is a stored cost (ritual, artifact charge).
- **Order of resolution (default).** (a) Initiative and preparation set who has the first exchange and which bypasses are armed (LCT10). (b) Gate check per effect. (c) Notch gap per axis through the logistic (LCD1b). (d) Hits-to-down and damage kind through `mitigateCombatDamageFromStats` and `typedHit`. (e) Costs, residue conditions and harm accrual (existing `accrueHarm`). Every step writes a line to the fight log for the card.

## 7. Shown, believed and actual strength (LCD7, question 4)

- **LCD7. Three bands per person, one actual.** `actual` is the table row. `shown` is what the person lets observers perceive (concealed looks, a weapon, a stance, an item). `believed` is what each observer holds, a per-observer record with an evidence label and a date. A fight window reads `actual` for resolution and `believed` for what the player is told: odds words, the card's opponent description, a retreat suggestion.
- **Why.** The book repeatedly separates them: Seq 8 and Seq 9 are weaker than outsiders imagine (LCT1); a Fool's Beyonder-level observers read concealed marks; Klein is judged by his appearance. Level differences can be read by high-Sequence observers (late-source; `chN` anchors exist for an admiral and for Beyonder-aware observers, en v5 ch996 P067-P073, I). Default: observers of lower grade cannot read exact sequence; same or higher grade read a coarse tier; Spirit Vision and divination get a pathway-specific read (LCT11).
- **Mechanism.** The existing `lotmReveal` observer table already decides who sees a concealed look. Extend it, not a new system: a seen look raises the observer's `believed` tier by one step; a displayed weapon raises believed force; a lie ("I am a clerk") sets `believed` at the persona's tier. Misbelief is an input to initiative (LCD4): a side that wrongly believes the other is weaker loses the first exchange (dial).
- **Do not persist `believed` as truth.** It is per observer and per date (WA50 "as of"); the actual band stays on the person row.

## 8. The fight window (LCD6, question 5)

- **What it is.** A derived record built when a hostile or cast person meets the player in a fight: `{id, band(actual), shown, believed, grade, items, abilities, conditions, preparation, tierGate}`. It is not stored; it is computed from the person's pathway and sequence (the L1 row), the cast sheet and the live state, then handed to the existing tempo fight path as stats and move offers. `fightWindow(id)` from L1 grows from `{ok, band}` to this record.
- **What refuses it (default, with reasons).**
  1. No band: an unknown pathway or an unknown person stays a card (L1 behaviour). Reason: AD49, no guessing.
  2. Band is `open` and the fight would be lethal: allow a *skirmish card* with the open floor (L1's generic Beyonder), but not a to-the-death window. Dial: the lethal threshold.
  3. Gap beyond a gate with no bypass armed: the window opens just as an *escape or negotiation* scene (the player may run, yield or bargain), not a damage race. Reason: LCT7/LCT12, the book treats these as non-contests.
  4. Late-source person outside the lead window (spoiler and knowledge protection): refused until their row's `valid from` date has passed, or the cast sheet marks them available.
  5. The player has no resolved band or is in a harm stage `lost`: the window defers to the L9 outcome row.
  A window also refuses when the person's pathway is known just from a late-source fact the lead cannot have (protects the `valid from` date).
- **Build order inside the seam.** Window record and band migration first; resolver in a new pure module that returns stats and log lines; tempo path consumes it behind one flag; UI shows odds words from `believed`, with the actual notches kept off the card by default.

## 9. Risks and open questions

- **LCR1. Tuning `g` and `k` on two data points.** LCT4 (about five hits) and LCT2 (0.9 at +2) pin them loosely. Mitigation: keep them dials; tests assert inequalities (LCT1-LCT4), not exact numbers.
- **LCR2. Gate rules can make a Sequence-5-versus-4 scene a pure loss.** That matches the book (LCT7), but a game window should still offer play: escape, bargain, bypass. A refusal must lead to a scene, not a dead end.
- **LCR3. L1 rows and the cast sheet disagree on pathway keys** (Darkness has no formula row; Chained, Hermit and others lack band rows). Use the deep dive's 22 keys as authority and map to formula keys.
- **LCR4. Late-source leakage.** Higher-Sequence anchors (LCT7-LCT12) come from v3-v6 and are calibration just; do not put their names or plot in player-facing text at the lead window.
- **LCQ1. Seq 9 against several ordinary people.** No stated paragraph. Proposal: hold the LCT2/LCT3 result (one trained man easy, a group is a real fight) as the default and mark `open`. Needs a text pass in v1 ch100-210 (the Nighthawks' first lethal scenes) if Weibao wants it nailed.
- **LCQ2. Seq 4 and below bands.** Just the gate is calibrated. Proposal: leave `open`; fill from the first scene the player reaches.
- **LCQ3. Old Neil's Sequence.** Pathway read from the text (Hermit, Mystery Pryer); Sequence unstated in the paragraphs I read. Keep `sequence: open` with the pathway known.
- **LCQ4. Is Madam Sharon's tier needed?** The Nighthawks think she is above Seq 7 (ch196 P035) and the resolution after ch198 P088 is unread. Read it before using LCT6 as a hard test.

## 10. Ranked build list (question 5: order of slices)

Level = suggested capability; effort S/M/L. Every row ends at AD43's floor or is labelled below it. No row changes accepted direction.

| Rank | Code | Build | Level | Effort | Done check |
|---|---|---|---|---|---|
| 1 | LCB1 | **Calibration test file.** `tests/lotm_calibration.test.js` asserts LCT1-LCT4 as inequalities over the notch formulas (hits-to-down for Zombie about 5, Seq 8 beats trained adult at least 0.9, Seq 9-8 non-signature at most +1, revolver downs Seq 9 in at most 3 hits). Pure functions just. | sonnet | S | Focused test passes; each LCT code appears in a test name with its locator. |
| 2 | LCB2 | **Re-base L1 to notches.** Replace `referenceAdult: 2`/`BAND_SCALE` with the notch definition (LCD1), convert the ten rows (minus 2, then clip non-signature to at most +1), add the gain and logistic dials in one `BAND_DIALS` object, keep the evidence `I` labels. | sonnet | S | `tests/lotm_bands.test.js` updated; LCB1 passes against the new values; no 0-10 ceiling anywhere (grep). |
| 3 | LCB3 | **Pathway key map and leans for 22 pathways.** Table of leans (section 5) keyed to the deep dive's pathway names, with a map to formula-row keys; sequence curve function; dated cast subjects for Dunn (Darkness, Nightmare), Leonard (Darkness, Midnight Poet), Old Neil (Hermit, open seq). | sonnet | M | `bandFor` returns a band for any of the 22 pathways at Seq 9-5; Dunn, Leonard and Neil subjects replace the open floors; unknown stays `no_band`. |
| 4 | LCB4 | **Gate module.** Grade function, category defence, bypass list with costs (LCD3), pure and tested against LCT7-LCT9. | sonnet | M | Test: Seq 5 mental effect on Seq 4 fails without a bypass and works with an armed ritual; Grade 0 artifact outranks Seq 2. |
| 5 | LCB5 | **Ability and item notches.** Add `axis`/`notches`/`reach` fields to the ability rows (existing four hostile pathways first), item magnitude table (revolver, demon-hunting bullet, silver armour, Spirit Body item), condition subtraction table. | sonnet | M | Existing ability tests still pass; a hostile's windowed stats differ before and after `fury_burst`; residue lowers the named axis for its minutes. |
| 6 | LCB6 | **Window record and refusals.** `fightWindow(id)` returns the record in section 8 with the five refusal reasons; escape/bargain-just variant for gate gaps. | sonnet | M | Tests for each refusal reason; an open-band lethal request returns the skirmish variant. |
| 7 | LCB7 | **Shown/believed wiring.** `believed` per observer on the existing reveal table, coarse tier reads, odds words from `believed`. | sonnet | M | Test: a concealed look read by a Beyonder raises their believed tier; a lower-grade observer cannot read exact Sequence; UI text shows odds words just. |
| 8 | LCB8 | **Tempo adapter.** Resolver returns stats and move offers; `tempo_fight.js` consumes behind one flag; log lines per resolution step; harm accrual through existing `accrueHarm`. | sonnet, opus just if the tempo contract resists | L | Focused tempo tests plus a fresh-origin headless run of one hostile fight at 1920x1080; persistence round trip (save, reload, import) for the in-progress fight; labelled implemented-unverified for anything not run. |
| 9 | LCB9 | **Late-source anchors and pinning.** Pin remaining `I` rows to paragraphs (v1 ch100-210 first), fill Seq 9-8 for the other 17 pathways from the first appearances in the text, close LCQ1 and LCQ4. | haiku to extract, sonnet to review | M | Locators for each row; labels upgraded from `I` to `S`/`T` where stated; open gaps listed. |
| 10 | LCB10 | **Grade 3+ bands.** Fill just as the player reaches them; no early authoring. | sonnet | S per scene | Added with the first scene that needs it. |

Order reason: rows 1-3 are pure data and tests with no UI consumer (safe in parallel with the content windows); rows 4-5 add mechanisms without a fight; 6-7 add the window and the information split; 8 is the just row that touches the fight path and the just one needing browser evidence. Rows 1-2 should not wait on the rest. Row 9 can run any time, since it just upgrades evidence.

## 11. More to consider

**ACT NOW (done in this file):** the dial is a ratio scale, the 0-10 ceiling and the "2" reference are marked as retired by LCD1/LCB2; the LCTs give testable targets; Neil, Dunn and Leonard resolve to pathways with dates.

**ACCOUNT FOR NOW:**
- Gate over arithmetic (LCD3): the book's gaps are qualitative, so any crowd-versus-demigod scene needs the bypass list, not extra notches.
- Item and blessing notches expire and cost (LCT9). Without that, borrowed power would be a permanent stat.
- Observers read grade, not exact stats (LCD7). Keep `believed` per observer, dated.
- `lotmReveal` and the cast observer table are the just existing "who can see what" owner; extend them.
- A fight card with `believed` odds words keeps UR and DESIGN consistent with the L2a card; default is to print odds words, not notches.

**LATER / DELEGATE:**
- Tarot and Gathering rank gaps as a non-violent "fight" (influence contests) using the same band and gate; level opus-light, effort M, done when a Gathering negotiation reads grade and `believed`.
- Mythical-creature form at Seq 4 as a toggle with strain (deep dive L10): extra notches plus an observer's fear effect on lower grades.
- Non-LOTM worlds: the notch scale and gate generalize (WER, WA33); keep the table per world.
- Heredity and the characteristic ledger as a band source for NPC children (deep dive L11).

## 12. Checks and state

| Row | State |
|---|---|
| Source read | EPUB paragraphs located and re-keyed to nav chapter numbers; 13 targets; not a full read of the book |
| Repo read | L1 code and receipt, abilities, harm consumer, formula rows, L2a/L2b receipts, deep dive tables, knowledge protection header |
| Code edited | none |
| Tests run | none (docs just); a document link check and a blanket-claim sweep are run in the commit step |
| Human-reviewed | no |
