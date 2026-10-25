import {definePanel} from './panel_kit.js';
import {centerModes} from './center_modes.js';
const moment=at=>{const day=Math.floor(at/1440),year=Math.floor(day/360),within=day%360;return `Y${year} ${Math.floor(within/30)+1}/${within%30+1} ${String(Math.floor(at/60)%24).padStart(2,'0')}:${String(at%60).padStart(2,'0')}`;};
const node=(tag,text='')=>{const n=document.createElement(tag);n.textContent=text;return n;};
export function createCheatPanel({read,act,nameItem}) {
    const home=node('section');home.id='cheat_faculty_panel';home.dataset.surfaceType='character-summary';
    const open=node('button','Explore your continuing insight');open.type='button';open.className='action_button';home.append(open);
    definePanel({id:'cheat-faculty',title:'Continuing insight',role:'character',node:home,home:document.getElementById('character_div'),defaultDock:'left',
        discovered:()=>read().visible,eligible:()=>read().visible});
    const view=node('section');view.id='cheat_faculty_view';view.className='center-mode-hidden';
    const heading=node('h2','Continuing insight');heading.className='expanded-panel-heading';heading.tabIndex=-1;
    const status=node('p'),body=node('div'),message=node('p');message.setAttribute('role','status');message.dataset.cheatMessage='';
    view.append(heading,status,message,body);centerModes().registerView('cheat-faculty',view,'Continuing insight');
    let signature='';
    const run=request=>{try {act(request);message.textContent='Recorded.';}catch(e){message.textContent=e.message;}signature='';render(true);};
    const button=(label,request,disabled=false)=>{const b=node('button',label);b.type='button';b.className='action_button';b.disabled=disabled;b.dataset.cheatAction=request.type;b.onclick=()=>run(request);return b;};
    open.onclick=()=>{render(true);centerModes().open('cheat-faculty');};
    function render(force=false) {
        const s=read();home.hidden=!s.visible;
        if(!s.visible){view.hidden=true;return;}view.hidden=false;
        if(!force&&view.classList.contains('center-mode-hidden'))return;
        const key=JSON.stringify(s);if(!force&&signature===key)return;signature=key;body.replaceChildren();
        status.textContent=`Insight: have ${s.points}, earned ${s.earned}, spent ${s.spent}. Enduring developments follow the continuing self; local reserves have their own carrier.`;
        if(s.reason)body.append(node('p',s.reason));
        const milestones=node('details');milestones.open=true;milestones.append(node('summary','Reflect on lived experience'));
        for(const m of s.milestones){const row=node('p',m.label+' · '+(m.claimed?'retained':m.met?'ready':'not yet lived')+' ');if(!m.claimed)row.append(button('Retain insight',{type:'claim',id:m.id},!m.met||!!s.reason));milestones.append(row);}body.append(milestones);
        if(s.development)body.append(button(s.development,{type:'develop'},s.points<1||!!s.reason));
        for(const card of s.cards) {
            const section=node('section');section.className='panel-info';section.dataset.cheatCard=card.id;
            section.append(node('h3',card.name),node('p',card.description),node('p',`Charges ${card.state.charges} · used ${card.state.used}`));
            if(card.state.charges<card.state.charges+card.state.used-card.state.recharged)section.append(button('Restore 1 reserve · 1 insight',{type:'recharge',id:card.id},s.points<1||!!s.reason));
            if(card.id==='true-appraisal')for(const specimen of s.specimens)section.append(button(`Read ${specimen.species}`,{type:'appraise',...specimen},!card.state.charges||!!s.reason));
            if(card.id==='loaded-dice')section.append(button('Commit next loot roll low · 1 charge',{type:'call'},!card.state.charges||!!s.reason));
            if(card.id==='fate-ledger') {
                const select=node('select');select.setAttribute('aria-label','Visible fate subject');
                for(const d of s.decisions){const option=node('option',d.label);option.value=d.id;select.append(option);}
                const b=button('Read fate · 1 charge',{type:'peek'},!card.state.charges||!s.decisions.length||!!s.reason);b.onclick=()=>run({type:'peek',target:select.value});section.append(select,b);
                if(!s.decisions.length)section.append(node('p','A visible foe gives this faculty a concrete outcome to read. Read their fate during an encounter.'));
            }
            if(card.id==='earned-habit') {
                const count=node('input');count.type='number';count.min='1';count.max='10000';count.value='3';count.setAttribute('aria-label','Carcasses in routine');
                const b=button('Entrust finite processing · 1 charge',{type:'routine'},!card.state.charges||!!s.reason);b.onclick=()=>run({type:'routine',target:Number(count.value)});section.append(count,b);
            }
            if(card.id==='patient-furnace'){section.append(node('p',`Retained time: ${card.state.away.bank} min · spent forward: ${card.state.away.spent} min. ${card.state.away.stop}`),button('Assign current routine · 1 charge',{type:'assign-furnace'},!card.state.charges||!!s.reason),button('Spend up to 30 retained minutes',{type:'settle-furnace'},!card.state.away.bank||!!s.reason));}
            if(card.id==='heirloom-compact'){
                const select=node('select');select.setAttribute('aria-label','Owned heirloom lot');
                for(const lot of s.heirlooms){const name=nameItem(lot.key);const o=node('option',`${name} · ${lot.source} · ${lot.count} owned`);o.value=JSON.stringify({source:lot.source,key:lot.key});select.append(o);}
                const count=node('input');count.type='number';count.min='1';count.value='1';count.setAttribute('aria-label','Heirloom count');
                const b=button('Bequeath to local successor · 1 charge',{type:'bequeath'},!card.state.charges||!s.heirlooms.length||!!s.reason);b.onclick=()=>run({type:'bequeath',...JSON.parse(select.value),count:Number(count.value)});section.append(select,count,b);
                const n=card.state.nomination;if(n)section.append(node('p',`Nominated: ${nameItem(n.key)} ×${n.count} from ${n.source}. Claim executes when you begin the heir; changed stock may lapse.`));
                const r=card.state.receipt;if(r)section.append(node('p',`Last succession: ${r.status} · ${nameItem(r.key)} ×${r.count} for ${r.recipient}.`));
            }
            if(card.id==='pattern-book'){
                for(const m of s.methods)section.append(button(`Sketch ${m.name} · 1 charge`,{type:'sketch',id:m.id},!card.state.charges||card.state.patterns.some(p=>p.recipe.id===m.id)||!!s.reason));
                if(!s.methods.length)section.append(node('p','Carry a readable method book or learn a method before sketching.'));
                for(const p of card.state.patterns){section.append(node('p',`${p.recipe.name} · design from ${p.world} · as of ${moment(p.at)}`),button('Rebuild remembered method · 1 charge',{type:'rebuild-pattern',id:p.recipe.id},!card.state.charges||!!s.reason));}
            }
            if(card.state.readings)for(const r of card.state.readings.slice(-3))section.append(node('p',r.source==='true-appraisal'?`${r.species}: ${r.freshness}, ${r.integrity}, age ${r.ageEstimate.min}–${r.ageEstimate.max} min · as of ${moment(r.at)}`:`${r.label||'Loot decision'}: ${r.value<.25?'low':r.value<.75?'middling':'high'} roll · as of ${moment(r.at)}${r.via?' · committed call':''}`));
            body.append(section);
        }
    }
    render();return {render};
}
