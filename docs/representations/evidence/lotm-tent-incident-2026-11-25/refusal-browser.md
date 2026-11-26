# Klein keeps shopping

The built-in browser replay ran at 1920×1080 on the normal bundle `400612fe063c933984f423bf3da42f78bdf1d555fd5d7bd3bd083b4ef4b279b4`. The setup started from a newly earned Klein life after 16 opening jobs, departure, buying bread and walking to the tent. At 08:39 he had 16 pence. The save already held all three approach observations from beat 105 and neither card-reading observation from beat 106. It can test changing his answer after the approach. The separate 07:06 bakery save has none of the five observations and can test shopping without meeting the reader. The test paused the ordinary timer and stepped native ticks between actions.

| Situation | Observed result |
| --- | --- |
| Walk straight from Sline Bakery to the market before answering | From 07:06 the two-minute walk worked. At 07:08 the purchase was absent and the next task still asked Klein to try the reading. |
| Answer the invitation | At 08:39 the wait to opening cost one minute. At 08:40 the original five-minute reading and the one-minute free refusal were both available. |
| Change his mind before finishing | Stop work left the clock at 08:40 and both options available. The next attempt finished at 08:41. The next task was buying the groceries, with the purse still at 16 pence. |
| Save and import | Save/reload kept the branch. A native file export, supplied through the game's Import file chooser at a fresh Village origin, restored Klein at the tent at 08:41. After ordinary time resumed the screen still showed the skipped reading, the next purchase and 16 pence. |
| Finish the errand | At 08:43 the market offered a five-minute purchase for 16 pence. At 08:48 Klein had 16 loaves, one pound of mutton, one vegetable bundle and zero pence. The next task was unpacking at home. |
| Older Klein save | An earned save that already held the beat's knowledge offered the original reading. The incompatible refusal was absent. The original reading completed at 08:46 and offered the paid interpretation to decline. |

Both [actual exported saves](refusal-browser.json) were checked for the completed refusal and absence of both reading-stage completions and both automatic card-reading knowledge keys. The linked record contains hashes and outcomes. Private save contents stay outside the repository.

Two feedback issues surfaced. The next-task card briefly reported the earlier bread purchase as the last result of the refusal, and the status below the completed market purchase still described work in progress. The market-first replay also identifies a distinct possible next choice. Klein can already walk there directly, but buying groceries currently requires visiting the tent to answer. Letting him spend his money at the market without encountering the reader would need its own consequence, distinct from having spoken to her.
### Feedback replay on the corrected build

At 1920×1080 the built-in browser loaded the earned 08:39 save on a fresh origin. The rebuilt bundle SHA-256 was `25da80bac107a7e5b0e1a47c5f41f8ca2bd8ad484c4657832a7f82eea7842d25`. The panel initially showed the bread purchase. After the one-minute wait and one-minute refusal, both **Last result** and **Finished** reported thanking the reader and keeping the bread. Klein walked two minutes to market and started the five-minute, 16-pence purchase. At 08:48 both fields reported the mutton and vegetables, the Started notice was gone, and the next task was unpacking at home. The paused fixture stepped the native clock between player actions.

