import {definePanel} from './panel_kit.js';
import {renderCraftingDetail} from './crafting_detail.js';
const node=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
// Expanded center workspace view. The shared center controller owns Back and Esc.
export function createCraftingHome({read,quote,execute,forecast}) {
 const panel=node('section');panel.id='crafting_engine_home';panel.className='expedition_panel';panel.dataset.surfaceType='expanded-center';
 const title=node('h2','Village experiments'),description=node('p','Gather herbs and river salt on the Village common verge, select carried materials, then try a small steeped batch. Salty batches bind toxin when drunk. Original frontier trial. Properties act before you know them.'),harvest=node('button','Gather from the Village verge'),stock=node('div'),detail=node('div'),history=node('p'),grudge=node('p'),products=node('div'),notebook=node('div'),notice=node('p');
 harvest.type='button';harvest.id='crafting_gather';detail.dataset.craftDetail='';notice.setAttribute('role','status');
 history.dataset.craftForecast='';grudge.dataset.craftGrudge='';notebook.dataset.craftNotebook='';
 const shelf=node('div'),refs=node('div'),sample=node('div'),method=node('select'),methodHint=node('p');method.id='crafting_method';method.setAttribute('aria-label','Method');
  panel.append(title,description,harvest,shelf,refs,method,methodHint,stock,sample,detail,history,grudge,products,notebook,notice);
 let selected=new Map(),signature='',lastQuote;
 const strength=node('select');strength.id='crafting_steep_level';strength.setAttribute('aria-label','Steep level');
 for(const level of [1,2,3])strength.append(Object.assign(node('option',`Steep level ${level}`),{value:String(level)}));
  strength.onchange=method.onchange=()=>{signature='';render();};panel.insertBefore(strength,method);
 function run(q){try{const plan=execute(q);notice.textContent=plan?.outcome?.text??(q.request.type==='harvest'?'Gathered materials stored in your inventory.':q.request.type==='craft'?(plan.failure?plan.failure.reason:'The exact materials became a preparation. Drink to observe it.'):'Preparation used. Its observed effects are recorded.');}catch(e){notice.textContent=e.message;}signature='';render();}
 harvest.onclick=()=>run(quote({type:'harvest'}));
 function render(){
  const view=read(),next=JSON.stringify([view,[...selected]]);if(next===signature)return;signature=next;
  const allowed=view.world==='base.frontier'&&view.location==='Village';panel.hidden=!allowed;
  if(!allowed)return;
  const gather=quote({type:'harvest'});harvest.disabled=!gather.eligible;harvest.title=gather.reason;
  const act=(label,request,id)=>{const b=node('button',label),q=quote(request);b.type='button';b.dataset[id]=request.ref??request.key;b.disabled=!q.eligible;b.title=q.reason;b.onclick=()=>run(q);return b;};
  shelf.replaceChildren(node('h3','Village shelf'));
  for(const o of view.shelf??[]){const row=node('div');row.append(node('p',`${o.name}: ${o.blurb}`),act('Take a copy',{type:'acquire',ref:o.id},'shelfTake'));shelf.append(row);}
  refs.replaceChildren(node('h3','Carried books and slates'));
  for(const r of view.references??[]){const row=node('div');row.append(node('p',`${r.name} · ${r.count} carried${r.read?' · read':''}`));
   if(r.mode==='learn')row.append(act('Study and learn',{type:'learn',key:r.key},'refLearn'));if(r.mode==='training')row.append(act('Read',{type:'read',key:r.key},'refRead'));
   if(r.mode==='access')row.append(node('p','Method available while carried.'));row.append(act('Put back on shelf',{type:'return',key:r.key},'refReturn'));refs.append(row);}
  if(!view.references?.length)refs.append(node('p','Nothing carried. Take a copy from the shelf.'));
  const chosen=method.value;method.replaceChildren(Object.assign(node('option','Free experiment (no method)'),{value:''}));
  for(const m of view.methods??[])method.append(Object.assign(node('option',`Follow ${m.name} (${m.via.map(v=>v==='learned'?'learned':'from book').join(', ')})`),{value:m.id}));
  methodHint.textContent='';
  method.value=(view.methods??[]).some(m=>m.id===chosen)?chosen:'';
  const chosenMethod=(view.methods??[]).find(m=>m.id===method.value);
  methodHint.textContent=chosenMethod?`${chosenMethod.name} needs: ${chosenMethod.slots.map(sl=>`${sl.tags.join(' ')} (${sl.qty[0]}-${sl.qty[1]})`).join(' and ')}.`:'';
  stock.replaceChildren(node('h3','Carried materials'));
  for(const [key]of selected)if(!view.materials.some(m=>m.key===key))selected.delete(key);
  for(const material of view.materials){const label=node('label'),check=node('input'),qty=node('input');check.type='checkbox';check.checked=selected.has(material.key);check.dataset.craftMaterial=material.key;
   qty.type='number';qty.min='1';qty.max=String(material.count);qty.value=String(selected.get(material.key)??1);qty.setAttribute('aria-label',`Quantity of ${material.name}`);qty.className='crafting-trial-quantity';
   check.onchange=()=>{if(check.checked)selected.set(material.key,Number(qty.value));else selected.delete(material.key);signature='';render();};qty.onchange=()=>{if(check.checked)selected.set(material.key,Number(qty.value));signature='';render();};
   label.className='crafting-trial-material';label.append(check,node('span',`${material.name} · ${material.count} carried`),qty);stock.append(label);
   // Known, tested-and-none and untried are three different states (G36); hidden properties never appear.
   const props=node('p',(material.props??[]).map(x=>`${x.label[0].toUpperCase()+x.label.slice(1)}: ${x.state==='known'?x.value:x.state==='known-none'?'none':'untried'}`).join(' · '));props.className='crafting-trial-properties';props.dataset.craftProps=material.key;stock.append(props);
  }
  if(!view.materials.length)stock.append(node('p','Gather here to begin. Exact lots also appear in Inventory.'));
  const request={type:'craft',inputs:[...selected].map(([key,qty])=>({key,qty})),process:[{op:'steep',level:Number(strength.value)}],...(method.value?{recipe:method.value}:{})};lastQuote=quote(request);
  renderCraftingDetail(detail,{title:`Steep selected materials (level ${strength.value})`,requirements:request.inputs.map(i=>({label:view.materials.find(m=>m.key===i.key)?.name??'Selected material',have:view.materials.find(m=>m.key===i.key)?.count??0,need:i.qty})),output:{name:'Unidentified herbal preparation',count:1},effects:[],chance:100,station:'Village common bench',xp:'Observation only',attempts:lastQuote.eligible?1:0,available:lastQuote.eligible,blocked_reason:lastQuote.reason},
   {onCommit:()=>run(lastQuote),onBlocked:()=>{notice.textContent=lastQuote.reason;}});
  const past=request.inputs.length?forecast(request):{verdict:'untried'};history.hidden=past.verdict==='untried';history.dataset.verdict=past.verdict;
  history.textContent=past.verdict==='known-fail'?`Tried before: this exact steep of these materials came to nothing ${past.tries===1?'once':past.tries+' times'}${past.reasons.includes('thin')?', because the steep ran too thin':past.reasons.includes('reacted')?', after the materials reacted':', with nothing reacting'}${Object.keys(past.residue).length?`; left over: ${Object.entries(past.residue).map(([a,n])=>`${a} ${n}`).join(', ')}`:''}.`:past.verdict==='near'?'You have failed with these materials under another steep; a different steep may differ.':'';
  grudge.hidden=!(view.grudge>0);grudge.textContent=view.grudge>0?`The verge keepers grumble about herbs wasted on thin steeps (${view.grudge}). It eases by one each season.`:'';
  sample.replaceChildren(node('h3','Examine a sample'));
  for(const m of view.examinable??[]){const row=node('div');row.append(node('p',`${m.name}: costs ${m.cost} sample${m.cost>1?'s':''}${m.misses?` (${m.misses} failed)`:''}`),act('Examine',{type:'examine',key:m.key},'craftExamine'));sample.append(row);}
  if(!view.examinable?.length)sample.append(node('p','Gather a material to examine it.'));
  // This bounded trial commits one selected batch. There is no misleading bulk quote.
  for(const b of detail.querySelectorAll('[data-craft-amount]'))b.remove();
  notebook.replaceChildren(node('h3','Experiment notebook'));
  const depth=view.depth??{tolerance:[],deductions:[],trials:0};
  if(depth.tolerance.length)notebook.append(Object.assign(node('p',`Body still dulled to: ${depth.tolerance.map(t=>`${t.effect} ${t.level}/${t.overdoseAt}`).join(' · ')}. Drinking past the limit sours the body instead.`),{className:'crafting-trial-tolerance'}));
  if(!depth.deductions.length)notebook.append(node('p',depth.trials?'Nothing has shown an effect yet.':'Drink a preparation to start a record.'));
  for(const d of depth.deductions){const row=node('p',`${d.material} → ${d.effect}: ${d.status} (seen ${d.hits} of ${d.withCount} trials with it)`);row.dataset.craftDeduction=d.status;notebook.append(row);}
  products.replaceChildren(node('h3','Your preparations'));
  for(const p of view.products){const row=node('div'),use=node('button','Drink one');use.type='button';use.dataset.craftedUse=p.key;const q=quote({type:'use',key:p.key});use.disabled=!q.eligible;use.title=q.reason;use.onclick=()=>run(q);const label=node('p',`${p.composition} · ${p.count} carried`);label.dataset.craftComposition='';row.append(label,use);
   if(p.effects.length)row.append(node('p',p.effects.map(e=>`Observed ${e.effect}: ${e.value}`).join(' · ')));const named=node('p',p.derived??p.name??'');named.dataset.craftDerived='';row.prepend(named);products.append(row);
  }
 }
 definePanel({id:'herbal-experiments',title:'Village experiments',role:'actions',node:panel,home:document.getElementById('main_content'),defaultDock:'center',
  discovered:()=>read().discovered,eligible:()=>{const v=read();return !v.blocked&&v.world==='base.frontier'&&v.location==='Village';},unavailableReason:()=>read().blocked||'Return to Village to experiment.'});
 render();return {render};
}
