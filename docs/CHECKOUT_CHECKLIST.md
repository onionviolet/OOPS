# Checkout checklist

Things for Weibao to play, look at or answer: delivered work that still waits on
his check. Swept from the records on 2026-10-20.

This page only points. Each line links its owner record, and the owner keeps the
detail and the current state. [PLAYTEST.md](PLAYTEST.md) stays the acceptance
record; [PROJECT.md](../PROJECT.md) and [USER_VISION.md](USER_VISION.md) keep
priorities and direction. When you accept something, record it in the owner (and
PLAYTEST.md), then tick it here.

**How to read a line.** `- [ ] CKn **name**: how to reach it · what to look for
· state in the record's own words · owner · bot-checkable?`

- **Build:** *HEAD* means committed on `codex/gameplay-foundations`. *Working
  tree* means uncommitted in this checkout. *Branch* means on another branch, so
  it is not in your build. *Probe* means there is no normal-play route.
- **State:** nothing below is human-accepted yet. Agent wording such as
  "technically verified" or "browser-verified" is agent evidence, not your
  acceptance.
- **Bot-checkable:** *yes* means a headless agent can confirm it. *partly*
  means an agent can check the mechanics but the feel and numbers need you.
  *no* means only you can judge it.
- **Sealed secrets:** routes and IDs only. No line here says what a secret is.

## Start here

1. **CK12 + CK13, the combat screen at 1920 (R22b and R22c).** Both are
   merged, but R22c's record asked to be shown to you before merging. R22d
   (Encounter tally, loot this trip) is the recorded next round.
2. **CK24 + CK28, the desktop app.** Run `npm run desktop` and move your Chrome
   save across with Export, then Import. Export before you try Reset in the app.
3. **CK1, M4 lamplight.** It is short, and an agent already pre-ran it, so this
   is mostly feel and price.
4. **CK19, inventory and Around you context (UI A1/A2).** Two everyday
   surfaces in one pass, and the record's only open gate is your look.
5. **CK2, practice (SLL7, SLL11, SLL12).** One panel, three changes, and the
   gains are proposal dials for you to tune.

## A. Play-check gameplay

- [ ] CK1 **M4 lamplight** (HEAD): buy Oil lamp and Lamp oil from the Village trader, use the lamp from Inventory, then go Nearby cave → Cave depths · look for the "about 4h 0m of light" log line, the Suspicious wall route becoming available without a clear, and oil kept when you put the lamp out. Price 250/25, the 240-minute flask and ×1.2 night reading are proposal dials · "implemented … human play OPEN"; acceptance backlog "implemented-unverified". An agent pre-run found nothing broken, but combat and reading effects were not exercised · [modular seams checkpoint, M4 round](gm/dispatch/modular-seams-2026-10-16/CHECKPOINT.md), [acceptance prep](reviews/ACCEPTANCE_PREP_2026-10-19.md) · partly
- [ ] CK2 **Practice: coached, fluency, plateau (SLL7, SLL11, SLL12)** (HEAD): More panels → Notes, practice & people → Practice, on a save that has met the craftsman (and the elder for SLL12) · look for coached timber practice giving double gain for 1 coin and 1 attention, cutting time dropping with uses, plain practice continuing past mastery 4 at a smaller gain, and cards reading "mastery N · U uses" · "implemented and browser-verified; not yet human-accepted" · [skills and learning](SKILLS_AND_LEARNING_CONSIDERATIONS_2026-10-18.md) · partly
- [ ] CK3 **Tools: wear, break, hand repair (IP1-IP3)** (HEAD): More panels → Tools; gather with a tool equipped and durability on; get a hand-repair quote at the Village forge · look for the verb line in the gathering tooltip, wear while gathering, the break log, the improvised fallback, and the repair quote · "Gaps (implemented-unverified)"; "No visual-feel acceptance by Weibao; numbers are proposals" · [IP1-IP3 task record](gm/dispatch/tools-2026-10-17/IP1-3_TASK_RECORD.md) · partly
- [ ] CK4 **Quiet continuation** (HEAD): More panels → Continuing connection → Open your connection · look for Return options, Anchors & study, and opt-in repeat with Stop · "bounded source implemented and browser-verified"; "Director feel acceptance remains OPEN" · [checkpoint](gm/dispatch/quiet-continuation-2026-10-15/CHECKPOINT.md), [report](gm/dispatch/quiet-continuation-2026-10-15/REPORT.md) · partly
- [ ] CK5 **Gear stat dimensions (equipment L2)** (HEAD): equip armor, then open the Attributes inspector · look for Damage taken, Minimum share of a hit and Critical resistance rows, each with an Equipment source, and whether they bite in a real fight · "implemented; combat not exercised in a browser"; native combat damage and save/reload/import stay on the acceptance backlog · [equipment stat dimensions, L2 slice record](EQUIPMENT_STAT_DIMENSIONS_CONSIDERATIONS_2026-10-20.md) · partly
- [ ] CK6 **Gear affixes (equipment L3, not gear-depth L3)** (HEAD): craft a chestplate in the Village at rare-or-better quality, then check the Attributes inspector · look for rows like "Affix Padded (… from its parts)", then save, reload and import. Tooltips do not show affixes yet (ESD11 gap) · "implemented; crafting commit unit-tested only"; "One remaining acceptance gate" is this browser craft. Reload was browser-checked; Export and file import were "not clicked" · [equipment stat dimensions, L3 slice record](EQUIPMENT_STAT_DIMENSIONS_CONSIDERATIONS_2026-10-20.md) · partly
- [ ] CK7 **Defeat publisher (CBL1, CBL3)** (HEAD): Nearby cave → Cave room, lose to wolf rats · nothing new shows on screen, by design; play should feel unchanged. The saved battles need generated fixtures · CBL1 "implemented and browser-verified; not human-accepted". CBL3 says the same, but its own evidence browser-ran only the Lio party battle; sluice and structured death are "implemented-unverified in the browser" · [combat and conflict, CBL1 and CBL3 evidence](COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md) · yes
- [ ] CK8 **Money seam and debug ledger (ECX1, ECL2)** (HEAD, probe): `?test_hooks=1`, then `simulationTestHooks.project('economy')` · check that money behaves exactly as before; the ledger shows one named row per purse change · "implemented and browser-verified; not human-accepted" · [economy and trade, ECX1 and ECL2 evidence](ECONOMY_AND_TRADE_CONSIDERATIONS_2026-10-18.md) · yes
- [ ] CK9 **LOTM Seer slice and meters (LIP3/LIP4, world dials M3)** (HEAD, probe): `?lotm_probe=1` on localhost with a disposable test save opens the Tingen workroom panel · look for decline, ingest, lesson, observe, sleep and recovery; sleep joining native sleep once; the spirituality and strain bars and their hover text · the phases are "Observed"; Export is "Implemented-unverified"; "Weibao's visual acceptance still open (UR16)". The meters record says "Not verified: pixel appearance …" and "Taste unaccepted" · [LOTM plan, native join section](gm/LOTM_INITIATION_IMPLEMENTATION_PLAN_2026-10-15.md), [world dials, M1 and M3 results](WORLD_DIALS_AND_INTERPRETER_CONSIDERATIONS_2026-10-19.md) (working tree) · partly
- [ ] CK10 **Herbal experiments crafting (M3)** (HEAD): More panels… → Herbal experiments · gather, craft, drink under an unknown projection, then compare recovery against no dose · "GR12's integration gate is met at this level; human visual/play acceptance remains separate". The outcome text departs from BHR25 (noted in the record) · [modular seams checkpoint, M3 resume](gm/dispatch/modular-seams-2026-10-16/CHECKPOINT.md) · partly
- [ ] CK11 **World1 campaign C01/C02** (HEAD): install the private companions p09 and p10, then Layout → Panels → Open Your beginning → Begin (route as recorded before R21 moved Layout into Menu) · route and gate state only here; the reports say what each checkpoint covers · "Full World1 S00–S14 remains OPEN"; "Fiction, numbers and pacing await" you · [World1 checkpoint](gm/dispatch/world1-full-completion-2026-10-11/CHECKPOINT.md), [C01 report](gm/dispatch/world1-full-completion-2026-10-11/campaign/c01/REPORT.md) · no

## B. UI and presentation

- [ ] CK12 **Screen use at 1920 (R22b, with R20's opponent board)** (HEAD): start a fight, ideally 8 mixed opponents · look for the Opponents panel beside the actions, one hue per opponent kind on the board and in the log, a narrower You, and the compact status window (Comfortable lives in Appearance) · "Candidate, technically verified; Weibao's visual/play acceptance stays OPEN (UR16)" · [R22b report](gm/dispatch/ui-foundation-2026-10-15/R22B_REPORT.md), [R20 report](gm/dispatch/ui-foundation-2026-10-15/R20_REPORT.md) · no
- [ ] CK13 **Names over letters, Target and Encounter, inventory color (R22c, with R18's tabs)** (HEAD): in a fight, hover a combat line, and check Target and Encounter at top centre; when idle, select an item; check the Appearance → Opponents → Opponent letters toggle · look for names on rows and log lines, the item detail beside the actions, colored inventory tabs and the yellow "new" tag · "Candidate, technically verified; Weibao's visual/play acceptance stays OPEN (UR16)"; FC3 is "implemented-unverified in a real fight with Stances" · [R22c report](gm/dispatch/ui-foundation-2026-10-15/R22C_REPORT.md), [R18 report](gm/dispatch/ui-foundation-2026-10-15/R18_REPORT.md) · no
- [ ] CK14 **Combat log wording (R22)** (HEAD): a fight with 3 or 8 opponents, then the Reports column; click ×N · look for "hits you for" wording, the dealt and taken colors, muted misses and the defeat line · "Candidate, technically verified; Weibao's visual/play acceptance stays OPEN (UR16)" · [R22 report](gm/dispatch/ui-foundation-2026-10-15/R22_REPORT.md) · no
- [ ] CK15 **One bar, control box, layout editing (R21)** (HEAD): Menu → Layout → Edit layout → Move to, then Reset this layout; type your name in the You header; Options tab beside Actions · look for one top bar and no bottom bar, and the control boxes in the Inventory and Reports headers · "Visual and play acceptance (yours)" · [R21 report](gm/dispatch/ui-foundation-2026-10-15/R21_REPORT.md) · no
- [ ] CK16 **New game without the hero panel (R21b)** (HEAD): start a new game; the Beginning card sits under PLAY · look for no hero panel, the default name "Hero" and the first-start log line · "technically complete …, visual acceptance open" · [R21b report](gm/dispatch/ui-foundation-2026-10-15/R21B_REPORT.md) · no
- [ ] CK17 **Status window home (R21c)** (HEAD): an awakened save; the window sits in the You box under the stat sheet · look for it after awakening, nothing before, and no page scroll · open: "Weibao's visual check (UR16)" · [R21c report](gm/dispatch/ui-foundation-2026-10-15/R21C_REPORT.md) · partly
- [ ] CK18 **UI Round 12: palette, row menu, sections** (working tree): Ctrl/Cmd+K or Find in the bar; right-click, the Menu key or Shift+F10 on a row; double-click a divider; Settings → Text size and Contrast: High; change badges on Quests, Bestiary and Books; Known things, Loadouts, Statistics, Today, Where I am and Companions in More panels · look for each working with no placeholders. Loadouts add a new save slice · "Human play acceptance is still open"; a real Ctrl+K keypress was "Not exercised" · [UI at scale, Round 12](UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md) · partly
- [ ] CK19 **Inventory and Around you context (UI A1/A2)** (HEAD): select an item in Inventory (detail opens below, with Close item); in Around you, select a person or station, use a service, then Back or Esc · look for a narrower, kind-colored Inventory and nearby context kept through service use · "integrated candidate complete for technical review; human visual/play acceptance OPEN" · [A1/A2 checkpoint](gm/dispatch/ui-foundation-2026-10-15/next-parts/GRIPES_A1_A2_CHECKPOINT.md) · no
- [ ] CK20 **You controls, weather, status effects (UIL8 round 2)** (build not confirmed): the You panel's Attributes and Gear row, the weather in the place header, and the Condition effects list (inspect, pin, Esc) · look for Attributes and Gear aligned, temperature and comfort shown once, and Cold still shown on its own · "Visual acceptance stays OPEN (UR16)" · [UIL8 report](gm/dispatch/ui-foundation-2026-10-15/next-parts/UIL8_REPORT.md) · no
- [ ] CK21 **Calmer Vivid** (route as recorded 2026-10-14, before R21): the Vivid presentation; Bestiary and Anthology tabs appear once records are earned; hotkey forms sit behind a toggle beside each item · look for a quieter hierarchy. This predates the parity shell default, and its current route was not traced · "Weibao's visual-feel acceptance is open" · [calm-vivid report](gm/dispatch/calm-vivid-2026-10-14/REPORT.md) · no
- [ ] CK22 **Loading screen credit and OOPS branding** (HEAD): reload the page and watch the loading screen · look for "Inspired by Yet Another Idle RPG by Miktaew and Proto23 by 23html", both linked, under the subtitle · "desktop 1920x1080 checked headless"; "Visual taste acceptance remains with Weibao" · [USER_VISION, loading screen inspirations](USER_VISION.md), [OOPS branding review](reviews/OOPS_BRANDING_2026-10-16.md) · partly
- [ ] CK23 **Mockup workbench studies**: `node prototypes/workbench/build.mjs`, then its `serve.mjs` · compare the saved studies · "Weibao's visual and interaction preference for each study remains open" · [workbench report](../prototypes/workbench/REPORT.md), [mockup system](MOCKUP_SYSTEM.md) · no

## C. Desktop app

- [ ] CK24 **Desktop app first run** (HEAD): `npm run desktop` builds and opens the app · look for the window at up to 1920x1080, the game clock running while minimized, and help and changelog staying in the app · the smoke check "PASS on this Mac" ran on a hidden window; "Not exercised: real Export through the native save dialog …, minimized ticking rate" · [Electron host, first slice](ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md) · partly
- [ ] CK25 **Reset, Load backup and Import other release in the app** (HEAD): Export first, then try Reset in a visible window · look for a small modal: cancel keeps the save, typing "reset" clears and reloads · verified hidden; "Status for visible windows: implemented-unverified. Export before a Reset until he has seen it work." One on-screen run reloaded but kept the save · [Electron host, on-screen checks](ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md) · no
- [ ] CK26 **INACTIVE mode** (HEAD): `YAIRPG_INACTIVE=1 npm run desktop` · look for the window opening without taking focus, with a Dock icon you can click · "verified once on screen"; the EL27 row still reads "INACTIVE Dock behavior implemented-unverified" · [Electron host, never take the foreground](ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md) · no
- [ ] CK27 **Idle clock while covered or minimized** (HEAD): leave the app minimized for about 10 minutes and compare game time · look for slowdown from App Nap · EL35 "LATER: measure first"; minimized ticking rate not exercised · [Electron host, EL35](ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md) · partly

## D. Saves and persistence

- [ ] CK28 **Move your Chrome save into the app**: Export in Chrome, Import in the app · the app is a new origin and starts empty; the Chrome save is untouched · recorded "Save compatibility decision"; no record says the move has happened · [Electron host, first slice](ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md) · no (your save is private)
- [ ] CK29 **Old saves may reset instead of migrate** (awareness): current work "may reset or drop old-save state rather than migrate it". Expect this when loading older saves, for example affix-less armor loads plain · "Dial: revisit before any release or when he asks" · [USER_VISION, old save compatibility deferred](USER_VISION.md), [PROJECT accepted decisions](../PROJECT.md) · no
- [ ] CK30 **Save size and write rate**: no action unless a save warning appears ("Export your save to a file before continuing") · save size "stays far under the 4 MiB guard", but the crowded fixture writes 34,103 KB/min against a 25,500 budget · [P1 baseline](reviews/P1_BASELINE_2026-10-19.md) · yes
- [ ] CK31 **Harness save notes PTF1-PTF3** (working tree): first load adds about 750 default fields; a quest task status appears only after a reload; a new save's reload appends a second "life begins" memory · recorded as notes to triage, not failures · [AI playtest harness](AI_PLAYTEST_HARNESS_CONSIDERATIONS_2026-10-20.md) · yes

## E. Agent and tooling deliveries

- [ ] CK32 **AI playtest harness, first slice (PT45)** (HEAD e5459c565, unpushed): `node scripts/playtest/run.mjs --self-test` · a scripted bot with four gap detectors and fault injection · "DONE and verified on 2026-10-20"; the ranked next steps are a proposal · [harness doc](AI_PLAYTEST_HARNESS_CONSIDERATIONS_2026-10-20.md), [scripts/playtest/README.md](../scripts/playtest/README.md) · yes
- [ ] CK33 **Frozen player build (EL18) and hang guard (EL46)** (HEAD 09fe5e36d to bab1dda77, unpushed): `npm run desktop:snapshot`, then `npm run desktop` · the "New build ready" notice and recovery page; hidden checks pass, not yet seen in a visible window; the owner row still says "LATER" · [Electron host, agent access](ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md) · yes
- [ ] CK34 **Perf gate baseline (P1)** (HEAD): `node scripts/perf/gate.mjs --base <commit>` · "The standing gate reports FAIL, from budget drift" (5 of 26 checks); "Decision for Weibao: none needed" · [P1 baseline](reviews/P1_BASELINE_2026-10-19.md), [perf README](../scripts/perf/README.md) · yes
- [ ] CK35 **Domain rules conformance scan** (HEAD): read the doc · 16 rows, 2 fixed; "DRC10's visible button not browser-checked (implemented-unverified)" · [conformance scan](audits/DOMAIN_RULES_CONFORMANCE_2026-10-19.md) · yes
- [ ] CK36 **World pack loader and Cyoria from book.mol (P2)** (HEAD, probe): there is no player route yet ("No browser journey into Cyoria itself") · content exports are hash-identical; "Gaps (implemented-unverified)" · [P2 checkpoint](gm/dispatch/world-pack-p2-2026-10-19/CHECKPOINT.md), [loader checkpoint](gm/dispatch/world-pack-loader-2026-10-16/CHECKPOINT.md) · yes
- [ ] CK37 **Engine A1 ability conditions and A2 claims** (HEAD): engine only, fixture tests · "Gaps (implemented-unverified for play)"; save is a JSON roundtrip, "not native Save/Import" · [shounen manga considerations](research/reincarnated-in-a-shounen-manga/YAIR_CONSIDERATIONS_2026-10-16.md) · yes
- [ ] CK45 **World subtle gaps sweep** (working tree): read [the audit](audits/WORLD_SUBTLE_GAPS_2026-10-20.md) · one subtle missing aspect per world (WG1-WG26) and four cross-world patterns; levels quoted from records, none above C1 · proposal · bot-checkable: each WG row has a done check meant for the harness

## F. Open decisions waiting on you

Only items whose record says your answer is pending.

- [ ] CK38 **Menu as the home for Authoring and Layout; Options drop-downs** (R21): "is Menu the right home for Authoring and Layout?" and "are the group drop-downs where you meant?" · [R21 report](gm/dispatch/ui-foundation-2026-10-15/R21_REPORT.md) · no
- [ ] CK39 **Age, gender and height on the Beginning card** (R21b): "whether age, gender and height should show anywhere" · [R21b report](gm/dispatch/ui-foundation-2026-10-15/R21B_REPORT.md) · no
- [ ] CK40 **Around you subject actions S1-S4**: "ready to brief; not authorized to build until Weibao says go" · [S1-S4 packet](gm/dispatch/around-you-2026-10-18/S1_S4_PACKET.md) · no
- [ ] CK41 **World pack visit in game (WPL8a)**: the proposed next playable step needs your go-ahead · [loader checkpoint](gm/dispatch/world-pack-loader-2026-10-16/CHECKPOINT.md) · no
- [ ] CK42 **Round 12 sections as routes**: "Weibao's play acceptance and any promotion of a section to a route remain his call"; per-activity counters need a save decision · [UI at scale, Round 12](UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md) · no
- [ ] CK43 **RS26 shounen slice**: you said to build it "once the current UI lane merges and I've played it"; it is "queued, not started" · [shounen manga considerations](research/reincarnated-in-a-shounen-manga/YAIR_CONSIDERATIONS_2026-10-16.md) · no
- [ ] CK44 **Who reads the new gear stats**: equipment doc asks "whether the party and village duel models should read the new dimensions too". Gear-depth doc asks the "build order among L1, L3 (heat grade …) and L7, and whether enemies read the new dimensions (GDP38)". Gear-depth L1 and heat-grade L3 are already built on unmerged branches (`claude/trusting-hamilton-9e04c1`, `claude/interesting-ritchie-0389d6`), so they are not in your build · [equipment stat dimensions](EQUIPMENT_STAT_DIMENSIONS_CONSIDERATIONS_2026-10-20.md), [gear depth](GEAR_DEPTH_BLACKSMITHING_CHEMISTRY_ENERGY_POWERS_CONSIDERATIONS_2026-10-20.md) · no

## Older backlog

These older deliveries still lack your play or director acceptance. Their scope
and gates live in [PLAYTEST.md](PLAYTEST.md); start from these sections:

- Absorption A/B, 2026-10-11 (A through E and Phase 4: Motherwood, housing, amulets, bread, Fort, hunger and weather, gear copies, affinity capes).
- Optional book world 1 first-slice proof, 2026-10-09 ("Proposal awaiting director fiction/balance acceptance").
- Village choices verification, 2026-10-09 (no director fiction or balance acceptance yet).
- Four-game home-world absorption, 2026-10-07.
- Reference gameplay wave, 2026-10-06, and the 2026-10-05 feature, skills and frontier waves (implemented-unverified).
