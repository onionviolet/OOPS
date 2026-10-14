import {parentPort,workerData} from 'node:worker_threads';
import {runPlanner,classify} from '../../src/invention_qa.js';
import {shrinkCase} from './invention_qa.mjs';
const {input,action}=workerData;
if(action==='hang')for(;;){}
else if(action==='shrink')parentPort.postMessage(shrinkCase(input.case,(_,r)=>classify(r,input.profile).some(f=>f.ruleId===input.ruleId)));
else parentPort.postMessage(runPlanner(input));
