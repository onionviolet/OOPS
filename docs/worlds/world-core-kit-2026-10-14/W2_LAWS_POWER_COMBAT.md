# W2: world laws, power core and combat grammar

CHECKPOINT, 2026-10-14: COMPLETE documentation pass. K2/K3/K10 covered for
the 14 priority entries, with TTKS split into five books; paused Soldier's
Life and a short Frontier row included. No gameplay, builds or saves touched.
Resume from the open source bindings in W2_REPORT.md, not from a claim that
these floors are playable. Only this file and that report belong to W2.

These are considerations under the [root palette](../WORLD_CORE_KIT_2026-10-14.md),
not accepted specs. Standing canon-first order, one playable slice at a time,
one realm/one prestige milestone and desktop-first proof remain unchanged.
K2.7 onward, K3.9 onward and K10.6 onward extend the palette's codes.

## Reading the cards

Each K2 row is a candidate engine fact with its own import policy. **H** means
hard within the named mechanism/profile; **S** means an enforceable social
rule, which can be broken. H does not mean an exception is impossible. Named
exceptions need their own support and source. Import policies are **INFERRED**
adaptation choices throughout, even when the underlying law is sourced.
Allow means preserve actual supported operation, not award native eligibility.
Convert needs a declared adapter; suppress keeps ownership and learning.

**SHOWN** names a source scene locator in a qualified local reading record.
**STATED** names an official/secondary statement or an attributed character
teaching. A scene is SHOWN only through that record, not a new primary-text
audit here. **INFERRED** is a design proposal. **MEMORY** is unchecked recall
and is never a floor binding. Numerical costs not established by sources stay
unknown. Default + Dial choices below are all INFERRED.

Readiness means the combined documentation/source/consumer floor, not just a
lore paragraph. **Partial** means useful anchors or bounded consumers exist;
**missing** means the required coherent floor is not yet supplied by the
inspected owners. No world gets a playable-floor-met claim from this pass.

### Sources used as card keys

| Key | Binding and limit |
|---|---|
| HP | [Brief](../harry-potter/WORLD_BRIEF.md), [ledger](../harry-potter/SOURCE_LEDGER.md) H1-H4; [digest](../../research/power-systems/wiki-digests/DIGEST_harry-potter.md) DH1-DH5. Seven-novel baseline proposed; supplemental and mixed-media wiki statements stay qualified. |
| DD | [Source contract](../dnd/SOURCE_CONTRACT.md) S02/C01-C08, [foundation](../dnd/FOUNDATION.md), [first slice](../dnd/FIRST_SLICE.md). Selected SRD sections, not full class/monster coverage. |
| TT1-TT5 | Private `docs/research/novels/ttks-novels-2026-10-10/B1` through `B5/DEEP_DIVE_2026-10-10.md`, section 2 rule rows and their bracketed chapter/member locators; tracked [north star](../../LIFE_SIM_NORTH_STAR.md#ttks-five-book-findings-2026-10-10). No prose copied. |
| ML | [Brief](../mother-of-learning/WORLD_BRIEF.md), source-law table MOL-C001/002/011/PS036; [depth part 02](../world-depth-2026-10-13/02_MOL_HP_JJK_DND.md). The current visitor is explicitly a nonmage. |
| LM | Private `docs/research/novels/full-book/lord-of-mysteries/POWERS.md`, headings for ch16-25, 26-35, 36-45, 66-75, 86-95 and 96-100, with r003-r011 claims. Partial integrated index; statements retain their speaker. |
| CI | Private `docs/research/novels/full-book/circle-of-inevitability/POWERS.md`, sections 1-4, exact r/c claims below. Compilation suspected MTL; closing reality status unresolved. |
| SS | Private `docs/research/novels/full-book/shadow-slave/POWER_INDEX.md`, OE14-OE16; [depth part 09](../world-depth-2026-10-13/09_MORE_BOOK_WORLDS_CANON_AND_AU.md) QSS; [historical digest](../../research/power-systems/wiki-digests/DIGEST_shadow-slave.md) DSS1 is not the current wiki. |
| RP | [Brief](../paradise-hub/WORLD_BRIEF.md), [canon priority plan](../paradise-hub/CANON_PRIORITY_PLAN_2026-10-14.md). Supplied MTL sid20 Goa and sid26-28 hub placement differ; original Exchange differs from the novel. |
| JJ | [Ledger](../jujutsu/SOURCE_LEDGER.md), [variants](../jujutsu/ABILITY_VARIANTS.md), [digest](../../research/power-systems/wiki-digests/DIGEST_jujutsu-kaisen.md) DJ1 and remaining named revision rows. Secondary snapshot, with corrections. |
| BL | [Ledger](../bleach/SOURCE_LEDGER.md) B1-B14/BU rows, [variants](../bleach/ABILITY_VARIANTS.md). Manga baseline; official anime corroboration stays separate. |
| FT | [Digest](../../research/power-systems/wiki-digests/DIGEST_fate-series.md) DF1-DF3, revision-qualified Command Spell and Servant sections. Not a merged Fate franchise ruleset. |
| HX | [Digest](../../research/power-systems/wiki-digests/DIGEST_hunter-x-hunter.md) DX1-DX3, Nen r421055 selected sections. Full affinity/training rules still need primary locators. |
| FM | [Ledger](../fullmetal-alchemist/SOURCE_LEDGER.md), [variants](../fullmetal-alchemist/ABILITY_VARIANTS.md), [digest](../../research/power-systems/wiki-digests/DIGEST_fullmetal-alchemist.md) DM1. Manga/2009 and 2003 stay separate. |
| NR | [Ledger](../naruto/SOURCE_LEDGER.md) N1-N15/NU1-NU8, [variants](../naruto/ABILITY_VARIANTS.md). Original volumes 1-72; excluded later one-shot teaching is not restored by this pass. |
| SL | [Depth part 04](../world-depth-2026-10-13/04_FALLOUT_SKYRIM_SL_TTKS.md), [part 08](../world-depth-2026-10-13/08_PRIORITY_CANON_AND_AU.md), W1-SRC card references. Private pack/runtime task remains paused. |

Live web spotchecks, 2026-10-14: [D&D playing rules](https://www.dndbeyond.com/sources/dnd/br-2024/playing-the-game),
[D&D spell rules](https://www.dndbeyond.com/sources/dnd/br-2024/spells/),
[acting method](https://lordofthemysteries.fandom.com/wiki/Acting_Method),
[Beyonders](https://lordofthemysteries.fandom.com/wiki/Beyonders),
[Aspect](https://shadowslave.fandom.com/wiki/Aspect).
The latter three are secondary checks of limited claims: natural digestion is
slow, acting applies to boons too, boon acquisition differs from potions, and
Aspects exist independently of Spell service. They do not certify whole wikis
or promote blocked local digests into fresh revision-backed evidence.

### Shared source seams, read from the live tree

| Code | Existing seam | What it does not establish |
|---|---|---|
| E1 | `src/rules.js:3` evaluates fact predicates; `src/simulation_effects.js:85` collects simulation facts. | No complete per-world physics/exception library. A proposed world law needs actual facts and a consumer. |
| E2 | `src/energy_resources.js:5`, `:21`, `:46` validate policies and separate reserve, output, control, efficiency and strain. | Integer policy with frozen dimensions; no automatic world-specific capacity growth, acting, affinity or physiology. HP need not use it. |
| E3 | `src/power_models.js:5` supports practice/design/investment/authority/hybrid; `:30` checks custody/jurisdiction; `:37` checks lineage. | Models do not implement Nen, domains, pathways or personal releases merely by naming them. |
| E4 | `src/techniques.js:85`, `:99`, `:128` separate evidence, understanding, ownership, practice and execution. | Current practice is bounded and world-bound; not a universal innate-power generator or cross-world technique adapter. |
| E5 | `src/simulation_effects.js:105`, `:118`, `:227`, `:321` expose energy/faculty facts and apply energy/source/faculty effects. | Suppression does not itself select a foreign-power conversion; definition copying does not move a soul/organ. |
| E6 | `src/realm_boundary_rules.js:103` previews supported source, method, authority, body and anchor, including named exceptions. | Boundary admission differs from laws governing an effect after entry. No universal mana exchange rate. |
| E7 | `src/native_battle.js:10`, `:38`, `:64` has the bounded agreed road duel, strikes and withdrawal; `src/audit_remainder_combat_objectives_battle.js:132`, `:157` settles objectives and exposes guard/escape choices. | Not faithful party tactics, domain clash, initiative, spirit contact or arbitrary actors in every world. |
| E8 | `src/content_packs.js:55`, `:76`, `:109`, `:118` validates/registers packs and acts/settles their jobs; `src/world_instances.js:310` plans world clocks. | Packs are carriers, not evidence that every power is implemented. Closed-browser growth and a general reset/absence policy remain separate. |

K3 mapping below uses the [ability authoring owner](../ABILITY_AUTHORING.md):
family/purpose, specific source, body, method, fuel, mastery, target, provenance
and effect remain distinct. Where no local ABILITY_VARIANTS exists, this is a
proposed mapping into that owner, not a request to edit it in W2.

## HP: Harry Potter

**Floor today:** K2 partial (HP DH1-DH5 and H2); K3 partial (careers and
eligibility in brief, no native spell core); K10 missing (no source-bound
threat/defeat loop in the candidate). Proposed floor: eligible learner or
ordinary craft worker, supervised practice, 3-6 named supported charms and
one school-ground rescue/duel with retreat and treatment.

| Code | K2 engine fact | Type/evidence | What it does to imports |
|---|---|---|---|
| HP-L1 | Family membership and tool possession do not prove magical eligibility. | H, STATED HP H2, supplemental registry evidence | Allow foreign tools; require a separately supported native source before local casting. |
| HP-L2 | Food creation, moving food and multiplying existing food are different operations. | H, STATED DH5, mixed-media scope qualified | Apply Gamp's gate to local transfiguration. A foreign creation power gets its own allow/convert decision, not an automatic global ban. |
| HP-L3 | A selected Unbreakable Vow needs accepted clauses and a binder; its breach is fatal in the checked account. | H, STATED DH1 | Foreign contract labels do not receive this sanction. Local binding requires the actual ritual. |
| HP-L4 | Concealed information and keeper disclosure authority differ from ordinary visibility. | H, STATED DH3 | Foreign sight may see a physical trace without learning a protected fact; exact bypass is a source-bound exception. |
| HP-L5 | Court judgments are institutional acts, not guaranteed truth. | S, STATED DH4 | Allow an imported power with attention; witnessed misuse can produce investigation, trial or confiscation. |
| HP-L6 | Public magical exposure has an era/jurisdiction-specific enforcement response. | S, INFERRED floor; exact secrecy statute needs a novel locator | Allow with attention rather than making criminal law a physics lock. |

**K3.1:** resource = actual magical faculty, tools, attention and recipe
materials; no sourced generic mana bar. Growth = learned accuracy, repertoire
and judgment. Expression = charms, transfiguration, potions and plant work.
Limit = eligibility, method, target/material rules, tool fit and particular
spell risks. **K3.2:** queued reading, safe wand drills, plant tending and
known brewing can grow relevant practice; new hazardous casts need a trial.
Default: supervised routines. Dial: independent experimentation, because a
teacher's approval and the student's control need not grow together.

**K3.3-.8:** school/mentor, library plus tests, and craft apprenticeship are
native routes proposed in HP brief. Year, exams and office are social facts,
not metaphysical levels. Personal techniques start as authored modifications
of a qualified spell: choose target/precision/trigger, test, retain provenance.
Dangerous shortcuts include unsupervised recipes and binding promises; exact
backlash stays spell-specific. Daily uses: cleaning, light, mending, gardening
and food handling. Map into ABILITY_AUTHORING's learned/tool/material routes,
E1/E3/E4/E6; missing adapters are eligible caster, wand relation and actual
spell/recipe semantics. E2 is optional, not a canon requirement.

**K10.1-.5:** INFERRED grammar: interruptible casting, line of sight, cover,
disarm and recovery, with a rescue objective beside the duel. Threat roster:
unsafe experiments, hostile creatures, harmful artifacts, hostile wizards
and enforcement patrols, each needing a source card. Defeat defaults to
injury, lost access or capture; recovery uses infirmary/qualified care.
No promise of healing every curse or undoing death. Talk to a teacher, trade
information, hide, leave or surrender are supported floor proposals. Default
school-day risk is lower than forbidden sites or crisis-era streets; dial
supervision by term and political era, for an in-world staffing reason.

**More to consider:** K2.7 HP keep magical contract sanctions per ritual,
including the untested Goblet refusal case (DH2). K3.9 HP allow reliable
household mastery without making the caster a good duelist. K10.6 HP a
disarmed actor may still have other sourced means; removing a wand is not a
universal faculty deletion.

## DD: Dungeons & Dragons

**Floor today:** K2 partial (C01-C08 qualified); K3 partial (foundation and
first-slice design, no full class/slot consumer); K10 partial in docs only.
Floor proposal: SRD 5.2.1 profile in one Phandalin region, a small class
toolkit, finite rest and one party-sized rescue with stabilization/escape.

| Code | K2 engine fact | Type/evidence | What it does to imports |
|---|---|---|---|
| DD-L1 | A rules profile determines checks and effect definitions; advantage/disadvantage is profile-specific. | H, STATED C01 plus INFERRED profile binding | Convert supported attack/save interfaces under a declared adapter; do not silently reroll the traveler. |
| DD-L2 | Concentration is lost through the named interruption conditions. | H, STATED C03/S02 p179 | Native concentration effects share that gate; foreign sustained effects retain their own channel unless mapped explicitly. |
| DD-L3 | Zero HP, death saves, stabilization and healing are separate states. | H, STATED C04/S02 pp17-18 | Imported healing names its actual target state. HP gain is not automatically resurrection. |
| DD-L4 | A short rest has a duration and eligibility, not merely a button press. | H, STATED C05/S02 p187 | Recover only declared native resources; foreign fuel is not replenished because a rest completed. |
| DD-L5 | Mending repairs its eligible break but cannot restore lost magic. | H, STATED C06/S02 p148 | Foreign repair can exceed it if its real mechanism does; selecting Mending does not inherit that reach. |
| DD-L6 | Craft work requires particular proficiency, stock and time. | H, STATED C02/S02 p103 | Allow imported expertise where tools/materials work; imported title alone is not proficiency. |
| DD-L7 | Local law/reputation controls permits and response to violence. | S, INFERRED from S04 civic slice | Allow with attention; adjudication differs from a spell saving throw. |

**K3.1:** resource = class-specific uses/slots, hit dice, components and
equipment; growth = selected class advancement plus learned craft; expression
= actions/features/spells; limit = class prerequisites and exact spell rules.
**K3.2:** idle study, craft and safe drills; resting restores only what the
chosen profile says. Default queued downtime, dial milestone versus earned
XP advancement, because campaigns award progress differently. Do not award
a level simply for sleeping.

**K3.3-.8:** teacher/guild, prepared spell study and patron/faith routes need
class-specific source cards. Level is not printed on a villager's forehead;
office, reputation and demonstrated spells shape reactions. Personal technique
generation defaults to authored feat/spell combinations, with experimental
spell research as a dial. Risky shortcuts: poorly prepared dungeon entries,
unsupported magical experiments and negotiated patron obligations; not every
warlock has the same punishment contract. Daily light, repair, healing and
craft map to C06-C07. Use ABILITY_AUTHORING and E1-E4/E7; missing native slot,
action-economy, concentration, rest and death-save profile adapters stay explicit.

**K10:** INFERRED feel = party tactics, initiative, movement, actions and
limited recovery. Floor threats: bandits, territorial beasts, traps, undead
and one lair faction; select actual SRD stat blocks later. Defeat can mean
stabilized rescue, ransom, abandoned objective or damaged supplies; a lethal
profile can still kill. Parley, stealth, payment, bypass and faction diplomacy
need real actor motives. Default settlement roads before crisis are safer than
lairs and war fronts; dial patrol strength by setting snapshot, not edition.

**More:** K2.7 DD separate rules edition from in-world era. K3.9 DD maintain
slot replenishment per class, not an all-power rest refill. K10.6 DD an
objective can succeed while the party retreats; retain which allies remain
stable, carried or captured.

## TT: TTKS is five worlds, not one power ladder

**Floor today for each book:** K2 partial through its deep dive; K3 partial
as source analysis without a native core; K10 partial as source encounters,
missing an authored threat/recovery consumer. Part 08 proposes B5 as the
smallest slice, not an accepted change in order. All five need separate
definitions, evidence and import policies. Their current source cutoffs are
historical snapshot boundaries, not claims of current publication completion.

### TT1: mimic wizards, B1

| Code | K2 engine fact | Type/evidence | What it does to imports |
|---|---|---|---|
| TT1-L1 | Vein link selects a native route; proximity to its root affects linking. | H, STATED TT1 L1-L2 [0014/0023/0028] | Imported learning does not grant a vein link. General versus route magic uses distinct eligibility. |
| TT1-L2 | Rituals and specialization qualify rank; medium-free use is a later stage. | H, STATED L3-L4 [0022/0053/0054/0083] | Foreign strength is allowed without awarding native rank or casting privileges. |
| TT1-L3 | Native spell capacity can be overdrawn at bodily risk. | H, STATED L6 [0025/0068] | Charge only the source actually supplying the spell; foreign fuel conversion needs a separate mapping. |
| TT1-L4 | A mimic needs identity and anchor support; broken anchor changes survival and execution. | H, SHOWN/STATED L8 [0002/0008/0068] | Foreign mimicry does not become this anatomy; foreign anchor protection can work if supported. |
| TT1-L5 | Upstream ownership and chalice compatibility differ from possession. | H, STATED L9-L10 [0069/0070/0071/0076] | A stolen/copy-held function keeps its source and recall policy; no definition-ID ownership transfer. |
| TT1-L6 | Death-return has particular memory/soul/world retention and growing voice burden. | H, SHOWN/STATED L11 [0020/0039/0046/0052/0084] | Foreign revival/rewind keeps its own manifest; do not stack free restores by treating all death powers as one. |
| TT1-L7 | Impersonation exposure changes local investigation and trust. | S, INFERRED from TT1 identity scenes | Allow foreign disguises with attention; evidence can be misleading rather than an omniscient alert. |

**K3:** resource/growth/expression/limit = spell capacity and soul-supported
faculties / rites, practice and source acquisition / route spells, personal
specializations and mimic powers / route, anchor, chalice, level and conflict
conditions. Idle fit: safe drills, reagent work and study; neither consuming
a source nor a new ritual resolves unattended by default. Native routes:
teacher, route manuals/market and actual source absorption. Rank affects who
will teach or sell, separate from disguise status. Personal generation uses
the three specialization paths (L4), with exact personal bonuses sourced.
Shortcuts: overcasting, exposed acquisition, incompatible powers and repeated
death; costs differ. Daily uses: identity upkeep, trade, ritual prep and
general utility magic. ABILITY_AUTHORING source-transfer/tool/learned lanes,
E2-E6; missing anchor/recall owner and functional conflict resolver.

**K10:** INFERRED grammar = investigate support, guard anchor, qualify
mental/level effects, contest a domain boundary, then choose escape or force.
Threats: investigators, rival mimics, hostile wizards, exposed anchors and
conflicting powers. Defeat can be retreat, broken cover, capture or a supported
return carrying its real burden. Bargain, disguise, relocate/protect the anchor
and surrender evidence are outs. Default neighborhood concealment is safer
than ritual markets under surveillance or a domain conflict; dial enforcement
and era knowledge. No unsourced universal foreign-power immunity follows from
L5's native domain account.

**More:** K2.7 TT1 a reported equal/lower-life-level condition is scoped to
the named effect, not every attack. K3.9 TT1 compare the same spell's economy,
duration and output facets. K10.6 TT1 several independent lethal causes can
coexist (L13 [0075]); clearing one is meaningful but not guaranteed survival.

### TT2: annual traits and simulation, B2

| Code | K2 engine fact | Type/evidence | What it does to imports |
|---|---|---|---|
| TT2-L1 | Annual draws use lived qualifying years, not every local accelerated clock. | H, SHOWN/STATED R1/R9 [0012/0024/0337/0342] | Suppress draw triggers under mismatched time flow; preserve owned traits. |
| TT2-L2 | Actual realm determines native draw odds and equipped capacity. | H, STATED R2 [0024/0045/0102/0309/0382/0450] | Foreign rank is not a native realm conversion by name. |
| TT2-L3 | Trait ownership differs from loadout; simulation swaps have a specific annual window. | H, SHOWN R4 [0015/0337/0547] | Imported traits use declared slots only if adapted; no universal slot cap on every foreign ability. |
| TT2-L4 | Settlement retains a whitelist of memory, realm, traits and trained arts, not simulated goods or relationships. | H, SHOWN/STATED R5/R8 [0067/0182/0309/0449/0640] | Each foreign carrier is retained/lost explicitly; remembered craft can rebuild, not conjure goods. |
| TT2-L5 | A simulated future loses timing reliability after real intervention. | H, SHOWN R7 [0067/0070/0193/0529/0605] | Allow foreign foreknowledge as attributed evidence; do not force the world to match it. |
| TT2-L6 | Trait wording and actual acquisition/breakthrough gates constrain effects. | H, STATED R10-R11 [0383/0397/0617] | Preserve foreign source scope; an explicit bypass may work instead of inventing a universal balance tax. |

**K3:** resource/growth/expression/limit = actual cultivation means, time
and equipped traits / practice, qualifying draws and settlement / arts and
trait functions / realm, aptitude, stock, lifespan and effect scope. Idle:
safe cultivation, practice and calendar draws where qualified; simulation
loadout and settlement decisions default to reviewable commitments. Teacher,
manual, simulated learning and rebuilding known craft are separate routes.
Realm is structural; local recognition requires observation. Personal arts
combine retained mastery with authored supported trait interactions. Risky
shortcuts: advancing without stock/support or trusting a stale forecast.
Daily cooking, making and study can use applicable traits. ABILITY_AUTHORING
hybrid/retained-learning lanes; E2-E4/E8, missing annual clock qualification,
loadout windows and simulation manifest.

**K10:** INFERRED grammar = scope-sensitive matchups and preparation rather
than realm alone. Threats: rival cultivators, monsters, hostile traits,
breakthrough hazards and aging pressure. Simulated defeat settles only the
declared payload; real defeat may be injury, loss of stock or death under
its actual profile. Leave, negotiate, change loadout at a legal window or
build an alternative tool. Default academy/settlement routines are safer
than hostile territories and later crisis eras; dial local event pressure.

**More:** K2.7 TT2 explicit traits can change odds, but there is no global
pity rule (R3). K3.9 TT2 practice-count mastery is one acquired trait, not
the world's default for everyone. K10.6 TT2 a successful future route can
fail in reality because its participants changed.

### TT3: multi-world challenge board, B3

| Code | K2 engine fact | Type/evidence | What it does to imports |
|---|---|---|---|
| TT3-L1 | Attempt, archive and submitted world are different states. | H, SHOWN/STATED R1-R2 [0128/0172] | Foreign powers enter the chosen mode's loadout; archives are not current live worlds. |
| TT3-L2 | Submitted worlds keep living and visits do not rewind them. | H, SHOWN R9 [0173/0373] | Allow later acquired powers on visits under the world's actual compatibility; no reset from challenge UI. |
| TT3-L3 | Lives, loadout, win and fail conditions belong to each challenge. | H, STATED R8 [0175/0237/0280] | Suppress prohibited functions by exact contract; no global single-life or unlimited-life rule. |
| TT3-L4 | New attempts have new NPC instances; retained memory/powers belong to the protagonist. | H, SHOWN R7 [0022/0073/0330] | Imported memory may guide contact but cannot mint previous trust. |
| TT3-L5 | Reward techniques are related redesigns, not perfect donor copies. | H, STATED R5 [0018/0072/0129] | Preserve reward provenance; foreign faithful copying remains a different mechanism. |
| TT3-L6 | Evaluation can include consequences after the entrant's death. | H, SHOWN R4 [0071/0101/0343] | Foreign death/escape does not automatically terminate the causal objective. |

**K3:** resource/growth/expression/limit = current loadout and native-world
fuel / per-attempt reward, retained practice and challenge outcomes / redesigned
techniques / contract, body and source support. Idle: known drills and
between-attempt preparation; unattended combat rewards need an actual simulation
consumer, not a timer. Routes: reward redesign, native teaching, retained
practice. Rank remains local to each destination. Personal generator takes a
qualified defeated-opponent function and produces an explicitly different
method, rather than cloning all properties. Risk: confusing reversible
attempt with irreversible hub/visit, or collateral objective failure. Daily
uses: planning, research, diplomacy and native utility functions. E3-E6/E8
and ABILITY_AUTHORING redesign/hybrid lanes; missing archive/submit and
posthumous evaluation adapters.

**K10:** native combat grammar comes from each destination, while challenge
grammar adds outcome objectives. Threats: opponents, civilians at risk,
faction obstruction, contract failure and permanent-visit enemies. Defeat can
return to hub with evaluated results where supported; no hub rewind. Talk,
support an ally, reform a faction, evacuate or leave. Place/era danger comes
from each selected scenario, not a shared board difficulty number.

**More:** K2.7 TT3 preview irreversible submission separately from archive.
K3.9 TT3 later powers may change a revisit's solution without changing its
history. K10.6 TT3 Maki's political outcome is a combat-adjacent win condition,
not a boss HP bar (structure row [0237]).

### TT4: humanity's heir, B4

| Code | K2 engine fact | Type/evidence | What it does to imports |
|---|---|---|---|
| TT4-L1 | Purity reading has a detector ceiling; golden ancestry is another axis. | H, STATED R1-R2 [0003/0018/0098/0139] | Foreign bodies are assessed by an actual detector, not assigned native status from an appearance tag. |
| TT4-L2 | Living-human authority is a top-level credential in the reported system. | H, STATED R3 [0060/0096], qualified by L3/L4 below | No imported human label automatically passes local biological/credential checks. |
| TT4-L3 | Each AI retains purpose and constraints, including a shown refusal. | H, SHOWN/STATED R4 [0078/0095/0117/0129] | Foreign command power must address that actor and scope; authority is not guaranteed all-purpose success. |
| TT4-L4 | Public service eligibility, private ownership and accepted family duties differ. | H, SHOWN/STATED R5 [0129/0130] | Allow real credentials/ownership; imported keys or titles do not seize estates. |
| TT4-L5 | Credentials have types, expiry and delegation; valid documents can lack applicable preconditions. | H, STATED R6-R8 [0065/0111/0126/0167/0176] | Convert only supported credential channels; no universal badge-to-authority exchange. |
| TT4-L6 | Purity bands influence local treatment, with patronage exceptions. | S, STATED R1 [0003/0018/0031] | Allow foreigners with attention; discriminatory treatment can be contested or bypassed socially. |

**K3:** resource/growth/expression/limit = actual body, psionics and accessed
machines / training, age-linked golden growth and negotiated inheritance /
psionic methods, tools and AI service / body capacity, credential scope and
AI policy. Idle: maintenance, learning and supported AI work; age-linked
growth can outstrip the body, not merely benefit it (R11 [0067/0155/0185]).
Native routes: machine tutoring, inheritance duties, trained psionics. Rank
is social purity/class, not automatic competence. Personal technique options
combine authored tool use and trained psionics; do not invent a universal
psionic school table. Shortcuts: fighting through bodily overload, exposed
identity or stolen access. Daily medical support, household upkeep, archive
work and logistics. ABILITY_AUTHORING authority/tool/body routes, E1/E3/E5/E6;
missing detector, credential trust graph and per-AI constraint consumers.

**K10:** INFERRED grammar = authority contest, access control and bodily
combat, with machines as actors rather than free inventory. Threats: hostile
descendants, misapplied orders, private defenses, overloaded bodies and
credential fraud. Defeat defaults to detention, access loss, escape with
injury or negotiation. Outs: prove applicable credentials, obtain delegation,
appeal to an AI's purpose, repair or trade. Default household guest safety
differs from contested estates and collapse-era infrastructure; dial the
network's functioning extent, because disconnected machines cannot hear orders.

**More:** K2.7 TT4 preserve both R3's broad authority and R4's refusal; do
not erase either to simplify command. K3.9 TT4 a purity ceiling raises possible
capacity, not trained floor (R10 [0072]). K10.6 TT4 imported weapons need their
own targeting rules; a native machine-design human-safety constraint is not
proof that every foreign attack fails.

### TT5: wasteland border inspector, B5

| Code | K2 engine fact | Type/evidence | What it does to imports |
|---|---|---|---|
| TT5-L1 | Search needs cooperation, which is not truth or loyalty. | H, SHOWN/STATED R1-R2 [0004/0005/0173/0213/0269] | Foreign mind control does not imply consent; an adapter must name the real cooperation mechanism. |
| TT5-L2 | Collector charges come from electricity and infrastructure. | H, SHOWN/STATED R3 [0010/0083/0295] | Convert supported electrical supply only; other energy is not free charge. |
| TT5-L3 | Copies can lack force/substrate; some carry a seed or hazardous information. | H, STATED R4 [0089/0133/0214/0305] | Preserve what the foreign copy actually includes; no blanket degradation of every copying power. |
| TT5-L4 | Equipping changes body and memory; mastery can release slot use. | H, SHOWN/STATED R5 [0007/0009/0142] | Imported knowledge does not supply those bodily changes without its actual source. |
| TT5-L5 | Rule/rune effects need qualified mastery, carrier, stock and fuel. | H, STATED R9-R10 [0246/0256/0221/0360/0396/0408] | Convert compatible carriers or suppress unsupported rune execution; fragments can still have sourced functions. |
| TT5-L6 | Fusion commitment and mutation have their own costs and irreversible effects. | H, STATED R6 [0083/0176/0195] | Foreign fusion follows its own process; this is not a global fusion danger tax. |
| TT5-L7 | Admission procedures and liability govern inspectors' decisions. | S, INFERRED from inspection scenes [0001/0037/0038] | Allow foreign detectors with attention; keep who is accountable for a false result. |

**K3:** resource/growth/expression/limit = electrical charge, body support
and actual rule fuel / searched information, embodied practice, rank and
infrastructure / equipped skills, tools, fragments and rule states / cooperation,
substrate, slots and source conditions. Idle: socket charging, trained drills,
powered infrastructure and routine paperwork; fresh applicant judgments and
fusion default to deliberate commitments. Native routes: cooperative search,
teaching/embodiment, specimen study and qualified rune work. Rank raises capacity
and predator attention (R12 [0137/0221/0415]); office remains another fact.
Personal generator follows supported fusion inputs and resulting provenance.
Shortcuts: coerced compliance, hazardous information, mutations and risky
infection-source gifts; R8's removal claim remains a character claim. Daily
inspection, repair, power generation and medical/provisioning work. E2-E6/E8,
ABILITY_AUTHORING copy/body/material routes; missing collector/cooperation,
substrate loss, mastery-slot release and law-state consumers.

**K10:** INFERRED grammar = diagnosis, isolation, retreat and selective force.
Threats: unknown infections, known infected entrants, predatory creatures,
hostile scavengers and stronger-aura hunters. Defeat can mean quarantine,
injury, liability, relocation or a real source debt. Interview, retest,
quarantine, negotiate and defer admission are outs. Default staffed gate is
safer than outside ruins; dial staffing and known-source catalogue by era.
Green/no match is not evidence of absence of unknown infection (tool table [0038]).

**More:** K2.7 TT5 put medical false positives beside unknown-source false
negatives. K3.9 TT5 infrastructure can increase personal power without killing.
K10.6 TT5 stronger aura changes threat selection rather than spawning a
level-scaled enemy beside every upgrade.

## ML: Mother of Learning

**Floor today:** K2 partial and unusually concrete (brief source-law table);
K3 partial with a bounded device/control core; K10 partial with a sourced-context,
original nonlethal hatch retrieval. Wider native mage learning is missing.
Floor proposal: use the actual nonmage visitor/device slice as one option;
a later eligible mage start gets its own source and compatibility decision.

| Code | K2 engine fact | Type/evidence | What it does to imports |
|---|---|---|---|
| ML-L1 | Personal mana, environmental source and ward/device fuel are distinct. | H, SHOWN/STATED MOL-C001-06/07/10 | Imported reserves do not silently become attuned personal mana. |
| ML-L2 | Invocation knowledge is not shaping/control or unlimited output. | H, SHOWN/STATED MOL-C002-05/08 | Allow remembered methods, require operative body/source and trained control. |
| ML-L3 | Dispel does not extinguish ordinary fuel still burning. | H, SHOWN MOL-C002-06/07 | Foreign suppression affects the named supernatural process; mundane aftermath remains. |
| ML-L4 | Formula support and a functional reconstruction differ from copied symbols. | H, SHOWN MOL-C011-06/07/08 | Foreign printing can create a pattern, not its anchoring spell or operator qualification. |
| ML-L5 | Household/academy rights and helper consent are specific. | S, STATED brief Ilsa/Taiven/Kael source rows | Allow useful imports with attention; strength does not grant admission, stock or a helper's agreement. |
| ML-L6 | Observation and theories do not grant an operative temporal mechanism. | H, INFERRED evidence rule from MOL-PS036/PSE records | Foreign time powers need their own carrier/authorization; no automatic loop for visitors. |

**K3.1:** actual branch resource = specialist-supplied device charge,
operator control and real stock; growth = learned calibration/mastery;
expression = keyed lamp/occlusion and useful material tests; limit = local
device scope and finite paid support. Wider native proposal: personal mana,
shaping and prepared formulas, with body capacity separate from control.
**K3.2:** safe drills, formula study, craft queues and supported recovery can
grow relevant facets in a future routine adapter. Current source explicitly
rejects automatic Cyoria programs, player personal mana and absence refill:
`src/book_world_mol_state.js:39`, `:43`, `:45`. The visitor is not evidence that
native mages cannot train idle.

**K3.3-.8:** academy/mentor, formula text plus experiments, and craft practice.
Student rights and professional reputation are social, no universal mage XP
rank. Personal spells grow from tested target/formula/control changes, not
an inherited protagonist package. Shortcuts: risky shaping, improper devices
and unsafe source experiments; temporal work requires its own qualified route.
Daily light, household work, medicine and material research. ABILITY_AUTHORING
device/learned routes and E2-E6; actual narrow content
`src/book_world_mol_content.js:22`, `:40`, `:45`; missing native-mage physiology
and general spell/ward experimentation adapters.

**K10:** actual bounded alternatives include prepared light, a tether, Taiven's
own paid means, bargain or retreat (`src/book_world_mol_actions.js:58`, `:63`,
`:97`). INFERRED wider feel = preparation, wards, spatial/mental control and
countermeasure investigation. Threats: sewer creatures, local blockers, unsafe
experiments, hostile mages and invasion-era actors. Defeat: paid injury, lost
objective, capture or extraction; reset only when a real temporal contract
supports it. Default academy/household routes are safer than deeper sewers or
the invasion window; dial supervision and ward coverage, not free invulnerability.

**More:** K2.7 ML distinguish dispelling a spell from clearing smoke or heat.
K3.9 ML native mana capacity and mastery can diverge sharply. K10.6 ML treat
enemy wards as specific protections with discoverable tests, not a generic
magic-resistance stat.

## LM: Lord of the Mysteries

**Floor today:** K2/K3/K10 partial in qualified reading/design; a full native
pathway core and threat/recovery consumer are missing. Proposed floor: one
Tingen cover career, one qualified low-Sequence source, 3-6 powers/rituals,
acting evidence and a recoverable investigation. Keep sequel institutions out
of this opening era.

| Code | K2 engine fact | Type/evidence | What it does to imports |
|---|---|---|---|
| LM-L1 | Potion source, formula/ingredient access and practical learning differ. | H, SHOWN/STATED LM r002 C02-C05; r004 C07-C19 | Foreign study does not supply a characteristic or automatically digest it. |
| LM-L2 | Digestion/acting is distinct from mere power mastery. | H, STATED r003 C23; r010 C21-C22 | Imported practice can train execution; acting credit requires applicable role evidence. |
| LM-L3 | Incompatible or premature ingestion and dangerous exposure are separate loss-of-control causes. | H, STATED r003 C12-C14 | Allow foreign sources under compatibility checks; do not invent mandatory corruption for all outsiders. |
| LM-L4 | Spiritual perception/divination can be partial, interpreted or interfered with. | H, SHOWN r005 C11-C12; r006 C01; r011 C15-C18 | Foreign appraisal states what it reads; a reading is not universal truth or source immunity. |
| LM-L5 | Characteristic custody, artifact grade and church authorization are not one rank. | S for custody policy, STATED r003 C17/C24 and r011 C04-C05 | Allow foreign artifacts with attention and specific custody response, not an automatic native artifact grade. |
| LM-L6 | Ritual target, preparation, proximity and payer constrain the actual operation. | H, SHOWN r010 C01-C03 | Foreign fuel may help only under a supported ritual adapter; no free recipient authority. |

**K3:** resource/growth/expression/limit = spirituality, ingredients and actual
source / digestion, pathway advancement and trained control / perception,
rituals, charms and pathway functions / compatibility, source, scope and mental
stability. Idle: role-fitting paid work, meditation, study and slow natural
digestion as separately priced processes. Default qualifying queued acting
can progress; dial effectiveness by role/feedback, because empty repetition
need not teach acting. Part 09 LM4 proposes presence-only digestion, while
PROJECT's standing idle direction and the live wiki allow broader processes.
Neither that older proposal nor the wiki selects exact rates.

Native routes: institutions, formula/material exchanges, guided training and
actual potion acquisition. Sequence is structural; local clearance and cover
reputation are social. Personal technique = authored ritual adaptations or
applications within a qualified pathway, not free invention of a new pathway.
Shortcuts: premature ingestion, unsafe reading, poorly identified petitions.
Daily divination service, medicine, sleep aid and protective craft remain
specific source functions. ABILITY_AUTHORING consumed-source/ritual lanes,
E2-E6; missing digestion/acting, mental stability, characteristic custody and
ritual recipient semantics.

**K10:** INFERRED grammar = investigate, gather support, counter the mechanism,
then act under limited knowledge. Threats: dangerous artifacts, unstable
Beyonders, hostile cult actors, spiritual contamination and ordinary armed
people. Defeat can mean capture, injury, source damage, compromised cover or
costly rescue; mental recovery is not generic HP healing. Leave, arrange a
church response, pay/settle a genuine grievance, negotiate or contain. Default
staffed Tingen is safer than unexamined ritual sites; later war/sea/cosmic eras
need different rosters and scope, not early enemies inflated by player rank.

**More:** K2.7 LM distinguish conservation/custody leads from a fully verified
universal characteristic rule. K3.9 LM acting progress and acting too deeply
can coexist. K10.6 LM firearms stay meaningful where the source shows them;
Sequence alone is not bullet immunity.

## CI: Circle of Inevitability

**Floor today:** K2/K3/K10 partial in consolidated qualified reading; no native
boon/potion combat core found in inspected owners. Floor proposal: Trier job
week, one low-Sequence route, one properly witnessed contract or ritual and
one recoverable local danger. A boon start is an additional distinct source,
not a renamed potion start.

| Code | K2 engine fact | Type/evidence | What it does to imports |
|---|---|---|---|
| CI-L1 | Potions and bestowed boons have different acquisition and burdens. | H, STATED CI §1/2 r003-c36-03/r004-c01 | Imported granted power does not become a locally acquired characteristic. |
| CI-L2 | Acting digests a source; repeated fitting acts/feedback may help. | H, STATED r003-c29-03; INFERRED actor model r017-c29 | Foreign job routines qualify only where their actual actions fit the source. |
| CI-L3 | Characteristic conservation/convergence and storage behavior are reported local laws. | H candidate, STATED r003-c29-01/r008-c15; r028-c15 is actor inference | Foreign matter/source is not automatically a characteristic; no source duplication by copying the record. |
| CI-L4 | Contractee core, witness/consent and creature-specific price matter. | H, STATED/SHOWN §3 r023-c54/r023-c55/r024-c04-c07 | A foreign copy can record a method without moving the bonded core or its pact. |
| CI-L5 | Summoning descriptors, material, date and ritual target affect response. | H, STATED/SHOWN §4 r004-c20-c22/r011-c33/r014-c11 | Allow foreign translation/tools where supported; an approximate address may return a different matching responder. |
| CI-L6 | Night work, gang duties and official jurisdiction alter access and enforcement. | S, INFERRED from part 09 QCI/packet E3 | Allow imports with attention; faction membership is not a boon transfer. |

**K3:** resource/growth/expression/limit = spirituality, characteristic or
bestowed source, pact materials / digestion, practice, rites or bestowal /
pathway techniques, dances and spirit contracts / overload, body fit, recipient
and exact pact price. Idle: fitting paid routines, controlled dance practice,
ritual prep, study and supported digestion. Boon digestion is not categorically
excluded (live Acting Method check); exact personal rates remain unknown.
Teacher, potion trade, bestowal and witnessed creature pacts are native routes.
Rank/Sequence, gang standing and service reputation differ. Personal forms
use per-actor acting principles and compatible contracted effects, never an
arbitrary list of free powers. Risky shortcuts: multiple boons, unverified
responders and raw characteristics; numerical danger statements in CI stay
attributed. Daily messages, concealment, performance, protection and useful
spirit work. E2-E6; ABILITY_AUTHORING borrowed/consumed/contract lanes; missing
patron relation, boon burden and particular pact consumers.

**K10:** INFERRED grammar = urban ambush, preparation, conditions and spirit
contacts with real collateral. Threats: gang enforcers, hostile Beyonders,
unsafe ritual responders, corrupting objects and local occult incidents.
Defeat: lost lodging/work, injury, capture, pact debt or escape with exposure.
Talk through an intermediary, refuse a pact, relocate, hire support or contain.
Default staffed work district differs from night alleys, occult sites and
later crisis/dream-era spaces. Dial policing and ritual access by actual era;
no universal rule that a dream is safe or its end is waking reality.

**More:** K2.7 CI preserve the indexed low-Sequence neighboring-path switch
claim alongside older LM threshold summaries; qualify by pathway and passage,
do not choose a universal cutoff. K3.9 CI distinguish patron imprint from the
actor's own desires. K10.6 CI a rejected creature price leaves that exact
ability unavailable without forcing the whole career to end.

## SS: Shadow Slave

**Floor today:** K2/K3/K10 partial in early-source packets and later qualified
index; no complete native Aspect/Flaw combat consumer. Floor proposal: early
Academy recovery, a generated local build explicitly marked INFERRED, one
utility Memory and a guarded survival route. Later intrinsic/Spell separation
does not retroactively give every early entrant late abilities.

| Code | K2 engine fact | Type/evidence | What it does to imports |
|---|---|---|---|
| SS-L1 | Aspect and Flaw are coupled native faculties, not a purchased voluntary vow. | H, STATED DSS1 plus live Aspect check | Foreign powers do not automatically gain a random Flaw; native acquisition follows its own route. |
| SS-L2 | Rank, class/core count, Aspect grade and learned mastery are different axes. | H candidate, STATED digest earlier mapping; exact roster still a source gate | Foreign rank is not converted by number; compare actual functions. |
| SS-L3 | Intrinsic faculties can remain when particular external Spell services fail. | H, SHOWN OE14 1582:p1-69 | Suppress a service separately from source ownership; no automatic destruction of held powers/items. |
| SS-L4 | Multiple manifested bodies share soul/mind/essence and mental burden in the observed case. | H, SHOWN OE15/16 1583-84 | Foreign cloning retains its own budget; do not duplicate a held Memory across avatars. |
| SS-L5 | Realm travel and Memory carriage need a particular source/carrier contract. | H candidate, STATED transit1586-87 and QSS packet, full rule unresolved | Allow/convert only supported carriage; no automatic pocket-item equivalence on realm change. |
| SS-L6 | Flaw disclosure, clan status and expedition access affect trust and opportunity. | S, INFERRED QSS early Academy slice | Allow foreigners with attention; their private faculty details are not public metadata. |

**K3:** resource/growth/expression/limit = soul essence and distinct growth
fragments, body and Memories / qualified rank/core/legacy development plus
technique practice / personal Aspect and tools / Flaw, stage, source and actual
essence access. Dormant/early builds need source-qualified fuel access before
E2 applies; the live Aspect page places deliberate essence control after
Awakened rank. Idle: safe physical drills, observation and supported rest;
an ordeal or hunting reward needs an actual event. Default guarded routines,
dial riskier expeditions because patrol/support changes safety.

Native routes: Academy, clan mentors, actual ordeals and Aspect-specific
legacy learning. Public Awakened roles and clan privilege are social; hidden
Aspect grade is not everybody's knowledge. Personal generator defaults to
authored coherent Aspect/Flaw pairs with utility/combat modes, and separate
legacy gates. Risky shortcuts: uncontrolled ability use, unguided travel and
disclosing exploitable information. Daily scouting, light, carrying, craft and
guard work. ABILITY_AUTHORING personal-source/tool/shared-body lanes, E2-E6/E8;
missing native rank/core/legacy, Flaw semantics and Memory lifecycle.

**K10:** INFERRED feel = survival, route planning, stealth, terrain and cohort
coordination. Threats: Nightmare creatures, environmental hazards, hostile
Awakened, soul attacks and expedition logistics. Defeat: supported rescue,
lost route/gear, lasting injury or retreat; real body loss remains possible,
not a guaranteed free wake-up. Hide, bargain with people, detour, evacuate,
wait for protection. Default Academy differs from isolated Dream Realm sites
and Antarctic evacuation; dial escorted versus unsupported exposure by era.

**More:** K2.7 SS early rule bindings cannot rely on later exceptional carriers.
K3.9 SS utility Aspects get a livelihood loop without invented combat parity.
K10.6 SS refuge capacity and evacuation timing can decide success before any
enemy is struck.

## RP: Reincarnation Paradise

**Floor today:** K2 partial (source-qualified entry and mission terms); K3
partial (retained learning/rigging/control, not a full contractor core); K10
partial (bounded original opposed rescue). Floor proposal: existing first-Goa
mission plus hub service/repair and meaningful return, keeping source/native
gameplay proof separate. Full contractor progression is a later source-bound
consumer, not awarded by the portal.

| Code | K2 engine fact | Type/evidence | What it does to imports |
|---|---|---|---|
| RP-L1 | Issuer, local world, traveler body and mission terms are separate owners. | H, INFERRED bounded adaptation in RP brief | Imported power needs actual retained body/source; entering does not copy Su Xiao. |
| RP-L2 | Extraction/settlement does not erase the destination's civil aftermath. | H, INFERRED retained-world contract in brief | Allow retained imports on declared revisit; no reward-reset from leaving. |
| RP-L3 | Local instruction/control requires the learner's real means. | H, SHOWN qualified sid20 context; exact rigging costs INFERRED | Foreign knowledge can aid execution only with body/tool/support. |
| RP-L4 | Mission failure, bodily death, departure and prestige differ. | H, INFERRED adaptation; exact novel penalties unresolved | Foreign revival does not automatically settle an issuer's failed objective. |
| RP-L5 | Refusal creates no accepted optional debt; hidden optional objectives do not rewrite accepted terms. | H, INFERRED current optional-entry contract | Allow power without invented compulsory enrollment. Canon coercive starts need another profile. |
| RP-L6 | Local people and issuers can judge the same act differently. | S, INFERRED from Goa/hub context | Allow imports with attention and separate institutional receipts. |
| RP-L7 | Origin return can retain attributes/passives while blocking most acquired actives/items. | H, STATED canon priority plan F08, opening ch29-32 and sid213 p13-18/57-63 | Suppress named functions without deleting ownership; living companion/storage exceptions are particular cases. |
| RP-L8 | Extraction initiation, interference, repair and arrival are separate states. | H, SHOWN F05, sid23 p35-39/50-74 | Foreign escape powers may offer another supported route; one Paradise repair does not guarantee every extraction. |
| RP-L9 | Mission sanctions differ by notice/edition; failure does not have one universal consequence. | H for named sanction, STATED F07 Chinese opening notice versus MTL and later war notices | Foreign revival addresses its actual life carrier, not an issuer's sanctions or status automatically. |

**K3:** actual slice resource/growth/expression/limit = body effort, tools,
paid instruction and real stock / line learning/control/mastery / rigging,
protection and rescue / support, time and geometry. Wider proposal separates
contractor enhancements, learned skills, gear and currencies. The qualified
priority plan F17-F22 distinguishes access level/tier from attributes, purchased
faculty from mastery, and Soul Crystals from currencies/World Source. Leveling
itself does not grant attributes (F17, sid3984 p22). Soul Eater is Su Xiao's
particular faculty, not a starter grant (F19, opening ch3). Exact stage costs,
rates and awakening consumers remain open. Idle: safe practice, repair and paid hub work; mission
combat and enhancement purchases need qualified consumers. Routes: teacher,
workshop, mission-earned acquisition, supported enhancement. Contractor rank,
local status and civilian trust differ. Personal techniques combine acquired
skills/tool functions with retained method provenance. Shortcuts: overcommitting
to a mission, unsafe upgrades and buying poorly understood gear, costs still
source-gated. Daily repair, logistics, brokerage and training. ABILITY_AUTHORING
tool/investment/hybrid lanes, E3/E4/E6/E8; missing full enhancement/loot source
rules. Bounded depth controller seam `src/book_world_paradise_campaign_runtime.js:8`
does not implement the novel's whole system.

**K10:** actual short rescue is opposed and time-bound; wider INFERRED grammar
= mission tactics, finite preparation, asymmetric objectives and extraction.
Threats: local guards/raiders, fire/smoke, rival contractors where qualified,
mission-specific enemies and missed extraction. Defeat: injury, lost cargo,
retreat, failed settlement or rescue with lasting local losses. Negotiate,
hide, evacuate, hire, divert danger or withdraw. Default hub work is calmer
than first-Goa fire/royal aftermath; later mission danger is contract/era-specific.
No universal safe hub or guaranteed contractor resurrection is certified here.

**More:** K2.7 RP preserve sid20 versus sid26-28 placement as an explicit
adaptation difference. K3.9 RP hub livelihood can fund power without being
combat loot. K10.6 RP an extraction victory can leave a local objective failed;
show both receipts.

## JJ: Jujutsu Kaisen

**Floor today:** K2/K3 partial in revised secondary ledger and variants; K10
partial as encounter design, no faithful native technique/domain combat.
Proposed floor: one trained control route, one qualified innate technique
with 3-6 applications, a curtain/investigation and a retreatable exorcism.

| Code | K2 engine fact | Type/evidence | What it does to imports |
|---|---|---|---|
| JJ-L1 | Negative emotion is a native CE source; reserve, output, control and leakage differ. | H, STATED ledger Cursed Energy r79259, Description/Manipulation | Foreign energy may remain foreign; conversion is not automatic CE generation. |
| JJ-L2 | Innate technique availability differs from shared learned control/barrier craft. | H, STATED ledger Cursed Technique r79254, Innate/Non-Innate Techniques | Foreign imitation needs its actual mechanism; teaching gestures does not engrave an innate source. |
| JJ-L3 | Self-vow benefit loss and mutual-vow consequences are not one predictable sanction. | H, STATED DJ1 | Imported bargains keep their enforcement; no universal death or random-penalty table. |
| JJ-L4 | Domains differ by lethal, nonlethal and open forms; sure-hit behavior is specific. | H, STATED ledger contradiction rows | Foreign barriers interact through actual target/geometry rules, not a highest-level-domain comparator. |
| JJ-L5 | Involuntary Heavenly Restriction and voluntary vow have different causes. | H, STATED JJ reviewed-law/variant distinctions | No foreign bodily drawback is priced automatically as a chosen vow. |
| JJ-L6 | Grade, orders and exorcism authority are institutional judgments. | S, INFERRED from campaign | Allow foreign outliers with attention; measured CE is not automatic promotion. |

**K3:** resource/growth/expression/limit = CE with output/efficiency/body
distinct / control, extension and barrier practice / reinforcement, innate
technique and barrier applications / source availability, trigger, body and
technique-specific conditions. Idle: safe control drills, study and supervised
barrier practice; domain refinement and dangerous experiments need observed
tests. Negative-emotion origin does not establish a numerical mood-to-capacity
formula or XP for distress. Teacher, inherited instruction
and tested personal extensions are native routes. Grade is social. Personal
generator begins with authored innate functions, then paid extension tests.
Shortcuts: exact vows, reckless output or overuse; unknown price stays unknown.
Daily shielding, transport/help, sensing and medical support only where the
selected technique actually supports it. Local ABILITY_VARIANTS plus E2-E6/E7;
missing engraving, barriers, domain/anti-domain and CE-target semantics.

**K10:** INFERRED grammar = reconnaissance, conditions, disclosure, sudden
tempo shifts and domains. Threats: curses, curse users, dangerous objects,
barrier traps and hostile institutions. Defeat: evacuation, capture, injury,
lost technique access or a failed protection objective; healing needs a real
qualified method. Nonviolent outs: evacuate, lift a specific condition, refuse
engagement, negotiate with people and coordinate concealment. Default supervised
training differs from curse sites, Shibuya and Culling Game windows; dial actual
barrier access and response staffing, not adaptive enemy inflation.

**More:** K2.7 JJ distinguish condition failure from broken vow. K3.9 JJ an
extension changes function rather than unlocking another unrelated innate
technique. K10.6 JJ a civilian evacuation can be the encounter win condition
even if the curse remains.

## BL: Bleach

**Floor today:** K2/K3 partial with official bounded anchors and variants;
K10 partial in campaign proposals without native soul-contact combat. Floor:
one spiritual support/training route, one personal release or Kidō toolkit,
and a recoverable patrol with a defined soul/body damage contract.

| Code | K2 engine fact | Type/evidence | What it does to imports |
|---|---|---|---|
| BL-L1 | Perceiving a spirit and transferring a faculty are different functions. | H, STATED B10/B11 | Foreign sight may detect without being able to strike; contact needs its own supported means. |
| BL-L2 | Shikai/Bankai depend on particular personal dialogue/manifestation relations. | H, STATED B5 official glossary | Foreign blade ownership/shape does not create the owner's soul-bound release. |
| BL-L3 | Damaged Shikai and destroyed Bankai have different recovery behavior, with exceptions unresolved. | H, STATED B6 | Ordinary imported repair can fix a carrier without restoring the release source. |
| BL-L4 | Shinigami, Quincy, Arrancar and Fullbring routes are not interchangeable ladders. | H, STATED B7/B11/B12/B14 | Convert only a supported compatible source; faction change alone grants no faculty. |
| BL-L5 | Captain office does not imply exclusive Bankai ownership. | S, STATED B2 Renji/Ikkaku examples | Imported power can draw recruitment/attention without becoming an officer. |
| BL-L6 | Medical role, instructors and affiliations are era-dependent. | S, STATED B3/B8 | Allow foreign care under actual target rules; unavailable canon providers cannot be summoned by a menu. |

**K3:** resource/growth/expression/limit = spiritual means and actual bonded
source / trained control and personal development / sword, movement, unarmed,
Kidō or qualified release / source relation, target, reserve and form-specific
rules. Idle: safe training, attunement and taught Kidō practice; manifestation,
new release or difficult trials need an actual event. Academy/mentor, partner
dialogue and qualified separate-faction routes. Office and release strength
are different. Personal generation authors a soul-partner function with forms
and modes, retaining source identity. Risky shortcuts: forced/unstable training,
serious source damage and exact exceptional methods. Daily healing, patrol,
communication and transport functions need specific technique support. Local
variants plus E2-E6/E7; missing spirit target/contact, bond/release and damage
restoration adapters.

**K10:** INFERRED feel = fast movement, perception, reach, pressure and changing
release functions. Threats: Hollows, hostile spiritual actors, contested patrol
areas, spirit hazards and damaged sources. Defeat: extraction, injury, broken
release, capture or retreat; soul loss is not fixed by positive HP. Talk,
protect civilians, conceal presence, leave or seek neutral aid. Default training
grounds differ from Hueco Mundo/war-front eras; dial patrol/instructor availability
and actor-specific perception. Spiritual strength can be genuinely decisive
where sourced, without asserting universal cancellation of every ability.

**More:** K2.7 BL repair carriers and repair sources as separate transactions.
K3.9 BL a mature release continues gaining mastery without becoming a new
uniform rank. K10.6 BL retreat records where the spiritual body and physical
carrier actually ended.

## FT: Fate

**Floor today:** K2 partial through DF1-DF3; K3 partial as support/authority
analysis, missing selected magecraft core; K10 missing a coherent native ritual
war loop. Floor proposal: one Fuyuki-qualified ritual profile, a particular
Master/Servant contract, small enabled kit, supply and retreat/sanctuary terms.

| Code | K2 engine fact | Type/evidence | What it does to imports |
|---|---|---|---|
| FT-L1 | Heroic record, summoned instance and class-enabled kit differ. | H, STATED DF2 | Foreign summons carry an actual instance/kit; source knowledge does not grant every legend function. |
| FT-L2 | Command authority has a bodily carrier and finite profile-specific charges. | H, STATED DF1 | Imported orders do not gain Command Spell authority; selected Fuyuki starts use their sourced allotment. |
| FT-L3 | Specificity, energy and agreement affect a command's success. | H, STATED DF1 | A foreign domination power follows its own mechanics; no universal success from the word command. |
| FT-L4 | Delivery of an order can be interrupted. | H, STATED DF3 | Foreign silent/remote delivery works only if its source actually supplies it. |
| FT-L5 | Exhausted compulsion and ended relationship are different states. | H, STATED DF3 | Preserve actual loyalty/contract history rather than deleting a summoned actor at zero charges. |
| FT-L6 | Ritual secrecy, supervision and sanctuary have selected-profile terms. | S, INFERRED floor; exact route rules unresolved | Allow foreign powers with attention; no merged franchise-wide enforcement. |

**K3:** resource/growth/expression/limit = actual magical supply and separate
command authority / magecraft study, control and partner coordination / selected
spells and vessel-enabled heroic functions / source, container, upkeep and
effect-specific conditions. Idle: bounded supply recovery, workshop prep,
ritual study and planned training; no free repeated summoning reward. Native
routes: family/mentor method, actual rituals and partner collaboration. Master,
class and parameter labels are not one level. Personal magecraft uses authored
specialization; Noble Phantasm generation follows a sourced legend/container
card, not random stat affixes. Shortcuts: unsafe circuits/supply or coercive
orders, with exact damage/price still a source gate. Daily craft, wards,
familiar scouting and domestic uses where supported. ABILITY_AUTHORING
summon/authority/learned lanes, E2/E3/E5/E6; missing circuits, supply link,
vessel kit and legend-target mechanics.

**K10:** INFERRED grammar = concealed identity, scouting, partner tactics,
conditional advantages and decisive reveals. Threats: hostile pairs, ritual
hazards, supply starvation, local actors and collateral exposure. Defeat:
withdrawal, negotiated safety, lost authority, wounded Master or dissolved
instance under its contract; not guaranteed resurrection of the Master.
Negotiate alliances, conceal, break contact, ask for profile-qualified sanctuary
or surrender. Default civilian/workshop life differs from active war sites;
dial route/ritual profile first, then era, because different Fate works differ.

**More:** K2.7 FT a vessel subset is not the whole heroic record. K3.9 FT
upkeep and authority remain distinct even when both pay for the same order.
K10.6 FT revealing identity can expose a specific counter without making all
opponents omniscient.

## HX: Hunter x Hunter

**Floor today:** K2 partial in DX1-DX3; K3 partial as a personal-condition
analysis; K10 missing a native Nen encounter. Floor proposal: source-qualified
basic training, one authored personal ability, 3-6 useful modes and an encounter
whose activation conditions can be discovered or avoided.

| Code | K2 engine fact | Type/evidence | What it does to imports |
|---|---|---|---|
| HX-L1 | Activation conditions and breakable vows differ. | H, STATED DX2 | Foreign failed activation does not incur an invented local vow penalty. |
| HX-L2 | A copied/stolen ability can retain its creator's eligible-target meaning. | H, STATED DX1 | Imported copying must preserve semantic provenance if that mechanism requires it. |
| HX-L3 | Requirements can have explicit substitutes and ongoing checks. | H, STATED DX3 | A foreign photograph/sensor satisfies only the named substitute, not every contact condition. |
| HX-L4 | Aura, affinity and trained execution need distinct source bindings. | H, INFERRED floor; broad affinity wheel is an unchecked digest lead | Do not convert foreign reserves into aura or assign Specialist from rarity alone. |
| HX-L5 | Hunter license, personal competence and Nen mastery are different facts. | S, INFERRED floor; primary institutional locator open | Allow powerful outsiders with attention, not automatic license privileges. |
| HX-L6 | Nen secrecy and local enforcement depend on witnesses and institution. | S, INFERRED local slice | Foreign visible effects can reveal an outlier without teaching observers the technique's truth. |

**K3:** resource/growth/expression/limit = source-qualified aura and body effort
/ trained control and personal design / supported basic use and authored ability
/ affinity, method and exact conditions. Idle: safe control and stamina drills,
study and prototype preparation; forced awakening and dangerous vows default
to deliberate trials. Mentor, observation/testing and personal craft are routes;
precise native fundamentals need primary passages before coding. License/arena
standing is social. Personal generator composes target, operation, delivery,
condition, persistence and real cost; a condition is not automatically a vow.
Shortcuts include unsafe awakening and actual high-stake vows, without a universal
linear risk multiplier. Daily craft, medicine, scouting and trades use abilities
that support them. ABILITY_AUTHORING design/conditions/copy lanes, E2-E6/E7;
missing aura fundamentals, affinity constraints and creator-semantic predicates.

**K10:** INFERRED grammar = hidden information, setup, reading conditions,
resource allocation and decisive traps. Threats: trained users, criminals,
dangerous creatures, ability traps and expedition environments. Defeat: debt,
capture, injury, temporary source loss or retreat; vow consequences affect the
declared powers. Talk, hide, deny a trigger, escape range or negotiate a release.
Default supervised training differs from criminal districts and later expedition
eras. Dial information quality and support by place; danger is not just aura total.

**More:** K2.7 HX distinguish caster belief from a preserved creator predicate.
K3.9 HX personal design can be utility-first. K10.6 HX a failed activation can
still reveal information and change the opponent's next action.

## FM: Fullmetal Alchemist

**Floor today:** K2/K3 partial with revision-backed variants; K10 partial in
campaign design, no native transmutation combat core. Floor proposal: one
manga/2009-qualified material craft toolkit, a repair livelihood and a
recoverable rescue against ordinary force plus a specific alchemical hazard.

| Code | K2 engine fact | Type/evidence | What it does to imports |
|---|---|---|---|
| FM-L1 | Ordinary transmutation needs composition knowledge, material and valid method. | H, STATED variants Alchemy r78024 | Foreign creation remains its own power; using native alchemy requires native prerequisites. |
| FM-L2 | Arrays, triggers and supported stages are specific; decomposition is not complete reconstruction. | H, STATED Scar r77728/Roy r77805 | Foreign drawing/contact can supply a medium only where actual method permits. |
| FM-L3 | Circle-free use is source-qualified, not ordinary instruction. | H, STATED Gate r72998/Edward r78039 | Imported knowledge does not award that faculty; genuine alternative source can have its own method. |
| FM-L4 | A Philosopher's Stone spends stored souls; apparent exemption changes the payer. | H, STATED DM1/r78123 | Preserve foreign payer/accounting. No free universal transmutation from holding a red item. |
| FM-L5 | Body recovery, soul anchor and prosthetic support are separate operations. | H, STATED Alphonse r77623/Automail r77396 | Imported healing declares which target/domain it restores; no generic HP-to-limb/soul conversion. |
| FM-L6 | State certification confers office and duties, not a new physical law. | S, INFERRED institutional floor | Allow imported craft with attention; strength does not confer military authority. |

**K3:** resource/growth/expression/limit = material, operative energy source,
method and possible stored payer / study, composition/control and specialization
/ transmutation, qualified alkahestry and engineered support / stock, trigger,
target, continuity and actual source. Idle: composition study, safe arrays,
repair work and material preparation; taboo experiments need specific
commitments. Teacher, research texts, apprenticeship and qualified distinct
alkahestry training. Rank is certification/military office. Personal generator
authors supported transformation recipes and trigger/tool choices, not a
universal element birth class. Shortcuts: forbidden experiments, unknown stones
and poorly understood inputs. Daily construction, mending, medicines and automail
service. Local variants, E1-E6; missing material transformations, energy network,
stored-soul payer, Gate/bond and prosthetic state consumers.

**K10:** INFERRED feel = terrain reshaping, contact, ignition, material knowledge
and direct bodily combat. Threats: armed soldiers, hostile specialists,
continuity-specific artificial beings, unstable experiments and infrastructure
hazards. Defeat: injury, damaged prosthesis, capture, failed rescue or loss of
material; bodily tolls do not vanish with rest. Negotiate, cut off an actual
trigger, reroute a hazard, flee or bring evidence to a willing authority.
Default workshop/town streets differ from military campaigns and contested
alchemy infrastructure; dial continuity and era before selecting special counters.

**More:** K2.7 FM preserve manga/2009 versus 2003 energy/being differences.
K3.9 FM recipe invention changes supported transformations, not universal matter
permissions. K10.6 FM distinguish stopping ignition from dispersing a flame
already fueled by the environment.

## NR: Naruto

**Floor today:** K2/K3 partial with bounded official anchors; K10 partial in
rescue/control design, native jutsu combat missing. Proposed floor: one trained
control/body route, 3-6 qualified techniques and a rescue with physical,
puppet/support and retreat alternatives, preserving original 1-72 baseline.

| Code | K2 engine fact | Type/evidence | What it does to imports |
|---|---|---|---|
| NR-L1 | Shape/rotation, output and control are distinct training results. | H, STATED N1/N15 original ch150-155/321/339 locators | Foreign reserve or memorized gesture does not complete the other facets. |
| NR-L2 | Nature training and actual inherited/body source are separate. | H, STATED N2/N5; full exclusions NU1/NU2 open | Allow foreign methods where supported; no generic two-element fusion into bloodline. |
| NR-L3 | Observing/copying movement does not supply trained body speed or condition. | H, STATED N11/N5 and variants | Retain copied method, require actual body; a foreign source that supplies speed can genuinely surpass ordinary practice. |
| NR-L4 | Puppets, living core and preserved techniques differ from ordinary craft ownership. | H, STATED N7; exact source retention NU3 open | Imported carpentry may build a carrier, not a donor faculty or living core. |
| NR-L5 | Exceptional sealing costs and targets belong to the selected method. | H, STATED N8 ch500-504; NU8 teaching gap retained | Copying ink does not copy the payer, creature relation or exceptional seal. |
| NR-L6 | Village rank/assignment and medical competence are institutional/trained facts. | S, STATED N6/N9 plus INFERRED rank policy | Allow imported talent with attention; promotion and mission clearance need local recognition. |

**K3:** resource/growth/expression/limit = source-qualified chakra and body
effort / control, nature/shape and conditioning / jutsu, enhanced strikes,
puppetry, medicine and seals / source, actual body, learned method and target.
Full chakra physiology remains NU1, so E2 is a future mapping. Idle: tree-climbing
control drills (N14), safe conditioning, known sequences and medical study;
dangerous Gates/new seals need explicit trials. Academy/mentor, clan teaching,
observed qualified reconstruction and specialist apprenticeship are native
routes. Genin/chunin/jonin and clan regard are social, not a universal stat cap.
Personal generation refines supported shape/nature/control or tool functions;
no generated free bloodline. Shortcuts: exact Gates, dangerous overuse and
unsupported implants, with source-specific cost. Daily crop/water handling
proposals, courier work, medical support and repair need actual techniques.
Local variants and E2-E7; missing physiology, eye source/retention, puppet
contact/channel, medical/seal and native jutsu combat adapters.

**K10:** INFERRED grammar = deception, substitutions, positioning, preparation,
team roles and body limits. Threats: rival shinobi, bandits, traps, poisoned
weapons, war-era forces and qualified large-scale beings. Defeat: injury,
capture, failed mission, paid rescue or retreat, with real source loss where
sourced. Negotiate, conceal, decoy, evacuate or break pursuit. Default village
training differs from exam sites and wartime borders; dial era, mission brief
and team support rather than assigning every opponent a player-scaled rank.

**More:** K2.7 NR keep NU7's suspect Rin captor attribution quarantined.
K3.9 NR clone-assisted knowledge gain needs actual chakra/body fatigue
accounting, not free multiplied energy. K10.6 NR a rescued patient can still
need treatment after a successful retrieval.

## SL: A Soldier's Life, documentation only while runtime is paused

**Floor today:** K2/K3/K10 partial in W1-SRC/private pack/depth records. No
new pack audit or native proof here. Floor proposal for later resumption:
qualified opening military role, a supported skill/essence route and one
recoverable patrol, linked to the paused task owner rather than relaunched.

| Code | K2 engine fact | Type/evidence | What it does to imports |
|---|---|---|---|
| SL-L1 | Actual body, learned method and acquired enhancement are different carriers. | H, INFERRED floor from SL planning | Foreign enhancement needs actual support; portal entry is not a native skill grant. |
| SL-L2 | Acquired materials/essences have provenance and do not duplicate at settlement. | H, INFERRED, exact W1-SRC binding still needed | Preserve real imports/consumption; no source-backed universal essence table claimed. |
| SL-L3 | Particular spell/skill practice requires compatible faculty and instruction. | H, INFERRED floor, source locator open | Allow knowledge, suppress unsupported execution rather than erasing memory. |
| SL-L4 | Military orders, rank, duties and desertion response are social/jurisdictional. | S, STATED SL depth rows; exact passages open | Foreign power does not grant command or remove duties automatically. |
| SL-L5 | Patrol risk depends on place, unit and era, not player strength alone. | S, INFERRED scenario rule | Allow superior imports; alter witnessed institutional response rather than auto-scale every patrol. |

**K3:** INFERRED resource/growth/expression/limit = body effort and qualified
local source/material / drills, instruction and verified acquisition / martial,
craft and selected spell methods / eligibility, stock and body. Idle camp
drills/study/craft can grow suitable practice; dangerous acquisition needs an
event. Routes: unit instructor, paid specialist and qualified material route.
Rank controls duties and trust. Personal techniques refine supported methods;
risky shortcuts use exact source costs, not a generic war-world penalty. Daily
camp maintenance, logistics, medical help and trade. ABILITY_AUTHORING plus
E1-E6/E8, with actual private-pack consumers still owned by the paused lane.

**K10:** INFERRED patrol/formation/ambush grammar; threats include enemies,
beasts, terrain, bad logistics and command conflicts. Defeat can be extraction,
injury, capture or mission loss. Nonviolent outs: withdraw with orders, parley,
avoid a route or buy support. Default camp/rear differs from frontier/dungeon
and war eras; dial unit backing. **More:** K2.7 SL bind five facts to W1-SRC
passages before specs; K3.9 SL keep army rank separate from magical mastery;
K10.6 SL record who actually paid for rescue.

## OF: Original Frontier, short home-world row

| Code | Floor / proposal / more to consider |
|---|---|
| OF-K2 | Partial campaign law floor: H supported body/tool/fuel, real stock/custody, evidence-based actions and retained aftermath; S local contracts/consent, with imports allowed only on actual supported tasks. These are INFERRED original-world rules in [brief](../original-frontier/WORLD_BRIEF.md), not external canon. |
| OF-K3 | Partial: native skill practice and bounded control/craft. Resource/growth/expression/limit = effort/stock, paid practice, useful methods, real support. Idle routines fit selected skills; native teacher/field/workshop routes, social career recognition, authored refinements, paid failed trials and noncombat making/stewardship remain distinct. E3/E4/E7; full campaign acceptance stays open. |
| OF-K10 | Partial: agreed duel/objective consumers (E7), ordinary enemy zones and recovery. Proposal: physical threat, route/guard/escort objectives, retreat with actual injury/stock, negotiated exits, safer Village versus cave/forest and changed local conditions. More K10.6 OF: retain a finished noncombat career even when a field threat remains. |

Fallout: deprioritized; retain existing source/variants, no new K2/K3/K10 work selected.
Skyrim: deprioritized; retain existing source/variants, no new K2/K3/K10 work selected.
Elden Ring: deprioritized; retain existing source/variants, no new K2/K3/K10 work selected.

## Floor technique seeds and threat causes

These **INFERRED** authored floor seeds make the preceding proposals concrete.
They are functions to source and implement, not newly certified canonical spell
lists or selected player grants. Where a native-source gate fails, an ordinary
support route can remain useful. Each threat cause needs a particular source
card before implementation; ecological densities and encounter rates remain dials.

| Code | K3 expression seeds, 3-6 per proposed slice | K10 threat ecology: why these threats are there |
|---|---|---|
| HP-F | Light, cleaning, object movement, plant care, eligible repair | Unsafe study/objects cause local incidents; habitats house creatures; political enforcement and hostile actors respond to witnessed events. Source-qualified creature and faction cards decide the roster. |
| DD-F | Guidance, Cure Wounds, Mending, ordinary guard, scouting | Territory and resources motivate bandits/beasts; a selected lair sustains its faction; traps protect actual sites. Undead need an authored/source-qualified origin rather than arbitrary road spawns. |
| TT1-F | General utility cast, qualified route perception, cheaper spell mode, longer spell mode, anchor protection | Source competition and threatened identities create rivalries; ritual supply routes expose actors; lost anchors and conflicting faculties create hazards from prior choices. |
| TT2-F | Cultivation drill, supported art strike, trait-backed craft, forecast comparison, real reconstruction | Competing resources and cultivation routes generate conflict; trait scopes change matchups; divergence creates bad forecasts rather than a malicious anti-cheat enemy. |
| TT3-F | Reward redesign trial, supported native guard, scouting, ally aid, objective planning | Each challenge imports its native causal roster; win/fail predicates add civilian/faction pressures; submitted worlds retain the consequences that created their next threats. |
| TT4-F | Credential presentation, scoped delegation, AI service request, tool operation, psionic practice | Resource/property disputes mobilize actual institutions and defenses; different AI purposes create conflicts; bodily overload follows particular growth, not random punishment. |
| TT5-F | Interview, cooperative search, substrate-qualified skill, embodied drill, charged rune fragment | Infected applicants arrive through migration; predator habitats and aura attraction shape encounters; false results and gate decisions change the town's exposure. |
| ML-F | Keyed light, occlusion, formula reconstruction, material trial, physical tether | Sewer occupation and salvage motives create the hatch dispute; unsafe experiments produce lasting material hazards; invasion-era threats follow their own event graph. |
| LM-F | Spirit Vision practice, bounded divination, supported charm, ritual preparation, qualifying role act | Artifacts and unstable sources have particular provenance; hidden groups pursue motives; contamination travels through actual exposures, not a flat corruption tick on every action. |
| CI-F | Cogitation, spirituality wall, qualified dance, messenger ritual, one witnessed pact | Urban factions compete for work/territory; patrons and ritual responders have distinct interests; source/contract burdens create conditional exposure. |
| SS-F | Safe body drill, authored Aspect utility, Memory light, lookout, cohort extraction | Nightmare habitats and travel exposure govern creature contact; gates/refuge capacity shape migration and evacuation; human factions respond to territory and resources. Exact Spell/ecology origins remain source gates. |
| RP-F | Line rigging, cover/control, funded repair, reconnaissance, civilian extraction | The mission enters a world with native conflict; fire/royal events change routes; contractor competition exists only where the selected mission source establishes it. |
| JJ-F | Energy perception, reinforcement, barrier probe, curtain, innate extension | Leaked CE and accumulated negative emotion are source-qualified curse origins (ledger r79259); cursed objects/users and ritual barriers add specific threats. Conditions determine visibility and access. |
| BL-F | Qualified sensing, guard, movement drill, sourced Kidō utility, personal-release mode | Hollow/purification distinctions need selected B10/B11 and BU scene bindings; faction/war pressures change patrols; soul-source hazards are actor-specific. Do not make every invisible being hostile. |
| FT-F | Bounded familiar scout, workshop ward, supply maintenance, narrow command, vessel-enabled attack | A selected ritual creates rival objectives, concealment incentives and contested sites; upkeep links create vulnerabilities; myth-specific effects require particular legend cards. |
| HX-F | Source-qualified aura drill, concealment test, detection test, personal utility, conditional attack | Criminal/arena/expedition institutions and resources produce opponents; hidden conditions create traps; creature ecology stays local instead of scaling to aura. |
| FM-F | Material assessment, eligible repair, prepared-array reshape, supported ignition, automail care | War/territory and state policy create armed conflict; material/energy infrastructure changes technique feasibility; unstable experiments create hazards with actual inputs and aftermath. |
| NR-F | Control drill, ordinary taijutsu guard, qualified shape exercise, puppet retrieval, supported medical care | Village missions, border disputes and clan politics cause human threats; traps guard routes; later war actors enter through era events. Chakra does not create a matching enemy on upgrade. |
| SL-F | Camp drill, guard, route scout, maintained kit, qualified source practice | Patrol routes, supply lines, territorial enemies and mission orders select threats. Source/essence creature details stay unbound pending W1-SRC review. |

## More to consider, other stuff

Cross-world angles below extend the palette without competing with K15's
edge carry tables, K17 copies or W6's schema ownership. All are INFERRED.

| Code | New angle | Default + Dial + in-world reason |
|---|---|---|
| K2.8 | Law jurisdiction on the effect, not only on the traveler. | Default bind caster, target, payer and sustaining carrier separately. Dial local conversion versus foreign persistence, because a shield maintained from elsewhere can meet a target inside another world's rule field. |
| K2.9 | Aftermath survives loss of the initiating power. | Default ordinary fire, broken ground, evidence and wounds persist after dispel. Dial effects that explicitly restore their changes, because stopping a source and reversing its physical work differ. ML/FMA are good comparisons. |
| K2.10 | Rules have epistemic status and exception scope. | Default store a law candidate's narrator/teacher/belief qualifier beside its binding. Dial discovery depth, because locals may teach a useful incomplete rule. CI/TT4 need both sides of a contradiction. |
| K3.10 | A growth receipt says which facet changed. | Default distinguish reserve, output, control, efficiency, repertoire, source stage and social standing. Dial combined training, because one paid exercise can improve several facets without advancing a structural rank. |
| K3.11 | Idle credit follows actual work and resources. | Default routine-specific growth on supported played-time jobs; closed-browser policy separately declared. Dial assisted/unsafe training, because a mentor, stock, sleep site or active apparatus changes what can run safely. No stress or hunger punishment is added. |
| K3.12 | Personal generation has a proof budget, not a vague power name. | Default authored seeds plus tested target/operation/trigger/carrier/termination changes. Dial broader invention when adapters exist, because a generated name is not executable semantics. Nen, spells and releases share authoring shape without sharing metaphysics. |
| K3.13 | A source can outgrow its body, social role or support network. | Default compare actual capacities independently. Dial accommodation via tools/training/support, because TT4 bodily overload and TT5 predator attention are different outcomes of growth. Strong powers need no invented weakness. |
| K10.7 | Nonviolent actions have combat-timed state. | Default escape, bargain, carry, warn and contain have contact/time/means and remembered aftermath. Dial encounter response speed, because a bribe during an ambush differs from a negotiated truce before it. |
| K10.8 | Defeat has several owners. | Default body, source, gear, relationship, institution and objective settle separately. Dial severity by accepted encounter profile, because a rescued actor can lose the mission while keeping a career. |
| K10.9 | Threat ecology changes through causes. | Default territory, prey, witnesses, supply and canon era select threats. Dial density/response, because higher aura can attract a predator but repairing a gate can reduce danger. Do not force equal challenge everywhere. |
| K10.10 | Borrowed help stays an independent actor. | Default helper spends their own reserve/stock and can refuse or leave. Dial delegated scope, because Taiven, a Servant and a squad medic have different authority and motives. No help button clones their means. |

### Ranked suggestions

1. **W2-A1:** bind one small HP or D&D floor to exact source passages and
   existing consumers. Include 5-10 law facts, 3-6 supported techniques and
   one recoverable objective. This follows standing priority and ends in one
   playable slice, when separately authorized for implementation.
2. **W2-A2:** use the existing ML device and noncombat hatch alternatives as
   a concrete comparison for power/fuel/body separation and defeat receipts.
   Preserve its visitor contract; a native mage route is an additional proposal.
3. **W2-A3:** give W6 only the missing common semantics identified here:
   effect jurisdiction, facet growth receipts and multi-owner defeat. Keep
   per-world source rules in their world owners rather than building a universal
   rank or energy ladder.

Document/source review only. No new runtime functionality, rebuilt browser
evidence, persistence proof, commit or director acceptance is claimed.
