# M1 structural extraction

Passed 2026-10-16. Pre-round commit: `a362fe2fa9599ca11495607e89dd95b22e5a4f51`.

Shared native state now has one authority in `runtime_state.js`, with live imports
and setters preserving the original mutation sites. Time eligibility and translation
moved to separate modules. Translation receives only bio/name readers. Display's
six native-owner queries use explicit injected read operations in `native_view.js`;
their nonmechanical implementations remain with their native owners. Display no
longer imports main. Mechanical importers now read leaves directly. The remaining
eight imports of main and 298 cyclic graph edges are grandfathered, not resolved.
This does not claim the complete display dependency graph is acyclic.

`check:arch` uses esbuild's parser to build the relative-import graph of all src
JavaScript, including literal dynamic imports. It rejects new cyclic edges, new
main imports, baseline expansions against HEAD, and resolved exemptions left on
the baseline. `--shrink` removes resolved exemptions. Line baselines remain fixed.
Unresolved legacy mod imports are terminal edges; the build still validates the
actual entry graph. No new package or node_modules mutation.

## Gates

- `npm run build`: pass, current source rebuilt.
- `npm test`: 1796 tests, 1793 pass, 3 existing TODO, zero failures.
- `npm run check:arch`: pass, 8 main imports and 298 cyclic edges.
- `node scripts/modular_seams_browser.cjs`: pass on original and changed rebuilt
  bundles, fresh contexts, 1366×768. New game, elder greeting, return via center
  back, three real engine ticks, Save, reload, Export download, literal-file Import.
  Zero page or console errors. The absent optional private manifest is supplied as
  the same empty schema-1 fixture in both runs. No personal saves or packs used.
- `node scripts/compare_modular_saves.cjs /tmp/modular-before.json /tmp/modular-m1-after.json`:
  all four complete envelopes equal, ignoring only `saved_at`. Native RNG initial
  seed and Math.random fixed in the harness, clock advanced by existing test hooks.
- Baseline reconstruction: `node scripts/modular_baseline_build.mjs <pre-round commit>`;
  then run the same scenario and rebuild current source before the changed run.
- Focused graph/fixture checks: `node --test tests/architecture.test.js tests/alloy_equipment.test.js`, 7 pass.

First full test attempt found a source-injection fixture assigning the former local
location binding. Its injected code now calls the setter. The next full gate passed.
Harness setup also corrected an obsolete hidden dialogue exit selector and absent
optional-manifest console noise before the comparison gate.

## Change surface and limits

Core counts: main 10260 → 10121 (139 fewer); display 6664 → 6655 (9 fewer);
save_files 256 → 256. The 139 net reduction includes 175 removed and 36 added
main lines. No gameplay behavior changed. Remaining cycles are existing debt;
the explicit reader binding is a boundary for nonmechanical queries, not a claim
that those native implementations have been extracted.

Merge reconciliation: main imports, native-state declarations and assignments,
translation initialization and exports overlap shared-checkout continuation work.
Display's import block also needs reconciliation. save_files is untouched in M1.
No shared uncommitted continuation source was read or copied into this branch.

Rule feedback: AR5 must be read with its explicit shrinking-baseline exception.
The entire src graph already has many cycles, so rejecting every existing cycle
would prevent the first structural round. No standing rule was changed.
The referenced modularity assessment is absent from this branch; AR1–AR16 and
PROJECT's accepted summary supplied the contract.
