# World atlas ideaboard (2026-11-22, proposals)

Weibao, after the reader-findings and game-link build: "ideaboard improvements to make the atlas look more
flavorful, while being more useful and more?"

Every WA line is a proposal (AD32). "Now" means what the atlas does as of commit `708d0df0b`. The atlas is a
development tool (`prototypes/world-atlas/`, its own server), not a player surface. UI_RULES' player rules
inform it but do not bind it, and MW9's "no new standalone pages under `prototypes/`" means these ideas grow
the existing atlas rather than spawn new pages.

## What it looks like now

- One look for every world: dark slate, monospace, thin outlined boxes in four or five border colours, hatched
  unknowns. LOTM, Harry Potter and Reverend Insanity look identical.
- Boxes carry a label and a count. Meaning sits in the inspector, so the canvas reads as a grid of names.
- Useful layers already exist but sit apart: scenes by place, districts, reader things, making trees, game
  state (playable, recorded, absent), the progress snapshot and batch receipts. A question that crosses two
  of them takes two views and memory.
- Every view describes. None of them says what to do next.

## Recommended first five

1. **WA1 · A world wears its book.** Per-world palette, display face and two or three motifs from a small
   theme table (below). Cheap, and every screen changes at once.
2. **WA8 · Gap cards that end in a next step.** Each gap the atlas already computes (unread shards, absent
   workings, stale citations, unplaced places) becomes a card saying what is missing, why it matters, and the
   command, file or owner that closes it.
3. **WA12 · One question, all layers.** Pick an item, person or place and see its census row, scenes, making
   tree, game state and the code that uses it on one page. This is the Things inspector grown into a dossier.
4. **WA5 · Real map ground for places.** Draw places on the district map the walk already uses (Tingen,
   Backlund), not on a grid. Box grids stay for kinds with no geography.
5. **WA16 · Since last time.** A dated diff between two snapshots: what the readers added, what turned
   playable, what went stale. The build already writes dated snapshots; nobody compares them.

WA1 is mostly flavour; WA8, WA12 and WA16 are mostly use; WA5 is both. Everything else below is the wider palette.

## Flavour: make each world feel like itself

**WA1 · Theme table per world.** One small table, no art pipeline:

| World | Ground | Accent | Display face | Motifs |
| --- | --- | --- | --- | --- |
| LOTM | Soot-dark paper | Brass, crimson for the red moon | A Victorian serif | Gears, tarot suits, the grey fog |
| Harry Potter | Parchment | House colours as accents | A storybook serif | Wax seals, quills |
| Reverend Insanity | Deep green-black | Jade, blood-gold | A brush-stroke CJK-friendly face | Gu silhouettes, aperture rings |
| Mother of Learning | Slate | Cyoria blue | A clean academic serif | Loop marks, mana lines |
| The Village (OOPS) | The current slate | YAIR green | The current mono | Stays the dev look |

The data look (hatched unknowns, the state colours) stays shared across worlds, so a playable box means the
same thing in every world and only the ground changes. A Display toggle keeps the plain dev look.

**WA2 · Kind glyphs.** One small icon per census kind (item, creature, deity, document, price, clock, place,
person) drawn in the box corner, so a Things grid reads at a glance without the label. The kit already has an
icon font for marks.

**WA3 · Book-voice captions.** Captions and empty states written in the world's register. "The fog holds no
record of this yet", not "No reader rows". Kept to captions and empty states, never data labels, so nothing
false sneaks in. Developer words stay in the inspector's id line.

**WA4 · A quote under the name.** The inspector shows one short source line where the readers kept a locator
(the first mention, a step). It must stay under the copyright limit the reading notes already follow: one
line and a locator, no passage.

**WA5 · Map ground.** Places on the district maps, scenes as pins on them, and the walk's routes as lines.
For worlds without a map, a sketch layout from the places pass's `within` chain (city › district › street) is
a fair stand-in.

**WA6 · Making trees drawn as recipe cards.** A working shown as a card with ingredients down the left and the
product on the right, ritual and minutes as stamps. The tree layout stays; only the box changes.

**WA7 · (Unusual) The atlas as an in-world object.** Each world's atlas is framed as a thing from that world:
LOTM's as a Tarot Club member's ledger, HP's as the Marauder's-map-style parchment, RI's as a Gu master's
scroll. Same data, a framing pass on the shell. This is a big taste call and could get kitschy; a worthwhile
version tries it on one world first.

## Use: make it answer the next question

**WA8 · Gap cards.** Every computed gap becomes a card: what, why it matters, how to close it, who owns it.
First sources: unread shards (closes with the batch run file), absent workings (closes with a source row
in `lotm_craft_rows.js`), stale citations (F25; closes with a rename), unplaced places (closes with a pick, which
already exists), census-label gaps (F29). Cards sort by consequence, not count.

**WA9 · "Close the gap" buttons where it is safe.** A pick already writes to the transfer chain. Extend that
pattern only to writes that are local and reversible: a stale-citation rename proposal, a place pick, a
fill accept or reject. Sending, spending and committing stay outside the atlas.

**WA10 · Fill review queue.** The 294 agent-filled items and 935 outcomes (F26) are agent work. A small queue
shows each with its source steps and lets Weibao or a lane mark it kept, wrong or unsure. Accepted fills
graduate; rejected ones drop out of the trees.

**WA11 · Book-to-game ladder per working.** For each working: read → in census → source row → bound command →
played in a headless run → delivered. The atlas has the first four. Game MCP receipts could supply "played",
which would answer "does this actually happen in play?"

**WA12 · Dossier.** One page per thing: census, scenes it appears in (with place and day), ties, workings
that make or use it, game rows that cite it, and `rule_routes`-style links to the source files that mention its
id. Today that takes four views.

**WA13 · Cross-world compare.** Pick a kind (healing potions, travel, money) and see it across worlds side by
side: what each book has, what each game slice plays. Good for mechanic absorption, since it shows where a shared
mechanism already exists.

**WA14 · Search across everything.** One box that finds an id or name in any world and any layer, with the
kind and world on each hit. The current finder is per view.

**WA15 · Leverage view.** For making: which raw materials unlock the most workings, and which single absent
working blocks the most others. That tells a lane which row to build next, rather than only listing what is
missing.

**WA16 · Since last time.** Snapshot diff: counts up or down per world and layer, newly playable workings,
new stale citations, readers collected since. Fed by the dated snapshots and the batch receipts.

**WA17 · Batch run watch.** The seven running reader drivers as a live strip: step, batch ids, measured
spend against the $40 ledger, stop-rule state. Today that lives in log files.

## More: stretch and unusual

**WA18 · Time scrubber.** A slider over the book's chapters or in-world days. Places, people and workings
fade in as the readers first meet them, so you can see a world as the lead knew it on day 30. The census
already records `firstMention`; scenes carry days.

**WA19 · The lead's footprint.** Overlay what the lead has touched (`touchedByLead`, scenes, the walk) on
everything the world holds. That gives a quick read of how much of a world the game's slice actually uses.

**WA20 · Ask the atlas.** A question box that answers from the snapshot and digests only ("which LOTM
workings need silver and are playable?"), with every answer linked to rows. Local and read-only. It needs a
query layer more than a model, and the model is optional.

**WA21 · Printable world brief.** One page per world (themed per WA1): what the books hold, what the game
plays, the top gaps. Useful to hand a lane as its world briefing.

**WA22 · Sound off by default.** A faint ambient loop per world (a clock tick for LOTM, wind for RI) behind a
toggle. Pure flavour, cheap, easy to hate; listed so it is decided rather than forgotten.

## Not recommended

- A 3D globe or force-directed graph of everything. It looks impressive, but past about a dozen nodes it
  reads worse than the current grids, and the progress-atlas rule prefers grouped lists there.
- Completion percentages per world. They would turn a map into a score, which the progress-atlas skill rejects.
- Generated art per item. Cost and taste risk are high, and the payoff is low next to glyphs (WA2).

## If Weibao picks

The smallest useful bundle is WA1 on LOTM only (the theme table plus a toggle), then WA8 gap cards from the
four gap sources the snapshot already has. Both live in `things-views.mjs`, `library-views.mjs` and `canvas.css`,
and both can be proven with the existing `prove-all.mjs` screenshots at 1920×1080.
