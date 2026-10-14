import {writeFile, readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {cheatGame} from '../../../../../tests/helpers/cheat_game.mjs';
import {grantCheat, recordCheatMessage, SYSTEM_QUESTS_CARD} from '../../../../../src/cheat_cards.js';
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
