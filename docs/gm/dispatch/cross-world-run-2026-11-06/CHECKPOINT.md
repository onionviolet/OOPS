# Cross-world foundations run (2026-11-06)

```receipt
build: n/a
route: n/a
state: drafted
viewport: 1920x1080
persistence: n/a
tests: none yet
review: none
```

Weibao, 2026-11-06: "lets work on these to completion" (the round 3 implementation order in [LARGER_FOUNDATIONS](../../../audits/LARGER_FOUNDATIONS_2026-11-06.md#implementation-order-proposal), after the [reconciliation](../../../audits/LARGER_FOUNDATIONS_2026-11-06.md#reconciliation-2026-11-06)). Reading: this authorizes implementing the eight slices in order; AR17 stays a proposed rule text until he accepts it, but slice 1 implements its mechanism. Playbook: [foundation run](../../FOUNDATION_RUN_PLAYBOOK.md). Coordinator: this chat (Claude, primary checkout), sole committer and builder.

## Wave 1

| Lane | Slice | Owner files | Why foundational |
|---|---|---|---|
| W1-A | 1, world-neutral hosts (AR17): tempo and the other world-neutral domains take the world-neutral write port; a shared-panel slot in the LOTM view first filled by the open tempo fight and its openers | `src/native_tool_domains.js`, `src/tempo_fight_domain.js`, `src/book_world_lotm_ui.js`, `tests/perspective_controls.test.js` (registration only), `tests/tempo_host.test.js` (new) | Every shared seam is invisible outside Frontier until a world panel can show it; closes AT15 T1, T2 |
| W1-B | 2, seam adoption register | `scripts/seam_register.mjs` (new), `docs/SEAM_REGISTER.md` (new), `tests/seam_register.test.js` (new) | Makes AR11 checkable before more seams land |
| W1-C | Read-only scoping for wave 2: positions@1 projection consumers, Harry's lead-life calendar (HG1) owners and window state | none (returns text) | Wave 2 briefs need exact files |

Rejected for wave 1: slice 3 code (needs a consumer surface that W1-A owns this wave); slice 4 (HP lead window state unknown, W1-C scopes it); slices 5-8 (depend on 1-4); installed-app adoption (AT7, its own task).

## More to consider (dispositions)

- ACT NOW: the LOTM slot must use a neutral data attribute for the shared layer (perspective_controls trap); an untouched life writes no new save key.
- ACCOUNT FOR NOW: the five world-neutral domains lane H named must each be checked for their own world literals before their port changes; any with Frontier-only purpose stays as is and is listed. The road duel keeps its own eligibility through its quote, so Frontier behaviour is unchanged.
- LATER: HP view slot (after slice 4 gives Harry something to show); register hook into `check:rules` once its output is stable.

## Resume block (unattended run, 2026-11-06)

Weibao, 2026-11-06: "lets work on these to completion".
- Objective: slices 1-8 of the round 3 order each at the AD43 floor or recorded below it with the blocker named; atlas rows refreshed.
- Input identity: master at `b9d020380`; dirty but not ours: `styles/ui_extras.css`, `src/home_domain.js`, `src/main.js`, `src/domain_registry.js`, `src/world_completion_materials_*.js`, `tests/domain_registry.test.js`, `scripts/tauri/*`, untracked `desktop-tauri/`, `scripts/perf/*`, `src/typed_confirm.js`, `tests/typed_confirm.test.js`.
- Steps: wave 1 dispatched.
- Last evidence: AT15 step 1 `8788923e5`; reconciliation `b9d020380`.
- Failed approaches: `b8-range-proof.mjs` (stale task-link click, T3); tempo panel via Frontier `harvestWritable` (T1).
- Next useful action: fold W1-A and W1-B, build, gate, re-walk AT15 with `scripts/lotm_slice/at15-fight-proof.mjs` (origin `docs/research/novels/lord-of-mysteries/private/kj3z-ch52-2026-11-03/ckpt-range.json`).
- Pacing: continue while weekly all-models is under 75% and the 5-hour window under 85%; at 85% on the 5-hour window wake after its reset; at 75% weekly stop and wait for Weibao. Read 2026-11-06 ~22:30: 5-hour 2%, weekly 60%.
- Stop condition: all eight slices recorded, or weekly at 75%, or a blocker only Weibao can clear.
- Resume prompt: "Continue the cross-world foundations run in docs/gm/dispatch/cross-world-run-2026-11-06/CHECKPOINT.md: read the resume block, check live files and running workers, then do its next useful action under the pacing rule."
