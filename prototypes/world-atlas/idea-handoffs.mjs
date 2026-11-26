// Backlog-first proposals bind the current admitted owner row, never a fabricated reading.
import {readOwnerIdeas} from './owner-ideas.mjs';
import {saveHandoff} from './reading-handoffs.mjs';

const sha=value=>typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);
function changed(){const error=Error('This owner or exact entry changed. Reopen the idea before saving.');error.status=409;return error;}
function brief(value,name){
    if(typeof value!=='string'||!value.trim()||value.trim().length>500){
        const error=Error('Enter a '+name+' in 500 characters or fewer.');error.status=400;throw error;
    }
    return value.trim();
}

/** page must come from the server's current readOwnerIdeas result, not request data. */
export function prepareIdeaHandoff(request,page){
    if(!request||typeof request!=='object'||Array.isArray(request))throw changed();
    const row=page?.rows?.find(row=>row.id===request.ideaId);
    if(!row||!sha(request.ideaId)||!sha(page.documentHash)||request.documentHash!==page.documentHash||
        request.ownerReference!==row.ownerReference||page.owner?.split('#')[0]!==row.ownerReference||
        row.reference!==row.ownerReference+'#idea-'+row.id||row.citable!==true)throw changed();
    const proposal={backlog:row.reference,change:brief(request.change,'gameplay change'),check:brief(request.check,'playable check')};
    return {schema:'atlas-idea-handoff/1',stage:'proposed',proposal,
        source:{kind:'idea-owner',ownerReference:row.ownerReference,reference:row.reference,ideaId:row.id,
            documentHash:page.documentHash,sourceReference:row.sourceReference,lineStart:row.lineStart,lineEnd:row.lineEnd,section:[...row.section]},
        record:{label:row.title,type:'idea',classification:row.kind,entryLabel:row.entryLabel,code:row.code||null,excerpt:row.excerpt,
            route:'/idea-owner-ideas?'+new URLSearchParams({owner:row.ownerReference,idea:row.id})}};
}

/** Re-read the allowlisted public owner on every submission. Client display text is never admitted. */
export async function saveIdeaHandoff(directory,root,request){
    if(!request||typeof request!=='object'||Array.isArray(request))throw changed();
    const page=readOwnerIdeas(root,request.ownerReference,{idea:request.ideaId});
    const packet=prepareIdeaHandoff(request,page);
    const id=await saveHandoff(directory,packet);
    return {id,schema:packet.schema,status:packet.stage};
}
