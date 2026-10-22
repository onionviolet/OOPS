# Latest-master app adoption and natural-clock verification, 2026-10-22

Weibao requested updating the app to latest master and verifying that the new
work actually appears. Applies AD32, AD34, AD36, AD39, AD41; AR3, AR6–AR10,
AR16; MR5 and UR1–UR69. Desktop target 1920×1080; the normal player window
uses its existing available screen size. Mobile and human pacing/taste acceptance
remain deferred. No private save fixture, imported state or gameplay command is
used in the normal player profile.

## Findings and bounded correction

F1: The visible earlier OOPS window was an old live-root preview on a disposable
profile. The normal profile was not running. Its adopted pointer was
`v0.6-72af84cf8e66`, while staged `v0.6-9b8c50adfbc2` was newer but also behind
master. Snapshot creation from `c74f09433` initially adopted
`v0.6-de929b65f931`; all 82 runtime files and bundle identity matched master.

F2: Natural-clock Electron testing found a real rejection missed by the earlier
paused browser journey. Repairer quotes included the simulation sequence, and
new material-product keys included the current production timestamp. An idle
tick could therefore produce "The repairer quote changed" without changing the
player's reviewed materials, costs, product properties or effects. Fitting did
not advance in that failing native run. Hide preparation had the same timestamp
comparison risk.

The correction compares all preparation terms except the unrelated simulation
sequence and the timestamp of the newly proposed product. Exact consumed parent
keys, lineage facts, output counts/properties, grants, costs and eligibility are
still revalidated. Execution constructs the product with the fresh actual
production timestamp. Other gear-workshop quote validation stays unchanged.
This uses the existing material/workshop seam, with no save schema, new state,
clock or renderer controller.

F3: New LOTM entry is deliberately restricted by `book_world_lotm_domain.js` to
localhost plus `?lotm_probe=1`. An app update does not expose that start through
`app://yairpg`. This task reports that boundary rather than silently changing the
world's delivery scope or importing a test branch into the player's save.

## Verification and delivery

The focused regressions cover accepted idle chronology/sequence changes, current
product chronology, changed exact parents/output counts, changed source grant,
and loss of required stock without spending. Focused material/workshop slice:
11/11 PASS. Build, architecture (main growth 0), zero-warning rules and all 36
rule-behavior checks pass. Full suite: 2,591 PASS, zero failures/skips. The final frozen Electron results
are recorded in [APP_CHECKS.json](APP_CHECKS.json).

Disposable Electron tests import only browser-earned native exports from the
previous exact-master proof. They check visible preparation/fitting, institution
and cultivation controls; perform real native actions; and Save, reload, Export
and literally Import on `app://yairpg`. They do not pause or advance the engine
through test hooks. All three native action/persistence cases completed on the
exact 82-file snapshot. The runner then failed its final hard-coded Gothic14
assertion: the imported disposable save explicitly selected system14. A focused
native follow-up verified the rendered `.SF NS` system font agrees with that
retained preference, and recorded zero resource misses. The full runner is not
labelled an all-green command; the font failure was an incorrect test expectation,
not a request to override saved typography. The initial hidden keyboard attempt was a detached-node
harness failure; subsequent actions activate the visible authored DOM controls,
with game mutation still owned by their existing native handlers.

Private app screenshots, failed diagnostics, inspector handles and test exports
remain under `/Users/weiwei/.codex/research/master-app-adoption-2026-10-22/`.
Public proof excludes personal-profile content and history-bearing screenshots.
The original visible preview and other active agents are preserved.

## Final normal-app result

[Actual player-app receipt](APP_ADOPTED.json): **PASS**. Source fix
`629254f307bfd6489ff1275649918d474ba74096` produces frozen build
`v0.6-1c223618b5b5`, bundle
`755bdf98cb8816ca7bed4177e9147f903d2f1d11bd2a003ab5e67a10131c3594`.
All 82 snapshot files match the primary checkout. The player app adopted it
through the real **Save and reload** control; a graceful full restart retained
the same current pointer and served bundle. The final window runs in normal
player mode (`background: false`) with ordinary prompts/exports, remains at
PLAY, and reports the existing save present. No character creation, test import,
private save inspection or gameplay command was performed in that profile.

The new original routes appear through **More panels → Gear workshop**, **Homes**,
and **Projects → Mistglass conservatory**, subject to their existing native
lesson, entry and earned-state conditions. Disposable native Electron proof
shows the actual new controls, both kit routes, fitting/lining effects, office
fund settlement and compatible path-work expenditure, with three complete
Save/reload/Export/literal-Import cases. The typography follow-up respects the
explicit system14 saved override and reports zero missing resources. LOTM new
entry remains localhost test-only; this app update does not claim to expose it.

The current app gate is closed. Human pacing/taste and each feature owner's
deferred gameplay remain open. The earlier no-adoption/publication wording in
linked dated records describes their original execution boundaries.
