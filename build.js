
import * as esbuild from 'esbuild';
import * as fs from 'fs';
import { styleText } from 'node:util';
import { createHash } from 'node:crypto';
import { get_game_version } from './src/game_version.js';
import {execFileSync} from 'node:child_process';

// A runtime cursor requires this exact authored source/compiler/artifact join.
execFileSync(process.execPath,['scripts/compile_feature_ink.mjs','--check'],{stdio:'inherit'});
const inkNotices=fs.readFileSync('docs/gm/feature-wave/ink/COMPILER.md','utf8');
for(const [marker,path] of [['inkjs-notice','dist/INKJS_NOTICE.txt'],['inkjs-authors','dist/INKJS_AUTHORS.txt']]) {
    const start=`<!-- ${marker}:start -->\n`,end=`<!-- ${marker}:end -->`;
    const a=inkNotices.indexOf(start),b=inkNotices.indexOf(end,a);
    if(a<0||b<0)throw new Error('Missing exact Ink distribution notice.');
    fs.writeFileSync(path,inkNotices.slice(a+start.length,b));
}

const bundle_regex = /dist\/bundle\.js\?version=[^&"]+/;

const style_regex = /style\.css\?version=[^&"]+/;

esbuild
    .build({
        entryPoints: ["src/main.js"],
        bundle: true,
        sourcemap: true,
        minify: true,
        outfile: `dist/bundle.js`,
        platform: "browser",
        target: "es2022",
        format: 'esm',
        logLevel: "debug",
    }).then(() => {
        console.log("Javascript build complete!");
        const htmlPath = 'index.html';
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');

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
            `dist/bundle.js?version=${get_game_version()}-${fingerprint('dist/bundle.js')}`
        ).replace(
            style_regex,
            `style.css?version=${get_game_version()}-${fingerprint('style.css')}`
        );
        htmlContent=htmlContent.replace(/styles\/action_legibility\.css\?version=[^&"]+/,`styles/action_legibility.css?version=${fingerprint('styles/action_legibility.css')}`);
        try {
            fs.writeFileSync(htmlPath, htmlContent);
            console.log("Bundle and style versions in .html have been updated!");
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
        
    }).catch(() => process.exit(1));
