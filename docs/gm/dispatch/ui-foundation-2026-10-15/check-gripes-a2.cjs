// Isolated leaf fixture. Native service/center return belongs to root's integrated gate.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {buildSync}=require(path.resolve(__dirname,'../../../../node_modules/esbuild'));
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const T=require('./target-set.cjs');
const root=path.resolve(__dirname,'../../../..');
const bundle=buildSync({entryPoints:[path.join(root,'src/nearby_context_view.js')],bundle:true,write:false,format:'iife',globalName:'Nearby'}).outputFiles[0].text;
const css=fs.readFileSync(path.join(root,'styles/nearby_context_view.css'),'utf8');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{for(const target of T.targets().filter(t=>['1920','1366'].includes(t.name))){
 const width=target.w>=1920?744:463,font=target.font,wide=width>=30*font;
 const context=await browser.newContext({viewport:{width:target.w,height:target.h}}),page=await context.newPage();
 await page.setContent(`<style>:root{--p23-text:#ddd;--p23-muted:#aaa;--p23-context:#123;--p23-line:#456;--p23-quantity:#dca;--p23-blue:#234}body{background:#123}#current_focus{width:${width}px;font:${font}px Arial}</style><div id="current_focus"></div>`);
 await page.addStyleTag({content:css});await page.addScriptTag({content:bundle});
 await page.evaluate(()=>{
 window.calls=[];window.selected=null;window.frame={place:'Village',history:{},people:[{id:'elder',name:'Village elder',role:'Neighbor',met:true,traits:[]},{id:'visitor',name:'Unmet traveler',met:false}],things:[{id:'mixing',name:'Village mixing counter',description:'Mix and observe your own ingredients.'},{id:'projects',name:'Projects'}],actions:[{id:'talk:elder',target:'elder',label:'Talk with village elder'},{id:'mixing',target:'mixing',label:'Open mixing'}]};
 window.update=()=>view.update({frame,selected,description:'A quiet village. A longer place account remains available.'});
 window.view=Nearby.createNearbyContextView({choose:id=>{selected=id;update();},act:id=>calls.push(id)});document.querySelector('#current_focus').append(view.node);update();
 });
 assert.equal(await page.locator('[data-inspect-nearby=projects]').count(),0);
 await page.locator('[data-inspect-nearby=elder]').click();
 assert.equal(await page.locator('.nearby-context-list').isVisible(),wide);
 assert.equal(await page.locator('.nearby-context-detail h3').textContent(),'Village elder');assert.deepEqual(await page.evaluate(()=>calls),[]);
 if(wide){await page.locator('[data-inspect-nearby=elder]').focus();await page.evaluate(()=>{window.focusBefore=document.activeElement;frame.people[0].role='Known neighbor';update();});assert(await page.evaluate(()=>document.activeElement===focusBefore));}
 await page.locator('[data-focus-action="talk:elder"]').click();assert.deepEqual(await page.evaluate(()=>calls),['talk:elder']);
 await page.locator('[data-nearby-next]').click();assert.equal(await page.locator('.nearby-context-detail h3').textContent(),'Unmet traveler');
 await page.locator('[data-nearby-next]').click();assert.equal(await page.locator('.nearby-context-detail h3').textContent(),'Village mixing counter');
 await page.locator('[data-focus-action=mixing]').focus();await page.evaluate(()=>{window.actionBefore=document.activeElement;update();});assert(await page.evaluate(()=>document.activeElement===actionBefore));
 await page.locator('[data-focus-action=mixing]').click();assert.deepEqual(await page.evaluate(()=>calls),['talk:elder','mixing']);
 await page.evaluate(()=>update());assert.equal(await page.locator('.nearby-context-detail h3').textContent(),'Village mixing counter');
 await page.locator('[data-nearby-back]').click();assert(await page.locator('.nearby-context-list').isVisible());assert.equal(await page.evaluate(()=>document.activeElement.dataset.inspectNearby),'mixing');
 await page.locator('[data-inspect-nearby=elder]').click();await page.locator('[data-focus-action="talk:elder"]').focus();await page.evaluate(()=>{frame.people=frame.people.filter(p=>p.id!=='elder');update();});
 assert(await page.locator('.nearby-context-list').isVisible());assert.equal(await page.evaluate(()=>document.activeElement.dataset.inspectNearby),'visitor');assert((await page.locator('.nearby-context-view').textContent()).includes('no longer available'));
 assert(await page.locator('.nearby-context-view').evaluate(n=>n.scrollWidth<=n.clientWidth));
 console.log(`PASS isolated A2 ${target.w}×${target.h} / ${width}px panel / ${font}px text / ${wide?'split':'drilldown'}`);await context.close();
 }}finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
