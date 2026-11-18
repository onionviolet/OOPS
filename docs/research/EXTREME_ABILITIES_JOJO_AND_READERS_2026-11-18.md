# JoJo deep dive and extreme-ability readers (2026-11-18)

Lane `jojo-readers`. Research and proposals, not accepted design. Method: [source deep dive playbook](SOURCE_DEEP_DIVE_PLAYBOOK.md) (modules M1 catalogue, M2 rules to engine, M3 coexistence, M4 wiki cross-check, M5 this synthesis). Source access is in the collector's [report](power-systems/anime-manga/JOJO_AND_EXTREME_POWERS_COLLECTION_2026-11-18.md) (branch `claude/jojo-collector-09cad0`). Evidence labels below: **wiki** = the 2020-02-22 Fandom JoJo dump read by Luna (unchecked), **novel** = a light-novel chunk read by Luna (unchecked), **sheet** = a Stand sheet printed in a novel, parsed without a model, **recall** = general knowledge, not from a held source.

## What was read, and what was not

| Source | State | Coverage claim |
|---|---|---|
| J9 wiki dump (2,439 article pages in the snapshot) | Read: 172 Stand infobox pages, the Ripple and Spin pages, the Stand, Stand Types and Stand Parameters pages, the gameplay sections of four game pages | The snapshot stops in mid-Part 8 and has no Stone Ocean or later additions; 19 Stand pages carry no letters. Model readings are unchecked |
| J1 *Jorge Joestar*, J2 *Purple Haze Feedback*, J3 *Purple Smoke Distortion*, J4 *Over Heaven*, J5 *The Book* | Read by Luna in 49 chunks of about 12,000 words (about 445k words) and by Haiku for recall | Every chunk read once by each model; no consecutive human reading. J2 and J3 are two translations of one novel |
| J6 compilation | Not read. The collector flagged overlap with J1 to J5; not compared here. It has no Stand sheets, which J3 does | Open |
| J8 manga | Not downloaded when this ran (governor window opens 18:00) | Open |
| J10 jojowiki.com | Cloudflare closed it; not retried | Open |
| J11 game mechanics | Only the wiki dump's game pages (All Star Battle, Eyes of Heaven, Heritage for the Future, Last Survivor). No move lists, frame data or fan "X beats Y" threads were held | Open: fan interaction reasoning below is **recall** | <!-- slip-ok: states what a source shows or what a count covers, not a design rule -->

## A. How JoJo represents abilities

### In prose (novels)

1. **A Stand sheet after the chapter.** *Purple Smoke Distortion* ends seven chapters with a sheet: name, user, six letters, an ability gloss and a legend (A amazing to E terrible). Some letters carry a footnote, for example a duration ("drug effects last about half a month") or "depends on target" in place of a speed. Letters can show a change over the story ("C to E", "B to ?"). So the official shape is six letters plus a free-text gloss, and any letter can be a note instead. (sheet; the wiki's letters for the four of these Stands that it holds match the sheets)
2. **The rule is revealed by someone saying it, more often than by showing it.** Across 277 ability readings in the five novels: character explains 138, scene demonstrates 82, narrator explains 48, a character deduces it 6, implied 3. For Stands alone: explained by a character 68, demonstrated 51, narrator 26. The telling is usually an in-world informant, a villain's boast, or an ally's report, then a fight tests it. (novel)
3. **A stated limit comes early.** Dolly Dagger's "only 70 percent" is first said by a bystander scolding the user, before any fight, and the sheet repeats it. Stating the cost first makes the later scene a puzzle about the condition, not a surprise. (novel, checked in the text) <!-- slip-ok: states what a source shows or what a count covers, not a design rule -->
4. **The twist overturns the listener's assumption about what the rule applies to.** Manic Depression is described by an informant as "a power to make drugs"; the fighter running him down reasons it "has no power itself", and the scene punishes that reading. The rule did not change, the reader's frame of it did. (novel, checked in the text)
5. **Conceptual abilities are told, not shown.** The "Beyond" of *Jorge Joestar* (a role guaranteed by something outside the world), the story's thirty-six universe loops and Kira's Bites the Dust rewinding an hour are all reported through a character's explanation, usually as a chain of reasoning, with only the consequence on screen. (novel) <!-- slip-ok: states what a source shows or what a count covers, not a design rule -->

### In games (wiki game pages)

- *Heritage for the Future* turns "a Stand exists" into a second body: a Stand button toggles it, a third meter (Stand Gauge) drains when it is hit, and an empty gauge is a stun (Stand Crash). Damage to the Stand mirrors onto the user, and the user takes double if the Stand is far away. Some "passive" Stand users bring bespoke mechanics.
- *All Star Battle* gives each fighter one Style button and a character-specific icon or gauge above the shared super meter: Hamon charges that meter through Ripple Breath, Harvest shows Offensive or Defensive formation, Sex Pistols shows which bullets are free, Pucci shows progress toward C-Moon. A rule becomes the one extra gauge on the character.
- *Eyes of Heaven* turns the signature rule into a cooldown skill plus one Style Action per fighter.
- *Last Survivor* shortens time stop to a window in a 20-player match.
- Pattern: a conditional rule becomes a visible resource or state indicator; a world-bending rule becomes a short, cooldown-bound window or a cutscene special. The rule is kept only where the game can display its condition.

### Fan "how would X beat Y" (recall, no held source)

Recall, not evidence: debate threads resolve a match in a fixed order. First the rule's reach (stats, range letters in metres, whether the rule needs a touch, a sight line or a spoken word). Then which rule is already in force when the fight starts. Then whether the user, not the Stand, can be reached, since a Stand's damage mirrors onto its user. This matches how the sheets are written (condition first, limits second), but a held source should replace it.

### The stat letters as a data shape

Six stats: destructive power, speed, range, durability (staying power), precision, development potential. Grades A to E (A excellent, C ordinary human, E very weak), plus Infinite and None. Range has metre bands (A over 100 m, B dozens of metres, C about 10 m, D a couple of metres, E two metres or less). Potential falls as the Stand matures (Star Platinum A in Part 3, C later), so a letter is a per-time value, not a constant. Of the 172 wiki Stands, 153 carry letters: durability is A for 82, precision is E for 55, and "Null" appears 18 times for power. Sidecar `docs/coverage/jojo_power_labels.json` holds the letters per row. Purple Smoke Distortion's own sheet shows three of its letters as changes (range C to E, precision E to C, potential B to ?).

Proposed default: store each letter as a band on an existing quantity (power as force, speed, range as the `area`/`line` reach tier, durability as protection, precision as target selectivity) and keep the note for the exceptions. Dial: letters are a display layer over the rule, never the rule itself (the time and concept Stands in the dump carry ordinary letters, so a letter cannot say how far a rule reaches).

## B. Mechanism shapes

Counts are from the wiki tier, Luna-read, unchecked (200 readings: 172 Stands, 28 Ripple technique lines, the Ripple and Spin base rows; the Spin page lists its effects as unnamed bullets, so Spin has only its base row). Full rows: `docs/coverage/jojo_powers.jsonl`.

| Shape | Count | What it is | Examples (wiki) |
|---|---:|---|---|
| transformation | 45 | changes the form of a thing or body | |
| summon-or-control | 36 | makes or steers creatures, objects, people | |
| conditional trigger | 35 | fires when a stated condition holds (touch, sight, a spoken word, being asked) | |
| direct force | 23 | plain strength, damage, speed | |
| rule-imposing | 17 | binds a target by a rule | Heaven's Door, Jail House Lock, Sugar Mountain, Rainy Day Dream Away, Surface, Under World |
| sense or utility | 16 | detection, concealment, support | |
| auto-acting | 11 | runs without the user, or independently | Black Sabbath, Cheap Trick, Notorious B.I.G, Survivor, Doobie Wah! |
| conceptual | 6 | acts on a fact, law or category | C-Moon (gravity), Gold Experience Requiem (return to zero), Tohth, The World Over Heaven, Dark Mirage, Cinderella |
| time | 6 | changes the time a holder or target lives in | The World, King Crimson, Made in Heaven, Mandom |
| resource-gated | 5 | works through a stock or breath that runs out | Ball Breaker, Tusk, Public Image Limited |

The list is one Stand, one best-fit shape. Hamon and Spin sit under resource-gated and direct force (breath and blood flow gate Hamon, a self-feeding rotation gates Spin); they impose no rule on others, with the Ripple Hypnosis technique a small exception.

Shape notes for the engine:

- **Rule-imposing**: the rule is a stored object (what it applies to, the condition, the penalty) that stays after the Stand leaves the scene. Rainy Day Dream Away locks a held belief, so what the target doubts becomes true. The novel conceptual cases (a role guaranteed by Beyond, Penelope's locked rooms with a rule the clown enforces) are the same shape at world scale.
- **Conditional trigger**: Bites the Dust fires when someone asks about the user; Dolly Dagger fires when a target is in the blade. The condition is the counterplay, so it must be readable by the other side (a bystander states it in the novels).
- **Auto-acting**: the Stand keeps acting after the user stops (Black Sabbath, Survivor). The engine needs a thing that acts on a standing order with the user's control set to none.
- **Time**: two different laws hide here. Time stop and erase make the actor exempt from a flow others live in. A loop (the novels' thirty-six universe loops, Bites the Dust rewinding one hour) keeps one memory across a reset; the novels settle who remembers by a stated rule (Jorge keeps memories because he is inside Cars).
- **Conceptual**: C-Moon's gravity flip and Requiem's "return to zero" act on a relation rather than a thing. They need an object that is a law and a verb that edits it.

## C. What the effect grammar can and cannot say

The grammar (`src/effect_grammar.js`) has 12 verbs, objects that include `law` and `time`, targets `bound` and `marked`, and time `triggered`. It already covers: direct force (add or remove force), the form-changing Stands (`transform form`), senses and concealment, the resource-gated Hamon (an `add light` or `add force` sentence with a breath carrier), time stop as `alter time` on `area` with a self exemption (needs the exemption stated in limits), and a stored rule as `alter law bound sustained`.

It cannot say, from these readings:

1. A **second body with its own stats and position**, linked to the user by mirrored damage and a doubled-damage-at-range rule (Heritage for the Future's whole mechanic). Existing slug: `projection-body`.
2. A **condition predicate** on a triggered effect ("when anyone asks about the user", "when the target is in the blade"). `triggered` names the timing, not the test. New work, not a new slug: a `when` field with a small set of tests (touch, sight, named, asked-about).
3. A **loop that keeps one holder's memory** across a reset (existing slugs `time-loop`, `death-checkpoint-rewind`; the novels add who keeps memory and what carries over).
4. **Stand versus Stand-ability interaction** (a Stand can only be affected by another, a rule overwritten by a stronger one): `power-interaction`. <!-- slip-ok: states what a source shows or what a count covers, not a design rule -->
5. A **law that edits a relation** (gravity flipped, a result returned to zero, a role guaranteed): `concept-law`, `divination-fate`.
6. **Stat letters** as a band set. These fit a quantity band, not a verb sentence.

The Luna mapping of the wiki rows to the canonical blocked slugs (200 readings) points at: form-transformation 27, creature-control 15, area-field 12, conceal-or-sense 10, portal-space 8, body-form 7, mind-state 7, body-code-decay 6, containment-rule 5, object-surface 5, concept-law 5, time-manipulation 5. Three rows sit on `effect-unknown` and one on `place-release`; every other row mapped to an existing slug. No new slug is proposed from the Stands.

## D. A JoJo-style world beside the protagonist

Proposal, adjustable. Default: the world has a rare awakening event (an arrow, a fruit, a near-death) that gives one ordinary person one Stand, which only other users can see. Dials: how rare (one in a town, one in a hundred), whether Stands persist after the user dies (a rule per world), whether a protagonist's non-Stand power (this world's own system) can touch a Stand at all. Reason: many JoJo plots depend on the same visibility gate, so it ties a hidden second layer of the world to the player's discovery.

- The protagonist's start options: a Stand-less outsider noticing odd local incidents; a user whose Stand is chosen by the player's temperament; a Hamon or Spin trainee, whose power is a resource skill, not a rule.
- The engine hook is a **known / guessed / unknown** state per Stand rule per observer, since the novels spend most of their pages moving a rule from "claimed" to "tested" to "exploited". A fight is a puzzle about that state.
- A Stand is a character with a condition list; a time or conceptual Stand is a world event, not a stat line, and appears as a named incident.
- Pitfalls: a rule with no stated condition is unfair to read; Potential falling over time means a Stand's growth is a one-way dial; the Heritage-for-the-Future "damage mirrors to the user" gives the counter without any new rule.

## E. Reader pass on the extreme-ability books (Part B)

Questions per chunk: which abilities have a mechanism shown or stated, of the kinds stand, hamon, spin, power-interaction, power-transfer, time-loop, wish, vow, conceptual, rule-imposing, absorb-or-copy, cheat-or-override, other. Luna for the fields, Haiku for recall of names.

| Work | Chunks | Luna readings (distinct names) | Haiku names | Haiku names also in Luna | Rows written |
|---|---:|---:|---:|---:|---|
| JoJo novels (J1 to J5) | 49 | 185 | 459 | 82 | 172 new rows in `jojo_powers.jsonl` (376 rows in all) and 27 readings merged into wiki rows |
| A Certain Magical Index (22 vols, New Testament 1-5, 7, 8, 10, 11) | 210 | 862 | 2,368 | 239 | `toaru_powers.jsonl` (with Railgun) |
| Railgun (novel, SS1 to SS3) | 29 | 100 | 258 | 32 | in `toaru_powers.jsonl` (1,071 rows together) |
| Wish Upon the Stars 1 to 8 | 97 | 523 | 1,445 | 218 | `wus_powers.jsonl` (648) |
| Mother of Learning | 105 | 570 | 1,533 | 210 | `mol_mechanisms.json`: 53 matched to existing `mother_of_learning_powers` rows by name, 610 unmatched readings |
| Ward | 232 | 1,100 | 3,728 | 246 | `ward_powers.jsonl` (1,217) |

Reading the table: Haiku, asked only for names, lists three to five times as many things as Luna, asked for mechanisms. The overlap is small by design (Haiku lists any named power, Luna only those with a mechanism in the lines). Haiku-only names that two or more chunks gave became name-only `catalogued` rows (14, 115, 7, 125, 93 and 117 per work, in the order of the table). The "other" kind is the largest bucket everywhere (563 of 862 for the Index), so about two thirds of the rows are ordinary named powers with a stated effect and no special mechanism; the mechanism kinds are the minority below.

| Kind (Luna distinct readings) | JoJo | Index | Railgun | WUS | MoL | Ward |
|---|---:|---:|---:|---:|---:|---:|
| power-interaction | 7 | 123 | 11 | 95 | 75 | 191 |
| rule-imposing | 8 | 51 | 1 | 35 | 33 | 38 |
| conceptual | 7 | 26 | 3 | 18 | 8 | 15 |
| power-transfer | 7 | 21 | 0 | 33 | 13 | 47 |
| absorb-or-copy | 5 | 26 | 0 | 12 | 6 | 21 |
| cheat-or-override | 0 | 30 | 5 | 12 | 11 | 22 |
| time-loop | 9 | 0 | 0 | 1 | 23 | 14 |
| wish | 0 | 3 | 2 | 35 | 0 | 0 |
| vow | 0 | 2 | 0 | 6 | 8 | 1 |

Blocked slugs on the rows: `power-interaction` (169 in the Index, 107 WUS, 213 Ward) is the main block; `concept-law` is next (81, 53, 53); `power-transfer` (47, 45, 68); `time-loop` (14 in Ward, 1 in WUS). Wish rows carry `blocked:wish-grant` with the row's `reason` (no canonical slug names a wish a system grants); the canonical map in `docs/coverage/blocked_slugs.json` is unchanged.

### Mechanism findings (evidence: novel, Luna, unchecked unless said)

- **A wish is priced and capped by the grantor's own reach.** In *Wish Upon the Stars*, a Beginner Wish grants only what the candidate could achieve alone, with their current stats, within three days; an Intermediate Wish grants a feasible wish for proper compensation, up to six a day; compensation can be stat points moved from payer to granter (the healing trade). So a wish is a transfer with a feasibility bound, not a free edit. Grammar fit: `bind` plus a limit on reach, with a cost carrier; the feasibility test (what the granter could do alone in a window) is new. <!-- slip-ok: states what a source shows or what a count covers, not a design rule -->
- **An override that cancels a power on touch is a power-interaction rule, not a stat.** Imagine Breaker erases supernatural phenomena on contact and cuts Mikoto's magnetic pull when it reaches him; the Index's personal reality says an esper can only make occur an outcome already possible in the situation (the limit is stated, so a "possible outcomes" set is the model). Grammar fit: `block` or `end` on a `working`, with the touch condition; the override has to name what it ignores. <!-- slip-ok: states what a source shows or what a count covers, not a design rule -->
- **A conceptual power acts on a category others share.** The Archetype Controller creates, spreads or destroys common categories and understandings; Agitate Halation gives a person a role that pulls others into collisions; Ars Magna makes reality follow the user's thoughts and also follows his doubts. Same shape as JoJo's Beyond. Grammar fit: `alter law`; the doubt case needs an effect whose strength depends on the holder's state.
- **Time-loop laws come with a memory rule.** Mother of Learning: the marker lets one person stay aware across restarts; a blended soul gave Zorian a working copy; a theory of a damaged marker is flagged as speculation. Black Rooms speed time inside a sealed area (and sealing it eases stress on the boundary); the cubes make a slowed pocket to store an attack. Ward: Eidolon reverses time on a building; Keelee ages backward each use and recovers only by living undistorted time. Loop-type rows need three fields the grammar lacks: who keeps memory, what is reset, what carries forward. <!-- slip-ok: states what a source shows or what a count covers, not a design rule -->
- **A vow is a standing restriction that powers the holder.** A Magician's self-imposed purpose gives them explosive propulsion; Kanzaki's magic name Salvare000 is a commitment never to kill. The Index states this as a trait, not a spell; so a vow row is a held restriction with an enable, which `vow-cost` can carry. <!-- slip-ok: states what a source shows or what a count covers, not a design rule -->
- **Absorb and copy are cheat-shaped when the target is a power.** Mother of Learning's absorption cube draws specific spells onto itself and stops them; the Dark May Project plants part of a Level 5 thought pattern into other people, raising power and steadying personality. These split into power-interaction (block and take) and power-transfer (give).

### Spend and runs

- The first Luna batches (OpenAI) sat queued for over three hours with almost no progress and the connection dropped several times; the JoJo, Toaru, Railgun, WUS, MoL and Ward Luna passes were rerun synchronously (about double the batch rate) and the queued batches then cancelled. Haiku batches (Anthropic) finished in under half an hour; 10 percent of the first Haiku run hit the output cap and were rerun with a larger cap.
- Recorded spend from the replies files: Luna about $1.74 (JoJo wiki tier $0.06 included), Haiku about $0.95, total $2.69. That figure misses the 110 Ward requests the cancelled OpenAI batch had completed (about $0.12 at batch rate) and the roughly 70 first-run Haiku calls that hit the output cap (their error entries carry no usage). Total about $3, under the $10 lane cap. The six queued OpenAI batches were cancelled once the synchronous reruns covered them. Keys came from the Keychain into the process only. <!-- slip-ok: describes how this run handled keys, not a design rule -->
- Raw model replies and chunk text are in the gitignored private folder `docs/research/novels/jojo-collection-2026-11-18/readers/` (main checkout). The committed rows are paraphrases.

## F. What to feed the design lane

1. Take the five shapes above as row kinds; the rule-imposing and conditional-trigger shapes need a `when` test and a stored rule object.
2. A wish, a vow and a time-loop are three different mechanisms in these books (priced transfer with a reach bound, standing restriction that powers, memory-keeping reset); do not collapse them.
3. Default: use the stat letters as a display band over a rule. Dial: how much of the band a world shows. Reason: the strongest rules in the dump score no better than brawlers on letters.
4. The "stand" kind on Ward (76) and Index (17) readings is noise from the shared schema, and one ability can appear as several rows because the model split it finely (for example Imagine Breaker and its cancellation of one attack). Mother of Learning was handled as an overlay, not an edit: `mol_mechanisms.json` holds 53 readings matched by name to existing `mother_of_learning_powers` rows and 610 unmatched, because that ledger is generated elsewhere and its validator rejects extra fields. Treat every row in the new ledgers as a lead: model tier, unchecked, no case.


## Open items

- Manga text for J8 once the governor has downloaded and OCR'd it: tests the wiki's Stand readings and gives Stand names and rules the 2020 snapshot lacks.
- A held source for game move lists and fan interaction reasoning, so section A's recall paragraph can be replaced.
- J6 against J1 to J5 overlap.
- `docs/coverage/jojo_powers.jsonl` labels and the new ledgers are model-tier and unchecked; none of their rows has a case.
