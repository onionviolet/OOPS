# Names and retained lore

Evidence is SHOWN static native code for build 25097075. Preferred-image
addresses are locators, not live memory. Raw pseudocode remains private.

## N1: typed personal names

`Name` at `0x1408be30b` reads `Data/Name Type.txt`. With an empty requested
`NameType`, a `rand()%4` draw maps three residues to the first type and one
residue to a random type from that file. Thus the first type gets a deliberate
three-quarter baseline plus its share of the remaining quarter. A supplied
type bypasses that choice. The install's first type is Men.

It opens `Data/Names/<type> Names.txt`. If the first line is `NONAME`, it takes
the next line as another filename and repeats until a concrete pool is found.
All 50 installed alias files resolve to existing files, with zero cycles.
This data validation does not prove the resolver has cycle protection: its
native loop has no visible visited set or depth bound.

After aliasing, filename substring rules redirect several transformed or mixed
race categories to the Men pool. These include Shapeshifting, Evolved,
form Mages, Folk, men, Half-, Were-, lings, Exo- and Demi-. Some rules have
additional checks, including Half-Giants and the peasant label. The exact
comparisons are retained in `extract/direct-name-strings.txt`; do not replace
this routing with an assumed universal species rule.

A name row is read up to a period, then the remainder is parsed as an integer
`isSir` flag. The resolver counts lines and chooses by C `rand()%rowCount`.
It does not derive a name from a persistent person history.

## N2: suffix grammar also writes stats

An initial `rand()%16` selects the suffix family. For non-Men pools, or Men
names requested for a faction, the draw is forced to zero.

| Residues / condition | Resolver effect |
|---|---|
| 0..10, excluding 1 | Pick `Data/Name Suffix.txt`; read text, battle bonus and noble-suffix flag separated by periods |
| 1 | Pick `Data/WarriorType.txt`; set bonus to `rand()%50` |
| 11..15 | Pick another personal name and construct a patronymic; `rand()%5` chooses the long form at residue zero, otherwise the compact form; `NotSon` chooses gendered form and is cleared; bonus is 10 |
| Ordinary suffix branch, `rand()%100==0`, first independent race nonempty | Replace visible suffix with one of six race-related epithets using a five-race draw; clear noble flag |
| Noble flag 3 | Keep flag 1 only on residue 1 of `rand()%3`, otherwise clear it |
| Bonus 999 | Replace with `rand()%100` |
| `SirBlocked==0`, `isSir==1`, faction suffix empty | `rand()%45`: residues 0..6 add a title and +25 bonus; residue 10 adds an age prefix and -5 |
| Noble flag 1, faction suffix empty | Pick `Data/Name Suffix Addons.txt` and add its numeric bonus |
| Noble flag 1, faction suffix present | Append faction suffix on residue zero of `rand()%6`, add 10 |
| `SirBlocked==0` | `rand()%120`: six residues add a Roman numeral; other residues do nothing |

The function can override the given name for `CruelBook==2`, then clears
`SirBlocked`, requested `NameType`, and `NameforKingdom`. These are mutable
scratch globals. Nominal fractions here describe residue allocation, not an
assertion of ideal independent uniform draws or a whole-run frequency.

## N3: generated alphabet recipes

`NameMaker` at `0x140a3fc22` writes
`Data/Names/<NameWrite>_NamingSystem.txt`, for slots 1..5. It draws a length
parameter `rand()%10+1`, writes it as the first line, then writes one initial
letter plus 3..8 further letters, rejecting candidates already found in the
file. This is a private generated recipe file, not an in-memory grammar only.
No game or writer was executed in this audit.

`NameWriter` at `0x140a40795` reads that recipe's first line as an integer L,
requests `rand()%L+3` successful fragments, repeatedly counts and reopens the
file, appends selected fragments to `Name1`, clears `Name2`, and uppercases
`Name1[0]`. Its counter starts at zero after skipping the header. A zero draw
skips the append loop and retries the outer loop. Consequently it must not be
summarized as a simple uniform draw over every stored letter: the shown loop
skips the first candidate position and can retry without progress. This is
static control-flow evidence, not an observed hang or a performance test.

## N4: lore boundaries

Prior whole-line HeroBackground selection remains valid and was not redone.
Save writer/reader evidence in [persistence](SAVE_FORMAT_DIGEST.md) addresses
retention separately. Retaining a generated story string does not make its
claims a simulated sequence of past events.

## Proposed YAIRPG use

Keep the existing generation foundation's addressed draws and fact IDs. Let
names describe existing facts, and let a suffix's mechanical bonus refer to
an explicit trait or title record. Do not infer a real lineage merely from a
patronymic or a real feat from a generated epithet. File aliases are useful
content reuse, with validation at authoring time and bounded resolution.

## N5: faction resolver stages

REA recovered `FactionNameGenerator` at `0x1408c14c8`. It clears the name,
two parts, middle, faction suffix and person-name flag, then retries while
either required part is empty. It shares mutable Name output rather than a
separate immutable name object.

| Stage | Exact selector and dependency |
|---|---|
| First part | `rand()%18==0` can use Name with SirBlocked; KingdomNameFix diverts that branch. Otherwise choose a row from FactionName.txt until its prefix is eligible: 0 general, 1 mercenary, 2 bandit, 3 independent |
| Bandit / mercenary second part | `rand()%127` over embedded alternatives with role gates; rejected alternatives can leave part empty and restart the outer loop |
| Mercenary special mode | An extra `rand()%20` maps 1, 2, 3 to three mercenary forms, and 17..19 sets MercCompanyNameIsPerson and clears part 1 for retry |
| Independent first-part override | `rand()%4==0` substitutes RaceSuffixOnly |
| Independent second part | Rejection loop draws `rand()%154`; forms test FactionCivLevel thresholds, from above 2 through above 5, below 4 and other per-form tests, and set corresponding faction-title/lord outputs |
| Independent later override | `rand()%60`: five selected residues can change form, ten residues 5..14 attempt a personal-name domain; KingdomTypeOnly affects that loop |
| Independent rare title | `rand()%1000`: residues 0..11 set special faction-title strings; remaining residues keep the earlier title |
| Optional middle | `rand()%3==0`, then `rand()%50`; 24 explicit alternatives, with the default able to read Animals.txt for bandits |
| Assembly | Person-company flag, personal domain, race-prefix equality and empty/nonempty middle choose spacing, possessive, prefix concatenation or an 'of' arrangement |
| Last personal-name override | `rand()%4` for NameforKingdom, otherwise `%15`; residue zero replaces the assembled name with Name or NameWriter. WeirdNameFaction 1..5 chooses the corresponding generated recipe and is cleared |
| Exit | Clears NameforKingdom; a KingdomTypeOnly personal-name replacement also sets the ruler/faction title outputs |

Thus raw table prefix counts or 127/154 alternatives do not determine the
accepted form probabilities. Rejections restart at different scopes, later
selectors overwrite earlier parts, and generated personal-name recipes feed
the last override. The order above is the resolved grammar architecture.
The complete 154-form civilization/title meaning catalog and every unusual
combined-flag permutation are not certified; the private pseudocode is the
bounded next read. No native naming writer or generated Data file was run.
