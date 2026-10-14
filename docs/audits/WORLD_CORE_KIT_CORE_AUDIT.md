# World core kit core audit (repeatable)

Saved 2026-10-14 at Weibao's request: "save this core auditing for long term
repeating". A standing procedure for re-auditing what each world needs to play
in depth, down to every little detail. It is one instance of the general
[topic expansion audit playbook](TOPIC_EXPANSION_AUDIT_PLAYBOOK.md); the
world-specific method (readiness cards, lane catalog, tools, lessons) is the
[world core kit audit playbook](../worlds/WORLD_CORE_KIT_AUDIT_PLAYBOOK.md).
Direction: [USER_VISION](../USER_VISION.md#world-core-kit-every-little-detail-and-a-repeating-audit-2026-10-14).

Running it produces proposals and readiness evidence. It never selects build
scope, changes a standing priority or turns deferred work into a gate
(AGENTS.md).

## What it keeps current

| Owner | Role |
|---|---|
| [World core kit](../worlds/WORLD_CORE_KIT_2026-10-14.md) | Root palette: K1-K34, micro (KM, KV, KT, KK, KC, KG), subtle (KS, KQ, KP, KD, KR), comics (CW), lenses (CL), abstractions (AX), implications (II, IS), lane returns (F) |
| `docs/worlds/world-core-kit-<date>/` | Lane outputs; `cards/` holds one consolidated card per world |
| [Kit template](../worlds/templates/WORLD_CORE_KIT_TEMPLATE.md) | Fill-in card for a world GM |
| [First run dispatch](../gm/dispatch/world-core-kit-2026-10-14/COMMON.md) | Lane prompts W1-W20, reports, session ids |
| Sibling owners | Completion standard S00-S14, world-depth parts 07, 10, 23, core foundations scorecard, canon-events lanes, each world's WORLD_BRIEF |

## When to rerun

| Trigger | Lanes to rerun (first-run names) |
|---|---|
| A world joins the canon-first tier, or a world folder or full-book reading appears | W1 readiness for it, then the K-group lanes for its weakest parts (W2-W5, W7, W8) |
| An implementation wave lands for a world | W1 delta for that world, W9 first-day walk against what shipped |
| Capability, tag, randomness, save or clock foundations change | W6 engine, W15 schema, W18 abstractions, W1 delta on K3/K18 for all |
| UI surfaces, log, panels or status window change | W13 perception, W17 lenses, K14 rows in W4 |
| Canon-event graphs or start records change | W5, W12 |
| A new medium or genre is proposed | W16/W20 genre lane, W17 lenses for it |
| Weibao asks "more to consider" on the kit | One palette round plus 2-3 lanes on the new angles |
| Nothing changed but a month has passed, or 10+ design docs landed | W1 delta for all priority worlds, W10 references, W19 consolidation |

## Procedure

1. **Recover state.** Read this file's run log, the root's latest round and
   lane returns, the latest dispatch `runs/SESSIONS.md`, and
   `python3 docs/worlds/tools/core_kit_audit/status.py`.
2. **Check live work.** `ps` for running Codex lanes; dispatch folders dated
   today; Foundation and core-foundations checkpoints. Cap a round at 2-6
   lanes.
3. **Palette round.** Append "Round N" to the root with coded angles on
   every axis asked, Default + Dial, ranked suggestions and a lane table.
4. **Lanes.** `new_run.py` for a new date or reuse today's folder;
   `new_lane.py` per lane; launch detached; record ids with `grep -H`.
5. **Fold returns** as they land: corrections first, short F rows, root
   claims fixed in place.
6. **Consolidate** after lanes finish: per-world cards, lane-prefixed codes,
   contradiction registers.
7. **Record** the round in USER_VISION (the section above, plus a dated
   line) and IDEA_INDEX.
8. **Commit** only this run's paths: `commit_list.py` for whole files and
   `docs/audits/tools/commit_own_paragraphs.py` for kit paragraphs in shared
   owners. Push or merge only on an explicit yes.
9. **Update the run log** below.

## Run log

| Date | Rounds | Lanes | Commit | Notes |
|---|---|---|---|---|
| 2026-10-14 | 1-8 | W1-W20, W19 queued | 596e1cac, then this save | First run. Top gap K3 power core (fragmented capability systems); MoL most ready; comics added as consideration; lens cheats and AX abstractions named |
| 2026-10-14 | 9 | W21-W23 (W19 still running) | this commit | More-to-consider school per part (MC1-MC34). Found `weather.js` is one global season table (KX67); template lacked K19-K34 rows (fixed, AN1); readiness lacked K19-K34 (W21) |
| 2026-10-14 | 10 | W24-W27 launched, W28 prototype queued behind W23 | this commit | Lane per direction (DR1-DR8). Corrected MC2/MC17 lane refs; flagged 35 unmerged branches (core a2-a5) as chain-staleness risk (CR3) |
| 2026-10-14 | 11 | W29-W32 by world group | this commit | Specific worlds. Paradise already has per-instance clock policies and a sourced calendar (CR4-CR5); world shapes SW1-SW8 (hub, loop, paired, institution, modular, hidden layer, contest, book eras) |
| 2026-10-14 | 12 | W33-W35 calendars | this commit | Canon calendars. MoL and Paradise native calendars are elapsed counters in the base-world 30-day, 12-month format (CR7); CC1-CC16 |
| 2026-10-14 | 13 | All W1-W35 finished and folded | this commit | Corrections FX1-FX5 in place; F32-F49; 20 world cards; K19-K34 runtime 0 met of 288; W28 climate prototype on branch kit/w28-world-climate (807/807 tests in worktree, not integrated) |
| 2026-10-14 | 14 | W36 integration slice, W37 fidelity | this commit | Book versus code. Paradise 20 C is a code placeholder; home rain reaches Paradise places via is_under_roof false (CR8); provenance tags SF1-SF10 |
