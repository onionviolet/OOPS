# CN11 seeded native fixtures

Generated from pre-slice commit `b12f5161af7c8996d34229a29a9a41d0fbe8b575`.
These are disposable test heroes, never user saves. `.save.txt` files are literal
native export files suitable for Import; `.save.json` files are the unchanged
native serializer output suitable for isolated-origin localStorage loading.

| Fixture | Starting facts |
|---|---|
| old-before-slice | Fresh pre-cue/pre-Village-sentence serializer format, no successful crafts, town.returned false |
| crafted-low | Successful Woodworking (Processed rough wood) and Forging (Iron chainmail), starting levels 0 |
| crafted-high | Same hero has also successfully crafted both at starting levels 11 |
| town-returned | Higher-level hero completed begin, brief, timber, settle, return; one kit and corrected ledger retained |

Generate: `node tests/helpers/rt_slice1_fixtures.mjs`.
Verify: `node --test tests/rt_slice1_fixtures.test.js`.
Use a fresh disposable localhost origin and import a `.save.txt`. Wood logs and
iron remain for repeating the two item recipes in the native crafting screen.
The fixtures contain completed craft outputs, not a persistent receipt, because
this pre-slice version does not serialize the transient craft display receipt.
Craft again to inspect new cue/receipt rendering.

Seeding uses seed 17 at native expansion construction, the actual field-clear
reward processor and craftsman learning reward, native inventory and skill XP
APIs, and native transactional crafting. The elder hello line runs through its
ordinary dialogue function. This is seeded-native evidence, not naturally earned
combat, resource acquisition or skill progression. Low Woodworking also retained one partial scaled output before its full success;
its checkpoint has four processed wood, and the high checkpoint has seven.
Low successes needed 5/16
attempts; high successes needed 1/2 (Woodworking/Forging). The manifest records
levels before crafting, which may subsequently grant XP.

Town facts are earned by actual town commands and a three-minute native timber
settlement, spending two logs. Fixture relocation uses the native location
function's `skip_travel_time` option. Ordinary timed travel exposed an existing
`Invalid calendar anchor` error; it is not verified by these fixtures. No debug
setter or save-field edit supplies a town fact, unlock, craft, or output.

The test bundle disables wall-time update scheduling and exposes native functions
without editing production files. It preserves the real browser DOM, load path,
models, save transactions and serializer. Regeneration reproduces gameplay
facts and seeded outcomes; wall-time serializer metadata need not be byte-identical.
The old fixture preserves this commit's actual format, including town.returned
false. It is not an invented older expansion schema or a save from before the town
system existed. Keep the archived old fixture frozen when testing future readers.

Like the existing cheat browser tests, the harness needs Playwright and Chrome.
Override `RT_PLAYWRIGHT_MODULE` and `RT_CHROME_PATH` for another machine.
