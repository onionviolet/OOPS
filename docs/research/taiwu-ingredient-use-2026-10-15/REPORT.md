# DQ1: one Taiwu herb, manufacturing and actual code consumers

2026-10-15. Research/decompilation only. No implementation or accepted YAIR design. This lane owns only this directory. [Flow](INGREDIENT_TO_USE.md), [UI observations](UI_EVIDENCE.md), [exact locators and receipts](REFERENCE_INDEX.md), [ranked comparisons](FOLLOW_ON_COMPARISONS.md), [validation](VALIDATION.json).

**F1: the correct join closes two medicinal uses of one ingredient.** Material **140, 接骨草**, has `CraftableItemTypes = [158, 2]`. These are **MakeItemType** IDs. Type158 contains MakeItemSubType240 and216, whose base results are Medicine274 and60 respectively. Selected grade derivation reaches **Medicine275, 壮骨膏**, a temporary strength-hit bonus, or **Medicine61, 续骨膏**, an immediate outer-injury treatment. This is a source trace through actual character consumers, not a fresh craft/use observation. Type2 is a separate 药霜 route; its table references are preserved, but its output use was not investigated.

**F2: the frontend materially narrows the earlier timing claim.** The [prior trace](../procedural-crafting-ui-2026-10-15/TAIWU_CRAFTING_TRACE.md) correctly found a stored work record and month-decrement method. However, the inspected manufacture confirm handler calls `StartMakeItem`, then immediately requests `GetMakeItems`. The latter removes the record and creates outputs without testing `LeftTime`. Both selected medicinal subtypes also have configured `Time = 0`. These fields do **not** prove a mandatory delayed manufacturing queue in this frontend. No source owner outside this lane was changed.

**F3: identity and custody survive the inspected calls, within a narrower limit than “a real lot was tested.”** Frontend selection passes `ItemDisplayData.RealKey` and source custody into the start request; the backend removes that key/count from that source and retains its key in the work record. `ItemKey` includes item type, modification state, template ID and instance ID. Unmodified stackable stock canonicalizes to ID0. No personal save was read, so no actual owned lot, count, tool condition, character attainment or runtime output ID was sampled. [The flow](INGREDIENT_TO_USE.md) distinguishes exact template IDs and a conditional source example from unknown live instance IDs.

## Source boundary and reading scope

Local appmanifest reports build25845203. Current byte pins match the earlier dossier: backend GameData `0f56b7b7bb324e95389e587b864cb9a06dc69d5859ef7f55c71aa0a05f29e1e4`; shared `4fa0a319209ef61af2e0b82d1d447431f5d20cad42a369388b5cf0c4fd962080`; frontend `a677fc7ffa7118dbc7d1cc33fc354bf11f017e03db0af25c901cc2a1440faacd`. Build metadata and file matches do not prove compatibility or successful launch. The independent official UI announcement is labelled #260722, July22,2026; its screenshots are not identified as this installed build.

Read PROJECT.md's current summary/direction, relevant USER_VISION research/material/UI direction, AGENTS.md, source deep-dive and acquisition rules. Reused the parent synthesis, Taiwu trace, reference/UI indexes, book and online comparisons, plus prior Scroll of Taiwu source/tooling locators before extraction. The repo was already heavily dirty with other active work. Only this lane was written; no workers/chats were dispatched.

Existing ILSpy11.1.0.9782 inspected assembly bytes using the existing .NET root. Fresh decompilations of BuildingDomain, Character, CharacterDomain, MakeSubPageMake and MakeItemType exactly match their reused text. Fresh use-screen, eating utility, injury-admission, eating-state, key/schema/global-config and effect-subtype helper extracts close named gaps. Three wrong fully qualified type names failed; successful corrected names and the failed attempts remain in receipts. No assembly was loaded to run game code.

Whole retained constructor tables: Material350, Medicine441, CraftTool55, MakeItemSubType314, and newly normalized MakeItemType183. The new parser checks arity/unique IDs and the selected correct joins. Complete source bodies and CN localization tables remain [private](private/). Retention/parsing is not semantic reading of every method or every row. Semantic coverage is the selected methods, conditions, rows and image observations indexed here.

## What the chain establishes

| Code | Established from inspected source | Practical distinction |
|---|---|---|
| F4 | Selected target275 maps by medicine group274 to subtype240 and type158; target61 maps by group60 to subtype216 and the same type158 | One herb can support distinct useful products without an active raw-herb primary/secondary chemistry model |
| F5 | Eligibility combines role/type, material grade range, actual relevant skill/tool contribution, building capability, quantity, resource allocation and tool wear | A supported recipe family does not mean every owned input/actor can make every member |
| F6 | Start spends ingredient quantity, resource quantities and tool durability; collection creates output stock; use moves stock to eating ownership or applies an instant effect | Material, reusable wearing tool, resource budget and usable output have different accounting roles |
| F7 | Medicine275's duration-bearing slot contributes its configured120 additive `HitRateStrength` through the eating helper and character `CalcPropertyModify` into `CalcHitValues`; expiry clears the slot | `EffectType.Invalid` on this medicine does not mean inert: its property-add subtype has a separate consumer |
| F8 | Medicine61 routes to immediate injury mutation, with body-part/eligible-injury and main-attribute requirements | An alternative use has a different consumer and admission, not merely another icon with the same bonus |

All350 default Material rows still have Invalid primary/secondary medicinal effect fields. Material140 has zero direct medicinal bonuses in that row. This prevents attributing the finished medicines' effects to a universal raw-herb chemistry. Medicine275's Invalid instant-effect type is a **different** case: its nonzero property fields have a traced active consumer.

## Failure, cancellation and recovery limits

Selection cancellation clears the target/material/tool setup and refreshes candidates/quotes. It occurs before the debit call. Confirmation requests a backend condition check; a false result takes the UI rejection branch without calling the start action. The condition method is not a full transaction or complete server-side validity proof. Start and collection are separate calls; start trusts some supplied arguments, and collection removes the work record before iterating output creation. A crash-safe rollback, exactly-once delivery or refund cannot be inferred from that ordering. No exploit claim or malformed-request test is made.

No post-start cancel/refund operation was established for the chosen immediate route. Stored work fields and a getter exist, but save/reload recovery and interrupting the start→collect interval remain untested. This is a precise state-boundary gap, not permission to launch or access saves. Use admission checks slot capacity and relevant conditions; backend mutation is not assumed to repeat all UI guards. Medicine61's source applies its effect before a later attribute check, so the whole call should not be represented as an independently proven atomic admission boundary.

## Remaining finite questions

| Code | Unverified question | Smallest evidence that would close it |
|---|---|---|
| Q1 | Does the pinned build expose this exact target→herb→tool→quantity→result→use sequence in play? | Separately authorized disposable-profile craft/use on a supported environment; record actual keys, pre/post stock and character outcome |
| Q2 | What happens across the start→collection interruption, failed delivery, or retry? | Narrow call/serialization and exception review, then separately authorized disposable recovery trial; no refund/atomicity claim until then |
| Q3 | How do medicine result/use screens, keyboard/back/scroll and scaled text behave at laptop size? | Native screenshots and interactions on a populated disposable state at1366×768, with larger-text checks; July media cannot substitute |
| Q4 | Does the alternative medicine's body-part selection and attribute spending match the static chain? | Craft61, apply to an eligible injury, record attribute/injury change and inventory; include a blocked condition |
| Q5 | Are craft/use/expiry states preserved across save/reload? | Separately authorized test-profile persistence trial; no personal saves, imports or compatibility changes in this task |

Research acceptance is met at the static-code layer: pinned ingredient→selection→cost→output→actual code consumer, two medicinal routes, six directly inspected/captioned official images, full selected raw details, reproducible joins and checked receipts. All native gameplay, persistence, geometry and human acceptance remain open. Mobile optimization, engine implementation and universal recipe rules remain deferred. No commit, push, install, purchase, game launch or source-library change.
