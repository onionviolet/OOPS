# L4d checkpoint, 2026-10-28

Status: **implemented, below floor; G1 and G3 renderer changes pending ownership**.
Agent-verified source/focused/native-headless checks, not human-reviewed. No commit, staging,
stash, reset, force, push, or user-save access. This lane's owned writes are
released to the coordinator. This is a partial brief delivery, not completion of G0–G3.

Authority: [L4d brief](L4D_FIXES_BRIEF.md), [L4c inventory F1](L4C_CHECKPOINT.md#f1-implementation-and-owned-files),
[cast card](../CAST_LIVES_CARD.md), AD1/AD6–AD8/AD34/AD36/AD43,
AR1–AR16, CLR3/CLR9–CLR11, UR70–UR75 and
[UI instructions](../../../../../.claude/rules/player-ui.md).
Seam: existing LOTM native definitions, host, domain, district and save-envelope
validation. Location and elapsed time remain simulation-owned. No core owner
files, new cyclic edges, save schema changes, or private pack edits.
Target: existing place-service panel and header at **1920×1080 desktop**.
Visible intended result: resident place/day/band, local talks and travel, with
known remote people under Elsewhere. Mobile and further beat execution deferred.

## F1. Changes and ownership

| Owned file changed this turn | Change |
| --- | --- |
| `src/book_world_lotm_cast_days.js` | Background fetch, loaded-pack getter, explicit ready promise and derived day/binding functions; no top-level await. |
| `src/book_world_lotm_cast_host.js` | Derive definitions after pack resolution; validate/install them in existing simulation maps once per registry. Remote principals have no local talk command. Elsewhere projection reads player knowledge. |
| `src/book_world_lotm_districts.js` | Resolve pack travel district through the loaded-pack getter. |
| `src/book_world_lotm_lives.js` | Resolve the beside profile through the loaded-pack getter. Four original profiles unchanged. |
| `src/book_world_lotm_host.js` | Install late definitions before host operations; await readiness inside async beside crossing; expose resident, Elsewhere and relative clock view data. Move labels derived on demand. |
| `src/book_world_lotm_domain.js` | Register late native cast places and validated definitions, then refresh the existing panel. |
| `src/book_world_lotm_envelope.js` | Read current cast place IDs during validation instead of capturing the empty boot array. |
| `tests/lotm_cast_week.test.js` | Complete original-profile view byte hashes with/without pack; remote principal/knowledge projection; relative day/band; synchronous module target and never-resolving fetch; late pack after registry construction. |
| This checkpoint | Scope, receipts and remaining gates. |

Inherited L4c changes outside this list were preserved. This lane did not change
`src/book_world_lotm_ui.js` or `src/village_workspace.js`.

## F2. Brief gaps and unowned UI seams

- **G0 source/focused verified:** private I/O no longer holds application module
  evaluation. The cast start stays hidden during an unresolved fetch. Resolving
  after registry construction permits normal validated enrollment and walking.
  The requested two native suites still require an unrestricted runner below.
- **G1 incomplete:** the resident flag is projected, but probationer panels still
  render until the UI patch is adopted. The four original profiles' complete
  host views match byte for byte with and without the private fixture.
- **G2 source/focused verified, renderer incomplete:** remote principals have no
  local talk command or away-room disclosure. Unknown principals produce no
  Elsewhere rows; a known synthetic principal produces exactly one city row.
  The real pack has no `city` field on its two remote destinations; projection
  says “lives elsewhere” rather than inventing a city or exposing a room.
  Private source-backed city/region labels remain coordinator work.
- **G3 partial:** host exposes `Day 2, morning` from the existing beside elapsed
  clock, with no civil month/year claim. The shared header needs its UI seam.

The user's “touch only your owned files” instruction and L4c F1 exclude the two
renderer files. An asynchronous ownership request remains unanswered. A concrete
patch is prepared at `/tmp/l4d-ui-ownership.patch`, syntax-checked through
`/tmp/l4d-book_world_lotm_ui.js` and `/tmp/l4d-village_workspace.js`.
It gates the resident's probationer blocks, shows Elsewhere rows, and projects the
header from `frame.history`'s beside clock, retaining world weather if supplied
and otherwise using the neutral day/band line. **Not applied, built, tested in
integration, or browser-verified.** Coordinator must inspect current versions
before adopting it; this patch is not permission to edit another lane's files.

## F3. Checks, command / result / gaps

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/lotm_cast_week.test.js tests/book_world_lotm_cast.test.js tests/book_world_mol_cast.test.js` | PASS 12/12; `/tmp/l4d-focused.log`. | Invented fixtures; source behavior only. Full suite belongs to coordinator/committer. |
| `node --test tests/cheat_cards.test.js tests/native_save_fixtures.test.js` | 3 PASS, 2 BLOCKED by `listen EPERM: operation not permitted 127.0.0.1`; `/tmp/l4d-native.log`. | Native loader/browser portions cannot start their localhost server. No passing claim for those portions. |
| `BUILD_OUT=/tmp/yairpg-l4d npm run build` | PASS; `/tmp/l4d-build.log`; SHA-256 below. | Contains source changes only; pending UI patch excluded. Tracked index/dist untouched. |
| `node /tmp/l4d-headless.cjs` | PASS fresh Village entry, two timed walks, present greeting, away refusal, Save/reload/Export/Import, zero page errors; matching reload/import canonical state hashes `aa11c67457159482`. `/tmp/l4d-headless.log`, `/tmp/l4d-headless-journey.json`. | Current instrumented native source through the local game worker, not proof of the minified bundle or a browser screenshot. Clock acceleration, no placement fixture. |
| `node /tmp/l4d-browser.cjs` | BLOCKED: Chrome exits SIGABRT at launch, cleanup reports `kill EPERM`; `/tmp/l4d-browser.log`. | No page reached, no zero-page-error claim, no screenshots. Copy of requested browser script targets isolated L4d build. |
| `npm run check:arch` | PASS, main -30, display -37, save 0; 6 grandfathered main imports, 205 grandfathered cyclic edges, no growth; `/tmp/l4d-arch.log`. | Shared-checkout inputs, no combined frozen candidate. |
| `npm run check:rules` | PASS, 0 warnings, 16 receipts, 0 problems; `/tmp/l4d-rules.log`. | No accepted rule/direction changes. |
| `node scripts/check_private_cast.mjs` | PASS both real packs. | No private pack modification. |
| Same checker, absolute script path from a fresh empty temporary cwd | PASS, both print `skipped: private pack absent`, exit 0. | No live pack renaming or save access. |
| `node --check /tmp/l4d-book_world_lotm_ui.js` and `node --check /tmp/l4d-village_workspace.js` | PASS. | Syntax only for unapplied patch. |
| `git diff --check -- <owned tracked paths>` plus trailing-whitespace scan of new lane sources/tests | PASS. | No Git writes. |

Build SHA-256: `2e6dea6394d497b36f468ff834626fe3412b41db90847f43f08d3012f7a46bb5`.

## F4. Delivery floor, FLR1–FLR6

| Floor | State and evidence |
| --- | --- |
| FLR1 | PASS isolated rebuilt bundle with hash above. Pending renderer patch excluded. |
| FLR2 | PARTIAL: focused fixture journey, late-pack enrollment/walk and native-headless fresh Village route pass. Rebuilt desktop browser blocked at launch. |
| FLR3 | BELOW FLOOR: resident-specific view data verified, but G1/G2/G3 render changes await ownership/adoption; no required screenshots. |
| FLR4 | PASS at focused scope: talks retain existing knowledge effects, walks retain normal jobs; no local command for remote principals. |
| FLR5 | No save format changes. Focused saved walk/envelope and pack-absent restoration pass; native-headless Save/reload/Export/Import pass with matching state hashes. Literal browser Save/reload/Export/Import blocked. |
| FLR6 | **Implemented, below floor; agent-verified at source/focused/native-headless scope, not human-reviewed.** No installed, committed, pushed, or deployed claim. |

Coordinator gates: adopt the UI seams under ownership, supply source-backed remote
residence labels if known, rerun requested native suites, rebuild, and run the
1920×1080 browser journey on the resulting hash. Add resident-flat/day-band and
known Elsewhere screenshots to start-choice, present-talk and away-refusal
screenshots in a private folder. Full `npm test` remains coordinator pre-commit.

## F5. Final source identities for coordinator adoption

| Changed input | SHA-256 |
| --- | --- |
| `src/book_world_lotm_cast_days.js` | `f634a846ce3043785f8ba7e2192de0739729cb8a43f699177d22de5831ab7c71` |
| `src/book_world_lotm_cast_host.js` | `ba7e3c4424785ea80505fac4e5f213d1616f9f9a229041034d3921757562ad70` |
| `src/book_world_lotm_districts.js` | `360eeaad3f1e645063b24756390a741cd3aadf73c061cea85493e7009db8cbc3` |
| `src/book_world_lotm_domain.js` | `0a3099a4acea7e165a1f834848ee8ad3c9aab4bdbb10a83a3b1f182dd0c1b5a3` |
| `src/book_world_lotm_envelope.js` | `cc3b27a67fa239635557badebb285885a1fcd4ec59b2099d4bcc55b3e153aa02` |
| `src/book_world_lotm_host.js` | `dbbed65e8d635017baa5e4e04e8173536955cc14a5960bd6faa22ab40375a395` |
| `src/book_world_lotm_lives.js` | `7a6122cf14bbfd8ef1beab02c7e767a4514fe50a05f3f7b6f796d833e44206ef` |
| `tests/lotm_cast_week.test.js` | `e48f957c0e599bb8f6e5070848a34b0d27b69ebafa5764c701d951980a696122` |

## Coordinator completion, 2026-10-28

Applied L4d's prepared UI patch (`src/book_world_lotm_ui.js`, `src/village_workspace.js`) after review; no
new import cycle. Coordinator fixes: the beside header uses `TIME_BANDS` from `src/cast_schedule.js` so it
agrees with away lines; G2 remote rule: a principal is remote when listed in `remoteWhereabouts` or when
every schedule place has no travel row (an unplaced person stays "not known"), as exported
`isRemoteCastPerson` with its own focused test.

| Check | Result |
| --- | --- |
| `node --test tests/lotm_cast_week.test.js` | PASS 9/9 |
| `BUILD_OUT=/tmp/yairpg-l4c npm run build` | PASS, bundle `11cf2385ba483f5b83f8167dbe5eb98d53859887a670a6c9a0c5007213bb1ad2` |
| `node /tmp/l4c-browser.cjs`, headless Chrome, fresh origin, 1920×1080, natural route | PASS: zero page errors; resident sees no probationer blocks (G1); header "Day 1, night" (G3); remote principal absent from Tingen talks (G2); present talk enabled; away reasons shown; browser Save, reload, Export, Import keep clock and positions. Screenshots private (CLR3) |
| `npm test` | PASS 3,676/3,676 (the four G0 failures fixed) |
| `npm run check:arch` | PASS, no growth, 205 grandfathered edges |

Floor: FLR1-FLR5 pass; FLR6 agent-verified, not human-reviewed. **The beside start meets the AD43 floor.**
Remaining polish (not floor): the panel's section header still reads "Tingen workroom" in the resident's
flat; the Places list is long (UR42 grouping by district would help).
