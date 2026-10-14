# B3 alternatives and reference lens

2026-10-14. Unselected considerations. Every default is a local proposal,
not a rule spanning worlds. [DESIGN](DESIGN.md) develops G30;
[AUDIT](AUDIT.md) distinguishes current implementation from missing support.

## G30.11 Ways to continue without blood inheritance

| Code | Carrier and what really reaches the next person | Default + Dial | In-world reason, cost and meaningful difference |
|---|---|---|---|
| G30-O1 Adopted heir / chosen kin | Actual estate, lawful or contested household claims, taught skills, papers and remembered relationships. Biological faculty remains separate. | Default: adopted person receives named property and teaching. Dial: BD5 rite confers actual supernatural kinship/key access; graft or pact supplies a faculty; no legal adoption required for a gift. | Family recognition, witnesses and custody carry social/material continuity. Ritual materials/time/terms carry magical change where supported. No false pedigree or compulsory biological reproduction. The first useful difference may be access to a home/tool rather than an organ. |
| G30-O2 School / craft tradition | Manuals, working facilities, teacher time, practitioners and offices with real holders. Different students receive different teaching. | Default: one designated pupil inherits the bench and a curriculum, not the master's XP. Dial: open school, several beneficiaries, surviving mentor, student-led reform, free instruction or a spell that transmits expertise. | The predecessor must write, teach, fund or build. Surviving people can continue the work; unattended papers do not perform lessons. School affiliation is not shared blood, obedience or automatic ownership of its treasury. |
| G30-O3 Soul line (L12 / genetics MS6) | Same continuing soul or a declared chain of soul-linked selves, with specific memories, marks, karma or talents. | Default: carried memory aids learning; new body starts with its own means. Dial: complete mastery, organ reconstruction, shared soul archive, several returners, memory loss or a fresh soul. | The world/cheat supplies an actual surviving soul, anchor or transfer. Price may be none, preparation, loss, pact or time. No inherited DNA is needed, and a descendant need not share the soul. |
| G30-O4 Relic / covenant / office | A real item, external patron relation, badge, legal appointment or hosted archive. Holder, authorized user and beneficiary may differ. | Default: one transferable object or appointment enables one useful function. Dial: self-copying relic, nonexclusive patron grants, blood-keyed access, elected successor or theft. | Custody, actual authorization and remaining fuel determine function. A stolen signet can fool a clerk without granting its supernatural permission. A renewable source can genuinely fund repeat succession. |
| G30-O5 Heirless fresh perspective | Previous world's represented people, places, traces and consequences remain under their owners; new person receives only a plausible starting history. Player's archive remains player-facing. | Default: fresh local person with useful actions and no unearned inheritance. Dial: delayed start, unrelated discoverer of the estate, a new campaign, or a source-backed earlier return. | No surviving heir does not require game over or invent a blood relation. Finding and claiming old assets is new play with real witnesses/custody. Exact retained-world continuation needs the missing seam in B3-A08; an unrelated fresh start is not secretly a same-soul reincarnation. |

These routes can coexist. An adopted heir may be a pupil who holds a relic;
the same soul may return in a descendant who declines the clan. A bloodless
world can still make its first prestige layer a school or soul legacy. If no
source carries anything between people, an archive of player accomplishments
can remain a menu/history feature without granting the next character powers.

The first milestone need only prove its selected local route. Supporting a
non-blood alternative does not require implementing all five options at once.
Keep deferred routes visible in the design without inventing a universal
conversion from ancestry to “legacy points”.

## G30.12 World-fit dispositions

This table routes later qualification; it adds no new canon. The existing
[succession owner](../../../../worlds/SUCCESSION_BY_WORLD.md) carries its U/G
flags and book locators. B1/B4 own broader world fit and exact source expansion.

| Situation | Useful route | Required qualification |
|---|---|---|
| A verified hereditary faculty | G30 bloodline plus separate estate/teaching | Actual transmission time, expression, exceptions, body requirements and heir eligibility from chosen source/era. Do not assume all acquired changes breed true. |
| A setting with legacies but uncertain hereditary magic | G30-O1/O2/O4 | Preserve unknown rather than fabricate a concentration score. For example the succession owner's Harry Potter row explicitly says no guaranteed inherited magic and marks portrait/ghost background G. B3 verifies none of those lore claims anew. |
| A setting where ordinary afterlife/reincarnation differs from remembered rebirth | G30-O3 only when qualified; otherwise O1/O2/O5 | Existence of an afterlife does not establish memory, mastery, return destination or selectable same soul. D&D needs setting/edition/spell specificity. |
| A construct, clone, spirit or artificial family | O1/O2/O3/O4 with explicit substrate | Template copy, self continuity, controller identity and legal succession differ. No gestation system is required merely to represent a copied body. |
| An original modest local first slice | Compare G30 with O2 using the same ordinary work problem | Author the transmission/teaching costs openly. Do not impose a fantasy hereditary faculty on vanilla saves or on a direct canon world to make this proposal fit. |

## G30.13 Game comparisons with the unbiased lens

**Shown** means executable code/data directly inspected in this lane. For
previous research, say **stated by the local source audit**, including its
locators and limits; it does not become a new source read or game launch here.
**Stated** web claims name the publisher or community source. **Inferred**
means a YAIR design application, not a mechanic proved in the reference game.
All web pages below were accessed 2026-10-14. No reference game was played.

### G30-R1 Rogue Legacy 1

**Stated, primary developer:** the press sheet describes successive children,
individual traits and collected gold supporting manor upgrades for later
children. It is a broad design description, not a hereditary formula.
[Cellar Door Games press sheet](https://press.cellardoorgames.com/sheet.php?p=rogue_legacy_xbox_one_version).

**Stated by the local source audit:** `docs/research/rogue-legacy/FINDINGS.json`,
path `lineage-traits-classes`, claims `lineage.death-record`,
`lineage.frozen-offer`, `lineage.class-pool`, `lineage.compatibility`,
`lineage.selection-reroll`, `lineage.serialized`; bounded edition is source
commit `b41c17888a91100bbf8f1febecaa636a1b421f5b`. It records three generated
candidates retained when offers already exist, class eligibility from manor
unlocks, and a purchased reroll with a used flag. Its exact source locators
include `RogueCastle/src/Screens/LineageScreen.cs:286-328,460-507,854-913` and
`RogueCastle/src/Game Objects/LineageObj.cs:159-209`. Portrait ages are generated
presentation fields, not a simulated childhood.

**Contradiction / limit:** this lineage framing does not prove parental
concentration or learned mastery is genetically transmitted. The audit also
finds separate save calls and no all-files atomicity, so “frozen offers” is
not proof of crash-safe persistence. No contradiction between press sheet and
bounded code was established; they describe different levels of detail.

**Inferred transfer:** save coherent successor offers at their commitment point,
make inherited traits change actual actions, and show persistent preparation
separately from the new body's quirks. **Default:** a real existing heir or
one frozen coherent start. **Dial:** several candidates and an earned reroll
through a supported route. **Reason/cost:** actual family/start eligibility
and paid generation policy. Do not copy a mandatory three-heir lottery,
one-reroll limit, platforming structure or manor growth as universal rules.

### G30-R2 Crusader Kings III

**Stated, primary publisher:** play continues through heirs; genetics can pass
to children; education/guardians can prepare an heir. These are separate
features on the official page. [Paradox, About CK3](https://www.paradoxinteractive.com/games/crusader-kings-iii/about).

**Stated by the local source audit:**
`docs/research/crusader-kings-3/FINDINGS.json`, chains F1/F4/F5/F6 and locator
`game/common/character_interactions/00_dynast_interactions.txt:3-280,776-857`:
disinheritance/restoration changes succession eligibility and has standing,
personality and rivalry consequences; branch-family and typed death memories
have their own causes. Source build is 25734779. Native serializer/pruning
and complete genetic algorithms remain outside that dossier's recovered scope.

**Contradiction / limit:** personal prestige, family standing and political
succession are not evidence of an idle prestige reset. A documented family
genetics feature does not establish G30's 0.8 concentration coefficient.
An initial forum diary fetch failed; the publisher page and existing source
dossier supplied the bounded route instead. No source disagreement was
resolved by guessing a formula.

**Inferred transfer:** keep genes, education, family name, title and personal
friendships separate. A capable excluded heir and a recognized unawakened heir
can have different useful play. **Default:** one local recognition claim plus
one taught or inherited function. **Dial:** contested titles, branch families,
marriage strategy or a full dynasty. **Reason/cost:** people, laws and actual
resources, not an automatic clan score converted into combat power. A complete
dynasty simulation is substantially more scope than the first local loop.

### G30-R3 Legacy of a Thousand Suns style idle prestige

**Evidence gap:** this lane did not verify a prestige/rebirth or hereditary reset
in Legacy of a Thousand Suns. The old Kongregate game URL now redirected to
the platform home page, not game documentation. B3 does not infer that the
mechanic never existed; there is insufficient inspected evidence to claim it.

**Stated, historical secondary reviews:** Gamezebo describes energy-paced
missions and equipment progression.
[Gamezebo, historical review](https://www.gamezebo.com/reviews/legacy-of-a-thousand-suns-review/).
Engadget also describes stamina-funded raids.
[Engadget, 2013 mobile overview](https://www.engadget.com/2013-12-13-mmobility-legacy-of-a-thousand-suns-goes-mobile.html).
Neither inspected account documents a prestige reset. These concern historical
browser/mobile versions, not a live 2026 service.

**Inferred style application, not a LotS mechanic:** preserve a long-lived
legacy while a new life repeats useful short routines with changed options.
Separate short work cycles from life-scale transmission and avoid an empty
early game after each handover. **Default:** productive queues plus one useful
inherited action and clear progress to the next application. **Dial:** shorter
or longer lives, a later earned legacy currency, steady/rising/diminishing repeat
value. **Reason/cost:** actual paid work and carrier preparation; no imported
energy paywall or mandatory real-time wait. The design comparison remains
usable even though attribution of a LotS prestige system is unverified.

### G30-R4 Tale of Immortal

**Stated by the local source audit:**
`docs/research/tale-of-immortal/FINDINGS.json`, CE18, N15; build 21758240.
Official mod tutorial workbook `剧情配置表.xlsx`, `DramaDialogue` rows 431-433
(dialogues 610487/610488/610489) and `DramaOptions` rows 453-454 inspect prior
conduct in an inheritance chain. Final rewards and all favorable routes were
not traced. N15 follows native memory insertion/count/age handling, not a
complete playable reincarnation. [Source audit](../../../../research/tale-of-immortal/REPORT.md).

**Contradiction / limit:** the word inheritance here supports a conduct-gated
legacy event; it does not establish genetic heir prestige, routine rebirth or
the transfer of an entire cultivation stage. The dossier's untraced childbirth,
full marriage and playable reincarnation remain untraced in B3. Conditions in
source data are not proof that every branch transaction runs successfully.

**Inferred transfer:** a BP8 trial may care how the recipient or predecessor
handled a named promise, with typed receipts surviving biography compaction.
**Default:** a legible test tied to one actual memory/record and funded reward.
**Dial:** patron judgment, combat, craft, research, open gift or no test.
**Reason/cost:** the founder's purpose, a surviving witness/mechanism and actual
reward stock. Do not impose the reference's specific moral judgments on every
world or make a clan gate mysteriously omniscient.

### G30-R5 Wildermyth legacy

**Stated, developer-hosted community wiki:** legacy heroes can be recruited
in later campaigns; retained abilities depend on legacy tier; equipment is
scaled, with retained themes and specified exceptions. This is a return of a
legacy hero, not necessarily a biological child. [Legacy documentation](https://www.wildermyth.com/wiki/Legacy_tier).

**Stated by the local source audit:** `docs/research/wildermyth/FINDINGS.json`,
F3/F5/F6, build 21684217 (1.16+562). F3's
`assets/data/effects/retire/trainRookie.json`, volunteer targets and outcomes,
passes 3/8 of the retiring hero's experience to an eligible rookie or offers
resources. F6 locates `LegacyRelationshipValidator.validateLegacyRelationships`,
`LegacyAspectHelper.refreshLegacyAspects` and dirty legacy save work. F5's
lover-death histories explicitly use `persistOverLegacy: never` for their
particular buffs. Full legacy serialization remains unread in that audit.

**Contradiction / limit:** “legacy remembers the hero” does not mean every
event bonus persists. Wiki broad retention categories and a particular
nonpersistent source history must keep their own scopes; no contradiction
requiring a universal resolution was found. Recruitment, mentorship and
biological inheritance are three different routes. The 3/8 mentor amount is
not a universal cross-life coefficient.

**Inferred transfer:** let a school or soul line preserve meaningful identity
and selected functions while the new campaign/body has real work to do.
**Default:** one previously established useful function, with history and its
retention policy. **Dial:** more retained expertise, full familiar hero,
apprentice teaching or a clean new person. **Reason/cost:** actual recruitment,
teaching or soul mechanism, not unexplained memory. Keep emotional continuity
and function retention separate from copying every old relationship.

## G30.14 Comparison for the eventual milestone decision

No row is selected. This is a fit/cost comparison for PROJECT.md's owner,
not a request for Weibao to settle five questions before documentation can end.

| Candidate | Best fit / payoff | Main implementation cost / uncertainty |
|---|---|---|
| Bloodline G30 | A world whose actual inherited faculty changes ordinary work and has meaningful family transmission | Commit birth/transmission history, partial function handlers and body binding; wider world/estate continuity still missing. Requires qualified lore or an original premise. |
| Adopted heir / school | Preserves deliberate preparation, people and material legacy in a world without inherited magic | Bind an actual recipient, surviving teachers/rights/records and conserved estate. Closest conceptual reuse of current papers/apprentice/living handover slices. |
| Soul line | Strong continuity across unrelated bodies and lives; a natural home for remembered talents | Soul identity, actual retention/transfer handlers, body compatibility and observer knowledge. Existing cheat cards alone do not implement this. |
| Relic / covenant | Visible, transferable means with a concrete custody story and no genealogy simulator | Precise object/permission/charge ownership and source-specific transfer rules. Breaking or losing the carrier can matter if that setting says so. |
| Fresh person with persistent world | Long history remains interesting without inherited power; heirless continuation stays possible | Existing heir path rebuilds wider expansion, so retained-world person switching and elapsed-time reconciliation need real support. A summary cannot promise exact resume. |

If a later comparison is authorized, give bloodline and school versions the
same local work problem and comparable preparation opportunity. Observe whether
the inherited function changes choices and whether the life-scale handover is
worth doing. Keep their genuine differences instead of forcing equal power,
adding a second prestige layer, or claiming a paper comparison proves fun.
