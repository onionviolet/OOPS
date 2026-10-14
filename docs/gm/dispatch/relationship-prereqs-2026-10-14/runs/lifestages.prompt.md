Expand relationship and life-stage considerations for YAIRPG
(yet-another-idle-rpg). Weibao (2026-10-14): "more to consider? CQ1 makes
sense, make relevant to history and time period and sutff and more tho, fit
the lore? More to consider? Send out codex accordingly, expand on ideas and
more accordingly?"

Design and documentation only. Do not change gameplay source, bundles,
tests, saves or private packs. Do not commit or push.

## Ownership (one writer per file)

You own exactly these files for this run:
- `docs/gm/dispatch/relationship-prereqs-2026-10-14/CLAUDE_ADDENDUM.md` (expand)
- `docs/worlds/world-depth-2026-10-13/30_LIFE_STAGES_AND_CUSTOM.md` (create)
- `docs/gm/dispatch/relationship-prereqs-2026-10-14/LIFESTAGES_REPORT.md` (create)

Another Codex run owns `29_RELATIONSHIP_PREREQUISITES.md`,
`relationship-prereqs-2026-10-14/AUDIT.md` and the part 29 row in
`WORLD_DEPTH_CONSIDERATIONS_2026-10-13.md`. Read them; never edit them. Do not
edit `WORLD_DEPTH_CONSIDERATIONS_2026-10-13.md` at all; list the index row you
want in your report instead.

## Read first

- `AGENTS.md`, `PROJECT.md`, `~/.claude/user-preferences.md` (style: plain
  short words, no em dashes, no " -- ", short codes on rows).
- `CLAUDE_ADDENDUM.md` (CQ1-CQ18). CQ1 is the anchor: life stages fit each
  world and era from lore, with one fixed floor.
- Parts 12 (starts), 17 (carryover), 20 (relationships), 22, 23, 28, 29 in
  `docs/worlds/world-depth-2026-10-13/`.
- `docs/worlds/SUCCESSION_BY_WORLD.md`, `ORIGINS_AND_WORLD_TIMELINES.md`,
  `LORE_AND_CONTINUITY.md`, `NONHUMAN_STARTS_*_2026-10-14.md`,
  `IDENTITY_LAWS_BY_WORLD_2026-10-14.md`, `docs/GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md`,
  `docs/SHARED_FOUNDATIONS_AUDIT_2026-10-12.md` (gender, kinship U08),
  `docs/LIFE_SIM_NORTH_STAR.md` (search: romance, lineage, heir, aging, life
  stage, childhood; do not read whole).
- World folders under `docs/worlds/<world>/` (WORLD_BRIEF and research) and
  wiki digests in `docs/research/power-systems/wiki-digests/`. Priority
  worlds: Harry Potter, D&D, TTKS, Mother of Learning, A Soldier's Life,
  home Village; then Naruto, Lord of the Mysteries, Shadow Slave, Frieren,
  FMA, Bleach, JJK, cultivation novels. Never open `SECRETS*` files.
- Code, source-read with file:line: age, life stage, birth, aging, death,
  marriage, spouse, parent and heir fields (`src/npc_lives.js`,
  `src/chronicle.js`, `src/models/person.js`, start and hero creation code;
  grep for age, birth, spouse, heir, adult, child).

## Fixed rule (not a dial, do not soften or route around)

Romance and partner verbs, and any romantic or sexual content, require both
people to be 18 or older by body age. Lore may contain childhood
betrothals, dynastic contracts or historical marriage customs; represent
them as offscreen legal or political ties with no romantic content until
both are 18. A reincarnated adult in a child's body counts as a child. Every
other age boundary (work, school, law, inheritance, military service,
coming of age) fits the world, era and lore.

## Part 30: Life stages and custom by world and era

Create the part as considerations, not specs (palettes, illustrative tiers,
Default + Dial + Reasonably where a dial fits, every reasonable option
reachable, no either/or questions for Weibao, no fixed "once" limits).
Rows: short code, consideration, why it matters. Proposals only. Suggested
sections, adjust as the material demands:

1. Code today: what age and life-stage facts exist, cited.
2. Life-stage ladder model: stages, transitions, body age vs soul age vs
   apparent age vs legal age, lifespan scaling, nonhuman and immortal bodies.
3. Era and custom palette: kinship, households, matchmaking, courtship
   forms, dowry and bride price, inheritance, adoption, widowhood, divorce,
   class and caste, apprenticeship, schooling, military age, retirement,
   elders and ancestors. Historical periods as palettes (ancient, medieval,
   early modern, Regency or Victorian, industrial, modern, future) and genre
   eras (cultivation sect, magic school, ninja village, post-apocalypse).
4. Per world: each priority world's stage ladder and customs from lore, with
   source labels SHOWN / STATED / INFERRED / UNKNOWN and file paths. Mark
   original fill-ins as original.
5. How stages touch other systems: relationships (part 20, 29), succession,
   carryover, starts, time and aging, death, skills and passive progress,
   institutions, law and reputation.
6. Discovery and UI: customs learned when they come up, desktop first
   (1366x768), mobile deferred.
7. Prerequisites this adds to part 29 (engine facts, predicates, save impact).
8. Cheapest five slices, ranked, with save impact.

## Addendum expansion

In `CLAUDE_ADDENDUM.md`, keep CQ1-CQ18 wording (fix factual errors only, and
say so in your report). Add CQ19 onward: further relationship
prerequisites and ideas Codex's other run is unlikely to cover. Read its
current part 29 first and skip overlaps.

## Report

`LIFESTAGES_REPORT.md`: files changed, row counts and code prefixes added
(check prefixes are unused across parts 0 to 29), the index row you propose
for part 30, contradictions found with any existing doc (both sides), and at
most five open decisions for Weibao. End your last message with the same
summary.
