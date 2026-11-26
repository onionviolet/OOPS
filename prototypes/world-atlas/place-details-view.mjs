export const placeClaimLabel = label => ({S:'Shown in source',T:'Told in source',I:'Reader inference',U:'Uncertain reading',P:'Authored proposal'}[label] || 'Evidence label unstated');
// DOM primitives are supplied by the existing Things surface for direct testing.
export function appendPlaceDetails(parent, place, {el,section,entityLink}) {
    const evidence = row => [el('small',placeClaimLabel(row.label)),...(row.locator?[el('small',row.locator)]:[])];
    const rows = (place.crowd || []).map(row=>[row.text,...evidence(row)]);
    if(rows.length) parent.append(section('Crowds',rows));
    const access = (place.accessRecords || []).map(row=>[row.text,...evidence(row)]);
    if(access.length) parent.append(section('Access evidence',access));
    const routes = (place.routes || []).map(row=>[entityLink(row.to),
        el('small',[row.mode,row.minutes===null?'Travel time unstated':`${row.minutes} min`].filter(Boolean).join(' · ')),...evidence(row)]);
    if(routes.length) parent.append(section('Routes in the books',routes));
}
