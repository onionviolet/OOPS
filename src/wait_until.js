// A quote over the caller's existing clock. No saved timer or clock mutation.
import {TIME_BANDS} from './cast_schedule.js';
export function waitUntilOptions(clock,{epoch=0,appointments=[]}={}){
 if(!Number.isSafeInteger(clock)||clock<epoch)throw Error('A current game minute is required.');
 const day=Math.floor((clock-epoch)/1440),minute=(clock-epoch)%1440;
 const bands=Object.entries(TIME_BANDS).map(([label,{from}])=>({id:`band.${label}`,label,
  at:epoch+day*1440+from+(from<=minute?1440:0)}));
 const next=bands.reduce((a,b)=>a.at<b.at?a:b);
 return [next,...appointments.filter(a=>a.known===true&&Number.isSafeInteger(a.at)&&a.at>clock)]
  .map(a=>({id:`wait.until.${a.at}`,at:a.at,duration:a.at-clock,
   label:`Wait until ${a.label} · ${a.at-clock} min`,eligible:true,reasons:[]}));
}
// Stop at supplied event boundaries so the existing clock owner settles each
// event at its actual minute. If that owner clips a step, use single minutes.
export function runWaitUntil(id,{read,options,advance,blocked=()=>'',nextBoundary=()=>null}){
 const initial=read(),quote=options(initial).find(o=>o.id===id);
 if(!quote)throw Error('That time is no longer offered. Choose a current wait time.');
 if(quote.eligible===false)throw Error(quote.reasons?.join(' ')||'Waiting is unavailable now.');
 const origin=initial.place,start=initial.clock;let singleMinute=false;
 while(read().clock<quote.at){
  const before=read(),reason=blocked();
  if(reason||before.place!==origin)return {minutes:before.clock-start,interrupted:true,reason:reason||'You left the waiting place.'};
  const boundary=nextBoundary(before,quote.at);
  if(boundary!=null&&(!Number.isSafeInteger(boundary)||boundary<=before.clock||boundary>quote.at))throw Error('Invalid waiting boundary.');
  const requested=singleMinute?1:(boundary??quote.at)-before.clock;
  const returned=advance(requested);
  const after=read();
  if(after.clock===before.clock)return {minutes:after.clock-start,interrupted:true,reason:'Time is paused by a local decision.'};
  const consumed=after.clock-before.clock;
  if(!Number.isSafeInteger(consumed)||consumed<0||consumed>requested)throw Error('The game clock advanced beyond the requested wait.');
  if(consumed!==requested||(typeof returned==='number'&&returned!==requested))singleMinute=true;
  const stopped=blocked();
  if(stopped||after.place!==origin)return {minutes:after.clock-start,interrupted:true,reason:stopped||'You left the waiting place.'};
 }
 return {minutes:read().clock-start,interrupted:false,reason:''};
}
