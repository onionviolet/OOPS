# D7: generated households and chosen starts

Status: PROPOSAL, source-audited 2026-10-13; not implemented. Rank W2-5.

| Slice | Outcome Weibao can play | Owner docs | Dependencies | Proposed branch / port |
|---|---|---|---|---|
| D7-A Adult household start | Choose a Village household start in a fresh test save, meet generated relatives, borrow an actual tool, complete useful work, return it and see the relationship change | [Origins](../../../../worlds/ORIGINS_AND_WORLD_TIMELINES.md), [Starts palette](../../../../STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md), [Campaign framework](../../../../worlds/CAMPAIGN_FRAMEWORK.md) | P1 selection; P4 person IDs/names/traits/needs and frozen possessions mandatory. P2 knowledge projection contract reused; P3 a later household callback optional | `proc/w2-d7-households` / 19450 |

## Live audit and direction

| Code | Evidence | Finding |
|---|---|---|
| F1 | `src/npc_lives.js:5-22,25-31,39-42` | Maia/Oren/Lio and later family members are fixed; only lifespan varies by hash. It is a bounded public-life record, not a household generator or start authority. Keep its authored names/relationships intact. |
| F2 | `src/simulation_contracts.js:217-239`; `src/simulation_resolution.js:9-29` | Persistent actors and frozen spawn templates exist. Generated IDs need valid definition/template binding; P4's generator should supply that rather than bypass registry validation. |
| F3 | `src/simulation_effects.js:259-270`; `src/simulation_contracts.js:230-233` | Inventory ownership, custody and transfers have consumers. Household property must remain held by its actual owner; access/loan is different from giving duplicate starting gear. |
| F4 | `src/life_experience_host.js:10-25`; `src/main.js:1620-1649` | Heirs are built from fresh envelopes and real leftovers. This is not permission to use succession as a random-family reset. Existing body, powers, active jobs, claims and private saves must not be rewritten. |
| F5 | `src/simulation_contracts.js:235`; `src/simulation_effects.js:281-284`; `src/main.js:440` | Actor knowledge and seeded state exist; no generated household admission manifest or fresh-start composition selector was found in the audited owners. Those are new seams. |

Weibao requested generated families and varied origins (`docs/USER_VISION.md:1549-1553`). Origins expressly separate wealth, affection, actual means and predecessor powers. The expanded opening is suspenseful random entry, with no required Frontier completion (`PROJECT.md:295-310`; USER_VISION random-entry section). D7-A exercises **a chosen Village start**, not a forced default Village opening or a global world lottery. One realm/one prestige remains unchanged. Baby/tree starts stay reachable future possibilities and are not implied implemented by an adult-household prototype.

## Conflicts and gaps

| Code | Gap / conflict | Proposed resolution |
|---|---|---|
| R1 | Full origins combine unsupported body/era/world products | Constrain D7-A to the current original Village, present calendar and adult controlled character. Validate allowed template combinations before rolling. No label-only infant/tree body. |
| R2 | A family role could grant inherited powers/wealth implicitly | Declare known language, opening funds, owned possessions, borrowed property, debts and knowledge separately. No source/power inheritance in these templates. |
| R3 | P4 travelers are not necessarily relatives or guardians | Reuse the low-level person/name generator and saved identities, adding household-role constraints. Do not turn a currently visiting stranger into a retroactive parent. |
| R4 | Wealth could be equated with affection or harshness | Template correlations supply coherent resources/work/access; relationship stance is a separate authored row with causes. All first-slice starts have at least one attainable useful action, without imposing equal rewards. |
| R5 | Existing native new-game/save ownership lacks household admission | Commit only in the supported fresh-save creation path, after slot review; never apply to an existing life or overwrite another save. If that path is unavailable after integration, build its narrow adapter as part of this slice, not a runtime reset button. |

## Implementation contract

Three original authored packages, equally weighted: supportive modest workshop household, prosperous household with scheduled shared-tool access, and isolated caretaker household with a service contact. Controlled character is an adult newcomer/member with no predecessor techniques. Each package supplies two generated adult relatives/housemates, residence label bound to Village, one livelihood, one actual tool owner, one introductory work/service action, and one known obligation. P4 supplies names, two or three traits, a need/goal and frozen possessions; authored household rows constrain legal role/age/work combinations before generating details. Hidden traits and motives retain P4's knowledge rules.

| Template | Actual initial household-owned stock | Known first access / duty |
|---|---|---|
| Modest workshop | One Old axe, three Rough wood logs, six coins in tool owner's purse | Ask for a loan for one four-minute task; return tool and deliver prepared household wood |
| Prosperous shared workshop | One Old axe, six Rough wood logs, twelve owner coins | Tool available 08:00–18:00 played local time; paid staffed-service alternative while loan unavailable |
| Caretaker / service contact | One Old axe held by second member, two Rough wood logs, four owner coins | Ask actual second holder directly; no automatic control through family status |

These goods are declared new-origin resources created exactly once with admission, never inherited from another played life or reissued at visits. P4 personal possessions are generated under a budget that excludes these already-declared goods. Native tool definitions exist at `src/items.js:3774-3780`; local raw-log key is exported at `src/village_content.js:7`. Use the native key factory and the actual Processed rough wood template (`src/items.js:4124-4128`), not ad hoc renamed inventory keys. The controlled character's other funds/equipment/body follow the reviewed native fresh-start envelope, with no campaign credit.

Fresh admission: select eligible template using P1 `origins` once, then use P4 deterministic instance generation with stable household/member IDs and subkeys. Save the entire generated household/member snapshots, not just seed or names. Preview of the choice shows known surroundings and means without selecting a new family every render; a committed start has exactly one manifest. A later intentional reroll is a separate new-start policy; reload and Import do not supply it.

Proposed `expansion.householdStarts = {schema:1, revision:1, activeStartId, households:{}, starts:{[id]:{worldId, instanceId, eraId, templateId, templateRevision, selectedAt, selectionReceiptId, householdId, memberIds, knownFacts, obligationIds, admissionReceiptId}}}` plus the P4 person store and existing custody/relationship owners. Each `households[householdId]` contains residence, social role edges, actual goods/holder references and access schedule. No duplicated person inventory in the manifest. Validate reciprocal relationships, no self-parent/spouse links, acyclic parent graph, age plausibility for selected template, every member/holder in P4/simulation, and viable opening action. Do not expose prospective births/deaths or hidden roles in the menu.

First native loop: meet both household members; ask the actual owner for the tool; loan transfers one object with a receipt/return term. Owner supplies one of its actual logs for a four-minute/one-stamina wood-preparation job. Job consumes that transferred log, grants one Processed rough wood to the controlled inventory, and delivery transfers it to the household; only then two coins move from the owner's real purse to the player. No funded purse/log means no new paid job. Return the same axe key/count; the owner acknowledges fulfilled terms and changes one later access/offer (a second ordinary loan becomes directly available without the introductory request). Refusal or time-window unavailability has a two-coin staffed preparation alternative using the actual holder/tool and the player's own obtainable log; it produces the same processed wood without fabricating a loan or wage. Work uses actual stock, coin and played time; family membership does not mint repeated rewards or campaign progress. Existing stock is not resampled on visit or UI refresh. Idle queue may repeat only while the actual input/purse/tool support passes, then stops on shortage.

Persistence/compatibility: owner absent for legacy saves, no retroactive family roll. Root admits a new optional schema/version after integrated P4 ownership is known; reject unsupported versions before publication. Frozen template/content revision and admitted resources survive future catalogue edits. Starting body sources come from the native fresh envelope; D7-A does not strip them through an origin label. Household clock follows played local calendar; no offline aging, production or missed-duty penalty added. Infant phases, ancestry genetics, birth-to-death chapters, canon eras, heir linkage and global random-world entry deferred.

File ownership: new `src/household_start_{state,content,host,view}.js` and focused tests. P4 author owns any extension needed in `src/generated_people*.js` / `src/name_grammar.js`; D7 consumes its exported API. Root owns `src/main.js` fresh-start binding/save publication, `src/save_files.js`, `src/expansion_engine.js` and minimal content registration. No `src/npc_lives.js` replacement, general body rewrite or successor-flow change. Shared start/UI changes must be serialized with any active intro worker.

## Acceptance checklist (future, all NOT RUN)

- [ ] A1 SOURCE: eligible combinations only, same seed creates same household/names/roles/stock; role and age constraints pass; collision with authored names handled by P4; wealth and affection remain separate. Preview and repeated admission cause no new draws or resources. Tests and builder build pass.
- [ ] A2 NATIVE: fresh chosen Village start, meet two people, borrow, do useful paid work, return the identical owned tool, see the changed later offer. Exercise another template with materially different access/obligation; seed-only fixtures may cover the remaining template.
- [ ] A3 PERSISTENCE: Save/reload before work, while loan held and after return; Export then literal-file Import into a second fresh origin. Compare manifest, people/private traits, stock, custody, obligation, relationship, clock and next draw. Legacy save gains no household or relatives.
- [ ] A4 FAILURE: invalid composition, stale admission, failed durable publication and forged loan/owner references reject without a duplicated item, changed body or overwritten save. Declining obligation leaves an attainable ordinary route.
- [ ] A5 UI: rebuilt 1366x768 plus 1600x1000 shows known start terms, member contact, holder/loan and routine actions in existing panels. Mobile, child/tree/genetic play, full world entry and human acceptance remain separate deferred gates.
