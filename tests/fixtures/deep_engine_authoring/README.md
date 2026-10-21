# Executable workshop authoring fixture

Run `node scripts/check_content_authoring.mjs` for the original workshop or
`node scripts/check_content_authoring.mjs /absolute/path/pack.json` for a
schema-2 structured definition or world-pack envelope. `--validate-only` skips
the executable probe. Errors, including a dormant command in this synthetic
scenario, exit nonzero and identify source, definition ID and row/effect path.
The path reuses the existing compiler, effect validator, loader diagnostics,
quote, command, clock and P3 facade. It adds no runtime handler registration.

The executable probe supplies a fresh human beginning, 100 coins, 10/20 stamina
and an empty inventory. A dormant result may mean these fixture means do not
meet a valid command's requirements. It is not proof that the content is
impossible in another context. The selected family is native structured
commands; arbitrary worlds/targets/acquisition paths need their own scenarios.

| Coverage | Evidence |
|---|---|
| Catalogued/dormant | World-pack loader diagnostics and dormant record IDs are preserved. A world-pack catalog alone does not establish an executable command. |
| Supported | Existing structured compiler and effect validators accept the definition. |
| Executable | Existing command preview/commit and optional job completion produce explicit deltas with synthetic native adapters. |
| Native-connected | Separate rebuilt real-game proof, never inferred from compiler/probe success. Both commands use the existing Beginning panel and optional content admission. |

`workshop(1,3)` declares two local mechanisms: paid work costs one coin and
earns three after two played minutes; measured rest costs two coins and restores
four stamina under the actual vital cap. Coins and stamina retain their native
units and readers. These sample values are developer fixtures, not balance.

Revision policy follows existing owners: a paid job freezes costs/effects and
revision when committed; an observed beginning pins exact revision/content hash
and starting snapshot. `workshop(2,7)` changes future paid work to seven coins.
An existing campaign requires its exact beginning content restored; missing or
changed content suspends it while retaining its save. There is no automatic
rebase or promise to load an old campaign directly under revision two.

Tests: `node --test tests/content_authoring.test.js`. The native verifier is
`docs/gm/dispatch/deep-engine-2026-10-20/P5_EVIDENCE/verify-native.mjs`; run it
from an isolated copied candidate after `npm run build`, passing an absolute
evidence directory. It serves synthetic optional JSON only to a fresh browser
origin, exercises visible Beginning controls and native Save/reload/Export/
literal Import, missing/changed content preservation and both revisions.
No personal save or book pack is needed. It adds no production main wiring.
