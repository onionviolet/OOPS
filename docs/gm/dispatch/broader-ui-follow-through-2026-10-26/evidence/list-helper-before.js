import {INVENTORY_KINDS,inventoryRowKind,matchesInventoryFilter} from './inventory_filters.js';
// Shared display grammar only. Reasons come from the action's existing owner.
let reasonSequence=0;
const actionNotes=new WeakMap();
export function decorateActionComponents(root) {
    let queued=false;
    const notes=actionNotes;
    function refresh() {
        queued=false; observer.disconnect();
        const liveNotes=new Set();
        for(const button of root.querySelectorAll('button')) {
            const reason=button.disabled ? button.dataset.disabledReason || button.title : '';
            let note=notes.get(button);
            if(!note) {
                const existing=(button.getAttribute('aria-describedby')||'').split(/\s+/).map(id=>document.getElementById(id)).find(n=>n?.classList.contains('ui-disabled-reason'));
                if(existing?.classList.contains('ui-disabled-reason')) {note=existing;notes.set(button,note);}
            }
            if(reason&&!note) {
                note=document.createElement('small');note.className='ui-disabled-reason';
                note.id=`ui-disabled-${++reasonSequence}`;button.after(note);notes.set(button,note);
            }
            // A borrowed panel may have two decorators. Idempotent writes let
            // their observers settle rather than triggering each other forever.
            if(note) {
                liveNotes.add(note);
                if(button.nextSibling!==note)button.after(note);
                if(note.hidden!==!reason)note.hidden=!reason;if(note.textContent!==reason)note.textContent=reason;
                const ids=(button.getAttribute('aria-describedby')||'').split(/\s+/).filter(id=>id&&id!==note.id);
                if(reason)ids.push(note.id);
                const described=ids.join(' ');
                if(described!==button.getAttribute('aria-describedby')){
                    if(described)button.setAttribute('aria-describedby',described);else button.removeAttribute('aria-describedby');
                }
            }
        }
        for(const note of root.querySelectorAll('.ui-disabled-reason'))if(!liveNotes.has(note))note.remove();
        observer.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['disabled','title','data-disabled-reason']});
    }
    const observer=new MutationObserver(()=>{if(!queued){queued=true;queueMicrotask(refresh);}});
    refresh();return {refresh,destroy:()=>observer.disconnect()};
}

// A presentation-only search keeps native rows, commands and category filters.
// The toolbar is outside the compact list's scroll area and sticky when expanded.
export function decorateInventoryList({id='inventory_content_div',label='inventory item',rowSelector=':scope > .inventory_item_control',nameSelector='.item_name,.inventory_item_name',emptyText='Gather, loot or buy items to fill your inventory.'}={}) {
    const list=document.getElementById(id);if(!list)return {refresh(){}};
    const tools=document.createElement('div');tools.className='ui-list-tools';
    const search=document.createElement('input');search.type='search';search.placeholder=`Find ${label}`;search.setAttribute('aria-label',`Find ${label}`);
    const count=document.createElement('output'),empty=document.createElement('p');empty.className='ui-list-empty';
    tools.append(search,count);list.before(tools);list.after(empty);
    let kind=null,quality=null;
    if(id==='inventory_content_div'){
        const select=(label,choices)=>{const box=document.createElement('label');box.textContent=label+' ';const n=document.createElement('select');n.setAttribute('aria-label',label);for(const [value,text]of choices){const o=document.createElement('option');o.value=value;o.textContent=text;n.append(o);}box.append(n);tools.append(box);n.addEventListener('change',()=>{refresh();list.scrollTop=0;search.dispatchEvent(new Event('input',{bubbles:true}));});return n;};
        kind=select('Item kind',INVENTORY_KINDS);quality=select('Quality',[['all','Any quality'],['50','50% or higher'],['100','100% or higher'],['125','125% or higher'],['150','150% or higher'],['none','No quality rating']]);
        list.inventoryFilter={clear(){kind.value='all';quality.value='all';},active:()=>kind.value!=='all'||quality.value!=='all',summary:()=>[kind.value!=='all'?kind.selectedOptions[0].textContent:'',quality.value!=='all'?quality.selectedOptions[0].textContent:''].filter(Boolean).join(' · ')};
    }
    let selected=null;
    const name=row=>row.querySelector(nameSelector)?.textContent||row.firstElementChild?.textContent||row.textContent;
    const key=row=>row.dataset.character_item||row.id||name(row);
    function refresh(){
        const rows=[...list.querySelectorAll(rowSelector)];let visible=0;
        for(const row of rows){
            const q=row.dataset.item_quality;
            const facts={name:name(row),kind:inventoryRowKind([...row.classList]),quality:q!=null&&q!==''&&Number.isFinite(Number(q))?Number(q):null};
            row.classList.toggle('ui-list-filtered',!matchesInventoryFilter(facts,{query:search.value,kind:kind?.value||'all',quality:quality?.value||'all'}));
            if(getComputedStyle(row).display!=='none')visible++;
            row.toggleAttribute('data-ui-selected',!!selected&&key(row)===selected);
        }
        const units=rows.filter(row=>getComputedStyle(row).display!=='none').reduce((n,row)=>n+(Number(row.dataset.item_count)||1),0);
        const text=`${visible} / ${rows.length} stacks · ${units} items`;count.title='Matching stacks and units after category, name, kind and quality filters.';if(count.textContent!==text)count.textContent=text;
        // A panel may describe its own empty state (R18 inventory tabs: nothing held, empty category, no match).
        empty.hidden=visible>0;const hint=(list.inventoryFilter?.active()?'No items match these view choices. Clear filters to see all.':list.emptyHint?.())||(rows.length?'No matches. Clear search or change the category.':emptyText);if(empty.textContent!==hint)empty.textContent=hint;
    }
    search.addEventListener('input',()=>{refresh();list.scrollTop=0;});
    list.addEventListener('focusin',event=>{const row=[...list.querySelectorAll(rowSelector)].find(n=>n.contains(event.target));if(row){selected=key(row);refresh();row.scrollIntoView({block:'nearest'});}});
    return {refresh};
}

export function summarizeGroups(root) {
    if(!root)return;
    for(const group of root.querySelectorAll('details')){
        const summary=group.querySelector(':scope > summary');if(!summary)continue;
        let status=summary.querySelector('[data-group-status]');
        if(!status){status=document.createElement('small');status.dataset.groupStatus='';summary.append(status);}
        const buttons=[...group.querySelectorAll('button')].filter(n=>!n.hidden);
        const text=buttons.length?`${buttons.filter(n=>!n.disabled).length} ready / ${buttons.length} actions`:'Open to review';
        if(status.textContent!==text)status.textContent=text;
    }
}
