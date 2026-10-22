# itch.io decode batch: remaining cultivation titles, 2026-10-22

Static reads only (see [decode brief](DECODE_BRIEF.md)). Raw files, hashes and notes are in the gitignored
`private/cult-rest/<slug>/`. Everything below is a proposal (AD32); no code or prose is copied beyond identifiers.
No license is stated on any page, so these are ideas only. "YAIR gap" means a keyword grep of `src/` found nothing, not that
a design doc lacks it. Items already in the screen report's I1-I12 are not repeated.

## Triage

| Game | Build | Verdict |
| --- | --- | --- |
| Tụ Linh Quyết (tu-linh) | itch html, one inline script, string-array obfuscated | Decoded. Rich. |
| Ninefold | itch html, React, plain minified | Decoded. Rich on offline fairness and onboarding. |
| Idle Xanxia | itch html, Vite bundle, plain minified | Decoded (second pass). Rich on impurity cap, rebirth keep-list and sect commissions. |
| Ascension Tower | itch html, 1.4 MB inline script, plain | Decoded (second pass). Colony trust, rumours, trade routes, warehouse. |
| Cultivation Genesis | itch html, 9 plain script files | Decoded. Small but clean. |
| A Mortal's Path of Cultivation | itch html, inline plain | Decoded in part. Best life-sim fit. |
| Quest of Qinghe | Godot 4.5 web PCK, scripts compiled | Extracted and decoded (13 script files, 0 errors), read in a second pass. |
| Olumsuzluk Yolu (Turkish) | itch html, inline plain, tailwind | Decoded (second pass). |
| Path of Immortal | itch html, inline plain, 172 KB | Decoded (second pass). Thin. |
| Alchemy Sovereign | itch html, inline plain | Read in full. Thin (sell or eat pills, cauldron speed ladder). |
| Sect Management Alpha | game.js plain | Read the head. Thin (jobs, building levels, disciples). |
| Idle Qi Cultivation | iframes idleqi.com (React + Supabase) | Client read; rules are in database tables, not readable. |
| Cultivators Chronicles | Android APK plus mobile-only web bundle, 8 MB plain | Decoded (second pass). Mobile-first, so UI findings are deferred per the standing UI priority. |
| Cultivation Core Incremental | Vite bundle 735 KB | Decoded (second pass). |
| Xianxia Idle | `js/main.js` 6193 lines | Decoded (second pass). |
| Dao of the Endless Sky | external site daoendlesssky.com | Unreachable (connection refused from curl and WebFetch). Page claims only. |
| Nivrael | nivrael.com is a landing page; the game is a Telegram mini-app | Read the site bundle. System claims are stated-not-found. |
| Chronicles of Cultivation | `client/` of an online game (PlayFab) | Client read: inventory UI only; rules are server-side. |
| SectMind | iframe to sectmind.com/game-panel | Shell only; rules are server-side. |
| Text Cultivation | Windows/Android only | Skipped, native only. |
| The Left Hand refers to the moon | p5.js survival/tavern art game (energy, hunger, inebriety, luck, "dosh") | Not cultivation. One line, no decode. |

## Tụ Linh Quyết (Vietnamese and English, v1.19.0)

- **Build identity**: itch html 19563849. `index.html` is a signed self-updating loader (fetches a newer signed `game.html` from a
  Supabase bucket, verifies an ECDSA signature and SHA-256, falls back to the bundled build); bundled `game.html` is 1,097,033 bytes,
  SHA-256 48d9bb0f...cad. Readability: obfuscated (base64 string array plus rotation plus arithmetic constants). Decoded by a small
  Python re-implementation of the string decoder (no JS run, rotation checksum matched); readable copy at `private/cult-rest/tu-linh/b/g.m.js`,
  English strings in `english.txt`.
- **Systems (source)**:
  - Each life rolls a spiritual root: about 5% rare special (lightning, ice, wind), then heavenly, dual, triple, and a mixed five-element
    root as the common case (`g.m.js` ~77-95). A free reroll once per life is a rebirth upgrade.
  - Three play paths with different verbs: tap, pill brewing, and holdings plus formations (idle). At each major realm the player picks one of two
    secret arts, no take-backs.
  - Breakthrough has a chance, a heart-demon meter that raises failure, a meditate toggle that lowers heart demon per second while pausing
    holdings, and a failed breakthrough that burns a share of qi and adds to a fail counter. Two fails in a row show a tip listing the fixes
    (~1685-1715).
  - Tribulation is a hand-played lightning block; a rebirth upgrade makes missed bolts count as blocked and later automates it.
  - Lifespan per realm; pills extend it, capped per life (5). Breakthrough pill +20% chance, holdable up to 5.
  - Rebirth currency (Dao Fruit) buys upgrades that keep specific things: beasts keep level, artifacts keep level, gear and inventory kept,
    all techniques kept, start at a later realm, auto-reincarnate at a milestone you choose "following the previous path". Automation of every
    chore is sold as rebirth upgrades (auto-buy holdings, auto-meditate at heart demon 60, auto-learn, auto-upgrade, auto-salvage by gear grade).
  - Sect: daily sign-in, rotating quests, contribution shop; weekly quests. Trial stages with themed drops (a master's abode gives extra gear, a
    sword tomb drops only higher-grade weapons). Spirit beasts as companions, each with a level and a rebirth bonus.
  - Narrative micro-events with a pill/trade choice and heart changes (`~881-960`, `1116-1130`).
- **Representations**: first-open path choice described by player type ("for players who like to tap / plan / idle"); an in-game bilingual toggle on every
  string; dantian art evolves per realm.
- **Improvements stated**: none in comments (obfuscated). The "two fails in a row show a tip" nudge reads as a fix for a stuck player.
- **YAIR mapping**: lifespan exists in `src/simulation.js` and `src/chronicle.js`; no keyword hit in `src` for heart demon, tribulation, spiritual root or meridian.
  The reusable idea is not those nouns but the rebirth shop shape: what a new life keeps is a purchasable dial (AD for retention across lives, see
  `docs/RULES_INDEX.md`), and automation unlocked as a progression reward rather than a setting.

## Ninefold (closed test, one developer, AI-assisted art and music disclosed)

- **Build identity**: itch html 19505756; `assets/main-CEjG88O_.js` 189,465 bytes, `theme-BDUfP53e.js` 212,413 bytes; React; plain minified.
  Rankings are server checked, the main play site is on GitHub Pages (not read).
- **Systems (source, mostly strings and tables in `theme.pretty.js`)**:
  - A written offline contract: qi gathers at full rate while closed; being present gives up to 3x for about a quarter hour; "nothing is ever taken away
    for being away"; losing any fight, warden or tower floor costs nothing (line 2221, 2239).
  - Cave with three beds: plant material, it ripens into qi over real hours; yield is priced at the qi rate when you take it, so a breakthrough while
    it grows makes it worth more; a ripe bed waits forever, and the only cost of lateness is the occupied bed (1050, 2250).
  - Per-realm cap on each qi upgrade (a "full box is the next realm calling"), with one exception priced in dropped material (2257).
  - Breakthrough grants three insight cards, taking one closes the other two (2236). Gear in five ranks and six schools; three pieces of a school wake
    a class, a mix of schools yields a hybrid "calling" (530, 2254). Seven crafts level 1-99 and keep working twelve hours after you leave (2257).
  - Nothing ever resets; each realm opens a tab and the locked tabs name the realm that opens them.
- **Representations**: a "what you hold" legend, a key for every glyph, a short guided tour whose steps each state a promise; a "while you were away" card
  listing qi gathered, layers opened, realms climbed.
- **Improvements stated**: free technique points shown as "unspent, never expire, every one permanent".
- **YAIR mapping**: offline and branch clock owners exist (AD list in `docs/RULES_INDEX.md`); field work ripening is in `src/field_works_ui.js` and
  `src/field_works_projection.js`. Proposal worth checking against them: the bed's value settles at collection time at the current rate, and a
  stated no-loss-for-absence promise surfaced on the first screen.

## Idle Xanxia (alpha, AI-assisted art and code disclosed)

- **Build identity**: itch html 17169794; `assets/index-BEq8ZZ4p.js` 1,501,261 bytes, Vite, plain minified, 25,407 pretty-printed lines.
- **Systems (source, `pretty.js`)**:
  - Permanent pills add stats but also add impurities; a sect hall sells "refinement" commissions that take real minutes (30/60/90) and merit,
    gated by sect rank (outer, inner, core, direct, junior elder), including purification drafts (reduce impurities by 5/10/15), impurity cap
    increases and rebirth-preparation pills by tier (spiritual, earth, heaven: 75/125/200 merit, 30/60/90 min). Junior elder gets 25% off (12401-12440).
  - Dao paths per element with tiers 1-5 and XP per path; the Dao tier is kept at the start of a new life ("even newly reborn"), progress claimed by
    clearing floors (12016, 12640). Dao pairs and a hero Dao slot list exist (11305).
  - Aspects awakened and equipped; 100 floors with a boss every ten.
- **YAIR mapping**: `src/items.js` already mentions impurity; check against the home/sect work queue and `src/home_staff.js` before treating commissions
  with rank gates as a gap. Not found in `src`: purification and cap-raise as separate timed commissions.

## Ascension Tower (HTML5 in development, Steam link, AI-assisted)

- **Build identity**: itch html 17068318, index.html 1,477,214 bytes inline, plain. `at_art.js` is referenced but 404 on the CDN (art only).
- **Systems (source, `index.html` ~7930-8330)**:
  - Colony with three named NPCs (merchant, scavenger, orphan leader). Trust per NPC runs 0 to 100 in seven labelled tiers; each tier sets a minimum
    gift size, and gifts cost 100/500/2000/10000 for 3/6/12/25 trust. Tavern rumours are gated by the sum of all NPC trust and some rumours unlock
    productions (8004-8130).
  - Warehouse that charges a deposit and sells opted-in goods every 120 s at 25% of market (8213, 8318). Colony skill tree with prereq chains and
    per-rank bonuses; trade and caravan routes; storage containers per resource.
  - Prestige currency (jade tokens), evolved and ascendant class tiers, realm techniques with one selectable per realm, qi buffs bought with a timer.
- **YAIR mapping**: household staff and companions live in `src/home_staff.js` and companion files; no keyword hit for trust tiers or gift gating in
  `src`. Proposal: rumours unlocked by aggregate standing rather than per person. A minimum gift size per bond tier would stop cheap-gift grinding, but this game only hides the buttons; YAIR would have to enforce it in its own rules.

## Cultivation Genesis (alpha, English/French)

- **Build identity**: itch html 17506541 at `Cultivation Genesis/index.html`; 9 plain scripts (`game.js` 61,413 bytes).
- **Systems (source)**: one mission list that runs in two modes: personal (full duration) or delegated to the sect (duration scales down by 4.5% per sect level, floor 62%,
  `systems/sect.js`). Alchemy success chance 68% plus mind scaling, capped 94% (`systems/alchemy.js`). Prestige ascension tiers raise all costs.
- **Representations**: the chronicle log stores translation keys plus fields, so toggling language rewrites old lines (`game.js` 44-160).
- **YAIR mapping**: chronicle owner is `src/chronicle.js` and `src/lore_history_state.js`; check whether entries are stored as keys plus fields. Delegation
  speed-up with a floor is a small, concrete formula for household work.

## A Mortal's Path of Cultivation (released, AI-assisted)

- **Build identity**: itch html 19459422, 125,780 bytes inline, plain. Life sim from age 0, year ticks.
- **Systems (source)**:
  - 200+ backgrounds, 1,000+ generated talents (pool rolls, rerolls), stat allocation, a coming-of-age decision.
  - Named NPC slots capped at six with a type each (rival, ally); a duel with a visible enemy intent per round (heavy, quick, guarding).
  - Law comprehension grows yearly from insight and the law's stat; four epiphany stages (`yearlyTick` L850). A Heavenly Ranking among young geniuses is
    revised every ten years with an in-text rise or slip (L850-862).
  - A style check after each choice compares which stat moved most to your average: a strongest stat gives a bonus and a lean on your weakest stat
    costs progress and a year of life (`styleCheck` L1098).
  - Narration is layered: a core line plus a reflection, situation lines, a method or body line, sect-life line, with a "pick fresh" helper to avoid
    repeats (`composeText` L1086). Treasures with one-shot life-saving talismans, seclusion for n years with a per-year deviation chance.
- **YAIR mapping**: life record and chronicle are in `src/life_record.js` and `src/chronicle.js`; no keyword hit for peer ranking in `src`. The anti-repeat layered
  narrator and the build-sensitive consequence line are the transferable pieces.

## Quest of Qinghe (v1.2.0, Godot 4.5 web, text in Chinese and English)

- **Build identity**: itch html 19919342; `index.pck` 10,796,252 bytes (SHA-256 87665a05...), Godot pack format 3, 165 files, 64 scripts
  (many are a mini-program SDK addon, removed from the copy). Extracted with a small parser (the shared `extract_pck.py` expects an embedded pack with trailer),
  decoded with `decode_gdc.py` (13 files, 0 errors). Core files: `IdleScene.gd` 5,214 lines, `GameData.gd` 1,967, `StorySystem.gd` 632.
- **Systems (source, read lightly)**: story gating by flags `v1_2`/`v1_3` that change how an NPC speaks (`npc_stage`); quests tied to kill counts or
  area clears with a "report back to the NPC" toast when done; a spiritual-root "test" that is cosmetic (the root is a uniform random pick of five elements); five sects tied to the five elements, a skill sold only at a sect
  and a realm (price 900, realm 4); sect required to open some map areas. Ads and platform SDK present (not read).
- **YAIR mapping**: NPC dialogue that switches stage with a once-per-realm story flag is a cheap lore-state idea (there is no numeric respect system; an earlier line implying one was wrong); quest and companion systems are elsewhere in `src/quests.js`.

## Skims worth a line

- **Olumsuzluk Yolu** (Turkish, AI-assisted everything): eight named meridians each with a qi and stone cost and a distinct effect (one slows pill-toxin buildup
  by 30%, one absorbs 25% of tribulation damage, one blocks qi deviation); a daily income from conquered vines scaled by realm and abode array level; a nemesis list and sutras. `index.html` ~2143, ~4711.
- **Path of Immortal**: one lifebound artifact bound at Golden Core that can then be refined or evolved; a three-way final choice (ascend, demon lord, transcend);
  reincarnation gives power, 10% stones and 20% dao; disciples from a pool with talent bonuses; background points system at creation. ~1664, ~3085, ~3182, ~3252.
- **Cultivators Chronicles** (mobile): rebirth upgrades "Ancestral Might" (+10 to all attributes per level), "Eternal Qi Flow" (additive, no cap), "Karmic Rebound"
  (failed breakthrough returns a share of qi); Dao elements with pair combos (fire plus wind spreads burn on kill). `pretty.js` 9220-10520.
- **Alchemy Sovereign**: customers are realm-limited; a hard-coded cheat code and the stated feedback that its only choice is eat versus sell.
- **Sect Management Alpha**: 10 realms, jobs (idle, mine, garden, cultivate), disciples cap 3 + 2 per sect level. Thin.

## Second pass (full reads of the games first skimmed or skipped)

Detail with locators is in `private/cult-rest/NOTES_A_*`, `NOTES_B_*`, `NOTES_C_*`, `NOTES_D_external_hosts.md`.
Mapping greps below are keyword and file-name greps; owner files were not opened unless noted.

- **Ninefold live build** (github.io host, newer than the itch iframe): rebirth is optional ("staying loses nothing"). The only numeric carry-over is an Echo added to qi per second, with a hard roof: the first mark of a life leaves the most, and each doubling of marks or of lives adds one small step. Also carried: a title per life (list capped), best records, the gear codex at the best rank any life reached, a share of workshop experience per craft, who you are and chest filters. Reset: realm, gear, materials, tower, beds, secret realm, workshop pouch and tools. Gear chest has capacity, named loadouts, set pieces protected from melting. Maps to the carry-over rules around `src/heir_inheritance.js` and `src/home_inheritance.js`; a roofed, doubling-step carry is not in `src` by grep.
- **Cultivators Chronicles**: rebirth keeps NPC affinity of 75+ and province reputation of 100+ as values (a threshold rule), body-refinement levels up to a bought budget, and lifespan base rising 75 per rebirth. Aging while away ends in a "pending death" flag instead of killing the character. Six real-time World Ages rotate with random durations and qi or path multipliers. Seven Dao elements unlock nine pair combos when both reach rank 1. Province elders send gift letters at affinity milestones. A clock-cheat defense exists; not relevant to YAIR (AD22). Mobile-first, so presentation ideas are deferred under the standing UI priority.
- **Cultivation Core Incremental**: before each breakthrough you pick a quality (1x, 2.5x, 5x cost) that also sets the strength of the passive you pick after a click-to-dodge tribulation (2%, 5%, 10%). Reincarnation from realm 6 keeps pets, techniques, equipment and talents, grants one talent point, and realm costs rise 10x per rebirth. No "Spirit Sanctuary" or "ancient arts" strings exist beyond the pet panel and techniques tree; the page's claims were overstated.
- **Xianxia Idle**: 11 realms, lifespans from 50 years to infinite, time speed affects aging only. Death pays half the karma of a voluntary rebirth. Offline gain is capped at 16 hours and offline aging still kills. The developer's header describes a fix for about 500 instant rebirths when lifespan hit zero (guard flag, single-pass check, one offline death check, per-life latch).
- **Idle Xanxia**: impurity is a hard cap on permanent pills (base 100 plus a persistent bonus; a pill that would exceed it is refused), not a penalty. Purge and cap-raise are sect commissions paid in merit, real-time, rank-gated, with a 25% discount for Junior Elder. The rebirth code has an explicit keep-list (daos, aspects, elixir stats, shop, sect rank and contribution); level, gold and floor reset; current impurity is not on the keep-list (inferred reset). Each rebirth picks Soul (+1 aspect slot, to 8) or Body (+1 stat point per level, to 10); the prepared pill sets the next life's starting level. Offline: 8 hours at -50%, sampled encounters, a receipt. Mission board refreshes on 2h, 6h and 24h cadences. No daily-reset or streak code found. Impurity cap and commission ladder are not in `src` by grep (`src/items.js` has an impurity field only).
- **Quest of Qinghe**: the spiritual-root test is cosmetic (uniform random of five elements); sect follows from root by a fixed table; membership gates per-sect maps and one skill. Story flags fire once per realm and change the elder NPC's dialogue stage; there is no numeric respect system. Equipment stats derive from slot, realm and grade (not stored). The rebirth-like "layer loop" is a diminishing multiplier that leaves realm, gear, root and sect alone. The blackhole scene is a gravity-puzzle minigame. Offline pays rate x time x 0.1 up to 8 hours (12 from realm 8). Save is one plain JSON file.
- **Olumsuzluk Yolu**: one 360-day clock; story chapters unlock at cumulative-day thresholds. The four seasons are display only (their bonuses are never read). Pill toxin does not rise with time: soft qi penalty above 40 and 70, breakthrough blocked at 85; the "qi deviation" warning has no random event behind it. Tribulation is three waves each answered with a different defence (tank, shield, flying sword, pill). Wronging an auction winner creates a persistent nemesis with a bounty. A companion list is a per-character affinity gate that unlocks a monthly joint-cultivation action and a one-time permanent bonus for one chosen partner (mechanism only; nothing explicit read).
- **Path of Immortal**: point-buy creation with a difficulty budget; lifebound artifact evolves through four tiers each needing a material; reincarnation carries a small power, stone and dao share; fate points buy a retry on a failed breakthrough; sect facility effects, disciple talent tags and faction standing are not found in code; the three endings are text screens. Thin.
- **Ascension Tower**: three class tiers (base, evolved, ascendant at level 30) stored as data; breakthrough has four risk presets with stat-adjusted fail chance. Colony trust is the sum of three NPCs' trust. Rumours need summed trust plus a floor before they open a production; trade routes need one named NPC's trust. Warehouse auto-sells opted-in goods at 25% of market every 120 s. An occupation-resistance score (-200 to 200) locks story paths at floor 75. Two bugs: the tier `minGift` field only hides cheap gift buttons in the UI (no rule enforces it), and one place uses the id `sanya` where the roster id is `saya`.
- **Idle Qi, Nivrael, Chronicles of Cultivation, SectMind**: rules are server-side or in a Telegram app. Nivrael's landing page claims nine NPC houses acting on their own schedule with a Chronicle of what happened while away, a Foundation Purity percentage with a permanent 5x at 100%, and 108 Dao fragments; none is verifiable (stated-not-found). Idle Qi has companions with bond XP and last-fed time and a 60-second opening session. Dao of the Endless Sky could not be reached.

## Top findings (proposals)

1. **Roofed carry-over with diminishing steps** (Ninefold live build) plus **retention as a purchasable dial** (Tụ Linh Quyết, Idle Xanxia's Soul or Body pick, Cultivators Chronicles' threshold rule: affinity 75+ and reputation 100+ survive). Check against `src/heir_inheritance.js` and `src/home_inheritance.js`.
2. **Absence contract and settle-at-collection beds** (Ninefold), with Cultivators Chronicles' "pending death" instead of dying while away and Xianxia Idle's single offline death check. Check against `src/simulation_clock.js` and the field-work files.
3. **Hard cap on permanent pill use with timed, rank-gated purge commissions** (Idle Xanxia), versus Olumsuzluk's toxin bands that block breakthrough at 85. Extends `src/items.js` impurity.
4. **Aggregate-standing rumours and per-NPC trade routes** (Ascension Tower); its own gift-tier minimum is only a UI filter.
5. **Layered anti-repeat narrator and build-sensitive consequence line** (A Mortal's Path), plus keyed chronicle entries (Cultivation Genesis).

Cross-cutting: several of these games advertise or display content their code never reads (Olumsuzluk seasons, Qinghe root test, Core Incremental sanctuary, Ascension `minGift`). Worth checking that every YAIR table has a consumer (AD36).

## Verification

Read in full or by traced function: Tụ Linh Quyết, Ninefold (itch and live builds), Cultivation Genesis, A Mortal's Path, Alchemy Sovereign, Sect Management Alpha head. Read by three sonnet readers with locators (two spot-checked by me; the `minGift` claim was corrected after my check): Cultivators Chronicles, Core Incremental, Xianxia Idle, Idle Xanxia, Quest of Qinghe, Olumsuzluk, Path of Immortal, Ascension Tower. Idle Xanxia floor and boss table line numbers in the notes are approximate. Not read: Idle Xanxia combat formulas beyond level-gap scaling, Qinghe `BattleEngine.gd`, Ascension Tower technique table and story text, Cultivators Chronicles familiar care. Unreachable: Dao of the Endless Sky (connection refused by curl and WebFetch), Nivrael's Telegram game. Skipped as native-only: Text Cultivation. Not cultivation: The Left Hand refers to the moon. No game code was executed; the Tụ Linh Quyết string decode used a Python re-implementation of the decoder. Nothing committed.
