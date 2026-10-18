# R5 report: SRD start and first D&D rulings

2026-10-14, revision 1. Research/design documents delivered; all product choices remain **proposed** pending root and Weibao review. Existing owners, source library, game code, builds, saves and staging were not edited by this lane. No commit, publish, acquisition, other-chat message or delegated worker.

## Changed

| Return | New artifact | Result / root trace |
|---|---|---|
| R5-F1 | [SRD521_START](../../../../worlds/dnd/SRD521_START.md) | Frozen `dnd.st2.srd521@1`: Human Sage Wizard 1 at PS01, complete origin scores/proficiencies/features, cash/equipment custody and weight, spell acquisition/preparation/counters, observed knowledge and proposed job/object fixture. RB4, RB9, L1, A1-acc/A2-acc |
| R5-F2 | [RULINGS_LEDGER](../../../../worlds/dnd/RULINGS_LEDGER.md) | 28 revision-1 records, each with question, proposed ruling, locator and `proposed` status. Explicit GM delegations separated from rule applications and authored policies. Covers the noncombat ST2 PS01–PS06 fixture and its alternatives. RB12, A3-acc, GM1/GM5/GM7 |
| R5-F3 | [STORYTELLER_STYLES](../../../../worlds/dnd/STORYTELLER_STYLES.md) | Module, sandbox, narrative and lethal menus name actual data, weights, pacing, budgets, composition, continuity and receipt obligations. All four stay reachable; lethal does not invent a supported lethal encounter or remove person-specific fate. GMA1, GM1–GM7 |
| R5-F4 | [Private source registry](private/LOCATORS.json), [reference text](private/SOURCE_EXCERPTS.md), [snapshot](private/START_SNAPSHOT.json) | Two pinned source hashes; 20 locator groups with exact one-based PDF pages and LF text line ranges. Selected-page captures preserve full reference detail; only headings used by the public claims were inspected. Private records are gitignored |
| R5-F5 | SRD521_START shipping table and attribution block | SRD data may ship under CC-BY with its notice, source/version and change record. Original fixture/policy is authored content. Phandalin/Realms setting facts remain separately sourced, paraphrased research/private adaptation, not SRD-granted shipping data. Public setting alternatives need independently original content, not close adventure paraphrases. RB4, A1-acc |

## Findings and corrections for the coordinator

R5-C1: The named `docs/audits/WORLD_CORE_KIT_CORE_AUDIT.md` is a repeatable audit procedure/run log, currently 75 lines, with no D&D section or DDC rows. The actual DDC1–DDC31 list is [world-depth part 02](../../../../worlds/world-depth-2026-10-13/02_MOL_HP_JJK_DND.md), D&D section and later addenda. Read that list instead; retain its general-knowledge/proposal labels. No existing file was altered to hide the reference mismatch.

R5-C2: Mending has an instantaneous effect but requires concentration and Magic actions during its one-minute casting. ST2 legally learns it as one of three Wizard cantrips. Its two lodestones are unpriced and unconsumed, so the owned Wizard focus covers M; V/S and target access still apply. It needs no slot or success roll for an eligible completed effect. See L03/L08/L09 and RL08–RL11.

R5-C3: DDC12's claim that a backup costs the full copying price does not match this profile. SRD 5.2.1 p78 separates new-spell transcription (2 hours and 50 GP per level) from copying an already known spell/book (1 hour and 10 GP per level). Training, a lesson, a prepared spell, a physical book and an executable spell remain separate states.

R5-C4: DDC3's proposed automatic lifestyle/access consequences are not inherent SRD rules. Page 101 leaves consequences to the GM. DDC15 needs the revised Heroic Inspiration wording: immediate reroll of any die, use the new result; Human Resourceful grants it after a qualifying Long Rest. Page 102 also explicitly prices hired cantrip services at 30 GP. The proposed 1 GP delivery commission is not a sourced retail spellcasting price.

R5-C5: DDC31's hemp/silk rope distinction was not imported into the pinned profile; this SRD has the `Rope` entry. DDC29's ability-check total-versus-DC rule is preserved; natural-20 automatic success is an attack-specific rule, not a generic check rule. No old-edition lookup silently supplies the missing detail.

## DDC reconciliation

| Existing consideration | R5 disposition |
|---|---|
| DDC1/12/13/15 | Source-qualified subset for Wizard access, inspiration and Short Rest references; no implemented rest loop. Ritual rules are distinct from Mending. Long Rest/death/full recovery remain future qualification |
| DDC2/19/22–26/30 | Setting calendar, era, planar variants, sealed proposal ID and local colloquial behavior remain setting/authored or unqualified. Relative test day is not a verified DR/Harptos date. No sealed truth read, created or reported |
| DDC3/6/27/28/29/31 | Selected current-profile economy/components/currency/check references qualify this fixture only. No automatic lifestyle gate, special electrum refusal, hemp/silk split, pickpocket schedule or room hazard was adopted |
| DDC4/5/7–11/14/17/18/20/21 | Future horizons retained, not new gates for this unit: downtime learning, finite shrine services, resurrection/attunement, bastions, canon factions, full hireling/party/sidekick rules, crossings and other starts. A Commoner template alone grants none of them |
| DDC16 | Narrator/data menu proposed. No UI, dice animation, sound, panel or rebuilt-viewport evidence |

The speculative DDC5+DDC6 shrine taste does not replace the live FIRST_SLICE A1 ST2/repair priority. Existing one-realm/one-prestige and desktop-first priorities remain in force. This lane introduces no new accepted direction that would require a PROJECT or USER_VISION edit.

## Proposed edits to existing owners, not applied

| Owner | Proposed bounded edit |
|---|---|
| `docs/worlds/dnd/SOURCE_CONTRACT.md` | Link this source-qualified ST2 packet; pin SRD 5.2.1 for this proposed start only; add origin/acquisition/component/long-casting references and per-source license tier. Include current attribution/change requirements without claiming setting coverage |
| `docs/worlds/dnd/FIRST_SLICE.md` | Mark ST2 origin audit as source-qualified proposal; link frozen snapshot, job/object fixture and RL records. Retain ST1/ST3, setting chapter, implementation and native/persistence gates as OPEN. Clarify Mending's concentration during casting and retail casting-service price |
| `docs/worlds/dnd/FOUNDATION.md` and `COVERAGE_MAP.md` | Link R5 without promoting it to accepted fiction or gameplay. DND02/06/07/09/10/14 gain bounded design evidence only; broader era/event/cosmology/other-start coverage remains unresolved |
| `docs/gm/dispatch/dnd-world-2026-10-11/CHECKPOINT.md` | Resume with R5 as the qualified ST2 rules subset. Preserve full A1's unread setting-chapter and unfinished implementation contracts; root decides the next finite unit |
| Audit routing / `docs/worlds/world-depth-2026-10-13/02_MOL_HP_JJK_DND.md` | Fix the prompt's DDC owner link. Reconcile DDC3/12/15/31 against R5-C3–C5 and preserve dated prior wording. Do not turn speculative shrine/bastion/planar proposals into required first-slice work |

## Checks and evidence limits

[Private validation](private/VALIDATION.json): **113 passed, 0 failed** documentation/source/arithmetic checks. These include standard-array/background math, modifiers/saves/skills, derived HP/AC/initiative/perception, inventory/currency/load arithmetic, acquisition/preparation counts, all selected spells' membership in the SRD Wizard list, both source hashes, all 20 exact page-to-line locator groups, all 28 required ruling records, all four style rows and private ignore coverage. The first locator check exposed a page-end LF off-by-one in the generated index; corrected the index and passed the complete check. A later field check prompted an explicit L01 legal locator on RL28; final set passes. These checks are not source-code tests or gameplay acceptance.

Final link/style/path checks: **45 passed, 0 failed**, including 28 local links across five public artifacts. Artifact hashes are recorded in [FINAL_CHECKS](private/FINAL_CHECKS.json). Private capture and verifier remain outside git. Public documents paraphrase the rules except the SRD-required open attribution notice. Official [SRD index](https://www.dndbeyond.com/srd), [PDF](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf) and [CC-BY deed](https://creativecommons.org/licenses/by/4.0/) were checked live on 2026-10-14 for attribution/source boundary, while rule qualification used the pinned local private text.

**OPEN authoritative next gate:** root/Weibao review of these proposals. Runtime E01–E07, connected PS01–PS06 consumer proof, rebuilt fresh-origin desktop behavior, failed-publication checks and save/reload/import are all unrun. The requested R5 research unit is complete; full A1 and faithful Phandalin-era play are not. No build, browser, runtime test or user-save interaction occurred, as COMMON excludes gameplay proof from this wave.
