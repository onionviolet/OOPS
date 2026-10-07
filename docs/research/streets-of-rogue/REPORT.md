# Streets of Rogue source review, 2026-10-06

**Available-source review is complete. Original Streets of Rogue gameplay source is unavailable, so the five original-gameplay traces remain unmet.** Nine bounded RogueLibs/framework compatibility and Wizard-mod paths were read, reviewed and integrated. These do not establish whole-game behavior or a working recovered game. Current YAIR source already has concrete consumers for all five proposed interaction families; this pass recommends no duplicate implementation packets.

The [intake](INTAKE.json), [findings](FINDINGS.json), [coverage](COVERAGE.json), [reuse handoff](IMPLEMENTATION_PACKETS.md) and [validation](VALIDATION.json) retain the exact evidence and limits. Raw third-party source stays in `/Users/weiwei/.codex/research/streets-of-rogue/`.

## Source qualification

| Input | Pinned source | Qualification |
| --- | --- | --- |
| RogueLibs | `d76523acb484168f4d2d1d7bc0fce0d2c5d263f1` | Archived MIT framework; 450 tracked files, 217 C# files inventoried. Only declared code spans were semantically reviewed. No main game assembly or full game decompile. |
| redaphid multiplayer/Wizard mods | `01f205c57f65ab98276c6989da6d98eddeb89c65` | 104 tracked files, 45 C# files inventoried. Actual mod code is readable; its external game calls remain boundaries. No installed-version correspondence established. |
| Local game | None found in targeted inventory | The declared Steam library has no app 512900 or Streets assembly. Targeted `Downloads/Games` filenames also yielded none. No whole-machine/account search, purchase, install or launch. |

The multiplayer README lists a `decompiled/` reference folder, but [the pinned ignore file](https://github.com/redaphid/streets-of-rogue-multiplayer/blob/01f205c57f65ab98276c6989da6d98eddeb89c65/.gitignore#L1-L3) excludes it. The pinned main tree and all eleven visible branch-tip trees contain zero such files or `Assembly-CSharp.dll`. This does not prove that no historical/private/public source exists elsewhere. RogueLibs [references an external main assembly](https://github.com/Chasmical/RogueLibs/blob/d76523acb484168f4d2d1d7bc0fce0d2c5d263f1/RogueLibsCore/RogueLibsCore.csproj#L32-L42), rather than providing it.

## What the code actually shows

| Trace | Reviewed implementation | Important boundary or exception |
| --- | --- | --- |
| RL-01: NPC menus | Framework captures game-determined buttons and queues named speech/operation/protection/unlock side effects during interaction gathering. | Actual relationship/hostility/ownership and NPC button rules remain external. Deferred side effects are not proof that every preview is pure. |
| RL-02: doors | Compatibility provider chooses local/remote, trap, key, lockpick, crowbar, knock and implicit open/close options from current actor/object state. | Tool operations pass time/noise arguments; actual wear, noise reactions and quest settlement bodies are missing. |
| RL-03: items | Separate use/combine/target interfaces, redirectable cancel checks, diet/body/trait gates and actor restoration. | Filter results do not alone gate the action callback here. Custom actions must guard execution; callbacks do not provide transactional rollback. |
| RL-04: environment | Computer inspects linked chunk/sector devices and technology traits; ventilation rejects broken/already-gassing targets. | Propagation, damage, evacuation, material debit and objective outcomes are external. |
| RL-05: abilities | Grant/press/hold/release callbacks, target polling and recharge interfaces. | Recharge observes a count; it does not itself decrement it. Coroutine exception cleanup is not guaranteed. |
| RL-06: traits/effects | Factory attachment, update/removal/refresh callbacks and update-hook disposal. | Duration decrement and vanilla cleanup internals are external; some callbacks can throw after attachment. |
| RL-07: unlocks | Named prerequisites, zero-cost forced unlock extension, serialization and custom backup restoration. | Paid purchase debit is external. Forced-unlock flag restoration lacks `finally`; backup failure can occur outside the main save catch. |
| MOD-01: Wizard casting | Four-count cooldown is charged before RNG and spell calls; explicit projectile/status/blink selection. | Fizzle or caught cast exception keeps the cooldown. Random results are not stored as durable plans. |
| MOD-02: Wizard quest | Six-second ability-hit attribution, consumed tag, host neutralization count, completion at eight and separate payoff requests. | Partial kills are memory-only in this file. Completion/unlock saving and payout are separate, so partial payoff is possible. |

Each trace includes callers, prerequisites/costs, mutations/aftermath, a failure boundary, exact spans and complete hashes in [FINDINGS.json](FINDINGS.json). The three lifecycle paths also preserve the reviewed [reader notes](FRAMEWORK_LIFECYCLE_NOTES.json); six coordinator paths live in [parent notes](PARENT_SOURCE_NOTES.json). Original-game paths completed: **0/5**.

## YAIR handoff

The [current owner audit](YAIR_OWNER_NOTES.json) confirms actual source consumers: alternative shelf repair and sluice approaches; conserved items/custody/material transformations; owned actor powers and condition-aware fixed NPC combat decisions; local environmental phases and timed conditions; and explicit optional feats/conduct/preparation records. Their native hosts reach the shared staged publisher. This is source integration evidence, with gameplay still **implemented-unverified**.

Reusable lessons are contextual eligibility, distinct owned means, actor-attributed consequences and separate transient/run/retained state. Those are design inferences from the qualified code. No new city simulation, general AI, random-spell system, unlock/save framework or reset policy is selected. The [handoff](IMPLEMENTATION_PACKETS.md) lists five existing player journeys, their costs/aftermath, save implications and later acceptance. No actual missing consumer was justified, so the ranked new-packet list is empty.

## Exact remaining intake

Original gameplay review needs an accessible Streets of Rogue 1 `Assembly-CSharp.dll` plus its sibling managed dependency assemblies from a supplied/authorized build, or an inspectable pinned original-gameplay reference. Record build/assembly version and hashes before a private ILSpy export. Needed method bodies include `Agent`, `AgentInteractions`, `Relationships`, `Quests`, `StatusEffects`, `ItemFunctions`, `PlayfieldObject`, `Door`, `Computer` and level generation. Assets and personal saves are unnecessary for this code-review gate. Existing private ILSpy tooling is identified in [Qud intake](../caves-of-qud/INTAKE.json); it was not invoked here.

JSON, source spans/symbols/hashes, committed-source correspondence, representative remote pin readback and local document links were checked. Initial helper citation errors were repaired; moving YAIR inputs were frozen privately and consequential source evidence re-read. No runtime change, rebuild, game execution, gameplay/browser/save/failure/regression suite, personal-save access, commit, publication or automation occurred. [Existing later acceptance](../../gm/reference-gameplay/ACCEPTANCE_BACKLOG.md) remains deferred and unrun. Upstream YAIR attribution/LICENSE are untouched; RogueLibs and mod authors retain source attribution. NGU advice remains dispatcher-owned.
