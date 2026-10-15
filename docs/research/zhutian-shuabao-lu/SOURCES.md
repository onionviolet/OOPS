# Evidence map

Lane `lib-zhutian`, dispatch 2026-10-14, inspected 2026-10-15. Research and PROPOSALS ONLY.

Installed root: `~/Library/Application Support/Steam/steamapps/common/诸天刷宝录/`.
Archive: `package.nw`, SHA-256 `7082f6193695ef4a2efaf2848436e5c54838a8920a0b366cbc1650fd0c7815c0`. ZIP entries: 367. Manifest version: `0.5.1.0`. This is the package's own version, not a Steam build ID.

All internal paths below resolve under `~/.codex/research/lib-zhutian/extract/`. Paths starting `project/` are zero-based JSON pointer components inside `data.json`. All indices are build-specific. `notes/` below means `~/.codex/research/lib-zhutian/notes/`.

| Code | Locator | What it establishes |
|---|---|---|
| S01 | `index.html`, `package.json`, `scripts/c3runtime.js` | Construct generator, NW.js wrapper, manifest, engine/plugin implementations |
| S02 | `data.json: project/3, project/5, project/6` | 1,407 object-type definitions, six layouts, six event sheets, not 1,407 independently active gameplay entities |
| S03 | `wm.json`, `cj.json`, `sq.json`, `shili.json` | Plane, scene, encounter-region and faction definitions |
| S04 | `bz.json`, cells listed in digests | In-game help, STATED behavior even though the bytes are SHOWN |
| S05 | `data.json: project/6/0/1/157/8/7/8/6` | Enter-plane/otherworld handlers; save coordinates and map refresh |
| S06 | `data.json: project/6/5/1/53`; runtime expression IDs 10418-10453 | Drop consumer, probability tables, equipment/material branches |
| S07 | `data.json: project/6/0/1/155/8/3/8/7`; runtime expressions 420-433 | Normal/backup slot serialization, LocalStorage and NW.js text writes |
| S08 | `data.json: project/6/0/1/155/8/4/8/10`; runtime expressions 719-733 | Base time, calendar and pause/autosave paths |
| S09 | `data.json: project/6/0/1/155/8/4/8/3`; `dh.json`, `dhmb.json` | Dialogue execution, typed text, speaker/portrait, event dispatch |
| S10 | `js.json`, `zy.json`, `jn.json`, `sx.json`, `mg.json`, `mp.json` | Shared actors, careers, skills, stats and destiny content |
| S11 | `data.json: project/6/0/1/157/8/8/8/6/8/18/8/7/8/0` | Rebirth function; requirement comparisons and tier/level increments |
| S12 | `data.json: project/6/0/1/157/8/8/8/6/8/26/8/30`; `bm.json`, `jz.json`, `kj.json`, `pf.json`, `ss.json` | Dispatch, departments, buildings, research, recipes and shop facilities |
| S13 | `data.json: project/6/0/1/157/8/9/8/15`; expressions 8820-8822 | Packed plane progress, derived floor and difficulty |
| S14 | `data.json: project/6/5/1/56`, `project/6/5/1/57` | Separate auto-mode groups and battle settlement/retry |
| S16 | `data.json: project/6/0/1/155/8/4/8/2`; expressions 517-552 | Compact online idle-display window/canvas, activity/status and return handlers |
| S15 | `data.json: project/6/0/1/157/8/14`; `sj.json`, `sw.json`, `csdj.json`, `cszb.json`, `cscz.json` | Additional divine-world subsystem; existence and selected promotion function only, not full coverage |

Private deep record: complete extracted content tables and event data, `notes/events.pretty.json`, `notes/events.decoded.json`, `notes/event-strings.tsv`, `notes/event-groups.tsv`, `notes/expressions.json`, selected `*.decoded.json`, and `extract/HASHES.txt`. Full original text stays there. No game code was executed to decode these files; the decoder uses text parsing and JSON only. A decoded expression retains its bound object/variable/function references rather than guessing a name from a number.

SHOWN means inspected installed definition or executable consumer, not observed play. STATED means authored help. INFERRED means interpretation. No game launch, screenshot, save-file read, import, or native acceptance occurred. `record*.dat` and DLC info files were left unread. No external fetch or tool install was needed.
