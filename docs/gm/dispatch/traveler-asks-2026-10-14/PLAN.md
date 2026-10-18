# Traveler asks: reasonable, world-fitting requests (2026-10-14)

Weibao, 2026-10-14: "send out agents to setup reasonable traveler asks based on the world and more? more to consider?" This builds on the merged P4 travelers and P34 remembered requests (`759dd393`). Proposals below are not accepted decisions; Weibao judges fiction and balance in play.

## Original source snapshot, 2026-10-14 (historical)

- Generated travelers ask for one of three hard-coded items: `Stale bread`, `Rat pelt`, `Rat tail` (`src/generated_people.js` templates, `src/story_requests.js` `REQUEST_CONTRACT.items`, and both validators).
- Rat tail drops at 4-8% and Rat pelt at 1-2% from rats (`src/enemies.js:246-305`). The fee is 3-6 coins. Two of three fresh seeds in the R3-10 proof drew Rat tail, so most new players meet a grind for pocket change.
- Each traveler has one fixed goal for life; once fulfilled it never renews (P34 BACKLOG B5).
- Asks only exist in Village, `base.frontier`. No other world has generated travelers yet.

## More to consider

### Act now (inside TA1)

| Code | Consideration | Disposition |
|---|---|---|
| TA-A1 | **Reachability first.** Every ask in a pool needs a live route from the player's current stage: starting stock, a trader that sells it in Village, a gather action, a known recipe, or a common drop. Derive the pool from real game data, not a hand list | TA1 builds a pure obtainability index from live tables plus a lint that fails an unreachable ask |
| TA-A2 | **Reward fits effort.** Fee should track trader price and time cost (buy price plus a markup, or effort minutes for gathered/crafted goods) so asks are neither free money nor an insult. Keep integer coins in the existing denomination | Price-aware reward rule, unit-tested against trader prices |
| TA-A3 | **Saved-contract compatibility.** Validators hard-code the three items and `REQUEST_CONTRACT.revision:1`. Old saves with rev-1 travelers and requests must load unchanged | Contract and generation revision 2; rev-1 records stay valid under their own rule; no rewrite of saved goals |
| TA-A4 | **Draw stability.** Changing tables changes draws for new enrollments only. Address new draws by table revision (`village.generated_people@2` or a separate `asks` stream key) so a later table edit cannot silently reshuffle a saved world | Revisioned stream address; same-seed replay test |
| TA-A5 | **Fiction fit.** Ask follows the traveler's template (mender wants thread or hide, river traveler wants food or a float, courier wants a satchel strap or bread), season and weather where cheap | Small authored ask table per template with tags; no free text generation |

### Account for now

| Code | Consideration |
|---|---|
| TA-C1 | Quantity and quality: allow 1-3 of cheap goods, so one table covers "a loaf" and "three bundles of herbs". Validators currently assume `quantity===1` |
| TA-C2 | Show where to get it once known: if the player has seen the trader or source, the request line can say so. Never reveal undiscovered sources or sealed truths |
| TA-C3 | P2 mixtures and GX5 identified potions are now real Village goods. A "something for the road cough" ask that accepts an identified mixture by property ties procgen together. Design in TA3; build later |
| TA-C4 | Repeatable needs: a fulfilled traveler can raise a new need after time passes, with a per-world cadence adjective, not a "once" limit (standing solo-player rule). TA3 designs; TA1 must not block it (keep need revision fields) |
| TA-C5 | Headless runner (`scripts/run_story_spine.mjs`) and lint (`scripts/lint_story_spine.mjs`) are the right gates; extend, do not fork them |
| TA-C6 | Other sessions touch Village economy (absorb-all P23 market-life, household). TA1 works in its own worktree and touches only request/people/trader-read code; trader stock itself is read, not edited |

### Later / delegate

| Code | Item |
|---|---|
| TA-L1 | Per-world ask profiles for every playable and planned world (TA2, docs) |
| TA-L2 | Ask kinds beyond items: services (escort, repair, message), information, mixtures by property, teaching; repeatable needs; failure and lateness without punishing absence (TA3, docs) |
| TA-L3 | People-sight lens (GL4) showing a traveler's need and known sources; developer "ask reachability" report |
| TA-L4 | Generated travelers in a second world, using TA2's profile for it. Needs a world owner and its own lane |

## Lanes

| Lane | Task | Kind | Route |
|---|---|---|---|
| TA1 | Village asks v2: obtainability index, world-fitting ask table, price-aware fee, contract rev 2, lint and browser proof | code, worktree `ta1-village-asks`, branch `proc/ta1-village-asks`, port 22420 | Codex default model, high |
| TA2 | Per-world ask profiles: what travelers and locals reasonably need in each world, with sources and reward shapes | docs, `ta2/` | Codex default model, medium |
| TA3 | Ask kinds, repeatable needs and integration with mixtures, lore and lenses; ranked build slices on the P34 contract | docs, `ta3/` | Codex default model, medium |

Root merges TA1 after its gates; TA2/TA3 return to this folder. Next code lane (TA-L2/TA-L4) waits for Weibao's play feedback on TA1.

## Amendment 1 (2026-10-14): asks can be out of reach

Weibao: "The ask doesnt have to be someone a new palyer can get, it can be something the player cant get yet or dont know how to get and that makes the player go figure it out." This supersedes TA-A1's "fresh-player route" rule and TA1's "drawn only from items with a fresh-player route".

| Code | Consideration | Disposition |
|---|---|---|
| TA-A1r | **Bands, not a filter.** Ready/stretch/unknown describes the character's current means and knowledge. World-source uncertainty and missing implementation are separate authoring/coverage diagnostics; a missing indexed route does not prove a world-law impossibility. Admit the selected offer under its actual coverage contract and disclose known content limits before a committing edge. | TA1 reach index; AD6/AD38, current content-edge owner |
| TA-A1h | **Discovery hooks, honestly.** An unknown ask can give a clue through a real known channel, without disclosing the answer. A sealed secret can have clues along its intended discovery route; sealing is not a ban on discovery. | TA1 hint line; richer chains remain proposed |
| TA-A1p | **No pressure from absence.** An unreachable ask waits; the fee stays escrowed (P34 rule). Traveler may move on and return; no expiry penalty for not knowing yet | Keep P34 behavior |
| TA-A1f | **Fee follows the giver's terms, beliefs and actual means.** Expected effort or scarcity can justify more reward and non-coin payment. Do not derive the giver's knowledge from the player's private discovery state; existing ready/stretch/unknown reward variants need an observable basis or an explicit original contract before future adoption. | Future quote design; no runtime repricing in this audit |
| TA-A1x | **Harvest tie-in.** Asks like "a whole unblemished pelt" become natural stretch asks once carcass grading exists ([harvest plan](../harvest-modules-2026-10-14/PLAN.md)). TA1 must not assume today's item IDs are final | Keep the ask table data-driven by item ID and optional grade field |

## Current rule qualification, 2026-10-18

TA-A1's fresh-route filter was already superseded by Amendment 1. TA-A3's
unchanged-old-save requirement is currently qualified by the 2026-10-17
compatibility decision; record reset/drop versus retention, and preserve newly
created contracts through Save/reload/Export/Import. No personal-save access.

[TA1 report](ta1/REPORT.md) records a delivered v2 slice with its own bounded
checks and fee design; the old three-item source snapshot is not today's
capability claim. This audit changes no code or prices. For future changes,
separate modeled obtainability, the character's belief, the giver's appraisal
and known implementation coverage (AD6–AD9/AD38, AR7/AR8). An escrowed promise
keeps its agreed terms; repricing a later projection does not rewrite it.
NPC-heavy request generation remains deprioritized (AD33), not a required next wave.
