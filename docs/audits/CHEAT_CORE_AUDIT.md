# Cheat implementation core audit (repeatable)

Saved 2026-10-23 after the first run. One instance of the
[topic expansion audit playbook](TOPIC_EXPANSION_AUDIT_PLAYBOOK.md). Running it
produces proposals only; it never selects build scope or changes a standing priority.

## Owners

| Owner | Role |
|---|---|
| [Cheat library](../CHEAT_LIBRARY.md) | Root palette; rounds are appended. Latest: "cheat implementations, carry, wiring and the next cards (2026-10-23)", codes IM1 to IM20 |
| [Cheat cosmology](../CHEAT_COSMOLOGY.md) | What backs a cheat, reach, world interaction |
| [Access design discussion](../gm/CHEAT_ACCESS_DESIGN_DISCUSSION_2026-10-15.md) | CA1 to CA14 accepted answers |
| [Run 1 dispatch](../gm/dispatch/cheat-implementation-2026-10-23/) | Lanes K1 to K6 |
| Code | `src/cheat_cards.js`, `src/status_window.js`, `src/new_game_beginning.js`, `src/carry_ledger.js`, `main.js` cheat hooks |

## Rerun triggers

| Trigger | Lanes |
|---|---|
| Heir, death, rebirth or carry code changes | K1 |
| `cheat_cards.js`, save envelope or load path changes | K2 |
| Panel kit, dev console, `main.js` cheat hooks or a new card | K3 |
| A card ships, or a book/world adds a cheat | K4 |
| Stages, points or continuation direction changes | K5 |
| `rule_modules.js`, `carry_ledger.js`, `seeded_streams.js` or leak lint changes | K6 |

## Run log

| Date | Lanes | Result |
|---|---|---|
| 2026-10-23 | K1 to K6 (Claude sonnet, read-only, static reading only) | IM1 to IM20 in the library. Headline: heir succession drops the cheat and no default route grants one. Nothing built, run or committed. |
| 2026-10-25 | D4; two bounded source/test readers, parent code owner | Quiet faculty, four native modules and finite accompanying-system quest implemented on the D4 branch. Actual browser Save/reload/Import and heir boot checked; final gate receipt in [checkpoint](../gm/dispatch/cheats-2026-10-25/CHECKPOINT.md). The [source-row inventory](../gm/dispatch/cheats-2026-10-25/INVENTORY.md) distinguishes these slices from unfinished reference powers. IM21–IM28 extend the root palette; they do not change accepted world rules. |

## Round 2: the base cheat, deep pass (2026-10-30)

Requested by Weibao 2026-10-30: look again at the base cheat's UI, capabilities and progression loop; implement the gaps and
impossibilities. Codes continue IM36 onward from the [library](../CHEAT_LIBRARY.md). Proposals unless marked built; none changes a
standing priority. Desktop 1920x1080 is the target; mobile stays deferred.

**What it is now.** The base cheat is Continuing insight (`quiet-faculty`, no voice, AD29). Lived milestones earn insight; insight
buys the next of eight facets (appraisal, loaded dice, fate ledger, habit, pattern book, heirloom compact, patient furnace,
freshness sense) or restores one reserve. Learned facets follow the self through return and heir; reserves are per body.
The optional system is a separate dormant card with a status window.

**Stale finding.** The 2026-10-23 headline "heir succession drops the cheat" no longer holds for the faculty (`life_experience_host`
calls `carryCheats` with `heir:true`). It still held for the accompanying system, which vanished at succession (IM36).

| Code | Row | Level |
|---|---|---|
| IM36 | Heir route for line-bound cards. Impossibility: "a system cannot follow a new body." Mechanism: reach dial per card, default `line` for the system and ring spirit: re-granted dormant, points and claims reset, awakening again at the cost of the first days. Self-bound faculty keep stages. A world's inheritance law may set `none` or `self`. | ACT NOW, **built** (`HEIR_REACH`, `carryCheats`) |
| IM37 | Growth made visible: a track (Faint, Steady, Practised, Deep, Far-reaching), unlocked facets, next facet still named "undiscovered", next cost and where it comes from, limits as adjectives (reach, reserves, fuel, recovery). Derived from existing state, nothing persisted. | ACT NOW, **built** (`cheat_growth.js`, panel card) |
| IM38 | Look by cheat kind as data: mark, hologram (system, AI ring), ring spirit (ink wash, italic), ledger; unknown kind falls back to plain. Kind comes from the card's source kind, then family, never the world. Images and ASCII variants are later skins on the same keys. | ACT NOW, **built** (`CHEAT_KINDS`, `cheat_faculty.css`) |
| IM39 | Voice slice: a status-window card speaks in its kind's register; line is deterministic per progress state (no flicker, no repeat while state changes). Unreliable dial: the ring elder boasts a tier ahead and the true tier prints beside it, so the player can catch it. | ACT NOW, **built**; the ring elder has no grant route yet (see IM44) |
| IM40 | Tier effects. Impossibility: "power must not scale." Mechanism: a tier raises a facet's reserve cap by authored step, paid by insight already spent, with strong effects (UI-breaking, world-bending) gated to the top tier and a world dial. Needs `validateModuleState` to read tier. | ACCOUNT FOR NOW (persistence decision first) |
| IM41 | Mark with lore: a card whose first message and tier names come from a world's lore row (origin, who bore it before). Data on the kind; written per world. | LATER (Sol, per world) |
| IM42 | Warn on entering a world without the right cheats: a gate row listing which facets the destination expects and what the walk costs without them. | ACCOUNT FOR NOW (needs the crossing owner, WER) |
| IM43 | Selling cheats: a cheat that works around selling (a trade workaround), as a facet whose mechanism is a price-path, not a ban lift. | LATER (economy owner, G11) |
| IM44 | Grant routes. The optional start grants only the system. Premise intros (gap-generators) should grant a kind through `grantCheat` with a stated route; ring elder, EMC and grandpa-in-ring need cards. | ACCOUNT FOR NOW (hand to generators) |
| IM45 | Heir with fresh world rules: `HEIR_REACH` read from the world's inheritance law instead of one default. | LATER |
| IM46 | Talking cheats beyond one line: memory of what the player did, per-kind lines in the world's voice, reuse of the talk view's no-repeat rule. | LATER |

**Compatibility.** No saved field changed. Projection, skin, track and voice are derived; the heir line re-grant uses the existing
card schema. Old saves load unchanged; an existing heir save simply has no line card until the next succession.

**Verification.** `tests/cheat_growth.test.js` and the updated `tests/cheat_carry.test.js`; browser floor recorded in the
[checkpoint](../gm/dispatch/cheats-2026-10-25/CHECKPOINT.md) once run.
