# C1: Lifetime reading, 2026-10-07

Read-only source review of Your Chronicle build 25001959, Amazing Cultivation Simulator build 17074448, and the local Elin decompilation. These are bounded code findings, not live gameplay verification or accepted YAIRPG designs.

## Verified source findings

**F1, Amazing Cultivation Simulator: age has a causal boundary and advance warning.**
`/Users/weiwei/.codex/research/amazing-cultivation-simulator/17074448/decompiled/Assembly-CSharp/XiaWorld/NpcPropertyMgr.cs:1235-1293`, symbols `AddMaxAge`, `AddAge`, `Step`:
- Positive age increments can be scaled by `AgeCostSpeed`. Integer-year crossings emit `NpcPropertyChange` for Age.
- At one year or less remaining, eligible disciples/work-broken characters receive `Iamdying`; at `Age >= MaxAge`, `BodyData.Kill` receives the natural-lifespan cause. `IsLingShou` bypasses this enclosing terminal branch.
- Puppets, zombies and gods do not accumulate this age clock. `Step` accumulates dt against the world's YearLength and increments age by 0.001.
- Raising MaxAge reevaluates aging with `AddAge(0)`; the warning can be removed when sufficient time remains.

This is evidence for warning, exceptions and extensions. It is not evidence for a player heir or an automatic reincarnation system. The one-year warning makes remaining time actionable before the boundary.

**F2, Elin: age is biography grounded in calendar time, with explicit exceptions.**
`/Users/weiwei/.codex/research/elin/Elin-Decompiled/Elin/Biography.cs:64-99,276-320`, symbols `birthDay`, `birthMonth`, `birthYear`, `GetAge`, `SetAge`, `SetBirthYear`:
- Normal `GetAge` returns `world.date.year - birthYear`. A locked age, unique source biography and the non-player noAging principal can override that result.
- `SetBirthYear` anchors the supplied age to the current world year; age is not an independent counter in this path.
- This particular age getter counts years, not birthdays; birth month/day are separately stored.
`/Users/weiwei/.codex/research/elin/Elin-Decompiled/Elin/Player.cs:1717-1722` uses birthplace and birth-date fields in text substitution.

This supports a life view anchored in a place and date. It does not establish that old age kills characters, grants an heir, or changes learning speed. No such claim is made from these reads.

**F3, Your Chronicle: a run and its inheritance carrier are separate.**
Declaration inventory was checked first through `RECOVERY_MANIFEST.json`: recovered C# files have declarations, not recovered managed bodies. Exact reviewed sources:
- `/Users/weiwei/.codex/research/your-chronicle/25001959/recovery/declarations/DiffableCs/Domain/ReincarnationCtrl.cs`, symbols `ConfirmationText`, `IsCarryOverResources`, `ResetResource`, `DoDeepAscend`, `_beforeReincarnationActions` show the declared reset/UI structure only.
- `/Users/weiwei/.codex/research/your-chronicle/25001959/recovery/native/IsilDump/Domain/ReincarnationCtrl.txt:1325-1480`, `DoDeepAscend`, includes resolved calls to `Save.set_currentChronicleId`, `ResetResource`, and `SaveManager.DeepAscend`.
- `/Users/weiwei/.codex/research/your-chronicle/25001959/recovery/native/IsilDump/Domain/SaveManager.txt:2479-2559`, `DeepAscend`, preserves the existing Save reference in one slot, constructs a new `SaveR`, assigns it into the run slot, recalculates effects and calls `MySceneManager.DiposeAndLoad`.
- The prior local bounded review `/Users/weiwei/.codex/research/your-chronicle/25001959/native-retention/REVIEW.md` and its `EVIDENCE.json` map those routines to raw native spans and annotations. Its broader retained-class/resource claims were not independently retraced here.

The directly reread path supports deliberate reset and a separate persistent carrier. It does not support interpreting reincarnation as a simulated lifespan or physical child succession. Detailed retained-resource tables and all callback effects remain outside this pass.

## Smallest playable recommendation

**P1, proposal: one final-year visit that leaves one usable lesson.** On an opted-in mortal chronicle, crossing into the last year emits one saved in-world warning and opens a single action to entrust one already learned lesson. Death records the chosen lesson and an epitaph from saved milestones. The successor can use that specific lesson in one existing encounter, producing a visible changed choice/outcome. The bequest is a distinct field from current-life skill progress; do not copy the entire life state.

Why this slice: ACS supplies a warning before an irreversible boundary; Elin supplies a dated biography; Your Chronicle supplies a distinct retained carrier. None of the three establishes that generic multiplier inheritance alone creates a lived life.

This is a proposal within the assigned first life slice, not an accepted persistence contract. Coordinate record ownership with the foundation lane. Live `src/chronicle.js` already imports `life_experience.js` and validates `experience.bequest`; reconcile with that work before adding fields or actions.

**A1, acceptance gate:** from a fresh test origin, play/seed a mortal life near its boundary, cross once, read one warning, choose a learned lesson, save/reload, reach death once, inspect epitaph and retained lesson, then exercise its successor consumer. Import the same save and repeat. Verify no warning/death duplication, no inherited unlearned lesson and unchanged default vanilla recovery. Until exercised, call the behavior implemented-unverified.

## Limits

No game was launched. This review did not audit ACS reincarnation/talisman chains, Elin player death and revivals, Your Chronicle complete reset callbacks, tuning or current YAIRPG browser behavior. Elin's repository describes itself as dnSpy-generated community documentation and warns that it can lag the game. Your Chronicle's lossy ISIL contains NotImplemented instructions; conclusions here use resolved calls and clear state construction, with prior review attributed separately. Source roots were not changed. Only this report was written.
