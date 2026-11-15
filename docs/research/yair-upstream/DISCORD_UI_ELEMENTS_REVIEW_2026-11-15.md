# YAIR Discord media: UI elements and motion

2026-11-15. Research note for the play-surface rework (proposal codes PS131 to
PS168 in [the considerations](../../gm/dispatch/play-surface-2026-11-14/CONSIDERATIONS.md)).
The earlier pass ([F5 to F34](DISCORD_RESEARCH_2026-10-20.md), the deep review)
read stills and sparse frames. This pass watched every distinct animated file
at 1 to 2 frames per second and catalogued what the interface does, so the
rework can borrow behaviour and not only layout. It records what the clips show;
it changes no direction.

Frames, contact sheets and the sampled stills are private
(`private/discord-2026-10-20/ui-motion-2026-11-15/`, not committed). Source ids
below are Discord attachment ids for videos, shown with the second in the clip,
and the first ten characters of the object hash for stills in `catalog-reviewed/objects`.
Audio was not reviewed. At 1 fps, events shorter than a second can fall between
frames, so rows about fast motion say what the frames show and mark the rest as inference.

## Coverage

- 45 video and gif files on disk collapse to 14 distinct files by sha256: 12 mp4 and 2 gif.
- 2,588 webp files collapse to 524 distinct files. A header check (the animation flag and ANMF chunks) found 0 animated webp. Every webp is a still.
- Watched in full, frame by frame through contact sheets (2 fps up to 8.7 s clips, 1 fps beyond): all 12 mp4, about 201 s in total, plus all 6 gif frames.
- 10 of the 12 mp4 show the game interface: 1447613479736447077, 1367532073958637699, 1387741119412043776, 1395087024742076456, 1441349938872320030, 1494761585892261888, 1512870099802001508, 1544701442781356052, 1549105886847574129, 1549358452445290597. The other two mp4 are a developer to-do text editor (1263531058205429842, which then cuts to an unrelated music clip) and an unrelated pet clip (1480827105032929362). Both gifs are unrelated art.
- Still images: 333 png and webp objects in `catalog-reviewed/objects`. A palette filter flagged 83 as interface-like. Viewed in sheets: about 48 stills (18 from the largest by pixel count, 30 from the filtered set), so this part is a sample. It found the title screen, character creation, skill and item tooltips, dialogue boxes, crafting tab rows, combat log colours, the take-an-action list and the long-task card.
- Not observed in any clip: floating damage numbers, hit flashes, sound, drag and drop, rarity glow. Where our proposals mention these (PS153, PS155, PS158), the Discord media does not confirm them as upstream behaviour; they come from the developer's option list in the earlier research.

## Catalogue

Columns: DU code, element, source and time, what it does, our use, mapped proposal or NEW.

| Code | Element | Source and time | What it does | Our use | Maps to |
|---|---|---|---|---|---|
| DU1 | Number breakdown tooltip | 1447613479736447077 0.5 to 5.0 s | Hovering the XP bar opens a grey box: a global multiplier, then a breakdown of base, skills, books, then the hero's own multiplier. Skill tooltips (stills f2b12eedd8, bd1b4a755f) list gain, cost scaling, an id line, and each level's reward as a short line. | Any total we show (skill gain, craft chance, trade price) opens a "why this number" box listing its parts, so a player can see which lever moved it. | NEW (near PS166, PS134) |
| DU2 | Tooltip that holds still | 1447613479736447077 1.0 to 5.0 s | The box narrows and re-wraps as the pointer moves toward the right edge (1 to 4 s), then widens again (5 s). The developer treats this as a defect. | Size to content with a cap, clamp inside the column, flip to the other side near an edge, and stay put while numbers tick. | PS134 |
| DU3 | Craft row tooltip with live material counts | 1512870099802001508 3.0 to 6.25 s; still 1baec4683a | Over the "all" button: success rate in green, then each material as have/need, green when enough and red when short, then an XP line and a result line. Counts fall batch by batch while the pointer rests (68 to 48 to 23 to 3). | Same table in the crafting inspector, refreshed while it is open, with colour and word together ("short by 2"). | PS145, PS133 |
| DU4 | 5 / 10 / all batch buttons | 1512870099802001508 1.0 to 6.0 s | Each recipe row ends in three small buttons. A row that cannot be made greys out, buttons included. At 3.5 s "Iron ingot" brightens as soon as it becomes makeable, with no other change. | Keep the quantity trio; a row's readiness is a state change we can mark (PS154). A dimmed row keeps its slot and shows its reason on hover. | PS154, PS131 |
| DU5 | Batch stops at a material boundary | 1512870099802001508 3.75 to 5.75 s | Stock of the first wood kind runs down (5 to 3), then the next kind, then the row greys at 3 total. Success chance stays at 100% while the row is not makeable. | Say before starting that the batch ends when a material runs short; show chance and readiness as two separate things. | PS145 |
| DU6 | Two-level crafting tabs with pale locked tabs | 1512870099802001508 0.5 to 2.5 s; stills c05cdfaf2c, 0edae2ab4c | Category tabs wrap onto two rows (Tinkering, Butchering, Cooking, Woodworking over Smelting, Forging, Alchemy), a sub-tab row sits beneath (Items, Components, Equipment). Unknown categories show pale until learned. | Station tabs per box, with unlearned ones pale and named so the player sees there is more to find. | PS137, NEW (pale locked tabs) |
| DU7 | Verb list with icon, label and hover fill | 1512870099802001508 0 to 0.5 s; 1549358452445290597 0 to 1 s | A stacked list: Move somewhere else, Fast travel, Try to craft something, Talk to someone, Visit a merchant, Find work, Train, Gather, Take an action. Each has a small icon; the hovered row gets a lighter fill. | The Actions box keeps this shape; hover and pressed share one fill style. | PS157, PS131 |
| DU8 | Destination dropdown inside the verb list | 1441349938872320030 1 to 5 s; 1544701442781356052 0.5 to 1.5 s; 1549358452445290597 0 to 1 s | "Move somewhere else" opens in place and pushes the later verbs down. Each destination shows its travel time in brackets; dangerous places carry a small warning triangle. Hovered row lightens. | Destination rows with travel time and a danger mark, so a player sees the cost before committing. Reserve the space so the verbs below do not jump. | NEW (danger mark and cost in the row); PS139 |
| DU9 | Place box becomes the fight box | 1441349938872320030 2 to 3 s; 1549358452445290597 1 to 3 s | On entering a cave the description box turns into a list of fighters at once, the verb list turns into two controls (go back to the entrance with time, quick return home), and the Combat tab lights up. | In a fight the box swaps in place and the controls stay put; Back returns to the place. | PS147, PS93 |
| DU10 | Fighter rows with a second thin bar | 1441349938872320030 2 to 11 s; 1544701442781356052 1.5 to 6.5 s; 1549105886847574129 3 to 11 s | Each row: name at the right edge, a stat strip (attack, speed, hit, dodge, defence), a long red HP bar with "now/max hp" inside, and a thin purple bar beneath that fills differently per row. The purple fill tracks each fighter's own speed value (inference: a time-to-next-attack bar). | HP bar plus a thin attack-timer bar, so a fight reads as rhythm and not as a flat list. | PS155, NEW (attack timer bar) |
| DU11 | Fallen rows dim in place | 1441349938872320030 4 to 11 s; 1549105886847574129 2 to 12 s | A fighter at 0 hp fades to a dark ghost row at the same position; the rows around it do not move. A whole group can fade before the next group fills in (1549358452445290597 7 to 11 s). | Dim, do not remove, so the list does not jump while the player reads. | PS147, PS139 |
| DU12 | Damage shown as a darker remainder | 1549105886847574129 3 to 11 s | The lost part of an HP bar shows as a darker red, not an empty gap, and the number shrinks beside it (for example 2704/3967). Steps look discrete at 1 fps; any easing between samples is not visible. | Ease the bar toward its new value and keep the lost part as a short-lived darker band. | PS155 |
| DU13 | Fight list scroll and footer line | 1549358452445290597 2 to 40 s; 1544701442781356052 1.5 to 6.5 s | A long list scrolls under a white scroll handle while the footer stays fixed: "Clears: [n]" and "Enemy groups left: 24 / 25". Controls remain below the list. | Footer with a count and a clears number, and a list that grows without moving the controls. | PS147 |
| DU14 | Two-sided simulation panel | 1549105886847574129 2 to 20 s | A bordered panel covers the centre columns, allies at left and foes at right, each side a list of rows, with an Exit button at the bottom. It appears in one step and disappears at 13 s; a second one appears at about 14.75 s. | A skirmish or duel view with sides, for mass battles and allies later. | PS147; NEW (two-sided panel) |
| DU15 | Log filter tabs | 1549358452445290597 0 to 40 s; 1395087024742076456 0 to 13 s | The right column ends in a tab row: Levels and unlocks, Events, Crafting, Combat, Loot, BGM. | Reports keeps its filter row; the Combat and Loot filters exist so fights do not drown the rest. | PS149, PS158 |
| DU16 | A quiet log during a fight | 1549358452445290597 2 to 39 s | While 25 groups of fighters trade blows the log shows a single line, the entering line. Combat lines go to the Combat filter. Still b3c425eb1e shows that filter: hits on enemies in blue, defeats in green, a dodge in white. | Fights write a summary line to the main log and detail to a filter; colour and word together. | PS149, PS133 |
| DU17 | Time-of-day background | 1494761585892261888 7 to 14 s | The page background starts mid-blue at day. Near 8 s a dark navy gradient fades in with small yellow dots; a log line announces a newly unlocked night-vision skill at about 10 s. The caption on the source says the clip is sped up. | Background follows the hour; the first night can announce a skill or hint. | PS156 |
| DU18 | Star particles behind translucent panels | 1395087024742076456 0 to 13 s; still eed419708f | Dots of two or three sizes sit outside and show faintly through the panels. Over the 13 s they hardly move. | A restrained ambient layer; reducible by an option. | PS156, PS159 |
| DU19 | Sky strip with cool tint | 1387741119412043776 0 to 45 s | One strip: date, season, weekday, a bold Day or Night word, and a right-aligned temperature. Low temperatures (about 12 to 15 degrees in the clip) turn blue-cyan; others stay white. | Our time strip uses a word and a tint together; by default the tint is paired with the word. | PS135 |
| DU20 | Weather icon joining the strip | 1387741119412043776 30 to 45 s | A small cloud icon appears left of the temperature after the 30 s mark and stays. | Weather as one icon in the same strip. | PS135 |
| DU21 | Start screen with load status chip | 1494761585892261888 0 to 1 s; still f182471d27 | A purple gradient title, version lines, a large PLAY button and a green chip that says loading went well. | A load check we can show on first open of a life (save version, any repair). | NEW |
| DU22 | Character creation tiles | stills 4ac388e978, 91a28bd3b5, 02c9893154 | Race tiles in groups with headings; the chosen tile has a lighter fill; age and height are stacks of buttons; a dashed border frames the panel; a Confirm button at the bottom. A line says the choices are cosmetic. | Our beginning screens: selected state by fill and word, and a plain line on what a choice changes. | NEW (selected tile state) |
| DU23 | Level-up message | still 44d1992f6b | A centred block: the level reached, then a line per gain ("HP increased by 40"). | A short "what changed" block in Reports; a gained number may tick up briefly. | PS155, PS149 |
| DU24 | Item row marks | 1549105886847574129 0 to 2 s; 1367532073958637699 0 to 5.5 s; 1549358452445290597 0 to 1 s | Rows start with a star (favourite) and a slot tag in green brackets; named, rarer pieces sit in yellow; a quality percent in blue brackets follows. Per-row coin value at the right, with "take off" on worn rows. | Rarity by colour and word, a favourite mark, and the equipped row marked. Pair colour with text. | PS153, PS133 |
| DU25 | Purse line with coloured coin letters | 1367532073958637699 0 to 7.4 s | "Your purse contains: 10C 2W" with the letters in two metal colours. | One coin style per world, tabular figures. | PS132 |
| DU26 | Stack count changes in place | 1367532073958637699 6.0 to 7.25 s | "Stale bread x4" becomes "x3" at 6.5 s; the row, the purse and the cursor do not move. | Update counts in place; show "×3". | PS139, PS132 |
| DU27 | Item tooltip | still 32446c154e | Grey rounded box: name, a description line, quality percent, component line, basic stats, value in coin colour. | The inspector panel for an item, with owned count (PS144). | PS134, PS144 |
| DU28 | Skill list with collapsible groups | 1549358452445290597 0 to 40 s; 1512870099802001508 0 to 3 s | Groups (Crafting, Character, Combat and so on) have chevrons that flip when opened; each skill is a name with level and a green fill bar with a percent. Sort buttons: by name, level, progress. | Skills box with groups, a progress sort and a Learning now view. | PS146, PS131 |
| DU29 | Quest list with struck-through done items | 1512870099802001508 0 to 3 s; 1549105886847574129 0 s | Quest names stack as bold rows; a finished one is struck through and pale. A "Hide completed" box sits below. | Journal keeps done items in place, struck, with a hide option. | NEW (strike and hide completed) |
| DU30 | New quest line in the log | 1494761585892261888 1 to 14 s | The first log line announces a new quest, then the night-vision unlock line is added under it. | Reports lines for quest start and unlock. | PS149 |
| DU31 | Dialogue box | stills 9c2203de45, 8455d3a19b, 394ec7a915 | Speaker name as a title, an italic line, then choices as rows split by dotted lines; one box has a purple strip along the bottom. A back row has an arrow icon. | Dialogue in the actions box with Back as a row; a thin strip under a line can show time or tone. | PS93, PS138 |
| DU32 | Long task card | still 83eba717be | A task card: italic status line, a rate line ("1 base xp per in-game minute", progress counter, next level in hours), and a Finish button. | State the rate and how it ends before starting; Finish says what it keeps. | PS141, PS142 |
| DU33 | Footer bar | 1549105886847574129 0 to 20 s; 1494761585892261888 1 to 14 s | A thin bottom bar: Save, Export (amber in all frames of one build), Import, settings, version, help; a counter widget and two link icons at the right. | The footer carries save, import, export; a quiet state on Export can remind. | PS159; NEW (export reminder tint, inference) |
| DU34 | Active effects count | 1549105886847574129 0 s; 1549358452445290597 0 to 40 s | A small line under the stat grid shows how many effects are active (2 before, 4 in a later session). | Show the count, click for the list. | NEW |
| DU35 | Tab pair that wakes up | 1549358452445290597 1 to 3 s | The Inventory/Combat pair: Combat is greyed at rest and bright once a fight starts. | Tabs that are not relevant dim; a relevant tab takes the ready edge. | PS154, PS137 |
| DU36 | Hero card bars | 1447613479736447077 0 s; 1549105886847574129 0 s | Four bars in a stack: xp (orange), stamina (green), mana (blue), hp (red), each with centred text on the bar. A regen figure shows next to hp in one build. | Stat bars with text outline for contrast (PS133). | PS133 |
| DU37 | Enemy name tag on an image | still 6121071a16 | A creature picture with a small label in the corner. | Optional enemy portrait with a name tag. | NEW |

## Top 10 to build

1. DU1 breakdown tooltip for any total (NEW). It answers "why this number" with parts the player can act on.
2. DU2 stable tooltip: content-sized, clamped, flipped at edges (PS134).
3. DU3 live craft tooltip with have/need per material (PS145).
4. DU10 and DU11 fighter rows with an attack-timer bar and fallen rows dimmed in place (PS147, PS155).
5. DU8 destination dropdown with travel time and danger mark (NEW).
6. DU9 place box turning into the fight box with the controls held still (PS147).
7. DU17 time-of-day background with a first-night unlock line (PS156).
8. DU24 item row marks: favourite star, slot tag, quality percent, colour with word (PS153).
9. DU35 tab that wakes when relevant, with DU4 row readiness change (PS154).
10. DU19 and DU20 one sky strip with cool tint and weather icon (PS135).

## Gaps and cautions

- DU10's purple bar as an attack timer and DU33's export tint are inferences from sampled frames, not stated by the developer.
- Hit flash, floating text and rarity glow have no direct clip support (see Coverage). Treat PS153 and PS155 wording about them as our proposal.
- The clips are an early browser UI, so they show behaviours and structure to borrow, not a look to copy. DESIGN.md and the UI rules still decide the look.

## Still images, full pass (2026-11-15)

The first pass sampled the stills. This pass went through every still image in
`catalog-reviewed/objects` (contact sheets first, then each game-interface and
mockup image at 1:1). It records what the screens show and changes no direction.
Sheets, the per-image classification (with message dates) and the notes are
private, under `private/discord-2026-10-20/ui-motion-2026-11-15/stills-full/`
(not committed). Source ids are the first ten characters of the object hash;
dates are the posting month. Prose in the images (dialogue, flavour text,
names) is described, not copied.

### Coverage counts

- Distinct stills in `catalog-reviewed/objects`: 662 (524 webp and 138 png). The brief said 524, which is the webp count; the first pass said 333 png and webp objects, which does not match the folder. The other capture folders (`catalog-final`, `normalized`, `capture`, `reviewed-input`, `recovery-166`) hold no still that is missing from `objects` (sha256 set difference is 0 for each).
- Classes: game interface 326, developer tool or code 199, chat or social 73, art or meme 58, design mockup 6. Fixes made while viewing: the dated save-slot lists are browser memory snapshots from a leak hunt (Dec 2025 and June 2026), and the Behind/Ahead counters are a version-control sync widget, so both count as developer tool; two stills of another idle game's stat multipliers and inventory count as art or reference; the hardcoded location map and the on-hit slash reference and draft count as mockups.
- Game interface and mockup stills viewed at 1:1: all 332. Those under 394 by 276 px showed unscaled on the contact sheets, and 172 larger ones were re-rendered unscaled; one 1914 px glitch capture was seen at 78 percent.
- The first pass cited 18 stills by id and said about 48 were viewed. By date, the 332 interface stills split 85 (2024), 95 (2025) and 152 (2026), so the layout evolves across all three years.
- New rows below: DU38 to DU69 (32). Many add detail to an existing DU item and say so in the last column.

### Catalogue (new codes)

| Code | Element | Source ids | What it shows | Our use | Maps to |
|---|---|---|---|---|---|
| DU38 | Two-pane trade screen | 28bb728329, 9c871c61f1, c4bd40bc87, c3b6c9ef21, e33b940c07, a52ee22d73 | Your goods on the left and the trader's on the right, each row with 5, 10 and all buttons and a coin value. Rows you are moving take a green tint (yours) or a red tint (theirs). A footer shows a price percentage in amber (194 to 200 across shots, so it moves), a signed total ("Total cost", negative when you gain), then Accept (green), Cancel (red) and a full-width Exit below. Rows the pane will not price read "nothing". | One screen with both sides, a pending state before Accept, a price multiplier that is visible and explained, and Exit apart from Cancel. | NEW (trade has no surface); PS161 |
| DU39 | Options panel | a53ff7840f, e6e4a96269, e25ef0e121 | A bordered panel with a close X: checkboxes (bigger dialogue text, return to the last bed on defeat, remember log filters, do not switch out of inventory when a fight starts), buttons (load the backup autosave with its timestamp, import a save from a dev build, hard reset with a warning mark), a slider for the number above which values use scientific notation (shown at 1e3), and a separate "fluffy mode" checkbox. | Options as a short list of plain switches with the consequence in the label; destructive buttons carry a warning mark; a number-format threshold. | PS159; NEW (backup autosave, hard reset mark) |
| DU40 | Drop table with current and base chance | a15a2a946a, 13bfcef014, 02634a5260 | A three-column table: item name, current percent, base percent in brackets. Unknown items show "???" for the name while the numbers stay visible. A gather tooltip lists a known item and a "???" entry with its own chance. | Show what a pursuit can yield, with the rate now and the rate at base, and hide just the name of what the player has not found. | F23, F31, PS150, PS166 (stronger, with a real surface) |
| DU41 | Rarity ladder in the item tooltip | d88b1f16b3, 7d47eadf3b, 7a769a5629, e78c6d3285, c93f514130, 4a1529ae87, ca77e7993e, cfa84d7d57 | Quality is a percent plus a tier word in brackets, coloured by tier: white common, green uncommon, blue rare, pink epic, orange mythical (250 percent in one still). A table of ranges ties percent to tier (under 50 trash, 50 to 99 common, 100 to 129 uncommon, 130 to 159 rare, 160 to 199 epic, 200 to 250 top tier); the table's top name differs from the tooltip's, so the names changed between builds. No glow or halo appears around any item. | Rarity as coloured name, percent and word together; the table is a ready map from a number to a tier. | PS153, PS133 (colour and word, no glow upstream) |
| DU42 | Composite item tooltip with component lines | d88b1f16b3, 5e1bb68322, 7a769a5629 | Grey box: name, quality, slot, then two grey italic lines naming the base piece and the extra part joined by a plus, then stats (defence or attack, speed multiplier, agility, cold tolerance, evasion), a value with "[originally ...]" beside it, and for some pieces a "Combat level" bonus line. A shield shows "can block up to" with the base in brackets. | The inspector shows what an item is built from and its value before and after quality. | PS163, PS144 |
| DU43 | Recipe result preview with ranges | 630e5bd8bd, 9f7497c0b7, 7eb1f7064d | The craft tooltip ends with a framed card of the result: name, description, then quality as a range ("120 to 144 percent", the high end in blue), defence and agility as ranges, and a value range in two coin amounts. A "Material type" line sits on component cards. | Show a result's range before making it, so a player can decide whether the recipe is worth the materials. | DU3 detail; PS145 |
| DU44 | Equipment slot grid | 088fd62197 | A grid of slots: hat, vest, gloves, pants, shoes and a weapon filled by name; empty ring, off-hand, amulet, artifact and cape slots are labelled by slot name in italic. | Empty slots shown and named, so the player sees what can be worn. | PS131 (empty stays visible) |
| DU45 | Component picker | fe991c1108, a5ce88ba34, 8791b58808 | Collapsible sections ("Select a [glove interior]", "Select a [glove exterior]"), each listing stacks of one item by quality percent and count, sorted by quality. Inventory rows split into one row per quality percent. | A picker for each slot of an assembly, ordered by the number that matters, with counts. | PS163, PS165, F28 |
| DU46 | Auto-use toggle on a row | 875e637e55 | A consumable row carries "[use]" and a lit "auto" button beside it. | A per-item switch for use when needed. | NEW |
| DU47 | Favourites filter and star | aaa68201b6, e33222aa6d | The inventory filter row gains "Favs" after All, Equipment, Usable and Other; rows start with a star outline, filled for favourites. Worn rows are yellow and carry "take off"; other rows are white. Sorting is by name, value or type. | Correction to DU24: yellow marks worn items, not rare ones. | Detail on DU24; PS153 |
| DU48 | Four coin tiers in the purse | e33222aa6d, 579b27bb7c | The purse reads gold, silver, copper and a lowest "W" tier. Markup that leaked into two lines names the classes coin_copper and coin_wood. | One coin table per world, with the smallest unit shown. | Detail on DU25; PS132 |
| DU49 | Combat fight header with place tags | 8561ae17d4 | The place box title is the location (a cave), with small tags at the top right ("narrow", "dark"). The fighter rows sit below. | Place tags that tell the player what to expect from the fight. | PS147; NEW |
| DU50 | Shield icon in the fighter strip | a1acc127c5, c14ab1fc76, bf6425d47f | A small blue shield sits in the stat strip of an enemy row beside the hit figure, and in the hero's stance row beside a block number. A different strip format (attack as damage, speed, hit, dodge, defence) appears for animals. | A block mark in the strip, so a player sees which fighters can parry. | DU10 detail; NEW |
| DU51 | Stance row with the same purple bar | 827c2297f8, aad5ac6088, bf6425d47f, ef46d56993 | Under the hero card a stance row shows the stance name, attack power, attack speed, AP, EP, defence, and a purple bar that fills at its own rate. The same purple fill appears on fighter rows (DU10) and on the task card's progress strip (a task shows it half full). | Evidence that purple stands for time passing across the whole screen: attack timer, task progress. This supports DU10's inference. | DU10 detail (raises it from inference to a consistent pattern) |
| DU52 | Sparring fight with a named foe | ef46d56993 | The place box is retitled to the activity (sparring with a guard, heavy) and one fighter row appears with a large HP total; the hero card shows HP as a dark remainder (18.2 of 209). | A non-lethal duel as an activity, with the box retitled. | PS147; DU9 detail |
| DU53 | Stance table with Fav and Select | a44e58f3bc, e7b8ba2231, 2b58e85ec3, 5bd8c86a81 | A table with a Fav checkbox, a Select radio and the stance name, six stances. The Stances tab shows each stance skill as a bar with "Max!" at its cap. A log line announces a newly learned stance, repeated in a flood. | A stance picker with a favourite mark and one active choice. | PS146; NEW |
| DU54 | Bestiary, Anthology and Data tabs | e33222aa6d, ec16d4b444, 32f33ba14a, b942090ab7 | The right column's top row reads Quests, Bestiary, Anthology, with Data on a second row. The Bestiary is a list of creature names with a kill count at the right. A book row in the inventory carries a read action, and Anthology is probably where read books go (inference). The Data tab is empty in the sample. | A kills ledger per creature and a shelf for read books. | PS138 (an empty tab says what fills it); NEW |
| DU55 | Hidden skill names | c648878e7f, e7d7d5575d | A skill list shows "?????" in place of names while level and progress bars stay visible; the log reports xp gained to "?????" and later "unlocked new skill" with the name. | Progress without spoiling the name, the same pattern as DU40's hidden items. | F31, PS150; NEW |
| DU56 | Bonus levels from gear on a skill | 4d5e894764 | A skill row reads its level with a bracketed bonus ("level 32/60 [+33.6]") and the item tooltip carries a matching "Combat level" line; both are boxed in red in the posting. | Show where an extra level came from. | DU1 detail; PS148 |
| DU57 | Skill tooltip with a milestone list | f2b12eedd8, bd1b4a755f, 5ddcf5a38f | Beyond DU1: the xp figure is current over next in scientific notation, then gain and cost scaling, the id, a description, an effect line ("multiplies AP by 1.5"), and a level list ("lvl 3: +1 agl, a small xp bonus to another skill"). A footer on the same screen shows "Clears" and "groups left" counts. | The skill box says what each level gives, as a list. | DU1, DU28 detail; PS146 |
| DU58 | Net balance rows in the stat breakdown | 39b552c03a, 45a6507ea3, bd53e40e26, bfc2bf9a5c, fa897c08aa, fbb5a5e45d | Beyond DU1: flat and percent rows are separate (regen flat, regen percent, loss flat), each with its own base, skill and active-effect terms. Health shows an "Environment" term and ends with a "total health balance" line. A stat tooltip opens with one plain sentence about what it affects, before the breakdown. | A net line that adds the parts the player can change, and a one-line reason first. | DU1 detail; PS166 |
| DU59 | Effect list with time left and a tier ladder | 5ddcf5a38f, 141b30b0d3, 9dc595de26, ddbe2aed63 | The active effects box lists each effect with minutes or hours left, then its numbers (regeneration, speed, xp gain multiplier). Cold is a ladder of named effects (wet, very cold, freezing, hypothermia) with growing penalties, the worst touching dexterity, agility, regen and all xp gain. Poisons and food effects share the list. | Show the effects, their clocks and their size; tier names tell the player how bad it is. | DU34 detail; NEW (tier ladder) |
| DU60 | Seasonal unavailability with a reason | 1ed1de81f0, 7fb55fdd8e | A verb that is closed shows dimmed; its tooltip says it is not available this season and what it pays per hours. | A dimmed verb names its reason in the hover. | PS131 (confirms); DU7 detail |
| DU61 | Fast travel list | ea44eed1b3, 80d17b4d14 | A "Fast travel" header; each row is a destination with its travel time in brackets. Rows for beds carry a bed icon; the others end with a small X at the right. A fight box offers a quick-travel row to a favourite place. The X is likely a remove control (inference). | A short list of preferred destinations, with cost and a way to remove one. | PS164, DU8 detail |
| DU62 | Training and talk lists open in place | efe2e62e4f, 19093b8018 | The verb "train" opens a group of sub-actions below it, each with an icon; "talk" opens named people. A danger row ("enter the cave room") has a warning triangle. | Same grammar as DU8 for every verb that has choices. | DU8 detail; PS157 |
| DU63 | Activity card details | 59d87e6088, 82d7fb714e, f4e64cc0dd, 42432cb24a | The card shows what you are doing in italics, the xp rate (with a question mark when the skill is not yet named), "next earnings in" as a clock, a purple progress strip, and a finish button whose label includes what has accrued ("earnings: 2C 4W"). Markup leaked into one finish label in another build. | The finish button states what you keep (DU32), plus a clock to the next payout. | DU32 detail; PS141 |
| DU64 | Craft log with counts and level-ups | da3935892c, f9060daf3c, b74edde799 | One line per item made with its quality and xp ("created X [56% quality] (+7.5 xp)"), a level-up line between; a long batch is one line per step reading "created N out of M" with level lines in between. | Batch results as counted lines, with skill level-ups in place. | PS149, PS145 |
| DU65 | Reward summary lines and floods | 3e98f212dc, 361d3fa5eb, cf6dd135d1, 7dfca32315 | Yellow summary lines list loot with a count and a bonus count in brackets ("x172(+1)"). A long task ends with a "gained in total" line. Without grouping, one clear repeats "obtained additional 4000xp" for a full screen. | Group repeats; end a long task with one total line; the flood is the case PS149 prevents. | PS149 detail (F6) |
| DU66 | Log line colours and alignment | b3c425eb1e, 1350ce1aff, eadb25575f | Hits on the hero in red, hits on foes in blue (crits include the word), defeats in green, evasions in white; a "has missed" and "unlocked" lines in grey. An evasion line is right-aligned while hit lines are centred. | Colour with word (DU16) and side by alignment. | DU16 detail |
| DU67 | Loading text, version line and error box | 4d1c505279, 6b2ee9d7ef, 86990b8a27, 673b6fa03d, b1f8a13eda, e9771b7747 | The loading screen rotates a one-line message under the title and shows save version, current version and either "no changes since the last time you played" or a note on what changed. A failure gives a dark box with red-brown text that sends the player to the browser console. The green chip appears with the play button (DU21). | A load line that names what changed and a plain failure box. | DU21 detail |
| DU68 | Experimental location map | 206e635927, 5861ed20ee, 9ebd7d0039 | A node-and-arrow graph with named places, a legend of coloured dots for activities (rest, trade, woodcutting, mining, herbs, fishing, training, jobs, crafting), a "you are here" green node and a danger-rank key, closed by a red X. Two hand sketches place the village between mountains, a desert, forest and lake, a town region and a far river region. The developer calls the map hardcoded and wants a generated one. | The map's legend, the you-are-here node and a danger key; a sketch for how far places sit. | F17, PS151, PS164 |
| DU69 | Layout history and column set | 1350ce1aff, b942090ab7, 32f33ba14a, eed419708f, e33222aa6d, 6b2444dee8 | Apr 2024: three columns under two tab headers (Area/Combat and Character) with a monospaced log. Late Apr 2024 already has four columns: hero, place and verbs, bestiary and skills, log with filter tabs. Jul 2025 adds a star field. Jul 2026 shows quests, bestiary, anthology, data and a footer with Save, Export (amber), Import, settings, version, help and two link icons. | The four columns are not a recent shift; the box set is stable. | PS119 (supports); DU33 detail |

Remaining small details on existing items: a star beside a place name in the
place box (a marked place, 442 b88160cfe8, e33222aa6d); the Create-your-hero
screen went from dropdowns to button stacks and back across builds, and the
group headings were renamed (4ac388e978, 91a28bd3b5, b626dd10a1, DU22); a
nested quest with a checkbox and a kill counter under it, a hide-completed box
(5ea3ce817c, e82e85ac08, d2a1a46702, 7fb55fdd8e, DU29); a dialogue list that
scrolls with a grey handle and ends with a back row labelled Back or Nevermind
(e17d11b36b, ffb016ed5f, DU31); the name chip above the hero bars and an xp bar
that switches from thousands separators to scientific notation (25e59b47a2,
DU36).

### Updated top 10 to build

Boxes the play surface has no design for outrank extra detail on existing rows.

1. DU38 two-pane trade with a pending state, price percentage and signed total (no surface yet).
2. DU39 options panel: plain switches, backup autosave, hard reset with a warning, number-format threshold.
3. DU40 drop table with current and base chance and hidden names.
4. DU1 with DU58 and DU56: a breakdown for any total, ending in a net line, with gear bonuses marked.
5. DU41 and DU42: rarity by colour, percent and tier word, with the build lines in the item tooltip.
6. DU3 with DU43: live have/need counts and a result range before making.
7. DU2 stable tooltip (PS134).
8. DU10, DU51 and DU11: fighter rows with a timer bar (now a consistent purple pattern) and fallen rows dimmed in place.
9. DU8 with DU61 and DU62: destination rows with time and danger, fast travel with a remove control, every verb with choices opening in place.
10. DU59 effect list with clocks and a tier ladder, with DU55 hidden names in lists and logs.

DU9, DU17, DU24, DU35 and DU19 and DU20 from the first list stay good; they
drop out of the top 10 only because the rows above had no surface.

### Evidence for the unseen effects

- Hit animation: partial. Two code stills (544115c22b, 802abb2d4d, Dec 2025) show an enemy on-hit animation option and an on-start animation call per enemy, and the developer's message the same day says the animations were at first just on-hit. A reference image and a grayscale slash draft (2709bc4747, ec8744fb2a, Sep 2026) show the developer designing a slash mark. No still shows an animation drawn in the game, so a hit flash is not confirmed as an effect, just as an option and a draft.
- Floating damage text: none. No still shows numbers rising off a fighter; hits appear as lines in the log and as bar changes.
- Rarity glow: none. Rarity is coloured text with a bracketed tier word (DU41); no halo, edge glow or pulse appears on any item row or tooltip. PS153 is our proposal.
- Sound: none directly. The last tab in the log filter row is "Background" in the Apr 2024 stills and "BGM" from May 2026 (2822ac1470, 6b2444dee8). It may mean music, or a quiet-messages bucket; no still decides it. This weakens the sourcing of PS158 ("YAIR has BGM"): treat the tab's meaning as open in DU15 and PS158. This note does not edit the considerations file.
- Related motion cues in stills: bars keep a darker remainder (DU12) and a purple timer (DU51), and the temperature turns cyan when cold; none of these is a flash or a float.

### Gaps

- DU10 and DU51's purple timer, DU61's X as a remove control and DU54's Anthology are inferences from images, not stated.
- The 2026 captions often show test content (a test quest, test names); DU38, DU39 and DU56 may include developer test values.
- Audio and motion are not in stills. A still cannot show whether a bar eases, a tab pulses or a log line slides.
