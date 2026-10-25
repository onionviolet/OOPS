# Protolike Discord sweep: other developers' UI and design posts, 2026-10-24

Bounded research pass on the Arcanum Discord (guild `622495527485046805`) for
protolike and idle-RPG projects by other people, focused on cultivation UI,
crafting and job dialogs, item tooltips and production panels. Companion to
[PROTOLIKE_UI_REFERENCES_2026-10-24.md](PROTOLIKE_UI_REFERENCES_2026-10-24.md)
(its F1–F7 are cited here as **U1–U7** to avoid code clashes).

Research and proposals only (AD32). No runtime, save, PROJECT.md or
USER_VISION.md change. Applies WPR rules for a source pass, UR59 (speaker,
channel, date, link), UR7, UR47, UR53; MR11; AD5, AD38. Desktop first; mobile
deferred.

**Route.** Weibao's signed-in Chrome through Claude in Chrome, Discord's own
search UI, one tab, human-paced pagination (3.5–5 s per page). No token
access, export tool or account change. Attachments were fetched once each from
the signed CDN links shown on the page, 2.5–4.5 s apart, no cookies or
credentials sent. **Private evidence** (gitignored):
`docs/research/discord-arcanum/private/protolike-sweep-2026-10-24/`, holding
`RAW_page_dumps.md` (9 verbatim search dumps), `RAW_onko342_my-game.md` and
`media/<author>/` with 149 images or clips plus a hashed `manifest.json` per
author (corc 1, onko342 48, sardinemilk 58, mercurius 39, shadow78755 3; 0
errors). Other people's words stay there; this file paraphrases.

Link form: `https://discord.com/channels/622495527485046805/<channel>/<message>`.
Channels: #proto-23 `811370601129705483`, #other-general `1458892378327879700`,
#yet-another-idle-rpg `1458887440398942300`.

## Sources of the supplied screenshots (UR59)

Five of the seven supplied images are now traced. **S1 corrects the companion
doc**: it guessed the Cultivate card came from Cultivating All the Above, and it
attached the "not final, just experimenting" remark to the wrong dialog.

| Ref | Supplied image | Speaker | Channel | Date (UTC) | Message | Evidence |
|---|---|---|---|---|---|---|
| S1 | Cultivate card (Shallow Breath method, Ki 866/25000) | Corc, Proto23's author | #proto-23 | 2021-10-26 | `902703368290598932` | shown: saved image is pixel-identical in content. Caption says the UI was unfinished, and that a technique can be practised and has stages that work like skill milestones. Already filed as DR2 in [RESEARCH_CULTIVATION_PATHS.md](RESEARCH_CULTIVATION_PATHS.md#discord-ui-references); the companion pass missed it. |
| S2 | Bread tooltip (first-try bonus, Tried flag) | Corc | #proto-23 | 2025-10-19 | `1429468652301848626` (v1), `1429469119199187005` (v2) | shown. The "not final, just experimenting" remark belongs here, not to the Cultivate card. |
| S3 | Craft Progress (Straw Basket, time left, cancel) | Corc | #proto-23 | 2026-02-28 | `1477295496312918220` | shown; downloaded to `media/corc/`. Caption: a small UI update for crafting. |
| S4 | Blue four-column wireframe ("Placeholder: Location Name, Date/Time", "Inventory") | onko342 (Cultivating All the Above) | #proto-23 | 2026-07-06 | `1523699144416559196` | shown. The caption calls it their new UI, still ugly. An earlier version (`1523681681435787375`, same day) was a row of tiles. |
| S5 | CDDA inventory | shadow78755 | #proto-23 | 2026-05-22 | `1507328495725051984` | shown. Posted as admiration for Cataclysm's dense terminal UI and MS Gothic-style fonts, not their own game. |
| S6 | NekoRPG ice-engine panel | NekoRPG (game UI); discussed in #Nekorpg | n/a | 2026-07 | instructions `1522521666096205915` (onko342, 2026-07-03) | stated: players found the piston loop confusing, and onko342 wrote a step order (load material, add air outside, compress, wait to cool, move in, expand, wait for bar, move out, repeat). The panel's own origin post was not located. |
| S7 | Upstream YAIR main screen | n/a | n/a | n/a | n/a | not searched (upstream game, not a Discord post) |

## Findings

**F1. The stage ladder is a Proto23 method feature from 2021, and Corc framed
it as skill milestones** (stated, S1). The caption links practising a technique
to staged milestones, and a companion post the same minute (`902703178783522928`)
says the method boosts the matching absorption and yields XP. Proto23's
2026-09 cultivation tooltip (DR6) later added a support technique, state of mind
and difficulty. Cross-ref: confirms U1's ladder shape and gives it a mechanism:
stages are milestones of the method skill, not a separate realm system. For
YAIR, this supports U2 (MR11: ladder only where a world declares stages), and
the method's own skill level is the natural driver.

**F2. Corc's tooltip family shares one frame** (shown, S2, S3; prior capture
`1451305842501615646`, 2025-12-18). Dark box, title row, rule lines, a
description line, one effect line, then class and rarity. Item tooltips (Bread,
Dagger with DP bar), the job card (Craft Progress) and the Cultivate card all
use it. The 2025-12-18 post adds a hover on a recipe's tool requirement that
shows which tools qualify. Cross-ref U3/U4: one hover frame (UR47) for items,
jobs and cultivation is what Proto23 actually ships, so the companion's "reuse
the same row" proposal matches the source. The Dagger's DP bar shows
durability as a bar in the tooltip.

**F3. The community pushed back on negative first-try effects** (stated, S2
thread). Corc considered negative first-time effects for terrible food. Three
players objected: it punishes completionists, the game already rewards eating
bad food through Survival, and players would just throw such food away. Corc
said rotten food has other consequences for the player to find. Two players
preferred the second, plainer tooltip. Cross-ref U4: keep first-try rewards
positive or informational; put food harm in the mechanism (rot, illness),
which also fits AD38.

**F4. onko342's Cultivating All the Above design notes** (stated, #other-general
and #proto-23, 2026-07 to 10; repo `onko342/cultivating-all-the-above`):

- Two worlds joined by a portal: a system-apocalypse modern world and a
  cultivation world. Several separate progression systems (kill levels, qi,
  body, soul, stellar, bloodline) linked mainly through how XP multipliers
  apply (`1522825579873701942`).
- Each realm gets its own cultivation minigame; other systems may reuse one
  method across realms (`1557069871957934090`, `1557070048903045206`).
- Cultivation needs specific locations to yield qi. There is no rest tab
  because sleep and cultivation both count as rest, sleep blocks other actions,
  and cultivation can run alongside crafting (`1524373172466483250`, `1524373803084550286`, `1524373903005192262`).
- Cultivation fields such as latent roots and mortal body stay hidden until the
  character meets cultivation (`1557066528988463125`). Shown on the stats card
  `1557064146351296612`: name box, level, a glowing title, then those two rows.
- Letter ranks: big XP multipliers only on letter-rank advancement levels,
  additive percent bonuses elsewhere; enemy base XP by letter rank; over/under-
  level adjustment by rank difference, borrowing NekoRPG's realm-based XP
  bonus/malus; crafting tiers mapped to one letter rank across traditions
  (`1525941582094663750`).
- Custom techniques the player authors; identical technique effects softcap,
  so the best one counts fully and each extra one counts exponentially less
  (`1522851422742380615`).
- QOL unlocks by skill: a spell is manual at first, then gains an auto-cast
  every N seconds, then more options, until casting is optimal by instinct
  (`1523593122863513763`).
- Training and cultivation gain offline efficiency until offline equals online
  (`1527367926502658068`). Optional prestige only per module, for example
  releasing all cultivation for permanent talent and a foundation redo
  (`1560586682628047010`).
- Titles drive logic; unique world-first titles ("I touch grass" for a
  billion plant kills, `1543112439791616130`).

Cross-ref: the location gating matches U2's governing row and the red "varies
by location" line. Hidden-until-introduced fields match our discovery rules
and sealed-secret posture. The rest-overlap rule (cultivate while crafting,
not while asleep) is a concrete answer to how cultivation shares the action
queue in `src/home_cultivation.js`. All of it is the developer's stated
intent; only the stats card, titles and tabs are shown running.

**F5. onko342's UI choices** (shown, `media/onko342/`). Resizable boxes with
nested tabs and short tab codes (CURR, LOCN, WRLD, `1524353111093678171`); a
hidden-tab mechanic with ???? names planned (`1524419911349178408`); a bottom
bar with icons, where onko342 asked whether to replace them with text; status-bar
tooltips; a "compact" stats mode pairing related stats side by side as realm
names multiply (`1557370068139122688`, from their reply on 10-06); and rankings
in coloured tiers (`1558098211791577138`). Cross-ref U7: matches our
top-centre location and description anchoring. The paired compact stat format
is a candidate if our skill list grows long.

**F6. SardineMilk's protolike is fully data-driven, with the player as an
ordinary actor** (shown and stated, #proto-23, 2026-05 to 10). Panels styled as
retro windows (STATUS.DAT, ACTION.APP, ACTIVITY.APP, COMBAT.DAT, SKILLS.DAT;
`1559668535108571179`). Key features:

- An **activity panel** for a running activity with several bars at once
  (climbing a sea cliff: height 114/200 plus grip 100/100) and a leave button.
- Good and evil combat columns, and a log of level-ups.
- UI declared in data (bars bound to values), updating only when a watched
  value changes, not every frame (`1539959311835594782`).
- Effects written as triggers and modifiers on events, for example thorns
  reacting to health loss (`1549748695832993853`). Infinite trigger loops
  resolve at a stack limit (`1535341113433399336`).
- World state kept apart from per-actor state; the player is special-cased only
  at UI init, and death is a "plot armor" effect that cancels deletion and
  sends you home (`1543291284666720267`, `1557497765624553613`).
- Weather as a condition that adds a CSS class to the game screen
  (`1540822067044163766`, clip saved).

Cross-ref: the multi-bar activity panel goes beyond U3's job card. When an
activity has more than one deciding quantity (grip and height, heat and
pressure as in U5), show each as its own bar with a leave action. That is
AD38's "show what decides it" in a running-job form.

**F7. Mercurius: tag-based tool checks, recipe-derived yields, honest prices**
(shown and stated, #proto-23, 2026-07). Placeholder three-pane UI with a
stamina, hands and wear column, an element ledger, and verb buttons per tab
with locked tabs greyed (`1524242356440797254`). Mechanics:

- Tradeskill steps need a tool carrying a tag (`1525216953948700692`).
- Data-driven synthesis: a digest job's yields derive from the target recipe's
  inputs, so no verb hard-codes its products (`1525890116143419513`).
- Barter prices are never estimated arbitrarily, a lesson credited to
  Groundhog Life and Progress Knight (`1525950926425293112`). The displayed
  number always leans against the player: prices as ceilings, offers as
  floors, forfeits as ceilings.

Cross-ref U6 and MR11: tag-qualified tools match Corc's sharp/blunt hover (F2)
and our role chips. The leaning-number rule is a small, testable UI default
for any trade or estimate readout.

**F8. Community framing of "protolike"** (stated, #proto-23 and
#yet-another-idle-rpg, 2025-01 to 2026-10). Players list YAIR, PJ-1, The Climb
and NekoRPG as protolikes. They tie the label to HTML/JS, slow deliberate
progression, ???? bonuses and terminal fonts, and note that no protolike has
an ending yet. A 2025-01 thread proposed a shared wiki or repository for
protolike makers; a 2026-07 thread floated a game jam. Several active
developers (SardineMilk, onko342, Mercurius, shadow78755, a "Biggest Ego"
account, Socradeez on ecology simulation) post work in progress. Inference:
the audience values legibility of hidden mechanics more than polish, which
supports U1/U2's "show the governing factor" choice.

## Proposals carried forward (not accepted)

Ranked; each extends a companion finding rather than replacing it.

1. **P1 (U1, F1):** drive any declared stage ladder from the method's own
   skill milestones. The card shows previous, current bar and next, as
   proposed.
2. **P2 (U3, F6):** a running activity with two or more deciding quantities
   shows one bar per quantity plus Leave. Single-timer jobs keep U3's
   one-row card.
3. **P3 (U4, F3):** first-try effects stay positive or informational; harm
   lives in food mechanisms.
4. **P4 (F7):** trade and estimate numbers lean against the player by default.
   This is a dial a world can set otherwise with an in-world reason (AD5).
5. **P5 (F4):** cultivation counts as rest; it can overlap light crafting but
   not sleep. This is a per-world default to test against
   `src/home_cultivation.js` job rules, not a new rule.

## Coverage and gaps

Searched server-wide, all dates, with complete pagination:

- `from:corc_lp5 has:image`: 420 results, 2019-11 to 2026-10-18. Captions read
  for 112 posts since 2025-10; only S2, S3 and prior-capture images viewed.
- `from:onko342 has:image`: 338. Captions read; 48 own-game images saved.
  NekoRPG playthrough screenshots in #Nekorpg and #other-general were skipped.
- `from:onko342` with `my game` (34) and with `cultivation` (70): full text
  saved.
- `from:sardinemilk has:image`: 91, with 58 #proto-23 dev images saved. Their
  text-only messages (780 total) were not read.
- `from:mercurius has:image`: 99; 39 dev images saved. The last page showed
  unrelated 2026-10-23 text, so the filter may have dropped there.
- `from:shadow78755 has:image`: 3, all saved.
- Keyword `protolike`: 111. `my game has:image`: 47. `piston`: about 20.
- `excuse to update ui`, `ki gain`, `cultivate`, `Shallow Breath`: used to
  locate S1 and S2.

Not read:

- #user-modules: one 2022 archive page of Arcanum module links, not protolike.
- #users-code: only the latest page read. Newest item: Treble planned an
  Arcanum-inspired game on 2026-10-07, then joined Arcanum's team instead.
- The #Nekorpg channel beyond the piston search.
- The #proto-23 threads that list protolikes, and forum or thread channels
  generally.
- The "Biggest Ego 2026" developer's posts (handle unresolved).
- Socradeez's ecology sim, Mai's YAIRPG mod, and Maxtech's protolike
  translation.

Images were viewed for about 15 of the 149 saved files. Every other image
claim is caption-based (stated).

## Round 2 (2026-10-25): threads, SardineMilk text, NekoRPG, ecology, Arcanum

Weibao asked for the top gaps plus ecology and Arcanum ideas. Same route and
pacing. Threads are read through `in:<thread>` search, because lazy loading
stalls when a thread is scrolled programmatically. New private material:
`RAW_page_dumps.md`, now 22 dumps, and 53 more media files (PJ-1 15, Learning
Curve 33, The Climb 3, Socradeez 2), making 202 in total with 0 errors.
Thread IDs: PJ-1 Journey Beyond `1325544066586509363`, Learning Curve
`1433933410698530907`.

YAIR owners cross-referenced:

- World ecology line in [LIFE_SIM_NORTH_STAR.md](../LIFE_SIM_NORTH_STAR.md):
  over-hunting leaves a world poorer.
- PF07 habitats and ecology in [ENGINE_EXPANSION.md](../ENGINE_EXPANSION.md):
  capacity and care policies, population state, sustainable yields.
- "Place and renewal" in
  [GATHERING_AND_RESOURCE_USES.md](../GATHERING_AND_RESOURCE_USES.md).

**F9. The protolike thread map** (shown, #proto-23 thread list, 2026-10-25).

- Per-game threads: Learning Curve, PJ-1 Journey Beyond, The Climb (web build
  `tomlipo.github.io/the-climb`), Immortality idle and a YAIR thread.
- Alhixx started several off-topic threads ("burn the witch" was read and is
  off-topic).
- Learning Curve is a player thread (852 messages, 35 image posts) sharing
  stats, spells, combat-mastery milestones and bug reports from an RPG Maker
  build (stated, from a joiplay filename). Its developer was not identified.
- The Climb's thread starter is a player. Its developer was reported doing a
  final playtest before a closed beta on 2026-10-14 (stated, #Nekorpg).

**F10. PJ-1 Journey Beyond, a cultivation time-loop protolike by Remitre**
(stated, PJ-1 thread, 358 posts read, 2025-01 to 2026-02). It is a public
TypeScript/Next.js repo with its web build at `starkrieg.github.io/react-pj1`.
Inspired by Temporal Eden.

- **Loop and lifespan.** Each life is a loop. "Potential" falls with age and
  reduces gains. Decline grows more slowly with a longer lifespan. A big boss
  has a soft year target. Remitre prefers a short total game (not weeks long),
  and says more content in a time loop needs automation or shortcut mechanics,
  or it becomes unbearably long (`1451749898444738611`).
- **Skills without a ceiling.** Rank is the percent bonus (level 100 = +100%).
  Meditate speeds every skill's training, including its own. Endgame was tuned
  around skill level 400. Each 100 ranks of Odd Jobs unlocks an upgrade.
- **Caps that slow, not stop.** Training gain slows as qi or body nears its
  cap. Some realm-ups favour a fuller qi bar. A qi doubler raises the cap, not
  the current amount. Consumables for a capped stat are hidden from the market
  rather than greyed out, so players don't waste money (`1336082629136482422`).
- **Internal injury.** It scales with damage relative to current HP, and
  critical hits double it. Body drives recovery, which made it trivial late.
  Remitre planned injury capacity that scales with power.
- **Gear as an arsenal.** Weapons and armour stack cumulatively ("fight with
  an arsenal"). They add to base stats, which are then multiplied by level,
  martial arts and qi spells, and injury.
- **Zone power is a floor, not a promise.** Zone progress persists across
  defeats until cleared. Experience depends on your power against the enemy's.
- **Planned rework.** Fewer stop checks between minor realms, real enemy
  stats, locations with more than "fight", and small time-bound quests within
  a loop (be somewhere in a certain year for an item).
- **Player requests Remitre accepted.** Auto-breakthrough for realms already
  reached in past loops; a pause on revival; auto-reassigning the previous
  activity; a market split into sections.
- **Self-assessment.** In 2025-12 Remitre called the code too fragile to
  extend and wanted "a couple dozen branching paths that really affect one
  another".

Cross-ref: hidden-when-useless consumables and "zone power is a floor" fit
UR7's named reasons. The age-driven potential curve gives the stage ladder (P1)
a lifespan axis.

**F11. SardineMilk's design reasoning** (stated, #proto-23 text, 456 messages
read). Public build at `sardinemilk.github.io/incrpg`.

- **Activities and actions.** Activities own one or more meters with min/max
  values and effects at the thresholds. Actions push progress into meters of a
  given type: climbing uses Distance and Grip (`1534179401460088843`). The
  stated goal is to extend YAIR's stance system so you choose the action you
  use to progress the current activity (`1530629112492855617`). This is the
  mechanism behind F6's multi-bar panel.
- **Three requirement kinds** (`1542579045017985096`): active but hidden; active
  but inert until met; and deactivated whenever unmet.
- **Order-independent stat layers.** Use stat layers (flat, percent,
  multiplier) so adding and removing modifiers lands on the same value in any
  order. SardineMilk warns that how a halving condition interacts with a later
  flat bonus has to be decided early (`1523658521835737109`).
- **Values resolved on read.** Lazily resolved values handle formulas like
  "+5% max stamina as max health per level". A reactor re-applies passives when
  any value they read changes, and the UI uses the same reactor.
- **No character level.** Skill milestones improve their own narrow slice,
  and attributes are the universal reward (`1524707583233884331`).
- **Death and travel.** Death sends you back to bed in the first area, and
  other places can swap in harsher death rules. Fast travel is a mental effect:
  you just don't remember the trip (`1527368652444405890`).
- **Magic.** Planned as metamagic over conditions and even rules (disable
  death, be in two places), plus an IF/THEN autocast and an Observe action to
  learn enemy traits.
- **Diegetic UI.** The UI exists in-world, built by cultivators. The
  protagonist-only panels are meant to look like hacked-on modifications
  (`1559704901431599155`).

Cross-ref: P2 now has a source mechanism (meters fed by chosen actions). The
three requirement kinds map onto our discovery and hidden-until-introduced
handling (F4, UR7).

**F12. NekoRPG design as players and its translator describe it** (stated,
#Nekorpg keyword searches for breakthrough, realm and dev; 128 messages, of
3,467 total). The NekoRPG developer is btly0711, who posted V3.22 (cloud
realm) on 2026-07-26.

- **Realm suppression and caps.** XP stays reasonable against current enemies,
  and banked XP carries over when the cap lifts.
- **Breakthrough gates.** Some gates require beating a specific boss or a
  minigame. Players called the post-sky grind confusing, because max XP
  without the breakthrough leaves you underpowered (`1549168686458474607`).
- **Family system.** Descendants have per-rank breakthrough and death rates
  that settle into an equilibrium population. One player built a spreadsheet,
  and a planned option would raise breakthroughs without raising deaths
  (`1519327145040543834`–`1519619419419185213`).
- **Secret realms** have an adjustable aura level. The aura was capped after
  it produced enemies stronger than the domain rank.
- **Time speed by realm.** Sky realm makes time pass 8 times faster
  (`1528512797481238618`).

Cross-ref U5/F1: ladders with a population view (how many reach each rank)
are a second presentation of the stage ladder.

**F13. Ecology across the server** (stated, Socradeez's 272 messages plus
`ecology`/`ecosystem` server searches, 138 results). Socradeez's "ProtoMMO":

- NPCs and players run on the same "action policies". You can automate your
  character, take over at any time, and die if the policy lacks defence
  (`1527364276346556617`).
- Catch-up is batched deterministically in one tick, then staged in phases
  around any non-deterministic parts (`1527361503358095380`).
- The ecology sim went through about 5 models, and none scaled while staying
  both balanced and influenceable. Their balancing kept ending in "a world full
  of worms, herbs, and badgers" (`1480435491705847962`). They then tried a
  flow-network model and in 2026-07 considered dropping the ecology sim to
  save the rest of the game (`1523423193958977556`).
- Animals have lineage and families; monsters do not. Monsters are the
  world's immune response: when overhunting or clear-cutting breaks the
  ecology, the world spawns causeless monsters, and possibly dungeons, to drive
  out the invaders (`1480417732301164686`).
- Others point the same way: onko342 asks how a cultivator kills ten thousand
  beasts and leaves the forest intact, and plans kill limits and real animal
  counts. SardineMilk says no protolike uses ecosystem slaughter well. Whim
  suggests a druid becoming the villain because you wiped out the ecosystem.
  An older Proto23 player asked why 400k wolf kills changed nothing.

Cross-ref: this backs the LIFE_SIM world-ecology line and PF07 with a
practical warning. A full population sim is the costly path; Socradeez's
failure suggests PF07's scoped stocks and sustainable yields, plus a
world-response agent, as the cheaper default.

**F14. Arcanum ideas worth carrying over** (from the
[2026-10-20 notes](discord-arcanum/private/ARCANUM_DISCORD_NOTES_2026-10-20.md)
F5–F15, rechecked against this pass, not re-collected):

- hover highlights of the resources a task gains, loses or both
- high resistance or negation chance instead of absolute immunity
- an auto-brew queue whose repeat entries guarantee prerequisites first
- unavailable equipment slots still listed so you can craft for them
- spells cast with all components at once (cooldown is the longest
  component's)
- deliberately vague lore that players can fill in

Cross-ref: the hover highlight pairs with F2's shared tooltip frame. The
resistance rule matches AD5's default, dial and reason.

## Round 2 proposals (not accepted)

1. **P6 (F11, P2):** model running activities as meters fed by a chosen
   action, so stances become the way you push the current activity.
2. **P7 (F13):** world ecology defaults to scoped stocks with sustainable
   yields (PF07) plus a world-response agent, such as monsters, a druid or a
   steward, when stocks crash. A full population sim stays a per-world dial.
3. **P8 (F10):** hide consumables that can't help right now, and show zone
   power as a minimum, not a promise.
4. **P9 (F13):** one action-policy layer shared by NPC routines and player
   automation, with the player able to interrupt at any time.
5. **P10 (F10, F12):** realms you reached in an earlier life get
   auto-breakthrough. A ladder can also show population (how many reach each
   rank).

## Round 2 gaps

- PJ-1's own source code: the public `starkrieg/react-pj1` repo was not
  cloned. A read-only clone would verify F10's formulas.
- SardineMilk's text outside #proto-23 (about 324 messages).
- #Nekorpg beyond the three keywords.
- The developers of Learning Curve and The Climb, and the "Biggest Ego"
  developer.
- Immortality idle and other per-game threads beyond their names.
- Mai's mod and Maxtech's translation, skipped as low value.
