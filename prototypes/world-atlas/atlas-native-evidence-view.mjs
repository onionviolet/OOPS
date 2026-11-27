import {element as el} from '/canvas.mjs';
import {paidInnEvidenceView} from '/paid-inn-evidence-view.mjs';
import {breakfastEvidenceView} from '/breakfast-evidence-view.mjs';
const buildLabel={exact:'Exact checkout build',different:'Tested on another build',unavailable:'Checkout comparison unavailable'};
export async function nativePlayEvidenceView({main}){
 if(location.hash==='#workbench/play-evidence/fang-first-night/breakfast')return breakfastEvidenceView({main,element:el});
 if(location.hash==='#workbench/play-evidence/fang-first-night/paid-inn')return paidInnEvidenceView({main,element:el});
 const sheet=el('article',null,'sheet findings-sheet');sheet.style.overflowWrap='anywhere';
 sheet.append(el('h2','Native play evidence'),el('p','Playable marks an exercised action on the named build. Partial records explain which part of the evidence is missing.'));
 const focus=location.hash.split('/')[2]||null;
 const refresh=el('button','Compare checkout build'),body=el('div');sheet.append(refresh,body);main.replaceChildren(sheet);
 async function show(){refresh.disabled=true;body.textContent='Reading public playtest receipts…';
  try{
   const response=await fetch('/native-play-evidence',{cache:'no-store'});if(!response.ok)throw Error();const report=await response.json();if(!sheet.isConnected)return;
   body.replaceChildren(el('p',report.currentBundleSha256?'Checkout web bundle: '+report.currentBundleSha256:'Checkout web bundle is unavailable.'));
   for(const entry of report.entries){
    const card=el('section');card.id='native-evidence-'+entry.id;card.dataset.nativeEvidence=entry.id;card.style.marginBlock='1.5rem';card.style.overflowWrap='anywhere';
    card.append(el('h3',entry.title),el('p',entry.playStatus,'atlas-find-status-note'));
    if(entry.playGap)card.append(el('p',entry.playGap));
    card.append(el('p',entry.pov),el('h4','Where to play'),el('p',entry.where),el('h4','Setup and scope'),el('p',entry.setup));
    if(entry.playReceipt){const {life,action,build}=entry.playReceipt;card.append(el('p',life+' · '+action+' · Build '+build));}
    if(entry.evidenceKind==='authored-record')card.append(el('p','Documented checkpoint record. No machine-readable native playtest receipt is registered for this card.'));
    if(entry.outcome)card.append(el('h4','Played result'),el('p',entry.outcome));else card.append(el('p','A registered receipt changed or is unavailable. Its played-result claim is withheld; this does not mean the feature is absent.'));
    const link=el('a','Open related Atlas record');link.href=entry.relatedHref;card.append(link);
    for(const reference of entry.references||[]){const block=el('p');if(reference.status==='verified'){const a=el('a',reference.label);a.href=reference.href;block.append(a);}else block.textContent=reference.label+' · record changed or unavailable';block.append(el('span',' · '+reference.scope));card.append(block);}
    for(const proof of entry.receipts){
     const details=el('details'),label=proof.status==='changed'?'Changed receipt':proof.status==='unavailable'?'Receipt unavailable':buildLabel[proof.buildComparison];
     details.append(el('summary',proof.id+' · '+label),el('p','Evidence recorded '+proof.evidenceDate+' · '+proof.scope));
     details.append(el('p','Registered receipt SHA-256: '+proof.expectedSha256));
     if(proof.actualSha256)details.append(el('p','Observed receipt SHA-256: '+proof.actualSha256));
     if(proof.testedBundleSha256)details.append(el('p','Tested native bundle SHA-256: '+proof.testedBundleSha256));
     if(proof.buildComparison==='different')details.append(el('p','This receipt was tested on another build. A different hash does not establish that the feature is absent.'));
     card.append(details);
    }
    body.append(card);
    if(entry.id===focus){const heading=card.querySelector('h3');heading.tabIndex=-1;requestAnimationFrame(()=>{if(card.isConnected){heading.focus({preventScroll:true});card.scrollIntoView({block:'start'});}});}
   }
  }catch{body.textContent='Native play evidence is unavailable. No gameplay result is inferred.';}finally{refresh.disabled=false;}
 }
 refresh.onclick=show;await show();
}
