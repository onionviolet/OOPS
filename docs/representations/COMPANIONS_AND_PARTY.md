# Companions, party and pets

Owner doc for the companions representation (lane `bk-party`, book UI wave, F4). Created 2026-10-30.
Everything here is a **proposal** (AD32) until Weibao accepts it by name, and every choice is the
current best, open to refactor or replacement with a reason (AD45). Sources: the
[companions palette](../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md), the
[round 2 brief](../gm/dispatch/ui-refactor-wave-2026-10-29/ROUND2_BRIEF.md), the merged
[relationship web](RELATIONSHIP_WEB.md) (bond stages), UR61/UR74/UR79, CX2.

## Orientation: what already exists (CX2, UR79)

| Piece | Where | What it gives |
|---|---|---|
| Roster panel "Companions" | `src/companion_roster.js` | One row per met companion (Lio, plus met generated people), bond level, five bond rites with a temperament-preferred one, scene memory (cap 5), one open wish each, leaving and coming back. Saved in the `companions` slice (schema 2) |
| Wishes and leaving | `src/companion_wishes.js` | Profiles `free` (leaves after an ignored wish unless bond reaches 6) and `bound` (Lio: voices wishes, never leaves) |
| Party panel | `src/party_ui.js`, `src/party_content.js`, `src/party_battle.js` | Meet Lio, ask, join the Mara road contest for 1 coin, Lio braces and takes a blow for you, release, rest and re-rig |
| Lio's bench work | `src/party_partner_content.js` | LP6 shared packing batches |
| Primitives | `figure.js`, `meter_bar.js`, `scene_card.js`, `observer_view.js` | Reused, none added |

Gaps found: the roster showed `bond 7` (a number with no meaning, UR61); the party panel and the
roster never mentioned each other; the party panel offered no choice about how Lio fights; pets,
familiars and mounts have no runtime at all.

**Dependency gap (record, do not hide).** The brief names `src/tempo_allies.js`. It exists only as
**uncommitted work in the primary checkout** (with `tests/tempo_allies.test.js` and edits to
`tempo_fight*.js`), owned by the fights line (`p4-fights`). It is on no branch, so this lane could
not consume its API. The slice below consumes the **braced party contest** (`party_battle.js`),
which is merged and is the contest a fresh life reaches. When `tempo_allies` lands, the stance
should feed its ally policy (P5, CHOICES #7). Nothing here builds P5.

## Round 1

### Player sentence (PRF2)

"Lio is a good-natured porter who fights beside you when you ask. You are **Familiar** with him, two
more bonds from **Relied on**. He wishes you'd share a meal once more. In a contest he braces at
once; you can ask him to hold until you're hurt, so he keeps his strength."

### What the player can know (PRF4)

Their stage (from your own bond), their open wish, their body (health and stamina, which you can
see), what they are doing, and the stance you set. Never read: temperament until learned (already
gated), private thoughts, a companion's hidden traits. A pet's mood would be read from behaviour
you saw (fed, hungry, restless), not a number.

### Representations weighed

| Code | Form | Good at | Weak at |
|---|---|---|---|
| CR1 | **Roster cards with a stage bar** (chosen) | Who is with me, how close, what they want, one glance each | Many companions (past ~8) need sorting |
| CR2 | Party formation board (front, back, flank) | Darkest Dungeon-style positions | Needs real positions in fights; none exist yet |
| CR3 | Box / storage grid (Pokémon) | Dozens of creatures | Wrong for a handful of bonded companions |
| CR4 | Chat-log banter feed | Personality, warmth | Prose-heavy; belongs to Talk |
| CR5 | Confidant ladder (Persona) | A visible track with an unlock at each rung | Same job as the stage bar |

**Default CR1**, the existing roster panel, with the shared relationship stage ladder drawn by the
shared `meter_bar` track. **Dial:** a larger cast (guild, caravan) adds sorting and a CR2 board when
fights give positions; a world with no named stage words swaps the words, never the evidence rule.

## Round 2

1. **Other games** (known from play unless marked inferred; patterns only, no content copied).
   - *Dragon Age:* approval per companion, banter, gifts. Idea taken: a companion has wishes and
     reacts to what you did; we already have wishes, now words on the bond.
   - *Pokémon:* party plus box, nature, friendship hearts. Idea: a small active party and a larger
     "elsewhere" list. Not needed at one companion; the roster already splits "here" and "away".
   - *Stardew Valley:* pet and horse you care for daily; hearts are visible. Idea: care as a cheap
     daily act that moves a visible bond. Pets are the LATER slice below.
   - *Darkest Dungeon:* party positions, stress. Idea: strain visible before it breaks (inferred use:
     "needs care" chip when a wish is old). Positions wait for fights with positions.
   - *Monster Hunter (palico):* a companion with gear and set orders. Idea: a **small order menu**
     (a stance), not micro-control. This is the chosen consumer.
   - *RimWorld:* animal bonds from training and shared time. Idea: bond grows from acts, and a
     bonded animal behaves differently; fits pets.
   - *Persona:* confidant ranks with named rungs and what raises them. Idea: the bar says what moves
     it next. Chosen.
2. **Fresh-player test.** Terms needing knowledge: "bond rite", "wish", "stance". Fixes made: the
   number became words (Met to Close) with "N more bond to the next stage"; Lio's row now says how he
   fights ("in a contest he braces at once"). Open: the rites row is five bare buttons; a one-line
   "what is a rite" hint is LATER.
3. **Space and density at 1920x1080.** Glance = one line plus a bar per companion (frequent look);
   rites, memory, wish detail stay inside the card (one click). The party panel stays where the
   action is (Village location actions); the roster stays in the main panel set. Split rather than
   merge: "who is with me" (roster) and "do something now" (party panel) answer different questions.
4. **Bars.** One bar: the bond stage, discrete track, words beside it (UR37), same ladder and words
   as People cards (UR74). Needs-care chip: LATER.
5. **Pop-out / Electron.** Not earned yet; a roster pop-out is worth it only with 4+ companions. No
   badge: a new stage is a Reports line (R2.14 of the time owner), not an interruption.
6. **Cheats / insight.** Default honest seat reads the stage from your own bond. An insight view could
   add a marked second fill ("their regard") and reveal hidden temperament. Same convention as the
   relationship bar; not built.
7. **Visual style.** Default Luminous Gothic through meter tokens. Alternative: a paper-and-ink
   "travelling party" sheet with a hand-written line per companion. Not built; the stage words work in
   both.
8. **Use what we have.** `meter_bar` and the relationship ladder reused; `figure.js` and
   `scene_card.js` not needed at this scale (one bar, one list); `observer_view` unaffected because
   the roster reads only the player's own bond and visible body. No new primitive.
9. **Unconventional.** A companion who is *seen* acting on your stance in the world's log
   ("Lio keeps his feet back and watches your guard"). The stance line in the fight log is the first
   step; ambient lines on the road are later.
10. **Audit gaps.** Other seats: the roster is hidden until someone is met (existing). Empty state
    exists. Persistence: stance is a fact in the saved expansion state, no new slice, so older saves
    simply have no stance and read as the default. Accessibility: bar has `role=progressbar`, words
    beside colour. Performance: one bar per row, rows already memoised per minute.
11. **Prior implementations / abstraction.** Underlying abstraction: a *bond track with a next-step
    note* (the relationship bar) plus an *order with a default* (a stance). Both are reused by any
    future companion, pet or mount.
12. **Open for improvement.** The thresholds `[0,1,3,6,10]` are a draft (6 is the `free` profile hold
    level, so "Relied on" means "will not walk away over an unanswered wish"). Likely next refactor:
    derive the stage from the same evidence as People cards when companions get cast records.
13. **Flourish.** Reuse the stage-up glow on the bar when a wish is granted (settled subject, effects
    off safe). Not built.
14. **Reports and center.** Reports lines proposed: "Lio is now Relied on", "Lio's wish was granted",
    "Lio went back to the road" (the last two exist as notes). Center layout: roster stays in the
    side panel; fights show the stance in the log.
15. **Ability flourish.** Not applicable.
16. **Fold into existing UI.** The stance is two ordinary party commands, so they appear in the
    existing party panel without a new surface. The roster shows the current stance on Lio's row, so
    the two panels agree.
17. **Later volumes and worlds.** Data-driven: stage words are a per-world dial, stance ids map to
    command ids, a new companion adds a row not code. Checked: no canon detail is needed here; book
    companions arrive as cast records and take the same bond track. Open: pets and mounts.
18. **Form per part.** Bar (one value at a glance), cards (things you act on), list (who). Rings and
    boards fit worse: one to eight companions, no space.
19. **Levels and depth.** Five stages with the evidence that moves each; stance is the second depth
    layer (what the bond lets you ask). Gating stances by stage ("press the attack" at Relied on) is a
    LATER dial; today both stances are open once met, because Lio is `bound` and asked for nothing.
20. **Semantic roles.** The bar kind is `bond`; the stance is `order`; wishes are `want`. A motif pack
    could draw a bond as a thread (cultivation world) or a ledger tick (merchant world) without
    touching the adapter.
21. **Drafts.** The roster-as-list is a draft. If fights gain formation, CR2 replaces the list as the
    default for parties of 3 or more.

## Pets, familiars and mounts (proposal, not built)

Palette A1-A4 and G apply. The shared model: **a companion is an actor with a body, wants and a link.**
Pets do not speak, so the roster row shows a *condition word* instead of a wish line.
- **Pet (Stardew, RimWorld):** care acts (feed, groom, walk) on the same rite list shape, `BOND_RITES`
  gaining pet verbs by data. Bond stage words are the same ladder. Condition word from hunger and
  last-cared time: "content", "hungry", "restless". Neglect lowers condition, not the stage, so
  history and strain stay separate facts.
- **Familiar:** same row, with a shared-sense line (what it saw) once the world allows it.
- **Mount:** a roster row whose consumer is travel (speed, load) rather than a fight stance.
First slice for pets: one care act, one condition word, one consumer (a flat travel or comfort bonus).
Needs an owner for animals in the simulation (`simulation.js`, not this lane's file).

## The slice built

| Part | What | Where |
|---|---|---|
| Bond stage bar | Roster rows draw "Bond: Familiar" on the shared ladder with the next-step note | `src/companion_stage.js`, `src/companion_roster.js` |
| Stance | Two commands in the party panel: "Lio braces at once" (default) and "Lio holds his guard until you are hurt". Stored as the actor fact `party.stance` | `src/party_content.js` |
| Consumer | In the braced contest, a "hold" Lio skips the guard while you are above 60% health, keeping his stamina and effort, and braces once you are hurt | `src/party_battle.js` |
| Roster agrees | Lio's row says how he fights | `src/companion_roster.js` |

How a fresh life reaches it: enrol, meet Lio from the Village (earned), set a stance in the party
panel, start the agreed Mara contest, and watch Lio's effort in the fight and the roster.

Tests: `tests/companion_stage.test.js`, a stance test in `tests/party_battle.test.js`.
Floor status and browser evidence: see the ledger below.

## Round ledger

**ACT NOW (done):** stage words and bar on the roster; stance commands, consumer and roster line;
dependency gap on `tempo_allies` recorded.

**ACCOUNT FOR NOW:** when `tempo_allies` is committed, route the stance into its ally policy and
decide whether "hold" becomes a named policy there (P5, fights line).

**LATER / DELEGATE:**
- Pet care slice. Sonnet, medium. Done: one care act moves a pet bond, a condition word shows, a
  consumer reads it; save, reload and import exercised.
- Stage-gated stances and a "needs care" chip. Sonnet, small. Done: test per gate.
- Reports lines for stage-up and granted wish. Sonnet, small, with the time owner.
- Formation board (CR2) once fights have positions. Opus design, then Sonnet.
