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
8. **Commit when authorized**, only this run's paths: `commit_list.py` for whole files and
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
| 2026-10-14 | 15 | none new (W36, W37 running) | this commit | What's next A1-A5; NX1-NX12; topic map added. Baseline for trend: K19-K34 runtime 0 met of 288. Next run starts a dated successor root (NX11) |
| 2026-10-14 | 15 follow-up | W36 integrated by root | this commit | Calendar and climate slice merged (51b045e0, not pushed); rebuilt 1366x768 journey passed except export/import (OPEN); fixed CR8 and a pre-existing Paradise enrollment crash |
| 2026-10-14 | 16 | TW-K, TW-S, TW-L ([topic wave](../gm/dispatch/topic-wave-2026-10-14/COMMON.md)) | this commit | Successor root started (NX11): [WORLD_CORE_KIT_SUCCESSOR](../worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md). Aspects A01-A12 to kit parts (KW1), per-world dialogue, event and save rows (KW2-KW4) |
| 2026-10-14 | 17 | TW-K, TW-L, TW-S folded | this commit | FK1-FK4 corrections; card refresh (NX8) is the top kit action; next slice P01 on Village mixing; W37 reader is the kit build candidate |
| 2026-10-15 | 18 | multi-world lanes and audit folded | this commit | FK5-FK10; MWA-P02 (local rule changes one verb) is the multi-world build candidate; UI rules UR2/UR4/UR8 constrain it |
| 2026-10-18 | 19 | none | not committed | Little stuff every world needs: KN1-KN12 gaps found by keyword pass (waste, light, leisure, folk wisdom, petty crime, units, body care, pests, sounds, death customs, literacy, complaints); KU1-KU6 authoring tools (law-to-daily-life pass, texture layers) |
| 2026-10-18 | 20 | none | not committed | KF1–KF3: optional texture, provenance versus destination mechanisms, one useful joined case; no full-world prerequisite bundle |
## Core-rule reconciliation, 2026-10-18

Apply the [shared pass](TOPIC_EXPANSION_AUDIT_PLAYBOOK.md#core-rule-reconciliation-pass-2026-10-18)
to affected future rounds. Codes: AD2–AD9/AD16/AD23/AD33/AD36/AD38, SR4/SR14/SR20/SR21, WA8/WA12.

**Composed case:** A world card separates source evidence, character knowledge and implementation coverage. Test one useful local mechanism and its time/custody aftermath; kit floors and round-19 texture are palettes, not mandatory bundle gates.

**Current correction:** Successor root round 20 and the relevant rule owner now carry the
constraint. Current old-save compatibility is deferred; newly built state still
round-trips. Player-facing proof uses current UI_RULES targets. Proposals and
NPC/layout/mobile deferrals keep their status. This is a docs-only rule-fit pass,
not a rerun of source/game-reference lanes or evidence that gameplay works.

Later execution: strong cross-domain agent, medium only when that seam is
selected; reuse the affected existing suite and require a useful rebuilt journey
plus current-state persistence when changed. No lane is dispatched by this entry.
