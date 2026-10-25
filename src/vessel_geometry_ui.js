// Existing Mistglass panel seam; selection moves only existing nodes.
export function renderVesselGeometry({host,view,disabled,act,render,notice}){
 const g=view.geometry;if(!g)return;
 const text=document.createElement('p');text.textContent=`Circulation ring: ${g.affinity}; ${g.resonance} unlike adjacent currents. Arrangement adds ${(g.rateBonus/10).toFixed(1)}% throughput and ${(g.oddsBonus/100).toFixed(2)} percentage points to purification. Empty or identical neighbors supply no resonance.`;host.append(text);
 const choices=document.createElement('div');choices.style.display='flex';choices.style.flexWrap='wrap';choices.style.gap='var(--ui-space-2)';
 const commit=id=>{try{act('method:vessel:layout:'+id);notice.textContent='';}catch(e){notice.textContent=e.message;}render();};
 for(let i=0;i<8;i++){
  const label=document.createElement('label');label.textContent=`Ring ${i+1} `;const select=document.createElement('select');select.setAttribute('aria-label',`Circulation ring position ${i+1}`);select.dataset.vesselPosition=String(i);
  for(const id of ['empty','flow','still','bridge']){const o=document.createElement('option');o.value=id;o.textContent=id;o.disabled=id!=='empty'&&g.slots[i]!==id&&g.available[id]===0;select.append(o);}select.value=g.slots[i]||'empty';select.disabled=disabled;select.onchange=()=>commit(`slot:${i}:${select.value}`);label.append(select);choices.append(label);
 }host.append(choices);
 for(const [id,label]of [['balance','Arrange available nodes in alternating currents'],['clear','Clear positions, keeping the nodes'],['save','Remember this arrangement'],['apply','Restore remembered arrangement with available nodes']]){const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.mistglassAction='method:vessel:layout:'+id;b.disabled=disabled||id==='apply'&&!g.preset;b.onclick=()=>commit(id);host.append(b);}
 const q=view.fusion,p=document.createElement('p');p.textContent=q.eligible?`Batch fusion preview: consume ${q.count} flow + ${q.count} still → ${q.count} bridges. Result: flow ${q.after.flow}, still ${q.after.still}, bridge ${q.after.bridge}; impurity ${q.impurity}. Positions of consumed nodes empty; remembered arrangement remains a plan and may need new nodes.`:'Batch fusion needs at least one unmatched flow and still node.';host.append(p);
}
