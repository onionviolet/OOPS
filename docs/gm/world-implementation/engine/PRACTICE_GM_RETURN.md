# Practice interface Engine GM return

Date: 2026-10-05. Role: bounded Practice interface Engine GM. Writer scope released after this return: `src/skill_expansion_host.js`, `src/skill_expansion_ui.js`, and this report only.

## Result

Closed the concrete S2 UI gap: once the player owns Shared inquiry at mastery 2, Practice now shows the agreed workshop report even before the workshop starts. It displays the known requirement to start the shared field workshop, keeps the report disabled, and does not expose craftsman status or hidden world state. The source milestone already named the report; the host had filtered it because the command's `visibleWhen` gate was false.

Practice now recaps only actual player-retained inquiry observations: contribution snapshots and road stage written by the existing observation effect, with their observation times. It does not read current world or NPC values. The existing source writes those snapshots to `state.actors.player.facts` under `field.project.{parts,survey,assembly}` and `field.roadKnown`, plus each key's `.observedAt` timestamp.

The existing accepted-work projection continues to retain a player's pending skills job or `party.rest` by its registered command label and due time. Known family actions still include the existing `party.rest` recovery when its own visibility preview allows it. When accepted work ends while its cancel control has focus, focus returns to the Practice summary.

## Source trace and checks

- Four family definitions remain the source for learning, practice, mastery milestones, real native consumers and recovery IDs. Discovery projection still receives only known player/actor facts, actual command definitions and safe preview output.
- `simulation_effects.js` observation effects snapshot existing world facts into the acting actor's facts at completion. Practice renders only those retained player facts; `field_ui.js` separately owns its live field report.
- `node --check` passed for both edited modules. Dynamic ESM imports of `skill_expansion_host.js` and `skill_expansion_ui.js` passed.
- No gameplay, browser, build, save/reload, failure or regression checks were run, per the active deferral. New behavior remains **implemented-unverified**.

## Deferred acceptance

Later, verify by play that the mastery-2 report appears with a clear disabled workshop prerequisite, becomes usable after workshop start, and records only the report snapshot after completion; verify revisit/refresh, accepted `party.rest` work and its cancel/focus behavior, hidden-family DOM/search/count behavior, keyboard navigation, and save/reload/cancellation paths. These are outstanding playable gates, not established results.

## Final fingerprints

SHA-256 after edits:

| Path | SHA-256 |
|---|---|
| `src/skill_expansion_host.js` | `4eb7961db8d8923a8c217f6e9c6f30bd918e8d6628bec7bbf97a3082088a558e` |
| `src/skill_expansion_ui.js` | `4f3ad801f8cfb036081c332276a32d16a21d66ce9d9e5b060b0fc146cecbc423` |

## Root integration follow-up

After writer release, root found the UI's public facts snapshot does not include the raw workshop-start world flag. The known prerequisite now derives from the report command's actual `preview.visible` gate, qualified by owned mastery two, so starting the workshop clears the prerequisite rather than leaving stale text. This is a one-line host correction after the worker fingerprints above; the final root SKILLS_BUILD.json records the rebuilt current source. No new behavior check was run.
