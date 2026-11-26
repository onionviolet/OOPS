// Desktop acceptance for the seven reader record types, using the normal batch reader and atlas build.
import assert from 'node:assert/strict';
import {execFileSync, spawn} from 'node:child_process';
import {once} from 'node:events';
import {existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {basename, dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {launchChrome} from '../../scripts/perf/lib.mjs';
import {REGISTRY} from './library-reading.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const tempRoot = realpathSync(tmpdir());
const scratch = mkdtempSync(join(tempRoot, 'atlas-records-'));
const readerRoot = join(scratch, 'reader input');
const snapshotPath = join(scratch, 'atlas output', 'snapshot.json');
const book = JSON.parse(readFileSync(join(root, REGISTRY), 'utf8')).books.find(b => b.world === 'lotm');
assert.ok(book, 'the canonical registry includes LOTM');
const batch = join(readerRoot, book.dir);
const first = `${book.key}c001`, second = `${book.key}c002`;
const ids = {person: 'lotm.person.fixture-guide', creature: 'lotm.creature.fixture-fox', place: 'lotm.place.fixture-market',
    item: 'lotm.item.fixture-ticket', power: 'lotm.ability.abyss_0.corruption', group: 'lotm.org.fixture-guild',
    scene: 'lotm.scene.fixture-market', withheld: 'lotm.scene.fixture-withheld'};
const active = {beat: ids.scene, place: ids.place, present: [ids.person], timeOfDay: {value: 'noon'},
    evidence: [{label: 'S', locator: 'en b2 c1 p5'}], steps: [{verb: 'Check the ticket', actor: ids.person, using: [ids.power], requires: ['A stamped ticket'], witnesses: [ids.person], label: 'S'}],
    anchors: [{fact:'Cart fare', value:2, unit:'soli', scope:'household', locator:'en b2 c1 p5'}],
    choices: [{taken: 'Wait for the cart', label: 'S'}], outcomes: [{fact: 'cart.time', value: 'Leaves at dusk', class: 'changed'}],
    deps: [{id: ids.withheld, kind: 'after'}], touched: [
        {id: ids.creature, kind: 'creature', status: 'present'}, {id: ids.item, kind: 'item', status: 'present'}, {id: ids.group, kind: 'org', status: 'present'},
    ]};
const rows = (name, values) => writeFileSync(join(batch, name), values.map(x => JSON.stringify(x)).join('\n') + '\n');
let server, browser;
try {
    mkdirSync(batch, {recursive: true});
    for (const chapter of ['001', '002']) writeFileSync(join(batch, `shard_${book.key}_ch${chapter}-${chapter}.txt`), 'Synthetic reader fixture\n');
    rows(`${first}m_census.jsonl`, [
        {id: ids.person, label: 'Fixture guide', kind: 'person'}, {id: ids.creature, label: 'Fixture fox', kind: 'creature'},
        {id: ids.place, label: 'Fixture market', kind: 'place'}, {id: ids.item, label: 'Fixture ticket', kind: 'item',zh:'测试票',nameSource:'pinyin-unconfirmed',firstMention:'en b2 c1 p5',
            whereabouts:[{place:ids.place,era:'During the fair',status:'claimed',locator:'en b2 c1 p5'}],amount:{value:2,unit:'stamps',cap:5},note:'PRIVATE_CENSUS_NOTE'},
        {id: ids.group, label: 'Fixture guild', kind: 'org'},
    ]);
    rows(`${first}_rules.jsonl`, [
        {id: ids.power, name: 'Fixture signal', kind: 'ability', who: [ids.person], results: [{when: 'success', what: 'The signal lights up', label: 'S'}],
            acquire: {prerequisites: ['A steady flame', 'Read the symbols'], label: 'T', locator: 'en b2 c1 p3'}},
        {id: 'lotm.rule.fixture-ticket', name: 'Stamp a ticket', kind: 'craft',
            inputs: [{item: ids.item, label: 'S', locator: 'en b2 c1 p3'}, {item: 'SEALED_MATERIAL', sealed: ['withhold']}],
            products: [{item: ids.item, label: 'T', locator: 'en b2 c1 p4'}]},
        {id: 'lotm.rule.fixture-reset', name: 'Fixture reset', kind: 'reset', reset: {trigger: 'The bell strikes midnight', span: 'One day',
            resets: ['The market stalls'], keeps: ['The held ticket'], ends: 'The ticket is returned', remembers: ['PRIVATE_KNOWLEDGE_HOLDER'], label: 'T', locator: 'en b2 c1 p5'}},
        {id: 'lotm.rule.fixture-empty-reset', name: 'Fixture empty reset', kind: 'reset', reset: {}},
        {id: 'lotm.rule.fixture-sealed-reset', name: 'Fixture sealed reset', kind: 'reset',
            reset: {trigger: 'SEALED_TRIGGER', label: 'T', locator: 'en b2 c1 p5', sealed: ['withhold']}},
    ]);
    rows(`${first}_people.jsonl`, [{id: ids.person, label: 'T', locator: 'en b2 c1 p5', wants: ['Keep the market safe'],
        routine: [{place: ids.place, what: 'Checks tickets', from: '11:00', to: '13:00', until: 'the end of the fair', label: 'S', locator: 'en b2 c1 p5'}],
        relations: [{with: ids.group, kind: 'Works for', basis: 'The guild pays the guide', label: 'T', locator: 'en b2 c1 p5'}],
        reacts: [{to: 'A traveler refuses the fare', response: 'Calls the guild clerk', by: ids.person, label: 'I', locator: 'en b2 c1 p5', class: 'refuse', responseClass: 'speak'},
            {to: 'Concealed reaction', response: 'Do not expose', sealed: ['withhold']}]}]);
    rows(`${first}_places.jsonl`, [{id: ids.place, hours: 'Open at noon', access:['A ticket is needed at the gate'], crowd:'A queue gathers at noon', label:'T', locator:'en b2 c1 p5',
        routes:[{to:'lotm.place.fixture-quay',minutes:12,mode:'Walk along the river'}, {to:'lotm.place.fixture-hidden',minutes:3,mode:'SEALED_ROUTE'}], affordances: [{what: 'Buy a ticket'}]},
        {id:'lotm.place.fixture-quay',hours:'unstated',crowd:'unstated',routes:[]}, {id:'lotm.place.fixture-hidden',sealed:['withheld']}]);
    rows(`${first}_services.jsonl`, [{place: ids.place, what: 'Cart fare', kind: 'transport', amount: 2, unit: 'soli', priceStated: 'stated', label: 'T', locator: 'en b2 c1 p5'},
        {place: ids.place, what: 'Fixture free ride', kind: 'transport', amount: 0, unit: 'soli', priceStated: 'stated-free', label: 'S', locator: 'en b2 c1 p5'},
        {place: ids.place, what: 'Fixture unknown fare', kind: 'transport', priceStated: 'not-mentioned', label: 'T', locator: 'en b2 c1 p5'}]);
    const customs = Array.from({length:181}, (_, i) => ({what: 'Fixture custom ' + String(i).padStart(3, '0'), applies: ids.place, label: 'T', locator: 'en b2 c1 p5'}));
    rows(`${first}_customs.jsonl`, customs); rows(`${second}_customs.jsonl`, customs);
    rows(`${first}_news.jsonl`, [{what: 'Fixture cart notice', scope: 'public', date: 'Monday', carriedBy: ids.person, label: 'T', locator: 'en b2 c1 p5'},
        {what: 'PRIVATE_LIFE_NEWS', scope: 'private'}, {what: 'SEALED_LIFE_NEWS', scope: 'public', sealed: ['withhold']}]);
    rows(`${first}_rules_other.jsonl`, [{about: [ids.creature], what: 'Searches the stalls at dusk', label: 'T', locator: 'en b2 c1 p4'}]);
    rows(`${first}m_fills.jsonl`, [{schema: 'fill/1.3', id: 'lotm.fill.fixture-market', for: ids.scene, kind: 'daily-life',
        what: 'A proposed market queue', status: 'authored-proposal', layer: 'period', basis: [ids.item, 'en b2 c1 p4'],
        respects: [ids.place, 'Existing ticket prices'], replaceableBy: 'A sourced queue routine', confidence: 'low'},
    ...Array.from({length: 100}, (_, n) => ({id: 'lotm.fill.fixture-extra-' + n, what: 'Extra proposal ' + n, layer: 'invented', status: 'authored-proposal'})),
    {id: 'lotm.fill.fixture-private', for: ids.withheld, what: 'Withheld fill detail', status: 'authored-proposal'}]);
    rows(`${second}m_fills.jsonl`, [{id: 'lotm.fill.fixture-market', for: ids.scene, kind: 'daily-life', what: 'An alternate proposed queue',
        status: 'authored-proposal', layer: 'implied', basis: [ids.person], respects: [ids.place], replaceableBy: 'A sourced alternate queue', confidence: 'medium'}]);
    const orphan = book.key + 'c777';
    rows(orphan + 'm_census.jsonl', [{id:'lotm.item.orphan-token', label:'Observed token', kind:'item', firstMention:'en b2 c777 p4'},
        {id:'lotm.item.orphan-private', kind:'item', label:'PRIVATE_ORPHAN', sealed:['withheld']}]);
    rows('b4s42m_census.jsonl', [{id: ids.item, label: 'Fixture ticket', kind: 'item'}]);
    rows('c4s42m_census.jsonl', [{id: 'lotm.item.trial', label: 'Unselected alias', kind: 'item'}]);
    rows('b4s42m_scenes.jsonl', [{beat: 'lotm.scene.fixture-legacy', place: ids.place,
        evidence: [{label: 'S', locator: 'en b2 c3 p1'}], steps: [{verb: 'Join the legacy ticket queue', actor: ids.person, label: 'S'}]}]);
    rows(`${first}m_scenes.jsonl`, [active, {beat: ids.withheld, steps: [{verb: 'Concealed fixture fact'}]}]);
    rows(`${second}m_scenes.jsonl`, [{beat: ids.withheld, sealed: ['withhold']}]);
    const env = {...process.env, ATLAS_READER_ROOT: readerRoot, ATLAS_HANDOFFS:join(scratch,'workbench'), ATLAS_SNAPSHOT: join(scratch, 'unused', 'snapshot.json')};
    delete env.ATLAS_REBUILD;
    execFileSync(process.execPath, ['prototypes/world-atlas/build.mjs', '--out', snapshotPath], {cwd: root, env, stdio: 'inherit', windowsHide: true});
    assert.ok(existsSync(join(dirname(snapshotPath), 'readers', 'lotm.json')), 'explicit output keeps reader files beside the snapshot');
    assert.ok(!existsSync(join(scratch, 'unused')), 'build uses the requested output directory');
    server = spawn(process.execPath, ['prototypes/world-atlas/serve.mjs'], {cwd: root, windowsHide: true,
        env: {...env, ATLAS_SNAPSHOT: snapshotPath, ATLAS_PORT: '0'}, stdio: ['ignore', 'pipe', 'inherit']});
    const base = await new Promise((ok, fail) => {
        server.once('error', fail);
        server.once('exit', code => fail(Error(`Atlas exited ${code}`)));
        server.stdout.setEncoding('utf8').on('data', text => {const found = text.match(/http:\/\/127\.0\.0\.1:\d+/); if (found) ok(found[0]);});
    });
    browser = await launchChrome();
    const recovery = await browser.newPage({viewport: {width: 1920, height: 1080}});
    await recovery.route('**/reading-output-view.mjs', route => route.abort());
    await recovery.goto(base);
    const retry = recovery.getByRole('button', {name:'Reload the Atlas'});
    await retry.waitFor({timeout:8000});
    await recovery.unroute('**/reading-output-view.mjs');
    await retry.click();
    await recovery.locator('.atlas-trail nav').first().waitFor({timeout:8000});
    await recovery.close();
    const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    page.setDefaultTimeout(8000);
    await page.goto(base + '/#workbench/ideas');
    await page.getByRole('searchbox',{name:'Search owners'}).fill('feedback/FEEDBACK_BACKLOG.md');
    await page.getByRole('button',{name:'Use in a reading handoff'}).first().click();
    await page.getByRole('heading',{name:'Reading outputs',exact:true}).waitFor();
    await page.goto(base + '/#world/lotm/reading');
    await page.locator('.canvas-viewport [data-id="read"]').click();
    const inspector = page.locator('.canvas-inspector');
    await inspector.getByText('Partly read', {exact: true}).waitFor();
    await inspector.getByLabel('Reading pass').selectOption('people');
    await inspector.locator('summary').filter({hasText: book.key + ' · 1/2 ranges collected'}).click();
    await inspector.getByText('Awaiting output · chapters 2-2', {exact: true}).waitFor();
    await inspector.getByText('Collected · chapters 1-1', {exact: true}).waitFor();
    await inspector.getByRole('link', {name: 'Open people records'}).click();
    await page.waitForURL('**/#world/lotm/people');
    await page.goBack();
    await page.locator('.canvas-viewport [data-id="read"]').click();
    await inspector.getByLabel('Reading pass').selectOption('scenes');
    await inspector.locator('summary').filter({hasText: book.key + ' · 2/2 ranges collected'}).click();
    assert.equal(await inspector.getByRole('link', {name: '2-2', exact: true}).count(), 0);
    await inspector.getByRole('link', {name: '1-1', exact: true}).click();
    await page.getByText('Reading range · ' + first, {exact: true}).waitFor();
    await page.goto(base + '/#library/outputs/' + encodeURIComponent(book.key));
    const inventory = page.locator('.reading-outputs');
    await inventory.getByLabel('Chapter', {exact:true}).fill('2');
    await inventory.getByRole('rowheader', {name:'2-2', exact:true}).first().waitFor();
    assert.equal(await inventory.getByRole('rowheader', {name:'1-1', exact:true}).count(), 0);
    await page.reload();
    assert.equal(await inventory.getByLabel('Chapter', {exact:true}).inputValue(), '2');
    await inventory.getByLabel('Chapter', {exact:true}).fill('');
    await inventory.getByLabel('Coverage', {exact:true}).selectOption('orphan');
    await inventory.getByRole('link', {name:'Census', exact:true}).click();
    await page.getByRole('link', {name:'Observed token', exact:true}).waitFor();
    assert.doesNotMatch(await inventory.innerText(), /PRIVATE_ORPHAN/);
    await inventory.getByRole('link', {name:'Back to reading outputs'}).click();
    assert.equal(await inventory.getByLabel('Coverage', {exact:true}).inputValue(), 'orphan');
    await inventory.getByLabel('Coverage', {exact:true}).selectOption('registry');
    await inventory.getByLabel('Pass', {exact:true}).selectOption('people');
    await inventory.getByRole('link', {name:'People', exact:true}).first().click();
    const download = page.waitForEvent('download');
    await page.getByRole('button', {name:'Save references on this page'}).click();
    const referenceFile = join(scratch, 'exported-references.txt');
    await (await download).saveAs(referenceFile);
    const references = readFileSync(referenceFile, 'utf8');
    assert.match(references, /File version: sha256:[a-f0-9]{64}/);
    assert.match(references, /Batch file lines: 1/);
    assert.match(references, /Fixture guide[\s\S]*#world\/lotm\/things\/lotm\.person\.fixture-guide/);
    assert.doesNotMatch(references, /fixture-withheld|PRIVATE_KNOWLEDGE_HOLDER/);
    await page.getByLabel('Reference format').selectOption('json');
    const jsonDownload = page.waitForEvent('download');
    await page.getByRole('button', {name:'Save references on this page'}).click();
    const bundleFile = join(scratch, 'exported-references.json');
    await (await jsonDownload).saveAs(bundleFile);
    const bundle = JSON.parse(readFileSync(bundleFile, 'utf8'));
    assert.equal(bundle.schema, 'atlas-reading-references/1');
    const exported = await page.request.get(base + '/reading-output-records/' +
        [bundle.file.book,bundle.file.prefix,bundle.file.pass,bundle.file.kind].map(encodeURIComponent).join('/') +
        '?format=references&offset=' + bundle.page.offset);
    assert.deepEqual(await exported.json(),bundle,'unattended readers receive the same public export as the browser');
    assert.equal(bundle.file.book, book.key);
    assert.deepEqual(bundle.records.find(row => row.label === 'Fixture guide').fileLines, [[1,1]]);
    assert.equal(bundle.fieldCoverage.basis, 'admitted-matched-source-rows');
    assert.doesNotMatch(JSON.stringify(bundle), /fixture-withheld|PRIVATE_KNOWLEDGE_HOLDER/);
    await page.getByText('Prepare a gameplay handoff', {exact:true}).click();
    assert.match(await page.getByLabel('Backlog reference (optional)').inputValue(), /feedback\/FEEDBACK_BACKLOG\.md/);
    await page.getByLabel('Backlog reference (optional)').fill('fixture case');
    await page.getByLabel('What should the player be able to do?').fill('Ask the guide for a route.');
    await page.getByLabel('How would a playthrough prove it?').fill('Return to the market and follow the route.');
    await page.getByRole('button', {name:'Save to Workbench'}).click();
    await page.getByRole('link', {name:'Open implementation handoffs'}).click();
    await page.getByRole('heading', {name:'Fixture guide', exact:true}).waitFor();
    await page.reload();
    await page.getByText('Ask the guide for a route.', {exact:true}).waitFor();
    await page.getByRole('heading', {name:'Fixture guide', exact:true}).getByRole('link').click();
    await page.getByRole('link', {name:'Open batch output'}).click();
    await page.getByRole('link', {name:'Proposed gameplay handoff'}).waitFor();
    await page.locator('.output-record-list').getByRole('link', {name:'Fixture guide', exact:true}).click();
    await page.locator('.reader-person-record').getByRole('heading', {name:'Fixture guide', exact:true}).waitFor();
    await page.goto(base + '/#library/outputs/' + encodeURIComponent(book.key));
    await inventory.getByLabel('Pass', {exact:true}).selectOption('texture');
    await inventory.getByRole('link', {name:'Customs', exact:true}).first().click();
    await page.getByRole('button', {name:'Next', exact:true}).click();
    await page.getByText('41–80 of 181', {exact:true}).waitFor();
    await page.reload();
    await page.getByText('41–80 of 181', {exact:true}).waitFor();
    await page.getByRole('link', {name:'Back to reading outputs'}).click();
    assert.equal(await inventory.getByLabel('Pass', {exact:true}).inputValue(), 'texture');
    await inventory.getByRole('link', {name:'Services and prices', exact:true}).first().click();
    await page.getByText('Fields supplied by matched rows', {exact:true}).click();
    assert.match(await page.locator('.output-fields').innerText(), /Numeric price\s+2 \/ 3/);
    await page.locator('.output-record-list').getByRole('link', {name:'Cart fare', exact:true}).click();
    await page.locator('.reader-life-record').getByRole('heading', {name:'Cart fare', exact:true}).waitFor();
    assert.equal(await page.locator('.reader-life-record').count(), 1);
    await page.goto(base + '/#library/outputs/' + encodeURIComponent(book.key));
    await inventory.getByLabel('Pass', {exact: true}).selectOption('scenes');
    await inventory.getByLabel('Status', {exact: true}).selectOption('collected');
    await inventory.getByRole('row').filter({has: page.getByRole('rowheader', {name:'1-1', exact:true})}).getByRole('link', {name:'Scenes', exact:true}).click();
    await page.getByText('Reading range · ' + first, {exact: true}).waitFor();
    await page.getByRole('link', {name: 'en b2 c1 p5', exact: true}).click();
    const scene = page.locator('.reader-scene-record');
    await scene.getByRole('heading', {name: 'Choices taken', exact: true}).waitFor();
    await scene.getByText('How this step works', {exact: true}).click();
    await scene.getByText('A stamped ticket', {exact: false}).first().waitFor();
    await scene.getByText('Cart fare · 2 soli', {exact: false}).first().waitFor();
    assert.match(await scene.innerText(), /Wait for the cart[\s\S]*Leaves at dusk[\s\S]*In OOPS/);
    assert.doesNotMatch(await page.locator('main').innerText(), /fixture-withheld|Concealed fixture fact/);
    assert.doesNotMatch(await (await page.request.get(base + '/readers/lotm')).text(), /fixture-withheld|Concealed fixture fact/);
    const sceneUrl = page.url();
    await page.goto(base + '/#library/outputs/' + encodeURIComponent(book.key));
    await inventory.getByLabel('Coverage', {exact: true}).selectOption('legacy');
    await inventory.getByLabel('Pass', {exact: true}).selectOption('scenes');
    await inventory.getByLabel('Status', {exact: true}).selectOption('collected');
    await inventory.getByRole('rowheader', {name: 'Legacy slice · b4s42', exact: true}).waitFor();
    await inventory.getByRole('link', {name:'Scenes', exact:true}).click();
    await page.getByText('Reading range · b4s42', {exact: true}).waitFor();
    await page.getByRole('link', {name: 'en b2 c3 p1', exact: true}).click();
    await page.locator('.reader-scene-record').getByText(/Join the legacy ticket queue/).first().waitFor();
    await page.goto(base + '/#world/lotm/things/fills');
    await page.getByRole('button', {name: 'Next page', exact: true}).click();
    await page.locator('.reader-fill-record summary').filter({hasText: 'Extra proposal 99'}).waitFor();
    await page.getByLabel('Search fills', {exact: true}).fill('proposed market queue');
    await page.locator('.reader-fill-record > summary').click();
    const proposal = page.locator('.reader-fill-record');
    await proposal.getByText('2 distinct recorded variants share this fill ID. Each retains its own provenance and reader slices.', {exact: true}).waitFor();
    await proposal.locator('.reader-fill-variant > summary').first().click();
    assert.match(await proposal.innerText(), /Authored proposal[\s\S]*authored-proposal[\s\S]*Gap it fills[\s\S]*Basis for the proposal[\s\S]*What it must respect[\s\S]*A sourced queue routine/);
    await proposal.getByRole('link', {name: 'Fixture ticket', exact: true}).waitFor();
    await proposal.getByRole('link', {name: 'Fixture market', exact: true}).waitFor();
    await proposal.getByRole('link', {name: 'en b2 c1 p5', exact: true}).click();
    await scene.getByRole('heading', {name: 'Choices taken', exact: true}).waitFor();
    await page.goto(base + '/#world/lotm/things/notes');
    await page.getByLabel('Search notes', {exact: true}).fill('stalls at dusk');
    await page.locator('.reader-note-record summary').click();
    await page.locator('.reader-note-record').getByText(/en b2 c1 p4/).waitFor();
    await page.locator('.reader-note-record').getByRole('link', {name: 'Fixture fox', exact: true}).click();
    await page.locator('.reader-creature-record').getByRole('heading', {name: 'Fixture fox', exact: true}).waitFor();
    assert.doesNotMatch(await (await page.request.get(base + '/readers/lotm')).text(), /Withheld fill detail/);
    await page.goto(sceneUrl);
    await scene.getByRole('heading', {name: 'Choices taken', exact: true}).waitFor();
    for (const [label, kind, expected] of [
        ['Fixture guide', 'person', /11:00–13:00/], ['Fixture fox', 'creature', /Searches the stalls at dusk/],
        ['Fixture market', 'place', /Cart fare · 2 soli/], ['Fixture ticket', 'item', /Stamp a ticket/],
        ['Fixture signal', 'power', /The signal lights up/], ['Fixture guild', 'group', /Fixture guide[\s\S]*Works for/],
    ]) {
        await scene.getByRole('link', {name: label, exact: true}).first().click();
        const record = page.locator(`.reader-${kind}-record`);
        await record.getByRole('heading', {name: label, exact: true}).waitFor();
        const text = await record.innerText();
        assert.match(text, expected, label);
        assert.match(text, /In OOPS/, label);
        if (kind === 'person') {
            assert.match(text, /Wants and aims[\s\S]*Keep the market safe[\s\S]*Stated/);
            assert.match(text, /Reactions[\s\S]*A traveler refuses the fare[\s\S]*Calls the guild clerk[\s\S]*Inference/);
            assert.match(text, /Until the end of the fair/);
            assert.match(text, /Basis: The guild pays the guide/);
            assert.doesNotMatch(text, /Concealed reaction|Do not expose/);
            const capture = join(root, 'docs/representations/evidence/atlas-people-2026-11-25');
            mkdirSync(capture, {recursive: true});
            await record.getByRole('heading', {name: 'Wants and aims', exact: true}).scrollIntoViewIfNeeded();
            await page.screenshot({path: join(capture, 'person.jpg'), quality: 85});
        }
        if (kind === 'item') {
            const census=page.locator('[data-census-details]');await census.locator('summary').click();
            assert.match(await census.innerText(),/测试票[\s\S]*Pinyin name · unconfirmed[\s\S]*2 stamps cap 5/);
            assert.match(await census.innerText(),/Claimed whereabouts · During the fair · en b2 c1 p5/);
            await census.getByRole('link',{name:'Fixture market',exact:true}).waitFor();
            assert.doesNotMatch(await census.innerText(),/PRIVATE_CENSUS_NOTE/);
        }
        if (kind === 'place') {
            assert.match(text,/Crowds[\s\S]*A queue gathers at noon[\s\S]*Told in source/);
            assert.match(text,/Access evidence[\s\S]*A ticket is needed at the gate[\s\S]*Told in source/);
            assert.match(text,/Routes in the books[\s\S]*Fixture quay[\s\S]*Walk along the river · 12 min[\s\S]*Told in source/);
            await record.getByRole('link',{name:'Fixture quay',exact:true}).waitFor();
            assert.doesNotMatch(text,/SEALED_ROUTE|fixture-hidden/);
        }
        if (kind === 'power') {
            await record.getByText('Source and coverage references', {exact: true}).click();
            await record.getByText(/lotm_powers.jsonl/).waitFor();
        }
        await record.getByRole('link', {name: 'en b2 c1 p5', exact: true}).click();
        await scene.getByRole('heading', {name: 'Choices taken', exact: true}).waitFor();
        assert.equal(page.url(), sceneUrl, label);
    }
    await page.goto(base + '/#world/lotm/making/' + encodeURIComponent('working:lotm.rule.fixture-ticket'));
    const working = page.locator('.making-item-record');
    await working.getByRole('heading', {name: 'Stamp a ticket', exact: true}).waitFor();
    assert.match(await working.innerText(), /Inputs[\s\S]*Shown · en b2 c1 p3[\s\S]*Products[\s\S]*Stated · en b2 c1 p4/);
    await page.goto(base + '/#world/lotm/things/' + encodeURIComponent(ids.power));
    const learned = page.locator('.reader-power-record');
    await learned.getByRole('heading', {name: 'Fixture signal', exact: true}).waitFor();
    assert.match(await learned.innerText(), /How it’s learned[\s\S]*A steady flame[\s\S]*Read the symbols/);
    for (const suffix of ['reset', 'empty-reset', 'sealed-reset']) {
        await page.goto(base + '/#world/lotm/things/' + encodeURIComponent('lotm.rule.fixture-' + suffix));
        const record = page.locator('.reader-law-record');
        await record.getByRole('heading', {name: 'Fixture ' + suffix.replace('-', ' '), exact: true}).waitFor();
        assert.equal(await record.locator('[data-reader-reset]').count(), suffix === 'reset' ? 1 : 0);
        if (suffix === 'reset') assert.match(await record.innerText(), /The bell strikes midnight[\s\S]*One day[\s\S]*The market stalls[\s\S]*The held ticket[\s\S]*The ticket is returned/);
    }
    assert.doesNotMatch(await (await page.request.get(base + '/readers/lotm')).text(), /SEALED_MATERIAL|SEALED_TRIGGER|PRIVATE_KNOWLEDGE_HOLDER/);
    await page.goto(base + '/#world/lotm/things/life');
    const life = page.locator('.reader-life'), lifeSearch = life.getByRole('searchbox', {name: 'Search daily life'});
    await lifeSearch.fill('Fixture free ride');
    assert.match(await life.locator('.reader-life-record').innerText(), /transport[\s\S]*0 soli[\s\S]*Shown/);
    await lifeSearch.fill('Fixture unknown fare');
    assert.match(await life.locator('.reader-life-record').innerText(), /Price not recorded/);
    await lifeSearch.fill(''); await life.getByLabel('Daily life kind').selectOption('customs');
    const seenCustoms = [];
    for (let pageIndex = 0; pageIndex < 7; pageIndex++) {
        seenCustoms.push(...await life.locator('.reader-life-record h3').allTextContents());
        if (pageIndex < 6) await life.getByRole('button', {name:'Next',exact:true}).click();
    }
    assert.equal(seenCustoms.length,181); assert.equal(new Set(seenCustoms).size,181);
    await lifeSearch.fill('Fixture custom 180'); assert.equal(await life.locator('.reader-life-record').count(),1);
    await life.getByLabel('Daily life kind').selectOption('news'); await lifeSearch.fill('');
    assert.match(await life.locator('.reader-life-record').innerText(), /Monday[\s\S]*Fixture guide[\s\S]*Public news/);
    await life.getByRole('link',{name:'en b2 c1 p5',exact:true}).click();
    await page.getByLabel('Search reader scenes').waitFor();
    const publicDigest = await (await page.request.get(base + '/readers/lotm')).json();
    assert.doesNotMatch(JSON.stringify(publicDigest), /PRIVATE_LIFE_NEWS|SEALED_LIFE_NEWS/);
    const olderDigest = {...publicDigest, life: [{kind:'services',what:'Fixture older lodging',at:ids.place,price:'Eight coins',label:'T',locator:'en b2 c1 p5'},
        {kind:'news',what:'OLDER_PRIVATE_LIFE_NEWS',at:'private'}]};
    await page.route('**/readers/lotm', route => route.fulfill({json:olderDigest}));
    await page.goto(base + '/#world/lotm/things/life'); await page.reload();
    await life.getByRole('heading',{name:'Fixture older lodging',exact:true}).waitFor();
    assert.match(await life.innerText(), /Eight coins[\s\S]*Stated/); assert.doesNotMatch(await life.innerText(), /OLDER_PRIVATE_LIFE_NEWS/);
    assert.deepEqual(errors, []);
    await page.goto(base + '/#library/outputs/hp1');
    await page.getByText('No prepared chapter ranges found for this book.', {exact:true}).waitFor();
    await page.getByText('Where the Atlas looks for readings', {exact:true}).click();
    await page.getByText(/set ATLAS_READER_ROOT/).waitFor();
    const lateBook = JSON.parse(readFileSync(join(root, REGISTRY),'utf8')).books.find(b => b.key === 'hp1');
    const lateDir = join(readerRoot,lateBook.dir);
    mkdirSync(lateDir,{recursive:true});
    writeFileSync(join(lateDir,'hp1c077m_census.jsonl'),JSON.stringify({id:'hp.item.late',kind:'item',label:'Late item'}));
    await page.getByRole('button',{name:'Refresh output files'}).click();
    await page.getByRole('rowheader',{name:'Unprepared · hp1c077',exact:true}).waitFor();
    console.log('Seven atlas record types, reciprocal scene links and sealed exclusions passed against canonical batch files at 1920×1080.');
} catch (error) {
    console.error('Atlas desktop proof failed:', error);
    throw error;
} finally {
    if (browser) await browser.close();
    if (server?.exitCode === null && server.signalCode === null) {const exited = once(server, 'exit'); server.kill(); await exited;}
    if (dirname(scratch) === tempRoot && basename(scratch).startsWith('atlas-records-')) rmSync(scratch, {recursive: true, force: true});
}
