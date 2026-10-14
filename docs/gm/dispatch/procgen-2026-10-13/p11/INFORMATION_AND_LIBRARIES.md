# Information spread, knowledge objects and libraries

Status: PROPOSALS, 2026-10-14. Original examples. Canon content must later use source locators and shown/stated/inferred claims. Private novel notes cannot become generated book text. [CONTEXT](CONTEXT.md) and [REPORT gates](REPORT.md#future-gates) apply.

## N5: rumors, news and information spread

**Value:** people hear about events through reachable channels, with differences in access, delay, testimony and bias. Investigation changes an attributed belief rather than granting world truth.

**Cost:** medium for one relay and correction, high for broad networks. Dependencies: [D8](../p5/D8_LORE_GRAMMAR.md) owns fact/account grammar; [P5 X7](../p5/EXTRA_IDEAS.md) owns biased institutional accounts; P4 speaker identity/means; P3 delivery/expiry; context local place, language, relationship and era. P11 adds transmission and correction, not another lore fact registry.

Shown/SOURCE: `src/simulation_effects.js:110-113,281-284` supports knowledge basis; `src/simulation.js:409-410` filters known events. Inferred gap: neither supplies generic person-to-person rumor transport. Stated D8 explicitly separates facts and accounts.

**Contract:** `message = {id, accountRef, senderRef, audienceRefs, channelRef, sentAt, arrivedAt?, worldEndpoint, languageRef, fidelityClass, parentMessageRef?, correctionRef?, status}`. Sender can report what they believe without it being true. Only a reachable channel copies that belief to a recipient. Distinguish firsthand witness, attributed testimony, anonymous rumor and deliberate deception. Repetition is not independent corroboration: retain parent source chains. Private truth and sealed candidates are never interpolated into an anonymous gossip template.

**First slice:** a known local repair outcome yields one D8 account. A nearby introduced person hears it later through a declared public conversation; a distant shop learns only when a messenger reaches it. Two attributed interpretations lead to the same reachable witness/evidence check. A correction updates beliefs with history retained; it does not edit the original message as though it never existed.

**Gates:** same event ID and parent chain survive relay, travel and reload/import; no knowledge before contact/arrival; no future-era detail, hidden actor alias or secret truth leak. Show a recipient changing belief after actual evidence. Interrupted channels pause/cancel under stored policy. Cap fan-out with aggregation and retain actionable references without inventing an all-world rumor tick. Failed transmission write grants no knowledge.

**Further options:** letters, town criers, guild notices, magical communication, newspapers, telepathy, censorship, translation errors, counterfeit reports and cross-world incompatible channels. Channel rules can be instantaneous or cheap where supported; no universal delay/cost is imposed. “News” describes when the recipient learns, not necessarily when the event happened.

## N6: generated books, knowledge items and libraries

**Value:** knowledge has a physical/social route: find, buy, borrow, copy, translate, study, annotate, return or teach. Library collections reflect local history, law and custodians rather than serving as omniscient unlock lists.

**Cost:** medium for one functional reading item/library loan; high for scholarly production, citations and archival networks. Dependencies: P6 owns creation of manuscripts/artifacts; D8 supplies known history; P7 owns author identity/naming; P2 supplies truth-versus-observation lessons; native item/knowledge/reading/ownership adapters. The writing generator must not invent an unsupported skill unlock.

Use [P6 CREATIVE_WORKS](../p6/CREATIVE_WORKS.md) for the content/edition/copy and teaching payload. N6 adds collection selection, catalog/access, circulation and loan custody over those same records. It does not generate a second handbook definition or another teaching resolver.

Shown/SOURCE: `src/main.js:728` reads native book stats; `src/book_world_mol_actions.js:45-49,71-80,105-108` has authored study/notebook/research consumers as audited by [P6](../p6/LIVE_AUDIT.md). Inferred: these are foundations, not a generic generated library. No claim about source-world libraries is made from those adaptations.

**Contract:** stable work ID, edition ID, physical copy ID, credited original author, language, subject scope, claim refs/bases, publication time, access class, condition, owner/holder, study requirements, supported learning effects and marginalia refs. Another copy does not contain a freshly rolled cosmology. A mistaken edition remains mistaken after better knowledge; an annotation can correct it. Synopsis/title generators receive only claims the work's author could include. Generated prose is original summary/texture, never copied canon or private notes.

**First slice:** an original local field handbook has a short stored title/synopsis and one supported observation method. A library custodian lends one actual copy against declared terms. Reading records gradual known method/evidence and supports one appraisal action or informed harvest choice; it does not reveal all P8 hidden properties. Copying or buying can remain future routes without a forced permanent loan gate.

**Gates:** learning effect has a real supported consumer, author/era/language match, reading progress persists, exact copy custody and loan terms survive import, failed save grants no knowledge, unsupported edition rejects without rewriting. Test lost/returned copies and retained earned understanding separately. Multiple copies cannot multiply the same learning receipt unless the world explicitly supports such a mechanic. Prove hidden tables are absent from title, index, valuation and accessibility text.

**Further options:** partial manuals, recipes with missing context, annotated copies, rival editions, restricted stacks, oral archives, living books, damaged pages, shared study and reviews. Readability, truth, completeness, prestige and physical quality are separate; an expensive text need not be accurate.
