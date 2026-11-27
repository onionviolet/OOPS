// Native acceptance workers must stop before their disposable source is removed.
import {execFile} from 'node:child_process';

export function runFixtureWorker(file,args,{signal,timeout,...options}={}) {
 return new Promise((resolve,reject)=>{
  let result,stopped,terminating=Promise.resolve();
  const child=execFile(file,args,{...options,windowsHide:true,detached:process.platform!=='win32'},(error,stdout,stderr)=>{
   result={error,stdout,stderr};
  });
  const stop=(code,message)=>{
   if(stopped)return;
   stopped=Object.assign(new Error(message),{code});
   if(process.platform==='win32') {
    terminating=new Promise(done=>execFile('taskkill',['/PID',String(child.pid),'/T','/F'],{windowsHide:true},()=>done()));
   } else {
    try{process.kill(-child.pid,'SIGKILL');}catch(error){if(error.code!=='ESRCH')child.kill('SIGKILL');}
   }
  };
  const abort=()=>stop('ABORT_ERR','Fixture worker aborted.');
  const timer=timeout?setTimeout(()=>stop('ETIMEDOUT',`Fixture worker timed out after ${timeout}ms.`),timeout):null;
  signal?.addEventListener('abort',abort,{once:true});
  if(signal?.aborted)abort();
  child.once('close',async()=>{
   clearTimeout(timer);signal?.removeEventListener('abort',abort);
   await terminating;
   const {error,stdout='',stderr=''}=result||{};
   if(stopped||error)reject(Object.assign(stopped||error,{stdout,stderr}));
   else resolve({stdout,stderr});
  });
 });
}
