// Isolated preview of the reviewed shared-file patch. Shared writers retain
// their source/bundle ownership; this builds only new named preview artifacts.
import * as fs from 'node:fs';
import * as path from 'node:path';
import {createHash} from 'node:crypto';
import * as esbuild from 'esbuild';

const root=process.cwd(), base=path.join(root,'docs/gm/nethack');
const hash=text=>createHash('sha256').update(text).digest('hex');
const receipt=JSON.parse(fs.readFileSync(path.join(base,'INTEGRATION.json'),'utf8'));
const patch=fs.readFileSync(path.join(base,'INTEGRATION.patch'),'utf8');
const overlays=new Map();
// The patch is generated locally and must match all exact before/after hashes.
// Reject changed shared inputs rather than pretending to preview a newer base.
for(const entry of receipt.files) {
    const filename=path.join(root,entry.file), original=fs.readFileSync(filename,'utf8');
    if(hash(original)!==entry.beforeSha256)throw Error(`Shared preview input changed: ${entry.file}`);
    const marker=`--- a/${entry.file}\n+++ b/${entry.file}\n`;
    const start=patch.indexOf(marker);
    if(start<0)throw Error(`Missing integration patch: ${entry.file}`);
    const next=patch.indexOf('\n--- a/',start+marker.length);
    const lines=patch.slice(start+marker.length,next<0?undefined:next+1).split('\n');
    const source=original.split('\n'), result=[];
    let cursor=0;
    for(let i=0;i<lines.length;i++) {
        const hunk=/^@@ -(\d+)(?:,\d+)? \+\d+(?:,\d+)? @@/.exec(lines[i]);
        if(!hunk)continue;
        const at=Number(hunk[1])-1;
        if(at<cursor)throw Error('Overlapping integration hunks.');
        result.push(...source.slice(cursor,at));cursor=at;
        for(i++;i<lines.length&&!lines[i].startsWith('@@ ');i++) {
            const line=lines[i], prefix=line[0], body=line.slice(1);
            if(prefix===' '||prefix==='-') {
                if(source[cursor]!==body)throw Error(`Changed patch context: ${entry.file}`);
                cursor++;
            }
            if(prefix===' '||prefix==='+')result.push(body);
            else if(prefix!=='-'&&line!==''&&!line.startsWith('\\'))throw Error('Unsupported integration patch line.');
        }
        i--;
    }
    result.push(...source.slice(cursor));
    const changed=result.join('\n');
    if(hash(changed)!==entry.afterSha256)throw Error(`Integration output mismatch: ${entry.file}`);
    overlays.set(filename,changed);
}

await esbuild.build({entryPoints:['src/main.js'],bundle:true,sourcemap:true,minify:true,
    outfile:'dist/nethack-fieldcraft-preview.js',platform:'browser',target:'es2022',format:'esm',
    plugins:[{name:'reviewed-fieldcraft-overlay',setup(build){
        build.onLoad({filter:/\.js$/},args=>overlays.has(args.path)?{contents:overlays.get(args.path),loader:'js',resolveDir:path.dirname(args.path)}:undefined);
    }}]});

const bundle=fs.readFileSync('dist/nethack-fieldcraft-preview.js');
const fingerprint=hash(bundle).slice(0,12);
const html=fs.readFileSync('index.html','utf8').replace(/dist\/bundle\.js\?version=[^&"]+/,
    `dist/nethack-fieldcraft-preview.js?version=fieldcraft-${fingerprint}`);
if(!html.includes('dist/nethack-fieldcraft-preview.js?version='))throw Error('Missing preview entry.');
fs.writeFileSync('nethack-preview.html',html);

const map=JSON.parse(fs.readFileSync('dist/nethack-fieldcraft-preview.js.map','utf8'));
let matched=0;
const sourceFiles=[];
for(let i=0;i<map.sources.length;i++) {
    const file=path.resolve(root,'dist',map.sources[i]);
    if(!file.startsWith(root+path.sep)||file.includes(`${path.sep}node_modules${path.sep}`))continue;
    const expected=overlays.get(file)??fs.readFileSync(file,'utf8');
    if(map.sourcesContent[i]!==expected)throw Error(`Preview source-map mismatch: ${file}`);
    sourceFiles.push({file:path.relative(root,file),sha256:hash(expected),overlay:overlays.has(file)});matched++;
}
fs.writeFileSync(path.join(base,'PREVIEW_BUILD.json'),JSON.stringify({schema:1,
    state:'integrated-preview-built; shared-file patch unapplied',bundleFingerprint:fingerprint,
    bundleSha256:hash(bundle),sourceMapSha256:hash(fs.readFileSync('dist/nethack-fieldcraft-preview.js.map')),
    previewHtmlSha256:hash(html),sourceMapsMatched:matched,sourceFiles,
    checks:{build:'passed',overlayInputs:'exact before/after hashes matched',sourceMap:'matched',
        gameplayBrowserSaveReloadFailureRegressionDirector:'deferred-unrun'},
    source:'docs/research/nethack/SOURCE.json',integration:'docs/gm/nethack/INTEGRATION.patch'},null,2)+'\n');
console.log(JSON.stringify({previewBundle:fingerprint,sourceMapsMatched:matched,sharedOverlays:overlays.size,behavior:'implemented-unverified'}));
