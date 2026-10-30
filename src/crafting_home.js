import {treatmentCapacity} from './craft_body_treatment.js';
import {definePanel} from './panel_kit.js';
import {renderCraftingDetail} from './crafting_detail.js';
import {infoRow,chip,reasonLine,labelControl} from './ui/panel_sections.js';
const node=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
// Expanded center workspace view. The shared center controller owns Back and Esc.
export function createCraftingHome({read,quote,execute,forecast}) {
 const panel=node('section');panel.id='crafting_engine_home';panel.className='expedition_panel';panel.dataset.surfaceType='expanded-center';
 const title=node('h2','Village experiments'),description=node('details'),harvest=node('button','Gather from the Village verge'),stock=node('div'),detail=node('div'),history=node('p'),grudge=node('p'),products=node('div'),notebook=node('details'),notice=node('p');
 description.append(node('summary','About these trials'),node('p','Gather herbs and river salt on the Village common verge, select carried materials, then try a small steeped batch. Salty batches bind toxin when drunk. Original frontier trial. Properties act before you know them.'));harvest.type='button';const harvestWhy=reasonLine('');harvestWhy.hidden=true;harvest.id='crafting_gather';detail.dataset.craftDetail='';notice.setAttribute('role','status');
 history.dataset.craftForecast='';grudge.dataset.craftGrudge='';notebook.dataset.craftNotebook='';
 const shelf=node('div'),refs=node('div'),sample=node('div'),method=node('select'),methodHint=node('p');method.id='crafting_method';method.setAttribute('aria-label','Method');
  panel.append(title,description,harvest,harvestWhy,shelf,refs,method,methodHint,stock,sample,detail,history,grudge,products,notebook,notice);
 let selected=new Map(),signature='',lastQuote;
 const layered=node('input');layered.type='checkbox';layered.id='crafting_layered';const mode=node('label');mode.append(layered,node('span','Layered brazier'));panel.insertBefore(mode,stock);
 const tablet=node('input');tablet.type='checkbox';tablet.id='crafting_tablet';const tabletLabel=node('label');tabletLabel.append(tablet,node('span','Body-conditioning tablet'));panel.insertBefore(tabletLabel,stock);tablet.onchange=()=>{if(tablet.checked)layered.checked=true;render();};
 const timed=node('input');timed.type='checkbox';timed.id='crafting_timed';const timedLabel=node('label');timedLabel.append(timed,node('span','Hold on the brazier'));panel.insertBefore(timedLabel,stock);timed.onchange=()=>{if(timed.checked)layered.checked=true;render();};
 const firing=node('div');firing.dataset.craftFiring='';panel.insertBefore(firing,stock);
 const heat=node('input');heat.type='number';heat.min='1';heat.max='12';heat.value='4';heat.id='crafting_heat';heat.setAttribute('aria-label','Brazier heat');panel.insertBefore(heat,stock);layered.onchange=heat.oninput=heat.onchange=()=>render();
 const strength=node('select');strength.id='crafting_steep_level';strength.setAttribute('aria-label','Steep level');
 for(const level of [1,2,3])strength.append(Object.assign(node('option',`Steep level ${level}`),{value:String(level)}));
 strength.oninput=strength.onchange=method.onchange=()=>render();panel.insertBefore(strength,stock);
 // One labelled form (UR79): method and process on a grid, the long explanations behind one disclosure.
 const form=node('section');form.className='crafting-trial-form';form.append(node('h3','Try a batch'));
 const fields=node('div');fields.className='ui-field-grid crafting-trial-fields';fields.append(labelControl(method,'Method'),labelControl(strength,'Steep level'),labelControl(heat,'Brazier heat'));
 const checks=node('div');checks.className='crafting-trial-checks';checks.append(mode,tabletLabel,timedLabel);
 const optionHelp=node('details');optionHelp.append(node('summary','What the options do'),node('p','Layered brazier formulation: one Charcoal; ingredients react in selection order.'),node('p','Body-conditioning tablet: press one (layered law).'),node('p','Hold on the brazier: 6 played minutes; late collection adds heat.'));
 form.append(fields,methodHint,checks,optionHelp);panel.insertBefore(form,firing);
 function run(q){try{const plan=execute(q);notice.textContent=plan?.outcome?.text??(q.request.type==='harvest'?'Gathered materials stored in your inventory.':q.request.type==='treatment'?'The quoted materials are committed to the treatment.':q.request.type==='craft'?(plan.failure?plan.failure.reason:'The exact materials became a preparation. Drink to observe it.'):'Preparation used. Its observed effects are recorded.');}catch(e){notice.textContent=e.message;}signature='';render();}
 harvest.onclick=()=>run(quote({type:'harvest'}));
 function render(){
  const view=read(),next=JSON.stringify([view,[...selected],strength.value,method.value,layered.checked,heat.value,tablet.checked,timed.checked]);if(next===signature)return;signature=next;
  const allowed=view.world==='base.frontier'&&view.location==='Village';panel.hidden=!allowed;
  if(!allowed)return;
  const gather=quote({type:'harvest'});harvest.disabled=!gather.eligible;harvest.title=gather.reason;harvestWhy.textContent=gather.eligible?'':gather.reason;harvestWhy.hidden=gather.eligible||!gather.reason;
  const act=(label,request,id)=>{const b=node('button',label),q=quote(request);b.type='button';b.dataset[id]=request.ref??request.key;b.disabled=!q.eligible;b.title=q.reason;b.onclick=()=>run(q);return b;};
  shelf.replaceChildren(node('h3','Village shelf'));
  for(const o of view.shelf??[]){const b=act('Take a copy',{type:'acquire',ref:o.id},'shelfTake');shelf.append(infoRow({label:o.name,actions:[b,...(b.disabled&&b.title?[reasonLine(b.title)]:[])],more:o.blurb,moreLabel:'What it does'}));}
  refs.replaceChildren(node('h3','Carried books and slates'));
  for(const r of view.references??[]){const chips=[chip(`${r.count} carried`)];if(r.read)chips.push(chip('read',{tone:'good'}));if(r.mode==='access')chips.push(chip('method available while carried'));
   const acts=[];if(r.mode==='learn')acts.push(act('Study and learn',{type:'learn',key:r.key},'refLearn'));if(r.mode==='training')acts.push(act('Read',{type:'read',key:r.key},'refRead'));acts.push(act('Put back on shelf',{type:'return',key:r.key},'refReturn'));
   for(const b of [...acts])if(b.disabled&&b.title)acts.push(reasonLine(b.title));refs.append(infoRow({label:r.name,chips,actions:acts}));}
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
   if(selected.has(material.key)){const earlier=node('button','Move earlier');earlier.type='button';earlier.dataset.craftEarlier=material.key;earlier.onclick=()=>{const rows=[...selected],i=rows.findIndex(([k])=>k===material.key);if(i>0)[rows[i-1],rows[i]]=[rows[i],rows[i-1]];selected=new Map(rows);signature='';render();};stock.append(earlier);}
   // Known, tested-and-none and untried are three different states (G36); hidden properties never appear.
   const props=node('p',(material.props??[]).map(x=>`${x.label[0].toUpperCase()+x.label.slice(1)}: ${x.state==='known'?x.value:x.state==='known-none'?'none':'untried'}`).join(' · '));props.className='crafting-trial-properties';props.dataset.craftProps=material.key;stock.append(props);
  }
  if(!view.materials.length)stock.append(node('p','Gather here to begin. Exact lots also appear in Inventory.'));
  firing.replaceChildren();if(view.firing){const left=Math.max(0,view.firing.due-view.clock),late=Math.max(0,view.clock-view.firing.due);firing.append(node('p',`One batch is held on the brazier. ${left?left+' played minutes until collection':'Ready for collection'}; ${late} late minutes. Materials and one Charcoal are already spent. Late heat can degrade the preparation; abandoning leaves waste.`));for(const [type,label]of [['collect_firing','Collect the held preparation'],['abandon_firing','Abandon the held batch · materials become waste']]){const q=quote({type}),b=node('button',label);b.type='button';b.dataset.craftFiringAction=type;b.disabled=!q.eligible;b.title=q.reason;b.onclick=()=>run(q);firing.append(b);if(q.firing)firing.append(node('p',`If collected now: heat ${q.firing.heat}, controlled allowance ${q.firing.safeHeat}, residual ${q.firing.residual}, heat impurity ${q.firing.impurity}. Effects still need observation.`));if(!q.eligible)firing.append(node('p',q.reason));}}
  const request={type:timed.checked?'begin_firing':'craft',inputs:[...selected].map(([key,qty])=>({key,qty})),process:[{op:layered.checked?'heat':'steep',level:Number(layered.checked?heat.value:strength.value)}],...(layered.checked?{layered:true,tablet:tablet.checked}:{}),...(method.value?{recipe:method.value}:{})};lastQuote=quote(request);heat.hidden=!layered.checked;strength.hidden=layered.checked;method.title=layered.checked?'The selected book method must admit this heat process. Choose free experiment for an independent formulation.':'';
  if(layered.checked)stock.append(node('p','Feed order: '+request.inputs.map((i,n)=>`${n+1}. ${view.materials.find(m=>m.key===i.key)?.name}`).join(' → ')));
  renderCraftingDetail(detail,{title:timed.checked?`Hold layered heat ${heat.value} batch for 6 minutes`:layered.checked?`Layered heat ${heat.value} batch`:`Steep selected materials (level ${strength.value})`,requirements:request.inputs.map(i=>({label:view.materials.find(m=>m.key===i.key)?.name??'Selected material',have:view.materials.find(m=>m.key===i.key)?.count??0,need:i.qty})),output:{name:'Unidentified herbal preparation',count:1,uncertain:true},effects:[],chance:null,chance_label:'Viable preparation',policy:'Selected materials are used even if no preparation results. Completing the steep does not guarantee a viable preparation; effects must be observed.',station:'Village common bench',xp:'Observation only',attempts:lastQuote.eligible?1:0,available:lastQuote.eligible,blocked_reason:lastQuote.reason},
   {onCommit:()=>run(lastQuote),onBlocked:()=>{notice.textContent=lastQuote.reason;}});
  const past=request.inputs.length?forecast(request):{verdict:'untried'};history.hidden=past.verdict==='untried';history.dataset.verdict=past.verdict;
  history.textContent=past.verdict==='known-fail'?`Tried before: this exact steep of these materials came to nothing ${past.tries===1?'once':past.tries+' times'}${past.reasons.includes('thin')?', because the steep ran too thin':past.reasons.includes('reacted')?', after the materials reacted':', with nothing reacting'}${Object.keys(past.residue).length?`; left over: ${Object.entries(past.residue).map(([a,n])=>`${a} ${n}`).join(', ')}`:''}.`:past.verdict==='near'?'You have failed with these materials under another steep; a different steep may differ.':'';
  grudge.hidden=!(view.grudge>0);grudge.textContent=view.grudge>0?`The verge keepers grumble about herbs wasted on thin steeps (${view.grudge}). It eases by one each season.`:'';
  sample.replaceChildren(node('h3','Examine a sample'));
  for(const m of view.examinable??[]){const row=node('div');row.append(node('p',`${m.name}: costs ${m.cost} sample${m.cost>1?'s':''}${m.misses?` (${m.misses} failed)`:''}`),act('Examine',{type:'examine',key:m.key},'craftExamine'));sample.append(row);}
  if(!view.examinable?.length)sample.append(node('p','Gather a material to examine it.'));
  // This bounded trial commits one selected batch. There is no misleading bulk quote.
  for(const b of detail.querySelectorAll('[data-craft-amount]'))b.remove();
  notebook.replaceChildren(node('summary','Experiment notebook'));
  const t=view.treatment;
  if(t){notebook.append(node('p',`Current body conditioning ${t.conditioning}: +${t.conditioning}% maximum stamina. Medicinal residue ${t.impurity}/${treatmentCapacity(t)}. Treatment vessel tier ${t.apparatus}. Tablets condition this body; tonic tolerance and poison are separate.`));
   if(t.channels)notebook.append(node('p',`Bodily channels ${t.channels}/3: +${2*t.channels} medicinal residue capacity, ${20*t.channels}% less crafted herbal poison exposure, faster and stronger residue purging, and ${2*t.channels} stability for this body’s quick tempering. The channels stay with this treated body.`));
   if(t.job)notebook.append(node('p',`${t.job.kind} soak pending until calendar minute ${t.job.due}. This passive treatment runs during other work; it remains bound to the treated body.`));
   for(const [action,label,cost] of [['channel','Open the next bodily channel','matched conditioning/tempering, 2 ingots and 24 min per channel number'],['apparatus','Fit a larger treatment vessel','2 Iron ingots'],['purge','Purge residue','2 Charcoal, 6–12 minutes by channels, removes 5 per vessel tier × (1 + channels)'],['capacity','Expand capacity','4 Charcoal, 24 minutes, +5 capacity']]){const b=node('button',label),q=quote({type:'treatment',action});b.type='button';b.dataset.craftTreatment=action;b.disabled=!q.eligible;b.title=q.reason;b.onclick=()=>run(q);notebook.append(infoRow({label:'',actions:[b,...(!q.eligible&&q.reason?[reasonLine(q.reason)]:[])],more:cost,moreLabel:'Cost'}));}
  }
  const depth=view.depth??{tolerance:[],deductions:[],trials:0};
  if(depth.tolerance.length)notebook.append(Object.assign(node('p',`Body still dulled to: ${depth.tolerance.map(t=>`${t.effect} ${t.level}/${t.overdoseAt}`).join(' · ')}. Drinking past the limit sours the body instead.`),{className:'crafting-trial-tolerance'}));
  if(!depth.deductions.length)notebook.append(node('p',depth.trials?'Nothing has shown an effect yet.':'Drink a preparation to start a record.'));
  for(const d of depth.deductions){const row=node('p',`${d.material} → ${d.effect}: ${d.status} (seen ${d.hits} of ${d.withCount} trials with it)`);row.dataset.craftDeduction=d.status;notebook.append(row);}
  products.replaceChildren(node('h3','Your preparations'));
  // DRC9: observed effects name the action; an unknown preparation stays plain "Drink one".
  for(const p of view.products){const row=node('div'),use=node('button',p.effects.length?`Drink one · observed ${p.effects.map(e=>`${e.effect} ${e.value}`).join(', ')}`:'Drink one');use.type='button';use.dataset.craftedUse=p.key;const q=quote({type:'use',key:p.key});use.disabled=!q.eligible;use.title=q.reason;use.onclick=()=>run(q);const label=node('p',`${p.composition} · ${p.count} carried`);label.dataset.craftComposition='';row.append(label,use);if(p.formulation)row.append(node('p',`Ingredient tier ${p.formulation.tier} · complexity grade ${p.formulation.grade} · heat ${p.formulation.heat}, controlled allowance ${p.formulation.safeHeat}, residual ${p.formulation.residual} · heat impurity ${p.formulation.impurity}. Feed order: ${p.orderNames.join(' → ')}.`));
   if(q.treatment){const t=q.treatment;row.append(node('p',`Next tablet: +${t.gain} body conditioning; +${t.residue} residue (${t.thermal} preparation + ${t.load} unpurged load + ${t.potency} potency stress at tempering stage ${t.stage}). ${t.remaining}/${t.capacity} residue capacity free. Purging lowers the next dose's load.`));}
   if(p.effects.length)row.append(node('p',p.effects.map(e=>`Observed ${e.effect}: ${e.value}`).join(' · ')));const named=node('p',p.derived??p.name??'');named.dataset.craftDerived='';row.prepend(named);products.append(row);
  }
 }
 definePanel({id:'herbal-experiments',title:'Village experiments',role:'actions',node:panel,home:document.getElementById('main_content'),defaultDock:'center',
  discovered:()=>read().discovered,eligible:()=>{const v=read();return !v.blocked&&v.world==='base.frontier'&&v.location==='Village';},unavailableReason:()=>read().blocked||'Return to Village to experiment.'});
 render();return {render};
}
