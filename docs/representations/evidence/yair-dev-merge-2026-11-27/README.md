# YAIR development merge, 2026-11-27

These captures use the rebuilt game at its normal `/` entry in fresh browser contexts. The proof records the bundle hash, the pinned YAIR revision and the observed results. The test setups use retained Village progress for Growth and EV2 and place a Village save one minute before the Temple ritual reward.

| Observed route | Laptop 1366x768 | Desktop 1920x1080 |
| --- | --- | --- |
| Sleep in the Village shack, earn a recovery point and open Growth from Reports | [Growth](village-growth-1366.png) | [Growth](village-growth-1920.png) |
| Enter the Infested field in chainmail. A hit gets through and Breathing skin restores stamina | [Armored fight](armored-evolution-1366.png) | [Armored fight](armored-evolution-1920.png) |
| Finish the Temple ritual after the pending reward makes it available. Journal lists the achievement and Reports logs it | [Achievement](achievement-1366.png) | [Achievement](achievement-1920.png) |
| From Journal > Data, open the YAIR data viewer and choose Map. Scroll to the Village on the developer canvas | [Map](map-1366.png) | [Map](map-1920.png) |

At both sizes, Save, reload, Export and Import preserved the earned achievement, the consumed delayed reward, the character, the clock and the fork save fields. Both runs recorded zero page errors. The plain v0.6 export came from the pinned upstream build and was imported through the OOPS file picker. The proof stores its hash. [Browser and save proof](proof.json)
