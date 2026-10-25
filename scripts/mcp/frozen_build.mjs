// M10: materialize all runtime inputs, not just a pointer to a live bundle.
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {mkdtempSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, readdirSync} from 'node:fs';
import {dirname, join, resolve, relative} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {bundleGame} from '../headless/runner.mjs';
const require = createRequire(import.meta.url);
export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const walk = root => readdirSync(root,{withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(join(root,e.name)) : [join(root,e.name)]);

export async function freezeBuild() {
    const bundle = await bundleGame();
    const root = mkdtempSync(join(tmpdir(),'yairpg-mcp-frozen-'));
    // Reuse the desktop host's static-content census (including private pack bytes).
    const {listFiles} = require('../../desktop/snapshot.cjs');
    const files = new Set([...listFiles(ROOT), 'package.json','src/scenario_facade.js',
        ...walk(join(ROOT,'scripts/headless')).filter(p => p.endsWith('.mjs')).map(p=>relative(ROOT,p)),
        'scripts/mcp/game_worker.mjs','scripts/mcp/electron_backend.mjs','scripts/mcp/frozen_build.mjs', ...walk(join(ROOT,'desktop')).filter(p=>p.endsWith('.cjs')).map(p=>relative(ROOT,p))]);
    for(const p of files) {mkdirSync(dirname(join(root,p)),{recursive:true});copyFileSync(join(ROOT,p),join(root,p));}
    copyFileSync(bundle,join(root,'instrumented.mjs'));
    const runner = join(root,'scripts/headless/runner.mjs');
    const source = readFileSync(runner,'utf8');
    const patched = source.replace('const bundle = await bundleGame();', "const bundle = join(ROOT, 'instrumented.mjs');");
    if(patched === source) throw Error('Frozen runner seam changed; refusing a live-source fallback.');
    writeFileSync(runner,patched);
    const inputs = walk(root).map(p=>({path:relative(root,p),sha256:sha(readFileSync(p))})).sort((a,b)=>a.path.localeCompare(b.path));
    const manifest = {schema:1,kind:'yairpg-mcp-frozen',bundle:'instrumented.mjs',inputs};
    const bytes = JSON.stringify(manifest,null,2);
    const manifestPath = join(root,'snapshot.json');writeFileSync(manifestPath,bytes);
    return {bundlePath:join(root,manifest.bundle),snapshotManifest:manifestPath,manifestSha256:sha(bytes),bundleSha256:sha(readFileSync(bundle)),inputCount:inputs.length};
}

export function verifyFrozen({bundlePath,snapshotManifest}) {
    if(!bundlePath || !snapshotManifest) throw Error('Frozen games require both bundlePath and snapshotManifest from game_freeze. path remains an exported save.');
    const manifestFile = resolve(snapshotManifest), root = dirname(manifestFile);
    const bytes = readFileSync(manifestFile), m = JSON.parse(bytes);
    if(m.schema !== 1 || m.kind !== 'yairpg-mcp-frozen' || m.bundle !== 'instrumented.mjs' || !Array.isArray(m.inputs)) throw Error('Unsupported snapshot manifest.');
    if(resolve(bundlePath) !== join(root,m.bundle)) throw Error('bundlePath does not match snapshot manifest.');
    const required = ['instrumented.mjs','index.html','scripts/headless/runner.mjs','scripts/headless/dom.mjs','scripts/headless/css.mjs','scripts/headless/scenario.mjs','src/scenario_facade.js','scripts/mcp/game_worker.mjs','package.json'];
    if(required.some(p=>!m.inputs.some(row=>row.path===p))) throw Error('Snapshot manifest omits a required input.');
    for(const row of m.inputs) {
        if(typeof row.path !== 'string' || resolve(root,row.path) === root || !resolve(root,row.path).startsWith(root+'/')) throw Error('Invalid snapshot input path.');
        if(sha(readFileSync(join(root,row.path))) !== row.sha256) throw Error(`Frozen input hash mismatch: ${row.path}`);
    }
    return {root,manifestSha256:sha(bytes),bundleSha256:m.inputs.find(r=>r.path===m.bundle).sha256,inputCount:m.inputs.length};
}

// Each running session owns its copy. Editing even the supplied snapshot later
// cannot change reloads in an existing session.
export function ownFrozen(args) {
    const identity=verifyFrozen(args), root=mkdtempSync(join(tmpdir(),'yairpg-mcp-session-'));
    const manifest=JSON.parse(readFileSync(args.snapshotManifest,'utf8'));
    for(const row of manifest.inputs) {mkdirSync(dirname(join(root,row.path)),{recursive:true});copyFileSync(join(identity.root,row.path),join(root,row.path));}
    copyFileSync(args.snapshotManifest,join(root,'snapshot.json'));
    verifyFrozen({bundlePath:join(root,'instrumented.mjs'),snapshotManifest:join(root,'snapshot.json')});
    return {...identity,root};
}
