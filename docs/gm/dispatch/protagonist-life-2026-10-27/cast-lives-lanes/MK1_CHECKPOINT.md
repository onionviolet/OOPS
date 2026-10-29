# MK1 checkpoint

The canonical lane receipt is [MF_MAKING_CHECKPOINT.md](MF_MAKING_CHECKPOINT.md).
Scope: [MK1 brief](MK1_BRIEF.md), MF1 L3. Implemented, below floor; public generic
adapter and tests, prepared integration patch, no live private-row adoption,
commit or desktop browser claim. The receipt owns checks, schema, limits and
coordinator steps.

## Resume 1: rebase on DV1

Rebased `MK1_INTEGRATION.patch` on frozen HEAD `f556abc011db96d7bb60a5f9c783ffe729af264f`, including DV1 `3ece3baf2`, while preserving DV1 registration, projection and validator paths. Patch SHA-256: `a320be8ee1e2c5245f5250c3c46c25a9bd4ea5fdf768845fff9756a9a6a50dcc`. Source and test inputs retain the hashes in [the original receipt](MF_MAKING_CHECKPOINT.md). Shared host files were not edited. Rules: AR1-AR16, AD36, AD43, CLR9 and CLR13.

| Check | Result and gap |
| --- | --- |
| `git apply --check` and `git apply` against four files extracted from frozen HEAD in `/private/tmp/yairpg-mk1-resume-b4_aso55` | PASS; patch applied in disposable copy before replacing the owned patch. |
| `git apply --check docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MK1_INTEGRATION.patch` in shared checkout | PASS on current HEAD `fff43dce9`; no shared source edits. |
| `node --test tests/cast_making_adapter.test.js` in frozen HEAD test copy | PASS 4/4, including native Save/reload/Export/Import and validator tamper checks; patched build SHA-256 `deb31d2e3e1340056aafd6d73483c0fb393dd705c73c7f7f817713005f6dee2d`. Initial copy omitted a tracked runtime contract; after restoring it from the same HEAD, the rerun passed. |
| `node --test tests/cast_making_adapter.test.js tests/cast_divination_adapter.test.js tests/perspective_controls.test.js` in frozen HEAD test copy | PASS 10/10; copied DV1 test omitted its obsolete patch application because DV1 was already integrated. Making and divination each used their own native fixture; no joint-pack journey claimed. |
| Same three-file command in shared checkout | PASS 10/10, 31.3 s; DV1 fixture had meanwhile been fixed by its owner in commit `fff43dce9`. Includes its architecture check: main -46, display -37, save writer 0; 205 grandfathered cyclic edges. |

Status remains implemented, below floor. Coordinator owns applying the prepared patch, private-row adoption, combined candidate gates and rebuilt desktop journey. No commit or push by this lane.

## Resume 2: live integration fixtures and perspective

The coordinator applied the rebased MK1 patch to the shared host. The making
fixture now uses the live integration when the patch is reverse-clean and
otherwise applies it in its disposable copy. DV1's patch has overlapping context,
so its fixture checks a separate probe with MK1 reversed; the actual runtime
fixture retains both live integrations. Added the `data-lotm-making` in-world
perspective tag (CL243). Rules: AR7/AR10, AD36/AD43, CLR9/CLR13.

| Check | Result and gap |
| --- | --- |
| `node --test tests/cast_making_adapter.test.js tests/cast_divination_adapter.test.js tests/perspective_controls.test.js tests/place_acts.test.js tests/cast_topic_talk.test.js tests/cast_journeys.test.js` | PASS 29/29, 44.2 s, including native Save/reload/Export/Import fixtures; headless fixtures, not rebuilt desktop browser proof. The first run was 28/29 because the new DV1 probe omitted `perspective_controls.js`; after adding that file to the probe, the rerun passed. |
| `node --test --test-name-pattern='live or prepared joins preserve' tests/cast_making_adapter.test.js` in the frozen pre-MK1-integration copy from Resume 1 | PASS 1/1, including Save/reload/Export/Import; confirms the prepared-patch path still works. |
| Disposable five-file probe: reverse MK1, then `git apply -R --check DV1_INTEGRATION.patch` | PASS; real fixture copy retains both integrations. |
| `node --test tests/perspective_controls.test.js` | PASS 1/1; source inventory, not desktop visual proof. |
| `git diff --check -- tests/cast_divination_adapter.test.js src/perspective_controls.js` | PASS; tracked paths only. |

The six-file run includes the DV1 fixture's `npm run check:arch`: main -46,
display -37, save writer 0; 205 grandfathered cycle edges. The disposable live
making build hash was `27c04bb4307f3afbf5a5507949c189b5ed02593e155cf473225bdcf472777fec`;
the divination fixture's instrumented build was
`6240ca54b26835a57d538e3a3d1b792243f68d6943521b74f19c5b2d9962ba14`.
Input HEAD `b76b0f00fdf9d36f179f7ffb5a79387ea67e8c81` plus the applied MK1
host patch and these lane edits; subsequent HEAD `d7c254238fcef6af91f29b2655ac1cc9f91f01f8`
changed docs only. Source/test SHA-256: making test
`195c5225f67b7363233e58f8d8240c842733f48dcfd8d5514e3f05acbdc507b3`, divination test
`2de89c5a1e0a0c67906c3e85e8a9999bedc09abd6171e99a3a47cbf665d58cf9`, perspective
registry `acafc0472068f9b695eef4537f5ed92a8b24a6ad79cdafd2d043c2b50053e5fc`.

Status: integrated source and agent-verified synthetic/headless fixtures,
below floor; rebuilt desktop journey and combined candidate gates remain with
the coordinator. No commit or push by this lane. The modified DV1 test is
released to the coordinator alongside the making test, perspective tag and this
checkpoint.
