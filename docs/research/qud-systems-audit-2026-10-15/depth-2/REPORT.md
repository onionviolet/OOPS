# Continued unread systems research

2026-10-15. Research-only continuation of [depth1](../depth-1/REPORT.md), following the request for remaining effects, combinations, NPC use and cleanup limits. Pinned assembly2.0.211.56, SHA256 `2cc28fba5a86221e27bfdcaa5f5a91a2e249fd474814dce7cff25a9a649b8589`. No product decisions or gameplay implementation follow from this archive.

| Code | New connected finding | Detail |
|---|---|---|
| F10 | Long blades share stance/AI/support control; En Garde skips Lunge/Swipe cooldowns, while reactions and ranged upgrades have distinct attempt/cost conditions. | [Skills and combat consumers](SKILLS_AND_COMBAT.md) |
| F11 | Channels, companions and temporary copies depend on supplier identity and removal order. Fugue cleanup prevents trading and expires copied contents; acquired permanent items follow a different path. | [Mutations and cleanup](MUTATIONS_AND_CLEANUP.md) |
| F12 | Implant prevention, duration modification, aftereffects and environmental output differ. Gas exposure also contributes actor-sensitive NPC navigation weights. | [Cybernetics and gas](CYBERNETICS_AND_GAS.md) |

This pass printed source windows for **54 types**, including **50 absent from depth1's instrumented read ledger**. It retains **23 nonempty complete support-class files** in its own source directory, with per-type receipts; other full classes reuse the existing private archive. These counts distinguish captures and printed windows from semantic review. The readable reports decode the named mechanisms, while exact full bodies, conditions, event strings and declarations remain ignored/private.

## K: additional combinations and limits

| Code | Combination | Source-supported result and boundary |
|---|---|---|
| K17 | Primary long blade + short-blade attack | LongBladesCore's stance hit/penetration hooks permit both attack skills under the primary long-blade condition. |
| K18 | En Garde + Lunge/Swipe | Clears current cooldowns, then skips new cooldown calls while Ultmode>0; energy and phase/movement gates remain. |
| K19 | Multiple Arms + multiweapon/single-weapon policy | Mutation changes chance only for its managed intrinsic nonprimary limbs; other event modifiers still compose. |
| K20 | Empty the Clips + Fastest Gun | Pistol energy factors0.5×0.75 before other modifiers and integer truncation. Ammunition/payment still lives in firing. |
| K21 | One Shot + learned rifle upgrades | Selected intended-target hit path applies learned suppression/wounding and conditional upgrades. |
| K22 | Rejoinder + many incoming misses | One checked opportunity per owner action interval, consumed before readiness/roll/weapon success. |
| K23 | Beguile + another follower route | Supplier-specific limits and exclusion masks can preserve leadership when one relationship ends; HP bonus is separately reversed. |
| K24 | Social Coprocessor + Proselytize | Adds route-specific capacity with integer compute scaling; does not similarly raise Beguile through this handler. |
| K25 | Inflatable Axons + unimplant | Source loss ends boost; boost removal attempts the sluggish aftereffect, which does not require source survival. |
| K26 | Poison/sleep/confusion gas + breath/phase/immunity | Effect acceptance and actor-sensitive path hazard both consult eligibility; planning quality remains unobserved. |
| K27 | Sunder Mind + damage prevention | Accrual precedes target damage resolution; terminal blast is not guaranteed to equal HP actually removed. |
| K28 | Mass Mind + Light Manipulation | Exact ability-class refresh plus AfterMassMind event resets light capacity through the previously traced listener. |
| K29 | Fugue copied gear + permanent acquisitions | Copied temporary children expire recursively; surviving nonnatural contents move through RemoveContents when context exists. |
| K30 | Force Bubble + movement/phase | Fields suspend and reattach around the owner, sync phase and validate supplier distance; no blanket guarantee every cell survives. |

## Remaining research boundaries

**R4:** Base removal and downstream cleanup are still needed for SunderMind unmutation, ForceBubble unmutation, companion-opinion lifetime, no-context temporary expiry and full MakeTemporary descendant cascading. Explicit absence of a call in one class is not a verified live leak.

**R5:** Shared Flight/ITeleporter, final Suppressed/Disoriented/Terrified behavior, normality/thermal output and mixed-source power ordering remain unread or partial. Many other individual mutations, skills and implants remain captured-only. [The exact unread inventory](../private/depth-2/UNREAD_AFTER_DEPTH_2.json) makes that remaining work recoverable without calling it complete.

**R6:** AI admission, generic actor execution, environmental navigation and actual observed NPC behavior remain separate evidence layers. No game launch, native encounter, save/reload/import, installed-runtime or current-retail equivalence test ran.

The previously recorded installed-app assembly path was absent at this continuation's check. Pinned input identity still matches; the old installed/supplied match is historical, not a current installed-runtime claim. The prior validation receipt is preserved privately.

[Validation](VALIDATION.json) covers source/input hashes, exact locators, linked artifacts and private-ignore scope. No shared runtime/design files, source library, installed application or personal saves were changed; no new workers, staging, commit, push or publication.
