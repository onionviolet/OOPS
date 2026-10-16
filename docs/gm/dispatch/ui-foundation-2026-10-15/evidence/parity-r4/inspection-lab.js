(async()=>{
const combat=location.port==='19157',frame=document.querySelector('iframe'),note=document.getElementById('note');
if(!localStorage.getItem('save data'))localStorage.setItem('save data',await(await fetch(combat?'populated-multi.save.txt':'prototype-village.save.txt')).text());
localStorage.setItem('yairpg.presentation.proto23-parity.v1','on');frame.src='/?test_hooks=1';
await new Promise(resolve=>frame.onload=resolve);const w=frame.contentWindow,d=frame.contentDocument;
// No copied game engine or model: the iframe is the frozen build, with a
// disposable event/overlay experiment layered over its native presentation.
const style=d.createElement('style');style.textContent=`
body[data-inspection-lab]:not([data-inspection-lab="stable"]) #shell_item_preview{display:none!important}
#inspection_lab_popover:popover-open{display:flex;flex-direction:column;position:fixed;inset:auto;margin:0;box-sizing:border-box;width:var(--lab-width);max-height:var(--lab-height);left:var(--lab-left);top:var(--lab-top);font:var(--lab-font) var(--ui-font);color:var(--p23-text);background:var(--p23-preview-fill);border:2px solid var(--p23-detail-border);padding:.5em;overflow:hidden;box-shadow:var(--ui-shadow)}
#inspection_lab_popover .lab-description{overflow:auto;min-height:0;line-height:1.35}#inspection_lab_popover footer{display:flex;flex-wrap:wrap;gap:.3em;border-top:1px solid var(--p23-line);padding-top:.4em}#inspection_lab_popover button{font:inherit;color:var(--p23-text);background:var(--p23-context);border:1px solid var(--p23-detail-border);padding:.2em .4em}#inspection_lab_popover strong{color:var(--p23-value)}
body[data-inspection-lab]:not([data-inspection-lab="stable"]) #inventory_content_div > [data-lab-selected]{outline:2px solid var(--p23-value);outline-offset:-2px}
`;
d.head.append(style);const popup=d.createElement('aside');popup.id='inspection_lab_popover';popup.setAttribute('popover','manual');popup.setAttribute('aria-label','Prototype item inspection');const heading=d.createElement('strong'),body=d.createElement('div'),footer=d.createElement('footer');body.className='lab-description';popup.append(heading,body,footer);d.body.append(popup);
let mode='pin',pinned=false,row=null,signature='',timer=null,bypass=false;
const close=()=>{pinned=false;row?.removeAttribute('data-lab-selected');row=null;signature='';if(popup.matches(':popover-open'))popup.hidePopover();};
const button=(label,run)=>{const b=d.createElement('button');b.textContent=label;b.onclick=run;footer.append(b);return b;};
function full(){if(!row?.isConnected)return;const target=row;close();bypass=true;target.focus({preventScroll:true});target.dispatchEvent(new w.FocusEvent('focusin',{bubbles:true}));bypass=false;setTimeout(()=>{[...d.querySelectorAll('#proto23_item_detail button')].find(b=>b.textContent==='Full item ›')?.click();},30);}
function show(target,pin=false){if(mode==='stable')return;clearTimeout(timer);if(pinned&&row!==target&&!pin)return;if(pin){row?.removeAttribute('data-lab-selected');pinned=true;}row=target;const tooltip=row.querySelector('.item_tooltip');if(!tooltip)return;
 const key=tooltip.innerHTML+mode+pinned;if(signature!==key){signature=key;heading.textContent=(pinned?'Pinned · ':'Preview · ')+row.querySelector('.item_name').textContent;body.replaceChildren();const nativePreview=d.querySelector('#shell_item_preview .shell-preview-body');if(nativePreview?.textContent.includes(row.querySelector('.item_name').textContent))body.innerHTML=nativePreview.innerHTML;else{const copy=tooltip.cloneNode(true);copy.className='shell-native-item-description';copy.removeAttribute('style');body.append(copy);}footer.replaceChildren();
 if(mode==='pin'&&pinned)for(const selector of ['.equip_item_button','.item_use_button','.item_auto_use_button']){const source=row.querySelector(selector);if(source)button(source.textContent.replace(/[\[\]]/g,'').trim(),()=>{const action=row?.querySelector(selector);action?.click();signature='';});}
 button('Fuller view ›',full);if(mode==='pin'&&!pinned)button('Pin',()=>show(row,true));button('Close · Esc',close);}
 const region=d.querySelector('[data-region=inventory]').getBoundingClientRect(),expanded=!!row.closest('#center_mode_content'),font=getComputedStyle(d.getElementById('inventory_div')).fontSize;
 for(const[k,v]of Object.entries({'--lab-left':(expanded?region.left+4:region.right+6)+'px','--lab-top':region.top+'px','--lab-width':(expanded?region.width-8:460)+'px','--lab-height':(w.innerHeight-region.top-54)+'px','--lab-font':font}))popup.style.setProperty(k,v);
 if(pinned)row.setAttribute('data-lab-selected','');if(!popup.matches(':popover-open'))popup.showPopover();
}
function setMode(next){close();const old=d.querySelector('#proto23_item_detail');if(old?.checkVisibility())[...old.querySelectorAll('button')].find(b=>b.textContent==='Close item')?.click();mode=next;d.body.dataset.inspectionLab=mode;for(const b of document.querySelectorAll('[data-mode]'))b.setAttribute('aria-pressed',String(b.dataset.mode===mode));note.textContent=mode==='pin'?'O2: hover previews; click an item or Pin to keep the menu and native actions. Click another item to repin.':mode==='hover'?'O1: hover/focus previews; no sticky menu. Fuller view opens the existing reference route.':'O3: current rebuilt behavior. Select an item for the stable inspector; Full item opens its reference view.';}
const sourceRow=event=>event.target.closest('#inventory_content_div > [data-character_item]');
d.addEventListener('click',e=>{const r=sourceRow(e);if(mode!=='stable'&&r&&!e.target.closest('.item_controls,.equip_item_button,.item_use_button,.item_auto_use_button,.known-item-binding')){e.preventDefault();e.stopImmediatePropagation();show(r,mode==='pin');}},true);
d.addEventListener('focusin',e=>{if(bypass||mode==='stable')return;const r=sourceRow(e);if(r){e.stopImmediatePropagation();show(r);}},true);
d.addEventListener('mouseover',e=>{const r=sourceRow(e);if(r)show(r);});
d.addEventListener('mouseout',e=>{const r=sourceRow(e);if(r&&!r.contains(e.relatedTarget)&&!pinned)timer=setTimeout(close,180);});
popup.onmouseenter=()=>clearTimeout(timer);popup.onmouseleave=()=>{if(!pinned)timer=setTimeout(close,180);};
d.addEventListener('keydown',e=>{if(mode==='stable')return;if(e.key==='Escape'&&popup.matches(':popover-open')){e.preventDefault();e.stopImmediatePropagation();close();}else if(['Enter',' '].includes(e.key)){const r=sourceRow(e);if(r){e.preventDefault();e.stopImmediatePropagation();show(r,mode==='pin');}}},true);
setInterval(()=>{if(row?.isConnected)show(row,pinned);else if(row)close();},400);
for(const b of document.querySelectorAll('[data-mode]'))b.onclick=()=>setMode(b.dataset.mode);
for(const b of document.querySelectorAll('[data-font]'))b.onclick=()=>{close();d.querySelector('[data-workspace-action=context]').click();const f=d.querySelector('input[aria-label="Font size"]');f.value=b.dataset.font;f.dispatchEvent(new w.Event('change',{bubbles:true}));[...d.querySelectorAll('button')].find(b=>b.textContent==='Apply and save')?.click();d.querySelector('[data-workspace-action=context]').click();};
setMode('pin');w.inspectionLab={setMode,show,close,state:()=>({mode,pinned,key:row?.dataset.character_item})};
})();
