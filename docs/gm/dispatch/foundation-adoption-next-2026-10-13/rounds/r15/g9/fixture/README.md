# Generated World1 fixtures

`helpers.js` creates `TEST FIXTURE R15 G9 <case>` through the real browser hero
creator. It selects ST03, ST04 or ST05 by supplying the opening RNG seed,
then calls the real beginning control. For this fixture only, it removes the
public Reedbank definition from the live optional-definition map before that
control, so the existing private p08 definition can be selected. The shared
source still prefers Reedbank. Reload registers all definitions normally.
No body, stock, job, wage or completed count is inserted into a save.

The real Save/Export controls generate the fixtures used by subsequent tests.
Each is imported using an actual file input. Encoded files contain the private
pack's definitions and therefore stay in `/private/tmp/r15-g9-artifacts/`.
Their hashes, persistence comparisons and compact numeric results are retained
in `../EVIDENCE.json`. The files are disposable QA fixtures, not human saves.

For negative provider cases, `provider-fixture.js` applies the real simulation
effect API to remove the provider's source or disable their body's channel
**after** the real charge command reserved its input. It never creates a pending
job or edits a reserve. The real native completion boundary then decides whether
to refund. This is seeded-native fault coverage, not a naturally occurring loss.

The ignored pack is required locally. It was read through a worktree symlink to
the main checkout, without writing there. `INPUTS.json` binds its bytes and the
retained private recipe. No source-library prose is included here.
