import {mantraQuote} from '../../vessel_mantras.js';
import {cultivationGuidance} from '../../cultivation_guidance.js';
import {renderForks} from '../../vessel_forks_ui.js';
import {renderSeedbed} from '../../mistglass_seedbed_ui.js';
import {renderVesselGeometry} from '../../vessel_geometry_ui.js';
import {disciplineActions,changeDiscipline} from '../world_adaptation/discipline.js';
import {cultivationMethods} from '../world_adaptation/index.js';
import {createMeterBar} from '../../meter_bar.js';
import {panelSection,quotedActionList} from '../../ui/panel_sections.js';
// Native P12 presenter. No simulation, RNG, inventory or save writes here.
export function createMistglassPanel({host,read,act}){
    const panel=document.createElement('details');panel.id='p23_mistglass_panel';panel.className='expedition_panel ui-workbench';
    const summary=document.createElement('summary');summary.textContent='Mistglass conservatory (opt-in proposal)';
    const body=document.createElement('div'),notice=document.createElement('p');notice.setAttribute('role','status');
    panel.append(summary,body,notice);host.append(panel);
    const text=t=>{const p=document.createElement('p');p.textContent=t;body.append(p);};
    const invoke=id=>{try{act(id);notice.textContent='';}catch(e){notice.textContent=e.message;}render();};
    function render(){
        const opened=new Set([...body.querySelectorAll('details[open]')].map(n=>n.dataset.mistglassSection||n.dataset.actionGroup));
        const focus=panel.contains(document.activeElement)?document.activeElement.dataset.mistglassAction:null;
        const f=read();body.replaceChildren();panel.hidden=!f.visible;
        if(panel.parentElement!==host)host.append(panel);
        const v=f.view;
        const guidance=cultivationGuidance(f);if(guidance){const box=document.createElement('aside');box.dataset.cultivationGuidance='';const message=document.createElement('p');message.textContent='Known practice: '+guidance.text;box.append(message);if(guidance.target){const b=document.createElement('button');b.type='button';b.dataset.cultivationGuideTarget=guidance.target;b.textContent='Show the existing action';b.onclick=()=>{const target=[...body.querySelectorAll('[data-mistglass-action]')].find(n=>n.dataset.mistglassAction===guidance.target);if(target){target.scrollIntoView({block:'center'});target.focus({preventScroll:true});}};box.append(b);}body.append(box);}

        if(v){text(`Condensate: ${v.reserve} / ${v.capacity}. Conservatory mist: +${v.ratePerMinute} per played minute${v.technique.vessel?.state.forks?.slots.some(s=>s.weight>0)?' as the current hundred-minute allocation average; individual minutes follow the saved schedule':''}.`);
            if(v.pending)text(`Purification trial ${v.pending.id}: ${v.pending.remainingMinutes} played minutes remaining.`);
            if(v.last)text(`Trial ${v.last.id}: ${v.last.outcome} (${v.last.reason}).`);
            if(f.rawRemaining)text(`Rawness blocks absorption and another trial for ${f.rawRemaining} played minutes.`);
        }
        if(v){const t=v.technique;text(`${t.label}: ${t.stage}${t.id==='mist'?'':` · ${t.minutes} practiced minutes`}${t.nextAt===null?'':` · next stage at ${t.nextAt}`}.`);text(t.description);if(v.pending)text('Practice pauses during purification; the trial retains its starting odds.');}
        if(v&&f.inside){const d=v.technique.vessel,raw=d?.state;
            if(d)text(`Vessel nodes: flow ${raw.nodes.flow}, still ${raw.nodes.still}, bridge ${raw.nodes.bridge}. Impurity ${raw.impurity} (${raw.residue}/8 forced circuit). Body conditioning ${raw.bodyMinutes}/120 minutes. ${raw.paired?'Paired attention alternates minutes between both drills.':'One attention stream.'} ${raw.forced?'Forced absorption active.':'Gentle absorption.'}`);
            if(d)text(`Selected law: ${raw.law}, depth ${raw.depth[raw.law]}. Comprehension ${raw.comprehension} played minutes; next depth needs ${d.nextComprehension} minutes and ${d.nextLawCost/1000} condensate. Flow depth adds throughput; stillness depth steadies purification. Purification ${v.technique.successThreshold/100}%; sluice cost ${(f.sluice?.cost??v.technique.workCost)/1000}.`);
            if(d?.mantra)text(`Recited mantra: ${d.mantra.name}. Throughput +${d.mantra.rate/10}%, purification +${d.mantra.odds/100} percentage points, work cost −${d.mantra.work/10}%. These are current-vessel control terms, before native rounding and the purification ceiling.`);
            if(d)renderForks({host:body,state:raw,disabled:f.disabled||!!v.pending||!!v.pathWork?.prepared||!v.supported,act,render,notice});
            if(d)renderVesselGeometry({host:body,view:d,disabled:f.disabled||!!v.pending||!!v.pathWork?.prepared||!v.supported,act,render,notice});
            for(const [id,label] of disciplineActions){if(!d&&id!=='open'||d&&id==='open')continue;
                const b=document.createElement('button');b.textContent=id==='purge'?`Purge 1 impurity · ${(v.purgeCost||500)/1000} condensate`:label;b.dataset.mistglassAction='method:vessel:'+id;
                let reason='';try{changeDiscipline({...{schema:1,selected:v.technique.id,minutes:v.technique.drills},...(raw?{discipline:raw}:{})},id,Math.round(v.reserve*1000),v.purgeCost===250);}catch(e){reason=e.message;}
                if(id.startsWith('mantra:')){const q=mantraQuote({minutes:v.technique.drills,discipline:raw},id.slice(7));b.textContent=`${label} · ${q.cost/1000} condensate, ${q.comprehension} comprehension minutes · ${q.name}`;}
                b.disabled=f.disabled||!!v.pending||!!v.pathWork?.prepared||!v.supported||!!reason;b.title=reason;
                b.onclick=()=>{try{act('method:vessel:'+id);notice.textContent='';}catch(e){notice.textContent=e.message;}render();};body.append(b);
            }
        }
        if(v&&f.inside)renderSeedbed({host:body,view:v.seedbed,disabled:f.disabled||!!v.pending||!!v.pathWork?.prepared||!v.supported,act,render,notice});
        if(v&&f.inside){const a=v.technique.away;
            text(`Chosen absence practice: ${a?.armed?'armed':'off'}. Bank ${a?.bank??0}/120 minutes. Each absent real second offers one ordinary played minute. Already-played clock time is subtracted; fractional seconds remain in this ledger. Overflow beyond the bank cap is dropped. Banked time changes no resources until you spend it through the joined world clock. Purification, rawness and committed path work need attention before claiming or spending; leaving this body/world ends arming. Waiting choices block spending.`);
            if(a?.last)text(`Last absence receipt: ${a.last.kind}, ${a.last.minutes} minutes, ${a.last.dropped} dropped, ${a.last.condensate/1000} net condensate. Full reserves discard ordinary absorption overflow; the recap reports what actually entered the reserve. Important world choices stop clock spending with unspent bank retained.`);
            for(const [id,label,enabled] of [['arm','Choose absence mist practice',!a?.armed],['bank','Bank elapsed eligible absence',!!a?.armed],['spend','Spend bank through ordinary world time',!!a?.bank],['stop','Stop absence arming',!!a?.armed]]){const b=document.createElement('button');b.textContent=label;b.dataset.mistglassAction='method:away:'+id;b.disabled=f.disabled||!!v.pending||!!v.pathWork?.prepared||!v.supported||!enabled;b.onclick=()=>{try{act('method:away:'+id);notice.textContent='';}catch(e){notice.textContent=e.message;}render();};body.append(b);}
        }
        if(v&&f.inside&&v.inquiry?.length){text('Mist investigation: record what your own practice supports. Follow-ups appear when their evidence is known.');for(const q of v.inquiry){const b=document.createElement('button');b.textContent=(q.known?'Recorded: ':'')+q.label;b.dataset.mistglassAction='method:inquiry:'+q.id;b.disabled=f.disabled||!!v.pending||!!v.pathWork?.prepared||!v.supported||!q.eligible||Math.round(v.reserve*1000)<q.cost;b.title=q.known?'':q.reason;b.onclick=()=>{try{act('method:inquiry:'+q.id);notice.textContent='';}catch(e){notice.textContent=e.message;}render();};body.append(b);}}
        if(v?.revelation&&f.inside){const r=v.revelation,p=document.createElement('p');p.dataset.mistglassRevelation='';p.textContent=r.known?'Pressure timing understood: your next charged outflow operation saves 0.1 condensate with the same physical output.':`Pressure timing: ${(100*r.chance).toFixed(1)}% on the next five-minute search. ${r.elapsed} visited minutes and ${r.failures} unsuccessful searches support it. Discovery saves 0.1 condensate per charged sluice operation.`;body.append(p);if(!r.known){const help=document.createElement('details'),heading=document.createElement('summary'),why=document.createElement('p');heading.textContent='How observation improves';why.textContent='Visited time adds 0.2 percentage points per minute; an unsuccessful search adds 10 points. At 100%, the pattern is certain. Time outside this retained room adds none.';help.append(heading,why);body.append(help);const b=document.createElement('button');b.textContent='Search for the returning pressure pattern · 5 min';b.dataset.mistglassAction='method:revelation';b.disabled=f.disabled||!!v.pending||!!v.pathWork?.prepared||!v.supported;b.onclick=()=>{try{act('method:revelation');notice.textContent='The local observation is recorded.';}catch(e){notice.textContent=e.message;}render();};body.append(b);}}
        if(v&&f.inside){const b=document.createElement('button');b.textContent='Seal 1 condensate in one paid Cloudseed carrier';b.dataset.mistglassAction='method:seal';b.disabled=f.disabled||!v.supported||!v.sealEligible;b.title='One real condensate and one owned dose become one physical sealed packet; the original reserve stays spent.';b.onclick=()=>{try{act('method:seal');notice.textContent='A sealed packet enters your carried inventory.';}catch(e){notice.textContent=e.message;}render();};body.append(b);}
        if(v?.technique.insight){const i=v.technique.insight,l=i.last;
            text(`Insight past one sitting settles into practice (converted): ${i.minutes} practiced minutes so far, ${i.carry} insight held, ${i.lost} faded.${l?` Last purification: ${l.excess} surplus → ${l.minutes} minutes${l.lost?`, ${l.lost} faded`:''}.`:''}`);}
        if(f.sluice){const w=f.sluice;text(`Outflow sluice: ${w.jammed?'jammed':'running clear'}. Clearing it drives ${w.output/1000} condensate of pressure; ${w.method} (${w.stage}) spends ${w.cost/1000}${w.cost<w.baseCost?` instead of ${w.baseCost/1000}`:''}. ${w.pays==='reputation'?'Clearing it discharges the conservatory’s duty to the Village and earns standing there.':`The keeper pays ${w.wageCoins} coins per cleared jam.`}`);}
        if(f.history)text(f.history);
        if(v?.pathWork&&f.inside){const w=v.pathWork;text(`Precise path work: ${w.label||'choose a practiced method'}. Source: ${w.source}${w.quality?`; current material quality ${w.quality}`:''}. Frontier physical hides are compatible here; the charge stays bound to this body and instance.`);
            if(w.prepared)text(`Committed reserve: ${w.prepared.path}, control ${w.prepared.control}. Its 1 condensate is held for this work; it cannot also fund a trial. Conversion inputs remain spent on abandonment.`);
            if(w.last)text(`Last precise work: ${w.last.productId}, quality ${w.last.quality}, control ${w.last.control}.`);
            for(const [id,label,enabled] of [['prepare','Prepare this path’s reserve · 1 condensate; refinement also uses a dose',!!w.label&&!w.prepared],['cut','Flow-cut one owned pelt',w.prepared?.path==='breath'],['set','Set-grain one owned pelt',w.prepared?.path==='settling'],['discard','Abandon the committed preparation',!!w.prepared]]){const b=document.createElement('button');b.textContent=label;b.dataset.mistglassAction='method:path:'+id;const q=v.pathQuotes?.[id];b.disabled=f.disabled||!v.supported||!!v.pending||!enabled||q?.eligible===false;b.title=q?.reason||'';b.onclick=()=>{try{act('method:path:'+id);notice.textContent='';}catch(e){notice.textContent=e.message;}render();};body.append(b);}}

        if(v?.history){const h=v.history;if(h.consequence)text(h.consequence+' '+h.terms);for(const [id,label,enabled] of [['inspect','Inspect the surviving outflow masonry',h.heard],['restore','Restore the old outflow brace · 1 rough log',h.inspected&&!h.restored]]){const b=document.createElement('button');b.textContent=label;b.dataset.mistglassAction='method:history:'+id;b.disabled=f.disabled||!f.inside||!enabled;b.onclick=()=>{try{act('method:history:'+id);notice.textContent='';}catch(e){notice.textContent=e.message;}render();};body.append(b);}}
        if(f.preview){text(`Spend one Cloudseed dose and 2 condensate. Twelve played minutes. ${f.preview.successPercent}% success awards 30 native Meditation XP; what one sitting cannot hold settles into your drill's practice minutes (one per 5 surplus) or fades if there is no drill to deepen.`);text(f.preview.risk);}
        const methods=v&&f.inside?Object.entries(cultivationMethods).map(([id,m])=>({id:`method:${id}`,label:m.label,enabled:!v.pending&&(!v.pathWork?.prepared||v.pathWork.canSwitch)&&v.supported&&v.technique.id!==id,reason:'Finish purification or rawness before switching; the active method is already selected.'})):[];
        if(methods.length){text('Practice stages: learning → practiced at 16 → integrated at 48 played mist minutes. Practice pauses during purification, rawness and absence.');for(const m of Object.values(cultivationMethods))text(`${m.label}: condensate/min ${m.rates.map(n=>n/1000).join(' → ')}; purification ${m.odds.map(n=>n/100+'%').join(' → ')}.`);}
        for(const a of [...(f.actions||[]),...methods]){const b=document.createElement('button');b.textContent=a.label;b.dataset.mistglassAction=a.id;b.disabled=f.disabled||a.enabled===false;b.title=f.disabled?'Finish your current work in the writable game tab.':a.reason||'';
            b.onclick=()=>{try{act(a.id);notice.textContent='';}catch(e){notice.textContent=e.message;}render();};body.append(b);}
        panel.classList.toggle('success',!!v?.cue&&v.cue==='success');panel.classList.toggle('failure',!!v?.cue&&v.cue==='failure');
    }
    render();return {render};
}
