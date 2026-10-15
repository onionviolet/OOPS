# Path of the Idle Cultivator: A01 to A12

2026-10-14. Static RESEARCH, not gameplay acceptance. Shown means this lane read source/table structure; stated means an identified prior report; inferred means interpretation. All YAIR takeaways are unselected PROPOSALS.

Source identity: Path public browser bundle, raw SHA25642029c9283d2cd43d20787b932027aea8344a8a2d108e545b97698db713ea404. Reused formatted snapshot read-only; own copy hash ledger.

Locators: Path readable.js is the pinned formatted file; Groundhog v1/v2 paths are defined in TOOLING.md; Immortality paths are relative to the pinned clone; Tale table names refer to the official backup. Source bodies/text and complete inventoried metadata are retained in [private work area](/Users/weiwei/.codex/research/asp-cultivation/extract/). No user saves, game launch, source/build change or account interaction.

## A01 Dialogue and conversation

Status: covered. Sources: `readable.js L187025-187070, L211389-211450, L284360-284575`.

Shown: two separate presenters. Linear dialogue stores lines/index, portrait HTML, theme and onFinish/onClose callbacks. Closing early does not invoke onFinish. Topic graphs store nodes/current/index/ctx; choices can be disabled, return false to stop, or return a node ID from onSelect. City role templates substitute the city name and loop back to the topic menu. The scribe has a quest-specific routing exception. Saint dialogue chooses different arrays from readiness, completion and ascension flags; its finish callback sets saintDialogueComplete and checks two quests. Generic relationship-gated chat was not demonstrated.

PROPOSAL: separate reading, leaving and committing a conversation effect; owner docs/CHARACTERS_AND_WORLD_EVENTS.md and engine transactions.

## A02 Narrative delivery

Status: covered. Sources: `readable.js L187025-187070, L245350-245440; prior CONTENT_AUTHORING_DIGEST.md and quest registry L268760-273432`.

Shown: advancement guides, quest objectives, categorized messages, NPC talks and scripted cinematics deliver different kinds of story. Origin setup has dialogue steps and result stages. Quests have prerequisite predicates and reward consumers. City rumor topics are repeatable texture rather than evidence of an autonomous NPC biography. Endgame dialogue includes a continuation boundary; shipped wording does not prove a playable next universe. Full quest closure graph remains unread.

PROPOSAL: keep heard lore, quest receipts and author announcements as distinct knowledge; owner docs/CHARACTERS_AND_WORLD_EVENTS.md and observation channels.

## A03 Implementation architecture

Status: covered. Sources: `readable.js L1-25, L80918-81001, L81620-81767, L284360-284575; path-module-inventory.json`.

Shown: a single large browser bundle contains jQuery 2.2.2, Decimal operations, many closure modules, authored arrays and DOM/HTML presenters. Public property names survive obfuscation; local names do not. Systems call other closure exports and read shared state. Web/native save backends are selected at runtime. This is not evidence that the whole game is a Cocos build just because storage supports cc.sys. Lexical inventory finds 989 IIFE starts, including nested helpers, not 989 gameplay systems. Main calculation uses a fixed 1000 ms callback input in the previously traced route.

PROPOSAL: preserve separate rule data, mutation functions and presentation adapters; owner docs/ENGINE_EXPANSION.md.

## A04 Save and persistence

Status: covered. Sources: `readable.js L79272-79317, L80578-80610, L80810-80960`.

Shown: serializer clones state, converts selected Decimal values to strings or mantissa/exponent records, and cancels selected breeding action state in the saved copy. JSON envelope contains state. Save routing uses IndexedDB for web and active plus backup slots for native. Load validates candidates, supports legacy localStorage, runs migrations before Object.assign, verifies native writes and resets the real timestamp. Named oneTime migrations use _appliedMigrations, including aliases for earlier localized names. Individual migration errors are logged and iteration continues. This is not atomic migration or proven crash recovery. All codec internals and import rollback remain partial.

PROPOSAL: use stable nonlocalized migration IDs and validate a candidate before replacing live state; owner save compatibility and docs/ENGINE_EXPANSION.md.

## A05 AI and NPC behavior

Status: partial. Sources: `readable.js L211389-211450; prior SYSTEMS_AND_REBIRTH_DIGEST.md, CHECKPOINT.md institution row`.

Shown: city NPC roles select topic/portrait/theme templates, with a special quest conversation. Prior tables and handlers show disciples, mission assignments, mentors and NPC sect ranks. Flavor about a living world cannot establish offscreen goal selection. Full sect recruitment, war, mission combat and autonomous scheduling remain untraced.

PROPOSAL: give role-specific topics to named residents while retaining funded action receipts for actual NPC work; owner docs/CHARACTERS_AND_WORLD_EVENTS.md.

## A06 UI and information design

Status: partial. Sources: `readable.js L284372-284575, L230189; prior CORE_LOOP_DIGEST.md`.

Shown in code: modal portraits, themed borders, line counter, topic buttons, disabled choices, ascension prerequisite cards and a qi rate breakdown. The tree reveals choices only after the current node lines are read. CSS dimensions include 520/540 px modal maxima. No viewport rendering, keyboard/focus audit or readability acceptance was performed.

PROPOSAL: at desktop 1440 x 900 show methods, costs and current result in independent panels; owner docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. Mobile deferred.

## A07 Content authoring and modding

Status: covered. Sources: `readable.js L211389-211450, L284500-284575; prior CONTENT_AUTHORING_DIGEST.md`.

Shown: code-authored dialogue node objects, generated city topic nodes, quest predicates/typed rewards, recipe arrays and weighted room templates. Text is partly localized through keys and partly embedded fallback prose. Executable callbacks enable expressive effects but make authoring validation necessary. No supported public mod API/load-order contract was established in this browser snapshot.

PROPOSAL: lint node references and separate stable content IDs from localized strings; owner world authoring and docs/ENGINE_EXPANSION.md.

## A08 Balance and numbers

Status: partial. Sources: `readable.js L187081-187090, L80570-80610; prior CORE_LOOP_DIGEST.md and CONTENT_AUTHORING_DIGEST.md`.

Shown: large-number handling uses Decimal; seeded world generation places the Saint with up to 5000 placement attempts and separation tests. Qi stage requirements, escalating trials, generated manual bonuses and weighted caves are described in the prior digests. Seeded placement does not imply all combat/loot RNG is seeded. No universal pity mechanism established, and exhaustive late economics are unread.

PROPOSAL: state which rolls are reproducible and which are fresh; owner docs/RNG_ENCOUNTERS_AND_SOURCE_DEVELOPMENT.md.

## A09 Time and scheduling

Status: covered. Sources: `readable.js L80945-80948, L81730-81767; prior CORE_LOOP_DIGEST.md F14/F15`.

Shown: successful load calls resetRealTimestamp; the traced calculation uses a fixed 1000 ms input rather than replaying elapsed saved wall time. Timed action consumers handle resource production and stage growth. A timestamp field alone is not offline progression. Native platform behavior and throttling were not exercised.

PROPOSAL: an explicit clock receipt distinguishes active ticks, banked time and suspended decisions; owner docs/ENGINE_EXPANSION.md and docs/research/OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md.

## A10 Onboarding and reveal

Status: partial. Sources: `readable.js L230189, L187032-187070; prior CHECKPOINT.md origin graph row`.

Shown: ascension UI exposes a chain of prerequisites; unavailable Saint dialogue explains readiness conditions. Origins use different progression methods and earned secondaries. The complete origin unlock order is still not semantically catalogued.

PROPOSAL: unlock a panel when its first useful action exists, with a visible next requirement; owner discovery and UI.

## A11 Little touches

Status: covered. Sources: `readable.js L284397-284403, L284500-284575, L211389-211450, L80810-80960`.

Shown: line counters, fallback farewell choice, themed portraits, repeatable topic menus, city-name substitution, invalid-native-candidate warnings and storage-full guidance. Prior digests add rate breakdowns, quick recipe choices and reset previews. These are source features; motion accessibility, haptics and focus behavior are not verified.

PROPOSAL: repeatable local small talk with precise action feedback; owner UI and characters.

## A12 Other systems

Status: partial. Sources: `prior SYSTEMS_AND_REBIRTH_DIGEST.md, CONTENT_AUTHORING_DIGEST.md; readable.js lexical inventory`.

Shown/inherited: main/secondary cultivation, dantian nodes/purity, forging, alchemy, cooking, gear/manual generation, weapon mastery, sect/kingdom, exploration rooms, soul slots/legacy, transformed forms and later planes. Catalogue breadth exceeds the page summary. The appendix inventories lexical source regions without claiming every late subsystem is understood.

PROPOSAL: use these as optional world-specific method families, preserving one realm/one prestige for the first milestone; owner docs/RESEARCH_CULTIVATION_PATHS.md.
