import fs from 'node:fs';
import {createDomainRegistry} from '../../../../src/domain_registry.js';
const r=createDomainRegistry();for(let i=0;i<100;i++)r.registerDomain({id:'d'+i,deps:i?['d'+(i-1)]:[],tick:()=>{}});
const times=[];for(let n=0;n<8;n++){const t=performance.now();for(let i=0;i<10000;i++)r.tick(1);if(n>1)times.push(performance.now()-t);}times.sort((a,b)=>a-b);console.log(JSON.stringify({domains:100,calls:10000,medianMs:times[3],minMs:times[0]}));
