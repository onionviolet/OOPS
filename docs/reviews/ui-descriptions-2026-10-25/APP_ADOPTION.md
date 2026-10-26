# Normal-app adoption and Electron-logo publication, 2026-10-26

Authority: Weibao requested updating the normal installed app, checking stat and
trait descriptions there, creating a new chat to consider broader rules, and
committing/pushing the Electron app logo. Applies AD32/36/39/41/42, AR3/6–10,
UR43/70–75 and the existing snapshot/mirror owners. This extends the earlier
local-only implementation authorization for app adoption; Git publication is
scoped to the logo and required offline icon-font correction.

## Result

The normal player app runs frozen **`v0.6-f7324af35659`**, with web bundle
**`v0.6-31ec61169638`**. All **86 frozen files** match the exact candidate used
in the native Electron proof. The normal page's fetched bundle SHA-256 matches
that candidate and its native Intuition description contains the new meaning.
The original `app://yairpg` origin and default player profile remain in use.
The app is visible at PLAY; the private player's life was not advanced for tests.
[Machine-readable receipt](APP_ADOPTED.json).

The prior 3,218-test web receipt covered the unchanged description implementation.
An additional full `npm test` after correcting the HTML icon-font link also
passes **3,218 tests, 0 failures**. Build and architecture pass. The existing
rules check remains passing for the documentation owners.

## Native checks and preservation

[Native Electron result](evidence/electron/result.json) exercises the exact frozen
candidate in a separate profile at 1920×1080: stat narrative, expandable attack
calculation, click/Enter inspection, Escape, trait narrative and exact capability
numbers, cosmetic-trait wording, native Save/reload and local font loading.
Traits are explicitly DEV SEEDED generated fixtures, not naturally acquired
player progress. The test uses the same host and frozen bytes as the normal app;
no fixture was imported into the player's profile. Native screenshots:
[stat details](evidence/electron/native-attack-details-1920.png) and
[trait details](evidence/electron/native-trait-details-1920.png).

The running normal app was confirmed idle at PLAY before shutdown. Its storage
was flushed and the idle window destroyed without invoking the close hook's
manual-save path. The closed profile was copied privately and all **333 files**
were hash-verified. Recovery location:
`/Users/weiwei/.codex/reconciliation-backups/2026-10-26-ui-descriptions/normal-profile-before/`.
No save contents or profile metadata are included in this public receipt.

A first verification compared a single live all-storage fingerprint and failed.
The follow-up loaded a private copy of the closed backup at the same origin
using a blank script-free page, then compared individual stored values. All
persisted keys matched the adopted profile. The main save's opaque byte hash
also matched after reload and after the new bundle fully initialized. This is
the authoritative save-preservation check; the early aggregate assertion is
not reported as passing. Private comparison details remain beside the backup.

The desktop suite passed smoke, crash guard, frozen adoption, save mirror and
presence. Its offline check exposed the existing Google icon-font link despite
the bundled local font. Replacing that HTML link with the local stylesheet made
the focused offline rerun pass with no external requests. No gameplay code or
save format changed for that correction. [Desktop receipts](evidence/electron/desktop-gates.txt).
The existing OOPS PNG decodes natively at 1024×1024, and the restarted host
executes its window/Dock icon wiring. No separate visual Dock screenshot claim.

## Scoped publication and separate chat

Published [d2ef02bdc](https://github.com/onionviolet/OOPS/commit/d2ef02bdcc00b047919cf49ccba635bb16bea5b5)
contains exactly four paths: desktop/main.cjs, desktop/README.md,
resources/img/oops-icon.png, and the local-font link hunk in index.html. The
uncommitted description bundle pointers and source changes were excluded.
Remote master was verified at that commit. Seven unrelated local commits were
not published; guarded merge `a204bfa13` integrated the published logo into the
fresh local HEAD while preserving them and all dirty work. The real index was
updated only for those four paths; there are no staged leftovers from this task.
The app can therefore contain the verified local description implementation
while Git publication remains the requested logo/icon scope.

Created chat **Expand UI description and inspection rules**
(`01a1766c-7081-7ee2-9aec-2e0921791dc6`) and waited for completion. Its
[consideration report](../UI_DESCRIPTION_RULES_EXPANSION_2026-10-26.md) proposes
five further refinements, with evidence, effort and done checks. It changed no
runtime or shared rulebook. Those refinements remain proposals.

Normal-app adoption and the selected logo publication are complete.
Human taste remains optional feedback; the new rules report selects no further
runtime work.
