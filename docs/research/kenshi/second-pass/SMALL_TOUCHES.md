# Thirty small touches mapped to vanilla YAIR

2026-10-08. **Original proposals only.** These extend this pass's new evidence rather than repeat first-pass bread production, five-person provisioning, prison work hours, fixed-term protection or the earlier ruler example. Some are text-only details; anything changing membership, injury, eligibility or inventory needs a real consumer and its later verification.

Source-inspected host surfaces: [activities](../../../../src/activities.js) has fieldwork, patrolling, running and weightlifting; [skills](../../../../src/data/skills.js) has Running, Weightlifting, Sleeping, Iron skin and Fortitude; [locations](../../../../src/data/locations.js) has housing, crafting and dark/narrow environment types; [crafting](../../../../src/crafting_recipes.js) has materials, stations, skill and quality. [Combat](../../../../src/models/combat.js) grants Iron skin/Fortitude XP on relevant damage; [main](../../../../src/main.js) retains unconsciousness, sleeping recovery and a technique-observation hook. This is a read-only mapping, not verification of the current dirty bundle or proof that every proposed consumer exists.

| Code | Small touch | New evidence | Vanilla-facing place and interaction |
|---|---|---|---|
| T01 | A hire explains the personal reason for their fee. | P-F1 | One optional dialogue reply beside a recruit offer; unchanged result can have a different acknowledgement. |
| T02 | A veteran's damaged badge has a story. | P-F2 | Inspect an NPC detail before asking about a failed battle. |
| T03 | Sympathy and respect reach the same offer by different replies. | P-F2 | Village conversation; no requirement for one exact flattery string. |
| T04 | A weak recruit names the skill they hope to learn. | P-F3 | People detail points toward familiar Farming or craft work. |
| T05 | Shelter comes before the question of joining. | P-F4 | Road center action ends at a safe location, then offers a membership decision. |
| T06 | Someone thanks you and continues alone. | P-F5 | Aid outcome remains successful in the life account. |
| T07 | A former victim does not reward a staged rescue. | P-F6 | Specific remembered harm gates the gratitude reply. |
| T08 | An injured stranger first gives a guarded explanation. | P-F7 | Help, gentle question and condemnation lead to separate authored branches. |
| T09 | One companion recognizes the new arrival. | P-F8 | A named-pair greeting in the recruitment event; no party-wide friendship model required. |
| T10 | A quiet person acknowledges help with a gesture. | P-F9 | Short treatment/arrival text gives a distinct voice. |
| T11 | A patient feels uneasy about this particular healer. | P-F10 | Recovery report includes discomfort and reassurance without silently cancelling treatment. |
| T12 | A repaired tool or new kit changes the owner's self-image. | P-F11 | Equipment-sensitive celebration and an acquaintance's response. |
| T13 | A companion admires kit that a local institution distrusts. | P-F11 | Equipment detail versus a discovered local service restriction; do not imply universal hostility. |
| T14 | A furnished room remains part of the existing town. | S-F1 | Housing/location description differs from an exterior workshop's new address. |
| T15 | The miner reports an exhausted or poor seam. | S-F2 | Mining result gives the local reason for reduced useful output. |
| T16 | A manual furnace is useful when power infrastructure fails. | S-F3 | Station description and availability explain the hand-work option. |
| T17 | Mechanization changes a person's assignment. | S-F3 | A work report names the role freed or changed; exact labor savings are original balance. |
| T18 | Crop suitability is local knowledge. | S-F4 | Fieldwork description gives a discovered soil note before committing a crop. |
| T19 | Ripe crops and growing crops have different notices. | S-F4 | Event entry makes the harvest window actionable rather than another anonymous countdown. |
| T20 | An alliance stops a familiar collector's visits. | S-F5 | A location account names the cause after it becomes known. |
| T21 | A visitor takes provisions rather than treating all wealth as coins. | S-F6 | One inventory-based bargain contrasts with a money demand. |
| T22 | A growing hamlet earns a new civic category. | S-F6 | Location description names a town-size threshold and the new obligation. |
| T23 | Civic ritual offers attendance as an ordinary activity. | S-F7 | Existing dialogue/center choices carry one local custom with an authored aftermath. |
| T24 | Rival uniforms coexist in one market. | S-F8 | Merchant and location text distinguish rivalry from an active fight. |
| T25 | A recovered workplace acquires a specific daytime shop. | S-F9 | A new vendor and opening hours show how two custodians' removal changed livelihoods. |
| T26 | A road group changes leaders but stays hungry. | S-F10 | Encounter text keeps hardship visible after military organization changes. |
| T27 | Capture and death lead to different news. | S-F11 | People/life account records the actual known state, not generic “defeated.” |
| T28 | A heavy delivery is also deliberate training. | B6; tips 17 | Weightlifting/transport description connects the burden to known practice, without making all inventory movement award XP. |
| T29 | A cramped doorway favors a shorter weapon. | B9; tips 41 | Equipment description and existing narrow-area combat surface make a known enemy method understandable. Actual effect needs binding. |
| T30 | A borrowed bed and a field bed solve different travel problems. | B5; tips 10,58 | Housing/route choices offer rest, a favor or portable shelter; no mandatory body-maintenance system needed. |

P-F references resolve in [PEOPLE.md](PEOPLE.md), S-F in [SETTLEMENTS.md](SETTLEMENTS.md), and B in [BODIES.md](BODIES.md). Tips locators are private `inputs/data/tips.txt`. T01–T30 count proposed details, not thirty implemented features or thirty independently recovered mechanics.
