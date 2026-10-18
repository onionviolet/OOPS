# Caves of Qud wider systems audit

2026-10-15. Research checkpoint for YAIR reference, covering skills, social identity/records, powers/support, knowledge/materials, generated worlds/quests and their UI. The named chains are connected through actual source consumers. This is not a whole-game semantic review or native playthrough. No YAIR design decision or implementation follows from this report.

The supplied assembly is **2.0.211.56**, SHA256 `2cc28fba5a86221e27bfdcaa5f5a91a2e249fd474814dce7cff25a9a649b8589`. At the initial capture its bytes matched the installed app's assembly. The recorded installed-app path was absent during the depth2 continuation, and depth3 subsequently verified matching bytes at the current Steam CoQ.app path. The app was not launched. Existing targeted archives were reused; the historical full 5437-file export path is currently absent. Fresh targeted ILSpy output and live repass inputs supply this packet. [Source inventory and receipts](SOURCE_INDEX.md) explain those layers and the early incremental-receipt limitation.

## Findings and connected traces

| Code | Finding | Detail |
|---|---|---|
| F1 | Skills are acquired components with concrete consumers. Purchase, contextual teaching, borrowed grants and current execution eligibility are different gates. | [Full tree catalog, acquisition, active Jump and passive Spry/Axe paths](SKILLS_AND_PROFICIENCIES.md) |
| F2 | Display titles, named faction ranks, numeric reputation, profile achievements and run records have distinct owners. Item naming can optionally bestow mechanical properties; that does not establish a universal title-power system. | [Titles, names, reputation, teaching and achievements](TITLES_NAMES_AND_REPUTATION.md) |
| F3 | Inherent mutation, equipped grant, implanted skill and borrowed body have different support, rank and loss rules. Skillsoft and mutation-modifier tracking can preserve other remaining sources. | [Mutation/item/cybernetic/control-transfer traces](POWERS_AND_SUPPORT.md) |
| F4 | Identifying an object, learning its recipe, retaining a reference, paying construction means and using the output are separate states. Data disks and psychometry illustrate different access routes. | [Identification, books, tinkering, cooking and material joins](KNOWLEDGE_RECIPES_AND_MATERIALS.md) |
| F5 | A generated fetch quest retains structured context and an item ID across deferred placement, early acquisition, recognition and turn-in. Intended arrival-order support exists, with important already-built-zone and recovery gaps. | [History/village/quest/item/persistence trace](GENERATED_WORLD_AND_QUESTS.md) |

The UI is part of those chains, not an image appendix. [UI_IMPLEMENTATION](UI_IMPLEMENTATION.md) follows details versus activation, confirmation, focus, cancel/return, ability commands, item context verbs, journal/map links and generated-result presentation. The terminal's text-completion callback reaches actual implantation. A preconstructed success paragraph is therefore not operation proof. One existing historical cooking image was inspected; its exact version remains unknown and its inline domain panel differs from the source-defined generic picker.

## What the catalogs cover

The archive retains all **21 skill entries and 123 power rows** from supplied Skills.xml, **132 mutation rows** including hidden entries, **150 static achievement declarations**, **5205 complete object blueprint records**, and all selected complete XML tables. Derived inheritance indexes identify 91 cybernetic and 964 TinkerItem-bearing candidates. Those last two counts include inherited/abstract/nonbuildable records and are not verified runtime item or recipe counts.

There are **128 complete targeted source classes** in this packet, with reading coverage declared separately. The earlier cooking archive has its own 212-class preservation and 66-domain mapping coverage. Those class counts overlap and must not be added into a whole-game coverage claim. [System catalog](SYSTEM_CATALOG.md), [source index](SOURCE_INDEX.md) and [private unread list](private/UNREAD_AND_UNKNOWN.json) distinguish full table capture, selected code review, inherited evidence and unreviewed neighbors.

The archive includes full selected classes/methods, XML/JSON trees, skill CSVs, exact string tokens and conditions, decoded flows, hashes and tool/input provenance. Raw proprietary text/source/images remain [private and ignored](private/README.md). Standard XML normalization changes only derived parser input; original files are preserved byte-for-byte. ILSpy/.NET license notices and supplied EULA provenance remain private. Public reports paraphrase; no proprietary code was placed in YAIR source.

## Ranked original YAIR comparisons

These are research comparisons, **unselected proposals**. Existing accepted direction, one realm/one prestige, actual owner authority, durable publication and desktop-first shared UI stay authoritative. No repository-wide missing-feature claim was made.

| Rank / code | Original comparison worth retaining | Why it could matter / later proof |
|---|---|---|
| 1 / P1 | Track an ability's supplier separately from inherent training, then recompute current support. | Losing one item/implant need not erase a separately earned faculty. A selected implementation would need real support-loss, overlapping-grant and saved-state checks. |
| 2 / P2 | Keep object identity, known method and reference access distinct. | A readable reference can permit construction without permanently teaching it. Verify custody, reference loss, actual payment/output and per-actor knowledge. |
| 3 / P3 | Define title/reputation/achievement effects through the world's actual consumers. | A social rank can unlock a service; a world or cheat can make a title grant a power. Cosmetic presentation, stored achievement and earned ability should not be conflated. This preserves YAIR's broader direction rather than importing Qud's boundaries as law. |
| 4 / P4 | Give a generated task a real target identity and known-information route before presentation. | Finding a target early can still count without duplicating the item. Later proof would cover arrival order, loss, turn-in, repeat rewards and reload. |
| 5 / P5 | Treat description, initialized state, activation and observed outcome as separate UI stages. | Current support and missing-means explanations can stay readable without pretending a preview is execution. Any YAIR change must use its accepted shared desktop components and populated-save viewport gate. |

## Checks and remaining limits

[VALIDATION.json](VALIDATION.json) records archive JSON parsing, supplied/installed assembly identity, retained input/output hashes, table census, source-range/symbol bounds, local links and private ignore coverage. These are research-artifact checks. No game/build/unit/browser/save/reload/import/platform-achievement or native interaction test ran. No new installation, account/billing/security change, personal save access, implementation, shared-owner edit, delegation, commit, push or publication occurred.

**R1:** Most individual skill/mutation/implant/generation methods remain unread. Full catalogs and explicit unread rows are available; exporting their classes is not semantic review. **R2:** Generic serialization intent is identified, while interrupted saves, object-link restoration, duplicate IDs and native round trips remain unproven. **R3:** UI prefabs/assets, native rendering, current retail/DLC/mod parity and all controller behavior remain open. These are evidence limits, not newly required YAIR gates.

The [checkpoint](CHECKPOINT.md) records what is finished at this bounded research scope and the exact questions that could justify another pass. There is no implementation dispatch.

## Deeper continuation, 2026-10-15

The research-only [skills, mutations and cybernetics supplement](depth-1/REPORT.md) adds effect consumers, formulas, combinations, limits and NPC policies, with complete private captures and explicit reading coverage. The initial audit above remains its own checkpoint; this does not change YAIR product authority or claim native verification.

## Unread continuation, 2026-10-15

The next research-only [effects, NPC and cleanup supplement](depth-2/REPORT.md) traces long-blade control, reactions/ranged upgrades, Sunder/Mirror/Mass Mind, follower support, temporary-copy expiry, anatomy, additional implants and gas navigation. Full private source and explicit unread inventory are retained; no native or implementation acceptance is claimed.

## Cleanup continuation and Steam pin, 2026-10-15

[Depth3](depth-3/REPORT.md) follows direct removal, effect/goal/flight/contents consumers and additional ability combinations. The current Steam CoQ.app assembly matches the existing pin; the older Applications path remains absent. The joined private unread inventory preserves captured-only and partially read limits.

## Field and physical consumer continuation, 2026-10-15

[Depth4](depth-4/REPORT.md) follows forcefield/stasis, gravity/fall damage, destruction/context, opinion expiry and teleport/burrowing combinations. [CURRENT](CURRENT.md) links the latest joined unread inventory; prior counts remain their dated scope.


## Depth 5 continuation, 2026-10-15

Queued vortex serialization, scheduling, expiry and cell-save consumers are now traced in [depth 5](depth-5/REPORT.md), with an [independent audit](depth-5/independent-audit/REPORT.md). Use [CURRENT](CURRENT.md) for current unread owners. Earlier inventories remain dated evidence; no whole-system or native completion is implied.


## Depth6 continuation,2026-10-15

[Alternate save roots](depth-6/REPORT.md) now establish conditional full-body preservation through Physics damage references, distinct from reference-only links, placement and activity. [CURRENT](CURRENT.md) points to exact updated unread owners. Earlier queue omission evidence remains valid with this qualification; universal disappearance is not claimed. Research only.


## Depth7 continuation,2026-10-15

[Recovery consumers](depth-7/REPORT.md) now distinguish retained effects/credit/HP access, generic null-origin movement and the missing automatic target selector. Party cell scans and AI nowhere guards are traced; exact unread owners are linked from [CURRENT](CURRENT.md). Metadata field references are navigation evidence only. Research only; no native recovery performed.
