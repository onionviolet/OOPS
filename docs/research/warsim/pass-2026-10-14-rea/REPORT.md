# Warsim REA follow-up

2026-10-14. **Status: PARTIAL, substantial native follow-up delivered.**

Warsim uses several distinct event schedulers, names that can change stats,
and a large positional save stream. This pass resolves their architecture
and selected exact formulas. It does not certify every branch of the huge
native kingdom/battle routines. No game, private save or YAIRPG runtime was
opened or changed.

**F1 SHOWN:** turn dispatch draws 120 slots, with at least 62 direct quiet
slots; exploration redraws rejected 35-way candidates; ProcGenExplo's 24
slots map to 19 entry points. The livestock-aid petition is traced from
visitor selection through its 100-gold payment, shared reaction and visitor
consumption. [Dispatch](EVENT_DISPATCH_DIGEST.md).

**F2 SHOWN:** the typed-name alias chain, suffix/stat resolver and generated
alphabet recipe are recovered. All 50 installed alias files resolve without
cycles. Faction grammar has role/civilization filtering, rejection loops,
later overrides and a direct NameWriter join. Its full rare-form meaning
catalog is still open. [Names](NAME_AND_LORE_DIGEST.md).

**F3 SHOWN:** harvest starts from available labor, has a 15-way weather draw
and ordered integer modifiers. Soldier upkeep uses whole-cohort affordability;
unpaid groups above nine can desert by `rand()%floor(S/10)`. Battle damage
samples living-unit counts, retains partial injury and returns surviving
peasants. Ordered recruiting caps join request, available pool and treasury.
Arena stakes, draw refunds and 1.5/2.0 winning credits are traced.
Full combat and economy coefficients remain open. [Formulas](ECONOMY_AND_BATTLE_DIGEST.md).

**F4 SHOWN:** the save writer has 1,903 named field writes plus a sentinel;
LoadGame's first count gate expects 1,904 period-delimited tokens. Generated
faction identity and multiple story strings are retained; companion roster
files also matter. Full string-reader joins, old-format branches and recipe
retention remain open. [Persistence](SAVE_FORMAT_DIGEST.md).

**F5 SHOWN / INFERRED:** REA and direct Ghidra recover the same selected name
chain. The cold queries took 9.67 and 11.01 seconds respectively, single
observations under concurrent host load. REA is a useful batch interface,
not a second decompiler. `ok` status masked unresolved switch recovery in
large event functions. [D2 second data point](REA_TRIAL.md).

## Ranked PROPOSALS

All P rows are proposed design work. Existing live owners and later director
choices remain authoritative. The generation foundation document itself is
a proposal, not an accepted new gate. One realm/one prestige scope remains;
no fixed once-only restrictions are introduced.

| Rank / ID | Visible result | Owner system to consult |
|---|---|---|
| 1 / P1 | Mobilization previews missing production and later shows actual survivor return and worker loss | `docs/ENGINE_EXPANSION.md`, world economy owner; Province War intake |
| 2 / P2 | One scheduler declares quiet weight, eligibility, caller cadence and repeat state; known reasons explain unavailable routes | `docs/CHARACTERS_AND_WORLD_EVENTS.md`, generation foundation proposal |
| 3 / P3 | A repeatable local petition transfers real funds and changes one recipient fact, with optional funded delegation | characters/world-events owner, world society/economy owner |
| 4 / P4 | Name, title, biography and event receipt reference the same known facts; a name never grants an unearned feat by itself | characters owner, generation foundation proposal; `src/character_bio.js` is an existing reader |
| 5 / P5 | A revealed generated person keeps identity and recipe revision across reload/import; unseen content can use revised pools | generation proposal, `src/save_compatibility.js`, persistence owners |
| 6 / P6 | An affordability panel separates quoted cost, actual debit, labor loss and later receipt, with meaningful small-rounding cases | engine/world economy owner, thematic UI owner |
| 7 / P7 | Competition separates fighter facts, probabilistic resolution and treasury settlement, with clear stake/refund/net gain | engine combat owner, thematic UI owner |
| 8 / P8 | Research intake requires a useful changed action and an explicit recovery limit; a successful tool envelope is not gameplay proof | existing research and verification owners; shared tool-fit D2 |

Proposed bounded execution: [five packets](IMPLEMENTATION_PACKETS.md).
Detail menu: [24 small touches](SMALL_TOUCHES.md).
Strategy intake: [updated Province War fit](PROVINCE_WAR_FIT.md).

## Confirm, correct or extend the prior pass

| Prior claim / gap | Disposition | This pass adds |
|---|---|---|
| Native C++ and retained COFF symbols | Confirm | Current exe hash matches prior; symbols provide selected addresses without redoing the original inventory |
| Event probabilities unread | Extend | Concrete dispatch ranges, shared-slot weights, quiet capacity, rejection behavior and one end-to-end petition; complete branch/cooldown matrix stays open |
| Name aliases unread | Extend | Alias graph validates, typed resolver and generated recipe loops recovered; faction grammar stage order and late override identified |
| Whole authored story line selected | Preserve | Prior HeroBackground read reused, not repeated; writer retains MStory and champion/adventurer stories, which still are prose rather than simulated histories |
| Economy/arena amounts are menu evidence | Partly upgrade | Selected harvest/wage/casualty/arena transfer formulas now have native evidence; market and full annual balance claims stay qualified |
| Army count, quality and effects should stay distinct | Strengthen | Unit-count target selection and a separate count*quality score setup make this distinction concrete |
| Save lifecycle unread | Extend | Positional token count, field-write census, numeric reader alignment, retained text families and companion paths; no runtime retention claim |
| Province War P1 mobilization fit | Strengthen | Labor base and explicit survivor return support the fit; PW chooses its own coefficients and queue |
| REA parked for one D2 trial | Extend only | Second measured chain plus a recovery failure example; no global tool dependency or shared owner edit |

## Checks and limits

Executable hash matched; selected function addresses mapped from retained
symbols; relative jump tables parsed; name aliases validated; save writer and
integer-reader sequences compared; selected formulas cross-checked in native
instructions and mapped constants. Artifact checks cover required files,
JSON, local links, identifiers, output scope and private extract hashes.

Ghidra full-auto-analysis stayed disabled. Large selected direct queries timed
out and were kept as failed receipts. The repeated failure pattern led to
assembly and bounded REA slices, then the direct batch was stopped. No game
launch, save/reload/import, UI build/browser proof, commit, push or installation
was performed. This is static research with a named unread table, not gameplay
completion or accepted product design. [Checkpoint](CHECKPOINT.md) owns the
remaining gaps and mechanical restart.
