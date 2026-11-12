# Foundation S · Spellcraft · checkpoint (phases 1 and 2, MS1 to MS3, 2026-11-12)

Chat S in the [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md). Phase 1 is inventory only: nothing here embeds on K or W, and no runtime file changed. Everything below is a proposal under AD56 (it widens play) unless it quotes Weibao. Codes: SI inventory findings, SG grammar parts, SQ quantities, SF findings for other chats, SB backlog.

Branch `claude/fdn-s-spellcraft-ec4a66`, fast-forwarded from c25fd396d to the stabilization commit 9bbc51363 before any work (the worktree had been cut one commit short of it; HEAD was an ancestor, tree clean).

Sources read: the plan doc whole, the [spellcraft evidence](../../../research/PROCEDURAL_SPELLCRAFT_ENGINE_EVIDENCE_2026-11-11.md), the [Hogwarts spellbook](../../../research/HOGWARTS_SPELLBOOK_2026-11-11.md) (117 records, six families), the [vocabulary proposal](../../../research/HOGWARTS_SPELL_VOCABULARY_PROPOSAL_2026-11-11.md) V1 to V5, K's v0 note in the shared notes folder, and every S-owned runtime file (inventory pass by a read-only subagent, caller claims rechecked by grep).


```receipt
build: e07abe494b4ee0188ed1d7842b5ab7b0c532dd9e10996391d49cf5826d2c9733
route: fixture(mol-zorian-xvim)
state: browser-verified
viewport: 1920x1080 headless Chromium
persistence: unchanged
tests: 15 focused files (spell, kernel, grammar, effect_dsl, D&D, ritual, divination) pass after merging master 2fff2285e; spell_grammar 11 of 11
review: none
```

## Milestones MS1 to MS3 (2026-11-12, after master 2fff2285e)

**Runs share: 94 of 117 spellbook records run (80.3%)** as data through the spell law (`runs-authored`), 18 are blocked with a named rule and 5 are not spells; 0 unclassified. (`check:coverage` reports 83.9%; see the note under the table.) Ledger: [docs/coverage/hp_spells.jsonl](../../../coverage/hp_spells.jsonl), built by `node scripts/spell_coverage.mjs` from the spellbook in its order and checked by `tests/spell_grammar.test.js` ("every Hogwarts spellbook row runs through the spell law": each runs row has a pack row whose sentence quotes through `spell_law`, and no blocked row has one).

| State | Rows | Notes |
| --- | --- | --- |
| `runs-authored` | 94 | Effect from the book; wand carrier and stamina cost authored (the books state no cost), so none is `runs-canon`. 25 rows added this phase (hover, banishing, Waddiwasi, freezing, Apparition, Disillusionment, Meteolojinx Recanto, Anti-Disapparation, Prior Incantato, Deletrius, Morsmordre, Caterwauling, Orchideous, Ferula, Anapneo, the wound countercurse, Avada Kedavra, Legilimens, Furnunculus, Cheering, Bat-Bogey, Jelly-Legs, Dolohov's curse, Dissendium, Permanent Sticking) |
| `blocked:effect-unknown` | 3 | Salvio Hexia, Cave Inimicum (ward words in a group, isolated effect not shown), Bedazzling (named in discussion) |
| `blocked:intent-object-slot` | 3 | Flame-Freezing, Impervius, the Obliteration Charm: each blocks or removes one chosen thing (fire, water, a trail); an intent needs an object parameter |
| `blocked:<one each>` | 12 | rate-change (Braking), propagating-effect (Fiendfyre), interior-capacity (Extension), keeper-secret (Fidelius), speech-trigger (Taboo), enforcement-record (Trace), breath-need (Bubble-Head), accidental-magic (Aunt Marge), language-key (Parseltongue), linked-effect (Protean), vow-clauses (Unbreakable Vow), discipline-not-cast (Occlumency) |
| `not-a-thing` | 5 | phenomenon (Priori Incantatem), artefact-command (Mischief managed), no-effect-shown (Lockhart's pixie attempt), fake-spell (Ron's rhyme), category (Unforgivable Curses) |

The coverage script counts `runs` over the rows that are things (117 minus 5 `not-a-thing`), hence 83.9%; over all 117 records it is 80.3%.

Two intents were added for the ledger under EF2: `conjure` (Orchideous, Ferula; Incarcerous a third case) and `read_mind` (Legilimens; LOTM mind reading as second consumer). Gamp's Law now refuses conjured food only, as the book states; flowers, ropes and bandages are canon conjurations.

**MS2, GL2 effect layer (Hogwarts, 94 rows, leave one out).** Hold out the whole effect (intent, target, execution), predict it from identity (roots, catalogue name words, the world's lexicon) plus the grammar's laws, derive the sentence, compare with the recorded truth (`effectLayerTest`).

| Identity evidence | Verb and object right | Full sentence right |
| --- | --- | --- |
| Blind glosses (roots plus English name words, written without spell names; [evidence/blind_root_lexicon.json](evidence/blind_root_lexicon.json)) | **35/94 (37.2%)** | **15/94 (16.0%)** |
| Authored root glosses plus blind name words (upper bound: glosses written knowing the spells) | 59/94 (62.8%) | 25/94 (26.6%) |

The target is 70% (dial). Not met. The misses, as named missing rules, with the blind run's counts:

| Missing rule | Rows | What it needs | Owner |
| --- | --- | --- | --- |
| `intent-from-identity` | 36 | Root composition: a modifier root changes the head's intent (Locomotor carries, Locomotor Mortis binds). Today roots vote independently | S (grammar), P (two-given conditioning, PGB1) |
| `no-identity-evidence` | 23 | Coined words with no gloss (Relashio), or a gloss that names a thing with no action (agua as water, lum as light). A source-language lexicon with wider coverage, or a reader's knowledge of the tradition (N) | S, N |
| `target-from-intent` | 16 | Target needs its own evidence: noun roots vote targets (corpus means body) but most spells name no target; creature versus body is a fine line the source does not fix | S |
| `time-from-intent` | 4 | Time needs its own evidence (Totalus and Mortis read as lasting) | S |

`tests/spell_grammar.test.js` holds the blind numbers as floors (35 and 15), so a change that lowers them fails.

**MS3.** Every spellbook record either runs or is blocked with a named rule (above). Bespoke modules deleted: 0 so far (MS3's deletion count is G's Keeper compression; S's own candidates are `dnd_levitate` and the two variant grids, next phase).

**Codex lane.** Brief for the coordinator: [CODEX_LANE.md](CODEX_LANE.md), a source check of the 94 runs rows against the cited omnibus pages, with S reviewing the diff.

## Phase 2 (2026-11-12): spells on the kernel, canon rebuilt from parts, spells beyond the book

Master (ending ea6a170dd, with K and W v0 and every phase 1 checkpoint) merged into this branch first. Read: the plan's sections on sectioning (SC1-SC10, PFP21), separate but connected (SB1-SB6, NV1-NV5, EF1-EF8, PFP22-PFP24) and broad systems, K's contract, P's contract, W's contract, and the other chats' checkpoints. Code SC, NV, EF, PFP and KW references are the plan's and K's; S2- codes below are this phase's.

### What changed

| Code | Change | Files (all S-owned) |
| --- | --- | --- |
| S2-1 | **Spellbook drafts compile and quote on K's working; the old spell plan shape is retired.** A draft becomes a K method (typed roles per step, one kernel step per operation); the world's rule table is the operation law; a step settles to the native command it lowers to (KB7). `compileSpellWorking` and `nativeSpellSteps` are gone; `spellbook_workings.js` calls `spellDraftCommands`. The same draft gives the same record and effects settled in one jump or minute by minute through save and restore, and a target that goes missing interrupts at its own step with the earlier steps kept (KW3, KW5, KW8). Limit: the live trial state (`next`, `length`, `receipt`, `status` in the spellbook fact) is still the spellbook's own shape and no `kernel.working@1` record is saved (KW7); that test proves the law, not the spellbook's saved trial | `spell_working.js`, `spellbook_workings.js`, `tests/spell_working.test.js` |
| S2-2 | **Effect sentences and the intent law.** Verb, object, target, time, carrier, cost and limits, as in the plan's effect grammar. An intent law (56 intents) says what willing an outcome does in those terms; no world is named. Two intents were added because a second world forced them (EF2): `sense_magic` (D&D Detect Magic; LOTM Spirit Vision) and `divine` (nine LOTM divination rows; Hogwarts Divination lessons) | `spell_effects.js` |
| S2-3 | **The spell grammar on P's contract** (SG1-SG9 made code): intent, roots (conditioned on intent), target (conditioned on intent), execution, delivery, gesture, carrier, cost, access. Rules: derive the sentence; reject a sentence that cannot run; reject a verb that cannot act on a running effect; reject mind, mood, memory, pain, vitality, voice or sight on a lifeless target (dial `mindedObjects`); flag a carrier paid from an unusual account (dial, for transfers). Revision 3 | `spell_grammar.js` |
| S2-4 | **Spell families as data, four worlds.** Hogwarts: 69 canon rows in six families, each with omnibus locators, roots read as lexical clues (inference), gesture and delivery only where shown. D&D: the 20 SRD 5.2.1 records in `effect_dsl.js` mapped onto the grammar; `effect_dsl.js` stays the inert authoring contract and `spell_pack_dnd.js` is its world-pack mapping. Mother of Learning: Torch, direct shaping, Magic Missile. Lord of the Mysteries: the nine source-pinned divination rows (rite stages as execution) and Spirit Vision (OS7) | `spell_pack_hogwarts.js`, `spell_pack_dnd.js`, `spell_pack_mol.js`, `spell_pack_lotm.js` |
| S2-5 | **Any sentence runs as a K working; composed spells are one K method** (SC6). One operation per verb and target kind; settlement reads the bound thing at its time and lets properties decide (PFP22): a ward that blocks the verb or object stops that step (EF3), a mass limit stops a move. Lift, summon and release compose into one working; a ward on the weight stops the summon step and leaves the lift settled | `spell_law.js` |
| S2-6 | **Beyond-canon spells: NV1 recombine and NV3 transfer with the five checks.** 1 runs (grammar assembly plus a K quote), 2 pays (one cost curve fitted to an anchor: Levitation costs 1 stamina), 3 the world allows it (world laws with reasons: Gamp's Law, the slot ceiling, the formula boundary, the Seer pathway; an exception needs an in-world reason and cost), 4 explains itself (a plain line), 5 worth keeping (novelty against canon, fit, best per verb so the spread stays wide). Names come last (EF5): an incantation from roots the world's lexicon ties to the intent, with canon collisions reported; with no fitting root a spell stays unnamed until the naming owner has a register | `spell_invention.js` |
| S2-7 | Two browser walks and the area guide's Powers entry | `scripts/spellbook_cast_browser.cjs`, `scripts/spellbook_placement_browser.cjs`, `docs/AREA_GUIDE.md` (one bullet) |

### Canon test results (P's `canonTest`, PFP17)

| World | Rows | Rebuild | First contact | Missing rule found |
| --- | --- | --- | --- | --- |
| Hogwarts | 69 | 69/69 | 69/69 | none for the sentence; root inference below |
| D&D (SRD 5.2.1) | 20 | 20/20 expressed (4 `supported`, 16 with a pending ruling) | 19/20 | no intent sensed magic (Detect Magic): added `sense_magic`. The srd521 README says an executor refuses `needs_ruling` and `unsupported` records until a reviewed ruling resolves them; `spell_law` now does so and names the record's own unmodeled lines |
| Mother of Learning | 3 | 3/3 | 3/3 | none |
| Lord of the Mysteries | 10 | 10/10 | 9/10 before `divine` existed | divination reads an answer, not a presence: added `divine` |

The full rebuild is close to by construction, as P found for Gu: the truth sentences were written in the intent law's own vocabulary, so 100% says the law **can express** every canon row, not that it predicts them. The numbers that carry information:

- **Root inference.** Hiding the intent and reading it back from the roots, leave one out over 69 Hogwarts rows: 4/69 (5.8%) from corpus roots alone, against a 2.9% majority guess. Most roots appear in a single spell. With the source-language lexicon (Latin, Greek and English dictionary glosses, labelled inference): 48/69 (69.6%). Caveat: the gloss-to-intent mapping was written by someone who knows the spells, so 48 is an upper bound.
- **Held-out families** (reserved before any rule was derived): the wand-light family (Lumos, Nox) and the `-corpus` family (Levicorpus, Liberacorpus, Mobilicorpus). Corpus roots alone recover 2 of 5 (`lev`, `mobil`). With the lexicon, 5 of 5. The missing rule the test found is "a root unseen in the corpus needs the world's language", now `HP_ROOT_LEXICON` plus `inferIntent`.
- **Pair support.** Generated spells drawing intent and target separately used canon intent and target pairs 30.5% of the time. Conditioning target on intent raised it to 100% (P's PGB1 shape, one given per slot, was enough here).

### Rescopes and limits (with reasons)

- **Gesture is recorded, not derived.** The done check names canon rebuilt "from roots, gesture and intent". Gesture stays a recorded part with no derive role: the vocabulary proposal V1 marks the independent weight of speech and motion as unknown, and no scene isolates a gesture's effect. It becomes a derive input when a scene shows one (backlog SB9).
- **The rebuild that counts is from roots.** Intent is an input to the 102/102 above. The honest rebuild hides the intent, infers it from roots, derives the sentence and compares it to canon: see "Rebuild from roots" below.
- **Pair support of 100% is by construction** once target is conditioned on intent, like P's per-slot inside rate.
- **Check 4 speaks engine words today.** "It moves position (up) of an object" passes `check:player-text` because it is assembled at runtime, out of the lint's sight. Before the first grammar spell reaches a player, the explanation needs world-pack word tables and a PRS7 voice sample (next phase item 2).
- **Making rules.** Spell effects and made things share one effect vocabulary (MR38, proposed); `spell_invention.js` applies it.

### Rebuild from roots (the reported canon number)

Leave one out over the 69 Hogwarts rows: hide the intent, infer it with `inferIntent`, derive the sentence, compare all five truth fields (`rootRebuild` in `spell_grammar.js`).

| Lexicon | Intent inferred | Sentence rebuilt | Held-out families (5 rows) |
| --- | --- | --- | --- |
| None (corpus roots alone) | 4/69 | 4/69 (5.8%) | 2/5 |
| Blind glosses: a haiku reader given the 78 root strings and the intent list and nothing else, no spell names or outcomes ([evidence/blind_root_lexicon.json](evidence/blind_root_lexicon.json); 43 roots got an intent) | 29/69 | **29/69 (42.0%)** | 3/5 (Lumos and Nox missed: the reader glossed light and night as nouns with no action) |
| Authored glosses (`HP_ROOT_LEXICON`, written knowing the spells) | 48/69 | 48/69 (69.6%), an upper bound | 5/5 |

The blind 42% is the number to stand behind. The gap to 69.6% is the knowledge a teacher or a book supplies; in play it maps to a character who knows the spell's tradition reading roots better than an outsider (N's knowledge owners, MC8).

### Beyond-canon sample (seeded, address `report`, four Hogwarts parents, one part changed)

96 recombinations tried: 84 pass all checks, 12 fail check 1 (a move or similar verb aimed at a running effect, or a mind effect on a lifeless thing). Kept spread, one per verb, for example: *Noxendo* (takes light away from an object, held while paid, cost 1), *Glissum* (changes the form of an object, cost 2), *Obscurendo* (hides an object, cost 2), *Wing Levo* (lifts a creature, cost 2), *Appario* (reveals a mark on an object, cost 1); one candidate (blocks magic on an implement) stayed unnamed because no Hogwarts root glosses to countering. Transfer: Accio carried into Cyoria pays mana and runs; into D&D it pays a slot.

### PFP2 counts, before and after this phase

| Count | Phase 1 | Phase 2 |
| --- | --- | --- |
| Canon spell cases as data rows on S's grammar, expressed from parts | 4 | **102** (69 Hogwarts, 20 D&D of which 16 await a ruling, 3 MoL, 10 LOTM) |
| Hogwarts canon rebuilt from roots alone (intent hidden, blind glosses) | n/a | **29 of 69** |
| Of those, lowered into native play end to end | 4 | 4 (the spellbook's Levitation, Summoning, Torch and direct shaping). The other 98 run as K workings that publish effect intents; no host lowers them onto world owners yet |
| Spell data shapes | 5 parallel (SI1) | 5, plus the grammar as the canon record; `spell_working`'s own plan shape retired (one of K's five): spellbook drafts compile and quote on K, while the trial state is still spellbook-owned |
| Bespoke scene modules | 7 | 7 (none deleted this phase) |
| Per-world rule hooks | 2 | 2 |
| Code-generated variant grids | 2 | 2 (recombination now produces the same kind of variants from data; the grids are not yet deleted) |

### Checks (phase 2)

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test` on 15 focused files: spell_grammar, spell_working, spell_seam, spell_cast_lowering, lotm_be_spells, ritual_conditions, lotm_divination_rows, cast_divination_adapter, dnd_phandalin, dnd_phandalin_domain, effect_dsl, kernel_working, procedural_grammar, hp_charm_bridge, source_engine_shapes | 197 pass, 0 fail | full `npm test` left to the integrator (MC7) |
| `npm run check:arch` | pass (main.js unchanged by S) | none |
| `npm run check:rules` | pass; one stale glob (`private_packs/**`, absent in this worktree) and the TMR1 warning in `book_world_hp_exams.js`, both incumbent | none |
| `BUILD_OUT=<scratch> npm run build` | pass, bundle SHA-256 e07abe49... (receipt above) | none |
| `scripts/spellbook_cast_browser.cjs` on the earned Zorian save | 8/8: Torch studied through its native command, listed in the spellbook, quoted, tested (native timed cast through the kernel path), settled as "The working succeeded.", kept through Save and reload, no page errors | Export and Import not exercised this phase; Hogwarts bench not walked |
| `scripts/spellbook_placement_browser.cjs` | 15/15 on the new bundle | none |

Save compatibility (MC4): unchanged. The spellbook's actor fact keeps schema 1; drafts saved before this phase compile through the kernel unchanged.

### Requests (for the coordinator to relay)

| To | Request |
| --- | --- |
| K | Update the spell column of "The five shapes on one page": `compileSpellWorking` and `nativeSpellSteps` are retired; spellbook drafts are K methods (`spellDraftMethod`). Sequential composition (SC6) needed no kernel change: a composed spell is one K method over `spell_law`. A joint composition, where several parts fire in one beat (Gu killer moves, PGB4), needs a kernel answer; S and G are ready to be the two consumers |
| W | The spell effect vocabulary (13 verbs, 28 objects, 9 targets, 5 times) and the effect kinds `spell.<verb>.<object>` are ready to become W's shared effect kind list (W's "effect kind vocabulary" backlog). `spell_law` reads two ad hoc properties, `mass` and `blocks`; W should own those names (seam SB2). Mana is still two quantities (the native bar and `book.mol.zorian.reserve`); W decides which is the projection |
| P | `inferIntent` scores roots, then a lexicon, then target, because two conditioned children on one given let the stronger one swamp the weaker. A per-child weight dial in `inferSlot` would let S drop its local scorer. A lexicon overlay (source-language glosses as an evidence kind) may suit other domains' names too |
| Naming owner (NMR) | Hogwarts needs an incantation register for generated spells (today: joined roots plus a drawn ending). D&D and Mother of Learning have no root vocabulary, so their generated spells stay unnamed |
| G | First consumer pairing for joint composition (SC6): a killer move and a combined charm through the same kernel answer |
| R | The two LOTM advancement rites are R's crossings; S keeps `ritual_conditions` as the combination layer they grade with |

### Next phase

1. Store the spellbook trial as a K record (`kernel.working@1`) in the spellbook slice, settled when the native job finishes (KW7, KW13). Save shape becomes spellbook schema 2 with a one-step migration from schema 1 (MC4).
2. Lower grammar spells into play, with world-pack word tables for the explanation line (PRS7): a Hogwarts host that maps effect intents from `spell_law` onto the bench's owners, so a recombined spell can be cast at the bench (FLR2 route).
3. Re-express `dnd_levitate` as D&D pack rows plus world rules (SB5) and delete its switch; then the HP lab and MoL formula grids as recombination (SI3).
4. Run the LOTM divination rows through `spell_law` with their rite stages as steps, retiring `cast_divination_adapter`'s own compiler (SB6).
5. Export and Import in the spellbook walk; the Hogwarts bench walk.

## 1. Inventory: every spell, cast lowering and spell rule in code

D = data rows run by shared code. B = bespoke, hand-written per spell or scene.

| File | Lines | What it holds | D/B |
| --- | --- | --- | --- |
| `spell_dictionary.js` | 125 | 6 versioned method rows: `hp.levitation`, `hp.summoning`, `hp.release`, `mol.torch`, `mol.direct_light`, `mol.oblique`. Each has roles, means (wand or attuned mana), operations, expression parts (incantation, gesture, technique, formula) and evidence kinds. Levitation is the one row with a subword analysis | D |
| `spell_working.js` | 47 | `bindSpellExpression`, `compileSpellWorking`, `nativeSpellSteps`: ordered methods to bound operations to native commands, typed target check | D (shared compiler) |
| `spell_world_rules.js` | 50 | Per-world hooks. Hogwarts: `lift`, `support`, `move`, `release` mapped to bench commands, for board, weight and rail. Cyoria: `illuminate` mapped to three book_mol light casts, for the slate. `knows` and `worked` read knowledge facts | B (hand rules per world) |
| `spell_seam.js` | 135 | `defineSpells`, `failureChance`, `spellRoll`, `strainDue`, `settleSpellCast`, origins (teacher, text, observed, inherited, sequence, granted) | D (shared seam) |
| `spell_cast_lowering.js` | 48 | `lowerSpellCasts`: a cast becomes cast or fizzled outcomes with a seeded chance fact and a practice step | D |
| `spell_adapter_hp.js` | 26 | HP adapter (fail 0.4, minus 0.1 per mastery), `hpFormula` (no src caller), `spellFromLearnRow` (callers: tests and private packs) | D |
| `spell_adapter_lotm.js` | 42 | LOTM adapter (no failure number, strain on failure, ritual dial), `spellFromTyped`, `spellFromDivination` (no src caller) | D |
| `spell_trial_evidence.js` | 35 | Trial observation and written-revision contract over the knowledge owner; consumers Hogwarts and Cyoria | D |
| `spellbook_workings.js` | 125 | Draft, test, cast-next, record, recall; schema 1 JSON in actor fact `spellbook.<world>.workings` | D |
| `spellbook_host.js` | 69 | Mount and per-world host choice (`activeRules`), Hogwarts via structured extension, Cyoria via book_mol host | B (host wiring) |
| `spellbook_ui.js` | 95 | Panel, registered as workspace module `spellbook` | UI |
| `hp_lead_spells.js` | 278 | Power-grammar rows `levitation_charm`, `pass_feather`, `lift_board` (D); take wand, take weight, release board, inspect edge, Accio study, step back, return, summon weight (B); a 2x2x2 delivery x stroke x aim lab grid generating 12 trials and up to 12 write plus 12 recall commands (B, generated by code, not rows) | mixed |
| `hogwarts_spell_workshop.js` | 83 | Standalone fixture with its own state and a `techniques` map (accio, leviosa), 3 cases; its one caller is `scripts/procedural_workshop.mjs` | B |
| `dnd_levitate.js` | 178 | One-spell fixture: slots (max 2), concentration, Counterspell save DC 14, spring or focus, copying at 100 GP and four hours; `settleLevitation` is a 13-action switch; uses neither seam nor dictionary | B |
| `lotm_be_spells.js` | 64 | Power-grammar rows `spirit_vision`, `cogitation` on the Seer spirituality pool, with `open_vision` and `cogitate` handlers | D rows, B handlers |
| `mol_light_research.js` | 153 | Study Torch, review shaping, 4 casts (torch, shaped, overload, oblique), a direction x boundary x draw formula grid (12 variants, generated by code), draft, write, recall, copy and read cuts | B |
| `book_world_lotm_ritual.js` (OS7) | 117 | `LOTM_RITUALS` 2 rows (`sun_5`, `visionary_5`) graded by `ritual_conditions`; shop, bargain and self-rite commands | D rows, B commands |
| `ritual_conditions.js` (OS7) | 98 | `defineRitual`, `gradeRitual`: met, substituted, partial, absent across physical, functional and symbolic layers | D |
| `lotm_divination_rows.js` + `cast_divination_adapter.js` (OS7) | 197 + 126 | 9 divination query rows compiled into prepare, rite, attempt, interpret; production caller `book_world_lotm_cast_host.js` | D |
| `book_world_lotm_divination_method.js` (OS7) | 31 | 9 method names with a lesson fact each, a hand map | B |
| `mol_zorian_divination.js` | 105 | Calendar and appointment scene | B |

Private, untracked: `private_packs/learnable-spells/hp.json` and `mol.json`, 3 rows each (Match to needle, Summoning, Patronus; Torch, Book finding, Magic Missile), read through `ability_records`, not through any spell shape. `book_world_mol_cast.js` validates the MoL cast schedule and is not spell code.

- **SI1 · Five parallel shapes for one idea.** `spell_dictionary`/`spell_working`, `power_grammar` (`definePowerGrammar`), `spell_seam` (`defineSpells`), `ability_records` (private learnable packs) and `ritual_conditions`/`defineDivinations` each describe "a known method with costs, steps and a result". Levitation alone exists as `hp.levitation` and as `book.hp.lead.sp.*`, linked only through `HP_LIFT_BOARD_COMMAND`. This is the review F3 pattern inside one domain. Embed phase default: the dictionary row becomes the one canon record; power-grammar pricing and seam failure become laws it reads.
- **SI2 · Hand rules hide in world hooks.** `spell_world_rules.js` maps an operation to a command for one named target each (`board`, `weight`, `slate`). A second object cannot be lifted without a new line. That is a target law missing, not a data gap.
- **SI3 · Generated grids are not data.** The HP lab grid and the MoL formula grid enumerate variants in code. They become free once the grammar can compose parts (SG2 to SG4) and price them (SG6).

### PFP2 counts (strict)

| Count | Value | Notes |
| --- | --- | --- |
| Canon spell cases running as data on S's own grammar end to end (dictionary row to native cast) | **4** | `hp.levitation`, `hp.summoning`, `mol.torch`, `mol.direct_light`. `hp.release` and `mol.oblique` run but are original, so they do not count as canon |
| Canon cases running as data on any shared shape | **18** | the 4 above, 3 canon power-grammar rows (`levitation_charm`, `spirit_vision`, `cogitation`; `pass_feather` and `lift_board` are scene uses), 9 LOTM divination rows, 2 LOTM ritual rows. Four different shapes (SI1) |
| Bespoke scene modules | **7** | `hogwarts_spell_workshop`, `dnd_levitate`, `mol_light_research`, the bench and Accio half of `hp_lead_spells`, the ritual commands in `book_world_lotm_ritual`, `mol_zorian_divination`, `book_world_lotm_divination_method` |
| Bespoke per-world rule hooks | **2** | Hogwarts (4 operations) and Cyoria (1 operation) in `spell_world_rules.js` |
| Code-generated variant grids | **2** | HP lab (12 trials, up to 24 write and recall commands), MoL formula (12 variants) |

Denominators: Hogwarts spellbook 117 research records in six families, 41 official spell entries; D&D 2024 exercised 3 spells (Levitate, Counterspell, Mending) out of the full list; Mother of Learning has Torch, direct shaping, the oblique variant in code, and Magic Missile and Book finding only in a private pack. Coverage today is 4 of 117 Hogwarts records as data at best (about 3 percent).

## 2. Spell grammar of parts (draft for P)

Fits K v0's method shape (`roles`, `steps: [{op, bindings}]`, `law.operations`), which `spell_working.js` already resembles. Each part is a typed slot. A world pack fills its values and weights; domain law never names a world (PFP3).

| Code | Part | What it holds | Hogwarts | D&D 2024 | Mother of Learning | LOTM ritual and divination (OS7) |
| --- | --- | --- | --- | --- | --- | --- |
| SG1 | **Root** (lexical clue) | Word or morpheme with a meaning hint and an evidence kind (attested, inferred, original). A clue to the operation, not the operation | `lev-` lift, `-corpus` body, `accio` fetch | the spell name; no roots | invocation words, formula terms | honorific names of the addressee (three-part incantation) |
| SG2 | **Operation** | Verb with typed inputs and outputs: read, reveal, move, lift, support, release, transform, bind, suppress, grant, illuminate, end | lift + support, move, end (Nox, Finite) | Levitate: lift + support; Counterspell: suppress a working in flight | illuminate, shape, bound | reveal (divination), grant or seal (ritual) |
| SG3 | **Target role** | Typed slot: object, body, place, active effect, working, relation, self | object, body (`-corpus`), active effect | creature or loose object up to 500 lb, a spell being cast | slate (place), self | querent, question, altar space |
| SG4 | **Expression** (gesture, words, mode) | Delivery mode (spoken, whispered, mental, written), gesture or stroke, focus or implement, held or nearby | spoken or mental; swish and flick; wand | V, S, M as independent checks; focus may replace a non-costly M | structured formula vs direct shaping | spoken incantation, steps of the rite, written symbols |
| SG5 | **Intent** (aim and parameters) | Direction, magnitude, duration, boundary, destination | raise or tilt, destination for Accio | altitude change, target choice | direction, boundary, draw | the question asked, the addressee |
| SG6 | **Power source and cost** | Which account pays (SQ1 to SQ6), when the debit is final (on attempt, on continue, on settle), refund on interruption | stamina on attempt | slot spent only if the cast continues; Counterspell interrupt keeps the slot | mana draw on cast; overload spends and fails | spirituality; offerings and materials consumed |
| SG7 | **Execution form** | Stages that apply: bind, attempt, resolve, maintain, interrupt, end; sustain rule (concentration, duration, support) | support until released | concentration, 10 minutes; one concentration at a time | timed light condition | rite stages: prepare, rite, attempt, interpret |
| SG8 | **Access** (how the caster knows it) | Learned, prepared, copied, inherited, granted, ritual tag; readiness | lesson plus practice mastery | spellbook entry plus preparation after a rest; a Ritual Adept can cast a Ritual-tagged spell from the book unprepared | study plus control drill | sequence ability or taught method |
| SG9 | **Combination rules** | When parts compose: shared target, handoff condition, sustain owner, incompatibility reasons | lift then summon then release | concentration exclusivity (Mending ends Levitate) | output at most boundary | ritual layers graded met, substituted, partial, absent |

- **Canon test set (PFP17), held out now.** Hogwarts: the reserved V2 wand-light family (Lumos, Nox, the damaged-wand failure) plus Levicorpus, Liberacorpus and Mobilicorpus (the `-corpus` family). D&D: Feather Fall and Mage Hand from the same 2024 list. Mother of Learning: Magic Missile (chapter 46 reduced-output trial). LOTM: two of the nine divination rows (pendulum and dream). The grammar passes when it rebuilds most held-out items from parts alone.
- **Generated means runnable (PFP16).** A generated spell is a set of SG1 to SG9 values; it runs when every operation has a law for its target type and the cost account exists in W. Roots weight what the generator proposes (PFP18, fitted to the 117-record corpus); by default they suggest an operation and a trial proves it (dial: a world can make words binding keys, with that world as the reason).
- **What P needs from S next:** labelled parts on the 117 Hogwarts records (MC14 bulk lane), and the D&D and MoL rows above as the second and third consumers (MC9).

## 3. Quantities S reads and writes (list for W)

R = read, W = write. Each is an amount on a body, thing or place unless marked as a law field (PFP14).

| Code | Quantity | Where today | R/W | Note for W |
| --- | --- | --- | --- | --- |
| SQ1 | Stamina | native `vital` stamina; HP casts cost 1 | R, W | shared with every domain |
| SQ2 | Spirituality | LOTM Seer pool via `beSeerUse()` | R, W | an energy account by kind |
| SQ3 | Mana (Cyoria reserve) | simulation energy record `book.mol.zorian.reserve` | R, W | **duplicate:** the native header also shows a `0/0 mana` bar from the upstream character stats. Two quantities with one name; W should decide whether one is a projection of the other |
| SQ4 | Spell slots by level | `dnd_levitate.js` local state | R, W | an account with a recovery rule (long rest), not a timer |
| SQ5 | Concentration | `dnd_levitate.js` `support.until` | R, W | an exclusive hold on one active effect per caster; closer to an attention account than an amount |
| SQ6 | Mastery or practice | `state.simulation.powers.<actor>[power].mastery` | R, W | R owns advancement; S reads it for failure dials |
| SQ7 | Position, height and support of a target | world facts `board_aloft`, `board_tilted`, D&D altitude | R, W | physical state of things; a lift writes support, gravity and release read it |
| SQ8 | Custody of an item | weight, feather, practice wand | R, W | through the existing custody owner |
| SQ9 | Light level in a place | MoL light conditions on the slate | R, W | a place quantity C also asks for (W1) |
| SQ10 | Knowledge and observation | trial records, `understood` stages | R, W | through N's owners (MC8), not a quantity |
| SQ11 | Money and materials | D&D copying 100 GP, LOTM offerings | R, W | through inventory and M |
| SQ12 | Time | cast and copy durations, rite timing, moon phase | R | calendar and sky from W (OS6) |
| SQ13 | **Law field:** charm or ward on a place | Protego Totalum and camp wards (in the books, not in code) | R, W | scoped law, addable and contestable |
| SQ14 | **Law field:** ritual space | LOTM spirit wall and altar layers in `ritual_conditions` | R, W | a sealed place changes what rites can reach |
| SQ15 | **Law field:** active spell effect | Levitate support, concentration effect, light condition | R, W | an effect with an identity, a target and an end rule that other spells can read and end (Nox, Finite, Counterspell) |

## 4. Spellbook browser receipt

Script: [`scripts/spellbook_placement_browser.cjs`](../../../../scripts/spellbook_placement_browser.cjs). Evidence: [`evidence/`](evidence/) (`spellbook-placement.json`, `spellbook-placement-1920.png`, `spellbook-eligible-1920.png`).

- **Build.** `BUILD_OUT=<scratchpad>/site npm run build` from 9bbc51363 with no source changes; bundle SHA-256 `ce6b15b1369db1b3ae90d9010611873513ce53bbc0a37f82fa451590489cca60`. Tracked `dist/` untouched. Private packs linked read-only into the served copy.
- **Route.** Headless Chromium, 1920x1080, fresh localhost origin. Part 1: fresh hero in the Village. Part 2: earned private Zorian save `work/mol-xvim-friday-final-2026-11-08/after-xvim.save.json` (after Xvim's first Friday practice), at the supervised practice court.
- **Result: all 15 checks pass, no page errors.** Fresh: the panel node lives in its own `spellbook` workspace shell, no other panel host contains it, All panels lists "Spellbook · not here", hidden. Earned: listed as "Spellbook", unhidden at the court, opens from All panels as a centre view borrowed by the workspace's own centre-mode navigation (`center_modes.js`, with the back button), shows its controls, and Back returns it to its own shell.
- **Review state:** agent browser-verified, not human-reviewed. Not exercised: building, testing and recording a working in this build (this save has studied no light method), Hogwarts bench placement, save, reload, Export and Import of a working.
- **Earlier wrong turn, corrected.** My first load of that save failed with "Optional registration needs an explicit migration". The cause was the missing private packs in my served copy, not the save; with packs linked it loads.

UI findings for the embed phase (S owns `spellbook_ui.js`; not fixed in this inventory phase):

- **SF1 · No empty state.** With no method studied, the panel shows Test working, Cast next step and Record working with no line saying why nothing can run (UR70 to UR75, FLR3).
- **SF2 · Doubled heading.** The workspace shell titled Spellbook wraps a `details` whose summary is also Spellbook, so the player opens two disclosures for one panel.
- **SF3 · Listed before anything is known.** `LAYOUT_SPEC` describes the surface as opening "once a spell method is known", but `activeRules` admits it on place and seat alone.

## 5. What the rules could not express (backlog)

| Code | Gap | Level and done check |
| --- | --- | --- |
| SB1 | One canon record for a method (SI1): dictionary, power grammar, seam and ability records merged by reading, not copying | sonnet, medium; levitation exists once and both the lesson and the bench read it |
| SB2 | Target laws instead of named targets (SI2): lift reads mass and support of any object | sonnet, medium; a second object lifts with no new hook line |
| SB3 | Payment timing as data (SG6): on attempt, on continue, on settle, with refund rows | sonnet, medium; HP fizzle, D&D interrupted cast and MoL overload settle from one rule with three rows |
| SB4 | Active effects with identity that other workings read and end (SQ15); needs K's KB8 (several workings settling together) for Counterspell | sonnet, high; Nox ends Lumos and Counterspell ends a cast in flight through the same end rule |
| SB5 | `dnd_levitate` re-expressed as dictionary rows plus D&D world rules | sonnet, medium; its 13-action switch deleted, focused tests unchanged |
| SB6 | Divination and ritual as S grammar (OS7): rite stages as SG7, layers as SG9 | sonnet, medium; the 9 rows compile through the S grammar with no adapter of their own |
| SB7 | Part labels on the 117 Hogwarts records for P's corpus fit (MC14) | haiku bulk, high volume; labelled rows with locators and a spot-check pass rate |
| SB8 | Spellbook UI SF1 to SF3 | sonnet, low; rebuilt receipt at 1920x1080 |
| SB9 | Subword execution evidence (vocabulary V1 open question) | research, low; a scene where a fragment changes the result, or a recorded "unknown" |

Requests already raised by siblings that S answers in the embed phase: C's S1 (spells as K workings with a target role and an opposed-working comparison) is SB4.

## 6. Checks run

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test --test-concurrency=4` on 13 focused files (spell_working, spell_seam, spell_cast_lowering, lotm_be_spells, ritual_conditions, lotm_divination_rows, cast_divination_adapter, dnd_phandalin, dnd_phandalin_domain, lotm_self_ritual, hp_charm_bridge, learnable_spells_packs, source_engine_shapes) | 77 pass, 0 fail, 0 skipped | full `npm test` left to the integrator (MC7) |
| `BUILD_OUT=<scratch> npm run build` | pass, bundle hash above | none |
| `node scripts/spellbook_placement_browser.cjs 19613 docs/gm/dispatch/foundation-s-2026-11-12/evidence` with `SPELLBOOK_SAVE` set | 15 of 15 pass | see section 4 |
| `node scripts/check_doc_slips.mjs`, `node scripts/check_receipts.mjs`, `node scripts/check_player_text.mjs` | pass (0 slips in this file; receipts 0 problems; player text 0 new) | docs plus one browser script, no runtime source, so `check:arch` and full `check:rules` were not run |

Save compatibility (MC4): unchanged; no persistence touched.

## 7. Next phase

After K and W v0 merge to master: embed. Move the dictionary compiler onto `kernel_working` (method shape already close), replace world hooks with target laws (SB2), price costs from W accounts (SB3), then re-express `dnd_levitate` (SB5) and the divination rows (SB6) as the second and third consumers, and delete what the shared rules cover. Then the canon test on the held-out set in section 2.
