# Three deeper reads

These are newly documented extensions to the prior dossier. All YAIRPG applications are PROPOSALS, not selected work. Private complete text, counts and native output stay under the lane workspace.

## D1: Contextual text without a tree for every utterance

SHOWN: vanilla_text contains 64 named sets. The body has 340 nonblank lines, of which 173 belong to two book-title sets. The rest includes reusable phrases and words, so subtracting title lines still does not yield a conversation count. Private notes/text-sets.json records every file, set ID and body-line location. Full supplied text was read; the repository contains no bulk prose.

The authoring unit is a named situation and a few context fields. `text_current_profession_year.txt:5-7` uses ordinal tenure and unit name. `text_past_profession_year.txt:5-7` uses completed duration. Six family variants distinguish definite/indefinite kin, additional kin and living/dead tense. Five seeker variants distinguish person known, site known, specific building known and same-site phrasing. Worship variants resolve a speaker's deity link or its sphere. None of these template files stores a condition evaluator or effect list.

SHOWN native chain: a TEXT_SET literal at VA 0x1416cf5a8 has an xref at 0x14131e0e3 inside unwind range 0x14131de00..0x14131e4b4. REA decompiles a header scan, name match/allocation, record index assignment and later nonempty-line append. This supports a registry of named text pools. A second range 0x14131e4f0..0x14131eeaa contains fixed names including family variants, but its indirect jump is unrecovered. Exact set selection and expansion remain unread. No relationship-based trigger or random distribution is inferred from filenames alone.

PROPOSAL P1, dialogue owner `docs/worlds/DIALOGUE_AND_INTERACTIONS.md`: render original variants from a typed, evidence-filtered snapshot. Inputs are actual speaker/listener IDs, language/channel, known kin/site/profession and life state. Missing knowledge picks a less precise line or omits it. Rendering remains read-only. A paid promise or granted membership uses its action owner and durable receipt, never a sentence-side effect. Repeated greetings may vary without repeatedly granting familiarity or rewards.

Acceptance for a later selected slice: the same record gives living/past wording when appropriate; a known person with unknown location cannot leak coordinates; a stale paid option revalidates before spending; reload preserves a completed consequence. Template compilation and static screenshots alone do not prove these behaviors.

## D2: One event, several information channels

SHOWN: `data/init/announcements.txt:1-8` defines independent box/pause, recenter, main adventure display, fortress alert display, unit combat-report association and alert-light controls. Records such as feature discovery use a box; combat details use unit reports; ordinary mineral discovery does not force the same interruption. UCR_A explicitly associates with already-active unit reports without creating one if none exists. This is a meaningful retention/disclosure choice rather than merely a color.

SHOWN: `vanilla_music/objects/music_standard.txt:5-102` separates EVENT and CONTEXT. A loss event has no ambient context; first/second-year, winter and cavern contexts persist beyond one notification. Several tracks declare CARD entries with a comment describing a shuffled deck of short pieces. `:77-80` gives an uncommon-frequency comment. `sound_standard.txt:5-49` binds sound to event announcement IDs, including birth, artifact creation and marriage. The declarations share IDs with announcements, but native dispatch ordering, deduplication, pause timing, audio priority and deck reshuffle behavior are unread.

PROPOSAL P2, UI owner `docs/UI_RULES.md`: let the existing event owner emit a durable event ID and knowledge projection once, then route a brief log row, optional alert, inspectable detail and optional audio cue. A passive projection cannot emit a second reward or reveal an unknown participant. Target viewport 1366x768; surface home is the existing log and its shared inspection destination with Back/Esc. Preserve the log column. Mobile optimization stays deferred. The event's severity determines interruption; repeated harmless progress should not require dismissal.

Acceptance for a later selected slice: one real event appears once, inspection returns correctly, a muted cue loses no information, private facts remain hidden and closing/reopening does not duplicate state. No DF screen or audio was played in this pass.

## D3: Grouping preference expressed as travel cost

STATED in `data/init/d_init_default.txt:49-61`: traffic has high/normal/low/restricted path costs 1/2/5/25. Compatible filled storage receives an apparent-distance discount. Per-item reduction is capped; a separate discount applies for matching seeds, buckets, barrels or bins. The prose example uses item cap 20 and combination discount 100: 15 existing seeds make a bag appear 115 tiles closer; 30 make it 120 tiles closer. The actual shipped seed-combine setting is 1000, so the example is explanatory, not a prediction using current defaults. The other three combine defaults are also 1000. Permitted setting range is stated as 2..1000.

INFERRED model, not recovered native equation: apparent distance = physical travel distance minus min(matching item count, item-discount cap) minus applicable combine discount. Negative apparent distances are possible in this explanatory model; native clamping, unit conversion, candidate enumeration, reachability, tie breaks and reservations are unread. No assertion is made that the planner takes straight-line distance or discounts incompatible/full containers.

This turns a housekeeping preference into a choice within the same travel metric instead of adding a new global rule such as always use a filled bin. It can trade extra walking for fewer scattered stacks. The cost is longer travel if the discount is too large. The native implementation and real performance were not measured.

PROPOSAL P3, work/custody owner `src/simulation.js`: if a selected slice needs storage routing, compare only reachable, compatible, capacity-valid owned containers and apply a bounded grouping preference. Reserve the selected slot and stock through existing owners; reject a stale destination without losing goods. No whole colony logistics system is selected.

Acceptance for a later selected slice: near empty versus farther matching storage, full and unreachable matching storage, changed capacity before commit and cancel/reload each preserve actual custody. Use real path cost if available and label estimates otherwise.
