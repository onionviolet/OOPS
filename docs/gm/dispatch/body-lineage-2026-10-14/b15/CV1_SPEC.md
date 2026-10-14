# CV1 on the existing status window

2026-10-14. Build-ready **proposal**, not selected implementation. Scope:
knowledge-filtered self-body information on `status-window`, desktop/laptop
1366x768 CSS pixels at 100% zoom. Mobile optimization, new top-level windows,
full genetics, NPC generation, body editing, quests, shops and stat allocation
are deferred. The visible outcome is a readable Body tab with known summaries,
dated readings and source details, while native play and the current Stats
surface remain available. Acceptance cases live in [TEST_PLAN](TEST_PLAN.md).

## F1 Live source audit and consequences

Locators are the inspected dirty `codex/gameplay-foundations` snapshot,
2026-10-14. Recheck before implementation; concurrent workers can move lines.
SHOWN means source inspection, not gameplay proof.

| Code | File:line | Shown behavior and implementation consequence |
|---|---|---|
| F1a | `src/cheat_cards.js:1-6`, `src/cheat_cards.js:32-44` | Ten exact top-level keys; fixed UI/terms sets; JSON-only payload; only optional `awakened` has state-specific typing. Put richer placement in catalogue prose. Add semantic validation for CV1's nested state, not extra top-level card keys. |
| F1b | `src/cheat_cards.js:46-75` | `held` entries have card/acquired/messages; grant/message helpers clone, with no hooks. The catalogue cannot grant skills, read hidden facts or install anything. |
| F1c | `src/cheat_cards.js:82-100` | Optional quest card starts dormant; selection takes the first status card awake or legacy-message-known. Awakening touches every explicitly dormant status card. Do not grant `body.cv1` as a second dormant status card using these generic helpers. |
| F1d | `src/status_window.js:7-22`, `src/status_window.js:23-40` | One character section, level/five stats/titles/points/empty quests; predicates follow selected status entry. Body belongs inside this section and shares discovery. Preserve existing selectors and values. No body tab exists now. |
| F1e | `src/status_window.js:41-42` | 250 ms render timer and display-setting subscription. Reads must remain pure; never generate/observe/spend from render. Key body updates to committed evidence revision and relevant publicly known inputs. |
| F1f | `src/character_bio.js:10-31` | Biography explains earned sources, preserves uncertain ancestry, filters dormant faculties and visible conditions. It is a useful bounded provider, not a complete knowledge projection: it can read source labels without a separate generic observation check. New secret-capable fields need an allowlisted adapter. |
| F1g | `src/character_bio.js:33-51` | Unobserved techniques hidden; training uses visible earned skills. Reuse only qualified body-relevant outputs. Do not turn trained bonuses into innate physique, genetics or bloodline concentration. Chronicle age is not lifespan. |
| F1h | `src/capabilities.js:4-5`, `src/capabilities.js:15-34` | Supported kinds include trait/bloodline, not physique/constitution; grants are positive only. CV1 adds no capability kind or cost adapter. A displayed body-card reference grants no second bonus. |
| F1i | `src/capabilities.js:39-68` | Query is pure, checks expiration/faculty activity and returns value/contributions. Execution provenance can contain information the viewer lacks; filter labels/reasons before display. `grant.amount` is not concentration. |
| F1j | `src/components/bio_component.js:3-17`, `src/main.js:5230`, `src/main.js:5340-5342` | Native bio serializes four fields; cheats serialize/load explicitly. B2's body record needs explicit save/load validation. Arbitrary extra bio properties would be lost. |
| F1k | `src/main.js:8378-8384` | Window read callback currently supplies cheats/native level/stats/held titles and known-panel notification. Add a prefiltered body view to this callback, not raw physical state. |
| F1l | `src/main.js:315-321` | Current awakening mutates live state, logs/renders, then saves. This does not prove commit-before-reveal. Reuse a verified durable transition from R1 if integrated; otherwise the CV1 enable action must implement its own correctly ordered transaction. |
| F1m | `src/save_files.js:45-48`, `src/save_files.js:186-201`, `src/save_files.js:204-220` | Envelope validates cheats; UTF8 file encoding and real-loader preflight precede guarded write; shared-origin guard is 4 MiB UTF16. Extend envelope/preflight for proposed body/lens state and test actual IO. |
| F1n | `src/simulation_effects.js:281-284`, `src/simulation_contracts.js:249` | Simulation knowledge uses string values and stage-ranked same-key overwrite. It cannot accept the typed observations below without a versioned adapter. Do not silently put richer JSON there or equate understood with certainty. |

[GOAL](../../cheat-status-window-2026-10-13/GOAL.md) states the C0/CH1 contract
and separate R1 hardening work. [CH1_REPORT](../../cheat-status-window-2026-10-13/CH1_REPORT.md)
has a dated BLOCKED header followed by a coordinator close resolving Appearance.
Its day-3 seeded-native evidence is stated history here. First-won-fight remained
source-only in that report. B15 neither reran those gates nor established R1's
merged runtime status. Do not turn the historical header into a current blocker.

## D1 Ownership and minimum dependency join

[B2 SPEC](../b2/SPEC.md) owns one optional `character.body_record` and
physical/person/knowledge paths. Existing simulation sources, faculties,
conditions, host anatomy and custody keep their own authority. B2's placeholder
genetics is unassigned, not an inheritance model. It also has no bloodline
concentration field. CV1 must not append a `physical.bloodlines` array or invent
a percentage from source grants. A future concentration provider needs its
own typed model/unit and migration. Initially its static category says only
“No qualified reading recorded,” independent of hidden truth or slot counts.

Default first slice: native player's B2 record plus earned, already public body
observations, on an existing awakened `system-quests` card. B2's record/migration
must be implemented and qualified first or within the selected bounded build.
Do not gate this slice on B7 population genetics, B11 modifications, a complete
P24 framework, or every body-cheat action. B7 defines sparse NPC bodies and
qualified body/person references for later targets; CV1's target is self only.

The new pure module `src/body_knowledge_view.js` is a proposed small adapter,
not an existing file. Its first two consumers are CV1 and the optional known-body
summary in the existing bio; build only their overlapping field vocabulary.
Do not replace the biography's unrelated sections or create a universal fact
registry in this slice.

**Identity bound:** use B2 `physical.bodyId` plus current person/world/clock
context. On unsupported possession or foreign body, show only qualified old
records labeled “previous body” and current observable self-description. Never
read native body truth as the new host's anatomy. Identity/address are not
anatomical readings and never imply sex or reproductive role.

## D2 Discovery and card composition

CV1's JSON in [CARDS](CARDS.md) describes a reusable card family. The minimal
implementation composes it as an extension of the current `system-quests`
holder; it does **not** acquire a separate `body.cv1` held entry. This is an
explicit compatibility/design choice for the first slice, not a universal ban
on multiple systems. An independent lens later requires holder arbitration,
per-holder discovery and point-resource tests before its grant route ships.

Proposed extension, preserving all existing quest state:

```json
{
  "bodyLens": {
    "schema": 1,
    "enabled": true,
    "stage": 0,
    "enabledAt": {"year": 1, "month": 1, "day": 3, "hour": 6, "minute": 10, "day_count": 3},
    "causeRef": "body.assessment.example"
  }
}
```

The example timestamp is illustrative, not a fixture or an actual game date.
`enabledAt` uses the actual native cheat calendar stamp. Observation timestamps
below belong to their own explicitly identified clock. The extension is absent
for all old cards. Absence disables Body; it does not revoke the old Stats panel.
Do not set `awakened` or rewrite first messages during CV1 migration.

**Initial route:** once the current system is genuinely known, its existing
stage-0 text region offers a text-safe, keyboard-reachable “Review known body”
action. It uses ordinary self-description and only allowlisted earned public
body evidence. This free action consumes zero game minutes, grants no power,
and neither deep-scans nor randomly generates anatomy. It creates the lens
enable receipt and any necessary bounded observation references in one
detached candidate, validates the full envelope, writes through the guarded
save path, installs committed state, then announces “Your known body readings
are available” and reveals Body. Any failed write leaves the lens, evidence,
log, discovery and focus unchanged and offers a normal retry. Every retry is
allowed; replay of an already committed receipt grants/reveals nothing twice.

Receipt ID comes from the host's durable transaction identity, not a fabricated
life-record event. If B2 is not active, this control remains unavailable with
a known reason such as “Body records are not supported for this body.” Do not
ship an enabled dead-end button. Implementation acceptance requires the native
B2 route to be supported, not merely this fallback.

Dial: a world-law interface may provide Body on arrival; an authored medical
report, calibration or research route can enable it instead. A live sensor
variant can later obtain fresh observations with an actual means and cost.
These are alternate acquisition adapters, not new CH1 day-3/fight milestones.
No future clue or sealed name appears in dormant UI, settings or help.

## D3 Knowledge observation and projection contract

Truth is needed for execution and remains in its existing owner. A display
does not pass raw truth to the browser component. Proposed pure API:

```js
bodyKnowledgeView({
  observerRef, subjectRef, currentBodyRef, worldId, clocks,
  declaredSelfFields, observations, publicBodyFacts, lens
})
// -> {available, subjectLabel, groups, knownRevision}
// group: {key, label, rows, emptyText}
// row: {displayKey, label, readingText, qualifierText, asOfText,
//       sourceText, freshness, comparisonText?, details}
```

All inputs come from narrow qualified adapters. `publicBodyFacts` is a whitelist
of already discovered receipts/visible effects, never `simulationFacts`, raw
capability contributions or the registry. `displayKey` is a UI-local stable key
for an admitted reading, not a hidden source/secret ID. Output is plain text
and safe UI identifiers only. No secret ID becomes a DOM attribute. Internal
source/evidence refs stay inside the adapter; the visible source is the known
provider/alias or “Recorded self-assessment.”

`sourceRef` resolves original attribution/copy lineage through its owning
record adapter. Two copies of one report are not two independent tests and
do not automatically increase confidence. Revoking future archive access
does not erase already received observations without an actual memory means.

Persisted observations use B2's existing proposed envelope:
`{path, stage, value, at, evidenceRef}`. Add no unchecked sibling fields.
For the selected builder, define the following bounded typed `value` variant
in the B2 knowledge validator before using it, since B2 is still a proposal:

```text
value = {
  schema: 1, readingId, bodyId, worldId, clockRef,
  kind: category | range | exact | claim | inconclusive,
  reading: definition-owned category key | finite number | [finite min,max],
  unit: null | allowlisted unit,
  precision: null | nonnegative bounded decimal places,
  confidence: unknown | low | moderate | high,
  sourceRef, meansRef, scopeRef,
  freshnessMode: snapshot | qualified-live
}
```

Closed keys, finite numbers, ordered ranges, referenced source/means/scope and
matching revision definitions are mandatory. IDs use the owning validators'
safe ID rules. `at` is a nonnegative minute in `clockRef`, no later than that
clock's saved time. A null/unknown prehistory date is an explicitly supported
B2 variant only; never synthesize a scan date during migration. `evidenceRef`
points to the actual receipt; absence supports only declared self-fields,
not diagnoses. Store small category keys, not generated prose/HTML. Sources
must resolve to supported public wording before projection.

Do not reuse simulation learning stages as confidence. B2 `seen` can hold a
received or directly observed claim; `understood` describes interpretation,
not objective truth. Kind/source/coverage determine the displayed qualifier.
Conflicting records coexist in B2's array with distinct reading IDs. Repeated
render never appends; repeated delivery of one receipt never duplicates. A
correction references/compares the admitted prior reading and retains it when
needed by an active enquiry. This is a bounded typed body observation, not a
new global epistemology schema. If the B2 builder picks another validated
value contract, adapt here explicitly before coding rather than maintaining
two competing observation stores.

### Projection rules in order

1. **Gate:** require known supported system and enabled valid lens. Resolve
   observer, current/previous body, world and source clock. No state mutation,
   RNG draw, generation, action execution or receipt delivery in this query.
2. **Admit:** declared race/height/age/identity/address remain known according
   to B2 migration. Named physique/constitution/source/condition rows require
   their own known evidence or explicit preexisting public adapter. Source
   activation alone cannot qualify a hidden name. Filter before sorting,
   counting, comparing or generating accessible details.
3. **Seal:** check the existing world discovery owner and authored route for
   each protected field. Qualification includes the actual channel and scope,
   not merely a card grade. Omit unqualified rows entirely. Static category
   empty text is the same with zero, one or many hidden instances. Known
   partial evidence may show a supported unnamed cue without a cause.
4. **Interpret:** exact/range/category applies to that field, not the whole
   person. Render “Report: …” for claims, “Inconclusive” for supported failed
   tests and declared units for measurements. Zero, absent, unsupported,
   unknown and not applicable remain distinct when qualified to say so.
   AP depth is separate from precision; no automatic global grade ladder.
5. **Date:** snapshot rows always show their sampled “as of” date. Mark stale
   only from an observer-known invalidation (a witnessed body change, expired
   report, changed known method/world calibration), not a hidden revision
   comparison. An unseen mutation must not make the UI suddenly say stale.
   A live reading requires a held continuous channel and a committed evidence
   boundary. Losing it leaves an as-of reading with a known connection reason.
6. **Display:** stable authored group/row order, text-safe names, meaningful
   source/coverage and units. Deltas compare two compatible known readings on
   the same body/model/unit; no truth-minus-old-reading shortcut. Future/lifespan
   projections are outside CV1's first slice. “Current” is reserved for a
   qualified live reading. Never scan all NPCs to populate self view.

The first builder admits only native self-description, earned public grip/
palm-mark evidence, and observed visible conditions/training when their adapter
proves prior disclosure. Treat `characterBioView` output as a provider requiring
that whitelist, not blanket proof of a knowledge gate. Unknown physique,
constitution and concentration categories remain present as static questions
with neutral empty text; no fabricated “none” diagnosis or percentage.

## D4 Desktop layout and interaction

One panel ID, `status-window`. Add local Stats and Body tabs; existing level,
stats, titles, points and quest text stay in Stats with selectors preserved.
Before enable, Body tab is absent, not a secret silhouette. Show the discovery
action only on the known supported system. First enable may focus the visible
Body tab after durable commit when no modal/fight blocks it; otherwise use the
existing reveal/pointer queue. Loading/restoring a save never replays reveal.

Body initially shows five independent short groups: Frame, Physique,
Constitution, Bloodline readings and Conditions. Source/date sits beside or
under each admitted value; longer coverage/contradictions expand inside this
panel. Proposed narrow-module layout:

```text
Status window             [Stats] [Body]
Known body · Self          Recorded readings
Frame                 Human · average · adult
                      Self-description
Physique              [known reading or neutral empty text]
Constitution          [known reading or neutral empty text]
Bloodline readings    No qualified reading recorded
Conditions            [only admitted active/as-of readings]
[Sources and dated comparisons]
```

“Self-description” means selected/declared fields, not measured height or body
age in years. Condition detail includes sample time; a past condition is not
presented as still active. Current conditions can be live only if the public
adapter supports observation and expiry. SG1/SG2 optional detail is distinct
from SG3/SG5 and omitted when unspecified, not inferred from legacy gender.

At the default narrow character column, use one readable column, minimum
proposed 14 px body text and line-height 1.4. If the module is widened to
560 px or more, use two detail columns without changing module geometry.
Long evidence scrolls in its reading region; do not shrink text to remove
scrolling or force a fixed height into every saved layout. The five groups
are a viewport composition, not a maximum number of body traits. Preserve
Local actions, inventory, combat and user layout. Fit remains an unrun gate.

Use semantic `tablist`/`tab`/`tabpanel`, `aria-selected`, stable controlled
IDs and roving focus. Arrow keys move tabs; Home/End select ends; Enter/Space
activate if using manual activation. F6 reaches the existing panel, then Tab
reaches its content/controls. Expanded detail has `aria-expanded`; collapse
returns focus to its opener. Do not steal focus on stat/condition ticks.
Stable keys preserve reading position and focus across render updates.

Reuse comfortable/compact kit density and Appearance/Vivid styles; uncertainty,
stale and claim qualifiers are text, not color alone. No new per-body Appearance
module. Effects off/reduced motion removes reveal motion while keeping discovery
reachable; polite announcement only after committed enable, never each render.
Proposed last-selected tab is browser/device display state under existing
display-settings conventions, not a gameplay save field; verify that key
registration supports it before adding one. A restored preference cannot reveal
Body before discovery. Missing preference defaults Stats. A display error shows
a generic reading-unavailable row, no raw data/error string and no native crash.

## D5 Persistence, compatibility and cost

**Authoritative locations:** enable/stage/enable receipt on the held system
card's `state.bodyLens`; body truth and typed self observations under B2
`character.body_record`; sources/faculties/conditions in their existing owners.
No full body JSON in cheat state, no second truth map, no per-poll log/snapshot,
no observation copy under `save.cheats.known`. That C0 map is not a typed
body knowledge registry.

Old saves lacking cheats still load empty. Old C0/CH1 cards with `{}` or
`{awakened:false,points:0}` remain valid and receive no automatic Body grant.
Old body-less saves follow B2's deterministic legacy migration, no rolled
physiques/sex/genetics and no diagnosis. Optional missing bodyLens defaults
disabled in the resolver rather than writing enable history on load. Do not
bump outer `cheats.schema` merely for this optional versioned extension.

Future lens semantic validator: `schema === 1`, enabled boolean, stage exactly
0 for this slice, valid native timestamp and nonempty safe causeRef when
enabled. Disabled state has null timestamp/cause; unknown versions refuse
outside import with a generic card-naming error. Validate the holder is a
supported known system; lens cannot turn a dormant card into known. Validate
all body observations before active load/write. Lens and observations must
refer to supported body/clock/evidence, with public refs only in diagnostics.

Malformed-card quarantine in CHEAT_LIBRARY is a proposal and is not shown in
the inspected main validator. Do not claim it already protects existing saves.
Default compatibility choice here: invalid new data fails preflight/load before
partial installation or storage mutation, retains last durable bytes and offers
normal recovery/export. If root integrates a real lossless quarantine owner,
adapt to it and run its tests; do not create a second quarantine schema for CV1.
Older clients may ignore the nested lens but do not promise reverse-version
roundtrips preserve an unrecognized B2 record. Forward-version refusal follows
the envelope's version policy; qualify downgrade separately before offering it.

Enable commit combines body observation changes and lens state in the native
envelope. Use detached validation and guarded write, then install, render and
emit messages. Restored enabled state rerenders only. Background reads cost
no game time/fuel and no RNG. Any later paid/live scan is a real command with
quote revision, access and storage failure behavior; hover/focus is never a scan.

Engineering target: compact lens delta <=512 UTF8 bytes; total first-slice
body-record delta uses B2's <=4,096 UTF8/8,192 UTF16 target. These are estimates
for developer warnings, not lore limits or import caps. Measure the complete
envelope/key and origin storage with `measureSaveSize` and `checkSaveSize`,
plus UTF8 export expansion. Keep every observation needed by an active enquiry;
dedupe receipts and compact superseded inactive views without losing authored
evidence. Define retention before a long history ships; no universal fixed
reading count silently truncates knowledge. CV1 does not generate NPC bodies
or improve B7's unmeasured large-population budget.

## D6 Build sequence and completion gate

Implement the B2 schema/serialization join, bounded typed observation validator
and pure adapter; add durable free enable command on the known system; add
Body/Stats tabs with safe output; then run the focused source and rebuilt
desktop/persistence cases in [TEST_PLAN](TEST_PLAN.md). One useful earned body
reading must appear through a real discovery route and remain exact after
Save/reload/Export/literal Import. Zero hidden disclosure must hold throughout.

This document closes design coverage only. Source passing, own rebuilt/served
bytes, native discovery, persistence, layout behavior, fiction/balance and
human taste each need their own recorded result. No source edits or runnable
UI acceptance are claimed by B15.
