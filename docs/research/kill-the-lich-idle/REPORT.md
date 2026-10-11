# Kill the Lich Idle installed source audit, 2026-10-09

Kill the Lich's best contribution is making ordinary pursuits feed later power: practice builds attributes, social contact opens work and information, and preparation changes what an eventual confrontation can use. YAIR can borrow those connections through native skills, jobs and dialogue without copying a graph UI or adopting three reset layers.

**F1 Installed source status.** Steam App 4522510 reached StateFlags 4, build **23044204**, with 372,649,498 installed bytes. The retained `resources/app.asar` is 3,590,430 bytes, SHA-256 `a048bcaa9dc50d2af320ceb1457fef5424f8dd17dee793e50be2411f10f379fa`. Install and private copy hashes match; all 118 extracted app-owned files match both ASAR byte slices and embedded integrity hashes. `main.js:8` initializes Steamworks App 4522510, corroborating the manifest's identity. This is a bounded installed source pass, with no game execution or account API checks.

The original 23-file public intake at `d41bf197f9203e6da6f72628a9d76369b8140d57` remains in `INTAKE.json` and private `source/`. **Zero files match raw hashes:** 22 are present with changed bytes, and `LICENSE.md` has no installed counterpart. Of those 22, **19 match exactly after CRLF normalization**. Only three differ semantically: `globalsAndInitial.js:106-111` sets `isSteam=true`; `index.html:493-494` enables Steam script tags; `MECHANICS.md:38-51` adds debug prose and changes packaging prose. Selected gameplay bodies, including engine, automation, saving, reset and action definitions, therefore corroborate the six prior chains in the shipped build. Public links below point to the historical text; precise installed file/line/hash bindings sit alongside them in `FINDINGS.json`.

Private receipts: `~/.codex/research/kill-the-lich-idle/STEAM_RETENTION.json`, `STEAM_VERIFICATION.json`, `INSTALLED_WEB_COMPARISON.json` and `INSTALLED_PASSAGE_COMPARISON.json`. Raw ASAR, installed extraction and selected public-source files total 7,060,520 bytes before small receipts, below the 10 MiB cap. No raw source, dialogue or artwork enters the repository. Public MIT license provenance remains historical: installed `package.json:8` reports `UNLICENSED`, so this audit does not infer a license for copying the installed package.

**F2 Six installed chains traced.** The relevant installed method bodies were read, with public corroborating links preserved. These are static observations, not measured gameplay:

| Code | Chain | Source-backed observation |
|---|---|---|
| C1 | Effort -> reflection -> useful attributes | Overclock routes toward reflect/body/travel/money/social pursuits. Reflect reveals note-taking and body-awareness steps by level; these reward attributes which contribute to efficiency. Engine consumes resource into progress; downstream routing uses tier, sliders and focus, normalized when total effective ratio exceeds one. Not simply five competing literal percentages of one global stamina pool; routing formulas scale sliders through tiers/focus. [Source](https://github.com/StopSign/stopsign.github.io/blob/d41bf197f9203e6da6f72628a9d76369b8140d57/KTL/data/globalsAndInitial.js#L189-L198). |
| C2 | Work -> spending -> a home or community project | Money generator transfers generated coins to spending; graph branches to supplies, social access, equipment, housing and later investment. A reading chair rewards comfort/calm and reveals a fireplace; town investment branches toward library and carpenter work. Source describes these as action/attribute upgrades, not proof of simulated persistent buildings or NPC economies. [Source](https://github.com/StopSign/stopsign.github.io/blob/d41bf197f9203e6da6f72628a9d76369b8140d57/KTL/data/globalsAndInitial.js#L208-L218). |
| C3 | Social practice -> access -> threat information | Meet People routes to listening, Scott and coffee club. Scott reveals handyman and tavern-helper opportunities. Coffee gossip leads to Hear About The Lich; fear gain depends on total momentum and conversation resource and is added on Overclock completion without consuming fear. Named interactions are authored nodes. This is not evidence for autonomous NPC beliefs, schedules or full relationship simulation. [Source](https://github.com/StopSign/stopsign.github.io/blob/d41bf197f9203e6da6f72628a9d76369b8140d57/KTL/data/globalsAndInitial.js#L293-L314). |
| C4 | Charge -> mana -> arcana/spells -> stronger ordinary work | Dissipation feeds Pool Mana. Pool Mana generation depends on its source reservoir and action power/efficiency. Thread Arcana consumes mana and generates arcana into Prepare Spells. Mana quality multiplies grimoire level, fixed formula, research and incantation practice; prepared internal spells include overcharge/overwork/overtalk. The graph and formula are inspected; spell charge timing and the complete magic tree were not exercised. [Source](https://github.com/StopSign/stopsign.github.io/blob/d41bf197f9203e6da6f72628a9d76369b8140d57/KTL/data/globalsAndInitial.js#L520-L525). |
| C5 | Prepared life -> separate confrontation -> legacy rewards | initializeKTL checks confirmation and, outside debug, Lich knowledge plus mana quality; stops actions outside plane 2, starts that plane and the named repose exception, then seeds confrontation resources from lifetime momentum and fear. Combat chain removes wards, fights, kills and shatters phylactery; terminal nodes advertise legacy per completion. Entering Northern Wastes is a transition/stoppage, while useAmulet performs the distinct reset. Combat here is action progress, not a verified native YAIR battle analogue. [Source](https://github.com/StopSign/stopsign.github.io/blob/d41bf197f9203e6da6f72628a9d76369b8140d57/KTL/ktl.js#L401-L454). |
| C6 | Amulet -> severance -> optional Genesis, with different retention | Amulet invokes base reset per action but restores selected plane-1/plane-3 unlock metadata and plane-3 visibility; special wheel/repose treatment differs. Severance clears base attributes, legacy/coins/whispers and non-unique upgrades, then hides magic; Genesis additionally clears kill/reset progression and scales retained unlock count by a bought perk. UI availability predicates depend on monolith level/kill count or buying newGamePlus. Three reset layers are source structure only. MECHANICS timing estimates are unmeasured; no 50-Amulet or two-month trigger is asserted. Controllers mainly check confirmations, so UI availability predicates are not necessarily hard controller guards. [Source](https://github.com/StopSign/stopsign.github.io/blob/d41bf197f9203e6da6f72628a9d76369b8140d57/KTL/ktl.js#L612-L670). |

**F3 Reset and pacing correction.** The Northern Wastes transition stops most ordinary actions; Amulet use separately resets their base state with named exceptions. Severance and Genesis clear different progression. The document's “roughly 50 Amulet uses” and “~2 months” are author estimates, not verified timings or code triggers. Inspected UI eligibility uses monolith progress/kill counts or purchase of New Game+, while controllers check confirmation. The optional Genesis upgrade describes itself as an end-of-current-content option, not required future content. Do not convert these into YAIR balance promises.

**F4 Existing YAIR baseline from the earlier public pass.** Counted routines and pause/resume already exist (`src/simulation.js:311-329`); bounded compact biography (`src/life_record.js:41-47`), 4 MiB origin save guard (`src/save_files.js:166-190`), reading time/progress (`src/display.js:4457-4471`) and bounded household history (`src/npc_lives.js:5-39`) are source-present. Proposals extend useful consequences and legibility, not alleged missing foundations. This audit adds no runtime proof to those systems.

**F5 Installed timing and automation qualifications.** `automation.js:4-115` walks upstream to enable or disable familiar work when its reveal/cap conditions and purchased upgrades permit it; combat-plane actions are excluded. `automation.js:278-343` fires an ordered custom-trigger queue until the next unmet condition, applies slider rewards, and marks each fired trigger. This is useful conditional routine behavior, not a general autonomous planner. Amulet/severance reset fired flags and the queue index; persistence through every Genesis/perk combination remains unverified.

`driver.js:14-25` credits offline absence as bonus time after five seconds and adjusts cooldown/daily counters. `driver.js:294-327` spends instant-time credit and temporarily simulates at one tick per second. `helpers/interval2.js:14-58` bounds elapsed catch-up to 2,000 ms and base ticks to 40, then multiplies that count by speed before an uncapped inner loop. The new documentation suggests further work caps; the suggestion is not shipped implementation proof. No months-of-play, 50-use threshold, offline equivalence or performance measurement was run.

**F6 Installed save route correction.** Unlike the earlier web entry, Steam scripts are enabled. `preload.js:3-9` exposes cloud bridges and `main.js:64-112` has guarded cloud read/write handlers. `saving.js:77-132` can load successful cloud data into localStorage before decoding. However `saving.js:351-359` still comments out the normal cloud-save call. This is static asymmetric wiring, not verified synchronization: ordinary saves go to localStorage while load attempts cloud recovery. No real save, cloud request, export, import or user data was touched.

## Ranked original proposals

| Rank | Code | Proposed play | Priority |
|---|---|---|---|
| 1 | P1 | Let ordinary skills improve a later method | Highest: deepens existing skills rather than replacing the starting campaign. |
| 2 | P2 | Make a familiar contact open practical work | High: a skill path becomes part of a lived place; no new universal relationship meter. |
| 3 | P3 | Give preparation a visible effect in a difficult encounter | High: life activities make combat decisions richer without scaling every threat. |
| 4 | P4 | Make earned money leave a useful mark at home | High-medium: economic choices become a home and biography, not only a bigger number. |
| 5 | P5 | Show what a counted routine will accomplish | Medium: reduces chore clicks while preserving active choices. |
| 6 | P6 | Keep power amount and power quality distinct | Medium-later: makes a world rule mechanically distinct; select a specific local lane before implementation. |
| 7 | P7 | Explain a milestone estimate without pretending certainty | Medium: makes long tasks legible without promising reference pacing. |
| 8 | P8 | Preview one prestige retention policy clearly | Later: useful contract pattern, but broadest save impact. |

P1-P3 best connect vanilla activities, people and preparation. P8 is design-only and requires a chosen retention policy. Existing acceptance backlogs remain ahead of a new wave; all proposals here remain unaccepted and unimplemented. Precise source links, native mapping and bounded proofs are in FINDINGS.json and IMPLEMENTATION_PACKETS.md.

## Original small touches

These 24 suggestions are original YAIR touches prompted by the source, not claimed KTL features. Their inspiration anchors and native maps are in FINDINGS.json.

- **T01** A Meditation milestone names the later task it improves. Native map: `src/activities.js:130-135; src/data/skills.js`.
- **T02** A craft row explains the skill contribution to quality. Native map: `src/crafting_recipes.js:85-101`.
- **T03** A practice action shows its next useful milestone beside the current progress. Native map: `src/data/skills.js; src/display.js`.
- **T04** A learned method remembers the ordinary job that first made it click. Native map: `src/activities.js:84-97; src/life_record.js:41-47`.
- **T05** First paid fieldwork records a compact first-wage memory. Native map: `src/activities.js:84-90; src/life_record.js`.
- **T06** One crafted chair description credits the village carpenter. Native map: `src/data/locations.js:363-370; src/crafting_recipes.js`.
- **T07** Returning to the Shack mentions the single installed furnishing. Native map: `src/data/locations.js:363-370`.
- **T08** A donated manual unlocks one specific local study opportunity. Native map: `src/items.js:1092-1152; src/data/dialogues.js`.
- **T09** A shopkeeper remembers the first completed commission. Native map: `src/data/dialogues.js; src/data/npcs.js`.
- **T10** A useful rumor names its speaker and the place they heard it. Native map: `src/adventure_notebook.js; src/data/dialogues.js`.
- **T11** Repeating small talk after a job changes one line rather than reopening its reward. Native map: `src/data/dialogues.js`.
- **T12** A declined commission remains politely available. Native map: `src/data/dialogues.js`.
- **T13** A scouting preparation names the specific threat it addresses. Native map: `src/data/locations.js; src/native_battle_contracts.js`.
- **T14** A known overwhelming enemy can be inspected without implying a fair fight. Native map: `src/party_battle.js; src/adventure_notebook.js`.
- **T15** Returning from a prepared encounter leaves one trace in the biography. Native map: `src/life_record.js:41-47`.
- **T16** An expedition entry preview states that existing life progress stays. Native map: `src/data/locations.js; src/display.js`.
- **T17** A counted routine row states both count and intended output. Native map: `src/simulation.js:311-329; src/simulation_ui.js`.
- **T18** A paused task distinguishes player pause from missing ingredients. Native map: `src/simulation_ui.js; src/crafting_recipes.js`.
- **T19** A practice row says fuel unavailable separately from method unlearned. Native map: `src/simulation_content.js; src/items.js`.
- **T20** A tool tooltip explains one method it supports. Native map: `src/items.js; src/activities.js:60-73`.
- **T21** A milestone estimate labels the assumed location and rate. Native map: `src/display.js:4457-4471`.
- **T22** A cap or target reached message appears once instead of each tick. Native map: `src/simulation.js:311-329; src/display.js`.
- **T23** A future prestige preview lists one retained person and one retained object concretely. Native map: `src/save_files.js; src/chronicle.js`.
- **T24** A later prestige history can record the chosen purpose instead of only a count. Native map: `src/life_record.js:41-47; src/chronicle.js`.

## Verification and remaining gates

Install/private ASAR hashes, 118 extracted byte slices and integrity hashes, 23-file public comparison, 3 JSON files and 149 installed evidence ranges/hashes were checked. Six chains, 8 proposals and 24 native-mapped touches are present; mapped native files exist. Steam scripts are enabled in the installed entry, while the normal cloud-save invocation remains commented out. No game code execution, builds, dependency installation, launches, save access, YAIR source edits or commits occurred.

**R1 Remaining gate.** Installed build identity and retained source bytes are verified for this bounded static pass. Parent owns the uninstall request after handback; no uninstall or dialog action was taken by this worker. Actual pacing, rendered UI, offline correctness, entitlement API and save/reload/import remain unrun. All 8 ranked proposals and 24 native-mapped touches remain unaccepted and unimplemented. Existing native-map line pointers are candidate owners from the earlier audit; recheck concurrent project owners before any implementation.

Parent rechecked the live/private raw archive hash and requested `steam://uninstall/4522510`, shell exit0. Removal remains unverified; [receipt](../../gm/dispatch/steam-installs-2026-10-09/LICH_UNINSTALL.json). Dossier ownership returned to parent.

## Final Steam receipt, 2026-10-09

Source scope: installed Electron JS bodies plus pinned-public-source comparison. Parent verified retained-copy gates and requested uninstall through Steam. Final observed removal state: **verified-manifest-absent-and-log-success**. [Per-app receipt](../../gm/dispatch/steam-installs-2026-10-09/LICH_UNINSTALL.json). No dialog clicked or game launched. Parent owns the dossier after reader handback. Earlier acquisition-only queue text is superseded by this pass.
