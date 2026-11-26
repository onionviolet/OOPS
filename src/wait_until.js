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
export function createWaitUntil(id,{read,options,advance,blocked=()=>'',nextBoundary=()=>null}){
 const initial=read(),quote=options(initial).find(o=>o.id===id);
 if(!quote)throw Error('That time is no longer offered. Choose a current wait time.');
 if(quote.eligible===false)throw Error(quote.reasons?.join(' ')||'Waiting is unavailable now.');
 const origin=initial.place,start=initial.clock;let singleMinute=false,result=null,lastClock=start;
 const view=()=>{const clock=result?start+result.minutes:read().clock;return {...result,done:!!result,minutes:clock-start,target:quote.at,remaining:Math.max(0,quote.at-clock)};};
 const stop=reason=>{result={minutes:read().clock-start,interrupted:true,reason};return view();};
 function step(maxMinutes=Infinity){
  if(result)return view();
  if(maxMinutes!==Infinity&&(!Number.isSafeInteger(maxMinutes)||maxMinutes<1))throw Error('A positive wait step is required.');
  const before=read(),reason=blocked();
  if(before.clock<lastClock)return stop('The current life changed.');
  if(reason||before.place!==origin)return stop(reason||'You left the waiting place.');
  if(before.clock>=quote.at){result={minutes:before.clock-start,interrupted:false,reason:''};return view();}
  const boundary=nextBoundary(before,quote.at);
  if(boundary!=null&&(!Number.isSafeInteger(boundary)||boundary<=before.clock||boundary>quote.at))throw Error('Invalid waiting boundary.');
  const requested=Math.min(maxMinutes,singleMinute?1:(boundary??quote.at)-before.clock);
  const returned=advance(requested),after=read(),consumed=after.clock-before.clock;
  if(!Number.isSafeInteger(consumed)||consumed<0||consumed>requested)throw Error('The game clock advanced beyond the requested wait.');
  lastClock=after.clock;
  if(!consumed)return stop('Time is paused by a local decision.');
  if(consumed!==requested||(typeof returned==='number'&&returned!==requested))singleMinute=true;
  const stopped=blocked();
  if(stopped||after.place!==origin)return stop(stopped||'You left the waiting place.');
  if(after.clock>=quote.at)result={minutes:after.clock-start,interrupted:false,reason:''};
  return view();
 }
 return {step,stop,view};
}
// Synchronous callers retain their event-sized steps. The player UI uses the
// same controller in minute-sized tasks, yielding input/paint between commits.
export function runWaitUntil(id,ports){
 const waiting=createWaitUntil(id,ports);let result;
 do{result=waiting.step();}while(!result.done);
 return {minutes:result.minutes,interrupted:result.interrupted,reason:result.reason};
}
export async function scheduleWaitUntil(waiting,{yieldControl=()=>new Promise(resolve=>setTimeout(resolve,0)),onProgress=()=>{}}={}){
 onProgress(waiting.view());
 while(!waiting.view().done){
  await yieldControl();
  if(waiting.view().done)break;
  onProgress(waiting.step(1));
 }
 const result=waiting.view();
 return {minutes:result.minutes,interrupted:result.interrupted,reason:result.reason};
}
