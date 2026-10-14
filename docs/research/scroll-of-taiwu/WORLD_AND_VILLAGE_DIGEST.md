# World time, NPC lives and village work

## F10: A monthly simulation, with action costs within the month

Shown: `WorldDomain.GetLeftDaysInCurrMonth` divides remaining action points by ten; `AdvanceDaysInMonth` consumes ten points per requested day. Explicit month advancement enters the next month and resets action points before running world phases. Do not equate these in-game days with wall-clock time or assume the game runs while closed.

Shown: `AdvanceMonth_Execute` runs status, survival/alive-state checks, self-improvement, reading/practice, supply and equipment preparation, relationships, mission/goal/action planning, fixed actions, information, movement, building updates and organization membership updates. Several phases use parallel action managers and a recorded-modification path. The order is observable code structure; deterministic replay or race-freedom was not tested.

Shown: `Character.OfflineIncreaseAge` runs only in the actor's birth month. Actual age always increases there, while current age can be stopped or increased again by a special effect. Physiological age is a separate calculated concept. Age can affect hobbies, latent traits and clothing; childhood is therefore more than a timestamp.

Shown: pregnancy state is updated with birth/loss/mother-death branches. `CharacterDomain.MakeCharacterDead` creates a dead-character record and calls bequest generation for non-Taiwu NPCs. The world later decays graves and removes old records through cleanup paths. Detailed population replacement, genetic generation, marriage choice and bequest recipient policies remain unread.

Proposal P6: use a small recurring cast and record the cause of a useful change. Taiwu's broad population model is a reference, not a prerequisite for adopting a worker or teacher.

## F11: A building is a job site and a social site

Shown: `BuildingBlockItem` has construction resource arrays, prerequisites, core item, operation progress, durability, maintenance, skill/personality requirements, managers/roles, teaching and study bonuses, success/failure events and production values. The compiled building table has 319 rows, including resources and static/special sites, not 319 ordinary player buildings.

Shown: `BuildingDomain.ClacBuildingTimeCost` sums each selected worker's relevant life-skill attainment plus baseline contribution, then divides required progress by this sum and rounds up. This preview and `OfflineUpdateOperation` expose progress rather than instant output. Cancellation and demolition have distinct refund branches.

Shown: `UpdateBlockMaintenance` checks all required resources before consuming the maintenance basket. The later broken-building and repair paths are separate. Exact damage penalties and every maintenance exemption remain unread.

Shown: `OfflineUpdateShopManagement` requires a manager leader, can teach, handles manual repair queues and checks stored-output slot capacity before continuing production. Resources and item/event outputs take distinct paths. `GetBuildingAttainment` can choose maximum, sum or average worker attainment based on formula needs. Thus one universal worker-count multiplier would lose a real source distinction.

Shown: serial building updates happen before the status/study phases; parallel building update and recorded modification application happen after actor movement. Worker assignments and roles include distinct identities. Shipped `Cunminshenfen.tsv` describes farmers, artisans, doctors, merchants, scholars, wardens and envoys, each with relevant aptitudes or skills. `Yuefen.tsv` lists seasonal resource associations.

Proposal P4: start with one worker, one maintained facility, one input and one output that another activity uses. Keep construction, worker skill, storage, study support and upkeep visible in independent laptop panels. Housing and full village economics are later fitting options, not a new gate for this slice.
