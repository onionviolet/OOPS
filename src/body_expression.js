// Display-only latest observed response. The native observer supplies a settled
// receipt; this owns no health, skill, clock, save or sound. Load clears it.
let latest=null;const readers=new Set();
export function publishBodyExpression(receipt=null){latest=receipt?.pose?receipt:null;for(const render of readers)render(latest);}
export function createBodyExpression(doc=document){
 const node=doc.createElement('span'),detail=doc.createElement('p'),pose=doc.createElement('span'),text=doc.createElement('span');node.className='body-expression';detail.className='body-expression-detail';pose.className='palette-body-pose';pose.textContent='人';pose.setAttribute('aria-hidden','true');node.append(pose,text);
 const render=receipt=>{node.hidden=!receipt;detail.hidden=!receipt;if(!receipt){pose.removeAttribute('data-pose');text.textContent='';detail.textContent='';node.removeAttribute('title');return;}pose.dataset.pose=receipt.pose;text.textContent=receipt.shortText||'Observed response';detail.textContent=receipt.text;node.title=receipt.text;};
 readers.add(render);render(latest);return {node,detail,destroy(){readers.delete(render);node.remove();detail.remove();}};
}
