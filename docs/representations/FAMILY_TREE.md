# Family tree, lineage, households, inheritance and heirlooms (RPX21)

Status: **proposal** (2026-10-30, UI refactor wave, one session per representation). Nothing here is accepted until Weibao says so (AD32). Extends the [UI audit](../audits/UI_DESIGN_CORE_AUDIT.md) representation table, which lists RPX1-RPX20; this doc owns RPX21.

| Code | Subject | Today (before this slice) | Proposed representation |
| --- | --- | --- | --- |
| RPX21 | **Family, lineage, households, inheritance and heirlooms** | An indented list of past lives, hidden until the first inheritance; qualities in a separate panel | MDL2 figure: generations as rows (pedigree), the line of played lives as a track, household kin and the heir the current law would name as edges, heirlooms and the succession rule as notes; known / guessed / unknown grammar per person (UIV6, proposed) |

## What the game already knows (PRF5 fit)

- `inherited_traits` slice ([lineage_traits.js](../../src/lineage_traits.js), [lineage_domain.js](../../src/lineage_domain.js)): a genetic graph of members with `sire` and `dam`. `foundLine` draws father, mother and you from the chronicle seed when a life chronicle begins; `heirLine` re-roots it at each heir and adds the untracked partner as "Their partner".
- Chronicle lineage ([family_tree.js](../../src/family_tree.js)): the frozen line of played lives (name, age at death, kin or apprentice) and relatives left by each, plus living kin read from relationship ties.
- Inheritance law ([heir_inheritance.js](../../src/heir_inheritance.js), `inheritance_law` domain): `resolveHeir` names the heir and any life estate at life end. Default `single-successor` consults no kin.
- Heirlooms ([heirloom_items.js](../../src/heirloom_items.js), [heirloom_compact.js](../../src/heirloom_compact.js)): unique named objects as inventory keys; the compact nominates one for the estate claim.
- Household fortunes ([household_fortunes_domain.js](../../src/household_fortunes_domain.js)): manor staff lives, not kin. Out of this figure; see LATER.

## Design round: four representations

| Option | What it shows best | Where it struggles |
| --- | --- | --- |
| O1 **Pedigree rows** (classic tree): generations as rows, parents above, children below, partner beside | Who descends from whom; unknown ancestors as visible gaps; reads at a glance | Wide households overflow a row; succession is not a shape |
| O2 **Household hearth**: the house at the centre, who lives under this roof on a ring, kin outside it, the heir order as a track | Who you live with and who would take the house; fits manors, guild houses and clans | Loses descent: a grandparent and a lodger look alike |
| O3 **Generations timeline**: each life a bar across the years, overlaps show who knew whom | The played line across centuries; deaths, births and who overlapped | Little about branches; nearly empty for a first life |
| O4 **Unusual: the estate thread** (follow an object): an heirloom or the house as the spine, each holder a bead, how it passed (kin, apprentice, sale, theft) on the link | Heirlooms and inheritance law as lived history; a stolen lamp is a branch | Not a family view on its own; needs object provenance (material lineage already records "passed" lines) |
| (noted) Fan chart: ancestors on concentric rings | Many ancestors compactly; native MDL2 rings, no new code | Self-centred; living kin and heirs have no place |

**Default (proposal): O1 pedigree rows, with O3's line of lives as a track under it and O2's succession as an heir edge and a note.** Reason: every life has parents from its first minute (`foundLine`), so descent is the one fact always present; the track and the succession note cost nothing extra in the same figure. Dial: a world whose households matter more than blood (a guild house, a sect, an orphanage, the manor) can start from O2 as its default; a long dynasty run can lead with O3; a world where one object carries the story (a cursed blade, a family Bible) can lead with O4. Each stays the same projection with a different layout, so a world chooses by data, not new drawing code.

## Known, guessed, unknown (UIV6, proposed)

- **Known**: the record or your own life holds it. Filled mark (●), the person's name when it is not a placeholder.
- **Guessed**: someone exists but what you hold is inference: the heir's untracked other parent, parents of a body you did not grow up in, a rumour. Plain mark, the word "(guessed)" in the label, **no stored name**.
- **Unknown**: a slot the line implies but nobody recorded (grandparents on a fresh life). "?" mark, the word "unknown", no name.
- The adapter drops the stored name for anything not known, before the spec exists, because the text form is read aloud and sits in the SVG description (AD6-AD8). A sealed parentage stays sealed by that rule.
- The figure primitive has no `guessed` state, so the word carries it (UR37). A shared `guessed` state would also serve RPX5 ladders; that is the coordinator's call (note left in the shared notes folder).

## Seats that know less

The adapter takes the seat's `knows` read from [observer_view.js](../../src/observer_view.js) and never branches on seat or the lead's id. Keys (proposal): `family.<role>` = `known | guessed | unknown` overrides one person (`f` mother, `m.f` father's mother, `kin.<id>`); `family.raised` = false lowers both parents to guessed (default reason: a seat that woke in a body it did not grow up in knows its parents by body memory only). Nothing writes these keys yet; a transmigration or amnesia start would set them at entry (WER answers name it). Dial: a world with strong body memory sets `family.raised` true for transmigrants; a foundling start sets both parents unknown.

## UR76 contract (proposed rule)

- **Home**: the existing Family panel (`family`, records role, layout spec "Side column beside You", opened from Other known panels). No new panel.
- **Shape**: MDL2 figure (`src/ui/figure.js`) with nodes placed by `at: [x, y]`, one track and notes; no change to the primitive.
- **States**: before a chronicle the panel is not offered and its empty text says "Begin a life chronicle to see your family here"; fresh life: you, two known parents, four unknown grandparents, the succession rule; after an heir: the line of lives as a track, the old life as a parent, the untracked partner guessed; crowded rows fold into a "N more" note; the text form is always shown under the drawing and the old line-of-lives list stays below it.

## Receipt (2026-10-30)

Files: [src/family_figure.js](../../src/family_figure.js) (new, pure adapter); [src/family_tree_panel.js](../../src/family_tree_panel.js) (draws the figure, shown once a chronicle exists); [src/ui/preview/fixtures/family_tree.js](../../src/ui/preview/fixtures/family_tree.js) (household and stranger fixtures, invented names); one import and one spread in [figure_gallery.js](../../src/ui/preview/figure_gallery.js); `styles/figure.css` linked from `index.html` (byte-identical line shared with sibling sessions); [tests/family_figure.test.js](../../tests/family_figure.test.js); [scripts/family_tree_browser.cjs](../../scripts/family_tree_browser.cjs).

Change surface (FND2): no core-owner file touched; `main.js` unchanged; no save-shape change (FLR5 does not apply: the figure reads existing slices, and a missing `inherited_traits` slice is drawn from the same seed `ensure()` would found it from).

Checks:

- `node --test tests/family_figure.test.js tests/family_tree.test.js tests/figure.test.js`: pass (focused).
- `node scripts/family_tree_browser.cjs <port> docs/representations/evidence/family-tree` after `npm run build` and `npm run build:figures`: 6 PASS, no page errors, headless Chrome at 1920×1080. Fresh life: Family not offered, then enrolled through the elder and the People notebook, Family shows the figure and text form ([panel](evidence/family-tree/01-fresh-life-panel-1920.png), [screen](evidence/family-tree/01-fresh-life-screen-1920.png), [text](evidence/family-tree/01-fresh-life-text.txt)). Heir crossing ([panel](evidence/family-tree/02-heir-panel-1920.png), [text](evidence/family-tree/02-heir-text.txt)). Gallery ([household](evidence/family-tree/03-gallery-family-household-1920.png), [stranger](evidence/family-tree/03-gallery-family-stranger-1920.png)).
- Full gates: see the commit message for `npm test`, `check:arch` and `check:rules` results on this branch.

AD43 floor: FLR1 build hash in the commit message; FLR2 route from a fresh life by earned steps (talk to the elder, begin the chronicle, open Family), browser-driven, MCP walk attempted and not finished (selector friction, reported); FLR3 shown with text form and an empty state; FLR4 consumer: the heir edge comes from `resolveHeir`, the same call the life end uses, under the live `inheritance_law`; FLR5 not applicable; FLR6 agent-verified, not human-reviewed. State: **implemented, at floor for the drawing; known gaps below.**

Known gaps: chronicle ancestors and `inherited_traits` members are separate stores with ids that do not line up, so past lives show by relation ("Father") in the tree and by name only in the track; relatives left by earlier lives show only in the list; no world writes the `family.*` knowledge keys yet; heirlooms read only the carried inventory, not the chest; the paid quality test is not reachable from a tree node.

## Next slice (LATER)

| Item | Level, effort | Done check |
| --- | --- | --- |
| Join the two stores: record the chronicle life id on its `inherited_traits` member at heir creation (needs a slice migration) | Runtime, sonnet medium | Past lives show their names on the tree; save, reload, Export, Import |
| Click a person: the existing paid test (`testLineageMember`) and a person card | UI, sonnet small | Test from the tree spends coins and updates both panels |
| First writer of `family.*` keys: a transmigration start sets `family.raised` false | Runtime with a WER answer | The stranger fixture's state is reached from a real start |
| O2 hearth layout for the manor household (staff and kin under one roof) | UI, sonnet medium | One world chooses O2 by data |
| O4 estate thread from material lineage "passed" lines | UI plus provenance read | An heirloom's holders shown in order |

## Round 2 (2026-10-30): review against other games, fresh eyes and the whole series

Brief: [round 2](../gm/dispatch/ui-refactor-wave-2026-10-29/ROUND2_BRIEF.md). Everything below is a proposal and the current best draft (AD45): open to replacement with a reason. Known limits: the figure primitive draws its radial area as a square, so a three-row tree leaves empty space above it; a generic tree layout in `figure.js` would fix that and is the likely next refactor (coordinator's file).

### How other games do it (item 1)

From a Sonnet summary written from memory, no web check; each "known" means known from play or docs as remembered.

| Reference | What it makes easy | Cost | Idea taken |
| --- | --- | --- | --- |
| Crusader Kings III dynasty and succession views (known) | Who inherits and why: the law's name sits beside the ordered heirs | Sprawling canvas, many overlapping laws | **Ranked heir list under a named law** (done this round) |
| Genealogy pedigree, descendant and fan charts; GEDCOM qualifiers such as ABT, EST, UNKNOWN (known) | Gaps at a glance: slots are fixed per generation | Siblings and in-laws hidden | **Fixed slots with a confidence word on every fact** (the fan form, done) |
| Dwarf Fortress legends (known) | Following one thread: an artifact's holders, linked | No overview | **Heirloom provenance as a dated holder chain** (LATER) |
| Rogue Legacy heir choice (known) | Choosing in seconds: each heir card says what they bring | No family over time | **Heir card with gains and costs** (LATER, with the quality test) |
| King of Dragon Pass clan ring; The Sims household (known; kin tag inferred) | Household as a small cast with jobs | Fixed seats; kin and non-kin look alike | **Household as seats, kinship as a tag** (LATER, the O2 hearth) |
| Massive Chalice bloodlines (known) | Planning generations: pairing previews the child | Micromanagement | **Preview what an heir would receive** before the life ends (LATER; the life-end screen already lists it) |

Our own history: no earlier OOPS UI doc covers family; the cheat rule CS1 in [UI at scale](../UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md) (bloodline cheats live as rows in the body or build view) governs the cheat view below. The abstraction underneath is a **graph with graded nodes** (people), a **ranked list** (succession), a **track** (lives) and later a **chain** (heirloom holders); each is reusable by other features.

### Fresh-player test (item 2), fixes done

- "Father (filled)" in the text form read as jargon. **Fixed**: known people draw plain with their initial; only unknown people carry a state word.
- The point (who inherits) was a note at the bottom of the figure. **Fixed**: a "Who would inherit" section comes first, with the law in one sentence and a ranked list, or a plain sentence when the law consults no kin.
- No intro said what the panel is. **Fixed**: one line under the heading.
- "?" and "≈" now explained in the figure summary.
- Still open: "Single successor" and "Frontier route" are names a new player has not met; the law's reason sentence carries the meaning.

### Form per part (items 18, 21) and density (items 3, 4)

| Part | Form | Why the others fit worse |
| --- | --- | --- |
| Who would inherit | Ranked list with a one-line law (compact, read first) | A picture hides order; a ring has no first place |
| Descent | Pedigree rows (default) or ancestor fan (alternative, in the gallery) | Rings suit cycles, not descent; a table loses who is whose parent |
| Line of played lives | Track | Dated and ordered; a tree repeats it |
| Heirlooms | One line each now; a holder chain later | A tree has no place for objects |
| Household (manor staff and kin) | Roster with seats later (O2) | Descent lines mean nothing for staff |

Density by frequency (UR42): Family is a rare-use records panel, so it shows everything at once; the text form stays open under "Read as text" (dial: closed by default once Weibao prefers the drawing). A relationship-bar style meter does not fit kinship, which is a fact, not a level; the warmth of each kin tie belongs to the relationship web session.

### Pop-out, cheats, style, flourish (items 5, 6, 7, 13, 20)

- **Pop-out**: not earned; the panel is rare-use. A notification is earned when the heir changes (a birth, a death, a law change): Reports line "Family: Pip would now inherit (Town custom)." LATER, through the Time and chronicle session's Reports shell.
- **Cheat or insight view**: a bloodline-sight cheat writes `family.<role>` = known with a source tag; the label then reads "Mother's father · Name (revealed)" so cheat-sourced knowledge is marked. Sealed parentage stays behind its discovery route because the adapter drops names for anything not known. Developer inspection stays in the dev inspector.
- **Alternative style**: the ancestor fan (`familyFanSpec`) beside the pedigree in the gallery. The pedigree reads better for a life with living kin; the fan reads better for a long line of ancestors and shows gaps more honestly.
- **Semantic roles**: every node carries `role` (self, ancestor, kin, heir). Flair sketch: in a noble or book world, ancestors as small heraldic shields, the heir with a crown mark and parent lines as a gilt thread; in a cultivation world, the line as a jade lineage tablet, unknown ancestors as uncarved tablets and the heir edge as a passed sword. A motif pack restyles roles without touching the adapter or the text form.
- **Flourish**: a soft settle on a slot when a test or a revelation turns a "?" into a name; nothing moves otherwise (UR38, effects off keeps the words).

### Unconventional option (item 9)

**The family register as a diegetic page**: the panel shown as a ledger page in the household's own hand, where unknown ancestors are blank ruled lines, guessed ones are pencilled, and a death adds a line in a new hand. It reuses the same projection with a document card (RPX13). Worth a later slice once document cards exist.

### Later volumes and larger casts (item 17)

Data-driven already: generations are rows from data, rows over six fold into a note, and laws are rows in `HEIR_LAWS`. Open: a dynasty run past three generations needs O3 (timeline) or paging by generation; a world with clans or sects needs the O2 hearth; book worlds with known canon families would set `family.*` grades from the cast pack (codes only in tracked files, CLR3). Checked: the `inherited_traits` cap of 64 members bounds the tree; the chronicle keeps 24 ancestors.

### Levels and depth (item 19)

A person's depth is how much you know of them: grade (unknown, guessed, known), then tested qualities (the Family qualities panel, one test at a time). Next: show "2 of 5 qualities known" on each person and link to the test, so depth is one click away.

### Fold into existing UI (item 16)

Proposal for the coordinator: merge **Family qualities** into **Family** as a second section, since both answer "what runs in my line". Saved layouts keep the `inherited_traits` id as an alias; a log line says "Family qualities now lives in Family" (UR13, UR17). Not done here: two panels' pins and saved layouts are involved.

### Gaps (item 10)

The SVG is not keyboard-focusable; the succession list, text form and line-of-lives list carry the facts for keyboard and screen readers. 21 px text not captured this round. Render cost: one SVG of under 100 nodes on rare open. Empty state covered; error state (a malformed line) falls back to the founding seed. Persistence unchanged.

### ACT NOW (done), ACCOUNT FOR NOW, LATER

| Code | State | Item | Level, effort | Done check |
| --- | --- | --- | --- | --- |
| FT1 | ACT NOW, done | Ranked "Who would inherit" list first, ordered by asking the law again without each chosen heir | UI | Browser proof asserts the section; test covers "then" order |
| FT2 | ACT NOW, done | Known people plain with initials; no "filled" in text | UI | Test asserts no "filled" |
| FT3 | ACT NOW, done | Ancestor fan alternative in the gallery | UI | Test checks father's side left, gaps empty |
| FT4 | ACT NOW, done | Semantic `role` on nodes; intro line; text form under "Read as text" | UI | Fixtures and capture |
| FT5 | ACCOUNT FOR NOW | Generic tree layout in `figure.js` to remove the empty square area | Coordinator, sonnet small | Tree fills its own height |
| FT6 | LATER | Merge Family qualities into Family | Sonnet medium | One panel; old pins resolve; log line |
| FT7 | LATER | Heirloom holder chain from material lineage "passed" lines | Sonnet medium | An heirloom lists holders in order |
| FT8 | LATER | Heir change in Reports | Via Time and chronicle shell | One line on a real heir change |
| FT9 | LATER | O2 hearth roster for the manor household | Sonnet medium | Staff and kin share one roster |

Model use this round: one Sonnet subagent for the reference-game study; the code changes were small edits to files this session already owned, so delegating them would have cost more than doing them.

Checks (round 2): `node --test tests/family_figure.test.js tests/figure.test.js` 13/13; `scripts/family_tree_browser.cjs` 6 PASS at 1920×1080, no page errors, local bundle sha256 69a88bed29947c47 (dist not committed); new gallery capture [fan](evidence/family-tree/03-gallery-family-fan-stranger-1920.png).
