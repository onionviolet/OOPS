// Read/validate existing bodies, stock, jobs and clocks. No saved slice/writer.
import {registerDomain} from './domain_registry.js';
import {shadowCompanyLife as life, companyId as id, COMPANY_RANKS} from './world_packs/book_shadow_company_life.js';
const check=(ok,text)=>{if(!ok)throw Error(text);};
const count=(rows,n,native=false)=>Object.entries(rows||{}).reduce((sum,[key,row])=>sum+(JSON.parse(key).id===id(n)?native?row.count:row:0),0);
const total=(save,n)=>Object.values(save.expansion.simulation.owners).reduce((sum,rows)=>sum+count(rows,n),0)+Object.values(save.inventories||{}).flatMap(owners=>Object.values(owners)).reduce((sum,rows)=>sum+count(rows,n,true),0);
const reserved=(state,n)=>state.simulation.jobs.flatMap(j=>j.costs).filter(e=>e.type==='item'&&JSON.parse(e.key).id===id(n)&&e.amount<0).reduce((sum,e)=>sum-e.amount,0);

export function validateShadowCompanyEnvelope(save){
    const state=save?.expansion,record=save?.content_packs?.structured;
    if(record?.packId!==life.id){check(state?.actors?.player?.worldId!==life.world.id,'Shadow company needs its beginning receipt.');return;}
    const s=state.simulation,hound=s.people[id('hound')],body=hound?.body,rank=COMPANY_RANKS[body?.rank],f=state.actors.player.facts;
    check(rank&&body.id===id('hound_body')&&body.ownerId===id('hound')&&body.controllerId==='player'&&body.templateId===id('marsh_hound_template')&&typeof body.stored==='boolean'&&typeof body.broken==='boolean','The owned captured shadow identity has changed.');
    check(s.claims[id('shadow_title')]?.status==='held'&&s.claims[id('shadow_title')].owner==='player','The companion title is missing.');
    check(hound.vitals.max_health===rank.health&&body.strike===rank.strike&&body.tempo===rank.tempo&&hound.vitals.health>=0&&hound.vitals.health<=rank.health,'Shadow growth and actual body stats disagree.');
    const sleeps=s.jobs.filter(j=>j.actorId===id('hound'));
    check(sleeps.length<=1&&sleeps.every(j=>j.commandId===id('ascend_'+rank.index)&&body.stored&&state.actors[id('hound')].facts[id('ascend_requested')]===true&&!j.participants.includes('player')),'Shadow sleep must reserve that companion alone.');
    const controller=s.controllers[id('shadow_work')];check(controller?.actorId===id('hound')&&controller.interval===1,'The commissioned shadow controller is missing.');
    for(const j of sleeps)check(controller.lastAction?.subject===j.commandId&&j.due===controller.lastAction.at+rank.sleep,'The pending shadow wake deadline has changed.');
    for(const r of COMPANY_RANKS){const c=s.checks[id('recover_'+r.index)];check(c&&c.interval===1&&c.count===state.clock-record.initializedAt&&c.due===state.clock+1,'Stored shadow recovery deadline is missing or changed.');}
    let used=0;
    for(const r of COMPANY_RANKS.slice(0,-1)){const n=state.actors[id('hound')].completed[id('ascend_'+r.index)]||0;check(n===(r.index<rank.index?1:0),'Shadow rank and completed ascensions disagree.');used+=n;}
    check(total(save,'gem')+reserved(state,'gem')+used===6,'Actual gems and shadow ascensions disagree.');
    check(total(save,'badge')===6,'Allocated survey badges must remain actual stock.');
    const counts={ration:[12,2,'prepare'],rope:[4,1,'prepare_rope'],brace:[4,1,'prepare_brace'],bandage:[4,1,'treat']};
    for(const [n,[initial,cost,command]] of Object.entries(counts))check(total(save,n)+reserved(state,n)+cost*(state.actors.player.completed[id(command)]||0)===initial,'Patrol supplies and settled work disagree.');
    const phase=f[id('phase')],reportPending=s.jobs.some(j=>j.commandId===id('report')),preparePending=s.jobs.some(j=>j.commandId===id('prepare'));
    const escrow=(preparePending||[1,2,3].includes(phase))&&!reportPending?1:0;
    check(count(s.owners[id('hound')],'badge')===escrow,'The attempt’s badge escrow disagrees with its phase.');
    check([0,1,2,3,4].includes(phase)&&[0,1].includes(f[id('injury')]),'Unsupported patrol state.');
    const location=[2,3].includes(phase)?id('ruin'):id('camp');
    check(s.people.player.location===location&&hound.location===location,'Both patrol participants must retain their actual location.');
}

export function shadowCompanyStatus(state,d,record,context){
    if(d.id!==life.id||!state.simulation?.knowledge?.player?.[id('hound_known')])return [];
    const s=state.simulation,h=s.people[id('hound')],rank=COMPANY_RANKS[h.body.rank],sleep=s.jobs.find(j=>j.actorId===id('hound'));
    const requested=state.actors[id('hound')].facts[id('ascend_requested')],own=context.gameplay?.player?.inventory;
    const next=COMPANY_RANKS[rank.index+1];
    return [
        {label:'Your same shadow',value:`${rank.label} · ${h.life==='dead'?'dead':h.body.broken?'broken':sleep?'asleep':h.body.stored?'stored':'manifested'} · ${Number(h.vitals.health.toFixed(3))}/${h.vitals.max_health} health · strike ${h.body.strike}. Identity and captured template are retained.`},
        {label:'Recovery and gem readiness',value:sleep?`${sleep.label}: ${sleep.due-state.clock} played minutes remaining. The shadow remains unavailable; you can work at camp.`:requested?'One actual gem is committed in the shadow’s stock; its controller will recheck and start work at the next played minute.':h.life!=='alive'||h.body.broken?'This shadow cannot recover, manifest or ascend through these ordinary means.':next?`Stored recovery is 5% max health per full played minute. Next gem: ${rank.sleep} minutes of independent sleep, then ${next.label} rank with ${next.health} max health and strike ${next.strike}. Recall the shadow before commissioning.`:'Highest Shadowbound rank reached. Stored recovery remains available; there is no next gem rise.'},
        {label:'Actual camp supplies',value:`${count(own,'gem')} gems · ${count(own,'ration')} rations · ${count(own,'rope')} ropes · ${count(own,'brace')} braces · ${count(own,'bandage')} bandages · ${count(own,'badge')} owned stipend badges. ${count(s.owners[id('hound')],'badge')} badge in the current attempt’s shadow-carried escrow.`}
    ];
}
registerDomain({id:'shadow_company_envelope',validate:(_slice,envelope)=>validateShadowCompanyEnvelope(envelope)});
