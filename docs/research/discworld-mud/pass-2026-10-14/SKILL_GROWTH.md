# Skill growth: shown historical mechanism versus current statements

All code paths below refer to [public distribution mirror](https://github.com/Yuffster/discworld_distribution_mudlib/tree/8c8619c64c0a41f09e406a97ee1e0a084ff92a60), locally `~/.codex/research/discworld-2/repos/distribution/`. README identifies v20.0. Mirror commit is dated 2012; core files retain 2003 revision identifiers. This does not date every file or make it the 2012 live server.

## F15: Taskmaster pipeline, shown

`obj/handlers/taskmaster.c`: `perform_task` reads the character's bonus, selects a curve by action category, and converts an award into a one-level addition. Character advancement restrictions or a rejected addition turn that result into ordinary success. The action caller owns outcome text.

| Category | Curve | Initial award parameter | Width or half-life |
|---|---|---:|---|
| Fixed task | Linear success window | 100 | Default width is integer 3 times square root of difficulty |
| Free room action | Linear | 25 | Same width |
| Continuous work/combat | Linear | 50 | Same width |
| Ordinary guild command | Linear | 100 | Same width |
| Covert guild command | Exponential failure | 60 | Failure halves about every 40 bonus |
| Ritual | Exponential failure | 50 | Half-life 25 bonus |
| Spell | Exponential failure | 60 | Half-life 40 bonus |
| Explicit no-training task | Exponential test | Award result suppressed | Default derived half-life |

The “100” is a parameter, not a 100% chance of gaining per attempted action. Below difficulty, the action fails. In the linear window, success grows with bonus; after success, the conditional award chance falls with distance through that window. At the lower boundary success is zero. At the upper boundary learning is zero. Beyond it, success is guaranteed. Integer comparisons make exact percentages differ from a smooth sketch.

When control information exists, stats modify the award parameter. The result is divided by an exponential of `(skill level minus 100) / 300`, truncated, then reduced by 10 for linear tests or 5 for exponential tests, with a floor of zero. These constants are in `include/tasks.h`. Exponential tests retain a falling failure rate but stop awards once bonus reaches difficulty plus five half-lives.

Worked arithmetic, not gameplay: difficulty 100 gives a linear width of 30. At bonus 115 and a neutral stat modifier, level 100 reduces the initial 100 to 90. Success is 49% under the integer `random(100)` comparison; its award roll is 45%, giving 22.05% before further restrictions. It is not a calibrated prediction for today's server or any particular character.

## F16: Repetition and award history, shown

`std/living/skills.c`: `add_skill_level` sends one-level player gains with an object or absent XP argument through `tm_check_ok`. It can reject an award after the skill mutation. Command history detects the repeated current command, with an exception for point skills. A repeated command exceeding five appearances or 30% of the considered history is rejected.

Further checks use elapsed wall-clock time, guild level, skill level, source object, environment and shared skill-path prefix. Repeating the same source, place or nearby skill increases the interval; trying before it expires updates the remembered time too. This can postpone rewards repeatedly. A different root uses a 60-second interval in this historical path. These checks are not a universal fixed “one TM every N minutes” rule.

**Inference:** the design tries to spread gains across play, sources and situations, while reducing free repeated inputs. For YAIRPG, copy the causal objective, not the input-history policing. Queued idle work is accepted direction. A job may keep producing useful output and slow positive training without forcing manual command variation.

The handler also counts checks and awards by skill family/level bracket. Its check and award bucket definitions do not line up perfectly in this release, so these counters should not be assumed to form a clean analytics dataset without repair. No live telemetry was accessed.

## F17: Levels, stats and costs, shown

`std/living/skills.c::calc_bonus` turns levels into unmodified bonus in four segments: through level 20, five bonus per level; 21–40, about 2.5; 41–60, one; above 60, about half. Integer shifts round. Then `stat_modify` adds a multiplier derived from logarithms of each relevant stat. Temporary versus base stats are selectable. The source does not use a literal geometric-mean computation here.

`include/skills.h` has a dotted tree with six historical roots: covert, crafts, faith, fighting, magic and other. `std/skills.c` manages descendants, inherited values, leaf-only restrictions and learnability. Current [skills help](https://discworld.starturtle.net/lpc/playing/documentation.c?path=/concepts/skills) instead lists seven roots including adventuring and people. No old skill identifier should be pasted into a current adapter without mapping.

`std/room/inherit/guild.c::query_skill_cost`: a leaf's guild factor is scaled by the room cost multiplier and a base constant, multiplied by a stepped level factor, then by an exponential with level/150. Parent prices sum child prices. A quote for several levels sums successive costs. Money is separately derived from XP cost using the room divisor and local coin values. `include/tune.h` supplies base 125 and level divisor 3. This is a guild purchase formula, not a TM formula.

`std/guilds/warrior.c`: fifteen primary skills get factor 3 and teaching maximum 300; other fighting skills factor 5/max 50; faith 15/max 25; magic 50/max 5; defaults 10 with separate maxima. This is a regional/class training incentive rather than a global ban on all other competence. `standard.c` provides commands, spells, resource-pool setup, advancement hooks and average-primary guild level. Only standard and warrior guild implementations are present in this snapshot.

## F18: Teaching transactions, shown

`cmds/living/teach.c::teach_skill` validates a real skill, living/interacting parties, opt-in auto-teaching, ignores/mutes, teacher competence, branch prerequisite and available XP. Ordinary branch teaching needs parent level at least depth times five; leaf-only trees use their own restrictions. An optional maximum-teaching-level enforcement macro is disabled. A request is limited to 50 levels per offer, not 50 levels for a character's lifetime.

The historical leaf quote adds 500 plus a level-scaled base times an exponential of level/500 times a multiplier. The multiplier is one plus half the learner's base subject bonus divided by the teacher's. The teacher must be able to cover the resulting learner bonus. Higher subject mastery improves price, with a bounded ratio effect. This old code has no effective teaching-bonus calculation like the prior lane's current help formula.

`cmds/living/learn.c` checks the quoted starting level, room and XP, then reserves action time from both parties. Time comes from quoted XP divided by 300, capped at 1000 internal time units. The completion handler checks place and funds again, rewards another teacher with one tenth of XP, spends learner XP and adds the quoted levels. It has interruption/duplicate-callback handling; this pass did not execute it or establish every edge-case atomicity. Timing existed in the old source. A later timing announcement is evidence of a change, not proof of first introduction.

## F19: Current help disagreement, stated

Current [taskmaster help](https://discworld.starturtle.net/lpc/playing/documentation.c?path=/concepts/taskmaster) allows skill learning after success or failure within the task's learning range. The released core returns on failure before its award check. Other callers can award directly, so this finding is limited to those two core functions. Today's complete taskmaster and teacher implementations remain unavailable in this pass.

Design choice still open: YAIRPG may allow instructive failure, deterministic accumulated practice, random insight or a mixture. It should show the cause and preserve progress across saves. These are candidates, not an accepted replacement for existing XP.

## F28: Recovered Skills and Teaching pages, stated by players

[Skills, 2026-08-18 capture](https://web.archive.org/web/20260818131209/https://dwwiki.mooo.com/wiki/Skills), read in full including the stat-weight table, counts languages as an eighth branch alongside the seven ordinary roots. Thus seven versus eight is partly classification, not necessarily a game change. Languages do not use stats. Parent levels are recursively rounded averages, whereas guild level is described using outermost primary branches. The page calls 50% task success the commonly claimed best TM range, not a proven current formula. It distinguishes free skill-level awards from spending XP and cash with a guild, spending XP with a player, and expensive self-teaching. “Free” does not mean the attempted action has no time, GP or material cost.

[Teaching, 2026-01-05 capture](https://web.archive.org/web/20260105161804/https://dwwiki.mooo.com/wiki/Teaching), read in full, redirects to a teacher guide. It confirms the reported effective-teaching bonus: average subject bonus and relevant teaching bonus, with the latter limited to twice subject bonus. It calls a teacher optimal once ETB reaches the larger of learner bonus plus 200 or 1.5 times learner bonus. This is a community description, not a recovered modern implementation. It separates free command instruction from skill-level XP spending; quotes precede the `learn` step. Moving apart interrupts without XP spending. Subject specialization is changeable after five minutes, so it is not a permanent root lock. Idle/busy/opt-in conditions can prevent lessons.
