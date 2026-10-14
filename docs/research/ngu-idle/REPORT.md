# NGU IDLE research, 2026-10-14

Status: PARTIAL. The three requested mechanisms are answered from selected installed-source traces and one official desktop screenshot. Whole-game semantics, serialized scenes and runtime behavior remain unread or untested. No gameplay implementation or acceptance is claimed.

**F1 Unlocks use two clocks.** Current-run boss progress opens Adventure, Augments, Time Machine and Blood Magic again after rebirth. Permanent loot-use flags open NGU, Yggdrasil, Diggers, Beards, Questing, Hacks, Wishes and Cards. Some buttons appear well before their actual loot unlock. The result is a staged network, not one universal level ladder. [Unlock digest](UNLOCKS_DIGEST.md), source E1/E2/E3 in [findings](FINDINGS.json).

**F2 Rebirth resets allocations and run levels, not all growth.** Basic Training loses levels but lowers future resource caps. NGU, Hacks and Wishes retain levels while losing allocations. Beards convert temporary growth into permanent growth. Advanced Training and Time Machine have perk-dependent banks. Most challenges reset NUMBER and those banks; Laser Sword starts through ordinary rebirth instead. [Reset digest](REBIRTH_AND_CHALLENGES_DIGEST.md), E4/E5/E6.

**F3 The UI gives systems stable addresses.** An official 1680 by 1050 screenshot shows a stats rail, a feature rail and one large active page. Source swaps canvases rather than displaying every system together. Timers, progress bars, current/next comparisons, help and readiness colors reuse grammar across features. The screenshot is historical build 0.427-2, not the installed build's runtime proof. [UI digest](UI_DIGEST.md), E7/E8/E9.

## Ranked PROPOSALS

These are review candidates, not accepted decisions. No owner changes are authorized by this report. Keep reasonable routes reachable; do not import NGU's short-life cadence, hard reward caps or fixed single-use rules as YAIRPG design limits. Desktop and laptop remain primary.

| Rank / code | Proposal and disposition | Existing owner / implementation seam | Cost and acceptance |
|---|---|---|---|
| 1 / P1 | Adapt a quantified reset preview: current value, next value, lost, retained and dormant-until-reactivated | `docs/STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md`; `src/structured_renewal.js`; `src/heir_inheritance.js` | Small projection for one existing transition. Fresh preview must match committed state; reload/import and stale-preview refusal |
| 2 / P2 | Adapt explicit unlock reasons: discovered, permanently learned, temporarily unavailable, ready | `docs/TECHNOLOGY_AND_PROGRESSION.md`; thematic UI owner; existing command facts | One system pilot. Known prerequisites explained without exposing sealed truth; completed discovery survives reload |
| 3 / P3 | Trial a desktop activity board with independent routine panels and a persistent resource/status rail | `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`; `src/action_legibility.js`; `src/feature_expansion_work_plan.js` | Medium UI join. Rebuilt 1366 by 768 and 1920 by 1080 views, routine actions visible and statuses truthful |
| 4 / P4 | Adapt one voluntary challenge as an explicit conduct that changes a real consumer | starts/endings owner; current native command and combat owners | Medium authored consumer. Restriction enforced during ordinary play, reward used later, cancellation and import exact |
| 5 / P5 | Adapt a retained-mastery explanation when local training restarts | technology/progression owner; current skill/practice owner | Small explanation, no new growth model. Display predicts actual next practice cost or speed |
| 6 / P6 | Adapt a pre-transition reminder for a ready unclaimed result or funded work commitment | thematic UI owner; simulation jobs and work-plan facts | Small projection. Warn from actual ready state; no fake timers or repeated nags |
| 7 / P7 | Adapt stop-at-target and return-of-capacity feedback for existing finite plans | `src/feature_expansion_work_plan.js`; `src/simulation.js` | Small UI join. Target completion clears only its own reservation; unrelated work keeps running |
| 8 / P8 | Park multi-resource late-game projects until a world supplies real distinct means | technology/progression owner; simulation site/actor reservations | Authored content cost. Three inputs must have different causal roles, with shortage and cancellation paths |

## Prior-lane comparison

No prior dedicated NGU output was found in the research tree before this pass. These comparisons refer to the live reports read in this lane, not memory or a claim of current gameplay acceptance.

| Prior lane / finding | Disposition | NGU contribution and limit |
|---|---|---|
| [Idling to Rule the Gods](../idling-to-rule-the-gods/REPORT.md): shared allocation, targets and explicit carryover | Confirms / extends | Multiple controllers reset only allocations while retaining growth. Adds distinction between ordinary banks and challenge bank wipes. Does not justify another scheduler |
| [Melvor](../melvor-idle/REPORT.md): joined settlement projection and real policy consumers | Confirms | Readiness cues and reset arithmetic should project authoritative state. Challenge names alone do not supply enforcement |
| [Open idle games](../open-idle-games-2026-10-09/REPORT.md): Progress Knight promotion/carryover and Quest parallel training | Extends / corrects generalization | NGU's parallel systems are financed by competing pools and unlocked on different routes. Parallel progression does not imply all detail panels appear together |
| YAIRPG long-life and desktop direction in live owners | Constrains transfer | Borrow preview and navigation grammar. Preserve lives spanning many sessions and useful independent desktop panels |

## Evidence and remaining gates

Installed Steam build 6938742 passed the payload gate. The managed assembly was exported successfully with ILSpy; hashes and source anchors are in FINDINGS.json and private `extract/HASHES.txt`. Reading C# establishes shown-source mechanisms, not execution. The recovered project was not built or run. Only this output directory was written in the repository; raw assembly/code and screenshot stay under the work area. No saves, bottles or Steam dialogs were touched; no staging, commit or push.

The official [Steam page](https://store.steampowered.com/app/1147690/NGU_IDLE/) states unfolding features and mixed idle/active play. Public wiki pages failed on fetch, so their snippets were treated as leads and replaced by installed-source evidence. See [tooling](TOOLING.md), [packets](IMPLEMENTATION_PACKETS.md), [small touches](SMALL_TOUCHES.md) and the exact unread table in [checkpoint](CHECKPOINT.md).
