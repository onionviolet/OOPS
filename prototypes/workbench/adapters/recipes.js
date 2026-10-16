// Appended inside the pinned recipe module so this adapter uses its one state owner.
// Protocol: same-origin, parent/source-checked messages; see docs/MOCKUP_SYSTEM.md.
state.running=false;
$('#pause-work').hidden=true;
$('#work-progress').textContent='0 steps · manual fixture clock';
$('.focus .region-body p.muted').textContent='Select a known recipe. Browsing and inspection preserve work state. Use Step fixture to advance the simulated routine explicitly.';
$('#log').lastElementChild.querySelector('span').textContent='Practice fixture paused. Use Step fixture for manual progress.';
let wbApplying=false;
let wbEvents=[...$('#log').children].map(n=>({text:n.querySelector('span')?.textContent||n.textContent,snapshot:null,step:0}));
const wbLog=log;
log=function(text,snapshot=null){wbEvents.push({text,snapshot:structuredClone(snapshot),step:state.steps});wbLog(text,snapshot);};
const wbBaseNames=recipes.map(r=>r.name);
function wbNames(long){recipes.forEach((r,i)=>r.name=long?`${wbBaseNames[i]} · carefully prepared with preserved mountain herbs (fictional label)`:wbBaseNames[i]);}
function wbCapture(){
  state.listScroll=$('.rows')?.scrollTop??state.listScroll;
  return {schema:1,state:structuredClone(state),events:structuredClone(wbEvents),
    scroll:[...document.querySelectorAll('.region-body,.rows,.summary-body,.full-body,.craft_detail_body')].map(n=>({key:n.id||n.className,top:n.scrollTop})),
    focus:document.activeElement?.dataset.restore||null};
}
function wbPublish(){if(!wbApplying)parent.postMessage({type:'mockup:state',snapshot:wbCapture()},location.origin);}
function wbRestore(snapshot,variant,restoreFocus=false){
  if(snapshot?.schema!==1||!snapshot.state||!Array.isArray(snapshot.events))throw Error('Unsupported fixture snapshot');
  wbNames(snapshot.state.scenario==='long');
  Object.assign(state,structuredClone(snapshot.state),{variant,running:false});
  wbEvents=structuredClone(snapshot.events);
  $('#log').replaceChildren();
  const step=state.steps,unread=state.unread;
  for(const event of wbEvents){state.steps=event.step;wbLog(event.text,event.snapshot);}
  state.steps=step;state.unread=unread;
  $('#unread').textContent=unread?`${unread} unread`:'';
  render();
  $('#work-progress').textContent=`${step} steps · manual fixture clock`;
  requestAnimationFrame(()=>{
    for(const item of snapshot.scroll||[]){const el=[...document.querySelectorAll('.region-body,.rows,.summary-body,.full-body,.craft_detail_body')].find(n=>(n.id||n.className)===item.key);if(el)el.scrollTop=item.top;}
    if(restoreFocus)[...document.querySelectorAll('[data-restore]')].find(n=>n.dataset.restore===snapshot.focus)?.focus({preventScroll:true});
  });
}
function wbScenario(scenario){
  wbNames(scenario==='long');state.scenario=scenario;state.steps=0;state.running=false;wbEvents=[];reset();
  if(scenario==='crowded'){
    for(let i=1;i<=60;i++)state.stock[`Sample ingredient ${String(i).padStart(2,'0')} · synthetic stock`]=i;
    for(let i=1;i<=40;i++)log(`Fixture activity ${i}: routine preparation, no materials consumed.`);
    render();
  }
  $('#work-progress').textContent='0 steps · manual fixture clock';
}
window.addEventListener('message',event=>{
  if(event.source!==parent||event.origin!==location.origin||event.data?.type!=='mockup:command')return;
  const {id,command,value,variant}=event.data;
  wbApplying=true;
  try{
    if(command==='restore')wbRestore(value,variant);
    else if(command==='variant'){const snapshot=wbCapture();wbRestore(snapshot,value,true);}
    else if(command==='scenario')wbScenario(value);
    else if(command==='text')document.documentElement.style.fontSize=`${value}px`;
    else if(command==='step'){state.steps++;$('#work-progress').textContent=`${state.steps} steps · manual fixture clock`;log('Manual fixture step. No recipe materials consumed.');}
    else if(command!=='capture')throw Error('Unknown fixture command');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      wbApplying=false;parent.postMessage({type:'mockup:reply',id,snapshot:wbCapture()},location.origin);
    }));
  }catch(error){wbApplying=false;parent.postMessage({type:'mockup:reply',id,error:error.message},location.origin);}
});
for(const type of ['click','input','change','keyup','focusin'])document.addEventListener(type,()=>{if(!wbApplying)requestAnimationFrame(()=>requestAnimationFrame(wbPublish));});
document.addEventListener('scroll',()=>{if(wbApplying)return;clearTimeout(window.wbScrollTimer);window.wbScrollTimer=setTimeout(wbPublish,80);},true);
parent.postMessage({type:'mockup:ready'},location.origin);
