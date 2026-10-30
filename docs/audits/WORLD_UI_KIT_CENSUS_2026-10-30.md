# Basic world UI kit census (2026-10-30)

PLAN M5 and [DESIGN.md](../../DESIGN.md) DSG19: before any diegetic per-world UI (O3), every playable
world answers six questions on screen. Weibao: "we need the most basic Ui working for each world"
([direction](../USER_VISION.md#ui-identity-per-world-basics-and-combat-surfaces-2026-10-30)). Lane
`ui-identity`, [plan](../gm/dispatch/ui-identity-combat-2026-10-30/PLAN.md). Proposals, not accepted decisions.

Cell values: **working** (the world shows it in its own terms), **generic** (shown, but in the frontier's
words or panels), **missing** (nothing on screen answers it), **unchecked** (not observed this pass).
Evidence: headless runs at 1920x1080 on bundle `3d7ee038fca60de4` (`scripts/playtest/world-look-probe.mjs`)
and the `yairpg-game` MCP on this worktree, a fresh life crossing to Tingen as a Nighthawk probationer
and doing one paid errand. Rows marked unchecked were read from code only.

## Census

| World (family) | Where I am | What I can do | Progress, own form | People | Report voice | Fight surface |
| --- | --- | --- | --- | --- | --- | --- |
| Frontier Village (`frontier`) | working: scene header, season, weather | working: Local actions | working: level, skills, XP | working: Travelers, Neighbors | generic (the base voice; it is the fallback) | working: native combat panels |
| LOTM early Tingen (`lotm`) | working: place header with LOTM flourish, district line, Places and walks; **defect**: the Reports day header still reads "[ Home · 01/04/999 ]" and the scene says "Calendar unknown here" | working: Tingen workroom list with inline blocked reasons | working: Path and Work & merit tabs | generic: Travelers and Neighbors say "Village only"; Tingen people show only inside workroom rows | working for arrivals (voiced); **missing** for work: a finished paid errand (+12 pence) wrote no Reports line | unchecked (combat-surface lane) |
| Mistglass conservatory (family not checked) | unchecked | unchecked | unchecked | unchecked | generic | unchecked |
| Harry Potter (`hp`) | unchecked | unchecked: brewing panel exists (`hp_brewing_panel.js`) | unchecked | unchecked | generic | unchecked |
| Mother of Learning, Cyoria (`mol`) | unchecked: host and world pack exist | unchecked | unchecked | unchecked | generic | unchecked |
| Paradise hub (`paradise`) | partly: weather reads "Weather unknown · Paradise hub" (`world_weather_display.js`) | unchecked | unchecked | unchecked | generic | unchecked |
| Primordial (`primordial`) | unchecked: host exists | unchecked | unchecked | unchecked | generic | unchecked |
| GU (`gu`) | unchecked: domain exists | unchecked | unchecked | unchecked | generic | unchecked |

The "Other worlds" panel reads "No optional world installed" on a fresh public build; the book worlds
above load from private packs, so which are reachable depends on the installed packs.

## Findings

- K1. **LOTM work writes no Reports line.** The voice table (DSG13) can only voice a line that exists. LOTM's finished commands publish no receipt to Reports, so "what happened" for LOTM is the panel state alone. The fix belongs to the LOTM host (owned by `floor-wire`): publish a settled-command line through the existing `logMessage` port, kind `activity_finished` or `activity_money`, so the voice table can add a row.
- K2. **The day header is the home world's.** `[ Home · <frontier date> ]` shows in Tingen. A world's own calendar line (or none) is the basic-kit answer to "when am I".
- K3. **People panels are frontier-only.** Travelers and Neighbors say "Village only" in Tingen; the people the player meets live in workroom rows. A world-neutral "who is here" reader is the basic-kit gap.

## Next (ranked, proposals)

| Priority | Work | Level / effort / done check |
| --- | --- | --- |
| First | Fill the unchecked rows: one fresh life per installed world, six cells each. | Haiku through the MCP, half a session. Done: no unchecked cell. |
| Second | K1 patch to `floor-wire`, then a LOTM voice row for finished work (flavour plus pay and what it unlocks). | Sonnet low. Done: a finished errand shows a voiced line at 1920. |
| Third | K2 and K3 as world-neutral readers. | Sonnet medium, one session each. |
