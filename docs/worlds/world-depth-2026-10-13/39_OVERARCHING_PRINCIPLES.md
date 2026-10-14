# Overarching principles across parts 28-38 (proposal, 2026-10-14)

Weibao (2026-10-14): "more to consider? other stuff and more? save and extend accordingly Send out codex as usesful? Subtle stuff too? Overarching stuff? Implementation considerations and more?"

Proposals only. Nothing here is accepted. Parts 28 to 38 added hundreds of rows in one night. This part names the few rules that keep recurring under all of them, so a new idea can be checked against them quickly. Part 32 maps the social parts; [part 40](40_IMPLEMENTATION_CONSIDERATIONS.md) (Codex lane) covers code-level implementation. Code OA checked free.

Accepted direction these rest on, not restated as new: [USER_VISION](../../USER_VISION.md) and [PROJECT](../../../PROJECT.md): many worlds, life-sim north star, desktop first, discovery-gated information, passive progression, food without hunger death, solo player with no fixed "once" limits, sealed secrets, everything possible reasonably.

---

## 1. Recurring principles (OA1-OA12)

Each one already appears in several parts. Listed with where.

| Code | Principle | Where it already appears | Test for a new idea |
|---|---|---|---|
| OA1 | **Simulate first, show second.** The world runs whether or not a panel shows it. | 28 LS1, 38 HB25, 29 RQ1 | Would this still happen if the player never opened a menu? |
| OA2 | **Shown layer versus true layer.** Characters act on what they perceive; UI shows only that. | 28 SF1, 29 DV, 36 MC40, sealed secrets | Does any view read a fact the character has not perceived? |
| OA3 | **Judgment belongs to people, not the game.** No single karma, love or reputation bar. | 34 VL1, 21 renown audiences, 20 RM9 | Who is judging, and by which values? |
| OA4 | **Worlds differ by rules, not skins.** Customs, values, ages, cosmic rules and social speed are per-world facts. | 28 DS3, 30 LSE/LSW, 34 VL3-VL4, 37 | Does this row name a dial that lets each world set it? |
| OA5 | **Good states are bonuses, bad states remove bonuses.** No forced death spirals from needs, moods or upkeep. | Food direction, 31 IL1, 34 VL9, 38 HB13 | Can neglect alone end the run? If yes, rethink. Only "no hunger death" is accepted; extending it to moods and upkeep is a proposal, and world-specific harms keep their own causal rules (part 40 IMX2). |
| OA6 | **Passive progress is allowed; repetition is varied, not farmed.** Idle routines earn, diminishing repeats keep it fair. | Passive direction, 29 RI, 20 RM6, 38 HB11 | Does this progress while idle, and does variety beat grinding? |
| OA7 | **Words before numbers.** Default views use words; numbers are a setting. | 20 UF3, 28 LS3, 31 IL10, 36 | Can this be said in a short line? |
| OA8 | **Everything leaves a record with a cause.** Changes write memories, receipts or notes that later content can read. | 20 RM2, 29 RQ7, 38 HB19 | What remembers this, and who can read it later? |
| OA9 | **The other side is the gate.** People agree, refuse and remember; you never "unlock" a person. | 28 SF2, 29 BK12, RFM1 | Is a person's willingness part of this? |
| OA10 | **Default, earned, cheat by layer.** Verbs come from body, place and role; reach is earned; breaking world rules is a cheat. | 28 LS/PT, 22 | Which layer is this, for this life? |
| OA11 | **Fair first bite.** Permanent costs warn first, through the world. | 28 RC2, 38 HB29, 36 MC30 | Is there an in-world warning before a lasting loss? |
| OA12 | **Small first, in the Village.** Every idea's first slice is a small playable thing at home. | 32 SSB, every part's cheapest-first table | What is the one-line Village version? |

## 2. Fixed lines (OA13-OA16)

Not dials, not proposals to revisit casually.

| Code | Line | Source |
|---|---|---|
| OA13 | Romance and partner content needs both people 18+ by body age and adult in appearance; claimed, soul or species age never unlocks it. | CQ1, DV1, part 30 LSL |
| OA14 | Sealed secrets never show outside their discovery route. | AGENTS.md |
| OA15 | Accessibility, saves, pause and a readable log are never removed by any game state. | 22 LN1-LN10, 28 NS line |
| OA16 | Personal saves stay private and untouched; persistence changes need a migration or explicit compatibility decision. | AGENTS.md |

## 3. Cross-part joins to watch (OA17-OA24)

Places where several parts touch the same state and could disagree.

| Code | Join | Parts | Watch for |
|---|---|---|---|
| OA17 | **Mood** | 31 IL1-IL3, 34 VL9, 35 health, 38 HB13 | One spirits band, many writers; keep it one state, not four. |
| OA18 | **Habits and routines** | 31 IL13, 34 VL15, 38 HB1/HB11, 29 RI | Accepted occurrences as the authority for habits, patterns and idle contact; logs are projections (part 40 IMX1). |
| OA19 | **Reputation scales** | 21, 31 IL22, 33 institutions, 38 HB3 | Neighborhood, institution and fame as separate audiences over one cause log. |
| OA20 | **Age and body** | 30, 35, 29 DV1-DV3, 36 MC14 | Body, soul, apparent and legal age as separate facts everyone reads the same way. |
| OA21 | **Signals** | 36, 37, 38, 20 UF4, 21 SU | One signal registry with cooldown adjectives instead of per-part one-off lines. |
| OA22 | **News and gossip** | 31 IL20-IL21, 29 SSG2, 21 | One claim object with source, delay and accuracy, used by gossip, news and rumor. |
| OA23 | **Values and acts** | 34 VL25, 29 RQ7, 21 | Act tags on causes are read by values, renown and law alike, through a typed descriptor added only as needed; today `s.causes` is a relationship receipt map, not a universal journal (part 40 IMX4). |
| OA24 | **Continuity** | 29 RCL/RX, 38 HB16, 30 heirs, 35 death | One carrier model for what crosses lives and worlds. |

## 4. Subtle risks (OA25-OA30)

| Code | Risk | Mitigation proposal |
|---|---|---|
| OA25 | **Breadth outruns play.** Hundreds of rows, little playable. | Keep the one-playable-slice rule (AGENTS); parts are palettes, not backlog. |
| OA26 | **Signal noise.** Too many small lines bury real events. | Priority and cooldown in the registry; a log filter setting. |
| OA27 | **Save growth.** Memories, patterns, habits and signals all add rows. | Byte budgets and compaction (29 RZ3, CQ4) before content scales. |
| OA28 | **Hidden-layer leaks.** Many views, many chances to show truth. | A lint over UI reads (DV24, 36 MC47). |
| OA29 | **Contradicting owners.** Two parts define the same state differently. | Part 32 canonical rows; one owner per state, recorded. |
| OA30 | **Agent drift.** Proposals read as accepted. | Every part says "proposals only"; only Weibao's words change direction (AGENTS). |
