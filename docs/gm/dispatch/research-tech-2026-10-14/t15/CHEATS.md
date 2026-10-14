# T15: comic revealer cards

2026-10-14. Original design proposals, not accepted cards or implemented gameplay. Franchise names below are research references. Public names, fiction and mechanics are original. These extend RC1-RC15 rather than replace them. [Evidence rules and CW audit](GENIUS_AND_STATUS_QUO.md) and [per-world dossiers](REPORT.md#coverage) own source scope.

## RC16-RC23 inspiration audit

| T15 code / owner | Verified inspiration and source | Correction / boundary |
|---|---|---|
| M29 / RC16 | [Cerebro, Marvel Database on Fandom](https://marvel.fandom.com/wiki/Cerebro_%28Mutant_Detector%29), stated: mutant-signature detection and telepathic amplification; later versions add functions. | Not all powered beings or a general combat rank. Amplifier, operator qualification and masking vary by version. “Strong minds always notice” was not verified; scan detectability is a selected original rule. |
| M30 / RC17 | [Mother Box, DC Database on Fandom](https://dc.fandom.com/wiki/Mother_Box), stated: New God knowledge, sensing, communication and Source-related functions including transport. | A universal shortest roadmap to any goal is not established by these extracts. Emotional/tone communication and loyalty fit the proposed sibling; precise native speech and every feat were not issue-verified. Do not impose one fandom-listed daily restriction as a universal solo-player limit. |
| M31 / RC18 | [Official Brainiac](https://www.dc.com/characters/brainiac) states a drive to monopolize knowledge; [official Kandor account](https://www.dc.com/blog/2025/07/01/krypton-unclassified-everything-you-need-to-know-about-superman-s-homeworld) identifies city capture in *Action Comics #242*. | Scanning is not proof of knowing every inaccessible/private fact, and preservation can be violent appropriation. Guaranteed scan notification is an original choice, not a verified universal Brainiac rule. |
| M32 / RC19 | [Official Oracle history](https://www.dc.com/blog/2025/03/05/in-what-comic-did-barbara-gordon-officially-become-oracle) and [Barbara profile](https://www.dc.com/characters/batgirl), stated: information brokerage and computer expertise. | Information comes through access, skill and people. Knowing a useful contact is not automatically reading their mind or owning their records. |
| M33 / RC20 | [Official Watcher guide](https://www.marvel.com/comics/guides/2196/when-the-watcher-does-more-than-watch), stated: cosmic observation, non-interference oath and repeated violations with institutional consequences. | The guide is not proof of literal simultaneous knowledge of absolutely every event; [Trial of the Watcher #1](https://www.marvel.com/comics/issue/99052/read) even describes an avoided observation. Non-interference is an oath, not physical inability to act. |
| M34 / RC21 | [Official Scarlet Spider](https://www.marvel.com/characters/scarlet-spider-ben-reilly), stated: imminent-danger warning with severity, not exact nature; Peter's symbiote history differs from Ben's. | Warning does not guarantee speed or space to evade. Blind spots depend on holder and era. A fixed warning interval or all-purpose enemy identifier is unsupported. |
| M35 / RC22 | [J.A.R.V.I.S., MCU, Fandom](https://marvel.fandom.com/wiki/Just_A_Rather_Very_Intelligent_System_%28Earth-199999%29) states interface and hardware limits; [comics AI, Fandom](https://marvel.fandom.com/wiki/Just_Another_Rather_Very_Intelligent_System_%28Earth-616%29) identifies Pepper's Rescue assistant and independent behavior. | Edwin Jarvis the human is distinct. Connection-limited diagnosis is a good original scope, not proof that the MCU AI can never access external networks. Technical planning remains bounded by held models and readings. |
| M36 / RC23 | [Official Tower of Babel](https://www.dc.com/blog/2016/09/15/out-from-the-shadows-five-hidden-batman-stories), stated: researched countermeasures stolen and used against the League in *JLA #43-46*. | A countermeasure needs means and circumstances. Having a file does not establish automatic victory, complete knowledge or current applicability. |

## Card contract and common presentation

Each card below records the ten current top-level fields read in `src/cheat_cards.js:1-42`: id, family, name, ui, terms, hooks, state, stages, observers, sources. Backing, scope, holders, home/outside behavior, loop, dials, forms and interactions follow the broader [library fields](../../../../CHEAT_LIBRARY.md#what-a-library-card-holds). These are Markdown design cards, not validator-tested JSON. Hook names are proposed integration events, not claims that handlers exist. T14 owns JSON validation work.

All cards: acquisition is reachable through an authored origin, teacher, trade, inheritance or event. No universal once-only use limit. Inspection previews do not spend or reroll. Committed reveals keep provenance, acquisition time and world revision. Wrong conclusions are permitted only where the actual means has that limitation; an explicitly perfect truth faculty can genuinely be perfect within its stated domain. Loss of a device removes access to its live feed, not earned notes or the player's save. Cross-world use requires an actual carrier and compatible substrate. New handlers, compatibility and publication gates stay open.

Presentation proposal: reuse existing desktop panels at 1366×768, put subject, as-of, supported conclusion and next useful action together; mobile deferred. A sensory form can be quiet or a companion voice. Sealed truths appear only through their authored discovery route; a generic census or report cannot dump sealed author data. If a future world genuinely grants a broader discovery power, qualify that route rather than silently nerf it.

## M29 / RC16: Resonance Census

- **Identity:** `id: t15-resonance-census`; `family: analysis`; `name: Resonance Census`; `ui: appraisal-lens`; `terms: bound-item`. Backing: an original resonator array. Scope: only named, detectable signature families in its calibrated region. Holder can be player, operator NPC, rival institution or station custodian.
- **Loop / grants:** tune, scan, compare and investigate. Uses array power, calibration samples and operator attention; returns signal locations/uncertainty and a reachable follow-up investigation. No automatic species, identity, morality or fighting rank.
- **Hooks / state:** proposed onObserve/onAction consumers; state holds array ID, calibration revision, detected channel, masks actually encountered and saved observations. No hidden target list exposed merely by opening a panel.
- **Stages / dials:** isolated signal, useful discrimination, coordinated arrays. Growth can expand supported range and domain through real amplifiers/teachers. The original world may make scans conspicuous, quiet or selectively detectable; exact minds noticing is not a universal penalty.
- **Observers / interactions / forms:** qualified operators and authored counter-sensors can detect operation. Shielding, alternate bodies and mimicry interact through actual signatures. Forms: radio-like survey rack, a sensory bloodline, bonded listening crystals. Outside behavior follows local signal physics.
- **Sources / fit:** stated Cerebro source above; original mechanics inferred. Strong fit for Census Winter/M41 or Changed Commons/M47. Worm/M42 needs a locally supported signature; The Boys/M59 needs an authored measurable biotech marker. No census score from PRT threat ratings. First activity: scan, locate a signal, then establish what caused it through a separate means.

## M30 / RC17: Hearth Compass

- **Identity:** `id: t15-hearth-compass`; `family: companion`; `name: Hearth Compass`; `ui: companion-voice`; `terms: bound-item`. A sapient travel relic knows a bounded tradition and some routes. Player, NPC, item or shrine can hold the relationship; possession does not guarantee cooperation.
- **Loop / grants:** ask, interpret, test, bargain and travel. It suggests a known path or offers a supported doorway; transport is a separate granted function with destination, payload and return policy.
- **Hooks / state:** proposed onAction/onTravel; state stores trust/history, archive revision, proposed route, actually opened door and energy/support conditions. A rejected route stays distinguishable from a failed experiment.
- **Stages / dials:** comfort signals, explicit alternatives, cooperative route construction. Growth can improve communication and knowledge. Goals outside its archive return an honest gap; no compulsory riddle after the relationship earns clear answers.
- **Observers / interactions / forms:** it can choose to speak, and sensors can detect the physical effect if supported. Forms: humming brooch, house spirit, bonded navigation cube. Lying patrons and imported physics are questions to test. Energy, consent and compatible endpoints are local limits rather than a fixed daily quota.
- **Sources / fit:** Mother Box is stated inspiration; reliable goal planning is our original extension of RC2/RC15. Fits Lantern Bureau/M60, Ash Covenant/M63 or Spliced Realm/M52 with explicit relic origins. Worm/M42 requires an original Thinker/import premise; Watchmen/M61 needs an explicitly exceptional origin. First activity: follow one useful clue and compare its prediction with the result.

## M31 / RC18: Survey Seed

- **Identity:** `id: t15-survey-seed`; `family: archive`; `name: Survey Seed`; `ui: appraisal-lens`; `terms: bound-item`. Backing: a growing original archive device. Scope: channels and places actually surveyed, plus supported inherited records. Holder can be a library, player, drone or collecting rival.
- **Loop / grants:** survey, date, index, compare and publish. Produces a local history/material map that can identify a repairer or revise a project. Collection and physical preservation are separately granted verbs; no implicit kidnapping power.
- **Hooks / state:** proposed onObserve/onTravel; stores subject/channel, coverage gaps, world revision, timestamp and retained specimens under actual custody. Blind rooms stay unknown unless another means reaches them.
- **Stages / dials:** surface catalog, cross-referenced survey, portable archive. Better sensors expand coverage; memory or storage capacity can grow through supported means. A complete truthful scan can remain complete for that captured state while later changes require new evidence.
- **Observers / interactions / forms:** authored scan emissions can be observed or disguised; guaranteed target notice is not mandatory. Forms: survey drone, crystalline library seed, recording familiar. Masked data, censorship and fabricated records remain distinct from direct measurements. Outside records retain origin and as-of rather than silently becoming local truth.
- **Sources / fit:** Brainiac knowledge collection is stated; benign scoped archive is original. Fits Trophy Counties/M44, Edited Century/M49 and Spliced Realm/M52. Early Battleworld cannot assume later Iso-8. First activity: compare an old survey with one newly observed changed function, then revise the relevant repair plan.

## M32 / RC19: Switchyard Desk

- **Identity:** `id: t15-switchyard-desk`; `family: information-network`; `name: Switchyard Desk`; `ui: status-window`; `terms: gift`. Backing: an original information service and real contacts. The gift grants a usable desk/access, not ownership of every participant. Player, NPC coordinator, household or faction can operate it.
- **Loop / grants:** ask, introduce, corroborate, compensate and share. Contact knowledge opens a teacher, supplier or investigation route. Resources are actual favors, money, network access and relationships; listening is not a compulsory paid meter.
- **Hooks / state:** proposed onObserve/onAction; stores contact-owned reports, permissions, as-of, confidence and which sources are independent. A repeat of one rumor is not independent corroboration.
- **Stages / dials:** known contacts, specialist directory, coordinated distributed research. Growth comes from relationships and infrastructure. Broken communications pause affected reports, not unrelated work. A genuinely comprehensive cooperative network can solve broad questions within its access.
- **Observers / interactions / forms:** contacts know requests made to them; interception requires real access. Forms: switchboard, courier familiar network, licensed archive desk. Mind-reading, hacking and social consent have distinct sources and observer consequences. Outside a world, the desk needs communication or a carried archive.
- **Sources / fit:** Oracle is stated inspiration; “who knows what” routing extends KM/SS. Fits all civic targets, especially Worm/M42, Company Century/M48, Lantern Bureau/M60 and Watchmen/M61. First activity: request two real reports, resolve a contradiction and reach one qualified repair service.

## M33 / RC20: Horizon Witness

- **Identity:** `id: t15-horizon-witness`; `family: remote-observation`; `name: Horizon Witness`; `ui: appraisal-lens`; `terms: leash`. Backing: an original observing order. Its oath governs intervention; actual perceptual jurisdiction is declared separately. Player, watcher NPC, tower or sworn item can hold it.
- **Loop / grants:** choose a supported vantage, observe, record, interpret and decide whether to intervene. Resources are actual attention/infrastructure where required; a powerful order can grant broad observation outright. Knowledge does not itself move a rescue team.
- **Hooks / state:** proposed onObserve/onAction; stores jurisdiction, witnessed events, oath wording, institutional standing and actual interventions. Record a breach because an action violates a stated term, not because the player clicked a menu.
- **Stages / dials:** local horizon, several authored worlds, broader jurisdiction when legitimately granted. Oath penalties can involve loss of office or trust; do not pretend an oath physically prevents every action. Breaking, renegotiating or leaving are reachable original routes with stated effects.
- **Observers / interactions / forms:** counter-watchers can notice only with held means. Forms: observatory office, bonded horizon glass, patron-granted sense. A remotely read event has an as-of and viewpoint; a carried memory can survive local history revision under its carrier contract.
- **Sources / fit:** Watcher guide supplies stated oath/violations, not literal all-event omniscience. Best as an original cosmic variant of M52 or M53, not a normal Watchmen civilian tool. First activity: observe a threatened service, decide whether to warn someone and see the oath institution respond to that specific action.

## M34 / RC21: Nearfall Pulse

- **Identity:** `id: t15-nearfall-pulse`; `family: danger-sense`; `name: Nearfall Pulse`; `ui: quiet`; `terms: gift`. Backing: an original precognitive faculty or bonded warning organ. Scope declares threat kind, distance and warning horizon. Player, NPC, creature or held item can receive it.
- **Loop / grants:** sense, prepare, evade or protect. A warning produces direction/urgency within its actual ability, not an unknown assailant’s name. Evasion still uses the actor’s body, route and equipment.
- **Hooks / state:** proposed before-action/observation consumer; stores received warnings and outcomes when meaningful, not all unseen future branches. A save reload does not reroll the already committed threat.
- **Stages / dials:** immediate alarm, clearer direction, trained interpretation. Particular blind spots are authored properties, not arbitrary random failure. Improved means can remove them; ordinary tests cannot infer a complete safe future from one quiet moment.
- **Observers / interactions / forms:** reflexive movement can be observed; the private sensation needs an actual sensing means. Forms: bodily pulse, a warning familiar, suit-linked precursor sensor. Biological forewarning and predictive telemetry are distinct variants. Crossing preserves only the mechanism its carrier really supports.
- **Sources / fit:** Scarlet Spider supplies stated inspiration, with holder-specific symbiote distinction; warning horizons here are original. Fits Silk District/M50, Survey City/M40 or a qualified Threaded Coast/M42 Thinker. In Watchmen/M61 it requires an exceptional original premise. First activity: notice a failing tool’s warning and move clear without being handed its full failure explanation.

## M35 / RC22: Benchmate

- **Identity:** `id: t15-benchmate`; `family: analysis-companion`; `name: Benchmate`; `ui: companion-voice`; `terms: bound-item`. Backing: an original diagnostic intelligence resident in a device. Scope includes connected telemetry, held manuals and its own qualified models. Player, mechanic NPC, suit or workshop can host it.
- **Loop / grants:** inspect, compare, simulate, propose and authorize work. It names a supported bottleneck and suggests a repair or experiment. Computation, sensors, power and spares are resources only where actually needed.
- **Hooks / state:** proposed onObserve/onAction; stores host identity, actual connections, model revision, uncertainty, pending suggestions and authorized jobs. A simulation result is a prediction receipt, not a real repair completion.
- **Stages / dials:** fault description, component diagnosis, useful project delegation. Knowledge grows through manuals and tests; an imported model may need local retesting. Genuine broad access can expand its scope. No automatic “AI turns evil” drawback is required.
- **Observers / interactions / forms:** speech, telemetry and network traffic may be observed through real means. Forms: visor voice, bench terminal, sapient tool spirit. It can have preferences, but autonomous spending stays within the selected work policy. Outside operation needs compatible host/substrate rather than franchise-brand electronics.
- **Sources / fit:** MCU and Rescue J.A.R.V.I.S. are distinct stated references; original design extends RC15. Fits Survey City/M40, Company Century/M48 and Umbra Household/M62. A living suit in Ash Covenant/M63 needs its own agency contract. First activity: find one real stalled repair, obtain a compatible part and verify the changed tool function.

## M36 / RC23: Countercase Ledger

- **Identity:** `id: t15-countercase-ledger`; `family: research-appraisal`; `name: Countercase Ledger`; `ui: appraisal-lens`; `terms: bound-item`. Backing: an original analysis notebook with bounded inference or a genuine declared weakness-reading faculty. Player, NPC rival, archive or organization can own it.
- **Loop / grants:** observe, hypothesize, test, prepare, redact and share. Maps a observed function to a supported counter-function, including defense, evacuation or negotiation. Finding a weak point does not grant the force to exploit it.
- **Hooks / state:** proposed onObserve/onAction; stores subject identity/version, circumstances, receipts, confidence, required means and access history. A new body or modified suit may make an old plan obsolete, with old evidence preserved.
- **Stages / dials:** incident record, tested preparation, conditional comparison. Growth may grant stronger inference through actual talent; perfect weakness sight is a distinct variant, not a fictional research result. No fixed “met once therefore exact progress” rule from RC10.
- **Observers / interactions / forms:** theft needs actual custody/access; public sharing changes who knows the plan. Forms: encrypted notebook, detective familiar, martial memory discipline. Consent, trust and legal consequences depend on the world. Outside files retain their original subject and context.
- **Sources / fit:** Tower of Babel is stated inspiration; counter-graph is original. Fits Census Winter/M41, Survey City/M40, Branded Champions/M59 and Legacy Summer/M53. First activity: study a known recurring equipment fault, prepare a supported defensive response and record whether it worked under those conditions. Dangerous counters remain abstract fictional actions.

## Additional comic revealers

These are useful additions to the RC families, not independent parallel knowledge systems.

### M64: Handprint Echo, an RC6 psychometry variant

`id: t15-handprint-echo`; `family: psychometry`; `name: Handprint Echo`; `ui: appraisal-lens`; `terms: gift`. Backing: original trace-reading faculty. Holders: player, NPC, familiar or relic. **Stated inspiration:** [Longshot, Marvel Database on Fandom](https://marvel.fandom.com/wiki/Longshot_%28Mojoverse%29) describes reading imprints on touched objects. This does not establish every proposed reconstruction below.

Loop/grants: touch, distinguish, date approximately and compare with records. Resources: contact with the real object and interpretation where needed. Forms: finger-sense, bonded glove, a memory-eating familiar. Scope is an authored class of retained traces; a weak form blurs old handling while a genuinely exact form can resolve it. Neither form automatically reads the subject’s current location.

Hooks: proposed onObserve/onAction. State: object instance, trace channel, as-of, observed fragment, interpretation and confidence. Stages: recent touch, distinguish several handlers, correlate a place when the faculty genuinely reaches it. Observers: touched objects can show handling; other people require a real sensing channel to detect the power. Interactions: forging a paper certificate differs from forging a psychic trace; each has its own counter-means. Outside behavior follows trace substrate/carrier.

Fit: Trophy Counties/M44 and Lantern Bureau/M60 suit provenance play; a native Worm/M42 form needs its own qualified power. Consumer: identify who can repair a found tool through a real remembered connection. No sealed truth outside a qualified route.

### M65: Echo Workshop, an RC3 nonvisual observation variant

`id: t15-echo-workshop`; `family: sensory-analysis`; `name: Echo Workshop`; `ui: appraisal-lens`; `terms: gift`. Backing: original spatial/sensory faculty. Holders: player, NPC or creature. **Stated inspiration:** [Marvel’s Daredevil origin summary](https://www.marvel.com/comics/issue/126142/daredevil_1_facsimile_edition_2025_1) identifies enhanced senses and radar; [Daredevil #187](https://www.marvel.com/comics/issue/8170/daredevil_1964_187) describes debilitating sensory intensity. Exact workshop precision is our invention.

Loop/grants: listen, compare, isolate a signal and inspect. Forms: innate sense, a tuned listening instrument, an echolocating familiar. Read supported geometry/vibration, never unseen text merely because it lies in range. Noise sensitivity is a local dial; stronger discrimination can genuinely overcome it. Physical manipulation skill remains independent.

Hooks: proposed onObserve. State: channel calibration, supported sample observations and confidence. Stages: rough form, distinguish a repeated fault, finer localization. Observers: active emitted signals are detectable where present; a passive sense does not have to broadcast. Interactions: hush fields, unfamiliar material and alternate sensory bodies only affect the channel they actually change. Cross-world use retests changed acoustics.

Fit: Census Winter/M41 field inspection, Silk District/M50 and an original urban bureau. Consumer: locate one relevant rattle and request/perform its supported repair. It creates a nonvisual route to the same fact, not a second truth database.

### M66: Seam Finder, a stronger RC23/RC9 variant

`id: t15-seam-finder`; `family: flaw-sight`; `name: Seam Finder`; `ui: appraisal-lens`; `terms: matured`. Backing: original discerning discipline; earned acquisition can also come through a fitting grant. Holders: player, NPC, bonded instrument. **Stated inspiration:** [Karnak #1, official Marvel](https://www.marvel.com/comics/issue/54754/karnak_2015_1) presents structural, social and personal flaw perception. This is more than ordinary statistical evidence; do not turn the genuine fictional faculty into merely a novice guess.

Loop/grants: attend, discern a supported vulnerability, choose repair or counter-use, then act through held means. Forms: martial insight, a fault-revealing monocle, a sapient measuring tool. Scope declares which systems are actually legible; seeing a true weak link does not supply materials or authority to change it.

Hooks: proposed onObserve/onAction. State: subject revision, discerned relation and subsequent outcome. Stages: physical joins, interacting processes, institutional dependencies if the original backing supports them. Observers: faculty use can be quiet; observers infer it through behavior or a qualified counter-sense. Interactions: M36 can retain its findings, while M35 checks whether a proposed repair will work. Outside scope follows the actual discernment law.

Fit: Legacy Summer/M53 capacity failure, Company Century/M48 supply dependency, or original cultivation worlds. Consumer: strengthen one true failed link and change an actual service. No automatic destructive intent or universal flaw-free immunity.

### M67: Openword Cord, a testimony-reveal variant

`id: t15-openword-cord`; `family: truth-binding`; `name: Openword Cord`; `ui: companion-voice`; `terms: bound-item`. Backing: an original covenant relic. Holders: player, NPC, institution or item keeper. **Stated inspiration:** [DC’s Spirit of Truth description](https://www.dc.com/graphic-novels/the-worlds-greatest-super-heroes-2005/wonder-woman-spirit-of-truth) associates the lasso with exposing falsehood; [DC’s weapons account](https://www.dc.com/blog/2024/03/28/six-wild-dc-weapons-wielded-by-women) explicitly notes different eras/origins.

Loop/grants: establish the original binding’s terms, ask a question, hear truthful testimony and choose an action. Forms: cord, sworn hearing place, oath-speaking familiar. Our basic version reveals sincerely held knowledge, leaving ignorance visible. A stronger world variant can reveal objective truth when its backing genuinely does so. The basic limit is an original choice, not a universal claim about Wonder Woman’s lasso.

Hooks: proposed onAction/onObserve. State: bound subject, declared query domain, actual answer, receipt and release. Stages: expose deliberate falsehood, separate uncertainty, stronger revelation if supported. Observers: participants witness the binding; magical detection needs a channel. Interactions: testimony and independently verified facts remain distinct; legal authority and trust do not follow from truth. Outside use needs the covenant’s compatible law.

Fit: Open Matriarchate/M56 or Benevolent Directorate/M51 hearings, and Lantern Bureau/M60 relic cases. Consumer: resolve one disputed custody claim, then choose return, compensation or further inquiry through available means. Coercion and consent have world-specific consequences, not an unsolicited universal prohibition.
