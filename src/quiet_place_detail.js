import {createPaletteFeedback} from './palette_feedback.js';
// Cosmetic detail from the same known native place/calendar/weather as the UI.
// No objects, rewards, concealed places, alternate clocks or durable lore.
export function quietPlaceText(view) {
    const knownVillage=view.knownVillage??(view.worldId==='base.frontier'&&view.placeId==='Village');
    if(!knownVillage || view.effects==='off')return '';
    if(view.roofed)return 'The village weather stays outside.';
    if(view.raining)return 'Rain dots the village path.';
    if(view.daylight==='Night')return 'The village path lies in darkness.';
    return 'Daylight falls across the village path.';
}
export function createQuietPlaceDetail({container,before,read,readSettings=()=>({effects:read().effects})}) {
    const detail=document.createElement('div'),text=document.createElement('small'),cue=document.createElement('small');detail.id='quiet_place_detail';detail.className='quiet-place-detail';detail.append(text,cue);cue.className='palette-local-cue';
    detail.setAttribute('aria-label','Local atmosphere');container.insertBefore(detail,before||null);
    const feedback=createPaletteFeedback({container:detail,readSettings});let place=null;
    const render=()=>{const view=read(),next=quietPlaceText(view);if(text.textContent!==next)text.textContent=next;detail.hidden=!next;const key=view.placeId;if(key!==place){place=key;cue.textContent='';feedback.clear();}};
    const present=receipt=>{if(!receipt||detail.hidden)return false;cue.textContent=receipt.text;feedback.presentReceipt(receipt,text);return true;};
    render();return {node:detail,render,present,clear(){cue.textContent='';feedback.clear();},destroy(){feedback.destroy();detail.remove();}};
}
