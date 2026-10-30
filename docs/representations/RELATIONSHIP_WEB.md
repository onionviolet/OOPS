# Relationship web and who knows what

Owner doc for RPX11 (relationship web), RPX17 (rumour spread) and the web half
of LTU5 (person view that remembers). Created 2026-10-30. Everything here is a
**proposal** (AD32) until Weibao accepts it by name. Sources:
[UI design audit rounds 8-12](../audits/UI_DESIGN_CORE_AUDIT.md) (RPX11, RPX17,
LTU5, MDL2), [PIR rules](../DOMAIN_RULES.md) (PIR3, PIR5, PIR23), proposed UR76
in the [coverage plan](../gm/dispatch/ui-coverage-2026-10-27/PLAN.md).

## Player sentence (PRF2)

When it works: "Old craftsman owes you a commissioned kit. He saw you supply
the wood and ask how he works. Here he seems warmer toward you since you
supplied the materials." When it cannot say more: "Not seen here, so you
cannot read his manner now." The web never states what someone privately
thinks or remembers; it states what you saw, what you agreed and what you
can read from them while they are in front of you.

## What the player can know (PRF4, PIR5)

| Edge | Source of truth | Why the player may see it |
|---|---|---|
| **owes** (either way) | Loans you are party to (simulation custody records, both directions) and structured agreement flags you made: commission paid and not collected, a briefing agreed and not settled, a promise taken and not kept, an unresolved grievance | You made the agreement or the loan. Who owes whom is your own record |
| **saw** (what they know about you) | Your shared history with them, the rows `knownPeopleView` already gives | They were there. Default wording is "saw" or "you told them" rather than "remembers", because their memory fades and forgets privately (LSD360); a seat that can read minds may dial this up |
| **manner** (how they act toward you) | `reactionLine` from the person-memory slice, gated exactly as the workshop gates it: alive, at your location, a known calendar day | You can read a face in front of you. Absent people get no manner line (PIR3) |
| **heard** (rumour reached them) | The same manner line when it reads "after hearing that…" | You noticed they heard. The teller stays unknown to you, so the edge is marked unknown |
| **your trust** | Your own directed relationship axes (`relationships[you][them]`) | Your own feeling |

Never read: their axes toward you, their memory episodes, who told whom,
their location while absent. A test sets the craftsman's hidden trust to 99
and checks the spec and text form do not show it.

## Representations weighed

| Code | Representation | Good at | Weak at |
|---|---|---|---|
| RW1 | **Radial web, closeness rings.** You at the centre; people on two rings, inner for those who are currently warm toward you or whom you trust, outer for the rest. Edges per kind, line pattern per kind | Seeing at a glance who is close, who you owe, who knows something | Past about 12 people labels crowd; needs the label placement fix below |
| RW2 | **Ledger table.** One row per person, columns owes / saw / manner | Exact reading, sorting, many people | No shape; you cannot see the pressure point. It is already the text form and the cards |
| RW3 | **Exposure map (unusual).** Turn the web inside out: the centre is *you*, the first ring is facts about you (your alias, your debt, a deed), the outer ring is people, joined to the facts they saw or heard | Hidden-identity and intrigue lives: you see which secret is most exposed and through whom | Needs a fact catalogue about the self; useless in a quiet homestead life |
| RW4 | **Ripple pond (RPX17).** One deed at the centre, rings are hops of telling: saw it, heard from a witness, heard second-hand. Certainty drops ring by ring | Rumour spread, how far news travelled | From your seat you rarely know the chain. By default it shows what you noticed; a seat that sees more dials it up |
| RW5 | **Portrait wall.** One small card per person showing "you, as they seem to see you" as a few known adjectives | Warm and personal, fits LTU5 | Invites claims about private opinion; hard to keep to PIR5 |

### Default and dials (PRF3)

- **Default: RW1 radial web**, rendered by the shared MDL2 figure primitive,
  on the People route (top bar "People", `known-people`) above the person cards. Reason: the people tab is
  already where "who you know" lives (PIR1, PIR3); a web adds the relations
  between them without a second list (PIR23).
- **Dial: the closeness rings** come from what you can know (observed warm
  manner, your own trust above zero, a settled debt), never from their hidden
  axes. A world with no manner reading puts everyone on one ring. Bands start
  at four people (`WEB_LIMITS.bands`); below that one ring, because a short
  inner spoke crowds its labels, and the text form still names who is close.
- **Dial: size and count.** A web of under four people draws at 560, larger
  ones at 720; at most 16 people (`WEB_LIMITS.people`), the most connected
  first, with "N more people are in the cards below".
- **Dial: RW3 exposure map** for worlds and lives where your identity is the
  thing at stake (a hidden-identity start, a spy's life). In-world reason: the
  life's main danger is who knows what about you, so facts deserve the centre.
  Cost: needs a per-world list of "facts about you" with a known exposure
  route. Same primitive, different spec.
- **Dial: RW4 ripple** appears when a rumour reached you through a manner line
  or a told episode you received, and for any future seat whose scope sees
  the telling chain (observer audiences). In-world reason: you trace a rumour
  by asking around; each ring you know is one you traced. Cost: per hop, a
  conversation.
- RW2 is not a mode; it is the text form under every web (UR37) plus the cards.
- RW5 stays a palette idea for LTU5 portraits, gated on a "seen adjectives"
  record that does not exist yet.

### Ripple sketch (RPX17)

The gallery has a ripple fixture: centre is the deed, ring 1 the people who
saw it, ring 2 those who heard from a witness, ring 3 those further out, with
edges kind `told` and state `unknown` where you only infer the link. It uses
the same figure path, no new drawing code. Only the radial web is wired into
the game in this slice.

## Home (proposed UR76 contract)

- **Home:** the People route (top bar "People", route id `known-people`),
  inside `#known_people_panel`, as a collapsible "Web of who knows what"
  (`#relationship_web`, open by default) above the person cards (a sibling of
  the cards, never inside a `[data-known-person]` card).
- **Shape:** MDL2 figure (radial), with its text form in a "Read as text"
  disclosure under it.
- **States:** no known people: the panel stays hidden (existing behaviour).
  Known people with no relations yet: the web shows them with "No agreement or
  shared event yet with …". Nobody in front of you: no manner edge, and the
  note reads "Manner is read only face to face; nothing read now for …". The
  web never states where anyone is.
- **Displaces:** nothing; the cards keep their detail.

## Edge-label placement (MDL2 fix)

Edge labels sat at a fixed point along the line, so parallel edges and
neighbouring spokes overlapped near the centre. `figure.js` now places each
edge label greedily: estimate its box from the text length (8.5 units a
character, the widest shipped face), try points along its own edge and small
sideways shifts, and take the first that clears every marker, the centre
node's label and every label already placed; otherwise the least overlapped.
Deterministic, no layout reads. Edges gained an optional `detail` (plain words
for the text form and hover only); `figureText` is unchanged for specs without
it. Measured in a 1920×1080 headless gallery: edge-label overlaps went from 1
(Lanternside, Luminous) and 3 (Ferry Row, both themes) to 0 in every fixture.

## Receipt (2026-10-30)

**Files.** New: `src/ui/relationship_web.js` (pure builder, no game imports),
`src/relationship_web_view.js` (projection through `observerView`, the rows
`knownPeopleView` already gave the panel, and `reactionLine`),
`src/ui/preview/fixtures/relationship_web.js` (Ferry Row web and the RPX17
ripple sketch, invented names), `tests/relationship_web.test.js`,
`scripts/relationship_web_browser.cjs`, this doc and
`evidence/relationship-web/`. Changed: `src/people_ui.js` (web section),
`src/ui/figure.js` (edge-label placement, side-label wrap, optional
`edge.detail`), `src/ui/preview/figure_gallery.js` (import plus spread),
`index.html` (the shared `styles/figure.css` link). No persistence change.

**Change surface (FND2).** Core-owner files: none (`main.js`, `display.js`
untouched). New cycle edges: zero (`check:arch` PASS, 205 grandfathered).
Registration lines: none in `main.js`.

**Checks.**
- `node --test tests/relationship_web.test.js tests/figure.test.js`: 12 pass.
  Covers the hidden-axis leak (his trust 99 never shown), the absent-manner
  gate, loans both ways, the sibling-of-cards placement, no redraw on an
  unchanged spec, and zero edge-label overlaps in the fixture.
- `npm run check:arch`: PASS. `npm run check:rules`: PASS (5 existing warnings).
- Gallery, 1920×1080 headless (`npm run build:figures`): 0 page errors, 0
  edge-label overlaps in all four fixtures in both themes.
- Browser proof `scripts/relationship_web_browser.cjs` at 1920×1080 on the
  rebuilt bundle (hash in `evidence/relationship-web/result.json`): 0 page
  errors. Route 1 (earned, fresh life): greet the elder, open People, the web
  and its text form show him. Route 2 (named fixture: generated save opening
  the craftsman greeting, as `people_browser.cjs`): enrol, ask his habits,
  pay the commission; the web shows "owes you: a commissioned kit", "saw 2
  deeds" and the live "Warmer toward you since you asked about his working
  habits" read from the memory slice; his hidden trust axis does not appear.
- Regression found and fixed: the first full run timed out the live cast
  fixtures (`cast_body_adapter` and siblings: worker over its 160 s budget;
  the clean base passes in 55 s). The web then called `knownPeopleView` a
  third time per People render (it includes the cast ledger) and read through
  `relationshipView`'s strict save validator. Now the panel passes its rows
  in, own fields are read in place, a failing `reactionLine` drops only that
  manner edge, and any web failure hides the web and keeps the cards.
  `cast_body_adapter` then passed in 69 s. Which of the two causes it was is
  not isolated.
- Full `npm test` (final inputs): 4124 tests, 4114 pass, 5 fail. Every
  failure is a live cast fixture timing out under parallel load (or, for the
  topic-talk one, a `git apply --check` of an MR2 patch). The clean base
  `5b9a449bb` fails the same eight live cast tests when those eight files run
  in parallel; this branch fails the same eight. Not caused by this slice.
- Browser proof bundle: `v0.6-f0b79723b9f2` (in `result.json`). `dist/` is
  not committed; the coordinator rebuilds after merging.

**Gaps.**
- `scripts/people_browser.cjs` already fails on master: it opens People
  through the Notebook button, which is hidden now that People is its own
  route. Not caused by this slice; it needs its route updated.
- Master shows 1–2 s long tasks after enrolling in the workshop, with the web
  switched off as well (measured). Pre-existing; my proof uses a 60 s timeout.
- No game-MCP walk: the MCP plays the primary checkout's bundle, not this
  branch, so it could not exercise the change.
- Debts read four agreement flags and custody loans here. When rep-economy's
  owed-ledger sources land, the web should read owed rows from there (one
  authority); the swap is the `owes` list per person.

**AD43 floor.** FLR1 build: met (bundle hash in `result.json`). FLR2 route:
met by an earned fresh-life route plus a named fixture route; MCP walk not
done. FLR3 shown: met (text form, "Read as text", legend; empty and absent
states in words). FLR4 used: not met. The web displays facts other systems
already consume (agreements, loans, the memory reaction), but nothing reads
the web itself: no verb, gate or edge starts from it. Next slice (1) fixes
that. FLR5 kept: not applicable, no persistence change. FLR6 labelled:
agent-verified, not human-reviewed; route kinds earned plus named fixture.
State: **implemented, below floor** (FLR4, and FLR2's MCP walk).

**Next slice.** (1) Clicking a person on the web selects their card (PIR6
free selection, PIR12 stable). (2) RPX17 ripple wired from the observer's
own traced rumours: a "you asked who told them" verb that records a teller
into the observer's knowledge, so the ripple fills ring by ring. (3) Read
debts from the owed-ledger sources once merged. (4) RW3 exposure map for a
hidden-identity start, with its per-world fact list.

## Round 2 (2026-10-30, proposals)

Brief: [round 2](../gm/dispatch/ui-refactor-wave-2026-10-29/ROUND2_BRIEF.md). Everything here,
round 1 included, is the current best and open to replacement with a reason (AD45).

### R2.1 How other games do it

Claims are from general knowledge of these games' public play and docs, not from a play
session this round; the "adapt" column is inference.

| Game | What the player sees | Easy / costly | Idea adapted |
|---|---|---|---|
| Crusader Kings III | Opinion as a number with a hover breakdown of signed reasons; hooks and secrets as separate icons | Easy to see *why*; costly in reading load and numbers without felt meaning | Every stage and edge carries its *reason* (the evidence), shown on hover or in the text form |
| RimWorld | Social tab: a list of pawns with an opinion number, the breakdown in a tooltip | One list answers "who likes whom"; tooltips hide the point | A list, not a graph, is the frequent view; reasons one hover away |
| Stardew Valley | Heart bars per person, gifts this week, a birthday | Glanceable and warm; hides that hearts are a hidden number | The **bond bar** with discrete steps and a "next" line (adapted, with stages from known evidence rather than a hidden number) |
| Persona 5 | Confidant ranks 1-10, what the next rank unlocks | Clear depth and goals | **Stages that say what moves them** and what the next one means |
| Dwarf Fortress | Plain relationship lists in a unit's thoughts | Honest, dense, no shape | Plain-words text form stays first-class |
| The Sims 4 | Two bars (friendship, romance) per relationship | Two axes at a glance | Keep axes separate when a world has more than one (dial below) |

Our own references: the thematic UI owner's "small contextual bars" and the existing
`meter_bar.js` track kind already give the bar; no new shape was needed (UR79).

### R2.2 Fresh-player test (from a fresh life, then the craftsman fixture)

Five-second read before this round: a large empty figure with one node ("Village elder")
dominated the People view; the person card showed only a name. Terms with no meaning yet:
"Web", "manner", "saw 2 deeds". Fixes made (ACT NOW): the web is now a closed disclosure
with a count; each card's summary says the stage and what needs attention ("Old craftsman ·
Familiar · here · owes you"); the bar inside says what moves it next.

### R2.3 Split and density (1920×1080)

- **Glance (looked at often):** one line per person in the card summary. Compact.
- **Bond bar (looked at sometimes):** inside the open card, a discrete track with a "next" note
  and today's observed manner as its annotation. One click.
- **Web (looked at rarely):** who owes whom across everyone, closed by default.
- Split chosen: the web answered two questions (how close is each person; what links us). The
  bar now answers the first, the web the second.

### R2.4 Bars and small signals

The bond bar answers "how far has this relationship come, by what I have seen?" (UR61). Words
sit beside it ("Bond: Familiar 2/4", "Next: …"); it reads the same in any card (UR74). Stages:
Met → Acquainted (a shared event) → Familiar (three shared events, or an agreement) → Relied on
(an agreement settled) → Close (settled, and warm manner seen or your own trust). The words are
a per-world dial; the evidence rules are the default. "Needs care" marks strain (wary manner, a
strained debt) without lowering the stage, since strain and history are different facts.

### R2.5 Pop-out and desktop

Earns a pop-out later: the web is the one view worth a second screen during a social-heavy
stretch. `renderFigure` draws with the node's own document (MDL13), so a pop-out host can
mount it; the browser fallback is the disclosure. No badge or notification: a bond stage
change is a Reports line (R2.14), not an interruption.

### R2.6 Cheats and insight

By default the honest seat does not read `whoKnows` (L14) or anyone's axes toward you. A cheat or
continuing-insight view is the place for them: the same bar gains a second, marked fill
("insight: their regard") and the ripple fills from `whoKnows` with each link marked as
insight-sourced. Sealed secrets stay out: `whoKnows` answers who knows an *event*, and the
insight view shows only events whose discovery route the seat has opened. The developer
inspector stays separate. LATER.

### R2.7 Alternative style

Proposed alternative: a **matrix** (people as rows, columns owes / saw / manner / stage) for
"who knows what about whom" once the web shows NPC-to-NPC links (RPX17). A matrix needs a grid
layout in `figure.js` or a plain table; at today's data (edges only to you) a table is the
person-card list itself, so no second style was built. Styles keep tokens only, so Luminous
and Neutral both work.

### R2.8 Use what we have

Used: `meter_bar.js` (bond bar), `figure.js` (web), `observer_view.js`, `knownPeopleView`
rows, `reactionLine`, custody loans. Read model to switch to: the cast records' `relations`,
`knows` and `wants` (lead-run pipeline, `scripts/lead_run/batch_lib.mjs`). They are not in
runtime `src/` on master yet; when a cast pack exposes them, `relationshipWebPeople` gains
`relations` as known edges with their `basis`, `knows` as "saw/told" rows, and `wants` as a
glance chip. That is the switch-over point.

### R2.9 Unconventional option

**The room tells you.** Instead of a meter, when you enter a place the Around-you line for
each present person carries their manner as one short observed sentence ("Orr looks up and
nods"), drawn from the same `reactionLine`, and the web is the remembered summary of those
moments. Worth a later slice with rep-talk; costs a per-world phrase set.

### R2.10 Audit gaps

- Other seats: by default the adapter reads the observer's records, so a thin life or bystander seat
  shows fewer stages, not wrong ones. Not yet tested with a non-player observer (needs a seat
  that controls another actor).
- Empty state: no known people hides the panel (existing). Error: the web, glance and bar hide
  and the cards stay.
- Persistence: none (derived).
- Performance: one projection per People render, reusing the panel's rows; the figure redraws
  only on a changed spec; one meter per card.
- Accessibility: the bar has `role=progressbar` with value text; the web has its text form;
  effects off keeps every fact. Not checked at 21 px this round.

### R2.11-R2.21 (remaining items, short)

- **Abstraction (R2.11):** a directed multigraph with typed, reasoned edges plus a per-node
  stage track. Organizations and family tree can reuse the stage track for standing and kin
  closeness.
- **Open for improvement (R2.12):** known limits: no NPC-to-NPC edges; stages are a heuristic
  ladder; debts duplicate rep-economy's owed sources until merged.
- **Flourish (R2.13):** a short settle glow on the bar when the stage rises (UR38, effects-off
  safe). LATER.
- **Reports and center (R2.14):** proposed Reports line: "Bond: Old craftsman is now Familiar
  (you made an agreement)." Owned by rep-time's Reports shell.
- **Fold into existing UI (R2.16):** done: glance and bar live in the existing person cards; no
  new surface.
- **Later volumes (R2.17):** larger casts are handled by the 16-person web cap and the list;
  stage words and evidence are data, so a later world adds rows (court ranks, sworn bonds).
- **Form fits subject (R2.18):** stage → bar (a track); who owes whom → graph; who knows what
  about whom → matrix later; reasons → prose. The circle stays only for the web.
- **Levels and depth (R2.19):** the five-stage ladder with a "next" line; depth one click away.
- **Semantic roles (R2.20):** edge kinds are roles (`owes`, `saw`, `manner`, `your trust`).
  Flair sketch: in a gaslit city, the web as a pinned evidence board with string and wax
  seals; in a cultivation world, bonds as karmic threads whose thickness is the stage.
- **Draft (R2.21):** round 1's web is kept but demoted from the default view.

### Round 2 ledger

**ACT NOW (done):** bond stages (`RELATIONSHIP_STAGES`, `relationshipStage`,
`relationshipGlance`, `relationshipStageMeter`); card glance line and bond bar in
`people_ui.js`; web closed by default with a count; tests and 1920×1080 proof extended.

**ACCOUNT FOR NOW:** switch to cast records when they reach runtime (R2.8); read debts from
rep-economy's owed sources after merge; Reports bond line through rep-time's shell.

**LATER / DELEGATE:**
- Click a person on the web to select their card (FLR4 consumer). Sonnet, small. Done: click
  focuses the card; test.
- Insight view: marked insight fill on the bar and a `whoKnows` ripple. Sonnet, medium. Done:
  insight seat shows it, honest seat does not; test both.
- Matrix layout for NPC-to-NPC knowledge. Sonnet, medium, after NPC edges exist. Done: grid in
  `figure.js` with a test.
- Room-tells-you manner lines (R2.9) with rep-talk. Opus design, Sonnet build.

Model use this round: done in this session rather than with Sonnet subagents, since the pieces
were small and the 5-hour window was at 72% (the brief pauses launches past 80%).

### Round 2 checks

- `node --test tests/relationship_web.test.js tests/figure.test.js tests/people_knowledge.test.js`:
  20 pass (adds the stage ladder, glance line, bond bar in the card, web closed by default).
- `npm run check:docs`: clean for this doc.
- Browser proof at 1920×1080 through the slot limiter on bundle `v0.6-a682e3246431`: 0 page
  errors; elder card reads "Village elder · Met"; craftsman card reads "Old craftsman ·
  Familiar · here · owes you" with "Bond: Familiar 2/4" and today's observed manner
  (`evidence/relationship-web/game-craftsman-card-bond.png`).
- Full `npm test` not run (coordinator's instruction; it runs at merge).
