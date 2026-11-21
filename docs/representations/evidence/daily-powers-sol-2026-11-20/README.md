# Moonglow at the village kitchens

The [daily-powers lane brief](../../../gm/dispatch/play-surface-2026-11-14/SOL_DAILY_POWERS_BRIEF_2026-11-20.md) asks for one ordinary use of a Gu Fang Yuan already holds. The hand-cut sale takes 15 minutes. Moonglow portions the same six jin for one primeval stone in 10 minutes and takes four parts of essence. The time and essence values are authored for this slice. The Gu must be fed, the meat must be fresh, and the existing job system reserves the inputs and returns them if the work is stopped.

The live reserve was already shared with wolf fights. The native clock is `current_game_time` in [game_time.js](../../../../src/game_time.js). [clock_owner.js](../../../../src/clock_owner.js) advances it with the expansion clock and settles the same timed job used by the hand sale. [ri_calendar.js](../../../../src/ri_calendar.js) projects Fang Yuan’s date. [cast_schedule.js](../../../../src/cast_schedule.js) and [npc_schedule.js](../../../../src/npc_schedule.js) project NPC whereabouts or scheduled activities.

A short Moonblade in the open can be seen. The academy elder qualifies only when alive and present in Fang Yuan’s world and location, through `detectGuApproach` from [gu_senses.js](../../../../src/gu_senses.js). The job records the sight decision on acceptance and publishes it when the work settles. Fang Yuan sees the elder look up. The elder keeps his own native knowledge entry. The task uses the existing continuation, job, essence, and knowledge records. The original ordinary-day pin is byte-identical.

## Visual spec and controls

The [Fang Yuan ordinary-day reference](../../../../prototypes/yair-columns-2026-11-15/today-fang-yuan.jpg) is 1920 × 1080. Its Hero box uses compact Gothic text, one-pixel rules, and full-width reserve tracks. Samples from the reference include deep navy `#00133f`, quiet teal `#0f323d`, pale mint `#bfe5dd`, and blue-gray `#8094b2`. The new row inherits the active shell’s type and surface tokens, using the existing energy fill and warning ink.

The left Hero box gains one Powers block under the vitals. It keeps the aperture label, tabular value, and fill together. The adjacent button quotes meat, price, essence, and time. The fill is the only ornament.

| State | Player sees |
| --- | --- |
| First visit | Open kitchen task |
| Ready | Portion wolf meat with Moonglow · 6 jin for 1 stone · 4 essence · 10 min |
| Working | Stop portioning and the minutes left |
| Blocked | The first reason from the job quote, such as needing six jin of wolf meat |
| Settled | The kitchens paid for the meat, followed by the elder’s visible reaction if he saw the cut |

Voice sample from the existing sale: “The kitchens paid a primeval stone for 6 jin of wolf meat.” The change applies AD43, AR3, UR177 and PRS1. If the elder is away, the sale still works and has no witness entry. The shared hunter and combat surfaces remain under their current lane’s ownership.

## Played receipt

The browser started from the earned `ri-fang-yuan-ice-crystal` checkpoint. A played patrol and report supplied the fresh meat, and the existing feed and stone actions supplied a fed Gu and enough essence. The proof ran from fresh in-process WebKit origins with the ordinary controls. The clock test hook advanced the game’s own timers.

| Step | Observed |
| --- | --- |
| [Before](before.png) and [ready](ready.png) | The same fixture opened on the original UI, then showed the new control and quote in the left Hero box on the rebuilt candidate. |
| [Working](working.png) | Clicking the Powers button reserved six jin and took the aperture from 33 to 29. |
| [Settled](after.png) | Ten played minutes passed. Normal recovery returned one part, bringing the sea to 30. The kitchens paid one stone, and the elder visibly looked up. |
| [Reloaded](reloaded.png) and [imported](imported.png) | Save and reload preserved the clock, reserve and the elder’s memory. The Export button produced a file. After further time passed, Import restored all three values. |
| [Same-day fight](fight.png) | The normal wolf opener started a fight with 30 essence on the same day. |

[Reference and settled screen at full size](side-by-side.png). The Hero now shows a labeled reserve bar, a priced action and its result below the ordinary bars. Navy surfaces, compact Gothic type and thin divider rules carry through. The older reference groups the available actions in the center and has a top status strip. This candidate uses the current Actions, Around you and Journal arrangement and footer. Condition, inventory, and Reports differ because the candidate starts from the played patrol and shows the completed sale. Those surfaces keep their existing owners.

For MC6, [book_gu_lead_moonblade.js](../../../../src/world_packs/book_gu_lead_moonblade.js) already lets Fang Yuan watch the elder use Moonlight Gu outside a fight. At the academy practice field, the supervised action requires the elder to be there and gives Fang Yuan an observed lesson note. He sees the elder move the crescent to his palm and cut the head off a grass puppet. The note is an authored observation gated by co-location.

## Checks and gaps

| Command or evidence | Result |
| --- | --- |
| `npm run build` in the isolated candidate | Exit 0. Bundle SHA-256 `4e38653fabad48a845e21ba0ceea8922229c559ad891bd931919bb696eb53f82`. |
| `swiftc capture.swift -o capture`, then the baseline and candidate WebKit runs | Exit 0. The offscreen harness used the repo’s in-process asset route and a one-writer Web Locks shim. It captured the actual export Blob and fed the bytes to the native Import control. |
| `node --test tests/ri_daily_powers.test.js tests/ri_lead_day.test.js tests/ri_gu_tab.test.js` | Exit 0, 19 passed. |
| `node --test tests/ri_lead_day_journey.test.js` | Exit 0, the existing earned ordinary-day journey passed. |
| `npm run check:arch` | Exit 0. |
| `npm run check:rules` | Exit 1 at the unrelated Hearth text in `src/absorb_p23/host_joins/tranche_one_ui.js`. |
| `node --test tests/ui_style_ratchet.test.js` | Exit 1 on the unrelated markup count in `src/ui/book_craft_controls.js`. |
| `npm run check:flow` | Exit 1. The sandbox denied the localhost listener with `EPERM`. |
| `npm run check:docs` | Exit 1 on existing shared documents, including the lane brief. The 17 local links in this receipt resolve. |

The lane is agent-verified in the rebuilt WebKit run. The wider flow gate is still open.
