// Registration supplies alternatives only for an exact reviewed alias with
// preserveCurrent. Content and starting snapshot must come from the same edition.
export function structuredSelectionIdentity(d, selection, start) {
    if(d.contentHash===selection.contentHash&&start.snapshotHash===selection.snapshotHash)return true;
    return d.identityAlternatives?.some(edition=>edition.contentHash===selection.contentHash
        &&edition.starts.some(row=>row.id===start.id&&row.snapshotHash===selection.snapshotHash))===true;
}
