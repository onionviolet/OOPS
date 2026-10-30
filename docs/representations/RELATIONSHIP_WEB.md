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
