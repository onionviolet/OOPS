// A worker occupies the actual home owner's spare room, not a workshop copy.
import {homeSupportsRest} from './home_building_model.js';
import {HOME_PLACES as P,HOME_WORLD} from './home_content.js';
export const HOME_WORKERS=Object.freeze({fieldWorksArtisan:'Contract fitter',fieldWorksCourier:'Handcart courier',fieldWorksFreighter:'Road freighter'});
export function validateWorkerRooms(s,check) {
    const used=new Set();
    for(const [id,a] of Object.entries(s.workers||{})){
        check(HOME_WORKERS[id]&&a&&['day','night'].includes(a.shift)&&typeof a.home==='string','invalid worker lodging');
        check(s.properties[a.home]?.improvements.includes('guestroom')&&!used.has(a.home)&&s.lodger?.home!==a.home,'worker lodging conflicts with the actual guest room');used.add(a.home);
    }
}
export function planWorkerRoom(s,request,c,check) {
    const id=request.worker,h=s.properties[request.home];check(HOME_WORKERS[id],'choose a known worker contract');
    s.workers ||= {};
    if(request.type==='worker_release'){check(s.workers[id]?.home===request.home,'this worker has no room here');delete s.workers[id];return `${HOME_WORKERS[id]} returns to the ordinary day contract; the room is free.`;}
    check(c.workers?.[id]?.life==='alive','choose an actual hired living worker');
    check(h?.access&&homeSupportsRest(h)&&h.owner==='player'&&h.tenure==='owned'&&h.improvements.includes('guestroom')&&(P[h.id].world||HOME_WORLD)===c.world&&P[h.id].forms.includes('human'),'offer an accessible owned human guest room');
    check(s.lodger?.home!==h.id&&!Object.entries(s.workers).some(([other,a])=>other!==id&&a.home===h.id),'the guest room already has an occupant');
    check(['day','night'].includes(request.shift),'choose an explicit day or night rota');s.workers[id]={home:h.id,shift:request.shift};
    return `${HOME_WORKERS[id]} takes the guest room and the ${request.shift} rota. Existing room rights and occupancy remain authoritative.`;
}
export function workerLodgingStatus(homes,id,minute) {
    if(!HOME_WORKERS[id])return {valid:true,canStart:true,label:'Binding or station support; no human bed required.'};
    const a=homes?.workers?.[id],h=a&&homes.properties[a.home];
    const valid=!a||!!h&&h.access&&homeSupportsRest(h)&&h.owner==='player'&&h.tenure==='owned'&&h.improvements.includes('guestroom')&&(P[h.id].world||HOME_WORLD)===HOME_WORLD&&P[h.id].forms.includes('human')&&homes.lodger?.home!==h.id;
    const hour=Number.isFinite(minute)?((minute%1440)+1440)%1440/60:null,day=hour==null||hour>=6&&hour<18;
    const canStart=valid&&(a?.shift==='night'?!day:day);
    return {valid,canStart,home:a?.home||null,shift:a?.shift||'day',label:!valid?'Assigned room rights, occupancy or structure no longer supports rest.':`${a?`${h.name||P[h.id].name}; ${a.shift} rota`:'Ordinary commuting day contract'} · ${canStart?'on shift':'resting until the next shift'}. Accepted work finishes across the shift boundary.`};
}
