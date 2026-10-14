import {writeFile, readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {cheatGame} from '../../../../../tests/helpers/cheat_game.mjs';
import {grantCheat, recordCheatMessage, SYSTEM_QUESTS_CARD} from '../../../../../src/cheat_cards.js';
if(!process.argv.includes('--ch1')) {
const game = await cheatGame();
try {
    await game.page.locator('#character_name_field').fill('TEST FIXTURE C0');
    await game.page.locator('#character_name_field').dispatchEvent('change');
    const fresh = JSON.parse(await game.page.evaluate(() => __cheatTest.create_save()));
    const at = fresh['current time'];
    const cheats = recordCheatMessage(grantCheat(fresh.cheats, SYSTEM_QUESTS_CARD, {route: 'test-fixture', at}),
        'system-quests', 'Your system is awake.', at);
    await game.page.evaluate(value => __cheatTest.set(value), cheats);
    const serialized = await game.page.evaluate(() => __cheatTest.create_save());
    if(game.errors.length) throw new Error(game.errors.join('\n'));
    await writeFile(new URL('held_system.save.txt', import.meta.url), serialized + '\n');
    const bundle = await readFile(new URL('../../../../../dist/bundle.js', import.meta.url));
    const hash = createHash('sha256').update(bundle).digest('hex');
    await writeFile(new URL('README.md', import.meta.url), `# C0 held system fixture\n\nBuilt with \`node build.js\`, then \`node docs/gm/dispatch/cheat-status-window-2026-10-13/fixtures/build_fixture.mjs\`.\n\nThe test helper bundles the real main.js with test-only access to load/create_save and the cheat state. Headless Chrome starts a new game at 1366×768, confirms hero creation and names the hero TEST FIXTURE C0. Pure grantCheat adds system-quests with route test-fixture and the real game calendar; recordCheatMessage adds one message. The real create_save serializes held_system.save.txt. No personal save or hand-written game envelope is used. The frozen C0 gate separately verifies the uninstrumented rebuilt bundle.\n\nUninstrumented dist/bundle.js SHA-256: \`${hash}\`.\n\nClassification: seeded-native. This does not prove natural acquisition or a visible status panel.\n`);
    console.log('Built held_system.save.txt; bundle sha256 ' + hash);
} finally {await game.close();}
}

// CH1 prerequisite: choose through the real creation flow, then advance the real clock.
const ch1 = await cheatGame({start: 'system-quests'});
try {
    await ch1.page.locator('#character_name_field').fill('TEST FIXTURE CH1');
    await ch1.page.locator('#character_name_field').dispatchEvent('change');
    const result = await ch1.page.evaluate(() => {
        const before = JSON.parse(__cheatTest.create_save())['current time'];
        const remaining = (3 - before.day_count) * 1440 - before.hour * 60 - before.minute - 45;
        const consumed = __cheatTest.advance(remaining);
        return {remaining, consumed, serialized: __cheatTest.create_save()};
    });
    const save = JSON.parse(result.serialized);
    if(result.consumed !== result.remaining || save['current time'].day_count !== 2 ||
        save.cheats.held['system-quests'].card.state.awakened !== false ||
        save.cheats.held['system-quests'].acquired.route !== 'optional-start' ||
        save.cheats.held['system-quests'].messages.length !== 0 || ch1.errors.length)
        throw new Error('CH1 fixture clock/dormancy failed: ' + JSON.stringify(result));
    await writeFile(new URL('dormant_day3.save.txt', import.meta.url), result.serialized + '\n');
    const readme = (await readFile(new URL('README.md', import.meta.url), 'utf8')).split('\n## CH1 dormant day-3 fixture')[0];
    const hash = createHash('sha256').update(await readFile(new URL('../../../../../dist/bundle.js', import.meta.url))).digest('hex');
    await writeFile(new URL('README.md', import.meta.url), readme + `
## CH1 dormant day-3 fixture

Rebuild with \`node build.js\`, then run this builder with \`--ch1\` to preserve the existing C0 fixture.

CH1 build SHA-256: ${hash}.

Hero: TEST FIXTURE CH1. The helper selects system-quests in the real hero creation control before confirmation. Its route is optional-start, awakened is false and messages are empty. The real update_timer advances the clock to day 2, 23:15, leaving 45 game minutes until day 3 (about 45 real seconds at the normal tick rate). The real create_save writes dormant_day3.save.txt. No hand-written game calendar or envelope is used. CH1's frozen browser gate loads this prerequisite and observes the actual day boundary, log message, reveal, save/reload and literal import on the uninstrumented build.

Classification: seeded-native prerequisite; the browser gate supplies changed-behavior evidence.
`);
    console.log('Built dormant_day3.save.txt at ' + JSON.stringify(save['current time']));
} finally {await ch1.close();}
