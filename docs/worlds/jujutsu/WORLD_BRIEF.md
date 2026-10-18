# Jujutsu Kaisen: book world brief and Frontier echoes (proposal)

> **How to use this doc (Weibao, 2026-10-10):** these are considerations
> for established and future worlds, to help ideaboard and implement
> fitting characters at fitting times. Tiers, lists and tables are
> illustrative, not complete or fixed; more distinctions can exist.
> Everything just has to make sense for the world and character at hand.

Claude, 2026-10-10. Weibao: "How to possibly implement stuff like JJK's
world, from techniques, to Mahoraga, and more? Concepts like adaptation and
other busted stuff?" then "we can implement this as a book world, but we
can have it exist in the frontier or testing world."

**Status: requested direction, proposal.** Nothing selected for a build.
Mechanics are described in our own words as structure. Per the
[book world decision](../../../PROJECT.md), a direct recreation with canon
names goes in a private pack (`private_packs/`, loaded at runtime by
[content_packs.js](../../../src/content_packs.js), outside git and the
bundle). Public builds use original names.

**Source note.** Canon details below are from memory of the manga
(chapters 1 to 271 plus *Jujutsu Kaisen 0*). Mark each one verified in a
`SOURCE_LEDGER.md` before the private pack relies on it. Anime-only
material is corroboration, not authority.

Related: [E8C JJK layering](../../emergent/E8C_POWER_PATHS_AND_ANIME.md#the-jjk-shape-in-detail),
[E8D vows](../../emergent/E8D_VOW_SYSTEM.md),
[E8E adaptation](../../emergent/E8E_ADAPTATION.md),
[ability contract](../ABILITY_AUTHORING.md),
[Proving Ground](../proving-ground/WORLD_BRIEF.md).

## Current pack and evidence boundary

The eight linked owners and M5 synthesis now live beside this brief. They supersede the early 2026-10-10 brainstorm tables below wherever detailed mechanics differ. Those earlier mechanic examples were explicitly based on memory and remain unverified proposals; do not treat them as canon facts or implemented rules. The source-bounded pack is: [Campaign](CAMPAIGN.md), [Module catalogue](MODULE_CATALOGUE.md), [Source ledger](SOURCE_LEDGER.md), [Ability variants](ABILITY_VARIANTS.md), [Interactions](INTERACTIONS.md), [GM prompt](GM_PROMPT.md), [Implementation packet](IMPLEMENTATION_PACKET.md), and [Synthesis](SYNTHESIS.md).

`W` Core examples directly checked against revision-pinned private wiki payloads are catalogued in SOURCE_LEDGER. All remain secondary wiki claims. `P` The first proposed play slice is the bounded curtain dispatch in IMPLEMENTATION_PACKET. No mechanic, start, AU, roster, runtime binding, save format or playable world is accepted by this research pack.

## Where it lives

Three placements, all reachable (anything is possible, reasonably). They
share one implementation of each primitive and differ in names, rules and
how you get in.

| Code | Placement | What it is | Names |
|---|---|---|---|
| P P1 | **Book world** | The full JJK world as a destination: sorcerer society, curses, schools, clans, grades, Culling Game era options. Follows the book (rule 3); premise can be canon, divergent, remix or swapped | Canon, private pack |
| P P2 | **Frontier echoes** | The Frontier keeps its own rules (rule 2), so JJK pieces appear only through carriers (rule 5) or as outliers (rule 12): a cursed relic found in ruins, a stranded sorcerer, an adaptive beast, a fear-born spirit in a haunted spot | Original |
| P P4 | **Odd world** | An original world built from borrowed ideas: JJK pieces mixed with other sources, and each borrowed idea free to work differently than in its home world. See [odd world](#q3-an-odd-world-of-borrowed-ideas) | Original |
| P P3 | **Proving Ground** | A testing world where each primitive can be tried in isolation against dummies with dials exposed. Doubles as an in-fiction training realm | Original |

**Build order proposal:** primitives first in P3 (cheap to test, no
story), then one or two Frontier echoes in P2 (playable in the real save),
then the P1 pack once enough primitives exist to make the world feel
whole.

### Frontier echoes, concretely (original names, proposals)

- **E1 The Wheelbearer.** A rare wandering beast with a visible wheel on
  its back. The [E8E](../../emergent/E8E_ADAPTATION.md) proof enemy.
  It learns your weapon type over a fight and forgets over days.
- **E2 Grudge-knots.** Spirits that form where fear and grief pile up
  (a mass grave, a hospital ward, the mine after a collapse). Only people
  with the sight, or a lens, see them; everyone else sees bad luck. Fed
  by the Village's real mood facts (E3, E6).
- **E3 The finger box.** A sealed relic split into shards. Each shard
  eaten makes you stronger and makes something else in your head louder.
  Body and occupancy rules decide who wins.
- **E4 The stranded oath-keeper.** An outlier NPC from a binding-vow
  world. Teaches vows for a price; can be wrong about how the Frontier
  enforces them, because the Frontier is not their world.
- **E5 A self-made domain.** A rare late Frontier achievement: a
  practiced technique plus a vow can make a small zone where it always
  lands. Reached the obscure way (rule 1), not handed out.

## Core layers

| Code | Layer | Mechanic | Engine owner |
|---|---|---|---|
| P L1 | Cursed energy | Fuel with three stats: **reserve** (how much), **output** (how much per second), **control** (waste). Refills from negative moods. Non-sorcerers leak it into places; sorcerers don't | New fuel; E3 moods; E6 place facts |
| P L2 | Innate technique | One per body, written in the brain at birth, manifests in childhood. Some are inherited in clans. Same record shape as Rat-step plus trigger, scope, hidden rules and an extensions list | [techniques.js](../../../src/techniques.js) records |
| P L3 | Reinforcement | Pour energy into body or tool. Universal, learnable by anyone with energy | Practice path, vanilla skills as base |
| P L4 | Reverse cursed technique | Multiply negative by negative to get positive energy: self-heal first, heal others later (much rarer), and **technique reversal** (the opposite effect of your technique) | Second mastery track |
| P L5 | Maximum | A once-per-fight overcharge of your technique, or a fusion of two applications | Mode on the technique record |
| P L6 | Binding vows | Restriction for power, with yourself or with others. Explaining your technique is a vow. Breaking one brings an uncertain penalty | [E8D](../../emergent/E8D_VOW_SYSTEM.md) |
| P L7 | Barriers and curtains | Zones with conditions: keep in, keep out, hide, admit only some. Strength traded between inside and outside | E4 place rule layer |
| P L8 | Domains | Your technique's rules over a closed zone; sure-hit. Costs huge energy, then **burnout**: technique unusable for a while | Place rule layer; `hitModifier` forced in [combat_math.js](../../../src/combat_math.js) |
| P L9 | Anti-domain | Simple domain (small zone that cancels sure-hit), older basket form, clan counter techniques, domain amplification (coat yourself, nullify techniques you touch) | Rule priority |
| P L10 | Black Flash | A hit landed within a tiny window of energy release; huge multiplier, then a short "zone" of improved control. First one permanently raises understanding | Timing crit, temporary state via [active_effects.js](../../../src/active_effects.js) |
| P L11 | Heavenly Restriction | A birth vow: lose energy for a monstrous body, or lose the body for vast energy and range | Body traits (rule 4) |
| P L12 | Grades | Institution ranks for sorcerers and curses, lagging true strength | E3 factions; institutional grade path (E8C) |

## Domains in detail

A domain is the clearest "busted but fair" mechanic, so it gets its own
spec.

| Part | Rule proposal |
|---|---|
| P Startup | Hand sign and energy; interruptible. Announcing it is information the enemy gets |
| P Barrier | Closed by default. An open domain with no barrier is a far harder feat (huge range, needs a vow or monstrous skill) |
| P Sure-hit | Your technique's hit chance is 1 for targets inside |
| P Clash | Two domains: the more refined wins the space. Refinement is a skill stat, not raw energy |
| P Escape | Break the barrier from outside (weaker from inside by design, or the reverse, a dial per barrier) |
| P Counters | Simple domain, basket, amplification, or a tool that cuts techniques |
| P Aftermath | Burnout: technique offline for minutes; reverse technique can repair the brain and shorten it (a high-skill trick) |
| P Incomplete | A domain without sure-hit: home ground and buffs only. A real stepping stone, not a failure |

### Domains that aren't damage

The best ones change the fight's *genre*. Each is a world-level rule swap
the engine can host because it already has receipts and facts:

- **A courtroom.** Violence is suspended; a trial runs on evidence. The
  engine's own **receipts and history are the evidence**: you are tried for
  things your save actually records. Guilty means confiscation of your
  technique or energy; the death sentence grants an executioner's blade.
- **A gamble.** A slot machine; a jackpot gives near-infinite energy and
  automatic healing for a fixed time. Runs on a seeded stream (E1), so it
  is fair and replayable.
- **An information flood.** Everything perceived at once; targets freeze.
  Counter: limit exposure or shared protection by touch.
- **A rules game.** Constellation or frame-rate rules: break the rule and
  you are punished; follow it and you are safe. Turns into a puzzle of
  learning the rule (E7) before it kills you.

## Busted techniques as mechanics

Each needs the north star's three checks: a cost the engine charges, a
counter that works for a real reason, an information weak point.

| Code | Canon technique | Mechanic | Cost | Counter | Info weak point |
|---|---|---|---|---|---|
| P T1 | Limitless / Infinity | Incoming attacks slow as they approach and never arrive. Attract, repel, then fuse them into an erasing shot | Constant control load; near-free only with the eye trait | Sure-hit domain, technique-cutting tool, adaptation, attacks on space | Filter rules: what it lets through |
| P T2 | Six Eyes | Efficiency near total; reads energy and techniques in detail | Born with it; the world reacts (more curses, more attention) | Not seeing the attacker; physical-only bodies with no energy to read | None for the user; it *is* information |
| P T3 | Ten Shadows | Shadow summons unlocked by beating each one in a ritual. A destroyed summon is gone but its power passes to another. Untamed summon of the strongest is a forced fight; involving an enemy voids the taming | Hand signs, shadow, fights to tame | Kill the summoner; flood the shadows with light | Which summons exist; who is in the ritual |
| P T4 | Mahoraga | The [E8E](../../emergent/E8E_ADAPTATION.md) adapter: wheel, steps, healing, answering defenses, an anti-curse positive-energy blade | Being untamed means it kills its summoner too | Burst, novelty, off-axis, steal the lesson | The wheel shows each turn |
| P T5 | Dismantle and Cleave | Plain cut, and a cut that scales to the target's toughness. A world-cutting slash that targets space itself | Energy; the space cut needs a learned answer | Distance, barriers, adaptation (except to the space cut) | Hand signs and chant can be skipped at a cost |
| P T6 | Idle Transfiguration | Touch the soul, reshape it; the body follows | Touch; needs understanding of souls | Someone who can hit souls; a body used to holding two souls | Touch range |
| P T7 | Body hopping (brain swap) | Move your brain into a corpse; **use that body's technique**. Rule 5 answer for JJK: the innate technique travels with the brain, not the soul | Needs the corpse; leaves a stitch scar | Recognition; the body's own will resisting | The scar |
| P T8 | Copy with a stored spirit | Copy techniques; the bound spirit stores and limits them. Time-limited full manifestation | A bond with a loved one's curse | Separate them; run out the timer | Which techniques are stored |
| P T9 | Cursed speech | Words that command; backlash scales with the target's strength | Throat damage, medicine | Soundproofing, stronger targets | Must be heard |
| P T10 | Boogie Woogie | Clap to swap positions of two energy-bearing things | Line of sight | Closing the hands; no energy-bearing objects | A fake clap is a real feint |
| P T11 | Resonance | Strike an effigy with a sample (hair, blood) to hit the owner | A sample with provenance | Not leaving samples | Sample custody: the engine's custody owners already fit |
| P T12 | Projection | Plan your next second in frames; the target must follow the frame rules or freeze | Committing to a plan | Breaking the rule on purpose; going faster | The 24-frame rule |
| P T13 | Comedian | Reality bends as long as the user honestly finds it funny | Must stay sincerely amused | Make them stop laughing | It is the user's sense of humor |
| P T14 | Construction | Make matter from energy, up to a perfect sphere that pierces | Huge energy | Avoid the sphere's set path | Its fixed rule |
| P T15 | Jacob's ladder | A light that ends all techniques | Rare vessel | Physical force | Range and start-up |

Rows T13 to T15 test whether the engine's concept contract (in the
[ability doc](../ABILITY_AUTHORING.md#conceptual-powers-and-mechanical-difficulty-requested-follow-through))
can stay bounded. They are good stress cases for the Proving Ground.

## Subtle features worth keeping

These are the details that make JJK feel like JJK, sorted by what they
connect to.

### Energy, emotion and places
- **Leakage makes monsters.** Ordinary people leak energy where they feel
  fear; it pools in schools, hospitals, graveyards. Curses spawn from
  places weighted by that fact (E5 cards, E6 facts). A happy village spawns
  fewer.
- **Disaster curses** come from fears every human shares (fire, forests,
  sea, disease). They are rare, strong and named after the fear.
- **Deaths without proper handling** can leave a curse behind. Funerals,
  exorcism or a sorcerer's killing blow prevent it. Life-sim hook:
  how your Village handles its dead matters.
- **Vengeful spirits from love.** A loved one dying can bind a curse to
  the survivor. Power plus grief plus a relationship to resolve.
- **Seeing is a faculty.** Non-sorcerers cannot see curses; special
  lenses can. A whole category of the world is hidden (rule 6) unless
  you have the sight.

### Society and economy
- **Missions and windows.** Non-sorcerer observers report curses; the
  school assigns graded missions; pay scales by grade. A clean idle loop.
- **Grades lag reality.** A grade two who is truly special grade gets
  assigned wrong, or sent to die by politics.
- **Clans and inheritance.** Inherited techniques decide heirs; a child
  born with the right one upends succession. Fits E3 and heir rules.
- **Higher-ups and executions.** Death sentences on dangerous vessels;
  suspended sentences; politics as a threat stronger than curses.
- **Cursed tools** are a market: tools that store techniques, nullify
  them, or cut souls. Prices, theft, custody.
- **Cursed corpses.** Crafted bodies with cores; craft a being, give it a
  soul. Crafting meets life.

### Vows and time
- **After-hours vow.** Weaker during set work hours, stronger after.
  Real time of day matters; idle hook.
- **Life-span vows.** Trade years for power now (rule 7, time means
  something).
- **Ratios.** A technique that always crits at one exact point on the
  target. Simple, readable, skill-based.
- **Revealing your technique** as a buff, so information has a price both
  ways.

### Rule games
- **The Culling Game.** Players are dropped in zones, earn points by
  killing, and can spend points to **add a rule**. A game master enforces
  them. This is E4 rules plus E8D vows at a social scale: a player-made
  rulebook mid-run. Good late-game P1 arc and a strong stress test for
  rule composition.
- **Reincarnated players.** Old sorcerers return in modern bodies by
  prior vow; their skill is old, their body is new (rule 4 and 5).

### Fights in an idle game
- **Pre-committed triggers.** Since fights run without hands, the craft
  is the loadout: "if they open a domain, raise a simple domain", "save
  Maximum for under 30 percent health", "on Black Flash, push". Ties to
  existing [combat stances](../../../src/combat_stances.js).
- **Watching wins.** Spectators learn from fights they see (Sukuna
  learning from Mahoraga); a match you watch can teach.

## Carry rules (rule 5)

| Thing | Carrier | Notes |
|---|---|---|
| P Innate technique | Brain (body) | Leaving your body leaves it behind; swapping into a body gains its technique |
| P Cursed energy capacity | Body plus soul (dial) | Proposal: reserve with the body, control with the soul |
| P Learned skills (reinforcement, reverse technique, domains) | Soul memory | Works in a new body only if that body can produce energy |
| P Vows | Swearer | Whether a vow survives a world crossing is that world's call |
| P Cursed tools, relics, fingers | Items | Carry normally; foreign worlds may not read them |
| P Adaptation | Ledger owner | See E8E |

In the Frontier, a carried technique resolves through its actual carrier,
source and destination mechanisms (AD38). An origin label is not a permission
list or an automatic suppression rule. A supported outlier remains an outlier,
not a new faculty granted to everyone.

## Implementation slices (proposal)

**Parked (Weibao, 2026-10-10):** ideaboarding for now; no slice, S1
included, is needed yet. Kept as a reference order for later.

One playable slice at a time, per AGENTS.md.

| Slice | Contents | Playable check |
|---|---|---|
| P S1 | Proving Ground shell plus E8E adaptation ledger plus one adaptive dummy | Fight it, watch the wheel, switch weapons, save, reload, import |
| P S2 | E1 Wheelbearer in the Frontier | Meet it in the real save; decay works across days |
| P S3 | Energy fuel (L1) plus reinforcement (L3) plus a vow (L6, reusing E8D) | Spend, refill from mood, keep a vow, break one |
| P S4 | Barriers and domains (L7 to L9) | Domain vs simple domain in the Proving Ground |
| P S5 | Grudge-knots (E2) from Village mood facts | A sad week spawns more |
| P S6 | Private pack P1 opening: one school, one mission loop, one innate technique roll | Enter, take a mission, get paid, return |

Each slice that adds save data needs a migration or explicit
compatibility decision.

## Weibao's answers (2026-10-10)

Recorded from Weibao's replies to the first open questions. These set
direction for this world; numbers and content stay proposals.

### Q1 Era: any of them, chosen per run

Weibao: the era "can be different, depending on what we want to do... it
can be current time, past era, or future era."

The era is a premise choice at entry, like canon versus divergent. One
world record, several era instances, each with its own people, institutions
and rules in force.

| Era | What changes (canon details to verify) | Play feel |
|---|---|---|
| P Ancient (Heian-like golden age) | No schools; clans and court sorcerers; techniques more brutal; Sukuna alive and at his height; older barrier arts (the basket before simple domain) | Lawless power, patronage, legends in the making |
| P Pre-story | Gojo's generation as students; the Star Plasma Vessel incident; Toji active | Watch the strongest grow; small ripples change him |
| P Prequel and main story | Yuta's curse, then Yuji's fingers; schools, missions, higher-ups | Classic mission loop |
| P Culling Game | Colonies, points, added rules, reincarnated sorcerers | Rule-game survival |
| P Aftermath and future | After the ending; the official future spin-off (*Modulo*, set decades later; verify scope before use) or an original far future | Inherited techniques in new families, new threats, history as lore |
| P Original eras | A divergent past, a world where the strongest never lived, or a remix | Swapped premise |

Details that make eras matter:
- **Curse density shifts.** Canon ties the rise in curse strength to the
  strongest sorcerer's birth. An era without him is quieter but has no
  one to save it.
- **Techniques age with history** (E8C). Simple domain exists in one era
  and not another; a counter you know from the future is a real carried
  advantage (rule 5: your soul's memory).
- **Lineages carry forward.** Clan techniques reappear generations later;
  a future era can meet the heir of a past-era run (heir rules).
- **Visiting a later era of your own run** shows what your past choices
  left: a legend about you, a curse born from fear of you, your grave.

### Q2 Innate technique on entry: both, and more

Weibao: "it might depend, both is possible?"

Every route is reachable; the world, era and premise decide which are
normal and which are rare (rule 1).

| Route | How | Notes |
|---|---|---|
| P None | Most people have none | Still viable: reinforcement, tools, Heavenly-Restriction-style bodies, missions as support |
| P Rolled at birth | Random innate technique, weighted by era and parents | Seeded (E1), so a roll is fair and replayable |
| P Inherited | Born into a clan with its technique | Comes with clan politics |
| P Chosen premise | Pick it at entry, like a starting class | For a deliberate run |
| P Late awakening | Near death, a brain injury, a vow, eating a relic shard, a curse's touch on the soul | The obscure ways; each with a price |
| P Borrowed body | Enter a body that already has one (body hopping) | The technique belongs to the brain, not you |
| P Carried in | From a prior run or another world through a carrier | Works only if this world can run it |
| P Copied or stored | Copy, a cursed tool, a bound spirit | Limited and conditional |

The same applies to cursed energy itself: from none (sight only, or not
even that) to vast.

### Q3 An odd world of borrowed ideas

Weibao: "It could just be a odd world with ideas from other worlds, but it
doesn't necessarily have to be the same."

So the Frontier echoes are one option, and a fourth placement (P4 above)
is an **odd world**: an original setting stitched from ideas borrowed from
JJK and other sources, where each idea works its own way.

How borrowed ideas can differ there:
- **Same shape, different fuel.** Domains run on joy instead of fear; a
  happy town is the dangerous one.
- **Inverted rule.** Adaptation is the *player's* trait, not the
  monster's, or everything in the world adapts except you.
- **Merged sources.** A vow system (JJK) priced in sanity (Lord of the
  Mysteries); curses born from fear that also climb a sequence ladder.
- **Local quirk.** Domains exist but only at night; techniques live in
  the hands, not the brain, so amputation is theft.
- **Misread import.** The world copied an idea from a traveler's story
  and got it slightly wrong, so the rules contradict what a JJK veteran
  expects (rule 6). Knowing the original is half an advantage, half a trap.

Odd-world rules are written per world (rule 2), never inherited from the
source. The Proving Ground can incubate its first pieces.

### Q4 Courtroom on your save history, with reactions to odd stuff

Weibao: "That would definitely be fun! But there should be reactions
accordingly for odd stuff and more?"

The trial reads real receipts, and the court **reacts** to what it finds.
This generalizes: every observer in the game can notice odd records.

**What counts as odd.** Compare a record to what this world considers
normal, and flag outliers:
- Extreme counts: 3,000 rats killed, 400 identical loaves sold, a year
  spent fishing.
- Strange combinations: a pacifist vow and a mass grave; a beggar with a
  royal sword.
- Impossible-here acts: crimes done in another world or a past life;
  techniques this world has never seen.
- Absurd acts: killing a chicken with a domain; suing a curse.
- Silence: a life with no records at all for a decade.

**Courtroom reactions (proposal).**

| Finding | Reaction |
|---|---|
| P Ordinary crime | Normal trial; evidence, defense, verdict |
| P Extreme count | Judge asks why; the gallery murmurs; a ruling about "obsession" can be its own verdict |
| P Absurd act | Laughter, a confused judge, a sentence that fits the joke (pay the farmer, apologize to the chicken's owner) |
| P Act in another world or life | Jurisdiction fight: is it admissible here? The judge may refuse it, or treat it as character evidence |
| P No witnesses | Evidence the court cannot see (rule 6): inadmissible, so you win on a technicality, and someone notices |
| P Contradicting records | The court catches a lie; or the records were wrong and you prove it |
| P A vow you broke | Strongest evidence of all; vows are law here |
| P Good deeds | Mitigation; witnesses you helped may show up |
| P Nothing odd | A short, boring trial, which is its own kind of suspicious if you are known to be dangerous |

Rule: the court reads only receipts the save actually holds; it never
invents crimes. Save integrity (rule 9) means reload abuse does not leave
receipts and is not judged.

**Reactions outside the court.** The same odd-record check feeds:
- **Gossip and titles** (E3): "the Rat Butcher", "the woman who never
  sleeps"; titles change prices and who talks to you.
- **Institutions:** an absurd kill count earns a grade review; an
  impossible technique triggers an investigation or a recruitment.
- **Curses and spirits:** fear of you, if people fear you enough, can
  spawn something shaped like you.
- **The world's storyteller** (E5): an odd record is a hook for an event.
- **The Notebook:** you see what others noticed, possibly wrong.

Reactions scale with how many people could plausibly know (witnesses,
records, fame), not with what the save knows.

### Q5 Any era works, but the timeline reacts

Weibao: "any era works, consider how that messes up the timeline tho, but
of course we can just end up being some nobody, more to consider?"

Generalized into a standard for every world (2026-10-10):
[timelines and divergence](../../TIMELINES_AND_DIVERGENCE.md). The JJK specifics stay here.

#### How much your presence bends history

Three dials per world instance, all reachable:

| Dial | Options |
|---|---|
| **Mutability** | Fully mutable; soft canon (events drift back toward their course unless pushed hard); fixed points (a few anchors cannot change, everything else can); branching (a big change splits off a new instance and the old one keeps going) |
| **Canon pressure** | How hard history tries to happen anyway. High pressure: save someone and a substitute dies in their place, or the same event arrives by another road. Ties to fate as an entity (E5) |
| **Ripple reach** | How far a change spreads: only what you touched; everyone connected to it; the whole later era |

#### A divergence ledger

Each canon event in the era is a record with preconditions, a status and
receipts:

- `on track`, `shifted` (happens differently), `delayed`, `prevented`,
  `replaced` (something else fills its role), `caused by you`.
- If a precondition breaks (a key person dies early, a relic moves, a vow
  is never sworn), the event checks its substitutes before vanishing.
- The Notebook shows only what you could know (rule 6). You learn an
  event shifted when you see it, or when it fails to come.

#### Foreknowledge goes stale

Knowing the story is a real carried advantage, and it decays:
- The more you change, the less your knowledge matches. Each memory of
  "what happens next" carries a confidence that drops as ripples reach it.
- Readings of the future can be confidently wrong: you prepare for an
  ambush that no longer comes, and miss the one your changes created.
- Other knowers may exist: another transmigrator, a planner who has seen
  futures, a technique that reads them. They bend history too.

#### Smart antagonists adapt

A long-game schemer treats you as a variable. Their plans run on the
[adaptation ledger](../../emergent/E8E_ADAPTATION.md) at the plot scale:
foil a plan once, and the next plan routes around you. The more visible
your interference, the faster they adapt.

#### Living across eras

- **Era-hopping in one run:** visit the past, then the present. Options:
  same timeline (your changes are there), branch (a new instance), or
  closed loop (you were always part of history; the legend you heard was
  about you).
- **Living through eras the slow way:** be born in an early era and reach
  a later one by long life, a reincarnation vow (canon has one), being
  sealed, or as a curse. Rule 7: time means something, so you age, lose
  people and watch your techniques become history.
- **Meeting your own echoes:** your heirs, your grave, a curse born from
  fear of you, a student's student using your technique wrong.

#### Being a nobody

A full, valid life, not a failure state:
- **Roles:** a civilian who can't see curses, a window (an observer who
  reports them), a school staff member, a cursed-tool merchant, a nurse
  under the school's doctor, a clan servant, a survivor of an incident, a
  curse user's errand-runner.
- **The story still reaches you.** Big incidents hit ordinary people
  hardest. A nobody in the wrong district on the wrong night lives
  through a disaster the heroes only fight in.
- **Low attention is protection.** Powerful beings ignore nobodies
  (the attention dial in E8C). Getting noticed is a choice with a cost.
- **Low ripple by default.** A nobody bends the timeline a little; small
  kindnesses can still change a key person (the friend who wasn't there,
  the warning delivered in time).
- **Nobody to somebody.** Late awakening, a found relic, a mentor, or a
  life of patient reinforcement training. Or stay a nobody on purpose and
  build an ordinary life the canon never shows.

#### More to consider

- **Your existence alone can change things.** A new sorcerer born in an
  era changes the balance (canon ties curse strength to one birth).
  Whether your birth counts is a dial.
- **Visibility to perceptive people.** Someone with perfect energy sight
  may notice you don't fit, even if you do nothing.
- **Mixed premises.** A divergent premise (the strongest never existed)
  plus your presence on top: two layers of change, tracked separately.
- **Who gets credit.** In a fixed-point world, you might do the deed and
  history credits a canon hero anyway.
- **Reload honesty.** Divergence is real history in the save; reloading
  to undo a ripple follows save integrity (rule 9), not a timeline power,
  unless a world or cheat grants one.

### Q6 Odd worlds: possible idea, parked

Weibao: "we don't quite need one quite yet, just save as possible idea."
Recorded as a possible idea: one odd world or a family of them, each
remixing different sources. No choice needed now.

## Current rule-fit qualification, 2026-10-18

The implementation slices remain parked by the recorded user instruction.
Carry-table biology and memory-based combat examples above remain qualified by
the later source pack, its evidence levels and actual means (AD1–AD9/AD11/AD38).
A prototype "once per fight" is an illustrative cadence, not a universal limit
on an extraordinary technique. A developer test hall is not a required first
world or a reason to reveal sealed truths to the player. Current compatibility
and UI_RULES targets apply if a slice is later selected; no build is selected here.
