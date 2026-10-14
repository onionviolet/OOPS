# B5 game references: bodies, genetics and lineage

Research extension, 2026-10-14. All borrowing is proposal. [BORROW](BORROW.md)
maps mechanisms to the existing G1-G42 palette; [REPORT](REPORT.md) ranks them.

## Evidence and cost conventions

**Stated** means a developer, manual, wiki or guide describes the mechanism.
**Shown in saved source** means the existing repo dossier traced it; this lane
has not rerun that trace. **Shown in public source** applies to the bounded
Trimps functions read here. **Reported** means a player describes their experience.
**Inferred** means our design analysis. No game was played in this lane.

Official means developer/publisher material, including their Steam description.
Wiki means community-maintained documentation, even when its title says
“Official Wiki”. Community includes forum posts, guides and user reviews;
critic reviews are marked separately. Search extracts are labeled **indexed**;
they do not establish a full-page read. Historical complaints do not prove a
bug persists. Player samples are qualitative, deliberately include disagreement,
and are not prevalence estimates. Marketing descriptions do not prove formulas.

All web links below were accessed **2026-10-14**. Existing research keeps its
original dates/pins. Full-page failures switched to another route. No installed
edition was inspected. **Data shapes are inferred transferable representations,
not recovered save formats**, except explicit source fields attributed below.
Cost covers player resources and friction, then browser-idle implementation,
content, UI and persistence. L/M/H are relative scope estimates, not measured
hours or prices. No purchase is recommended; Biotech requires its DLC, and
edition/expansion differences stay explicit.

## Existing coverage reused before discovery

The [Oct. 13 reconciliation](../../../../research/GAME_AUDIT_COVERAGE_RECONCILIATION_2026-10-13.md)
warns that report presence, copied payloads and exports are different from full
semantic or native coverage. This pass adds inheritance/anatomy comparisons and
reception, rather than repeating acquisition, schedulers or broad game audits.

| Existing owner | Prior evidence retained | B5 addition |
|---|---|---|
| [CK3](../../../../research/crusader-kings-3/REPORT.md), FINDINGS F1/F6 | Succession interventions and dated parent/dynasty history; native inheritance/serialization not recovered | Congenital expression versus transmission, close-kin risk and marriage incentives |
| [RimWorld](../../../../research/rimworld/REPORT.md), body-01 | Selected food/health eligibility; Biotech installers not expanded | Public Biotech germline/implant distinctions; health-capacity and trait comparisons |
| [DF](../../../../research/dwarf-fortress/FINDINGS.json), DF-B01/DF-B02 | Body/tissue declarations and supported attacks; native injury propagation unread | Why tissue detail costs more than functional injury cards |
| [Kenshi bodies](../../../../research/kenshi/second-pass/BODIES.md), B1-B6 | Original/stump/replaced/crushed editor states, equipment, repair and patch distinctions | Reception and repair-versus-specialization comparison; no duplicate source intake |
| [Qud](../../../../research/caves-of-qud/REPORT.md), QUDB-01/QUDC-01 | Blueprint components and a cold-effect consumer, not a complete mutation audit | Mutation as usable body change, development and repair alternatives |
| [Wildermyth](../../../../research/wildermyth/FINDINGS.json), F1-F6 | Age, maim, retirement teaching, history and legacy-aspect rules | Biological child versus returning legacy hero; attachment and aging friction |
| [Rogue Legacy 1](../../../../research/rogue-legacy/REPORT.md), P1 | Frozen successor offers, random trait compatibility and real consumers | RL1 versus RL2 incentive changes; genealogy theme versus heredity |
| [ACS](../../../../research/amazing-cultivation-simulator/REPORT.md), C01-C10 | One law, preparation, core quality and medicine; [depth queue](../../../../research/amazing-cultivation-simulator/DEEPER_RESEARCH.md) still open | Wiki/guide-level physical cultivation, remolding and Secret Bodies |
| [Tale of Immortal](../../../../research/tale-of-immortal/FINDINGS.json), CE1/3/4/5/20 | Aptitude axes, quality-dependent choices, temporary failure and lifespan effects | Destiny versus physique versus inheritable faculty; player grind reports |
| [DDA depth](../../../../research/dcss-dda-depth/REPORT.md), DEPTH-D1-D4 | Conducts, martial requirements and practice; not anatomy/mutation coverage | Developer mutation/body-part/wound schemas |
| [Battle Brothers](../../../../research/battle-brothers/FINDINGS.json), BB-FL10-FL13 | Economic healing and injuries that redirect roles | Optional comparator for readable recovery and retained investment |
| [BitLife](../../../../research/bitlife/REPORT.md), F3/P2 | Public-page child continuation and succession preview | Optional comparator for current-age successor presentation, not genetics formulas |
| [Immortality Idle](../../../../research/immortality-idle/REPORT.md), F2/F5/F6/F9/F11 | Pinned aptitude, trade, carry, follower succession and family techniques | Separate cultural legacy from biological inheritance |
| [Open idle](../../../../research/open-idle-games-2026-10-09/REPORT.md), [Evolve](../../../../research/open-idle-games-2026-10-09/EVOLVE.md) | Species/reset differences and explicit carry policies | Compare aggregate species continuity with individual pedigree; add Trimps/IdleOn/DragonVale |

## B5-G01 Crusader Kings III

**Model / extension.** Stated: congenital traits can be active or hidden/inactive;
parent combinations and tiered traits influence transmission. Common ancestry
can increase adverse congenital outcomes. This is an authored probability model,
not a full diploid genome. Dynasty membership, marriage, biological parentage,
legitimacy and title succession remain different systems. The retrieved breeding
wiki is a **2021 archive**, useful for structure, not current percentages.

**Data shape.** Person IDs and parent edges; trait ID, expression/tier and
transmission state; dynasty/house IDs; separate legal heir eligibility and titles.
Compute close-kin context at a birth or pairing query rather than each idle tick.

**Player reports.** Some enjoy a centuries-long project producing unusual heirs;
others find ubiquitous genius/strength traits make people repetitive and remove
political choices. Genetics competes with alliance value. These views disagree
about desirable play, not about whether the feature exists.

**Cost.** Player: marriage opportunities, time and succession consequences.
Browser: M for finite ancestry and trait rules; H for full house politics and
large genealogies. Preserve dead parent references needed by living descendants.

Sources: [breeding archive, Wiki/full, captured 2021-02-15](https://archive.ph/nAbMS);
[long breeding project, Community/indexed](https://www.reddit.com/r/CrusaderKings/comments/o7j9wd/);
[optimization dissent, Community/indexed](https://www.reddit.com/r/CrusaderKings/comments/yyu3hl/).
Live Paradox wiki fetch returned 401; no current formula claim.

## B5-G02 The Sims 2 and The Sims 4

**Model / extension.** Stated in the series wiki: Sims 2 uses dominant/recessive
appearance inheritance; Sims 4 does not retain that same recessive-gene model.
Do not merge editions. EA's Sims 4 guide shows two-Sim genetics creation;
its pregnancy help distinguishes Try for Baby, Science Baby and adoption.
Science Baby can be solo or partnered without the romance prerequisite of Try
for Baby. Family resemblance, reproductive route and personality are separate.

**Data shape.** Parent IDs, generation seed and appearance parameters; optional
hidden appearance alleles for a Sims-2-like local rule. Household/adoption links
are distinct from biological contributors. Record reproductive roles independently
of address/identity. No actual slider-blending formula recovered.

**Player reports.** Players explicitly value seeing how parents' features combine
and running legacies. Reports of identical-looking or unrelated-looking children
show how visible inheritance errors undermine that pleasure. The cited bug
reports are historical/unreproduced, not confirmation of an active defect.

**Cost.** Player: care and family time. Browser: L/M for textual resemblance and
pedigree; H for face morphs, animation and growth-stage art. Do not make expensive
portrait genetics a prerequisite for functional heredity.

Sources: [genetics by edition, Wiki/indexed](https://sims.fandom.com/wiki/Genetics);
[creation guide, Official/indexed PDF](https://cdn-assets-ts4.pulse.ea.com/Guide/TheSims4_PlayersGuide_ENGLISH.pdf);
[pregnancy routes, Official](https://help.ea.com/en/articles/the-sims/the-sims-4/pregnancy-guide/);
[legacy interest and mismatch report, Community/indexed](https://www.reddit.com/r/Sims4/comments/1t274ke/whats_going_on_w_these_genetics/);
[nose/mouth report, Community/indexed on EA forum](https://forums.ea.com/idea/the-sims-4-bug-reports-en/children-wont-inherit-their-parents-nosemouth-bug-in-genetics/11932232/comments/12878306).

## B5-G03 Niche

**Model / extension.** Officially a genetics survival game. Wiki/guide: paired
alleles, locus-specific dominance and some codominance feed body/ability traits.
Two matching immunity alleles produce sickness. That local matching rule is
not the same as calculating a whole pedigree's inbreeding coefficient. Mutation
choices can steer later offspring; habitat makes gathering, movement and defense
useful in different situations.

**Data shape.** Individual genotype pairs, derived phenotype/abilities, parents,
age/action availability, habitat and mutation selection. Keep reproductive outcome
and phenotype derivation distinct so a hidden allele can have a later consumer.

**Player reports.** Sampled reviews enjoy cute varied animals, legible inheritance
and exploratory species projects. Others report repetitive food gathering, weak
specialist niches and difficulty comparing large groups' hidden/immunity genes.
A positive reviewer also asks for breeding-pair markers on the family tree.

**Cost.** Player: food, generations and available actions. Browser: M for a small
nursery, H for a large island population. Comparison UI and care policies cost
more attention than the allele roll itself. Simulation needs habitat demand,
not automatic selection of whichever statistic is highest.

Sources: [press kit, Official/full](https://strayfawnstudio.com/presskit/sheet.php?p=niche_a_genetics_survival_game);
[genes, Wiki/indexed](https://niche.fandom.com/wiki/Genes);
[inheritance, Wiki/indexed](https://niche.fandom.com/wiki/Nicheling);
[immunity, Wiki/indexed](https://niche.fandom.com/wiki/Abilities);
[positive and negative reviews, Community](https://steamcommunity.com/app/440650/reviews/?browsefilter=toprated&l=english).

## B5-G04 Spore, original PC game

**Model / extension.** Official manual: collected parts and DNA points fund
editor choices; mouth choice determines diet. Creature editing reached through
mating expresses a player-designed species body. It does not establish two
parents contributing alleles. The changing body supports movement, interaction
and feeding, then later stages use other currencies and play forms.

**Data shape.** Body plan of placed parts/transforms plus part abilities, palette,
complexity/currency state and species template. Inferred: validate action support
from anatomy rather than assigning every visual limb a bonus.

**Player reports.** Sampled players enjoy creative freedom and making strange
creatures; others say customization loses mechanical importance after the
Creature stage and the later stages feel shallow. Creator Will Wright also
praised the tools while suggesting the whole could have worked as connected
games. His retrospective is developer opinion, separate from the player sample.

**Cost.** Player: part discovery and DNA. Browser: M for discrete body cards;
very H for a freeform editor, procedural animation and five game modes.
The small inheritance record is not the expensive part of the Spore approach.

Sources: [PC manual, Official/indexed PDF](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/17390/manuals/manual.pdf?t=1642702281);
[editor, Wiki/indexed](https://spore.fandom.com/wiki/Creature_Creator);
[creator retrospective, interview/secondary](https://www.axios.com/2022/11/01/will-wright-spore-video-games);
[player agency and later-stage friction, Community/indexed](https://www.reddit.com/r/patientgamers/comments/fzx89v/);
[creator charm and stage-depth dissent, Community/indexed](https://www.reddit.com/r/patientgamers/comments/k8iaon/).
Do not use reviews of the separate DS game Spore Creatures as PC evidence.

## B5-G05 Stellaris

**Model / extension.** Species traits describe population templates, not individual
Mendelian families. Crucial edition difference: official 4.0 notes group pops by
species, strata and ethic and let workforce draw on several groups. Gene
Tailoring/Integrated Anatomy can establish a default template; eligible subspecies
integrate over time through species rights. BioGenesis adds Purity, Cloning and
Mutation paths. This lane does not audit later patch changes or all DLC rules.

**Data shape.** Species/template IDs, trait set, population group/count,
rights and conversion progress; individuals need separate exception records
if they become characters. Aggregation does not confer shared personal knowledge.

**Player reports.** Older discussions enjoy effective specialist species but
criticize template proliferation and repetitive planet modification. The 4.0
integration feature addresses part of that complaint; whether it resolves all
current friction is unverified. Old five-trait caps are not treated as current
universal rules.

**Cost.** Player: research, conversion time and specialization opportunity.
Browser: M for population cohorts; H for individualized migration, jobs and
pedigrees. Useful scale lesson: resolve a cohort's repeated state together while
retaining named people's history independently.

Sources: [4.0, Official/full, Pop Groups section](https://www.paradoxinteractive.com/games/stellaris/news/stellaris-update-4-0);
[BioGenesis, Official](https://www.paradoxinteractive.com/games/stellaris/add-ons/stellaris-biogenesis);
[older template friction, Community/indexed](https://www.reddit.com/r/Stellaris/comments/raxemv/).
Paradox wiki full fetch unavailable; no current-retail completeness claim.

## B5-G06 RimWorld: Biotech, health and traits

**Model / extension.** Official Biotech description separates child upbringing
from genetic modification. Wiki: germline/endogenes are inherited; implanted
xenogenes are not inherited through ordinary birth. A xenogerm replaces the
existing xenogene set and can suppress conflicting germline expression. The heredity wiki describes a selected subset of parental
germline genes constrained by metabolic limits, and says suppressed germline
genes can still transmit. It flags incomplete probability explanations; no exact
inheritance percentages are adopted here. A
xenotype is a named gene configuration, not proof that all genes transmit.
Extraction/storage/assembly/implantation are separate operations. Health maps
located damage to capacities such as manipulation, moving and sight. Traits
also affect preferences and behavior, separate from tissue damage.

**Data shape.** Person: inherited gene set, acquired gene set, suppression state,
xenotype label, trait IDs; body-part tree plus condition records. Derived
capacities have specific action consumers. Genepacks are separate stored assets.
These are inferred shapes; the old local base-only pass did not audit Biotech.

**Player reports.** Sampled Biotech discussion likes children/mechanitors while
criticizing genes as insufficiently dynamic, with replies offering other views.
Trait threads disagree over tolerable personalities; pyromaniac complaints center
on babysitting fires. This suggests friction depends on the supported routine,
not simply whether a trait has negative numbers. Gene praise is not inferred
from the DLC's aggregate review score.

**Cost.** Player: donor recovery, laboratory/storage power, labor, medicine and
ongoing needs. Browser: M for provenance and a few capacity consumers; H for full
medical simulation, storage chains and colony jobs. Metabolic budgets and hard
extraction limits belong to RimWorld, not universal YAIR rules.

Sources: [Biotech description, Official/full](https://store.steampowered.com/app/1826140/RimWorld__Biotech/);
[genetics, Wiki/full](https://rimworldwiki.com/wiki/Genetics);
[health, Wiki/full](https://rimworldwiki.com/wiki/Health);
[heredity, Wiki/full section, uncertainty flags retained](https://rimworldwiki.com/wiki/Reproduction#Heredity);
[Biotech disagreement, Community/indexed](https://www.reddit.com/r/RimWorld/comments/ysokr6/);
[trait disagreement, Community/indexed](https://ludeon.com/forums/index.php?topic=45904.0).

## B5-G07 Dwarf Fortress

**Model / extension.** Saved source DF-B01/B02 shows body topology, tissue layers,
blood/nerve flags and attack supports. Wiki states wounds can disable tissue
functions or lose parts, with lasting consequences. A hospital combines care
roles, diagnosis and supplies. Raw declarations are stronger evidence for the
body's authoring shape than for exact native propagation formulas.

**Data shape.** Species body template, connected part IDs, ordered tissue layers,
function tags, wounds and treatment requirements; derived functional availability.
Detailed tissue mechanics are optional world simulation, not necessary for WR1.

**Player reports.** Injury/scar stories show players attaching history to actual
survivors. Other threads describe patients not being treated and difficulty
understanding hospital prerequisites. Those reports do not establish whether
the cause is a bug, missing supplies or a misunderstood work rule.

**Cost.** Player: treatment skill, rescue, supplies and lost service time.
Browser: H for tissue-level combat, diagnostic detail and a care economy;
M for selected functional injuries. Body dependencies and NPC persistence are
larger costs than storing a wound number.

Sources: [anatomy, Wiki/indexed only after full-fetch timeout](https://new.dwarffortresswiki.org/index.php/Anatomy);
[tissue tokens, Wiki/indexed](https://new.dwarffortresswiki.org/index.php/Tissue_definition_token);
[survivor stories, Community/indexed](https://www.reddit.com/r/dwarffortress/comments/13ldlyy/);
[hospital friction, Community/indexed](https://www.reddit.com/r/dwarffortress/comments/16mpfhq/).

## B5-G08 Kenshi

**Model / extension.** The existing BODIES owner already establishes separate
limb states and functional consequences: a disabled arm changes two-handed
weapon support; replacements can restore work and specialize speed/strength.
Mechanical wear and repair beds differ from biological healing. Keep patched
item values distinct from actual vendor prices and native combat thresholds.

**Data shape.** Located part condition, loss/replacement state and fitted part ID;
part quality/functions; body type and separate organic/mechanical repair needs.
No inheritable prosthetic faculty is established.

**Player reports.** One discussion includes enthusiastic use of robotic limbs
and players who prefer their main characters' natural bodies. Another reports
that careful play rarely produces limb loss despite having specialist prosthetics.
Do not translate the upgrade temptation into a required self-injury loop.

**Cost.** Player: access to stock, fitting, money, repair and world-specific social
responses. Browser: M for located loss/replacement; H when every body/weapon,
travel, NPC and service must adapt. Cheap functional repair plus later specialty
is already proposed in BODIES B3; B5 adds comparison and player evidence.

Sources: [existing B1-B6](../../../../research/kenshi/second-pass/BODIES.md);
[robotic-limb preferences, Community/indexed](https://www.reddit.com/r/Kenshi/comments/1syle7h/anyone_else_avoid_using_robotic_limbs_on_their/);
[rare limb loss, Community/indexed](https://www.reddit.com/r/Kenshi/comments/l7iiat/no_limb_loss_am_i_doing_this_wrong/).
Fandom full fetch failed; local editor/tip evidence is retained, not relabeled native proof.

## B5-G09 Caves of Qud

**Model / extension.** Official roadmap documents physical mutation rapid
advancement and chimera limb growth. The saved dossier's component construction
supports the distinction between declaring a part and instantiating a working
consumer; it did not inspect every mutation. Public discussions describe
regeneration, injectors and facilities as alternative ways to recover limbs.
Somatic mutation and cybernetic change are not automatically a breeding system.

**Data shape.** Mutation ID, level/development and acquired provenance; body part
IDs/equipment supports, lost parts and restoration mechanism. Physical function,
mental ability and learned procedure remain distinct even when one mutation
supplies more than one.

**Player reports.** A regeneration thread values protection from limb loss and
long-term safety, while others question its cost when substitutes are accessible.
A robotic-follower thread objects to asymmetric organic/mechanical recovery.
The reports are build-sensitive and are not current implementation proof.

**Cost.** Player: mutation investment or service/material access. Browser: M for
one developed ability and alternate recovery routes; H for dynamic equipment
slots and many interacting body plans. Do not copy numerical level caps into G12.

Sources: [roadmap, Official](https://cavesofqud.com/roadmap/);
[regeneration disagreement, Community/indexed](https://www.reddit.com/r/cavesofqud/comments/1w4mn9h/should_regeneration_be_buffed/);
[robot recovery friction, Community/indexed](https://steamcommunity.com/app/333640/discussions/0/2965020518360986680/).
Qud wiki unavailable via full fetch; exact mutation formulas remain open.

## B5-G10 Cataclysm: Dark Days Ahead

**Model / extension.** Developer docs describe shared trait/mutation definitions,
mutagen fuel and category primers as stored vitamins, recurring effects and
thresholds. Purifier uses human-category targets that cancel mutations, rather
than adding ordinary visible “human eyes”. Body-part documentation separates
anatomy, encumbrance, healing and protection; wound definitions can constrain
eligible part types. This is development documentation, not a pin to every
stable release. A schema's presence does not prove every declared wound ships
in every release.

**Data shape.** Mutation definitions with prerequisite/conflict/replacement rules;
actor reservoirs and active traits; body part IDs, injury/effect state and gear
coverage. Exposure can be accumulated and resolved as a scheduled transition.
No offspring inheritance follows merely from the name “mutation”.

**Player reports.** Players enjoy unusual mutant builds and guide-assisted
experimentation. A dissenting thread says lab acquisition and waiting make the
system less enjoyable than avoiding it. Old vitamin guides disagree across
builds; developer docs take precedence for the stated development model.

**Cost.** Player: acquisition, dosing, waiting, treatment and equipment adaptation.
Browser: M for one timed transformation; H for numerous mutation prerequisites,
gear restrictions and metabolism. Hidden reagent math needs understandable
observable feedback if adopted.

Sources: [mutation docs, Official/full](https://docs.cataclysmdda.org/JSON/MUTATIONS.html);
[body-part schema, Official/indexed](https://docs.cataclysmdda.org/JSON/JSON_INFO.html);
[wounds, Official/indexed](https://docs.cataclysmdda.org/JSON/WOUNDS.html);
[guide and appreciative replies, Community/indexed](https://www.reddit.com/r/cataclysmdda/comments/11ag2uu/);
[mutation-access dissent, Community/indexed](https://www.reddit.com/r/cataclysmdda/comments/197eklf/).

## B5-G11 Rogue Legacy 1 and 2

**Model / extension.** RL1's existing P1 source trace saves three random builds
and applies compatibility rules; parent traits do not determine the next traits.
That is succession-themed build variety, not genetic inheritance. Retained paid
estate/equipment upgrades carry independently of the child's body. RL2's designer
says some traits add gold bonuses to encourage choosing awkward builds, because
RL1 players stopped selecting traits once their novelty wore off.

**Data shape.** Frozen candidate IDs/seed, class, traits and spell; chosen actor;
separate retained estate purchases and dead-character record. Optional RL2-style
challenge reward applies to a run condition, not an inherited gene.

**Reception.** GameSpot's RL1 review praises the random-trait hook but describes
being offered an appealing class with an unwanted trait. A GameFAQs user review
finds too many traits negative or inconsequential. RL2 gold uptake is a developer
report, not an independent player survey. The local RL1 source's inclusive RNG
counts differ from rounded wiki percentages; do not silently replace its evidence.

**Cost.** Player: accepting a build, failed attempts and paid preparations.
Browser: L/M for saved choices and functional traits; H for platforming/body-size
physics. No fixed three-choice limit or purchased reroll limit is proposed globally.

Sources: [RL1 press kit, Official](https://press.cellardoorgames.com/sheet.php?p=rogue_legacy);
[traits, Wiki/indexed](https://roguelegacy.wiki.gg/wiki/Traits);
[RL2 designer interview, Official/full](https://www.nintendo.com/en-ca/whatsnew/indie-world-interview-rogue-legacy-2-game-designer-teddy-lee-talks-about-the-newly-available-heir/);
[RL1 review, Critic](https://www.gamespot.com/reviews/rogue-legacy-review/1900-6411102/);
[trait dissent, Community/indexed](https://gamefaqs.gamespot.com/switch/250620-rogue-legacy/reviews/158738).

## B5-G12 Wildermyth

**Model / extension.** Saved source F1-F6 already connects aging, scars, recovery,
retirement teaching and relationship history. Wiki: an actual child can join
between chapters; the legacy pool instead saves heroes for recruitment in other
campaigns, with selected transformations/history and abilities. A promoted legacy
hero is not evidence of a child inheriting that hero's graft. Current-campaign
penalties and legacy aspects have separate retention policies.

**Data shape.** Person identity/parents, dated events and associated aspects;
body transformations by part; campaign snapshot and explicit legacy projection.
Mentorship names a recipient and transfer, independently of biological descent.

**Player reports.** Sampled players appreciate changing heroes and story events;
others find repeated events, aging pace or forced legacy recruitment reduce
attachment. A forum's metaphysical explanation of returned heroes is interpretation;
YAIR must name its own actual carrier.

**Cost.** Player: recovery time, retirement and recruitment/promotion resources.
Browser: M for a scar/event consumer or mentor transfer; H for a procedural event
library, multigenerational cast and cross-campaign legacy UI. Event authoring,
not DNA computation, is the principal replayability cost.

Sources: [hero, Wiki/indexed](https://wildermyth.com/wiki/Hero);
[legacy, Wiki/indexed](https://www.wildermyth.com/wiki/Legacy_tier);
[player praise/dissent, Community/indexed](https://www.reddit.com/r/Games/comments/o8dndd/);
[legacy narrative dissent, Community/indexed](https://steamcommunity.com/app/763890/discussions/0/2921102177268193585/).

## B5-G13 Darkest Dungeon, first game

**Model / extension.** Wiki: expeditions/curios can give positive and negative
quirks; the Sanitarium removes quirks or protects selected positive ones from
replacement. Some negative quirks become reinforced and more costly to remove.
Some quirks constrain curio interaction or activity, beyond stat modifiers.
This is a roster-history system. No biological inheritance or family succession
is established; do not classify it as a dynasty game because recruits replace losses.

**Data shape.** Per-hero quirk ID, origin, positive/negative category and retention
status; contextual trigger/effect; treatment reservation, cost and completion.
A resolved injury, continuing fear and remembered expedition are different facts.

**Player reports.** One discussion values choosing which accuracy/speed quirks to
retain; another deliberately keeps harmless negative quirks to avoid replacements.
Cost/lock complaints show players experiencing treatment as roster economics.
There is no universal agreement that removing all negative quirks is optimal.

**Cost.** Player: gold and unavailable service time. Browser: L for contextual
quirk cards, M for roster treatment and event changes. Five-quirk/three-lock limits
are this game's balance, not a universal person model. No compulsory flaw budget.

Sources: [quirks, Wiki/indexed](https://darkestdungeon.wiki.gg/wiki/Hippocratic);
[Sanitarium, Wiki/indexed](https://darkestdungeon.wiki.gg/wiki/Sanitarium);
[treatment value, Community/indexed](https://www.reddit.com/r/darkestdungeon/comments/128voxu/do_you_guys_actually_use_the_sanitarium/);
[keep harmless quirks, Community/indexed](https://www.reddit.com/r/darkestdungeon/comments/1l4vmgq/);
[cost/lock complaint, Community/indexed](https://gamefaqs.gamespot.com/boards/225036-darkest-dungeon/76658435).
The indexed Hippocratic URL resolves to the quirks article; canonical full fetch failed.

## B5-G14 Tale of Immortal

**Model / extension.** Saved CE4/5 separates weapon/element aptitude axes and
item-supported improvement; CE1/3 separates breakthrough quality choices and
lasting failure conditions. Wiki describes initial Nature Destinies and later
Rewrite/Sect Destinies. Some named constitutions alter particular root axes;
name, affinity, selected advancement and working anatomy remain different.
Neither a named destiny nor “blood” establishes offspring transmission.

**Data shape.** Aptitude vector, destiny/feature IDs with provenance/duration,
realm/phase/quality and selected techniques. A physique can change acquisition
or conversion without becoming a general “genetic strength” scalar.

**Player reports.** Sampled players like cultivation realm flavor and story
completion; others complain about fruit grinding and time spent rerolling a
large destiny pool. One reports enjoying a full binge despite those costs.
No popularity ranking of specific physiques was established.

**Cost.** Player: resources, practice, breakthrough preparation and recovery.
Browser: L/M for a few process-changing constitutions; H for many techniques,
sect society and action combat. Do not infer inherited roots from ordinary NPC
aptitude generation.

Sources: [Destiny, Wiki/indexed](https://tale-of-immortal.fandom.com/wiki/Destiny);
[Nature Destiny, Wiki/indexed](https://tale-of-immortal.fandom.com/wiki/Nature_Destiny);
[completion praise, Community/indexed](https://www.reddit.com/r/TaleofImmortal/comments/1lw6sg3/);
[reroll/grind friction, Community/indexed](https://www.reddit.com/r/TaleofImmortal/comments/1twisd7/ive_just_been_looking_for_cultivation_game_and/).

## B5-G15 Amazing Cultivation Simulator

**Model / extension.** Existing C01-C10 covers one cultivation law and lasting
core/preparation consequences. The new, public-level comparison is physical
cultivation: wiki/guide describes consuming material for essences, remolding
specific parts with labels, and Secret Bodies requiring particular part-label
combinations. Completing prerequisites and equipping a Secret Body are separate.
This is acquired body construction; ordinary hereditary transmission is not
established. Physical, Xiandao and Shendao routes must not collapse into one bar.

**Data shape.** Body part IDs, remold level/label set, essence custody, law and
Secret Body definition/requirements/equipped state. Distinguish bonuses to the
cultivator from bonuses only used by a particular equipped Secret Body.

**Player reports.** Players exploring powerful specialist builds discuss part
synergies, but repeatedly ask for explanations of essence, remolding and passive
versus equipped effects. A detailed community guide explicitly qualifies
untested/inconsistent material. No new source trace closes ACS depth priority 1.

**Cost.** Player: materials/essences, remolding time and selected development.
Browser: M for one part and one functional combination; H for all parts, labels,
resourcing and loadouts. A requirements preview is cheaper than making the player
solve an opaque spreadsheet through wiki switching.

Sources: [physical cultivation, Wiki/indexed after failed full fetch](https://amazing-cultivation-simulator.fandom.com/wiki/Physical_Cultivation);
[Secret Bodies, Wiki/indexed](https://amazing-cultivation-simulator.fandom.com/wiki/Secret_Bodies);
[body parts, Wiki/indexed](https://amazing-cultivation-simulator.fandom.com/wiki/Body_Part);
[qualified guide, Community/indexed](https://steamcommunity.com/sharedfiles/filedetails/?id=2754012450);
[understanding difficulties, Community/indexed](https://steamcommunity.com/app/955900/discussions/0/5242718027632915187/).

## B5-G16 Trimps

**Model / extension.** Shown in public `main.js`: `breed()` derives breeding
population from owned minus employed Trimps, modified by Multitasking; population
below two or particular challenges stop breeding. `fight()`/Anticipation reads
elapsed breeding/preparation time into an attack benefit. This is aggregate
population supply and combat cadence, not named offspring or allele inheritance.

**Data shape.** Owned/employed/soldier counts, capacity, potency modifiers and
elapsed breed/preparation state. These source fields are public; a pedigree is
not part of this bounded trace. Source at mutable master was read 2026-10-14,
without a commit pin or runtime test.

**Player reports.** A strategy discussion weighs longer preparation against
continuous fighting; another reports confusing settings/timer behavior. The
first shows valued optimization, not a broad satisfaction survey. Time spent
waiting can be a decision or simply a stall depending on feedback.

**Cost.** Player: workforce opportunity and combat wait. Browser: L for cohorts;
M for safe catch-up and threshold scheduling. Do not present replacement armies
as children with lives, or impose that abstraction on the player household.

Sources: [developer source, Official/full, breed L5345 onward](https://raw.githubusercontent.com/Trimps/Trimps.github.io/master/main.js);
[Anticipation source locator](https://github.com/Trimps/Trimps.github.io/blob/master/main.js#L11142-L11150);
[strategy, Community/indexed](https://www.reddit.com/r/Trimps/comments/pup8lk/);
[timer friction, Community/indexed](https://www.reddit.com/r/Trimps/comments/kke4vx/).

## B5-G17 Legends of IdleOn: World 4 breeding

**Model / extension.** The retrieved community guide describes passively produced
eggs, rolls to unlock the next pet, a pet-type “Genetic” ability, rolled power,
and breeder/shiny variants. Breeders increase future odds through fenceyard time;
shinies develop account bonuses there. This is named pet progression and team
composition, not demonstrated two-parent allele recombination. Separate the
World 4 system from paid companion pets, which the guide explicitly distinguishes.

**Data shape.** Egg supply/rarity, unlocked pet species, per-pet power/variant,
ability ID and yard assignment/progress. A “Genetic” field here is a role effect,
not evidence of a parent genotype.

**Player reports.** An endgame thread calls team compositions/abilities the fun
part and dislikes when progression makes them irrelevant. Other threads report
weeks of failed unlock rolls. Those are old versions; current odds/purchases
were not audited. Do not substitute companion-gacha criticism for breeding evidence.

**Cost.** Player: egg waits, space and opportunity among pet roles. Browser: M
for pet jobs and rolls; H for balance across many account bonuses. A finite
queue and clear chance preview can reduce chores, but exact odds need their own
source, not guesses from failure streaks.

Sources: [guide, Community/full, dated 2026-04-17](https://www.digitaltq.com/wiki/idleon/pet-breeding);
[valued team-building and endgame complaint, Community/indexed](https://www.reddit.com/r/idleon/comments/1410l21/);
[failed-roll reports, Community/indexed](https://www.reddit.com/r/idleon/comments/1jhy5xj/).
No direct game-source or official breeding formula pass.

## B5-G18 DragonVale, timer collection comparator

**Model / extension.** Wiki describes eligible dragon combinations, breeding and
incubation durations and a results preview. Official Runic Breeding Cave event
help distinguishes egg-history results from actually claimed dragons. This is
pair-selection with species/element eligibility and waiting, not proven hidden
alleles. The Runic event's claim limits are local event rules, not general birth
rules or proposed YAIR caps. DragonVale is a timer collector, not a pure prestige idler.

**Data shape.** Parent dragon IDs/types, permitted candidate types, committed
outcome and completion time; nursery capacity; separate history/claim state for
that event. Commit and persist an outcome under the selected policy before
reload can reroll it.

**Player reports.** App Store reviewers enjoy designs and co-op recovery of
missed dragons but dislike habitat congestion. Forum samples enjoy rare results
and also complain about repeated failed attempts with long timers. Later
monetization complaints are player views, not an audited revenue model.

**Cost.** Player: waits, habitat space and event opportunity. Browser: M for
bounded timed pairs/nursery; H if server/co-op/event economies are copied.
Long waits can pressure attendance; safe offline progress needs an explicit policy.

Sources: [breeding, Wiki/indexed](https://dragonvale.fandom.com/wiki/Breeding);
[Runic event, Official/indexed](https://support.decagames.com/hc/en-us/articles/4584364277533-Luck-of-the-Vale);
[reviews, Community/indexed](https://apps.apple.com/us/app/dragonvale-breed-dragons/id440045374?see-all=reviews);
[success and failed attempts, Community/indexed](https://www.reddit.com/r/dragonvale/comments/1ifa1zw/).

## B5-G19 Immortality Idle

**Model / extension.** Reuse the Oct. 13 pinned source findings: family specialty
comes from the most-practised craft; bloodline ranks widen explicit carry;
family techniques derive from experience; follower succession assigns a child's
weaker continuation. Player aptitude carry is reincarnation of the same person,
not a complete genetic child simulation. Do not redo F2/F5/F6/F9/F11 as new finds.

**Data shape.** Previous-life gain and retained aptitude; family specialty;
technique provenance/mastery; owned retained assets; follower role/successor
relationship. Cultural apprenticeship and soul progress differ from DNA.

**Player reports.** Older discussion enjoys lifespan snowballing and flexible
routines but asks what bloodline establishment actually buys. Another describes
slow high-tier bloodline requirements. These concern earlier versions and do
not verify the newer local pin's balance.

**Cost.** Player: long-life preparation and carry investment. Browser: M for
one earned family lesson/trade carrier; H for generated technique combinations
and many life/meta layers. Existing source license caveat remains: ideas only,
no copied code. Public pinned-repo fetch failed; local report supplies the trace.

Sources: [pinned source owner and locators](../../../../research/immortality-idle/REPORT.md);
[developer game URL](https://immortalityidle.github.io/), existing dossier provenance,
not re-exercised here; [bloodline uncertainty and growth enjoyment, Community/indexed](https://www.reddit.com/r/incremental_games/comments/w7t3jr/);
[late carry grind, Community/indexed](https://www.reddit.com/r/incremental_games/comments/x46gxt/).

## B5-G20 Evolve Idle

**Model / extension.** Existing pinned Evolve dossier traces race-dependent
requirements and distinct reset/carry policies. Species continuity changes future
production/technology context; aggregate population/jobs do not establish named
families or personal genetic inheritance. “Genetic” currencies and traits can
model civilization development without a genome per resident.

**Data shape.** Species template, trait IDs, population/jobs, run/world state,
retained currencies and route-specific prior-species context. Named actors need
separate records if introduced; no global ancestor omniscience follows.

**Player reports.** A sampled discussion likes resets changing species and play
style, while replies call achievement repetition grindy. That reflects different
preferences about long-form accumulation, not a requirement to remove all
repeat play. The newer local dossier did not test that reception claim.

**Cost.** Player: reset losses, long progression and optional challenge rules.
Browser: M for one template/context carry; H for a civilization tech catalogue
and many reset types. One realm/one prestige remains the YAIR milestone.

Sources: [existing pinned source and reset locators](../../../../research/open-idle-games-2026-10-09/EVOLVE.md);
[developer game URL](https://pmotschmann.github.io/Evolve/), existing dossier provenance,
not re-exercised here; [species variety and grind disagreement, Community/indexed](https://www.reddit.com/r/incremental_games/comments/16rbp8s/).
Pinned GitHub tree retrieval failed; no new source audit claimed.

## B5-G21 Battle Brothers, existing injury comparator

**Model / extension.** Saved BB-FL10-FL13 already establishes healing time/supply,
specific injured functions and lasting wounds that can redirect a role. Keep its
swordmaster aging event separate from universal biological decline. There is no
new dynasty or genetic simulation claim.

**Data shape.** Background, talent and trait IDs separate from temporary/permanent
injury IDs; recovery progress/resources, role and dated loss record.

**Player reports.** Threads include keeping scarred veterans in adapted roles
and frustration that severe injuries erase investment or prompt retirement.
Those are useful opposite reactions to “survival with consequence”. Their years
and balance differ; no current failure rate was measured.

**Cost.** Player: medicine, wages, downtime and reassignment. Browser: L/M for
an injury card and honest treatment estimate; H for full roster tactics. B5
borrows presentation rather than repeating the existing injury proposal.

Sources: [existing source findings](../../../../research/battle-brothers/FINDINGS.json);
[permanent-injury debate, Community/indexed, 2016](https://steamcommunity.com/app/365360/discussions/0/350540974013730171/);
[retirement and adapted use, Community/indexed, 2022](https://www.reddit.com/r/BattleBrothers/comments/ublhlb/).

## B5-G22 BitLife, existing succession comparator

**Model / extension.** The Oct. 13 public-page dossier already covers child
continuation at the child's current age and life-end summary. This supplies an
honest successor receipt, not a verified allele model. Estate continuity, the
person's age and editable appearance remain different state.

**Data shape.** Family roles/person IDs, dated life state, estate allocation and
successor preview. Show what changes before selecting that person.

**Player reports.** App Store reviews like funny scenarios and request continuity;
others object to separate paid unlocks. Community replies disagree on which
generations are free. Do not state a universal current paywall from these reports.

**Cost.** Player: life time and version-dependent content access. Browser: L/M
for successor age/history/estate display; H for thousands of life events. Annual
pacing is a comparator, not selected YAIR timing.

Sources: [existing public-page scope](../../../../research/bitlife/REPORT.md);
[App Store reception, Community/indexed](https://apps.apple.com/tt/app/bitlife-life-simulator/id1374403536?platform=iphone&see-all=reviews);
[access disagreement, Community/indexed](https://www.reddit.com/r/BitLifeApp/comments/1vefagq/cant_even_do_the_challenge_today_this_game_sucks/).

## B5-G23 Critter Mound, published community fork

**Model / extension.** The fork's published help describes offspring traits
varying around their parents' range, with mutation bonuses and an explicit
none/recessive/expressed table. Royal and heir hatcheries produce candidates
for later parents, workers and soldiers. The body statistics feed health,
production and combat. This is a direct idle selective-breeding reference;
it does not establish a full many-locus genome. Original hosting is gone;
this lane inspected the jayseesee fork's public help, not every fork or runtime.

**Data shape.** Parent IDs, generation/birth order, quantitative trait values,
mutation/expression state, hatchery membership, role and offspring timer. The
range/mutation model is stated in help; a save-schema or exact RNG audit was
not performed.

**Player reports.** A retrieved discussion loves choosing stronger or weaker
offspring for different uses but also reports repetition. Requests include
individual king/queen selection priorities, automated replacement and better
sorting/tie-breaking. A separate completion report says royal breeding limits
require interaction. Those limits are that fork's game rule, not a YAIR proposal.

**Cost.** Player: hatchery space, parent selection and production allocation.
Browser: M for individual organisms, saved offspring and policy-driven sorting;
H for war maps and large mutation catalogs. Automation should use an explicit
keeper policy rather than discard a valued creature from its total score alone.

Sources: [published help, Community fork/full](https://jayseesee.github.io/Crittermound-Fork/);
[mechanism praise and automation requests, Community/full, 2020](https://www.reddit.com/r/incremental_games/comments/fwnjdi/);
[completion/interaction report, Community/indexed](https://www.reddit.com/r/incremental_games/comments/hfok82/).
Accessed 2026-10-14. No matching existing repo research found in the scoped
research/repository-bank search. No code, assets or caps imported.

## Coverage boundaries that matter

B5-G01/B5-G03/B5-G06 are inheritance references; B5-G04/B5-G05/B5-G09/B5-G10/B5-G14/B5-G15 often model
editing, templates or acquired change. B5-G11 offers random successors; B5-G12 offers
both actual children and returning legacy heroes; B5-G13 offers replacement roster
members. B5-G16 is population breeding, B5-G17 pet rolls, B5-G18 eligible pair outcomes,
B5-G19 cultural/reincarnation carry, B5-G20 species/reset context, B5-G23 parental-range
variation and mutation expression. Those mechanisms can
coexist, but none proves the others.

No source here establishes all of GN1/GN3/GN4/GN6, bloodline sensory powers,
ancestral consciousness, soul heredity or supernatural gender rules. Do not fill
those gaps by renaming an ordinary gene/stat bonus. G2 Warhammer claims remain
with their existing lore owner. Sealed truths were neither inspected for this
comparison nor disclosed.
