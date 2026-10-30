# Normal-app adoption: Luminous default, 2026-10-29

Weibao: "Yes, adopt it" (to swapping his Electron app to a snapshot of pushed master `5dcd2240c`).

## Result

The normal app's profile (`~/Library/Application Support/oops-progression-simulator`) now points `current.json` and `latest.json` at **`v0.6-e7f0aa4029ca`** (92 files): master `5dcd2240c` page files, bundle `14a49eafe35e`, plus the local private fonts and private packs, including the `supplements` cast files. The previous pointer was `v0.6-439dd061a3cb` (adopted 2026-10-27; PROJECT.md still named `948bd45d09cd`). The app was closed throughout; it was not launched in the player's profile.

## Fix found on the way

`desktop/snapshot.cjs` copied manifest `packs` folders but not `supplements` files, so a frozen build returned 404 for `private_packs/lotm-cast/cast.json` and the LOTM cast data never reached the app (the 2026-10-27 build had the same gap). The snapshot now copies listed supplement files; `tests/desktop_snapshot.test.js` covers it.

## Checks

- `npm run check:desktop` on a clean checkout of `5dcd2240c`: smoke, crash guard, save mirror, presence, offline PASS; frozen build PASS after the supplements fix.
- Hidden frozen launch on a copy of the player's profile, 1920×1080: serves `v0.6-e7f0aa4029ca`; the save loads, the untouched Neutral profile upgrades to Luminous with glow and the pastel HP fill; Save and reload keep it; zero page errors, zero missing files. Save contents were not read or reported.
- The candidate in the player's profile is byte-identical to the tested one.

## Backup and recovery

Closed profile copied to `~/.codex/reconciliation-backups/2026-10-29-luminous-adopt/normal-profile-before/`, 362 files SHA-256 verified (manifest beside it). After the swap, every non-`builds/` file matches the backup byte for byte; `builds/` changed only in its two pointers, the new snapshot and the pruned oldest snapshot `v0.6-f7324af35659` (kept in the backup). To roll back, point both pointers at `v0.6-439dd061a3cb`, which is still present.

Agent-verified, not human-reviewed.
