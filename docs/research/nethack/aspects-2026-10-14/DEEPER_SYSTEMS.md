# NetHack: deeper systems, 2026-10-14

The top three newly covered systems per game are ranked by practical payoff to existing YAIR owners. These are new depth beyond the supplied selected-mechanic dossiers, not new product requirements. Each source route is static evidence.

## NetHack

### D1: Stateful quest text and durable recap

Entry: chat_with_leader selects a branch from Qstat, carried-object and location checks. Assignment and completion mutate gameplay before later encounters select new IDs. com_pager_core resolves a role/common key, lazily loads its cached sandbox-configured Lua state, selects authored or random-array text, expands names, chooses a window and saves a synopsis to history. Missing tables follow a fallback/error route. The data file is not the quest state machine. A01 is covered for this route; every role and line condition is not semantically read.

Sources: [src/quest.c:270-460](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/quest.c#L270-L460), [src/questpgr.c:470-684](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/questpgr.c#L470-L684), [dat/quest.lua:1-35](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/dat/quest.lua#L1-L35), [src/sounds.c:1259-1345](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/sounds.c#L1259-L1345).

PROPOSAL and later gate: In src/data/dialogues.js and src/components/dialogue_component.js, author a short event recap separately from full text. Commit a useful result once, reopen the conversation and confirm the new state controls the next line. Refused or repeated reading must not duplicate rewards.

### D2: Restore is a reconstruction process with destructive edges

The save stream has format/critical-size/version information, player name, current level, global state and other levels. Runtime references must be relinked; equipped gear and hero sequence are reconstructed, while quest state and object knowledge have durable owners. check_version rejects version/configuration mismatch. dorecover can delete a save after restgamestate failure, so compatibility checks alone do not imply preservation. Crash recovery and SFCTOOL backends remain unexercised.

Sources: [src/save.c:160-305](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/save.c#L160-L305), [src/restore.c:600-730](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/restore.c#L600-L730), [src/restore.c:790-862](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/restore.c#L790-L862), [src/version.c:374-421](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/version.c#L374-L421), [src/timeout.c:2655-2745](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/timeout.c#L2655-L2745).

PROPOSAL and later gate: src/save_compatibility.js and src/native_storage_transaction.js should parse into an isolated candidate, rebuild derived links and publish only after validation. Gate: corrupt/unsupported candidate fails without changing current state or its last good artifact; generated save/reload/literal Import retain exact task/actor identity.

### D3: Timer identity has a location scope

run_timers pops a due timer before its callback. save_timers partitions global and level timers, including migrating objects versus objects staying on a level. restore_timers reconstructs timer elements and can adjust ghost-level deadlines; later relinking resolves object IDs. This prevents treating a timer as an anonymous number detached from its subject. Off-level elapsed simulation and closed-app catch-up remain separate unread policies.

Sources: [src/allmain.c:173-290](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/allmain.c#L173-L290), [src/timeout.c:2210-2255](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/timeout.c#L2210-L2255), [src/timeout.c:2655-2745](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/timeout.c#L2655-L2745), [src/restore.c:618-642](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/restore.c#L618-L642).

PROPOSAL and later gate: src/simulation.js should persist deadline, subject and area/lifetime together. Gate: save while a job is pending, change area and reload; it settles once at the correct owner, or pauses with an explicit missing-subject result. No automatic browser-closed reward policy is inferred.

