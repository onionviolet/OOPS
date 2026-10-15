# Save format and retention

Static native evidence only, build 25097075. No private Saves/ or Scores/
was listed or read; no game, SaveGame or LoadGame routine was run.

## S1: positional text stream

`SaveGame` at `0x14078fc02` constructs `Saves/<chosen-name>.txt`, opens an
output stream and writes values separated by periods. The regular body starts
at `0x140790188` and ends with the literal `ENDOFFILE` at `0x1407a2532`.

A mechanical scan recovered **1,903 named field writes: 1,454 integer writes
and 449 string writes**, in native order. The writer references 1,901 distinct
field names because Spymaster and MonsterChallenge each appear twice. These
are write-site counts, not a guarantee of valid arbitrary edited saves.
The trailing sentinel supplies the 1,904th token expected by the reader.

`LoadGame` at `0x140767166` first counts period-separated tokens. At
`0x1407676d1` it compares with `0x770`, or 1,904. A SkipLoad flag can bypass
that count rejection. It then reopens the file, uses period-delimited getline,
parses integers with stoi and assigns strings in sequence. It has later
count-dependent compatibility branches. The file is not JSON, a struct dump,
or a keyed field map.

All 1,454 scanned integer read sites align with the integer write sequence,
except the saved `seconds` value loads into `BonusSeconds` at
`0x140772e52`. That establishes a timer mapping, not a bug or precise elapsed
play-time semantics. String reader order and every old-count compatibility
branch remain unreviewed. Private `notes/save-schema.json` retains field
locators and the sequence mismatch; raw schema stays outside git.

## S2: what the writer retains

| Retained family | Tiny examples / writer evidence |
|---|---|
| Treasury and economy | ArenaFund, YourGold, BankGold, LandTax, HarvestShrine |
| Population and armies | YourPeasants, YourSoldiers, slave and independent unit state |
| Time and political state | Year, PublicOpinion, RandomEventMode, NoBegging and other policy flags |
| Generated faction identity | Five IRACE strings and independent faction names, unit stats and leaders |
| Arena history | Champion/GrandChampion names, score, wins, defeated rival and face |
| Generated mercenary lore | MStory1..5 at `0x14079c98a` onward |
| Champion/adventurer lore | CCFHStory, ACStory1..5, GrandChampionStory |
| Exploration and callback state | Selected discovered sites, encounter flags and callback records |
| Later systems | Monster levels/XP and many content-specific variables |

The writer does not serialize a single abstract faction object. It serializes
many fixed global slots, retaining both facts and whole generated text. The
prior HeroBackground selection claim remains: stored story prose alone is
not a real simulation history.

## S3: companion files and compatibility limit

After the main stream, SaveGame writes/copies companion files tied to the save
name. Native paths include `NobilityOne.txt` through `NobilityFive.txt` and
`Adventurers.txt`, with corresponding source data paths. This means a main
text save should not be assumed to contain the whole dynamic roster.
LoadGame references the same companions. The complete companion naming,
copy semantics and all record schemas remain open.

No rand/srand or RNG-state write appears in the selected SaveGame body. This
is a negative observation on that writer, not proof of reproducible continuation
or of every seeding route. Generator recipe files under Data/Names are a
separate mutable artifact; their save-copy lifecycle was not established.

## Proposed adaptation

Preserve YAIRPG's versioned compatibility owners and original saves. Store
stable identity/fact IDs and needed generation recipe/version state in the
existing envelope; keep presentation text derived where possible. Verify
save/reload and literal import across a changed-positive example before
claiming retention. Warsim's exact field count is useful research evidence,
not a proposed YAIRPG storage format.
