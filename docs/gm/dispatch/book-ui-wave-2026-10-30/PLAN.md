# Book UI and feature wave (2026-10-30)

Weibao: "improving intuitive ness for areas like UI, working on unimplemented UI, working on implementing things needed for the UI, taking into consideration info from Fufture COI readings nad stuff not considered iyet in the earlier readings? Send out similar UI and feature implementators for other read books? Send out sonnets to work, that can use advisor, dont duplicate work of other chats, if the other's contexts are getting full, make them hand off and pass to this one".

Coordinator: the "Book UI and feature wave" session. Proposal status for everything a lane designs (AD32). Rules: AD36, AD38, AD43, AD45, AR1-AR16, UR1-UR75, CLR3, WPR30.

## Inputs

- Merged reading rows (private, gitignored) for eight books: `docs/research/novels/<book>/private/wb8-merged-2026-10-30/` (`registry.jsonl`, `scenes.jsonl`, `fills.jsonl`, `extras.jsonl`, `affordance.json`, `merge_report.json`) for circle-of-inevitability, harry-potter, mother-of-learning, shadow-slave, godclads, perfect-run, reverend-insanity, soldiers-life.
- Shared-seam table: [reading gap map](../../../research/READING_GAP_MAP_2026-10-28.md) (GM codes; GM20 and GM21 were unowned "until an other-book wave").
- Representations (merged views, round 2 items 17-19): `docs/representations/*.md`; bridges in `src/read_models/` (L13).
- Engine seams to consume, never fork: `src/ability_records.js`, `src/spell_seam.js` + `src/spell_adapter_hp.js` (GM40), the ladder bridge, `src/observer_view.js`, `src/ui/figure.js`, `src/ui/scene_card.js`.

## Lanes (Sonnet sessions, own worktree each)

| Lane | Book | Delivers |
| --- | --- | --- |
| `bk-coi` | Circle of Inevitability | Per-representation list of what COI needs that the view lacks (round 2 item 17), cheap data-driven fixes in unheld files, and COI queue items routed to the sonnet-wave family owners |
| `bk-hp` | Harry Potter | One host-consumed HP slice at the AD43 floor (GM20/GM21 ordinary day-one life) with its UI, on the GM40 HP adapter |
| `bk-mol` | Mother of Learning | One host-consumed MoL slice at the floor (academy access GM6 and the loop view), consuming `sw-death`'s restart model rather than building one |
| `bk-ss` | Shadow Slave | One host-consumed SS slice at the floor (rank ladder and the crossing view), consuming the shared ladder and worlds-and-crossings seams |

## Not owned here (route instead)

- LOTM families, COI's second pathway (GM9 to `sw-adv`), regions and institutions (GM19, GM6 to `sw-road`), news (`sw-calendar`): sonnet-wave lanes; COI items go to them as queue entries.
- Host registration in `src/simulation.js`, `src/domain_registry.js` and `src/book_world_lotm_*`: `floor-wire` (`local_97d3526c-5987-4205-aac9-028a22ff0fab`) is the single writer. Lanes send patches.
- `src/spell_*.js`, the HP spell adapter included: `spells-gm40`. `bk-hp` consumes it and sends patches.
- Reverend Insanity (Gu upkeep): the sonnet-wave coordinator's proposed lane card, not this wave.
- Extra input: the sonnet coordinator's reading coverage audit (COI F1-F25, per-book readiness, HP/MoL/RI briefs; COI merge covers 28 of 294 shards; `build_cast_pack.mjs` is LOTM-place-bound), forwarded to all four lanes.
- Player-facing defects from the UI audit: `ui-defects`. Homes, gathering and companions views: the General UI coordinator's queue.

## Handoff

Any session in this repo past about 70% context checkpoints and hands its remaining plan to this coordinator by message.

## Budget

Weekly all-models was 64% at launch (resets 2026-11-02 18:00), above the UI wave's 60% launch line; Weibao's request overrides it. Cap four lanes. Lanes stop new work and checkpoint at weekly 70%.

| Time | Event | Weekly | 5-hour |
| --- | --- | --- | --- |
| 10-30 14:3x | Plan written; four lanes starting | 64% | 39% |

## Round 2: more to consider (2026-10-30 14:4x)

Weibao: "also general UI, like the ability stuff and more? Also implementing whats needed and more? the relationship stuff? Foundational Engine required implementation and more? absorbing best ideas from externally and more? ... Pet UI? party ui? General UI overhaul to give mroe needed capabiltiies and address gaps? ... make sure things reach comepletion and wont leave stray stuff thats just half finished? Maybe send chat to reconciliate stuff?"

Findings (evidence at 14:4x):
- F1. The 21 `rep-*` branches show 2-8 commits ahead of master, but `git cherry` and subject matching show their work landed under other hashes (integrator rebase). The strays are the 41 worktrees and stale branches, plus "implemented, below floor" slices scattered across checkpoints. No single list exists.
- F2. Abilities: `rep-abilities` round 3 (RS1-RS24) is proposals. Next slice per CHOICES #2: ghost fill, plus the G17 `learnView` Skills tab. The owner is the General UI coordinator's abilities session.
- F3. Relationships: web and bond stages are merged. Next: G18 `whoKnows` into a Knows home with an ask action into talk, and relationship bars. P3c (loyalty, keeping quiet) feeds them. The owner is the General UI coordinator's relationship session.
- F4. Companions, party and pets have no owner. Code exists (`party_ui.js` 49 lines, `companion_roster.js`, `party_battle.js`, `tempo_allies.js`, `companion_wishes.js`), along with a palette (`COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md`). No representation round 1 or 2 (reference games) ran for it. P5 (allies by goals and orders) is CHOICES #7, after P4.
- F5. Foundational engine for UI: L13 has unbridged models (G14 gatherings, TC12 curfews, G17 `learnView`, G18 `whoKnows`). The owner is `sw-bridge` (sonnet wave).
- F6. No one owns a whole-game fresh-player capability pass: what a player needs and cannot find, see or do across views. `ui-defects` fixes listed audit defects only.

ACT NOW (done in this round): F1 to F6 recorded here; lanes below.
ACCOUNT FOR NOW: every new lane ends at the floor or writes "implemented, below floor" plus a line in the reconciliation ledger. No lane leaves an uncommitted diff or an unreported branch.
LATER / DELEGATE: F2 and F3 go to the General UI coordinator (owner of those sessions). F5 goes to the sonnet coordinator for `sw-bridge`. Gathering and seasons stays queued with the General UI coordinator.

| Lane | Delivers |
| --- | --- |
| `bk-party` | Companions, party and pets: representation rounds 1-2 (reference games), one host-consumed slice at the floor, consuming `tempo_allies` and the roster rather than P5 |
| `bk-gaps` | Whole-game fresh-player capability pass at 1920x1080. Fixes top gaps in files no one holds and routes the rest to owners |
| `bk-recon` | Reconciliation: one ledger of every half-finished slice, branch, worktree, patch and below-floor receipt, with owner and next step. It cleans only what is provably landed and idle, and lists deletions for Weibao's yes |

## Round 3: design rounds (2026-10-30 14:5x, weekly 66%)

Weibao: "Debt and stuff can be part of corportation, or like the benefits system, more to consider? Send out design rounds for stuff that need them? OVerall UI pass to make things intuitive? different design posbbilities and more?"

| Lane | Delivers |
| --- | --- |
| `bk-benefits` | Round 3 in `ECONOMY_AND_INSTITUTIONS.md`: membership, benefits and debts as one institution package, three or more UI forms with a default, and gallery prototypes. It fits `bk-mol`'s academy access. |
| `bk-ui-directions` | `docs/audits/UI_DIRECTIONS_2026-10-30.md`: four whole-UI directions (refined panels, day hub, task-first, unconventional) as static mocks, plus the list of features still lacking a design round |

Status at 14:5x: `bk-coi` committed on its branch. `bk-mol`, `bk-ss` and `bk-party` have slices written with focused tests passing and are waiting on queued builds (the slot limiter is busy). `bk-hp`, `bk-gaps` and `bk-recon` are working.

## Round 4: multi-book seams, UI inspiration, corporation styles, scouting (2026-10-30 15:0x, weekly 67%)

Weibao: "Other stuff that would benefit from drawing from miltiple books ... For the whole UI direction, we would need to consider other information dense games ... Considr also absorbing or taking inspiration from Miencraft mods and other games ... Different 'corporation' styles, from company, to sect, to other similar stuff ... Search across github for anything that could be useful for use? Also search online too".

- Multi-book: law and making are each heavy in 7-8 books, with LOTM-only owners, so they go to `bk-seams`. ABL, SPL, ORG, loops and MND already have owners. ART, CRE and CUS are the next candidates once those two land.
- UI direction: `bk-ui-directions` was told to cover information-dense games, Minecraft mod UIs (JEI/EMI, FTB Quests, Patchouli, Ponder, AE2 terminals), implementation difficulty, sectioning, creativity, and the UI-system capabilities needed for full comprehensiveness.
- Corporation styles: `bk-benefits` was told to cover company, sect, church, guild, academy, military, clan, gang, secret order and adventurer association as dials on one model.
- Scouting: `bk-scout` searches GitHub and the web, extends the 10-14 and 10-15 scout docs, and adds no dependency.

## Round 5: stop line 90%, abilities with no hardcoded path (2026-10-30 15:1x, weekly 67%)

Weibao: "Raise to 90, for the ability UI and more, we shoudnt hardcode a specific path, sonce there is multiple possibilities and more? more to consider?" The lanes' stop line is now weekly 90%, with a checkpoint at 85%. Direction recorded in [USER_VISION](../../../USER_VISION.md#abilities-no-hardcoded-path-2026-10-30).

Evidence: `src/book_world_lotm_path.js` hand-writes the Seer pathway's rungs and stubs Sequence 7 as "Not offered in this slice". Other pathways are already row descriptors (`book_world_lotm_pathways.js`), and the ladder figure is world-neutral.

More to consider (proposals):
- P1. The path is a choice made from data: any pathway, realm track, class or school. The lead's book path is the default; other paths are reachable through their in-world means (WER).
- P2. One character can hold several ladders at once (sequence, learned spells, cultivation, a class), shown grouped by system and by ability source (rung, learned, item, contract, cheat).
- P3. Switches, branches and loss: neighbouring-path swaps, branching rungs, demotion or loss, mixed or wrong-order intake with its failure. All of these are data with costs, not code paths.
- P4. Knowledge gates the view. Unknown rungs show as unknown to the character (the spoiler fix the General UI coordinator committed), and a path picker shows only paths the character has heard of.
- P5. A ratchet test fails if an ability UI module names a pathway or world id, like the `observer_view` ratchet.
- P6. Other worlds prove it: `bk-ss` (ranks on the shared seam), `bk-hp` (spells), and later cultivation (Reverend Insanity).

Routing: data side (P1, P3, the Sequence 7 stub) to `sw-adv`, with a heads-up to floor-wire about the host file. View side (P2, P4, P5) to `rep-abilities`, under the General UI coordinator.

## Round 6: paths are graphs, branching and mixing (2026-10-30 15:3x)

Weibao: "not every world is a latter either? ... branching ... mix paths, to their own disaster? but then we should make things possible ... maybe tree for all of them? ... if we learn about it it can also show the benefits of stuff and paths".

Evidence: `src/ascension_paths.js` already names `pathShapes = ['ladder','tree','web','wheel','stack','field']`, but its validator only accepts ordered stages (index 0 is the entry), so only ladders work. The ladder figure draws vertical tracks.

More to consider (proposals):
- G1. One path model: a graph of nodes (states, rungs, realms, techniques) and edges (crossings with types, costs, needs and `irreversible`). A ladder is a chain; a tree, web, wheel or field is the same data. Each world picks its shape and its default view.
- G2. Branching: an edge can fork, so a choice at a node locks or keeps other branches open (a dial per world). It covers neighbouring-path swaps (LOTM), class branches, cultivation methods, and HP subject mastery, which is a field with no ranks.
- G3. Mixing is an edge kind (`mix`), not a ban. It carries the world's mechanism: conflict, instability, corruption or a rare synergy, with its odds, its signs, and what happens after. A wrong-order potion is a mix failure. Cheats or methods can change the odds (AD38).
- G4. No-shape worlds: some powers have no path at all, such as a set of skills with mastery, items, contracts or a one-off gift. The view must handle "no path" as a valid state.
- G5. The view picks its form by shape (round 2 item 18): a chain for ladders, a tree or DAG layout for branching, a web or field for webs, a ring for wheels, a list for none. One generic graph layout serves them all (an elkjs or dagre class, per `bk-scout`'s finds).
- G6. Knowledge-gated depth: each node and edge shows what the character has learned. That ranges from "a path exists" to its name, then benefits, costs, risks, mix outcomes, and real odds. Benefits of unheld paths show when learned (the "compare before commit" capability). Cheat or insight views reveal more and mark it as such; sealed secrets stay on their discovery route.
- G7. Little details: a hover preview of the next node's gains (the ghost fill already shipped), warning chips on mix edges, a "you are here" marker on every shape, the paths others in the cast walk (when known), rumoured versus confirmed nodes, and the history of nodes taken. Loss or demotion moves the marker back and keeps the trail.

Routing: G1-G4 (model and data) go to `sw-adv` (L10 owner); it extends `ascension_paths.js` with the ladder kept as the default shape and its existing descriptors unchanged. G5-G7 (view) go to `rep-abilities`. The `bk-ss` and `bk-hp` slices are the second-world checks.

## Round 7: parallel browser proofs, per-world progression (2026-10-30 15:1x, weekly 69%)

Weibao: "batch Ui usage accordingly so that not all of them have to wait? each can test their own seperately?" The browser pool default is now 4 slots (`1b08c0928`). Each run serves its own worktree on a free port. Waiters started before the change keep the old single slot until they are requeued; the five lanes were told.

Weibao: "We can use different progression systems/progression UI rather than just forcing the LOTM one? we can choose/add nuance for each world accordingly? More to consider? Other representations?"

Candidate representations (palette, not spec), each a default per world with a dial:
- A sequence ladder with digestion and acting (LOTM).
- A realm meter with a bottleneck and a breakthrough or tribulation event (cultivation: Reverend Insanity, A Regressor's Tale). Gu and aperture show as an inventory-plus-vessel view.
- Subject grades and exam results, like a report card or transcript (Harry Potter; an academy in Mother of Learning).
- Use-based skill bars that rise by doing (Skyrim-like; ordinary crafts everywhere).
- A LitRPG status window with attributes, ranks and runes (Shadow Slave, You Are Summoned).
- Rank insignia and commendations in a service record (A Soldier's Life).
- Threat ratings and classifications in a dossier, without personal growth (Worm, Godclads).
- Loop knowledge and mastery with no numbers: a notebook of what is known and practised (Mother of Learning, The Perfect Run, COI).
- Constellations or a passive tree (cheats and system-granted powers).
- Contracts and patrons: a standing with each power (warlock-style).

Notes:
- A character can show several of these at once, one per system they hold. The character sheet picks a glance line for each.
- Knowledge gating and cheat marking (G6) apply to all of them.
- Nuance per world: what the numbers mean, whether numbers show at all, what failure looks like, and who else can see your rank.

Dispatch: `bk-progression` (design round across the nine read books, plus the gallery). Model work stays with `sw-adv` and view work with `rep-abilities`. This round gives each world its default.

## Round 8: form fit and interaction (2026-10-30 15:3x)

Weibao: "For Ui implementations, alot of stuff just turned into webs for representaiton, are those even the most effective? can we be more nuanced? hovering, other stuff, and more?" AD46 (`7a194cb35`) is the standing rule. `bk-forms` measures each of the 13 `figure.js` views against alternatives such as table and inspector, matrix, cards, timeline, tree, inline bars and prose. It also builds a shared interaction layer: neighbour highlight, nested hover cards, pin and compare, filter, focus plus context, "why" on hover, and keyboard access. Replacements keep the old form as an alternate view.

## Round 9: making UIs (2026-10-30 15:3x)

Weibao: "what about the UI for crafting or potions or rune rafting and more in the future? or would be abstract into more numerical stuff? more to conisider?"

Proposal: hands-on versus abstract is a dial, not a choice. A new recipe starts hands-on; mastery folds it into numbers and a queue; the player can unfold it at any time. Unique or dangerous work stays hands-on, and trivial work starts abstract. `bk-making-ui` writes `docs/representations/MAKING_FORMS.md`. It covers each craft family's form (potions, smithing, cooking, runes and inscription, enchanting, rites, Gu, artifacts, tailoring and building), mocks the rune composition form, and shows one craft in both modes. It extends CRAFTING, MIXING and RITUALS_AND_MAKING rather than redoing them.

Browser pool: `scripts/slot_run.mjs` now has an uncommitted waiting-queue change from another session on top of `1b08c0928`. Three browser slots are in parallel use.

## Round 10: the official edition's pathway cards and gallery as UI input (2026-10-30, from the lead-life session)

Weibao: "Show me the guides and picturs! maybe we can use the cards to help build the UI? More to consider?" Source: his download of the official English LOTM (library index row 11), indexed by PG1 (`cast-lives-lanes/PG1_CHECKPOINT.md`); private viewer `docs/research/novels/lord-of-mysteries/private/guide-gallery-view/` (contact sheets beside it). What a card holds: a group header (the pathway's cluster, 9 clusters plus two Sefirot cards), the pathway name, a colored emblem, a tarot Major Arcana card (numeral, name, art) and a short ability summary. 19 pathway cards; the Sun, Tyrant and White Tower pathways have no card in this edition. No sequence ladders. The gallery holds 118 captioned images by volume and 157 chapters carry inline illustrations. Proposals, not accepted direction:

- **ACCOUNT FOR NOW: art stays private.** Card art, emblems and gallery images are the publisher's; they load only in a private build from the private pack (CLR3) and never enter tracked files, the public bundle or screenshots meant for sharing. The public build uses the same layout with generated glyphs and no art.
- **ACCOUNT FOR NOW: spoiler gating.** Cards and gallery images unlock by what the lead knows and the volume reached (LSD463): an unseen pathway is a face-down card, and gallery images from later volumes stay hidden.
- **LATER / DELEGATE: the pathway card as a form.** The card layout (group header, emblem, art slot, summary, then our own sequence ladder and known abilities below) fits AD46's card form (COV4). Build it world-neutral with slots, so another world's class or path uses the same card. Sonnet, one lane, done when the Seer path renders as a card at 1920x1080 in a rebuilt private build and a synthetic path renders in the public build.
- **LATER / DELEGATE: a pathway collection map.** All 22 pathways in their clusters (19 with card art, 3 as plain cards) as a discovery board (face-down until learned, neighbours grouped). It doubles as the neighbouring-pathway view Round 6 asks for (paths are graphs). Sonnet, after the card form.
- **LATER / DELEGATE: per-pathway accent tokens and icons.** Derive one accent color per pathway from its emblem by script (dominant hue), as theme tokens for ability chips, potions and characteristic items. Emblems serve as private icons; public builds use glyphs. Script plus Luna low to add `cluster`, `arcana` and `emblem` fields to PG1's `pathways_guide.jsonl`; done when the 19 card rows carry all three and the 3 card-less pathways are listed.
- **LATER: tarot seats.** The masked gathering's seats can show their arcana card (`gatherings.js` seats already hide personas); the card art is the seat's face in a private build.
- **LATER: portraits and illustrations.** Gallery characters become person-card portraits where PG1's join is exact; chapter illustrations appear in the "In the book" reader (LSD448) at their chapter. Needs a visual check pass PG1 could not run.
- **Taste notes for any world skin:** keep the dark parchment, emblem glow and gilt frame for chrome and headings, and set body text in a plain readable face (the cards' blackletter body text is hard to read at small sizes, UR readability rules).

## Round 11: maps, ladders past Sequence 0, emblems, and reference-imagery rules (2026-10-30, from the lead-life session)

Weibao: "world map might be useful? We can also look online for more representations ... Especially the sequence latters and the pictures/emblem for each? What about Sequence zero and above sequence zero and more? Out of universe ones ... What about the path to get up to that level ... general rules on building UI based on reference imagery? we can also take the emblems". Proposals, not accepted direction.

**What already exists locally (checked 2026-10-30).** The private wiki capture `docs/research/novels/lord-of-mysteries/wiki-api-2026-10-25/` (fandom API, 2026-10-25, CC BY-SA text, 2,021 pages, 3,871 images on disk) holds: 33 pathway pages (the 22 plus outer-deity and other pathways), pages for Above the Sequence, Pillars, Sefirot, Uniquenesses, Outer Deities, Half Great Old Ones; emblems for all 22 pathways in three styles (`*_Pathway_Foil_Symbol`, `*_Symbol2` with 32 incl. non-standard pathways, `*_Symbol3`); maps (world, Northern Continent, Loen, four fan Tingen maps at about 10 MB with boroughs, locations and transport layers, the 2025 animation's Tingen map); Tarot Club member cards and animation stills. Online (2026-10-30 search): an officially licensed LOTM online RPG by SPARK NEXA (2026; pathways as classes, Sequences 9 to 7 at launch per press), the 2025 animation, and text guides; no fan sequence-chart image of note turned up. Sources: [pocketgamer](https://www.pocketgamer.com/lord-of-the-mysteries/announcement), [hideoutgacha](https://www.hideoutgacha.com/games/lord-of-mysteries/general-info), [thegameswiki setting](https://thegameswiki.com/lord-of-mysteries/wiki/setting).

- **ACCOUNT FOR NOW: the card headers are the structure above Sequence 0.** The official guide's 9 cluster headers name the Great Old One each group of pathways converges to; per the wiki, a complete Great Old One holds the group's Sefirah, its Uniquenesses and a Sequence 1 characteristic of each pathway in it. So one graph covers the ladder end to end: Sequence 9 to 1, Sequence 0 (a true god holding the pathway's Uniqueness), the cluster's Great Old One, its Sefirah, and Outer Deities beyond the world. Round 6's paths-as-graphs view should model these as nodes above the rungs, not as a separate screen.
- **LATER / DELEGATE: the ladder view shows the way up, not only the rungs.** Each rung lists what advancing needs as discovered or unknown: formula, main and supplementary ingredients, the acting method and how digested the potion is, the ritual from the middle Sequences up, Uniqueness at Sequence 0, and the risks (loss of control, conservation of characteristics, neighbouring pathways). Unknowns show as locked lines, so the ladder doubles as the lead's research list. Sonnet, after the card form; done when the Seer rungs show requirements with known and unknown states at 1920x1080.
- **LATER / DELEGATE: a world map tied to journeys.** The fan Tingen maps (boroughs, locations, transport) fit the volume 1 journeys and place acts, and the world and Northern Continent maps fit later volumes. Default: a private-build map layer under the existing journey routes, revealed as the lead visits places (SR rules), with a plain generated map in the public build. Sonnet; done when a Tingen walk shows on the map at 1920x1080.
- **LATER: out-of-universe references are evidence, not authority.** The licensed online RPG and the animation show how official adaptations present pathways and pacing; the novel readings win any disagreement, and differences are recorded.
- **Reference-imagery rules (proposal; a UR rule only on Weibao's yes):**
  1. Take structure, not pixels: list what the reference shows and its hierarchy, then rebuild it with our forms (AD46).
  2. Split chrome from content: texture, frame, glow, palette and heading type become a per-world skin of tokens; body text stays a plain readable face (UR readability).
  3. Sort every asset by licence class before use: official art (private build only), fan art (private unless its licence is stated, with attribution), wiki text (CC BY-SA, paraphrase in tracked docs), our own generated assets (public).
  4. Gate by discovery: what the lead has not learned or reached stays face-down (LSD463, sealed-secret rules for changed truths).
  5. One emblem style per skin, with a monochrome fallback and shape cues, so color is never the only signal.
  6. When references disagree, the readings decide, then the official edition, then the wiki, then adaptations.
  7. Prove it at the target viewport (1920x1080) in a rebuilt build before calling it done.
- **LATER / DELEGATE: the emblem set.** Use the 22 `Foil_Symbol` files as the private icon set (smallest and consistent), recolored per pathway accent from Round 10, and keep `Symbol2` for the non-standard pathways. Script; done when one icon map file names an emblem for every pathway id in the pack.
