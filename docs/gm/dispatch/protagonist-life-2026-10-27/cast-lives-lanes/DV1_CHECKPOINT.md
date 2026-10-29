# DV1 checkpoint

Authoritative lane receipt: [MF_DIVINATION_CHECKPOINT.md](MF_DIVINATION_CHECKPOINT.md).
Brief: [DV1_BRIEF.md](DV1_BRIEF.md); mandate: [MF1 L4](MF1_AUDIT.md#d2-proposed-ranked-build-order-at-most-eight-lanes).

Implemented, below floor. Synthetic engine/native-save fixtures are agent-verified,
not human-reviewed. Shared host, validator and UI changes remain in
[DV1_INTEGRATION.patch](DV1_INTEGRATION.patch) for the coordinator. No commit.
The receipt contains the pack schema, registration steps, focused checks,
input identity, FLR1-FLR6 and remaining rebuilt-desktop acceptance gate.

## Resume 1: integrated-patch fixture

The original status above records the lane handoff. DV1 and its integration
patch have since landed in `3ece3baf2`. The native fixture now copies the live
source, checks the patch in reverse and applies it only when it is not already
integrated (ON9). It retains the native place UI, real save-validator and
pending/settled Save, reload, Export and literal Import assertions. This is a
fixture repair, not new gameplay or desktop-browser evidence. Rules: ON9,
CLR9, AR7, AR10 and AD36.

| Command | Result | Gaps |
| --- | --- | --- |
| `git apply -R --check docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/DV1_INTEGRATION.patch` | PASS: the live patch is integrated | Context may change as other lanes land |
| `node --test tests/cast_divination_adapter.test.js tests/perspective_controls.test.js` | PASS 6/6; disposable build and architecture check also pass | Headless synthetic fixture; the forward-patch fallback was not exercised in this run; rebuilt desktop and combined pre-commit gates remain with coordinator |
| `git diff --check -- tests/cast_divination_adapter.test.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/DV1_CHECKPOINT.md` | PASS | Whitespace only |

Input: shared HEAD `f556abc011db96d7bb60a5f9c783ffe729af264f` plus the
owned test edit. SHA-256: `tests/cast_divination_adapter.test.js`
`82362fb2e34e426aa9b44bdf0ee0fa67e969c3dc48df2f9c5b8c437740858348`;
`tests/perspective_controls.test.js`
`5089a7c366d4b325e88f1f4ff597b264dee6a1ec088c225d345e0f73b679d639`.
No commit; both owned files are released to the coordinator.
