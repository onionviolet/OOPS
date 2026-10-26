# Minecraft cultivation-mod absorption wave, 2026-10-25

Authority and shared rules: [COMMON.md](COMMON.md) (quotes Weibao's four requests). Docs-only absorption audit: lanes download locally, read text, menus and features, and grade them A/P/M/U against current primary source using the CG01-CG30 ledger of the [2026-10-24 cultivation check](../../../research/itch-io-2026-10-22/CULTIVATION_ABSORPTION_CHECK.md). No runtime edits, because the live [cultivation implementation run](../cultivation-absorption-2026-10-24/CHECKPOINT.md) owns those files. Lanes run in the primary checkout so uncommitted cultivation work counts as present. Rules: WPR, AU1-AU15, AD5, AD37, AD38, sealed secrets.

Launched about 11:00 EDT via `runs/launch.py` (setsid double fork, `codex exec --approve-for-me`, workspace-write). Downloads: `docs/research/minecraft/private/cultivation-2026-10-25/` (gitignored). Reports: `docs/research/minecraft/cultivation-mods-2026-10-25/`.

| Lane | Prompt | Model | PID / PGID | Session ID | Report |
|---|---|---|---|---|---|
| M1 Xiaoxiang Cultivation World | [M1](M1_xiaoxiang.md) | gpt-6.1-sol medium | 72726 / 72725 | 01a17367-ea1e-77f0-966b-55cf8a0a0819 | M1_XIAOXIANG.md |
| M2 ChangShengJue | [M2](M2_changshengjue.md) | gpt-6.1-sol medium | 72729 / 72728 | 01a17367-ea36-77f3-8a47-0ba818856cc2 | M2_CHANGSHENGJUE.md |
| M3 Ascension (MrEizy) + other repos | [M3](M3_ascension.md) | gpt-6.1-sol medium | 72732 / 72731 | 01a17367-ea53-73f3-95b1-781c394570ef | M3_ASCENSION.md |
| M4 Lord of the Mysteries mods (4) | [M4](M4_lotm_mods.md) | gpt-6.1-sol medium | 72735 / 72734 | 01a17367-ea6d-77d2-9385-cb3d1e9f2af4 | M4_LOTM_MODS.md |
| M5 Other xianxia Modrinth mods (5) | [M5](M5_xianxia_others.md) | gpt-6.1-sol medium | 72738 / 72737 | 01a17367-ea7f-7251-994b-4b28ea45d0dd | M5_XIANXIA_OTHERS.md |
| M6 Scout beyond Modrinth (RI, Shadow Slave, CurseForge, mcmod.cn) | [M6](M6_scout.md) | gpt-6-luna medium | 72741 / 72740 | 01a17367-ea92-7db2-9bb4-b562c59ff2ea | M6_SCOUT.md |
| M7 Web-novel adaptation mods (LOTMCraft, RI Gu mods, Shadow Slave mods) | [M7](M7_webnovel_mods.md) | gpt-6.1-sol medium | 79864 / 79863 | 01a1736a-527a-7fc0-a900-133713f064fb | M7_WEBNOVEL_MODS.md |
| M8 Reddit player-voice pass | [M8](M8_reddit_voice.md) | gpt-6.1-sol medium | 79867 / 79866 | 01a1736a-529c-70e3-8174-af09c5cc0f3e | M8_REDDIT_VOICE.md |

Check: `kill -0 <pid>`; logs and last messages in `runs/`. Stop: `kill -TERM -<pgid>` (never `pkill -f`). Resume: `python3 runs/launch.py <name> <prompt> <workdir> <model> <effort> <session_id>`.

Coordinator fold after returns: spot-check cited facts, then fold gaps into the cultivation check ledger, LOTM queue and systems register by hunk; queue M6's proposed next lanes for Weibao.

## More to consider, round 1 (2026-10-25)

Weibao: "/more-to-consider, look thorugh relevant reddits too and more". Lanes M1-M6 were live and downloading (sandbox network escalation works; ChangShengJue jar and the Ascension clone landed).

SHOWN: Reddit pages and JSON refuse automated fetches; the Pullpush archive API answers and found threads that the Modrinth search missed: LOTMCraft (CurseForge, NeoForge 1.21.1, the most-discussed LOTM mod), a Gu Daoism Reverend Insanity mod and a Chinese RI mod tutorial, Shadowbound and other Shadow Slave mods, "MY LOTM Minecraft RPG", a quasi-LOTM/COI mod, and an r/feedthebeast cultivation mod launch thread. Web search added CurseForge-only Shanhaixiantu and Immortality: The Path of Cultivation.

ACT NOW (done):
- MC1. LOTMCraft, Gu and Shadow Slave mods had no owning lane (M4 is Modrinth-only; M6 lists without absorbing). Dispatched M7.
- MC2. Player voice was absent from every lane. Dispatched M8 over cultivation, web-novel and idle-game subreddits through Pullpush.

ACCOUNT FOR NOW:
- MC3. Idle translation: Minecraft mods are real-time voxel play. Every absorb proposal must say which job, choice, preview or panel replaces the action. Added to COMMON for M7/M8; M1-M6 started before it, so the fold applies it to their proposals.
- MC4. Overlap: M6 lists, M7 absorbs; M7 reads M6/M4 partial reports first. Duplicated finds are reconciled at fold, not by stopping lanes.
- MC5. Fan adaptations are not canon. LOTM proposals cite our source notes over mod values; our sealed LOTM truths stay sealed in reports.
- MC6. Reddit text is copyrighted user content: paraphrase, one short quote per thread at most, no usernames in committed docs.

LATER / DELEGATE (proposals, not dispatched):
- MC7. mcmod.cn census of Chinese-only cultivation mods and modpacks (1.7.10 to 1.12 era included) after M6 returns. Luna medium, one session; done when each has a ranked row and download status.
- MC8. Video evidence for mods without text docs (Bilibili RI mod showcases, YouTube creators such as Amasqo) through the media transcript tools in docs/TOOL_REGISTRY.md. Luna, small; done when each target has a transcript summary or a recorded unreachable route.
- MC9. Tale of Immortal (鬼谷八荒) Steam Workshop has an RI "蛊真人(蛊界)" mod: check the acquisition queue and whether Weibao owns the game before any read. Coordinator, minutes.
- MC10. Hytale cultivation mod (CurseForge Hytale) is a different engine; list only unless Weibao asks.
- MC11. After fold, decide with Weibao whether a Reverend Insanity or Shadow Slave world enters the world queue; the mods are evidence, not authority (AD5 sequencing).

## Deeper results synthesis, 2026-10-26

Request: “Deeper stuff for F2 and F3 accordingly”, referring to the October 25
research returns and their useful adaptation proposals. Mode: bounded reuse and
comparison of the eight saved reports, with selected live native source checks.
This appendix supplies a deeper explanation, not the full coordinator fold or a
runtime dispatch. It stays in the existing wave owner to avoid a competing spec.
Rules: AD5–8/15–17/32/34/36/38/41; WPR1–5/8/18–23/27–31.
Budget: one primary session, no agents, new downloads or web research. Evidence
below describes the saved October 25 inspections; published versions, availability
and outside-game behavior were not rechecked on October 26. No novel was reread.
Mod systems are fan adaptations unless separately source-qualified as canon.

### F2: what each lane actually returned

The A/P/M/U marks describe a bounded native analogue: A has an inspected producer
and consumer; P has existing parts plus a named extension; M was missing in named
owners; U has insufficient reference or integration evidence. They are not import
percentages, completeness scores or new browser acceptance. Rows overlap between
reports, so their totals should not be added into a single coverage percentage.

| Lane and saved report | Deeper result | Boundary |
| --- | --- | --- |
| M1 [Xiaoxiang](../../../research/minecraft/cultivation-mods-2026-10-25/M1_XIAOXIANG.md), 36 rows: A4/P30/M1/U1 | Different aptitude architectures for race/form, route-specific Foundation/Core preparation, primary/auxiliary technique resonance, a natal implement with bond/dormancy/severance/deployment states, person-centered NPC books, and separate intact-return/new-life afterlife handling. The report indexed 137 techniques and 154 spells; it did not trace every cast. | Question Heart had a checked admission route; two other advertised Inner World trials were disabled in the inspected selector/request route. Sect/family ecology is partly author-stated, not a proven autonomous society. |
| M2 [ChangShengJue](../../../research/minecraft/cultivation-mods-2026-10-25/M2_CHANGSHENGJUE.md), 24 rows: A2/P18/M1/U3 | Learning, comprehension, readiness and mastery are distinct. Different methods train through attacks, movement, work, trade or healing. Tea/wine modify actual technique costs/effects. Gang quests can conflict; helpful conduct changes local gossip. Coins have physical denominations and a material minting process. | This is a strong wuxia/everyday-world reference. The inspection did not establish an immortal realm ladder or separate inner-energy pool. Many technique descriptions were not fully traced through their effect bodies. |
| M3 [Ascension](../../../research/minecraft/cultivation-mods-2026-10-25/M3_ASCENSION.md), 18 rows: A4/P11/M2/U1 | Separate spendable qi, stored foundation and progress; body/soul/essence routes; method-granted skills and mastery ceilings; thermal alchemy; bounded elemental method fusion; local atmospheric qi. Release alchemy and the source rewrite use different mechanisms. | Released 0.1.8.4 and the larger 0.2 main snapshot are separate evidence. A nine-strike trial class did not establish an ordinary reachable, persisted trial. Definition counts do not prove reachable content. |
| M4 [Four LOTM mods](../../../research/minecraft/cultivation-mods-2026-10-25/M4_LOTM_MODS.md), 28 rows: A6/P14/M5/U3 | Conserved characteristics as ingredients, ordinary outcomes contributing to acting, artifacts with concrete handling drawbacks, real ability consumers, staged rites and addressed invocation. It distinguished held dose, ingested source and learned execution. | Four different projects, with different fan departures. Empty handlers, stored honorific text and a large pathway catalogue are not proof of working abilities, invocation or full sequence coverage. |
| M5 [Five other cultivation mods](../../../research/minecraft/cultivation-mods-2026-10-25/M5_XIANXIA_OTHERS.md), 16 rows: A2/P10/M0/U4 | Elemental roots trade speed against capacity/conflict; herb maturity and core quality affect alchemy; recipient/repetition/quality affect toxicity; some trials have causal phases; multiple physical weapons can become a controlled array. Also separates seclusion costs, bodily integration and deed-based unlocks. | Five artifacts inspected; two server plugins remained page-only. A furnace menu did not establish its recipe executor. Some life-simulation and combat flows remain unread. Zero M means many partial analogues, not complete coverage. |
| M6 [Wider scout](../../../research/minecraft/cultivation-mods-2026-10-25/M6_SCOUT.md), catalogue rather than A/P/M/U | Found additional Chinese/older cultivation lines and webnovel adaptations, including ImmortalStorage, Tensura-related projects, Mushoku Tensei projects and a Cradle listing. Its 29 catalogue rows include a repeated Martial Dao entry, not 29 distinct deeply inspected mods. | ImmortalStorage was downloaded and hash-checked but not opened. Most additional candidates remain listing-level leads. M7 later acquired/read some of M6's initially acquisition-limited candidates; M6's old gate is not the final wave-wide status. |
| M7 [Webnovel adaptations](../../../research/minecraft/cultivation-mods-2026-10-25/M7_WEBNOVEL_MODS.md), 30 rows: A2/P22/M2/U4 including CultCraft | Five official builds: LOTMCraft, Gu Craft, Dawn of the Spell, Shadowbound and CultCraft. It separated living-Gu upkeep from activation, Memory research from fitting, injured-companion storage from recovery, evolution from availability, and party-trial commitment from return settlement. CultCraft adds vassal/aid/follower/private-space ideas as a separate palette. | Chinese guzhenren was not acquired; Gu Daoism had no located public build. Dawn and Shadowbound are distinct fan interpretations. A quoted claim about several mods did not establish one common author. No activated RI or Shadow Slave world is inferred. |
| M8 [Reddit player voice](../../../research/minecraft/cultivation-mods-2026-10-25/M8_REDDIT_VOICE.md), 22 indexed threads, 12 themes; ten native mappings A7/P3 | Players described valuable build/crafting breadth, personal adventure, recognizable people and source-specific powers. Recurring problems concerned unclear stalls, upkeep, storage, forced automation and weak explanations of consequences. | Purposive, search-biased sample, with mixed played reports, developer statements and wishes. No prevalence estimate. Pullpush was rate-limited; three named seed threads and exact Idle Immortal coverage remained unresolved. |

### F3-A: progression becomes a history of choices

**Reported source evidence:** Xiaoxiang distinguishes immediate qi from earned
readiness and checks route-specific preparation/history. Ascension distinguishes
foundation from immediate progress and offers authored elemental fusion chains.
ChangShengJue ties mastery to different relevant activities instead of a single
generic realm XP bar. See M1 X02–X07, M2 martial-arts section, M3 foundation,
technique and fusion sections.

**Proposed depth:** preparation can determine what kind of advancement occurs.
Two characters at the same nominal stage could have different stable output,
control, learned execution and future route compatibility because they trained
or integrated materials differently. Activity-specific mastery can then change
cost, scope, yield or a new supported action. A title alone does not provide that
effect; its ordinary consumer must read the preparation.

**Illustrative OOPS slice, not implemented here:** divert some current practice
into foundation conditioning, then compare a real trial or conversion with the
unconditioned route. Default: a genuine trade between near-term progress and a
known durable benefit; dial: which benefit, preparation and risk that world uses;
reason: a more stable channel supports a different operation. Proof would need
different real outcomes, truthful costs, and body/carry compatibility on reload.

### F3-B: cultivation is embodied, situated and supplied

**Reported source evidence:** M1 race/form changes alter available mechanisms;
M5 elemental roots can distinguish intake speed, capacity and conflict; M3 local
qi provides a finite environmental supply. M1 powered formations connect home,
production and care. Some deployed formation and broad ecology details remain
author-stated rather than fully traced.

**Live bounded check, October 26:** `src/cultivation_root.js` already derives
latent flow/still affinity from inherited phenotype and consumes it in
`src/absorb_p23/world_adaptation/techniques.js` rate calculation. Retuning changes
current expression rather than inherited alleles. `src/home_model.js` consumes
actual bed-field qi and `broodPracticeBonus` from `src/household_brood.js` into
Meditation XP. The brood has actual individuals and staged care. These are
existing causal mechanisms, not merely proposed ancestry/creature flavour.

**Proposed depth:** extend those owners so a selected body, method, location and
apparatus can interact. A site might support one method well but deplete under
use; a formation could route paid charge to a crop or bed; a transformed body
could preserve knowledge while changing which technique it can execute. Default:
one tested interaction on existing supply/body owners; dial: affinity, recovery,
range, embodiment and upkeep; reason: a specific local mechanism. Broad sect AI,
all elemental combinations and a whole geography are separate scope.

### F3-C: equipment and creatures retain individual histories

**Reported source evidence:** Xiaoxiang's natal implement separates possession,
bond, active use, dormancy, severance and remote deployment. Dawn separates
observing a Memory, learning an enchantment and fitting learned properties.
Stored Echo health persists and recovery affects resummoning. Shadowbound has a
different captured-creature army, healing/evolution and conditional death policy.
These are distinct fan designs, not interchangeable canon claims.

**Existing support:** `src/absorb_p23/living_gear/index.js` already tracks exact
copy kill/wear history and consumes it in attack projection. Existing brood,
cohort, item custody and knowledge owners offer additional parts. Their existence
does not establish general creature capture, bonded teleoperation or Memory
enchantment fitting.

**Proposed depth:** one specific item can be studied, altered, bonded or deployed
while retaining identity and costs. One companion can rest or evolve while
temporarily unavailable for expedition duty. The player chooses present strength
against future readiness. Default: one real item/companion with one new operation;
dial: growth input, recovery, range, control and loss; reason: the carrier's actual
condition and connection. Proof needs one identity across use, storage, interrupted
work and reload, with no simultaneous assignment or duplicated item benefit.

### F3-D: medicine and making depend on process and recipient

**Reported source evidence:** release Ascension uses a thermal operating band;
out-of-band work resets progress while blocked output pauses. Its rewrite uses
property interactions and iterative condensation instead. M5 adds mature herbs,
matching cores, additives and contextual pill toxicity. ChangShengJue has drinks
that modify real technique execution rather than generic food bonuses.

**Proposed depth:** the same nominal recipe can differ because of material
development, heat/order, recipient integration, repetition and the intended use.
Existing crafting already has ordered materials, heat/residue, grade and bodily
treatment in the inspected reports. The extension should join a named missing
factor to that resolver, rather than create a second alchemy engine.

**Illustrative proof:** compare two thermal histories or two actual recipient
histories; show the predicted difference in useful product or bodily consequence;
interrupt and reload without losing ownership or minting output. Default: one
known recipe/process; dial: working band, pause/reset, tolerance and treatment;
reason: chemical or world-qualified integration, not universal pill punishment.

### F3-E: source-specific powers change ordinary life

**LOTM:** M4/M7 point toward a characteristic with conserved rank/path/identity,
ordinary role outcomes that credit acting, an artifact with a useful effect and
concrete handling cost, and a rite with preparation/commitment/response/aftermath.
An ability is deeper when an actual work, travel, observation or combat decision
reads it. A label or self-contained meter does not establish that consumer.

**Correction to proposal freshness:** M7-P4's contextual acting guide is already
locally delivered by the separate [acting-guidance owner](../lotm-acting-guidance-2026-10-25/CHECKPOINT.md).
Its receipt records earned Seer/Savant journeys, completed/cancelled distinctions,
navigation, persistence and desktop verification. Full-suite, commit, publication
and normal-app adoption were not established by that lane. This is overlapping
delivery, not evidence this research wave caused or installed it. Wider ordinary
event-to-acting credit and high-rank catalogue coverage remain separate questions.

**Reverend Insanity:** the consequential distinction is a living owned Gu with
food/control needs versus essence spent to activate it. Refinement, joint use,
fusion and recipe deduction are different operations. M7 found generic support
parts but no activated native RI branch. Gu Craft did not establish a complete
feeding/killer-move system, and the Chinese mod's unacquired artifact remains a
source gap. Default: one source-qualified Gu/feed/effect loop if a world is later
selected; dial: food, control, essence grade and refinement risk per Gu; reason:
living carrier and actual activation mechanism.

**Shadow Slave:** Memory research/fitting, companion recovery and party-trial
preparation can create useful new choices. Dawn's two implemented Nightmare tiers
were arena-wave adaptations; Shadowbound's broadly capturable shadow army is a
different palette. Default: one qualified expedition or owned-carrier loop; dial:
party, withdrawal, recovery and rewards; reason: that source-qualified challenge.
Neither report establishes a complete playable native Shadow Slave world.

**People and institutions:** M1's person book and M2's local obligations connect
capability to an actual available teacher, trader or worker. Helping someone can
produce an introduction or delayed offer through known channels. Funds, personal
earnings, institutional stock and witnessed reputation remain distinct. CultCraft
adds timed aid/return and subordinate relationships as fan reference mechanisms;
its sacrifice/crown system is not an instruction to rewrite LOTM potion laws.

### F3-F: what the player-feedback pass changes

M8 supports clearer causal choices, not a universal taste verdict. Some sampled
players like long grind, colonies or resets; others want personal adventure or
long uninterrupted lives. The inference for OOPS is to keep depth in preparation,
allocation, discovery and aftermath while demonstrated repetition can use existing
funded routines. Show an actual stop reason, destination of output, remaining
cost and consequence of commitment. This adds useful decisions without requiring
Minecraft's voxel handling, hotkeys, reflex combat or repeated roster clicks.

### Readiness and remaining evidence

This round leaves adaptation selection open. Comparatively close candidates
join existing owners: a known-route breakthrough planner, activity-specific
mastery, one thermal/recipient-sensitive recipe, or item research/fitting. More
substantial integrations include bodily transformation, deployed formations,
conserved characteristics, living Gu and party trials. These are relative scope
judgments from the reports, not estimates of completion time or accepted order.

Named evidence gaps remain: reference trial admission, selected untraced effect
bodies, Chinese RI artifact access, ImmortalStorage reading, and exact invocation
bridges. Resolve a gap when a selected mechanism depends on it. Broad catalogue
parity and further acquisition do not become prerequisites for every slice.

Verification for this appendix: saved report sections compared; selected native
root/rate, field/brood and living-gear producer/consumer locators inspected; later
LOTM guidance receipt checked. Appendix link check: PASS, nine local links resolve.
`git diff --check -- docs/gm/dispatch/minecraft-cultivation-mods-2026-10-25/README.md`:
PASS. Blanket-language scan: no design absolutes found (one descriptive
“page-only” evidence label). No runtime source, test, bundle, player save, installation, commit
or push changed; no new build/browser proof claimed.


## Implementation selected, 2026-10-26

The earlier research-only stopping point is superseded by Weibao's request to implement the applicable ideas and create a chat per lane. See [shared brief](implementation-2026-10-26/COMMON.md), [lane/thread ledger](implementation-2026-10-26/THREADS.json) and individual L1–L8 checkpoints. The earlier reports remain dated research evidence. New implementation state comes from the new checkpoints, not this dispatch label.
