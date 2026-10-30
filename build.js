
import * as esbuild from 'esbuild';
import * as fs from 'fs';
import path from 'node:path';
import { styleText } from 'node:util';
import { createHash } from 'node:crypto';
import { get_game_version } from './src/game_version.js';
import {execFileSync} from 'node:child_process';
import {readManifest, renderStylesheets} from './scripts/stylesheet_manifest.mjs';

// A runtime cursor requires this exact authored source/compiler/artifact join.
execFileSync(process.execPath,['scripts/compile_feature_ink.mjs','--check'],{stdio:'inherit'});
const inkNotices=fs.readFileSync('docs/gm/feature-wave/ink/COMPILER.md','utf8');
const buildOut = process.env.BUILD_OUT;
if (buildOut && path.resolve(buildOut) === process.cwd()) throw new Error('BUILD_OUT must differ from the source root');
const outputRoot = buildOut || '.';
fs.mkdirSync(path.join(outputRoot, 'dist'), {recursive: true});
for(const [marker,noticePath] of [['inkjs-notice','dist/INKJS_NOTICE.txt'],['inkjs-authors','dist/INKJS_AUTHORS.txt']]) {
    const start=`<!-- ${marker}:start -->\n`,end=`<!-- ${marker}:end -->`;
    const a=inkNotices.indexOf(start),b=inkNotices.indexOf(end,a);
    if(a<0||b<0)throw new Error('Missing exact Ink distribution notice.');
    fs.writeFileSync(path.join(outputRoot, noticePath),inkNotices.slice(a+start.length,b));
}

const bundle_regex = /dist\/bundle\.js\?version=[^&"]+/;

const bundlePath = buildOut ? `${buildOut}/dist/bundle.js` : 'dist/bundle.js';
const htmlPath = buildOut ? `${buildOut}/index.html` : 'index.html';
if (buildOut) fs.mkdirSync(`${buildOut}/dist`, { recursive: true });

esbuild
    .build({
        entryPoints: ["src/main.js"],
        bundle: true,
        sourcemap: true,
        minify: true,
        outfile: bundlePath,
        platform: "browser",
        target: "es2022",
        format: 'esm',
        logLevel: "debug",
    }).then(() => {
        console.log("Javascript build complete!");
        let htmlContent = fs.readFileSync('index.html', 'utf8');

        if(htmlContent.search(bundle_regex) == -1) {
            console.error(styleText("red", 'Failed to update the bundle version in .html!'));
            process.exit(1);
        }

        const fingerprint = path => createHash('sha256').update(fs.readFileSync(path)).digest('hex').slice(0, 12);
        htmlContent = htmlContent.replace(
            bundle_regex,
            `dist/bundle.js?version=${get_game_version()}-${fingerprint(bundlePath)}`
        );
        // Every sheet in styles/manifest.txt gets a content fingerprint; style.css keeps the game version prefix.
        htmlContent = renderStylesheets(htmlContent, readManifest(), href =>
            href === 'style.css' ? `${get_game_version()}-${fingerprint(href)}` : fingerprint(href));
        if (buildOut) {
            // Keep paths within the served output root. Escaping through ../
            // fails when the output lives outside the repository or is served alone.
            // These are live asset links for local preview, not a release snapshot.
            for (const asset of ['style.css', 'styles', 'resources', 'assets', 'private_packs', 'LICENSE']) {
                if (!fs.existsSync(asset)) continue; // Optional local pack directory.
                const destination = path.resolve(buildOut, asset);
                const source = path.resolve(asset);
                if (!fs.existsSync(destination)) fs.symlinkSync(source, destination);
                else if (fs.realpathSync(destination) !== fs.realpathSync(source)) {
                    throw new Error(`BUILD_OUT contains an unrelated asset: ${asset}`);
                }
            }
        }
        try {
            fs.writeFileSync(htmlPath, htmlContent);
            console.log("Bundle and style versions in .html have been updated!");
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
        
    }).catch(() => process.exit(1));
