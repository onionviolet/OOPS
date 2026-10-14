# Merge sweep, 2026-10-14 afternoon

Standing rule: [merge before dispatch](../../../USER_VISION.md#merge-before-dispatch-2026-10-14).
Base: `codex/gameplay-foundations` at `759dd393`. Merged in a private scratch
worktree; the shared index was never touched.

## Candidates

| Lane | Branch, tip | Result |
|---|---|---|
| core-foundations A2 tag store | `core/a2-tags`, `d666e20f` | MERGED. Two new files (`src/tag_store.js`, test). Not imported by the game yet. |
| core-foundations A3 travel tests | `core/a3-travel-tests`, `030c476b` | MERGED. Six new test files only. |
| core-foundations A5 ratchets | `core/a5-determinism`, `6fbc3193` | MERGED with one integration commit: `xorshiftCopies` ceiling 7 to 10. See R1. |
| research-tech T16 planner QA (includes T6 planner `144ed1a0`) | `codex/invention-planner-qa`, `400d6a83` | MERGED. Headless planner, QA, lint and receipts modules; native consumers stay `unbound-demo`. |
| gen-rules G1 pure kit | `gen/g1-kit`, `adaa4e18` | Already merged by R3-10 (`4466a69b`) before this sweep. |
| procgen P34 story spine | `proc/p34-story-spine`, `f9a95e6a` (S-1..S-5) | Already merged by R3-10 (`bafbb76a`) before this sweep. |
| world-core-kit W28 climate | `kit/w28-world-climate` at `6947900b`, no commits | BLOCKED: not finished. No W28_REPORT; the worktree holds uncommitted `src/world_climate.js` and its test. world-core-kit is a live area, so its STATUS was left to its owner. |

## Gates (merged tree, before the docs-only HEAD movement it was merged onto)

- `npm test`: 1367 tests, 1364 pass, 0 fail, 3 todo ([summary](npm-test-summary.txt)).
- `node build.js`: success. None of the merged modules enter `dist/bundle.js`
  (zero matches for their symbols). The rebuilt bundle differs from the
  committed one only because HEAD's own P34/GX5 merge had not been rebuilt;
  this sweep commits that rebuild.
- Browser, headless Chrome at 1366x768, fresh profile and fresh
  `127.0.0.1` origin served from the merged worktree
  ([script](browser-smoke.cjs)): load, new hero, save, reload with name
  restored, Export, Import into a second fresh profile with name restored.
  Zero page errors in both profiles. The only 404 is the gitignored
  `private_packs/manifest.json`. Screenshots:
  [play](sweep-play-1366.png), [after import](sweep-import-1366.png).
- Changed behavior in the browser: none to exercise. All four lanes are
  standalone modules or tests that the game does not import yet. Gameplay
  integration of the tag store and planner remains OPEN for their owners.

## Risks

- R1: A5's ratchet baseline was recorded at `30a2671e`. Procgen merges since
  then added xorshift copies in `generated_people.js`, `mixture_state.js` and
  `storylet_deck.js`. The ceiling now records the integrated count (10) so
  new copies fail. Moving those three onto `src/seeded_streams.js` and
  lowering the ceiling is a follow-up for the streams owner.
- R2: Not pushed. Push waits for Weibao's yes.
