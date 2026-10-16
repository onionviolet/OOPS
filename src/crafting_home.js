import {definePanel} from './panel_kit.js';
import {renderCraftingDetail} from './crafting_detail.js';
const node=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
// Expanded center workspace view. The shared center controller owns Back and Esc.
export function createCraftingHome({read,quote,execute}) {
 const panel=node('section');panel.id='crafting_engine_home';panel.className='expedition_panel';panel.dataset.surfaceType='expanded-center';
 const title=node('h2','Herbal experiments'),description=node('p','Gather on the Village common verge, select carried materials, then try a small steeped batch. Original frontier trial. Properties act before you know them.'),harvest=node('button','Gather Village herbs'),stock=node('div'),detail=node('div'),products=node('div'),notice=node('p');
 harvest.type='button';harvest.id='crafting_gather';detail.dataset.craftDetail='';notice.setAttribute('role','status');
 panel.append(title,description,harvest,stock,detail,products,notice);
 let selected=new Map(),signature='',lastQuote;
 function run(q){try{execute(q);notice.textContent=q.request.type==='harvest'?'Gathered materials stored in your inventory.':q.request.type==='craft'?'The exact materials became a preparation. Drink to observe it.':'Preparation used. Its observed effects are recorded.';}catch(e){notice.textContent=e.message;}signature='';render();}
 harvest.onclick=()=>run(quote({type:'harvest'}));
 function render(){
  const view=read(),next=JSON.stringify([view,[...selected]]);if(next===signature)return;signature=next;
  const allowed=view.world==='base.frontier'&&view.location==='Village';panel.hidden=!allowed;
  if(!allowed)return;
  const gather=quote({type:'harvest'});harvest.disabled=!gather.eligible;harvest.title=gather.reason;
  stock.replaceChildren(node('h3','Carried materials'));
  for(const [key]of selected)if(!view.materials.some(m=>m.key===key))selected.delete(key);
  for(const material of view.materials){const label=node('label'),check=node('input'),qty=node('input');check.type='checkbox';check.checked=selected.has(material.key);check.dataset.craftMaterial=material.key;
   qty.type='number';qty.min='1';qty.max=String(material.count);qty.value=String(selected.get(material.key)??1);qty.setAttribute('aria-label',`Quantity of ${material.name}`);qty.className='crafting-trial-quantity';
   check.onchange=()=>{if(check.checked)selected.set(material.key,Number(qty.value));else selected.delete(material.key);signature='';render();};qty.onchange=()=>{if(check.checked)selected.set(material.key,Number(qty.value));signature='';render();};
   label.className='crafting-trial-material';label.append(check,node('span',`${material.name} · ${material.count} carried`),qty);stock.append(label);
  }
  if(!view.materials.length)stock.append(node('p','Gather herbs here to begin. Exact lots also appear in Inventory.'));
  const request={type:'craft',inputs:[...selected].map(([key,qty])=>({key,qty})),process:[{op:'steep',level:1}]};lastQuote=quote(request);
  renderCraftingDetail(detail,{title:'Steep selected materials',requirements:request.inputs.map(i=>({label:view.materials.find(m=>m.key===i.key)?.name??'Selected material',have:view.materials.find(m=>m.key===i.key)?.count??0,need:i.qty})),output:{name:'Unidentified herbal preparation',count:1},effects:[],chance:100,station:'Village common bench',xp:'Observation only',attempts:lastQuote.eligible?1:0,available:lastQuote.eligible,blocked_reason:lastQuote.reason},
   {onCommit:()=>run(lastQuote),onBlocked:()=>{notice.textContent=lastQuote.reason;}});
  // This bounded trial commits one selected batch. There is no misleading bulk quote.
  for(const b of detail.querySelectorAll('[data-craft-amount]'))b.remove();
  products.replaceChildren(node('h3','Your preparations'));
  for(const p of view.products){const row=node('div'),use=node('button','Drink one');use.type='button';use.dataset.craftedUse=p.key;const q=quote({type:'use',key:p.key});use.disabled=!q.eligible;use.title=q.reason;use.onclick=()=>run(q);row.append(node('p',`${p.name} · ${p.count} carried`),use);
   if(p.effects.length)row.append(node('p',p.effects.map(e=>`Observed ${e.effect}: ${e.value}`).join(' · ')));products.append(row);
  }
 }
 definePanel({id:'herbal-experiments',title:'Herbal experiments',role:'actions',node:panel,home:document.getElementById('main_content'),defaultDock:'center',
  discovered:()=>read().discovered,eligible:()=>{const v=read();return !v.blocked&&v.world==='base.frontier'&&v.location==='Village';},unavailableReason:()=>read().blocked||'Return to Village to experiment.'});
 render();return {render};
}
