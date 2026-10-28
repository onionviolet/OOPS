# L4e checkpoint, 2026-10-28

Status: **implemented, below floor**. Agent-verified browser and new focused cases, not human-reviewed. The full focused file fails one obsolete lowercase expectation; the lane brief reserves existing test cases to the coordinator. No commit, staging, stash, reset, force, push, or user-save access.

Authority: [L4e brief](L4E_POLISH_BRIEF.md), coordinator clarification 2026-10-28 (P3 workspace title seam approved; continue other fixes), [cast card](../CAST_LIVES_CARD.md), AD6–AD8, AD34, AD36, AD43, UR42, UR44, UR70–UR75, RPT1–RPT12, CLR3/CLR9–CLR11. Target: existing place-service and people views at 1920×1080 desktop; mobile deferred. Seam: existing cast report projection and workspace panel title; no new location, clock, save schema or registration, and no new cycle edges.

## F1. Changes

| File | Change |
| --- | --- |
| `src/book_world_lotm_cast_host.js` | Capitalize the first rendered letter for both newly published and restored cast reports, preserving the event-time name mask. |
| `src/book_world_lotm_ui.js` | Resident places and walks grouped by district; current district opens by default, other districts collapse, and each district's Places list has its own disclosure. Original profiles retain their existing lists. The resident panel title follows the current place. |
| `src/workspace_layout.js` | Approved title-update seam, including expanded panels and accessible shell label. |
| `tests/lotm_cast_week.test.js` | New cases for masked capitalization, original-profile titles, and a meeting followed by a witnessed beat in the known-person view. Existing cases untouched. |
| Private evidence folder | `l4e-districts.png` and `l4e-person-history.png`, screenshots kept private under CLR3. |

The center view's back navigation retains the title captured when that view was first opened. After a resident changes place, the panel header itself shows the current place; the back label can still show the previous title. Its owner is `src/center_modes.js`, outside this lane. This is a remaining navigation-label gap, not a claim that every title surface updates.

## F2. Checks, command / result / gaps

| Command / route | Result | Gaps |
| --- | --- | --- |
| `node --test tests/lotm_cast_week.test.js` | FAIL 14/15; existing case expects lowercase where P1 now produces uppercase. `/tmp/l4e-focused.log`. | Existing case also has a later equivalent old expectation. Prepared `/tmp/l4e-test-expectations.patch` updates both; not applied because this lane owns new cases only. |
| `node --test /tmp/l4e-test-candidate/tests/lotm_cast_week.test.js` | PASS 15/15 with those two expectation changes in a temporary copy; `/tmp/l4e-candidate-focused.log`. | Candidate is not the checked-in test file. Initial candidate run lacked the temp `node_modules` link; adding the link resolved it. |
| `node --test --test-name-pattern='cast report projection|only the beside profile|a meeting followed' tests/lotm_cast_week.test.js` | PASS 3/3. | New focused cases, not the complete file. |
| `BUILD_OUT=/tmp/yairpg-l4e npm run build` | PASS; bundle SHA-256 `20c9f6f6fb4ff75a72fefe38f03c63d4027842bb73d148dea05090153a8f8d7c`. | Isolated build, shared-checkout source, not a frozen combined candidate. |
| `node /tmp/l4e-browser.cjs` | PASS fresh origin, 1920×1080, zero page errors; fresh life, walk, greeting, stepped time to a witnessed beat, person-history row. Three district groups and current-place header checked. Screenshots private. | First run used a bad expanded-header locator; second exposed a stale expanded title and prompted the workspace fix. Final run uses the bundle above. Natural entry and actions, dev-stepped time. |
| `npm run check:arch` | PASS, main -30, display -37, save 0; six grandfathered imports, 205 grandfathered cyclic edges, no growth. | Shared-checkout inputs. |
| `git diff --check -- src/book_world_lotm_ui.js src/book_world_lotm_cast_host.js src/workspace_layout.js tests/lotm_cast_week.test.js` | PASS. | Source and test whitespace only. |

## F3. Floor and handoff

FLR1: isolated build and hash above. FLR2: fresh-life browser route with dev-stepped time. FLR3: person history, grouped walks, title, available greeting and away feedback shown on screen; the full focused check remains failing and the back navigation label can be stale. FLR4: existing talk, walking and people-view consumers exercised. FLR5: no persistence changes; prior L4b/L4d persistence evidence is not reasserted for this bundle. FLR6: implemented, below floor, agent-verified at the stated scope, not human-reviewed.

Coordinator: review and apply the two-line existing-test expectation patch, rerun the focused file on the final shared candidate, and resolve or record the center back-label gap. Full suite and final integration gates remain with the coordinator.
