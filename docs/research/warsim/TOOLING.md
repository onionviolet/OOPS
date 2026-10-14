# Tooling and mechanical rerun

No installs. No downloaded code was run. No repos cloned, so no repo commit
hashes apply. ILSpy and Ghidra were not invoked: native symbols, data files and
bounded objdump inspection answered the selected questions sufficiently for a
PARTIAL report. Windows executables were read as bytes, never run. Steam,
notproton, settings, private Saves/ and Scores/ were not changed.

## Provenance

Payload: `/Users/weiwei/Library/Application Support/Steam/steamapps/common/Warsim The Realm of Aslona/`.
App manifest: `/Users/weiwei/Library/Application Support/Steam/steamapps/appmanifest_659540.acf`.
Gate: StateFlags 4; StagingSize 0; downloaded 264,339,600 of 264,339,600 bytes;
staged 470,381,280 of 470,381,280 bytes. Build 25097075, depot 659541,
manifest 5839198804233680705. The manifest and exe prove installed recorded
payload, not macSteam compatibility or playable launch.

Warsim.exe: 20,947,051 bytes; SHA-256
`93d159754192876538b175b1a50a515e256806dce9f03e2d7f50a32880686e5f`.
PE machine 0x8664, 19 sections; console per file(1); CLR directory (0,0).
6,652 COFF symbol entries including auxiliaries, 5,972 parsed symbol records.
85,230 ASCII runs of at least four bytes. Compiler marker identifies
MinGW-W64 x86_64 GCC 14.2.0; libstdc++ and mangled C++ names corroborate it.

Work area: `/Users/weiwei/.codex/research/warsim/`.
`extract/`: strings.json/txt, symbols.json, runtime.json, inventory.json,
call_edges.json, six .asm files and topical string subsets.
`tools/probe.py`: standard-library-only static extractor, reads Data/Extras
and Warsim.exe but never traverses Saves/ or Scores/.
`tools/write_reports.py` and `write_remaining.py`: authors this lane's reports.
These authoring scripts are historical rerun records, not a source authority;
running them overwrites this output and should only be done by its owner.

## Commands that worked

```sh
file '/Users/weiwei/Library/Application Support/Steam/steamapps/common/Warsim The Realm of Aslona/Warsim.exe'
python3 -I /Users/weiwei/.codex/research/warsim/tools/probe.py \
  '/Users/weiwei/Library/Application Support/Steam/steamapps/common/Warsim The Realm of Aslona' \
  /Users/weiwei/.codex/research/warsim/extract
objdump -d --disassemble-symbols=_Z14HeroBackgroundv \
  '/Users/weiwei/Library/Application Support/Steam/steamapps/common/Warsim The Realm of Aslona/Warsim.exe'
```

Probe uses /usr/bin/objdump, Python struct to parse PE/COFF, regex ASCII
extraction retaining file offsets, and SHA-256. It disassembles RaceGenerator,
KingdomGenerator, MercGenerator, HeroBackground, FactionNameGenerator and
SetRaceEffects separately. Direct call sets are scanned from objdump output;
indirect calls and all-path reachability are not inferred. Native virtual
addresses use the binary's preferred image base, not an observed runtime.

`extract/HASHES.txt` hashes the executable, all 255 inventoried source text
files and generated extract files. Settings files are counted/hashed, not used
to infer personal preferences. Unread text paths are listed in TABLE_COVERAGE.md.
Raw strings, prose, disassembly and hashes of source tables stay outside git;
repo outputs contain analysis, counts and tiny identifiers only.

Web: functions web search/open/find on developer itch.io, official store,
Steam product/discussion pages, developer Reddit comments and the original
GitHub wiki. URLs and dates are in SOURCES.md. No wiki bulk crawler or repeated
requests; one page failure switched route. No browser/native UI automation.

## Dead ends and limitations

- Initial output directory absent; created only this lane's authorized folder.
- Broad file inventory and combined reads produced truncated tool output.
  Switched to Python JSON inventory and bounded table/call summaries. Counts
  in reports come from the saved structured inventory, not truncated lists.
- A guessed `docs/RESEARCH_GAME_INSPIRATIONS.md` path did not exist. Used the
  actual acquisition queue and coverage-refresh report for prior findings.
- Fandom Races page failed with an internal fetch error. Switched to Huw2k8's
  original GitHub wiki. No Fandom retry variants or formula claims.
- Full native resolver reconstruction was not undertaken. Exact precedence,
  probabilities, dispatch and save lifecycle stay OPEN. A later Ghidra pass
  should name one such question, not decompile the entire game by default.

## Checks performed

Re-read installed manifest and exe hash after extraction; parse FINDINGS.json;
verify required output files, 24 touch IDs, proposal/packet counts, local links,
physical table counts, absence of raw payload dumps and em dashes. These check
artifact integrity and static evidence. No YAIRPG tests, build, browser route
or persistence checks were run because this lane changed no runtime code.
