import {definePanel} from './panel_kit.js';
import {lifeRecordView} from './life_record.js';
const node=(tag,text='')=>{const n=document.createElement(tag);n.textContent=text;return n;};
// Separate mount: event-feed files remain with the experience GM.
export function createLifeRecordPanel({read,remember}) {
    const panel=node('details');panel.id='life_record_panel';panel.open=true;
    const summary=node('summary','Remembered years'),button=node('button','Remember this day'),status=node('p'),past=node('details'),list=node('ol');
    button.type='button';button.id='life_remember_day';const locale=node('select');locale.setAttribute('aria-label','Memory language');for(const [id,label] of [['english','English memories'],['chinese','中文回忆']]){const o=node('option',label);o.value=id;locale.append(o);}locale.onchange=()=>{signature='';render();};past.append(node('summary','Years remembered'),locale,list);panel.append(summary,button,status,past);
    let signature='';
    button.addEventListener('click',()=>{try {remember();status.textContent='You hold this day in memory.';}catch(e){status.textContent=e.message;}render();});
    function render() {
        const s=read(); const view=lifeRecordView(s.record,locale.value);button.disabled=!s.canWrite;
        const next=JSON.stringify(view);if(next!==signature){signature=next;summary.textContent=`Remembered years · ${view.count} memories`;
            list.replaceChildren(...view.recent.map(e=>node('li',`Year ${e.year}: ${e.text}`)),...view.years.map(y=>node('li',`Year ${y.year}: ${y.count} moments remembered. ${y.highlights.join(' ')}`)),...(view.earlier.count?[node('li',`Through year ${view.earlier.throughYear}: ${view.earlier.count} moments from your earlier years.`)]:[]));}
    }
    definePanel({id:'memories',title:'Remembered years',role:'records',node:panel,home:document.getElementById('main_content'),defaultDock:'center',after:'records',discovered:()=>!panel.hidden,eligible:()=>!panel.hidden});
    render();const timer=setInterval(render,2000);return {render,destroy:()=>{clearInterval(timer);panel.remove();}};
}
