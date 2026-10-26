const $=s=>document.querySelector(s);
const experiments=await fetch('experiments.json').then(r=>r.json());
const inputs=await fetch('built/INPUTS.json').then(r=>r.json());
let study=experiments.find(x=>x.id===new URLSearchParams(location.search).get('study'))||experiments[0],frames=[],snapshot=null,serial=0,queue=Promise.resolve();
const pending=new Map();
function options(select,items){select.replaceChildren(...items.map(item=>Object.assign(document.createElement('option'),{value:item.id,textContent:item.label||item.title})));}
options($('#experiment'),experiments);
$('#experiment').value=study.id;
if(['launch','character','native-character'].includes(study.id))$('#viewport').value='1920x1080';
function status(text){$('#status').textContent=text;}
function run(fn){queue=queue.then(fn).catch(error=>status(`Review error: ${error.message}`));return queue;}
function command(frame,command,value,variant){return new Promise((resolve,reject)=>{
  const id=++serial,timer=setTimeout(()=>{pending.delete(id);reject(Error('Fixture did not respond. Reload the workbench.'));},20000);
  pending.set(id,{resolve,reject,timer,source:frame.contentWindow});
  frame.contentWindow.postMessage({type:'mockup:command',id,command,value,variant},location.origin);
});}
window.addEventListener('message',event=>{
  if(event.origin!==location.origin)return;
  const frame=frames.find(f=>f.contentWindow===event.source);if(!frame)return;
  if(event.data?.type==='mockup:ready'){frame.readyResolve?.();return;}
  if(event.data?.type==='mockup:reply'){
    const item=pending.get(event.data.id);if(!item||item.source!==event.source)return;
    clearTimeout(item.timer);pending.delete(event.data.id);event.data.error?item.reject(Error(event.data.error)):item.resolve(event.data.snapshot);return;
  }
  if(event.data?.type==='mockup:state')run(async()=>{
    snapshot=event.data.snapshot;
    for(const other of frames)if(other!==frame)await command(other,'restore',snapshot,other.variant);
    status('Same fixture state · switching layouts spends nothing');
  });
});
function geometry(){
  const [width,height]=$('#viewport').value.split('x').map(Number),stage=$('#stage');
  const fit=$('#fit').checked,count=frames.length||1;
  const scale=fit?Math.min(1,(stage.clientWidth-24-16*(count-1))/(width*count),(stage.clientHeight-54)/height):1;
  for(const frame of frames){Object.assign(frame.style,{width:`${width}px`,height:`${height}px`,transform:`scale(${scale})`});Object.assign(frame.parentElement.style,{width:`${width*scale+2}px`,height:`${height*scale+32}px`});}
  $('#scale-label').textContent=fit?`Fit preview · ${Math.round(scale*100)}% display scale · fixture ${width} × ${height}. Use actual size for readability.`:`Actual size · ${width} × ${height} CSS px · scroll the review stage to inspect.`;
}
async function mount(){
  $('#variant').disabled=$('#compare').checked;
  frames.forEach(f=>f.remove());$('#canvases').replaceChildren();frames=[];
  const variants=$('#compare').checked?study.variants:[study.variants.find(v=>v.id===$('#variant').value)];
  for(const variant of variants){
    const card=document.createElement('section');card.className='canvas';
    const caption=document.createElement('div');caption.className='caption';caption.textContent=variant.label+' · interactive fixture';
    const frame=document.createElement('iframe');frame.title=variant.label;frame.variant=variant.id;
    // Unique loopback origin from serve.mjs; native studies use isolated startup/storage, never a personal origin.
    frame.setAttribute('sandbox','allow-scripts allow-same-origin');
    const ready=new Promise(resolve=>frame.readyResolve=resolve);
    frames.push(frame);card.append(caption,frame);$('#canvases').append(card);frame.src=study.entry;geometry();
    await Promise.race([ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('Fixture failed to load')),60000))]);
    await command(frame,'text',Number($('#text').value));
    if(snapshot)await command(frame,'restore',snapshot,variant.id);
    else{await command(frame,'variant',variant.id);snapshot=await command(frame,'capture');}
  }
  geometry();status('Ready · isolated fixture, manual clock');
}
async function refreshFreshness(){
  const banner=$('#freshness');
  try{const result=await fetch('freshness.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Unavailable');return r.json();});const current=result.studies.find(s=>s.id===study.id);banner.textContent=current?.message||'Study not registered · freshness unverified';banner.dataset.state=current?.status||'unverified';banner.title=(current?.changed||[]).join('\n');}
  catch{banner.textContent='Freshness check unavailable · do not assume this is the current UI';banner.dataset.state='unverified';}
}
setInterval(refreshFreshness,15000);
window.addEventListener('focus',refreshFreshness);
function describe(){
  refreshFreshness();
  const native=study.id==='native-character';$('#compare').disabled=native;if(native)$('#compare').checked=false;$('#compare').title=native?'Switch Layout to compare the same running native state. Simultaneous native command mirroring is not implemented.':'';
  if(native)fetch('built/native-character/INPUTS.json').then(r=>r.json()).then(m=>$('#revision').textContent='Native bundle '+m.bundleSha256.slice(0,12));
  options($('#variant'),study.variants);options($('#scenario'),study.scenarios);
  $('#brief').replaceChildren();
  for(const [label,key]of [['Question','question'],['Try this','task'],['Surface','surface'],['Fixture','fixture'],['Limits','limits']]){const p=document.createElement('p'),b=document.createElement('strong');b.textContent=label+': ';p.append(b,document.createTextNode(study[key]));$('#brief').append(p);}
}
$('#experiment').onchange=()=>run(async()=>{study=experiments.find(x=>x.id===$('#experiment').value);snapshot=null;if(['launch','character','native-character'].includes(study.id))$('#viewport').value='1920x1080';describe();await mount();});
$('#variant').onchange=()=>run(async()=>{
  snapshot=await command(frames[0],'capture');
  if(!$('#compare').checked){frames[0].variant=$('#variant').value;await command(frames[0],'variant',$('#variant').value);frames[0].title=study.variants.find(v=>v.id===$('#variant').value).label;frames[0].parentElement.querySelector('.caption').textContent=frames[0].title+' · interactive fixture';}
});
$('#compare').onchange=()=>run(async()=>{snapshot=await command(frames[0],'capture');await mount();});
$('#scenario').onchange=()=>run(async()=>{
  snapshot=await command(frames[0],'scenario',$('#scenario').value);
  for(const frame of frames.slice(1))await command(frame,'restore',snapshot,frame.variant);
  status('Scenario reset · synthetic fixture');
});
$('#reset').onclick=()=>$('#scenario').onchange();
$('#text').onchange=()=>run(async()=>{for(const frame of frames)await command(frame,'text',Number($('#text').value));geometry();});
$('#viewport').onchange=geometry;$('#fit').onchange=geometry;
$('#step').onclick=()=>run(async()=>{snapshot=await command(frames[0],'step');for(const frame of frames.slice(1))await command(frame,'restore',snapshot,frame.variant);});
$('#details').onclick=()=>{const open=$('#brief').hidden;$('#brief').hidden=!open;$('#details').setAttribute('aria-expanded',String(open));geometry();};
$('#export').onclick=()=>run(async()=>{
  snapshot=await command(frames[0],'capture');
  const review={schema:1,study:study.id,question:study.question,viewport:$('#viewport').value,textPx:Number($('#text').value),fitPreview:$('#fit').checked,compare:$('#compare').checked,variants:frames.map(f=>f.variant),revision:study.id==='native-character'?(await fetch('built/native-character/INPUTS.json').then(r=>r.json())).bundleSha256:inputs.revision,fixture:study.fixture,limits:study.limits,acceptance:'Unreviewed proposal. Export does not record human acceptance.',snapshot};
  const url=URL.createObjectURL(new Blob([JSON.stringify(review,null,2)+'\n'],{type:'application/json'}));
  const link=Object.assign(document.createElement('a'),{href:url,download:`yair-mockup-${study.id}-${inputs.revision}.json`});link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status('Review exported · fixture and limits included');
});
new ResizeObserver(geometry).observe($('#stage'));
$('#revision').textContent=`Build ${inputs.revision}`;
describe();await run(mount);
