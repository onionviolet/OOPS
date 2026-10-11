# Eldyn-derived interface packets

Status: original YAIR proposals only. No Eldyn gameplay is claimed, no packet is accepted or implemented. This bounded source pass provides five proposals and twenty-two touches, not a territory/army design. Ranked order follows vanilla fit and reversibility. Parent owns any north-star synthesis.

## P1 Make close and return destinations unambiguous

Inspiration: F2 in FINDINGS.json. Vanilla surface: `src/display.js:2061; src/display.js:2230` (Existing vanilla center choices and travel).

Label center submenu close separately from actual location travel; keep character position intact when closing.

Acceptance: Open trade/work/travel submenu, close each, verify position and task unchanged; reload remains same location.

Compatibility: No forced start, new window, faction system or network requirement. Preserve current saves; any new persisted status requires defaults/migration.

| Touch | Original proposal |
|---|---|
| T01 | Use Close menu for dismissal only. |
| T02 | Use destination names in travel actions. |
| T03 | Preserve currently selected work when a submenu closes. |
| T04 | Keep recovery and return-home choices separate. |

## P2 Make busy or unavailable destinations readable

Inspiration: F1 in FINDINGS.json. Vanilla surface: `src/display.js:2261; src/data/locations.js:297` (Native action and travel controls).

Show one plain reason when a destination is unavailable and show progress only during a real pending operation. YAIR remains local and receives no network dependency.

Acceptance: Visit unlocked and locked routes, attempt a failing action, confirm clear reason and no duplicated rewards.

Compatibility: No forced start, new window, faction system or network requirement. Preserve current saves; any new persisted status requires defaults/migration.

| Touch | Original proposal |
|---|---|
| T05 | Show locked route reason beside that route. |
| T06 | Show pending state only while an operation is pending. |
| T07 | Keep a failure message visible until the player acknowledges or retries. |
| T08 | Disable duplicate activation during real asynchronous travel/import work, if any. |

## P3 Make optional branch invitations explicit

Inspiration: F3 in FINDINGS.json. Vanilla surface: `src/display.js:2061; src/display.js:2261` (Native center menu destinations).

For any future invitation entry, resolve an internal destination ID and preview place before entering. Do not add factions from this wrapper evidence.

Acceptance: Valid, unknown and wrong-world IDs produce clear previews or errors without travel; vanilla movement still works.

Compatibility: No forced start, new window, faction system or network requirement. Preserve current saves; any new persisted status requires defaults/migration.

| Touch | Original proposal |
|---|---|
| T09 | Display invite destination before entering. |
| T10 | Trim pasted invitation whitespace. |
| T11 | Reject unknown internal destination IDs with a plain message. |
| T12 | Return from an invalid invitation without leaving the current place. |

## P4 Make save and resume status visible

Inspiration: F4 in FINDINGS.json. Vanilla surface: `src/main.js:4576; src/main.js:4602; src/main.js:6371` (Existing local save/export/import controls).

Show actual last successful local save and import result in existing controls, preserving local-first saves. No Steam identity or login added.

Acceptance: Save, reload and import private fresh-test data; success appears only after real completion and failures preserve active character.

Compatibility: No forced start, new window, faction system or network requirement. Preserve current saves; any new persisted status requires defaults/migration.

| Touch | Original proposal |
|---|---|
| T13 | Show timestamp only for the last completed save. |
| T14 | Differentiate local save and exported file labels. |
| T15 | Report import failure without replacing the active life. |
| T16 | Display the active character/location after a successful reload. |

## P5 Make center controls usable on narrow screens and keyboards

Inspiration: F5 in FINDINGS.json. Vanilla surface: `src/display.js:2230; src/display.js:767` (Inherited center menu and log).

Retain native panels while improving labels, focus and responsive choice layout; prioritize functional local text over decorative font dependency.

Acceptance: Keyboard-open and close menus, return focus, resize narrow, verify routes and log readable; runtime continuing while menu open is explicit.

Compatibility: No forced start, new window, faction system or network requirement. Preserve current saves; any new persisted status requires defaults/migration.

| Touch | Original proposal |
|---|---|
| T17 | Give icon-only buttons accessible text labels. |
| T18 | Return keyboard focus to the opener when closing a menu. |
| T19 | Keep travel choices within a narrow center panel. |
| T20 | Provide readable local font fallback when optional decoration fails. |
| T21 | State whether time continues while the menu is open. |
| T22 | Keep click targets readable when text scales to 200%. |

## Boundaries

No army orders, territory control, faction diplomacy, harsh-world powers, NPC lives, prestige or progression packets are justified by this installed wrapper. Source-backed game-mechanic absorption needs separately recovered remote client/server source or an explicitly authorized behavior study. A future implementation must rebuild and exercise the changed native behavior from a fresh test origin; persistence work also requires save/reload/import. This audit exercises none of those gates.
