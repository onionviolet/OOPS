// Native material variants are exact inventory keys. Selection inspects; buttons
// explicitly commit through the existing recipe/transaction owner.
import {bindSubjectGesture} from './recipe_connections.js';
export function mountMaterialChoice(row, {key, count, need, name, select, commit, allowed = true, reason = ''}) {
    row.tabIndex=0;row.setAttribute('role','group');row.setAttribute('aria-label',`${name}: ${count} carried, ${need} per attempt`);
    const label=row.firstElementChild;label.tabIndex=0;label.setAttribute('role','button');label.title='Select this exact material variant. Inspection uses nothing.';
    const choose=()=>{select();row.classList.add('selected_material');};
    bindSubjectGesture(label,()=>key, event=>{event.stopPropagation();choose();});
    label.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();choose();}});
    const status=row.ownerDocument.createElement('span');status.textContent=` · ${count}/${need} carried · ${Math.floor(count/need)} attempts${allowed?'':` · ${reason||'Unavailable'}`}`;row.append(status);
    const actions=row.ownerDocument.createElement('span');actions.className='material-craft-actions';
    for(const [amount,text]of [[1,'Craft 1'],[5,'5'],[10,'10'],[Infinity,'All']]){
        const b=row.ownerDocument.createElement('button');b.type='button';b.textContent=text;b.dataset.materialCraft=String(amount);b.disabled=count<need||!allowed;
        bindSubjectGesture(b,()=>key,event=>{event.stopPropagation();choose();commit(amount);});actions.append(b);
    }
    row.append(actions);
}
