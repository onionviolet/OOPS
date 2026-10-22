import {FREIGHT_KEYS,FIELD_EXTENSION as E,freightOrderId} from './field_works_extension_content.js';
import {HOME_WORKERS} from './home_workers.js';
import {previewFieldWorksCommand} from './field_works_projection.js';
const node=(tag,text='')=>{const el=document.createElement(tag);el.textContent=text;return el;};
export function createFieldExtensionControls({groups,registry,read,run,K,refresh}) {
    const rack=node('p'),freight=node('p'),housing=node('p'),picker=node('div');rack.dataset.worksRack='';freight.dataset.worksFreight='';housing.dataset.worksHousing='';
    groups.get('drying').children[0].after(rack);groups.get('freight').children[0].after(freight,housing,picker);
    const key=node('select'),count=node('select');key.dataset.freightKey='';count.dataset.freightCount='';
    const keyLabel=node('label','Parcel stock '),countLabel=node('label','Units ');keyLabel.append(key);countLabel.append(count);
    for(const k of FREIGHT_KEYS){const option=node('option',JSON.parse(K[k]).id);option.value=k;key.append(option);}
    for(const n of [1,3]){const option=node('option',String(n));option.value=String(n);count.append(option);}
    const order=node('button','Fund selected parcel'),quote=node('p');order.type='button';order.dataset.worksCommand='freight_order';
    const selection=()=>freightOrderId(read().context.facts.location==='Village'?'village':'shack',key.value,Number(count.value));
    order.onclick=()=>run({type:'command',id:selection()});picker.append(keyLabel,countLabel,order,quote);
    let latest=null;
    const render=(state,context,view,snapshot)=>{
        latest={state,context,view,snapshot};const r=view?.rack,g=view?.freight;
        rack.hidden=!r;rack.textContent=r?`Outdoor rack: ${r.wet} wet; ${r.dry} dry vessels. ${r.progress}/${E.dryMinutes} consecutive drying minutes. ${r.running?'Working':'Paused'}; ${r.covered?'covered against rain':'exposed'}. ${r.raining===null?'Native weather clock unavailable.':r.raining?'Rain now; exposed drying resets even while paused.':'Dry weather now.'} Adding wet pieces resets this batch; collect actual outputs here.`:'';
        freight.hidden=picker.hidden=!g;freight.textContent=g?`Road carrier at ${g.location}. ${g.job?`${g.job.label}: ${Math.max(0,g.job.due-state.clock)} min remain; cargo is reserved in transit.`:g.intent==='none'?'No parcel booked.':`${g.intent}; ${g.assigned?'waiting for shift, cargo, room or the next departure':'paused'}.`} Unearned trips ${g.funded}; earned wages ${g.earned}. `+Object.entries(g.depots).map(([site,d])=>`${site==='shack'?'Shack':'Village'} depot: ${d.space}/${E.capacity} unreserved places; ${Object.entries(d.stock).map(([k,n])=>`${JSON.parse(k).id} ×${n}`).join(', ')||'no held stock'}.`).join(' '):'';
        housing.hidden=!view||!Object.keys(view.housing).length;housing.textContent=view?Object.entries(view.housing).map(([id,h])=>`${HOME_WORKERS[id]}: ${h.label}`).join(' ')+ (Object.keys(view.housing).length?' Offer a free owned guest room and rota through Homes at that residence.':''):'';
        if(g&&g.intent!=='none'){const [site,k,n]=g.intent.split('.');freight.textContent=freight.textContent.replace(g.intent,`${n} ${JSON.parse(K[k]).id}, ${site==='shack'?'Shack → Village':'Village → Shack'}`);}
        if(g){const q=previewFieldWorksCommand(state,registry,selection(),context);quote.textContent=q.eligible?q.label:q.reasons.join(' ');order.disabled=!snapshot.enabled||!!snapshot.error||!q.eligible;}
    };
    key.onchange=count.onchange=()=>{if(latest)refresh();};
    return {render,stockKey:()=>key.value};
}
