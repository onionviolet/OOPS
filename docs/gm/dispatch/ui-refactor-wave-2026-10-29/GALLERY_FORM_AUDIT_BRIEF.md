# Gallery form audit brief (2026-10-30, ready to run)

Weibao, 2026-10-30, after seeing the gallery: "better but not quite, I feel like it can be so much better, but idk how, can we send these indeas into something to audit each of them, to be less generic and also less wall of text? what liberties do we need to take in that case?"

Feeds the look owner: `ui-identity` lane, `DESIGN.md` ([UI identity wave](../ui-identity-combat-2026-10-30/PLAN.md), O1 accepted, O3 diegetic UI after the basic kit). This audit proposes; DESIGN.md decides.

## What is generic today (coordinator's read of the 1920x1080 captures)

- Every figure prints its full text form under it, so each section is a wall of text even when the picture is clear.
- One bitmap mono face at one size for titles, labels, values and prose: no hierarchy, nothing to read first.
- Boxes in boxes with the same hairline frame: home, ledger, crossing, insight all look like the same dashboard.
- The same fact is said three times: a count ("4 of 5 fitted"), the chips, then a key and a text line.
- No object, place or hand in it: nothing looks like a ledger page, a ticket, a floor plan, a sky, two people facing each other.

## Per section, the audit answers

1. What the player needs from it in two seconds (one line).
2. Word count now, and a target.
3. What makes it generic (from the list above or new).
4. A bespoke form: the object it should look like in this world (diegetic where it helps), with one reference game and what that game does (known or inferred).
5. Which liberty it needs (L1-L6 below) and the cost.
6. Effort and an owner: gallery draft, DESIGN.md rule, or a lane.

Then pick the five sections with the biggest gain and build them as side-by-side redesign drafts in the gallery ("Redesign:" next to the current one), so Weibao judges by eye.

## Liberties the redesigns may take (gallery drafts only until Weibao accepts them for play)

- L1. Text form off screen: the figure's text form goes to hover, a "read as text" toggle and screen readers, not printed under every figure.
- L2. Typographic hierarchy: big value, small label, a second face for headings and numbers; the bitmap face stays for the Luminous identity, not for everything.
- L3. Bespoke object per system and per world (AD46): one shared grammar underneath, but the surface may be a ledger page, a ticket, a floor plan or a sky band rather than a framed box.
- L4. Drawn assets: small SVG illustrations, icons and textures, still from tokens for colour.
- L5. Say it once: drop keys and repeated counts when the picture already carries them; the details sit one click away.
- L6. Show what matters now: default views show changes and the next decision, and the full inventory sits behind a disclosure.

## Model and budget

Sonnet design auditor reading the gallery captures and fixtures, with the advisor tool for taste calls. One agent, about 2-3% weekly. Writes `docs/audits/GALLERY_FORM_AUDIT_2026-10-30.md` and the five redesign drafts; sends DESIGN.md proposals to `ui-identity`.

## Round 2: blocky Luminous variants

Weibao, 2026-10-30: drop the bright (paper) skin, work in the blue Luminous Gothic only; housing "can just be like a blocky or more abstract"; the drafts are "better in some ways but still not the best they can be".

Why round 1 fell short (coordinator's read): one agent drafted one answer per section with no visual target, so each draft is a guess. Drawn icons (bed, hearth) read as clip art in a bitmap-glow look. Nothing was compared against how finished games solve the same screen.

Round 2 method:
1. Reference board first. Per section, three to five games that solve the same screen, each with what it does (known or inferred). For housing: Crusader Kings III holding slots (equal squares, filled, empty, locked), RimWorld rooms (labelled rectangles with a few stats), Melvor Idle Township and Kittens Game (building rows with level, count and effect), A Dark Room (a plain list that grows), Darkest Dungeon hamlet (an upgrade pip track per building).
2. Three Luminous variants per section, side by side, each a different idea, one of them unusual. Housing default set: H1 slot grid (CK3 style: one glowing block per built room or fitting, a hairline outline for buildable, dim for locked, one short word under each); H2 block skyline (each built room stacks a block onto the home's silhouette, unbuilt rooms as ghost blocks); H3 stat-first card (comfort, upkeep and storage as three big meters, with a thin strip of blocks under them).
3. Self-critique loop: the drafter captures its own screenshot at 1920x1080, critiques it against the board and the six liberties, and revises at least twice before showing.
4. Weibao picks by eye; the chosen form goes to DESIGN.md (`ui-identity`) and then into the live view.

Order: housing first (the weakest), then owed ledger, crossing, ladder and versus, then gathering (largest unbuilt gain).

Model: a Sonnet drafter with the advisor for taste calls; if two Sonnet rounds still fall short, one Opus pass on the board and the critique, with the reason stated (agent usage rules).

### Round 2 queue: other aspects with the same gap (Weibao 2026-10-30: "we need to consider similar runs like this but for other aspects too that have similar gaps")

Grouped by family so one run shares a grammar and a reference board. Each run: board, three Luminous variants (one unusual), two self-critique passes, side-by-side shot, Weibao picks. Ranked by gap (visible words now against the audit's target, and how often the player sees it). GF codes are rows in the [gallery audit](../../../audits/GALLERY_FORM_AUDIT_2026-10-30.md).

| Run | Family and GF rows | Words now, target | Reference games to board (check each) | Variant seeds |
| --- | --- | --- | --- | --- |
| R2-0 | Housing, GF25 | 120-192, 15 | CK3 holdings, RimWorld rooms, Melvor Township, A Dark Room, Darkest Dungeon hamlet | Done `e14fa4694`: H1 slot grid (worker pick), H2 skyline, H3 stat card; Weibao's pick pending |
| R2-1 | Places and sources: gathering GF30, walks GF22 | 259-530, 40-80 | Stardew forage and seasons calendar, Melvor skilling rows, Dwarf Fortress site lists, Kenshi map | site blocks with a stock fill; a season strip with open spans; a nearest-first departure board |
| R2-2 | Away and time: return digest GF16, day band GF28, loop GF18 | 131-325, 50-70 | Fallout Shelter and idle "while you were away" summaries, Majora's Mask clock, Frostpunk day bar | a tally block per source; a sky strip; a three-day dial |
| R2-3 | People: who knows GF9, family GF21, lives GF17, standing GF24 | 101-459, 40-90 | CK3 family tree and relations, Dwarf Fortress relationships, Rimworld social tab | a who-knows matrix of blocks; a register with blocks per kin; a standing rung bar |
| R2-4 | Progress: ladders GF4/GF10, study GF15, knowledge GF14, character sheet GF2 | 151-344, 40-80 | Path of Exile and Grim Dawn trees, Disco Elysium thought cabinet, Melvor mastery, Persona confidant ranks | one rung bar per ladder; a slot rack for thoughts; a progress block per study |
| R2-5 | Body and making: body GF23, benches GF8/GF11, recipe flow GF12 | 87-278, 40-90 | Dwarf Fortress health, Darkest Dungeon afflictions, Potion Craft, Factorio flow | a block body (head, torso, limbs as blocks); an ingredient slot row with missing as outlines |
| R2-6 | Fights: versus GF7, chase GF13 | 82-401, 25-40 | Slay the Spire intents, Into the Breach, Darkest Dungeon ranks, FTL | two block columns facing; a road strip with distance blocks |

Also the live panels the coverage audit flagged as still long (Village experiments 181, Standing and ledger 122, Vows and trials 111): they ride with R2-5, R2-3 and R2-4.

Order: wait for R2-0 and Weibao's pick to check that the method works, then R2-1 and R2-3 (largest gaps), then the rest. Budget: each run is about 1-2% of the week; all six would pass the weekly cap, so after R2-0 they run from the 2026-11-02 reset unless Weibao says otherwise.

State 2026-10-30 night: R2-1 done `8e777f646` (picks: gathering G3 counted bed with G2 season strip, walks W1 departure board); R2-3 done `193409638` (picks: W1 who-knows grid, F1 register for family, F3 life stack for lives, S1 rung bars or S3 rank cards). Lesson: blocks need a word under them; bare blocks and initials (H2, W2, W3, F2) push meaning into hover. Remaining runs R2-2, R2-4, R2-5, R2-6 wait for the 2026-11-02 reset.

## How much abstraction (Weibao 2026-10-30: "HOw much abstraction is too much abstraction? Just the right amount of detail?" then "MOre to consider?")

Base answer (round 0): name the noun in words, encode the state in shape; the two-second test (answer the view's one question without hover; hover is for why and how, never what); detail set by the decision it serves, how often the view is seen, how many items (about seven before grouping) and the stakes; earned abstraction (words first, blocks once familiar).

### Round 1 (proposals; codes AB1-AB12)

ACCOUNT FOR NOW (constraints on the coming variant runs and on wiring the picks):
- AB1. Detail follows knowledge. What the character knows is drawn crisp; what is guessed is outlined; what is unknown is fog or a dim block. Abstraction carries the knowledge model (observerView, UR80, sealed secrets) instead of fighting it.
- AB2. Precision is earned. Numbers can be bands ("about 20 min", "a few left") until a skill, tool or cheat gives the exact value (the COMBAT note that appraisal turns a word into a number). Default: exact where the game already knows and the character would; bands elsewhere.
- AB3. Exceptions break the abstraction. A strained, late, dangerous or closing thing expands itself with words (H3's meters appear only when strained; OVERDUE stamps). Quiet when fine, loud when not.
- AB4. One state grammar everywhere: glowing filled = have or know, hairline = possible or guessed, dim or hatched = locked, lost or unknown, amber = needs care. A block means the same thing in housing, people and places; the style guide shows it once.
- AB5. Three densities per representation: glance (a side column or strip, 1-5 words), panel (the variants, 10-40 words), inspector (full detail and the text form). Each figure spec can render at any of the three.

LATER / DELEGATE (level, effort, done check):
- AB6. Earned abstraction as a mechanism: a per-system familiarity count (opens, uses) switches labels from explained to terse; hover keeps the words. Sonnet medium; done when a fresh life shows explained labels and the same view after N uses shows terse ones, saved across reload.
- AB7. Player density dial in Appearance (Explained, Standard, Terse), adjective not fixed (AD22). Sonnet low after AB5; done when the dial changes the three densities live.
- AB8. Per-world abstraction level (AD46): a bureaucratic world shows ledgers in detail, a wild world shows blocks; a world-look token picks the default density. With `ui-identity` per-world skins (O2).
- AB9. Measure it: a gallery and UI check reporting visible words per view, blocks without an accessible name, and facts reachable only by hover. Extends `uiCheck`. Sonnet low; done when the check flags H2's pips and W2's initials.
- AB10. Search over hidden text: one search box over the "read as text" forms so detail moved off screen is still findable. Sonnet low.
- AB11. The smallest surfaces: the Electron window title, dock badge and tray show the glance density (what needs you now). Sonnet low; done when a strained state shows in the title while the window is hidden.
- AB12. Motion carries change: a block filling or dimming as time passes says "changed" without a sentence; respects the effects setting. Fold into FLA work.
