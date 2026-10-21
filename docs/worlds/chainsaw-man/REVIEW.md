# World pack review: Chainsaw Man

Reviewer: Claude (independent of the Codex reader and synthesis lanes), 2026-10-13. Method: [REVIEW_TEMPLATE](../../gm/dispatch/wiki-lanes-2026-10-13/REVIEW_TEMPLATE.md). Read every file in this folder, the [SPOTCHECK_1](../../gm/dispatch/wiki-lanes-2026-10-13/SPOTCHECK_1.md) CSM section, the lane's [ERRATA](../../research/power-systems/wiki-digests/full-dumps/workers/csm-full/ERRATA.md), and the relevant `NOTES.jsonl` rows. Every claim below was checked against the private payload named by `read_file` in `chainsaw-man_SOURCES.json` or `chainsaw-man_SUPPLEMENT_SCOPE.json`, not against the notes alone. Locators use the form `Title rev, @character offset in the payload text`. For "Devil" the offsets refer to the 29,682-character restored full page (the supplement row). No pack file was edited.

## Verdict: usable with fixes

The pack is honest, carefully labelled and mostly right. Every engine rule traces to a real payload statement, the conflict register holds up, and nothing sealed or over-quoted leaks. Two core-law rows overstate the source, though. One is the Primal Fear "no-reincarnation property". The other narrows positive emotion to "Chainsaw specifically". Both would end up in the schema as written. The contract model also leaves out stated sacrifice-eligibility rules that it needs. These are wording and schema fixes, not a rework.

## Checked claims

| # | Claim | File | Verdict | Evidence locator |
|---|---|---|---|---|
| 1 | Devil strength follows concept fear in the popular imagination, not the concept itself | SYNTHESIS §2 row 1 | Supported | Devil r25098 @1445 to @2200 (Car Devil and Blood Devil examples) |
| 2 | Public regard can have counter-effects | SYNTHESIS §2 row 1 | Supported | Devil r25098, Weaknesses / Positive Emotions (@26951): mass love or admiration weakens a Devil |
| 3 | Public admiration "may weaken Chainsaw specifically" | INTERACTIONS IX1, MODULE_CATALOGUE M1 | **Overstated (narrowed)** | Same section states it as a general Devil weakness. Chainsaw is one case, not the scope |
| 4 | Ordinary death (Hell/Earth cycle with memory reset) and concept erasure are distinct | SYNTHESIS §2 row 2 | Supported | Devil r25098 @2203, @24692 to @25171 (reincarnation, reset, forgotten concept); @15293 (Chainsaw consumption erases the concept) |
| 5 | Primal Fear Devils are "an exception to ordinary reincarnation", modelled as an "explicit no-reincarnation property"; ledger adds "believed unable to die" | SYNTHESIS §2 row 3, SOURCE_LEDGER, GM_PROMPT | **Overstated** | Devil r25098 @12008: they have *never gone through* the cycle because of their power, and keep the same identities. The page gives no rule that they cannot reincarnate if killed. "Unable to die" appears only as War's claim about Falling (@12763: humanity has no means to kill her now), not as a class property |
| 6 | Flesh/blood boost works only if the source Devil is alive | SYNTHESIS §2 row 4, AV2, M4, IX3 | Supported, slightly narrowed | Devil r25098 @23494 says flesh *or* blood, citing Denji eating Makima. The pack says "blood" only. The page's own Flesh Power Boost bullet (@25208) gives examples without the condition. Keep both, and note that the condition covers flesh |
| 7 | Contracts only between a human and a Devil; Fiends cannot; Devils cannot contract with each other | SYNTHESIS §2 row 5, M3 | Supported | Contract r25006 @677 to @782; Devil r25098 @23884; Fiend r24028 @564, @1713 |
| 8 | Contracts bind; the Fox/Aki case implies a peaceful exit clause | SOURCE_LEDGER, IMPLEMENTATION_PACKET | Supported | Contract r25006 @782 (cannot be broken on pain of death), @1148 (implied exit clause, Fox/Aki, neither died) |
| 9 | Fiend = corpse possession, reduced power, Devil personality kept, rare corpse traits | SYNTHESIS §2 row 6, AV5, IX4 | Supported | Fiend r24028 @564, @1027 to @1401 |
| 10 | Hybrid = Devil replaces the heart, human consciousness kept, individual trigger | SYNTHESIS §2 row 6, AV6, IX5 | Supported | Hybrid r25122 @716 (contract or surgery), @856, @4343 to @4532 (cord and pin triggers) |
| 11 | Katana Man's cooldown is not universal | AV6 | Supported | Katana Man r24478 @5056 (the page calls it unique to him) |
| 12 | Only Devil Hunters may legally contract or use guns (pack: "legal generalizations need primary verification") | SYNTHESIS §2 row 7, CAMPAIGN, M6 | Supported but underused | Devil Hunter r24927 @859 to @1119; Contract r25006 @3429 (Japan: only hunters may legally contract). The rule is stated outright and should be modelled, not deferred |
| 13 | Makima's control depends on rank; whose view sets the rank is disputed (C2, AV7) | SOURCE_LEDGER C2, AV7 | Supported | Makima r25174 @7035 (those *she* considers lower) vs Kishibe/History r18843 @5296 (those who *perceive themselves* below her) |
| 14 | Damage redirection scope conflicts (AV9) | AV9, C2 | Supported | Makima r25174 @5049 (fatal attacks become illness in a random citizen); Kishibe/History r18843 @4219 (any misfortune); Four Horsemen r25233 @13820 (any physical harm) |
| 15 | Makima channels controlled subjects through chains; listens through small animals | AV8, AV10 | Supported | Makima r25174 @7788, @8459 |
| 16 | Four Horsemen describes Fiend contracts, contradicting the general rule (C3) | SOURCE_LEDGER C3 | Supported | Four Horsemen r25233 @13755 (Makima forces humans, Devils and Fiends into contracts) |
| 17 | Timeline dates the first Gun attack to 1984; World says 1983 (C5) | SOURCE_LEDGER C5, SYNTHESIS §3 | Supported | Timeline r24952 @1645 (1984, November 10); World r24067 @1208, @3420 (November 10, 1983) |
| 18 | Stone Devil: blood-drawn circle, fickle with contracts | SOURCE_LEDGER, C7 | Supported | Stone Devil r23741, Plot and Devil Powers sections |
| 19 | Eternity Devil: aquarium loop, contract offer, Asa's haul | SOURCE_LEDGER, C7 | Supported | Eternity Devil r25055 @2336 (offer: release in exchange for Denji), @3113 (aquarium), @4340 (over a million yen) |
| 20 | Doll conversion skips Hybrids, Devils and Fiends but works on dead Fiends (C4, AV13) | AV13, C4 | Supported on the Doll side | Doll Devil r23080 @1792 |
| 21 | A contract can move a target to Hell (IX8) | INTERACTIONS IX8 | Supported | Contract r25006 @2016 (Santa offers Denji by sending him to Hell through a doll proxy) |
| 22 | Row 176 carryover is excluded | SOURCE_LEDGER C8 | Supported | ERRATA.md; matches SPOTCHECK_1 P1 |

Rows 1 to 10 and 12 cover every SYNTHESIS §2 law. Rows 11 and 13 to 21 are the further sample across ABILITY_VARIANTS, CAMPAIGN and SOURCE_LEDGER.

## Template checks

- **(3) Proposal labels:** pass. Every row in ABILITY_VARIANTS, CAMPAIGN, MODULE_CATALOGUE, INTERACTIONS and the first slice is marked as a proposal. Wiki statements carry "wiki says" or revision framing.
- **(4) Continuity:** pass for what the snapshot holds. No anime-only, film or game material is mixed in. One label gap: the snapshot (to 2023-11-27) already covers early Part 2 (Yoru, Asa, Fami, the Falling Devil and the Church). The pack calls "later Part 2" a gap, which is correct, but it should say that early Part 2 *is* inside the evidence, so nobody treats Part 2 rows as missing.
- **(5) Sealed secrets:** pass. No changed or randomized truth appears. Makima's identity and the Horsemen are public franchise twists, which AGENTS.md allows.
- **(6) Raw prose and quotes:** pass. No quoted run of 15 or more words and no copied payload text in any of the nine files.
- **(7) Gaps:** mostly honest. Primary manga, chronology, conflicts and post-cutoff material are all listed. But §9 calls the contract-party/payment/exit model a primary-source gap, when the wiki already states sacrifice eligibility and proxy rules (see below). The real gap is narrower than the pack says.

## Fixes in priority order

1. **Primal Fear row (SYNTHESIS §2 row 3, SOURCE_LEDGER direct-check paragraph, GM_PROMPT, M2).** Replace "explicit no-reincarnation property" and "believed unable to die" with what the page says: these Devils have never died, so they have never been through the cycle, and they have kept their identities since the start of history. Model this as a has-never-died history plus very high durability. Leave "what happens if one is killed" unknown. War's claim that humanity cannot kill Falling goes on that actor as her belief.
2. **Positive emotion scope (IX1, M1).** Make admiration weakening a general Devil rule ("Devil" r25098, Weaknesses), with Chainsaw as the main case. Otherwise the fear-state model ends up with a special case where the source has a general rule.
3. **Contract schema (SYNTHESIS §2 row 5, AV3, IMPLEMENTATION_PACKET state shape).** Add the stated sacrifice-eligibility fields: own body parts, senses, lifespan, legal children or people one is legally responsible for. Unrelated people cannot be sacrificed, but an incapacitated person can be offered, and a proxy can deliver them. Add that the human's mistake about which Devil they contracted does not void the deal if both sides meet the terms, and that a sacrifice can be taken at a distance. All of this is in Contract r25006 @1307 to @2356.
4. **Legal access (row 7, M6, CAMPAIGN CS1 to CS3).** Model "only hunters may legally contract or carry guns in Japan" as a stated rule, so a civilian contract is possible but illegal. This gives CS1 a real choice and costs nothing.
5. **Living-source condition (row 4, AV2, M4, IX3).** Say "flesh or blood", and note the page's unconditioned Flesh Power Boost bullet as an internal tension.
6. **Snapshot label.** Say once, in SYNTHESIS §1 and SOURCE_LEDGER, that the evidence includes Part 2 up to 2023-11-27. Only material after that date is the gap.

## What the notes and payloads support but the pack missed

- Fiend reversion: Power's blood pact with Chainsaw restored her as a full Devil, with the wiki's caveat that this may be unique to her (Fiend r24028 @1861 to @2001). It gives a body-state transition the M5 table lacks.
- Hybrid recovery: fatal injuries heal by pulling the trigger, without drinking blood (Hybrid r25122 @4941). A Hybrid can also tear out its own heart to let the Devil reform (@1928). Both change the Hybrid body profile.
- Devil abilities usually spend the Devil's own blood, and Aki says they end when the Devil dies ("Devil" r25098 @25896, @26285). Both give a direct cost and a persistence rule for AV records.
- Fragmentation: a Devil split into pieces presumably cannot reincarnate until every piece or its core is destroyed ("Devil" r25098 @5910, hedged). It matters for the Gun Devil and for the Gun-flesh economy.
- Erasure has world-history effects, and Horsemen-level Devils faintly remember erased concepts ("Devil" r25098 @15477). This feeds the knowledge and belief model.

## Fixes applied

1. **Primal Fear lifecycle corrected.** Replaced the no-reincarnation and class-wide invulnerability claims with a has-never-died history, retained identity, very high durability as a proposal, unknown outcome if killed, and War's belief kept actor-specific. Files: `SYNTHESIS.md`, `SOURCE_LEDGER.md`, `GM_PROMPT.md`, `MODULE_CATALOGUE.md`.
2. **Positive-emotion scope generalized.** Admiration/love weakening is now a general Devil rule, with Chainsaw kept as a salient case. Files: `SYNTHESIS.md`, `MODULE_CATALOGUE.md`, `INTERACTIONS.md`.
3. **Contract schema expanded.** Added stated sacrifice categories, unrelated-person exclusion, incapacitation and proxy delivery, remote taking, mistaken counterparty identity, and eligibility/ownership fields. Narrowed the primary-source gap to verification of the already stated secondary rules. Files: `SYNTHESIS.md`, `SOURCE_LEDGER.md`, `IMPLEMENTATION_PACKET.md`, `MODULE_CATALOGUE.md`.
4. **Japan legal access modeled.** The pack now states the wiki rule that only hunters may legally contract or carry guns in Japan, and gives the civilian start an illegal-access choice. Files: `SYNTHESIS.md`, `SOURCE_LEDGER.md`, `MODULE_CATALOGUE.md`, `CAMPAIGN.md`.
5. **Blood/flesh condition clarified.** Changed the source description to flesh or blood and retained the page's separate unconditioned flesh-boost statement as an internal tension. Files: `SYNTHESIS.md`, `SOURCE_LEDGER.md`, `ABILITY_VARIANTS.md`, `MODULE_CATALOGUE.md`, `GM_PROMPT.md`.
6. **Snapshot boundary clarified.** Early Part 2 through 2023-11-27 is included; only later material is outside evidence. Files: `SYNTHESIS.md`, `SOURCE_LEDGER.md`, `GM_PROMPT.md`, `WORLD_BRIEF.md`.
7. **Payload-supported missed rules added.** Added possible Fiend reversion, Hybrid trigger/heart recovery, Devil ability blood costs and death termination, hedged fragmentation, and erasure's history/memory effects as actor-specific rules with uncertainty preserved. Files: `SYNTHESIS.md`, `SOURCE_LEDGER.md`, `ABILITY_VARIANTS.md`, `INTERACTIONS.md`.

No review fixes or supported missed rules were declined. No runtime/gameplay claims were added.

## 2026-10-20 packet detail pass

Aligned the browser gate to 1920×1080 primary and 1536×864 floor; clarified current-format save roundtrip versus deferred old-save migration; and recorded WG16 livelihood depth as optional, with only a bounded price consequence if later selected. Exact frozen payload locators for the chosen contract/effect/use cost remain a preimplementation condition. See [L3 audit](../../audits/world_pack_details_2026-10-20/L3.md).
