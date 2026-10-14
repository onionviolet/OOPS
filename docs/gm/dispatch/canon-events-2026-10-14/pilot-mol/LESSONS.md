# Mother of Learning canon event graph pilot lessons

2026-10-14. Research/prototype only. No accepted design change or gameplay claim.
Opening range: chapters 1–5 in the existing supplied-EPUB dossier. Dossier review
only; no raw-book or full-book reread. Private outputs:
[graph](../../../../research/novels/full-book/mother-of-learning/event-graph-2026-10-14/graph.json),
[branches](../../../../research/novels/full-book/mother-of-learning/event-graph-2026-10-14/branches.json),
[notes](../../../../research/novels/full-book/mother-of-learning/event-graph-2026-10-14/NOTES.md),
[results](../../../../research/novels/full-book/mother-of-learning/event-graph-2026-10-14/RESULTS.json).
These local links require the ignored private dossier; it is not bundled in git.
Source facts below are short paraphrases, with dossier claim/chapter/paragraph
locators. Every counterfactual consequence is an INFERRED proposal.

## What the format expressed well

| Code | Finding | Evidence / qualification |
|---|---|---|
| F1 | Base plus ordered effects yields consistent opening anchors with source locators. | 45 events, six anchors; all baseline events apply, no skips, lint empty. Whole full/incremental results agree at later anchors. |
| F2 | Exact actor and item requirements produce useful cascades while unrelated plans remain eligible. | B1 removes a key actor from the modeled path: 12 events skip, while the incursion still occurs. SHOWN source affordance: MOL-C004-05, ch4:p73–p89. A modeled skip is not proof of every possible alternate future. |
| F3 | Timed knowledge, separate response events and custody changes make the three branches distinguishable. | B2 records message receipt before a proposed response; B3 records a holder substitution and four canon skips. SHOWN source affordance: holder-bound delayed transport, MOL-C004-06, ch4:p80–p107. The alternate outcome is INFERRED. |
| F4 | Separate events can preserve occurrence versus revelation. | A disappearance is reported later as having happened on departure morning: STATED (peer), MOL-C005-06, ch5:p98–p108. The graph changes availability before the later recipient-knowledge event; the earlier anchor does not grant that knowledge. |

## What it could not express by itself

| Code | Concrete canon case, paraphrased | Format limit |
|---|---|---|
| G1 | The protagonist returns to an earlier morning with remembered control; a later return follows leaving the threatened city. SHOWN: MOL-C005-01, ch5:p2–p29; MOL-C005-08, ch5:p157–p166. | A monotonic number cannot represent both local date and iteration identity. Ordinary set effects can replay selected observations but cannot reset arbitrary overrides or establish unknown triggers. |
| G2 | School scenes mostly have relative order; a late report places an earlier disappearance on departure morning. STATED: MOL-C005-06, ch5:p98–p108. | `at` is an ordinal projection here. Window bounds, uncertainty, lazy scheduling and committed resolution are metadata, not engine behavior. |
| G3 | The protagonist mails warnings but sees no response before departure. SHOWN posting, UNKNOWN effect: MOL-C005-07, ch5:p131–p159. | A fact receipt does not mean belief, trust, response or shared knowledge. Named knowledge keys help authoring; `reveal_at` alone cannot filter an NPC or player view. |
| G4 | A transport tool evacuates its holder after a delay. SHOWN: MOL-C004-06, ch4:p80–p107. | A custody fact can change recipients but does not validate reach, consent, activation, interruption, travel time or the proposed player's acquisition. |
| G5 | Rescue and attack stages have different participants and means. SHOWN: MOL-C004-05/07/10, ch4:p73–p89, p103–p104, p113–p127. | Equality requirements and a static alternative list are a bounded eligibility model, not an actor planner or a role-fit solver. Surviving motives do not automatically create new events. |
| G6 | A later rule input records a personal return switch, while effect on others remains unknown. SHOWN local action / UNKNOWN wider effect: MOL-C047-01-manual/shared, ch47:p2–p9. | Fixed-point resistance must have a selected scope and evidenced world law. A blanket `fixed:true` can force a source scene through missing causes. Later knowledge is outside the opening actor horizon. |

## Fields added and their rules

The eight CV keys below are present on every event. Empty lists/null/false are
intentional. Requirements/effects are runtime data; the other keys qualify what
those effects mean. Current runtime evaluates alternatives and fixed flags,
while roles/motives/windows/reveals/confidence/recurrence remain author metadata.

| Code | Field | One-line rule |
|---|---|---|
| K1 | roles | Bind actual actor IDs and required means before authoring a justified substitution. |
| K2 | motive | Preserve attributed intent or UNKNOWN after failure; new responses require authored causes. |
| K3 | window | Record axis, bounds and precision; never label a chosen replay ordinal an exact source date. |
| K4 | reveal_at | Separate reader revelation, actual occurrence and each actor's receipt of information. |
| K5 | confidence | Distinguish confidence in evidence from confidence in its causal interpretation. |
| K6 | recurring | Declare loop-local versus calendar recurrence and re-check prerequisites on each occurrence. |
| K7 | alternatives | Give each finite substitute its own requirements, effects and source/proposal label. |
| K8 | fixed | Default false; require an evidenced, selected law or explicit premise before resisting a failed cause. |

The graph also adds source binding, clock meaning, scope and resetPolicy metadata;
base/anchor evidence and labels; event names and attributed speakers. Branch
records add cause (life/action), evaluation horizon, expectations and limits.
These are listed in private NOTES.md. They do not introduce another runtime
schema. Claim-label translation preserves witness versus narrator versus speaker
reports, rather than treating every dossier CSV `L` as SHOWN.

## How source rules map onto timeline mechanisms

| Code | Rule / evidence | Mapping and default |
|---|---|---|
| R1 | SHOWN return point and retained control: MOL-C005-01-return/knowledge, ch5:p2–p29. UNKNOWN opening trigger: MOL-C005-08-cause, ch5:p157–p166. | World-law/reset adapter with selected local restoration and retained knowledge. Clear only overrides within that reset scope. The two authored returns are observation replay, not a general rollback. |
| R2 | STATED (looping peer) festival deadline: MOL-C007-02-deadline, ch7:p66–p70. Later return-switch/wider-effect distinction: MOL-C047-01-manual/shared, ch47:p2–p9. | Later law evidence qualifies reset conditions and knowledge horizons. It does not make the festival attack or any rescue a fixed point. Default all fixed flags false in this opening graph. |
| R3 | No opening evidence used here establishes fate or plot-armor repair. UNKNOWN within this research cutoff. | Surviving causes allow an independent invasion to continue. Never manufacture a replacement rescuer or mark an event fixed from plot importance alone. Dial: an explicitly selected AU may add a law, labeled as a premise. |
| R4 | SHOWN holder-bound delayed evacuation: MOL-C004-06, ch4:p80–p107. | Item custody supports a narrow alternate recipient. The authored substitute is INFERRED, with no claim that it occurred in canon. Ordinary timed changes model interception and handoff. |
| R5 | STATED academy job/point accounting: MOL-C002-04/13, ch2:p65–p100. SHOWN retained control/answers: MOL-C005-01/07, ch5:p19–p29, p107–p108. | Institutional payments and observed learning, not system-issued XP/loot. No repeatable system-reward law is evidenced by this opening cutoff; cross-reset rewards/exports stay unspecified. |

## Granularity and suggestions

45 events across five opening chapters is dense enough for this bounded pilot.
Split the crisis where body state, actor availability, custody or information
arrival changes eligibility. Bundle ordinary school progress; leave descriptions,
meals, dialogue, recipes and unchanged biography as dossier notes. Do not multiply
this density across the whole novel. Recurring loop-local templates need a reset
adapter before scaling; this pilot expands only two observed returns. Six anchors
cover departure, ordinary term, celebration, crisis and two familiar mornings.
They are snapshot fixtures, not completed playable starts.

At most five suggestions, all proposals:

1. S1: Keep source binding and the two time axes explicit before adding another arc; resolve dates/windows only to the precision the dossier supports.
2. S2: Add a selected reset adapter that restores local facts, clears scoped changes and carries only declared actor knowledge/control; keep an unknown trigger unknown.
3. S3: Treat warning receipt, credibility and NPC action as distinct events, with information channels controlling visible snapshots.
4. S4: Require source or explicit-premise justification for each substitution and fixed point; keep role fit and motive generation separate from static replay.
5. S5: Preserve the three branch fixtures and six anchor fixtures as regression inputs; future playable acceptance must exercise means, timing, knowledge and persistence.

## Checks and remaining gates

Ran private `build_graph.py` and `validate.mjs`. The validator imports
`/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg/src/anchor_snapshots.js`
by absolute path and leaves it untouched. Final SHA256:
`3fad78804987a83dbb14b59c515c67d572b7d41464137fb62f0571dbc3fd861e`, stable during run.
All three native timed branches pass their recorded expectations. Full versus
incremental entire results match for baseline and branches; pre-divergence
snapshots are unchanged; B3 substitution is recorded; provenance carries the B2
change cause; inputs are unmutated. Author checks cover unique IDs, opening claim
locators/paragraph bounds, required CV keys and loop guards. B1 also passes the
lossless legacy single-set form. An initial run encountered the pre-extension
module and rejected native timed branches; the final run uses its updated API.

Open source gaps: exact scene dates, opening reset trigger/scope, warning response,
rod interception feasibility and changed-path outcomes beyond the crisis. No
source gap was filled by memory. Fixed resistance has no source-backed case in
this pilot. General recurrence, lazy windows, knowledge visibility, reset adapters,
NPC planning and gameplay/save/reload/import acceptance remain outside this
research result. No shared source edits, staging, commit, push or publication.
