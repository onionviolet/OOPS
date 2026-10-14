# R9 dedupe and coherence audit

2026-10-14. Docs-only return for Claude integration. Code prefix D. No owner,
source, bundle, private save, commit or push changes. These are audit findings
and proposed dispositions, not accepted mechanics.

The main result is [DEDUPE_TABLE.md](DEDUPE_TABLE.md): one disposition for every
coded row in part 22 sections 8-20, with the row's line, an owner file:line,
relation, reason and action. [COMPACT_REPLACEMENT_OUTLINE.md](COMPACT_REPLACEMENT_OUTLINE.md)
preserves the new quest/ending applications while replacing general restatements
with citations. [INTEGRATION.md](INTEGRATION.md) routes the corrections.

## D1: coverage and evidence limits

Read every line of sections 8-20, initially lines 217-1357. There are **551 coded
rows**, comprising 545 in sections 8-19 and six OV notices. The supplied estimate
of about 670 rows is not the count in the inspected revision.

The discovery corpus initially contained **84 files / 33,603 lines**: all nine
explicitly named shared owners; all extant E1-E9 families, including their B-F
extensions; every top-level `docs/worlds/*.md`; and every extant depth part 01-29
except the target part 22. **Parts 25-27 do not exist.** Searches also examined
relevant standing rules, source-playbook, intro and enemy-protagonist references.
The entire target was read; older owners were searched row by row and relevant
passages read. This is not a claim to have reread every line of the older corpus.

[ROW_INVENTORY.json](ROW_INVENTORY.json), [CORPUS_MANIFEST.json](CORPUS_MANIFEST.json)
and [SEARCH_EVIDENCE.json](SEARCH_EVIDENCE.json) preserve the baseline and per-row
discovery leads. Matches are not semantic findings. [ROW_DISPOSITIONS.json](ROW_DISPOSITIONS.json)
contains the manually reviewed relations. A refinement shares a real older
mechanism but adds a narrower quest/ending application; it is not removable just
because its nouns match. An exact source-world claim is not established by a
nearby general world header.

QBW1-QBW15 retain R1's evidence, uncertainty, dates and proposed rates. R9 did not
browse or recertify publication status, read raw novels, identify live save secrets,
run gameplay or test persistence. Current or canon truth is never inferred from
an older proposal. Same-day files are existing design owners consulted for
reconciliation; their timestamps alone do not establish authoring order.

The final full-row search covered **104 current corpus files / about 42,700 lines**,
including 20 top-level world docs that arrived during the audit. Those latest
discovery leads are in [FINAL_SEARCH_EVIDENCE.json](FINAL_SEARCH_EVIDENCE.json).
They are contemporary integration inputs, not evidence that their contents
predate part 22 or automatically supersede an older owner. The final table has
**257 duplicate rows, 249 refinements, 26 conflicting/overbroad claims, four rows
without a demonstrated older equivalent, and 15 retained R1 metadata rows**.
There are 317 distinct cited file:line locators and 294 non-duplicate integration
routes. Counts describe this documentation review only.

Search receipts store paths, line numbers, terms, scores and line hashes rather
than copied owner prose. The actual evidence stays in its owner, so the audit
does not become another source synopsis or expose plot details through a search
attachment.

**Live reconciliation:** peers integrated R2-R5 findings into 13 audited rows
while R9 was running: QC4, QBC1, QBC6, RL3, RL8, RB4, RP8, T19, NT10, NE2,
NE3, NP2 and NP5. Those rows and their cited reports were reread. The row table
uses their updated text/dispositions; the discussion below preserves what the
baseline audit found. QC4's general-generator scope, QBC1/QBC6's causal wording,
RL8/RB4/NT10's menu-versus-power distinction, T19's legacy classification, and
NE2/NE3/NP2's source precision are already corrected in those rows. Do not apply
those old corrections a second time. Appended sections 21 onward are outside
R9's requested audit scope. Final drift and static validation are recorded in
[VALIDATION.json](VALIDATION.json).

## D2-D4: codes and references

| Code | Check | Finding and action |
|---|---|---|
| D2 | Duplicate row codes; numbered dials/builds | No duplicate code in the originally inspected whole document. Within scope DL9-DL47 are 39 unique contiguous dials and T6-T37 are 32 unique contiguous builds. No repeated number or missing number. Similar features occur under different codes; those are semantic duplicates, not numbering defects. |
| D3 | Missing code references | No confirmed nonexistent code after checking the referenced owners and lane records. C3 in QL3 means `docs/CHEAT_LIBRARY.md:214`; C3 in NT6/NP1 means `CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md:37`. EGW1's C4 means `TIMELINES_AND_DIVERGENCE.md:196`, not continuation C4. Q1/E2, DR4, ST3/UG4/SCI9, SG5/US1, BK2/BK4/BK7 and R1 endpoints have external definitions. Bare tokens should not be reported as broken local links. |
| D4 | Ambiguous or misleading reference destinations | “part 13 EO” in NT10 means depth file `13_EARNED_OPTIONS_AND_CHEATS.md`, not this document's section 13. Similarly “part 11 KA2/UG4” means depth file 11. QBW4's V04a-e are R1 integration shorthand, while the report uses V04a-F/-T/-P through V04e-F/-T/-P. V29 is `r1/INTEGRATION.md:53`, not the report linked by the §11 introductory sentence. Add exact destination links. OSO4's BK4 is a ghost/spirit profile, not proof of a deity profile. |

## D5-D14: causal and temporal coherence

| Code | Part 22 rows and lines | Owner / other row | Finding and proposed correction |
|---|---|---|---|
| D5 | QA4:436, T10:462, QR5:387 | `docs/worlds/CHOICES_THAT_GATE_CHOICES_2026-10-13.md:13`; `docs/RULES_FROM_SCRATCH.md:186` | “Every generated quest is completable now” contradicts intentional impossible/deceptive offers and research toward missing means. Validate references and actual physical constraints; distinguish broken data, not yet qualified, believed feasible, deceptive, and world-authored impossible tasks. A post-failure reason is bounded by available knowledge. Do not reveal secret impossibility through the offer filter. |
| D6 | QN1:479, QN7:485, QW3:417, QX1:302 | `docs/worlds/DIALOGUE_AND_INTERACTIONS.md:121`; `docs/worlds/CHOICES_THAT_GATE_CHOICES_2026-10-13.md:14` | No automatic offered debt before acceptance is compatible with social reactions and independent world consequences. “Untaken offers carry no penalty” is too broad for actual orders, existing obligations, witnessed refusal or an ignored threat. Show these distinct causes rather than charge for browsing or punish generic inactivity. |
| D7 | QT11:279, QI1-QI3:393-395, RS2:720, RS5:723, RZW5:907, PD4:1155, T20:767 | `docs/RULES_FROM_SCRATCH.md:145`; `docs/TIMELINES_AND_DIVERGENCE.md:80` | Shelving may freeze, but return/catch-up rows assume local time advanced. Browser closure, local absence and leaving a world differ. Every report/decay/roll is conditional on that world's selected clock; frozen branches accrue no absence-driven effects. T20 is a freeze-only proposed slice, not implementation of the whole DL25 range. |
| D8 | QBC1:620, QBC4:623, QBC6:625, QA3:435, QK3:447 | `docs/TIMELINES_AND_DIVERGENCE.md:49` | Natural course is causal, not an unconditional schedule. Prefer eligible authored events within the bound continuity. Removed causes can eliminate a climax; independent surviving motives can produce other events. Do not force substitutes or block legitimate off-canon templates to preserve an author's ending. |
| D9 | QE10:523, EGW5:1222, EGI3:1262 | `docs/RULES_FROM_SCRATCH.md:202`; `docs/PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md:28` | Threats may follow reach, visibility and actual hostile plans. They cannot be mandatory replacements merely to prevent a solved peaceful world. Pressure remains a world/taste dial, including none; beaten causes stay beaten. |
| D10 | RL2:691 versus NP2:816, NE7:807; RL3:692 | `docs/research/DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md:26`; `docs/worlds/CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md:17` | Ordinary death in an enduring history is one continuation, not a universal instance-retention rule. Reset/overwrite/rebirth scope must follow its explicit profile and represented domains. “Death never means everything gone” cannot promise mechanical carry in every harsh mode. Player learning and archive history are separate. |
| D11 | QW5:419 | `docs/worlds/world-depth-2026-10-13/02_MOL_HP_JJK_DND.md:19`; depth part 17 CL21:67 | The existing canon-month guest does not own the protagonist's reset or memory. Keep loop-aware quest behavior as a qualified looper start/premise. Loop memory does not instantly reveal every request. |
| D12 | RB1:705, RB4:708, RB2:706, RP5:736 | `docs/TIMELINES_AND_DIVERGENCE.md:338`, `:461` | Separate relabeling the one changed instance, creating a second copy, new perspective/replay selection, real temporal travel and external file duplication. Clean immutable definitions are sound; “new starts always get canon” erases reachable changed/AU/persistent-history modes. Keep clean canon as one chosen start mode. |
| D13 | RB7:711; RB6:710, RX6:751 | `docs/TIMELINES_AND_DIVERGENCE.md:433`, `:68`, `:511` | “Merge” covers lossless data dedupe, atlas import union, restoration/reconvergence and fictional world fusion. Only the latter operations need whatever in-world means their premise requires. Summary compaction does not prove playable restoration; retain sufficient actors/custody/claims/RNG/knowledge/content revision for promised resumes. |
| D14 | T25:862; NP1:815, NT6:791 | `docs/TIMELINES_AND_DIVERGENCE.md:68` | A copy of current state with an earlier date is not earlier history. T25 needs an authored saved checkpoint or a supported reconstruction/replay, explicit copied/remapped/excluded IDs and state, and behavior when no earlier snapshot exists. Parent IDs alone do not implement a fork. |

## D15-D24: information, authority and overlapping stores

| Code | Part 22 rows and lines | Owner | Finding and proposed correction |
|---|---|---|---|
| D15 | RB3:707, RB5:709, QBA5:648, DL22:669, OSM1:1299, T37:1340 | `docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md:110`; `docs/worlds/NONHUMAN_MONSTER_SIDE_2026-10-14.md:81`; `docs/PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md:54` | No instantiated sealed truth was found in these sections. However, branch names based on unseen differences, automatic drift bands, a canon comparison enabled by default, and a complete hunter identity/timing/strength list can reveal hidden facts. Keep neutral IDs/known names until the relevant route/observer supplies evidence. Public-canon spoilers follow the per-world spoiler setting; audit output names sealed routes by ID only. A branch does not unseal itself by being listed in the atlas. |
| D16 | QA6:438, QT8:276, NF8:834, QBC3:622 | `docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md:128` | Author reports use secret IDs. In-world logs use observable clues and genuinely discovered outcomes, rather than raw internal secret IDs or author truth. Distinguish pre-discovery filtering, discovery-route output and public audit output. A discovered changed ending can be experienced normally in play without being narrated in this report. |
| D17 | T19:766; T17:676; T25:862 | `docs/TIMELINES_AND_DIVERGENCE.md:25`; `docs/PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md:94` | Migration cannot invent “canon, near” for an old unknown instance or treat absent post-frontier flags as confirmed canon. Preserve known binding/revision, use unknown/unclassified when needed, and stamp new events at creation. Classification and elapsed-history changes need compatibility decisions, not just additive keys. |
| D18 | T6:329, T7:330, T8:331, T16:675, T18:765, T21:768, T24:861, T28:944, T30:1048, T32:1125, T37:1340 | `docs/PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md:29`; `docs/TIMELINES_AND_DIVERGENCE.md:481` | A6 already shares thread IDs across cards/quests/rumors/legends/chronicle. T32's separate arc list needs to be a view or an extension of that registry, not a competing store. Run IDs and world/life IDs can remain distinct, with shared references. Summary, ending page and hall query the same durable outcomes; shelving/closing/returning must not settle a deed twice. |
| D19 | QBV2:610, QBF1:635, QBF4:638; QBK/QBW | `docs/gm/dispatch/runs-and-endings-2026-10-14/r1/REPORT.md:35`; `docs/PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md:58` | Four endpoints are publication, capture, read and adapted, not one “last verified chapter date.” Bind playable content/frontier to the adapted source revision, and keep dates/uncertainty for all four. QBF1/QBF4 need to actually adopt QBV2's refinement. Retain R1's metadata evidence and open gaps, not an inferred completed ending from a captured volume. |
| D20 | MS1:971, MS6:976, NE8:808; OV4:1353 | `docs/worlds/SELF_AS_PLAYER_LORE_CONSIDERATIONS_2026-10-13.md:7`; `docs/CHEAT_LIBRARY.md:495`; `docs/RULES_FROM_SCRATCH.md:181` | S1 proposes a continuing embodied self with selected outside memories; it does not establish a universal player-only model. Player knowledge, actual continuing knower and a new character are different valid premises. Echo talents/feelings require a carrier even where reincarnation is not native. OV4 routes recognition correctly, but Instinct Inheritance/knower carriers better own MS3's trait leakage. |
| D21 | QE5:518, MM2:983, DL37:1042, MW1:993, MW3:995 | `docs/RULES_FROM_SCRATCH.md:28`, `:202`; `docs/CHEAT_COSMOLOGY.md:279` | Keep observed local scales and caps as fitting profiles. Do not turn them into universal ceilings, bans on a common scale or bans on free currency/goods conversion. Existing equalization includes no conversion, partial translation, up/down sync, hub standards and Absolute mode. OP lives and outliers remain possible. |
| D22 | NE4:804, ND3:843, MO4:1019, NT10:795 | `docs/RULES_FROM_SCRATCH.md:168`; depth part 13 EO11:33 | “Never free” resurrection and advanced choices only after earning are overbroad. Actual world/source terms determine price. Earned can be a proposed default while plain chosen-start, open-all, sandbox and explicit changed premises remain reachable. These clear authority conflicts need correction, not a new forced questionnaire for Weibao. |
| D23 | XF4:1090, §16 introduction:1057; RX1:746, OV2:1351 | `docs/CHEAT_LIBRARY.md:678`, `:553`; `docs/LIFE_SIM_NORTH_STAR.md:4459` | US1 is a first-life optional-start/NG+ door, not proof of post-true-ending NG+ mechanics. Hall of Selves is character switching, not just a historical archive. Cite the north star for the chronology/hall display, and the card for genuinely switching lives through a carrier. |
| D24 | QW1:415, QW6:420, QW8:422, QW10:424, QW11:425; QK5:449 | Depth part 22 refinement 3:11; `docs/worlds/world-depth-2026-10-13/28_FOUNDATIONAL_FUNCTIONS.md:42` | Restricted access, investigation, ordinary local divination, licensed information and a persuasive issuer are not automatically cheats. Apply the existing local-rule-break test to the actual means and reach. A label saying “cheat face” cannot substitute for source qualification. QW10/QW11 have no specific older quest-source equivalent demonstrated by this audit; retain qualified examples rather than invent a duplicate citation. |

## D25-D31: small practical checks and missing distinctions

| Code | Part 22 rows and lines | Finding and action |
|---|---|---|
| D25 | QZ6:544; PP2:1141 | No global once-ever cap was found. QT5's “once” is an example, QX3/QP1 are threshold words, and the explicit no-once rules align. Clarify QZ6 as one settlement per actual event occurrence, with new valid causes repeatable under world rules. PP2 can mean negotiate initial shares then remember them; make renegotiation reachable, not a permanent one-negotiation lock. These are ambiguities, not proven universal bans. |
| D26 | PM1:1162; DL42:1186 | A monster boom does not necessarily lower pay. Issuer demand, funded budgets, available takers and risk can move different ways. Keep local demand/supply terms or an explicit proposed pricing model, not a universal price direction. `PROCEDURAL_STORY...:147` owns actual supply-caused market changes. |
| D27 | OSM4:1302; T35:1192; PW8:1180 | Dungeon visitors do not automatically yield core income; stashes need real stock/custody/knowledge, not just an arbitrary hidden fact. Reborn ownership claims depend on actual local law/proof, not an unsupported “impossible in most worlds.” Existing owners: `NONHUMAN_SOCIETY...:218`, depth part 17 CL11:57, north star :3608. |
| D28 | QE4:517 versus §18:1196-1274 | QE4 names Resolver, but §18's daily-loop paths do not explicitly route it. Add a citation to the canon/campaign closure work in §11 and each world campaign owner, or say the resolver is covered there. Do not invent another mandatory finale system to fill this outline gap. |
| D29 | EGW1:1218; XA4:1066; MM3:984 | Aggregate war should allow an engaged ordinary soldier to become named, per E3's here/near/far tiers. High-layer beings do not automatically remember, and ordinary people can have a carrier. Sublinear prestige alone does not prove a long life pays more than repeatedly settling short lives. Keep these as bounded local/default proposals and preserve exceptions. |
| D30 | QC1-QC4:231-234, T6-T37 | Retain source-only versus runtime evidence. QC4 should say no live general quest generator in the scoped state, rather than all generation absent. A build row naming an additive array does not prove validators, transactional publication, import, legacy compatibility, restore scope or absence scheduling. Several cited older source inspections are dated and disagree with newer reports; use them as design routing, not current runtime truth. |
| D31 | QV5:407, QM12:506, MU:1001; RB1/EGO6/QF9 | No mobile-first proposal found; desktop/laptop is explicit. No forced either/or question for Weibao found. RB1 keeps several options and EGO6 combines paths; QF9's incompatible faction outcomes are causal choices, not a violation of the palette direction. No section here is authorization to expand the first implementation milestone. |

## D32: integration recommendation

Keep the quest-specific delta: state-caused offers; known/guessed/unknown planning;
posted funded work and competitors; varied outcome/proof templates; goal/route
triage; source-ending metadata; and explicit bindings from a quest or ending to
an independently owned continuation. Preserve practical party/estate/holding
examples where they add a concrete verb. Replace repeated persistence, random,
timeline, carrier, storyteller, relationship and cosmology rules with the exact
owner citations in the table. Merge dials and builds into one registry without
renumbering their historical IDs.

Where D findings show an existing accepted rule, Claude can reconcile the wording
from that rule. Where the cost, history mode, source claim or balance remains
unsettled, keep it a flagged proposal for Weibao. Do not treat this audit as his
acceptance of a new default or turn every consideration into a release gate.

No runtime acceptance gate was attempted. The remaining action is Claude's
owner integration and, for any later selected implementation, its own rebuilt
desktop gameplay/persistence gate.

**D33: past-self direction recovered live.** `docs/USER_VISION.md:2262-2268`
records little special past-self/body interaction, ordinary NPCs where present,
and fresh canon per life by default with changed branches by choice. NP5 now
follows this. RX3 and the outline must preserve optional self-meetings without
turning them into required arcs or bosses. The fresh-canon default does not
justify RB2's absolute exclusion of chosen branch/persistent-history starts.
