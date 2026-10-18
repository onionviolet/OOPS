# The Climb and Magic Research 2: browser play and source comparison

2026-10-15. Requested research, not a new implementation queue or accepted design.

**Recommendation:** combine The Climb's connected places, people and equipment
routes with MR2's clear explanation of the next practical bottleneck. YAIR already
has several corresponding systems. The useful next question is whether players
can find, understand and connect them, rather than whether to add another system.

[Follow-up gap audit](GAP_AUDIT.md) checks existing implementations and proof,
ranks untested interactions, and adds the source trace for banked time across
retirement. Its 31 passing current source checks do not substitute for play.

## Scope and existing authority

Played the public browser demos through ordinary UI controls in new background
in-app tabs. Neither tab presented an existing character on first opening.
No user save was imported, erased or edited. No retail application was launched.
This was an opening-systems trial, not completion of either demo.

[Current direction](../../DIRECTION_SUMMARY.md) remains authoritative: one
continuing person, world-dependent carryover, chosen offline routines that stop
for meaningful decisions/supply limits, forgiving recovery, and the first
one-realm/one-prestige milestone. The accepted Proto23 composition and
[UI rules](../../UI_RULES.md) remain in force. Reference games do not supersede
these choices. No YAIR runtime, build, save or shared direction file changed.

The earlier [MR2 audit](../magic-research-2/REPORT.md) was static-only.
Its [proposal review](../magic-research-2/IMPLEMENTATION_PACKETS.md#review-status-2026-10-07)
already closes three proposals as shipped and selects equipment slice D1.
Do not reopen these as missing systems on the strength of this comparison.
The older [idle-game comparison](../../RESEARCH_IDLE_GAMES.md) contains the prior
The Climb source findings.

## What was actually tried

| ID | Ordinary UI route and result | Boundary |
| --- | --- | --- |
| T1 | The Climb: start at home, enter city, visit training grounds and information board, fight dummies, leave combat. Log recorded six dummy kills, First Blood, a level-up, damage changing from 1 to 3.06 after the achievement and then 4.08 at level 2. | Training only; no Tower-floor completion or rebirth. |
| T2 | Visit guild, read the early prestige warning, inspect job board. Its requests showed reputation rewards and a next-contract date. | No contract submitted. |
| T3 | Ask smith about free gear, follow his referral to the woodworker, receive three diagrams, access to her crafting station, a wood-gathering clue and a felling axe. Enter forest, choose Harvest Wood, equip axe from inventory. Equipment slot showed the axe; observed Tree damage changed from 4.08 to 4.49. Harvest yielded two Wood and five character XP. Start reading Training Sword diagram and return to the shop. | Diagram disclosed ten Wood and the Woodworking station. Only two Wood earned; no completed craft or confirmed completed reading. |
| T4 | MR2: select Water primary and Modern mode. Gather mana, unlock channeling, channel Water/Air, build mana generation, channel Earth, build a mana shard, fill essence storage, build storage, channel Fire, build an essence catalyst, unlock Study and assign the sole researcher to Water. Reach Water level 2; observe Transmutation unlock, Inventory/Transmute navigation and the Enchant Mana Spouts spell announcement. | Three mana spouts produced +3 mana/sec; mana cap 200; essence caps 500; one catalyst. No item transmuted, wizard automation, boss, retirement or full-demo completion. |
| T5 | MR2: reload; reopen Study. Buildings, Study access and the Water researcher assignment survived; XP continued increasing. Clipboard export was attempted, but the captured clipboard text was empty. File export download observation timed out. | Initial reload displayed Water XP 134 versus 146 just before reload, and mana 119 versus 128. This is broad recovery evidence, not exact latest-state persistence. No successful export or import is claimed. Further browser interaction was blocked by browser security policy. |

Raw observations, screenshots, an empty clipboard-attempt artifact and acquired code are in
the ignored [private evidence directory](private/). `mr2-before-reload.ax.txt`
and `mr2-after-reload.ax.txt` preserve the reload comparison. No player's personal
save is part of this research.

## Findings and YAIR implications

| ID | Evidence | What we can learn; disposition |
| --- | --- | --- |
| F1 | **PLAY + SOURCE:** MR2 unfolds gathering, channeling, income, capacity, storage, efficiency and study in sequence. Each step updates Current Goal and supplies a fictional reason for the new capability. Source: `src/backend/events/progression/PreTrainingProgression.tsx`; `src/backend/hints/Hints.tsx` selects the first incomplete hint; `src/components/Home.tsx:175-195` renders it. | **ACCOUNT FOR NOW:** offer one useful, player-known next step through the existing focus/log surfaces. An optional suggestion should respond to the actual bottleneck, not become a compulsory global quest line. |
| F2 | **PLAY:** The Climb's smith-to-woodworker-to-forest route supplies a person, place, diagram, tool and workspace for one aim. Asking a follow-up question supplies the axe and gathering directions. | **ACCOUNT FOR NOW:** make learning, materials, access and use form a visible journey. Trace an existing Village craft from NPC clue to usable output before proposing more workshops. Preserve each world's fictional means. |
| F3 | **PLAY + SOURCE:** First Blood changes combat immediately. The Climb bundle's `enemies_killed_0` grants flat and percentage Strength effects. `climb-traces.json` records the bundle offset. | **LATER:** achievements can demonstrate a capability change rather than serve as decoration. This supports the requested title/achievement design space, but does not select universal rewards. Consider trivial-target farming, NPC eligibility, one-time award persistence and whether an award changes available actions. |
| F4 | **PLAY + SOURCE:** MR2 distinguishes income, current stock, capacity and conversion. A mana shard raises cap from 100 to 200; Fire channeling's displayed cost changes from 20 to 40. `BasicChannelingSpellBase.tsx:49-53,83-91` derives base cost from mana cap and output from base cost and efficiency. | **ACCOUNT FOR NOW:** preview both what an upgrade helps and any cost it changes. More capacity can mean a larger batch, not faster replenishment. Keep fuel, output/control, knowledge and equipment effects legible through existing YAIR owners. |
| F5 | **PLAY + SOURCE:** MR2 disables channeling when the destination essence store is full. `BasicChannelingSpellBase.tsx:155-166` contains the full-store recommendation gate. Water primary also changes the practical price of Water casting. | **ACCOUNT FOR NOW:** unavailable controls need the actual reason: full output store, insufficient fuel, missing knowledge, occupied equipment slot or access. Existing `src/skill_discovery.js` already distinguishes discovery, ownership and current eligibility. Improve its consumption rather than inventing another unlock state. |
| F6 | **PLAY:** The Climb preserves local context and a persistent log, but routine hit lines rapidly crowd milestone messages. Important explanations depend on hover or a separate board. Its Skills tab was empty in the early tested state. | **ACCOUNT FOR NOW:** preserve YAIR's full-height log while making discoveries and consequential changes easy to recover. A log entry should link to its source as UR29 already requires. Critical next steps should also be available on click/focus. Do not infer that an empty early skill tab means the game has no skills. |
| F7 | **UI INSPECTION:** MR2 exposes UI updates/sec, optional popup suppression, remembered collapsed sections, and a catch-up-versus-Time-Pieces preference. These were read, not benchmarked or toggled. | **LATER:** separate UI refresh from simulation correctness; distinguish routine progress messages from decisions that require interruption. Keep our accepted offline-stop and return-summary policy. The reference does not prove power savings or a correct offline model for YAIR. |

## Source access, decompilation and local availability

**S1: The Climb.** [Official published repository](https://github.com/tomlipo/the-climb)
at `b3a9510f34f210cb3f731932316efe9f100f04f2` contains the deployed HTML/assets,
not a conventional editable source tree. Its 615,308-byte JavaScript bundle was
read as text. SHA256:
`32d9e9da3554522635966a00ddea5fd8a557f6906dcab24797379d282ba3e654`.
GitHub repository metadata reported no license. Inspecting mechanics does not
mean importing its code, artwork or text into YAIR.

**S2: MR2.** [Developer demo repository](https://github.com/mcolotto/magic-research-demo)
at `05717a17798a2165780ac38465f1e0c2d8736796` hosts the demo. The public main
source map supplies original TypeScript/TSX bodies, making retail decompilation
unnecessary for this pass. Reacquired main JS and map match the old intake hashes:
`6258fe652147afc5455ed29e61106e5f18cc666dccd28b592acfc9e6ea543d69` and
`5ce376807005aa5418211661a0b9f9b4370725a3c94b17439a82ff994c1eaf59`.
The new private cache extracted 569 entries whose paths start with `src/`;
that is an extraction count, not a count of files read. Source index contains
map indices, original paths and extracted-file hashes.

**S3: SDK.** The [official modding SDK/example](https://github.com/mcolotto/magic-research-2-modding-example)
is a separate useful reference. Its license file is MIT. That license is evidence
about the SDK/example, not a license for all MR2 game code or assets. The SDK's
existence does not establish an editable public retail source tree.

**S4: local check.** No Magic Research/MR2 installation was found in
`/Applications`, `~/Applications`, the configured Steam library manifests/common
folder, or the bounded Downloads/Games/Neutron paths searched. Spotlight results
identified project research copies, not a game installation. This cannot rule
out an unindexed or differently named archive elsewhere. The old intake's
`~/.codex/research/magic-research-2` cache was absent, so this pass reacquired the
public demo JS/map into this report's ignored private directory. No retail
decompilation or new software installation was performed.

## More to consider

- **C1, ACCOUNT FOR NOW:** run an existing-player discoverability trial. Ask a
  fresh player to find one meaningful local improvement, explain its bottleneck,
  obtain it and name what changed. Reuse `src/techniques.js`,
  `src/energy_resources.js`, `src/alloy_equipment.js`, `src/skill_discovery.js`
  and the existing renewal/program owners. Source presence alone does not prove
  that this journey is discoverable or coherent in the live UI.
- **C2, ACCOUNT FOR NOW:** preserve discovery boundaries. Guidance uses only
  known clues and authoritative eligibility, never an unrevealed reward or raw
  secret catalog. Player-visible discovery and underlying truth remain distinct.
- **C3, ACCOUNT FOR NOW:** use persistence and return behavior in any later trial.
  A saved assignment should survive reload, while a depleted supply or major
  choice should stop a chosen routine. Today's MR2 reload retained broad state
  but did not prove exact recovery; neither export nor import succeeded as a
  verified test in this pass.
- **C4, LATER:** deepen one connected loop before broadening the catalog. The
  most useful follow-up is a YAIR side-by-side journey using existing content,
  followed by one small presentation change if that trial identifies a concrete
  gap. Do not add another prestige layer, mandatory all-element curriculum,
  hungry-player penalty or universal achievement reward system from this study.

## Evidence limits

This report combines actual opening play, selected source inspection and labeled
proposals. No late-game balance, full demo, retail parity, complete source audit,
long offline session, energy benchmark, cross-game save compatibility or YAIR
gameplay verification is claimed. The default browser viewport was used; this
was not a YAIR 1366x768 acceptance run. No commit or push.

Source acquisition file hashes, 569 extracted-source body hashes, saved image
files and report local links were checked. The failed empty-export check was
corrected in T5 above. Browser access ended with a security-policy block; no
alternate browser, CDP or other workaround was used. Research does not require
resuming that blocked export action.
