# Gu `*-unknown` blockers: are they reading gaps? (2026-11-24)

Audit, not an accepted decision (AD32). Trigger: [atlas goal check](../reviews/WORLD_ATLAS_PLATFORM_2026-11-24.md) R11 inferred that the largest Gu blockers are reading gaps and proposed paid targeted reads. Weibao asked for a sample before any spend.

**Method.** Ledgers `docs/coverage/gu_kinds.jsonl` and `gu_moves.jsonl` as committed at `cc45d15b6`. Full English novel text loaded with `scripts/chapter_tier_packets.py` `load_ri()` (2,334 chapters, 212,868 paragraphs). Each row's display name comes from its id (prefix stripped, plus "Gu" for kinds). The search is a case-insensitive substring match. A rank counts as stated when `rank <1-9 or one-nine>` sits within one sentence of the name. Effect and move samples were read by eye (seed 7). This is a heuristic probe with no second reader, so the counts are a lower bound for text hits, and individual hits can be false positives.

## Results

| ID | Blocker | Rows | Name found in novel | What the sample shows |
|---|---|---|---|---|
| F1 | `rank-unknown` | 221 | 174 | The first probe found 18 rows with a rank near the name, but several were name collisions. **Corrected after the full pass below:** the chapter tier already searched every matching paragraph ("searched N paragraphs" in a note counts matching paragraphs, not a search limit), and it already recorded ranks for `ice-blade`, `plunder`, `tyrant-strength` and `self-strength`. Those rows stay blocked for a different reason, a missing catalogue rank binding. For most of these rows the novel does not state a rank. |
| F2 | `effect-unknown` | 296 | 218 | 108 rows already have a wiki-tier effect that just needs mapping to an effect family (GL2). Of the 6 chapter samples, 3 state the effect in plain text: `soul-chain-gu` "souls can be interlinked" (ch511:p6), `wolf-swallow-gu` "a rank four storage Gu" (ch459:p36), `bone-bamboo-gu` repairs the white bone wheel together with ghost fire Gu (ch431:p7). 2 rows are bare mentions (`black-hair-gu`, `exploding-egg-gu` in its first hits). 1 row was a name collision (`fandom:Letter_Gu` matched "flying sword letter Gu"). **This is mostly a mapping and extraction gap.** |
| F3 | `roles-unknown` (moves) | 651 | 614 | Just 250 hit paragraphs name any Gu at all. The samples name the move and its use but not its component Gu or their order (`call-of-the-ancient` ch1719:p56, `chicken-dinner` ch1871:p49). `burning-soul-bursting-luck` names one component, Soul Howl (ch1405:p41). **For most moves the novel does not state the recipe, so reads cannot fill it.** |
| F4 | Name not found | 47 rank, 78 effect, 37 moves | none | Alias and naming problems (`responsive-luck`, `candidate:demon-ferret-blood`). These need `ri_aliases.json` work, not reads. |

## What follows

- **A1 Free first.** Run a deterministic full-text pass for stated ranks (F1) and effect sentences (F2) over every hit paragraph. It costs no API spend. A second reader still has to confirm hits before any of them reach the catalogue (PWC23 style).
- **A2 Map before reading.** Map the 108 wiki-tier effects to effect families (GL2).
- **A3 Paid reads for the remainder.** That means rows where the name appears in many paragraphs but A1 and A2 found nothing. The sample suggests this pool is well under the 517 kind rows R11 implied.
- **A4 Moves need a rule, not reads.** Most `roles-unknown` rows need an authored-recipe dial or a "partial recipe" state. Fill the subset whose paragraphs name component Gu (at most 250) from text.
- **R1 Caveats.** Substring matching can hit the wrong Gu (`candidate:blade-gu` matched Ice Blade, and `candidate:life-gu` at ch385:p55 needs checking). Every count above is a probe, not a ledger change.

## Full-text pass results (A1, 2026-11-24)

`python3 -I scripts/gu_fulltext_rank_pass.py` (self-test: `--self-test`) scans every paragraph that names a Gu. It uses the chapter tier's terms and aliases, binds "rank N" to the name in four shapes (before the name, "X Gu is/was rank N", "X Gu, a rank N ... Gu", and inventory lists such as "Rank six Immortal Gu: ..., Blood Asset, ..." at ri:ch1291:p83, found by the [community research](../research/RI_COMMUNITY_ANSWERS_2026-11-24.md)) and rejects names that sit inside a longer Gu name. Its output goes to the gitignored private folder as `fulltext_gu_ranks.json`. It writes nothing to the ledgers. It takes about 80 s and costs nothing.

| ID | Check | Result |
|---|---|---|
| P1 | Scored on the 532 rows whose wiki category states a rank | Proposed 293: 271 exact (92%), 279 within one rank, 20 conflicts. Most misses are Gu that come in several ranks (amplify effect, contact heart), where the wiki keeps the lowest |
| P2 | Agreement with the paid chapter tier on effect-unknown rows where both give a rank | 47 of 48 |
| P3 | `rank-unknown` proposals | 11. Four the chapter tier already had (above). Six new ones look right on reading: `photo-audio` 3 (ch156:p22), `group-strength` 5 (ch678:p58), `saga:paper-crane-gu` 2 (ch323:p98), `saga:vagrant-warrior-gu` 3 (ch2065:p11), `blood-asset` 6 (agrees with the wiki tier), `candidate:pill-fire-gu` 3 (alias "fire pellet Gu", ch312:p96). One is wrong: `fandom:Red_Fiend_Divine_Boat` (the "rank six" is the seller's). |
| P4 | `effect-unknown` rows | 80 get a rank (about 30 new beyond the chapter tier), which does not unblock their effect. Just 5 get a type word: `candidate:wolf-swallow-gu` and `candidate:primeval-elder-gu` storage, `candidate:battle-space-gu` space path, `fandom:Keep_Silent_Gu` sound path, `fandom:Smelly_Fart_Fat_Worm_Gu` poison path |

**Revised read.** The free pass is a good cross-check (P1, P2), but its yield is small: about 6 rank rows and 5 effect hints. Rank gaps are mostly unstated in the novel, so they need the PWC23 derivation or an authored-rank dial, not more reads. Effect gaps go to the wiki mapping (A2) first. Paid reads remain for effect-unknown rows with many paragraph hits and no wiki effect. None of the P3 or P4 proposals has been folded into a ledger. Each needs a second reader first.

Probe script (scratch, not committed): `/private/tmp/claude-501/-Users-weiwei-dev/9a10d222-582c-4284-9782-087ccfdb5587/scratchpad/probe.py`.
