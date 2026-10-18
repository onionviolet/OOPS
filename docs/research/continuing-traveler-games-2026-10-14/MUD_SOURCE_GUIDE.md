# MUD reference library: routes and evidence boundaries

2026-10-14, America/New_York. Read with [deeper findings](RETROMUD_AND_4D_DEPTH.md). The original broad scout remains [REPORT.md](REPORT.md). These files are research; they establish no adopted mechanic, tested game session or live-server version.

## E1. Fast reference routes

| Need | Readable report | Full evidence kept privately |
|---|---|---|
| Six RetroMUD worlds, travel and affinity | R1–R2 | `private/deeper-muds/retro/Worlds-*.html` and `.txt`; transport help; `Magic-elemental_balance.*` |
| All RetroMUD guild names and captured paths | R3–R4 | `GUILD_CATALOGUE.json`; three raw catalogue responses; `GUILD_DETAILS.json`; 24 raw guild responses |
| Exact skill/spell grants and restrictions | R5–R6 | `ABILITY_ROWS.csv` and `.json`, with guild, raw/display level, kind, source location, restrictions and capture filename |
| Full individual ability inputs and costs | R5–R6 | Thirteen `detail-*.xml` responses for repair, gem cutting, glass blowing, potion research, shopkeeping, mark creation, construction/storage, travel, recharge, vulnerability and minion transport |
| Teaching, dues, training credit, beginner transitions | R3, R7 | Corresponding `Guilds-*`, `Skills-*` and `Basics-*` help captures |
| RetroMUD storage, companions, death and reincarnation | R5–R7, C6 | Full storage/rent/castle/settlement, mount/body and death help; no simulated persistence proof |
| Four eras and local careers | D1, D5 | `4d/wiki-zones.*`, official class/clan pages, selected wiki help, archived text |
| Remort, mastery and remembered skills | D3–D4 | Pinned `remort.cpp` from the parent private library; deeper `spell_parser.cpp`, `skills.cpp`, `trainers.cpp`, `structs.h`, `db.cpp`; decoded flows below |
| Production and trade conditions | D5–D6 | Wiki crafting/trade/occupation help; full bundled text in `4d-archive/`; `4d/HELP_RECORDS.json` with original records and line ranges |
| Persistence and incomplete features | D6–D7 | `objsave.cpp`, `house.cpp`, `character.cpp`, `act.other.cpp`, `subskills.cpp`, `proffessions.cpp`; archived warnings kept alongside current source |

The private paths above are relative to [this lane](private/deeper-muds/). The public [evidence summary](MUD_EVIDENCE.json) records counts and checksums without redistributing source prose.

## E2. Acquisition and parsing

The original public 4D source revision remains `d2ee92671693f2f0eac88d7d5f9d86bebc17d89c`, dated 2026-09-23. Its `world.tar` was retained intact privately. Only bounded `lib/text/` members were decoded into the reference tree; nothing was built, installed or run. Demo character files in the archive were not extracted or opened.

RetroMUD's official public website supplies a help index and guild/ability endpoints. Its own front-end script reveals those routes and the displayed guild-level mapping. Some responses use malformed XML, including mismatched tags and unescaped entities. Original bytes remain intact. The extraction uses explicit lexical record patterns rather than silently claiming the responses validate as XML. `site-renderer.js` lines 686–705 establishes that raw guild index zero is displayed as guild level one.

An ability's intrinsic skill/spell level may differ from the guild level at which a class grants it. For example, a grant table and a generic spell-detail page need not print the same level. These are retained as separate fields, not normalized into a false contradiction.

The website catalogue contains 19 primary, 55 secondary and 279 tertiary entries with 353 unique location keys. Full ability pages were captured for all 19 primaries and five secondaries: Merchant Council, Telemancer, Pyromancer, Herbalist and Sharpshooter. The other catalogue entries remain indexed-only. This distinction prevents “listed” from becoming “deeply read.”

There are 1,510 extracted ability rows for those 24 pages. These include repeated abilities across guilds and are not 1,510 unique powers. The 2,168 extracted 4D help records likewise include duplicates and different-era versions. They are searchable source records, not 2,168 distinct current mechanics.

`REGISTRATION_CALLS.json` indexes 333 lexical `spello`, `skillo` and `subo` registrations, preserving original arguments and source lines. The extraction can include commented/preprocessor-disabled calls. No claim about the number of active implemented skills follows from it.

## E3. Most useful decoded joins

| ID | Source chain | What can safely be used as reference |
|---|---|---|
| J1 | RetroMUD body/limb help → guild required item → skill/spell conditions | A retained power can need a different body/tool to execute. No invented rule that travel itself deletes knowledge. |
| J2 | Alchemist material collection → vessel → research/enchantment/travel | A single resource family supports several meaningful choices. Exact material charges and eligible categories are in raw detail responses. |
| J3 | Merchant services → supplied clerk/shop → home facilities | Delegation has a worker, competence and stock requirement; constructing a facility can change future tool use. |
| J4 | Planet-affinity help → effective skill/price/travel → mirrored elemental balance | Local modifiers and aggregate world consequences are different from deleting learned progress. |
| J5 | 4D remort slots → `has_class`/`tier_level` → `knows_spell` → `total_chance` | History determines eligibility; learned proficiency/prerequisites affect execution. Progressive specialization consumes the slots needed to retain old-class access. |
| J6 | Remembered record → eligibility branch → trainer/improvement → save read/write | Separate remembered abilities have source consumers and persistence fields. Actual contract acquisition and roundtrip remain untested. |
| J7 | Local occupational output → processing → buyer state/tender → travel restriction | Production value, demand, accepted currency and cargo survival are distinct. Recipes still marked unfinished must remain unfinished in the research claim. |
| J8 | Quit → keyring/object save; house → room-object save | Personal retention and estate persistence have different writers. A general save command does not prove every modified object roundtrips. |

Full condition notes and static example traces are in [private/DECODED_FLOWS.md](private/deeper-muds/DECODED_FLOWS.md). They name the inspected spans without claiming complete class coverage or execution.

## Q2. Remaining named uncertainties

| ID | Open question | Evidence needed |
|---|---|---|
| Q2a | Which RetroMUD secondary-entry threshold is current? | Current in-game `choices`/join-room help or maintainer confirmation; published help differs between 14 and primary completion |
| Q2b | Which RetroMUD pets/items survive each actual crossing, logout and reincarnation? | One controlled journey for the particular creature/item; generic spell names do not establish all subtypes |
| Q2c | Does the 4D public revision match the current server and its contract scripts? | A live version readback and bounded acquire/train/remort/save trace |
| Q2d | What precisely enforces 4D organic cargo exceptions and particular local craft jobs? | The relevant live scripts or direct controlled outcomes; generic profession registrations are insufficient |
| Q2e | Which house/item warnings are still applicable? | Current help plus a disposable persistence trace for the selected object kind, not a blanket assumption from old warnings or recursive serialization |

No additional game trial or installation is implied by saving this guide. Current research can support original design proposals; it cannot establish those unresolved behaviors as verified.
