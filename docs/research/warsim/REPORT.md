# Warsim: reusable traits inside a broad text kingdom sim

2026-10-14. Status: PARTIAL, substantive static audit delivered.

Warsim gets variety from authored pools, composable modifiers and the reuse of
one generated identity in several systems. It also contains large amounts of
handwritten dialogue and encounter logic. A huge combination count is not a
count of distinct decisions. YAIRPG should borrow the pattern of a generated
fact changing a choice, then give that fact a stable address and a real reader.
Do not borrow raw tables, prose, assets or native code.

**F1 SHOWN:** install gate passes for Steam build 25097075. The executable is
native x86-64 C++ console code, with no CLR directory. ILSpy is inapplicable.
The payload retains COFF symbols. Six named functions were disassembled, with
raw output kept outside git. [Tooling and evidence](TOOLING.md).

**F2 SHOWN:** kingdom construction calls race, faction-name, face, flag,
currency, crown, phrase and building generators. Mercenary construction calls
several of the same helpers. This is concrete reuse, not just similar wording.
[Generation digest](GENERATION_DIGEST.md#native-joins).

**F3 SHOWN:** 101 base race rows, 379 modifier rows, 3,528 personal suffix rows,
286 hero-story lines, 333 mercenary-story content rows and 33 local talk files
with 2,630 lines. These are content measurements, not encounter or option
counts. Some rows are cosmetic and some carry numeric fields or behavior codes.
[Content digest](CONTENT_AND_SCOPE_DIGEST.md).

**F4 SHOWN/INFERRED:** executable menus describe wages, harvest, trade, tribute,
revolt, arena bets and policy gates. They identify intended loops, not exact
resolver probabilities. One small native helper demonstrably selects a whole
hero-story line with C rand and remainder arithmetic. Prose there is not a
simulated personal history. [Loops](KINGDOM_LOOPS_DIGEST.md).

**F5 STATED:** developer pages explain the growth of the game and historical
balance trouble. Those statements are dated evidence, not proof of this build's
behavior. [Source notes](SOURCES.md).

## Ranked PROPOSALS

All P rows are proposed integration work, not accepted design or implementation.
Keep reasonable repeated options reachable. World-specific canon comes first;
these ideas do not authorize a second realm or prestige layer.

| Rank / ID | Proposal and visible result | Existing owner to consult | Foundation fit |
|---|---|---|---|
| 1 / P1 | One generated faction trait changes a negotiation condition, one resource flow and its known description | `docs/GENERATION_FOUNDATION_RULES_2026-10-14.md`, `docs/CHARACTERS_AND_WORLD_EVENTS.md` | GR8, GR12, GR15; use the existing kit, no parallel RNG |
| 2 / P2 | Role-qualified name and story pools reuse one person record across work, encounters and logs | `docs/CHARACTERS_AND_WORLD_EVENTS.md`, generation foundation | GR3, GR5, GR7, GR15; store fact IDs rather than authoritative free prose |
| 3 / P3 | Mobilizing productive residents shows the work/income they will miss, then records real loss and return | `docs/ENGINE_EXPANSION.md`, relevant world economy owner | GR12 and GR13; useful also to Province War |
| 4 / P4 | Policy changes show who objects and which offer becomes available or blocked | `docs/worlds/NONHUMAN_SOCIETY_LAW_AND_ECONOMY_2026-10-14.md`, characters owner | GR5, GR8; society policy belongs to the faction, not species morality |
| 5 / P5 | A contextual petition creates one useful repeatable route, with delegation for routine resolutions | `docs/CHARACTERS_AND_WORLD_EVENTS.md`, generation foundation | GR11, GR12, GR17; backlog budget, quiet outcomes and receipts |
| 6 / P6 | An arena or competition gives purposeful training, patronage and records, with understandable stakes | `docs/ENGINE_EXPANSION.md`, thematic UI owner | GR9 and GR12; keep risk and payout models separate |
| 7 / P7 | A world profile layers the same pool instead of copying it into each world | generation foundation, relevant world brief | GR6, GR7, GR8, GR10; canon stays qualified and local |
| 8 / P8 | Measure content by reachable choices and downstream readers, then ship one themed playable slice | `PROJECT.md` priority summary, generation foundation | GR11, GR12, GR16; no combinatorial quota or fixed once-only rule |

Concrete work boundaries and observable gates: [implementation packets](IMPLEMENTATION_PACKETS.md).
Small detail menu: [24 touches](SMALL_TOUCHES.md).
Province War can cite [the short strategy fit](PROVINCE_WAR_FIT.md) without
copying this dossier or changing its own packet register automatically.

## Prior findings: confirm, correct, extend

| Earlier surface | Disposition | Current evidence and limit |
|---|---|---|
| Acquisition queue row 12: engine unverified, buy gate | Correct current state | Owned per task; executable now present, native C++ identified. Leave original owner edits to coordinator |
| Coverage refresh report local inventory: no executable matching watcher | Supersede snapshot | This lane reads Warsim.exe and fully installed manifest. Earlier inventory can have been accurate when taken; no claim its scan was faulty |
| Coverage refresh: no Warsim audit / in flight | Extend | This directory now contains a PARTIAL static dossier with named unread gaps |
| Generation foundation GR12: output needs a reader | Confirm design usefulness | Race numeric fields, native generator composition and menus show why output should enter several loops. No YAIRPG consumer or gameplay test added here |
| Foundation GR1/GR2/GR15 | Contrast | Native HeroBackground uses mutable C rand and stores whole selected text. It is not evidence that Warsim meets YAIRPG's addressed or fact-linked contract |
| Headline 94,887,852 races on developer/store pages | Qualify | Stated combination figure, not reproduced from this build; 101/379 are actual local row counts, not enough to derive valid-combination totals |

## Verification and open gates

Verified PE header, full text-file inventory and hashes, COFF names, six direct
call sets, core table field widths and bounded native instructions. No game
launch, save read, gameplay, save/reload or import test. Exact battle resolver,
economy arithmetic, weighted encounter dispatch and generator save lifecycle
remain unread. [CHECKPOINT.md](CHECKPOINT.md) lists every gap and next route.
No gameplay completion or director acceptance is claimed.
