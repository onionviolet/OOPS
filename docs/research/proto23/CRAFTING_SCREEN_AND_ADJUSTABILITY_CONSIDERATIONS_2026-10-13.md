# Crafting screen, Proto23 parity, reveals and adjustability (2026-10-13)

Weibao, 2026-10-13: "go with the crafting screen one, same until done setup
Consider Proto 23 parity and dpeth and more? like the revealing ones and more?
More to consider? Missing stuff and more? Making everything little thing
adjustable and more? more to consider?"

A palette of proposals, not specs. Sources: Proto23 R4 §1 (recipes), the
[absorption ledger](../../gm/dispatch/vivid-proto23-flow-2026-10-13/PROTO23_ABSORPTION_LEDGER.json),
[Technology and progression CT1-CT5](../../TECHNOLOGY_AND_PROGRESSION.md#crafting-tiers-and-connected-progression-2026-10-11)
and the [UI owner](../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md).
Our crafting is a deeper design (quality, success windows, stations, batches);
Proto23's is a readable "what can I make with today's groceries" puzzle.
Parity means keeping our depth and gaining its readability.

## Parity with Proto23's crafting screen

| Code | Proto23 has | Our version |
| --- | --- | --- |
| CP1 | List beside detail: recipes left; reagents, output, tools right | Selected-row detail region in the crafting view, quote and button together, at 1366×768 without page scroll |
| CP2 | Unknown ingredients show as `?????` until discovered; result hidden unless allowed | Unnamed placeholder ("an unfamiliar material") until first held or read about; never leak names into search, tooltips or counts |
| CP3 | Missing requirements colored | Every requirement as have/need with `--sem-blocked` and a word ("need 2 more", "needs a fire"), not color alone |
| CP4 | Tool and place requirements as text lines (fire, sharp tool, tailoring tool) | Same, from our station tiers and tool checks, each with a reason |
| CP5 | Recipes unlock by book, by holding a threshold stack, or by skill milestone; "New blueprint unlocked" | Same three sources through existing owners, with the discovery cue and a reveal on first unlock (I4 pattern) |
| CP6 | First recipe reveals the Assemble tab | First known recipe reveals the crafting entry point if a world stages it; native Village keeps it visible |
| CP7 | Repeat craft after Crafting 1, faster with Crafting and Patience, stops on empty | Our batch crafting already exists; show the repeat/batch count, time per craft and the stop reason |
| CP8 | Per-recipe XP cap ("tutorial grind") | Show when a recipe stops teaching ("You've learned what this teaches") rather than silently giving 0 XP |
| CP9 | Burn chance on two recipes, skill-scaled | Our success window already does this; show the chance and what failure yields |
| CP10 | Gear ingredients consume the worst-condition copy first | Show which copy will be used and let the player pick (ties into durability) |

Rejected from Proto23: the counter that increments when a second tool silently
blocks output, and the Steak level-equals-3 quirk. One owner result must drive
the preview, the button, the craft and the receipt.

## Depth beyond parity

- **D1 Quote before commit:** expected output range, quality range, success
  chance, time, XP and what is consumed, all from the same function the craft
  uses.
- **D2 Receipt after commit:** what you got, its quality, what was used, XP
  gained, and "next level in N crafts". Anchored to the detail region, in the
  log once.
- **D3 Why not:** a blocked button always says the first blocking reason and
  lists the rest; clicking it focuses the first missing requirement.
- **D4 Where to get it:** for a known missing material, show the known sources
  (vendor, place, recipe) from the notebook and bestiary, never unknown ones.
- **D5 Compare:** for equipment, the result beside what you have equipped
  (ties into Equipment comparison).
- **D6 Favorites and recent:** pin recipes, show last five crafted.
- **D7 Material choice:** pick which stack or quality to use when several fit.

## Reveals (the Proto23 flow, extended)

| Code | Trigger | Reveal |
| --- | --- | --- |
| RV1 | First recipe known | Crafting entry appears (world-staged) |
| RV2 | First craft completed | Receipt history and the recipe's teaching progress appear |
| RV3 | Holding a threshold stack of a material | A recipe that uses it appears with the discovery cue |
| RV4 | First station tier reached | The tier column appears in the detail |
| RV5 | First quality above common | Quality ranges appear in quotes |
| RV6 | First failed craft | The success-chance line appears, so new players aren't shown odds before odds matter |
| RV7 | First material seen but never held | Its name replaces the placeholder in recipes that use it |
| RV8 | Crafting skill milestone | Batch/repeat control appears |

Each reveals once, never on reload or import, and derives from save facts.

## Missing today (from the ledger and earlier audits)

- **M1** Shop rows: red price when unaffordable, gray when sold out, quantity
  and bulk on one row (ledger adapt-next).
- **M2** Combat log: condensed lines with a CRIT label and damage-type color.
- **M3** Money denominations revealed after first handling coins.
- **M4** Tooltip detail on keyboard focus, not only hover.
- **M5** Condition and repair cost on worn items in the inventory.
- **M6** A skill milestone that teaches a method and reveals its action row.
- **M7** A "remaining finds" hint on capped searches.
- **M8** Titles earned through the discovery cue.
- **M9** In-play reveals for Notes, People you know and Known routes, which the
  last goal implemented but never exercised.

## Making every little thing adjustable

The existing owners already carry much of this: Layout (dock, size, density,
colors), Appearance (per-panel palette), Effects & sound. Proposed rule:
**every presentation choice we add ships with its setting, in the owner that
already holds its kind.**

| Code | Setting | Owner | Default |
| --- | --- | --- | --- |
| AJ1 | Reveal animations: full / quiet / off | Effects & sound | full (reduced motion forces off) |
| AJ2 | Coin float: on / off; also for automatic charges: on / off | Effects & sound | on / off |
| AJ3 | New-item dot: on / off; clears on hover / on open | Effects & sound | on / hover |
| AJ4 | Log follow: always / hold when scrolled up | Layout | hold |
| AJ5 | Vitals: value text inside / beside bar; show level; bar height | Layout or Appearance | inside, show, 16 px |
| AJ6 | Rarity: color only / color + label / label only | Appearance | color |
| AJ7 | Semantic colors: per-token override (gain, loss, money, blocked) | Appearance | scheme |
| AJ8 | Crafting detail: beside list / below list; show odds always / after first failure | Layout | beside / after failure |
| AJ9 | Spoiler level for unknowns: placeholder / silhouette count / hidden | Original rules | placeholder |
| AJ10 | Per-world theme intensity: full frame / accent only / off | Appearance | full |
| AJ11 | Holiday overlays: in-world only / plus real dates / off | Original rules (Real time) | in-world |
| AJ12 | Export and import all display settings as one file | Layout configuration | — |

Guardrails: defaults stay sensible so nobody needs the panel; every setting
is per browser unless it changes the game; settings never change mechanics;
each one gets a one-line description and a reset.

## Suggested order

1. **This goal:** the crafting screen (CP1-CP4, D1-D3, CP2 placeholders, CP8,
   one RV), with its AJ8 setting.
2. **Settings pass:** AJ1-AJ7 for the features already shipped, plus AJ12.
3. **M1 shops, then M6 method reveal, then M2 combat log.**
4. RV3/RV5-RV8 as the crafting depth grows; AJ9-AJ11 when a second world's UI
   lands.

## More to consider: settings, crafting, cheat panels and other panels (2026-10-13)

Weibao: "more to consider for the settings and crafting? Panels for cheats and
other stuff and more?" Palette, not specs. Cheats are designed in
[CHEAT_LIBRARY](../../CHEAT_LIBRARY.md) (shared screens: death menu, anchor
list, status window, shop, roster, ledger; phases C0-C6, not started) and
[PRESENTATION_AND_FOURTH_WALL](../../PRESENTATION_AND_FOURTH_WALL.md).

### Settings, further

| Code | Consideration |
| --- | --- |
| ST1 | Search box over all settings; each result jumps to its control |
| ST2 | Presets: Calm (quiet reveals, no floats), Lively (full), Focus (minimal motion, compact density), Accessible (larger text, high contrast, no motion) |
| ST3 | "What changed" badge on settings that differ from default, plus per-section reset |
| ST4 | Live preview beside each setting (a sample coin float, a sample reveal) |
| ST5 | Per-world overrides: "in this world, use quiet reveals" (pairs with the L3 frame) |
| ST6 | Notification budget: max floats/cues per minute, so long idle runs don't get noisy |
| ST7 | Number format: 1,234 / 1.2k / exact; time as clock or "in 3h" |
| ST8 | Text size and line spacing per panel role, not only per module |
| ST9 | Color-blind safe variant of Vivid (hue pairs chosen for deuteranopia/protanopia) |
| ST10 | Settings carry a version so future defaults can change without overriding choices the player made |

### Crafting, further

| Code | Consideration |
| --- | --- |
| CR1 | Queue: line up several recipes; it runs while you idle and stops with a reason |
| CR2 | "Craft until": until N made, until a material runs low, until the next skill level |
| CR3 | Plan view: pick a target item; show the chain of intermediate recipes and what's missing at each step |
| CR4 | Material reservation: mark stacks as "keep for X" so batch crafts don't eat them |
| CR5 | Recipe notes the player writes; recipe variants learned from NPCs |
| CR6 | Station panel: which stations exist here, their tiers, and what a higher tier unlocks (known only) |
| CR7 | Quality forecast band with "why": skill, station, material quality each shown as a contribution |
| CR8 | Workmanship history: your last N results for a recipe, so improvement is visible |
| CR9 | Failure leftovers shown in the quote ("burnt bread" for Proto23's two recipes; our failure outputs) |
| CR10 | Per-world crafting vocabulary: alchemy reads as formulae, cultivation as refining furnace stages, tech as fabrication specs |

### Panels for cheats

Shared rule: a cheat panel is a workspace module that **does not exist** until
its holder knows the cheat (the I4 discovery rule), uses its world's L3 frame,
and never shows a sealed truth outside its discovery route. Hidden cheats stay
"quiet" with no panel. Each panel is one reusable screen; cheats are data that
pick a screen.

| Code | Panel | Holds | Reveal and feel |
| --- | --- | --- | --- |
| CH1 | Status window | Stats, titles, points, level, quest list | Appears at the system's first message; crisp frame; can crack, glitch or go dark per world events |
| CH2 | Death menu | Carry slots, anchors, what is kept | Only after first death with the cheat; slow, solemn reveal |
| CH3 | Anchor list | Save points, regression anchors, their costs | Grows per anchor; each anchor shows when and where |
| CH4 | System shop | Points, offers, refresh timer | Opens at first point earned; prices in `--sem-money`, unaffordable in `--sem-blocked` |
| CH5 | Companion voice | A spirit/AI in the log, its mood and hunger | Lives as a log channel first; becomes a panel when it grows |
| CH6 | Simulator / foresight | Runs, outcomes, odds, what you keep | Appears after the first simulation; shows its honesty grade |
| CH7 | Appraisal lens | What the lens can read on an item/person, grade-limited | Overlay on hover/focus, not a panel; text redacts above its grade |
| CH8 | Harvest / multiplier ledger | What was taken or multiplied, from whom | Quiet ledger rows; ethics visible to observers |
| CH9 | Cheat library | Cheats met, held, rumored (C6) | Notebook tab; rumors are unverified and labeled so |
| CH10 | Cheat settings | Per cheat: notification level, auto-use, confirm-before-spend | Inside the cheat's own panel, same AJ rule |

Cheat panel details worth deciding per world: the window's voice (the Clerk,
cold system text, a mentor), whether others can see it, interference
(jamming, forgery, a rival's window), and what happens when it is lost.

### Other panels

| Code | Panel | Notes |
| --- | --- | --- |
| PN1 | Relationships | People you know, standing, last met, promises; already partly in known-people |
| PN2 | Map and routes | Known places and routes as a graph; unknown edges absent |
| PN3 | Timeline and memories | Years remembered, life events, divergences from canon (timelines owner) |
| PN4 | Home | Furnishings and their bonuses, storage, upkeep |
| PN5 | Professions and duties | Current job, pay, schedule, standing |
| PN6 | Bestiary and appraisal | Known creatures, what you can tell about them |
| PN7 | Titles and talents | Earned, how, effects; public goals vs hidden ones |
| PN8 | World codex | Rules learned per world (power system notes) |
| PN9 | Goals board | Player-set goals with progress pulled from real state |
| PN10 | Economy | Income, spending, prices seen, with the semantic colors |

### The panel kit (what every panel above would share)

- **PK1 Contract:** id, role tint, discovered(), eligible() with reason,
  keyboard order, settings section, world frame hook, empty state text.
- **PK2 Reveal:** I4 rule plus a per-panel arrival style.
- **PK3 Density:** compact rows with breathing room (Proto23 pattern).
- **PK4 Spoilers:** no name, count or silhouette before discovery unless the
  world sets silhouettes on.
- **PK5 Settings:** each panel registers its own toggles into the settings
  pass's store.
- **PK6 Acceptance:** one gate template (fit at three desktop sizes, keyboard,
  contrast, reveal once, reload/import) reused per panel.

### Suggested order after the two running goals

1. PK1-PK6 as a small panel kit, proven on an existing panel (known people).
2. CH1 status window as the first cheat panel, which needs cheat card C0
   (save field with migration, Foundation-owned): coordinate before building.
3. CR1-CR3 queue/plan, then ST2 presets and ST1 search.
