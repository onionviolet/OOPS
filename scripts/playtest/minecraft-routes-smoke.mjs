import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
const root=resolve(process.argv[2]||'.'),saved=JSON.parse(await readFile(process.argv[3],'utf8')),out=resolve(process.argv[4]||'/tmp/mf-routes-primary');await mkdir(out,{recursive:true});
const server=await serve(root),s=new Session({url:server.url+'?test_hooks=1',seed:71,wall:Date.UTC(2026,9,21,15)}),checks=[];
try{await s.start();for(const size of [14,21]){
 const view=structuredClone(saved);view.customization.profiles.Default.settings.typography={font:'gothic',size};await s.open(view);const p=s.page,before=await s.save();
 await p.locator('[data-field-workshop-door]').click();await p.locator('[data-field-works]').waitFor({state:'visible'});await p.locator('[data-freight-key]').evaluate(el=>el.closest('details').open=true);
 for(const selector of ['[data-works-freight]','[data-works-housing]','[data-freight-key]'])assert.equal(await p.locator(selector).evaluate(el=>getComputedStyle(el).fontSize),`${size}px`);
 await p.locator('[data-works-freight]').scrollIntoViewIfNeeded();await p.screenshot({path:join(out,'freight-'+size+'.png')});
 await p.locator('#workspace_navigation select').first().selectOption('homes');await p.getByRole('combobox',{name:'Inspect residence'}).selectOption('cottage');
 const release=p.locator('[data-home-action="worker_release:fieldWorksArtisan"]');await release.evaluate(el=>el.closest('details').open=true);assert.equal(await release.isDisabled(),false);await release.scrollIntoViewIfNeeded();await p.screenshot({path:join(out,'worker-room-'+size+'.png')});
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);const after=await s.save();for(const key of ['expansion','homes','inventories'])assert.deepEqual(after[key],before[key]);assert.equal(after.expansion.actors.fieldWorksFreighter.resources['field.works.earnedWages'],2);
 checks.push(`Primary native index at 1920x1080/${size}px: workshop action available after load without a clock tick; installed-font freight/housing controls; actual room release available away from home; view/focus purity and no horizontal overflow`);
 }assert.deepEqual(s.errors,[]);await writeFile(join(out,'receipt.json'),JSON.stringify({checks,errors:s.errors,setup:'Fresh browser contexts load the generated native journey end-state; typography-only variants. No personal save.'},null,2));console.log(JSON.stringify({checks,out}));}finally{await s.close();await server.close();}
