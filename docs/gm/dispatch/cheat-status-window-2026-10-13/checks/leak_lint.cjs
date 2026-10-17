// Read-only browser gate. REPO points at rebuilt source; URL at its fresh test origin.
// Exit 0: clean, 1: leak/behavior failure, 3: tooling/coverage failure.
// Optional OUT writes evidence ONLY to the caller's chosen scratch directory.
const fs = require('fs'), path = require('path'), {pathToFileURL} = require('url');
const REPO = process.env.REPO || process.cwd();
const URL = process.env.URL || 'http://127.0.0.1:18481/';
const OUT = process.env.OUT;
let chromium;
try {({chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
catch {console.log('BROKEN playwright');process.exit(3);}
const fixtureRoot = path.join(REPO, 'docs/gm/dispatch/cheat-status-window-2026-10-13/fixtures');
const read = f => fs.readFileSync(f, 'utf8');
const decode = s => Buffer.from(s.trim().replace(/^YAIR-UTF8-1:/, ''), 'base64').toString('utf8');
const evidence = (name, value) => {if (OUT) {fs.mkdirSync(OUT, {recursive:true}); fs.writeFileSync(path.join(OUT,name), typeof value === 'string' ? value : JSON.stringify(value,null,2));}};
async function registry() {
  const mod = await import(pathToFileURL(path.join(REPO,'src/cheat_cards.js')).href);
  const cards = new Map(), seen = new Set();
  function walk(v) {
    if (!v || typeof v !== 'object' || seen.has(v)) return; seen.add(v);
    if (typeof v.id === 'string' && typeof v.name === 'string' && typeof v.ui === 'string' && Array.isArray(v.hooks)) {
      mod.validateCheatCard(v); cards.set(v.id, v);
    }
    if(v instanceof Map || v instanceof Set) [...v.values()].forEach(walk);
    else Object.values(v).forEach(walk);
  }
  walk(mod); // Exported cards and nested registry arrays/maps-as-objects, no name allowlist.
  for (const f of fs.readdirSync(fixtureRoot).filter(x=>x.endsWith('.save.txt'))) {
    const save = JSON.parse(read(path.join(fixtureRoot,f))); walk(save.cheats?.held);
  }
  if (!cards.size) throw Error('no cards found in exported registry/fixtures');
  const labels = new Map();
  function files(dir) {return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):e.name.endsWith('.js')?[path.join(dir,e.name)]:[]);}
  for (const f of files(path.join(REPO,'src'))) {
    const source = read(f);
    for (const m of source.matchAll(/(?:definePanel|registerWorkspaceModule)\s*\(\s*\{\s*id\s*:\s*['"]([^'"]+)['"]\s*,\s*(?:title|label)\s*:\s*['"]([^'"]+)['"]/g)) labels.set(m[1], m[2]);
  }
  for (const c of cards.values()) if (c.ui !== 'quiet' && !labels.has(c.ui))
    throw Error(`panel label coverage missing for card ${c.id}; expose literal registry label or extend registry reader`);
  return {cards:[...cards.values()], labels};
}
async function fresh(browser, save=null) {
  // Independent incognito storage partition, even when URL is reused.
  const ctx=await browser.newContext({viewport:{width:1366,height:768},acceptDownloads:true});
  const p=await ctx.newPage(); p.setDefaultTimeout(15000); p.errors=[]; p.consoleErrors=[];
  p.on('pageerror',e=>p.errors.push(e.message));
  p.on('console',m=>{if(m.type()==='error')p.consoleErrors.push(m.text());});
  await p.goto(new globalThis.URL('style.css', URL).href);
  await p.evaluate(s=>{localStorage.clear();if(s)localStorage.setItem('save data',s);},save);
  await p.goto(URL,{waitUntil:'domcontentloaded'});
  await p.locator('#loading_screen_play_button:not(.none_display)').waitFor();
  return {ctx,p};
}
async function play(p) {await p.locator('#loading_screen_play_button').click();await p.waitForTimeout(1200);}
async function create(p, dormant=false) {
  // R21b: the Optional beginning sits on the start screen; choosing it precedes PLAY.
  const choice=p.locator('#new_game_beginning [data-cheat-start]');
  if(dormant) {
    const options=await choice.locator('option').evaluateAll(es=>es.map(e=>e.value));
    const reg=await registry(); const id=reg.cards.find(c=>options.includes(c.id))?.id;
    if(!id)throw Error('no registry card is selectable in the start-screen Beginning');
    await choice.selectOption(id);
  } else await choice.selectOption('none');
  await play(p);await p.waitForTimeout(800);
}
async function stored(p) {await p.locator('#save_button').click();await p.waitForTimeout(300);return JSON.parse(await p.evaluate(()=>localStorage.getItem('save data')));}
async function collect(p) {
  return p.evaluate(()=>{
    const surfaces={'DOM text':[],title:[],'aria-label':[],'aria-description':[],'assistive references':[], 'other assistive strings':[],'option text':[],tooltips:[],'settings lists':[],'Appearance module lists':[],'panel picker entries':[], 'document.title':[document.title], 'localStorage keys':Object.keys(localStorage)};
    const push=(key,s)=>{if(s?.trim())surfaces[key].push(s.trim());};
    push('DOM text',document.body.innerText);
    // Attribute/option inventories intentionally include dormant DOM nodes: controls
    // can become exposed by a menu, AT reference, hover or CSS without a new render.
    for(const e of document.querySelectorAll('*')) {
      for(const attr of ['title','aria-label','aria-description'])push(attr,e.getAttribute(attr));
      for(const attr of ['alt','placeholder','aria-valuetext','aria-roledescription'])push('other assistive strings',e.getAttribute(attr));
      for(const attr of ['aria-labelledby','aria-describedby','aria-errormessage'])for(const id of (e.getAttribute(attr)||'').split(/\s+/))if(id)push('assistive references',document.getElementById(id)?.textContent);
      if(e.tagName==='OPTION')push('option text',e.textContent);
      if(e.matches('[role="tooltip"], [data-tooltip], .tooltip, [class*="tooltip"], [id*="tooltip"]'))push('tooltips',e.textContent);
    }
    for(const e of document.querySelectorAll('#options_panel, #options_div, #options, #customization_effects_host, [data-display-settings], .display-settings'))push('settings lists',e.textContent);
    for(const e of document.querySelectorAll('#customization_host select[aria-label="Native module"] option'))push('Appearance module lists',e.textContent);
    for(const e of document.querySelectorAll('[data-workspace-action="restore"]'))push('panel picker entries',e.textContent);
    for(const e of document.querySelectorAll('input,textarea'))if(e.value)push('DOM text',e.value);
    return surfaces;
  });
}
function forbidden(reg, save) {
  const known=save.cheats?.known||{}, held=save.cheats?.held||{};
  // Current discovery contract: awake + first message, or legacy message-backed C0.
  // Mere possession and arbitrary known object membership do not prove discovery.
  const discovered=c=> {
    const h=held[c.id]; const k=known[c.id];
    return k===true || k?.discovered===true || !!(h?.messages?.length && h.card.state.awakened!==false);
  };
  const discoveredPanels=new Set(reg.cards.filter(discovered).map(c=>c.ui));
  return [...new Set(reg.cards.filter(c=>!discovered(c)).flatMap(c=>[c.id,c.name,...(c.ui==='quiet'||discoveredPanels.has(c.ui)?[]:[c.ui,reg.labels.get(c.ui)])]).filter(Boolean))];
}
async function exercise(p) {
  // Visit menus that lazily expose strings, without changing gameplay or settings.
  if(await p.locator('#options_button').isVisible()) {await p.locator('#options_button').click();await p.waitForTimeout(150);}
  const context=p.locator('[data-workspace-action="context"]');
  if(await context.isVisible()) {await context.click();await p.waitForTimeout(150);}
  for(const details of await p.locator('.workspace-picker,.workspace-layout-menu,.workspace-transfer').all())
    await details.evaluate(e=>{e.open=true;});
  for(const id of ['customization','customization-effects']) {
    const restore=p.locator(`[data-workspace-action="restore"][data-module="${id}"]`);
    if(await restore.count())await restore.first().evaluate(e=>e.click());
  }
  await p.waitForTimeout(300);
}
async function run() {
  let browser, failed=false;
  try {
    const reg=await registry(); evidence('registry.json',{cards:reg.cards.map(c=>({id:c.id,name:c.name,ui:c.ui})),labels:Object.fromEntries(reg.labels)});
    browser=await chromium.launch({headless:true,executablePath:process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
    for(const state of ['none','dormant','awakened']) {
      const fixture=state==='awakened'?read(path.join(fixtureRoot,'held_system.save.txt')):null;
      const {ctx,p}=await fresh(browser,fixture);
      try {
        const beginning=await collect(p);
        if(!fixture)await create(p,state==='dormant'); else await play(p);
        const save=await stored(p), names=forbidden(reg,save), all=await collect(p);
        for(const [k,v] of Object.entries(beginning))all[k].push(...v);
        if(state==='none' && Object.keys(save.cheats?.held||{}).length)throw Error('none holds a card');
        if(state==='dormant' && !Object.values(save.cheats?.held||{}).some(h=>h.card.state.awakened===false))throw Error('dormant state not established');
        if(state==='awakened' && !Object.values(save.cheats?.held||{}).some(h=>h.messages.length && h.card.state.awakened!==false))throw Error('awakened fixture not discovered');
        await exercise(p);
        const after=await collect(p);for(const [k,v]of Object.entries(after))all[k].push(...v);
        // Hover native and custom tooltip hosts to exercise lazy tooltip renderers.
        const hosts=await p.locator('[title],[data-tooltip],[aria-describedby], [class*="tooltip"], [id*="tooltip"], :has(> [class*="tooltip"]), :has(> [id*="tooltip"])').elementHandles();
        const count=hosts.length;
        for(let i=0;i<count;i++) {
          const h=hosts[i];if(await h.isVisible()) {
            await h.hover({timeout:350}).catch(()=>{});
            const t=await p.evaluate(()=>[...document.querySelectorAll('[role="tooltip"],[class*="tooltip"],[id*="tooltip"]')].map(e=>e.innerText).filter(Boolean));
            all.tooltips.push(...t);
          }
        }
        // Real Export click and suggested browser filename, not a source approximation.
        const download=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const d=await download;
        all['suggested export file names']=[d.suggestedFilename()];
        const stream=await d.createReadStream(), chunks=[];for await(const c of stream)chunks.push(c);
        const decoded=decode(Buffer.concat(chunks).toString('utf8'));JSON.parse(decoded);
        const final=await collect(p);for(const [k,v] of Object.entries(final))all[k].push(...v);
        all['decoded Export text']=[decoded];
        evidence(`${state}-export-decoded.json`,decoded);
        evidence(`${state}-surfaces.json`,{state,forbidden:names,surfaces:all,pageErrors:p.errors});
        for(const [surface,strings] of Object.entries(all)) {
          const hits=[];
          for(const str of new Set(strings))for(const name of names) {
            const i=str.toLowerCase().indexOf(name.toLowerCase());
            if(i>=0)hits.push({name,string:str.slice(i,i+name.length)}); // minimal matched string avoids nearby sealed prose
          }
          const ok=!hits.length;failed ||= !ok;
          console.log(`${ok?'PASS':'FAIL'} ${state} ${surface} ${ok?`(${new Set(strings).size} strings)`:JSON.stringify(hits)}`);
        }
        if(p.errors.length){failed=true;console.log(`FAIL ${state} runtime ${JSON.stringify(p.errors)}`);}
        console.log(`${names.length && Object.values(all).some(ss=>ss.some(s=>names.some(n=>s.toLowerCase().includes(n.toLowerCase()))))?'FAIL':'PASS'} ${state} overall`);
      } finally {await ctx.close();}
    }
    return failed?1:0;
  } catch(e) {console.log('BROKEN '+e.message);return 3;} finally {await browser?.close();}
}
module.exports={registry,fresh,play,create,stored,decode,forbidden,collect};
if(require.main===module)run().then(code=>{process.exitCode=code;}).catch(e=>{console.log('BROKEN '+e.message);process.exitCode=3;});
