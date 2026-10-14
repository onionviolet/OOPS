# UI at scale: long-term considerations, 2026-10-14

Proposal palette, not a spec. Weibao asked: "Long term ui considerations for
when the scope gets bigger and more? more to consider?"

Standing direction still applies: [desktop and laptop first, mobile deferred](USER_VISION.md#standing-ui-priority-2026-10-13).
This doc covers what happens as system and world counts keep growing. The
existing owners keep their areas:

| Owner | Covers |
| --- | --- |
| [Modular workspace audit](UI_CONSISTENCY_AND_MODULARITY_AUDIT_2026-10-11.md) | Module boundary, docking, layout persistence |
| [Thematic UI](THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md) | Density by question, world frames, declarative world UI card |
| [Density audit](UI_DENSITY_AND_ORIGINAL_COMPARISON_AUDIT_2026-10-13.md) | Laptop height budget, action-first center column |
| [Panel kit](PANEL_KIT.md) | Per-panel contract and acceptance |
| [Nonhuman senses and UI](worlds/NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14.md) | Perception filters, odd bodies, scale |

## Where things stand

Verified from source on 2026-10-14:

- `src/workspace_layout.js:44` hand-orders about 18 module IDs inside the
  Workspace preset. Every new panel means editing that list, and anything
  unlisted sorts last.
- Four presets exist: Workspace, Classic, Focus and Compare. None is tied to an
  activity.
- There's no global search or command palette. The only "while you were away"
  is an in-fiction village action (`src/event_feed.js:19`), not a return digest.
- Ten source files poll with `setInterval`.

The pressure is concrete. Docs already queued as considerations include
hunger, companions, procedural crafting, research, settlements, timelines,
nonhuman bodies, broods, cheats, romance, minigames and many worlds. One panel
per system won't fit a 1366×768 laptop past about 20 systems (an unsourced estimate; see round 8), and the density
audit shows the center column is already short on height.

## A. Scaling rules (SC)

**SC1. Budget by player question, not by system.** Keep a small fixed set of
question homes, roughly: *what can I do here*, *what is running*, *what does
my body/build allow*, *what do I hold*, *who and what do I know*, *what
happened*, and *what needs me*. A new system adds rows, cards or actions to
those homes and gets its own panel only when it answers a new question.
Hunger becomes a vitals row plus a needs card, not a Hunger panel. A
settlement becomes its own panel because "how is my place doing" is a new
question.

**SC2. Contribution registry.** Systems declare contributions (a vitals row, a
local action, a current-work card, an attention item, a journal category)
with priority, eligibility, discovery gate and preferred home. Layout code
reads the registry, so the order list in `workspace_layout.js` stops being a
hand-maintained choke point. This extends the Panel kit contract and the
world UI card instead of replacing them.

**SC3. Relevance gating.** A system shows only when this character in this
world has state for it. An undead body shows no hunger. There's no companion
row before the first companion. A world without money hides coin. This keeps
early play clean, and since discovery drives the gate, it doubles as the
sealed-secret guard.

**SC4. Stable homes across worlds.** The same kind of information lives in the
same screen region in every world. Worlds reskin, rename and filter; they
don't relocate. Muscle memory is what keeps a twenty-world game playable.
Exceptions (a world that scrambles your UI on purpose) are fiction effects
layered on top, and they never overwrite the saved layout.

**SC5. One attention budget.** Use a single ranked "needs you" queue for
decisions, trials, offers, threats, finished work and starving companions.
Everything else is background. With many systems, the main failure mode is
ten panels each blinking for attention.

## B. Navigation (NV)

**NV1. Command palette and search.** Ctrl+K jumps to any known panel, item,
person, place, action or journal entry. It indexes known content only (means
principle and sealed secrets apply) and is the cheapest way to make 50
systems reachable without 50 visible panels.

**NV2. Activity workspaces.** Add presets per activity: Explore, Craft and
trade, Manage (settlement, household, brood), Combat, Social, Research. Each
uses the full laptop screen for that activity's panels. The game can suggest
a switch when the situation changes (combat starts), and the player keeps
control. IDE "perspectives" and DAW views are the reference. This is how
you use the screen fully without cramming everything into one layout.

**NV3. Links with a back stack.** Person → faction → event → place, with
Back. When dozens of systems cross-reference, inspection becomes navigation.

**NV4. Zoom ladder.** Body → household → settlement → region → world →
multiverse, all shown in one consistent zoom UI. This pairs with the
[settlement scale ladder](LIFE_SIM_NORTH_STAR.md#minigames-city-building-and-other-feature-families-claude-2026-10-10)
and the nonhuman scale section. Each rung shows only what your means can see
at that range.

**NV5. Pins and watchlist.** Pin any value, entity or job to a slim sidebar.
Players build their own dashboard without asking for a panel.

**NV6. Consistent hotkeys.** Use the same keys for the same verbs everywhere
(confirm, cancel, next tab, open journal, pause work), and list them in one
place that players can rebind.

## C. Information at scale (IN)

**IN1. Every number explains itself.** Clicking a number shows its breakdown:
base value, each modifier and its source, plus caps and conditions. Once
hunger, injuries, companions, cheats, gear and weather all touch the same
stat, "why is this 37?" becomes the most-asked question. Explanations obey
appraisal level: low means shows "something is dragging this down."

**IN2. Big and odd numbers.** Offer notation settings (full, short,
scientific) and units fitted to the scale (grams to tonnes, days to eras).
Leave room for non-finite values from the deep-concepts doc without breaking
layout.

**IN3. Logs that survive idle time.** Group repeats ("harvested herbs ×42"),
filter by category, search, and on return show a "while you were away"
digest ranked by the attention budget. A long idle session should give one
readable summary, not 400 lines.

**IN4. One knowledge vocabulary.** Known, suspected, rumored, outdated,
unknown and sealed each get one visual treatment used in every panel. The
means and appraisal docs define the states; the UI just has to stay
consistent.

**IN5. Comparison as a mode.** Compare items, bodies, builds, worlds,
companions or recipes side by side. The Compare preset exists; generalize it
to any two or three entities of a kind.

**IN6. Tables for many things.** Sortable, filterable and groupable tables
with virtualized rows for hundreds of NPCs, items, recipes and companions.
Card lists strain as entries grow (the earlier "30" figure was an unsourced
estimate; see round 8).

**IN7. Policies instead of clicks.** At scale, players manage with standing
orders: auto-eat below a threshold, sell junk, companion stances,
research queues, settlement priorities. A rules editor previews each rule in
plain language ("When hunger is below 30%, eat the cheapest safe food"). It
fits idle games well, and it's the main way a large game stays playable.

## D. Many worlds, bodies and selves (MW)

**MW1. Cross-world ledger.** When things run in several worlds at once (a
shop in one, an apprentice in another), a ledger shows what you can actually
know remotely given your means. Unknown stays unknown until you visit or
receive word.

**MW2. Body-driven panels.** Vitals rows, senses and available verbs come from
the body template, following the nonhuman senses doc. A tree, a slime and a
human use the same homes with different contents.

**MW3. Several controlled characters.** Parties, broods, clones, possessed
bodies and generated selves need a character switcher, per-character panel
contents and a group view showing who is doing what. Decide per world which
of these the player controls directly and which run on policies (IN7).

**MW4. World frame legibility.** As more world palettes land, run the
automated contrast check on every token set and every state color in every
frame. The thematic doc already proposes this; at scale it has to be a gate.

## E. Engineering (EN)

**EN1. Layout budget tests.** Automate checks at 1366×768 and 1920×1080 for
each preset: Local actions keeps a minimum visible height, there's no page
scroll, and critical controls stay reachable. Run them whenever a
contribution is added. This turns the density audit's finding into a
regression guard.

**EN2. Update model.** Many panels polling every 250 ms works now but scales
badly. Move toward dirty flags or subscriptions per state slice, and
virtualize long lists. Measure a busy layout before and after; don't claim a
win without numbers.

**EN3. Layout migrations.** When panels split, merge or get renamed, the
versioned layout remaps old IDs. Layout data stays separate from saves, and
"Reset layout" never touches the run.

**EN4. Leak audit.** Panel pickers, search, tooltips, disabled-reason text,
hotkey lists and layout export are the usual places sealed content leaks.
Add a test that renders each with an undiscovered secret and checks the
name never appears.

**EN5. Pack-supplied UI.** Private world packs add contributions and world
UI cards as data, with no new UI code, so adding a pack or removing it again
leaves the layout intact.

**EN6. Strings as data.** Keep player-facing text in content data rather than
render code. This helps world-specific vocabulary now and localization
later. Localization itself stays deferred.

## F. Player comfort (PC)

**PC1. Glance and deep sessions.** Idle play alternates 30-second check-ins with
hour-long sessions. A glance view (attention queue, away digest, running
work, one-click resume) can sit beside the full workspace.

**PC2. First-reveal teaching.** When a system first appears (SC3), show one
sentence on what it is and one on what to do, then file it in a help or
codex entry. Fifty systems taught all at once won't land; fifty taught as
they arrive can.

**PC3. Uniform consequence handling.** Use the same confirm, undo and
"this is irreversible" treatment for every system's consequential actions.

**PC4. Opt-in browser notifications.** Notify when the tab is hidden and a
job finishes or something needs you. Use the attention queue's ranking so it
doesn't spam.

**PC5. Second monitor.** Read-only popout windows (log, map, ledger) fit
"use the whole screen." Command ownership stays with the main window because
of save locking, as the modular audit notes.

**PC6. Existing accessibility controls stay.** Text size, density, reduced
motion and color-independent meaning carry forward unchanged.

## Deferred

Mobile layouts, controller input, localization and touch remain deferred
under the standing UI priority. The SC rules make them cheaper later, since
question homes map to tabs on small screens, but they don't create that
work now.

## Five suggestions, ranked

1. **SC1 + SC2: question homes and a contribution registry.** Everything else
   builds on it, and it removes the hand-ordered module list.
2. **SC5 + IN3: attention queue and away digest.** This gives the biggest
   feel improvement for an idle game as systems multiply.
3. **EN1: layout budget tests.** This locks in the laptop-first gains before
   more contributions land.
4. **NV1: command palette over known content.** It's a cheap way to reach
   everything.
5. **IN1: number breakdowns.** These become necessary once hunger, companions
   and gear stack on the same stats.

Activity workspaces (NV2) and policies (IN7) come next; both are larger.

None of this is selected for a build. Browser verification isn't specified
or run, since this is a proposal palette.

## Round 2: specific panels, cheats and where things go (2026-10-14)

Weibao: "more to consider? other stuff and more? save and extend accordingly?
We can give specific panels and stuff for cheats and more, but where to put
accordingly and more? More to consider?"

Yes. Specific panels are fine. Round 1's SC1 decides when a system *needs*
a panel, not a ban on panels. This round covers how to choose the form, where
it lives on a laptop, and how cheats fit. It builds on the
[panel kit roles](PANEL_KIT.md#contract), the
[CH1-CH10 cheat cards](gm/dispatch/panel-kit-2026-10-13/CHEAT_PANEL_CARDS.json)
and [W3 hiding UI](gm/dispatch/cheat-considerations-2026-10-13/W3_HIDING_UI_AND_INTEGRATIONS.md#hu14-diegetic-and-player-side-placement).
Where those owners already decide something (CH7 is an overlay, CH10 is
embedded), this round follows them.

### G. Choosing the form (PL)

**PL1. Own-panel test.** A system earns its own panel when any two of these
hold:
- it answers a question no home answers;
- it holds a list or more than a handful of live values the player scans (an estimate, not a
  sourced limit);
- the player returns to it several times a session;
- it needs to sit beside something else for comparison (shop beside
  inventory, enemy beside self).

Otherwise it contributes to a home. The test is a guide, not a gate. A
player can still pop any contribution out into its own panel (PL4).

**PL2. Form ladder, lightest first.**

| Form | Use for | Example |
| --- | --- | --- |
| Chip or badge | One value or state, always visible | Cheat points, hunger icon, unread count |
| Row | A labelled value with a bar | Satiety in vitals, cooldown on a skill |
| Card in a home | A small bundle with one or two actions | Companion card in Current work |
| Tab inside a panel | A sibling view of the same question | Library tab in Records |
| Own panel | Passes PL1 | Status window, settlement |
| Contextual slot | Activity-bound, comes and goes | Shop, combat, crafting bench |
| Overlay | Reading on a focused thing | Appraisal lens (CH7) |
| Takeover | A boundary that must be answered | Death menu (CH2), trial entry |

**PL3. Promotion as growth.** A system can climb the ladder as it deepens,
with each step a discovery moment. A stage-1 status window is a row and a
chip; at a later stage it becomes its own panel; with a skill tree, it gets
a tab. Promotion follows saved facts, fires its reveal once and never
replays on reload (the panel kit's rule).

**PL4. Pop out and tuck in.** Any card, tab or row group can be popped into
its own panel or tucked back into its home by the player, and the layout
remembers it. Defaults stay lean, and any player who wants a dedicated
hunger panel can have one.

### H. Laptop zoning (ZN)

**ZN1. Five standing regions.** This proposal extends the density audit's
action-first center.

| Region | Holds | Role tint |
| --- | --- | --- |
| Top strip | Time, place, attention chip, held-cheat chips, save state | none |
| Left column | Self: vitals, body, build, held powers, preparation | character (teal) |
| Center | Local actions and current work, always the tallest | actions (blue) |
| Contextual slot | Whatever the activity needs: shop, combat, bench, map, cheat shop | per panel |
| Right column | Records and log: journal, people, routes, library, messages | records/log |

At 1366×768 the contextual slot shares the center by splitting it, with
actions kept at a minimum height (EN1). At 1920×1080 it gets its own fourth
column so nothing gets squeezed. This is how "use the whole screen" scales
without stacking panels down the center.

**ZN2. One contextual slot, not many floating panels.** Trade, combat,
crafting, a cheat shop, a minigame and a festival stall all want space only
while active. Routing them all through one slot keeps the layout stable.
When the activity ends, the slot returns to whatever the player pinned
there.

**ZN3. Collapsed panels still speak.** A collapsed header shows a one-line
summary: "Status window · 12 pts · quest due", "Companion · hungry". At
scale, most panels spend most of their time collapsed, so the summary line
is what the player actually reads.

**ZN4. Temporary panels.** Events like a siege, festival, exam or trial can
bring a panel that exists only for that event. When it ends, the panel
folds into a journal entry. The player keeps the record without a dead
panel cluttering the layout.

### I. Where cheats go (CS)

**CS1. A cheat's surface follows its fiction.** Each cheat card declares a
`surface`:

| Cheat fiction | Natural surface | Example |
| --- | --- | --- |
| System or interface (game-world isekai) | Its own window, framed as a UI | CH1 status window |
| Innate talent or bloodline | Rows in the body or build panel; no window | Fast regen as a vitals modifier |
| Item or artifact | Item detail, plus a chip while equipped | A ring with charges |
| Companion or voice | Log channel, then its own panel as the bond grows | CH5 |
| Knowledge or foresight | Records tab | CH6 simulator, CH3 anchors |
| Perception | Overlay | CH7 appraisal |
| Shop or exchange | Contextual slot | CH4 system shop |
| Boundary power (death, rewind) | Takeover at the boundary | CH2 death menu |
| Quiet cheat | No surface; effects show only in normal numbers and breakdowns | Per the library rule |

This keeps cheats from all looking like status windows, which matters once
a run holds several.

**CS2. Many cheats at once.** Three arrangements, all reachable as presets
(everything possible, reasonably):
- **Spread:** each cheat lives where its verb lives (CS1). This is the
  default.
- **Shelf:** a "Held powers" panel in the left column, with one tab per
  cheat. Good for players who think in terms of "my cheats."
- **Merged system:** if the world says the cheats fuse into one System, one
  window hosts every module as tabs. The fiction decides whether this is
  offered.

The library (CH9) is always the index and links to wherever each cheat
lives.

**CS3. Cheat resources as chips.** Points, charges, cooldowns and corruption
appear as chips in the top strip, edged in that cheat's accent. Clicking a
chip opens the cheat's surface. When more than about four chips accumulate,
they collapse into one "powers" chip with a count.

**CS4. Cheat voice in the attention queue.** Cheat prompts ("New quest",
"Points ready") go through the single attention queue (SC5), carrying the
cheat's voice and accent but ranked like everything else. A cheat never gets
its own popup channel.

**CS5. Hidden and public modes.** W3 owns this: notebook disguise, public
stealth, boss key, screenshot-safe mode. In zoning terms, a hidden cheat
keeps its slot but shows the disguise, and save, recovery and costs stay
reachable (HU16).

**CS6. Cheat growth tracks.** Stages, trees and unlock progress live as a
tab inside the cheat's own surface, not in a global progression screen. A
cross-cheat overview belongs in the library.

**CS7. Enemy and NPC cheats.** These show only as observed effects in the
combat or person view, read through appraisal grade: "Something keeps
reviving it", then a named reading at higher grades. They never get a
player-side panel unless stolen or copied.

**CS8. Cheat-touches-UI effects.** Some cheats alter the UI itself: foresight
ghosting future log lines, a time cheat rewinding the log, a glitch cheat
cracking frames. These are layered effects on the affected panel (L6 in the
thematic layers), and they never move or destroy the saved layout.

### J. Where other systems go (PL table)

Proposed defaults only. Players can rearrange with PL4.

| System | Default form and home | Promotes to |
| --- | --- | --- |
| Hunger and bodily needs | Vitals rows; needs card when urgent | Own panel when diet planning matters |
| Companions, familiars, pets | Card in Current work; log voice | Own panel per bonded companion; group view at 3+ |
| Procedural crafting | Contextual slot (bench) | Recipe book tab in Records |
| Research and technology | Current work card (active question) | Own panel with queue and tree |
| Settlement or household | Own panel (new question) | Manage activity workspace |
| Relationships and romance | People panel rows | Per-person detail page via NV3 |
| Timelines and foresight | Records tab | Timeline view in the contextual slot |
| Trials | Attention item, then takeover at entry | Trial panel for its duration (ZN4) |
| Minigames | Contextual slot | none |
| Brood or several bodies | Character switcher in top strip | Group panel |
| Cross-world ledger | Records tab | Own panel once you hold assets in 2+ worlds |
| Map and travel | Contextual slot | Pinned right column panel |
| Codex, help, glossary | Overlay on any term | Records tab |

### K. More to consider (MC)

**MC1. Cross-panel highlighting.** Hovering an ingredient in a recipe lights
it up in inventory, and hovering a person lights up every mention in the
log. With many panels, this tells the player that they're looking at one
world.

**MC2. Drag between panels.** Drag food onto a companion, an item onto the
shop, or a person onto a quest. Every drag has a button or menu equivalent,
following the D2 rule from the modular audit.

**MC3. Layouts that follow context.** Optionally switch to a remembered
layout per world, per body or per activity: possessing a slime brings back
your slime layout. The player can opt out, and it never overwrites a
manually saved layout.

**MC4. Named player dashboards.** Pins (NV5) saved as named views: "Farm
check," "Before a fight." This is the cheapest kind of custom panel.

**MC5. Layered tooltips and a glossary.** A term inside a tooltip can itself
be hovered, and world vocabulary links to the codex. Twenty worlds' worth of
jargon needs this.

**MC6. Panel gallery and UI census.** A dev-only page renders every panel and
contribution with fixtures, at both laptop sizes, in every world frame. It
generates a census listing each surface's ID, home, form, discovery gate and
sealed-safety check. This is how to keep a big UI consistent without reading
every file, and it pairs naturally with EN1 and EN4.

**MC7. Empty, locked and broken states.** Every surface defines its empty
text, its known-but-unavailable reason (panel kit rule) and its look when the
system is damaged (window going dark, HU6). These three cases get missed
most often when systems ship fast.

**MC8. Sound per role.** If audio grows, each role gets its own cue family
(actions click, records page-turn, log tick), and each cheat gets a signature
tone on its attention items. This stays subordinate to the existing feedback
and sound owner in the UI experience audit.

**MC9. Text-art surfaces.** Since the game is text-first, maps, trees and
timelines can use box-drawing and text-VFX styles from the presentation owner
rather than canvas graphics. This keeps them themeable and accessible.

### Round 2 suggestions, ranked

1. **ZN1 + ZN2: five regions and one contextual slot.** These give every
   future panel an obvious place, cheats included.
2. **PL2 + PL4: the form ladder, with pop out and tuck in.** Lean defaults,
   while any player can still have a dedicated panel for anything.
3. **CS1: cheat card `surface` field.** This lets cheats look like their
   fiction instead of all becoming status windows. It's a small schema
   addition to the cheat cards, and it needs runtime from C0 or later.
4. **ZN3: summary lines on collapsed panels.** Cheap, and at scale it's what
   the player reads most.
5. **MC6: panel gallery and census.** This is the guard that keeps 50+
   surfaces consistent.

None of this is selected for a build, and no browser verification was run.

## Round 3: how other games do it, and more (2026-10-14)

Weibao: "more to consider? other stuff and more? save and extend accordingly
Send out codex as usesful? How does other games do it and more?"

Everything in section L is **MEMORY** (recalled, not yet checked). Codex
lanes in [the ui-at-scale dispatch](gm/dispatch/ui-at-scale-2026-10-14/runs/SESSIONS.md)
verify it with sources:
- U1: idle, simulation, RPG/MMO and text games.
- U2: cheats and system windows, in fiction and in games.
- U3: engine fit, a module census and ASCII wireframes at both laptop sizes.

Their results land in that folder and get folded in here afterward.

### L. Patterns from other games (GR, MEMORY)

| Code | Game(s) | What they do | Lesson for YAIRPG | Supports |
| --- | --- | --- | --- | --- |
| GR1 | Kittens Game, Evolve | Resource column always visible on the left; tabs per domain unlock over the run | One persistent "what I have" strip beats repeating numbers in every panel | ZN1, SC3 |
| GR2 | Melvor Idle | Sidebar of skills, grouped and collapsible; each skill is its own page | Page-per-system works when navigation is grouped and the active job shows everywhere | NV1, PL2 |
| GR3 | NGU Idle | One long menu of unlocked features | It works, but it's famous clutter by late game. A warning for SC1 | SC1 (caution) |
| GR4 | Antimatter Dimensions | Tabs and subtabs unlock per prestige layer; notation options; a scripting automator late on | Unlocking UI is itself a reward, and automation arrives as a late, earned layer | PL3, IN2, IN7 |
| GR5 | A Dark Room, Candy Box | The interface itself grows as the story unfolds | Progressive reveal as narrative fits a text game | PL3, PC2 |
| GR6 | Crusader Kings 3 | Nested tooltips you can lock and drill into; encyclopedia links | Explanation in place, without leaving the screen | IN1, MC5 |
| GR7 | CK3, Stellaris | Alerts bar ranked by importance; pinned outliner of tracked things | Attention queue plus watchlist | SC5, NV5 |
| GR8 | RimWorld | Alerts on the right; hovering highlights the pawn; work-priority grid; colonist bar | Hover links alerts to entities; a policy grid for many people | MC1, IN7, MW3 |
| GR9 | Dwarf Fortress (Steam) | Keyboard menus replaced by clickable icons and panels, while depth stays | Depth survives a friendlier surface; onboarding was the real fix | PC2 |
| GR10 | Factorio | Alt-mode overlays, recipe-tree tooltips, an in-game encyclopedia | Overlays toggle a layer of information on and off over the same view | PL2 overlay, MC5 |
| GR11 | World of Warcraft | Edit Mode moves default frames; addons like WeakAuras let players build their own alerts | Players want to move and build UI; make the default movable | PL4, MC4 |
| GR12 | Final Fantasy XIV | HUD layouts saved and switched per job | Layout per body, per role or per activity | MC3, NV2 |
| GR13 | Path of Exile | Player-written loot filters; a zoomable passive tree; hold a key to compare | Rules the player writes, which scale to thousands of items | IN7, IN5 |
| GR14 | Disco Elysium | Skills speak as voices in the log; a thought cabinet with slots | Powers as voices in the log, not panels | CS1 voice |
| GR15 | Hades, Slay the Spire | Boons and relics as an icon row, with detail on hover or pause | A compact row for many held powers | CS3 |
| GR16 | Balatro | Few joker slots, order visible and mechanically meaningful | A slot limit and an order shown in the UI become part of the mechanic | CS2 |
| GR17 | Persona, Stardew Valley | A calendar is the spine of the UI | A life sim can hang everything on time | NV2, MO2 |
| GR18 | Football Manager | Inbox for events; customizable table views with saved column sets | Inbox as the attention queue; tables for hundreds of people | SC5, IN6 |
| GR19 | Outer Wilds | Ship log as a rumor map that grows with discovery | Known and suspected knowledge as a map | IN4 |
| GR20 | Mudlet and MUD clients | Split panes, triggers, aliases, text maps | Desktop text-game layouts and player automation | ZN1, IN7, MC9 |
| GR21 | Fallen London | Storylet cards; a "Myself" page grouping qualities by category | Many hundreds of stats stay readable through grouping | IN6 |
| GR22 | EVE Online | Overview columns customizable; windows everywhere | Powerful, but window soup is the warning for floating panels | ZN2 (caution) |

**What failed elsewhere:**
- NGU's endless menu.
- EVE's window soup.
- Old Dwarf Fortress menu depth.
- Tooltip-only explanations.
- Alert spam with no ranking.
- Layouts that reset on patch.

Each one maps to a guard already in this doc: SC1, ZN2, PC2, IN1, SC5 and EN3.

### M. More to consider (MO)

**MO1. Inbox metaphor.** The attention queue can read as an inbox in worlds
where that fits, like a guild board, letters or a system mailbox. Same queue,
world skin.

**MO2. Calendar spine.** For life-sim stretches, a calendar view of
appointments, festivals, harvests, deadlines and companion needs. It sits in
the contextual slot and links to everything scheduled.

**MO3. Three tiers of policy UI.** Toggles ("auto-eat"), then grids (a
RimWorld-style people × tasks table), then written rules (filter or trigger
style). Each unlocks as scope grows, and fiction can gate the higher tiers
(the Earned Habit cheat card).

**MO4. Slots as mechanic.** Where a world limits how many powers you can run
at once, show the slots, their order and empty slots, Balatro-style. Where
it doesn't, use the plain icon row (CS3).

**MO5. Lockable nested tooltips.** A tooltip pinned in place, with terms that
open further tooltips and a breadcrumb back. This is the backbone of IN1 and
MC5.

**MO6. Overlays as layers.** A key toggles an information layer over the
current view: danger, value, relationships, discovery state. One view, many
readings.

**MO7. Collection and completion logs.** Per-world logs (items found,
people met, cheats seen, recipes known), with percent shown only for known
categories so nothing sealed leaks.

**MO8. Run and legacy screens.** History across runs, worlds and selves:
past characters, deaths, achievements and inheritances. It pairs with the
Hall of Selves and Rebirth Ledger cards.

**MO9. Lifetime statistics.** A plain stats page (hours, kills, coins,
meals). It's cheap, players like it, and it gives breakdowns somewhere to
link.

**MO10. Searchable settings.** Settings grow with systems. Make them
searchable, grouped by panel (the panel kit already scopes settings per
panel), with reset per group.

**MO11. UI debt rule.** Each new surface names its question home, form,
discovery gate and owner before it ships, and the census (MC6) lists it.
This keeps the cleanup of later rounds cheap.

**MO12. Patch-safe layouts.** When an update renames or splits panels, show
a one-time "your layout changed" note that lists where things moved. EN3
handles the remap; this tells the player about it.

### Round 3 suggestions, ranked

1. **GR7 + GR18 + MO1: ranked attention queue with an inbox skin.** Every
   genre that scales has one.
2. **GR6 + MO5: lockable nested tooltips.** This is how CK3 makes a huge
   system readable, and it's text-native.
3. **GR11 + GR12 + MC3: movable default frames with per-activity or per-body
   layouts.** Proven by WoW and FFXIV.
4. **MO3: three-tier policy UI.** It keeps a large idle game playable late in
   a run.
5. **MO11: UI debt rule plus census.** It costs almost nothing now and keeps
   the screen sane at 50 systems.

Codex lane results will confirm, correct or extend the GR table. Nothing here
is selected for a build.

## Round 4: time, decisions, stories, worlds and upkeep (2026-10-14)

Weibao: "more to consider? other stuff and more? save and extend accordingly
Send out codex as usesful?"

These areas aren't covered by rounds 1 to 3. More Codex lanes are out in
[the same dispatch](gm/dispatch/ui-at-scale-2026-10-14/runs/SESSIONS.md):
- U4: accessibility, keyboard play and text-heavy UI.
- U5: a surface inventory that tests every other considerations doc against
  these rules.
- U6: inventory, journal, character sheet, people and log at very large
  sizes.

### N. Time and pace (TP)

In an idle game, time is the core control, so it deserves a single
consistent home.

**TP1. One time strip.** Pause, speed and the current clock live in the top
strip in every world, with local calendar names per world. Show real time and
game time side by side when they differ.

**TP2. Run until.** Stop conditions on any job: "until hungry," "until 50
herbs," "until dusk," "until something needs me." This is the lightest
policy tier (MO3) and probably the most used control in a mature idle game.

**TP3. Fast-forward with a digest.** Skipping hours or days produces the same
away digest as being offline (IN3), so long skips stay readable.

**TP4. Clocks that differ.** Some worlds or bodies run on different clocks
(time chambers, a tree's seasons, a world where time stopped while you're
away). The strip shows which clock you're on. The others appear in the
cross-world ledger (MW1), each only to the degree your means can know it.

### O. Decisions and previews (DP)

**DP1. Preview before acting.** Every consequential action shows its cost,
time, risk and what changes, with risk labelled at your appraisal grade. A
low grade reads "looks dangerous"; a high grade gives odds.

**DP2. Compare two choices.** Hold a key to compare two actions side by side
(the IN5 mode applied to choices).

**DP3. Undo windows and irreversible marks.** Reversible actions get a short
undo. Irreversible ones carry one consistent mark and a confirm (PC3).

**DP4. Honest odds.** When the fiction lies (a cursed shop, a Loaded Dice
cheat), the preview shows what your character believes, and the journal later
records what actually happened. This ties to knowledge states (IN4).

### P. Goals and planning (GP)

**GP1. Player goals tracker.** Set your own goals ("craft a steel sword,"
"befriend the smith," "reach realm 3") and pin them. The tracker shows known
next steps only.

**GP2. Prerequisite chains.** Click a goal to see its chain: materials, skills,
people and places, with known, suspected and unknown links drawn
differently.

**GP3. Shopping list.** A crafting or research goal adds its missing inputs to
a list that highlights matching items in shops and loot (MC1).

**GP4. Reminders.** Ask to be reminded on a date, a condition or an arrival.
Reminders go through the attention queue.

### Q. Stories at scale (NP)

**NP1. Scene mode.** A conversation or story beat can take over the center for
its duration. The action list waits, and the log keeps a transcript.

**NP2. Several threads at once.** When many conversations and storylines run
in parallel, give each a thread with the person's name, unread count and last
line. This is the attention queue for story.

**NP3. Transcript archive.** Every scene is kept and searchable by person,
place and topic, with Morrowind-style topic links into the codex.

**NP4. Previously.** After a long absence or a world switch, offer a short
recap of open threads, unfinished goals and recent turns, built from the
journal rather than invented.

**NP5. Read speed.** Offer instant, typed or paced text, plus a skip for
lines you've already read. Text VFX respects reduced motion.

### R. Moving between worlds (WT)

**WT1. Transition card.** Arriving in a world shows what's different here:
frame, currency, clock, body changes and which panels are dormant. It doesn't
reveal what you haven't discovered.

**WT2. Dormant panels.** Panels that don't apply in this world grey out with a
reason ("No coin here") instead of vanishing. Your layout survives the trip
back.

**WT3. Per-world vocabulary.** The same panel ID shows the local name: "Mana"
becomes "Cursed energy" or "Chakra." Tooltips show the general term for
cross-world comparison.

**WT4. Currency and unit translation.** Where exchange exists in the fiction,
show values in local units with an optional home-unit hint. Where it
doesn't, show nothing rather than invent a rate.

### S. Pruning from your own use (SO)

**SO1. Local usage notes.** Track, on this device only, which panels you open,
collapse and never touch. Nothing is sent anywhere.

**SO2. Tidy suggestions.** An optional, dismissible note such as "You haven't
opened Weather in 10 sessions. Collapse it?" It never acts on its own.

### T. Visual system at scale (VI)

**VI1. Type scale tokens.** About five sizes, used everywhere. Panels pick a
token, never a pixel size, so global text size works.

**VI2. One icon family.** One icon style, one glyph per role and per
knowledge state. Worlds can reskin icons but keep their silhouettes.

**VI3. Number formatting in one place.** One formatter for numbers, time,
units and notation (IN2), so 50 systems don't format 50 ways.

**VI4. Spacing and density tokens.** Compact, comfortable and inspection
density are token sets, not per-panel CSS.

**VI5. Census checks tokens.** The panel gallery (MC6) flags any surface using
raw colors, sizes or fonts.

### U. Failure and recovery (FR)

**FR1. Save state always visible.** Saved, saving, failed and read-only states
show in the top strip in every layout and world (as the modular audit
requires).

**FR2. Broken layout recovery.** Corrupt layout data falls back to a preset
with a note, and the run is never touched (EN3).

**FR3. Missing pack.** If a private pack is removed, its panels go dormant with
a reason, and they come back when the pack does (EN5).

**FR4. Version notes.** After an update, a short "what's new for you" note
covers only systems you've discovered.

### V. Session framing (SF)

**SF1. Start screen at scale.** Continue, several characters and worlds,
each with its own last-played time and a one-line state.

**SF2. Since last time.** The first screen after loading is the away digest
and attention queue, then the workspace.

**SF3. Quick resume.** One key resumes the last job or activity workspace.

### Round 4 suggestions, ranked

1. **TP1 + TP2: one time strip and "run until."** This is the most-used
   control in a mature idle game.
2. **DP1: preview before acting, at appraisal grade.** It makes many systems
   safe to touch.
3. **NP1 + NP2: scene mode and conversation threads.** Story volume will grow
   fastest with procedural story.
4. **WT1 + WT2: transition card and dormant panels.** These keep layouts
   stable across many worlds.
5. **VI1 to VI3: type, icon and number tokens.** They're cheap now and
   expensive to retrofit at 50 systems.

Nothing here is selected for a build.

## Round 5: expression, meta-knowledge, sandbox, battery and more (2026-10-14)

Weibao: "more to consider? other stuff and more? save and extend accordingly
Send out codex as usesful?"

Lanes U7 (maps, charts and economy views) and U8 (combat from one-on-one to
armies) were added to [the dispatch](gm/dispatch/ui-at-scale-2026-10-14/runs/SESSIONS.md).
Early returns: U3 counts 27 workspace module IDs in source. Most have no
save-based discovery predicate yet, so SC3 relevance gating has real work to
do. U2 is drafting cheat-window references. The rest are still running.

### W. Player notes and expression (AN)

**AN1. Notes on anything.** Attach a private note to any person, item,
place, recipe, cheat or journal entry. Notes show as a small mark and are
searchable through NV1. This is the cheapest memory aid for a game with
hundreds of entities.

**AN2. Player tags and colors.** Tag entities ("suspicious," "for the smith,"
"sell later") and filter any list by tag. This is RuneScape bank tags applied
to everything.

**AN3. Rename for yourself.** Give a custom label to a panel, a pinned view or
an entity you own (a horse, a sword, a settlement). The original stays in a
tooltip, and sealed names never get exposed by the rename UI.

**AN4. Export your story.** Export the journal, transcripts and notes as plain
text or Markdown, filtered to what you know. It's a reading record of a run.

### X. What you know versus what your character knows (MK)

In canon worlds Weibao often knows the books better than the character does.
The UI can respect both.

**MK1. Separate player notes from character knowledge.** Player notes (AN1)
are clearly the player's and never count as in-fiction knowledge, so they
never unlock dialogue or appraisal.

**MK2. Canon spoiler dial.** Per world: hide canon names until met, show
canon names you'd recognize, or full reader mode. The default hides until
met. This never affects sealed changed truths, which keep their own route.

**MK3. Divergence marks.** Where your run has drifted from canon, an optional
mark shows "this went differently," with no detail. It's opt-in per world.

### Y. Sandbox, assists and difficulty (SB)

**SB1. Proving Ground UI.** The testing world can expose toggles (spawn,
set stats, freeze time, show hidden values) inside that world's frame only,
labelled as sandbox. It reuses the panel kit; nothing leaks into normal
worlds.

**SB2. Assist dials.** Text speed, auto-pause on danger, extra confirms,
longer undo, hunger and fatigue strength. These sit in one assist page and
are labelled honestly. They're per-world adjectives, not one global
difficulty.

**SB3. Dev overlay.** A dev-only overlay shows panel IDs, discovery state,
update cost and region budgets. It pairs with the panel gallery (MC6) and is
off by default.

### Z. Laptop realities (LP)

**LP1. Battery mode.** Slower polling, no ambient VFX and fewer redraws when
on battery or when the tab is hidden. An idle game left open all day
shouldn't drain a laptop.

**LP2. Hidden-tab behavior.** Browsers throttle hidden tabs. Progress comes
from saved timestamps rather than ticking, so a throttled tab catches up
correctly, and the away digest covers it.

**LP3. Window resizing.** Snapping the browser to half a laptop screen
(about 683 px wide) should fall back to a sensible two-region layout, not
the mobile design. That keeps the standing direction: laptop half-width is
still laptop play.

**LP4. External monitor and back.** Layouts are saved per size class, so
plugging into a big monitor and unplugging restores each layout without
fighting (EN3, D4).

### AA. Telling hundreds of things apart (PT)

**PT1. Text sigils.** Each NPC, companion or settlement gets a short generated
glyph or two-letter mark in its accent color, stable for the run. Recognizing
a face in a list of 200 matters more than any portrait.

**PT2. Epithets.** Auto-epithets from known facts ("Mara the baker,"
"the limping guard") as display names until you learn a real name. This ties
to knowledge states.

**PT3. Recency and importance marks.** Show who you met recently and who
matters to an open goal, on every list.

### AB. Clipboard and sharing for yourself (SH)

**SH1. Copy as text.** Any panel or log selection can be copied as clean
text. The modular audit already notes body text isn't selectable today.

**SH2. Build card.** A screenshot-safe summary card of a character or run
(HU11 rules), for keeping or showing friends.

### AC. Quiet and loud states (QL)

**QL1. Calm mode.** Cozy stretches (farming, slow-life worlds) can mute
alerts below a threshold and soften the frame. Danger still breaks through.

**QL2. Crisis mode.** In a siege, chase or trial, the UI narrows to
essentials: actions, the threat, retreat. Everything else collapses with
summaries (ZN3) and restores afterward.

### Round 5 suggestions, ranked

1. **AN1 + AN2: notes and tags on anything.** Cheap, and they scale with
   every system.
2. **LP1 + LP2: battery mode and timestamp catch-up.** These matter for a
   laptop-first idle game left open all day.
3. **MK2: canon spoiler dial.** It matters because you know many of the
   source books.
4. **PT1 + PT2: sigils and epithets.** These keep hundreds of people
   distinguishable in text.
5. **QL2: crisis mode.** It keeps danger readable as panel count grows.

Nothing here is selected for a build.

## Round 6: subtle micro details (2026-10-14)

Weibao: "more to consider? other stuff and more? save and extend accordingly
Send out codex as usesful? Subtle micro stuff too?"

This extends [P4 small details](THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#p4-small-details-that-repay-attention)
rather than repeating it. Lane U9 (micro-interactions with sources) was
added to [the dispatch](gm/dispatch/ui-at-scale-2026-10-14/runs/SESSIONS.md).
Every motion item has a reduced-motion fallback that shows the final state.

### MI-A. Numbers and bars

| Code | Detail |
| --- | --- |
| MI1 | Gains count up briefly (under half a second), and a small "+3" ghost floats off the value once. Repeats within a second merge into one ghost. |
| MI2 | Hovering any resource shows its rate ("+12/hr") and time to a threshold ("full in 3h", "empty by dusk"). |
| MI3 | Bars carry tick marks where something happens ("at 30% you get dizzy"), shown only once known. |
| MI4 | Hovering an action ghosts its effect onto the bar: "Eat bread" shows the satiety bar's future fill in a lighter tone. |
| MI5 | Over-cap value shows as a separate overflow segment, not a bar silently stuck at 100%. |
| MI6 | Values from a low appraisal show "≈", and uncertain ranges show as a hatched band, not a false exact number. |
| MI7 | Color appears only near thresholds; a healthy bar stays neutral, so color always means something. |
| MI8 | Remote or old knowledge shows its age ("as of 3 days ago") and greys slightly over time (means principle). |

### MI-B. Words

| Code | Detail |
| --- | --- |
| MI9 | Buttons name the exact verb and object ("Eat bread," "Sell 4 herbs"), not "Use" or "Confirm." |
| MI10 | Count grammar is always right: "1 herb," "2 herbs," "no herbs." Pronouns follow the body and identity docs. |
| MI11 | Relative times ("2h ago") with the exact local-calendar time on hover. |
| MI12 | A new name is bold the first time it appears in the log, and plain afterward. |
| MI13 | The log stays in past tense and the actions list in imperative, so you can always tell what happened from what you can do. |
| MI14 | Blocked actions name the missing piece, and give a count once you know it: "Need 2 more wire." This extends P4's microcopy. |
| MI15 | Loading and empty states speak in the world's voice ("The ledger is blank"), while still saying plainly what to do. |

### MI-C. Hover, focus and clicks

| Code | Detail |
| --- | --- |
| MI16 | Tooltips wait about 300 ms and stay while the pointer moves toward them, so they don't flicker or vanish on the way. |
| MI17 | A tooltip never covers the thing it compares against; it flips to the free side. |
| MI18 | Double clicks within a short window are debounced, so a purchase can't fire twice. |
| MI19 | Irreversible actions can use hold-to-confirm instead of a modal, with a visible fill. The modal stays available as a setting. |
| MI20 | Hotkey hints appear on hover and focus (an underlined letter or a small key cap), never cluttering the resting view. |
| MI21 | The focus ring takes the world's accent but always passes contrast. |

### MI-D. Stability and flow

| Code | Detail |
| --- | --- |
| MI22 | No layout shift when numbers change; widths are reserved with tabular figures. |
| MI23 | Lists don't re-sort under the pointer. Sorting freezes while hovering and settles after. |
| MI24 | A log you've scrolled up stays put, and a "12 new" pill brings you back down. |
| MI25 | Each panel remembers its scroll and open disclosures across tab switches and refreshes (P4 input continuity, applied per panel). |
| MI26 | New list items arrive with a one-time soft highlight, then look like everything else. |
| MI27 | Very fast jobs show a minimum completion flash, so they don't flicker; long jobs use honest linear progress. |
| MI28 | Instant actions update optimistically, then reconcile with a short note if the result differs. |

### MI-E. Marks of change

| Code | Detail |
| --- | --- |
| MI29 | A small dot means "changed since you last looked," and it clears on view. It's distinct from the "needs you" mark. |
| MI30 | Hovering a stat lists what changed since you last looked ("+2 from the new boots"). |
| MI31 | A pinned item's header has a faint pin edge, so pins are recognizable in any panel. |

### MI-F. Idle and away

| Code | Detail |
| --- | --- |
| MI32 | The browser tab title shows the current job and progress ("63% Smithing"), and switches to a done mark when finished. |
| MI33 | An optional favicon badge counts "needs you" items. |
| MI34 | The first frame after returning is the digest, not a flood of animations replaying. Gains that happened while you were away appear as totals. |

### MI-G. Bodies, cheats and worlds

| Code | Detail |
| --- | --- |
| MI35 | Extreme hunger or exhaustion subtly desaturates the frame edges, not the text. |
| MI36 | An injury puts a small mark on the actions it affects ("slower: leg"). |
| MI37 | System-window cheats use their own text treatment (brackets, monospace, a soft blip), while bloodline powers stay in normal prose. This reinforces CS1. |
| MI38 | A cheat chip pulses only when it has something actionable. A cheat that goes dark (HU6) is silent, and that silence is the signal. |
| MI39 | Each world has its own separators, bullet glyphs and selection color, all small enough to stay readable. |
| MI40 | An optional dial for world-native numerals or units where the fiction supports them. Default is off. |

### MI-H. Sound and silence

| Code | Detail |
| --- | --- |
| MI41 | Different tiny ticks for coin, item, knowledge and danger, all quiet and each muteable. |
| MI42 | Repeated gains in a streak rise slightly in pitch and reset after a pause. |
| MI43 | A planned silence (ambience stops before an event) can be a cue, but never the only cue. |

### MI-I. Errors and delight

| Code | Detail |
| --- | --- |
| MI44 | A failed action nudges its button slightly (outline only under reduced motion), and the message says what to do next. |
| MI45 | Rare flavor lines tied to state ("Your boots are finally broken in") appear at most occasionally, never on every tick (P4 atmosphere). |
| MI46 | Run milestones (first year survived, hundredth meal) get one quiet line in the journal, not a popup. |
| MI47 | An NPC's sigil (PT1) shifts tint with their mood toward you, readable without numbers. |

### Round 6 suggestions, ranked

1. **MI4: hover ghosts the effect on bars.** It answers "what does this do"
   instantly, everywhere.
2. **MI22 + MI23 + MI24: no layout shift, no re-sort under the pointer, a log
   that stays put.** These fix the most common ways a busy UI feels broken.
3. **MI2 + MI3: rates and threshold ticks on hover.** These are the core of
   idle readability.
4. **MI32 + MI34: tab-title progress and a calm return.** They make idle play
   pleasant.
5. **MI9 + MI14: exact verbs and named blockers.** Cheap, and they hold up at
   any scale.

U9 will extend this with sourced references and rank the cheapest
high-feel wins. Nothing here is selected for a build.

## Round 7: U4 returns, interaction grammar and more micro (2026-10-14)

Weibao: "more to consider? other stuff and more? save and extend accordingly
Send out codex as usesful? Subtle micro stuff too?"

Lanes U10 (teaching and revealing many systems) and U11 (reading comfort and
typography) were added to [the dispatch](gm/dispatch/ui-at-scale-2026-10-14/runs/SESSIONS.md).

### U4 folded in: accessibility and input (AX)

Lane U4 is complete:
[ACCESSIBILITY_AND_INPUT.md](gm/dispatch/ui-at-scale-2026-10-14/ACCESSIBILITY_AND_INPUT.md)
and [report](gm/dispatch/ui-at-scale-2026-10-14/U4_REPORT.md). It sourced
Game Accessibility Guidelines, Xbox guidelines, WCAG 2.2, AbleGamers,
Cogmind, Qud, DCSS, NetHack, Mudlet, Alter Aeon and Fallen London. It
proposes AX1 to AX12, each with a default and a dial. The findings that
change this palette:

- **F1, F6 needs a fallback.** Browser or laptop keys can intercept F6, so
  NV6 needs a visible "Jump to panel" menu and a skip-to-actions link, plus a
  stable rule for where focus lands (AX1, AX2).
- **F2, digest versus raw log.** Screen-reader players often want repeats
  un-condensed. IN3's grouped digest must sit beside a raw chronological
  view, with speech detail and archive detail set separately (AX4, AX5).
- **F3, nested tooltips need real focus.** MC5 and MO5 need focusable Details
  buttons, a persistent inspector, and explicit Back and Close; a plain
  tooltip can't hold links (AX9).
- **F4, one knowledge filter feeds everything.** Visible text, accessible
  labels, search and speech all draw from the same filtered representation,
  so a screen reader can never read a sealed name (AX11). This strengthens
  EN4.
- **F5, separate claims.** Keyboard play, remapping, narration and readable
  text are distinct. Old patch notes don't certify a game's current
  accessibility.

Its proposed first slice is AX1 to AX5: navigation, focus recovery, one
binding list, quiet announcements, and the digest kept separate from the raw
log. Its open choices Q1 to Q4 stay in the report; each already has a
proposed default.

### AD. One interaction grammar (IG)

As systems multiply, the same gesture should do the same thing everywhere.

**IG1. One context menu for every entity.** Right-click (or a menu key) on any
person, item, place, cheat or log line gives the same core verbs: Inspect,
Pin, Note, Tag, Compare, Find in log, plus that entity's own verbs. Players
learn it once.

**IG2. Modifier table.** One table for the whole game. Shift means max
quantity, Alt means compare, Ctrl means open in the contextual slot, and so
on. The binding list (AX3) shows it and allows remapping.

**IG3. Quantity picker.** 1, 10, max, custom, and "keep N," as in "sell all
but 5." The same picker appears everywhere quantity applies.

**IG4. Multi-select in lists.** Shift and Ctrl select ranges or items in any
table (IN6) for batch actions, with the batch previewed before it runs (DP1).

**IG5. Panel header anatomy.** Every panel header follows one layout: icon,
known title, summary line (ZN3), unread mark, pin, menu. Players can scan any
panel the same way.

**IG6. Overflow counts.** Truncated lists say "+3 more" and expand in place.
They never cut off silently.

**IG7. Undo history.** A small list of recent reversible actions, each with
Undo, inside the Current work panel. It makes DP3 visible.

### AE. More micro (MI48 onward)

| Code | Detail |
| --- | --- |
| MI48 | Hoverable terms get a dotted underline and the help cursor. Action links look different from reading links. |
| MI49 | Codex links you've already read show a visited tint, so you can tell what's new. |
| MI50 | Pressing "?" shows the hotkeys available in the focused panel only. |
| MI51 | Negative numbers use a true minus sign. Tiny percentages show "<1%" instead of 0%. Durations read "1h 05m." |
| MI52 | The point where numbers switch to abbreviations (1,234 to 1.2k) is the same everywhere, and set in one place (VI3). |
| MI53 | Day dividers in the log ("Day 14, spring") and an unread divider ("new since you left"). |
| MI54 | Hovering a person's name in the log shows their sigil card: epithet, last seen, your note (PT1, AN1). |
| MI55 | Values at a cap show a small "full" label, so you don't have to read the number. |
| MI56 | Autosave shows a faint tick in the top strip; a failure is loud and stays visible (FR1). |
| MI57 | Copying shows "Copied," and the copied text is clean, with no icons or hidden text. |
| MI58 | Each tooltip shows its hotkey, if it has one, in a small key cap. |
| MI59 | Text selection color and scrollbar thumb take the world accent, at a readable contrast. |
| MI60 | Time of day tints the top strip faintly (dawn, noon, dusk, night), without touching reading surfaces. |
| MI61 | When a job finishes while you're watching it, its card holds the result for a beat before clearing. Nothing vanishes mid-read. |
| MI62 | Inputs keep their typed text if a refresh happens mid-typing (P4 input continuity, applied to notes and search). |
| MI63 | Search highlights the matched words in results and remembers recent queries. |
| MI64 | A first-time empty panel says what fills it and how ("Pin anything here with the pin icon"). |

### Round 7 suggestions, ranked

1. **AX1 to AX5 from U4.** Navigation, focus, bindings, quiet announcements
   and the digest kept separate from the raw log. Sourced, and it answers
   the scaling problem directly.
2. **IG1: one context menu for every entity.** Learn it once, use it for 50
   systems.
3. **IG5 + ZN3: one panel header layout with a summary line.**
4. **IG3: one quantity picker with "keep N."**
5. **MI53 + MI54: log dividers and person cards on hover.**

Nothing here is selected for a build.

## Round 8: lane returns, macro shape and inspirations (2026-10-14)

Weibao: "more to consider? other stuff and more? save and extend accordingly
Send out codex as usesful? Subtle stuff too? Macro and general stuff?
consider things to be inspired by and more? more to consider?"

Lanes U12 (inspirations outside games) and U13 (tabletop, paper and physical
inspirations) were added to [the dispatch](gm/dispatch/ui-at-scale-2026-10-14/runs/SESSIONS.md).

### Correction first

U1 found no evidence for a universal limit on panel or tab count. My earlier
numbers ("past about 20 systems," "30 entries," "about six values") are
estimates, not research. They're now marked that way in place. The
measurable things to watch are how many steps a common action takes, missed
decisions, and how fast the player recovers from a mistake.

### Lane returns folded in

**U1, game references**
([GAME_REFERENCES.md](gm/dispatch/ui-at-scale-2026-10-14/GAME_REFERENCES.md),
[report](gm/dispatch/ui-at-scale-2026-10-14/U1_REPORT.md)) covers 25 titles
with URLs. It confirms or corrects my round-3 GR table, which was written
from memory; read U1's file where they differ. Its own new codes reuse the
letters GR1 to GR12, so this doc calls them **U1-GR** to avoid a clash.

Findings that change this palette:
- **Reveal isn't navigation.** Hiding undiscovered systems helps early, but
  late in a run the player needs a stable index of everything known. U1-GR1
  proposes a known-surface index with an active-only dial.
- **The watch list isn't the attention queue.** A slim pinned overview of
  healthy known things (U1-GR7) sits beside the ranked queue. A due task
  stays visible among 100 healthy assets, and a healthy thing can still be
  watched.
- **Digest provenance.** The away digest reports gains, inputs spent,
  interruptions and elapsed time, and never implies progress in a paused
  system (U1-GR4).
- **Typed inspection.** A recipe, an item instance, a person and an action
  are different targets. The same icon must not open the wrong kind of
  entry. That was Oxygen Not Included's documented failure (WF1).
- **Text size isn't frame size.** Sunless Sea players lowered their screen
  resolution to get bigger text. Font scale, frame scale and tooltip size are
  separate dials (WF3).
- **Its top three:** a digest with costs and interruptions, stable known
  homes, and the watch overview kept separate from the urgent queue.

**U2, cheat and system-window references**
([CHEAT_UI_REFERENCES.md](gm/dispatch/ui-at-scale-2026-10-14/CHEAT_UI_REFERENCES.md),
[report](gm/dispatch/ui-at-scale-2026-10-14/U2_REPORT.md)) covers eight
fiction cases from the private novels and 13 games. It keeps Spread as the
default (CS2) and proposes a structured `surface` field with 13 kinds (V1 to
V13): system-window, body-modifier, item-interface, voice-channel,
records-view, perception-lens, exchange-view, boundary-choice, passive-rack,
relationship-view, embedded-controls, quiet and ui-layer. That fills in CS1.

Its first extensions to consider:
- **CU1, audience:** what the holder sees, what the party is told, what
  observers notice, and the player's own display mask are four different
  things. Screenshot-safe mode never changes what NPCs know.
- **CU4, capacity:** owned, equipped, selected and pinned counts are
  separate. UI room never limits the powers you actually have.
- **CU7, stacking trace:** each effect shows its source, trigger, order and
  applied amount, which makes IN1 work for cheats.
- **CU8, fourth-wall staging:** fictional file views and cracked frames stay
  inside the game. Exit, save and effects controls stay honest.
- **CU10, instances:** two shops or windows can share rendering without
  sharing stock, balances or recipients.

**U3, engine fit and wireframes**
([ENGINE_FIT.md](gm/dispatch/ui-at-scale-2026-10-14/ENGINE_FIT.md),
[WIREFRAMES.md](gm/dispatch/ui-at-scale-2026-10-14/WIREFRAMES.md),
[report](gm/dispatch/ui-at-scale-2026-10-14/U3_REPORT.md)) reads source and
draws 12 ASCII views. Facts from source:
- 27 module IDs exist, and many default discovery to true. Legacy roles are
  often CSS tint only.
- Layout v1 stores three columns and four docks. A real fourth column and
  pop-out or tuck-in need a layout v2 with migration.
- There are 16 `setInterval` sites. Hiding a panel isn't the same as
  stopping its renderer, and Beginning's polling render can repeat commands,
  so the gallery (MC6) must isolate commands and timers.
- Best value for cost, in U3's view: collapsed summary lines (ZN3), layout
  budget tests (EN1) and the contribution registry (SC2). The command palette
  and gallery follow.
- With the contextual slot sharing center width, Local actions keep about
  500 px at 1366×768 and about 790 px at 1920×1080. The density audit's
  143 px figure predates later source changes, so these are protective
  budgets, not a measured fix.

Its proposed slot priority: a boundary takeover beats combat, which beats an
explicit activity, which beats a pin.

**U8, combat at scale**
([COMBAT_AT_SCALE.md](gm/dispatch/ui-at-scale-2026-10-14/COMBAT_AT_SCALE.md),
[report](gm/dispatch/ui-at-scale-2026-10-14/U8_REPORT.md)) covers 13 sourced
references (Battle Brothers, Kenshi, Cogmind, Dragon Age tactics, FFXII
gambits, Mudlet and others) and proposes CB1 to CB11:
- **CB1:** one contextual encounter surface that always shows you, the
  selected opponent, exit, and at least five recent meaningful log lines.
- **CB2:** the view scales from a duel to two rosters, squads, then
  formations, with the selected individual always inspectable.
- **CB3:** a badge says what you command ("Self," "Party," "Formation,"
  "Army"), and orders you receive are separate from orders you give.
- **CB8:** exit stays near danger at every scale, with its cost and risk.
  Reachable never means guaranteed.
- **CB10:** enemy readings say observed, estimated or unknown, with source
  and age. No exact HP by default.
- **CB11:** auto and idle combat use the same receipts as watched combat.

Its next visual gate (not run) is a rebuilt desktop combat check with player,
opponent, retreat and recent feedback visible together.

**U9, micro details**
([MICRO_DETAILS.md](gm/dispatch/ui-at-scale-2026-10-14/MICRO_DETAILS.md),
[report](gm/dispatch/ui-at-scale-2026-10-14/U9_REPORT.md)) proposes MX01 to
MX32, each extending an MI row with a cost, dial and reduced-motion
fallback. Its cheapest wins are mostly about honesty and continuity, not
flash:
- an honest pressed state on every action, for pointer and keyboard alike;
- hover that never looks like selected or purchased;
- world accents kept out of prose;
- assist wording without shame;
- Escape peeling one layer at a time without cancelling work;
- focus returning to the right row after a detail closes;
- a completed row that can't turn into a different purchase on a second
  click;
- log growth that never moves the sentence you're reading.

Exact animation timings from the reference games stay MEMORY. Comfortable
timing needs its own desktop comparison.

**U7, maps and charts**
([MAPS_AND_CHARTS.md](gm/dispatch/ui-at-scale-2026-10-14/MAPS_AND_CHARTS.md),
[report](gm/dispatch/ui-at-scale-2026-10-14/U7_REPORT.md)) covers ten sourced
map references (Victoria 3, Stellaris, Dwarf Fortress Legends, Mudlet
mapper, Outer Wilds, Factorio, Elite) and seven chart references. It
proposes MP1 to MP8 for maps and DV1 to DV9 for data views.

Points that refine this palette:
- **MP1, semantic zoom.** Each rung asks its own question, keeps the selected
  thing, and returns with a breadcrumb. This sharpens NV4 and OI6.
- **MP4, two kinds of map.** A spatial text scene (with the confirmed Hanzi
  field kept as an option) where adjacency matters, and a room-and-exit
  graph (Mudlet-style) where connection matters.
- **MP6, three separate facts.** What you perceive, what you can reach and
  what you control are three facts, not one map. A tree can sense a footstep
  beyond its reach.
- **MP7, the cross-world atlas is a graph.** Known worlds and reported links,
  each with its latest report and local clock, not an invented physical
  plane.
- **DV1/DV2, numbers first.** "Stock 120; +6 per hour; observed over 2 hours"
  comes before any chart. A sparkline appears only where history exists and
  changes a decision (this refines MI65 and OI5).
- **DV6, remote values stay unknown.** Remote ledger rows show the last
  report and its age, and the game never adds up unrelated worlds.

### AF. Macro shape (MA)

**MA1. One sentence for the whole UI.** Proposal: *a traveler's desk.* The
self sits on the left, the work on the center, what you're handling now on
the side, and records on the right. Worlds change the wood and the
lamplight, not where things sit. Any new surface should make sense on that
desk.

**MA2. A diegetic frame for the whole interface (optional per world).** The
UI can be explained in fiction as the traveler's own notebook or ledger. The
Clerk keeps it, and it reshapes itself per world. That explains why the
frame changes between worlds, why unknown things are blank, and why a cheat
might crack it. Worlds that would rather keep a plain UI can switch it off.

**MA3. Information architecture map.** Keep one living diagram of question
homes, regions, the contextual slot and every surface's form and gate,
generated from the census (MC6) so it can't drift. It becomes the first page
any agent reads before adding UI.

**MA4. A UI phase plan matched to scope.**

| Phase | Scope | UI work that pays off |
| --- | --- | --- |
| Now | One realm, one prestige layer | ZN3 summaries, EN1 budget tests, SC2 registry, AX1-AX5 |
| A few worlds | 3-5 worlds, first cheats | Contextual slot, WT transition card, CS surface field, attention queue with digest |
| Many systems | Hunger, companions, crafting, research | Policies (MO3, TP2), tables (IN6), notes and tags (AN) |
| Many worlds and selves | Multiverse, broods, settlements | Cross-world ledger, character switcher, activity workspaces, layout v2 |

This only orders the ideas. It doesn't select any of them for a build.

**MA5. A review checklist for any new UI.** Before a surface ships, answer:
- its question home and form (PL1/PL2);
- its region and slot behavior (ZN);
- its discovery gate and leak check (EN4, AX11);
- its empty, locked and broken states (MC7);
- keyboard route and focus return (AX1/AX2);
- its summary line (ZN3);
- its cost at both laptop sizes (EN1).

This is MO11 made concrete.

**MA6. Measure, don't guess.** Following U1, track three numbers per
preset in later authorized checks: steps to the five most common actions,
decisions missed after a long absence, and time to recover from a hidden or
mis-docked panel.

**MA7. One UI owner per area.** Panel kit owns the per-panel contract, this
palette owns placement, the thematic doc owns look, and accessibility gets
its own owner once AX is selected. New UI ideas route to one of these instead
of starting another parallel doc.

### AG. Inspirations beyond games (OI, MEMORY; U12 and U13 verify)

| Code | Source | Mechanism | Transfer |
| --- | --- | --- | --- |
| OI1 | VS Code | Activity bar, side panels, bottom panel, status bar, command palette, contribution points with "when" clauses | Almost a template for ZN1 plus SC2: systems contribute views that show only when conditions hold |
| OI2 | Aircraft "dark cockpit" | Lights stay off when all is normal; only abnormal states light up | MI7 and SC5: calm by default, color means a problem |
| OI3 | Alarm management (ISA-18.2) | Alarm floods, priority tiers, shelving, rationalizing each alarm's purpose | The attention queue needs tiers, a snooze ("shelve"), and a check that every alert earns its place |
| OI4 | Bloomberg Terminal | Mnemonic commands, dense panels, keyboard first | NV1 command palette with short mnemonics for power users |
| OI5 | Tufte | Sparklines, small multiples, data-ink | Tiny inline trend lines beside resources; compare worlds or companions as small multiples |
| OI6 | Semantic zoom (maps) | Zooming changes what's shown, not just its size | NV4 zoom ladder: each rung shows different facts |
| OI7 | Shneiderman's mantra | Overview first, zoom and filter, details on demand | The order every big panel should follow |
| OI8 | Obsidian and Roam | Backlinks, daily notes, graph | The journal links both ways: a person's page lists every entry mentioning them |
| OI9 | Email triage | Archive, snooze, inbox zero | Attention items can be done, snoozed until a condition, or archived |
| OI10 | Slack and Discord | Threads, unread markers, mentions, per-channel mute | Story threads (NP2) and per-category mute |
| OI11 | Tiling window managers | Windows never overlap; keyboard moves focus between tiles | Supports ZN2's no-floating-soup rule and AX1 navigation |
| OI12 | Emacs modes | The same buffer gains different commands by mode | Activity workspaces (NV2) as modes over one layout |
| OI13 | Tabletop character sheets | Front page for play, back page for reference; playbooks per class | Per-body or per-world sheet templates; the play-relevant front page stays visible |
| OI14 | Blades in the Dark clocks | Segmented progress clocks for threats and projects | Text clocks for long goals, threats and faction plans, readable at a glance |
| OI15 | Board game player boards (Spirit Island, Gloomhaven) | Icon language, phase summary, reference cards | One icon grammar (VI2) and a pocket reference card per system |
| OI16 | Bullet journal | Index, signifiers, migration of unfinished tasks | Tiny signifier marks (done, moved, note) and goals that migrate across days or worlds |
| OI17 | Museum and airport wayfinding | Consistent signs, color zones, "you are here" | Region tints by role (panel kit) and a breadcrumb showing where you are on the zoom ladder |
| OI18 | Ops dashboards (htop, btop) | Dense live bars, sorting, tree view | A compact "running jobs" view for late game, sortable by time left |

### AH. More subtle details (MI65 onward)

| Code | Detail |
| --- | --- |
| MI65 | Sparklines next to key resources show the last day or season (OI5), visible only once you've noticed the trend in fiction or after a few days of data. |
| MI66 | A snoozed attention item shows its wake condition ("back when you reach town"). |
| MI67 | Backlink counts on people and places ("mentioned 12 times"), opening the list (OI8). |
| MI68 | Progress clocks in text, like `[■■■□□□]`, for threats and projects, with a hover showing what fills them (OI14). |
| MI69 | A "you are here" crumb on the zoom ladder ("Village › Valley › Realm 1"). |
| MI70 | Quiet hours: an optional time window where only danger interrupts. |
| MI71 | When everything is fine, the attention chip says so plainly ("All quiet"), and that calm reads as a reward. |
| MI72 | Unfinished goals carry a small migration mark when they roll into a new day or world (OI16). |

### Round 8 suggestions, ranked

1. **U1-GR1 + U1-GR7: a known-surface index plus a watch list separate from
   the attention queue.** Both are sourced, and they fix late-run navigation.
2. **U2's `surface` field (V1-V13) with CU4 and CU7.** It gives cheats a real
   home and makes stacking explainable.
3. **MA5 + MA3: the review checklist and the generated IA map.** These are
   the macro guards against drift.
4. **OI1 + OI2 + OI3: the VS Code contribution model with dark-cockpit calm
   and alarm tiers.** Together they show the overall shape the whole UI
   should take.
5. **U3's first three: ZN3 summaries, EN1 budget tests, SC2 registry.**
   These are the cheapest real steps, confirmed against source.

Lanes still running: U5, U6, U10, U11, U12, U13. Nothing here is
selected for a build.

## Round 9: U5 and U6 returns, crafting and rune surfaces (2026-10-14)

Request: Weibao's weaponcraft and runes message (recorded in USER_VISION).
The crafting design itself lives in
[Weaponcraft, runes and inscription](WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md).
This round records only the UI side and the two lane returns.

### U5, surface inventory
([SURFACE_INVENTORY.md](gm/dispatch/ui-at-scale-2026-10-14/SURFACE_INVENTORY.md),
[report](gm/dispatch/ui-at-scale-2026-10-14/U5_REPORT.md))

U5 traced 160 surface families from 15 considerations docs, each with
question, form, region, gate and promotion path. It covers 12
simultaneous-context cases, seven overloaded homes and 19 conflicts with
this palette. Findings that change it:

- **One contextual slot is too strict as an absolute.** A partner, an acting
  seat or a group report sometimes has to sit beside the action. Revised
  ZN2: one *foreground transaction*, with dependent decisions kept visible, a
  suspended draft and back stack, and explicit Compare or pop-out when two
  things truly need to sit side by side.
- **Late discovery can't mean one collapsed header per family.** Group
  families into sub-homes with one selected record and a filtered known-only
  index (this matches U1-GR1).
- **1366×768 is tight.** An illustrative center budget of location 48,
  work 48, action and quote 360, context 192 and gaps 24 comes to 672 px of
  680 px. One more 96 px partner card overflows by 88 px. This is
  arithmetic, not a measurement, but it means the laptop default must stay
  lean, and partner cards belong in the side regions or the contextual
  slot.

### U6, lists and records
([LISTS_AND_RECORDS.md](gm/dispatch/ui-at-scale-2026-10-14/LISTS_AND_RECORDS.md),
[report](gm/dispatch/ui-at-scale-2026-10-14/U6_REPORT.md))

U6 drew on 28 sources (SkyUI, RuneLite bank tags, the PoE stash, Morrowind
journal mods, Path of Building, Football Manager scouting and others) and
proposes LS1 to LS15. Findings:
- **Four separate dimensions.** Where an item is, what category it's in,
  your own tags, and lock or protect status are different things. Keep them
  as separate controls (this refines AN2 and IN6).
- **Three separate questions.** A digest, a causal record and a
  calculation breakdown answer different questions, and a digest must link
  back to its evidence.
- **Data shows its own freshness.** Scope and age sit beside the data, as
  in FM scouting reports. Never rank by hidden true values.
- **MO7 needs a correction.** Knowing a category doesn't mean you know how
  many things it contains. Show discovered counts, and show a percent only
  once a catalogue is learned (LS13).
- **The "30 cards" figure was a guess.** It's corrected here as in round 8.
  Stable selection and scroll anchors matter whichever list technique is
  used.

### AI. Crafting and rune surfaces (CF)

| Code | Surface | Form and home |
| --- | --- | --- |
| CF1 | Workbench (forge, inscription table, alchemy) | The foreground transaction in the contextual slot (revised ZN2). Your materials stay visible beside it, as the density audit asked |
| CF2 | Item detail with a part tree | Records or overlay, with the part tree as an indented list, each part showing material, condition and known properties |
| CF3 | Rune composer | Inside the bench. A grid or line of slots plus an atom palette of known atoms only, with a live preview at appraisal grade and capacity shown as a fill (`[■■■□]`) |
| CF4 | Breakdown with trace | IN1 applied to items: base, parts, materials, process quality, inscriptions, condition, each with its source (CU7) |
| CF5 | Compare | IN5 for two weapons, two designs or a design against what you hold |
| CF6 | Weapon voice | A log channel (V4), with its own panel only once bonded |
| CF7 | Maintenance | Rows in Current work for sharpening or recharging, plus "run until" (TP2) |
| CF8 | Design book | A Records tab of saved designs and discovered grammar, one click to queue a repeat (OV3) |

Subtle UI for crafting (extending MI):
- half-legible glyphs (`▒`);
- temper colors as prose;
- feel words at low appraisal;
- your maker's mark shown in shop listings;
- a scratched-out stroke kept in an item's history.

Nothing here is selected for a build.

### U10 and U11 folded in (2026-10-14)

**U10, reveal and teaching**
([REVEAL_AND_TEACHING.md](gm/dispatch/ui-at-scale-2026-10-14/REVEAL_AND_TEACHING.md),
[report](gm/dispatch/ui-at-scale-2026-10-14/U10_REPORT.md)) draws on 18
sourced references (A Dark Room and Candy Box source, Antimatter Dimensions,
Kittens, Factorio FFF, CK3 advice, Celeste, George Fan's GDC slides) and
proposes RT1 to RT16. It extends PC2 and FR4:
- **A reveal starts learning; it doesn't finish it (RT1 to RT4).** The first
  cue says why the system appeared and one thing you can do now. Help then
  grows in place. Reading, dismissing and doing are tracked separately.
- **Return help recalls your own state (RT6),** and a world switch teaches
  what's different (RT11). This matches NP4 and WT1.
- **Reminders are relevant, not nagging (RT9).** A forgotten system is
  mentioned only when it could help with what you're doing now, with a
  cooldown.
- **Every teaching route respects discovery (RT12, ranked first).** Help
  titles, search, completion totals, examples, recaps and patch notes all
  pass the same filter.
- **Fiction can teach (RT13).** A mentor, the Clerk or a system window says
  it, backed by the same facts as plain help.

**U11, reading and type**
([READING_AND_TYPE.md](gm/dispatch/ui-at-scale-2026-10-14/READING_AND_TYPE.md),
[report](gm/dispatch/ui-at-scale-2026-10-14/U11_REPORT.md)) proposes TY1 to
TY19 from 23 sources (Failbetter, inkle, Butterick, W3C spacing):
- **Filling the screen and comfortable prose don't conflict.** Panels use the
  whole laptop, while the prose region inside caps its measure. The first
  candidates to compare are 60 to 70 characters per line, 1.5 line height
  and paragraph gaps of about 0.7em.
- **Prose, logs and numbers get different rhythm.** Changing data uses
  lining tabular figures; prose may use oldstyle figures.
- **World flavor comes from attribution, document structure and trim, not
  from body text.** System fields can use monospace without turning every
  cheat into a terminal. This refines MI37.
- **Readers control time and position.** Prose and logs are instant by
  default, paced scenes are optional, and full plain history and stable
  backward reading are always available.

### U12 and U13 folded in (2026-10-14)

**U12, outside inspirations**
([OUTSIDE_INSPIRATIONS.md](gm/dispatch/ui-at-scale-2026-10-14/OUTSIDE_INSPIRATIONS.md),
[report](gm/dispatch/ui-at-scale-2026-10-14/U12_REPORT.md)) keeps OI1 to
OI12 and OI18 with corrections, and adds OI19 to OI32. Corrections to my
memory rows:
- **OI1 plus OI19, visibility isn't discovery.** VS Code's "when" clauses
  decide whether a view shows. Secrecy is a separate filter, with a distinct
  known-but-unavailable reason. Ranked first.
- **OI2, dark cockpit means quiet normal annunciation.** It doesn't reserve
  all color for problems. Role, world, selection and success color stay;
  failure states stay explicit. This qualifies MI7.
- **OI3 and OI9, five different verbs.** Read, acknowledge, shelve, suppress
  and resolve each need explicit clear and return rules. Raw history stays.
- **OI7, overview first is an entry, not a toll gate.** Direct links and
  remembered filters stay reachable.
- **OI11 and OI12, borrow mechanisms, not keymaps.** i3 allows floating
  windows, and Emacs modes aren't layouts. Take stable view state, focus
  return and enlarge-and-restore.

**U13, tabletop and paper**
([TABLETOP_AND_PAPER.md](gm/dispatch/ui-at-scale-2026-10-14/TABLETOP_AND_PAPER.md),
[report](gm/dispatch/ui-at-scale-2026-10-14/U13_REPORT.md)) draws on 24
sources (D&D 2024, PF2e, Blades, Mothership, Spirit Island, Gloomhaven,
Bullet Journal, FAA wayfinding) and proposes TT01 to TT16:
- **OI13, four pages instead of front and back.** Play, Build, Records and
  Reference. Real sheets span pages; one page isn't a scaling rule.
- **Stock, rate, reservations and committed capacity are shown separately**
  (resource boards). This refines DV1 and IN1.
- **OI14 and MI68, honest clocks.** A clock names its obstacle, shows what
  advances it, never promises a time when it's event-driven, and never leaks
  author-only plans.
- **Help at the decision.** A pocket reference with one canonical entity
  behind every topic link, and Back.
- **OI16 and MI72, migration is an optional review.** It keeps the same
  goal, with no forced daily copying, and its marks stay distinct from
  unread and danger marks.

U13's top order: TT01 (sheet pages), TT04, TT09 (stock and rate), TT06, TT07
(clocks), TT16, TT03, TT14, TT11, TT13. All 13 UI lanes have now reported.
