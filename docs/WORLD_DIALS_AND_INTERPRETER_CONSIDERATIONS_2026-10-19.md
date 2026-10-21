# World dials and the rules interpreter: considerations, 2026-10-19

Weibao, 2026-10-19: "Constitutions other stuff and more? Consider how world details
ties into things and more and how that turns dials? do we need an interpreter?
Crafting, other stuff? More to consider? Anything missing", then "use the advisor to
consider and then send out accordingly".

**Status: proposal.** Nothing here is accepted or built. Codes **WDI1 to WDI40** are
this palette's (prefix checked unused by repo grep 2026-10-19; `WD`, `DIP` and `D`
are taken). Rules applied: AD5, AD7, AD8, AD38, AR1 to AR16, GR1 to GR17, MR, CX1 to CX8,
sealed secrets. Rounds are appended, never rewritten. Repeatable via the
[core audit](audits/WORLD_DIALS_AND_INTERPRETER_CORE_AUDIT.md).

## Owners this links (read, not restated)

| Owner | What it already says |
|---|---|
| [Engine expansion, world profiles](ENGINE_EXPANSION.md#world-profiles-elements-and-small-interactions) | A versioned world profile declares energies, fields, bodies, routes, institutions, information access, danger and time policies |
| [Genetics palette](GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md) (AB7, G53 GD3) | "World dial profile": per-world settings for every Default + Dial row; capacity budgets are local profiles |
| [Procedural status, P9](PROCEDURAL_GENERATION_STATUS_2026-10-13.md) | 40 per-world generation profiles with canon reservations and source tiers |
| [World cards](WORLD_CARDS.md) | Dials appear in prose (for example the edge carry dial) |
| [Crafting engine](CRAFTING_ENGINE.md) (WR1 to WR10, GT) | What a world's crafting rulebook declares |
| [Rulebooks for worlds](RULEBOOKS_FOR_WORLDS_AND_GM_CONSIDERATIONS_2026-10-14.md) (GM7, RB) | Rulings ledger; freeform intent interpretation is a separate, authored-verbs-first problem |
| [Ideaboard scale plan](IDEABOARD_SCALE_PLAN_2026-10-19.md) | Same-day proposal: worlds as overlays on packs, director view that edits dials as a revisioned pack overlay (WA10) |
| `src/rule_modules.js`, `src/check_rule_pack.js`, `src/effect_dsl.js` | Live code, read below |

## Corrections to the chat answer that preceded this file

- **WDI1. A world-profile file is not new.** I called it a gap (M1). Engine expansion,
  AB7 and P9 already specify world profiles. The open question is whether profiles
  and dials share one record, not whether to invent one.
- **WDI2. The interpreter exists in part.** `resolveRuleEffects` (`rule_modules.js`
  lines 96 to 113, SHOWN) is pure and returns detached proposals, never owner writes.
  Effects have `kind` (parameter, gate, observation, consequence) and `combine`
  (replace, add, multiply, min, max, veto, exempt). Values are exact rationals.
  It returns a receipt listing applied, exempted and superseded effects. That is a
  dial resolver with a "why this?" record already.
- **WDI3. What bounds it today (SHOWN).** The fact vocabulary is a closed map of five
  facts (`RULE_FACTS`). `RULE_TARGET` is one string. The receipt's resolver id is the
  literal `village.mix@2`. Layers are named (core, world, region, actor, director) but
  I read only the resolver, not how `order()` ranks them. `effect_dsl.js` states it
  has no evaluator and is a D&D-shaped authoring contract.
- **WDI4. N1 to N7 not confirmed new.** A keyword grep of top-level `docs/*.md` found
  no match for cheat provenance, hash migration, cross-engine determinism, reroll
  leakage or what-if forks. That is weak evidence (wording varies, and docs in
  subfolders were not searched). Lanes should re-check before any is called new.

## Round 1, 2026-10-19

### WDI-A. How world details become dial values

| Code | Consideration | Default | Dial and reason |
|---|---|---|---|
| WDI5 | Dial = typed, named setting with default, range, reason, cost and a named reader | Register each dial in one registry; no dial without a reader (GR12) | Registry scope per domain; a dial nobody reads is prose |
| WDI6 | Dial values come out of the existing resolver | Express a dial as a `parameter` effect on a target; the receipt is the explanation | Targets grow from one to a short list per consumer |
| WDI7 | Facts feed predicates | Open the fact vocabulary through a registry with namespace, owner, type and a truth-or-knowledge flag | Governance cost rises with fact count |
| WDI8 | Mechanism facts, not names (AD38) | Predicates read what a thing does (burns, is ingested, carries qi) | Name-based predicates reappear unless linted |
| WDI9 | Truth versus knowledge (GR5) | Engine resolves on truth; UI explains from the observer's knowledge | A dial value can leak a sealed fact |
| WDI10 | Revisions and freeze (GR3, GR10) | Dial tables carry `id@rev`; seen consequences freeze, unseen futures take the new revision | Patch behavior per world |
| WDI11 | Dials that move during a life | A moving dial is a layer entry with a duration and source, not a rewrite | Idle catch-up must apply it equivalently (GR17) |
| WDI12 | One record or two for profile and dials | Proposal: dials are a section of the world profile, not a second file | Revisit if profiles outgrow one file |
| WDI13 | Canon absolutes | Express "never" as default, dial, reason and cost; an exception is a layer entry with an in-world cause | Authoring cost per canon rule |
| WDI14 | Cross-world carry | An imported thing keeps home rules unless the crossing dial says otherwise (SB16, WR10) | Per edge |
| WDI15 | Cheats as layer entries | A cheat is an actor or director entry with provenance; lens cheats read receipts | Provenance in saves is a decision for Weibao's save-compat rule |
| WDI16 | Director dial edits (scale plan item 3) | Read-only inspector first; mutation later as a saved overlay with revision | Inspection and mutation stay separate |

### WDI-B. Constitutions

| Code | Consideration | Default | Dial and reason |
|---|---|---|---|
| WDI17 | Constitution traits emit facts (`body.*`) | Body sources already exist (GHS5, `body_progression.js`); the interpreter reads their facts | Which facts exist is WDI7 governance |
| WDI18 | Constitution, bloodline and technique are separate carriers (G11) | Three source kinds, one pipeline | Cultivation worlds may fuse two with a stated reason |
| WDI19 | A world dial sets how much a constitution matters | Small step by default (GHS15); decisive where lore says why | LD5 year-of-idle check before a decisive model ships |
| WDI20 | Changes to a constitution need a recorded source | Age, training, substances, wear, modification each write a source entry | Removal and tooltips depend on it |
| WDI21 | Body meets world physics (G43) | A physics dial reads body facts | Per world |
| WDI22 | Others value or hunt a body (G38) | In-world agents are the pushback, no global cap | Rivals and sects need the same facts |

### WDI-C. Crafting

| Code | Consideration | Default | Dial and reason |
|---|---|---|---|
| WDI23 | WR1 to WR10 are crafting dials | Register them; WR3 (substitution) and WR8 (quality model) first | Exact versus functional versus none |
| WDI24 | Maker facts enter the same resolver | Constitution, skill, tool, station and mastery become facts | A fire-touched body changes a heating step through a predicate |
| WDI25 | Substances read the drinker's body | Tolerance and side effects are body facts, not recipe flags (G36) | Per world |
| WDI26 | Mastery rewrites process | Actor-layer rule entry, not a stat bump (MA) | Per world |
| WDI27 | Preview must peek, not draw (SB1) | Quote-then-commit for every dial-driven roll | Cancel after quote shifts nothing (SB2) |
| WDI28 | One resolver for every kind of making (XD) | Dials differ, resolver shared | MR rules still own making semantics |

### WDI-D. Gaps, risks and cross-cutting

| Code | Consideration | Default | Dial and reason |
|---|---|---|---|
| WDI29 | Intent interpretation (GM7) is a different problem | Authored verbs and moves first; local AI may only suggest, engine resolves | Whether to add the suggester is a later call |
| WDI30 | Dial change reshuffles unseen generation | Dial revision belongs in the address (GR2, GR10) | Else a patch rerolls the world |
| WDI31 | Evaluation cost | Cache by world revision plus actor-fact hash; declare a budget (GR11) | Check at late-game entity counts |
| WDI32 | Determinism | Rational arithmetic already avoids float drift; keep integer weights downstream | Golden snapshot in Node and browser |
| WDI33 | Dial coverage matrix | Which consumer reads which dial, linted | Unread dials are dead prose (GR12) |
| WDI34 | Authoring burden | Inherit from genre archetypes by layer (GR8); lint unset dials | Overlay count, not world count, is the cost (scale plan) |
| WDI35 | Dial display leaks | Show dials only through knowledge routes for sealed worlds | Per world |
| WDI36 | Rule-order ties | Equal-rank conflicting replacements already throw (SHOWN); decide whether authoring surfaces that error or lints it first | Lint is cheaper than a runtime throw |
| WDI37 | Resolver id is hard-coded | `village.mix@2` must become per-pack data before a second consumer | Receipts from different packs must not look alike |
| WDI38 | Test shape | Seed sweep at dial extremes, two contrasting golden worlds, save/reload/import next-value check (GR16) | Existing check:rule-behavior maps tests to codes |
| WDI39 | Same-day collision | The scale plan proposes a director dial editor; this palette proposes the inspector first; reconcile before either is dispatched | One owner for the dial overlay format |
| WDI40 | Proposals remain proposals | No row here selects build scope or reorders the standing UI priority | AGENTS.md consistency gate |

## Disposition

**ACT NOW (done in this file):** the corrections WDI1 to WDI4; owner links; prefix check.

**ACCOUNT FOR NOW (constraints, no feature work):**
- Any new rule target or fact goes through the existing `rule_modules.js` admission, not a second evaluator (AR3, one authority per fact). Done check: no new module exports a competing resolver.
- No new dial without a named reader (WDI5, GR12). Done check: the coverage list in the lane output has no empty reader cell.
- Dial text avoids blanket claims. Done check: sweep for never/always/only before reporting.

**LATER / DELEGATE:**

| Item | Level | Effort | Done check |
|---|---|---|---|
| L1 Fact vocabulary governance spec (WDI7, WDI9, WDI33) | Balanced | Doc, one session | Spec lists namespace, owner, type, truth-or-knowledge flag; maps the five existing facts |
| L2 `rule_modules.js` extension feasibility (WDI3, WDI6, WDI36, WDI37) | Strong | Doc only, reads code | Names exactly what the resolver can and cannot express for WR3, WR8 and one heredity dial, with file and line evidence |
| L3 Dial registry code lane (own worktree) | Strong | Several sessions | Held. Needs Weibao's go and a registered seam (AR1 net-zero line). Not dispatched |
| L4 Dial inspector UI | Balanced | UI slice | Held. Needs rebuilt browser evidence at 1920x1080 (standing UI priority) and L3 first |
| L5 Contrasting world-pair profile with `sourceLocator` per setting | Balanced | Doc and data | Held until L1 and L2 land and Weibao picks the pair |

## Dispatch

Route and lanes are recorded in the [core audit](audits/WORLD_DIALS_AND_INTERPRETER_CORE_AUDIT.md).
Route taken: Claude sessions, doc only, because included Codex usage could not be
verified from the controlling chat (AU1, AU5). Sent 2026-10-19: L1
`local_390239fc-b132-4091-8114-c93652f4199b` and L2
`local_e09d4090-1021-47a5-845c-671a3813655f`. Outputs land in
`docs/audits/world_dials_2026-10-19/`. Not yet folded: lane returns fold here,
corrections first, when each session ends. L3 to L5 are held.

## Fold: L1 and L2 returns, 2026-10-19

Lane outputs (doc only, reading only, nothing run by either lane):
[L1 fact vocabulary](audits/world_dials_2026-10-19/L1_FACT_VOCABULARY.md),
[L2 resolver feasibility](audits/world_dials_2026-10-19/L2_RESOLVER_FEASIBILITY.md).
Spot-checked by the root against `rule_modules.js` lines 96 to 113 and the
`world_pack_manifest.js` / `world_pack_loader.js` profile code.

### Corrections first (the root was wrong or overstated)

- **WDI41. World packs already carry the profile and the rule modules.** I missed
  `src/world_pack*.js` in the first pass. A pack profile has `id`, `revision`,
  `extends`, `resolver`, `modules` (each with a layer priority) and `rulings`; the
  loader enforces a layer floor and treats an absent resolver as a dormant feature
  (SHOWN `world_pack_manifest.js` `validateProfile`, `world_pack_loader.js:191`).
  This settles WDI12: dials live in the world pack profile, not a second file, and
  WDI1 stands with this addition. Any dial registry sits beside the pack, not over it.
- **WDI42. The fact vocabulary is open at the API, closed only by default.**
  WDI3 said it is a closed map. `validateRuleModule` and `compileRuleModules` take a
  `facts` option and `world_pack.js` forwards it (L1, L2). The gap is governance of
  who adds facts, not a missing seam.
- **WDI43. The layer ordering exists and the highest rank wins.** Rank is layer,
  depth, value, specificity, order, with `core < world < region < actor < director`.
  Equal rank with different values throws. Gates (veto) ignore layers, so a director
  entry cannot flip a core or world veto without an `exempt` effect that names refs.
  This is a real constraint on WDI15 (cheats as layer entries) and WDI13 (canon
  exceptions): they need `exempt`, not a higher layer.
- **WDI44. A second target would silently blend.** `resolveRuleEffects` does not
  filter parameters by target (root confirmed at line 103), so admitting a second
  target without a filter changes the first target's value. Fix before any new target.
- **WDI45. Base value is 1, not 0.** A step or grant dial gets the wrong neutral
  element (line 105). Needs a per-target base.

### Settled by the lanes

- **WDI36 resolved.** Add a pack-admission lint and keep the runtime throw as the
  backstop (L2 section 7). Lint strictness is a dial: stricter for world packs,
  lenient for director overlays.
- **WDI37 resolved to an edit.** The literal `village.mix@2` sits at lines 41, 91 and
  112 of `rule_modules.js` (L2 E1).
- **Four edits make WR3, graded WR8 and a heredity step expressible** without a second
  evaluator: E1 resolver id from options, E2 per-target base and target filter, E3
  receipt carries target and pack id for non-default targets, E4 conflict message names
  both refs. E5 (slot binding) is held until a crafting consumer exists. None touches
  `main.js` (L2, INFERRED from a grep).
- **Continuous quality stays in the domain.** The resolver supplies coefficients; the
  crafting resolver computes the dose (L2, AR11 default).
- **Heredity state is not the resolver's.** Expression state lives in the heredity slice;
  the resolver reads tags such as `heredity.<factor>.expressed` and returns a value the
  body pipeline maps to a source (L2 section 3.3, AR3).
- **L1 first slice S1:** a behavior-neutral `FactRegistry` beside `tag_store.js`
  holding the five existing facts at revision 1, with lints C1 (reader) and C4 (single
  owner) and a label-rename test (N4). Two facts have live producers; `station.owned`
  has no reader found (GR12 flag).
- **Facts versus tags are two channels.** Scalar facts are a type map; tag facts are an
  open, revisioned registry with visibility. L1 proposes scalar facts borrow the tag
  registry's discipline instead of a third mechanism.

### Open and unverified

- Neither lane ran tests, `check:arch` or `check:rules`; every behavior claim is from reading.
- L2 E3 byte-equality of the default village receipt is INFERRED; `tests/mixture_rule_modules.test.js` and golden receipts were not read.
- L1 Q1 to Q7 stand: `input.mass` unit, owner of the `procedure.process` list, whether
  `station.owned` has a reader, one registry or one per pack (depends on WDI39 overlay
  format), the knowledge-stage function, identity-fact count lint, and L2 overlap.
- Same-day collision WDI39 (scale plan director dial editor) is still open.
- L1 and L2 agree on the one-target limit; they disagree on nothing material.

### Next steps (proposal, ranked, none selected)

| Rank | Step | Level | Effort | Done check |
|---|---|---|---|---|
| 1 | L2 E1 and E3 (resolver id and receipt target) | Strong | Small code slice, own worktree | R4 and R5 from L2 pass; existing rule tests and `check:arch` green; no `main.js` diff |
| 2 | L2 E2 (per-target base and target filter) | Strong | Small code slice after 1 | R1 and R2 pass; village resolve unchanged |
| 3 | L1 S1 fact registry, behavior-neutral | Balanced | One slice | C1, C4 and N4 pass; neutrality evidence |
| 4 | Pack-admission lint plus E4 message | Balanced | Small | R3 and R6 pass |
| 5 | WR3 and WR8 default tables as module recipes in the crafting WR section | Balanced | Doc | Linked from CRAFTING_ENGINE; each dial names its reader |

These wait for Weibao's go. L3 (registry code lane) is the same work as steps 1 to 3, so
it stays held rather than dispatched.

## Round 5: per-world meters (bars), 2026-10-20

Proposal only (WDI40). Weibao asked whether each world can have its own bars (corruption
for LOTM, mana standing in for HP, other things elsewhere). Direction: a world declares
its meters; one generic bar renders them; the current health and stamina row becomes the
default set. This round checks what already exists before any new schema.

### Corrections first

| Code | Finding | Evidence | Consequence |
|---|---|---|---|
| WDI46 | A meter-shaped model already exists, so a new meter schema is the wrong first move | `src/energy_resources.js:6-9`: energy policies carry capacity, output, control, efficiency, strainLimit and strainPerUse as integers; recovery is a frozen job on the shared clock | LOTM control and strain, and mana, extend energy policies; a second resource model would break AR3 (one authority per fact) |
| WDI47 | Health and stamina are read directly off `person.vitals` in several places | `src/action_legibility.js:226-238`, `src/agreed_duty_facts.js:47,77,79`, `src/artifact_workshop_content.js:92` | "Mana as HP" cannot be a label swap. Consumers read `vitals.health` as the death and incapacity check, so a world that remaps it needs one named accessor, not edits at each reader |
| WDI48 | LOTM already separates source, control, strain and digestion | `src/book_world_lotm_actions.js:57` bioDetail: none of those follows from owning the source; digestion and bad doses are listed as later | A corruption bar must not be one number. Strain (shown) and loss of control (maybe hidden) are different meters with different readers |

### Considerations

| Code | Topic | Consideration | Why it matters |
|---|---|---|---|
| WDI49 | Meter kinds | At least three behaviors, not one bar: a pool that depletes and refills (stamina, mana), an accumulator that climbs and bleeds off (corruption, strain, stress), and a clock-like track that only advances (digestion, tribulation debt, lifespan). Each fills and drains differently and the player should read them differently | One "bar with max" shape forces corruption to look like HP |
| WDI50 | Threshold behavior | Default: crossing a threshold changes what actions exist, not just a color. Dial: which thresholds, how sharp, and whether the change is reversible. Reason and cost belong to the world (design framing: default, dial, reason) | A bar that only shows a number is decoration; the world's rules are in what the threshold does |
| WDI51 | Mana as HP | Treat as a death-check binding: which meter the incapacity and death checks read is itself a world dial, with a default of health. The world supplies the reason (a body made of mana, a dungeon-core, a spirit) and the cost | Keeps AD38: it works by its mechanism, no permission list |
| WDI52 | Visibility | A meter can be hidden, partial or exact, depending on what the character can perceive. Hidden truth is a fact; the shown reading is a knowledge claim. This matches the truth-or-knowledge flag in L1 | Corruption the character cannot sense should not show a perfect bar. Sealed secrets (AGENTS.md) apply if the meter reveals a world truth |
| WDI53 | Sources and sinks as receipts | Every change to a meter writes a reason line (what moved it, by how much), so the bar can explain itself on hover and in the log | Players distrust a bar that moves silently, and it is the cheapest debug view |
| WDI54 | Cross-world carry | A meter belongs to the body or character and the world that gives it meaning. Entering a world with no use for it: keep it dormant and saved, not deleted, not applied (BHR30 style). Corruption from one world must not silently become damage in another | Many worlds are Weibao's direction, and a save that loses or misapplies a meter is a persistence bug |
| WDI55 | Persistence | New meters are new saved fields. Per AGENTS.md, persistence changes need a migration or an explicit compatibility decision; old saves load with the default set and no extra meters | The first non-default meter (LOTM) is the first real save-shape change in this thread |
| WDI56 | Display budget | Target viewport: desktop and laptop, 1920x1080 first; mobile deferred. A pack may declare many meters, so the panel needs a primary few, the rest in a detail view, per the UI rules for density | Without a cap, three worlds of meters turn the vitals row into a wall |
| WDI57 | Color and glyph | Meters take a semantic token, never a raw color, and pair color with shape or label so state is not color-only. Worlds can restyle through world-frame tokens | Existing token and panel-kit rules already own this; the meter must use them |
| WDI58 | Interaction between meters | Meters can couple: strain raises corruption gain, low stamina caps mana use, hunger slows recovery. Express as rule-module recipes, not special cases in the bar | Keeps one evaluator (rule_modules.js admission) |
| WDI59 | Legibility and testing | An inspector that lists every meter, its sources, sinks and thresholds, read-only, before any editing. Seed sweep at threshold edges, save/reload/import next-value check | Matches the inspector-first order already proposed (WDI39) |
| WDI60 | Sequencing risk | The generic bar is cheap; the meaning behind it is the work. Build one real non-default meter end to end (LOTM strain, shown) before generalizing the schema | Schema first, with no consumer, is the speculative abstraction AR rules warn against |

### Disposition

**ACT NOW (done in this file):** WDI46 to WDI48 corrections; this round saved.

**ACCOUNT FOR NOW (constraints, no feature work):**
- Meters extend energy policies and the `person.vitals` accessor; no parallel resource store (WDI46, AR3). Done check: a proposed schema names which existing field each meter maps to.
- A remapped death or incapacity meter goes through one named accessor (WDI47, WDI51). Done check: grep of vitals readers lists every consumer before the change.
- Any meter dial names a reader (WDI5, GR12). Done check: no empty reader cell.
- Sweep for never/always/only before reporting.

**LATER / DELEGATE:**

| Item | Level | Effort | Done check |
|---|---|---|---|
| M1 Vitals reader inventory and accessor design | Balanced | Doc, reads code | Every `vitals.*` reader listed with file and line; one accessor proposal |
| M2 LOTM meter grammar: strain, control, digestion, bad dose, visibility | Strong | Doc, existing LOTM notes only | Each meter has kind, source, sink, threshold effect and reader; no new book read unless a gap is named |
| M3 First slice: LOTM strain as the first non-default meter, shown, with receipts | Strong | One code slice, own worktree | Held. Needs Weibao's go. Browser evidence at 1920x1080; save, reload and import pass; old save loads unchanged |
| M4 Meter inspector (read-only) | Balanced | UI slice | Held until M3 |

### Results: M1 and M3, 2026-10-20

M1 done: [vitals reader inventory](audits/world_dials_2026-10-19/M1_VITALS_READERS.md). The engine's vital effect is already key-generic; only two allow-lists (`simulation_contracts.js:57`, `:239`) and the native sync limit it to health and stamina. Remapping death to another meter is the large change (about 78 direct reads), so it waits for a world that needs it.

M3 done at the code level, with one deviation from the plan above: LOTM spirituality and strain were already in the energy record and already shown as text, so the slice renders them as two meters (`src/meter_bar.js`, `lotmMeters` in `src/book_world_lotm_host.js`, `styles/meter_bar.css`, tokens in `ui_tokens.css`) and adds **no saved field and no migration**. Strain is an accumulator that reads worst when full and blocks the next use at its limit (engine rule, `energy_resources.js`); spirituality is a pool that reads worst when empty. Hover text says what fills and drains each.

Evidence: `npm run build`, `npm test` 2289 of 2289 (includes the new `tests/meter_bar.test.js`: state direction per kind, bad-spec refusal, LOTM meters mirror the record and add no state), `check:arch` zero growth, `check:rules` pass. Browser, `?lotm_probe=1` emulated at 1920x1080: enrolled, ingested, took the lesson; two `role=meter` bars rendered with `aria-valuetext` "Spirituality 2/3" and "Strain 1/6", widths 66.7% and 16.7%, states updated after the lesson. **Not verified:** pixel appearance (the pane screenshot was 800x600 and the panel stayed hidden behind the title screen, so no screenshot of the bars), the `high` and `full` outlines, 1366x768, and save, reload and import with the new bars (no save shape changed, but not exercised). These stay on the acceptance backlog. Taste unaccepted, nothing committed.

See also (2026-10-19): [CRAFTING_ENGINE Round 6](CRAFTING_ENGINE.md#round-6-2026-10-19-tags-subtle-properties-new-material-families-places-and-display) for tags, material families, harvest places and display (TQ, NX, PG, UV). Proposal only.
