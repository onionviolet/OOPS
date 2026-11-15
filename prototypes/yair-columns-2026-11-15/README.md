# YAIR columns mock, 2026-11-15 (round 14, PS119-PS128; proposals, AD32)

Weibao on the round 13 mock: "meh, look at how yair does it, and the groupings, consider in depth accordingly?" This mock rebuilds the play screen in YAIR's four fixed columns at 1920x1080. It is a mock, not a build: nothing in the game changes until he looks.

Open `index.html`. Keys 1-5 pick the screen (Village, Fang Yuan, Crafting, Fight, Mapping). Press m for the mock, t for today's capture and y for the YAIR capture. The text comes from the game's own screens.

| File | What it shows |
|---|---|
| compare-village.jpg, compare-fy.jpg, compare-craft.jpg, compare-fight.jpg | The mock on the left, today (top right) and YAIR native (bottom right) |
| mock-village.png | Village home: Around you is one line in the location box; verbs in YAIR's order and icons; Ready now marks verbs ("Talk to someone · 1 new", "Try to craft something · 2 close") |
| mock-fy.png | Fang Yuan: the same four columns. His verbs (Feed your Gu, Practise, Hand in at the alliance board, Patrol the wolf tide) sit in Local actions, his Gu in the Skills box's Gu tab, and the story's choices at the head of Reports |
| mock-craft.png | Crafting replaces the actions box in place, with Back; its detail pane sits inside that box |
| mock-fight.png | A fight takes column 2's middle: the approach strip, the opponent card, then the auto view. Withdraw stays below as the actions box; column 1 shows Combat |
| mock-map.png | The PS125 mapping table (also below) |
| mock-footer-menu.png | The footer with Menu open: Keys, Shortcuts, Connection, then Tools for the development pages |
| native-yair.jpg, upstream-dev-town.png | YAIR's own screens (the native capture and our dev-town capture of upstream) |

## The columns
1. **You:** Character vitals, then Character & preparation (stats, Active effects, and the Stats/Bio/Equipment/Tools tabs), then Inventory & combat view.
2. **Place and action:** the time strip with the day strip under it, the location box (description, a "Here:" line, work and save status), then Local actions. Crafting, Mixing, a bench and a fight replace that box in place. Doing now is the box's head while work runs.
3. **Journal & received accounts:** Quests, Bestiary, Anthology and Data, then our Knows, Notebook, People, Worlds and Beginning. Below it, **Skills & practice:** Skills, Stances and Magic, plus each world's powers (Gu, Spells, Beyonder).
4. **Reports:** "Right now" (the next step, or the story's choices) at the head. The footer filters are YAIR's plus Ready and Story.

There is no top bar. Save, Export, Import, Options, Menu and Find sit in the footer as in YAIR. The development pages are under Menu > Tools.

## PS125 mapping

### Today's top tabs
| Today | Goes to |
|---|---|
| Stats | 1 · Character & preparation · Stats |
| Condition | 1 · Character & preparation · Active effects (opens the list) |
| Inventory | 1 · Inventory & combat view · Inventory |
| Journal (quests) | 3 · Journal · Quests |
| Data | 3 · Journal · Data |
| Knows | 3 · Journal · Knows |
| Notebook | 3 · Journal · Notebook |
| People, Travelers, Organizations | 3 · Journal · People (three filters) |
| Worlds | 3 · Journal · Worlds |
| Beginning | 3 · Journal · Beginning |
| Projects, Ledger, Capability runs, All panels | Footer · Menu › Tools |
| Connection | Footer · Menu |
| Settings | Footer · Options |
| Shortcuts | Footer · Menu › Shortcuts |
| Find | Footer · Find (and Ctrl+K) |
| Save, Export, Import | Footer, as in YAIR |
| Centre tab: Here | 2 · no tab: the location box and Local actions |
| Centre tabs: Crafting, Mixing | 2 · replace the actions box (verbs "Try to craft something", "Mix at the Village counter") |
| Centre tab: Keys | Footer · Menu › Keys |
| Centre tab: Skills (Fang Yuan) | 3 · Skills & practice |

### Here's panels and the frame
| Today | Goes to |
|---|---|
| Status line, pinned band | 2 · time strip |
| Day strip | 2 · under the time strip |
| Around you | 2 · location box, one line (people · stations · ways out), each count opens its verb |
| Ready now | Marks on verbs; Reports filter Ready |
| Doing now | 2 · head of the actions box while work runs |
| Next step, Story (data-here-story) | 4 · Reports "Right now"; filter Story |
| Ways out, Tingen crossing | 2 · Move somewhere else |
| Local life, Village practice, reading salvage | 2 · Take an action › its group |
| Furniture, A lived home | 2 · Your home (YAIR's sleep and storage verbs) |
| Reed-circle rung | 2 · Take on a challenge |
| Equipment condition, Living equipment | 1 · Character & preparation · Equipment |
| Optional pacing, Combat options | Footer · Options |
| Growth profile | 3 · Skills & practice · Skills |
| Iona's workshop ledger (PS111) | Footer · Menu › Tools |
| A life's day panel (Your day) | 2 · its acts as verbs; 3 · Skills · the world's power tab (Gu) |
| Tingen life panel | 3 · Skills · Beyonder; its acts as verbs |
| Fight card, opponent board | 2 · replaces the middle of column 2 |
| Inspector (left detail) | 1 · opens under Character & preparation |
| Journal mini (centre) | 3 · Journal · Quests |

**Findings, pages with no box:** none once Tools takes the development pages. Connection has no YAIR home; putting it in Menu is the proposal.

## Kept from rounds 11 and 12 (PS126)
- The pinned band becomes the column 2 time strip.
- Panel kinds (PS108) now place a panel into a box and tab instead of a Here tab: act becomes a verb, setting becomes Options, feature becomes Character or Your home, project becomes Tools.
- Crafting's detail pane sits inside the replaced actions box.

## Measured
Headless at 1920x1080, no box body overflows on any screen. Column widths: 372, 640, 470 and 374 px. The extra width over YAIR's 1366 goes to columns 2 and 3 (PS128).

## Open for the build
- New verbs (Feed, Practise, Hand in, Patrol) need their owners to group their acts under a verb with an icon. The life panel's acts carry the noun today ("Feed the Moonglow Gu"), so grouping can read it. Ask feature-ui before moving any node.
- The Ready marks read the ready rows registry by source. A row would need to name its verb so its mark lands on the right line.
- Not mocked: Klein's Tingen life. It uses the same four columns with Beyonder in the Skills box.
