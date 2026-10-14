# Path of the Idle Cultivator: implementation research

2026-10-14. Static browser-build inspection. Research and PROPOSALS only.

The obfuscation barrier is removed for the requested mechanism pass: formatting and decoding printable string escapes exposes the handlers and authored tables without running the game. Local variables remain scrambled. The downloaded bundle is **the exact same hash as the prior lane**, so the corrections below are not explained by a new build.

**F1/F2/F4:** Standard cultivation has nine stages, automatic ordinary realm advances and a 50-turn trial at category boundaries. Losing the trial's separate HP pool still produces a reward tier and a realm advance after confirmation. The prior claim that every realm breakthrough normally kills the player is wrong for this standard handler.

**F3:** The build contains 79 normal realm names in 12 categories, 40 demonic realm names, and 111 astral names. The page's 50 realms/seven tiers describes less than the shipped tables. These are static catalogue counts, not proof that every entry is reachable in every origin.

**F9/F12:** Origins change the actual progression method. A cultivation registry combines main and earned secondary paths, including body, inner arts, war, bulwark, kingdom and intent. Qi, room quality, purity, spirit stones, crafting and combat feed one another. Rebirth retains selected long-term gains and opens other origin routes; it does not keep all life state.

**F14/F15:** No closed-browser catch-up was found in the traced load/clock/main-loop path. Loading resets the real timestamp; the calculation uses a fixed 1,000 ms per callback rather than the time since the saved timestamp. Background throttling and any platform-specific behavior were not measured.

**F16-F20:** Content mixes authored arrays, generated tables and executable callbacks. Weapon skills alter attack count, collision size, timing and reactions. Manuals roll bonuses. Recipes bind material quantities to time costs. Quests use prerequisite graphs, objectives and typed reward handlers. Cave rooms mix weighted templates with generated objective layouts.

## Evidence and limits

Source: [public browser build](https://cultivator-path.com/), bundle URL `https://cultivator-path.com/game.bundle.js?v=mukbw9m0`; [developer page](https://wuxiadev.itch.io/idle-cultivation-path). Retrieved 2026-10-14. Bundle: 18,891,219 bytes, SHA-256 `42029c9283d2cd43d20787b932027aea8344a8a2d108e545b97698db713ea404`. The prior report records this same hash. No source-map reference is shipped in this bundle. This pass did not claim a version from a page comment.

Throughout these files, **shown** means statically read in a handler or table, **stated** means page/guide text, and **inferred** means the assessment drawn from those sources. `L` means line in `~/.codex/research/path-idle-cultivator/extract/readable.js`, generated with pinned js-beautify 1.15.4 and `-x -s 2`. [TOOLING.md](TOOLING.md) makes those locators reproducible. Nothing here is observed gameplay. Raw code and assets remain outside the repo.

## Ranked PROPOSALS for YAIRPG

All are unselected. Existing cultivation direction requires world-specific methods and keeps trial, advancement and legacy separate. The first milestone remains one realm/one prestige layer. No proposal adopts lethal failure, fixed one-use opportunities, or another mandatory world.

| Code/rank | Proposed result | Owning system | Source reason |
|---|---|---|---|
| P1 | A breakthrough trial offers an explicit settle-now outcome and a better outcome for pressing onward; preserve the result before confirmation. | [Cultivation paths](../../../RESEARCH_CULTIVATION_PATHS.md), techniques and consequence executor in [engine owner](../../../ENGINE_EXPANSION.md) | F2/F4; grade the attempt without equating a low grade with death. |
| P2 | Techniques change how an action works: timing, reach, repeated strikes or interception, with readable costs. | Techniques, actor powers and [RNG/encounter owner](../../../RNG_ENCOUNTERS_AND_SOURCE_DEVELOPMENT.md) | Weapon skill tables supply function-changing effects rather than only larger stats. |
| P3 | Earned methods can coexist, each with its own bottleneck, resource and reset rule. Start with one main and one secondary. | Cultivation paths, body progression, engine scheduler | Main/secondary registry preserves distinct routes while combining useful effects. |
| P4 | Show the full resource path from room supply through gathering and refining to useful qi, including paid stone input. | Body/power/resource models and [UI owner](../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md) | The build exposes a matching qi breakdown instead of one opaque rate. |
| P5 | Reset preview names each kept, reset and conditional component before the player commits. | [Identity/control owner](../../../worlds/PLAYER_CHARACTER_IDENTITY_AND_CONTROL_2026-10-13.md), chronicle/heir and save compatibility | Selective carry creates new plans but conditional retention is easy to misread. |
| P6 | Authored unlock graphs use reusable threshold/counter predicates and typed rewards; text must match the actual predicate. | Discovery, content authoring, engine transactions | The meridian quest describes Golden Core but actually checks index 2. |
| P7 | A small authored room pool offers materially different objectives with depth gates and reusable layout rules. | [Wandering/insight owner](../../../WANDERING_ZONES_AND_INSIGHT.md), world/exploration authoring | Weighted pools plus qi toll, resistance and enemy-clear objectives. |
| P8 | Publish an honest clock policy and a receipt if offline work is later added; suspend at decisions and danger. | [Offline/branch audit](../../OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md), engine time owner | A stored timestamp alone does not establish catch-up. This is a proposal for explicit semantics, not adoption of Path's absence behavior. |

P1-P5 are the near-term choices. P6-P8 are separate later options. [Packets](IMPLEMENTATION_PACKETS.md) describe concrete proofs without authorizing implementation.

## Prior findings: confirm, correct, extend

| Prior finding | This pass | Label and locator |
|---|---|---|
| F9: every breakthrough is a 50-turn duel that normally kills | **Correct:** ordinary realms within a category advance automatically. The standard tribulation is 50 escalating-damage turns, can be accepted early, and zero trial HP finalizes an earned tier, not a death rebirth. Specialty trials require separate treatment. | shown, L81449-81479, L140356-140369, L140519-140660 |
| F9: 50 realms/seven tiers | **Extend:** normal catalogue has 79/12; demonic 40/10; astral 111/16. Availability depends on route. | shown, L79600-80048; mechanical count in local inventory.json |
| F10: dantian size/purity/impurity/demonic percent | **Confirm and refine:** purity is a derived available amount, maximum less corruption and impurities, clamped at zero; a special forced-corruption branch returns zero. Elemental nodes/slot connections are another axis. | shown, L92514-92570, L92625-92695 |
| F11: soul power permanent upgrades | **Confirm:** voluntary rebirth requires effective realm index 5; active-path realm progress contributes SP, modified by laws, trial bonus and Origin Power. Origin quests encourage trying different lives. | shown, L80008-80042, L81008-81035, L81193-81243, L136641-136706; Origin Power guide stated L17895 |
| F11: soul weapons/Legacy Vault kept across lives | **Refine:** soul slot unlock starts at weapon ascension 10; legacy begins at realm index 49 and conditionally preserves stones/inventory/manuals. Ordinary weapon inventory is rebuilt with explicit exceptions. Do not describe all equipment as permanent. | shown, L155840-155974, L112739-112753, L81054-81075, L81126-81175, L86850-86888 |
| F11: found a sect, alignment, missions | **Confirm boundedly:** sect unlock can come from obtaining a flag; ownership gates institution effects, and kingdom cultivation derives from sect karmic energy. Mission combat and war balance are not exhaustively traced. | shown, L59870-59895, L81700-81728, L131764-131856 |
| F15 offline comparison did not include Path | **Add:** traced web load/tick route has no elapsed-wall-time replay. | shown load/reset L80918-80948 and fixed calculation L81730-81767; inference limited to traced build |
| Prior deobfuscation deemed not worth pursuing | **Correct:** printable property/string names were enough. A pinned formatter decoded them in seconds. Variable-name recovery is unnecessary for this mechanism audit. | shown tooling logs and both syntax checks |

[Comparison rows](COMPARISON.md) extend the prior three-game comparison inside this lane's directory. The coordinator may incorporate them into the parent report. Proposed owner edits: correct parent F9/F11, add Path to F15, and link this report from the parent checkpoint. Do not turn P1-P8 into accepted decisions.

Detailed answers: [core loop](CORE_LOOP_DIGEST.md), [systems and resets](SYSTEMS_AND_REBIRTH_DIGEST.md), [content authoring](CONTENT_AUTHORING_DIGEST.md). Coverage and remaining gaps: [checkpoint](CHECKPOINT.md).
