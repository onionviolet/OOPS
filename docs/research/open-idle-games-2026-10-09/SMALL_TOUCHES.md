# Thirty small touches for vanilla YAIR

All T codes below are proposed adaptations, not implemented or accepted behavior. Each maps to native work, gathering, training, quests, inventory/crafting, the log or character bio. Source-mechanism codes refer to the dossiers' touch tables and pinned evidence links. These thirty are a curated subset of the fifty-eight mappings there; similar ideas appear in more than one game. Larger dependencies are called out instead of presenting them as trivial UI changes.

| Code | Small player-facing touch | Vanilla landing point / dependency | Source mechanism |
|---|---|---|---|
| T1 | Show the next promotion and only its missing requirements | Fieldwork/patrolling center actions; one authored career step | [Progress Knight PK-T1](PROGRESS_KNIGHT.md) |
| T2 | Highlight the activity actually running | Existing location activity list | [PK-T2](PROGRESS_KNIGHT.md) |
| T3 | Keep purpose and next stopping point beside ongoing work | Existing center activity summary | [PK-T3](PROGRESS_KNIGHT.md) |
| T4 | Explain effective XP gain and the next useful threshold | Native skill/training tooltip | [PK-T4](PROGRESS_KNIGHT.md) |
| T5 | Let automation respect a chosen work category | Native profession choice; bridge to existing routine owner | [PK-T7](PROGRESS_KNIGHT.md) |
| T6 | Show which specific activities a book/tool improves | Inventory, book and equipment detail | [PK-T9](PROGRESS_KNIGHT.md) |
| T7 | Stop a paid service before emergency funds are spent | Native money and service owner; reserve condition | [PK-T11](PROGRESS_KNIGHT.md) |
| T8 | Explain what an optional heir retains before ending a life | Chronicle/bio and native equipment/inventory; operation decision needed | [PK-T12](PROGRESS_KNIGHT.md) |
| T9 | Keep tooltips inside the viewport | Existing crafting/equipment details; layout check needed | [PK-T18](PROGRESS_KNIGHT.md) |
| T10 | Manual choice pauses automation until resumed | Native center actions and single authoritative routine | [PK-T19](PROGRESS_KNIGHT.md) |
| T11 | Say when edits to a routine will take effect | Work/training planning controls; separate pending plan if chosen | [Idle Loops T1](IDLE_LOOPS.md) |
| T12 | Stop before cave departure if preparation is incomplete | Native cave travel, food/tool/stamina checks | [Idle Loops T3](IDLE_LOOPS.md) |
| T13 | Name reusable plans by goal | Village work/gathering/preparation in center panel; multi-step executor is additional work | [Idle Loops T4](IDLE_LOOPS.md) |
| T14 | Disable one step without deleting it | Future native plan entries; no change to their costs | [Idle Loops T5](IDLE_LOOPS.md) |
| T15 | Name the location or resource that blocked a step | Existing activity/job stop feedback | [Idle Loops T6](IDLE_LOOPS.md) |
| T16 | Refresh next-step estimates after skill/tool changes | Native skill, equipment and activity preview | [Idle Loops T7](IDLE_LOOPS.md) |
| T17 | Distinguish a hinted action from a usable action | Native quests/recipes; preserve discovery boundary | [Idle Loops T8](IDLE_LOOPS.md) |
| T18 | Choose familiar gathering or survey for new sites | Native gathering panel; survey content needed | [Idle Loops T10](IDLE_LOOPS.md) |
| T19 | Separate current project stage from past completions | Crafting/book/research owner and compact life record | [Idle Loops T11](IDLE_LOOPS.md) |
| T20 | Show the expected resource remainder after a step | Cave-preparation/crafting preview | [Idle Loops T12](IDLE_LOOPS.md) |
| T21 | Reveal an ingredient once it becomes meaningful | Recipe/sample discovery in native crafting | [Evolve T-E1](EVOLVE.md) |
| T22 | Describe the actual tool used by ordinary work | Existing gathering action text and equipment state | [Evolve T-E3](EVOLVE.md) |
| T23 | Show yield with skill/tool contributions | Native gathering tooltip | [Evolve T-E4](EVOLVE.md) |
| T24 | Keep lasting achievements after short logs roll off | Native side log plus existing bounded life record | [Evolve T-E6](EVOLVE.md) |
| T25 | Avoid the same incidental event twice in a row | Native village events; event selector/history needed | [Evolve T-E8](EVOLVE.md) |
| T26 | Trigger work events only in relevant circumstances | Workshop/location/occupation gates, not a flat global roll | [Evolve T-E9](EVOLVE.md) |
| T27 | Show temporary inspiration and its expiry | Existing effect tooltip and future research stage | [Evolve T-E10](EVOLVE.md) |
| T28 | Show routine capacity and pause controls together | Existing program controls; do not imply multi-step plans already exist | [Evolve T-E12, T-E13](EVOLVE.md) |
| T29 | Show a named helper's duties and supply reserve | Existing NPC/inventory owners; follower assignment integration needed | [Evolve T-E15, T-E16](EVOLVE.md) |
| T30 | Keep completed learning inspectable without crowding current choices | Native books/recipes/research reference and current center actions | [Evolve T-E21](EVOLVE.md) |

No touch introduces automatic death, a forced rebirth, mandatory loops, a new universal rank or a second inventory/clock. Source UI was inspected, not played. A future selected touch still needs the relevant rebuild/browser and persistence proof before being called working.
