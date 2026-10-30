# Economy and institutions: representations (proposals, 2026-10-30)

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
  - **Settle-in-place for coin rows:** sonnet, medium. Done when Repay from the inspector quotes the same figure the Standing
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
| FLR4 | Partial: the tab's consumer is the existing Repay verb, which it points to but does not call |
| FLR5 | Not applicable: no persistence change |
| FLR6 | Agent-verified, not human-reviewed. Route kinds are earned and fixture |

**Next slice:** settle-in-place for coin rows (K1 quotes from `economy_standing`), which also meets FLR4. After it, the O2 ladder
figure on the Tingen path.
