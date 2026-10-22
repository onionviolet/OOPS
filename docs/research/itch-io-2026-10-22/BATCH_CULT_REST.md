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
| Idle Xanxia | itch html, Vite bundle, plain minified | Decoded in part. Rich on rebirth prep and Dao tiers. |
| Ascension Tower | itch html, 1.4 MB inline script, plain | Decoded in part. Colony trust/gift/warehouse. |
| Cultivation Genesis | itch html, 9 plain script files | Decoded. Small but clean. |
| A Mortal's Path of Cultivation | itch html, inline plain | Decoded in part. Best life-sim fit. |
| Quest of Qinghe | Godot 4.5 web PCK, scripts compiled | Extracted and decoded (13 script files, 0 errors). Read lightly. |
| Olumsuzluk Yolu (Turkish) | itch html, inline plain, tailwind | Skimmed: meridians, sutras, dongfu, nemesis list, pill toxin. |
| Path of Immortal | itch html, inline plain, 172 KB | Skimmed: lifebound artifact, disciples, reincarnation, heavenly mandate. |
| Alchemy Sovereign | itch html, inline plain | Read in full. Thin (sell or eat pills, cauldron speed ladder). |
| Sect Management Alpha | game.js plain | Read the head. Thin (jobs, building levels, disciples). |
| Idle Qi Cultivation | itch page is a landing page for idleqi.com | Skipped, external host, thin listing (1.0 stars). |
| Cultivators Chronicles | Android APK plus mobile-only web bundle, 8 MB plain | Skimmed content tables only. Mobile-first, and the page says no desktop version. |
| Cultivation Core Incremental | Vite bundle 735 KB | Page read only: tribulation, talent points on reincarnation, companions. Not decoded. |
| Xianxia Idle | `js/main.js` 6193 lines | Page and header comments only. Not decoded. |
| Dao of the Endless Sky | external site daoendlesssky.com | Skipped, external host. |
| Nivrael | playable only on nivrael.com | Skipped, external host. |
| Chronicles of Cultivation | `client/index.html` of an online multiplayer game | Skipped, server driven PvP/MMO. |
| SectMind | online PvP, Android/Windows | Skipped, server driven. |
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
  `src`. Proposal: gift tier as the relationship gate (a minimum gift size per bond tier) so cheap gifts cannot grind a deep bond, plus rumours
  unlocked by aggregate standing rather than per person.

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
  area clears with a "report back to the NPC" toast when done; a spiritual-root test popup; five sects tied to the five elements, a skill sold only at a sect
  and a realm (price 900, realm 4); sect required to open some map areas. Ads and platform SDK present (not read).
- **YAIR mapping**: NPC dialogue that depends on which chapters you have seen is a cheap lore-state idea; quest and companion systems are elsewhere in `src/quests.js`.

## Skims worth a line

- **Olumsuzluk Yolu** (Turkish, AI-assisted everything): eight named meridians each with a qi and stone cost and a distinct effect (one slows pill-toxin buildup
  by 30%, one absorbs 25% of tribulation damage, one blocks qi deviation); a daily income from conquered vines scaled by realm and abode array level; a nemesis list and sutras. `index.html` ~2143, ~4711.
- **Path of Immortal**: one lifebound artifact bound at Golden Core that can then be refined or evolved; a three-way final choice (ascend, demon lord, transcend);
  reincarnation gives power, 10% stones and 20% dao; disciples from a pool with talent bonuses; background points system at creation. ~1664, ~3085, ~3182, ~3252.
- **Cultivators Chronicles** (mobile): rebirth upgrades "Ancestral Might" (+10 to all attributes per level), "Eternal Qi Flow" (additive, no cap), "Karmic Rebound"
  (failed breakthrough returns a share of qi); Dao elements with pair combos (fire plus wind spreads burn on kill). `pretty.js` 9220-10520.
- **Alchemy Sovereign**: customers are realm-limited; a hard-coded cheat code and the stated feedback that its only choice is eat versus sell.
- **Sect Management Alpha**: 10 realms, jobs (idle, mine, garden, cultivate), disciples cap 3 + 2 per sect level. Thin.

## Top findings (proposals)

1. **Retention as a purchasable dial** (Tụ Linh Quyết, Cultivators Chronicles): what a new life keeps (beasts, gear, techniques, starting realm, automation) is itself the rebirth shop; automation is a reward, not a toggle. Maps to the cross-world carry-over rules; check against `src/heir_inheritance.js` and `src/home_inheritance.js`.
2. **Written no-loss contract and bed ripening** (Ninefold): a first-screen promise that absence only helps, plus work beds whose value settles at collection and wait forever. Maps to offline and field work (`src/field_works_*.js`).
3. **Gift size as a relationship gate and aggregate rumour unlock** (Ascension Tower): minimum gift per bond tier; rumours gated by summed standing. No hit in `src`.
4. **Impurity with timed purge commissions gated by sect rank** (Idle Xanxia): extends the existing pill-toxin and impurity fields in `src/items.js`.
5. **Layered anti-repeat narrator and build-sensitive consequence line** (A Mortal's Path): small, text-only, fits the chronicle; plus keyed chronicle entries (Cultivation Genesis).

## Verification

Read: pages of 21 titles (page text, platform, build ids); full builds for Tụ Linh Quyết, Ninefold, Idle Xanxia (grep plus targeted ranges, not whole),
Alchemy Sovereign, Cultivation Genesis (systems and part of `game.js`), A Mortal's Path (function map plus five functions), Ascension Tower (data tables), Qinghe (pack listing plus
`StorySystem.gd` and part of `GameData.gd`). Not read: the bulk of Idle Xanxia, Cultivators Chronicles, Ascension Tower and Qinghe code; Xianxia Idle, Core Incremental; the
external-host games. No game code was executed. The Tụ Linh Quyết decode ran a Python string decoder and evaluated its rotation arithmetic in Python, not in a JS engine.
About 80 tool calls; the itch site returned 429 on some early requests and the fetch loop waited as the brief allows. Nothing committed.
