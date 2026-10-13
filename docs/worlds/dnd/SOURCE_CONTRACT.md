# Source, edition and era contract

2026-10-11. Claim status: V = inspected primary fact; I = interpretation; P = authored proposal; U = unresolved. A downloaded book is not a read book. Page numbers below are one-based PDF pages; selected SRD 5.2.1 page labels coincide with PDF page numbers. No raw source prose is stored here.

## Inventory and inspected bindings

| ID | Source and version | Actual coverage and permitted use |
|---|---|---|
| S01 | [Official SRD index](https://www.dndbeyond.com/srd), live page inspected 2026-10-11 | V: identifies 5.2.1 as current on this inspected page, updated March 2, 2026; separates SRD and Forgotten Realms publishing coverage. Index and FAQ inspected, not every linked document. |
| S02 | [English SRD 5.2.1 PDF](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf), 364 pages | Downloaded, parsed locally, selected sections read: D20 Tests p6; zero HP/death pp17–18; crafting p103; Cure Wounds p121; Guidance p138; Mending p148; concentration p179; short rest p187. Not a full class, spell or monster audit. |
| S03 | [Official conversion guide](https://media.dndbeyond.com/compendium-images/srd/guide/converting-to-srd-5.2.1.pdf), 15 pages | Downloaded; introduction, origin changes and crafting changes inspected, pp1–2, 9–10. V: revised rules come from PHB 2024, DMG 2024 and Monster Manual 2025; changes include background ability scores/feats and crafting. Conversion guide is not an executable compatibility specification. |
| S04 | [Visit Phandalin](https://www.dndbeyond.com/posts/1515-visit-phandalin-d-ds-most-popular-starter-town), official 2023 overview | Brief History, Arrival and Key NPCs/Locations inspected. V: rebuilt mining settlement; ordinary trades; inn, equipment sellers, farm, shrine and records/trading exchange. Supports geographic and livelihood anchors, not a frozen DR year, complete gazetteer or all adventure events. Hidden adventure information is excluded from this packet. |
| S05 | [Forgotten Realms official overview](https://www.dndbeyond.com/resources/2037-the-forgotten-realms), dated Aug 15, 2025 | What Is the Forgotten Realms and New to the Realms inspected. V: distinct setting with books, novels and games; Sword Coast entry and wider regional horizon. Its free-adventure recommendation is not current access proof. |
| S06 | [English SRD 5.1 PDF](https://media.dndbeyond.com/compendium-images/srd/5.1/SRD_CC_v5.1.pdf), 403 pages | Downloaded and parsed; crafting p88 inspected. V: 5 GP of market-value work per downtime day, half-price raw materials. Other mechanics require profile-specific reading before use. |
| S07 | [Lost Mine of Phandelver contents](https://www.dndbeyond.com/sources/dnd/lmop) | Contents visible. Part 2 click redirected to [expired claim promotion](https://www.dndbeyond.com/claim/source/lost-mine-of-phandelver), stating promotion no longer available. Chapter body not read. No claim made that the adventure is freely acquired or fully inspected. Use S04 for this pass; an owned/local or signed-in chapter is a later retrieval route. |
| L01 | [Existing D&D wiki digest](../../research/power-systems/wiki-digests/DIGEST_dungeons-dragons-2024-revised-fifth-edition.md) | `blocked_no_revision`. Retained as a lead only. It establishes no new lore/rules fact. |
| L02 | [Western research ledger](../../research/power-systems/western/SERIES.json), D&D row and N01/N02 | Prior 2026-10-10 official Warlock/Wish references and analyst mappings. Neither full page reread here; no fresh rule binding depends on these claims. Useful later patron and exceptional-request retrieval targets. |
| L03 | [World source comparison](../../research/WORLD_SOURCE_FIT_COMPARISON_2026-10-11.md) | Prior bounded selection judgment, not accepted priority. This packet develops D&D without re-ranking other worlds. |

Local source inventory: searched filenames under `/Users/weiwei/Sync/CalibreLibrary` and `/Users/weiwei/Downloads` for Dungeons, Forgotten Realms, Phandelver, Sword Coast, D&D, rulebook and SRD terms. No relevant titled rulebook was identified; an unrelated filename substring is not a source match. This does not prove absence in archives, opaque filenames or other folders. [Library manifest](../../research/novels/LOCAL_LIBRARY.md) was read for locations only. Library unchanged.

Acquisition followed Weibao's new download authorization. Initial sandbox curl could not resolve the host; the approved network route succeeded for all three files. Original PDFs and parsed text live in `/private/tmp/yairpg-dnd-sources-2026-10-11/`. Temporary storage can be cleared. [Machine-readable manifest](SOURCE_MANIFEST.json) preserves URLs, byte counts, hashes and coverage so copies can be verified or reacquired. No purchased book, account claim, installation or source-library import occurred.

## Qualified rule anchors

| ID | V: concise inspected rule | Binding |
|---|---|---|
| C01 | D20 tests use modifiers against a target; advantage/disadvantage select between two rolls. | S02 p6, D20 Tests |
| C02 | Nonmagical crafting needs tool proficiency, appropriate materials worth half price, and workdays derived from price divided by 10. | S02 p103, Crafting Nonmagical Items |
| C03 | Concentration ends on another concentration effect or incapacitation/death; damage prompts a save. | S02 p179, Concentration |
| C04 | Zero HP can lead to death saves; stabilization differs from healing. | S02 pp17–18, Dropping to 0 Hit Points |
| C05 | Short rest lasts one hour with eligibility and interruption rules. | S02 p187, Short Rest |
| C06 | Mending repairs a single break/tear up to one foot, takes one minute, and cannot restore magic. | S02 p148, Mending |
| C07 | Cure Wounds heals 2d8 plus casting modifier at base level; Guidance affects the chosen skill's checks under its duration/concentration conditions. | S02 pp121, 138, named spells |
| C08 | SRD 5.1 crafting uses 5 GP progress/day, rather than the revised profile's price/10 schedule. | S06 p88, Crafting; C02 |

These anchors do not grant any start the relevant proficiency or spell. They do not establish automatic market demand, unrestricted healing access, free teaching or full D&D combat. Full wording and exceptions must be read at the named source before coding each consumer.

## Edition and era contract

P: select profile independently from setting era. Each profile owns character origin rules, class tables, spell versions, checks, combat, recovery, crafting and applicable errata. Supplements have explicit dependency and precedence lists. No cross-edition best-of merge is implicit.

| Option | Evidence state | What choosing it changes; unresolved work |
|---|---|---|
| O1 revised fifth edition, SRD 5.2.1 | Primary selected-section evidence, proposed first default | Revised origin, tools, spell and crafting contracts. Full rulebooks can extend coverage only after exact passages are inspected. SRD is a subset, not the entire edition. |
| O2 legacy fifth edition, SRD 5.1 | Acquired; narrow crafting comparison | Separate origins, class/spell/equipment definitions and economy pace. Reusing the same name does not establish equivalent mechanics. Profile audit required before making this playable. |
| O3 third/3.5 edition | No primary edition rules inspected in this pass | Proposed alternative requiring its own character, advancement, action, equipment and spell audit. Do not promise a fifth-edition adapter will implement it. |
| O4 fourth edition | No primary edition rules inspected | Separate profile proposal; combat/ability cadence and setting chronology need independent verification. No auto-switch on a historical event. |
| O5 AD&D/earlier editions | No primary edition rules inspected | Historical-rule variant proposal; obtain edition-qualified sources and audit check/combat/progression differences first. Never infer mechanics from nostalgia or a fan summary. |

Era proposals: a local post-rebuilding Phandalin snapshot first; later ancient, crisis-era and later-era branches. Exact years, regional institutions, available species/knowledge and event schedules require qualified setting books. Publication date is not in-world year. Novels, tabletop adventures and video games remain distinct continuity inputs. A novel's demonstrated magic can be a setting observation without automatically replacing the selected spell rule.

P: instance identity includes `rulesProfileId`, `rulesRevision`, `settingSnapshotId`, `eraId`, `continuityId`, supplement revisions and `adaptationRevision`. These fields are a future schema proposal. A profile switch starts a new instance or uses a reviewed conversion transaction: preview changes/losses, validate dependent content, preserve old receipts, publish atomically, save/reload/import. Existing effects use their frozen profile. A traveler does not automatically reroll species, rebuild class or replenish slots; cross-profile behavior needs an explicit carrier conversion.

P: preserve SRD attribution from its own license page when distributing an implementation. SRD coverage is not Forgotten Realms permission. Direct-setting content follows PROJECT.md's private-pack boundary; public engine mechanisms can be generic. This packet adds no runtime setting pack or publication. Detailed source acquisition beyond these three official files remains a bounded next-unit choice, not an endless download queue.
