# B1 checkpoint, 2026-10-28

## Round 3: detached start guard, failure feedback, architecture

Coordinator review applied `B1_INTEGRATION.patch` and found F1-F3 in the
1920×1080 browser. The detached start was rejected by the general expedition
write guard, its reason did not reach the panel, and `main.js` exceeded AR1's
baseline by 11 lines. This round changes the applied source, not the historical
patch. The coordinator owns the next rebuilt browser floor.

- F1: `src/fresh_life_start.js` captures only a dedicated be-probe plan during
  the synchronous enrollment call, with the be profile, canon mode and no
  crossing entry. `main.js` permits that plan
  through the expedition guard into the detached envelope; ordinary import-probe
  plans still use the existing refusal. Parent preflight, guarded publish and
  reload are factored through ports. Fixture tests prove the ordering, not the
  live browser transition.
- F2: the detached probe passes its actual failure reason back through
  `src/import_probe.js`; the Tingen panel displays it and says the current save
  is kept. The selected be start describes an independent new life (CL240).
- F3: fresh-life transaction, missing-pack hold, probe capture and new-life Menu
  button moved to `src/fresh_life_start.js`. `main.js` has one registration line
  and one import; `check:arch` reports 10089 lines against 10115, no growth.

Checks, with the complete round-3 source and new test file:

- `node --test tests/lotm_be_seat.test.js tests/seat_profiles.test.js`: PASS,
  16/16. This includes allowed versus unrelated probe capture, captured envelope
  and failure forwarding, guarded parent sequencing and the seat regression;
  no actual native browser was exercised by these tests.
- `npm run check:arch`: PASS, main 10089/10115, display 6730/6767, save_files
  310/310, 205 grandfathered cyclic edges.
- `BUILD_OUT=/tmp/yairpg-b1 npm run build`: PASS; bundle SHA-256
  `a7147d40add853cc86bce3fb078dc34255582dcfcd0295b34f6cfe82cfe719dc`.
- `node scripts/lane_review.mjs` with explicit round-3 paths: FAIL on the
  existing `main.js` baseline, one private-name hit and one top-level await;
  the same check excluding `main.js`: PASS, five source/test files, zero name
  hits, zero top-level await and zero outside-grant paths. Coordinator already
  identified the `main.js` hits as baseline. `git diff --check` on tracked
  round-3 paths: PASS.

FLR1 is built at the hash above. FLR2-FLR5 remain open for the coordinator's
fresh-origin 1920×1080 start, Menu, reload and pack-absent floor and the be
replay; FLR6 is **implemented, below floor**, fixture-checked, not human-reviewed.
The seven L5r rows in the earlier table remain open until the replay.

AD45 known limit and next refactor: the canon action check covers direct beat
fact writes, not indirect effects or resources. D1 should replace that narrow
seam with the planned constraints and reservations. The local pack's
workroom/supervisor date tags still need a consumer; physical possessions,
lead Reports and the full replay remain open. The detached-start port is a
current integration, open to refactoring once the native floor exposes its
actual behavior. No commit was made.

## Resume round 2: canon-run candidate, below floor

The coordinator widened B1's grant to `src/book_world_lotm_content.js` and
directed canon-run mode (LSD103-LSD125). The earlier resume status below is
historical. This round implements a **candidate, not a completed be life**.
The existing host has no `startBe` port; the start is shown disabled until the
integration patch is reviewed and applied. The patch's fresh native route has
not passed a browser run and should not be treated as ready for publication.

Owned runtime changes:

- `book_world_lotm_lives.js`, `book_world_lotm_state.js`: pack-selected be
  profile and additive `runMode: canon`; unknown or reserved modes and a be
  crossing entry are refused with a preserve-the-save reason.
- `book_world_lotm_content.js`: the be branch installs cast without an NPC body
  for the pack-selected lead, uses the native player body, and does not create
  the other profile's supervisor, broker, or stock.
- `book_world_lotm_host.js`, `book_world_lotm_cast_host.js`: independent-entry
  port, dated history knowledge and known names, player-owned lead beat
  projection, a canon beat projection, a narrow explicit-fact refusal seam,
  emergent provenance for cast actions/walks, known-intention wait quotes,
  untaken option rows, and a be view built without other-seat/crossing blocks.
  Missing-pack actions through this host are refused. `canonActionDecision` is
  the D1 replacement seam for reservations; it checks explicit beat fact writes
  only, not indirect effects or resource reservations.
- `book_world_lotm_ui.js`, `perspective_controls.js`: independent start wording,
  canon-run header, in-world place wording and a new system-menu control tag.
- `private_packs/lotm-cast/cast.json`: one additional source-located intention,
  a day-level wait quote, known opening place, 19 recorded untaken option rows,
  and workroom/supervisor date tags. The one-penny purse remains a labelled
  `fill`, proposed-unverified. The tags are **data only** and are not yet
  consumed by the UI; this does not complete CO6.
- `tests/lotm_be_seat.test.js`: seven synthetic checks, including one-body
  enrollment, run-mode refusal, two identical null-player beat projections,
  two identical free walks with emergent provenance, intentional wait/untaken
  view, and host-level missing-pack refusal.
- `B1_INTEGRATION.patch`: proposed, unapplied hunks for envelope and missing-pack
  restoration, a native write hold while the book pack is missing or loading,
  a detached fresh-life probe and guarded publication, and a Menu new-life action.
  `git apply --check` passes. The native hold, fresh-life route, its native save
  contents and Menu action are **unverified**; coordinator review and an
  isolated browser run are required before relying on or committing it.

Important remaining gaps: the current item data records an object present at
the start but does not install a physical possession; actor knowledge is
projected but first-person lead Reports and the diary's full shell remain open;
CO6's dated tags have no consumer; the wider native shell has not been proved
read-only when a be save's pack is absent (only B1 host actions are blocked);
the book's complete choices and canon facts have not been replayed; the narrow
canon-fact check cannot protect indirect changes without D1; and the seven L5r
rows remain unrescored pending the actual be replay. The date of an appointment
is represented as a day-level intention, not an invented appointment time.

| Floor | Round 2 result |
| --- | --- |
| FLR1 | Isolated combined candidate built; bundle SHA-256 `11520d97e2946bf0bbe3be66a22fa6b23984c12bb4f466d973b14830aad65586`. No primary bundle changed. |
| FLR2 | Synthetic and local-pack host fixtures only; no native fresh-life browser route. |
| FLR3 | Partial: intention and disabled-option wording tested in the view model; rebuilt 1920×1080 display unverified. |
| FLR4 | Synthetic walk and wait consumers exercised; full lead playthrough and physical possessions remain open. |
| FLR5 | Synthetic JSON save-envelope roundtrip in the patched scratch candidate; native Save/reload/Export/Import not exercised. |
| FLR6 | Implemented, below floor; fixture-checked, not human-reviewed. |

Checks and identities:

- `node --test tests/lotm_be_seat.test.js`: PASS, 7/7 on the primary source and
  patched scratch candidate. Null-player proof is one synthetic beat, not the
  entire book. Missing-pack proof is host-level, not global shell read-only.
- `node --test tests/lotm_be_seat.test.js tests/lotm_cast_week.test.js`: PASS,
  22/22 on the final primary source, including byte identity of the four
  original starts and the existing beside route.
- Local-pack host fixture: PASS, one player body, no lead NPC body, 15 history
  entries, three known relations and no foreign blocks in the be view. This is
  not a native save or UI test.
- Patched scratch synthetic envelope JSON serialize/parse and
  `validateLotmEnvelope`: PASS; no `lotm.entry`, canon mode retained. This is
  not native Save, Export or Import.
- `BUILD_OUT=/private/tmp/b1-candidate-build npm run build`: PASS in isolated
  scratch after applying the integration patch. An earlier scratch attempt
  failed from missing `locales` and `stories` symlinks; adding them fixed it.
- Headless Chrome smoke attempt: FAILED to launch in this sandbox (process
  aborted before page creation, kill `EPERM`); no browser behavior or screenshot
  claim. Coordinator owns the 1920×1080 browser and L5r replay.
- `npm run check:arch`: PASS on the primary checkout; no reported growth.
- `node scripts/check_private_cast.mjs`: PASS; its validator does not validate
  the new `leadLife` fields or money fill.
- `node scripts/lane_review.mjs` with the eleven explicit owned paths and grants:
  PASS, eight source/test paths, no name hits, no top-level await, no grant leaks.
- `git apply --check B1_INTEGRATION.patch` and tracked-file `git diff --check`:
  PASS. The patch is not applied in the shared checkout.

Pack SHA-256 `f4baca3963e4fd9128933c8540fad738a8781cd6637db4431724a2b60da1eeba`;
patch SHA-256 `c8c4c1cfde619d977a75b40a430a540b1611ea1adcc05a5179d444dcca116355`.
No commit, stash, reset, force or push.

## Resume status, 2026-10-28

The coordinator revised the history probe in `B1_RESUME_MESSAGE.md`: history is
informational rather than a gate, and the other probe gates remain. The earlier
stop below is retained as history, not the current state. **B1 is partially
implemented and below the AD43 floor. It is not a playable be seat.**

The revised probe found eight relevant existing input records: two lead-to-family
relation records, one lead knowledge record, four opening-scene knowledge rows,
and one opening money anchor. Two additional scene steps reference memory. These
are counts of input records, not a claim that each has been independently reviewed
as knowledge the opening mind already holds. The opening source paragraphs then
provided 14 separately locatable candidate memories. The lead has 20 bound
schedule rows, and the pack had two family relation edges: both remaining gates
clear the below-half threshold. The landlord is present as a role record, but
the original pack did not have a lead-to-landlord edge. A source-based relation
was added to the new life data. The source identifies a landlord, not a landlady.
The first scene binds to day 1, night. The source shows a coin and objects in the
room; the complete opening purse, ownership of the room object, and current debts
remain unknown.

Owned outputs:

- `private_packs/lotm-cast/cast.json` (local book pack, not published): additive
  `leadLife` candidate, with pack-selected actor and opening place, 14 memories,
  three dated relations, one object present at the opening, and explicit unknowns.
  Its one-penny purse is a labelled fill and **proposed-unverified**. The source
  supports a coin before payment, not an exact purse; preserve that distinction.
- `src/book_world_lotm_lives.js`: a name-free adapter produces player-owned
  knowledge effects with dates and source locators from the pack. It has no caller
  yet, so none of these records are installed into a live save.
- `src/book_world_lotm_cast_host.js`: for a synthetic be profile the schedule
  projection skips the pack-selected lead actor. Enrollment does not yet remove
  that actor's duplicate NPC body or map their beat identity to the player.
- `tests/lotm_be_seat.test.js`: three synthetic checks of the history projection,
  invalid records and schedule guard. They do not exercise entry, a real save,
  the UI, or a full action replay.
- This checkpoint. No outside-owner integration patch was prepared: the required
  fresh-life and missing-pack save seams have not been implemented or verified.

**Remaining work:** register and gate the be profile; provide a truly fresh life
without continuation/crossing state; enroll only one player-driven body and map
the lead's beat identity and knowledge to it; integrate history and possessions
with their existing owners; connect known duties to Wait until; implement source
filtering, date-sensitive workroom tags and leave-seat Menu action; handle a
missing-pack save read-only; record divergence; verify a full deterministic replay,
save/reload/export/import and the seven L5r rows. `enrollLotmBranch` and the
native domain/entry/save seams are outside the grant and need a reviewed integration
patch. The current `cross()` uses the existing life and can branch it, so it is
not a valid fresh be entry. The schedule guard alone does not prove the one-body
condition. No claim of reproducible L5r steps is made; the seven rows below remain
open until the actual be replay.

Checks on the resumed candidate:

- `node --test tests/lotm_be_seat.test.js tests/lotm_cast_week.test.js`: PASS,
  18/18, including original-start byte identity and the existing beside route.
  The three be tests cover the synthetic producer and schedule guard only; they
  do not meet the brief's complete focused test list.
- `npm run check:arch`: PASS, main growth -30 and 205 grandfathered cyclic edges;
  no growth reported.
- `node scripts/check_private_cast.mjs`: PASS, both installed cast packs. Its
  validator does not inspect `leadLife`.
- Existing `lintAnchors(pack.schedule, lotmAnchorProbes(pack))`: PASS, zero
  schedule conflicts. **Gap:** this lint checks location schedules, not purse or
  relationship values, so it cannot certify the money fill against later anchors.
- `node scripts/lane_review.mjs` with the five explicit owned paths and matching
  grants: PASS, three source/test paths scanned, zero name-hit files, zero
  top-level-await files, zero outside grants. The private pack is not a public
  source scan. A separate name grep on the public changes found no matches.
- `git diff --check` on tracked edits: PASS. Build, full suite, be-seat browser
  evidence and persistence roundtrip not run; no integrated runtime candidate.

Input identities after this resume: pack SHA-256
`fde35a5811ed15aebea7f88ecdee612b310f9b62833ea666d8864333834aaccc`;
merged scenes remain as recorded below. Highest state: focused synthetic checks,
not human-reviewed. FLR1-FLR5 remain open; FLR6 is labelled here. No commit.

## Prior probe stop, superseded by the coordinator's resume

The B1 brief's CLR2 gate is below half: at most **2 memory-related rows / 5 expected**
in the current bound chapters 1-24 slice. Neither has a pre-start date or an explicit
history flag. CLR2 says to stop below half for gated counts. No be profile, runtime
change, pack mutation, test or integration patch was made. This is **not implemented**,
below the AD43 floor, source-inspected and not human-reviewed.

Read authority: AGENTS.md, GROUND_RULES, RULES_INDEX, PROJECT summary, the cast card,
coordinator handoff and plan sections 25-28, plus the runtime/player-UI rule pointers.
Applicable direction remains AD6-AD8, AD43-AD44, CLR1-CLR13, CL245/249/251/264/266/268.
No change to accepted direction is proposed. Intended desktop viewport remains
1920×1080, with mobile deferred.

## F2. Probe evidence

Inputs (read-only; local book pack, not published):

| Input | SHA-256 |
| --- | --- |
| `private_packs/lotm-cast/cast.json` | `7f9a0daa8fb1b268a295b3365abd3e04749eeaa682eee7571e1023d10834fe37` |
| `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/merged-cast-2026-10-28/scenes.jsonl` | `67db2b769c1cb922f66ece05e41e3f9c2ce179267daec5b38c5eb808af45c2a7` |

The merged input holds 429 scenes. The pack binds 60 scene IDs; 58 match merged
rows, and two are host-created reception/escort scene IDs. Counts below use that
binding membership, not chapter inference from numeric scene suffixes.

| Required field | Expected | Observed | Gate result |
| --- | ---: | --- | --- |
| Lead person, home and schedule | 1 person, 5+ rows | 1 person, 20 schedule rows; opening place is available from the first bound lead beat; no explicit person home field | Not below half; home needs explicit derivation |
| Family and landlady related to lead | 3+ | 2 family people with relation edges; no landlady role found in the people records | Below target, not below half |
| Pre-start or memory rows | 5+ | 0 explicitly pre-start or history-flagged rows; 2 memory-related rows even with generous inclusion | **STOP: 2 < 2.5** |
| Opening purse, possessions, debts | 2+ facts | Not completed after gated stop; the beside purse is not evidence of the lead's purse | Informational, not a gate |

The two generous candidates are `lr.lotm.main.003` (a memory-related step object)
and `lr.lotm.main.004` (a recall step). Both scenes are dated after the opening.
Neither supplies five separate historical records, their dates or their ownership.
No source text or canon identities are copied here. Unknown remains unknown (CLR4).

Reproducible count command, run from the repository root:

```sh
python3 - <<'PY'
import json, re
from pathlib import Path
p = json.loads(Path('private_packs/lotm-cast/cast.json').read_text())
root = Path('docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27')
rows = [json.loads(x) for x in (root / 'merged-cast-2026-10-28/scenes.jsonl').read_text().splitlines() if x.strip()]
ids = {r['scene'] for r in p['bindings']['days']}
bound = [r for r in rows if r['beat'] in ids]
dated, memories = [], []
for r in bound:
    dates = [r.get('date') or {}, r.get('dateRef') or {}]
    if any(isinstance(d.get('offsetDays'), (int, float)) and d['offsetDays'] < 0 for d in dates) or any(r.get(k) for k in ('history', 'memory', 'flashback')):
        dated.append(r['beat'])
    if re.search(r'recall|remember|memory|flashback|backstory', json.dumps(r.get('steps', [])), re.I):
        memories.append(r['beat'])
print({'merged': len(rows), 'bindings': len(ids), 'matched': len(bound), 'dated_or_flagged': dated, 'memory_candidates': memories})
assert len(set(dated + memories)) < 5 / 2, 'Reassess B1: history is no longer below half.'
PY
```

## F3. Resume seam and replay status

The coordinator can prepare source-qualified pre-start records in the book pack,
with cause, locator, knowledge owner and dates (or `before start` when the historical
date is unknown), then rerun this probe. A recall action occurring after the start
is not itself evidence that its entire content was known at the opening. The
day-binding history correction is already a separate item in the handoff queue.

The lead's person record exists. `syncLotmCast` currently drives every cast body
from schedule rows, while the native player body is owned by
`simulation.people.player`. B1 must map the pack-selected actor onto that existing
player body and exclude its NPC driver, not add a second body store. No proof of
that mapping was attempted after the data stop.

All seven L5r rows retain their current score. No capability or fidelity credit is
claimed from a proposed seat. The private combined ledger was read, not edited.

| Step | Existing primary gap | B1 rescore |
| --- | --- | --- |
| `lr.lotm.main.001#1` | needs seat: be | Still open; be seat not implemented |
| `lr.lotm.main.001#2` | needs seat: be | Still open; be seat not implemented |
| `lr.lotm.main.002#3` | needs seat: be | Still open; be seat not implemented |
| `lr.lotm.main.003#5` | needs seat: be | Still open; be seat not implemented |
| `lr.lotm.main.004#2` | needs seat: be | Still open; be seat not implemented |
| `lr.lotm.main.005#3` | needs seat: be | Still open; be seat not implemented |
| `lr.lotm.main.005#4` | needs seat: be | Still open; be seat not implemented |

## Delivery floor and checks

| Floor | State |
| --- | --- |
| FLR1 Build | Not run; no runtime edit or candidate bundle |
| FLR2 Route | Not run; no be fixture or fresh be life |
| FLR3 Shown | Not implemented; no UI claim |
| FLR4 Used | Not implemented; no be consumer claim |
| FLR5 Kept | Not run; no persistence change |
| FLR6 Labelled | Source-inspected data stop, below floor; not human-reviewed |

- `python3` JSON probe above: PASS, reproduces the stop (429 merged, 60 bound, 58 matched, 0 dated/flagged, 2 memory candidates); no paragraph-level history extraction performed.
- `shasum -a 256` on both inputs: PASS, identities above; hashes describe this inspection only, not future concurrent writes.
- `node scripts/lane_review.mjs --grant <checkpoint> <checkpoint>`: PASS, outside-grant=0, source files scanned=0; documents are outside its canon/source scan.
- `git diff --check -- <checkpoint>`: PASS; the separate Python trailing-whitespace/final-newline check also passed for this untracked document.
- `node --test tests/lotm_be_seat.test.js`, `npm run check:arch`, build and browser: not run because the gate stopped implementation. No test file created. Full suite and browser floor remain coordinator work after a runtime candidate exists.

Owned output is this checkpoint only. Existing unrelated checkout changes were preserved.
No commit, staging, stash, reset, force or push was performed.
