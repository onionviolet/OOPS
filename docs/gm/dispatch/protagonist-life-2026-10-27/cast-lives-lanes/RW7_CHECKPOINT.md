# RW7: paragraph-reviewed body rows

Status: **100-step review complete; private candidates, not integrated gameplay**.
Agent-verified, not human-reviewed. Ownership released to the coordinator.
[Brief](RW7_BRIEF.md), [body contract](MF_BODY_CHECKPOINT.md).
Only RW7.jsonl and this checkpoint were written in the checkout. No commit,
staging, push, runtime edit, pack edit or shared-doc edit.

## F1: scope, source order and probe

Applies CLR1-CLR4, CLR6-CLR7, CLR9-CLR12, AD2/AD36/AD44.
PROJECT.md and USER_VISION retain the forced canon, lead-first direction and
private source data. No accepted direction changed. This lane reviews the body
family over the existing mechanism; it does not build a new mechanic or UI.

The live X4 ladder, classified by the current `gap_census.mjs` ordered rules,
contains **288 distinct gap/lossy steps** in `rest or personal care`, rather than
the older Resume 2 count of 284. Nineteen already appeared in other review files;
269 were eligible. Reviewed the first 100 remaining steps, leaving 169 outside
this lane. All 100 had retrievable cited source paragraphs, exceeding the inherited
half-retrievable gate. Each cited paragraph was read, with nearby context where
needed, before its verdict was appended. Paragraphs, not step verbs, decide rows.

**Ordering correction:** some later-volume scenes have volume-less locators and
are therefore assigned volume 1 by the mapping. For selection, recovered their
actual volume from the source shard identity, confirmed by volume-bearing shard
headers and paragraph-index keys. Sorted by actual volume, earliest scene citation,
scene order, then step number. The final selection contains 48 volume-1 and 52
volume-2 steps. All 100 IDs remain members of the existing family gap list; no
mapping, census or source file was edited. A fresh independent reselection matches
the output order exactly and finds zero overlap with other review files.

## F2: dispositions

Private output: [RW7.jsonl](../../../../research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/RW7.jsonl).
There are **31 rows and 69 gaps**, all `kind: body`.

| Body row kind | Count |
| --- | ---: |
| meal | 17 |
| care | 10 |
| wake | 3 |
| sleep | 1 |

| Gap reason | Count |
| --- | ---: |
| cited paragraph does not support action | 19 |
| unresolved person/place/object | 12 |
| no mechanism: compound action | 10 |
| no mechanism: ability or material operation | 9 |
| sleep duration unresolved | 8 |
| no mechanism: dream or ritual state | 5 |
| actor not the lead | 3 |
| no mechanism: potion or physiology effect | 2 |
| no mechanism: sub-minute duration | 1 |

Top five generic reasons, ranked for coordinator triage:

| Rank | Reason | Implication |
| --- | --- | --- |
| 1 | Citation does not establish the action (19) | Repair source anchoring or attribution before adding controls. An offer, instruction or setting alone does not establish completed consumption. |
| 2 | Unresolved identity or location (12) | Resolve the actual room/house/site. A city, street, later route stop or nearby building is insufficient. |
| 3 | Compound action (10) | Preserve distinct waking, eating, travel, room changes and information operations through a sequence rather than one receipt. |
| 4 | Ability or material operation (9) | Route preparation, item handling, supernatural effects and animal feeding through their actual owners. |
| 5 | Sleep duration unresolved (8) | Preserve the supported time window without inventing a positive numeric duration to satisfy native sleep. |

Known source durations carry a `minutesBasis`; unknown care/meal times remain null.
The short fractional-minute action remains a gap because the adapter accepts integer
minutes. No stock keys, portion splits, food costs, recovery amounts, progression
outcomes, stage gates or prerequisite evidence were invented. Native IDs were
checked against the live pack, and explicit shared meals retain supported native
participants. One home-location link is explicitly labelled a continuity inference
in the private row. No dream is treated as ordinary native sleep; no potion is
reduced to a generic meal. Native wake rows retain wake state rather than an
invented awake fact. All row IDs derive stably from the source step ID.

## F3: checks, inputs and remaining gate

| Command | Result | Gaps |
| --- | --- | --- |
| `node /tmp/rw7_reselect.mjs 999 999` | PASS: 288 family gaps, 19 prior reviews, 269 eligible, first 100 selected, 100/100 paragraphs retrieved | Offline source selection; actual-volume correction described above |
| `node /tmp/rw7_validate.mjs` | PASS: 100 ordered unique dispositions, zero prior-review overlap; all 31 rows pass `defineBodyCare`, `jsonData`, predicate validation and `createSimulationRegistry`; native place/person IDs and JSON safety pass | Definition/registry validation, not replay or stock consumption proof |
| `node --test --test-name-pattern='optional fields\|real food\|absent meal\|unknown portions\|pack fact' tests/cast_body_adapter.test.js` | PASS: 5 tests | Synthetic adapter/engine invariants; native integration fixture deliberately outside this data-only lane |
| Owned-path whitespace and relative-link check | PASS: both owned files have no trailing whitespace; all checkpoint relative links resolve | Documentation only |

Input identities (SHA-256):

| Input | Hash |
| --- | --- |
| M4 merged scenes | `27540d66f80aeec3301aab50bc00a297e07ab99e55ade4dabdfc6eb46bc3735b` |
| Live private pack | `09c971e95889d9f80bc6f9f15b423547f54cf9bfbd8aa3fa1197e65c80c28e61` |
| Body adapter | `e1539d4afd3ea757eae7228d50ffb1b0ccb04b39385cb1ab3c096b354b876d02` |
| RW7.jsonl | `139c8a8dffb0855258a0a0144a2f8e1fa4af7c18e65306bdc2b68bb2d2b1588b` |

No build or browser run was needed for these private review records. Build hash:
not applicable. Route kind: offline paragraph review and native definition checks.
The runtime floor is not claimed. The remaining authoritative gate is coordinator
adoption into a private candidate followed by that candidate's rebuilt replay and
applicable persistence checks. This lane does not alter the live pack or claim
that 31 additional steps are playable.
