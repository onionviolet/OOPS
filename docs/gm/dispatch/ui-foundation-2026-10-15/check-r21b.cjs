// R21b check: the hero creation panel is retired. A new game reaches play from PLAY with a default
// hero; the start screen's Beginning section carries the Optional beginning (and the local start
// probe); old saves keep their identity; a mid-creation save completes with its own choices;
// save, reload, export and import keep the hero; classic starts too; UR13 line logged.
// Usage: R4_URL=http://127.0.0.1:19493 node check-r21b.cjs
const T=require('./target-set.cjs');const {L}=T;const {fs,path,assert}=L;
const E=path.join(__dirname,'evidence/r21b');fs.mkdirSync(E,{recursive:true});
const BASE=process.env.R4_URL||'http://127.0.0.1:19493';
const results=[];let failed=0;
const step=async(name,fn)=>{try{const r=await fn();results.push({name,ok:true,...(r||{})});console.log('PASS',name);}catch(e){failed++;results.push({name,ok:false,error:e.message.split('\n')[0]});console.log('FAIL',name,e.message.split('\n')[0]);}};
const PARITY='yairpg.presentation.proto23-parity.v1',SHELL='yairpg.presentation.proto23-shell.v1';
async function boot(b,{w=1920,h=1080,data=null,storage={},query=''}={}){
    const ctx=await b.newContext({viewport:{width:w,height:h},reducedMotion:'reduce',acceptDownloads:true}),p=await ctx.newPage();p.errors=[];p.on('pageerror',e=>p.errors.push(e.message));p.setDefaultTimeout(25000);
    await p.goto(BASE+'/style.css');await p.evaluate(({data,storage})=>{localStorage.clear();if(data)localStorage.setItem('save data',data);for(const[k,v]of Object.entries(storage))localStorage.setItem(k,v);},{data,storage});
    await p.goto(BASE+'/?test_hooks=1'+query,{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>!!window.simulationTestHooks);
    await p.locator('#loading_screen_play_button:not(.none_display)').waitFor();return{ctx,p};}
const play=async p=>{await p.locator('#loading_screen_play_button').click({noWaitAfter:true});await p.locator('#location_actions_div .location_choice_dropdown').first().waitFor({state:'visible'});await p.evaluate(()=>simulationTestHooks.pause());await p.waitForTimeout(500);};
const hero=p=>p.evaluate(()=>{const s=simulationTestHooks.snapshot();return{name:s.character.name,bio:s.character.bio,created:s.global_flags.is_hero_created};});
const json=s=>JSON.stringify(s);
(async()=>{const b=await T.launch(900);
try{
    await step('fresh game: Beginning on the start screen, no creation panel, PLAY reaches play with a default hero (1920×1080)',async()=>{
        const {ctx,p}=await boot(b);
        assert.equal(await p.locator('#hero_creation_panel').count(),0,'creation panel still in the page');
        assert(await p.locator('#new_game_beginning').isVisible(),'Beginning not shown');
        assert(await p.locator('#new_game_beginning [data-cheat-start]').isVisible(),'Optional beginning not in Beginning');
        const card=await p.locator('#new_game_beginning').boundingBox(),btn=await p.locator('#loading_screen_play_button').boundingBox();
        assert(card.y>=btn.y+btn.height,'Beginning covers PLAY');assert(card.y+card.height<=1080,'Beginning off screen');
        await T.shot(p,path.join(E,'start-1920.png'));
        await play(p);const h=await hero(p);
        assert.deepEqual(h,{name:'Hero',bio:{race:'human',age:'adult',gender:'ambiguous',height:'average'},created:true});
        assert.equal(await p.locator('#new_game_beginning').count(),0,'Beginning stayed after PLAY');
        assert.match(await p.locator('#message_box_div').innerText(),/name is set in the You panel header/,'UR13 line missing');
        assert.deepEqual(p.errors,[]);await T.shot(p,path.join(E,'played-1920.png'));await ctx.close();return{hero:h};});
    await step('Beginning fits the 1366×768 floor and keeps PLAY clear',async()=>{
        const {ctx,p}=await boot(b,{w:1366,h:768});const card=await p.locator('#new_game_beginning').boundingBox(),btn=await p.locator('#loading_screen_play_button').boundingBox();
        assert(card.y>=btn.y+btn.height&&card.y+card.height<=768,`card ${json(card)} play ${json(btn)}`);await T.shot(p,path.join(E,'start-1366.png'));await ctx.close();});
    await step('Optional beginning applies on PLAY as the panel did (CH1 start)',async()=>{
        const {ctx,p}=await boot(b);await p.selectOption('#new_game_beginning [data-cheat-start]','system-quests');await play(p);
        const s=await p.evaluate(()=>JSON.stringify(simulationTestHooks.snapshot()));assert.match(s,/You chose to begin with a dormant system\./);await ctx.close();});
    await step('ordinary beginning records the ordinary milestone',async()=>{
        const {ctx,p}=await boot(b);await play(p);const s=await p.evaluate(()=>JSON.stringify(simulationTestHooks.snapshot()));assert.match(s,/You chose an ordinary beginning without a system\./);await ctx.close();});
    await step('local start probe re-homed into Beginning (?start_probe=1)',async()=>{
        const {ctx,p}=await boot(b,{query:'&start_probe=1'});assert(await p.locator('#new_game_beginning [data-start-roll]').count(),'probe not in Beginning');await play(p);assert.deepEqual(p.errors,[]);await ctx.close();});
    await step('old save with a custom identity loads unchanged and shows no Beginning',async()=>{
        const d=JSON.parse(L.save);d.character.name='Weibao';d.character.bio={race:'human',age:'young',gender:'female',height:'tall'};
        const {ctx,p}=await boot(b,{data:JSON.stringify(d)});assert.equal(await p.locator('#new_game_beginning').count(),0,'Beginning on a loaded save');
        await play(p);const h=await hero(p);assert.deepEqual(h,{name:'Weibao',bio:d.character.bio,created:true});
        assert.equal(await p.locator('#character_name_field').inputValue(),'Weibao');await ctx.close();});
    await step('mid-creation save completes with its own choices (defaults only fill gaps)',async()=>{
        const d=JSON.parse(L.save);d.global_flags.is_hero_created=false;d.character.name='Mira';d.character.bio={race:'human',age:'young'};
        const {ctx,p}=await boot(b,{data:JSON.stringify(d)});await play(p);const h=await hero(p);
        assert.deepEqual(h,{name:'Mira',bio:{race:'human',age:'young',gender:'ambiguous',height:'average'},created:true});await ctx.close();});
    await step('save, reload, export and import keep the hero and never bring the panel back',async()=>{
        const {ctx,p}=await boot(b);await play(p);
        const field=p.locator('#character_name_field');await field.fill('Weibao');await field.press('Enter');await field.blur();
        await p.locator('#save_button').click();await p.waitForTimeout(300);
        await p.reload({waitUntil:'domcontentloaded'});await p.waitForFunction(()=>!!window.simulationTestHooks);await p.locator('#loading_screen_play_button:not(.none_display)').waitFor();
        assert.equal(await p.locator('#new_game_beginning').count(),0,'Beginning after reload');await play(p);assert.equal((await hero(p)).name,'Weibao','reload lost the name');
        const [dl]=await Promise.all([p.waitForEvent('download'),p.locator('#save_to_file_button').click()]);const file=path.join(E,'export.save.txt');await dl.saveAs(file);
        const {ctx:c2,p:p2}=await boot(b);await p2.locator('#saved_file_input').setInputFiles(file);await p2.waitForTimeout(1500);
        await p2.waitForFunction(()=>!!window.simulationTestHooks).catch(()=>{});await p2.locator('#loading_screen_play_button:not(.none_display)').waitFor({timeout:30000}).catch(()=>{});
        if(await p2.locator('#loading_screen_play_button:not(.none_display)').isVisible())await play(p2);else{await p2.evaluate(()=>simulationTestHooks.pause());}
        const h2=await hero(p2);assert.equal(h2.name,'Weibao','import lost the name');assert.equal(h2.created,true);assert.equal(await p2.locator('#hero_creation_panel').count(),0);
        await ctx.close();await c2.close();return{imported:h2};});
    await step('classic presentation starts a new game without the panel (GU5)',async()=>{
        const {ctx,p}=await boot(b,{storage:{[PARITY]:'off',[SHELL]:'off'}});assert.equal(await p.locator('#hero_creation_panel').count(),0);await play(p);
        assert.equal((await hero(p)).created,true);assert.deepEqual(p.errors,[]);await ctx.close();});
}finally{await b.close();}
fs.writeFileSync(path.join(E,'results.json'),JSON.stringify(results,null,1));
console.log(`${results.filter(r=>r.ok).length}/${results.length} pass`);process.exitCode=failed?1:0;})();
