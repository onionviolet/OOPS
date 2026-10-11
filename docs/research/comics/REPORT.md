# Comics wiki pilot (Marvel and DC)

*Status: research and proposals, not accepted. Run 2026-10-10 by Claude Code
at Weibao's request ("run the pilot"). Nothing here changes code or saves.*

## What was pulled

Source: Marvel Database (marvel.fandom.com, about 280k articles) and DC
Database (dc.fandom.com, about 135k articles), through the standard
MediaWiki API (`api.php`). Helpers: [fetch_wiki.py](fetch_wiki.py). Raw
pulls sit in `raw/`, which is gitignored.

| Pull | What it is | Used for |
|---|---|---|
| Marvel Power Grid | Official handbook 1 to 7 ratings in six stats, with page counts per rank | Stat ladder and rarity |
| Power and origin categories | Page counts per power (both wikis) and per origin (mutant, mutate, magician, cyborg, deity, robot) | Power families and acquisition routes |
| Life-state flags | Formerly deceased, secret or public identity, hosts of passed-on forces, jobs, alignment | Death, identity, careers |
| 24 mantle pages | Disambiguation pages for legacy titles (Robin, Green Lantern, Iron Fist, Sorcerer Supreme and more) | Succession |
| Event lists | 382 Marvel and 159 DC event pages | World events |
| Green Lantern ring pages | Ring rules, recharge, weakness | One worked mechanic |

**License.** Both wikis report CC BY-SA for text (checked through the API's
`rightsinfo`). Reused text needs attribution and the same license; images are
not covered. The characters and settings stay Marvel's and DC's. So: numbers
and our own paraphrased mechanics live here; any direct franchise world goes
in the private pack, per [PROJECT.md](../../../PROJECT.md).

**Reliability.** A wiki is a reading of canon, not canon. Labels below:
**shown** = counted or read in this pull; **stated** = the wiki says it, with
the issue it cites; **inferred** = my interpretation.

## Findings

**F1 Power Grid as a ready stat ladder (shown).** Six stats (Intelligence,
Strength, Speed, Durability, Energy Projection, Fighting Skills), seven
named ranks each. Strength ranks are physical: "Normal" lifts up to twice
body weight, "Peak Human" up to 800 lbs, then 25, 75 and 100 tons, then
"Incalculable". The wiki refuses grids from the Marvel website because of
known errors, and keeps old grids even when stories outgrow them.

**F2 Mastery is rarer than raw power (shown).** Among about 3,000
characters with a grid:

| Stat | Bottom-normal share | Top rank share |
|---|---|---|
| Strength | Normal 40.9% | Incalculable 7.7% |
| Durability | Normal 37.8% | Virtually Indestructible 8.4% |
| Energy Projection | None 44.8% | Virtually Unlimited 3.7% |
| Intelligence | Normal 44.4% | Omniscient 2.1% |
| Speed | Normal 53.7% | Speed of Light 1.0% (Warp, mostly teleporters, 14.1%) |
| Fighting Skills | Normal 31.9% | Master of All Forms 1.4% |

*Inferred:* in a superpowered setting, total skill mastery is rarer than
god-tier strength. That backs the vision point that ordinary skills stay
useful late. Caveat: only handbook-worthy characters get grids, so this
skews toward notable people; a real population is far more "Normal".

**F3 Accident equals birth (shown).** Marvel tags 13,736 mutates (powers
from an event) and 12,842 mutants (born with it), then magicians 2,367,
cyborgs 2,176, deities 1,966, robots 1,352. DC tags "Unique Physiology"
2,278, "Divine Empowerment" 895, "Cybernetic Enhancement" 546. Marvel also
lists 36 named power sources (arc reactor, cosmic cube, power stone,
dimensions of light and dark force). *Inferred:* origin is a build choice
with roughly equal weight between "born" and "happened to me", and power
sources are places and objects you can reach, not only traits.

**F4 Powers that touch other powers (shown).** Marvel: Power Bestowal 624,
Power Mimicry 179, Power Negation 165, Self-Resurrection 96. These are the
meta-powers that make a setting a system: teaching, copying, cancelling and
cheating death.

**F5 Death is a revolving door, but a narrow one (shown).** Formerly
deceased: Marvel 1,407 against 24,274 deceased (about 5.5% of the dead came
back); DC 566 against 7,069 (about 7.4%). Pages also tag "Killed by X" per
killer and per event ("casualties" categories). *Inferred:* return from
death is real but rare, and each death is a record with a killer and an
event attached. That fits our defeat stance (true death is a proposal) and
the life record.

**F6 Secret identity is the default life (shown).** Marvel: 24,975 secret
against 14,574 public (about 63% secret). DC: 12,004 secret against 16,343
public (about 42%). Pages tag ordinary jobs: Marvel scientists 4,251,
students 3,204, inventors 1,244, teachers 1,028; one Spider-Man page also
tags bodyguard, wrestler and teacher. *Inferred:* most heroes hold a second
life with real jobs, the exact life-sim layer we are building.

**F7 Mantles are offices with succession rules (shown and stated).** The
pulled pages show several distinct transfer rules:

| Mantle | How it passes (stated on the page) | Game shape (inferred) |
|---|---|---|
| Iron Fist | Defeat a dragon and take its chi; later chosen and trained | Trial office |
| Sorcerer Supreme | A held office; former holders listed by era, including the 1850s and 1950s | Appointed office with history |
| Ghost Rider | A spirit bonds to a host by pact, medallion or car; listed riders span 1,000,000 BC to cowboys | Possessing force that picks hosts across eras |
| Doctor Fate | A helmet whose spirit chooses and can override the wearer | Item-borne office with a will |
| Green Lantern | A ring chooses by willpower; two separate legacies (magic and cosmic corps) | Corps membership by trait |
| Robin | A sidekick role passed through five holders, one murdered and resurrected | Apprenticeship that can end badly |

Passed-on forces have host counts: Venom symbiote 615, Phoenix Force 215,
Enigma Force 68 (across realities). The mantle pages also list impostors,
robot copies, doppelgangers and alternate-reality holders. *Inferred:* a
mantle attracts fakes; claiming one invites challengers.

**F8 Weakness rules change by era and can be outgrown (stated).** The Green
Lantern ring page says: rings once needed recharging every planetary
rotation (24 hours) regardless of use; a later protocol recharges only when
drained; overcharge has been seen to 325% (cites *Green Lantern Corps* vol
3 #20); the old yellow weakness can be bypassed by "accepting fear", and
rookies are more vulnerable to it. Power is limited by willpower, and a
strong will can partly recharge the ring. *Inferred:* this is an idle-game
timer the fiction explains, with a rule that changed between eras. It is a
direct test of "readings can be wrong" and "each world makes its own
rules".

**F9 Universes and events at scale (shown).** Marvel has about 4,780
reality pages, DC about 630 plus about 700 subcategories. Marvel's 382
event pages mix publisher crossovers (Civil War, Secret Wars, Annihilation)
with real history inside the fiction (Black Plague, Cuban Missile Crisis,
Chernobyl). DC's 159 include repeated reality resets (Crisis on Infinite
Earths, Zero Hour, Flashpoint, New 52, Rebirth). *Inferred:* comics treat
real history as world events and treat reboots as in-world events.

## Mechanics to absorb (proposals)

Each item is original design; names here are references, not content.

- **M1 Seven-rank descriptor stats.** Use F1's shape (named ranks with
  physical anchors) wherever a world shows stats as descriptors instead of
  numbers. Fits the world card "display" dial.
- **M2 Rarity from real distributions.** Use F2's shares to set how rare a
  top rank is per stat, with mastery rarest. A world can turn the dial.
- **M3 Origin routes.** Born, accident, crafted body, learned magic, divine
  gift, bonded force, reached source (F3). Each is a different acquisition
  path with its own upkeep, matching the JJK "any route" ruling.
- **M4 Meta-powers.** Bestow, copy, negate and self-revive (F4) as rare
  traits that interact with every other power, including teaching (bestow)
  and the anti-cheat side of rivals (negate).
- **M5 Death record.** Every death stores killer, event and place (F5).
  Return is rare and costed, never default. Plugs into the life record and
  heirs.
- **M6 Two lives.** Hero time competes with job, rent, sleep and people
  (F6). Exposure is a state with consequences. Village career and patrol
  are already the civilian half.
- **M7 Mantles.** A title with its own record: holders, enemies, gear,
  reputation and a transfer rule from F7 (trial, appointment, possession,
  item will, trait test, apprenticeship). Heirs can inherit a mantle without
  its powers. Fakes and challengers come with it.
- **M8 Charge items.** A tool with a charge, a recharge rule and a
  weakness that training can outgrow (F8). Recharge rules can differ by
  world or era.
- **M9 Event deck.** A world's events can include crossovers, faction-split
  laws (registration), resets and real-history moments (F9). A reset is a
  timeline event, with "natural course unless disturbed" deciding what
  survives.
- **M10 Rogues and impostors.** Recurring enemies who escape, escalate and
  learn; plus impostors drawn to any mantle you hold. Owner:
  [ENEMY_PROTAGONISTS.md](../../ENEMY_PROTAGONISTS.md).

## Draft world card: the Masked City (original, proposal)

Uses the [world card format](../../WORLD_CARDS.md). Inspired by comics in
general; no franchise names or characters.

| Field | Content |
|---|---|
| Premise | A modern city where powered people are rare but public, and most of them still hold day jobs. Titles outlive their holders. |
| Signature laws | Mantles (M7) carry their own record. Deaths are recorded with killer and event (M5). The city's status quo pulls back unless strongly disturbed. |
| Absences | No default revival; a rare costed route exists (M5). |
| Dials | Danger: medium, spikes in events. Death: injury by default, final in events. Stat source: both. Display: seven named ranks (M1). |
| Display | Descriptor ranks per stat; numbers hidden unless a power reveals them. |
| Growth | Origin routes (M3); training can raise a rank, mastery is the rarest top (M2). |
| Stance | Natives mostly unpowered. Powered people choose public or secret identity (M6); registration laws can flip that. |
| Scarcity | Mantles, power sources, trusted allies, sleep. |
| Deck | Patrol nights, rogues returning (M10), impostors, crossover events, a registration vote, a reset. |
| Doors | Rifts from other worlds; a mantle's gear can cross with a carrier. |
| Places | Day-job districts, a prison with a revolving door, a hero team base, a corps outpost. |
| Swap test | The only world where your title matters more than your body, and where your second life competes with the first. |

## What this does not claim

No comic issues were read; issue numbers above are the wiki's citations.
Category counts include alternate realities and variants, and the wikis
categorize differently (DC has no matching power-bestowal category, for
example). The pilot did not survey every mantle or event, and the mantle
link counts in `raw/` are noisy (impostors and alternate realities included).

## Next (not started)

- **Fan fiction pilot (done 2026-10-10, [report](../fanfic/REPORT.md)).** Study how fan writers handle self-inserts,
  crossovers, fix-it rewrites, power-system rationalization and "what if"
  premises. AO3's tag system is a structured taxonomy with work counts.
  Check AO3's terms and robots rules before any automated pull; reading tag
  pages by hand is the safe start. Fan fiction does not establish canon
  ([BOOKSHELF_INSPIRATION.md](../../BOOKSHELF_INSPIRATION.md)).
- A private Marvel or DC pack only if Weibao picks one; it would use the
  same pulls with names intact.
- Specific comic worlds and alternate realities as run targets:
  [PLAYTHROUGH_TARGETS.md](PLAYTHROUGH_TARGETS.md).
