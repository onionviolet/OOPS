# Economy and institutions: representations (proposals, 2026-10-30)

**Next slice (2026-10-30):** O2 ladder rows on the Tingen path. Level and effort: sonnet, medium. Done when: no done check is written in the doc; the owner is still open.

Status: agent proposals. Nothing here is accepted until Weibao says so. One playable slice is built (Ledger → Owed); the other
representations are designed for later slices.

Codes applied: LTU6 (owed and due), RPX18 (institutions and standing), coverage plan B2 and K3/K6
([plan](../gm/dispatch/ui-coverage-2026-10-27/PLAN.md)), ECR17, ECR20-ECR22, ECR32, ECR33
([domain rules](../DOMAIN_RULES.md)), UR6, UR32, UR37, UR43, UR70-UR75, proposed UR76-UR82 (cited as proposed), AR8, AD38, AD43.

## Reading (PRF1)

The economy and its institutions already keep real accounts: loans with dated terms and a missed-term ratchet
(`economy_standing.js`), insurance claims the broker owes, a verge grudge from wasted herbs (`craft_grudge.js`), household
resentment and a loaned patrol kit (`household_fortunes_domain.js`, `village_career.js`), merit earned and spent at a church
store (`institution_store.js`, `book_world_lotm_merit.js`), and clearance grades that say who may handle what
(`clearance.js`, `book_world_lotm_clearance.js`). The player can see the pieces in four different panels and has no single
place that answers "who do I owe, who owes me, and by when". The request is a design round over how to show all of this, then
one slice.

## Options weighed

| Code | Representation | What it shows best | Cost and risk |
| --- | --- | --- | --- |
| O1 | **Ledger tabs** (Work, Owed, later Due and Orders) with a list plus inspector | Every account in one shape: who, what, kind, when, why, since, heir carry, where to settle | Lowest. Reuses the Ledger route, adds no route (proposed UR77). Text-first by construction |
| O2 | **Org figure**: a vertical ladder of the institution with your rung lit, merit to the next rung, and for each item grade who above can clear it | Institutions and standing (RPX18): your place, what it costs to climb, who to ask | Medium. Needs one figure kind on `figure.js` (a ladder track) and a projection joining `clearance.js`, `faction_rank.js` and merit. Only worlds with institutions get one (ECR20) |
| O3 | **Shop counter rows** with stock left, price, refusal reasons and a short price history from what you have seen | Shops and stores: why a row is refused (ECR32), how prices moved as you know it (ECR5, ECR17) | Medium. `institution_store.storeView` and `economy_standing.memoryRows` already give every field; history is only the prices you saw, so it may be sparse, which is honest |
| O4 | **Unusual: the chit wallet.** Each obligation is a paper you carry: a tally stick, a signed note, a sect token, a church receipt. Seal and enforcer on its face; it can be lost, forged, sold or inherited like an item | ECR22 (a promise binds through its enforcer) and ECR23 (forged papers write wrong beliefs). Debt becomes custody, which this game already models well | High. Turns some obligations into items with custody, so it changes persistence. Strong only where the world's own debts are physical papers |
| O5 | **Unusual: who comes knocking.** Obligations grouped by the person who would collect or pay, placed on the relationship web | Social weight: the Gutter Crews' collector, the broker's clerk, the elder | Depends on the relationship-web slice landing; better as a lens on O1 later than its own home |

### Default, dial and reason

- **Default: O1 for every account, O2 inside the institution's own panel, O3 as rows in the trade and store panels.** One shape
  per kind of information (proposed UR79): accounts use the ledger, ranks use the ladder, stock uses rows.
- **Dial:** a world whose debts are physically carried (tallies, contract scrolls, sect tokens) shows O4 as a lens on the same
  rows. Each row's "Kept by" already names the paper's keeper, and the chit view adds custody. A world with no institutions shows
  no O2 (ECR20); a world where nobody owes anyone shows the Owed empty text once you have met the Ledger (proposed UR82).
- **In-world reason:** in this game a promise is only as strong as whoever enforces it (ECR22). The ledger names that enforcer
  and where to settle on every row, so the player reads a debt the way a borrower would: who will come asking, and when.

## Slice built: Ledger → Owed (O1)

### UI contract (proposed UR76 template)

```text
UI contract: LTU6 Owed (coverage B2, K3 ledger + K6 inspector)
Home:        Ledger route → Work Ledger panel (workspace module 'ledger') → Owed tab (new tab strip: Work, Owed)
Primitive:   K3 ledger with filters and counts; K6 inspector on click
Start:       main (extends an accepted surface; a tab in an existing home, proposed UR78)
Attaches:    any life. The panel shows where Work is available (the Village) or while any account is open (proposed UR82)
Says:        populated: "You owe the Market Circle 10 coins, due in 28 days."
             empty:     "No one owes you and you owe no one. Rows appear here when you borrow from a house (Standing and
                         ledger → Credit), when an insured cargo is lost and the broker owes you a claim, or when your household,
                         the Village watch or the verge keepers hold something against you."
             blocked:   none; read-only. A filter with nothing in it answers "Nothing matches “Owed to you”. Choose All to see N accounts."
             loading:   none (projection is synchronous)
             unknown:   parties are named only as the writer recorded them; nothing sealed is read
Actions:     none that settle. Filters (All, You owe, Owed to you, Has a date, one per kind present) and row selection
Keyboard:    Tab order: tabs, filters, row buttons; Enter or Space selects; Esc follows the center view's back bar
A11y:        role tablist/tab/tabpanel; filters are aria-pressed buttons in a labelled group; each row button's accessible
             name is the full effect sentence; overdue is the word "overdue", colour only repeats it (UR37)
Sealed:      none
Persistence: projection only. Tab, filter and selection live in memory and reset on reload. No save field, no migration
Viewports:   1920×1080 checked. Table and inspector sit side by side (3:2); below about 1100px of panel width the
             inspector would want to stack (not built; mobile deferred)
Evidence:    empty, earned row, seeded fixture, filter; journey below
```

### What it reads

`src/owed_ledger_sources.js` reads only published projections and ports, never a domain's closure, and writes nothing.

- **Standing:** it reads `domainRegistry.project('economy_standing')` for ledger rows, loan status and claims. The live
  balance (with interest) and the due date come from `loanStatus`, because the ledger row's amount is only refreshed on a write.
- **Verge grudge:** the projection's ledger is eased to now with `grudgeNow`.
- **Household:** resentment comes from `domainRegistry.project('household_fortunes')`.
- **Village career:** the career port gives the kit debt, plus a new duty row while the kit is out and due back.

`src/owed_ledger_view.js` is pure. It gives:

- each row's direction, party, amount, date and effect sentence
- the summary, with counts and coin totals by direction
- filters with counts
- the inspector: why, since, heir carry, keeper and where to settle
- the empty text

Parties are read against `CONTROLLED_ACTOR_ID` from `observer_view.js`, never against a literal lead id. Rows are ordered
overdue first, then by date, then you-owe before owed-to-you.

### What it does not do yet

- **No settling from the tab.** Repay stays in Standing and ledger, and each row's "Settle" line points there. Settling in place
  would need preview-equals-commit quotes from each writer (K1). That is the next step for coin rows.
- **Heir obligations are not joined.** `heir_inheritance` keys are read only at a life's end today, so they are not part of a
  live life's ledger.
- **The Standing and ledger panel still shows its own credit lines.** Under proposed UR79 Owed becomes the one home for
  accounts, and Standing keeps houses, terms, insurance and prices. Removing the duplication is a separate structural change.
- **The Work Ledger details element still opens closed.** This is unchanged existing behaviour, and the tab strip sits inside it.

## Designed for later slices

- **O2 org figure (RPX18).** Default: the Tingen church path first, since `book_world_lotm_clearance.js` already declares the
  role ladder and grade table and `meritView` gives the balance.
  - **Rungs** come from `clearance.roles`, with your role lit. The next rung shows what it asks (merit, standing, a sponsor) in words.
  - **Grades** sit beside the ladder. Each grade is a row naming the lowest rung that clears it and who present can clear it for
    you, read from `clearanceFor`. Your own grade lines read "you may handle it here" or name what is missing.
  - **Figure kind:** a ladder track on `figure.js`, with the text form listing the rungs top to bottom.
  - **Done check:** a Tingen fixture renders in the figure gallery with its text form, and the live Tingen panel shows it at
    1920×1080 beside the existing clearance lines, which it then replaces.
- **O3 counter rows.**
  - **Columns:** price in the institution's unit, stock left, eligibility with every refusal reason (`offerFor`), and the last
    three prices you saw for that good with their days and staleness (`memoryRows`).
  - **Dial:** history shows only what you saw or heard, marked "heard" when it came by rumour, because wealth is information
    first (ECR17).
  - **Done check:** the Nighthawk evidence store and a Village trader both render the same row shape.
- **Ledger → Due (coverage B4).** One more entry in the `TABS` array in `src/work_ledger_ui.js`. The linked time session may own
  it; the strip was built so that is a one-line addition.
- **O4 chit wallet.** It needs a persistence decision first, because obligations would gain custody. It belongs to a world whose
  canon debts are papers, and should reopen when such a world's pass names one.

## More to consider (round 1)

- **ACT NOW (done):** the live balance replaces the stale ledger amount; a kit due back shows as a duty with no coins; zero-count
  filters stay clickable and answer with their empty text instead of a greyed control.
- **ACCOUNT FOR NOW:**
  - Favours have no writer yet. The kind exists in `obligations_ledger.KINDS`, and the first world that writes one fills the
    Favour filter with no UI change.
  - Loyalty (from LTU6) is not an account. It belongs on the person (relationship web), not here.
- **LATER/DELEGATE:**
  - **Settle-in-place for coin rows:** done for credit rows 2026-10-30 (see Follow-up below). Done when Repay from the inspector quotes the same figure the Standing
    panel commits.
  - **O2 ladder figure:** sonnet, medium. Done check as above.
  - **Merging Standing's credit lines into Owed:** sonnet, small. Done when one account appears in one place and the Standing
    panel links to it.

## Receipt (2026-10-30)

**Files**

- New:
  - `src/owed_ledger_view.js`, `src/owed_ledger_sources.js`, `src/ui/owed_ledger.js`
  - `src/ui/preview/fixtures/economy.js` (named fixtures `owed-empty`, `owed-mixed`)
  - `tests/owed_ledger.test.js`
  - `scripts/owed_ledger_browser.cjs`
  - this doc
  - `docs/representations/evidence/economy/` (4 PNG, 1 text form)
- Changed:
  - `src/work_ledger_ui.js`: tab strip, `readOwed` defaulting to `readOwedLedger`, panel visible when Owed has rows
  - `styles/settled_text_effects.css`: tokenized rules for the strip and tab
- Change surface (FND2): no core-owner file, no `main.js` line, no `index.html` line, no save field. `check:arch` reports no
  new cycle edges.

**Checks**

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/owed_ledger.test.js` | 8/8 pass | The work_ledger_ui tab wiring is covered by the browser run, not a unit test |
| `npm run build` | pass, bundle `18125a0c9bd8` | |
| `npm run check:arch` | pass; main.js 10067 lines (baseline 10115), no new main imports | |
| `YAIRPG_PORT=19631 node scripts/owed_ledger_browser.cjs` | PASS at 1920×1080, fresh origin, bundle `18125a0c9bd8` | 404s for `resources/fonts/private/*` are expected in a worktree and are filtered; no page errors |
| `npm test` (full, pre-commit) | 4107 pass, 13 fail, 2 skipped | 2 fail on the worktree's missing gitignored `docs/research/novels`. 11 are native-integration cast/place tests that hit their worker timeouts (160-180 s) at load average 131 with ten sibling sessions running; `cast_body_adapter` rerun alone failed the same way (empty worker output, timeout). The cause is load, not attributed to this change; rerun on the merged tree when the machine is quiet |
| Game MCP walk | Ran a fresh life and borrowed 10. The MCP servers run from the primary checkout, so the Ledger showed master's panel without tabs | Not a walk of this branch |

**Journey** (browser, 1920×1080, fresh origin)

1. Fresh life → Ledger → Owed shows the empty text. No page scroll, and the panel is inside the viewport.
2. Earned step: Standing and ledger → Borrow 10 from the Market Circle → the Owed tab reads "Owed 1", with the row "To the
   Market Circle · 10 coins · Money · due in 28 days".
3. The inspector reads "You owe the Market Circle 10 coins, due in 28 days." and points to Repay.
4. Named fixture `owed-seeded` (the same save edited through the snapshot hook) has an overdue loan, a second lender, a broker
   claim and the verge grudge. Rows sort overdue first, the summary totals both directions, and the "You owe" filter leaves 3.
5. The Work tab is unchanged.

**AD43 floor:** implemented, below floor.

| Floor line | State |
| --- | --- |
| FLR1 | Met: bundle `18125a0c9bd8` |
| FLR2 | Met by the rebuilt-browser route (earned step and named fixture). The game MCP walk of this branch is missing, because the MCP serves the primary checkout |
| FLR3 | Met: effect-first sentences, an empty state that says how to fill it, and a no-match text for every filter |
| FLR4 | Partial: the tab's consumer is the existing Repay verb, which it points to but does not call. Closed for credit rows by the 2026-10-30 settle-in-place follow-up below |
| FLR5 | Not applicable: no persistence change |
| FLR6 | Agent-verified, not human-reviewed. Route kinds are earned and fixture |

**Next slice:** settle-in-place for coin rows (K1 quotes from `economy_standing`), which also meets FLR4. After it, the O2 ladder
figure on the Tingen path.

## Round 2 (2026-10-30, review round per the [round 2 brief](../gm/dispatch/ui-refactor-wave-2026-10-29/ROUND2_BRIEF.md))

Everything in round 1 and here is the current best draft, open to refactor or replacement with a reason (AD45). Known limits and
the likely next refactor are at the end of this section.

### R2-1 How other games do it

A Sonnet subagent studied these games; I reviewed the result. "(known)" means from play or docs, "(inferred)" means not checked.

| Code | Game | What the player sees | Idea adapted |
| --- | --- | --- | --- |
| G1 | Mount and Blade | One relation number per lord and faction, plus renown (known). It is easy to read who is friendly, but the causes are thin, so it is hard to see why a number moved (inferred) | **Show the causes beside the tier.** Done: the inspector's "Recent:" line lists the last deeds that moved this house |
| G2 | Patrician / Port Royale | Per-town price tables, route history, loan screens (known). Dense tables need learning (inferred) | **Price history as you saw it, dated and marked stale.** Planned for O3 counter rows (`memoryRows` has the fields) |
| G3 | Kenshi | Standing is mostly felt through guard and shop behaviour (known). Hard to plan around (inferred) | **Standing speaks through behaviour beyond the ledger.** Already true in trade ("Standing in this price"). The Owed ladder adds the readable side |
| G4 | Shadows of Doubt | Records tied to source documents, searched by cross-reference (known) | **Every account points at its paper.** "Kept by" names the keeper today; a later row can name the document (the O4 chit wallet) |
| G5 | Crusader Kings III | Hooks and opinion modifiers as a list with sizes and decay timers (known). Long lists bury the one that matters (inferred) | **Decay clock per grievance.** Done: grievances read "no date; eases by 1 a season"; the list is sorted with what is due first |
| G6 | Kingdom Come: Deliverance | Reputation per region, read partly from how you look (known) | **Rank shows on your gear.** Planned for O2: a clearance grade as a mark on the institution's issued kit |

The house refs (Proto23, YAIR) have no debt ledger, so this is new ground and there is no baseline parity to keep (UR12, UR49).
Prior OOPS docs that already cover pieces of this, in `THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`, "Small contextual bars":
- BD4 useful band: the standing ladder
- BD5 free, held and proposed: future settle-in-place
- BD7 stages: unequal rungs
- BD8 stale reading
- BD11 due boundary: the due bar
- LD6 change has a baseline: the "Recent" causes

**Abstraction underneath (proposal): a Claim.** A Claim is a holder, a counterparty, a kind, a value (an amount, a tier or a
stage), since, a due or ease clock, causes, transferability and a settlement route.
- A ledger is a filtered list of Claims.
- A standing is a Claim valued as a tier.
- A rank is a Claim valued as a stage, with merit as its currency.

`obligations_ledger.js` rows already carry most of this. A Claim stays a read model and never becomes a second save state.

### R2-2 Fresh-player test (the slice, as a first-time player)

| Code | Finding | Change |
| --- | --- | --- |
| FP1 | The Ledger route opens a closed "Work ledger" disclosure, so a click hides the point | ACT NOW: the disclosure opens by default; collapsing stays with the workspace module |
| FP2 | "Grievance 2" has no meaning on its own | The row's When column already says "eases by 1 a season", and the inspector names the cause. Kept |
| FP3 | The Money column made a stranger compare numbers to nothing | ACT NOW: amounts are right-aligned with tabular figures, and a due bar sits under the date words |
| FP4 | "What happens if I am late?" was unanswered | ACT NOW: the inspector states the late terms from the lender's own dials (grace, rate rise, standing drop; ECR21 forgiving defaults) |
| FP5 | The term "standing" needed knowing | ACT NOW: the inspector shows the ladder of named rungs with "(you)", how far the next rung is, and what moves it |

### R2-3 Space, split and density at 1920×1080

- **Split:** the table and the pinned inspector stay side by side (3:2). That is a list beside a pinned inspector, which suits
  a ledger (brief item 3).
- **Density by frequency (UR42):**
  - The glance is the tab count ("Owed 4") and the summary line.
  - The rows are the working view.
  - The ladder, causes and late terms sit one click away in the inspector.
- **Merge, proposed (UR79):** the Standing and ledger panel's Credit lines answer the same question as Owed. Once
  settle-in-place lands, Standing keeps houses, terms, insurance and prices, and its credit lines link to Owed. Not done here,
  because Repay lives there today.

### R2-4 Bars and small signals

- **Due bar:** it answers "how much of the term is left". The words come first and the bar repeats them (UR37). It uses the
  shared meter tokens (`--ui-meter-track`, and `--ui-meter-limit` when late), so it reads like other tracks (UR74).
- **Standing ladder chips:** they answer "where do I stand with this house". These are rungs with words, not a scalar bar,
  because the tiers are unequal bands (BD4, BD7).

### R2-5 Pop-outs and the Electron app

- **No pop-out.** Owed is a short read beside play, not a second-screen view.
- **Badge (proposal, LATER):** an overdue account could join the attention badge. `src/host.js reportAttention` is one global
  channel (leads), so this needs the coordinator's call on combining counts.
- The renderer draws into the node it is given (`renderOwedLedger(parent, …)`), so a pop-out would work if one is wanted
  (MDL13).

### R2-6 Cheats and insight views

- **Revealed view (proposal):** a continuing-insight cheat could reveal what the lender will actually do, such as the house's
  hidden patience or whether the Gutter Crews send collectors. It would show as an extra inspector line marked "Insight:" and
  sourced to the cheat card, under CS1 (a knowledge cheat goes to records).
- **Today:** the late terms shown are public dials the lender states, so they are not cheat-sourced.
- The developer inspector stays separate.

### R2-7 Visual style

- **Default:** a ruled ledger table in Luminous Gothic, with amounts in tabular figures, and in Neutral at 14 and 21 px with
  effects off.
- **Alternative (proposal, LATER):** a paper "account book" style, with ruled lines, a double rule above totals and a red ink
  role for overdue, set through tokens as a world skin.
- **Which reads better:** the account book suits merchant worlds; the default suits system worlds. The roles named for this
  (R2-20) let one swap for the other.
- Not built this round, because the figure gallery takes figures only and has no table fixture home.

### R2-8 Use what we have

The slice uses `obligations_ledger.js`, the `economy_standing` projection (credit, factions, deeds, claims), `craft_grudge.grudgeNow`,
the household projection, the career port, `observer_view.CONTROLLED_ACTOR_ID`, the Work Ledger panel and its
`syncChildren`/focus restore, and the meter tokens. It adds no new primitive: K3 and K6 are the coverage plan's own shapes.

### R2-9 Unconventional option

**Collectors walk in.** An overdue account becomes a person in the place panel: the Gutter Crews' collector stands in the
Village with the debt as a dialogue choice (pay, ask grace, refuse). The world reacts instead of the ledger turning red.
- **What it takes:** a scheduled visitor from the people schedules (sonnet wave) and a talk verb over `repayLoan`.
- **Worth it:** yes, as a later slice once schedules land. It gives FLR4 a second consumer.

### R2-10 Audit gaps

- **Other seats:** parties come from `CONTROLLED_ACTOR_ID`, and a thin life sees the empty text.
- **Lead's run:** LTU6 is covered for coin, grievance and duty. Favours wait for a writer, and the Due tab is B4.
- **Persistence:** none changed.
- **Accessibility:** tablist roles, `aria-pressed` filters, a meter role with a label, the row button named by its effect, and
  `aria-current` on the rung.
- **Performance:** the round 1 suite failures were checked by A/B. With the pre-change `work_ledger_ui.js`,
  `cast_body_adapter` fails the same way at load average 161 (worker timeout at 165 s). The failures come from machine load,
  not this slice. The A/B is the same test run back to back on the two `work_ledger_ui.js` versions. With the pre-change file
  it failed at 168.5 s, and with this change at 165.5 s, both at load about 162. The panel re-read the projections on every poll,
  so the account sources are now re-read at most every 500 ms unless a click forces a render (ACT NOW).

### R2-14 Reports and the center

- **Reports line (proposal; the time session owns the Reports shell):** taking, repaying and missing a loan each write one
  subject-first line, for example "Market Circle · borrowed 10 coins, due in 28 days". It carries a coin glyph and links to the
  Owed row. Today a borrow says so only in the Standing panel's status line.
- **Center:** Owed opens in the center through the Ledger route and holds one table and one inspector, with no prose before the
  actions.

### R2-16 Folding into prior UI

- **Done:** Owed lives inside the Work Ledger, whose details now open by default.
- **Proposal for the coordinator:** rename the module "Work Ledger" to "Ledger", because it now holds accounts too.
  - Saved layouts keep the id `ledger`, so pins survive (UR17).
  - A one-time log line would say "The Work Ledger is now the Ledger: Work and Owed tabs" (UR13).
- Not done here, because the module title is registered in `main.js`.

### R2-17 Later volumes and worlds

The view is data-driven:
- **Kinds:** a new kind, house, lender or institution adds rows and labels, not code. Favours, sect contribution debts and
  church merit owed fit as kinds.
- **Ranks:** the ladder reads any tier list and cut list, so longer sequences and church ranks reuse it.
- **Rows:** the 256-row cap in `obligations_ledger.js` and the filters scale to long lives.

Checked:
- Tingen merit and clearance rows from `book_world_lotm_merit.js` and `book_world_lotm_clearance.js` fit the O2 ladder.
- The book world's credit (`book_world_primordial_credit.js`) writes `obligations@1` rows that this tab would read once its
  host publishes them.

Open:
- Cross-world debts, which need ECR33 time horizons on the row.

### R2-18 Form per part

| Part | Form | Why the others fit worse |
| --- | --- | --- |
| Accounts | Table plus inspector | Accounts are compared by who, what and when. A ring or graph hides the comparison |
| Standing | Ladder of named rungs | Tiers are ordered and unequal. A scalar bar implies equal steps |
| Term left | Bar under words | One value, glanced often |
| Ranks and clearance (O2) | Vertical ladder with grade rows | Ordered stages with gates. A tree would imply branches the church does not have |
| Stock (O3) | Rows | Things you act on, compared by price |

### R2-19 Levels and depth

Standing shows its rung, the distance to the next rung, what moves it (deeds and their sizes) and what being late costs. The O2
ladder carries ranks the same way. The glance stays shallow ("Owed 4").

### R2-20 Roles for later flair

The marks are named by role: `account`, `due`, `late`, `rung`, `rung-current`, `house`.
- **A merchant world:** ink-ruled pages, a wax-seal glyph per house and a red-ink `late`.
- **A sect world:** contribution jade slips, with rungs as carved tablets and `late` as a cracked slip.

A motif pack restyles these roles without touching the adapter or the text form.

### R2-21 Draft status

Round 1's structure holds up for accounts: a ledger is the right shape. O2 stays a ladder and is not drawn as a figure, which is a
deliberate change from round 1's "org figure" wording to a ladder track. It can be built as rows first and gain a figure only if
rows prove too flat.

### Round 2 lists

- **ACT NOW (done):**
  - FP1, the disclosure opens by default
  - FP3, aligned amounts and the due bar
  - FP4, late terms
  - FP5, the house ladder with causes
  - the A/B on the suite failures
  - the subagent reference study
  - a throttle on the account-source read (500 ms, forced on click)
- **ACCOUNT FOR NOW:**
  - Renaming the Ledger module needs the coordinator, because the title is set in `main.js`.
  - The Reports line needs the time session's shell.
- **LATER/DELEGATE:**
  - **Settle-in-place:** sonnet, medium. Done when Repay from the inspector commits the quoted figure.
  - **O2 ladder rows on the Tingen path:** sonnet, medium. Coordinate with the worlds session, which owns the workroom's
    center density.
    - The worlds session confirmed on 2026-10-30 that merit stays in the workroom's "Work & merit" tab and clearance in "Path".
    - A `rep-organizations` session now exists. The O2 ladder may belong there, so the coordinator decides the owner before anyone
      builds it.
  - **Account-book style as a token skin:** sonnet, small. Done when it is captured at 14 and 21 px with effects off.
  - **Collectors walk in:** sonnet, medium. Starts after the schedules wave.

### Round 2 receipt

**Files changed:**
- `src/owed_ledger_view.js`: the house ladder, causes, late terms and term left
- `src/owed_ledger_sources.js`: the standing dials passed in as terms
- `src/ui/owed_ledger.js`: the due bar, the ladder and the late lines
- `src/work_ledger_ui.js`: opens by default, plus the read throttle
- `styles/settled_text_effects.css`
- `tests/owed_ledger.test.js`: one new test, 9 in total
- `scripts/owed_ledger_browser.cjs`: round 2 assertions
- the evidence PNGs, recaptured

**Checks**

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/owed_ledger.test.js` | 9/9 pass | |
| `npm run build` | pass | |
| `npm run check:arch` | pass | |
| `scripts/owed_ledger_browser.cjs` | PASS at 1920×1080, fresh origin, with the late terms, the ladder rung "Neutral (you)" and the due bar asserted | |
| `cast_body_adapter` A/B | Same failure and duration with and without this change | The fix is a quiet machine |
| Focused (AD36): `owed_ledger`, `obligations_ledger`, `economy_standing`, `craft_failure_ledger`, `palette_feedback`, `stepper_life_commit` | 35/35 pass | The full `npm test` was stopped on the coordinator's instruction (machine load 194); the coordinator runs it once at merge |

**Delegation:** one Sonnet subagent did the reference-game and prior-docs study (R2-1). I built the code myself, because each
piece was smaller than a brief. No Opus session was started.

## Follow-up, 2026-10-30: Repay settles in place

Proposal (AD32), desktop 1920×1080, evidence in `docs/representations/evidence/followups/`.

Selecting a credit row in Ledger → Owed now shows a button, `Repay N`, where N is `loan.owed` from the same
economy_standing projection Standing labels its own button from. It calls the domain's `repay` command (published
as `commands.repay`, the function Standing's button calls), so the commit, the purse and the standing deed are one path.
The row says why it is blocked with an empty purse, and says how much lands when the purse is short of N. The other
kinds (claims, household, career, verge grudge) keep their pointer line and no button: each has a different owner
and no command to call yet. A receipt line, "Paid N coins.", appears in the ledger notice.

Settled in the browser from a fresh origin: borrow 10 in Standing, open Owed, the two buttons read the same
(`Repay 10`), Repay from Owed clears the row, Standing shows no loan, and the loan stays cleared after save, reload and Import.

| AD43 line | State |
|---|---|
| FLR1 build identity | Rebuilt bundle served from the repo root; no page errors |
| FLR2 natural route | Earned step: Borrow in Standing, then Ledger → Owed → row → Repay |
| FLR3 description and cost | Button carries the exact figure; blocked and partial cases say why |
| FLR4 consumer | Met for credit rows: the existing repay command is called; `tests/owed_ledger.test.js` (20 pass with the economy tests) |
| FLR5 persistence | Cleared loan survives save, reload and Import; no new save field |
| FLR6 review | Agent-verified, not human-reviewed |

Gap: the quote is checked at a zero-interest moment in the browser; with accrued interest both read the same
`loan.owed` field (unit test), but no browser run advanced days first.
