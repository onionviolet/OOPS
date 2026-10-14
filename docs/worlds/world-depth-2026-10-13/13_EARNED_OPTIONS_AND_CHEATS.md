# M. Earned options and paths to cheats (proposal, 2026-10-13)

Weibao (2026-10-13): "Making options to chose and more earned? Path to obtain cheats and more?"

Everything here is a proposal. Rows use Default + Dial + Reasonably. Nothing is accepted until Weibao says so.

**What already exists (not repeated here):** the cheat's own nine-step arc and scale table (`docs/CHEAT_LIBRARY.md#a-good-progression-loop-for-cheats`), backing table and patron terms (`docs/CHEAT_COSMOLOGY.md`), the twelve player-layer idea cards including Heirloom Compact, Rebirth Ledger, Instinct Inheritance and World Deeds (`docs/CHEAT_LIBRARY.md#player-side-mechanics-as-in-world-cheats-idea-cards-2026-10-10`), talent pipeline and T40 to T50 (`docs/SIMULATORS_AND_CHEAT_IMPLEMENTATION.md`), start axes P1 to P5 (`docs/STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md`), the accepted heir rule (`docs/RULES_FROM_SCRATCH.md#the-heir`), and the AU kinds AK1 to AK4 (`world-depth-2026-10-13/08`). This file adds: how an option becomes earned, how it shows before that, where it is stored, and the acquisition verbs themselves.

**Cross-reference:** access routes and gating for starts belong to `K_access_and_starts.md` (not yet present in the scratchpad when this was written). Where a row here touches gating, it names the earning event and the record only; K owns the route and gate.

## What the code does today (read 2026-10-13, not run)

- **Capability sources carry an origin label and a dormant flag.** Origins are `unknown`, `inherited`, `trained`, `acquired` (`src/capabilities.js:5`, validated at `src/expansion_engine.js:116`). A grant writes `acquiredAt`, `receiptId`, `worldId`, `revision`, `origin` (`src/expansion_engine.js:498-504`). Faculties with `awakened: false` or `active: false` contribute nothing (`src/capabilities.js:54`). Every current grant sets `awakened: true, active: true` (for example `src/field_workshop.js:30`, `src/frontier_campaign.js:65`, `src/original_frontier_career_content.js:112`).
- **The heir path is the only cross-life carrier.** `buildLifeHeirSave` copies `life_record`, `npc_lives` and `options` into a fresh save and builds a new chronicle (`src/life_experience_host.js:8-25`). The heir gets at most one lesson: the previous life's `bequest` (`src/chronicle.js:273-280`, `src/life_experience.js:33-36`), set by reflect or teach (`src/chronicle.js:164-175`). The button still reads "fresh body, one lesson" (`src/chronicle_ui.js:56`).
- **`life_record` is lossy by design** and declares itself "never an authority for rewards" (`src/life_record.js:1`). An earned-option ledger should be a separate record.
- **No profile store exists.** There is one save slot key (`src/main.js:349-350`). `hard_reset` removes only that key (`src/main.js:7005-7016`). Layout and color keys in `src/workspace_layout.js:32,53,76` survive a reset, so a separate key on that pattern would outlive saves.
- **Creation options are all open.** Rare and exotic races are tagged (`src/races.js:36-42,155,165`) but every race button is shown and selectable (`src/character_creation.js:60-66`). Rule 8 keeps vanilla play as is, so earned gating on vanilla options fits best as an opt-in dial.

## 1. Earned options (EO)

| Code | Consideration | Why it matters |
|---|---|---|
| EO1 | **Two stores, two scopes.** Default: a lineage ledger inside the save (travels with the heir, like `life_record` does today) and a profile ledger outside any save (survives new games and resets). Each earned option names which scope it lives in. Dial: per option, lineage only, profile only, or both. | "My family earned this" and "I, the player, have seen this" are different stories. One store for both would blur heirs with account unlocks. |
| EO2 | **Earning events are typed.** Deed, discovery, death (with cause), ending (with scope from P2), heir handover, reputation threshold, witnessed event, completed world, failure, refusal, abstention. Default: each earned option lists one or more events that open it. | A typed event lets the same option open many ways ("everything possible, reasonably") and lets the UI say why it opened. |
| EO3 | **Failure earns too.** A failed exam, a lost posting, a botched ritual, a death to a specific enemy opens starts the success route does not: the expelled student, the disgraced officer, the half-digested Beyonder. Default: each world authors at least a couple of failure-earned starts. Dial: how many. | T43's "every life earns something" applied to menus. Bad runs feel like content, not waste. |
| EO4 | **Witnessed events open premises.** Seeing a canon event (or its aftermath) opens AU dials tied to it: "what if that had gone differently." Default: the AU premise appears after the player has lived through or heard of the event it diverges from. Dial: open at once for players who know the canon. | Divergence means more after you have seen the original. It also paces AU lists so they are not a wall on day one. |
| EO5 | **Completed worlds open eras.** Finishing a slice in one era of a world opens an earlier or later era of the same world (HP earlier generation, MoL after the loop, SL veteran return). Default: completion means a P2 closure of any kind, including a quiet retirement. | Gives an ending a forward door, and uses ORIGINS' era rows without showing them all at start. |
| EO6 | **Bodies earned by being one.** Living as, being turned into, bonding with or killing a kind of being opens it as a start body later. Default: lineage scope for blood, profile scope for "you have been this." Dial: by kind, from sight alone to full lived life. | Rule 4 makes bodies real; earning them makes each one a memory. A familiar you bonded becomes a body you can start in. |
| EO7 | **Heirs choose from what was left.** Per the accepted heir rule, an heir's start menu is built from things, records, people, standing, blood and unfinished business actually left. Default: each item left becomes a start option or a start line ("begin at the workshop", "begin owing the debt"). | Turns the accepted heir rule into a visible menu instead of one lesson. |
| EO8 | **Reputation earns entry roles.** A name known in a world (fame or infamy) opens roles that need it: the ward of a famous family, the rival house's recruit, the wanted outlaw. Default: reputation scope is per world and per era. Dial: whether legends drift across eras and get retold wrong (World Deeds card). | Lets standing carry without carrying power, a cheap and honest kind of legacy. |
| EO9 | **Showing before earning, three grades.** Default: silhouette (name hidden, category and one hint shown), rumor (an in-world line hints that such a start exists), nothing (fully hidden until earned). Each option picks a grade. Sealed ones default to rumor or nothing, per the sealed-secrets rule. | Players want to know there is more without being handed a checklist. The grade is a per-option dial. |
| EO10 | **Hints say which kind of event, not which act.** A silhouette reads "opened by a death" or "opened by a refusal in this world", not the exact steps. Dial: hint detail from category to near-solution. | Keeps discovery real while showing the shape of what to try. |
| EO11 | **Open everything dial.** Default: earned. Dial: open all non-sealed options now, open per world, or open by category (bodies, eras, premises). Opening this way is labeled in the ledger as "opened by choice" so earned history stays honest. Sealed options stay on their discovery route unless Weibao unseals them. | "Everything possible, reasonably" applies to the player too. A player who wants all starts gets them; the earned record is not faked. |
| EO12 | **Earned options can be lost, by dial.** Default: profile unlocks persist. Lineage options can be lost with the line: a vault robbed, a family ended, a record burned. Dial: harsh mode where profile options can be lost too (north star "persistence you can lose"). | Gives lineage play stakes without making the profile fragile by default. |
| EO13 | **Earned is not stronger by default.** An earned start offers a different life, not a bigger number. Dial: a world can attach a real edge to an earned start where its fiction does (a returning legend starts known). | Keeps earned starts as variety, matching the Hall of Selves test "a different life, not a stronger one." |
| EO14 | **Menus earn too.** Center-menu verbs, panels and dials (a ledger tab, a foresight panel, an AU slider) open the first time the life has a reason to use them. Default: the panel appears at first need with a short receipt. | Rule-list "information when it comes up" applied to UI. A new panel is itself a reward. |
| EO15 | **NPCs remember the earner.** An option earned by a deed with witnesses keeps the witnesses: the next life in that world can meet someone who saw the old one. Default: lineage scope only. | Ties earned options to people, which matters more than a menu entry. |
| EO16 | **Earned options carry their receipt.** Each entry stores: what opened it, which life, which world, when. Shown as one line on hover ("opened when the second heir refused the oath"). | T48's "talents remember their life" applied to options. The menu becomes a biography. |
| EO17 | **Profile store leaves saves alone by default.** Default: reading the profile only adds menu entries at creation or heir time; it does not change a running save. Import merges by union. | Save integrity (rule 9) stays the one firm line; the profile is additive. |

## 2. Cheat acquisition paths (CA)

"Witnessed" means who sees the acquisition and can remember it. "UI" means how the player sees it arrive.

| Code | Consideration | Why it matters |
|---|---|---|
| CA1 | **Born with.** Fits: HP (magic, Parseltongue (G)), Shadow Slave (latent, see CA2), SL (gift), D&D (species traits). Cost: none up front; lineage scope. Witnessed: family, a birth reading. UI: a trait line at start with origin "inherited." | The plainest path; the existing `inherited` origin covers it. |
| CA2 | **Latent, awakened by crisis.** Fits: Shadow Slave (first Nightmare), SL (gift under strain), LOTM (control loss), HP (accidental magic). Cost: the crisis itself, often an injury or a debt. Witnessed: whoever was there. UI: a dormant source shown as silhouette, then an awakening receipt. | Uses the dormant flag already in code (`awakened: false`). The awakening moment is the strongest "first use" beat. |
| CA3 | **Bought.** Fits: LOTM (formulas, ingredients on the black market), D&D (magic items, spell scrolls), TTKS B1 (ritual materials), hubs. Cost: money plus who learns you bought it (TT2 trail). Witnessed: seller, market watchers. UI: a shop receipt; the power arrives after use or digestion, not at purchase. | Separates buying the means from owning the power, which LOTM and D&D both do. |
| CA4 | **Stolen.** Fits: LOTM (characteristics from a corpse), TTKS B1 (mimicry), MoL (soul magic theft), rival cheats. Cost: the victim's allies, a trail, sometimes compatibility damage. Witnessed: the victim, if alive; diviners. UI: origin "stolen" with the former holder's name. | A path with built-in enemies. Rule 11's pushback comes free. |
| CA5 | **Inherited from a person.** Fits: HP (vaults, heirlooms, a cloak passed down (G)), SL (a dead comrade's effects, SL6), LOTM (a mentor's notes). Cost: claimants, taxes, debts that come with it. Witnessed: executors, family. UI: a will or effects list at the heir screen. | The accepted heir rule as a cheat path; it also links to Heirloom Compact. |
| CA6 | **Granted by a system, god or storyteller.** Fits: Shadow Slave (the Spell), TTKS B2 and B3 (systems), D&D (Epic Boons (G), divine blessings), LOTM (deity favor). Cost: patron terms from the gift-to-leash table. Witnessed: the patron, other followers, seers. UI: a terms card before acceptance, shown as far as the player can read it (rule 6). | Patron terms already exist; this row asks that every grant show its terms card at the moment of grant. |
| CA7 | **Found as an artifact.** Fits: LOTM (Sealed Artifacts), HP (Room of Requirement finds (G)), D&D (loot), Shadow Slave (Memories). Cost: identification, attunement, the artifact's own drawback. Witnessed: whoever saw the find; the artifact's previous seekers. UI: an unidentified item that becomes a cheat card after study. | Item backing makes the cheat losable and tradable, so it can move between lives as a thing. |
| CA8 | **Learned from a teacher.** Fits: HP (Patronus, Occlumency (G)), MoL (the shaping lessons), D&D (training feats), SL (storage technique). Cost: time, fees, the teacher's conditions and what they now know about you. Witnessed: the teacher. UI: lesson steps on the learn-practice-master ladder (AB3). | The ordinary path. Keeps cheats inside the skill system rather than beside it. |
| CA9 | **Reverse-engineered.** Fits: MoL (studying another caster's spell), TTKS B4 (ancestral machines), D&D (identify plus study), Fallout tech. Cost: samples, failed attempts, a damaged original. Witnessed: rarely; a lab, a guild. UI: a research line with partial understanding shown as a percentage of steps known, not power. | Turns observation (rule 6) into acquisition; anti-feats fill the notebook first. |
| CA10 | **Traded.** Fits: LOTM (Tarot-style gatherings), Shadow Slave (Memories and Echoes change hands), hubs. Cost: what you give, and the other side now knowing your build. Witnessed: the counterpart, the market. UI: a trade screen with a "what they learn about you" line. | Trade puts a price on information about you, not only on the item. |
| CA11 | **Fused.** Fits: TTKS B1 (chalice fusion), Shadow Slave (Memory or Echo upgrades (G)), simulators (T5 merging). Cost: both inputs, a chance of a third unwanted result. Witnessed: whoever runs the forge. UI: a fusion preview with known and unknown outcomes marked. | Fusion is how duplicates and joke rolls become useful (T41). |
| CA12 | **Grown from a habit.** Fits: every world; strongest in LOTM (acting), CoI village loop, SL drill. Cost: the habit's time and the habit's tells (people learn your routine). Witnessed: anyone who lives with you. UI: a habit counter that turns into a trait at a threshold, with a "you have done this N times" receipt. | Earned Habit card turned into acquisition. Idle play fits it well because repetition is what idling does. |
| CA13 | **Earned on a world's own ladder.** Fits: LOTM Sequences, D&D levels and feats, Shadow Slave ranks, TTKS B1 vein ranks, HP OWLs and NEWTs. Cost: the ladder's own rules. Witnessed: the ladder's institution. UI: the world's native rank panel. | A YAIRPG cheat can sit at a rung as a one-off outlier (rule 12), so climbing the native ladder is a cheat path. |
| CA14 | **Assigned at a loop, death or reset.** Fits: MoL (the loop), CoI (village reset), TTKS B2 (settlement), the Rebirth Ledger. Cost: the death or reset itself and what it erases. Witnessed: by the loop's owner, sometimes nobody. UI: the death menu (C2) with carry slots. | Death as the first prestige layer, already the milestone; this row names it as a cheat source. |
| CA15 | **Given by an NPC.** Fits: HP (a gift from a headmaster (G)), SL (a commander's trust), LOTM (a club's reward), D&D (a patron NPC). Cost: obligation, loyalty, the NPC's own goals. Witnessed: the giver and their circle. UI: a gift line with the giver's name and what they expect, if known. | Makes relationships a power path, which life-sim play needs. |
| CA16 | **Unlocked by a research line.** Fits: MoL (spell design), TTKS B4, D&D wizard research, Fallout. Cost: books, a lab, time, failed prototypes. Witnessed: colleagues, journals. UI: a research tree where nodes show as silhouettes until a prior step is done (EO9). | The slowest path and the most "earned"; good for offline time. |
| CA17 | **Bound by an oath or contract.** Fits: Shadow Slave (True Names (G)), D&D warlock pacts (G), SL enlistment, HP Unbreakable Vow (G). Cost: the oath's terms, and a breaker's penalty. Witnessed: whoever holds the other end. UI: the contract text with its readable and unreadable parts. | Different from a grant: the player commits first and the power follows the promise. |
| CA18 | **Borrowed for a time.** Fits: LOTM (borrowed faculties), D&D (Wish effects, rented items), hubs. Cost: a deadline and a return clause. Witnessed: the lender. UI: a countdown chip on the source (the `expiresAt` field already exists). | Uses `duration` on source grants with no new shape. |
| CA19 | **Infected or contaminated.** Fits: TTKS B5 (infection sources as tiered gifts), LOTM (madness from characteristics), CoI. Cost: lifespan debt, mutation, control loss. Witnessed: inspectors, doctors. UI: a condition source that grows, with an origin "contracted". | A path where the cheat is also a disease, which B5 already shows. |
| CA20 | **Copied by consent.** Fits: TTKS B5 (cooperation meter), Naruto-style copy with permission, a teacher who lets you mirror them. Cost: the donor's trust and a grade lost without substrate (F9). Witnessed: the donor. UI: a consent meter that fills before the copy. | The ethical twin of CA4; same result, different world reaction. |
| CA21 | **Carried in by the soul from a prior life.** Fits: any world whose rules allow it; reincarnation starts. Cost: decay in a new world (knowledge backing), body mismatch. Witnessed: masters who see a novice move like a veteran (Instinct card). UI: a faded source that sharpens with use. | Rule 5's carrier made visible at start; it uses the profile or lineage store from EO1. |

## 3. Per priority world (EW)

### Harry Potter (`docs/worlds/harry-potter/`)

| Code | Consideration | Why it matters |
|---|---|---|
| EW1 | **Wand choice as an earned match, not a slot.** (G) The wand chooses the wizard. Default: the wand shop offers a few that react; a life that did odd things before eleven (a bonded creature, a near-drowning) shifts which wands react. Dial: how much prior life matters. The brief grants no automatic wand bond (`WORLD_BRIEF.md:69`). | Makes the first big purchase a reading of the life so far. |
| EW2 | **Inheritance runs through vaults, keys and house elves.** (G) Family gold, heirlooms and servants pass by will and blood. Default: a lineage start can open a vault key the previous life left; the goblins check the claim. | A direct CA5 path that fits the accepted heir rule. |
| EW3 | **Annotated books as cheat carriers.** (G) A prior owner's margin notes can teach better methods than the text. Default: a life that wrote in its books can leave one to the next, and that book teaches faster with the old owner's quirks. | Records as the heir rule's carrier, in a world that already has the trope. |
| EW4 | **Exam results open careers and starts.** (G) OWL and NEWT grades gate jobs. Default: grades a life earned open later-era starts (an Auror trainee, a healer) for the lineage. Failure opens others (a shop clerk who knows forbidden subjects). | EO3 and EO5 in a school world. |
| EW5 | **Earned YAIRPG cheat: a familiar-bond path.** Default: a pet kept through several school years grows a quiet bond that warns of danger (CA12). Reasonably: a teacher notices, and the creature can be lost. | An original cheat earned on the world's own calendar without breaking canon magic rules. |

### D&D (`docs/worlds/dnd/`)

| Code | Consideration | Why it matters |
|---|---|---|
| EW6 | **Feats as earned options at level milestones.** (G) Feats arrive at set levels. Default: feats tied to deeds (a feat offered after surviving a fall, after repairing a hundred items) appear beside the standard list. | A native ladder with a deed-shaped side door. |
| EW7 | **Boons and blessings from play.** (G) The rules allow a DM to grant blessings and boons as story rewards. Default: a boon offer follows a witnessed act (saving a shrine), with the terms card from CA6. | D&D already has "earned by story" power; YAIRPG can use it as is. |
| EW8 | **Attunement as the cost of found cheats.** (G) Strong items need attunement and slots. Default: a found cheat item takes an attunement slot and a short rest to bond. Dial: slot count per rules profile (PDD3). | Gives CA7 a native limit with no invented cap. |
| EW9 | **Rules-profile as an earned dial.** After a slice is finished under one profile (PDD6), the other profiles open for that world. Default: earned; dial: open at once. | EO5 for rules editions instead of eras. |
| EW10 | **Earned YAIRPG cheat: the mended thing remembers.** From the torn-bag slice (PDD1): an object mended many times by the player keeps a small charm (CA12). Reasonably: others want it; it can break again. | Builds on the first planned D&D slice instead of new content. |

### A Soldier's Life (private pack; paraphrase only)

| Code | Consideration | Why it matters |
|---|---|---|
| EW11 | **The gift is noticed through work, then recorded.** The storage gift changes posting and pay once known (repo notes). Default: the gift is latent at enlistment and awakens under duty strain (CA2); the need-to-know circle (SL10) starts at that moment. | The awakening and the paperwork are the same beat. |
| EW12 | **Promotion as the native earning path.** Rank, posting and pay follow the service record (SL4). Default: a good record opens instructor, quartermaster and veteran starts for the lineage (SL14). | EO8 and EO5 in a military world. |
| EW13 | **A comrade's effects as inheritance.** SL6 custody of a dead soldier's things. Default: an item from a fallen comrade can carry a small cheat (a charm, a written method) to the holder, with a family who might want it back. | CA5 with grief and custody attached. |
| EW14 | **Earned YAIRPG cheat: a ledger sense.** A life that keeps the kit ledger long enough grows a habit that spots missing stock (CA12). Dial: from intuition to exact counts. Reasonably: thieves start avoiding your company. | An original cheat earned from the world's own verb (muster and ledger). |

### TTKS five books (`docs/LIFE_SIM_NORTH_STAR.md#ttks-five-book-findings-2026-10-10`)

| Code | Consideration | Why it matters |
|---|---|---|
| EW15 | **B1: rank rituals bought and performed.** Ritual materials from the market, vein linking near roots (TT2, TT3). Default: a cheat can be a rare ritual variant found in an old shop's ledger (CA3 plus CA9). | Market, place and rank as one path. |
| EW16 | **B2: the yearly draw as the native cheat source.** Default: a YAIRPG cheat can enter the draw pool as an outlier grade. Dial: whether lives in other worlds add to the pool (traits earned elsewhere). | CA14 where the world already gives a trait per year. |
| EW17 | **B3: submitted worlds as earned starts.** A world made real by submission (F7) becomes a start option for later lives. Default: profile scope. | EO5 in its purest form; B3 already earns worlds. |
| EW18 | **B4: legacy use, ownership, knowledge and command are four separate earns.** Default: each machine legacy opens in steps; using one does not grant command. | Splits one cheat into four earned layers, a good model for other worlds. |
| EW19 | **B5: shard sets earned across shifts.** Three of six blessings for a seed (F9). Default: shards come from inspections done well; a full set opens a new start body or seed. | A collection that fits an idle shift loop. |

### Mother of Learning (`docs/worlds/mother-of-learning/`, runtime `src/book_world_mol_*`)

| Code | Consideration | Why it matters |
|---|---|---|
| EW20 | **Loop learning is the native cheat; knowledge is what crosses.** (Placement card: loop Blocked outside, knowledge travels.) Default: an earned YAIRPG cheat here is knowledge-backed: a spell design, a person's secret, a route. | Fits the world law and rule 5 without inventing new carriers. |
| EW21 | **Shaping practice as a habit path.** The shaping exercises in the books build control slowly (general knowledge of the series). Default: practice counts persist across lives as a profile-level "hands remember" note, faded by world (CA21). | Lets an idle player feel the loop's repetition outside a loop. |
| EW22 | **The settled-lodger start is earned.** PML9 starts mid-arc with a pass and room. Default: it opens after a life has earned the pass the long way in the current runtime. | The cheapest earned start in a world that already runs (`entryProfile` is fixed today at `src/book_world_mol_state.js:24`). |
| EW23 | **Teachers who remember nothing.** In a loop, a teacher teaches again each time. Default: outside the loop, a teacher you met in a past life is met fresh, but the lessons go faster if your notes survive (EW3 pattern). | One-sided history (TT8) as a learning edge. |

### Lord of the Mysteries (G plus `docs/CHEATS_BY_WORLD.md`)

| Code | Consideration | Why it matters |
|---|---|---|
| EW24 | **Potions, formulas and acting.** (G) A Sequence is drunk, then digested by acting its role. Default: a YAIRPG cheat earned here follows "Digested" terms: borrowed until acted out, then owned. | The patron-terms table already names this; this row makes it the acquisition rule. |
| EW25 | **Formula hunting as the main path.** (G) Formulas and ingredients are rare and traded. Default: each formula found is an earned option for the lineage; a lost formula is a lost option (EO12). | Gives a lineage a family library that matters. |
| EW26 | **Sealed Artifacts and characteristics from the dead.** (G) Power can be recovered from a fallen Beyonder. Default: CA4 and CA7 with contamination risk (CA19). | Two paths with the world's own danger built in. |
| EW27 | **Earned YAIRPG cheat: a clean acting habit.** A life that acts a role without slipping grows a small resistance to control loss (CA12). Reasonably: churches want to study you. | An original cheat earned from the world's core verb. |

### Circle of Inevitability (G plus `docs/CHEAT_COSMOLOGY.md`)

| Code | Consideration | Why it matters |
|---|---|---|
| EW28 | **Bestowed power as a burdened loan.** (Patron table row.) Default: a gift here starts with a growing burden that can be cleared by deeds, which turns it into a full gift. | An earned path from loan to ownership. |
| EW29 | **Village reset with persistent gains.** Daily reset, gains kept (placement card). Default: a habit built inside the loop counts double toward CA12 but is stuck to the loop until a deed frees it. | A loop variant that differs from MoL: the body, not memory, keeps gains. |
| EW30 | **Earned start: a villager who noticed.** (QCI-AU2's familiar-sense meter.) Default: a life that fills the meter opens a villager start in a later life. | EO4 with a local witness. |

### Shadow Slave (G plus `docs/CHEATS_BY_WORLD.md`)

| Code | Consideration | Why it matters |
|---|---|---|
| EW31 | **Aspects come from the Spell's first Nightmare.** (G) Default: the Aspect is assigned by the Spell with a Flaw; YAIRPG cheats can be an Aspect outlier only if the world's dial allows. | Respects the source's grant path (CA6 with fixed terms). |
| EW32 | **Memories and Echoes from kills.** (G) Kills can leave items and servants. Default: a YAIRPG cheat item can drop as a rare Memory, earned by the kill. | CA7 tied to deeds, already native. |
| EW33 | **True Names earned by deeds.** (G) A Name is earned and makes the bearer stronger, and also commandable by those who know it (placement card). Default: a Name is a profile-scope earned title with a real cost. | EO8 with a built-in danger. |
| EW34 | **Earned start: a Sleeper's lineage.** A life that survives its first Nightmare opens later starts as a descendant or student of that Sleeper. | EO7 in a world where survival itself is rare. |

### Other book worlds (Reverend Insanity, ORV, Paradise, Speedrunning, others)

| Code | Consideration | Why it matters |
|---|---|---|
| EW35 | **Gu as bought, raised and fed cheats.** (Repo notes.) Default: a Gu cheat needs feeding, so it can starve in an idle absence. | CA3 with upkeep, good for offline rules. |
| EW36 | **ORV sponsor reactions as earned grants.** (QOR-AC2.) Default: acting on broadcast earns coins and sponsor offers (CA6). | A grant path that reads player style. |
| EW37 | **Paradise contracts and shop purchases as bound items.** (Patron table.) Default: bound items cannot be traded or exported, but can be inherited if the hub allows. | Shows a hub's own acquisition terms. |
| EW38 | **Speedrunning's stored bodies as earned starts.** (Placement card.) Default: each stored body a life prepared becomes a start option for the next. | EO6 with a native carrier. |

## 4. Progress feel (PF)

| Code | Consideration | Why it matters |
|---|---|---|
| PF1 | **The receipt is the reward.** When an option or cheat is earned, show one line: what, how, from which life ("Opened: the disgraced officer start. You were dismissed at Ford Hill."). Default: in the log, with a small V8 edge pulse. | The existing receipt fields (`receiptId`, `acquiredAt`) make this cheap. |
| PF2 | **Near-miss hints.** When a life comes close to an earning event, the silhouette's hint sharpens one step ("a death in this world" becomes "a death underwater"). Dial: off, on. | Gives a reason to try again without a checklist. |
| PF3 | **The first-use moment.** The first time an earned cheat is used, the log uses a distinct voice line and the effect shows its full shape once. Later uses are quieter. | The strongest beat in the arc; worth a special line. |
| PF4 | **Milestones on long paths.** Long paths (research, habit, ladder) show steps passed, not percent of power. Default: three to five named steps. | Steps read as story; percent reads as grind. |
| PF5 | **Rarity without caps.** Rare options are rare because their events are rare, not because there is a count limit (no "once" rule). Default: rarity is shown as how many lives have opened it, from the profile. | Matches the no-once-limits note. |
| PF6 | **An earned shelf.** The profile shows earned starts, bodies, eras and cheats as a shelf with silhouettes between them. Default: grouped by world. | Seeing the gaps is the hint (EO9). |
| PF7 | **Offline earns arrive as a list on return.** Habits and research finished while away show as one "while you were away" list with receipts. | Idle play earns too; the return screen is the moment. |
| PF8 | **Earned does not mean final.** An earned cheat can grow (CA11 fusion, ladder rungs) so the receipt is the start of its arc, not the end. | Prevents "got it, done." |
| PF9 | **Witnesses react.** After an earning event with witnesses, at least one NPC remarks on it within a few days. | Rule 6 and the world remembering make earning social. |
| PF10 | **Failure receipts are kind.** A failure that opens an option says so plainly and points at the new door. | Turns a loss into a gain the player can see. |
| PF11 | **The heir screen as a harvest.** At death, the heir screen lists what the life earned for the line and for the profile, in two columns. | Replaces "one lesson" with a real summary of the accepted heir rule. |
| PF12 | **Choice-opened entries look different.** Options opened by the EO11 dial show a plain mark; earned ones show their receipt. | Keeps both honest without judging the player's choice. |

## 5. Suggestions (cheapest first, grounded in current code)

1. **Add acquisition origins and show them.** Extend `SOURCE_ORIGINS` (`src/capabilities.js:5`) and the effect check (`src/expansion_engine.js:116`) with values like `granted`, `awakened`, `bought`, `stolen`, `found`, `given`, `fused`, `habit`, `contracted`. Show one "how you got it" line in the source tooltip. Save impact: additive enum, old saves validate as is; a save written with a new origin will not load in an older build, so note it as a forward-only change.
2. **Dormant cheats via the existing flags.** Grant one source with `awakened: false` and an awakening rule; the faculty check already ignores it until then (`src/capabilities.js:54`). Show it as a silhouette (EO9). Save impact: no shape change; the flag is already stored.
3. **A lineage earned ledger on the heir path.** Add a small `expansion.lineage.earned` list copied in `buildLifeHeirSave` (`src/life_experience_host.js:8-25`), separate from `life_record` (which says it is not a reward authority, `src/life_record.js:1`). Build it inside the planned heir slice that replaces "one lesson" (`src/chronicle_ui.js:56`, `src/chronicle.js:273-280`). Save impact: new field with a migration that defaults to empty; this changes the built heir flow, which CHEAT_LIBRARY marks as needing Weibao's go.
4. **A profile store on the layout-key pattern.** A separate localStorage key with its own schema, like `src/workspace_layout.js:32,76`, which `hard_reset` leaves alone (`src/main.js:7005-7016`). It holds earned-option IDs, receipts and the EO11 open-everything dial. Save impact: no save change; needs its own export/import (or a copy embedded in save export, merged by union on import) and a decision on whether a reset clears it.
5. **Earned starts at creation, opt-in.** Read 3 and 4 at character creation and at the heir screen to add earned starts beside the vanilla ones, which stay open (`src/character_creation.js:60-66`, rule 8). First candidate: MoL PML9 settled lodger (EW22), since the MoL runtime already exists. Save impact: the MoL `entryProfile` is fixed today (`src/book_world_mol_state.js:24`), so a second entry profile needs a schema bump and migration.

No sealed-secret IDs touched.
