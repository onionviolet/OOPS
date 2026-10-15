# Borders, carried growth and alternate rules

All SHOWN claims below cite the revision pinned in REPORT. YAIRPG takeaways are INFERRED PROPOSALS.

## B1: region topology is a rule, not a loading screen

`cellwalker` follows the graph of the current tiling. `barriers.cpp:667-695` chooses a new land, writes `bardir`, `barleft`, `barright`, and uses front/back feasibility or the general builder. Extension assigns neighboring land cells and preserves the separator. The historical nice-wall route has geometry-specific direction cases; generalized routes support other tilings. Do not reduce the implementation to a rectangular biome grid.

`setbarrier` (`barriers.cpp:293`) treats two sea lands, elemental neighbors, haunted transitions, mirror images and Terracotta's mercury river differently. Great Walls are normally impassable. Reaching another land means navigating the generated layout and its accessible seams, rather than walking through any wall tile. Wall-free separators exist separately through `buildBarrierNowall` (`barriers.cpp:1169`).

`bigstuff.cpp:759` builds equidistant coast/depth structures. `create_altmap` (`bigstuff.cpp:425`) and horocycle helpers support nested local formations such as islands, temples and Camelot. `get_superland` (`landlock.cpp:480`) groups Mountain under Jungle, Temple under Rlyeh and others; it is an implementation grouping, not proof of cosmological nesting.

`getNewLand` (`landlock.cpp:590-770`) constructs a weighted candidate array, adds neighbor-affinity entries, tests mode conditions, filters incompatibility and in-game validity, and randomly picks a surviving candidate. If none survive it reports no eligible candidates and returns the old land. Sea placement has a separate bounded candidate loop. **Consequence:** unlock, likely placement and guaranteed next destination are different.

## B2: laws compose at the edge

| Case | Executable mechanism | What to adapt |
|---|---|---|
| Living Cave / foreign objects | `complex.cpp:2377` weights real wall types, corpses, creatures, items, Digging and Empathy. Chaos has an explicit foreign-neighbor exception. | A local simulation consumes actual imported properties. Keep a named exception instead of pretending all materials behave alike. |
| Storms / outside ground | `complex.cpp:195` classifies charge. Great Walls/chasm isolate; some foreign objects and non-electric land ground. `elec::affect` changes creatures and terrain, including treasure creation. | Boundary conditions can make an imported object useful, not merely suppress it. |
| Ice / carried Winter | `complex.cpp:2073` processes heat; Winter reverses the player's heat input, while Cocytus uses a different base temperature. | Retain one causal power but let the local substrate change its consequence. |
| Living Fjord / elementals | `complex.cpp:2440` assigns large biases to water/earth elementals and selected player powers. | A local hazard can become a work method through a power imported from elsewhere. |
| Mutant growth / outside region | classes.cpp's overgrown help states a restricted outside growth shape; monster consumers are in `monstermove.cpp:1415-1445`. Full exception matrix unread. | Keep outside-law checks separate from ownership or learning. |

## B3: what the traveler carries

| Carrier | SHOWN implementation | Boundary |
|---|---|---|
| Treasure and score | Global `items[]`, `items.cpp:gold`, and local treasure IDs; collection feeds achievement and unlock readers. | Treasures are not one interchangeable XP currency. Score has special weights. |
| Kill history | `kills[]`, `isNative`, `tkills`, `killtypes`, generation and demon thresholds. | A count can change access or difficulty; it is not general mastery training. |
| Active orbs | Pickup adds charges; `orbs.cpp:markOrb`, `reduceOrbPower` and `reduceOrbPowers` track use and decay. Time/Energy/Intensity, curses, multiplayer and modes alter the rule. | Timed run powers are not permanently learned skills. |
| Land of Power exit | `pcmove.cpp:1872`: IC_ORB holdings of at least two become two, with Orb of Fire excluded. | Explicit exit effect, not a universal import policy and not the same as getOLR. |
| Followers and rescue state | Golem/bomberbird actors plus scoped princess state; count/HP fields enter score-box saving (`system.cpp:1258`). | No evidence here of a general persistent relationship network or career system. |
| Baby tortoise identity | `complex.cpp:tortoise`, `items.cpp`, `pcmove.cpp`: retained bit pattern is compared with destination animals/environment and projected as progress. | Context matching is mechanical identity, not affinity text alone. |
| Profile accomplishments | High scores, mode records, `everwon`, `chaosUnlocked` feed optional modes. | Profile unlock does not transfer the prior run's physical terrain, possessions or people. |

Orb generation's `LOCAL10`, `CROSS10`, `GLOBAL25` flags (`orbgen.cpp:35`) express the common native/hub/foreign progression at 10/10/25 treasures in classic mode. Guest entries, mode flags and special placement complicate it. `getOLR` can classify a spawn as dangerous/useless/forbidden without providing the actual carried-use rule. OSM (`inventory.cpp`) offers suitability warnings and contains a `usedForbidden` flag. The activation handler at inventory.cpp:678-688 appears to test the previous tile item rather than the selected orb when setting that flag; the rescue achievement reads it at complex.cpp:644. This source mismatch is untested at runtime. See DS3 in the aspect deeper read.

## B4: access and long objectives

Default numeric macros depend on `big_unlock`: R10 10/50; R30 30/100; R60 60/200; R90 90/300; U10 10/25 (`hyper.h:458-479`). Do not quote one difficulty's threshold as universal.

Hell: `orbsUnlocked()` counts treasure types at R10. `lands_for_hell` requests 9 normally or 40 in casual, capped by available eligible land entries and mirror adjustment (`landlock.cpp:223`). Native Yendor orb generation then also depends on its own orb rules. **Owning a Yendor orb is not the normal prerequisite for all advanced lands.**

Yendor: touching a locked orb creates a path record to its key. YDIST is 101, so the generated path has 100 edges before geometry/rejection checks (`hyper.h:581`, `yendor.cpp:243`). Key and orb state belong to that record, rather than any generic key opening any orb. Collection grants shielding and selected suitable extra powers, increments orb count, consumes a key and records victory (`yendor.cpp:665-708`). The special Yendor Challenge requires prior normal victory and has its own scenarios; general land unlocks remain separate.

Hyperstone: `count_at_level` over current valid land list tests R10, with explicit exclusions for Hyperstone itself, Holy Grail, saved princess and selected Euclidean exceptions; duplicate old/new mirror rewards are handled (`landlock.cpp:323-355`). Single-Crossroads mode has an override. Hyperstones spawn through hub-generation logic after this predicate, so completing the predicate does not instantly grant one.

## B5: requested alternate modes

| Mode | SHOWN changes | Profile/score distinction |
|---|---|---|
| Chaos | `landlock.cpp:90-145` has a family of land structures, not one boolean. Standard Chaos permits wall-free mixing; variants alter patching, walls and treasure multipliers. `bigstuff.cpp` consumes these selectors. | Qualified entry to Crossroads IV sets chaosUnlocked (`pcmove.cpp:1888`). Chaos changes some unlock and interaction branches too; it is not just a new seed. |
| Pure Tactics | `yendor.cpp:tactic`: select one land, exclude reliance on other-land features, retain per-land consecutive-run scoring windows. `classes.cpp:land_tac` defines runs and multipliers; `PT` fixes selected generation rates instead of kill-driven increases. | Most lands require high score × landMultiplier ≥20, with special exceptions. Normal table often uses ten runs; default nonstandard mode uses three, Camelot one. No global fixed run count. |
| Shoot'em up | `shmup.cpp:monster` adds transforms, inertia, missile parent and timing fields. `turn` advances elapsed simulation, moves players/projectiles/monsters and schedules environmental updates. Focus/pause and delta limits apply (`shmup.cpp:2638`). | Own mode codes and achievement flags. Orb meanings and some terrain behavior differ. This is a second execution model over much shared content. |
| Orb Strategy | `inventory.cpp:inv` derives remaining activation inventory from treasure, used-up counts and seed; activated orbs then feed ordinary power state. | Distinguish stored activations, active charges and historical use. Extra context, not one of the three requested modes. |

`achievement.cpp:wrongMode` rejects mismatched geometry, structure and special-mode conditions. Achievement eligibility is separate from permission to play. This competitive restriction is not a reason to restrict YAIRPG's solo options.

INFERRED fit: use existing P14 rule variants, P05 carry contracts, P13 explicit clocks and P15 generated identity. New edge leaf HR-N1 belongs beneath those owners. Do not copy real-time scheduling into idle progression or import remote-map deletion into retained-world history.
