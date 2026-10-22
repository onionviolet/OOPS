import {renderHomeWork} from './home_building_panel.js';
import {HOME_WORKERS} from './home_workers.js';
import {centerModes} from './center_modes.js';
import {definePanel} from './panel_kit.js';
import {expandWorkspaceModule} from './workspace_layout.js';
import {DOMICILE_FURNITURE as F,HOME_PLACES as P,HOME_STARTS as S,HOME_IMPROVEMENTS as I,HOME_SUPPLIES,HOME_SITE,HOME_MATERIALS as M,HOME_BUILDINGS as B} from './home_content.js';
import {homeUsable,homeCapacity,homeComfort,homeDescription,householdHomeContext} from './home_model.js';
import {householdPresentation} from './absorb_p23/household/host.js';
import {createHouseholdScene} from './household_scene.js';
import {createMeterBar} from './meter_bar.js';
const el=(tag,text)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;return n;};
const select=label=>{const n=el('select');n.setAttribute('aria-label',label);return n;};
const option=(value,label)=>{const n=el('option',label);n.value=value;return n;};
export function createHomePanel({read,quote,execute}) {
    const panel=el('section');panel.id='home_panel';panel.className='expedition_panel';
    const title=el('h2','Homes and belongings'),notice=el('p');notice.setAttribute('role','status');
    const intro=el('p','Your rights, furnishings and goods stay with each home. Prices and comfort values are proposed balance.');
    const summary=el('p'),homes=select('Inspect residence'),detail=el('div'),start=el('details'),startBody=el('div'),market=el('details'),marketBody=el('div'),history=el('details'),historyBody=el('div'),building=el('details'),buildingBody=el('div');
    start.dataset.homeBeginnings='';start.append(el('summary','Choose a home beginning'),el('p','Optional fresh beginnings. Read the body, home rights and starting goods before choosing. The ordinary Village beginning remains available.'),startBody);
    market.append(el('summary','Village home supplier and lodging'),marketBody);history.append(el('summary','Home history'),historyBody);
    building.append(el('summary','Build a home from the land'),buildingBody);panel.append(title,intro,summary,homes,detail,building,start,market,history,notice);
    let signature='',selected='',view,shopSelection='',shopNode=null,nameDrafts=new Map(),depositSelections=new Map();
    const buttons=new Map();
    function action(parent,id,label,request) {
        let row=buttons.get(id);if(!row){const button=el('button',label),reason=el('small'),wrap=el('div');button.type='button';button.dataset.homeAction=id;wrap.append(button,reason);row={button,reason,wrap,request:null,token:null};buttons.set(id,row);
            button.onpointerdown=()=>{row.token=quote(row.request);};
            button.onclick=()=>{try{const q=row.token||quote(row.request);row.token=null;const result=execute(q);if(result.location&&centerModes().mode==='workspace:homes'){centerModes().back();expandWorkspaceModule('homes');}notice.textContent=q.result.message;signature='';render();}catch(e){notice.textContent=e.message;row.token=null;signature='';render();}};
        }
        row.request=request;row.button.textContent=label;const q=quote(request);row.button.disabled=!q.eligible;row.reason.textContent=q.eligible?'':q.reason;row.reason.hidden=q.eligible;if(row.wrap.parentElement!==parent)parent.append(row.wrap);
    }
    const section=(parent,label)=>{const d=el('details');d.append(el('summary',label));parent.append(d);return d;};
    function render() {
        if(!panel.isConnected)return;view=read();const sig=JSON.stringify([view,selected]);if(sig===signature)return;signature=sig;
        summary.textContent=view.visible?`${view.homes.length} residence${view.homes.length===1?'':'s'} · ${view.context.body.form} body · ${view.context.money} coins`:'Your known homes are elsewhere.';
        if(!view.homes.some(h=>h.id===selected))selected=view.here?.id||view.state.primary||view.homes[0]?.id||'';
        const values=view.homes.map(h=>[h.id,`${h.name} · ${h.tenure}${view.here?.id===h.id?' · here':''}`]);
        if(JSON.stringify(values)!==homes.dataset.rows){homes.replaceChildren(...values.map(([id,label])=>option(id,label)));homes.dataset.rows=JSON.stringify(values);}homes.value=selected;homes.hidden=!values.length;
        const active=document.activeElement,focusLabel=panel.contains(active)?active.getAttribute('aria-label'):null,selection=active?.tagName==='INPUT'?[active.selectionStart,active.selectionEnd]:null;
        const oldOpen=[...detail.querySelectorAll('details[open]')].map(n=>n.firstChild.textContent),focused=document.activeElement?.dataset.homeAction;
        detail.replaceChildren();startBody.replaceChildren();historyBody.replaceChildren();
        const c=view.context,h=view.homes.find(h=>h.id===selected);
        if(h) {
            const p=P[h.id],local=view.here?.id===h.id,usable=homeUsable(h,c);
            detail.append(el('h3',h.name),el('p',`${homeDescription(h)} ${h.owner==='player'?'Title: yours.':`Owner: ${h.tenure==='rented'?'your host':'the household'}. Your occupancy is separate from title.`}`),el('p',`${local?'You are here.':`Visit ${p.location} through the native travel list.`} ${usable?'Home services available for this body.':'Home services currently unavailable for this body or lodging term.'}`));
            if(p.period) {const meter=createMeterBar();meter.update({id:'home-rent',kind:'pool',label:'Prepaid lodging',value:Math.max(0,h.paidUntil-c.clock),max:Math.max(p.period,h.paidUntil-c.clock),note:'Played minutes remaining. Renew explicitly; no automatic debt or deletion of goods.'});detail.append(meter.node);action(detail,'renew:'+h.id,`Renew lodging · ${p.price} coins / played day`,{type:'renew',home:h.id});}
            const comfort=homeComfort(h);detail.append(el('p',`${comfort.label} · ${comfort.score} furnishing and room comfort. Furnishing details show each active benefit.`));
            action(detail,'primary:'+h.id,'Make this your main residence',{type:'primary',home:h.id});
            if(h.id==='shack'&&h.tenure==='shared')action(detail,'deed:shack','Buy the Shack deed · 60 coins',{type:'deed',home:'shack'});
            if(h.owner==='player'&&h.tenure==='owned') {const label=el('label','Home name '),input=el('input');input.value=nameDrafts.get(h.id)??h.name;input.oninput=()=>nameDrafts.set(h.id,input.value);input.maxLength=60;input.setAttribute('aria-label','Home name');label.append(input);const rename=el('button','Name your home');rename.type='button';rename.dataset.homeRename='';rename.disabled=!local||!usable||!view.ready;rename.onclick=()=>{try{execute(quote({type:'rename',home:h.id,name:input.value}));nameDrafts.delete(h.id);notice.textContent='Home name saved.';render();}catch(e){notice.textContent=e.message;}};detail.append(label,rename);}
            if(local&&usable&&h.fixtures.hearth&&h.fixtures.tableware)detail.append(el('p',c.craftingKnown?'Home kitchen ready: use Cooking for tier-one meals here.':'Kitchen fitted. Learn the ordinary crafting basics to use its recipes.'));
            if(local&&usable&&h.fixtures.incense)detail.append(el('p',c.meditationKnown?'Quiet practice ready: use the meditation activity here.':'Quiet practice space fitted. Learn Meditation to use it here.'));
            const furniture=section(detail,'Furnishings and selected slots');
            if(!Object.keys(h.fixtures).length)furniture.append(el('p','No installed furnishings.'));
            for(const [slot,row]of Object.entries(h.fixtures)){const f=F[JSON.parse(row.key).id];furniture.append(el('p',`${slot}: ${f.name} · ${row.owner==='player'?'yours':'provided by owner'}. ${f.description}`));action(furniture,`remove:${h.id}:${slot}`,'Pack '+f.name,{type:'remove',home:h.id,slot});}
            for(const [key,n]of Object.entries(c.inventory))if(F[JSON.parse(key).id])action(furniture,`install:${h.id}:${key}`,`Install ${F[JSON.parse(key).id].name} · ${n} carried`,{type:'install',home:h.id,key});
            const stock=section(detail,`Private storage · ${Object.values(h.stock).reduce((a,b)=>a+b,0)}/${homeCapacity(h)}`);
            stock.append(el('p','Each carried or stored unit uses one local storage unit. Communal furnishings are not yours to sell. Expired lodging permits retrieval.'));
            const deposit=select('Carried item to store');for(const [key,n]of Object.entries(c.inventory))deposit.append(option(key,`${c.itemNames?.[key]||JSON.parse(key).id||'Assembled gear'} ×${n}`));
            if(deposit.options.length){if([...deposit.options].some(o=>o.value===depositSelections.get(h.id)))deposit.value=depositSelections.get(h.id);stock.append(deposit);const update=()=>{depositSelections.set(h.id,deposit.value);action(stock,`deposit:${h.id}`,'Store one selected item',{type:'deposit',home:h.id,key:deposit.value});};deposit.onchange=update;update();}
            for(const [key,n]of Object.entries(h.stock))action(stock,`withdraw:${h.id}:${key}`,`Take ${c.itemNames?.[key]||JSON.parse(key).id||'Assembled gear'} · ${n} stored`,{type:'withdraw',home:h.id,key});
            if(B[h.id]&&h.construction){const work=section(detail,'Shelter work and moving');work.append(el('p','Your gathered materials made this shelter. Pack your fixtures and collect goods before dismantling; half the frame and thatch can be reused. Return to the willow stand to gather new lining.'));action(work,'dismantle:'+h.id,'Dismantle and recover reusable material · 10 min',{type:'dismantle',home:h.id});}
            if(h.id==='cottage') {const improvements=section(detail,'Homeowner repairs and rooms');for(const [id,i]of Object.entries(I)){if(h.improvements.includes(id))improvements.append(el('p',`${i.name} · complete`));else action(improvements,`improve:${id}`,`${i.name} · ${i.coins} coins + ${i.wood} Rough wood logs · ${i.minutes} min`,{type:'improve',home:h.id,improvement:id});}}
            if(P[h.id].legacy)detail.append(el('p','The existing hearth and companion controls remain in Here → Options at this home.'));
            if(h.improvements.includes('guestroom')){const room=section(detail,'Worker room and rota');const assigned=Object.entries(view.state.workers||{}).find(([,a])=>a.home===h.id);
                room.append(el('p',assigned?`${HOME_WORKERS[assigned[0]]} occupies this guest room on the ${assigned[1].shift} rota. The same room cannot also lodge Reed.`:'An owned guest room can house one hired human worker. Day rota: 06:00–18:00; night rota: 18:00–06:00. Accepted batches finish before rest; loss of room rights stops unsupported work.'));
                if(assigned)action(room,'worker_release:'+assigned[0],'Release the worker room',{type:'worker_release',home:h.id,worker:assigned[0]});
                for(const [id,label] of Object.entries(HOME_WORKERS))if(c.workers?.[id]?.life==='alive')for(const shift of ['day','night'])action(room,'worker_assign:'+id+':'+shift,`Offer ${label} this room · ${shift} rota`,{type:'worker_assign',home:h.id,worker:id,shift});
            }
            if(h.improvements.includes('guestroom')){const guests=section(detail,'Guest room and lodging');const g=view.state.lodger;guests.append(el('p',g?.home===h.id?`Reed occupies the guest room; ${Math.max(0,g.paidUntil-c.clock)} prepaid minutes, ${g.coins} travel coins left. Your private storage is separate.`:'The guest room is free. A willing traveler can pay from a finite travel purse.'));if(g?.home===h.id){action(guests,'guest_renew','Offer another prepaid day · receive 6 coins',{type:'guest_renew',home:h.id});action(guests,'guest_leave','End the lodging arrangement',{type:'guest_leave',home:h.id});}else action(guests,'invite','Offer Reed the guest room · receive 6 coins',{type:'invite',home:h.id});}
            if(!P[h.id].legacy&&local&&usable&&c.body.form==='human') {
                const household=section(detail,'Hearth and companion'),ctx=householdHomeContext(h,{...c,animalElsewhere:c.legacyAnimal||view.homes.some(other=>other.id!==h.id&&other.household?.animal)});
                const scene=createHouseholdScene(),hv=householdPresentation({household:h.household,context:ctx,furnitureInput:{state:{},residences:view.state,residenceContext:c}});
                scene.update(hv.scene);household.append(scene.node);
                for(const s of hv.sections)for(const a of s.actions)action(household,`household:${h.id}:${a.command.id}`,a.label,{type:'household',home:h.id,action:a.command.id});
                if(!h.household?.animal&&!c.legacyAnimal&&!view.homes.some(other=>other.household?.animal))action(household,'meet:'+h.id,'Meet Moss at this home',{type:'household',home:h.id,action:'meet'});
                if(!h.household?.animal&&c.legacyAnimal)action(household,'move_native_cat:'+h.id,'Bring Moss from your previous local home',{type:'move_native_cat',home:h.id});
                for(const other of view.homes)if(other.id!==h.id&&other.household?.animal)action(household,'move_cat:'+h.id,'Bring Moss from '+other.name,{type:'move_cat',home:h.id,from:other.id});
            }
        } else detail.append(el('p','Visit the Village home supplier or choose an optional fresh home beginning. The original Shack remains available through its ordinary route.'));
        for(const [id,p]of Object.entries(P))if(p.legacy&&c.nativeRights?.[id]&&!view.state.properties[id]&&c.location===p.location)action(detail,'register:'+id,'Register this existing home in Homes',{type:'register',home:id});
        buildingBody.replaceChildren();building.hidden=c.world!=='base.frontier';
        buildingBody.append(el('p',`Visit ${HOME_SITE} through native travel. This authored unclaimed site offers forked branches for a nest, dry diggable roots for a burrow and a clearing for a lean-to. Materials are gathered in small carried bundles; construction spends real materials and played time, without coins.`));
        if(c.location===HOME_SITE){
            for(const [id,m]of Object.entries(M))if(m.forms.includes(c.body.form))action(buildingBody,'gather:'+id,`Gather ${m.name.toLowerCase()} · ${m.minutes} min`,{type:'gather',item:id});
            for(const [id,b]of Object.entries(B))if(b.form===c.body.form){buildingBody.append(el('p',b.reason));action(buildingBody,'build:'+id,`${b.name} · ${Object.entries(b.costs).map(([id,n])=>`${n} ${M[id].name}`).join(' + ')||'your paws'} · ${b.minutes} min`,{type:'build',home:id});}
        }
        if(c.location===HOME_SITE||view.here)action(buildingBody,'weave_lining','Weave dry lining · 3 dry grass bundles · 8 min',{type:'weave_lining'});
        renderHomeWork({view,body:buildingBody,detail,h,el,section,action});
        start.hidden=!view.fresh;
        if(view.fresh)action(startBody,'ordinary','Keep your ordinary beginning',{type:'ordinary'});
        if(view.fresh)for(const [id,p]of Object.entries(S)){startBody.append(el('p',p.text));action(startBody,'start:'+id,'Begin as '+p.label,{type:'start',profile:id});}
        market.hidden=c.world!=='base.frontier'||c.location!=='Village';
        for(const [id,p]of Object.entries(P))if(!['family','manor'].includes(id)&&!p.legacy&&!B[id])action(marketBody,'acquire:'+id,`${p.tenure==='rented'?'Rent':p.price?'Buy':'Settle'} ${p.name} · ${p.price} coins${p.period?' / day':''}`,{type:'acquire',home:id});
        const shop=shopNode||(shopNode=select('Furnishing to buy'));if(!shop.options.length)for(const [id,f]of Object.entries({...F,...HOME_SUPPLIES}))shop.append(option(id,`${f.name} · ${f.price} coins`));if(shopSelection)shop.value=shopSelection;if(shop.parentElement!==marketBody)marketBody.append(shop);const updateShop=()=>{shopSelection=shop.value;action(marketBody,'buy','Buy selected furnishing',{type:'buy',item:shop.value});};shop.onchange=updateShop;updateShop();
        for(const row of view.state.ledger.slice().reverse())historyBody.append(el('p',`Minute ${row.at}: ${row.text}`));
        for(const d of detail.querySelectorAll('details'))if(oldOpen.includes(d.firstChild.textContent))d.open=true;
        if(focused)buttons.get(focused)?.button.focus({preventScroll:true});
        if(focusLabel){const input=[...panel.querySelectorAll('input,select')].find(n=>n.getAttribute('aria-label')===focusLabel);if(input){input.focus({preventScroll:true});if(selection&&input.tagName==='INPUT')input.setSelectionRange(...selection);}}
    }
    homes.onchange=()=>{selected=homes.value;signature='';render();};
    definePanel({id:'homes',title:'Homes',role:'actions',node:panel,home:document.getElementById('main_content'),defaultDock:'center',discovered:()=>read().visible,eligible:()=>read().visible});
    render();return {render,open:()=>expandWorkspaceModule('homes')};
}
