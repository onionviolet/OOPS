// Builds the UI directions (ui-directions.html) as its own bundle, mirroring build_ui_preview.mjs.
// The game bundle is untouched; the closure may not reach the game core. dist/ui-directions.* are local artifacts.
import * as fs from 'node:fs';
import {createHash} from 'node:crypto';
import * as esbuild from 'esbuild';

const hash = text => createHash('sha256').update(text).digest('hex');
const result = await esbuild.build({entryPoints: ['src/ui/preview/ui_directions_main.js'], bundle: true, sourcemap: true, minify: true, metafile: true,
    outfile: 'dist/ui-directions.js', platform: 'browser', target: 'es2022', format: 'esm', logLevel: 'warning'});
const inputs = Object.keys(result.metafile.inputs);
const forbidden = inputs.filter(file => ['src/main.js', 'src/display.js'].includes(file));
if (forbidden.length) throw Error(`Gallery closure reaches the game core: ${forbidden.join(', ')}`);
const bundle = fs.readFileSync('dist/ui-directions.js');
const fingerprint = hash(bundle).slice(0, 12);
const page = fs.readFileSync('ui-directions.html', 'utf8');
let html = page.replace(/dist\/ui-directions\.js(?:\?version=[^&"]+)?/, `dist/ui-directions.js?version=${fingerprint}`);
for (const file of [...page.matchAll(/href="((?:styles\/)?[\w.]+\.css)/g)].map(m => m[1])) html = html.replace(new RegExp(`${file.replace(/[./]/g, m => '\\' + m)}(?:\\?version=[^&"]+)?"`), `${file}?version=${hash(fs.readFileSync(file)).slice(0, 12)}"`);
if (html !== page) fs.writeFileSync('ui-directions.html', html);
const receipt = {bundle: 'dist/ui-directions.js', sha256: hash(bundle), modules: inputs.length, gameCore: false, entry: 'src/ui/preview/ui_directions_main.js'};
fs.writeFileSync('dist/ui-directions.receipt.json', JSON.stringify(receipt, null, 1) + '\n');
console.log(JSON.stringify(receipt));
