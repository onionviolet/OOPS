import {readFile, writeFile, copyFile, mkdir, mkdtemp, rm, symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {parseArgs} from 'node:util';
import {execFileSync} from 'node:child_process';
import {ROOT, FIXTURES, build, prepareTree, readFixture, serve} from '../../scripts/perf/lib.mjs';

const {values} = parseArgs({options: {
    rev: {type: 'string', default: 'HEAD'},
    fixture: {type: 'string'},
    'text-size': {type: 'string'},
}});
const fixtures = [...FIXTURES, 'gear', 'busy-journal'];
if (values.fixture && !fixtures.includes(values.fixture)) {
    throw Error(`Unknown fixture. Choose ${fixtures.join(', ')}.`);
}
const textSize = values['text-size'];
if (textSize && (!values.fixture || !['14', '21'].includes(textSize))) {
    throw Error('--text-size takes 14 or 21 and requires --fixture.');
}

const here = fileURLToPath(new URL('.', import.meta.url));
const scratch = await mkdtemp(join(tmpdir(), 'oops-live-layout-'));
const tree = join(scratch, 'tree');
let server;

try {
    const revision = values.rev === 'WORKTREE' ? values.rev
        : execFileSync('git', ['rev-parse', '--verify', '--end-of-options', `${values.rev}^{commit}`],
            {cwd: ROOT, encoding: 'utf8'}).trim();
    prepareTree(revision, tree);
    const fonts = join(ROOT, 'resources/fonts/private');
    try {
        await readFile(join(fonts, 'gothic-bitmap-14.woff2'));
    } catch (error) {
        throw new Error(`The layout preview needs the local Gothic bitmap fonts at ${fonts}.`, {cause: error});
    }
    await mkdir(join(tree, 'resources/fonts'), {recursive: true});
    await symlink(fonts, join(tree, 'resources/fonts/private'), 'dir');
    execFileSync('git', ['apply', '--whitespace=error-all', join(here, 'item-summary.patch')], {cwd: tree});
    await build(tree);
    const overlay = join(tree, 'layout-lab');
    await mkdir(overlay);
    for (const file of ['layout.css', 'layout.mjs', 'rewind.mjs']) {
        await copyFile(join(here, file), join(overlay, file));
    }
    const index = join(tree, 'index.html');
    const html = await readFile(index, 'utf8');
    let fixtureScript = '';
    if (values.fixture) {
        const gear = values.fixture === 'gear';
        const busyJournal = values.fixture === 'busy-journal';
        const fixture = JSON.parse(readFixture(gear || busyJournal ? 'mid' : values.fixture));
        // Perf fixtures may carry an older look. Let this revision resolve its own default.
        delete fixture.customization;
        if (gear) fixture.inventories.person.main_character[JSON.stringify({id: 'Wolf leather armored pants', quality: 65})] = {count: 1};
        if (busyJournal) {
            for (const id of ['The Infinite Rat Saga', "It won't mill itself", 'Village expansion', 'Bonemeal delivery', 'Light in the darkness']) {
                const quest = fixture.quests[id];
                if (!quest) throw Error(`Missing Journal fixture quest: ${id}`);
                quest.is_active = true;
                quest.task_status = [{progress: {}}];
            }
        }
        if (textSize) {
            const profiles = pathToFileURL(join(tree, 'src/customization_profiles.js')).href;
            const {defaultCustomizationState} = await import(profiles);
            const appearance = defaultCustomizationState();
            appearance.profiles[appearance.active].settings.typography.size = Number(textSize);
            fixture.customization = appearance;
        }
        await writeFile(join(overlay, 'fixture.js'), `if (!sessionStorage.getItem('layout-fixture')) {
    localStorage.setItem('save data', ${JSON.stringify(JSON.stringify(fixture))});
    sessionStorage.setItem('layout-fixture', '1');
}`);
        fixtureScript = '<script src="/layout-lab/fixture.js"></script>';
    }
    await writeFile(index, html.replace('</head>', `
        ${fixtureScript}
        <link rel="stylesheet" href="/layout-lab/layout.css">
        <script type="module" src="/layout-lab/layout.mjs"></script>
        <script type="module" src="/layout-lab/rewind.mjs"></script>
    </head>`));
    server = await serve(tree);
    console.log(`Live layout preview ${revision.slice(0, 12)}${values.fixture ? ` · ${values.fixture} fixture` : ''}`);
    console.log(server.url);
    await new Promise(resolve => {
        process.once('SIGINT', resolve);
        process.once('SIGTERM', resolve);
    });
} finally {
    await server?.close();
    await rm(scratch, {recursive: true, force: true});
}
