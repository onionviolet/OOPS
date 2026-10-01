# v0.6 foundation migration

Selected direction, 2026-10-01: Weibao proposed beginning work from the v0.6 development source. [PROJECT.md](../PROJECT.md) owns that choice. The first migration step is a runnable isolated candidate; the shared checkout is not switched yet.

## Candidate and source

- Candidate: `/Users/weiwei/.codex/worktrees/v06-foundation/yet-another-idle-rpg`, branch `codex/v06-foundation`.
- Pinned development base: [`25afe1a879459d85af609088a046ac4f1d3893e1`](https://github.com/miktaew/yet-another-idle-rpg-dev/commit/25afe1a879459d85af609088a046ac4f1d3893e1), fetched directly from Miktaew's development repository. `origin` and `upstream` still point to the personal fork and original official repository respectively.
- Preview: http://127.0.0.1:8146/. From the candidate, run `npm ci`, `npm run build`, then `npm run serve` if the server is not running.
- Shared source: `/Users/weiwei/code/yet-another-idle-rpg`, still v0.5.5.30 plus the expedition/save work. The separately active chat “Extend engine for audit features” continues there. Its code was not overwritten or transplanted while changing.

The candidate carries the pinned esbuild tooling, research and archived cultivation prototype. It corrects the NPC import to match the actual lowercase filename, and its HTML loads the rebuilt fingerprinted bundle. Upstream's HTML had loaded loose modules despite a bundle build; repeated reload initially exposed `get_game_version` being unavailable. Bundle loading repaired that observed failure. MIT licensing and Miktaew attribution remain intact.

This is a prepared development base. The fork's active expedition and strengthened save importer are not integrated into v0.6 yet. For this candidate, compatibility is established only for its generated v0.6 character save; importing personal or custom fork saves has not been validated. No personal saves were read, moved or modified.

## Why update the source together

v0.6 moves character and NPC ownership into models/components, relocates content into `src/data/`, adds shared availability status and rewrites combat. The [upstream comparison](UPSTREAM_DIRECTION.md) records verified capabilities and limits. Beginning here reduces the amount of new companion/combat code we would later have to port, but the existing fork adapters must follow the new APIs and save layout.

| Local file group | Required migration |
|---|---|
| Upstream source, HTML and build | Use the v0.6 models, components, content registries, UI and locales together. Retain pinned dependencies, bundle rebuilding, fingerprints, license and attribution |
| Shared expansion modules and tests | Carry `rules.js`, `expansion_engine.js`, `expansion_persistence.js` and the current completed expedition definitions/UI forward. Adapt main-module access to `character.getFullStats()`, `getTotalSkillLevel()` and new activity/combat state rather than copying the old `main.js` over v0.6 |
| Save guards and compatibility tests | Adapt validation from old `skills`/`dialogues`/`traders` shapes to the supported old and v0.6 `levels`/`inventories`/`availabilities`/`npcs` layouts. Preserve UTF-8/legacy text, isolated real-loader preflight, failed-write protection, writer ownership, reputation/earned-clear handling, extension state and dormant retired content |
| Project evidence and instructions | Update the actual source version, startup, module paths and acceptance status after each port. Keep older playtests as historical evidence; passing old pure-library tests does not validate v0.6 integration |

No destructive replacement of the shared `src/` is needed to start. The isolated candidate already contains v0.6. Once the current expedition work finishes, a recoverable fork checkpoint and its generated fixtures can supply a stable input for the port. The shared checkout should switch only after the candidate preserves those behaviors.

## Acceptance before the shared switch

Port the completed expedition and save protections, then exercise both preparation routes, a pending paid action across reload, resolved outcomes without duplicate costs/rewards, a rejected file with stored bytes unchanged, Unicode export/import and dormant prototype preservation. Use generated old-base, current-fork and v0.6 fixtures. Verify ordinary dialogue/equipment/combat alongside the event from the rebuilt candidate. A later helper/duel can test multiple fighters; it was not added merely to change the foundation.

The next implementation is this integration port, before adding more systems around the old character/combat APIs. The broader creative scope and first one-realm/one-prestige milestone remain unchanged.

## Evidence from this preparation

Chrome on fresh port 8146 created `V06 test hero`, followed the opening elder dialogue, unlocked Infested field, received/equipped a 50% starter sword and fought a wolf rat. The fingerprinted v0.6 bundle was observed in the actual page. Combat dealt and received damage and unlocked skills. Manual Save and repeated reload retained the name, equipment, money, quest state, unlocked field and combat-earned skill state; the final loader reported no issues. No new captured runtime exceptions appeared after switching to the bundle. Current combat enemies are not retained by upstream's loader.

`npm ci` and `npm run build` pass. One existing upstream build warning remains at `src/display.js:4663` for an ineffective nullish fallback in XP tooltip arithmetic. This is not full content/balance coverage, a fork-save migration, a native file roundtrip or proof of the expedition in v0.6. Screenshot evidence is in the candidate's `docs/evidence/v06-combat.jpg`.
