# BitLife public FAQ and historical guides: aspect backfill

## Corrections

C1: No fresh contradiction to the prior age-up autosave and historical child-current-age findings. The latter still comes from the Version 1.14 guide, not current app verification.

C2: Fresh official FAQ provides more than four meters and annual choices: business ownership, suppliers, market research, facilities, product changes and an annual report. These extend the prior dossier rather than prove their internal formulas.

C3: Prior wiki access denial remains respected. Events and Relationships findings below are fresh search excerpts only, not downloaded wiki pages or a full current table. App version/platform parity remains unknown.

Date: 2026-10-14. Lane: bf-public-other. Status: PARTIAL at the whole-game level; all twelve aspects assessed below. Static public evidence only. Source pin: `No build/source acquired`.

Shown means a static source/schema read; stated means a guide/FAQ claim; inferred means a transfer proposal. Covered marks the bounded contract described, not every implementation or runtime behavior in that aspect. No install, game launch, build, save access or YAIR implementation. Every YAIR takeaway is a PROPOSAL. Canon-first order, one realm/one prestige milestone and desktop-first direction stay authoritative.

Private reacquisition: [work area](/Users/weiwei/.codex/research/bf-public-other/), [hash ledger](/Users/weiwei/.codex/research/bf-public-other/extract/HASHES.txt), [source index](/Users/weiwei/.codex/research/bf-public-other/extract/source_inventory.json), [page captures](/Users/weiwei/.codex/research/bf-public-other/extract/pages.json). No raw source, dialogue or page dumps in this folder. Old Mac private extracts were not used.

Wiki search excerpts support only partial A01/A05. No full wiki capture or revision ID; prior browser denial was respected. Original internal dialogue table is unavailable.

## A01 Dialogue and conversation

Status: **partial**.

Stated by fresh wiki search excerpts: relationship response depends on relationship level and conversations can become arguments. Events excerpts contain parameterized names/roles/topics and journal counterparts. Historical review describes popup decisions and contextual relationship actions. Inferred: a reusable template/action structure explains the presentation; no internal dialogue graph, line IDs, speaker/portrait table, conditions or mutation ordering was read.

Sources: [source 1](https://bitlife-life-simulator.fandom.com/wiki/Events), [source 2](https://bitlife-life-simulator.fandom.com/wiki/Relationships), [source 3](https://www.gravenoisemedia.com/game-review-bitlife-mobile-free-to-play/).

PROPOSAL, owner [DIALOGUE_AND_INTERACTIONS.md](../../../worlds/DIALOGUE_AND_INTERACTIONS.md): Use original role-aware event templates with concrete participants and effect receipts. Do not invent BitLife probability formulas from a wiki narrative.

## A02 Narrative delivery

Status: **partial**.

Stated: historical review describes a chronological life log and interruptions for family/social news or decisions. Official help gives end-of-life ribbons and in-life achievements distinct meanings. The business FAQ adds annual reports. Internal journal IDs, history compaction, branch closure and text pools remain unread.

Sources: [source 1](https://www.gravenoisemedia.com/game-review-bitlife-mobile-free-to-play/), [source 2](https://bitlifeapp.com/help/).

PROPOSAL, owner [LIFE_SIM_NORTH_STAR.md](../../../LIFE_SIM_NORTH_STAR.md): Show news, pending decisions and settled results distinctly. A biography display must not become the authoritative reward ledger.

## A03 Implementation architecture

Status: **unread**.

Unread: engine, module layout, script/data formats, event bus, scheduler and performance implementation. Official FAQ describes complex saved structures without exposing them. No app package, decompile or game install acquired; a text UI does not prove data-driven internals.

Sources: [source 1](https://bitlifeapp.com/help/).

PROPOSAL, owner [CAMPAIGN_FRAMEWORK.md](../../../worlds/CAMPAIGN_FRAMEWORK.md): PROPOSAL: isolate event selection, eligibility, decision and settlement in YAIR; this is design synthesis, not BitLife architecture evidence.

## A04 Save and persistence

Status: **partial**.

Stated by fresh official help: lives save as the player ages up; reinstall can lose lives/ribbons/heirlooms/achievements, and major updates can lose progress when structures change. Purchase restoration has separate account/platform routes. Not shown: serializer, version/migration policy, atomic choice persistence, backup, import/rejection handling or offline progress. Entitlement recovery is not save recovery.

Sources: [source 1](https://bitlifeapp.com/help/), [source 2](https://bitlifeapp.com/whats-new/patch-notes/).

PROPOSAL, owner [ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md](../../../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md): Persist the action receipt and its consequences coherently. Preserve rejected files and distinguish restored purchases from restored character progress.

## A05 AI and NPC behavior

Status: **partial**.

Stated in historical review: family members produce news as the character ages. Wiki excerpts say relationship quality influences responses; no weights are inspected. Official help ties careers to stats/education/experience. No planner, autonomous complete NPC life, faction simulation or annual resolution order established.

Sources: [source 1](https://www.gravenoisemedia.com/game-review-bitlife-mobile-free-to-play/), [source 2](https://bitlife-life-simulator.fandom.com/wiki/Relationships), [source 3](https://bitlifeapp.com/help/).

PROPOSAL, owner [DIALOGUE_AND_INTERACTIONS.md](../../../worlds/DIALOGUE_AND_INTERACTIONS.md): A known person can initiate a bounded event with a stated reason. Do not expose hidden temperament or invent future life facts.

## A06 UI and information design

Status: **partial**.

Stated in historical review: four headline meters, assets and relationship menus surround an age-advance action and event log. Current FAQ locates products within the job menu and collections in the main menu. Actual current app screens, keyboard use and accessibility were not observed; the mobile arrangement is reference only.

Sources: [source 1](https://www.gravenoisemedia.com/game-review-bitlife-mobile-free-to-play/), [source 2](https://bitlifeapp.com/help/).

PROPOSAL, owner [THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md](../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md): Desktop target 1366x768/1920x1080: show known people, lived outcomes and current action side by side. Avoid making several menus mandatory for routine context; mobile is deferred.

## A07 Content authoring and modding

Status: **unread**.

Unread: developer content tools, event template files, mod API, load order and validation. God Mode edits characters/starts through a game feature; it is not a public authoring API. Community event lists describe outcomes but do not establish the shipped file structure.

Sources: [source 1](https://bitlifeapp.com/help/), [source 2](https://bitlife-life-simulator.fandom.com/wiki/Events).

PROPOSAL, owner [DIALOGUE_AND_INTERACTIONS.md](../../../worlds/DIALOGUE_AND_INTERACTIONS.md): Keep start authoring separate from ordinary in-life powers. Original event packs still need schema and reachable/refusal checks.

## A08 Balance and numbers

Status: **partial**.

Stated: education/career decisions affect eligibility; business guidance weighs demand, competition, supplier quality/cost and paid market research. The FAQ defines capital, revenue, net income and profit margin. Lottery odds, effect weights, karma math, ribbon precedence, RNG seeds/pity and scaling remain unread. The supplied guidance is qualitative, not a formula.

Sources: [source 1](https://bitlifeapp.com/help/).

PROPOSAL, owner [LIFE_SIM_NORTH_STAR.md](../../../LIFE_SIM_NORTH_STAR.md): Show the local causes of price/profit changes. Paid information should improve a decision without secretly guaranteeing success.

## A09 Time and scheduling

Status: **partial**.

Stated: the historical age action advances to a year/event; the official business guide asks annual supplier review and end-of-year reports. Time Machine rewinds selected years, including after death. No proof of real-time aging/offline gains, exact half-year options, action-repeat budgets or event order.

Sources: [source 1](https://www.gravenoisemedia.com/game-review-bitlife-mobile-free-to-play/), [source 2](https://bitlifeapp.com/help/).

PROPOSAL, owner [TIMELINES_AND_DIVERGENCE.md](../../../TIMELINES_AND_DIVERGENCE.md): Use safe advancement to causal boundaries and stop at decisions. A period report must account for crossed events, costs and obligations.

## A10 Onboarding and reveal

Status: **partial**.

Stated: historical review introduces menus/relationships with age, while official FAQ gives education/career hints without exact hidden odds. Inferred: stage-dependent action availability can reduce early complexity. Full tutorial/unlock table is unread, so no exact age or skill gate invented.

Sources: [source 1](https://www.gravenoisemedia.com/game-review-bitlife-mobile-free-to-play/), [source 2](https://bitlifeapp.com/help/).

PROPOSAL, owner [WORLD_SECRETS_AND_DISCOVERY.md](../../../worlds/WORLD_SECRETS_AND_DISCOVERY.md): Reveal a new action with a person/place and known terms. Keep ordinary paths reachable; do not require a secret challenge to use routine systems.

## A11 Little touches

Status: **partial**.

Stated: ribbons summarize a completed life; collections are revisitable from main menu. Official business glossary explains financial terms and annual reports suggest improvements. Patch notes record corpse-interaction and item-condition repairs. UI feel/accessibility and notification policies remain unread.

Sources: [source 1](https://bitlifeapp.com/help/), [source 2](https://bitlifeapp.com/whats-new/patch-notes/).

PROPOSAL, owner [THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md](../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md): Explain domain terms near their use and show a settled life appraisal with evidence. An unavailable/dead actor must fail before presenting impossible interactions.

## A12 Other systems

Status: **partial**.

Stated: business has startup/acquisition/hired-CEO routes; products, suppliers, staff, facilities and research interact. FAQ also identifies heirlooms, achievements, ribbons, prison puzzles, deployment minigames, careers, Time Machine and character editing. The Version 1.14 guide gives child continuation versus repeating/starting anew. Full packs/current entitlement/catalogs remain unread.

Sources: [source 1](https://bitlifeapp.com/help/), [source 2](https://www.gamezebo.com/walkthroughs/bitlife-version-1-14-faq-how-to-continue-as-your-child-how-to-repeat-a-bitlife-and-how-to-become-a-model/).

PROPOSAL, owner [LIFE_SIM_NORTH_STAR.md](../../../LIFE_SIM_NORTH_STAR.md): Keep estate succession, replay and new origin separate. A chosen successor is an existing person with their own age and body, not an inherited skill bundle.

## Remaining precision

A03 engine and A07 authoring unread; A01 internal templates/IDs and A04 formats/transactions unread. Wiki excerpts only, historical guide parity, RNG, annual event order and complete current catalogs remain partial. No install.

[System inventory](SYSTEM_INVENTORY.md), [three deeper systems](DEEPER_SYSTEMS.md), [ranked report](REPORT.md), [tooling and rerun](TOOLING.md). Grouped status is [the lane checkpoint](../../majoras-mask/aspects-2026-10-14/CHECKPOINT.md).
