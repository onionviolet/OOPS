
import * as esbuild from 'esbuild';
import * as fs from 'fs';
import path from 'node:path';
import { styleText } from 'node:util';
import { createHash } from 'node:crypto';
import { get_game_version } from './src/game_version.js';
import {execFileSync} from 'node:child_process';

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

const style_regex = /style\.css\?version=[^&"]+/;

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
        if(htmlContent.search(style_regex) == -1) {
            console.error(styleText("red", 'Failed to update the style version in .html!'));
            process.exit(1);
        }

        const fingerprint = path => createHash('sha256').update(fs.readFileSync(path)).digest('hex').slice(0, 12);
        htmlContent = htmlContent.replace(
            bundle_regex,
            `dist/bundle.js?version=${get_game_version()}-${fingerprint(bundlePath)}`
        ).replace(
            style_regex,
            `style.css?version=${get_game_version()}-${fingerprint('style.css')}`
        );
        htmlContent=htmlContent.replace(/styles\/action_legibility\.css\?version=[^&"]+/,`styles/action_legibility.css?version=${fingerprint('styles/action_legibility.css')}`);
        htmlContent=htmlContent.replace(/styles\/workspace\.css(?:\?version=[^&"]+)?/,`styles/workspace.css?version=${fingerprint('styles/workspace.css')}`);
        htmlContent=htmlContent.replace(/styles\/ui_tokens\.css(?:\?version=[^&"]+)?/,`styles/ui_tokens.css?version=${fingerprint('styles/ui_tokens.css')}`);
        htmlContent=htmlContent.replace(/styles\/shell_layout\.css(?:\?version=[^&"]+)?/,`styles/shell_layout.css?version=${fingerprint('styles/shell_layout.css')}`);
        htmlContent=htmlContent.replace(/styles\/inventory\.css(?:\?version=[^&"]+)?/,`styles/inventory.css?version=${fingerprint('styles/inventory.css')}`);
        htmlContent=htmlContent.replace(/styles\/opponents\.css(?:\?version=[^&"]+)?/,`styles/opponents.css?version=${fingerprint('styles/opponents.css')}`);
        htmlContent=htmlContent.replace(/styles\/combat_log\.css(?:\?version=[^&"]+)?/,`styles/combat_log.css?version=${fingerprint('styles/combat_log.css')}`);
        htmlContent=htmlContent.replace(/styles\/shell_chrome\.css(?:\?version=[^&"]+)?/,`styles/shell_chrome.css?version=${fingerprint('styles/shell_chrome.css')}`);
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
