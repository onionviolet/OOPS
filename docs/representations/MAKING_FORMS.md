# Making forms: hands-on to numbers, per craft (proposals, 2026-10-30)

Lane `bk-making-ui`, book UI wave. Everything here is a proposal (AD32) and a draft; any choice is open to replacement with a reason (AD45). Rules applied: AD46 (each world and craft chooses its form, no world is the template), AD5 and AD38 (default, dial, reason; mechanisms, not allow-lists), MR1-MR36 (especially MR4, MR10, MR16-MR22, MR31, MR32), UR37, UR63, CLR3 (counts and ids only, invented names in code), sealed secrets untouched. Target: desktop 1920x1080, Luminous Gothic and Neutral, 14/21 px, effects off; mobile deferred.

Weibao asked: crafting, potions, rune crafting and more later, or would it fold into numbers? The answer proposed here: **both, as a dial the player turns**.

**Owners this extends, not repeats.** Crafting glance and quality bands: [CRAFTING](CRAFTING.md). Effect ledger and assays: [MIXING](MIXING.md). Rite circle, making tracks, risk ledger: [RITUALS_AND_MAKING](RITUALS_AND_MAKING.md). Reference games (Potion Craft, Atelier, Cultist Simulator, Noita) are already weighed there; this doc cites them only for the one idea each lends. Per-domain mechanics: [CRAFTING_ENGINE round 4](../CRAFTING_ENGINE.md), [weaponcraft, runes and inscription](../WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md). Adapter seam and role map (main, tool, auxiliary, catalyst): bk-seams, `docs/design/CROSS_BOOK_SEAMS_LAW_AND_MAKING_2026-10-30.md` on branch `claude/bk-seams-5e4ce1`.

## 1. The dial: hands-on to folded

MR18 already says depth is chosen per activity (quick, guided, deep) over one resolver, and a comfort setting is not a penalty. MR19 says quick never beats what is known. This section turns that into one visible control and a reason for it to open up.

| Level | What the player sees | Opens when | Resolver |
| --- | --- | --- | --- |
| Hands-on (deep) | The steps as a bench or strip: place, mix, heat, inscribe. Windows, a ghost outcome band, named hazards | Available from the start. First attempt, any new recipe, any open-slot variant (MR9) | Same |
| Guided | Recorded steps run; the screen stops only at the decisions that change the result | A method is recorded (MR10: the steps that were actually demonstrated) | Same |
| Folded (quick) | One line per recipe: cost, time, quality bands with odds, batch count, a queue | The recorded method has been made well enough times (default 3, per-world adjective) and the world's maker can run it unattended | Same |
| Automated | The queue runs on its own against stock and orders; the player sets targets and reads a report | Folded plus a delegate, tool or standing order that exists in-world (MR21 scale and delegation) | Same, with the delegate's snapshot (MR23) |

**Rules of the dial.**
- Unlocking hinges on a *demonstrated recorded method* (MR10, MR22), not on XP alone. A repeated identical observation teaches nothing new, so grinding the same brew does not open it faster.
- **Unfolding is free by default and one click** ("Show the steps"). Hands-on can beat folded only through better choices (MR19): a new variant, a tighter window, a wider reagent choice, a rescued bad batch. Folded runs what is known.
- Mastery widens what folding gives, as MR21 lists: bigger batches, narrower variance, visible odds, delegation. The folded line shows the *player's own record* of odds (MR31), not the maker's hidden table.
- The dial is per recipe, not per craft. A familiar tonic can be folded while a new elixir at the same bench is hands-on.
- AD46: abstraction is a reward of progression (skill and knowledge are progression), and so is its opposite, the right to improvise. A world may fold at a different threshold or not at all.

**Where the default breaks (AD5: default, dial, reason).**

| Case | Behaviour | Reason |
| --- | --- | --- |
| Unique pieces: artifacts, high rites, named works, a first-of-kind invention | By default not offered folded; stays hands-on or guided (see the artifact mock). The dial's default top is guided; a world with a reason (a workshop that truly stamps identical pieces) can lift it | Each piece is one decision set; a batch of one has nothing to fold. In-world: no two are alike, so no recorded method repeats (MR7 far attempts make originals) |
| Trivial crafts (cutting a log, boiling water, a stock bandage) | Start folded; unfold is available if the player wants to see why | Steps have no consequence (MR17); showing them is busywork |
| Dangerous crafts where failure is costly (summoning, sealed artifacts) | Folded by default as a *checklist with the risk ledger*, not as a silent queue | The player must see the hazard before every commit; see [RITUALS_AND_MAKING](RITUALS_AND_MAKING.md) risk ledger |
| Worlds with no numbers in-world | Folded shows words and bands, not percents | See per-world nuance, section 5 |
| A recipe changed by a world law revision (MR30) | Reverts to guided once, with a one-line reason | The recorded method no longer matches the law |

## 2. Forms per craft family

Candidate forms: **bench** (hands-on figure with placed materials), **slot board** (ring or grid of fillable slots), **effect map** (a 2D field of properties; cf. Potion Craft), **timeline** (steps with windows), **composition grammar** (a strip of marks read pair by pair), **recipe sheet** (numbers and bands), **production queue**, **comparison table** (variants side by side). Existing renderers: `figure.js` (rings, slots, tracks, nodes, edges, notes), `craft_glance.js`, `rite_figure.js`, the mixing effect ledger. Missing shared pieces: layered flow layout and a matrix layout (also named in CRAFTING CF2 and MIXING round 2).

Counts below are rows with `kind` craft or potion in the merged extras files, `docs/research/novels/<book>/private/wb8-merged-2026-10-30/` (CLR3: counts only). They use a different method from the bk-seams counts (which count unique ids per family), so the two sets differ on purpose. LOTM has no merged folder in the main checkout, so its row count is not given here.

| Book | craft+potion rows | Largest labelled groups (worldKind) |
| --- | --- | --- |
| SS | 297 | weaving, memory weaving, enchantment, runic sorcery |
| ASL | 392 | potion and healing potion, alchemy, cooking |
| MoL | 150 | potion, transformation potion, spell formula, golem making |
| RI | 187 | Gu refining, fusion, refining |
| PR | 119 | elixir, drug, treatment |
| HP | 170 | potion, polyjuice, love potion |
| GC | 101 | sequencing, grafting |

The worldKind labels are free text and uneven; use them to pick which families a world needs, not as a taxonomy.

### Family table

| Family | Default form | Dial | Reason | Alternatives weighed | Reuses |
| --- | --- | --- | --- | --- | --- |
| Potions and alchemy | **Effect ledger plus a ghost-band bench**: pick reagents, see the known-effects table (MIXING), a ghost quality band before commit. Folded: recipe sheet with bands and a queue | Open slots (MR9) stay hands-on; known formula folds | Potions are about *which properties meet*, and the player learns by contrast (MR6, MR10) | Effect map (best when effects exceed about six; pairs with ledger); comparison table of variants (good for tuning); pure recipe list (loses discovery) | MIXING ledger, `craft_glance`, `craft_experiment_log.deduce` |
| Smithing and gear | **Timeline of heat-and-strike stages with a quality distribution bar**, folded to a quality-band sheet | Quality range from tier, skill, component quality (existing `get_quality_range`) | Gear has a real range; steps have windows only where a law reads them (MR17) | A pure hammer minigame (decorative, violates MR16); a parts slot board (fits assembly, not forging) | CRAFTING quality bar, figure tracks |
| Cooking | **Recipe sheet by default**, with a hands-on "improvise" bench for new dishes | Starts folded for staples, unfolds for new dishes | Mostly repeated, low stakes, many near-identical outputs | Timeline per dish (too heavy for a staple); slot board (pantry-as-slots) for meal composition | Craft glance, queue, comparison table |
| Runes, glyphs, inscription | **Composition grammar strip**: marks left to right, each neighbouring pair read, a ghost total, an ink cost, a coverage line of pairs tried | Strip length (maxLength), ordered pairs, discord as a cost not a block; folded = a saved talisman with a name and a swap list | Meaning is *composition and order*; swapping two marks can change the result; no invalid combo (MR6, MR8) | Slot grid (loses order); effect map (loses the word-like order); wand-style chain (same as the strip, larger-scale variant for spell programming) | `rune_grammar.js` (`readTalisman`, `coverage`, `learnByContrast`) and figure tracks |
| Enchanting | **Slot board on the base item**: the item as a ring, enchant slots filled with sources, a capacity bar and a conflict line | Capacity by item tier; conflicts shown as states | Enchanting adds to an existing object with limited places (budget, MR11 modes) | Strip (fits when the enchant is a written formula); effect map (many compatible effects) | Slot ring, conflict states |
| Rites and summoning | **Rite circle with risk ledger** (built). Not redone here | See [RITUALS_AND_MAKING](RITUALS_AND_MAKING.md) | Conditions and risk are the heart | | `rite_figure.js` |
| Gu refining and feeding | **Feeding board**: the host and its core on a ring, feeds as slots over days, centre shows the risk if committed now (mock) | Days per stage, fusion steps, hostile pairs | Refining here is about *compatibility over time*, not a single moment | Timeline (hides compatibility); effect map (compatibility is pairwise, a matrix later) | Slot ring, risk node, notes; a future matrix layout |
| Artifact making with risk | **Stage timeline with named hazards and a point-of-no-return marker**, not folded by default (mock) | Hazards reveal by teacher, failure or inspection; sealed artifact details stay sealed (GM33) | One-of-a-kind, so every stage is a decision | Bench with materials (good for assembly, hides stages); full numeric sheet (hides danger) | Figure tracks, `rite_figure.js` risk ledger |
| Tailoring and building | **Pattern or blueprint board** (a grid of parts and joins), folded to a parts list with an assembly time | Parts per piece; modules (MR8 composition) | Assembly is *parts on a substrate joined by rules* (the OV model in MAKING_RULES) | Timeline (poor for parts); recipe sheet only (loses custom fits) | Slot board, craft glance |

### Mocks (this lane, gallery fixtures)

All in `src/ui/preview/fixtures/making_forms.js`, rendered by the shared figure renderer in the figure gallery. Captures in `docs/representations/evidence/making-forms/`.

1. **Rune strip** (`making-rune-strip`): *computed* by `defineRuneGrammar` and `readTalisman` with invented runes. One ordered pair, one jar, a ghost total, ink cost, coverage.
2. **Reed tonic hands-on** (`making-tonic-hands-on`) and 3. **folded** (`making-tonic-folded`): the same invented craft in two modes; the folded odds sum to 100 and a test checks it.
4. **Feeding board** (`making-feeding-board`): ring slots plus a risk node.
5. **Unique artifact** (`making-artifact-risk`): stages with named hazards before commit.

Each is built from shapes `figure.js` already validates, so no live view files changed. Honest gaps: the captures are 1920x1080 with effects full and off in both themes, not 21 px; the strip's step labels repeat the mark name in the note (polish: note should read only "then tide: warmth"). These are figures with notes, not the final bench widgets; a grid, a table and a live queue need the shared matrix and queue components (ACCOUNT FOR NOW).

## 3. Discovery, failure and danger

| Part | Default | Dial | Reason |
| --- | --- | --- | --- |
| Unknown recipes | Blanks, not a locked list: unseen steps show as `?` slots; a demonstrated step becomes known (MR10) | Hint strength from a teacher, book or failure | A recipe is a record of what was shown, not a reward screen |
| Hints | A hint says *what kind of thing is missing* ("something that steadies"), not the answer | Source: a mentor names it; a text names the category; a failed batch names the side effect | MR31: no leaking truth |
| Failed attempts | Kept as knowledge: the attempt log lists what was tried and what it did, searchable by reagent | Detail by how closely the player observed | MR22: meaningful attempts teach; repeats do not. Failures are data, not punishment |
| Danger before commit | Named hazards with what the player has *seen* of each (never the hidden odds); a ghost band shows nothing spent (MR4) | A world can state numbers or only words | Matches the risk ledger in rites |
| Sunk cost | Say whether failure spends inputs, like the glance does ("Spent whatever the result") | Per-world (conserved identities, MR5) | Honest preview |
| Reveal after the fact | After a failure, the receipt names the likeliest cause among the known ones | | Teaches without spoiling |

## 4. Shared parts and little details

**Shared across crafts.**
- The ghost outcome band and the quality distribution bar (CRAFTING CF2).
- The reagent hover: from any stock row or reagent chip, a hover (and keyboard focus, UR) lists *what this does in the recipes you know*, counted from your record (MR31), with `?` for the untested ones. This is the "bk-forms" shared hover layer's job; this lane only specifies the content.
- **"What uses this" lookup** (JEI style): from any item, a list of known recipes that take it, known recipes that produce it, and untried pairings you could test; unknown ones are counted, not named.
- Recipe record panel: the steps shown and which are demonstrated vs inferred (MR10).
- The dial control: one row "Hands-on · Guided · Folded", with a line saying what the next level needs.
- The queue with an expected-output line, plus what is spent whatever the result.

**Per-craft parts.** Bench materials (potions), forge stages (smithing), strip and pair readout (runes), capacity bar (enchanting), feeding days (Gu), hazards and point of no return (artifacts), parts grid (tailoring).

**Little details worth the pixels.**
- Hover a mark in a strip: what the neighbours change.
- Swap preview: dragging one mark to the other side shows the new total in ghost form without spending ink.
- A "habit" line after mastery: the bench remembers (CRAFTING CF8).
- Words beside every mark and band (UR37); percents only where the world has them.
- 21 px: the strip wraps to two lines and the notes keep reading order.

**Cheat and insight views.** Marked *revealed (cheat)*, never *known*, in the MIXING style: rune meanings, true property lists and true odds fill in with a distinct mark and `source: insight`. In-world insights (a seer, an appraisal tool, a sealed text) use the same view with an in-world label. Sealed secrets stay out of every view (they appear by id and route only).

## 5. Per-world nuance (what numbers exist in-world)

| Question | Rule |
| --- | --- |
| Does this world have percents? | If the world states none (most prose-first worlds), show bands and words; numbers appear only for what the world's own tools measure |
| Is quality exact, graded or continuous? | The world declares it (MR11); the glance and folded sheet follow the declaration |
| Do crafts have time? | If so, Time is real and a queue is real; if instant, there is no queue to build |
| Is the maker a person or a force (a Gu, a spirit)? | The board names the maker's snapshot (MR23) |
| Does danger exist? | If a world never punishes, the hazards row is omitted, not filled with fake risk |

## 6. Proposed changes to live views (owners: representation sessions under the General UI coordinator; this lane edits none)

| Owner | Proposal | Level | Effort | Done check |
| --- | --- | --- | --- | --- |
| Crafting | Add the dial row ("Hands-on / Guided / Folded") above the glance; the folded row reuses the glance grid with odds bands | UI + data | M | Unlocked after 3 recorded good makes; unfold persists per recipe; save, reload, import keep it |
| Mixing | Reagent hover from the ledger; "what uses this" lookup from any ingredient row | UI | S | Hover lists only observed effects; unknown counted as `?` |
| Rituals | Add the "folded as checklist" for repeatable rites (risk ledger stays) | UI | S | Folded rite still shows the ledger before commit |
| Runes (new) | A view for `rune_grammar.js`: the strip, pair readout, ghost total, ink cost, coverage | UI | M | The same data as the mock; swap changes the readout; nothing spent by looking |
| Shared | A `matrix` layout and a `layers` layout in `figure.js` or beside it | shared | M | Two consumers use each (MIXING ledger plus Gu compatibility; CRAFTING flow plus tailoring) |
| Shared | Queue component with expected-output line | shared | M | A queue of 12 shows its time, spend and expected bands |

## 7. Status tables

### ACT NOW (done this lane)

| Item | Level | Evidence |
| --- | --- | --- |
| This doc | doc | here |
| Five gallery fixtures including the computed rune strip and the paired tonic modes | fixtures | `src/ui/preview/fixtures/making_forms.js` |
| Focused render test | test | `tests/making_forms_figure.test.js` |
| Captures at 1920x1080 | evidence | `docs/representations/evidence/making-forms/` |

### ACCOUNT FOR NOW

| Item | Level | Effort | Done check |
| --- | --- | --- | --- |
| Persisted dial per recipe (mode, times made well, recorded method id) | mechanism + state | M | Migration or compatibility decision; save, reload, export, import keep it |
| Recorded method distinct from "known formula" (MR10 data shape) | engine | M | A learned method stores the demonstrated steps and conditions |
| Odds from the player's own record | projection | S | Folded bands match the player's logged results, not hidden truth (MR31 test) |
| Rune view wired to `rune_grammar.js` and the pair record `magic.runes@1` | UI | M | Swapping runes changes the readout; coverage matches the record |
| Hover and "what uses this" content spec handed to bk-forms | spec | S | bk-forms adopts the content rules |

### LATER / DELEGATE

| Item | Level | Effort | Done check |
| --- | --- | --- | --- |
| Effect map for worlds with many effects | UI | L | Opus design; map reads from MIXING data |
| Pattern board for tailoring and building | UI | L | A parts grid with joins; assembly time computed |
| Delegated queues (apprentice, construct) with a report | mechanism | L | MR23 snapshot used; report lists results and spend |
| Diegetic prose for hints and failure causes | content | M | Local-model pass; no leaks |
| Gu compatibility matrix | UI | M | Needs the shared matrix layout |

## Open items

Everything above is proposed. The dial's threshold (3 good makes), the label words, and the choice that unique pieces do not fold are defaults; each world sets its own and may drop any of them with a reason.
