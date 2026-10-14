# B3 source and authority audit

2026-10-14. Docs only, source read, no gameplay verification. Checkout:
`codex/gameplay-foundations`, HEAD `5c084e50c`, with pre-existing shared dirty
state and active workers. Locators describe the live files read in this session,
not necessarily committed HEAD. Only `b3/` is writable for this lane.

**F1:** estate inheritance is already implemented in source. **F2:** the wired
heir path rebuilds expansion state and does not carry bloodline or soul faculties.
**F3:** biography is deliberately lossy and cannot become inheritance authority.
These findings narrow the missing work; they do not select G30 as prestige.

## Authority and scope

| Code | Owner and evidence | Consequence for B3 |
|---|---|---|
| B3-A01 | **Stated accepted:** `PROJECT.md:228,303-304,320-323,335-350`; `docs/USER_VISION.md:96-102,133-139`. One realm/one prestige layer; prestige separate from travel/ascension; reset/retention undecided; heirs optional; old heir-only scope may change. | G30 is a candidate carrier for that one layer. Succession, death and prestige are separate operations. No forced reproduction, death, reset or extra prestige currency. |
| B3-A02 | **Stated accepted:** `docs/RULES_FROM_SCRATCH.md:35-71,164-188`. Inherit actual leftovers; knowledge needs a carrier; bodies matter; each world sets its rules. | Inventory, transmission, teaching and recognition need distinct causes. “Default” below means an illustrative setting until a world supplies its own. |
| B3-A03 | **Stated proposal:** `docs/GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md`, G1, G11, G15, G26-G30, G32/MS6, G34; `docs/LIFE_SIM_NORTH_STAR.md:2421-2443,5210-5251`. | Extend G30 with subcodes. Do not replace G1-G42, impose universal dilution, force flaws, or collapse L2/L4/L12. BP3 is ancestral information; MS6 here means the genetics palette's soul lineage, distinct from part 22's reused MS codes. |
| B3-A04 | **Stated proposal:** `docs/worlds/SUCCESSION_BY_WORLD.md`, “Patterns across the books” and world table; `docs/research/DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md`, R/F/G/B; `docs/STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md`, P1-P4. | Preserve separate trigger/anchor/carry/cost/witness/exit, coherent start history and frozen generated facts. Succession's U/G qualifiers and attributed generalizations are not universal canon laws. No sealed detail is needed. |
| B3-A05 | **Stated proposal:** `docs/RNG_ENCOUNTERS_AND_SOURCE_DEVELOPMENT.md:73-101`; prior `body-lineage-expansion-2026-10-11/INTEGRATION.md`, reconciliation/teaching/succession. | Ancestry, awakening, actual structure, control and technique remain separate. Current source has more faculty state than the older RNG audit describes; see B3-A11. Unique hereditary instances and retention are still missing. |

The required life-sim sections were read: “Sex, gender and bodies”, “Bodies,
constitutions and sex”, “Layers of a person” and the gimmick checklist. Their
earlier preferred trade-offs/purity examples are proposals under the later
rulebook and G11-G15, not mandatory costs or genetics laws. Body sex,
reproductive role, gender, legal heir status and faculty eligibility must not be
inferred from one another. B2 owns the fuller proposed body-record split.

## Live implementation map

“Shown” means inspected executable source or validator, not an observed browser
result. “Inferred” identifies a consequence of the inspected call chain.

| Code | File:line and shown behavior | Inference / missing seam |
|---|---|---|
| B3-A06 | `src/heir_inheritance.js:32-65,68-93`: counts saved bag/chest plus host-supplied worn item keys, settles Village kit debt from coins, transfers the remainder, Shack availability, truncated half positive or negative reputation, three possible written/taught lessons and two elder obligations. Recipient is apprentice if anything was taught, otherwise kin. | An actual estate slice exists. Half standing, shortfall write-off and automatic recipient choice are local proposals, not accepted universal rules. No parentage, concentration, clan registry, inherited constitution, curse or BP8 reward is counted. The 512-row truncation is a current local boundary, not a model for a larger conserved estate. |
| B3-A07 | `src/chronicle.js:288-314`: fresh chronicle, empty knowledge except taught apprentice lessons; paper lessons remain studyable; generation and predecessor grave retained; elder remembers named obligations/archive succession. `src/chronicle.js:27-30` validates that bounded inheritance shape. | Some memory/standing survives by explicit construction. This does not preserve the whole NPC society, learned mastery or soul. “Kin” is not a verified descendant relationship. |
| B3-A08 | `src/life_experience_host.js:11-29`: clone a fresh envelope, keep prior calendar, create expansion from prior RNG, initialize expedition, make chronicle at clock zero, apply leftovers; copy options, `npc_lives`, and life record, append legacy prose. | Wider expansion worlds, people, claims, sources, projects, conditions and techniques are not copied by this function. Whatever the fresh envelope supplies remains fresh. Inheritance into the same enduring world needs additional ownership work. Reset expansion timestamps cannot simply be pasted onto retained living owners. |
| B3-A09 | `src/main.js:1621-1652,8142`: preview derives leftovers; begin saves predecessor and writes a separate schema-1 `heir request`; reload builds a fresh successor through `buildLifeHeirSave`, then guarded import/preflight; request is cleared after success or replaced with an error. `src/chronicle_ui.js:58-59,121-135` exposes the heir action and bequest display. | The heir is wired, contrary to older “unwired/one lesson” notes. Separate predecessor/request/import writes are not a proven atomic crash-safe transaction. A future succession ID must bind a frozen offer to the exact predecessor and detect already committed successors. |
| B3-A10 | `src/life_record.js:1,10-29,32-46,65-81`: expressly non-authoritative biography; 64 recent entries, 200 year summaries, four highlights/year, older counts; missing records begin at loaded date without invented history. | Do not parse prose or count remembered events to grant concentration, BP3 fragments, rewards, ancestry or deeds. Keep typed causal evidence outside compaction; biography can render its public aftermath. |
| B3-A11 | `src/capabilities.js:4-5,41-66`; `src/expansion_engine.js:198-206`; `src/simulation_effects.js:321-333`; `src/simulation_contracts.js:253`: bloodline source kind, inherited/trained/acquired provenance, one source per actor/definition; faculty awake/active/suppressed/development state gates capability grants. | Reuse lifecycle checks instead of another parallel activation system. No hereditary source identity, transmission moment, soul binding or per-function inheritance schema exists here. Capability queries read the current registry definition, not a historical frozen grant; definition revisions require explicit compatibility. |
| B3-A11a | `src/body_progression.js:15-18,32-62`: Natural balance is an inherited-origin trait with explicitly uncertain ancestry; trained grip and acquired palm mark have separate provenance, paid awakening/practice/recovery and observer feedback. | Concrete innate-function and teaching/body consumers exist. The inherited label is not a parent-child record or an inheritance algorithm, and this path does not make the successor receive that trait. |
| B3-A12 | `src/simulation_effects.js:335-353`; `src/power_models.js:38`: executable powers have fragments/mastery and `lineage` populated from constituent definitions; copy/transfer are distinct and transfer removes donor ownership. | This lineage is power composition, not genealogy. Fragments are not automatically BP3 memory. Reuse functional handler/copy semantics only where a selected transfer actually supplies the required means. |
| B3-A13 | `src/simulation.js:555-608`; `src/simulation_contracts.js:191-193`: generic transition kinds include rebirth; explicit reset list removes selected domains, rebirth marks person alive/born now and requires chronicle end policy; campaign claims/RNG/causes/receipts remain. | Generic rebirth support is not a complete heir/body/soul retention profile. No production `kind: rebirth` definition was found by the targeted source search. A transition label cannot reconstruct a native heir estate or prove playable resurrection. |
| B3-A14 | `src/frontier_campaign.js:62-66,95-107`: field renewal is `kind: replay`, retains living protagonist, lowers Load-bearing Step mastery to 1, empties two reserves and grants field legacy. `src/structured_renewal.js:23-49`: analogous living-method/reserve reset and settled claim. | Existing prestige-like renewals are real source consumers, not death succession. Do not stack G30 above them as a second first-milestone layer or rewrite their historical terms. Whether to align/replace a selected renewal is a later explicit compatibility decision. Existing finite “once” checks are not a universal future limit. |
| B3-A15 | `src/backlog_expansion_body.js:15-19,38-60,80-86,421-455,578-594`: named family donor Mara and recipient Ren, her nephew; property/right transfer and funded teaching give Ren a trained source, followed by material/effort-consuming kit work. Both stay alive. | Actual living family succession already separates property, permission and learned function. It is not a blood-gene simulation or protagonist prestige. Reuse conservation and separate holders, not the finite example's quotas as general law. |
| B3-A16 | `src/cheat_cards.js:1-6,32-75,81-100`: strict schema-1 held/known cards, terms/hooks/stages/observers, awakening and recorded acquisition/messages. `src/main.js:5182,5187-5197,5301-5308`: enumerated save/load owners include cheats, life record and expansion. | A saved cheat card does not implement its descriptive hooks or guarantee cross-life retention. The heir builder uses a fresh envelope and does not explicitly copy previous cheats. Persist earned cheat transfer by its actual binding/handler, not by blindly copying all held cards. |
| B3-A17 | `src/save_files.js:40-83,145-155,158-190`: current version/schema checks, chronicle/calendar consistency, actual-loader preflight, then guarded write. `src/expansion_persistence.js:7-50`: staged durable publication. | Add writer, loader, validator, preflight and export/import coverage for a new owner. A sidecar is not automatically preserved by the enumerating serializer or rejected by older clients. G30.09 defines the compatibility proposal. |
| B3-A18 | `src/world_instances.js:54-78,231-245`: strict world definitions, bound instance actors/claims; `parentInstanceId` is enclosing ownership/nesting. | Family tree, soul history and historical world fork require separate typed edges. A bloodline cannot be smuggled into the existing instance parent graph. A retained instance alone also does not preserve all joined native bodies and stock. |
| B3-A19 | `src/chronicle.js:16-18,78-80,102-124`: mortal life end is exact old-age deadline; default enrolled body starts at age 18, lifespan 80, open mode unless opted mortal. `src/main.js:3721-3735` increments native `total_deaths`, reports lost consciousness, returns the player to safety and applies recovery. | Do not trigger G30 from native defeat counters or spoof arbitrary death/retirement through old-age-only `endedAt`. A selected earlier lethal/retirement trigger needs a new explicit ending contract. |

B3-A15's family description uses only public authored roles, not sealed
parentage. All source claims above remain source-only in this lane.

## Reconcile the parallel runs-and-endings work

| Code | Read surface | B3 integration consequence |
|---|---|---|
| B3-A20 | [R2 report](../../runs-and-endings-2026-10-14/r2/REPORT.md), K08-K17, K25-K29, K33-K38 and T21 proposal. | Agrees with the live estate correction and lost-world gap. Reuse typed deed/claim evidence; never backfill prestige from biography or every historical title. Avoid adding a generic second reward engine. |
| B3-A21 | [R3 report](../../runs-and-endings-2026-10-14/r3/REPORT.md), game/legacy and idle comparisons; [R1 integration](../../runs-and-endings-2026-10-14/r1/INTEGRATION.md); [R4 report](../../runs-and-endings-2026-10-14/r4/REPORT.md), W01-W05. | Duration, campaign closure, true death, surviving carrier and next playable person differ. A long life or unfinished canon can still leave a legacy. Neither arc end nor death automatically pays prestige. World-specific source qualifiers remain with those lanes. |
| B3-A22 | [R5 report](../../runs-and-endings-2026-10-14/r5/REPORT.md), P33-P38/T22/T24/T25. R6/R7 checkpoints had no final result at inspection. | Reuse proposed typed life/estate/time references rather than a competing timeline archive. No backward calendar edit, end-state copy as past history, or unmodeled decades of estate growth. Their proposed `timeline_history` is not an implemented owner. No numerical result is borrowed from unfinished R7. |
| B3-A23 | `docs/worlds/world-depth-2026-10-13/22_FEATURES_AS_CHEATS.md`, RL/RP/RX, NT/NE/NP/NF and MM tables. | Same-world inherited legacy need not restart clean canon (RP5), create a branch atlas (RP6), or add a meta shop. MM's caps/sublinear curve are design proposals, not authority to weaken supported strong inheritance. Use one configured layer with explicit carriers. |

## Search and limits

Targeted source search: `rg -n -i '\b(rebirth|heir|heirs|prestige|carryover|lineage)\b' src --glob '*.js'`, followed by reads of the call sites above and related save/body/source modules. Word boundaries avoid matching ordinary “their”. Metadata roster mentions of inheritance or rebirth are not counted as implemented mechanics. This covers the named current paths, not every possible spelling or private/unloaded pack.

No build, npm, game tests, browser, personal save, install, commit or push was
used. Existing research dossiers were read as reports with their precise
locators; this lane did not rerun their proprietary-source extraction. Live
files may continue changing after these dated locators. No shared doc was
corrected here; root owns integration of the stale wording findings.
