# Full-world production method: how to make a whole detailed world at scale (proposal, 2026-10-13)

Weibao (2026-10-13): "how to consider implementing full world and fleshing out every little detail and more? locations, people, interactions, ability and more?"

Everything here is a proposal. Nothing is accepted, implemented or verified. No build, test or browser ran for this file. Repo paths are relative to `/Users/weiwei/code/yet-another-idle-rpg/`; line numbers come from a dirty tree on 2026-10-13 and may drift.

This file does not restate the rules. `docs/WORLD_COMPLETION_STANDARD.md` already says what a finished world covers (S00-S14, detail IDs, C0-C5 levels, P1-P5 cycle). `docs/gm/CROSS_WORLD_DETAIL_REVIEW.md` gives the 36 lenses. `docs/research/SOURCE_DEEP_DIVE_PLAYBOOK.md` covers reading a source. This file covers the missing part: **a production line** that turns a source into hundreds of entries cheaply, so "every little detail" exists at some depth without each detail costing a hand-built command and a browser campaign.

The core claim, from measuring the one real attempt (LW below): the standard is fine, but World1 hand-wrote every verb as a fully expanded command, kept accounting rows and runtime rows in different places, and applied browser-level proof to leaves. The fix is cards plus a compiler plus tiers plus lints, with browser proof per slice.

## 1. Pipeline (FW)

| Code | Consideration | Why it matters |
|---|---|---|
| FW1 | **Source census first, as a list of names, not a reading report.** Default: one pass over the source (or wiki index, SRD contents, chapter list) emits a flat census of every named place, person, group, ability, item, event and recurring custom, each with a locator and a one-line role. No design yet. Dial: for a long series, census per volume or arc. Plugs into S00 (scope and sources) and the playbook's M1 step. | World1 qualified 40 chapters into 214 contexts and 228 child proposals before deciding what to build. A census is cheaper, finishes, and gives every later step a closed list to tier. |
| FW2 | **Seven canonical inventories, one file each.** Places, people, organizations, abilities, items/materials, events/time (calendar plus scheduled happenings), customs/laws. Each row: stable ID, canonical name, aliases, locator, canon weight (FW3), tier (DT), owner family. Rows are references, not prose. | Families map to S03, S04, S07, S06, S11, S01/S05. One inventory per family lets one agent own one file (SA2) and lets lints check cross-references. |
| FW3 | **Canon weight per row.** Default scale: W3 plot-bearing (the story bends without it), W2 recurring (seen in several scenes), W1 named once, W0 implied (a town has a well even if unnamed). Dial: Weibao's fan attention lifts any row a step. | Weight drives tier promotion (DT8), so effort follows what the source and Weibao care about instead of whatever the agent read last. |
| FW4 | **Storage split by what the text is, not by world.** Private (`docs/research/novels/<world>/` and `private_packs/`, outside git): census locators, paraphrased facts, canon names for direct adaptations, compiled packs. Committed: the card schemas, compiler, lints, generic engine, original-world content, and opaque coverage counts. Follows PROJECT "Book worlds" and AGENTS (no raw prose in git). | World1 already did this (ignored DETAIL_LEDGER, opaque COVERAGE.json). Keeping the split per artifact type means new worlds need no new privacy decision. |
| FW5 | **Cards, not commands, are the authored source.** Authors write short family cards (LC, PE, IX, AB, IT, EV, IN schemas below) in YAML or JSON. A compiler expands cards into schema 2 structured pack rows (`src/structured_pack_definitions.js:32`), adding the shared precondition blocks, audience, cancellation and reservation defaults. | p08 spends 51% of its command bytes on `requires`/`completionRequires`, and 194 of 213 commands repeat the same body/vitals block (LW2). A card states only what is local. |
| FW6 | **Verb grammar fills the gaps between cards.** Generic verbs (inspect, ask, buy, sell, work, rest, repair, carry, give, learn, practice) apply to anything with a matching tag. Authored IX cards override a verb for a specific target. The compiler emits one command per (verb, eligible target) pair, or the runtime resolves it (DC6). | This is how "every little detail" gets at least one usable verb without an author writing it: a W1 bucket in the census becomes "inspect, buy, carry" for free. |
| FW7 | **Validators and lints between cards and pack.** Reference check (every ID exists), tier floor check (each tier's required fields present), sealed-name lint (no S-ID truth in public labels, per G's RF19/EI11), style lint, canon-claim lint (each W2/W3 fact cites a census locator or carries an "original" label). Runs in seconds, per file. | Most World1 review findings were source-integration shape errors (ENGINE_GAP F1/F2). A lint catches those before an agent spends a browser run. |
| FW8 | **Generic engine consumes the pack, not the card.** Default: the runtime reads compiled pack rows and existing capabilities (`native-stock, custody, jobs, recipient-care, source-function`, `structured_pack_definitions.js:9`). A card field with no consumer fails the lint instead of becoming a new host file. | Keeps the "new world = new host file" pattern from growing (59 `*_host.js` files today, DC1). |
| FW9 | **Verification by layer.** Card lints per commit; compiled-pack unit tests per family (each verb template once, not per instance); one rebuilt fresh-origin browser journey per slice, with save/reload/import when the slice persists anything (AGENTS). Plugs into S14 and the C2 level. | Matches proof cost to risk: a template proven once covers its 200 instances; the browser proves the joins. |
| FW10 | **Coverage is computed, not kept.** A script reads inventories plus compiled packs and prints per family: rows by tier, rows with a consumer, rows with a browser-proved template, open W3 rows. That printout is the S00-S14 status for the world. | World1 kept 3,803 hand-maintained accounting rows while 2 units shipped (LW1). Computed coverage costs nothing to keep current. |

## 2. Depth tiers (DT)

Every census row has a tier. A tier is a promise about what the player can do with it, plus the cheapest proof that promise holds.

| Code | Consideration | Why it matters |
|---|---|---|
| DT0 | **T0 Census.** Exists in the inventory with a locator. Nothing in game. Proof: inventory lint. | Nothing is forgotten; "not yet" is visible instead of silent. |
| DT1 | **T1 Named texture.** Has a label, a one-line description, tags and a location or owner. Shows up in look/inspect text, log flavor, rumor and the notebook. Proof: lint plus one sample render test per family. | Cheapest way for a fan to see "the little details" in the world. Hundreds of rows at near-zero cost. |
| DT2 | **T2 One usable verb.** Generic verbs reach it through its tags (buy the bread, inspect the shrine, ask the miner about the road). Default: the verb grammar's output with no authored text. Proof: the verb template's unit test covers it. | Turns texture into play. Most ordinary folk, goods and minor places can stop here and still feel real. |
| DT3 | **T3 Remembered.** Has state that persists and is read back: a schedule, a need, a relationship value, a stock count, a condition, a memory of what the player did. Proof: a pack-level test that the state round-trips through save. | The life-sim feeling comes from this tier: the baker recalls the debt; the shrine runs out of healing today. |
| DT4 | **T4 Connected loop.** Joins two families in a repeatable loop with costs and alternatives (job, craft chain, lesson, duty roster). Proof: one browser journey per loop type in the slice that first ships it. | This is where the standard's cross-section joins live (`WORLD_COMPLETION_STANDARD.md` "Depth and interaction coverage"). |
| DT5 | **T5 Full arc.** Authored situations, dialogue, canon pressure points, abstention outcomes, endings. Proof: a journey per arc branch that matters, plus Weibao's acceptance (C5). | Reserved for W3 rows and what Weibao plays. This is the tier World1 was paying for everywhere. |
| DT6 | **Promotion rule, default.** Start each row at a floor by weight: W3 at T3, W2 at T2, W1 at T1, W0 as generated T1. Promote one step when (a) Weibao touched it in play or chat, (b) a T4/T5 loop needs it, or (c) three other rows reference it. Dial: a world can set higher floors for its signature family (abilities in D&D, people in a school story). | Effort lands where play and canon weight point. "Every little detail" is satisfied at T1-T2 breadth, with depth growing from attention. |
| DT7 | **Demotion and parking.** A row whose consumer is removed, or a promotion that stalls, drops back to the highest tier still proved. Reasonably: its extra card fields stay as data, marked dormant. | Unfinished work stays honest and nothing pretends to be deeper than its proof. |
| DT8 | **Tier visible to agents, hidden from the player by default.** The coverage printout (FW10) and the card carry the tier; the UI does not list "unexplored T3 people". | The author checklist does not become a spoiler list (standard's "Preserve the little details"). |
| DT9 | **Tier per facet, not just per row.** A person can be T5 in dialogue but T2 in trade. Cards declare tier per facet (place, schedule, trade, dialogue, ability, memory). | Avoids promoting a whole entity to full arc because one facet matters. |

## 3. Per family

### Locations (LC)

| Code | Consideration | Why it matters |
|---|---|---|
| LC1 | **Card holds:** id, name, aliases, parent (region > district > site > room), tags (indoor, shrine, market, water, mine), hours, owner/keeper, shelter, light, access rule (public, paying, permission, hidden), connections with travel minutes, ambient line set, canon weight, tier per facet. | One shape from region to room lets the same lint and verb grammar work at every scale. |
| LC2 | **Generic vs authored.** Generic: travel, enter/leave with access check, look, rest if sheltered, shop if it hosts a vendor, work if it hosts a job. Authored: one signature verb per T4 place (pray at a shrine, read the exchange board). | Places stop needing per-world host code for movement and shelter. |
| LC3 | **Hierarchy is how breadth scales.** Default: a district card lists its sites; unnamed sites (W0) are generated from district tags ("two cottages, a smithy") at T1. Dial: dense canon districts list everything by hand. | A town feels full without someone naming every house. |
| LC4 | **Hours and ambient sets carry life cheaply.** A place's hours plus three or four time-of-day ambient lines (V7 header, log flavor) cost one line each and read as a living town. | Delivers the presentation lane's V6/V7 per place with no new system. |
| LC5 | **Changed places are state, not new places.** A burned inn is the same location card with a condition (damaged, rebuilt, closed) and a different ambient set. | Keeps IDs stable for saves and for AU overlays. |
| LC6 | **AU override.** An overlay patch (G's EI1) can change access, owner, condition or connections; it cannot silently delete a place that a save references. Reasonably: removal turns it into an unreachable "gone" state with a reason. | Parallel copies stay save-safe. |
| LC7 | **Fog and discovery.** Default: a place is known to the player only once seen, told, or on a held map (CW25). Card declares `knownBy` sources. | Notebook and map honesty without per-place code. |

### People (PE)

| Code | Consideration | Why it matters |
|---|---|---|
| PE1 | **Two populations, one schema.** Canon cast (W1-W3, hand-carded) and ordinary folk (generated from a household or trade table, W0). Both compile to the same person row (`simulation.people` in the pack). | Village lives today are capped at 32 people and hard-coded families (`src/npc_lives.js:26`); one schema lets generated folk scale and canon folk deepen. |
| PE2 | **Card holds:** id, name, aliases, role, home, work site, schedule (blocks by local hour and weekday), needs (food, rest, coin, a want), means (skills, abilities, tools held), voice tags (curt, formal, kind), relationships (id, kind, value), knowledge seeds, what they remember about the player (empty at start), canon weight, tier per facet. | Each field is one line; the engine reads schedules, needs and memory generically. |
| PE3 | **Schedules first, dialogue later.** Default T3 for anyone with a job: they are at the forge in work hours, the inn in the evening, home at night. Dial: canon cast with known routines override it. | A person being where they should be is the cheapest believable life. It also makes "find someone" a real verb. |
| PE4 | **Needs drive generic behavior.** A hungry porter buys bread; a broke miner takes odd work and asks the player for some. Reasonably: needs produce offers and trades the engine already supports (jobs, recipient-care). | Gives ordinary folk motion without authored scenes. |
| PE5 | **Memory as small receipts.** The person stores short typed records ("paid late", "helped with bag", "refused shrine work") with a witness flag and decay. Reads back through dialogue and prices. | Matches G's RF12 institution memory; the per-person version can land first as pack facts. |
| PE6 | **Canon cast voice and biography are private, sourced and bounded.** A W3 person card cites census locators for each known fact; anything not sourced is labeled original. HP's ledger already flags canon voice as unsourced, which gates direct scenes. | Prevents invented canon and keeps the canon-claim lint meaningful. |
| PE7 | **Generated folk stay ordinary by default.** Generation tables produce trades, households, names fitting the culture, one want and one habit. Dial: a small chance of a notable secret is a sealed route, referenced by ID only. | Keeps generation from spawning plot. |
| PE8 | **AU override.** Overlay patches flip relationships, swap roles, move homes, or mark someone dead or alive at the fork. The counterpart map (G's EI3) links base and copy person IDs. | Relationship flips and start shifts become data edits, which is what makes AUs cheap. |
| PE9 | **Life events reuse the yearly engine.** Births, marriages and deaths from `npc_lives` generalize to any world's folk table with a world calendar (G's RF6). | One owner for life events across worlds. |

### Interactions (IX)

| Code | Consideration | Why it matters |
|---|---|---|
| IX1 | **Grammar: verb x tag -> template.** Each generic verb lists which tags it accepts and the template it produces (costs, duration, effects, refusals). Example: `repair` accepts `torn`, `broken`, `cracked` on things with `fabric`, `metal`, `wood`. | One template proven once covers every eligible target (FW9). |
| IX2 | **Shared precondition macros.** Named predicates (`able_bodied`, `has_hands`, `holds(itemTag)`, `at(place)`, `knows(fact)`, `speaks(local)`) expand at compile time. | Removes the repeated alive/ready/health/mobile/hands block present in 194 of 213 p08 commands. |
| IX3 | **Authored overrides by specificity.** Resolution order: exact target card > target tag + world > generic verb. An override can replace text, add a cost, add an alternative, or block. | Lets a W3 item behave uniquely while everything else uses the grammar. |
| IX4 | **Dialogue as typed beats, ink for arcs.** T3 people get a small beat table (greet, ask about X, ask for work, refuse, thank) filled from voice tags and memory receipts. T5 arcs use ink (`src/ink_narrative.js`) with knots bound to card IDs. | Most talk needs no ink file. Ink stays for arcs, where it is already the owner. |
| IX5 | **Reputation reads memory, not a single score.** Default: standing toward a person or institution is computed from memory receipts with decay; prices, offers and greetings read it. Dial: a world with a formal score (house points, renown) shows that number as one institution's view. | Avoids a new integer region per world (`src/reputation_state.js:6-16` throws on unknown regions). |
| IX6 | **Refusal and abstention are verbs too.** Every authored offer card declares what happens if the player says no or does nothing by a deadline. | Canon runs without the player (G's EI10) and choices have weight. |
| IX7 | **Audience is a default, not a hand edit.** The compiler sets `audience` (required by `structured_pack_definitions.js:84`) from the verb: private for inspect, co-located for trade, public for a shout. | Removes a field authors kept repeating and sometimes got wrong (ENGINE_GAP F1). |
| IX8 | **AU override.** An overlay can disable a verb for a world (no Apparition in a No-Statute copy) or retune its template costs. | Rule changes in an AU stay one patch line. |

### Abilities (AB)

| Code | Consideration | Why it matters |
|---|---|---|
| AB1 | **One ability card schema for every world.** Fields: id, name, source (spell list, technique, Sequence, Aspect), requirements to learn, how learned (teacher, book, practice, awakening, purchase), fuel (slot, mana, stamina, sanity, charge), casting or use time, range and target tags, effect as IX template(s), failure and backlash, mastery ladder, counters, legality, signature tells. Maps to the pack's `powers`, `techniques`, `advancements` families (`structured_pack_definitions.js:7-8`). | One schema means one learning engine and one cast engine. `docs/worlds/ABILITY_AUTHORING.md` owns the authoring rules; this is its data shape. |
| AB2 | **Effect is an interaction template.** Mending is `repair` with a magic route; Cure Wounds is `heal` with a slot cost. The ability card points at IX templates plus its own limits. | Abilities and mundane verbs share proof: a spell that repairs uses the same object consumer as a needle (FIRST_SLICE E03). |
| AB3 | **Learning, execution, mastery are three states.** Learned (can attempt), practiced (reliability grows with uses), mastered (a qualitative unlock the source supports). Default: mastery effects come from the source; numbers are local dials. | Matches the skill-growth owners' split of skills, techniques and talents (PAUSED_HANDOFF row G1-G40). |
| AB4 | **Source-native rules ride along as a profile.** D&D slots and concentration, LOTM potions and acting, Shadow Slave Aspect plus Flaw are profile fields on the card, read by a small per-profile resolver. | Keeps worlds mechanically distinct without a new host per world; one resolver per rules family. |
| AB5 | **Cross-world carry declared per card.** `carry: keeps | converts(to) | inert | lost` plus the in-world reason. Default inert with a clear tell. | Feeds G's RF9/RF16 crossing table with data instead of special cases. |
| AB6 | **Breadth by import, depth by play.** For rule-complete sources (SRD), import the whole list at T1 (name, school, level, one-line effect) and promote spells to T2-T4 as starts or teachers need them. | "Every spell exists" becomes true early; proof cost tracks use. |
| AB7 | **AU override.** Overlay patches change availability (who can learn), fuel, or a limit, labeled as a divergence. A changed core truth is a sealed variant, ID only. | Ability AUs stay data. |

### Items and materials (IT)

| Code | Consideration | Why it matters |
|---|---|---|
| IT1 | **Card holds:** id, name, kind, tags (fabric, iron, holy, food), weight, price band, quality range, condition model (torn, worn, broken with geometry where a rule needs it), uses (IX templates it enables), recipe in/out, provenance, custody kind (owned, loaned, issued), canon weight. | One shape covers bread to artifact. |
| IT2 | **Materials are tags first.** "Lodestone", "diamond", "silver" are materials with price and source sites; recipes and spell components point at material tags. | Supply chains (who sells it, where it comes from) fall out of data. |
| IT3 | **Prices are a band per world plus local modifiers.** Card gives a base; the vendor card and season adjust. | A world economy without per-item tuning. |
| IT4 | **Unique items are custody records.** W3 items carry one custody record and provenance (`src/realm_cargo.js` manifests already avoid copying). | Fits existing save identity rules (G's R9). |
| IT5 | **Legacy home items stay code for now.** `src/items.js` (4,558 lines of classes from line 165) serves the home world; new worlds use pack item rows. A bridge maps a pack item into native inventory where needed (p07/p08 already do this for kit). | Avoids a risky rewrite while letting new worlds be data. |
| IT6 | **AU override.** Overlay can change availability, price, or an item's existence at the fork. | Scarcity AUs become one patch. |

### Events and time (EV)

| Code | Consideration | Why it matters |
|---|---|---|
| EV1 | **Calendar card per world.** Day length, week, months, named days, seasons, festival windows. Maps instance elapsed time to a local date (G's RF6). | Schedules, needs and festivals all need a local clock. |
| EV2 | **Event card holds:** id, when (date, window, trigger fact), where, who, what changes if the player is absent, what the player can do, canon weight, sealed ref if any. | Canon runs as data (G's EI10), and abstention is designed. |
| EV3 | **Recurring events are cheap breadth.** Market day, shift change, sermon, payday as T2 events with one ambient line and one verb. | A week feels like a week. |
| EV4 | **Absence policy per world remains a dial on G's RF7.** Default freeze (today's only policy, `src/world_instances.js:111`). Card declares the intended policy so the data is ready when the engine accepts more. | Data is not blocked on the migration. |
| EV5 | **AU override.** The fork is an event card with a changed outcome; downstream events read the flag (G's EI7). | One card defines an AU's starting history. |
| EV6 | **Rumor and news as event carriers.** Default: an event the player missed reaches them later through a carrier (gossip at the inn, a posted notice, a letter) with delay and distortion by distance. Reasonably: carriers are T2 people and places already in the census. | Missed canon still lands in the player's life, and gossip reuses PE memory instead of new code. |

### Institutions (IN)

| Code | Consideration | Why it matters |
|---|---|---|
| IN1 | **Card holds:** id, name, kind (guild, shrine, school, garrison, gang, government), seat location, members (person IDs with ranks), services (IX templates offered), duties and dues, rules (what it punishes or rewards), memory policy (what it records and how fast gossip spreads), relations to other institutions. | Shrines, guilds, houses and companies share one engine. |
| IN2 | **Services are interactions with gates.** A shrine sells healing, a guild sells training, an exchange posts jobs; each is an IX template gated by standing. | Reuses IX and IX5 standing; no new institution code per world. |
| IN3 | **Duty rosters are the institution's loop.** A garrison posts shifts, a school sets classes, a mine sets work. Players and NPCs fill slots. | This is the T4 loop A Soldier's Life already wanted (roll call) and HP needs (classes). |
| IN4 | **AU override.** Flip an institution's allegiance, leader or legality in the patch. | Political AUs are cheap. |
| IN5 | **Ranks and offices are rows, not titles.** Default: a member's rank grants specific IX templates and duties, read from the card; a title alone grants nothing (PAUSED_HANDOFF skill-growth row keeps ranks and offices distinct). | Promotion becomes an unlocked verb set the player can feel. |
| IN6 | **Gossip speed per institution.** Card declares how fast and how far its memory spreads (a shrine tells its faithful in a day, a garrison records forever, a gang remembers grudges). Feeds G's RF12. | Reputation feels local and specific instead of one global number. |

## 4. Data vs code (DC)

| Code | Consideration | Why it matters |
|---|---|---|
| DC1 | **Today, worlds are mostly code.** `src/` holds 408 files including 59 `*_host.js` and 62 `*_content.js`. MoL is 7 files and Paradise 11 (1,793 lines together); `world_completion_*` is 2,251 lines. MoL's cast is a hard-coded JS array (`src/book_world_mol_content.js:7-18`). | Each new world adds hosts, IDs, state and native adapters, so world count multiplies code review and save risk. |
| DC2 | **Structured packs are the data seam that already works.** Schema 2 packs compile with ID-prefix ownership (`src/structured_pack_definitions.js:32-60`, `ownedId` at :41), register per pack (`src/content_packs.js:82`) and save provenance per pack ID (`src/content_packs.js:120`). World1's p02-p08 run on it. | New canon worlds can start as packs with zero new host files, if the capabilities fit (G's R12). |
| DC3 | **The pack format is low-level, so authors hand-expand.** p08: 213 commands are about 88% of the compact pack bytes; 51% of command bytes are preconditions; 167 of 213 descriptions equal their labels. `src/ink_scene_content.js:12-14` shows the fix already exists in code form (helper functions `knowledge`, `narrative`, `eq`), but packs have no macro layer. | A card compiler (FW5) moves that helper pattern into a dev script so private packs get it too. |
| DC4 | **Revisions are full snapshots.** Each World1 revision is a new full pack (p07 545 KB to p08 928 KB, all eight kept in `private_packs/manifest.json`). | Card sources plus a compiler make a revision a small source diff; frozen compiled snapshots can stay for old saves. |
| DC5 | **What shifts to data.** Places, people, schedules, items, prices, calendar, recurring events, ability lists, institution services, dialogue beats and AU patches. What stays code: verb templates, per-rules-family resolvers (d20, potions, Aspects), the clock and absence planner, custody and save. | New worlds become cards plus at most one rules resolver. |
| DC6 | **Engine improvements this depends on, from G.** EI1 overlay packs and EI2 divergence metadata (AUs), EI4 start-era picker, RF6 calendar, RF12 memory records, RF4 world UI card, RF19/EI11 lints. New here: a card compiler, a verb-grammar expander, and a coverage printer (all dev scripts, no save change). | Ordering: compiler and lints first (no runtime risk), then calendar and memory (migrations). |
| DC7 | **Capability fit is the main runtime limit.** Five capabilities exist (`structured_pack_definitions.js:9`). Schedules, memory receipts and standing may need a sixth or seventh capability with an actual consumer (the compiler rejects capabilities without one, :100). | Each new capability is a reviewed engine slice, not a per-world host. |
| DC8 | **Dialogue is global today.** Ink content is one compiled story plus retained versions (`src/ink_narrative.js:1-15`); packs carry no dialogue family. | Beat tables (IX4) can ship as pack facts first; pack-scoped ink is a later engine step. |
| DC9 | **Strict shapes are good for this.** World instances reject unknown keys (`src/world_instances.js:39-41`) and the pack compiler rejects executable keys (:37). The card layer can be loose for authors because the compiled pack stays strict. | Authors move fast while the runtime stays safe. |

## 5. Scale and agents (SA)

| Code | Consideration | Why it matters |
|---|---|---|
| SA1 | **Census is one agent per source volume, then one merger.** Census agents emit inventory rows only; a merger dedupes aliases and assigns IDs. | Parallel reading without ID collisions. |
| SA2 | **Authoring is one agent per family per district.** Example: Phandalin people, Phandalin places, Phandalin items, D&D abilities (world-wide). Each owns its inventory file and card folder; reads others. | AGENTS "one writer per file area" without merge fights; hundreds of cards per hour of agents. |
| SA3 | **Lints gate every card batch.** FW7 lints plus compile success are the acceptance for T1-T3 batches. No browser run per card. | Moves proof cost from per-detail to per-template. |
| SA4 | **Browser proof is per slice and per new template.** A slice ships when its T4/T5 journeys pass on a rebuilt fresh origin with save/reload/import. A new verb template gets one journey the first time it ships. | Keeps AGENTS verification intact while cutting the number of runs. |
| SA5 | **Reviewer samples, not reads all.** A reviewer reads all T4/T5 cards and a random 10% of T1-T3 cards per batch, plus every lint warning. | Review time scales with risk. |
| SA6 | **Sealed secrets live in sealed card fields.** A card can hold `sealed: S-ID` pointing to a sealed owner file; public labels, coverage printouts and reports show the ID and route only. The sealed lint fails on any sealed term in public fields. | Matches the sealed rule while letting the same pipeline build secret routes. |
| SA7 | **What Weibao sees.** Per slice: a short playable note (where to go, what to try), the coverage printout's headline counts by tier, and a short list of W3 choices made as proposals. He accepts by playing; tags like "more on PE5" re-enter via F's WI8. | He reviews play, not 3,000 rows. |
| SA8 | **One integrator for compiled packs and manifest.** Default: card writers leave `private_packs/` to the integrator; the integrator compiles, hashes and registers. | Avoids the multi-candidate drift World1 spent effort reconciling (LW5). |
| SA9 | **Budget by tier.** A district aims for roughly: all census rows T1, half T2, a tenth T3, a few T4 loops, one T5 arc. Dial per world. | Gives agents a stopping rule per pass. |

## 6. Lessons from World1 (LW)

| Code | Consideration | Why it matters |
|---|---|---|
| LW1 | **Accounting outgrew delivery.** 3,803 ledger rows across all S00-S14, all gates open, against 2 delivered connected units (W1-FULL-U01, U02) (`docs/gm/dispatch/world1-full-completion-2026-10-11/PAUSED_HANDOFF.md` "Full retained horizon"; `UNIT_DELIVERY.json`). | Ledgers should be computed from content (FW10), not hand-grown ahead of it. |
| LW2 | **Hand-expanded commands.** p08: 8 locations, 48 items, 12 sim people, 213 commands; 194 commands repeat the same body/vitals precondition block; 82 have a completion check copied from requirements (measured from `private_packs/p08/pack.json`). | Macros and templates (IX1-IX2) would cut most authoring and review. |
| LW3 | **Proof granularity was the leaf.** 401 then 417 source tests plus native groups per unit; one stitched native run with timing races (N5 cancellation raced a short job) and N2-N4 unrun (`PAUSED_HANDOFF.md` F2-F4). | Browser proof per slice and per template (SA4); leaves get lints and unit tests. |
| LW4 | **Assignment wording forbade slices.** The goal excluded "single region" or "early edition" delivery (`ASSIGNMENT.md` "Sole outcome"), so no scope could finish. | Tiers (DT) give "full world" a finishable meaning: everything at T1+, depth where it matters. |
| LW5 | **Coordination ate time.** Candidate worktree vs shared tree, ownership releases, frozen p01-p07 hashes, preview ports, foundation handoffs (`CHECKPOINT.md`, `FOUNDATION_OWNERSHIP_RELEASE_2026-10-12.json`). | One integrator for packs (SA8) and card sources in one place reduce sync work. |
| LW6 | **Foundations blocked it.** Paused for shared person/body, clock, knowledge, learning and ownership foundations (`PAUSED_HANDOFF.md` reconciliation table). | Data cards can be authored while foundations land; the compiler targets whatever capabilities exist. |
| LW7 | **What scaled.** The schema 2 pack seam, prefix-owned IDs, frozen compiled packs for old saves, private/committed split, real generic consumers (custody, energy reservation, identified-copy return) that later worlds can reuse (`PAUSED_HANDOFF.md` F1). | Keep these; the method builds on them. |
| LW8 | **Generic repairs came from real content.** The two review findings (NPC-only command projection, player-owned unit admission) were engine gaps found by a real pack (`ENGINE_GAP_DISPOSITIONS.json`). | Breadth content is also the best engine test; run the card compiler over a whole district early. |
| LW9 | **Counts were never percentages.** World1 stated counts are mixed artifact types, not progress (`COMPLETION_MATRIX.json` "countsClaim"). | Tier counts (DT) are comparable and can be read as progress per tier. |

## 7. Worked example: D&D, Phandalin town core

**Choice: D&D Phandalin.** Reasons from the source contracts:
- Rules are open and complete. SRD 5.2.1 is downloaded and parsed (`docs/worlds/dnd/SOURCE_CONTRACT.md` S02) and is published under a Creative Commons license (general knowledge; the contract asks to preserve its attribution). Ability, item and creature cards can carry real mechanics.
- A place anchor exists. The official Phandalin overview (S04) supports a rebuilt mining town with an inn, equipment sellers, a farm, a shrine and a records/trading exchange.
- A decision-ready slice exists. `docs/worlds/dnd/FIRST_SLICE.md` defines starts ST1-ST3 and the PS01-PS06 bag-repair journey.
- Harry Potter's ledger has publisher synopsis and companion pages only, with no full text acquired and canon voice flagged as unsourced (`docs/worlds/harry-potter/SOURCE_LEDGER.md`), so its census would be thin and its people cards would mostly be labeled original.

Limits that stay labeled: the Lost Mine of Phandelver chapter body is not read (S07). Adventure plot, hidden locations and named NPC biographies stay U (unresolved) until a chapter route exists, and direct-setting content goes into a private pack.

### Census, town core (excerpt)

| ID | Kind | Name | Source | Weight | Starting tier |
|---|---|---|---|---|---|
| dnd.ph | district | Phandalin town core | S04 | W3 | T3 (places facet) |
| dnd.ph.inn | place | Town inn (Stonehill Inn, general knowledge) | S04 | W2 | T3 |
| dnd.ph.provisions | place | Equipment seller | S04 | W2 | T2 (trade T3) |
| dnd.ph.trading | place | Second trading post | S04 | W2 | T2 |
| dnd.ph.farm | place | Farm at the town edge | S04 | W1 | T2 |
| dnd.ph.shrine | place | Shrine (to a luck deity, general knowledge) | S04 | W2 | T3 |
| dnd.ph.exchange | place | Records/trading exchange | S04 | W2 | T3 (job board) |
| dnd.ph.ruins | place | Old ruined buildings from the earlier town | S04 history | W1 | T1 |
| dnd.ph.cottages | place group | Generated homes and workshops | W0 | W0 | generated T1 |
| dnd.ph.miners | people group | Generated miners and prospectors | S04 mining | W0 | generated T2 |
| dnd.ph.carrier | person | Tamsin Reed, carrier (original) | FIRST_SLICE PS01 | W1 | T3 |
| dnd.ph.innkeep | person | Innkeeper (canon name private, bio U) | S04 | W2 | T3 schedule, T2 talk |
| dnd.ph.shrinekeeper | person | Shrine keeper (canon name private, bio U) | S04 | W2 | T3 |
| dnd.ph.gang | institution | Local troublemakers (general knowledge; details deferred to S07) | U | W3 | T0 until sourced |
| dnd.ph.shrine_org | institution | Shrine and its services | S04 | W2 | T3 |
| dnd.ab.mending | ability | Mending (cantrip) | S02 p148, C06 | W2 | T4 (slice) |
| dnd.ab.cure_wounds | ability | Cure Wounds | S02 p121 | W2 | T3 |
| dnd.ab.guidance | ability | Guidance | S02 p138 | W1 | T2 |
| dnd.ab.srd_spells | ability group | Rest of the SRD spell list | S02 | W1 | T1 import |
| dnd.it.workbag | item | Carrier's work bag | FIRST_SLICE | W1 | T4 (slice) |
| dnd.it.thread | item | Needle and thread | general | W0 | T2 |
| dnd.ev.tenday | calendar | Tenday week, Harptos months (general knowledge) | U, needs source | W2 | T2 |
| dnd.ev.supply_run | event | Weekly supply run | original | W1 | T3 |

### Sample cards (authoring source, compiles to schema 2 pack rows)

```yaml
# LC: location
id: dnd.ph.shrine
name: Town shrine
parent: dnd.ph
tags: [indoor, shrine, quiet, public]
hours: {open: "dawn", close: "dusk"}
keeper: dnd.ph.shrinekeeper
shelter: true
access: public
connects: [{to: dnd.ph.square, minutes: 3}]
ambient:
  dawn: "Candle stubs from the night still smoke on the step."
  day: "Someone has left a cracked mining helmet as an offering."
  dusk: "The keeper counts the day's offerings into a small box."
signature_verb: dnd.ix.pray_for_luck
source: S04
weight: W2
tier: {place: T3, services: T3}
```

```yaml
# PE: person (original)
id: dnd.ph.carrier
name: Tamsin Reed
role: carrier
home: dnd.ph.cottages.reed
work: dnd.ph.exchange
schedule:
  - {hours: "6-8", at: dnd.ph.inn, doing: breakfast}
  - {hours: "8-16", at: dnd.ph.exchange, doing: loading}
  - {hours: "16-20", at: dnd.ph.inn, doing: supper}
  - {days: [supply_day], hours: "6-18", at: dnd.route.triboar, doing: supply_run}
needs: {coin: low, want: "get the bag fixed before the supply run"}
means: {skills: [athletics], holds: [dnd.it.workbag]}
voice: [blunt, warm_once_helped]
relationships: [{to: dnd.ph.innkeep, kind: regular, value: 2}]
memory: []          # receipts appended at runtime
original: true
weight: W1
tier: {schedule: T3, talk: T3, trade: T2}
```

```yaml
# IX: interaction template plus an authored override
id: dnd.ix.repair
verb: repair
accepts: {condition: [torn, broken], material: [fabric, leather, metal, wood]}
requires: [able_bodied, has_hands, can_reach(target)]
routes:
  - {id: mundane, needs: [holds(tag:needle_thread), skill(sewing)], minutes: 60}
  - {id: hire, needs: [coin(price_band.repair)], via: person_with_role(tailor|smith)}
  - {id: spell, needs: [knows(dnd.ab.mending), ability_ready(dnd.ab.mending)]}
refuse_if: [{condition_size_gt: "1 ft", route: spell, say: "The tear is too large to mend this way."}]
audience: private
on_done: [set(target.condition, intact), receipt(owner, helped_repair)]
override:
  target: dnd.it.workbag
  add_effect: unlock(dnd.ev.supply_run.full_load)
```

```yaml
# AB: ability (mechanics paraphrased from SRD 5.2.1, general knowledge for components)
id: dnd.ab.mending
name: Mending
source: {profile: srd521, kind: spell, level: 0, school: transmutation, ref: "S02 p148"}
learn: [class_list(wizard, cleric, bard, druid, sorcerer), teacher, scroll_copy]
fuel: none            # cantrip
use_time: {minutes: 1}  # C06
target: {tags: [object], one_break_up_to: "1 ft"}
effect: dnd.ix.repair#spell
components: [verbal, somatic, material(tag:lodestone_pair)]
mastery: {practiced: "faster setup feel only", mastered: none}   # SRD has no mastery; local dial off
carry: {default: inert, reason: "the Weave does not answer outside its world"}
weight: W2
tier: T4
```

```yaml
# IT: item
id: dnd.it.workbag
name: Carrier's work bag
kind: container
tags: [fabric, leather_trim, carry]
owner: dnd.ph.carrier
custody: owned
condition: {state: torn, tear_inches: 6}
capacity: {intact: 30, torn: 10}
price_band: low
uses: [dnd.ix.repair, dnd.ix.carry]
weight: W1
tier: T4
```

Compiled, the repair template expands to one command per eligible (target, route) pair, adds the `able_bodied`/`has_hands` block, sets `audience`, `cancellation: refund` and reservation returns, and writes `dnd.ph.*`-prefixed rows into a private pack. The same template later serves every torn or broken object in town with no new authoring.

### First vertical slice, then the breadth pass

**Vertical slice (one start, one loop, all tiers present).** ST2 itinerant student (FIRST_SLICE). Journey PS01-PS06: meet Tamsin at the inn by her schedule, inspect the bag, agree terms (cash, board or a lesson), repair by spell, needle or hire, carry the full load on the supply run (capacity 10 to 30), settle once, and see Tamsin's memory receipt change her greeting and price next day. Around it: the shrine, inn, exchange and equipment seller at T2-T3 with hours and ambient lines; generated miners at T2; Cure Wounds and Guidance at T2-T3. Proof: card lints, compile, a repair template unit test (positive, oversized tear rejected, unreachable target rejected), one rebuilt fresh-origin browser journey with save/reload/import at agreement and after settlement. Needs, from G: the d20 resolver (FIRST_SLICE E02) for the route obstacle, or a deterministic route for this slice; the memory receipt may fit as pack facts first.

**Breadth pass (same district, no new engine).** Census to T1 for every row; all generated cottages and folk from tables; all S04 places to T2 with hours and one verb; the SRD spell list imported at T1; all SRD mundane gear imported as item cards at T1-T2 with price bands; the tenday calendar and market day as T2 events. Lints and compile only, plus one browser smoke pass that walks the town and buys, inspects and asks once. Then ST1 and ST3 as the second and third vertical slices (ST3 shrine helper reuses the shrine and Cure Wounds cards, which is G's BO3).

## 8. More to consider (MC2)

| Code | Consideration | Why it matters |
|---|---|---|
| MC2-1 | **Wiki and SRD importers as census tools.** Default: a script turns a structured index (SRD contents, a wiki category page saved locally) into T0 census rows with locators. Reasonably: wiki rows stay leads until a primary locator confirms them (the playbook's wiki cross-check). | Census time drops from hours to minutes for well-indexed sources. |
| MC2-2 | **Generation tables are content too.** Name lists, trade mixes, household shapes and habits per culture are cards with sources, reviewed once. | Generated folk feel like that world instead of generic. |
| MC2-3 | **"Attention heat" from play logs.** The coverage printer can read which cards the player touched in a save (dev-only, generated saves) and suggest promotions (DT6 rule a). | Promotion follows real play without Weibao writing lists. |
| MC2-4 | **Shared card libraries across worlds.** Common materials, mundane tools, weather types and generic trades live in a shared library that worlds import and re-tag. | A blacksmith card is written once for D&D, ASL and Skyrim-like worlds. |
| MC2-5 | **Canon-slot vs original-slot cards.** A card can be a slot ("the innkeeper") filled by canon data in the private pack and by an original stand-in in a committed demo pack. | Lets public builds and tests run the same district without private text. |
| MC2-6 | **Template coverage report.** For each verb template, count eligible targets in the world. A template with 0 targets is dead; one with 300 is high-value proof. | Tells reviewers where a single test buys the most. |
| MC2-7 | **Card diffs as the AU authoring view.** An AU is shown to authors as "these 14 cards differ from base", generated from G's EI11 diff. | Makes AU review fast and keeps drift visible. |
| MC2-8 | **Detail budget by session length.** A tier mix tuned so a 20-minute play session meets several T2-T3 details and one T4 loop. | Breadth lands where the player will actually see it. |
| MC2-9 | **Translation of existing World1 packs into cards.** A one-time decompiler from p08 to cards (dedupe macros, merge label/description) gives the paused world a cheaper path when resumed. Reasonably gated on Weibao's resumption (G's R11). | Reuses World1's 213 commands instead of re-authoring. |
| MC2-10 | **Locale and voice lint.** Flag modern idiom in a medieval world, wrong currency words, or a voice tag that the dialogue beat contradicts. | Small fan-noticed details that break immersion get caught by machine. |

### Suggestions (ranked)

1. **Build the card compiler with precondition macros and one verb template (`repair`)**, run it against the Phandalin slice cards and a decompiled slice of p08 to compare size and output. Dev script only, no save change.
2. **Add the lints and the coverage printer** (reference, tier floor, sealed, style, canon-claim) so card batches get accepted without browser runs.
3. **Ship the Phandalin ST2 vertical slice** (PS01-PS06) as a private pack from cards, with one rebuilt browser journey and save/reload/import.
4. **Run the Phandalin breadth pass** to T1/T2 with SRD imports and generated folk, then ST3 shrine helper as the second slice.
5. **Write the PE schedule and memory-receipt capability** as the first engine slice beyond today's five capabilities, since people life is the biggest gap across HP, ASL, TTKS and MoL.

Later: the World1 decompiler (MC2-9) once Weibao resumes or releases that area; HP census once a fuller source route exists; shared card libraries after two worlds use the compiler.
