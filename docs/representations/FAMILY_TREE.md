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
