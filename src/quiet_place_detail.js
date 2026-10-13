// Cosmetic detail from the same known native place/calendar/weather as the UI.
// No objects, rewards, concealed places, alternate clocks or durable lore.
export function quietPlaceText(view) {
    if(!view.knownVillage || view.effects==='off')return '';
    if(view.roofed)return 'The village weather stays outside.';
    if(view.raining)return 'Rain dots the village path.';
    if(view.daylight==='Night')return 'The village path lies in darkness.';
    return 'Daylight falls across the village path.';
}
export function createQuietPlaceDetail({container,before,read}) {
    const detail=document.createElement('small');detail.id='quiet_place_detail';detail.className='quiet-place-detail';
    detail.setAttribute('aria-label','Local atmosphere');container.insertBefore(detail,before||null);
    const render=()=>{const text=quietPlaceText(read());if(detail.textContent!==text)detail.textContent=text;detail.hidden=!text;};
    render();return {render,destroy(){detail.remove();}};
}
