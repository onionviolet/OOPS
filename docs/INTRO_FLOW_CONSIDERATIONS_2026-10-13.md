# Intro flow considerations (2026-10-13)

> Codes renamed 2026-10-19 from CX1-CX20 to ICX1-ICX20, SR1-SR10 to ISR1-ISR10 and AU1-AU6 to IAU1-IAU6 to avoid collision with registered CX (complexity guardrails), SR (site rules) and AU (agent usage). See [reserved prefixes](RULES_INDEX.md#reserved-prefixes-2026-10-19).

Status: proposals and a palette, not accepted rules. Accepted direction stays
in [PROJECT.md](../PROJECT.md) and [USER_VISION.md](USER_VISION.md). Pick what
fits each world and each life; every row is a dial, not a fixed rule.

Weibao: "cosider best gameplay intro flow? More to consider? Cheats options
other stuff and more?"

Related owners: [cheat start, unlock gates, status window, random starts](CHEAT_LIBRARY.md#unlocking-the-optional-start-and-keeping-progression-intact-2026-10-13),
[start axes](STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md#p1-starting-possibilities),
[player identity](worlds/PLAYER_CHARACTER_IDENTITY_AND_CONTROL_2026-10-13.md),
[UI density audit](UI_DENSITY_AND_ORIGINAL_COMPARISON_AUDIT_2026-10-13.md).
This doc adds the flow (order, pacing, teaching) around them and does not
repeat their codes.

## What a new player sees today (source read, not played)

| Code | Finding | Where |
| --- | --- | --- |
| F1 | Loading screen, then one creation panel (name, gender, height, age, race), then the vanilla "Lost memory" wake-up in Village | `src/main.js:8122-8163`, `src/character_creation.js:15-93`, `src/quests.js:306-323` |
| F2 | The panel header says "purely cosmetic", yet it holds the two choices that change play: the optional system start and the reedling origin. Race and height, which look meaningful, do nothing | `locales/english.js:725`, `index.html:124-132`, `src/backlog_expansion_body.js:64,222-238` |
| F3 | The system is picked before the player knows any system; "Surprise me" gives the same single card; nothing shows the seed until it wakes | `src/main.js:8168-8178`, `src/cheat_cards.js:79-101` |
| F4 | No tutorial or hint layer; vanilla skills and places unlock through the elder, but several expansion panels (patrol, pacing status, repair, ledger, local life) show in Village from minute one | `src/main.js:639-672, 8333-8374` |
| F5 | Opening screen is crowded (53 controls, first game action at Tab stop 68) and the default layout is Workspace, against the Classic-default finding | UI density audit F2, F4; `src/workspace_layout.js:45` |

Accepted constraints this flow respects: the expanded run begins at a
suspenseful random start with Frontier optional (PROJECT.md, 2026-10-11);
the vanilla opening stays intact and playable; menus grow with discovery; the
optional start is the first cheat route; desktop first.

## IF: the shape of the flow (beats)

A good opening hands over, in order: something to look at, one obvious
action, a reason to care, visible feedback, then a first real choice. The
beats below can each be on, short, skipped or folded into another.

| Code | Beat | Default proposal | Dials |
| --- | --- | --- | --- |
| IF1 | **Title** | One screen: Continue, New life, Options. Continue is focused when a save exists | Title art per last world played; "title screen memory" from the fourth-wall doc |
| IF2 | **Who is playing** | Skip for a first life. Later lives open with the player layer (O8): lives so far, unlocks, the library | Shown always, after first death, or never (pure in-character) |
| IF3 | **Where and when** | Expanded run: a qualified random start, per the accepted random-entry decision (RW, RX below). Vanilla Village stays available as a chosen start and for existing saves. Later lives can also pick a known world or start | Locked until met (US-style), shown as silhouettes, or open in a creative start |
| IF4 | **Who you are** | Short creation: name plus the choices that matter here; cosmetic extras folded behind "More" | Per-world creation forms (a sect test, a class draw, a birth roll) |
| IF5 | **What you carry** | One "Advantages" step: cheat, origin, background boon, or nothing, each with a cost line | Merged into IF4, its own step, or hidden until unlocked |
| IF6 | **Cold open** | Wake-up text that ends on one visible action ("Talk to the elder") | Length: one line, a short scene, or skipped on later lives |
| IF7 | **First loop** | Act, see a number move, unlock the next thing within about a minute | Per-world tempo; idle worlds can open with a queue instead of a click |
| IF8 | **First choice that matters** | The elder's starter weapon is the current one; keep it | A world can open with its own: a sect, a job, a side in a fight |
| IF9 | **First surprise** | The dormant system wakes (first won fight or day 3) | Any held advantage's first message; or a world event; or none |
| IF10 | **Handing over** | Once the elder chain opens the field, guidance goes quiet | A "what can I do next" line stays available on request |

**Order principle:** choices that need understanding (cheat, world, strength)
come after the player has seen what they affect, or arrive as a sealed
promise ("something is with you; it will wake"). Cosmetic choices can come
first because they are cheap.

## CR: the creation screen

| Code | Consideration |
| --- | --- |
| CR1 | **Honest labels.** Split "Appearance (cosmetic)" from "Advantages (changes play)". Fix the cosmetic header first; it is a cheap, clear win |
| CR2 | **Everything defaulted, nothing buried.** All fields prefilled so Confirm works at once; on a laptop the form, the person preview and the advantages sit side by side instead of collapsing into "More" (standing UI priority) |
| CR3 | **Quick start.** A "Start now" button using defaults (or the last life's choices) beside the full form |
| CR4 | **Race and body mean something where the world says so.** In Village they can stay cosmetic but say so; in worlds where body matters (reedling, nonhuman lives) the same field shows effects and costs |
| CR5 | **Preview line.** Each consequential option shows one sentence of what it changes and its cost, using the card's known facts only (sealed parts stay sealed) |
| CR6 | **Origins are visible, not buried.** Reedling sits in Advantages with a one-line hook, not a collapsed experiment section; a disabled option says why ("needs a human body") |
| CR7 | **Randomize per field and all.** A dice on each field and one on the whole form; with a seed shown when RS3 lands |
| CR8 | **Change later, reasonably.** Name editable in bio already; appearance changeable through in-world means (a barber, a mask, a body change) instead of a hard lock |
| CR9 | **Per-world creation forms.** A system world rolls a class; a cultivation world tests roots; a modern world sets family income. Same data underneath, local presentation |
| CR10 | **Background as a sentence.** Optional "Before you woke" pick (farmhand, runaway, scholar's child) that gives one small skill head start and one opening line of flavor; fits the vanilla amnesia since memory can return in pieces |

## TE: teaching without a tutorial

The vanilla opening teaches through the elder. Expansion systems need the same
treatment instead of a tutorial wall.

| Code | Consideration |
| --- | --- |
| TE1 | **Gate panels behind the moment they matter.** Patrol after meeting the guard; repair after the first worn item; pacing status only when a pacing option is on; ledger after first paid work. Follows "menus grow with discovery" |
| TE2 | **One line on first reveal.** When a panel or tab appears, a single log line says what it is and why it appeared ("Your boots are wearing thin. Repair is now in Village.") |
| TE3 | **A soft highlight on new things.** A dot on a tab or panel that is new since last look; clears on open |
| TE4 | **People teach.** NPCs explain systems in their voice (the elder on fighting, Tessa on lanterns, the system's own first message on itself) |
| TE5 | **"What now?" on request.** A small button or the notebook lists one to three current leads drawn from real state; silent unless asked |
| TE6 | **Hints that fade.** Hints shown for the first life, shorter on the second, off after; a setting overrides |
| TE7 | **Spoiler-safe help.** In-game help per unlocked system, replacing the external spoiler-warned help page for new players |
| TE8 | **Teach by failure, cheaply.** Early fights and actions fail small and explain why ("Too tired; rest restores energy") |
| TE9 | **Per-world teacher.** A system world's window teaches; a cultivation world's master; a modern world's phone. Same TE5 data, local voice |

## CO: cheat and advantage options at the start (new angles)

Existing owners already cover unlock gates (US1-US6), dormant/costed starts
(ST11-ST17), status-window stages (SW), unlock progress (UP) and random rolls
(RS). New angles about how the choice sits in the flow:

| Code | Consideration |
| --- | --- |
| CO1 | **Choose a promise, not a power.** The start asks "Do you want something unusual to find you?" (none / a known gift / a surprise). The actual card is named when it wakes. Matches ST11/ST12 and keeps the opening vanilla |
| CO2 | **Late choice.** Allow skipping the cheat at creation and picking it at the first waking moment (first won fight or day 3), when the player knows what fighting and days feel like |
| CO3 | **Foreshadowing.** A dormant seed leaves small signs before waking (a strange dream line, a number flickering in the log) so the player knows it exists without a visible panel |
| CO4 | **Real "Surprise me".** Until a second card exists, hide the option or say "one possible gift so far" rather than offering a fake choice |
| CO5 | **Cost visible at choice.** If the start is costed (ST14), the cost line shows in the creation preview, not after |
| CO6 | **Advantage slots, not only cheats.** One Advantages step holds cheat, origin (reedling), background boon (CR10), wealth or connections; a budget (ST15) or "pick one" depending on the world |
| CO7 | **Pick by feel.** Offer advantages by the experience they create ("know more than others", "survive what should kill you", "grow faster", "never alone") before naming families |
| CO8 | **Try before choosing.** A short sandbox preview of a card in a creative start (US6) or a replay of its first message; never touching the real save |
| CO9 | **Swap window.** The first in-game day allows changing the start choice at a small cost, for regret without restarting |
| CO10 | **Cheat strength sits with difficulty.** The humble/standard/strong dial lives beside other player-layer settings (B4) rather than inside the fiction |
| CO11 | **No-cheat is a real path.** "Ordinary life" is labeled as a choice with its own record entry, not as the blank default |
| CO12 | **Later lives remember.** A second life's start lists what the previous life met or researched (UP, LB10), so starts grow from play |

## OP: options and settings around the start

| Code | Consideration |
| --- | --- |
| OP1 | **Start presets.** One choice bundles pacing toggles: Vanilla (all off, current default), Lived-in (hunger as boosts, weather, durability), Harsh. Each toggle still editable |
| OP2 | **Show pacing where it is felt.** The Village "Optional pacing" status panel links straight to its toggles, or appears only when one is on |
| OP3 | **Layout default.** Classic for the first session, per the density audit; Workspace offered once panels outnumber the screen |
| OP4 | **Spoiler level.** A player-layer dial (B4) for how much the library, status window and help reveal; default "learn as you go" |
| OP5 | **Text speed and log volume.** Story lines can be instant, typed or batched; the log can start filtered to story plus rewards |
| OP6 | **Skip the opening.** For later lives or tests: start after the elder chain with its rewards granted, labeled in the life record |
| OP7 | **Offline and idle setup.** A first-session line explaining what continues while away, once the first idle action exists |
| OP8 | **Accessibility at the door.** Font size, contrast and reduced motion reachable from the title screen, since PLAY is unreachable at 150% zoom today (F5) |

## XS: other things to consider

| Code | Consideration |
| --- | --- |
| XS1 | **First-session goal.** A visible small aim for the first sitting ("Find out who you were") drawn from the vanilla quest, so the opening has a direction beyond the panels |
| XS2 | **Returning-player welcome.** On Continue after a gap, a short "while you were away" summary and the current leads (TE5) |
| XS3 | **First death as a door.** The first death (or retirement) opens the player layer: lives, library, new starts (US1). Until then, no between-lives UI |
| XS4 | **Intro varies by entry.** Amnesia wake-up (Village), birth, summoning, reincarnation, arrival; each world declares its own cold open (start axes P1) |
| XS5 | **Second-life opening is shorter.** Familiar beats compress; new beats are what the new start adds |
| XS6 | **Life record from the start.** The creation choices, the seed and the first message become the first entries of the life record |
| XS7 | **Name of the game moment.** The first time the title or a world name appears in fiction is a small reveal; could be the system's first line or the elder naming the land |
| XS8 | **Measure the opening.** A dev-only trace of time-to-first-action and time-to-first-unlock on a fresh origin, to check the opening stays snappy as panels grow |
| XS9 | **Sealed-secret safety.** Intro text, previews and hints never state a sealed truth; they refer by route and status |

## A default flow to try first (proposal)

1. Title: Continue / New life / Options (with accessibility).
2. Creation: name, appearance under "More", one **Advantages** row with
   "None / Something may find you" plus a reedling origin line; honest labels
   (CR1, CO1, CR6).
3. Cold open: the selected start's scene ending on one visible action
   (the vanilla wake-up ends on "Talk to the elder" when Village is the start).
4. Expansion panels hidden until their moment, each with one reveal line
   (TE1, TE2).
5. Seed shows small signs (CO3), then wakes on first won fight or day 3,
   offering the late choice if none was picked (CO2).
6. First death opens the player layer (XS3).

## Suggestions (separate from the palette)

1. CR1 honest labels and CR6 visible reedling: cheapest, removes the most
   confusing part of the current panel.
2. TE1 + TE2 for the panels already in Village: cuts the opening clutter
   without removing anything.
3. OP3 Classic default for a fresh save, already backed by the density audit.
4. CO1 + CO3 when the second card or the status window stage 1 lands.

## Round 2: random start, random world start, UI (2026-10-13)

Weibao: "more to consider for the intro flow? Random start? random world
start? more to consider? UI considerations and more? more to consider?"

Existing owners this round builds on (codes not repeated): random roll basics
RS1-RS10 in [CHEAT_LIBRARY](CHEAT_LIBRARY.md#more-to-consider-the-status-window-unlock-progress-and-random-starts-2026-10-13);
start axes and selection policies P1/P3 in the
[starts palette](STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md); qualified
snapshots, persistence and no catalog reveal in the
[start standard](WORLD_COMPLETION_STANDARD.md#random-starting-points-without-spoiling-discovery);
world frame L3 in the
[thematic UI doc](THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#vivid-frame-proto23-flow-worlds-and-occasions-proposal-2026-10-13).

### RW: random world start, the experience of landing somewhere unknown

| Code | Consideration |
| --- | --- |
| RW1 | **Not knowing is the content.** The first scene shows surroundings and usable actions only; the world's name, rules and genre are learned through play (a sign, an accent, a coin, a status window that everyone seems to have) |
| RW2 | **Orientation as a loop.** An early "Where am I?" lead fills in as you observe: climate, language, currency, who holds power, what's dangerous. Each fact is shown / stated / inferred |
| RW3 | **Name reveal moment.** The world's name (or the local name for it) appears in fiction the first time the character could learn it; the L3 frame can shift in at that moment rather than at load |
| RW4 | **Neutral frame until known.** Before the reveal, the UI uses the plain L1 scheme, so the theme does not fingerprint the world |
| RW5 | **Start tension dial.** Calm (a room, a morning), active (on the road, at work), suspenseful (mid-chase, waking in a cell). Accepted direction leans suspenseful; calm and active stay reachable |
| RW6 | **Breathing room.** A suspenseful start opens paused or with a short grace window (the idle clock waits for the first input), so a mid-scene start is tense but not lost to a closed tab |
| RW7 | **Local first contact.** Someone or something nearby gives the first actionable hook (a jailer, a coworker, a talking sword, a system prompt), per world |
| RW8 | **Body and language fit.** If the character is native, they speak and read; if they arrived, they may not. Language as a skill where the world supports it |
| RW9 | **Return to the familiar.** A random world start can still lead to Village or other known places later through supported routes, never as a forced detour |
| RW10 | **Same world, different door.** Repeat landings in one world use different places, eras or roles, so a known world still surprises |
| RW11 | **Heirs and later lives.** A random start can land near a previous life's traces (a grave, a legend, an heir) when the world and continuity allow |
| RW12 | **Content preference without catalog.** Before rolling, the player can state feel preferences (gentle / grim, magic / mundane, solitary / social, short / long) that filter starts without listing worlds |

### RX: rolling a start, the mechanics and the moment

| Code | Consideration |
| --- | --- |
| RX1 | **Lock and roll per axis.** Each axis (world, era, place, role, body, family, advantage) can be locked to a known choice, left to chance, or left unknown; partial rolls are normal |
| RX2 | **Correlated rolls.** Roll a coherent snapshot, not independent fields: a noble birth brings education, duties and enemies together (P3) |
| RX3 | **Draft option.** Roll a few starts and pick one, each shown only as what the character would know (a sealed-envelope summary: "cold, poor, a debt to a temple") |
| RX4 | **Blind roll.** Commit without seeing anything; the first scene is the reveal. Recorded as a feat-worthy way to start |
| RX5 | **Reveal pacing.** Instant, a short text reveal axis by axis, or a slow "memories return" line per axis during the first minutes |
| RX6 | **Rerolls as a dial.** Free, limited, costed or off; a solo-player game can allow free rerolls, labeled in the life record. Saves never reroll on reload (start standard) |
| RX7 | **Seed visible.** Shown after commit, copyable, reusable; content changes can make a seed differ, and the game says so |
| RX8 | **Anti-repeat history.** Optional weighting away from recent worlds or roles; off by default |
| RX9 | **Bad rolls stay playable.** A harsh start still has a supported first action and a way forward, even if slow; harshness is labeled only in what the character can sense |
| RX10 | **Roll history.** The life record keeps what was rolled, locked and rerolled, for the player's curiosity and for later lives' unlocks |
| RX11 | **Random within a chosen world.** "I pick the world, roll the rest" is a first-class path, as is "I pick the role, roll the world" |
| RX12 | **Random for testing.** A dev roll that targets a specific snapshot or seed for fixtures, kept separate from the player's rolls |

### RP: what a random start can contain, beyond the cheat

| Code | Consideration |
| --- | --- |
| RP1 | **Age and stage roll.** Child, adult, elder; a child start may skip forward with summarized years (no clicking through infancy) |
| RP2 | **Time-of-day, season and weather at start** as cheap variety that changes early actions |
| RP3 | **Starting relationships.** A rolled friend, rival, debt or duty gives the opening a person to care about |
| RP4 | **Starting goal hint.** The snapshot carries an obligation or want ("rent due in 5 days", "find your sister") that becomes the first lead |
| RP5 | **Inventory as story.** Rolled possessions imply history (a letter, a broken badge) and can be examined |
| RP6 | **Companion starts.** Start with someone or something along (pet, familiar, sibling) where the world fits |
| RP7 | **Mid-history entry honesty.** A start set after past events shows what the character remembers of them, never fabricated player deeds (start standard) |
| RP8 | **Rare starts.** Very unusual snapshots (ruler, monster, ghost) exist with low weight or behind unlocks, per world |

### UI: the intro on a laptop screen

Target viewport: desktop and laptop (1366x768 to 1920x1080), per the standing
UI priority. Mobile deferred.

| Code | Consideration |
| --- | --- |
| UI1 | **Title screen uses the width.** Left: Continue with a summary of the current life (world if known, day, last event). Right: New life, Options, accessibility. No dead center column with empty sides |
| UI2 | **Creation in three columns.** Form, a live "who you are" card, and the advantages and start column, all visible without scrolling at 1366x768 |
| UI3 | **Roll panel.** Each axis is a row with lock / roll / unknown toggles and a one-line result; a single "Roll" and a "Begin" button stay in view |
| UI4 | **Start card.** After commit, a compact card summarizes what the character knows of their start (and the seed); later reachable from the life record; screenshot-friendly |
| UI5 | **First game screen is calm, not empty.** Log, actions and a small "situation" panel (where you are, what you can see, current lead) are visible; expansion panels appear as they unlock (TE1) and fill the width as they come |
| UI6 | **Reveal animation is text, short and skippable.** New panels slide or fade in with the one reveal line (TE2); reduced-motion setting turns it into a plain appearance |
| UI7 | **Keyboard path.** Enter confirms, number keys pick options, Tab order reaches the first game action early (today it is stop 68, F5) |
| UI8 | **Zoom and text size.** Title, creation and first screen tested at 125% and 150% laptop zoom; nothing essential pushed off screen |
| UI9 | **One component kit.** Creation cards, advantage cards, roll rows and the start card reuse the panel kit, so the intro looks like the rest of the game |
| UI10 | **Honest unknowns.** Unknown values show as "?" or "not yet known", never as a fake default; sealed facts show by ID and status only |
| UI11 | **No modal stacking.** Creation is a page, not a pile of popups; Esc goes back one step, never loses choices |
| UI12 | **Theme timing.** Dark/light respected from the title; the world frame (L3) only after the in-fiction reveal (RW3, RW4) |
| UI13 | **Progress visibility.** A thin step indicator through the intro (Title, You, Start, Begin) that disappears once play starts |
| UI14 | **Back to creation.** Until the first real action, a "change my start" link returns to creation without a new save (CO9 extends it with cost after) |

### MI: more angles

| Code | Consideration |
| --- | --- |
| MI1 | **Intro as a sampler.** The first ten minutes show one of each core verb the start supports (look, act, talk, rest), whatever the world |
| MI2 | **First idle moment.** The first queued or idle action arrives early and is explained in one line, since it is an idle RPG |
| MI3 | **Cliffhanger on close.** If the player leaves during the opening, the next Continue resumes with a one-line recap of where they were |
| MI4 | **Life count framing.** First life opens with no meta language; later lives can open with "Life 3" style framing if the player layer is on (IF2) |
| MI5 | **Narrator voice.** The intro voice matches the start: dry log lines, a storyteller, the system's voice, a diary; per world and per life |
| MI6 | **Language and tone presets.** Plain vs flavorful text for the intro, a setting rather than a rewrite |
| MI7 | **Intro telemetry for dev only.** Time to first action, first unlock and first choice per start type, to find slow openings (XS8 extended to random starts) |

### Round 2 suggestions (separate from the palette)

1. RX1 lock-and-roll plus UI3 roll panel: one surface serves chosen, random
   and mixed starts, so "random start" and "pick a start" are one feature.
2. RW4 neutral frame plus RW3 name reveal: cheap, protects discovery, and
   makes the reveal feel like an event.
3. UI2 three-column creation at 1366x768: fixes F2/F5 and follows the
   laptop-first rule in one pass.
4. RW6 paused suspense start: needed before any mid-scene random start ships.

## Round 3: connecting the intro to each world's starts (2026-10-13)

Weibao: "how to connect for relevant world starts and more? more to consider?"

The intro flow (IF, RX, UI) is one shared surface. Each world supplies its
own starts. The join is a **start record** that every world publishes and the
intro reads, so a new world plugs in without changing the intro.

Where this already exists: content packs at schema 2 carry `starts[]`
(location, body, effects), `admission` (allowed forms and life stages),
`capabilities` and `compatibility` (`src/foundation_start_content.js:41-62`).
A Soldier's Life already offers selectable premises (canon, divergent) in its
private pack. The per-world creation screen each world "should get" is in
[the book world entry matrix](worlds/BOOK_WORLD_ENTRY_MATRIX.md); S02 starts
in the [completion standard](WORLD_COMPLETION_STANDARD.md) is the per-world
owner. This round proposes how those connect.

### WC: what a world's start record carries

| Code | Field | Purpose |
| --- | --- | --- |
| WC1 | **Snapshot** | Place, era, body, role, family, possessions, relationships, obligations, known facts: the existing `starts[]` entry, extended along P1 axes |
| WC2 | **Admission** | Which bodies, life stages, origins and advantages fit (existing `admission`), plus which axes the player may lock (RX1) |
| WC3 | **Entry kind** | Born, woke, arrived, summoned, reincarnated, possessed, contracted, conscripted, returned. Drives the cold open and what the character knows |
| WC4 | **Timeline anchor** | Before, during or after a source arc, or "source-free". Book worlds use it to sit beside canon events without rewriting them unless the premise says so |
| WC5 | **Premise** | Canon, divergent, AU, randomized truth. Already modeled in A Soldier's Life; sealed truths referenced by ID only |
| WC6 | **Feel tags** | Gentle/grim, magic/mundane, solitary/social, calm/active/suspenseful (RW5, RW12). Filters use tags, never world names |
| WC7 | **Creation form** | Which local creation screen runs (muster roll, academy admission, contract, sorting, root test). Same underlying fields, local wording (CR9) |
| WC8 | **Advantage standing** | What counts as a cheat here (WR1-WR7), so the Advantages step only offers real cheats for this world |
| WC9 | **First action and lead** | The one visible action and first lead (IF6, RP4). A start without one doesn't qualify |
| WC10 | **Weight and rarity** | Base weight for random selection, rare starts flagged (RP8), per-world dials |
| WC11 | **Unlock condition** | Always, after meeting the world, after a previous life touched it, after research (US1-US5) |
| WC12 | **Frame and reveal** | L3 frame tokens plus when the name reveal happens (RW3, RW4) |

### WL: linking starts to each other

| Code | Consideration |
| --- | --- |
| WL1 | **Same moment, different seats.** Several starts in one world share one timeline anchor: the soldier, the village healer, the deserter, the officer's clerk. Later lives can meet earlier ones' traces |
| WL2 | **Start chains.** A start can name follow-on starts (an heir, an apprentice, a survivor) that unlock when a life ends there (succession owners) |
| WL3 | **Cross-world doors as starts.** Arrival in a world mid-life (via hub contract, portal, death) uses the same start record with entry kind "arrived", so the cold open works mid-life too |
| WL4 | **Hub starts.** A hub world (Paradise) can be the start, with missions as nested starts that each carry their own record |
| WL5 | **Shared people.** A start can reference NPCs who also appear in other starts in that world, so relationships carry meaning across lives |
| WL6 | **Divergence carries.** If a previous life changed the world, later starts there read the changed state, unless the player chooses a fresh timeline (TIMELINES doc) |
| WL7 | **Vanilla as a start record.** The existing Village opening is wrapped as one record (entry kind "woke", amnesia, elder as first lead), so it joins the pool without being rewritten |

### WF: what "relevant" means per world type

| Code | World type | Relevant starts look like |
| --- | --- | --- |
| WF1 | Book world (canon timeline) | Beside the protagonist's path, not in it: a classmate, a neighbor, a rival's sibling; timeline anchor before a known arc so the player can act on it |
| WF2 | Book world (fan premise) | The popular fan setups (SI, reincarnated into the cast's era, OC at the academy), only where the source deep dive marks them supported |
| WF3 | Game world (Elden Ring, Skyrim, Fallout) | The source's own opening shape (Tarnished, prisoner, vault dweller) as one start, plus ordinary-local starts beside it |
| WF4 | System world | Everyone's window is world law; the start's advantage is what goes beyond it (WR3) |
| WF5 | Original world | Starts authored from its own needs; no assumption of a source protagonist |
| WF6 | Hub or contract world | The contract is the cold open; mission starts nested |
| WF7 | Harsh world | Starts still pass WC9 (a first action and a way forward); harshness shows through what the character can sense |
| WF8 | Proving ground / test world | Labeled, creative-start only (US6), never in the player's random pool unless asked |

### WQ: qualification, selection and fallback

| Code | Consideration |
| --- | --- |
| WQ1 | **Qualify before pooling.** A start enters the random pool only when its world's content loads, its first action works, and its save round-trips (start standard). Drafted worlds stay out |
| WQ2 | **Two-step pick by default.** Pick a world with equal chance (or by feel tags), then a start within it, so a world with many starts doesn't crowd out the others (P3) |
| WQ3 | **Fallback.** If a chosen or rolled start's pack is missing, the intro offers another start with the same tags instead of failing, and says only "that start is unavailable" |
| WQ4 | **Private packs.** Starts from gitignored private packs exist only in local builds; the pool reads what's installed, never a hard-coded list |
| WQ5 | **Persist the commit.** World, start id, pack revision and seed save at commit; reload never rerolls (start standard) |
| WQ6 | **Pool visibility.** The player sees counts or nothing, never the list of unmet worlds, unless a creative start is on |
| WQ7 | **Missing a world's creation form.** Use the shared creation screen with the world's wording until its own form is built |

### WM: more to consider

| Code | Consideration |
| --- | --- |
| WM1 | **Per-world first-ten-minutes check.** Each world's S02 entry gets the same test: something to look at, one action, a reason to care, feedback, a first choice (IF beats) |
| WM2 | **World-specific tutorial voice.** Each start record names its teacher for TE9 (a sergeant, a professor, a system, an overseer) |
| WM3 | **Starting skills fit the snapshot.** A soldier starts with drill, a scholar with reading; through ordinary skill data, not special flags |
| WM4 | **Starting knowledge fits the entry kind.** Natives know local basics; arrivals don't; reincarnators may know the plot as a chosen knowledge mode (K5 in the identity doc) |
| WM5 | **One template for authors.** Add the start record fields to `docs/worlds/templates/` so world GMs fill them with S02 |
| WM6 | **Linked starts in reports.** Each world's ledger lists its starts, their tags and which qualify, by ID, without sealed truths |
| WM7 | **Start previews stay in-fiction.** Draft summaries (RX3) come from the snapshot's character knowledge only, so a book world's twist can't leak through a preview |

### Round 3 suggestions (separate from the palette)

1. WL7: wrap the vanilla Village opening as the first start record. It proves
   the contract on content that already works.
2. WC1-WC9 as the minimal record, built by extending the existing `starts[]`
   shape instead of a new format.
3. WQ1 + WQ2 + WQ5 before any random pool goes live, so a second world joins
   cleanly.
4. WM5: add the record to the world template so new worlds ship with starts.

## Round 4: more on start records and linked starts (2026-10-13)

Weibao: "more to consider for start records and linked starts? Save
accordingly". Builds on WC, WL, WQ above; timeline identities and parallel
clocks stay owned by [TIMELINES_AND_DIVERGENCE](TIMELINES_AND_DIVERGENCE.md#implementation-planning-starts-histories-and-parallel-worlds-2026-10-11),
heirs by [SUCCESSION_BY_WORLD](worlds/SUCCESSION_BY_WORLD.md).

### ISR: how a start record is built and kept

| Code | Consideration |
| --- | --- |
| ISR1 | **Layered records.** A start composes from overlays: world base, era, place, role, body, family, advantage. Authors write layers; the pool combines compatible ones, so ten roles × four eras doesn't mean forty handwritten records |
| ISR2 | **Compatibility rules between layers.** A layer declares what it needs and what it excludes (a noble role needs a city; an infant body excludes "conscripted") |
| ISR3 | **Record versions.** Each record has a revision; a saved life keeps the revision it started from, and a pack update shows "this start has changed" for new lives only |
| ISR4 | **Live eligibility.** A record can depend on current world state (only after the war began; only while the academy stands), read when the pool is built, not baked in |
| ISR5 | **Snapshot vs recipe.** Some starts are fixed snapshots (a book scene); others are recipes rolled at commit (a random farmhand). Both save the resolved result |
| ISR6 | **Validation test per record.** Loads, first action runs, lead exists, save/reload round-trips, no sealed text in previews. Same check runs for generated combos (WQ1 extended) |
| ISR7 | **Retired records.** A start removed from a pack stays playable for saves that used it (dormant, per compatibility rules) and leaves the pool |
| ISR8 | **Author notes.** Each record carries a short why (what life it offers, what it teaches) for world GMs, never shown to the player |
| ISR9 | **Difficulty spread, private.** Records carry an internal difficulty band for balancing the pool and testing; shown to the player only through what the character senses (RX9) |
| ISR10 | **Start record as data, not code.** Kept in the pack JSON beside `starts[]`, so adding starts needs no source change |

### SG: where starts come from besides authoring

| Code | Consideration |
| --- | --- |
| SG1 | **From NPCs you met.** Play as someone a previous life knew (the elder's apprentice, a rival's daughter), when the world and their state allow; they bring their real simulated history |
| SG2 | **From events.** A world event makes new starts (refugees after a siege, recruits after a call to arms) that exist only while its aftermath lasts |
| SG3 | **From the player's deeds.** A guild you founded or a village you saved becomes a start ("born in the village you saved") |
| SG4 | **From endings.** An epilogue state becomes a start: the next generation, the ruin, the peace |
| SG5 | **Player-authored starts.** A creative-mode editor builds a custom record from layers; labeled, can join the player's own pool if they want |
| SG6 | **Bookmarked moments.** Mark a point in a life as "a start someone could have here"; later lives can begin from that world state in a different body, not as a save reload |
| SG7 | **From library knowledge.** Researched or rumored places and roles become starts once known (US2/US3) |
| SG8 | **Canon character starts.** Playing as a source character directly is reachable under a chosen premise or direct-adaptation request, with its own label; default starts sit beside canon (WF1) |
| SG9 | **Procedural people.** The simulation's ordinary residents are candidate starts, filtered by WC9 (has a first action and a lead) |

### LK: kinds of link between starts

| Code | Link | Example |
| --- | --- | --- |
| LK1 | **Succession** | Heir, apprentice, adopted child, successor in office |
| LK2 | **Contemporary** | Same moment, different seat (WL1); can meet each other's traces or the NPC version of each other |
| LK3 | **Rival or mirror** | A start built as the other side of a past life: the deserter's hunter, the student who lost the seat |
| LK4 | **Pair or group** | Twins, a squad, a brood, a party; one life controls one member, the others are NPCs or later lives |
| LK5 | **Echo** | The same soul or role in another world or era (SELVES_AND_ECHOES) |
| LK6 | **Causal** | A start that exists because a past life did something (SG3) |
| LK7 | **Place** | Starts tied to one location across eras: the same inn in three centuries |
| LK8 | **Object** | Starts that follow an item: whoever finds the sword the last life lost |
| LK9 | **Loop** | A loop world's restart links a start to itself with kept knowledge (Mother of Learning style), per world |
| LK10 | **Door** | Cross-world arrival (WL3); the departure life and the arrival start share one record of the crossing |

### LG: rules on links

| Code | Consideration |
| --- | --- |
| LG1 | **What passes along a link.** Each link type declares what carries: items (only what was actually left), knowledge (only what was recorded or taught), reputation, debts, enemies, skills (rarely, and with a cause) |
| LG2 | **Link conditions and costs.** A link can need something (a will, a teaching, a found grave) and can cost something (a debt, a grudge, a weaker start) |
| LG3 | **Link strength and decay.** Close links (child) carry more; distant ones (descendant in 300 years) carry legends and maybe an heirloom. Decay is a per-world dial |
| LG4 | **Consistency.** A start can't contradict a recorded past: someone a past life killed isn't a start in that timeline unless the world allows return, or the player picks a fresh timeline |
| LG5 | **Paradox handling.** Loops, regression and time travel worlds declare their own rules (fixed, branching, self-healing) and links follow them (T5) |
| LG6 | **Links outlive packs.** If a linked world's pack is missing, the link stays recorded and dormant, returning when the pack does |
| LG7 | **Opt-out.** The player can start unlinked (fresh timeline, stranger) at any time; links are offered, not forced |
| LG8 | **Links across worlds respect standing.** A cheat passed along a link is re-judged in the new world (WR4) |
| LG9 | **Shared-state lives.** Two linked lives in one world see one world state; a parallel or branched timeline gets its own (T4) |

### LV: showing starts and links to the player

| Code | Consideration |
| --- | --- |
| LV1 | **Start map.** A graph or family-tree view of lives and the starts they opened, by world and era; only known nodes shown, unknown ones absent or a count |
| LV2 | **"Why is this here?"** Each offered start says in one line what opened it ("Your apprentice survived the winter") |
| LV3 | **Link preview on offer.** What would carry over, as the character would know it (LG1) |
| LV4 | **New starts notice.** At death or ending, a short list of starts that just opened, with the best-linked first |
| LV5 | **Pinned starts.** Mark a start to try later; pins survive across lives |
| LV6 | **Start collection.** A quiet record of starts played, by world, for curiosity; no completion pressure unless the player turns that on |
| LV7 | **Sealed safety.** Links that would reveal a sealed truth show by ID and status ("S2-linked start: locked") |

### SX: more angles

| Code | Consideration |
| --- | --- |
| SX1 | **Start mastery.** Replaying a start can skip known beats (XS5, OP6) and can offer start-specific challenges |
| SX2 | **Start-level settings.** A record can suggest pacing presets (OP1) that fit it (hunger on for a survival start) without forcing them |
| SX3 | **Start metrics for dev.** Time to first action, first unlock and first death per record (MI7), to find bad starts |
| SX4 | **Start seeds per record.** A seed reproduces the resolved recipe for that record and revision (RX7) |
| SX5 | **Ensemble view.** In LK4 group starts, switching between members is a per-world dial: never, at death, or freely (identity doc) |
| SX6 | **World GM ownership.** Each world's GM owns its records and links into it; links out to other worlds are proposed by the source world and accepted by the target |

### Round 4 suggestions (separate from the palette)

1. ISR1 + ISR2 layered records: the only way starts scale to many worlds
   without hand-writing every combination.
2. LK1 + LG1 succession with "only what was left or taught": smallest real
   linked start, and it fits the existing heir direction.
3. LV2 one-line "why is this here": makes links feel earned at almost no cost.
4. ISR6 per-record validation in the world template (WM5).

## Round 5: more on layered records and start sources (2026-10-13)

Weibao: "more to consider for layered records and start sources? Send codex
to try and work accordingly?" Builds on ISR and SG. A Codex lane tries the
first slice: [start-records-2026-10-13](gm/dispatch/start-records-2026-10-13/GOAL.md).

### LY: layer mechanics

| Code | Consideration |
| --- | --- |
| LY1 | **Axis order.** Layers resolve in a fixed order per world (world, era, place, family, role, body, background, advantage); later layers read earlier results, so a role can depend on the place |
| LY2 | **Patch, not replace.** A layer adds or adjusts (items, coins, skills, knowledge, relationships, location); conflicts resolve by a declared rule (sum, max, last wins, refuse) per field |
| LY3 | **Needs and excludes by tag.** Layers carry tags (urban, noble, infant, arrived); `needs`/`excludes` match tags, so new layers fit old ones without listing every id |
| LY4 | **Weights that react.** A layer's weight can read earlier picks (a coastal place raises fisher weight) and world state (war raises soldier weight) |
| LY5 | **Unknown axis.** An axis left unknown is still resolved and saved, but its result is hidden from the player until the character learns it (RX1, RW1) |
| LY6 | **Empty layer.** Every axis can resolve to "nothing special", so rolls aren't forced into drama |
| LY7 | **Layer narration.** Each layer contributes one or two opening-text fragments; the cold open stitches them, so composed starts read like one scene |
| LY8 | **Provenance.** The resolved start keeps the list of layers, their revisions and the seed, for the life record, debugging and LV2 "why is this here" |
| LY9 | **Dead-end guard.** After composing, the validator checks the result still has a first action and lead (WC9); if not, it rerolls the offending axis within the seed, not the whole start |
| LY10 | **Shared layers across worlds.** Generic layers (orphan, twin, apprentice, debtor) live in a common library and are re-skinned per world by local wording and tags |
| LY11 | **Overrides.** A hand-authored snapshot (a book scene) can pin some axes and still take generic layers on the rest |
| LY12 | **Exclusive and rare layers.** A layer can be unique per timeline (only one heir to the throne) or rare by weight; uniqueness is checked against the world's recorded state (LG4) |

### SS: more start sources

| Code | Consideration |
| --- | --- |
| SS1 | **Rumor starts.** Something heard in a past life ("they say the lighthouse keeper took an apprentice") becomes a start that may or may not match the rumor once played |
| SS2 | **Failed-life starts.** A life that ended badly opens a start for someone affected (the widow, the creditor, the rescuer who came too late) |
| SS3 | **NPC ambitions.** A simulated NPC who pursued something (opened a shop, joined a sect) leaves a start in that place |
| SS4 | **Calendar starts.** Festivals, wars, plagues and coronations open time-bound starts while they run |
| SS5 | **Item-found starts.** An item a past life lost opens a start for whoever finds it (LK8) |
| SS6 | **Cross-world refugee starts.** A world-ending or conquest event in one world opens arrival starts in neighbors |
| SS7 | **Cheat-holder starts.** Holders the player met (LB4) become possible starts, with the cheat re-judged on standing |
| SS8 | **Mirror starts.** For each start played, the opposite seat in the same event (LK3) becomes available |
| SS9 | **Daily or seeded challenge starts.** A shared seed start, optional, for fun (RS3) |
| SS10 | **Source-adjacent starts from deep dives.** Each source deep dive lists supported fan premises; each becomes a record candidate with its tags (WF2) |

### Round 5 suggestions (separate from the palette)

1. LY1 + LY2 + LY8: fixed axis order, patch rules and provenance are the core
   of a resolver; everything else adds to them.
2. LY9 dead-end guard: cheap and stops bad combos from reaching the player.
3. LY7 narration fragments: makes composed starts feel authored.

## Round 6: start audit, villain starts, other selves, more links (2026-10-14)

Weibao: "more to consider for linked starts and start sources? More to
consider? audit different starts and more? like the starting as a villian or
something and more? more to conisder? what happens to other selves? do they
just not exist? more to cnosider?"

Existing owners, not repeated here: existing bodies, failed rituals and
villain starts B1-B5 and V1-V9 in
[self-as-player considerations](worlds/SELF_AS_PLAYER_LORE_CONSIDERATIONS_2026-10-13.md#existing-bodies-failed-rituals-and-villain-starts);
villain-MC route families in
[RIVALS_IDENTITIES_AND_FATE](RIVALS_IDENTITIES_AND_FATE.md#villain-mc-routes-and-what-can-actually-be-stolen);
enemy protagonists and concurrent characters in
[ENEMY_PROTAGONISTS](ENEMY_PROTAGONISTS.md); past, alternate and shadow
selves in [SELVES_AND_ECHOES](SELVES_AND_ECHOES.md); lore models O1-O8 in
the [identity doc](worlds/PLAYER_CHARACTER_IDENTITY_AND_CONTROL_2026-10-13.md#l1-several-coherent-lore-models).

### SA: audit of start kinds

Coverage: **owned** = a doc already covers it in depth; **partial** =
mentioned, not worked out as a start; **new** = not yet considered as a
start. Each still needs a per-world record (WC) before it is playable.

| Code | Start kind | What it offers | Coverage |
| --- | --- | --- | --- |
| SA1 | Ordinary local (farmhand, clerk, student) | Life-sim baseline; most worlds' default | Owned (P1, CR10) |
| SA2 | Amnesiac arrival (vanilla) | Discovery of self and world together | Owned (vanilla, WL7) |
| SA3 | Privileged (noble, heir, rich family) | Resources and duties, politics from day one | Partial (P1 social position) |
| SA4 | Outcast or criminal (thief, debtor, fugitive, prisoner) | Pressure, hidden routes, redemption optional | Partial (P1, RW5 cell start) |
| SA5 | Infamous body or reputation (villain by name) | Fear, enemies, old schemes in motion | Owned (B3, V1, V9) |
| SA6 | Future antagonist, early in life | Changing a known fate | Owned (V7) |
| SA7 | Active villain role (dark lord, mastermind, cult leader) | Minions, lair, schemes, heroes rising | Partial (route families); see VS below |
| SA8 | Villain's side character (henchman, minion, the lieutenant, villain's child) | Small person inside a big evil machine | New |
| SA9 | Doomed character (the one who dies in chapter 1, the villainess with a bad ending) | Survival against a known script | Partial (K4 foreknowledge); see VS9 |
| SA10 | Hero-adjacent (protagonist's sibling, rival, classmate, mentor) | Life beside canon (WF1) | Owned (WF1, fan premises) |
| SA11 | Background extra (shopkeeper, guard, mob character) | Pure life-sim inside a dramatic world | Partial (SS3, SG9) |
| SA12 | Mentor or retired hero | Strong but declining; teaching as play | New |
| SA13 | Ruler or leader | Management and delegation play | Partial (V1, ISR rare starts) |
| SA14 | Nonhuman body (monster, beast, reedling, spirit) | Different verbs | Owned (origins doc, reedling) |
| SA15 | Object or place (sentient sword, dungeon core, haunted house, ship) | Act through holders or visitors | Partial (O6, GENETICS brood perspectives) |
| SA16 | Collective (hive, brood, sect, family as one player) | Many bodies, one will | Owned (GENETICS brood play, LK4) |
| SA17 | System, AI or patron guiding a host | Play the cheat itself | Partial (O3, O7) |
| SA18 | Dead or ghost | Limited reach, unfinished business | Partial (SELVES ghosts) |
| SA19 | Child or infant | Growth, skipped years | Owned (origins doc, RP1) |
| SA20 | Elder near the end | Legacy and succession first | Partial (succession docs) |
| SA21 | Hero at the end of the story (after the final battle) | What happens after the ending | Partial (SG4 endings) |
| SA22 | Hunted (marked by a cult, a bounty, a destiny thief) | Pursuit from minute one | Partial (ENCOUNTERS_AND_PURSUIT) |
| SA23 | Replacement or impostor (took someone's place) | Keeping a cover | Owned (RIVALS identity theft) |
| SA24 | Returner (back after years away, regressor) | Old ties, changed world | Partial (P1 entry, regression cheats) |

Gaps worth filling first: SA7/SA8 villain roles, SA9 doomed starts, SA12
mentor, SA15 object/place, SA21 after the ending.

### VS: villain starts, new angles

B3 already sets the baseline: a villain start is a situation, not
compulsory evil choices. These add to it.

| Code | Consideration |
| --- | --- |
| VS1 | **Villain is several separate axes.** Reputation (what people believe), role (what job you hold in a villain structure), history (what this body or life did), intent (what you choose now). A start sets the first three; play sets the fourth |
| VS2 | **Villain role layers.** Dark lord, mastermind, cult leader, warlord, corrupt official, monster, rival young master, villainess, mad scientist; each a role layer (ISR1) with its own verbs |
| VS3 | **Infrastructure as a start kit.** Minions, a lair, a treasury, debts, ongoing schemes queued as idle jobs; inherited half-finished, so the first choice is what to keep running |
| VS4 | **Minions are people.** Henchmen have loyalty, fear, ambition and their own plans; a changed boss changes who stays (B3: others respond to evidence) |
| VS5 | **Heroes rise in response.** Per-world dial for how the world answers a visible villain: none, local resistance, a destined hero, a guild bounty. Rising heroes can become rivals or later starts (LK3) |
| VS6 | **Double life.** Public face and villain role at once (benefactor / secret schemer route); the start sets which one people currently see |
| VS7 | **Henchman start (SA8).** Small person, big machine: orders arrive, you can obey, sabotage, climb or desert; good life-sim fit |
| VS8 | **Villain's family.** Child, spouse or sibling of the villain: inherited fear and protection, and a choice about the family business |
| VS9 | **Doomed-route starts (SA9).** The character a story kills or ruins (villainess trope). Foreknowledge is a selected knowledge mode (K4/K5); the script is a likely history, not a forced one (V7) |
| VS10 | **Reform is one path among many.** Reform, keep the throne kindly, retire, flee, double down, hand over power; the world reacts to actual acts |
| VS11 | **Villain by mistake.** Framed, misunderstood, or "villain" only by one faction's view; clearing a name is a route, not a requirement |
| VS12 | **Villain in a system world.** A system can label you (title, karma, red name) and others can read the label; the label lags or misreads your actual acts (SW4) |
| VS13 | **Moral weight stays real.** Harm done in play has consequences for the people affected; the game doesn't force atrocities and doesn't erase them. Content preference filters (RW12) can keep grim starts out of a roll |
| VS14 | **Villain links.** A villain life opens starts for its victims, heroes, successors and minions (SS2, LK3); a hero life can open its defeated villain's heir |

### OS: what happens to other selves

Short answer: by default they keep existing. Under the recommended O1 + O8
model, each life is its own person. Starting a new life doesn't delete the
old one; what happens to them is a per-world, per-link dial.

**Past lives (your earlier characters)**

| Code | Possibility | When it fits |
| --- | --- | --- |
| OS1 | **Continue as NPCs.** The previous character keeps living in the shared world state, driven by the simulation with their last goals and habits | Default when the world persists and the life ended by retirement or switching, not death |
| OS2 | **Ended.** Dead lives stay dead unless the world allows return; their grave, belongings and records remain (LG1) | Death endings |
| OS3 | **Frozen.** The world they're in pauses when you leave it, and resumes if a later life returns (T4 selected clocks) | Parallel worlds with paused clocks |
| OS4 | **Summarized.** Off-screen years resolve as a short history (married, moved, became mayor) rather than a full simulation | Cost control; most worlds |
| OS5 | **Remembered.** Legends, rumors and records of them shape later starts (LV2, SS1) | Long gaps, distant links |
| OS6 | **Fresh timeline.** If the player picks a fresh timeline, earlier lives never happened there; they still exist in their own branch and in the player's records | LG7 opt-out |

**Other versions of you (same soul or role elsewhere)**

| Code | Possibility | When it fits |
| --- | --- | --- |
| OS7 | **Never existed.** Most worlds have no other "you"; nothing to resolve | Default, no echo premise |
| OS8 | **A native version exists.** You arrive in a world that already has a local you (doppelganger, alternate self): stranger, rival, ally or shared identity confusion (SELVES G4) | Echo and multiverse worlds |
| OS9 | **Displaced original.** In a body you took, the former occupant is gone, elsewhere, dormant, sharing or fused (B1); the start must say which | Possession, swap, ritual starts |
| OS10 | **Echoes.** Other selves appear as ghosts, projections or shadow versions with their own wants (SELVES G1-G9) | Worlds that generate selves |
| OS11 | **Merged.** Two versions can merge by a declared process, keeping both histories; never silently | Fusion premises (V8) |

**Linked seats in the same story**

| Code | Possibility | When it fits |
| --- | --- | --- |
| OS12 | **Unplayed seats are NPCs.** In contemporary or pair starts, the seats you didn't pick are ordinary people with their own lives | Default for LK2/LK4 |
| OS13 | **Played seats remember nothing of each other** unless linked by soul or record; meeting your old character as an NPC is a normal encounter | Default under O8 |
| OS14 | **Recognition is a reading.** If a world lets a later life recognize a former one (soul, face, habits), it follows SELVES recognition rules and can be partial or wrong | Echo worlds |
| OS15 | **Cost control.** Other selves run at the lightest fidelity that keeps them believable: active when near you, summarized when far (ENEMY_PROTAGONISTS independent arcs) | All worlds |

### LS: more on linked starts and start sources

| Code | Consideration |
| --- | --- |
| LS1 | **Meet your past life.** A later start can place you near a former character who is still alive (OS1); they react to you as a stranger unless a link says otherwise |
| LS2 | **Inherited relationships, both directions.** A successor inherits the predecessor's friends and enemies as expectations; each person decides whether the bond transfers |
| LS3 | **Mid-life seat switch.** In ensemble starts (SX5), switching seats mid-life leaves the old seat running as an NPC (OS12) |
| LS4 | **Start debts.** A linked start can carry an unpaid obligation from the past life (a promise, a loan, a vow), visible at offer (LV3) |
| LS5 | **Villain-to-hero chains.** The hero who defeated your villain life becomes a start; so does the villain's heir (VS14) |
| LS6 | **Victim and beneficiary starts.** Someone your past life hurt or helped becomes a start, carrying their actual memory of you |
| LS7 | **Witness starts.** A bystander to a past life's big moment: a guard at the coronation, a child at the battle |
| LS8 | **Start from a minion.** A villain life's henchmen become starts after the villain falls (VS7) |
| LS9 | **Link quality shows in the offer.** "Close link: much carries" vs "distant: a legend and a ring" (LG3) |
| LS10 | **Self-consistency guard.** A linked start can't put two played versions of you in control at once unless the world has concurrent-play rules (ENEMY_PROTAGONISTS concurrent characters) |

### Round 6 suggestions (separate from the palette)

1. OS1 + OS4 as the default for past lives: they keep living, summarized
   when far. It answers "do they just not exist" without full simulation.
2. VS1 split (reputation, role, history, intent) as the villain layer model,
   since it plugs straight into layered records.
3. VS7 henchman and SA12 mentor as the first new start kinds: small, very
   life-sim, and missing today.
4. LS1 meet-your-past-life as the first payoff of linked starts.

## Round 7: dispatched research for villain starts and other selves (2026-10-14)

Weibao: "more to consider for villain starts and other selves? Send out idea
stuff accordingly? we can find source material for starting as x y z
accordingly? like the latest downloaded trash of the counts family? More to
consider? Send out codex agents accordingly". Lanes in
[start-sources-2026-10-14](gm/dispatch/start-sources-2026-10-14/COMMON.md):
a full read of Lout of Count's Family vols 1-9 (three readers, private
notes), a start-as-X source catalog
([START_AS_X_SOURCE_CATALOG](research/START_AS_X_SOURCE_CATALOG_2026-10-14.md)),
and a source-grounded villain/other-selves doc
([VILLAIN_STARTS_AND_OTHER_SELVES](worlds/VILLAIN_STARTS_AND_OTHER_SELVES_2026-10-14.md)).
Links resolve when the lanes write their outputs.

A few angles to check against those returns (proposals):

| Code | Consideration |
| --- | --- |
| RV1 | **Reputation as cover.** A bad name lowers expectations; being underestimated is a resource until a visible act breaks it (the trash-noble premise) |
| RV2 | **Script knowledge decays.** Each change you make lowers how much of the original story still holds; the start record can carry a "script confidence" value per arc |
| RV3 | **Whose villain.** A start can be the villain of a story you know, of a story you don't, or of nobody's story (the label came from gossip) |
| RV4 | **Hero relationship at start.** The hero who would beat you can be met before the fated scene: avoid, befriend, employ, outrun |
| RO1 | **The former self's paper trail.** Letters, debts, diaries and grudges of the previous occupant surface over time as leads, even if the occupant is gone |
| RO2 | **Others notice the change at different speeds.** Servants first, family next, enemies last, each by their own evidence (B3, OS14) |
| RO3 | **Two continuities.** The player's prior life (if any) and the body's prior life are both "other selves" with separate records; the life record can show both |

## Round 8: should there be no other selves? (2026-10-14)

Weibao: "more to consider for other selves and villain starts? Should there
be no other selves? more to consider? Send out other codex accordingly? MOre
to consider?"

**View (proposal).** "No other selves" works well as the *default* and
should stay a reachable mode, but it can't be the only rule, since some
worlds' lore is built on other selves (loops, avatars, clones, echoes).
The useful split is two different questions:

1. **Other versions of the same person** (doppelganger, echo, clone, the
   self left behind by a regression). Default: none. A world or start opts
   in by its own lore.
2. **Your earlier characters.** These are not other selves under the
   O1 + O8 model; they're separate people you once played. "No other selves"
   doesn't delete them. Whether they continue is OS1-OS6.

So a "no other selves" world still has your old characters living their
lives; it just never makes a second *you*.

### NS: what a "no other selves" mode means in practice

| Code | Consideration |
| --- | --- |
| NS1 | **One self per person, per world.** A soul, mind or identity exists once. This can be a world law ("souls are unique here") or a player preference that filters starts |
| NS2 | **Regression overwrites.** Going back replaces the old timeline instead of leaving a copy behind; the abandoned future simply stops (or becomes a memory) |
| NS3 | **Copies are new people.** Clones, simulacra or backups start as someone else from the moment they're made; they share memories, not identity (V6 already says a backup body is not a second person) |
| NS4 | **Possession needs the seat empty.** In this mode, existing-body starts only use the "former occupant already gone" version (B5); swap, share and fusion starts are filtered out |
| NS5 | **Heirs are kin, not selves.** Succession passes things and reputation, never identity |
| NS6 | **Memories without identity.** Past-life memories can still surface (CT18 echo of a past life) as knowledge, not as another person inside you |
| NS7 | **Avatars are tools.** Remote bodies and projections are vessels with no mind of their own (O6) |
| NS8 | **Why pick it.** Simpler stories, cheaper simulation, clearer attachment to one character, no identity puzzles in a cozy life |
| NS9 | **What it costs.** Loses loop drama, rival-self stories, merges and shadow-self content; those worlds either switch to their own law or skip those premises |
| NS10 | **Breaking the law is a plot.** In a one-self world, if a second you appears anyway (a cheat, a god's error), the world reacts: one fades, the world hunts the anomaly, or reality strains; per world |

### Spectrum dial (per world, overridable by player preference)

| Setting | Meaning |
| --- | --- |
| None | No other selves exist or can be made (NS1-NS10) |
| Implied | Other selves exist only as lore, rumors or memories; never met |
| Present | Other selves exist as NPCs you can meet (OS8, OS10) |
| Playable | You can switch to, merge with or play other selves (LK4, OS11, SX5) |

Default proposal: **None** for ordinary worlds and the vanilla start;
**Present** or **Playable** where the source is built on it (loop, avatar,
clone and multiverse worlds). The player preference can push a roll toward
None without hiding that other worlds use more.

### OM: more on other selves

| Code | Consideration |
| --- | --- |
| OM1 | **Competing claims.** Two selves both claim the same family, house, title or bank account; institutions decide by their own evidence (same rule as B1 assets) |
| OM2 | **Consent and dignity.** Other selves have their own wants; merging or replacing one is something done to a person, with consequences in worlds that care |
| OM3 | **Divergence over time.** Two selves who start identical drift apart from different experiences; after enough drift, people treat them as different people (SELVES convergence and divergence) |
| OM4 | **Selves as a resource.** Loop and avatar worlds can use extra selves as labor, scouts or backups; cost and risk per world |
| OM5 | **Knowing about them.** The player may know an other self exists before the character does (K1 separation of player and character knowledge) |
| OM6 | **UI only when real.** A "selves" view appears only in lives where other selves exist and are known (TE1 discovery-gated) |
| OM7 | **Record keeping.** Each self gets its own life record; links between records show the split or merge point |
| OM8 | **Death of one self.** What the others feel or gain: nothing, a pang, memories, power, per world |

### VM: more on villain starts

| Code | Consideration |
| --- | --- |
| VM1 | **Villain schemes as idle play.** Schemes run as long jobs (recruit, smuggle, infiltrate, build) that progress while away, with risk of exposure rolled at checkpoints |
| VM2 | **Villain economy.** Tribute, extortion, black markets, stolen goods; each with its own heat and retaliation, so money comes with consequences |
| VM3 | **Heat.** A visible meter of how much attention you draw, per faction; lowered by cover, bribes, quiet periods |
| VM4 | **Villain endings.** Rule, fall, flee, reform, be replaced by a successor, be remembered as a legend; each opens linked starts (VS14) |
| VM5 | **Small villains.** Bullies, swindlers, corrupt guards, cruel landlords: life-sim scale villainy without world domination |
| VM6 | **Villain mentorship.** Teaching a student your ways can create an heir or a future enemy |
| VM7 | **Being the target of a hero's start.** Your villain life can be the opening of someone else's hero story (an NPC protagonist), with that hero growing on their own (ENEMY_PROTAGONISTS) |
| VM8 | **Turning point beats.** The start can offer an early clear moment to choose a direction (spare or punish, keep or free a prisoner), so intent (VS1) shows fast |

### Round 8 dispatch

Two more Codex lanes in
[start-sources-2026-10-14](gm/dispatch/start-sources-2026-10-14/COMMON.md):
identity and uniqueness laws per source world (from local dossiers and wiki
digests), and a games reference for how games handle previous characters,
other selves and villain play.

### Round 8 suggestions (separate from the palette)

1. Adopt the two-question split (other versions vs earlier characters) in
   the identity doc, so "no other selves" never reads as deleting past lives.
2. Spectrum dial with None as the ordinary-world default.
3. VM1 schemes-as-idle-jobs: the most idle-native villain mechanic.

## Round 8: nonhuman starts, engine requirements (2026-10-14)

Weibao: "required stuff for non human starts and more? lIke engine stuff and
more?" Source-read audit and proposals in
[nonhuman starts: engine requirements](worlds/NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md):
existing body seams F1-F9, blockers B1-B11, required engine pieces E1-E15,
per start kind needs K, and non-engine considerations M1-M11.

## Round 9: past selves as NPCs, interaction levels, story worlds (2026-10-14)

Weibao: "more to consider for identity laws and other selves? Other stuff to
consider? Little to no interaction with the past selfs or bodies? or make
them not exist? other stuff and more? what makes sense for story worlds and
more? I guess they would just be npc and more? more to consioder, write down
stuff and more?"

**Direction recorded (Weibao's lean, 2026-10-14):** past selves and former
bodies "would just be npc", with little to no special interaction; making
them not exist stays reachable. Recorded as his stated lean in USER_VISION;
the dials below keep the other levels reachable per world.

### PN: what "just an NPC" means

| Code | Consideration |
| --- | --- |
| PN1 | **Ordinary NPC record.** A past self becomes a normal person in the world's people list, with their own goals, home, job and relationships; no special flag in play |
| PN2 | **No special UI.** No "your past self" marker in the world. The player's own life record still lists past lives (player-layer, O8), so nothing is lost to the player |
| PN3 | **They don't know they were played.** Their memories are their own life; nothing about a player or later lives |
| PN4 | **Their things are theirs.** Items, money and land stay with them or their heirs; a later life has no claim unless a link grants one (LG1) |
| PN5 | **Recognition only by ordinary evidence.** If you meet them, they treat you as a stranger; if you look alike or share a family, people react to that, nothing more |
| PN6 | **Light simulation.** Summarized when far (OS4), active only when near; they can marry, move, age, die off-screen |
| PN7 | **Rumors and legends still happen.** Big deeds of a past life spread as ordinary stories about that person (OS5), not as clues about you |
| PN8 | **Former bodies.** In a body start, the body's earlier relationships are ordinary NPC relationships; the former occupant is gone by default (B5), so there's no one to interact with |
| PN9 | **Optional nudge-free.** No quests, events or prompts built around meeting a past self, unless the player turns that on |
| PN10 | **Escape hatch.** A per-world or per-player setting can raise the level (below) for people who want reunions or rival-self stories |

### IX: interaction levels with past selves and bodies (dial)

| Level | What exists | Default for |
| --- | --- | --- |
| IX0 Not exist | Past lives never happened in this world (fresh timeline or reset) | Story worlds with a canon replay (see BW), roguelike-reset worlds |
| IX1 Absent | They exist but elsewhere; you'll likely never meet | Huge or many-world settings |
| IX2 Background NPC | Ordinary NPC, no special link (PN1-PN10) | **Default for persistent worlds** (Weibao's lean) |
| IX3 Linked NPC | NPC, plus a record link: heir, legend, shared item; small reactions | Succession and legacy starts (LK1) |
| IX4 Interactive | Meetings, reunions, recognition, cooperation or rivalry | Echo, loop and multiverse worlds that want it |
| IX5 Playable | Switch to or merge with them | Ensemble and loop premises only |

### BW: what makes sense for story worlds

Story (book, anime, game) worlds and persistent sandbox worlds want
different defaults, because a story world's canon has to be available
again for each new life.

| Code | Consideration |
| --- | --- |
| BW1 | **Fresh canon per life by default.** Each new life in a story world starts a fresh copy of that world's timeline at the chosen anchor, so the canon cast and events are intact; earlier lives there don't exist in it (IX0) |
| BW2 | **Continue my changed timeline, by choice.** A life can instead continue a past life's branch (TIMELINES branches); then past selves become NPCs there (IX2) and changes stay |
| BW3 | **Sandbox and original worlds persist.** Village, original worlds and hubs keep one ongoing state; past selves stay as NPCs (IX2) by default |
| BW4 | **Canon characters reset by default.** A canon character played under a premise (SG8) returns to canon behavior in the next fresh timeline, unless that life continues the branch (BW2) |
| BW5 | **Same OC, different run.** If you replay the same original character in a fresh canon timeline, they're a fresh instance; the life record keeps both runs separate |
| BW6 | **Branch list in the player layer.** The start screen for a story world can show "fresh canon" and each saved branch you've touched, labeled by what you changed (no sealed truths) |
| BW7 | **Cost.** Fresh canon per life is cheap: one authored start state per anchor, no long-term simulation of abandoned branches; branches only persist when continued |
| BW8 | **Source fidelity.** Book worlds where the source itself has persistent past selves (loops, regressions, avatars) follow their own law (identity-laws lane) |

### PX: other things to consider

| Code | Consideration |
| --- | --- |
| PX1 | **Player memory vs character memory.** The player remembers past lives; characters don't, unless an entry kind gives it (reincarnation with memories, K5) |
| PX2 | **Gifts across lives.** A past self's NPC can still give, sell or bequeath things as any NPC could; no special channel needed |
| PX3 | **Save size.** Past selves as summarized NPCs cost little; full simulation only near the player |
| PX4 | **Death of a past self NPC.** Ordinary death; it shows in the player's life record as "later died" if the player can know it |
| PX5 | **Same body, new soul (in body starts).** The body's past is the former occupant's, not yours; old friends interact with "the body they know" until they notice change (RO2) |
| PX6 | **Identity law fallback.** If a world's identity law is unknown, default to IX2 in persistent worlds and IX0 in fresh-canon story worlds |
| PX7 | **Abuse.** Solo player, low priority: using a past self NPC as a stash is fine if the world's ordinary rules allow it |

### Round 9 suggestions (separate from the palette)

1. Adopt IX2 (background NPC) as the persistent-world default and BW1
   (fresh canon per life) as the story-world default; together they match
   "they'd just be NPCs" without breaking canon replays.
2. BW2 "continue my changed timeline" as an explicit choice at the story
   world start screen.
3. Check the identity-laws lane return against BW8 when it lands.

## Round 10: story world timelines and branches (2026-10-14)

Weibao: "more to consider for story world timelines and branches?"

The world-side rules (natural course unless sufficiently disturbed,
inertia, canon pressure, mutability dials, branch state and archives) are
owned by [TIMELINES_AND_DIVERGENCE](TIMELINES_AND_DIVERGENCE.md) (T1-T5,
C1-C6). This round covers how starts and lives use branches, building on
BW1-BW8.

### TA: anchors and canon versions

| Code | Consideration |
| --- | --- |
| TA1 | **Anchors are the story world's start menu.** Each story world lists anchor points (before arc X, during the festival, after the war) as start options; each anchor is a start record with its own snapshot (T2) |
| TA2 | **Spoiler-safe anchor names.** Anchors are named by what a newcomer could know ("the academy's first term"), not by later twists; the player's spoiler dial (OP4) controls how much the anchor list shows |
| TA3 | **Continuity choice.** Where a source has versions (novel, manga, anime, game, remake), a branch picks one continuity; the choice is part of the branch's identity (T1) |
| TA4 | **Canon horizon.** For unfinished or partly read sources, canon only reaches as far as our research has read; beyond it the world runs on motives (C6). The horizon is recorded per branch |
| TA5 | **Canon revisions.** When more of a source is read later, the canon event graph grows. New branches use the new revision; old branches keep theirs unless the player opts in to an update that only adds events not yet reached |
| TA6 | **What-if seeds.** An anchor can carry an authored divergence (a character survives, a war starts early, a fan AU premise) as a premise layer; it starts its own branch family |
| TA7 | **After the ending.** A branch that passes the source's last canon event keeps going on motives; post-ending anchors (SA21) are starts in their own right |

### TB: branch lifecycle

| Code | Consideration |
| --- | --- |
| TB1 | **Created only by commitment.** A branch exists when a life commits to a fresh canon start (BW1) or continues one (BW2); previews and rerolls never create branches |
| TB2 | **Auto-named, renamable.** A branch gets a name from its biggest known change ("the heir lived"), shown only with what the player knows; the player can rename it |
| TB3 | **Several lives per branch.** Lives can follow each other in one branch (heirs, later starts in the changed world); concurrent played lives in one branch need concurrent-play rules (LS10) |
| TB4 | **Resting branches freeze.** A branch no life is in stops simulating; returning resumes it where it stopped, unless the world's clock policy says time passed (T4) |
| TB5 | **Archive and prune, never silently.** The player can archive (keep the record, drop playable detail) or delete a branch; the game asks first and keeps the life record entries either way |
| TB6 | **Size budget.** Fresh canon costs almost nothing (authored anchor); a continued branch stores only its changes from canon plus its live people (C3, C4) |
| TB7 | **Branch-local vs global.** Relationships, items, places and world changes stay in their branch. Player-layer things (unlocks, library knowledge, cheat research, start records opened) carry across branches |
| TB8 | **Branch endings.** A branch can be marked finished (the source ended, the world fell, the player is done); its outcome feeds linked starts in other branches only through player-layer records |
| TB9 | **Branch from a moment.** A bookmarked moment (SG6) can seed a new branch: the world as it was then, a different body; the original branch stays untouched |
| TB10 | **Pinned fixed points.** A player can choose events to keep fixed in a branch ("let the tournament happen") on top of the world's own fixed points |

### TU: showing timelines and branches

| Code | Consideration |
| --- | --- |
| TU1 | **Timeline map.** Per story world: the canon line as a thread, each branch as an offshoot at its divergence, known events as nodes; unknown future events are not drawn |
| TU2 | **Story so far.** Per branch: which known canon events happened as usual, changed, failed to happen or haven't come yet; with confidence (foreknowledge confidence from the timeline doc) |
| TU3 | **Branch diff.** Compare a branch with canon or with another branch, limited to what the player knows |
| TU4 | **Start screen choice.** For a story world: "Fresh canon at an anchor", "Continue a branch", "New branch from a moment"; branches listed with name, last life, era reached |
| TU5 | **Next canon event, as a lead.** If the character has foreknowledge, the next expected event can be a notebook lead with its confidence; without foreknowledge, nothing shows |
| TU6 | **Fast-forward to the next anchor.** In quiet stretches, skip to the next canon event window with summarized days (idle fit), stopping early if something important happens |

### TX: other things to consider

| Code | Consideration |
| --- | --- |
| TX1 | **Crossover branches.** A branch of one story world can link to a branch of another when travel happens; each keeps its own state, and the link records the crossing (T4 crossings) |
| TX2 | **Same anchor, many lives.** Replaying the same anchor in fresh canon is normal; each run is a separate branch, and the player layer can compare them (TU3) |
| TX3 | **Rivals who also know canon.** Other regressors or travelers in the branch push their own changes (timeline doc "who changes history besides you") |
| TX4 | **Canon pressure per branch.** A branch can choose looser or stricter canon pressure than the world default (a "chaos" or "faithful" run), labeled on the branch |
| TX5 | **Arcs as chapters.** Story world arcs can frame the idle loop: an arc's window is a season with its own goals, after which the next anchor's events become eligible |
| TX6 | **Retroactive discovery.** Facts learned in one branch (a hidden cause, a secret) are player knowledge; a character in another branch only knows it through an in-world route (K1) |
| TX7 | **Branch identity law.** A branch inherits the world's identity law (IX dial, identity-laws lane); a premise layer can change it for that branch only |
| TX8 | **Canon cast fidelity.** In fresh canon, canon characters start as the source has them at the anchor; in continued branches they carry what earlier lives did to them |

### Round 10 suggestions (separate from the palette)

1. TA1 + TU4: anchors as start records and the three-way story world start
   choice. It is the smallest piece that makes BW1/BW2 playable.
2. TB7 branch-local vs global split: decide it early, since saves depend on it.
3. TU2 "story so far" as the first timeline view; the full map (TU1) later.
Round 2 there (N1-N15) dispatches four Codex lanes: engine spec, play per
body kind, canon nonhumans by world and monster-protagonist mechanics.

## Round 11: more on anchors and branch lifecycle (2026-10-14)

Weibao: "more to consider for branch lifecycle and anchors?" Builds on
TA1-TA7 and TB1-TB10.

### AH: anchors

| Code | Consideration |
| --- | --- |
| AH1 | **Anchor kinds.** Event anchors (just before the tournament), era anchors (a period with no fixed event), place anchors (this city in this year), character anchors (when a canon character is ten), date anchors (a calendar day) |
| AH2 | **Granularity by density.** Coarse anchors (arcs) for quiet stretches, fine anchors (days, scenes) around big canon events where a few hours matter |
| AH3 | **Derived snapshots.** Author anchor 1 fully; each later anchor is the previous one plus the canon events between them (C1 event graph). Fewer hand-written snapshots, and anchors can't contradict each other |
| AH4 | **Evidence per anchor.** Each anchor's state carries source locators and a shown / stated / inferred label, so a wrong canon assumption can be found and fixed (source deep dive M4) |
| AH5 | **Off-screen at the anchor.** An anchor also records what is happening elsewhere at that moment (who is where, what's brewing), so a start in a side location still has the canon world around it |
| AH6 | **Role fit.** Anchors declare which start kinds fit them (a school anchor fits students and staff; a war anchor fits soldiers and refugees); the roll panel only offers compatible layers (LY3) |
| AH7 | **Anchor unlocks.** Anchors can be always open, opened by player knowledge (the player read that far, TA4), or opened by a past life reaching that point in any branch |
| AH8 | **Pressure tag.** Each anchor carries how close trouble is (calm, building, imminent) for RW5 filters and for suspenseful random entry |
| AH9 | **Random within anchors.** "Surprise me in this world" rolls an anchor first (weighted, equal-world rule WQ2 applies inside the world), then the start |
| AH10 | **Anchors in a continued branch.** After divergence, a named anchor may no longer mean anything; in a continued branch, anchors become dates ("jump to the year of the tournament") and show whether the event still exists there |
| AH11 | **Crossover anchors.** Two worlds with linked calendars can share an anchor date, so a crossing lands at a known point in both |
| AH12 | **Anchor quality check.** Same first-ten-minutes test as any start (WM1): something to see, one action, a reason to care, feedback, a first choice |

### BR: branch lifecycle

| Code | Consideration |
| --- | --- |
| BR1 | **Branch states.** Active (a life is in it), resting (frozen), archived (record only), finished (marked done), dormant (its content pack or revision is missing; restorable, like today's suspended structured save) |
| BR2 | **Fork a branch.** Copy a branch at its current state into a second branch for a what-if; labeled in both records. A player-layer tool, allowed by default (solo player) and off in a strict mode |
| BR3 | **Branch checkpoints.** Automatic checkpoints at anchors and big events; the player can fork from one (BR2). Rewinding the same branch in place is a separate strict/relaxed setting |
| BR4 | **Strict vs relaxed branches.** A branch can be strict (no forks, no rewinds, one life at a time) or relaxed; strict is recorded as a feat-like label |
| BR5 | **Family tree of branches.** Each branch knows its parent and fork point; the timeline map (TU1) draws forks as sub-offshoots |
| BR6 | **Offline time goes to one place.** Idle time while away accrues to the active branch only; resting branches stay frozen (TB4), so having many branches never multiplies idle gains |
| BR7 | **Switching branches.** Switching is a player-layer action like changing save slots; the life you leave keeps its state in its branch |
| BR8 | **Death inside a branch.** The branch continues if an heir or linked start is taken there; otherwise it rests; the player decides whether it's finished |
| BR9 | **Branch settings travel with it.** Pacing toggles, canon pressure (TX4), identity law level (IX) and spoiler level are stored per branch |
| BR10 | **Branch chronicle.** Each branch keeps a short chronicle of its big changes, generated from the event graph, readable from the player layer |
| BR11 | **Export and import a branch.** A branch can be exported as a file (with its source revision and seed) and imported back; missing content makes it dormant (BR1), not broken |
| BR12 | **Content updates.** On a game or source update, a branch keeps its pinned revisions; the player can migrate when a migration exists (TA5), never silently |
| BR13 | **Storage hints.** The branch list shows rough size; archiving (TB5) shrinks it; nothing deletes without asking |
| BR14 | **Re-entering finished branches.** A finished branch can be reopened for post-ending play; the finish mark stays in the record |
| BR15 | **Player notes.** Each branch has a free-text note field for the player's plans and guesses (LB6 hypotheses, branch-scoped) |

### Round 11 suggestions (separate from the palette)

1. AH3 derived snapshots: the cheapest way to get many anchors per story
   world without contradictions.
2. BR6 offline time to the active branch only: settle it before branches
   ship, since it touches the idle economy.
3. BR1 dormant state reusing the existing suspended-save pattern
   (`suspendedStructuredSave` in `src/main.js`), so missing content never
   breaks a branch.

## Round 12: derived snapshots and offline branch time (2026-10-14)

Weibao: "more to consider for derived snapshots and offline branch time?
Other stuff and more? send codex accordingly". Builds on AH3 and BR6. Codes
here use DV (derived snapshots), OT (offline time), MX (other).

### DV: derived snapshots

| Code | Consideration |
| --- | --- |
| DV1 | **Base plus events.** A world's canon state at any anchor = one authored base snapshot + the canon events up to that time, applied in order. Only the base and the events are hand-written |
| DV2 | **Events carry requirements.** Each event lists what must be true (a person alive, an item held, a place standing). In fresh canon all hold; in a branch, an event whose requirement fails is skipped, which is how removing a cause changes history (T3) |
| DV3 | **Skips cascade.** Events that depend on a skipped event's results are also skipped or changed; the derivation reports which and why |
| DV4 | **Computed facts aren't events.** Ages, seasons, travel schedules and other facts that follow a formula are computed from the time, not stored as events |
| DV5 | **Cache at anchors.** Derived snapshots at each anchor are cached and recomputed only when the base, an event or the revision changes; incremental derivation (from the previous anchor) must equal full derivation (from the base) |
| DV6 | **Branch = derived canon + overrides.** A continued branch stores only its divergence point and the changes since; its state is canon derived to that point plus the overrides, with later canon events re-checked against the changed world |
| DV7 | **Evidence travels.** Each applied event carries its source locator and label, so the snapshot can say where each fact came from (AH4) |
| DV8 | **Author lint.** Tools flag events that can never fire, two events setting the same fact at once, and facts no anchor ever sets |
| DV9 | **Canon randomness is fixed.** If the source decided an outcome, the event sets it; randomness only enters for things the source left open, seeded per branch (RX7) |
| DV10 | **Off-screen detail lazily.** People and places the source never described are generated when first observed (C3, C4) and then stored, so they stay consistent |
| DV11 | **Diff for free.** Comparing two derived snapshots gives the TU3 branch diff and the TU2 "story so far" |
| DV12 | **Revision pinning.** A derived snapshot records the event list revision it used, so reading more of a source later (TA5) never silently rewrites an existing branch |

### OT: offline time across branches

| Code | Consideration |
| --- | --- |
| OT1 | **One active branch accrues.** Time away advances only the branch you were in; resting branches stay frozen (BR6) |
| OT2 | **What accrues.** Queued jobs, passive skill progress (the accepted passive-progression direction), travel, rest and the world's own clock in that branch |
| OT3 | **Canon events while away.** Big canon events falling inside offline time can (dial) happen normally with a summary, or pause the clock just before them so you're present; default: pause before events marked important for your character, run the rest |
| OT4 | **Offline cap.** A per-world or player setting for the most offline time applied at once; extra time is banked or dropped, per setting |
| OT5 | **Return summary per branch.** "While you were away" lists what happened in that branch only (XS2), including canon events and job results |
| OT6 | **Switching branches offline.** Switching branches is instant; the old branch freezes at the moment you leave, the new one resumes where it froze |
| OT7 | **Player-layer timers.** Research toward unlocks and other player-layer progress tick only through the active life (no parallel farming across branches), unless a world says otherwise |
| OT8 | **Resting branches with a moving world.** A world whose clock policy says time passes while you're gone (T4) applies bounded catch-up when you return to that branch, summarized, never more than its cap |
| OT9 | **Clock trust.** Offline time uses wall-clock difference with sanity limits (no negative time, capped jumps); solo player, so changed system clocks just follow the cap |
| OT10 | **Tab open vs closed.** The same rules apply whether the tab was closed or just in the background, so play doesn't depend on keeping a tab open |

### MX: other things to consider

| Code | Consideration |
| --- | --- |
| MX1 | **Anchors from derived snapshots feed starts directly.** A start record's world snapshot can be a derived anchor plus role layers (ISR1), so book-world starts stay consistent with canon automatically |
| MX2 | **Branch size stays small.** Because branches store overrides only (DV6), many branches cost little until they diverge a lot |
| MX3 | **Divergence meter source.** The number and weight of overrides gives the optional divergence sense from the timeline doc a real basis |
| MX4 | **Testing.** Every anchor's derived snapshot gets a fixture test so content edits that break canon order are caught |

### Round 12 dispatch

Two Codex lanes in
[derived-snapshots-2026-10-14](gm/dispatch/derived-snapshots-2026-10-14/GOAL.md):
a pure derived-snapshot module with a frozen gate (prototype, worktree
branch `codex/start-records`), and a read-only audit of how the current game
handles offline time and clocks, to ground OT1-OT10.
Round 3 there (N16-N23) adds transformation and senses/UI lanes, and
Reincarnation Paradise lanes after it joined the canon-first tier.

## Round 13: branch overrides and canon events, extended (2026-10-14)

Weibao: "more to consider for branch overrides and canon events? Exent and
consider accordingly? send out codex agents accordingly?" Builds on DV1-DV12
and the timeline doc's C1-C6 (coarse event graph, inertia, lazy resolution,
level of detail, roles not people, motives outlive scripts). Codes: OV
(overrides), CV (canon events).

### OV: branch overrides

| Code | Consideration |
| --- | --- |
| OV1 | **Override kinds.** Set a fact (the mill burned), cancel a canon event (the duel never happens), insert a new event (your shop opens), remove or add an actor (someone dies early, a newcomer arrives). All stored as timed changes |
| OV2 | **Changes are timed, not global.** Each override has a time; canon before it is untouched, canon after it is re-checked. Multiple changes interleave with canon events in time order |
| OV3 | **Caused by play, recorded with cause.** Each override records which life and action caused it, so the chronicle (BR10) and "why is this different" both have an answer |
| OV4 | **Small changes heal, big ones stick.** Overrides below an event's inertia are absorbed: the event still happens, maybe with a note ("the duel was delayed a day"). Above it, the event changes or fails (C2) |
| OV5 | **Substitutes.** When a canon actor is gone, a role can be filled by someone who fits (C5), recorded as a substitution so the player can see "the role went to someone else" |
| OV6 | **Fixed points.** Events the world (or player, TB10) marks fixed happen regardless; the override that would have stopped them is recorded as resisted, with a fitting in-world reason |
| OV7 | **Overrides can be undone by play.** Rebuilding the mill is a new override, not a deletion; history keeps both |
| OV8 | **Knowledge overrides.** Telling someone the future is an override on what they know, not on the world; their later choices are what change events (T3 information channels) |
| OV9 | **Override budget per event.** An event shows (to developers) how many overrides touch its requirements, flagging canon that's under heavy pressure |
| OV10 | **Loop worlds reset overrides.** In a loop branch, a reset clears world overrides back to the loop's start snapshot while kept knowledge stays (loop rules per world, e.g. a loop's return point and what persists) |
| OV11 | **Merging overrides from two lives.** Two lives in one branch add their overrides to the same list; conflicts at the same time resolve by the world's rules, never by silently dropping one |
| OV12 | **Provenance per fact.** For any fact, the derivation can say which canon event or override last set it ("why is the mill gone? burned by Life 2, day 40") |

### CV: canon events

| Code | Consideration |
| --- | --- |
| CV1 | **What counts as a canon event.** Something a source shows or states that changes a fact other events depend on. Flavor scenes stay as notes, not events |
| CV2 | **Roles, requirements, effects, window.** Each event names roles (who does it), requirements (what must hold), effects (what changes) and a time window (exact day, or "sometime this week") |
| CV3 | **Windows resolve lazily.** An event with a window picks its exact time when its window opens or someone observes it, seeded per branch (C3) |
| CV4 | **Motive behind the event.** Each event records the actor's motive; if the event fails, the motive persists and can produce a different event later (C6) |
| CV5 | **Information events.** Some events only change who knows what (a secret revealed, a rumor spreads); they matter for foreknowledge confidence and for NPC choices |
| CV6 | **Off-screen events.** Events the source mentions only in passing still get recorded, with lower confidence, so the world beyond the protagonist moves too |
| CV7 | **Narrative order vs occurrence order.** A source may reveal an event long after it happened; events are stored by occurrence, with a separate reveal point for spoiler-safe display (lore and timeline contract) |
| CV8 | **Confidence and labels.** Each event has shown / stated / inferred and a confidence; low-confidence events can be easier to disturb |
| CV9 | **Recurring events.** Festivals, tax days, school terms repeat on a rule rather than as copies |
| CV10 | **Protagonist events.** The source protagonist's own actions are events like any other, with motives, so they can be pre-empted, helped or substituted (WF1 beside, not inside) |
| CV11 | **Granularity budget.** A source gets a few dozen to a few hundred events per era (C1); detail is added near anchors players actually use |
| CV12 | **Pilot on real sources.** Before scaling, test the format on two fully read books with timelines (a loop world and a villain-protagonist world) and record what the format can't express |

### Round 13 dispatch

In [canon-events-2026-10-14](gm/dispatch/canon-events-2026-10-14/COMMON.md):
two pilot lanes build small canon event graphs from fully read books
(Mother of Learning, a loop world; I Am the Fated Villain, a villain
protagonist) in the derived-snapshot format, privately, and report what the
format can't express. A code lane for override kinds (OV1, OV2, OV5, OV6,
OV12) is queued behind the current snapshot module so the file has one
writer at a time.

### Round 13 suggestions (separate from the palette)

1. OV1 + OV2 timed change list as the branch storage format.
2. OV12 provenance per fact: cheap once overrides are timed, and it powers
   "why is this different" everywhere.
3. CV12 pilots before scaling event authoring to more books.
Round 4 there records the first returns (engine spec, monster mechanics,
partial play profiles), N24-N31, and six more lanes (society, bonds,
progression, monster side, Paradise missions and hub life).

## Round 14: canon event motives, substitutes and more (2026-10-14)

Weibao: "more to consider for canon event motives and substitutes? Save and
extend accordingly, more to consider in general?" Builds on CV4 (motives),
OV5 (substitutes), the timeline doc's C5/C6 and the existing casting
algorithm in [E2 storylets](emergent/E2_STORYLETS.md#6-casting-algorithm)
(role spec `pick / where / prefer / spawn / distinct`, scored draw, stable
spawn IDs). Codes: MT (motives), SP (substitutes), GE (general).

### MT: motives behind canon events

| Code | Consideration |
| --- | --- |
| MT1 | **Motive = want + reason + means.** An event's actor wants something (power, revenge, safety, a person), for a reason (grief, ambition, orders), using means they actually have. All three are stored, so a changed means or reason changes the event |
| MT2 | **Motives belong to people, events express them.** The same motive can drive several canon events; removing one event leaves the motive looking for another outlet (C6) |
| MT3 | **Motive strength and patience.** Strong motives retry sooner and accept worse odds; weak ones fade if blocked. Patience sets how long before a new attempt |
| MT4 | **Outlet list.** For important motives, authors list a few canon-plausible alternative outlets (assassinate, frame, bribe, leave); the storyteller picks one when the canon outlet fails (E5) |
| MT5 | **Motive changes.** Play can satisfy a motive (they got what they wanted), redirect it (a new target), or dissolve it (reason removed: the grief healed, the order rescinded) |
| MT6 | **Hidden motives.** The player sees actions, not motives; motives are learned through observation, confession, mind reading or system info (K1, E7 observation) |
| MT7 | **Group motives.** Factions have motives too (a cult wants its ritual, a guild wants a monopoly), outliving any one member; individuals carry part of it |
| MT8 | **Motive conflicts.** Two motives in one person (loyalty vs ambition) can flip with circumstances; canon picks one, a branch can tip the other |
| MT9 | **Source fidelity.** Motives come from the source (shown/stated/inferred); inferred motives are labeled and easier to rewrite in a branch |
| MT10 | **Player motives are not tracked.** The player character's intent stays the player's (O1); NPCs only infer it from acts |

### SP: substitutes for canon roles

| Code | Consideration |
| --- | --- |
| SP1 | **Role spec from the event.** Each canon role (killer, mentor, messenger, rescuer, rival) has a spec in E2 terms: who can fill it (`pick`, `where`), who is preferred, and whether a new person may spawn |
| SP2 | **Substitute ladder.** Canon actor first; then someone with the same motive (MT2); then someone fitting the role spec; then a spawned stranger; then nobody (the event fails). Each world sets how far down the ladder it goes |
| SP3 | **Canon pressure decides the ladder.** Strong pressure goes all the way to a stranger; weak pressure stops at "same motive" or lets the event fail (canon pressure dial) |
| SP4 | **Substitutes are not copies.** A substitute does the role with their own skill and style; outcomes can differ (a worse assassin fails, a kinder mentor teaches differently) |
| SP5 | **The player as substitute.** If the player fits a role spec, the world can offer it (you become the messenger, the rival, the mentor); accepting is a choice, not forced |
| SP6 | **Substitution is visible after the fact.** Chronicle and "story so far" can note "the role went to someone else" when the player could know it (TU2) |
| SP7 | **Spawned substitutes stay.** A stranger spawned to fill a role gets a stable ID and becomes an ordinary NPC afterwards (E2 spawn keys), so they can be met later |
| SP8 | **No substitute for some roles.** Roles tied to a unique trait (a bloodline, a one-of-a-kind cheat, a prophecy's named child) can't be filled by anyone else; the event fails or changes instead |
| SP9 | **Substitution chains.** If a substitute leaves their own canon role, that role may need a substitute too; cap the chain depth per world so changes don't ripple forever |
| SP10 | **Player knowledge.** Foreknowledge of the canon actor misleads when a substitute appears; confidence drops (foreknowledge confidence) |

### GE: more in general

| Code | Consideration |
| --- | --- |
| GE1 | **One vocabulary across systems.** Start layers, canon events, storylet cards and overrides all use the same requirement and effect shapes, so tools, tests and lint work on all of them |
| GE2 | **Authoring order for a new story world.** Anchors, base snapshot, 20-50 key events with motives and role specs, then starts as layers on anchors; detail grows only where play goes |
| GE3 | **Debug view for developers.** A hidden panel showing the active branch's derived facts, applied/skipped events, substitutions and pressure per event; never shown to the player |
| GE4 | **Replay tests from saves.** A saved branch can be rederived from its base, events and changes; a mismatch flags a bug or a content change |
| GE5 | **Content scale check.** Track events, anchors and start layers per world in a small table so effort goes where play happens |
| GE6 | **Sealed truths in events.** Events that depend on a sealed world truth refer to it by ID; their effects show in play, the truth stays sealed until discovered |
| GE7 | **Cheap first.** Most of this works with the derived-snapshot module plus the E2 casting rules; heavier simulation only where a world needs it |

### Round 14 suggestions (separate from the palette)

1. SP2 substitute ladder with the canon pressure dial (SP3): one rule that
   covers most "the canon actor is gone" cases.
2. MT1 + MT4 motive with a short outlet list for the 10-20 most important
   canon actors per world; everyone else gets role specs only.
3. GE1 shared requirement/effect vocabulary, before more systems invent their
   own.
Round 5 there adds cross-lane agreements C1-C7, a combined first-slice
shortlist and N32-N42.

### Lane returns so far (2026-10-14, research and proposals, not decisions)

- [START_AS_X_SOURCE_CATALOG](research/START_AS_X_SOURCE_CATALOG_2026-10-14.md): 57 works across 33 start kinds, ranked read-next list.
- [VILLAIN_STARTS_AND_OTHER_SELVES](worlds/VILLAIN_STARTS_AND_OTHER_SELVES_2026-10-14.md): VX1-VX10, OX1-OX12, engine shapes, world fit.
- [IDENTITY_LAWS_BY_WORLD](worlds/IDENTITY_LAWS_BY_WORLD_2026-10-14.md): IL1-IL35, per-world dial defaults; 126 entries still UNKNOWN; HP, Bleach, LOTM avatars, Roshar and Elden Ring need exact local reads before exceptional starts.
- [GAMES_OTHER_SELVES_AND_VILLAIN_PLAY](research/GAMES_OTHER_SELVES_AND_VILLAIN_PLAY_2026-10-14.md): 35 games, OGR1-OGR16.
- [OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT](research/OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md): the game has **no automatic offline catch-up today**; time advances per tick callback. OT1-OT10 are therefore new work, starting with an active-life elapsed ledger.
- Derived snapshots module (`src/anchor_snapshots.js`, worktree branch `codex/start-records`): coordinator rerun of its check passed (G1-G9, npm 640/0). Override kinds lane now running on the same file.
Round 6 there folds in transformation and senses/UI returns (C8-C11) and
adds OT1-OT16 beyond single nonhuman starts.

## Round 15: substitute ladders, motive outlets and more (2026-10-14)

Weibao: "more to consider for substitute ladders and motive outlets? more to
consider? other stuff and more? save and extend accordingly". Builds on
SP1-SP10 and MT1-MT10. The override module now supports alternatives
(`substituted`), fixed events (`resisted`) and fact provenance
(`explainFact`), verified by the coordinator (O1-O8, G1-G9, npm 649/0);
ladders and outlets below would sit on top of that. Codes: LD (ladders),
OL (outlets), NX (next).

### LD: substitute ladders

| Code | Consideration |
| --- | --- |
| LD1 | **Ladder per role, not per event.** A role ("the one who betrays the sect") carries its own ladder, reused by every event that needs that role |
| LD2 | **Rung costs time.** Each step down the ladder can delay the event (the cult needs weeks to find a new assassin), giving the player a window |
| LD3 | **Rung changes the outcome.** Lower rungs can carry a quality drop (less skill, less loyalty) that shifts the event's effects, e.g. the substitute only wounds |
| LD4 | **Rung visibility.** Observers can notice substitutes ("that's not the usual courier"), which is itself information for foreknowledge |
| LD5 | **Recruitment as a scene.** Picking a substitute can be a small off-screen event of its own (hiring, coercion, promotion) that the player can interfere with |
| LD6 | **Ladder exhaustion.** If every rung is empty or blocked, the event fails and its motive looks for an outlet (OL); exhaustion is recorded so the world doesn't keep retrying every tick |
| LD7 | **Player-held rungs.** If the player is the only fitting candidate, the world can offer the role, pressure them into it, or let the event fail; per world and per canon pressure |
| LD8 | **Cross-world rungs.** In worlds with travelers, a substitute can come from outside (another regressor, a summoned hero); only where the world's border rules allow (IDENTITY_LAWS) |
| LD9 | **Rung memory.** Once a substitute fills a role, later events needing the same role prefer them (E2 lasting casts), so the world stays consistent |
| LD10 | **Authoring default.** Most roles need only two rungs written (canon actor, "anyone who fits"); named alternates only for key roles |

### OL: motive outlets

| Code | Consideration |
| --- | --- |
| OL1 | **Outlets are verbs with costs.** Each outlet is an action the actor can take (attack, frame, bribe, flee, ally, wait) with its own requirements and risk, so actors choose what they can afford |
| OL2 | **Outlet order by personality.** A proud actor tries force before bribery; a cautious one waits; personality tags order the list (E3 living people) |
| OL3 | **Escalation.** Repeated failures move an actor to harsher outlets (warning, sabotage, violence) or softer ones (negotiation, giving up), per motive strength (MT3) |
| OL4 | **Outlets aimed at the player.** If the player blocked the canon outlet, the next one can target the player (a grudge), the player's allies, or route around them |
| OL5 | **Outlets spawn storylets.** An outlet becomes a storylet card in the E2 deck for that place, so it surfaces as ordinary play rather than a script |
| OL6 | **Outlet timing.** Outlets fire on the actor's schedule (patience), not instantly; a quiet period after a foiled plot is normal |
| OL7 | **Satisfied motives close outlets.** If the want is met some other way (MT5), pending outlets cancel |
| OL8 | **Shared outlets.** Group motives (MT7) pick outlets by consensus or by the strongest member; a faction can split if members prefer different outlets |
| OL9 | **Canon outlet first in fresh canon.** In a fresh-canon branch the canon outlet always comes first; alternates only appear after it fails |
| OL10 | **Outlet budget.** Each world caps active off-screen outlets near the player so the simulation stays light (C4 level of detail) |

### NX: other things to consider

| Code | Consideration |
| --- | --- |
| NX1 | **Ladders and outlets in the debug view.** GE3 shows, per event, the rung used and the outlets tried, so balancing doesn't need guesswork |
| NX2 | **Tests per ladder.** Fixture tests for key roles: remove the canon actor, check the expected rung and delay (same pattern as the mill gate) |
| NX3 | **Player-facing language.** The player never sees "rung 3"; they see a stranger doing a job, a delay, a rumor of hiring |
| NX4 | **Pilots feed this.** The two canon-event pilot lessons (Mother of Learning, Fated Villain) should say which roles needed ladders and which motives needed outlets in real canon |
| NX5 | **Next code step, when wanted.** Ladders map onto the module's `alternatives` (ordered, each with requirements); outlets map onto inserted events driven by motive records. Both can be prototyped on the same fixture style |

## Round 16: the player layer, saves and authoring (2026-10-14)

Weibao: "more to consider? other stuff and more? save and extend accordingly
Send out codex as usesful?" Earlier rounds covered single starts, worlds and
branches. This round covers what sits around them: the player layer between
lives, how it's saved, and how content gets made. Codes: MP (player layer),
SV (saves), IAU (authoring).

First pilot return: the Fated Villain canon-event pilot built 33 events, 5
anchors and 3 branches, all derived through the module
([lessons](gm/dispatch/canon-events-2026-10-14/pilot-fv/LESSONS.md)). Its
main asks: separate occurrence time from reveal time, typed knowledge and
warning state, IDs for repeated transactions, and an explicit clock for
event windows. Its opening arc had no real substitution or fixed point to
test; another source should supply one.

### MP: the player layer between lives

| Code | Consideration |
| --- | --- |
| MP1 | **When it appears.** Nothing of it in the first life; after the first death or ending (XS3), a calm "between lives" screen opens with the life record, start records and branches |
| MP2 | **Plain names.** Player-facing words: "lives", "moments" (anchors), "timelines" (branches), "starts"; internal codes never shown |
| MP3 | **No narrator by default.** The player layer is a menu, not a character (O8); an optional diegetic frame (an archive, a library, a god's ledger) can dress it per taste |
| MP4 | **Life select.** Continue the current life, pick a linked start, start fresh in a known world, roll, or open a branch; one screen, laptop-wide (UI2 style) |
| MP5 | **What carries between lives.** A short visible list: library knowledge, unlocked starts, cheat research, known worlds. Everything else stays in its life or branch (TB7) |
| MP6 | **Meta progress without grind.** Unlocks come from things done in lives (met a holder, read a book, reached a moment), not from a separate currency to farm |
| MP7 | **Completion as curiosity.** Collections (starts played, worlds seen, endings reached) exist but don't gate play unless the player wants goals (LV6) |
| MP8 | **Returning after a break.** The player layer shows where each active life left off, with the return summary (OT5) one click away |
| MP9 | **Settings live here.** Player preferences that span lives (spoiler level, content filters, other-selves preference, pacing presets) sit in the player layer, with per-branch overrides (BR9) |
| MP10 | **One active life at a time by default.** Multiple active lives across branches are allowed, but offline time goes to one (BR6) |

### SV: saves

| Code | Consideration |
| --- | --- |
| SV1 | **One profile, many branches.** A player profile holds the player layer plus a list of branches; each branch holds its overrides, live people and lives. Today's single save becomes the first branch of the first profile through a migration (AGENTS: persistence changes need one) |
| SV2 | **Branches load on demand.** Only the active branch is fully in memory; others stay as compact records until opened |
| SV3 | **Export levels.** Export the whole profile, one branch, or just the life record; import checks versions and leaves unknown content dormant (BR1) |
| SV4 | **Rederivation as a check.** On load, a branch can be rederived from base, events and changes and compared with its stored summary; mismatches are reported, never silently fixed (GE4) |
| SV5 | **Backups before migration.** Any save format change keeps the previous save untouched until the new one loads and saves cleanly |
| SV6 | **Size targets.** Rough budget per branch and per profile, measured on real play before choosing formats (engine and saves review owns measurement) |
| SV7 | **Old saves stay playable.** A pre-branch save opens as one branch in the vanilla Village with its current state; nothing in it is rerolled |

### IAU: authoring

| Code | Consideration |
| --- | --- |
| IAU1 | **One authoring kit per story world.** Anchors, base snapshot, events with roles and motives, start layers, identity law, frame tokens; one folder, one template (WM5) |
| IAU2 | **Pilot first.** A new world gets a small pilot (20-60 events, 3-6 anchors) run through the module before wider authoring, as the two current pilots do |
| IAU3 | **Lint on save.** Authoring files are checked by `lintWorld` and the start validator before they reach a build |
| IAU4 | **Source evidence stays private.** Graphs built from books live in the ignored research folder; the game ships only original wording and facts paraphrased into data |
| IAU5 | **Author notes vs player text.** Event and start records keep author notes separate from any text the player sees (ISR8) |
| IAU6 | **Effort table.** Per world: events, anchors, starts, tests, open gaps; one line each, so the next authoring pass picks the cheapest high-value world |

### Round 16 dispatch

- An index lane writes a compact map of all intro/start codes, Weibao's
  recorded leans, proposed defaults, superseded items and open gates
  ([index](INTRO_AND_STARTS_INDEX_2026-10-14.md) when it lands), since this
  doc is long.
- An identity-gaps lane resolves the UNKNOWN identity-law entries for the
  priority worlds named in IL34 from local sources only.
- A Lout of Count's Family synthesis is queued to start when all three
  readers finish.

### Round 16 suggestions (separate from the palette)

1. MP1 + MP4: the between-lives screen appears after the first ending and
   is the one place for life select.
2. SV1 + SV7: decide the profile/branch save shape and the migration of
   today's save before any branch code touches the real game.
3. IAU2 pilot-first for every new story world.

## Round 17: the first hour, early hardship and start variety (2026-10-14)

Weibao: "more to consider? other stuff and more? save and extend accordingly
Send out codex as usesful?" Earlier rounds end at "Begin". This round covers
what the first hour after a start should feel like, what happens when a start
goes badly early, and how starts stay varied over many lives. Codes: FH (first
hour), EH (early hardship), VA (variety).

### FH: the first hour after a start

| Code | Consideration |
| --- | --- |
| FH1 | **A first-hour arc per start kind.** Arrive, orient, first small win, first person who matters, first real choice, first glimpse of something bigger. Each start record can name its beats (IF beats, extended past the opening) |
| FH2 | **First idle loop early.** Within the first few minutes the player can set something running (a job, training, a passive condition), since it's an idle game (MI2) |
| FH3 | **First setback, small.** A lost fight, a refused request or a missed meal that teaches a rule without costing much (TE8) |
| FH4 | **First relationship.** One named person with a reason to come back to them: the elder, a cellmate, a rival, a talking sword (RW7) |
| FH5 | **First unlock tells the shape.** The first new panel or system hints at what this life is about (crafting life, fighting life, schemer life) |
| FH6 | **First glimpse beyond.** A rumor, a strange stranger or a locked door that points to the wider world or the cheat, without explaining it (CO3 foreshadowing) |
| FH7 | **Leave the hour with a goal.** The player ends the first session with at least one lead they chose to follow (XS1) |
| FH8 | **Per-world tempo.** A slow cozy world can spend the hour on home and work; a suspense start front-loads danger then gives breathing room (RW5, RW6) |

### EH: early hardship and early death

| Code | Consideration |
| --- | --- |
| EH1 | **Early protection window (dial).** A short period where death becomes injury or capture instead, per world and player setting; off in harsh worlds and strict branches |
| EH2 | **Early death is still a life.** If a life ends in the first hour, it still gets a life record entry and can open linked starts (a sibling, a witness) rather than feeling wasted |
| EH3 | **Quick retry, honestly labeled.** Within the first minutes, "change my start" (UI14) is available; after that, a new life is a new life |
| EH4 | **Harsh starts announce themselves in-fiction.** Danger shows through what the character can sense (RX9), so a hard start feels chosen, not unfair |
| EH5 | **Debt and duty starts have a first payment that's reachable.** Pressure starts give a first deadline the player can actually meet with ordinary play |
| EH6 | **Lost early items are recoverable somehow.** A starting heirloom stolen in the first hour can be tracked, bought back or replaced at a cost (solo player, everything possible, reasonably) |
| EH7 | **Bad-roll recovery path.** A rolled start that turns out bleak always has one slower way forward (RX9), and the record notes it was a hard start |

### VA: variety across many lives

| Code | Consideration |
| --- | --- |
| VA1 | **Variety by axes, not by count.** Track which axes recent lives covered (world, era, role, body, entry kind, tone) and favor uncovered ones when rolling (RX8 anti-repeat, opt-in) |
| VA2 | **Repeat fatigue in openings.** Familiar beats compress on repeat (XS5, SX1); new beats get the time |
| VA3 | **Same start, different seed.** Replaying one start should still differ in people, weather, minor events and rumors (RP2, DV10) |
| VA4 | **Rare starts as surprises.** Rare records (ISR9, RP8) show up occasionally in rolls so the pool doesn't feel exhausted |
| VA5 | **Tone variety.** Feel tags (WC6) let a roll alternate cozy, tense, strange and grim, unless the player filters tones out |
| VA6 | **Variety report for developers.** Which starts get picked, abandoned in the first hour or replayed; dev only (MI7) |

### Round 17 dispatch

A save-shape lane (read-only audit plus a written migration plan) looks at
today's save format and drafts how SV1 (one profile, many branches) and SV7
(old saves stay playable) could work, without changing code.

### Round 17 suggestions (separate from the palette)

1. FH1 + FH2: give each start record a first-hour beat list, with an idle
   loop available in the first minutes.
2. EH1 + EH2: an early protection dial and "early death still opens starts".
3. VA1 axis-based anti-repeat as the roll default once more than a few
   starts exist (still opt-in).

## Round 18: the outro flow, pilot returns and event format v2 (2026-10-14)

Weibao: "more to consider? other stuff and more? save and extend accordingly
Send out codex as usesful?" The intro has a mirror: how a life closes and
hands over to the next. Ending possibilities (scope, cause, aftermath,
continuation) are owned by
[the starts and endings palette](STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md#p2-ending-possibilities);
this round covers the flow and screens. Codes: EF (ending flow), PR (pilot
returns).

### EF: the ending flow

| Code | Consideration |
| --- | --- |
| EF1 | **Endings arrive three ways.** Death or terminal loss; a chosen close ("retire here", "this life is done"); or a natural end the world offers (a quest line finishes, the source story ends). All three use the same outro |
| EF2 | **A pause before the outro.** The final moment gets one quiet beat in the log before any screen changes, so a death or farewell lands |
| EF3 | **Epilogue lines from real state.** A few lines about what became of the people, places and things the life touched, generated from the branch's actual facts and motives, not a template |
| EF4 | **Life summary card.** Name, world, years, entry kind, biggest changes to canon, people who mattered, what was left behind; screenshot-friendly (UI4 start card's twin) |
| EF5 | **What carries, shown once.** The outro lists what passes to the player layer (MP5) and what stays in the branch, before the between-lives screen opens |
| EF6 | **Starts opened by this life.** The outro ends on newly opened starts, best-linked first (LV4), with a "not now" that keeps them for later |
| EF7 | **Undo window for chosen closes.** A chosen close can be reversed briefly (misclick safety); deaths follow the branch's strict or relaxed setting (BR4) |
| EF8 | **The world keeps going.** After the outro, the branch rests (TB4); a later life in that branch sees the epilogue as history, and the former character as an NPC or a grave (IX2) |
| EF9 | **Endings for the first life are gentle.** The first outro is also the moment the player layer is introduced (MP1), so it explains just enough: "you can begin another life" |
| EF10 | **Source-story endings.** When a story world's canon ends in a branch, the outro can offer "keep living here" (post-ending play, TA7) beside "close this life" |
| EF11 | **Tone follows the life.** A cozy life ends warm, a villain life can end in infamy or quiet exile; outro wording takes the life's tone tags (VA5) |
| EF12 | **No forced moral verdict.** Epilogues report consequences and how people remember the life; they don't score it as good or evil (VS13) |

### PR: pilot returns and the event format v2 lane

Both canon-event pilots finished and ran through the module:
[Fated Villain](gm/dispatch/canon-events-2026-10-14/pilot-fv/LESSONS.md)
(33 events, 5 anchors, 3 branches) and
[Mother of Learning](gm/dispatch/canon-events-2026-10-14/pilot-mol/LESSONS.md)
(45 events, 6 anchors, 3 branches). Shared asks:

| Code | Ask | Where it goes |
| --- | --- | --- |
| PR1 | Separate occurrence time from reveal time | v2 `reveal_at` / `revealed` |
| PR2 | Knowledge and warnings as their own state: receipt is not belief or action | v2 `knowledge` with channel and time; `knows` requirements |
| PR3 | Event windows resolved by an explicit, seeded clock | v2 `window` / `resolvedAt` |
| PR4 | A loop reset adapter that restores local facts and keeps declared knowledge | v2 `reset` change, `loop: true` events, `localAt` |
| PR5 | Every substitution and fixed point needs source or premise justification | authoring rule (IAU), not code |
| PR6 | Keep the pilots' anchors and branches as regression fixtures | private fixtures, rerun by the v2 lane |

The v2 code lane is running in
[canon-events-2026-10-14](gm/dispatch/canon-events-2026-10-14/COMMON.md#event-format-v2-lane-2026-10-14)
with a frozen gate (V1-V7 plus the earlier O and G gates), checked against a
coordinator scratch implementation before launch.

### Round 18 suggestions (separate from the palette)

1. EF3 + EF4: epilogue lines from real branch state plus a life summary
   card; the outro's core.
2. EF9: make the first outro the gentle introduction to the player layer.
3. Let v2 land and rerun both pilots before authoring a third source.

## Round 19: reconciliation, micro details, returns (2026-10-14)

Weibao: "more to consider? other stuff and more? save and extend accordingly
Send out codex as usesful? Subtle micro stuff too?"

### Reconciling the index flags (C1-C11)

The [index](INTRO_AND_STARTS_INDEX_2026-10-14.md#corrections-and-unresolved-tensions)
found eleven tensions. Where existing authority settles one, it's settled
here; earlier wording stays as dated history.

| Flag | Resolution |
| --- | --- |
| C1 | **OP3 is superseded.** PROJECT.md's UI density pass keeps Workspace as the default after A1. My round-1 "Classic first-session default" was wrong against that; the intro follows PROJECT |
| C2 | **CR2 and UI2 supersede IF4's "fold cosmetic extras under More"** (standing UI priority: use laptop space, don't bury) |
| C3 | Already corrected in round 2 (random entry is accepted; Village is one chosen start) |
| C4 | **Complementary, not conflicting.** OS1/OS4 (past characters live on as summarized NPCs) apply to persistent worlds and continued story branches; BW1 (fresh canon per life) means they simply aren't in a fresh story copy |
| C5 | **Two scopes of "None".** As a player preference it filters which starts are offered; as a world law it holds only where that world's source or premise says so (identity laws IL3/IL26). A preference never rewrites a source's truth |
| C6 | **Clarified.** BW7 meant abandoned branches aren't simulated. Every committed branch, fresh or continued, rests and can resume (TB1, TB4); storage stays small because resting branches hold only changes |
| C7 | **Consistent.** Resting branches are frozen by default (BR6/OT1); OT8 is the per-world exception for worlds whose clock policy says time passes |
| C8 | **OV6 refined.** A fixed point needs a source or premise reason and a supported means; "happens regardless" means the world finds a supported way, not magic (PR5, SP8) |
| C9 | **Proposal for the boundary.** "Pressure" (LD7) means consequences and offers in the world; it never takes control of the player character's choices (O1, SP5) |
| C10 | F5 and OP8 are dated 2026-10-13, before the A1 pass; later UI state is owned by PROJECT.md's UI summary |
| C11 | `branch.overrides` stays only as a legacy shortcut for one change; `branch.changes` is the format (OV2) |

### MZ: subtle micro details around starts and branches

Building on the shared micro palette
([MC1-MC48](worlds/world-depth-2026-10-13/36_MICRO_MOMENTS_AND_SMALL_SIGNALS.md)),
these are the ones specific to beginnings, branches and endings.

| Code | Micro detail |
| --- | --- |
| MZ1 | **First line sets the senses.** The cold open's first sentence is a sensation (cold stone, bread smell, a bell) before any explanation |
| MZ2 | **Pockets tell a story.** Starting items each carry one line of history when examined (a letter with a torn name, a coin from another country) |
| MZ3 | **Names first heard, not given.** NPC names appear as "the old man" until someone says the name aloud; then the log and panels switch |
| MZ4 | **The body's habits.** In a body start, small reflexes (a bow to a noble, a limp, a craving) show up before the player knows why |
| MZ5 | **Time stamp in-fiction.** The first log line uses the world's calendar ("third day of Chariot"), so the date itself is a clue |
| MZ6 | **One object out of place.** Each start has a small odd detail (a fresh grave, a locked drawer) that becomes a lead only if examined |
| MZ7 | **Weather remembered.** A replay of the same anchor in fresh canon has the same canon weather; a branch can drift; observant players notice |
| MZ8 | **Echo lines.** Meeting a place a past life knew can add one faint line ("this road feels familiar") only in worlds that allow recognition (IX levels) |
| MZ9 | **Small canon tells.** Before a canon event, minor signs show (posters for the tournament, a stranger asking directions) so foreknowledge has something to match |
| MZ10 | **Substitute tells.** A substitute does the job slightly differently (wrong hand, different accent), noticeable on close look (LD4) |
| MZ11 | **Branch wear.** The branch list shows a tiny detail from the last moment played ("rain, evening, the inn"), not just stats |
| MZ12 | **Last words.** The outro keeps the life's final log line verbatim as its first line (EF2) |
| MZ13 | **Grave detail.** A past life's grave or memorial in a persistent world carries an inscription chosen from how people remembered them (EF3) |
| MZ14 | **Seed whisper.** The seed on the start card is copyable with one click and shown small; no fanfare |
| MZ15 | **Cursor rests.** On the start screen the focused control is the one most players want (Begin when ready, Roll when rolling), so Enter does the obvious thing |
| MZ16 | **Quiet first autosave.** The first save after Begin happens silently within a minute, so a closed tab never loses a just-made character |
| MZ17 | **Undo toast is short.** "Change my start" and chosen-close undo show for a few seconds with the remaining time, then disappear |
| MZ18 | **Spoiler-safe hover.** Tooltips on anchors and branch names never reveal more than the label (TA2) |

### Returns since round 18

- **Event format v2** (knowledge, reveal axis, windows, loop reset): coordinator
  rerun of `check_v2.sh` passed (V1-V7, O1-O8, G1-G9, npm 655/0); both private
  pilot graphs reran cleanly ([notes](gm/dispatch/canon-events-2026-10-14/V2_NOTES.md)).
  Pure module on worktree branch `codex/start-records`; not wired into the game.
- [Index](INTRO_AND_STARTS_INDEX_2026-10-14.md): 62 code families, 20 proposed
  defaults, 11 flags (reconciled above), 10 ranked first-slice candidates.
- [Identity-law gaps](worlds/IDENTITY_LAWS_GAPS_2026-10-14.md): 19 worlds,
  25 conditional routes resolved or narrowed; defaults unchanged; Roshar laws,
  LOTM sharing details and Elden Ring identity pages still need sources.
- [Save shape](research/PROFILE_AND_BRANCH_SAVE_SHAPE_2026-10-14.md): keep
  today's complete save inside the first branch, backup-first migration; a fresh
  save measured 54,265 JSON bytes (RAM-only).

### Round 19 dispatch

A micro-details lane writes per-start-kind micro signals (first lines,
pockets, habits, odd details) from the start audit and existing micro
palette, as an idea palette.

### Round 19 suggestions (separate from the palette)

1. MZ3 names-heard-first and MZ2 pocket histories: cheap, and they make any
   start feel authored.
2. MZ16 quiet first autosave: a small safety fix worth doing whenever starts
   change.
3. Keep the reconciliation table above as the reference when building the
   first slices from the index.
Round 7 there records all 14 first lanes returned (C12-C16), nonhuman
relationships and monster family (NR1-NR12), micro details (MM1-MM7) and five
more lanes: kin, micro, nonhuman-majority worlds, clocks and body authoring.
Round 8 there adds subtle angles SB1-SB12, OT17-OT25 and four lanes:
synthesis and roadmap, start specs, minds, and making without hands.

## Round 20: start writing, comfort, fairness and testing (2026-10-14)

Weibao: "more to consider? other stuff and more? save and extend accordingly
Send out codex as usesful? Subtle stuff too?" Codes: WS (writing), AY
(comfort and accessibility), FR (fairness between starts), QA (testing),
SB (subtle).

Fact check on MZ16: the game already autosaves every 60 seconds of play
(`src/main.js:1745`, `src/main.js:7631`, source read, not played), so a new
character is saved within a minute. MZ16 only needs that to stay true for
composed starts.

### WS: writing the start text

| Code | Consideration |
| --- | --- |
| WS1 | **One person, one tense per world.** Pick second person present ("You wake...") or another voice per world and keep it across cold opens, pockets and epilogues |
| WS2 | **Length budget.** Cold open 2-4 sentences, layer fragments one sentence, pocket lines one sentence, epilogue lines one sentence each; long lore goes to the notebook |
| WS3 | **Show the situation, not the stats.** Text names what the character notices; numbers stay in panels |
| WS4 | **No repeated openers.** Composed fragments avoid starting with the same word ("You remember... You remember..."); a simple lint can flag it |
| WS5 | **Local words.** Per-world glossary: what coins, days, ranks and gods are called, so composed text uses one vocabulary (CR9, LB11) |
| WS6 | **Original wording for book worlds.** Starts in a story world paraphrase canon facts in our own words; no source prose (IAU4) |
| WS7 | **Tone tags drive word choice.** Cozy, tense, strange, grim tags pick between fragment variants where authors provide them (VA5) |

### AY: comfort and accessibility at the start

| Code | Consideration |
| --- | --- |
| AY1 | **Content filters before rolling.** Opt-out tags (gore, abuse, body horror, child death) filter starts and events, set once in the player layer (RW12, MP9) |
| AY2 | **Readable start card.** The card reads well with a screen reader in order: who, where, pockets, seed |
| AY3 | **Color-safe frames.** World frame colors (L3) keep text contrast at 4.5:1 or better and never carry meaning by color alone |
| AY4 | **Pace control.** Text reveal speed (OP5) and a "skip intro text" option for replays |
| AY5 | **No timed choices at the start** unless the player turned them on; suspense starts pause (RW6) |

### FR: fairness between starts

| Code | Consideration |
| --- | --- |
| FR1 | **Unequal is allowed, unexplained is not.** A rich start and a poor start can both exist; each has a cause in its snapshot (P1) |
| FR2 | **Different kinds of advantage.** Money, skill, people and knowledge trade off across starts, so a poor start can be rich in people or knowledge |
| FR3 | **No balance tax by default.** Strong starts don't automatically carry a penalty (everything possible, reasonably); costed starts are a separate choice (ST14) |
| FR4 | **Start strength is private data.** A difficulty band helps testing and pool balance (ISR9), shown only through what the character senses |
| FR5 | **First-hour reachability.** Every start's first goal is reachable with that start's means, checked by the first-hour beats (FH1) |

### QA: testing starts

| Code | Consideration |
| --- | --- |
| QA1 | **Fixture per start record.** Each record resolves under fixed seeds in a unit test (like the start-records and pockets gates) |
| QA2 | **Screenshot gallery.** A dev script renders every start card at 1366x768 for quick visual review |
| QA3 | **First-action smoke test.** For each start, a browser run checks the first action works and the save round-trips (ISR6) |
| QA4 | **Canon regression.** Each story-world anchor rederives in tests (MX4); the pilot graphs are the first fixtures (PR6) |
| QA5 | **Gate first, worker second.** For code lanes, write and prove the gate against a scratch implementation before dispatch; it caught a broken import check once already |

### SB: more subtle details

| Code | Consideration |
| --- | --- |
| SB1 | **Quiet first sound.** If sound is on, the first sound is ambient (wind, a kettle), not a fanfare |
| SB2 | **The log's first hour is sparse.** Fewer, slower messages early so each line is read; density rises with the player's systems |
| SB3 | **Default name has a reason.** If the player keeps "Hero", someone in the world may comment on it once (fourth-wall dial, PRESENTATION doc) |
| SB4 | **A familiar face across fresh canon.** In repeated fresh-canon runs, the same minor NPC greets you the same way, so repetition becomes a comfort |
| SB5 | **The first coin spent is remembered.** The life record notes the first purchase; small, but the outro can mention it (EF3) |
| SB6 | **Empty pockets are a line too.** A start with nothing says so plainly ("Your pockets are empty except for lint and a button") |

### Round 20 dispatch

A pockets lane (MZ2) in the start-records worktree adds one-line histories to
every starting item in the dev probe, masks them for hidden axes, and keeps
vanilla parity; its gate (P1-P5 plus the full start-records check) was
proven to fail before work and to find a hidden-axis case.

### Round 20 suggestions (separate from the palette)

1. AY1 content filters set once before any roll.
2. WS2 + WS4 length budget and an opener lint for composed text.
3. QA2 screenshot gallery once more than a handful of starts exist.

## Round 21: cheats that show the machinery, overarching rules, implementation (2026-10-14)

Weibao: "more to consider? other stuff and more? Cheats that would show stuff
like these and more? ... Subtle stuff too? Overarching stuff? Implementation
implciations and more?" Codes: ICX (cheats that reveal), OG (overarching), IR
(implementation implications).

Everything in rounds 1-20 runs hidden by default: seeds, layers, anchors,
branches, canon events, motives, substitutes, other selves, pocket histories.
A cheat is the natural in-world way to see some of it. These extend the
cheat library (CH1-CH10 panel cards, CT types, WR standing) rather than
replace it.

### ICX: cheats that show hidden structure

| Code | Cheat | What it shows | Natural limits |
| --- | --- | --- | --- |
| ICX1 | **Plot sense** | The next canon event's rough timing and how sure it is (TU5 with foreknowledge) | Fuzzy windows; drops as the branch drifts; silent about sealed truths |
| ICX2 | **Divergence gauge** | How far this branch has drifted from canon, as a number or a feeling (MX3) | Shows amount, not which events; reads only what the holder could perceive in grade |
| ICX3 | **Role sight** | Who currently fills a canon role ("the betrayer is now the quartermaster") and when a substitute takes over (SP, LD) | Only roles near the holder; may lag a day |
| ICX4 | **Motive reading** | An NPC's want, reason and means as short tags (MT1) | Needs contact or a look; can be fooled by a strong mind or disguise; costs focus |
| ICX5 | **Thread view** | Which outlets a frustrated motive is likely to try next (OL) | Probabilities, not certainty; per world rarity |
| ICX6 | **Seed glimpse** | The life's seed and which start layers made it (provenance) | A meta cheat; fits system or admin worlds (CT2), odd elsewhere |
| ICX7 | **Origin echo** | What happened to the former occupant or other selves (OS, IX) | Only for the holder's own body or soul; may arrive as dreams |
| ICX8 | **Object memory** | The history line of any item (pocket histories for everything, MZ2) | Touch needed; recent owners clearer than old ones |
| ICX9 | **Anchor recall** | Lets the holder mark a moment to return to as a new start or a loop point (SG6, TB9, OV10) | Rare; a regression-family cheat with its own costs |
| ICX10 | **Fixed-point sense** | Which events can't be stopped here (OV6) | Feels like dread or certainty; never names sealed causes |
| ICX11 | **Branch whisper** | Faint sense of another branch where things went differently (TU3 for the character) | Only in worlds whose identity law allows awareness across branches |
| ICX12 | **Ledger of causes** | "Why is this so?" for a fact: the event or change that set it (OV12 explainFact) | Small range; a scholar or system cheat; works on facts, not secrets |

**Rules for all ICX cheats:**

- **Same data, different lens.** Each ICX cheat reads existing structures (provenance, `explainFact`, `revealed`, knowledge, ladders) through the holder's grade and range; no separate truth store (WR6, panel kit).
- **Reveal is knowledge, not world change.** What a cheat shows becomes the holder's knowledge (v2 `knowledge`), with channel "cheat", so NPCs and later lives treat it like any other known fact.
- **Sealed truths stay sealed.** ICX outputs refer to sealed facts by ID and status until discovered by their route.
- **Standing by world.** In a system world, some of these are ordinary interface; in the Village they're true cheats (WR1-WR7).
- **Panel or log.** Low-grade versions speak as log lines; higher grades get a panel card through the panel kit.

### OG: overarching rules across rounds 1-21

| Code | Rule (proposal) |
| --- | --- |
| OG1 | **One data spine.** Starts, anchors, canon events, branch changes, knowledge and pockets are data records using one requirement/effect vocabulary (GE1), resolved by pure modules |
| OG2 | **Hidden by default, revealed by route.** Every hidden structure has at least one in-world route to see it (people, research, cheats, observation), and a player-layer view when the player could know it |
| OG3 | **Player layer vs character layer.** The player can know more than the character; panels label which is which (K1) |
| OG4 | **Default + dial + reasonably.** Every behavior in this doc has a per-world or per-player dial; nothing is an absolute across worlds |
| OG5 | **Saves never surprise.** No silent reroll, rewrite, migration or deletion; revisions pinned; dormant instead of broken (SV, BR1) |
| OG6 | **Small first, proven by gates.** Each new mechanism lands as a pure module with a frozen gate before touching the game |
| OG7 | **Laptop first.** Every new screen is checked at 1366x768, 1440x900, 1920x1080; mobile deferred |

### IR: implementation implications

What it would take to move from the current pure modules to playable features.
A read-only lane is mapping this against the real code (round 21 dispatch).

| Code | Implication |
| --- | --- |
| IR1 | **Integration seam.** The probe already proves one seam: the creation confirm listener in `src/main.js` (~8168-8182) can apply a composed start. Story-world starts need a second seam where a world's anchor snapshot becomes the starting state |
| IR2 | **Fact namespace.** `anchor_snapshots` facts are a flat key map; the game's real state lives in many owners (character, inventories, locations, quests, expansion state). A mapping layer is needed so events read and write real state, or a world keeps its canon facts separate and projects them |
| IR3 | **Clock binding.** Event `at`/windows need a game-calendar source (`lifeCalendarMinute`, local calendars); the offline audit found no catch-up, so events fire only during active ticks until OT work lands |
| IR4 | **Save shape first.** Branch changes and knowledge need a home in the save; the save-shape report proposes keeping today's save as branch one, backup-first (SV1, SV7) |
| IR5 | **Performance.** Full derivation per tick is wasteful; cache at anchors, derive incrementally, recompute only on change (DV5) |
| IR6 | **Content pipeline.** Story-world graphs are private research; shipped content needs a paraphrased, original-wording data pack per world, plus lint and fixtures (IAU) |
| IR7 | **UI owners.** New panels (start card, branch list, timeline, between-lives) go through the panel kit and Workspace layout owners, not one-off DOM |
| IR8 | **Ownership.** Foundation lanes own runtime and saves; these lanes stay in the worktree until an explicit integration decision; one writer per file area |
| IR9 | **Test layers.** Pure-module gates (done), browser gates for the probe (done), then save/reload/import gates for any real integration (AGENTS verification) |

### Round 21 dispatch

- An implementation-map lane (read-only) maps IR1-IR9 onto the real code:
  integration seams, fact namespace options, clock binding, save fields,
  panel owners, and a staged integration plan with gates.
- A cheat-cards lane writes data cards for ICX1-ICX12 in the panel-kit card
  format (id, panel, role, discoveredBy, holds, reveal, settings, sealedRule,
  needsFoundation, plus data source and grade limits).

### Round 21 suggestions (separate from the palette)

1. ICX12 ledger of causes and ICX8 object memory: both read data that already
   exists (`explainFact`, pocket histories), so they're the cheapest ICX cheats.
2. Adopt OG1-OG7 as the summary rules for this area (proposal; Weibao decides).
3. Treat the implementation map as the gate before any integration work.

Return (2026-10-14): the pockets lane (MZ2) passed the coordinator's rerun of
`check_pockets.sh` (P1-P5, G1-G7, npm 658/0). The dev probe card now lists
one-line item histories and masks hidden-axis ones; vanilla values unchanged.
Round 9 there adds nonhuman cheats CV1-CV12, overarching OA1-OA6,
implementation implications IM1-IM7, SB13-SB16 and three lanes.

## Round 22: comic worlds, away progress, abstractions (2026-10-14)

Weibao: "Considering comic worlds and stuff and more? ... Cheats that would
show stuff like these ... Overarching stuff? Implementation implciations and
more? Abstaction thats needed? Idle stuff to gain progress out of the game as
well? like meditating and wheatver While Im gone? more to consider?" Codes:
CC (comic quick map), AW (away progress), AB (abstractions), ICX13+ (more
revealing cheats). Existing comic research:
[comics report](research/comics/REPORT.md),
[24 playthrough targets](research/comics/PLAYTHROUGH_TARGETS.md).

### CC: comic worlds on this system (quick map; the comics lane deepens it)

| Code | Comic feature | Our mechanism |
| --- | --- | --- |
| CC1 | Reboot | Fresh canon at a new world revision; old branches keep their pin (TA5, DV12) |
| CC2 | Retcon | A canon revision that changes past events; existing branches opt in or keep theirs; a retcon-aware cheat can notice (ICX15) |
| CC3 | Numbered realities | Parallel instances with branch IDs; travel between them is a crossing with identity rules (T4, IL) |
| CC4 | Crossover event | A crossover anchor shared by several worlds' calendars (AH11, TX1) |
| CC5 | Legacy mantles | A role with a substitute ladder: the mantle outlives the person (LD1, LD9) |
| CC6 | Revolving-door death | A world identity law allowing return with a cost or cause; returns are events with requirements, not free (IL, OS2) |
| CC7 | Sliding timescale | Computed facts tied to a world clock rule that doesn't age the cast normally (DV4) |
| CC8 | What If / Elseworlds | What-if seeds: an anchor plus a premise layer (TA6) |
| CC9 | Editorial eras | Anchors grouped by era, each with its own tone tags (AH1, VA5) |
| CC10 | Sidekicks and civilians | Start kinds beside the hero (SA10, SA11), very natural in superhero cities |

### AW: progress while you're away (meditating and more)

The game has no away progress today (offline audit). Passive progression is
the accepted direction for an idle RPG. Proposals:

| Code | Consideration |
| --- | --- |
| AW1 | **Choose an away activity.** Before leaving (or by default), the character has one away activity: meditate, train a stance, study a book, work a job, tend a garden, rest. Its gains accrue while away |
| AW2 | **Activities fit the world and body.** Meditation for cultivation and mana worlds, prayer for faith worlds, routine work everywhere, sleeping off injuries for the hurt; a body that doesn't sleep does something else (nonhuman starts) |
| AW3 | **Diminishing, not zero.** Long absences keep giving progress at a lower rate after a threshold, so leaving overnight is rewarded but play still matters |
| AW4 | **Cap with bank or drop.** A per-world or player cap on applied time; extra time banked for later or dropped, per setting (OT4) |
| AW5 | **Pause before big events.** Important canon or personal events stop the away clock just before them; the rest applies after the player handles it (OT3) |
| AW6 | **Return report.** "While you were away: meditated 6 hours, Focus +3, a letter arrived" (OT5), one card, dismissible |
| AW7 | **Away is the character living, not frozen.** Hunger, weather and danger can touch away time where the player opted into them (pacing toggles), never silently |
| AW8 | **Only the active life and branch accrues** (OT1, BR6) |
| AW9 | **Away activities as passive skills.** Meditation, patience, Famine-style endurance and similar skills gain XP from away time itself, matching the accepted passive-progression direction |
| AW10 | **Insights while away.** Low-chance discoveries during long away periods (a dream clue, a technique insight), rolled per period, seeded (subtle; ties to research routes) |
| AW11 | **Standing orders.** The character follows simple orders while away (sell surplus, refuse visitors, keep the shop open) using the storylet standing orders (E2 O2) |
| AW12 | **No out-of-game chores.** Away progress needs no external app or check-ins; just leaving the game is enough |

A pure **away ledger** module is being built gate-first
([away-ledger-2026-10-14](gm/dispatch/away-ledger-2026-10-14/GOAL.md)): whole
minutes with carried remainder, a cap with bank or drop, barriers that stop
before events, diminishing gains, clock-back safety. Wiring it into the game
is a separate, later step.

### AB: abstractions this area needs

| Code | Abstraction | What it covers |
| --- | --- | --- |
| AB1 | **Record** | Any authored data unit: start layer, anchor, canon event, change, pocket line, card |
| AB2 | **Requirement and Effect** | One vocabulary for "what must hold" and "what changes" across all records (GE1) |
| AB3 | **Resolver** | Pure functions that turn records plus a seed and time into a result (`resolveStart`, `deriveSnapshot`, `computeAway`) |
| AB4 | **Projection** | Maps resolver results onto the game's real owners (inventory, money, location, knowledge, quests); one adapter per owner (IR2) |
| AB5 | **Clock** | Game time, local world time, loop local time and real time away, with conversions (IR3, v2 `localAt`, away ledger) |
| AB6 | **Knowledge and Lens** | Who knows what (v2 `knowledge`) and how a viewer sees it (player layer, character, cheat grade) (OG3, ICX) |
| AB7 | **Provenance** | Why every fact is what it is (`explainFact`, start provenance) |
| AB8 | **Revision pin and Dormancy** | Content versions per branch, and safe dormancy when content is missing (DV12, BR1) |
| AB9 | **Gate** | A frozen check proven against a scratch implementation before a worker starts (QA5) |

### ICX13+: more cheats that reveal

| Code | Cheat | Shows | Limits |
| --- | --- | --- | --- |
| ICX13 | **Away sense** | What the body did while you were away, in more detail than the report (AW6) | Only own body; dreams for long gaps |
| ICX14 | **Reality index** | Which numbered reality you're in and roughly how it differs (CC3) | Comic and multiverse worlds only |
| ICX15 | **Retcon awareness** | That the past changed (a canon revision applied) and roughly what | Rare, meta; often a curse in-world |
| ICX16 | **Mantle sight** | Who held a mantle before and who's next on its ladder (CC5, LD) | Only for mantles the holder has touched |

### Subtle and overarching notes

- **Subtle:** the away report names one small sensory detail ("the candle burned down to a stub") so away time feels lived (MZ1 style).
- **Subtle:** after a long absence, one NPC remarks on how long you've been quiet (social tell).
- **Overarching:** AB1-AB9 are the same pieces as OG1 (one data spine); new systems should be expressed in them before adding new kinds.
- **Implementation:** away progress, story-world starts and branch changes all meet at the Projection layer (AB4), so that adapter is the real integration cost; the implementation-map lane owns that analysis.

### Round 22 dispatch

- Away ledger code lane (pure module, gate A1-A9 proven against a scratch
  implementation).
- Comics mapping lane: comic features onto starts, anchors, branches,
  identity and cheats, plus a pilot recommendation.

### Round 22 suggestions (separate from the palette)

1. AW1 + AW9: one away activity per life (meditate, study, work) whose skills
   gain XP from away time, starting with the away ledger.
2. AB4 Projection as the next abstraction to design, since every system meets
   there.
3. CC5 mantles as substitute ladders: comics fit the system with almost no
   new machinery.

Return (2026-10-14): the away ledger (`src/away_ledger.js`, worktree branch `codex/start-records`) passed the coordinator rerun of its check (A1-A9, npm 667/0). Not wired into the game yet.

## Round 23: merging and shipping, projection, more cheats (2026-10-14)

Weibao: "more to consider? ... Cheats that would show stuff like these ...
Abstaction thats needed? Merging, commiting or pushing?" Codes: MG (merge and
ship), PJ (projection layer), ICX17+.

### MG: merging, committing and pushing this work

Current state (2026-10-14): two kinds of output exist.

- **Docs and lane records** in the main checkout on `codex/gameplay-foundations`:
  the intro doc, the index, eight research and world docs, five dispatch
  folders, and my appended entries in `USER_VISION.md` and `IDEA_INDEX.md`.
  Those two shared files also carry other sessions' uncommitted edits, so a
  commit must stage only this work's hunks. Run logs are already gitignored;
  book-derived graphs and notes live in the ignored novels folder.
- **Code** in the worktree branch `codex/start-records`: `start_records.js`,
  the probe UI, `anchor_snapshots.js` (v1, overrides, v2), `away_ledger.js`,
  pocket lines, their tests and a 13-line `main.js` change behind the dev
  flag. All gates pass on coordinator reruns; nothing is wired into normal play.

| Code | Consideration |
| --- | --- |
| MG1 | **Commit docs now, on the current branch, by path.** Only this work's files and hunks; other sessions' staged or unstaged edits stay untouched |
| MG2 | **Commit the worktree branch separately.** One commit per lane (start records, snapshots v1, overrides, v2, away ledger, pockets, micro text), dropping the stray `dist/.start-records-original-bundle.js.map` |
| MG3 | **Merge later, after two gates.** Weibao's taste review of the probe in a browser, and the implementation map's staged plan (ownership of `main.js` and `dist/` belongs to Foundation lanes, IR8) |
| MG4 | **Merging is low risk but not free.** The probe is behind a localhost flag, but `main.js` and `dist/bundle.js` are shared files other lanes rebuild; a merge needs a rebuild and the full test and browser pass on the merged result |
| MG5 | **Pushing goes to `origin` (public personal fork).** Tracked docs are paraphrase and original wording only; no raw book text, no sealed truths. Push after commit, never force |
| MG6 | **No Co-Authored-By trailers** (Weibao's standing commit rule) |

### PJ: the projection layer (the abstraction everything meets at)

| Code | Consideration |
| --- | --- |
| PJ1 | **One adapter per real owner.** Inventory, money, location, quests, skills, knowledge, relationships, life record; each adapter turns resolver output into that owner's own API calls |
| PJ2 | **Plan then apply.** Adapters first produce a plan (what would change), validated as a whole, then apply atomically; a failed plan changes nothing (same as the game's existing staged-action pattern) |
| PJ3 | **Reverse projection.** Reading real state back into facts for derivation (is the miller alive?) uses the same adapters in reverse |
| PJ4 | **Namespaces.** Canon facts for a story world live under that world's namespace; only projected facts touch shared owners |
| PJ5 | **Provenance on apply.** Every projected change records its source (start layer, canon event, branch change, away ledger) for `explainFact` and the life record |
| PJ6 | **Test each adapter in isolation**, then one browser save/reload/import gate per adapter that ships |

### ICX17+: more cheats that show hidden structure

| Code | Cheat | Shows | Limits |
| --- | --- | --- | --- |
| ICX17 | **Commitment sense** | Which of your choices just became permanent (a branch change, a fixed point engaged) | A feeling, not a list; system worlds may show a notice |
| ICX18 | **Projection sight** | What a planned action will change before you commit (PJ2 plan view) | Simple actions only; costs focus |
| ICX19 | **Record keeper** | Read your own life record and past lives' records in-world (player layer as diegetic book) | Fits archive or system frames (MP3) |
| ICX20 | **Pocket of time** | Store away time to use later (banked minutes, AW4) | Bank cap; decays slowly in harsh worlds |

### Subtle

- The between-lives screen remembers which tab you looked at last.
- A committed branch change shows a tiny mark in the chronicle the first time, never again.
- The away report never says "you were gone X hours" if the character slept through it; it says what woke them.

### Round 23 dispatch

A micro-text lane applies the probe-only items of the cheapest-twenty list
(MD225-MD234) behind a text lint (length, no em dashes, no repeated openers,
money stated honestly) plus all earlier probe gates. The lint already caught
one real mismatch before work: the farmhand text said "a few coins" for a
layer that adds three.

### Returns since round 22

- [Start micro details](worlds/START_MICRO_DETAILS_2026-10-14.md): 234 MD details (175 pure text or data), cheapest twenty with exact homes.
- [ICX cheat cards](gm/dispatch/canon-events-2026-10-14/cxcards/CX_CHEAT_CARDS.json) and [notes](gm/dispatch/canon-events-2026-10-14/cxcards/NOTES.md): twelve cards in the panel-kit format.

Shipped (2026-10-14): docs commit `2fec408b`; code on `codex/start-records` (`6b8a114b`), merged into `codex/gameplay-foundations` as `554435c9` after all gates passed on the merged result (npm 725/0, browser gates at three desktop sizes); main checkout rebuilt and npm 725/0; both branches pushed to origin. USER_VISION entries for this work remain in the working tree pending another session's de-duplication of that file.
