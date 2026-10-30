# Knowledge, investigation and perception: representation (proposal)

Status: **proposal**, 2026-10-30, from the UI representation wave; it binds nothing until
Weibao says yes (AD32). Codes cited: LTU4 (Journal → Knows home), RPX6 divination results,
RPX7 spirit or second sight, RPX8 dreams and visions, RPX12 investigation board, RPX13
documents ([round 11-12](../audits/UI_DESIGN_CORE_AUDIT.md)), UIV6 one known / guessed / unknown
grammar (proposed), UR76 UI contract (proposed), UR36, UR37, UR42, UR74, AD6-AD8 and the
[sealed-secrets rule](../../AGENTS.md#sealed-secrets).

## What is being drawn

One store: `state.simulation.knowledge[actor][key] = {stage, value, at, cause, basis}`.
`stage` is seen, interpreted or understood. `basis` says how it arrived: observation,
recollection, instruction (told, or read with a `sourceId`), inference (with `evidence` keys and
a stated `uncertainty`); divination adds `method`, `queryId` and a signal `status` of signal,
obscured or unanswered. Intentions live as the seat's own facts
(`inference.<chain>.intention`: considering, active, postponed, cancelled). Inference and
divination adapters already write all of this; nothing new is stored.

## Options weighed

| Code | Representation | Good at | Weak at |
|---|---|---|---|
| KR1 | **Knows list with provenance** (Journal → Knows) | Every line readable, searchable later, the text form for free; date and "how you know" on each line | Shows no structure between clues |
| KR2 | **Investigation board** (RPX12): MDL2 figure, known left, readings middle, open questions and plans right, "supports" edges from `basis.evidence` | Shows what led to what and what is still open; the shape of a case at a glance | Crowds past a dozen nodes; labels must be short |
| KR3 | **Divination fragment cards** (RPX6): a scene card per rite, signal then reading, "seen in the bowl" skin | Rites feel like rites; obscured answers look obscured | Covers one source of knowledge; needs the scene card skin per method |
| KR4 | **Sight lens over the place view** (RPX7): tint people and things with what the seat perceives, with a cost meter | Perception happens where you are; second sight becomes a mode | Needs a place view projection per world; by default a lens narrows what the list shows, because a fact store there would bypass the seat's own learning |
| KR5 | **Document cards** (RPX13): paper skin, sender, date, seal state, clauses | Letters and notices feel held; contracts show who holds which copy | Waits on a document owner, since reads carry a `sourceId` and no text record |
| KR6 | **Unusual: the doubt ledger.** Each guessed line is a small wager card: what would confirm it, what would break it, and which act tests it (ask, read, divine, watch) | Turns doubt into play: the open column becomes a to-do list of tests | Needs per-line "test acts", which the inference adapter does not yet name |

## Default (proposal)

**KR1 as the home, KR2 as its second view, same rows.** The Knows tab in the Journal shows the
list by default, grouped Known, Guessed, Open and What you mean to do; a Board toggle draws
the same rows as a figure whose text form is the list's lines. Dial: a world whose knowledge is
mostly rites (a divination-heavy start) can open the Board or, later, KR3 cards first; a world
with a status-window means can add an AP-level column (MEANS_AND_APPRAISAL). Reason: knowledge
has to be readable before it is pretty, and one adapter feeding both views keeps them from
disagreeing (UR74).

KR3, KR4 and KR5 become skins over the same rows once their owners exist: KR3 groups rows by
`basis.queryId`; KR4 filters rows by the seat's current place; KR5 needs a document owner first.
KR6 is the strongest next idea: it is where investigation becomes a verb.

## Grammar (UIV6, proposed)

| Seat state | Word | Figure state used now | Source |
|---|---|---|---|
| stage seen or understood | Known | `filled` ● | the seat saw, was told, read or learned it |
| stage interpreted | Guessed, with its stated doubt | `pending` · | the seat's own reading; may be wrong |
| divination `obscured` or `unanswered`; a chain still being considered | Open | `unknown` ? | the seat asked and got no answer |

The figure primitive has no `guessed` state, so the board relabels existing states through its
legend ("● filled means known: seen or learned"). Proposal for the coordinator: add a
`guessed` state to `FIGURE_STATES` so the text form reads "(guessed)" instead of "(pending)".

## Sealed secrets and seat limits

The adapter reads only `observerView(state).knowledge()` and `.facts()`. It never reads world
facts, another actor's knowledge or a queued job's frozen effects, so a sealed truth has no path
to the page until the seat itself receives it. Open rows come only from the seat's own
unanswered questions, never from truths it lacks, so an open row cannot reveal that a secret
exists or how many there are. A lens (KR4) can only filter these rows further. A sight means that
reveals more is a knowledge write by its own mechanism, not a display rule.

## Home and contract (UR76, proposed)

- Home: **Journal → Knows** (LTU4). A tab beside Quests, Bestiary, Anthology and Data, and a
  top-nav route `records:knows` (Alt+F), because the shell names Journal tabs in the nav (UR42).
- Shape: list rows (K1) plus an MDL2 figure.
- States in words: empty ("Nothing learned yet. Look around, ask, read or think, and it is kept
  here."); populated (count line plus groups); board over six per column ("N more known lines are
  in the list."). People stay in the People panel; the tab links there.

## Receipt (2026-10-30)

Files: `src/knowledge_view.js` (pure adapter), `src/knowledge_home.js` (Journal tab, domain
registration), `src/ui_extras.js` (one import), `src/layout_spec.js` (one route),
`index.html` (figure.css link), `src/ui/preview/fixtures/knowledge.js` (named fixture through the
real adapter), `src/ui/preview/figure_gallery.js` (one import), `tests/knowledge_view.test.js`,
`scripts/capture_knowledge_evidence.mjs`, evidence in `evidence/knowledge/`.

Change surface (FND2): core-owner files touched: `layout_spec.js` (one route row),
`index.html` (one stylesheet link); new import cycles: none; registration lines: one in
`ui_extras.js`, none in `main.js`. No persistence change: the adapter is projection only, so
no migration (FLR5 n/a).

Checks (one line each):

- `node --test tests/knowledge_view.test.js`: 6 pass. Covers the sealed line planted in world facts, a bystander's knowledge and a queued job's frozen effect, absent from rows, spec JSON, `figureText` and the drawn SVG; the positive control shows it once the seat receives it.
- `node --test tests/layout_spec.test.js`: 19 pass after adding the Knows row to the pinned route table.
- `npm run check:arch`: pass (main.js not grown); `npm run check:rules`: pass, 5 standing warnings; `npm run check:docs`: no findings in this file.
- `npm test` (this worktree): 4123 tests, 4104 pass, 13 fail. One was this slice's: `perspective_controls.test.js` needs every nav route tagged; it is fixed by a `records:knows` row in `src/perspective_controls.js`, and its file now passes. Two (`cast_worksheet`, `lead_run_crosswalk`) fail identically on the untouched base in a fresh worktree, because the gitignored `docs/research/novels` is missing. The rest are live-integration timeouts (cast adapters, person-memory route) that need the private cast pack or an uncontended run. They are recorded as environment gaps for the coordinator's full run in the primary checkout.
- `node scripts/capture_knowledge_evidence.mjs`: headless Chrome at 1920×1080 on a fresh origin, rebuilt bundle `0a5329b6d6c0`, 0 page errors. Output is in `evidence/knowledge/` (`receipt.json`, screenshots, text forms).

AD43 floor:

- FLR1 build: bundle `0a5329b6d6c0` (sha256 prefix in `evidence/knowledge/receipt.json`).
- FLR2 route: from a fresh life, meeting the village elder (earned) opens the Journal; the top-nav Knows tab shows the empty state. For populated play, the named prerequisite fixture unlocks the craftsman meeting, as `tests/person_memory_route.test.js` does. Real clicks follow: meet him, "Follow local people and work", "Ask about his working habits". Knows then lists the two lines the simulation wrote. The board's full grammar is proven by the named gallery fixture `knows-harbor-bell` through the real adapter. No MCP walk: the game MCP serves another checkout's build.
- FLR3 shown: every line carries certainty, provenance and when; the empty state says what to do; reading costs nothing (free inspection). The board appends the same text form.
- FLR4 used: the rows are existing knowledge that inference, divination and frontier powers already read as requirements (`knowledge.<key>` predicates). The display adds no new consumer.
- FLR5 kept: n/a. No persistence change.
- FLR6 labelled: agent-verified, not human-reviewed. Route kind: earned to the home, fixture-assisted for populated content.

Known limits: the board spreads few nodes over the full height, and in the Journal box its legend sits below the fold (the list is the default view for this reason). Node labels are cut at 40 characters, with full lines in the list. Bestiary and Anthology show as "???????" in the tab strip on a fresh life, which is existing behaviour. `dist/` and the html `?version=` bumps are not committed; the coordinator rebuilds after merging.

Next slice: KR6 doubt ledger on the inference adapter (name a test act per guessed line), then
KR3 fragment cards grouped by `basis.queryId`.
