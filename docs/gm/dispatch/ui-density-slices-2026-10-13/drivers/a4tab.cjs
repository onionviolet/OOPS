const L=require('./lib.cjs');const S=process.env.S;(async()=>{await L.launch();const {p}=await L.open({w:1366,h:768,zoom:1.5,play:false});await p.locator('#loading_screen_play_button:not(.none_display)').waitFor({timeout:15000});
await p.evaluate(()=>document.activeElement.blur());let n=0,id;for(;n<40;n++){await p.keyboard.press('Tab');id=await p.evaluate(()=>document.activeElement?.id);if(id==='loading_screen_play_button')break;}
await p.screenshot({path:S+'/shots/loading_911_focus_a4.png'});await p.keyboard.press('Space');await p.waitForTimeout(800);
console.log('tabs',n+1,'reached',id==='loading_screen_play_button','started',await p.evaluate(()=>getComputedStyle(document.getElementById('loading_screen')).visibility==='hidden'));await L.browser.close();})();
