// Loading screen at emulated zoom: PLAY visibility, cover, toolbar, keyboard reach (real key presses).
const L=require('./lib.cjs');const S=process.env.S;const TAG=process.env.TAG||'a4';
(async()=>{await L.launch();for(const [w,h,z] of [[1366,768,1.5],[400,800,1],[1366,768,1]]){
 const {p,ctx}=await L.open({w,h,zoom:z,play:false});await p.locator('#loading_screen_play_button:not(.none_display)').waitFor({timeout:15000});await p.waitForTimeout(300);
 const o={vp:await p.evaluate(()=>[innerWidth,innerHeight,devicePixelRatio])};
 o.play=await L.vis(p.locator('#loading_screen_play_button'));
 o.toolbarVisible=await p.evaluate(()=>{const t=document.querySelector('.workspace-toolbar');if(!t)return 'none';const r=t.getBoundingClientRect();return getComputedStyle(t).display!=='none'&&r.width>0&&r.height>0;});
 await p.screenshot({path:`${S}/shots/loading_${w}x${h}@${z*100}_${TAG}.png`});
 // keyboard: fresh reload, Tab until PLAY focused, then Enter
 await p.reload({waitUntil:'domcontentloaded'});await p.locator('#loading_screen_play_button:not(.none_display)').waitFor({timeout:15000});await p.waitForTimeout(300);
 const keys=[];let focused=await p.evaluate(()=>document.activeElement?.id);if(focused==='loading_screen_play_button')keys.push('(autofocus)');
 for(let i=0;i<30&&focused!=='loading_screen_play_button';i++){await p.keyboard.press('Tab');keys.push('Tab');focused=await p.evaluate(()=>document.activeElement?.id);}
 if(focused==='loading_screen_play_button'){await p.keyboard.press('Enter');keys.push('Enter');}
 await p.waitForTimeout(1200);o.keys=keys.join(' ');o.afterKeyboard=await p.evaluate(()=>({loadingHidden:getComputedStyle(document.getElementById('loading_screen')).visibility==='hidden',heroCreation:getComputedStyle(document.getElementById('hero_creation_panel')).display!=='none'&&getComputedStyle(document.getElementById('hero_creation_panel')).visibility!=='hidden'}));
 console.log(`${w}x${h}@${z}`,JSON.stringify(o));await ctx.close();}await L.browser.close();})();
