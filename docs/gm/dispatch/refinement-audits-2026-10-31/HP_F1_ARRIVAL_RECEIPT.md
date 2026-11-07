# HP lead: the train leaves from the story endpoint (F1 receipt, 2026-11-07)

Fixes F1 of `docs/audits/IDEA_AUDIT_2026-11-06.md` (uncommitted in the primary checkout when this was written, so not linked from this branch): with the private cast, Harry's route could not reach the school from where the story ends. Mechanism only; no player text added or changed. Rules applied: AD43 floor, AD36 lean verification, AR10, CLR3 (the regression cast uses no canon names). Plan owner: [HP whole-world plan](HP_WHOLE_WORLD_PLAN_2026-11-03.md).

## What was wrong

`arrive_school` (W8-A) is declared at the stub's opening room, `book.hp.lead.cupboard`. `withHpLeadCast` appended it unchanged after the cast's acts. The cast's last act (W4 `paddington`) relocates the player to `book.hp.lead.homebound`, and no act or command leads back, so `simulation.js` refused it with "Return to book.hp.lead.cupboard." and the UI hid the button. Reproduced natively below (old build), not just by fixture.

## Change

- `src/book_world_hp_lead_pack.js` `withHpLeadCast`: the train's departure is the location of the cast's last player `relocate` effect (acts in array order) that names a known place. With no such act it keeps the stub's cupboard, so the public stub and the earlier cupboard-only test cast are unchanged. Command order is unchanged. The day-32 gate, `once` and every effect are as before. The earned link is the cast's own final act: only playing it puts Harry at the departure place.
- Default, dial, reason: the train leaves from wherever the cast's story last puts Harry. The dial is the cast itself: when window 5 adds acts that move him (W4 receipt O3), the departure follows automatically. The reason is that the route should continue from the story, not from a fixed room.
- `tests/hp_arrival.test.js`: new test "arrival leaves from where the cast story ends". A synthetic two-place cast commits both acts natively. It checks arrival refused on day 31, eligible on day 32 at the endpoint, landing in the school hall, the stub keeping its departure, and the Sorting eligible after a reload. It fails on the old source (expected the cast endpoint, got the cupboard) and passes with the fix.

## Checks

| # | Check | Input | Result | Gap |
|---|---|---|---|---|
| 1 | Focused tests | `node --test` all 19 `tests/hp_*`, world_pack_hp, world_pack_registry, inquiry_book_lives | 137 pass, 0 fail. New test fails before the fix | Full `npm test` not run (committer's gate) |
| 2 | `npm run check:arch` | worktree tree | PASS, main.js unchanged | |
| 3 | `npm run check:rules` | worktree tree | PASS, 0 new player strings | |
| 4 | Reproduction, old build | bundle `ffe78f5c…` (source equal to the probe's three hashes), cast `766a34c3…` | Fresh life → Beginning → lead life → 56 acts through the panel. Ends at `homebound` on lead day 2. Waited natively to day 32: still `homebound`, no train button. 0 page errors | |
| 5 | Endpoint journey, fixed build | bundle `389f63be…`, pack source `4e786eb8…`, same cast | Fresh origin → 56 acts natively → `homebound` day 2, train shown disabled. Waited natively to day 32: train enabled. Clicked it: `school_hall`, `atSchool`. Sorting: Gryffindor, route complete, Lessons section shown. 0 page errors | Wait uses `Session.step` (the runner's tick stepper), not wall time |
| 6 | Persistence | same run | Save → reopen and literal export → `load_progress` Import both keep location, atSchool, house and clock | |
| 7 | Old save into fixed build | endpoint save `b9a8e730…` from row 4 | **Does not resume**: "Restore the exact beginning content to resume this character. The saved beginning has been preserved." | See compatibility decision |

Route kind: native panel clicks through `scripts/playtest` (Session + NativeContinuation) on headless Chromium at 1920×1080, from a fresh origin, with the private cast served. Not an MCP walk: the game MCP cannot seed a harness save, and 56 acts by single clicks was the slow path. That limit is filed once in `docs/tools/game_mcp_limits.jsonl`. Text sizes 14/21 px were not screenshotted because no UI changed. Review state: agent-verified, not human-reviewed. Scripts and result JSON are in this session's scratchpad. They are not committed because the endpoint saves hold private cast text.

## Floor (AD43)

FLR1 bundle `389f63be…` · FLR2 fresh life by earned steps (harness route, named above) · FLR3 existing button, label, cost and disabled state, unchanged · FLR4 consumer: Sorting, positions and Lessons read `atSchool` · FLR5 save, reload, export and Import exercised · FLR6 agent-verified, not human-reviewed. Every line holds at the scope named in rows 4-6. Tracked `dist/` was restored, not rebuilt.

## Compatibility decision (needs Weibao's call before commit)

The structured life admits a save only under the exact content hash of its beginning. Any edit to the lead definition, this one included, stops pre-change in-progress lead saves from resuming. The save is kept, not changed. Inferred, not tested: every earlier window, school and lesson change had the same effect, by the same code path and the W3 fresh-origin precedent. Default: accept it, as before, because the lead life is in active development with no shipped save state. Dial: a content-revision migration for structured lives, which is a separate seam and not built here. Saves on disk were not touched. The fix does not rescue a save already stuck at the endpoint: under the exact-hash rule that life needs a fresh start (or the migration seam) to reach the school.

## For the prose session

No strings were edited. The train's description ("Your trunk, your ticket and the long train north…") now runs from the endpoint place rather than the opening room. It reads fine there, but it is theirs to judge.

## Compatibility decision (settled 2026-11-07)

Weibao: "honestly, we can abandon past saves, since there is no other player, but the migrate on load could be a good long term idea". So pre-change in-progress lead saves may stop resuming (row 7); the save file itself is kept, not changed. Absorbed into master from worktree `rep-knowledge-b16f3d` by the overnight-run coordinator, after its gates.
