# Causal story UI source release

2026-10-06. Reserved worker `/root/causal_ui` releases [causal_story_ui.js](../../../../../src/causal_story_ui.js) to the Causal root. Source is **implemented-unverified**. No shared source, main, CSS, registry, save, bundle, package, dependency or private-save write occurred.

## Integration contract

`createCausalStoryUI({read,registry,command,container})` returns `{element,render,destroy}`. It mounts one collapsed native `expedition_panel` details element into the supplied container, defaulting to existing `location_actions_div`. The integrator calls `render()` with the other location panels. `destroy()` removes only this panel. There is no tab, new layout or stylesheet.

`read()` returns `{state,context,error?}`. Optional explicit `enabled:false` or `canWrite:false` also disables controls. Rendering calls the root-owned `causalStoryPresentation(state,registry,context)` and reads only its `visible`, `sections`, observer-safe labels/descriptions/actions/work/records and error text. The host supplies enrollment/begin controls and the mortal/covenant/anchor section labels. No native, registry, receipt or actor scan creates additional actions or accounts.

Action rows require `{id,label,eligible,reasons,costs,duration,command}`. Costs and reasons display only strings or authored `{text/label}` objects; `{known:false}` text is suppressed. Numeric duration means played minutes. Raw effects, resource owners, actor stats, debug schemas and command payloads are never display text. The original-source line and shared 36-played-minute window come from the frozen interface/ID contract.

Work rows require `{id,label,remaining,cancellation,command}`. Numeric remaining time means played minutes. Cancellation uses authored text, or the existing `refund/forfeit/none` policy labels. A supplied cancellation command is retained intact, including its actual `jobId`; a missing command, `none`, or explicit `canCancel:false` exposes no enabled cancel control. Optional work `eligible:false` also blocks it.

Each click re-reads the host projection and finds exactly one matching section and action/work ID. It requires current eligibility and usable state. It compares every semantic command field and the shown action label/costs/duration/cancellation, or work label/cancellation. Only root-confirmed top-level `sequence` and `token` are excluded from that comparison. Changed targets, job IDs, command profiles or terms reject for review. Successful comparison forwards the **exact fresh host command**, including its fresh quote fields, without synthesizing another request. Work remaining time may naturally advance without changing cancellation identity or terms.

Stable keyed controls preserve local details/focus across ordinary renders. A pending command disables all controls. Read/view errors and caught projection/command failures use status notices and a read-only Refresh actions control; raw exception details are not displayed. Opening, rendering and refreshing perform no state/storage mutation, enrollment, scheduler tick or publication.

## Static evidence and remaining gates

[STATIC.json](STATIC.json) records the released source hash and exact static checks. Syntax and authored whitespace pass. The frozen ID import resolves. At this release the root host module/export does not yet exist, so the host import and complete UI-module import remain **unmet**, not passed. The root/shared integrator must supply that exact export, attach the panel to main's actual command/render path, and include it in the sole final build.

No DOM/game/browser/unit/build/save/import/failure/keyboard/regression/director suite was run. The later backlog remains: current integrated action/enrollment/proof/account behavior; stale displayed terms and current actual job cancellation; observer disclosure; keyboard/focus/menu density; durable command failure and save/reload compatibility. Earlier UI checks are not evidence for this changed source. No packaged or playable admission is claimed.
