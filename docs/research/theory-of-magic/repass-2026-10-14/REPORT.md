# Theory of Magic P4 re-pass, 2026-10-14

The selected chain is closed at the static source level: learn `invigorate`, spend stamina to restore vigor, use that vigor in paid martial training, then reach the `weaponlore` threshold that reveals `defense_stance`. The community pin also awards spell-use XP. The original pin does not, uses a different training curve and adds a constructor-derived cost to the next spell. These are separate versions, not one combined ruleset. No gameplay was run.

Full tables, authored text and curves, ordered call notes, factor locators and source hashes are saved in the ignored [private reference](../private/repass-2026-10-14/README.md). The [coverage record](COVERAGE.json) names the unread late and seasonal catalogues. Findings and YAIR proposals below are research, not accepted decisions or implementation authority.

## Evidence and source boundary

**F1, SHOWN: exact restoration.** The original [Justin Lacy pin](https://gitlab.com/justin.lacy/arcanum/-/tree/35437ed4869856220d17ea9564b339cd02b03035) is `35437ed4869856220d17ea9564b339cd02b03035`. The community [Mathias Hjelm pin](https://gitlab.com/mathiashjelm/arcanum/-/tree/a2632d2edf3e07e9168fff81167b11f2792e9197) is `a2632d2edf3e07e9168fff81167b11f2792e9197`. Both were fetched by exact SHA into separate new research directories. All 594 old INTAKE file-size/hash entries match. Both retain the MIT license, copyright 2020 Justin Lacy. No code was copied into YAIR. GitLab web-page fetch returned 403; Git smart transport succeeded. The user's exact game build remains unknown.

The process check found only the same P4 dispatch, PID 78250, naming this game. `git check-ignore` confirmed the private rule before writes. Existing dirty work stayed untouched. This pass read the live project direction and the earlier dossier, then wrote only its assigned output, this game's private folder and its bulk research workspace.

## The connected chain

**F2, SHOWN: prerequisites and ownership are distinct.** Both pins load martial data through their declared module list, instantiate `weaponlore` as a Skill and `invigorate` as a Spell. A training means tagged `armssource` enables the skill; owning it costs 5 vigor. The original means is unlocked furniture `trainingdummy`, costing 15 gold and using home space. The community means is upgrade `training_dummy`, costing 15 gold after `evt_helper`, with max 1 and a different modifier. Original vigor requires lore and starts empty; community vigor starts unlocked at 10/10. The trace starts with earned prerequisite resources and promotion/lore as applicable. It does not claim a full fresh-character route.

Training consumes 0.6 stamina and 0.12 vigor per second. After the first completed level, `weaponlore >= 1` reveals `invigorate`. Learn costs 25 research and 1 scroll. Learning sets ownership without casting. As a martial spell, it avoids Spell's automatic spellbook prerequisite. Supported UI discovery filters and `canBuy` enforce availability; the low-level `tryBuy` helper itself only checks affordability. [Community martial data](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/martial.json#L7), [original martial data](https://gitlab.com/justin.lacy/arcanum/-/blob/35437ed4869856220d17ea9564b339cd02b03035/data/modules/martial.json#L7).

**F3, SHOWN plus INFERRED call order: a paid productive action.** Casting pays 1 stamina immediately and queues one use. The next change settlement applies a base gain of 3 vigor, capped by the resource maximum, normally 10. This spell has no attack payload, so this route has no damage roll, accuracy or resistance multiplier. Vigor funds the same martial-training consumer. With full vigor the spell can still spend stamina because it has no full-output stop condition.

At 25, 50, 100, 200, 400, 800 and 1600 committed uses, each authored improvement adds 1 vigor to later uses. Result settlement precedes the threshold modifier, so the cast crossing 25 uses the previous yield; the next uses 4. This is a static order inference. Complete maps and modifier consumers are private. [Community spell data](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/spells.json#L215), [task threshold consumer](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/items/task.js#L261).

**F4, SHOWN plus INFERRED: XP is not yet a completed level.** Community `invigorate` declares 0.1 weapon-lore XP. Parsing expands that dotted field; the effect consumer calls the XP Scaler directly. Its increase is `0.1 × (1 + weaponlore.rate.pctTot)`, using percentage modifiers rather than the flat training rate. This path does not invoke the Task XP setter or its completion check. A payable training update is the located completion consumer. The original spell declares no XP award at all.

The unmodified inherited training rate is 1 progress/second: Task assigns its default before Skill considers its fallback 0.5. Missing base skill level is initialized to null, giving zero in this curve arithmetic. The original curve starts at `50 × 1.35^(base level + completed levels)` and multiplies the threshold by 1.35 after each completion. Community uses `floor(11 + 172789 / (1 + 1.2^(50 - base level - completed levels)))` and recomputes it. The community file retains an unused 0.35 constant, which is not its active curve. Default skill max is 5. [Original curve](https://gitlab.com/justin.lacy/arcanum/-/blob/35437ed4869856220d17ea9564b339cd02b03035/src/items/skill.js), [community curve](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/items/skill.js), [nested effect consumer](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/items/base.js#L359).

| Comparison | Original pin | Community pin |
|---|---|---|
| First level threshold, base level 0 | 50 | 29 |
| Level 1 to 2 threshold | 67.5 | 33 |
| New threshold after level 2 | 91.125 | 38 |
| Selected spell's authored XP | None | 0.1, percentage-scaled |
| Selected spell's productive gain/cost | Base 3 vigor / 1 stamina | Same |
| Next method's learning cost | 2 scrolls + 4 vigor + 2 arcana | 2 scrolls + 4 vigor |

**F5, INFERRED arithmetic with a stated entry state: the final connection.** Consider community skill level 1, progress 32.96/33, stamina 5 and vigor 4, with owned spell, no modifiers and fewer than 25 uses. One settled cast leaves stamina 4, vigor 7 and progress 33.06. The skill remains level 1. A payable 0.12-second training update then spends 0.072 stamina and 0.0144 vigor, adds 0.12 progress and completes level 2. XP resets to zero, including overflow, and the next threshold becomes 38. The changed skill reaches the tech-tree dependency check and reveals `defense_stance` at level 2. This is a source-derived ledger, not a created save, native observation or measured pacing claim.

In the original comparison, begin at 67.4/67.5. Casting restores vigor and leaves XP unchanged. A payable 0.12-second training update supplies the progress that crosses 67.5. It then advances the threshold to 91.125. Original spell usefulness connects through fuel for training, not direct XP.

Both next-method records require level 2 for discovery and an equipped martial weapon for use. Discovery does not establish that the weapon need is currently satisfied. Both declare a learning price of 2 scrolls and 4 vigor. Original Spell adds another `level - 1`, or 2 arcana, to this level-3 spell; the community constructor omits that rule. Per-use cost is 3 vigor. The trace stops at this capability threshold and acquisition gates, without claiming the stance's buff or combat effect was executed. [Original constructor](https://gitlab.com/justin.lacy/arcanum/-/blob/35437ed4869856220d17ea9564b339cd02b03035/src/items/spell.js#L74), [community constructor](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/items/spell.js#L130).

## Blocked action and shared runner exception

**F6, SHOWN plus INFERRED predicates.** Owned `invigorate` with stamina 0.5 fails the 1-stamina affordability check before payment or use-count mutation. It queues neither vigor nor XP. Separately, training can fail its running cost before calling Task.update, so even enough accumulated spell XP need not complete a level on that rejected tick. Community stops and queues the task with a COST reason; the original stops/waits without that newer reason argument. The explicit empty cast-stopper list also means this particular spell does not inherit the generic spell-state blocker.

**F7, SHOWN plus INFERRED counterexample.** Community normal ticks are 120 ms; delayed normal updates cap at 240 ms and bank excess seconds in a resource with base cap 3600. Turbo uses 0.24-second coarse steps, with a default extra budget of 4.5 steps and a fractional final step. These steps call the same training runner. With stamina 1 and vigor 0.02 before other gains, a 0.12-second step can pay 0.0144 vigor, while a 0.24-second step cannot pay 0.0288. The latter blocks before progress/completion. This demonstrates different admission predicates, not a full offline simulation or proof of total offline loss. Original update caps elapsed time at 1 second and has no corresponding bank/turbo path. [Community tick and banking](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/game.js#L353), [shared runner cost consumer](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/runner.js#L636).

## Ranked YAIR proposals

All rows are **PROPOSAL**, unaccepted and unimplemented. They extend the live direction for useful learning and means-dependent action. Review the current study, workshop and routine owners before selecting any slice.

| Rank | Code | PROPOSAL | Useful payoff |
|---|---|---|---|
| 1 | P1 | Complete earned practice XP through one shared threshold consumer | Active, queued and condition-based learning reach the same capability and receipt. |
| 2 | P2 | Show the next usable method alongside its remaining means | A skill threshold can reveal a technique while its tool or resource need remains visible. |
| 3 | P3 | Give recovery work a concrete downstream use | Converted energy or prepared materials fund an actual useful activity. |
| 4 | P4 | Make a stopped routine name the exact insufficient input | Resume behavior becomes understandable from the same predicate that stopped it. |
| 5 | P5 | Preserve affordability behavior across coarse and fine updates | A low-resource boundary does not silently change merely because the player was away. |
| 6 | P6 | Distinguish learning price, per-use cost and ongoing cost | Players can budget ownership and operation independently. |
| 7 | P7 | Expose earned practice improvements at the action that gained them | A modest count threshold changes future productivity with a readable receipt. |
| 8 | P8 | Preview capped output before a paid conversion | A recovery action can disclose how much useful output will fit. |

Small original touches: **T1** show the last missing ingredient in a stopped row; **T2** give Learn and Use separate cost lines; **T3** identify the next tool-dependent method at an earned threshold; **T4** show the productive gain that fits the current cap; **T5** name a newly earned efficiency improvement once; **T6** attach an offline stop receipt to the same routine log. These are optional ideas, not a new required implementation wave.

## Deep-save coverage and checks

The saved core-plus-declared-module families contain complete declaration records, not selected-column summaries:

| Family | Original records | Community records |
|---|---:|---:|
| Spells | 263 | 295 |
| Skills | 72 | 72 |
| Tasks | 226 | 267 |
| Monsters, including summon definition sources | 280 | 331 |
| Summon/resurrect spell index, a subset of spells | 28 | 64 |

These counts establish structural preservation only. IDs, full authored text, conditions, at/every maps and formula strings stay private. The monster table is not a claim that every monster is a player minion. Source paths and JSON pointers preserve each declaration's lineage; 54 original and 64 community loaded catalogues are indexed. Remaining seasonal catalogues include legacy Halloween, winter, fool and beltane. Late modules, all other spell/minion behavior, damage resolution, class/quest progression, gear and Hall remain named and semantically open in COVERAGE.json.

Checked: exact Git revisions, clean source snapshots, all 594 historical hash entries, every copied source hash, JSON parsing, record counts and pointers, selected-ID uniqueness, source locators, private-ignore coverage, local links and independent arithmetic. [Verification receipt](VERIFICATION.json) records the final checks. Static selected-chain gate: PASS. Exact user-build behavior, native/browser execution, rendered UI, pacing and persistence remain unverified. No npm, build, dependency install, game launch, save access, gameplay implementation or commit occurred.
