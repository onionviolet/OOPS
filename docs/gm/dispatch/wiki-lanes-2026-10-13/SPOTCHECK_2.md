# Wiki lane spot-check 2 (2026-10-13, about 23:30 EDT)

Read-only check, same method as [SPOTCHECK_1](SPOTCHECK_1.md). I sampled 32 notes, opened each one's manifest `read_file` payload, and checked 3 to 8 claims per note against the text. The proof checks were scripted over every complete row present at about 23:30. Codex session logs show when each lane first read the new "Note accuracy" rule: hxh-a and hxh-b at 22:50, fate-a at 22:58, bleach-c at 23:10, fate-b at 23:20, bleach-b at 23:28. fma-review finished at 22:50 and never saw it. Samples are mostly post-rule rows.

**Proof results (all rows).** read_text_sha256 matches manifest read_sha256, and characters_read matches read_characters, on every row in fate-a (93), fate-b (41), hxh-a (176), hxh-b (219), bleach-b (168) and bleach-c (183). read_chunks are contiguous payload offsets that cover the whole payload everywhere, so P5 does not appear in these lanes. Two chunks run over 4,500 characters: hxh-a Nickes (4,861) and hxh-b Cha-R Family (4,613). In fma-review, the 11 hash/length "mismatches" are by design: the 14 restored bodies are scope-excluded rows whose manifest read_sha256 is empty. I rebuilt them from `pages-current.xml.7z`, and all 39 restored bodies (14 full reads plus 25 metadata dispositions) match their recorded hash. Two review rows first logged 5,000-character chunks, later corrected by append-only rows. **Quotes:** I found three runs of 15 or more copied words. hxh-a Republic of Padokea (15) and hxh-b Egypersia (15) are each a plain factual sentence at the limit. bleach-b "Byakuya is summoned" (16) is the same run SPOTCHECK_1 reported.

## Fate shard-a: trust

| Note | Grade | Reason |
|---|---|---|
| Artoria Pendragon (216k, character) | accurate | Dragon-core restart, Command Spell resistance, the two full Excaliburs under Rin, the aircraft Riding doubt and Instinct failing against Kuzuki all check out. FGO claims carry their own labels. |
| Servant (128k) | accurate | Respiration, radiation (FGO-labelled), catalyst override, EMIYA's pendant, Serenity's sealed memories and Erice's interception all match. |
| Night of Wallachia (59k) | accurate | Thirty percent copy cap, midnight receivers, 2,000 patterns / 12,500 sectors and the two-hundred-year delay are exact. |
| Mystic Eyes of Death Perception | accurate | The 80 percent cost, the telephone example, the puppet arm, the bandages and Chaos's arm are all supported. |
| Gáe Bolg | accurate | Seven uses, living targets only, health-plus-damage, God Hand bypass, Mach 2 and 40 km are all exact. |

## Fate shard-b: trust

| Note | Grade | Reason |
|---|---|---|
| Galahad (29k, character) | accurate | Each claim carries its own continuity tag (Babylonia anime, Garden of Avalon, Fate/Zero, FGO). |
| Lord Camelot | accurate | The anti-poison theory is kept as a theory, the anime reflection is contrasted with the game, and the Ortenaus forms are correct. |
| Tarasque (NP) | accurate | Ranks, ranges and the failed damage-transfer punch are exact. |
| Chaos Labyrinthos | accurate | Complete for a short page, including the Evil variant's unclear difference. |
| Encyclopedia/Grand Order (368k, pre-rule) | minor | The bilingual discrepancies I checked are real (Geronimo is 154 cm in English vs 174 cm in Japanese). One unknown compares this page with "the previously read character article" without naming it. |

## HxH shard-a: trust

| Note | Grade | Reason |
|---|---|---|
| Cheadle Yorkshire (character) | minor | Gives "Kakin's project" where the page says Nasubi's. Leaves out Kanzai rating her above Morel and Knov. |
| Scarlet Eyes | accurate | The 36 pairs, the postmortem rule, Kortopi's En tracking and the daughter-of-the-Mafia inconsistency are all exact. |
| Heavens Arena (37k) | accurate | Floor rules, scoring, judges lowering thresholds and the deathmatch are right. The 1999-anime elevator operator is labelled. |
| Tsubone (character) | accurate | Rider-fuel rule, the monocle under Kikyo's orders and the symbiotic type are right; the note keeps symbiotic as the page's guess. |
| Hunter Exam arc (69k) | minor | States the trio's Testing Gate training without the label the page gives it: shown only in the 2011 anime. |

## HxH shard-b: trust

| Note | Grade | Reason |
|---|---|---|
| Dark Continent Expedition Team | accurate | Headcounts, bounty, the Muherr/second-in-command split, Golem, Kurton and Bill's three routes are exact. |
| Timeline (51k) | accurate | The 1999/2017 calendar caveat, August 8, the oyster reverting after two hours and Borksen's cheat are right. |
| Shikaku (character) | minor | Hedges Halkenburg's arrow as not proof against all defenses. The page states it pierces all defenses, which is the stated reason the procurement failed. |
| Lynch Fullbokko (character) | accurate | Question-and-punch rule, two-person audibility and Hinrigh's theory are attributed correctly. |
| Morena Prudo (29k, pre-rule) | minor | Conditions and levels are exact. But "assign/split" overstates the page's "assigns", the unknowns ask a question the page answers (she sets the values for the voyage), and it calls Member Zero inconsistent when the page applies it to level-100 members too. |

## FMA parent review: trust with fixes

| Note | Grade | Reason |
|---|---|---|
| Lan Fan/History | accurate | The "broken arm" to "severely injured" repair is correct. The other parent claims I checked hold. |
| Fullmetal Alchemist (2003 Anime) | minor | Rightly removes the failed-transmutation origin rule. Passes the parent's comparison with "manga page statements" about the pocket watch, which this page never makes. |
| Ouroboros | accurate | Rightly flags the unnamed remover and method. The page offers only a loose transmutation-circle "basis" reading. |
| May Chang (character) | minor | Rightly removes "Father cannot control" it (no such text). Passes the parent's "general Alkahestry page" kunai detail inside wiki_assertions. |
| Paninya | accurate | Correctly sends the limb-tradeoff claim back to the separate Automail source. |
| Dragon's Pulse (extra) | accurate | Pass verdict holds; parent matches the short page. |

The reviewer's repairs are right, and its integrity claims hold up independently. It misses cross-page carryover in the parent's `wiki_assertions` field, which is the P1 pattern in a different field. synth-fma was already marked done before this check, so confirm the synthesis took in the five repairs and these two misses.

## Bleach re-check (post-rule rows only): P1 stopped in the sample

| Note | Grade | Reason |
|---|---|---|
| b: The Cold War (100k) | accurate | Gintō, Yumichika's human-world-law line, sword-size lecture, Ulquiorra's regression reading and eye crushing all check out, and every speaker is right. |
| b: Ichigo vs. Grimmjow | accurate | "Two or three" vs Grimmjow's "three", the untested hundred and Ichigo's inference about Urahara are right. |
| c: Fall of the Seireitei (68k) | accurate | 28,000 souls, over 1,000 casualties in seven minutes, Tenteikūra, moisture loss and the ep 373 Qualkreis carry their own labels. |
| c: Senjumaru Shutara (character) | accurate | Manga, anime 391–392, CFYOW and Brave Souls are kept apart; the 72 barriers and the three-death seal are exact. |
| c: Kenpachi vs. Unohana | accurate | One-day kendo halt, recovery without healing, ep 376 extensions and the skeleton vision are labelled. |
| c: Isshin & Masaki vs. White | accurate | Bankai stabilization, blood-fed flame, shoulder bait, the self-destruct and Masaki's reveal are exact. |

No sampled post-rule row writes earlier pages into `source_facts`. Caveat: bleach-b picked up the rule only at 23:28 (rows 169 onward), and bleach-c at 23:10 (rows 142 onward). The pre-rule shard-b and shard-c episode notes still need the re-audit SPOTCHECK_1 asked for.

## Patterns

- **P1 cross-page carryover:** absent from the 26 post-rule samples. It persists only in pre-rule material: the FMA parent's `wiki_assertions` (passed by the reviewer) and one unnamed comparison in Encyclopedia/Grand Order.
- **P2 speaker/actor slips:** one mild entity swap (Cheadle: Kakin for Nasubi).
- **P3 stated reason dropped, then hedged as unknown:** the main remaining weakness (Shikaku, Morena, Cheadle). Never material.
- **P4 flattened medium:** fixed in fate and bleach, where post-rule notes tag claims one by one. One HxH slip (2011-anime training).
- **P5 chunk coordinates:** not present in these lanes.
- **P6 (new) batched reads in bleach-b:** since about 22:20 the lane prints five or six chunks per tool output (133 outputs over 9,000 characters; max 27k) and finishes 100k pages in about 45 seconds. Each chunk still enters context, and its sampled notes are accurate. It does break COMMON's 4,500-per-visible-output rule. Tell the lane to return to one chunk per output, or accept the deviation explicitly.

No invented mechanics, ranks or costs turned up. Labelling of assertion vs inference vs proposal held in every sampled note.
