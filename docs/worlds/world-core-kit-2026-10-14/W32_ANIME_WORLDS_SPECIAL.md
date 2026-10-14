# W32: Anime and manga worlds, special systems

## CHECKPOINT

2026-10-14. Complete design-only W32 snapshot for Jujutsu Kaisen, Bleach, Naruto, Fate, Hunter x Hunter and Fullmetal Alchemist. Own this file and `docs/gm/dispatch/world-core-kit-2026-10-14/W32_REPORT.md` only. Live HEAD observed during reading: `a87729be5866830da6c58fa74ea095a039dd10f7`; dirty tree and other writers active. Source lines below are this reading's locators, not an immutable release. No source, pack, save, build, test, branch, stage, commit or push changed. Resume by checking cited owners and newer lane arrivals. Next work is root-owner folding, not implementation.

## W32.E: scope and evidence

Authority: [COMMON](../../gm/dispatch/world-core-kit-2026-10-14/COMMON.md), [kit rounds 9-11](../WORLD_CORE_KIT_2026-10-14.md#round-11-specific-worlds-and-their-special-stuff-2026-10-14), [audit playbook](../WORLD_CORE_KIT_AUDIT_PLAYBOOK.md), PROJECT standing priorities and USER_VISION. These are considerations, not accepted specifications. One realm and one prestige remain the first milestone. Nested cards describe eventual coverage, not a demand to build several realms together. Future lens presentation targets 1366x768 and 1600x1000 laptop/desktop: local terms, clocks and observed causes visible beside ordinary work. Mobile optimization is deferred. This lane makes no UI behavior claim.

**SHOWN(repo)** means inspected code or authored text with a locator. It authenticates what the repository says, not the franchise claim. **STATED** means attributed official/wiki material, including locally retained dated revision summaries. No primary manga chapter was read in this lane. **INFERRED** covers shapes, proposed records, readiness judgments, defaults, dials, examples and rankings. **MEMORY** would mean unchecked recollection; no unchecked lore is used as a floor here. Exact unsourced prices, climate numbers and term dates remain UNKNOWN rather than being filled from memory.

MW2: none of these six is a supplied-full-novel-qualified lane. JJK, Bleach, Naruto, HxH and FMA use their separately qualified manga/adaptation owners. Fate uses a visual-novel premise plus a dated secondary rules digest. Fate/Zero novels, Bleach novels, Naruto novels, games, filler, later continuities and original echoes need separate source cards. A path to a digest is evidence of that digest's claim, not full-source reading. All new local cast, prices, climate curves, jobs and timing policies here are original INFERRED proposals.

Sources with web-search text were checked on 2026-10-14. Direct fetches of Naruto Missions, Fate Command Spell/Fuyuki War, HxH Nen and FMA State Alchemist/Briggs failed. Switched to retained revision summaries and search-index text; no successful full-page refresh is implied. Local Bleach/Naruto digests say `blocked_no_revision`, even though their separate SOURCE_LEDGERs contain bounded official evidence. Preserve both states. W21 and W25 were available first; W26 and W27 arrived during this read. W22-W24 arrived during final review and were read for their findings and relevant rows. W28 had no lane artifact in the final inspected inventory; its named branch was not found. No climate prototype credit.

### W32.E1: reusable evidence and runtime anchors

| Code | SHOWN(repo) locator and what is actually there | Boundary |
|---|---|---|
| R1 | `src/weather.js:2-14`, `:63-91`: global time/location imports, base temperature and shared seasonal curve. | DR1 partial substrate; no six-world climate adapter evidenced. A curtain's apparent night must not select this global night's temperature. |
| R2 | `src/world_instances.js:98-111`: instance identity/parent field and validated played-minute clock with absence freeze. `src/realm_clock_leases.js:179-205`: admitted activity-clock planning. | Reusable detached seams. Not active anime-world clocks or arbitrary canonical rate support. |
| R3 | `src/book_world_paradise_carriers.js:30-35`: native/common and instance/presence clock policies, hub/local kinds, return/extraction deadlines. | MW1 template, not permission to transplant Paradise's deadlines, calendar or source semantics. |
| R4 | `src/realm_boundary_rules.js:2`, `:46-65`, `:103`: operation families and boundary validation/planning. | Passage, view, projection, sense and contact can differ; generic seam does not implement a JJK Curtain or Bleach Senkaimon. |
| R5 | `src/feature_expansion_book_roster.js:1842-1857`, `:2191-2206`: Naruto/Bleach profiles, edition pins, original local branch and `nativeWorldId: null`. `:2079`, `:2423`: explicit native gaps. | Partial authoring source. Neither profile creates an instance, source, elapsed clock or playable world. |
| R6 | `src/feature_expansion_book_roster.js:3060-3072`: rule and recognition evaluators; named observer, evidence-supported reading, no inferred suspicion. | Useful DR3/DR5/DR7 contract; evaluating a claim is not granting a credential or access. |
| R7 | `src/status_window.js:8-40`: status reader for native stats/titles/points. [W27](W27_INSPECTOR_MAP.md) W27.S4-S7 supplies scope, observer permissions and receipt-page proposal. | Shell reuse, not six implemented lenses. No new power rank inferred from strength or magic. |
| R8 | [W26](W26_CARRIERS_AND_SMALL_CONSEQUENCES.md) W26.B1-B7 cites real reputation, directed memory, witnessed assault and named debt owners; W26.C proposes accountable delivery. | Generic couriers/Standing join remains proposed. Root “no small debts” cannot mean none anywhere. No six-world courier runtime established. |
| R9 | **branch `core/a4-relationships`**, `src/relationship_view.js:1-17`: separate directed relationship stores and read rules. **branch `core/a5-determinism`**, `tests/determinism_replay.test.js:73-119`: replay/reload scenarios. Read via `git show`. | Branch-only evidence, not merged credit or executed tests. A4 authoritative access is not observer disclosure; A5 is not climate/away parity. |
| R10 | [W21](W21_READINESS_K19_K34.md): rows `:82-87`, local cards `:466-639`. | Inherited K19-K34 snapshot, not rescored by W32. Local R missing for JJK/Fate/HxH/FMA; Bleach/Naruto retain nine partial inactive-profile rows each. |

**W32-E2, late sibling reconciliation:** [W22](W22_DEPENDENCY_CHAINS.md) distinguishes producer → owner → execution reader → observer reader → surface; DR7 below uses that chain and does not count validation/serialization as felt depth. [W23](W23_GLOBALS_AND_LIFECYCLE.md) G01-G05 adds fixed 30-day calendar, epoch, daylight and weather-cache assumptions; every DR2 must bind these alongside local economy and body support. Unknown climate is unavailable until a selected profile is authored, never an automatic Frontier fallback. [W24](W24_LAWS_AND_ORDERING.md) F1-F4 finds narrow law predicates, different deterministic scheduler ordering and frozen jobs with current fact readers. All DR3 proposals below must declare commitment/completion rechecks and compatibility for accepted jobs; no blanket local-law enforcement is inferred from a realm-boundary check. Same-tick story ordering remains a cause-graph join between existing runners, not proof that all runners currently use file order.

For each DR table, **D** rates the whole direction's documented floor and **R** its world-specific source floor. `P` = partial, `M` = missing, `F` = met within an explicitly narrow named contract. None has a met joined DR1-DR8 runtime floor. A cited source chapter in a ledger is a locator reported by that owner, not SHOWN primary evidence in W32. DR8 uses the full inherited W21 detail rather than inventing new per-K scores.

### W32.N: nesting contract, applied to all six

INFERRED: a parent owns K1 source/continuity, K17 copy identity and K18 compatibility/proof routing. K2/K3 inherit only compatible source rules, with explicit local amendments; no latest-child-wins conflict resolution. K4 entry means and K6 actors keep one actual identity/history, even when several children refer to them. K5/K7/K8/K9/K10/K19-K28 are local overlays with their own places, institutions, goods, bodies and calendar context. K11/K23/K30/K31 inherit the observer boundary, never hidden knowledge. K12/K16/K29/K32 link local occurrence clocks and effects to the parent's causal graph. K13/K14/K34 are local loop, presentation and lens bindings. A child can say not applicable with a reason; it does not inherit unsupported runtime credit.

**Clocks are not calendar labels.** A mission deadline, school date, weapon cooldown, actor age and contest phase can share a reference without sharing a rate or reset. Every selected reader names a clock and policy revision. Default freeze unsupported absence; Dial later authored public-world advancement and supported queued work, because the current seam does not prove closed-browser simulation. Canon events can still run without player participation while their world clock advances. Freeze is a technical proposal, not a claim about franchise physics.

## W32.JJ: Jujutsu Kaisen

### Shape and existing solutions

INFERRED SW4 + SW6; SW7 only for a selected contest-era child. Parent `jjk/<main-series-cutoff>/<copy>` owns source and curse/energy baseline. School children Tokyo/Kyoto inherit power and source rules but own staff, grade decisions, timetables and mission office. Mission-site children inherit accepted contract terms and actor identities; own geometry, witnesses, curtain state and local danger. A domain is an encounter-scoped rule overlay by default, not a new persistent realm or another prestige. Dial persistent authored pocket space only with source evidence and an owner.

Already solved in docs: `docs/worlds/jujutsu/SOURCE_LEDGER.md:20-30` separates innate source, learned barrier, imposed restriction, grade and procedure; `MODULE_CATALOGUE.md:13-30` inventories the distinct families; `IMPLEMENTATION_PACKET.md:7-31` gives a bounded curtain assignment, evidence, acceptance/refusal and proposed owners. These are authored proposals, not runtime. The older brief explicitly marks memory-based brainstorms at `WORLD_BRIEF.md:21-24`; its later boundary at `:32-36` supersedes them where they differ.

### Special systems and source limits

All franchise entries below are STATED secondary, except where marked otherwise. JJ-L = `docs/worlds/jujutsu/SOURCE_LEDGER.md`; JJ-M = `MODULE_CATALOGUE.md` in that folder.

| Code | Special system, evidence locator | What bends K1-K34 / proposal boundary |
|---|---|---|
| JJ-S1 | Energy leakage, reserve/output/control, reinforcement and curse perception: JJ-L `:20`; Cursed Energy r79259. | K3/K19/K30 need separate faculties and fuel. Original climate-to-curse spawn formula is not canon. |
| JJ-S2 | Innate/inherited methods versus learned barrier methods: JJ-L `:21`; Cursed Technique r79254. | Method knowledge, eligible body/source and ritual execution are separate. A clan manual does not grant the source. |
| JJ-S3 | Self and mutual vows: JJ-L `:22`, `:38`; Binding Vow r78401. | Exact terms and benefits; self-breach and uncertain mutual sanction differ. No common punishment roulette. |
| JJ-S4 | Heavenly Restriction: JJ-L `:23`, `:39`; r79234. | Imposed birth condition, not a player-selected vow. Detection, admission and physical obstruction differ. |
| JJ-S5 | Curtains: [wiki Curtain](https://jujutsu-kaisen.fandom.com/wiki/Curtain), Description/Usage; JJ-M `:19`, Curtain r77658. | Concealment, selective admission, overlap, commissioned talismans and communication interference need separate predicates. Wiki says the apparent sky changes; this does not establish changed solar time or climate. |
| JJ-S6 | Domain shell, procedure, sure-hit, counter, clash, burnout: JJ-L `:25`, `:28`, `:40`; Domain Expansion r78744 / Deadly Sentencing r73036. | K2/K10 need procedure state and adjudicator knowledge. Nonlethal/incomplete/open examples prevent a universal “always hits” rule. |
| JJ-S7 | RCT, positive energy, technique reversal and recipient limits: JJ-L `:26`; r79210. Black Flash and timing/control: `:20`. | Recovery and power insight are separate effects; no guaranteed Black Flash farming or universal healing. |
| JJ-S8 | Summon taming/destruction, adaptation, tools/objects, soul/body interactions: JJ-M `:23-26` with named revisions. | Persistent owner-bound learning, item custody and technique-specific summon rules. Mature examples stay case-qualified. |
| JJ-S9 | Schools, grades, clans, headquarters and succession: JJ-L `:29-30`; JJ-M `:28`. [Tokyo school](https://jujutsu-kaisen.fandom.com/wiki/Tokyo_Metropolitan_Curse_Technical_College) and [Goodwill arc](https://jujutsu-kaisen.fandom.com/wiki/Kyoto_Goodwill_Event_Arc), annual event search text. | Grade is issued social assessment, not exact threat strength. Fees, mission pay bands and full term dates are UNKNOWN; selected pay is original. |
| JJ-S10 | Rule-changing contest, entry/removal, points/transfer and barriers: JJ-L `:27`; Culling Game r79139. | Points are issued/spent under versioned rules, not money or XP. Killing an organizer does not automatically close the system. Deferred from the first curtain slice. |
| JJ-S11 | Cursed Corpse and named Maximum techniques appear in JJ-L retained-title index `:301`, `:131`, `:201`, `:306`, with revisions. | STATED index presence only, not inspected recipe facts. Reserve separate construct/control/core and advanced-technique fields; artificial-person creation, independence and universal frequency limits stay UNKNOWN until precise source reading. |

### DR1-DR8 against JJK

| Code | Today: existing floor and locator | Default + Dial + in-world reason / missing floor |
|---|---|---|
| JJ-DR1 | D P / R M; JJ-S5 gives local apparent night; R1 global weather only. No sourced Tokyo/Kyoto numeric climate curve. | Default outdoor climate as an explicitly original local profile; curtain changes perceived sky only. Dial ambient supernatural effects when source-qualified, because concealment does not imply cooled air. |
| JJ-DR2 | D P / R M; JJ-L `:20-25`; packet `:14-22`. | Default perception, phone reach, currency and campus access local. Dial curtain-specific outage, tool channels and window witnesses, because public infrastructure and curse society overlap without sharing knowledge. |
| JJ-DR3 | D P / R M; JJ-M `:16-22`, interactions `:38-73`. | Default predicate check for walk/sneak/teleport, physical tool/cast/summon, explanation/message and direct/queued acts. Dial source exceptions and institutional enforcement, because barrier mechanics, secrecy and office sanction have distinct authorities. |
| JJ-DR4 | D P / R M; campaign `:37-41`, packet `:16-20`; R2/R3. Annual Goodwill claim JJ-S9; exact school terms UNKNOWN. | Default school date plus accepted mission window and encounter durations. Dial dispatch cadence/recovery time and supported queued study, because emergency missions can interrupt class; do not import Hogwarts terms or grant attendance while away. |
| JJ-DR5 | D P / R M; interactions `:27-36`, packet `:14-22`. | Default report to a named dispatcher with confidence and actual receipt. Dial phone, runner and curtain-blocked contact; missed accepted briefings can affect access, because windows, students and headquarters know different things. Refusal creates no debt. |
| JJ-DR6 | D P / R M; packet `:8`, `:42`; R7/W27. | Default Boundary and Dispatch page below. Dial compare two observed tests, because a qualified observer can learn a predicate without seeing every curse or domain rule. |
| JJ-DR7 | D P / R M; JJ-M `:50` exact runtime gaps; packet `:22`. | Default label each report/barrier/mission producer and absent reader. Dial author-only law-family matrix, because a conceptual owner or successful preview must not count as a committed barrier. |
| JJ-DR8 | D P / R M; W21 `:466-492`: K19-K34 D 2F/12P/2M, R 16M. | Default complete one school's lived floor around the curtain slice. Dial local rituals, medicine and voice, because the student's day should survive mission refusal. Missing K25 personal corner and K27 durable comedy need authored local closures, not combat grants. |

### Lens, sealed risks and more to consider

**JJ-LENS (INFERRED):** Boundary and Dispatch. Known shell, current observer channel, tested entry action/result, received report and confidence, accepted terms, clock, permitted counters, aftermath receipt. Author page compares twin-action coverage without returning hidden predicate values. Unknown domain clauses remain unknown.

**JJ-RISK-01 / JJ-RISK-02:** proposed risk-review IDs only, not registered secrets. No stable JJK secret ID established in the inspected owners. Route them to the world author before binding any altered truth. Predicate comparison, automatic counter advice, domain judge evidence and result counts can leak a changed slot; show discovery entitlement first. Do not derive secret identity from zero-energy detection absence.

| Code | More to consider (INFERRED) | Disposition / Default + Dial + reason |
|---|---|---|
| JJ-X1 | Curtain nesting has several owners: talisman craft, activator and observed site. | ACCOUNT: preserve three identities; Dial commissioned support work, because the activator need not be the designer. |
| JJ-X2 | Communications fail during the action that would request rescue. | ACCOUNT: show last confirmed contact and fallback route; Dial runner/qualified relay, because a hidden site should create practical choices without inventing omniscient help. |
| JJ-X3 | Grade reassessment can change a mission without changing the enemy. | LATER: source-qualified reassessment receipt; Dial corrected terms before renewed commitment, because bureaucracy's estimate and actual danger can diverge. |

## W32.BL: Bleach

### Shape and existing solutions

INFERRED SW3 + SW6, SW4 for academy/squad careers. Parent owns the selected original-manga cutoff, shared soul identities and cross-realm law. Living-world and Soul Society children own K2/K5/K7/K8/K19/K22/K28; share compatible spiritual-system definitions, not local balances, aging or weather. Hueco Mundo and transit are additional later children/edges, not forgotten because SW3 says paired. Early two-realm presentation can remain the first useful model without declaring the cosmology exactly two realms.

SHOWN(repo): `docs/worlds/bleach/CAMPAIGN.md:37-57` already differentiates living street, soul quarter, treatment, institutions and later Hueco Mundo; `MODULE_CATALOGUE.md:38-48`, `:80-88` separates arts, devices, source-bound release and cargo; `IMPLEMENTATION_PACKET.md:58-80` authors an ordinary/report route with future bindings. R5/R6 preserve inactive source credit and narrow observer recognition. No native paired-realm travel is evidenced.

### Special systems and source limits

BL-L = `docs/worlds/bleach/SOURCE_LEDGER.md`; BL-M = local `MODULE_CATALOGUE.md`.

| Code | STATED system and source | Kit bend / source boundary |
|---|---|---|
| BL-S1 | Living perception and exceptional source transfer: BL-L B10 `:30`, [VIZ vol.1](https://www.viz.com/manga-books/manga/bleach-volume-1/product/167). | Seeing a soul, touching it, transferring power and becoming its wielder are different operations. |
| BL-S2 | Spiritual source, pressure/control, sword/unarmed/movement/Kido arts: BL-M `:38-44`; BL-L B2/B7 official bio/glossary references `:22`, `:27`. | Several specialties, not one reiatsu level that grants every art. |
| BL-S3 | Asauchi, personal Zanpakuto bond, Shikai/Bankai, damaged release limits: BL-L B1/B4-B6 `:21`, `:24-26`; [official glossary](https://bleach-anime.com/keyword/), 卍解 / 破壊された卍解. | Soul partner, physical blade, known name and authorized release cannot be sold as interchangeable inventory. Exceptions need selected scenes. |
| BL-S4 | Shinigami, Quincy and Arrancar source rules differ: BL-L B7 `:27`, B11 following B10. | Purification and destruction should not have identical ecology effects; exact scale is source-gated. |
| BL-S5 | Soul Society/Rukongai/Seireitei, Central 46, Gotei 13 and Kan: [Soul Society wiki](https://bleach.fandom.com/wiki/Soul_Society), infobox/Overview/Laws search text. | Local issuer, office, squad duties and money separate from release stage. Kan/yen exchange rate and stipend schedule UNKNOWN. |
| BL-S6 | Slow aging, hunger distinction by spiritual power and reincarnation: same page Overview. | Body-local health/life clock, not shared human aging. Do not impose hunger death; approved food direction remains. No exact realm time ratio inferred from aging. |
| BL-S7 | Soul balance, later three-world account versus earlier paired account: [Three Worlds](https://bleach.fandom.com/wiki/Three_Worlds), Overview/Trivia search text. | Parent constraint with attributed earlier/later model; optional novel account is separately qualified, never silently included. |
| BL-S8 | Spiritual travel and message butterflies: [Bleach glossary](https://bleach.fandom.com/wiki/Glossary), Jigokuchō search text. | Guidance/passage and delivery are separate services using the same kind of entity. Transit danger/rates need their own source review. |
| BL-S9 | Device research, artificial-body support, medicine and custody: BL-L B2; BL-M `:45-48`, `:84-88`. B9 is expressly original/inferred, not a franchise fact. | Canon institution role does not prove a replicable artificial soul, universal gigai compatibility or workshop-made Bankai. Original workshops remain O. |
| BL-S10 | Fullbring training and Arrancar Resurrección: BL-L B12/B14 `:32`, `:34`, publisher volume locators. | Distinct source/development routes; object bond, origin, transformation and exact evolution rules need selected primary evidence rather than Shikai/Bankai inheritance. |

### DR1-DR8 against Bleach

| Code | Today / already solved | Default + Dial + in-world reason / missing floor |
|---|---|---|
| BL-DR1 | D P / R M; campaign `:37-57` splits places; R1. Canon seasons/day lengths for Soul Society and transit UNKNOWN in checked material. | Default separately labelled original local profiles; no Earth season inherited by soul realm. Dial per-realm cycles after source check, because parallel realms do not prove identical weather. |
| BL-DR2 | D P / R P; R5, BL-M `:80-88`. | Default realm-local money, material substrate, body support and visibility. Dial qualified devices/gigai interfaces, because a living shop and spiritual quarter cannot share every commodity or sense channel. |
| BL-DR3 | D P / R P; R6 authoring only; BL-L B7; BL-S5 law list. | Default transfer, unauthorized passage, weapon use and forbidden art check across direct/device/borrowed/queued routes. Dial selected era authority and exceptions, because technical possibility and institutional permission differ. No generic marriage-law ban without selected source/era. |
| BL-DR4 | D P / R M; packet `:58-80`; R2/R3. | Default each place gets its own frozen unsupported clock; same actor keeps one life clock. Dial sourced transit rate/duty schedule, because realm crossing is not a duplicate lifetime. Slow aging does not establish slow minutes. |
| BL-DR5 | D P / R P; interactions `:56-70`, `:88-118`; R6. No active courier route. | Default named witness account to named officer; Dial message butterfly versus living phone after qualification. Separate delivery cost, evidence and duty response, because hearing a report is not seeing the soul. |
| BL-DR6 | D P / R M; ability variants `:76-95`; R7. | Default Soul, Body and Passage page. Dial permitted self-release observations, because a bonded spirit's private knowledge is not the holder's automatic knowledge. |
| BL-DR7 | D P / R P; R5 gaps `:2423`, R6 pure readers. | Default preserve inactive-profile status and map actual body/cargo/passage bindings. Dial author-only paired balance audit, because roster recognition has no right to create a native spiritual body or travel result. |
| BL-DR8 | D P / R P; W21 `:495-521`: D 2F/12P/2M, R 9P/7M. | Default finish lived living-street floor before soul-quarter expansion. Dial qualified local services; missing K21/K22/K23/K24/K27/K28/K34 runtime remain open, because release lore cannot stand in for daily life. |

**BL-LENS (INFERRED):** Soul, Body and Passage: actual actor/body form, held versus bonded items, observed source eligibility, current realm clock, admitted passage, cargo interface and last received duty/report. Paired balance is author diagnostics unless the character has a qualified measurement; ordinary player does not see omniscient soul counts.

**BL-RISK-01 / BL-RISK-02:** proposed risk IDs, not registered secrets. Existing secret-ID allocation not established. Changed-source identity can leak through a release name, disabled cargo icon, paired balance count or unnamed spirit's tooltip. Default display only known observations; Dial later source-qualified examination. Public canon reveals are not sealed; altered/randomized truths are.

| Code | More to consider (INFERRED) | Disposition / Default + Dial + reason |
|---|---|---|
| BL-X1 | Paired-realm balance and personal resurrection are different questions. | ACCOUNT: global constraint does not auto-respawn a local actor; Dial source-qualified reincarnation lifecycle, because continuity of identity requires evidence. |
| BL-X2 | One courier can guide travel and carry news, but completing one task does not complete the other. | ACCOUNT: two receipts linked to one actor/job; Dial combined itinerary, because delivery has a recipient while passage has a traveler. |
| BL-X3 | Repairing steel cannot imply repairing the soul-bound form. | LATER: workshop receipt names repaired layer; Dial source-qualified release restoration, because BL-S3 has serious loss and exceptions. |

## W32.NA: Naruto

### Shape and existing solutions

INFERRED SW4 with SW7 exam children; SW6 describes concealed military methods rather than an invisible whole society. Parent owns original manga 1-72 snapshot/copy and shared chakra/body rules. Nation children own civil sovereignty and geography; village children own ranks, offices, mission desk and taught traditions; squad/mission children own actual team, client terms, route, reported risk and accepted windows. Academy is a local career, not the main clock for every adult/civilian.

SHOWN(repo): `docs/worlds/naruto/MODULE_CATALOGUE.md:15-25` separates architecture, bodily source, knowledge and office; `CAMPAIGN.md:33-53` already bends places around water, parts, clinics and village access; `INTERACTIONS.md:40-118` has cargo, source-control and testimony cases. `IMPLEMENTATION_PACKET.md:58-80` proposes retained body/source/cargo and a finite offer. R5/R6 are inactive authoring fragments; neither chakra nor rank is granted at entry.

### Special systems and source limits

NA-L = `docs/worlds/naruto/SOURCE_LEDGER.md`; NA-M = local `MODULE_CATALOGUE.md`.

| Code | STATED system / source | Kit bend / limits |
|---|---|---|
| NA-S1 | Chakra control, shape/nature and learned techniques: NA-L N1/N2/N14/N15 `:20-21`, `:33-34`; official manga-column locators. | Body/source, reserve, trained control and technique are independent. No generic level buys every nature. |
| NA-S2 | Clone-supported training: NA-L N2 `:21`, manga ch.319/339/341 reported by official column. | Parallel task knowledge and shared bodily cost need real carriers. Do not copy Naruto's exceptional safe scale to every actor. |
| NA-S3 | Lineage/copy faculty, implanted source and body strain: NA-L N3-N5/N12 `:22-24`, `:31`. | Observing a method cannot produce the organ, nature or trained body; exact compatibility source-gated. |
| NA-S4 | Village ranks, teams, specialist work and offices: NA-M `:25`, [Shinobi organisational system](https://naruto.fandom.com/wiki/Shinobi_Organisational_System), search text. | Issuer, scope and duty differ from combat strength. Academy graduate, genin, chunin, jonin and specialist posts must not collapse to damage tiers. |
| NA-S5 | Mission ranks and escort misclassification: [Missions](https://naruto.fandom.com/wiki/Missions), five risk/importance ranks in search text; [official anniversary column](https://naruto-official.com/en/news/01_1282), Tazuna escort becomes enemy-ninja encounter; [Land of Waves](https://naruto.fandom.com/wiki/Prologue_%E2%80%94_Land_of_Waves), D-rank/C-rank search text. | D/C/B/A/S is an assignment taxonomy, not a guarantee. Original quotes separate client fee, team pay, supplies and village share. Exact canonical fee bands and ryō conversion unverified here; no copied fan-roleplay payouts. |
| NA-S6 | Promotion exam: [Chunin Exams](https://naruto.fandom.com/wiki/Ch%C5%ABnin_Exams), era-mixed search text. | Event child owns host, phase/rules and actual promotion decision. No universal fixed dates, tournament victory promotion or annual school-year inferred. |
| NA-S7 | Medicine, rigorous taijutsu/gates: NA-L N6/N11 `:25`, `:30`. | Competence and body injury matter; source-qualified treatments, not rank healing or reversible free overdrive. |
| NA-S8 | Puppet craft and source-preserving exceptional bodies: NA-L N7 `:26`; NA-M module frame/control/payload rows. | Parts, channels, materials, pilot and living source distinct. Ordinary carpentry does not manufacture an exceptional body. |
| NA-S9 | Sealing and summoning: NA-L N8/N13 `:27`, `:32`. | Target, operator, carrier and actual cost; creature consent/contract details still incomplete. Drawing a seal grants no beast/source. |
| NA-S10 | Nations/villages and desert logistics: [Sunagakure](https://naruto.fandom.com/wiki/Sunagakure), search text: desert, sandstorms, scarce water. Campaign `:33-53` original annexes. | Regional climate and military economy; original Rain reconstruction is not a canonical reform. Full weather/calendar profiles remain unqualified. |
| NA-S11 | Sage training, tailed-beast relations and exceptional transformations: NA-L `:80` NU5 marks acquisition scenes unreviewed; NA-M `:28` preserves separate prerequisites. | SHOWN(repo) source queue, not authenticated detailed rules. Reserve separate host, partner, seal, consent and environmental-source slots as INFERRED design; no ordinary rank or copied signs grants these paths. |

### DR1-DR8 against Naruto

| Code | Today / already solved | Default + Dial + in-world reason / missing floor |
|---|---|---|
| NA-DR1 | D P / R M; campaign `:33-53`; NA-S10; R1. | Default different local profiles, sourced qualitative Sand desert only; numerical Leaf/Rain curves original. Dial dust, rain and maintenance effects, because water/parts logistics vary by region. No “always sunny” rule or Earth monsoon dates. |
| NA-DR2 | D P / R P; R5; NA-M `:19-25`, `:80-88`. | Default village money, available tools, taught methods and body eligibility local. Dial inter-village trade and credential recognition, because a headband is not a portable universal permission or free chakra grant. |
| NA-DR3 | D P / R P; R6; interactions `:72-103`. | Default mission authorization, client disclosure and method custody apply to clone/puppet/direct/tool/queued routes. Dial actual village/era jurisdiction, because changing executor does not erase client terms or supply cost. |
| NA-DR4 | D P / R M; packet `:58-80` proposes 12 present-played-minute offer, original not canon. NA-S6 dates UNKNOWN. | Default village date, accepted mission clock, separate training/project windows. Dial dispatch/exam cadence and supported clone study, because exam phases and ordinary repair days use different deadlines. No duplicate away XP from each clone. |
| NA-DR5 | D P / R P; interactions `:40-54`, `:72-103`; R6. | Default signed manifest/brief reaches named receiver. Dial runner or source-qualified messenger; client correction changes the assessment prospectively, because a bad shipment or misranked mission is not proof of a culprit. |
| NA-DR6 | D P / R M; variants `:9-43`, packet `:81`. | Default Mission Quote and Method Provenance page; Dial known promotion history, because issued rank, measured ability and copied information are separate. |
| NA-DR7 | D P / R P; R5 gap `:2079`, rule/recognition at R6. | Default mark quote/preview versus accepted commitment and actual reader. Dial author-only clone-return/cargo checks, because an inactive profile cannot create its proposed learned source or service stock. |
| NA-DR8 | D P / R P; W21 `:611-637`: D 2F/12P/2M, R 9P/7M. | Default lived river-yard floor, named allocated corner, ordinary clinic supply and safe work. Dial regional honorifics/rituals and harmless callbacks, because villagers need more than military ranks. All incomplete rows stay at W21 status. |

**NA-LENS (INFERRED):** Mission Quote and Method Provenance: issued rank/issuer, accepted quote, estimated versus observed threat, fees actually charged and paid, custody, teacher/observation basis, eligible body/source, clone/task return evidence and local clock. It does not print unknown affinities or automatically identify a suspected perpetrator.

**NA-RISK-01 / NA-RISK-02:** proposed risk IDs, no registered secret allocation established. Changed lineage/source and mission-cause slots can leak through compatibility warnings or clone logs. Default minimal known reason; Dial examination with an earned route. Permission failure must not reveal a hidden inherited method.

| Code | More to consider (INFERRED) | Disposition / Default + Dial + reason |
|---|---|---|
| NA-X1 | Client fee is not each shinobi's take-home pay. | ACCOUNT: separate invoice, desk allocation, supply expense and pay receipt; Dial authored split, because team budgets must conserve local money. |
| NA-X2 | New danger information arrives after travel cost was spent. | ACCOUNT: preserve sunk costs and offer renegotiation/withdrawal under actual terms; Dial source-qualified emergency orders, because an inaccurate brief should not silently rewrite consent. |
| NA-X3 | Several clones return overlapping evidence. | LATER: dedupe by actual observed cause, preserve differing views; Dial fatigue/training settlement when sourced, because ten copies of one report are not ten independent witnesses. |

## W32.FA: Fate

### Shape and existing solutions

INFERRED SW7 + SW6, with SW5-like ritual families but no claim that all variants share rules. Parent is one selected Fuyuki visual-novel edition/route/copy. Civilian town and hidden ritual layers share occurrence time and geography; own observers, law, services and access. War child inherits selected city's source baseline and owns participant roster, ritual revision, event graph, resources, adjudication and ending. Contract children own Master/Servant link and command history; Servant instance references heroic record and class vessel without becoming a duplicate person in every class card.

No dedicated `docs/worlds/fate/` folder found. Owners are `docs/research/power-systems/wiki-digests/DIGEST_fate-series.md:70-90` and consolidated [Fate card](cards/fate.md), especially C1/C2 continuity and authority conflicts. Already solved in docs: charges, energy, consent, bodily delivery, heroic record and summoned instance are distinguished. Runtime binding is missing in the bounded W21 inventory. Choosing the original VN default does not qualify anime or Fate/Zero novel scenes.

### Special systems and source limits

| Code | STATED source/system | Kit bend / qualification |
|---|---|---|
| FA-S1 | [TYPE-MOON original story](https://www.typemoon.com/products/fate/story/), lines 0-16 inspected: ordinary Fuyuki, hidden lethal ritual, seven Masters/Servants and named standard classes. | Event roster and contracts, not a seven-rung advancement ladder. Synopsis states premise, not a complete exception-free ruleset. |
| FA-S2 | Command Spell r404906, digest `:74`, `:86`: Fuyuki three charges per Master; specificity, energy and agreement matter; delivery can be interrupted; depleted charges do not universally end the relationship. [Revision URL](https://typemoon.fandom.com/wiki/Command_Spell?oldid=404906). | Authority charges, energy upkeep, command delivery and social loyalty separate. Not a regeneration timer or omnipotent command. |
| FA-S3 | Servant r405040, digest `:80`: heroic record supplies a copy through a class vessel, selecting a kit. [Revision URL](https://typemoon.fandom.com/wiki/Servant?oldid=405040). | K3/K4/K17 need record, instance and enabled methods; class rank/parameters are not learned player levels. |
| FA-S4 | Ritual recurrence: [Fuyuki War](https://typemoon.fandom.com/wiki/Fuyuki_Holy_Grail_War) search text says typical mana accumulation takes 60 years; [Fate/stay night](https://typemoon.fandom.com/wiki/Fate/stay_night) search text says fifth starts 10 years after fourth. | Normal interval and specific exception both retained. Do not schedule the fifth by a universal 60-year cooldown. |
| FA-S5 | [Overseer](https://typemoon.fandom.com/wiki/Overseer), search text: Church involvement/appointment depends on war generation; Moon ritual has different oversight. | Neutrality, refuge and sanction rules need exact selected source. Overseer role is not proof all factions obey every rule. |
| FA-S6 | Magic Circuits convert life force and access foundations; quality/quantity/composition and initial activation differ: retained secondary note `docs/research/power-systems/wiki-digests/full-dumps/workers/fate-full/NOTES.jsonl:1`, Magic Circuit r395092, Lead/Mechanisms, [revision](https://typemoon.fandom.com/wiki/Magic_Circuit?oldid=395092). | Circuit source, learned formula and support infrastructure separate; this note spans several works, so exact transfer/repair exceptions require edition checks. |
| FA-S7 | Upkeep through Magical Paths; supply can be controlled/refused; multiple-contract and authority/supply arrangements vary: same notes `:2`, Master r398975, Magical Paths/Multiple Masters/Servant capacity, [revision](https://typemoon.fandom.com/wiki/Master?oldid=398975). | A power provider need not own the command charges. Do not import Chaldea capacity or Moon rules into Fuyuki. |
| FA-S8 | Catalyst influence and Noble Phantasm name disclosure: same notes `:5`, Fate/stay night r401551, Story/Setting, [revision](https://typemoon.fandom.com/wiki/Fate/stay_night?oldid=401551). | Ritual selection and tactical identity information need actual source/custody and actor knowledge. The retained note also contains cross-work character material; only the named Setting section is used. |
| FA-S9 | Reality Marble/Tracing, route-specific tools and Magic Crest interfaces: same notes `:33`, Shirou Emiya r404579, Profile/Tracing/Origin of UBW/Heaven’s Feel, [revision](https://typemoon.fandom.com/wiki/Shirou_Emiya?oldid=404579). | Actor-specific exceptional methods and supply, not universal projection or inherited-world permissions. Route assets cannot be pooled into one start. No quoted numeric cost/learning formula accepted here. |
| FA-S10 | Shared experience visions and Master perspective about observed Servants: same notes `:2`, Magical Paths/Dreams and Master’s Perspective. | A sourced supernatural observation can legitimately reveal information through its discovery route. Its output format varies; no generic enemy-inspector entitlement or exact observer power assumed. |

These are retained worker paraphrases, not payload or primary verification in W32. Original civilian workshop, paid pact support, leyline schedules and command negotiation remain INFERRED. Detailed Magecraft Foundation taxonomy, boundary fields, ritual victory/refuge clauses and system-specific exceptions remain an explicit source queue. The inventory covers inspected system families, not every named franchise ability.

### DR1-DR8 against Fate

| Code | Today / already solved | Default + Dial + in-world reason / missing floor |
|---|---|---|
| FA-DR1 | D P / R M; FA-S1 places Fuyuki between sea/mountains; no numeric climate or exact war-season source checked. R1. | Default explicitly original local weather profile until selected route scene check. Dial sourced date/season, because a winter-sounding town name is not climate evidence. No merged Zero/VN war calendar. |
| FA-DR2 | D P / R M; digest `:74-90`; Fate card C2. | Default ordinary currency and life separate from upkeep/authority charges. Dial qualified magus facilities and civilian services, because cooking, a contract and ritual fuel are not interchangeable resources. |
| FA-DR3 | D P / R M; FA-S1-S3. | Default command legality/feasibility checks across spoken order, reinforcement, transfer and queued support; autonomous action stays distinct. Dial source-qualified reserve spells/overseer rulings, because spending authority must have a carrier and receipt. |
| FA-DR4 | D P / R M; FA-S4; W25 local floor. | Default one selected war's event graph plus ordinary town time; halt unsupported absence at personal commitment. Dial actual recurrence/phase pace and supported upkeep, because the contested ritual ends while the town and relationships may continue. No unconditional 14-day or 60-year universal clock. |
| FA-DR5 | D P / R M; Fate card C1/C2; W26. | Default named public incident and separately addressed ritual message. Dial source-qualified Church contact, familiar or civilian phone, because secrecy partitions audiences. Exact supernatural courier is UNKNOWN, not assumed. |
| FA-DR6 | D P / R M; digest DF1-DF3; R7. | Default Pact and War page below. Dial known personal command transcript and class information, because ritual membership does not reveal every opponent's identity. |
| FA-DR7 | D P / R M; W21 `:524-550`; no dedicated dossier/runtime owner found. | Default source → selected ritual → actual binding → action reader ledger with unsupported fields. Dial author diagnostics by route, because a franchise digest cannot activate a Master or reproduce a heroic kit. |
| FA-DR8 | D P / R M; W21 `:524-550`: D 2F/11P/3M, R 16M. | Default one civilian place's full lived layer beside the war. Dial work/home/known ritual etiquette, because a player declining combat should retain a town life. K25/K27/K33 docs missing remain open. |

**FA-LENS (INFERRED):** Pact and War: own known partner/contract, observed charges, separate energy supply, proposed order scope/cost, issued-order receipt, interruption/outcome and received public event phase. No enemy roster census or automatic True Name/counter lookup. A separately sourced Master-perspective or dream observation can produce its permitted information through an actual route and receipt (FA-S10); the read page does not manufacture it. Eligibility warning is not a future outcome guarantee.

**FA-RISK-01 / FA-RISK-02:** proposed risk IDs, not registered secrets. Changed identity/ritual rule risks include class icons, redacted participant counts, catalyst compatibility and order-success forecast. Default observer projection; Dial earned appraisal. Public VN reveals unsealed, AU/randomized truth remains sealed until its route.

| Code | More to consider (INFERRED) | Disposition / Default + Dial + reason |
|---|---|---|
| FA-X1 | War ending need not close ordinary relationship or financial obligations. | ACCOUNT: close event-scoped authority separately; Dial continuing source-qualified pact, because city life and ritual participation have different lifecycles. |
| FA-X2 | Several Servants sharing one Master do not automatically multiply charges. | ACCOUNT: charge owner is the source-qualified Master record; Dial other ritual rules only in separate cards, because DF1 explicitly distinguishes parties from charge accounts. |
| FA-X3 | A public war incident can be reported accurately with an incorrect explanation. | LATER: separate observed damage from hidden cause; Dial correction delivery, because civilian news should not become a magical truth service. |

## W32.HX: Hunter x Hunter

### Shape and existing solutions

INFERRED SW7 for Exam/arena/contest children, not the whole world; SW6 for concealed Nen. Parent owns a manga cutoff/copy, geography, actor knowledge and Nen rule qualification. Hunter Association institutional child owns credential/professional status and bylaws. Each exam year owns phases and actual access; arena owns match/floor/payout rules; Greed Island needs a later special destination card, not a save-file minigame assumption. Career and ordinary life continue between events. Root SW7's “life between contests is thin” is too broad for the local pack's field, island and research careers.

SHOWN(repo): `docs/worlds/hunter-x-hunter/SOURCE_LEDGER.md:20-31` separates principles, affinity, ability predicates/vows, exam, license, profession and game entry. `MODULE_CATALOGUE.md:9-30` maps career families; `CAMPAIGN.md:5-14` supplies four independent starts; `IMPLEMENTATION_PACKET.md:5-19` requires a real complete exam before license and permits ordinary work without Nen. These are proposals, no runtime source floor.

### Special systems and source limits

HX-L = `docs/worlds/hunter-x-hunter/SOURCE_LEDGER.md`; HX-D = local power-system digest.

| Code | STATED system / source | Kit bend / qualification |
|---|---|---|
| HX-S1 | Nen r421055: life aura, nodes, gradual/forced initiation, Ten/Zetsu/Ren/Hatsu and advanced applications; HX-L `:20-21`. | Training, capacity, reserve, fatigue and harmful initiation separate; forced opening is not safe auto-onboarding. |
| HX-S2 | Affinity categories, approximate efficiencies and Specialist categorical gate: HX-L `:22`, `:37`. | Specialist ability use/creation is not a low percentage on a generic wheel. Individual labels/transition require evidence. |
| HX-S3 | Continuous conditions, restrictions, vows and breach: HX-L `:23`; HX-D DX2 `:80`, [Nen r421055](https://hunterxhunter.fandom.com/wiki/Nen?oldid=421055). | Activation failure, paid cost and broken vow differ. Source baseline loss/risk remains qualified; additional named punishment is case-specific. |
| HX-S4 | Creator-relative semantic categories surviving theft: HX-D reviewed DX rows; local variants `:5-30`. | Transfer authority does not re-author the ability's meaning. A target label needs an actual definition and observer evidence. |
| HX-S5 | Exam phases vary and qualification is multistage: HX-L `:24`, `:26`; [Hunter Exam](https://hunterxhunter.fandom.com/wiki/Hunter_Exam), search text January 7 start / December 31 applications / variable duration. | Calendar STATED secondary, not primary authenticated. One year's preview cannot award a universal license. |
| HX-S6 | License owner/custody/privileges, no replacement, sale does not transfer rights; stars/office separate: HX-L `:25`, `:39-41`, License r405166. | Currency value, physical card, credential and Nen qualification differ. Exact legal privilege claims unqualified; no blanket immunity. |
| HX-S7 | Concealed professional Nen step and provisional exception: HX-L `:26`; [Hunter Association](https://hunterxhunter.fandom.com/wiki/Hunter_Association), search text. | Exam pass does not grant Nen; provisional exception prevents one mandatory universal ladder. |
| HX-S8 | Arena floors/money/Nen danger, Greed Island bodily entry/cards/exit, species/colony ecology, succession institutions: HX-L `:27-31`. | Separate event/world layers, real body-risk, commodity and card custody. Exact payouts, death/exit and ongoing-story cutoff remain open. |
| HX-S9 | Care/exorcism: `docs/worlds/hunter-x-hunter/MODULE_CATALOGUE.md:24`, Nen r421055 and Hunter Association Exorcist r420724. | Specialized response to a supernatural condition, not ordinary medicine or a universal vow reset; exact price/transfer rules open. |

The digest’s earlier lending/distance-retcon mapping at `:41` is an unverified lead, not a checked source contradiction. Postmortem persistence, possession and individual loan/curse mechanics need exact source rows before they become rules. No generic Nen-interest or after-death formula is inferred.

### DR1-DR8 against HxH

| Code | Today / already solved | Default + Dial + in-world reason / missing floor |
|---|---|---|
| HX-DR1 | D P / R M; campaign `:16-30` has varied contexts; no measured climate profiles in cited material. R1. | Default original local climate per place, no real-world Tokyo latitude mapping. Dial source-qualified habitat/season, because island, city and exam terrain need different texture without inventing canon geography. |
| HX-DR2 | D P / R M; HX-L `:20-31`. | Default ordinary means, license custody, Nen access and local services distinct. Dial qualified regional benefits and card rules, because selling a credential object does not sell its person's rights. Exact currency rates UNKNOWN. |
| HX-DR3 | D P / R M; HX-S2-S4; variants `:5-30`. | Default conditions checked at actual trigger and while sustained; oath breach resolved by authored rule across direct/stolen/borrowed/queued use. Dial personal semantic predicates, because a technical gate is not a broken promise. |
| HX-DR4 | D P / R M; HX-S5 and campaign `:64`; packet `:7`. | Default selected year's exam schedule plus continuing local life; unsupported absence frozen. Dial source-qualified phase cadence and supported preparation, because annual availability differs from variable test duration. No repeated same exam on reload. |
| HX-DR5 | D P / R M; interactions `:5-18`, `:20-33`. | Default actual registration/teacher/account receipt to named parties. Dial field reports and trade provenance, because license recognition, Nen disclosure and local trust use different audiences. A passed phase does not broadcast Nen proficiency. |
| HX-DR6 | D P / R M; variants `:32-43`; R7. | Default Vows and Credential page. Dial observed ability conditions and license custody history, because hidden ability predicates are not revealed by knowing the user is licensed. |
| HX-DR7 | D P / R M; packet `:45-51`; W21 `:553-579`. | Default each phase/credential/ability names producer, owner and consumer; separate public pass and concealed qualification. Dial author-only phase completeness check, because a two-phase preview must not issue a full credential. |
| HX-DR8 | D P / R M; W21 `:553-579`: D 2F/11P/3M, R 16M. | Default preparation town lived floor and useful ordinary work. Dial field/arena local texture, because Nen should deepen an existing life. Missing K25/K27/K33 docs require separate authored ownership. |

**HX-LENS (INFERRED):** Vows and Credential: self-known ability terms, trigger state, restriction performance, actual cost/receipt, license issuer/owner/custody, exam phase result, profession basis and local clock. Opponents expose only observed conditions/hypotheses. A failed trigger produces no automatic “vow broken” flag.

**HX-MW7:** `SLOT-HXH-01` through `SLOT-HXH-04` are existing proposed sealed slots, not established running secrets (`ABILITY_VARIANTS.md:38-41`, `INTERACTIONS.md:37`). Routes respectively Literacy + corroborated field report; Meditation + trained witness; Medicine + controlled comparison; Haggling + provenance audit. Status: proposed, private truth not inspected. Risk: lens filters, condition forecasts, affinity labels and credential appraisal could shortcut these routes. Keep IDs/routes/status only outside discovery.

| Code | More to consider (INFERRED) | Disposition / Default + Dial + reason |
|---|---|---|
| HX-X1 | A lost card and revoked credential need different repair routes. | ACCOUNT: custody loss preserves qualified personal status; Dial issuer's sourced procedure, because replacement and permission are not the same question. |
| HX-X2 | Successful phase history and successful full pass have different retake meaning. | ACCOUNT: separate statuses, retain HX-L S5/S6 wording; Dial selected year access, because the apparent contradiction concerns different applicants. Primary reconciliation stays open. |
| HX-X3 | A condition can depend on private creator meaning, while target evidence is uncertain. | LATER: report activation observation and hypotheses, not semantic truth; Dial controlled experiments, because an inspector should teach through play rather than reveal the answer. |

## W32.FM: Fullmetal Alchemist

### Shape and existing solutions

INFERRED SW4 for military/certification careers; regional parent world with method/infrastructure children. SW5-like continuity cards are separate source families, not mixable modules. Default manga card; Brotherhood corroboration explicitly marked; 2003 card separate. Parent owns selected continuity/copy and transmutation baseline. Amestrian regions, military office, workshop and Xingese practice cards own jurisdiction, material/energy access, staff, climate and method provenance. A Gate/exception encounter is not a universal prestige mechanism or a normal vow.

SHOWN(repo): `docs/worlds/fullmetal-alchemist/SOURCE_LEDGER.md:18-28` already separates matter, method, source, actual payer, law, bodies and climate upkeep; contradiction register `:32-38` preserves continuity/energy disagreements. `MODULE_CATALOGUE.md:6-28` maps systems; `IMPLEMENTATION_PACKET.md:5-25` selects a supervised East City materials bench with one executor and existing owners. `CAMPAIGN.md:5-14` also proposes Rush Valley; do not treat those two candidate scopes as one accepted start.

### Special systems and source limits

FM-L = `docs/worlds/fullmetal-alchemist/SOURCE_LEDGER.md`; FM-M = local `MODULE_CATALOGUE.md`.

| Code | STATED system / source | Kit bend / qualification |
|---|---|---|
| FM-S1 | Alchemy r78024, FM-L `:18`: comprehension, deconstruction, reconstruction, matter/energy, usual circle and rebound. | Exchange accounts are causal feasibility, not market-price fairness or a personal vow. Stage acquisition and trigger remain distinct. |
| FM-S2 | Prepared arrays and specialized methods: FM-L `:22-23`, Scar r77728 / Roy Mustang r77805. | Tool/inscription, understanding, materials and ignition differ; no operational numeric formula authenticated. |
| FM-S3 | Energy account disagreement: FM-L `:21`, `:34` attributes differing Alchemy/Father/Dragon's Pulse accounts. | Keep contradiction explicit and continuity bounded. Selecting an adapter is an INFERRED balance choice, not resolving the source disagreement. |
| FM-S4 | State alchemist status, research access, military obligations: FM-L `:20`; State Military r76667 / Amestris r77354. [Alchemist](https://fma.fandom.com/wiki/Alchemist), search text: major-equivalent rank, research funds and annual assessment. | Issuer/review/revocation, access and funds separate from skill. Currency/amounts and detailed jurisdiction UNKNOWN. |
| FM-S5 | Civic restriction against gold creation: same Alchemist search text; taboo and military obligations: FM-M `:11`, `:15`. | Technical feasibility, legal prohibition and metaphysical consequence are separate decisions. Exact military rule list/war exemptions need selected primary review. |
| FM-S6 | Stone reserve, contact/circle and payer: FM-L `:19`; Philosopher's Stone r78123. | Apparent exception can change the payer; no free output or universal cost function. Consent, quantities and exceptions stay qualified. |
| FM-S7 | Alkahestry, pulse sensing, infrastructure exception: FM-L `:21`, `:28`; FM-M `:12-13`, `:23-24`. | Method and world infrastructure eligibility need a separate binding. Unknown range stays unknown. |
| FM-S8 | Gate/toll/circle-free method and taboo: FM-M `:14-15`, The Gate r72998 / Edward r78039 / Taboo r62677. | Continuity-specific exceptional acquisition, not a teachable toggle or XP rank. |
| FM-S9 | Soul binding/carrier and exceptional artificial bodies: FM-L `:24`, `:27`; FM-M `:17-18`, `:26`. | Identity, bodily function, bond mark and reserve have different owners; no shared origin rule across adaptations. |
| FM-S10 | Automail fitting, upkeep, pain, growth and climate: FM-L `:25`, Automail r77396; [Buccaneer](https://fma.fandom.com/wiki/Buccaneer) search text corroborates severe Briggs cold. | Engineering/body-care loop, not a healed limb item. Exact cold thresholds/recovery distributions UNKNOWN. |
| FM-S11 | War/political aftermath and knowledge provenance: FM-L `:26-27`; FM-M `:22`, `:27-28`. | Accounts, civilian trust, state authority and source history differ. 2003 versus manga causal accounts remain separate. |

### DR1-DR8 against FMA

| Code | Today / already solved | Default + Dial + in-world reason / missing floor |
|---|---|---|
| FM-DR1 | D P / R M; FM-L `:25` qualitative heat/cold/oil/pain; FM-S10 Briggs cold; R1. | Default local weather texture and supported maintenance, numerics original. Dial region/body/weather sensitivity, because automail weather consequences are not universal human damage or a hunger-death rule. |
| FM-DR2 | D P / R M; FM-L `:18-28`, packet `:15-25`. | Default local material, compatible method and declared payer; no global magic resource substitute. Dial source-qualified regional infrastructure/alkahestry, because availability can depend on how a method draws support. |
| FM-DR3 | D P / R M; FM-S1/S4/S5. | Default matter/method feasibility across circle/tattoo/tool/exception/queued craft, then jurisdiction and actual witnesses. Dial source-qualified office/war orders, because forbidden gold is not physically impossible and taboo is not merely a fine. |
| FM-DR4 | D P / R M; annual review is a secondary-source institutional event, not a generic yearly grant; FM-S4; packet `:15-25`. | Default operation stages, workshop commitments, care windows and selected institutional review calendar. Dial sourced recovery/annual review schedule, because a shop repair and long bodily rehabilitation have different clocks. No fixed recovery imposed from an average wiki example. |
| FM-DR5 | D P / R M; campaign `:9-14`, interactions `:18`; W26. | Default actual bench record/receipt with custody sent to a named reviewer. Dial military chain/clinic account and appeal, because certification funding and civilian trust can respond differently to the same reported work. |
| FM-DR6 | D P / R M; packet `:15-37`; R7. | Default Material, Method and Payer page. Dial earned inspection/known institutional review, because output cannot explain its cost by itself. |
| FM-DR7 | D P / R M; packet `:15-25`, `:39-41`. | Default material identity → acquired method → single executor → consumed input/output → learned result reader. Dial author-only continuity/infrastructure audit, because a cost preview is not an actual transmutation. |
| FM-DR8 | D P / R M; W21 `:582-608`: D 1F/12P/3M, R 16M. | Default one East City bench's lived floor and daily work; Rush Valley remains a separate candidate. Dial workshop voice/healthcare/repair ritual, because prose about automail does not establish a working body-care consumer. K25/K27/K33 docs missing stay open. |

**FM-LENS (INFERRED):** Material, Method and Payer: known sample composition/confidence, held matter, learned stages, prepared tool, supported energy input, actual declared payer, committed input/output and observed rebound/care result. Ordinary view exposes only entitled accounting, not hidden infrastructure or private reserve totals. A source conflict is attributed evidence, not a hidden-answer tooltip.

**FM-RISK-01 / FM-RISK-02:** proposed risk IDs only; registered secret IDs not established by this read. Altered source/payer/body truth may leak through exact cost forecasts, climate pain text, recipe compatibility or a supposedly empty reserve. Default only observed supported effects; Dial earned diagnostic routes. Do not open or summarize sealed payload to settle a source ambiguity.

| Code | More to consider (INFERRED) | Disposition / Default + Dial + reason |
|---|---|---|
| FM-X1 | Output conservation can pass while its payer is wrong. | ACCOUNT: verify matter and actual energy/custody together; Dial authored uncertainty before appraisal, because a visible material receipt alone can conceal an unrecorded cost. |
| FM-X2 | State funding is an accountable institution budget, not personal spendable gold. | LATER: separate grant restrictions, report receipt and renewed access; Dial selected source review procedure, because office benefits do not grant unrestricted private money. |
| FM-X3 | Weather derives may be recomputed, but damaged parts and missed fitting appointments are history. | ACCOUNT: effects save with cause/time/part identity; Dial recovery options, because a reload must not undo an earned repair or repeatedly apply pain/injury. |

## W32.C: contradictions and unresolved source choices

| Code | Side A / side B | Default + Dial + treatment (INFERRED) |
|---|---|---|
| W32-C1 | JJK early brief MEMORY universal-looking domain/vow examples / newer ledger qualified exceptions. | Default latest bounded local ledger; Dial selected sourced case, retain old brainstorm as history. No mutual-sanction formula or universal sure-hit. |
| W32-C2 | Bleach/Naruto digest `blocked_no_revision` / separately inspected official local ledger. | Default cite each evidence channel independently; Dial later primary scene audit. Neither failure invalidates official facts nor authenticates unverified digest mappings. |
| W32-C3 | Bleach early paired balance / later three-world account and separately qualified novel cosmology. | Default selected manga era's stated model; Dial explicit later source card. Reserve later child shape; no novel borrowing or exactly-two-realms claim. |
| W32-C4 | Root SW4 school calendar / JJK missions and Naruto civilians/office schedules. | Default institution calendar only for its participants; Dial interruptions and independent careers. No invented universal school terms. |
| W32-C5 | Fate normal 60-year accumulation / fifth war early after 10 years. | Default selected war actual sequence; Dial other war cards. Both wiki statements stay attributed; exact calendar/season primary check open. |
| W32-C6 | HxH third-phase next-year access / full license holder no-retake; Nen completion / provisional exception. | Default separate phase-pass, full pass, license custody and professional state. Dial selected scenario/bylaw after primary review; no blanket retake or mandatory single ladder. |
| W32-C7 | FMA Alchemy/Father energy descriptions / attributed pulse theory / different 2003 mechanics. | Default preserve source conflict and separate continuities. Dial selected qualified adapter; proposal never presented as final canon resolution. No secret truth disclosed. |
| W32-C8 | W21 partial inactive Bleach/Naruto source / general claim anime runtime missing. | Default preserve partial authoring credit and explicit null native bindings. Dial later source-bound activation only after its own gates; no readiness regression or upgrade inferred. |

## More to consider, other stuff

These extend MW/MC rather than replacing K parts. They are gaps in the root's world-specific treatment, not claims that no sibling has considered them.

| Code | Cross-world angle | Default + Dial + in-world reason / disposition |
|---|---|---|
| W32-X1 | **Authority has several issuers and accounts.** Grade, village rank, squad post, Hunter credential, state certificate and command charge need different issue/revoke/spend rules. | ACCOUNT: local units plus issuer/jurisdiction/holder/custody/status and cause. Dial recognition across institutions, because one cannot exchange a grade for authority charges. Fits MW5 without a universal rating currency. |
| W32-X2 | **Rule overlays are not extra worlds.** Curtain/domain, exam phase, mission and pact add scope without duplicating actor, clock or inventory. | ACCOUNT: parent/copy + local scope + amendments + expiry and precedence. Dial actual pocket realm with evidence, because temporary rules should not secretly create a second life. |
| W32-X3 | **Topology and jurisdiction differ.** Bleach realm edge, Naruto border, hidden JJK/Fate layer and Nen knowledge boundary are not the same kind of door. | ACCOUNT: named passage/sense/contact/permission checks; Dial qualified shortcuts. Geography alone cannot decide who can perceive, legally enter or act. |
| W32-X4 | **Forecast precision can disclose a secret.** A correct “cannot target this actor” warning can expose a changed source; unknown cost can expose a hidden payer. | ACCOUNT: forecast uses known evidence; essential warning remains plain but minimal. Dial paid measurement as separate commitment/receipt. Author diagnostics stay separate from ordinary DOM/search/export. |
| W32-X5 | **Event completion is not whole-life completion.** War, exam, mission and annual assessment end while money, duties, bodies and relationships continue. | ACCOUNT: close only event-scoped rights and leases. Dial source-qualified continuing pact/office/career, because the same person's ordinary life persists. |
| W32-X6 | **Rating error is playable institutional information.** A curse grade or mission rank can be wrong without changing actual danger. | LATER: estimate → evidence → correction → new terms, with prior receipt preserved. Dial institution's response, because a fixed real threat should not scale down to make a bad brief true. |
| W32-X7 | **Multiplication must conserve meaning and cost.** Clones, summons, class instances and soul partners cannot multiply shared receipts, credentials or time credit. | ACCOUNT: origin/actual actor/source/task/cause IDs; Dial source-qualified independent agents. Duplicate reports differ from independent observations. |
| W32-X8 | **Climate acts on interfaces.** Curtain sky, spiritual substrate, dust in puppet joints and automail oil are different channels. | ACCOUNT: local physical weather separate from appearance and body/item effect eligibility. Dial selected sourced effects; save consequences with cause IDs. No universal cold multiplier across all six. |

### Three ranked suggestions

1. **W32-A1: finish six source-and-shape headers before generic adapters.** Root/card owners fold the selected continuity, nesting, currency/rank issuer and contradiction rows. First material source gate: Fate exact route/ritual, Naruto fee/calendar qualification, and FMA law/energy scope. Done: each selected slice has attributed special systems and UNKNOWNs, without treating secondary summaries as primary text.
2. **W32-A2: use the existing JJK curtain packet as the first later law-and-observer proof.** Keep its small scope, then route twin-action checks and named report receipt through W24/W26 and existing boundary/knowledge owners. Done after separate authorization: one ordinary desktop journey with allowed/blocked paths, refusal, useful evidence and exact persistence. Domains, six-world rollout and new prestige remain deferred.
3. **W32-A3: add one scoped page per selected world to W27's shared inspector plan.** Start with each proposed lens above and R5/R6's honest inactive status. Done: permitted values name owner, cause and as-of clock; missing readers stay visible only in author mode; secret route review passes. Built/browser proof is required only when an implementation is authorized, not for this design delivery.
