# Living beside protagonists, and seven new world audits

Research summary, 2026-10-10. Proposals only; nothing here is accepted
design until Weibao says so. This pulls together the fan-fiction surveys
(M3) and the new world audits run with the
[source deep dive playbook](SOURCE_DEEP_DIVE_PLAYBOOK.md). Detailed files
sit in the private research folder (`docs/research/novels/<world>/`,
gitignored), listed at the end.

## 1. What fan fiction across eight worlds agrees on

There were eight surveys, about 230 works in total: Lord of the Mysteries
and its sequel, Shadow Slave, Reverend Insanity, Jujutsu Kaisen, Naruto,
Harry Potter, plus quick scans for Chainsaw Man, Dorohedoro, Tokyo Ghoul,
Dungeon Meshi and Re:Zero.

### Premise families (shared codes)

Each world's own codes map onto these.

| Code | Premise family | Seen in |
|---|---|---|
| P1 | **Born or reborn into the world** as a native child, often in a notable family or clan | Naruto (clan heir, Uzumaki), HP (reborn native), JJK (reborn into a clan), RI (Gu Yue orphan) |
| P2 | **Arrive as an adult outsider** (isekai, transmigrator) with partial canon knowledge | All eight |
| P3 | **Replace a canon character** (body-swap, including the protagonist) | SS, RI, JJK, Naruto, HP |
| P4 | **Peer, sibling or teammate** of the protagonist | LOTM (Moretti family), Naruto, JJK, SS (cohort), HP |
| P5 | **Earlier era**, before the protagonist exists | LOTM (Roselle era), SS (first generation), Naruto (Warring States), HP (Founders, Marauders), JJK (Heian) |
| P6 | **Specialist or civilian path**: medic, sealmaster, shopkeeper, researcher, ordinary resident | Naruto (praised), LOTM (Trier resident), HP (rationalist, specialty-first), JJK (civilian sorcerer) |
| P7 | **Villain-side or faction start** | LOTM (Aurora Order), Naruto, TG (ghoul side), CSM (institutional drama) |
| P8 | **Second looper or regressor** who shares the protagonist's kind of power | RI (second regressor), Re:Zero, SS (regression with canon cast), HP (time-turner returner) |
| P9 | **Fate- or system-assigned** start: the world hands you name, power and curse | SS (Weaver-made OC), LOTM (Fool's registry), JJK quests (point-buy) |
| P10 | **Crossover power import** | All; readers often see it as diluting the world's system |

All are reachable start options under "anything possible, reasonably".
P1, P2, P4 and P6 make modest defaults.

### Mechanics the premises keep needing

- **M1. A canon clock.** Every survey found canon events used as scheduled
  deadlines: the Uchiha massacre, Shibuya, the wolf tide, Klein's arrival
  on 28 June 1349, OWLs in year 5. This is the natural-course standard
  ([TIMELINES_AND_DIVERGENCE](../TIMELINES_AND_DIVERGENCE.md)) with each
  world's timeline as data.
- **M2. Foreknowledge as a stat with states:** full, partial, fading,
  scrambled or none, plus a "hide it" choice. The JJK survey's version is
  the cleanest. Readers praise fics where foreknowledge costs something.
  They mock the walkthrough style.
- **M3. Divergence changes details, inertia keeps the big beats**
  (corrected 2026-10-10). Fics mostly say foreknowledge loses value as
  the timeline diverges. The books are more precise. Reverend Insanity:
  great events grow from long-built conflicts and recur with a new
  trigger, untouched regions stay as remembered, and changes spread like
  ink from the point of intervention (`ch404`, `ch667`, `ch1754`). Shadow
  Slave: a Nightmare's big beats repeat whatever challengers do, and only
  details bend (`ch709`). So foreknowledge has two layers: sticky great
  events and fragile local details. Only the fragile layer near the
  player's interventions drifts, and how strong the inertia is becomes a
  per-world dial (rule 2).
  The deep dives place worlds along that dial:
  - Reverend Insanity and Shadow Slave: strong inertia.
  - Worm: attractors with local freedom, where foreknowledge degrades
    within a radius of the change.
  - Cradle (wiki only): Fate works like gravity toward an iteration's
    natural end, and the Abidan act only on large deviations.
  - Mother of Learning: weak inertia. Routines repeat until nudged, then
    cascade, so knowledge stays good for only a few days.

  See [the MoL deep dive §3](novels/mother-of-learning/SYSTEMS_DEEP_DIVE_2026-10-10.md).
- **M4. The protagonist's mode changes by era.** Early, they are a peer
  with a schedule. Late, they are a distant power reached through
  intermediaries: Mr. Fool, Sovereign Sunny, Gojo as a hazard. Late-era
  starts beside a powerful protagonist are rare in every fandom, so they
  are open design space.
- **M5. Specialist careers.** Praised wherever they appear. They fit the
  life-sim north star and YAIRPG's existing careers (Village patrol,
  practical study).
- **M6. Earned power with explicit limits.** The most-praised fics give
  the original character clear caps and costs; the JJK technique-generator
  template is the best example. Instant power with no cost is the most
  mocked trope in every fandom surveyed.
- **M7. The protagonist's lethality as a world rule.** In RI, Fang Yuan
  kills people who become dangerous after being useful. Fics avoid it
  (staying small, arriving earlier, becoming him). A game can make it an
  explicit risk with rules.

### Two reusable templates

- **Technique generator** (from JJK fics):
  1. Hook verb.
  2. What it acts on.
  3. Three to five dials.
  4. Scaling rule.
  5. Hard caps on count, range and duration.
  6. Cost.
  7. Extension gated by a vow or mode.
  8. Late domain concept.
  9. Mastery track from 1 to 5.
  10. Life seed (a hobby or history that names it).

  This works for any world with personal powers: Aspects, techniques, Nen,
  quirks.
- **School-year clock** (from HP fics). The term is the micro clock and
  the canon years are the macro clock. Exams are soft skill gates,
  summers are offline progress, and canon events are scheduled
  interrupts. This works for any academy start: JJK's school, the Shadow
  Slave Academy, Naruto's academy.

## 2. Seven new world audits: the mechanic each adds

| World | Distinct mechanic for YAIRPG | Engine shape (one line) |
|---|---|---|
| Reverend Insanity | Living power items that must be fed. A path's dao marks change how well other powers work: an Immortal Gu runs at 60-70% power for an owner of an unrelated path and up to 130% for a matching one | Gu inventory capped by feeding upkeep; killer moves = core plus support recipe |
| Chainsaw Man | Power comes from how much people fear a concept's name; contracts are priced in body parts and lifespan; something eaten can be erased from existence | One concept graph: fear score, contract ledger, existence flag |
| Dorohedoro | One innate magic type for life, plus a separate volume of smoke; revival depends on three flags | Type trait plus smoke meter; devil exam as prestige that disables magic for a year |
| Tokyo Ghoul | A diet constraint as a clock, notoriety heat, and growth by eating your own kind; two-faction identity | Hunger, Rc and Cover meters; rating scale doubles as investigator rank |
| Dungeon Meshi | Dungeon ecology with maturity stages, cooking as buffs, death as a recoverable debt (the corpse-recovery job takes 10-20% of what the dead carried) | Biome tables plus pantry plus corpse job plus demon bargain |
| Re:Zero | A loop the player can't control: hidden checkpoints, memory-only carryover, a speech lock | Hidden save events; inherited Authority items; birth-trait protections |
| (Scout) | 21 more candidates ranked; first batch was Dorohedoro, Tokyo Ghoul, Re:Zero, Dungeon Meshi (done) and Made in Abyss | See the scout file |

### What carries across worlds

- **Finite power economies:** LOTM characteristics, Shadow Slave shards, RI
  Gu and stones, Chainsaw Man fear.
- **Two routes up, standard and obscure:** potions vs boons, the Spell vs
  the ancient path, Spell-awakened vs natural.
- **Knowledge hazards:** LOTM names, the Shadow Slave Void, Chainsaw Man
  names.
- **Run structures:** Nightmares, Cordu, Re:Zero loops, Dorohedoro's exam
  reset.

These are candidates for multiverse-level mechanics with per-world
settings (rulebook rule 2), not global rules.

## 3. Sources and limits

A separate fan fiction pilot ran the same day in another session
([fanfic/REPORT.md](fanfic/REPORT.md): Fanlore taxonomy, JumpChain, the
"random omnipotent being" setup, Chinese American-comics fan novels). It
complements this summary; neither replaces the other.


- **Book worlds read from local full text:** LOTM, COI, Shadow Slave,
  Reverend Insanity.
- **Audits from the Fandom wikis only**, read through the in-app browser
  with revision ids: Chainsaw Man, Dorohedoro, Tokyo Ghoul, Dungeon Meshi
  and Re:Zero. Their manga or novel text was not read, so these rank below
  book-verified research.
- **Fan surveys were blocked heavily.** Reddit, FFN, TV Tropes and Royal
  Road were refused or returned 403. AO3 often returned 525 or a terms
  modal, which agents correctly did not accept. Praise and pitfall
  sections are mostly inference from tags and stats, and each file labels
  them.

## 4. File index (private folder, gitignored)

- LOTM and COI: `novels/lord-of-mysteries/PATHWAYS_DEEP_DIVE_2026-10-10.md`,
  `WIKI_CROSSCHECK_2026-10-10.md`, `readers-2026-10-10/`
- Shadow Slave: `novels/shadow-slave/SYSTEMS_DEEP_DIVE_2026-10-10.md`,
  `WIKI_CROSSCHECK_2026-10-10.md`, `readers-2026-10-10/`
- Reverend Insanity: `novels/reverend-insanity/SYSTEMS_DEEP_DIVE_2026-10-10.md`,
  `WIKI_CROSSCHECK_2026-10-10.md`, `readers-2026-10-10/`
- World audits: `novels/{chainsaw-man,dorohedoro,tokyo-ghoul,dungeon-meshi,rezero}/WORLD_AUDIT_2026-10-10.md`
- Fan surveys: `novels/{jujutsu-kaisen,naruto,harry-potter}/FANFIC_SURVEY_2026-10-10.md`
- Next candidates: `novels/_scouting/NEXT_WORLDS_2026-10-10.md`
- Worm: `novels/worm/SYSTEMS_DEEP_DIVE_2026-10-10.md`, `readers-2026-10-10/`
- Mother of Learning: `novels/mother-of-learning/SYSTEMS_DEEP_DIVE_2026-10-10.md`
- Wiki audits: `novels/{cosmere,hunter-x-hunter,cradle}/WORLD_AUDIT_2026-10-10.md`
- Relationships (tracked): [relationships-2026-10-10/REPORT.md](relationships-2026-10-10/REPORT.md)
