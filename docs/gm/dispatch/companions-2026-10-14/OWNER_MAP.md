# C6: companion owner map and overlap check

## CHECKPOINT

2026-10-14. COMPLETE documentation snapshot. C6 owns this file and
[C6_REPORT.md](C6_REPORT.md) only. COMMON was read first. Root and sibling
documents remain read-only. All C1-C5 main outputs and reports were present by
the closing inventory. Recheck their live text before applying recommendations;
line numbers below describe this read, not immutable anchors.

**SHOWN** means inspected document text. Sibling source/gameplay claims remain
attributed claims, not C6 verification. **INFERRED** means a proposed owner split,
gap or reconciliation. No new canon claim, selected schema, implementation task
or product decision is created here. Accepted direction remains in USER_VISION
and PROJECT: one realm/one prestige milestone, comfortable unfed play and no
hunger death, desktop/laptop first, mobile deferred. No sealed file was opened.

## Reading key and document roles

These short keys qualify otherwise colliding codes, such as P:C6, B:BS1,
H:BS1 and R29:BK1. A link-only role below means link for that topic; the same
document can own a different topic. Existing explicit boundaries are SHOWN;
the proposed division of finer topics is INFERRED.

| Key | Document | Existing role / read scope |
|---|---|---|
| P | [Root palette](../../../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md) | Broad WITH-player considerations, lines 7-28; rounds A-BK and suggestions |
| B | [Nonhuman bonds and parties](../../../worlds/NONHUMAN_BONDS_AND_PARTIES_2026-10-14.md) | Bond-to-action contract, lines 7, 19-27; joint work and pair seats |
| H | [Paradise beings, pets and bodies](../../../worlds/paradise-hub/BEINGS_PETS_AND_BODIES_2026-10-14.md) | Source-qualified local bodies/bonds/loss/crossing; source limits and proposals |
| R20 | [Part 20 relationships](../../../worlds/world-depth-2026-10-13/20_FRIENDS_AND_RELATIONSHIPS.md) | General RM/MF/RD/RX/UF relationship behavior; historical source section |
| R29 | [Part 29 prerequisites](../../../worlds/world-depth-2026-10-13/29_RELATIONSHIP_PREREQUISITES.md) | Corrected RQ evidence, RZ/RI/RCL/RHE contracts and later CQ/DV/BK proposals |
| GN | [Genetics and brood](../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md) | GN10 breeding, line inheritance, body layers and brood agency |
| NS | [Life-sim North Star](../../../LIFE_SIM_NORTH_STAR.md) | Searched pet/familiar/mount/beast; high-level life/body/continuity vision |
| SK | [Skills and talents](../../../SKILLS_AND_TALENTS.md) | Skill taxonomy, acquisition, means, growth models and scale; riding/handling/summoning |
| M | [Nonhuman mechanics](../../../worlds/NONHUMAN_PROTAGONIST_MECHANICS_2026-10-14.md) | Source-qualified naming, shared faculties, guides, body/host mechanisms |
| W | [Nonhuman starts by world](../../../worlds/NONHUMAN_STARTS_BY_WORLD_2026-10-14.md) | Source-qualified AS-player species/start rules, W/NC/NX |
| PL | [Nonhuman play](../../../worlds/NONHUMAN_STARTS_PLAY_2026-10-14.md) | BK1-BK15 body verbs, first-minute promise, NP/NT/NU/ND proposals |
| PG | [Nonhuman progression](../../../worlds/NONHUMAN_PROGRESSION_AND_BALANCE_2026-10-14.md) | Skill/body execution and credit, scaling, evolution, prestige/inheritance |
| SL | [Nonhuman society/law/economy](../../../worlds/NONHUMAN_SOCIETY_LAW_AND_ECONOMY_2026-10-14.md) | Local status, OW title/custody events, representation, actual service prices |
| MS | [Nonhuman monster side](../../../worlds/NONHUMAN_MONSTER_SIDE_2026-10-14.md) | Hunted actors, ecology, lairs, neighbors, visitors and crossing sides |
| TF | [Nonhuman transformation](../../../worlds/NONHUMAN_TRANSFORMATION_AND_BODY_CHANGE_2026-10-14.md) | Body/occupant transitions, carriers, consent leases, return and repair |
| SU | [Nonhuman senses/scale/UI](../../../worlds/NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14.md) | Qualified sensory evidence, carrier/scale, focused seat and desktop presentation |
| ER | [Nonhuman requirements](../../../worlds/NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md) | E/N requirement inventory and cross-lane routing, not delivered engine |
| ES | [Nonhuman engine spec](../../../worlds/NONHUMAN_STARTS_ENGINE_SPEC_2026-10-14.md) | Proposed shared physical queries, control binding, migrations and phased consumers |
| C1 | [Companions by world](../../../worlds/COMPANIONS_BY_WORLD_2026-10-14.md) | WITH-player world/source catalogue; [report](C1_REPORT.md) |
| C2 | [Engine fit](ENGINE_FIT.md) | Companion-specific Have/Missing/Proposed source audit; [report](C2_REPORT.md) |
| C3 | [References](REFERENCES.md) | Game/fiction comparisons and C3:R101-R115 proposals; [report](C3_REPORT.md) |
| C4 | [Journeys](JOURNEYS.md) | Illustrative life paths and JX stress register; [report](C4_REPORT.md) |
| C5 | [Procgen](PROCGEN.md) | Companion/species generation adapter considerations; [report](C5_REPORT.md) |

## Topic owner map

INFERRED recommended routing, retaining SHOWN boundaries P:7-28 and B:7,19-27.
No single doc should own every layer of a companion. World rule, shared behavior
and saved engine fact are different responsibilities.

| Code / topic | Owner for the topic | Docs that link or supply examples only | Basis and boundary |
|---|---|---|---|
| OM1 Kinds | P:A1-A15 for broad companion roles; C1 for qualified world examples; PL for AS-player body verbs | NS, SK, C3/C4; W links to C1 for WITH-player catalogue | P:7-15,30-51; PL:31-39. Familiar/mount is a relationship/role over anatomy, not a species template. |
| OM2 Acquisition | P:B/AA for route palette; C1 and the selected world owner for actual lore/era; SL for title/custody settlement | NS/SK, C3/C4, C5:S6; B links rather than inventing local acquisition law | P:53-68,427-436; SL:123-131. Adoption, ritual, crafting, inheritance and theft need their own causes. |
| OM3 Bond tracks | R20:RM owns shared directed regard and ties; B:BS owns companion support/obedience/dependence semantics; R29:RZ/RI owns retention/contact | P:C lists choices and links; C2 proposes fit; H retains actor-specific loyalty override | P:70-101; R20:35-49; B:68-85. Terms/channels are typed grants, not numeric affection. |
| OM4 Custody and consent | SL:OW owns local claims and custody changes; B owns support agreement/refusal; TF owns occupied-body/control consent; R29 owns generic obligations | P:O/S/AE/BG, W world evidence, H local contract evidence, C2 implementation fit | SL:113-147; B:74-81; TF:117-143. Legal title, practical holder, player focus and consent stay separate. |
| OM5 Lent powers | B owns giver/recipient/executor/permission contract; M and selected world own actual mechanism; PG owns mastery/XP recipient; SK owns ability taxonomy | P:C6/Q/J lists shapes; R29:BK1-BK6 links for companion execution; TF owns any body change | B:50-66,110-119; M:31-65; SK:248-253. Lending grip is delegated execution unless an actual control lease says otherwise. |
| OM6 Care | P:E/AH/AI/BD/U owns WITH-player care experience; PL owns body-specific useful play; B owns real caregiver/support cost; SL prices service | NS, C3:R105/R113, C4 stories; C5 describes diet/stages without owning live needs; H owns local evidence | P:118-132,489-503,573-579; B:114,129-142. Reuse bodily-needs/body owners, not a second pet fullness system. |
| OM7 Mounts and travel | P:G owns travel considerations; B:BKD3/BR2 owns rider/carrier contribution; ES:E7 owns physical reach consumer; existing realm-cargo owner owns item manifests | SK riding/handling; C2:H7/H8 audits gaps; C3:R111 and C4 test narrative consequences | P:147-160; B:56,111; C2:135-136. Tack/riding metadata is not a mount actor or paid route settlement. |
| OM8 Crossing worlds | Existing realm boundary/cargo/clock owners retain their layer; TF owns changed-body carrier plan; B owns participant agreement; H owns Paradise-specific rule | P:G6/BF/M8; C1/W give local admission evidence; C2:H9 identifies missing native joins | P:158-160; TF:184-196; H:78,253-265; C2:137. Living passage, item storage, local manifestation and expiry differ. |
| OM9 Death and revival | R29:RHE/RCL owns relationship aftermath/continuity; TF owns actual body/presence transition; selected world/H owns revival mechanism | P:D/T6/AK/J12/J23 and C4 give alternatives; B:BS8/BD11/BD13 closes dependencies; C2 audits source seam | P:103-116,345-346,514-519; H:72,75-78,120-124,274. Repair, same-person revival, re-summoning and offspring are distinct. |
| OM10 Heirs | R20:RD10/RX and R29:RCL own social succession/carriers; SL:OW4 owns legal inheritance; PG owns recipient knowledge/body practice; GN owns biological descent | P:I/M4/AB/BG; NS gives life route; C2:H10, C4 and C5 pedigree link | P:183-193; SL:128; PG:26,30-34,239-261; C2:138. Keep surviving actor/body/age; heir receives a new relationship, not predecessor affection. |
| OM11 Procgen | C5 owns companion generation adapter proposal; existing procgen people/streams/story/ecology owners retain shared layers; GN:GN10 owns breeding law; TF owns evolution transition | P:M3/J20/AA, C1/W authored canon locks, C3/C4 examples; ES owns eventual admission/schema | C5:29-48,69-86,105-134,143-210. Species/form graph, reproduction compatibility and individual pedigree stay separate. |
| OM12 UI | Existing thematic UI owner retains general presentation; SU owns nonhuman senses/scale/seat view; R29:RUI owns social evidence/direction; P owns WITH-player panel wishes | PL:NU provides play requirements; B:BD17 supplies support content; C2/C4/C5 specify future checks | P:229-239,404-410; SU:160-226; R29:149-161. Future selected target 1366x768 laptop, useful partner/support/actions together; mobile deferred. No browser result here. |
| OM13 Engine | ES owns proposed body/query/control/migration contract; ER routes requirements; existing source owners remain code authorities; C2 owns companion fit evidence; B owns support semantics | P:N is a summary/link; C5 references bodies/bonds/inventory rather than duplicate stores; other docs supply consumer requirements | P:256-261; ES:241-289,291-353; C2:88-120; C5:193-201. No pet-only body registry, guessed live API or adopted version number. |

## Overlaps, contradictions and owner recommendations

Both columns are SHOWN documentary positions. Classification and recommendation
are INFERRED. A broad option versus a scoped source rule is usually a boundary
issue, not proof that one must be deleted. Retain both and label applicability.

| Code / kind | Side A retained, with lines | Side B retained, with lines | Suggested holder / reconciliation |
|---|---|---|---|
| F1 Axis-scope tension | P:72-84 proposes seven bond tracks | R20:49 RM15 proposes familiarity/trust/fear only; B:127 permits richer axes for awakened pets | R20 owns vocabulary; B owns applied contract. RM15 is ordinary-animal default, not a ceiling; P tracks are optional. C5:119 mind level cannot silently choose legal rights. |
| F2 Typed-versus-numeric overlap | ER:138 calls partner bond a stat; P:83 places shared channel among tracks | B:74-81 separates regard, dependence, command and offers; C2:115-120 separates C5 terms/C6 channels from scores | B owns semantic split, ES actual schema. Keep the short stat hook in ER/P with link; no numeric score grants anatomy or a control lease. |
| F3 Actor-specific loyalty exception | P:95-96 says neglect/cruelty can sour bonds; R20:92 allows motivated betrayal | H:70 BC3 reports fixed maximum loyalty/no betrayal for one converted companion; B:27 preserves that case | H owns sourced exception. P/R20 retain broad alternatives with per-actor/source scope; fixed loyalty still permits learning, bargaining and household money. |
| F4 Revival scope tension | P:345-346 says revival stays reachable with fitting cost; P:389,628 offers return/revival cheats | H:72,75-78,120-124 keeps core repair, expiry, injuries and soul/identity loss distinct; H:279-285 leaves universal revival rules UNKNOWN | Selected world/H owns mechanism; TF owns transition. Preserve reachable revival as palette/cheat/AU consideration, without asserting every canon contract or body has a normal revival service. |
| F5 Recall contradiction in literal wording | P:470 AF1 says detailed treatment is remembered for its whole life | P:464 AE5 allows forgetting; P:474-476 AF4 allows loop reset/partial recall; R29:298 DV21 permits unreliable memory; C4:222 JX01 retains both | P scopes ordinary recall and disruption dials; R29 owns durable history versus accessible memory. Retain events even when this mind cannot recall them. |
| F6 Familiar/personhood shorthand | P:32-33 calls a companion an actor with own body and wants | W:248,254 distinguishes own-soul partner from remote scout; M:61-65 distinguishes reactive guide from later autonomous mind | P owns inclusive taxonomy but links exceptions. ES owns N=0 guide/presence or linked executor; do not invent independent personhood for every puppet or software helper. |
| F7 Shared fate versus survivor | P:97-99 permits shared death; P:113,187-191 permits outliving holder and carrying memories | B:83-85 separates lost partner and supported continuation, without universal death cascade; H:75 has departure/death expiry for a specific summon | B owns dependency loss contract; world/H owns actual tether. Both independent life and linked life remain source/premise dials. |
| F8 Crossing abstraction overlap | P:158-160 says companion follows cargo/body carry rules, with rejection/transformation dials | C2:55-57,137 says item cargo and detached passage plans do not prove connected living passage; H:78,257 gives different routes | Shared passage owners plus TF/B own execution and agreement; P links. Preserve the broad idea but never treat a bag manifest as actor transport or destination admission. |
| F9 Idle/offline tension | P:234-235 describes offline returns; P:363-367 softens absence and reports actual work; C4:200 uses sitter visits | PL:37 freezes browser-closed time by default; B:131 and R29:112-116 require selected clocks and bounded supported catch-up | R29 owns contact clocks; existing clock owner owns settlement. P/C4 remain optional offline/absence illustrations, not evidence of current wall-clock progression or default pet aging. |
| F10 Inherited actor versus inherited loyalty | P:189 says heirs inherit companions; NS:3677 says companion seeks new holder with its loyalty/maybe memories | SL:128 keeps subject's trust/controller out of heir assets; B:165 forbids blanket partnership transfer; C2:138 requires surviving actor/new edge | SL owns claim transfer; R29 social carrier; PG knowledge. Keep attachment to predecessor and recognition of heir separately; inheritance may transfer care/property without cooperation. |
| F11 Breeding/evolution duplicate ownership | P:11,251-252,380 routes breeding to GN10; GN:490 is the breeding hook | C5:145-165 adds generated evolution and breeding graphs/pedigree; TF:65 owns evolution transition | GN owns reproduction/inheritance, TF change of same body, C5 graph generation/locks. A descendant is not a parent evolved, nor automatic inherited training. |
| F12 Lent faculty versus mastery | P:390 J13 offers mutual skill copying; R29:318 BK5 offers lent technique/mana/name | M:35 excludes automatic technique/knowledge from one sourced sharing rule; B:64-66,159 requires actual executor/source/learner | M/world owns mechanism exception; B grant; PG credit. Keep copying as a sourced cheat/dial rather than default XP transfer from friendship. |
| F13 Bond-loss wound versus optional grief | R29:319 BK6 defaults to power loss plus lasting mark on broken contract/soul bond; R20:93 RD15 suggests mourning debuff | R29:172 RHE4 and B:81 permit narrative grief without mandatory debuff; H:77 distinguishes injury restoration | R29 should scope BK6 to grants actually dependent on the broken link; preserve mark/grief as fitting world choices, not a tax on every pet departure. H governs actual local damage. |
| F14 Harsh care versus accepted no-hunger-death | P:151 G2 allows ridden-to-death horse; P:516-519 allows full harsh stakes | PL:49,65,81 and B:158 keep hunger nonlethal; H:71 rejects importing poison trial as hunger death | P owns optional exertion/loss stakes; body/world owns cause. Keep fatigue injury, poison and selected terminal loss distinct from lethal feeding upkeep. Accepted no-hunger-death direction governs. |
| F15 AS-player shorthand too broad | NS:3982-3984 says bond core stat, cruel master escape, free beast hunted | PL:294,297 and MS:237-266 allow local rights, quiet independent life and nonhuman community without mandatory hunting/human form | PL/MS own AS-player detail; NS links as illustrative premise. Retain hunted/free beast fantasy as one world dial, not species-wide law. |
| F16 Superseded source statements | R20:18 X4 attack-only negative writes; :20 X6 only elder gate; :23 X9 treats missing writes as desired loop behavior; :26 X12 broad rebirth-wipe framing | R29:25 RQ7 names other negatives; :26 RQ8 remembered-meeting gate; :31 RQ13 ties deletion to explicit reset; B:46 identifies X9/RWML1 as superseded | R29/audit owns correction evidence; R20 owner can keep dated claims as history and link current correction. C6 has not independently rerun code searches; missing relationship writes do not prove a loop reset consumer. |
| F17 First-slice recommendations overlap | P:636-644 suggests stray adoption/follow/forage/aging; C2:17-23 reuses dog patterns while preserving Rill | B:175-179 proposes new hound/caretaker support then seats; ES:362-407 phases body foundation then wolf start | Each owner keeps its bounded recommendation. Root may select later; recommendations are alternatives, not cumulative release gates. Rill must not be renamed/adopted into party without its own compatibility decision. |
| F18 Stale work-status prose | P:641-642 still says source pass for MEMORY rows is running | P:19-21,540 says C1 landed; C1 report final observation says root H was integrated; C3:5-10 remains an A-Z survey snapshot | Root owns current status refresh, keeping round history dated. Link completed lane outputs; later root additions do not expand C3's claimed audited scope. |

## Gaps in the inspected companion set

These are INFERRED, bounded absences of an explicit companion procedure in the
documents above, not a claim that the entire repo lacks a mention or that they
must be built. Default + Dial + Reasonably leaves selection to a fitting world.

| Code | Gap not explicitly worked through | Nearest coverage retained | Suggested future holder and bounded consideration |
|---|---|---|---|
| G1 | Companion contagion and quarantine procedure: who is exposed, separation/care, release and safe reunion | P:124-127,491-496,575-579 covers sickness/care; P:435-436 covers invasive ecology, but neither specifies transmission/quarantine | P care + selected world/body conditions. Default abstract treatment with ordinary agency; dial contagious source-specific condition; reasonably isolation needs supported caregiver/habitat and known stakes, with no hunger death. |
| G2 | Conflicting concurrent caregivers: two valid care/command permissions issue incompatible orders, and one dependent actor cannot satisfy both | SL:115-147 distinguishes claims/agreements; B:78 support scope; ES:252-264 control leases. Disputed ownership is covered, but a shared-care conflict procedure is not explicit | B with SL and ES. Default one accepted active assignment; dial shared custody/rotating carers; reasonably publish a known pause/priority/mediation cause rather than duplicate the actor or infer which carer is loved more. |
| G3 | Agency transition audit when a previously ordinary pet becomes sapient: which old standing orders, representation and care terms are reviewed | P:276 mind spectrum; C5:119 earned transition; TF:186 authority/control; SL:141-147 scoped consent. These name layers but do not walk their reauthorization together | B with TF/SL. Default retain history and necessary supported care, pause unreviewed discretionary grants; dial locally sourced bindings; reasonably new speech/personhood alone neither erases debt nor proves consent to old commands. |

Coverage is already present but **selection/execution remains open** for five
important areas: K1 mounts/terrain/stamina (C2:H7); K2 surviving companion estate
manifest (C2:H10); K3 current versus returned soul/memory (H:PB4, B:BD13, C4:JX08);
K4 world/away clocks (R29:RI4, C4:JX31); K5 pinned generation/migration and semantic
quality (C5:D/H). These are not G gaps. UI feel and playable/persistence proof are
also open evidence gates, not missing design topics.

## Exact link lines for owner application

INFERRED suggested edits only. The following five lines are ready to paste into
P, using paths relative to `docs/`. Existing P:23-28 already links B/H, so replace
or extend that owner paragraph where fitting rather than duplicate it. Claude
owns applying these; C6 edits none of the target documents.

```markdown
- LM1: [Relationships part 20](worlds/world-depth-2026-10-13/20_FRIENDS_AND_RELATIONSHIPS.md) owns directed regard and social succession; [part 29](worlds/world-depth-2026-10-13/29_RELATIONSHIP_PREREQUISITES.md) owns corrected prerequisites, durable history, contact clocks and carriers; [nonhuman bonds](worlds/NONHUMAN_BONDS_AND_PARTIES_2026-10-14.md) owns who lends which function, support consent and pair-seat play.
- LM2: [Nonhuman society](worlds/NONHUMAN_SOCIETY_LAW_AND_ECONOMY_2026-10-14.md) owns title, custody and local rights; [transformation](worlds/NONHUMAN_TRANSFORMATION_AND_BODY_CHANGE_2026-10-14.md) owns body/control changes and return carriers; [Paradise beings](worlds/paradise-hub/BEINGS_PETS_AND_BODIES_2026-10-14.md) retains its source-specific loyalty, crossing, repair and revival limits.
- LM3: [GN10](GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md#g18-genetics-with-real-texture) owns breeding and biological inheritance; [skills](SKILLS_AND_TALENTS.md) owns riding, handling and summoning families; [procedural companions](gm/dispatch/companions-2026-10-14/PROCGEN.md) proposes individual/species generation, pinned graphs and deterministic preservation without duplicating those owners.
- LM4: [Nonhuman requirements](worlds/NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md) routes body needs; [engine spec](worlds/NONHUMAN_STARTS_ENGINE_SPEC_2026-10-14.md) owns proposed shared body queries, control and migration; [companion engine fit](gm/dispatch/companions-2026-10-14/ENGINE_FIT.md) records current seams and missing companion joins; [senses, scale and UI](worlds/NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14.md) owns the nonhuman view and desktop presentation.
- LM5: [Companions by world](worlds/COMPANIONS_BY_WORLD_2026-10-14.md) holds the source-qualified world catalogue; [references](gm/dispatch/companions-2026-10-14/REFERENCES.md) holds game/book comparisons; [journeys](gm/dispatch/companions-2026-10-14/JOURNEYS.md) holds illustrative life paths and JX tensions; [owner map](gm/dispatch/companions-2026-10-14/OWNER_MAP.md) records topic boundaries and both sides of overlaps. These are considerations, not selected gameplay.
```

For reciprocal routing, each owner can add the exact line for its folder. This
keeps the link list short while covering every source doc without copying P.

| Code / destination docs | Exact line to add if absent |
|---|---|
| LB1 NS, GN, SK in `docs/` | `Broad WITH-player companion considerations live in the [companion palette](COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md); this document keeps its own topic boundary.` |
| LB2 All NONHUMAN docs and C1 in `docs/worlds/` | `Broad WITH-player companion considerations live in the [companion palette](../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md); AS-player body and world rules remain in their existing owners.` |
| LB3 H, R20 and R29 in their world subfolders | `Broad WITH-player companion considerations live in the [companion palette](../../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md); local evidence and this document's contracts remain here.` |
| LB4 C2-C5 in this dispatch | `Root integration belongs to the [companion palette](../../../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md); this lane's evidence and proposals remain scoped to its report.` |

Avoid re-adding links already present. Use qualified codes when merging, especially
P:BK versus R29:BK, P:BF versus B:BF, and B:BS versus H:BS. Every map recommendation
is reviewable documentation; no link insertion selects mechanics or expands a
current playable milestone.
