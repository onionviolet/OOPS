# Implementation packets

All packets are **PROPOSALS**, not accepted work. These extend prior P1–P5 without editing them. The present lane's P codes follow REPORT.md's rank order; prior packet references are explicitly prefixed 'web'. No game code, writing or assets may be copied. Build one useful school-world slice first.

## P1. Preparation and competence

Owner: ENGINE_EXPANSION and selected school world. Extends web P2. Separate practical subject competence from preparation and a recorded assessment. Use world-specific scoring and presentation, rather than a universal Academagia formula. An original subject could make preparation narrow the random range and practical skill set its scale.

Done check: equal practical competence with different preparation has different score variance; extra credit and illness produce explained effects; final grade and contributing inputs survive reload/import. Cohort ties have an explicit policy. No hard 10-level global cap implied.

## P2. Saved curriculum and term plan

Owner: ENGINE_EXPANSION, chronicle/time. Extends web P1/P2. Integrate dated gains with `world_rhythm.recurringWindow`, `chronicle.advanceChronicle` and existing simulation seed support. Generate once per term state and save the schedule; assign daily jobs while idle. A stable seed is an original design choice, not a source claim. Exceptions such as exam or illness take precedence.

Done check: an idle week grants the expected subjects, skips a holiday, runs an exam and resumes the free-slot plan; mid-week reload/import preserves curriculum, paid time and assessment results. Repeated terms can generate new schedules according to world rules.

## P3. Named group expertise

Owner: CHARACTERS_AND_WORLD_EVENTS, ABILITY_AUTHORING. Extends web P4/P5. A stage can allow a present companion's named skill contribution, with clear actor, action, knowledge and cost. Do not use an invisible maximum over all known NPCs.

Done check: one companion enables an otherwise weak option; removing or occupying them changes it; the journal identifies the contributor; save/import keeps stage and contribution state. Include a valid solo route where the world supports one.

## P4. Conflict repair and group changes

Owner: CHARACTERS_AND_WORLD_EVENTS. Extends web P5. Persist unresolved relationship causes, a repair interval, factions and member decisions. Original routes can mediate, take a side, leave or rebuild; none must be limited to one use for anti-abuse reasons.

Done check: one quarrel warns before escalation; a witnessed repair prevents the split; continued conflict forms changed groups with explained pair effects; saving inside the warning interval preserves the remaining time.

## P5. Event frequency and selection

Owner: ENGINE_EXPANSION and world's event owner. Extends web P4. Model daily frequency, prerequisite eligibility and record weight separately. The source's uniform selection is evidence of a simple route, not a mandate. Repeat policies belong to the world and event, including rematches, anniversaries and changed revisits.

Done check: changing frequency does not change eligibility; changing a weight changes the selected mix without bypassing a gate; empty pools and paused actions behave usefully; history persists. Use existing `simulation_resolution.resolveOutcomeWeights` only after checking its live contract.

## P6. Merit, favor and access

Owner: school world, reputation and people_knowledge. Extends web P3. Separate institutional merit, teacher relationship and visitation permission. A requested favor shows its reward and relationship cost before spending; the resulting permission has a named issuer and scope.

Done check: earned merit unlocks one school benefit; a successful favor spends its stated relationship cost; unavailable reward leaves the cost untouched; rights and receipt survive reload/import. A future province-war adaptation could use camp authority and military access, but needs its own owner review.

## P7. Club progression graph

Owner: school world and ABILITY_AUTHORING. Build one original club with entry, practice, social decisions and a useful technique. Keep membership, attendance and competence separate. Additional clubs can use other schemas where the setting calls for them.

Done check: qualify through two reasonable routes, practice while idle, gain one mechanically useful benefit and leave/rejoin under the world's rules; missing prerequisites show a discoverable clue; progress persists. Full source club content is not an implementation dependency.

## P8. Desktop term dashboard

Owner: THEMATIC_UI_AND_INFORMATION_DESIGN. Target 1440×900. Show independent timetable, subject preparation and cohort/story consequences at readable text size. Preserve prose in its own reading region. Mobile optimization deferred.

Done check: rebuilt fresh-origin browser at the target viewport shows ordinary planning without unnecessary panel hiding, one exam explanation and one conflict repair cue; keyboard/text-size behavior and reload/import checked. Director feel acceptance remains distinct from browser evidence.
