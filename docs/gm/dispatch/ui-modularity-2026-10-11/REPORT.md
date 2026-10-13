> Current status, 2026-10-12: the fresh UI GM revised the candidate after Weibao reopened movement and1920 acceptance. See [redesign report](redesign-1920/REPORT.md), [checkpoint](redesign-1920/CHECKPOINT.md) and [layered delta](redesign-1920/MANIFEST.json). The original technical delivery below is retained as dated baseline evidence. Exact redesigned choices remain proposals; shared integration and human acceptance are open.

# UI consistency and modular workspace delivery

Implementation authority: Weibao's “implement accordingly with new gm”. Owner:
`01a12e1c-b84f-74a0-9638-295e0facdd5e`. Exact UI choices remain reversible proposals,
with human taste/fiction acceptance separate from technical qualification.

Playable isolated candidate: http://127.0.0.1:18571/ . Choose Classic to retain the
native arrangement, or Focus/Compare to expose panel handles and Panel controls.
All interaction remains in one browser page. Candidate location and fingerprints
are recorded in CHECKPOINT.md and candidate/MANIFEST.json. No shared runtime edit,
commit, push or publication was made by this UI task.

## Delivered scope

| Finding | Disposition |
|---|---|
| F1 responsive overlap | Native Classic reflows to three/two/one columns; modular docks reflow separately. Width clamps and explicit minimum sizes preserve content, including character creation. 390, 768, 1440 and 1920 px checked in each preset without document horizontal overflow. |
| F2 action hierarchy | Native conversation/work precede collapsed patrol and supply detail. Current work/saving appears immediately above local controls. Waiting known decisions have a recovery link into notes. |
| F3 control consistency | Static native selection/control buttons are semantic buttons; dynamic native choice DIVs retain their existing handlers and nodes with button roles, keyboard Enter/Space and disclosure state. Shared focus, spacing, disabled styling, density and generic home/away palette tokens apply. |
| F4 refresh/focus | Moving preserves one live instance. Owner avoids redundant reparenting. Native selection, comparison selection, witnessed-person disclosure/text selection and keyboard focus were exercised through refresh/movement. Older pack/career rebuilds recover focused controls with deliberate summary fallback; contextual stable outcome regions do not announce countdown ticks. |
| F5 action information | Existing native pay/time/tooltips and richer structured costs/reasons remain authoritative. Legacy pack actions now state duration, pause terms, known blockers and contextual saved requests. Career known blockers and existing custody/payment detail remain available by disclosure. No new action outcomes or eligibility rules are invented. |
| F6 mounting owner | One workspace owner controls registered modules. Notebook, pack, career and supply creators relinquish fixed-parent reattachment for owned nodes. Classic returns nodes to captured native homes, including host recovery after native refresh. |

| Acceptance unit | Result |
|---|---|
| A1 action clarity | Fresh opening, direct local choices, shared controls and actual keyboard conversation/work pass. |
| A2 movement owner | Live identity, mouse drag, keyboard docking/reorder, resize, collapse, pin and picker restoration pass. No layout code calls gameplay advance/command/save dispatch. |
| A3 layouts | Device-level v1 desktop/narrow configurations are separate from gameplay saves. Presets/reset, saved density/geometry, reload, malformed/future/unknown configuration recovery and absent/restored pack modules pass. Reset affects presentation only. |
| A4 useful panels | Current work/saving, character preparation, held/worn equipment comparison, belongings, witnessed people, known routes, received records, patrol custody and local supplies reuse existing state/views. Home/workshop content stays in its existing contextual native/Notebook views. A universal remote facility/production dashboard has no actor-qualified common projection and is intentionally not fabricated. |
| A5 floating/style | In-page floating has bounded resize/position, front ordering, docking and keyboard equivalents. Sticky layout recovery stays above floats; narrow layouts dock floats into ordinary flow. Reduced-motion checks, world-neutral state/focus colors and generic home/away tokens pass. Separate-browser popouts remain outside scope. |

## Evidence and limits

First connected gate passed before continuing later units: actions first, two
movable native panels and preserved instance identity. `browser/LAYOUT_RESULT.json`
records twelve responsive cases plus movement, persistence and recovery.
`browser/EXTRA_RESULT.json` records actual mouse and keyboard slider resizing and a
720 CSS px viewport equivalent to a 1440 px window at 200%. CSS 200% zoom was also
exercised in Classic. This is not an assertion that native browser-menu zoom was
automated. Screenshots are fixtures, not user saves.

34 focused source tests passed across layout recovery, optional/structured UI,
career, supply and observer-safe people knowledge. The last changes affect only
keyboard/response presentation and received their focused rebuilt browser gate.
`browser/native-journeys.json` records actual native work and earned XP,
cancellation, local action, crafting, combat, travel, comparison, save/reload/import
and witnessed-person discovery. `browser/optional-world-journeys.json` records
actual structured entry, immediate and timed actions, cancellation before completion,
no duplicate job/command sequence, blockers, identity reload and absent/restored
pack recovery. `browser/focused-keyboard-readonly.json` records current rebuilt
keyboard controls and same-origin second-tab read-only status through movement.
`browser/REVIEW.md` supplies the independent bounded review.

These checks prove the named UI and generated journeys, not whole-world completion,
all equipment balance, every private pack route or human acceptance. Gameplay save
schemas and clocks were not changed. Commands remain validated by their existing
owners, and no panel duplicates gameplay timers or reward dispatch.

## Remaining authoritative gate

Shared integration is reserved by World1 successor
`01a12e25-4154-7090-bcc2-d434478da4cc`. It explicitly asked us to retain the qualified
isolated candidate until its current route/equipment checkpoint. `candidate/UI.patch`
contains surgical UI deltas; `candidate/MANIFEST.json` contains exact base/candidate
hashes. Reconcile current moving source and apply only this delta when that owner
releases a narrow window, then rebuild and run the required combined regression and
fresh shared-origin gate. Do not overwrite from this snapshot or treat this candidate
as shared/installed delivery. PROJECT planning remains reserved by the same owner.

Human review of layout defaults and density remains Weibao's. No permission request
is needed to inspect/play the candidate.
