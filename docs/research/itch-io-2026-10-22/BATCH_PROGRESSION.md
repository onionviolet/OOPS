# itch.io decode batch: cultivation progression and story (HTML5), 2026-10-22

Static reads of served builds only; nothing was executed. Everything is a
proposal (AD32). No license is stated on any of these builds or pages I read, so
treat them as ideas only. Raw files, hashes and line locators live in the
gitignored `private/<slug>/` folders (hash manifest: `private/manifest_progression.txt`).
Labels: `source` = found in code; `stated-not-found` = claimed, not found.

## The Reincarnation System (rasmuskoit; app at reincarnate.koit.dev)

Svelte app, bundle readable after esbuild pretty-print, 816 KB, 19k lines.
- **Systems (source)**
  - Soul forks: an array of parallel cultivation slots, each bound to a dao path
    with its own mastery clock. Per-path mastery level multiplies the fork's
    weight. Adjacent elements in a fixed five-element cycle give a "resonance"
    bonus per linked neighbor, only once enough fork slots exist. Slots unlock at
    lifetime ascension counts. Root purity adds an affinity bonus when the path
    element matches. Learnable "fork disciplines" add weight multipliers or
    tribulation bonuses. Expedition forks are excluded from path weight.
  - Vow: a per-life choice that applies a restriction (a rate multiplier or a
    disabled kind) and grants an aptitude reward. Restrictions from vow, active
    trial, cultivation path and challenge life are collected into one list and
    applied together. Pack validators cap the reward size.
  - Three prestige layers exist (life, ascension with a sundering/severance cost
    that grows geometrically, samsara with eternal perks that carry a capstone
    multiplier). Known, not new.
  - Data-driven content packs: the pack schema allows resource, upgrade, pill,
    doctrine, vow, trial, domain, achievement, encounter, story beat and lore
    card definitions, with hard budget caps (max 200 defs, per-type multiplier
    ceilings, a 512 KB pack size).
  - Also present: sect doctrine, pill resistance, "next vessels" list, chronicle
    unlock and lore records, challenge lives.
- **Representations**: mastery shown as levels, resonance as a link count.
- **Improvements**: validator messages state why a restriction is rejected
  ("a restriction must restrict"), which prevents free vows.
- **YAIR mapping**: vow has no hit in `src`. Soul forks: no hit. Closest owners
  are the ascension/heir seams (`src/heir_inheritance.js`, `src/home_inheritance.js`)
  and AD38 (mechanisms, not allowed-outcome lists). The pack budget caps
  resemble the content-validation habit in `docs/RULES_INDEX.md`; nothing new.

## Heavenly Path Idle (almogozer1000)

Plain readable JS, 90 KB main plus 22 KB data. The served build says version
0.2.1 while the page says 0.3.2.
- **Systems (source)**: breakthrough preview that computes the next stage's
  gains from the same bonus function as the live game (so the preview cannot
  drift), 12 h offline cap, technique loadout, three-way Heavenly Insight
  choice (body, spirit, fortune) offered at each major breakthrough and recorded
  in the breakthrough log with before/after qi rate and power, an ascension
  dialog, a Journal tab.
- **stated-not-found in the served build**: "Living Jianghu" and "Sects Become
  Real". Gap pass: the latest devlog (reforging from v0.2.1) says the developer
  withdrew those systems from the public game after player feedback, so the
  build is intentionally 0.2.1. The v0.3.0 to v0.4.6 devlog describes them:
  a Jianghu tab (Road travel with encounters, People with persistent NPCs that
  hold names, traits, power, relationships and sect membership, Sect founding
  with recruits, treasury, buildings and missions, rotating Market, Rankings
  against named rivals), plus a Renown resource. Developer-stated only; no code.
- **Improvements (developer-stated)**: the removal rationale. Too many competing
  systems made progression hard to read and delayed repeated actions. The public
  game was cut back to one focused loop.
- **Representations**: breakthrough log entry that stores the choice and the
  measured effect. Preview text "On success" lists exact deltas.
- **YAIR mapping**: preview-by-same-function matches the existing UR rules'
  spirit (UI shows real numbers); not a gap worth a code.

## Qingxuan: The Alchemy Hall Cold Case (yuhaolin2005)

Vue/Pinia, 1.7 MB, partly string-array obfuscated (property names via an index
function) but story text and many keys are plain. The IndexedDB key says
"idle-xiuxian", confirming the vue-idle-xiuxian base.
- **Systems (source)**
  - Story ledger: each fired story event appends a ledger entry (chapter index,
    in-world year, choice text); picking a choice updates the matching entry in
    place.
  - Story clock: a game-years counter advances at a fixed fraction (0.3) of
    real time and keeps advancing offline. On load, offline time grants
    cultivation by a stepped efficiency and sets an offline report (game years
    passed, real hours, gains, whether the cap hit).
  - Missed events: after the clock moves, any event whose window has closed is
    marked missed and applies a `missEffects` payload, and the report carries
    the missed count. Choice events can therefore expire while away, with
    consequences. This is the useful part.
  - Events gate on required flags and a "strict level gate"; background choice
    sets story flags (a favor flag for one background).
- **Representations**: a "report on return" that names missed story beats.
- **YAIR mapping**: no `missEffects` or missed-event hit in `src`. Closest owner
  is the offline/branch clock and `src/storylet_deck.js`; candidate rule: a
  storylet with an expiry window and an authored consequence when it lapses
  offline, shown in the return report.

## Peak Cultivator (wuxiadev)

Phaser 3 bundle, `game.js` 1.4 MB, string-array obfuscated. Gap pass: I
reimplemented the string-array decoder in a separate script (base64 table,
rotation by the file's own checksum expression; no game code run), replaced
every lookup, and pretty-printed the result (16k lines, `private/peak-cultivator/pretty.js`).
- **Systems (source)**
  - Qi absorption minigame: pure and impure orbs. The impurity ratio per run is a
    random value between a min and max, minus an "impurity reduction" stat from
    gear/upgrades (percent). Before the first major realm all orbs are plain
    pure or impure; afterward some orbs become elemental, matched to the core
    element, with a chance boost stat. Concentration tier speeds orbs and
    their spawn rate. Verified claim: impure orbs penalize.
  - Breakthrough is its own scene (a tribulation arcade) that ends with a tier
    1 to 9. The leftover (9 minus tier) times 0.2 accumulates permanently into a
    multiplier. A major realm resets stage and minor realm. Verified in code.
  - Breakthrough access needs the defense wave cleared (monsters alive must be
    zero) at the entry check. Verified claim: wave-gated.
  - Defense map: timed waves, base HP, game over at zero; adventure, tower,
    herbs and mines maps; elder NPCs of type defense; area unlocks in local
    storage; a debug command table remains in the bundle.
- **YAIR mapping**: a performance-graded breakthrough whose shortfall is stored
  as permanent bonus is a small variation on skill-trial breakthroughs (First
  Dawn REPORT F2); no new AD.

## Great Expanse: Road to Immortality (vegros101)

One 3.9 MB HTML file, readable inline script (fonts base64), with version
comments in code ("2.8.21", "G14, the owner's word").
- **Systems (source, claims verified)**
  - Offline rule: away milliseconds accumulate in a bucket; each full real hour
    converts to one in-world month run through the same `passMonths` as online
    play, remainder kept. Choice events only fire online; the lifespan check
    stops simulation one year before death so you cannot die away (the page
    text says this too). An away report lists months, realm change, stones, events.
  - Karma carry: on death, karma gained is a formula of peak realm, stage and
    plane; it persists in a legacy record with the list of past lives (name, age,
    peak, cause). Effects: +1% cultivation per karma point capped at +200%, and
    karma/10 added to the base fortune roll.
  - Procedural plus handwritten text: a grammar engine (`Grammar.expand`, seeded
    pools, per-region themes, a word generator) drives log events, beside long
    authored choice events with tagged costs ("Heavy karma") and per-choice
    karma/standing/deed fields, including war-front choices.
- **Improvements**: version comments explain fixes (Explore leaves the mount
  behind entirely; Voyage = twelve Explores through the same code path, ends at
  a death or a box).
- **YAIR mapping**: the offline-month-per-hour rule is a simple instance of the
  branch/offline clock; "no death while away, no choices while away" is a
  default to consider with an in-world dial (AD5 style), not found in `src`
  (no hit for a death-safe offline rule). Karma-as-multiplier is plain; the
  deed field on choices (a short remembered act string) feeds NPC reference and
  is the part worth borrowing for the chronicle/lore history.

## Immortal Ascension (zy2026)

Vite bundle, 92 KB, plain after pretty-print, 1.9k lines. Not the project's
earlier referenced idea file's subject beyond the name; no connection found.
- **Systems (source)**
  - Failure pity: each consecutive loss adds a flat 0.15 to the next success
    chance, for both hunts and tribulations; reset on success. Tribulation pills
    add up to three uses of +0.10 each. Verified claim "failures raise later odds".
  - Hunting grounds: a tier table (easy, even, hard, elite) with fixed stage
    and guaranteed or 15% drops of beasts and artifacts; difficulty does not
    scale with the player (verified).
  - Path choice (sword, body, beast) fixed per life, with extra beast slots and
    a free starting beast for the beast path; a path completed once gives
    prestige karma only the first time.
  - Prestige keeps karma, upgrades, achievements; rebirth count shown in the
    epithet.
  - Offline: capped at 604800 s (7 days) per return, applied as qi only (no
    hunts or tribulations). Verified.
  - A canvas "share card" for the character, built from recorded stats.
- **YAIR mapping**: pity is an existing concept (`src/gen_kit.js`,
  `src/craft_sources.js`); the shared streak across two different roll types is
  small. Share card is a representation idea only.

## Ascendant Dao (kranerr)

3.7 MB React bundle, readable after pretty-print (52k lines), save schema
version 62. Large; I traced only the lines below.
- **Systems (source)**
  - Reincarnation: death or old-age ending computes "imprints" from a breakdown
    (realm, age, deeds); imprints buy ranked perks: rerolls, root purity, luck,
    physique chance, starting wealth, skill retention (5% per rank), remembered
    scriptures, remembered techniques, a soul-bound abode, cultivation/craft/dao
    memory, long life, heaven's favour. Old-age endings pay less (a 0.8 factor).
  - On rebirth the new life copies the RNG, clock, log, daily, divination and
    world boss from the old one; the partner companion survives if bond is high
    enough (affinity set to 80).
  - Cave abode with a room cap by tier, raids on a timer (kind, due time, leave
    time, progress), repelled or lost (loses a fraction of spirit stones), with a
    cached 120-run simulated win chance for the UI.
  - Offline: catch-up is capped at 86400 s of real time, replayed through the
    ordinary simulation at a reduced rate, then summarized as a story report with
    stat deltas; the report says "Heaven only counts so much absence" when capped.
  - Tribulation report, qi deviations, opportunities, secret-realm runs, cloud
    sync with offline fallback.
- **stated-not-found**: 3D map not searched; sect raids as such are cave
  raids; puppetry and formations present only as text counts, not traced.
- **YAIR mapping**: perk store of "what a soul remembers" is the closest shape to
  inheritance; `src/heir_inheritance.js` exists. Raid-as-timer with a cheap
  cached odds estimate is a UI idea. No new AD.

## Cycle of the First Dawn 1.4.0 (doorwatchers), delta only

Readable ES modules; version string Beta 1.4.0, save schema 64 unchanged. Raw
files in `private/first-dawn/` (main.js, game.js, data.js, build.js, one
evidence module).
- **Systems (source)**
  - Investigations: stages are an evidence DAG. Each stage lists required items
    of three kinds (observation, dossier, earlier stage), all of which must be held.
    A dossier needs a specific observation, an optional earlier dossier and a
    "case proof". The module comments say findings attach to real scenes and work,
    not a parallel research clock, and each city has a different stage count and
    route.
  - Field-use of a case method opens a fight but gives no kill or bestiary credit
    (comment); civic cases offer no combat advantage.
  - Personal Journal: free text in cross-life meta, 500,000 character cap, never
    written by the game, autosaved on pause, exported with saves, and stripped in
    one data-sharing path (main.js line 1113).
  - Travel Atlas: lists only places entered by visits, observations or journeys;
    route rows count crossings; the note says it is not a map of the undiscovered.
  - Record tabs now: overview, investigations, atlas, personal, mastery, world,
    settlements, wilderness, relics, bestiary.
  - The public 1.4.0 changelog is generic (new region, narrative and interface fixes).
- **YAIR mapping**: a free player-notes field and an atlas that never shows
  unvisited places match sealed-secrets/discovery direction
  (`docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md`); `src` has no player-notes hit.
  The evidence DAG matches the REPORT.md F1 law already recorded.

## Top findings

1. **Qingxuan lapsing storylets**: story clock runs offline at a fixed fraction;
   events whose window closes apply an authored miss effect and are reported on
   return. Candidate: expiry windows plus authored lapse consequences in
   `src/storylet_deck.js` and the return report. Not in `src`.
2. **Great Expanse offline contract**: one in-world month per real hour, same
   simulation path as online, choices never fire away, no death away. Candidate
   default for the branch/offline clock with a per-world dial.
3. **Reincarnation System vow**: a per-life self-imposed restriction that pays
   an aptitude, validated so it must really restrict. No `src` hit.
4. **First Dawn personal journal and discovered-only atlas**: a 500k free-text
   field that the game never writes, carried across lives; map rows only for
   what the life established.
5. **Immortal Ascension shared failure streak**: one flat pity step across hunts
   and tribulations, reset on success; small, but easy to expose in a UI.

## Verification line

Read: all eight builds' served JS (Peak Cultivator only by keyword counts);
Reincarnation System, Immortal Ascension, Ascendant Dao and Qingxuan via esbuild
pretty-print; Great Expanse by stripping base64 fonts; First Dawn selected
modules. Not read: Peak Cultivator logic (obfuscated), Ascendant Dao puppetry,
formation and map code, Great Expanse's full event library, Heavenly Path later
builds, First Dawn's 100+ other modules. (Gap pass closed the rest; see the ledger.) About 40 tool calls; two
itch page requests hit 429 and were retried after waiting. YAIR greps were name
greps over `src` and only mean "no obvious existing owner".

## Gap pass additions (2026-10-22)

- **Qingxuan offline cap**: the string-array lookups were decodable (plain array
  with rotation, not encoded). The offline window constant is 12 hours of real
  time (43,200,000 ms), so the page's 12 h claim holds. The offline cultivation
  gain uses a stepped efficiency by hours away; the story-year clock runs at
  0.3 of real time online and offline.
- **Ascendant Dao puppetry**: puppets are items placed into workshop worker
  slots. A worker holds one puppet and one action; progress ticks by the
  puppet's speed times a workshop building bonus. Crafting actions need a
  puppet flagged able to craft, otherwise it only gathers. One separate puppet
  can be set as a combat companion. Workshop tier caps the worker count.
  Actions wait on missing inputs and report "Waiting for <item>".
- **Ascendant Dao formations and map**: formations exist as a craft skill in the
  skill list beside alchemy, forging, talismans, cuisine, beast taming and
  puppetry. The map is a region graph (neighbours, terrain text, danger, realm
  requirement, travel days). No 3D or WebGL code found, so the "3D map" claim is
  stated-not-found.

## Gap ledger

| Gap | Status | Evidence or locator |
|---|---|---|
| Peak Cultivator logic unreadable | closed: own string-array decoder, rotation from file checksum, no game code run | `private/peak-cultivator/deob.js`, `pretty.js` lines 980-1010 (breakthrough), 3847 and 7568-7585 (impurity, orbs), 11633 (wave gate) |
| Qingxuan offline cap and 12 h claim | closed: 12 h | `private/qingxuan/deob.js` line 328 (`432e5` ms) |
| Qingxuan story clock constants beyond cap | low value: rate 0.3 read; per-event windows are data tables | `private/qingxuan/pretty.js` 1229-1246 |
| Heavenly Path "Living Jianghu" / "Sects Become Real" | server-side or withdrawn: not in served 0.2.1 build; devlogs only | `private/heavenly-path/devlog_1591305.html`, `devlog_1576735.html` |
| Ascendant Dao puppetry | closed | `private/ascendant-dao/pretty.js` 13274-13350 |
| Ascendant Dao formations | low value: only a skill id in code read; recipes not traced | `pretty.js` 9106 |
| Ascendant Dao 3D map | closed as not found: region graph, no 3D code | `pretty.js` 9240 |
| Ascendant Dao sect raids, secret realms, whole 52k lines | low value: cave raids traced; remainder is standard idle content | `pretty.js` 10536-10593 |
| Great Expanse full event library | low value: large authored text tables; mechanism (offline, karma, deed field) already traced | `private/great-expanse/stripped.html` |
| Great Expanse AI-assisted claim | needs play or developer statement: not decidable from code | n/a |
| First Dawn remaining ~100 modules | low value: delta (investigations, journal, atlas) is what was asked; older systems are in REPORT.md | `private/first-dawn/` |
| First Dawn journal cross-life persistence | closed by source: stored in cross-life meta, copied on save | `first-dawn/game.js` 5610, 44270 |
| Reincarnation System sect doctrine, pill resistance, challenge lives | low value: standard prestige-idle modifiers | `private/reincarnation-system/pretty.js` 3966, 4624-4640 |
| Immortal Ascension beast taming details | low value: beast slots and equip rules read, no breeding or growth system exists in this build | `private/immortal-ascension/pretty.js` 584-595, 840 |
