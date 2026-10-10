# Presentation, animation and the fourth wall (proposal)

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
