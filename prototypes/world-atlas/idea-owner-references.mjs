// Typed citations stay intact in their packet. Match Markdown references as
// complete tokens, never by substring or by a rule code found inside prose.
export function ownerReferenceTokens(text) {
    if(typeof text!=='string')return [];
    const pattern=/(?<![\p{L}\p{N}_./\\:-])((?:docs\/)?[\p{L}\p{N}_.\/-]+\.md(?:#[\p{L}\p{N}_.%-]+)?)(?![\p{L}\p{N}_./-])/giu;
    return [...new Set([...text.matchAll(pattern)].map(match=>match[1]).filter(reference=>{
        const path=reference.split('#')[0],parts=path.split('/');
        return (parts.length===1||parts[0]==='docs')&&parts.every(part=>part&&part!=='.'&&part!=='..'&&!part.startsWith('.')&&!/private|sealed/i.test(part));
    }))];
}

export function handoffsForOwner(owner,entries,owners) {
    const [path,anchor]=owner.reference.split('#');
    const paths=[...new Set(owners.map(row=>row.reference.split('#')[0]))];
    return entries.filter(entry=>ownerReferenceTokens(entry.proposal?.backlog).some(token=>{
        const [cited,citedAnchor]=token.split('#');
        const candidates=cited.startsWith('docs/')?[cited]:paths.filter(path=>path.split('/').at(-1)===cited);
        return candidates.length===1&&candidates[0]===path&&(!anchor||anchor===citedAnchor);
    }));
}

export const handoffsForIdea=(idea,entries)=>entries.filter(entry=>ownerReferenceTokens(entry.proposal?.backlog).includes(idea.reference));
export const ideaEntryHref=(owner,id)=>'#workbench/ideas/'+encodeURIComponent(owner)+'/'+encodeURIComponent(id);
export function compareIdeaHandoffSource(entry,page) {
    const source=entry?.source,row=page?.rows?.find(row=>row.id===source?.ideaId);
    if(source?.kind!=='idea-owner'||!row||row.ownerReference!==source.ownerReference||row.reference!==source.reference)return 'changed';
    return page.documentHash===source.documentHash?'matched':'owner-changed';
}
