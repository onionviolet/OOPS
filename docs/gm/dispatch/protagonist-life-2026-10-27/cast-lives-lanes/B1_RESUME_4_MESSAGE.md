# B1 round 4 (coordinator floor review, 2026-10-28)

Round 3 passes the floor's core route at 1920×1080 on bundle `a7147d40`: "Be [lead]" → "Start this new life" reloads
into the be life in 3.6 s; profile be, `runMode: canon`, no entry and no continuation; 15 history memories and 3
known people installed; the panel header reads "[flat] · Day 1, night · canon run"; "Wait until the day of your
interview" offers his intention; reload keeps the LOTM state and knowledge; with the pack absent the save loads
read-only and shows the reason. F1-F3 are closed. The coordinator commits your round 3 paths before this round
(`git log` shows the hash); keep working on top.

Fix these (B1 owns the same files; anything outside goes in `B1_INTEGRATION_2.patch`):

**BF1. Other-world and crossing panels are still offered.** The "Other known panels" list in the be seat includes
the Village scene and panels from other worlds (a potion bench, a rune bench, other worlds' work ledgers and sites),
and the body text contains "Village". The seat filter covers routes in `perspective_controls.js` only; domain panels
registered by other worlds have no perspective row. Give registered panels a perspective (world id or `system`),
and let the be seat show only its own world's panels plus `system` ones (CO4, CL236, CL241). Add a test that the
be seat's known-panel list contains no panel from another world and no crossing panel.

**BF2. He starts with the default hero's body and gear.** Inventory holds the upstream default items (stale bread,
cheap leather pants) and the default combat stats and level. The be life's possessions come from the pack's
`leadLife` (unknown means none, CLR4; the labelled one-penny fill stays labelled); the default hero kit is not
his. Stats: keep the native numbers for now but do not show a level or XP bar he has not earned in-world; record
the real stat mapping as a known limit for F1 (the combat lane).

**BF3. Header placeholders.** "Local date unavailable" and "Local weather unavailable" show in the location header
of the be life. Feed the date from the cast calendar and either feed weather or hide the line when the world has
no weather source (UR70-UR75: no placeholder text).

**BF4. Read-only noise.** With the pack absent, the console logs "Something went wrong on saving the game!" and a
save-ownership error: the autosave still tries to write. A held save should skip writes quietly and keep only the
visible reason.

Then: `node --test tests/lotm_be_seat.test.js tests/seat_profiles.test.js`, `npm run check:arch`, rebuild into
`BUILD_OUT=/tmp/yairpg-b1`. Checkpoint names known limits and expected refactors (AD45, MD1-MD3). Do not commit.
