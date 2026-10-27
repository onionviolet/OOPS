# Lead-run schema 1.1 (protagonist-life plan, 2026-10-27)

Status: tooling format for P1 and P2 readers, proposal. Replaces the draft in
[PLAN section 2](PLAN.md#2-lead-run-table-schema) after the sampled reading
(PLAN 11.2, SF1-SF12). Lint: `node scripts/lead_run/lint_lead_run.mjs <scenes.jsonl>
<census.jsonl> [shard.txt]`; tests: `tests/lead_run_lint.test.js`. Rows for named canon
live in the private, gitignored folder; public files carry IDs and counts only (Q3).
Rules applied: WA3, WA8, WA11, WA22-WA24, WPR4, AU13-AU15.

## Files

| File | One row per | Schema tag |
| --- | --- | --- |
| `*_scenes.jsonl` | Scene: one place and time span with a goal or a world change. Routine actions are `steps` inside it | `lead-run/1.1` |
| `*_census.jsonl` | Entity mentioned in the text, touched or not (WA22) | `census/1.1` |
| `*_fills.jsonl` | Proposed fill for something a scene needs that the text does not state (PLAN 12.5) | `fill/1.1` |

Kinds, shared by `touched` and the census: person, place, organization, deity, item, price,
law, calendar, clock, event, language, measure, document, note.

## Scene row (`lead-run/1.1`)

| Field | Shape | Notes |
| --- | --- | --- |
| `beat`, `order` | `lr.<world>.<line>.<nnn>`, integer | Stable ids |
| `date` | `{calendar, anchor, offsetDays, value, tolerance, label}` | Either `anchor` (a beat id) plus `offsetDays`, or `value` (a date or `date-unsettled`) |
| `timeOfDay` | `{value, evidence}` | `night`, `dawn`, `morning`, `noon`, `afternoon`, `evening` or `HH:MM`; evidence is a locator (bells, light, moon) |
| `place`, `deps`, `continues` | id; `[{id, kind: after/needs}]`; beat id or null | `continues` links a scene split by a shard boundary |
| `steps` | `[{verb, object, cost: {amount, unit} or null}]` | Engine verbs |
| `touched` | `[{kind, id, status: present/partial/missing}]` | |
| `knowledge` | `[{fact, change: gained/lost, from, locator}]` | What the lead learns (LP5); thought is not a beat (SF2) |
| `motives`, `choices` | `[{tag, locator}]`, `[{taken, options, label}]` | LP6, LP7 |
| `outcomes` | `[{fact, value, class: carried/changed/blocked}]` | Asserted on facts, never text |
| `anchors` | `[{fact, value, unit, locator}]` | Stated purse, possessions or debts (LP4) |
| `weight`, `footprint` | `great` or `routine`; PX43 object | `great` needs a footprint and a world-fact change |
| `sealed` | opaque ids | WA11 |
| `evidence` | `[{label: S/I/U, locator, kind}]` | `kind`: `shown`, `narration`, `thought:<who>`, `dialogue:<who>`, `inferred` |
| `mechanism` | string or null | A power the engine lacks |

## Census row (`census/1.1`)

`id` (`<world>.<kind>.<slug>`), `label`, `zh` (the literal name as printed), `nameSource`
(`repo`, `wiki`, `pinyin-unconfirmed`), `kind`, `rung` (M0-M4), `whereabouts`
(`[{place, era, status: stated/claimed/inferred, locator}]`), `firstMention`,
`firstVolume`, `touchedByLead`, `aliases`, `claimant`, `amount`
(`{value, unit, per, cap}`, required for prices), `estimateBy` (a character's own
conversion, a claim), `futureAnchors`, `note` (15 words at most, own words).

## Fill row (`fill/1.1`)

`id` (`<world>.fill.<slug>`), `for` (the scene or census id that needs it), `kind`, `what`
(own words), `status` (`authored-proposal` or `generator-spec`), `basis` (the stated facts
it follows from, by id or locator), `respects` (laws and forward anchors it must not
contradict, WA24), `confidence` (`high`, `medium`, `low`). A fill never carries a source
locator as its own evidence, never claims source truth (WA3, WA7), and is reviewed before it
enters a pack.

## Lint checks

Scene: schema tag, id shape, duplicates, order, date form and anchor, place, weight and
footprint, steps, kinds, outcome classes, anchors with units and locators, evidence label,
kind and locator. Census: schema tag, id namespace by kind, kind, rung, name source,
whereabouts status, an address for any rung above M0, amounts on prices, note length,
locator form, and with a shard, the literal `zh` name in the cited paragraph or the next
two. Both: a quote guard flags any run of six or more Chinese characters outside `zh` and
`aliases`.

First run against the version-1.0 sample (23 scenes, 82 census rows): every row failed the
schema tag as expected; also 10 `great` rows without a footprint, 17 evidence kinds outside
the new set, 10 prices without amounts, 10 kinds outside the vocabulary, 14 whereabouts
without a status, 7 names not found at their locator.

## Clarifications after the 1.1 re-run (2026-10-27)

A fresh haiku reader re-read chapters 1-3 under this schema (PLAN 12.1). Its friction
points F1-F8 are settled here; the lint enforces the first three.

| Code | Clarification |
| --- | --- |
| F1 | `footprint`: `{places: [ids], window: {anchor, fromOffsetDays, toOffsetDays} or {from, to}, hazards: [kinds], roles: [slot names]}` (lint: `footprint-shape`) |
| F2 | Each `choices` entry carries its own `locator` (lint) |
| F3 | `anchors[].value` is a number; an approximate amount adds `approx: true`; `scope` is `lead` or `household` (lint) |
| F4 | "Concerns him" means the lead's own purse, possessions and debts (`scope: lead`) and household items he shares in paying or receiving (`scope: household`) |
| F5 | The lead is one census person row with every name in `aliases`; scenes refer to that id |
| F6 | `calendar` is the pack's calendar id, or `unnamed` until the world pass names it; weekday unknown is `null`, not a guess |
| F7 | A recalled memory or private reasoning is `thought:<who>`; `narration` is only the narrator's own statement |
| F8 | **Rung criteria.** M0: a name with no place or time. M1: at least one whereabouts row; an entity present in a scene is placed at that scene's place and date (`status: stated` if the scene says it is there). M2 and up are set by the pack, never by readers |
| F9 | `date.label` is only `S`, `I` or `U`; prose goes in a `note` (the re-run wrote prose labels on all five scenes; lint `date-label`) |
| F10 | **Census recall.** The re-run had 47 rows against the first sample's 82 [S both files]. Readers list every mention, including each distinct amount, coin, measure, time and calendar fact; compressing scenes must not compress the census. A deterministic candidate list (numbers with currency units, names with the separator dot, place suffixes) is the recall check (PL-L12) |

## Additions for the longer read (1.2, optional fields, 2026-10-27)

| Field | Where | Shape | Purpose |
| --- | --- | --- | --- |
| `options` | Scene | `[{action, needs: [ids], label: S/I, locator or null, taken: true/false}]` | What the lead could do here, the canon choice and the others the text names (S) or a player in his place plausibly could (I). `needs` lists what must exist for that option to be playable |
| `present` | Scene | `[ids]` | Entities in the scene the lead does not interact with; each is placed at the scene's place and date (F8, WA22) |
| `timeOfDay.precision` | Scene | `day`, `band`, `hour`, `minute` | The finest time the text supports; `hour` or `minute` only when the text gives a clock time, a bell count or an appointment |
| `window` | Scene | `{from, to}` in the same form as `date`, plus `precision` | For appointments and events another life could overlap |

## Schema 1.2 (actions, loops and the longer-read fixes, 2026-10-27)

Tags `lead-run/1.2`, `census/1.2`, `loop/1.2`; the lint accepts 1.1 and 1.2. See
[PLAN rounds 5 and 6](PLAN.md#14-round-6-actions-gameplay-loops-lived-days-and-proposed-rules-2026-10-27).

| Change | Shape |
| --- | --- |
| Step and option action class (proposed WA25) | `class` from study, practice, research, craft, trade, work, travel, fight, socialize, rest, care, appraise, ritual, other; plus `inputs`, `time: {minutes} or {band}`, `outputs`, `gains: [{kind: skill/knowledge/standing/money, id, amount}]`, `requires`, `label` (lint: `action-class`, `action-label`, `action-time`) |
| Loop file `*_loops.jsonl` (proposed WA26) | `{schema: 'loop/1.2', id: '<world>.loop.<slug>', trigger, steps: [classes], rewards, rhythm: schedule/deadline/opportunity, period, owner (a YAIRPG file or 'gap'), progression, evidence}` (lint: `--loops`) |
| Scene `pov` (RF1) | `lead` or a person id; lead runs use only `lead` |
| Evidence kind `dream:<who>` (RF3) | For dream content; lint accepts it |
| Deadlines with no stated date (RF3) | `window: {anchor, offsetDays, label: 'I'}` with the assumption in a fill |
| Hazards (RF3) | Footprint hazards may include `weather` |
| `deps` (RF4) | Beat ids only; places go in `touched` |
| Kind `creature` | Added to the shared kind list |
| `schema` key | Every row carries the tag as its `schema` field; organization ids use `organization`, never `org` |
| `firstVolume` | Null when the shard does not show it; never guessed |
