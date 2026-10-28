# L4c checkpoint: private cast, travel and resident entry, 2026-10-28

Status: **implemented, below floor**. Source/focused and local native-headless
journeys are agent-verified, not human-reviewed. Desktop browser evidence is
blocked by this lane's sandbox. The requested whole-tree zero-name gate also
has pre-existing hits outside this lane. No commit, staging, stash, reset, force,
push or user-save access occurred. Owned writes are released to the coordinator.

Authority: [L4c brief](L4C_PACK_TRAVEL_ENTRY_BRIEF.md), [L3m brief](L3M_PRIVATE_PACK_BRIEF.md),
[L4a checkpoint](L4A_CHECKPOINT.md), PROJECT book-world private-pack direction (AD1).
Rules: AR1-AR16, AD1/AD36/AD43, WER3/WER9/WER11/WER16, UR70-UR75 and
[the player UI rule file](../../../../../.claude/rules/player-ui.md).
Surface: existing Tingen place-service panel, target **1920×1080 desktop**.
Visible outcome: optional beside start, resident entry answers, distinct named
cast destinations with timed walks, a present greeting and visible away reasons.
Mobile optimization and later beat execution are deferred.

## F1. Implementation and owned files

| Path | Ownership/change |
| --- | --- |
| `src/book_world_lotm_cast.js` | New, inherited or rewritten lane file |
| `src/book_world_lotm_cast_days.js` | New, inherited or rewritten lane file |
| `src/book_world_lotm_cast_host.js` | New, inherited or rewritten lane file |
| `src/book_world_mol_cast.js` | New, inherited or rewritten lane file |
| `src/book_world_lotm_content.js` | Minimal LOTM integration hunk |
| `src/book_world_lotm_districts.js` | Minimal LOTM integration hunk |
| `src/book_world_lotm_domain.js` | Minimal LOTM integration hunk |
| `src/book_world_lotm_entry.js` | Minimal LOTM integration hunk |
| `src/book_world_lotm_envelope.js` | Minimal LOTM integration hunk |
| `src/book_world_lotm_host.js` | Minimal LOTM integration hunk |
| `src/book_world_lotm_lives.js` | Minimal LOTM integration hunk |
| `src/book_world_lotm_state.js` | Minimal LOTM integration hunk |
| `tests/book_world_lotm_cast.test.js` | New, inherited or rewritten lane file |
| `tests/lotm_cast_week.test.js` | New, inherited or rewritten lane file |
| `tests/book_world_mol_cast.test.js` | New, inherited or rewritten lane file |
| `scripts/check_private_cast.mjs` | New, inherited or rewritten lane file |
| `private_packs/lotm-cast/cast.json` | Ignored private data, host profile/situation texts, day bindings and district travel metadata. |
| `private_packs/mol-cast/cast.json` | Ignored private data; no MoL runtime host added. |
| `private_packs/manifest.json` | Add two supplementary JSON paths. Existing world-pack paths retained. |
| `L4C_CHECKPOINT.md`, `L3M_CHECKPOINT.md` in this directory | Receipt and pointer. |

The small sibling `loadPrivateCast()` in the day bridge reads the existing
manifest's `supplements` field, fetches listed JSON if present and validates it.
No core `content_packs.js`, `main.js`, `display.js` or `save_files.js` change.
The data bridges retain validators/probes, with no people/place/source rows.
The day bridge reads private bindings instead of embedding their calendar data.

Native registration and envelope validation stay inside LOTM files. Pack travel
metadata selects concrete local addresses; remote and anchor-only addresses are
not offered as walks. A private, authored neighbourhood lodging starts the
resident near the household without folding any cast address into an original
place. District assignments are bounded proposals, stored in the private pack.
Travel uses the existing native timed-job mechanism and district link minutes;
the stated same-district default is 2 minutes. The four original profiles keep
their action lists, exact move-ID lists and byte-identical nine entry answers.

The resident has no church home affiliation, church probation or reporting duty.
The local purse replaces carried money as before; the existing entry record
retains money left behind. The profile's label/blurb and situation label come
from the pack. The start is hidden when the pack is absent.

## D1. Compatibility and failure cases

No save schema or profile ID changes. The new resident lodging applies to new
lives; prior beside lives retain their saved place. Existing four starts retain
their behavior. Private data now stays out of source and the public bundle.

Pack-absent beside saves retain their exact actor bodies, positions, knowledge
and queued travel settlement. Domain validation reconstructs name-free dormant
registry/place placeholders from those saved identities. No schedule or new
meetings are granted while the pack is absent. The panel says
“Cast unavailable: private pack absent”. Restoring the pack resumes its clock
projection from the existing simulation clock.

Named failure scenarios checked: an active native cast walk must pass the LOTM
exact-job guard; absent packs must not strand the loader on missing cast or role
body definitions; an original-location-to-cast walk must survive absence despite
uppercase letters in its existing command ID; retained last positions must not
permit an away greeting. Synthetic regressions cover those cases.

## F2. Checks, input identity and evidence

Public build: `BUILD_OUT=/tmp/yairpg-l4c npm run build`.
Bundle SHA-256: `7bb774f1db150a09816f1f1762ae1e4945e930cb40f72eb0783109451e42c66d`.
Tracked `index.html` and `dist/` were already dirty and were not written by this
lane. The isolated build's standard resource links point to the checkout.

The source-instrumented native worker used
`/var/folders/xb/njlqv84d65zbhd229mkw85zh0000gn/T/yairpg-headless/game-5039296467262588.mjs`,
SHA-256 `5ae73e74e00576ab880c9569b48f766107d6af3aebd70cd071abc9352178d2a8`.
That route proves native source behavior; it is separate from browser proof of
the minified artifact. Private pack input hashes are listed below.

| Command/route | Result | Gaps |
| --- | --- | --- |
| `node --test tests/lotm_cast_week.test.js tests/book_world_lotm_cast.test.js tests/book_world_mol_cast.test.js` | PASS 8/8, invented fixtures. Four original profiles compared with and without a pack; active travel/envelope and unavailable-role regression included. | Full `npm test` is the coordinator/committer gate. |
| `node scripts/check_private_cast.mjs` | PASS both real private packs. | Real source rows validated separately from synthetic runtime fixtures. |
| `node /tmp/l4c-absent.cjs` | PASS: temporarily renamed both cast folders, checker printed `skipped: private pack absent` twice, beside entry hidden; native import of settled and active-walk test exports, time advance and Save pass; zero page errors. Both folders restored in `finally`. | Headless native route, no browser screenshot claim. |
| `git check-ignore private_packs/lotm-cast/cast.json private_packs/mol-cast/cast.json` | PASS both ignored. | Manifest remains ignored as before. |
| `BUILD_OUT=/tmp/yairpg-l4c npm run build` | PASS, hash above. | Isolated build, no installed-app adoption. |
| `npm run check:arch` | PASS: main -30, display -37, save 0; 6 grandfathered main imports, 205 grandfathered cyclic edges; zero growth/new edges. | Shared checkout inputs, not a combined frozen coordinator candidate. |
| `npm run check:rules` | PASS: zero warnings, 16 receipt checks, zero problems. | No accepted direction/rule changes made. |
| `git diff --check -- <owned tracked paths>` plus owned-new-file whitespace scan | PASS. | No Git writes performed. |
| `node /tmp/l4c-headless.cjs` | PASS fresh Village life, beside entry, first cast destination at 08:02 (elapsed 2), greeting with seen-note consumer, another principal's `Away;` feedback, second destination at 08:07 (elapsed 7), Save, reload, Export and Import; zero page errors. Reload/import canonical state hashes both `aa11c67457159482`. | Same source instrumented by local `game_worker.mjs`, not an MCP-tool success or desktop browser. Clock acceleration only; no co-location/state-placement fixture. |
| Game MCP `game_freeze`, then `game_report_limit` | Both rejected: `MCP tool call requires approval, but approval policy is never`. | Used the same local headless worker directly; no MCP ledger write was possible. |
| `node /tmp/l4c-browser.cjs` | BLOCKED: first localhost listener denied with `listen EPERM`; serverless Playwright route then reached Chrome launch, which exited SIGABRT and reported kill EPERM. | No screenshots or literal browser Save/reload/Export/Import achieved. Script is prepared for an unrestricted coordinator run; `node --check /tmp/l4c-browser.cjs` passes. |
| Lane source/test/script name scan | PASS: zero distinctive principal-name hits across the owned code/test/script files, including new untracked files. | Whole-tree sweep below is not clear. |
| `git grep -i -l -E '<distinctive principal names/aliases>' -- src/ tests/` | NOT CLEAR: 20 residual paths, all verified unchanged from HEAD. | Outside ownership; no unrelated source/test edits made. Exact regex and file census: `/tmp/l4c-final-inputs.json`. Common kinship words are not treated as distinctive names. |
| Same name regex over `/tmp/yairpg-l4c/dist/bundle.js`, line count equivalent to `grep -c` | NOT CLEAR: 3 matching lines. | Residual pre-existing source is bundled. The requested whole-bundle zero-name gate needs coordinator scope. |

Local receipts: `/tmp/l4c-tests-final.log`, `/tmp/l4c-build-final.log`,
`/tmp/l4c-arch-final.log`, `/tmp/l4c-rules-final.log`,
`/tmp/l4c-headless-final2.log`, `/tmp/l4c-headless-journey.json`,
`/tmp/l4c-absent-final.log`, `/tmp/l4c-absent.json`, `/tmp/l4c-browser.log`,
`/tmp/l4c-final-inputs.json`. Generated test saves stay in the private MCP temp
folder, never in this repository. Local worker scripts stop their child in
`finally`; a discarded long step was interrupted before the shorter final run.

### Residual source/test paths, outside lane ownership

All rows below still match the distinctive-name sweep and are byte-unchanged
from HEAD. They include existing original world/recognition code and unrelated
fixtures/tests; this lane has not cleared them.

| Path | Comparison |
| --- | --- |
| `src/book_world_lotm_rows.js` | unchanged from HEAD |
| `src/book_world_mol_actions.js` | unchanged from HEAD |
| `src/book_world_mol_host.js` | unchanged from HEAD |
| `src/book_world_mol_ids.js` | unchanged from HEAD |
| `src/book_world_mol_lore.js` | unchanged from HEAD |
| `src/feature_expansion_book_recognition.js` | unchanged from HEAD |
| `src/lotm_formula_rows.js` | unchanged from HEAD |
| `src/world_packs/book_mol_pack.js` | unchanged from HEAD |
| `tests/fixtures/book_world_native_golden.json` | unchanged from HEAD |
| `tests/fixtures/perf/crowded.json` | unchanged from HEAD |
| `tests/fixtures/perf/fresh.json` | unchanged from HEAD |
| `tests/fixtures/perf/mid.json` | unchanged from HEAD |
| `tests/fixtures/rt_slice1/crafted-high.save.json` | unchanged from HEAD |
| `tests/fixtures/rt_slice1/crafted-low.save.json` | unchanged from HEAD |
| `tests/fixtures/rt_slice1/old-before-slice.save.json` | unchanged from HEAD |
| `tests/fixtures/rt_slice1/town-returned.save.json` | unchanged from HEAD |
| `tests/lead_run_conflict_after.test.js` | unchanged from HEAD |
| `tests/lead_run_merge.test.js` | unchanged from HEAD |
| `tests/people_knowledge.test.js` | unchanged from HEAD |
| `tests/pledges.test.js` | unchanged from HEAD |

## R1. Delivery floor and remaining coordinator gates

- **FLR1 PASS:** rebuilt isolated bundle and hash above. Source-headless identity is separately named.
- **FLR2 PARTIAL:** fresh Village → beside → two real timed walks at two times passes without placement fixtures. MCP tools were rejected; rebuilt desktop browser proof remains blocked.
- **FLR3 PARTIAL:** start texts, visible minutes, no-time-cost greeting, successful observation and another principal's away feedback pass in native headless DOM. Three desktop screenshots remain unrun.
- **FLR4 PASS:** walks occupy and settle through existing jobs; present greeting writes an existing seen-knowledge record; away targets refuse the host command. No new beat resolver or second clock.
- **FLR5 PARTIAL:** native headless Save/reload/Export/Import pass, plus absent-pack settled/active-walk imports. Literal desktop-browser clicks remain unrun.
- **FLR6:** **implemented, below floor; agent-verified at source/focused/native-headless scope, not human-reviewed**. No installed, committed, pushed or deployed claim.

The remaining playable gate is an unrestricted run of
`node /tmp/l4c-browser.cjs` on the named isolated build at 1920×1080, producing
start-choice, present-talk and away-refusal screenshots and literal browser
persistence evidence. The source/bundle zero-name gate additionally needs a
coordinator decision about the unchanged residual files above. Full `npm test`
remains the coordinator's combined pre-commit gate. No history rewrite performed.

## Input hashes for coordinator adoption

Core-owner files touched: zero. New cycle edges: zero. Main registration lines:
zero. The additional LOTM files are the feature's existing native registration,
district, state-validator, envelope and entry seams required by this brief.

| Path | SHA-256 |
| --- | --- |
| `src/book_world_lotm_cast.js` | `2b135536dabb66f5a0b8d058f255bd68c0cfc31b4305f1c68954e4cfb1178a59` |
| `src/book_world_lotm_cast_days.js` | `41e39abfd59adf135ff739afbe6f3ec037c7ca8af62528ff5508143cc2395e96` |
| `src/book_world_lotm_cast_host.js` | `8278dd98f67fd4a93be9dc61e955538a9d6b13ebf0187269e0f042d20f6332a6` |
| `src/book_world_mol_cast.js` | `730438a47bfb33ff28dead36d7ba06eeda207bbc67a7d4f863cd00424d7346d2` |
| `src/book_world_lotm_content.js` | `088a57e37b2844c9060c9d2eb739686f093d37c2f8883fa091b517c53f925dd6` |
| `src/book_world_lotm_districts.js` | `df303e409063bdf12767b6de39930c6874b8da8e64c345f319023f60960d8c50` |
| `src/book_world_lotm_domain.js` | `aeb74494f694be7a0c8927ad50afbdd5ba66798b12c160ce7ab78d1281e4e808` |
| `src/book_world_lotm_entry.js` | `2b8570206b97ed8520d6da39a5baf424f777a0695f2d0edb2d76464847078d12` |
| `src/book_world_lotm_envelope.js` | `f25983621d30e879d3bca24bec96a83f07d8e8a5ef22c731fc755ca166dd0b10` |
| `src/book_world_lotm_host.js` | `2179a3bd74bd97b997859ae988cbe4f725b9d4d3efeec519c4271b80a7b6dbca` |
| `src/book_world_lotm_lives.js` | `e6fed4417a1b2f8d46a441d15bd86c47bb4eb5e02050fc7048fc2f02f3adcf00` |
| `src/book_world_lotm_state.js` | `c911a79d0a9a2e7754b9062df24ecf5c4c13e52fb5311f8905bac882990ec4a5` |
| `tests/book_world_lotm_cast.test.js` | `94437f937b09a03f95fba8691e3fcdef6342284bfdc084612b4c62ebfbe89aac` |
| `tests/lotm_cast_week.test.js` | `3d85d5ffded6f4103d4aca185e4ae64eaeb7043c17b84e8313e7692de8f5235d` |
| `tests/book_world_mol_cast.test.js` | `67220fcfa0af21f3b02ea32dfcbb5c37a07edf49350f31308023a4c3bd1e3f11` |
| `scripts/check_private_cast.mjs` | `0c7ea48d8fe9fbe3198371c909ee3c97e59940d3bbb2e380107fe60060c21103` |
| `private_packs/lotm-cast/cast.json` | `7c10e9682f9ce2b032c7495736d6a447512670407a1225a015be21e40fe4bc46` |
| `private_packs/mol-cast/cast.json` | `3d270439c357d7d2ae1df7aa5f6d17d73d83219f92591de7b5ba7c8a3d07e10f` |
| `private_packs/manifest.json` | `7a6ebc7f1e84e381eecda46a6783903974de76a8356a83583997db43262258c3` |

## Coordinator browser run, 2026-10-28 (unsandboxed)

Bundle `7bb774f1db150a09816f1f1762ae1e4945e930cb40f72eb0783109451e42c66d` (same as the lane's build),
`node /tmp/l4c-browser.cjs`, headless Chrome, fresh origin, 1920×1080. Route: natural from a fresh life
(Village to the beside start, walk to two cast places). Result: present principal's talk enabled; seven
away principals show "Away; usually back by [band] at [place]" or "return time and place are not known";
Save, reload, Export and Import (literal clicks) keep clock and positions. Screenshots hold canon names,
so they stay private (CLR3): `docs/research/novels/lord-of-mysteries/private/cast-evidence-2026-10-28/`.
Page errors: five `get_game_version is not defined`. **Correction (same day): these are this lane's.**
`src/book_world_lotm_cast_days.js` top-level-awaits the private-pack fetch, which holds the module graph
at boot, so `index.html`'s inline call runs before `main.js` assigns `window.get_game_version`. The full
suite fails 4 tests with the same error (cheat_cards 192, 193, 196; native_save_fixtures CN11); HEAD
passes them in a clean worktree and fails them once L4c's source files are copied in. Fix: G0.

Floor: FLR1 pass (hash above). FLR2 pass, natural route. FLR3 partial: the description and away
feedback show, but the screen also shows the gaps below. FLR4 pass (co-location gate, seen note). FLR5
pass (browser Save, reload, Export, Import). FLR6: agent-verified, not human-reviewed. **Below floor
until G1-G3 are fixed.**

| Code | Gap seen at 1920×1080 | Fix owner |
| --- | --- | --- |
| G0 | Top-level `await` of the private-pack fetch blocks boot (the four failing tests above). Load the pack without blocking: start the fetch, keep cast features off until it resolves, and expose the state through a getter the host reads | L4d |
| G1 | The resident's place panel shows probationer content: the Seer pathway, Warden Hale's attention, "Plan the next crossing", the brewing bench and a Nighthawk captain line | L4d |
| G2 | Remote principals (one lives in another city) appear as talk targets with an away line naming a remote room; remote people should read "lives elsewhere" and not offer a Tingen talk | L4d |
| G3 | "Local date unavailable" and "Local weather unavailable" in the beside life | L4d |
