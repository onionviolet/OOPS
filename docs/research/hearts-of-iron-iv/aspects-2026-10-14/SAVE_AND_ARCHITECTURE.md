# Save and architecture evidence boundaries

## S1: Installed build, not a complete serializer

`common/defines/00_defines.lua:7-8` declares major 33 and minor 0. The comment says minor versions identify backward-compatible save versions. This is STATED policy. `interface/settings.gui` names autosave interval and cloud controls. The executable is x86_64 Mach-O; static strings expose save_version, minor_save_version, save_as_binary and names for rotating autosaves. They also include invalid air-base/carrier and production archetype diagnostics. SHOWN strings demonstrate that such diagnostics exist. They do not prove error recovery, atomic writes, universal save rejection or safe removal of optional content.

Native type strings include CGameStateLoadThreaded, CGameStateSaveThreaded and DoCountryHourlyUpdates with TBB parallel templates. This is compiled-name evidence only. No disassembly/decompile, body tracing, runtime scheduling, speed measurement or race/failure test was performed. The source data supports scoped effects and several cadences; it is not a complete engine implementation. Lua autoexec exposes native binding/module initialization; actual game rules also live in text databases and native code.

## S2: Pinned parser coverage and the prior correction

Read-only clone: `/Users/weiwei/.codex/research/hoi4/repos/hoi4save`, commit `a3f1e65ec2da113652152a00aa32631182bbc03f`. Primary project: [rakaly/hoi4save](https://github.com/rakaly/hoi4save/tree/a3f1e65ec2da113652152a00aa32631182bbc03f).

SHOWN `src/file.rs`: seven-byte HOI4txt/HOI4bin routing, unknown-header rejection, text/binary deserializers and a binary melt route with token resolver. `src/models.rs` is a deliberately small typed projection of date/player/countries and stability/war support/variables. This is not an authoritative exhaustive engine schema. `tests/parse.rs` includes older 1.10 fixtures and a 1.17 new-format binary fixture. It skips binary cases by returning Ok when token data is empty. Prior SAVE_SHAPE's statement of only older fixture coverage is incomplete; this lane does not edit that prior file.

`tests/utils.rs` defines a public fixture CDN. One attempt to fetch its 1.10 text sample returned 403. No retry variant was attempted and no game/user save was used instead. Continued evidence comes from local source/installed diagnostics. Browser access to the pinned GitHub page also failed; the already pinned local clone was the successful route. Parser tests and fixture parsing were not run. No new clone or install.

## S3: Retained versus derived, migration and absence

STATED special-project docs describe retained initial/prototype work and restarted establishment work. That indicates intended mutable state, not exact serialized field names. Source definitions and history files provide authored/initial data. Which live caches, queues, random streams and derived values are written is unread. Migration mappings, corrupt-file fallback, autosave atomicity and removed DLC/mod restoration cannot be inferred from file headers or compatibility descriptor flags. No offline wall-clock progress model was established.

PROPOSAL: selected YAIRPG domains preserve consequential progress/choices, stable identities, reserved means and content revisions; recompute only declared pure projections. Existing `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md`, `src/save_files.js` and `src/save_compatibility.js` own policy and validation. Do not create a parallel serializer from this research. A current-build disposable fixture and explicit serializer tracing would be the next source gate; natural save/reload/import remains a separate playable gate for any chosen adaptation.
