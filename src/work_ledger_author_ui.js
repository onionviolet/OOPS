// Authoring only the original local System. Native crafting still settles all outputs.
export function createWorkLedgerAuthorUI({container,read,apply,reset,canWrite}) {
 const panel=document.createElement('section');panel.id='work_ledger_author';panel.className='customization-panel customization-surface';
 const title=document.createElement('h3');title.textContent='Original System rules';panel.append(title);
 const explain=document.createElement('p');explain.textContent='Edit the original Work Ledger. Power values affect acquired functions. Accepted commissions keep their saved terms. Native inputs, chance limits, output and time still belong to crafting.';panel.append(explain);
 const reading=document.createElement('div');reading.className='customization-fields-scroll';reading.append(explain);panel.append(reading);
 const editor=document.createElement('textarea');editor.id='work_ledger_rules_draft';editor.rows=16;editor.setAttribute('aria-label','Original Work Ledger rule draft');reading.append(editor);
 const actions=document.createElement('div');actions.className='customization-actions';panel.append(actions);
 const status=document.createElement('p');status.setAttribute('role','status');panel.append(status);
 let dirty=false,busy=false;editor.addEventListener('input',()=>dirty=true);
 const button=(id,label,action,persist=true)=>{const b=document.createElement('button');b.id=id;b.type='button';b.textContent=label;b.onclick=async()=>{if(busy)return;try{busy=true;refresh();await action();if(persist){dirty=false;status.textContent='Saved.';refresh(true);}else status.textContent='Draft exported.';}catch(e){status.textContent=e.message;}finally{busy=false;refresh();}};actions.append(b);return b;};
 const applyButton=button('apply_work_ledger_rules','Apply rules',()=>apply(JSON.parse(editor.value)));
 button('reload_work_ledger_draft','Discard draft',()=>{dirty=false;refresh(true);});
 const resetButton=button('reset_work_ledger_rules','Reset original rules',()=>reset());
 button('export_work_ledger_rules','Export rules',()=>{const blob=new Blob([JSON.stringify(JSON.parse(editor.value),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='original-work-ledger-rules.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),0);},false);
 const file=document.createElement('input');file.type='file';file.accept='.json,application/json';file.id='import_work_ledger_rules';file.setAttribute('aria-label','Import original rules into draft');file.onchange=async()=>{try{const raw=JSON.parse(await file.files[0].text());if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Import an original rule definition.');raw.revision=read().revision;editor.value=JSON.stringify(raw,null,2);dirty=true;status.textContent='Imported into the current draft revision. Apply validates before saving.';}catch(e){status.textContent=e.message;}file.value='';};reading.append(file);
 function refresh(force=false){if(force||(!dirty&&document.activeElement!==editor))editor.value=JSON.stringify(read(),null,2);applyButton.disabled=resetButton.disabled=busy||!canWrite();editor.disabled=busy||!canWrite();}
 container.append(panel);refresh();return {panel,refresh};
}
