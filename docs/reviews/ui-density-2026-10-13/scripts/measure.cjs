// Evaluated in page. Returns metrics for the current viewport.
module.exports = function measure(opts){
 const W=innerWidth,H=innerHeight;
 const vis=e=>{const r=e.getBoundingClientRect();if(r.width<2||r.height<2)return false;for(let n=e;n&&n!==document.documentElement;n=n.parentElement){const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden'||n.hidden)return false;}return true;};
 // bottom bar occludes the viewport bottom in both builds
 const bar=document.getElementById('bottom_panel_div');const barTop=bar&&vis(bar)?bar.getBoundingClientRect().top:H;
 const reachable=e=>{const r=e.getBoundingClientRect();const pts=[[r.left+r.width/2,r.top+Math.min(r.height/2,8)],[r.left+6,r.top+r.height/2],[r.right-6,r.top+r.height/2]];
   return pts.some(([x,y])=>{if(x<0||y<0||x>=W||y>=barTop)return false;const t=document.elementFromPoint(x,y);return t&&(t===e||e.contains(t)||t.contains(e)&&false);});};
 const isChrome=e=>!!e.closest('.workspace-toolbar,.workspace-module-header,.workspace-module-controls,.workspace-divider,.workspace-resize-grip,.workspace-context-bar,.workspace-picker,.workspace-transfer,#bottom_panel_div');
 const isListTool=e=>/^(Sort by|Hide |All$|Equipment$|Usable$|Other$|Favs$)/.test((e.innerText||e.value||'').trim())||!!e.closest('.sorting_div,#inventory_sorting,#skill_sorting,#inventory_filtering');
 // clickables: native semantic controls + cursor:pointer outermost elements
 const cand=[...document.querySelectorAll('button,a[href],select,input,summary,textarea,[role=button],[onclick],*')].filter(e=>{
   if(e===document.body||e===document.documentElement)return false;
   const tag=e.tagName;const sem=/^(BUTTON|A|SELECT|INPUT|SUMMARY|TEXTAREA)$/.test(tag)||e.getAttribute('role')==='button';
   const ptr=getComputedStyle(e).cursor==='pointer';if(!sem&&!ptr)return false;
   const par=e.parentElement&&e.parentElement.closest('button,a[href],summary,[role=button]');if(par)return false;
   if(!sem&&e.parentElement&&getComputedStyle(e.parentElement).cursor==='pointer')return false;
   if(tag==='INPUT'&&e.type==='hidden')return false;return vis(e);});
 const label=e=>((e.getAttribute('aria-label')||e.innerText||e.value||e.title||e.className||'').replace(/\s+/g,' ').trim()).slice(0,60);
 const onscreen=cand.filter(reachable);
 const play=onscreen.filter(e=>!isChrome(e)&&!isListTool(e)), chrome=onscreen.filter(isChrome), list=onscreen.filter(e=>!isChrome(e)&&isListTool(e));
 const disabled=e=>e.disabled||e.getAttribute('aria-disabled')==='true'||e.classList.contains('activity_unavailable');
 // scroll owners
 const scrollers=[...document.querySelectorAll('*')].filter(e=>{const s=getComputedStyle(e);return /(auto|scroll)/.test(s.overflowY)&&e.scrollHeight>e.clientHeight+4&&vis(e)}).map(e=>{const r=e.getBoundingClientRect();return {id:e.id,cls:String(e.className).slice(0,50),title:e.closest('.workspace-module')?.querySelector('.workspace-module-header')?.innerText?.replace(/[↕\n]/g,' ').trim().slice(0,40)||'',content:e.scrollHeight,visible:e.clientHeight,ratio:+(e.scrollHeight/e.clientHeight).toFixed(2),y:Math.round(r.top),inView:r.top<barTop&&r.bottom>0}});
 const nested=scrollers.filter(a=>scrollers.some(b=>b!==a&&document.querySelector('#'+(a.id||'__none'))&&false));
 // nesting: compute via DOM
 const els=[...document.querySelectorAll('*')].filter(e=>{const s=getComputedStyle(e);return /(auto|scroll)/.test(s.overflowY)&&e.scrollHeight>e.clientHeight+4&&vis(e)});
 const nestedCount=els.filter(e=>els.some(o=>o!==e&&o.contains(e))).length;
 // chrome area (header/toolbar/grip/sort rows) within viewport
 const area=sel=>[...document.querySelectorAll(sel)].filter(vis).reduce((a,e)=>{const r=e.getBoundingClientRect();const h=Math.max(0,Math.min(r.bottom,barTop)-Math.max(r.top,0)),w=Math.max(0,Math.min(r.right,W)-Math.max(r.left,0));return a+h*w},0);
 const viewArea=W*barTop;
 const chromeArea=area('.workspace-toolbar')+area('.workspace-module-header');
 return {viewport:{W,H,barTop:Math.round(barTop)},doc:{scrollW:document.documentElement.scrollWidth,scrollH:document.documentElement.scrollHeight,hOverflow:document.documentElement.scrollWidth>W+1,vOverflow:document.documentElement.scrollHeight>H+1},
  clickables:{total_dom:cand.length,onscreen:onscreen.length,play:play.length,play_enabled:play.filter(e=>!disabled(e)).length,chrome:chrome.length,listTools:list.length,playLabels:play.map(label),chromeLabels:chrome.map(label),listLabels:list.map(label)},
  scrollers,nestedScrollers:nestedCount,chromeAreaPct:+(100*chromeArea/viewArea).toFixed(1),
  buttons:{dom:document.querySelectorAll('button').length,visible:[...document.querySelectorAll('button')].filter(vis).length}};
};
