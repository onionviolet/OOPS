# L5r checkpoint, 2026-10-28

Status: **step audit and synthetic replay checks complete; rebuilt UI proof blocked by sandbox**.
No game source changed. No commit, staging, reset, stash or push. Shared sibling edits preserved.

Authority: [brief](L5R_UI_REPLAY_BRIEF.md), [card](../CAST_LIVES_CARD.md), plan sections
[18–19](../CAST_LIVES_PLAN_2026-10-28.md#18-round-10-the-leads-own-actions-reproducible-through-our-ui-2026-10-28).
Codes: CL161–CL169, CL171–CL190, CLR1–CLR3/CLR6/CLR9–CLR11/CLR13,
AD1/AD6–AD8/AD34/AD36/AD41–AD43; AR3/AR7/AR8/AR10; [UI rules](../../../../UI_RULES.md)
UR14/UR18/UR41–UR49/UR70–UR75. Tooling seam: existing LOTM panel's visible
`data-lotm` controls; read-only snapshot projection. Zero runtime/core-owner changes.

Target: fresh beside life, headless Chrome, 1920×1080. Visible outcome: the existing panel's
walk controls reach each mapped destination and its header names the place. Mobile,
new controls, the lead's own seat and all missing game mechanisms remain outside this lane.

## F1. Files and private data

Public owned files:

| Path | Change |
| --- | --- |
| `scripts/headless/lead_runs/lotm_ui_replay.mjs` | Source-coverage gate, typed scoring, combined gap ledger, two fresh UI runs with natural time, visible-control clicks, place/purse/knowledge assertions, private screenshots and bundle hash. No direct state writes or cheat/time-stepping calls. |
| `tests/lotm_ui_replay.test.js` | Synthetic regression: thin probe, duplicates/skips/order, rejected-source execution, lossy folds, unverified-route scoring, sibling-ledger preservation, ordered UI ports and failed anchors. |
| This checkpoint | Counts, scope, checks and coordinator replay command. |

Private directory, ignored by Git (CLR3):
`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l5r-ui-replay-2026-10-28/`.
It owns `mapping.json`, `step_table.jsonl`, `audit.json`, `combined_gaps.jsonl`,
`source_discrepancies.json`, `second_cases.json`, `prepare.mjs`, `blocked.json`,
`build.log` and `browser.log`. Screenshots/run receipts will also go there.
The original merged scenes, crosswalk, pack, L4a bindings and L4b ledger were read, not edited.

CLR2 probe: **5 lead scenes, 18 steps** in chapters 1–3. Against the brief's approximate
8–12 / 25–40 expectations, the midpoint half-thresholds are 5 / 16.25; neither count is
under half. This is the observed smaller input, not an invented expansion to the expected count.
Every indexed step has a row with verb, classifier/reader class, crosswalk place,
L4a day/band, inputs, outputs and locator. Multi-place scene steps are assigned their actual
place after source review. L4a's early-dawn binding is retained rather than adding a civil midnight.

Direct paragraph review found **one actor-attribution rejection** and **one ordering conflict**.
Both are retained privately against step IDs; the shared extraction is untouched. The rejected
row is a `missing knowledge` source-data gap, excluded from execution and capability proposals.
The ordering-conflict row remains an explicit gap, so index order is never presented as a successful
book-order replay. The 18-row accounting denominator includes the rejected row; 17 rows remain
eligible source actions. No sealed text or identities are reproduced here.

## F2. Score and one ranked ledger

A candidate mapping is not verified UI reproduction. The existing movement controls support
one proposed clean fold, with `loses: []`: two separate timed walks. It credits no purchase,
greeting, memory or knowledge acquisition. Its supporting walk from the beside lodging is
explicit and is not scored as a book step. Earlier gaps remain unexecuted, not silently supplied.
All other steps have a primary typed gap. No lossy fold was accepted.

| Scene ID | Steps | Reproducible, verified | Clean fold, verified | Candidate clean fold, UI pending | Lossy folds | Typed gaps |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `lr.lotm.main.001` | 3 | 0 | 0 | 0 | 0 | 3 |
| `lr.lotm.main.002` | 3 | 0 | 0 | 0 | 0 | 3 |
| `lr.lotm.main.003` | 5 | 0 | 0 | 1 | 0 | 4 |
| `lr.lotm.main.004` | 2 | 0 | 0 | 0 | 0 | 2 |
| `lr.lotm.main.005` | 5 | 0 | 0 | 0 | 0 | 5 |
| **Overall** | **18** | **0** | **0** | **1** | **0** | **17** |

Verified fidelity is currently 0/18; the candidate would yield 1/18 (5.56%) if browser proof passes.
No scene is UI-complete. This audits the supplied steps, not all omitted prose actions.

| Primary L5r kind | Count | CL182 candidate second case |
| --- | ---: | --- |
| Missing verb | 8 | `lr.lotm.main.005#5` and `lr.lotm.main.304#1`: shared object-concealment capability. Second case is indexed/L4b-probed, not implementation-ready source proof. |
| Needs seat: be | 7 | `lr.lotm.main.001#1` and `lr.lotm.main.004#2`: identity-owned entry and memory. This is seat work, not seven new verbs. |
| Missing UI path | 1 | `lr.lotm.main.004#1` and candidate `lr.lotm.main.109#2`: readable waiting through the existing clock. Second candidate needs paragraph review. |
| Missing knowledge | 1 | Source rejection, not a missing game capability; tied with UI path in count. |
| Hidden by disclosure | 0 | No additional primary rows. |
| Blocked by mechanism | 0 | Identity-bound body cases are counted under seat, not counted twice. |

`combined_gaps.jsonl` uses L4b's `scene/kind/layer/locator/reason/code/status/basis` fields,
adds `step/gapKind/lane`, and preserves all 15 L4b rows alongside 17 L5r rows: **32 total**.
It is sorted by descending shared layer count, with stable layer/scene tie order.
The sibling ledger stays read-only. L4b has no equivalent primary UI-gap taxonomy, so the
merge uses its existing layer taxonomy; a layer is not itself a shared capability brief.

| L4b layer | L4b | L5r | Combined |
| --- | ---: | ---: | ---: |
| Verb | 4 | 9 | **13** |
| Rule | 3 | 7 | **10** |
| Aftermath | 4 | 1 | **5** |
| Number | 2 | 0 | 2 |
| Noun | 1 | 0 | 1 |
| Detail | 1 | 0 | 1 |

Top three merged layers and second-case candidates: **verb 13**, the concealment pair above;
**rule 10**, identity entry/memory above (distinct from L4b's contract rules);
**aftermath 5**, L4b `lr.lotm.main.304` and `lr.lotm.main.503` knowledge receipts.
The added aftermath row is a source rejection requiring data repair. It must not inflate a runtime
knowledge feature's priority. These counts propose no new build authorization.

## F3. Checks, build identity and remaining gate

Observed shared HEAD at initial input inspection: `84c1f84f6245d94318cec4249fe3686416419f83`.
`mapping.json` records source/scenes/crosswalk SHA-256 identities; `audit.json` records the mapping hash.
The CLI rejects changed scene bytes. Assets/private pack remain live links in the isolated build,
so the coordinator must use unchanged relevant inputs or rebuild for its own final candidate.

Bundle SHA-256:
`d4e52b0734ed3d7ecb8363749cf266beeecbc143f8ce08347ceb153737ca3868`.

| Command / route | Result | Gaps |
| --- | --- | --- |
| `node /tmp/l5r-prepare.mjs` | PASS: private 5-scene / 18-step table and mapping; copy preserved privately as `prepare.mjs`. | Reader assignments and source discrepancies are explicit; no shared extraction repaired. |
| `node --test tests/lotm_ui_replay.test.js` | PASS 4/4 on final driver. | Synthetic UI-port orchestration, not Chrome or game proof. Failure scenario: a fake walk leaves actual place/purse/knowledge wrong; the replay rejects it. |
| `node --check scripts/headless/lead_runs/lotm_ui_replay.mjs` | PASS. | Syntax only. |
| Replay CLI with `--audit-only`, twice; `cmp /tmp/l5r-audit1.json /tmp/l5r-audit2.json` | PASS: byte-identical scores; 18 accounted steps; 32 merged gap rows. | Audit determinism is not UI-run determinism. |
| `BUILD_OUT=/tmp/yairpg-l5r npm run build` | PASS, hash above; private `build.log`. | Shared runtime inputs; no frozen release or app adoption. Tracked index/dist not written. |
| Replay CLI with `--build /tmp/yairpg-l5r` | BLOCKED before first page: Chrome exits SIGABRT; cleanup reports `kill EPERM`. Private `blocked.json` / `browser.log`. | 0 completed UI runs; page-error count unknown; no screenshots. No retry/foreground-browser substitution. |
| `git diff --check -- scripts/headless/lead_runs/lotm_ui_replay.mjs tests/lotm_ui_replay.test.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/L5R_CHECKPOINT.md` | PASS. | No Git writes; full suite remains the coordinator's combined pre-commit gate. |
| `git check-ignore <private mapping.json>` | PASS: mapping is ignored. | Private outputs must not be force-added. |

Coordinator command from the primary checkout (the CLI runs twice and compares results):

```sh
l5r_private=docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27
node scripts/headless/lead_runs/lotm_ui_replay.mjs \
  --mapping "$l5r_private/l5r-ui-replay-2026-10-28/mapping.json" \
  --scenes "$l5r_private/merged-cast-2026-10-28/scenes.jsonl" \
  --l4b-gaps "$l5r_private/l4b-probe-2026-10-28/gaps.jsonl" \
  --out "$l5r_private/l5r-ui-replay-2026-10-28" \
  --build /tmp/yairpg-l5r
```

For just the accounting check, replace `--build /tmp/yairpg-l5r` with `--audit-only`.
Successful UI runs write `run1.json`, `run2.json`, `proof.json` and private PNGs. They use separate
fresh origins/contexts, visible clicks and natural time, with no player-state or clock writes.
Three screenshots cover before and after each leg of the sole candidate folded step; they cannot
prove three distinct mapped book steps when only one candidate exists. The page is read through
snapshot hooks solely for assertions. No source knowledge is injected or credited by a greeting.

Remaining authoritative lane gate: **coordinator runs this driver outside the blocked sandbox,
reviews two identical receipts with zero page errors and the three private route screenshots**.
Until then: mapping/synthetic checks agent-verified, not human-reviewed; UI replay unverified.
No persistence changes; Save/reload/Export/Import are not newly claimed. All missing capabilities,
source repair and future seat work stay named gaps rather than a claim that the lead can play these chapters.

## Coordinator browser replay (2026-10-28, evening)

The lane's UI run never reached a page in the sandbox; the previous coordinator's run stalled 12 minutes at entry.
Two driver defects, fixed by the coordinator in `lotm_ui_replay.mjs`: the snapshot read used
`expansion.knowledge` (knowledge lives at `expansion.simulation.knowledge`), so every read threw and the entry
wait swallowed it; and the purse read used `money` (the save keeps it at `character.money`). Each wait's
timeout now names the wait (entry, source band, walk leg) and the last read.

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/lotm_ui_replay.test.js` after the fixes | PASS 4/4 | Synthetic |
| Coordinator command above, `--build /tmp/yairpg-l5r` | PASS: two fresh-origin UI runs at 1920×1080, identical receipts, zero page errors; the one clean fold (two timed walks) verified; private `run1.json`, `run2.json`, `proof.json` and route screenshots | Bundle `20c9f6f6fb4ff75a72fefe38f03c63d4027842bb73d148dea05090153a8f8d7c`, built before G1; natural clock, visible clicks |

Score after the replay: verified 1/18 (5.56%) as a clean fold; 17 typed gaps unchanged. The waiting step stays a
gap in `mapping.json` until a rescoring pass after G1 lands (CL219). FLR1, FLR2 (natural route), FLR6 met for this
harness; it changes no gameplay or persistence. Agent-verified, not human-reviewed.
