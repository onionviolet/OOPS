import {readFile} from 'node:fs/promises';
const body=await readFile(new URL('./steps/helpers.js',import.meta.url),'utf8')+'\n'+await readFile(new URL('./steps/'+process.argv[2]+'.js',import.meta.url),'utf8');
const response=await fetch('http://127.0.0.1:19121',{method:'POST',body});
const result=await response.json();
console.log(JSON.stringify(result,null,2));
if(!result.ok)process.exitCode=1;
