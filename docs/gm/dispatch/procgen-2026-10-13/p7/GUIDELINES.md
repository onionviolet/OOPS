# People and names in canon worlds

Status: PROPOSAL, 2026-10-13. Docs only. Weibao requested guidelines; no world, grammar pack, start or runtime change is implemented or accepted here.

## Authority and scope

[PROJECT](../../../../../PROJECT.md), especially Standing priorities and Book worlds, sets canon-first order and selectable canon/divergent/remix/swapped premises. [USER_VISION](../../../../USER_VISION.md) remains the direction owner. [COMMON](../COMMON.md) supplies seeded/save/secret rules. The P7 instruction and PLAN permit writes only here and require no builds or commits. Existing owner proposals remain proposals. One realm/one prestige and one finished playable slice at a time remain the implementation boundary.

This packet follows Harry Potter, D&D, A Soldier's Life, TTKS's five separate books, Mother of Learning, LOTM/COI, Shadow Slave, JJK, Bleach, Fate, HxH and FMA, with lighter worlds in [OTHER_WORLDS](OTHER_WORLDS.md). Each profile scopes a small local population rather than claiming a complete world census.

## G1: authored cast and generated population

Canon characters are authored records with stable IDs, biographies, source pins, era availability and knowledge. Never generate, rename, merge, replace or randomly assign their canonical identity. An authored AU version is still authored, with a counterpart link and explicit differences. Generation supplies canon-unnamed roles and plausible background people: another porter, school supply worker, local apprentice or neighbor. A source role that is unnamed but individually plot-essential also needs an authored reservation; lack of a name is not a vacant slot.

Existing original authored contacts remain authored too. P4 travelers do not replace Maia/Oren/Lio or a world's local cast. Encounter, trader, enemy and companion roles reference the same person ID. Becoming important promotes a saved person, preserving possessions, relationships and history. A crowd description can remain anonymous until a persistent individual matters; naming it must not issue fresh property or rewrite what the player already witnessed.

## G2: collisions and identity safety

Maintain a pack-local canon/authored reservation catalogue, including full names, relevant transliterations, aliases, titles, distinctive given names and unique role IDs. Build the catalogue from the selected source snapshot, not a tiny example list in these docs. Each row has source, continuity, era and reservation type. An internal alias can be reserved without telling the player whose alias it is. The display layer receives no reservation reason or hidden alias-to-person mapping.

Normalize Unicode (NFC for stored spelling, NFKC/case folding for comparison), spaces, punctuation variants and declared transliterations. Preserve original display spelling and reading. Test canonical order and allowed display-order variants, not just the first space-delimited token. Compare full identities and aliases; distinctive canon mononyms and signature given names get stricter blocks. Do not ban every common given name across an entire world. Shared family names may be legitimate, but a reserved dynasty/clan surname requires an eligible genealogical or declared AU record; it never implies a famous relative or inherited technique by itself.

Within one local cohort, avoid identical full display names unless an authored same-name scenario provides disambiguation. Across regions, ordinary names can repeat, with distinct actor IDs and known location/occupation used for UI disambiguation. A nickname is an evidence-backed alias, not a second actor. No public numeric suffixes such as "Harry 2" or unannounced cultural fallback on exhaustion. Try bounded deterministic eligible alternatives; if exhausted, reject admission with a neutral error and no consumed draw or partial person. Existing saved names survive later catalogue changes; new collisions are reviewed or disambiguated without silently renaming them.

## G3: culture, era and language

Select world instance, source continuity, era, region, household/culture and legal life stage before generating a name. Culture is a world-local row, not a racial personality or aptitude label. Region, migration, citizenship, language and species are distinct. Class can affect style, honorifics, lineage conventions and address; it does not dictate kindness, intelligence, criminality or magical capacity. Keep wealth, affection and actual means separate, as [D7](../p5/D7_HOUSEHOLDS.md) requires.

Use curated given/family/morpheme tables and compatible patterns. Do not assemble arbitrary Japanese or Chinese syllables and call the result authentic. Kanji/hanzi, reading, transliteration and name order need qualified review. Full given names may be safer than free syllable synthesis. Patronymics, particles, mononyms, professional names and locality names are enabled only for cultures that support them. Titles and offices render outside the civil name; inherited honorifics, assumed names and married names retain dated identity history. No mandatory western two-part name or universal binary gender naming rule. Translators can choose display order without changing identity. Cultural patterns in profiles are inferences/proposals unless an exact source row states otherwise.

## G4: power demographics are conditional

A town, elite academy, military company, occult cell and refugee camp are different sampling frames. Declare who could be present before drawing a power profile. Canon protagonists and named combatants are a selected sample, not a population survey. Never turn their prevalence into global odds. Where no census exists, use qualitative rarity and explicit playtest weights labelled proposal; zero weight in a first slice means excluded from that slice, not impossible in canon.

Power generation separates eligibility/aptitude, body or lineage, source acquisition, learned methods, mastery, current fuel, equipment, recognition and private knowledge. A surname does not grant bloodline magic. A grade, military rank, school year, Hunter licence, sequence, class or certification is not interchangeable with actual strength. Store world-specific fields, not one universal power level. People need real acquisition and resource history; NPC strength does not scale to the player's level. Rare/outlier births, awakenings and later transformations require authored eligible templates, not random stat upgrades to a civilian.

Generate ordinary livelihood and support routes even in powerful settings. Being unable to cast still leaves useful paid work, information, negotiation or qualified assistance. No hunger-death/offline-missed-duty rule is added by this packet. Source hazards and later irreversible failure policies need their own selected slice.

## G5: institutions, relationships and time

Occupation declares plausible work and known means; it does not grant every skill associated with its label. Faction membership, office, accreditation, admission rights, oath, duty and salary are separate references with issuer/jurisdiction/time. Shops draw stock once into its actual owner; personal gear is not all merchandise. Assistance requires reachable, willing, qualified people and available resources. A generated payout comes from actual owned funds and settles once per occurrence.

Keep household/member IDs, dated relationship edges and ownership in their existing owners. Authored constraints validate guardian/child age, reciprocal kinship, ancestry and role vacancies. Generic generation may create relationships among admitted original people; a canon relationship uses an authored edge policy. Being a neighbor or classmate does not confer friendship, romance, training, authority or access to private plans. No generated secret child, parent, spouse, soulmate, heir or confidant of a canon character without an explicit authored AU rule.

Every actor belongs to one world instance and local era. Check existence, age/body, location, faction, role occupancy and known events at that start. Do not import a later biography into an earlier snapshot. Natural source events remain expected causal history where their causes still hold; a genuine intervention updates dependent events with cause receipts rather than forcing the original ending. Source-reserved identities stay reserved after divergence. Reentry preserves the same people and means. Any time jump, absence advancement, retirement/death or successor needs the timeline owner and a declared policy; reload is never a population reset.

## G6: canon, AU and parallel worlds

Canon fidelity is the baseline for a canon pack. PROJECT permits easy relationship/start-point AUs and divergent/remix/swapped premises. An overlay identifies parent snapshot, changed fact/rule/edge, affected actors/institutions, replacement and causal consequences. It may authorize an authored counterpart, lineage or otherwise-exclusive power. Selecting "AU" alone does not waive every reservation or grant all exceptions.

Materialize overlays before eligibility checks, freeze their revisions and IDs in the admitted instance, and make entry terms known without exposing sealed outcomes. Different parallel instances have distinct actors, calendars and relationships. Counterpart links are author metadata, not shared memory or a merge key. B2 simulated lives, B3 attempts/submitted worlds, MoL loop phases and Fate routes require source-specific retention policies. Similar names do not make different people recognize a traveler. E6's proposed array-append inheritance is unsafe for replacement rosters; use explicit keyed replace/remove operations and validate the resolved pack.

## G7: truth, knowledge and sealed identities

Keep author truth, person self-knowledge, observed facts, attributed testimony, suspicion and public presentation distinct. A character can lie about a name, rank or affiliation. An observer receives a claim with speaker, basis, time and confidence; confidence does not turn testimony into truth. Successful comparison can reveal a particular fact, not all hidden traits or powers. Detection has source-specific reach, costs, blind spots and false positives. Visible mannerisms are clues, not universal species tests.

P4 currently exposes a count of unrevealed ordinary traits. Preserve that legacy behavior, but a new world's projection must not reveal a secret's existence through trait counts, missing-field badges, sort/filter results, CSS, action labels or reservation errors. Public civil name, introduction and discovered aliases have their own knowledge receipts. Private source, lineage, identity, faction or power fields never reach a general People view merely because they exist in a save.

Changed/randomized secrets are sealed in their designated owner; public docs/tests/reports use only opaque IDs and discovery-route/status. These guidelines define no secret truth or per-seed secret assignment. Do not derive a secret ID from its answer. Canon public franchise twists are not sealed by default, but in-world actors still need a valid knowledge route. [WORLD_SECRETS](../../../../worlds/WORLD_SECRETS_AND_DISCOVERY.md) owns the boundary. [D8](../p5/D8_LORE_GRAMMAR.md) consumes existing people IDs and earned facts; prose never creates a new person, surname, hidden identity or canonical history.

## G8: source and attribution discipline

Credit work and creator/rightsholders; preserve YAIRPG attribution/LICENSE. PROJECT places direct recreation packs outside git and the public bundle, while public runtime content uses originals. These docs are design analysis with short attributed examples, not a shipped cast/name catalogue. Canon reservation data and direct runtime names belong to the private pack. Public tests use synthetic names, powers and identities. No raw book prose, copied lists, dialogue, artwork or private reading-note quotations enter this packet.

Every sourced rule records exact edition/chapter/member/paragraph or wiki title/revision/section, claim ID, speaker and evidence mode: **SHOWN**, **STATED**, **INFERRED**, or **UNKNOWN**. Add source quality separately: primary-authenticated, supplied-edition-qualified, official companion/adaptation, secondary wiki, or proposal. A wiki stating a rule is STATED-secondary, not SHOWN-primary. An author's synopsis is premise evidence, not a demographic census. Contradictions and source limits remain visible; no optimistic blending or dismissal because a narrator, institution or favorite character said it.

Fan premises have creator/title/source and an inclusion rule distinct from the franchise baseline. TTKS B3 is such a fan world, not an update to JJK canon. A familiar fan convention (universal aristocratic titles, quantified wizard cores, automatic inherited abilities, free summoning slots) is not a canon default. Naming patterns can be original and fitting without pretending the source gives a linguistic dictionary.

## G9: never randomize these without an explicit AU rule

| Reserved class | Examples of the boundary, not an exhaustive canon roster |
|---|---|
| Canon-exclusive identity or role | Protagonist replacement, established dynasty heir, unique vessel, sole office-holder, named plot victim, legendary heroic record |
| Canon-unique or tightly restricted source | Unique eye combination, special protagonist lineage, singular artifact/authority, named being's power, high-tier exclusive seat |
| Plot-critical relationship or history | Secret ancestry, canon romance/parenthood, resurrected historical figure, membership in a fixed named roster, rewritten death/rescue |
| Unsupported special acquisition | Copying a technique, gaining a True Name, spontaneous top rank, circle-free taboo access, implanted power or contract without its source-specific cause |
| Omniscient identity knowledge | Internal alias maps, future biographies, perfect mimic detection, hidden allegiance or personality granted by viewing a card |

An authored exception can be allowed after its AU source, actual body/source/means, consequences and knowledge boundary are specified. The generator then fills authorized background details only.

## G10: implementation and acceptance boundary

[DATA_SHAPE](DATA_SHAPE.md) proposes P4-compatible seams and [REPORT](REPORT.md) ranks the next finite slices. A fitting name alone is not playable people generation. Each future slice must show at least one world's saved original contacts pursuing a fitting need with actual means, one useful interaction and a changed later response. Rebuild and exercise fresh origins at 1366×768 and 1600×1000, then Save/reload/Export/literal-file Import. Compatibility, failed publication, sealed projection, source review and human fiction acceptance remain separate gates. No such runtime checks were run by P7.
