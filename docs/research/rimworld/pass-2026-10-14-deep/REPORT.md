# RimWorld 1.7 deep pass

RimWorld makes places differ through concrete environment, route, content-admission and incident rules, while actual pawns retain their bodies, genes, skills, beliefs and relations. Odyssey adds a strong reference for a traveling home: it moves people, furniture, stored goods and some spatial/pacing context together. It does **not** establish arbitrary power conversion between fictional universes. Departure-map retention is conditional, and loaded maps share a game clock.

This pass answers the six requested questions with current installed code and XML. **SHOWN** means static source/data inspected, **STATED** means a live owner or prior report says it, and **INFERRED** means interpretation or a YAIRPG proposal. No game, save, UI or content loader was run. Research delivery is PARTIAL because exhaustive DLC consumers and native behavior remain named gaps. All reasonable future options remain reachable; donor population pressure, metabolism budgets and timed choices are local examples, not global YAIRPG limits.

## Input and deep reference

Steam 294100, installed build 25947168, `Version.txt` 1.7.4979 rev109. DLL SHA-256 `a97a01c4319414414c0ca39f3565215e83300dc608dc94b69a27720095b4e751`, independently hashed here. Main input: `~/Library/Application Support/Steam/steamapps/common/RimWorld/RimWorld.app/Contents/MacOS/Assembly-CSharp.dll`.

Private reference store: `~/.codex/research/lib-rimworld-deep/`: full targeted decompiles, all copied Data XML, complete raw Def rows/text with IDs and conditions, decoded study/transport/work/event flows and hashes. `TOOLING.md` gives exact paths and reproduction. Prior `~/.codex/research/bf-rimworld/` was reused read-only. No foreign code/assets/text were copied into gameplay or these public reports.

## Ranked PROPOSALS

| Rank / code | Proposal and owning system | Kit / synthesis | First useful outcome |
|---|---|---|---|
| 1 / RW-D1 | Give Village mixing a truthful blocked/paused/finished view, using existing plan/receipt owners. `THEMATIC_UI_AND_INFORMATION_DESIGN`, production chains | K8/K9/K14/K34; extends P01/P08 | A known missing means and valid next action share one laptop view. No synthetic reason from a null job. |
| 2 / RW-D2 | Keep inherited carrier, installed change and active expression separate. Genetics palette G1/G18/G39/G40/G43/G61/G73 | K3/K15/K22; NEW genetics evidence, extends P04/P05; BW1 channel distinction | One existing body faculty remains present but has a precise supported/suppressed reason after crossing. No mandatory metabolic cap. |
| 3 / RW-D3 | Let one safe original subject produce a retained observation and a useful existing method. `TECHNOLOGY_AND_PROGRESSION`, skill means | K9/K11/K13; extends P03/P11/P20, NEW subject-study packet; related RW5/RW7, not a silent new RW row | A real paid study action teaches something useful; rereading its note pays nothing. |
| 4 / RW-D4 | Preview a traveling household by actual retained carriers and departure disposition. Nested worlds / multiverse owners | K5/K15/K18/K25; extends P05/P13/P16, NEW spatial household subcase | One traveler and one physical tool move, a local credential is reevaluated, and a revisited place keeps its declared state. |
| 5 / RW-D5 | Give an institution one belief rule with two existing readers, then a role-specific service. Institution / belief owners | K7/K8/K21/K24; extends P07/P04 | Membership changes an actual service and one local response without erasing private knowledge. |
| 6 / RW-D6 | Feed one safe learning route into an existing useful application, retaining preparation and development separately. Genetics G21/G59 and skills | K3/K6/K22/K26; extends P03/P06/P09 | Work observation requires an actual teacher/task; learning increases real options rather than granting unrelated competence. |
| 7 / RW-D7 | Record eligible, selected, attempted and completed event stages separately. Story events / storylet deck | K12/K18/K32/K34; extends P10/P12/P13 | An invalid candidate stays quiet, a successful occurrence has saved aftermath, and a later valid recurrence remains possible. |
| 8 / RW-D8 | Give one chain output a second useful destination and a finite stock-target repeat policy. Production chains | K8/K9/K13; extends P02/P08/P18 | Existing stock is conserved across ordinary use, another recipe and cancellation. |

These rank research options only. **STATED live direction:** the successor kit already chooses P01 Village mixing next. This pass does not change it, expand the first milestone past one realm/one prestige, or promote another world to active implementation. Target if UI work is selected: rebuilt 1366x768 laptop view with useful context, reason and action visible; mobile optimization stays deferred.

## Six deep answers

| Code | Answer | Detail |
|---|---|---|
| F1-F3 | Odyssey carries a physical home, uses layer-specific admission and vacuum, and treats departure retention explicitly | [ODYSSEY.md](ODYSSEY.md) |
| F4-F5 | Germline inheritance, implanted genes, active expression, childhood learning and milestone choices have different owners | [BIOTECH.md](BIOTECH.md) |
| F6-F7 | Beliefs configure multiple rule readers; roles add conditional work/abilities; rituals have obligations and aftermath | [IDEOLOGY.md](IDEOLOGY.md) |
| F8-F9 | Study retains subject-specific progress/notes and feeds selected knowledge projects, with containment affecting yield and risk | [ANOMALY.md](ANOMALY.md) |
| F10-F12 | Work priority, bill intent, material search, actual production and missing-reason UI are separate stages | [WORK_AND_PRODUCTION.md](WORK_AND_PRODUCTION.md) |
| F13-F15 | Storyteller eligibility, weights, schedules, threat budgets, population intent and successful history are distinct | [STORYTELLER.md](STORYTELLER.md) |

## Prior-pass reconciliation

| Code | Prior evidence / cutoff | Current correction or extension |
|---|---|---|
| C1 | Root dossier and feature traces read 1.6 | Six bounded consumers now read from pinned 1.7 DLL. The prior 1.7 aspect pass already established the version change; this is independent confirmation, not a new upgrade claim. |
| C2 | 1.7 aspect checkpoint left all full DLC consumers unread | Current Odyssey/Biotech/Ideology/Anomaly routes are source-covered at the cited methods. All DLC internals and native operation remain partial. |
| C3 | Work selection and bill UI were bounded evidence | F10-F12 add count hysteresis, recipe generation and completion order. Missing-material explanation is forced-menu-specific and not a universal autonomous blocker ledger. |
| C4 | Storyteller random path was sampled | F13-F15 add actual eligible-to-success flow, seeded cycle scheduling, population intent and threat-budget distinction. Weights are relative selection weights, not annual incident rates. |
| C5 | Earlier food/growth/material spans were historical 1.6 | The named raw meal/butchery/drug/smelt definitions and growth consumers here are current 1.7. This does not reconfirm all older food/stat paths. |
| C6 | Multi-map movement could sound like all old places persist | The no-anchor branch abandons its map. Loaded maps share ticks; this donor is not evidence for profile branches progressing offline. |
| C7 | Genetics reference named complexity/metabolism | Inheritance checks active non-overridden metabolic totals, but installed versus inherited carrier and active expression are distinct. YAIRPG need not impose this game's balancing budget universally. |
| C8 | Inventories count raw authored records | New census independently matches 14,084 raw Def nodes/254 families, including abstracts. Generated drug recipes and resolved inheritance are outside that raw RecipeDef count. No effective DLC activation claim. |

Owner edits proposed only: add this pass as evidence in synthesis P01/P02/P03/P04/P05/P07/P08/P10/P11/P13/P16/P20; add RW-D2 under genetics GD3/G18/G53 rather than inventing a universal inheritance rule; add RW-D3 beside technology RW5/RW7 and TGR4 with its distinct study route; link transport to K15/K25 and the nested-world carrier contract. Do not append new BW/RW codes without the palette owner reconciling its current registry.

[Packets](IMPLEMENTATION_PACKETS.md), [small touches](SMALL_TOUCHES.md), [tooling](TOOLING.md), [checkpoint](CHECKPOINT.md), [aspects](aspects-2026-10-14/ASPECTS.md). Nothing implemented, built, installed, committed or director-accepted.
