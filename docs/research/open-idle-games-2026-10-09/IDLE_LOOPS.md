# Idle Loops source dossier, 2026-10-09

## REPORT

Idle Loops makes the player's main choice a reusable sequence of actions. A small mana budget ends each run. Knowledge of places, talents, skill training and permanent bonuses make the next sequence more capable, while money, supplies and companions must be acquired again. Its strongest lesson for YAIR is **prepare once, replay with explicit limits, inspect where the plan failed**. This supports the north star's D2b routine draft without requiring a new life/reset system.

It is not a long-life aging simulation. There is no lifespan or heir in the inspected loop/reset path. Its recruited team is a run resource, not a set of persistent people. Offline time is banked speed for later play, not autonomous progress while the browser is closed. These differences matter when adapting its ideas to aging bodies and followers.

This is source-inspected research only. No game scripts ran, no browser session was played, and no YAIR code, build, test, save or commit was changed. Proposals below are not accepted decisions.

## Repositories, lineage and licenses

The guessed `stopsign/idleLoops` and `omsi6/IdleLoops` repositories do not exist at the queried addresses. The creator's homepage points to the actual repository's `idleLoops/` subdirectory and explicitly recommends Omsi's extended version [E1]. GitHub's repository API shows Lloyd forked Omsi, and dmchurch forked Lloyd [E2]. The word maintained here means a continuation with later source work, not verified active maintenance today.

| Repository inspected | Shallow snapshot and commit date | Exact repository license finding | Role |
|---|---|---|---|
| [StopSign/stopsign.github.io](https://github.com/StopSign/stopsign.github.io) | `d41bf197f9203e6da6f72628a9d76369b8140d57`, 2026-06-14 17:27:04 +02:00 | Root `LICENSE.md`: MIT License; copyright (c) 2022 StopSign [E3] | Original author; gameplay under `idleLoops/`. The head date covers the whole multi-game site, not specifically an Idle Loops update. |
| [omsi6/omsi6.github.io](https://github.com/omsi6/omsi6.github.io) | `fa21477d424f3aa1f1bf6deb9f6f83c2569770ab`, 2023-02-11 18:45:56 -08:00 | No LICENSE/COPYING file in the checkout; GitHub API license is null | Creator-endorsed extension under `loops/`; primary mechanics specimen below. |
| [dmchurch/omsi-loops](https://github.com/dmchurch/omsi-loops) | `fe4a349efb799a56ab548018caca1a1a1aea0c8f`, 2025-03-23 18:40:52 -04:00 | No LICENSE/COPYING file in the checkout; GitHub API license is null | Later Lloyd-line continuation, default branch `dmchurch`. Focused comparison of execution and quality-of-life changes. |

Lloyd's repository was checked through the API for lineage, not cloned or inspected as a gameplay specimen. The API returns license null there too. That is metadata, not a full file-level license audit of Lloyd.

License treatment: paraphrase mechanics and write original proposals. The original's MIT permits reuse subject to its notice requirement, but does not establish a license for contributions in either later repository. Bundled library headers, such as Chart.js's MIT notice, license those libraries rather than the whole game. No third-party code or prose has been copied into YAIR. A repository-wide asset provenance audit was not performed.

Clones are outside YAIR: `~/.codex/research/idle-loops/original/` (138 MB), `maintained/` (30 MB), `dmchurch/` (5.4 MB), all `--depth 1`. No install/build/development scripts ran.

## F1 Core loop and offline execution

The Omsi driver converts wall time into mana ticks at base 50 per second, calls `actions.tick()`, and restarts when the timer reaches available mana or the plan runs out [E4]. Initial mana is 250, a five-second baseline before extensions and speed modifiers [E5]. Mana-producing actions extend the current run, not a permanent initial pool [E4]. Current stat levels reduce each action's adjusted mana cost through weighted contributions; after every finished action, remaining action costs are recalculated [E6]. A useful plan therefore accounts for training order as well as resource order.

Players edit the next plan independently of the currently executing plan. Repeated entries have loop counts; disabled entries are excluded at restart. An option instead reruns the current list. If the last action can still start, it can repeat; invalid or wrong-town actions are skipped with a reason. A failed plan can pause before the next run [E7]. This is an explicit sequence executor, not a general condition-driven agent.

**Offline exactness, Omsi snapshot:** ratio 1; loading adds elapsed time since saved timestamp, capped at 2,678,400,000 ms, exactly 31 days per load. Paused open-tab time also becomes bonus time. Enabling bonus uses 5x speed; consuming it subtracts wall delta times `(5 - 1)`, or four bank seconds per real second. Emptying the bank turns that speed off. A backlog greater than 2,000 ms is discarded as direct tick backlog and refunded to the time bank [E4, E8]. No town research, follower simulation or aging is resolved on load. Time is credited for later acceleration. Clock rollback/invalid timestamps are not established as protected by the inspected load path.

**Original contrast:** ratio 0.8 and no 31-day cap in the elapsed-load expression. Its older >2,000 ms branch drops the backlog and changes FPS without Omsi's refund flag, and its bonus deduction happens inside the tick loop [E9]. Do not report Omsi's exact behavior as the original's.

**dmchurch contrast:** ratio 1 and the same 31-day load cap. Its execution uses a per-frame deadline and bulk/fractional mana rather than discarding every large backlog. Autosave can run while paused. A borrow-time button adds one day to the bank and increments a debt statistic; the return button requires one banked day and subtracts both. The inspected functions contain no interest charge or automatic debt repayment [E10]. These are source facts, not an endorsement of borrowing or offline-no-aging for YAIR.

## F2 Loop operation, exact retention and bonus layers

The operation is a bounded loop to its starting point, triggered by exhausted mana, exhausted valid actions or manual restart. This is distinct from death, succession, revival or a whole-save hard reset. Source shows implementation state reset, not a complete fictional answer to branch history, observers or outside-world clocks. Those operation-card fields remain unspecified for YAIR.

| State | Normal Omsi loop behavior | Evidence |
|---|---|---|
| Mana/time | Timer 0; available mana back to initial 250 | E4 |
| Resources | Gold, reputation, herbs, hide, potions, teamMembers, armor, blood, artifacts all 0; glasses, supplies, pickaxe and loopingPotion false | E5, E11 |
| Raw stat EXP | All nine stats reset EXP to 0 | E12 |
| Talent and skill EXP | Retained; each awarded stat EXP also gives talent at 1/100 of that amount | E12 |
| Soulstones and buffs | Retained unless an action explicitly spends them | E12, E14 |
| Current location and guild | Back to town 0; guild string cleared; adventure/craft guild segment counters 0; supply price 300 | E7 |
| Town discovery and exploration | `exp*`, `total*`, `checked*` and `good*` persist; each good location's repeatable availability restored into `goodTemp*`; run loot accumulator 0 | E13 |
| Multipart work | Current partial progress and loop counter 0; lifetime completion totals retained | E7, E13, E15 |
| Unlocked towns, dungeon history, stories | Not cleared by normal restart; serialized as persistent progression | E15 |
| Plans/options | Next list, named loadouts and options retained; execution progress rebuilt/reset | E7, E15, E17 |

Reload is another boundary: save stores progression and the **next** list, not current run resources, timer or current action position. `load()` finishes paused; it is not a mid-action resume [E15]. Only talent and soulstones are restored from saved stat objects, not their raw EXP [E15c]. A loop boundary, a browser reload and a destructive hard reset must not be conflated.

Bonuses stack without a new character lineage. Stat training grows transient raw EXP and lasting talent; talent and soulstones multiply stat EXP gain. Their formulas use exponents 0.4 and 0.8 respectively, so incremental returns diminish [E6, E12]. Dark Ritual spends soulstones for persistent Ritual, whose driver multiplier speeds early zones with zone-specific capped bands; Chronomancy multiplies speed as a quarter power. Imbue Mind spends soulstones and adds a lasting training limit plus Imbuement [E4, E14]. These are spending layers inside one loop structure, not nested death/prestige layers resetting one another.

## F3 Pacing and grind

Town knowledge reveals later work and reduces repeated search. The same known good resource sites can be harvested in later loops rather than rediscovered, while unchecked sites remain an exploration choice [E13]. This is a strong separation of remembered knowledge from restored opportunities.

Travel remains an action sequence every run. In town 0, buy supplies/haggle/travel become visible at combined Combat+Magic level 15 and usable at 35. Supplies cost gold; haggling consumes reputation to lower cost; journey consumes supplies and 1,000 base mana [E16]. Permanent town unlock does not mean permanent teleport access. Earlier jobs stay useful because later travel still depends on the money/mana chain.

Grind is managed with execution speed, cheaper actions, named plan reuse and permanent exploration gains, rather than eliminated. Raw stats reset, travel prerequisites recur, and higher ritual costs consume permanent soulstones. No measured completion time or player acceptance was obtained. Creator homepage's playtime estimate is not a benchmark for the inspected snapshot.

## F4 Data and save design

Actions are JavaScript prototypes containing stat weights, type, manaCost, visible/unlocked/canStart, effects and optional multipart callbacks. Four shapes drive shared UI/state behavior: normal, progress, limited and multipart. This is reusable structure plus authored functions, not a pure JSON job table. Labels/tooltips use localized XML with lazy getters [E18]. Runtime actions are constructed by name; stable `varName` overrides explicitly preserve save compatibility.

The save enumerates durable numeric state, flags and sparse plan records instead of storing an event per tick or a full action object graph. Limited sites store discovery counters rather than individual-site identities. This keeps repeated loops from adding unbounded biography rows [E15]. It would lose YAIR's desired person-specific history if transferred literally.

Storage remains uncompressed JSON in localStorage; exported text is `ILSV01` plus LZString base64. Import accepts that format or the older encoding. Format and legacy migration are explicit, but the load path mixes field-default fixes and legacy flags such as `version75` rather than a single ordered schema migration pipeline [E15, E19]. Export compression does not make browser storage compressed. No quota guard is apparent in the inspected save write.

YAIR live source already has a 4 MiB origin-wide UTF-16 size budget and quota-error preservation in `src/save_files.js:166-189`; the north star's older no-size-guard line is stale. Existing `life_record.js` and `npc_lives.js` likewise mean counters/summary ideas should extend those owners, not add duplicate modules. This is source inspection, not a test of their current behavior.

## F5 Browser UI

Dense information is split into current actions, next plan, town actions, stats, skills and resources. Named loadouts let a player switch goals without rebuilding every entry [E17]. Locks distinguish not-yet-seen actions from visible-but-unusable actions, and capped actions receive another class [E20]. Tooltips show weighted stat contributions, mana costs and multipliers rather than putting all math on buttons [E18, E20]. Current-action tooltips expose mana/gold remaining and errors at execution time [E7, E20]. These are inspectable feedback channels for learning why a routine broke.

No screenshot or browser accessibility/keyboard-use audit was performed. Source HTML/CSS availability proves interface intent, not readable layout at a particular viewport.

## Small touches mapped to vanilla YAIR, all proposals

| Code | Source touch | Original YAIR adaptation | Evidence |
|---|---|---|---|
| T1 | Separate current and next plan | Edit tomorrow's fieldwork/training plan while current work runs; display when edits take effect | E7 |
| T2 | Pause before restart | Pause a native routine at its daily boundary with a plain stop reason | E4, E7 |
| T3 | Pause on an incomplete list | If cave preparation misses its food/tool target, stop before departure instead of silently repeating | E4, E7 |
| T4 | Named loadouts | Reusable Village gathering, paid work and cave-preparation routines in the existing center panel | E17 |
| T5 | Disable an entry without deleting it | Temporarily suspend a native running/weightlifting step while preserving its place in the plan | E7 |
| T6 | Wrong-town/cost failure text | Explain which Village or cave step lacked location, stamina or materials | E7 |
| T7 | Recomputed action costs after training | Preview how Running or Farming changes the next native work block; avoid stale estimates | E6 |
| T8 | Visible before usable | Let vanilla quest/action panels show a hinted recipe and its actual prerequisite before unlocking | E16, E20 |
| T9 | Remembered good sites restored per loop | In an optional loop world, remembered herb patches refresh; ordinary vanilla gathering remains unchanged | E13 |
| T10 | Search-known versus search-new toggle | Choose reliable native gathering or surveying for new sites, using one familiar action panel | E13 |
| T11 | Stage progress plus lifetime completions | Native bridge/crafting research shows the current stage and prior successful attempts separately | E13, E15 |
| T12 | Remaining-resource receipt on an action | Cave-preparation rows show food, stamina or money remaining at the end of each step | E7, E20 |
| T13 | Per-action caps | Set a routine to gather only its tool/recipe requirements; expose a reached-target state | E7, E20 |
| T14 | Bonus bank named in seconds | If a banked-time mode is chosen, show bank, speed and consumption rate together; distinguish it from ordinary offline advancement | E8 |

Vanilla mapping read directly from `src/activities.js:16-150` (Job/Training/Gathering and native fieldwork/running/weightlifting), `src/data/locations.js:297-350,498-524` (Village and nearby cave), and `src/quests.js:16-99` (native quest tasks and visibility). This list does not propose mandatory looping, resetting vanilla reputation or deleting followers.

## Ranked north-star proposals

1. **P1 Routine execution receipts.** Show stop reason, unmet prerequisite and last successful step for existing jobs/gathering/preparation. Smallest useful D2b fit; no new prestige required.
2. **P2 Explicit operation retention cards.** An optional loop must separately name restored resources, remembered knowledge, retained usable skill and returned people. Idle Loops provides a concrete example of knowledge persisting while team recruitment resets.
3. **P3 Compact durable counters plus bounded history.** Keep a current-project state and completion summary while existing life-record owns detailed/annual history; report save budget before adding broad lifelong logs.
4. **P4 Understanding distinct from repeatable execution.** Exploration/research reveals the method; successful preparation makes it routine. Use the north star's two bars rather than calling all lasting talent understanding.
5. **P5 Staged projects with declared restart rules.** Research/crafting cards say whether incomplete work pauses, survives a new day or resets in an actual loop. Loop source resets partial multipart work, which ordinary YAIR research need not do.

Followers require an additional identity/consent/lifespan model; the teamMembers integer is specifically too thin for the north star. Aging is not supplied by this game. No claim here resolves offline aging or promotes a fresh reset layer into accepted scope.

## Evidence locators

All source links pin the inspected commit; GitHub API links are live lineage metadata checked 2026-10-09.

- **E1** [Creator endorsement](https://github.com/StopSign/stopsign.github.io/blob/d41bf197f9203e6da6f72628a9d76369b8140d57/index.html#L23-L32).
- **E2** [Lloyd parent metadata](https://api.github.com/repos/lloyd-delacroix/omsi-loops).
- **E2b** [dmchurch parent metadata](https://api.github.com/repos/dmchurch/omsi-loops).
- **E3** [Original MIT notice](https://github.com/StopSign/stopsign.github.io/blob/d41bf197f9203e6da6f72628a9d76369b8140d57/LICENSE.md#L1-L21).
- **E4** [Tick, speed and restart](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/driver.js#L4-L157).
- **E5** [Initial mana and resources](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/saving.js#L22-L84).
- **E6** [Action cost and persistent bonus formulas](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/actions.js#L235-L260).
- **E7** [Action execution, failure and restart](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/actions.js#L13-L193).
- **E8** [Omsi load credit](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/saving.js#L411-L440).
- **E8b** [Omsi bonus bank and 5x toggle](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/driver.js#L527-L550).
- **E9** [Original load credit and ratio](https://github.com/StopSign/stopsign.github.io/blob/d41bf197f9203e6da6f72628a9d76369b8140d57/idleLoops/saving.js#L60-L61).
- **E9b** [Original uncapped load credit](https://github.com/StopSign/stopsign.github.io/blob/d41bf197f9203e6da6f72628a9d76369b8140d57/idleLoops/saving.js#L207-L213).
- **E9c** [Original ticking and backlog handling](https://github.com/StopSign/stopsign.github.io/blob/d41bf197f9203e6da6f72628a9d76369b8140d57/idleLoops/driver.js#L9-L59).
- **E10** [dmchurch frame/bulk execution](https://github.com/dmchurch/omsi-loops/blob/fe4a349efb799a56ab548018caca1a1a1aea0c8f/driver.js#L88-L218).
- **E10b** [dmchurch borrow/return bank](https://github.com/dmchurch/omsi-loops/blob/fe4a349efb799a56ab548018caca1a1a1aea0c8f/driver.js#L720-L733).
- **E10c** [dmchurch load cap](https://github.com/dmchurch/omsi-loops/blob/fe4a349efb799a56ab548018caca1a1a1aea0c8f/saving.js#L1306-L1312).
- **E11** [Run resource reset](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/driver.js#L211-L214).
- **E12** [Talent gain, stat reset and multipliers](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/stats.js#L132-L149).
- **E13** [Town persistent knowledge and repeatable sites](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/town.js#L20-L86).
- **E14** [Dark Ritual expenditure and buff](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/actionList.js#L1771-L1840).
- **E14b** [Imbue Mind expenditure and training limit](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/actionList.js#L3226-L3296).
- **E15** [Durable save projection](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/saving.js#L444-L488).
- **E15c** [Reload selectively restores stats](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/saving.js#L227-L243).
- **E15b** [Legacy migrations](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/saving.js#L262-L280).
- **E16** [Travel sequence and reveal thresholds](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/actionList.js#L916-L1044).
- **E17** [Named plan save/load](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/driver.js#L252-L294).
- **E18** [Action types and localized getters](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/actionList.js#L58-L130).
- **E19** [Export/import format](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/saving.js#L719-L750).
- **E20** [Progressive reveal](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/views/main.view.js#L510-L550).
- **E20b** [Current action resource tooltip](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/views/main.view.js#L443-L463).
- **E20c** [Action cost/weight tooltip](https://github.com/omsi6/omsi6.github.io/blob/fa21477d424f3aa1f1bf6deb9f6f83c2569770ab/loops/views/main.view.js#L725-L781).

## CHECKPOINT

Completed: shallow source acquisition; original-author and continuation lineage verification; exact repository-license findings; six research lenses; source-defined reset/offline comparison; fourteen small vanilla mappings; five ranked proposals.

Write ownership: only `docs/research/open-idle-games-2026-10-09/IDLE_LOOPS.md`. All gameplay and project owners were read-only. No installed scripts, gameplay/browser tests or YAIR mutation was authorized or performed. Parent GM owns cross-game synthesis and the overall report/checkpoint.

Remaining acceptance: these ideas need creative review. Any authorized implementation later requires a fresh-origin rebuilt browser slice, and save/reload/import when persistence changes. Source-inspected behavior is not player-tested behavior. The newest inspected fork's default-head commit is dated 2025; no claim of active October 2026 maintenance is supported. The absence of a license grant for fork-specific contributions remains a reuse limit; original mechanical paraphrase is the chosen route.
