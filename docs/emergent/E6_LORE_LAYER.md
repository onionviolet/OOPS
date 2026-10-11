# E6. Lore layer, build-ready draft (proposal)

Claude, 2026-10-09. Expands layer E6 of [Emergent systems](../EMERGENT_SYSTEMS.md)
and fills its four "build-ready when" boxes. Names follow the
[shared vocabulary](SHARED_VOCABULARY.md); additions are listed at the end.

**Everything after section 1 is a proposal.** Nothing is selected for a
build. Per [anything is possible](../USER_VISION.md#anything-is-possible-2026-10-09),
where a choice exists the world, storyteller, cheat or player decides, and
every option stays reachable (section 14).

Public-doc rule (PROJECT.md "Book worlds"): this file holds no copyrighted
names or prose. Book worlds appear as "a book world" and plug in through a
private pack (section 12).

## 1. Verified source facts (checked 2026-10-09)

Each line was read in the named file. None of this is a proposal.

| ID | Fact | Where |
|---|---|---|
| V1 | The biography record keeps at most 64 recent milestones and 200 yearly summaries. Older years collapse into `earlier: {throughYear, count}`. | `src/life_record.js:15`, `:44`, `:46` |
| V2 | Compaction runs on every append. Entries older than last year fold into their year. A year keeps 4 highlights chosen by arrival order (first four distinct texts), not importance. A year lists at most 8 worlds. | `src/life_record.js:36-47` |
| V3 | A milestone is one line of 1 to 240 characters, kind one of: beginning, journey, memory, birthday, career, loss, family, rumor, legacy. `rumor` and `legacy` already exist. | `src/life_record.js:4`, `:8` |
| V4 | The 64 and 200 caps live in `life_record.js`, not `chronicle.js`. The chronicle has its own: log 40, event instances 16, relationship owners 64, memories 32 each. | `src/chronicle.js:29`, `:31`, `:38`, `:54`, `:64`, `:67` |
| V5 | Chronicle knowledge is key to boolean only, so it cannot hold who, where or when. The simulation knowledge store carries `stage` and `value`. | `src/chronicle.js:28`; `src/simulation_effects.js:83-85` |
| V6 | A chronicle event that closes unattended becomes `missed`. Eight game minutes later "hear" turns it into a rumor line and a `heard.<id>` flag. A working rumor path exists. | `src/chronicle.js:109`, `:179-182` |
| V7 | The chronicle feeds news only in `base.frontier`. The feed shows 8 news items. | `src/event_feed.js:8`, `:102` |
| V8 | `npc_lives.js` is fixed: FNV hash picks lifespans, events are predetermined, caps 32 people, 64 events, 16 news. People: Maia, Oren, Lio, Neri (born year+3), Rhea, Nima, Iona. | `src/npc_lives.js:4`, `:9`, `:13-23`, `:26` |
| V9 | Other named Village content: Nell and a field association, Eda, Tamsin, Tarin, Asha, Orin, an old craftsman, an elder, guards, a morning wayfinding circle, a disused waypost, a brass token, chalk copies. | `src/audit_remainder_consequences_content.js:102`; `src/village_content.js` |
| V10 | Native places: Village, Shack, Eastern mill, Eastern storehouse, Infested field, Infested woods, Nearby cave, Forest road; Town outskirts, Slums, Town farms, Town square. A river south of Village has a buildable bridge. | `src/data/locations.js:297-1155`, `:309`, `:2655` |
| V11 | Facts `weather.raining`, `weather.damp`, `day.hour` exist. No season fact was found by grep. A year is 12 months of 30 days, 518,400 minutes. | `src/everyday_life.js:78-80`; `src/chronicle.js:3`, `:88-95` |
| V12 | A private-pack loader exists but is untracked (`??`). It fetches `private_packs/manifest.json` at runtime, treats 404 as "none", requires the pack id as prefix on every content id, and rejects collisions. `/private_packs/` is in the uncommitted `.gitignore`. | `src/content_packs.js`; `.gitignore:12-13` |
| V13 | An outside planner may only propose a registered command, never prescribe effects. | `src/simulation.js:616` |
| V14 | Existing tone is short, dry, concrete: a route board with "an unreasonable number of pins"; "We usually start with hello." | `src/village_content.js`; `src/chronicle.js` |

### Where this contradicts or sharpens EMERGENT_SYSTEMS.md

- **C1.** The doc places the "64 recent + 200 annual" compaction in the
  chronicle. It is `life_record.js` (V1, V4). The chronicle has smaller caps.
  They are two stores.
- **C2.** The doc says the chronicle stores knowledge. It stores booleans (V5),
  so E6 needs a new fact store.
- **C3.** The doc implies year summaries pick the biggest facts. Today they
  pick the first four (V2). Scoring is new work in `fold()`.
- **C4.** No season exists (V11). The proposal derives one from the month.

## 2. Shape of the layer

Five kinds: **tables** (`src/data/lore/<world>.tables.js`, what a world is
made of), **grammar** (`<world>.grammar.js`, how it talks), **fact store**
(save, per world), **legends** (save, mostly inside `life_record` years) and
**guards** (inside the tables). Pure seeded functions: `draw`, `expand`,
`record`, `recall`, `closeYear`, `breach`. E2 cards and E3 spawns never write a
name or noun themselves; they ask a table or grammar.

## 3. World table schema

One file per world, plain JSON-safe data, so a private pack ships the same
shape as `.json`.

| Field | Type | Req. | Meaning |
|---|---|---|---|
| `schema` | `1` | yes | Migration version. |
| `id` | `world:<world>` | yes | Matches the world id used by cards and spawns. |
| `inherits` | table id or null | no | Alternate universes copy a parent and override. Objects replace by key; arrays append unless `replace:true`. |
| `label` | string | yes | Shown to the player. |
| `calendar` | `{seasons:[{id, months}]}` | yes | Season derived from month. |
| `origins` | `[{id, label, weight, tags, names}]` | yes | Where a person is from. Drives name pool, voice and starting tags. |
| `names` | `{pool:{given, family, nick}}` | yes | An entry is a string or `{v, w, tags}`; `w` defaults to 1. |
| `jobs` | `[{id, label, weight, tags, needs, places, season, grants}]` | yes | `needs` is a `meets()` rule. `grants` are tags given to the holder. |
| `goals` | `[{id, label, drives, targetKind, span, text}]` | yes | E3 goals. `drives` is the need that raises weight. `targetKind`: person, place, item, fact, none. `span` in game days. |
| `factions` | `[{id, label, tags, values, places, stance}]` | yes | `values` are tags members weigh. `stance` is how they treat outsiders. |
| `localTags` | `[{name, family, note}]` | no | World-scoped, read as `<world>.<name>`. |
| `taboos` | `[{id, forbid, severity, reaction}]` | no | Cultural limits. Breaking one is allowed and costs standing. |
| `weather` | `[{id, seasons, weight, tags, line}]` | yes | May set native `weather.raining` and `weather.damp`. `line` is a grammar symbol. |
| `places` | `[{id, label, kind, tags, native}]` | yes | Native places link by game name (V10); others are labels. |
| `materials` | `[{id, tags, places, rarity}]` | no | Tag pools for finds and trade. |
| `powers` | `[{id, label, tags}]` | no | Gods, spirits, local "laws" people cite. May be empty. |
| `rumors` | `[{id, weight, needs, text, tags}]` | no | Background talk that needs no event. |
| `guards` | section 10 | yes | May be empty, never absent. |
| `canon` | `[{id, at, who, place, text, fixed}]` | no | Fixed history. Empty for original worlds. |
| `grammar` | grammar id | yes | The grammar this world speaks with. |
| `translate`, `reception` | rows; `0..9` | no | Foreign-word rewrite and gossip intake (section 11). |

Validation: ids stable and prefixed `<kind>:<world>.`; weights positive
integers; every `needs` parses under existing `meets()`; every `places` entry
resolves; every grammar symbol a table names exists; every text at most 240
characters (V3).

## 4. Village tables, first draft

Existing named people keep their identities (V8, V9). Tables supply only new
people, spawned as `person:spawn:<cause>:<key>`. Names below are invented
plain words.

### 4.1 Names by origin

| Origin | Wt | Feel | Given | Family |
|---|---|---|---|---|
| `hill` (old families at the mountain foot) | 5 | two syllables, soft endings | Bram, Hale, Dessa, Pell, Wynn, Tove, Ansel, Mirek, Sela, Koris | Stoneleigh, Harrow, Tuck, Cairn, Fellwick |
| `river` (south bank) | 3 | water words, clipped | Rue, Fenn, Calla, Joss, Ibb, Teal, Marren | Reedman, Shallow, Weir, Eddy, Sedge |
| `road` (carters, Town traders) | 3 | longer, trade nicknames | Varo, Kesh, Lindt, Sabe, Doran, Ysolt, Tamar | Cartwright, Lowe, Tolliver, "of the Forest Road" |
| `survey` (waypost and map people) | 1 | one mark-like name, no family | Chalk, Pin, Tally, Margin | none |

Nicknames, all origins, weight 1: Short, Two-Boots, Left-Gate, Late,
Mill-Nose. `survey` names need the `apprentice` tag or the `waymark_circle`
faction.

### 4.2 Jobs

`farmhand` (6, fields, grants `village.fieldwork`), `ratwarden` (3, Infested
field, `village.ratty` and `brave`, needs field not cleared), `miller` (2,
Eastern mill, autumn), `carter` (3, Forest road, origin `road` or `hill`),
`mason` (2), `herbalist` (2, woods, spring), `guard` (2, `lawful`),
`apprentice` (1, needs old craftsman alive), `archive_clerk` (1, winter, needs
elder alive), `waymark_walker` (1, needs the morning circle) and `nothing_much`
(4, `lazy`). The last is deliberate: native text says many villagers "are just
sitting around" (`locations.js:309`). When `history.village.bridge_built` is
true, weight shifts from `nothing_much` to `farmhand` and `mason`.

### 4.3 Goals (drive, target, span in days)

`clear_debt` (money, person, 90: "wants to be square before winter"),
`fix_roof` (safety, item, 40), `court` (belonging, person, 60: "has been
walking the long way past one door"), `archive_seat` (status, fact, 200),
`see_town` (purpose, place, 120), `finish_bridge` (purpose, fact, 300: "counts
planks in conversation"), `be_left_alone` (safety, none, 30: "would like the
day to be dull"), `settle_grudge` (status, person, 90), `learn_a_trade`
(purpose, person, 150).

### 4.4 Factions (values, stance to outsiders)

`elder_archive` (`lawful`, `pious`, `honest`; slow trust, long memory),
`field_association` (`kind`, `curious`; open, counts what you take),
`waymark_circle` (`curious`; welcomes anyone who leaves a mark),
`ratwardens` (`brave`; respects whoever clears a row), `mill_folk` (`proud`;
keeps to itself, counts favors) and `the_idle` (`lazy`, `cunning`; the gossip hub).

### 4.5 Local tags, taboos, weather, places

- **Local tags** (read as `village.<name>`): `ratty`, `waymark`, `chalk`,
  `fieldwork`, `flour`, `archive`, `association`, `leaning` (a structure near
  falling), `bridge_talk` (raises the bridge in every conversation).
- **Taboos (soft):** `take_without_mark` (taking from the waypost without a
  mark; severity 2; `waymark_circle` reproach), `whistle_at_cuts` (1; a
  villager says so), `lie_to_elder` (4; `elder_archive` stance falls),
  `burn_the_chalk` (3; `waymark_circle` grudge), `owe_two_houses` (2; gossip card).
- **Seasons from month:** 1 to 3 `thaw`, 4 to 6 `growing`, 7 to 9
  `harvest`, 10 to 12 `cold`.
- **Weather (weight):** clear (6, all); thin rain (4, thaw/growing, sets
  `weather.raining`); hard rain (2, growing/harvest, sets raining and damp);
  river mist (3, thaw/cold, bonus `hidden`); dry heat (2, growing/harvest,
  `hot`, `flammable`); first frost (2, harvest/cold, `cold`); snow on the north
  rocks (3, cold, `cold`, `remote`).
- **Places:** native ones from V10. Proposed labels only, no build implied:
  the Drainage Steps, the Chalk Wall, the Rat Gate, the Common House (where
  news travels), the Mill Race, the Long Bank, the Archive Door.

### 4.6 Rumor seeds

`bridge_when` (4, bridge unbuilt: "the planks arrive next month"),
`rats_learning` (2, field not cleared), `old_survey` (2, waypost found: "a
surveyor hid more than one thing under it"), `elder_tea` (2: "stronger than he
looks"), `lean_year` (3, needs `history.village.harvest.poor.count >= 1`:
"people still count years from the lean one"), `stranger_road` (3).

## 5. Grammar format

Tracery-style, plain JSON. Reference, from general knowledge and not
re-checked here: Tracery (Kate Compton) for the `#symbol#` and modifier
syntax; Caves of Qud for generated histories, whose people, factions and
sultans come from tables plus grammar (labelled reference only).

```
{ "schema": 1, "id": "grammar:village", "origin": "line",
  "rules": { "<symbol>": [ "<string>" | {"t": "<string>", "w": 2, "needs": <meets rule>} ] },
  "limits": { "depth": 8, "chars": 240 } }
```

- `#symbol#` expands; `#symbol.mod1.mod2#` applies modifiers in order.
  `[crop:#crop#]` stores an expansion for the same line (standard Tracery).
- `#$who.name#` reads a cast binding from the E2 card. The `$` marks an
  entity binding so symbols and cast roles never collide (plain Tracery has no
  such marker).
- A rule may carry `w` (weight, default 1) and `needs` (a `meets()` rule), so a
  line can depend on weather, season or history with no new syntax.
- **Modifiers:** `capitalize`, `a` (a or an), `s`, `ed`, `poss` (`Oren` to
  `Oren's`), `the`, `lower`, `when` (a fact age to "last autumn").

**Seeding (the E1 link).** Each line draws one 32-bit line seed from the
`text` stream. `expand` uses a local PRNG from `hash(lineSeed, symbolPath)`.
So editing grammar never shifts later `text` draws and never touches another
stream. Rules whose `needs` fail are filtered, then a weighted pick runs.

**Saved output.** The resolved string is what gets saved, on the event, news
line, milestone or fact. Displays never re-expand. A receipt
`{grammar:'village@1', symbol, lineSeed}` sits beside it for debugging; if the
grammar changed since, the saved string still wins. Lines obey the 240-char cap
(V3): over-long output is cut at the last whole word and the lint flags the rule.

**Safety.** Depth 8. An unexpandable symbol yields an empty string and a lint
warning, never raw `#symbol#`. Build lint: unknown symbols, worst-case length,
words banned by the world's guards, em dashes.

## 6. First Village grammar (31 symbols)

Tone follows V14. The real file would carry 3 to 8 variants per symbol.

```
"greeting":     ["Morning","Afternoon","Evening",{"t":"Mind the mud","needs":{"fact":"weather.damp","op":"eq","value":true}}],
"weather_line": [{"t":"The rain has the whole village talking about roofs.","needs":{"fact":"weather.raining","op":"eq","value":true}},"Dry enough that the chalk keeps its lines.","Cold enough to notice who has a good coat."],
"hill_name":    ["Bram","Hale","Dessa","Pell","Wynn","Tove","Ansel","Mirek"],
"river_name":   ["Rue","Fenn","Calla","Joss","Ibb","Teal"],
"road_name":    ["Varo","Kesh","Lindt","Sabe","Doran"],
"name":         [{"t":"#hill_name#","w":5},{"t":"#river_name#","w":3},{"t":"#road_name#","w":3}],
"crop":         ["barley","turnips","beans","rye","flax"],
"tool":         ["rake","hand cart","sieve","long spade","mending awl"],
"sound":        ["a cart wheel complaining","the mill race, steady","someone hammering a plank that needs no hammering","rats, somewhere, being rats"],
"smell":        ["wet straw","flour dust","lamp oil","river mud","chalk and old paper"],
"grumble":      ["#name# says the #crop# will fail and has said so for years","#name# blames the bridge, as always","#name# has opinions about the #tool#"],
"rat_line":     ["A rat the size of a loaf crossed the Rat Gate with confidence.","The wardens counted twelve rows clear and one row opinionated."],
"bridge_line":  [{"t":"Someone has started counting planks aloud.","needs":{"fact":"history.village.bridge_built","op":"eq","value":false}},{"t":"People cross the river now and complain about other things.","needs":{"fact":"history.village.bridge_built","op":"eq","value":true}}],
"waypost_line": ["The waypost keeps its secrets dry.","Chalk arrows lead to the Drainage Steps and nowhere interesting."],
"debt_line":    ["#$who.name# owes #name# #$debt# coins and now crosses the lane early.","#$who.name# is paying a debt in small, loud installments."],
"market_line":  ["#crop.capitalize# is cheap this week. #grumble#.","The carter wants twice what the #tool# is worth and half of it is the story."],
"mill_line":    ["The mill folk say nothing, in unison.","Flour dust hangs in the Eastern mill like weather."],
"mood_adverb":  ["quietly","too cheerfully","as if it were nothing","without looking up"],
"gossip_open":  ["They say","I heard","Word from the Common House is that","#name# swears"],
"gossip_close": ["Make of that what you will.","It was a dull week otherwise.","Nobody is naming names, which is how you know."],
"rumor_body":   ["a stranger on the Forest road asked the way to nowhere","the elder is stronger than he lets on","the craftsman turned down Town money again","the rats have learned the traps"],
"gossip":       ["#gossip_open# #rumor_body#. #gossip_close#"],
"legend_verb":  ["burned","was argued over","was finally mended","was lost and found","was paid in full"],
"weather_year": ["the long rain","the early frost","the dry harvest","the mist that stayed"],
"legend_year":  ["The year the #crop# burned.","The year #name# lost the #tool#.","The year of #weather_year#."],
"callback_open":["Remember #$hist.who.name#?","You were there when #$hist.what#, #$hist.when#.","#$hist.who.name# still talks about #$hist.what#."],
"season_word":  ["thaw","growing","harvest","cold"],
"farewell":     ["Mind the Drainage Steps.","Leave a mark if you take something.","Keep your chalk dry."],
"ambient":      ["You hear #sound# and smell #smell#."],
"line":         ["#greeting#. #weather_line#","#market_line#","#gossip#","#rat_line# #bridge_line#"]
```

Hand-expanded samples (illustrative, **not produced by code**):

1. `#line#`, bridge unbuilt: "The wardens counted twelve rows clear and one row opinionated. Someone has started counting planks aloud."
2. `#gossip#`: "Word from the Common House is that the craftsman turned down Town money again. Nobody is naming names, which is how you know."
3. `#debt_line#`, `$who` Oren, `$debt` 40: "Oren owes Pell 40 coins and now crosses the lane early."
4. `#callback_open#`: "You were there when Corin's stall burned, last autumn."
5. `#legend_year#`: "The year of the early frost."

Important cards keep hand-written text with small slots. A card using a
grammar line marks it `text: {grammar:'village', symbol:'debt_line'}`.

## 7. Facts: shape, naming and compaction

### 7.1 Shape

Facts are saved records, separate from chronicle knowledge (C2).

```
{ id: 'fact:spawn:<cardId>:<instanceKey>',
  type: 'village.stall_burned',
  at, year, world, place, who: ['person:...'], what: <slug>,
  weight: 1..9, tags: [...], vis: 'public'|'witnessed'|'private'|'rumor',
  expires: <minute>|'never', line: <saved string <=240, optional>, refs: <callback uses> }
```

### 7.2 Naming

- **Type:** lowercase dotted, world first: `village.stall_burned`,
  `village.harvest.poor`, `village.bridge_built`, `village.debt_paid`.
- **Published to `meets()`** (so no new rule syntax): `history.<type>`
  (boolean), `.count`, `.last_year`, `.age` (minutes since last, computed at
  read), and `person.<id>.history.<type>`.
- **Writers:** a card or rule may write only types listed in its `sets`
  (E2). A type nobody declares is a lint error.
- **Adapter:** `npc_lives.js` events become facts at year rollover
  (weight 4 to 6, `public`). Cards never write them.
- **Canon facts** use the `canon.` prefix, `fixed:true` (section 12).

### 7.3 What becomes history

Anything a card or rule declares in `sets`: resolved cards, rule chains, NPC
life events, player acts. Facts under weight 3 are written only if some
`callback` names their type, so texture does not flood the store. Weight bands:
**1 to 2** texture (a stray dog follows you), **3 to 5** local (a debt, a
feud, a burned stall, a marriage), **6 to 7** notable (a death, a lean
harvest, a breach, a rescue), **8 to 9** defining (the bridge is built, the
elder dies).

### 7.4 Expiry and folding

Weight 1 to 2: dropped after 30 game days, kept only in `.count`. Weight 3 to
5: full detail to the end of the next year, then folded into the year count
and legend candidates. Weight 6 to 7: 10 years, then folded; a legend line
survives. Weight 8 to 9: pinned forever as a legend line. A fact stays alive
past its row while an open card needs it, a living person's memory points to
it, or an unfired `callback` card's window is open. Cheats may pin or erase
(section 14).

### 7.5 Size budget (estimates, not measured)

Live facts per world: 96 (~15 KB). Saved lines on facts: 32 (~8 KB). Legends:
25 years x 3 lines, then 1 line per older year, up to 200 years (~12 KB for 60
years, ~30 KB worst). Gossip in transit: 24 packets (~4 KB). **Typical per
world: under 40 KB.** Over cap, evict lowest weight, then oldest; never a
pinned fact or one an open callback needs. Measure real growth first (Q3).

### 7.6 Ties to the 64 and 200 caps

- Only player-touching facts, or weight 6 and up, also append a
  `life_record` milestone (existing kinds `memory`, `loss`, `family`,
  `rumor`, `legacy`, V3). The record stays "a lossy biography"; the fact
  store is the richer source.
- **One change to `life_record.js`:** milestones gain optional `weight` and
  `factId`, and `fold()` keeps the 4 highest-weight highlights per year
  (ties: earlier `at`, then lower id). This fixes C3.
- Chronicle relationship memories (32 each, V4) store the fact id plus short
  text, so one event is not copied whole into many memories.
- The chronicle log (40) and the feed (8) stay display windows, never history.

## 8. Legends and the yearly summary

### 8.1 Format

```
{ world, year, mood: 'lean'|'plenty'|'quiet'|'bitter'|'busy'|'grief',
  lines: [ { fact, text } ],   // up to 3, each <=120 chars
  sources: <fact count> }
```

`mood` is readable as `history.<world>.year.mood` by grammar, E5 and rumor seeds.
The bio reads old years from `life_record.years[].highlights` (V2), which now
holds these lines. There is no second store of year text.

### 8.2 Close-year algorithm (once per active world at year rollover)

1. Collect unfolded facts with `year == Y`.
2. Score: `weight*10 + 8*(player involved) + 5*(birth or death) +
   4*(first of its type in 3 years) + 3*(used by a callback) + 2*(public
   witness) - 4*(each extra fact of the same type this year)`.
3. Sort by score; ties by earlier `at`, then fact id.
4. Take the top 3: at most one per type, at least one player-involved fact if any.
5. Render each with `legend_year` or a per-type symbol on the `text` stream;
   save the resolved line.
6. Set `mood`: `harvest.poor` gives `lean`, deaths `grief`, `crime` facts
   `bitter`, nothing above weight 3 `quiet`.
7. Fold per 7.4, pin weight 8 to 9, update `.count`. If the top fact weighs 6
   or more, make a gossip packet (section 11). Append `life_record` milestones
   for player-touching facts (7.6). Evict if over budget.

Steps 1 to 4 use no randomness; only step 5 draws. Legends are written once at
close, so reloading mid-year never changes one.

## 9. Callbacks

### 9.1 How cards search history

1. **Fact gate (works with today's rules).** `needs: {fact:
   'history.village.stall_burned.age', op:'gte', value: 14*DAY}`.
2. **Cast from history.** `cast.victim = {role:'person', from:{recall:{type:
   'village.stall_burned', field:'who', pick:'latest'}}, needs: alive}`. The
   role fills from the person in the fact if alive and reachable (E2).
3. **Recall query:** `recall({world, type|tags, involving, since, until, vis,
   minWeight, limit})`. Order is fixed: weight descending, recency, then id.

Card field `callback: {to, minAge, maxAge, cooldown, maxUses}`. Defaults:
cooldown 60 game days per fact, 3 uses per fact (unlimited at weight 7+);
`refs` counts uses. Text binds `#$hist.who.name#`, `#$hist.what#`, `#$hist.when#`.

### 9.2 Chain A, months: the stall

1. **Day 3.** `village.collector_visits` casts Corin (spawned carter,
   `indebted`). The player walks past; a rule burns his stall that night.
   Fact `village.stall_burned`, weight 5, `witnessed`, `who:[corin]`.
2. **Day 20.** `village.stall_remembered` needs fact age 14+ days, Corin alive
   in Village, player witnessed or heard. "Name the collector" writes
   `village.collector_named` (weight 4).
3. **Day 70.** `village.collector_returns` (family `threat`) needs that fact,
   Corin still `indebted`, and tension under the E5 cap. The collector comes
   back with friends. Three small cards, each naming one fact, made the chain.

### 9.3 Chain B, years: the lean year

1. **Year 3.** A rule over weather tags and season records
   `village.harvest.poor` (weight 6). The year closes `lean` with the line
   "The year of the early frost."
2. **Year 4.** `village.seed_rationing` needs `...harvest.poor.last_year ==
   year - 1`. The `field_association` offers rationed seed.
3. **Year 9.** Rumor seed `lean_year` unlocks; a traveler in Town repeats it
   as gossip (section 11): "Village folk still count years from the lean one."

### 9.4 Chain C, across a life: the paid debt

1. **Year 0.** The player pays part of Oren's debt. Fact `village.debt_paid`
   (weight 4, `who:[oren]`); Oren's memory stores the fact id.
2. **Year 3.** `npc_lives` births Neri (V8); the adapter writes
   `village.birth`. `village.naming_gift` needs both facts and Oren alive.
3. **Year 25.** Neri, goal `see_town`, leaves for Town carrying the story.
4. **Year 30.** In Town a stranger knows "the one who paid Oren's debt": small
   reputation, or a misattributed claim (section 11). If an heir has taken over
   (`createHeirChronicle`, `chronicle.js:273`), the stranger addresses the
   heir, because the fact lives in the world store, not the dead chronicle.

## 10. Lore guards

### 10.1 Format

`guards: {forbid: {tags, cards, rules, items, words}, mode:
'story'|'inert'|'block' (default 'story'), lifted: [facts that lift a
forbidden tag], override: [cheat tags that skip the guard]}`. `words` feeds the
grammar lint and the optional LLM check. `lifted` lets history change the
world: once `world.village.allows.gunpowder` is set, that tag is no longer
forbidden there.

### 10.2 Village guard draft

Forbidden tags: `gunpowder`, `electric`, `void`, `mana` as common knowledge,
`construct` as ordinary people. Cards: war-scale threats; `rare.anywhere`
portals unless `world.tension >= 60`. Rules: any rule making `undead` from
ordinary death. Items: anything tagged `electric` or `gunpowder`, unless
carried in. Lint words: gun, volt, laser, spell slot, level up. Taboos (4.5)
are separate: a taboo is a social cost, a guard is a fiction limit.

### 10.3 When an outsider brings a forbidden thing: it becomes a story

Uses the E4 `arrival` trigger.

1. **Scan** carried entities and powers for forbidden tags (indexed by tag).
2. **Mark** the entity `anomaly:<tag>`, strength by witness count (hidden and
   unseen is 0).
3. **Fact** `history.<world>.breach.<tag>`, weight 6, `witnessed`.
4. **Deck.** A `breach.<tag>` deck unlocks, small ordinary cards: a child
   asks, someone wants it, the elder asks it be put away, the archive asks to
   borrow it, a theft, a faction reaction from `values` and taboos. E5 counts
   them as `threat` or `opportunity` by each card's own tags.
5. **Resolution, all reachable.** It fades; or it is absorbed (history sets
   the `lifted` fact and the tag becomes a local tag); or the world pushes
   back (confiscation, exile, a local rule). Player, faction or storyteller decides.
6. **Legend.** Usually a line: "The year a traveler carried thunder in a box."

`inert` mode: the thing exists but does nothing here. `block`: the door
refuses. A cheat tagged `lore.override` skips the guard. Guards run at deck
build, spawn, rule registry (world-layer `disables`), grammar lint and arrival.

## 11. Cross-world gossip and legends

**Packet:** `{id: 'gossip:spawn:<factId>:<hop>', fact, from, weight, line
(<=120), hops 0..3, garbled 0..3, carrier, age}`. Made at year close (8.2 step
8) and by weight-6 cards tagged `spreads`.

**Channels:** people crossing doors (E3 `lod`); hubs, which collect and
rebroadcast (hover shows who told you and how reliable they are); the player's
own `famous` tag; items with provenance when inspected elsewhere.

**Distortion by hop** (deterministic, from `text`): hop 1 keeps names; hop 2
turns places into descriptors and may swap a person for another with the same
job (`garbled:2`); hop 3 turns the specific into a type, "a traveler who paid
a debt" (`garbled:3`). Misattribution is callback fuel ("someone claims to be
the one who..."). After 3 hops the packet dies.

**Reception.** The receiving world rewrites foreign terms with `translate`;
`reception` (0 to 9) caps packets per year. Its guard lint runs on the result;
a forbidden word makes the line a mystery ("a thing nobody could name"), not a
drop. Only weight 7+ legends travel, five years after their year. A hub's
`legends.ledger` lists top legends with source world. Worlds with different
time ratios stamp the origin year and convert by the receiver's dial.

## 12. Book-world packs

**Existing door (V12).** The loader reads `private_packs/manifest.json` at
runtime, accepts 404, prefixes every id with the pack id, and is gitignored and
unbundled. E6 reuses it, so there is no new leak surface.

**Four optional files beside `pack.json`:** `lore.tables.json` (section 3 with
real names and places), `lore.grammar.json` (standalone, or `extends:
'grammar:<public id>'`), `lore.canon.json` (fixed facts `[{id, at, who, place,
text, fixed:true, vis, dependsOn}]`) and `lore.divergences.json`. Real names
and prose live only there. The public repo ships the public tables and an empty
lore loader, so a fork without the pack runs original-named worlds on the same
mechanics.

**Fixed canon.** Generated content never writes, expires or contradicts a
`fixed:true` fact. The validator rejects a card whose `sets` names one, and a
generated death before a person's fixed `alive_until`. Generated content fills
gaps only: side characters, weather, texture, canon-consistent rumors. `vis`
still applies, so a canon secret stays `private` until discovered. The canon
dial per world is `strict`, `loose`, `remix` or `swapped` (the north star's
premise dials).

**Divergence.**
```
{ id, label, requires: <meets>, dial: 'divergent'|'remix'|'swapped', tags,
  changes: [ {fact: <canonId>, op: 'remove'|'replace'|'move', value} ] }
```
Offered at world entry or triggered by a player act. Choosing it sets
`canon.diverged.<id>` and marks dependent fixed facts `stale`: they stop
forcing, generated cards fill the gap, and the grammar uses an `after_<id>`
symbol set if the pack defines one. Divergences stack and are saved facts. The
pack file is never edited; a divergence is an overlay in the save.

**Boundaries.** Nothing from a pack enters git, `dist/bundle.js`, test
fixtures or public docs; tests use a synthetic fake pack with invented names.
Saves hold resolved lines that may contain pack text. Saves are private
(AGENTS.md "Safety"), but an export would carry it (Q4). If the pack is missing
on load, saved lines stay readable, cards needing pack data are skipped, and
the world shows as unavailable instead of failing the load.

## 13. Optional LLM prose layer (off by default)

Follows D1 in the main doc: by default no LLM decides mechanics.

- **Text only.** It may rewrite a saved `line` (news, legend, card body,
  rumor). It never touches choices, effects, costs, facts, tags, stream draws,
  callbacks or people's names.
- **Setting:** `lore.prose` is `off` (default), `local` or `api`. No key in the
  repo; a browser player supplies their own.
- **Check before saving:** at most 240 characters; every bound name present;
  no new numbers, names or guard words. Failure falls back silently.
- **Saved once.** `line` and `line_original` both stored. Reload never
  regenerates; a seed replay uses `line_original`.
- **Private packs:** pack text goes to no outside service unless that pack's
  manifest sets `allowExternalText: true` (default false).
- An LLM NPC planner would use `acceptActorProposal` (V13), which is E3's
  concern. The game is fully playable with the layer off; the proof excludes it.

## 14. Options that stay reachable (anything is possible)

- **Forbidden tag arrives:** becomes a story by default; the world `mode`
  decides, and a cheat can skip the guard. A guard says "this costs
  something" and starts a story; it never says no on its own.
- **Lift a guard:** by history, a faction or the player.
- **Canon dial and divergence:** the pack or world card sets the dial;
  divergence is offered, never forced.
- **Fact expiry:** by weight, but cheats can pin ("perfect memory") or erase
  ("forgotten"). **Gossip:** 3 hops, but a cheat can suppress, forge or boost.
- **Legend count and mood:** by algorithm; a storyteller instance can weight tags.
- **Prose layer:** off unless the player turns it on.
- **Whether a card may call back:** per card, the author's choice, never global.

## 15. Smallest proof and build-ready status

**Proof (main doc):** Village tables (names, jobs, goals), one grammar file,
three callback cards (chains A to C). Test: a fact from day 3 is referenced by
a card on day 20 or later. **More checks (proposal):** same seed and 30 days
gives byte-identical saved lines, another seed differs; editing a grammar rule
leaves later `text` draws unchanged; closing a year twice from one save gives
the same legend; a forbidden-tag arrival produces a breach fact and a
`breach.<tag>` card; a fake private pack adds a fixed fact that no generated
card can contradict, and the save still loads without the pack; save growth
measured over 10 simulated years.

**Checklist (drafted here, unaccepted):** [x] world table schema (3);
[x] grammar format and first Village grammar (5, 6); [x] fact naming and
compaction policy (7); [x] legend format (8); [ ] Weibao accepts or edits;
[ ] questions below answered.

## Open questions for Weibao

- **Q1.** Should a notable fact fade from the world once everyone who knew it
  is dead, or stay forever (cheap)? Forget by default, keep forever, or per world.
- **Q2.** Should every world default to `story` for forbidden things, or should
  some default to `block` at the door (a hub that confiscates, a world that
  rejects outside tech)?
- **Q3.** Is about 40 KB of lore per world acceptable in a save, or smaller
  until we measure?
- **Q4.** Saved lines can carry private-pack prose. Is a warning at save
  export enough, or should pack text be saved as references and re-rendered
  on load?
- **Q5.** Should the player see a fact's weight and expiry (a skill, or the
  Notebook), or is history just prose?

## Vocabulary additions

Added to [SHARED_VOCABULARY.md](SHARED_VOCABULARY.md) terms. No existing name
is renamed or redefined.

- **Entity kinds:** `gossip` (a rumor packet), `grammar`, `pack` (a private
  content pack). **IDs:** `fact:spawn:<cardId>:<instanceKey>`,
  `gossip:spawn:<factId>:<hop>`, `grammar:<world>`, `world:<world>` (tables).
- **Fact weight:** integer 1 to 9 (1 to 2 texture, 3 to 5 local, 6 to 7
  notable, 8 to 9 defining). **Visibility:** `public`, `witnessed`, `private`,
  `rumor`.
- **Fact names:** `history.<type>` (boolean), `.count`, `.last_year`, `.age`;
  `person.<id>.history.<type>`; `history.<world>.breach.<tag>`;
  `history.<world>.year.mood`; `canon.<id>`; `canon.diverged.<id>`;
  `world.<world>.allows.<tag>` (a lifted guard).
- **Tags:** `taboo`, `anomaly:<tag>`, `garbled:<n>` (1 to 3), `inert:<world>`,
  `spreads` (card), `lore.override` (cheat), `fixed` (canon fact). World-local
  tags are written `<world>.<name>`, such as `village.chalk`.
- **Streams:** per-line seed `text:<lineSeed>`, drawn once per line from `text`;
  not a saved stream by itself.
- **Grammar:** `#symbol#`, `#symbol.mod#`, `#$role.field#`; modifiers
  `capitalize`, `a`, `s`, `ed`, `poss`, `the`, `lower`, `when`.
- **Card fields:** `callback: {to, minAge, maxAge, cooldown, maxUses}`;
  `cast.<role>.from.recall`. **Milestone fields:** optional `weight`, `factId`.
- **Moods:** `lean`, `plenty`, `quiet`, `bitter`, `busy`, `grief`. **Guard
  modes:** `story`, `inert`, `block`. **Canon dials:** `strict`, `loose`,
  `remix`, `swapped`. **Village seasons:** `thaw`, `growing`, `harvest`, `cold`.
