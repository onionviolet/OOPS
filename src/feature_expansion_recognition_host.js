import {projectSubtletyKnowledgeLegibility} from './action_legibility.js';
import {createActionLegibilityList} from './action_legibility_ui.js';

const clerk='backlog.registry.orrin',witness='backlog.registry.bera',holder='backlog.registry.eda';
const prefix='backlog.registry.';
// The host reads only messages actually directed to the player. Private
// recognition records and integration-only carrier views are never inspected.
export function replacementKnownAccounts(state) {
    const knowledge=state.simulation?.knowledge.player||{},people={};
    if(knowledge[`${prefix}terms`])people[holder]={known:true,label:'Eda, the seal steward'};
    if(knowledge[`${prefix}clerk_report`]||knowledge[`${prefix}registry_report`])people[clerk]={known:true,label:'Orrin, registry clerk'};
    if(knowledge[`${prefix}witness_report`])people[witness]={known:true,label:'Bera, personal witness'};
    const records=[];
    for(const [key,observer,test] of [['clerk_report',clerk,'credential'],['witness_report',witness,'personal_memory'],['registry_report',clerk,'institutional_registry'],['correction',clerk,'institutional_registry']]) {
        const k=knowledge[`${prefix}${key}`];if(!k)continue;
        records.push({known:true,id:`${prefix}${key}`,observerId:observer,recipientId:'player',text:k.value,at:k.at,cause:k.cause,
            test:{known:true,kind:test,label:test==='credential'?'Reported credential comparison':test==='personal_memory'?'Reported personal comparison':'Reported registry check'},
            ...(key==='correction'?{supersedes:`${prefix}clerk_report`}:{})});
    }
    const receipts=[];
    for(const key of ['entry','appointment','template','lesson','duty','return_template','return_office','revisit']) {
        const k=knowledge[`${prefix}${key}`];if(!k)continue;
        const changes=key==='appointment'?[{known:true,carrier:'rights',text:'The issued office appointment is separate from the rightful holder’s personal identity and means.'},
            {known:true,carrier:'obligations',text:'The appointment includes the expressly accepted two-seal office duty.'}]:[];
        receipts.push({known:true,id:`${prefix}${key}`,observerId:'player',text:k.value,at:k.at,cause:k.cause,changes});
    }
    return {records,receipts,people};
}

export function replacementRecognitionPresentation(state,{recovery=[]}={}) {
    const known=replacementKnownAccounts(state);
    const metadata=Object.fromEntries([...known.records,...known.receipts].map(r=>[r.id,r]));
    const view=projectSubtletyKnowledgeLegibility({state,viewerId:'player',prefix,metadata,people:known.people,recovery});
    return {visible:!!state.backlog?.replacement,...view};
}

export function createReplacementRecognitionPanel({read,command,parent}) {
    const panel=document.createElement('details');panel.id='replacement_recognition_panel';panel.className='expedition_panel';
    const summary=document.createElement('summary');summary.textContent='Reported recognition & office consequences';summary.tabIndex=0;panel.append(summary);
    const list=createActionLegibilityList({parent:panel,idPrefix:'replacement-accounts',focusFallback:summary,
        onAction:row=>{if(!row.command)throw Error('Review the available action again.');command(row.command);}});
    function render(){const snapshot=read(),view=replacementRecognitionPresentation(snapshot.state,{recovery:snapshot.recovery||[]});
        panel.hidden=!view.visible;list.render({actions:view.actions,aftermath:view.aftermath,enabled:snapshot.canWrite&&!snapshot.error,notice:snapshot.error||''});}
    parent?.append(panel);render();return {panel,element:panel,render};
}
