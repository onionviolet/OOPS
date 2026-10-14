# B9 report: genetic modification in canon and fiction

2026-10-14. **Docs-only catalog delivered; every design takeaway remains a proposal.** Write ownership: `docs/gm/dispatch/body-lineage-2026-10-14/b9/` only. No shared owner, runtime, build, save, stage or commit changed by this lane.

B9 follows [COMMON](../COMMON.md), [lane assignment](../B9.md), [PLAN](../PLAN.md), the live [genetics palette G53](../../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md#g53-genetic-modification), and [prior integration](../../body-lineage-expansion-2026-10-11/INTEGRATION.md). The source-first order and canon-first standing priorities were preserved. Fallout inspection used existing records without resuming its paused acquisition/read queue. No UI work or mobile requirement was introduced.

## Findings

| Code | Result | Practical implication |
|---|---|---|
| F1 | Sources alter different substrates: DNA, tissues, organs, developmental environment, souls and devices. | Keep the substrate and carrier explicit before applying GM/GD comparisons. FMA chimera, JJK soul alteration and Deus Ex installation do not establish the same hereditary operation. |
| F2 | Several apparent capacity limits constrain different things. | Clinic assembly complexity, recipient food demand, active energy use and equipped loadout need separate authoring. None justifies a global mutation cap. |
| F3 | Reversal and inheritance are distinct chains with useful exceptions. | A cure, expiry, prevention, suppressed expression, replaced implant and restored template require their own outcomes. Surgical material succession also differs from having children. |
| F4 | Ownership and identity often depend on institutions, evidence and claims. | A biological marker or a manufactured body does not automatically imply legal ownership, obedience, shared memories or lost selfhood. Sources need their own mechanisms and local interpretations. |

Deliverables: 22 substantive `SRC_*.md` cards, [14 patterns and GM/GD coverage tables](PATTERNS.md), [10 correction/precision notes](CORRECTIONS.md), this report and a completed [checkpoint](CHECKPOINT.md). All 11 requested outside franchises have their own cards. Four supplemental references address uplift, de-extinction, drive terminology and G53's RimWorld comparison.

## Evidence labels

**Shown** means the consulted material reports a concrete story event or observed character outcome. Where the material is a wiki, recap or publisher description, the card says so. It does not mean B9 watched the scene, played the game or read the full primary work.

**Stated** means a consulted source describes a rule, procedure or claim. Speaker-attributed statements retain that attribution. A Director's rationale, character hypothesis, corporate patent claim or broad wiki generalization is not upgraded into objective world truth.

**Inferred** means this lane's comparison or deduction. **Analogy** means the GM/GD category is useful for design but the source does not establish that exact genetic mechanism. **Open/unverified** means this review lacks evidence, not that a setting forbids the possibility. All Default + Dial mechanics are proposals.

Local sources were consulted first: digests, existing world ledgers, B4's in-progress cards and selected full-dump payloads/worker records. A revision-backed wiki remains secondary evidence. Web sources were accessed 2026-10-14; cards identify when only indexed text or an inherited B4 verification was available. Every source claim has a page, section, revision, chapter locator or manual-page locator. No raw literary prose or novel acquisition was added.

## Source inventory

| Card | Primary contribution | Evidence actually consulted |
|---|---|---|
| [Fullmetal Alchemist](SRC_fullmetal-alchemist.md) | GM3/GM4 fusion, support physiology, retained consciousness, public ban/covert program | Digest/world ledger/B4 plus relevant retained Chimera r77713 payload text and worker note |
| [Naruto](SRC_naruto.md) | GM4 eye grafts, source versus learned technique, acquired body capacity | Digest/world ledger/B4 and official Orochimaru retrospective; Hashirama-cell recipe remains open |
| [Fallout](SRC_fallout.md) | GM2/GM6 strains, exposure and narrow reversal; cyberdog comparison | Digest/B4 and detailed full-dump worker record; recorded FEV payload absent |
| [Jujutsu Kaisen](SRC_jujutsu-kaisen.md) | Soul/body rewriting, unusual compatibility and healing distinctions | Digest/world ledger/B4 plus relevant retained Idle Transfiguration r79439 text; Modulo excluded |
| [Hunter × Hunter](SRC_hunter-x-hunter.md) | Queen phagogenesis, offspring versus adult conversion, memory and ecology | Digest/B4 and worker note plus retained Chimera Ants r419293 biological sections |
| [My Hero Academia](SRC_my-hero-academia.md) | GM1 Quirk marriage, segregated output/tolerance, factor suppression | Digest/B4 and retained Quirk r409871 heredity/drawback/factor sections; no full Nomu-page audit |
| [Harry Potter](SRC_harry-potter.md) | Sampled temporary template, mind versus condition, non-DNA inheritance | Digest/B4/worker records and B4-qualified author supplement; no new novel reading |
| [Warhammer 40k](SRC_warhammer-40k.md) | GM8 implant package, progenoid recovery and stock custody | Official article, indexed official historical extract, secondary overview; PDF open failed |
| [The Witcher](SRC_witcher.md) | GM2/GM3 lasting mutation versus temporary potions | Official Netflix adaptation explanations; novels/CDPR not certified |
| [BioShock](SRC_bioshock.md) | ADAM economy, loadout limits versus lasting condition, bank swaps | Indexed/transcribed manuals and secondary ADAM/Plasmid pages; no game session |
| [Gattaca](SRC_gattaca.md) | Reproductive selection, classification, sample identity | Sony/AFI summaries, secondary plot and researchers' scene analysis |
| [X-Men](SRC_x-men.md) | Innate mutation versus imposed enhancement, conflicting heredity claims | Marvel editorial summaries, indexed Elixir passage and qualified secondary compilations; no full issue reading |
| [Resident Evil](SRC_resident-evil.md) | GM6 designed weapons versus secondary infection | Text of Capcom-hosted licensed guide preview, named printed pages |
| [Deus Ex](SRC_deus-ex.md) | GM7 installation, slot/energy limits, permanent choice and observation | Original-game manual text, printed pp.8–9; prequels not merged |
| [Orphan Black](SRC_orphan-black.md) | Encoded mark, ownership claim, individual identity | S1E10 secondary recap and series summary; no rewatch or real-law ruling |
| [Brave New World](SRC_brave-new-world.md) | Reproduction, embryo multiplication, development and caste | Indexed publisher-authorized chapter 1 excerpt; no raw prose saved |
| [Annihilation](SRC_annihilation.md) | Environmental rewriting, attributed theory and uncertain identity | Official film premise and secondary film accounts; novel excluded |
| [Spore](SRC_spore.md) | Morphology editor, DNA currency, uplift as new society | EA descriptions and qualified wiki mechanics; no game test |
| [High Evolutionary](SRC_high-evolutionary.md) | GM9 sapience, education and agency after creation | Marvel official comics biography; MCU excluded |
| [Jurassic Park / World](SRC_jurassic-park.md) | GM10 reconstruction, containment and GD9 resource uses | Secondary 1993 plot, licensed exhibition and official Rebirth premise kept distinct |
| [Upgrade](SRC_upgrade.md) | Adult genome change and population-vector terminology | Publisher description, Kirkus review and NIH-hosted terminology check; strict GM11 unverified |
| [RimWorld Biotech](SRC_rimworld-biotech.md) | G53 correction: construction complexity versus metabolism | Developer preview and qualified current wiki mechanics; no code/game verification |

B4 was read on 2026-10-14 while its CHECKPOINT still marked inventory/review in progress. Its relevant cards supplied cross-checks and leads, not a transferred write area or a complete accepted canon audit. B9 independently spot-checked selected retained payload sections when available. Later B4 edits can be reconciled by the integrating owner; B9 does not certify all B4 sources.

The digest title/keyword survey also surfaced broad or blocked leads, including Coiling Dragon and Marvel's general digest. These were not promoted into additional local canon claims. The Coiling Dragon digest is blocked and its B4 extract does not establish an exact rewrite procedure. The wider Marvel cards therefore cite the newly consulted publisher material. This is a targeted modification catalog, not exhaustive semantic reading of every DIGEST file or all archived dumps.

## Ranked recommendations

| Rank/code | Proposed next integration | Reason and boundary |
|---|---|---|
| 1 / A1 | Apply C4 and C5's reference precision to G53. | They prevent mistaking a production package for one rewriting organ, and clinic infrastructure for recipient tolerance. Shared-owner edit belongs to the coordinating lane. |
| 2 / A2 | Let B11 keep substrate, carrier, heritability route and reversal outcome explicit. | This supports one honest modification loop without importing every fiction's simulation or a global limit. Reference P1–P5 rather than adding another competing spec. |
| 3 / A3 | Preserve known diagnosis, actual body state and institutional identity separately. | Gattaca and Orphan Black show useful consequences of mismatched evidence and claims; P6/P7 provide the comparison. No new save schema is selected here. |
| 4 / A4 | Use stable and clean outcomes beside risky experiments. | FMA's different chimera outcomes and specialized methods support distinct possibilities. Costs must follow world mechanisms; no universal toxicity, infertility, flaw exchange or loss-of-self tax. |
| 5 / A5 | Keep GM11 and engineered product-organism claims bounded until their specific mechanism is sourced. | Upgrade supplies terminology, not verified inheritance bias; a drug-resource premise is not a working microbial production protocol. These are later source gates when selected, not blockers for every modification idea. |

## Checks and remaining gates

Structural checks cover local Markdown targets, presence and substantive content of all 22 source cards, all GM1–GM11/GD1–GD10 codes in PATTERNS, the 11 requested outside franchises, absence of em dashes and confinement of this lane's writes. All checks passed: 22 source cards, 26 Markdown files, 132 local links, all 21 GM/GD codes and all 11 requested outside franchises. CHECKPOINT records the executed limits. These checks validate documentation structure, not the truth of every source claim.

Open source gates: exact primary scenes for a chosen recipe; precise sequence-editing/mosaic/off-target mechanics; strict fictional inheritance-bias drive; engineered microbial/crop product examples; absent FEV retained payload; continuity-specific Witcher, 40k, X-Men and Naruto details. Secondary recaps, wiki statements and official marketing summaries remain labeled, with no whole-franchise canon authentication. Real gene-drive terminology is used only to bound a fictional comparison, not to design a biological procedure.

No current legal interpretation is claimed for fictional patents or genetic status laws. No sealed custom-world truth was used or exposed; all named events are public franchise material. Private saves and source libraries were untouched.

No runtime, test suite, build, browser, save/reload/import, installation or human acceptance was attempted. This assignment's documentation gate is complete after its structural checks. If a proposed mechanic is later selected for implementation, its source/era, ownership, compatibility decision and actual rebuilt browser/persistence acceptance remain separate gates under the live project owners.
