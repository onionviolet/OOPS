// R21c before/after capture: the awakened status window in the parity shell.
// R4_URL=<after build> node r21c-capture.cjs awaken   -> evidence/r21c/awakened.save.txt (from the CH1 dormant fixture)
// R4_URL=<build> node r21c-capture.cjs shots <before|after>  -> evidence/r21c/<label>-<target>.png at 1920×1080 and the MacBook size
const T=require('./target-set.cjs');const {L}=T;const {fs,path}=L;
const E=path.join(__dirname,'evidence/r21c');fs.mkdirSync(E,{recursive:true});
const BASE=process.env.R4_URL||'http://127.0.0.1:19496';
const SAVE=path.join(E,'awakened.save.txt');
const DORMANT=path.join(__dirname,'../cheat-status-window-2026-10-13/fixtures/dormant_day3.save.txt');
const shown=p=>p.evaluate(()=>{const s=document.querySelector('.workspace-module[data-module="status-window"]');return !!s&&!s.hidden&&s.getBoundingClientRect().height>0;});
(async()=>{const [mode,label]=process.argv.slice(2);const b=await T.launch(600);
try{
    if(mode==='awaken'){
        const ctx=await b.newContext({viewport:{width:1920,height:1080}}),p=await ctx.newPage();
        await p.goto(BASE+'/style.css');await p.evaluate(s=>{localStorage.clear();localStorage.setItem('save data',s);},fs.readFileSync(DORMANT,'utf8'));
        await p.goto(BASE+'/',{waitUntil:'domcontentloaded'});await p.locator('#loading_screen_play_button:not(.none_display)').click();
        const t0=Date.now();while(!await shown(p)){if(Date.now()-t0>150000)throw Error('not awakened in 150s');await p.waitForTimeout(1000);}
        await p.evaluate(()=>localStorage.removeItem('save data'));await p.locator('#save_button').click();
        let s=null;for(let i=0;i<40&&!s;i++){s=await p.evaluate(()=>localStorage.getItem('save data'));if(!s)await p.waitForTimeout(100);}
        if(!s)throw Error('save not written');fs.writeFileSync(SAVE,s);console.log('awakened after',Math.round((Date.now()-t0)/1000),'s; save',s.length,'bytes');await ctx.close();
    } else if(mode==='migrate'){
        // UR17: a parity layout stored before R21c (spec 1, status window hidden and placed after vitals)
        // unhides it once and moves it after the stat sheet; a later manual hide would be kept.
        const data=fs.readFileSync(SAVE,'utf8');let {ctx,p}=await L.open(b,{w:1920,h:1080,data});
        // A layout is stored once the player changes one; hiding Journal does that (as check-r16 does).
        await p.evaluate(()=>document.querySelector('[data-workspace-action=hide][data-module=records]').click());await p.waitForTimeout(300);
        const key=await p.evaluate(()=>Object.keys(localStorage).find(k=>k.endsWith('.proto23-parity')));
        if(!key)throw Error('no stored parity layout');
        const old=await p.evaluate(k=>{const l=JSON.parse(localStorage.getItem(k));l.spec=1;const i=l.modules.findIndex(m=>m.id==='status-window'),[sw]=l.modules.splice(i,1);sw.hidden=true;
            l.modules.splice(l.modules.findIndex(m=>m.id==='vitals')+1,0,sw);l.modules.forEach((m,n)=>m.order=n);localStorage.setItem(k,JSON.stringify(l));return l.modules.slice(0,3).map(m=>m.id+(m.hidden?':hidden':''));},key);
        await p.goto(BASE+'/?test_hooks=1',{waitUntil:'domcontentloaded'});await p.locator('#loading_screen_play_button:not(.none_display)').click({noWaitAfter:true});await p.waitForTimeout(1500);
        const now=await p.evaluate(k=>{const l=JSON.parse(localStorage.getItem(k)||'null');return{spec:l?.spec,stored:l?.modules.filter(m=>['vitals','shell-character','status-window'].includes(m.id)).map(m=>m.id+(m.hidden?':hidden':'')),
            region:[...document.querySelector('[data-region="player"]').children].filter(n=>!n.hidden).map(n=>n.dataset.module)};},key);
        console.log('before',JSON.stringify(old),'after',JSON.stringify(now));
        const ok=now.region.join()==='vitals,shell-character,status-window';fs.writeFileSync(path.join(E,'migrate.json'),JSON.stringify({key,old,now,ok},null,1));console.log(ok?'PASS migrate':'FAIL migrate');await ctx.close();
    } else if(mode==='shots'){
        const data=fs.readFileSync(SAVE,'utf8'),out=[];
        for(const t of T.targets().filter(t=>t.font===14&&['1920','mbp'].includes(t.name))){
            const {ctx,p}=await L.open(b,{w:t.w,h:t.h,dpr:t.dpr,data});await p.waitForTimeout(800);
            const geo=await p.evaluate(()=>{const s=document.querySelector('.workspace-module[data-module="status-window"]');const r=s?.getBoundingClientRect();
                return{region:s?.parentElement?.dataset.region||null,parked:s?.dataset.compositionParked,visible:!!s&&!s.hidden&&r.height>0,top:r?Math.round(r.top):null,height:r?Math.round(r.height):null,
                    pageScroll:document.documentElement.scrollHeight>innerHeight+1};});
            await T.shot(p,path.join(E,`${label}-${T.tag(t)}.png`));out.push({target:T.tag(t),...geo,errors:p.errors});console.log(label,T.tag(t),JSON.stringify(geo));await ctx.close();
        }
        fs.writeFileSync(path.join(E,`${label}.json`),JSON.stringify(out,null,1));
    }
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1);});
