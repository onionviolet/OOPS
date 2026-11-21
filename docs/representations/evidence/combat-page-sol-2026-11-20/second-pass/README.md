# Combat page second pass

## Visual spec before implementation

Use the supplied Cave depths panel as the desktop fight centre reference. Its sampled slate is `#1D243C`, its row rules are `#C0C0C0`, its HP is `#FF0000`, and its timing is `#9C009C`. The reference uses compact sans labels, white text inside a broad rectangular health track, and a thinner timing track directly below. Keep OOPS's selected game font. Use the existing shared slate, red and magenta fight tokens, thin rules and square bars. Match the reference's stacked stripes and fixed roster. A target marker and injury words identify what the protagonist can act on. An unknown opponent gets only its existing observed health band. A fallen row dims in place.

Use the same earned wolf checkpoint and 1920×1080 layout as pass one. Scene and approach each get one compact control. Scene detail, Threat and odds open from the subject or move they describe. Show the move name and cost in one shallow strip. Use shared semantic edge colours with the same button shape for every effect. A wolf's unavailable plea stays present with “A wolf does not bargain.” Group larger move sets and keep positions fixed when a move becomes blocked. Validate the fixed roster through a hit, save/reload, export/import and settlement. Keep the separate Bind regression and repeat its played proof.

## Played proof

Both desktop captures entered the existing one-wolf encounter through Beginning, from the same disposable checkpoint earned by feeding Moonglow and playing and reporting Fang Yuan's patrol. The baseline is the first-pass build `2d5a00dc1838e711bf271fc5c38aeaf6a53f7c804180be73222eadeea48bc497`. The second-pass bundle is `c460a0297c082d4b31541e81996e101ad1c72ab7594f5cd72a2792a1d5dd2c3d` with combat CSS hash `512240be681f371e9709144586c84569f55aaf40f2a66a78e895eb9589cb03e9`.

Two casts spent eight essence. The wolf reached Barely standing while its row and the move positions held. The mid-fight Save, reload, Export and Import retained the roster text, actor state and timing. The replay counted every saved battle line once before Save, after reload and after Import. Another cast won. The separate person fixture was downed with Quick strike, offered Bind, and updated that row to Bound. The browser closed that result through Back.

The duplicate Reports came from `src/combat_situation_ui.js`. Its initial overlap check only read live combat markup. `src/reports_dock.js` restores its saved tail as plain Earlier rows, so the check treated the existing lines as new. The fight renderer now finds the already-reported prefix among those rows, including when a non-combat line follows it. A fight opened in the current session still emits its new lines.

[Before](before.png) · [After](after.png) · [Full-screen before and after](before-after.png) · [Cave reference and new card](side-by-side.png)

[Before reload](mid-fight.png) · [After reload](reloaded.png) · [Wolf settled](settled.png) · [Bind offered](downed-person-bind.png) · [Bound result](person-bound.png)

## Visible differences

| Area | Comparison with Cave depths and pass one |
| --- | --- |
| Fighter rows | Thick red health bars with their readouts inside now span the row, with thin magenta timing directly underneath. Pass one put the gauges side by side with separate text readouts. Square slate rows and thin rules follow Cave depths. The candidate uses lighter ink and adds the player's own row, a target tag and known conditions beside each name. Cave depths shows exact rat HP. The wolf shows only Fresh, Hurt or Barely standing. |
| Scene and threat | A one-line encounter title replaces the title, scene facts and turn-order lines shown together in pass one. The title gives the scene on hover. One Fight details fold holds the scene, turn order, Threat, fighter notes, terms and policy controls. Opened in the browser, the turn-order line sat above Threat without intersecting it. |
| Move strip | Equal-width controls replace the effect sections and persistent preview on the ordinary card. A thin shared-colour edge marks each effect. Cost or blocker sits beneath its move. Details and relevant footing or light cues are on the move's hover. Effect headings are reserved for more than eight ordinary slots. The temporary stakes choice shares one slot and sits outside that threshold count. |
| Outcomes | A fallen fighter keeps their position and dims. The human's fate choice opens beneath the roster. The plain rectangular rows replace the first pass's repeated standing and timing text. |
| Surrounding UI | The full-screen pair holds the same earned save, viewport and OOPS font. The cave comparison crops to equal-width panels and preserves each source's aspect ratio. The surrounding OOPS vitals, inventory and Reports docks are visible in the full-screen pair. |

## Checks

| Command | Exit and result |
| --- | --- |
| `node build.js` through `scripts/perf/lib.mjs` in an isolated copy of the shared checkout | 0. Two existing duplicate-key warnings. |
| `node --test tests/{tempo_fight,tempo_fight_run,tempo_kit,fight_terms,combat_situation,combat_versus,combat_focus,opponent_board,combat_surface_types,combat_interaction,reports_dock}.test.js` | 0. 115 passed. |
| `/private/tmp/combat-page-sol-pass2/capture before`, `capture after`, `capture person` | All 0. Background WebKit on fresh loopback origins through an in-process URL handler. The disposable harness supplied the missing legacy WebKit lock API. |
| `npm run check:arch`, `git diff --check` on the edited paths | Both 0. |
| `npm run check:flow` | 1. Sandbox denied loopback `listen` with `EPERM`. Focused WebKit geometry checks passed. |
| `npm run check:rules`, `node --test tests/ui_style_ratchet.test.js` | Both 1 on existing shared changes. Player text in `tranche_one_ui.js` and markup in `book_craft_controls.js`. |

The large move set is implemented but the browser replay samples the ordinary strip and the separate fate band. Chromium and human review remain unverified.
