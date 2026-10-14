export default async function* (source) {
 for await (const event of source) {
  if(event.type==='test:summary') yield JSON.stringify(event)+'\n';
  if(event.type==='test:fail') yield JSON.stringify({type:event.type,file:event.data.file,name:event.data.name,details:{duration_ms:event.data.details?.duration_ms,error:event.data.details?.error?.message}})+'\n';
 }
}
