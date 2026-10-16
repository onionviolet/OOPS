// Shared display grammar only. Reasons come from the action's existing owner.
let reasonSequence=0;
export function decorateActionComponents(root) {
    let queued=false;
    const notes=new WeakMap();
    function refresh() {
        queued=false; observer.disconnect();
        for(const button of root.querySelectorAll('button')) {
            const reason=button.disabled ? button.dataset.disabledReason || button.title : '';
            let note=notes.get(button);
            if(!note) {
                const existing=document.getElementById(button.getAttribute('aria-describedby'));
                if(existing?.classList.contains('ui-disabled-reason')) {note=existing;notes.set(button,note);}
            }
            if(reason&&!note) {
                note=document.createElement('small');note.className='ui-disabled-reason';
                note.id=`ui-disabled-${++reasonSequence}`;button.after(note);notes.set(button,note);
                button.setAttribute('aria-describedby',note.id);
            }
            // A borrowed panel may have two decorators. Idempotent writes let
            // their observers settle rather than triggering each other forever.
            if(note) {if(note.hidden!==!reason)note.hidden=!reason;if(note.textContent!==reason)note.textContent=reason;}
        }
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
    let selected=null;
    const name=row=>row.querySelector(nameSelector)?.textContent||row.firstElementChild?.textContent||row.textContent;
    const key=row=>row.dataset.character_item||row.id||name(row);
    function refresh(){
        const rows=[...list.querySelectorAll(rowSelector)];let visible=0;
        for(const row of rows){
            row.classList.toggle('ui-list-filtered',!name(row).toLowerCase().includes(search.value.toLowerCase()));
            if(getComputedStyle(row).display!=='none')visible++;
            row.toggleAttribute('data-ui-selected',!!selected&&key(row)===selected);
        }
        const text=`${visible} / ${rows.length}`;if(count.textContent!==text)count.textContent=text;
        // A panel may describe its own empty state (R18 inventory tabs: nothing held, empty category, no match).
        empty.hidden=visible>0;const hint=list.emptyHint?.()||(rows.length?'No matches. Clear search or change the category.':emptyText);if(empty.textContent!==hint)empty.textContent=hint;
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
