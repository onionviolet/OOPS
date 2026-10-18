// R22b browser check: screen use at 1920 (SU1–SU8, SU11). Rebuilt bundle, fresh origin per case,
// synthetic fixtures only. Usage: R4_URL=http://127.0.0.1:19496 node check-r22b.cjs
// B1 fight, every target: the opponent list sits beside the actions; at the primary and MacBook
//    sizes it is one column with every row visible; Around you names the inspected opponent; no
//    page overflow.
// B2 kind hues: one hue per kind on the board, the same hue on that kind's names in Reports, each
//    ≥4.5:1 on the region and log fills.
// B3 inspect: choosing another row changes the target line, the back button does not move (UR52).
// B4 one and three opponents still render (no letters for one).
// B5 You matches Inventory's width at 1920 and MacBook; the 1366 floor keeps R21's wider You.
// B6 light custom palette on Reports: every visible log text ≥4.5:1 on its fill.
// B7 a spec-2 browser layout loads as spec 3 with the list shown in a fight.
// B8 the status window starts compact.
const T=require('./target-set.cjs');const {L}=T;const {fs,path,assert}=L;
const F=path.join(__dirname,'evidence/r20/fixtures'),fx=n=>fs.readFileSync(path.join(F,`opponents-${n}.save.txt`),'utf8').trim();
const three=fs.readFileSync(path.join(__dirname,'evidence/parity-r9/populated-three.save.txt'),'utf8').trim();
const awake=fs.readFileSync(path.join(__dirname,'evidence/r21c/awakened.save.txt'),'utf8').trim();
const E=path.join(__dirname,'evidence/r22b');fs.mkdirSync(E,{recursive:true});
const fight=async(p,ms)=>{await p.evaluate(()=>simulationTestHooks.resume());await p.waitForTimeout(ms);await p.evaluate(()=>simulationTestHooks.pause());};
const PRIMARY={name:'1920',w:1920,h:1080,dpr:1,font:14},MBP={name:'mbp',w:1800,h:1040,dpr:2,font:14},FLOOR={name:'1366',w:1366,h:768,dpr:1,font:14};
// Contrast in the page: relative luminance of computed colors.
const CONTRAST=`const lum=c=>{const m=c.match(/[\\d.]+/g).map(Number);const [r,g,b]=m.slice(0,3).map(v=>{v/=255;return v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4;});return 0.2126*r+0.7152*g+0.0722*b;};
 const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);};`;
const results={};
(async()=>{const b=await T.launch(900);try{
    // B1, B2, B5 at every target (14 and 21px).
    results.B1=await T.forTargets(b,async(p,t)=>{await fight(p,4000);
        const r=await p.evaluate(()=>{const m=document.querySelector('.workspace-module[data-module="opponents"]'),cards=document.querySelector('#opponent_list > .enemy-cards');
            const region=m?.closest('[data-region]')?.dataset.region,shown=!!m&&m.checkVisibility(),inList=!!cards;
            const back=document.querySelector('[data-region="actions"] .workspace-module[data-module="local-actions"]');
            const target=document.querySelector('#current_focus .opponent-target');
            const pw=document.querySelector('[data-region="player"]').getBoundingClientRect().width,iw=document.querySelector('[data-region="inventory"]').getBoundingClientRect().width;
            return {region,shown,inList,columns:cards?.dataset.columns,count:Number(cards?.dataset.count||0),allRows:cards?cards.scrollHeight<=cards.clientHeight+1:null,
                actionsVisible:!!back&&back.checkVisibility(),targetLine:target&&!target.hidden?target.innerText.replace(/\s+/g,' ').trim():null,
                page:document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight,you:Math.round(pw),inventory:Math.round(iw)};});
        assert.equal(r.region,'actions',`${T.tag(t)} list region`);assert.ok(r.shown&&r.inList,`${T.tag(t)} list shown beside the actions`);
        assert.ok(r.actionsVisible,`${T.tag(t)} actions still visible`);assert.ok(r.targetLine&&/rat/.test(r.targetLine),`${T.tag(t)} target line names the opponent`);
        assert.ok(r.page,`${T.tag(t)} no page overflow`);
        if(t.name==='1920'||t.name==='mbp'){assert.ok(t.font===21||r.columns==='1'&&r.allRows,`${T.tag(t)} one column, all rows visible`);
            assert.ok(Math.abs(r.you-r.inventory)<=2,`${T.tag(t)} You matches Inventory width (${r.you} vs ${r.inventory})`);}
        if(t.name==='1366')assert.ok(r.you>r.inventory+40,`${T.tag(t)} floor keeps R21 You width`);
        if(t.font===14&&(t.name==='1920'||t.name==='mbp'))await T.shot(p,path.join(E,`after-n8-mixed-${T.tag(t)}.png`));
        return r;},{data:fx('8-mixed')});
    for(const r of results.B1)assert.ok(!r.fail,`B1 ${r.target}: ${r.fail}`);
    // B2 and B3 at the primary target.
    {const [r]=await T.forTargets(b,async p=>{await fight(p,7000);
        const hues=await p.evaluate(`(()=>{${CONTRAST}
            const fillOf=n=>{for(let x=n;x;x=x.parentElement){const s=getComputedStyle(x);const m=s.backgroundImage.match(/rgba?\\([^)]*\\)/g);if(m)return m;if(s.backgroundColor!=='rgba(0, 0, 0, 0)')return [s.backgroundColor];}return ['rgb(0,0,0)'];};
            const board={};for(const c of document.querySelectorAll('#opponent_list .enemy-card[data-kind-hue]:not([data-inspected="true"])')){const name=c.querySelector('.enemy-card-name');board[c.dataset.kindHue]=getComputedStyle(name).color;}
            const log={},low=[];for(const n of document.querySelectorAll('#message_log_div .log-name[data-kind-hue]')){if(!n.checkVisibility()||n.closest('[data-combat-outcome="miss"],[data-combat-outcome="block"]'))continue;const c=getComputedStyle(n).color;log[n.dataset.kindHue]=c;for(const f of fillOf(n)){const v=ratio(c,f);if(v<4.5)low.push([n.textContent,c,f,v.toFixed(2)]);}}
            for(const c of document.querySelectorAll('#opponent_list .enemy-card[data-kind-hue]:not([data-inspected="true"]) .enemy-card-name')){const col=getComputedStyle(c).color;for(const f of fillOf(c)){const v=ratio(col,f);if(v<4.5)low.push([c.textContent,col,f,v.toFixed(2)]);}}
            const names={};for(const c of document.querySelectorAll('#opponent_list .enemy-group-label[data-kind-hue]'))names[c.dataset.kindHue]=c.textContent;
            return {board,log,names,low};})()`);
        assert.ok(Object.keys(hues.board).length>=3,'three kinds, three hues on the board');
        assert.equal(new Set(Object.values(hues.board)).size,Object.keys(hues.board).length,'kind hues distinct');
        for(const [k,c] of Object.entries(hues.log))assert.equal(c,hues.board[k],`log hue ${k} matches board`);
        assert.deepEqual(hues.low,[],`kind hues ≥4.5:1 on their fills: ${JSON.stringify(hues.low.slice(0,6))}`);
        // B3
        const before=await p.evaluate(()=>[document.querySelector('#current_focus .opponent-target > strong').textContent,JSON.stringify(document.querySelector('[data-region="actions"] [data-module="local-actions"] button')?.getBoundingClientRect())]);
        const other=p.locator('#opponent_list .enemy-card:not([data-inspected="true"]):not([data-defeated="true"]) .enemy-card-name').first();await other.click();await p.waitForTimeout(400);
        const after=await p.evaluate(()=>[document.querySelector('#current_focus .opponent-target > strong').textContent,JSON.stringify(document.querySelector('[data-region="actions"] [data-module="local-actions"] button')?.getBoundingClientRect())]);
        assert.notEqual(after[0],before[0],'inspecting another row changes the target line');assert.equal(after[1],before[1],'actions do not move (UR52)');
        return {hues,inspect:[before[0],after[0]]};},{data:fx('8-mixed'),list:[PRIMARY]});
     assert.ok(!r.fail,`B2/B3: ${r.fail}`);results.B2=r.hues;results.B3=r.inspect;}
    // B4
    for(const [label,data] of [['one',fx(1)],['three',three]]){const [r]=await T.forTargets(b,async p=>{await fight(p,3000);
        return p.evaluate(()=>({cards:document.querySelectorAll('#opponent_list .enemy-card, #current_focus .enemy-card').length,letters:[...document.querySelectorAll('#message_log_div .message_combat .log-letter')].length,target:document.querySelector('#current_focus .opponent-target')?.innerText.trim()}));},{data,list:[PRIMARY]});
        assert.ok(!r.fail&&r.cards>=1,`B4 ${label}: ${r.fail||'no cards'}`);if(label==='one')assert.equal(r.letters,0,'one opponent: no letters');results[`B4-${label}`]=r;}
    // B6
    {const o=JSON.parse(fx('8-mixed'));o.customization={schema:1,active:'Default',theme:{mode:'off',season:'spring'},profiles:{Default:{settings:{componentTheme:'neutral',typography:{font:'system',size:14},palette:{background:'#1c243b',text:'#f1f2f5',accent:'#9bb4ae'},spacing:8,effects:'reduced',sound:false,presentation:'inline',effectDefinition:{motif:'receipt',duration:1800,color:'#b8d8cf',background:'#162127',static:false,plain:false}},modules:{messages:{palette:{background:'#efe6d2',text:'#2b2219',accent:'#1f5f7a'}}}}}};
     const [r]=await T.forTargets(b,async p=>{await fight(p,7000);await T.shot(p,path.join(E,'after-palette-1920-14.png'));
        return p.evaluate(`(()=>{${CONTRAST}const fill=getComputedStyle(document.getElementById('message_log_div')).getPropertyValue('--custom-background').trim()||'#efe6d2';
            const hex=fill.replace('#','');const bg='rgb('+[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16)).join(',')+')';const low=[];
            for(const n of document.querySelectorAll('#message_log_div *')){if(!n.checkVisibility())continue;if(![...n.childNodes].some(c=>c.nodeType===3&&c.textContent.trim()))continue;const v=ratio(getComputedStyle(n).color,bg);if(v<4.5)low.push([n.className,n.textContent.trim().slice(0,30),v.toFixed(2)]);}
            return {bg,low:low.slice(0,8),lowCount:low.length};})()`);},{data:JSON.stringify(o),list:[PRIMARY]});
     assert.ok(!r.fail,`B6: ${r.fail}`);assert.equal(r.lowCount,0,`B6 low-contrast log text: ${JSON.stringify(r.low)}`);results.B6=r;}
    // B7: a spec-2 layout (as R21c left it) without the new panel.
    {const {ctx,p}=await L.open(b,{w:1920,h:1080,data:fx('8-mixed')});
     // A layout is stored once the player changes one; hiding Journal does that (as check-r16 and R21c do).
     await p.evaluate(()=>document.querySelector('[data-workspace-action=hide][data-module=records]')?.click());await p.waitForTimeout(300);
     const stored=await p.evaluate(()=>{const key=Object.keys(localStorage).find(k=>k.endsWith('.desktop.proto23-parity'));if(!key)return null;const v=JSON.parse(localStorage.getItem(key));v.spec=2;v.modules=v.modules.filter(m=>m.id!=='opponents');localStorage.setItem(key,JSON.stringify(v));return key;});
     assert.ok(stored,'a parity layout was stored');
     await p.reload({waitUntil:'domcontentloaded'});await p.locator('#loading_screen_play_button:not(.none_display)').click({noWaitAfter:true});await p.locator('#combat_div .fighter_div').first().waitFor({state:'attached'});await p.waitForTimeout(2500);
     const r=await p.evaluate(()=>({shown:!!document.querySelector('#opponent_list > .enemy-cards')&&document.getElementById('opponent_list').checkVisibility()}));
     assert.ok(r.shown,'spec-2 layout shows the list after migration');results.B7=r;await ctx.close();}
    // B8
    {const [r]=await T.forTargets(b,async p=>p.evaluate(()=>{const n=document.querySelector('.workspace-module[data-module="status-window"] [data-density]')||document.querySelector('[data-density]:not(#main_content)');return {density:n?.dataset.density||null};}),{data:awake,list:[PRIMARY]});
     assert.equal(r.density,'compact','status window starts compact');results.B8=r;}
} finally {await b.close();}
fs.writeFileSync(path.join(E,'check-r22b.json'),JSON.stringify(results,null,1));
console.log('check-r22b PASS B1-B8',JSON.stringify({B1:results.B1.map(r=>`${r.target}:${r.columns}`),B3:results.B3}));})().catch(e=>{console.error('check-r22b FAIL',e.message);process.exit(1);});
