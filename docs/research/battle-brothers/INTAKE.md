# Battle Brothers intake, 2026-10-08

Source-only assignment: [Battle Brothers dispatch](../../gm/dispatch/battle-brothers-2026-10-08/ASSIGNMENT.md). Tale of Immortal queue gate is satisfied by its completed [report](../tale-of-immortal/REPORT.md) and [checkpoint](../tale-of-immortal/CHECKPOINT.md).

Installed Steam app365360, build23856902, StateFlags4. Ten DAT containers are ZIP archives. Their script members use encrypted Squirrel bytecode; the UI also includes readable JavaScript/HTML. Only3,239 script/UI members were copied,30,222,117 bytes; all copied hashes match. No art/audio/books copied. Original archive SHA256s and member indexes are retained privately. No install changes, launch, user-save reads, uninstall, runtime edits, builds or commits.

The Adam Milazzo download failed through the web tool. Switched to [Enduriel/bbkit v0.1.3](https://github.com/Enduriel/bbkit/releases/tag/v0.1.3), with bbsq, Nutcracker0.02 and sq. Tools run in an isolated CrossOver research bottle. [Tool author documentation](https://www.adammil.net/blog/v133_Battle_Brothers_mod_kit.html) explains callback-bound decryption and known reconstruction bugs. A real farmhand script decrypted/decompiled and passed syntax compilation without executing it; selected debug bytecode was inspected. This qualifies bounded reading, not exact reconstruction.

All3,114 Squirrel members are retained;1,109 unique .nut outputs were emitted. The broad batch stopped after useful audit inputs were available. Remaining encrypted members are available for later targeted work. Emission count is not semantic coverage. See [receipt](EXTRACTION_RECEIPT.json); private RETENTION.json and RECOVERED.json bind each member/output to its hash. Raw proprietary code, prose and binaries remain outside Git.

Live YAIR mapping anchors inspected: src/activities.js (native job/training/gathering), src/data/locations.js (Village and reputation rewards), src/game_time.js (calendar), src/npc_lives.js (bounded Village family/news), src/life_record.js (lossy biography, explicitly not authoritative state), and src/event_feed.js (events surface). Existing owners supersede older north-star gap claims.
