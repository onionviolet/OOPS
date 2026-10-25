import {cultivationMethods} from '../world_adaptation/index.js';
import {createMeterBar} from '../../meter_bar.js';
import {panelSection,quotedActionList} from '../../ui/panel_sections.js';
// Native P12 presenter. No simulation, RNG, inventory or save writes here.
export function createMistglassPanel({host,read,act}){
    const panel=document.createElement('details');panel.id='p23_mistglass_panel';panel.className='expedition_panel ui-workbench';
    const summary=document.createElement('summary');summary.textContent='Mistglass conservatory (opt-in proposal)';
    const body=document.createElement('div'),notice=document.createElement('p');notice.setAttribute('role','status');
    panel.append(summary,body,notice);host.append(panel);
    const text=(parent,t)=>{const p=document.createElement('p');p.textContent=t;parent.append(p);};
    const invoke=id=>{try{act(id);notice.textContent='';}catch(e){notice.textContent=e.message;}render();};
    function render(){
        const opened=new Set([...body.querySelectorAll('details[open]')].map(n=>n.dataset.mistglassSection||n.dataset.actionGroup));
        const focus=panel.contains(document.activeElement)?document.activeElement.dataset.mistglassAction:null;
        const f=read();body.replaceChildren();panel.hidden=!f.visible;
        if(panel.parentElement!==host)host.append(panel);
        const v=f.view;
        const section=(key,title,options={})=>{const s=panelSection(title,options);s.node.dataset.mistglassSection=key;body.append(s.node);return s.body;};
        const actions=(parent,rows,key)=>parent.append(quotedActionList(rows.map(a=>({...a,enabled:!f.disabled&&a.enabled!==false,reason:f.disabled?'Finish your current work in the writable game tab.':a.reason,attributes:{'data-mistglass-action':a.id}})),{id:'mistglass-'+key,activate:invoke}));
        text(body,!f.inside?'Visit the conservatory → learn its method → gather condensate in the mist → review a purification trial. Entry brings your present body and bag.':'Mistglass practice belongs to this body in this conservatory. Practice and absorption advance with played time here.');
        const travel=(f.actions||[]).filter(a=>['enter','exit','trade','learn'].includes(a.id));
        if(travel.length)actions(section('visit','Visit and learn'),travel,'visit');
        if(v){
            const reserve=section('reserve','Condensate and current work');
            const pool=createMeterBar();pool.update({id:'mistglass-condensate',kind:'pool',label:'Condensate',value:v.reserve,max:v.capacity,note:'A local reserve. Purification and precise path work spend it.',rate:{value:v.ratePerMinute,unit:'per played minute in this mist'}});reserve.append(pool.node);
            if(v.pending)text(reserve,`Purification underway · ${v.pending.remainingMinutes} played minutes remaining. Practice pauses; the trial retains its starting odds.`);
            if(f.rawRemaining)text(reserve,`Rawness · ${f.rawRemaining} played minutes remaining. Absorption and another trial wait for recovery.`);
            if(v.last)text(reserve,`Last purification: ${v.last.outcome} (${v.last.reason}).`);
            const t=v.technique,method=section('method',`Practice · ${t.label}`,{description:t.description});
            if(t.nextAt!==null){const progress=createMeterBar();progress.update({id:'mistglass-practice',kind:'track',label:t.stage,value:t.minutes,max:t.nextAt,note:`Next method stage at ${t.nextAt} played mist minutes. Practice pauses during purification, rawness and absence.`});method.append(progress.node);}
            else text(method,`${t.stage}${t.id==='mist'?'':` · ${t.minutes} practiced minutes`}.`);
            if(f.inside){const methods=Object.entries(cultivationMethods).map(([id,m])=>({id:`method:${id}`,active:v.technique.id===id,label:`${v.technique.id===id?'Active · ':''}${m.label}`,enabled:!v.pending&&!v.pathWork?.prepared&&v.supported&&v.technique.id!==id,reason:v.technique.id===id?'This is your active method.':v.pending?'Finish purification before switching.':v.pathWork?.prepared?'Finish or abandon the committed path work before switching.':!v.supported?'This body cannot practice here right now.':''}));actions(method,methods,'methods');}
            const reference=panelSection('Method stages and rates',{disclosure:true});reference.node.dataset.mistglassSection='rates';method.append(reference.node);
            text(reference.body,'Learning → Practiced at 16 → Integrated at 48 played mist minutes. Each method keeps its own practiced time.');
            for(const m of Object.values(cultivationMethods))text(reference.body,`${m.label}: condensate/min ${m.rates.map(n=>n/1000).join(' → ')}; purification ${m.odds.map(n=>n/100+'%').join(' → ')}.`);
            if(t.insight){const i=t.insight,l=i.last;text(reference.body,`Surplus insight: ${i.minutes} converted practice minutes · ${i.carry} held · ${i.lost} faded.${l?` Last trial: ${l.excess} surplus → ${l.minutes} minutes${l.lost?`, ${l.lost} faded`:''}.`:''}`);}
        }
        if(f.preview){const trial=section('trial','Purification · review the stakes');text(trial,`1 Cloudseed dose + 2 condensate · 12 played minutes · ${f.preview.successPercent}% success.`);text(trial,'Success awards 30 native Meditation XP. Insight beyond one sitting settles into your drill (one practice minute per 5 surplus), or fades without a drill.');text(trial,f.preview.risk);actions(trial,(f.actions||[]).filter(a=>a.id==='trial'),'trial');}
        if(f.sluice){const w=f.sluice,sluice=section('sluice',`Outflow sluice · ${w.jammed?'jammed':'running clear'}`);text(sluice,`Clearing drives ${w.output/1000} condensate of pressure. ${w.method} (${w.stage}) spends ${w.cost/1000}${w.cost<w.baseCost?` instead of ${w.baseCost/1000}`:''}. ${w.pays==='reputation'?'This discharges the conservatory’s duty to the Village and earns standing there.':`The keeper pays ${w.wageCoins} coins per cleared jam.`}`);actions(sluice,(f.actions||[]).filter(a=>a.id==='sluice'),'sluice');}
        if(v?.pathWork&&f.inside){const w=v.pathWork,path=section('path','Precise path work',{disclosure:true});text(path,`${w.label||'Choose a practiced method'}. Source: ${w.source}${w.quality?`; material quality ${w.quality}`:''}. Frontier physical hides are compatible; the charge stays bound to this body and instance.`);
            if(w.prepared)text(path,`Committed reserve: ${w.prepared.path}, control ${w.prepared.control}. Its 1 condensate is held here. Conversion inputs remain spent on abandonment.`);
            if(w.last)text(path,`Last work: ${w.last.productId}, quality ${w.last.quality}, control ${w.last.control}.`);
            actions(path,[['prepare','Prepare reserve · 1 condensate; refinement also uses a dose',!!w.label&&!w.prepared],['cut','Flow-cut one owned pelt',w.prepared?.path==='breath'],['set','Set-grain one owned pelt',w.prepared?.path==='settling'],['discard','Abandon the committed preparation',!!w.prepared]].map(([id,label,enabled])=>{const q=v.pathQuotes?.[id];return {id:'method:path:'+id,label,enabled:v.supported&&!v.pending&&enabled&&q?.eligible!==false,reason:q?.reason||(!v.supported?'This body cannot practice here right now.':v.pending?'Finish purification first.':!w.label?'Choose a practiced path method first.':w.prepared?'This step needs its matching committed preparation.':'Prepare the reserve for this step first.')};}),'path');
        }
        if(f.history||v?.history){const history=section('history','Conservatory history',{disclosure:true});if(f.history)text(history,f.history);if(v?.history){const h=v.history;if(h.consequence)text(history,h.consequence+' '+h.terms);actions(history,[['inspect','Inspect the surviving outflow masonry',h.heard],['restore','Restore the old outflow brace · 1 rough log',h.inspected&&!h.restored]].map(([id,label,enabled])=>({id:'method:history:'+id,label,enabled:f.inside&&enabled,reason:!f.inside?'Visit the conservatory first.':h.restored&&id==='restore'?'The brace is already restored.':'Investigate the outflow history first.'})),'history');}}
        for(const n of body.querySelectorAll('details'))if(opened.has(n.dataset.mistglassSection||n.dataset.actionGroup))n.open=true;
        if(focus)[...body.querySelectorAll('[data-mistglass-action]')].find(n=>n.dataset.mistglassAction===focus)?.focus({preventScroll:true});
        panel.classList.toggle('success',v?.cue==='success');panel.classList.toggle('failure',v?.cue==='failure');
    }
    render();return {render};
}
