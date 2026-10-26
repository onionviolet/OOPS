# Minecraft cultivation-mod absorption wave, 2026-10-25

Authority and shared rules: [COMMON.md](COMMON.md) (quotes Weibao's four requests). Docs-only absorption audit: lanes download locally, read text, menus and features, and grade them A/P/M/U against current primary source using the CG01-CG30 ledger of the [2026-10-24 cultivation check](../../../research/itch-io-2026-10-22/CULTIVATION_ABSORPTION_CHECK.md). No runtime edits, because the live [cultivation implementation run](../cultivation-absorption-2026-10-24/CHECKPOINT.md) owns those files. Lanes run in the primary checkout so uncommitted cultivation work counts as present. Rules: WPR, AU1-AU15, AD5, AD37, AD38, sealed secrets.

Launched about 11:00 EDT via `runs/launch.py` (setsid double fork, `codex exec --approve-for-me`, workspace-write). Downloads: `docs/research/minecraft/private/cultivation-2026-10-25/` (gitignored). Reports: `docs/research/minecraft/cultivation-mods-2026-10-25/`.

| Lane | Prompt | Model | PID / PGID | Session ID | Report |
|---|---|---|---|---|---|
| M1 Xiaoxiang Cultivation World | [M1](M1_xiaoxiang.md) | gpt-6.1-sol medium | 72726 / 72725 | 01a17367-ea1e-77f0-966b-55cf8a0a0819 | M1_XIAOXIANG.md |
| M2 ChangShengJue | [M2](M2_changshengjue.md) | gpt-6.1-sol medium | 72729 / 72728 | 01a17367-ea36-77f3-8a47-0ba818856cc2 | M2_CHANGSHENGJUE.md |
| M3 Ascension (MrEizy) + other repos | [M3](M3_ascension.md) | gpt-6.1-sol medium | 72732 / 72731 | 01a17367-ea53-73f3-95b1-781c394570ef | M3_ASCENSION.md |
| M4 Lord of the Mysteries mods (4) | [M4](M4_lotm_mods.md) | gpt-6.1-sol medium | 72735 / 72734 | 01a17367-ea6d-77d2-9385-cb3d1e9f2af4 | M4_LOTM_MODS.md |
| M5 Other xianxia Modrinth mods (5) | [M5](M5_xianxia_others.md) | gpt-6.1-sol medium | 72738 / 72737 | 01a17367-ea7f-7251-994b-4b28ea45d0dd | M5_XIANXIA_OTHERS.md |
| M6 Scout beyond Modrinth (RI, Shadow Slave, CurseForge, mcmod.cn) | [M6](M6_scout.md) | gpt-6-luna medium | 72741 / 72740 | 01a17367-ea92-7db2-9bb4-b562c59ff2ea | M6_SCOUT.md |
| M7 Web-novel adaptation mods (LOTMCraft, RI Gu mods, Shadow Slave mods) | [M7](M7_webnovel_mods.md) | gpt-6.1-sol medium | 79864 / 79863 | 01a1736a-527a-7fc0-a900-133713f064fb | M7_WEBNOVEL_MODS.md |
| M8 Reddit player-voice pass | [M8](M8_reddit_voice.md) | gpt-6.1-sol medium | 79867 / 79866 | 01a1736a-529c-70e3-8174-af09c5cc0f3e | M8_REDDIT_VOICE.md |

Check: `kill -0 <pid>`; logs and last messages in `runs/`. Stop: `kill -TERM -<pgid>` (never `pkill -f`). Resume: `python3 runs/launch.py <name> <prompt> <workdir> <model> <effort> <session_id>`.

Coordinator fold after returns: spot-check cited facts, then fold gaps into the cultivation check ledger, LOTM queue and systems register by hunk; queue M6's proposed next lanes for Weibao.

## More to consider, round 1 (2026-10-25)

Weibao: "/more-to-consider, look thorugh relevant reddits too and more". Lanes M1-M6 were live and downloading (sandbox network escalation works; ChangShengJue jar and the Ascension clone landed).

SHOWN: Reddit pages and JSON refuse automated fetches; the Pullpush archive API answers and found threads that the Modrinth search missed: LOTMCraft (CurseForge, NeoForge 1.21.1, the most-discussed LOTM mod), a Gu Daoism Reverend Insanity mod and a Chinese RI mod tutorial, Shadowbound and other Shadow Slave mods, "MY LOTM Minecraft RPG", a quasi-LOTM/COI mod, and an r/feedthebeast cultivation mod launch thread. Web search added CurseForge-only Shanhaixiantu and Immortality: The Path of Cultivation.

ACT NOW (done):
- MC1. LOTMCraft, Gu and Shadow Slave mods had no owning lane (M4 is Modrinth-only; M6 lists without absorbing). Dispatched M7.
- MC2. Player voice was absent from every lane. Dispatched M8 over cultivation, web-novel and idle-game subreddits through Pullpush.

ACCOUNT FOR NOW:
- MC3. Idle translation: Minecraft mods are real-time voxel play. Every absorb proposal must say which job, choice, preview or panel replaces the action. Added to COMMON for M7/M8; M1-M6 started before it, so the fold applies it to their proposals.
- MC4. Overlap: M6 lists, M7 absorbs; M7 reads M6/M4 partial reports first. Duplicated finds are reconciled at fold, not by stopping lanes.
- MC5. Fan adaptations are not canon. LOTM proposals cite our source notes over mod values; our sealed LOTM truths stay sealed in reports.
- MC6. Reddit text is copyrighted user content: paraphrase, one short quote per thread at most, no usernames in committed docs.

LATER / DELEGATE (proposals, not dispatched):
- MC7. mcmod.cn census of Chinese-only cultivation mods and modpacks (1.7.10 to 1.12 era included) after M6 returns. Luna medium, one session; done when each has a ranked row and download status.
- MC8. Video evidence for mods without text docs (Bilibili RI mod showcases, YouTube creators such as Amasqo) through the media transcript tools in docs/TOOL_REGISTRY.md. Luna, small; done when each target has a transcript summary or a recorded unreachable route.
- MC9. Tale of Immortal (鬼谷八荒) Steam Workshop has an RI "蛊真人(蛊界)" mod: check the acquisition queue and whether Weibao owns the game before any read. Coordinator, minutes.
- MC10. Hytale cultivation mod (CurseForge Hytale) is a different engine; list only unless Weibao asks.
- MC11. After fold, decide with Weibao whether a Reverend Insanity or Shadow Slave world enters the world queue; the mods are evidence, not authority (AD5 sequencing).
