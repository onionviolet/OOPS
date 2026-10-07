import {previewSimulationCommand} from './simulation.js';
import {partyHelperReasons,partyBattleView} from './party_battle.js';
import {PARTY_HELPER} from './native_battle_contracts.js';
import {pursuitView} from './pursuit.js';
import {RIVAL_PURSUIT,ROAD_RIVAL} from './frontier_campaign.js';
const node=(tag,text='')=>{const n=document.createElement(tag);n.textContent=text;return n;};
export function createPartyPanel({registry,read,command}) {
    const panel=node('details');panel.id='party_panel';panel.className='expedition_panel';const summary=node('summary','A porter’s guarded contest');panel.append(summary);
    const intro=node('p','Lio can physically take the next attempted Mara blow after bracing. He spends his own stamina and effort, keeps his wounds, and may yield. Joining costs one coin; no victory is promised.');
    const report=node('p'),notice=node('p');notice.setAttribute('role','status');panel.append(intro,report,notice);
    const controls=new Map();let message='';
    const run=c=>{try{const snap=read(),b=partyBattleView(snap.state);command({...c,sequence:snap.state.sequence,action:b?.actions,sessionId:b?.sessionId,jobId:snap.state.simulation?.jobs.find(j=>j.actorId==='player'&&j.commandId.startsWith('party.'))?.id});message=c.type==='party_ask'||c.type==='party_decline'?read().state.actors.player.facts['party.answer']:'Progress saved.';}catch(e){message=e.message;}render();};
    const button=(id,label,c)=>{const b=node('button',label);b.type='button';b.dataset.party=id;b.addEventListener('click',()=>run(c));panel.append(b);controls.set(id,b);return b;};
    for(const d of registry.simulation.commands.values())if(d.group==='party')button(d.id,d.label,{type:'party_command',id:d.id,targetId:d.targetId});
    button('cancel','Cancel preparation / re-rig · reserved inputs return',{type:'party_cancel'});
    button('ask','Ask whether Lio can assist · no commitment',{type:'party_ask'});
    button('decline','Decline assistance · no cost',{type:'party_decline'});
    button('start','Accept with Lio · 1 coin',{type:'party_start'});
    button('settle','Offer a kit instead of fighting',{type:'party_settle'});
    button('release','Ask Lio to step out · costs stay spent',{type:'party_release'});
    function render() {
        const focused=document.activeElement,snap=read(),{state,context,error,canWrite}=snap,f=state.actors.player.facts,s=state.simulation,p=s?.people[PARTY_HELPER],b=partyBattleView(state),job=s?.jobs.find(j=>j.actorId==='player'&&j.commandId.startsWith('party.'));
        panel.hidden=!f['field.member']||snap.inDialogue||context.facts.location!=='Village'&&!b;
        const reasons=f['party.met']?partyHelperReasons(state,context):[];
        report.textContent=p?`Lio: ${Math.round(p.vitals.health*10)/10}/${p.vitals.max_health} HP, ${Math.round(p.vitals.stamina*10)/10}/${p.vitals.max_stamina} stamina, ${state.actors[PARTY_HELPER].resources.brace_effort} guard effort. ${b?`Role: ${b.fighters[PARTY_HELPER].status}. ${b.guard?'Braced: the next attempted blow aimed at you goes to Lio.':'No guard held.'}`:f['party.lastResult']?`Last contest: ${f['party.lastResult']}; ${f['party.guardsTaken']} guarded attempts. ${f['party.helperStatus']}. Wounds and costs remain.`:f['party.declined']?'Lio respects the refusal; peaceful preparation is still available.':'His kit and control belong to him; you gain neither by asking.'}`:'';
        if(job)report.textContent+=` ${job.label}: ${Math.max(0,job.due-state.clock)} played minutes remain; reserved inputs return on cancellation.`;
        notice.textContent=error||message||f['party.answer']||'';notice.hidden=!notice.textContent;
        for(const [id,btn] of controls) {
            let hidden=false,eligible=true,title='';
            if(id.startsWith('party.')) {
                const d=registry.simulation.commands.get(id),view=s?previewSimulationCommand(state,registry,id,{...context,targetId:d.targetId||null}):null;
                hidden=!view?.visible||!!b||!!(d.once&&state.actors.player.completed[id]);eligible=!!view?.eligible;title=view?.reasons.join(' ')||'';
            }else if(id==='cancel'){hidden=!job;eligible=!!job;}
            else if(id==='release'){hidden=!b||b.fighters[PARTY_HELPER].status!=='active';}
            else if(id==='start'){hidden=!f['party.met']||!!b||!f['party.invited'];const view=s?.people[ROAD_RIVAL]?previewSimulationCommand(state,registry,'rival.confront',{...context,targetId:ROAD_RIVAL}):null;eligible=!reasons.length&&!!view?.eligible&&context.external.money>=1&&context.vitals.player.health>1&&s?.people[ROAD_RIVAL]?.vitals.health>1;title=[...reasons,...(view?.reasons||['Meet Mara and wait for her agreed contest.'])].join(' ');}
            else if(id==='settle'){hidden=!f['party.met']||!!b;const view=s?.people[ROAD_RIVAL]?previewSimulationCommand(state,registry,'rival.settle',{...context,targetId:ROAD_RIVAL}):null;eligible=!!view?.eligible;title=view?.reasons.join(' ')||'';}
            else {hidden=!f['party.met']||!!b;eligible=!context.busy;}
            btn.hidden=hidden;btn.disabled=!canWrite||!!error||!eligible;btn.title=title;
            if(hidden&&focused===btn)summary.focus();
        }
    }
    document.getElementById('location_actions_div')?.append(panel);render();return {render};
}
