# G10 harness

Run from this worktree root. Requirements: the supplied Playwright path, Chrome channel,
Node and the existing esbuild dependency. This is QA instrumentation, not an authoring adapter.
All profiles and older candidate copies stay under `/private/tmp/r15-g10-*`.

1. `npm run build`; `node docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g10/build-probe.mjs`.
2. Start `node docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g10/harness.mjs /private/tmp/r15-g10-profile-<fresh-name>`.
3. Use `node .../g10/run-step.mjs <step> [<step> ...]` in another terminal. The driver posts
   async JavaScript to the loopback control endpoint 19201. Main serving port is 19200.
   Initialize `helpers actions persistence failures keyboard-helper rejection-helper` in that order.
4. Extract G2's `fixture/FIXTURES.tar.xz` into `/private/tmp/r15-g10-g2-fixtures`.
   The G1/G2/G3/G5/G6 fixtures/harnesses are reused; G3 gzip inputs are expanded only under `/private/tmp`.
   `fixture/generate-heir.mjs` is the G5 native generator with no teaching and a real career debt.
5. Browser steps: `g1 balm-acquisition g2 g3 g5 production-failures g6-faults g6-support merchant
   keyboard edited-production stored-receivers admission retort-support field-support g6-edited
   material-fault stale reattachment reserve-budget fieldcraft-persistence`.
   Then ordinary `npm run build` and `standard-smoke` with the test bridge absent.

Some recovered steps resume their saved case journal, to avoid replaying cases after a harness correction.
For a complete independent replay, use an isolated copy without its previous case journals.
`assay-failures` and `merchant-sale` are resumed substeps; the full production/merchant steps now include them.
The retained `run-*.json` files include failed harness attempts and their corrected terminal result.
The two standalone `probe-*.mjs` scripts reproduce the living-body and partial-deadline defects before repair;
after repair their outputs change to refund/rejection respectively. They use separate fresh profiles.

`older` needs actual git commit `97c28efe` rebuilt under `/private/tmp/r15-g10-older`, with this worktree's
node_modules linked into that scratch copy. Temporarily link `g10/older` to the candidate to serve it through
19200; remove that link before staging. The committed source has no older candidate or profile.
Its engine rejects current complete reserve/retort envelopes before reading their itinerary grammar.

All native export files were downloaded and imported literally during QA. The committed
`evidence/NATIVE-EXPORTS.tar.xz` preserves them losslessly; extract it into `evidence/` to replay
steps that refer to those files. `NATIVE-EXPORTS-MANIFEST.json` records every original byte hash.
`pack-evidence.py` verifies the archive before compacting exports. The G10 heir fixture stays directly
available. Source logs are gzip-compressed. Full browser binding trace is compressed with a compact summary.
No file is over 2 MB; no `dist/`, HTML, profiles, personal saves or raw novel text belongs in the commit.
