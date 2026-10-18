# R6 report, 2026-10-14

Status: **research complete; all engine patterns are proposals.** No runtime code,
content enrollment, saves, builds, browser play, stage, commit or push. Other lanes'
shared dirty work was not edited. Write scope was this R6 folder only.

## Deliverables

| Code | What changed | Artifact |
| --- | --- | --- |
| R6-R1 | Five-slot tag table format on current tag/generation seams, an explicit query-dialect adapter, layered overlays and ten YAIR-original complete example cards | [ENGINE_PATTERNS.md, R6-P1](ENGINE_PATTERNS.md#r6-p1--rb1-ep8-gm3-l2-a-five-slot-tag-deck) |
| R6-R2 | Slow faction owner: state, actions, saved phases, cadence, legal transfers, supported-time catch-up and edition differences | [R6-P2](ENGINE_PATTERNS.md#r6-p2--rb2-gm4-ep6-l4-faction-turns-as-a-slow-owner) |
| R6-R3 | Move/director option with three outcomes, six-row original consequence table, bounded nested-table contract and authored oracle bindings | [R6-P3](ENGINE_PATTERNS.md#r6-p3--rb7-ep7-gm2-l3-moves-and-a-consequence-option-for-the-director) |
| R6-R4 | Common progress/countdown primitive with distinct advancement and completion policies; attention commitments and durable world-project expenditure kept separate | [R6-P4/P5](ENGINE_PATTERNS.md#r6-p4--ep6-one-track-primitive-separate-progression-and-completion-policies) |
| R6-R5 | Four exact source packets, page/hash manifest, reading index and reproducible extraction, under a locally ignored private folder | [private index](private/READING_NOTES.md), [manifest](private/PACKET_MANIFEST.json), [extractor](private/build_packets.py) |

Every pattern names engine additions versus SHOWN existing file:line seams, save
shape/compatibility and a smallest playable test. Common migration decision: optional
state absent/inert on old saves, no retroactive time/income/draws, preserve existing
roots and frozen values. It requires future validator/export/import admission;
writing the sketch does not implement migration.

## Evidence and boundaries

Read COMMON.md first, then task authority/standing direction, requested root codes,
GR1-GR17 including later fold corrections, ER8-P4/ER8-A4 and applicable playbook
M1/M2/M5. Used existing search.py and directly inspected targeted source pages.
No books were read in full. Extracted 46 SWN, 86 WWN, 10 Godbound and 101 Ironsworn
pages, total243. The exact packets retain entire relevant tables and procedures,
not only excerpts. Mechanically captured catalogs were not all reviewed entry by
entry. Page offsets were checked against printed running markers; no illustrated
PDF layout or OCR accuracy claim. Source text/library remained read-only.

Dungeon World: R3's clone receipt and checkpoint were inspected. Capture/readiness
was still in progress with no delivered REPORT.md at this lane's final readiness
check. Excluded; no source acquisition or remembered rules substituted. Revisit
only if a selected implementation needs it. Four requested books already support
all required patterns.

Important integration findings are recorded in the synthesis: query leaf dialects
differ; current rule lock is tied to its admitted mixture resolver; incumbent
storylet draws are not already the proposed addressed table compiler; SWN/WWN
faction semantics differ; oracle prompts still need legal authored interpretation.
These do not add new gates to ongoing Foundation work.

## Checks actually run

17/17 documentation/source checks passed, covering 243 preserved pages,
44 source spans in 13 files and all 8 private files. The
[machine-readable record](CHECKS.json) records source snapshot hashes and assertions. Checks cover
packet/page integrity, source edition locators, all ten original five-slot cards,
consequence weights, parsed JSON examples, live source anchor bounds, local links,
private ignore/untracked state, and documentary dice/faction arithmetic examples.
They do not exercise an engine consumer. Whitespace and scope were also checked.
No npm suite was run because this lane changed research files only.

## Open acceptance

No playable engine pattern was implemented or validated. All native acceptance
remains OPEN: a selected consumer must use rebuilt desktop1366x768 fresh-origin
play, real actions/costs/consequences, Save/reload and literal-file Import. Source
sweeps/golden seeds are proposed, not run. Faction and project trials stay later;
they do not block ER8-A4's earlier bounded director trial. Root/Weibao review is
still needed before adopting these proposals.
