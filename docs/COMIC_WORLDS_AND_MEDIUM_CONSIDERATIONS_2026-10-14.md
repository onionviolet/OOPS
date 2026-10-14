# Comic worlds, the comic medium and comic cheats: considerations

Claude (root), 2026-10-14. A palette, not a spec. Nothing here is selected for
a build. Request: "Considering comic worlds and stuff and more? more to
consider? other stuff and more? Cheats that would show stuff like these and
more? ... Subtle stuff too? Overarching stuff? Implementation implications and
more? Abstraction thats needed?" (recorded in [USER_VISION](USER_VISION.md)).

**Builds on, does not repeat:** the [Marvel/DC wiki pilot](research/comics/REPORT.md)
(F1-F9 findings, M1-M10 mechanics, the Masked City card) and
[comic playthrough targets](research/comics/PLAYTHROUGH_TARGETS.md) (T1-T24,
C1-C12). [Lore and continuity](worlds/LORE_AND_CONTINUITY.md#bounded-comic-comparisons)
owns snapshot rules for comics. Anime and manga worlds already in the canon
tier (JJK, Bleach, Naruto, FMA, Frieren, Chainsaw Man) keep their own folders;
this doc only adds what the comic *medium* and comic *industry habits* add.

**Evidence labels:** MEMORY = my recall, unchecked this session (most of this
round); SHOWN/STATED = checked, with the source. Codex lanes K1-K6 (below)
check the MEMORY rows. Titles named are references, not content; direct
franchise worlds go in the private pack per [PROJECT.md](../PROJECT.md).

**Parallel rounds on the same request (found after writing).** Two other
sessions answered this same request on 2026-10-14:
[World core kit round 6](worlds/WORLD_CORE_KIT_2026-10-14.md#round-6-comic-worlds-cheats-that-show-the-kit-overarching-shape-abstractions-2026-10-14)
(comic traits CW1-CW17, subtle CWS1-CWS7, lens cheats CL1-CL15, OV1-OV8,
abstractions AX1-AX19, lanes W16-W18) and
[intro flow round 22](INTRO_FLOW_CONSIDERATIONS_2026-10-13.md#round-22-comic-worlds-away-progress-abstractions-2026-10-14)
(CC1-CC10, CX13-CX16, AB1-AB9). **Codes in this doc are local to it**: my CW
and CL are not the kit's CW and CL. Where rows overlap, the kit owns the
row and this doc only adds what it lacks; see the [reconciliation](#reconciliation-with-the-parallel-rounds)
table. This doc's own ground: comic *traditions* beyond superheroes, the
comic *medium* as presentation, industry habits as world-law dials, and
comic cheats the lens list lacks.

Standing rules apply: everything reachable through per-world adjectives
(Default + Dial + Reasonably), no fixed "once" limits, reload never rerolls,
sealed secrets by ID only, comfortable idle play, desktop first.

## Big idea in one paragraph

A comic world has two layers that a book world does not stress as hard. The
**world** layer has laws that come from how comics are *made*: a status quo
that snaps back, a timeline that slides, deaths that undo, titles that outlive
holders, crossovers and reboots. The **medium** layer is how a story *looks*:
panels, gutters, captions, balloons, sound effects, covers, recaps. The
abstraction that matters most is to keep those two apart. Industry habits
become optional **world laws** any world can dial (a cultivation world can have
a status-quo pull too). The look becomes a **presentation skin** any world
can wear (a Harry Potter run can be told in panels). Cheats can then touch
either layer: a cheat that sees the world as a comic is a medium cheat; a
cheat that resists the status quo is a law cheat.

## CW. Comic traditions beyond the first 24 targets

Each tradition brings a distinct law, not just a new cast.

| Code | Tradition | Example sources (MEMORY) | Law it brings |
|---|---|---|---|
| CW1 | **Korean webtoon "system" and hunter worlds** | Solo Leveling, Omniscient Reader's Viewpoint, Tower of God, The Beginning After the End, Return of the Mount Hua Sect, Second Life Ranker | Gates and towers, E-to-S ranks, status windows public to all, regression, sponsors who watch |
| CW2 | **Chinese manhua cultivation and system comics** | Tales of Demons and Gods, Battle Through the Heavens (manhua run) | Cultivation stages drawn as visual auras; overlaps the xianxia work |
| CW3 | **Shonen manga with a licensed power society** | My Hero Academia, One-Punch Man, Mob Psycho 100 | Most people powered; hero licences, rankings and agencies; strength decoupled from rank |
| CW4 | **Franco-Belgian bande dessinée** | Asterix, Thorgal, The Incal, Valerian | A consumable power (magic potion) with an exception holder; long album eras |
| CW5 | **British anthology** | 2000 AD, Judge Dredd | Real-time ageing (Dredd ages with publication years); law is the world's main system |
| CW6 | **Creator-owned finite runs** | Saga, Locke & Key, Paper Girls, Y: The Last Man, Black Science, Sandman, Fables, East of West | Bounded canon, clear endings; object-power sets (Locke & Key keys) |
| CW7 | **Rules-aware webcomics** | Order of the Stick (D&D rules known in-world), Erfworld (wargame rules are physics), Homestuck (a game creates universes), Girl Genius (mad-science "Spark"), Gunnerkrigg Court | The rules ARE the fiction; characters read their own stats |
| CW8 | **Newspaper strips and kids' comics** | Calvin and Hobbes, Peanuts, Bone, Usagi Yojimbo | Imagination as a second reality layer; no ageing; small daily beats |
| CW9 | **Superhero tabletop and games** | Masks, Mutants and Masterminds, Marvel Heroic Roleplaying, City of Heroes, Freedom Force, Midnight Suns, Sentinels of the Multiverse | How others already turned comic laws into rules (lane K4) |
| CW10 | **Comic-framed games** | Comix Zone, Wildermyth, the Telltale Batman games, XIII | How a game wears the comic look (lane K3) |

Most cheap and distinctive (INFERRED): CW1 and CW7. CW1 shares engine shape
with our status-window work ([CHEAT_LIBRARY WR2](CHEAT_LIBRARY.md)); CW7
worlds make "characters read their stats" a world law, the opposite of a
cheat. Both are good tests of [WR6](CHEAT_LIBRARY.md) (panel revealed by world
law or by held card).

## CL. Comic industry habits as world laws

Each is a dial on any world, not just comic worlds. Default for most worlds:
off or weak. Comic worlds: on.

| Code | Law | What it does in play | Dial |
|---|---|---|---|
| CL1 | **Status-quo pull** | Big changes drift back over time unless anchored (a dead villain returns, a wrecked city is rebuilt, a secret is forgotten) | Pull strength and delay; what counts as an anchor |
| CL2 | **Sliding timescale** | Years of story compress into a few years of ages; events stay "about N years ago" | Fixed calendar, sliding, or real-time ageing (CW5) |
| CL3 | **Revolving-door death** | Death is common but return happens at a rate (pilot F5: about 5-7%) | Return rate, return cost, who can return |
| CL4 | **Retcon** | A past fact is revised; the world now always was that way | Who may retcon; does anyone remember the old version |
| CL5 | **Reboot and crisis** | The world resets with continuity pieces kept or lost | What carries over; how often |
| CL6 | **Crossover event** | A world-scale event pulls every local story into it; side stories become "tie-ins" | Frequency; can the player opt out |
| CL7 | **Legacy and mantle** | Titles outlive holders (pilot M7) | Transfer rules per office |
| CL8 | **Power by the writer** | A character's strength varies by situation ("plot needs") | Variance band around a stat; INFERRED: can be a world's honesty about readings being wrong |
| CL9 | **Rogues gallery** | Each hero accrues recurring enemies who escape and return | Escape rate; escalation per return |
| CL10 | **Power creep and escalation** | Each arc's threat beats the last | Ceiling per world (C12) |
| CL11 | **Training arc and time skip** | Growth happens off-panel in a jump | Natural fit for idle (see CK18) |
| CL12 | **Tournament arc** | A structured bracket brings rivals into one place | A world event card |
| CL13 | **Elseworld / What If** | A one-variable side world (C2) | Built from any base world |
| CL14 | **Cancellation** | A story can end abruptly; loose threads close fast or hang | A world can end early; INFERRED: a soft ending type in the run-ending palette |
| CL15 | **Era tone** | Golden, Silver, Bronze, Dark, Modern ages have different morals, science and death rates | A tone dial per era (MEMORY: the era names are fan and historian labels, not exact) |
| CL16 | **Comic-book science** | Radiation and accidents grant powers instead of killing (pilot F3 "mutate") | How lethal accidents are versus how often they empower |
| CL17 | **Public power society** | Powers common, regulated, ranked (CW3, CW1) | Share of population powered; licence regime |
| CL18 | **Sponsors and audience** | Being watched pays (ORV-style constellations, The Boys' brand, MHA popularity polls) | Shared with Paradise hub; one audience resource (CA6) |

Subtle (INFERRED): CL1 and CL3 together are why comic deaths feel cheap. A
world that has CL3 on but CL1 off makes returns feel earned instead of reset.

## CK. Cheats that show comic stuff

Ordered from small to world-bending. Each fits an existing cheat family where
possible ([CHEAT_LIBRARY](CHEAT_LIBRARY.md)); new families are marked NEW.

**Seeing (medium cheats)**

| Code | Cheat | Shows | Family |
|---|---|---|---|
| CK1 | **Power Grid sight** | Anyone's six descriptor ranks (pilot M1) | Appraisal |
| CK2 | **Caption reader** | Other people's narration captions: what they think about themselves, sometimes wrong | Mind reading, lossy |
| CK3 | **Thought balloons** | Surface thoughts as cloud balloons, only for people in the same "panel" (near and focused) | Mind reading |
| CK4 | **Next-panel glimpse** | One beat ahead, cropped and ambiguous like a panel | Foresight |
| CK5 | **Cover sight** | A dramatic "cover" of a coming event. Covers lie: it may be staged, a dream or a decoy | Foresight with false positives |
| CK6 | **Editor's notes** | Asterisk notes: "*see last spring, Ed." links to the player's own log | Memory aid |
| CK7 | **Recap page** | On return from idle, a "previously" page summarizing threads | Memory aid; idle return (ties [story T1 Episodes](PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md)) |
| CK8 | **Continuity sense** | Knows canon, but must learn WHICH continuity this is (C11) | Prior knowledge with a reading risk |
| CK9 | **Rogues file** | A gallery of every recurring enemy with last escape and next likely return | Tracker |

**Acting (law cheats)**

| Code | Cheat | Does | Family |
|---|---|---|---|
| CK10 | **Status-quo anchor** | Chosen changes resist CL1 drift | NEW: anchor |
| CK11 | **Retcon** | Edit one past fact at a cost; people who saw the old version may remember | Time/fate, costed |
| CK12 | **Gutter step** | Act between panels: short skips of time no one saw | Time, small |
| CK13 | **Sound-effect made real** | Writing a SFX makes the event happen in a small way (the KRAK breaks the lock) | Word magic |
| CK14 | **Popularity engine** | Being watched or liked feeds power (CL18) | Audience |
| CK15 | **Mantle claim** | Can claim any vacant title and take its record, gear and enemies | Succession |
| CK16 | **Variant call** | Summon or talk to your own variants from other realities (C5) | Selves and echoes |
| CK17 | **What-If window** | Watch a short alternate outcome before choosing; not a save | Foresight; preview runs |
| CK18 | **Off-panel growth** | Idle time becomes a training arc with a montage summary and a visible jump on return | Idle; comfortable play |
| CK19 | **Plot armour meter** | A visible, finite buffer against death that refills at arc ends | Survival, costed |
| CK20 | **Fourth-wall break** | Knows it is in a story; can address the reader (Weibao) at reach levels from [Presentation ladder of reach](PRESENTATION_AND_FOURTH_WALL.md) | Meta |
| CK21 | **Ink and colour control** | Recolour or redraw local reality: hide in a colour, change a costume, delete a background prop | Reality edit, local |
| CK22 | **Crossover door** | Pull a person or item from another world for one event, under CL6 | Doors |

Aspects of one cheat: CK4, CK5, CK7 and
CK17 can be four aspects of one "Comic Sight" cheat that grows from
reading one panel ahead to watching whole what-ifs. CK10, CK11 and CK21 can be
aspects of one "Ink" cheat that grows from colouring to retconning.

Limits are per-world adjectives: in a CL4-off world, CK11 is weak and
costly; in a reboot-heavy world, it is cheap and common.

## CS. Subtle stuff

Small touches that make comic worlds feel like comics without numbers.

| Code | Detail |
|---|---|
| CS1 | **Lettering by kind.** Gods, robots, the dead and telepaths get their own balloon style (MEMORY: Sandman gives Dream black balloons with white text). Text-only: a glyph frame or font per speaker kind |
| CS2 | **Balloon tails as range.** Dashed tail = telepathy, jagged = radio, tiny text = whisper, tail off-panel = a speaker you can't see |
| CS3 | **Flashback borders.** Wavy or sepia frames mark memory; a log entry in a memory style is a recall, not a new event |
| CS4 | **Silent panel.** Grief, awe and big reveals get a beat with no text. Our restraint direction already wants this ([Presentation](PRESENTATION_AND_FOURTH_WALL.md#direction-restraint-makes-effects-land-weibao-2026-10-10)) |
| CS5 | **Splash for the rare moment.** One full-width log card for an arc climax, never for routine |
| CS6 | **"Meanwhile..."** Cut-ins for off-screen events the player can't see, shown only when a cheat or messenger justifies it |
| CS7 | **Cliffhanger on close.** The last log line before going idle can be a hook, and the recap (CK7) resolves it |
| CS8 | **Costume as identity.** Changing costume changes how strangers react; a torn costume is a damage state |
| CS9 | **Secret identity slips.** Same scar, same voice, same handwriting; observant NPCs build suspicion (pilot M6) |
| CS10 | **Mask removal as an event.** Unmasking is a rare, weighted beat with lasting effect |
| CS11 | **Status-quo tells.** A rebuilt landmark with fresh paint, a returned villain with a new scar: drift shown, not stated |
| CS12 | **Art-style change.** A new era or artist redraws faces; INFERRED: a reboot can change how people are described |
| CS13 | **Name echoes.** Mantle holders get "the second", "the new"; old holders mentioned in past tense |
| CS14 | **Running gag.** Recurring small comic beats ([story Z1](PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md)) |
| CS15 | **Panel pacing for time.** Many small beats for fast action, one wide beat for slow; maps to log density during combat versus travel |
| CS16 | **Letters page.** Optional in-world "fan mail" responding to what the player did; reputation shown as readers' opinions |
| CS17 | **Issue numbers.** Chapters can carry issue numbers and titles; anniversary issues (100th day) get a special beat |

## CO. Overarching considerations

| Code | Consideration |
|---|---|
| CO1 | **World laws and presentation are separate layers.** A comic world can be shown in prose; a book world can be shown in panels. Keep both choices independent (CA1, CA2) |
| CO2 | **Industry habits are honest world laws.** Revivals and resets are not plot holes when a world states them as laws (CL1-CL5). That fits "each world makes its own rules" |
| CO3 | **Comics are the best source for continuity tooling.** No other medium has so many reboots, variants and retcons. Solving them here solves AU and parallel worlds for every source |
| CO4 | **Snapshot discipline matters more here.** One character has dozens of versions; every card names one continuity (C11) |
| CO5 | **Status quo versus player impact.** CL1 must never erase the player's earned changes without warning. INFERRED default: player-anchored changes resist drift; world-only changes drift |
| CO6 | **Legal care.** Comic characters are actively licensed property. Direct versions stay in the private pack; the public fork uses original stand-ins, as in the Masked City card |
| CO7 | **Comic worlds are crowded.** Thousands of named powered people. Generation (procgen) must fill the background and leave named canon for the foreground |
| CO8 | **Many comic worlds are already parallel worlds.** Earth numbers are a ready multiverse map ([MULTIVERSE_STRUCTURES](worlds/MULTIVERSE_STRUCTURES.md)) |
| CO9 | **Idle fits comics.** Comics are serialized and paused between issues; off-panel time (CK18) and recaps (CK7) turn idle gaps into story |
| CO10 | **Readers and creators as cosmology.** Some comics place writers and readers inside the cosmos (MEMORY: Animal Man, She-Hulk, the Marvel "One-Above-All"). Link to [CHEAT_COSMOLOGY](CHEAT_COSMOLOGY.md) as one optional cosmology, never forced |

## CI. Implementation implications

Proposals for a later build packet. None is selected. Lane K6 checks the code.

| Code | Implication |
|---|---|
| CI1 | **Event log entries need a kind.** Caption, speech, thought, SFX, recap, splash, silent. Existing log text can default to "caption" so old saves read the same |
| CI2 | **Beats, not lines.** Log entries group into beats (panels) and beats into scenes (pages); the P26 beat templates in story generation are the natural owner |
| CI3 | **Facts need versions.** Retcons (CL4, CK11), lie worlds (C4) and continuity sense (CK8) all need world facts with a valid-from point and a record of what changed and who remembers |
| CI4 | **Homeostasis as a scheduler.** CL1 is a periodic pass that nudges tagged world state back toward a baseline unless anchored. Seeded and deterministic so reload never rerolls |
| CI5 | **Offices as records.** CL7/CK15 need a title record (holders, rule, gear, enemies, impostors) separate from any one character |
| CI6 | **Two identities per actor.** Public and secret reputations, exposure state and suspicion per observer; check against [identity laws by world](worlds/IDENTITY_LAWS_BY_WORLD_2026-10-14.md) |
| CI7 | **Recurring enemies.** Defeated foes need a "may return" state with a return clock and escalation (CL9) |
| CI8 | **Event scope.** CL6 crossovers need an event that can span several active worlds and mark local stories as tie-ins |
| CI9 | **Idle summary as montage.** CK18 needs offline progress grouped into one narrated training jump with before/after |
| CI10 | **Save compatibility.** All of the above are additive fields with defaults; each still needs its own migration or explicit compatibility decision per AGENTS.md |
| CI11 | **Text-first rendering.** Desktop first. Panels as bordered log cards in a grid, not drawn art; art stays optional |

## CA. Abstractions needed

The shared shapes that would serve comics and every other world. Candidates,
not selected. Each lists who else would use it.

| Code | Abstraction | Also serves |
|---|---|---|
| CA1 | **World law dials** (status-quo pull, revival rate, timescale, retcon access, crossover rate, era tone) as one data block per world | Every world card; [World core kit](worlds/WORLD_CORE_KIT_2026-10-14.md) |
| CA2 | **Presentation skin** (prose, comic, status window, terminal, ink scroll) chosen separately from the world | Cheat UI per world ([SW11](CHEAT_LIBRARY.md)), UI at scale |
| CA3 | **Rank ladder** (named ranks with anchors, optional hidden numbers) | Power Grid, hunter E-S, hero association classes, Worm threat ratings, cultivation stages, guild ranks |
| CA4 | **Office / mantle** record with a transfer rule | Sorcerer Supreme, Hokage, Gotei captain, kings, guild masters, [succession](worlds/SUCCESSION_BY_WORLD.md) |
| CA5 | **Versioned fact store** with retcon events and per-observer memory | Lie worlds, timelines, [world secrets](worlds/WORLD_SECRETS_AND_DISCOVERY.md), unreliable readings |
| CA6 | **Audience resource** (watchers, sponsors, fame, polls) | Paradise hub, ORV-style worlds, The Boys, MHA rankings, streamer cheats |
| CA7 | **Identity pair** (public and secret selves with exposure) | Spies, disguised nobles, nonhuman starts hiding a body |
| CA8 | **Recurring actor** (escape, return clock, escalation, memory of you) | Rivals, nemeses, [enemy protagonists](ENEMY_PROTAGONISTS.md) |
| CA9 | **Variant link** (same person across worlds, with shared and differing facts) | [Selves and echoes](SELVES_AND_ECHOES.md), AUs, parallel worlds |
| CA10 | **Cross-world event** (one event touching several worlds) | Cosmic events, multiverse wars |

Build order for the shared ones is owned by kit II35; this doc does not set
a second order. CA6 and CA8 are not in the kit list and need a home there.

## Codex lanes K1-K6 (dispatched 2026-10-14)

Prompts and reports live in [gm/dispatch/comics-2026-10-14/](gm/dispatch/comics-2026-10-14/).
Research and docs only; no gameplay code.

| Lane | Task | Output |
|---|---|---|
| K1 | Webtoon, manhwa and manhua system worlds (CW1, CW2): sourced rules, ranks, natural course, roles for unchosen people | `WEBTOON_WORLDS.md` |
| K2 | Western creator-owned, webcomic and kids' worlds (CW4-CW8): signature law, natural course, entry eras | `MORE_COMIC_WORLDS.md` |
| K3 | Comic medium techniques (McCloud transitions, lettering, balloons) and comic-framed games, mapped to a text-first desktop log | `MEDIUM_TO_TEXT_UI.md` |
| K4 | Superhero tabletop and video games (CW9): how they turned comic laws into rules | `SUPERHERO_GAME_RULES.md` |
| K5 | Continuity mechanics (retcon, reboot, sliding time, status quo, death and return, legacy) checked on wikis; maps to CL and CA5 | `CONTINUITY_MECHANICS.md` |
| K6 | Engine fit. **Stopped 2026-10-14 at launch**: duplicates kit lane W18 (abstraction map against live code). Read W18's output for CA rows | none |

## Reconciliation with the parallel rounds

Kit = [World core kit round 6](worlds/WORLD_CORE_KIT_2026-10-14.md); intro =
[intro flow round 22](INTRO_FLOW_CONSIDERATIONS_2026-10-13.md). "Owner" says
which doc keeps the row; this doc's row then only adds the noted extra.

| This doc | Same idea there | Owner | What this doc adds |
|---|---|---|---|
| CL1 status-quo pull | Kit CW6 | Kit | CO5 player-anchored changes resist drift; CK10 anchor cheat |
| CL2 sliding timescale | Kit CW2, intro CC7 | Kit | Real-time ageing option (TR CW5, Dredd) |
| CL3 revolving-door death | Kit CW6, intro CC6 | Kit | Pairing note with CL1 |
| CL4, CL5 retcon, reboot | Intro CC1, CC2; kit AX14 | Intro | CK11 retcon as a costed act, CK21 ink |
| CL6 crossover | Kit CW7, intro CC4 | Kit | Opt-out dial |
| CL7 legacy | Kit CW12, intro CC5, CX16 | Kit | CK15 claim any vacant title |
| CL8, CL10-CL12, CL14, CL16-CL18 | none | This doc | Power by the writer, escalation, training arc, tournament, cancellation, comic science, power society, sponsors |
| CL13 What If | Intro CC8 | Intro | CK17 What-If window cheat |
| CL15 era tone | Kit CW15, intro CC9 | Kit | none |
| CW1-CW10 traditions | Kit CW16 names Worm, MHA, OPM, Invincible, The Boys | This doc | Webtoon, manhua, BD, 2000 AD, creator-owned, rules-aware webcomics, strips, TTRPG, comic-framed games |
| CK1 Power Grid sight | Kit CL5 | Kit | none |
| CK2, CK3 captions, balloons | Kit CL4 | Kit | Caption versus thought split: captions are self-image and can be wrong |
| CK8 continuity sense | Kit CL7, intro CX14 | Kit | none |
| CK11 retcon | Kit CL13, intro CX15 | Kit | Witnesses remember the old version |
| CK20 fourth wall | Kit CL14, CW14 | Kit | none |
| CK4-CK7, CK9, CK10, CK12-CK19, CK21, CK22 | none | This doc | Medium and law cheats not in the lens list. Most are not lenses: CK10-CK22 *act*, so they fall outside kit CLR1 "lens never invents truth" |
| CS1-CS3, CS6 lettering, gutters | Kit CWS1, CWS6, CW13 | Kit for gutter time and lettering voice | Balloon tails as range, flashback borders, meanwhile cut-ins |
| CS4, CS5, CS7-CS17 | Kit CWS3, CWS4 cover CS8, CS9 | Mixed | Silent beat, splash rarity, cliffhanger on close, issue numbers, letters page |
| CK18 off-panel growth, CO9 | Intro AW1-AW12 away progress, away ledger | Intro | Montage framing of the away report for comic worlds |
| CA1 law dials | Kit AX2 Law | Kit | The specific comic dials list |
| CA2 presentation skin | Kit II32 comic frame skin | Kit | Skin chosen independent of world (any world in panels) |
| CA3 rank ladder | Kit CW4 | Kit | Shared ladder across hunter ranks, cultivation, guilds |
| CA4 office | Intro CC5 substitute ladder | Intro | Impostor list on the office |
| CA5 versioned facts | Kit AX14 Overlay, intro AB8 | Kit | Per-observer memory of old versions |
| CA6 audience resource | none | This doc | Paradise hub, ORV-style worlds, The Boys, rankings |
| CA7 identity pair | Kit AX17 Persona | Kit | none |
| CA8 recurring actor | none in round 6 | This doc | Return clock and escalation |
| CA9, CA10 variants, cross-world event | Kit OV6, II34 | Kit | none |

Net new from this doc, ranked by value (proposal): CW1/CW7 traditions as
cheap distinct targets, CA6 audience resource, CK18 montage on top of the
away report, CA8 recurring actor, CL12 tournament as an event card.
