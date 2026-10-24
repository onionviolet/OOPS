# Worktree reconciliation, 2026-10-24

Weibao, 2026-10-24: "run the reconciliation pass: inventory every worktree, merge
finished gate-passing lanes into master, retire stale ones, leave live sessions
alone. No push." Rules: AD36, AD41, the
[shared worktree practice](SHARED_WORKTREE_PRACTICE.md) (merge before dispatch,
guarded branch update, primary-checkout retirement). Nothing was pushed.

## Landed on master

| Commit | What | Evidence |
|---|---|---|
| `1371a0ddc` | The O/F/A integration branch's staged merge of master `547209e82` (itch.io wave), with the integrator's hand-resolved conflicts | Integrator's own record in [features O1-O5 handoff](dispatch/features-o1-o5-2026-10-23/COORDINATOR_HANDOFF.md) |
| `e3c50c0c3` | The gated O/F/A candidate: O1-O5 lanes, A4, LOTM Q2-Q6 reconciliation, H2 seen fix, road-mishap null guard, primordial credit, `take_in` ward and estate kin line, Primordial layout row, `src/progression_gates.js` | The candidate's sorted sha256 over src/styles/tests/scripts/locales recomputed to `d59dfe7d82dcbc01`, the tree the integrator gated (build, check:arch, check:rules, `npm test` 2796/2796, headless browser re-run). The committed tree hashes to `2fe5644f6d707c10`, which is the same tree minus two untracked `src/chronicle*.js.orig` scratch files. LOTM files match the lane's `RECONCILIATION_MANIFEST.sha256` (60 files) |

`master` moved from `547209e82` to `e3c50c0c3` as a guarded fast-forward
(`update-ref` with the old value). No full suite was rerun: the gated inputs are
unchanged (AD36). Not run here: human acceptance, normal-app adoption, a
native-pointer proof of `take_in` and the Family panel, the 1366 LOTM sweep.

### Primary checkout sync

The primary checkout had `master` checked out with 768 dirty paths from other
sessions, so the ref move was paired with an index and working-copy sync for the
368 changed paths:

- Index for those paths set to the new commit's blobs (`git restore --staged --source`); nothing else staged.
- Working copy: 281 new, 31 already identical, 31 untouched by others, 3 generated (`dist/`, `index.html`) taken from the gated build.
- 12 superseded: primary's pre-reconciliation LOTM copies (last edited 10-23 11:15) and `src/skill_overflow_domain.js` replaced by the reconciled versions.
- 10 kept with other sessions' pending edits, unstaged: `src/economy_standing_domain.js` (insurance offer), `src/heir_inheritance.js` (W3 lineage), `src/layout_spec.js`, `src/main.js`, `src/ui_extras.js`, and union-merged docs `docs/RULES_INDEX.md`, `docs/PROGRESSION_GATE_OVERFLOW_2026-10-23.md`, `docs/worlds/IMPLEMENTATION_MAP_ABILITIES_PROCEDURES_SUBTLE_INTEGRATIONS_2026-10-23.md`, the LOTM `QUEUE.md` and `lotm-q1` checkpoint. Zero-loss: no committed line is missing from these working copies except in-place edits by their own sessions.
- The primary's `dist/bundle.js` now matches the gated build and does not include other sessions' uncommitted `src/` edits; they rebuild before their own proof.

Notified: O/F/A coordinator `local_5e36e0d0` (takeover note), LOTM lane
`local_15ab0c13`, progression-gates owner `local_23789a55`.

## Retired

Archived first at `/Users/weiwei/.codex/research/worktree-cleanup-2026-10-24/`
(MANIFEST with HEAD and branch, `index.patch`, `worktree.patch`,
`local-files.tar.gz`, `SHA256SUMS`, all verified). Each HEAD is reachable from
master, no process had its cwd there, and plain `git worktree remove` was used.
Branches are kept.

| Worktree | HEAD | Residue |
|---|---|---|
| `integration-o-f-a` | `e3c50c0c3` | two `.orig` scratch files |
| `paradise-chart-fix` | `547209e82` | Paradise chart edits and test, already on master; local bundle |
| `party-cargo-stock-161ca8` | `a2952f784` | local bundle only |
| `salvage-spatial-pacing-879697` | `18ba1d728` | local bundle only |
| `weakling-description-27e8a2` | `05d5b8830` | local bundle only |

To recover one: add a worktree at the MANIFEST HEAD, `git apply --index index.patch`,
`git apply worktree.patch`, then extract `local-files.tar.gz`.

## Left in place

All HEADs below are now reachable from master; each holds uncommitted work that
master does not contain.

| Worktree | Owner session | Why kept |
|---|---|---|
| `lotm-pathways-2e8786` | `local_15ab0c13` | 2 processes with cwd there; 1 file beyond master |
| `family-habits-3f2101` | `local_82b6ec89` | a Python process has its cwd there; 4 files beyond master |
| `ability-engine-4c5ccb` | `local_fd6f004e` | `A1_PROBE.md` not on master |
| `agent-a355d67700960c941`, `agent-aa1b92c2c914395de`, `closure-combined-h1h2` | high-power closure `local_cd7c318b` | H1/H2 edits to `ui_extras.js`, `rank_gap_observer_domain.js`, `main.js`, `layout_spec.js` and rank-gap scripts conflict with master; owner decides what remains after the landed H2 fix |
| `d1-gate-deps-7a78e1`, `d2-decision-reasons-c6d17b`, `d3-overflow-pilot-9433a4`, `gtl10-overflow-pilot-49f9f4` | progression-gates `local_23789a55` and lane sessions | 4 to 7 files each beyond master; D3's overflow row already landed |
| `desktop-interaction-closure-2e51ef` | `local_9127611c` | 18 files beyond master |
| `qud-g1` to `qud-g7`, `qud-integration-c0781f` | Qud closure `local_a4c80312` | separate integration candidate (65 unique files in the integration checkout), not part of this landing |
| `~/.codex/worktrees/master-except-start-menu` | Codex | detached, 1 local file |

Master is 24 commits ahead of `origin/master` (7 earlier local commits, the 12
O/F/A lane and merge commits, the two landing commits and three record commits);
push waits for Weibao.

Primary-checkout backups of every file the sync overwrote, with `land_log.txt`
(per-path disposition) and `primary-backup.sha256` (verified), are at
`/Users/weiwei/.codex/research/worktree-cleanup-2026-10-24/primary-sync/`. For
the 10 files kept with other sessions' edits, the count of candidate-added lines
missing from the primary working copy is 0 in every file.
