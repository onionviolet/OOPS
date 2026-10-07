# Rogue Legacy 1 source review

Completed source research for the five assigned gameplay paths. The strongest original YAIR transfer is a **real preparation choice whose equipment, body aptitude and paid actions change the outcome**, followed by frozen choices among funded NPC builds. This is a research handoff; no gameplay was implemented or behaviorally verified.

## Inspectable source

The published original C# FNA source is pinned at [b41c17888a91100bbf8f1febecaa636a1b421f5b](https://github.com/flibitijibibo/RogueLegacy1/tree/b41c17888a91100bbf8f1febecaa636a1b421f5b), commit dated 2026-07-15. Source `AssemblyVersion` declares 1.2.0.0; that declaration does not identify an inspected retail installation. The actual edition for these findings is this commit. The private clone is `/Users/weiwei/.codex/research/rogue-legacy/RogueLegacy1`.

[INTAKE.json](INTAKE.json) fingerprints all 344 tracked files, including 290 C# files. Reading is limited to selected code ranges, with overlaps counted once and unread ranges explicit in [COVERAGE.json](COVERAGE.json). Hashing a file is not semantic review. [FINDINGS.json](FINDINGS.json) integrates 29 claims across five paths, exact symbols/spans/full-file SHA256 hashes and pinned source links. Three GPT-6 Luna medium readers returned disjoint notes; the parent qualified representative claims, checked consequential code and requested concrete repairs before integrating.

The [pinned README](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/README.md) specifies code only, FNA build only, without game assets or contentproj. The [custom source license](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/LICENSE.md) is noncommercial, requires origin acknowledgement if its software is used, markings for altered versions and preservation of its notice, and excludes redistribution of absent game materials without written approval. Cellar Door Games retains attribution. This lane imports no code, localized text, art, music or other game assets into YAIR. No purchase, installation or launch was needed for this reading, and none occurred.

## Five connected paths

| Path | Actual code result | Boundaries that matter |
| --- | --- | --- |
| P1: successor, traits and classes | Death records the character; three candidate builds are generated and saved only if offers are absent. Retained manor unlocks change the class pool. Class/trait/spell combinations are filtered; confirmation installs one build. Traits feed actual stat/movement/spell consumers. | Candidates are not ordinary rerolls on reopen. The purchased reroll has a used flag. Age fields generated for the portraits are not an elapsed-time life simulation. Class/trait compatibility checks do not imply every trait is balanced. |
| P2: manor, options and retention | Paid manor levels reveal neighboring options, alter stats and unlock classes/services/reroll. Upgrade data reconstructs saved skill levels. Gold survives the observed death reset, then the confirmed entrance toll spends uninvested gold. | Price is `base + ownLevel*appreciation + 10*totalManorLevels`. Architect reuses the saved layout with selected enemy/fairy/breakable resets; money pickups use a 0.6 earnings factor. These are distinct retention/loss boundaries, not a universal world rewind. |
| P3: catalog, equipment, runes and spells | Chest eligibility discovers a blueprint; a shop purchase owns it; equipment must fit weight. Runes occupy category indices and feed real movement. Spell input checks costs and dispatches spell-specific effects. | Too-heavy purchased equipment remains owned but unequipped. Rune prices escalate with all purchased runes. Savant can change the next spell after the base-cost check but before a mega-cast fails its higher cost. Failed firing is not necessarily mutation-free. |
| P4: procedural rooms, objectives and bosses | Area generation requires enough rooms and a boss entrance; retries can rebuild the level. Boss tags instantiate concrete rooms. Actual fairy-condition checks unlock/fail rewards. Eyeball boss defeat sets a regional flag; all four flags open the final door. | Room templates/assets are absent. Fairy gates run from Draw, with timer decrement under an unpaused check. MapData stores selected visitation/chest/failure/enemy state. Serialization and room-entry saves do not prove immediate durability at every mutation. |
| P5: combat, AI and aftermath | Range/difficulty/cooldown select AI; ShieldKnight stop/walk/turn behavior keeps an oriented defense. Block costs mana outside its immunity window; real damage can lead to revive, death dodge, challenge ejection or ordinary death. Enemy kills feed stock, run records and counters. | The shield contact guard requires PlayerObj; its nested projectile-destruction code does not establish projectile immunity. Damage reduction examines current target position/sprite rather than actual hit provenance. Comment wording is broader than the executable test. |

The interaction is the important part: retained purchases change offered builds; the chosen class/trait/spell combines with equipped functions; those functions change traversal/objective/combat possibilities; paid outcomes return gold, discoveries, boss access and a recorded life to the next choice. Separate [reader notes](readers/root.json), [gear notes](readers/gear.json) and [room/combat notes](readers/rooms_combat.json) preserve the detailed traces.

The trait-count thresholds reuse one inclusive 0..100 roll: two traits have code-derived probability 55/101, one 39/101 and none 7/101. Rarity's inclusive `<=` cutoffs similarly yield 49/101, 37/101 and 15/101. These calculations describe the inspected generator, not observed samples or balance.

## Current YAIR comparison and ranked handoff

[YAIR_INPUTS.json](YAIR_INPUTS.json) pins the dirty current source actually read; the recorded private snapshot preserves those exact inputs. Live source changed during reading, so affected simulation/effect/reference evidence was refreshed before final integration. Recheck those owners before implementing.

Existing YAIR already distinguishes inherited/trained/acquired sources, functional packing/route benefits, actual NPC gear, paid material responses, finite no-strike/prepared-team attempts, retained feats, useful workshop improvements, funded helper lives and one field renewal. The Village shelf supports ordinary → braced → sealed progression; brace is improvable, not an exclusive final branch. Completed Qud/DCSS/DDA research and its already delivered reference wave were reused without restarting their source intake. New reference gameplay remains implemented-unverified under the project's current test deferral.

The four [implementation packets](IMPLEMENTATION_PACKETS.md) rank:

1. An owned-rope versus consumed-kit preparation choice with distinct one-use native escape/guard consumers.
2. A concrete maneuver consuming existing awake balance or trained grip, with ordinary alternatives and real effort.
3. Three frozen, compatible, funded pathfinder offers bound to the existing durable helper/controller owner.
4. A new optional fitting-recovery objective, conserved handoff and useful paid recipe, keeping current recognition-only challenge contracts intact.

Each packet names the player choice/result, prerequisites/costs/aftermath, existing owner, actual narrow missing consumer, saved-state/retention decision and later playable gate. Numbers and fiction are original proposals. No general trait/actor/upgrade/challenge engine is requested by these findings. A forced heir reset, permadeath, another prestige, universal rune grid, copied world or platformer engine is unselected.

## Completion and remaining gates

[VALIDATION.json](VALIDATION.json) records JSON parsing, evidence line/hash checks, coverage bounds, source pin/cleanliness, local links and final artifact hashes. [CHECKPOINT.md](CHECKPOINT.md) records released reader/writer scopes and the finite completion receipt.

The five-path research objective is complete. Whole-source reading, every class/spell/enemy/room variant, balance, retail play, asset-complete build and behavior remain outside its coverage. No YAIR runtime/canonical/other-lane write, game suite, browser, generated save/reload, failure injection, personal-save/profile access, commit, publication or automation occurred. Any selected packet still needs integration, rebuild and the explicitly deferred playable/save/director acceptance. NGU advice remains with the dispatcher.
