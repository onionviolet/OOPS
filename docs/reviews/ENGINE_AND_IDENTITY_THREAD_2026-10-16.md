# Engine foundation and game identity thread, 2026-10-16

One place to resume this thread and dig deeper. It collects what Weibao asked,
what was saved where, what is still open, and the parts of the discussion that
only lived in chat until now. Findings and proposals are Claude's, not accepted
decisions, except where a USER_VISION entry says otherwise.

## Saved outputs

| Topic | Owner | Status |
| --- | --- | --- |
| Modularity and rewrite assessment (source of the thread) | `docs/reviews/MODULARITY_AND_REWRITE_ASSESSMENT_2026-10-16.md` | **Untracked** in the shared checkout; its owner should commit it so worktrees can see it |
| Architecture rules AR1–AR16 | [ARCHITECTURE_RULES.md](../ARCHITECTURE_RULES.md) | Standing direction (USER_VISION 2026-10-16) |
| Modular seams Codex run | [dispatch checkpoint](../gm/dispatch/modular-seams-2026-10-16/CHECKPOINT.md); live copy on branch `codex/modular-seams` | M1 and M2 passed; M3 crafting stopped, implemented-unverified; branch behind HEAD (Update 2026-10-19: M3 passed on resume, see CHECKPOINT) |
| Branch triage | [BRANCH_TRIAGE_2026-10-16.md](../gm/BRANCH_TRIAGE_2026-10-16.md) | 9 merged, 19 deleted, `w1-campaign` left for Weibao |
| Rapid iteration | [RAPID_ITERATION_CONSIDERATIONS_2026-10-16.md](RAPID_ITERATION_CONSIDERATIONS_2026-10-16.md) | O2 (headless runner) now landed through the triage merges |
| Foundation and kernel contract | [FOUNDATION_CONSIDERATIONS_2026-10-16.md](FOUNDATION_CONSIDERATIONS_2026-10-16.md) | C1–C8 proposed |
| Core engine and runtime | [CORE_ENGINE_AND_RUNTIME_CONSIDERATIONS_2026-10-16.md](CORE_ENGINE_AND_RUNTIME_CONSIDERATIONS_2026-10-16.md) | G1–G13 references, N1–N8 proposed; ER12 owns signatures |
| Existing kernel design | [OWN_ENGINE_KERNEL_DESIGN_2026-10-14.md](../research/OWN_ENGINE_KERNEL_DESIGN_2026-10-14.md) | Prior owner, still current |

## Chat-only parts, now recorded

### Review of the assessment

- Agreed: no whole-game rewrite. A rewrite run by the same agent process grows
  the same tangle, because the tangle comes from how features are wired in, not
  from the old code alone.
- Added: `main.js` appeared in about 70 of this month's `src` commits (next
  file 27). That churn is the signal. Make `main.js` a composition root with a
  one-registration-line budget per feature, break the `display` ↔ `main`
  cycle first, deprioritize the workbench pilot, reserve hot files during
  extraction, and require lanes to land through the registry. All became AR1–AR16.

### Rebuild from scratch versus this plan

The end state can look like new internals under the YAIR and Proto23 ideas. The
difference is the route: the game stays playable, saves and content carry over,
and each step is cheap to undo. Switch to "new kernel, old content" only if
three or more domain migrations fight the global-state tick (136 top-level
`let`/`var` in `main.js`). The kernel contract is the same either way.

## Game name

Weibao (2026-10-16): "Yet another is part of the irony, since its not jusy
another one". He floated "Webnovel RPG" and "fiction engine" and found the
latter too bougie.

| Code | Consideration |
| --- | --- |
| GN1 | Keep the irony. The phrase works because the game is anything but another one |
| GN2 | The current title is upstream's exact name, "Yet Another Idle RPG" (Miktaew, MIT). Identical naming confuses his players and implies endorsement. A changed middle word keeps the joke and the YAIR family resemblance while being clearly a different game |
| GN3 | The game's identity is web-novel shaped: transmigration, cheats and systems, book, anime and light-novel worlds ([cheat cosmology](../CHEAT_COSMOLOGY.md), USER_VISION world priority). "Yet another isekai" is itself a running joke about that oversaturated genre |
| GN4 | Candidate that keeps the acronym: **Yet Another Isekai RPG** (still YAIR). Variants: Yet Another Isekai Life, Yet Another Isekai. Each doubles the irony: the genre is crowded and the game exceeds it |
| GN5 | "Webnovel RPG" works better as a tagline than a name: "Yet Another Isekai RPG: a web-novel life sim across worlds" |
| GN6 | "Fiction engine" describes the engine for developers, not the game for players; keep it for internal docs if useful |
| GN7 | Original worlds and non-isekai starts (born locals, nonhuman starts) still fit: in the genre, "isekai" covers reincarnation and regression too, and the name is ironic rather than a literal limit |
| GN8 | Before committing a name, check for existing games or novels with the same title |
| GN9 | Rename the player-facing name only: page title, social tags, in-game title, README, plus a visible "Based on *Yet Another Idle RPG* by Miktaew (MIT)". Keep LICENSE. Save keys stay unchanged so existing saves remain visible. The folder and repo name stay for now (launchers, worktrees, Codex and Claude records use the path); a GitHub rename can come later with redirects |

No name is selected.

*Update 2026-10-19: superseded. OOPS (Optimistic Progression Simulator) was accepted as the fork's name; see [OOPS project identity](../USER_VISION.md#oops-project-identity-2026-10-16) and PROJECT.md. The GN rows above stay as the naming history.*

## Core loop

Weibao (2026-10-16): "heir loop doesnt have to be the core loop, the core loop
should probably be scoped properly upcoming? ... Might need seperate deeper
considerations". Correction: an earlier chat suggestion pitched a name for
"selling the heir loop". The heir and lineage loop is one available loop, not
the core. A name should not presume a core loop before it is scoped. The core
loop gets its own deeper considerations pass; engine work stays loop-neutral
(C1 cadences, C2 scopes and N5 absence policies support any core loop).

Deeper pass: [core loop scoping considerations](CORE_LOOP_SCOPING_CONSIDERATIONS_2026-10-16.md)
(CL codes, proposals). Recommends the core loop as a shape (choose a pursuit,
act by hand or routine, learn and gain, open a new choice) with discovery as
the hook, making plus exploration as the first discovery pursuits, and the one
prestige layer as a generic fresh-life boundary where heir is one carrier.
Source finding: the build has no offline progress, so accepted AD16 is
unimplemented (CL25). Open for Weibao: build order and first prestige trigger.

## Open decisions for Weibao

1. Game name (GN4 or another), then the player-facing rename (GN9).
2. Resume timing for the [updated modular plan](../gm/dispatch/modular-seams-2026-10-16/BRIEF.md).
   M3 remains stopped; M2.5 is conditional hardening rather than a C/N bundle.
   (Update 2026-10-19: M3 passed on resume; see the [CHECKPOINT](../gm/dispatch/modular-seams-2026-10-16/CHECKPOINT.md). The Saved-outputs row and the continuation plan below carry the same stale "stopped" wording, kept as history.)
3. `w1-campaign` from the triage.

## Deeper passes worth running when wanted

- A Qud-style parts pilot on crafting carriers (core engine L1).
- Offline progress semantics per world (L6), a design pass.
- A generated world past for one world (L2), using the Qud and Dwarf Fortress research.
- A stats and modifiers audit (L7).


## Modular engine and redesign continuation, 2026-10-16

Weibao: "Consider the modular engine stuff and redesign and more?"
[Core engine round 2](CORE_ENGINE_AND_RUNTIME_CONSIDERATIONS_2026-10-16.md#round-2-modular-engine-redesign-and-delivery-2026-10-16)
adds MX1–MX12, proposals only. It qualifies the earlier M2.5 bundle and numerical
rewrite threshold, restores AD16 inactive-world pause as the default, and traces
load failure, command ownership, bulk-time boundaries, scenario parity and
lifecycle/provenance concerns. Recommended next proposal is the stopped M3
native journey, then a different existing consumer to test the smallest seam.
The live worktree checkpoint was read; its runtime gates were not rerun. No run
was resumed, no branches merged, and no naming or core-loop decision changed.


## Current modular continuation plan, 2026-10-16

Weibao requested a plan update for the interaction/engine gaps before continuing.
[BRIEF MP1–MP10](../gm/dispatch/modular-seams-2026-10-16/BRIEF.md) is now the
executable continuation owner in both checkouts. It supersedes the open-decision
row above that proposed folding all C/N fields into M2.5: hardening is conditional
on the traced current need; M3 remains stopped and its existing gate comes first.
M4 is a planned cross-domain reuse proof. [EI13–EI22](../ENGINE_EXPANSION.md#future-fit-engine-plan-useful-depth-and-iteration-2026-10-16)
retain future requirements with triggers and observable done checks. This planning
edit launches no worker and selects no game name or new core loop.

Superseded open-decision wording, retained verbatim for history (2026-10-16):

2. Whether to run M2.5 on `codex/modular-seams`: merge HEAD, fold C1–C8 and N1–N8
   into the registry under ER12, then resume M3 crafting with scenarios.
