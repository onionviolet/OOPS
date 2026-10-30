# Reveal cheats for life systems (proposal, 2026-10-14)

Weibao (2026-10-14): "more to consider? ... Cheats that would show stuff like these and more? ... Abstaction thats needed? Merging, commiting or pushing?"

Proposals only. Nothing here is accepted. Part 41 RV1-RV14 and the primary [weaponcraft palette](../../WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md) cover reveal cheats for items and runes. This part applies the same pattern to the life systems in parts 29-38, which no sibling doc covers. Code LR checked free. <!-- slip-ok: existing wording; only the link target changed -->

Every row uses the part 41 AX5 reveal-route shape: what layer it reads, level steps, the tell observers notice, and what it never shows. All follow part 39 OA2 (true versus shown) and OA14 (sealed secrets stay sealed). These are cheats by part 28 LS5: they break what locals believe is impossible. Where a world has the ability natively (Legilimency in HP, Insight in D&D, Sharingan reading in Naruto), it is a world skill there, not a cheat.

---

## 1. People and ties (LR1-LR8)

| Code | Cheat | Reads | Levels | Never shows | Why it matters |
|---|---|---|---|---|---|
| LR1 | **Heart gauge** | Someone's true regard axes toward you (part 29 RQ3). | Words, then ranges, then exact values. | Sealed motives; their regard toward others unless LR3. | The classic dating-sim cheat; fixes part 29 SF1 uncertainty for a price. |
| LR2 | **Lie sense** | Whether a statement matches the speaker's belief (part 29 DV9). | Flicker, then certainty, then what they actually believe. | Truths the speaker does not know. | Turns social deception into a skill race. |
| LR3 | **Web sight** | NPC-to-NPC ties around you (part 29 RQ11). | Your circle, then the village, then a region. | Hidden ties under sealed IDs. | Makes politics and gossip routes visible. |
| LR4 | **Memory glimpse** | What a person remembers about you (memory list). | Latest memory, then the list, then compacted summaries. | Memories marked private by a world rule. | Shows why someone acts as they do. |
| LR5 | **Want reader** | A person's current needs and tastes (part 29 RQ6). | One need, then tastes, then ambitions. | Secret ambitions that are sealed. | Removes gift guessing; the cost is that it feels unearned to the player who wants discovery. |
| LR6 | **True name and face** | A person's true identity behind a disguise (part 29 DV4). | "Not who they seem", then the true role, then the name. | Sealed identities outside their route. | Hidden-identity worlds (LOTM, spies) get a counter. |
| LR7 | **Fate thread** | Whether a tie is likely to deepen, break or betray (part 20 RD14). | A mood color, then a direction, then a cause. | Fixed future events under sealed IDs. | Foresight for relationships, with a tell when used. |
| LR8 | **Bond link** | A chosen friend's location, health and mood at a distance. | Alive or not, then direction, then state. | Anything the friend keeps hidden by consent. | Rescue (part 20 RD6) and letters across distance. |

## 2. Self, body and mind (LR9-LR13)

| Code | Cheat | Reads | Levels | Never shows | Why it matters |
|---|---|---|---|---|---|
| LR9 | **Status window: life tab** | Spirits, stress, habits, values and patterns as panel entries (parts 31, 34, 38). | Words, then bars, then numbers. | Hidden flaws until discovered (part 29 DV22). | Extends the existing status window cheat line to life systems. |
| LR10 | **Body readout** | Exact injuries, illness, body age and lifespan (parts 30, 35). | Symptoms, then causes, then time to recovery. | Sealed bloodlines or curses outside their route. | Medicine and aging made legible. |
| LR11 | **Habit ledger** | Which habits are forming and their gains (part 38 HB11). | Named habits, then progress, then predicted gains. | Other people's habits unless watched. | Optimizer players get tools without forcing them on others. |
| LR12 | **Conscience compass** | How an act will sit with your character's values before you do it (part 34 VL9). | Lean, then cost, then which value. | Others' judgments (use LR1). | Lets players play a consistent character on purpose. |
| LR13 | **Age sight** | Body, soul, apparent and legal age of anyone (part 30). | Apparent, then body, then soul. | Never changes the fixed 18+ floor; it only reports facts. | Settles age questions in worlds full of disguises and long lives. |

## 3. Community and institutions (LR14-LR18)

| Code | Cheat | Reads | Levels | Never shows | Why it matters |
|---|---|---|---|---|---|
| LR14 | **Rumor trace** | Where a rumor about you started and who passed it (part 31 IL20). | Last teller, then the chain, then the source. | Sealed actors by ID only. | Lets the player fight slander directly. |
| LR15 | **Standing map** | Your standing with each audience: neighborhood, institutions, factions (parts 21, 31, 33). | Words, then per-audience, then trends. | Secret societies you do not know exist. | A reputation dashboard for players who want one. |
| LR16 | **Institution ledger** | An institution's internal factions, debts and plans (part 33). | Public face, then factions, then plans. | Sealed plots. | Political play inside guilds and sects. |
| LR17 | **Custom primer** | Local customs before you break one (part 30 LSE, part 31 IL25). | Warnings, then the rule, then its history. | Nothing hidden; customs are public to locals. | Smooths foreign starts; trades away the fun of learning by mistakes. |
| LR18 | **Pattern mirror** | Who has noticed your patterns (part 38 HB1-HB8). | That someone noticed, then who, then what they plan. | Sealed watchers. | Counters predictability risk (HB2). |

## 4. The abstraction this adds (LR19-LR22)

| Code | Consideration | Why it matters |
|---|---|---|
| LR19 | **One reveal route schema for items and life.** The part 41 AX5 route (layer, levels, tell, never-shows) covers every LR row too. A reveal cheat is data, not code. | One engine for all insight cheats. |
| LR20 | **Tells per cheat.** Default: using a reveal on a person can be noticed by sensitive NPCs (a glow, a stare, a chill). Dial: per world how detectable mind-reading is. | Reveals have a social cost; ties into part 28 SF5 receipts. |
| LR21 | **Native skill versus cheat.** Default: a world that has the ability natively (Legilimency, Insight, Sharingan) offers it as a skill with that world's limits; elsewhere it is a cheat. The same route schema serves both. | Respects OA4 and part 28 DS6. |
| LR22 | **Cheapest first.** (1) LR9 life tab in the existing status window showing spirits and habits as words. (2) LR1 heart gauge at word level for known Village people. (3) LR17 custom primer for one Village custom. | All read existing or planned state with no new save store. |
