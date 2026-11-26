import {element as el} from '/canvas.mjs';
import {implementationReport} from '/reading-handoffs-view.mjs';
export function appendRecordHandoffs(parent,{world,focus,type,view='things'}) {
    const details=el('details',null,'record-handoff-trail');details.dataset.recordType=type;
    details.append(el('summary','Workbench implementation and playtests · '+type));
    const content=el('div');content.setAttribute('aria-live','polite');details.append(content);parent.append(details);
    let loading=false;
    details.ontoggle=async()=>{
        if(!details.open||loading)return;loading=true;content.textContent='Checking this exact record…';
        try {
            const response=await fetch('/record-handoffs?'+new URLSearchParams({world,view,focus,type}),{cache:'no-store'});
            if(!response.ok)throw Error();const result=await response.json();if(!details.isConnected)return;
            content.replaceChildren(el('p','Exact saved record links. Reports and playtest receipts retain their own entry, fixture and tested-build scope.'));
            if(!result.entries.length)content.append(el('p','No saved Workbench handoff matches this exact record.'));
            for(const entry of result.entries){
                const section=el('section'),link=el('a','Open source proposal and reports');link.href='#workbench/handoffs/'+entry.id;
                section.append(el('h3',entry.record.label),link,el('p',[entry.source.book,entry.source.prefix,entry.source.pass].filter(Boolean).join(' · ')));
                if(!entry.implementationReports.length)section.append(el('p','Proposal saved; no implementation report attached.'));
                for(const report of entry.implementationReports)section.append(implementationReport(entry,report,null,{attachments:false}));
                content.append(section);
            }
            if(result.unreadable)content.append(el('p',result.unreadable+' saved evidence files could not be read.'));
        }catch{content.textContent='Workbench evidence unavailable. Close and reopen to retry.';}
        finally{loading=false;}
    };
}
