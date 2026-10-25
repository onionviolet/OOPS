// A body's latent affinity is seeded at birth, influenced by its actual inherited
// qualities. Testing reveals it; the same latent properties already affect work.
import {seeded,phenotype} from './lineage_traits.js';
import {check,natural} from './basics.js';
export function drawCultivationRoot(line){
 const self=line.members.find(m=>m.id===line.selfId),p=self?phenotype(self.genes):{wind:0,nerve:0},rng=seeded(`${line.seed}:${line.selfId}:latent-root`);
 return {flow:Math.min(4,Math.floor(rng()*3)+p.wind),still:Math.min(4,Math.floor(rng()*3)+p.nerve),tested:false};
}
export function validateCultivationRoot(r){if(r===undefined)return;check(r&&Object.keys(r).sort().join(',')==='flow,still,tested'&&natural(r.flow)&&r.flow<=4&&natural(r.still)&&r.still<=4&&typeof r.tested==='boolean','Invalid cultivation root.');}
export const rootRateBonus=(root,method)=>root&&method!=='mist'?10*(method==='breath'?root.flow:root.still):0;

// This calibrated solvent redistributes current expression, not inherited alleles.
export function retuneCultivationRoot(root,direction){
 validateCultivationRoot(root);check(root?.tested===true,'Measure this body’s actual affinity before a calibrated transfer.');check(['flow','still'].includes(direction),'Choose a known affinity to strengthen.');const other=direction==='flow'?'still':'flow';check(root[direction]<4&&root[other]>0,'This calibration needs spare expression in the other affinity and room in the chosen one.');return {...root,[direction]:root[direction]+1,[other]:root[other]-1};
}
