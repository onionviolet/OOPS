# Capability runs action rows, November 26

The [shared UI standard](../../../../DESIGN.md#shared-ui-standard) now applies to the existing Capability runs screen. Each action has a row with its control, description and any blocked reason. Hairlines separate rows. The run tabs, action text, history and game behavior use their existing owners.

| Viewport | Before | After |
| --- | --- | --- |
| 1366×768 | [Laptop](before-1366.png) | [Laptop](after-1366.png) |
| 1920×1080 | [Desktop](before-1920.png) | [Desktop](after-1920.png) |

Both rebuilt browser passes opened fresh Village Play, selected the existing Hogwarts run and cast Lumos before the captures. Nox still extinguished the light. The same route opened Fang's run and checked that an unavailable action showed its associated reason. The before and after bundle SHA matches. The stylesheet hash changed. Zero page errors. [Before replay](before.json) · [After replay](after.json)

This is a stylesheet change scoped to `#capability_runs_view` under UR65–UR66 and AD34. Agent verified, human review optional. Mobile remains deferred.
