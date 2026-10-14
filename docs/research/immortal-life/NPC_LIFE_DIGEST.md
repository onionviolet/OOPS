# NPC life: friendship, presence and shared residence

Shown static data, build 17861603; native bodies and gameplay unobserved.

N1: NPC has 67 definitions. Selected NPC1001 has gift preference tiers, refusal dialogue, greetings gated on friendship, configured default realm and level profiles, a schedule ID and a spell-study service option. Definitions include invalid/test content, so 67 is a catalogue count, not a live population count. A level profile is not an actor earning XP.

N2: FavourLevels has six ranges from 0–149 through 750–899. FavourLv maps gift preference tiers to 0/2/5/9 points. GlobalSettings adds chat/default gift values and birthday multiplier 3. Language describes a daily gift limit and preferred banquet dishes. These are stated rules or configured values; actual saturation, cooldown and gift settlement were not exercised.

N3: Trigger 23 links friendship level 2 plus two completed tasks to an authored encounter. Trigger 40 links friendship level 2 to paper bird 24. Trigger 153 uses a day since quest completion plus friendship level 3 before sending a message. These are concrete examples of relationships changing opportunities, distinct from merely changing greeting text. Complete PaperBird payloads and event interpreters remain unread.

N4: NPCSchedule has 371 schedule definitions. The nested detail rows inspected contain only Move and Animation, totalling 644 and 467. Schedule manager declarations include minute/day updates, inserts, removes, delayed overrides and WhereAndWhat. NPCScheduleController has its own stored schedule data. Task-linked schedules support authored presence. They do not prove an economic planner, independent goals or autonomous cultivation.

N5: Marry and MarryEvent are roommate systems in the inspected text. Marry has 12 NPC rows. Their invitation and departure strings describe staying in Misty Valley, not vows. Trigger 355 requires friendship task 60106 completed and room level 5, then opens NPC1001's option; 356–366 repeat the pattern for other friends. Language describes maximum friendship and top-tier housing. The exact trigger proves the task/home gate; direct numeric friendship checks are not present in those trigger rows.

N6: Each NPC has five MarryEvent rows: four single events, then a repeat pool. Across all 60 rows, IsOnce=1 occurs 48 times and IsOnce=0 occurs 12 times. NPC1001 has a day-0 item, a day-3 buff and later story events; NPC1012 has repeat dialogue from day 12 with IntervalDay 3 and several herb gifts. Dialogue reward entries total 62 Item and 3 Buff, with 43 carrying no reward type. No-reward conversation is part of the catalogue. Limits belong to these source events, not YAIRPG's global design.

N7: MarryData declarations retain current roommate identity, per-NPC days, event history, repeat counters and last-day markers. MarryController declares invitation/departure, day change, event selection and SaveData. This is a persistence schema, not verified atomic save/reload behavior. CurrentMarryNPCID suggests one current occupant; exact exclusivity and restay rules remain untraced.

Marriage and children: not established. Older public discussion says no romance, but it is not used as current authority. Internal Marry/Divorce vocabulary cannot overturn the localized shared-residence meaning.

Disciples, rivals and autonomous NPC cultivation: not established. Guest instructors, guild members, level profiles and player-requested delegation are different systems. No independent resource payment → timed practice → NPC breakthrough → retained result chain was recovered. YAIRPG proposals can support these possibilities when their own world and actor contracts justify them, without attributing them to this game.
