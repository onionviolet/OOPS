// main.js slice (2026-10-22, AR9): the moved dev console behaves the same. Serve each build with
// enable_dev_mode switched on in the bundle response only, run the same console calls and compare.
const L=require('../ui-foundation-2026-10-15/r11-lib.cjs');const {fs,path,assert}=L;const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
async function run(b,base){
    const ctx=await b.newContext({viewport:{width:1920,height:1080}});await ctx.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
    await ctx.addInitScript(()=>{Date.now=()=>1792108800000;let n=41;Math.random=()=>((n=Math.imul(n,1664525)+1013904223>>>0)/4294967296);});
    await ctx.route(/\/dist\/bundle\.js/,async r=>{const res=await r.fetch();const body=(await res.text()).replace(/enable_dev_mode:(\s*false|!1)/,'enable_dev_mode:!0');r.fulfill({response:res,body});});
    const p=await ctx.newPage();const errors=[],logs=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(/Dev console/.test(m.text()))logs.push(m.text());});
    await p.goto(base+'/style.css');await p.evaluate(d=>{localStorage.clear();localStorage.setItem('save data',d);},L.save);
    await p.goto(base+'/?test_hooks=1',{waitUntil:'domcontentloaded'});await L.R.startFresh(p);await p.evaluate(()=>simulationTestHooks.pause());
    const r=await p.evaluate(()=>{const out={};const t=(k,f)=>{try{const v=f();out[k]=v===undefined?'undefined':v;}catch(e){out[k]='THREW '+e.constructor.name+': '+e.message;}};
        t('lists',()=>[list_effects().length,list_items().length,list_locations().length,list_skills().length,list_quests().length,list_dialogues().length,list_flags().length]);
        t('money',()=>add_money(123));t('xp',()=>add_xp(5));t('skill',()=>add_skill_xp(list_skills()[0],10));
        t('effect',()=>add_active_effect(list_effects()[0],60));t('badEffect',()=>add_active_effect('nope'));
        t('best',()=>JSON.stringify(add_best_effects(60)).length);
        t('flag',()=>set_flag(list_flags()[0],true));t('go',()=>go_to('Village'));t('speed',()=>set_speed(1));
        t('give',()=>give({money:7}));t('simulate',()=>simulate_combat({use_hero:false,fighter_locations:['nowhere']}));return out;});
    await ctx.close();return {r,errors,logs};
}
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{const before=await run(b,process.env.BEFORE),after=await run(b,process.env.AFTER);
console.log(JSON.stringify(after.r));assert.deepEqual(after.r,before.r);assert.deepEqual(after.errors,before.errors);assert.equal(after.logs.length,1);
fs.mkdirSync(path.join(__dirname,'evidence'),{recursive:true});fs.writeFileSync(path.join(__dirname,'evidence','dev-console.json'),JSON.stringify({status:'PASS',before,after},null,1));console.log('PASS dev console identical');}
finally{await b.close();}})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
