# Running an organization: representations (proposals, 2026-10-30)

Status: agent proposals under AD32; nothing here is accepted until Weibao says so. One draft slice is built (the Market
courtyard panel gets its own home and an organization overview). Everything is the current best and open to replacement
with a reason (AD45, brief item 21).

Codes applied: UR6 (tokens), UR8 (own your node), UR13 and UR17 (a moved panel says where it went; saved layouts survive),
UR37 (text form), UR42 (density by frequency), UR61, UR70-UR75, ECR20-ECR22, ECR24, AD38, AD43, AD45, FND5, CLR3, WPR-free
(no world pass here).

## Reading (PRF1)

Weibao: "work on UI for running a corporation or a gang or something". Reading: a panel where the player who leads or
co-runs a group can see who is in it, what it is doing while they are away, what it costs and earns, and how it is regarded,
for any kind of group, built so a later world or volume adds rows and not code. Premises: desktop 1920×1080, the lead's life
is the main line, the live game today has no leadable gang, sect or corporation.

**What exists, honestly.** The only live thing that behaves like a run business is the Village *Market courtyard*
(`src/management/`): four named people (Mira the concessioner, Orin a maker and the one hireable foreman, Sela a worker and
prospective tenant, Bram a buyer), a shared bench, a room concession, a plot, and jobs that run on played minutes and can be
left running (Orin's commissioned crate is the "assign it and leave" case; a bounded work mandate repeats a learned recipe up
to three times). Standing is `faction_rank.js`'s per-region ladder over signed reputation. The Shadow company pack
(`book_world_shadow_company_domain.js`) is a rank ladder of one companion, not a roster. There is no gang, sect or corporation
data. So the slice is a generic organization overview with one live adapter, the courtyard as a **household business**, and
fixtures for the other kinds.

## What running one needs on screen

| Need | Question it answers | Gang | Sect | Corporation | Household business |
| --- | --- | --- | --- | --- | --- |
| Roster and roles | Who works for us, and what are they doing? | crew, lieutenants | disciples, elders | staff by department | hands and partners |
| Hierarchy | Who answers to whom, who can I promote? | boss, captains, runners | master, inner, outer | board, officers | owner, hands |
| Holdings | What do we own or control? | turf blocks | peaks, halls | assets, shares | room, bench, plot |
| Operations | What is running, how long is left, what happens if I leave? | jobs, runs | meditation, missions | projects | crate order, mandate |
| Money | What came in, what is committed out? | take, protection, bribes | offerings, stipends | revenue, payroll | coins, held inputs |
| Standing | How are we regarded, and what does the next step change? | heat | renown | brand, credit | neighbour standing |
| Loyalty and morale | Will they stay? | fear and loyalty | devotion | satisfaction | trust |
| Rivals | Who pushes back? | other crews | other sects | competitors | other stalls |
| Policies | Standing orders | cut, rules of engagement | precepts | budget | what Orin may spend |
| Succession | Who carries it on? | heir, second | successor | CEO plan | heir (life-end carry) |

## Reference games (known from docs or play, one idea each; labelled)

- **Football Manager** (known): squad table with a pinned inspector, columns that change by tab. Idea: roster table plus inspector.
- **Empire of Sin** (known from docs): turf map with heat and income per block. Idea: territory is a list with a risk word for now; the map form belongs to the maps session.
- **Dwarf Fortress** (known): job queue, workers listed with current job, orders that keep running unattended. Idea: operations board with owner and time left.
- **Immortal Taoists / sect sims** (inferred from genre): disciples with grade, talent, task. Idea: per-kind column set from one descriptor.
- **Game Dev Tycoon** (known): departments with allocation, one cash line with trend. Idea: one money line, in and out, with committed shown apart from earned.
- **Crusader Kings III** (known): council seats with a named holder per duty, and the holder's opinion of you. Idea: roles as seats; loyalty shown as an opinion line, owned by the relationship-web session.

## Forms weighed per part (brief item 18)

| Code | Part | Chosen form | Why not the others |
| --- | --- | --- | --- |
| O1 | Roster and roles | **Table with pinned inspector** | A wheel or web hides names; the web session owns who-knows-whom and loyalty edges |
| O2 | Operations | **Board of rows**: what, who, time left, held inputs, outcome | A calendar is for dated events (time session); swimlanes later when a roster has more than a handful |
| O3 | Money | **One compact strip**: on hand, committed out, expected in; each with a sentence | A ledger belongs to Ledger → Owed (economy session); this strip links there and adds no second ledger |
| O4 | Standing | **Meter with words** from `rankOf`: name, feeling, next rung and what it asks | A number alone says nothing (UR61); a ladder figure is the gallery fixture and the later full view |
| O5 | Hierarchy | **Ladder track** (figure.js `tracks`) of ranks or seats | An org-chart tree needs a new figure layout; LATER |
| O6 | Holdings | **List** (sites and property rows) | A map is the maps session's; list is enough while there are five sites |
| O7 | Unconventional: **the day's report as a foreman's note** | one prose line per finished operation, generated from data ("Bram's order was delivered; six coins came in"), shown in the overview and sent to Reports | Needs Reports grouping owned by the time session; the line text is built here and costs little |

**Default, dial and reason.** Default: table with inspector, operations board, one money strip, standing meter. Dial: a
kind descriptor (`ORG_KINDS`) names the roster noun, the columns, the standing noun (heat, renown, brand, standing) and
which sections show. A gang shows turf and heat; a sect shows disciples with grade and a techniques list; a corporation shows
departments and shares. Reason: the same questions get asked of every group (FND5: a second consumer is the fixtures), only
the nouns and the risk change. Nothing here says every world has an organization (ECR20).

## Slice built (draft)

### UI contract (proposed UR76 template)

```text
UI contract: Organization overview + own home for the Market courtyard
Home:        panel 'management' (workspace module, role actions), registered through definePanel; reached from All panels (no nav route yet,
             A1); no longer appended to Location actions (UR8). Overview sits above the existing action sections inside the same panel
Primitive:   roster table with inspector (K6), operations board, money strip, standing meter
Start:       main; the panel is discovered on arrival in the Village; the free charter visit (first section) opens the overview
Attaches:    base.frontier Village. Other worlds add an adapter returning the same descriptor
Says:        populated: "Market courtyard, a household business. 4 people. 1 job under way, Accept Bram's ordinary crate order,
                         4 played minutes left. 98 coins on hand. Village standing: Stranger, next Known Face at 4."
             empty:     "Nothing is running. Commission someone or accept an order to leave work running while you play."
             blocked:   existing buttons keep their reasons; the overview is read-only
             unknown:   a part with no data is absent, not zero (money parts show only when non-zero; no standing row without reputation)
Actions:     none new; roster rows select; existing courtyard commands unchanged
Keyboard:    rows are buttons in tab order; Enter or Space selects; selection is not saved
A11y:        table with row headers; meter has role=meter and the words beside it; every figure has a text form (UR37)
Sealed:      none
Persistence: projection only; no save field and no migration, FLR5 is not applicable. The "moved" notice remembers one
             dismissal in browser storage and falls back to showing every load
Viewports:   1920×1080 checked; mobile deferred
Evidence:    docs/representations/evidence/organizations/
```

### What it reads

`src/organization_view.js` is pure and takes one descriptor; `src/management/organization_source.js` builds it for the
courtyard from the existing facts: people from `state.simulation.people` and the courtyard fact keys, jobs and the foreman job
from `state.simulation.jobs` (time left is `due - clock`), the mandate from `simulation.programs`, money on hand from
the player purse, committed money and inputs from job `costs`, expected from job `effects`, standing from `rankOf`.

### Not done

- No settle, hire or promote actions beyond the existing commands.
- Loyalty, rivals, policies and succession are listed as needs; the courtyard has no data for them, so they are absent, not zero.
- No shared ladder figure in the panel yet; it is a gallery fixture.
- Heat and turf (gang) and disciples (sect) exist only as gallery descriptors with invented names.

## Later volumes and worlds (item 17)

Later volumes add institutions with ranks (church, secret orders, companies), larger casts and territory. The descriptor takes
ranks as rows (`ladder`), roles as strings and members as rows, so a volume adds an adapter and rows. Checked: the
clearance ladder in `book_world_lotm_clearance.js` (economy session O2) and the shadow company rank table. Open: a
leader-of-many seat (needs the seat seam), succession (needs the heir carry), and per-world standing names.

## Evidence and receipt (round 1)

Route kind: rebuilt desktop browser at 1920×1080, fresh origin, fresh life (not the MCP: every `yairpg-game` server plays the primary
checkout, not this worktree). Journey: fresh life, Village, **All panels → Market courtyard**, free charter visit, buy two logs,
accept Bram's crate order. Screens: `evidence/organizations/courtyard-charter-1920.png`, `-idle-1920.png`, `-running-1920.png`,
text form `overview-text-form.txt`; script `scripts/organization_overview_browser.cjs`.

- Build: `npm run build`, bundle hash printed by the script. Review state: agent-verified, not human-reviewed.
- Checks: `tests/organization_view.test.js` 5/5; `tests/ui_contract.test.js` and `tests/management.test.js` pass (the stale
  `foreign-host` allowlist line was removed and a `management` surface row added in `layout_spec.js`); `check:arch` and `check:rules` PASS.
- FLR5 (kept): not applicable, projection only. Gaps: no human review, no run on a long life, the gallery fixtures are not screenshotted.
- Change surface (FND2): one `layout_spec.js` surface row (a route row was tried and reverted), one `index.html` stylesheet line, one import and one loop line in `figure_gallery.js`,
  the allowlist entry removed. No `main.js` change: the factory call kept its shape.

## Round 2 (brief items 1-21, 2026-10-30; proposals)

**Where it stands.** The panel has its own home, reached only through **All panels → Market courtyard**. This is a regression against the old
Location actions placement, which a fresh player saw on arrival. A `courtyard` route row would fix it but is not a one-line change: it broke
three pinned suites (`layout_spec`, `seat_profiles`, `perspective_controls`, which pin the 20-route bar order and need seat tags), all
shared with other sessions, so I tried it, reverted it and left it as A1 for the coordinator. The "moved" note inside the panel is a weak UR13
answer because only someone who opens the panel sees it.

1. **Other games, one idea each.** *Football Manager* (known): the table-plus-inspector, adopted. *Dwarf Fortress* (known): the job list
   shows every worker with a job and who is idle; adopted as the "Doing" column, which reads "free" when idle. *Crusader Kings III*
   (known): council seats with a duty and holder; kept for the later ladder of seats, not built. *Game Dev Tycoon* (known): one
   cash line that separates earned from committed; adopted as the money strip, with committed and expected shown only when a job
   has them. *Empire of Sin* (known from docs): heat per block; kept as `ORG_KINDS.gang.standing = 'Heat'`. Our own baselines: YAIR
   and Proto23 keep action lists dense and text-first (UR12, UR49); the overview keeps prose short and sits above the old action list.
2. **Fresh-player test (from the screenshots).** Said in five seconds: the summary line ("Market courtyard, a household business. 4
   people. 1 job under way, ... 4 played minutes left"). Terms that needed knowing: *committed out* and *expected in* (now shown only
   when non-zero, because a bare "0 committed out" meant nothing), *Stranger, next Known Face at 4* (the meter now says "0 of 4 for
   Known Face"). Hidden-point click: the panel is only in All panels (the regression above). Cheap fixes done: names no longer wrap, inspector sentence
   reads cleanly, zero money parts dropped. Not fixed: money reads "102 coins" here while the inventory header uses denominations ("10C 2W") once they are known (UR74). `display.js` `format_money` returns HTML and is private, so the fix needs a plain-text export; A3.
3. **Space and density.** Roster and inspector sit side by side (3:2) because they answer two questions (who, and what about them);
   operations are one line per job because they are glanced at often (UR42); standing is one meter line; holdings are one line
   because they rarely change. The old action groups stay below, opened on demand. At 1920×1080 the panel fills the center column
   and scrolls inside itself; the page does not scroll.
4. **Bars and small signals.** The standing meter answers "how close is the next step" and carries its words. Loyalty, readiness and heat
   would be the same meter shape fed by `standing`-like rows; there is no courtyard data for them yet, so none is drawn (absent, not zero).
5. **Pop-out.** The operations board earns a pop-out for a second screen (a job and time-left list is useful while playing elsewhere),
   plus a Dock badge when a job finishes. Renderers take the node they are given (the table builder does not touch `document`
   except to create nodes). Not built; LATER with the time session's notification shape. Browser fallback stays `src/host.js`.
6. **Cheats and insight.** A revealed view adds what members actually feel (loyalty), what rivals plan, and hidden holdings, marked
   "insight" with the same chip the other representations use, and never reveals a sealed secret outside its route. Developer inspector
   stays separate. Proposal only.
7. **Visual style.** Default: Luminous Gothic table and meter (built). Alternative proposed: **paper ledger**, the roster as a
   hand-ruled page with names on lines and the standing as a stamp, through tokens only. Reads better for a household business or
   guild, worse for a sect. Not built this round; stated here so it is not mistaken for evidence.
8. **Use what we have.** Reused: `definePanel`, `faction_rank.rankOf`, `simulation` jobs and people, `figure.js` tracks for the ladder
   fixtures, `observer_view` (not needed yet: the adapter reads the controlled actor through the existing context). New shape,
   `organizationView`, has two consumers today: the courtyard adapter and the kind fixtures (proposed UR79 needs two).
9. **Unconventional option.** The foreman's note (O7): one generated sentence per finished job ("Bram's order was delivered; six coins
   came in") delivered as the day's report line. Cost: a producer on job completion and a Reports shape; worth a later slice because
   it turns idle time into a story.
10. **Audit gaps.** Lead's run: the one live organization is a courtyard; no gang, sect or corporation can be played yet. Other seats:
    the adapter reads the controlled actor only. Empty state exists (UR32). Persistence: none. Performance: the overview is redrawn
    only when its text form changes (one string compare per tick). Accessibility: roster rows are buttons with `aria-pressed`; the
    meter has an accessible name; effects-off does not change anything. Not checked at 21 px or Neutral.
11. **Abstraction.** Roster = table plus inspector (the same shape as the owed ledger); operations = a job board; standing = a rung ladder
    (also what the economy session's O2 and the shadow company rank table are). Name: *ledger, board, ladder*.
12. **Open for improvement.** Every choice above is the current best (AD45). Known limits: the courtyard adapter hard-codes four people;
    `expectedIn` cannot see Bram's six-coin payment because it is a fact flag, not a job effect; standing is one region's reputation.
    Likely next refactor: lift the roster and holdings into a world-pack descriptor so a second adapter needs no code.
13. **Flourish.** Soft pulse on a job row when it finishes, and the existing glow on the standing rung when it rises, both bound to a
    settled subject and off under effects off. Not built.
14. **Reports and center.** Reports lines proposed: subject-first, one glyph per kind (job done, hand free, standing up). Center: the
    old prose paragraphs and action groups stay behind disclosures (they already are), the overview comes first. Shared shells stay
    with the time and worlds sessions.
15. Not relevant here.
16. **Fold into existing UI.** Proposed: the courtyard panel appears in the navigation next to Ledger or under Travelers once the
    charter is visited, and the standing meter folds into the Standing and ledger panel. The "moved" note inside the panel is the UR13
    answer for now. Layout compatibility (UR17): `management` is a new module id, so no saved layout refers to it.
17. **Later volumes and worlds.** The descriptor takes members, operations, ladder and holdings as rows; `ORG_KINDS` is the only place a
    kind's nouns live. Checked: the shadow company rank table and the clearance ladder map onto `ladder` rows. Open: a leader seat for
    many members, succession, rival rows, policies; each needs data a later world pass supplies.
18. **Form per part.** Roster: table with inspector. Operations: rows. Money: a line. Standing: meter plus ladder. Holdings: a list. Hierarchy:
    a ladder (tree later). Territory: map later. Circles were rejected for roster because the reader scans names and states in a column.
19. **Levels and depth.** The standing ladder shows the next rung and how far; members show role and current job. Depth one click
    away: the inspector. Later: grade and mastery per disciple, with what the next grade changes.
20. **Semantic roles and flair.** Roles named, not looks: `member`, `operation`, `standing`, `rank`, `holding`. A gang in one world could carry
    chalk marks and a heat gauge drawn as a lit window; a sect in another could carry seal stamps and a ladder drawn as mountain steps.
    Neither touches the adapter or the text form.
21. **Drafts.** A stronger structure may be a *People and groups* tab in the Notebook where the roster, family and relationship web
    share one inspector. This slice would then become that tab's "Groups" section. Proposed for the coordinator, not built.

### ACT NOW (done)
UR8 fix (own `definePanel` home, no Location actions append, allowlist line removed); absent-not-zero money; nowrap names; inspector
sentences; a "moved" note with one remembered dismissal.

### ACCOUNT FOR NOW
- **A1** Reachability and UR13: a `courtyard` route row (Alt+U was free) with seat tags and the three pinned suites updated, so a fresh life reaches the panel in one click and gets a Reports line saying where it went. Owner: coordinator (shared files). Done check: nav button in the Village, `layout_spec`, `seat_profiles`, `perspective_controls` green.
- **A3** One money reading (UR74): export a plain-text `format_money` from `display.js` and pass it as `formatMoney` into the adapter. Done check: overview and inventory header agree.
- **A2** `expectedIn` for payments held in fact flags (Bram's six coins). Level: Sonnet, small. Done check: the running screen shows "6 coins expected".

### LATER / DELEGATE
- **L1** Second adapter for a gang or sect fixture world (Sonnet; medium; done: overview populated from a world pack with no `src/` code).
- **L2** Pop-out and Dock badge for operations (Opus with time session; medium; done: pop-out renders the same text form).
- **L3** Paper-ledger style and Neutral/21 px checks (Sonnet; small; done: gallery shows both).
- **L4** Foreman's note producer and Reports lines (Sonnet; medium; done: a finished job writes one subject-first line).
- **L5** Tree layout in `figure.js` for hierarchy (Sonnet; medium; done: gallery fixture with text form).

### Territory and holdings read the road kit (coordinator note, 2026-10-30)

The sonnet wave's sw-road lane builds the region kit, travel legs and personas (L11 design note in
`docs/gm/dispatch/sonnet-wave-2026-10-30/`). Territory and holdings here will read that, not a model of this doc's own.
Today `courtyardOrganization` hard-codes three site rows (bench, room, plot) in the `holdings` field. The adapter switches over at
that one line: when the region kit publishes places for a world, `holdings` is built from its rows (place, who holds it, risk word),
and a gang's turf and heat read the same rows. `organizationView` and the panel need no change. Until L11 lands the three rows stay.
