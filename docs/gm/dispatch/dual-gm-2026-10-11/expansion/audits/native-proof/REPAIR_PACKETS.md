# A5 bounded repair candidates

2026-10-11. Audit proposals only. No repair writer dispatched, no path reserved for runtime writes. Reference [REPORT](REPORT.md) and the ignored exact-input/generated-fixture receipts. World-specific content and original packs stay read-only. An authorized builder must recover live ownership and current inputs first.

## P1-UI / F1: remount unchanged native panel

Problem/consumer: `createContentPackPanel.render` returns before reattaching its detached node, while later startup and native location changes clear the actions host. Registration succeeds, but the player cannot find entry. Minimal candidate area: `src/content_pack_ui.js`; focused synthetic DOM lifecycle test plus native fresh/reloaded/entry/return/browser gate. Do not add another panel or special-case private identities.

Requirement: reconcile the live host/mount before a signature fast return; preserve actual action eligibility, notices, native callbacks and focus semantics. No save migration expected. Once authorized, verify startup after the current safe-location refresh, unchanged detached render, failed entry, normal entry with no job, return, re-entry and keyboard focus. Build current combined source; no forced-render helper may satisfy ordinary UI acceptance. Old active jobs must retain their own progress.

## P1-ABSENT-UNVISITED / F2: saved registry provenance without fabricated visits

Problem/consumer: saving while a pack is installed records its native location/availability, but never entering leaves no optional visit row. The absent-pack rewriter lacks provenance for those records, triggering a missing-location warning and save blockade. Candidate areas: `src/content_packs.js`, narrow `main.js:create_save/load` join, save-validation/compatibility owner if additive metadata is required, focused tests and generated native browser fixtures.

Requirement: retain enough generic registered-content provenance to park unavailable native records even before the first visit. Do not fabricate a visit, custody, reward or unlocked act. Preserve dormant state and original unavailable records; do not broadly discard unknown locations or disable warning protection. Review backward handling of already-produced unvisited envelopes, rather than fixing only future saves or hardcoding private pack IDs. Any schema/retention decision must be explicit and accepted before publication.

Acceptance: installed-but-unvisited save → missing and malformed manifest → safe base save/export/reload/import → unchanged pack restored; no invented visit/wage and no lost native data. Also repeat the previously visited active/completed absence/restoration routes and an unrelated genuinely unknown native record. Failed write must preserve the old envelope. Original private pack revision stays unchanged.

## P1-JOINED-CALENDAR / F3: one compatible played-time publication

Problem/consumer: valid enrolled-chronicle visit uses optional timer’s calendar write while expansion clock/chronicle remain at their old anchor; a normal tick saves a structurally rejected envelope. Candidate areas: narrow `src/main.js:update_timer` optional branch, existing joined-clock/calendar transaction helpers and save-compatibility qualification; relevant generated mixed-state tests. No new global world time engine, arbitrary history reset or private pack mutation.

Requirement: select and implement a coherent publication using the current time owner. Stage the compatible calendar, expansion/chronicle state, selected optional job and applicable observers together, then publish once after the durable write. Preserve intended local/offscreen policies; do not silently tick unrelated worlds or erase prior causes. The authored scope must resolve any clock-policy choice before changing semantics. Validation stays enabled. Explicitly address recovery/migration or safe rejection of already-produced mismatches, without retroactive XP, wage or history loss.

Acceptance: current/legacy active and completed fixtures with enrolled chronicle remain validator-valid after ordinary ticks, return, save, reload and import; no duplicate duties/wages or deadline consumption. Inject entry/return/clock/completion writes and assert no premature calendar, job, reward, biography or observer publication. No-chronicle native progression and absent/reinstalled cases remain valid. Rebuild and actual native normal-timer proof mandatory; a mocked clock test is insufficient.

## Handoff gate

A future explicit repair assignment can reserve these exact areas against live owners. The A5 audit authorizes none of those writes. Director fiction/pacing acceptance, current combined-source integration and any new additive compatibility policy remain separate gates. Broader source completeness, mature journeys and VFX plans remain owned by the existing A1/A2/A3/A4/P8 lanes.
