Read docs/gm/dispatch/engine-runtime-2026-10-14/COMMON.md and follow it.

Lane ER2: codebase structure and bundle audit. Output
docs/research/CODEBASE_STRUCTURE_AND_BUNDLE_AUDIT_2026-10-14.md and
docs/gm/dispatch/engine-runtime-2026-10-14/ER2/REPORT.md.

- Run esbuild with metafile to a temp outfile (never dist/) and report
  bundle composition: top modules and folders by bytes, ink/content data
  share, duplicates (CH3, PF4).
- Build the import graph: cycles, unreachable src files, fan-in/fan-out
  hubs, and the audit_remainder_* / absorb_* / *_host / *_facts families:
  are they a repeated pattern that a shared helper or manifest could own
  (RT10, CH2)?
- Propose a main.js split plan (CH1): sections by owner with line ranges,
  extraction order, risk per step, and what tests guard each.
- Code-splitting candidates by world or feature with estimated byte savings.
- Note whether dist/nethack-fieldcraft-preview.js is referenced anywhere.
- npm test wall time (MEASURED) and slowest test files (CH4).
