// Royal Road -> IndexedDB route. Run in a royalroad.com tab via javascript_tool.
// 1) CACHE: set FID and DB, run once, then poll window.__n until window.__done.
// const FID='106630', DB='yairpg_vd';
// window.__done=0;window.__n=0;(async()=>{const h=await fetch('/fiction/'+FID).then(r=>r.text());
// const ch=[...new Set([...h.matchAll(new RegExp('/fiction/'+FID+'/[^/"]+/chapter/\\d+/[^"\'\\\\]+','g'))].map(m=>m[0]))];
// const db=await new Promise((res,rej)=>{const q=indexedDB.open(DB,1);q.onupgradeneeded=()=>q.result.createObjectStore('ch');q.onsuccess=()=>res(q.result);q.onerror=rej});
// for(let i=0;i<ch.length;i++){let r=await fetch(ch[i]);if(r.status!==200){await new Promise(x=>setTimeout(x,4000));r=await fetch(ch[i])}
//  const d=new DOMParser().parseFromString(await r.text(),'text/html');const t=(d.querySelector('h1')||{}).textContent?.trim()||'';
//  const c=d.querySelector('.chapter-content');const b=c?[...c.querySelectorAll('p')].map(p=>p.textContent.trim()).filter(Boolean).join('\n\n'):'';
//  await new Promise(res=>{const x=db.transaction('ch','readwrite');x.objectStore('ch').put([t,b],String(i+1).padStart(3,'0'));x.oncomplete=res});
//  window.__n=i+1;await new Promise(x=>setTimeout(x,600))}window.__done=1})();
// 2) GREP: edit DB name below ('yairpg_vd') and KW, then run.
// Paste into javascript_tool on a royalroad.com tab. Edit KW / WIN / MAX.
// Returns short context windows around keyword hits from the IndexedDB copy.
const KW=['System'], WIN=220, MAX=40, FROM=1, TO=98;
const db=await new Promise((res,rej)=>{const q=indexedDB.open('yairpg_vd',1);q.onsuccess=()=>res(q.result);q.onerror=rej});
const all=await new Promise(res=>{const out={};const t=db.transaction('ch').objectStore('ch').openCursor();t.onsuccess=e=>{const c=e.target.result;if(c){out[c.key]=c.value;c.continue()}else res(out)}});
const re=new RegExp(KW.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'gi');const hits=[];
for(const k of Object.keys(all).sort()){const n=+k;if(n<FROM||n>TO)continue;const [title,body]=all[k];let m;re.lastIndex=0;while((m=re.exec(body))&&hits.length<MAX){hits.push(k+' | '+title+' | '+body.slice(Math.max(0,m.index-WIN),m.index+WIN).replace(/\s+/g,' '));re.lastIndex=m.index+WIN}}
hits.join('\n\n')
