# UI rules quick card

This card summarizes [UI rules](../UI_RULES.md). UI_RULES.md stays the authority; if the two differ, follow it and fix the card.

## Before you build: where it goes ([section](../UI_RULES.md#before-you-build-decide-where-it-belongs))

- Declare a surface type and a home first (UR1). Unsettled layout: use the mockup workbench.
- Unaccepted features go in the Projects drawer; only Weibao promotes one (UR2).
- Main surface: about seven routine entries, one level deep (UR3). Weighty rare choices get a full screen, modals only for one-question confirms (UR5).
- Give it in-world logic: who runs it, where, when (UR4).
- Pick the navigation scope before the destination: Focus, You, anchored item, task region or center (UR41). Not everything opens in the lower center.
- Group by player task and keep direct paths (UR21, UR51). Permanent chrome needs a current player need (UR50).
- Before changing a YAIR choice toward Proto23, find its recorded reason (UR49).

## While you build: what to use ([section](../UI_RULES.md#while-you-build-one-look-one-way-to-move))

- Tokens only, no local radius, font, raw color or `style.cssText` (UR6). Spacing from the scale, `--ui-space-1` to `-7` (UR65). Controls use `--ui-control-sm/md/lg` (UR66), stacking uses `--ui-layer-*` (UR67), text uses the type roles and no fake bold on Gothic (UR68). The contract test catches literals.
- Color carries a role, never the only fact; keep text or symbol labels (UR37).
- Shared components: group row, info block, button with disabled reason, tab, tooltip (UR7). Same panel header everywhere (UR30).
- Own your node: register with `definePanel`, never prepend or append into another panel (UR8).
- One center-mode controller: bottom Back labelled with the real previous place, plus Esc, restores scroll, selection, tabs (UR9, UR22, UR23).
- Label by destination or outcome (UR10). Keep status, current work and the full-height log (UR11). Moving a feature leaves a log line and a dot (UR13).
- Disclosure by task frequency (UR42). Hover is a peek; pinned or keyboard route for anything actionable or long (UR43). Esc closes the top transient surface, focus returns to the opener (UR53).
- Inspection is free, actions are explicit (UR35). Show only observer-safe facts, no invented values (UR36, UR40, UR47).
- Navigation stays still while things tick or are discovered (UR52). Save errors stay visible; Save, Export and Import stay distinct (UR55).
- Meters say which question they answer (UR61). Effects never hide facts, move controls or change RNG (UR38, UR62).
- Logs are readable streams, not cards (UR44). Summaries keep individual identity and a route to detail (UR56, UR64).
- Empty states say how to fill them (UR32). Shortcuts are discoverable (UR31).

## Before you call it done: what to check ([section](../UI_RULES.md#before-you-call-it-done-check-what-a-player-sees))

- Rebuild, then open a fresh-origin browser at 1920×1080 on a populated save (UR14, UR16). Floor 1536×864; MacBook size (about 1800×1040) every round (UR25).
- Regions lend free space only at stable moments, and bottom content wins (UR69).
- Scroll budget: no page scroll in ordinary play, one scroll owner per region, routine actions, current work and the way back visible. Report `scrollHeight` against the viewport (UR25).
- Discoverability: a screenshot alone lets a first-timer name the way back, the current work and the main actions. Put it in the report (UR14).
- Larger text: check 125% and 150%; the back bar stays pinned (UR33, UR46).
- Walk the whole journey: find, switch, inspect, act, return, resume, with failures (UR57).
- Saves: no deleted gameplay, renamed ids or broken layouts and pins without a written decision (UR17). Display preferences name an owner and reset boundary (UR58).
- Reference work: name how the state was reached, and keep source, native proof and human acceptance apart (UR45, UR59).
- Report proof and leave Weibao's visual-feel acceptance open (UR16). Lane briefs state surface type, viewport, outcome, deferred scope (UR18).
