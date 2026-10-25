import {labelControl} from './ui/panel_sections.js';
// Small desktop panel for the HTP45 owned-place clock pilot (proposal). Mobile layout deferred.
import {definePanel} from './panel_kit.js';
import {PLACE_DIALS,SHELF_LIFE,OBSERVER_ROUTES} from './owned_place_clock.js';
const el=(tag,text)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;return n;};
const PLACE='cottage';
const nameOf=key=>{try{return JSON.parse(key).id;}catch{return '';}};
export function createPlaceClockPanel({read,state,quote,execute,project}) {
    const panel=el('section');panel.id='place_clock_panel';panel.className='expedition_panel';
    const title=el('h2','Hearthside clock'),notice=el('p'),intro=el('p',`${PLACE_DIALS[PLACE].why} Ratios, prices and shelf lives are proposed balance.`);
    notice.setAttribute('role','status');
    const route=el('select');route.setAttribute('aria-label','How you read the hearth');
    for(const id of Object.keys(OBSERVER_ROUTES)){const o=el('option',id==='present'?'By eye':'By sand glass');o.value=id;route.append(o);}
    const view=el('div'),actions=el('div');panel.append(title,intro,labelControl(route,'How you read the hearth'),view,actions,notice);
    function act(label,request){
        const b=el('button',label),reason=el('small'),wrap=el('div');b.type='button';
        b.dataset.placeClockAction=request.type+(request.days?':'+request.days:'')+(request.key?':'+nameOf(request.key):'');
        try{quote(request);}catch(e){reason.textContent=e.message;b.disabled=true;}
        b.onclick=()=>{try{notice.textContent=execute(quote(request)).message;}catch(e){notice.textContent=e.message;}render();};
        wrap.append(b,reason);actions.append(wrap);
    }
    function render(){
        if(!panel.isConnected)return;
        const c=read(),s=state();view.replaceChildren();actions.replaceChildren();
        const p=project(PLACE,route.value);
        if(!p.visible)view.append(el('p',p.reason||'You do not keep this place.'));
        else for(const l of p.lines)view.append(el('p',l));
        const place=s?.places?.[PLACE];
        act('Feed the hearth · 1 day · 2 coins',{type:'still',place:PLACE,days:1});
        act('Feed the hearth · 3 days · 6 coins',{type:'still',place:PLACE,days:3});
        act('Release the hearth · pay owed days',{type:'release',place:PLACE});
        act('Make the reopening offering · 4 coins',{type:'reopen',place:PLACE});
        for(const key of Object.keys(c.inventory))if(Object.hasOwn(SHELF_LIFE,nameOf(key)))act(`Set ${nameOf(key)} on the hearth shelf`,{type:'store',place:PLACE,key});
        for(const r of place?.larder||[])act(`Take ${nameOf(r.key)} from the shelf`,{type:'take',place:PLACE,key:r.key});
        if(!s?.sandglass)act('Buy a sand glass · 3 coins',{type:'sandglass',place:PLACE});
    }
    route.onchange=render;
    definePanel({id:'place_clock',title:'Hearthside clock',role:'actions',node:panel,home:document.getElementById('main_content'),defaultDock:'center',
        discovered:()=>read().owned.includes(PLACE),eligible:()=>read().owned.includes(PLACE)});
    render();return {render,panel};
}
