import {element as el} from '/canvas.mjs';
const evidenceLink=(title,href)=>{const link=el('a',title);link.href=href;link.style.color='#b9dfb3';return link;};
export async function campaignSequencingView({main}){
 const sheet=el('article',null,'sheet findings-sheet'),heading=el('h2','Reading and connected campaigns');
 sheet.append(heading,el('p','Read-ahead ≠ connected gameplay. Indexed source spans, connected-route evidence and independently tested mechanics describe different work. A later mechanic receipt does not automatically advance the connected campaign.'));
 const label=el('label','Protagonist '),select=el('select');select.setAttribute('aria-label','Protagonist');
 select.append(new Option('Klein Moretti','lotm'),new Option('Zorian Kazinski','mol'));label.append(select);const body=el('div');sheet.append(label,body);main.replaceChildren(sheet);
 async function show(){const world=select.value;body.textContent='Loading reviewed evidence…';
  try{const response=await fetch('/campaign-sequencing?world='+encodeURIComponent(world));if(!response.ok)throw Error();const report=await response.json();if(select.value!==world||!sheet.isConnected)return;
   body.replaceChildren();body.append(el('h3',report.protagonist));
   const nav=el('p'),reading=evidenceLink('Open this world’s reading records',report.readingHref),work=evidenceLink('Open implementation reports',report.workbenchHref);nav.append(reading,' · ',work);body.append(nav);
   const grid=el('div');grid.style.display='grid';grid.style.gridTemplateColumns='repeat(auto-fit,minmax(min(100%,24rem),1fr))';grid.style.gap='1.5rem';body.append(grid);
   const index=el('section');index.style.minWidth='0';index.append(el('h3','Indexed source / read-ahead'),el('p',report.indexed.playStatus),el('p',report.indexed.note));
   if(report.indexed.status==='indexed'){
    index.append(el('small',`${report.indexed.indexedSlices??'Unknown'} indexed slices · snapshot ${report.snapshot.builtAt||'date unavailable'}`));
    const details=el('details');details.append(el('summary','Observed chapter-locator spans'));
    const list=el('ul');for(const span of report.indexed.spans)list.append(el('li',`${span.language} · ${span.book?'book '+span.book:'book not encoded'} · chapters ${span.first}–${span.last} · ${span.observed} distinct chapters observed`));
    if(!report.indexed.spans.length)list.append(el('li','No supported chapter locators in the admitted index.'));details.append(list);index.append(details);
   }grid.append(index);
   for(const [title,key]of [['Connected gameplay evidence','connected'],['Independently tested mechanics','mechanics']]){
    const section=el('section');section.style.minWidth='0';section.append(el('h3',title));if(key==='connected')section.append(el('p',report.currentReplay));
    if(!report[key].length)section.append(el('p','No reviewed claim registered here; this is unknown, not a missing capability.'));
    for(const claim of report[key]){section.append(el('h4',claim.label),el('p',claim.playStatus),el('p',claim.status==='unknown'?'Unknown: '+claim.note:claim.statement));
     if(claim.playGap&&claim.playGap!==claim.note)section.append(el('p',claim.playGap));
     if(claim.note&&claim.status!=='unknown')section.append(el('small',claim.note));
     if(claim.bundles)section.append(el('p','Historical tested bundles: '+claim.bundles.map(x=>x.slice(0,16)).join(', ')));
     if(claim.testedBundleSha256){const identity=el('p','Tested served bundle: '+claim.testedBundleSha256.slice(0,16));identity.title=claim.testedBundleSha256;section.append(identity);}
     if(claim.recordedReviewDifferences?.length)section.append(el('p','The audit records mounted-pack review differences in '+claim.recordedReviewDifferences.map(x=>x.toUpperCase()).join(', ')+'. Current compatibility is not established by this chain.'));
     if(claim.reviewedAt)section.append(el('small','Owner evidence reviewed '+claim.reviewedAt+'; not an automatic gameplay rerun.'));
     const refs=new Set(claim.evidence.map(e=>e.path+' · '+e.heading));for(const ref of refs){const cite=el('p','Source: '+ref);cite.style.overflowWrap='anywhere';cite.style.fontSize='.8rem';section.append(cite);}
     if(claim.href)section.append(evidenceLink('Open related record or work',claim.href));
    }grid.append(section);
   }
  }catch{body.textContent='Campaign evidence is unavailable. No endpoint is inferred from reading coverage.';}
 }
 select.onchange=show;await show();
}
