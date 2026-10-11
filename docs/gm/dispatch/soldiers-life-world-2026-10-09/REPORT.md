# Book world 1: first playable proposal

Phase A is complete. Phase B started only after village-choices checkpoint revision 4 ended with `SRC RELEASED`. No commits or pushes; user saves were not opened or changed.

The rebuilt game supports an optional, data-only content pack fetched from `private_packs/manifest.json` before save loading. Missing or invalid files leave the base game available. Worlds, native safe locations, colleague definitions and activities register through the existing content registries. Public tests use an original miniature workshop. Source-specific content, generated journeys, screenshots and the original assignment are gitignored.

The private first slice offers four premise choices, ordinary carriage or two storage methods, a two-minute drill and five-minute supply duty. The ledger distinguishes carried, stored and delivered stock. Returning kit and the two remaining vials claims one local wage after delivery; local money stays separate from Village coins. Two completed reports allow a local logistics recognition. Three colleagues retain witnessed memory. Existing Village career history can supply an optional reference without invented rank or pay.

## Play

Open the local preview at http://127.0.0.1:8147 and finish the ordinary character opening. In Village, open **Optional worlds**, visit the installed world, choose a premise and accept the kit/supply duty. Drill, stow one vial if using magic, carry out the duty, then deliver by practiced retrieval or by hand. Return kit/stock to claim local pay. **Return to Village** is always available and pauses unfinished local work.

Permanent storage retains its contents when access closes and across visits/saves. Temporary dispel ejects the actual vial into carried custody. The ordinary route needs no magical source. Later injury, exceptional storage breach, command and campaign events are outside this first slice.

## Evidence

- V1: `npm test` passed 273/273 on final JavaScript; `npm run build` passed. Logs: TEST.log and BUILD.log.
- V2: BROWSER.json records fresh-origin rebuilt journeys for all four premise selections, entry/duty/storage/report/return, old schema-3 saves, active and completed reload/file import, absent pack and removed/restored pack. No page errors in the passing run. Screenshots and full named evidence remain private.
- V3: NORMAL_TIMER.json confirms an unmodified native-timer duty and rejected-storage report: no wage or custody publication before a successful retry.
- V4: Privacy check covers tracked working-tree files including dist, plus this task's public source/tests/output. Exact source-title/name matches are absent; private content and source-identifying assignment are confirmed ignored. Evidence: PRIVACY.json.

Compatibility is additive: absent optional state starts empty. Unavailable pack progress remains opaque and dormant; native loading returns to Village. Reinstalling restores access without replaying wages. Unsupported changed pack identities require an explicit migration rather than silent reset.

Initial browser runs exposed calendar cloning and page-startup races. The final source serializes calendar data, loads optional content after native global bindings, and safely handles a not-yet-created item tooltip. Those failures are retained privately; the final receipts supersede them. Remaining scope and acceptance are in ACCEPTANCE_BACKLOG.md.
