# Tempo fight write-back

Tempo fights now settle the wolf hunt’s actual essence spend against the live reserve. Player health and stamina already publish after every move, so each commit applies only the changes since the prior published turn. Automatic replies use that same starting point. Persistent opponents and allies apply their changes at settlement. The optional start fields keep schema 7 and older fights without them load with their original write-back behavior. [Lane brief](../../../gm/dispatch/play-surface-2026-11-14/SOL_FIGHT_WRITEBACK_BRIEF_2026-11-20.md)

No normal player route was found that changes those resources during an open or held tempo fight. The encounter’s occupancy check blocks chores, sleep, and native item use. The Hero’s daily power control hides, and the job uses the same occupancy check. The joined clock holds elapsed ticks before ordinary rest, regeneration, or essence recovery runs. [Occupation checks](../../../../src/simulation.js) · [Daily power control](../../../../src/ri_daily_powers.js) · [Joined clock](../../../../src/clock_owner.js) · [Native rest and item use](../../../../src/main.js)

## Rebuilt game receipt

Offscreen WebKit ran the rebuilt game on a fresh origin at 1920 × 1080. The earned Fang Yuan checkpoint supplied setup. The game’s existing controls handled the encounter, banked time, and persistence. Bundle SHA-256 `5c93bdf5dfd8f8b6d17d6795e36c5da134989cb8a65e4dcd79e53ba915042d51`.

| Step | Observed |
| --- | --- |
| [Opened](before.png) | The wolf fight opened with 22 essence, 42/60 health, and 42/42 displayed stamina. The patrol wound was already reflected in the live health. |
| [Held and saved](held.png) | One Moonblade cast left 18 in the fight and 22 in the world reserve. Spend banked time in Reports stopped after zero minutes. The bank, world clock, reserve, health, and stamina stayed put. The fight recorded 60 held minutes. |
| [Reloaded](reloaded.png) and [imported](imported.png) | The saved fight restored the same actions, resources, starting values, and 60 held minutes. Import restored the held state after three more ticks changed it. The import used the file produced by the actual Export button. |
| [Settled](after.png) | Three paid casts took 12 essence in total, leaving 10 in the world reserve. The health record matched the native save at 20.6 health missing. The 60 held minutes passed to the post-fight clock queue. |

The [side-by-side](side-by-side.png) shows the same 1920 × 1080 game before and after settlement. The visible differences come from playing the fight. The reserve falls, the wolf’s row changes to Dead, and the result and spoils appear.

## Checks and gaps

| Command or check | Result |
| --- | --- |
| `npm run test:changed -- --files tests/tempo_fight.test.js,tests/tempo_kit.test.js` | Exit 0, 35 passed. The tests supply an outside spend or recovery while the fight is open, compare ordinary settlement with the legacy behavior, and validate saved fields. |
| `npm run test:changed -- --files src/tempo_lead_fights.js,src/tempo_fight_contract.js,src/tempo_fight.js,tests/tempo_fight.test.js,tests/tempo_kit.test.js` | Exit 1 on the shared tree, 5,052 passed, 13 failed, 7 skipped. The 13 failures also reproduced with the lane source edits removed. They involve sandboxed localhost or existing combat, Tingen, and UI checks. Both test selections used a writable `YAIRPG_SLOT_DIR` after the default path returned `EPERM`. |
| `npm run build` in the isolated source copy and offscreen WebKit replay | Exit 0 for both. The browser exercised normal settlement and the held save round trip. The outside changes are covered by regression guards because the player route stays blocked. |
| `npm run check:arch` | Exit 0. |
| `npm run check:rules` | Exit 1 on the existing Hearth string in `src/absorb_p23/host_joins/tranche_one_ui.js`. |
| `npm run check:docs` | Exit 1 on other shared documents. This receipt drew no diagnostics, and its 11 local links resolve. |

Agent-verified in the rebuilt browser. The coordinator owns the shared-tree gate and commit. Local logs and the WebKit runner are in `/private/tmp/yair-fight-writeback.YNT9pl/`.
