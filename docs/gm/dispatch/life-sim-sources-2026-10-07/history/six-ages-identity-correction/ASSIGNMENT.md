# Life-sim source GM: install, audit, uninstall

Dispatched 2026-10-07 by Claude Code at Weibao's request: "send out to
install and then audit and then uninstall accordingly". Personal-use
reconstruction is authorized (vault `Game_Idea_Bank.md`, 2026-10-05).

Read first: AGENTS.md, PROJECT.md, [the north-star doc](../../../LIFE_SIM_NORTH_STAR.md),
and the previous Steam wave's method, [steam-wave-2026-10-06](../steam-wave-2026-10-06/)
(its ASSIGNMENT and DELIVERY define the copy, hash, coverage and uninstall
rules; follow them).

## Games

Claude Code sent the Steam install requests on 2026-10-07. Steam may still be
downloading, or may be waiting on Weibao to click the install dialogs.

| App | Game | Engine (expected) | Life-sim lens |
|---|---|---|---|
| 718670 | Cultist Simulator | Unity C# | Text-based occult life, aspects, slow progression (Lord of the Mysteries fit) |
| 763890 | Wildermyth | Java and JSON data | Aging, scars, legacy heroes, generated story text |
| 881420 | Six Ages: Ride Like the Wind | Unity | Generational events, advisors, clan over years |
| 352220 | King of Dragon Pass | Native and data | Text event scenes, advisors, yearly cycle |
| 1158310 | Crusader Kings III | Plain-text scripts | Traits, stress, dynasty, event scripting, how history and saves stay small |

Windows-only games install through Weibao's Neutron/NotProton Steam Play
setup (`~/code/Neutron`), which has worked for other Windows titles:

| App | Game | Engine (expected) | Life-sim lens |
|---|---|---|---|
| 233860 | Kenshi | Native C++ and data (OGRE) | Being a nobody in a harsh world, squads, factions |
| 1468810 | Tale of Immortal | Unity C# | Cultivation life sim, NPC lives, events |

Kenshi was downloading on 2026-10-07. Tale of Immortal failed with "Invalid
install path"; Weibao may need to set its Steam Play compatibility tool first.

Factorio (427520) was uninstalled 2026-10-07 at Weibao's approval; its source
stays in `~/.codex/research/factorio`. Disk is tight (about 18 GB free on
2026-10-07): uninstall each game as soon as it meets the uninstall rule.

## Steps per game

1. Wait until its `appmanifest_<id>.acf` reports a fully installed state and
   the files are stable. Don't poll in a tight loop.
2. Copy the useful inputs to `~/.codex/research/<game>/` (outside the YAIR
   git tree), hash-matched. Decompile managed code (ILSpy or similar) where it
   exists. Crusader Kings III scripts are already readable.
3. Audit through the life-sim lens. Spawn bounded subagents per game. Produce
   the same files as the earlier waves (INTAKE, REPORT, FINDINGS, COVERAGE,
   IMPLEMENTATION_PACKETS, CHECKPOINT) under `docs/research/<game>/`. Keep
   them readable to a human: one short plain-language REPORT first.
4. Hand implementation packets to the life-sim experience GM
   (`docs/gm/life-sim-experience-2026-10-07/`) and the foundation GM
   (`docs/gm/life-sim-foundation-2026-10-07/`, for Crusader Kings III save and
   history compaction). Don't edit `src/` yourself.
5. **Uninstall** once a game meets the previous wave's uninstall rule: copy
   verified and pass complete. Use Steam (`steam://uninstall/<id>`); Weibao
   confirms the dialog. Keep the extracted source.

## Rules

- Don't touch other lanes' folders or `src/`. Keep a checkpoint here.
- Don't commit.
- Report in plain words: which games are copied, audited and uninstalled, the
  top findings per game, and anything blocked (not owned, still downloading,
  dialog waiting).
