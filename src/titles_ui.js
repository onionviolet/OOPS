import {title_families} from './titles.js';
const node=(tag,text='',cls='')=>{const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n;};
const family_names={combat:'Combat',endurance:'Endurance',craft:'Craft and gathering',life:'Life'};
const fmt=n=>Math.floor(n).toLocaleString('en-US');

// Character tab panel: held titles with their bonus, unheld ones with progress so the goal is legible.
export function createTitlesPanel({read}) {
    const panel=node('details');panel.id='titles_panel';
    const summary=node('summary','Titles'),body=node('div');panel.append(summary,body);
    let signature='';
    function render() {
        const rows=read();const next=JSON.stringify(rows);
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
        }
        const host=document.getElementById('character_bio_div');if(host && panel.parentElement!==host)host.append(panel);
    }
    render();const timer=setInterval(render,2000);return {render,destroy:()=>{clearInterval(timer);panel.remove();}};
}
