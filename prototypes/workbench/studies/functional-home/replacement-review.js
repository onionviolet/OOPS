// Disposable UI component. Domain ports own compatibility, predictions and commitments.
// The renderer does not know about furniture, item keys, coins or model arithmetic.
let nextReviewId=0;
export function createReplacementReview({read,preview,commit,escape:esc}) {
 const reasonId='replacement-blocked-reason-'+(++nextReviewId);
 const node=document.createElement('section');node.className='fh-section replacement-review';node.setAttribute('aria-label','Compare replacement');
 let selected='',review=null,result='',signature='';
 function update(force=false){
  const m=read();if(!m)return;node.setAttribute('aria-label',m.title);const choices=m.options||[];
  if(!choices.some(o=>o.id===selected)){selected=choices.find(o=>o.available)?.id||choices[0]?.id||'';review=null;}
  const stale=!!review&&review.identity!==m.identity;
  const sig=JSON.stringify([m,selected,review,result,stale]);if(!force&&sig===signature)return;signature=sig;
  const effectRows=rows=>rows.map(r=>`<tr><td>${esc(r.label)}</td><td>${esc(r.before)}</td><td>${esc(r.after)}</td></tr>`).join('');
  const changed=review?.effects.filter(r=>r.changed!==false)||[],unchanged=review?.effects.filter(r=>r.changed===false)||[];
  const active=document.activeElement,focus=node.contains(active)?active.dataset.reviewControl:null;
  node.innerHTML=`<h3>${esc(m.title)}</h3><p class="fh-meta">${esc(m.current)}</p><label class="replacement-choice">${esc(m.choiceLabel||'Compatible options')} <select data-review-control="choice" aria-label="Replacement option">${choices.map(o=>`<option value="${esc(o.id)}" ${selected===o.id?'selected':''}>${esc(o.label)}</option>`).join('')}</select></label><p class="fh-meta">${esc(choices.find(o=>o.id===selected)?.reason||'')}</p><button type="button" data-review-control="review" ${!selected?'disabled':''}>${esc(m.reviewLabel||'Review replacement')}</button>${review?`<div class="replacement-quote"><p>${esc(review.summary)}</p><table aria-label="Before and after effects"><thead><tr><th>Effect</th><th>Before</th><th>After</th></tr></thead><tbody>${effectRows(changed)}</tbody></table>${!changed.length?'<p>No numerical effect changes under current conditions.</p>':''}${unchanged.length?`<details><summary>${unchanged.length} unchanged effects</summary><table aria-label="Unchanged effects"><tbody>${effectRows(unchanged)}</tbody></table></details>`:''}<p class="replacement-cost">${esc(review.cost)}</p><p>${esc(review.disposition)}</p><p class="ui-action-reason" id="${reasonId}">${esc(stale?'State changed. Review replacement again before committing.':review.reason||'')}</p><button type="button" data-review-control="commit" aria-describedby="${reasonId}" ${stale||!review.eligible?'disabled':''}>${esc(review.action||'Unavailable')}</button></div>`:''}<p role="status" class="replacement-result">${esc(result||m.help)}</p>`;
  if(focus)node.querySelector(`[data-review-control="${focus}"]`)?.focus({preventScroll:true});
 }
 node.addEventListener('change',e=>{if(e.target.dataset.reviewControl==='choice'){selected=e.target.value;review=null;result='';update(true);}});
 node.addEventListener('click',e=>{const control=e.target.closest('button')?.dataset.reviewControl;
  if(control==='review'){review=preview(selected);result='';update(true);}
  if(control==='commit'){try{if(!review||review.identity!==read().identity)throw Error('State changed. Review replacement again.');result=commit(review);review=null;}catch(e){result=e.message;review=null;}update(true);node.querySelector('[data-review-control="review"]')?.focus({preventScroll:true});}
 });
 return {node,update};
}
