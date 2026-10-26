# Effect-first UI descriptions, 2026-10-25

## Scope and ownership

User requested standing description rules and a base-game comparison, prompted
by Attack power and Intuition screenshots. This task owns the UR70–UR74 addition
and its routing/direction hunks. Existing dirty research/tooling and shared-doc
edits are preserved. Applies UR40/42/43/47/49/59, AD6–AD8/32/34/36/40 and the new
UR70–UR74. No runtime changes, commit, publication or app adoption selected here.

Future visible outcome: at the existing 1920×1080 desktop target, an inspection
opens with what the subject represents and changes. Useful effects and numbers
follow, with calculation details available through the existing inspection
route. Mobile optimization stays deferred. This document is not browser proof.

## F1: What the base game does

Here “base game” means upstream YAIR, distinct from the Proto23 visual reference.
Inspected the locally available upstream/master snapshot
`e3356432ad5112f30842cfe6a6b5c3a4ced77de9` (v0.5.5.30, dated 2026-06-23).
This is a pinned source comparison, not a claim about the latest online release.

- [Upstream index.html](https://github.com/miktaew/yet-another-idle-rpg/blob/e3356432ad5112f30842cfe6a6b5c3a4ced77de9/index.html#L822-L884)
  gives Strength, Agility, Intuition and Attack power short practical explanations,
  followed by a separate `stat_breakdown`. Strength explains physical attack
  power; Intuition mentions hit/evasion benefits and magic.
- Upstream `src/skills.js` provides `description` separately from
  `get_effect_description`; Unarmed combines playful descriptive prose with
  explicit numerical effects. `src/display.js` updates the effect description
  through `update_displayed_skill_description`.

Lesson: reuse the separation of meaning, effects and calculation. The evidence
does not establish a universal upstream trait template. Do not copy every
upstream claim: its magic wording is not proof of a current OOPS magic consumer.

## F2: What is wrong in the screenshots

`src/display.js`, `readPlayerAttributeInspector`, uses a generic implementation
description for Intuition and a formula/debug explanation for Attack power.
`src/proto23_shell.js`, `attributeExplanation`, displays repeated unit, base,
pre-multiplier and neutral multiplier rows, then an empty-modifier message.
Those details explain representation before they explain why the player cares.
Useful calculation fidelity should be retained in supporting detail.

## D1: Standing writing contract

[UR70–UR74](../../UI_RULES.md#descriptions-explain-the-experience-and-effect-2026-10-25)
are the owner. Default reading order is name, concise meaning/effect, relevant
current effects and conditions, then useful calculation/source detail. Narrative
means concrete character experience and world voice, not a paragraph of ornament.
Traits deserve identity and manifestation as well as exact effects, including
drawbacks and activation conditions when present.

## E1: Example copy, not implemented text

| Subject | Proposed opening | Supporting information |
| --- | --- | --- |
| Intuition | “Your sense for the flow of a fight. Helps you land attacks and evade incoming blows.” | Current value; contributions to attack and evasion ratings; actual matchup determines chances. `src/models/person.js` uses square-root Intuition in both ratings. Do not add a magic benefit without its actual consumer. |
| Attack power | “The force behind your attacks. Your strength and weapon shape its power; exhaustion weakens your blows.” | Current power, equipped or unarmed contribution, strength scaling, relevant modifiers and stamina condition. Final damage also depends on the target and hit outcome. |
| Trait template | “[How the quality manifests in you.] [What it helps or changes, including a meaningful tradeoff.]” | Actual active effects, conditions, duration or source when relevant and known. This is a writing template, not a new trait or mechanic. |

An active quality, a dormant quality and an unknown quality need distinct copy
when their actual owners distinguish those states. Known flavor can remain
descriptive; unsupported gameplay promises need correction rather than invented
effects. Numerical claims must use the existing effect owner, not fresh UI math.

## Verification

Documentation-only input: this report, UI rules, rule index, player-UI routing,
and bounded USER_VISION/PROJECT additions. Source comparison used `git show`
against the pinned upstream commit; current formula tracing used the inspector,
shell renderer and `src/models/person.js`. Checks and results are recorded below.
Runtime rewriting and rebuilt browser verification remain outside this change.

- `npm run check:rules`: PASS, 24 register rows, 42 AD codes, 140 relative links. One expected warning: this newly created report is not yet tracked by Git.
- `git diff --check`: PASS. No runtime suite/build/browser run needed for documentation-only changes.

## Implementation round, user-selected 2026-10-25

User selected runtime implementation for current tooltips and descriptions,
especially stats and traits, preserving calculations and checking in game; also
invoked sharpen and more-to-consider and requested other-game comparisons.
Reservation: player_attribute_definitions, display attribute projection hunk,
proto23_shell attribute renderer hunk, character_bio projection/renderer,
lineage trait description projection/renderers, focused tests and proof script.
Seam: existing read-only attribute and biography projections, existing shared
hover/inspector renderers. AR1–AR16; UR40/42/43/47/70–74. No mechanics or saved
state changes. Desktop outcome and deferred mobile scope above still apply.

### Other games: bounded primary-source comparison

- [Grim Dawn official character guide](https://www.grimdawn.com/guide/character/character-basics/)
  explains the role of each attribute and then quantifies what points add. Its
  Physique entry joins physical conditioning to health, recovery, defense and
  equipment requirements. Inference for OOPS: start with practical meaning,
  retain exact current effects, and explain ratings without copying its rules.
- [Larian's BG3 Patch 3 notes](https://baldursgate3.game/news/patch-3-mac-support-magic-mirror-more_93)
  document clarification of resistance/vulnerability/immunity and removal of
  concentration warnings where irrelevant during level-up. Inference for OOPS:
  distinguish nearby terms and qualify warnings by their actual context.
  These patch notes establish those improvements, not a complete BG3 UI audit.

UR75 records terms/comparison clarity as the additional standing rule. Existing
UR43/71/74 already cover progressive disclosure and stable inspection; no new
nested-tooltip system is needed for this implementation.

### More-to-consider round 1

**ACT NOW (done in source):** restore trait prose alongside capability numbers;
stop calling cosmetic traits inactive; supply meaning for every inspector stat;
keep calculations expandable; make stat previews pinnable by click/Enter so
those details are actually usable. The first browser attempt caught the missing
stat pin route. Preserve an expanded calculation and its reading position across
same-subject updates. Exact browser/check results follow below.

**ACCOUNT FOR NOW:** observer-safe source filtering and concealed appearances
remain in their owners. Inherited phenotype descriptions do not expose unknown
alleles. The shared lineage view has creature consumers, so their prose avoids
promising humanoid stat benefits to brood creatures. No saved fields or game
mechanics change; trait scenes use separate generated fixtures. Reference
wording is precedent, not proof that OOPS implements that mechanic.

**LATER / DELEGATE:** an inline glossary/reference-link pass for world-specific
vocabulary is useful if recurring unfamiliar terms remain. Capability: Luna-low
for a bounded inventory, Sol-medium for integration judgment; effort: small
inventory followed by a scoped implementation; done check: the named vocabulary
is explained through existing reference navigation with keyboard return and no
hidden knowledge disclosure. This follow-up is recorded, not dispatched.

### Final local receipt, 2026-10-26

Implementation is **agent-verified, not human-reviewed**. Final runtime input is
identified in [the SHA-256 manifest](evidence/input-identity.json). The final
browser loaded `v0.6-31ec61169638`. Existing unrelated desktop/tooling/research
work was preserved. No commit or push was created by this task and the installed
normal app was not changed.

Changed runtime owners: player_attribute_definitions (all 39 attribute meanings
and three XP descriptions), display (description/calculation projection plus
original stat descriptions), proto23_shell (shared preview/full inspector,
calculation disclosure, click/Enter pin and Escape focus return), character_bio
and character_bio_ui (authored narrative plus effects/origin and known
inactive/suppressed notes), body_progression/expedition_content (bounded trait
copy), lineage_traits/lineage_domain/household_brood_ui (phenotype prose and
inheritance detail), style.css (biography obeys selected text size). Existing
skill/item and world-authored descriptions remain their content owners; this is
not a rewrite of every authored passage in every world.

No save schema or gameplay changes. Source filtering still hides unawakened
qualities. A known dormant/suppressed quality keeps its identity while stating
its current effect status. Cosmetic marks are not called inactive. The first
larger-text screenshot exposed biography's fixed 14px override, now repaired;
final assertions check actual text size for both stats and trait prose.

| Check | Final result | Boundary |
| --- | --- | --- |
| `npm run build` | PASS, final bundle above | Local web bundle; no packaging/install claim |
| `node --test tests/player_attribute_descriptions.test.js tests/character_bio.test.js tests/body_progression.test.js tests/lineage_traits.test.js` | PASS, 26 tests | Includes active/cosmetic, unknown, known dormant and suppressed traits and phenotype privacy |
| `npm test` | PASS, 3,218 tests, 0 failures | [Count receipt](evidence/tests-summary.txt); final runtime inputs in manifest |
| `npm run check:arch` | PASS | [Receipt](evidence/arch.txt); existing grandfathered cycles remain |
| `npm run check:rules` | PASS | [Receipt](evidence/rules.txt); new report is untracked, producing one expected warning |
| `node scripts/ui_descriptions_browser.cjs` | PASS, no page errors | [Native browser result](evidence/result.json); fresh origin, 1920×1080, actual 14/18/21px text, generated trait/family fixtures, numeric details, keyboard access and Escape return, no progression mutation, native Save/reload |
| `git diff --check -- <task source/test/doc paths>` | PASS | Whole-diff check also encounters generated esbuild bundle whitespace inside preserved upstream string content; generated output was not hand-edited |

[Default stat preview](evidence/intuition-hover-1920.png),
[attack calculation](evidence/attack-calculation-1920.png),
[trait prose and effects](evidence/trait-narrative-1920.png),
[21px traits](evidence/traits-21px-1920.png),
[inheritance details](evidence/inheritance-details-1920.png).
Screenshots were visually inspected, including the corrected 21px biography.
Trait/family fixtures are DEV SEEDED; they do not prove natural acquisition.
Dormant/suppressed projection behavior has focused test evidence rather than a
separate natural gameplay journey. Human taste remains optional feedback under
AD42. Mobile work stays deferred.

Reproduction: start `python3 -m http.server 18847 --bind 127.0.0.1`, rebuild,
then run the browser script. The temporary proof server is stopped after checks;
its test origin was separate from the player's app and saves.

## Later authorized adoption and logo publication, 2026-10-26

Weibao subsequently selected normal-app adoption and Electron-logo commit/push.
[Adoption receipt](APP_ADOPTION.md) supersedes this report's earlier local-only
app boundary. The only additional served-page correction routes icons to the
existing local font; the description bundle is unchanged. Logo/icon publication
excludes the dirty description implementation. The separate rules-consideration
chat has completed its linked proposal report.
