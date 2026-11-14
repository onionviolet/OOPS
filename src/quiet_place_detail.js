import {createPaletteFeedback, cueLineText} from './palette_feedback.js';
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
export const CUE_KEEP_MINUTES=60;
export function createQuietPlaceDetail({container,before,read,readSettings=()=>({effects:read().effects})}) {
    const detail=document.createElement('div'),text=document.createElement('small'),cue=document.createElement('small');detail.id='quiet_place_detail';detail.className='quiet-place-detail';detail.append(text,cue);cue.className='palette-local-cue';
    detail.setAttribute('aria-label','Local atmosphere');container.insertBefore(detail,before||null);
    const feedback=createPaletteFeedback({container:detail,readSettings});let place=null,shown=null,pass=[];
    const drop=()=>{shown=null;pass=[];cue.textContent='';feedback.clear();};
    // The kept line is the only carrier of a cue, so it needs an end: a rain line goes when the rain does, and
    // any cue goes after CUE_KEEP_MINUTES of game time (a default; raise it for a slower narrator).
    const stale=view=>shown&&((shown.cue==='rain-exposed'&&view.raining===false)||(shown.cue==='rain-sheltered'&&view.raining===false)
        ||(Number.isFinite(view.now)&&Number.isFinite(shown.at)&&view.now-shown.at>=CUE_KEEP_MINUTES));
    const render=()=>{const view=read(),next=quietPlaceText(view);if(text.textContent!==next)text.textContent=next;detail.hidden=!next;const key=view.placeId;if(key!==place){place=key;drop();}else if(stale(view))drop();};
    // UIC141: a stylesheet can hide this block while a local task is open; a cue then goes to its panel line, not to a hidden one.
    const present=receipt=>{if(!receipt||detail.hidden||detail.checkVisibility?.()===false)return false;if(!pass.length)queueMicrotask(()=>{pass=[];});const joined=cueLineText(pass,receipt.text);pass=joined.cues;cue.textContent=joined.line;shown={cue:receipt.cue,at:read().now};feedback.presentReceipt(receipt,cue,{caption:false});return true;};
    render();return {node:detail,render,present,clear:drop,destroy(){feedback.destroy();detail.remove();}};
}
