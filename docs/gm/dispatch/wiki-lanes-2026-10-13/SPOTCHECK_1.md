# Wiki lane spot-check 1 (2026-10-13)

Read-only check of live lanes. For each sampled note I opened the manifest `read_file` payload and read the relevant text myself. Proof fields (6 checks) were scripted over **every** complete row, not just samples. Skipped (<3 notes at check time): fate shard-a (2), fate shard-b (0), hxh r2 shard-a/b (2 each), fma r2 review (0).

**Proof results (all rows).** read_text_sha256 = manifest read_sha256 and characters_read = read_characters on every row in every lane. read_chunks are contiguous, at most 4,500 characters, and cover the whole payload everywhere except JJK, where 18 of 133 ledger rows on span-selected pages give chunks in full-article coordinates. Those chunks include the gap ranges that were never in the payload (Nobuko Takada is one example). Hash and count still match. **Quotes:** only one run of 15+ words copied from the source turned up across all notes: bleach shard-b #6, 16 words. A few runs of 12 to 13 words sit under the limit.

## CSM (csm-full): trust with fixes

| Note | Grade | Reason |
|---|---|---|
| Devil (29.7k, restored) | minor | Nothing invented, but it leaves out stated rules: Primal Fear Devils never reincarnate, the flesh boost only works from a living Devil, and Devils cannot contract with each other. |
| Makima (character) | accurate | Contract redirection, rank-based control, chain channeling, animal listening and the three force attacks each match the text with their stated conditions. |
| Eternity Devil | minor | Says the second incarnation shows "no equivalent power", but the page describes its aquarium loop. Misses the contract offer. Calls item persistence unknown although the page gives Asa's million-yen haul. |
| Katana Man arc | minor | "Limited blood affecting transformation" is not in the text (it says Katana Man was exhausted). The rule-bearing events are left vague. |
| Stone Devil | minor | Lists circle requirements as unknown, but the text says Kusakabe draws the circle in his own blood. Misses that the Devil is fickle with contracts. |

## JJK review lane (jjk-full): trust with fixes

| Note | Grade | Reason |
|---|---|---|
| Tsumiki Fushiguro (character) | accurate | Transfiguration and vessel claims are bounded correctly, and the reviewer adds no procedure. |
| Decay | minor | The reviewer passed the parent note's "either sibling activates" reading. The text says the *other* user activates, and that the connection runs from victim to brothers. Its 4 repairs are wording-only. |
| Yuko Ozawa (character) | accurate | Correctly repairs the parent note's speaker swap. |
| Cursed Human | accurate | Correctly downgrades "misclassified" to an in-world belief. |
| Innate Domain | accurate | Supported. It misses that the page calls the innate domain the foundation of a cursed technique. |

## Bleach shard-a: trust

| Note | Grade | Reason |
|---|---|---|
| Ichigo Kurosaki (223.8k, character) | accurate | 8 claims spot-checked and all supported: 72h corrosion, 4s then 11s mask, Blut Vene via Quilge, merged form, Cero fusion, Ōken clothing, gold vs blue, true Bankai unknown. |
| Races | minor | States Zanpakutō-spirit lifecycle facts that are cited to the anime as if general. Drops the 200-year Quincy date. |
| Arturo Plateado (game) | accurate | Keeps the two game continuities and the date conflict separate. |
| Hueco Mundo | accurate | Supported. Character-book claims are folded into a "manga-referenced" label. |
| Rangiku Matsumoto (character) | accurate | Haineko, the lifespan cost, the anime toning-down and the CFYOW novel claim are all labelled. It misses Gin's rule that collapsing from hunger implies spiritual power. |

## Bleach shard-b (Bount filler episodes): trust with fixes

| Note | Grade | Reason |
|---|---|---|
| Ep 81 Hitsugaya Moves! | minor | The aging/taboo explanation is Mabashi's; the note gives it to Kariya. |
| Ep 91 Shinigami and Quincy | **material** | Its source_facts say Rukia's Soul injury heals slower and compare Keigo's Reishi treatment with a child's Soul decay. Neither is on this page; both were carried over from earlier episodes. |
| Ep 101 Mayuri's Bankai! | accurate | Detailed and correct, including the sensor's data dependency and the paralysis surviving Reishi healing. |
| Ep 122 Visored! | accurate | Supported. It misses that captains needed Gentei Kaijo to beat mere Gillian. |

## Bleach shard-c: trust

| Note | Grade | Reason |
|---|---|---|
| Ep 352 Tsukishima Attacks! | minor | source_facts refer to "prior episode reports" of Book of the End effects that this page does not contain. |
| Hajō Kūri (anime-only) | accurate | Matches the text and is correctly labelled anime-only. |
| Shiba Clan | accurate | Supported. Drops "former" from Isshin's branch-head title. |
| Quilge Opie (character) | accurate | Jail persistence, Quincy immunity, Blut exclusivity, Sklaverei expiry and medallion failure are all supported. |
| Yhwach (100k, character) | accurate | Lifespan cost, Still Silver, sleep swap, Hollow-poison immunity and the medallion theft of Yamamoto's Bankai are all supported. It misses two stated counters (Cage of Life fails; Ichibē resists Sankt Altar). |

## Fate shard-c: trust

| Note | Grade | Reason |
|---|---|---|
| Kiara Sessyoin (MoonCancer, character) | accurate | Correctly scoped to the FGO 2020 summer variant. It misses the vow loophole: eating soulless mermaids does not break her vow. |
| Nirmānnarati - Heaven's Foam | accurate | The staged satisfaction-to-erasure rule is exact. The red-light castle line is the in-world picture book's, not the article's. |
| Primordial Rune | minor | Continuity says "across Fate works", but every citation is FGO material. Misses that Brynhildr taught Sigurd. |
| Xu Fu (16.9k, two classes) | accurate | The two class kits are kept separate and the costs and exceptions are correct. It misses Oblivion Correction. |
| Coaching | accurate | Complete for a short stub. |

## Recurring failure patterns

- **P1 Cross-page carryover (the one material error).** Lanes that read consecutive episodes write context from earlier inputs into the current page's `source_facts` (ep 91, ep 352). It is most likely in shard-b and shard-c episode runs.
- **P2 Actor/speaker slips.** Statements get moved to a different speaker or a different user (Mabashi to Kariya; Decay's activating user). The JJK reviewer caught one of these (Yuko) and missed the other (Decay).
- **P3 Stated conditions dropped, then listed as unknown.** Notes summarize at a level where explicit conditions vanish, and the `unknowns` list then contradicts the text (Stone Devil's blood circle, Eternity Devil persistence). This is CSM's main weakness.
- **P4 Per-citation medium flattened.** Anime, guidebook or FGO-material citations inside a mixed page get folded into one page-level continuity label (Races, Hueco Mundo, Primordial Rune).
- **P5 JJK chunk coordinates.** Span-selected rows record full-article ranges, gaps included, instead of payload offsets.

No hallucinated mechanics, ranks or costs were found apart from the P1 carryover. Labelling of assertion vs inference vs proposal held up in every sampled note.

## Suggested COMMON.md addition

> Before writing each note, re-check it against this input's text only. Every `source_facts` and `wiki_assertions` item must be something this page states; context from earlier inputs, even the previous episode, goes in `analyst_inferences` with the other page's title, or is left out. Name the speaker or user exactly as the page does. An item may go in `unknowns` only after you have searched this page for it; if the page gives a condition, cost, material or worked example, record that instead. Where a single claim is cited to anime, a guidebook, a novel, a game or FGO material, label that claim, not just the page. For span-selected inputs, record `read_chunks` as offsets into the payload text.

Lane notes: re-audit bleach shard-b and shard-c episode notes for P1 before synthesis, and correct the JJK chunk coordinates in the ledger owner's next pass. Neither needs a requalification stop.
