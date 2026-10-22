// A selection/review over real native holders. Mutation stays in the injected
// staged chest command, including sequence, stock, custody and durable write.
export function mountStorageBatch({host,carried,chest,transfer}){
 const doc=host.ownerDocument,make=(tag,text)=>{const n=doc.createElement(tag);if(text)n.textContent=text;return n;};
 const section=make('details');section.className='storage-batch';section.append(make('summary','Move several stacks'));
 const direction=make('select');direction.setAttribute('aria-label','Batch transfer direction');
 for(const [value,text]of [['deposit','Carried → this chest'],['withdraw','This chest → carried']]){const o=make('option',text);o.value=value;direction.append(o);}
 const note=make('p','Select exact stacks and quantities. Favorites stay carried. Borrowed or reserved stock must be settled first.');
 const list=make('div');list.className='storage-batch-list';list.setAttribute('aria-label','Stacks to transfer');
 const tools=make('div'),review=make('button','Review transfer'),confirm=make('button','Confirm transfer'),cancel=make('button','Cancel selection'),shown=make('button','Select shown stacks'),status=make('p');
 for(const n of [review,confirm,cancel,shown])n.type='button';confirm.hidden=true;status.setAttribute('role','status');tools.append(shown,review,confirm,cancel);section.append(direction,note,list,tools,status);host.append(section);
 let signature='',quote=null;const selected=new Map();
 const rows=()=>[...(direction.value==='deposit'?carried:chest).querySelectorAll(':scope > [data-'+(direction.value==='deposit'?'character':'storage')+'_item]')];
 const key=row=>row.dataset.character_item||row.dataset.storage_item;
 const count=row=>Number(row.dataset.item_count)||0;
 const favorite=row=>direction.value==='deposit'&&row.classList.contains('character_item_faved');
 function invalidate(){quote=null;confirm.hidden=true;review.disabled=!selected.size;}
 function render(){
  const source=rows(),next=JSON.stringify([direction.value,source.map(r=>[key(r),count(r),favorite(r)])]);
  if(next===signature)return;signature=next;list.replaceChildren();
  for(const [k]of selected)if(!source.some(r=>key(r)===k&&!favorite(r)))selected.delete(k);
  for(const row of source){
   const k=key(row);if(selected.has(k))selected.set(k,Math.min(selected.get(k),count(row)));const label=make('label'),check=make('input'),amount=make('input');check.type='checkbox';check.checked=selected.has(k);check.disabled=favorite(row);
   const name=row.querySelector('.inventory_item_name')?.textContent?.trim()||row.querySelector('.item_name')?.textContent||'Known item';
   amount.type='number';amount.min='1';amount.max=String(count(row));amount.step='1';amount.value=String(Math.min(selected.get(k)||count(row),count(row)));amount.setAttribute('aria-label',`Quantity of ${name}`);amount.disabled=check.disabled;
   label.append(check,doc.createTextNode(`${name} · ${count(row)} available${favorite(row)?' · favorite':''} `),amount);list.append(label);
   check.addEventListener('change',()=>{if(check.checked)selected.set(k,Number(amount.value));else selected.delete(k);invalidate();});
   amount.addEventListener('input',()=>{if(check.checked)selected.set(k,Number(amount.value));invalidate();});
  }
  review.disabled=!selected.size;
 }
 direction.addEventListener('change',()=>{selected.clear();invalidate();signature='';status.textContent='';render();});
 shown.addEventListener('click',()=>{for(const row of rows())if(getComputedStyle(row).display!=='none'&&!favorite(row))selected.set(key(row),count(row));invalidate();signature='';render();});
 cancel.addEventListener('click',()=>{selected.clear();invalidate();signature='';status.textContent='Selection cleared. Nothing moved.';render();});
 review.addEventListener('click',()=>{
  const source=rows(),entries=[];let sequence=null;
  for(const [k,n]of selected){const row=source.find(r=>key(r)===k);if(!row||favorite(row)||!Number.isSafeInteger(n)||n<1||n>count(row)){invalidate();status.textContent='A selected stack or quantity changed. Check the selection.';return;}
   const current=Number(row.dataset.storageSequence);if(!Number.isSafeInteger(current)||(sequence!=null&&sequence!==current)){invalidate();status.textContent='Refresh the chest before reviewing.';return;}sequence=current;entries.push({item_key:k,count:n,expectedCount:count(row)});
  }
  if(!entries.length)return;
  quote={direction:direction.value,sequence,items:entries};confirm.hidden=false;
  status.textContent=`Review: ${entries.length} stacks, ${entries.reduce((n,e)=>n+e.count,0)} items · ${direction.selectedOptions[0].textContent}. Confirm moves these quantities together.`;
 });
 confirm.addEventListener('click',()=>{if(!quote)return;const request=quote;invalidate();const ok=transfer?.(request)===true;status.textContent=ok?'Transfer complete. Exact stock moved together.':'Nothing moved. The chest, stock or permission changed; review again.';if(ok)selected.clear();signature='';render();});
 render();return {render};
}
