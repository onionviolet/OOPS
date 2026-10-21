import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {build} from 'esbuild';
import {Session,serve} from './playtest/lib.mjs';
const root=process.cwd(), out=join(root,'modularity-browser');await mkdir(out,{recursive:true});
const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));
delete seed.availabilities.recipe.undefined;
const snapshots={};
for(const variant of ['before','after','extra']) {
 const bundle=await mkdtemp(join(tmpdir(),'oops-modularity-bundle-'));
 await build({entryPoints:['src/main.js'],bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,outfile:join(bundle,'bundle.js'),logLevel:'error',plugins:[{name:'comparison-input',setup(b){b.onLoad({filter:/src\/(layout_spec|workspace_layout)\.js$/},async args=>{
 let contents=await readFile(args.path,'utf8');
 if(variant==='before'&&args.path.endsWith('workspace_layout.js'))contents=contents.replace('for(const {id,label} of workspaceRegions())','for(const id of [\'player\',\'focus\',\'inventory\',\'actions\',\'log\'])').replace('`${label} region`',"`${id==='focus'?'Around you':id} region`");
 if(variant==='before'&&args.path.endsWith('layout_spec.js')) {
 contents=contents.replace(/label: '(player|Around you|inventory|actions|log)', /g,'');
 const a="        actions: Object.freeze({panels: ['records', 'skills', 'opponents']}),\n",l="        log: Object.freeze({panels: ['messages', 'shell-log-tools']}),\n";
 contents=contents.replace(a+l,l+a);
 }
 if(variant==='extra'&&args.path.endsWith('layout_spec.js'))contents=contents.replace('regions: Object.freeze({','regions: Object.freeze({map: Object.freeze({label: \'Local map\', panels: []}),');
 return {contents,loader:'js'};
 });}}]});
 const server=await serve(bundle),session=new Session({url:server.url,seed:7,wall:1800000000000,hooks:{beforeOpen:async context=>{context.on('response',r=>{if(r.status()>=400)console.log('HTTP',r.status(),r.url());});}}});
 snapshots[variant]=[];
 try {await session.start();for(const size of variant==='extra'?[14]:[14,21]) {
 const fixture=structuredClone(seed);fixture.customization.profiles.Default.settings.typography={font:'gothic',size};
 await session.open(fixture);const p=session.page;await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1800);
 const regions=await p.locator('.parity-region').evaluateAll(nodes=>nodes.map(n=>({id:n.dataset.region,label:n.getAttribute('aria-label'),rect:JSON.parse(JSON.stringify(n.getBoundingClientRect()))})));
 assert.deepEqual(regions.map(r=>r.id),variant==='extra'?['map','player','focus','inventory','actions','log']:['player','focus','inventory','actions','log']);
 if(variant==='extra'){assert.equal(regions[0].label,'Local map region');snapshots[variant].push({size,regions});continue;}
 const button=p.locator('[data-panel-path="records"]:visible').first();await button.click();await p.waitForTimeout(250);assert.equal(await p.locator('#main_content').getAttribute('data-center-task'),'workspace:records');
 await p.keyboard.press('Escape');await p.waitForTimeout(250);assert.equal(await p.locator('#main_content').getAttribute('data-center-task'),null);
 await p.screenshot({path:join(out,`${variant}-${size}.png`)});snapshots[variant].push({size,regions});
 }assert.deepEqual(session.errors,[]);}finally{await session.close();await server.close();}
}
assert.deepEqual(snapshots.after,snapshots.before);
await writeFile(join(out,'receipt.json'),JSON.stringify({result:'PASS',viewport:[1920,1080],checks:['before/after exact region order, accessibility labels and geometry at 14/21px','real Journal navigation opens and Esc returns','sixth Local map region mounts from spec alone without host change','no browser errors'],snapshots},null,2));console.log('PASS before/after layout and navigation, plus sixth-region consumer');
