# Lane F: founding and running groups, shared across worlds (round 3, 2026-11-06)

Weibao, 2026-11-06: "...like choosing to farm, or choosing to start a society ... or group or other functional abilities that should be shared across all the worlds?"

Roots: [LARGER_FOUNDATIONS_2026-11-06](../LARGER_FOUNDATIONS_2026-11-06.md) (FD14 society sheet, FD15 positions), [LANE_A](../larger-foundations-2026-11-06/LANE_A_SOCIETY_POSITIONS.md) (position record `positions@1`, M1-M15). This lane adds the missing owner: the group itself.

Everything is a proposal (AD32). No code, no other doc, no commit changed. Labels: **shown** = I read the line (file:line); **stated** = a doc says it; **inferred** = my reading. Snapshot: master working tree 2026-11-06, partial reads, importer counts by grep of `from './x'` in `src/` (dynamic imports can be missed). Sealed secrets untouched; none named.

Design frame applied: defaults with dial and reason, no either/or questions (AD5, AD38); each world picks its own version (AD46); abstract when two or more worlds plausibly share a mechanism, with a second world validating (AD51); a membership badge grants no skill, knowledge or consent (CHARACTERS_AND_WORLD_EVENTS guard, stated, line 622).

## 1. Step 1: reconcile (the most important part)

Classes: DUP duplicate, VAR compatible variant, INC incomplete integration, STALE, DIS genuine disagreement.

**Headline: the project already has five fragments of "a group" and design prose for the rest, but no record, and nothing anywhere lets a player or an NPC *found* one.** Each fragment serves one world.

### 1.1 Code that behaves like part of a group (importers, worlds)

| # | Module | What it is (evidence) | Importers in src | Worlds |
|---|---|---|---|---|
| C1 | `organization_view.js` | Pure projection, `ORG_KINDS` names household_business, gang, sect, corporation, guild with roster/standing/holdings nouns (shown, :4-10); "no state, no persistence" (shown, :1-3) | 1 (`management/ui.js`) | Village only (courtyard); gang, sect, guild exist only as gallery fixtures (stated, ORGANIZATIONS.md) |
| C2 | `management/organization_source.js` + `management/*` | Courtyard adapter: four hard-coded people, standing from `rankOf`, jobs from `simulation` (shown, :1-12) | 1 (management ui) | Village |
| C3 | `management/foreman.js`, `simulation.js:372` | Delegation: one commissioned crate (2 logs plus 2 coin fee); a "management" command may repeat only if repeatable, count at most 3, already completed once (shown, simulation.js:372) | via simulation | Village |
| C4 | `gatherings.js` | Recurring meeting: `schedule {everyDays, offset, hour}`, `seats` (persona per seat, `minStanding` gate), `dial.secrecy`, `trade` receipts with optional persona reveal, `leave` with `bodyRevealed` (shown, :7-60) | 1 (`lotm_next_city.js` -> `book_world_lotm_cast_days.js`); 3 test files | LOTM only |
| C5 | `persona_standing.js` | Standing per persona per region, 0.5 leak between faces (shown by lane A, :7,14) | 2 (gatherings, character_sheet_bridge) | LOTM |
| C6 | `party_battle.js` + `party_content.js` + `party_ui.js` + `party_partner_*.js` | One hard-coded helper, `PARTY_HELPER` (Lio); stance "hold" threshold; helper steps out on yield or unsupported (shown, party_battle.js:12, :82; party_content.js:3-6). Partner facts "gain no enrolled state" (shown, party_partner_facts.js:1) | party_battle 6, party_content 2, party_ui 1 | Village |
| C7 | `tempo_allies.js` | Allies with ranked goals, order heard by chance from bond, discipline, fear and noise; fear derived each turn, never stored (shown, :1-4, :20-26) | 2 (tempo_fight, tempo_fight_contract) | Tempo fights (LOTM road duel and Village) |
| C8 | `home_household.js`, `home_staff.js`, `home_office.js`, `household_brood.js` | Hired steward, cook, keeper, tutor with `home.employed`; an office whose "fund and standing policy move to a successor" while wages and skills stay personal (shown, home_office.js:1-4) | home_household 4, home_staff 1, household_brood 2 | Arlmere manor (home) |
| C9 | `heir_inheritance.js` | Heir carries half regional standing and elder obligations, not patrol rank (shown by doc 33 ICD12, :43-59) | 1+ | Village |
| C10 | `institution_store.js` / `institution_access.js` | Missions pay only `contribution` (shown, lane A, store:23); scoped, expiring, suspendable grant (access:1-28). No roster, no treasury | store 2, access 1 | LOTM merit, primordial credit; MoL guest pass |
| C11 | `faction_rank.js` | Rank by signed per-region reputation only (shown, :31) | 6 | broad |
| C12 | `law_case.js` | Detection, nested jurisdiction, response ladder | **0** (shown by grep) | nobody |
| C13 | `village_career.js`, `feature_expansion_society.js` | Bespoke three-rank career with kit loan; agreed-work apprenticeship and handoff (shown, lane A R13). The name "society" here means Village agreed work | career bespoke; society 11 | Village |
| C14 | `book_world_shadow_company_domain.js` | "Rank ladder of one companion, not a roster"; no saved slice (stated, ORGANIZATIONS.md; shown, :1) | 1 | Shadow company pack |
| C15 | `companion_roster.js` | One line per met companion or resident (shown, :1-6) | **0 in src** (inferred low risk of dynamic import) | Village |

### 1.2 Docs that already own the design

| # | Doc | What it holds | Class vs this lane |
|---|---|---|---|
| D1 | `docs/worlds/world-depth-2026-10-13/33_INSTITUTIONS_AND_COMMUNITIES.md` | ICD14: "no shared institution record covering all requested kinds, multiple memberships, policy versions, internal blocs, revocation, founding and institutional memory" (stated, line 30). IKP1-IKP12 kinds (guild, school, sect, church, army, secret society, company, gang...). IOP1-IOP8 model rules (membership is an agreement, overlapping memberships, rank vs office vs competence, dues have a destination, duties have terms, privileges are scoped readers). ISL4 "one renewable membership term" needs a new validated record (stated). "Founding, institutional schisms ... remain reachable later choices" (stated, line ~263) | **VAR / INC.** It is the rule palette this lane's record must satisfy; it names founding and splits as later work and designs neither. Reuse IOP1-IOP8 verbatim as field rules. |
| D2 | `docs/representations/ORGANIZATIONS.md` | Running-a-group UI proposal: needs table (roster, hierarchy, holdings, operations, money, standing, loyalty, rivals, policies, succession); one built slice; "Loyalty, rivals, policies and succession are listed as needs; the courtyard has no data" (stated). Item 12: "lift the roster and holdings into a world-pack descriptor" | **VAR (read side).** Its descriptor is the *projection* of the record proposed here. Its "needs" list is the field checklist for running. |
| D3 | `FD15 / LANE_A` | Position record: membership as a position with term, rank, exit, history; no owner of rank inside an institution (G2) | **INC.** Positions are one person's side of a group. The group side (shared treasury, premises, charter, roster) has no owner. |
| D4 | `NONHUMAN_BONDS_AND_PARTIES` section 5 + `COMPANIONS...` R, S | Party roles follow functions, not species; "temporary party membership does not transfer personal property, obligations, knowledge or rank; a party can dissolve while two members retain a bond" (stated). R1-R4 named few, nameless many, command overhead, promotion; S1 tamer guilds | **VAR.** Gives the party-role rules and the scale rule (ACR13 cohort inside a group). |
| D5 | `ACTIVITY_ABSTRACTION_RULES` ACR6, ACR7, ACR10, ACR11, ACR13 | Delegate keeps own means, motives, knowledge and reporting route; finished search is not instant knowledge (ACR10); result lifecycle (ACR6); interruption settles what happened (ACR7); scale change keeps identity and committed causes (ACR13) | **Governing rules**, not duplicates. |
| D6 | `CHARACTERS_AND_WORLD_EVENTS` (membership, lines 169, 622) | Faction memberships as relationship facts; badge guard | **DUP in intent** with lane A R11. Adopt the guard. |
| D7 | Per-world institution passes (13 files) | LOTM: city split by faith (F1), Psychology Alchemists a secret order with council and code-name masks (F6), verbal oath net (F20), hidden club trades by rite and leader blocks perception for private talk (F26); civil-staff contract (F7). Soldier's Life: Guild parallel to Legion; Fanren: sect recruitment, library nod-through; primordial: registration and life lamp; Reverend Insanity: clan, sect leader and elders; Shadow Slave: clan recruitment channels; TTKS: sect recruits daily, branch contract (all stated, headings read) | **Source rows** for kinds and entry routes. None describes *founding by the protagonist* except LOTM's club (canon) |
| D8 | `LIFE_SIM_NORTH_STAR` (lines 1792, 2998, 3992, 1907-1912), `PROCEDURAL_STORY...` N1, CB10 | "a student can found their own sect", "can found an academy", "can found a nation", Kenshi "recruiting followers, founding a town and faction"; ambition board "open a shop, join a sect... found a village"; CB10 player-made world events (founding a festival) (stated) | **INC.** Idea-level only; no runtime, no owner, no rule. |
| D9 | `RULES_INDEX` AD46, AD51 | AD51 names "organization ranks" and "bonded companions" as shared-seam examples (stated, line 265); AD46 "a view that names one world's ids in shared UI code is a defect" (line 260) | Authority. See 1.3 on `ORG_KINDS`. |

### 1.3 Classification and findings

| ID | Finding | Class | Action |
|---|---|---|---|
| RF1 | No verb founds, charters, renames, registers or dissolves a group. Searched src filenames for guild, company, club, sect, gang, charter, member, found, settle, hire, delegate; hits are Steam-game absorption packs, workshops, `shop_*`, and lore text. **No player-founded or NPC-founded group exists.** | INC (gap) | Section 3 |
| RF2 | Groups already exist as *authored institutions* (store, access, gathering) but each holds a different slice: membership in positions (lane A), meetings in gatherings, rank in `faction_rank` per region, treasury nowhere, premises nowhere | INC | One record that points at these owners |
| RF3 | `ORG_KINDS` hard-codes nouns (Heat, Disciples, Renown) in shared code (shown, organization_view.js:4-10). AD46 forbids world ids in shared UI, not kind nouns, so this is allowed, but the nouns are *world voice* and belong in data | VAR with a wording risk | Move nouns to the kind palette data; the view stays pure |
| RF4 | `gatherings.js` is the meeting facet of a secret group (schedule, seats, secrecy, persona reveal, leave) but has one consumer and no roster, treasury or founder. A second world is needed to validate it (AD51) | INC | Treat as the group's `meeting` facet |
| RF5 | Delegation exists three ways, none joined: foreman commission (one order, C3), bounded mandate repeat at most 3 (shown, simulation.js:372), staff with offices (C8). Only C8 carries a succession rule | INC | One delegation ladder (3.4) |
| RF6 | "Party" in code means a combat helper pairing (C6, C7). Persistent entities need a different word or the two will collide | DIS risk (naming) | Combat grouping stays "party"; persistent entity is "organization" in code (already `organization_view`), "group" in player prose |
| RF7 | `law_case.js` has zero importers, yet founding a group under a law (registered, tolerated, banned, secret) is its natural first consumer | INC | Same unwired gap as lane A R10; a group's `lawStatus` is a law row, not a new rule |
| RF8 | The courtyard is a household business with fixed people (stated, ORGANIZATIONS item 12) and Village is a parity fixture with "no new depth" (PROJECT item 3, stated by lane A) | VAR | Use as a parity fixture, never as the design driver |
| RF9 | LOTM lead lives are the current focus (stated, PROJECT lines 19-20, per lane A). The Tarot gathering is canon; in a forced canon run the club's founding is a pinned world event | VAR | First consumer is LOTM; player founding of *another* club is the alternative-life case |
| RF10 | No stale claim found in the root doc for this topic. One lane A correction stands: `feature_expansion_society` is Village agreed work | STALE (already noted) | Keep "society sheet" for FD14 only; do not name anything `society_*` |

**Net:** nothing duplicates and blocks this lane. The real gaps: no founding verb (RF1), no shared treasury/premises/charter owner (RF2), no joined delegation (RF5), unwired law (RF7), and no word for the persistent entity (RF6).

## 2. Step 2: target outcomes, worked backwards

Viewport for all: desktop first (UI priority); mobile deferred. "Owner" names the existing seam; "gap" what is missing.

**O1. Klein hosts a small divination club of his own** (alternative-life case; the canon club's founding is a pinned event, RF9).
- Sees/does: a "Start a circle" action with three founding choices (name, meeting rhythm, how to admit), a first meeting that needs a place and at least two willing seats; a Reports line after each meeting; a roster of masked seats with a trust word; a "Dues" or barter line.
- State: group def instance, founder, members as positions, meeting schedule, secrecy dial, premises (a hidden room), treasury (barter stock, not coin), shared-knowledge pool (answers given at meetings).
- Owners: gatherings (meeting, seats, secrecy), persona_standing (who sees which face), institution_access (door key as a grant), people_knowledge (what the pool contains), lotm divination rows.
- Gap: group record; founding gate and quorum; premises as an owned site; pool knowledge with leave rules; a second world to validate (O3).

**O2. Village friends start a cooperative mill.**
- Sees/does: a charter picker (who owns shares, how profit splits, who decides), a mill site claim, shifts by members on the duties board, a weekly settle line, an argument when one member skips shifts.
- State: shares per member, treasury, site, duty rota, vote rule, rival (the existing miller).
- Owners: management jobs (operations), duties (FD8), purse/holdings, `faction_rank` standing, obligations ledger for owed shifts.
- Gap: founding gate, shares, charter rule set, a vote/decision verb, split of assets on exit. The courtyard (C2) is the parity fixture.

**O3. Harry's friends form a study group, later a secret defence club.**
- Sees/does: invite three friends (each can decline), pick a quiet room and an hour, a knock or password, a roster with a lookout seat, a "someone is watching" risk; a teacher or prefect ban makes the club unlawful.
- State: group (kind study_circle -> secret_society, a *kind change* with history), meeting schedule inside the school timetable, `visibleTo` set, law status `banned_secret`, informer risk, lessons given by a member who knows more (FD11 lesson, teacher is a member).
- Owners: gatherings, FD8/G5 calendar (AT16), law_case (unwired), lesson.js, people_knowledge, cast_schedule.
- Gap: all of O1 plus the G5 calendar and a law consumer. Fits Harry's lead life because club/prefect/house are institutions in the HP pass (stated, section places and roles; house points code unverified).

**O4. A cultivator founds a sect branch** (Fanren, TTKS, primordial, Reverend Insanity style).
- Sees/does: a licence or tribute agreement with a parent sect, a site claim, recruitment by test (root grade), elders and outer/inner grades, contribution points, tribute duty upward, formation or seclusion hall as a collective act, rival branches.
- State: group with a *parent link* (branch), ladder rows, offices, tribute obligation, premises, collective-act slots, standing with parent.
- Owners: institution_store (contribution), faction_rank (needs per-institution rank, lane A G2), ORG_KINDS sect, obligations ledger, sites rules (SR).
- Gap: parent/branch link; recruitment tests; collective formation act; world-specific legitimacy (a branch can be tolerated, recognised or rogue; dial per world).

**O5. A mercenary band splits over pay.**
- Sees/does: pay day late, a morale word falling, a faction leader emerges, a vote or a walkout, assets divided by the charter rule, two bands afterward, a rival buys the contract.
- State: members' dues/pay paid-through, derived morale, internal bloc, charter split rule, treasury, contract (lane A O4 mission with money reward).
- Owners: lane A positions (contracted), money-paying missions (lane A G3), tempo_allies fear/discipline (derived, shown C7), obligations ledger.
- Gap: group split verb that creates a second group from the first with a division rule; morale derived from pay and losses; the mission money reward.

**O6. A player hires two apprentices and delegates the shop.**
- Sees/does: hire from a candidate list, give each a post and standing orders (open hours, spend limit, what to sell), come back to a report line, a till that is a little short, a key that one apprentice holds.
- State: hires as positions (hired/apprenticed), shop as owned site plus stock, standing orders policy, reporting route, custody of keys, wages owed.
- Owners: home_staff (hire, wages), foreman/mandate (bounded order), FD8 duties, shop_restock, ACR10 (delegate keeps own means and knowledge), obligations ledger.
- Gap: standing-order policy (more than three repeats, a stated scope and cap), a delegation report, keyholder/custody, a shop that is an owned group asset. This is the cheapest *founding* outcome and the best first proof of "run".

**O7. A household settles a homestead that grows into a hamlet** (the Weibao example "choosing to farm").
- Sees/does: claim a plot, build, take on tenants or kin, the group changes size class (household -> hamlet) without a rewrite.
- State: group of kind household, size class, premises list, members with roles, law/tax status with the surrounding polity.
- Owners: home_household, sites/SR rules, MR/SR land, cast people.
- Gap: size-class dial and cohort representation (ACR13, COMPANIONS R1: named few, nameless many).

**O8. An NPC founds a rival circle, church cell or band in the world.**
- Sees/does: a rumour, an invitation, a door that now has a sign; the player can join, ignore, inform on or join as a spy.
- State: the same record with an NPC founder, background-derived roster.
- Owners: event director (FD16, consequence emitter), people_knowledge, cast_schedule (AT17 persistent people, not built; AD33 keeps NPC depth thin).
- Gap: record that does not need the player; NPC founding as a *consequence event* with a seeded draw. Later, per AD33.

## 3. The shared group seam (proposal)

### 3.1 Naming and layering

Code noun: `organization` (already used by `organization_view.js`); player prose: "group", or the kind noun (circle, band, sect). Positions (FD15) stay one person's side. Three layers, matching the repo's pattern (static def, small slice, derived display):

1. **Kind palette** (data, per world, AD46): a starter set of defaults for a kind: club, secret society, company/shop, cooperative, guild, sect or branch, gang, school, church cell, mercenary band, household, settlement. Rows hold founding routes, default ranks, offices, nouns and a law note. Palettes are labelled `authored`, `palette` or `missing`, never shown as canon (FD14 rule). Source: IKP1-IKP12 (stated, doc 33).
2. **Group definition** (data): for authored groups, in a pack; for founded groups, instantiated at runtime from a kind plus the player's charter choices, with the kind revision pinned (ACR11).
3. **Group state** (slice `organizations@1`, additive): small, pointing at other owners.

### 3.2 The record

| Field | Content | Authority (one owner per fact) |
|---|---|---|
| `id`, `world`, `kind`, `revision` | Stable instance id scoped to world instance and era (IOP1) | new |
| `founder`, `founded`, `status` | forming, active, dormant, split, dissolved | new |
| `parent` | Optional parent group (branch, chapter, franchise) | new |
| `charter` | Small set of dial choices, not free rules: admission mode, dues form, secrecy level, meeting rhythm, profit/loot split, expulsion rule, succession mode, split rule. Free text only for the name and a motto | new, validated, size-capped |
| `members` | `{actor: {positionId, rank, joined, paidThrough, status}}`; the person's side is a FD15 position, the entry here is the index | positions@1 holds the term and exit; this holds roster order and rank within the group (fills lane A G2) |
| `offices` | Seats (head, treasurer, keyholder, lookout) with powers and holder | new, powers named (IOP4, IOP8) |
| `treasury` | A holdings account owned by the group id: coin, stock, barter goods | own_holdings custody (inferred; not read in this lane), never a second balance |
| `premises` | Site refs, who holds keys | sites owner; keys are `institution_access` grants issued by the group |
| `meeting` | Schedule, place, seats, secrecy dial | `gatherings` row, generalised |
| `knowledgePool` | Facts the group holds, with who may read | people_knowledge; members read by grant, leaving keeps what a person already knows |
| `standing` | Per audience (town, rival, parent), and per persona | persona_standing / faction_rank pattern; group standing is a fact, not an arbitrary key in native reputation (doc 33 IPR7, stated) |
| `lawStatus` | registered, tolerated, unregistered, banned, secret, with the law row that applies | law_case (to be wired) |
| `rivals`, `allies` | Group ids with a stance | new, thin |
| `history` | Dated lines: founding, joins, exits, splits, disputes | new, bounded |
| `abilities` | Collective acts the group can run (3.5) | defs, see below |

Derived, never stored: morale, culture, reputation words, size class, "who is late with dues" (follow `allyFear`, shown C7; `faction_rank` derives on read).

### 3.3 Composition with FD15 and the rest

- **A founded group is an institution the player owns.** Founding writes: the group record, a `head` or `founder` office, the founder's position (kind `member` or `sworn`, rank top), and a `premises` claim. Joining writes a FD15 position whose `entry` gate is the group's admission mode. Leaving uses the FD15 exit table (resign, dismissed, buy out, transfer, desert); a group adds only `split` and `dissolve` at the group level.
- **Dues and pay** are `purseEffect` and obligations on the position, destination the group treasury (IOP5: dues have a destination).
- **Duties** are FD8 defs from the charter (meeting attendance, shifts, watch); a miss is settled by `settleMisses`, not a special rule.
- **Lessons** are FD11 lessons given by a member; the group's `knowledgePool` can seed lesson availability.
- **Rank inside the group** is stored on the member index (fills lane A G2); region `faction_rank` stays for the town's view of the group.
- **Discipline** is a law row (group rule or outside law) through `law_case` once wired.
- **Several groups at once** are allowed by default (IOP3); a `rivals` entry creates a conflict as a known dispute, not a block.
- **Guard** (stated): holding a seat grants no skill, knowledge or consent.

### 3.4 Delegation and hires (ACR)

One ladder, three rungs, each rung adds scope and risk; the ladder is the *dial*:

| Rung | Form | Exists today | Gap |
|---|---|---|---|
| L1 Commission | One order, fee paid up front, supplied inputs, one result | foreman (shown, C3) | generalise beyond Orin |
| L2 Standing order | Policy: scope, spend cap, hours, what to do on a surprise; repeats; stops on a breach | bounded mandate, at most 3 (shown, simulation.js:372) | cap and scope fields; breach branch |
| L3 Office | Delegate holds a seat with powers; fund and policy pass to a successor | home_office (shown, :1-4) | any group, with keys/custody and a report |

Rules (stated, ACR10, ACR6, ACR7): the delegate has their own stamina, motives and knowledge; results come back through a **reporting route** (a Reports line, a ledger entry), not as instant knowledge; work done, goods delivered and pay settled stay distinct stages; an interrupted job settles what happened. Hiring is a FD15 position of type hired or apprenticed; the person in it is a real actor.

### 3.5 Group abilities (what a group can do that one person cannot)

| Ability | What it is | Existing base | AD51 call |
|---|---|---|---|
| Party roles | Each task names roles and assigns a real executor with fitting functions and willingness | NONHUMAN_BONDS section 5 (stated); `PARTY_HELPER` hard-coded (shown) | Share the role/executor frame; combat resolvers stay world-local |
| Collective act | N participants fill role slots for one job; results settle once, credit to named recipients | simulation jobs carry `participants` (shown, foreman.js) | **Share the slot frame only.** A sacrifice rite, a cultivation formation, a spell circle and a work crew have different effects; flattening them is the AD51 failure case |
| Command and morale | Orders heard by chance; fear/discipline derived | tempo_allies (shown) | Share the derived-morale function; inputs (pay on time, losses, leader present) are local |
| Shared knowledge | A pool members read by grant | people_knowledge, institution_access | Share |
| Joint venture | Two groups or members fund one job, split by charter | none | Share as a job with two payers; defer |
| Meeting | Scheduled gathering with seats, secrecy, trade | gatherings (shown) | Share; LOTM first, HP second |
| Recruit | A candidate meets an entry route and a gate; someone vouches | IKP entry rows (stated) | Share the gate frame; routes are local |

### 3.6 NPC-founded and authored groups

Same record. An authored group (a church team, the Guild, a house) is a def with derived state; background members are cohorts (ACR13: pools summarise, named people keep bindings). An NPC-founded group comes from a **consequence event** (FD16) that instantiates a kind with an NPC founder. Promotion to detail happens when the player's choice touches a member. Gated by AT17 and AD33; first slice: no NPC founding, authored groups only.

### 3.7 AD51 split test

| Piece | Plausibly shared by 2+ worlds? | Verdict |
|---|---|---|
| Group record (charter dials, roster index, offices, history) | Yes: LOTM clubs and church teams, HP clubs and houses, MoL guild and study groups, Fanren sects, Soldier's Life squads, Village cooperative | **Shared** |
| Kind palettes and nouns | Shared shape, local words | **Shared shape, local data** (RF3) |
| Treasury, dues, tribute | Yes | **Shared via holdings and obligations** |
| Premises and keys | Yes | **Shared via sites and access grants** |
| Meeting facet | LOTM (shown) plus HP, MoL | **Shared** (second world validates) |
| Secrecy and cover | LOTM masks, HP secret club, sect hidden branch | **Shared via persona_standing and `visibleTo`** |
| Law status and registration | Every world has a law of the small | **Shared seam, local statutes** |
| Succession and splits | Yes, with local rule (heir, vote, exam, ordeal, seniority) | **Shared verb, local rule** |
| Rank ladders | Shared shape (AD51 names it), local ladders | **Shared** |
| Collective rite or formation effects | Different mechanisms | **Split**: share slots only |
| Patron-client sponsorship (ORV stream contract, constellation sponsor) | One world | **Local** until a second world uses it |
| Belief, doctrine, tithes | Church only | **Local** to church kinds |
| Combat party resolution | Shared frame already | **Already shared** (conflict_frame) |
| Parent/branch link | Sects, churches, companies, clans | **Shared** |

Dial for scale: pair (apprenticeship), band (3-12 named), organization (13-200, named leaders plus cohorts), polity (nameless many). One record, different cohort handling (ACR13).

### 3.8 Save impact

- New slice `organizations@1`, additive, fresh when absent (same pattern as `duties@1`, shown by lane A). No old save changes.
- Pairs with `positions@1` (lane A); neither writes the other's facts.
- Existing groups start as **projections**: the courtyard adapter must reproduce its current descriptor (parity fixture); the LOTM gathering row becomes a group def with a meeting facet; Lio stays as a party helper. Stored state exists only for what old code could not hold: a founded group or a new hire.
- Founded groups store player-chosen text: validate length, character set and count; reject on import; treat as private save data.
- Treasury lives in holdings; deleting a group settles its account (to members, parent or estate by the charter rule), never silently destroys stock.
- Content revision: a founded group pins its kind revision (ACR11) so a pack change cannot rewrite a charter.
- Heir carry: the group is not embedded in the founder's actor. A lead life ending hands the group to the successor by its succession rule (IXT8, stated; heir carries half standing, not rank, shown).
- Proof plan (AD36 floor): focused test for invariants (member needs a def, treasury has one owner, split conserves stock and debts, dissolve settles); parity test for courtyard and LOTM projections; desktop browser proof for O1 and O6; save, reload and import for any stored group. All of this is a plan, not run.

## 4. Small details checklist (where each lives)

| Detail | Home |
|---|---|
| Meeting time and place | `meeting` (schedule, place); windows from G5 calendar |
| Password, knock, mask | `visibleTo` plus a knowledge gate on the door grant; masks via persona_standing |
| Who holds keys | `offices.keyholder` plus access grants; losing the holder revokes or leaves a locked door |
| Bookkeeping | group ledger over the obligations ledger: dues owed, paid-through, treasurer entries; an audit reveals a shortfall |
| Who knows the group exists | `visibleTo` / `knownTo` per audience; the informer is a member who passes a fact |
| A member leaves with secrets | Personal knowledge stays (grant rule: a lapse never touches the subject's own skill, shown lane A); leak is a chance event weighted by grievance and oath; oath is a world option (LOTM verbal oath net, stated F20) |
| Joining on a vouch | `entry` gate reads `history` and a sponsor fact (lane A M1) |
| Name and motto | Only free text; length-capped |
| Rival poaches a member | Offer to a member from another group; position conflict rule (lane A 2.5) |
| Dormancy | Missed meetings derive "quiet"; no event spam |

## 5. More to consider (round 1, 2026-11-06)

New angles relative to FD14, FD15, lane A and doc 33. Levels: ACT NOW = done by being saved here; ACCOUNT FOR NOW = leave room in record or rules at no extra build cost; LATER = named work with effort and done check.

| Code | Angle | Level | Effort | Done check |
|---|---|---|---|---|
| F1 | **Charter as dials, not text.** A small fixed set of choices (admission, dues, secrecy, split, expulsion, succession, meeting rhythm) with a stated consequence each. Free text stops at name and motto. This is what makes a founded group testable and importable. | ACT NOW (saved in 3.2) | none | Record shape lists charter dials only |
| F2 | **Quorum for founding.** The bottleneck is people and trust, not coin. A group needs N willing founders (pair, trio) and each can decline; the membership guard means no member joins without consent. | ACCOUNT FOR NOW (`status: forming`) | field | A group stays `forming` until the quorum accepts |
| F3 | **Canon-locked founding.** In a forced canon run the canon club is a pinned event and the player's founding shows locked ("Not how it happened"); the alternative life may found a different group. | ACCOUNT FOR NOW (lane A M8 `canon` field applies to a founding offer) | field | Founding offer can render locked |
| F4 | **Meetings are the time unit.** Offline or fast-forward, settle a group per meeting (dues, duties, news) not per minute. Fits ACR and `world_rhythm`. | ACCOUNT FOR NOW (settle on meeting) | none | A skipped fortnight settles two meetings once |
| F5 | **Kind change with history.** Study circle -> secret society; cooperative -> company; band -> sect. Kind is a field with a history line, not a different record. | ACCOUNT FOR NOW (`kind` plus `history`) | field | A kind change appends history and keeps members |
| F6 | **Keys as grants.** Premises access is an `institution_access` grant issued by the group, so lock-outs, spare keys and stolen keys fall out of existing rules. | ACCOUNT FOR NOW | none | A revoked key blocks one door and keeps the person's skill |
| F7 | **Informer and leak model.** A member's loyalty is a derived function (grievance, oath, offer), a leak is a seeded draw (`seeded_streams`) that writes a fact to a named audience. | LATER | 1 session after F2 | An informer leak writes a fact once, replay-stable |
| F8 | **Group standing is a fact, not a reputation key.** Doc 33 IPR7 already warns native three-region reputation takes no arbitrary keys; group standing per audience is its own fact set. | ACCOUNT FOR NOW | none | No new key in native reputation |
| F9 | **Split verb conserves stock and debt.** Creating a second group from the first divides treasury, premises and owed duties by the split rule; no duplicate or lost item. | LATER, with O5 | 1 session | Split test conserves totals |
| F10 | **Dormant and dissolved groups leave traces.** A closed club leaves a locked room, rumours, an old roster that people_knowledge may still hold. | LATER | small | Dissolved group's room and rumour persist |
| F11 | **Members as loans.** Group kit lent to a member (Village lantern kit loan, shown lane A) generalises to group stock on loan with a return duty. | LATER | small, reuse obligations | Loan appears as an owed item and settles on exit |
| F12 | **NPC founding as a consequence event.** FD16 draws "someone starts a rival circle" when conditions hold (quiet town, an ambitious NPC, a vacancy). | LATER, after AT17 | 1 session | A seeded run produces the same founding |
| F13 | **Name hygiene.** Persistent entity = `organization`; "party" = combat helpers; "society" = Village agreed work and FD14 sheet only; no `guild_*` or `club_*` module names | ACT NOW (saved in 1.3 RF6) | none | grep shows no new `guild_`/`club_` filename |
| F14 | **Group ledgers feed the Owed panel.** Dues, shifts and loans owed to or by a group appear on the existing owed ledger; no second ledger (ORGANIZATIONS O3: money strip links, adds none). | ACCOUNT FOR NOW | none | Owed panel shows a dues row from a group |
| F15 | **Credit goes to a group sometimes.** A discovery made by a club is credited to the club (doc 33 IXT5), which changes who is known and who is blamed. | LATER | small | A group credit line appears on a Report |

## 6. Gaps (ranked)

| Rank | Gap | Evidence | Why it matters |
|---|---|---|---|
| G1 | No group record or founding verb | RF1, RF2; no src hit for founding | Every outcome O1-O8 |
| G2 | No shared treasury / premises / keys owner | C10 has no treasury; C4 has no premises | Dues, tribute, cooperative, shop |
| G3 | Delegation is three disjoint prototypes | RF5 | O6, O2, O5 |
| G4 | Law status and registration unwired | `law_case` 0 importers | O3 secret club, O4 rogue branch |
| G5 | Rank and office inside a group have no owner | lane A G2 | O4, O5 |
| G6 | One consumer for the meeting facet | gatherings 1 importer | AD51 needs a second world |
| G7 | Group split/dissolve/succession verbs absent | home_office has only pantry-office succession | O5, O7 |

## 7. Suggested order (lane view, proposal)

1. **Read side first, no save change:** a group definition format and a projection that reproduces the courtyard descriptor and the LOTM gathering as groups (RF3 nouns to data). Proves the shape without risk.
2. **`organizations@1` with one founding route** where the cost is lowest and the value highest: **O6, hire and delegate a shop** (L1 to L3 ladder, keys, report), then **O1 a small gathering** on the existing gatherings code. Together they cover coin-based and secret-meeting groups.
3. **Second-world validator for the meeting facet:** HP study group after the G5 calendar (AT16), or the MoL student circle (stated in the MoL pass as a recruited fourth for a posted job).
4. **Money-paying missions and `law_case` wiring** (shared with lane A G3), then splits (O5) and sect branch (O4).
5. **NPC founding** after AT17 and the event director.

Open build-order question for Weibao (effort and order, not design): may the read-side projection (step 1) ride alongside the AT15 fight lane, since it changes no save? Default if unanswered: alongside.

## 8. Verification state

- Source read: heads of `organization_view`, `organization_source`, `foreman`, `gatherings` (to line 60), `party_battle`, `party_content`, `party_partner_facts`, `companion_roster`, `book_world_shadow_company_domain`, `home_household`, `home_staff`, `home_office`, `household_brood`, `tempo_allies`, `material_apprentice`, `heir_inheritance`; `simulation.js` lines near 321-372 by grep only; `faction_rank` exports by grep.
- Docs read: root doc and lane A (whole); ORGANIZATIONS.md (lines 1-223, partial skim); doc 33 sections 1, 2, 5, 7, 8; NONHUMAN_BONDS section 5; COMPANIONS R and S; ACR rows by grep; RULES_INDEX AD46, AD51; world institution passes by keyword grep, not read whole; LIFE_SIM_NORTH_STAR and PROCEDURAL by keyword grep.
- Not read: `own_holdings.js` (treasury-as-holdings-owner is inferred), `world_events.js`, `law_case.js` body, `jurisdiction_rules.js`, Tarot gathering audit (`docs/gm/dispatch/refinement-audits-2026-10-31/TAROT_GATHERING_AND_RITUAL_SCENE_AUDIT.md`), the LOTM pack's actual gathering row, HP house points.
- Importer counts are grep of static imports in `src/`; companion_roster showing zero is the one most likely wrong if a dynamic import exists.
- Nothing run. No test, build or browser check.
