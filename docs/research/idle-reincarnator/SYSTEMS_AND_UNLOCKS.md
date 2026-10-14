# Parallel systems and unlock digest

All mechanisms below are shown in installed code/tables; intended UI text is stated. Actual play is untested.

## Regions are not independent realm simulations

The twelve keys in `assets/explorations/data.json` are Grasslands, Shaded Woods, Ancient Crypt, Magic Research, Blue Sea, Eldorian Tournament, Dark Light, Exah, Hall of Heroes, Avanosh, Dark Sea and Yuksul. They share one player and registry. Navigation groups actions by region. Different skill families drive exploration speed, but there is one active exploration reference. Names referring to the realm are setting prose or political titles; they are not evidence of a second life/world instance.

Early route: Grasslands entry 12 qualifies Woods story0; Woods story9 or skip1 qualifies a Crypt opening. The Crypt boss opens Blue Sea, while Magic Research story0 branches off the same boss if the academy is still locked. Sea story17 opens Tournament; its boss permits Dark Light navigation. Dark Light story0 additionally requires civilization capability 100 and sets a forced-regression route. Completing its late story opens Exah; Exah's boss opens the Hall of Heroes, then the Hall story6 opens Avanosh, Avanosh story9 opens Dark Sea and Dark Sea story8 opens Yuksul. These are authored prerequisites, not measured first-play durations or a unique mandatory sequence for every possible route.

## Parallel work has explicit capacity

`player_progression.gd::_run_heavy_update` advances equipped training, jobs, lifestyle XP and Gold; `_update_exploration` advances the current exploration. `JobEquipHandler` and `TrainingEquipHandler` each start with one independent slot; effect fields add slots. They normally stop active work while exploration occupies the player. Gold still counts unlocked passive-income jobs and lifestyle/route expenses. `temporals/1/content.json::time_split` supplies the effect that allows exploration alongside the other lanes. This is a purchased mechanical exception, not another body in another realm.

Training commitment is narrower: one ungraduated arcane school at a time, with level 50 graduation, while graduated schools remain eligible. Worldly and temporal training are later branches. This differs from Groundhog Life's conserved daily budget; having two slots does not show how minutes, attention or body effort are divided. For YAIRPG P3, use supported channels and means rather than silently multiplying full-time action.

## Cross-gates and explanations

`assets/jobs/common/content.json`: Beggar 10 opens Farmer; Farmer 10 opens Angler; Angler 10 opens Carpenter; Carpenter 10 plus Strength 5 opens Miner. `trainings/data.json` opens physical work at Farmer 5. `jobs/data.json` opens Knight at Strength 5. Noble has alternative qualifying groups; Arcane requires Magic Academy and Baron 10. Spell schools need further profession/technology milestones. `technologies/data.json` generally reveals tiers from noble rank or previously seen technology, helping a later life retrace a known path.

`stories/lore/content.json` gives lifetime rebirth milestones: 1 statistics, 10 loadouts, 15 job/training automation, 20 wider speed controls or an alternate story unlock. `age_1000` opens all speed entries after its lifetime-age/regression/story conditions. Manual rebirth requires its own age and milestone conditions; ten rebirths alone does not directly mean immediate manual reset at birth.

`models/action/requirement.gd` treats numbered groups as alternatives. A group's checks combine requirements. For nonlockable content it erases many satisfied checks from the working copy, so conditions may be accumulated across time rather than required simultaneously. Certain overall negative-age/count checks are protected; individual negative-level checks can also be erased. `unlocked` checks are handled differently. Preserve this distinction when reading a table or designing a new declarative contract.

`Scenes/Action/ActionCard.gd` draws XP and lock requirements; unlock notifications are attached to card objects. `ActionSubTab`, navigation and per-category templates create intended progressive exposure. `TechnologyHint` picks the first still-locked technology in insertion order and turns referenced professions/regions into a hint. It does not rank the nearest achievable technology, and randomized phrasing does not imply randomized progression. Unknown/sealed knowledge needs its own filter before borrowing P4/P8.

Exploration automation stores completion targets, danger tolerance, an ignore-risk setting and explicit auto-accept-force-regress preference. Insufficient Gold can pause it for a short interval and clear the exploration; paid training falls back to its default on out-of-Gold. These are source-specific fallback choices, not accepted YAIRPG policy.

## Currencies and lasting public work

Gold pays lifestyle, training, spells/route expenses. Renown appears in exploration rewards, gates and lifestyle enhancement costs. Miracle is a life-scoped protection pool earned through a Luck/time-power rule. Temporal Essence is awarded on regression and buys 32 authored powers across four tiers. No per-region wallets were found.

Technology rows unlock persistent effects, then civilization capability contributes to one of eight settlement-scale stages and happiness. The final political label contains “realm”; it is a civilization tier. This gives settlement/province work a useful persistence example without supplying territory ownership, war, supply routes, armies or diplomacy. Those features require their own owners and evidence.
