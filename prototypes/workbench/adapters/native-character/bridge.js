// Mockup-owned bootstrap. This bundle is served only inside a disposable workbench origin.
(() => {
 const url=new URL(location);if(url.searchParams.has('import_probe'))return;url.searchParams.set('test_hooks','1');history.replaceState(null,'',url);
 const fixture=JSON.parse((()=>{const r=new XMLHttpRequest();r.open('GET','fixture.json',false);r.send();return r.responseText;})());
 const stored=sessionStorage.getItem('native-study-restore');
 if(['off','reduced','full'].includes(url.searchParams.get('effects')))fixture.customization.profiles.Default.settings.effects=url.searchParams.get('effects');
 if(url.searchParams.get('fixture')==='home'&&!stored)localStorage.removeItem('save data');else localStorage.setItem('save data',stored||JSON.stringify(fixture));
 let variant=sessionStorage.getItem('native-study-variant')||'baseline',text=Number(sessionStorage.getItem('native-study-text')||14),ready=false;
 const tell=(type,extra={})=>parent.postMessage({type,...extra},location.origin);
 const snapshot=()=>{return {save:window.simulationTestHooks.snapshot(),scene:document.querySelector('#workspace_navigation select')?.value||'game',recipe:document.querySelector('#crafting_detail [data-craft-commit]')?.closest('[data-recipe_id]')?.dataset.recipe_id||null,fixture:'mid-cook-2026-10-26'};};
 const style=()=>{document.documentElement.dataset.studyTreatment=variant;document.documentElement.dataset.studyText=String(text);document.documentElement.style.setProperty('--study-text',text+'px');document.body.style.fontSize=text+'px';for(const k of ['--ui-type-body','--shell-context-size'])document.documentElement.style.setProperty(k,text+'px','important');sessionStorage.setItem('native-study-variant',variant);sessionStorage.setItem('native-study-text',text);};
 async function route(scene){const sel=document.querySelector('#workspace_navigation select');if(sel&&[...sel.options].some(o=>o.value===scene)){sel.value=scene;sel.dispatchEvent(new Event('change',{bubbles:true}));}}
 window.addEventListener('message',async e=>{if(e.origin!==location.origin||e.source!==parent||e.data?.type!=='mockup:command')return;
 const {id,command,value}=e.data;try{
 if(command==='variant'){variant=value;style();}
 if(command==='text'){text=value;style();}
 if(command==='capture'){} // Native state; no scripted success.
 if(command==='restore'){variant=e.data.variant||variant;style();const current=snapshot();if(JSON.stringify(current.save)!==JSON.stringify(value.save)){sessionStorage.setItem('native-study-restore',JSON.stringify(value.save));sessionStorage.setItem('native-study-pending',JSON.stringify({id,scene:value.scene}));location.reload();return;}await route(value.scene);}
 if(command==='scenario'){sessionStorage.removeItem('native-study-restore');sessionStorage.setItem('native-study-pending',JSON.stringify({id}));url.searchParams.set('fixture',value==='home'?'home':'mid');location.href=url;return;}
 if(command==='step')window.advanceTicks(1);
 tell('mockup:reply',{id,snapshot:snapshot()});
 }catch(error){tell('mockup:reply',{id,error:error.message});}});
 const timer=setInterval(()=>{
 if(!window.simulationTestHooks||!window.simulationTestHooks.saveStatus().ownsSave)return;
 window.simulationTestHooks.pause();const play=document.querySelector('#loading_screen_play_button');if(play && getComputedStyle(play).display!=='none')play.click();
 const confirm=document.querySelector('#hero_creation_panel_confirmation');if(confirm && confirm.offsetParent!==null)confirm.click();
 const loading=document.querySelector('#loading_screen');if(loading && getComputedStyle(loading).visibility!=='hidden')return;
 clearInterval(timer);window.simulationTestHooks.pause();style();ready=true;const pending=JSON.parse(sessionStorage.getItem('native-study-pending')||'null');sessionStorage.removeItem('native-study-pending');if(pending){route(pending.scene);tell('mockup:reply',{id:pending.id,snapshot:snapshot()});}tell('mockup:ready');
 },50);
})();
