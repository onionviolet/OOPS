import {createNativeDiscoveryFeedback} from './native_discovery_feedback.js';
import {title_families} from './titles.js';
const node=(tag,text='',cls='')=>{const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n;};
const family_names={combat:'Combat',endurance:'Endurance',craft:'Craft and gathering',life:'Life'};
const fmt=n=>Math.floor(n).toLocaleString('en-US');

// Character tab panel: held titles with their bonus, unheld ones with progress so the goal is legible.
export function createTitlesPanel({read,readSettings=()=>({}),readWorn,selectWorn,readTraining}) {
    const panel=node('details');panel.id='titles_panel';
    const summary=node('summary','Titles'),body=node('div');panel.append(summary,body);
    const feedback=createNativeDiscoveryFeedback({container:panel,readSettings,eventType:'native-title-discovery',anchorAttribute:'data-title-id',singular:'Title earned',plural:'titles',resolve:id=>{const row=read().find(r=>r.id===id&&r.held);return row?{label:row.name}:null;}});
    let signature='';
    function render() {
        const rows=read(),worn=readWorn?.(),training=readTraining?.();
        const next=JSON.stringify({rows,worn,training});
        if(next!==signature){
            signature=next;
            summary.textContent=`Titles · ${rows.filter(r=>r.held).length} / ${rows.length}`;
            body.replaceChildren(...title_families.map(family=>{
                const group=rows.filter(r=>r.family===family),list=node('ul');
                list.replaceChildren(...group.map(r=>{
                    const li=node('li','',r.held?'title_held':'title_locked');li.dataset.titleId=r.id;
                    li.append(node('b',r.name),node('span',` · ${r.text}`));
                    if(r.bonus)li.append(node('span',` (${r.bonus})`,'title_bonus'));
                    if(!r.held)li.append(node('span',` ${fmt(r.progress)} / ${fmt(r.at)}`,'title_progress'));
                    return li;
                }));
                const section=node('div');section.append(node('div',`${family_names[family]} · ${group.filter(r=>r.held).length} / ${group.length}`,'title_family'),list);
                return section;
            }));
            if(training)body.append(node('p',training.text,'title_training'));
            if(worn && selectWorn) {
                const section=node('div'),label=node('label'),toggle=node('input');
                toggle.type='checkbox';toggle.checked=worn.enabled;
                toggle.addEventListener('change',()=>{selectWorn(worn.worn,toggle.checked);render();});
                label.append(toggle,document.createTextNode(' Wear a title'));
                const select=node('select');select.setAttribute('aria-label','Worn title');
                const none=node('option','No worn title');none.value='';select.append(none);
                for(const choice of worn.choices){const option=node('option',choice.name);option.value=choice.id;select.append(option);}
                select.value=worn.worn || '';select.disabled=!worn.enabled;
                select.addEventListener('change',()=>{selectWorn(select.value || null,worn.enabled);render();});
                section.append(label,select,node('p',`Renown: ${worn.renown}. ${worn.text}`));body.append(section);
            }
        }
        const host=document.getElementById('character_bio_div');if(host && panel.parentElement!==host)host.append(panel);
    }
    render();const timer=setInterval(render,2000);return {render,announce(ids){for(const id of ids)feedback.publish({type:'native-title-discovery',id,settled:true});},resetFeedback:()=>feedback.reset(),destroy:()=>{clearInterval(timer);feedback.destroy();panel.remove();}};
}
