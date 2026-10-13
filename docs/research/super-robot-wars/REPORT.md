# Super Robot Wars: how crossovers keep dozens of canons consistent (2026-10-13)

**Answer first.** SRW does not keep canons consistent. It keeps them *recognizable* and lets the merge be openly different. It uses four tools:

1. An in-world device builds one composite world from pieces of each series (F3).
2. A short list of shared world defaults sits on top, with organizations, timelines and scale adjusted to fit (F4).
3. Each series is re-expressed through one shared stat and verb grammar, filtered by its "canon image" rather than its raw feats (F5, F6, F7).
4. Divergence is a reward. Saving people who die in canon is an explicit series theme, unlocked by optional per-stage objectives or hidden conditions, and the canon ending is often kept as a condition-gated or post-clear alternative (F1, F2).

New for YAIRPG: survival and recruitment gated by a mastery counter built from optional objectives (F1); canon and IF endings as two reachable routes (F2); per-series "reproduction systems" layered on shared verbs (F6); and a theater-select mission board for time-poor players (F11). The natural-course standard, verse equalization, converged worlds and the EI10 canon clock already cover most of the frame.

Findings and packets are proposals, not accepted decisions.

Labels: verified (ja-wiki) = Japanese Wikipedia; verified (srw-wiki) = superrobotwars.fandom.com; verified (page) = another named public page; inferred = this lane's assessment. TV Tropes (403), srw.fandom.com (402), the Akurasu mirror (TLS) and archive.org were unreachable, so exact per-character secret conditions are unverified.

| Code | Label | Finding |
|---|---|---|
| F1 | verified (ja-wiki) | **Survival is earned through a mastery counter.** Alpha, OG, IMPACT and Z keep a skill-point counter (熟練度; "SR Points" in Z) that rises from optional per-map conditions such as beating a boss before it retreats. A high count can keep a pilot who would die or leave, recruit an enemy pilot, add a unit or open the true ending; some units are available only at a LOW count, and higher counts raise difficulty. In Alpha the conditions were hidden and the counter could fall; from Alpha Gaiden it never falls, and from OG the conditions are shown. In Z the share of SR points earned sets difficulty (80%+ Hard, 30-79% Normal, 29% or less Easy). |
| F2 | verified (ja-wiki) | **The canon ending is one route, not the default.** Saving those who could not be saved is a stated series theme. In Z, Gundam SEED Destiny keeps the canon-ending route plus an IF route where Shin and Lunamaria stay if conditions are met; after one clear the player picks freely. 2nd Z does the same for Code Geass R2. Reproducing Baldios's canon ending needs a special condition, shown as a special game over. K runs the other way: missing a hidden condition leaves canon survivors worse off. |
| F3 | verified (ja-wiki) | **An in-world device builds the merged world.** Characters are gathered from their home canons by someone's design without noticing, and return home without memories when the device ends (DC/Z "singularity", Alpha's Cross Gate Paradigm System). 2nd Z opens 20 years after a space-time quake fused parallel worlds, with two moons and two Japans. |
| F4 | verified (ja-wiki) | **Canon is harmonized against shared defaults:** colony emigration, Earth versus colonies, super-robot labs in Japan, repeated alien invasions, modern civilian culture, a common language. Series that cannot link get a different-world framing. Alpha moves the One Year War into the past with a truce, so the Zabi family, Ramba Ral and the Black Tri-Stars survive while Lalah is already dead. |
| F5 | verified (ja-wiki) | **Power is normalized by canon image, not feats.** Mazinger Z moves fast in canon but SRW makes it slow and very tough. Canon abilities become leveled pilot skills (Newtype, SEED) feeding shared hit, evade, attack and defense numbers. |
| F6 | verified (srw-wiki, ja-wiki) | **Shared verbs plus per-series reproduction systems.** Every pilot draws Spirit Commands from one shared catalog paid with SP (usually six, five in Z; OG adds pair-only commands; rare series-specific ones like 3rd Alpha's Song Energy). Z lists "systems that reproduce original settings": Satellite Cannon needs a moonlit map and a 4-turn charge; Impulse swaps packs only while the Minerva is on the map; Big O's Negotiation lowers enemy morale; God Gravion's combine needs morale 130 for 3 turns. |
| F7 | verified (ja-wiki) | **Morale paces each fight like the show.** Morale runs 50 to 150 from a start of 100, rising on damage and kills. Finishers need high morale, reproducing "weak moves early, finisher late". |
| F8 | verified (ja-wiki) | **Weak units get rescue rules; originals must not crowd the canon cast.** SRW 64 gave weaker units more upgrade steps. Alpha's push to center Banpresto Originals drew complaints that the protagonist intrudes too much. |
| F9 | verified (ja-wiki, page) | **Original protagonists join the casts together** and are often the final bosses. The protagonist pick changes story and units; in Z the unchosen protagonist appears for a while as an enemy, then reconciles. SRW 64 gives four protagonists across real and super routes, each with a rival. |
| F10 | verified (ja-wiki, page) | **Route splits come from scenario choices.** The force may split and you control one part. In OG2 the first half differs heavily by route and the second half converges; the other route needs another playthrough. |
| F11 | verified (ja-wiki) | **SRW 30's Tactical Area Select.** Pick missions from several theaters; clearing all key missions advances the story, and the order changes when units arrive. Stated aims: a shortest route for time-poor players and getting favorite units earlier. |
| F12 | verified (ja-wiki) | **Failure still carries progress.** After a game over, money and EXP carry into the continue, with penalties (lost skill points, the turn counter keeps running). Pilot points reset at the end of a playthrough but their average seeds the next one. |
| F13 | verified (ja-wiki) | **Divergence goes both ways.** Some canon survivors die in SRW (Yazan, Katejina, Mu in J), and SRW-made material has flowed back into canon (Mazinkaiser, Shin Getter OVAs). |
| F14 | verified (page) | **Other crossover structures.** Kingdom Hearts keeps worlds disconnected; local allies cannot leave their world, and worlds change the party's form (Neverland flight, Atlantica). FGO's Singularities are distorted history the player corrects era by era; its Lostbelts are diverged histories judged dead ends and pruned, and restoring history erases participants' memories. |
| F15 | inferred | **Coverage.** Already covered: the natural-course standard and dials ([timelines](../../TIMELINES_AND_DIVERGENCE.md)), the Divergence plot mode ([campaign framework](../../worlds/CAMPAIGN_FRAMEWORK.md)), verse equalization ([cheat cosmology](../../CHEAT_COSMOLOGY.md)), converged worlds ([multiverse structures](../../worlds/MULTIVERSE_STRUCTURES.md)), the EI10 canon clock ([required features](../../worlds/world-depth-2026-10-13/07_REQUIRED_FEATURES_AND_ENGINE.md)), and [living beside protagonists](../LIVING_BESIDE_PROTAGONISTS_2026-10-10.md) M1-M3. New: F1 with its visibility dial, F2, canon-image filtering as an equalization mode (F5), F6, F7, F11, F3's oblivious-residents and memory-loss dial, F12. |

## How YAIRPG compares (source read, not run)

- **Survival:** `src/causal_story_ids.js:9-18` defines protection profiles (none, covenant, future_anchor) and a `survival_covenant` source, a per-person survival proof rather than a canon-death list. `src/npc_lives.js:9-10` schedules deterministic village deaths with no intervention hook. Gap: a canon-clock row that declares "dies unless conditions X".
- **Canon clock:** EI10 is proposed, not built; seams are `src/causal_situations.js:4-57` and `src/world_rhythm.js:20`.
- **Optional objectives:** `src/audit_remainder_combat_objectives_content.js` and its host and state hold finite authored objectives; no cross-arc counter reads them.
- **Normalization:** `src/power_models.js` and `src/realm_boundary_rules.js`; verse equalization is design only.
- **Per-world reproduction:** book-world modules (`src/book_world_mol_*.js`, `src/book_world_paradise_*.js`) already author world-local commands on shared verbs, so F6 matches the architecture.
- **Carry:** `src/heir_inheritance.js` carries leftovers to an heir only; failure carry is a design option.
- **Mission choice:** `src/work_ledger_system.js` and `src/known_routes.js` exist; no key/optional mission board.

Packets: [IMPLEMENTATION_PACKETS.md](IMPLEMENTATION_PACKETS.md). Touches: [SMALL_TOUCHES.md](SMALL_TOUCHES.md). Coverage: [CHECKPOINT.md](CHECKPOINT.md).

## Sources

- Japanese Wikipedia: [スーパーロボット大戦シリーズ](https://ja.wikipedia.org/wiki/スーパーロボット大戦シリーズ), [シリーズのシステム](https://ja.wikipedia.org/wiki/スーパーロボット大戦シリーズのシステム), [α](https://ja.wikipedia.org/wiki/スーパーロボット大戦α), [Z](https://ja.wikipedia.org/wiki/スーパーロボット大戦Z), [第2次Z](https://ja.wikipedia.org/wiki/第2次スーパーロボット大戦Z), [30](https://ja.wikipedia.org/wiki/スーパーロボット大戦30), [W](https://ja.wikipedia.org/wiki/スーパーロボット大戦W), [K](https://ja.wikipedia.org/wiki/スーパーロボット大戦K)
- SRW wiki: [Spirit Command](https://superrobotwars.fandom.com/wiki/Spirit_Command), [Banpresto Originals](https://superrobotwars.fandom.com/wiki/Banpresto_Originals), [SRW Alpha](https://superrobotwars.fandom.com/wiki/Super_Robot_Wars_Alpha), [SRW V](https://superrobotwars.fandom.com/wiki/Super_Robot_Wars_V)
- [Wikipedia: SRW 64](https://en.wikipedia.org/wiki/Super_Robot_Wars_64); [RPGFan OG2 review](https://www.rpgfan.com/review/super-robot-taisen-original-generation-2-2/)
- [Wikipedia: Fate/Grand Order](https://en.wikipedia.org/wiki/Fate/Grand_Order); [Wikipedia: Kingdom Hearts](https://en.wikipedia.org/wiki/Kingdom_Hearts_(video_game))
