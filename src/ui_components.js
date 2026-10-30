import {INVENTORY_KINDS,inventoryRowKind,matchesInventoryFilter} from './inventory_filters.js';
// Shared display grammar only. Reasons come from the action's existing owner.
let reasonSequence=0;
const actionNotes=new WeakMap(),focusable=new WeakMap();
export function decorateActionComponents(root) {
    let queued=false;
    const notes=actionNotes;
    function refresh() {
        queued=false; observer.disconnect();
        const liveNotes=new Set();
        // Per-parent index of non-button children by text, built once per pass. A linear scan of
        // every sibling for every disabled button was quadratic: a 2,000-button panel froze the
        // page (2026-10-29). Lists keep document order and are kept current as notes change text.
        const byParent=new Map();
        const indexOf=parent=>{let index=byParent.get(parent);if(!index){index=new Map();for(const n of parent?.children||[]){if(n.localName==='button')continue;const t=n.textContent.trim();(index.get(t)||index.set(t,[]).get(t)).push(n);}byParent.set(parent,index);}return index;};
        const retext=(note,text)=>{const index=byParent.get(note.parentElement);if(index){const old=index.get(note.textContent.trim());if(old){const i=old.indexOf(note);if(i>=0)old.splice(i,1);}const next=index.get(text.trim())||index.set(text.trim(),[]).get(text.trim());next.push(note);next.sort((a,b)=>a.compareDocumentPosition(b)&4?-1:1);}note.textContent=text;};
        for(const button of root.querySelectorAll('button')) {
            // A hidden control shows no blocker: its reasons only cluttered the panel (2026-10-29).
            const reason=button.disabled&&!button.hidden ? button.dataset.disabledReason || button.title : '';
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
                // UIV1: a row that already prints this reason is the description; no duplicate note.
                const shown=reason?(indexOf(button.parentElement).get(reason)||[]).find(n=>n!==note&&n.parentElement===button.parentElement&&!n.hidden):null;
                if(shown&&!shown.id)shown.id=`ui-disabled-${++reasonSequence}`;
                const visible=reason&&!shown?note:shown;
                if(note.hidden!==(!reason||!!shown))note.hidden=!reason||!!shown;if(note.textContent!==reason)retext(note,reason);
                // Disabled buttons leave the Tab order, so the visible reason takes the stop.
                if(visible&&visible.tabIndex!==0){visible.tabIndex=0;visible.dataset.uiReasonFocus='';}
                if(note!==visible&&note.hasAttribute('tabindex'))note.removeAttribute('tabindex');
                const previous=focusable.get(button);if(previous&&previous!==visible&&previous!==note&&!previous.classList.contains('ui-disabled-reason')&&'uiReasonFocus' in previous.dataset){previous.removeAttribute('tabindex');delete previous.dataset.uiReasonFocus;}
                if(visible)focusable.set(button,visible);else focusable.delete(button);
                const ids=(button.getAttribute('aria-describedby')||'').split(/\s+/).filter(id=>id&&id!==note.id&&id!==previous?.id);
                if(visible)ids.push(visible.id);
                const described=ids.join(' ');
                if(described!==button.getAttribute('aria-describedby')){
                    if(described)button.setAttribute('aria-describedby',described);else button.removeAttribute('aria-describedby');
                }
            }
        }
        for(const note of root.querySelectorAll('.ui-disabled-reason'))if(!liveNotes.has(note))note.remove();
        observer.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['disabled','hidden','title','data-disabled-reason']});
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
    let selected=null;const searchGroups=new Map();
    const inventory=id==='inventory_content_div',noun=({'skill':'skills','bestiary entry':'entries','read book':'books'})[label]||'entries';
    const name=row=>row.querySelector(nameSelector)?.textContent||row.firstElementChild?.textContent||row.textContent;
    const key=row=>row.dataset.character_item||row.id||name(row);
    function refresh(){
        const rows=[...list.querySelectorAll(rowSelector)];let visible=0;
        for(const row of rows){
            const q=row.dataset.item_quality;
            const facts={name:name(row),kind:inventoryRowKind([...row.classList]),quality:q!=null&&q!==''&&Number.isFinite(Number(q))?Number(q):null};
            row.classList.toggle('ui-list-filtered',!matchesInventoryFilter(facts,{query:search.value,kind:kind?.value||'all',quality:quality?.value||'all'}));
            const capped=id==='skill_list'&&row.querySelector('.skill_bar_capped');
            const admitted=!row.hidden&&row.style.display!=='none'&&!row.classList.contains('ui-list-filtered')&&(!capped||getComputedStyle(capped).display!=='none');
            if(inventory?getComputedStyle(row).display!=='none':admitted)visible++;
            row.toggleAttribute('data-ui-selected',!!selected&&key(row)===selected);
        }
        const units=rows.filter(row=>getComputedStyle(row).display!=='none').reduce((n,row)=>n+(Number(row.dataset.item_count)||1),0);
        const text=inventory?`${visible} / ${rows.length} stacks · ${units} items`:`${visible} / ${rows.length} ${noun}`;count.title=inventory?'Matching stacks and units after category, name, kind and quality filters.':'Matching '+noun+'; collapsed groups keep their entries.';if(count.textContent!==text)count.textContent=text;
        if(id==='skill_list'){
            const searching=!!search.value.trim();
            for(const group of list.querySelectorAll('.skill_category_div')){
                if(searching){if(!searchGroups.has(group))searchGroups.set(group,group.classList.contains('skill_category_expanded'));group.classList.toggle('skill_category_expanded',[...group.querySelectorAll(rowSelector)].some(row=>!row.classList.contains('ui-list-filtered')));}
                else if(searchGroups.has(group)){group.classList.toggle('skill_category_expanded',searchGroups.get(group));}
            }
            if(!searching)searchGroups.clear();
        }
        // A panel may describe its own empty state (R18 inventory tabs: nothing held, empty category, no match).
        empty.hidden=visible>0;const hint=(list.inventoryFilter?.active()?'No items match these view choices. Clear filters to see all.':list.emptyHint?.())||(rows.length?(id==='skill_list'?'No skills match these view choices. Clear search or show max level skills.':'No matches. Clear search or change the category.'):emptyText);if(empty.textContent!==hint)empty.textContent=hint;
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
