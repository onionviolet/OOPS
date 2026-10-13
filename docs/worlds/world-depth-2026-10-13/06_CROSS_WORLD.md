# Cross-world considerations: iteration, parallels, starts, subtle joins (proposal, 2026-10-13)

Responding to Weibao: "more to consider? subtle stuff too, workflow to iterate worlds, parallel worlds, different starting points and more?"

Everything here is a proposal. Nothing is accepted, implemented or verified. Rows add to existing owners and point to them rather than restating them:
`docs/WORLD_COMPLETION_STANDARD.md` (S00-S14, detail ledger, random starts),
`docs/gm/WORLD_ACTIONABILITY_GM_PROMPT.md` (G1-G5 lanes),
`docs/gm/WORLD_EXPANSION_GM_PROMPT.md`,
`docs/GAME_MASTER_PROMPT.md#autonomous-iteration`,
`docs/research/SOURCE_DEEP_DIVE_PLAYBOOK.md` (M1-M5),
`docs/RULES_FROM_SCRATCH.md` (rules 1-12, CP1-CP5),
`docs/gm/CROSS_WORLD_DETAIL_REVIEW.md` (CW01-CW36),
`docs/TIMELINES_AND_DIVERGENCE.md` (T1-T5, C1-C6, B1-B4, R1-R4, X1-X4, branch atlas, life trace),
`docs/TIME_KEEPERS_AND_VARIANTS.md` (What If W1-W6, keepers, variant party),
`docs/worlds/MULTIVERSE_STRUCTURES.md`, `docs/worlds/ORIGINS_AND_WORLD_TIMELINES.md`,
`docs/STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md` (P1-P5), `docs/SELVES_AND_ECHOES.md`,
`docs/FITTING_CHARACTERS_AND_TIMES.md`, `docs/worlds/BOOK_WORLD_ENTRY_MATRIX.md`.

Repo paths below are relative to `/Users/weiwei/code/yet-another-idle-rpg/`. No sealed secret is named; rerolled or changed truths appear only as "a sealed variant exists, reached by its route".

## 1. World iteration workflow (WI)

The loop reuses what exists: the deep dive playbook feeds source worlds, the actionability lanes and completion sections organize coverage, the world expansion GM owns the campaign, and the autonomous iteration loop plus AGENTS verification carry a slice to playable. What is new is a small per-world depth ledger, a rule for picking the next slice, and a feedback path, so each pass starts from a known place instead of a fresh audit.

| Code | Consideration | Why it matters |
|---|---|---|
| WI1 | **One pass = one world, one slice, two or three lenses.** Default: a pass deepens one world through a few lenses (CP1-CP5, CW families, or brief angles like daily life, institutions, absence, presentation) and ends at a named checkpoint. Dial: a "breadth pass" applies one lens across many worlds at once (this round is one). | Matches AGENTS "finish one playable slice before the next" and keeps a pass small enough to review in one sitting. |
| WI2 | **Entry check, three reads.** Before writing: the world's depth ledger (WI6), its folder docs, and any Weibao feedback tagged to that world since the last pass (WI8); then the AGENTS consistency gate against USER_VISION and PROJECT. | Replaces "re-read everything" with a short known checklist; the ledger says what is already covered, so duplicates drop. |
| WI3 | **Stages map to existing owners; a pass enters where the ledger says.** Notes or source text go through the playbook (M1-M5); coverage goes into completion sections S00-S14 and the detail ledger; campaign structure into `CAMPAIGN.md` per the expansion GM; build work into the implementation packet and the autonomous loop. A world with a finished deep dive skips straight to S-section work. | No new process doc; each step already has an owner and template, and skipping completed stages is the main time saver. |
| WI4 | **Picking the next slice, default order.** First anything Weibao reacted to; then a lens marked thin in the ledger that already has a native consumer in code; then a cross-world join that unblocks two or more worlds. Dial: Weibao names a world or lens and the order is skipped. | Gives agents a reasonable default without asking him either/or questions, and favors slices that can become playable soon. |
| WI5 | **Exit check: name the state reached.** Each pass records one state per touched row: proposal, decision-ready, source-qualified, implemented-unverified, browser-verified, director-accepted (the states AGENTS and the completion standard already separate), plus one "smallest playable taste" and any gates pushed into that world's acceptance backlog. | Keeps verification states distinct and makes the next pass's starting point obvious. |
| WI6 | **Depth ledger per world.** A short table: rows are lenses (the brief's angles, CP1-CP5, starts, parallels, subtle details, presentation V6-V8), columns are state, last pass date, owner path. Default home: the existing `COMPLETION_LEDGER` section entries (which already carry applicability, reason, detailOwner, reviewEvidence); for worlds without a ledger, a small table at the end of `WORLD_BRIEF.md`. | It is an index, not a spec, so it adds little writing; it answers "what has this world had" in seconds and prevents the same lens being redone. |
| WI7 | **Worlds-by-lenses grid.** Reading all ledgers gives a grid; empty cells suggest breadth passes, and cells marked "not fitting, reason" stay empty on purpose (FITTING's "unfit is a choice too"). | Shows Weibao the shape of the whole multiverse at a glance and keeps worlds distinct instead of filling every cell. |
| WI8 | **Feedback re-entry.** Weibao's reply is quoted into USER_VISION per its owner rule, and the rows he reacted to get a tag by code ("WI6 liked", "more on PW5"). "More to consider" on one row is aspect expansion of that row, not a stop signal. Silence stays a proposal (rule 10). | His steering reaches the next pass through one place, and agents stop re-asking settled preferences. |
| WI9 | **Parallel passes, one writer per area.** By default each world agent writes just its world folder (or a scratchpad packet); shared owners (TIMELINES, MULTIVERSE, ORIGINS, CROSS_WORLD, this file's topics) stay read-only during per-world passes. Cross-world findings come back as an additive packet that one integrator folds in. | This is the actionability prompt's "reserve exact files" rule applied to iteration; it lets five worlds move at once without merge fights. |
| WI10 | **Cluster reuse.** Worlds the entry matrix already clusters (integration worlds, rewind/loop worlds, hidden-power worlds, genetics worlds) share one lens pass with per-world dials. Default promotion rule: an idea that appears in three worlds' passes moves to a shared owner and the worlds link to it. | One design serves several worlds; shared engines get designed once. |
| WI11 | **Second and later passes start from a diff.** Ask what changed since the last pass: new source reading, new engine primitive, new steering, new playtest evidence. Deepen rows already started before opening new lenses; superseded proposals get a dated "superseded by" note instead of deletion. | Iterating "again" stays cheap and history stays readable. |
| WI12 | **Play-anchored passes.** Once a slice is playable, the next pass starts from what Weibao actually did there (log, receipts, the life trace idea in TIMELINES) rather than from the design doc. | Real play shows which rows mattered; design effort follows his attention. |
| WI13 | **Cheap mechanical checks before review.** A grep of each candidate row's key nouns against the world folder and shared owners (duplicate check), a style check (no em dashes, no " -- ", no banned phrases), and a sealed-secret check (only S-IDs and routes appear for sealed worlds). | Catches the most common review findings automatically, so human or agent review time goes to substance. |
| WI14 | **Multi-agent shape (described, not run).** A coordinator reads all ledgers and picks N world slices plus one cross-world lane; each worker gets the shared brief, its world folder as sole write area and a scratchpad output; a reviewer runs WI13 and checks rows against owners; an integrator writes ledgers and shared owners. Could later be a Workflow script under the GM capacity policy, once Weibao authorizes running it. | This round's own pattern (shared BRIEF, five world agents, one cross-world agent) is already the prototype; writing it down makes it repeatable. |
| WI15 | **Where it reduces work.** Skip lenses marked not fitting; skip stages already done; reuse cluster passes; let the ledger replace re-reading; let play evidence replace speculative expansion. | Each added step pays for itself by removing a larger one. |

## 2. Parallel worlds (PW)

Existing owners already cover isolation of state (T4), branch atlas and fading archive, start modes B1-B4, return routes R1-R4, What If premise cards, keepers, variant parties, ghost sharing and meeting past selves. These rows add generation labels, discovery, comparison, drift and ownership angles.

| Code | Consideration | Why it matters |
|---|---|---|
| PW1 | **Provenance label per copy.** Every parallel copy carries an author-side origin tag: your branch, authored What If, mirror, seeded change-type, or a sealed variant (ID only). The player sees as much of that label as their means reveal: atlas name at the meta level, nothing in-fiction by default. | Keeps generation sources mixable while the character's knowledge stays honest (rule 6). |
| PW2 | **Locals name their own world, not yours.** Default: natives think their history is the only one and have no word for "branch". Dial: worlds with seers, keepers or regular crossings have local names for neighboring copies, which may not match the atlas. | Two name layers (player meta and in-fiction) avoid immersion breaks and allow misnaming as a texture. |
| PW3 | **A ladder of discovery tells.** From faint to obvious: a shop sign spelled differently, a song with other words, the moon phase off, someone alive who should be dead, your own grave. Which rungs a character notices scales with perception and familiarity. | Noticing you are in a copy becomes a small discovery game instead of a menu label. |
| PW4 | **Comparison through a carrier.** An in-fiction diff tool (a two-world almanac, a mirror, a seer's reading, your own notes) shows only differences the character has witnessed in both copies, with confidence. Default: built from Notebook entries and can be wrong. | Comparison stays a knowledge mechanic, not an author truth dump, and wrong comparisons create stories. |
| PW5 | **Counterparts share up to the fork.** Default: same name, body and early history until the divergence point, independent after, no shared memory. Dial: soul-linked counterparts in worlds with soul recognition share dreams, scars or a trickle of practice; reasonably priced by that world's soul rules. | Gives a clear default for "is this the same person" and a dial for worlds where souls genuinely link. |
| PW6 | **Unique items become impossible doubles.** Bringing a unique item into a copy that already holds its counterpart makes two; locals with the means read one as a forgery, a collector pays for the oddity, an authority wants both. Which one is "real" follows that world's rules (TIMELINES B3 note). | Turns a duplication edge case into social play while custody stays one record per object. |
| PW7 | **Notebook entries carry a copy tag.** A fact learned in copy A is marked as such; using it in copy B shows lowered confidence until rechecked. | Small state that prevents silent knowledge leaks and makes cross-copy foreknowledge a real gamble. |
| PW8 | **Your native counterpart.** Default: a native version of your character exists in a copy only where the start premise says your body was born there. Dial: worlds where everyone has counterparts across copies; meeting yours uses SELVES coexistence rules. | Prevents surprise doubles in arrival starts while keeping the dramatic option reachable. |
| PW9 | **Drift follows each copy's clock.** A frozen absent copy does not drift (T4 freeze); a copy whose absence policy advances drifts by aggregates (C4). Dial: attractor-style reconvergence pulls copies back toward shared events. | Copies left alone age believably and drift becomes a readable quantity for a divergence sense. |
| PW10 | **Reconvergence windows and thin spots.** Where two copies briefly match again (same event, same place), crossing between them is cheaper and bleed can happen: a sound, a lost object, a stranger. Default off; on in worlds whose cosmology supports overlapping layers. | Gives parallel travel geography and timing without a universal portal menu. |
| PW11 | **Cross-copy trade friction.** Prices and scarcities differ between copies; the friction is in-world (carrier capacity, customs, keepers' attention, goods that do not keep). Abuse limits stay low priority for a solo player. | Lets parallel copies feed the economy and life-sim careers with in-fiction costs. |
| PW12 | **Copies can end.** A copy can collapse, be pruned or simply close; your stash, heirs and friends there need a fate (refugees into another copy, a chronicle entry, a last visit window). | Parallel play gains stakes, and the archive's fading has an in-fiction face. |
| PW13 | **Save and state ownership considerations (no schema).** One instance owner per live copy; shared immutable definitions; exactly one custody record per crossing object; your past-self echoes in the branch archive rather than live state; which copy is "home" for offline time; content revision per copy; how a copy imported from another browser joins the atlas (X2). | Names the ownership questions an engineer needs answered before any parallel copy is playable. |

## 3. Starting points (ST)

Existing owners cover start axes (P1), before/during/after snapshots (T2), origin scenario families, infant and child play, chapter advance, branch start modes (B1-B4), and the suspenseful random entry. These rows add picker shapes, roles, late and inherited starts, and spoiler-safe display.

| Code | Consideration | Why it matters |
|---|---|---|
| ST1 | **Era strip with fog.** Eras appear as named periods with public-level descriptions only ("a quiet decade", "the year after the war"), no canon outcomes. Dial: fully random, pick an era, or pick a mood and let the era follow. | Lets the player choose time without reading spoilers. |
| ST2 | **Start-as-whom ladder.** Nobody, bystander near a canon anchor, a minor canon role (role-only per ORIGINS), an antagonist's underling, a relative of a canon figure. Each rung pre-sets starting attention and disturbance weight (C2). | Makes "who you are" a dial on how hard canon pushes back from minute one. |
| ST3 | **Epilogue starts.** After a source's story ends: heroes aged or retired, famous items in museums or lost, battle sites as ruins, motives (C6) writing what comes next. | Gives book worlds a post-canon life-sim mode that needs no canon events to stay interesting. |
| ST4 | **Ancestor starts.** Generations before canon; your heirs can become ancestors of known cast, or you found something canon credits to another (bootstrap where the world's mutability dial is closed-loop). | Turns succession and the natural course into a long game across generations. |
| ST5 | **Inheritance letter.** When a life ends, the dying character can leave a letter, will or rumor that becomes the heir's starting knowledge, possibly incomplete or wrong (B2 successor start, plus the letter). | Gives the heir start a personal hook and keeps carried knowledge tied to a carrier (rule 5). |
| ST6 | **Mid-crisis cold open.** Start inside the hour of a siege, exam or collapse, with an idle-friendly paused first choice; the crisis resolves with or without you and failure redirects. Background is then chosen from authored snapshot backgrounds and frozen. | Strong opening tension without fabricating player history (T2 still holds). |
| ST7 | **Unaware parallel start.** Start in a copy without being told it is a copy; finding out is the run's first discovery. Which sealed variant applies stays an ID with its route. | Uses the parallel system as a mystery layer for the suspenseful random entry. |
| ST8 | **Start in transit.** Begin on a route, ship or hub queue between worlds; the first meaningful choice is where to get off and what to carry. | Connects starts to the hub and multiverse network and teaches crossing rules early. |
| ST9 | **Household or group start.** Begin controlling a family, caravan or crew, then choose who becomes the protagonist once you know them. | Makes generated families (ORIGINS) playable before committing to one body. |
| ST10 | **Obligation-first start.** Begin with a debt, contract or vow carried from a hub or prior life, whose terms shape the first weeks. | Gives an immediate goal without a scripted quest, and links starts to institutions. |
| ST11 | **Strong visitor start.** A powerful character from another world starts at a fresh era of a new world; the world reacts to an outlier (rule 12) and local scale, supply and suppression dials keep play meaningful without erasing progress. | Serves late-game players who want a new world without restarting their power. |
| ST12 | **Start card without spoilers.** Cards show observable surroundings, body, possessions, obligations and one rumor; hidden fields show as "unknown to you". Dial: blind, hinted or full card; card text comes only from actor knowledge. Optional "three sealed envelopes": pick one of three blind starts, the other two stay available as later premises. | Lets the UI offer real choice while keeping the candidate catalog and secrets hidden (completion standard random-start rules). |
| ST13 | **Second-world starts in one run.** A character already alive entering a new world uses the arrival family by default; birth or reincarnation starts need a carrier (reincarnation, possession). | Keeps one continuous life coherent across worlds. |

## 4. Subtle cross-world details (SU)

LIFE_SIM_NORTH_STAR names "travel wear" (identity drift, culture shock, homesickness, languages) in one line. These rows make it concrete. Each is small texture by default; a world can give one a mechanical payoff.

| Code | Consideration | Why it matters |
|---|---|---|
| SU1 | **Travel residue.** Sand, ash, frost or pollen from the last world in pockets and seams, fading after washing or a few days. A tracker or customs officer with the means can read it. | A free trace that links worlds and can grow into pursuit or smuggling play. |
| SU2 | **Accent drift.** Speech picks up words from the world you stayed in longest; natives mark you as foreign. Dial: system translation removes the accent but leaves its own tell (lips out of sync, oddly formal words). | Language becomes visible identity without a full language system. |
| SU3 | **Carried habits.** Small defaults from one world persist: checking corners for traps, bowing, hiding a blade, refusing to eat a certain food. Habits fade with local time; NPCs react. | Uses the habit profile idea to make history show in behavior. |
| SU4 | **Out-of-world wear.** Gear behaves a little differently under another world's physics: tech glitches in high-magic places, potions spoil faster, a charm goes quiet. Condition tag "far from home". | Item provenance gets a felt effect and repair services gain cross-world work. |
| SU5 | **Body-clock lag.** Different day lengths leave a short tired or restless state after arrival. | A tiny felt cost to crossing that suits idle pacing. |
| SU6 | **Two ages.** The bio shows local age and lived years ("19 by Frontier reckoning, 21 lived"); birthdays and holidays from a home world are kept alone. | Calendar mismatch becomes a personal detail rather than a technical note. |
| SU7 | **Outsider tells.** Wrong coins, odd clothing cut, not knowing a common song, surprise at local weather. How fast you are spotted scales with observers' perception and your effort to blend. | Gives disguise and blending play a cross-world source. |
| SU8 | **Foreign coin as curiosity.** A coin or label from another world in a market draws questions, collectors and sometimes officials. | A small item opens social and economic threads. |
| SU9 | **Home cooking with substitutes.** Craving a home dish and cooking it from local ingredients (CW09 substitution); a good version may spread locally (CW28 diffusion). | A comfort loop that also lets cultures leak between worlds. |
| SU10 | **Stale letters.** Mail between worlds arrives late under clock mismatch; news describes a world that has since moved on. | Makes parallel clocks felt and gives stale-knowledge drama. |
| SU11 | **Animals notice.** Dogs bark at the scent of a spirit world, birds go quiet around a traveler from a dead world. | A wordless tell that does not need dialogue authoring. |
| SU12 | **Marks read differently.** A scar or brand from one world's power shows only under another world's senses, or means something else there. | Body history stays visible and can be misread. |
| SU13 | **Dream texture.** After long stays, dreams of the last world (texture only, no sealed content). Dial: in worlds with dream layers these dreams become actual contact. | Cheap atmosphere that can deepen into mechanics where a world supports it. |
| SU14 | **Names per world.** Locals mispronounce or rename you; each world gives a nickname from what you did there. | Identity becomes a collection of earned names. |
| SU15 | **Frame afterglow.** For the first minutes after arrival, the ambient header (V7) keeps a faint tint of the previous world's frame (V6), fading as you settle. | Presentation shows the crossing without a cutscene. |

## 5. More to consider (MC)

| Code | Consideration | Why it matters |
|---|---|---|
| MC1 | **Reputation travels at carrier speed.** Fame reaches other worlds through travelers, hub gossip and letters, arriving late and distorted; you can be known somewhere you have never been. | Legend becomes a cross-world system with built-in misinformation. |
| MC2 | **Home anchor for idle time.** The player picks which world's routine gets offline time; other worlds follow their absence policy. Dial: split offline time across holdings. | Fits the idle core to many worlds without double progress (T4). |
| MC3 | **Careers that span worlds.** One profession practiced across worlds (healer, smith, scholar) gains a comparative skill: knowing several traditions opens synthesis recipes. | Ordinary skills stay useful late and travel feeds craft depth. |
| MC4 | **Adapter as a job.** Tech or methods from one world need local inputs (CW35); being the person who adapts them is a paid service with real failure rates. | Turns compatibility rules into a livelihood. |
| MC5 | **Biological contamination.** Seeds, pests and illnesses ride along; invasive species, quarantine posts and crop booms follow. | A micro-to-macro chain that makes crossings consequential. |
| MC6 | **Cross-world law.** A crime in one world, refuge in another; extradition treaties, bounty hunters with crossing rights, jurisdictions that do not recognize each other. | Gives institutions reach beyond one world and gives fugitive starts a frame. |
| MC7 | **Relationships across worlds.** Friends and partners in other worlds, children raised between two, heirs with split belonging and two sets of duties. | Life-sim relationships gain distance, absence and reunion. |
| MC8 | **Rest worlds.** After high drama in one world, choosing a quiet world for ordinary life; the game supports that as a real mode, not downtime. | Respects pacing and the life-sim north star. |
| MC9 | **Personal museum.** A home room displaying items from every world and run; it doubles as the branch atlas's physical face and visitors comment on it. | Turns the archive into a home feature with social payoff. |
| MC10 | **Comparative scholars.** Hub researchers compare worlds' powers; commissioning them yields cross-compatible methods or explains why one fails. | Gives a legitimate in-fiction route to synergy discovery. |
| MC11 | **Languages as skill.** Learning a world's language unlocks its books, fairer prices and trust; system translation is the shortcut with its own tells (SU2). | A simple skill with broad payoff across worlds. |
| MC12 | **New content as discovery.** When a world gets new content, existing saves meet it as a newly found region, a returning traveler or a rumor, rather than a silent retcon. | Fits content growth to save continuity and the fiction. |

### Suggestions (what to build first)

| Code | Suggestion | Why first |
|---|---|---|
| SG1 | Add depth ledger rows (WI6) for the five worlds in this round, inside their existing ledgers or briefs. | Design-only, cheap, and every later pass uses it. |
| SG2 | Qualify three start cards (ST12) for one world, following STARTS P5's exercise, with "unknown to you" fields. | One visible UI slice that tests spoiler-safe starts. |
| SG3 | Notebook copy tag (PW7) plus travel residue tag (SU1). | Two small state fields that make crossing felt and keep knowledge honest. |
| SG4 | Two-age bio line (SU6). | Smallest calendar-mismatch taste, visible immediately on the desktop bio panel. |
| SG5 | Run one breadth pass on a single lens across one entry-matrix cluster (WI10). | Proves cluster reuse before scaling the workflow. |
