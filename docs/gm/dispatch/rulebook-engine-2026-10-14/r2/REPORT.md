# R2 effect DSL and SRD 5.2.1 pilot

2026-10-14. Proposal for root and Weibao review. Code branch:
`codex/rbe-r2-effect-dsl`, worktree `.claude/worktrees/rbe-r2`, baseline
`ba46670a`. No gameplay claim. Authority and scope: [COMMON](../COMMON.md),
[R2](../R2.md), and the root owner's EA6, EA7, EA9, EP4, EP9, MC5-1,
MC5-2, MC5-3 and RB4. No standing product direction changed.

## F1: delivered authoring contract (SHOWN)

New `src/effect_dsl.js` validates JSON-only discriminated records with strict
nested fields, finite units, bounded arrays, enums, source metadata and
cross-field checks (`src/effect_dsl.js:129`). Each effect carries target,
geometry, range, cast time, save/attack, damage/healing, conditions, duration,
concentration and components. Each record carries a function (does what,
carrier, needs, scale), support status and explicit missing semantics/questions.
Target and range live on the effect rather than being copied into its function.
The pack validator checks duplicate identities, condition references and grant
cycles (`src/effect_dsl.js:163`). Full field semantics are documented in
`src/data/srd521/README.md`.

Costly/consumed materials must have stock ID, quantity, minimum unit value,
consumption flag and no focus substitution (`src/effect_dsl.js:44`). Revivify
requires one 300+ GP diamond; Stoneskin one 100+ GP dust batch. Value is an
eligibility test on actual held material, not a coin debit or permission to
create stock. These are declarative stock requirements; no inventory mutation
or executable cast transaction is introduced.

Existing seams were read, not replaced: `rules.js`, `rule_modules.js`,
`gen_kit.js`, `tag_store.js`, `power_models.js`, `realm_traveler_profiles.js`,
`storylet_deck.js`, `conditions.js` and `active_effects.js`. The new validator
introduces no resolver, effect executor or random draws. GR1-GR17 were read;
there is no runtime generator in this lane. Banishment's future destination draw
is explicitly unresolved, so no random selection bypasses the shared kit.

## F2: canonical data and attribution (SHOWN)

Canonical input: the supplied main-checkout
`docs/research/tabletop-library-2026-10-14/private/text/dnd-srd-521.txt`.
SHA-256: `4456eaa81743ed341c13f19d1d7ced344a6adcbb15367941875ee45cd3f2e562`.
Edition 5.2.1 only. No secondary dataset was mixed in. MC5-2 cross-dataset
comparison remains unrun because this pilot used one canonical input.

Files: `src/data/srd521/conditions.json`, `spells.json`, `monsters.json`,
`ATTRIBUTION.md`, `README.md`. Each of the 45 records has source heading,
starting printed page, text hash, edition, positive adaptation revision,
`CC-BY-4.0` and the full required attribution wording. The notice preserves
Legal Information page 1's wording and declares our structured adaptations.
The [official SRD page](https://www.dndbeyond.com/srd) was also checked; it
links the English SRD 5.2.1 and identifies its Creative Commons release.
No non-SRD setting data was imported.

## F3: coverage (SHOWN data, INFERRED semantic classification)

“Supported” measures full representation in this pilot's documented schema,
not a running consumer or an independently accepted interpretation. A record
with any known untyped mechanic remains `needs_ruling`, even if its damage and
save are encoded. Ordinary source parameters, such as an applying condition's
duration, are not invented by the importer. All records pass the strict schema.

| Sample | Records | Supported | Needs ruling | Unsupported | Supported % |
|---|---:|---:|---:|---:|---:|
| All SRD conditions | 15 | 10 | 5 | 0 | 66.67% |
| Selected spells | 20 | 4 | 16 | 0 | 20.00% |
| Selected monsters | 10 | 3 | 7 | 0 | 30.00% |
| Total pilot | 45 | 17 | 28 | 0 | 37.78% |

This does not estimate coverage of the entire SRD spell catalogue. Sampling is
purposive: all eight schools and every level 0-5, including reactions,
concentration, upcasting, healing, costly consumed components, utility, death
and planar/spatial cases. Monster CRs are 0, 1/8, 1/4, 1/2, 1, 2, 4, 5 and 10.
Monster records carry abilities/saves, AC/HP, XP/PB, initiative, movement,
skills, senses, languages, gear, immunity and source attacks, with missing
traits/action choices explicitly flagged. No source record is silently treated
as a simpler complete monster.

### Pilot inventory

| ID suffix | Kind | Source page | Level / school or CR | Status |
|---|---|---:|---|---|
| `blinded` | condition | 177 |  | `supported` |
| `charmed` | condition | 178 |  | `supported` |
| `deafened` | condition | 181 |  | `supported` |
| `exhaustion` | condition | 181 |  | `needs_ruling` |
| `frightened` | condition | 182 |  | `supported` |
| `grappled` | condition | 182 |  | `needs_ruling` |
| `incapacitated` | condition | 184 |  | `supported` |
| `invisible` | condition | 184 |  | `supported` |
| `paralyzed` | condition | 186 |  | `supported` |
| `petrified` | condition | 186 |  | `needs_ruling` |
| `poisoned` | condition | 186 |  | `supported` |
| `prone` | condition | 186 |  | `needs_ruling` |
| `restrained` | condition | 187 |  | `supported` |
| `stunned` | condition | 189 |  | `supported` |
| `unconscious` | condition | 191 |  | `needs_ruling` |
| `acid_splash` | spell | 107 | 0 / evocation | `supported` |
| `fire_bolt` | spell | 132 | 0 / evocation | `needs_ruling` |
| `light` | spell | 144 | 0 / evocation | `needs_ruling` |
| `mage_hand` | spell | 145 | 0 / conjuration | `needs_ruling` |
| `shield` | spell | 161 | 1 / abjuration | `needs_ruling` |
| `magic_missile` | spell | 146 | 1 / evocation | `needs_ruling` |
| `cure_wounds` | spell | 121 | 1 / abjuration | `supported` |
| `detect_magic` | spell | 123 | 1 / divination | `needs_ruling` |
| `hold_person` | spell | 141 | 2 / enchantment | `supported` |
| `misty_step` | spell | 150 | 2 / conjuration | `needs_ruling` |
| `lesser_restoration` | spell | 144 | 2 / abjuration | `needs_ruling` |
| `silence` | spell | 162 | 2 / illusion | `needs_ruling` |
| `fireball` | spell | 131 | 3 / evocation | `needs_ruling` |
| `counterspell` | spell | 120 | 3 / abjuration | `needs_ruling` |
| `revivify` | spell | 159 | 3 / necromancy | `needs_ruling` |
| `dispel_magic` | spell | 124 | 3 / abjuration | `needs_ruling` |
| `banishment` | spell | 112 | 4 / abjuration | `needs_ruling` |
| `stoneskin` | spell | 165 | 4 / transmutation | `supported` |
| `cone_of_cold` | spell | 117 | 5 / evocation | `needs_ruling` |
| `wall_of_force` | spell | 172 | 5 / evocation | `needs_ruling` |
| `cat` | monster | 346 | CR 0 | `needs_ruling` |
| `bandit` | monster | 261 | CR 1/8 | `supported` |
| `wolf` | monster | 364 | CR 1/4 | `needs_ruling` |
| `black_bear` | monster | 345 | CR 1/2 | `supported` |
| `brown_bear` | monster | 346 | CR 1 | `needs_ruling` |
| `ogre` | monster | 312 | CR 2 | `needs_ruling` |
| `guard_captain` | monster | 296 | CR 4 | `needs_ruling` |
| `hill_giant` | monster | 298 | CR 5 | `needs_ruling` |
| `troll` | monster | 333 | CR 5 | `needs_ruling` |
| `young_red_dragon` | monster | 318 | CR 10 | `supported` |

### Every needs_ruling question

These are representation/adapter decisions, not permission to change the SRD.
Each question is also stored on the record with a stable ID.

| Record | Question ID | Ruling question |
|---|---|---|
| `srd521.condition.exhaustion` | `q1` | Which level-counter, rest and death adapters will preserve the 5.2.1 penalties, six-level death and per-rest recovery? |
| `srd521.condition.grappled` | `q1` | How will grapple source/range, free appendage, escape DC and size-based drag cost bind to actor and movement records? |
| `srd521.condition.petrified` | `q1` | Which body and equipment adapter applies the tenfold weight and stopped aging while retaining nonmagical equipment identity? |
| `srd521.condition.prone` | `q1` | How will movement spending implement crawl and half-Speed standing, including the zero-Speed prohibition? |
| `srd521.condition.unconscious` | `q1` | How will removal of Unconscious retain Prone without retaining Incapacitated or other temporary grants? |
| `srd521.spell.fire_bolt` | `q1` | Which object flags and Burning consumer implement ignition without igniting carried or worn objects? |
| `srd521.spell.light` | `q1` | How will light radii, opaque covering and ownership restrictions bind to the visibility system? |
| `srd521.spell.mage_hand` | `q1` | How will the remote hand bind actual stock, container locks and the ten-pound carrying limit without duplicating items? |
| `srd521.spell.shield` | `q1` | At which reaction boundary is the triggering attack reevaluated and Magic Missile prevented? |
| `srd521.spell.magic_missile` | `q1` | How are individual darts allocated and resolved simultaneously, including Shield prevention and concentration checks? |
| `srd521.spell.detect_magic` | `q1` | How will hidden magic, visible aura inspection and each material thickness barrier map to knowledge facts? |
| `srd521.spell.misty_step` | `q1` | Which position and sight checks validate the unoccupied teleport destination? |
| `srd521.spell.lesser_restoration` | `q1` | How is exactly one eligible condition selected and removed while the other conditions remain? |
| `srd521.spell.silence` | `q1` | How will full-body containment and sound paths drive immunity, Deafened lifetime and Verbal component refusal? |
| `srd521.spell.fireball` | `q1` | Which Burning and stock-ownership adapter ignites only eligible objects in the sphere? |
| `srd521.spell.counterspell` | `q1` | How is a failed-save cast cancelled after spending its action but before expending its spell slot? |
| `srd521.spell.revivify` | `q1` | Which death/body record validates the one-minute window and old-age exclusion, and restores exactly 1 HP without missing parts? |
| `srd521.spell.dispel_magic` | `q1` | How are ongoing spells enumerated and separately checked, retaining effects not created by spells? |
| `srd521.spell.banishment` | `q1` | Which world adapters choose the associated plane and addressed random destination, and restore early-return occupants without collisions? |
| `srd521.spell.cone_of_cold` | `q1` | Which body-state adapter represents a frozen corpse and decides when it thaws? |
| `srd521.spell.wall_of_force` | `q1` | How are legal contiguous shapes, forced-side placement and the Disintegrate-only destruction rule represented in spatial and planar consumers? |
| `srd521.monster.cat` | `q1` | How does the movement adapter substitute Dexterity for Strength when calculating Cat jump distance? |
| `srd521.monster.wolf` | `q1` | How will the predicate adapter require both a hit and eligible size for Prone, and a nearby non-Incapacitated ally for Pack Tactics? |
| `srd521.monster.brown_bear` | `q1` | How will the condition predicate require both a hit and a Large-or-smaller creature before granting Prone? |
| `srd521.monster.ogre` | `q1` | How will melee and thrown Javelin use share the same three actual javelins, including recovery after throwing? |
| `srd521.monster.guard_captain` | `q1` | How will Multiattack choose two Longsword/Javelin attacks in any combination while sharing six javelins across modes? |
| `srd521.monster.hill_giant` | `q1` | How will the adapter choose any two attacks and enforce both hit and size before applying Tree Club Prone? |
| `srd521.monster.troll` | `q1` | Which turn scheduler and body adapter coordinate regeneration suppression, death, four-per-rest limb spawning/Exhaustion and half-Speed Charge? |

## F4: importer trial (SHOWN)

`tools/import_srd521.mjs` accepts one spell block, canonical page and full-text
file, emits a draft plus `validation.valid/errors`, and never writes accepted
data (`tools/import_srd521.mjs:46`). Every draft is `needs_ruling` and explicitly
unaccepted, even when its shape passes. Unsupported header syntax fails instead
of guessing. `tools/trial_srd521.mjs:8` reproduces the bounded trial and compares
effects, function and spell fields to the source-reviewed pilot.

The source's two columns were separated, footer/blank lines removed, and 20
single-spell blocks saved in the ignored `private/source_blocks/`. This is
layout normalization, not semantic repair. Only descriptions from the spell
section are used, not class spell-list mentions. Raw blocks stay private.
The full-text hash remains the original unnormalized file's hash.

**20/20 drafts validated structurally; 20/20 needed semantic correction before
use. Zero human fixes or approvals were observed.** Thus the “needs a human fix”
count is 20 if human/review-lane correction is the acceptance gate, not a claim
that a human has already corrected them. Agent-authored source reconciliation
produced the shipped proposal records; human/root acceptance remains open.
All 20 differ from their drafts in `effects` and `function`. For example, Acid
Splash needs its area and scaling; Cure Wounds needs healing; Light needs
lighting/eligibility; Hold Person needs Humanoid targeting, condition and
repeat saves; Revivify needs death-window and body limits. Passing schema alone
would miss these. The three-state classification is retained after correction,
so 28 whole records still carry explicit adapter/ruling gaps.

Evidence: [IMPORT_TRIAL.json](IMPORT_TRIAL.json). Reproduce from this worktree:

```sh
node tools/trial_srd521.mjs \
  /Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/rulebook-engine-2026-10-14/r2/private/source_blocks \
  /Users/weiwei/code/yet-another-idle-rpg/docs/research/tabletop-library-2026-10-14/private/text/dnd-srd-521.txt
```

The importer CLI was also exercised independently on the raw Revivify block:
valid draft, real 300+ GP consumed diamond requirement, review still required.

## F5: verification and boundaries

Focused: `node --test tests/effect_dsl.test.js`, **93/93 pass**. Includes all
45 shipped records and attribution; full pack links; every school/level/condition;
malformed metadata, nested shapes, units, dice, enums, reactions, concentration,
scaling and statuses; stock substitution refusal; duplicate/dangling/cyclic
references; JSON-only boundaries; 5.2.1 edition regressions; deterministic importer,
invalid header rejection and costly material parsing.

Full repository check: `npm test` once, exit 0, **1,852 tests: 1,849 passed,
0 failed, 3 TODOs**, 77.69 seconds. The TODOs name legacy RNG behavior in native
combat, local-life search/contact and encounter/loot/craft/market/gather. They
are outside this lane. No full-suite rerun was used. `git diff --cached --check`
also passes; staged changes contain only this lane's nine new files.

No build, dist write, browser run, gameplay integration, save read/write,
installation, merge or push. No persistence shape changes, so existing saves
remain inert. Source-only tests do not close native gameplay acceptance.
EP9 lazy world loading is not implemented; portable licence-bearing pack data
are supplied for a later consumer. Runtime cast/stock transactions, condition
execution, remaining questions, independent semantic review and root/director
acceptance remain OPEN. No need to rebuild this lane to test gameplay because
it deliberately has no gameplay consumer.

Commit: `186b553f75d4448a7659a44f31bf73314ffd032a`
(`Add inert effect DSL and SRD 5.2.1 pilot`). Worktree clean after commit.
Only the nine named new code/data/test/tool files were staged. Lane reports
remain in the main checkout and were not staged or committed, per COMMON.
