# Mixing and alchemy representation (proposals, 2026-10-30)

Everything here is a proposal (AD32) and a draft: each choice is the current best and open to refactor or replacement with a reason (AD45). Owner of the mixing rules is `src/mixture_*.js`; this doc owns how what the player learns is shown. Rites and brewing tracks belong to the rituals session, LOTM potion data to sonnet-wave L4, workshops to the crafting session. Round 2 brief: `docs/gm/dispatch/ui-refactor-wave-2026-10-29/ROUND2_BRIEF.md` (uncommitted in the primary checkout when written).

## Round 1: design

**Player sentence (PRF2).** Working: "Boiled River bellleaf: steady health regeneration, slight agility drag. Next try: mix Emberseed with water alone." Cannot run: the existing blocker line ("Not enough Spring water free after holds").

**The gap.** The counter already keeps truth (hidden ingredient profiles) apart from knowledge (observed products), but the player only saw one prose card per vial. What a drink taught about an *ingredient* was not shown or reusable, and nothing said what to try next.

**Reference games** (known from play or docs unless marked inferred). Used for mechanisms, not looks.
| Game | What the player sees | Idea taken |
|---|---|---|
| Potion Craft | A map of effects; ingredients are points that pull the mix along it | Position on a map for *where this mix lands*. Not built: later slice (see unconventional option). |
| Skyrim alchemy | Eating an ingredient reveals one effect at a time; recipes show just the discovered effects, the rest are `?` | Known and unknown cells in an ingredient by effect grid. Taken directly. |
| Potionomics | Ingredient proportions against a target bar, with magimin readouts | Ratios drive the result: dose scales with the plant's share of the vial. Used in the maths, shown in words. |
| Atelier series | Synthesis grid with quality and traits that carry over | Quality bands on the vial, deeper traits later (inferred; not built). |
| Kingdom Come: Deliverance | Alchemy is a fixed step order (grind, boil, strain); a slip spoils the batch | Process as a step: steep vs boil already exists; the process row is the first step of a later step track. |
| Outer Wilds ship log (cross-genre) | A rumor graph that fills from what you saw, and points at what to look at next | A "next try" derived from gaps, stated in words. |

**Form per part (item 18).**
- *What an ingredient does:* a **table** (ingredient rows by effect columns). It is a comparison where the player scans both ways; a circle or tree would hide the gaps. The table is its own text form (UR37). Chosen over a figure because `figure.js` has no grid layout and no `guessed` state, and two sibling sessions already asked the coordinator for one (note `figure-guessed-state`). If a matrix layout lands in `figure.js`, this table is a consumer.
- *What to try next:* one **sentence with a button** ("Set up this try"). A list of options would cost reading time and invite the either/or the project avoids.
- *The vial:* a **card line** in words (potency band, side effects, minutes), not a bar, because there is one value per effect and the table already ranks them.
- *Steep vs boil:* **inline readings** in a cell ("steady (boiled) · strong (steeped)"); a separate track waits until more steps exist.
- Rejected: ring or radial form (no cycle here), a tree (no prerequisites), a map as the default (needs a coordinate meaning per world; kept as a later option).

**Discovery states (UIV6).**
- *known:* a plant was drunk alone in a vial under a process, or worked out by subtracting known plants from a mixed vial (arithmetic the player could do; the cell says "worked out from two vials").
- *guessed (≈):* seen only beside another plant, or a carrier that no vial separates yet; Spring water is required in each vial (a default of this counter's rules), so it stays "assumed to only dilute".
- *unknown (?):* not yet in a drunk vial (the default state of a fresh life).
- Each mark has a word beside it, and colour reinforces it (UR37, a default with no exception planned). The tooltip on a cell says why.

**Derivation, not a new saved field.** `src/mixture_discovery.js` is a pure projection of observed products only (inputs, process, dose). It never reads ingredient profiles or the hidden method, so it cannot leak truth (AD6-AD8); a test gives two states with different hidden truth and identical observations and asserts identical output. No persistence change, so no migration (FLR5 reduced to: the projection is recomputed after load from retained knowledge).

**One scale.** A plant's table word is its dose in a standard vial (one pack of it, one of water), and the vial card tiers the actual dose on the same scale, so one vial gets one word in both places (tested). Steep and boil readings sit side by side with the ratio ("boiling ≈1.5× steeping"). Responsive-method vials (revision 2 changes the health dose) are read separately by process and revision, never mixed into ordinary readings.

**Levels and depth (item 19).** Potency band (faint, mild, steady, strong), side effects (slight, noticeable) and duration per vial; strength is per plant *and* process, so the player sees what boiling changes; synergy shows up when a worked-out strength differs from a vial's total. Next level (draft): quality traits that carry across batches (Atelier), purity as the share of wanted effect over side effect.

**Later worlds and volumes (item 17).** `MIXTURE_EFFECTS` is a data list (id, dose key, label, tier words, side flag); `INGREDIENTS` gained `role` (`plant` or `carrier`) and `base`. A later world adds effect rows and ingredient rows; the projection needs no change. Checked: `src/hp_brewing_domain.js` (the Polyjuice-style bench, rituals-owned, read only) is a separate registered slice with its own state, formula owner and native transaction, so it shares nothing with the Village counter today; a bridge consumer is open (see Assays and benches). The LOTM potion rows (L4) were not read and stay open. Canon names stay out of tracked source (CLR3): fixtures use the generic Village ingredients.

## Assays and benches

- **MR1 (true properties act, known or not)** and **MR22 (repeating an identical observation teaches nothing new):** by default the table fills from distinct drunk vials, and re-drinking a vial already drunk changes no cell.
- **Drink effects and assays** use the same known, guessed, unknown grammar (UIV6, one shared wording under UR74); this table is the first consumer. An assay that reports an ingredient's properties would feed the same row shape (`{id, state, cells[]}`); the appraisal vocabulary (actual, observed, forecast) lives in `MEANS_AND_APPRAISAL.md` and is not yet wired here (ACCOUNT FOR NOW, small).
- **Polyjuice-style bench** (`src/hp_brewing_*`, rituals-owned): its own slice and panel, a track of timed steps. A bench that has steps shows them as a **track** (the figure `track` already exists), not as this table; what it can share is the discovery grammar for its ingredients. **MR29** (shared knowledge projection, separate product logics) supports a bridge adapter from the bench's observed facts to the same projection; the rituals session decides if and when. **MR9:** open slots change strength within a product family, which maps to the dose scale here.

## Boundary with LOTM potions (coordinator, 2026-10-30)

The Village mixing counter's own mixture model (`src/mixture_*.js`) stays the source for Village mixing. Potion formula, recipe and divination rows for LOTM belong to the sonnet wave's sw-rites lane; a LOTM potion view reads those rows and defines none here. The discovery projection is a consumer shape only: a later adapter can map observed facts from those rows into the same `{id, state, cells[]}` rows.

## What shipped (slice)

On the Village mixing counter (center mode `mixing`), above the ingredient rows:
1. "What you have learned" table, ingredient by effect, with known, guessed and unknown cells and words.
2. "Next try: ..." sentence ranked first (nothing drunk), isolate an unknown plant, separate a guessed plant, compare steep and boil, add the carrier, then blend; plus **Set up this try**, which fills the amounts and process.
3. "Last vial you drank: ..." from the saved `lastObservation` (the vial last drunk, in words).

Files: `src/mixture_discovery.js`, `src/mixture_ui.js` (render inside the signature-guarded block, so no work per tick), `src/mixture_state.js` (ingredient `role`), `styles/ui_tokens.css` (tokens only). Tests: `tests/mixture_discovery.test.js` (12 tests: the leak test, one-scale, ratio, revision separation and the panel). Evidence: `docs/representations/evidence/mixing/` (1920x1080 headless captures `1-fresh` to `5-after-try-4`, `walk.txt`; script `scripts/playtest/mixing-capture.mjs`). Route kind: fixture save `tests/fixtures/perf/mid.json`, fresh origin, rebuilt bundle, headless Chrome; the walk follows each suggestion four times. Human review: none (agent-verified, not human-reviewed).

## Round 2

Items 1-21 of the brief. Labels: ACT NOW (done), ACCOUNT FOR NOW, LATER/DELEGATE.

**1 Other games.** See the table above; the cheap adaptations (Skyrim grid, Outer Wilds next-look) are built.

**2 Fresh-player test.** First screen of the table: eight words need knowing ("regeneration", "agility drag", "steeped", "boiled", "carrier", "known", "guessed"). Terms are all in the cells or tooltips; "Ordinary method / Responsive method" is still unexplained jargon (ACCOUNT FOR NOW: rename or tooltip, shared with the rules owner). Fixed: the first-ever screen now says what to do first. Open: "Whole packs: water + plants" help line is dense, and the center mode title is duplicated ("Village mixing counter" twice, pre-existing).

**3 Space, split, density.** Table and next-try are the glance (compact, always on top). The long product list, queue controls and feedback grid stay below as detail; LATER: put the product list behind a disclosure and split Mix and Vials into two center tabs (UR42). At 1920x1080 the table, next try and ingredient rows sit in the first screen; the product list is below the fold (the capture shows this).

**4 Bars and chips.** Not needed now; a potency chip (`mild`/`steady`/`strong` with a word) could sit on each product line (ACCOUNT FOR NOW, cheap).

**5 Pop-outs.** The table is a useful second-screen reference while shopping or crafting; the renderer takes its own document nodes only in part (it builds with the global `document`). LATER/DELEGATE (Sonnet, small): pass the node's `ownerDocument` and register a pop-out. Done check: opens in `popout_host.cjs` and fills after a drink.

**6 Cheats and insight.** A revealed view would fill cells straight from truth and mark them "revealed (cheat)", never "known"; kept out of this slice because it needs a reader that touches profiles. Proposal: a separate `revealedMixtureDiscovery(owner)` in the cheat layer, cells with state `known` plus `source: 'insight'`, shown with a distinct mark. Sealed secrets: none here.

**7 Visual style.** Default is the table in Luminous tokens (muted italics for guessed). Alternative proposed, not built: paper-and-ink, a bordered recipe sheet where unknown cells are blank lines and known cells are hand-lettered; likely reads better for a study feel but costs a world skin. Neutral works through the same tokens; effects have no part here, so effects-off is identical.

**8 Use what we have.** Reused: observed `knowledge`, `mixturePresentation`, center modes, UI tokens. Not reused: `figure.js` (no grid, no guessed state), `scene_card.js`. A matrix needs a second consumer (UR79): the knowledge and relationship sessions already want one, so a shared `matrix` layout is the likely next shared piece.

**9 Unconventional.** A potion-map of effects (Potion Craft) fits later worlds with many effects; a diegetic version has the counter keeper say what they notice ("Mara's tonic, you drank it twice, you sag a little after"). Worth a later slice once effect rows exceed about six; needs generated prose (local model pass).

**10 Audit gaps.** Lead's run: reachable from a fresh Village life through the existing counter. Other seats: no failure row yet for "nothing observed"; empty state shows all unknown (works). Persistence: derived, verified by test that saved owner is unchanged. Accessibility: table is real HTML (keyboard and screen readers read it as a table); 21 px not measured (ACCOUNT FOR NOW). Performance: table has about 20 cells and renders only when the signature changes.

**11 Abstraction.** An ingredient by effect *ledger* (known, guessed, unknown cells) that any "what do I know about X" feature can reuse: spells by effect, creatures by weakness, NPCs by trait.

**12 Open for improvement.** Known limits: tiers are word thresholds tuned on seed values; the worked-out inference only handles one unread plant per vial; carrier verdicts need an unrelated vial. Likely refactor: move the table renderer to a shared matrix component once a second session needs it.

**13 Flourish.** ACCOUNT FOR NOW: a short settle glow on a cell that just changed from unknown to known, bound to the settled subject, off with effects off or reduced; reuse the Luminous glow tokens. Not built this round.

**14 Reports and center.** Report line proposal: "Drank Boiled mixture: steady health regeneration. Learned: River bellleaf (boiled)." with a link to the counter. Center: table first, actions next, product list demoted.

**15 Ability flourish.** Not this feature.

**16 Fold into existing UI.** The slice sits inside the existing mixing center mode and adds no surface. Proposal for the coordinator: the Crafting and Mixing tabs could share one "what you've learned" strip.

**17 Later volumes.** Covered above (data list, roles). Open: LOTM potion ladders (sequence ranks, digestion) are a different shape (a ladder) and are owned by L4 and rituals.

**18 Form.** Table chosen; reasons above.

**19 Levels.** Potency, side effect and duration shown; quality traits and purity are LATER.

**20 Semantic roles.** The table marks mean `known`, `guessed`, `unknown`, `side effect` and `carrier`. A world motif pack could restyle the cell mark: in a cold-iron alchemy world, hammered-metal stamps; in a tea-house world, brush-stroke ticks. The adapter and text form stay the same.

**21 Drafts.** The table is a draft. If a map-of-effects form proves better, the projection stays and only the renderer changes.

## Open items

- ACCOUNT FOR NOW: tooltip or rename for "Ordinary and Responsive method"; potency chip on product lines; settle glow on newly known cells; 21 px check.
- LATER/DELEGATE: pop-out (Sonnet, small); split Mix and Vials tabs (Sonnet, medium; done check: layout save and pin compatibility, UR17); effect map (Opus design, large); revealed view for cheats (Sonnet, small).
