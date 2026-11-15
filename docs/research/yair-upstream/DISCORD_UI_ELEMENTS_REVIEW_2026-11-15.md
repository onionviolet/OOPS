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
