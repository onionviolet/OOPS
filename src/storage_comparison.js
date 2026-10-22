import {mountStorageBatch} from './storage_batch_ui.js';
// CUI3: one exact native key, two real holders. Commands stay with the native
// row transfer handler and its stock/sequence checks; this view owns no stock.
export function mountStorageComparison({host, carried, chest, transfer}) {
    const doc=host.ownerDocument, label=doc.createElement('label'), picker=doc.createElement('select'), summary=doc.createElement('p');
    label.textContent='Compare carried / chest: ';picker.setAttribute('aria-label','Compare carried and chest item');label.append(picker);
    const deposit=doc.createElement('button'), withdraw=doc.createElement('button');
    deposit.type=withdraw.type='button';deposit.textContent='Store 1 in chest';withdraw.textContent='Take 1 from chest';
    deposit.dataset.storageCompare='deposit';withdraw.dataset.storageCompare='withdraw';
    summary.dataset.storageComparison='';host.append(label,summary,deposit,withdraw);
    const batch=transfer?mountStorageBatch({host,carried,chest,transfer}):null;
    let selected=null, signature='';
    const rows=(list,attribute)=>new Map([...list.querySelectorAll(`[${attribute}]`)].map(row=>[row.getAttribute(attribute),row]));
    const count=row=>Number(row?.dataset.item_count)||0;
    function render(){
        batch?.render();
        const held=rows(carried,'data-character_item'),stored=rows(chest,'data-storage_item'),all=new Map([...held,...stored]);
        const next=JSON.stringify([...all].map(([key,row])=>[key,row.querySelector('.item_name')?.textContent,count(held.get(key)),count(stored.get(key))]));
        if(next!==signature){signature=next;picker.replaceChildren();const blank=doc.createElement('option');blank.value='';blank.textContent='Choose an item to compare';picker.append(blank);
            for(const [key,row] of all){const option=doc.createElement('option');option.value=key;option.textContent=row.querySelector('.inventory_item_name')?.textContent?.trim()||row.querySelector('.item_name')?.textContent?.trim()||'Known item';picker.append(option);}
        }
        picker.value=all.has(selected)?selected:'';
        const a=held.get(selected),b=stored.get(selected);
        summary.textContent=selected?`${(a||b)?.querySelector('.item_name')?.textContent||'Selected stack no longer held'} · Carried: ${count(a)} · In this chest: ${count(b)}`:'Choose an exact stack, then store or take one. Native row quantity controls remain available.';
        deposit.disabled=!a;withdraw.disabled=!b;
    }
    picker.addEventListener('change',()=>{selected=picker.value||null;render();});
    for(const [button,list,attribute] of [[deposit,carried,'data-character_item'],[withdraw,chest,'data-storage_item']])button.addEventListener('click',event=>{
        event.stopPropagation();const row=rows(list,attribute).get(selected);
        if(row&&count(row)>0)row.click();render();
    });
    render();return {render,destroy(){host.replaceChildren();}};
}
