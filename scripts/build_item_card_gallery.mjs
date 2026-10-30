// Builds the figure gallery (item-card-gallery.html) as its own bundle, mirroring build_ui_preview.mjs.
// The game bundle is untouched; the closure may not reach the game core. dist/item-card-gallery.* are local artifacts.
import * as fs from 'node:fs';
import {createHash} from 'node:crypto';
import * as esbuild from 'esbuild';

const hash = text => createHash('sha256').update(text).digest('hex');
const result = await esbuild.build({entryPoints: ['src/ui/preview/item_card_gallery.js'], bundle: true, sourcemap: true, minify: true, metafile: true,
    outfile: 'dist/item-card-gallery.js', platform: 'browser', target: 'es2022', format: 'esm', logLevel: 'warning'});
const inputs = Object.keys(result.metafile.inputs);
const forbidden = inputs.filter(file => ['src/main.js', 'src/display.js'].includes(file));
if (forbidden.length) throw Error(`Gallery closure reaches the game core: ${forbidden.join(', ')}`);
const bundle = fs.readFileSync('dist/item-card-gallery.js');
const fingerprint = hash(bundle).slice(0, 12);
const page = fs.readFileSync('item-card-gallery.html', 'utf8');
let html = page.replace(/dist\/item-card-gallery\.js(?:\?version=[^&"]+)?/, `dist/item-card-gallery.js?version=${fingerprint}`);
for (const file of [...page.matchAll(/href="((?:styles\/)?[\w.]+\.css)/g)].map(m => m[1])) html = html.replace(new RegExp(`${file.replace(/[./]/g, m => '\\' + m)}(?:\\?version=[^&"]+)?"`), `${file}?version=${hash(fs.readFileSync(file)).slice(0, 12)}"`);
if (html !== page) fs.writeFileSync('item-card-gallery.html', html);
const receipt = {bundle: 'dist/item-card-gallery.js', sha256: hash(bundle), modules: inputs.length, gameCore: false, entry: 'src/ui/preview/item_card_gallery.js'};
fs.writeFileSync('dist/item-card-gallery.receipt.json', JSON.stringify(receipt, null, 1) + '\n');
console.log(JSON.stringify(receipt));
