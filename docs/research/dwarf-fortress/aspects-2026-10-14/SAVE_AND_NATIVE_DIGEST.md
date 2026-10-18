# Priority native and persistence receipt

Pinned executable: 26,507,264 bytes, SHA256 205770918fd54c96cbbcf89223ebd449e2e113c7c873ed81177c4511a3450db7, image base 0x140000000. PE32+ AMD64, no export or CLR directory. REA uses Ghidra 12.1.4 with the prior trial's locally bounded launcher. No game code executes.

| Query | Discovery receipt | Static result | Limit |
|---|---|---|---|
| TEXT_SET loader | Literal 0x1416cf5a8; xref 0x14131e0e3; unwind range 0x14131de00..0x14131e4b4 | Bracket header parsing, name record match/allocation and nonempty content append | Raw record loading only; substitution and graph/action selection unread |
| Text-set switch | Kin-name literals; xrefs 0x14131e9ff and 0x14131ea74; range 0x14131e4f0..0x14131eeaa | Function starts at an indirect jump | Unrecovered jump table, not a successful semantic selector read |
| Save failure handler | Diagnostic 0x141605dc0; xref 0x14154925e; range 0x14154919c..0x141549395 | Message-building helpers, status write 0x33, exception cleanup | Handler, not proof of success path, rollback, flush or sync gate |
| Load abort handler | Diagnostic 0x1416ac840; xref 0x14157c89d; range 0x14157c890..0x14157c96e | Prefix plus exception detail, diagnostic helpers and status write 0x33 | No corrupted fixture, semantic status name or recoverability proof |

REA returned status ok on all four queries. One body contains an explicit unrecovered-jump-table warning, so API success is not semantic completion. The three other bodies retain uncertain signatures/helper names. Source names DF_candidate_* are analyst labels and are not recovered engine symbols. Private native-targets.json records PE section mappings, RIP-relative candidates and .pdata boundaries. Native pseudocode and the whole MCP evidence envelope are retained privately in extract/.

Default persistence controls: d_init_default.txt:6-17 describes rotation over three autosave slots, optional initial save, pause after save and pause on load. init_default.txt:98-100 supplies compression. Autosave prose uses SEMIANNUALLY but the value is SEMIANNUAL. AUTOBACKUP appears only in a comment. Release notes:6-23 provide backup and broad compatibility guidance; they do not prove migration for each installed mod/version combination.

No actual save file was opened. Exact bytes, version header, serialization field map, migration chain, compressed stream type, saved-versus-derived partition, time delta, checksum, temp-file rename/flush, rollback and cloud synchronization remain unread. The native string inventory is a locator aid only; file names in strings do not establish the complete format. Readable default files are not the user's current preferences.

Proposal P4: keep a bounded recovery ring separate from deliberate manual retention and expose failures with a useful diagnostic. Owners: src/expansion_persistence.js and docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md. Existing YAIRPG persistence authority remains unchanged; a later selected implementation requires genuine save/reload/import and injected failure checks. No new format or compatibility policy is chosen here.
