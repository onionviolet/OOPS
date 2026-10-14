# Tooling and rerun ledger

No tool installs. No decompile, game launch, native computer control, injector, save inspection, settings change, Steam action, commit or push. Python scripts were authored locally and run with `python3 -I`. Only this research output directory was written in YAIRPG. Province War was read-only.

## Pins and routes

| Item | Pin / route | Use |
| --- | --- | --- |
| HoI4 install | `/Users/weiwei/Library/Application Support/Steam/steamapps/common/Hearts of Iron IV` | Read scripts/docs/metadata; Steam app 394360, build 25205862. App manifest contains private account fields, which are not reproduced. |
| Work area | `/Users/weiwei/.codex/research/hoi4/` | `tools/`, `extract/`, `notes/`, `repos/`; raw snippets and counts remain here. |
| Save parser | `https://github.com/rakaly/hoi4save.git`, commit `a3f1e65ec2da113652152a00aa32631182bbc03f` | Cloned to `repos/hoi4save`; read `src/file.rs`, `src/models.rs`, `tests/parse.rs`. No build/execution or fixture download. |
| Source hashes | `extract/SOURCE_HASHES.txt` | SHA-256 of 5,393 selected installed files, path-relative to install root. |
| Extract hashes | `extract/HASHES.txt` | Hashes of census, counts, archive inventory and saved raw snippets; separate from source hash manifest. |

## Commands that worked

Run from any directory; scripts hard-code the installation and work roots, making no source writes:

```sh
python3 -I /Users/weiwei/.codex/research/hoi4/tools/census.py
python3 -I /Users/weiwei/.codex/research/hoi4/tools/summarize.py
```

The census tokenizer discards `#` comments, preserves quoted strings and repeated keys, and walks braces. It is a structural scanner, not the Clausewitz engine or a complete grammar validator. `summarize.py` restricts event counts to top-level definitions in events/, focuses to direct focus-tree children, decisions to category children outside categories/, and macros to top-level blocks. Mission/time-removal counts are attribute counts; they overlap.

Initial recursive event-key hits included dispatch calls. Those exploratory figures were rejected; all published event counts use declaration positions. Top-level doctrine groups and distinct on-action names were separately counted from the same parser. Known gaps: malformed/native special syntax is not validated; declaration counts include inactive/debug/DLC variants; focus sharing references do not constitute another node. No claim of exhaustive chain graph validation.

Archive inventory: Python `zipfile` listed both dlc/ ZIPs. They contained zero common/events/history text rule members under the tested prefixes. The rule corpus and gates are largely in common/events/history; descriptors in dlc/ and integrated_dlc/ do not establish entitlement or runtime selection. Do not infer DLC content absence because its folder has no rule ZIP.

Source navigation used `rg`, `rg --files`, `sed` and pathlib reads. Authority/consumer reads: wave COMMON; PROJECT top 80; USER_VISION standing UI/option sections; abstraction inventory core; chain-build/modular-chain COMMON and T2; Province War README, prior HoI4 audits and AUDIT_WORK_QUEUE. No prior audit was used as a current runtime claim.

## Dead ends and switches

Expected `_documentation.txt` under decisions was absent; used `_documentation.md`. Generic MIO and AI-template guessed filenames were absent; switched to directory inventory and exact `00_generic_organization.txt` / `templates_GER.txt`. `src/storylets.js` was absent; read `src/storylet_deck.js`. T2's proposed `src/chain_inspector.js` was absent in this checkout; no missing-feature implementation was attempted.

Some early batched reads exceeded the tool output limit. Key rule passages were reread with bounded line ranges. Do not treat a truncated full-document dump as full semantic coverage.

Web searches for official save/DLC-removal guidance produced no usable exact schema proof. Switched to the save parser's primary repository. No failed HTTP fetch, retry loop, login or rate-limited wiki scraping occurred. Web search results on Reddit were not used as technical evidence. Shipped wiki HTML was inventoried by directory listing only and was not treated as current game documentation.

## Rerun constraints

After rerunning census, move its installed-file `HASHES.txt` to `SOURCE_HASHES.txt` before regenerating extract hashes. Do not overwrite the pinned reports with `write_reports.py` during coordinator integration without rechecking scope. Latest scripts stay in the work area, not the repo. Recheck current installation/build, relevant owner files and source hashes before using stored line numbers. New gameplay validation belongs to authorized implementation lanes, never this read-only research pass.
