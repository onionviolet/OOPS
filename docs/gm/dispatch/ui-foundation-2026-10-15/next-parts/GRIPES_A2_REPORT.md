# A2 Around you leaf implementation, 2026-10-18

Status: leaf implemented and isolated checks passing; native integration, rebuilt
whole-screen evidence and human visual/play acceptance remain with root.

Authority: [checkpoint](GRIPES_A1_A2_CHECKPOINT.md), Around you AYF7–AYF13,
AD6–AD8/AD34/AD36, UR35/UR37/UR41/UR46/UR52/UR53/UR58, AR1–AR16.
This is a presentation leaf through the existing Village public frame and native
`choose`/`act` callbacks. Internal panel identity stays `focus`. No save state,
truth, schedule, native gameplay command or shared controller owner was added.
Targets are 1920×1080 and 1366×768, 14px and 21px. Mobile remains deferred.

## Result and constraints

F1: The old uniform chips mixed neighbors, stations and Projects, then replaced
place context completely on inspection. The new leaf separates People here from
Services & stations, gives station names the existing quantity accent, keeps
plain labels, and condenses the actual native place prose into a disclosure.
The supplied root `before-1920-14.png` was visually inspected. Projects is
excluded from this in-world list; its canonical top navigation remains root's
integration responsibility and was visible in the supplied before screenshot.

F2: One list/detail split uses actual panel width, with a 30em container threshold.
At 744px the split fits 14px and 21px text; at 463px it fits 14px, while 21px
uses subject drilldown with Previous/Next and labelled Back. Subject names stay
inside detail and the outer identity remains Around you. These panel widths
come from root's rebuilt screen measurements, not a claim about final layout.

F3: Rows and command controls retain DOM identity across updates. Inspection
calls only `choose(id)`; explicit commands recheck the latest admitted action and
disabled flag before invoking `act(id)` once. Missing selections clear safely,
show a generic unavailable explanation without naming absent subjects, and
return focus to a surviving row. The explanation remains until the next local
selection or place change. Place change resets local disclosure/scroll state.
This state is transient in the leaf, not persisted across saves or browsers.

F4: Public frame has people, services, things, actions, history, clock and
place, but no admitted connected routes, route times or danger projection.
AYF11 Ways out is therefore an explicit native-frame gap. No schedules,
opening hours, danger labels or undisclosed routes are invented. No attention
dots, first-visit ledger or fabricated since-last-visit account was added.
The leaf receives no enemy data and does not replace the existing combat board.

## Exact integration hook

Root owns `village_workspace.js`, shared stylesheet hooks and workspace status.

1. Import `createNearbyContextView` from `./nearby_context_view.js`. After the
   existing `choose` declaration instantiate
   `const nearbyContext=createNearbyContextView({choose,act:id=>{act(id);render();}});`.
2. After the existing native-encounter early return and enemy-card cleanup, and
   before the old `focusKey` rendering branch, use this shell-only branch:

```js
if(shell){
    const nearby=nearbyContext.update({frame,selected,
        description:document.getElementById('location_description_div')?.textContent.trim()||''});
    if(selected&&!frame.dialogue)selected=nearby.selectedId;
    if(nearbyContext.node.parentNode!==focus)focus.replaceChildren(nearbyContext.node);
    focus.dataset.nearbySummary=nearby.summary;
    focus.dataset.focusEmpty='false';
    focus.closest('.workspace-module')?.setAttribute('data-focus-empty','false');
    focus.dataset.subjectHeading='false';
    if(heading){setText(heading,'Around you');setTitle(heading,nearby.summary);}
    focusSignature='';
    return;
}
```

3. Use `nearbyContext.returnToList()` for the shell branch of existing
   `leaveSubject`, after its center-task/defaultPrevented guards, so Esc shares
   Back's row-focus restoration. Keep classic `choose(null)` behavior. Add
   `nearbyContext.destroy()` to the returned destroy handler.
4. Link `styles/nearby_context_view.css` after shell styles. Use returned
   `nearby.summary` or `focus.dataset.nearbySummary` for the workspace header
   status. Reconcile registry title, module aria/collapse/Move-to identity to
   Around you while preserving internal `focus`. Native encounter heading/status
   must still describe opponents, with no stale nearby summary during combat.

The helper API is `{node,update,returnToList,destroy}`. `update` accepts only
`{frame,selected,description}` and returns the pure projection, including
`summary`, `selectedId`, `subject`, section rows and missing-selection state.
A parent must keep the leaf mounted during ordinary ticks rather than replacing
its node, and must not clear `selected` when a center service opens or returns.
The old shell branch is bypassed, not used as a second competing detail system.

## Checks and source identity

Base HEAD during focused verification:
`5976bf3d3d77034cfe01b94a5e89506ac6af2509`. Shared checkout was already extensively
dirty. Only the five assigned A2 files were written; no shared build, source
integration, branch, install, commit, push or user-save operation was performed.

Commands run:

- `node --check src/nearby_context_view.js`: passed.
- `node --test tests/nearby_context_view.test.js tests/village_workspace.test.js`:
  7/7 passed. Covers observer filtering, immutable input, native action identity,
  disappearing selection, conversation precedence and no fabricated route facts.
- `node docs/gm/dispatch/ui-foundation-2026-10-15/check-gripes-a2.cjs`: passed four
  isolated leaf cases using `target-set.cjs` 1920/1366 × 14/21. Supports existing
  `R21_TARGETS` overrides. In-memory esbuild only; no dist writes. Tests grouped
  representation, free selection, explicit single callback, retained service
  selection through simulated refresh, Back/opener focus, stable focused nodes
  through updates, disappearance recovery and leaf horizontal overflow.

An early regression run found missing optional `history` crashed story recap;
fixed with the empty public-history fallback before the passing run. Browser
fixture is deliberately isolated. It does not prove native service eligibility,
time/resource cost, controller Back/Esc, gameplay persistence, whole-screen
geometry or human acceptance. Those remain the root integration gates.

Final leaf SHA-256:

| File | SHA-256 |
|---|---|
| src/nearby_context_view.js | f4c2462e2d09a7ce3462762e8ccd972fe50fc17315d9dac1eeaf6716d630308e |
| styles/nearby_context_view.css | b2c43a4ed173fb374fd986960d52281c8ea87426cc43582ab79b446b4d012673 |
| tests/nearby_context_view.test.js | f739aaee8b06913dcd4ab26b83f4546560baa05df1684cacafb9c857e649993d |
| check-gripes-a2.cjs | d0daccc2299b23a2cf4204d903acdeff8b6be33d868251c1165577dca0b23716 |


Root integration is technically verified; shared hooks and later visual fixes are
in [GRIPES_A1_A2_REPORT](GRIPES_A1_A2_REPORT.md). Original leaf hashes describe
worker delivery; the final integrated candidate has its own input identity.
