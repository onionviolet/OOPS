# Idle-game UI layout research for the R21 parity shell (2026-10-17)

Read-only research. No repo files edited. Labels: SHOWN = I looked at the screenshot or page myself this pass; STATED = a source or wiki says so, I did not see it; INFERRED = my reading. Not accepted direction; no source ranked.

## Local status first

| Game | Owned / installed | Decompile or source notes | Where |
| --- | --- | --- | --- |
| Idling to Rule the Gods (ITRTG), Steam 466170, free | No `appmanifest_466170.acf` in Steam's steamapps; nothing in `~/.codex/research` | No decompile. Only Steam store JSON plus two screenshots read by the 2026-10-15 pass | `docs/research/PANEL_DESIGN_ABSORPTION_2026-10-15.md` (G4), `docs/research/panel-design-2026-10-15/private/itr-gods-store.json`, `docs/NICHE_GAME_REFERENCES.md` line 43 |
| Melvor Idle, Steam 1267910 | No acf | None. Earlier pass: wiki and game fetches returned 403, "no live Melvor behavior claimed" | PANEL_DESIGN_ABSORPTION G2, `docs/RESEARCH_IDLE_GAMES.md` section 6 |
| NGU Idle, Steam 1147690 | No acf at check time (earlier report says build 6938742 was installed) | Yes: ILSpy export, `docs/research/ngu-idle/` (REPORT, UI_DIGEST, FINDINGS) | UI_DIGEST.md |
| Proto23 | Not a purchase; pinned source copy and a local lab | `docs/research/panel-design-2026-10-15/private/proto23-lab/`, `docs/research/proto23/` | PANEL_DESIGN_ABSORPTION P23-1..5 |
| Kittens Game | Open source | `panel-design-2026-10-15/private/kittens-index.html`; `~/.codex/research/fs-kittens` | G3 |
| Trimps | Open source, fetched this pass (index.html, config.js, style.css) | Not previously studied in these docs for UI; Evolve/Trimps parked as L1 | this file |
| Evolve, Antimatter, Clicker Heroes, Realm Grinder | Only named in research lists | No UI evidence anywhere local; not covered here | `RESEARCH_IDLE_GAMES.md` line 65 |

## Screenshots saved this pass (scratchpad, not repo)

ITRTG 15 official store shots, Melvor 6 official store shots, in
`/private/tmp/claude-501/-Users-weiwei-code-yet-another-idle-rpg/f2c99f35-f2b0-47f9-818a-a58294091127/scratchpad/shots/` (itr0..14, mel0..5). Sources: Steam appdetails API for 466170 and 1267910. Melvor shots show "Atlas of Discovery" expansion UI, so they describe that build, not necessarily the base game.

## Idling to Rule the Gods

URLs: https://store.steampowered.com/app/466170/Idling_to_Rule_the_Gods/ (screenshots), https://itrtg.wiki.gg/wiki/Tips_and_Tricks (UI tips, last edited June 2023).

- Navigation: SHOWN. Two rows of about 12 monochrome icon buttons across the top, no text labels, current icon gets a white outline box, an AFK toggle at the far right. Lower-row icons include pets, flag, crossed swords, anvil, a town icon, infinity, group, question mark. A later screenshot (itr2) adds more icons to the same grid as the game progresses (INFERRED: icons appear as features unlock; STATED by the 2026-10-15 note as an icon-bar discoverability cost, tooltips untested).
- Width use: SHOWN. Three fixed regions at 1920x1080: top-left header (title, Clone count "x / y", three item icons), top strip of nav icons, left column (about 30% width) with character, and a right workspace (about 70%). The left column never changes when the workspace swaps. The workspace sometimes has its own second tab row (itr2: Battle, Stats, Inventory, Equip, Crafting, Smithing, Alchemy, Research, Bestiary, Info).
- Character panel: SHOWN. Narrow column: title line ("Strongest Entity in the Universe!" or "Divine Goddess", which is a rank title, not a typed name), Stats / Rebirth / Info sub-tabs, portrait with small icon buttons (profile, menu, crown) and pet and crystal slots, one big red HP bar, then a plain label/value stat list (Divinity, Attack, Physical, Mystic, Battle, Creating). Numbers use long English names (quinquagintillion) or E notation; one value overflows the column edge (itr4, "quattuorquinquagintillion"). A small yellow "bo" button top right in itr0 is unexplained.
- Typable character name: not SHOWN or STATED anywhere I found. The identity line is a rank title. Do not claim ITRTG has a typed name.
- Combat: SHOWN, two modes. Boss "god" fights (itr0): enemy name in a red bar, big portrait, stats list (Power, HP, Attack, Defense, special crit rule), Fight button, "God 21 / 28" progress. Dungeon-style battle (itr2): a landscape scene filling the workspace, player left with red HP and blue mana bars above their head, enemy right with HP/mana, an action progress bar under each ("Analyze", "Water Punch"), potion slots with count "999+", header with area name, level, exp/h, and Simulate / Relocate buttons. No scrolling combat log visible in either shot.
- Log and color: SHOWN absence. No message log panel appears in any of the 15 screenshots I viewed or the two earlier ones; I did not open all 15 (I viewed itr0, 1, 2, 4, 13). STATED by search snippets only: nothing found about a log. Color use seen: red = HP, blue = mana, green = progress/ready, yellow = selected tab text.
- Inventory: SHOWN only as a tab name (Inventory, Equip). No inventory screenshot viewed. Not claimed.
- Creation: SHOWN (itr1). A table with columns Creation / Count / Next At / Achieve. (three star icons) / N A (Off, 1, 2) / Create / Buy. Header controls: "Creations to create" input plus slider, "You are creating: Galaxy" progress bar, "You have / You created", toggles for auto-buy, and a timed boost banner "600% creating speed for the next 53 sec!". Each row is the same shape; a "More Info" button opens detail. STATED (wiki): an achievement icon sets the required count into the Next At field; a right-click on the '+' buttons subtracts or bulk-fills.
- Template sharing: INFERRED from itr1/itr2: Smithing, Alchemy, Crafting are separate sub-tabs under one workspace; Creation uses a row table, Battle uses a scene. Not enough seen to say they share one template.
- Other: SHOWN a full isometric town screen (itr4) and a mini-game (Ghost Defender, itr13) that takes the whole window with a Back button, so some features abandon the three-region frame.

## Melvor Idle (Atlas of Discovery build, store shots)

URLs: https://store.steampowered.com/app/1267910/Melvor_Idle/ ; text from search snippets: https://www.magicgameworld.com/melvor-idle-beginners-guide-tips-tricks/ , https://steamcommunity.com/app/1267910/discussions/0/3720566578369060428 . Official wiki returned 403.

- Navigation: SHOWN. Fixed left sidebar about 240 px wide: Shop and Bank at top (Bank shows "121 / 132" slots), then collapsible groups COMBAT, PASSIVE, NON-COMBAT (eye icon to hide each), each row = icon, name, "(level / 99)". Active skill name turns green. About 25 destinations fit as text labels; the list scrolls and continues into MINIGAME.
- Width: SHOWN. The sidebar plus one full-width main page (about 1650 px). Skill pages are a grid of 4 equal cards per row (woodcutting trees, mining ores), each card showing name, XP and seconds, art, progress bar, mastery. Locked cards stay in the grid with a red "Locked / Level 75" bar. A top header band is tinted per skill (green woodcutting, tan mining, orange bank, grey combat, teal herblore), and holds skill level, XP, current tool, "Spend Mastery Pool XP".
- Combat: SHOWN. Four-region page: top row of three big launch cards (Browse Combat Areas, Slayer Areas, Dungeons); below, a two-column split, player side (green HP bar with "100/100", attack-interval bar, Food, Menu, Equipment grid, Stats, Slayer Task, Attack Style) and enemy side (HP bar, interval bar, enemy art and name, small attack-type stat icons, View Monster Drops, Run / Area Select, Offensive and Defensive stat boxes); "Loot to Collect (2 / 100)" at the bottom with a floating mini bar "Enemy 80/80, You 100/100" pinned when the real bars scroll off. No scrolling text combat log in the page; results show as small toasts.
- Log and notifications: SHOWN. Toast popups (a "Congratulations! Your Mining is now Level 72." card top center; small "+65 Mining Skill XP" floating label near the item). SHOWN: an offline "Welcome Back!" modal listing gains with colored numbers (green gains, red warning "Township Health: 100%", red "lootbox was full"). STATED (search snippet): Melvor Idle 2 announces an event log for milestones and offline progress. No persistent log column.
- Bank: SHOWN (mel1). Left area: toolbar (Sort, Move items to new Tab, Toggle Sell Mode, Search Bank box), a row of tab icons (first tab shows an icon, 11 empty slots), counters "Space 121/132, Bank 25B, Tab 25B", then a 13-wide grid of icon tiles with count badges. Right area (about 25%): selected item detail with tabs (item, stats, settings), "Sell Item" slider and quantity, "All but 1", "All". Tiles show a small teal dot top-left on some (INFERRED: new or notable). Color coding by rarity is not visible: icons are colored by item art only. STATED (snippet): players organize tabs by combat style or resource; sort lives behind a gear icon.
- Crafting-type skills: SHOWN (mel5 Herblore). Category tab row at top ("Combat Potions", "Skill Potions"), left detail card (Create "Melee Evasion Potion I", effect text, tier icons, "Requires" vs "You Have" icon rows with red outline when short, "Produces" and "Grants" XP/mastery/etc icons, Create button with timer 2.00s), right a list of the other recipes with "Unlocked at Level N" in red. INFERRED: Smithing, Runecrafting, Cooking use this same left-card plus list pattern; I saw only Herblore and the grid pattern for gathering skills.
- Character identity: SHOWN: top right dropdown "Melvor" (account name), plus Combat Level in the sidebar. No portrait.
- Color coding: SHOWN: green = ready/gain/active, red = locked or short, blue = actions and links, orange/gold = gold and run/area actions.

## NGU Idle (local decompile plus one official screenshot, see UI_DIGEST)

Source: `docs/research/ngu-idle/UI_DIGEST.md` (SHOWN there from official 1680x1050 store screenshot 0; source claims are from the ILSpy export).

- Navigation: SHOWN. Left roughly 300 px resource/stats rail (three color-coded meters, HP/attack/defense/gold, rebirth time, save/load), a second rail about 220 px of feature buttons, then one large active page. Locked features stay visible. STATED from source (`MenuSwapper`): one active menu at a time, swapped in place.
- Combat: SHOWN. Boss page with character and opponent images, big action buttons, HP bars, lower story region.
- Log: not covered in the digest. Not claimed.
- Color coding: STATED from source (`ButtonShower`): hidden, disabled, named and ready are distinct states; fruit, quest, cooking, blood readiness have distinct colors; disabled buttons give a tooltip with the reason (`DisabledButtonTooltip`); some locked text is 10 to 12 pt (a legibility cost the digest flags).
- Inventory: STATED: modifier-click controls advertised in tooltip. No layout evidence.
- Crafting-type: not covered here.

## Proto23 (baseline, brief)

From PANEL_DESIGN_ABSORPTION P23-1..5 and the earlier source study. STATED by source reading: square framed regions, "You" and opponent regions nearby above actions, recipe list with neighboring reagent/output detail, skills appear on level-up, inventory subtype colors, equipment rarity colors and combat result colors are separate vocabularies. N4 in that doc: a recipe click crafts immediately in the source.

## Kittens Game and Trimps (log specialists)

Kittens (pinned source, `kittens-index.html` lines 397 to 465; ui.js):
- SHOWN in source: three columns, left "Resource panel", mid "Main panel", right "Game log" with a Log / Queue header tab, "Clear log", "[+] Log Filters" toggle, pause and undo links; a toggle for centered view. STATED in source (`renderFilters`): the filter list lists only filters that are `unlocked`, each a checkbox for `enabled`, sorted by name.
- Colors by message type: not verified this pass (CSS fetch failed). Not claimed.

Trimps (fetched `index.html`, `config.js`, `style.css` from the official repo):
- SHOWN in source: Bootstrap grid, `col-xs-5` log column (right), `col-xs-4` resource column (left), a middle column for buy tabs. Buy tabs: All, Buildings, Jobs, Upgrades, Equipment, with Jobs and Upgrades tabs hidden until earned, each with an alert badge.
- Log filters: SHOWN. A justified button row Story / Loot / Unlocks / Combat (green when on) plus a gear that opens "Message Config". `config.js` defines message groups Story, Loot, Unlocks, Combat, Notices, each with sub-toggles (Loot: primary, secondary, bone, exotic, helium, void maps, essence, token, magma, events, cache, exp; Unlocks: repeated, unique; Combat: trimp, enemy). CSS has per-type message classes (`StoryMessage`, `NoticesMessage`, `LootMessage.*`, `essenceMessage`, `expMessage`) with distinct colors; I did not read the color values. The log column is about 42% of the width at its grid.
- Battle: `battleContainer` is its own block (hidden until unlocked); layout not read.

## Cross-cutting contradictions with project ideas

- C1: Logs are small or absent in ITRTG and Melvor (SHOWN): ITRTG has no visible log; Melvor uses toasts and a Welcome Back summary. Kittens and Trimps give the log a full-height right column (SHOWN in source). This is a split, not a rule.
- C2: ITRTG's icon-only nav (SHOWN) conflicts with UR21 named destinations; Melvor and Trimps use text labels.
- C3: Melvor's tab icon row and "Space 121/132" show inventory capacity, a pressure YAIR may not want; the grid layout is the transferable part only.
- C4: ITRTG's character column has no typed name (rank title only); Melvor shows the account name in a dropdown. Neither is a model for a typable name field; Proto23 and the vault have not been checked for one in this pass.
- C5: ITRTG's isometric town and mini-game take over the whole frame; a shell that keeps the log always visible (accepted for YAIR) would not do that.

## Transferable patterns for the parity shell (1920x1080, 5 regions)

1. T1 Fixed left column for You (portrait or name, one wide HP bar, label/value stats) beside a swappable workspace, as ITRTG; give the stat labels fixed-width columns and cap numbers with a short-form so values cannot overflow (ITRTG itr4 overflows).
2. T2 Text-labeled, collapsible nav groups with a status number per row, as Melvor's sidebar, placed in the actions/place region; do not use icon-only navigation.
3. T3 Combat as a two-column You versus Opponent split, each side with HP bar, action-interval bar and a stat box, as Melvor and ITRTG's dungeon scene; add a pinned mini bar when the real bars scroll off.
4. T4 Right-hand full-height Reports column with a type-filter button row (Story/Loot/Unlocks/Combat style) and a gear for per-subtype toggles, as Trimps; list only filters the player has unlocked, as Kittens does.
5. T5 Inventory as an icon-count grid with a right detail pane (item, stats, sell) and a search box, as Melvor's bank; keep Proto23's separate vocabularies for subtype versus rarity colors rather than coloring every tile.
6. T6 Crafting pages share one template: category tabs, a selected-recipe card with Requires / You Have / Produces rows (red outline when short) and a Create button with duration, plus a neighboring recipe list with "Unlocked at X" reasons, as Melvor Herblore; use for runecrafting and the rest.
7. T7 For many parallel jobs, an aligned table (name, count, target, buttons) with a header strip for bulk toggles and boost banner, as ITRTG Creation; match YAIR's existing parallel work rather than adding clones.
8. T8 Distinct state colors for ready, blocked and locked with a reason line on hover or inline (NGU `ButtonShower`, Melvor "Locked / Level N"), plus a Welcome-Back style summary for time away.

Gaps: no Evolve, Antimatter, Clicker Heroes or Realm Grinder UI was inspected. ITRTG inventory, log and name entry are unknown. Melvor figures describe the Atlas of Discovery build. Trimps color values and Kittens per-type colors were not read.
