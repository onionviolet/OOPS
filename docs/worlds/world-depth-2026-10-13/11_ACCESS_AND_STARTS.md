# K. Accessing worlds, starts, AUs and copies (proposal, 2026-10-13)

Weibao (2026-10-13): "more to consider? save accordingly Different starts, other
stuff and more? Accessing such mechanics and more?"

This part covers **how the player reaches** everything the earlier parts
describe: worlds, start shifts, AU and parallel copies, relationship flips,
depth tiers, heirs and loops. Everything is a proposal palette, not a spec or
an accepted decision. Defaults come with a dial and an in-world reason and cost.

**Already owned, not repeated here:** ST1 to ST13 and PW1 to PW13 (part 06), AK1
to AK7 (part 08), QK1 to QK12 (part 09), DT0 to DT9 (part 10), EI1 to EI11 and
BO1 to BO10 (part 07); branch start modes B1 to B4 and return routes R1 to R4
(`docs/TIMELINES_AND_DIVERGENCE.md`); start axes P1 and selector policies P3
(`docs/STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md`); origin scenario families
(`docs/worlds/ORIGINS_AND_WORLD_TIMELINES.md`); spoiler-safe random starts
(`docs/WORLD_COMPLETION_STANDARD.md`); fourth-wall reach R0 to R7 and title
screen memory (`docs/PRESENTATION_AND_FOURTH_WALL.md`); the accepted heir rule
(`docs/RULES_FROM_SCRATCH.md` "The heir"). Earned options and cheat acquisition
belong to the parallel lane, **earned options (M)**; UG below keeps to access
gating and the sandbox path.

Sealed secrets: none revealed. IDs referenced only: HP-SEAL-1, DND-SEAL-1,
QLM-R1 (route and status only). A Soldier's Life examples are design-only; that
world's build slices stay held until Weibao resumes it (PROJECT.md, part 07 note).

## What exists in code today (source-read, not browser-checked)

| Code | Seam | What it does today | Access gap it shows |
|---|---|---|---|
| X1 | `src/main.js:8054-8060`, `src/character_creation.js:15-84` | First launch: PLAY button, then a hero panel with name, race (default, kemonomimi, furless groups) and height. Nothing else. | No world, era, position, premise or randomness choice at start. |
| X2 | `src/main.js:8019-8029` | After creation every run starts at Village with 102 money and the "Lost memory" quest. | Home world is hard-wired as origin, against the accepted "home is a relationship" rule (`RULES_FROM_SCRATCH.md` "The home world"). |
| X3 | `src/content_pack_ui.js:3-46`, `src/main.js:1090-1110` | "Optional worlds" panel: one "Visit <title>" button per pack, entered only from an idle Village; "Return to Village" leaves. | Access is a list of doors, with titles visible before discovery. No era, start or copy choice. |
| X4 | `src/structured_pack_runtime.js:36-47`, `src/main.js:1053-1077` | Typed starts: a pack with `starts[]` picks one by the saved RNG, writes a durable pending selection, then begins. Requires Village and `worldId==='base.frontier'`. | A real random-start seam with commit-before-publish. Gated to frontier origin and one pick, no player-facing choice or preview. |
| X5 | `src/foundation_start_content.js:53-57`, `src/local_livelihood_content.js:100` | Two start bodies (paired or single hand) per pack, authored as data. | Start variants already work as data rows; the picker is the missing part. |
| X6 | `src/book_world_mol_host.js:33`, `src/book_world_paradise_actions.js:62` | MoL and Paradise are reached by a Village "read the chart/terms" action (Paradise needs `village.elderMet`), then a guest entry. | The in-world door pattern exists. Every door sits in one village. |
| X7 | `src/expansion_engine.js:142-143`, `src/world_instances.js:108-111` | One active retained-world visit; world clocks only support `absence:"freeze"`. | Parallel live copies and running absent worlds need the BO10 migration. |
| X8 | `src/life_experience_host.js:8-24`, `src/chronicle_ui.js:56-60,120-121`, `src/main.js:8170-8176` | `buildLifeHeirSave` exists; the chronicle panel is created without `beginHeir`, so the heir button stays hidden. Old "fresh body, one lesson" text remains. | Heir access is built but unwired, and its copy contradicts the accepted heir rule. |
| X9 | `src/main.js:4815-4817`, `docs/worlds/proving-ground/WORLD_BRIEF.md:20` | Dev detection is a URL match for the upstream dev site; the Proving Ground "dev face" is a doc-only debug-flag idea. | No local sandbox or test-any-start path for Weibao. |

## 1. Access routes (AC)

Each route says when it fits, its cost, what it reveals and what it hides.
Routes compose: a storyteller offer can lead to a door that needs an item.

| Code | Consideration | Why it matters |
|---|---|---|
| AC1 | **New-game picker.** Fits a fresh run or a new save slot. Cost: none in fiction (a menu pick is not a power, per TIMELINES "player's choice versus character's power"). Reveals: world titles and public era labels already unlocked for this profile (UG). Hides: start outcomes, sealed variants, unvisited worlds' names until UG opens them. | The cheapest route and the one X1 lacks entirely. Keeps menu choice separate from what the character knows. |
| AC2 | **In-world door or route.** Fits a living character with a place that leads somewhere (X6's chart pattern, a station, a wardrobe, a gate). Default: doors live in fitting places across worlds, not one village. Dial: one hub of doors (Paradise style) for worlds that have hubs. Cost: travel time, fare, carrier capacity, danger. Reveals: the door and its rumored far side. Hides: what era or copy is behind it until crossing. | Turns access into play. Lifts the "everything from Village" pattern in X3 and X6. |
| AC3 | **Death or reincarnation.** Fits worlds whose cosmology carries a soul onward. Cost: the old body and anything unwritten (heir rule). Reveals: the new body and immediate surroundings. Hides: where and when until the character learns it. Dial: blind, hinted, chosen (ST12 envelopes). | Makes death an access route instead of only an end. The P2 "run" scope already permits it. |
| AC4 | **Heir.** Fits a life that ended with something left behind. Cost: you play someone else, with only what was really left. Reveals: the will, the house, who remembers. Hides: what the heir's own family thinks of the dead. Default: same world and branch (B2 successor). Dial: an heir in another world where the bloodline traveled. | X8 says the code is nearly there. The cheapest new route by far. |
| AC5 | **Loop reset.** Fits loop worlds (MoL, and Circle of Inevitability by its own rules, general knowledge). Cost: everything the loop does not carry; the loop's own price. Reveals: the anchor moment again. Hides: whether this loop is the same as the last (PW3 tells). | Access to "the same start again" with a reason. Separate from player reloads. |
| AC6 | **Cheat or system grant.** Fits a character holding a carrier that moves people (a travel cheat, a summons contract). Cost: the cheat's own price (CHEAT_COSMOLOGY). Reveals: what the system shows, in its voice. Hides: anything the system would not know. How the cheat is earned belongs to earned options (M). | Gives cheats a concrete job in access. Keeps the system's view partial. |
| AC7 | **Storyteller offer.** A narrator, patron or hub keeper offers two or three doors with fogged labels ("a school in a wet country, a year before trouble"). Fits hub worlds and between-life rests. Cost: a favor owed, or the keeper's attention. Reveals: public-level blurbs. Hides: canon names until arrival. | A spoiler-safe "choose from a few" without a full catalog. Uses the M1 to R3 meta tiers. |
| AC8 | **Dream or projection.** Fits worlds with dream travel (realm traveler mode `projection` exists in `src/realm_traveler_profiles.js:5`). Cost: the body left behind sleeps and is vulnerable; nothing physical crosses by default. Reveals: a taste of the place. Hides: whether the dream is the canon copy or another. | A cheap preview route: see a world before committing a body. |
| AC9 | **Item or carrier.** A key, map, portkey-like object, or a book that opens on its world. Fits any world that lets objects travel. Cost: the item is used up, held, or tracked by someone. Reveals: the item's own label. Hides: the destination era until used. Dial: reusable items wear (PW11 friction). | Lets loot and gifts open worlds, which makes exploration feed access. |
| AC10 | **NPC invitation.** Someone asks you to come along (a recruiter, a relative, a guild). Fits relationship play. Cost: you arrive bound to their plans and reputation. Reveals: what they choose to tell. Hides: their motive. Example: a D&D adventuring party invites you to Phandalin (general knowledge for the module). | Relationships become doors. Matches QK9 "who recruits you first" without repeating it. |
| AC11 | **Notebook entry.** Reading or confirming a fact in the Notebook opens a route ("you now know where the station goes"). Fits investigation worlds. Cost: research time. Reveals: the route only. Hides: what is past it. | Knowledge as a key. X6's "read the chart" already does this; generalize it. |
| AC12 | **Achievement or discovery unlock.** A profile-level record that a start type exists (e.g. "you have seen a loop start"). Fits starts that would spoil if shown early. Cost: none in fiction; this is profile memory. Reveals: the start's public label in the picker. Hides: its contents. | Lets the picker grow without spoiling. See UG for the dial. |
| AC13 | **Sandbox, creative or debug access.** A local-only mode for Weibao to open any world, start, copy or tier, label everything, and keep the result out of normal saves. Cost: runs here make no branches and grant no profile unlocks by default. Reveals: everything, so it sits behind an explicit toggle with a warning. Hides: nothing, which is why it needs a separate slot. | The testing path the brief asks for. Extends the Proving Ground dev face idea (X9). |
| AC14 | **Summons by another.** A canon or NPC ritual pulls the character in (D&D planar binding, HP-style portkey trap; general knowledge for both franchises). Fits worlds where summoning exists. Cost: you arrive in someone else's circle with their claim on you. Reveals: the summoner. Hides: why you. | An involuntary route that starts a run with a hook and an obligation. |
| AC15 | **Fall-through or accident.** A failed crossing, wrong train, collapsed ward. Fits hubs and unstable copies. Cost: wrong destination, damaged cargo. Reveals: only what you can see. Hides: which copy you are in (ST7 unaware start uses this as its cause). | Gives random access a fictional cause instead of a menu dice roll. |
| AC16 | **Inherited route.** A door the previous life found, recorded in its notes, opens for the heir. Cost: the heir has to reach the door. Reveals: the note's claim, which can be wrong. Hides: changes since the note was written. | Joins heir and door routes. A rich writer-life leaves a richer atlas. |
| AC17 | **Return-to-canon route.** From an AU or branch, a route back to a canon copy (R1 to R4 in TIMELINES). Access-side addition: a picker shortcut "start canon again here" that is always shown once a world is unlocked. | Keeps canon reachable without hunting for it. |

## 2. Unlock and gating (UG)

Default stance: soft gates with in-world reasons, a profile memory of what
exists, and a free path for testing. Earned options themselves are in M.

| Code | Consideration | Why it matters |
|---|---|---|
| UG1 | **Open at first launch.** Default: the home frontier, one canon start per priority world that has a playable slice (today MoL and Paradise via doors, X6), and "Surprise me" across those. Dial: everything open from the start. Reasonably: first-launch choice should exist even before any discovery. | X1 offers no world choice at all. A short real list beats an empty or overstuffed one. |
| UG2 | **Unlocked by play.** Reaching a place, meeting a person, or finishing a canon arc adds its era starts and positions to the picker. Default: per profile, not per save. Dial: per save, for a stricter "earn it this life". | The picker grows with what Weibao has seen, so its labels stop being spoilers. |
| UG3 | **Unlocked by discovery.** A Notebook fact or found copy-tell (PW3) adds a fogged entry ("another version of this city exists"). Its name and contents stay sealed until visited. | Copies and sealed variants appear in the menu only as earned unknowns. Matches the sealed-secret rule. |
| UG4 | **Unlocked by prestige or another life.** Ending a life, raising an heir or closing a loop opens starts that need that history (successor B2, ghost replay B3, "after canon ends" ST3). | Gives prestige a concrete access payoff beyond numbers. |
| UG5 | **Soft walls instead of hard walls.** A locked start shows "not yet known to you" and its in-world route ("someone in Cyoria knows about this"). Dial per world: hidden fully, fogged, or open. Reasonably: a determined player can always find a path; nothing is locked forever by default. | Keeps "everything possible, reasonably" while still pacing discovery. |
| UG6 | **Per-world unlock dials.** Each world declares which axes start open: eras, positions, bodies, premises, copies. Example: HP open eras could default to the canon school years only, with earlier eras opening by finding a family history (general knowledge for era span). | Each world paces its own spoilers. A data field, not code per world. |
| UG7 | **Gate by fit, not by power.** A start can need a supporting body or source (X4 checks `admission.forms` and `lifeStages`). Show the reason ("this start needs a human adult body") and the fix. | Reuses an existing check and turns a silent error into a readable gate. |
| UG8 | **Unlock receipts.** Each profile unlock stores what opened it and when. The picker can show "opened by: finishing the Goa fire". Dial: hidden. | Weibao can see why the menu grew, and agents can debug gating. |
| UG9 | **No account-wide loss.** Unlocks persist even if the save that earned them is deleted or reset. Dial: tie unlocks to saves for a hardcore profile. | Stops a reset from erasing the menu, which would punish experiments. |
| UG10 | **Free sandbox path (Weibao as tester).** A toggle in settings, local only, that marks the save as sandbox: every world, era, copy, premise and depth tier is pickable; the header carries a "sandbox" stamp; nothing it does writes profile unlocks, branches or achievements unless exported on purpose. | The single most useful testing route, and it keeps play and test separate. |
| UG11 | **Sandbox spoiler guard.** In sandbox, sealed truths still show by ID only unless an "unseal" switch is used, and the switch names the secret ID before opening. | Weibao plays too; a tester view should not spoil by accident (AGENTS.md sealed secrets). |
| UG12 | **Content readiness gate.** A start appears only when its pack loads and its depth tier is at least T2 (one usable verb, DT2). Lower-tier starts show in sandbox with their tier label. | Stops the picker from offering starts that do nothing, while letting tests reach them. |
| UG13 | **Missing-pack behavior.** A saved run whose pack is gone pauses with an export button (already done in `src/main.js:8034-8040`); the picker greys that world with "content not installed". | The pattern exists; reuse it for the picker. |

## 3. Start menu and selection UI (SM)

Target: desktop or laptop at 1366x768, 1440x900 and 1920x1080 (standing UI
priority, `docs/USER_VISION.md`). Mobile is deferred.

| Code | Consideration | Why it matters |
|---|---|---|
| SM1 | **Today versus gap.** Today: name, race, height (X1), then a fixed Village start (X2). Gap: world, era, position, body, premise, copy, randomness and preview. | Names the starting point honestly so the first slice stays small. |
| SM2 | **Wide three-column picker.** Left: worlds (unlocked, fogged, sandbox-only). Middle: start cards for the chosen world, grouped by era (EI4) and position (ST2). Right: the selected card's detail with "unknown to you" fields (ST12) and its dials. Uses full width, no stacked scrolling. | Fits the standing desktop priority and lets three decisions stay visible at once. |
| SM3 | **Dial row per start.** Compact controls under the card: era nudge, position, body, premise (AK1), relationship flip (AK2), randomness (fixed, weighted, wild), knowledge envelope (blind, hinted, full). Each shows its default and resets in one click. | One place for every dial instead of a wizard. Defaults keep the quick path quick. |
| SM4 | **Canon versus AU labeling.** A small tag on every card: "Canon", "AU: <public premise>", "Branch: <your branch name>", or "Unknown variant" for sealed ones. Color and glyph, not color alone. | Weibao always knows what kind of copy he is entering, without learning sealed content. |
| SM5 | **Spoiler-safe unknowns.** Fogged rows show shape, not content: "a later era (locked)", "a different version of this world exists". Hover gives the in-world route that opens it (UG5). | Keeps the catalog honest about size without naming spoilers. |
| SM6 | **Presets.** Named start bundles per world: "Canon, as written", "Quiet life", "Hard mode", "Strong visitor" (ST11), "Mystery" (blind envelope). Users can save their own. | One click for common setups; saved presets become Weibao's favorites. |
| SM7 | **Surprise me, with filters.** A button that picks across unlocked starts using a P3 selector (equal per world, then local). Filters: tone, danger, life stage, "no sealed variants". The result is a card to confirm, with one reroll that is logged. | Random starts with consent and a visible distribution, matching the completion standard. |
| SM8 | **Recent and favorite starts.** A strip of the last five starts and starred ones, each with its dial values. "Start again like this" copies the dials, not the old run's state. | Fast iteration for Weibao as tester and player. |
| SM9 | **Preview without rerolling.** Inspecting a card does not roll anything. The random parts are committed only on Begin (X4's durable selection already works this way). | Matches the existing commit rule and the completion standard. |
| SM10 | **Copy plan receipt on confirm.** Before Begin, show what this start copies, resets and carries (QK11) and the save impact ("new slot", "branches from slot 2"). | Prevents surprises about what the run inherits. |
| SM11 | **Keyboard and focus.** Arrow keys move across columns; Enter begins; Esc backs out. Focus survives filter changes. | Desktop-first, and the existing panels already care about focus (`content_pack_ui.js`). |
| SM12 | **Start card art in text.** A short ASCII or glyph scene per card (PRESENTATION "ASCII scenes"), with the world's V6 tint as a thin frame. | Gives each start a look without image assets. |
| SM13 | **Picker as a world, too.** Dial: the picker is diegetic in hub worlds (a Paradise contract desk, a storyteller's table), plain elsewhere. Same data behind both. | Lets presentation vary without a second selector. |
| SM14 | **Title screen memory hook.** After a big ending, the picker's background or tagline changes (PRESENTATION R4 title memory). | Cheap continuity that makes the menu feel lived in. |

## 4. Different starts, more kinds (DS)

Kinds not already in ST, AK, QK, ORIGINS or the P1 axes. Each names the access
route and one priority-world example. Franchise facts are general knowledge.

| Code | Consideration | Why it matters |
|---|---|---|
| DS1 | **Retired start.** Begin as someone who already finished a career (a retired auror-type, a veteran adventurer). Route: picker (AC1) or heir of a retiree. HP example: an aging shopkeeper in Diagon Alley who once worked for the Ministry. | Tests "late-game life is still worth living" from minute one. |
| DS2 | **Dead and returning.** A ghost, revenant or returned soul who knows the place but not the present. Route: death (AC3) in the same world. HP example: a Hogwarts ghost-like start with limited verbs (haunt, advise, remember), general knowledge that HP ghosts exist. | A body with odd limits and lots of stale knowledge (PW7 copy confidence fits). |
| DS3 | **Institution start.** Play a shop, guild hall, school house or garrison rather than a person, then pick a person later. Route: picker. D&D example: run the Stonehill Inn's ledger in Phandalin (general knowledge for the module). | Different from ST9 household: the unit is an institution with staff, rules and clients. |
| DS4 | **Already-in-world NPC.** Take over a minor named NPC already in a pack, with their schedule, debts and relationships as they are. Route: picker after you have met them (UG2). MoL example: a Cyoria worker you met as a visitor (X6's house cast). | Reuses authored people. Their regard values become your relationships. Role-only by default per ORIGINS. |
| DS5 | **Antagonist's household.** Not the villain, but someone who lives under their roof (a servant, an apprentice, a child). Route: picker or invitation (AC10). TTKS example: a staffer at a hostile settlement (ties into TT rows; source detail per the TTKS notes). | Sees canon from the other side without the "enemy-side" faction framing of QK6. |
| DS6 | **Creditor start.** You are owed, not owing: someone canon owes you money or a favor. Route: picker. A Soldier's Life example (held world): a quartermaster's clerk holding a debt over an officer. | The reverse of ST10 obligations. Pulls you into canon through leverage. |
| DS7 | **Notorious start.** Begin with a reputation already set, good or bad, that is not deserved by anything you did. Route: picker or heir. LOTM example: a lodger mistaken for someone wanted in Tingen (general knowledge for the city). | Reputation as a starting resource. Reuses the reputation system once its region throw is fixed (part 07 BO10). |
| DS8 | **Witness start.** Begin as the only person who saw a canon event go differently in a copy. Route: ST7 unaware copy plus AC15 accident. Ties into a sealed variant route by ID (e.g. QLM-R1). | A start whose first goal is to prove what you saw, not to fight. |
| DS9 | **Caretaker of a canon child.** Look after a young canon figure before their story starts. Route: invitation or picker. HP example: a neighbor who babysits on Privet Drive-like streets (general knowledge, setting only). | Low-power start with heavy long-term influence. Differs from PHP household AUs by being an outsider with a duty. |
| DS10 | **Visitor from a run you already played.** Start a new life where your previous character is now a local legend or NPC (B3 ghost seen from outside). Route: UG4 after a life ends. MoL example: a new visitor hears stories of your last Cyoria life. | Continuity across runs without carrying power. |
| DS11 | **Body-swap start.** Two characters, one of them yours, wake in each other's bodies. Route: cheat grant (AC6) or a world's own magic. HP example: a failed Polyjuice-style mishap (general knowledge). | A body and social-role mismatch inside one world, cheaper than a full new origin. |
| DS12 | **Split start.** Play two linked characters in two worlds or copies, switching between them; one idles while the other acts. Route: picker, sandbox, or a twin-soul cheat. Shadow Slave example: a waking-world self and a dream-realm self (general knowledge for the premise). | A co-op-style start for one player that uses idle play for the paused half. Needs EI6 and EI8 for two live instances. |
| DS13 | **Rumored start.** You begin knowing a rumor about yourself that may be false (heir of someone, chosen of something). Route: picker with blind envelope. D&D example: told you are a noble's lost child in Neverwinter (general knowledge). | Gives a story hook whose truth is decided by world rules, not the menu. |
| DS14 | **Post-loop start.** Begin right after a loop ended for someone else, in the world they left. Route: UG4 after the MoL arc. MoL example: the month after the loop ends, from a Cyoria resident's view (general knowledge that canon ends the loop). | A distinct "after" start for loop worlds, separate from ST3 epilogues. |
| DS15 | **Paperwork start.** Begin at a desk that decides who enters (gate clerk, registrar, recruiter). Route: picker. TTKS example: the gate shift (BO5). | Lets the player control access for others, which mirrors this whole topic. |
| DS16 | **Pet or familiar start.** Begin as an animal companion bound to a canon or generated person. Route: picker or familiar summons. HP example: an owl or cat with a limited verb set (deliver, notice, steal). | Uses the nonhuman body families with a tiny, testable verb list. |

## 5. Mid-run access (MR)

| Code | Consideration | Why it matters |
|---|---|---|
| MR1 | **Branch from here.** At a calm moment, fork the current run into a new slot that starts from this exact state with one dial changed (premise, flip, randomness). The original continues untouched. Save impact: a new slot or a diff branch (TIMELINES file-size table). | The most direct way to "try an AU" without leaving a run. Differs from B1 to B4 because it forks the present, not a past era. |
| MR2 | **Change a dial in fiction.** Some dials can shift mid-run only with a cause: a premise changes after a world event, a relationship flips after a betrayal. Default: no menu edits to a live run's premise. Dial: sandbox allows live edits with a stamp. | Keeps live runs honest while letting tests move fast. |
| MR3 | **Enter an AU copy as a traveler.** A living character crosses into an AU copy by a door (AC2), keeping body and cargo per the copy's carry rules. Save impact: needs live-copy instancing (BO10). | AU access as a place, not only a new game. |
| MR4 | **Carry or not carry, chosen at the crossing.** Show the carry list before crossing: body, items, money, knowledge, followers, with the copy's rules applied. Default: what the world rule says. Dial: sandbox override. | Gives a clear moment of choice and keeps duplication rules visible (PW6). |
| MR5 | **Save slots as copies.** A slot browser that shows each slot's world, copy tag, era, last played and parent slot, as a small tree. Save impact: metadata in the slot header only. | Turns existing save slots into a copy atlas without new state. |
| MR6 | **Return to canon mid-run.** A door or a menu action "leave this AU" that ends the visit and returns to the canon copy or home, with what the carry rules allow. | A clear exit from AU play, so experiments stay cheap. |
| MR7 | **Pause one life, start another.** Leave a character idling (on a routine) and start a second character in another slot, with idle progress credited when you return (RULES "Idle and offline"). | Idle-native multi-life play without parallel live copies in one save. |
| MR8 | **Merge back.** A branch that ended close to its parent can be folded back, keeping its legends (TIMELINES merge). Access-side addition: the merge offer appears on the run-end screen. | Prevents slot sprawl after many tests. |
| MR9 | **Loop anchor as a menu.** In loop worlds, after a reset, the anchor screen shows carried knowledge and lets you set this loop's dial (focus, risk). Default: dials limited to what the loop allows. | Loop access gets the same picker language as starts. |
| MR10 | **Heir picker at life end.** When a life ends, a short list of eligible heirs (children, apprentices, named beneficiaries) with what each actually receives, then Begin. | Replaces the hidden one-button heir with a real choice, matching the accepted heir rule. |

## 6. Other stuff (OS)

| Code | Consideration | Why it matters |
|---|---|---|
| OS1 | **Onboarding per world.** First hour in a world teaches its one unique verb through an ordinary task with a local person (MoL: Imaya's kitchen job already does this, X6). Dial: skip for returning players. | Each world teaches itself in fiction, so no global tutorial is needed. |
| OS2 | **Diegetic tutorials.** A mentor, a manual, a system window or a gossip teaches, in the world's own voice. Dial: a plain help panel for every world. | Fits the per-world log voice (RF14) and keeps help in character. |
| OS3 | **Codex and help layers.** Three layers: the Notebook (what your character knows), a world primer (public, no spoilers), and plain game help (mechanics). Each labeled which kind it is. | Separates character knowledge from player help, which the knowledge rules depend on. |
| OS4 | **Designer and player at once.** Weibao gets a play profile and a test profile. The test profile carries sandbox access and seal guards (UG10, UG11). Agents' test fixtures live in the test profile only. | Testing does not leak into play memory or spoil sealed content. |
| OS5 | **Spoiler budget for testers.** When an agent hands off a build to test, the handoff names which start to open and what the tester will learn, flagged by secret ID if any. | Weibao decides before seeing a sealed route. |
| OS6 | **Seeded test starts.** A start can be opened from a URL fragment or dev command with a fixed seed and preset, local only, for reproducible browser checks. | Agents' fresh-origin checks become one link. R15 "seeded test states" already points this way (commit 4becff87). |
| OS7 | **Start usage counts.** A local, private tally of which starts, presets and dials get picked and how long runs last. Shown only to Weibao in a dev panel. No network. | Shows which starts deserve deeper tiers (DT6 promotion), without telemetry. |
| OS8 | **Access log in the chronicle.** Each life records how it was entered (picker, door, heir, loop) in the bio. | Gives the life story an entry line and helps debug odd starts. |
| OS9 | **Accessibility.** Picker works with keyboard and screen reader; tags have text, not color only; reduced-motion variants of start VFX; a text-size setting. | Desktop-first still needs readable, operable menus. |
| OS10 | **Undo the last start choice.** Within the first few minutes, "start over with same dials" or "back to picker", no penalty. Dial: off for hardcore. | Encourages trying starts without fear of wasting a slot. |
| OS11 | **World credit line.** Each world's picker card shows its source attribution and fidelity tag (QK12). | Keeps the attribution rule visible at the point of choice. |
| OS12 | **Access as content for other worlds.** Hubs (Paradise, a D&D Sigil-like city, general knowledge) can host doors to several worlds, so access becomes a hub's economy (fares, guides, smugglers). | Turns access into a trade and a job, not only a menu. |

## 7. Suggestions, ranked cheapest first

| Code | Suggestion | Existing seam | Save impact |
|---|---|---|---|
| KA1 | **Wire the heir (MR10, AC4).** Pass `beginHeir` to `createChroniclePanel` (`src/main.js:8170`) using `buildLifeHeirSave` (`src/life_experience_host.js:8`), and replace the "one lesson" text (`src/chronicle_ui.js:56,121`) with the accepted "inherits what was left" wording. | Built function and hidden button. | Writes a new save from the old one; needs save, reload and import check. No schema change. |
| KA2 | **Sandbox toggle (UG10, UG11, OS6).** A local settings flag that stamps the save header and the V7 header "sandbox", exposes all optional packs and all `starts[]` rows, and skips profile writes. Add seeded open via URL fragment for agent checks. | `is_on_dev` (`src/main.js:4815`), dev save key, R15 seeded states. | Header flag only; sandbox saves use the dev save key. |
| KA3 | **Pick a typed start instead of rolling (SM2, SM9).** Let the player choose among a pack's `starts[]` (or press Surprise me) before `planStructuredSelection`, storing `choice` as the picked index with a `picked:true` marker. | `src/structured_pack_runtime.js:36-47` already stores `choice`, `startCount` and seed. | Selection receipt gains one field; needs a compatibility note for schema 2 receipts. |
| KA4 | **Start picker over existing doors (SM2, SM4, UG5).** A desktop panel that lists the doors X3 and X6 already have, with public labels, canon tag and "unknown to you" fields, launching the same commands. | `content_pack_ui.js`, MoL and Paradise chart actions. | None; it reuses existing commands. |
| KA5 | **Recent and favorite starts (SM8) plus unlock receipts (UG8).** A small profile record outside the run save listing picked starts, dials and why each was unlocked. | Profile storage next to `lifeSaveStorage`. | New profile key, separate from saves; no run-save migration. |

Nothing here was built or run. Every row is specified-not-run.
