# Lives and inheritance wiring (2026-10-23)

Rules applied: AR1-AR16 (seam: domain registry, no main.js growth), UR panel/disabled-reason rules.
Target: desktop 1536 and 1920 widths; mobile deferred. Modules wired: IM8 `heir_inheritance.js`, IM12
`material_lineage.js`, IM21 `carry_ledger.js`, OG18 `discovery_codex.js`, IM11 remembers-gated choice.

## What landed
- `src/lives_carry_domain.js` (new): domains `discovery_codex` and `inheritance_law` (namespaced slices, absent in
  older saves, law slice not written at the default) plus `carry_ledger` projection and the "Lives & inheritance"
  records panel (codex counts, law dial with reason, per-world ledger). Imported from `ui_extras.js` (one line).
- Heir path: `life_experience_host.js` carries the law slice; `heir_inheritance.js` gives processed goods a dated
  "passed to the heir" line and previews it; `main.js` passes the chosen law to the two `deriveHeirLeftovers` calls
  (same lines, net zero).
- `items.js` item detail appends heirloom lines and value in parts (age, lines); `material_lineage.js` adds
  `passHeirloomKey` and `heirloomText`.
- `chronicle_ui.js`: "remember" button (IM11) with a disabled reason; death dialog shows the carry ledger and codex count.

## Checks (one line each)
- `node --test` lives_carry_codex, heir_inheritance, material_lineage, life_experience_b, architecture: 27 pass.
- `npm run check:arch`: zero growth, no new cycles. `npm run check:rules`: PASS (2 untracked-file warnings from other lanes).
- `scripts/lives_carry_browser.cjs` at 1536 and 1920, fresh contexts, rebuilt bundle: 11/11 each (fresh save slice, panel, law
  dial persists, old-shape save loads, death ledger and law reason, heir keeps slices and heirloom line, remembers option
  appears and resolves once, item detail text, reload, export then import, no page errors). Logs and screenshots in `evidence/lives-carry/`.

## Gaps (implemented-unverified or open)
- Non-default laws need recorded kin; the game has no kin source, so they fall back to the usual successor (stated in the panel).
- Codex observes carried items and chronicle at save; chest-only goods count once carried.
- No in-game action records a "deed" line yet; only the heir "passed" line is produced.
- Paradise hub ledger shows in the panel but no Paradise death/crossing journey was exercised.
- Heirloom value in the test shows ~999 years because the fixture good was born at minute 0.
- Mobile layout, and the remember option at 1920 in the disabled state, not exercised.
