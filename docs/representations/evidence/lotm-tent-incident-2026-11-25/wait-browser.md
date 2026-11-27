# Tingen wait playtest

To replay an earned checkpoint in the built-in browser, run `node scripts/fixture_browser.cjs --serve-save <test-save.json>` after rebuilding. Open the printed loopback URL. The command prints the save and bundle hashes and starts the ordinary game clock. For a stationary inspection, append `--paused`. Supply `--root <built-game>` before that flag to compare an isolated build. Each launch creates a fresh origin. Reloading keeps the progress earned there. Stop the preview server when finished.

The ordinary local crossed from the Village using the Tingen workroom and reached Neighbourhood lodging on a fresh local origin. The built-in background browser showed 357 entries in Local actions. The first live crossing took long enough for its browser command to time out, but the lodging and the new-life report appeared afterward.

On the rebuilt bundle `011c379076c5e1f87129a37f0774d91e7732d50fd9f4089850803b4462764c66`, the test page paused the normal idle timer using the existing simulation test hook. It restored the locally earned resident. At 00:41 the player chose “Wait until dawn · 319 min”. Mouse dispatch timed out after roughly six seconds. An accessibility read later showed 00:59 and “Waiting here · 18 min elapsed · 301 min remaining.” The wait advanced the native clock by the displayed amount. Browser interaction was still too slow to verify Stop on this build.

Updating the countdown in place preserved keyboard focus on Stop during a native wait. On bundle `477e1b7280f76a98c0a8c5ba7ca6483789a71315a68bf3e0fb6fcc8e30155619`, the browser showed 31 minutes elapsed and 245 remaining with Stop focused. A timed test activated the actual Stop control after two minutes. The clock held at 162, but the page still showed the old progress message and enabled Stop control afterward.

Bundle `2ff63f3986ac1afc142e59857743e13e019a858b9c043d65137c9eb935bc72e2` attaches the controls during a wait, moves keyboard focus to Stop, and removes the controls when the wait ends. A timed replay through the built-in browser restored the ordinary resident, opened the lodging, selected the offered wait and pressed its Stop button after two native minutes. The clock went from 162 to 164, remained there at the follow-up check, and displayed “Wait interrupted after 2 min. You stopped waiting.” Stop had focus before cancellation. Both the countdown and Stop had disappeared afterward. A second run reproduced the result from clock 164 to 166.

Cancellation correctness passed. Responsiveness still needs work. On these two runs the first timer after selection fired after 14.8 and 4.0 seconds, respectively. The Stop handler took 1.31 and 0.95 seconds. The instrumented run measured 12.5 milliseconds in its most expensive mutation observer across seven callbacks. A separate exact-step benchmark on an earned Klein day-one checkpoint advanced 20 minutes in 10.48 seconds wall and 8.50 seconds CPU. These measurements cover different lives and execution paths.

An isolated instrumented build (`1da89483b2fface71dd1598854025c31c60df2cf26100843df9293f90e34aeb4`) restored the existing local's earned tent arrival at clock 520. The browser drove two native wait minutes and Stop, finishing at 522 with focus on Stop before cancellation. The timings include nested calls and should not be added together.

| Measured operation | Calls | Total wall time |
| --- | ---: | ---: |
| Read simulation contexts | 334 | 8,052.8 ms |
| Render the Tingen panel | 3 | 4,469.6 ms |
| Read the Tingen host view | 3 | 4,037.0 ms |
| Publish the changed game state | 2 | 4,266.7 ms |
| Build the chronicle plan | 2 | 65.6 ms |
| Handle Start Wait | 1 | 59.6 ms |
| Create a save | 2 | 17.8 ms |
| Update wait progress | 5 | 0.5 ms |

Test whether one synchronous Tingen panel read can share the existing display frame across its action previews. Compare the same earned save and two-minute interaction. Verify that an actual state change still invalidates the frame and that one preview cannot change another preview's facts.

**Dawn and persistence.** On normal bundle `2ff63f39…`, the resident accepted “Wait until dawn · 212 min” at clock 166. The game reached clock 378, displayed “Neighbourhood lodging · Day 1, dawn · 06:00” and “You waited 212 min here.” It took 1,178,878 ms in the background browser with other tests running. The clock and wording were correct, but this was too slow for an idle-game convenience. At the separate earned tent checkpoint, the native controls stopped after 520 → 522. The save file export produced 582,980 bytes. A fresh origin started at clock 0, received those unchanged bytes through the game’s file input, reloaded and restored the ordinary resident at the tent at clock 522. This exercised the game's import handler with a test-supplied File.

**Frame reuse comparison.** Instrumented bundle `003fbaff996cf6ec70a1cce54bb056f630d81c54ddebf6f37c7dbefb119fae09` stopped at clock 522 from the same earned save. Both steps together took 3.67 seconds, compared with 4.36 seconds in the earlier trace. Three panel renders took 3.57 seconds, previously 4.47. Across the sampled interaction there were still 321 context reads and 225 actual context builds. The earlier trace counted reads but did not count builds. Context read time increased from 8.05 to 9.18 seconds. This single comparison under variable load does not establish a general speedup. The [state parity checks](wait-frame-source-gate.json) passed for fresh, mid-wait and ordinary-resident saves.
The paused fixture previously displayed minute 519 after the native Wait action had reached 08:40, until another test tick. The fixture now refreshes on native clock display updates and when its controls open. A fresh built-in-browser check on bundle 25da80ba showed 08:39 / 519 before the one-minute wait and 08:40 / 520 immediately afterward with the controls open.
