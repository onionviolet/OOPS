// R17 Step 0: builds the shell preview (ui-preview.html) as its own bundle, following the
// build_nethack_preview.mjs pattern (second bundle, fingerprint, receipt). The game bundle and
// main.js are untouched. PV1: the build fails if the preview's import closure reaches the game core.
// PV2: dist/ui-preview.* are local artifacts (gitignored); ui-preview.html is the tracked page.
import * as fs from 'node:fs';
import {createHash} from 'node:crypto';
import * as esbuild from 'esbuild';

const hash = text => createHash('sha256').update(text).digest('hex');
const result = await esbuild.build({entryPoints: ['src/ui/preview/main.js'], bundle: true, sourcemap: true, minify: true, metafile: true,
    outfile: 'dist/ui-preview.js', platform: 'browser', target: 'es2022', format: 'esm', logLevel: 'warning'});
const inputs = Object.keys(result.metafile.inputs);
const forbidden = inputs.filter(file => ['src/main.js', 'src/display.js'].includes(file));
if (forbidden.length) throw Error(`Preview closure reaches the game core: ${forbidden.join(', ')}`);

const bundle = fs.readFileSync('dist/ui-preview.js');
const fingerprint = hash(bundle).slice(0, 12);
const page = fs.readFileSync('ui-preview.html', 'utf8');
const styles = ['styles/ui_tokens.css', 'styles/shell_layout.css', 'styles/workspace.css', 'styles/ui_preview.css', 'style.css'];
let html = page.replace(/dist\/ui-preview\.js(?:\?version=[^&"]+)?/, `dist/ui-preview.js?version=${fingerprint}`);
for (const file of styles) html = html.replace(new RegExp(`${file.replace(/[./]/g, m => '\\' + m)}(?:\\?version=[^&"]+)?"`), `${file}?version=${hash(fs.readFileSync(file)).slice(0, 12)}"`);
if (!html.includes(`dist/ui-preview.js?version=${fingerprint}`)) throw Error('Missing preview entry in ui-preview.html.');
if (html !== page) fs.writeFileSync('ui-preview.html', html);
const receipt = {bundle: 'dist/ui-preview.js', sha256: hash(bundle), modules: inputs.length, gameCore: false, entry: 'src/ui/preview/main.js'};
fs.writeFileSync('dist/ui-preview.receipt.json', JSON.stringify(receipt, null, 1) + '\n');
console.log(JSON.stringify(receipt));
