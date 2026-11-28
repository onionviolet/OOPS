# Proto-like and upstream scan, 2026-11-27

Weibao asked to pull the latest from YAIR and the proto-likes, using the Arcanum
Discord. This records what was found. It is a finding, not a decision.

## Sources read

- Arcanum Discord (guild 622495527485046805): `#proto-23`, `#yet-another-idle-rpg`,
  `#other-general`, `#users-code`, searched through the Discord bridge on 2026-11-27.
- GitHub API for `miktaew/yet-another-idle-rpg` and `miktaew/yet-another-idle-rpg-dev`.
- A dry-run `git merge-tree` of `yair-dev/master` into OOPS `master` (e2de42ec0).

## YAIR upstream

- `upstream` (miktaew/yet-another-idle-rpg) was last pushed 2026-06-26. OOPS is
  0 commits behind it.
- Live development happens in `miktaew/yet-another-idle-rpg-dev`, last pushed
  2026-11-27. OOPS now has it as fetch-only remote `yair-dev` (push URL disabled).
- OOPS last merged dev at `f0e32c200` (2026-10-08). Since then dev has 62 commits,
  47 files changed, +4652 / -1525.
- Dry-run merge: 18 conflicted files: changelog.html, index.html, style.css,
  src/main.js, src/display.js, src/items.js, src/enemies.js, src/rewards.js,
  src/verifier.js, src/crafting_component_filling.js, src/components/levelable_component.js,
  src/components/trader_component.js, src/data/dialogues.js,
  src/data/inventory_templates.js, src/data/npcs.js, src/models/combat.js,
  src/models/hero.js, src/models/location.js.

What dev added since 2026-10-08:

| Area | Commits | OOPS relevance |
| --- | --- | --- |
| In-game map prototype, `src/mods/map.js` (canvas, nodes from `locations`) | b11025983 (PR 258) | Direct input to END_GOAL "Future RPG view with a map" R3 and R4 |
| Achievements system, tab, notifications | ea0e29a12 to be3276b1f | Reports and milestone surface overlap |
| Delayed rewards mechanic | fd1f14997 | Possible kernel settle pattern |
| Town unlock, deep forest, cat cafe, alchemist, traders, bear meat | 200f1ba6d to 043321204 | YAIR content OOPS has not absorbed |
| Heavy armor block bonus | 3076099e2 | Touches the A2d armored-skin numbers |
| Weapon XP restore, XP multiplier fix, multitarget fix | 8a01833be, 8fa75ca37, 164305a3b | Combat correctness |
| Debug screen mod (+768 lines) | src/mods/debug_screen.js | Dev tooling |

## Proto-likes named in the community

Members list these as the Proto23 family (message 1573794453007892552 and others):

| Game | Where | Notes from the channel |
| --- | --- | --- |
| Proto23 | https://23html.github.io/ | The root. No update in about six years. Text UI, dojo start, energy from items only |
| YAIR | miktaew dev repo | Members call it the successor that overtook Proto23 |
| NekoRPG | https://onko342.github.io/NekoRPG/ | Chinese cultivation idle, fan translation by onko342 |
| Arkivia | https://just-pointless.github.io/arkivia/ | New Proto23 variant set around 1600, sleep restores energy, dojo start |
| Cultivating All The Above (CATA) | https://github.com/onko342/cultivating-all-the-above | Proto23 + YAIR + NekoRPG inspired. Titles, rankings, nested tabs |
| The Climb, yet another experimental idle rpg | named only | Not located |

Design ideas from the channel worth weighing (inference, not tested):

- onko342 folds every "just waiting" action (travel, searching, gathering,
  cultivation) into one patience or mindset skill that speeds those actions.
  OOPS already has Patience in EV5 Quiet recovery.
- onko342's qi arts lock a share of qi while an effect is maintained ("invested"),
  which matches SM1's upkeep allocation.
- onko342's rune constructs: order matters, longer chains are higher tier and more
  often fizzle.
- SardineMilk's engine treats the player as one more actor driven by the UI.
  This matches R1 (loop-neutral rules).

"xa" matched nothing relevant in the server: one 2025 stack trace and one unrelated
message.
