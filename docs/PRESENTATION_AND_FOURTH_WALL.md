# Presentation, animation and the fourth wall (proposal)

> Codes renamed 2026-10-19 from GR1-GR8 to PGR1-PGR8 to avoid collision with registered GR (generation foundation rules). See [reserved prefixes](RULES_INDEX.md#reserved-prefixes-2026-10-19).

> **How to use this doc (Weibao, 2026-10-10):** these are considerations
> for established and future worlds, to help ideaboard and implement
> fitting characters at fitting times. Tiers, lists and tables are
> illustrative, not complete or fixed; more distinctions can exist.
> Everything just has to make sense for the world and character at hand.

Claude, 2026-10-10. Weibao: "Animation style and coolness? Leaving room for
improvement/not gating things but also consider learning from stellar stuff
and more? Special things we can do with the sfx, like 4th wall kind of
stuff? Conceptual or OP powers having an effect on the UI and more?
shattering UI panels and more to consider?"

**Proposal only.** Grows out of [E8F adjectives](emergent/E8F_ADJECTIVES.md#implementation-text-effects-and-little-details-2026-10-10)
(text effects, presentation tables, beyond text). Each world sets its own
style and intensity (rule 2). References are from memory; verify before
citing details.

## Direction: restraint makes effects land (Weibao, 2026-10-10)

> It doesn't always have to be UI effects, this is to make any effect that
> does show up that much more impactful.

Everything in this doc is a **menu, not a default**. Most powers and
events show in plain text and in the world (what people say, what changes,
what's left behind). UI effects are rare, so each one that appears hits
hard. Proposed rules of thumb:

| Code | Rule | In practice |
|---|---|---|
| X1 | **Text and world first** | A fire power burns things in the fiction and the log says so; no screen effect needed |
| X2 | **Rarity ladder for presentation** | Ordinary: plain text. Notable: a styled word. Rare: a line effect. Exceptional: a panel effect. Unique: the whole screen or the fourth wall |
| X3 | **Effect budget** | A world, a fight and a session each get only a few big effects; spending one on something small cheapens the next |
| X4 | **Firsts are special** | The first domain, first shattering, first time a meta character reaches the tab: full effect. Repeats get quieter unless they escalate |
| X5 | **Long silences** | Hours of calm text make the one cracked panel unforgettable |
| X6 | **Earned, not ambient** | Big effects follow real causes (a true outlier, a world-breaking power, a story turn), never decoration |
| X7 | **Absence as an effect** | Sometimes the strongest moment is the UI doing less: no sound, no color, one line |

The tables below (powers that touch the UI, shattering, meta characters,
reach) list what is possible when something earns it, not what happens
every time.

## Principles

| Code | Principle | Why it matters here |
|---|---|---|
| P1 | **Baseline first, effects on top** | The game works with every effect off. Effects never gate play, never hide information, never block input |
| P2 | **Room to grow** | Every effect has a placeholder level (a color, an icon, a word). Better versions replace it later without touching gameplay. Nothing waits on art |
| P3 | **Quiet baseline, loud moments** | Most of the screen stays calm so a Black Flash or a shattered panel lands. Contrast is the coolness |
| P4 | **Intensity tracks the rung** | *Slightly* is a wisp; *absurdly* is a show (E8F ladders). Bigger powers, bigger effects |
| P5 | **Attention-aware** | An idle game is mostly unwatched. Animate when the player is looking; when they return, show a short highlight reel instead of replaying everything |
| P6 | **Style per world** | Ink and brush in a Hanzi world, crisp system panels in a status-window world, grime in a grim one |
| P7 | **Readable and comfortable** | Reduced motion, no harsh flashing, never color alone, a global effects slider |

## Animation style and coolness

### Proto23 discovery and native signatures, 2026-10-13

Weibao requested connecting the Proto23 source/UI findings to this VFX menu,
reviewing a full-context prompt through ChatGPT, then implementing. The
[source mechanisms](research/proto23/SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md)
own the reference evidence; the [implementation report](gm/dispatch/proto23-vfx-2026-10-13/REPORT.md)
owns the bounded native delivery and exact unrun gates. This accepts the
connection and implementation task, not every future effect or a fixed taxonomy.

Discovery decides which facts and controls are known. A settled gameplay cause
can then earn a fitting presentation signature. Neither color nor motion can
grant knowledge, imply an unobserved truth, spend a resource or resolve an action.
Native thresholds remain native; Proto23's numbers are reference behavior.

| Reference family | Connection to this VFX menu | Current/future boundary |
|---|---|---|
| First useful skill, recipe or method | A brief known-name ink/guidance cue; repeated routine progress stays quiet | Native skill threshold cue is the first implemented consumer; other discovery carriers still need owner-specific settlement/disclosure hooks |
| Earned title, owned fixture, newly useful tool | A material or mastery signature tied to actual provenance and local usefulness | Extend current title/furniture/equipment owners, not another grant system |
| Damage/result/requirement text | Legible line grammar and distinct semantics for resource, category, rarity and outcome | Never display body-part/elemental mechanics that the active engine does not actually resolve |
| Established extraordinary ability | Adaptation, spatial separation, erasure, time/rewind or a changed relation between text elements | Needs actual ability/world/observation authority; ordinary learning does not receive those signatures |
| Exceptional event affecting represented space | Fracture, panel displacement or a bounded shattered-panel layer | Preserve usable underlying controls and settled facts; no fabricated power or fake loss |
| Earned fourth-wall reach or deliberate absence | Rare whole-screen/meta composition, or silence/plain text when that fits better | Remains future world content; no host-file access, real save deletion or secret disclosure follows from presentation |

The first slice reuses existing effect settings, quiet default reduced mode and
native known-skill projection. It preserves the shared Stances pane, collapse
choices and saved layout. Effects-off keeps native logs and gameplay usable;
restores show learned state without replaying first-discovery flourishes. A
transactional craft cannot publish a discovery cue until durable settlement;
ordinary native XP keeps its existing synchronous settlement and autosave timing.
Full reach, escalating signatures, world materials, returning-player summaries
and extraordinary consumers remain in this document's menu, not delivery claims.

Text-native animation first, since the game is text today:

- **Kinetic type.** Words that move with meaning: *slowly* types in,
  *instantly* snaps, a shout scales up, a whisper fades in small.
- **Impact.** Hit-stop (a few frames of freeze) on big hits, a small
  shake on the log line, damage numbers that punch in and settle.
- **Anticipation.** A domain or Maximum gets a beat of build-up (the panel
  dims, a line of text holds) before the payoff.
- **Follow-through.** After the moment: embers settle, the crack stays, the
  log line keeps a faint mark.
- **Escalation.** Repeated or chained events build: the third Black Flash
  in a fight looks bigger than the first.
- **Rarity language.** Reuse the existing rarity colors (`rarity_colors`
  in [display.js](../src/display.js)) as the base palette, then add motion
  per rung.
- **Signature moments per world.** Each world gets one or two set pieces
  it does better than any other (a JJK domain opening, a Crucible
  tribulation lightning strike, a Frontier harvest).
- **Returning-player reel.** "While you were away" as three to five
  animated highlights, skippable, then the plain summary.

## Learning from great games (from memory)

| Game | What it does well | What to borrow |
|---|---|---|
| *Balatro* | Number punch, wobble, escalating score spectacle, a light screen filter | Make numbers feel good; escalation as reward |
| *Hades* | Clear, readable effects at high speed; boons with distinct colors per god | One color language per source or patron |
| *Hollow Knight*, *Celeste* | Hit-stop, small shakes, assist and accessibility options | Impact and comfort settings |
| *Vampire Survivors* | Spectacle grows with power until the screen is absurd | P4: effects scale with the build |
| *Persona 5* | Menus with attitude; UI as style | World-styled panels |
| *Superhot* | Time moves when you move | A time-stop power that freezes the UI except your controls |
| *Katana ZERO*, *Braid* | Rewind shown as the UI rewinding | Regression and rewind effects |
| *Undertale* | Characters who remember resets and saves | Meta-aware worlds (below) |
| *Doki Doki Literature Club* | UI and files that corrupt as the story turns | Corruption effects, kept safe |
| *Eternal Darkness* | Sanity effects: fake volume drops, fake crashes, fake save deletion | Fake system events, clearly reversible |
| *Metal Gear Solid* (Psycho Mantis) | A boss that reads your memory card and controller | A power that "reads" your game history |
| *Inscryption*, *Pony Island* | Layers of fake systems and meta frames | A world that is itself a game inside the game |
| *OneShot* | The game acknowledges the player as a separate person | A world where the player and the character are not the same |
| *NieR: Automata* | HUD elements are equipment chips; removing them removes the HUD | UI pieces as items you can lose, steal or equip |
| *Baba Is You* | Rules are words you push around | Rule and adjective text you can rearrange in some worlds |
| *Disco Elysium* | Skills speak as voices in text | Adjectives or powers with a voice in the log |
| *A Dark Room*, *Candy Box*, *Universal Paperclips* | The UI itself grows and changes as you progress | Unlock UI as progression, a native fit for an idle game |
| *Cookie Clicker* | The whole screen darkens as a hidden storyline turns | World-state adjectives tinting the UI |
| *Dead Space* | Diegetic UI, information on the character | In-world status shown as what people notice |

## Powers that touch the UI

Conceptual and overpowered powers can act on the interface, because the
UI is how the player perceives the world. Each effect is presentation
over real state; the state change is what matters.

| Power | UI effect |
|---|---|
| **Time stop** | Everything greys and freezes; timers stop; only your own actions stay clickable |
| **Time rewind / regression** | The log scrolls backward, timers run in reverse, then the screen snaps to the anchor |
| **Acceleration** | Timers blur; log lines stream by |
| **Infinity** (JJK) | Incoming damage numbers slide toward your health bar, slow down and never arrive |
| **Adaptation** (E8E) | A wheel overlay on the enemy panel turns a notch per step |
| **Domain** | The panel border and background become the domain's; your technique's lines can't miss visually either |
| **Omniscience / perfect sight** | Blurred tooltips unblur, hidden enemy stats appear, hidden adjectives reveal |
| **Erasure** | An enemy's name is struck from the log; a panel slot vanishes; a word goes missing from a sentence |
| **Copy** | A panel or skill row duplicates with a slight offset |
| **Theft** | The stolen thing visibly slides from their panel into yours |
| **Reality warping** | Layout rearranges; in Baba-like worlds, rule text becomes draggable |
| **Luck / fate** | Dice appear over uncertain outcomes; fate's thread connects related lines |
| **Illusion** | Fake log lines that look real; once disproved, they crack and fall away (rule 6) |
| **Mind control on you** | Your buttons relabel themselves for a moment; your choice is made for you, shown as a hand over the button |
| **Status-window powers** | The window itself is a thing in the world: it can be damaged, hacked, upgraded or stolen |
| **Concept of silence** | Sound cues stop; text goes small and grey |
| **Concept of size** | Panels scale with the thing you shrank or grew |
| **The system dies** | System panels go dark; you play from what you remember and notice |

Gags worth keeping:
- A mimic hiding in your inventory list.
- A curse that renames your buttons to insults until cleansed.
- A ghost that leaves notes in your log.
- An enemy that hides behind a tooltip.
- A trickster who swaps two of your panels.

## Shattering panels and UI damage

**As presentation:** a big enough hit, power or event can crack or shatter
a panel. Proposed stages, each an adjective on the panel (E8F):

| Stage | Look | Cause examples |
|---|---|---|
| *Hairline* | Thin crack lines on the border | Heavy hit, a minor reality strain |
| *Cracked* | Cracks across the panel, slight offset | A domain clash, a curse |
| *Shattered* | Panel breaks into pieces that fall away, then reassembles | An overwhelming conceptual attack, a world breaking |
| *Mended* | Reassembled with gold seams (kintsugi) | Repair; the seams stay as history |

**As state (optional, per world):** in fragile-reality worlds, UI damage
can be part of the fiction: a *cracked* status window reads values less
reliably until repaired by rest, a ritual or a technician. Default: purely
cosmetic.

**How to build it safely (proposal):**
- The real panel stays in place underneath and keeps working; the
  shatter is an overlay copy.
- Pieces made with CSS `clip-path` polygons on copies, moved with
  `transform` and `opacity` (cheap, smooth). A canvas overlay is an option
  for many pieces.
- Short: under a second to shatter, a beat, then reassemble.
- Input never lost: clicks pass through to the real panel.
- Reduced motion: crack lines only, no flying pieces.
- Kintsugi seams store as a small adjective on the panel, cleared or kept
  by setting.

## Fourth-wall effects

Tiers, from gentle to wild. A world picks its range; a global setting
caps it.

| Tier | Example | Notes |
|---|---|---|
| M1 **Knowing nods** | An NPC remarks that you seem to know things you shouldn't | Needs an in-world carrier (rule 5); stays in fiction |
| M2 **Tab and title** | The browser tab title changes ("don't leave"), the favicon changes with the world, the title reacts when you return | Harmless, very effective in an idle game |
| M3 **Real time** | Real hour, weekday, holidays shift moods and events (some idle games do this) | Reads only the clock, nothing personal |
| M4 **UI corruption** | Panels glitch, text scrambles, the layout misbehaves for a moment | Always recovers |
| M5 **Fake system events** | A fake crash screen, a fake "save deleted", a fake update | **Never real.** One click to dismiss; the real save is never touched |
| M6 **Save-aware worlds** | A world or character that remembers branches, loads or past runs (Undertale-like) | Collapses the player/character split on purpose; an outlier world, not the default |
| M7 **The export file speaks** | A character's letter tucked into an exported save; a file that greets you on import | Content only; the file stays a valid save |

Firm safety lines for meta effects (rule 9 and AGENTS.md safety):
- Never actually alter, delete or hide a save.
- Never read personal data (no names from the OS, no files, no history).
- Never request browser permissions (notifications, clipboard) without a
  direct player action.
- Every meta effect is skippable and has a static version.
- A settings toggle: meta effects off, gentle or full.

## Room for improvement: the effects pipeline

- **Effect registry.** Each effect: id, trigger (event or adjective),
  intensity by rung, duration, a reduced-motion version and a text
  fallback. Missing a version? Fall back.
- **One effects layer.** A fixed overlay above the panels for particles,
  shatters and flashes, so panels themselves stay simple.
- **Event-driven.** Gameplay emits events (hit, crit, domain opened, wheel
  turned); the effects layer listens. Gameplay never waits for an effect.
- **Budget.** A cap on simultaneous effects; skip effects when the tab is
  hidden (the game already uses HackTimer for background timing, so idle
  keeps running without rendering).
- **Effect gallery** in the [Proving Ground](worlds/proving-ground/WORLD_BRIEF.md)
  dev face: trigger any effect at any rung, compare versions, tune by eye.
- **Versioned.** Effects can be upgraded freely; they hold no save data
  except optional cosmetic marks (kintsugi seams).

## More to consider

- **Diegetic versus overlay.** In status-window worlds, effects happen to
  the window; in plain worlds, to what people say and notice.
- **Camera language for text.** Zoom on a single log line for a big
  moment; letterbox bars for a cutscene line.
- **Silence as an effect.** A big moment with everything else stopped.
- **Effects that tell the truth.** An effect never lies about state
  unless an in-world illusion is the cause, and then the log can reveal it.
- **Photo mode for text.** Freeze a moment, hide the UI, keep the scene.
- **Effect memory.** A world remembers its first domain, first
  shattering; later ones are a little less shocking unless they escalate.
- **Player-chosen flair.** A cosmetic signature for your own techniques
  (color, trail, sound), earned or crafted.
- **Rival flair.** Rivals have recognizable effects, so you know who
  attacked before reading the name.
- **Low-power mode.** Text only, no effects, for battery and old devices.

## Shared signatures, more UI powers, meta characters and reach (2026-10-10)

Weibao: "we can have core stuff share signature pieces? Other powers that
touch UI? character that does cool stuff and more? At what point should
they be able to interact outside and more? Expanding on each idea and
more?"

### Shared signature pieces

Yes: core moments share one **house signature** across every world, and
each world **reskins** it. The player learns the shape once and reads it
anywhere; the world's style keeps it fresh.

| Core moment | Shared shape (every world) | Example reskins |
|---|---|---|
| Breakthrough / level up | Hold, a rising line, a burst, the new rung stamps in | Ink brush stroke (Hanzi world); system chime and panel (status world); a quiet exhale and a stronger font (grim world) |
| Death / defeat | Color drains, the log line stops mid-word, a beat of silence | Ash, static, a candle out |
| Revival / rewind | The drained color flows back in reverse | Petals, rewinding tape, a heartbeat |
| World crossing | The whole UI slides out one edge and the new world's style slides in | Page turn, portal swirl, a train door |
| Trial start | Letterbox bars, the trial's adjectives listed one by one | Gong, countdown, a summons scroll |
| Title earned | The title word stamps in once | Seal stamp, engraving, a shout |
| Discovery (hidden thing revealed) | Blur clears letter by letter | Fog lifts, a lens focus, a cipher solving |
| Odd record noticed | A small eye icon blinks | A raven, a whisper, a camera shutter |
| Divergence | A split outline on the changed line | A cracked mirror, a forking thread |

**Families share motifs too.** All time powers share the clock motif;
all space powers share a grid; all soul powers share a pale flame; all
information powers share a lens. A new power inherits its family motif
until it earns its own (P2: room to grow).

**Your own signature.** Over a life, your repeated choices form a
personal motif (a color, a sound, a mark) that shows on your big moments.
Heirs can inherit it; rivals recognize it; a disguise must hide it.

### More powers that touch the UI

| Power | UI effect |
|---|---|
| **Invisibility** | Your own character panel goes translucent; enemies' targeting lines miss |
| **Possession of you** | Another entity's style bleeds into your panels; their font in your log |
| **Possession by you** | You get a second character panel with the host's stats, slightly wrong-colored |
| **Body swap** | Character panels slide and swap places |
| **Sealing** | A chained lock over a skill row or inventory slot |
| **Curse of forgetting** | Log history blurs; Notebook entries lose words until restored |
| **Prophecy** | A faint future log line appears ahead of time, greyed, possibly wrong |
| **Clone / split body** | The screen splits into two halves, one per body |
| **Shrinking** | UI scales down around a tiny you; panels loom |
| **Darkness / blindness** | Panels go dark except what you can still sense; text from sound only |
| **Madness / sanity loss** | Words occasionally swap for wrong ones; a tooltip lies (marked once you recover) |
| **Gravity** | Loose UI elements (notifications, icons) drift downward |
| **Space folding** | Two distant panels touch; drag an item across instantly |
| **Speed / haste** | Your timers run visibly faster; animations of others look slowed |
| **Wealth / greed powers** | Coins rain into the money counter; the counter overflows its box |
| **Fame** | Your name grows bolder in other people's log lines |
| **Death sight** | Faint countdowns over NPCs who are near death (rule 6: can be wrong) |
| **Contract powers** | A signed scroll pinned over a panel until the deal ends |
| **Inventory powers** (pocket worlds) | The inventory opens into a small scene with its own weather |
| **Narrative powers** (plot armor, protagonist aura) | Log lines about you get a highlight; enemies' lines about you trail off |
| **Rules powers** (Culling Game, Baba-like) | Rule text appears as draggable cards in a rules strip |
| **Concept of ending** | A "THE END" title card tries to appear; refusing it is a choice |

### A character who does cool stuff

A recurring **meta character** (or several, per world) who lives partly
in the interface. Original examples, each an option:

| Character | What they do |
|---|---|
| **The Lodger** | A small spirit living in your inventory: rearranges items "helpfully", eats junk, leaves notes in empty slots, hides from appraisals |
| **The Narrator** | Comments in the log in their own font; can be wrong, biased or lying; can be argued with in some worlds |
| **The Clerk** | The status window as a person: bored, bureaucratic, bribeable, sometimes on strike |
| **The Trickster** | Swaps panels, renames buttons, hides the save button behind a joke, always reversible |
| **The Cartographer** | Draws on your map, labels places with opinions, sometimes wrong |
| **The Echo** | A past self (ghost) leaving messages in your log from another branch |
| **The Cat** | Walks across the screen, sits on a panel, must be petted to move. Pure joy |
| **The Watcher** | Rarely seen; the eye icon is theirs. Knows about branches and menus. The fourth-wall character |
| **The Rival who learned** | An enemy who figured out the UI exists and attacks it |

Each is a full E3 person or entity with goals, moods and a relationship
to you. They can be befriended, annoyed, bribed, banished or invited
back. Their tricks are presentation over real state, and never block
play (P1).

### When can they reach outside? A ladder of reach

Reach is an adjective too (E8F *how wide*). A character climbs the ladder
only when the world allows it, the story earns it and the meta setting
permits it.

| Rung | Reach | Example | Earned by |
|---|---|---|---|
| R0 | **Their world only** | Ordinary NPC | Default |
| R1 | **Their panel** | The Narrator's font in log lines about them | Being a meta character |
| R2 | **Across panels** | The Lodger moves between inventory and Notebook | Trust, story beats |
| R3 | **The whole screen** | The Cat walks over everything; the Trickster swaps panels | A relationship milestone or a power |
| R4 | **The browser tab** | Tab title and icon change; they comment when you return | Late story; meta setting gentle or full |
| R5 | **The save and export** | A letter inside your exported save; they remember branches | Save-aware worlds (M6, M7) |
| R6 | **Outside the browser** | A notification when something big happens, only after you turned notifications on yourself | Explicit player opt-in, always |
| R7 | **Beyond** | Never: no personal files, no OS data, no real harm. The ceiling is fixed by the safety lines | |

Pacing proposals:
- **Never at first meeting.** Reach grows with the relationship, so the
  first tab-title message is a surprise that feels earned.
- **Each rung once announced in-world** ("did you see that? I can reach
  the edges now"), then normal.
- **Can be pushed back down.** Banish, seal or ask them to stay in their
  panel; they remember.
- **Different characters, different ceilings.** The Cat stops at R3; the
  Watcher can reach R5; R6 belongs to whoever you allowed.
- **Rivals climb too.** An enemy reaching R3 can attack the UI; defeating
  them restores it.

### Expanding the earlier ideas

**Signature moments per world** become a pair: the shared house shape
plus the world's reskin, and one or two set pieces only that world has.

**Powers touching the UI** gain a rule: the UI effect's size follows the
power's rung (P4), and the effect ends when the power ends, leaving at
most a cosmetic mark (kintsugi, a scorch on the border).

**Shattering panels** can be caused by characters too: a rival at R3
punches the panel; the Lodger mends it badly with tape instead of gold.

**Fourth-wall tiers** map to the reach ladder: M2 is R4, M6 and M7 are R5.

### More to consider

- **The player's name and identity.** Characters address the player by
  the save's chosen name only, never anything read from the system.
- **A meta character's death.** If the Lodger dies in-world, the inventory
  is quieter forever (or until revived). A strong emotional beat.
- **Meta characters across worlds.** Some stay in one world; some travel
  with you as UI residents (rule 5: the UI itself as a carrier).
- **Meta rivals between characters.** The Narrator and the Clerk dislike
  each other; their fonts fight over a log line.
- **Holiday and anniversary visits** using real time (M3): the Cat wears a
  hat on the save's anniversary.
- **A quiet setting.** All meta characters can be told to stay out of
  the UI entirely, and still exist in their worlds.
- **Learning from references:** *OneShot* and *Undertale* for characters
  that know about the player; *Doki Doki* for how unsettling it can get
  (and why a setting matters); *Neko Atsume* and desktop pets for the
  simple joy of a creature on screen.

The unique tier (a god looking at the screen, run-shattering events) is
in [cosmic events](COSMIC_EVENTS.md).

## Set pieces from *The Shooting Star* and more (2026-10-10)

Weibao shared [The Shooting Star (Demo)](https://www.curseforge.com/minecraft/mc-mods/the-shooting-star-demo)
(Minecraft mod by rimuru_dev, all rights reserved; borrow techniques only,
no names or assets). A handheld remote calls three orbital weapons, each a
short skippable film: a railgun shot shown by flying the camera from the
ground out past the galaxy and riding the beam back; a kilometre-long
needle dropped from Jupiter's orbit that hits silently, with the shock ring
arriving before the sound and the needle left standing in the crater; and
the Big Dipper projected onto the land, seven stars striking one by one,
then the constellation lines burning in as trenches.

The structure fits a text game. The spectacle comes from staging (scale,
order, delay and what is left behind) more than from rendering.

| Code | Technique | Text and UI version here |
|---|---|---|
| SP1 | **Scale flight** | Zoom out through the UI's own layers: log line, then panel, then world map, then atlas, then a starfield. Pause there, then ride back down to one log line. Each step is one crossfade, which is cheap and readable |
| SP2 | **Light before sound** | The flash and the result land first (numbers change, panel cracks) with no log text. The line and the sound arrive about a second later. Silence sells the scale |
| SP3 | **Telegraph as drawing** | The attack's shape is drawn across the screen before it lands: a constellation's points over the panels, a summoning circle, a sword-rain grid. Each point strikes in order, then the lines connect. The player can read it and, when the world allows, respond |
| SP4 | **The thing stays** | Aftermath persists in the world as state: the needle stands in the crater, star-core crystals can be harvested, the trenches are a new map feature. Ties to the "mark that stays" in [cosmic events](COSMIC_EVENTS.md#the-mark-that-stays) |
| SP5 | **Ritual activation** | Big powers take a physical-feeling input: flip a cover, then hold the button. A hold-to-confirm ring, a sealed scroll you drag open, a key turned twice. The input is the anticipation beat |
| SP6 | **Designations** | Weapons and techniques with serial names and a catalog (SS-01 style, or a sect's numbered forms). A short spec card is part of the fantasy and hints at how big it is |
| SP7 | **Film, then control** | Each set piece is a few seconds, skippable with one key, and has a static summary (P1, P5). The first cast plays in full; repeats play a short version (X4) |
| SP8 | **Honest warnings** | When something will permanently change a world, an in-world warning says so before you commit, styled to the world (a sect elder, a system prompt, a safety cover) |

### More set pieces in the same family

Proposals for fitting worlds and characters (rarity ladder X2 still applies):

- **Sky drop.** A moon, a mountain or a palace falls. The panels darken
  from the top edge down before impact.
- **Sword rain.** A grid of ticks appears over the enemy panel, then each
  one lands as a strike with a short delay. The count reads as the power.
- **Single cut.** A thin line crosses the whole screen. After a pause the
  top half of every panel slides a few pixels. Hit-stop and silence.
- **Eclipse.** UI colors drain to one tone over a few seconds. Only your
  own panel keeps color.
- **Flyover.** A dragon's shadow sweeps across the panels from one side
  to the other, and the log goes quiet while it passes.
- **Tidal line.** A wave fills the log from the bottom and washes old lines
  away, and they stay gone (diegetic log loss, reversible in settings).
- **Countdown from orbit.** A slow timer from a far-away weapon, visible
  for minutes or hours in an idle game. Anticipation as gameplay: prepare,
  flee, or point it somewhere else.
- **Tribulation clouds.** A cultivation breakthrough draws clouds over
  the top of the screen, and the lightning count scales with the talent.
- **Rival orbital.** An enemy has its own remote. You see their telegraph
  (SP3) drawn over your home panel and have a window to act.

### Build notes (proposal)

- Everything fits the effects layer above: CSS `transform` and `opacity`
  for panels, one canvas or SVG overlay for lines, telegraphs and
  particles, and the Web Audio API for the delayed thud in SP2.
- SP1 needs the UI layers to be addressable views (log, panel, map,
  atlas), which matches the existing plans for map and atlas screens.
- Prototype order if wanted: SP3 plus SP4 in the Proving Ground effect
  gallery (one constellation strike leaving a harvestable mark), then SP2,
  then SP1.
- Comfort: the mod warns about strobing. Here flashes stay soft and short,
  with reduced-motion and effects-off versions (P7).

### How these films are made (2026-10-10)

Weibao: "Is the short film generated? more to consider? Can we learn from
the code?"

**The Shooting Star.** No public source; all rights reserved. Verified
2026-10-10 by unpacking Weibao's downloaded jar (v1.3.4 Fabric, study
only, nothing copied into the repo):

- **No video files.** Each film is rendered live: 17 GLSL fragment shaders
  (one each for the world view and the space view of every weapon, plus
  bloom, god rays and a final composite), about 50 short sound cues, and
  real NASA and ESO photos (Earth, Moon, planets, Milky Way) as shader
  textures. Its credits file names every image source and license.
- **Films are shot lists in code.** A cutscene is an ordered list of shots,
  each with a start, an end, a blend-in time and a camera path (a hard cut
  or a sweep between poses, eased in and out). It also has a title card
  with tier and color, a priority, letterbox bars and a skip age. A director
  plays one at a time, hides the HUD, keeps the camera out of solid blocks
  and saves "cutscenes on, off or automatic" to a config file.
- **Each weapon is a beat sheet.** Its sound cues, read in order, form the
  script. For the railgun: cover flips open, button pressed, laser locks,
  countdown, rise into space, charge, fire, impact, roar, fade, embers, and
  an evac teleport that saves the caster. Gungnir has a "silence before the
  strike" beat right before the air splits and the boom lands (SP2).
- **Sound is time-stretched to fit the film.** A WSOLA routine slows or
  speeds a cue to match the cutscene clock without changing pitch, and
  caches the result. A separate music cue class fades the score in and out.
- **Comfort and hardware.** A warm-up screen compiles shaders and lets you
  skip, compiling the rest on first cast. A GPU check names exactly what
  is missing (texture units, half-float targets, driver errors) and
  explains it in plain words. Every skill shows its recharge time.
- **Aftermath is real.** Placed blocks (star cores, star traces) stay in the
  world, and a custom death message says the target was erased from orbit.
- **More is coming.** The jar already ships Earth and Moon textures for an
  unreleased moon set piece.

**Orbital Railgun** ([Mishkis/orbital-railgun](https://github.com/Mishkis/orbital-railgun),
MIT) is the open-source ancestor of this genre. Read 2026-10-10:

| Code | What the code does | Lesson for us |
|---|---|---|
| L1 | One full-screen post-process shader (`strike.fsh`) draws the whole strike. A single time value drives every phase: a 4 s targeting ring, then about 32 s of expansion, then the blast | A set piece is a **timeline as data**: named phases with start times and easing, driven by one clock. Easy to tune, skip and scale |
| L2 | Shapes are signed distance fields, raymarched per pixel. The look comes from math curves (`pow`, `smoothstep`, `1/x`), not art files | Procedural beats assets for a project with no artist. The same shader method runs in a browser through WebGL |
| L3 | The server runs its own clock. It pulls entities inward from tick 400 and resolves damage and terrain at tick 700, whatever the client shows | **Gameplay owns the result; the effect listens.** Matches the event-driven pipeline rule above |
| L4 | The shader reads the depth buffer, so blocks in front of the beam hide it | Layering matters. Effects can pass behind or in front of specific panels |
| L5 | The pull before the blast is gameplay, not visuals | Anticipation can be mechanical: the telegraph phase changes state (enemies flee, defenses rise) |
| L6 | Community forks added a 32-beam version, a sound add-on and photosensitivity warnings | Effects are easy to remix once timing is data. The warning becomes a standard feature |

**Lessons from The Shooting Star jar:**

| Code | Lesson | Our version |
|---|---|---|
| L7 | A film is a **shot list**: shots with start, end, blend and a path, plus a title card, priority and skip | The effect registry stores set pieces as shot lists; a text "shot" can be a log line, a panel zoom or a held silence |
| L8 | The **sound cue list is the script** | Write each set piece as 8 to 12 named beats first. The same beat list drives the log lines, the effects and the sounds, and the beats alone make the plain text version |
| L9 | **Stretch audio to the clock**, not the clock to the audio | Web Audio `playbackRate` or a stretched buffer keeps sound in sync when a film is shortened for repeats (X4) |
| L10 | **Explain the hardware gate kindly** and fall back | Detect WebGL support once; drop to CSS or text and say why in settings, never a blank screen |
| L11 | **The caster gets saved** (the evac beat) | The player's own big power never kills them by accident unless the world says so, and the film shows why they survived |

**What "generated" can mean here** (all compatible):

- **Procedural rendering:** shaders and curves draw it live (L2).
- **Composed from game state:** the film is assembled from real data, such
  as the constellation from your actual star chart, the target from the
  real map, and the reading from your real titles. Each cast differs and
  says something true.
- **Seeded:** the same seed replays the same film, for highlight reels and
  shared moments.

### More to consider (films)

- **Web stack options:** CSS and the Web Animations API for panel motion;
  one WebGL canvas for shader moments (a fragment shader in the style of
  Shadertoy); SVG for telegraph lines; Web Audio for timed sound. A
  library such as GSAP or PixiJS only if the hand-written version gets
  messy.
- **Compile on demand:** build a shader the first time its world needs
  it, as the mod does at launch, so idle play stays light.
- **Public-domain space imagery:** NASA images are mostly public domain;
  ESA and ESO images are CC BY 4.0 and need visible credit (credits
  screen). Fits SP1's starfield.
- **Shadertoy as a study library:** good for learning the techniques.
  Shaders there default to CC BY-NC-SA, so learn from them and write our
  own.
- **Port with credit:** Orbital Railgun is MIT, so its strike shape could
  be adapted to WebGL with attribution if a world wants that exact look.
- **Fallback chain:** shader version, then CSS version, then static
  summary line. Pick automatically from device capability and settings.

## Text-only VFX library (2026-10-10)

Weibao: "Cool text based representations for interesting stuff? from jjk's
Infinity, to adaptation, what other things deserve their own SFX?" Then:
"expand on each idea and consider new ideas too? consider flavorful ones,
and ones for show of power, like 4th wall breaking? Deeper sfx and more?"

**Terminology (Weibao, 2026-10-10):** "Also VFX, I think I said the wrong
one lmao." These are visual effects. Quotes keep his original wording.
Sound words (onomatopoeia, third wave) count as VFX here, because they
are drawn as text; real audio stays a separate, optional layer.

**Proposal only.** The tables above describe UI effects. This section is
the cheapest layer under them: effects made from characters, spacing and
typography alone, so they work in the log as it is today. The rarity
ladder (X2) and effect budget (X3) still apply; most lines stay plain.

### Rules for text effects

| Code | Rule | Why |
|---|---|---|
| TX1 | **The effect tells the truth** | The text shows real state: Infinity's dots are the actual remaining gap, adaptation's shrinking number is the actual reduced damage. If you can read the effect, you can read the mechanic |
| TX2 | **Plain line underneath** | Every effect wraps a plain sentence. Screen readers, copy-paste, the Notebook and effects-off mode all get the plain version (`aria-label` on the span) |
| TX3 | **A static form exists** | Reduced motion keeps the meaning without the animation: a struck vow is already static; Infinity's static form is the final `▸│ ∞` frame |
| TX4 | **Effects scale with the rung** | *Slightly* gets one mark; *absurdly* takes the whole line or panel (P4, E8F) |
| TX5 | **Effects can collide** | Two powers meeting is shown by one effect changing the other (see Collisions below). That is where the best moments come from |
| TX6 | **The world reskins the glyphs** | Same shape, different glyph set: brush strokes in a Hanzi world, box-drawing in a status-window world, runes in a grim one (P6) |

### The glyph toolkit

The primitives every effect below is built from. A small set means one
renderer can produce all of them.

| Primitive | Looks like | Carries |
|---|---|---|
| Spacing | `S L A S H`, `y   u` | Weight, emphasis, fading presence |
| Gap | `You raise your sword. [        ] It is dead.` | Missing time, skipped cause |
| Strike | ~~struck~~, `—cut` | Broken, refuted, ended |
| Offset | top half of a line shifted one column | Being cut, being moved |
| Shrink and grow | font size per word | Damage, fear, shouting |
| Case | `DEMON LORD` → `demon lord` | Status, dominance, diminishment |
| Redaction | `████` | Unknown, sealed, censored |
| Ghost | dim italic copy under or ahead of a line | Past loops, futures, echoes |
| Fine print | tiny line under a skill | Conditions, vows, contracts |
| Combining marks | `ḧ̷e̵a̸l̷` | Corruption, stacking curses |
| Mirror and reverse | `043+`, un-typing | Inversion, rewind |
| Frame | `╔═╗`, `⟦ ⟧`, `[ ]` | Spaces, barriers, systems |
| Typeface | a character's own font | Voices, possession, presence |
| Glyph swap | `☸`, `∞`, `†`, `ϟ` | Family motifs (clock, grid, flame, lens) |
| Tempo | typewriter speed, holds, cut-offs | Time, anticipation, interruption |

### Jujutsu Kaisen set

**Infinity.** The number travels and the gap halves every tick, so it
never arrives.

```
−340 ·········▸        │ you
−340       ····▸     │ you
−340          ··▸ │ you
−340            ▸│ you   ∞
```

- State: incoming damage held at the barrier. The dots are the remaining
  steps of the halving, capped so they stay readable.
- Rung: weak Infinity lets numbers get closer before stalling. A
  *partial* Infinity (tired, distracted) has one dot slip through: `−3`.
- Variants: many attackers stack frozen numbers in a column beside the
  bar, like a queue that never empties. When Infinity drops, they all land
  at once, which is a great "oh no" beat.
- Static form: the final frame.

**Adaptation (Mahoraga's wheel).** The wheel turns, and the same attack's
text shrinks every time it lands.

```
☸     SLASH  −340
☸·    slash  −170
☸··   slash  −12
☸···  slash   ∅        adapted
```

- State: the notch count is the adaptation stage, and the number is the
  real reduced damage. Case and size drop with it.
- Rung: a slow adapter needs more notches; *instantly* adapts after one.
- Variant: the wheel can turn on the player's side too, against an
  enemy's signature move. Your log shows the move shrinking, which teaches
  you the mechanic before you face an adapter.
- Counterplay readout: switching attack type resets the text to full
  size and caps. The player sees at once that variety works.

**Six Eyes.** Precision as a perception stat. Normal view: `~1.2k`,
`a strong curse`. Six Eyes view: `1,203.47`, `Grade 1, cursed energy
leaking from the left hand`. Illusions show as two overlapping strings
with the false one faded. The rung sets how many decimals you get.

**Black Flash.** A rare spike with its own one-frame grammar.

```
B L A C K   F L A S H      340^2.5 = 62,000
```

- One frame of inverted colors on that line only, with letters spread to
  full width.
- The exponent stays visible so the multiplier is legible (TX1).
- Escalation: during a Black Flash "zone" the next hit's text keeps a
  faint black edge, and chained flashes stack the edge darker.

**Cleave and Dismantle.** Cuts happen to the text. Dismantle slices the
line once:

```
The wall stan╱
             ds.
```

Cleave adjusts to the target's toughness, so a tougher target gets more
slices. The number of slices is the number of hits. Against Infinity the
slice line stops one character short.

**Hollow Purple.** Two colored glyphs meet in the middle of the log:

```
red ▸            ◂ blue
         ◆
████████████████████████  (purple)
```

Everything the beam passed through goes blank, older log lines included,
and stays blank for a while: a hole in the history. The plain line is
kept in the Notebook (TX2).

**Reverse cursed technique.** The damage number mirrors into a heal:
`−340` flips to `+043`, then counts up to `+340`. It is an inversion, so
the glyph flip comes before the heal.

**Binding vow.** Fine print under the skill row:

```
Cleave            ×3 damage
  vow: only after naming the technique aloud
```

Keeping the vow makes the print glow faintly. Breaking it strikes the vow
through in red, and the penalty is written underneath in the same small
size. Most vows are quiet, and you only notice them when they break.

**Cursed speech.** Commands render as heavy capitals, and the target's
text obeys literally. `DON'T MOVE.` and the enemy's line stops mid-word.
`BLAST AWAY.` and their name is pushed to the right edge of the panel.
Speech that is too strong for the user costs them: the user's own next
line comes out hoarse, small and broken.

**Domain expansion.** The panel's frame becomes the domain's.

```
╔══════════════════════════╗
║    the room ends here    ║
╚══════════════════════════╝
```

- Sure-hit: inside the frame, your attack lines skip the miss roll and
  lose their dodge text entirely.
- Each domain owns its border glyphs: shrine roof tiles, water, a
  courtroom railing, a starfield.
- Domain clash: two frames overlap and their border glyphs fight for each
  edge, with the stronger domain taking more of it.
- Simple domain: a small circle `◯` around your name that the sure-hit
  text can't cross.

**Boogie Woogie.** A clap `👏` and two words in the log swap places,
whether names, items or a target. Every clap could be a swap or a feint,
so the player reads the clap first and the outcome second.

**Ratio Technique.** A tick mark at 7:3 along the enemy's name:
`Grade One Curse` gets a `│` at 70 percent. A hit on the mark reads as a
critical. Fixed-point weakness as a visible glyph.

**Projection Sorcery.** The user's actions arrive as frames: `[1][2][3]…`
up to 24. The target's text freezes in a frame `▣` if it can't keep up.

**Idle Transfiguration.** Words in an enemy's description reshape letter
by letter into something else, and the stat panel follows.

**Ten Shadows.** Summons rise out of a `░▒▓` shadow under your name and
sink back into it. A destroyed shikigami's name is struck from the
roster for good.

**Heavenly Restriction (no cursed energy).** Your name is missing from
every sensing readout. Enemies' lines reach for you and find nothing, and
the panel listing presences skips your row.

### Time and causality

**Time stop.** The log freezes mid-word: `The arrow fl—`. While time is
stopped only your own lines print, in a distinct color, and they get no
timestamps. When it resumes, the word finishes and the frozen numbers all
land at once.

**Time skip (King Crimson).** A bracketed gap where the cause should be.

```
You raise your sword. [                ] The enemy is dead.
```

The gap length is the skipped time. Hovering it shows nothing at all, and
that is the point.

**Return by Death and regression.** The log un-types back to the anchor,
character by character, faster as it goes. The new loop prints over the
old one, with last loop's lines left as faint ghosts underneath. When
you choose differently, your new line and the old ghost visibly diverge.
NPCs who somehow remember get a thin outline on their lines.

**Prophecy.** Future lines appear ahead of time in dim italics. When one
comes true it turns solid in place. When fate is changed it is struck
through, and a mark stays in the margin. Unreliable seers' ghosts are
blurred.

**Causality reversal (Gáe Bolg type).** Effect first, cause second:

```
The enemy's heart is pierced.
You throw the spear.
```

The lines print in reversed order. Readers instantly know the hit was
never in doubt.

**Acceleration and slow.** Fast: lines arrive with motion trails,
`fffast`, and timestamps compress. Slow: each word arrives with a
visible delay and the timestamps stretch. Enemy text under a slow effect
types slowly while yours types normally.

**Loops (a stuck day).** The same morning line repeats each day, with
one word changed when the loop starts to bend.

### Perception and mind

**True names.** An unknown name is `████`. Learning it reveals letters
one by one, and knowing the full name gives power over it (worlds where
names bind). A Death Note style name is written in cursive with a
countdown beside it. Misspelled names don't take effect.

**Language comprehension.** Foreign script resolves into readable text
as the skill rises: glyphs, then `th? merch?nt l??s`, then the full line.
Partial understanding can mislead, which is a real cost of a low skill.

**Lie sense.** Lies take a faint tint visible only with the skill. Higher
rungs show which words are the lie, not just the sentence.

**Illusion.** One letter is subtly wrong (`Tbe guard`). Spotting it
cracks the line, and the letters fall into their true places. A master
illusion has no wrong letter, and only a sense power can break it.

**Telepathy.** Thoughts print in grey parentheses under what people say:
`"Welcome, friend." (he has a knife)`. Rung sets how much of the thought
you get.

**Charm.** Your lines about the charmer soften: their name turns warm,
and harsh verbs in your own text become gentler ones until you notice.
Breaking free reverts the words.

**Memory loss.** Words drop out of your own old log and Notebook. Getting
them back restores them in a slightly different color, so recovered
memories stay distinguishable from intact ones.

**Inner voices.** Skills and adjectives interject in their own typeface:
`INSTINCT: Run.` A loud voice gets bigger type. Two voices can disagree
on the same line.

**Sensing (Nen En, spiritual sense).** A radius around your name. Only
names inside it render. Things just outside are a pulse `·` without a
name.

**Sanity.** Words occasionally swap for wrong ones, timestamps drift, and
punctuation stays put while the letters walk away. Recovery marks each
wrong word it caught.

### Force and presence

**Conqueror's Haki and killing intent.** Weaker names tip over and drop
to the bottom of the panel. NPC dialogue stutters (`I-I…`). Background
chatter lines vanish. Someone who resists stays upright, and that line
tells you who matters.

**Gravity.** Letters sink below the baseline, lines compress and the log
scrolls down by itself. Reverse gravity pulls lines upward out of the
log.

**Fire.** Words burn from the edges: `▓▒░` to ash, then gone. A strong
flame leaves a scorch mark on the panel border.

**Ice.** Characters frost to `❄` from the edges in, and the line's
timestamp stops. Thawing restores them.

**Lightning.** The line splits at a `ϟ`, with both halves jolted.
Tribulation lightning counts as strikes across the top of the log.

**Poison and corruption stacks.** Combining marks creep across a word,
one mark per stack: `ḧ̷e̵a̸l̷t̴h`. At full corruption the stat name itself
is unreadable. The plain value stays readable in the tooltip (TX2).

**Blood magic.** Red drips `‚` under the caster's lines. Each drip is a
point of HP paid.

**Void and erasure.** Text drains toward a point and the space closes up
as if the words were never there. The Notebook keeps a scar: `[erased]`.

**Stealth.** Your name fades letter by letter: `you` to `y u` to `  `.
Being spotted snaps it back bold.

**Shadow clones.** Your line repeats, indented once per clone. A popped
clone's line is struck through, and its memories arrive as a short burst
of lines when it dispels.

**Barrier.** Brackets around the protected value crack:
`⟦HP 340⟧` → `⟦HP 340⟨` → `HP 340`.

**Gate of Babylon and Unlimited Blade Works.** The chant arrives one line
at a time with holds. Then weapon glyphs fill the panel, `⚔ † ⚔ † ⚔`,
and each glyph launched is one real attack.

**Necromancy.** Dead names get `†` and go grey. Raised names return in
the necromancer's color, with a word missing from their description.

### Status-window genre

**Acquisition boxes.** `[ Skill acquired: Swordsmanship Lv.1 ]` in a ding
box. Rarity sets the border: single, double, then animated.

**Level-up compression.** A hundred level-ups compress into
`[ Level up ] ×100` that counts up in place.

**Glitching system.** System messages lag, typo or censor themselves:
`[ ERR: this skill is ██████ ]`. A system that is a character gets
moods in its formatting: terse when annoyed, verbose when pleased.

**Hidden title reveal.** A title slot shows `[ ??? ]` for a long time,
then fills in.

**Unreadable stats.** See "Measurement breaks" below.

### Show of power

The effect describes how outclassed someone is, so these work best when
rare (X2, X4).

**Measurement breaks.** Your stats exceed the panel.

```
STR   9,999,999+
STR   ERROR
STR   [ unmeasurable ]
```

Enemies' appraisal of you returns `???`. A stronger appraiser gets one
step further before failing, so the failure rung is information.

**Deleted, not depleted.** The enemy's HP bar doesn't drain. The whole
bar is gone, frame included, and the next line is the result.

**Overkill tally.** Damage keeps counting after the enemy is dead, past
the edge of the panel, then cuts to the word `enough.`

**Number too long.** The damage number wraps, then switches to
scientific notation, then to a word (`countless`). Each switch is a
threshold the player learns to feel.

**The quiet one-hit.** A long anticipation line, then just:

```
Serious punch.

```

No number at all. The enemy panel is empty. One blank line, then the
log continues.

**Lowercase demotion.** When you outclass someone, their title loses its
capitals: `DEMON LORD Vezh` becomes `demon lord vezh` in your log only.
Other people's logs keep the capitals until word spreads.

**The room reacts.** Background lines stop: `everyone in the tavern
stops talking`, and the ambient chatter lines that were scrolling just
end. They resume one at a time.

**Bowing names.** Weaker names indent one step in the presence list, as
if bowing. Allies who respect you indent by choice; enemies are forced.

**Typeface takeover.** A sufficiently dominant presence makes nearby
lines print in its font, other people's included, for the length of the
scene.

**The world flinches.** World-scale feats get a line from far away:
`In a city you have never visited, the bells ring on their own.`

**The settings clamp.** A power too big for the player's effects slider
says so: `(effect reduced by your settings; it wanted to be bigger)`.
Respects P7 and still brags.

### Fourth-wall VFX

All of these stay inside the reach ladder (R0 to R6) and the safety
lines: nothing touches the save, nothing reads personal data, and
every effect is reversible and has a plain version.

**The hit reaches the UI.** A big enough strike chips the enemy panel's
border, cuts the log line above the attack, or knocks a panel a few
pixels off its grid until the fight ends.

**Tab title damage (M2, R4).** `YAIRPG` becomes `YA̶I̶RPG`, then mends.
A meta rival can write its name in the tab while you are away.

**The scrollbar flinches.** A heavy hit jolts the log's scroll position
by a line. A time-stop power freezes the scrollbar too.

**The cursor matters.** A shy entity's text slides away from the mouse
when you hover. A cursed item's tooltip refuses to open on the first
hover. Both stay within the page and never trap input.

**Text selection reveals.** Some lines carry faint text that only shows
when selected, as a discovery route for a hidden thing. Selecting is a
player action, so it never feels like the game reached out on its own.

**Copying carries a note (opt-in).** When the player copies a log line,
the copied text can include a small signature from a meta character.
Copying is the player's action; this is off unless meta effects are set
to full, and it never reads the clipboard.

**Console notes.** A meta character leaves a message in the browser's
developer console for players who open it. It doesn't affect play and
is a pure easter egg.

**Window size complaints.** Shrink the window and a cramped character
says so. Make it huge and a giant entity finally fits.

**Real-clock remarks (M3).** `It's 3 a.m. where you are. Sleep.` Reads
only the clock.

**Settings visitors.** A meta character appears inside the settings
panel, sitting on the effects slider or arguing with the meta toggle.

**The bottom of the log.** Scroll to the very bottom and there is
sometimes one line that wasn't there before.

**The god looks at the screen.** In [cosmic events](COSMIC_EVENTS.md):
everything stops, and one line addresses the player rather than the
character. Unique tier only.

### Flavor and cozy VFX

Small effects for ordinary life, so worlds feel lived in rather than
only loud.

| Moment | Text effect |
|---|---|
| Rain | `'` and `,` drift down the log's margin; heavier rain, denser marks |
| Seasons | A few leaves `❦` or snowflakes settle in the gutter for the first day of a season |
| Cooking | Steam `~` rises above a dish line, and better food gets more of it |
| Music, bards | Lines break on the beat; `♪` marks keep time; a bad performance stumbles out of rhythm |
| Drunk | Letters wobble; typos appear and correct themselves a beat later |
| Sleep | `z z z`, then the text dims until morning, then brightens |
| Love | The two names in a line drift a little closer each time they appear together |
| Letters | A received letter unfolds line by line, in the sender's handwriting style |
| Age | Elders' lines are sepia; a child's lines are small and quick |
| Whisper and shout | Small grey text versus large bold text, with no tag needed |
| Accent and dialect | A consistent spelling pattern per region, so you know where someone is from |
| Calligraphy (Hanzi world) | Characters draw in stroke order; a master writes in one continuous stroke |
| Radical composition | `木` + `木` becomes `林`, then `森`: words that combine as you learn them |
| Craft quality | A masterwork item's name gets a thin underline, a legendary one a double |
| Home | The home panel's frame grows with the house: a plain line, then a fence, then a garden |
| Grief | A lost person's name stays in the roster, lighter, and doesn't print in new lines |
| Pets | A small `ᓚᘏᗢ` sleeps at the end of the log on quiet days |

### Collisions

Where two effects meet, one changes the other (TX5). These are the
moments worth building towards.

| Collision | What the text does |
|---|---|
| Infinity vs. Adaptation | The wheel turns; the Zeno dots get fewer each notch; at full adaptation the number lands |
| Infinity vs. Domain sure-hit | The domain's frame strips the dots and the number goes straight to the bar |
| Six Eyes vs. Illusion | The false letter shows as faded from the start |
| Time stop vs. Time stop | Both users' lines print, everyone else's freeze, and the two colors alternate |
| Cursed speech vs. Silence | The capitals print, but empty: `D N ' T  M V E` with letters missing |
| Erasure vs. Prophecy | The struck future line is erased, leaving a gap where fate was |
| Haki vs. Haki | Two sets of names tip over in opposite directions; the stronger wave wins the middle |
| Regression vs. Memory loss | Ghosts from the last loop appear, but blurred, so you can't fully trust them |
| Barrier vs. Cleave | Each slice cracks one bracket; a strong barrier has extra brackets `⟦⟦ ⟧⟧` |
| Measurement breaks vs. Six Eyes | Six Eyes reads one more digit than anyone else before it also fails |

### Build notes (proposal)

- **One renderer.** Each effect is a span with `data-fx` (id, rung,
  params) and an `aria-label` holding the plain line. The renderer turns
  the toolkit primitives into DOM and CSS; gameplay only emits the event
  and the plain sentence.
- **Font caveat.** The UI uses Arial today (`style.css`), which is
  proportional. Spacing effects like Infinity's gap and the time-skip
  bracket need a monospace span or measured CSS margins. Box-drawing
  frames need a font that has those glyphs; verify on Windows and macOS.
- **Combining marks** render unevenly between browsers and can overlap
  neighboring lines. Cap the stack height and clip the span.
- **Emoji vary by platform** (`👏`, `❄`). A world style can swap them for
  plain glyphs.
- **Save safety.** Effects store nothing except optional cosmetic marks
  (scorch, kintsugi, a recovered-memory tint), which are flags on
  existing records.
- **Effect gallery.** Add each effect to the Proving Ground gallery with
  a rung slider and a "static form" toggle so they can be judged side by
  side.
- **Prototype order if wanted:** Infinity and Adaptation first (they also
  test the collision rule), then the time-skip gap, measurement breaks
  and Black Flash. Together these exercise spacing, size, case,
  redaction and frames, which covers most of the toolkit.

## Text VFX, second wave: deeper entries, new families, implementation (2026-10-10)

Weibao: "expanding on this and more? More ideas? Stuff to consider for
implementation and more?"

**Proposal only.** Extends the [text-only VFX library](#text-only-vfx-library-2026-10-10).
Implementation notes cite the current source where checked; anything not
checked is marked as such.

### More rules: when and how effects fire

| Code | Rule | In practice |
|---|---|---|
| TX7 | **Watched, or summarized** | Effects play only when the tab is visible and the line's log group is shown. Unwatched fights fold into one summary line: `∞ held 1,204 hits (412k) while you were away` |
| TX8 | **Repeats decay** | The first Infinity in a fight plays in full; the tenth is a single `∞` after the number; the hundredth is plain text. An escalation (bigger hit, new rung) resets the decay (X4) |
| TX9 | **One effect owns a line** | At most one line effect per line. When two apply, the collision table decides the combined result instead of stacking glyphs |
| TX10 | **A glyph means one thing** | `∅` nullified, `∞` held, `†` dead, `☸` adapting, `████` unknown. A Notebook glossary fills in the first time each glyph is seen |
| TX11 | **The source is visible** | Whoever causes an effect is identifiable by color or motif, so the player can tell a curse from a glitch from a meta character |
| TX12 | **Never move a click target** | Shakes, offsets and swaps never touch buttons the player is about to press. Panels drift only when no input is pending |
| TX13 | **The plain layer is what the character perceives** | Not the hidden truth. An illusion's plain line is the illusion; a sealed secret's plain line is the cover story. This keeps TX2 from leaking sealed secrets through screen readers, copy-paste or the Notebook |

### Deeper takes on the core entries

**Infinity, in full.**
- The math: the dot count is about `log2` of the remaining distance,
  capped near ten so a line never fills with dots. Halving is visible
  for the first few ticks, and then the line settles.
- What pierces it, each with its own visual: a domain's sure-hit (dots
  stripped), an adapter (dots shrink per notch), an attacker with no
  cursed energy (the number simply isn't stopped, because there's
  nothing for Infinity to see), and a stronger Infinity of your own (two
  gaps meeting, `▸│∞│◂`).
- The queue: held numbers stack beside the bar. When Infinity drops
  through fatigue or a technique ending, the queue resolves top to bottom
  in a fast cascade. Players learn to fear a long queue.
- Idle form: one rolling line per fight, `∞ ×38 held`, plus the TX7
  summary.

**Adaptation, in full.**
- One wheel per damage kind, so the wheel tooltip lists `slash ☸···
  fire ☸· cursed ☸`. Switching kinds is visibly the counterplay.
- Adaptation can persist across fights for some adapters, which is
  scarier: the notches are still there next time you meet.
- When the player adapts, their own log shows the move shrinking in
  enemy lines. Mahoraga then becomes a test of the mechanic the player
  has already been taught.

**Domain expansion, full lifecycle.**
1. **Chant:** the hand sign and the name arrive one line at a time with
   a hold before the name.
2. **Expansion:** the frame draws itself around the panel, corner first.
3. **Hold:** the sure-hit rule changes your lines (no dodge text) and
   the domain's border glyphs set the mood.
4. **Collapse:** the frame breaks at one corner and unravels.
5. **Burnout:** your technique row goes grey with a `≋` smoke mark and a
   countdown until it's usable again. A plain timer would hide that the
   cost is part of the fantasy.

**Measurement breaks, as information.** Appraisal fails in steps, and
the step where it fails is real data. A weak appraiser reads `???` at
once; a strong one gets the first digit and then `ERROR`. The failure
rung tells you how far above you the target sits, so a broken readout is
still useful.

**Regression ghosts, density.** Showing every past loop's ghosts would
bury the log. Show only the previous loop by default; a stronger
memory adjective shows two or three, layered fainter. Lines that never
changed across loops lose their ghosts entirely, and what stays ghosted
is what you changed.

**Prophecy, reliability.** A seer's ghosts carry a confidence look:
crisp for sure, blurred for likely, flickering for possible. When
something comes true, the ghost turns solid in place. A changed fate
stays struck through in the margin, as proof you changed it.

### New families

**Combat feel**

| Moment | Text effect |
|---|---|
| Parry | Two numbers meet and cancel into `clang`; a perfect parry adds a one-frame hold |
| Counter | The enemy's line bounces back reversed, ending in your damage |
| Dodge | Your name slides one character sideways in the line, then back |
| Armor | The number is chipped: `−3̶4̶0̶ 12` shows what armor took |
| Bleed | The number drips down into the next few lines as small red ticks |
| Stun | The enemy's line repeats `…` in place until it wears off |
| Berserk | Your lines go all caps with no punctuation; healing lines can't print |
| Last stand | Your HP number pulses like a heartbeat; everything except your lines desaturates |
| Tell | The enemy's line hesitates (`The ogre…`) before a big move. A readable tell gives an attentive player a window, while passive play still works |
| Execute threshold | The enemy's HP number turns hollow below the kill line |

**Crafting**

| Moment | Text effect |
|---|---|
| Forging | Hammer beats as a tempo line `·  ·  ·`; the item name forms out of the sparks on the last beat |
| Alchemy | Ingredient letters bubble and recombine into the product, anagram style |
| Enchanting | Rune glyphs orbit the item name, one per enchantment |
| Failure | The half-formed name cracks and falls into scrap words |
| Masterwork | One extra beat after the last, and the name stamps in |
| Repair | The kintsugi seam from the shattering section, at word scale |

**Magic systems**

| Moment | Text effect |
|---|---|
| Chanting | Words of the spell arrive one at a time; an interrupted chant leaves its half-words in the log, greyed |
| Counterspell | The enemy's spell text gets struck through from the end backward |
| Runic syntax | A spell built from glyph-words the player has learned, readable as a sentence |
| Summoning circle | An ASCII ring drawn around the summoner's name, closing before the summon arrives |
| Mana overflow | The mana number overflows its box and spills into the next line |
| Hex | One word in the target's description keeps cycling until the hex breaks |

**Cultivation**

| Moment | Text effect |
|---|---|
| Tribulation | Strikes counted across the top of the log; surviving each one stamps a mark |
| Qi deviation | The cultivator's text mirrors and flows the wrong way |
| Dao comprehension | A proverb line appears blurred and sharpens as insight rises |
| Closed-door seclusion | The log compresses time: `Year 3: still.` one line per year |
| Failed breakthrough | The new rung word stamps in, then cracks and falls back |
| Numbered forms | Sect techniques print with their form number `第三式`, as a catalog of power |

**Economy and social**

| Moment | Text effect |
|---|---|
| Haggling | The price wobbles between offers and settles where the deal lands |
| Reputation | Your name is misspelled in distant regions (`Weibo?`) until you're famous there |
| Rumor | A line copies itself into other NPCs' talk and mutates a word each time it spreads |
| Debt | Owed amounts print in red ink until paid; paying strikes them out |
| Seal | A contract ends with a stamped `印` that breaks visibly when the contract does |

**Horror and eldritch** (within the safety lines)

| Moment | Text effect |
|---|---|
| Something behind | A line appears between two existing log lines, where nothing was written |
| The unspeakable name | The name censors itself as it's typed |
| Counting | A number in the margin goes up by one each day with no label |
| Mirror world | The whole log flips horizontally while you're inside |
| Wrong NPC | A familiar person's lines come out in a slightly wrong font |

**Comedy**

| Moment | Text effect |
|---|---|
| Narrator's footnotes | `¹` markers with snarky footnotes at the bottom of the panel |
| Bleeped swearing | `f★★k` with the stars in the speaker's color |
| Slapstick | A word falls off the end of the line and has to be picked up (click) or it's gone |
| Polite all caps | An NPC who shouts everything kindly: `GOOD MORNING, DEAR FRIEND.` |
| Talking items | An item description argues with the tooltip |

**World scale**

| Moment | Text effect |
|---|---|
| Eclipse | The world's glyph palette swaps to its dark set for the duration |
| Festival | Confetti glyphs in the margins; NPC lines get exclamation marks |
| War | A casualty count ticks in the corner of background lines |
| Plague | Background chatter thins out, one voice at a time |

**Death and endings**

| Moment | Text effect |
|---|---|
| Last words | A character's final line prints in their own typeface and is pinned in the Notebook |
| Epitaph | A short inscription format on a grave panel: name, years, one line |
| A life summary | On death, the log scrolls once through that life's highlights, then stops |

### More fourth-wall ideas

| Idea | What happens | Reach |
|---|---|---|
| The log talks about the log | A character notices you scrolled back: `Reading old news?` | R1 to R3 |
| Loading tips | The tip line on load is written by a meta character, sometimes wrong on purpose | R3 |
| Offline report author | The "while you were away" summary is narrated by someone, biased by their mood | R3 |
| Rival achievements | A rival announces they got a milestone first | R3 |
| Title screen memory | The title screen changes after a big event and stays changed | R4 |
| Export filename | The suggested save filename includes a character's note | R5 |
| In-game help | A trickster edits the in-game help panel. It's reversible, and the real help is one click away | R3 |
| Pause | The game notices a long pause and someone says so on return | R4 (via M3, clock only) |

### More show-of-power ideas

- **The system apologizes.** `[ We're sorry. That value can't be displayed. ]`
- **Damage as a sentence.** The number is replaced by prose: `It was more than enough.`
- **Nameless end.** The enemy's last line prints without their name, as if they'd already been forgotten.
- **Time of death first.** A timestamp prints before the hit lands.
- **Far-away reports.** Background-group lines from other places report your feat as rumor for days after.
- **Flee before you act.** An enemy's line runs away before your turn even prints.
- **The quiet presence.** You enter, and the location's whole ambient line set changes tone.

### Effects that carry information

Some effects tell the player things: tells, illusion letters, measurement
steps, telegraphs, prophecy confidence. Those make attention rewarding.
For each one:
- **There's also a plain channel** (a tooltip or Notebook line), so
  reading glyphs is never the only route (P1, P7).
- **Passive play still resolves it.** A perception roll catches the
  illusion if the player doesn't. Spotting it yourself gives a small
  bonus (first strike, a better roll), never a gate.
- **No hidden truth in the plain layer** (TX13). An illusion's tooltip
  shows what the character sees until something reveals it.

### Implementation considerations

**How the log works today (checked in source):**
- `log_message(message_to_add, message_type)` at
  [display.js:767](../src/display.js) builds a div, picks a class and a
  group from `message_type`, substitutes `%HeroName%` and inserts the
  string as HTML via `insertAdjacentHTML` (`set_HTML`,
  [display.js:241](../src/display.js)).
- Each group has a line cap (combat 80, loot 28, unlocks and events
  40, background and crafting 28); the oldest line in the group is
  removed when the cap is exceeded.
- Groups are shown or hidden by the filter buttons and CSS variables.
- `do_dynamic_loot_message` replaces the previous loot line instead of
  appending, a pattern that also fits counters like `[ Level up ] ×100`.
- `game_options` ([main.js:1350](../src/main.js)) already holds
  `do_enemy_onhit_animations`, `do_background_animations` and
  `expo_threshold: 9` (when numbers switch to exponent form). It is
  saved as `save_data.options` ([main.js:4596](../src/main.js)) and
  loaded field by field.
- The UI font is Arial, which is proportional.
- No `aria-live` region was found on the log in `index.html`.

**What follows from that (proposals):**

1. **Structured calls, not markup in strings.** Add an optional third
   argument, `log_message(plain, type, {fx: 'infinity', amount: 340})`.
   The plain string stays the source of truth, so every existing call
   keeps working unchanged. Avoid a `{fx:...}` mini-language inside
   strings, because parsing HTML strings invites bugs.
2. **Escape what gets inserted.** `%HeroName%` currently goes into HTML
   unescaped. It's harmless for a solo player typing their own name, but
   effects that print names, rumors or NPC text should build DOM nodes
   or escape first.
3. **History effects live in records, not the DOM.** Group caps prune old
   lines, so a Hollow Purple hole or a memory-loss blank can't rely on
   old divs existing. Store the mark on the Notebook record and render
   it wherever the record shows.
4. **Respect hidden groups.** A line in a hidden group gets its static
   form, so when the player turns the filter on, nothing replays.
5. **Use the existing exponent threshold.** The "number too long" ladder
   (wrap, scientific, word) should start where `expo_threshold` already
   switches, so the two systems agree.
6. **Options are persistence.** New settings (effects level, meta level,
   reduced motion override) go in `game_options` with defaults applied
   when an old save lacks them. The field-by-field loader already
   tolerates missing fields; test an old export to confirm.

**Effect registry fields (proposal):** id, family motif, primitives
used, rung curve, plain template (TX13-safe), static form, budget cost,
decay curve (TX8), collision rules, world reskins, cooldown, and an
`informational` flag that requires a plain channel.

**Rendering:**
- A wrapper span per effect with `aria-label` set to the plain line and
  the decorative glyphs `aria-hidden`.
- Animate with the Web Animations API or CSS classes; per-character
  animation only on short lines, with a character cap.
- Stop and finish effects at once when `document.hidden` turns true.
  HackTimer keeps game timers running in the background, so effects
  must be time-based and skippable, never tied to game ticks.
- A cap on concurrently animated spans (around 10), with the rest
  rendered static.
- A monospace span class for spacing effects, and a glyph fallback
  table checked with `document.fonts.check` where supported. Box-drawing
  and `☸ ∞ ϟ ❦` need a font that has them on Windows and macOS (verify).
- Copy events can override the clipboard with the plain line, so copied
  logs read cleanly.

**Comfort and safety:**
- Black Flash's inversion stays under three flashes per second (the
  WCAG 2.3.1 flash threshold) and softens under reduced motion.
- `prefers-reduced-motion` maps to static forms by default; a game
  option can override it in either direction.
- Fourth-wall VFX follow the reach ladder and the meta setting. Nothing
  touches the save, the console note is passive, and the clipboard is
  only written on the player's own copy.

**Localization and scripts:**
- Case effects (lowercase demotion, cursed-speech capitals) don't exist
  in Chinese. Reskin them with weight, size or a seal mark.
- Combining marks stack badly on CJK glyphs; use a different corruption
  primitive there (ink bleed, missing strokes).
- Reversing and mirroring need care with right-to-left text and with
  emoji made of several code points; work on grapheme clusters
  (`Intl.Segmenter`), not raw characters.

**Testing:**
- Each effect renders its plain line, static form and full form in a
  unit test; the plain line is compared as text.
- Glitch and scramble effects take a seeded random source so tests are
  repeatable.
- The Proving Ground effect gallery is the visual check: a rung slider,
  a static-form toggle and a collision picker.
- Browser pass from a fresh origin with effects on, effects off and
  reduced motion, then save, reload and import an old save (AGENTS.md
  verification rule for the options change).

### A first playable slice (proposal)

1. `log_message` gains the optional `fx` argument and a tiny registry.
2. Three effects: Infinity (spacing, queue, decay), Adaptation (size,
   case, notches) and the time-skip gap (static, cheap).
3. Their collision: Adaptation closing Infinity's gap.
4. One option, `text_effects: full | reduced | off`, with an old-save
   default.
5. Gallery entries for all three.

Acceptance: playable in the Proving Ground from a fresh origin; effects
off shows identical plain lines; an old save imports with the new option
defaulted.

## Text VFX, third wave: onomatopoeia, grammar, time, bluffs and tooling (2026-10-10)

Weibao: "more to consider? Expanding on ideas?"

**Proposal only.** Angles the first two waves didn't cover: sound words,
grammar as an effect, idle-native decay, effects that lie, effects that
grow with skill, and the tooling to keep a big library sane.

### Onomatopoeia: sound words as VFX

Manga and manhwa already solved text VFX: the sound word *is* the
effect, drawn into the scene. A text game can borrow that wholesale.

| Code | Idea | Example |
|---|---|---|
| ON1 | **Menace** | `ゴゴゴゴ` stacked down the margin beside a character who is about to matter (the JoJo menacing look). Grows a column per rung |
| ON2 | **Impact words** | `BOOM`, `轰`, `쾅`, chosen by world. Size and weight scale with the hit, then the word cracks and fades |
| ON3 | **Quiet words** | `しーん` (dead silence), `...` drawn large, `tick tick` of a clock in an empty room |
| ON4 | **Motion words** | `ズバッ` for a fast slash, `whoosh` trailing off the panel edge |
| ON5 | **Body words** | `ドキドキ` (heartbeat) beside a nervous or smitten character; it speeds up as the scene does |
| ON6 | **World sound sets** | Each world has its own sound vocabulary: Japanese-flavored for a JJK-like world, Chinese for a cultivation world, English comic-book for a pulp world, wordless glyphs for an alien one |
| ON7 | **Sound that tells** | A heavy enemy's footsteps `thud . . thud` print before it arrives. The spacing is its speed |
| ON8 | **Silence breaks it** | Under a silence power, sound words print as empty outlines. Under deafness, they don't print at all, and the player loses that information honestly |

Actual audio stays optional and minimal: soft per-character text blips
(the Animal Crossing and Undertale approach), one low thud for SP2's
delayed impact, and nothing ambient by default. Sound words carry the
effect even with audio off.

### Grammar as an effect

The sentence itself can change, not just its look. This is the
cheapest effect there is, with no glyphs and no animation, and it reads
as deeply strange.

| Code | Effect | Example |
|---|---|---|
| PGR1 | **Pronoun loss** | Losing yourself to possession: `You draw the blade` becomes `It draws the blade`, then `We draw the blade` |
| PGR2 | **Tense as time** | Prophecy prints in future tense, memories in past, a time loop in present continuous that never ends: `You are walking to the market. You are walking to the market.` |
| PGR3 | **Person shift** | A cutscene from the enemy's side switches the log to first person in their voice for a few lines |
| PGR4 | **Register** | A noble's presence makes your own lines formal; a drinking hall makes them sloppy |
| PGR5 | **Language decay** | A curse of forgetting strips grammar first: articles go, then verbs, then only nouns remain: `sword. door. blood.` |
| PGR6 | **Passive voice of fate** | Under a fate power, your lines go passive: `The door is opened.` You aren't the one doing things anymore |
| PGR7 | **Commands obeyed** | Cursed speech can force the target's next line into the imperative's grammar: `DON'T MOVE.` / `The curse does not move.` |
| PGR8 | **The diary world** | A whole world whose log is your character's first-person diary, written in the evening. Combat reads as remembered, with the hindsight bias a diary has |

### Emotion

| Feeling | Text effect |
|---|---|
| Fear | Lines get shorter; punctuation tightens to periods |
| Joy | Lines loosen, exclamation marks appear, a small bounce on key words |
| Anger | The angry character's lines get a red underline that trembles |
| Shock | The line is just `…`, then the content a beat later |
| Embarrassment | The character's name blushes (a warm tint) for a few lines |
| Grief | The lost person's name, when mentioned, prints lighter and is followed by a pause |
| Calm mastery | The most dangerous person in the scene prints in plain lowercase with no effects at all. Their calm is the effect |

The last one deserves its own design note: **the effectless one.** An
entity so far beyond the scale that nothing they do triggers an effect.
No numbers, no frames, no sound words. Things simply happen in plain
text. After hours of flashy effects, that flatness is terrifying (X7).

### Idle-native decay: time passing on the screen

An idle game is left alone for hours. The UI can show neglect and care
the way a real place does.

| Code | Effect | Rule |
|---|---|---|
| ID1 | **Dust** | An unused skill row gathers `.` `:` `∴` over days. Using it blows the dust off in a puff |
| ID2 | **Cobwebs** | A location not visited in a long while gets a corner web `╱╲` on its button |
| ID3 | **Rust** | Unused gear's name gains a brown tint, and a maintenance action clears it (cosmetic unless the world says rust is real) |
| ID4 | **Overgrowth** | A home left alone grows leaf glyphs over its panel corners. Gardening clears them, or you keep them because you like them |
| ID5 | **Yellowed pages** | Old Notebook entries sepia over real days |
| ID6 | **Waiting characters** | A companion's idle lines change with how long you were gone: a short absence gets `Back already?`, a week gets `I kept your seat.` |
| ID7 | **Fast-forward return** | On return, the log runs a quick fast-forward with lines blurring past, then stops on the plain summary (P5 highlight reel, text form) |
| ID8 | **Seasons on panels** | The frame style shifts with the world's season, not the real one, unless the world uses real time (M3) |

All of this is cosmetic by default and stored as small age stamps the
game already has (last used, last visited), so no new save data is
needed beyond what those records hold.

### Effects that lie: bluffs and counterfeits

Once players learn the glyph vocabulary (TX10), the vocabulary can be
used against them, by characters inside the fiction.

| Code | Bluff | How it's caught |
|---|---|---|
| BL1 | **Fake untouchability** | An enemy fakes the "attacks never land" look with a barrier illusion; the dots move wrong (even spacing, no halving) to an attentive eye or a sense power. Faking Infinity by name is unlikely (see bluff plausibility) |
| BL2 | **Fake domain** | A frame with the wrong border glyphs: it looks like a domain, but the sure-hit lines still show dodge text |
| BL3 | **Fake measurement break** | A weakling hides behind a forged `???`. A strong appraiser sees the forgery marker |
| BL4 | **Playing dead** | The `†` is printed, but the name's color didn't drain |
| BL5 | **Your own bluffs** | The player can learn deception techniques that print fake effects to enemies. Their reactions show in their lines |
| BL6 | **Counterfeit system messages** | In a status-window world, a rival forges a `[ Quest complete ]` box with a single wrong character in the frame |

Rule: a bluff always has a tell that's consistent with TX1, so the
truth is in the text for anyone who looks closely. TX13 holds too: the
plain layer shows what the character believes until they see through
it. Bluffs are in-world deceptions, never the game lying to the player
about real state outside the fiction.

### Where bluffs come in (2026-10-10)

Weibao: "I like the ideas, but Idk where bluffs could come in and more?"

Bluffs aren't a feature of their own. They fall out of one engine idea
that several systems need anyway: **what an observer sees is separate
from what is true.** TX13 already requires it (the plain layer is what
the character perceives). Appraisal, Six Eyes, disguises and illusions
need it too. Once that layer exists, a bluff is just someone setting
what others see, and a perception check is someone looking past it.

**Prerequisite:** the perceived-versus-true layer (an observer's view of
an entity's power, identity, health and intent). Bluffs come after it,
not before. Without it they'd be scripted one-offs.

#### Places bluffs fit

| Code | Where | Who bluffs | What it looks like | Why it's fun |
|---|---|---|---|---|
| BF1 | **Hiding your strength** | You | Your appraisal shows a modest rung to everyone; your VFX stay small on purpose | The classic cultivation "pig eating the tiger" fantasy. Strong sects and fated villains ignore you, which keeps your disturbance low, so worlds stay on their natural course longer ([timelines](TIMELINES_AND_DIVERGENCE.md)). The reveal is a set piece |
| BF2 | **Inflating your strength** | You | A fake measurement break or a borrowed aura (BL3 in reverse) | Scare off fights you don't want. In an idle game that means fewer interruptions and safer travel, a real time payoff |
| BF3 | **Weak enemies posing as strong** | Bandit chiefs, false prophets, frauds | A forged `???` or a fake domain frame | Calling the bluff is a cheap win and a story beat: the town has feared a fraud for years |
| BF4 | **Strong enemies posing as weak** | Masters in disguise, sleeper agents, hidden-strength rivals | Plain text, small numbers, nothing special | The danger you didn't see. Pairs with the effectless one: the most dangerous NPC is the one with no VFX at all |
| BF5 | **Merchants and haggling** | Traders | `Final offer.` with a tell (the price wobble doesn't settle) | Bluff detection pays off in money. Fits the economy family |
| BF6 | **Gambling** | Dealers, gamblers, a luck god | Cards, dice and mahjong with tells in other players' lines | Life-sim minigames ([north star](LIFE_SIM_NORTH_STAR.md)) already list cards and dice. Bluffing is the point of the genre |
| BF7 | **Playing dead and ambush** | Beasts, assassins, mimics | `†` printed but the color didn't drain (BL4) | Teaches the player to read color, not just glyphs |
| BF8 | **Forgeries** | Courtiers, spies, a hacker in a status world | Fake seals `印`, fake decrees, fake `[ Quest complete ]` boxes (BL6) | Intrigue without combat. The wrong character in the frame is the tell |
| BF9 | **Disguises and identities** | You or rivals | A name and portrait line that's someone else's | Already scoped in [rivals and identities](RIVALS_IDENTITIES_AND_FATE.md#concealed-power-and-dangerous-methods) (disguise, impersonation, concealed power). Bluff VFX are how those show on screen |
| BF10 | **Combat feints** | Duelists, you | A false tell: the hesitation `The ogre…` that leads to nothing, then the real attack | Turns the tell system (second wave) into a mind game at higher rungs |
| BF11 | **Technique disclosure** | Sorcerers | Explaining your technique aloud to strengthen it, with a lie mixed in | JJK has disclosure as a real power boost. A world can decide whether a false disclosure still counts, or backfires |
| BF12 | **Counterfeit money** | Swindlers | Coins with one wrong glyph in the counter | A small, funny economy hazard |

#### How it plays

- **A contest, scored by adjectives.** Deception rung against perception
  rung, plus situation (lighting, distance, a sense power, prior
  knowledge). No new stat needed if the world already has perception and
  a deception-flavored skill.
- **Three outcomes.** Fooled (you see the fake), suspicious (the tell is
  highlighted faintly, and you can act on the hunch), or seen through (the
  fake cracks, the true value shows). Suspicion is the interesting
  middle: the player decides.
- **Attentive play gets a bonus, passive play still resolves.** The
  check rolls on its own (P1). Spotting the tell yourself before the roll
  adds a bonus.
- **Being fooled is never a disaster without warning.** It costs coin, a
  lost fight you could flee, an enemy that escapes. The Notebook later
  records `You were fooled by the bandit chief's ???` with the tell
  highlighted, so you learn it.
- **Frequency is a per-world adjective,** never a fixed limit: a
  trickster's court is full of bluffs, an honest farming village has
  almost none.
- **Your bluffs have stakes.** Hiding strength means you can't use your
  big techniques in public without breaking the cover. Inflating
  strength works until someone calls it. Each reveal is a choice.

#### When to build it

1. The perceived layer for appraisal only (observer, target, shown
   rung). This is useful by itself for measurement breaks and Six Eyes.
2. One player bluff, hiding strength (BF1), because it ties into
   timelines and has a big reveal.
3. One enemy bluff, the fraud bandit chief (BF3), as the teaching case.
4. Everything else as worlds call for it.

### Bluffing specific abilities (2026-10-10)

> **Scoped down (Weibao, 2026-10-10):** enemies don't keep dossiers or logs
> by default. See [enemy knowledge stays in the fiction](#enemy-knowledge-stays-in-the-fiction-2026-10-10).

Weibao: "I was just curious about bluffing specific unknown abilities but
bluffing in general is a good idea."

The narrower question: faking, hiding or misrepresenting a particular
ability, like a fake domain or a technique that looks like a different
one. This is the information war of JJK and Hunter x Hunter fights,
where knowing the other side's technique is half the battle. It needs
one more layer than general bluffs: **what each observer believes about
each ability.**

#### Knowledge states

Every observer holds a belief about each ability of a subject they care
about. The belief can be wrong, which is where bluffs live.

| Code | State | What the enemy panel shows | What the observer can do |
|---|---|---|---|
| KN0 | **Unknown** | `[ ? ]` slot, or no slot at all if they don't suspect anything | Nothing specific; generic caution |
| KN1 | **Effect seen** | `[ fast? ]`, `[ something stops attacks ]` | Guess; react to the last thing seen |
| KN2 | **Hypothesis** | `[ teleport? · speed? ]` with confidence marks | Test the guesses (probe) |
| KN3 | **Identified** | `[ Infinity (likely) ]` | Prepare a general counter |
| KN4 | **Rules known** | `[ Infinity: stops what approaches ✓ ]` | Exploit the rules |
| KN5 | **Weakness known** | `[ Infinity: sure-hit pierces ✓ ]` | Bring the specific counter |

The same ladder runs both ways. Your Notebook keeps an **ability dossier**
on rivals and named enemies, and they keep one on you. A sense power, a
spy or a captured notebook can show you *their* dossier on you:
`They think you're a fire user.` That's when bluffing gets interesting.

#### Kinds of ability bluffs

| Code | Bluff | Example | The tell (TX1: always present) |
|---|---|---|---|
| AB1 | **Fake ability** | You fake a domain with a frame illusion, or fake a common barrier class you don't have. (Faking a famous unique like Infinity is rare; see bluff plausibility) | The fake can't imitate every rule: a fake domain's lines still show dodge text; a fake barrier never cracks |
| AB2 | **Misattribution** | Your speed technique is staged to look like teleporting, so they prepare for the wrong counter | Teleport leaves no motion trail; yours does, faintly |
| AB3 | **Hidden trump card** | An ability never shown until the moment it decides the fight | None until it's used, which is why its first use is a set piece. Afterwards it's KN1 for every witness |
| AB4 | **Hidden condition** | The effect is shown, the condition isn't (a vow, a range, a time limit) | Patterns over many fights: it only happens at night, or only after you name it |
| AB5 | **False limit** | You fake a cooldown, fatigue or a range edge to bait an attack into a trap | The faked fatigue line has steady punctuation (fear shortens lines; yours didn't) |
| AB6 | **False weakness** | You let them "discover" a counter that doesn't work | The weakness was learned too easily; a careful enemy distrusts a KN5 that cost nothing |
| AB7 | **Partial disclosure** | In a disclosure world, explaining your technique aloud strengthens it, so you tell the truth with one omission | The omission is visible as a gap in the disclosure text, for anyone with lie sense |
| AB8 | **Borrowed effect** | An item, ally or summon produces an effect that looks like yours | The source color is wrong (TX11) |
| AB9 | **Reputation bluff** | Rumors already claim you can stop time (second-wave rumors). You never correct them | The rumor has no witness behind it; the Notebook trace dead-ends |
| AB10 | **Copied VFX** | A copy ability reproduces your look without your rules | Same frame, different border glyph in one corner |

#### Calling an ability bluff

- **Probe.** A cheap test action: a thrown stone at the Infinity user, a
  feint to see if they flinch, a question to see if they lie. Probes
  cost a little time or risk and move a belief up the ladder.
- **Watch repeats.** Every use of an ability gives witnesses evidence.
  Many uses slowly reveal the rules, so a technique used often loses its
  mystery (JJK's sorcerers worry about exactly this).
- **Compare with rules.** If the world has published rules (a known
  technique catalog, a sect's numbered forms), anything that breaks them
  is suspicious.
- **Sense powers shortcut it.** Six Eyes, appraisal or soul sight can
  jump straight to KN3 or KN4, but a strong bluff can still hold against
  a weak sense.

Enemy AI probes too. A smart rival throws something cheap at you before
committing to a plan, and its log line says so: `The rival tosses a coin
at you, watching.` That line is itself a tell that they're studying you.

#### Information as a resource

- **Every reveal costs future surprise.** The more witnesses see a
  technique, the more enemies who've heard of it prepare for it. A
  `seen before` adjective on an enemy reduces your technique's surprise
  bonus, a human version of adaptation.
- **Witnesses matter.** Using a trump card with no survivors keeps it
  secret. Using it in a crowd spreads it as rumor, distorted.
- **Bluffs reset or poison dossiers.** A good misattribution doesn't just
  win one fight; it plants a wrong KN3 that spreads to their allies.
- **Factions share intel.** Generic enemies use their faction's dossier
  (the sect knows your techniques collectively), so bluffing one sect
  member can mislead the whole sect.

#### Ability forensics

The same layer works after the fact. Abilities leave residue in
locations and on bodies, drawn as VFX:
- Clean diagonal cuts with no blade marks (`╱` scarring on the location
  line) point to one kind of slashing technique; ragged cuts point to
  another.
- A patch where rain never landed, or footprints that stop mid-stride.
- Residue fades with time, so investigating fast matters.

That opens a detective loop: a mysterious killer, a scene full of residue,
a dossier of hypotheses, and suspects whose abilities you probe. A
killer who knows forensics can stage false residue (AB2 at a crime
scene).

#### Where it fits best

- **Rivals and nemeses.** Long-running dossiers both ways, with each
  meeting updating them ([rivals](RIVALS_IDENTITIES_AND_FATE.md#a-persistent-rivalry-system-for-this-game)).
- **Tournaments.** Scouting between rounds, opponents who studied your
  earlier fights, hiding your best technique until the final.
- **Assassinations and duels.** One fight, high stakes, where a single
  correct read decides it.
- **Investigations.** Ability forensics.
- **Your own unknown abilities.** When the player has an ability they
  don't understand yet, their own dossier on themselves starts at KN1
  and climbs by experiment. (Sealed abilities stay sealed; only the
  route is visible.)

#### Implementation considerations

- **Records.** `belief(observer, subject, ability_slot) = {state,
  believed_ability, confidence, evidence[]}`. `believed_ability` can
  differ from the true one; that's the whole bluff.
- **Scope.** Keep full beliefs for rivals, named enemies and factions
  only. Ordinary enemies read the faction's record. That keeps save size
  small.
- **Sealed secrets.** True ability ids live in data. The UI and the
  plain layer show beliefs only (TX13), so dossiers can't leak a sealed
  truth through tooltips or copy-paste.
- **Tells as rules.** Each ability lists its observable rules (never
  dodges, halving dots, motion trail). A fake declares which rules it
  can imitate; the ones it can't are its tells. That makes tells
  generated, not hand-written per bluff.
- **Persistence.** Beliefs are new save data and need a migration with
  an empty default (AGENTS.md safety).
- **First slice if wanted:** one rival, a Notebook dossier both ways,
  the probe action, and one misattribution (AB2, speed staged as teleport) with its
  motion-trail tell.

### Bluff plausibility (2026-10-10)

Weibao: "I feel like it is really unlikely for there to be fake infinity
users since knowledge of such techniques is rare and also the only
character with something like that is gojo from JJK, right?"

**Mostly right, and it sharpens the design.** From memory of the manga
(verify chapters before using as a direct adaptation rule): Limitless is
the Gojo clan's inherited technique, and the Six Eyes paired with it is
very rare. Gojo is the only active user for nearly the whole story. The
lore mentions an Edo-era Gojo head with both, who died in a duel with a
Zenin head, and late in the manga Yuta uses Limitless through Gojo's
body. That's still effectively one famous person, so a random enemy
faking Infinity makes little sense. The earlier BL1 and AB1 examples are
now reworded.

The general rule that falls out: **a bluff has to be believable to the
person watching it**, and that depends on what they know.

#### Rule: you can only be fooled into an ability you've heard of

An observer's guesses (KN2 to KN3) come from the abilities they know
exist. A bandit who has never heard of Limitless can't conclude "that's
Infinity". At most they see `[ attacks stop ]` (KN1). So:
- Against ignorant observers, a bluff only has to fake the **effect**.
  Calling it a specific technique adds nothing.
- Against informed observers, a bluff has to fake the **rules** too,
  and every rule it can't imitate is a tell.
- Each observer's prior is their known-ability list: what their faction,
  clan, school or world teaches. Technique knowledge becomes world data
  (who has heard of what), which the dossier system reads.

#### Rarity and fame decide what's worth faking

| Kind of ability | Example | Faking it | Misattributing to it | Hiding it |
|---|---|---|---|---|
| **Common, well understood** | Basic barriers, reinforcement, a grade of strength | Easy to claim, hard to sustain: everyone knows the tells | Easy: "just reinforcement" covers a lot | Easy, since nobody looks twice |
| **Rare but famous** | A domain expansion, a legendary clan technique | Works on outsiders who know only the legend. Insiders, the clan and experts see through it fast | Risky: people who know the legend expect its rules | Very valuable: the trump card |
| **Rare and obscure** | A niche technique from a dead school | Pointless, since no one would recognize it | Easy to hide behind ("it's an old family thing") | Default state |
| **Unique, tied to a person** | Limitless with Six Eyes, Gojo himself | Not an ability bluff. It's impersonating a person, which is an identity bluff with identity-level consequences | Almost impossible | Only by hiding the person |

So the plausible bluffs in a JJK-like world look like:
- **Faking a domain** to make an enemy panic or burn their own domain
  early. Domains are famous among sorcerers and rare enough that most
  have never fought one.
- **Faking a grade.** Concealing or inflating cursed energy, which the
  setting already treats as readable.
- **Claiming a clan.** "I'm a Zenin" carries an assumed technique
  menu with it. Big payoff, and the clan may hear about it.
- **Hiding a technique entirely** and fighting with basics until the
  reveal.
- **Body and identity disguise,** which the setting does do (from
  memory: Kenjaku in another sorcerer's body). That's an identity
  bluff, scoped in [rivals and identities](RIVALS_IDENTITIES_AND_FATE.md#identity-theft-and-replacement).

#### Untouchability is a family, Infinity is a signature

Many settings have some version of "attacks don't reach me" with
different mechanics. From memory: vector reflection (Accelerator in *A
Certain Magical Index*), AT Fields (*Evangelion*), Logia intangibility
(*One Piece*), and countless barrier spells. They share a **family
VFX** (attacks stall or slide off), and each has its own signature look
on top. Infinity's halving dots are the Gojo signature. A barrier user
gets a bracket; a reflector gets a bounce; intangibility gets the hit
passing through and appearing behind.

That keeps the family readable across worlds (the shared-signatures
rule) and means a bluff fakes the family look, which is plausible,
rather than a famous signature, which isn't.

#### Where faking a famous signature does make sense

Rare, deliberate cases, each a story rather than a common encounter:
- **A heir's pretender.** Someone claims to be a hidden Gojo-like heir.
  The clan and the experts become the danger, not the enemy in front.
- **A legend with no witnesses alive.** If the last famous user died
  centuries ago, nobody knows the real rules, and a convincing fake can
  start a cult.
- **Copy and mimicry powers.** Abilities that reproduce looks (AB10).
  The copy is real VFX without the real rules.
- **The player, deliberately.** A player who chose an illusion or
  deception build can attempt a famous fake. It's high risk, a story
  hook and a per-world option, never something enemies do routinely.

#### What this adds to implementation

- **Known-ability lists per faction and region.** Data on which
  techniques a group has heard of and how much of their rules they know.
  It defaults to the world's public knowledge.
- **Plausibility check before an AI bluffs.** An enemy only attempts a
  bluff its targets could believe and that it can survive being caught
  in. That keeps fake-Infinity bandits out.
- **Identity bluffs route elsewhere.** Faking a unique ability hands off
  to the identity system, with its consequence scales (temporary
  disguise, institutional usurpation, body replacement).

### Knowledge and perception, expanded (2026-10-10)

> **Scoped down (Weibao, 2026-10-10):** enemies don't keep dossiers or logs
> by default. See [enemy knowledge stays in the fiction](#enemy-knowledge-stays-in-the-fiction-2026-10-10).

Weibao: "more to consider? expanding on ideas?"

**Proposal only.** The belief layer from the bluff sections turns out to
reach much further than bluffing. Seven directions it opens.

#### VP: the viewpoint filters the VFX

The biggest consequence: **how an effect renders depends on who is
perceiving it.** The log is told from a viewpoint, and the viewpoint's
knowledge sets the effect's fidelity.

| Code | Viewer | How Infinity renders |
|---|---|---|
| VP1 | Ignorant villager | `The arrows just… stopped. In the air.` No dots, no `∞`, only plain wonder |
| VP2 | Trained fighter | `Something stops every blow short of him.` A faint stall effect |
| VP3 | Sorcerer who knows the legend | The halving dots, with `[ Infinity? ]` in their dossier |
| VP4 | Six Eyes or an expert | The full effect with rule annotations: `stops what approaches; sure-hit pierces` |

Rules:
- The player's view is their character's knowledge. Learning more about
  a technique literally upgrades how it looks, and that's a reward you
  can see.
- Cutscenes from an NPC's view (PGR3) render with *their* knowledge, so
  the same fight can be shown twice, once with full effects and once
  through a terrified bystander.
- This is TX13 extended from text to the whole effect: the effect shows
  what the viewer perceives.
- Effects-off and screen-reader output follow the same viewer, so they
  never reveal more than the character knows.

#### Misreads by honest people

Not every wrong belief is a bluff. People interpret strange things
through what they already believe.
- **Culture.** A priest calls your ability a miracle, a scholar calls it
  a spatial technique, a villager calls it a curse. Each group's log lines
  use their word for it.
- **Religion around an effect.** A visible, unexplained ability repeated
  in one place can start a shrine or a cult: offerings, pilgrims, and
  a congregation that's upset when the truth comes out.
- **Superstition as a counter.** Villagers hang charms against you.
  Useless, unless the world decides belief has power.
- **Mistaken identity.** Someone with a similar look gets blamed for your
  feats, or credited with them.
- **Your own misreads.** Your character can be wrong about an enemy, and
  the dossier shows it: a confident KN3 that later gets struck through.

#### Information as goods

Ability knowledge can be bought, sold, stolen and forged.

| Code | Idea | Detail |
|---|---|---|
| IN1 | **Information brokers** | Sell dossiers on rivals and buy what you've seen. Prices scale with rarity and freshness |
| IN2 | **Scouting reports** | Tournaments sell reports on the next opponent, with the report's own confidence and possible errors |
| IN3 | **Archives** | Sect libraries and clan records hold technique rules. Getting access is a quest, a favor or a theft |
| IN4 | **Leaks** | An ally who talks, a stolen notebook, a witness who sells their story. Your secrets have a leak rate |
| IN5 | **Planted intel** | Counterintelligence: sell a broker false information on purpose, and watch it spread into enemy dossiers |
| IN6 | **Forged manuals** | The cultivation classic: a fake or sabotaged technique manual. Training from it causes deviation (the mirrored-text VFX). The tell is an inconsistency an expert can spot |
| IN7 | **Secrecy as protection** | Clan techniques stay secret partly so no one can learn or counter them. Knowing the full rules can be a prerequisite to copying a technique, so secrecy has real stakes |

#### Understanding your own technique

The KN ladder applies to yourself, and climbing it is progression.
- **Interpretation.** JJK treats deeper understanding of a technique as a
  way to extend it. Each new understood rule unlocks a new application:
  the technique row gains a line, `new: reversed output`.
- **Stated limits.** Hunter x Hunter's Nen gets stronger with
  self-imposed limits. Writing down a limit is a VFX moment of its own
  (fine print, the binding vow look).
- **Experiments.** Abilities you don't understand yet start at KN1 for
  you too. Tests in safe places (the Proving Ground, a training field)
  climb the ladder. A failed experiment teaches a rule the hard way.
- **Mastery's look.** Pairs with "effects that grow with skill": the
  visual sharpens as you understand more, not just as you level up.

#### Reveal choreography

When someone's belief changes, show it happening.
- **Their realization.** The `[ ? ]` slot on the enemy's dossier fills
  in letter by letter at the moment they understand. Their next line
  stutters.
- **Mid-fight explanations.** JJK characters explain techniques in the
  middle of fights, and in disclosure worlds that's a real power-up.
  The disclosure prints as a framed block, and the power-up stamps in
  right after.
- **The trump card.** A hidden ability's first use gets the full set
  piece (X4). Every witness's dossier updates on screen, which shows
  that you've just paid for it in secrecy.
- **Wrong guesses struck out.** When a misattribution is exposed, the
  wrong KN3 on their dossier gets struck through and replaced. That's
  satisfying from either side.

#### The regressor's bluff

Regression and time-loop stories have a bluff built in: **hiding that
you know the future.**
- You know enemies' techniques before they've shown them, so your
  dossiers on them start high. Using that knowledge openly is a tell.
- NPCs notice: `How did you know he'd go left?` Suspicion builds as
  an adjective on their relationship with you.
- Hiding it means sometimes acting dumb on purpose: walking into the
  feint you saw coming, so nobody suspects.
- Getting caught can be a story turn: an ally who figures it out, or an
  enemy who realizes you're a regressor and starts hunting for the
  anchor.
- Ties to [timelines](TIMELINES_AND_DIVERGENCE.md): your knowledge
  decays as the timeline diverges, so the further you push it off
  course, the less your future knowledge is worth. Dossier entries
  from the old timeline get a faded `(old loop)` mark.

#### Per-world readability dial

How common reading means are is a world adjective. What any one character knows still depends on the means they hold (see [knowledge works both ways](#knowledge-works-both-ways-2026-10-10)).

| World | Readability | What follows |
|---|---|---|
| Status-window world | Very high: appraisal is everywhere | Bluffs are hard. Concealment skills are valuable, and forging status displays is a crime |
| JJK-like world | Medium: sorcerers read cursed energy, techniques stay secret | Grade bluffs and hidden techniques both work |
| Cultivation world | Medium-low: realms are sensed, techniques are sect secrets | Hiding your realm is a whole genre; forged manuals exist |
| Grim low-fantasy | Low: magic is rare and feared | Almost everything is a misread; bluffs are easy and dangerous |
| Detective world | Varies: forensics is the main skill | Residue and testimony replace appraisal |

#### More implementation considerations

- **Templates per knowledge level.** Each ability's log text has
  variants per viewer level (VP1 to VP4). A missing variant falls back
  to the nearest lower one, so authoring can start with just two.
- **Viewer is part of the render call.** `render(event, viewer)`, not
  `render(event)`. The default viewer is the player character.
- **Leak test.** A test renders every ability at every viewer level and
  checks that lower levels never contain the names or rules of higher
  ones. The same test guards sealed secrets.
- **Knowledge data is shared.** Faction priors, archives, brokers and
  dossiers all read and write the same belief records; one system, not
  five.
- **Performance.** Belief lookups happen per rendered line. Cache the
  player's own beliefs; compute NPC viewpoints only for cutscenes.
- **Persistence.** Beliefs, leaks, planted intel and cults are all save
  data. They come in one migration with empty defaults when this ships.
- **Fairness.** The player is never denied information their character
  should have, and anything hidden from the character has an in-world
  route to learn it (P1).

### Enemy knowledge stays in the fiction (2026-10-10)

Weibao: "We might be overthinking enemy observation and logs, its not
like enemies would have access to stuff like those.... unless they do?"

**Direction (Weibao).** The dossiers, KN ladders and logs in the
sections above are the **player's** tools, because the player has a
Notebook and a UI. Ordinary enemies don't. They know what a person in
their position would know: what they saw, what they were told, and what
their group already believes. Anything more needs an in-world reason.

#### The default: simple, in-fiction memory

An ordinary NPC or enemy holds at most a few plain facts about you,
the kind a person remembers:

| Code | Fact | Example |
|---|---|---|
| EK1 | **Unaware** | Never heard of you. The default |
| EK2 | **Heard of you** | A rumor, maybe distorted: `the one who stops arrows` |
| EK3 | **Saw you fight** | One remembered impression: `fast`, `fire`, `can't be touched` |
| EK4 | **Lost to you** | Fear, grudge or respect, and a reason to prepare differently next time |

That's it: a short tag or two, not a ladder with confidence and
evidence. It's enough for the things that matter in play: a bandit who
saw your fire brings water, a rumor makes a town nervous, a beaten
rival trains against your last trick. Bluffs against ordinary enemies
work on these impressions and need nothing else.

Enemy dossier panels, "what they believe about you" readouts and
realization VFX on their side **don't appear** for ordinary enemies.
A spy's report can still tell you what someone said about you, as
plain dialogue.

#### Unless they do: who gets more

Some characters plausibly do keep records, read powers or see the UI.
They get the fuller machinery, and it's part of what makes them
special.

| Who | Why they'd know more | What they get |
|---|---|---|
| **Status-window holders** | Their own system appraises and records | Appraisal readouts, a quest log, maybe a bestiary entry on you |
| **Information powers** | Six Eyes, analysis, mind reading, soul sight | Rule-level reads (KN3 to KN5) without needing to see you many times |
| **Spymasters and intel factions** | Agents, informants, files | Real dossiers, kept by the organization, which you can steal, read or poison |
| **Scholars and archives** | Records of techniques and history | Rule knowledge about known techniques, not about you personally until you're documented |
| **Detectives and hunters** | Investigation is their job | Forensic notes on your residue and habits |
| **Enemy protagonists and other transmigrators** | They may have a UI, a system or a cheat like yours ([enemy protagonists](ENEMY_PROTAGONISTS.md)) | Possibly a full Notebook. Meeting one is a big moment: someone who plays the same game |
| **Regressors** | Memory of a previous loop | Knowledge of you from a timeline you don't remember |
| **Meta characters** | They live in the interface (the Watcher, the rival who learned) | They can see your actual logs, within the reach ladder |
| **Systems and gods** | They are the record-keepers | Whatever the world says they see |

So the fancy version becomes a signal. When an enemy suddenly
shows a dossier on you, that tells you something about *them*: they
have a system, a power, an organization or a past life.

#### What changes in the earlier sections

- **KN ladders** stay as the player's dossier on others. For NPCs they
  apply only to the "unless they do" group above.
- **AB bluffs** against ordinary enemies target EK impressions: make them
  remember the wrong thing. Rule-level bluffing (faking tells, false
  weaknesses) matters mainly against the informed group.
- **Viewpoint-filtered VFX** (VP1 to VP4) stay: they're about how the
  log describes a scene from someone's eyes, which needs no enemy record,
  only their knowledge tier.
- **Intel economy** (brokers, archives, leaks) belongs to organizations
  and record-keepers, which is where it fits in-world anyway.
- **Enemy probing** stays as ordinary combat behavior (a cautious
  fighter tests you first), not as dossier updates.

#### Implementation is much smaller

- Ordinary NPCs store a few tags per subject they've met (EK1 to EK4),
  ideally on records the game already keeps for relationships.
- Full belief records only exist for characters flagged as
  record-keepers by the table above, plus the player.
- The save cost drops a lot, and the migration is smaller: tags on
  existing records, plus belief records for the rare few.

### Knowledge works both ways (2026-10-10)

Weibao: "Its unlikely for me to know stuff about them unless I use a
certain thing to check, just as its unlikely for them to know about me
and stuff, everything needs to make sense in their respective worlds."

**Direction (Weibao).** The rule from the previous section is
symmetric, and the gate is **the means a character has on hand**, not
what their world allows in general. Weibao: "I mean not the world let
you observe but rather the means you have on hand." Living in a
status-window world doesn't let you appraise anyone; having the
appraisal skill does. The player doesn't know an enemy's power,
abilities, health or intent unless they use a means they actually hold,
and the same goes for enemies about you. Both sides start with what
they can see, hear and be told. This extends the accepted
[hidden intent](../PROJECT.md) decision from intent to everything.

#### What you know without a means

| Layer | Without a means | Example |
|---|---|---|
| Name | Only if introduced, famous, or labeled somehow | `a scarred mercenary` until someone says his name |
| Looks and gear | What's visible | `carries a spear, armor patched at the shoulder` |
| Bearing | Cues an observer would read | `moves like a veteran`, `hands shaking` |
| Condition | Described, not counted | `bleeding`, `staggering`, `barely standing` |
| Power and abilities | Nothing, until shown; then one impression | `something stopped your blade short` |
| Intent | Nothing (the hidden-intent decision) | |

Your Notebook records the same plain impressions an NPC would keep
(unaware, heard of, seen fight, fought). The player's KN ladder above
climbs only when a means is used, not by default.

#### Means on hand

A means is anything the character actually holds right now that could
reveal something. Illustrative kinds:

| Kind of means | Examples | Reveals | Limits and costs |
|---|---|---|---|
| **Skill** | Appraisal, cursed-energy sensing, spiritual sense, tracking, reading people | What that skill reads at its rank: level, grade, realm, habits | Rank versus their concealment; can be felt by the target; some cultures find it rude |
| **Innate power or cheat** | Six Eyes, a system window, soul sight, mind reading | What the power covers | Its own rules and costs; rare by nature |
| **Item** | A truth-seeing lens, a scrying bowl, a status-reading stone, a tracking charm | What the item is made for | Charges, wear, can be stolen, can be fooled by better concealment |
| **Contact** | An informant, a guild clerk, a sect elder, a drinking friend who gossips | What they know or can find out | Costs favors or money; they can lie, be wrong or be bought by the other side |
| **Access** | A library pass, a guild registry, a sect archive, a police file | Records that exist about the target | Only what's been recorded; access can be revoked |
| **Knowledge you already have** | Having studied a technique, having fought them before, a past loop | Recognition when you see it again | Stale, partial, or from another timeline |
| **Fighting them** | Always on hand | One impression per notable thing they did | Costs the fight |

What follows from "on hand":
- **Means travel with you.** Six Eyes or an appraisal skill brought into a
  low-magic world still works there unless that world's rules block
  it. Carried cheats are often exactly this: an unfair means.
- **Means can be gained, borrowed, bought or lost.** Renting an
  informant, borrowing a scrying bowl, losing your lens in a fight, an
  appraisal skill sealed by a curse. What you can know changes with
  what you carry.
- **The world sets what's common, not what you have.** A status-window
  world makes appraisal skills easy to find; a grim world makes them
  rare or absent. That changes how likely an NPC is to hold a means,
  not whether a given person has one.
- **Enemies follow the same rule.** A bandit with no means knows only
  what he saw. A bandit carrying a stolen truth lens knows more, and
  that lens is loot.
- **Using a means is an action.** It can be noticed, fail, be blocked,
  reveal only some layers, and go stale. The Notebook keeps which means
  produced each entry and when.

The full means principle (beyond knowledge) and appraisal levels and types live in [means and appraisal](MEANS_AND_APPRAISAL.md).

#### A "makes sense here" check for any knowledge

Before a character on either side knows something, ask:
1. **What means do they have on hand?** Skill, power, item, contact,
   access, prior knowledge.
2. **Did they use it on this target?** And did it work against any
   concealment?
3. **Could the result be wrong?** Rumor, misread, bluff, stale?
4. **Would they bother?** A bandit doesn't research a traveler.
5. **Who noticed them doing it?**

If there's no answer to 1 and 2, they don't know it beyond what they
saw.

#### What this means for VFX and numbers

- **Numbers come from a means.** Damage and HP numbers on an enemy
  imply the player holds something that measures them (a system window,
  an appraisal skill, a reading item). Without one, wounds are described
  (`a deep cut across the arm`). Lose the means and the numbers go back
  to words.
- **Your own numbers follow the same logic.** A character with a status
  window sees their HP; one without feels `you're losing a lot of
  blood`. The plain layer under each effect (TX2) uses the same wording.
- **Effects stay honest without numbers.** Infinity's dots measure the
  remaining gap, not a damage number, so the effect works in either
  style. Adaptation can shrink the described wound instead of a number.
- **The viewpoint filter (VP) already covers the player.** The player's
  character is the default viewer, so effects never show more than the
  character could perceive.

#### The native realm today (checked in source)

The current native UI shows enemy health, defense, attack, attack count,
attack speed and an evasion-style value in the enemy tooltip
([display.js](../src/display.js), around lines 5061 to 5188). Proposal,
not a change: treat that as a means everyone in the native realm holds
by default (a gamey world's built-in reading), and let characters in
other worlds read only what their own means allow. Changing native readouts later would be a
compatibility decision for that realm, recorded before it ships.

### Effects that grow with skill

The effect itself gets better as the character masters the technique,
so the presentation is a progress bar you can feel.

| Stage | What a Black Flash looks like |
|---|---|
| First accident | `B L A C K  F L A S H` with uneven spacing, a wobble, a lucky look |
| Learning | Even spacing, a cleaner flash, still slightly late |
| Reliable | Crisp, on the beat, the exponent stamped |
| Mastery | Shorter. The flash is barely a frame and the number is just there. Mastery looks effortless |
| Beyond | Sometimes no effect at all: plain text, the effectless one (above) |

Same for chants (stumbling, fluent, then incantation-free), forging
beats (uneven, steady, a single strike), calligraphy (blotchy, clean,
one stroke). The best technique gets quieter, not louder, and that
inverts the usual escalation in a satisfying way.

### Your own techniques

- **Naming.** A technique the player invents or customizes can take a
  player-given name, and every effect uses it (escaped, see F3).
- **Signature pieces.** Pick a motif, color and sound word from what
  you've unlocked; the effects assemble from them. Heirs inherit the
  signature, and rivals recognize it (the shared signatures section).
- **Chants you write.** In worlds where incantations matter, the player
  can write a short chant. Longer chants are stronger; the chant prints
  one line at a time during the cast.
- **Places named after you.** A big enough feat renames a map location
  for good: `the Purple Hollow`. Old names stay in the Notebook.

### NPCs react to effects

Effects exist in the fiction too, so people notice them.
- A guard who saw a time skip has a gap in their testimony.
- A child who saw your domain draws its border glyphs in the dirt later.
- A rival who saw your Black Flash starts training for it, and their
  next appearance shows a clumsy first-accident version.
- A merchant who saw the measurement break charges you more.
- Witnesses spread rumors (second wave), and the rumor describes the
  effect, distorted.

### One effect across worlds

The reskin rule (TX6) made concrete with one effect, the barrier:

| World style | Barrier look |
|---|---|
| JJK-like | `⟦HP 340⟧` with a cursed-energy tint |
| Cultivation | A ring of `☯` or talisman `符` glyphs |
| Status window | `[ Shield: 340 / 340 ]` that ticks down |
| Grim low-fantasy | No frame, just `(the shield holds)` in small text |
| Sci-fi | `▐▌ SHIELD 87% ▐▌` with a flicker as it drops |
| Fairy tale | A thorn hedge `❦❦❦` around the name |

The mechanic is identical everywhere. The player who learned it in one
world reads it at once in another.

### Numbers as style

| Style | Use |
|---|---|
| Arabic numerals | Default |
| Chinese numerals (`三千`) | Cultivation worlds, especially for cosmic-scale numbers (`亿`) |
| Roman numerals | Ancient empires, regnal names, numbered legions |
| Tally marks `𝍸` | Primitive or prison settings, counting days |
| Words | High-fantasy prose or the "damage as a sentence" bit |
| Exponent and notation | Status worlds and absurd power, via `expo_threshold` |

Changing numeral style is an effect of its own: crossing into a world
switches its numerals, so you feel the border.

### ASCII scenes and pictures

For rare set pieces, a tiny text picture can beat any animation.
- **Dioramas.** A five-line ASCII scene for a key moment: a moon over a
  ridge, a sword in a crater (SP4's needle, in text).
- **Braille-dot pictures.** Braille pattern characters (`⣿⡇⠸`) can
  draw low-resolution images in text: a boss silhouette, a seal.
  Screen readers read these as noise, so they need `aria-hidden` and a
  plain caption (TX2).
- **Kaomoji.** Cute worlds or cute characters: `(｀・ω・´)` as a
  companion's face beside their lines.
- **Maps in glyphs.** Fits the Hanzi direction already explored
  (semantic characters as terrain).

### More implementation considerations

| Code | Topic | Consideration |
|---|---|---|
| IM1 | **Data-driven effects** | Effects defined as data (primitives plus parameters) in the registry, so new effects and world reskins are mostly data, not code. Code only for genuinely new primitives |
| IM2 | **Budget lint** | A test that counts each world's big effects (X3) and flags a world that spends too many, or an exceptional-tier effect on a common event |
| IM3 | **Glyph vocabulary check** | A test that each glyph in TX10's glossary is used for one meaning only across the registry |
| IM4 | **Effect collection** | An "effects seen" page in the Notebook, like a bestiary, filled when each effect first plays. It doubles as the glossary and costs only a set of ids in the save (a persistence addition with an empty default) |
| IM5 | **Touch screens** | Hover-based effects (shy text, cursed tooltips) need a tap equivalent; nothing may rely on hover alone |
| IM6 | **Readability options** | A dyslexia-friendly option turns off spacing and letter-swap effects and keeps color and weight; a text-speed option controls typewriter effects |
| IM7 | **Color-blind safety** | Every color-carried meaning has a glyph or weight backup (P7); test the palette under common simulations |
| IM8 | **Long sessions** | Idle tabs run for days. Effects must clean up their nodes and listeners; a soak test with the tab open for hours checks memory doesn't climb |
| IM9 | **Theme tokens** | World styles as CSS custom properties (frame glyph set, palette, numeral style, sound vocabulary), switched on world crossing |
| IM10 | **Stable ids for marks** | Cosmetic marks saved on records (scorch, kintsugi, dust age) reference effect ids that never get renamed; a renamed effect keeps an alias |
| IM11 | **Share card** | Photo mode can render a moment as an image on a canvas, downloaded only on a player click. No upload, no sharing service |
| IM12 | **Horror and comfort tiers** | Horror effects (something behind, wrong NPC) sit behind the meta setting like M4 and M5, with a content note in the world's description |
| IM13 | **Effect authoring guide** | A short doc for agents adding effects: pick primitives, write the plain line (TX13), define the static form, set a budget cost, add a gallery entry |

### Expanding the second wave

**Rumors that mutate.** A rumor is a record (subject, claim, source,
distortion). Each hop to a new NPC may swap one word from a bank shaped
by that NPC's traits: a coward exaggerates the danger, a fan
exaggerates you, a rival minimizes. The player hears the version that
reached them, and the Notebook can trace it back hop by hop. Distortion
grows with distance and time. Some rumors become legends that outlive
the truth, which ties into timelines.

**Reputation spelling.** Each region tracks how well it knows your name.
Low familiarity picks a misspelling from a stable seed (the same wrong
name every time in that region, so it feels like a real local habit).
As fame rises, the spelling converges. A disguise resets it on purpose.

**Tells.** A tell is an enemy line printed one beat before a big move,
with the hesitation shown by an ellipsis or a sound word (ON7). Its
lead time is an adjective: a clumsy enemy telegraphs early, and a
master's tell is a single character. An attentive player can respond
with a parry or a dodge; passive play rolls perception instead.

**The effectless one, as a world rule.** Some worlds can push restraint
all the way: no effects for anyone, ever, except one moment per
campaign. That world's single effect becomes the most memorable thing
in it.


## Corc reference round 2, 2026-10-20: small physical delight

**Proposal palette additions.** The [Corc synthesis, CRL15–CRL26](research/proto23/DESIGN_LESSONS_FOR_OOPS_2026-10-20.md#round-2-2026-10-20-falling-little-ui-reactions-and-fun)
qualifies the saved source images/captions. Existing X1–X7 restraint, P1–P7,
UR38, AD6–AD8/AD16/AD19/AD28/AD34/AD38 and the
[humor lifecycle owner](gm/dispatch/procgen-2026-10-13/p26/HUMOR_AND_NOVELTY.md#z12-running-gag-lifecycle)
remain in force. Ordinary movement in a little activity scene need not be a
fourth-wall power; large interface effects retain their rare, earned role.

| Reference | Proposed delight | Default, dial and reason/cost |
|---|---|---|
| CRL15–CRL18 | A loose pebble, held pose, fast descent, then a short landing beat | Default: local readable movement and plain outcome. Dial: serious/comic tone, body/surface/support and reduced motion. A soft aftermath can be funny without compulsory damage, gore or a reaction-time challenge. Skipping presentation does not repeat/undo the result. |
| CRL19/CRL21 | A struck bar sheds a brief loss trail; a repaired tool gets a crisp accent | Default: subject-local, static equivalent, no movement of ordinary controls. Dial: ink, chips, light or quiet text by cause/world/preference. Bind to existing receipt/anchors; routine ticks need not remain excited. |
| CRL20/CRL23 | A creature looks at a new object, a lamp gutters, a tired character settles | Default: derive transient texture from existing state. Dial: place/body/style/frequency. A lasting rename/change has an owner; an incidental look need not create a new relationship record. |
| CRL24 | The capable character has a mundane priority | Default: a fitting brief aside, such as protecting lunch after mastering a once-frightening climb. Dial: audience, tone and quiet preference. Preserve competence, useful outcomes and the existing gag's ability to end; no reward or fake mechanical warning needed for every joke. |
| CRL25/CRL26 | A pebble's distant impact, sheltered rain, then a quiet first overlook | Default: sparse text/sound observations from an actual place. Dial: hearing/obstruction/style. Sound-off retains useful information; no exact range or hidden-source identity follows automatically. Existing discovery/history supports familiarity on return. |

**ACT NOW (done):** saved this local physical palette and linked existing owners.
**ACCOUNT FOR NOW:** separate a real response window from a rendering of settled
state; atmosphere and comic staging need no new engine contract until a selected
consumer requires one. **LATER / DELEGATE:** CRJ5–CRJ7, not dispatched. Sol
low/medium for staging/context, Luna low for an already settled bounded visual
leaf; small effort when an actual activity/receipt/return interaction is selected.
Done: one readable sequence/reaction/callback at 1920×1080, static/reduced forms,
no repeated settlement on skip/reopen, and separate human tone/feel review. No
runtime change or visual default accepted by saving this palette.


## Reference detail fold, 2026-10-20: caused reactions and affectionate detail

Proposal extension of CRL15–CRL26, existing restraint/humor lifecycle and
AD6–AD8/AD16/AD19/AD28/AD38/AD40. The
[visual/engine fold](research/proto23/ENGINE_AND_UI_DETAIL_CONNECTIONS_2026-10-20.md#plan-fold-and-further-interactions-2026-10-20)
retains SBS1–SBS16, CUI1–CUI5 and PFE01/PFE12–PFE15/PFE21/PFE25–PFE30.
The [thematic owner](THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#reference-ui-and-engine-fold-2026-10-20-color-detail-and-continuity)
owns RUC color/typography roles; ordinary small-scene motion remains distinct
from large earned fourth-wall effects.

| Connection | Further playful possibility, original proposal | Default, dial and cost |
|---|---|---|
| PFE01/PFE21 | A nicked axe gives one dry snap, repaired metal gets one crisp accent, the old target's dust settles before the new target appears | Derive from the actual occurrence and subject lifetime. Cosmetic variant selection is stable/presentation-local; no gameplay RNG draw or delayed reward. Material vocabulary depends on sensed/known properties. Cost: a small coherent event vocabulary. |
| PFE25 | A handless traveler uses a different support, or flies past the old cliff with a carefully level cup of tea | Stage the actual method/body, including bypass. Pose and tone are dials, not reasons to disable a power or make every actor humanoid. Cost: a few supported method variants for the selected scene. |
| PFE26 | Someone who actually saw the muddy landing later offers a dry towel with a perfectly straight face | Use a witnessed/heard cause and the right speaker. The player's private event does not give every NPC knowledge. Let the callback settle or evolve after its cause ends. Cost: one useful local memory, if not already present. |
| PFE27 | A cat selects the warm patch, watches a falling pebble or relocates after a real object moves | A flourish can remain transient. If movement actually changes access, heat or custody, the actor/process owner must settle that consequence; a cute pose does not secretly destroy supplies. Cost grows only with the real consequence selected. |
| PFE28/PFE29 | A repaired seam remains recognizable; an expert's routine becomes a short confident motion, with unusual breaks still getting a clear beat | Derive marks and shorthand from real history/capability; distinguish familiar routine from an exceptional outcome. Sound/effects/seriousness are dials. Cost: authored variants and a few meaningful boundaries, not a new biography ledger. |

**ACT NOW (done):** folded local reactions, physical scenes, ordinary life,
patina, audience and competence into this palette. **ACCOUNT FOR NOW:** quiet
mode keeps the useful outcome; return does not replay missed effects; changing
theme cannot change a result; commands keep their place and gesture subject.
**LATER / DELEGATE:** CRJ5–CRJ7/PFB3–PFB5/CUI4 retain their existing triggers;
Sol low/medium for body/voice/lifecycle, Luna low for a settled visual leaf,
small/medium for one selected event/scene. Done: actual/native event binding,
static/reduced presentation, no old pulse on a new subject and separate human
tone review at the desktop targets. No animation, audio or scene implemented here.
