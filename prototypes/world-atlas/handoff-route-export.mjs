// Explicit public fields from the loaded queue; no source text or filesystem reads.
const id = value => /^[a-f0-9]{64}$/.test(value || '') ? value : null;
const publicFile = file => {
    const path = file?.path;
    return typeof path === 'string' && /^(?:src|docs)\//.test(path) &&
        !path.includes('\\') && !path.split('/').some(part => ['..','private','private_packs','sealed'].includes(part))
        ? {path,sha256:id(file.sha256)} : null;
};
export function handoffRouteExport(queue, comparison) {
    const build = id(comparison.bundleSha256);
    const compared = new Map((comparison.entries || []).map(row => [row.id,row]));
    const handoffs = queue.map(entry => {
        const counts = compared.get(entry.id);
        return {id:id(entry.id),comparison:counts ? {exact:counts.exact,other:counts.other,unverified:counts.unverified} : null,
            reports:(entry.implementationReports || []).map(report => {
                const states = [report.files?.consumer?.status,report.files?.receipt?.status];
                const sourceStatus = states.includes('changed') ? 'changed' : states.every(state => state === 'unchanged') ? 'unchanged' : 'unknown';
                return {id:id(report.id),playerRoute:report.playerRoute,
                    routeStatus:'Reported manual route; prerequisites and current playability are not checked by this export.',
                    sourceStatus,consumer:publicFile(report.consumer),implementationReceipt:publicFile(report.receipt),
                    playtests:(report.playtests || []).map(proof => ({id:id(proof.id),proof:publicFile(proof.proof),
                        testedBundleSha256:id(proof.testedBundleSha256),
                        comparison:!build || proof.files?.proof?.status !== 'unchanged' ? 'unverified'
                            : proof.testedBundleSha256 === build ? 'exact-match' : 'different-build'}))};
            })};
    });
    return {schema:'atlas-manual-routes/1',bundleSha256:build,
        boundary:'Read-only handoff snapshot. A matching receipt does not establish current source identity, earned prerequisites or a launch command. No gameplay is started.',
        unreadable:comparison.unreadable || 0,
        counts:{handoffsCompared:compared.size,handoffsLoaded:handoffs.length,
            exact:(comparison.entries || []).reduce((sum,row)=>sum+row.exact,0),
            other:(comparison.entries || []).reduce((sum,row)=>sum+row.other,0),
            unverified:(comparison.entries || []).reduce((sum,row)=>sum+row.unverified,0)},handoffs};
}

export function routeExportControl(group, queue, summary) {
    summary.classList.add('handoff-route-export-summary');
    const download = document.createElement('a');download.textContent = 'Export manual routes (JSON)';download.href = '#';
    download.title = 'Download reported routes, build comparison and public evidence references. Does not launch gameplay or check character prerequisites.';
    let comparison;
    download.onclick = event => {
        event.preventDefault();
        if (!comparison) return;
        const url = URL.createObjectURL(new Blob([JSON.stringify(handoffRouteExport(queue,comparison),null,2)+'\n'],{type:'application/json'}));
        const link = document.createElement('a');link.href = url;link.download = 'atlas-manual-routes.json';link.click();
        setTimeout(()=>URL.revokeObjectURL(url),0);
    };
    return {reset(){comparison=null;download.remove();},setComparison(value){comparison=value;summary.append(' ',download);}};
}
