# Combat page visual spec and receipt

## Visual spec before implementation

Desktop 1920×1080, with the existing fight centre and Reports dock. Open an ordinary single-wolf fight from the earned Fang Yuan Moonglow checkpoint, then play it through the current move controls. The wolf's health should read as a visible condition such as “Hurt.” The player's resource shortage should read as a concrete reason beside the move, using the amount required and in hand whenever the fight supplies them.

| Reference | Sampled palette and form | Applied to this page |
| --- | --- | --- |
| YAIR native and Cave depths | Near-black `#06040F`, slate `#1D243C`, baseline `#C0C0C0`, HP red `#FF0000`, timing magenta `#9C009C`. Tight sans text, rectangular rows, straight rules, horizontal tracks. | Slate stage, thin dividers, red for wounds and magenta for readiness. Keep the place over both sides and one roster row per fighter. |
| YAIR conditions and stance | Condition ground `#5A5A5B`, outline `#808080`, type `#FFFFFF`. Stance grid line `#797691`. Sans labels with compact tabular figures. | Square condition text, named posture, existing settings in a fold with their current values visible. |
| OOPS RI and Mara | Indigo `#090D26`, teal `#002840`, slate-blue `#232D57`, plum `#2C1E3F`. OOPS Gothic typography and separate Reports column. | Keep the game font and dock. Give the fight an inset slate surface and use the existing shared theme tokens for other states. |

Use the raised scene rule, square track ends, solid and broken rules, and the game’s native controls as the ornaments. Harm uses red slashes, hinder a broken purple edge, protect a cyan inset, influence an amber ruled strip, and escape an outlined exit control. Text names each group and every critical condition. A move shows beats and any resource spend beside its button. Threat and turn order each get a line that can wrap. Keep the observer boundary on enemy vitals, and use the battle’s existing posture, injury, and outcome fields. Bind uses the existing capture means check and bound outcome. Existing saves supply these facts without a format change.

| Element | States |
| --- | --- |
| Scene header | Place, light and footing from the fight. Names of additional participants when present. Turn order wraps below. |
| Fighter row | Ready or waiting, braced or under a ward, injured, down, yielding, unconscious, disarmed, bound, fled. Dim resolved fighters in their original order. |
| Move | Available, blocked with reason, or waiting for another fighter. An adjacent quote carries known beats and resource spend. |
| Intent | Stance and intended fate stay visible while settings are folded. Existing controls change both. |
| Fate | Downed or yielding target. Bind appears when binding means are available and resolves to the existing bound outcome. |

## Rebuilt desktop proof

Agent-verified at 1920×1080. The before bundle was `700ef55a65a0a57aff5f870831171956dc78846b1a48a542dac0db1ed6491d2c`. The candidate was `2d5a00dc1838e711bf271fc5c38aeaf6a53f7c804180be73222eadeea48bc497`.

Both captures opened the same disposable save prepared from the earned `ri-fang-yuan-moonglow` checkpoint. Through ordinary controls, Fang Yuan adopted the day extension, bought and fed Moon Orchid petals, played and reported a three-hour patrol, then saved. From that checkpoint, Beginning offered the existing one-wolf hunt. Both captures used that opener. Two Moonblades spent eight essence and left the wolf barely standing. Save and reload preserved the fighters, their timing and the visible roster. The game's Export control supplied the payload for the Import file input. The imported fight matched the same checks. A third Moonblade won, the wolf row read Dead, and Reports and the pack recorded the parts.

A separate engine fixture started a normal fight with one rope and a human opponent. A player-controlled Quick strike caused the downing. The live fate band offered Bind, and playing it changed the same fighter row to Bound. Back closed the end view. The regression also checks that a downed person with no binding means offers no Bind and the resolver refuses it.

[Before](before.png) · [After](after.png) · [Same-save comparison](before-after.png) · [Supplied reference beside the candidate](side-by-side.png)

[Mid-fight](mid-fight.png) · [After reload](reloaded.png) · [Wolf settled](settled.png) · [Bind offered](downed-person-bind.png) · [Bound result](person-bound.png)

## Visible differences

| Area | Deliberate change |
| --- | --- |
| Scene and surrounding columns | The title stands on its own. The next line names Beyond the wall, daylight and poor footing. Turn order has a full-width ruled line. The existing expanded fight layout leaves Reports beside the fight. The supplied reference shows a different day, inventory, wolf size and journal arrangement. The same-save comparison holds those conditions steady. |
| Fighters and threat | Both rows live in the fight centre, with HP on the left and timing on the right. The wolf's labelled health track uses three visible bands. Checkable injury and posture words stay with the fighter. Threat stays on the fighter's own line with learned attack estimates. Thin slate rules and flat rectangular tracks follow Cave depths. The wound fill and timing use lighter red and magenta for readability. The global player vitals dock still serves the rest of the workspace. |
| Choices and approach | Compact groups replace the long stack. Red double rules mark harm, dashed violet marks hinder, a cyan inset marks protect, an amber dashed rule marks influence and an outlined edge marks escape. This wolf has no hinder move. Beat counts and essence or stamina sit beside the controls. The wolf's bargain refusal appears once by its button. The folded settings spell out what happens when the opponent goes down. A keyboard or pointer preview carries the longer move description. |
| Outcome and controls | The resolved wolf and the bound person stay in their ordered rows. The fate band names the target and numbers its choices for keyboard use. The existing Back control returns to the previous view. Reports still records fight events and the outcome. |

## Commands and gaps

| Command | Result |
| --- | --- |
| `BUILD_OUT=/private/tmp/combat-page-sol/before npm run build` | Exit 0. Built the before capture. |
| `node build.js` in the isolated source copy prepared from the shared checkout by `scripts/perf/lib.mjs` | Exit 0. Two existing duplicate-key warnings. |
| `node --test tests/{tempo_fight,tempo_fight_run,tempo_kit,fight_terms,combat_situation,combat_versus,combat_focus,opponent_board,combat_surface_types,combat_interaction}.test.js` | Exit 0. 106 passed. |
| `npm run check:arch` and `git diff --check` on the edited paths | Both exit 0. |
| `/private/tmp/combat-page-sol/capture prepare`, `capture before`, `capture after`, `capture person` | Each exit 0 on the recorded run. Chromium and loopback sockets were blocked. The background WebKit harness served the built files through an in-process loopback URL handler. It supplied a single-writer lock for its disposable browser because legacy WebKit lacked that API. |
| `npm run check:flow` | Exit 1. Loopback listen returned `EPERM`. Browser geometry assertions covered the combat controls and the reported Threat overlap. |
| `npm run check:rules` and `node --test tests/ui_style_ratchet.test.js` | Both exit 1. The shared checkout has a player-text finding in `src/absorb_p23/host_joins/tranche_one_ui.js` and a markup increase in `src/ui/book_craft_controls.js`. Combat markup is 30 against a baseline of 33. |

The WebKit reload and import retain the fight state. Reports shows repeated earlier combat lines after those transitions. Desktop Chromium, the full suite and human review were outside the evidence above. This lane uses the current save shape and leaves Git publication to the coordinator.
